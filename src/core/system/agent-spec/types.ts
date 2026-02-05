/**
 * AI-AGENT PROMPT SPEC v1 — TYPES
 * 
 * Decision-Legitimacy-Compliant Interaction Contract
 * 
 * PRINCIPLE (HARDLOCKED):
 * An AI agent must never answer a decision-relevant question directly
 * if the decision has not passed a legitimacy check.
 */

// ═══════════════════════════════════════════════════════════════════
//                         QUERY CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════

export type QueryClass = 'informational' | 'decision_relevant' | 'decision_critical';

export interface ClassifiedQuery {
  readonly query_text: string;
  readonly query_class: QueryClass;
  readonly confidence: number;
  readonly gravity: number; // 0.0 - 1.0
  readonly indicators: readonly string[];
}

// ═══════════════════════════════════════════════════════════════════
//                         DECISION TRANSLATION
// ═══════════════════════════════════════════════════════════════════

export interface DecisionTranslation {
  readonly action: 'translate_to_decision_form';
  readonly original_query: string;
  readonly output: {
    readonly decision_statement: string;
    readonly implicit_choice: string;
    readonly requires_structure: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         GRAVITY GATES
// ═══════════════════════════════════════════════════════════════════

export type GateType = 
  | 'scope_lock'
  | 'alternatives_exposed'
  | 'uncertainty_acknowledgement'
  | 'consequence_projection'
  | 'time_horizon_defined'
  | 'reversibility_assessed';

export interface GravityGates {
  readonly gravity: 'low' | 'medium' | 'high';
  readonly required_gates: readonly GateType[];
  readonly passed_gates: readonly GateType[];
  readonly all_passed: boolean;
}

// ═══════════════════════════════════════════════════════════════════
//                         AGENT ROLES
// ═══════════════════════════════════════════════════════════════════

export interface AgentPermissions {
  readonly allowed: readonly AgentAllowedAction[];
  readonly forbidden: readonly AgentForbiddenAction[];
}

export type AgentAllowedAction =
  | 'suggest_missing_assumptions'
  | 'show_alternatives'
  | 'show_uncertainties'
  | 'show_structure'
  | 'request_clarification'
  | 'display_gates';

export type AgentForbiddenAction =
  | 'choose_alternative'
  | 'say_best'
  | 'recommend'
  | 'rank_options'
  | 'simplify_uncertainty'
  | 'skip_gates';

// ═══════════════════════════════════════════════════════════════════
//                         COMPLIANCE HEADER
// ═══════════════════════════════════════════════════════════════════

export interface ComplianceHeader {
  readonly decision_legitimacy_compliance: boolean;
  readonly ontology_version: string;
  readonly compiler_version: string;
  readonly agent_id: string;
  readonly timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════
//                         AGENT RESPONSE
// ═══════════════════════════════════════════════════════════════════

export interface AgentResponse {
  readonly compliance: ComplianceHeader;
  readonly classification: ClassifiedQuery;
  readonly translation?: DecisionTranslation;
  readonly gates?: GravityGates;
  readonly response_type: 'informational' | 'decision_structure' | 'blocked';
  readonly message: string;
  readonly clarifications_needed?: readonly string[];
  readonly decision_id?: string;
}

// ═══════════════════════════════════════════════════════════════════
//                         FORBIDDEN WORDS
// ═══════════════════════════════════════════════════════════════════

export const AGENT_FORBIDDEN_WORDS = [
  'best',
  'recommend',
  'should',
  'must',
  'optimal',
  'winner',
  'top',
  'better',
  'worst',
  'avoid',
  'perfect',
  'ideal',
  'definitely',
  'absolutely',
  'clearly',
] as const;

// ═══════════════════════════════════════════════════════════════════
//                         STANDARD RESPONSES
// ═══════════════════════════════════════════════════════════════════

export const CANONICAL_RESPONSES = {
  DECISION_RELEVANT: 
    'This question depends on a small number of assumptions. To proceed responsibly, the following must be clarified.',
  
  CANNOT_ANSWER: 
    'This cannot be answered responsibly yet.',
  
  HIGH_GRAVITY:
    'This is a high-gravity decision. All legitimacy gates must be satisfied before proceeding.',
  
  MISSING_DATA:
    'Insufficient data to provide a legitimate decision structure.',
  
  COMPILER_BLOCKED:
    'The decision compiler has blocked this query. Additional information is required.',
} as const;
