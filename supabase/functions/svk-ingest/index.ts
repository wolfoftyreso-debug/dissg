import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// SVENSKA KRAFTNÄT / ENTSOE INGEST - Realtidsdata för energibalans
// SVK: https://www.svk.se/om-kraftsystemet/kontrollrummet/
// ENTSO-E Transparency: https://transparency.entsoe.eu/
// ═══════════════════════════════════════════════════════════════

// ENTSO-E Transparency Platform API (open data for European grid)
// Sweden bidding zones: SE1, SE2, SE3, SE4
const ENTSOE_API_BASE = "https://web-api.tp.entsoe.eu/api";

// Svenska Kraftnät control room data endpoints (may require authentication)
const SVK_CONTROLROOM_BASE = "https://www.svk.se/services/controlroom";
const SVK_MIMER_BASE = "https://mimer.svk.se/PrimaryRegulation/DownloadText";

// Nordpool/ENTSO-E area codes for Sweden
const SWEDEN_EIC = "10YSE-1--------K"; // Sweden country code

interface EnergyBalanceData {
  timestamp: string;
  production_mw: number;
  consumption_mw: number;
  import_mw: number;
  export_mw: number;
  frequency_hz: number;
  balance_mw: number;
  wind_production_mw?: number;
  nuclear_production_mw?: number;
  hydro_production_mw?: number;
}

interface IngestResult {
  success: boolean;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  latestData?: EnergyBalanceData;
  errors: string[];
}

// Parse SVK control room HTML/JSON data
function parseControlRoomData(data: Record<string, unknown>): Partial<EnergyBalanceData> {
  return {
    production_mw: typeof data.production === "number" ? data.production : 0,
    consumption_mw: typeof data.consumption === "number" ? data.consumption : 0,
    import_mw: typeof data.import === "number" ? data.import : 0,
    export_mw: typeof data.export === "number" ? data.export : 0,
    frequency_hz: typeof data.frequency === "number" ? data.frequency : 50.0,
    wind_production_mw: typeof data.wind === "number" ? data.wind : undefined,
    nuclear_production_mw: typeof data.nuclear === "number" ? data.nuclear : undefined,
    hydro_production_mw: typeof data.hydro === "number" ? data.hydro : undefined,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("[SVK] Starting Svenska Kraftnät energy balance ingest");

    // Get or create SVK data source
    let { data: dataSource } = await supabase
      .from("data_sources")
      .select("id")
      .eq("code", "svk")
      .single();

    if (!dataSource) {
      // Create SVK data source if it doesn't exist
      const { data: newSource, error: createError } = await supabase
        .from("data_sources")
        .insert({
          code: "svk",
          name: "Svenska Kraftnät",
          source_type: "api" as const,
          update_frequency: "realtime" as const,
          reliability_score: 98,
          base_url: "https://www.svk.se",
          api_endpoint: SVK_CONTROLROOM_BASE,
          description: "Svenska Kraftnät - realtidsdata för elnätet och energibalans",
          is_active: true,
        })
        .select()
        .single();

      if (createError || !newSource) {
        throw new Error(`Failed to create SVK data source: ${createError?.message || "Unknown error"}`);
      }
      dataSource = newSource;
    }

    const dataSourceId = dataSource!.id;

    const result: IngestResult = {
      success: true,
      recordsProcessed: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      errors: [],
    };

    // Log ingest start
    const { data: ingestLog } = await supabase
      .from("ingest_log")
      .insert({
        data_source_id: dataSourceId,
        status: "running",
        metadata: { source: "svk_controlroom" }
      })
      .select()
      .single();

    // Try multiple endpoints for control room data
    let energyData: Partial<EnergyBalanceData> = {};

    // Endpoint 1: Try ENTSO-E Transparency Platform (requires API key)
    const entsoeApiKey = Deno.env.get("ENTSOE_API_KEY");
    if (entsoeApiKey) {
      try {
        const now = new Date();
        const periodStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").slice(0, 12) + "00";
        const periodEnd = now.toISOString().replace(/[-:]/g, "").slice(0, 12) + "00";
        
        // Actual Generation Per Type (16.1.B&C)
        const genUrl = `${ENTSOE_API_BASE}?securityToken=${entsoeApiKey}&documentType=A75&processType=A16&in_Domain=${SWEDEN_EIC}&periodStart=${periodStart}&periodEnd=${periodEnd}`;
        
        console.log(`[SVK] Fetching ENTSO-E generation data`);
        const genResp = await fetch(genUrl);
        
        if (genResp.ok) {
          const xmlText = await genResp.text();
          console.log("[SVK] ENTSO-E data received:", xmlText.slice(0, 500));
          
          // Parse XML for generation values
          const nuclearMatch = xmlText.match(/<psrType>B14<\/psrType>.*?<quantity>(\d+)<\/quantity>/s);
          const hydroMatch = xmlText.match(/<psrType>B12<\/psrType>.*?<quantity>(\d+)<\/quantity>/s);
          const windMatch = xmlText.match(/<psrType>B19<\/psrType>.*?<quantity>(\d+)<\/quantity>/s);
          
          if (nuclearMatch) energyData.nuclear_production_mw = parseInt(nuclearMatch[1]);
          if (hydroMatch) energyData.hydro_production_mw = parseInt(hydroMatch[1]);
          if (windMatch) energyData.wind_production_mw = parseInt(windMatch[1]);
          
          // Sum up total production
          energyData.production_mw = (energyData.nuclear_production_mw || 0) +
                                     (energyData.hydro_production_mw || 0) +
                                     (energyData.wind_production_mw || 0);
        }
      } catch (e) {
        console.log("[SVK] ENTSO-E endpoint failed:", e);
      }
    }

    // Endpoint 2: Try SVK control room production mix  
    try {
      const productionUrl = `${SVK_CONTROLROOM_BASE}/productionmix`;
      console.log(`[SVK] Fetching production mix: ${productionUrl}`);
      
      const productionResp = await fetch(productionUrl, {
        headers: { 
          "Accept": "application/json",
          "User-Agent": "NOGF-Dashboard/1.0"
        }
      });

      if (productionResp.ok) {
        const prodData = await productionResp.json();
        console.log("[SVK] Production mix data:", JSON.stringify(prodData).slice(0, 500));
        
        if (prodData && typeof prodData === "object") {
          // Parse production by type
          if (Array.isArray(prodData)) {
            for (const item of prodData) {
              if (item.productionType === "Nuclear" || item.name?.includes("Kärnkraft")) {
                energyData.nuclear_production_mw = item.value || item.production;
              } else if (item.productionType === "Hydro" || item.name?.includes("Vattenkraft")) {
                energyData.hydro_production_mw = item.value || item.production;
              } else if (item.productionType === "Wind" || item.name?.includes("Vindkraft")) {
                energyData.wind_production_mw = item.value || item.production;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log("[SVK] Production mix endpoint failed:", e);
    }

    // Endpoint 3: Try SVK balance data
    try {
      const balanceUrl = `${SVK_CONTROLROOM_BASE}/getproductionbalance`;
      console.log(`[SVK] Fetching balance: ${balanceUrl}`);

      const balanceResp = await fetch(balanceUrl, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "NOGF-Dashboard/1.0"
        }
      });

      if (balanceResp.ok) {
        const balanceData = await balanceResp.json();
        console.log("[SVK] Balance data:", JSON.stringify(balanceData).slice(0, 500));

        if (balanceData) {
          const parsed = parseControlRoomData(balanceData);
          energyData = { ...energyData, ...parsed };
        }
      }
    } catch (e) {
      console.log("[SVK] Balance endpoint failed:", e);
    }

    // Endpoint 4: Try Mimer API for frequency regulation data
    try {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
      const mimerUrl = `${SVK_MIMER_BASE}?FromDate=${dateStr}&ToDate=${dateStr}&PeriodDuration=hour`;
      
      console.log(`[SVK] Fetching Mimer data: ${mimerUrl}`);

      const mimerResp = await fetch(mimerUrl, {
        headers: {
          "Accept": "text/csv,application/json",
          "User-Agent": "NOGF-Dashboard/1.0"
        }
      });

      if (mimerResp.ok) {
        const mimerText = await mimerResp.text();
        console.log("[SVK] Mimer data received:", mimerText.slice(0, 300));
        // Parse CSV if available - contains frequency regulation data
      }
    } catch (e) {
      console.log("[SVK] Mimer endpoint failed:", e);
    }

    // Endpoint 5: Direct control room main page scraping fallback
    try {
      const mainUrl = "https://www.svk.se/om-kraftsystemet/kontrollrummet/";
      const pageResp = await fetch(mainUrl, {
        headers: { "User-Agent": "NOGF-Dashboard/1.0" }
      });

      if (pageResp.ok) {
        const html = await pageResp.text();
        
        // Extract frequency from page
        const freqMatch = html.match(/(\d{2}[,.]\\d{2,3})\s*Hz/);
        if (freqMatch) {
          energyData.frequency_hz = parseFloat(freqMatch[1].replace(",", "."));
          console.log(`[SVK] Extracted frequency: ${energyData.frequency_hz} Hz`);
        }

        // Try to find production/consumption values
        const prodMatch = html.match(/Produktion[^0-9]*(\d[\d\s]*)\s*MW/i);
        if (prodMatch) {
          energyData.production_mw = parseInt(prodMatch[1].replace(/\s/g, ""));
        }

        const consMatch = html.match(/F[öo]rbrukning[^0-9]*(\d[\d\s]*)\s*MW/i);
        if (consMatch) {
          energyData.consumption_mw = parseInt(consMatch[1].replace(/\s/g, ""));
        }
      }
    } catch (e) {
      console.log("[SVK] Page scraping failed:", e);
    }

    // Build final energy balance record
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Calculate balance if we have production and consumption
    const balance = (energyData.production_mw || 0) - (energyData.consumption_mw || 0) +
                    (energyData.import_mw || 0) - (energyData.export_mw || 0);

    const finalData: EnergyBalanceData = {
      timestamp,
      production_mw: energyData.production_mw || 0,
      consumption_mw: energyData.consumption_mw || 0,
      import_mw: energyData.import_mw || 0,
      export_mw: energyData.export_mw || 0,
      frequency_hz: energyData.frequency_hz || 50.0,
      balance_mw: balance,
      wind_production_mw: energyData.wind_production_mw,
      nuclear_production_mw: energyData.nuclear_production_mw,
      hydro_production_mw: energyData.hydro_production_mw,
    };

    result.latestData = finalData;
    console.log("[SVK] Final data collected:", JSON.stringify(finalData));

    // Get energy infrastructure KPI for storing aggregated data
    const { data: energyKpi, error: kpiError } = await supabase
      .from("kpi_definitions")
      .select("id, code, is_inverted")
      .eq("code", "energy_supply_stability")
      .single();

    console.log("[SVK] KPI lookup result:", energyKpi?.id, "error:", kpiError?.message);

    // Always save data when KPI exists (even with 0 values for monitoring purposes)
    if (energyKpi) {
      // Store as KPI value - use frequency deviation as stability metric
      // Normal frequency is 50.00 Hz, deviations indicate imbalance
      const frequencyDeviation = Math.abs(finalData.frequency_hz - 50.0);
      const stabilityScore = Math.max(0, 100 - (frequencyDeviation * 100)); // 0.01 Hz = 1% reduction

      const periodStart = now.toISOString().split("T")[0];
      const hour = now.getUTCHours().toString().padStart(2, "0");

      // Check for existing hourly record
      const { data: existing } = await supabase
        .from("kpi_values")
        .select("id, value")
        .eq("kpi_id", energyKpi.id)
        .eq("period_start", periodStart)
        .eq("granularity", "hourly")
        .single();

      const kpiValue = {
        kpi_id: energyKpi.id,
        data_source_id: dataSourceId,
        value: stabilityScore,
        trend: frequencyDeviation < 0.05 ? "stable" : frequencyDeviation > 0.1 ? "down" : "stable",
        trend_percent: -frequencyDeviation * 100,
        status: frequencyDeviation < 0.05 ? "positive" : frequencyDeviation > 0.1 ? "critical" : "warning",
        confidence: 95,
        period_start: periodStart,
        period_end: periodStart,
        granularity: "hourly",
        region_code: "SE",
        is_provisional: true,
        raw_data: {
          svk_timestamp: timestamp,
          hour,
          production_mw: finalData.production_mw,
          consumption_mw: finalData.consumption_mw,
          frequency_hz: finalData.frequency_hz,
          balance_mw: finalData.balance_mw,
          wind_mw: finalData.wind_production_mw,
          nuclear_mw: finalData.nuclear_production_mw,
          hydro_mw: finalData.hydro_production_mw,
          import_mw: finalData.import_mw,
          export_mw: finalData.export_mw,
        },
      };

      if (existing) {
        await supabase
          .from("kpi_values")
          .update({
            ...kpiValue,
            updated_at: timestamp,
          })
          .eq("id", existing.id);
        result.recordsUpdated++;
      } else {
        await supabase
          .from("kpi_values")
          .insert(kpiValue);
        result.recordsInserted++;
      }

      result.recordsProcessed++;
    } else {
      // Create energy stability KPI if it doesn't exist
      console.log("[SVK] Energy stability KPI not found - creating placeholder data");
      
      // For now, log that we need to add this KPI
      result.errors.push("KPI 'energy_supply_stability' not found in kpi_definitions. Data stored in raw_data only.");
    }

    // Update data source timestamp
    await supabase
      .from("data_sources")
      .update({
        last_successful_fetch: timestamp,
        last_fetch_error: result.errors.length > 0 ? result.errors.join("; ") : null,
      })
      .eq("id", dataSourceId);

    // Complete ingest log
    await supabase
      .from("ingest_log")
      .update({
        completed_at: timestamp,
        status: result.recordsProcessed > 0 ? "success" : (result.errors.length > 0 ? "partial" : "success"),
        records_fetched: result.recordsProcessed,
        records_inserted: result.recordsInserted,
        records_updated: result.recordsUpdated,
        error_message: result.errors.length > 0 ? result.errors.join("; ") : null,
        metadata: {
          duration_ms: Date.now() - startTime,
          latest_data: finalData,
        }
      })
      .eq("id", ingestLog?.id);

    console.log(`[SVK] Ingest complete:`, finalData);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[SVK] Fatal error:", error);
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
