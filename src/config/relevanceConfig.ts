/**
 * RELEVANS-ENGINE KONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Avgör vad som visas överst på startsidan.
 * Helt automatisk – ingen redaktör behövs.
 * 
 * Relevansscore = Σ (faktor × vikt) - osäkerhetsstraff
 */

export interface RelevanceWeights {
  impact: number;           // Påverkan på masterindex/rot-KPI
  acceleration: number;     // Förändringstakt (snabba förändringar viktigare)
  breadth: number;          // Hur många berörs
  persistence: number;      // Hur länge pågått
  responsibility: number;   // Finns mandat kopplat
  uncertainty: number;      // Straff om datat är tunt (negativt värde)
}

export interface RelevanceInput {
  kpiId: string;
  
  // Impact: påverkan på masterindex (0-100)
  masterIndexWeight: number;    // Vikt i masterindex
  masterIndexContribution: number; // Nuvarande bidrag till score
  
  // Acceleration: förändringstakt
  trendPercent: number;         // Procentuell förändring
  accelerating: boolean;        // Ökar förändringen?
  trendDuration: number;        // Månader med samma trend
  
  // Breadth: geografisk/demografisk spridning
  affectedRegions: number;      // Antal regioner påverkade
  totalRegions: number;         // Totalt antal regioner
  affectedPopulationPercent: number; // % av befolkning
  
  // Persistence: varaktighet
  monthsWithIssue: number;      // Månader med varning/kritisk
  isRedFlag: boolean;           // Röd flagg triggad
  
  // Responsibility: ansvarskoppling
  hasActiveMandate: boolean;    // Finns tydligt mandat
  mandateLevel: 'national' | 'regional' | 'municipal' | null;
  
  // Uncertainty: datakvalitet
  confidence: number;           // 0-100
  dataPointsLast12Months: number;
  isProvisional: boolean;
}

export interface RelevanceScore {
  kpiId: string;
  totalScore: number;
  breakdown: {
    impact: number;
    acceleration: number;
    breadth: number;
    persistence: number;
    responsibility: number;
    uncertaintyPenalty: number;
  };
  rank: number;
  shouldHighlight: boolean;
  reason: string;
}

/**
 * STANDARDVIKTER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Balanserade vikter för att undvika bias.
 * Summan ska vara 1.0 (före osäkerhetsstraff).
 */
export const DEFAULT_RELEVANCE_WEIGHTS: RelevanceWeights = {
  impact: 0.30,         // 30% - Viktigast: påverkan på samhället
  acceleration: 0.20,   // 20% - Snabba förändringar kräver uppmärksamhet
  breadth: 0.15,        // 15% - Breda problem berör fler
  persistence: 0.15,    // 15% - Ihållande problem allvarligare
  responsibility: 0.10, // 10% - Mandat ger handlingsmöjlighet
  uncertainty: -0.10,   // -10% - Straff för osäker data
};

/**
 * Beräkna impact-score (0-100)
 */
function calculateImpactScore(input: RelevanceInput): number {
  // Kombinera vikt i masterindex med nuvarande bidrag
  const weightFactor = input.masterIndexWeight * 100; // Normalisera
  const contributionFactor = Math.abs(input.masterIndexContribution);
  
  return Math.min(100, (weightFactor * 0.6) + (contributionFactor * 0.4));
}

/**
 * Beräkna acceleration-score (0-100)
 */
function calculateAccelerationScore(input: RelevanceInput): number {
  const baseTrendScore = Math.min(100, Math.abs(input.trendPercent) * 10);
  const accelerationBonus = input.accelerating ? 20 : 0;
  const durationBonus = Math.min(20, input.trendDuration * 2);
  
  return Math.min(100, baseTrendScore + accelerationBonus + durationBonus);
}

/**
 * Beräkna breadth-score (0-100)
 */
function calculateBreadthScore(input: RelevanceInput): number {
  const regionCoverage = (input.affectedRegions / input.totalRegions) * 50;
  const populationCoverage = input.affectedPopulationPercent * 0.5;
  
  return Math.min(100, regionCoverage + populationCoverage);
}

/**
 * Beräkna persistence-score (0-100)
 */
function calculatePersistenceScore(input: RelevanceInput): number {
  const durationScore = Math.min(60, input.monthsWithIssue * 5);
  const redFlagBonus = input.isRedFlag ? 40 : 0;
  
  return Math.min(100, durationScore + redFlagBonus);
}

/**
 * Beräkna responsibility-score (0-100)
 */
function calculateResponsibilityScore(input: RelevanceInput): number {
  if (!input.hasActiveMandate) return 0;
  
  // Nationell nivå ger högst score
  switch (input.mandateLevel) {
    case 'national': return 100;
    case 'regional': return 70;
    case 'municipal': return 50;
    default: return 30;
  }
}

/**
 * Beräkna osäkerhetsstraff (0-100)
 */
function calculateUncertaintyPenalty(input: RelevanceInput): number {
  const confidencePenalty = (100 - input.confidence);
  const dataPointsPenalty = input.dataPointsLast12Months < 12 
    ? (12 - input.dataPointsLast12Months) * 5 
    : 0;
  const provisionalPenalty = input.isProvisional ? 20 : 0;
  
  return Math.min(100, confidencePenalty * 0.5 + dataPointsPenalty + provisionalPenalty);
}

/**
 * HUVUDFUNKTION: Beräkna relevansscore för en KPI
 */
export function calculateRelevanceScore(
  input: RelevanceInput,
  weights: RelevanceWeights = DEFAULT_RELEVANCE_WEIGHTS
): RelevanceScore {
  const breakdown = {
    impact: calculateImpactScore(input) * weights.impact,
    acceleration: calculateAccelerationScore(input) * weights.acceleration,
    breadth: calculateBreadthScore(input) * weights.breadth,
    persistence: calculatePersistenceScore(input) * weights.persistence,
    responsibility: calculateResponsibilityScore(input) * weights.responsibility,
    uncertaintyPenalty: calculateUncertaintyPenalty(input) * Math.abs(weights.uncertainty),
  };

  const totalScore = Math.max(0, 
    breakdown.impact +
    breakdown.acceleration +
    breakdown.breadth +
    breakdown.persistence +
    breakdown.responsibility -
    breakdown.uncertaintyPenalty
  );

  // Generera anledning för highlighting
  let reason = '';
  const maxFactor = Object.entries(breakdown)
    .filter(([key]) => key !== 'uncertaintyPenalty')
    .sort((a, b) => b[1] - a[1])[0];

  switch (maxFactor[0]) {
    case 'impact':
      reason = 'Hög påverkan på nationellt index';
      break;
    case 'acceleration':
      reason = 'Snabb förändring pågår';
      break;
    case 'breadth':
      reason = 'Påverkar stora delar av landet';
      break;
    case 'persistence':
      reason = 'Ihållande trend kräver uppmärksamhet';
      break;
    case 'responsibility':
      reason = 'Tydligt mandat finns för handling';
      break;
  }

  return {
    kpiId: input.kpiId,
    totalScore,
    breakdown,
    rank: 0, // Sätts efter sortering
    shouldHighlight: totalScore >= 50, // Tröskelvärde för highlighting
    reason,
  };
}

/**
 * Beräkna och ranka alla KPI:er
 */
export function rankKPIsByRelevance(
  inputs: RelevanceInput[],
  weights: RelevanceWeights = DEFAULT_RELEVANCE_WEIGHTS
): RelevanceScore[] {
  const scores = inputs.map(input => calculateRelevanceScore(input, weights));
  
  // Sortera efter totalScore (högst först)
  scores.sort((a, b) => b.totalScore - a.totalScore);
  
  // Sätt rank
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });
  
  return scores;
}

/**
 * Hämta dagens highlights baserat på relevans
 */
export function getDailyHighlights(
  scores: RelevanceScore[],
  maxItems: number = 5
): RelevanceScore[] {
  return scores
    .filter(s => s.shouldHighlight)
    .slice(0, maxItems);
}

/**
 * TRÖSKELVÄRDEN OCH REGLER
 */
export const RELEVANCE_THRESHOLDS = {
  highlight: 50,        // Minsta score för att highlightas
  critical: 75,         // Kritisk nivå
  mustShow: 90,         // Måste visas oavsett
  minConfidence: 50,    // Minsta konfidens för att inkluderas
} as const;

/**
 * Validera att vikterna är korrekta
 */
export function validateWeights(weights: RelevanceWeights): boolean {
  const sum = weights.impact + 
              weights.acceleration + 
              weights.breadth + 
              weights.persistence + 
              weights.responsibility;
  
  // Summan ska vara 0.9 (1.0 - 0.1 för uncertainty)
  return Math.abs(sum - 0.9) < 0.001 && weights.uncertainty <= 0;
}
