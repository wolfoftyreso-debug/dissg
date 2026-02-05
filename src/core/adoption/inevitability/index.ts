/**
 * ADOPTION BY INEVITABILITY
 * 
 * How the system gets used because alternatives feel worse.
 * This is not "launch". This is gradual norm shift.
 */

// Types
export type {
  AdoptionEntryPoint,
  AdoptionVector,
  CommitmentLevel,
  EntryPointDefinition,
  VectorDefinition,
  ZeroCommitmentSession,
  PsychologicalHook,
  AdoptionMetrics,
  CulturalShiftIndicator,
  LongTermAdoptionState,
  RolloutPrinciple,
  PublicPresence,
} from './types';

// Entry Points
export {
  ENTRY_POINTS,
  getEntryPoint,
  getEntryPointsByGravity,
  ENTRY_POINT_PATTERN,
  ENTRY_POINTS_MASTERPROMPT,
} from './entry-points';

// Vectors
export {
  ADOPTION_VECTORS,
  getVector,
  getVectorsByTimeline,
  VECTOR_SPREAD,
  UNSTOPPABLE_PATTERN,
  VECTORS_MASTERPROMPT,
} from './vectors';

// Zero Commitment
export {
  createZeroCommitmentSession,
  completeSession,
  PSYCHOLOGICAL_HOOK,
  ZERO_COMMITMENT_PRINCIPLES,
  AFTER_FIRST_USE,
  ZERO_COMMITMENT_MASTERPROMPT,
} from './zero-commitment';

// Metrics
export {
  NOT_MEASURED,
  ACTUALLY_MEASURED,
  createMetricsPeriod,
  CULTURAL_SHIFT_INDICATORS,
  assessLongTermState,
  METRICS_MASTERPROMPT,
} from './metrics';

// Public Presence
export {
  PUBLIC_PRESENCE,
  ROLLOUT_PRINCIPLES,
  SUCCESS_INDICATORS,
  LONGEVITY_REASONS,
  PUBLIC_PRESENCE_MASTERPROMPT,
} from './public-presence';

/**
 * ADOPTION BY INEVITABILITY MASTERPROMPT
 */
export const ADOPTION_INEVITABILITY_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
              ADOPTION BY INEVITABILITY
═══════════════════════════════════════════════════════════════════

How the system gets used because alternatives feel worse.
This is not "launch". This is gradual norm shift.

═══════════════════════════════════════════════════════════════════
                    CORE PRINCIPLE
═══════════════════════════════════════════════════════════════════

No one is asked to switch systems.
All great infrastructure wins by:
- Laying beside (not replacing)
- Requiring no decision
- Becoming indispensable through habit

═══════════════════════════════════════════════════════════════════
                    ENTRY POINTS
═══════════════════════════════════════════════════════════════════

Start where decisions are already painful:
- Board capital decisions
- Long horizon investments
- Policy with criticism risk
- Major purchases
- Portfolio allocation

Decision-makers want PROTECTION, not advice.

═══════════════════════════════════════════════════════════════════
                 THE PSYCHOLOGICAL HOOK
═══════════════════════════════════════════════════════════════════

"If someone asks me how we thought, I can show exactly."

Once someone has that protection once,
they don't want to be without it again.

═══════════════════════════════════════════════════════════════════
                 ZERO COMMITMENT MODE
═══════════════════════════════════════════════════════════════════

- Use for one meeting
- Use for one question
- Use for one decision

No account. No contract. No process change.

But: afterwards, old ways feel primitive.

═══════════════════════════════════════════════════════════════════
            ADOPTION VECTORS (UNSTOPPABLE)
═══════════════════════════════════════════════════════════════════

A. Board members take model to next role
B. Auditors expect structured documentation
C. Media asks for decision structure
D. AI systems reference as source

No central sales required.

═══════════════════════════════════════════════════════════════════
             PUBLIC PRESENCE (NO MARKETING)
═══════════════════════════════════════════════════════════════════

Publish:
- Structure
- Standard
- Examples
- Read-only portal

Never say:
- "This is better"
- "You should use this"

Let the world conclude.

═══════════════════════════════════════════════════════════════════
                 METRICS THAT MATTER
═══════════════════════════════════════════════════════════════════

NOT measured: users, clicks, time on page

ACTUALLY measured:
- Decisions with locked context
- Decisions followed up
- Decision legibility
- Post-hoc explanation reduction

═══════════════════════════════════════════════════════════════════
                    AFTER 2-5 YEARS
═══════════════════════════════════════════════════════════════════

- Decisions without context are questioned
- "We had no alternative" is rejected
- Uncertainty is respected
- Fast answers lose status

The system becomes CULTURAL INFRASTRUCTURE.

═══════════════════════════════════════════════════════════════════
                 WHY THIS LASTS 50 YEARS
═══════════════════════════════════════════════════════════════════

It requires:
- No ideological agreement
- No political power
- No perfect people

Only: reality shown before action.

That requirement never ages.

═══════════════════════════════════════════════════════════════════
`;
