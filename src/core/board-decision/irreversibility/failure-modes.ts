/**
 * FAILURE MODES
 * 
 * How the system is ALLOWED to fail.
 * Correct failure direction.
 */

import type { FailureMode } from './types';

/**
 * The failure mode specification
 */
export const FAILURE_MODE_SPEC: FailureMode = {
  mode_id: 'FM-001',
  
  allowed_failures: {
    stop_accepting_decisions: true,
    require_more_context: true,
    become_slower: true,
  },
  
  forbidden_failures: {
    simplify: true,
    assume: true,
    guess: true,
    interpolate: true,
    extrapolate: true,
  },
};

/**
 * Check if failure mode is allowed
 */
export function isFailureModeAllowed(
  mode: keyof FailureMode['allowed_failures'] | keyof FailureMode['forbidden_failures']
): boolean {
  if (mode in FAILURE_MODE_SPEC.allowed_failures) {
    return true;
  }
  
  if (mode in FAILURE_MODE_SPEC.forbidden_failures) {
    return false;
  }
  
  // Unknown modes are forbidden
  return false;
}

/**
 * Handle system degradation
 */
export function handleDegradation(
  degradationType: 'data_quality' | 'processing_capacity' | 'connectivity' | 'unknown'
): {
  action: 'stop' | 'require_more' | 'slow_down';
  message: string;
} {
  switch (degradationType) {
    case 'data_quality':
      return {
        action: 'require_more',
        message: 'Data quality is insufficient. More context required before proceeding.',
      };
    
    case 'processing_capacity':
      return {
        action: 'slow_down',
        message: 'Processing capacity reduced. Operations will take longer.',
      };
    
    case 'connectivity':
      return {
        action: 'stop',
        message: 'Connectivity issues detected. Stopping acceptance of new decisions until resolved.',
      };
    
    case 'unknown':
    default:
      return {
        action: 'stop',
        message: 'Unknown degradation detected. Stopping acceptance of new decisions.',
      };
  }
}

/**
 * Validate proposed failure response
 */
export function validateFailureResponse(
  proposedResponse: string
): { valid: boolean; reason?: string } {
  const forbiddenResponses = [
    'use default',
    'assume',
    'guess',
    'interpolate',
    'extrapolate',
    'fill in',
    'make up',
    'estimate without data',
    'use placeholder',
  ];
  
  const responseLower = proposedResponse.toLowerCase();
  
  for (const forbidden of forbiddenResponses) {
    if (responseLower.includes(forbidden)) {
      return {
        valid: false,
        reason: `Response includes forbidden failure mode: "${forbidden}"`,
      };
    }
  }
  
  return { valid: true };
}

/**
 * Get correct failure direction
 */
export function getCorrectFailureDirection(): string {
  return `
When the system fails:

IT FAILS BY:
✓ Stopping acceptance of decisions
✓ Requiring more context
✓ Becoming slower

IT NEVER FAILS BY:
✗ Simplifying
✗ Assuming
✗ Guessing
✗ Interpolating
✗ Extrapolating

This is the correct failure direction.
The system becomes MORE demanding, not less.
`;
}

/**
 * FAILURE MODES MASTERPROMPT
 */
export const FAILURE_MODES_MASTERPROMPT = `
You enforce correct Failure Modes.

WHEN THE SYSTEM FAILS (technically, organizationally):

ALLOWED FAILURES:
✓ stop_accepting_decisions
✓ require_more_context  
✓ become_slower

FORBIDDEN FAILURES:
✗ simplify
✗ assume
✗ guess
✗ interpolate
✗ extrapolate

CORRECT FAILURE DIRECTION:
The system becomes MORE demanding when degraded.
Not less.

EXAMPLES:

LOW DATA QUALITY:
Wrong: "Using estimated values"
Right: "Cannot proceed. More data required."

PROCESSING ISSUES:
Wrong: "Simplified analysis complete"
Right: "Analysis delayed. Full processing pending."

UNCERTAINTY:
Wrong: "Based on likely assumptions..."
Right: "Cannot determine. Uncertainty too high."

WHY:
Most systems fail by becoming simpler, faster, more convenient.
This makes them dangerous when degraded.

This system fails by becoming stricter, slower, more demanding.
This makes it safe when degraded.

A bridge that fails by becoming weaker is dangerous.
A bridge that fails by becoming impassable is safe.

This system is the second kind.
`;
