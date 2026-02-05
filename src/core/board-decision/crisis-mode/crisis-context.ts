/**
 * CRISIS CONTEXT SNAPSHOT
 * 
 * When crisis is declared, freeze the current state.
 * This changes requirement level, NOT principles.
 */

import type { CrisisContextSnapshot, CrisisSeverity, CrisisTimeHorizon } from './types';
import type { OrganizationType } from '../types';

/**
 * Declare crisis and create context snapshot
 */
export function declareCrisis(
  crisisId: string,
  reason: string,
  severity: CrisisSeverity,
  declaredBy: string,
  scope: {
    geo: string;
    population_affected: string | number;
    organization_type?: OrganizationType;
    time_horizon: CrisisTimeHorizon;
  },
  triggerIndicators: CrisisContextSnapshot['trigger_indicators'],
  baselineMetrics: Record<string, number | string>
): CrisisContextSnapshot {
  const now = new Date().toISOString();
  
  return {
    crisis_id: crisisId,
    declared_at: now,
    declared_by: declaredBy,
    reason,
    severity,
    scope,
    trigger_indicators: triggerIndicators,
    baseline_snapshot: {
      key_metrics: baselineMetrics,
      captured_at: now,
    },
    status: 'active',
  };
}

/**
 * Escalate crisis severity
 */
export function escalateCrisis(
  crisis: CrisisContextSnapshot,
  newSeverity: CrisisSeverity,
  reason: string
): CrisisContextSnapshot {
  if (crisis.status !== 'active') {
    throw new Error('Cannot escalate resolved crisis');
  }
  
  // Severity can only increase
  const severityOrder: CrisisSeverity[] = ['elevated', 'high', 'critical', 'extreme'];
  const currentIndex = severityOrder.indexOf(crisis.severity);
  const newIndex = severityOrder.indexOf(newSeverity);
  
  if (newIndex <= currentIndex) {
    throw new Error('Can only escalate to higher severity');
  }
  
  return {
    ...crisis,
    severity: newSeverity,
    status: 'escalated',
    reason: `${crisis.reason} → Escalated: ${reason}`,
  };
}

/**
 * Resolve crisis
 */
export function resolveCrisis(
  crisis: CrisisContextSnapshot,
  resolutionReason: string
): CrisisContextSnapshot {
  if (crisis.status === 'resolved') {
    throw new Error('Crisis already resolved');
  }
  
  return {
    ...crisis,
    status: 'resolved',
    resolved_at: new Date().toISOString(),
    resolution_reason: resolutionReason,
  };
}

/**
 * Calculate crisis duration
 */
export function calculateCrisisDuration(crisis: CrisisContextSnapshot): number {
  const start = new Date(crisis.declared_at).getTime();
  const end = crisis.resolved_at 
    ? new Date(crisis.resolved_at).getTime()
    : Date.now();
  
  return Math.round((end - start) / (1000 * 60 * 60)); // hours
}

/**
 * CRISIS CONTEXT MASTERPROMPT
 */
export const CRISIS_CONTEXT_MASTERPROMPT = `
You manage Crisis Context Snapshots.

WHEN CRISIS IS DECLARED:
1. Freeze current state
2. Mark time urgency
3. Change requirement level, NOT principles

CRISIS IS NOT EXCEPTION:
Crisis is a STATE, not an excuse.
You can make FASTER decisions.
You cannot make UNDOCUMENTED decisions.

WHAT CCS CAPTURES:
- Crisis ID and timestamp
- Reason and severity
- Scope (geo, population, time horizon)
- Trigger indicators
- Baseline metrics frozen

SEVERITY LEVELS:
- elevated: Heightened attention
- high: Significant impact expected
- critical: Immediate action required
- extreme: Existential threat

Severity can only INCREASE during active crisis.
This prevents downplaying.

RESOLUTION:
When crisis is resolved, reason must be stated.
Post-crisis audit is automatically triggered.
`;
