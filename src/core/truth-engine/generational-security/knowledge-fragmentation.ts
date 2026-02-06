/**
 * KNOWLEDGE FRAGMENTATION
 * 
 * STEG 30: HARD TO UNDERSTAND, EASY TO USE
 * 
 * Those who use the oracle: need not understand it
 * Those who steward the oracle: must never fully understand how to change it
 * 
 * Knowledge is deliberately fragmented.
 */

/**
 * THE PRINCIPLE
 */
export const FRAGMENTATION_PRINCIPLE = {
  for_users: {
    requirement: 'Easy to use',
    meaning: 'Clear API, good documentation, predictable behavior',
    understanding_needed: 'None of internals',
  },
  
  for_stewards: {
    requirement: 'Hard to change',
    meaning: 'Fragmented knowledge, limited access, unclear modification paths',
    understanding_needed: 'Only their specific domain',
  },
  
  result: 'No single person can understand how to modify the whole system',
} as const;

/**
 * HOW THIS IS ACHIEVED
 */
export const FRAGMENTATION_METHODS = {
  extreme_modularity: {
    method: 'System split into isolated modules',
    implementation: 'Each module has its own team/steward',
    effect: 'No one sees the whole picture',
  },
  
  hard_permission_boundaries: {
    method: 'Access strictly limited by role',
    implementation: 'Technical enforcement, not policy',
    effect: 'Cannot access what you cannot change',
  },
  
  what_not_why_documentation: {
    method: 'Documentation explains what, never why',
    implementation: 'Procedure manuals, not philosophy documents',
    effect: 'Stewards know how to maintain, not how to modify',
  },
  
  no_master_key: {
    method: 'No single credential grants full access',
    implementation: 'Distributed key management, threshold signatures',
    effect: 'Collusion required for significant changes',
  },
} as const;

/**
 * DOCUMENTATION STRATEGY
 */
export const DOCUMENTATION_STRATEGY = {
  documented: {
    operational_procedures: 'How to perform routine tasks',
    maintenance_steps: 'How to fix known issues',
    verification_methods: 'How to check integrity',
    escalation_paths: 'Who to contact for what',
  },
  
  not_documented: {
    original_vision: 'Why the system was created',
    design_decisions: 'Why specific choices were made',
    modification_procedures: 'How to change core behavior',
    workarounds: 'How to bypass constraints',
  },
  
  result: 'Stewards can maintain but not transform',
} as const;

/**
 * THE PARADOX OF UNDERSTANDING
 */
export const UNDERSTANDING_PARADOX = {
  statement: 'Those who fully understand the system are dangerous to it',
  
  mechanism: {
    full_understanding: 'Enables identification of "improvements"',
    improvements: 'Seem obviously good to someone who understands',
    implementation: 'Changes system in ways that seem beneficial',
    cumulative_effect: 'System gradually transforms into something else',
  },
  
  protection: 'Prevent full understanding from existing in any one person',
} as const;

/**
 * KNOWLEDGE DISTRIBUTION
 */
export const KNOWLEDGE_DISTRIBUTION = {
  schema_team: {
    knows: 'How data is structured',
    does_not_know: 'Why specific structures were chosen',
    can_do: 'Validate data against schema',
    cannot_do: 'Modify schema definitions',
  },
  
  verification_team: {
    knows: 'How to verify integrity',
    does_not_know: 'How verification rules were derived',
    can_do: 'Run verification, flag issues',
    cannot_do: 'Change verification rules',
  },
  
  access_team: {
    knows: 'How to manage API access',
    does_not_know: 'Internal data processing',
    can_do: 'Grant/revoke access tokens',
    cannot_do: 'Access data directly',
  },
  
  governance_team: {
    knows: 'Procedures and escalation',
    does_not_know: 'Technical implementation',
    can_do: 'Approve/deny change requests',
    cannot_do: 'Implement changes',
  },
} as const;
