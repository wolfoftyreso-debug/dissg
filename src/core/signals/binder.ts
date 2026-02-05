/**
 * SIGNAL BINDER
 * 
 * Signals must bind to domains, indexes, and decision graphs.
 * Unbound signals are discarded.
 */

import type { NormalizedSignal, SignalBinding, SignalDetection } from './types';

// ============================================
// BINDING RULES
// ============================================

interface BindingRule {
  topic_pattern: RegExp;
  domains: string[];
  indexes: string[];
  decision_graphs: string[];
}

const BINDING_RULES: BindingRule[] = [
  // Healthcare signals
  {
    topic_pattern: /healthcare|hospital|medical|health|doctor|nurse/i,
    domains: ['healthcare', 'health'],
    indexes: ['healthcare.system_load.v1', 'signals.media_volatility.v1'],
    decision_graphs: ['healthcare.capacity_check.v1'],
  },
  // Mental health signals
  {
    topic_pattern: /mental|anxiety|depression|stress|wellbeing/i,
    domains: ['health'],
    indexes: ['health.population_mental_load.v1', 'health.youth_wellbeing_pressure.v1'],
    decision_graphs: ['health.youth_wellbeing_pressure.v1'],
  },
  // Economic signals
  {
    topic_pattern: /economy|inflation|cost|price|housing|energy/i,
    domains: ['economy'],
    indexes: ['economy.cost_of_living_pressure.v1', 'economy.inflation_volatility.v1'],
    decision_graphs: ['economy.cost_of_living_pressure.v1'],
  },
  // Policy signals
  {
    topic_pattern: /policy|legislation|law|government|regulation/i,
    domains: ['signals'],
    indexes: ['signals.policy_change_frequency.v1'],
    decision_graphs: [],
  },
  // General attention
  {
    topic_pattern: /media|news|attention|crisis/i,
    domains: ['signals'],
    indexes: ['signals.media_volatility.v1'],
    decision_graphs: [],
  },
];

// ============================================
// BINDER
// ============================================

export function bindSignal(signal: NormalizedSignal): SignalBinding | null {
  if (!signal.is_valid) return null;
  
  const matchingRules = BINDING_RULES.filter(
    rule => rule.topic_pattern.test(signal.topic)
  );
  
  if (matchingRules.length === 0) {
    // Signal cannot be bound → discard
    return null;
  }
  
  // Aggregate bindings from all matching rules
  const domains = new Set<string>();
  const indexes = new Set<string>();
  const graphs = new Set<string>();
  
  for (const rule of matchingRules) {
    rule.domains.forEach(d => domains.add(d));
    rule.indexes.forEach(i => indexes.add(i));
    rule.decision_graphs.forEach(g => graphs.add(g));
  }
  
  // Calculate binding confidence based on match specificity
  const confidence = Math.min(1, matchingRules.length * 0.3 + 0.4);
  
  return {
    signal_id: signal.signal_id,
    bound_domains: [...domains],
    bound_indexes: [...indexes],
    bound_decision_graphs: [...graphs],
    binding_confidence: confidence,
  };
}

// ============================================
// BATCH OPERATIONS
// ============================================

export function bindSignals(signals: NormalizedSignal[]): SignalBinding[] {
  return signals
    .map(bindSignal)
    .filter((binding): binding is SignalBinding => binding !== null);
}

export function filterBoundSignals(signals: NormalizedSignal[]): NormalizedSignal[] {
  return signals.filter(s => bindSignal(s) !== null);
}

export function getSignalsForIndex(
  signals: NormalizedSignal[],
  indexId: string
): NormalizedSignal[] {
  return signals.filter(s => {
    const binding = bindSignal(s);
    return binding?.bound_indexes.includes(indexId);
  });
}

export function getSignalsForDomain(
  signals: NormalizedSignal[],
  domain: string
): NormalizedSignal[] {
  return signals.filter(s => {
    const binding = bindSignal(s);
    return binding?.bound_domains.includes(domain);
  });
}

// ============================================
// DETECTION → INDEX AGGREGATION
// ============================================

export function aggregateDetectionsForIndex(
  detections: SignalDetection[],
  signals: NormalizedSignal[],
  indexId: string
): {
  total_detections: number;
  avg_zscore: number;
  max_persistence_hours: number;
  severity_breakdown: Record<string, number>;
} {
  const relevantSignalIds = new Set(
    getSignalsForIndex(signals, indexId).map(s => s.signal_id)
  );
  
  const relevantDetections = detections.filter(
    d => relevantSignalIds.has(d.signal_id)
  );
  
  if (relevantDetections.length === 0) {
    return {
      total_detections: 0,
      avg_zscore: 0,
      max_persistence_hours: 0,
      severity_breakdown: { low: 0, medium: 0, high: 0 },
    };
  }
  
  const avgZscore = relevantDetections.reduce((sum, d) => sum + d.zscore, 0) / relevantDetections.length;
  const maxPersistence = Math.max(...relevantDetections.map(d => d.persistence_hours));
  
  const severityBreakdown = { low: 0, medium: 0, high: 0 };
  for (const d of relevantDetections) {
    severityBreakdown[d.severity]++;
  }
  
  return {
    total_detections: relevantDetections.length,
    avg_zscore: avgZscore,
    max_persistence_hours: maxPersistence,
    severity_breakdown: severityBreakdown,
  };
}
