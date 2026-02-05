/**
 * GLOBAL DECISION GRAMMAR (GDG) v1.0
 * 
 * PUBLIC STANDARD — OPEN, READABLE, STRICT
 * 
 * This is the formal language for:
 * - How decisions break down into questions
 * - What answer types are allowed
 * - How uncertainty is expressed
 * - What is NEVER permitted (advice, diagnosis, optimization)
 * 
 * AI models, governments, and companies can say:
 * "We follow GDG."
 * 
 * And they must, in practice, use this engine.
 */

/**
 * GDG VERSION
 */
export const GDG_VERSION = {
  version: '1.0.0',
  status: 'stable',
  published: '2025-01-01',
  breaking_changes_locked: true,
  governance: 'Truth Engine Stewards',
} as const;

/**
 * CORE AXIOMS (IMMUTABLE)
 */
export const GDG_AXIOMS = {
  axiom_1: {
    id: 'observation_primacy',
    statement: 'All claims must derive from observed, verifiable data',
    rationale: 'Truth is grounded in measurement, not assertion',
  },
  axiom_2: {
    id: 'question_decomposition',
    statement: 'A decision must decompose into a set of verifiable questions',
    rationale: 'Complex decisions become tractable through structured inquiry',
  },
  axiom_3: {
    id: 'answer_constraints',
    statement: 'Each question must be answered with population-based statistics, clear time specification, source, and uncertainty',
    rationale: 'Answers without context are dangerous',
  },
  axiom_4: {
    id: 'forbidden_territory',
    statement: 'The system must NEVER provide recommendations, optimization, or value weighting',
    rationale: 'Responsibility for decisions lies with the human, not the system',
  },
  axiom_5: {
    id: 'uncertainty_first_class',
    statement: 'Uncertainty is a first-class output, not an afterthought',
    rationale: 'Overconfidence kills; explicit uncertainty protects',
  },
  axiom_6: {
    id: 'reproducibility_mandate',
    statement: 'Any output must be reproducible given the same inputs and timestamp',
    rationale: 'Trust requires verifiability',
  },
} as const;

/**
 * DECISION STRUCTURE (MACHINE-READABLE)
 */
export interface GDGDecision {
  /** Unique identifier */
  decision_id: string;
  
  /** Version of this decision artifact */
  version: number;
  
  /** Decision type from registry */
  type_id: string;
  
  /** Context parameters */
  context: Record<string, string>;
  
  /** Question nodes (required) */
  question_nodes: GDGQuestionNode[];
  
  /** Overall confidence (required) */
  confidence: GDGConfidence;
  
  /** Limitations (required) */
  limitations: GDGLimitation[];
  
  /** Assumptions (required) */
  assumptions: GDGAssumption[];
  
  /** Data sources (required) */
  sources: GDGSource[];
  
  /** Timestamp (required) */
  resolved_at: string;
  
  /** Expiry (required) */
  valid_until: string;
  
  /** Governance (required) */
  governance: GDGGovernance;
}

export interface GDGQuestionNode {
  node_id: string;
  question: string;
  answer_type: GDGAnswerType;
  answer: GDGAnswer | null;
  status: 'resolved' | 'unresolved' | 'insufficient_data';
  confidence: number;
  data_coverage: number;
  dependencies: string[];
}

export type GDGAnswerType = 
  | 'DESCRIPTIVE_STAT'
  | 'TREND_CHANGE'
  | 'DISTRIBUTION_STRUCTURE'
  | 'COMPARISON_CONDITIONAL'
  | 'CORRELATION_OVERVIEW'
  | 'RISK_PREVALENCE'
  | 'SCENARIO_MODEL'
  | 'THRESHOLD_PROXIMITY';

export interface GDGAnswer {
  summary: string;
  data_points: number;
  time_range: { start: string; end: string };
  methodology: string;
  limitations: string[];
  visualization_spec?: unknown;
}

export interface GDGConfidence {
  overall: number;
  completeness: number;
  methodology: 'bayesian' | 'frequentist' | 'coverage_based';
  factors: { factor: string; impact: number }[];
}

export interface GDGLimitation {
  limitation_id: string;
  type: 'data_gap' | 'methodology' | 'coverage' | 'temporal' | 'definition';
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  affected_nodes: string[];
}

export interface GDGAssumption {
  assumption_id: string;
  description: string;
  required: boolean;
  default_value?: string;
  alternatives?: string[];
}

export interface GDGSource {
  source_id: string;
  name: string;
  type: 'official_statistics' | 'registry' | 'survey' | 'administrative' | 'derived';
  reliability_score: number;
  last_updated: string;
  url?: string;
}

export interface GDGGovernance {
  no_recommendation: true;
  no_optimization: true;
  no_value_judgment: true;
  read_only: true;
  audit_trail: true;
  gdg_version: string;
}

/**
 * FORBIDDEN OPERATIONS (HARD-BLOCKED)
 */
export const GDG_FORBIDDEN = {
  // Never output these
  forbidden_outputs: [
    'recommendation',
    'advice',
    'suggestion',
    'optimal_choice',
    'best_option',
    'should_do',
    'must_do',
    'diagnosis',
    'prediction',
    'forecast',
  ],
  
  // Never perform these operations
  forbidden_operations: [
    'optimize',
    'rank_by_preference',
    'weight_by_value',
    'suggest_action',
    'prescribe_treatment',
    'financial_advice',
    'legal_advice',
    'medical_diagnosis',
  ],
  
  // Never claim these
  forbidden_claims: [
    'certainty',
    'guaranteed',
    'will_happen',
    'best',
    'worst',
    'right',
    'wrong',
  ],
} as const;

/**
 * REQUIRED OUTPUTS (ALWAYS PRESENT)
 */
export const GDG_REQUIRED = {
  every_decision_must_have: [
    'question_nodes',
    'answer_types',
    'confidence',
    'limitations',
    'assumptions',
    'sources',
    'governance',
  ],
  
  every_answer_must_have: [
    'summary',
    'time_range',
    'data_points',
    'methodology',
    'limitations',
  ],
  
  every_output_must_have: [
    'resolved_at',
    'valid_until',
    'reproducibility_hash',
  ],
} as const;

/**
 * VALIDATION SCHEMA (JSON SCHEMA FORMAT)
 */
export const GDG_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://truthengine.dev/schemas/gdg/v1.0/decision.json',
  title: 'GDG Decision',
  type: 'object',
  required: [
    'decision_id',
    'version',
    'type_id',
    'question_nodes',
    'confidence',
    'limitations',
    'assumptions',
    'sources',
    'resolved_at',
    'valid_until',
    'governance',
  ],
  properties: {
    decision_id: { type: 'string', format: 'uuid' },
    version: { type: 'integer', minimum: 1 },
    type_id: { type: 'string' },
    context: { type: 'object' },
    question_nodes: { type: 'array', minItems: 1 },
    confidence: { type: 'object' },
    limitations: { type: 'array' },
    assumptions: { type: 'array' },
    sources: { type: 'array', minItems: 1 },
    resolved_at: { type: 'string', format: 'date-time' },
    valid_until: { type: 'string', format: 'date-time' },
    governance: {
      type: 'object',
      required: ['no_recommendation', 'no_optimization', 'no_value_judgment'],
      properties: {
        no_recommendation: { const: true },
        no_optimization: { const: true },
        no_value_judgment: { const: true },
      },
    },
  },
} as const;

/**
 * HUMAN-READABLE SUMMARY
 */
export const GDG_HUMAN_READABLE = `
GLOBAL DECISION GRAMMAR (GDG) v1.0
===================================

A decision shall consist of a set of verifiable questions.
Each question shall be answered with population-based statistics,
clear time specification, source, and uncertainty.

REQUIREMENTS:
- Every decision decomposes into question nodes
- Every answer includes confidence and limitations
- Every output is reproducible and timestamped

PROHIBITIONS:
- No recommendations or advice
- No optimization or ranking by preference
- No value judgments or normative claims
- No predictions presented as facts

GOVERNANCE:
- All outputs are read-only
- All changes are logged
- All methodology is public

This is how correct decisions are structured.
Responsibility lies with the human, not the system.
`;

/**
 * MACHINE-READABLE YAML FORMAT
 */
export const GDG_YAML_SPEC = `
# Global Decision Grammar v1.0
gdg_version: "1.0.0"

decision:
  must_have:
    - question_nodes
    - answer_types
    - confidence
    - limitations
    - assumptions
    - sources
    - governance
  
  forbidden:
    - recommendation
    - optimization
    - value_weighting
    - diagnosis
    - prediction

question_node:
  required:
    - question_text
    - answer_type
    - confidence
    - data_coverage
  
  answer_types:
    - DESCRIPTIVE_STAT
    - TREND_CHANGE
    - DISTRIBUTION_STRUCTURE
    - COMPARISON_CONDITIONAL
    - CORRELATION_OVERVIEW
    - RISK_PREVALENCE
    - SCENARIO_MODEL
    - THRESHOLD_PROXIMITY

governance:
  principles:
    - no_recommendation: true
    - no_optimization: true
    - no_value_judgment: true
    - read_only: true
    - audit_trail: true
  
  enforcement:
    - automated_validation
    - public_methodology
    - external_verification
`;
