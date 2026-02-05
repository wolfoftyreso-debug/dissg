/**
 * DECISION LEGIBILITY SCORER
 * 
 * Measures if a decision was DEFENSIBLE to take, not if it was RIGHT.
 */

import type { DecisionPreparationDocument } from '../types';
import type { 
  DecisionLegibilityScore, 
  LegibilityGap 
} from './types';

/**
 * Calculate Decision Legibility Score
 */
export function calculateLegibilityScore(
  dpd: DecisionPreparationDocument,
  _decisionTaken: string
): DecisionLegibilityScore {
  const gaps: LegibilityGap[] = [];
  
  // 1. Alternative coverage
  const alternativeCoverage = scoreAlternativeCoverage(dpd, gaps);
  
  // 2. Uncertainty visibility
  const uncertaintyVisibility = scoreUncertaintyVisibility(dpd, gaps);
  
  // 3. Assumption explicitness
  const assumptionExplicitness = scoreAssumptionExplicitness(dpd, gaps);
  
  // 4. Scope correctness
  const scopeCorrectness = scoreScopeCorrectness(dpd, gaps);
  
  // 5. Timeframe correctness
  const timeframeCorrectness = scoreTimeframeCorrectness(dpd, gaps);
  
  // Calculate overall score
  const weights = {
    alternative_coverage: 0.25,
    uncertainty_visibility: 0.25,
    assumption_explicitness: 0.20,
    scope_correctness: 0.15,
    timeframe_correctness: 0.15,
  };
  
  const overallScore = 
    alternativeCoverage * weights.alternative_coverage +
    uncertaintyVisibility * weights.uncertainty_visibility +
    assumptionExplicitness * weights.assumption_explicitness +
    scopeCorrectness * weights.scope_correctness +
    timeframeCorrectness * weights.timeframe_correctness;
  
  // Run reasonable person test
  const reasonablePersonTest = runReasonablePersonTest(dpd, overallScore, gaps);
  
  return {
    decision_id: dpd.dpd_id,
    score: Math.round(overallScore * 100) / 100,
    components: {
      alternative_coverage: alternativeCoverage,
      uncertainty_visibility: uncertaintyVisibility,
      assumption_explicitness: assumptionExplicitness,
      scope_correctness: scopeCorrectness,
      timeframe_correctness: timeframeCorrectness,
    },
    missing_elements: gaps,
    reasonable_person_test: reasonablePersonTest,
    calculated_at: new Date().toISOString(),
    notes: gaps.length === 0 
      ? 'All major uncertainties surfaced pre-decision'
      : `${gaps.length} legibility gap(s) identified`,
  };
}

/**
 * Score alternative coverage
 */
function scoreAlternativeCoverage(
  dpd: DecisionPreparationDocument, 
  gaps: LegibilityGap[]
): number {
  let score = 1.0;
  
  // Must have at least 2 alternatives
  if (dpd.alternatives.length < 2) {
    gaps.push({
      element: 'alternatives',
      severity: 'critical',
      description: 'Fewer than 2 alternatives considered',
      recommendation: 'Document at least one additional alternative',
    });
    score -= 0.4;
  }
  
  // Each alternative should have assumptions
  const alternativesWithoutAssumptions = dpd.alternatives.filter(
    a => !a.assumptions || a.assumptions.length === 0
  );
  if (alternativesWithoutAssumptions.length > 0) {
    gaps.push({
      element: 'alternative_assumptions',
      severity: 'moderate',
      description: `${alternativesWithoutAssumptions.length} alternative(s) lack stated assumptions`,
      recommendation: 'State explicit assumptions for each alternative',
    });
    score -= 0.2 * (alternativesWithoutAssumptions.length / dpd.alternatives.length);
  }
  
  // Should have consequence surfaces
  const alternativesWithConsequences = dpd.alternatives.filter(
    a => dpd.consequence_surfaces[a.id] && dpd.consequence_surfaces[a.id].length > 0
  );
  if (alternativesWithConsequences.length < dpd.alternatives.length) {
    gaps.push({
      element: 'consequence_surfaces',
      severity: 'moderate',
      description: 'Not all alternatives have mapped consequences',
      recommendation: 'Map consequence surfaces for all alternatives',
    });
    score -= 0.2;
  }
  
  return Math.max(0, score);
}

/**
 * Score uncertainty visibility
 */
function scoreUncertaintyVisibility(
  dpd: DecisionPreparationDocument, 
  gaps: LegibilityGap[]
): number {
  let score = 1.0;
  
  const { known, uncertain, unknown } = dpd.knowledge_status;
  
  // Must have explicit unknowns (they always exist)
  if (unknown.length === 0) {
    gaps.push({
      element: 'unknowns',
      severity: 'critical',
      description: 'No unknowns acknowledged — unrealistic',
      recommendation: 'Acknowledge what is not known',
    });
    score -= 0.4;
  }
  
  // Should have uncertainties
  if (uncertain.length === 0) {
    gaps.push({
      element: 'uncertainties',
      severity: 'moderate',
      description: 'No uncertainties flagged',
      recommendation: 'Identify areas of uncertainty',
    });
    score -= 0.3;
  }
  
  // Ratio check: known should not dwarf uncertain+unknown
  const knownRatio = known.length / (known.length + uncertain.length + unknown.length);
  if (knownRatio > 0.8) {
    gaps.push({
      element: 'knowledge_balance',
      severity: 'minor',
      description: 'Knowledge status may be overconfident',
      recommendation: 'Review for potential blind spots',
    });
    score -= 0.1;
  }
  
  return Math.max(0, score);
}

/**
 * Score assumption explicitness
 */
function scoreAssumptionExplicitness(
  dpd: DecisionPreparationDocument, 
  gaps: LegibilityGap[]
): number {
  let score = 1.0;
  
  // Must have explicit assumptions
  if (!dpd.assumptions_explicit || dpd.assumptions_explicit.length === 0) {
    gaps.push({
      element: 'assumptions',
      severity: 'critical',
      description: 'No explicit assumptions stated',
      recommendation: 'Document all assumptions underlying the decision',
    });
    return 0.2;
  }
  
  // Should have at least 3 assumptions for complex decisions
  if (dpd.alternatives.length > 2 && dpd.assumptions_explicit.length < 3) {
    gaps.push({
      element: 'assumption_depth',
      severity: 'minor',
      description: 'Few assumptions for decision complexity',
      recommendation: 'Consider additional implicit assumptions',
    });
    score -= 0.2;
  }
  
  return Math.max(0, score);
}

/**
 * Score scope correctness
 */
function scoreScopeCorrectness(
  dpd: DecisionPreparationDocument, 
  gaps: LegibilityGap[]
): number {
  let score = 1.0;
  
  // Must have geo scope
  if (!dpd.overview.geo_scope) {
    gaps.push({
      element: 'geo_scope',
      severity: 'moderate',
      description: 'Geographic scope not defined',
      recommendation: 'Specify geographic boundaries of decision',
    });
    score -= 0.3;
  }
  
  // Must have population affected
  if (!dpd.overview.population_affected || dpd.overview.population_affected === 0) {
    gaps.push({
      element: 'population_affected',
      severity: 'moderate',
      description: 'Affected population not quantified',
      recommendation: 'Estimate number of people affected',
    });
    score -= 0.3;
  }
  
  return Math.max(0, score);
}

/**
 * Score timeframe correctness
 */
function scoreTimeframeCorrectness(
  dpd: DecisionPreparationDocument, 
  gaps: LegibilityGap[]
): number {
  let score = 1.0;
  
  // Must have time horizon
  if (!dpd.overview.time_horizon) {
    gaps.push({
      element: 'time_horizon',
      severity: 'moderate',
      description: 'Time horizon not specified',
      recommendation: 'Define when outcomes should be evaluated',
    });
    score -= 0.4;
  }
  
  return Math.max(0, score);
}

/**
 * Run "Could a reasonable person understand this?" test
 */
function runReasonablePersonTest(
  dpd: DecisionPreparationDocument,
  overallScore: number,
  gaps: LegibilityGap[]
): DecisionLegibilityScore['reasonable_person_test'] {
  const criticalGaps = gaps.filter(g => g.severity === 'critical');
  
  // New board member: needs context + alternatives clear
  const newBoardMemberUnderstands = 
    overallScore >= 0.6 && 
    criticalGaps.length === 0;
  
  // External auditor: needs full documentation
  const externalAuditorUnderstands = 
    overallScore >= 0.7 && 
    gaps.length <= 2;
  
  // Future AI: needs structured, complete data
  const futureAiUnderstands = 
    overallScore >= 0.8 && 
    dpd.assumptions_explicit.length > 0 &&
    dpd.knowledge_status.unknown.length > 0;
  
  return {
    new_board_member_understands: newBoardMemberUnderstands,
    external_auditor_understands: externalAuditorUnderstands,
    future_ai_understands: futureAiUnderstands,
    test_passed: newBoardMemberUnderstands && externalAuditorUnderstands,
  };
}

/**
 * LEGIBILITY SCORER MASTERPROMPT
 */
export const LEGIBILITY_SCORER_MASTERPROMPT = `
You calculate Decision Legibility Scores.

WHAT YOU MEASURE:
- Was the decision DEFENSIBLE to take?
- Could a reasonable person understand the context?
- Were uncertainties made visible?

WHAT YOU DO NOT MEASURE:
- Whether the decision was correct
- Whether the outcome was good
- Whether better alternatives existed

SCORING COMPONENTS:
1. Alternative coverage (25%)
2. Uncertainty visibility (25%)
3. Assumption explicitness (20%)
4. Scope correctness (15%)
5. Timeframe correctness (15%)

REASONABLE PERSON TEST:
- Would a new board member understand?
- Would an external auditor understand?
- Would future AI understand?

If any test fails, the decision is harder to defend.
`;
