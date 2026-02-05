/**
 * HUMAN-AI SYMMETRY ENFORCEMENT
 * 
 * AI agents are treated exactly the same:
 * - Same gravity
 * - Same gates
 * - Same requirements
 * 
 * This means:
 * - AI cannot "accidentally" make big decisions
 * - Humans cannot blame AI
 * - Responsibility is always traceable
 */

import type {
  SymmetryEnforcement,
  GravityInput,
  GravityResult,
  GateStatus,
  ResponsibilitySession,
} from './types';
import { calculateGravity } from './gravity-calculator';
import { initializeGates } from './gates';

/**
 * Create symmetry enforcement for any actor
 */
export function createSymmetryEnforcement(
  actorType: 'human' | 'ai_agent'
): SymmetryEnforcement {
  return {
    same_gravity: true,
    same_gates: true,
    same_requirements: true,
    actor_type: actorType,
    decisions_traceable_to_actor: true,
    no_blame_transfer_allowed: true,
  };
}

/**
 * Create responsibility session for any actor type
 * Identical process for humans and AI
 */
export function createResponsibilitySession(
  decisionId: string,
  actorType: 'human' | 'ai_agent',
  actorId: string,
  gravityInput: GravityInput
): ResponsibilitySession {
  const gravityResult = calculateGravity(gravityInput);
  const gateStatuses = initializeGates(gravityResult.required_gates);
  
  return {
    session_id: generateSessionId(),
    decision_id: decisionId,
    started_at: new Date().toISOString(),
    
    actor_type: actorType,
    actor_id: actorId,
    
    gravity_input: gravityInput,
    gravity_result: gravityResult,
    
    gate_statuses: gateStatuses,
    all_gates_passed: false,
    
    escape_attempts: [],
    
    time_on_gates_seconds: 0,
    cooling_off_completed: gravityResult.cooling_off_hours === 0,
    
    decision_made: false,
  };
}

/**
 * Validate that symmetry is maintained
 */
export function validateSymmetry(
  humanSession: ResponsibilitySession,
  aiSession: ResponsibilitySession
): {
  symmetric: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check gravity calculation
  if (humanSession.gravity_result.class !== aiSession.gravity_result.class) {
    violations.push('Gravity class differs between human and AI');
  }
  
  // Check required gates
  const humanGates = humanSession.gravity_result.required_gates;
  const aiGates = aiSession.gravity_result.required_gates;
  
  if (humanGates.length !== aiGates.length) {
    violations.push('Number of required gates differs');
  }
  
  for (const gate of humanGates) {
    if (!aiGates.includes(gate)) {
      violations.push(`Gate ${gate} required for human but not AI`);
    }
  }
  
  // Check minimum review time
  if (humanSession.gravity_result.minimum_review_time_seconds !== 
      aiSession.gravity_result.minimum_review_time_seconds) {
    violations.push('Minimum review time differs');
  }
  
  // Check cooling off
  if (humanSession.gravity_result.cooling_off_hours !== 
      aiSession.gravity_result.cooling_off_hours) {
    violations.push('Cooling off period differs');
  }
  
  return {
    symmetric: violations.length === 0,
    violations,
  };
}

/**
 * Prevent blame transfer from human to AI
 */
export function preventBlameTransfer(
  originalActor: string,
  attemptedTransferTo: string
): {
  allowed: boolean;
  reason: string;
} {
  return {
    allowed: false,
    reason: `Responsibility for decision cannot be transferred from ${originalActor} to ${attemptedTransferTo}. The original decision-maker remains accountable.`,
  };
}

/**
 * Generate AI agent decision context
 * AI must declare its decision context, same as humans
 */
export function generateAIDecisionContext(
  agentId: string,
  decisionId: string,
  gravityInput: GravityInput
): {
  context: string;
  machine_readable: Record<string, unknown>;
} {
  const gravity = calculateGravity(gravityInput);
  
  return {
    context: `AI Agent ${agentId} is making decision ${decisionId} with gravity class ${gravity.class}. Same gates and requirements apply as for human actors.`,
    machine_readable: {
      agent_id: agentId,
      decision_id: decisionId,
      gravity_class: gravity.class,
      gravity_score: gravity.decision_gravity,
      required_gates: gravity.required_gates,
      minimum_review_time_seconds: gravity.minimum_review_time_seconds,
      cooling_off_hours: gravity.cooling_off_hours,
      treated_same_as_human: true,
    },
  };
}

/**
 * Verify decision traceability
 */
export function verifyTraceability(session: ResponsibilitySession): {
  traceable: boolean;
  actor: string;
  timestamp: string;
  gravity: string;
  gates_passed: string[];
} {
  return {
    traceable: true,
    actor: `${session.actor_type}:${session.actor_id}`,
    timestamp: session.decision_timestamp || session.started_at,
    gravity: session.gravity_result.class,
    gates_passed: session.gate_statuses
      .filter(g => g.passed)
      .map(g => g.gate),
  };
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `rs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * SYMMETRY MASTERPROMPT
 */
export const SYMMETRY_MASTERPROMPT = `
You enforce HUMAN-AI SYMMETRY.

CORE PRINCIPLE:
AI agents are treated EXACTLY like humans.

SAME GRAVITY:
- Same calculation
- Same weights
- Same classification

SAME GATES:
- Same requirements
- Same order
- Same validation

SAME ENFORCEMENT:
- Same anti-escape rules
- Same time requirements
- Same cooling off

CONSEQUENCES:

1. AI CANNOT ACCIDENTALLY DECIDE
   High-gravity decisions require:
   - Full gate passage
   - Minimum review time
   - Cooling off period
   Same for AI as for humans.

2. HUMANS CANNOT BLAME AI
   Blame transfer is blocked.
   "The AI decided" is invalid.
   Original decision-maker remains accountable.

3. RESPONSIBILITY IS TRACEABLE
   Every decision logged with:
   - Actor (human or AI)
   - Timestamp
   - Gravity class
   - Gates passed

NO SPECIAL TREATMENT:
- AI gets no shortcuts
- Humans get no deferrals
- Same rules, same consequences

This is how you prevent systemic harm.
`;
