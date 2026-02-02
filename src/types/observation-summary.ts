/**
 * OBSERVATION SUMMARY TYPES
 * 
 * Strict, transparent summary format that can be used for:
 * - Stocks / sectors
 * - Countries
 * - Health
 * - COVID
 * - Environment
 * - Companies
 * - Policy periods
 * 
 * Core rule: Describes observed patterns and relationships.
 * Draws no conclusions about value, direction, or future.
 */

export type SummaryDomain = 
  | 'company'
  | 'sector'
  | 'country'
  | 'region'
  | 'municipality'
  | 'health'
  | 'covid'
  | 'environment'
  | 'policy'
  | 'custom';

/**
 * Block 1: Scope - What are we looking at?
 */
export interface ScopeBlock {
  object_type: SummaryDomain;
  object_name: string;
  object_id: string;
  period_start: string;
  period_end: string;
  data_sources: Array<{
    name: string;
    code: string;
    url?: string;
  }>;
  generated_text: string; // AI-generated neutral text
}

/**
 * Block 2: Observed Changes - What moved?
 */
export interface ObservedChange {
  indicator_id: string;
  indicator_name: string;
  change_type: 'level_shift' | 'trend_change' | 'volatility_change' | 'stable';
  magnitude: number;
  direction: 'increased' | 'decreased' | 'varied' | 'remained_stable';
  confidence_interval?: [number, number];
  raw_data_link: string;
}

export interface ObservedChangesBlock {
  changes: ObservedChange[];
  generated_text: string;
}

/**
 * Block 3: Relative Position - How does it compare?
 */
export interface RelativeComparison {
  comparison_type: 'peer_group' | 'sector_median' | 'historical_range' | 'regional_average';
  reference_group: string;
  reference_group_size: number;
  position: 'below_range' | 'lower_quartile' | 'interquartile' | 'upper_quartile' | 'above_range';
  percentile?: number;
  methodology_link: string;
}

export interface RelativePositionBlock {
  comparisons: RelativeComparison[];
  generated_text: string;
}

/**
 * Block 4: Co-movement & Context - What moved together?
 */
export interface Comovement {
  variable_id: string;
  variable_name: string;
  correlation: number;
  correlation_interval: [number, number];
  stability_score: number;
  stability_level: 'high' | 'medium' | 'low' | 'unstable';
  period_specific: boolean;
  alternatives_count: number; // How many others also moved similarly
}

export interface ComovementContextBlock {
  comovements: Comovement[];
  also_moved: string[]; // Other variables that showed similar patterns
  did_not_move: string[]; // Variables that didn't show this pattern
  generated_text: string;
}

/**
 * Block 5: Stability & Risk Signals - How stable is the pattern?
 */
export interface StabilitySignal {
  signal_type: 'stable' | 'variable' | 'sensitive' | 'robust';
  dimension: 'temporal' | 'geographic' | 'source' | 'overall';
  score: number;
  sensitivity_factors: string[];
}

export interface StabilityRiskBlock {
  signals: StabilitySignal[];
  overall_stability: 'robust' | 'stable' | 'sensitive' | 'volatile';
  generated_text: string;
}

/**
 * Block 6: Limits & Non-claims - What does this NOT say?
 */
export interface LimitsNonclaimsBlock {
  does_not_assess: string[];
  data_limitations: string[];
  methodology_caveats: string[];
  generated_text: string;
}

/**
 * Complete Observation Summary
 */
export interface ObservationSummary {
  id: string;
  domain: SummaryDomain;
  created_at: string;
  
  // The six blocks
  scope: ScopeBlock;
  observed_changes: ObservedChangesBlock;
  relative_position: RelativePositionBlock;
  comovement_context: ComovementContextBlock;
  stability_risk: StabilityRiskBlock;
  limits_nonclaims: LimitsNonclaimsBlock;
  
  // Metadata
  language: 'en' | 'sv';
  version: string;
  verification_hash: string;
  
  // Mandatory disclaimer (always present)
  disclaimer: string;
}

/**
 * Language rules - EXTREMELY IMPORTANT
 */
export const SUMMARY_ALLOWED_WORDS = [
  'observed',
  'relative',
  'within range',
  'coincided with',
  'varied',
  'remained stable',
  'exhibited sensitivity',
  'during the period',
  'compared to',
  'similar to',
  'in line with'
] as const;

export const SUMMARY_FORBIDDEN_WORDS = [
  'strong',
  'weak',
  'outperformed',
  'underperformed',
  'benefited from',
  'driven by',
  'suggests that',
  'will',
  'should',
  'recommend',
  'better',
  'worse',
  'good',
  'bad',
  'success',
  'failure'
] as const;

/**
 * Standard non-claims that MUST be included
 */
export const STANDARD_NON_CLAIMS: Record<SummaryDomain, string[]> = {
  company: [
    'Future performance or earnings',
    'Management quality or strategy',
    'Competitive positioning',
    'Investment recommendations',
    'Causality between observed variables'
  ],
  sector: [
    'Future sector trends',
    'Individual company performance',
    'Market timing or predictions',
    'Investment decisions',
    'Causality between market movements'
  ],
  country: [
    'Policy effectiveness',
    'Government performance evaluation',
    'Future economic trajectory',
    'Political assessments',
    'Causality between policy and outcomes'
  ],
  region: [
    'Regional governance quality',
    'Future development trajectory',
    'Comparison value judgments',
    'Policy recommendations',
    'Causality between regional factors'
  ],
  municipality: [
    'Local government performance',
    'Future municipal development',
    'Service quality assessments',
    'Policy recommendations',
    'Causality between local factors'
  ],
  health: [
    'Treatment effectiveness',
    'Healthcare quality rankings',
    'Medical recommendations',
    'Future health outcomes',
    'Causality between health factors'
  ],
  covid: [
    'Policy effectiveness comparisons',
    'Government response quality',
    'Future pandemic trajectory',
    'Mortality attribution',
    'Causality between interventions and outcomes'
  ],
  environment: [
    'Climate predictions',
    'Policy effectiveness',
    'Environmental recommendations',
    'Future environmental states',
    'Causality between human activity and outcomes'
  ],
  policy: [
    'Policy success or failure',
    'Implementation quality',
    'Future policy effects',
    'Recommendations for action',
    'Attribution of outcomes to specific decisions'
  ],
  custom: [
    'Causality between variables',
    'Future predictions',
    'Value judgments',
    'Recommendations',
    'Intent or motivation'
  ]
};

/**
 * Validation result
 */
export interface SummaryValidation {
  is_valid: boolean;
  missing_blocks: string[];
  language_violations: Array<{
    word: string;
    context: string;
    suggestion: string;
  }>;
  structure_errors: string[];
}
