/**
 * QUALITY GUARDS AT VOLUME
 * 
 * Volume must never decrease legibility.
 */

import type { QualityGuard } from './types';

// ============================================================================
// THREE AUTOMATIC GUARDS
// ============================================================================

export const ENTROPY_CHECK: QualityGuard = {
  name: 'Entropy Check',
  description: 'Detects when CDPs become too similar',
  trigger: 'If two CDPs start looking "too alike"',
  action: 'flag',
};

export const UNCERTAINTY_DENSITY_MONITOR: QualityGuard = {
  name: 'Uncertainty Density Monitor',
  description: 'Ensures sufficient uncertainty documentation',
  trigger: 'Too few uncertainties documented',
  action: 'block',
};

export const LEGIBILITY_DRIFT_DETECTOR: QualityGuard = {
  name: 'Legibility Drift Detector',
  description: 'Monitors Decision Legibility Score over time',
  trigger: 'If DLS decreases over time',
  action: 'alert',
};

export const QUALITY_GUARDS: readonly QualityGuard[] = [
  ENTROPY_CHECK,
  UNCERTAINTY_DENSITY_MONITOR,
  LEGIBILITY_DRIFT_DETECTOR,
];

// ============================================================================
// GUARD PRINCIPLE
// ============================================================================

export const GUARD_PRINCIPLE = {
  rule: 'Volume must never decrease legibility',
  enforcement: 'automatic',
  override: 'none',
} as const;

// ============================================================================
// GUARD EXECUTION
// ============================================================================

export interface GuardResult {
  readonly guard: string;
  readonly passed: boolean;
  readonly score?: number;
  readonly threshold?: number;
  readonly details?: string;
}

export function executeGuards(
  cdpId: string,
  metrics: {
    entropy_score?: number;
    uncertainty_count?: number;
    dls_score?: number;
    dls_previous?: number;
  }
): { all_passed: boolean; results: GuardResult[] } {
  const results: GuardResult[] = [];
  
  // Entropy check
  if (metrics.entropy_score !== undefined) {
    results.push({
      guard: 'Entropy Check',
      passed: metrics.entropy_score > 0.3, // Minimum diversity threshold
      score: metrics.entropy_score,
      threshold: 0.3,
    });
  }
  
  // Uncertainty density
  if (metrics.uncertainty_count !== undefined) {
    results.push({
      guard: 'Uncertainty Density Monitor',
      passed: metrics.uncertainty_count >= 2, // Minimum 2 uncertainties
      score: metrics.uncertainty_count,
      threshold: 2,
    });
  }
  
  // Legibility drift
  if (metrics.dls_score !== undefined && metrics.dls_previous !== undefined) {
    const drift = metrics.dls_score - metrics.dls_previous;
    results.push({
      guard: 'Legibility Drift Detector',
      passed: drift >= -0.05, // Allow max 5% decrease
      score: drift,
      threshold: -0.05,
      details: drift < 0 ? 'DLS declining' : 'DLS stable or improving',
    });
  }
  
  return {
    all_passed: results.every(r => r.passed),
    results,
  };
}
