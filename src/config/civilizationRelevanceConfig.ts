/**
 * WAVE 17 — BLOCK FA, FB, FC
 * CIVILIZATION RELEVANCE MODEL, DECISION-CHAIN & IMPACT ENGINE
 * 
 * All data får en tydlig plats i beslutskedjan.
 * Detta är inte åsikt – det är påverkningsanalys.
 */

// ============================================
// BLOCK FA: CIVILIZATION RELEVANCE MODEL (CRM)
// ============================================

export type RelevanceLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface RelevanceLevelDefinition {
  level: RelevanceLevel;
  name: string;
  name_en: string;
  description: string;
  characteristics: {
    scope: string;
    impact: string;
    horizon: string;
    typical_actors: string[];
  };
  examples: string[];
  color: string;
  icon: string;
}

export const RELEVANCE_LEVELS: Record<RelevanceLevel, RelevanceLevelDefinition> = {
  L0: {
    level: 'L0',
    name: 'Noise',
    name_en: 'Noise',
    description: 'Lokalt, låg påverkan, kortlivat',
    characteristics: {
      scope: 'Lokal / enskild händelse',
      impact: 'Minimal eller ingen systemeffekt',
      horizon: 'Dagar till veckor',
      typical_actors: ['Individer', 'Lokala verksamheter'],
    },
    examples: [
      'Tillfällig lokal störning',
      'Enskild organisationsförändring',
      'Kortsiktig fluktuation',
    ],
    color: 'hsl(var(--muted))',
    icon: '🔹',
  },
  L1: {
    level: 'L1',
    name: 'Operational',
    name_en: 'Operational',
    description: 'Påverkar drift, lokala/regionala beslut, kort-medellång horisont',
    characteristics: {
      scope: 'Regional / sektoriell',
      impact: 'Påverkar daglig drift och operativa beslut',
      horizon: 'Månader till 1-2 år',
      typical_actors: ['Kommuner', 'Myndigheter', 'Regionala organisationer'],
    },
    examples: [
      'Kommunal budgetförändring',
      'Regional arbetsmarknadstrend',
      'Sektoriell regeländring',
    ],
    color: 'hsl(var(--accent))',
    icon: '🔸',
  },
  L2: {
    level: 'L2',
    name: 'Tactical',
    name_en: 'Tactical',
    description: 'Påverkar policyutfall, sektors- eller regionsnivå, medellång horisont',
    characteristics: {
      scope: 'Nationell sektor / flera regioner',
      impact: 'Påverkar policyimplementering och sektorsutfall',
      horizon: '2-5 år',
      typical_actors: ['Departement', 'Nationella myndigheter', 'Branschorganisationer'],
    },
    examples: [
      'Nationell utbildningsreform',
      'Sektorsövergripande regeländring',
      'Strukturell branschförändring',
    ],
    color: 'hsl(var(--primary))',
    icon: '🔺',
  },
  L3: {
    level: 'L3',
    name: 'Strategic',
    name_en: 'Strategic',
    description: 'Påverkar nationer/system, långsiktiga effekter, kräver samordning',
    characteristics: {
      scope: 'Nationell / internationell',
      impact: 'Påverkar hela system och nationella utfall',
      horizon: '5-20 år',
      typical_actors: ['Regeringar', 'Internationella organ', 'Storföretag'],
    },
    examples: [
      'Pensionssystemsreform',
      'Energisystemomställning',
      'Demografisk transformation',
    ],
    color: 'hsl(var(--destructive))',
    icon: '🔴',
  },
  L4: {
    level: 'L4',
    name: 'Civilizational',
    name_en: 'Civilizational',
    description: 'Påverkar befolkningens livsbetingelser, generationseffekter, systemkritiska samband',
    characteristics: {
      scope: 'Global / civilisatorisk',
      impact: 'Påverkar mänsklighetens framtid och livsbetingelser',
      horizon: '20-100+ år',
      typical_actors: ['Stater', 'Internationella institutioner', 'Globala rörelser'],
    },
    examples: [
      'Klimatförändring',
      'AI-transformation',
      'Global demografisk kollaps/explosion',
      'Institutionell erosion',
    ],
    color: 'hsl(0 0% 0%)',
    icon: '⚫',
  },
};

export interface RelevanceClassification {
  object_id: string;
  object_type: 'kpi' | 'index' | 'observation' | 'pattern' | 'event' | 'decision';
  
  primary_level: RelevanceLevel;
  secondary_levels: RelevanceLevel[];
  
  classification: {
    scope_score: number;        // 0-1
    impact_score: number;       // 0-1
    duration_score: number;     // 0-1
    connectivity_score: number; // 0-1
    certainty_score: number;    // 0-1
  };
  
  rationale: string;
  methodology: string;
  
  classified_at: string;
  classifier_version: string;
}

// ============================================
// BLOCK FB: DECISION-CHAIN MAPPING ENGINE
// ============================================

export type DecisionType = 
  | 'constitutional'
  | 'legislative'
  | 'regulatory'
  | 'administrative'
  | 'operational'
  | 'individual';

export type DecisionLevel = 
  | 'supranational'
  | 'national'
  | 'regional'
  | 'municipal'
  | 'organizational'
  | 'individual';

export type ResponsibilityLevel = 
  | 'parliament'
  | 'government'
  | 'ministry'
  | 'agency'
  | 'regional_authority'
  | 'municipality'
  | 'organization'
  | 'citizen';

export interface DecisionChainNode {
  node_id: string;
  node_type: DecisionType;
  level: DecisionLevel;
  responsibility: ResponsibilityLevel;
  
  actor: {
    name: string;
    type: string;
    country_code: string;
  };
  
  influence: {
    upstream: string[];   // What feeds into this
    downstream: string[]; // What this affects
  };
  
  time_horizon: {
    implementation: string;  // "months", "years", "decades"
    effect_visibility: string;
  };
}

export interface DecisionChainMapping {
  chain_id: string;
  subject: string;
  subject_type: 'kpi' | 'policy_area' | 'outcome';
  
  chain: DecisionChainNode[];
  
  user_position: {
    current_level: DecisionLevel;
    influence_path: string;
  };
  
  display_text: string; // Human-readable chain description
  
  created_at: string;
}

export const DECISION_CHAIN_CONFIG = {
  levels: {
    supranational: { name: 'Överstatlig', examples: ['EU', 'FN', 'IMF'] },
    national: { name: 'Nationell', examples: ['Riksdag', 'Regering'] },
    regional: { name: 'Regional', examples: ['Region', 'Länsstyrelse'] },
    municipal: { name: 'Kommunal', examples: ['Kommunfullmäktige', 'Nämnd'] },
    organizational: { name: 'Organisatorisk', examples: ['Företag', 'Myndighet'] },
    individual: { name: 'Individuell', examples: ['Medborgare', 'Konsument'] },
  },
  
  displayFormat: {
    template: 'Detta värde påverkas av {chain}',
    separator: ' → ',
    example: 'nationell policy → lag → myndighetsutövning → lokal implementering',
  },
  
  principle: 'Användaren ser var i systemet detta lever.',
} as const;

// ============================================
// BLOCK FC: IMPACT QUANTIFICATION ENGINE
// ============================================

export interface ImpactDimensions {
  population_coverage: {
    affected_count: number;
    percentage_of_total: number;
    demographic_groups: string[];
  };
  
  geographic_spread: {
    regions_affected: number;
    countries_affected: number;
    coverage_type: 'local' | 'regional' | 'national' | 'international' | 'global';
  };
  
  duration: {
    onset: 'immediate' | 'gradual' | 'delayed';
    persistence: 'temporary' | 'medium_term' | 'long_term' | 'permanent';
    reversibility: 'easily_reversible' | 'difficult_to_reverse' | 'irreversible';
  };
  
  system_connections: {
    primary_systems: string[];
    secondary_systems: string[];
    cascade_potential: 'low' | 'medium' | 'high' | 'extreme';
  };
  
  secondary_effects: {
    known_effects: string[];
    potential_effects: string[];
    uncertainty_level: number; // 0-1
  };
}

export interface ImpactQuantification {
  object_id: string;
  calculated_at: string;
  
  dimensions: ImpactDimensions;
  
  scores: {
    impact_score: number;      // 0-100, overall impact
    impact_range: {
      min: number;
      max: number;
    };
    impact_confidence: number; // 0-1, how certain
  };
  
  methodology: {
    model_version: string;
    factors_used: string[];
    limitations: string[];
  };
  
  // CRITICAL: Media intensity is IGNORED
  media_intensity: null; // Explicitly null - never used
}

export const IMPACT_QUANTIFICATION_CONFIG = {
  dimensions: {
    population_coverage: { weight: 0.25, name: 'Befolkningstäckning' },
    geographic_spread: { weight: 0.20, name: 'Geografisk spridning' },
    duration: { weight: 0.20, name: 'Varaktighet' },
    system_connections: { weight: 0.25, name: 'Systemkopplingar' },
    secondary_effects: { weight: 0.10, name: 'Sekundära effekter' },
  },
  
  scoring: {
    min: 0,
    max: 100,
    thresholds: {
      minimal: 10,
      low: 25,
      medium: 50,
      high: 75,
      extreme: 90,
    },
  },
  
  principles: {
    media_intensity: 'IGNORERAS',
    focus: 'Faktisk påverkan, inte uppmärksamhet',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function classifyRelevance(
  objectId: string,
  objectType: RelevanceClassification['object_type'],
  scores: RelevanceClassification['classification']
): RelevanceClassification {
  // Calculate weighted average
  const weights = { scope: 0.25, impact: 0.30, duration: 0.20, connectivity: 0.15, certainty: 0.10 };
  const weighted = 
    scores.scope_score * weights.scope +
    scores.impact_score * weights.impact +
    scores.duration_score * weights.duration +
    scores.connectivity_score * weights.connectivity;
  
  // Determine level
  let primaryLevel: RelevanceLevel = 'L0';
  if (weighted >= 0.85) primaryLevel = 'L4';
  else if (weighted >= 0.65) primaryLevel = 'L3';
  else if (weighted >= 0.45) primaryLevel = 'L2';
  else if (weighted >= 0.25) primaryLevel = 'L1';
  
  return {
    object_id: objectId,
    object_type: objectType,
    primary_level: primaryLevel,
    secondary_levels: [],
    classification: scores,
    rationale: RELEVANCE_LEVELS[primaryLevel].description,
    methodology: 'weighted_multi_factor_v1',
    classified_at: new Date().toISOString(),
    classifier_version: '17.0',
  };
}

export function buildDecisionChainText(chain: DecisionChainNode[]): string {
  const levels = chain.map(node => {
    const levelConfig = DECISION_CHAIN_CONFIG.levels[node.level];
    return levelConfig?.name || node.level;
  });
  
  return DECISION_CHAIN_CONFIG.displayFormat.template.replace(
    '{chain}',
    levels.join(DECISION_CHAIN_CONFIG.displayFormat.separator)
  );
}

export function calculateImpactScore(dimensions: ImpactDimensions): number {
  const config = IMPACT_QUANTIFICATION_CONFIG.dimensions;
  
  // Simplified calculation
  const popScore = dimensions.population_coverage.percentage_of_total / 100;
  const geoScore = dimensions.geographic_spread.regions_affected / 100;
  const durationScore = dimensions.duration.persistence === 'permanent' ? 1 : 
                        dimensions.duration.persistence === 'long_term' ? 0.7 : 0.4;
  const cascadeScore = dimensions.system_connections.cascade_potential === 'extreme' ? 1 :
                       dimensions.system_connections.cascade_potential === 'high' ? 0.7 : 0.4;
  
  const weighted = 
    popScore * config.population_coverage.weight +
    geoScore * config.geographic_spread.weight +
    durationScore * config.duration.weight +
    cascadeScore * config.system_connections.weight;
  
  return Math.round(weighted * 100);
}

export const CIVILIZATION_RELEVANCE_STATUS = {
  version: '17.0',
  blocks: ['FA', 'FB', 'FC'],
  outputs: [
    'civilization_relevance_model_v1',
    'decision_chain_engine_v1',
    'impact_quant_engine_v1',
  ],
  principle: 'Detta är inte åsikt – det är påverkningsanalys.',
} as const;
