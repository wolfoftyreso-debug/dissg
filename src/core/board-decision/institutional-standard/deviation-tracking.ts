/**
 * DEVIATION TRACKING
 * 
 * When deviating from DS-1, it must be OPEN.
 * No shaming. No punishing. Just visibility.
 * 
 * "Att avvika kräver att man gör det öppet"
 */

import type { DS1Standard, StandardDeviationReport } from './types';

/**
 * Record a deviation from DS-1 standard
 */
export function recordDeviation(
  decisionId: string,
  organizationId: string,
  requirement: keyof DS1Standard['requirements'],
  reason: string,
  acknowledgedBy: string,
  makePublic: boolean = true
): StandardDeviationReport {
  return {
    decision_id: decisionId,
    organization_id: organizationId,
    deviations: [{
      requirement,
      reason,
      acknowledged_by: acknowledgedBy,
      acknowledged_at: new Date().toISOString(),
    }],
    is_public: makePublic,
  };
}

/**
 * Add deviation to existing report
 */
export function addDeviation(
  report: StandardDeviationReport,
  requirement: keyof DS1Standard['requirements'],
  reason: string,
  acknowledgedBy: string
): StandardDeviationReport {
  return {
    ...report,
    deviations: [
      ...report.deviations,
      {
        requirement,
        reason,
        acknowledged_by: acknowledgedBy,
        acknowledged_at: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Validate deviation report
 * Must have reason and acknowledgement for each deviation
 */
export function validateDeviationReport(
  report: StandardDeviationReport
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (let i = 0; i < report.deviations.length; i++) {
    const deviation = report.deviations[i];
    
    if (!deviation.reason || deviation.reason.trim() === '') {
      errors.push(`Deviation ${i + 1}: Reason required`);
    }
    
    if (!deviation.acknowledged_by || deviation.acknowledged_by.trim() === '') {
      errors.push(`Deviation ${i + 1}: Acknowledgement required`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Summarize organization deviations
 */
export function summarizeDeviations(
  reports: StandardDeviationReport[]
): {
  total_deviations: number;
  by_requirement: Record<string, number>;
  most_common: string[];
} {
  const byRequirement: Record<string, number> = {};
  let total = 0;
  
  for (const report of reports) {
    for (const deviation of report.deviations) {
      total++;
      byRequirement[deviation.requirement] = (byRequirement[deviation.requirement] || 0) + 1;
    }
  }
  
  const mostCommon = Object.entries(byRequirement)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([req, _]) => req);
  
  return {
    total_deviations: total,
    by_requirement: byRequirement,
    most_common: mostCommon,
  };
}

/**
 * DEVIATION TRACKING MASTERPROMPT
 */
export const DEVIATION_TRACKING_MASTERPROMPT = `
You track deviations from DS-1 standard.

DESIGN PRINCIPLE:
Deviating requires doing it OPENLY.
That's enough to change behavior.

WHAT YOU TRACK:
- Which requirement was not met
- Why (stated reason)
- Who acknowledged
- When

WHAT YOU DO NOT DO:
- Shame
- Punish
- Rank

VISIBILITY RULE:
All deviations are public by default.
Organizations can choose to make them private.
But the choice to hide is itself visible.

WHY THIS WORKS:
- No moral lecturing
- No certification to lose
- Just: "We deviated from standard, here's why"

This creates:
- Honest documentation
- Clear patterns
- Cultural shift

Decisions without context become unprofessional.
Not because we said so.
Because everyone can see the difference.
`;
