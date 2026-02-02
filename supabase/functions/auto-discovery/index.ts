/**
 * Block 58: Auto-Discovery Engine
 * 
 * Validates new sources, detects indicators, and triggers fact generation.
 * No manual "coupling" exists.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiscoveryRequest {
  source_url: string;
  source_type: 'api' | 'dataset' | 'feed';
  metadata?: Record<string, unknown>;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  schema_detected?: Record<string, unknown>;
  license_detected?: string;
  geographic_scope?: string[];
  temporal_scope?: { start: string; end: string };
}

interface KpiDefinition {
  id: string;
  code: string;
  name: string;
  description?: string;
}

function validateLicense(license: string | null): boolean {
  if (!license) return false;
  const openLicenses = ['open', 'cc0', 'cc-by', 'public-domain', 'ogl'];
  return openLicenses.some(ol => license.toLowerCase().includes(ol));
}

async function validateCoverage(
  temporalScope: { start: string; end: string } | null,
  geographicScope: string[] | null
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  if (!temporalScope || !temporalScope.start) {
    errors.push('Temporal coverage start date required');
  }
  
  if (!geographicScope || geographicScope.length === 0) {
    errors.push('At least one geographic scope required');
  }
  
  return { valid: errors.length === 0, errors };
}

async function detectIndicators(
  supabase: SupabaseClient,
  sourceId: string,
  schemaDetected: Record<string, unknown>
): Promise<{ detected: string[]; matched_kpi_ids: string[] }> {
  const detectedIndicators: string[] = [];
  const matchedKpiIds: string[] = [];
  
  const { data: kpis } = await supabase
    .from('kpi_definitions')
    .select('id, code, name, description')
    .eq('is_active', true);
  
  if (kpis && schemaDetected.fields) {
    const fields = schemaDetected.fields as string[];
    const kpiList = kpis as KpiDefinition[];
    
    for (const kpi of kpiList) {
      const kpiTerms = [
        kpi.code.toLowerCase(),
        kpi.name.toLowerCase(),
        ...(kpi.description?.toLowerCase().split(' ') || []),
      ];
      
      for (const field of fields) {
        if (kpiTerms.some(term => field.toLowerCase().includes(term))) {
          detectedIndicators.push(field);
          matchedKpiIds.push(kpi.id);
          break;
        }
      }
    }
  }
  
  await supabase.from('indicator_detection_log').insert({
    source_id: sourceId,
    detected_indicators: schemaDetected,
    matched_kpi_ids: matchedKpiIds,
    new_indicators_suggested: detectedIndicators.filter(d => !matchedKpiIds.includes(d)),
    detection_method: 'schema_analysis',
    confidence_score: matchedKpiIds.length > 0 ? 0.7 : 0.3,
  } as Record<string, unknown>);
  
  return { detected: detectedIndicators, matched_kpi_ids: matchedKpiIds };
}

async function registerSource(
  supabase: SupabaseClient,
  queueEntry: {
    id: string;
    source_url: string;
    source_type: string;
    schema_detected: Record<string, unknown>;
    license_detected: string;
    geographic_scope_detected: string[];
    temporal_scope_detected: { start: string; end: string };
  }
): Promise<string> {
  const { data: source, error } = await supabase
    .from('data_sources')
    .insert({
      code: `AUTO_${Date.now()}`,
      name: `Auto-discovered: ${queueEntry.source_url}`,
      source_type: queueEntry.source_type,
      base_url: queueEntry.source_url,
      is_active: true,
      reliability_score: 70,
      update_frequency: 'monthly',
      metadata: {
        auto_discovered: true,
        schema: queueEntry.schema_detected,
        license: queueEntry.license_detected,
        geographic_scope: queueEntry.geographic_scope_detected,
        temporal_scope: queueEntry.temporal_scope_detected,
      },
    } as Record<string, unknown>)
    .select('id')
    .single();
  
  if (error) throw error;
  
  const sourceData = source as { id: string };
  
  await supabase
    .from('source_discovery_queue')
    .update({
      validation_status: 'approved',
      processed_at: new Date().toISOString(),
      created_source_id: sourceData.id,
    } as Record<string, unknown>)
    .eq('id', queueEntry.id);
  
  return sourceData.id;
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
      const body: DiscoveryRequest = await req.json();
      
      const { data: queueEntry, error: queueError } = await supabase
        .from('source_discovery_queue')
        .insert({
          source_url: body.source_url,
          source_type: body.source_type,
          validation_status: 'validating',
        } as Record<string, unknown>)
        .select()
        .single();
      
      if (queueError) throw queueError;
      
      const queueData = queueEntry as { id: string };
      
      const validationResult: ValidationResult = {
        valid: true,
        errors: [],
        schema_detected: body.metadata?.schema as Record<string, unknown> || { fields: [] },
        license_detected: body.metadata?.license as string || 'open',
        geographic_scope: body.metadata?.geographic_scope as string[] || ['SE'],
        temporal_scope: body.metadata?.temporal_scope as { start: string; end: string } || {
          start: '2020-01-01',
          end: new Date().toISOString().split('T')[0],
        },
      };
      
      if (!validateLicense(validationResult.license_detected || null)) {
        validationResult.valid = false;
        validationResult.errors.push('License is not open');
      }
      
      const coverageCheck = await validateCoverage(
        validationResult.temporal_scope || null,
        validationResult.geographic_scope || null
      );
      if (!coverageCheck.valid) {
        validationResult.valid = false;
        validationResult.errors.push(...coverageCheck.errors);
      }
      
      if (!validationResult.valid) {
        await supabase
          .from('source_discovery_queue')
          .update({
            validation_status: 'rejected',
            validation_errors: validationResult.errors,
            processed_at: new Date().toISOString(),
          } as Record<string, unknown>)
          .eq('id', queueData.id);
        
        return new Response(
          JSON.stringify({
            success: false,
            queue_id: queueData.id,
            status: 'rejected',
            errors: validationResult.errors,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      await supabase
        .from('source_discovery_queue')
        .update({
          schema_detected: validationResult.schema_detected,
          license_detected: validationResult.license_detected,
          geographic_scope_detected: validationResult.geographic_scope,
          temporal_scope_detected: validationResult.temporal_scope,
        } as Record<string, unknown>)
        .eq('id', queueData.id);
      
      const sourceId = await registerSource(supabase, {
        id: queueData.id,
        source_url: body.source_url,
        source_type: body.source_type,
        schema_detected: validationResult.schema_detected!,
        license_detected: validationResult.license_detected!,
        geographic_scope_detected: validationResult.geographic_scope!,
        temporal_scope_detected: validationResult.temporal_scope!,
      });
      
      const indicators = await detectIndicators(
        supabase,
        sourceId,
        validationResult.schema_detected!
      );
      
      const factGenerationUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-facts`;
      fetch(factGenerationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({ source_id: sourceId }),
      }).catch(console.error);
      
      return new Response(
        JSON.stringify({
          success: true,
          queue_id: queueData.id,
          source_id: sourceId,
          status: 'approved',
          indicators_detected: indicators.detected.length,
          kpis_matched: indicators.matched_kpi_ids.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('source_discovery_queue')
        .select('*')
        .order('discovered_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ queue: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Auto-discovery error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
