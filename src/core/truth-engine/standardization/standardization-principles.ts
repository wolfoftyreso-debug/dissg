/**
 * STANDARDIZATION PRINCIPLES
 * 
 * STEG 23: GLOBAL STANDARDISERING (UTAN STANDARDORGAN)
 * 
 * Principen: Standarder vinner inte genom beslut.
 * De vinner genom minst friktion.
 * 
 * Historiska exempel: TCP/IP, DNS, HTTP, ISO-datum
 * Ingen av dessa vann för att de var "officiella".
 * De vann för att alla andra tjänade på att anpassa sig.
 */

/**
 * HOW STANDARDS WIN
 */
export const HOW_STANDARDS_WIN = {
  // Not through
  not_through: [
    'official_decree',
    'committee_decision',
    'government_mandate',
    'industry_consortium',
    'marketing_campaign',
  ],
  
  // But through
  through: [
    'least_friction',
    'obvious_superiority',
    'network_effects',
    'imitation_is_trivial',
    'alternative_is_worse',
  ],
  
  // Historical examples
  examples: {
    'TCP/IP': 'Won because it worked everywhere',
    'DNS': 'Won because naming was universal need',
    'HTTP': 'Won because hyperlinks were obvious',
    'ISO_8601': 'Won because ambiguity was costly',
    'JSON': 'Won because it was readable',
    'Markdown': 'Won because it was writable',
  },
  
  // The mechanic
  core_mechanic: 'Everyone else benefits from adapting',
} as const;

/**
 * STANDARD ADOPTION PHASES
 */
export type AdoptionPhase = 
  | 'unknown'
  | 'discovered'
  | 'evaluated'
  | 'partially_adopted'
  | 'fully_adopted'
  | 'advocated';

/**
 * ADOPTION INDICATOR
 */
export interface AdoptionIndicator {
  readonly signal_type: string;
  readonly description: string;
  readonly phase_indicates: AdoptionPhase;
  readonly measurement: string;
}

/**
 * SIGNALS OF STANDARD ADOPTION
 */
export const ADOPTION_SIGNALS: readonly AdoptionIndicator[] = [
  {
    signal_type: 'question_id_reference',
    description: 'AI platforms reference our question_ids',
    phase_indicates: 'partially_adopted',
    measurement: 'External systems using CQ-IDs in requests',
  },
  {
    signal_type: 'variable_mapping',
    description: 'Data providers map their fields to our variables',
    phase_indicates: 'fully_adopted',
    measurement: 'Third-party schema compatibility declarations',
  },
  {
    signal_type: 'schema_mirroring',
    description: 'Analysis tools mirror our schema internally',
    phase_indicates: 'fully_adopted',
    measurement: 'Internal architectures resembling ours',
  },
  {
    signal_type: 'provenance_acceptance',
    description: 'Legal entities accept our provenance format',
    phase_indicates: 'advocated',
    measurement: 'Citations in legal/regulatory documents',
  },
  {
    signal_type: 'fewer_integration_questions',
    description: 'Fewer questions about how to integrate',
    phase_indicates: 'fully_adopted',
    measurement: 'Support ticket decline rate',
  },
  {
    signal_type: 'pre_adapted',
    description: '"We have already adapted" responses',
    phase_indicates: 'advocated',
    measurement: 'Inbound "already compatible" declarations',
  },
  {
    signal_type: 'inbound_exceeds_outbound',
    description: 'More inbound requests than outbound outreach',
    phase_indicates: 'advocated',
    measurement: 'Request direction ratio',
  },
];

/**
 * FRICTION COMPARISON
 */
export interface FrictionComparison {
  readonly action: string;
  readonly with_standard: string;
  readonly without_standard: string;
  readonly friction_reduction: 'high' | 'medium' | 'low';
}

/**
 * WHY ADOPTING IS LOWER FRICTION
 */
export const FRICTION_REDUCTIONS: readonly FrictionComparison[] = [
  {
    action: 'Cross-reference data',
    with_standard: 'Use shared entity IDs',
    without_standard: 'Build custom mapping layer',
    friction_reduction: 'high',
  },
  {
    action: 'Validate provenance',
    with_standard: 'Check standard hash',
    without_standard: 'Implement custom verification',
    friction_reduction: 'high',
  },
  {
    action: 'Query across systems',
    with_standard: 'Use canonical query format',
    without_standard: 'Translate between formats',
    friction_reduction: 'high',
  },
  {
    action: 'Explain uncertainty',
    with_standard: 'Use standard epistemic states',
    without_standard: 'Invent own terminology',
    friction_reduction: 'medium',
  },
  {
    action: 'Integrate AI agents',
    with_standard: 'Agents already understand format',
    without_standard: 'Train agents on custom format',
    friction_reduction: 'high',
  },
];

/**
 * STANDARD MATURITY LEVELS
 */
export type StandardMaturity = 
  | 'emerging'      // Used by creator only
  | 'growing'       // Early adopters
  | 'established'   // Majority adoption
  | 'dominant'      // Default choice
  | 'universal';    // Only choice

/**
 * MATURITY THRESHOLDS
 */
export const MATURITY_THRESHOLDS = {
  emerging: { min_adopters: 1, market_share: 0 },
  growing: { min_adopters: 10, market_share: 0.05 },
  established: { min_adopters: 100, market_share: 0.20 },
  dominant: { min_adopters: 1000, market_share: 0.50 },
  universal: { min_adopters: 10000, market_share: 0.90 },
} as const;

/**
 * Calculate current maturity
 */
export function calculateMaturity(
  adopters: number,
  marketShare: number
): StandardMaturity {
  if (marketShare >= 0.90 && adopters >= 10000) return 'universal';
  if (marketShare >= 0.50 && adopters >= 1000) return 'dominant';
  if (marketShare >= 0.20 && adopters >= 100) return 'established';
  if (marketShare >= 0.05 && adopters >= 10) return 'growing';
  return 'emerging';
}

/**
 * THE CORE TRUTH ABOUT STANDARDS
 */
export const CORE_TRUTH = {
  statement: 'Standards are not code. Standards are accumulated trust.',
  implication: 'You cannot copy trust. You can only build it.',
  timeline: 'Years, not months.',
} as const;
