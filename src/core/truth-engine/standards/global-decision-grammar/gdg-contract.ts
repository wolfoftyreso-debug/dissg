/**
 * GLOBAL DECISION GRAMMAR (GDG) v1.0 — MACHINE-READABLE CONTRACT
 * 
 * The publishable standard that makes you the default for decisions in the AI era.
 * 
 * This is not marketing. This is a contract that other systems adapt to.
 */

/**
 * GDG CONTRACT VERSION
 */
export const GDG_CONTRACT_VERSION = {
  version: '1.0.0',
  status: 'stable',
  locked: true,
  published: '2025-01-01',
  breaking_changes_allowed: false,
} as const;

/**
 * CANONICAL CONCEPTS (LOCKED)
 */
export const GDG_CANONICAL_CONCEPTS = {
  decision: {
    id: 'decision',
    definition: 'A decision is a set of verifiable questions',
    rule: 'Cannot exist without question nodes',
  },
  question_node: {
    id: 'question_node',
    definition: 'A question that must be answerable statistically or marked as insufficient',
    rule: 'Must map to exactly one answer type',
  },
  answer_type: {
    id: 'answer_type',
    definition: 'Exactly one of the seven allowed answer types',
    rule: 'If a question cannot map to an answer type, it cannot be part of a decision',
  },
  assumption: {
    id: 'assumption',
    definition: 'A claim not supported by data that must be declared',
    rule: 'All assumptions must be explicit and visible',
  },
  signal: {
    id: 'signal',
    definition: 'An indicator of change (e.g., news frequency), not fact',
    rule: 'Cannot replace data, must be quantified and time-bound',
  },
} as const;

/**
 * THE 7 ALLOWED ANSWER TYPES (LOCKED)
 */
export const GDG_ANSWER_TYPES = [
  'DESCRIPTIVE_STAT',
  'TREND_CHANGE',
  'DISTRIBUTION_STRUCTURE',
  'COMPARISON_CONDITIONAL',
  'RISK_PREVALENCE',
  'CORRELATION_OVERVIEW',
  'SCENARIO_MODEL',
] as const;

export type GDGAnswerTypeStrict = typeof GDG_ANSWER_TYPES[number];

/**
 * MACHINE-READABLE CONTRACT STRUCTURE
 */
export interface GDGContract {
  gdg_version: '1.0';
  decision: GDGDecisionContract;
  scope: GDGScopeContract;
  nodes: GDGNodesContract;
  answer_constraints: GDGAnswerConstraints;
  scenario_rules: GDGScenarioRules;
  signals: GDGSignalRules;
  outputs: GDGOutputRules;
}

export interface GDGDecisionContract {
  must_include: readonly ['scope', 'nodes', 'limitations', 'confidence_summary'];
}

export interface GDGScopeContract {
  required: readonly ['geography', 'population', 'time_horizon'];
}

export interface GDGNodesContract {
  rules: readonly [
    'each_node_must_have_answer_type',
    'each_node_must_reference_answer_packet',
    'unresolved_nodes_must_be_flagged'
  ];
}

export interface GDGAnswerConstraints {
  forbidden: readonly [
    'recommendation',
    'optimization',
    'advice',
    'diagnosis',
    'individual_prediction'
  ];
}

export interface GDGScenarioRules {
  allowed_only_if: readonly [
    'explicitly_flagged',
    'assumptions_listed',
    'non_factual_language'
  ];
}

export interface GDGSignalRules {
  rules: readonly [
    'cannot_replace_data',
    'must_be_quantified',
    'must_be_time_bound'
  ];
}

export interface GDGOutputRules {
  allowed: readonly ['charts', 'tables', 'downloadable_data'];
  forbidden: readonly ['summary_recommendation'];
}

/**
 * FULL CONTRACT DEFINITION
 */
export const GDG_CONTRACT: GDGContract = {
  gdg_version: '1.0',
  
  decision: {
    must_include: ['scope', 'nodes', 'limitations', 'confidence_summary'],
  },
  
  scope: {
    required: ['geography', 'population', 'time_horizon'],
  },
  
  nodes: {
    rules: [
      'each_node_must_have_answer_type',
      'each_node_must_reference_answer_packet',
      'unresolved_nodes_must_be_flagged',
    ],
  },
  
  answer_constraints: {
    forbidden: [
      'recommendation',
      'optimization',
      'advice',
      'diagnosis',
      'individual_prediction',
    ],
  },
  
  scenario_rules: {
    allowed_only_if: [
      'explicitly_flagged',
      'assumptions_listed',
      'non_factual_language',
    ],
  },
  
  signals: {
    rules: [
      'cannot_replace_data',
      'must_be_quantified',
      'must_be_time_bound',
    ],
  },
  
  outputs: {
    allowed: ['charts', 'tables', 'downloadable_data'],
    forbidden: ['summary_recommendation'],
  },
};

/**
 * COMPLIANCE REQUIREMENTS
 */
export interface GDGComplianceRequirement {
  readonly id: string;
  readonly type: 'must_not' | 'must';
  readonly description: string;
  readonly validation: 'automated' | 'manual' | 'both';
}

export const GDG_COMPLIANCE_REQUIREMENTS: GDGComplianceRequirement[] = [
  // MUST NOT
  { id: 'no_advice', type: 'must_not', description: 'Never give advice', validation: 'automated' },
  { id: 'no_value_weighting', type: 'must_not', description: 'Never weight values', validation: 'automated' },
  { id: 'no_optimization', type: 'must_not', description: 'Never optimize goals', validation: 'automated' },
  { id: 'no_recommendation', type: 'must_not', description: 'Never provide recommendations', validation: 'automated' },
  { id: 'no_diagnosis', type: 'must_not', description: 'Never diagnose', validation: 'automated' },
  
  // MUST
  { id: 'show_uncertainty', type: 'must', description: 'Always show uncertainty', validation: 'automated' },
  { id: 'show_sources', type: 'must', description: 'Always show sources', validation: 'automated' },
  { id: 'allow_reproducibility', type: 'must', description: 'Always allow reproducibility', validation: 'both' },
  { id: 'flag_assumptions', type: 'must', description: 'Always flag assumptions', validation: 'automated' },
  { id: 'time_bound_data', type: 'must', description: 'Always time-bound data', validation: 'automated' },
];

/**
 * WHY OTHERS MUST ADAPT
 */
export const GDG_ADOPTION_DRIVERS = {
  reduces_legal_risk: 'No liability for advice not given',
  makes_ai_accountable: 'Clear boundaries for AI behavior',
  makes_decisions_auditable: 'Full traceability of decision basis',
  makes_history_traceable: 'Reproducible decision artifacts',
  works_across_domains: 'Universal grammar for all sectors',
  alternative: 'Hallucinating decisions + unclear responsibility',
} as const;

/**
 * YAML EXPORT FORMAT
 */
export const GDG_CONTRACT_YAML = `
# Global Decision Grammar v1.0 — Machine-Readable Contract

gdg_version: "1.0"

decision:
  must_include:
    - scope
    - nodes
    - limitations
    - confidence_summary

scope:
  required:
    - geography
    - population
    - time_horizon

nodes:
  rules:
    - each_node_must_have_answer_type
    - each_node_must_reference_answer_packet
    - unresolved_nodes_must_be_flagged

answer_constraints:
  forbidden:
    - recommendation
    - optimization
    - advice
    - diagnosis
    - individual_prediction

scenario_rules:
  allowed_only_if:
    - explicitly_flagged
    - assumptions_listed
    - non_factual_language

signals:
  rules:
    - cannot_replace_data
    - must_be_quantified
    - must_be_time_bound

outputs:
  allowed:
    - charts
    - tables
    - downloadable_data
  forbidden:
    - summary_recommendation

# The 7 Allowed Answer Types
answer_types:
  - DESCRIPTIVE_STAT
  - TREND_CHANGE
  - DISTRIBUTION_STRUCTURE
  - COMPARISON_CONDITIONAL
  - RISK_PREVALENCE
  - CORRELATION_OVERVIEW
  - SCENARIO_MODEL

# Rule: If a question cannot map to an answer type, it cannot be part of a decision.
`;
