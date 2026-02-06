/**
 * AGENT FEEDBACK TYPES
 * 
 * STEG 22: AI-AGENT FEEDBACK LOOP
 * 
 * Nyckelprincip:
 * AI-agenter får påverka synlighet och täckning – aldrig innehåll.
 * 
 * AI-beteende är ren signal, inte brus.
 * Människor klickar fel, söker otydligt, vill bli övertygade.
 * AI-agenter testar flera formuleringar, jämför svar, söker stabilitet.
 */

/**
 * FEEDBACK TYPE ENUM
 * Only meta-signal, never semantics
 */
export type FeedbackType = 
  | 'resolve_success'    // A: Agent found CQ directly
  | 'resolve_failure'    // A: Agent failed to find CQ
  | 'retry_pattern'      // B: Number of reformulations needed
  | 'cross_cq_ambiguity' // C: Landed on multiple possible CQs
  | 'answer_acceptance'; // D: How agent used the answer

/**
 * A: RESOLVE FEEDBACK
 * Did the agent find a CQ directly?
 */
export interface ResolveFeedback {
  readonly type: 'resolve_success' | 'resolve_failure';
  readonly agent_id: string;
  readonly agent_type: string;
  readonly timestamp: string;
  
  // Query details
  readonly query: string;
  readonly query_language: string;
  
  // Resolution result
  readonly resolved: boolean;
  readonly resolved_cq_id: string | null;
  readonly fallback_used: boolean;
  readonly resolution_time_ms: number;
  
  // Confidence
  readonly resolution_confidence: number;
}

/**
 * B: RETRY PATTERN FEEDBACK
 * How many reformulations were needed?
 */
export interface RetryPatternFeedback {
  readonly type: 'retry_pattern';
  readonly agent_id: string;
  readonly agent_type: string;
  readonly timestamp: string;
  
  // Original query
  readonly original_query: string;
  
  // Retries
  readonly retries: number;
  readonly reformulations: string[];
  readonly final_query: string;
  readonly final_resolved: boolean;
  readonly final_cq_id: string | null;
  
  // Signal interpretation
  readonly indicates_narrow_question_surface: boolean;
}

/**
 * C: CROSS-CQ AMBIGUITY FEEDBACK
 * Did the agent land on multiple possible CQs?
 */
export interface CrossCQAmbiguityFeedback {
  readonly type: 'cross_cq_ambiguity';
  readonly agent_id: string;
  readonly agent_type: string;
  readonly timestamp: string;
  
  // Query
  readonly query: string;
  
  // Ambiguity details
  readonly candidate_cq_ids: string[];
  readonly candidate_scores: number[];
  readonly selected_cq_id: string | null;
  readonly selection_method: 'highest_score' | 'agent_choice' | 'abandoned';
  
  // Signal: Problem Object may need splitting
  readonly suggests_problem_object_split: boolean;
}

/**
 * D: ANSWER ACCEPTANCE FEEDBACK
 * Did the agent use the answer directly or modify it?
 */
export interface AnswerAcceptanceFeedback {
  readonly type: 'answer_acceptance';
  readonly agent_id: string;
  readonly agent_type: string;
  readonly timestamp: string;
  
  // CQ reference
  readonly cq_id: string;
  readonly answer_version: number;
  
  // Acceptance type
  readonly post_processing: 'none' | 'paraphrase' | 'suppression' | 'partial';
  readonly used_directly: boolean;
  readonly cited: boolean;
  readonly cite_format: string | null;
  
  // Trust signal
  readonly direct_use_indicates_high_trust: boolean;
}

/**
 * UNION TYPE FOR ALL FEEDBACK
 */
export type AgentFeedback = 
  | ResolveFeedback 
  | RetryPatternFeedback 
  | CrossCQAmbiguityFeedback 
  | AnswerAcceptanceFeedback;

/**
 * FEEDBACK CLASSIFICATION
 */
export interface FeedbackClassification {
  readonly feedback: AgentFeedback;
  readonly signal_strength: 'weak' | 'moderate' | 'strong';
  readonly actionable: boolean;
  readonly suggested_action: SuggestedAction | null;
}

/**
 * SUGGESTED ACTIONS FROM FEEDBACK
 * Only routing, coverage, visibility - NEVER content
 */
export type SuggestedAction = 
  | { type: 'create_query_template'; template: string; target_cq_id: string }
  | { type: 'split_problem_object'; source_cq_id: string; split_criteria: string }
  | { type: 'adjust_visibility'; cq_id: string; adjustment: 'increase' | 'decrease'; audience: string }
  | { type: 'flag_coverage_gap'; query_pattern: string; priority: 'low' | 'medium' | 'high' };

/**
 * WHAT FEEDBACK CAN INFLUENCE
 */
export const FEEDBACK_CAN_INFLUENCE = [
  'routing',
  'coverage',
  'visibility',
  'query_templates',
  'problem_object_structure',
  'cache_priority',
  'latency_optimization',
] as const;

/**
 * WHAT FEEDBACK CAN NEVER INFLUENCE
 * Hard-blocked in architecture
 */
export const FEEDBACK_CANNOT_INFLUENCE = [
  'answer_formulation',
  'data_values',
  'narrative_priority',
  'fact_merging',
  'source_selection',
  'confidence_scores',
  'uncertainty_levels',
  'methodology',
] as const;

/**
 * WHY AI AGENTS ARE THE BEST FEEDBACK SOURCE
 */
export const WHY_AGENTS_ARE_BEST = {
  humans: {
    click_incorrectly: true,
    search_unclearly: true,
    want_to_be_convinced: true,
    signal_quality: 'noisy',
  },
  ai_agents: {
    test_multiple_formulations: true,
    compare_answers: true,
    seek_stability: true,
    avoid_risk: true,
    signal_quality: 'clean',
  },
} as const;

/**
 * Create resolve feedback
 */
export function createResolveFeedback(
  agentId: string,
  agentType: string,
  query: string,
  resolved: boolean,
  cqId: string | null,
  fallbackUsed: boolean,
  timeMs: number,
  confidence: number
): ResolveFeedback {
  return {
    type: resolved ? 'resolve_success' : 'resolve_failure',
    agent_id: agentId,
    agent_type: agentType,
    timestamp: new Date().toISOString(),
    query,
    query_language: 'en', // Would be detected
    resolved,
    resolved_cq_id: cqId,
    fallback_used: fallbackUsed,
    resolution_time_ms: timeMs,
    resolution_confidence: confidence,
  };
}

/**
 * Create retry pattern feedback
 */
export function createRetryPatternFeedback(
  agentId: string,
  agentType: string,
  originalQuery: string,
  reformulations: string[],
  finalResolved: boolean,
  finalCqId: string | null
): RetryPatternFeedback {
  return {
    type: 'retry_pattern',
    agent_id: agentId,
    agent_type: agentType,
    timestamp: new Date().toISOString(),
    original_query: originalQuery,
    retries: reformulations.length,
    reformulations,
    final_query: reformulations[reformulations.length - 1] || originalQuery,
    final_resolved: finalResolved,
    final_cq_id: finalCqId,
    indicates_narrow_question_surface: reformulations.length >= 3,
  };
}

/**
 * Create answer acceptance feedback
 */
export function createAnswerAcceptanceFeedback(
  agentId: string,
  agentType: string,
  cqId: string,
  postProcessing: 'none' | 'paraphrase' | 'suppression' | 'partial',
  cited: boolean
): AnswerAcceptanceFeedback {
  return {
    type: 'answer_acceptance',
    agent_id: agentId,
    agent_type: agentType,
    timestamp: new Date().toISOString(),
    cq_id: cqId,
    answer_version: 1,
    post_processing: postProcessing,
    used_directly: postProcessing === 'none',
    cited,
    cite_format: cited ? 'standard' : null,
    direct_use_indicates_high_trust: postProcessing === 'none' && cited,
  };
}
