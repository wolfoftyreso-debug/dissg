import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// KOLADA INGEST - Hämtar data från Kolada API
// https://github.com/Hypergene/kolada
// ═══════════════════════════════════════════════════════════════

// Mappning mellan våra KPI-koder och Kolada KPI-ID:er
const KOLADA_KPI_MAPPING: Record<string, { koladaId: string; transform?: (v: number) => number }> = {
  // Demografi & Hälsa
  "life_expectancy": { koladaId: "N00914" }, // Återstående medellivslängd vid födseln, riket
  "excess_mortality": { koladaId: "N00401" }, // Döda per 1000 invånare (används för att beräkna överdödlighet)
  
  // Arbete & Produktivitet
  "employment_rate_net": { koladaId: "N00914" }, // Förvärvsarbetande invånare 20-64 år, andel (%)
  "long_term_exclusion": { koladaId: "N31813" }, // Unga 16-24 år som varken arbetar eller studerar, andel (%)
  
  // Social stabilitet
  "violent_crime_rate": { koladaId: "N07403" }, // Anmälda våldsbrott per 100 000 invånare
  
  // Kärnsystem
  "healthcare_queue_functional": { koladaId: "N20401" }, // Väntetider vårdgaranti
  "school_outcomes_grade9": { koladaId: "N15428" }, // Elever åk 9 med godkänt i alla ämnen, andel (%)
};

interface IngestResult {
  success: boolean;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  errors: string[];
}

interface KoladaValue {
  kpi: string;
  municipality: string;
  period: string;
  values: Array<{
    gender: string;
    value: number | null;
  }>;
}

interface KoladaResponse {
  count: number;
  values: KoladaValue[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body (optional - can specify specific KPIs to fetch)
    let kpiCodesToFetch: string[] = Object.keys(KOLADA_KPI_MAPPING);
    let _forceRefresh = false;
    
    try {
      const body = await req.json();
      if (body.kpiCodes && Array.isArray(body.kpiCodes)) {
        kpiCodesToFetch = body.kpiCodes.filter((k: string) => k in KOLADA_KPI_MAPPING);
      }
      _forceRefresh = body.forceRefresh === true;
    } catch {
      // No body or invalid JSON - use defaults
    }

    console.log(`[KOLADA] Starting ingest for ${kpiCodesToFetch.length} KPIs`);

    // Get Kolada data source
    const { data: dataSource } = await supabase
      .from("data_sources")
      .select("id")
      .eq("code", "kolada")
      .single();

    if (!dataSource) {
      throw new Error("Kolada data source not configured");
    }

    // Get KPI definitions
    const { data: kpiDefinitions } = await supabase
      .from("kpi_definitions")
      .select("id, code, is_inverted")
      .in("code", kpiCodesToFetch);

    if (!kpiDefinitions || kpiDefinitions.length === 0) {
      throw new Error("No matching KPI definitions found");
    }

    // Log ingest start
    const { data: ingestLog } = await supabase
      .from("ingest_log")
      .insert({
        data_source_id: dataSource.id,
        status: "running",
        metadata: { kpiCodes: kpiCodesToFetch }
      })
      .select()
      .single();

    const result: IngestResult = {
      success: true,
      recordsProcessed: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      errors: [],
    };

    // Current year and previous years to fetch
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [currentYear, currentYear - 1, currentYear - 2];

    // Process each KPI
    for (const kpiDef of kpiDefinitions) {
      const mapping = KOLADA_KPI_MAPPING[kpiDef.code];
      if (!mapping) continue;

      try {
        // Fetch data from Kolada API
        // Using municipality "0000" for national level data
        const koladaUrl = `https://api.kolada.se/v2/data/kpi/${mapping.koladaId}/municipality/0000/year/${yearsToFetch.join(",")}`;
        
        console.log(`[KOLADA] Fetching ${kpiDef.code}: ${koladaUrl}`);
        
        const response = await fetch(koladaUrl, {
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
          const errorText = await response.text();
          result.errors.push(`Failed to fetch ${kpiDef.code}: ${response.status} - ${errorText}`);
          continue;
        }

        const koladaData: KoladaResponse = await response.json();
        
        if (!koladaData.values || koladaData.values.length === 0) {
          console.log(`[KOLADA] No data for ${kpiDef.code}`);
          continue;
        }

        // Process each period's data
        for (const valueSet of koladaData.values) {
          // Get the total value (gender = "T")
          const totalValue = valueSet.values.find(v => v.gender === "T");
          if (!totalValue || totalValue.value === null) continue;

          const year = parseInt(valueSet.period);
          const periodStart = `${year}-01-01`;
          const periodEnd = `${year}-12-31`;

          // Apply any transformation
          let value = totalValue.value;
          if (mapping.transform) {
            value = mapping.transform(value);
          }

          // Check if record exists
          const { data: existing } = await supabase
            .from("kpi_values")
            .select("id, value")
            .eq("kpi_id", kpiDef.id)
            .eq("period_start", periodStart)
            .eq("region_code", "SE")
            .single();

          // Calculate trend if we have previous data
          let trend: "up" | "down" | "stable" = "stable";
          let trendPercent = 0;
          let previousValue: number | null = null;

          // Get previous period value
          const { data: prevData } = await supabase
            .from("kpi_values")
            .select("value")
            .eq("kpi_id", kpiDef.id)
            .lt("period_start", periodStart)
            .order("period_start", { ascending: false })
            .limit(1)
            .single();

          if (prevData && prevData.value !== null) {
            previousValue = prevData.value;
            trendPercent = previousValue !== 0 && previousValue !== null
              ? ((value - previousValue) / Math.abs(previousValue)) * 100 
              : 0;
            
            if (Math.abs(trendPercent) < 0.5) {
              trend = "stable";
            } else if (trendPercent > 0) {
              trend = "up";
            } else {
              trend = "down";
            }
          }

          // Determine status based on trend and whether KPI is inverted
          let status: "positive" | "warning" | "critical" | "neutral" = "neutral";
          const isImproving = kpiDef.is_inverted 
            ? trend === "down" 
            : trend === "up";
          const isDeclining = kpiDef.is_inverted 
            ? trend === "up" 
            : trend === "down";

          if (isImproving) {
            status = "positive";
          } else if (isDeclining && Math.abs(trendPercent) > 5) {
            status = "critical";
          } else if (isDeclining) {
            status = "warning";
          }

          const kpiValue = {
            kpi_id: kpiDef.id,
            data_source_id: dataSource.id,
            value,
            previous_value: previousValue,
            trend,
            trend_percent: trendPercent,
            status,
            confidence: 90, // Kolada data is official statistics
            period_start: periodStart,
            period_end: periodEnd,
            granularity: "yearly",
            region_code: "SE",
            is_provisional: year === currentYear,
            raw_data: { kolada_kpi: mapping.koladaId, period: valueSet.period },
          };

          if (existing) {
            // Update only if value changed
            if (existing.value !== value) {
              await supabase
                .from("kpi_values")
                .update({
                  ...kpiValue,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);
              result.recordsUpdated++;
            }
          } else {
            // Insert new record
            await supabase
              .from("kpi_values")
              .insert(kpiValue);
            result.recordsInserted++;
          }

          result.recordsProcessed++;
        }

        console.log(`[KOLADA] Processed ${kpiDef.code}: ${result.recordsProcessed} records`);

      } catch (kpiError) {
        const errorMsg = kpiError instanceof Error ? kpiError.message : "Unknown error";
        result.errors.push(`Error processing ${kpiDef.code}: ${errorMsg}`);
        console.error(`[KOLADA] Error for ${kpiDef.code}:`, kpiError);
      }
    }

    // Update data source timestamp
    await supabase
      .from("data_sources")
      .update({
        last_successful_fetch: new Date().toISOString(),
        last_fetch_error: result.errors.length > 0 ? result.errors.join("; ") : null,
      })
      .eq("id", dataSource.id);

    // Complete ingest log
    await supabase
      .from("ingest_log")
      .update({
        completed_at: new Date().toISOString(),
        status: result.errors.length > 0 ? "partial" : "success",
        records_fetched: result.recordsProcessed,
        records_inserted: result.recordsInserted,
        records_updated: result.recordsUpdated,
        error_message: result.errors.length > 0 ? result.errors.join("; ") : null,
        metadata: {
          duration_ms: Date.now() - startTime,
          kpiCodes: kpiCodesToFetch,
        }
      })
      .eq("id", ingestLog?.id);

    console.log(`[KOLADA] Ingest complete: ${result.recordsProcessed} processed, ${result.recordsInserted} inserted, ${result.recordsUpdated} updated`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[KOLADA] Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
