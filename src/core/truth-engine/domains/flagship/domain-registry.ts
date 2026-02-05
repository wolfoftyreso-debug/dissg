/**
 * FLAGSHIP DOMAIN REGISTRY
 * 
 * The first 5 domains that prove ST-OS works.
 * Each domain proves a different system strength.
 */

export interface FlagshipDomain {
  readonly code: string;
  readonly name: string;
  readonly name_local: string;
  readonly description: string;
  readonly proves: string;  // What system capability this domain proves
  readonly core_questions: readonly string[];
  readonly node_count_target: number;
  readonly index_count_target: number;
  readonly decision_graph_count_target: number;
  readonly safety_level: 'standard' | 'elevated' | 'critical';
  readonly special_constraints: readonly string[];
}

/**
 * THE 5 FLAGSHIP DOMAINS
 */
export const FLAGSHIP_DOMAINS: Record<string, FlagshipDomain> = {
  
  /**
   * DOMAIN 1: HEALTH & HUMAN CONDITION
   * Proves: HCAL, compliance, semantic safety
   */
  health: {
    code: 'health',
    name: 'Health & Human Condition',
    name_local: 'Hälsa & Mänskligt Tillstånd',
    description: 'Population-level health and wellbeing indicators',
    proves: 'HCAL + Compliance + Semantic Safety',
    core_questions: [
      'What is normal?',
      'What is common?',
      'What has changed over time?',
      'How do regions/groups differ?',
      'What is structural vs temporary?',
    ],
    node_count_target: 50,
    index_count_target: 10,
    decision_graph_count_target: 3,
    safety_level: 'critical',
    special_constraints: [
      'no_diagnosis',
      'no_individual_advice',
      'normalization_required',
      'crisis_detection_active',
    ],
  },

  /**
   * DOMAIN 2: HEALTHCARE SYSTEM
   * Proves: Decision Substrate + Responsibility Model
   */
  healthcare_system: {
    code: 'healthcare_system',
    name: 'Healthcare System Load & Capacity',
    name_local: 'Vårdsystemets Belastning & Kapacitet',
    description: 'System-level healthcare capacity and performance',
    proves: 'Decision Substrate + Responsibility Distribution',
    core_questions: [
      'What is the system normal load?',
      'Where do bottlenecks emerge?',
      'How have wait times changed?',
      'What is regionally structural?',
    ],
    node_count_target: 40,
    index_count_target: 8,
    decision_graph_count_target: 3,
    safety_level: 'elevated',
    special_constraints: [
      'no_individual_treatment',
      'system_level_only',
      'regional_comparison_allowed',
    ],
  },

  /**
   * DOMAIN 3: ECONOMY & COST OF LIVING
   * Proves: Guardrails + Anti-advice + Anti-narrative
   */
  economy: {
    code: 'economy',
    name: 'Economy & Cost of Living',
    name_local: 'Ekonomi & Levnadskostnader',
    description: 'Economic indicators and household cost structures',
    proves: 'Guardrails + Anti-advice + Anti-narrative',
    core_questions: [
      'How have costs changed?',
      'What is volatility vs trend?',
      'What affects households broadly?',
      'What is structurally long-term?',
    ],
    node_count_target: 45,
    index_count_target: 10,
    decision_graph_count_target: 2,
    safety_level: 'elevated',
    special_constraints: [
      'no_investment_advice',
      'no_prediction',
      'scenario_only',
      'volatility_vs_trend_required',
    ],
  },

  /**
   * DOMAIN 4: SOCIETAL STABILITY & SIGNALS
   * Proves: Index-first thinking + Anti-propaganda
   */
  stability: {
    code: 'stability',
    name: 'Societal Stability & Signals',
    name_local: 'Samhällelig Stabilitet & Signaler',
    description: 'Change detection and stability indicators',
    proves: 'Index-first Thinking + Anti-propaganda',
    core_questions: [
      'What is moving faster than normal?',
      'Where is volatility increasing?',
      'What is noise vs system change?',
      'How does attention spread?',
    ],
    node_count_target: 35,
    index_count_target: 12,
    decision_graph_count_target: 2,
    safety_level: 'standard',
    special_constraints: [
      'signal_not_truth',
      'narrative_detection_active',
      'volatility_disclosure_required',
    ],
  },

  /**
   * DOMAIN 5: DEMOGRAPHICS & LONG-TERM STRUCTURE
   * Proves: Civilizational Memory + Long Horizon
   */
  demographics: {
    code: 'demographics',
    name: 'Demographics & Long-term Structure',
    name_local: 'Demografi & Långsiktig Struktur',
    description: 'Population structure and civilizational timescales',
    proves: 'Civilizational Memory + Long Horizon',
    core_questions: [
      'How is population changing over time?',
      'What is irreversible?',
      'What affects all other systems?',
    ],
    node_count_target: 40,
    index_count_target: 8,
    decision_graph_count_target: 2,
    safety_level: 'standard',
    special_constraints: [
      'long_horizon_required',
      'structural_focus',
      'cross_domain_impact_visible',
    ],
  },
} as const;

export type FlagshipDomainCode = keyof typeof FLAGSHIP_DOMAINS;

/**
 * GET DOMAIN
 */
export function getFlagshipDomain(code: string): FlagshipDomain | null {
  return FLAGSHIP_DOMAINS[code] || null;
}

/**
 * GET ALL DOMAINS
 */
export function getAllFlagshipDomains(): FlagshipDomain[] {
  return Object.values(FLAGSHIP_DOMAINS);
}

/**
 * DOMAIN SUMMARY
 */
export function getDomainSummary(): {
  total_domains: number;
  total_nodes_target: number;
  total_indexes_target: number;
  total_decision_graphs_target: number;
  domains: Array<{ code: string; name: string; proves: string }>;
} {
  const domains = getAllFlagshipDomains();
  
  return {
    total_domains: domains.length,
    total_nodes_target: domains.reduce((sum, d) => sum + d.node_count_target, 0),
    total_indexes_target: domains.reduce((sum, d) => sum + d.index_count_target, 0),
    total_decision_graphs_target: domains.reduce((sum, d) => sum + d.decision_graph_count_target, 0),
    domains: domains.map(d => ({
      code: d.code,
      name: d.name,
      proves: d.proves,
    })),
  };
}
