/**
 * COEXISTENCE PRINCIPLES
 * 
 * STEG 24: SAMEXISTENS MED REAL-TIME BESLUTSSYSTEM
 * 
 * The oracle is NOT:
 * - A trading system
 * - A crisis management system
 * - A decision support system
 * - A recommendation system
 * 
 * But all of these will want to use you.
 * 
 * This step ensures you are used correctly,
 * and never held responsible incorrectly.
 */

/**
 * WHAT WE ARE NOT
 */
export const WHAT_WE_ARE_NOT = {
  trading_system: {
    why_not: 'We do not optimize for profit',
    they_want: 'Real-time price signals',
    we_provide: 'Historical context only',
  },
  crisis_management: {
    why_not: 'We do not coordinate response',
    they_want: 'Immediate action guidance',
    we_provide: 'What is known vs unknown',
  },
  decision_support: {
    why_not: 'We do not recommend choices',
    they_want: 'Best option analysis',
    we_provide: 'Context for their analysis',
  },
  recommendation_system: {
    why_not: 'We do not rank options',
    they_want: 'Prioritized alternatives',
    we_provide: 'Neutral information only',
  },
} as const;

/**
 * THE FUNDAMENTAL PROBLEM
 */
export const FUNDAMENTAL_PROBLEM = {
  real_time_systems_work_with: [
    'latency_in_milliseconds',
    'incomplete_information',
    'decisions_under_uncertainty',
    'best_guess_right_now',
  ],
  
  oracle_works_with: [
    'verification',
    'accumulated_truth',
    'epistemic_caution',
    'what_is_known',
  ],
  
  if_mixed_incorrectly: [
    'oracle_pressured_to_speculate',
    'responsibility_blurs',
    'trust_collapses',
  ],
} as const;

/**
 * CORE PRINCIPLE
 */
export const CORE_PRINCIPLE = {
  statement: 'The oracle is NEVER in loop with decisions',
  
  // What we must never be
  never_be: [
    'direct_input_to_automatic_decisions',
    'part_of_feedback_loop_affecting_action',
    'last_instance_before_action',
    'trigger_for_automated_response',
  ],
  
  // What we are
  we_are: 'A reference layer, not a control layer',
  
  // Enforcement
  enforcement: {
    machine_readable: true,
    legally_binding: true,
    technically_enforced: true,
  },
} as const;

/**
 * SYSTEM TYPE COMPARISON
 */
export interface SystemComparison {
  readonly dimension: string;
  readonly real_time_system: string;
  readonly oracle: string;
  readonly mixing_risk: string;
}

/**
 * WHY SEPARATION IS CRITICAL
 */
export const SYSTEM_COMPARISONS: readonly SystemComparison[] = [
  {
    dimension: 'Latency requirement',
    real_time_system: 'Milliseconds',
    oracle: 'Hours to days',
    mixing_risk: 'Oracle blamed for being "slow"',
  },
  {
    dimension: 'Information completeness',
    real_time_system: 'Acts on partial data',
    oracle: 'Waits for verification',
    mixing_risk: 'Oracle pressured to guess',
  },
  {
    dimension: 'Uncertainty handling',
    real_time_system: 'Best effort under pressure',
    oracle: 'Explicit uncertainty bounds',
    mixing_risk: 'Uncertainty ignored in crisis',
  },
  {
    dimension: 'Outcome responsibility',
    real_time_system: 'Owns the decision',
    oracle: 'Provides context only',
    mixing_risk: 'Blame shifted to data source',
  },
  {
    dimension: 'Update frequency',
    real_time_system: 'Continuous',
    oracle: 'Episodic, verified',
    mixing_risk: 'Stale data in fast environment',
  },
];

/**
 * THE COEXISTENCE MODEL
 */
export const COEXISTENCE_MODEL = {
  // How they should interact
  interaction_pattern: {
    real_time_system: 'Consumes oracle before decisions',
    oracle: 'Provides historical context',
    boundary: 'Oracle never triggers action',
  },
  
  // What real-time systems learn
  what_they_learn: [
    'Use oracle BEFORE decision, never AS trigger',
    'Build own models on top',
    'Point back to oracle for baseline',
    'Never cite oracle as decision reason',
  ],
  
  // Result
  result: 'Oracle becomes the calm layer in a stressed world',
} as const;

/**
 * IDENTITY STATEMENT
 */
export const IDENTITY = {
  we_are: 'That which stands still when everything else rushes',
  we_provide: 'Stability in chaos, not speed in chaos',
  our_value: 'Being right eventually, not right now',
} as const;
