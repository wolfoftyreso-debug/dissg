/**
 * DECISION GRAPH
 * 
 * Decisions are not opinions.
 * Decisions are structured question trees against reality.
 * 
 * AI suggests questions.
 * The engine provides answers.
 * Humans decide.
 */

/**
 * ANSWER TYPE (local definition to avoid circular dependency)
 */
export type AnswerType =
  | 'TREND_CHANGE'
  | 'COMPARISON_CONDITIONAL'
  | 'PREVALENCE_RISK'
  | 'DISTRIBUTION_STRUCTURE'
  | 'CORRELATION_OVERVIEW'
  | 'SCENARIO_CONDITIONAL'
  | 'CURRENT_STATE';

/**
 * DECISION NODE
 * A single question in the decision tree.
 */
export interface DecisionNode {
  readonly node_id: string;
  readonly question: string;
  readonly question_type: QuestionType;
  readonly answer_type: AnswerType;
  readonly required: boolean;
  readonly depends_on?: readonly string[];  // Other node IDs
  readonly status: NodeStatus;
  readonly answer?: ResolvedAnswer;
  readonly children?: readonly DecisionNode[];
}

/**
 * QUESTION TYPE
 */
export type QuestionType =
  | 'trend'           // How has X changed?
  | 'stability'       // How stable is X?
  | 'volatility'      // How volatile is X?
  | 'comparison'      // How does X compare to Y?
  | 'distribution'    // How is X distributed?
  | 'normal_range'    // What is normal for X?
  | 'anomaly'         // Is this unusual?
  | 'comovement'      // What moves with X?
  | 'sensitivity'     // How sensitive is X to Y?
  | 'dependency'      // What depends on X?
  | 'signal'          // What do news/events say?
  | 'assumption';     // What assumptions are needed?

/**
 * NODE STATUS
 */
export type NodeStatus =
  | 'pending'         // Not yet queried
  | 'answered'        // Has answer
  | 'uncertain'       // Answer has low confidence
  | 'missing'         // No data available
  | 'blocked';        // Depends on unanswered node

/**
 * RESOLVED ANSWER
 */
export interface ResolvedAnswer {
  readonly answer_packet_id: string;
  readonly summary: string;
  readonly confidence: number;
  readonly data_coverage: number;
  readonly limitations: readonly string[];
  readonly resolved_at: string;
}

/**
 * DECISION GRAPH
 * The complete question tree for a decision.
 */
export interface DecisionGraph {
  readonly graph_id: string;
  readonly version: string;
  readonly decision_title: string;
  readonly decision_description: string;
  readonly domain: string;
  readonly created_at: string;
  readonly nodes: readonly DecisionNode[];
  readonly required_context: readonly ContextRequirement[];
  readonly overall_confidence: number;
  readonly completeness: number;  // % of nodes answered
  readonly gaps: readonly DataGap[];
}

/**
 * CONTEXT REQUIREMENT
 */
export interface ContextRequirement {
  readonly key: string;
  readonly description: string;
  readonly required: boolean;
  readonly default_value?: string;
}

/**
 * DATA GAP
 */
export interface DataGap {
  readonly node_id: string;
  readonly question: string;
  readonly gap_type: 'no_data' | 'low_confidence' | 'outdated' | 'definition_mismatch';
  readonly severity: 'critical' | 'important' | 'minor';
  readonly suggestion?: string;
}

/**
 * DECISION GRAPH TEMPLATE
 * Predefined structures for common decision types.
 */
export interface DecisionGraphTemplate {
  readonly template_id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: string;
  readonly applicable_to: readonly string[];
  readonly node_templates: readonly DecisionNodeTemplate[];
  readonly version: string;
}

/**
 * DECISION NODE TEMPLATE
 */
export interface DecisionNodeTemplate {
  readonly template_node_id: string;
  readonly question_pattern: string;  // With placeholders like {sector}
  readonly question_type: QuestionType;
  readonly answer_type: AnswerType;
  readonly required: boolean;
  readonly depends_on?: readonly string[];
}

/**
 * DECISION GRAPH RESOLUTION REQUEST
 */
export interface DecisionResolutionRequest {
  readonly graph_id?: string;
  readonly template_id?: string;
  readonly decision_title?: string;
  readonly context: Record<string, string>;
  readonly include_signals?: boolean;
  readonly include_indices?: boolean;
}

/**
 * DECISION GRAPH RESOLUTION RESPONSE
 */
export interface DecisionResolutionResponse {
  readonly graph: DecisionGraph;
  readonly answers: readonly ResolvedAnswer[];
  readonly indices?: readonly IndexSnapshot[];
  readonly signals?: readonly SignalSnapshot[];
  readonly assumptions_needed: readonly AssumptionNeeded[];
  readonly not_provided: readonly string[];  // What we explicitly don't provide
}

/**
 * INDEX SNAPSHOT
 */
export interface IndexSnapshot {
  readonly index_id: string;
  readonly name: string;
  readonly current_value: number;
  readonly trend: 'increasing' | 'decreasing' | 'stable';
  readonly vs_normal: 'above' | 'below' | 'within';
  readonly context_note: string;
}

/**
 * SIGNAL SNAPSHOT
 */
export interface SignalSnapshot {
  readonly signal_type: string;
  readonly topic: string;
  readonly current_level: 'low' | 'normal' | 'elevated' | 'high';
  readonly trend: 'increasing' | 'decreasing' | 'stable';
  readonly regions_affected: readonly string[];
}

/**
 * ASSUMPTION NEEDED
 */
export interface AssumptionNeeded {
  readonly assumption_id: string;
  readonly description: string;
  readonly options?: readonly string[];
  readonly default_value?: string;
  readonly impact: 'critical' | 'significant' | 'minor';
}

/**
 * WHAT WE NEVER PROVIDE
 */
export const DECISION_NEVER_PROVIDES = [
  'Recommendations',
  'Optimal choices',
  'Value judgments',
  'Risk preferences',
  'Priority rankings',
  'Action suggestions',
  'Outcome predictions',
] as const;

/**
 * WHAT WE ALWAYS PROVIDE
 */
export const DECISION_ALWAYS_PROVIDES = [
  'Structured questions',
  'Factual answers',
  'Uncertainty quantification',
  'Data gaps',
  'Assumption requirements',
  'Historical context',
  'Comparative data',
] as const;
