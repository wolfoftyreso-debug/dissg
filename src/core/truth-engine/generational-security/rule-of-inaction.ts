/**
 * RULE OF INACTION (THE MOST IMPORTANT RULE)
 * 
 * STEG 30: IF NOTHING IS BROKEN → DO NOTHING
 * 
 * This is codified as:
 * If nothing is broken → do nothing.
 * 
 * Every change must be technically motivated, reversible,
 * and not affect epistemics.
 * 
 * "Improvement" is never a valid reason.
 */

/**
 * THE RULE
 */
export const RULE_OF_INACTION = {
  statement: 'If nothing is broken → do nothing',
  
  corollary_1: 'Working systems should not be changed',
  corollary_2: 'Stability is more valuable than improvement',
  corollary_3: 'The burden of proof is always on change',
  
  enforcement: 'Constitutional principle in foundation charter',
} as const;

/**
 * REQUIREMENTS FOR ANY CHANGE
 */
export const CHANGE_REQUIREMENTS = {
  technical_motivation: {
    requirement: 'Change must solve a specific technical problem',
    not_acceptable: ['User requests', 'Market demands', 'Competitive pressure', 'Modernization'],
    evidence_needed: 'Documented failure or risk',
  },
  
  reversibility: {
    requirement: 'Change must be fully reversible',
    mechanism: 'Must be able to undo within 24 hours',
    evidence_needed: 'Documented rollback procedure',
  },
  
  epistemic_neutrality: {
    requirement: 'Change must not affect epistemics',
    definition: 'No change to what data means or how it is interpreted',
    evidence_needed: 'Impact assessment showing zero epistemic effect',
  },
  
  all_three_required: true,
  any_missing: 'Change is rejected',
} as const;

/**
 * WHAT IS NOT A VALID REASON
 */
export const INVALID_REASONS = {
  improvement: {
    claim: '"This would improve the system"',
    why_invalid: 'Improvement implies change is good; we do not assume that',
    response: 'Show specific failure being addressed',
  },
  
  modernization: {
    claim: '"We need to modernize"',
    why_invalid: 'New is not better; old working systems have proven track record',
    response: 'Show specific technical failure of current system',
  },
  
  user_demand: {
    claim: '"Users want this"',
    why_invalid: 'User wants are not system requirements',
    response: 'Build it in external layer, not core',
  },
  
  best_practice: {
    claim: '"This is industry best practice"',
    why_invalid: 'Industry practices change; our core does not',
    response: 'Apply best practice in operations, not core',
  },
  
  efficiency: {
    claim: '"This would be more efficient"',
    why_invalid: 'Efficiency gains often trade away robustness',
    response: 'Current inefficiency is acceptable if system works',
  },
  
  simplification: {
    claim: '"This would simplify things"',
    why_invalid: 'Simplification often loses important nuance',
    response: 'Current complexity exists for reasons that may be forgotten',
  },
} as const;

/**
 * THE CHANGE PROCESS
 */
export const CHANGE_PROCESS = {
  step_1_proposal: {
    action: 'Submit detailed change proposal',
    includes: ['Problem statement', 'Proposed solution', 'Rollback plan', 'Impact assessment'],
    who: 'Anyone can propose',
  },
  
  step_2_technical_review: {
    action: 'Technical team reviews for necessity',
    question: 'Is this solving a real technical problem?',
    outcome: 'Most proposals rejected here',
  },
  
  step_3_reversibility_review: {
    action: 'Verify rollback is possible',
    question: 'Can we undo this within 24 hours?',
    outcome: 'Many remaining proposals rejected here',
  },
  
  step_4_epistemic_review: {
    action: 'Verify no epistemic impact',
    question: 'Does this change what data means?',
    outcome: 'Strict filter; any uncertainty = rejection',
  },
  
  step_5_steward_approval: {
    action: 'Stewards review and approve/reject',
    default: 'Reject unless compelling case',
    outcome: 'Very few changes approved',
  },
  
  step_6_waiting_period: {
    action: '30-day waiting period after approval',
    purpose: 'Allow reconsideration, detect late objections',
    outcome: 'Some approved changes are reconsidered',
  },
  
  step_7_implementation: {
    action: 'Implement with full logging',
    requirement: 'Every step recorded for future reference',
    outcome: 'Change is implemented',
  },
  
  step_8_monitoring: {
    action: '90-day monitoring period',
    purpose: 'Detect any unexpected effects',
    outcome: 'Rollback if problems detected',
  },
} as const;

/**
 * SUCCESS METRIC
 */
export const INACTION_SUCCESS = {
  good_year: 'Zero changes to core',
  acceptable_year: '1-2 essential changes',
  concerning_year: '3+ changes',
  failure: 'Any non-reversible change',
  
  cultural_goal: 'Stewards compete to do nothing',
} as const;
