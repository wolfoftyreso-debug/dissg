/**
 * AI OBSERVATION MODE - TYPES
 * 
 * Core principle: AI observes patterns in data without attribution of meaning,
 * motive, cause, or value. All outputs are mathematical, not narrative.
 */

// Observation types - what AI can detect
export type ObservationType = 
  | 'deviation'      // Sudden level shift, trend break, volatility jump
  | 'comovement'     // Simultaneous changes, lagged relationships
  | 'stability'      // Pattern consistency across dimensions
  | 'alternative';   // What else moved / didn't move

// Stability classification
export type StabilityLevel = 'high' | 'medium' | 'low' | 'unstable';

// Deviation detection result
export interface DeviationDetection {
  type: 'level_shift' | 'trend_break' | 'volatility_jump';
  variable_id: string;
  variable_name: string;
  period_start: string;
  period_end: string;
  magnitude: number;           // Size of deviation (z-score or similar)
  direction: 'increase' | 'decrease';
  baseline_period: string;
  confidence_interval: [number, number];
}

// Co-movement detection result
export interface ComovementDetection {
  variable_a_id: string;
  variable_a_name: string;
  variable_b_id: string;
  variable_b_name: string;
  period_start: string;
  period_end: string;
  correlation_coefficient: number;
  correlation_interval: [number, number];
  lag_months: number;          // 0 = simultaneous, positive = A leads B
  is_stable: boolean;
  stability_score: number;
}

// Alternative context - what else happened
export interface AlternativeContext {
  also_moved: Array<{
    variable_id: string;
    variable_name: string;
    correlation: number;
    direction: 'same' | 'opposite';
  }>;
  did_not_move: Array<{
    variable_id: string;
    variable_name: string;
  }>;
  placebo_test_passed: boolean;
  placebo_correlation: number;
}

// Limits and caveats
export interface ObservationLimits {
  data_coverage: string;           // e.g., "2015-2023, monthly"
  geographic_scope: string;        // e.g., "SE" or "SE, NO, DK"
  known_methodology_changes: string[];
  missing_data_periods: string[];
  what_this_does_not_show: string[];
}

// The main Observation Card output
export interface ObservationCard {
  id: string;
  created_at: string;
  observation_type: ObservationType;
  
  // Core observation
  observation: {
    what: string;              // Neutral description of what was observed
    when: string;              // Time period
    where: string;             // Geographic scope
  };
  
  // Strength metrics
  strength: {
    correlation?: number;
    correlation_interval?: [number, number];
    stability_score: number;
    stability_level: StabilityLevel;
  };
  
  // Context
  context: AlternativeContext;
  
  // Limits
  limits: ObservationLimits;
  
  // Raw data reference
  data_reference: {
    source_ids: string[];
    verification_hash: string;
    raw_data_url: string;
  };
}

// Locked language templates - these are the ONLY phrases AI can use
export const ALLOWED_OBSERVATION_PHRASES = {
  deviation: [
    "An observed deviation occurred in {variable} during {period}.",
    "A level shift was detected in {variable} starting {date}.",
    "Volatility in {variable} increased during {period}.",
    "A trend break was observed in {variable} at {date}."
  ],
  comovement: [
    "Variables {a} and {b} exhibited co-movement during {period}.",
    "A lagged relationship was observed between {a} and {b}.",
    "Simultaneous changes occurred in {a} and {b} during {period}.",
    "No consistent association observed between {a} and {b}."
  ],
  stability: [
    "This co-movement was stable across subperiods.",
    "This co-movement was not stable across subperiods.",
    "The pattern varied by geographic region.",
    "The pattern held across multiple data sources."
  ],
  context: [
    "Multiple variables showed similar patterns during this time.",
    "Other variables did not exhibit this pattern.",
    "The observed pattern was not unique to these variables."
  ],
  limits: [
    "Observed patterns do not imply causation or intent.",
    "This observation is limited to the available data period.",
    "Methodology changes during this period may affect comparability."
  ]
} as const;

// FORBIDDEN phrases - AI must never use these
export const FORBIDDEN_PHRASES = [
  'caused', 'caused by', 'led to', 'resulted in',
  'because', 'therefore', 'consequently', 'thus',
  'favored', 'benefited', 'harmed', 'damaged',
  'should', 'ought to', 'must', 'need to',
  'good', 'bad', 'better', 'worse',
  'success', 'failure', 'improvement', 'deterioration',
  'proves', 'demonstrates', 'shows that',
  'obviously', 'clearly', 'certainly'
] as const;

// Period descriptors (neutral, no policy attribution)
export const PERIOD_DESCRIPTORS = [
  'period_of_elevated_volatility',
  'period_of_structural_change', 
  'period_of_relative_stability',
  'period_of_increased_variance',
  'period_of_trend_acceleration',
  'period_of_trend_deceleration'
] as const;

export type PeriodDescriptor = typeof PERIOD_DESCRIPTORS[number];

// AI Observation request
export interface AIObservationRequest {
  variable_ids: string[];
  period_start: string;
  period_end: string;
  include_alternatives: boolean;
  geographic_scope?: string[];
}

// AI Observation response
export interface AIObservationResponse {
  observations: ObservationCard[];
  metadata: {
    generated_at: string;
    model_version: string;
    data_freshness: string;
    processing_time_ms: number;
  };
  disclaimers: string[];
}
