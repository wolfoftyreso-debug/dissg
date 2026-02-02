/**
 * WAVE 15 — BLOCK DP, DQ
 * PLANETARY AUTO-OBSERVATION & AUTO-PRIORITIZATION
 * 
 * Systemet observerar världen kontinuerligt utan mänsklig trigging.
 * Prioriterar baserat på effekt, inte agenda.
 */

// ============================================
// BLOCK DP: PLANETARY AUTO-OBSERVATION ENGINE
// ============================================

export type ObservationSource = 
  | 'kpi_stream'
  | 'index_change'
  | 'event_intake'
  | 'media_intensity'
  | 'context_correlation';

export interface ObservationObject {
  observation_id: string;
  what_changed: string;
  where: {
    level: 'global' | 'regional' | 'national' | 'subnational';
    codes: string[]; // Country codes, NUTS codes, etc.
    names: string[];
  };
  when: {
    detected_at: string;
    period_start: string;
    period_end: string;
    lag_hours: number;
  };
  magnitude: {
    absolute_change: number;
    percent_change: number;
    standard_deviations: number;
    historical_rank: number; // percentile
  };
  related_dimensions: {
    kpi_ids: string[];
    domains: string[];
    related_observations: string[];
  };
  confidence: number;
  links: {
    raw_data: string;
    methodology: string;
    lineage: string;
  };
  
  // Mandatory non-interpretation
  interpretation: null; // Always null - system does not interpret
  recommendation: null; // Always null - system does not recommend
}

export const CONTINUOUS_SCAN_CONFIG = {
  streams: {
    kpi_streams: {
      name: 'KPI-strömmar',
      description: 'Kontinuerlig övervakning av KPI-värden',
      scanIntervalMinutes: 5,
      enabled: true,
    },
    index_changes: {
      name: 'Indexförändringar',
      description: 'Aggregerade index och sammansatta mått',
      scanIntervalMinutes: 15,
      enabled: true,
    },
    event_intake: {
      name: 'Event-inkomster',
      description: 'Strukturerade händelser från externa källor',
      scanIntervalMinutes: 1,
      enabled: true,
    },
    media_intensity: {
      name: 'Media-intensitet',
      description: 'Frekvens och spridning i nyhetsflöden',
      scanIntervalMinutes: 30,
      enabled: true,
    },
    context_correlation: {
      name: 'Kontextsamband',
      description: 'Mönster mellan olika dimensioner',
      scanIntervalMinutes: 60,
      enabled: true,
    },
  },
  
  operatingMode: '24/7',
  humanTriggerRequired: false,
  
  outputPolicy: {
    onlyFactualObservations: true,
    noInterpretations: true,
    noRecommendations: true,
    alwaysIncludeConfidence: true,
    alwaysIncludeLinks: true,
  },
} as const;

export const OBSERVATION_DETECTION_THRESHOLDS = {
  minimum_change_percent: 1.0,
  minimum_standard_deviations: 1.5,
  minimum_confidence: 0.5,
  
  significance_levels: {
    minor: { min_std: 1.5, min_pct: 1.0 },
    moderate: { min_std: 2.0, min_pct: 3.0 },
    significant: { min_std: 2.5, min_pct: 5.0 },
    major: { min_std: 3.0, min_pct: 10.0 },
    extreme: { min_std: 4.0, min_pct: 20.0 },
  },
} as const;

// ============================================
// BLOCK DQ: AUTO-PRIORITIZATION ENGINE
// ============================================

export type VisibilityLevel = 
  | 'planetary'   // Global topp
  | 'regional'    // Regional betydelse
  | 'national'    // Nationell betydelse
  | 'thematic'    // Tematisk (domänspecifik)
  | 'searchable'; // Sökbart men ej framlyft

export interface PriorityScore {
  observation_id: string;
  total_score: number;
  visibility_level: VisibilityLevel;
  components: {
    impact_breadth: number;        // 0-100
    change_velocity: number;       // 0-100
    data_quality: number;          // 0-100
    historical_unusualness: number; // 0-100
    cross_domain_sync: number;     // 0-100
  };
  computed_at: string;
  
  // Mandatory neutrality
  value_judgment: null; // Always null
  normative_ranking: null; // Always null
}

export const PRIORITY_LOGIC_CONFIG = {
  factors: {
    impact_breadth: {
      name: 'Påverkningsbredd',
      weight: 0.25,
      description: 'Hur många regioner/människor påverkas',
      calculation: 'population_affected / total_population',
    },
    change_velocity: {
      name: 'Förändringstakt',
      weight: 0.20,
      description: 'Hur snabbt sker förändringen',
      calculation: 'percent_change / time_period',
    },
    data_quality: {
      name: 'Datakvalitet',
      weight: 0.20,
      description: 'Tillförlitlighet och täckning',
      calculation: 'confidence * coverage * source_reliability',
    },
    historical_unusualness: {
      name: 'Historisk ovanlighet',
      weight: 0.20,
      description: 'Hur sällsynt är detta mönster',
      calculation: '1 - historical_frequency_percentile',
    },
    cross_domain_sync: {
      name: 'Samtidighet över domäner',
      weight: 0.15,
      description: 'Korrelerad rörelse i flera områden',
      calculation: 'related_domain_changes / total_domains',
    },
  },
  
  visibilityThresholds: {
    planetary: 90,
    regional: 70,
    national: 50,
    thematic: 30,
    searchable: 0,
  },
  
  neutralityEnforcement: {
    noValueWords: true,
    noNormativeRanking: true,
    onlyOrderNotJudgment: true,
    transparentWeights: true,
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createObservation(
  data: Omit<ObservationObject, 'observation_id' | 'interpretation' | 'recommendation'>
): ObservationObject {
  return {
    ...data,
    observation_id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    interpretation: null, // Enforced null
    recommendation: null, // Enforced null
  };
}

export function calculatePriorityScore(
  observation: ObservationObject,
  context: {
    populationAffected: number;
    totalPopulation: number;
    timePeriodDays: number;
    historicalPercentile: number;
    relatedDomainChanges: number;
    totalDomains: number;
  }
): PriorityScore {
  const config = PRIORITY_LOGIC_CONFIG.factors;
  
  const components = {
    impact_breadth: (context.populationAffected / context.totalPopulation) * 100,
    change_velocity: Math.min(100, Math.abs(observation.magnitude.percent_change) / context.timePeriodDays * 10),
    data_quality: observation.confidence * 100,
    historical_unusualness: (1 - context.historicalPercentile) * 100,
    cross_domain_sync: (context.relatedDomainChanges / Math.max(1, context.totalDomains)) * 100,
  };
  
  const total_score = 
    components.impact_breadth * config.impact_breadth.weight +
    components.change_velocity * config.change_velocity.weight +
    components.data_quality * config.data_quality.weight +
    components.historical_unusualness * config.historical_unusualness.weight +
    components.cross_domain_sync * config.cross_domain_sync.weight;
  
  const thresholds = PRIORITY_LOGIC_CONFIG.visibilityThresholds;
  let visibility_level: VisibilityLevel = 'searchable';
  if (total_score >= thresholds.planetary) visibility_level = 'planetary';
  else if (total_score >= thresholds.regional) visibility_level = 'regional';
  else if (total_score >= thresholds.national) visibility_level = 'national';
  else if (total_score >= thresholds.thematic) visibility_level = 'thematic';
  
  return {
    observation_id: observation.observation_id,
    total_score,
    visibility_level,
    components,
    computed_at: new Date().toISOString(),
    value_judgment: null,
    normative_ranking: null,
  };
}

export function getVisibilityDescription(level: VisibilityLevel): string {
  const descriptions: Record<VisibilityLevel, string> = {
    planetary: 'Global topprioritering – synlig överallt',
    regional: 'Regional betydelse – framlyft i berörda regioner',
    national: 'Nationell betydelse – framlyft i berörda länder',
    thematic: 'Tematisk – framlyft inom relevant domän',
    searchable: 'Sökbart – tillgängligt men ej aktivt framlyft',
  };
  return descriptions[level];
}

export const AUTO_OBSERVATION_STATUS = {
  version: '15.0',
  blocks: ['DP', 'DQ'],
  capabilities: [
    'continuous_planetary_scan',
    'automatic_observation_detection',
    'neutral_prioritization',
    'visibility_level_assignment',
  ],
  humanTriggerRequired: false,
  interpretationAllowed: false,
} as const;
