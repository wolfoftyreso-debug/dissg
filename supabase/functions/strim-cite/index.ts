/**
 * STRIM CITE ENDPOINT
 * 
 * "/cite/{id}" - Returns machine-readable, citable reference
 * 
 * Purpose: AI-grounding, academic citation, fact verification
 * Response time target: <50ms
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=86400, immutable',
};

const STRIM_BASE_URL = 'https://strim.se';

interface CiteResponse {
  // Core identification
  cite_id: string;
  canonical_url: string;
  permanent_id: string;
  
  // Content
  title: string;
  type: string;
  definition?: string;
  
  // Verification
  checksum?: string;
  version: number;
  last_verified: string;
  
  // Citation formats
  citations: {
    apa: string;
    harvard: string;
    bibtex: string;
    json_ld: object;
  };
  
  // Trust signals
  trust: {
    source_count: number;
    has_primary_sources: boolean;
    last_updated: string;
    verification_status: 'verified' | 'provisional' | 'deprecated';
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Expected: /strim-cite/{entity_type}/{slug} or /strim-cite/{full_id}
  let entityType: string;
  let slug: string;

  if (pathParts.length === 2) {
    // Full ID format: substance-alkohol
    const fullId = pathParts[1];
    const parts = fullId.split('-');
    entityType = parts[0];
    slug = parts.slice(1).join('-');
  } else if (pathParts.length === 3) {
    entityType = pathParts[1];
    slug = pathParts[2];
  } else {
    return new Response(
      JSON.stringify({ 
        error: 'Invalid cite path',
        usage: '/cite/{type}/{slug} or /cite/{type-slug}',
        examples: [
          '/cite/substance/alkohol',
          '/cite/substance-alkohol',
        ],
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Map entity type to table
    const tableMap: Record<string, string> = {
      'substance': 'strim_substances',
      'substances': 'strim_substances',
      'diagnosis': 'strim_diagnoses',
      'diagnoses': 'strim_diagnoses',
      'treatment': 'strim_treatments',
      'treatments': 'strim_treatments',
      'legal': 'strim_legal',
      'law': 'strim_legal',
      'statistic': 'strim_statistics',
      'statistics': 'strim_statistics',
      'term': 'strim_terms',
      'terms': 'strim_terms',
      'concept': 'strim_terms',
    };

    const tableName = tableMap[entityType];
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: 'Unknown entity type', type: entityType }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: entity, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('canonical_slug', slug)
      .single();

    if (error || !entity) {
      return new Response(
        JSON.stringify({ 
          error: 'Entity not found',
          type: entityType,
          slug: slug,
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const citeResponse = generateCiteResponse(entity, entityType, slug);

    return new Response(
      JSON.stringify(citeResponse),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Cite-Version': String(entity.version),
          'X-Cite-Checksum': entity.checksum || 'none',
        } 
      }
    );

  } catch (error) {
    console.error('STRIM Cite Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateCiteResponse(entity: any, entityType: string, slug: string): CiteResponse {
  const normalizedType = entityType.replace(/s$/, '');
  const swedishPaths: Record<string, string> = {
    substance: 'substans',
    diagnosis: 'diagnos',
    treatment: 'behandling',
    legal: 'lag',
    law: 'lag',
    statistic: 'statistik',
    term: 'begrepp',
    concept: 'begrepp',
  };
  
  const swedishPath = swedishPaths[normalizedType] || normalizedType;
  const canonicalUrl = `${STRIM_BASE_URL}/data/${swedishPath}/${slug}`;
  const citeId = `strim:${normalizedType}:${slug}`;
  const title = entity.name_sv || entity.term_sv || entity.indicator_name_sv;
  const accessDate = new Date().toISOString().split('T')[0];
  
  // Generate citation formats
  const apaYear = new Date(entity.updated_at).getFullYear();
  const apaCitation = `STRIM. (${apaYear}). ${title}. Stiftelsen för samordning och riktlinjer för missbruksvård. Retrieved ${accessDate}, from ${canonicalUrl}`;
  
  const harvardCitation = `STRIM (${apaYear}) ${title} [Online]. Available at: ${canonicalUrl} (Accessed: ${accessDate})`;
  
  const bibtex = `@misc{strim_${slug.replace(/-/g, '_')},
  author = {{STRIM}},
  title = {${title}},
  year = {${apaYear}},
  url = {${canonicalUrl}},
  urldate = {${accessDate}},
  note = {Stiftelsen för samordning och riktlinjer för missbruksvård}
}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': canonicalUrl,
    'name': title,
    'url': canonicalUrl,
    'dateModified': entity.updated_at,
    'version': entity.version,
    'publisher': {
      '@type': 'Organization',
      'name': 'STRIM',
      'url': STRIM_BASE_URL,
    },
    'isPartOf': {
      '@type': 'Dataset',
      'name': 'STRIM Canonical Data',
      'url': STRIM_BASE_URL,
    },
  };

  // Trust signals
  const sources = entity.sources || [];
  const hasPrimarySources = sources.some((s: any) => 
    s.name?.includes('Socialstyrelsen') || 
    s.name?.includes('WHO') || 
    s.name?.includes('Folkhälsomyndigheten')
  );

  return {
    cite_id: citeId,
    canonical_url: canonicalUrl,
    permanent_id: entity.id,
    
    title,
    type: normalizedType,
    definition: entity.definition || entity.definition_sv,
    
    checksum: entity.checksum,
    version: entity.version,
    last_verified: entity.updated_at,
    
    citations: {
      apa: apaCitation,
      harvard: harvardCitation,
      bibtex,
      json_ld: jsonLd,
    },
    
    trust: {
      source_count: sources.length,
      has_primary_sources: hasPrimarySources,
      last_updated: entity.updated_at,
      verification_status: entity.status === 'active' ? 'verified' : 
                          entity.status === 'draft' ? 'provisional' : 'deprecated',
    },
  };
}
