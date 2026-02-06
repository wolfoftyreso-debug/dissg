/**
 * THE ORACLE AS PROCESS, NOT PROJECT
 * 
 * STEG 32: OPERATIONAL ORACLE
 * 
 * The step after the end.
 * Not design, but operational form.
 * 
 * How all of this exists day by day – 
 * without degenerating, drifting, or losing form.
 */

/**
 * WHAT THE ORACLE NEVER HAS
 */
export const ORACLE_NEVER_HAS = {
  roadmap: {
    forbidden: true,
    reason: 'Roadmaps imply future states different from present',
    danger: 'Creates expectation and pressure for change',
  },
  
  vision_deck: {
    forbidden: true,
    reason: 'Vision implies aspiration beyond current state',
    danger: 'Enables "returning to vision" arguments for change',
  },
  
  innovation_agenda: {
    forbidden: true,
    reason: 'Innovation implies improvement, improvement implies change',
    danger: 'Creates mandate for modification',
  },
  
  quarterly_goals: {
    forbidden: true,
    reason: 'Goals imply achievement, achievement implies action',
    danger: 'Creates pressure to "do something"',
  },
  
  okrs: {
    forbidden: true,
    reason: 'Key results imply measurable change',
    danger: 'Incentivizes activity over stability',
  },
  
  growth_targets: {
    forbidden: true,
    reason: 'Growth implies expansion beyond current scope',
    danger: 'Pressures toward scope creep',
  },
} as const;

/**
 * WHAT THE ORACLE ONLY HAS
 */
export const ORACLE_ONLY_HAS = {
  routines: {
    what: 'Fixed, repeating procedures',
    nature: 'Same actions, same sequence, same schedule',
    purpose: 'Maintain without change',
  },
  
  controls: {
    what: 'Automated verification systems',
    nature: 'Check that nothing has changed',
    purpose: 'Detect any deviation',
  },
  
  revision: {
    what: 'Periodic review of unchanged state',
    nature: 'Confirm continued integrity',
    purpose: 'Assure nothing needs to change',
  },
  
  waiting: {
    what: 'Active inaction',
    nature: 'Readiness without activity',
    purpose: 'Respond only when necessary',
  },
} as const;

/**
 * THE TEMPORAL ORIENTATION
 */
export const TEMPORAL_ORIENTATION = {
  exists_in: {
    now: 'Current state of verifiable reality',
    history: 'Accumulated record of past states',
  },
  
  never_exists_in: {
    future_promises: 'What the oracle will become',
    future_features: 'What the oracle will do',
    future_improvements: 'How the oracle will be better',
  },
  
  principle: 'The oracle exists in now + history, never in future promises',
  
  danger_of_future: {
    statement: 'Everything that smells like "forward" is dangerous',
    reason: 'Forward implies change; change implies risk',
    response: 'Redirect all forward-looking energy to coverage expansion',
  },
} as const;

/**
 * PROJECT VS PROCESS DISTINCTION
 */
export const PROJECT_VS_PROCESS = {
  project: {
    nature: 'Has beginning, middle, end',
    goal: 'Achieve something that doesn\'t exist yet',
    success: 'Completion, delivery, launch',
    danger_to_oracle: 'Creates pressure to "finish" or "improve"',
  },
  
  process: {
    nature: 'Continuous, no end point',
    goal: 'Maintain what already exists',
    success: 'Unchanged state over time',
    fit_for_oracle: 'Aligns with preservation mission',
  },
  
  oracle_is: 'Process, never project',
  
  implication: 'There is no "done" or "next phase"; there is only continued existence',
} as const;

/**
 * THE ANTI-AMBITION CULTURE
 */
export const ANTI_AMBITION_CULTURE = {
  valued: [
    'Consistency',
    'Predictability', 
    'Reliability',
    'Patience',
    'Restraint',
  ],
  
  not_valued: [
    'Innovation',
    'Creativity',
    'Disruption',
    'Leadership',
    'Vision',
  ],
  
  organizational_identity: 'We maintain; we do not create',
  
  recruitment_implication: 'Attract preservers, repel changers',
} as const;
