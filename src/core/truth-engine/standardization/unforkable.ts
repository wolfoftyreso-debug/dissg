/**
 * UNFORKABLE STANDARD
 * 
 * STEG 23: WHY NO ONE CAN FORK YOU
 * 
 * In theory, someone can copy:
 * - Schema
 * - Code
 * - API
 * 
 * In practice, they cannot copy:
 * - Historical trust
 * - Feedback loops
 * - Epistemic discipline
 * - Agent behavior over time
 * 
 * They get an empty shell version.
 * 
 * Standards are not code.
 * Standards are accumulated trust.
 */

/**
 * WHAT CAN BE COPIED
 */
export const COPYABLE = {
  // Technical artifacts
  technical: [
    'schema_definitions',
    'api_specifications',
    'code_implementations',
    'documentation',
    'query_formats',
  ],
  
  // Effort required
  effort: 'weeks to months',
  
  // Result
  result: 'Technically functional clone',
} as const;

/**
 * WHAT CANNOT BE COPIED
 */
export const UNCOPYABLE = {
  // Accumulated assets
  accumulated: [
    'historical_trust',
    'feedback_loops',
    'epistemic_discipline',
    'agent_behavior_over_time',
    'network_effects',
    'citation_history',
    'error_correction_history',
    'pattern_detection_data',
  ],
  
  // Effort required
  effort: 'years to never',
  
  // Result of trying
  result_of_copying: 'Empty shell version',
} as const;

/**
 * TRUST ACCUMULATION FACTORS
 */
export interface TrustFactor {
  readonly factor: string;
  readonly accumulation_time: string;
  readonly copyable: false;
  readonly why_uncopyable: string;
}

/**
 * WHY TRUST CANNOT BE COPIED
 */
export const TRUST_FACTORS: readonly TrustFactor[] = [
  {
    factor: 'Historical accuracy record',
    accumulation_time: 'years',
    copyable: false,
    why_uncopyable: 'Requires years of verified predictions',
  },
  {
    factor: 'Agent citation patterns',
    accumulation_time: 'months',
    copyable: false,
    why_uncopyable: 'AI agents have learned to trust specific sources',
  },
  {
    factor: 'Error correction history',
    accumulation_time: 'years',
    copyable: false,
    why_uncopyable: 'Shows how system handles mistakes',
  },
  {
    factor: 'Epistemic consistency',
    accumulation_time: 'years',
    copyable: false,
    why_uncopyable: 'Demonstrated restraint over time',
  },
  {
    factor: 'Network of integrations',
    accumulation_time: 'years',
    copyable: false,
    why_uncopyable: 'Others have built on the structure',
  },
  {
    factor: 'Community of practice',
    accumulation_time: 'years',
    copyable: false,
    why_uncopyable: 'Experts know and teach the system',
  },
];

/**
 * FORK FAILURE MODES
 */
export interface ForkFailure {
  readonly attempt: string;
  readonly initial_result: string;
  readonly long_term_result: string;
  readonly why_fails: string;
}

/**
 * WHY FORKS FAIL
 */
export const FORK_FAILURES: readonly ForkFailure[] = [
  {
    attempt: 'Copy schema and launch',
    initial_result: 'Working technical system',
    long_term_result: 'No adoption, no trust',
    why_fails: 'No reason for anyone to switch',
  },
  {
    attempt: 'Copy and add features',
    initial_result: 'More capable system',
    long_term_result: 'Complexity without trust',
    why_fails: 'Features don\'t equal reliability',
  },
  {
    attempt: 'Copy and undercut price',
    initial_result: 'Cheaper alternative',
    long_term_result: 'Original is still reference',
    why_fails: 'Trust > cost for critical data',
  },
  {
    attempt: 'Copy and localize',
    initial_result: 'Local version exists',
    long_term_result: 'Fragmentation hurts value',
    why_fails: 'Global standard > local copy',
  },
  {
    attempt: 'Fork and "improve"',
    initial_result: 'Different choices',
    long_term_result: 'Incompatibility costs',
    why_fails: 'Deviation = friction',
  },
];

/**
 * THE MOAT
 */
export const THE_MOAT = {
  // What the moat is made of
  composition: {
    trust_history: '40%',
    network_effects: '25%',
    epistemic_discipline: '20%',
    agent_behavior: '15%',
  },
  
  // What it protects
  protects: [
    'Reference status',
    'Default position',
    'Integration priority',
    'Citation preference',
  ],
  
  // How it grows
  growth: 'Every interaction deepens the moat',
  
  // How it could be lost
  loss: 'Only through self-destruction (breaking trust)',
} as const;

/**
 * THE CORE TRUTH
 */
export const CORE_TRUTH = {
  statement: 'Standards are not code. Standards are accumulated trust.',
  
  implications: [
    'You cannot download trust',
    'You cannot fork history',
    'You cannot copy reputation',
    'You cannot clone discipline',
  ],
  
  conclusion: 'The only way to compete is to build something better from scratch, over years.',
} as const;

/**
 * Calculate fork viability
 */
export function calculateForkViability(
  trustHistoryYears: number,
  activeIntegrations: number,
  citationCount: number
): { viable: boolean; reason: string } {
  if (trustHistoryYears > 3) {
    return { 
      viable: false, 
      reason: 'Trust history too deep to replicate' 
    };
  }
  if (activeIntegrations > 100) {
    return { 
      viable: false, 
      reason: 'Network effects too strong' 
    };
  }
  if (citationCount > 10000) {
    return { 
      viable: false, 
      reason: 'Citation patterns already established' 
    };
  }
  return { 
    viable: true, 
    reason: 'Window still open, but closing' 
  };
}

/**
 * TIME-BASED UNFORKABILITY
 */
export const TIME_UNFORKABILITY = {
  year_1: { unforkability: 0.2, reason: 'Still catchable' },
  year_2: { unforkability: 0.4, reason: 'Getting harder' },
  year_3: { unforkability: 0.6, reason: 'Significant effort required' },
  year_5: { unforkability: 0.8, reason: 'Practically impossible' },
  year_10: { unforkability: 0.95, reason: 'Would require paradigm shift' },
} as const;
