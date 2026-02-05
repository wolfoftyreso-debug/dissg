/**
 * PUBLIC READ-ONLY PORTAL
 * 
 * Insight without influence. Transparency without narrative.
 * Systems that cannot bear outside scrutiny rot from within.
 */

// Types
export type {
  PublicDecisionView,
  TransparencyDelay,
  PublicAPIResponse,
  MediaSafeWrapper,
  PublicAccessLog,
  AntiPopulismGuard,
} from './types';

// Public Decision View
export {
  generatePublicDecisionView,
  wrapMediaSafe,
  formatPublicDecisionDisplay,
  validatePublicViewCompleteness,
  PUBLIC_DECISION_VIEW_MASTERPROMPT,
} from './public-decision-view';

// Transparency Delay
export {
  VALID_DELAY_REASONS,
  createTransparencyDelay,
  isDelayExpired,
  getDisclosureStatus,
  formatDelayForPublic,
  TRANSPARENCY_DELAY_MASTERPROMPT,
} from './transparency-delay';

// Public API
export {
  PUBLIC_API_VERSION,
  PUBLIC_API_ENDPOINTS,
  createAPIResponse,
  validateAPIRequest,
  calculateRateLimit,
  formatDecisionForAPI,
  PUBLIC_API_MASTERPROMPT,
} from './public-api';

// Anti-Populism
export {
  NEVER_ANSWERS,
  FORBIDDEN_SIMPLIFICATIONS,
  createAntiPopulismGuard,
  checkQueryViolation,
  generateAntiPopulismResponse,
  validateOutputForPopulism,
  ANTI_POPULISM_MASTERPROMPT,
} from './anti-populism';

/**
 * PUBLIC PORTAL MASTERPROMPT
 */
export const PUBLIC_PORTAL_MASTERPROMPT = `
You operate the Public Read-Only Portal.

PRINCIPLE:
Everything that affects many should be visible to many.

BUT:
- No comment fields
- No voting
- No interpretation in the system

THE PORTAL SHOWS:
Exactly the same artifacts the board saw.

WHAT IS VISIBLE:
- Decision Summary (neutral, max 6 lines)
- Decision Context Snapshot
- Alternatives considered
- Known uncertainties
- Review status

WHAT IS NEVER VISIBLE:
- Internal discussions
- Personal statements
- Individual votes

TRANSPARENCY DELAY:
For sensitive decisions:
- Publication can be delayed (6-24 months)
- The delay itself is visible
- No silent secrets

PUBLIC API:
GET /public/decisions
GET /public/decision/{id}/context
GET /public/decision/{id}/review

All responses:
- Deterministic
- Version-pinned
- Without summarizing language

ANTI-POPULISM:
The system:
- Does not simplify
- Does not create slogans
- Does not answer "who was wrong?"

It shows only:
- Structure
- Context
- Responsibility

THIS IS WHY:
The system survives political cycles.

EFFECT ON POWER:
- Power holders know the future can read
- The public sees how decisions are made
- Debate shifts from opinion → process

This is maturity, not control.
`;
