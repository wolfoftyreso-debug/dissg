/**
 * STEP 4: DRAFT DECISION CREATION
 * 
 * Creates Decision (draft) according to API.
 * "auto" is marked as assumption, never as fact.
 */

import type { NormalizedIntent, DecisionBlueprint, DraftDecision } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         DRAFT CREATOR
// ═══════════════════════════════════════════════════════════════════

export function createDraftDecision(
  intent: NormalizedIntent,
  blueprint: DecisionBlueprint
): DraftDecision {
  return {
    decision_type: blueprint.decision_type,
    scope: inferScope(intent),
    time_horizon: inferTimeHorizon(intent),
  };
}

function inferScope(intent: NormalizedIntent): DraftDecision['scope'] {
  // Map risk exposure to population size
  const populationMap: Record<string, DraftDecision['scope']['population_size']> = {
    consumer_product_evaluation: 'individual',
    service_comparison: 'individual',
    location_assessment: 'household',
    investment_analysis: 'individual',
    career_decision: 'individual',
    health_choice: 'individual',
    educational_path: 'individual',
    policy_impact: 'population',
  };
  
  // Map risk exposure to reversibility
  const reversibilityMap: Record<string, DraftDecision['scope']['reversibility']> = {
    low: 'high',
    medium: 'medium',
    high: 'low',
  };
  
  return {
    population_size: populationMap[intent.intent_id] || 'individual',
    reversibility: reversibilityMap[intent.risk_exposure] || 'medium',
  };
}

function inferTimeHorizon(intent: NormalizedIntent): DraftDecision['time_horizon'] {
  
  // Map time horizon hints to actual periods
  const horizonMap: Record<string, number> = {
    immediate: 0,
    short_term: 1,
    multi_year: 5,
    long_term: 10,
  };
  
  const years = horizonMap[intent.time_horizon_hint] || 5;
  
  return {
    start: 'auto', // Marked as assumption
    end: years > 0 ? `auto+${years}y` : 'auto',
  };
}
