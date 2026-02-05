/**
 * NEWS SIGNAL ENGINE
 * 
 * News data is signal, not truth.
 * We don't answer "What does this mean?"
 * We answer "This is happening more often / faster / wider than normal."
 * 
 * This is gold for AI agents.
 */

/**
 * NEWS SIGNAL TYPES
 */
export type NewsSignalType = 
  | 'frequency'        // How often is X mentioned?
  | 'tempo'            // Is mention rate increasing/decreasing?
  | 'spread'           // Which regions mention X?
  | 'volatility';      // How erratic is coverage?

/**
 * NEWS SIGNAL MEASUREMENT
 */
export interface NewsSignalMeasurement {
  readonly signal_id: string;
  readonly signal_type: NewsSignalType;
  readonly topic: string;
  readonly measured_at: string;
  readonly period_start: string;
  readonly period_end: string;
  
  // Raw signal values
  readonly current_value: number;
  readonly baseline_value: number;
  readonly normal_range: { min: number; max: number };
  
  // Computed assessments
  readonly deviation_from_normal: number;  // Standard deviations
  readonly trend_direction: 'increasing' | 'decreasing' | 'stable';
  readonly trend_acceleration: number;     // Rate of change
  
  // Geographic spread
  readonly regions_detected: readonly string[];
  readonly geographic_concentration: number;  // 0-1, 1 = concentrated, 0 = widespread
  
  // Source quality
  readonly source_count: number;
  readonly source_diversity: number;  // 0-1
}

/**
 * NEWS-BASED INDEX
 */
export interface NewsBasedIndex {
  readonly index_id: string;
  readonly name: string;
  readonly description: string;
  readonly signal_types: readonly NewsSignalType[];
  readonly topics_tracked: readonly string[];
  readonly update_frequency: 'hourly' | 'daily' | 'weekly';
  readonly methodology: string;
}

/**
 * NEWS INDEX REGISTRY
 */
export const NEWS_INDICES: Record<string, NewsBasedIndex> = {
  policy_volatility: {
    index_id: 'policy_volatility',
    name: 'Policy Volatility Index',
    description: 'Measures rate of policy-related news frequency changes',
    signal_types: ['frequency', 'volatility', 'tempo'],
    topics_tracked: ['policy', 'regulation', 'law', 'government', 'legislation'],
    update_frequency: 'daily',
    methodology: 'Rolling 7-day standard deviation of daily policy mention counts',
  },
  media_attention: {
    index_id: 'media_attention',
    name: 'Media Attention Index',
    description: 'Tracks topic salience in news coverage',
    signal_types: ['frequency', 'spread'],
    topics_tracked: ['configurable'],
    update_frequency: 'hourly',
    methodology: 'Normalized mention frequency across source types',
  },
  event_frequency: {
    index_id: 'event_frequency',
    name: 'Event Frequency Index',
    description: 'Counts significant events by category',
    signal_types: ['frequency', 'tempo'],
    topics_tracked: ['events', 'incidents', 'announcements'],
    update_frequency: 'daily',
    methodology: 'Event detection and classification count',
  },
  narrative_instability: {
    index_id: 'narrative_instability',
    name: 'Narrative Instability Index',
    description: 'Measures how rapidly dominant narratives change',
    signal_types: ['volatility', 'tempo'],
    topics_tracked: ['discourse', 'framing', 'narrative'],
    update_frequency: 'weekly',
    methodology: 'Semantic drift measurement in topic clusters',
  },
};

/**
 * NEWS SIGNAL ENGINE
 */
export class NewsSignalEngine {
  private measurements: Map<string, NewsSignalMeasurement[]> = new Map();
  
  /**
   * Record a signal measurement
   */
  recordSignal(measurement: NewsSignalMeasurement): void {
    const key = `${measurement.signal_type}:${measurement.topic}`;
    const existing = this.measurements.get(key) || [];
    this.measurements.set(key, [...existing, measurement].slice(-1000)); // Keep last 1000
  }
  
  /**
   * Get latest signal for topic
   */
  getLatestSignal(signalType: NewsSignalType, topic: string): NewsSignalMeasurement | null {
    const key = `${signalType}:${topic}`;
    const signals = this.measurements.get(key);
    if (!signals || signals.length === 0) return null;
    return signals[signals.length - 1];
  }
  
  /**
   * Assess if current signal is abnormal
   */
  isAbnormal(signal: NewsSignalMeasurement): AbnormalityAssessment {
    const deviations = Math.abs(signal.deviation_from_normal);
    
    if (deviations < 1) {
      return {
        is_abnormal: false,
        severity: 'normal',
        description: 'Within normal range',
      };
    } else if (deviations < 2) {
      return {
        is_abnormal: true,
        severity: 'notable',
        description: 'Outside typical range but not unusual',
      };
    } else if (deviations < 3) {
      return {
        is_abnormal: true,
        severity: 'significant',
        description: 'Significantly above/below normal',
      };
    } else {
      return {
        is_abnormal: true,
        severity: 'extreme',
        description: 'Extremely unusual level',
      };
    }
  }
  
  /**
   * Generate signal summary (what AI agents consume)
   */
  generateSummary(signalType: NewsSignalType, topic: string): SignalSummary | null {
    const signal = this.getLatestSignal(signalType, topic);
    if (!signal) return null;
    
    const abnormality = this.isAbnormal(signal);
    
    return {
      topic,
      signal_type: signalType,
      measured_at: signal.measured_at,
      current_vs_normal: this.formatComparison(signal),
      trend: this.formatTrend(signal),
      geographic_pattern: this.formatGeography(signal),
      assessment: abnormality,
      // What we say
      statement: this.generateStatement(signal, abnormality),
      // What we DON'T say
      not_provided: [
        'Interpretation of meaning',
        'Prediction of future development',
        'Causal explanation',
        'Recommendation',
      ],
    };
  }
  
  private formatComparison(signal: NewsSignalMeasurement): string {
    const ratio = signal.current_value / signal.baseline_value;
    if (ratio > 1.5) return 'Much higher than normal';
    if (ratio > 1.2) return 'Higher than normal';
    if (ratio > 0.8) return 'Within normal range';
    if (ratio > 0.5) return 'Lower than normal';
    return 'Much lower than normal';
  }
  
  private formatTrend(signal: NewsSignalMeasurement): string {
    if (signal.trend_direction === 'stable') return 'Stable';
    const speed = Math.abs(signal.trend_acceleration);
    const direction = signal.trend_direction === 'increasing' ? 'Increasing' : 'Decreasing';
    if (speed > 0.5) return `${direction} rapidly`;
    if (speed > 0.2) return `${direction} moderately`;
    return `${direction} slowly`;
  }
  
  private formatGeography(signal: NewsSignalMeasurement): string {
    if (signal.regions_detected.length === 0) return 'No geographic data';
    if (signal.geographic_concentration > 0.8) {
      return `Concentrated in ${signal.regions_detected[0]}`;
    }
    if (signal.geographic_concentration > 0.5) {
      return `Primarily ${signal.regions_detected.slice(0, 3).join(', ')}`;
    }
    return `Widespread across ${signal.regions_detected.length} regions`;
  }
  
  private generateStatement(
    signal: NewsSignalMeasurement, 
    abnormality: AbnormalityAssessment
  ): string {
    const topic = signal.topic;
    const comparison = this.formatComparison(signal);
    const trend = this.formatTrend(signal).toLowerCase();
    const geography = this.formatGeography(signal).toLowerCase();
    
    if (abnormality.severity === 'normal') {
      return `Coverage of "${topic}" is within normal range and ${trend}.`;
    }
    
    return `Coverage of "${topic}" is ${comparison.toLowerCase()}, ${trend}, and ${geography}.`;
  }
}

/**
 * ABNORMALITY ASSESSMENT
 */
export interface AbnormalityAssessment {
  readonly is_abnormal: boolean;
  readonly severity: 'normal' | 'notable' | 'significant' | 'extreme';
  readonly description: string;
}

/**
 * SIGNAL SUMMARY (for AI agents)
 */
export interface SignalSummary {
  readonly topic: string;
  readonly signal_type: NewsSignalType;
  readonly measured_at: string;
  readonly current_vs_normal: string;
  readonly trend: string;
  readonly geographic_pattern: string;
  readonly assessment: AbnormalityAssessment;
  readonly statement: string;
  readonly not_provided: readonly string[];
}

/**
 * FUNDAMENTAL PRINCIPLE
 */
export const NEWS_SIGNAL_PRINCIPLE = {
  news_is: 'signal_not_truth',
  we_answer: 'This is happening more often / faster / wider than normal',
  we_never_answer: 'What does this mean?',
  value_for_ai_agents: 'exceptional',
} as const;
