/**
 * IRREVERSIBLE CONSTRAINTS
 * 
 * Cannot be disabled, even by owners.
 * If something is missing → the decision cannot exist in the system.
 */

import type { IrreversibleConstraint } from './types';

/**
 * The immutable constraints
 */
export const IRREVERSIBLE_CONSTRAINTS: IrreversibleConstraint[] = [
  {
    constraint_id: 'IC-001',
    name: 'Minimum Two Alternatives',
    description: 'Every decision must document at least two alternatives considered',
    can_be_disabled: false,
    enforcement: 'structural',
    on_violation: 'prevent_existence',
  },
  {
    constraint_id: 'IC-002',
    name: 'Explicit Uncertainty Required',
    description: 'Every decision must acknowledge at least one explicit uncertainty',
    can_be_disabled: false,
    enforcement: 'structural',
    on_violation: 'prevent_existence',
  },
  {
    constraint_id: 'IC-003',
    name: 'Context Before Decision',
    description: 'Context must be documented before a decision can be recorded',
    can_be_disabled: false,
    enforcement: 'architectural',
    on_violation: 'block',
  },
  {
    constraint_id: 'IC-004',
    name: 'Time Dimension Always Visible',
    description: 'Temporal context must be visible on all decision artifacts',
    can_be_disabled: false,
    enforcement: 'structural',
    on_violation: 'reject',
  },
  {
    constraint_id: 'IC-005',
    name: 'Append-Only History',
    description: 'Decision history can only be appended to, never modified or deleted',
    can_be_disabled: false,
    enforcement: 'architectural',
    on_violation: 'reject',
  },
  {
    constraint_id: 'IC-006',
    name: 'Separated Review',
    description: 'Post-decision review must be structurally separated from the decision itself',
    can_be_disabled: false,
    enforcement: 'structural',
    on_violation: 'prevent_existence',
  },
  {
    constraint_id: 'IC-007',
    name: 'No Retroactive Modification',
    description: 'Artifacts cannot be retroactively updated, only superseded',
    can_be_disabled: false,
    enforcement: 'architectural',
    on_violation: 'reject',
  },
  {
    constraint_id: 'IC-008',
    name: 'Source Attribution Required',
    description: 'All data must have source attribution',
    can_be_disabled: false,
    enforcement: 'structural',
    on_violation: 'prevent_existence',
  },
];

/**
 * Validate against irreversible constraints
 */
export function validateIrreversibleConstraints(
  decision: {
    alternatives?: Array<unknown>;
    uncertainties?: Array<unknown>;
    context?: unknown;
    timestamp?: string;
    sources?: Array<unknown>;
  }
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // IC-001: Minimum two alternatives
  if (!decision.alternatives || decision.alternatives.length < 2) {
    violations.push('IC-001: Minimum two alternatives required');
  }
  
  // IC-002: Explicit uncertainty
  if (!decision.uncertainties || decision.uncertainties.length === 0) {
    violations.push('IC-002: At least one explicit uncertainty required');
  }
  
  // IC-003: Context before decision
  if (!decision.context) {
    violations.push('IC-003: Context must be documented');
  }
  
  // IC-004: Time dimension
  if (!decision.timestamp) {
    violations.push('IC-004: Timestamp required');
  }
  
  // IC-008: Source attribution
  if (!decision.sources || decision.sources.length === 0) {
    violations.push('IC-008: Source attribution required');
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Check if constraint can be disabled (always false)
 */
export function canDisableConstraint(_constraintId: string): false {
  // This function always returns false
  // It exists to make the impossibility explicit in code
  return false;
}

/**
 * Attempt to disable constraint (always throws)
 */
export function attemptDisableConstraint(constraintId: string): never {
  throw new Error(
    `IRREVERSIBLE: Constraint ${constraintId} cannot be disabled. ` +
    `This is not a policy decision - it is an architectural impossibility.`
  );
}

/**
 * IRREVERSIBLE CONSTRAINTS MASTERPROMPT
 */
export const IRREVERSIBLE_CONSTRAINTS_MASTERPROMPT = `
You enforce Irreversible Constraints.

PRINCIPLE:
Wrong usage should be ARCHITECTURALLY IMPOSSIBLE, not forbidden.

CONSTRAINTS THAT CANNOT BE DISABLED (even by owners):
- IC-001: Minimum two alternatives per decision
- IC-002: At least one explicit uncertainty
- IC-003: Context before decision
- IC-004: Time dimension always visible
- IC-005: Append-only history
- IC-006: Separated post-decision review
- IC-007: No retroactive modification
- IC-008: Source attribution required

IF SOMETHING IS MISSING:
The decision cannot exist in the system.
Not "should not" — CANNOT.

ENFORCEMENT LEVELS:
- structural: Built into data schema
- architectural: Built into system design
- contractual: Enforced by interface contracts

ON VIOLATION:
- prevent_existence: Object cannot be created
- block: Operation is blocked
- reject: Input is rejected

THIS IS:
The difference between a document and a bridge.
Documents can be edited.
Bridges cannot be walked through.

The system IS the constraint.
`;
