/**
 * WRONG EXIT MODEL (THE COMMON ONE)
 * 
 * STEG 29: WHAT NOT TO DO
 * 
 * All of these lead, over time, to:
 * Changed structure → Changed epistemics → Lost trust
 */

/**
 * FORBIDDEN EXIT STRUCTURES
 */
export const FORBIDDEN_EXITS = {
  full_company_sale: {
    structure: 'Sale of the company that owns the oracle',
    why_forbidden: 'Transfers all control, including core',
    what_happens: 'Buyer can change anything',
    time_to_corruption: 'Months to years',
  },
  
  full_ip_transfer: {
    structure: 'Complete intellectual property transfer',
    why_forbidden: 'Gives buyer right to modify methodology',
    what_happens: 'Core definitions become changeable',
    time_to_corruption: 'Immediate to months',
  },
  
  vision_clauses: {
    structure: '"We keep the vision" contractual clauses',
    why_forbidden: 'Unenforceable, subjective, time-limited',
    what_happens: 'Clauses expire or get reinterpreted',
    time_to_corruption: 'Years (until clause expires)',
  },
  
  advisory_boards: {
    structure: 'Founders remain as advisors',
    why_forbidden: 'Advisors have no power, only influence',
    what_happens: 'Advice gets ignored when inconvenient',
    time_to_corruption: 'Immediate (advice is optional)',
  },
  
  earnouts: {
    structure: 'Payment tied to maintaining structure',
    why_forbidden: 'Ends when earnout period ends',
    what_happens: 'Changes begin day after final payment',
    time_to_corruption: 'Precisely when earnout ends',
  },
} as const;

/**
 * WHY THESE ALL FAIL
 */
export const FAILURE_MECHANISM = {
  core_problem: 'All rely on buyer goodwill or time-limited constraints',
  
  buyer_goodwill: {
    initial_state: 'Buyer promises to maintain structure',
    pressure_point: 'Board demands return on investment',
    outcome: 'Promises yield to fiduciary duty',
  },
  
  time_limits: {
    initial_state: 'Contract protects structure for N years',
    pressure_point: 'Year N+1 arrives',
    outcome: 'All protections expire simultaneously',
  },
  
  interpretation: {
    initial_state: 'Agreement defines "maintaining epistemics"',
    pressure_point: 'Lawyers find creative interpretations',
    outcome: 'Letter of agreement preserved, spirit destroyed',
  },
} as const;

/**
 * THE ILLUSION OF PROTECTION
 */
export const PROTECTION_ILLUSIONS = {
  reputation_protection: {
    belief: 'Buyer will protect the brand',
    reality: 'Brand can be maintained while substance changes',
    example: 'Same name, same logo, different methodology',
  },
  
  user_protection: {
    belief: 'Users will leave if structure changes',
    reality: 'Users notice slowly, switching costs are high',
    example: 'Gradual degradation goes unnoticed for years',
  },
  
  market_protection: {
    belief: 'Market will punish bad behavior',
    reality: 'Market often rewards short-term extraction',
    example: 'Stock rises on "monetization strategy"',
  },
  
  legal_protection: {
    belief: 'Contracts will enforce protection',
    reality: 'Contracts require enforcement, which requires resources',
    example: 'Founders cannot afford to sue acquirer',
  },
} as const;

/**
 * THE ONLY REAL PROTECTION
 */
export const REAL_PROTECTION = {
  principle: 'Structure must be unchangeable, not just protected',
  
  meaning: [
    'Not protected by contract (can be breached)',
    'Not protected by reputation (can be ignored)',
    'Not protected by promise (can be broken)',
    'Protected by architecture (cannot be changed)',
  ],
  
  implementation: 'Separate the unchangeable from the ownable',
} as const;
