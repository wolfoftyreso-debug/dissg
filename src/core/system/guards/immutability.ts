/**
 * IMMUTABILITY GUARDS
 * 
 * Enforce immutability after lock.
 * 
 * When DecisionLockedEvent exists:
 * - Context → FROZEN
 * - Alternatives → FROZEN
 * - Uncertainties → FROZEN
 * - Evidence → FROZEN
 * 
 * Attempt to modify → 409 Conflict
 */

import { getEventStore } from '../events/event-store';
import { buildDecisionProjection } from '../read-model/projections';

// ═══════════════════════════════════════════════════════════════════
//                         IMMUTABILITY CHECK
// ═══════════════════════════════════════════════════════════════════

export interface ImmutabilityViolation {
  type: 'conflict';
  status: 409;
  message: string;
  locked_at: string;
}

/**
 * Check if a decision is locked (immutable)
 */
export async function checkDecisionLocked(
  decisionId: string
): Promise<ImmutabilityViolation | null> {
  const projection = await buildDecisionProjection(decisionId);
  
  if (!projection) {
    return null; // Decision doesn't exist
  }
  
  if (projection.status === 'locked') {
    return {
      type: 'conflict',
      status: 409,
      message: `Decision ${decisionId} is locked and cannot be modified`,
      locked_at: projection.locked_at!,
    };
  }
  
  return null; // Not locked, can be modified
}

/**
 * Guard that throws if decision is locked
 */
export async function guardDecisionMutable(decisionId: string): Promise<void> {
  const violation = await checkDecisionLocked(decisionId);
  
  if (violation) {
    throw new ImmutabilityError(violation);
  }
}

// ═══════════════════════════════════════════════════════════════════
//                         IMMUTABILITY ERROR
// ═══════════════════════════════════════════════════════════════════

export class ImmutabilityError extends Error {
  public readonly violation: ImmutabilityViolation;
  
  constructor(violation: ImmutabilityViolation) {
    super(violation.message);
    this.name = 'ImmutabilityError';
    this.violation = violation;
  }
}

// ═══════════════════════════════════════════════════════════════════
//                         VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Validate that a modification is allowed
 */
export async function validateModification(
  decisionId: string,
  operationType: string
): Promise<{ allowed: boolean; error?: ImmutabilityViolation }> {
  const violation = await checkDecisionLocked(decisionId);
  
  if (violation) {
    return { allowed: false, error: violation };
  }
  
  return { allowed: true };
}

/**
 * Get the frozen timestamp if decision is locked
 */
export async function getFrozenTimestamp(
  decisionId: string
): Promise<string | null> {
  const projection = await buildDecisionProjection(decisionId);
  return projection?.locked_at || null;
}

// ═══════════════════════════════════════════════════════════════════
//                         MASTERPROMPT
// ═══════════════════════════════════════════════════════════════════

export const IMMUTABILITY_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                    IMMUTABILITY GUARDS
═══════════════════════════════════════════════════════════════════

When DecisionLockedEvent exists, the following are FROZEN:

  ❄️ Context        → Cannot be modified
  ❄️ Alternatives   → Cannot be added, removed, or changed
  ❄️ Uncertainties  → Cannot be added, removed, or changed
  ❄️ Evidence       → Cannot be added, removed, or changed

ENFORCEMENT:

  Attempt to modify locked decision → 409 Conflict
  
  {
    "type": "conflict",
    "status": 409,
    "message": "Decision {id} is locked and cannot be modified",
    "locked_at": "timestamp"
  }

NO OVERRIDE. NO EXCEPTION. NO ADMIN BYPASS.

This is how history is preserved.

═══════════════════════════════════════════════════════════════════
`;
