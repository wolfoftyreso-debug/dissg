/**
 * SIGNAL TYPES
 * 
 * Raw, quantitative, clean.
 * No text. No sentiment. No NLP interpretation.
 * Only frequency, tempo, spread, deviation.
 */

// ============================================
// CORE SIGNAL TYPES
// ============================================

export interface RawSignal {
  signal_id: string;
  source_type: SignalSourceType;
  domain: string;
  geo: string;
  topic: string;
  timestamp: string; // ISO date
  count: number;
  metadata?: {
    source_id: string;
    collection_method: string;
  };
}

export interface NormalizedSignal extends RawSignal {
  baseline_mean: number;
  baseline_std: number;
  deviation_score: number; // z-score
  seasonal_adjustment: number;
  is_valid: boolean;
  validation_reason?: string;
}

export interface SignalDetection {
  signal_id: string;
  detection_type: DetectionType;
  severity: 'low' | 'medium' | 'high';
  zscore: number;
  persistence_hours: number;
  first_detected: string;
  last_updated: string;
  is_active: boolean;
}

export interface SignalBinding {
  signal_id: string;
  bound_domains: string[];
  bound_indexes: string[];
  bound_decision_graphs: string[];
  binding_confidence: number;
}

// ============================================
// ENUMS
// ============================================

export type SignalSourceType = 
  | 'news_api'
  | 'government_announcement'
  | 'legislation_enact'
  | 'crisis_registry'
  | 'press_release'
  | 'official_statistics';

export type DetectionType = 
  | 'spike'        // sudden deviation from normal frequency
  | 'acceleration' // change in rate of change
  | 'persistence'; // how long deviation persists

// ============================================
// DETECTION THRESHOLDS
// ============================================

export const DETECTION_THRESHOLDS = {
  spike: {
    zscore_min: 2.0,
    zscore_high: 3.0,
    zscore_extreme: 4.0,
  },
  acceleration: {
    rate_change_min: 0.5,  // 50% acceleration
    rate_change_high: 1.0, // 100% acceleration
  },
  persistence: {
    min_hours: 24,
    significant_hours: 72,
    sustained_hours: 168, // 1 week
  },
} as const;

// ============================================
// SIGNAL GUARDRAILS
// ============================================

export const SIGNAL_GUARDRAILS = {
  // What signals ARE NOT
  signal_is_not: [
    'truth',
    'risk',
    'cause',
    'recommendation',
    'prediction',
  ],
  
  // Required disclaimers for all signal views
  required_disclaimers: [
    'This indicates change in attention, not facts',
    'Signal confidence may vary',
    'Time-limited observation',
  ],
  
  // Signals can do
  signal_can: [
    'color_context',
    'trigger_attention',
    'indicate_timing',
  ],
  
  // Signals cannot do
  signal_cannot: [
    'start_decisions',
    'replace_data',
    'drive_conclusions',
  ],
} as const;

// ============================================
// SIGNAL DISPLAY RULES
// ============================================

export const SIGNAL_DISPLAY_RULES = {
  // Never show
  forbidden: [
    'headlines',
    'quotes',
    'text_content',
    'sentiment_scores',
    'opinion_markers',
  ],
  
  // Allowed visualizations
  allowed_viz: [
    'sparkline',
    'histogram',
    'heatmap_geo',
    'deviation_bar',
  ],
  
  // Required context
  required_context: [
    'baseline_comparison',
    'confidence_score',
    'time_boundary',
  ],
} as const;
