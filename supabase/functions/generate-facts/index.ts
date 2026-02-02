/**
 * Block 58: Fact Generation Engine
 * 
 * Automatically generates facts from observations.
 * Uses templates, never interprets.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FactGenerationRequest {
  source_id?: string;
  indicator_id?: string;
  geo_code?: string;
  force_regenerate?: boolean;
}

interface FactTemplate {
  id: string;
  template_code: string;
  language_code: string;
  trend_type: string;
  template_text: string;
  variables_required: string[];
}

function determineTrend(values: number[]): { direction: 'up' | 'down' | 'stable' | 'unknown'; magnitude: number } {
  if (values.length < 2) {
    return { direction: 'unknown', magnitude: 0 };
  }
  
  const first = values[0];
  const last = values[values.length - 1];
  
  if (first === 0) {
    return { direction: last > 0 ? 'up' : last < 0 ? 'down' : 'stable', magnitude: 0 };
  }
  
  const change = ((last - first) / Math.abs(first)) * 100;
  
  if (Math.abs(change) < 2) {
    return { direction: 'stable', magnitude: change };
  }
  
  return {
    direction: change > 0 ? 'up' : 'down',
    magnitude: change,
  };
}

function applyTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

function generateFactCode(indicatorCode: string, geoCode: string, startYear: number, endYear: number): string {
  return `FACT-${indicatorCode.toUpperCase()}-${geoCode.toUpperCase()}-${startYear}-${endYear}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    if (req.method === 'POST') {
      const body: FactGenerationRequest = await req.json();
      
      // Get templates
      const { data: templates, error: templatesError } = await supabase
        .from('fact_templates')
        .select('*')
        .eq('is_active', true);
      
      if (templatesError) throw templatesError;
      
      const templateMap = new Map<string, FactTemplate>();
      for (const t of templates || []) {
        templateMap.set(`${t.trend_type}_${t.language_code}`, t);
      }
      
      // Build query for KPI values
      let query = supabase
        .from('kpi_values')
        .select(`
          *,
          kpi_definitions!inner(id, code, name, unit, category)
        `)
        .eq('is_provisional', false)
        .order('period_start', { ascending: true });
      
      if (body.indicator_id) {
        query = query.eq('kpi_id', body.indicator_id);
      }
      
      if (body.geo_code) {
        query = query.eq('region_code', body.geo_code);
      }
      
      const { data: observations, error: obsError } = await query;
      
      if (obsError) throw obsError;
      
      // Group observations by indicator + geo
      type ObservationType = NonNullable<typeof observations>[number];
      const grouped = new Map<string, ObservationType[]>();
      
      for (const obs of observations || []) {
        const groupKey = `${obs.kpi_id}_${obs.region_code || 'SE'}`;
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, []);
        }
        grouped.get(groupKey)!.push(obs);
      }
      
      const generatedFacts: string[] = [];
      const errors: string[] = [];
      
      for (const [_groupKey, obs] of grouped.entries()) {
        if (obs.length < 2) continue; // Need at least 2 observations for trend
        
        const values = obs.map(o => o.value);
        const trend = determineTrend(values);
        
        const firstObs = obs[0];
        const lastObs = obs[obs.length - 1];
        
        const kpiDef = firstObs.kpi_definitions;
        const geoCode = firstObs.region_code || 'SE';
        
        const startYear = new Date(firstObs.period_start).getFullYear();
        const endYear = new Date(lastObs.period_end).getFullYear();
        
        const factCode = generateFactCode(kpiDef.code, geoCode, startYear, endYear);
        
        // Check if fact already exists
        if (!body.force_regenerate) {
          const { data: existing } = await supabase
            .from('canonical_facts')
            .select('id')
            .eq('fact_code', factCode)
            .single();
          
          if (existing) continue; // Skip if exists
        }
        
        // Get template based on trend
        const trendType = trend.direction === 'up' ? 'increase' : 
                          trend.direction === 'down' ? 'decrease' : 
                          trend.direction === 'stable' ? 'stable' : 'unknown';
        
        for (const lang of ['en', 'sv']) {
          const template = templateMap.get(`${trendType}_${lang}`);
          if (!template) continue;
          
          // Get geo name
          let geoName = geoCode;
          if (geoCode === 'SE') {
            geoName = lang === 'sv' ? 'Sverige' : 'Sweden';
          } else {
            // Look up from countries table
            const { data: country } = await supabase
              .from('countries')
              .select('name, name_local')
              .eq('code', geoCode)
              .single();
            
            if (country) {
              geoName = lang === 'sv' && country.name_local ? country.name_local : country.name;
            }
          }
          
          const variables: Record<string, string> = {
            indicator_name: kpiDef.name,
            geo_name: geoName,
            time_range: `${startYear}-${endYear}`,
            magnitude: Math.abs(trend.magnitude).toFixed(1),
          };
          
          const statement = applyTemplate(template.template_text, variables);
          
          // Determine uncertainty based on data coverage
          let uncertainty: 'low' | 'medium' | 'high' = 'medium';
          if (obs.length >= 10 && obs.every(o => o.confidence >= 80)) {
            uncertainty = 'low';
          } else if (obs.length < 5 || obs.some(o => o.confidence < 60)) {
            uncertainty = 'high';
          }
          
          // Insert fact
          const { error: insertError } = await supabase
            .from('canonical_facts')
            .upsert({
              fact_code: `${factCode}_${lang.toUpperCase()}`,
              indicator_id: kpiDef.id,
              geo_level: geoCode === 'SE' ? 'country' : 
                        geoCode.length === 2 ? 'country' : 'region',
              geo_code: geoCode,
              time_range_start: firstObs.period_start,
              time_range_end: lastObs.period_end,
              statement: statement,
              statement_template: template.template_text,
              trend_direction: trend.direction,
              trend_magnitude: trend.magnitude,
              uncertainty: uncertainty,
              method: 'observed',
              version: 1,
              is_active: true,
            }, {
              onConflict: 'fact_code',
            });
          
          if (insertError) {
            errors.push(`Failed to generate ${factCode}_${lang}: ${insertError.message}`);
          } else {
            generatedFacts.push(`${factCode}_${lang.toUpperCase()}`);
          }
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          facts_generated: generatedFacts.length,
          fact_codes: generatedFacts,
          errors: errors.length > 0 ? errors : undefined,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Fact generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
