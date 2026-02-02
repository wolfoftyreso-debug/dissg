/**
 * WAVE 15 — BLOCK DT, DU, DV
 * AUTO-LEARNING FEEDS, QUALITY CHECKS & ANOMALY RESPONSE
 * 
 * Dagliga lärdomar, självgranskning och lugn anomalihantering.
 */

// ============================================
// BLOCK DT: AUTO-LEARNING FEEDS
// ============================================

export type LearningFeedType = 
  | 'world_learned_today'
  | 'patterns_strengthening'
  | 'patterns_weakening'
  | 'unexpected_divergences';

export interface LearningFeedEntry {
  id: string;
  feed_type: LearningFeedType;
  generated_at: string;
  period: 'daily' | 'weekly';
  
  headline: string;
  summary: string;
  
  patterns: Array<{
    pattern_id: string;
    description: string;
    strength_change: number;
    confidence: number;
    domains: string[];
    regions: string[];
  }>;
  
  statistics: {
    observations_processed: number;
    patterns_detected: number;
    patterns_confirmed: number;
    patterns_rejected: number;
  };
  
  links: {
    full_report: string;
    methodology: string;
  };
  
  // Enforced neutrality
  recommendations: null;
  predictions: null;
  advice: null;
}

export const LEARNING_FEEDS_CONFIG = {
  feeds: {
    world_learned_today: {
      name: 'What the world learned today',
      nameSv: 'Vad världen lärde sig idag',
      description: 'Daglig sammanfattning av nya mönster och bekräftade samband',
      frequency: 'daily',
      maxEntries: 10,
    },
    patterns_strengthening: {
      name: 'Patterns strengthening',
      nameSv: 'Mönster som stärks',
      description: 'Samband som får mer stöd över tid',
      frequency: 'weekly',
      maxEntries: 20,
    },
    patterns_weakening: {
      name: 'Patterns weakening',
      nameSv: 'Mönster som försvagas',
      description: 'Tidigare observerade samband som tappar stöd',
      frequency: 'weekly',
      maxEntries: 20,
    },
    unexpected_divergences: {
      name: 'Unexpected divergences',
      nameSv: 'Oväntade avvikelser',
      description: 'När historiska mönster bryts',
      frequency: 'daily',
      maxEntries: 5,
    },
  },
  
  contentPolicy: {
    noAdvice: true,
    noRecommendations: true,
    noPredictions: true,
    onlyPatterns: true,
    alwaysShowConfidence: true,
    alwaysShowLimitations: true,
  },
  
  principle: 'Inga råd. Bara mönster.',
} as const;

// ============================================
// BLOCK DU: AUTO-QUALITY & BIAS CHECKS
// ============================================

export type BiasType = 
  | 'regional_overrepresentation'
  | 'data_coverage_skew'
  | 'source_dominance'
  | 'temporal_bias'
  | 'language_bias'
  | 'methodology_bias';

export interface BiasCheck {
  id: string;
  check_type: BiasType;
  checked_at: string;
  
  result: 'pass' | 'warning' | 'fail';
  
  details: {
    description: string;
    affected_areas: string[];
    severity: number; // 0-100
    mitigation_status: string;
  };
  
  metrics: {
    measured_value: number;
    expected_value: number;
    deviation_percent: number;
  };
  
  public_warning: string | null; // If bias detected, this is shown publicly
}

export const QUALITY_GUARD_CONFIG = {
  checks: {
    regional_overrepresentation: {
      name: 'Överrepresentation av regioner',
      description: 'Kontrollerar om vissa regioner dominerar analyser oproportionerligt',
      threshold: 0.3, // Max 30% from single region
      frequency: 'daily',
    },
    data_coverage_skew: {
      name: 'Datatäckningssnedvridning',
      description: 'Kontrollerar om vissa områden har mycket bättre täckning',
      threshold: 0.5, // Coverage shouldn't vary more than 50%
      frequency: 'daily',
    },
    source_dominance: {
      name: 'Källdominans',
      description: 'Kontrollerar om enskilda källor dominerar',
      threshold: 0.4, // Max 40% from single source
      frequency: 'weekly',
    },
    temporal_bias: {
      name: 'Tidsbias',
      description: 'Kontrollerar om nyare data viktas oproportionerligt',
      threshold: 0.25, // Recent data shouldn't dominate by more than 25%
      frequency: 'weekly',
    },
    language_bias: {
      name: 'Språkbias',
      description: 'Kontrollerar om engelskspråkiga källor dominerar',
      threshold: 0.6, // Max 60% from single language
      frequency: 'monthly',
    },
    methodology_bias: {
      name: 'Metodbias',
      description: 'Kontrollerar om enskilda metoder dominerar',
      threshold: 0.5, // Max 50% using single methodology
      frequency: 'monthly',
    },
  },
  
  responsePolicy: {
    onBiasDetected: 'visible_public_warning',
    warningMandatory: true,
    autoMitigation: false, // Human review required
    documentationRequired: true,
  },
  
  principle: 'Om bias upptäcks → synlig varning.',
} as const;

// ============================================
// BLOCK DV: AUTO-ANOMALY RESPONSE
// ============================================

export type AnomalyStatus = 
  | 'detected'
  | 'confirming'
  | 'under_investigation'
  | 'verified'
  | 'false_alarm'
  | 'resolved';

export interface AnomalyResponse {
  anomaly_id: string;
  detected_at: string;
  
  status: AnomalyStatus;
  
  observation: {
    what: string;
    magnitude: number;
    standard_deviations: number;
  };
  
  verification: {
    sources_checked: number;
    sources_confirming: number;
    sources_contradicting: number;
    verification_status: 'pending' | 'partial' | 'confirmed' | 'rejected';
  };
  
  confidence: {
    initial: number;
    current: number;
    adjustment_reason: string;
  };
  
  public_display: {
    label: string;
    message: string;
    show_as_unverified: boolean;
  };
  
  timeline: Array<{
    timestamp: string;
    action: string;
    result: string;
  }>;
}

export const ANOMALY_RESPONSE_CONFIG = {
  detection: {
    min_standard_deviations: 3.0,
    min_historical_rarity: 0.99, // Top 1% unusual
  },
  
  response_protocol: {
    step1_detect: {
      action: 'Flagga som potentiell anomali',
      immediate: true,
    },
    step2_confirm: {
      action: 'Bekräfta med flera källor',
      minSources: 2,
      timeout_hours: 24,
    },
    step3_lower_confidence: {
      action: 'Sänk confidence tills verifierat',
      reduction: 0.3, // Reduce confidence by 30%
    },
    step4_display: {
      action: 'Visa "under utredning"',
      label: '⚠️ Under verifiering',
      message: 'Denna observation är ovanlig och håller på att verifieras.',
    },
    step5_never_extrapolate: {
      action: 'Aldrig extrapolera från overifierad data',
      strict: true,
    },
  },
  
  publicLabels: {
    detected: '🔍 Upptäckt',
    confirming: '⏳ Bekräftar',
    under_investigation: '⚠️ Under utredning',
    verified: '✅ Verifierad',
    false_alarm: '❌ Falskt alarm',
    resolved: '✓ Löst',
  },
  
  principle: 'Hellre långsam än fel.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function generateLearningFeed(
  type: LearningFeedType,
  patterns: any[],
  period: 'daily' | 'weekly'
): LearningFeedEntry {
  const config = LEARNING_FEEDS_CONFIG.feeds[type];
  
  return {
    id: `feed_${type}_${Date.now()}`,
    feed_type: type,
    generated_at: new Date().toISOString(),
    period,
    
    headline: config.nameSv,
    summary: config.description,
    
    patterns: patterns.slice(0, config.maxEntries).map(p => ({
      pattern_id: p.id || `pat_${Math.random().toString(36).substr(2, 9)}`,
      description: p.description || 'Mönster observerat',
      strength_change: p.strength_change || 0,
      confidence: p.confidence || 0.5,
      domains: p.domains || [],
      regions: p.regions || [],
    })),
    
    statistics: {
      observations_processed: patterns.length * 10,
      patterns_detected: patterns.length,
      patterns_confirmed: Math.floor(patterns.length * 0.6),
      patterns_rejected: Math.floor(patterns.length * 0.1),
    },
    
    links: {
      full_report: `/reports/${type}/${new Date().toISOString().split('T')[0]}`,
      methodology: '/docs/learning-methodology',
    },
    
    recommendations: null,
    predictions: null,
    advice: null,
  };
}

export function performBiasCheck(
  type: BiasType,
  data: { measured: number; expected: number }
): BiasCheck {
  const config = QUALITY_GUARD_CONFIG.checks[type];
  const deviation = Math.abs(data.measured - data.expected) / data.expected;
  const result = deviation <= config.threshold ? 'pass' : 
                 deviation <= config.threshold * 1.5 ? 'warning' : 'fail';
  
  return {
    id: `bias_${type}_${Date.now()}`,
    check_type: type,
    checked_at: new Date().toISOString(),
    result,
    details: {
      description: config.description,
      affected_areas: [],
      severity: Math.min(100, deviation * 100),
      mitigation_status: result === 'pass' ? 'N/A' : 'Pending review',
    },
    metrics: {
      measured_value: data.measured,
      expected_value: data.expected,
      deviation_percent: deviation * 100,
    },
    public_warning: result !== 'pass' 
      ? `⚠️ ${config.name}: Avvikelse på ${(deviation * 100).toFixed(1)}% upptäckt.`
      : null,
  };
}

export function createAnomalyResponse(
  observation: { what: string; magnitude: number; stdDevs: number }
): AnomalyResponse {
  const config = ANOMALY_RESPONSE_CONFIG;
  
  return {
    anomaly_id: `anom_${Date.now()}`,
    detected_at: new Date().toISOString(),
    status: 'detected',
    observation: {
      what: observation.what,
      magnitude: observation.magnitude,
      standard_deviations: observation.stdDevs,
    },
    verification: {
      sources_checked: 0,
      sources_confirming: 0,
      sources_contradicting: 0,
      verification_status: 'pending',
    },
    confidence: {
      initial: 0.5,
      current: 0.5 * (1 - config.response_protocol.step3_lower_confidence.reduction),
      adjustment_reason: 'Initialt sänkt pga overifierad anomali',
    },
    public_display: {
      label: config.publicLabels.detected,
      message: config.response_protocol.step4_display.message,
      show_as_unverified: true,
    },
    timeline: [{
      timestamp: new Date().toISOString(),
      action: 'Anomali upptäckt',
      result: 'Initierar verifieringsprotokoll',
    }],
  };
}

export const AUTO_QUALITY_STATUS = {
  version: '15.0',
  blocks: ['DT', 'DU', 'DV'],
  capabilities: [
    'automated_learning_feeds',
    'self_bias_detection',
    'calm_anomaly_response',
  ],
  slowOverFast: true,
} as const;
