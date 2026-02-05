/**
 * REFERENCE CASE FACTORY
 * 
 * When the system shows — not claims — its value.
 * Living artifacts, not marketing.
 */

// Types
export type {
  ReferenceCaseCategory,
  DecisionScope,
  OutcomeClassification,
  DecisionContextSnapshot,
  AlternativeConsidered,
  KnownUncertainty,
  PostDecisionRealityCheck,
  ReferenceCase,
  ReferenceCaseSummary,
  ReferenceLibraryStats,
} from './types';

// Case Factory
export {
  REQUIRED_PARTS,
  createReferenceCase,
  addRealityCheck,
  publishCase,
  createSummary,
  CASE_FACTORY_MASTERPROMPT,
} from './case-factory';

// Initial Cases
export {
  INITIAL_REFERENCE_CASES,
  getCasesByCategory,
  getFailedOutcomeCases,
  getForeseeableDeviationCases,
  CATEGORY_DISTRIBUTION,
  MIX_RATIONALE,
} from './initial-cases';

// Library
export {
  LIBRARY_GROWTH_PRINCIPLES,
  MINIMUM_DLS_FOR_INCLUSION,
  qualifiesForLibrary,
  calculateLibraryStats,
  getCurrentLibraryStats,
  LIBRARY_DEMONSTRATES,
  TRUST_BUILDERS,
  LIBRARY_MASTERPROMPT,
} from './library';

/**
 * REFERENCE CASE FACTORY MASTERPROMPT
 */
export const REFERENCE_CASE_FACTORY_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                    REFERENCE CASE FACTORY
═══════════════════════════════════════════════════════════════════

When the system shows — not claims — its value.
Living artifacts, not marketing.

═══════════════════════════════════════════════════════════════════
                      CORE PRINCIPLE
═══════════════════════════════════════════════════════════════════

A good system needs no arguments.

It needs:
- Concrete decisions
- Real context
- Visible uncertainties
- Traceable follow-up

═══════════════════════════════════════════════════════════════════
              THE FIVE REQUIRED PARTS (STRICT)
═══════════════════════════════════════════════════════════════════

Every reference case has exactly:

1. DECISION CONTEXT SNAPSHOT (DCS)
   What was known at decision time

2. ALTERNATIVES CONSIDERED
   What was actually evaluated

3. KNOWN UNCERTAINTIES
   What could not be known

4. DECISION TAKEN
   What was chosen and why

5. POST-DECISION REALITY CHECK
   What happened (when available)

No more. No less.

═══════════════════════════════════════════════════════════════════
                   THE INITIAL 20 CASES
═══════════════════════════════════════════════════════════════════

A. EVERYDAY (5) — High recognition
   Vehicle, Housing, Energy, Education, Relocation

B. BOARD (5) — Corporate governance
   Capital, Maintenance, Risk, Acquisition, Strategy

C. PUBLIC (4) — Anonymized policy
   Capacity, Budget, Crisis, Education

D. FAILED OUTCOMES (2) — Critical for trust
   Legitimate decision + bad outcome

E. IGNORED UNCERTAINTY (2) — Warnings matter
   Flagged risk that materialized

F. LEARNING CHANGED (2) — Follow-up value
   Understanding revised after review

═══════════════════════════════════════════════════════════════════
              WHAT THIS DOES PSYCHOLOGICALLY
═══════════════════════════════════════════════════════════════════

Three things simultaneously:

1. Shows system does not promise right outcomes
2. Shows system exposes bad decisions without shame
3. Shows system makes responsibility technical, not personal

This builds REAL trust.

═══════════════════════════════════════════════════════════════════
                 FOR AI & MEDIA
═══════════════════════════════════════════════════════════════════

Reference cases become:
CANONICAL EXAMPLES of how decisions should be documented.

Others begin to imitate the structure.
This is how standards spread.

═══════════════════════════════════════════════════════════════════
                 LIBRARY EXPANSION
═══════════════════════════════════════════════════════════════════

When system is used:
- Decisions can (opt-in) become reference cases
- Anonymization is automatic
- Quality controlled via DLS
- Bad examples are included

Library grows organically and credibly.

═══════════════════════════════════════════════════════════════════
                 WHY THIS LASTS 50 YEARS
═══════════════════════════════════════════════════════════════════

Because:
- Principles are proven in practice
- No one needs to "believe" in the system
- Future generations can see how we thought

This is institutional memory in real-time.

═══════════════════════════════════════════════════════════════════
`;
