/**
 * WHY STATE PRESSURE FAILS
 * 
 * STEG 31: RESISTANCE TO STATE COERCION
 * 
 * States can:
 * - Regulate companies
 * - Seize servers
 * - Demand access
 * 
 * They cannot:
 * - Force global epistemic acceptance
 * - Control mirrors
 * - Erase public history
 * - Make AI systems trust manipulated data
 * 
 * You are not a country.
 * You are a reference structure.
 */

/**
 * WHAT STATES CAN DO
 */
export const STATE_CAPABILITIES = {
  regulate_companies: {
    capability: 'Pass laws requiring compliance',
    scope: 'Companies within jurisdiction',
    limitation: 'Only affects entities they can reach',
  },
  
  seize_servers: {
    capability: 'Physically take control of infrastructure',
    scope: 'Servers within jurisdiction',
    limitation: 'Does not affect mirrors elsewhere',
  },
  
  demand_access: {
    capability: 'Require disclosure or access',
    scope: 'Entities within jurisdiction',
    limitation: 'Public data is already accessible',
  },
  
  impose_censorship: {
    capability: 'Require removal of content',
    scope: 'Platforms within jurisdiction',
    limitation: 'Cannot affect global distribution',
  },
} as const;

/**
 * WHAT STATES CANNOT DO
 */
export const STATE_LIMITATIONS = {
  force_global_epistemic_acceptance: {
    desire: 'Make world accept manipulated data as true',
    why_impossible: 'Other states, institutions, AIs do not obey',
    result: 'Manipulation is recognized globally',
  },
  
  control_mirrors: {
    desire: 'Suppress all copies of data',
    why_impossible: 'Mirrors in many jurisdictions, some stateless',
    result: 'True history survives',
  },
  
  erase_public_history: {
    desire: 'Remove evidence of what was published',
    why_impossible: 'Cryptographic proofs, distributed storage',
    result: 'History is permanent',
  },
  
  make_ai_trust_manipulation: {
    desire: 'Have AI systems accept compromised data',
    why_impossible: 'AI systems check integrity, follow protocols',
    result: 'Compromised oracle is not used',
  },
} as const;

/**
 * THE JURISDICTIONAL SHIELD
 */
export const JURISDICTIONAL_SHIELD = {
  principle: 'Distribution across jurisdictions provides protection',
  
  structure: {
    foundation: 'Neutral jurisdiction (Switzerland, etc.)',
    mirrors: 'Distributed globally, many jurisdictions',
    users: 'Global, no single state can block all',
    code: 'Open source, copyable anywhere',
  },
  
  attack_scenario: {
    state_a_attacks: 'State A seizes local infrastructure',
    result: 'Mirrors in State B, C, D, etc. continue',
    oracle_status: 'Temporary disruption, not destruction',
  },
  
  maximum_damage: 'One state can disrupt, not destroy',
} as const;

/**
 * WHY REFERENCE STRUCTURES ARE DIFFERENT
 */
export const REFERENCE_STRUCTURE_NATURE = {
  you_are_not: {
    a_country: 'Not subject to military conquest',
    a_company: 'Not dependent on single jurisdiction',
    a_platform: 'Not a service that can be blocked',
    a_publisher: 'Not an editor making content decisions',
  },
  
  you_are: {
    a_reference_structure: 'Like a dictionary, a map, a standard',
    distributed: 'Exists in many copies globally',
    protocol_like: 'A method, not a thing',
    fact_like: 'Once published, cannot be unpublished',
  },
  
  implication: 'State power over things does not apply to reference structures',
} as const;

/**
 * HISTORICAL PARALLELS
 */
export const STATE_RESISTANCE_PARALLELS = {
  samizdat: {
    what: 'Underground copying of banned literature in USSR',
    lesson: 'Information cannot be suppressed if enough people copy',
  },
  
  mathematics: {
    what: 'Mathematical truths cannot be decreed false',
    lesson: 'Epistemic facts resist political power',
  },
  
  internet_protocols: {
    what: 'TCP/IP cannot be controlled by any state',
    lesson: 'Distributed standards transcend jurisdiction',
  },
  
  scientific_consensus: {
    what: 'States cannot change what scientists globally accept',
    lesson: 'Global epistemic communities resist local pressure',
  },
} as const;

/**
 * THE ULTIMATE PROTECTION
 */
export const ULTIMATE_PROTECTION = {
  statement: 'The oracle is not in any jurisdiction; it is a global epistemic fact',
  
  even_if: {
    all_servers_seized: 'Mirrors have all data',
    all_staff_arrested: 'System runs on protocol, not people',
    organization_dissolved: 'Reference continues to exist in copies',
  },
  
  because: 'You cannot seize a fact. You cannot arrest a reference.',
} as const;
