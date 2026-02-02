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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if single KPI analysis or batch
    let body: { kpi_id?: string; batch?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      body = { batch: true }; // Default to batch mode
    }

    // BATCH MODE - analyze all KPIs
    if (body.batch || !body.kpi_id) {
      console.log('Starting batch KPI analysis...');

      // Fetch all active KPI definitions
      const { data: kpiDefs, error: defError } = await supabase
        .from('kpi_definitions')
        .select('*')
        .eq('is_active', true);

      if (defError) throw defError;
      console.log(`Found ${kpiDefs?.length || 0} active KPI definitions`);

      // Fetch all KPI values
      const { data: allValues, error: valError } = await supabase
        .from('kpi_values')
        .select('*')
        .order('period_end', { ascending: false });

      if (valError) throw valError;
      console.log(`Found ${allValues?.length || 0} KPI values`);

      const observations: Array<{
        kpi_id: string;
        kpi_value_id: string | null;
        title: string;
        description: string;
        observation_type: string;
        confidence_level: number;
        signal_strength: number;
        observation_period_start: string;
        observation_period_end: string;
        status: string;
        model_version: string;
        analysis_version: string;
      }> = [];

      const kpiDefMap = new Map(kpiDefs?.map(d => [d.id, d]) || []);

      // Group values by KPI
      const valuesByKpi = new Map<string, typeof allValues>();
      for (const val of allValues || []) {
        const existing = valuesByKpi.get(val.kpi_id) || [];
        existing.push(val);
        valuesByKpi.set(val.kpi_id, existing);
      }

      // Analyze each KPI
      for (const [kpiId, values] of valuesByKpi) {
        const kpiDef = kpiDefMap.get(kpiId);
        if (!kpiDef || !values?.length) continue;

        // Sort by date descending
        values.sort((a, b) => new Date(b.period_end).getTime() - new Date(a.period_end).getTime());
        const latest = values[0];
        if (!latest) continue;

        const numericValues = values.map(v => Number(v.value));

        // Analysis 1: Significant trend change
        if (latest.trend_percent !== null && Math.abs(Number(latest.trend_percent)) >= 5) {
          const trendPct = Number(latest.trend_percent);
          const severity = Math.abs(trendPct) >= 50 ? 'Kritisk' :
                          Math.abs(trendPct) >= 15 ? 'Betydande' : 'Märkbar';
          const direction = latest.trend === 'up' ? 'ökning' : 'minskning';
          const isDeterioration = kpiDef.is_inverted ? latest.trend === 'up' : latest.trend === 'down';

          observations.push({
            kpi_id: kpiId,
            kpi_value_id: latest.id,
            title: `${severity === 'Kritisk' ? '⚠️' : severity === 'Betydande' ? '⚡' : '📊'} ${severity} ${direction}: ${kpiDef.name}`,
            description: `${kpiDef.name} har ${isDeterioration ? 'försämrats' : 'förbättrats'} med ${Math.abs(trendPct).toFixed(1)}% jämfört med föregående period. Nuvarande värde: ${Number(latest.value).toFixed(2)}.${latest.previous_value ? ` Tidigare: ${Number(latest.previous_value).toFixed(2)}.` : ''}`,
            observation_type: 'trend_deviation',
            confidence_level: Number(latest.confidence) / 100,
            signal_strength: Math.min(Math.abs(trendPct) / 100, 1),
            observation_period_start: latest.period_start,
            observation_period_end: latest.period_end,
            status: 'pending',
            model_version: '1.0.3',
            analysis_version: '2026-02-02',
          });
        }

        // Analysis 2: Critical status
        if (latest.status === 'critical') {
          observations.push({
            kpi_id: kpiId,
            kpi_value_id: latest.id,
            title: `🔴 Kritisk nivå: ${kpiDef.name}`,
            description: `${kpiDef.name} har nått kritisk nivå (${Number(latest.value).toFixed(2)}). Detta kräver omedelbar uppmärksamhet.`,
            observation_type: 'threshold_breach',
            confidence_level: Number(latest.confidence) / 100,
            signal_strength: 0.9,
            observation_period_start: latest.period_start,
            observation_period_end: latest.period_end,
            status: 'pending',
            model_version: '1.0.3',
            analysis_version: '2026-02-02',
          });
        }

        // Analysis 3: Anomaly detection
        if (numericValues.length >= 6) {
          const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
          const stddev = Math.sqrt(variance);

          if (stddev > 0) {
            const zScore = Math.abs((Number(latest.value) - mean) / stddev);
            if (zScore >= 2) {
              observations.push({
                kpi_id: kpiId,
                kpi_value_id: latest.id,
                title: `🔍 Anomali: ${kpiDef.name}`,
                description: `${kpiDef.name} visar ett avvikande värde (${Number(latest.value).toFixed(2)}) som ligger ${zScore.toFixed(1)} standardavvikelser från genomsnittet (${mean.toFixed(2)}).`,
                observation_type: 'anomaly',
                confidence_level: Math.min(0.5 + (zScore - 2) * 0.15, 0.95),
                signal_strength: Math.min(zScore / 4, 1),
                observation_period_start: latest.period_start,
                observation_period_end: latest.period_end,
                status: 'pending',
                model_version: '1.0.3',
                analysis_version: '2026-02-02',
              });
            }
          }
        }

        // Analysis 4: Persistent trend (3+ periods same direction)
        if (values.length >= 3) {
          const recentTrends = values.slice(0, 3).map(v => v.trend);
          const allSame = recentTrends.every(t => t === recentTrends[0]) && recentTrends[0] !== 'stable';
          
          if (allSame) {
            const direction = recentTrends[0];
            const isDeterioration = kpiDef.is_inverted ? direction === 'up' : direction === 'down';
            
            observations.push({
              kpi_id: kpiId,
              kpi_value_id: latest.id,
              title: `📈 Ihållande trend: ${kpiDef.name}`,
              description: `${kpiDef.name} visar konsekvent ${direction === 'up' ? 'uppåtgående' : 'nedåtgående'} trend under tre perioder. ${isDeterioration ? 'Potentiell försämring.' : 'Positiv utveckling.'}`,
              observation_type: 'pattern_match',
              confidence_level: Number(latest.confidence) / 100,
              signal_strength: 0.7,
              observation_period_start: values[2].period_start,
              observation_period_end: latest.period_end,
              status: 'pending',
              model_version: '1.0.3',
              analysis_version: '2026-02-02',
            });
          }
        }
      }

      console.log(`Generated ${observations.length} observations`);

      // Insert observations (deduplicate)
      let inserted = 0;
      let skipped = 0;

      for (const obs of observations) {
        const { data: existing } = await supabase
          .from('observations')
          .select('id')
          .eq('kpi_id', obs.kpi_id)
          .eq('observation_type', obs.observation_type)
          .eq('observation_period_end', obs.observation_period_end)
          .limit(1);

        if (existing && existing.length > 0) {
          skipped++;
          continue;
        }

        const { error: insertError } = await supabase
          .from('observations')
          .insert(obs);

        if (insertError) {
          console.error('Insert error:', insertError);
          skipped++;
        } else {
          inserted++;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          mode: 'batch',
          analysis_run: new Date().toISOString(),
          kpis_analyzed: valuesByKpi.size,
          observations_generated: observations.length,
          observations_inserted: inserted,
          observations_skipped: skipped,
          observations: observations.map(o => ({
            title: o.title,
            type: o.observation_type,
            confidence: o.confidence_level,
          })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SINGLE KPI MODE - original functionality
    const kpi_id = body.kpi_id;
    
    const { data: kpiDef, error: kpiError } = await supabase
      .from('kpi_definitions')
      .select('*')
      .eq('id', kpi_id)
      .single();

    if (kpiError || !kpiDef) {
      throw new Error(`KPI not found: ${kpi_id}`);
    }

    const { data: values, error: valuesError } = await supabase
      .from('kpi_values')
      .select('*')
      .eq('kpi_id', kpi_id)
      .order('period_end', { ascending: true })
      .limit(24);

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

    const trendResult = analyzeTrend(numericValues);
    const changePointResult = detectChangePoint(numericValues);
    
    let observationType: string;
    let title: string;
    let description: string;
    let signalStrength: number;
    let methodUsed: AnalysisMethod;
    let methodRationale: string;

    if (changePointResult.detected && changePointResult.significance > 70) {
      observationType = 'threshold_breach';
      title = `Förändringspunkt detekterad i ${kpiDef.name}`;
      description = `Data indikerar ett regimskifte i tidsserien.`;
      signalStrength = changePointResult.significance;
      methodUsed = 'change_point_detection';
      methodRationale = 'CUSUM-analys valdes på grund av tidsseriens karaktär.';
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
      return new Response(
        JSON.stringify({
          success: true,
          observation_created: false,
          message: 'Inga signifikanta avvikelser detekterade',
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const latestValue = values?.[values.length - 1];
    const confidenceLevel = latestValue?.confidence || 75;

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
      throw new Error(`Failed to create observation: ${obsError.message}`);
    }

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
