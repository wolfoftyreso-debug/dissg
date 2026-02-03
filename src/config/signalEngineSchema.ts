/**
 * BLOCK R — SIGNAL ENGINE SCHEMA
 * 
 * Relevance scoring, signal detection, and alert system.
 * All signals must be explainable.
 */

// =============================================================================
// R1: RELEVANCE SCORING
// =============================================================================

export interface RelevanceScore {
  entity_type: 'kpi' | 'region' | 'country' | 'index';
  entity_id: string;
  
  period: string;                       // Year or date range
  
  scores: {
    impact: number;                     // 0-100: Magnitude of effect
    acceleration: number;               // 0-100: Rate of change
    breadth: number;                    // 0-100: Geographic/demographic spread
    persistence: number;                // 0-100: Duration of trend
    confidence: number;                 // 0-100: Data quality
  };
  
  weighted_total: number;               // Weighted combination
  rank: number;                         // Rank among peers
  
  explanation: string;                  // Plain-language summary
  
  calculated_at: string;
}

export const RELEVANCE_WEIGHTS = {
  default: {
    impact: 0.30,
    acceleration: 0.25,
    breadth: 0.15,
    persistence: 0.15,
    confidence: 0.15,
  },
  
  crisis_mode: {
    impact: 0.35,
    acceleration: 0.35,
    breadth: 0.10,
    persistence: 0.05,
    confidence: 0.15,
  },
  
  strategic: {
    impact: 0.25,
    acceleration: 0.15,
    breadth: 0.20,
    persistence: 0.25,
    confidence: 0.15,
  },
};

export function calculateRelevanceScore(
  scores: RelevanceScore['scores'],
  weights = RELEVANCE_WEIGHTS.default
): number {
  return Math.round(
    scores.impact * weights.impact +
    scores.acceleration * weights.acceleration +
    scores.breadth * weights.breadth +
    scores.persistence * weights.persistence +
    scores.confidence * weights.confidence
  );
}

// =============================================================================
// R2: SIGNAL TYPES
// =============================================================================

export type SignalType = 
  | 'early_warning'
  | 'structural_decline'
  | 'sudden_shock'
  | 'divergence'
  | 'convergence'
  | 'acceleration'
  | 'deceleration'
  | 'reversal'
  | 'anomaly'
  | 'milestone';

export interface SignalDefinition {
  type: SignalType;
  name: string;
  description: string;
  
  detection_rules: {
    metric: string;                     // What to measure
    condition: 'above' | 'below' | 'change' | 'deviation';
    threshold: number;
    period: string;                     // Time window
  };
  
  severity_levels: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  
  explanation_template: string;         // Template for plain-language explanation
}

export const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  {
    type: 'early_warning',
    name: 'Early Warning Signal',
    description: 'Leading indicator suggesting potential future deterioration',
    detection_rules: {
      metric: 'trend_direction',
      condition: 'change',
      threshold: 0.1,
      period: '3 months',
    },
    severity_levels: { low: 0.1, medium: 0.3, high: 0.5, critical: 0.7 },
    explanation_template: '{kpi_name} in {location} shows early warning: {direction} {magnitude}% over {period}.',
  },
  {
    type: 'structural_decline',
    name: 'Structural Decline',
    description: 'Persistent negative trend over extended period',
    detection_rules: {
      metric: 'trend_slope',
      condition: 'below',
      threshold: -0.02,
      period: '24 months',
    },
    severity_levels: { low: -0.02, medium: -0.05, high: -0.10, critical: -0.20 },
    explanation_template: '{kpi_name} in {location} has declined {magnitude}% over {period}, indicating structural weakness.',
  },
  {
    type: 'sudden_shock',
    name: 'Sudden Shock',
    description: 'Abrupt change exceeding historical volatility',
    detection_rules: {
      metric: 'period_change',
      condition: 'deviation',
      threshold: 2.5,                   // Standard deviations
      period: '1 month',
    },
    severity_levels: { low: 2.5, medium: 3.0, high: 4.0, critical: 5.0 },
    explanation_template: '{kpi_name} in {location} experienced sudden shock: {direction} {magnitude}% in {period}, {std_dev}σ from normal.',
  },
  {
    type: 'divergence',
    name: 'Divergence',
    description: 'Entity moving away from peer group or benchmark',
    detection_rules: {
      metric: 'peer_deviation',
      condition: 'above',
      threshold: 0.15,
      period: '12 months',
    },
    severity_levels: { low: 0.15, medium: 0.25, high: 0.40, critical: 0.60 },
    explanation_template: '{location} diverging from {peer_group} on {kpi_name}: now {position} vs. average.',
  },
  {
    type: 'convergence',
    name: 'Convergence',
    description: 'Entity moving toward peer group or benchmark',
    detection_rules: {
      metric: 'peer_gap_reduction',
      condition: 'above',
      threshold: 0.10,
      period: '12 months',
    },
    severity_levels: { low: 0.10, medium: 0.20, high: 0.35, critical: 0.50 },
    explanation_template: '{location} converging toward {peer_group} on {kpi_name}: gap reduced {magnitude}% in {period}.',
  },
  {
    type: 'acceleration',
    name: 'Acceleration',
    description: 'Rate of change increasing',
    detection_rules: {
      metric: 'second_derivative',
      condition: 'above',
      threshold: 0.05,
      period: '6 months',
    },
    severity_levels: { low: 0.05, medium: 0.10, high: 0.20, critical: 0.35 },
    explanation_template: '{kpi_name} in {location} accelerating: rate of change up {magnitude}% in {period}.',
  },
  {
    type: 'reversal',
    name: 'Trend Reversal',
    description: 'Direction of trend has changed',
    detection_rules: {
      metric: 'trend_direction',
      condition: 'change',
      threshold: 0,
      period: '6 months',
    },
    severity_levels: { low: 0, medium: 0.1, high: 0.2, critical: 0.3 },
    explanation_template: '{kpi_name} in {location} reversed: now {new_direction} after {previous_period} of {old_direction}.',
  },
  {
    type: 'anomaly',
    name: 'Statistical Anomaly',
    description: 'Value outside expected range',
    detection_rules: {
      metric: 'z_score',
      condition: 'deviation',
      threshold: 2.0,
      period: 'single point',
    },
    severity_levels: { low: 2.0, medium: 2.5, high: 3.0, critical: 4.0 },
    explanation_template: '{kpi_name} in {location} shows anomaly: {value} is {std_dev}σ from expected.',
  },
  {
    type: 'milestone',
    name: 'Milestone Reached',
    description: 'Significant threshold crossed',
    detection_rules: {
      metric: 'absolute_value',
      condition: 'above',
      threshold: 0,                     // Defined per KPI
      period: 'single point',
    },
    severity_levels: { low: 0, medium: 0, high: 0, critical: 0 },
    explanation_template: '{location} reached milestone on {kpi_name}: {milestone_description}.',
  },
];

// =============================================================================
// SIGNAL INSTANCE
// =============================================================================

export interface DetectedSignal {
  signal_id: string;
  signal_type: SignalType;
  
  entity: {
    type: 'kpi' | 'index' | 'country' | 'region';
    id: string;
    name: string;
  };
  
  location: {
    country_code: string;
    region_code?: string;
    name: string;
  };
  
  detected_at: string;
  period_start: string;
  period_end: string;
  
  metrics: {
    current_value: number;
    previous_value: number;
    change_absolute: number;
    change_percent: number;
    z_score?: number;
    peer_comparison?: number;
  };
  
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;                   // 0-100
  
  explanation: {
    headline: string;                   // One sentence
    context: string;                    // Additional context
    what_this_means: string;
    what_this_does_not_mean: string[];
    related_signals?: string[];
  };
  
  data_sources: string[];
  
  status: 'active' | 'resolved' | 'monitoring' | 'dismissed';
}

// =============================================================================
// ALERT CONFIGURATION
// =============================================================================

export interface AlertRule {
  rule_id: string;
  name: string;
  
  triggers: {
    signal_types: SignalType[];
    severity_minimum: 'low' | 'medium' | 'high' | 'critical';
    entity_types: string[];
    locations?: string[];               // Country/region codes
    kpis?: string[];                    // KPI IDs
  };
  
  throttling: {
    max_per_day: number;
    cooldown_hours: number;
    aggregate_similar: boolean;
  };
  
  delivery: {
    channels: ('email' | 'webhook' | 'in_app' | 'sms')[];
    subscribers: string[];
  };
  
  is_active: boolean;
}

// =============================================================================
// SIGNAL ENGINE VALIDATION
// =============================================================================

export function validateSignalExplanation(signal: DetectedSignal): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!signal.explanation.headline) {
    errors.push('Signal must have headline explanation');
  }
  
  if (signal.explanation.headline.length > 150) {
    errors.push('Headline must be under 150 characters');
  }
  
  if (!signal.explanation.what_this_does_not_mean || signal.explanation.what_this_does_not_mean.length === 0) {
    errors.push('Signal must explain what it does NOT mean');
  }
  
  if (signal.data_sources.length === 0) {
    errors.push('Signal must cite data sources');
  }
  
  // Check for forbidden language
  const forbidden = ['causes', 'proves', 'should', 'must', 'blame', 'fault'];
  const allText = signal.explanation.headline + signal.explanation.context + signal.explanation.what_this_means;
  
  for (const word of forbidden) {
    if (allText.toLowerCase().includes(word)) {
      errors.push(`Explanation contains forbidden word: "${word}"`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// =============================================================================
// SIGNAL ENGINE CONFIG
// =============================================================================

export const SIGNAL_ENGINE_CONFIG = {
  version: '1.0.0',
  
  detection: {
    run_frequency: 'hourly',
    lookback_periods: {
      short: '7 days',
      medium: '30 days',
      long: '365 days',
    },
    minimum_data_points: 10,
  },
  
  thresholds: {
    minimum_confidence: 60,             // Don't emit signals below this
    peer_group_minimum: 5,              // Minimum peers for comparison
  },
  
  explanation_requirements: {
    must_have_headline: true,
    must_have_limitations: true,
    must_cite_sources: true,
    max_headline_length: 150,
    forbidden_words: ['causes', 'proves', 'should', 'must', 'blame', 'fault', 'failure', 'success'],
  },
};
