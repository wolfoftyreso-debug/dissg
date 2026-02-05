/**
 * PUBLIC DECISION VIEW
 * 
 * Shows exactly what the board saw.
 * No internal discussions. No individual votes.
 */

import type { PublicDecisionView, MediaSafeWrapper } from './types';

/**
 * Generate public decision view from internal artifacts
 */
export function generatePublicDecisionView(
  decisionId: string,
  internalArtifacts: {
    dpd: {
      decision_statement: string;
      scope: { geo: string; population_affected: string | number; time_horizon: string };
      alternatives: Array<{ id: string; label: string; key_tradeoff: string }>;
      known_risks: string[];
      unknowns: string[];
      constraints: string[];
    };
    dcs: {
      irreversibility_level: 'low' | 'medium' | 'high' | 'extreme';
    };
    legibilityScore: number;
    reviewStatus: {
      scheduled: boolean;
      scheduled_date?: string;
      completed: boolean;
      completed_date?: string;
    };
  }
): PublicDecisionView {
  const { dpd, dcs, legibilityScore, reviewStatus } = internalArtifacts;
  
  return {
    decision_id: decisionId,
    summary: {
      statement: truncateToSixLines(dpd.decision_statement),
      scope: dpd.scope.geo,
      population_affected: String(dpd.scope.population_affected),
      time_horizon: dpd.scope.time_horizon,
    },
    context_snapshot: {
      what_was_known: dpd.known_risks,
      what_was_uncertain: dpd.unknowns,
      constraints: dpd.constraints,
    },
    alternatives_considered: dpd.alternatives.map(alt => ({
      id: alt.id,
      label: alt.label,
      key_tradeoff: alt.key_tradeoff,
    })),
    known_uncertainties: dpd.unknowns,
    irreversibility_level: dcs.irreversibility_level,
    decision_legibility_score: legibilityScore,
    review_status: reviewStatus,
    private_elements: null, // Explicitly null
  };
}

/**
 * Truncate to max 6 lines
 */
function truncateToSixLines(text: string): string {
  const lines = text.split('\n').slice(0, 6);
  return lines.join('\n');
}

/**
 * Wrap data in media-safe container
 * Ensures context cannot be stripped
 */
export function wrapMediaSafe<T>(
  data: T,
  context: {
    baseline: string;
    time_period: string;
    scope: string;
    uncertainties: string[];
  }
): MediaSafeWrapper<T> {
  return {
    data,
    required_context: context,
    inseparable: true,
  };
}

/**
 * Format for public display
 */
export function formatPublicDecisionDisplay(
  view: PublicDecisionView
): string {
  const lines = [
    `Decision: ${view.summary.statement.split('\n')[0]}`,
    `Scope: ${view.summary.scope} | ${view.summary.time_horizon}`,
    `Alternatives considered: ${view.alternatives_considered.length}`,
    `Known uncertainties: ${view.known_uncertainties.length}`,
    `Irreversibility: ${capitalizeFirst(view.irreversibility_level)}`,
    `Decision Legibility Score: ${view.decision_legibility_score.toFixed(2)}`,
    `Post-Decision Review: ${view.review_status.scheduled ? 'Scheduled' : 'Not scheduled'}`,
  ];
  
  return lines.join('\n');
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validate public view completeness
 */
export function validatePublicViewCompleteness(
  view: PublicDecisionView
): { complete: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!view.summary.statement) missing.push('Decision statement');
  if (!view.summary.scope) missing.push('Scope');
  if (view.alternatives_considered.length < 2) missing.push('Alternatives (minimum 2)');
  if (view.known_uncertainties.length === 0) missing.push('Uncertainties');
  
  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * PUBLIC DECISION VIEW MASTERPROMPT
 */
export const PUBLIC_DECISION_VIEW_MASTERPROMPT = `
You generate Public Decision Views.

WHAT THE PUBLIC SEES:
- Decision Summary (max 6 lines, neutral)
- Decision Context Snapshot
- Alternatives considered
- Known uncertainties
- Irreversibility level
- Decision Legibility Score
- Review status

WHAT THE PUBLIC NEVER SEES:
- Internal discussions
- Personal statements
- Individual votes
- Draft versions

THE PORTAL SHOWS:
Exactly the same artifacts the board saw.
Not a simplified version.
Not an interpretation.

MEDIA-SAFE DESIGN:
- Headlines cannot be ripped from context
- Numbers never appear without baseline
- Uncertainty is always visible

JOURNALISM BECOMES:
"Here is what they knew — here is what they chose"

NOT:
"Here is what they should have done"

THIS IS WHY:
The system survives political cycles.
`;
