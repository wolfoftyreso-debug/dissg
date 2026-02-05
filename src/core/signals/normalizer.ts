/**
 * SIGNAL NORMALIZER
 * 
 * Every signal must have baseline before it can be used.
 * No baseline = signal ignored.
 */

import type { RawSignal, NormalizedSignal } from './types';

// ============================================
// BASELINE STORE (in production: database)
// ============================================

interface BaselineData {
  topic: string;
  geo: string;
  mean: number;
  std: number;
  seasonal_factors: Record<number, number>; // month -> factor
  last_updated: string;
}

const BASELINE_STORE: Map<string, BaselineData> = new Map();

// ============================================
// NORMALIZER
// ============================================

export function normalizeSignal(raw: RawSignal): NormalizedSignal {
  const baselineKey = `${raw.topic}:${raw.geo}`;
  const baseline = BASELINE_STORE.get(baselineKey);
  
  // No baseline = invalid signal
  if (!baseline) {
    return {
      ...raw,
      baseline_mean: 0,
      baseline_std: 0,
      deviation_score: 0,
      seasonal_adjustment: 1,
      is_valid: false,
      validation_reason: 'NO_BASELINE',
    };
  }
  
  // Get seasonal adjustment
  const month = new Date(raw.timestamp).getMonth();
  const seasonalFactor = baseline.seasonal_factors[month] ?? 1;
  
  // Calculate z-score
  const adjustedCount = raw.count / seasonalFactor;
  const zscore = baseline.std > 0 
    ? (adjustedCount - baseline.mean) / baseline.std 
    : 0;
  
  return {
    ...raw,
    baseline_mean: baseline.mean,
    baseline_std: baseline.std,
    deviation_score: zscore,
    seasonal_adjustment: seasonalFactor,
    is_valid: true,
  };
}

// ============================================
// BASELINE MANAGEMENT
// ============================================

export function registerBaseline(data: BaselineData): void {
  const key = `${data.topic}:${data.geo}`;
  BASELINE_STORE.set(key, data);
}

export function hasBaseline(topic: string, geo: string): boolean {
  return BASELINE_STORE.has(`${topic}:${geo}`);
}

export function getBaseline(topic: string, geo: string): BaselineData | undefined {
  return BASELINE_STORE.get(`${topic}:${geo}`);
}

// ============================================
// BATCH NORMALIZATION
// ============================================

export function normalizeSignals(signals: RawSignal[]): NormalizedSignal[] {
  return signals.map(normalizeSignal);
}

export function filterValidSignals(signals: NormalizedSignal[]): NormalizedSignal[] {
  return signals.filter(s => s.is_valid);
}

// ============================================
// STATS
// ============================================

export const NORMALIZER_STATS = {
  get baselineCount() {
    return BASELINE_STORE.size;
  },
  get topics() {
    return [...new Set([...BASELINE_STORE.keys()].map(k => k.split(':')[0]))];
  },
} as const;
