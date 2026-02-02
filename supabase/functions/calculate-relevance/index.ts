import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * RELEVANS- & PRIORITERINGSMOTOR
 * ═══════════════════════════════════════════════════════════════
 * 
 * Grundprincip: Det som påverkar flest människor mest just nu 
 * – och där ansvar finns – ska synas först.
 * 
 * Komponenter:
 * - Impact (0-30): Påverkan på masterindex
 * - Acceleration (0-20): Förändringstakt
 * - Breadth (0-15): Hur många berörs
 * - Persistence (0-15): Varaktighet av trend
 * - Responsibility (0-10): Finns mandat
 * - Data Confidence (-10 till +10): Datakvalitet
 */

interface RelevanceWeights {
  impact: number;
  acceleration: number;
  breadth: number;
  persistence: number;
  responsibility: number;
  dataConfidence: number;
}

interface KPIData {
  id: string;
  code: string;
  name: string;
  category: string;
  value: number;
  previousValue: number | null;
  trendPercent: number | null;
  trend: string;
  confidence: number;
  status: string;
  isInverted: boolean;
  masterIndexWeight?: number;
  monthsWithTrend?: number;
  affectedRegions?: number;
  responsibilityLevel?: string;
  dataPointsLast12Months?: number;
  isProvisional?: boolean;
}

interface RelevanceScore {
  objectType: string;
  objectId: string;
  objectCode: string;
  totalScore: number;
  impactRaw: number;
  accelerationRaw: number;
  breadthRaw: number;
  persistenceRaw: number;
  responsibilityRaw: number;
  dataConfidenceRaw: number;
  impactWeighted: number;
  accelerationWeighted: number;
  breadthWeighted: number;
  persistenceWeighted: number;
  responsibilityWeighted: number;
  dataConfidenceContribution: number;
  primaryReason: string;
  secondaryReasons: string[];
  shouldHighlight: boolean;
  calculationDetails: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// KOMPONENTBERÄKNINGAR
// ═══════════════════════════════════════════════════════════════

/**
 * Impact (0-100): Hur stark påverkan på masterindexet
 */
function calculateImpact(kpi: KPIData): { score: number; details: string } {
  const masterWeight = kpi.masterIndexWeight ?? 0.05;
  const trendMagnitude = Math.abs(kpi.trendPercent ?? 0);
  
  // Vikten i masterindex (0-60)
  const weightScore = Math.min(60, masterWeight * 600);
  
  // Påverkan genom förändring (0-40)
  const impactScore = Math.min(40, trendMagnitude * 4);
  
  const total = Math.min(100, weightScore + impactScore);
  
  return {
    score: total,
    details: `Masterindex-vikt: ${(masterWeight * 100).toFixed(1)}%, Förändring: ${trendMagnitude.toFixed(1)}%`
  };
}

/**
 * Acceleration (0-100): Hur snabbt förändras värdet
 */
function calculateAcceleration(kpi: KPIData): { score: number; details: string } {
  const trendPercent = Math.abs(kpi.trendPercent ?? 0);
  
  // Basnivå från trendprocent (0-70)
  let score = Math.min(70, trendPercent * 7);
  
  // Bonus för kritisk/varning-status (0-30)
  if (kpi.status === 'critical') {
    score += 30;
  } else if (kpi.status === 'warning') {
    score += 15;
  }
  
  const total = Math.min(100, score);
  const direction = kpi.trend === 'up' ? 'ökning' : kpi.trend === 'down' ? 'minskning' : 'stabil';
  
  return {
    score: total,
    details: `${trendPercent.toFixed(1)}% ${direction}${kpi.status === 'critical' ? ' (kritisk)' : kpi.status === 'warning' ? ' (varning)' : ''}`
  };
}

/**
 * Breadth (0-100): Hur många människor berörs
 */
function calculateBreadth(kpi: KPIData): { score: number; details: string } {
  const affectedRegions = kpi.affectedRegions ?? 21; // Default alla regioner
  const totalRegions = 21; // Svenska regioner
  
  // Regiontäckning (0-70)
  const regionScore = (affectedRegions / totalRegions) * 70;
  
  // Kategoribonus - vissa kategorier påverkar fler per definition
  let categoryBonus = 0;
  switch (kpi.category) {
    case 'demografi_halsa':
      categoryBonus = 30; // Hälsa påverkar alla
      break;
    case 'ekonomisk_barkraft':
      categoryBonus = 25;
      break;
    case 'arbete_produktivitet':
      categoryBonus = 20;
      break;
    default:
      categoryBonus = 10;
  }
  
  const total = Math.min(100, regionScore + categoryBonus);
  
  return {
    score: total,
    details: `${affectedRegions} av ${totalRegions} regioner, kategori: ${kpi.category}`
  };
}

/**
 * Persistence (0-100): Hur länge har trenden pågått
 */
function calculatePersistence(kpi: KPIData): { score: number; details: string } {
  const months = kpi.monthsWithTrend ?? 0;
  
  // Månader med trend (0-60)
  let score = Math.min(60, months * 5);
  
  // Röd flagg-bonus
  if (kpi.status === 'critical') {
    score += 40;
  } else if (kpi.status === 'warning') {
    score += 20;
  }
  
  const total = Math.min(100, score);
  let persistenceLabel = 'ny';
  if (months > 12) persistenceLabel = 'långvarig';
  else if (months > 3) persistenceLabel = 'ihållande';
  
  return {
    score: total,
    details: `${months} månader (${persistenceLabel})`
  };
}

/**
 * Responsibility (0-100): Finns tydligt mandat
 */
function calculateResponsibility(kpi: KPIData): { score: number; details: string } {
  const level = kpi.responsibilityLevel ?? 'nationell';
  
  let score = 0;
  switch (level) {
    case 'nationell':
      score = 100;
      break;
    case 'regional':
      score = 70;
      break;
    case 'kommunal':
      score = 50;
      break;
    default:
      score = 30;
  }
  
  return {
    score,
    details: `Ansvarsnivå: ${level}`
  };
}

/**
 * Data Confidence (-100 till +100): Datakvalitet
 */
function calculateDataConfidence(kpi: KPIData): { score: number; details: string } {
  const confidence = kpi.confidence ?? 80;
  const dataPoints = kpi.dataPointsLast12Months ?? 12;
  const isProvisional = kpi.isProvisional ?? false;
  
  // Bas från konfidens (-50 till +50)
  let score = (confidence - 50);
  
  // Straff för få datapunkter
  if (dataPoints < 12) {
    score -= (12 - dataPoints) * 3;
  }
  
  // Straff för preliminär data
  if (isProvisional) {
    score -= 20;
  }
  
  // Clamp till -100 till +100
  score = Math.max(-100, Math.min(100, score));
  
  return {
    score,
    details: `Konfidens: ${confidence}%, Datapunkter: ${dataPoints}${isProvisional ? ' (preliminär)' : ''}`
  };
}

/**
 * Huvudfunktion: Beräkna relevansscore för en KPI
 */
function calculateRelevanceScore(kpi: KPIData, weights: RelevanceWeights, weightVersionId: string): RelevanceScore {
  // Beräkna råvärden
  const impact = calculateImpact(kpi);
  const acceleration = calculateAcceleration(kpi);
  const breadth = calculateBreadth(kpi);
  const persistence = calculatePersistence(kpi);
  const responsibility = calculateResponsibility(kpi);
  const dataConfidence = calculateDataConfidence(kpi);
  
  // Viktade bidrag (skalas till max 30, 20, 15, 15, 10)
  const impactWeighted = (impact.score / 100) * 30 * weights.impact;
  const accelerationWeighted = (acceleration.score / 100) * 20 * weights.acceleration;
  const breadthWeighted = (breadth.score / 100) * 15 * weights.breadth;
  const persistenceWeighted = (persistence.score / 100) * 15 * weights.persistence;
  const responsibilityWeighted = (responsibility.score / 100) * 10 * weights.responsibility;
  
  // Data confidence är bonus/straff (-10 till +10)
  const dataConfidenceContribution = (dataConfidence.score / 100) * 10 * weights.dataConfidence;
  
  // Totalpoäng (0-100)
  const totalScore = Math.max(0, Math.min(100,
    impactWeighted +
    accelerationWeighted +
    breadthWeighted +
    persistenceWeighted +
    responsibilityWeighted +
    dataConfidenceContribution
  ));
  
  // Hitta primär anledning
  const components = [
    { name: 'impact', score: impactWeighted, reason: 'Hög påverkan på nationellt index' },
    { name: 'acceleration', score: accelerationWeighted, reason: 'Snabb förändring pågår' },
    { name: 'breadth', score: breadthWeighted, reason: 'Påverkar stora delar av landet' },
    { name: 'persistence', score: persistenceWeighted, reason: 'Ihållande trend kräver uppmärksamhet' },
    { name: 'responsibility', score: responsibilityWeighted, reason: 'Tydligt mandat finns för handling' },
  ].sort((a, b) => b.score - a.score);
  
  const primaryReason = components[0].reason;
  const secondaryReasons = components.slice(1, 3).map(c => c.reason);
  
  return {
    objectType: 'kpi',
    objectId: kpi.id,
    objectCode: kpi.code,
    totalScore,
    impactRaw: impact.score,
    accelerationRaw: acceleration.score,
    breadthRaw: breadth.score,
    persistenceRaw: persistence.score,
    responsibilityRaw: responsibility.score,
    dataConfidenceRaw: dataConfidence.score,
    impactWeighted,
    accelerationWeighted,
    breadthWeighted,
    persistenceWeighted,
    responsibilityWeighted,
    dataConfidenceContribution,
    primaryReason,
    secondaryReasons,
    shouldHighlight: totalScore >= 50,
    calculationDetails: {
      impact: impact.details,
      acceleration: acceleration.details,
      breadth: breadth.details,
      persistence: persistence.details,
      responsibility: responsibility.details,
      dataConfidence: dataConfidence.details,
      weights,
    }
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const startTime = Date.now();

    // 1. Hämta aktiva vikter
    const { data: weightData, error: weightError } = await supabase
      .from('relevance_weight_versions')
      .select('*')
      .eq('is_active', true)
      .single();

    if (weightError) throw new Error(`Failed to fetch weights: ${weightError.message}`);

    const weights: RelevanceWeights = {
      impact: weightData.impact_weight,
      acceleration: weightData.acceleration_weight,
      breadth: weightData.breadth_weight,
      persistence: weightData.persistence_weight,
      responsibility: weightData.responsibility_weight,
      dataConfidence: weightData.data_confidence_weight,
    };

    // 2. Hämta alla aktiva KPI:er med senaste värden
    const { data: kpiDefinitions, error: kpiDefError } = await supabase
      .from('kpi_definitions')
      .select('*')
      .eq('is_active', true);

    if (kpiDefError) throw new Error(`Failed to fetch KPI definitions: ${kpiDefError.message}`);

    // 3. Hämta senaste värden för varje KPI
    const { data: kpiValues, error: kpiValError } = await supabase
      .from('kpi_values')
      .select('*')
      .order('period_end', { ascending: false });

    if (kpiValError) throw new Error(`Failed to fetch KPI values: ${kpiValError.message}`);

    // 4. Hämta master index komponenter för vikter
    const { data: masterComponents } = await supabase
      .from('master_index_components')
      .select('kpi_id, weight');

    const masterWeightMap = new Map(
      (masterComponents || []).map(c => [c.kpi_id, c.weight])
    );

    // 5. Hämta ansvarsmatris
    const { data: responsibilityMatrix } = await supabase
      .from('kpi_responsibility_matrix')
      .select('kpi_id, primary_level');

    const responsibilityMap = new Map(
      (responsibilityMatrix || []).map(r => [r.kpi_id, r.primary_level])
    );

    // 6. Bygg KPI-data för beräkning
    const latestValueMap = new Map<string, typeof kpiValues[0]>();
    for (const val of kpiValues || []) {
      if (!latestValueMap.has(val.kpi_id)) {
        latestValueMap.set(val.kpi_id, val);
      }
    }

    const kpiDataList: KPIData[] = (kpiDefinitions || []).map(def => {
      const latestValue = latestValueMap.get(def.id);
      return {
        id: def.id,
        code: def.code,
        name: def.name,
        category: def.category,
        value: latestValue?.value ?? 0,
        previousValue: latestValue?.previous_value ?? null,
        trendPercent: latestValue?.trend_percent ?? 0,
        trend: latestValue?.trend ?? 'stable',
        confidence: latestValue?.confidence ?? 80,
        status: latestValue?.status ?? 'neutral',
        isInverted: def.is_inverted,
        masterIndexWeight: masterWeightMap.get(def.id) ?? 0.05,
        responsibilityLevel: responsibilityMap.get(def.id) ?? 'nationell',
        dataPointsLast12Months: 12,
        isProvisional: latestValue?.is_provisional ?? false,
      };
    });

    // 7. Beräkna relevans för alla KPI:er
    const scores = kpiDataList.map(kpi => 
      calculateRelevanceScore(kpi, weights, weightData.id)
    );

    // 8. Sortera och sätt rank
    scores.sort((a, b) => b.totalScore - a.totalScore);
    scores.forEach((score, index) => {
      (score as any).rank = index + 1;
    });

    // 9. Ta bort gamla scores och spara nya
    await supabase
      .from('relevance_scores')
      .delete()
      .eq('object_type', 'kpi');

    const insertData = scores.map(score => ({
      object_type: score.objectType,
      object_id: score.objectId,
      object_code: score.objectCode,
      total_score: score.totalScore,
      rank: (score as any).rank,
      impact_raw: score.impactRaw,
      acceleration_raw: score.accelerationRaw,
      breadth_raw: score.breadthRaw,
      persistence_raw: score.persistenceRaw,
      responsibility_raw: score.responsibilityRaw,
      data_confidence_raw: score.dataConfidenceRaw,
      impact_weighted: score.impactWeighted,
      acceleration_weighted: score.accelerationWeighted,
      breadth_weighted: score.breadthWeighted,
      persistence_weighted: score.persistenceWeighted,
      responsibility_weighted: score.responsibilityWeighted,
      data_confidence_contribution: score.dataConfidenceContribution,
      weight_version_id: weightData.id,
      primary_reason: score.primaryReason,
      secondary_reasons: score.secondaryReasons,
      should_highlight: score.shouldHighlight,
      calculation_details: score.calculationDetails,
    }));

    const { error: insertError } = await supabase
      .from('relevance_scores')
      .insert(insertData);

    if (insertError) throw new Error(`Failed to insert scores: ${insertError.message}`);

    // 10. Skapa daglig snapshot
    const today = new Date().toISOString().split('T')[0];
    
    // Hitta topp-listor
    const topRelevant = scores.slice(0, 5).map(s => ({
      id: s.objectId,
      code: s.objectCode,
      score: s.totalScore,
      reason: s.primaryReason,
    }));

    // Hitta förbättringar (positive trend för non-inverted, negative för inverted)
    const improvements = kpiDataList
      .filter(kpi => {
        const trend = kpi.trendPercent ?? 0;
        return kpi.isInverted ? trend < -2 : trend > 2;
      })
      .sort((a, b) => Math.abs(b.trendPercent ?? 0) - Math.abs(a.trendPercent ?? 0))
      .slice(0, 5)
      .map(kpi => ({
        id: kpi.id,
        code: kpi.code,
        change: kpi.trendPercent,
        name: kpi.name,
      }));

    // Hitta försämringar
    const declines = kpiDataList
      .filter(kpi => {
        const trend = kpi.trendPercent ?? 0;
        return kpi.isInverted ? trend > 2 : trend < -2;
      })
      .sort((a, b) => Math.abs(b.trendPercent ?? 0) - Math.abs(a.trendPercent ?? 0))
      .slice(0, 5)
      .map(kpi => ({
        id: kpi.id,
        code: kpi.code,
        change: kpi.trendPercent,
        name: kpi.name,
      }));

    // Upsert snapshot
    const { error: snapshotError } = await supabase
      .from('daily_priority_snapshots')
      .upsert({
        snapshot_date: today,
        top_relevant: topRelevant,
        top_improvements: improvements,
        top_declines: declines,
        full_ranking: scores.map(s => ({ id: s.objectId, score: s.totalScore, rank: (s as any).rank })),
        weight_version_id: weightData.id,
        total_objects_scored: scores.length,
        calculation_duration_ms: Date.now() - startTime,
      }, { onConflict: 'snapshot_date' });

    if (snapshotError) {
      console.error('Snapshot error:', snapshotError);
    }

    const duration = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Calculated relevance for ${scores.length} KPIs`,
        summary: {
          totalScored: scores.length,
          highlighted: scores.filter(s => s.shouldHighlight).length,
          topRelevant: topRelevant.slice(0, 3),
          calculationDurationMs: duration,
          weightVersion: weightData.version,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error calculating relevance:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
