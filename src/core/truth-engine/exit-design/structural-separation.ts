/**
 * RIGHT EXIT MODEL: STRUCTURAL SEPARATION
 * 
 * STEG 29: THE SOLUTION
 * 
 * The oracle should never sit directly in an operational company.
 * Exit happens in the operational layer, not in the core.
 */

/**
 * THE SEPARATION PRINCIPLE
 */
export const SEPARATION_PRINCIPLE = {
  statement: 'The oracle core must be structurally separate from any sellable entity',
  
  meaning: {
    core: 'Schema, epistemics, history, methodology',
    operations: 'Drift, sales, tooling, support',
    relationship: 'Operations depend on core, but cannot modify it',
  },
  
  result: 'Exit can happen in operations without touching core',
} as const;

/**
 * RECOMMENDED MODEL (CONCEPTUAL)
 */
export const RECOMMENDED_MODEL = {
  oracle_foundation: {
    legal_form: 'Foundation / Trust / Stiftung / Non-profit',
    owns: [
      'Schema definitions (CQ, CA, etc.)',
      'Epistemic rules',
      'Historical data',
      'Methodology documentation',
      'Core codebase',
    ],
    cannot: [
      'Be sold',
      'Be acquired',
      'Transfer IP to operational entities',
      'Grant exclusive licenses',
    ],
    governance: 'Independent board with constitutional constraints',
  },
  
  operational_companies: {
    legal_form: 'Normal corporations (LLC, AB, GmbH, etc.)',
    owns: [
      'API infrastructure',
      'Customer relationships',
      'Sales operations',
      'Support systems',
      'Tooling and interfaces',
    ],
    can: [
      'Be sold',
      'Be merged',
      'Be listed',
      'Change ownership freely',
    ],
    constraint: 'Cannot modify core, only access it',
  },
} as const;

/**
 * HOW THE LAYERS INTERACT
 */
export const LAYER_INTERACTION = {
  foundation_to_operations: {
    provides: 'Read-only access to core data and methodology',
    through: 'Public API, same as everyone else',
    special_access: 'None - operations have no privileged access',
  },
  
  operations_to_foundation: {
    provides: 'Funding through license fees',
    influence: 'None - cannot affect methodology or content',
    feedback: 'Can suggest, foundation decides independently',
  },
  
  key_property: 'Operations can be replaced entirely without affecting core',
} as const;

/**
 * WHY THIS WORKS
 */
export const WHY_SEPARATION_WORKS = {
  at_exit: {
    what_is_sold: 'Operational business (API access, customers, infrastructure)',
    what_remains: 'Core (schema, epistemics, history)',
    buyer_gets: 'Revenue stream from selling access',
    buyer_cannot_get: 'Ability to modify core',
  },
  
  for_seller: {
    can_realize: 'Full value of operational business',
    preserves: 'Integrity of core for all users',
    maintains: 'Long-term trust in the system',
  },
  
  for_buyer: {
    receives: 'Profitable business with predictable revenue',
    protected_from: 'Temptation to destroy value by modifying core',
    benefits_from: 'Continued trust that they cannot undermine',
  },
  
  for_users: {
    experience: 'No change in data quality or methodology',
    guarantee: 'Core cannot be modified regardless of ownership',
    continuity: 'Same oracle, different operator',
  },
} as const;

/**
 * IMPLEMENTATION REQUIREMENTS
 */
export const IMPLEMENTATION_REQUIREMENTS = {
  legal: [
    'Foundation in jurisdiction with strong foundation law',
    'Constitutional documents preventing IP transfer',
    'Board composition rules ensuring independence',
    'Conflict of interest provisions',
  ],
  
  technical: [
    'Core hosted independently from operations',
    'API access identical for operations and public',
    'No special endpoints for operational entity',
    'Full audit trail of all access',
  ],
  
  financial: [
    'Foundation funded by license fees, not owners',
    'No equity relationship between foundation and operations',
    'Transparent financial reporting',
    'Reserve fund for independent operation',
  ],
  
  governance: [
    'Board members with term limits',
    'No operational company representatives on foundation board',
    'Methodology committee separate from business decisions',
    'Public minutes of all governance decisions',
  ],
} as const;
