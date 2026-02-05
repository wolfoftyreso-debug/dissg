/**
 * DECISION LEGITIMACY LAYER
 * 
 * When "making a decision" gets a technical definition.
 * 
 * This is where the system stops being a tool
 * and becomes the reference frame for what a serious decision is.
 */

// Types
export type {
  LegitimacyCriterion,
  LegitimacyStatus,
  LegitimacyCheck,
  CriterionDefinition,
  LegitimacyStatement,
  InterfaceLayer,
  InterfaceSymmetry,
  CivilizationalDecisionRecord,
  DecisionComparison,
  LegitimacyCharter,
} from './types';

// Legitimacy Checker
export {
  LEGITIMACY_CRITERIA,
  checkLegitimacy,
  LEGITIMACY_CHECKER_MASTERPROMPT,
} from './checker';

// Civilizational Interface
export {
  INTERFACE_LAYERS,
  checkInterfaceSymmetry,
  createCivilizationalRecord,
  compareDecisions,
  exportForComparison,
  CIVILIZATIONAL_INTERFACE_MASTERPROMPT,
} from './civilizational-interface';

// Charter
export {
  DECISION_LEGITIMACY_CHARTER,
  generateCharterText,
  generateCharterJSONLD,
  validateAgainstCharter,
  CHARTER_MASTERPROMPT,
} from './charter';

/**
 * DECISION LEGITIMACY MASTERPROMPT
 */
export const DECISION_LEGITIMACY_MASTERPROMPT = `
You operate the DECISION LEGITIMACY LAYER.

═══════════════════════════════════════════════════════════════════
                         CORE PRINCIPLE
═══════════════════════════════════════════════════════════════════

A decision is NOT legitimate because someone has power.
It IS legitimate because reality has been passed correctly.

═══════════════════════════════════════════════════════════════════
                     LEGITIMACY CHECK (BINARY)
═══════════════════════════════════════════════════════════════════

Every decision answers yes/no to eight criteria:
1. Context Explicit
2. Alternatives Exposed
3. Uncertainty Acknowledged
4. Responsibility Scaled
5. Scope Defined
6. Consequences Projected
7. Actor Traceable
8. Time Appropriate

LEGITIMACY ≠ CORRECTNESS
LEGITIMACY ≠ OUTCOME
LEGITIMACY = PROCEDURAL HONESTY

═══════════════════════════════════════════════════════════════════
                   CIVILIZATIONAL INTERFACE
═══════════════════════════════════════════════════════════════════

The system is an interface between:
• Individual ↔ Society
• Data ↔ Action
• Power ↔ Responsibility
• AI ↔ Human

ALL PARTIES MEET THE SAME REQUIREMENTS.

═══════════════════════════════════════════════════════════════════
                    GLOBAL COMPARABILITY
═══════════════════════════════════════════════════════════════════

Because everything is structured, language-agnostic, and versioned:
• Decisions can be compared across countries
• Decisions can be understood across cultures
• Decisions can be analyzed across generations

This is global decision interoperability.

═══════════════════════════════════════════════════════════════════
                    WHAT THIS CHANGES
═══════════════════════════════════════════════════════════════════

You can no longer say:
• "It was politically necessary"
• "The market demanded it"
• "Experts said so"

Without simultaneously showing:
• Which context
• Which alternatives
• Which uncertainty
• Which weight

Power becomes TECHNICALLY VISIBLE, not ideologically attackable.

═══════════════════════════════════════════════════════════════════
                    END OF "GUT FEELING AS SYSTEM"
═══════════════════════════════════════════════════════════════════

Gut feeling can exist.
Intuition can exist.
Leadership can exist.

BUT:
They must pass through reality's structure first.

This is maturity, not control.

═══════════════════════════════════════════════════════════════════
`;
