import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════
// SCHEDULED INGEST - Körs automatiskt varje dag via pg_cron
// ═══════════════════════════════════════════════════════════════
//
// Denna funktion:
// 1. Hämtar alla aktiva datakällor som ska uppdateras
// 2. Anropar respektive API (SCB, Kolada, etc.)
// 3. Uppdaterar kpi_values tabellen
// 4. Loggar all aktivitet till ingest_log
//
// ═══════════════════════════════════════════════════════════════

interface ScheduleConfig {
  daily: string[];      // Hämtas varje dag
  weekly: string[];     // Hämtas varje måndag
  monthly: string[];    // Hämtas första dagen i månaden
}

// Vilka tabeller som ska hämtas när
const SCHEDULE_CONFIG: ScheduleConfig = {
  daily: [
    // Realtidsdata - hämtas dagligen
    "grid_frequency",
    "electricity_price",
  ],
  weekly: [
    // Arbetsmarknadsdata - uppdateras veckovis
    "employment_rate",
    "employed_total",
    "unemployed_total",
    "employment_by_gender",
    "employment_by_age",
    "hours_worked",
  ],
  monthly: [
    // Ekonomisk data - uppdateras månadsvis
    "gdp_current_prices",
    "gdp_constant_prices",
    "gdp_per_capita",
    "gdp_growth_rate",
    "population_total",
    "population_by_age",
    "population_growth",
    "life_expectancy",
    "fertility_rate",
    "migration_net",
    "dependency_ratio",
    "health_cost",
    // Brottsstatistik - uppdateras månadsvis
    "crimes_reported",
    "violent_crimes_assault",
    "homicides",
    "sexual_crimes",
    "theft_robbery",
    "prison_population",
  ],
};

interface IngestResult {
  table: string;
  success: boolean;
  recordsProcessed: number;
  error?: string;
  duration_ms: number;
}

interface ScheduledIngestResponse {
  triggered_at: string;
  schedule_type: "daily" | "weekly" | "monthly" | "manual";
  tables_processed: number;
  results: IngestResult[];
  total_duration_ms: number;
  next_run?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const results: IngestResult[] = [];

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Bestäm vilken typ av körning detta är
    let scheduleType: "daily" | "weekly" | "monthly" | "manual" = "daily";
    let tablesToFetch: string[] = [];

    // Kolla om det är manuell körning med specifika tabeller
    let body: any = {};
    try {
      const text = await req.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // Ingen body - använd default
    }

    if (body.tables && Array.isArray(body.tables)) {
      // Manuell körning med specifika tabeller
      tablesToFetch = body.tables;
      scheduleType = "manual";
    } else if (body.schedule_type) {
      scheduleType = body.schedule_type;
    } else {
      // Automatisk schemaläggning - kolla vilken dag det är
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = söndag, 1 = måndag
      const dayOfMonth = now.getDate();

      // Alltid kör dagliga
      tablesToFetch = [...SCHEDULE_CONFIG.daily];

      // Måndagar: kör veckotabeller
      if (dayOfWeek === 1) {
        tablesToFetch = [...tablesToFetch, ...SCHEDULE_CONFIG.weekly];
        scheduleType = "weekly";
      }

      // Första dagen i månaden: kör månadstabeller
      if (dayOfMonth === 1) {
        tablesToFetch = [...tablesToFetch, ...SCHEDULE_CONFIG.monthly];
        scheduleType = "monthly";
      }
    }

    console.log(`[SCHEDULED-INGEST] Starting ${scheduleType} ingest for ${tablesToFetch.length} tables`);

    // Logga scheduled run
    const { data: runLog } = await supabase
      .from("ingest_log")
      .insert({
        data_source_id: await getOrCreateScheduledSource(supabase),
        status: "running",
        metadata: { 
          schedule_type: scheduleType, 
          tables: tablesToFetch,
          triggered_at: new Date().toISOString()
        },
      })
      .select()
      .single();

    // Hämta data för varje tabell
    for (const table of tablesToFetch) {
      const tableStart = Date.now();
      
      try {
        // Anropa scb-fetch edge function
        const response = await fetch(`${supabaseUrl}/functions/v1/scb-fetch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ table }),
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          // Spara data till kpi_values
          const saveResult = await saveKPIValues(supabase, table, result);
          
          results.push({
            table,
            success: true,
            recordsProcessed: saveResult.recordsInserted,
            duration_ms: Date.now() - tableStart,
          });
        } else {
          results.push({
            table,
            success: false,
            recordsProcessed: 0,
            error: result.error || "Unknown error from scb-fetch",
            duration_ms: Date.now() - tableStart,
          });
        }
      } catch (err) {
        results.push({
          table,
          success: false,
          recordsProcessed: 0,
          error: err instanceof Error ? err.message : "Unknown error",
          duration_ms: Date.now() - tableStart,
        });
      }

      // Liten paus mellan anrop för att inte överbelasta API:er
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Uppdatera logg med resultat
    const successCount = results.filter(r => r.success).length;
    const totalRecords = results.reduce((sum, r) => sum + r.recordsProcessed, 0);
    
    if (runLog) {
      await supabase
        .from("ingest_log")
        .update({
          completed_at: new Date().toISOString(),
          status: successCount === results.length ? "success" : 
                  successCount > 0 ? "partial" : "failed",
          records_fetched: totalRecords,
          records_inserted: totalRecords,
          metadata: {
            schedule_type: scheduleType,
            tables: tablesToFetch,
            results: results,
            duration_ms: Date.now() - startTime,
          },
        })
        .eq("id", runLog.id);
    }

    // Beräkna nästa körning
    const nextRun = calculateNextRun(scheduleType);

    const response: ScheduledIngestResponse = {
      triggered_at: new Date().toISOString(),
      schedule_type: scheduleType,
      tables_processed: tablesToFetch.length,
      results,
      total_duration_ms: Date.now() - startTime,
      next_run: nextRun,
    };

    console.log(`[SCHEDULED-INGEST] Completed: ${successCount}/${results.length} successful, ${totalRecords} records`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[SCHEDULED-INGEST] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration_ms: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

async function getOrCreateScheduledSource(supabase: any): Promise<string> {
  // Hämta eller skapa en "scheduled" datakälla för loggning
  const { data: existing } = await supabase
    .from("data_sources")
    .select("id")
    .eq("code", "scheduled_ingest")
    .single();

  if (existing) return existing.id;

  const { data: created } = await supabase
    .from("data_sources")
    .insert({
      code: "scheduled_ingest",
      name: "Schemalagd datahämtning",
      description: "Automatisk daglig/veckovis/månadsvis datahämtning",
      source_type: "api",
      update_frequency: "daily",
      is_active: true,
      reliability_score: 95,
    })
    .select()
    .single();

  return created?.id || "unknown";
}

interface SaveResult {
  recordsInserted: number;
  recordsUpdated: number;
}

async function saveKPIValues(
  supabase: any, 
  table: string, 
  result: any
): Promise<SaveResult> {
  // Mappa table till KPI och spara värden
  const kpiCode = result.metadata?.kpiCode || table;
  
  // Hitta KPI-definition
  const { data: kpiDef } = await supabase
    .from("kpi_definitions")
    .select("id")
    .eq("code", kpiCode)
    .single();

  if (!kpiDef) {
    console.warn(`[SAVE] No KPI definition found for code: ${kpiCode}`);
    return { recordsInserted: 0, recordsUpdated: 0 };
  }

  // Hitta datakälla
  const { data: dataSource } = await supabase
    .from("data_sources")
    .select("id")
    .eq("code", result.metadata?.dataSourceCode || "scb_px")
    .single();

  let recordsInserted = 0;
  let recordsUpdated = 0;

  // Processa varje datapunkt
  if (Array.isArray(result.data)) {
    for (const point of result.data) {
      // Bestäm period baserat på granularity
      const periodStart = parsePeriodStart(point.period);
      const periodEnd = parsePeriodEnd(point.period, result.metadata?.granularity);

      // Upsert värde
      const { data: existing } = await supabase
        .from("kpi_values")
        .select("id, value")
        .eq("kpi_id", kpiDef.id)
        .eq("period_start", periodStart)
        .eq("region_code", point.region || "00")
        .single();

      if (existing) {
        // Uppdatera om värdet ändrats
        if (existing.value !== point.value) {
          await supabase
            .from("kpi_values")
            .update({
              value: point.value,
              previous_value: existing.value,
              updated_at: new Date().toISOString(),
              is_provisional: false,
            })
            .eq("id", existing.id);
          recordsUpdated++;
        }
      } else {
        // Skapa nytt värde
        await supabase
          .from("kpi_values")
          .insert({
            kpi_id: kpiDef.id,
            data_source_id: dataSource?.id,
            value: point.value,
            period_start: periodStart,
            period_end: periodEnd,
            region_code: point.region || "00",
            granularity: result.metadata?.granularity || "monthly",
            confidence: 85,
            status: "neutral",
            trend: "stable",
            raw_data: { source_table: table, original: point },
          });
        recordsInserted++;
      }
    }
  }

  return { recordsInserted, recordsUpdated };
}

function parsePeriodStart(period: string): string {
  // Hantera olika periodformat
  // "2025M01" -> "2025-01-01"
  // "2025K1" -> "2025-01-01"
  // "2025" -> "2025-01-01"
  
  if (period.includes("M")) {
    const [year, month] = period.split("M");
    return `${year}-${month.padStart(2, "0")}-01`;
  }
  
  if (period.includes("K")) {
    const [year, quarter] = period.split("K");
    const month = ((parseInt(quarter) - 1) * 3 + 1).toString().padStart(2, "0");
    return `${year}-${month}-01`;
  }
  
  return `${period}-01-01`;
}

function parsePeriodEnd(period: string, granularity?: string): string {
  const start = new Date(parsePeriodStart(period));
  
  if (granularity === "yearly" || !period.includes("M") && !period.includes("K")) {
    start.setFullYear(start.getFullYear() + 1);
    start.setDate(start.getDate() - 1);
  } else if (granularity === "quarterly" || period.includes("K")) {
    start.setMonth(start.getMonth() + 3);
    start.setDate(start.getDate() - 1);
  } else {
    start.setMonth(start.getMonth() + 1);
    start.setDate(start.getDate() - 1);
  }
  
  return start.toISOString().split("T")[0];
}

function calculateNextRun(currentType: string): string {
  const now = new Date();
  
  // Nästa körning är alltid kl 06:00
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(6, 0, 0, 0);
  
  return next.toISOString();
}
