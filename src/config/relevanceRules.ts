// ═══════════════════════════════════════════════════════════════════════════
// RELEVANSREGLER — Styr prioritering och filtrering i hela systemet
// ═══════════════════════════════════════════════════════════════════════════
//
// Dessa regler avgör:
// 1. Vad som visas på startsidan
// 2. Ordningen på KPI:er och observationer
// 3. Vilka varningar som triggas
// 4. Hur djupanalys prioriteras
//
// ═══════════════════════════════════════════════════════════════════════════

export interface RelevanceScore {
  total: number;          // 0-100, aggregerat
  impact: number;         // Genomslag - hur många påverkas
  urgency: number;        // Brådska - hur snabbt förändras det
  recency: number;        // Aktualitet - hur nyligen uppdaterat
  confidence: number;     // Datakvalitet - hur säkra är vi
}

export interface RelevanceWeights {
  impact: number;
  urgency: number;
  recency: number;
  confidence: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIKTNING FÖR OLIKA VY-TYPER
// ═══════════════════════════════════════════════════════════════════════════

export const RELEVANCE_WEIGHTS: Record<string, RelevanceWeights> = {
  // Startsidan: Prioriterar brådska och genomslag
  homepage: {
    impact: 0.35,
    urgency: 0.35,
    recency: 0.20,
    confidence: 0.10,
  },
  
  // Djupanalys: Prioriterar datakvalitet och genomslag
  analysis: {
    impact: 0.30,
    urgency: 0.15,
    recency: 0.15,
    confidence: 0.40,
  },
  
  // Varningar: Prioriterar brådska och genomslag
  alerts: {
    impact: 0.40,
    urgency: 0.45,
    recency: 0.10,
    confidence: 0.05,
  },
  
  // Historisk vy: Prioriterar datakvalitet och aktualitet
  historical: {
    impact: 0.20,
    urgency: 0.10,
    recency: 0.25,
    confidence: 0.45,
  },
  
  // Jämförelsevy: Balanserad viktning
  comparison: {
    impact: 0.25,
    urgency: 0.25,
    recency: 0.25,
    confidence: 0.25,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TRÖSKELVÄRDEN FÖR PRIORITERING
// ═══════════════════════════════════════════════════════════════════════════

export const PRIORITY_THRESHOLDS = {
  // KPI-status triggers
  critical_change_percent: 10,      // >10% förändring = kritisk
  warning_change_percent: 5,        // 5-10% förändring = varning
  significant_change_percent: 2,    // 2-5% = signifikant
  
  // Tidsrelaterade
  stale_data_days: 30,              // Data äldre än 30 dagar = "gammal"
  very_stale_data_days: 90,         // Data äldre än 90 dagar = varning
  
  // Konfidensrelaterade
  high_confidence: 85,              // >85% = hög konfidens
  medium_confidence: 60,            // 60-85% = medel
  low_confidence: 40,               // <40% = låg, visa varning
  
  // Korrelationsrelaterade
  strong_correlation: 0.7,          // >0.7 = stark korrelation
  moderate_correlation: 0.4,        // 0.4-0.7 = moderat
  weak_correlation: 0.2,            // <0.2 = ignorera
  
  // Minsta datamängd
  min_data_points_for_trend: 6,     // Minst 6 punkter för trendanalys
  min_data_points_for_correlation: 12, // Minst 12 för korrelation
  min_regions_for_comparison: 3,    // Minst 3 regioner för jämförelse
};

// ═══════════════════════════════════════════════════════════════════════════
// GENOMSLAGSBERÄKNING (IMPACT)
// ═══════════════════════════════════════════════════════════════════════════

export interface ImpactFactors {
  populationAffected: number;       // Antal personer som påverkas
  economicMagnitude: number;        // Ekonomisk storlek (SEK)
  healthImplication: boolean;       // Har hälsokonsekvenser
  securityImplication: boolean;     // Har trygghetskonsekvenser
  interconnectedKpis: number;       // Antal kopplade KPI:er
}

export const IMPACT_WEIGHTS = {
  population_per_million: 5,        // +5 poäng per miljon berörda
  economy_per_billion: 3,           // +3 poäng per miljard SEK
  health_bonus: 15,                 // +15 om hälsorelaterat
  security_bonus: 20,               // +20 om säkerhetsrelaterat
  interconnection_per_kpi: 2,       // +2 per kopplad KPI
  max_impact_score: 100,
};

export function calculateImpactScore(factors: ImpactFactors): number {
  let score = 0;
  
  // Befolkningspåverkan
  score += (factors.populationAffected / 1_000_000) * IMPACT_WEIGHTS.population_per_million;
  
  // Ekonomisk magnitud
  score += (factors.economicMagnitude / 1_000_000_000) * IMPACT_WEIGHTS.economy_per_billion;
  
  // Hälsobonus
  if (factors.healthImplication) score += IMPACT_WEIGHTS.health_bonus;
  
  // Säkerhetsbonus
  if (factors.securityImplication) score += IMPACT_WEIGHTS.security_bonus;
  
  // Interconnection
  score += factors.interconnectedKpis * IMPACT_WEIGHTS.interconnection_per_kpi;
  
  return Math.min(score, IMPACT_WEIGHTS.max_impact_score);
}

// ═══════════════════════════════════════════════════════════════════════════
// BRÅDSKBERÄKNING (URGENCY)
// ═══════════════════════════════════════════════════════════════════════════

export interface UrgencyFactors {
  trendDirection: 'up' | 'down' | 'stable';
  trendAcceleration: number;        // Förändring i förändringshastighet
  daysSinceChange: number;          // Dagar sedan signifikant förändring
  thresholdProximity: number;       // 0-1, hur nära kritiskt tröskelvärde
  isInverted: boolean;              // Om lägre = bättre
}

export function calculateUrgencyScore(factors: UrgencyFactors): number {
  let score = 0;
  
  // Trendbaserad brådska
  if (factors.trendDirection !== 'stable') {
    const isNegativeTrend = 
      (factors.trendDirection === 'down' && !factors.isInverted) ||
      (factors.trendDirection === 'up' && factors.isInverted);
    
    if (isNegativeTrend) {
      score += 30;
      score += Math.abs(factors.trendAcceleration) * 10;
    }
  }
  
  // Nyligen förändrat
  if (factors.daysSinceChange < 7) score += 20;
  else if (factors.daysSinceChange < 30) score += 10;
  
  // Nära tröskelvärde
  score += factors.thresholdProximity * 40;
  
  return Math.min(score, 100);
}

// ═══════════════════════════════════════════════════════════════════════════
// AKTUALITETSBERÄKNING (RECENCY)
// ═══════════════════════════════════════════════════════════════════════════

export function calculateRecencyScore(lastUpdated: Date): number {
  const now = new Date();
  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceUpdate < 1) return 100;       // Idag
  if (daysSinceUpdate < 7) return 90;        // Senaste veckan
  if (daysSinceUpdate < 30) return 70;       // Senaste månaden
  if (daysSinceUpdate < 90) return 40;       // Senaste kvartalet
  if (daysSinceUpdate < 365) return 20;      // Senaste året
  return 10;                                  // Äldre
}

// ═══════════════════════════════════════════════════════════════════════════
// AGGREGERAD RELEVANSBERÄKNING
// ═══════════════════════════════════════════════════════════════════════════

export interface RelevanceInput {
  impactFactors: ImpactFactors;
  urgencyFactors: UrgencyFactors;
  lastUpdated: Date;
  confidence: number;               // 0-100
}

export function calculateRelevanceScore(
  input: RelevanceInput,
  viewType: keyof typeof RELEVANCE_WEIGHTS = 'homepage'
): RelevanceScore {
  const weights = RELEVANCE_WEIGHTS[viewType];
  
  const impact = calculateImpactScore(input.impactFactors);
  const urgency = calculateUrgencyScore(input.urgencyFactors);
  const recency = calculateRecencyScore(input.lastUpdated);
  const confidence = input.confidence;
  
  const total = 
    impact * weights.impact +
    urgency * weights.urgency +
    recency * weights.recency +
    confidence * weights.confidence;
  
  return {
    total: Math.round(total),
    impact: Math.round(impact),
    urgency: Math.round(urgency),
    recency: Math.round(recency),
    confidence: Math.round(confidence),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTERREGLER — Vad som INTE visas
// ═══════════════════════════════════════════════════════════════════════════

export const FILTER_RULES = {
  // Dölj från startsidan om:
  homepage_hide: {
    confidence_below: 30,           // För osäker data
    recency_score_below: 20,        // För gammal data
    relevance_score_below: 15,      // För låg relevans
  },
  
  // Dölj från jämförelsevy om:
  comparison_hide: {
    data_points_below: 6,           // För lite data
    regions_below: 2,               // För få regioner
  },
  
  // Dölj från korrelationsanalys om:
  correlation_hide: {
    correlation_below: 0.2,         // För svag korrelation
    data_points_below: 12,          // För lite data
    p_value_above: 0.05,            // Inte statistiskt signifikant
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SORTERINGSORDNING
// ═══════════════════════════════════════════════════════════════════════════

export type SortOrder = 'relevance' | 'recency' | 'alphabetical' | 'severity' | 'impact';

export const DEFAULT_SORT_ORDER: Record<string, SortOrder> = {
  homepage: 'relevance',
  alerts: 'severity',
  analysis: 'impact',
  historical: 'recency',
  comparison: 'alphabetical',
  search: 'relevance',
};

// ═══════════════════════════════════════════════════════════════════════════
// GRUPPERING AV KPI:ER PER VY
// ═══════════════════════════════════════════════════════════════════════════

export const KPI_DISPLAY_GROUPS = {
  // Startsidan: Visa max 6 KPI:er
  homepage: {
    maxItems: 6,
    priorityOrder: [
      'critical',    // Alltid först
      'warning',     // Sedan varningar
      'changed',     // Sedan nyligen ändrade
      'positive',    // Sedan positiva
    ],
  },
  
  // Dashboard: Visa alla i kategorier
  dashboard: {
    maxItems: 20,
    groupBy: 'category',
  },
  
  // Detaljvy: Visa en KPI + relaterade
  detail: {
    maxRelated: 5,
    includeCorrelations: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT AV RELEVANSBERÄKNINGSLOGIK
// ═══════════════════════════════════════════════════════════════════════════

export const RELEVANCE_ENGINE = {
  weights: RELEVANCE_WEIGHTS,
  thresholds: PRIORITY_THRESHOLDS,
  filters: FILTER_RULES,
  sortDefaults: DEFAULT_SORT_ORDER,
  displayGroups: KPI_DISPLAY_GROUPS,
  calculateScore: calculateRelevanceScore,
  calculateImpact: calculateImpactScore,
  calculateUrgency: calculateUrgencyScore,
  calculateRecency: calculateRecencyScore,
};

export default RELEVANCE_ENGINE;
