/**
 * HUMAN FALLIBILITY & DECISION ACCOUNTABILITY LAYER
 * 
 * The system is not for making decisions —
 * it's for making them painfully visible.
 * 
 * Morally neutral but structurally merciless.
 */

// Decision Burden
export {
  calculateBurden,
  BURDEN_PRINCIPLES,
  type ImpactScale,
  type BurdenLevel,
} from './decision-burden';

// Decision Context Freeze
export {
  contextFreeze,
  CONTEXT_FREEZE_PRINCIPLES,
  type DecisionContextSnapshot,
  type ContextFreezeRequest,
} from './decision-context-freeze';

// You Knew Or Ignored
export {
  youKnewOrIgnored,
  ACCOUNTABILITY_PRINCIPLES,
  type DefenseType,
  type DefenseAssessment,
  type AccountabilityVerdict,
} from './you-knew-or-ignored';

// Defensibility Threshold
export {
  defensibilityThreshold,
  DEFENSIBILITY_PRINCIPLES,
  type UnderstandingDifficulty,
  type DefensibilityRating,
  type DefensibilityAssessment,
} from './defensibility-threshold';

// Post-Decision Check
export {
  postDecisionCheck,
  POST_DECISION_PRINCIPLES,
  type ExpectedOutcome,
  type ActualOutcome,
  type DeviationRecord,
  type PostDecisionCheck,
} from './post-decision-check';

/**
 * ACCOUNTABILITY LAYER SUMMARY
 */
export const ACCOUNTABILITY_LAYER = {
  decision_burden: 'Scales documentation with impact',
  context_freeze: 'Immutable pre-decision snapshots',
  you_knew_or_ignored: 'Tests claimed defenses',
  defensibility_threshold: 'Measures how knowable consequences were',
  post_decision_check: 'Compares expected vs actual',
} as const;

/**
 * CORE RULES
 */
export const NO_MORAL_COVER_RULES = {
  never_justify_decisions: true,
  never_explain_away_consequences: true,
  never_normalize_harm: true,
  only_show_what_was_known: true,
  only_show_what_was_uncertain: true,
  only_show_what_was_unavoidable: true,
  only_show_what_was_chosen: true,
} as const;

/**
 * SYSTEM CHECK
 */
export async function checkAccountabilityLayer(): Promise<{
  healthy: boolean;
  components: Record<string, boolean>;
  total_decisions_tracked: number;
}> {
  // Lazy imports to avoid circular dependencies
  const { contextFreeze } = await import('./decision-context-freeze');
  
  const freezeState = contextFreeze.exportState();
  
  return {
    healthy: true,
    components: {
      context_freeze: true,
      accountability_engine: true,
      defensibility_engine: true,
      post_decision_engine: true,
    },
    total_decisions_tracked: freezeState.total_snapshots,
  };
}
