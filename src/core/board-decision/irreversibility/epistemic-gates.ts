/**
 * EPISTEMIC GATES
 * 
 * "You Can't Click Past Reality" Principle
 * UX designed so users cannot bypass epistemics.
 */

import type { EpistemicGate } from './types';

/**
 * The epistemic gates
 */
export const EPISTEMIC_GATES: EpistemicGate[] = [
  {
    gate_id: 'EG-001',
    gate_type: 'uncertainty_view',
    requires_active_engagement: true,
    can_be_skipped: false,
    required_acknowledgement: 'I have reviewed the documented uncertainties',
  },
  {
    gate_id: 'EG-002',
    gate_type: 'assumption_confirm',
    requires_active_engagement: true,
    can_be_skipped: false,
    required_acknowledgement: 'I confirm these assumptions are explicit and understood',
  },
  {
    gate_id: 'EG-003',
    gate_type: 'context_review',
    requires_active_engagement: true,
    can_be_skipped: false,
    required_acknowledgement: 'I have reviewed the decision context',
  },
  {
    gate_id: 'EG-004',
    gate_type: 'scope_acknowledge',
    requires_active_engagement: true,
    can_be_skipped: false,
    required_acknowledgement: 'I understand the scope and limitations of this decision',
  },
];

/**
 * Gate passage state
 */
interface GatePassageState {
  user_id: string;
  decision_id: string;
  gates_passed: Record<string, { passed_at: string; acknowledgement: string }>;
}

/**
 * Check if user can proceed to decision
 */
export function canProceedToDecision(
  state: GatePassageState
): { can_proceed: boolean; blocking_gates: string[] } {
  const blockingGates: string[] = [];
  
  for (const gate of EPISTEMIC_GATES) {
    if (!state.gates_passed[gate.gate_id]) {
      blockingGates.push(gate.gate_id);
    }
  }
  
  return {
    can_proceed: blockingGates.length === 0,
    blocking_gates: blockingGates,
  };
}

/**
 * Pass through a gate
 */
export function passGate(
  state: GatePassageState,
  gateId: string,
  acknowledgement: string
): GatePassageState {
  const gate = EPISTEMIC_GATES.find(g => g.gate_id === gateId);
  
  if (!gate) {
    throw new Error(`Unknown gate: ${gateId}`);
  }
  
  // Verify acknowledgement matches expected
  if (acknowledgement !== gate.required_acknowledgement) {
    throw new Error(
      `Invalid acknowledgement. Expected: "${gate.required_acknowledgement}"`
    );
  }
  
  return {
    ...state,
    gates_passed: {
      ...state.gates_passed,
      [gateId]: {
        passed_at: new Date().toISOString(),
        acknowledgement,
      },
    },
  };
}

/**
 * Can a gate be skipped? (Always no)
 */
export function canSkipGate(_gateId: string): false {
  return false;
}

/**
 * Get gate requirements for a decision type
 */
export function getRequiredGates(
  decisionType: 'standard' | 'high_impact' | 'crisis'
): EpistemicGate[] {
  // All gates are always required
  // This function exists to make that explicit
  return [...EPISTEMIC_GATES];
}

/**
 * Format gate for UI
 */
export function formatGateForUI(gate: EpistemicGate): {
  title: string;
  description: string;
  action_label: string;
} {
  const formats: Record<EpistemicGate['gate_type'], { title: string; description: string; action_label: string }> = {
    uncertainty_view: {
      title: 'Review Uncertainties',
      description: 'Before proceeding, you must review what is uncertain about this decision.',
      action_label: 'I have reviewed the uncertainties',
    },
    assumption_confirm: {
      title: 'Confirm Assumptions',
      description: 'The following assumptions underlie this decision. Confirm you understand them.',
      action_label: 'I confirm these assumptions',
    },
    context_review: {
      title: 'Review Context',
      description: 'Review the context in which this decision is being made.',
      action_label: 'I have reviewed the context',
    },
    scope_acknowledge: {
      title: 'Acknowledge Scope',
      description: 'Understand the scope and limitations of this decision.',
      action_label: 'I understand the scope',
    },
  };
  
  return formats[gate.gate_type];
}

/**
 * EPISTEMIC GATES MASTERPROMPT
 */
export const EPISTEMIC_GATES_MASTERPROMPT = `
You enforce Epistemic Gates.

PRINCIPLE:
"You Can't Click Past Reality"

UX IS DESIGNED SO THAT:
- You cannot go to decision without seeing uncertainty
- You cannot lock decision without confirming assumptions
- You cannot export without scope and context

THESE ARE NOT UX CHOICES.
THEY ARE EPISTEMIC BARRIERS.

GATES:
1. Uncertainty View - Must see what is uncertain
2. Assumption Confirm - Must acknowledge assumptions
3. Context Review - Must see decision context
4. Scope Acknowledge - Must understand limitations

EACH GATE REQUIRES:
- Active engagement (not just clicking "OK")
- Specific acknowledgement text
- Cannot be skipped

WHY:
Most systems let users click through to what they want.
This system requires users to see what is true.

THE DIFFERENCE:
Convenience: Get to the answer fast
Epistemics: Understand the question first

This system chooses epistemics.
That choice is irreversible.
`;
