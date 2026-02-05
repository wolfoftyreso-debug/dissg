/**
 * GRAVITY GATES
 * 
 * If decision_gravity ≥ 0.7:
 * - AI must show all gates
 * - AI may not summarize
 * - AI may not respond in bullet points without structure
 */

import type { ClassifiedQuery, GravityGates, GateType } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         GATE REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════

const LOW_GRAVITY_GATES: readonly GateType[] = [
  'alternatives_exposed',
];

const MEDIUM_GRAVITY_GATES: readonly GateType[] = [
  'scope_lock',
  'alternatives_exposed',
  'uncertainty_acknowledgement',
];

const HIGH_GRAVITY_GATES: readonly GateType[] = [
  'scope_lock',
  'alternatives_exposed',
  'uncertainty_acknowledgement',
  'consequence_projection',
  'time_horizon_defined',
  'reversibility_assessed',
];

// ═══════════════════════════════════════════════════════════════════
//                         GATE CHECKER
// ═══════════════════════════════════════════════════════════════════

export interface GateCheckInput {
  readonly scope_defined?: boolean;
  readonly alternatives_count?: number;
  readonly uncertainties_count?: number;
  readonly consequences_projected?: boolean;
  readonly time_horizon_defined?: boolean;
  readonly reversibility_assessed?: boolean;
}

export function checkGravityGates(
  classification: ClassifiedQuery,
  input: GateCheckInput
): GravityGates {
  const gravityLevel = determineGravityLevel(classification.gravity);
  const requiredGates = getRequiredGates(gravityLevel);
  const passedGates = evaluateGates(input);
  
  return {
    gravity: gravityLevel,
    required_gates: requiredGates,
    passed_gates: passedGates,
    all_passed: requiredGates.every(g => passedGates.includes(g)),
  };
}

function determineGravityLevel(gravity: number): 'low' | 'medium' | 'high' {
  if (gravity >= 0.7) return 'high';
  if (gravity >= 0.4) return 'medium';
  return 'low';
}

function getRequiredGates(level: 'low' | 'medium' | 'high'): readonly GateType[] {
  switch (level) {
    case 'high': return HIGH_GRAVITY_GATES;
    case 'medium': return MEDIUM_GRAVITY_GATES;
    case 'low': return LOW_GRAVITY_GATES;
  }
}

function evaluateGates(input: GateCheckInput): GateType[] {
  const passed: GateType[] = [];
  
  if (input.scope_defined) {
    passed.push('scope_lock');
  }
  
  if (input.alternatives_count && input.alternatives_count >= 2) {
    passed.push('alternatives_exposed');
  }
  
  if (input.uncertainties_count && input.uncertainties_count >= 1) {
    passed.push('uncertainty_acknowledgement');
  }
  
  if (input.consequences_projected) {
    passed.push('consequence_projection');
  }
  
  if (input.time_horizon_defined) {
    passed.push('time_horizon_defined');
  }
  
  if (input.reversibility_assessed) {
    passed.push('reversibility_assessed');
  }
  
  return passed;
}

// ═══════════════════════════════════════════════════════════════════
//                         GATE DESCRIPTIONS
// ═══════════════════════════════════════════════════════════════════

export const GATE_DESCRIPTIONS: Record<GateType, string> = {
  scope_lock: 'Decision scope must be explicitly defined (who, what, where)',
  alternatives_exposed: 'At least 2 alternatives must be visible and symmetric',
  uncertainty_acknowledgement: 'Known uncertainties must be explicitly stated',
  consequence_projection: 'Potential consequences must be outlined without prediction',
  time_horizon_defined: 'Time horizon for decision impact must be specified',
  reversibility_assessed: 'Reversibility of the decision must be assessed',
};
