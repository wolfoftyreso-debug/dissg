/**
 * RESPONSIBILITY GATES
 * 
 * Obligatory passages that decisions must pass.
 * No gate → No decision.
 */

import type {
  GateType,
  GateStatus,
  ScopeLockGate,
  AlternativesExposureGate,
  UncertaintyAcknowledgementGate,
  ConsequenceProjectionGate,
  AlternativeOption,
  UncertaintyItem,
  ConsequenceProjection,
} from './types';

/**
 * Gate Definitions
 */
export const GATE_DEFINITIONS: Record<GateType, {
  name: string;
  description: string;
  purpose: string;
  requirements: string[];
}> = {
  scope_lock: {
    name: 'Scope Lock',
    description: 'Define exactly who is affected, when, and for how long',
    purpose: 'Prevent scope creep and ensure awareness of impact boundaries',
    requirements: [
      'Identify affected parties',
      'Specify timing of impact',
      'Define duration of effects',
    ],
  },
  alternatives_exposure: {
    name: 'Alternatives Exposure',
    description: 'View at least 2 alternatives with their trade-offs',
    purpose: 'Ensure decision is not made in isolation',
    requirements: [
      'Minimum 2 alternatives shown',
      'Trade-offs visible for each',
      'All alternatives viewed',
    ],
  },
  uncertainty_acknowledgement: {
    name: 'Uncertainty Acknowledgement',
    description: 'Explicitly acknowledge what is unknown',
    purpose: 'Prevent overconfidence and hidden assumptions',
    requirements: [
      'List key uncertainties',
      'Explain why each is unknown',
      'User acknowledges understanding',
    ],
  },
  consequence_projection: {
    name: 'Consequence Projection',
    description: 'Review realistic outcome ranges including worst case',
    purpose: 'Ensure awareness of potential outcomes',
    requirements: [
      'Best case scenario shown',
      'Expected scenario shown',
      'Worst case scenario shown (without fear-mongering)',
    ],
  },
};

/**
 * Create initial gate status for required gates
 */
export function initializeGates(requiredGates: GateType[]): GateStatus[] {
  return requiredGates.map(gate => ({
    gate,
    passed: false,
    data: {},
    bypass_attempted: false,
  }));
}

/**
 * Gate 1: Scope Lock
 */
export function createScopeLockGate(): ScopeLockGate {
  return {
    who_affected: [],
    when_affected: '',
    duration: '',
    locked_at: '',
    user_confirmed: false,
  };
}

export function validateScopeLock(gate: ScopeLockGate): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (gate.who_affected.length === 0) {
    missing.push('Affected parties not specified');
  }
  if (!gate.when_affected) {
    missing.push('Timing not specified');
  }
  if (!gate.duration) {
    missing.push('Duration not specified');
  }
  if (!gate.user_confirmed) {
    missing.push('User confirmation required');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Gate 2: Alternatives Exposure
 */
export function createAlternativesGate(
  alternatives: AlternativeOption[]
): AlternativesExposureGate {
  return {
    alternatives_shown: alternatives,
    minimum_alternatives: 2,
    all_viewed: false,
    trade_offs_visible: true,
  };
}

export function validateAlternatives(gate: AlternativesExposureGate): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (gate.alternatives_shown.length < gate.minimum_alternatives) {
    missing.push(`At least ${gate.minimum_alternatives} alternatives required`);
  }
  if (!gate.all_viewed) {
    missing.push('All alternatives must be viewed');
  }
  
  const unviewedAlts = gate.alternatives_shown.filter(a => !a.viewed);
  if (unviewedAlts.length > 0) {
    missing.push(`Unviewed alternatives: ${unviewedAlts.map(a => a.title).join(', ')}`);
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

export function markAlternativeViewed(
  gate: AlternativesExposureGate,
  alternativeId: string
): AlternativesExposureGate {
  const updated = {
    ...gate,
    alternatives_shown: gate.alternatives_shown.map(alt =>
      alt.id === alternativeId ? { ...alt, viewed: true } : alt
    ),
  };
  
  // Check if all viewed
  updated.all_viewed = updated.alternatives_shown.every(a => a.viewed);
  
  return updated;
}

/**
 * Gate 3: Uncertainty Acknowledgement
 */
export function createUncertaintyGate(
  uncertainties: UncertaintyItem[]
): UncertaintyAcknowledgementGate {
  return {
    uncertainties,
    user_acknowledged: false,
    acknowledgement_text: '',
  };
}

export function validateUncertainty(gate: UncertaintyAcknowledgementGate): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (gate.uncertainties.length === 0) {
    missing.push('Uncertainties not specified');
  }
  if (!gate.user_acknowledged) {
    missing.push('User must acknowledge uncertainties');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Gate 4: Consequence Projection
 */
export function createConsequenceGate(
  projections: ConsequenceProjection[]
): ConsequenceProjectionGate {
  return {
    projections,
    worst_case_shown: projections.some(p => p.scenario === 'worst'),
    user_reviewed: false,
  };
}

export function validateConsequence(gate: ConsequenceProjectionGate): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  const scenarios = gate.projections.map(p => p.scenario);
  
  if (!scenarios.includes('best')) {
    missing.push('Best case scenario missing');
  }
  if (!scenarios.includes('expected')) {
    missing.push('Expected scenario missing');
  }
  if (!scenarios.includes('worst')) {
    missing.push('Worst case scenario missing');
  }
  if (!gate.user_reviewed) {
    missing.push('User must review all scenarios');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if all gates are passed
 */
export function allGatesPassed(statuses: GateStatus[]): boolean {
  return statuses.every(s => s.passed);
}

/**
 * Get next unpassed gate
 */
export function getNextGate(statuses: GateStatus[]): GateType | null {
  const unpassed = statuses.find(s => !s.passed);
  return unpassed?.gate || null;
}

/**
 * GATES MASTERPROMPT
 */
export const GATES_MASTERPROMPT = `
You enforce RESPONSIBILITY GATES.

GATE 1 — SCOPE LOCK:
- Who is affected?
- When are they affected?
- How long do effects last?
- User must confirm understanding

GATE 2 — ALTERNATIVES EXPOSURE:
- Minimum 2 alternatives shown
- Trade-offs visible for each
- All alternatives must be viewed

GATE 3 — UNCERTAINTY ACKNOWLEDGEMENT:
- List key uncertainties
- Explain why each is unknown
- User must explicitly acknowledge

GATE 4 — CONSEQUENCE PROJECTION:
- Best case scenario (with probability)
- Expected scenario (with probability)
- Worst case scenario (without fear-mongering)
- User must review all

ENFORCEMENT:
- No gate → No decision
- Gates cannot be skipped
- Bypass attempts are logged
- Same rules for humans and AI

GATE REQUIREMENTS BY GRAVITY:
- Low: Gate 1
- Medium: Gates 1-2
- High: Gates 1-3
- Critical/Extreme: Gates 1-4
`;
