/**
 * THE KEY DISTINCTION THAT PROTECTS
 * 
 * STEG 28: WHAT YOU ARE AND WHAT YOU ARE NOT
 * 
 * This distinction is legally extremely important.
 * It determines whether you can be regulated.
 */

/**
 * WHAT THE ORACLE IS NOT
 */
export const ORACLE_IS_NOT = {
  not_information_publisher: {
    description: 'An entity that produces editorial content',
    why_not: 'We do not create content, we structure observations',
    regulatory_implication: 'Not subject to media law',
  },
  
  not_decision_maker: {
    description: 'An entity that makes or influences decisions',
    why_not: 'We provide facts, never recommendations',
    regulatory_implication: 'Not subject to advisory regulations',
  },
  
  not_critical_realtime_service: {
    description: 'A service that society depends on in real-time',
    why_not: 'We are deliberately slow and non-operational',
    regulatory_implication: 'Not subject to critical infrastructure law',
  },
  
  not_opinion_forming_actor: {
    description: 'An entity that shapes public opinion',
    why_not: 'We present data without interpretation',
    regulatory_implication: 'Not subject to platform regulation',
  },
  
  not_financial_service: {
    description: 'A service providing financial advice or data for trading',
    why_not: 'Explicitly forbidden use case',
    regulatory_implication: 'Not subject to financial regulation',
  },
  
  not_data_controller: {
    description: 'An entity processing personal data',
    why_not: 'We only process aggregate public statistics',
    regulatory_implication: 'Minimal GDPR exposure',
  },
} as const;

/**
 * WHAT THE ORACLE IS
 */
export const ORACLE_IS = {
  identity: 'A passive, verifiable, non-operational reference structure',
  
  characteristics: {
    passive: {
      meaning: 'Does not initiate actions',
      evidence: 'No outbound connections, no triggers, no automation',
    },
    verifiable: {
      meaning: 'All claims can be traced to sources',
      evidence: 'Full provenance, checksums, audit trails',
    },
    non_operational: {
      meaning: 'Does not execute decisions',
      evidence: 'No write access, no control interfaces',
    },
    reference: {
      meaning: 'Exists to be consulted, not to act',
      evidence: 'Read-only API, no side effects',
    },
    structure: {
      meaning: 'Organizes information, does not create it',
      evidence: 'All data sourced from external authorities',
    },
  },
} as const;

/**
 * LEGAL CATEGORIZATION
 */
export const LEGAL_CATEGORY = {
  closest_analogues: [
    'Library',
    'Archive',
    'Index',
    'Encyclopedia',
    'Registry',
  ],
  
  not_analogous_to: [
    'Platform',
    'Service provider',
    'Publisher',
    'Advisor',
    'Infrastructure operator',
  ],
  
  preferred_legal_designation: 'Information reference service',
  
  why_this_matters: 'Legal category determines regulatory exposure',
} as const;

/**
 * THE FUNDAMENTAL PROTECTION
 */
export const FUNDAMENTAL_PROTECTION = {
  principle: 'We describe the world. We do not operate in it.',
  
  operational_meaning: [
    'No system depends on us to function',
    'No decision requires our approval',
    'No process blocks waiting for us',
    'No transaction flows through us',
  ],
  
  regulatory_meaning: [
    'Cannot be classified as critical infrastructure',
    'Cannot be held responsible for operational failures',
    'Cannot be required to maintain uptime',
    'Cannot be forced to provide access',
  ],
} as const;
