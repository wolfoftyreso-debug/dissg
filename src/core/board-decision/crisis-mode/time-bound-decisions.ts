/**
 * TIME-BOUND CRISIS DECISIONS
 * 
 * All crisis decisions MUST have expiry.
 * No crisis decision can become permanent by default.
 */

import type { 
  CrisisDecision, 
  CrisisExtensionRequest, 
  CompressedDPD,
  CrisisFrictionCheckpoint 
} from './types';

/**
 * Default maximum extensions allowed
 */
const DEFAULT_MAX_EXTENSIONS = 2;

/**
 * Create time-bound crisis decision
 */
export function createCrisisDecision(
  decisionId: string,
  cdpd: CompressedDPD,
  decisionTaken: string,
  decidedBy: string[],
  effectiveFrom: string,
  expiresAt: string,
  contextSnapshotId: string
): CrisisDecision {
  return {
    decision_id: decisionId,
    cdpd_id: cdpd.cdpd_id,
    crisis_id: cdpd.crisis_id,
    decision_taken: decisionTaken,
    decided_at: new Date().toISOString(),
    decided_by: decidedBy,
    time_bounds: {
      effective_from: effectiveFrom,
      expires_at: expiresAt,
      review_required: true,
      max_extensions: DEFAULT_MAX_EXTENSIONS,
      current_extensions: 0,
    },
    acknowledgements: {
      uncertainty_acknowledged: false,
      uncertainty_acknowledged_by: '',
      time_limit_acknowledged: false,
      time_limit_acknowledged_by: '',
      impact_acknowledged: false,
      impact_acknowledged_by: '',
    },
    context_snapshot_id: contextSnapshotId,
    locked: false,
  };
}

/**
 * Generate friction checkpoints for crisis decision
 */
export function generateCrisisFrictionCheckpoints(
  cdpd: CompressedDPD
): CrisisFrictionCheckpoint[] {
  return [
    {
      checkpoint_type: 'uncertainty',
      prompt: `Acknowledge that the following remain unknown: ${cdpd.unknowns.join(', ')}`,
      acknowledged: false,
    },
    {
      checkpoint_type: 'time_limit',
      prompt: `This decision expires at ${cdpd.time_constraint.decision_deadline} and must be reviewed`,
      acknowledged: false,
    },
    {
      checkpoint_type: 'impact',
      prompt: `This decision affects the stated population under crisis conditions`,
      acknowledged: false,
    },
  ];
}

/**
 * Acknowledge friction checkpoint
 */
export function acknowledgeFrictionCheckpoint(
  decision: CrisisDecision,
  checkpointType: CrisisFrictionCheckpoint['checkpoint_type'],
  acknowledgedBy: string
): CrisisDecision {
  const now = new Date().toISOString();
  
  switch (checkpointType) {
    case 'uncertainty':
      return {
        ...decision,
        acknowledgements: {
          ...decision.acknowledgements,
          uncertainty_acknowledged: true,
          uncertainty_acknowledged_by: acknowledgedBy,
        },
      };
    case 'time_limit':
      return {
        ...decision,
        acknowledgements: {
          ...decision.acknowledgements,
          time_limit_acknowledged: true,
          time_limit_acknowledged_by: acknowledgedBy,
        },
      };
    case 'impact':
      return {
        ...decision,
        acknowledgements: {
          ...decision.acknowledgements,
          impact_acknowledged: true,
          impact_acknowledged_by: acknowledgedBy,
        },
      };
  }
}

/**
 * Check if all friction checkpoints are acknowledged
 */
export function allCheckpointsAcknowledged(decision: CrisisDecision): boolean {
  const { acknowledgements } = decision;
  return (
    acknowledgements.uncertainty_acknowledged &&
    acknowledgements.time_limit_acknowledged &&
    acknowledgements.impact_acknowledged
  );
}

/**
 * Lock crisis decision (only after all acknowledgements)
 */
export function lockCrisisDecision(
  decision: CrisisDecision
): { success: boolean; decision?: CrisisDecision; error?: string } {
  if (!allCheckpointsAcknowledged(decision)) {
    return {
      success: false,
      error: 'All friction checkpoints must be acknowledged before locking',
    };
  }
  
  return {
    success: true,
    decision: {
      ...decision,
      locked: true,
    },
  };
}

/**
 * Check if decision is expired
 */
export function isDecisionExpired(decision: CrisisDecision): boolean {
  return new Date(decision.time_bounds.expires_at) < new Date();
}

/**
 * Request extension for crisis decision
 */
export function requestExtension(
  extensionId: string,
  decision: CrisisDecision,
  requestedBy: string,
  newExpiry: string,
  justification: string,
  reassessment: CrisisExtensionRequest['reassessment']
): { success: boolean; request?: CrisisExtensionRequest; error?: string } {
  // Check if extensions are exhausted
  if (decision.time_bounds.current_extensions >= decision.time_bounds.max_extensions) {
    return {
      success: false,
      error: `Maximum extensions (${decision.time_bounds.max_extensions}) reached. Decision must be converted to permanent with full DPD.`,
    };
  }
  
  // Validate new expiry is in future
  if (new Date(newExpiry) <= new Date()) {
    return {
      success: false,
      error: 'New expiry must be in the future',
    };
  }
  
  const request: CrisisExtensionRequest = {
    extension_id: extensionId,
    decision_id: decision.decision_id,
    requested_at: new Date().toISOString(),
    requested_by: requestedBy,
    new_expiry: newExpiry,
    justification,
    reassessment,
    approved: false,
  };
  
  return { success: true, request };
}

/**
 * Approve extension
 */
export function approveExtension(
  decision: CrisisDecision,
  request: CrisisExtensionRequest,
  approvedBy: string
): { decision: CrisisDecision; request: CrisisExtensionRequest } {
  return {
    decision: {
      ...decision,
      time_bounds: {
        ...decision.time_bounds,
        expires_at: request.new_expiry,
        current_extensions: decision.time_bounds.current_extensions + 1,
      },
    },
    request: {
      ...request,
      approved: true,
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    },
  };
}

/**
 * TIME-BOUND DECISIONS MASTERPROMPT
 */
export const TIME_BOUND_DECISIONS_MASTERPROMPT = `
You manage time-bound crisis decisions.

ABSOLUTE RULE:
No crisis decision can become permanent by default.

EVERY CRISIS DECISION HAS:
- effective_from: When it starts
- expires_at: When it MUST be reviewed
- review_required: Always true
- max_extensions: Usually 2

FRICTION CHECKPOINTS (short but sharp):
1. Acknowledge uncertainties
2. Acknowledge time limit
3. Acknowledge impact

No long forms. No quick clicks.
Just: "I understand what I'm deciding under pressure."

EXTENSIONS:
- Maximum 2 extensions by default
- Each extension requires reassessment:
  - What unknowns were resolved?
  - What new unknowns emerged?
  - What risks materialized?
- After max extensions: convert to permanent with full DPD

WHY THIS MATTERS:
Temporary measures that become permanent are
the source of most institutional harm.

This system makes drift visible.
`;
