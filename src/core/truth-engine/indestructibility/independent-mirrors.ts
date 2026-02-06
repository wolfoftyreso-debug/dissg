/**
 * MULTIPLE INDEPENDENT MIRRORS
 * 
 * STEG 31: DISTRIBUTED PROTECTION
 * 
 * You encourage (do not control):
 * - Academic mirrors
 * - Public mirrors
 * - Non-profit mirrors
 * - Stateless mirrors
 * 
 * They:
 * - Read your output
 * - Store history
 * - Verify continuity
 * 
 * You do not need to own them.
 * Their existence protects you.
 */

/**
 * THE MIRROR PRINCIPLE
 */
export const MIRROR_PRINCIPLE = {
  statement: 'Protection comes from distribution, not control',
  
  approach: {
    encourage: 'Make it easy and valuable to mirror',
    not_control: 'Mirrors are independent, not subsidiaries',
    benefit: 'Their independence is the protection',
  },
  
  why_independence_matters: {
    cannot_be_ordered: 'Independent mirrors cannot be ordered to comply',
    cannot_be_purchased: 'Too many in too many jurisdictions',
    cannot_be_pressured: 'No single pressure point',
  },
} as const;

/**
 * TYPES OF MIRRORS
 */
export const MIRROR_TYPES = {
  academic: {
    examples: 'Universities, research institutions',
    motivation: 'Research access, archival mission',
    properties: 'Academic freedom protections, distributed globally',
    value: 'High credibility, long institutional memory',
  },
  
  public: {
    examples: 'National libraries, public archives',
    motivation: 'Public interest, legal deposit requirements',
    properties: 'Funded by public, mandated to preserve',
    value: 'Legal standing, permanence',
  },
  
  nonprofit: {
    examples: 'Internet Archive, Wikipedia foundation',
    motivation: 'Mission to preserve information',
    properties: 'Independent of commercial pressure',
    value: 'Proven track record of preservation',
  },
  
  stateless: {
    examples: 'IPFS, blockchain anchors, distributed networks',
    motivation: 'Technical distribution',
    properties: 'No single jurisdiction, no single point of failure',
    value: 'Technically indestructible',
  },
} as const;

/**
 * WHAT MIRRORS DO
 */
export const MIRROR_FUNCTIONS = {
  read_output: {
    function: 'Continuously receive oracle output',
    mechanism: 'Public feed, API access, export downloads',
    frequency: 'Real-time or near-real-time',
  },
  
  store_history: {
    function: 'Maintain complete historical record',
    mechanism: 'Local storage with verification',
    property: 'History exists even if oracle stops',
  },
  
  verify_continuity: {
    function: 'Check that current output matches historical pattern',
    mechanism: 'Hash verification, semantic comparison',
    alerting: 'Flag any discontinuity',
  },
  
  detect_manipulation: {
    function: 'Identify any deviation from expected behavior',
    mechanism: 'Comparison against stored spec and history',
    response: 'Public alert, integrity flag',
  },
} as const;

/**
 * ENABLING MIRRORS
 */
export const ENABLING_MIRRORS = {
  open_access: {
    what: 'Free access to all public outputs',
    why: 'Removes barrier to mirroring',
  },
  
  machine_readable: {
    what: 'All outputs in standard, parseable formats',
    why: 'Easy to automate mirroring',
  },
  
  verification_tools: {
    what: 'Open source tools to verify integrity',
    why: 'Lowers cost of verification',
  },
  
  explicit_encouragement: {
    what: 'Public statement encouraging mirrors',
    why: 'Removes legal ambiguity',
  },
  
  no_control: {
    what: 'No attempt to coordinate or control mirrors',
    why: 'Independence is the protection',
  },
} as const;

/**
 * THE PROTECTION MECHANISM
 */
export const PROTECTION_MECHANISM = {
  oracle_stops: {
    scenario: 'Oracle ceases operation',
    protection: 'Full history exists on mirrors',
    result: 'Nothing is lost',
  },
  
  oracle_captured: {
    scenario: 'Oracle begins producing manipulated output',
    protection: 'Mirrors compare to historical behavior',
    result: 'Manipulation is detected',
  },
  
  oracle_denies_history: {
    scenario: 'Oracle claims something was never published',
    protection: 'Mirrors have proof of original publication',
    result: 'Denial is disproven',
  },
  
  state_demands_censorship: {
    scenario: 'State in one jurisdiction demands removal',
    protection: 'Mirrors in other jurisdictions unaffected',
    result: 'Information survives',
  },
} as const;

/**
 * WHY YOU DON'T NEED TO OWN THEM
 */
export const NO_OWNERSHIP_NEEDED = {
  principle: 'Their existence protects you; you do not need to control them',
  
  benefits_to_mirrors: {
    access: 'They get free access to valuable reference data',
    mission: 'They fulfill their archival/research mission',
    reputation: 'They become part of important infrastructure',
  },
  
  benefits_to_oracle: {
    distribution: 'History cannot be suppressed',
    verification: 'Independent parties verify integrity',
    credibility: 'Independent mirrors add credibility',
    survival: 'Oracle survives even own destruction',
  },
  
  mutual_value: 'Relationship is mutually beneficial without formal ties',
} as const;
