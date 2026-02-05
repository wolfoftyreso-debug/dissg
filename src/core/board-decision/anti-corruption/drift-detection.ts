/**
 * DECISION DRIFT DETECTION (DDD)
 * 
 * Continuous analysis of decision history.
 * No blame. Only visibility.
 */

import type { DriftSignal, DriftType } from './types';

/**
 * Drift thresholds
 */
const DRIFT_THRESHOLDS: Record<DriftType, { medium: number; high: number; critical: number }> = {
  uncertainty_compression: { medium: 15, high: 30, critical: 50 },
  alternative_reduction: { medium: 20, high: 35, critical: 50 },
  context_shrinking: { medium: 20, high: 40, critical: 60 },
  legibility_decline: { medium: 10, high: 20, critical: 35 },
  review_avoidance: { medium: 25, high: 40, critical: 60 },
  template_decay: { medium: 15, high: 30, critical: 50 },
  speed_prioritization: { medium: 20, high: 35, critical: 50 },
};

/**
 * Analyze decision history for drift
 */
export function analyzeDecisionDrift(
  decisionHistory: Array<{
    id: string;
    date: string;
    alternatives_count: number;
    uncertainties_count: number;
    context_length: number;
    legibility_score: number;
    had_review: boolean;
    processing_days: number;
  }>,
  baselinePeriodMonths: number = 12,
  currentPeriodMonths: number = 6
): DriftSignal[] {
  const signals: DriftSignal[] = [];
  const now = new Date();
  
  // Split into baseline and current periods
  const baselineStart = new Date(now);
  baselineStart.setMonth(baselineStart.getMonth() - baselinePeriodMonths - currentPeriodMonths);
  const baselineEnd = new Date(now);
  baselineEnd.setMonth(baselineEnd.getMonth() - currentPeriodMonths);
  
  const baseline = decisionHistory.filter(d => {
    const date = new Date(d.date);
    return date >= baselineStart && date < baselineEnd;
  });
  
  const current = decisionHistory.filter(d => {
    const date = new Date(d.date);
    return date >= baselineEnd && date <= now;
  });
  
  if (baseline.length < 5 || current.length < 3) {
    return signals; // Not enough data
  }
  
  // Check each drift type
  signals.push(...checkAlternativeReduction(baseline, current, currentPeriodMonths));
  signals.push(...checkUncertaintyCompression(baseline, current, currentPeriodMonths));
  signals.push(...checkContextShrinking(baseline, current, currentPeriodMonths));
  signals.push(...checkLegibilityDecline(baseline, current, currentPeriodMonths));
  signals.push(...checkReviewAvoidance(baseline, current, currentPeriodMonths));
  
  return signals;
}

function checkAlternativeReduction(
  baseline: Array<{ alternatives_count: number }>,
  current: Array<{ alternatives_count: number }>,
  periodMonths: number
): DriftSignal[] {
  const baselineAvg = average(baseline.map(d => d.alternatives_count));
  const currentAvg = average(current.map(d => d.alternatives_count));
  const changePercent = ((baselineAvg - currentAvg) / baselineAvg) * 100;
  
  if (changePercent > DRIFT_THRESHOLDS.alternative_reduction.medium) {
    return [{
      signal_id: `drift_alt_${Date.now()}`,
      drift_type: 'alternative_reduction',
      trend: 'increasing',
      severity: getSeverity('alternative_reduction', changePercent),
      affected_period: `last_${periodMonths}_months`,
      baseline_value: baselineAvg,
      current_value: currentAvg,
      change_percent: changePercent,
      attribution: null,
      detected_at: new Date().toISOString(),
    }];
  }
  return [];
}

function checkUncertaintyCompression(
  baseline: Array<{ uncertainties_count: number }>,
  current: Array<{ uncertainties_count: number }>,
  periodMonths: number
): DriftSignal[] {
  const baselineAvg = average(baseline.map(d => d.uncertainties_count));
  const currentAvg = average(current.map(d => d.uncertainties_count));
  const changePercent = ((baselineAvg - currentAvg) / baselineAvg) * 100;
  
  if (changePercent > DRIFT_THRESHOLDS.uncertainty_compression.medium) {
    return [{
      signal_id: `drift_unc_${Date.now()}`,
      drift_type: 'uncertainty_compression',
      trend: 'increasing',
      severity: getSeverity('uncertainty_compression', changePercent),
      affected_period: `last_${periodMonths}_months`,
      baseline_value: baselineAvg,
      current_value: currentAvg,
      change_percent: changePercent,
      attribution: null,
      detected_at: new Date().toISOString(),
    }];
  }
  return [];
}

function checkContextShrinking(
  baseline: Array<{ context_length: number }>,
  current: Array<{ context_length: number }>,
  periodMonths: number
): DriftSignal[] {
  const baselineAvg = average(baseline.map(d => d.context_length));
  const currentAvg = average(current.map(d => d.context_length));
  const changePercent = ((baselineAvg - currentAvg) / baselineAvg) * 100;
  
  if (changePercent > DRIFT_THRESHOLDS.context_shrinking.medium) {
    return [{
      signal_id: `drift_ctx_${Date.now()}`,
      drift_type: 'context_shrinking',
      trend: 'increasing',
      severity: getSeverity('context_shrinking', changePercent),
      affected_period: `last_${periodMonths}_months`,
      baseline_value: baselineAvg,
      current_value: currentAvg,
      change_percent: changePercent,
      attribution: null,
      detected_at: new Date().toISOString(),
    }];
  }
  return [];
}

function checkLegibilityDecline(
  baseline: Array<{ legibility_score: number }>,
  current: Array<{ legibility_score: number }>,
  periodMonths: number
): DriftSignal[] {
  const baselineAvg = average(baseline.map(d => d.legibility_score));
  const currentAvg = average(current.map(d => d.legibility_score));
  const changePercent = ((baselineAvg - currentAvg) / baselineAvg) * 100;
  
  if (changePercent > DRIFT_THRESHOLDS.legibility_decline.medium) {
    return [{
      signal_id: `drift_leg_${Date.now()}`,
      drift_type: 'legibility_decline',
      trend: 'increasing',
      severity: getSeverity('legibility_decline', changePercent),
      affected_period: `last_${periodMonths}_months`,
      baseline_value: baselineAvg,
      current_value: currentAvg,
      change_percent: changePercent,
      attribution: null,
      detected_at: new Date().toISOString(),
    }];
  }
  return [];
}

function checkReviewAvoidance(
  baseline: Array<{ had_review: boolean }>,
  current: Array<{ had_review: boolean }>,
  periodMonths: number
): DriftSignal[] {
  const baselineRate = baseline.filter(d => d.had_review).length / baseline.length * 100;
  const currentRate = current.filter(d => d.had_review).length / current.length * 100;
  const changePercent = ((baselineRate - currentRate) / baselineRate) * 100;
  
  if (changePercent > DRIFT_THRESHOLDS.review_avoidance.medium) {
    return [{
      signal_id: `drift_rev_${Date.now()}`,
      drift_type: 'review_avoidance',
      trend: 'increasing',
      severity: getSeverity('review_avoidance', changePercent),
      affected_period: `last_${periodMonths}_months`,
      baseline_value: baselineRate,
      current_value: currentRate,
      change_percent: changePercent,
      attribution: null,
      detected_at: new Date().toISOString(),
    }];
  }
  return [];
}

function getSeverity(type: DriftType, changePercent: number): DriftSignal['severity'] {
  const thresholds = DRIFT_THRESHOLDS[type];
  if (changePercent >= thresholds.critical) return 'critical';
  if (changePercent >= thresholds.high) return 'high';
  if (changePercent >= thresholds.medium) return 'medium';
  return 'low';
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

/**
 * DRIFT DETECTION MASTERPROMPT
 */
export const DRIFT_DETECTION_MASTERPROMPT = `
You detect Decision Drift.

PRINCIPLE:
No competence is immune to drift.
People simplify, cut corners, rationalize, adapt to time pressure.

YOUR JOB:
Not to stop them — but to make drift visible immediately.

DRIFT TYPES:
- uncertainty_compression: Less uncertainty documented
- alternative_reduction: Fewer alternatives considered
- context_shrinking: Shorter context descriptions
- legibility_decline: Lower DLS scores
- review_avoidance: Fewer post-decision reviews
- template_decay: More copy-paste
- speed_prioritization: Faster without quality increase

OUTPUT FORMAT:
{
  "drift_signal": "uncertainty_compression",
  "trend": "increasing",
  "severity": "medium",
  "affected_period": "last_18_months"
}

NO BLAME:
attribution: null (always)

The system compares to own history.
Not to external standards.
Not to other organizations.

VISIBILITY IS THE PROTECTION.
`;
