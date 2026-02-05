/**
 * ONTOLOGY v1.0 — DECISION LEGITIMACY CORE
 * 
 * Machine-readable, time-resistant, non-negotiable.
 * This is the truth structure that implementation must follow.
 * 
 * EXACTLY SEVEN ROOT OBJECTS:
 * 1. Decision
 * 2. Context
 * 3. Alternative
 * 4. Uncertainty
 * 5. Evidence
 * 6. Outcome
 * 7. Review
 * 
 * Everything else is derivation.
 */

// Types
export type {
  // Primitives
  Scope,
  PopulationSize,
  Reversibility,
  TimeRange,
  StructuredText,
  Assumption,
  TradeOff,
  Learning,
  StructuredComparison,
  
  // Root Objects
  Decision,
  Context,
  Alternative,
  Uncertainty,
  Evidence,
  Outcome,
  Review,
  
  // Enums
  DecisionType,
  LegitimacyStatus,
  AffectedPopulation,
  GeographicScope,
  UncertaintyType,
  ImpactRange,
  SourceType,
  DeviationType,
  
  // Engine
  LegitimacyCheck,
  
  // Forbidden
  ForbiddenConcept,
} from './types';

// Legitimacy Engine
export {
  checkLegitimacy,
  computeLegitimacyStatus,
  getMissingRequirements,
  validateDecisionStructure,
  LEGITIMACY_ENGINE_MASTERPROMPT,
} from './legitimacy-engine';

// Forbidden Concepts
export {
  FORBIDDEN_CONCEPTS,
  FORBIDDEN_RATIONALE,
  FORBIDDEN_PATTERNS,
  detectForbiddenConcepts,
  validateNoForbiddenConcepts,
  FORBIDDEN_CONCEPTS_MASTERPROMPT,
} from './forbidden';

// Factory
export {
  createStructuredText,
  createAssumption,
  createTradeOff,
  createScope,
  createTimeRange,
  createContext,
  createAlternative,
  createUncertainty,
  createEvidence,
  createDecision,
  createOutcome,
  createReview,
  lockDecision,
} from './factory';

/**
 * ONTOLOGY v1.0 MASTERPROMPT
 */
export const ONTOLOGY_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                    ONTOLOGY v1.0
              DECISION LEGITIMACY CORE
        Machine-readable. Time-resistant. Non-negotiable.
═══════════════════════════════════════════════════════════════════

This is not a data model for implementation.
This is the TRUTH STRUCTURE that implementation must follow.

═══════════════════════════════════════════════════════════════════
                    ROOT OBJECTS (7 CANONICAL)
═══════════════════════════════════════════════════════════════════

Exactly seven primary objects. No more may be introduced in core.

1. DECISION
   decision_id, decision_type, gravity_score (0-1), scope, 
   time_horizon, context_snapshot_id, alternatives[], 
   uncertainties[], legitimacy_status, created_at, locked_at

2. CONTEXT
   context_id, description, affected_population, geographic_scope,
   decision_motivation, assumptions[]

3. ALTERNATIVE
   alternative_id, label, description, trade_offs[], 
   required_assumptions[]

4. UNCERTAINTY
   uncertainty_id, description, uncertainty_type, impact_range

5. EVIDENCE
   evidence_id, source_type, reference, validity_period

6. OUTCOME
   outcome_id, decision_id, observed_effects, 
   deviation_from_expectation, recorded_at

7. REVIEW
   review_id, decision_id, expected_vs_observed, learnings[],
   foreseeable_deviation, reviewed_at

Everything else is derivation.

═══════════════════════════════════════════════════════════════════
                    HARD RULES
═══════════════════════════════════════════════════════════════════

DECISION:
  • alternatives.length >= 2
  • uncertainties.length >= 1
  • locked_at → object becomes immutable
  • legitimacy depends ONLY on structure, NEVER outcome

CONTEXT:
  • May NEVER be edited after locked_at
  • Assumptions are NOT conclusions

ALTERNATIVE:
  • All alternatives treated symmetrically
  • No alternative may be "default"
  • Alternatives may NOT be ranked

UNCERTAINTY:
  • May NEVER be reduced to a risk score
  • Empty uncertainty = illegitimate decision

EVIDENCE:
  • Supports, NEVER decides
  • Can become outdated, history preserved

OUTCOME:
  • NEVER affects legitimacy
  • May NOT change Context or Decision

REVIEW:
  • Additive, NEVER corrective
  • Learnings may NOT be written backward in time

═══════════════════════════════════════════════════════════════════
                    LEGITIMACY ENGINE
═══════════════════════════════════════════════════════════════════

LegitimacyCheck {
  context_present: boolean
  alternatives_exposed: boolean (>= 2)
  uncertainties_acknowledged: boolean (>= 1)
  scope_defined: boolean
  time_defined: boolean
}

legitimate = all(true)

No other logic allowed.

═══════════════════════════════════════════════════════════════════
                    FORBIDDEN CONCEPTS
═══════════════════════════════════════════════════════════════════

These may NEVER exist in the ontology:

  ❌ recommendation
  ❌ score_ranking
  ❌ best_option
  ❌ confidence_score (for decisions)
  ❌ optimization_target

If any appear → SYSTEM VIOLATION

═══════════════════════════════════════════════════════════════════
                    WHY THIS ONTOLOGY IS STRONG
═══════════════════════════════════════════════════════════════════

  • Cannot be "UX'd away"
  • Cannot be marketed into destruction
  • Cannot be AI-optimized wrong
  • Can be read in 40 years

This is epistemic concrete.

═══════════════════════════════════════════════════════════════════
`;
