/**
 * POST-DECISION REALITY CHECK
 * 
 * After the outcome:
 * - Compare expected vs actual
 * - Track deviations
 * - Record if deviations were flagged
 * 
 * This ensures:
 * - Responsibility cannot be erased
 * - "No one could have known" can be tested
 * - Learning becomes real
 */

import { contextFreeze, type DecisionContextSnapshot } from './decision-context-freeze';

/**
 * EXPECTED OUTCOME
 */
export interface ExpectedOutcome {
  metric_id: string;
  metric_name: string;
  expected_range: {
    min: number;
    max: number;
    most_likely: number;
  };
  timeframe: string;
  confidence: number;
}

/**
 * ACTUAL OUTCOME
 */
export interface ActualOutcome {
  metric_id: string;
  metric_name: string;
  actual_value: number;
  measured_at: string;
  measurement_confidence: number;
}

/**
 * DEVIATION RECORD
 */
export interface DeviationRecord {
  metric_id: string;
  expected: ExpectedOutcome['expected_range'];
  actual: number;
  deviation_percent: number;
  deviation_type: 'within_range' | 'above_range' | 'below_range';
  was_flagged_as_risk: boolean;
  flagged_details: string | null;
}

/**
 * POST-DECISION CHECK
 */
export interface PostDecisionCheck {
  check_id: string;
  decision_id: string;
  snapshot_id: string | null;
  checked_at: string;
  expected_outcomes: ExpectedOutcome[];
  actual_outcomes: ActualOutcome[];
  deviations: DeviationRecord[];
  summary: {
    total_metrics: number;
    within_range: number;
    above_range: number;
    below_range: number;
    flagged_risks_materialized: number;
    unflagged_risks_materialized: number;
  };
  learning_record: {
    key_lessons: string[];
    systemic_factors: string[];
    could_have_been_known: boolean;
  };
}

/**
 * POST-DECISION CHECK ENGINE
 */
class PostDecisionCheckEngine {
  private checks: Map<string, PostDecisionCheck> = new Map();

  /**
   * REGISTER EXPECTED OUTCOMES
   */
  registerExpectedOutcomes(
    decisionId: string,
    outcomes: ExpectedOutcome[]
  ): string {
    // Store with decision for later comparison
    const checkId = `PDC-${decisionId}-${Date.now()}`;
    
    const check: PostDecisionCheck = {
      check_id: checkId,
      decision_id: decisionId,
      snapshot_id: null,
      checked_at: new Date().toISOString(),
      expected_outcomes: outcomes,
      actual_outcomes: [],
      deviations: [],
      summary: {
        total_metrics: outcomes.length,
        within_range: 0,
        above_range: 0,
        below_range: 0,
        flagged_risks_materialized: 0,
        unflagged_risks_materialized: 0,
      },
      learning_record: {
        key_lessons: [],
        systemic_factors: [],
        could_have_been_known: false,
      },
    };
    
    this.checks.set(checkId, check);
    return checkId;
  }

  /**
   * RECORD ACTUAL OUTCOMES
   */
  recordActualOutcomes(
    checkId: string,
    actuals: ActualOutcome[]
  ): PostDecisionCheck | null {
    const check = this.checks.get(checkId);
    if (!check) return null;
    
    // Get snapshot for risk flagging check
    const snapshots = contextFreeze.getSnapshotsForDecision(check.decision_id);
    const snapshot = snapshots.length > 0 ? snapshots[0] : null;
    
    check.actual_outcomes = actuals;
    check.snapshot_id = snapshot?.snapshot_id || null;
    check.checked_at = new Date().toISOString();
    
    // Calculate deviations
    check.deviations = this.calculateDeviations(
      check.expected_outcomes,
      actuals,
      snapshot
    );
    
    // Update summary
    check.summary = this.calculateSummary(check.deviations);
    
    // Generate learning record
    check.learning_record = this.generateLearningRecord(check, snapshot);
    
    return check;
  }

  /**
   * CALCULATE DEVIATIONS
   */
  private calculateDeviations(
    expected: ExpectedOutcome[],
    actual: ActualOutcome[],
    snapshot: DecisionContextSnapshot | null
  ): DeviationRecord[] {
    const deviations: DeviationRecord[] = [];
    
    for (const exp of expected) {
      const act = actual.find(a => a.metric_id === exp.metric_id);
      if (!act) continue;
      
      const mostLikely = exp.expected_range.most_likely;
      const deviationPercent = mostLikely !== 0 
        ? ((act.actual_value - mostLikely) / Math.abs(mostLikely)) * 100
        : 0;
      
      let deviationType: DeviationRecord['deviation_type'];
      if (act.actual_value >= exp.expected_range.min && 
          act.actual_value <= exp.expected_range.max) {
        deviationType = 'within_range';
      } else if (act.actual_value > exp.expected_range.max) {
        deviationType = 'above_range';
      } else {
        deviationType = 'below_range';
      }
      
      // Check if this was flagged as a risk
      const wasFlagged = this.checkIfFlagged(exp.metric_id, snapshot);
      
      deviations.push({
        metric_id: exp.metric_id,
        expected: exp.expected_range,
        actual: act.actual_value,
        deviation_percent: Math.round(deviationPercent * 10) / 10,
        deviation_type: deviationType,
        was_flagged_as_risk: wasFlagged.flagged,
        flagged_details: wasFlagged.details,
      });
    }
    
    return deviations;
  }

  /**
   * CHECK IF FLAGGED
   */
  private checkIfFlagged(
    metricId: string,
    snapshot: DecisionContextSnapshot | null
  ): { flagged: boolean; details: string | null } {
    if (!snapshot) {
      return { flagged: false, details: null };
    }
    
    // Check uncertainties
    const uncertainty = snapshot.context.known_uncertainties.find(
      u => u.area.includes(metricId) || u.description.includes(metricId)
    );
    
    if (uncertainty) {
      return {
        flagged: true,
        details: `Flagged as ${uncertainty.severity} uncertainty: ${uncertainty.description}`,
      };
    }
    
    // Check non-knowledge
    const nonKnowledge = snapshot.context.explicit_non_knowledge.find(
      nk => nk.what_is_unknown.includes(metricId)
    );
    
    if (nonKnowledge) {
      return {
        flagged: true,
        details: `Explicitly unknown: ${nonKnowledge.what_is_unknown}`,
      };
    }
    
    return { flagged: false, details: null };
  }

  /**
   * CALCULATE SUMMARY
   */
  private calculateSummary(deviations: DeviationRecord[]): PostDecisionCheck['summary'] {
    return {
      total_metrics: deviations.length,
      within_range: deviations.filter(d => d.deviation_type === 'within_range').length,
      above_range: deviations.filter(d => d.deviation_type === 'above_range').length,
      below_range: deviations.filter(d => d.deviation_type === 'below_range').length,
      flagged_risks_materialized: deviations.filter(
        d => d.deviation_type !== 'within_range' && d.was_flagged_as_risk
      ).length,
      unflagged_risks_materialized: deviations.filter(
        d => d.deviation_type !== 'within_range' && !d.was_flagged_as_risk
      ).length,
    };
  }

  /**
   * GENERATE LEARNING RECORD
   */
  private generateLearningRecord(
    check: PostDecisionCheck,
    snapshot: DecisionContextSnapshot | null
  ): PostDecisionCheck['learning_record'] {
    const lessons: string[] = [];
    const systemicFactors: string[] = [];
    
    // Analyze unflagged deviations
    const unflaggedDeviations = check.deviations.filter(
      d => d.deviation_type !== 'within_range' && !d.was_flagged_as_risk
    );
    
    if (unflaggedDeviations.length > 0) {
      lessons.push(`${unflaggedDeviations.length} outcomes deviated without prior flagging`);
    }
    
    // Check if data was available
    const couldHaveBeenKnown = snapshot !== null && 
      snapshot.context.relevant_truth_nodes.length > 0;
    
    if (couldHaveBeenKnown) {
      lessons.push('Relevant data was available at decision time');
    }
    
    // Identify systemic factors
    if (check.summary.above_range > check.summary.below_range) {
      systemicFactors.push('Systematic underestimation bias detected');
    } else if (check.summary.below_range > check.summary.above_range) {
      systemicFactors.push('Systematic overestimation bias detected');
    }
    
    return {
      key_lessons: lessons,
      systemic_factors: systemicFactors,
      could_have_been_known: couldHaveBeenKnown,
    };
  }

  /**
   * GET CHECK
   */
  getCheck(checkId: string): PostDecisionCheck | null {
    return this.checks.get(checkId) || null;
  }

  /**
   * GET CHECKS FOR DECISION
   */
  getChecksForDecision(decisionId: string): PostDecisionCheck[] {
    const results: PostDecisionCheck[] = [];
    this.checks.forEach(check => {
      if (check.decision_id === decisionId) {
        results.push(check);
      }
    });
    return results;
  }

  /**
   * GENERATE REPORT
   */
  generateReport(checkId: string): string {
    const check = this.checks.get(checkId);
    if (!check) return 'Check not found';
    
    const lines = [
      'POST-DECISION REALITY CHECK',
      '═'.repeat(50),
      '',
      `Decision: ${check.decision_id}`,
      `Checked: ${check.checked_at}`,
      '',
      'OUTCOME SUMMARY',
      `  Total metrics: ${check.summary.total_metrics}`,
      `  Within range: ${check.summary.within_range}`,
      `  Above range: ${check.summary.above_range}`,
      `  Below range: ${check.summary.below_range}`,
      '',
      'RISK MATERIALIZATION',
      `  Flagged risks that materialized: ${check.summary.flagged_risks_materialized}`,
      `  Unflagged risks that materialized: ${check.summary.unflagged_risks_materialized}`,
      '',
    ];
    
    if (check.learning_record.key_lessons.length > 0) {
      lines.push('KEY LESSONS');
      for (const lesson of check.learning_record.key_lessons) {
        lines.push(`  • ${lesson}`);
      }
      lines.push('');
    }
    
    lines.push(`Could have been known: ${check.learning_record.could_have_been_known ? 'YES' : 'NO'}`);
    
    return lines.join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_checks: number;
    total_deviations: number;
    flagged_vs_unflagged: { flagged: number; unflagged: number };
  } {
    let totalDeviations = 0;
    let flagged = 0;
    let unflagged = 0;
    
    this.checks.forEach(check => {
      totalDeviations += check.deviations.filter(d => d.deviation_type !== 'within_range').length;
      flagged += check.summary.flagged_risks_materialized;
      unflagged += check.summary.unflagged_risks_materialized;
    });
    
    return {
      total_checks: this.checks.size,
      total_deviations: totalDeviations,
      flagged_vs_unflagged: { flagged, unflagged },
    };
  }
}

/**
 * SINGLETON
 */
export const postDecisionCheck = new PostDecisionCheckEngine();

/**
 * PRINCIPLES
 */
export const POST_DECISION_PRINCIPLES = {
  compare_expected_vs_actual: true,
  track_if_flagged: true,
  responsibility_not_erasable: true,
  no_one_could_know_is_testable: true,
  learning_becomes_real: true,
} as const;
