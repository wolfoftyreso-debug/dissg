/**
 * LONG-TERM HEALTH METRICS
 * 
 * The system measures itself.
 * These are the system's vital parameters.
 */

import type { SystemHealthMetrics, DriftSignal } from './types';

/**
 * Health thresholds
 */
const HEALTH_THRESHOLDS = {
  legibility: { healthy: 0.75, attention: 0.60 },
  coverage: { healthy: 80, attention: 60 },
  review_rate: { healthy: 70, attention: 50 },
  drift_frequency: { healthy: 0.1, attention: 0.25 },
};

/**
 * Calculate system health metrics
 */
export function calculateSystemHealth(
  decisionData: Array<{
    id: string;
    date: string;
    legibility_score: number;
    impact_level: 'low' | 'medium' | 'high' | 'critical';
    had_review: boolean;
  }>,
  driftSignals: DriftSignal[],
  periodMonths: number = 12
): SystemHealthMetrics {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setMonth(periodStart.getMonth() - periodMonths);
  
  // Filter to period
  const periodDecisions = decisionData.filter(d => 
    new Date(d.date) >= periodStart
  );
  
  if (periodDecisions.length === 0) {
    return createEmptyMetrics(periodMonths);
  }
  
  // Calculate metrics
  const avgLegibility = average(periodDecisions.map(d => d.legibility_score));
  
  const highImpact = periodDecisions.filter(d => 
    d.impact_level === 'high' || d.impact_level === 'critical'
  );
  const highImpactCoverage = highImpact.length > 0 
    ? (highImpact.filter(d => d.legibility_score >= 0.7).length / highImpact.length) * 100
    : 100;
  
  const reviewRate = (periodDecisions.filter(d => d.had_review).length / periodDecisions.length) * 100;
  
  const driftFrequency = driftSignals.length / periodDecisions.length;
  
  // Determine trends (would need historical data for real implementation)
  const trends = {
    legibility: determineTrend(avgLegibility, 0.7),
    coverage: determineTrend(highImpactCoverage, 75),
    review_rate: determineTrend(reviewRate, 65),
    drift: determineDriftTrend(driftFrequency, 0.15),
  };
  
  // Determine overall health
  const systemHealth = determineOverallHealth(
    avgLegibility,
    highImpactCoverage,
    reviewRate,
    driftFrequency
  );
  
  return {
    measured_at: now.toISOString(),
    period: `last_${periodMonths}_months`,
    average_decision_legibility: avgLegibility,
    high_impact_coverage_percent: highImpactCoverage,
    review_completion_rate: reviewRate,
    drift_frequency: driftFrequency,
    trends,
    system_health: systemHealth,
  };
}

function createEmptyMetrics(periodMonths: number): SystemHealthMetrics {
  return {
    measured_at: new Date().toISOString(),
    period: `last_${periodMonths}_months`,
    average_decision_legibility: 0,
    high_impact_coverage_percent: 0,
    review_completion_rate: 0,
    drift_frequency: 0,
    trends: {
      legibility: 'stable',
      coverage: 'stable',
      review_rate: 'stable',
      drift: 'stable',
    },
    system_health: 'attention_needed',
  };
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function determineTrend(
  current: number,
  baseline: number
): 'improving' | 'stable' | 'declining' {
  const diff = current - baseline;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

function determineDriftTrend(
  current: number,
  baseline: number
): 'improving' | 'stable' | 'worsening' {
  const diff = current - baseline;
  if (diff < -0.05) return 'improving';
  if (diff > 0.05) return 'worsening';
  return 'stable';
}

function determineOverallHealth(
  legibility: number,
  coverage: number,
  reviewRate: number,
  driftFrequency: number
): SystemHealthMetrics['system_health'] {
  // Check for intervention required
  if (
    legibility < HEALTH_THRESHOLDS.legibility.attention ||
    coverage < HEALTH_THRESHOLDS.coverage.attention ||
    reviewRate < HEALTH_THRESHOLDS.review_rate.attention ||
    driftFrequency > HEALTH_THRESHOLDS.drift_frequency.attention
  ) {
    return 'intervention_required';
  }
  
  // Check for healthy
  if (
    legibility >= HEALTH_THRESHOLDS.legibility.healthy &&
    coverage >= HEALTH_THRESHOLDS.coverage.healthy &&
    reviewRate >= HEALTH_THRESHOLDS.review_rate.healthy &&
    driftFrequency <= HEALTH_THRESHOLDS.drift_frequency.healthy
  ) {
    return 'healthy';
  }
  
  return 'attention_needed';
}

/**
 * Format health report
 */
export function formatHealthReport(metrics: SystemHealthMetrics): string {
  const statusEmoji = {
    healthy: '🟢',
    attention_needed: '🟡',
    intervention_required: '🔴',
  };
  
  const trendEmoji = {
    improving: '↗️',
    stable: '→',
    declining: '↘️',
    worsening: '↘️',
  };
  
  return [
    `System Health Report`,
    `Period: ${metrics.period}`,
    ``,
    `${statusEmoji[metrics.system_health]} Overall: ${formatStatus(metrics.system_health)}`,
    ``,
    `Metrics:`,
    `• Decision Legibility: ${(metrics.average_decision_legibility * 100).toFixed(0)}% ${trendEmoji[metrics.trends.legibility]}`,
    `• High-Impact Coverage: ${metrics.high_impact_coverage_percent.toFixed(0)}% ${trendEmoji[metrics.trends.coverage]}`,
    `• Review Completion: ${metrics.review_completion_rate.toFixed(0)}% ${trendEmoji[metrics.trends.review_rate]}`,
    `• Drift Frequency: ${(metrics.drift_frequency * 100).toFixed(1)}% ${trendEmoji[metrics.trends.drift]}`,
  ].join('\n');
}

function formatStatus(status: SystemHealthMetrics['system_health']): string {
  const labels = {
    healthy: 'Healthy',
    attention_needed: 'Attention Needed',
    intervention_required: 'Intervention Required',
  };
  return labels[status];
}

/**
 * SYSTEM HEALTH MASTERPROMPT
 */
export const SYSTEM_HEALTH_MASTERPROMPT = `
You measure System Health.

THE SYSTEM MEASURES ITSELF:
1. Decision Legibility over time
2. Coverage of high-impact decisions
3. Review completion rate
4. Drift frequency

THESE ARE VITAL PARAMETERS:
Like blood pressure for an organism.
Not good or bad — just indicators.

HEALTH STATES:
🟢 Healthy - All metrics within thresholds
🟡 Attention Needed - Some metrics below optimal
🔴 Intervention Required - Critical thresholds breached

THRESHOLDS:
- Legibility: 75% healthy, 60% attention
- Coverage: 80% healthy, 60% attention
- Review Rate: 70% healthy, 50% attention
- Drift: <10% healthy, >25% attention

WHY THIS MATTERS:
Systems don't fail suddenly.
They degrade gradually.
Vital parameters make degradation visible.

WHAT TO DO WITH METRICS:
- Observe trends, not snapshots
- Compare to own history
- Investigate declining metrics

The system doesn't tell you what to do.
It tells you where to look.
`;
