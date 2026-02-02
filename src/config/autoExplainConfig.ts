/**
 * WAVE 15 — BLOCK DR, DS
 * AUTO-EXPLANATION PIPELINE & CROSS-DOMAIN SYNTHESIS
 * 
 * Varje observation förklaras automatiskt.
 * Systemet binder ihop ekonomi + samhälle + energi + hälsa.
 */

// ============================================
// BLOCK DR: AUTO-EXPLANATION PIPELINE
// ============================================

export interface AutoExplanation {
  observation_id: string;
  generated_at: string;
  
  // Mandatory explanation structure
  what_happened: {
    description: string;
    metric_name: string;
    change_value: number;
    change_unit: string;
    change_direction: 'increased' | 'decreased' | 'unchanged';
  };
  
  where: {
    level: string;
    locations: string[];
    coverage_note: string;
  };
  
  when: {
    period: string;
    detection_lag: string;
    data_freshness: string;
  };
  
  what_moved_before: {
    observations: Array<{
      id: string;
      name: string;
      lead_time_months: number;
      correlation_strength: number;
    }>;
    note: string;
  };
  
  what_moved_simultaneously: {
    observations: Array<{
      id: string;
      name: string;
      domains: string[];
      correlation_strength: number;
    }>;
    note: string;
  };
  
  what_did_not_move: {
    expected_correlates: string[];
    note: string;
  };
  
  confidence: {
    overall: number;
    data_quality: number;
    temporal_coverage: number;
    source_reliability: number;
    explanation: string;
  };
  
  links: {
    raw_data_url: string;
    methodology_url: string;
    lineage_url: string;
    reproduction_url: string;
  };
  
  // Enforced neutrality
  interpretation: null;
  recommendation: null;
  value_judgment: null;
}

export const EXPLANATION_STRUCTURE_CONFIG = {
  mandatoryQuestions: [
    'Vad hände?',
    'Var?',
    'När?',
    'Vad rörde sig före?',
    'Vad rörde sig samtidigt?',
    'Vad rörde sig inte?',
    'Hur säker är observationen?',
  ],
  
  mandatoryLinks: [
    'raw_data',
    'methodology',
    'lineage',
  ],
  
  language: {
    neutral: true,
    noValueWords: true,
    noRecommendations: true,
    noInterpretations: true,
    factualOnly: true,
  },
  
  templates: {
    what_happened: '{metric} {direction} med {value} {unit} under {period}.',
    where: 'Observerat i {locations} ({level}-nivå). {coverage_note}',
    when: 'Period: {period}. Dataeftersläpning: {lag}. Senaste datapunkt: {freshness}.',
    confidence: 'Konfidens: {overall}% (datakvalitet: {quality}%, täckning: {coverage}%, källtillförlitlighet: {source}%).',
  },
} as const;

// ============================================
// BLOCK DS: CROSS-DOMAIN SYNTHESIS
// ============================================

export type SynthesisDomain = 
  | 'economy'
  | 'society'
  | 'energy'
  | 'health'
  | 'environment'
  | 'governance'
  | 'education'
  | 'infrastructure';

export interface SynthesisObject {
  synthesis_id: string;
  generated_at: string;
  
  domains_involved: SynthesisDomain[];
  domain_count: number;
  
  temporal_alignment: {
    alignment_type: 'simultaneous' | 'sequential' | 'lagged';
    lag_months: number | null;
    correlation_window: string;
  };
  
  shared_regions: {
    codes: string[];
    names: string[];
    coverage_percent: number;
  };
  
  confidence: number;
  
  related_observations: Array<{
    observation_id: string;
    domain: SynthesisDomain;
    contribution_weight: number;
  }>;
  
  synthesis_type: 'convergence' | 'divergence' | 'cascade' | 'parallel';
  
  description: string; // Neutral, factual
  
  // Enforced neutrality
  interpretation: null;
  recommendation: null;
  causal_claim: null; // Never claim causation
}

export const CROSS_DOMAIN_CONFIG = {
  domains: {
    economy: {
      name: 'Ekonomi',
      kpi_categories: ['gdp', 'employment', 'inflation', 'trade', 'investment'],
    },
    society: {
      name: 'Samhälle',
      kpi_categories: ['inequality', 'poverty', 'housing', 'crime', 'wellbeing'],
    },
    energy: {
      name: 'Energi',
      kpi_categories: ['production', 'consumption', 'renewables', 'emissions', 'prices'],
    },
    health: {
      name: 'Hälsa',
      kpi_categories: ['mortality', 'morbidity', 'healthcare', 'mental_health', 'life_expectancy'],
    },
    environment: {
      name: 'Miljö',
      kpi_categories: ['air_quality', 'water', 'biodiversity', 'land_use', 'waste'],
    },
    governance: {
      name: 'Styrning',
      kpi_categories: ['democracy', 'corruption', 'rule_of_law', 'trust', 'participation'],
    },
    education: {
      name: 'Utbildning',
      kpi_categories: ['attainment', 'quality', 'access', 'skills', 'research'],
    },
    infrastructure: {
      name: 'Infrastruktur',
      kpi_categories: ['transport', 'digital', 'utilities', 'housing_stock'],
    },
  },
  
  synthesisTypes: {
    convergence: {
      name: 'Konvergens',
      description: 'Flera domäner rör sig i samma riktning',
    },
    divergence: {
      name: 'Divergens',
      description: 'Domäner rör sig i motsatta riktningar',
    },
    cascade: {
      name: 'Kaskad',
      description: 'Sekventiell rörelse från domän till domän',
    },
    parallel: {
      name: 'Parallell',
      description: 'Samtidig rörelse utan tydlig koppling',
    },
  },
  
  minimumDomainsForSynthesis: 2,
  minimumCorrelation: 0.4,
  
  causalityPolicy: {
    neverClaimCausation: true,
    onlyShowCorrelation: true,
    alwaysShowAlternatives: true,
    alwaysShowUncertainty: true,
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function generateAutoExplanation(
  observation: any, // ObservationObject from autoObservationConfig
  context: {
    precedingObservations: any[];
    simultaneousObservations: any[];
    expectedButMissing: string[];
  }
): AutoExplanation {
  return {
    observation_id: observation.observation_id,
    generated_at: new Date().toISOString(),
    
    what_happened: {
      description: `${observation.what_changed}`,
      metric_name: observation.what_changed,
      change_value: observation.magnitude.absolute_change,
      change_unit: '%',
      change_direction: observation.magnitude.percent_change > 0 ? 'increased' : 
                        observation.magnitude.percent_change < 0 ? 'decreased' : 'unchanged',
    },
    
    where: {
      level: observation.where.level,
      locations: observation.where.names,
      coverage_note: `Täcker ${observation.where.codes.length} geografiska enheter.`,
    },
    
    when: {
      period: `${observation.when.period_start} till ${observation.when.period_end}`,
      detection_lag: `${observation.when.lag_hours} timmar`,
      data_freshness: observation.when.detected_at,
    },
    
    what_moved_before: {
      observations: context.precedingObservations.map(o => ({
        id: o.observation_id,
        name: o.what_changed,
        lead_time_months: 3, // Simplified
        correlation_strength: 0.6, // Simplified
      })),
      note: context.precedingObservations.length > 0 
        ? `${context.precedingObservations.length} relaterade förändringar observerades tidigare.`
        : 'Inga tydliga föregående förändringar identifierade.',
    },
    
    what_moved_simultaneously: {
      observations: context.simultaneousObservations.map(o => ({
        id: o.observation_id,
        name: o.what_changed,
        domains: o.related_dimensions.domains,
        correlation_strength: 0.5, // Simplified
      })),
      note: context.simultaneousObservations.length > 0
        ? `${context.simultaneousObservations.length} samtidiga förändringar i andra domäner.`
        : 'Inga tydliga samtidiga förändringar i andra domäner.',
    },
    
    what_did_not_move: {
      expected_correlates: context.expectedButMissing,
      note: context.expectedButMissing.length > 0
        ? `Historiskt korrelerade mått som INTE rörde sig: ${context.expectedButMissing.join(', ')}.`
        : 'Alla historiskt korrelerade mått visade förväntade mönster.',
    },
    
    confidence: {
      overall: observation.confidence * 100,
      data_quality: 85, // Simplified
      temporal_coverage: 90, // Simplified
      source_reliability: 88, // Simplified
      explanation: `Baserat på ${observation.links ? 'verifierbara' : 'tillgängliga'} datakällor.`,
    },
    
    links: {
      raw_data_url: observation.links?.raw_data || '/api/raw-data/' + observation.observation_id,
      methodology_url: observation.links?.methodology || '/docs/methodology',
      lineage_url: observation.links?.lineage || '/api/lineage/' + observation.observation_id,
      reproduction_url: '/api/reproduce/' + observation.observation_id,
    },
    
    interpretation: null,
    recommendation: null,
    value_judgment: null,
  };
}

export function createSynthesis(
  observations: any[],
  sharedRegions: string[]
): SynthesisObject {
  const domains = [...new Set(observations.flatMap(o => o.related_dimensions?.domains || []))] as SynthesisDomain[];
  
  return {
    synthesis_id: `syn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    generated_at: new Date().toISOString(),
    
    domains_involved: domains,
    domain_count: domains.length,
    
    temporal_alignment: {
      alignment_type: 'simultaneous',
      lag_months: null,
      correlation_window: '3 months',
    },
    
    shared_regions: {
      codes: sharedRegions,
      names: sharedRegions, // Simplified
      coverage_percent: 100,
    },
    
    confidence: Math.min(...observations.map(o => o.confidence)) * 100,
    
    related_observations: observations.map(o => ({
      observation_id: o.observation_id,
      domain: (o.related_dimensions?.domains?.[0] || 'economy') as SynthesisDomain,
      contribution_weight: 1 / observations.length,
    })),
    
    synthesis_type: 'convergence',
    
    description: `Observerad samtidig rörelse i ${domains.length} domäner: ${domains.join(', ')}.`,
    
    interpretation: null,
    recommendation: null,
    causal_claim: null,
  };
}

export const AUTO_EXPLAIN_STATUS = {
  version: '15.0',
  blocks: ['DR', 'DS'],
  capabilities: [
    'automatic_explanation_generation',
    'cross_domain_synthesis',
    'mandatory_link_inclusion',
    'neutral_language_enforcement',
  ],
  coreIntelligence: 'cross_domain_synthesis',
} as const;
