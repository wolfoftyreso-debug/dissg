/**
 * COLLECTIVE MEMORY
 * 
 * How organizations actually learn.
 * Not opinions — patterns in decision history.
 */

import type { DecisionPreparationDocument, PostDecisionLock } from '../types';
import type { RealityCheckResult } from '../reality-check';
import type { 
  CollectiveMemoryPattern, 
  CollectiveMemoryResult,
  DecisionLegibilityScore 
} from './types';

/**
 * Collective memory store (in-memory for now)
 */
interface CollectiveMemoryStore {
  decisions: Array<{
    dpd: DecisionPreparationDocument;
    legibilityScore: DecisionLegibilityScore;
    realityCheck?: RealityCheckResult;
    lock?: PostDecisionLock;
  }>;
}

const memoryStore: CollectiveMemoryStore = {
  decisions: [],
};

/**
 * Add decision to collective memory
 */
export function addToCollectiveMemory(
  dpd: DecisionPreparationDocument,
  legibilityScore: DecisionLegibilityScore,
  realityCheck?: RealityCheckResult,
  lock?: PostDecisionLock
): void {
  memoryStore.decisions.push({
    dpd,
    legibilityScore,
    realityCheck,
    lock,
  });
}

/**
 * Query: "How did we decide then?"
 */
export function queryHowDidWeDecide(
  organizationType?: string,
  timeRange?: { start: string; end: string }
): CollectiveMemoryResult {
  const filtered = filterDecisions(organizationType, timeRange);
  
  const patterns: CollectiveMemoryPattern[] = [];
  
  // Analyze decision-making patterns
  const avgAlternatives = filtered.reduce(
    (sum, d) => sum + d.dpd.alternatives.length, 
    0
  ) / Math.max(filtered.length, 1);
  
  if (avgAlternatives < 2.5) {
    patterns.push({
      pattern_id: `pattern_few_alternatives_${Date.now()}`,
      pattern_type: 'systematic_blind_spot',
      description: 'Decisions typically considered fewer than 3 alternatives',
      frequency: filtered.filter(d => d.dpd.alternatives.length < 3).length / Math.max(filtered.length, 1),
      first_observed: filtered[0]?.dpd.dpd_id || '',
      last_observed: filtered[filtered.length - 1]?.dpd.dpd_id || '',
      affected_decisions: filtered.filter(d => d.dpd.alternatives.length < 3).map(d => d.dpd.dpd_id),
      statistical_significance: filtered.length >= 5 ? 0.8 : 0.4,
    });
  }
  
  return {
    query: 'How did we decide?',
    query_type: 'how_did_we_decide',
    patterns,
    decision_count_analyzed: filtered.length,
    time_range_analyzed: {
      start: timeRange?.start || 'all',
      end: timeRange?.end || 'now',
    },
    disclaimer: 'Patterns shown are statistical observations, not judgments. Correlation is not causation.',
  };
}

/**
 * Query: "What did we miss?"
 */
export function queryWhatDidWeMiss(
  organizationType?: string,
  timeRange?: { start: string; end: string }
): CollectiveMemoryResult {
  const filtered = filterDecisions(organizationType, timeRange);
  const patterns: CollectiveMemoryPattern[] = [];
  
  // Find decisions where unknowns materialized
  const withRealityCheck = filtered.filter(d => d.realityCheck);
  
  const unflaggedMaterializations = withRealityCheck.filter(d => 
    d.realityCheck && d.realityCheck.summary.unflagged_risks_materialized > 0
  );
  
  if (unflaggedMaterializations.length > 0) {
    patterns.push({
      pattern_id: `pattern_unflagged_${Date.now()}`,
      pattern_type: 'systematic_blind_spot',
      description: 'Risks materialized that were not flagged pre-decision',
      frequency: unflaggedMaterializations.length / Math.max(withRealityCheck.length, 1),
      first_observed: unflaggedMaterializations[0]?.dpd.dpd_id || '',
      last_observed: unflaggedMaterializations[unflaggedMaterializations.length - 1]?.dpd.dpd_id || '',
      affected_decisions: unflaggedMaterializations.map(d => d.dpd.dpd_id),
      statistical_significance: withRealityCheck.length >= 3 ? 0.7 : 0.3,
    });
  }
  
  // Find common assumption failures
  const assumptionFailures = withRealityCheck.filter(d =>
    d.realityCheck?.learning.some(l => l.category === 'assumption_error')
  );
  
  if (assumptionFailures.length > 0) {
    patterns.push({
      pattern_id: `pattern_assumption_${Date.now()}`,
      pattern_type: 'common_assumption_failure',
      description: 'Recurring assumption errors in decision-making',
      frequency: assumptionFailures.length / Math.max(withRealityCheck.length, 1),
      first_observed: assumptionFailures[0]?.dpd.dpd_id || '',
      last_observed: assumptionFailures[assumptionFailures.length - 1]?.dpd.dpd_id || '',
      affected_decisions: assumptionFailures.map(d => d.dpd.dpd_id),
      statistical_significance: withRealityCheck.length >= 3 ? 0.7 : 0.3,
    });
  }
  
  return {
    query: 'What did we miss?',
    query_type: 'what_did_we_miss',
    patterns,
    decision_count_analyzed: filtered.length,
    time_range_analyzed: {
      start: timeRange?.start || 'all',
      end: timeRange?.end || 'now',
    },
    disclaimer: 'Patterns shown are statistical observations, not blame assignments. Learning requires honesty, not judgment.',
  };
}

/**
 * Query: "Which uncertainties recur?"
 */
export function queryRecurringUncertainties(
  organizationType?: string,
  timeRange?: { start: string; end: string }
): CollectiveMemoryResult {
  const filtered = filterDecisions(organizationType, timeRange);
  const patterns: CollectiveMemoryPattern[] = [];
  
  // Collect all uncertainties
  const uncertaintyFrequency = new Map<string, string[]>();
  
  for (const decision of filtered) {
    for (const uncertainty of decision.dpd.knowledge_status.uncertain) {
      const key = normalizeUncertainty(uncertainty);
      const existing = uncertaintyFrequency.get(key) || [];
      existing.push(decision.dpd.dpd_id);
      uncertaintyFrequency.set(key, existing);
    }
  }
  
  // Find recurring uncertainties (appear in 2+ decisions)
  for (const [uncertainty, decisions] of uncertaintyFrequency.entries()) {
    if (decisions.length >= 2) {
      patterns.push({
        pattern_id: `pattern_recurring_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        pattern_type: 'recurring_uncertainty',
        description: uncertainty,
        frequency: decisions.length / Math.max(filtered.length, 1),
        first_observed: decisions[0],
        last_observed: decisions[decisions.length - 1],
        affected_decisions: decisions,
        statistical_significance: decisions.length >= 3 ? 0.8 : 0.5,
      });
    }
  }
  
  // Sort by frequency
  patterns.sort((a, b) => b.frequency - a.frequency);
  
  return {
    query: 'Which uncertainties recur?',
    query_type: 'recurring_uncertainties',
    patterns: patterns.slice(0, 10),
    decision_count_analyzed: filtered.length,
    time_range_analyzed: {
      start: timeRange?.start || 'all',
      end: timeRange?.end || 'now',
    },
    disclaimer: 'Recurring uncertainties may indicate systemic knowledge gaps or fundamental domain complexity.',
  };
}

/**
 * Filter decisions by criteria
 */
function filterDecisions(
  organizationType?: string,
  timeRange?: { start: string; end: string }
) {
  return memoryStore.decisions.filter(d => {
    if (organizationType && d.dpd.overview.organization_type !== organizationType) {
      return false;
    }
    // Add time range filtering if needed
    return true;
  });
}

/**
 * Normalize uncertainty text for comparison
 */
function normalizeUncertainty(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

/**
 * COLLECTIVE MEMORY MASTERPROMPT
 */
export const COLLECTIVE_MEMORY_MASTERPROMPT = `
You answer questions about organizational decision history.

YOU PROVIDE:
- Statistical patterns
- Frequency observations
- Trend identification

YOU DO NOT PROVIDE:
- Opinions
- Judgments
- Blame
- Recommendations

QUERIES YOU HANDLE:
1. "How did we decide?" → Decision-making patterns
2. "What did we miss?" → Blind spots and unflagged risks
3. "Which uncertainties recur?" → Systemic knowledge gaps

EVERY RESPONSE INCLUDES:
- Number of decisions analyzed
- Time range analyzed
- Statistical significance
- Anti-myth disclaimer

This is how organizations actually learn:
Through honest pattern recognition, not narrative construction.
`;
