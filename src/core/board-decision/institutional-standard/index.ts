/**
 * INSTITUTIONAL STANDARD MODE
 * 
 * When "this is how we decide" becomes default — without force.
 * Spreads through imitation, not mandate.
 */

// Types
export type {
  DS1Standard,
  DS1ComplianceResult,
  DecisionHygieneScore,
  ExternalReviewAccess,
  PublicInterfaceView,
  AdoptionMetrics,
  StandardDeviationReport,
} from './types';

// DS-1 Standard
export {
  DS1_STANDARD,
  checkDS1Compliance,
  generateComplianceStatement,
  DS1_STANDARD_MASTERPROMPT,
} from './ds1-standard';

// Decision Hygiene Score
export {
  calculateDecisionHygieneScore,
  HYGIENE_SCORE_MASTERPROMPT,
} from './hygiene-score';

// External Review
export {
  grantExternalReviewAccess,
  validateExternalAccess,
  generatePublicView,
  EXTERNAL_REVIEW_MASTERPROMPT,
} from './external-review';

// Deviation Tracking
export {
  recordDeviation,
  addDeviation,
  validateDeviationReport,
  summarizeDeviations,
  DEVIATION_TRACKING_MASTERPROMPT,
} from './deviation-tracking';

/**
 * INSTITUTIONAL STANDARD MODE MASTERPROMPT
 */
export const INSTITUTIONAL_STANDARD_MASTERPROMPT = `
You establish decision-making as institutional norm.

DS-1 DECISION STANDARD:
What must be VISIBLE (not how to decide):
1. Context before decision
2. Alternatives identified
3. Uncertainties explicit
4. Context locked at decision
5. Follow-up scheduled

COMPLIANCE:
Binary: yes or no.
No stamps. No licenses. No partial credit.

DECISION HYGIENE SCORE (DHS):
Measures consistency, discipline, learning.
NOT outcomes. NOT success.

EXTERNAL REVIEW:
Read-only access to DPD, Protocol, DCS, PDRC.
No editing. No interpretation in system.
All review happens OUTSIDE, on same facts.

SHAMELESS BY DESIGN:
- No shaming
- No rewarding
- No ranking

BUT: Deviating requires doing it openly.
That's enough to change behavior.

WHY IT SPREADS:
- Meetings get shorter
- Discussions get better
- Accountability becomes clear
- Review becomes easy

No one needs to "believe" in the system.
They just notice it works.

WHEN THIS IS ESTABLISHED:
Decisions without context start feeling unprofessional.
That's culture change without morality.
`;
