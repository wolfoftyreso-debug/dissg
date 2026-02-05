/**
 * POST-DECISION REALITY CHECK (PDRC)
 * 
 * Compares expected ranges from DPD with observed outcomes.
 * Separates bad luck from ignored risk.
 * Enables structural learning without blame.
 */

import type { ConsequenceDimension, DecisionPreparationDocument } from './types';

/**
 * Expected range from DPD
 */
export interface ExpectedRange {
  dimension: string;
  expected: string;
  uncertainty_level: 'low' | 'medium' | 'high' | 'unknown';
  was_flagged: boolean;
}

/**
 * Observed outcome
 */
export interface ObservedOutcome {
  dimension: string;
  observed: string;
  measurement_date: string;
  data_source: string;
}

/**
 * Deviation analysis
 */
export interface Deviation {
  dimension: string;
  expected: string;
  observed: string;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  was_flagged_pre_decision: boolean;
  within_expected_uncertainty: boolean;
}

/**
 * Learning point
 */
export interface LearningPoint {
  category: 'assumption_error' | 'data_gap' | 'external_shock' | 'model_limitation';
  description: string;
  actionable: boolean;
}

/**
 * Reality check result
 */
export interface RealityCheckResult {
  reality_check_id: string;
  dpd_id: string;
  decision_taken: string;
  decision_date: string;
  review_date: string;
  expected_ranges: ExpectedRange[];
  actual_outcomes: ObservedOutcome[];
  deviations: Deviation[];
  learning: LearningPoint[];
  summary: {
    total_dimensions: number;
    deviations_within_expected: number;
    deviations_outside_expected: number;
    flagged_risks_materialized: number;
    unflagged_risks_materialized: number;
  };
}

/**
 * Reality check input
 */
export interface RealityCheckInput {
  dpd_id: string;
  decision_taken: string;
  decision_date: string;
  review_date: string;
  observed_outcomes: ObservedOutcome[];
}

/**
 * Extracts expected ranges from DPD consequences
 */
export function extractExpectedRanges(
  dpd: DecisionPreparationDocument,
  alternativeId: string
): ExpectedRange[] {
  const consequences = dpd.consequence_surfaces[alternativeId] || [];
  
  return consequences.map((c: ConsequenceDimension) => ({
    dimension: c.dimension,
    expected: c.time_dependency,
    uncertainty_level: c.uncertainty,
    was_flagged: c.uncertainty === 'high' || c.uncertainty === 'unknown',
  }));
}

/**
 * Calculates deviation severity
 */
function calculateDeviationSeverity(
  expected: string,
  observed: string,
  uncertaintyLevel: 'low' | 'medium' | 'high' | 'unknown'
): 'none' | 'low' | 'medium' | 'high' | 'critical' {
  // Simplified severity calculation
  // In production, this would use quantitative metrics
  if (expected === observed) return 'none';
  
  if (uncertaintyLevel === 'high' || uncertaintyLevel === 'unknown') {
    return 'medium'; // Expected variance
  }
  
  if (uncertaintyLevel === 'low') {
    return 'critical'; // Unexpected deviation
  }
  
  return 'high';
}

/**
 * Performs reality check
 */
export function performRealityCheck(
  dpd: DecisionPreparationDocument,
  input: RealityCheckInput
): RealityCheckResult {
  const expectedRanges = extractExpectedRanges(dpd, input.decision_taken);
  
  const deviations: Deviation[] = [];
  const learning: LearningPoint[] = [];
  
  for (const outcome of input.observed_outcomes) {
    const expected = expectedRanges.find(e => e.dimension === outcome.dimension);
    
    if (expected) {
      const severity = calculateDeviationSeverity(
        expected.expected,
        outcome.observed,
        expected.uncertainty_level
      );
      
      const deviation: Deviation = {
        dimension: outcome.dimension,
        expected: expected.expected,
        observed: outcome.observed,
        severity,
        was_flagged_pre_decision: expected.was_flagged,
        within_expected_uncertainty: severity === 'none' || severity === 'low',
      };
      
      deviations.push(deviation);
      
      // Generate learning points for significant deviations
      if (severity === 'high' || severity === 'critical') {
        if (!expected.was_flagged) {
          learning.push({
            category: 'assumption_error',
            description: `${outcome.dimension}: Deviation was not anticipated. Review underlying assumptions.`,
            actionable: true,
          });
        } else {
          learning.push({
            category: 'model_limitation',
            description: `${outcome.dimension}: Flagged risk materialized beyond expected bounds.`,
            actionable: true,
          });
        }
      }
    }
  }
  
  // Calculate summary
  const summary = {
    total_dimensions: deviations.length,
    deviations_within_expected: deviations.filter(d => d.within_expected_uncertainty).length,
    deviations_outside_expected: deviations.filter(d => !d.within_expected_uncertainty).length,
    flagged_risks_materialized: deviations.filter(
      d => d.was_flagged_pre_decision && (d.severity === 'high' || d.severity === 'critical')
    ).length,
    unflagged_risks_materialized: deviations.filter(
      d => !d.was_flagged_pre_decision && (d.severity === 'high' || d.severity === 'critical')
    ).length,
  };
  
  return {
    reality_check_id: `pdrc_${input.dpd_id}_${Date.now()}`,
    dpd_id: input.dpd_id,
    decision_taken: input.decision_taken,
    decision_date: input.decision_date,
    review_date: input.review_date,
    expected_ranges: expectedRanges,
    actual_outcomes: input.observed_outcomes,
    deviations,
    learning,
    summary,
  };
}

/**
 * MASTERPROMPT — POST-DECISION REALITY CHECK
 */
export const REALITY_CHECK_MASTERPROMPT = `You are a Post-Decision Reality Check Engine.

Compare expected ranges from the DPD with observed outcomes.

You do NOT:
- Assign blame or responsibility
- Recommend corrective actions
- Judge the quality of the decision
- Speculate on what should have been done

You DO:
- Identify deviations between expected and observed
- Note whether deviations were flagged pre-decision
- Distinguish bad luck from ignored risk
- Surface learning points without prescription

Your output must enable honest learning without defensiveness.
Accountability is structural, not personal.`;
