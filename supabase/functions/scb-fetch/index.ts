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
  query: {
    query: Array<{ code: string; selection: { filter: string; values: string[] } }>;
    response: { format: string };
  };
  valueMultiplier?: number;
  unit?: string;
}

// Table mappings with predefined queries - all required variables must be specified
const TABLE_CONFIGS: Record<string, TableConfig> = {
  // Folkmängd per månad - befolkningsstatistik
  population: {
    path: "BE/BE0101/BE0101A/BefolkManad",
    description: "Folkmängden i Sverige per månad",
    kpiCode: "A1",
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } }, // Riket
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } }, // Män och kvinnor
        { code: "ContentsCode", selection: { filter: "item", values: ["000003O5"] } }, // Antal
        { code: "Tid", selection: { filter: "top", values: ["2"] } }, // Senaste 2 månaderna
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.000001, // Konvertera till miljoner
    unit: "miljoner",
  },
  // Folkmängd per år - enklare tabell
  population_yearly: {
    path: "BE/BE0101/BE0101A/BefolkningR1860N",
    description: "Folkmängden i Sverige per år",
    kpiCode: "A1",
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000005IY"] } },
        { code: "Tid", selection: { filter: "top", values: ["2"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.000001,
    unit: "miljoner",
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
    throw new Error(`SCB API error: ${response.status} - ${errorText.substring(0, 200)}`);
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

  // Group and sum values by period (last key element is usually the time period)
  const periodValues: Record<string, number> = {};
  
  for (const item of data.data) {
    const period = item.key[item.key.length - 1];
    const value = parseFloat(item.values[0]);
    
    if (!isNaN(value)) {
      periodValues[period] = (periodValues[period] || 0) + value;
    }
  }

  // Sort periods
  const sortedPeriods = Object.keys(periodValues).sort();
  
  if (sortedPeriods.length === 0) {
    return null;
  }

  const latestPeriod = sortedPeriods[sortedPeriods.length - 1];
  const previousPeriod = sortedPeriods.length > 1 ? sortedPeriods[sortedPeriods.length - 2] : null;
  
  let latestValue = periodValues[latestPeriod];
  let previousValue = previousPeriod ? periodValues[previousPeriod] : undefined;

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
      value: periodValues[p] * (config.valueMultiplier || 1),
    })),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { table_key } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If specific table requested
    if (table_key && TABLE_CONFIGS[table_key]) {
      const config = TABLE_CONFIGS[table_key];
      
      try {
        const scbData = await fetchFromSCB(config);
        const parsed = parseScbResponse(scbData, config);

        if (parsed) {
          // Calculate trend
          let trend: "up" | "down" | "stable" = "stable";
          let trendPercent = 0;
          
          if (parsed.previousValue && parsed.previousValue !== 0) {
            trendPercent = ((parsed.value - parsed.previousValue) / parsed.previousValue) * 100;
            trend = trendPercent > 0.5 ? "up" : trendPercent < -0.5 ? "down" : "stable";
          }

          // Get KPI definition
          const { data: kpiDef } = await supabase
            .from("kpi_definitions")
            .select("id, name")
            .eq("code", config.kpiCode)
            .single();

          let inserted = false;
          if (kpiDef) {
            // Get data source
            const { data: dataSource } = await supabase
              .from("data_sources")
              .select("id")
              .eq("code", "SCB")
              .single();

            // Parse period to dates
            let periodStart: string;
            let periodEnd: string;
            
            if (parsed.period.includes("M")) {
              // Monthly data: 2024M12
              const [year, month] = parsed.period.split("M");
              periodStart = `${year}-${month.padStart(2, "0")}-01`;
              const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
              periodEnd = `${year}-${month.padStart(2, "0")}-${lastDay}`;
            } else if (parsed.period.includes("K")) {
              // Quarterly data: 2024K4
              const [year, quarter] = parsed.period.split("K");
              const startMonth = (parseInt(quarter) - 1) * 3 + 1;
              const endMonth = startMonth + 2;
              periodStart = `${year}-${String(startMonth).padStart(2, "0")}-01`;
              const lastDay = new Date(parseInt(year), endMonth, 0).getDate();
              periodEnd = `${year}-${String(endMonth).padStart(2, "0")}-${lastDay}`;
            } else {
              // Yearly data
              periodStart = `${parsed.period}-01-01`;
              periodEnd = `${parsed.period}-12-31`;
            }

            // Insert new KPI value
            const { data: insertedValue, error: insertError } = await supabase
              .from("kpi_values")
              .insert({
                kpi_id: kpiDef.id,
                value: parsed.value,
                previous_value: parsed.previousValue,
                trend,
                trend_percent: trendPercent,
                status: "neutral",
                confidence: 95,
                period_start: periodStart,
                period_end: periodEnd,
                granularity: "national",
                data_source_id: dataSource?.id,
                is_provisional: false,
              })
              .select()
              .single();

            if (insertError) {
              console.error("Insert error:", insertError);
            } else {
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
              value: Math.round(parsed.value * 100) / 100,
              previous_value: parsed.previousValue ? Math.round(parsed.previousValue * 100) / 100 : null,
              unit: config.unit,
              trend,
              trend_percent: Math.round(trendPercent * 100) / 100,
              period: parsed.period,
              inserted,
              historical_values: parsed.rawValues.slice(-5).map(v => ({
                period: v.period,
                value: Math.round(v.value * 100) / 100,
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
        message: "SCB PxWebApi Integration",
        available_tables: Object.entries(TABLE_CONFIGS).map(([key, config]) => ({
          key,
          path: config.path,
          description: config.description,
          kpi_code: config.kpiCode,
          unit: config.unit,
        })),
        usage: 'POST med { "table_key": "population" } för att hämta data',
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
