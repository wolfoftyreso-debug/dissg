import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// SCB PxWebApi 1.0 base URL
const SCB_API_BASE = "https://api.scb.se/OV0104/v1/doris/sv/ssd";

interface TableConfig {
  path: string;
  description: string;
  kpiCode: string;
  dataSourceCode: string;
  query: {
    query: Array<{ code: string; selection: { filter: string; values: string[] } }>;
    response: { format: string };
  };
  valueMultiplier?: number;
  unit?: string;
  granularity?: string;
  aggregation?: 'sum' | 'average' | 'latest';
}

// Expanded table configurations mapping to actual kpi_definitions codes
const TABLE_CONFIGS: Record<string, TableConfig> = {
  // ═══════════════════════════════════════════════════════════════
  // KPI 1: FÖRVÄNTAD LIVSLÄNGD (life_expectancy -> kpi_definitions.code)
  // ═══════════════════════════════════════════════════════════════
  
  life_expectancy: {
    path: "BE/BE0101/BE0101I/Medellivsl",
    description: "Återstående medellivslängd vid födelsen",
    kpiCode: "life_expectancy",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },  // Riket
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } }, // Män och kvinnor
        { code: "ContentsCode", selection: { filter: "item", values: ["000000NH"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "år",
    aggregation: 'average',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 2: ÖVERDÖDLIGHET (excess_mortality) - döda per månad
  // ═══════════════════════════════════════════════════════════════
  
  excess_mortality: {
    path: "BE/BE0101/BE0101G/ManadBefStat",
    description: "Antal döda per månad",
    kpiCode: "excess_mortality",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } }, // Totalt
        { code: "Manad", selection: { filter: "item", values: ["01","02","03","04","05","06","07","08","09","10","11","12"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000001S4"] } }, // Döda
        { code: "Tid", selection: { filter: "top", values: ["5"] } },
      ],
      response: { format: "json" }
    },
    unit: "% över baslinjen",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 4: SYSSELSÄTTNINGSGRAD (employment_rate_net)
  // ═══════════════════════════════════════════════════════════════
  
  employment_rate: {
    path: "AM/AM0401/AM0401A/NAKUBeijkaraHusar",
    description: "Sysselsättningsgrad 20-64 år",
    kpiCode: "employment_rate_net",  // matches kpi_definitions.code
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 5: PRODUKTIVITET PER TIMME (productivity_per_hour)
  // ═══════════════════════════════════════════════════════════════
  
  productivity: {
    path: "NR/NR0103/NR0103B/NR0103ENS2010T04Kv",
    description: "BNP per arbetad timme (produktivitet)",
    kpiCode: "productivity_per_hour",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["TOT"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000003X"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "index (2020=100)",
    granularity: "quarterly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 6: LÅNGVARIGT UTANFÖRSKAP (long_term_exclusion)
  // ═══════════════════════════════════════════════════════════════
  
  long_term_exclusion: {
    path: "AM/AM0401/AM0401A/NAKUBeijkaraHusar",
    description: "Arbetslöshet 15-74 år (proxy för utanförskap)",
    kpiCode: "long_term_exclusion",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CL"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "% av arbetskraft",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 7: SKATTEBASENS REALA TILLVÄXT (tax_base_growth)
  // ═══════════════════════════════════════════════════════════════
  
  tax_base_growth: {
    path: "OE/OE0107/OE0107A/SkijRegLanK",
    description: "Beskattningsbar förvärvsinkomst per invånare",
    kpiCode: "tax_base_growth",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["OE0107A2"] } },
        { code: "Tid", selection: { filter: "top", values: ["5"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.001,
    unit: "% årlig",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 9: FÖRSÖRJNINGSKVOT (dependency_ratio)
  // ═══════════════════════════════════════════════════════════════
  
  dependency_ratio: {
    path: "BE/BE0101/BE0101C/BefArld662140Ar",
    description: "Befolkning efter ålder för försörjningsberäkning",
    kpiCode: "dependency_ratio",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Alder", selection: { filter: "item", values: ["tot"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000LB"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "kvot",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // KPI 16: BOSTADSOMSÄTTNING (housing_turnover)
  // ═══════════════════════════════════════════════════════════════
  
  housing_construction: {
    path: "BO/BO0101/BO0101A/LaijFardBoAr",
    description: "Färdigställda bostäder per år",
    kpiCode: "housing_turnover",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Hustyp", selection: { filter: "item", values: ["TOTALT"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BO0101B1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/1000 inv",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ═══════════════════════════════════════════════════════════════
  // BEFOLKNINGSDATA (för referens - arbetsför befolkning 18-64)
  // ═══════════════════════════════════════════════════════════════
  
  population_monthly: {
    path: "BE/BE0101/BE0101A/BefolkManad",
    description: "Folkmängden i Sverige per månad (arbetsför ålder)",
    kpiCode: "working_age_functional",
    dataSourceCode: "scb_px",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        // Åldrar 18-64 (arbetsför ålder)
        { code: "Alder", selection: { filter: "item", values: ["18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000003O5"] } },
        { code: "Tid", selection: { filter: "top", values: ["12"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.000001,
    unit: "miljoner",
    granularity: "monthly",
    aggregation: 'sum',
  },
};

interface SCBDataItem {
  key: string[];
  values: string[];
}

interface SCBResponse {
  columns?: { code: string; text: string; type: string }[];
  data?: SCBDataItem[];
}

async function fetchFromSCB(config: TableConfig): Promise<SCBResponse> {
  const url = `${SCB_API_BASE}/${config.path}`;
  
  console.log(`Fetching SCB data from: ${url}`);
  console.log(`Query: ${JSON.stringify(config.query)}`);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(config.query),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SCB API error: ${response.status}`, errorText);
    throw new Error(`SCB API error: ${response.status} - ${errorText.substring(0, 500)}`);
  }

  return await response.json();
}

function parseScbResponse(data: SCBResponse, config: TableConfig): { 
  value: number; 
  previousValue?: number; 
  period: string;
  rawValues: Array<{ period: string; value: number }>;
} | null {
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.error("No data in SCB response");
    return null;
  }

  // Group values by period (last key element is usually the time period)
  const periodValues: Record<string, number[]> = {};
  
  for (const item of data.data) {
    const period = item.key[item.key.length - 1];
    const value = parseFloat(item.values[0]);
    
    if (!isNaN(value)) {
      if (!periodValues[period]) {
        periodValues[period] = [];
      }
      periodValues[period].push(value);
    }
  }

  // Aggregate based on config
  const aggregatedPeriods: Record<string, number> = {};
  for (const [period, values] of Object.entries(periodValues)) {
    switch (config.aggregation) {
      case 'sum':
        aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0);
        break;
      case 'average':
        aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'latest':
      default:
        aggregatedPeriods[period] = values[values.length - 1];
    }
  }

  // Sort periods chronologically
  const sortedPeriods = Object.keys(aggregatedPeriods).sort();
  
  if (sortedPeriods.length === 0) {
    return null;
  }

  const latestPeriod = sortedPeriods[sortedPeriods.length - 1];
  const previousPeriod = sortedPeriods.length > 1 ? sortedPeriods[sortedPeriods.length - 2] : null;
  
  let latestValue = aggregatedPeriods[latestPeriod];
  let previousValue = previousPeriod ? aggregatedPeriods[previousPeriod] : undefined;

  // Apply multiplier if specified
  if (config.valueMultiplier) {
    latestValue *= config.valueMultiplier;
    if (previousValue !== undefined) {
      previousValue *= config.valueMultiplier;
    }
  }

  return {
    value: latestValue,
    previousValue,
    period: latestPeriod,
    rawValues: sortedPeriods.map(p => ({
      period: p,
      value: aggregatedPeriods[p] * (config.valueMultiplier || 1),
    })),
  };
}

function parsePeriodToDates(period: string): { periodStart: string; periodEnd: string; granularity: string } {
  if (period.includes("M")) {
    // Monthly: 2024M12
    const [year, month] = period.split("M");
    const periodStart = `${year}-${month.padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const periodEnd = `${year}-${month.padStart(2, "0")}-${lastDay}`;
    return { periodStart, periodEnd, granularity: "monthly" };
  } else if (period.includes("K")) {
    // Quarterly: 2024K4
    const [year, quarter] = period.split("K");
    const startMonth = (parseInt(quarter) - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    const periodStart = `${year}-${String(startMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), endMonth, 0).getDate();
    const periodEnd = `${year}-${String(endMonth).padStart(2, "0")}-${lastDay}`;
    return { periodStart, periodEnd, granularity: "quarterly" };
  } else {
    // Yearly
    return { 
      periodStart: `${period}-01-01`, 
      periodEnd: `${period}-12-31`,
      granularity: "yearly"
    };
  }
}

function calculateStatus(value: number, previousValue: number | undefined, kpiCode: string): "positive" | "warning" | "critical" | "neutral" {
  if (!previousValue) return "neutral";
  
  const changePercent = ((value - previousValue) / previousValue) * 100;
  
  // Different thresholds for different KPIs
  const invertedKpis = ["excess_mortality", "long_term_exclusion", "dependency_ratio"];
  const isInverted = invertedKpis.includes(kpiCode);
  
  const effectiveChange = isInverted ? -changePercent : changePercent;
  
  if (effectiveChange > 2) return "positive";
  if (effectiveChange < -2) return "critical";
  if (effectiveChange < -0.5) return "warning";
  return "neutral";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { table_key, fetch_all, dry_run } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all configured tables
    if (fetch_all) {
      const results: Record<string, { success: boolean; value?: number; error?: string }> = {};
      
      for (const [key, config] of Object.entries(TABLE_CONFIGS)) {
        try {
          const scbData = await fetchFromSCB(config);
          const parsed = parseScbResponse(scbData, config);
          
          if (parsed && !dry_run) {
            // Get KPI definition
            const { data: kpiDef } = await supabase
              .from("kpi_definitions")
              .select("id, name, is_inverted")
              .eq("code", config.kpiCode)
              .single();

            if (kpiDef) {
              const { data: dataSource } = await supabase
                .from("data_sources")
                .select("id")
                .eq("code", config.dataSourceCode)
                .single();

              const { periodStart, periodEnd, granularity } = parsePeriodToDates(parsed.period);
              
              // Calculate trend
              let trend: "up" | "down" | "stable" = "stable";
              let trendPercent = 0;
              
              if (parsed.previousValue && parsed.previousValue !== 0) {
                trendPercent = ((parsed.value - parsed.previousValue) / parsed.previousValue) * 100;
                trend = trendPercent > 0.5 ? "up" : trendPercent < -0.5 ? "down" : "stable";
              }

              const status = calculateStatus(parsed.value, parsed.previousValue, config.kpiCode);

              // Check if value already exists for this period
              const { data: existingValue } = await supabase
                .from("kpi_values")
                .select("id")
                .eq("kpi_id", kpiDef.id)
                .eq("period_start", periodStart)
                .eq("period_end", periodEnd)
                .single();

              if (existingValue) {
                // Update existing
                await supabase
                  .from("kpi_values")
                  .update({
                    value: parsed.value,
                    previous_value: parsed.previousValue,
                    trend,
                    trend_percent: trendPercent,
                    status,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", existingValue.id);
              } else {
                // Insert new
                await supabase
                  .from("kpi_values")
                  .insert({
                    kpi_id: kpiDef.id,
                    value: parsed.value,
                    previous_value: parsed.previousValue,
                    trend,
                    trend_percent: trendPercent,
                    status,
                    confidence: 95,
                    period_start: periodStart,
                    period_end: periodEnd,
                    granularity: config.granularity || granularity,
                    data_source_id: dataSource?.id,
                    is_provisional: false,
                  });
              }
            }
          }

          results[key] = { 
            success: true, 
            value: parsed?.value ? Math.round(parsed.value * 1000) / 1000 : undefined 
          };
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
          results[key] = { 
            success: false, 
            error: err instanceof Error ? err.message : "Unknown error" 
          };
        }
        
        // Rate limiting - wait between requests
        await new Promise(r => setTimeout(r, 500));
      }

      return new Response(
        JSON.stringify({
          success: true,
          dry_run: dry_run || false,
          results,
          fetched_at: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single table fetch
    if (table_key && TABLE_CONFIGS[table_key]) {
      const config = TABLE_CONFIGS[table_key];
      
      try {
        const scbData = await fetchFromSCB(config);
        const parsed = parseScbResponse(scbData, config);

        if (parsed) {
          let trend: "up" | "down" | "stable" = "stable";
          let trendPercent = 0;
          
          if (parsed.previousValue && parsed.previousValue !== 0) {
            trendPercent = ((parsed.value - parsed.previousValue) / parsed.previousValue) * 100;
            trend = trendPercent > 0.5 ? "up" : trendPercent < -0.5 ? "down" : "stable";
          }

          const { data: kpiDef } = await supabase
            .from("kpi_definitions")
            .select("id, name")
            .eq("code", config.kpiCode)
            .single();

          let inserted = false;
          if (kpiDef && !dry_run) {
            const { data: dataSource } = await supabase
              .from("data_sources")
              .select("id")
              .eq("code", config.dataSourceCode)
              .single();

            const { periodStart, periodEnd, granularity } = parsePeriodToDates(parsed.period);
            const status = calculateStatus(parsed.value, parsed.previousValue, config.kpiCode);

            const { error: insertError } = await supabase
              .from("kpi_values")
              .insert({
                kpi_id: kpiDef.id,
                value: parsed.value,
                previous_value: parsed.previousValue,
                trend,
                trend_percent: trendPercent,
                status,
                confidence: 95,
                period_start: periodStart,
                period_end: periodEnd,
                granularity: config.granularity || granularity,
                data_source_id: dataSource?.id,
                is_provisional: false,
              });

            if (!insertError) {
              inserted = true;
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              source: "SCB",
              table: table_key,
              kpi_code: config.kpiCode,
              kpi_name: kpiDef?.name,
              value: Math.round(parsed.value * 1000) / 1000,
              previous_value: parsed.previousValue ? Math.round(parsed.previousValue * 1000) / 1000 : null,
              unit: config.unit,
              trend,
              trend_percent: Math.round(trendPercent * 100) / 100,
              period: parsed.period,
              inserted,
              dry_run: dry_run || false,
              historical_values: parsed.rawValues.slice(-10).map(v => ({
                period: v.period,
                value: Math.round(v.value * 1000) / 1000,
              })),
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: "Kunde inte tolka SCB-data",
            raw_columns: scbData.columns,
            data_count: scbData.data?.length || 0,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (fetchError) {
        console.error("SCB fetch error:", fetchError);
        return new Response(
          JSON.stringify({
            success: false,
            error: fetchError instanceof Error ? fetchError.message : "SCB fetch failed",
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // List available tables
    return new Response(
      JSON.stringify({
        message: "SCB PxWebApi Integration - Nationellt Ledningssystem",
        available_tables: Object.entries(TABLE_CONFIGS).map(([key, config]) => ({
          key,
          path: config.path,
          description: config.description,
          kpi_code: config.kpiCode,
          unit: config.unit,
          granularity: config.granularity,
        })),
        usage: {
          single: 'POST med { "table_key": "life_expectancy" } för att hämta en tabell',
          all: 'POST med { "fetch_all": true } för att hämta alla tabeller',
          dry_run: 'Lägg till "dry_run": true för att testa utan att spara till databasen',
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("scb-fetch error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Okänt fel",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
