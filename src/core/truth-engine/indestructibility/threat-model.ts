/**
 * THREAT MODEL (WITHOUT ROMANCE)
 * 
 * STEG 31: INDESTRUCTIBILITY
 * 
 * This is not paranoia.
 * This is historical realism.
 * 
 * All systems that become sufficiently important:
 * - Become acquisition targets
 * - Become politically interesting
 * - Become subject to "security arguments"
 * - Become temptation for control
 * 
 * A true oracle must therefore be stronger than power.
 */

/**
 * THE THREAT MODEL
 */
export const THREAT_MODEL = {
  assumption: 'Assume the following happens:',
  
  scenarios: {
    total_acquisition: {
      threat: '100% of shares bought up',
      capability: 'Full legal ownership',
      intent: 'Control or monetize',
    },
    
    board_replacement: {
      threat: 'Board replaced entirely',
      capability: 'Governance control',
      intent: 'Change direction',
    },
    
    narrative_control: {
      threat: 'Leadership wants to "steer narrative"',
      capability: 'Operational control',
      intent: 'Influence outputs',
    },
    
    state_pressure: {
      threat: 'State demands influence',
      capability: 'Legal coercion, regulation',
      intent: 'Political control',
    },
    
    capital_pressure: {
      threat: 'Capital demands returns through influence',
      capability: 'Economic pressure',
      intent: 'Monetize through manipulation',
    },
  },
  
  the_question: {
    not: 'Whether this will happen',
    but: 'What is technically possible when it does',
  },
} as const;

/**
 * WHY TRADITIONAL DEFENSES FAIL
 */
export const TRADITIONAL_DEFENSES_FAIL = {
  poison_pills: {
    defense: 'Anti-takeover provisions',
    why_fails: 'Can be removed by determined acquirer over time',
  },
  
  dual_class_shares: {
    defense: 'Founders retain voting control',
    why_fails: 'Founders die, sell, or are pressured',
  },
  
  mission_statements: {
    defense: 'Written commitments to mission',
    why_fails: 'Words can be reinterpreted',
  },
  
  trusted_leadership: {
    defense: 'Good people in charge',
    why_fails: 'Good people are replaced by ambitious people',
  },
  
  public_commitments: {
    defense: 'Public promises',
    why_fails: 'Public memory is short',
  },
} as const;

/**
 * WHAT ACTUALLY PROTECTS
 */
export const ACTUAL_PROTECTION = {
  principle: 'Protection comes from structure, not intentions',
  
  structural_protections: {
    visibility: 'All actions are visible to all',
    irreversibility: 'History cannot be changed',
    distribution: 'No single point of control',
    redundancy: 'Multiple independent copies',
    automation: 'Machines enforce rules, not people',
  },
  
  why_these_work: 'They do not depend on anyone\'s good will',
} as const;

/**
 * THE REALISTIC OUTCOME
 */
export const REALISTIC_OUTCOME = {
  cannot_prevent: [
    'Hostile takeover',
    'Board capture',
    'State regulation',
    'Commercial pressure',
    'Legal attacks',
  ],
  
  can_ensure: [
    'All attacks are visible',
    'All changes are recorded',
    'All manipulation is detectable',
    'All corruption triggers alerts',
    'All deviation from principles is public',
  ],
  
  result: 'Attacks become costly, slow, and visible',
} as const;
