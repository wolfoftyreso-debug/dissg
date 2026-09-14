/**
 * Block 58: Canonical API
 * 
 * Read-only API for facts, indicators, observations.
 * Always versioned, always citable, always with uncertainty.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=300', // 5 min cache
};

const BASE_URL =
  Deno.env.get('PUBLIC_APP_URL') ||
  Deno.env.get('CANONICAL_BASE_URL') ||
  'http://localhost:8080';

interface CanonicalResponse<T> {
  data: T;
  meta: {
    version: string;
    generated_at: string;
    cache_until: string;
    citation_url: string;
  };
}

function buildCitationUrl(entityType: string, entityId: string): string {
  return `${BASE_URL}/cite/${entityType}/${entityId}`;
}

function buildCanonicalResponse<T>(data: T, entityType: string, entityId: string): CanonicalResponse<T> {
  const now = new Date();
  const cacheUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
  
  return {
    data,
    meta: {
      version: '1.0.0',
      generated_at: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
      citation_url: buildCitationUrl(entityType, entityId),
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Remove 'canonical-api' from path
    const entityType = pathParts[1] || '';
    const entityId = pathParts[2];
    
    // GET /facts
    if (entityType === 'facts' && !entityId) {
      const geoLevel = url.searchParams.get('geo_level');
      const geoCode = url.searchParams.get('geo_code');
      const indicatorId = url.searchParams.get('indicator_id');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
      const offset = parseInt(url.searchParams.get('offset') || '0');
      
      let query = supabase
        .from('canonical_facts')
        .select(`
          *,
          kpi_definitions!inner(code, name, unit, category)
        `)
        .eq('is_active', true)
        .order('generated_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (geoLevel) query = query.eq('geo_level', geoLevel);
      if (geoCode) query = query.eq('geo_code', geoCode);
      if (indicatorId) query = query.eq('indicator_id', indicatorId);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(buildCanonicalResponse(
          {
            facts: data?.map(f => ({
              fact_code: f.fact_code,
              statement: f.statement,
              indicator: {
                code: f.kpi_definitions.code,
                name: f.kpi_definitions.name,
                unit: f.kpi_definitions.unit,
              },
              geo: {
                level: f.geo_level,
                code: f.geo_code,
              },
              time_range: {
                start: f.time_range_start,
                end: f.time_range_end,
              },
              trend: {
                direction: f.trend_direction,
                magnitude: f.trend_magnitude,
              },
              uncertainty: f.uncertainty,
              method: f.method,
              version: f.version,
              citation_url: buildCitationUrl('fact', f.fact_code),
            })),
            pagination: { limit, offset, total: count || 0 },
          },
          'facts',
          'list'
        )),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET /facts/:fact_code
    if (entityType === 'facts' && entityId) {
      const { data, error } = await supabase
        .from('canonical_facts')
        .select(`
          *,
          kpi_definitions!inner(code, name, unit, category, description),
          fact_sources(
            source_id,
            data_sources(code, name, source_type, reliability_score)
          )
        `)
        .eq('fact_code', entityId)
        .eq('is_active', true)
        .single();
      
      if (error) {
        return new Response(
          JSON.stringify({ error: 'Fact not found', code: entityId }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify(buildCanonicalResponse(
          {
            fact_code: data.fact_code,
            statement: data.statement,
            indicator: {
              code: data.kpi_definitions.code,
              name: data.kpi_definitions.name,
              unit: data.kpi_definitions.unit,
              description: data.kpi_definitions.description,
            },
            geo: {
              level: data.geo_level,
              code: data.geo_code,
            },
            time_range: {
              start: data.time_range_start,
              end: data.time_range_end,
            },
            trend: {
              direction: data.trend_direction,
              magnitude: data.trend_magnitude,
            },
            uncertainty: data.uncertainty,
            method: data.method,
            sources: data.fact_sources?.map((fs: any) => ({
              code: fs.data_sources?.code,
              name: fs.data_sources?.name,
              type: fs.data_sources?.source_type,
              reliability: fs.data_sources?.reliability_score,
            })),
            version: data.version,
            generated_at: data.generated_at,
          },
          'fact',
          data.fact_code
        )),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET /indicators
    if (entityType === 'indicators' && !entityId) {
      const category = url.searchParams.get('category');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 200);
      
      let query = supabase
        .from('kpi_definitions')
        .select('*')
        .eq('is_active', true)
        .order('code');
      
      if (category) query = query.eq('category', category);
      
      const { data, error } = await query.limit(limit);
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(buildCanonicalResponse(
          {
            indicators: data?.map(i => ({
              id: i.id,
              code: i.code,
              name: i.name,
              description: i.description,
              unit: i.unit,
              category: i.category,
              method_notes: i.methodology_url,
              citation_url: buildCitationUrl('indicator', i.code),
            })),
          },
          'indicators',
          'list'
        )),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET /observations
    if (entityType === 'observations' && !entityId) {
      const indicatorId = url.searchParams.get('indicator_id');
      const geoCode = url.searchParams.get('geo_code');
      const periodStart = url.searchParams.get('period_start');
      const periodEnd = url.searchParams.get('period_end');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);
      
      let query = supabase
        .from('kpi_values')
        .select(`
          *,
          kpi_definitions!inner(code, name, unit)
        `)
        .eq('is_provisional', false)
        .order('period_start', { ascending: false })
        .limit(limit);
      
      if (indicatorId) query = query.eq('kpi_id', indicatorId);
      if (geoCode) query = query.eq('region_code', geoCode);
      if (periodStart) query = query.gte('period_start', periodStart);
      if (periodEnd) query = query.lte('period_end', periodEnd);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(buildCanonicalResponse(
          {
            observations: data?.map(o => ({
              id: o.id,
              indicator: {
                code: o.kpi_definitions.code,
                name: o.kpi_definitions.name,
                unit: o.kpi_definitions.unit,
              },
              geo_code: o.region_code || 'SE',
              period: {
                start: o.period_start,
                end: o.period_end,
              },
              value: o.value,
              previous_value: o.previous_value,
              trend: o.trend,
              trend_percent: o.trend_percent,
              confidence: o.confidence,
              status: o.status,
            })),
          },
          'observations',
          'list'
        )),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET /big-questions
    if (entityType === 'big-questions') {
      const scope = url.searchParams.get('scope') || 'global';
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 20);
      
      let query = supabase
        .from('big_question_rankings')
        .select(`
          *,
          big_questions!inner(code, question_text, category, short_description)
        `)
        .order('rank_position', { ascending: true })
        .limit(limit);
      
      if (scope !== 'global' && scope.startsWith('country:')) {
        const countryCode = scope.replace('country:', '');
        query = query.eq('country_code', countryCode);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(buildCanonicalResponse(
          {
            questions: data?.map(q => ({
              rank: q.rank_position,
              code: q.big_questions.code,
              question: q.big_questions.question_text,
              category: q.big_questions.category,
              description: q.big_questions.short_description,
              importance_score: q.importance_score,
              rank_change: q.rank_change,
              period: {
                start: q.period_start,
                end: q.period_end,
              },
              citation_url: buildCitationUrl('question', q.big_questions.code),
            })),
            scope,
          },
          'big-questions',
          scope
        )),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // GET /cite/:entity_type/:entity_id
    if (entityType === 'cite') {
      const citeType = pathParts[2];
      const citeId = pathParts[3];
      
      if (!citeType || !citeId) {
        return new Response(
          JSON.stringify({ error: 'Citation requires entity type and ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Generate citation in multiple formats
      const citationDate = new Date().toISOString().split('T')[0];
      const citationUrl = `${BASE_URL}/cite/${citeType}/${citeId}`;
      
      return new Response(
        JSON.stringify({
          citation: {
            entity_type: citeType,
            entity_id: citeId,
            url: citationUrl,
            accessed_at: new Date().toISOString(),
            formats: {
              text: `SystemData. "${citeId}". Retrieved ${citationDate} from ${citationUrl}`,
              bibtex: `@misc{systemdata_${citeId.toLowerCase().replace(/[^a-z0-9]/g, '_')},
  title = {${citeId}},
  author = {SystemData},
  year = {${new Date().getFullYear()}},
  url = {${citationUrl}},
  note = {Accessed: ${citationDate}}
}`,
              apa: `SystemData. (${new Date().getFullYear()}). ${citeId}. Retrieved ${citationDate}, from ${citationUrl}`,
            },
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Unknown endpoint',
        available_endpoints: [
          '/facts',
          '/facts/:fact_code',
          '/indicators',
          '/observations',
          '/big-questions',
          '/cite/:entity_type/:entity_id',
        ],
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Canonical API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
