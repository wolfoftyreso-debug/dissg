/**
 * DECISION LEGITIMACY CHARTER
 * 
 * The foundational law.
 * Everything else derives from this.
 */

// Types
export type {
  CharterVersion,
  CharterArticle,
  LegitimacyCriteria,
  AbsoluteProhibition,
  CharterCompliance,
  FailureMode,
  DecisionLegitimacyCharter,
} from './types';

// Charter v1
export {
  CHARTER_ARTICLES,
  DECISION_LEGITIMACY_CHARTER,
  getCharterAsText,
  getCharterHash,
} from './charter-v1';

// Compliance
export {
  checkLegitimacy,
  detectViolations,
  checkCompliance,
  determineFailureMode,
  generateComplianceReport,
  COMPLIANCE_MASTERPROMPT,
} from './compliance';

/**
 * CHARTER MASTERPROMPT
 */
export const CHARTER_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
              DECISION LEGITIMACY CHARTER v1.0
                 Public. Short. Non-negotiable.
═══════════════════════════════════════════════════════════════════

1. PURPOSE

This system exists to ensure that decisions affecting people, 
capital, or society are made with explicit context, visible 
uncertainty, and traceable responsibility.

It does not exist to recommend, persuade, optimize outcomes, 
or replace human judgment.

═══════════════════════════════════════════════════════════════════

2. SCOPE

This Charter applies to ALL:
- Decision artifacts
- Data structures
- Interfaces
- APIs
- AI integrations
- Public representations

No exception layer exists.

═══════════════════════════════════════════════════════════════════

3. DEFINITION OF A LEGITIMATE DECISION

A decision is considered legitimate if and only if:

  1. Context is explicit
  2. At least two realistic alternatives are exposed
  3. Known uncertainties are acknowledged
  4. Impact scope and time horizon are defined
  5. Decision context is locked at the moment of commitment
  6. Post-decision review is possible without rewriting history

Outcome is irrelevant to legitimacy.

═══════════════════════════════════════════════════════════════════

4. PROHIBITIONS (ABSOLUTE)

The system must NEVER:
  • recommend a choice
  • rank alternatives by desirability
  • optimize for conversion, persuasion, or outcome
  • hide uncertainty
  • rewrite historical context
  • present conclusions without assumptions

If any of the above occurs, the system is in violation.

═══════════════════════════════════════════════════════════════════

5. HUMAN–AI SYMMETRY

All requirements apply equally to:
- Individuals
- Boards
- Institutions
- Automated systems
- AI agents

No actor may bypass responsibility via delegation.

═══════════════════════════════════════════════════════════════════

6. IRREVERSIBILITY & HISTORY

All core artifacts are:
- Append-only
- Time-bound
- Versioned
- Immutable once committed

Interpretation may evolve.
History must not.

═══════════════════════════════════════════════════════════════════

7. TRANSPARENCY WITHOUT NARRATIVE

The system may expose:
- Structure
- Data
- Uncertainty
- Process

The system must NOT expose:
- Persuasion
- Editorial framing
- Simplified moral conclusions

Understanding is the user's responsibility.

═══════════════════════════════════════════════════════════════════

8. CHANGE GOVERNANCE

Changes to core principles require:
- Public proposal
- Delay before activation
- Backward compatibility
- Preservation of prior standards

Urgency is NEVER sufficient justification.

═══════════════════════════════════════════════════════════════════

9. ECONOMIC NEUTRALITY

Revenue mechanisms must NOT be coupled to:
- Decisions taken
- Outcomes achieved
- Alternatives selected

Truth must remain economically indifferent.

═══════════════════════════════════════════════════════════════════

10. FAILURE MODE

If the system cannot uphold this Charter, it must:
- Refuse to process the decision
- Increase friction
- Require additional context

It must NEVER simplify in order to continue.

═══════════════════════════════════════════════════════════════════

11. SUCCESSION

This Charter must remain intelligible and enforceable even if:
- The founding organization ceases to exist
- The technology stack changes
- The original creators are absent

No oral tradition may supersede this document.

═══════════════════════════════════════════════════════════════════

12. FINAL PRINCIPLE

The system does not exist to make decisions easier.
It exists to make reality unavoidable.

═══════════════════════════════════════════════════════════════════
`;
