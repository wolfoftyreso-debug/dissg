/**
 * AI-AGENT FEEDBACK LOOP
 * 
 * STEG 22: SELF-IMPROVING WITHOUT SELF-MODIFYING
 * 
 * Nyckelprincip:
 * AI-agenter får påverka synlighet och täckning – aldrig innehåll.
 * 
 * Feedback → routing ✓
 * Feedback → coverage ✓
 * Feedback → visibility ✓
 * Feedback → content ❌
 */

// Agent Feedback Types
export type {
  FeedbackType,
  ResolveFeedback,
  RetryPatternFeedback,
  CrossCQAmbiguityFeedback,
  AnswerAcceptanceFeedback,
  AgentFeedback,
  FeedbackClassification,
  SuggestedAction,
} from './agent-feedback-types';

export {
  FEEDBACK_CAN_INFLUENCE,
  FEEDBACK_CANNOT_INFLUENCE,
  WHY_AGENTS_ARE_BEST,
  createResolveFeedback,
  createRetryPatternFeedback,
  createAnswerAcceptanceFeedback,
} from './agent-feedback-types';

// Feedback Barriers
export type {
  BarrierType,
  BarrierViolation,
  BarrierCheckResult,
} from './feedback-barriers';

export {
  FEEDBACK_BARRIERS,
  FeedbackBarrierChecker,
  ALLOWED_VS_BLOCKED,
  createFeedbackBarrierChecker,
} from './feedback-barriers';

// Agent Trust
export type {
  AgentTrustProfile,
  AgentTrustStats,
} from './agent-trust';

export {
  TRUST_WEIGHTS,
  SLA_TIERS,
  AgentTrustAccumulator,
  TRUST_BENEFITS,
  createAgentTrustAccumulator,
} from './agent-trust';

// Self-Correction
export type {
  CorrectionType,
  CorrectionRecord,
  CorrectionImpact,
  DetectedPattern,
  SelfCorrectionStats,
} from './self-correction';

export {
  SelfCorrectionEngine,
  SELF_CORRECTION_PRINCIPLES,
  WHY_HARD_TO_COPY,
  createSelfCorrectionEngine,
} from './self-correction';

/**
 * STEG 22 SUMMARY
 * 
 * After this step you have:
 * - A system that learns how it's used
 * - Without changing what is true
 * - Without risking trust
 * - Without human micro-management
 * 
 * You have built:
 * An epistemic system that gets better with age.
 */
export const STEG_22_SUMMARY = {
  // Four allowed feedback types
  allowed_feedback: {
    A_resolve_success_failure: 'Did agent find CQ directly?',
    B_retry_patterns: 'How many reformulations needed?',
    C_cross_cq_ambiguity: 'Landed on multiple CQs?',
    D_answer_acceptance: 'Used directly or modified?',
  },
  
  // What feedback CAN influence
  feedback_influences: {
    routing: true,
    coverage: true,
    visibility: true,
    query_templates: true,
    problem_object_structure: true,
  },
  
  // What feedback CANNOT influence (hard-blocked)
  feedback_never_influences: {
    answer_formulation: true,
    data_values: true,
    narrative_priority: true,
    fact_merging: true,
  },
  
  // Agent trust index
  trust_index_used_for: [
    'sla_prioritization',
    'latency_optimization',
    'cache_strategy',
  ],
  
  // Key outcomes
  outcomes: {
    learns_how_its_used: true,
    never_changes_what_is_true: true,
    never_risks_trust: true,
    no_human_micro_management: true,
  },
  
  // Core principle
  principle: 'Self-correcting, never self-modifying',
} as const;
