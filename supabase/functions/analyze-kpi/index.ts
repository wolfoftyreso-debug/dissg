import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Analysmotortyper
type AnalysisMethod = 
  | 'trend_detection'
  | 'change_point_detection'
  | 'correlation_analysis'
  | 'lag_analysis';

interface AnalysisResult {
  observation_type: string;
  title: string;
  description: string;
  signal_strength: number;
  confidence_level: number;
  method_used: AnalysisMethod;
  method_rationale: string;
  factors: FactorResult[];
}

interface FactorResult {
  factor_name: string;
  factor_kpi_code?: string;
  contribution_strength: number;
  time_relation: string;
  stability_score: number;
  uncertainty: number;
  description: string;
}

// Observationsspråk - genererar alltid neutrala beskrivningar
const generateObservationLanguage = {
  trendDeviation: (kpiName: string, weeks: number, direction: 'up' | 'down') => 
    `Indikatorn har ${direction === 'down' ? 'försämrats' : 'förbättrats'} kontinuerligt i ${weeks} veckor.`,
  
  thresholdBreach: (kpiName: string, threshold: number, direction: 'above' | 'below') =>
    `Värdet har passerat ${direction === 'above' ? 'över' : 'under'} tröskelvärdet ${threshold}.`,
  
  correlationDetected: (kpi1: string, kpi2: string) =>
    `Korrelation observerad mellan ${kpi1} och ${kpi2}. Kausalitet ej fastställd.`,
  
  lagSignal: (kpiName: string, lagMonths: number, leadingIndicator: string) =>
    `Mönstret sammanfaller med ${leadingIndicator}. Förändringen föregicks med ${lagMonths} månader.`,
  
  noDecisions: (kpiName: string, periodDays: number) =>
    `Inga registrerade förändringar eller beslut har kopplats till indikatorn under de senaste ${periodDays} dagarna.`,
};

// Trendanalys
function analyzeTrend(values: number[]): { 
  direction: 'up' | 'down' | 'stable';
  strength: number;
  consecutiveWeeks: number;
} {
  if (values.length < 3) {
    return { direction: 'stable', strength: 0, consecutiveWeeks: 0 };
  }
  
  // Beräkna riktning och konsekutiva perioder
  let consecutiveUp = 0;
  let consecutiveDown = 0;
  
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff > 0) {
      consecutiveUp++;
      consecutiveDown = 0;
    } else if (diff < 0) {
      consecutiveDown++;
      consecutiveUp = 0;
    }
  }
  
  const direction = consecutiveUp > consecutiveDown ? 'up' : 
                    consecutiveDown > consecutiveUp ? 'down' : 'stable';
  
  const maxConsecutive = Math.max(consecutiveUp, consecutiveDown);
  const strength = Math.min(100, (maxConsecutive / values.length) * 100 + 20);
  
  return {
    direction,
    strength,
    consecutiveWeeks: maxConsecutive,
  };
}

// Förändringspunktsdetektion (enkel CUSUM-variant)
function detectChangePoint(values: number[]): {
  detected: boolean;
  index: number | null;
  significance: number;
} {
  if (values.length < 5) {
    return { detected: false, index: null, significance: 0 };
  }
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  );
  
  if (std === 0) {
    return { detected: false, index: null, significance: 0 };
  }
  
  // CUSUM
  let cusum = 0;
  let maxCusum = 0;
  let maxIndex = 0;
  
  for (let i = 0; i < values.length; i++) {
    cusum += (values[i] - mean) / std;
    if (Math.abs(cusum) > maxCusum) {
      maxCusum = Math.abs(cusum);
      maxIndex = i;
    }
  }
  
  const threshold = 2.5; // ~95% confidence
  const detected = maxCusum > threshold;
  
  return {
    detected,
    index: detected ? maxIndex : null,
    significance: Math.min(100, (maxCusum / threshold) * 50 + 50),
  };
}

// Korrelationsanalys
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 3) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// Lag-analys (cross-correlation)
function analyzeLag(leading: number[], lagging: number[], maxLag: number = 6): {
  bestLag: number;
  correlation: number;
} {
  let bestLag = 0;
  let bestCorr = 0;
  
  for (let lag = 0; lag <= maxLag; lag++) {
    if (lag >= leading.length) break;
    
    const leadingSlice = leading.slice(0, leading.length - lag);
    const laggingSlice = lagging.slice(lag);
    
    const minLen = Math.min(leadingSlice.length, laggingSlice.length);
    const corr = calculateCorrelation(
      leadingSlice.slice(0, minLen),
      laggingSlice.slice(0, minLen)
    );
    
    if (Math.abs(corr) > Math.abs(bestCorr)) {
      bestCorr = corr;
      bestLag = lag;
    }
  }
  
  return { bestLag, correlation: bestCorr };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kpi_id, analysis_type } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta KPI-definition
    const { data: kpiDef, error: kpiError } = await supabase
      .from('kpi_definitions')
      .select('*')
      .eq('id', kpi_id)
      .single();

    if (kpiError || !kpiDef) {
      throw new Error(`KPI not found: ${kpi_id}`);
    }

    // Hämta historiska värden
    const { data: values, error: valuesError } = await supabase
      .from('kpi_values')
      .select('*')
      .eq('kpi_id', kpi_id)
      .eq('granularity', 'national')
      .order('period_end', { ascending: true })
      .limit(24); // 2 år månatlig data

    if (valuesError) {
      throw new Error(`Failed to fetch values: ${valuesError.message}`);
    }

    const numericValues = values?.map(v => Number(v.value)) || [];
    
    if (numericValues.length < 3) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Otillräcklig data för analys (minimum 3 datapunkter krävs)',
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Kör analyser
    const trendResult = analyzeTrend(numericValues);
    const changePointResult = detectChangePoint(numericValues);
    
    // Bestäm vilken typ av observation som ska skapas
    let observationType: string;
    let title: string;
    let description: string;
    let signalStrength: number;
    let methodUsed: AnalysisMethod;
    let methodRationale: string;

    if (changePointResult.detected && changePointResult.significance > 70) {
      observationType = 'threshold_breach';
      title = `Förändringspunkt detekterad i ${kpiDef.name}`;
      description = `Data indikerar ett regimskifte i tidsserien. ${generateObservationLanguage.noDecisions(kpiDef.name, 90)}`;
      signalStrength = changePointResult.significance;
      methodUsed = 'change_point_detection';
      methodRationale = 'CUSUM-analys valdes på grund av tidsseriens karaktär med potentiella strukturella brott.';
    } else if (trendResult.consecutiveWeeks >= 4) {
      observationType = 'trend_deviation';
      title = `${kpiDef.name} avviker från historisk trend`;
      description = generateObservationLanguage.trendDeviation(
        kpiDef.name, 
        trendResult.consecutiveWeeks,
        trendResult.direction as 'up' | 'down'
      );
      signalStrength = trendResult.strength;
      methodUsed = 'trend_detection';
      methodRationale = 'Trendanalys valdes för att identifiera ihållande förändringsmönster.';
    } else {
      // Ingen signifikant observation
      return new Response(
        JSON.stringify({
          success: true,
          observation_created: false,
          message: 'Inga signifikanta avvikelser detekterade',
          analysis_summary: {
            trend: trendResult,
            change_point: changePointResult,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Beräkna konfidensintervall baserat på datakvalitet
    const latestValue = values?.[values.length - 1];
    const confidenceLevel = latestValue?.confidence || 75;

    // Skapa observation
    const { data: observation, error: obsError } = await supabase
      .from('observations')
      .insert({
        observation_type: observationType,
        title,
        description,
        kpi_id,
        kpi_value_id: latestValue?.id,
        signal_strength: signalStrength,
        confidence_level: confidenceLevel,
        observation_period_start: values?.[0]?.period_start,
        observation_period_end: latestValue?.period_end,
        status: 'completed',
        analysis_version: '2.1',
        model_version: '1.0.3',
      })
      .select()
      .single();

    if (obsError) {
      console.error('Failed to create observation:', obsError);
      throw new Error(`Failed to create observation: ${obsError.message}`);
    }

    // Skapa analyskedja (nivå 1-2)
    const analysisChains = [
      {
        observation_id: observation.id,
        level: 1,
        level_title: 'Analysöversikt',
        level_content: {
          summary: description,
          change_description: `Värdet har förändrats från ${numericValues[0].toFixed(2)} till ${numericValues[numericValues.length - 1].toFixed(2)}.`,
          signal_strength: signalStrength,
          confidence: confidenceLevel,
          top_factors: [
            'Trendförändring över tid',
            changePointResult.detected ? 'Strukturellt brott detekterat' : 'Ingen strukturell förändring',
          ],
        },
        sequence_order: 0,
      },
      {
        observation_id: observation.id,
        level: 2,
        level_title: 'Rotorsaksanalys',
        level_content: {
          method_description: `Analysen använder ${methodUsed} för att identifiera mönster i tidsserien.`,
          why_chosen: methodRationale,
          statistical_details: {
            data_points: numericValues.length,
            trend_direction: trendResult.direction,
            consecutive_periods: trendResult.consecutiveWeeks,
          },
        },
        analysis_method: methodUsed,
        method_rationale: methodRationale,
        alternatives_tested: [
          {
            method: methodUsed === 'trend_detection' ? 'change_point_detection' : 'trend_detection',
            reason_rejected: 'Alternativ metod gav svagare signal',
          },
        ],
        sequence_order: 0,
      },
    ];

    const { error: chainError } = await supabase
      .from('analysis_chains')
      .insert(analysisChains);

    if (chainError) {
      console.error('Failed to create analysis chains:', chainError);
    }

    // Logga i audit log
    await supabase
      .from('analysis_audit_log')
      .insert({
        entity_type: 'observation',
        entity_id: observation.id,
        action: 'created',
        actor: 'analyze-kpi-function',
        entity_snapshot: observation,
        context: {
          kpi_code: kpiDef.code,
          method_used: methodUsed,
          data_points_analyzed: numericValues.length,
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        observation_created: true,
        observation: {
          id: observation.id,
          type: observationType,
          title,
          description,
          signal_strength: signalStrength,
          confidence_level: confidenceLevel,
        },
        analysis_summary: {
          method: methodUsed,
          trend: trendResult,
          change_point: changePointResult,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-kpi error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Okänt fel",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
