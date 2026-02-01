import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════
// KPI DATA INGEST - Hämtar data från svenska myndighets-API:er
// ═══════════════════════════════════════════════════════════════

interface IngestRequest {
  sourceCode: string;
  forceRefresh?: boolean;
}

interface IngestResult {
  success: boolean;
  sourceCode: string;
  recordsProcessed: number;
  errors: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sourceCode, forceRefresh = false }: IngestRequest = await req.json();

    console.log(`[INGEST] Starting ingest for source: ${sourceCode}`);

    // Get data source config
    const { data: dataSource, error: sourceError } = await supabase
      .from("data_sources")
      .select("*")
      .eq("code", sourceCode)
      .single();

    if (sourceError || !dataSource) {
      throw new Error(`Data source not found: ${sourceCode}`);
    }

    // Log ingest start
    const { data: ingestLog } = await supabase
      .from("ingest_log")
      .insert({
        data_source_id: dataSource.id,
        status: "running",
      })
      .select()
      .single();

    let result: IngestResult;

    try {
      // Route to appropriate handler based on source
      switch (sourceCode) {
        case "scb_px":
        case "scb_aku":
          result = await ingestSCB(supabase, dataSource);
          break;
        case "sos_dodsorsaker":
        case "sos_slutenvard":
          result = await ingestSocialstyrelsen(supabase, dataSource);
          break;
        case "bra_brott":
          result = await ingestBRA(supabase, dataSource);
          break;
        case "skr_vantetider":
          result = await ingestSKR(supabase, dataSource);
          break;
        case "af_statistik":
          result = await ingestArbetsformedlingen(supabase, dataSource);
          break;
        case "svk_energi":
          result = await ingestSvenskakraftnat(supabase, dataSource);
          break;
        default:
          // For calculated/internal sources, run calculation
          if (dataSource.source_type === "calculated") {
            result = await calculateDerivedKPI(supabase, dataSource);
          } else {
            throw new Error(`Unknown source handler: ${sourceCode}`);
          }
      }

      // Update ingest log on success
      await supabase
        .from("ingest_log")
        .update({
          completed_at: new Date().toISOString(),
          status: result.errors.length > 0 ? "partial" : "success",
          records_fetched: result.recordsProcessed,
          records_inserted: result.recordsProcessed,
          error_message: result.errors.length > 0 ? result.errors.join("; ") : null,
        })
        .eq("id", ingestLog?.id);

      // Update data source last fetch
      await supabase
        .from("data_sources")
        .update({
          last_successful_fetch: new Date().toISOString(),
          last_fetch_error: null,
        })
        .eq("id", dataSource.id);

    } catch (ingestError) {
      // Update ingest log on failure
      const errorMessage = ingestError instanceof Error ? ingestError.message : "Unknown error";
      
      await supabase
        .from("ingest_log")
        .update({
          completed_at: new Date().toISOString(),
          status: "failed",
          error_message: errorMessage,
        })
        .eq("id", ingestLog?.id);

      await supabase
        .from("data_sources")
        .update({
          last_fetch_error: errorMessage,
        })
        .eq("id", dataSource.id);

      throw ingestError;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[INGEST] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// ═══════════════════════════════════════════════════════════════
// SOURCE-SPECIFIC HANDLERS
// ═══════════════════════════════════════════════════════════════

async function ingestSCB(supabase: any, dataSource: any): Promise<IngestResult> {
  // SCB PX-Web API implementation
  // In production, this would make actual API calls
  console.log(`[SCB] Fetching from ${dataSource.base_url}${dataSource.api_endpoint}`);
  
  // Simulated response for demo
  const mockData = {
    value: [83.2, 83.1, 83.0],
    dimension: {
      Tid: { category: { label: { "2025M01": "2025M01", "2024M12": "2024M12", "2024M11": "2024M11" } } }
    }
  };

  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: mockData.value.length,
    errors: [],
  };
}

async function ingestSocialstyrelsen(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[SOS] Fetching from ${dataSource.base_url}${dataSource.api_endpoint}`);
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 0,
    errors: ["API endpoint pending implementation"],
  };
}

async function ingestBRA(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[BRÅ] Fetching from ${dataSource.base_url}`);
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 0,
    errors: ["API endpoint pending implementation"],
  };
}

async function ingestSKR(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[SKR] Fetching from ${dataSource.base_url}`);
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 0,
    errors: ["API endpoint pending implementation"],
  };
}

async function ingestArbetsformedlingen(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[AF] Fetching from ${dataSource.base_url}`);
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 0,
    errors: ["API endpoint pending implementation"],
  };
}

async function ingestSvenskakraftnat(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[SVK] Fetching from ${dataSource.base_url}`);
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 0,
    errors: ["API endpoint pending implementation"],
  };
}

async function calculateDerivedKPI(supabase: any, dataSource: any): Promise<IngestResult> {
  console.log(`[CALC] Calculating derived KPI: ${dataSource.code}`);
  
  // Get calculation config from metadata
  const metadata = dataSource.metadata || {};
  
  if (dataSource.code === "internal_stress") {
    // Systemstress-index: Weighted average of KPIs 2, 6, 10, 13
    // Implementation would fetch latest values and compute weighted score
  }
  
  if (dataSource.code === "internal_divergence") {
    // Regional divergence: Standard deviation across regions
    // Implementation would compute std dev of regional values
  }
  
  return {
    success: true,
    sourceCode: dataSource.code,
    recordsProcessed: 1,
    errors: [],
  };
}
