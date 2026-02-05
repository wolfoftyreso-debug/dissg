/**
 * TRUST DASHBOARD ENDPOINT
 * 
 * GET /trust
 * 
 * Public transparency layer showing:
 * - All Answer Types
 * - All domains
 * - All sources
 * - Safety stats
 * - System health
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Simulated dashboard state (would be fetched from database in production)
const DASHBOARD_STATE = {
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  
  answer_types: [
    { code: 'DESCRIPTIVE_STAT', name: 'Descriptive Statistics', count: 450, avg_confidence: 0.85 },
    { code: 'TREND_CHANGE', name: 'Trend Analysis', count: 320, avg_confidence: 0.82 },
    { code: 'COMPARISON_CONDITIONAL', name: 'Comparisons', count: 280, avg_confidence: 0.78 },
    { code: 'DISTRIBUTION_STRUCTURE', name: 'Distributions', count: 150, avg_confidence: 0.80 },
    { code: 'RISK_PREVALENCE', name: 'Risk & Prevalence', count: 200, avg_confidence: 0.88 },
    { code: 'CORRELATION_OVERVIEW', name: 'Correlations', count: 100, avg_confidence: 0.72 },
    { code: 'SCENARIO_MODEL', name: 'Scenarios', count: 50, avg_confidence: 0.65 },
  ],
  
  domains: [
    { code: 'economy', name: 'Economy', packets: 250, sources: 4, coverage: 0.88 },
    { code: 'healthcare', name: 'Healthcare', packets: 180, sources: 3, coverage: 0.82 },
    { code: 'youth', name: 'Youth', packets: 120, sources: 3, coverage: 0.85 },
    { code: 'education', name: 'Education', packets: 150, sources: 3, coverage: 0.78 },
    { code: 'labor', name: 'Labor', packets: 200, sources: 3, coverage: 0.84 },
    { code: 'markets', name: 'Markets', packets: 100, sources: 2, coverage: 0.90 },
    { code: 'environment', name: 'Environment', packets: 80, sources: 2, coverage: 0.75 },
    { code: 'housing', name: 'Housing', packets: 60, sources: 2, coverage: 0.68 },
    { code: 'crime', name: 'Crime', packets: 70, sources: 2, coverage: 0.72 },
    { code: 'migration', name: 'Migration', packets: 50, sources: 2, coverage: 0.65 },
    { code: 'society', name: 'Society', packets: 120, sources: 3, coverage: 0.76 },
    { code: 'substance_use', name: 'Substance Use', packets: 40, sources: 1, coverage: 0.58 },
    { code: 'medicine', name: 'Medicine', packets: 30, sources: 1, coverage: 0.55 },
  ],
  
  sources: [
    { id: 'eurostat', name: 'Eurostat', tier: 1, status: 'active', measures: 180, last_update: '2026-02-05' },
    { id: 'world_bank', name: 'World Bank', tier: 1, status: 'active', measures: 220, last_update: '2026-02-04' },
    { id: 'who', name: 'WHO', tier: 1, status: 'active', measures: 120, last_update: '2026-02-05' },
    { id: 'oecd', name: 'OECD', tier: 1, status: 'active', measures: 200, last_update: '2026-02-03' },
    { id: 'imf', name: 'IMF', tier: 1, status: 'active', measures: 90, last_update: '2026-02-01' },
    { id: 'national_se', name: 'SCB Sweden', tier: 2, status: 'active', measures: 150, last_update: '2026-02-05' },
    { id: 'national_de', name: 'Destatis Germany', tier: 2, status: 'active', measures: 140, last_update: '2026-02-04' },
    { id: 'national_uk', name: 'ONS UK', tier: 2, status: 'active', measures: 130, last_update: '2026-02-04' },
  ],
  
  safety_stats: {
    blocked_24h: 127,
    blocked_7d: 842,
    by_reason: {
      'normative_question': 89,
      'prediction_request': 23,
      'crisis_trigger': 15,
    },
    crisis_responses_24h: 15,
  },
  
  system_health: {
    status: 'healthy',
    uptime_30d: 99.92,
    avg_response_ms: 42,
    error_rate_24h: 0.0008,
  },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use GET.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(req.url);
    const view = url.searchParams.get('view') || 'summary';

    // Summary view (default)
    if (view === 'summary') {
      const summary = {
        version: DASHBOARD_STATE.version,
        generated_at: new Date().toISOString(),
        total_answer_packets: DASHBOARD_STATE.answer_types.reduce((s, t) => s + t.count, 0),
        total_answer_types: DASHBOARD_STATE.answer_types.length,
        active_domains: DASHBOARD_STATE.domains.length,
        tier_1_sources: DASHBOARD_STATE.sources.filter(s => s.tier === 1).length,
        total_sources: DASHBOARD_STATE.sources.length,
        total_measures: DASHBOARD_STATE.sources.reduce((s, src) => s + src.measures, 0),
        avg_confidence: (DASHBOARD_STATE.answer_types.reduce((s, t) => s + t.avg_confidence, 0) / DASHBOARD_STATE.answer_types.length).toFixed(2),
        blocked_24h: DASHBOARD_STATE.safety_stats.blocked_24h,
        crisis_responses_24h: DASHBOARD_STATE.safety_stats.crisis_responses_24h,
        system_status: DASHBOARD_STATE.system_health.status,
        transparency_message: 'We show how we say no. That is extremely rare – and extremely valuable.',
      };

      return new Response(
        JSON.stringify(summary),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Full view
    if (view === 'full') {
      return new Response(
        JSON.stringify({
          ...DASHBOARD_STATE,
          generated_at: new Date().toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sources view
    if (view === 'sources') {
      return new Response(
        JSON.stringify({
          generated_at: new Date().toISOString(),
          sources: DASHBOARD_STATE.sources,
          total: DASHBOARD_STATE.sources.length,
          by_tier: {
            tier_1: DASHBOARD_STATE.sources.filter(s => s.tier === 1).length,
            tier_2: DASHBOARD_STATE.sources.filter(s => s.tier === 2).length,
            tier_3: DASHBOARD_STATE.sources.filter(s => s.tier === 3).length,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Safety view
    if (view === 'safety') {
      return new Response(
        JSON.stringify({
          generated_at: new Date().toISOString(),
          ...DASHBOARD_STATE.safety_stats,
          message: 'We block questions we cannot answer responsibly.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown view. Use: summary, full, sources, or safety' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Trust endpoint error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
