/**
 * WAVE 17 — BLOCK FH, FI, FJ
 * GLOBAL RELEVANCE COMPARISON, LONG-HORIZON TRACKING & CIVILIZATION HEALTH INDEX
 * 
 * Civilisation tänks i generationer, inte val.
 * Se bortom mandatperioder.
 */

import { RelevanceLevel } from './civilizationRelevanceConfig';

// ============================================
// BLOCK FH: GLOBAL RELEVANCE COMPARISON
// ============================================

export interface CountryRelevanceFocus {
  country_code: string;
  country_name: string;
  
  analysis_period: {
    start: string;
    end: string;
  };
  
  focus_distribution: {
    L0: number; // Percentage of attention on L0
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
  
  primary_focus: RelevanceLevel;
  secondary_focus: RelevanceLevel;
  
  top_topics_by_level: {
    level: RelevanceLevel;
    topics: string[];
  }[];
  
  comparison: {
    vs_global_average: number; // -1 to 1, where 1 = more long-term focused
    vs_similar_countries: number;
    trend: 'more_short_term' | 'stable' | 'more_long_term';
  };
}

export interface GlobalRelevanceComparison {
  comparison_id: string;
  generated_at: string;
  period: { start: string; end: string };
  
  countries: CountryRelevanceFocus[];
  
  insights: {
    most_long_term_focused: string[];   // Country codes
    most_short_term_focused: string[];  // Country codes
    biggest_shifts: Array<{
      country_code: string;
      direction: 'toward_long_term' | 'toward_short_term';
      magnitude: number;
    }>;
  };
  
  display_examples: {
    template: string;
    examples: string[];
  };
}

export const GLOBAL_RELEVANCE_CONFIG = {
  focus_calculation: {
    data_sources: [
      'government_agenda',
      'legislative_activity',
      'budget_allocation',
      'policy_announcements',
      'media_coverage',
    ],
    weighting: {
      government_agenda: 0.30,
      legislative_activity: 0.25,
      budget_allocation: 0.25,
      policy_announcements: 0.10,
      media_coverage: 0.10,
    },
  },
  
  display: {
    example_template: 'Land {A} fokuserar främst på {level_A}-frågor. Land {B} fokuserar på {level_B}.',
    examples: [
      'Land A fokuserar främst på L1-frågor.',
      'Land B fokuserar på L3–L4.',
    ],
  },
  
  principle: 'Detta är samhällsdiagnostik.',
} as const;

// ============================================
// BLOCK FI: LONG-HORIZON SIGNAL TRACKING (50-100 ÅR)
// ============================================

export type LongHorizonDomain = 
  | 'demographics'
  | 'institutional_health'
  | 'education'
  | 'energy_systems'
  | 'health_outcomes'
  | 'climate_adaptation'
  | 'technology_infrastructure'
  | 'social_cohesion';

export interface LongHorizonSignal {
  signal_id: string;
  domain: LongHorizonDomain;
  
  title: string;
  description: string;
  
  time_characteristics: {
    detection_date: string;
    estimated_impact_start: string;
    estimated_peak_impact: string;
    impact_duration_years: number;
    confidence_in_timeline: number;
  };
  
  trajectory: {
    direction: 'improving' | 'stable' | 'declining' | 'uncertain';
    rate_of_change: 'slow' | 'moderate' | 'rapid' | 'accelerating';
    reversibility: 'reversible' | 'difficult' | 'irreversible';
  };
  
  generational_impact: {
    current_generation: number;  // 0-100 impact score
    next_generation: number;     // 20-30 years
    future_generations: number;  // 50-100 years
  };
  
  related_signals: string[];
  
  data_sources: {
    source: string;
    reliability: number;
    update_frequency: string;
  }[];
}

export interface LongHorizonDomainAnalysis {
  domain: LongHorizonDomain;
  name: string;
  description: string;
  
  current_state: {
    health_score: number;      // 0-100
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
  };
  
  signals: LongHorizonSignal[];
  
  key_indicators: {
    indicator_id: string;
    name: string;
    current_value: number;
    trend_50_year: 'up' | 'stable' | 'down';
    critical_threshold: number | null;
  }[];
  
  policy_time_horizon_mismatch: {
    typical_policy_horizon_years: number;
    required_horizon_years: number;
    mismatch_severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

export const LONG_HORIZON_DOMAINS: Record<LongHorizonDomain, { name: string; description: string; typical_horizon_years: number }> = {
  demographics: {
    name: 'Demografiska skiften',
    description: 'Befolkningsstruktur, åldersfördelning, migration',
    typical_horizon_years: 50,
  },
  institutional_health: {
    name: 'Institutionell erosion/styrka',
    description: 'Förtroendenivåer, korruption, rättsstatlighet',
    typical_horizon_years: 30,
  },
  education: {
    name: 'Utbildningstrender',
    description: 'Kunskapsnivåer, utbildningssystem, kompetensutveckling',
    typical_horizon_years: 40,
  },
  energy_systems: {
    name: 'Energisystem',
    description: 'Energikällor, infrastruktur, omställning',
    typical_horizon_years: 50,
  },
  health_outcomes: {
    name: 'Hälsoutfall',
    description: 'Livslängd, sjukdomsbörda, vårdsystem',
    typical_horizon_years: 40,
  },
  climate_adaptation: {
    name: 'Klimatanpassning',
    description: 'Klimatresiliens, anpassningsförmåga',
    typical_horizon_years: 100,
  },
  technology_infrastructure: {
    name: 'Teknologisk infrastruktur',
    description: 'Digital mognad, innovationskapacitet',
    typical_horizon_years: 25,
  },
  social_cohesion: {
    name: 'Social sammanhållning',
    description: 'Tillit, polarisering, gemensamma värderingar',
    typical_horizon_years: 30,
  },
};

export const LONG_HORIZON_CONFIG = {
  tracking_horizon: {
    minimum_years: 50,
    maximum_years: 100,
    primary_focus: 'generational_effects',
  },
  
  signal_types: Object.keys(LONG_HORIZON_DOMAINS) as LongHorizonDomain[],
  
  principle: 'Civilisation tänks i generationer, inte val.',
  
  mandate_comparison: {
    typical_political_mandate_years: 4,
    required_horizon_years: 50,
    mismatch_message: 'Politiska mandat är designade för 4 år. Dessa utmaningar kräver 50+ år.',
  },
} as const;

// ============================================
// BLOCK FJ: CIVILIZATION HEALTH INDEX (CHI)
// ============================================

export interface CHIPillar {
  pillar_id: string;
  name: string;
  name_en: string;
  description: string;
  
  weight: number;
  
  components: {
    component_id: string;
    name: string;
    weight_within_pillar: number;
    current_score: number;
    trend: 'improving' | 'stable' | 'declining';
    data_source: string;
  }[];
  
  current_score: number;
  confidence: number;
}

export interface CivilizationHealthIndex {
  index_id: string;
  country_code: string;
  calculated_at: string;
  period: { start: string; end: string };
  
  overall: {
    score: number;        // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
  };
  
  pillars: CHIPillar[];
  
  transparency: {
    fully_open: boolean;
    breakable: boolean;     // Can break down into components
    clickable: boolean;     // Can click into each component
    methodology_url: string;
    raw_data_url: string;
  };
  
  audiences: {
    statsminister_view: boolean;   // High-level summary
    medborgare_view: boolean;      // Citizen-accessible
  };
}

export const CHI_PILLARS_CONFIG: Omit<CHIPillar, 'current_score' | 'confidence' | 'components'>[] = [
  {
    pillar_id: 'living_conditions',
    name: 'Livsbetingelser',
    name_en: 'Living Conditions',
    description: 'Grundläggande levnadsvillkor och livskvalitet',
    weight: 0.30,
  },
  {
    pillar_id: 'stability',
    name: 'Stabilitet',
    name_en: 'Stability',
    description: 'Politisk, ekonomisk och social stabilitet',
    weight: 0.25,
  },
  {
    pillar_id: 'future_capacity',
    name: 'Framtidskapacitet',
    name_en: 'Future Capacity',
    description: 'Förmåga att möta framtida utmaningar',
    weight: 0.25,
  },
  {
    pillar_id: 'institutional_health',
    name: 'Institutionell hälsa',
    name_en: 'Institutional Health',
    description: 'Styrka och legitimitet hos samhällsinstitutioner',
    weight: 0.20,
  },
];

export const CHI_CONFIG = {
  scoring: {
    scale: { min: 0, max: 100 },
    grades: {
      A: { min: 80, label: 'Utmärkt' },
      B: { min: 65, label: 'God' },
      C: { min: 50, label: 'Tillfredsställande' },
      D: { min: 35, label: 'Otillräcklig' },
      F: { min: 0, label: 'Kritisk' },
    },
  },
  
  transparency: {
    fully_open: true,
    breakable: true,
    clickable: true,
    principle: 'Allt: öppet, brytbart, klickbart.',
  },
  
  audiences: {
    statsminister: {
      name: 'Statsministernivå',
      focus: 'Strategic overview, key trends, critical alerts',
    },
    medborgare: {
      name: 'Medborgarnivå',
      focus: 'Accessible explanation, personal relevance, actionable insights',
    },
  },
  
  pillars: CHI_PILLARS_CONFIG,
} as const;

// ============================================
// WAVE 17 COMPLETE STATUS
// ============================================

export const WAVE_17_STATUS = {
  version: '17.0',
  name: 'Civilization-Scale Relevance & Priority Model',
  
  blocks: {
    FA: 'civilization_relevance_model_v1',
    FB: 'decision_chain_engine_v1',
    FC: 'impact_quant_engine_v1',
    FD: 'priority_stack_v1',
    FE: 'why_it_matters_v1',
    FF: 'attention_mismatch_engine_v1',
    FG: 'relevance_override_v1',
    FH: 'relevance_comparison_v1',
    FI: 'long_horizon_engine_v1',
    FJ: 'chi_index_v1',
  },
  
  capabilities: {
    relevance_levels: true,        // L0-L4
    decision_chain_mapping: true,
    impact_quantification: true,
    priority_stack: true,
    why_it_matters: true,
    attention_mismatch: true,
    user_overrides: true,
    global_comparison: true,
    long_horizon_50_100_years: true,
    civilization_health_index: true,
  },
  
  achievements: [
    'Global verklighetsmodell',
    'Relevanshierarki',
    'Beslutskedjor',
    'Prioriteringslogik',
    'Civilisationsmått',
  ],
  
  corePrinciple: 'Detta löser det mänskliga problemet med data: inte brist på information – utan brist på orientering.',
  
  userOutcomes: [
    'Folk vet vad som betyder något',
    'Folk vet varför',
    'Folk vet på vilken nivå',
    'Folk vet vem som ansvarar',
  ],
  
  finalStatement: 'Detta är det som saknats i världen.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateCHIScore(pillars: CHIPillar[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const pillar of pillars) {
    weightedSum += pillar.current_score * pillar.weight;
    totalWeight += pillar.weight;
  }
  
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function getCHIGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  const grades = CHI_CONFIG.scoring.grades;
  if (score >= grades.A.min) return 'A';
  if (score >= grades.B.min) return 'B';
  if (score >= grades.C.min) return 'C';
  if (score >= grades.D.min) return 'D';
  return 'F';
}

export function createLongHorizonSignal(
  domain: LongHorizonDomain,
  title: string,
  description: string,
  trajectory: LongHorizonSignal['trajectory'],
  generationalImpact: LongHorizonSignal['generational_impact']
): LongHorizonSignal {
  const domainConfig = LONG_HORIZON_DOMAINS[domain];
  
  return {
    signal_id: `lhs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    domain,
    title,
    description,
    time_characteristics: {
      detection_date: new Date().toISOString(),
      estimated_impact_start: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_peak_impact: new Date(Date.now() + domainConfig.typical_horizon_years * 365 * 24 * 60 * 60 * 1000).toISOString(),
      impact_duration_years: domainConfig.typical_horizon_years,
      confidence_in_timeline: 0.6,
    },
    trajectory,
    generational_impact: generationalImpact,
    related_signals: [],
    data_sources: [],
  };
}

export function compareCountryRelevanceFocus(
  countryA: CountryRelevanceFocus,
  countryB: CountryRelevanceFocus
): string {
  const levelNames = { L0: 'L0', L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4' };
  
  return GLOBAL_RELEVANCE_CONFIG.display.example_template
    .replace('{A}', countryA.country_name)
    .replace('{level_A}', levelNames[countryA.primary_focus])
    .replace('{B}', countryB.country_name)
    .replace('{level_B}', `${levelNames[countryB.primary_focus]}–${levelNames[countryB.secondary_focus]}`);
}
