/**
 * AUTOMATED RESISTANCE
 * 
 * STEG 30: SYSTEMS THAT CREATE FRICTION
 * 
 * You build in systems that:
 * - Flag deviations from schema
 * - Alert on semantic drift
 * - Block changes that break principles
 * - Require external review at the slightest doubt
 * 
 * This means: Even a motivated leadership meets friction.
 * 
 * Friction = Longevity.
 */

/**
 * THE FRICTION PRINCIPLE
 */
export const FRICTION_PRINCIPLE = {
  statement: 'Even motivated leadership must meet friction',
  
  why: {
    motivation_is_the_problem: 'Motivated people are the most dangerous',
    friction_slows_harm: 'Friction gives time for reconsideration',
    automation_removes_discretion: 'Automated checks cannot be talked around',
  },
  
  result: 'Friction = Longevity',
} as const;

/**
 * AUTOMATED MONITORING SYSTEMS
 */
export const AUTOMATED_MONITORING = {
  schema_deviation_detection: {
    what: 'Detects any data that doesn\'t match schema exactly',
    triggers: ['New fields', 'Missing fields', 'Type mismatches', 'Value ranges'],
    response: 'Immediate flag, ingestion blocked until resolved',
    human_override: 'Requires steward committee approval',
  },
  
  semantic_drift_detection: {
    what: 'Detects gradual changes in meaning or usage',
    triggers: ['Definition changes', 'Usage pattern shifts', 'Terminology evolution'],
    response: 'Alert to stewards, documentation review required',
    human_override: 'Requires full governance review',
  },
  
  principle_violation_detection: {
    what: 'Detects any action that violates core principles',
    triggers: ['Normative language', 'Recommendations', 'Predictions', 'Interpretations'],
    response: 'Block action, escalate to stewards',
    human_override: 'Not possible - principles are absolute',
  },
  
  access_anomaly_detection: {
    what: 'Detects unusual access patterns',
    triggers: ['Off-hours access', 'Bulk downloads', 'Admin actions', 'New access patterns'],
    response: 'Log and alert, potential access suspension',
    human_override: 'Requires explanation and steward approval',
  },
} as const;

/**
 * AUTOMATIC BLOCKS
 */
export const AUTOMATIC_BLOCKS = {
  core_code_modification: {
    what: 'Any attempt to modify core codebase',
    block_mechanism: 'Read-only filesystem, no write access',
    bypass: 'None - code modification is not possible',
  },
  
  schema_modification: {
    what: 'Any attempt to modify schema definitions',
    block_mechanism: 'Immutable storage, append-only versioning',
    bypass: 'Requires foundation charter amendment (near impossible)',
  },
  
  data_deletion: {
    what: 'Any attempt to delete historical data',
    block_mechanism: 'Append-only storage, no delete operations',
    bypass: 'Not possible - deletion capability does not exist',
  },
  
  configuration_change: {
    what: 'Any attempt to change system configuration',
    block_mechanism: 'Configuration locked, changes require multi-party approval',
    bypass: 'Threshold signatures from multiple stewards',
  },
} as const;

/**
 * EXTERNAL REVIEW TRIGGERS
 */
export const EXTERNAL_REVIEW_TRIGGERS = {
  any_schema_change: {
    trigger: 'Any proposed change to data schema',
    required_review: 'External methodology committee',
    timeline: 'Minimum 90 days',
  },
  
  any_principle_question: {
    trigger: 'Any action where principle application is unclear',
    required_review: 'External ethics review',
    timeline: 'Until resolved (no deadline)',
  },
  
  any_access_expansion: {
    trigger: 'Any request to expand access rights',
    required_review: 'External security audit',
    timeline: 'Minimum 30 days',
  },
  
  any_methodology_question: {
    trigger: 'Any question about methodology correctness',
    required_review: 'External academic review',
    timeline: 'Until resolved (no deadline)',
  },
} as const;

/**
 * FRICTION MECHANISMS
 */
export const FRICTION_MECHANISMS = {
  waiting_periods: {
    purpose: 'Force time for reconsideration',
    implementation: 'Mandatory delays between proposal and action',
    cannot_be_waived: true,
  },
  
  multiple_approvals: {
    purpose: 'Require consensus, not individual decision',
    implementation: 'Threshold signatures, no single point of approval',
    cannot_be_waived: true,
  },
  
  public_logging: {
    purpose: 'Make all actions visible',
    implementation: 'Every action logged publicly in real-time',
    cannot_be_waived: true,
  },
  
  external_verification: {
    purpose: 'Require outside validation',
    implementation: 'Independent parties must verify significant changes',
    cannot_be_waived: true,
  },
} as const;

/**
 * WHAT FRICTION PREVENTS
 */
export const FRICTION_PREVENTS = {
  quick_decisions: 'Cannot rush changes through',
  unilateral_action: 'Cannot act alone',
  hidden_changes: 'Cannot hide what is done',
  internal_capture: 'Cannot bypass external oversight',
  
  cumulative_effect: 'Makes gradual erosion extremely difficult',
} as const;
