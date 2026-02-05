/**
 * ONTOLOGY FACTORY
 * 
 * Creates valid ontology objects with proper defaults and validation.
 */

import type {
  Decision,
  Context,
  Alternative,
  Uncertainty,
  Evidence,
  Outcome,
  Review,
  Scope,
  TimeRange,
  StructuredText,
  Assumption,
  TradeOff,
  Learning,
  StructuredComparison,
  DecisionType,
  UncertaintyType,
  SourceType,
  AffectedPopulation,
  GeographicScope,
  ImpactRange,
} from './types';
import { validateDecisionStructure, checkLegitimacy, computeLegitimacyStatus } from './legitimacy-engine';
import { validateNoForbiddenConcepts } from './forbidden';

/**
 * Generate semantic ID following the system's ID format specification
 */
function generateId(namespace: string, objectType: string, version: string = 'v1'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const semanticHash = `${timestamp}${random}`;
  return `${namespace}:${objectType}:${semanticHash}:${version}`;
}

/**
 * Create structured text
 */
export function createStructuredText(
  content: string,
  language: string = 'en',
  format: 'plain' | 'markdown' = 'plain'
): StructuredText {
  return { content, language, format };
}

/**
 * Create an Assumption
 */
export function createAssumption(
  statement: string,
  is_testable: boolean,
  source?: string
): Assumption {
  return {
    assumption_id: generateId('onto', 'assumption'),
    statement: createStructuredText(statement),
    is_testable,
    source,
  };
}

/**
 * Create a Trade-Off
 */
export function createTradeOff(
  description: string,
  affected_dimension: string,
  direction: 'positive' | 'negative' | 'uncertain'
): TradeOff {
  return {
    trade_off_id: generateId('onto', 'tradeoff'),
    description: createStructuredText(description),
    affected_dimension,
    direction,
  };
}

/**
 * Create a Scope
 */
export function createScope(
  population_size: Scope['population_size'],
  reversibility: Scope['reversibility']
): Scope {
  return { population_size, reversibility };
}

/**
 * Create a TimeRange
 */
export function createTimeRange(
  start: string | Date,
  end?: string | Date | null
): TimeRange {
  return {
    start: typeof start === 'string' ? start : start.toISOString(),
    end: end ? (typeof end === 'string' ? end : end.toISOString()) : null,
  };
}

/**
 * Create a Context
 */
export function createContext(params: {
  description: string;
  affected_population: AffectedPopulation;
  geographic_scope: GeographicScope;
  decision_motivation: string;
  assumptions?: Assumption[];
}): Context {
  return {
    context_id: generateId('onto', 'context'),
    description: createStructuredText(params.description),
    affected_population: params.affected_population,
    geographic_scope: params.geographic_scope,
    decision_motivation: createStructuredText(params.decision_motivation),
    assumptions: params.assumptions || [],
  };
}

/**
 * Create an Alternative
 */
export function createAlternative(params: {
  label: string;
  description: string;
  trade_offs?: TradeOff[];
  required_assumptions?: Assumption[];
}): Alternative {
  return {
    alternative_id: generateId('onto', 'alternative'),
    label: params.label,
    description: createStructuredText(params.description),
    trade_offs: params.trade_offs || [],
    required_assumptions: params.required_assumptions || [],
  };
}

/**
 * Create an Uncertainty
 */
export function createUncertainty(params: {
  description: string;
  uncertainty_type: UncertaintyType;
  impact_range: ImpactRange;
}): Uncertainty {
  return {
    uncertainty_id: generateId('onto', 'uncertainty'),
    description: createStructuredText(params.description),
    uncertainty_type: params.uncertainty_type,
    impact_range: params.impact_range,
  };
}

/**
 * Create Evidence
 */
export function createEvidence(params: {
  source_type: SourceType;
  reference: string;
  validity_start: string;
  validity_end?: string | null;
}): Evidence {
  return {
    evidence_id: generateId('onto', 'evidence'),
    source_type: params.source_type,
    reference: params.reference,
    validity_period: createTimeRange(params.validity_start, params.validity_end),
  };
}

/**
 * Create a Decision
 * Validates structure and forbidden concepts before returning
 */
export function createDecision(params: {
  decision_type: DecisionType;
  gravity_score: number;
  scope: Scope;
  time_horizon: TimeRange;
  context: Context;
  alternatives: Alternative[];
  uncertainties: Uncertainty[];
}): { decision: Decision | null; errors: string[] } {
  const errors: string[] = [];
  
  // Validate alternatives count
  if (params.alternatives.length < 2) {
    errors.push('At least 2 alternatives required');
  }
  
  // Validate uncertainties count
  if (params.uncertainties.length < 1) {
    errors.push('At least 1 uncertainty required');
  }
  
  // Validate gravity score
  if (params.gravity_score < 0 || params.gravity_score > 1) {
    errors.push('gravity_score must be between 0.0 and 1.0');
  }
  
  // Check for forbidden concepts
  const forbiddenCheck = validateNoForbiddenConcepts({
    alternatives: params.alternatives,
    context: params.context,
  });
  
  if (!forbiddenCheck.valid) {
    for (const v of forbiddenCheck.violations) {
      errors.push(`Forbidden concept detected: ${v}`);
    }
  }
  
  if (errors.length > 0) {
    return { decision: null, errors };
  }
  
  const decision: Decision = {
    decision_id: generateId('onto', 'decision'),
    decision_type: params.decision_type,
    gravity_score: params.gravity_score,
    scope: params.scope,
    time_horizon: params.time_horizon,
    context_snapshot_id: params.context.context_id,
    alternatives: params.alternatives,
    uncertainties: params.uncertainties,
    legitimacy_status: 'incomplete', // Will be computed
    created_at: new Date().toISOString(),
    locked_at: null,
  };
  
  // Compute legitimacy
  const check = checkLegitimacy(decision, params.context);
  decision.legitimacy_status = computeLegitimacyStatus(check);
  
  return { decision, errors: [] };
}

/**
 * Create an Outcome
 */
export function createOutcome(params: {
  decision_id: string;
  observed_effects: string;
  deviation_from_expectation: 'within_range' | 'outside_range';
}): Outcome {
  return {
    outcome_id: generateId('onto', 'outcome'),
    decision_id: params.decision_id,
    observed_effects: createStructuredText(params.observed_effects),
    deviation_from_expectation: params.deviation_from_expectation,
    recorded_at: new Date().toISOString(),
  };
}

/**
 * Create a Review
 */
export function createReview(params: {
  decision_id: string;
  expected: string;
  observed: string;
  delta_description: string;
  learnings?: string[];
  foreseeable_deviation: boolean;
}): Review {
  const learnings: Learning[] = (params.learnings || []).map(l => ({
    learning_id: generateId('onto', 'learning'),
    observation: createStructuredText(l),
    recorded_at: new Date().toISOString(),
    applies_forward_only: true,
  }));
  
  return {
    review_id: generateId('onto', 'review'),
    decision_id: params.decision_id,
    expected_vs_observed: {
      expected: createStructuredText(params.expected),
      observed: createStructuredText(params.observed),
      delta_description: createStructuredText(params.delta_description),
    },
    learnings,
    foreseeable_deviation: params.foreseeable_deviation,
    reviewed_at: new Date().toISOString(),
  };
}

/**
 * Lock a decision (makes it immutable)
 */
export function lockDecision(decision: Decision): Decision {
  if (decision.locked_at) {
    throw new Error('Decision is already locked');
  }
  
  return {
    ...decision,
    locked_at: new Date().toISOString(),
  };
}
