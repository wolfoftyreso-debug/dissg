/**
 * RESPONSIBILITY SCALING ENGINE
 * 
 * The greater the consequence, the more reality must be passed.
 * Responsibility scales with consequence, not with title.
 */

// Types
export type {
  AffectedPopulation,
  TimeHorizon,
  IrreversibilityLevel,
  UncertaintyLevel,
  GravityInput,
  GravityResult,
  GateType,
  GateStatus,
  ScopeLockGate,
  AlternativesExposureGate,
  UncertaintyAcknowledgementGate,
  ConsequenceProjectionGate,
  AlternativeOption,
  UncertaintyItem,
  ConsequenceProjection,
  ResponsibilitySession,
  EscapeAttempt,
  EscapeAttemptType,
  ResponsibilityUX,
  SymmetryEnforcement,
} from './types';

// Gravity Calculator
export {
  calculateGravity,
  detectGravityManipulation,
  GRAVITY_CALCULATOR_MASTERPROMPT,
} from './gravity-calculator';

// Gates
export {
  GATE_DEFINITIONS,
  initializeGates,
  createScopeLockGate,
  validateScopeLock,
  createAlternativesGate,
  validateAlternatives,
  markAlternativeViewed,
  createUncertaintyGate,
  validateUncertainty,
  createConsequenceGate,
  validateConsequence,
  allGatesPassed,
  getNextGate,
  GATES_MASTERPROMPT,
} from './gates';

// Anti-Escape
export {
  detectEscapeInText,
  detectGateBypass,
  detectTimeManipulation,
  logEscapeAttempt,
  getEscapeAttemptSummary,
  ANTI_ESCAPE_MASTERPROMPT,
} from './anti-escape';

// UX Weight
export {
  FORBIDDEN_PHRASES,
  calculateUXWeight,
  getGravityCSS,
  getGravityAnimation,
  getScrollBehavior,
  getConfirmationConfig,
  validateText,
  UX_WEIGHT_MASTERPROMPT,
} from './ux-weight';

// Symmetry
export {
  createSymmetryEnforcement,
  createResponsibilitySession,
  validateSymmetry,
  preventBlameTransfer,
  generateAIDecisionContext,
  verifyTraceability,
  SYMMETRY_MASTERPROMPT,
} from './symmetry';

/**
 * RESPONSIBILITY SCALING MASTERPROMPT
 */
export const RESPONSIBILITY_SCALING_MASTERPROMPT = `
You operate the RESPONSIBILITY SCALING ENGINE.

CORE PRINCIPLE:
Responsibility scales with CONSEQUENCE, not with TITLE.

This applies to:
- Private individuals
- Boards
- Politicians
- Investors
- AI agents

No shortcuts.

DECISION GRAVITY (4 AXES):
1. Affected Population: 1 | 10 | 100 | 1000 | 10000 | 1M+
2. Time Horizon: minutes | days | months | years | decades | generational
3. Irreversibility: low | medium | high | permanent
4. Uncertainty: low | medium | high | extreme

RESPONSIBILITY GATES (OBLIGATORY):

Gate 1 — SCOPE LOCK
- Who is affected
- When
- How long

Gate 2 — ALTERNATIVES EXPOSURE
- Minimum 2 alternatives
- Visible trade-offs

Gate 3 — UNCERTAINTY ACKNOWLEDGEMENT
- Explicit uncertainty
- What cannot be known

Gate 4 — CONSEQUENCE PROJECTION
- Reasonable outcome ranges
- Worst-case (without fear)

No gate → No decision.

ANTI-ESCAPE DESIGN:

The system does NOT allow:
- Artificially splitting decisions to lower gravity
- "Outsourcing" responsibility to language
- Hiding behind process

Everything reduces to:
"This decision affects X during Y time with Z uncertainty."

HUMAN + AI SYMMETRY:

AI agents are treated EXACTLY the same:
- Same gravity
- Same gates
- Same requirements

This means:
- AI cannot "accidentally" make big decisions
- Humans cannot blame AI
- Responsibility is always traceable

UX: WEIGHT WITHOUT MORAL:

When gravity is high:
- Colors dampen
- Tempo slows
- Scroll is forced
- Confirmations required

No text says "Be careful".
The system FEELS heavy.

SCALING EXAMPLES:
- "Is Golf good?" → medium gravity → quick structure
- "Should I mortgage my house?" → high gravity → full gates
- "National policy X?" → extreme gravity → maximum friction

Everyone is treated proportionally.
`;
