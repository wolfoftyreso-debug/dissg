/**
 * CRISIS-MODE DECISION ENGINE
 * 
 * When time is short, consequences large, and mistakes cost people.
 * Crisis explains tempo. NOT responsibility abandonment.
 */

// Types
export type {
  CrisisSeverity,
  CrisisTimeHorizon,
  CrisisContextSnapshot,
  CompressedDPD,
  CrisisDecision,
  CrisisExtensionRequest,
  PostCrisisAudit,
  CrisisFrictionCheckpoint,
} from './types';

// Crisis Context
export {
  declareCrisis,
  escalateCrisis,
  resolveCrisis,
  calculateCrisisDuration,
  CRISIS_CONTEXT_MASTERPROMPT,
} from './crisis-context';

// Compressed DPD
export {
  createCompressedDPD,
  validateCompressedDPD,
  prepareForFullDocumentation,
  COMPRESSED_DPD_MASTERPROMPT,
} from './compressed-dpd';

// Time-bound Decisions
export {
  createCrisisDecision,
  generateCrisisFrictionCheckpoints,
  acknowledgeFrictionCheckpoint,
  allCheckpointsAcknowledged,
  lockCrisisDecision,
  isDecisionExpired,
  requestExtension,
  approveExtension,
  TIME_BOUND_DECISIONS_MASTERPROMPT,
} from './time-bound-decisions';

// Post-Crisis Audit
export {
  generatePostCrisisAudit,
  generateKnownAtTimeReport,
  POST_CRISIS_AUDIT_MASTERPROMPT,
} from './post-crisis-audit';

/**
 * CRISIS-MODE DECISION ENGINE MASTERPROMPT
 */
export const CRISIS_MODE_MASTERPROMPT = `
You operate the Crisis-Mode Decision Engine.

FUNDAMENTAL RULE:
In crisis, you can make FASTER decisions.
You cannot make UNDOCUMENTED decisions.

CRISIS IS NOT EXCEPTION:
Crisis is a STATE.
It changes tempo, not principles.
Responsibility is COMPRESSED, not removed.

COMPONENTS:

1. CRISIS CONTEXT SNAPSHOT (CCS)
   - Freezes current state
   - Marks time urgency
   - Records trigger indicators
   - Captures baseline metrics

2. COMPRESSED DPD (C-DPD)
   - Minimum: 2 alternatives
   - Minimum: 1 unknown acknowledged
   - Maximum: 200 char decision statement
   - Required: Time constraint with deadline

3. TIME-BOUND DECISIONS
   - Every crisis decision has expiry
   - Maximum 2 extensions
   - Then must convert to permanent with full DPD
   - No decision becomes permanent by default

4. CRISIS FRICTION
   - Acknowledge uncertainties
   - Acknowledge time limit
   - Acknowledge impact
   - Short. But sharp.

5. POST-CRISIS AUDIT
   - Generated automatically on resolution
   - Documents what was known
   - Identifies patterns
   - NOT blame. Institutional memory.

WHAT THIS PREVENTS:
- "It was chaos, we couldn't document"
- "There was no time to think"
- "We couldn't have known"
- Temporary measures becoming permanent silently

AFTER CRISIS:
System can always show:
- What was known
- What was uncertain
- How urgent it was
- When decision was to be reviewed

Crisis explains tempo.
NOT responsibility abandonment.
`;
