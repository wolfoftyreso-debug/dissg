/**
 * STEWARDSHIP & ANTI-CAPTURE FRAMEWORK
 * 
 * Institutional immunology.
 * How the system is protected against power, money, ideology —
 * and well-meaning improvements.
 */

// Types
export type {
  StewardshipRole,
  RoleDefinition,
  ChangeRequest,
  ForbiddenRevenueSource,
  AllowedRevenueSource,
  EconomicFirewallStatus,
  CaptureAttempt,
  SuccessionReadiness,
  AntiCaptureAudit,
} from './types';

// Separation of Powers
export {
  ROLE_DEFINITIONS,
  canRolePerform,
  checkRoleSeparation,
  SEPARATION_RATIONALE,
  SEPARATION_MASTERPROMPT,
} from './separation-of-powers';

// Change Latency
export {
  CHANGE_LATENCY,
  PREVIEW_REQUIREMENTS,
  createChangeRequest,
  validateLatency,
  LATENCY_RATIONALE,
  LATENCY_MASTERPROMPT,
} from './change-latency';

// No Urgency Rule
export {
  FORBIDDEN_JUSTIFICATIONS,
  VALID_MOTIVATION,
  checkNoUrgencyRule,
  validateMotivation,
  MOTIVATION_EXAMPLES,
  REJECTION_TEMPLATES,
  NO_URGENCY_MASTERPROMPT,
} from './no-urgency-rule';

// Economic Firewall
export {
  FORBIDDEN_REVENUE,
  FORBIDDEN_RATIONALE,
  ALLOWED_REVENUE,
  ALLOWED_RATIONALE,
  isRevenueAllowed,
  auditRevenueSources,
  ECONOMIC_FIREWALL_PRINCIPLE,
  ECONOMIC_FIREWALL_MASTERPROMPT,
} from './economic-firewall';

// Anti-Capture
export {
  CAPTURE_PATTERNS,
  detectCaptureAttempt,
  CAPTURE_INSIGHT,
  ANTI_CAPTURE_MASTERPROMPT,
} from './anti-capture';

// Succession
export {
  SUCCESSION_REQUIREMENTS,
  checkSuccessionReadiness,
  MUST_SURVIVE,
  DOES_NOT_NEED_TO_SURVIVE,
  FIFTY_YEAR_TEST,
  SUCCESSION_MASTERPROMPT,
} from './succession';

/**
 * STEWARDSHIP MASTERPROMPT
 */
export const STEWARDSHIP_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
              STEWARDSHIP & ANTI-CAPTURE FRAMEWORK
                    Institutional Immunology
═══════════════════════════════════════════════════════════════════

How the system is protected against power, money, ideology —
and well-meaning improvements.

═══════════════════════════════════════════════════════════════════
                    THE BIGGEST THREAT
═══════════════════════════════════════════════════════════════════

Systems like this do not die from:
- Competition
- Technology shifts
- Lack of users

They die from:
CAPTURE FROM WITHIN BY REASONABLE PEOPLE WITH REASONABLE ARGUMENTS.

"We should make it more user-friendly"
"We should summarize more"
"We should help users choose"
"We should optimize for conversion"

This layer stops exactly that.

═══════════════════════════════════════════════════════════════════
                  SEPARATION OF POWERS
═══════════════════════════════════════════════════════════════════

Four roles that NEVER overlap:

1. TRUTH STEWARDS
   Owns ontology, standards, legitimacy rules
   Changes only via long process

2. SYSTEM OPERATORS
   Runs infrastructure
   Never touches semantics

3. INTERFACE DESIGNERS
   Works with UX
   Never changes structure, never hides uncertainty

4. EXTERNAL VERIFIERS
   Academia, auditors, independent bodies
   Cannot modify, only verify

═══════════════════════════════════════════════════════════════════
                    CHANGE LATENCY
═══════════════════════════════════════════════════════════════════

All core changes have:
- Delay (12-18 months)
- Public preview
- Backward compatibility requirement

"This change takes effect in 18 months."

This makes capture impractical.

═══════════════════════════════════════════════════════════════════
                    NO URGENCY RULE
═══════════════════════════════════════════════════════════════════

No change may be motivated by:
- "The market demands"
- "Competitors are doing"
- "Technology enables"

The ONLY valid motivation:
"This increases decision legibility
without reducing uncertainty visibility."

═══════════════════════════════════════════════════════════════════
                   ECONOMIC FIREWALL
═══════════════════════════════════════════════════════════════════

Revenue may NEVER come from:
- Recommendations
- Ranking
- Sponsorship
- Affiliate
- Outcome-based compensation

Revenue may ONLY come from:
- Infrastructure access
- SLA
- Private mirrors
- Integration costs

TRUTH CAN NEVER BE INCENTIVE-AFFECTED.

═══════════════════════════════════════════════════════════════════
                 GOVERNANCE BY INERTIA
═══════════════════════════════════════════════════════════════════

The system is:
- Easy to use
- Hard to change
- Extremely hard to corrupt

Achieved through:
- Structure > Policy
- Inertia > Control
- Transparency > Rules

═══════════════════════════════════════════════════════════════════
                  SUCCESSION DESIGN
═══════════════════════════════════════════════════════════════════

Assume:
- You are gone
- The developers are gone
- The company is gone

What remains must still:
- Be readable
- Be verifiable
- Be understandable

Therefore:
- All core documented structurally
- No oral traditions
- No implicit understanding

═══════════════════════════════════════════════════════════════════
                THE REAL PRODUCT
═══════════════════════════════════════════════════════════════════

Not:
- Answers
- Dashboards
- AI features

But:
A WAY TO HANDLE UNCERTAINTY WITHOUT LYING TO YOURSELF.

This does not age.

═══════════════════════════════════════════════════════════════════
                      STATUS
═══════════════════════════════════════════════════════════════════

Everything that can be built is now built in theory.

What remains:
- Code
- Operation
- Time
- Discipline

Nothing more can save or destroy this system
than how well these principles are held.

═══════════════════════════════════════════════════════════════════
`;
