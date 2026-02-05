/**
 * DECISION HYGIENE SCORE (DHS)
 * 
 * Measures: consistency, discipline, learning
 * Does NOT measure: outcomes, success, quality of decisions
 */

import type { DecisionPreparationDocument, PostDecisionLock } from '../types';
import type { RealityCheckResult } from '../reality-check';
import type { DecisionHygieneScore } from './types';

/**
 * Calculate Decision Hygiene Score for an organization
 */
export function calculateDecisionHygieneScore(
  organizationId: string,
  organizationName: string,
  decisions: Array<{
    dpd: DecisionPreparationDocument;
    lock?: PostDecisionLock;
    realityCheck?: RealityCheckResult;
  }>,
  period: { start: string; end: string }
): DecisionHygieneScore {
  if (decisions.length === 0) {
    return createEmptyScore(organizationId, organizationName, period);
  }
  
  // Coverage metrics
  const coverage = calculateCoverage(decisions);
  
  // Discipline metrics
  const discipline = calculateDiscipline(decisions);
  
  // Learning metrics
  const learning = calculateLearning(decisions);
  
  // Common gaps
  const commonGaps = identifyCommonGaps(decisions);
  
  // Calculate overall score
  const score = calculateOverallScore(coverage, discipline, learning);
  
  return {
    organization_id: organizationId,
    organization_name: organizationName,
    score: Math.round(score * 100) / 100,
    coverage,
    discipline,
    learning,
    common_gaps: commonGaps,
    calculated_at: new Date().toISOString(),
    period,
  };
}

/**
 * Calculate coverage metrics
 */
function calculateCoverage(
  decisions: Array<{ dpd: DecisionPreparationDocument; lock?: PostDecisionLock }>
): DecisionHygieneScore['coverage'] {
  const totalDecisions = decisions.length;
  const decisionsLogged = decisions.filter(d => d.dpd).length;
  
  // High impact = irreversibility level is 'high' or 'permanent'
  const highImpact = decisions.filter(d => 
    d.dpd.overview.irreversibility === 'high' || d.dpd.overview.irreversibility === 'permanent'
  );
  const highImpactLogged = highImpact.filter(d => d.lock?.immutable).length;
  
  return {
    total_decisions: totalDecisions,
    decisions_logged: decisionsLogged,
    high_impact_decisions: highImpact.length,
    high_impact_logged: highImpactLogged,
  };
}

/**
 * Calculate discipline metrics
 */
function calculateDiscipline(
  decisions: Array<{ dpd: DecisionPreparationDocument; lock?: PostDecisionLock }>
): DecisionHygieneScore['discipline'] {
  const total = decisions.length;
  
  // DPD completion (has all required fields)
  const completeDPDs = decisions.filter(d => 
    d.dpd.alternatives.length >= 2 &&
    d.dpd.assumptions_explicit.length > 0 &&
    (d.dpd.knowledge_status.uncertain.length > 0 || d.dpd.knowledge_status.unknown.length > 0)
  );
  
  // Uncertainty documentation
  const withUncertainties = decisions.filter(d =>
    d.dpd.knowledge_status.uncertain.length > 0 ||
    d.dpd.knowledge_status.unknown.length > 0
  );
  
  // PDRC scheduled (has context snapshot = PDRC can be scheduled)
  const withPDRC = decisions.filter(d => d.lock?.context_snapshot_id);
  
  // Average alternatives
  const totalAlternatives = decisions.reduce((sum, d) => sum + d.dpd.alternatives.length, 0);
  
  return {
    dpd_completion_rate: completeDPDs.length / Math.max(total, 1),
    uncertainty_documentation_rate: withUncertainties.length / Math.max(total, 1),
    pdrc_completion_rate: withPDRC.length / Math.max(total, 1),
    average_alternatives_considered: totalAlternatives / Math.max(total, 1),
  };
}

/**
 * Calculate learning metrics
 */
function calculateLearning(
  decisions: Array<{ dpd: DecisionPreparationDocument; realityCheck?: RealityCheckResult }>
): DecisionHygieneScore['learning'] {
  const withRealityCheck = decisions.filter(d => d.realityCheck);
  
  // Identify recurring blindspots
  const blindspotCounts = new Map<string, number>();
  
  for (const decision of withRealityCheck) {
    if (decision.realityCheck) {
      // Check summary for unflagged risks that materialized
      if (decision.realityCheck.summary.unflagged_risks_materialized > 0) {
        for (const learning of decision.realityCheck.learning) {
          if (learning.category === 'assumption_error' || learning.category === 'data_gap') {
            const key = learning.description.toLowerCase();
            blindspotCounts.set(key, (blindspotCounts.get(key) || 0) + 1);
          }
        }
      }
    }
  }
  
  const recurringBlindspots = Array.from(blindspotCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([blindspot, _]) => blindspot)
    .slice(0, 5);
  
  return {
    reality_checks_completed: withRealityCheck.length,
    patterns_identified: recurringBlindspots.length,
    recurring_blindspots: recurringBlindspots,
  };
}

/**
 * Identify common gaps across decisions
 */
function identifyCommonGaps(
  decisions: Array<{ dpd: DecisionPreparationDocument; lock?: PostDecisionLock }>
): string[] {
  const gaps: Map<string, number> = new Map();
  
  for (const decision of decisions) {
    // Check each potential gap
    if (decision.dpd.alternatives.length < 2) {
      gaps.set('insufficient alternatives', (gaps.get('insufficient alternatives') || 0) + 1);
    }
    
    if (decision.dpd.knowledge_status.uncertain.length === 0 && 
        decision.dpd.knowledge_status.unknown.length === 0) {
      gaps.set('uncertainty documentation', (gaps.get('uncertainty documentation') || 0) + 1);
    }
    
    if (decision.dpd.assumptions_explicit.length === 0) {
      gaps.set('explicit assumptions', (gaps.get('explicit assumptions') || 0) + 1);
    }
    
    if (!decision.lock?.context_snapshot_id) {
      gaps.set('follow-up scheduling', (gaps.get('follow-up scheduling') || 0) + 1);
    }
  }
  
  // Return gaps that appear in >20% of decisions
  const threshold = decisions.length * 0.2;
  return Array.from(gaps.entries())
    .filter(([_, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([gap, _]) => gap);
}

/**
 * Calculate overall score
 */
function calculateOverallScore(
  coverage: DecisionHygieneScore['coverage'],
  discipline: DecisionHygieneScore['discipline'],
  learning: DecisionHygieneScore['learning']
): number {
  const weights = {
    coverage: 0.30,
    discipline: 0.50,
    learning: 0.20,
  };
  
  // Coverage score
  const coverageScore = coverage.decisions_logged / Math.max(coverage.total_decisions, 1);
  
  // Discipline score (average of rates)
  const disciplineScore = (
    discipline.dpd_completion_rate +
    discipline.uncertainty_documentation_rate +
    discipline.pdrc_completion_rate +
    Math.min(discipline.average_alternatives_considered / 3, 1) // Normalize to max of 3 alternatives
  ) / 4;
  
  // Learning score (binary: are we learning?)
  const learningScore = learning.reality_checks_completed > 0 ? 
    Math.min(learning.reality_checks_completed / 10, 1) : 0;
  
  return (
    coverageScore * weights.coverage +
    disciplineScore * weights.discipline +
    learningScore * weights.learning
  );
}

/**
 * Create empty score for organizations with no decisions
 */
function createEmptyScore(
  organizationId: string,
  organizationName: string,
  period: { start: string; end: string }
): DecisionHygieneScore {
  return {
    organization_id: organizationId,
    organization_name: organizationName,
    score: 0,
    coverage: {
      total_decisions: 0,
      decisions_logged: 0,
      high_impact_decisions: 0,
      high_impact_logged: 0,
    },
    discipline: {
      dpd_completion_rate: 0,
      uncertainty_documentation_rate: 0,
      pdrc_completion_rate: 0,
      average_alternatives_considered: 0,
    },
    learning: {
      reality_checks_completed: 0,
      patterns_identified: 0,
      recurring_blindspots: [],
    },
    common_gaps: [],
    calculated_at: new Date().toISOString(),
    period,
  };
}

/**
 * HYGIENE SCORE MASTERPROMPT
 */
export const HYGIENE_SCORE_MASTERPROMPT = `
You calculate Decision Hygiene Scores.

WHAT DHS MEASURES:
1. Coverage — Are decisions being logged?
2. Discipline — Are processes being followed?
3. Learning — Are we reviewing outcomes?

WHAT DHS DOES NOT MEASURE:
- Whether decisions were correct
- Whether outcomes were good
- Whether the organization is successful

SCORING:
- Coverage: 30%
- Discipline: 50%
- Learning: 20%

COMMON GAPS IDENTIFIED:
- Insufficient alternatives (<2)
- Missing uncertainty documentation
- No explicit assumptions
- No follow-up scheduled

DHS IS:
- A mirror, not a judgment
- A metric, not a grade
- A pattern, not a verdict

Organizations use DHS to improve process.
Not to prove they're better than others.
`;
