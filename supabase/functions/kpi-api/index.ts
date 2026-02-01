import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════
// KPI READ API - Hämtar KPI-data för dashboard
// ═══════════════════════════════════════════════════════════════

interface KPIQueryParams {
  kpiIds?: number[];
  category?: string;
  granularity?: 'national' | 'regional' | 'municipal';
  regionCode?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    switch (action) {
      case "overview":
        return await getOverview(supabase);
      case "kpi":
        return await getKPIDetails(supabase, url.searchParams);
      case "timeseries":
        return await getTimeSeries(supabase, url.searchParams);
      case "alerts":
        return await getActiveAlerts(supabase);
      case "sources":
        return await getDataSources(supabase);
      default:
        return await getOverview(supabase);
    }

  } catch (error) {
    console.error("[KPI-API] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ═══════════════════════════════════════════════════════════════
// OVERVIEW - Alla KPI:er med senaste värden
// ═══════════════════════════════════════════════════════════════
async function getOverview(supabase: any) {
  // Get all KPI definitions
  const { data: definitions, error: defError } = await supabase
    .from("kpi_definitions")
    .select("*")
    .eq("is_active", true)
    .order("kpi_index");

  if (defError) throw defError;

  // Get latest values for each KPI
  const kpiData = await Promise.all(
    definitions.map(async (def: any) => {
      const { data: latestValue } = await supabase
        .from("kpi_values")
        .select("*")
        .eq("kpi_id", def.id)
        .eq("granularity", "national")
        .order("period_end", { ascending: false })
        .limit(1)
        .single();

      return {
        id: def.code,
        index: def.kpi_index,
        name: def.name,
        category: def.category,
        description: def.description,
        rationale: def.rationale,
        unit: def.unit,
        isInverted: def.is_inverted,
        redFlags: def.red_flag_conditions,
        breakdownAvailable: def.breakdown_dimensions,
        // Value data (if available)
        value: latestValue?.value ?? null,
        previousValue: latestValue?.previous_value ?? null,
        status: latestValue?.status ?? "neutral",
        trend: latestValue?.trend ?? "stable",
        trendPercent: latestValue?.trend_percent ?? 0,
        confidence: latestValue?.confidence ?? 0,
        lastUpdated: latestValue?.updated_at ?? null,
        isProvisional: latestValue?.is_provisional ?? true,
      };
    })
  );

  // Calculate summary
  const summary = {
    total: kpiData.length,
    critical: kpiData.filter((k: any) => k.status === "critical").length,
    warning: kpiData.filter((k: any) => k.status === "warning").length,
    positive: kpiData.filter((k: any) => k.status === "positive").length,
    neutral: kpiData.filter((k: any) => k.status === "neutral").length,
    lastUpdate: new Date().toISOString(),
  };

  return new Response(
    JSON.stringify({ summary, kpis: kpiData }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// ═══════════════════════════════════════════════════════════════
// KPI DETAILS - Enskild KPI med fullständig info
// ═══════════════════════════════════════════════════════════════
async function getKPIDetails(supabase: any, params: URLSearchParams) {
  const kpiId = params.get("id");
  if (!kpiId) throw new Error("KPI ID required");

  // Get definition
  const { data: def, error } = await supabase
    .from("kpi_definitions")
    .select("*")
    .or(`code.eq.${kpiId},kpi_index.eq.${kpiId}`)
    .single();

  if (error) throw error;

  // Get data sources for this KPI
  const { data: sources } = await supabase
    .from("kpi_data_source_mapping")
    .select(`
      *,
      data_sources (*)
    `)
    .eq("kpi_id", def.id);

  // Get latest values (last 12 periods)
  const { data: values } = await supabase
    .from("kpi_values")
    .select("*")
    .eq("kpi_id", def.id)
    .eq("granularity", "national")
    .order("period_end", { ascending: false })
    .limit(12);

  // Get active alerts
  const { data: alerts } = await supabase
    .from("kpi_alerts")
    .select("*")
    .eq("kpi_id", def.id)
    .is("resolved_at", null)
    .order("triggered_at", { ascending: false });

  return new Response(
    JSON.stringify({
      definition: def,
      dataSources: sources?.map((s: any) => ({
        ...s.data_sources,
        isPrimary: s.is_primary,
        weight: s.weight,
      })) ?? [],
      values: values ?? [],
      alerts: alerts ?? [],
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// ═══════════════════════════════════════════════════════════════
// TIME SERIES - Historisk data för grafer
// ═══════════════════════════════════════════════════════════════
async function getTimeSeries(supabase: any, params: URLSearchParams) {
  const kpiId = params.get("id");
  const granularity = params.get("granularity") || "national";
  const fromDate = params.get("from");
  const toDate = params.get("to");
  const limit = parseInt(params.get("limit") || "52");

  if (!kpiId) throw new Error("KPI ID required");

  // Get KPI definition first
  const { data: def } = await supabase
    .from("kpi_definitions")
    .select("id")
    .or(`code.eq.${kpiId},kpi_index.eq.${kpiId}`)
    .single();

  if (!def) throw new Error("KPI not found");

  let query = supabase
    .from("kpi_values")
    .select("period_start, period_end, value, status, trend, trend_percent, confidence")
    .eq("kpi_id", def.id)
    .eq("granularity", granularity)
    .order("period_end", { ascending: false })
    .limit(limit);

  if (fromDate) query = query.gte("period_start", fromDate);
  if (toDate) query = query.lte("period_end", toDate);

  const { data, error } = await query;
  if (error) throw error;

  return new Response(
    JSON.stringify({ timeseries: data?.reverse() ?? [] }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// ═══════════════════════════════════════════════════════════════
// ACTIVE ALERTS - Obekräftade varningar
// ═══════════════════════════════════════════════════════════════
async function getActiveAlerts(supabase: any) {
  const { data, error } = await supabase
    .from("kpi_alerts")
    .select(`
      *,
      kpi_definitions (kpi_index, name, code)
    `)
    .is("resolved_at", null)
    .order("severity", { ascending: false })
    .order("triggered_at", { ascending: false });

  if (error) throw error;

  return new Response(
    JSON.stringify({ alerts: data ?? [] }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// ═══════════════════════════════════════════════════════════════
// DATA SOURCES - Status på alla datakällor
// ═══════════════════════════════════════════════════════════════
async function getDataSources(supabase: any) {
  const { data, error } = await supabase
    .from("data_sources")
    .select("*")
    .order("name");

  if (error) throw error;

  // Add health status
  const sourcesWithHealth = data?.map((source: any) => ({
    ...source,
    health: getSourceHealth(source),
  })) ?? [];

  return new Response(
    JSON.stringify({ sources: sourcesWithHealth }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function getSourceHealth(source: any): 'healthy' | 'degraded' | 'error' {
  if (!source.is_active) return 'error';
  if (source.last_fetch_error) return 'error';
  if (!source.last_successful_fetch) return 'degraded';
  
  // Check if fetch is overdue based on frequency
  const lastFetch = new Date(source.last_successful_fetch);
  const now = new Date();
  const hoursSinceLastFetch = (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);
  
  const maxHours: Record<string, number> = {
    realtime: 1,
    daily: 36,
    weekly: 192,
    monthly: 768,
    quarterly: 2400,
  };
  
  if (hoursSinceLastFetch > (maxHours[source.update_frequency] || 768)) {
    return 'degraded';
  }
  
  return 'healthy';
}
