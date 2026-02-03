/**
 * STRIM OPEN DATA API
 * 
 * "Öppet. Läsbart. Ingen auth. Ingen tracking. Cachebart."
 * 
 * This edge function provides read-only access to all STRIM entities
 * with JSON-LD and Schema.org markup for Google Knowledge Graph.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

const STRIM_BASE_URL = 'https://strim.se';

// Schema.org type mappings
const SCHEMA_ORG_TYPES: Record<string, string> = {
  substance: 'Drug',
  diagnosis: 'MedicalCondition',
  treatment: 'MedicalTherapy',
  legal: 'Legislation',
  statistic: 'Dataset',
  term: 'DefinedTerm',
};

// Swedish relation labels
const RELATION_LABELS: Record<string, string> = {
  causes: 'orsakar',
  treated_by: 'behandlas_med',
  regulated_by: 'regleras_av',
  affects: 'påverkar',
  measures: 'mäts_av',
  defines: 'beskrivs_av',
  related_to: 'relaterar_till',
  replaced_by: 'ersätts_av',
  part_of: 'del_av',
  contraindicates: 'kontraindikerar',
};

interface APIResponse {
  meta: {
    version: string;
    timestamp: string;
    total_count?: number;
    page?: number;
    per_page?: number;
    cache_ttl: number;
  };
  data: unknown;
  jsonld?: unknown;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. STRIM API is read-only.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Expected path: /strim-api/v1/{entity_type}/{slug?}
  const _version = pathParts[1] || 'v1';
  const entityType = pathParts[2];
  const slug = pathParts[3];

  // Query params
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = Math.min(parseInt(url.searchParams.get('per_page') || '50'), 100);
  const includeJsonLd = url.searchParams.get('jsonld') !== 'false';
  const includeRelations = url.searchParams.get('relations') !== 'false';

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Route handling
    if (!entityType) {
      // Root: return API documentation
      return new Response(
        JSON.stringify(getAPIDocumentation()),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Map entity type to table
    const tableMap: Record<string, string> = {
      'entities': 'all',
      'substances': 'strim_substances',
      'diagnoses': 'strim_diagnoses',
      'treatments': 'strim_treatments',
      'legal': 'strim_legal',
      'laws': 'strim_legal',
      'statistics': 'strim_statistics',
      'terms': 'strim_terms',
      'concepts': 'strim_terms',
    };

    const tableName = tableMap[entityType];
    if (!tableName) {
      return new Response(
        JSON.stringify({ 
          error: 'Unknown entity type',
          available_types: Object.keys(tableMap),
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Special case: all entities
    if (tableName === 'all') {
      const allEntities = await getAllEntities(supabase, page, perPage);
      return new Response(
        JSON.stringify(allEntities),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Single entity by slug
    if (slug) {
      const entity = await getEntityBySlug(supabase, tableName, slug, includeRelations);
      if (!entity) {
        return new Response(
          JSON.stringify({ error: 'Entity not found', slug }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response: APIResponse = {
        meta: {
          version: 'v1',
          timestamp: new Date().toISOString(),
          cache_ttl: 3600,
        },
        data: formatEntity(entity, entityType),
      };

      if (includeJsonLd) {
        response.jsonld = generateJsonLd(entity, entityType);
      }

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // List entities
    const { data, count } = await getEntities(supabase, tableName, page, perPage);
    
    const response: APIResponse = {
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
        total_count: count || 0,
        page,
        per_page: perPage,
        cache_ttl: 3600,
      },
      data: (data || []).map((e: Record<string, unknown>) => formatEntity(e, entityType)),
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('STRIM API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getAPIDocumentation() {
  return {
    name: 'STRIM Open Data API',
    version: 'v1',
    description: 'Read-only access to STRIM canonical data entities',
    base_url: `${STRIM_BASE_URL}/api/strim-api/v1`,
    endpoints: {
      '/entities': 'List all entity types with counts',
      '/substances': 'List all substances',
      '/substances/{slug}': 'Get substance by slug',
      '/diagnoses': 'List all diagnoses',
      '/diagnoses/{slug}': 'Get diagnosis by slug',
      '/treatments': 'List all treatment methods',
      '/treatments/{slug}': 'Get treatment by slug',
      '/legal': 'List all legal frameworks',
      '/legal/{slug}': 'Get legal framework by slug',
      '/statistics': 'List all statistics',
      '/statistics/{slug}': 'Get statistic by slug',
      '/terms': 'List all terms/concepts',
      '/terms/{slug}': 'Get term by slug',
    },
    query_params: {
      page: 'Page number (default: 1)',
      per_page: 'Items per page (default: 50, max: 100)',
      jsonld: 'Include JSON-LD markup (default: true)',
      relations: 'Include related entities (default: true)',
    },
    license: 'CC BY 4.0',
    attribution: 'STRIM - Stiftelsen för samordning och riktlinjer för missbruksvård',
    documentation: `${STRIM_BASE_URL}/docs/api`,
  };
}

async function getAllEntities(supabase: any, _page: number, _perPage: number) {
  const tables = [
    { name: 'strim_substances', type: 'substances' },
    { name: 'strim_diagnoses', type: 'diagnoses' },
    { name: 'strim_treatments', type: 'treatments' },
    { name: 'strim_legal', type: 'legal' },
    { name: 'strim_statistics', type: 'statistics' },
    { name: 'strim_terms', type: 'terms' },
  ];

  const counts = await Promise.all(
    tables.map(async ({ name, type }) => {
      const { count } = await supabase
        .from(name)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      return { type, count: count || 0 };
    })
  );

  return {
    meta: {
      version: 'v1',
      timestamp: new Date().toISOString(),
      cache_ttl: 3600,
    },
    data: {
      entity_types: counts,
      total_entities: counts.reduce((sum, c) => sum + c.count, 0),
    },
  };
}

async function getEntities(supabase: any, tableName: string, page: number, perPage: number) {
  const offset = (page - 1) * perPage;
  
  return await supabase
    .from(tableName)
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);
}

async function getEntityBySlug(
  supabase: any, 
  tableName: string, 
  slug: string,
  includeRelations: boolean
) {
  const { data } = await supabase
    .from(tableName)
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (!data || !includeRelations) {
    return data;
  }

  // Get relations
  const { data: relations } = await supabase
    .from('strim_relations')
    .select('*')
    .or(`source_slug.eq.${slug},target_slug.eq.${slug}`);

  return { ...data, relations: relations || [] };
}

function formatEntity(entity: any, entityType: string) {
  const typeMapping: Record<string, string> = {
    substances: 'Substance',
    diagnoses: 'Diagnosis',
    treatments: 'Treatment',
    legal: 'Legal',
    laws: 'Legal',
    statistics: 'Statistic',
    terms: 'Term',
    concepts: 'Term',
  };

  const formatted: any = {
    type: typeMapping[entityType] || entityType,
    strim_id: `${entityType.slice(0, -1)}-${entity.canonical_slug}`,
    canonical_url: `${STRIM_BASE_URL}/data/${getSwedishPath(entityType)}/${entity.canonical_slug}`,
    name: entity.name_sv || entity.term_sv || entity.indicator_name_sv,
    name_en: entity.name_en || entity.term_en || entity.indicator_name_en,
    slug: entity.canonical_slug,
    status: entity.status,
    version: entity.version,
    last_updated: entity.updated_at,
    sources: entity.sources,
  };

  // Add type-specific fields
  if (entityType === 'substances') {
    formatted.classification = entity.classification_primary;
    formatted.risk_profile = {
      dependence: entity.dependence_potential,
      overdose: entity.overdose_risk,
      overall: entity.risk_category,
    };
    formatted.legal_status = entity.current_legal_status;
  }

  if (entityType === 'diagnoses') {
    formatted.definition = entity.definition;
    formatted.icd_10 = entity.icd_10_code;
    formatted.dsm_5 = entity.dsm_5_code;
  }

  if (entityType === 'treatments') {
    formatted.method_type = entity.method_type;
    formatted.evidence_level = entity.evidence_level;
  }

  if (entityType === 'statistics') {
    formatted.unit = entity.unit;
    formatted.data_source = entity.data_source;
    formatted.trend = entity.trend_direction;
  }

  // Add relations if present
  if (entity.relations && entity.relations.length > 0) {
    formatted.related_entities = entity.relations.map((rel: any) => ({
      relation: RELATION_LABELS[rel.relation_type] || rel.relation_type,
      relation_code: rel.relation_type,
      target: rel.source_slug === entity.canonical_slug 
        ? `${rel.target_type}-${rel.target_slug}`
        : `${rel.source_type}-${rel.source_slug}`,
      direction: rel.source_slug === entity.canonical_slug ? 'outgoing' : 'incoming',
    }));
  }

  return formatted;
}

function getSwedishPath(entityType: string): string {
  const paths: Record<string, string> = {
    substances: 'substans',
    diagnoses: 'diagnos',
    treatments: 'behandling',
    legal: 'lag',
    laws: 'lag',
    statistics: 'statistik',
    terms: 'begrepp',
    concepts: 'begrepp',
  };
  return paths[entityType] || entityType;
}

function generateJsonLd(entity: any, entityType: string) {
  const schemaType = SCHEMA_ORG_TYPES[entityType.replace(/s$/, '')] || 'Thing';
  const swedishPath = getSwedishPath(entityType);
  
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${STRIM_BASE_URL}/data/${swedishPath}/${entity.canonical_slug}`,
    'name': entity.name_sv || entity.term_sv || entity.indicator_name_sv,
    'url': `${STRIM_BASE_URL}/data/${swedishPath}/${entity.canonical_slug}`,
    'inLanguage': 'sv',
    'dateModified': entity.updated_at,
    'isPartOf': {
      '@type': 'Dataset',
      'name': 'STRIM',
      'url': STRIM_BASE_URL,
      'creator': {
        '@type': 'Organization',
        'name': 'Stiftelsen för samordning och riktlinjer för missbruksvård',
        'url': STRIM_BASE_URL,
      },
    },
  };

  // Add type-specific schema
  if (schemaType === 'Drug') {
    jsonLd.drugClass = entity.classification_primary;
    if (entity.pharmacology?.mechanism_of_action) {
      jsonLd.mechanismOfAction = entity.pharmacology.mechanism_of_action;
    }
  }

  if (schemaType === 'MedicalCondition') {
    jsonLd.description = entity.definition;
    if (entity.icd_10_code) {
      jsonLd.code = {
        '@type': 'MedicalCode',
        'codeValue': entity.icd_10_code,
        'codingSystem': 'ICD-10',
      };
    }
  }

  if (schemaType === 'Dataset') {
    jsonLd.measurementTechnique = entity.unit;
    jsonLd.temporalCoverage = `${entity.first_available_year}/${entity.last_available_year}`;
    jsonLd.spatialCoverage = entity.geography_level;
  }

  // Add sources as citations
  if (entity.sources && entity.sources.length > 0) {
    jsonLd.citation = entity.sources.map((s: any) => ({
      '@type': 'CreativeWork',
      'name': s.name,
      'url': s.url,
    }));
  }

  return jsonLd;
}
