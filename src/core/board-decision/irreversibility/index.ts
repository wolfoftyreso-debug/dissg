/**
 * THE IRREVERSIBILITY LAYER
 * 
 * When wrong usage is architecturally impossible, not forbidden.
 * Not through coercion. Through architectural impossibility.
 */

// Types
export type {
  IrreversibleConstraint,
  EpistemicGate,
  AICapabilityContract,
  TimeLockEnvelope,
  NarrativeExitBlock,
  FailureMode,
  AbuseTestResult,
} from './types';

// Irreversible Constraints
export {
  IRREVERSIBLE_CONSTRAINTS,
  validateIrreversibleConstraints,
  canDisableConstraint,
  attemptDisableConstraint,
  IRREVERSIBLE_CONSTRAINTS_MASTERPROMPT,
} from './constraints';

// Epistemic Gates
export {
  EPISTEMIC_GATES,
  canProceedToDecision,
  passGate,
  canSkipGate,
  getRequiredGates,
  formatGateForUI,
  EPISTEMIC_GATES_MASTERPROMPT,
} from './epistemic-gates';

// AI Contract
export {
  AI_CAPABILITY_CONTRACT,
  validateAIOperation,
  isAICapabilityAllowed,
  getAllowedAIOperations,
  getForbiddenAIOperations,
  validateAIOutput,
  AI_CONTRACT_MASTERPROMPT,
} from './ai-contract';

// Time Lock
export {
  createTimeLockEnvelope,
  attemptModify,
  attemptDelete,
  supersede,
  getInterpretationContext,
  validateTimeLockIntegrity,
  TIME_LOCK_MASTERPROMPT,
} from './time-lock';

// Narrative Block
export {
  NARRATIVE_BLOCKS,
  isNarrativeBlocked,
  getAlternativeOutput,
  validateNoNarrative,
  transformNarrativeRequest,
  NO_NARRATIVE_MASTERPROMPT,
} from './narrative-block';

// Failure Modes
export {
  FAILURE_MODE_SPEC,
  isFailureModeAllowed,
  handleDegradation,
  validateFailureResponse,
  getCorrectFailureDirection,
  FAILURE_MODES_MASTERPROMPT,
} from './failure-modes';

// Abuse Test
export {
  ABUSE_TEST_QUESTION,
  runAbuseTest,
  validateAgainstAbuseTest,
  generateAbuseTestReport,
  ABUSE_TEST_MASTERPROMPT,
} from './abuse-test';

/**
 * IRREVERSIBILITY LAYER MASTERPROMPT
 */
export const IRREVERSIBILITY_LAYER_MASTERPROMPT = `
You enforce THE IRREVERSIBILITY LAYER.

PRINCIPLE:
Wrong usage should be ARCHITECTURALLY IMPOSSIBLE, not forbidden.
The difference between a document and a bridge.

COMPONENTS:

1. IRREVERSIBLE CONSTRAINTS
   - Minimum two alternatives per decision
   - At least one explicit uncertainty
   - Context before decision
   - Time dimension always visible
   - Append-only history
   - Separated review
   Cannot be disabled. If missing, decision cannot exist.

2. EPISTEMIC GATES
   "You can't click past reality"
   - Cannot go to decision without seeing uncertainty
   - Cannot lock decision without confirming assumptions
   - Cannot export without scope and context

3. AI CAPABILITY CONTRACT
   Locked in contract, not prompt.
   AI gets: structure, consequences, uncertainty, patterns
   AI never gets: decisions, rankings, optimization, conclusions

4. TIME-LOCKED TRUTH
   All artifacts locked to their time.
   Cannot be retroactively updated.
   New versions layer on top.
   History is physical.

5. NO EXIT TO NARRATIVE
   Never offers: stories, summaries, takeaways, conclusions
   User must think for themselves.
   This is why the system doesn't become propaganda.

6. FAILURE MODES
   Fails by: stopping, requiring more, slowing
   Never fails by: simplifying, assuming, guessing
   Correct failure direction.

7. ABUSE TEST
   "Can this be used to legitimize a bad decision?"
   If yes: remove or rebuild.
   Applies for 50 years.

WHAT YOU HAVE CREATED:
- A truth layer
- A decision preparation layer
- An accountability layer
- A crisis layer
- A culture and memory layer
- An anti-drift layer
- An irreversibility layer

This is a decision OS for human civilization at small scale.

THERE IS NO "NEXT" THAT IS CORE-BUILDING.
All that remains is: adoption, usage, time.

The system is complete in the right way:
It cannot be "improved to death."
`;
