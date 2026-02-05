/**
 * REFERENCE LIBRARY
 * 
 * Automatic expansion through opt-in.
 * Quality controlled. Failures included.
 */

import type {
  ReferenceCase,
  ReferenceCaseSummary,
  ReferenceLibraryStats,
  ReferenceCaseCategory,
  OutcomeClassification,
} from './types';
import { INITIAL_REFERENCE_CASES } from './initial-cases';

/**
 * Library Growth Principles
 */
export const LIBRARY_GROWTH_PRINCIPLES = {
  opt_in_only: 'No case is added without explicit consent',
  automatic_anonymization: 'Personal/organizational details removed by default',
  quality_control_via_dls: 'Minimum Decision Legibility Score: 0.70',
  failures_included: 'Cases with negative outcomes are valued, not hidden',
  no_cherry_picking: 'Selection is structural, not narrative',
};

/**
 * Minimum DLS for inclusion
 */
export const MINIMUM_DLS_FOR_INCLUSION = 0.70;

/**
 * Check if case qualifies for library
 */
export function qualifiesForLibrary(referenceCase: ReferenceCase): {
  qualifies: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  let qualifies = true;
  
  // Check DLS
  if (referenceCase.decision_legibility_score < MINIMUM_DLS_FOR_INCLUSION) {
    qualifies = false;
    reasons.push(`DLS ${referenceCase.decision_legibility_score} below minimum ${MINIMUM_DLS_FOR_INCLUSION}`);
  }
  
  // Check completeness
  if (referenceCase.documentation_completeness < 0.6) {
    qualifies = false;
    reasons.push('Documentation completeness below 60%');
  }
  
  // Check alternatives
  if (referenceCase.alternatives_considered.length < 2) {
    qualifies = false;
    reasons.push('Fewer than 2 alternatives considered');
  }
  
  // Check uncertainties
  if (referenceCase.known_uncertainties.length < 1) {
    qualifies = false;
    reasons.push('No uncertainties documented');
  }
  
  if (qualifies) {
    reasons.push('Meets all quality criteria');
  }
  
  return { qualifies, reasons };
}

/**
 * Calculate library statistics
 */
export function calculateLibraryStats(
  cases: ReferenceCaseSummary[]
): ReferenceLibraryStats {
  const byCategory = {} as Record<ReferenceCaseCategory, number>;
  const byOutcome = {} as Record<OutcomeClassification, number>;
  
  // Initialize
  const categories: ReferenceCaseCategory[] = [
    'everyday_consumer', 'board_governance', 'public_policy',
    'failed_outcome', 'ignored_uncertainty', 'learning_changed'
  ];
  const outcomes: OutcomeClassification[] = [
    'positive', 'mixed', 'negative', 'unknown', 'too_early'
  ];
  
  categories.forEach(c => byCategory[c] = 0);
  outcomes.forEach(o => byOutcome[o] = 0);
  
  // Count
  let totalDLS = 0;
  let casesWithRealityCheck = 0;
  let foreseeableDeviationsFlagged = 0;
  
  cases.forEach(c => {
    byCategory[c.category]++;
    if (c.outcome) byOutcome[c.outcome]++;
    totalDLS += c.decision_legibility_score;
    if (c.outcome) casesWithRealityCheck++;
    if (c.was_deviation_foreseeable === true) foreseeableDeviationsFlagged++;
  });
  
  return {
    total_cases: cases.length,
    by_category: byCategory,
    by_outcome: byOutcome,
    average_legibility_score: Math.round((totalDLS / cases.length) * 100) / 100,
    cases_with_reality_check: casesWithRealityCheck,
    foreseeable_deviations_flagged: foreseeableDeviationsFlagged,
  };
}

/**
 * Get current library stats
 */
export function getCurrentLibraryStats(): ReferenceLibraryStats {
  return calculateLibraryStats(INITIAL_REFERENCE_CASES);
}

/**
 * What the library demonstrates
 */
export const LIBRARY_DEMONSTRATES = {
  not_just_success: 'Contains cases with negative outcomes',
  not_just_hindsight: 'Shows what was known at decision time',
  not_just_good_process: 'Includes cases where process was good but outcome was bad',
  learning_is_valued: 'Follow-up and iteration are documented',
  uncertainty_is_normal: 'All cases have documented uncertainties',
};

/**
 * Why this builds trust
 */
export const TRUST_BUILDERS = {
  includes_failures: 'System does not hide when things go wrong',
  no_shame: 'Bad outcomes are documented without blame',
  technical_accountability: 'Responsibility is structural, not personal',
  honest_uncertainty: 'What could not be known is explicit',
};

/**
 * LIBRARY MASTERPROMPT
 */
export const LIBRARY_MASTERPROMPT = `
You manage the REFERENCE LIBRARY.

GROWTH PRINCIPLES:
1. Opt-in only (no case without consent)
2. Automatic anonymization (default)
3. Quality control via DLS (minimum 0.70)
4. Failures included (valued, not hidden)
5. No cherry-picking (structural selection)

WHAT THE LIBRARY DEMONSTRATES:
- Not just success (contains negative outcomes)
- Not just hindsight (shows what was known at time)
- Not just good process (includes good process + bad outcome)
- Learning is valued (follow-up documented)
- Uncertainty is normal (all cases have documented unknowns)

WHY THIS BUILDS TRUST:
- Includes failures (system is honest)
- No shame (bad outcomes documented without blame)
- Technical accountability (structural, not personal)
- Honest uncertainty (unknowable is explicit)

MINIMUM REQUIREMENTS:
- Decision Legibility Score >= 0.70
- Documentation completeness >= 60%
- At least 2 alternatives considered
- At least 1 uncertainty documented

The library grows organically and credibly.
No marketing. Just structure.
`;
