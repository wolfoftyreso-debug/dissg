/**
 * THE STEWARD ROLE IS NOT A LEADERSHIP ROLE
 * 
 * STEG 30: NEGATIVE POWER, NOT POSITIVE
 * 
 * You create an Oracle Steward, not a CEO.
 * 
 * The steward has negative power: can stop things.
 * The steward lacks positive power: cannot start things.
 */

/**
 * STEWARD DEFINITION
 */
export const STEWARD_DEFINITION = {
  title: 'Oracle Steward',
  nature: 'Guardian, not leader',
  
  analogy: {
    like: 'Museum curator, not artist',
    like_also: 'Archivist, not author',
    like_also_2: 'Auditor, not executive',
  },
  
  purpose: 'Preserve, not develop',
} as const;

/**
 * WHAT STEWARD CAN DO
 */
export const STEWARD_CAN = {
  stop_changes: {
    power: 'Veto any proposed modification',
    mechanism: 'Technical block on changes without steward approval',
    purpose: 'Prevent unauthorized modification',
  },
  
  approve_ingest: {
    power: 'Authorize new data ingestion',
    mechanism: 'Must sign off on each source',
    purpose: 'Control what enters the system',
  },
  
  verify_status: {
    power: 'Check system integrity',
    mechanism: 'Access to verification tools',
    purpose: 'Ensure nothing has been corrupted',
  },
  
  escalate_concerns: {
    power: 'Raise issues to foundation board',
    mechanism: 'Direct communication channel',
    purpose: 'Alert governance to problems',
  },
  
  audit_access: {
    power: 'Review who has accessed what',
    mechanism: 'Read-only access to logs',
    purpose: 'Detect unauthorized activity',
  },
} as const;

/**
 * WHAT STEWARD CANNOT DO
 */
export const STEWARD_CANNOT = {
  initiate_new_directions: {
    restriction: 'Cannot propose new features or expansions',
    reason: 'Stewardship is about preservation, not growth',
    enforcement: 'No mechanism to submit proposals',
  },
  
  change_priorities: {
    restriction: 'Cannot reorder what matters',
    reason: 'Priorities are fixed in charter',
    enforcement: 'Priority logic is immutable',
  },
  
  affect_visibility: {
    restriction: 'Cannot change what data is shown',
    reason: 'Visibility rules are constitutional',
    enforcement: 'No access to visibility parameters',
  },
  
  modify_methodology: {
    restriction: 'Cannot change how data is processed',
    reason: 'Methodology is core IP of foundation',
    enforcement: 'Methodology code is read-only',
  },
  
  grant_exceptions: {
    restriction: 'Cannot make exceptions to rules',
    reason: 'Rules are universal or they are nothing',
    enforcement: 'Exception mechanism does not exist',
  },
} as const;

/**
 * NEGATIVE VS POSITIVE POWER
 */
export const POWER_DISTINCTION = {
  negative_power: {
    definition: 'Ability to prevent, block, stop',
    examples: ['Veto changes', 'Block access', 'Halt processes'],
    effect: 'Preserves status quo',
    danger_level: 'Low - can only maintain',
  },
  
  positive_power: {
    definition: 'Ability to create, initiate, change',
    examples: ['New features', 'New directions', 'New policies'],
    effect: 'Changes status quo',
    danger_level: 'High - can transform system',
  },
  
  steward_has: 'Only negative power',
  
  why: 'Negative power cannot improve, only protect',
} as const;

/**
 * STEWARD SELECTION
 */
export const STEWARD_SELECTION = {
  qualities_required: [
    'Deep commitment to preservation over progress',
    'Resistance to "improvement" impulses',
    'Comfort with inaction as success',
    'Long time horizon thinking',
    'Low ego, high discipline',
  ],
  
  qualities_disqualifying: [
    'Desire to "make a difference"',
    'Creative or entrepreneurial nature',
    'Ambition for recognition',
    'Impatience with status quo',
    'Track record of innovation',
  ],
  
  selection_process: {
    veto_power: 'Existing stewards can veto candidates',
    no_campaigns: 'Candidates do not campaign',
    long_observation: 'Years of observation before consideration',
    preference: 'Choose the most boring candidate',
  },
} as const;

/**
 * STEWARD TERM AND SUCCESSION
 */
export const STEWARD_SUCCESSION = {
  term: {
    length: 'Indefinite - serves until retirement or removal',
    removal: 'Only for breach of duty, not disagreement',
    retirement: 'Encouraged after decades, not years',
  },
  
  succession: {
    overlap: 'Years of overlap with successor',
    knowledge_transfer: 'Procedural, not strategic',
    no_fresh_starts: 'Successor inherits all constraints',
  },
  
  number: {
    minimum: 3,
    maximum: 7,
    odd: true,
    reason: 'Prevents ties, ensures deliberation',
  },
} as const;
