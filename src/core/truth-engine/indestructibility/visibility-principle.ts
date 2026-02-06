/**
 * THE VISIBILITY PRINCIPLE
 * 
 * STEG 31: IT MUST BE IMPOSSIBLE TO DO WRONG IN SILENCE
 * 
 * You can never completely stop attacks.
 * But you can make them visible, slow, and costly.
 * 
 * This is the core of indestructibility.
 */

/**
 * THE CORE PRINCIPLE
 */
export const VISIBILITY_PRINCIPLE = {
  statement: 'It must be impossible to do wrong in silence',
  
  meaning: {
    cannot_stop_attacks: 'Determined attackers will always find ways',
    can_make_visible: 'Every action can be logged and broadcast',
    visibility_is_protection: 'What is seen cannot be hidden',
  },
  
  mechanism: {
    all_actions_logged: 'Every operation creates permanent record',
    logs_publicly_accessible: 'Anyone can audit at any time',
    logs_cryptographically_signed: 'Cannot be falsified after fact',
    logs_distributed: 'No single point can suppress',
  },
  
  result: 'Attacks are visible, slow, and costly',
} as const;

/**
 * WHAT VISIBILITY ENABLES
 */
export const VISIBILITY_ENABLES = {
  detection: {
    what: 'Any deviation from expected behavior is detectable',
    by_whom: 'Anyone monitoring: researchers, journalists, competitors, AI systems',
    timeline: 'Near real-time',
  },
  
  attribution: {
    what: 'Who did what, when, can be determined',
    mechanism: 'Signed actions, audit trail',
    result: 'Accountability is automatic',
  },
  
  response: {
    what: 'External parties can respond to detected manipulation',
    options: ['Public exposure', 'Mirror activation', 'Trust withdrawal'],
    result: 'Self-defending ecosystem',
  },
  
  deterrence: {
    what: 'Knowing attacks will be visible deters attacks',
    mechanism: 'Cost-benefit calculation shifts',
    result: 'Many attacks never attempted',
  },
} as const;

/**
 * WHAT MUST BE VISIBLE
 */
export const WHAT_IS_VISIBLE = {
  always_public: {
    schema_definitions: 'How data is structured',
    epistemic_rules: 'How data is interpreted',
    methodology: 'How conclusions are derived',
    change_log: 'Every modification to above',
    integrity_status: 'Current system health',
  },
  
  never_public: {
    operational_data: 'Some data may be access-controlled',
    api_keys: 'Access credentials',
    infrastructure_details: 'Security-sensitive operations',
  },
  
  distinction: 'Rules are public; some content may be gated',
} as const;

/**
 * THE SILENCE TEST
 */
export const SILENCE_TEST = {
  question: 'Can this action be taken without anyone knowing?',
  
  if_yes: 'System is vulnerable',
  if_no: 'System is protected',
  
  goal: 'Every possible action fails the silence test',
  
  examples: {
    change_schema: 'Cannot be done silently - logged and broadcast',
    modify_history: 'Cannot be done at all - append-only',
    alter_methodology: 'Cannot be done silently - versioned publicly',
    suppress_data: 'Cannot be done silently - mirrors detect gaps',
    grant_special_access: 'Cannot be done silently - access log public',
  },
} as const;

/**
 * COST OF VISIBLE ATTACK
 */
export const VISIBLE_ATTACK_COST = {
  reputational: {
    cost: 'Permanent record of manipulation attempt',
    effect: 'Loss of trust from all users',
    recovery: 'Extremely difficult',
  },
  
  operational: {
    cost: 'Mirrors and validators flag deviation',
    effect: 'System marked as compromised',
    recovery: 'Requires proving return to integrity',
  },
  
  economic: {
    cost: 'Users and AI systems stop using compromised oracle',
    effect: 'Loss of value of acquired asset',
    recovery: 'Likely impossible',
  },
  
  legal: {
    cost: 'Documented evidence of manipulation',
    effect: 'Liability for damages',
    recovery: 'Litigation',
  },
  
  net_result: 'Attacking the oracle destroys its value',
} as const;
