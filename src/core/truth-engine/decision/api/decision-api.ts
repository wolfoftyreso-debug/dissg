/**
 * DECISION API TYPES
 * 
 * API contracts for the Decision Graph API.
 * 
 * Endpoints:
 * - POST /decision/resolve - Resolve a decision graph
 * - GET /decision/templates - List available templates
 * - GET /decision/graph/{id} - Get a specific graph
 */

import type { DecisionGraph } from '../graph/decision-graph';

/**
 * API REQUEST: Resolve Decision
 */
export interface ResolveDecisionRequest {
  // Either graph_id or template_id required
  readonly graph_id?: string;
  readonly template_id?: string;
  
  // Custom decision title (if not using template)
  readonly decision_title?: string;
  
  // Context for resolution
  readonly context: {
    readonly country?: string;
    readonly region?: string;
    readonly sector?: string;
    readonly time_horizon?: string;
    readonly [key: string]: string | undefined;
  };
  
  // Options
  readonly include_indices?: boolean;
  readonly include_signals?: boolean;
  readonly include_assumptions?: boolean;
}

/**
 * API RESPONSE: Resolve Decision
 */
export interface ResolveDecisionResponse {
  readonly success: boolean;
  readonly graph: DecisionGraph;
  readonly summary: DecisionSummary;
  readonly context_used: Record<string, string>;
  readonly resolved_at: string;
  
  // What we provide
  readonly answers: readonly AnswerSummary[];
  readonly indices?: readonly IndexContext[];
  readonly signals?: readonly SignalContext[];
  readonly assumptions_needed: readonly AssumptionContext[];
  readonly data_gaps: readonly GapContext[];
  
  // What we explicitly don't provide
  readonly not_provided: readonly string[];
}

/**
 * DECISION SUMMARY
 */
export interface DecisionSummary {
  readonly decision_title: string;
  readonly total_questions: number;
  readonly answered_questions: number;
  readonly uncertain_questions: number;
  readonly missing_questions: number;
  readonly overall_confidence: number;
  readonly completeness_percent: number;
  readonly critical_gaps: number;
}

/**
 * ANSWER SUMMARY
 */
export interface AnswerSummary {
  readonly node_id: string;
  readonly question: string;
  readonly answer_summary: string;
  readonly confidence: number;
  readonly status: 'answered' | 'uncertain' | 'missing';
  readonly drill_down_available: boolean;
}

/**
 * INDEX CONTEXT
 */
export interface IndexContext {
  readonly index_id: string;
  readonly name: string;
  readonly value: number;
  readonly interpretation: string;  // "Within normal range" / "Above normal" / etc.
  readonly relevance: string;       // Why this index matters for this decision
}

/**
 * SIGNAL CONTEXT
 */
export interface SignalContext {
  readonly signal_type: string;
  readonly topic: string;
  readonly level: string;
  readonly interpretation: string;
  readonly relevance: string;
}

/**
 * ASSUMPTION CONTEXT
 */
export interface AssumptionContext {
  readonly assumption_id: string;
  readonly description: string;
  readonly why_needed: string;
  readonly impact_if_wrong: string;
  readonly options?: readonly string[];
}

/**
 * GAP CONTEXT
 */
export interface GapContext {
  readonly question: string;
  readonly gap_type: string;
  readonly severity: string;
  readonly what_it_means: string;
  readonly possible_alternatives: readonly string[];
}

/**
 * API REQUEST: List Templates
 */
export interface ListTemplatesRequest {
  readonly domain?: string;
  readonly applicable_to?: string;
}

/**
 * API RESPONSE: List Templates
 */
export interface ListTemplatesResponse {
  readonly templates: readonly TemplateSummary[];
  readonly total: number;
}

/**
 * TEMPLATE SUMMARY
 */
export interface TemplateSummary {
  readonly template_id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: string;
  readonly question_count: number;
  readonly required_context: readonly string[];
}

/**
 * API ENDPOINTS
 */
export const DECISION_API_ENDPOINTS = {
  resolve: '/decision/resolve',
  templates: '/decision/templates',
  graph: '/decision/graph/:id',
} as const;

/**
 * API PRINCIPLES
 */
export const DECISION_API_PRINCIPLES = {
  // What the API does
  provides_structured_questions: true,
  provides_factual_answers: true,
  provides_uncertainty_quantification: true,
  provides_data_gaps: true,
  provides_assumption_requirements: true,
  
  // What the API NEVER does
  provides_recommendations: false,
  provides_optimal_choices: false,
  provides_value_judgments: false,
  provides_risk_preferences: false,
  
  // Responsibility
  responsibility_lies_with: 'user/organization',
  ai_role: 'question_formulation_only',
} as const;
