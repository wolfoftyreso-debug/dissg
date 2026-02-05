/**
 * LEGITIMACY ENGINE
 * 
 * Machine-driven legitimacy check.
 * legitimate = all(true)
 * No other logic allowed.
 */

import type { 
  Decision, 
  Context, 
  LegitimacyCheck, 
  LegitimacyStatus 
} from './types';

/**
 * Check legitimacy of a decision
 * This is the ONLY logic that determines legitimacy
 */
export function checkLegitimacy(
  decision: Decision,
  context: Context | null
): LegitimacyCheck {
  return {
    context_present: context !== null && context.context_id === decision.context_snapshot_id,
    alternatives_exposed: decision.alternatives.length >= 2,
    uncertainties_acknowledged: decision.uncertainties.length >= 1,
    scope_defined: decision.scope !== undefined && 
                   decision.scope.population_size !== undefined &&
                   decision.scope.reversibility !== undefined,
    time_defined: decision.time_horizon !== undefined &&
                  decision.time_horizon.start !== undefined,
  };
}

/**
 * Compute legitimacy status from check
 * legitimate = all(true)
 * No other logic allowed.
 */
export function computeLegitimacyStatus(check: LegitimacyCheck): LegitimacyStatus {
  const allTrue = 
    check.context_present &&
    check.alternatives_exposed &&
    check.uncertainties_acknowledged &&
    check.scope_defined &&
    check.time_defined;
  
  if (allTrue) {
    return 'legitimate';
  }
  
  // Check if partially complete
  const trueCount = Object.values(check).filter(Boolean).length;
  
  if (trueCount === 0) {
    return 'illegitimate';
  }
  
  return 'incomplete';
}

/**
 * Get missing requirements for legitimacy
 */
export function getMissingRequirements(check: LegitimacyCheck): string[] {
  const missing: string[] = [];
  
  if (!check.context_present) {
    missing.push('Context must be present');
  }
  if (!check.alternatives_exposed) {
    missing.push('At least 2 alternatives must be exposed');
  }
  if (!check.uncertainties_acknowledged) {
    missing.push('At least 1 uncertainty must be acknowledged');
  }
  if (!check.scope_defined) {
    missing.push('Scope must be defined');
  }
  if (!check.time_defined) {
    missing.push('Time horizon must be defined');
  }
  
  return missing;
}

/**
 * Validate decision structure
 */
export function validateDecisionStructure(
  decision: Decision
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!decision.decision_id) {
    errors.push('decision_id is required');
  }
  
  if (!decision.decision_type) {
    errors.push('decision_type is required');
  }
  
  if (decision.gravity_score < 0 || decision.gravity_score > 1) {
    errors.push('gravity_score must be between 0.0 and 1.0');
  }
  
  // Alternative rules (HARD)
  if (decision.alternatives.length < 2) {
    errors.push('alternatives.length must be >= 2');
  }
  
  // Uncertainty rules (HARD)
  if (decision.uncertainties.length < 1) {
    errors.push('uncertainties.length must be >= 1');
  }
  
  // Immutability check
  if (decision.locked_at) {
    // If locked, object must not be modified
    // This is enforced at the storage layer
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * LEGITIMACY ENGINE MASTERPROMPT
 */
export const LEGITIMACY_ENGINE_MASTERPROMPT = `
You enforce the LEGITIMACY ENGINE.

A DECISION IS LEGITIMATE IF AND ONLY IF:
  1. context_present = true
  2. alternatives_exposed = true (>= 2)
  3. uncertainties_acknowledged = true (>= 1)
  4. scope_defined = true
  5. time_defined = true

legitimate = all(true)
NO OTHER LOGIC ALLOWED.

HARD RULES:
- alternatives.length >= 2
- uncertainties.length >= 1
- locked_at → object becomes immutable
- legitimacy depends ONLY on structure, NEVER outcome

IF ANY CHECK FAILS:
→ Decision is incomplete or illegitimate
→ System must refuse to process until fixed

This is machine logic. No exceptions. No interpretation.
`;
