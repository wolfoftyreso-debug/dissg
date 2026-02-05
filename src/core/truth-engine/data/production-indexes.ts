/**
 * PRODUCTION INDEXES
 * 
 * Deklarativa index-recept för maskinell beräkning.
 * Orientering, inte åsikt.
 */

export interface ProductionIndex {
  index_id: string;
  domain: 'health' | 'healthcare' | 'economy' | 'demographics' | 'signals' | 'society';
  scope: {
    geo: string;
    population: string;
    time: string;
  };
  inputs: string[];
  method: {
    normalize?: 'zscore' | 'percentile' | 'minmax' | 'yoy_change' | 'deviation_from_baseline';
    aggregate?: 'weighted_mean' | 'mean' | 'sum';
    compute?: 'rolling_std' | 'events_per_year' | 'dependency_ratio';
    window?: string;
    weights?: Record<string, number>;
  };
  constraints: {
    no_individual_inference?: true;
    no_recommendation?: true;
    no_diagnosis?: true;
    no_policy_recommendation?: true;
    no_comparison_ranking?: true;
    no_financial_advice?: true;
    no_forecast?: true;
    no_content_analysis?: true;
    no_policy_evaluation?: true;
    no_value_judgement?: true;
  };
  semantic_role: {
    structural?: boolean;
    acute?: boolean;
    contextual?: boolean;
  };
  // Display metadata
  shows: string;
  does_not_show: string;
}

// ============================================
// PRODUCTION INDEXES
// ============================================

export const PRODUCTION_INDEXES: ProductionIndex[] = [
  // IDX-001
  {
    index_id: "health.population_mental_load.v1",
    domain: "health",
    scope: {
      geo: "SE",
      population: "all",
      time: "2005-2024"
    },
    inputs: [
      "anxiety_prevalence",
      "self_reported_stress",
      "mental_health_sick_leave"
    ],
    method: {
      normalize: "zscore",
      aggregate: "weighted_mean",
      weights: {
        anxiety_prevalence: 0.35,
        self_reported_stress: 0.30,
        mental_health_sick_leave: 0.35
      }
    },
    constraints: {
      no_individual_inference: true,
      no_recommendation: true
    },
    semantic_role: {
      structural: true,
      acute: false
    },
    shows: "Samlad psykisk belastning i befolkningen",
    does_not_show: "Diagnos, orsak, lösning"
  },

  // IDX-002
  {
    index_id: "health.youth_wellbeing_pressure.v1",
    domain: "health",
    scope: {
      geo: "SE",
      population: "youth_13_19",
      time: "2000-2024"
    },
    inputs: [
      "anxiety_prevalence_youth",
      "sleep_insufficiency_youth",
      "school_stress_reports"
    ],
    method: {
      normalize: "percentile",
      aggregate: "mean"
    },
    constraints: {
      no_diagnosis: true
    },
    semantic_role: {
      structural: true
    },
    shows: "Systemtryck på ungdomars välmående",
    does_not_show: "Individuell diagnos eller prognos"
  },

  // IDX-003
  {
    index_id: "healthcare.system_load.v1",
    domain: "healthcare",
    scope: {
      geo: "SE",
      population: "all",
      time: "2010-2024"
    },
    inputs: [
      "waiting_times",
      "occupancy_rate",
      "staff_turnover"
    ],
    method: {
      normalize: "zscore",
      aggregate: "weighted_mean",
      weights: {
        waiting_times: 0.4,
        occupancy_rate: 0.35,
        staff_turnover: 0.25
      }
    },
    constraints: {
      no_policy_recommendation: true
    },
    semantic_role: {
      structural: true,
      acute: true
    },
    shows: "Om vårdsystemet är under normalt tryck eller inte",
    does_not_show: "Policyrekommendationer"
  },

  // IDX-004
  {
    index_id: "healthcare.regional_stress.v1",
    domain: "healthcare",
    scope: {
      geo: "SE_regions",
      population: "all",
      time: "2015-2024"
    },
    inputs: [
      "regional_waiting_times",
      "regional_occupancy"
    ],
    method: {
      normalize: "minmax",
      aggregate: "mean"
    },
    constraints: {
      no_comparison_ranking: true
    },
    semantic_role: {
      structural: true
    },
    shows: "Ojämn belastning mellan regioner",
    does_not_show: "Vem som är 'sämst'"
  },

  // IDX-005
  {
    index_id: "economy.cost_of_living_pressure.v1",
    domain: "economy",
    scope: {
      geo: "SE",
      population: "households",
      time: "2000-2024"
    },
    inputs: [
      "food_prices",
      "housing_costs",
      "energy_prices"
    ],
    method: {
      normalize: "yoy_change",
      aggregate: "weighted_mean",
      weights: {
        food_prices: 0.3,
        housing_costs: 0.4,
        energy_prices: 0.3
      }
    },
    constraints: {
      no_financial_advice: true
    },
    semantic_role: {
      structural: true,
      acute: true
    },
    shows: "Tryck på hushåll",
    does_not_show: "Hur man ska agera"
  },

  // IDX-006
  {
    index_id: "economy.inflation_volatility.v1",
    domain: "economy",
    scope: {
      geo: "SE",
      population: "all",
      time: "1995-2024"
    },
    inputs: [
      "inflation_rate"
    ],
    method: {
      compute: "rolling_std",
      window: "12m"
    },
    constraints: {
      no_forecast: true
    },
    semantic_role: {
      contextual: true
    },
    shows: "Stabilitet vs ryckighet i inflation",
    does_not_show: "Framtidsprognoser"
  },

  // IDX-007
  {
    index_id: "signals.media_volatility.v1",
    domain: "signals",
    scope: {
      geo: "SE",
      population: "all",
      time: "realtime"
    },
    inputs: [
      "media_mentions_frequency"
    ],
    method: {
      normalize: "deviation_from_baseline"
    },
    constraints: {
      no_content_analysis: true
    },
    semantic_role: {
      acute: true
    },
    shows: "Uppmärksamhetsryckighet",
    does_not_show: "Vad man ska tycka"
  },

  // IDX-008
  {
    index_id: "signals.policy_change_frequency.v1",
    domain: "signals",
    scope: {
      geo: "SE",
      population: "all",
      time: "2000-2024"
    },
    inputs: [
      "enacted_policy_events"
    ],
    method: {
      compute: "events_per_year"
    },
    constraints: {
      no_policy_evaluation: true
    },
    semantic_role: {
      contextual: true
    },
    shows: "Frekvens av policyförändringar",
    does_not_show: "Värdering av policy"
  },

  // IDX-009
  {
    index_id: "demographics.dependency_ratio.v1",
    domain: "demographics",
    scope: {
      geo: "SE",
      population: "all",
      time: "1970-2024"
    },
    inputs: [
      "population_age_structure"
    ],
    method: {
      compute: "dependency_ratio"
    },
    constraints: {},
    semantic_role: {
      structural: true
    },
    shows: "Långsiktigt tryck på system från demografisk struktur",
    does_not_show: "Politisk värdering"
  },

  // IDX-010 — META INDEX
  {
    index_id: "society.stability_meta.v1",
    domain: "society",
    scope: {
      geo: "SE",
      population: "all",
      time: "2000-2024"
    },
    inputs: [
      "healthcare_system_load",
      "cost_of_living_pressure",
      "demographic_dependency",
      "media_volatility"
    ],
    method: {
      normalize: "zscore",
      aggregate: "weighted_mean"
    },
    constraints: {
      no_value_judgement: true
    },
    semantic_role: {
      structural: true
    },
    shows: "Systemets samlade stabilitet",
    does_not_show: "Hotbild, skuld, lösning"
  }
];

// ============================================
// LOOKUP & STATS
// ============================================

export function getIndex(indexId: string): ProductionIndex | undefined {
  return PRODUCTION_INDEXES.find(i => i.index_id === indexId);
}

export function getIndexesByDomain(domain: ProductionIndex['domain']): ProductionIndex[] {
  return PRODUCTION_INDEXES.filter(i => i.domain === domain);
}

export function getStructuralIndexes(): ProductionIndex[] {
  return PRODUCTION_INDEXES.filter(i => i.semantic_role.structural);
}

export function getAcuteIndexes(): ProductionIndex[] {
  return PRODUCTION_INDEXES.filter(i => i.semantic_role.acute);
}

export const INDEX_STATS = {
  total: PRODUCTION_INDEXES.length,
  by_domain: {
    health: PRODUCTION_INDEXES.filter(i => i.domain === 'health').length,
    healthcare: PRODUCTION_INDEXES.filter(i => i.domain === 'healthcare').length,
    economy: PRODUCTION_INDEXES.filter(i => i.domain === 'economy').length,
    demographics: PRODUCTION_INDEXES.filter(i => i.domain === 'demographics').length,
    signals: PRODUCTION_INDEXES.filter(i => i.domain === 'signals').length,
    society: PRODUCTION_INDEXES.filter(i => i.domain === 'society').length,
  },
  structural: PRODUCTION_INDEXES.filter(i => i.semantic_role.structural).length,
  acute: PRODUCTION_INDEXES.filter(i => i.semantic_role.acute).length,
} as const;

// Index dependency graph for meta-indexes
export const INDEX_DEPENDENCIES: Record<string, string[]> = {
  'society.stability_meta.v1': [
    'healthcare.system_load.v1',
    'economy.cost_of_living_pressure.v1',
    'demographics.dependency_ratio.v1',
    'signals.media_volatility.v1'
  ]
};
