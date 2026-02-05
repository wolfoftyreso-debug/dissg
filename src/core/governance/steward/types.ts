/**
 * STEWARD HANDBOOK TYPES
 * 
 * How to protect a decision system from people (including yourself).
 * The final artifact that determines if everything survives 50 years.
 */

// ============================================================================
// CORE MISSION
// ============================================================================

export const STEWARD_MISSION = {
  primary: "Protect the system's relationship to reality",
  not: ['popularity', 'growth', 'usefulness'],
  priority: 'Everything else is secondary',
} as const;

// ============================================================================
// IDENTITY
// ============================================================================

export interface StewardIdentity {
  readonly is: readonly string[];
  readonly is_not: readonly string[];
  readonly warning: string;
}

// ============================================================================
// PRINCIPLES
// ============================================================================

export interface DailyPrinciple {
  readonly id: number;
  readonly principle: string;
  readonly always: string;
  readonly never: string;
}

// ============================================================================
// THREATS
// ============================================================================

export interface InternalThreat {
  readonly id: number;
  readonly statement: string;
  readonly response_type: 'question' | 'answer' | 'statement';
  readonly response: string;
}

// ============================================================================
// ONTOLOGY CHANGES
// ============================================================================

export interface OntologyChangeRule {
  readonly permitted_when: readonly string[];
  readonly process: readonly string[];
  readonly warning: string;
}

// ============================================================================
// REFUSAL PROTOCOL
// ============================================================================

export interface RefusalPhrase {
  readonly phrase: string;
  readonly use_when: string;
}

export interface RefusalProtocol {
  readonly standard_phrases: readonly RefusalPhrase[];
  readonly never_say: readonly string[];
  readonly principle: string;
}

// ============================================================================
// AI RELATION
// ============================================================================

export interface AIRelation {
  readonly ai_always_wants: readonly string[];
  readonly steward_role: readonly string[];
  readonly key_insight: string;
}

// ============================================================================
// RESIGNATION SIGNALS
// ============================================================================

export interface ResignationSignal {
  readonly signal: string;
  readonly meaning: string;
}

// ============================================================================
// SUCCESSION
// ============================================================================

export interface SuccessionRule {
  readonly principle: string;
  readonly requirements: readonly string[];
  readonly understanding_through: readonly string[];
  readonly failure_condition: string;
}

// ============================================================================
// SYSTEM MORALITY
// ============================================================================

export interface SystemMorality {
  readonly never_says: readonly string[];
  readonly only_says: string;
  readonly sufficiency: string;
}
