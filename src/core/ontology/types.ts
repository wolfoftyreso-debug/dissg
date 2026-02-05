/**
 * ONTOLOGY v1.0 — DECISION LEGITIMACY CORE
 * 
 * Machine-readable, time-resistant, non-negotiable.
 * This is the truth structure that implementation must follow.
 * 
 * EXACTLY SEVEN ROOT OBJECTS. No more may be introduced in core.
 */

// ═══════════════════════════════════════════════════════════════════
//                         PRIMITIVES
// ═══════════════════════════════════════════════════════════════════

/**
 * Scope Primitive
 */
export interface Scope {
  population_size: PopulationSize;
  reversibility: Reversibility;
}

export type PopulationSize = 
  | 'individual'      // 1 person
  | 'household'       // 2-10
  | 'organization'    // 10-1000
  | 'community'       // 1000-100000
  | 'regional'        // 100000-10M
  | 'national'        // 10M-1B
  | 'global';         // 1B+

export type Reversibility = 'low' | 'medium' | 'high';

/**
 * TimeRange Primitive
 */
export interface TimeRange {
  start: string;        // ISO timestamp
  end: string | null;   // null = ongoing/indefinite
}

/**
 * Structured Text (not free text)
 */
export interface StructuredText {
  content: string;
  language: string;
  format: 'plain' | 'markdown';
  max_length?: number;
}

/**
 * Assumption (explicit, never conclusion)
 */
export interface Assumption {
  assumption_id: string;
  statement: StructuredText;
  is_testable: boolean;
  source?: string;
}

/**
 * Trade-Off (explicit cost/benefit without ranking)
 */
export interface TradeOff {
  trade_off_id: string;
  description: StructuredText;
  affected_dimension: string;
  direction: 'positive' | 'negative' | 'uncertain';
}

/**
 * Learning (from Review, never retroactive)
 */
export interface Learning {
  learning_id: string;
  observation: StructuredText;
  recorded_at: string;
  applies_forward_only: true; // MUST be true
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 1: DECISION
// ═══════════════════════════════════════════════════════════════════

export type DecisionType = 
  | 'personal'
  | 'organizational'
  | 'policy'
  | 'investment'
  | 'resource_allocation';

export type LegitimacyStatus = 
  | 'legitimate'
  | 'illegitimate'
  | 'incomplete';

export interface Decision {
  decision_id: string;
  decision_type: DecisionType;
  gravity_score: number;          // 0.0–1.0
  scope: Scope;
  time_horizon: TimeRange;
  context_snapshot_id: string;
  alternatives: Alternative[];    // MUST be >= 2
  uncertainties: Uncertainty[];   // MUST be >= 1
  legitimacy_status: LegitimacyStatus;
  created_at: string;
  locked_at: string | null;       // When set, object becomes immutable
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 2: CONTEXT
// ═══════════════════════════════════════════════════════════════════

export type AffectedPopulation = 
  | 'self'
  | 'family'
  | 'team'
  | 'organization'
  | 'community'
  | 'region'
  | 'nation'
  | 'global';

export type GeographicScope = 
  | 'local'
  | 'regional'
  | 'national'
  | 'continental'
  | 'global';

export interface Context {
  context_id: string;
  description: StructuredText;
  affected_population: AffectedPopulation;
  geographic_scope: GeographicScope;
  decision_motivation: StructuredText;
  assumptions: Assumption[];
  // RULE: Context may NEVER be edited after locked_at
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 3: ALTERNATIVE
// ═══════════════════════════════════════════════════════════════════

export interface Alternative {
  alternative_id: string;
  label: string;
  description: StructuredText;
  trade_offs: TradeOff[];
  required_assumptions: Assumption[];
  // RULES:
  // - All alternatives treated symmetrically
  // - No alternative may be "default"
  // - Alternatives may NOT be ranked
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 4: UNCERTAINTY (CRITICAL)
// ═══════════════════════════════════════════════════════════════════

export type UncertaintyType = 
  | 'unknown_data'
  | 'future_variability'
  | 'model_limit'
  | 'external_dependency';

export type ImpactRange = 'low' | 'medium' | 'high';

export interface Uncertainty {
  uncertainty_id: string;
  description: StructuredText;
  uncertainty_type: UncertaintyType;
  impact_range: ImpactRange;
  // RULES:
  // - Uncertainty may NEVER be reduced to a risk score
  // - Empty uncertainty = illegitimate decision
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 5: EVIDENCE
// ═══════════════════════════════════════════════════════════════════

export type SourceType = 
  | 'public_data'
  | 'private_data'
  | 'expert_assessment'
  | 'historical_record';

export interface Evidence {
  evidence_id: string;
  source_type: SourceType;
  reference: string;              // URI or hash
  validity_period: TimeRange;
  // RULES:
  // - Evidence supports, never decides
  // - Evidence can become outdated, history preserved
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 6: OUTCOME (SEPARATED INTENTIONALLY)
// ═══════════════════════════════════════════════════════════════════

export type DeviationType = 'within_range' | 'outside_range';

export interface Outcome {
  outcome_id: string;
  decision_id: string;
  observed_effects: StructuredText;
  deviation_from_expectation: DeviationType;
  recorded_at: string;
  // RULES:
  // - Outcome NEVER affects legitimacy
  // - Outcome may NOT change Context or Decision
}

// ═══════════════════════════════════════════════════════════════════
//                    ROOT OBJECT 7: REVIEW (POST-DECISION REALITY CHECK)
// ═══════════════════════════════════════════════════════════════════

export interface StructuredComparison {
  expected: StructuredText;
  observed: StructuredText;
  delta_description: StructuredText;
}

export interface Review {
  review_id: string;
  decision_id: string;
  expected_vs_observed: StructuredComparison;
  learnings: Learning[];
  foreseeable_deviation: boolean;
  reviewed_at: string;
  // RULES:
  // - Review is additive, NEVER corrective
  // - Learnings may NOT be written backward in time
}

// ═══════════════════════════════════════════════════════════════════
//                    LEGITIMACY ENGINE
// ═══════════════════════════════════════════════════════════════════

export interface LegitimacyCheck {
  context_present: boolean;
  alternatives_exposed: boolean;      // >= 2
  uncertainties_acknowledged: boolean; // >= 1
  scope_defined: boolean;
  time_defined: boolean;
}

// legitimate = all(true)
// No other logic allowed.

// ═══════════════════════════════════════════════════════════════════
//                    FORBIDDEN CONCEPTS
// ═══════════════════════════════════════════════════════════════════

/**
 * These concepts may NEVER exist in the ontology.
 * If they appear → system violation.
 */
export type ForbiddenConcept =
  | 'recommendation'
  | 'score_ranking'
  | 'best_option'
  | 'confidence_score'      // for decisions
  | 'optimization_target';
