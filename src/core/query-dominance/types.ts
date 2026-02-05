/**
 * QUERY DOMINANCE FACTORY — TYPES
 * 
 * Top-1000 search intents → structured decision infrastructure.
 * Not SEO. Epistemic markup of human questions.
 */

/**
 * Decision type categories
 */
export type DecisionCategory =
  | 'consumer_private'      // A: Is X good? Should I buy X?
  | 'financial'             // B: Is X a good investment?
  | 'health_life'           // C: Is this normal? Risks of...
  | 'policy_society'        // D: Does X work? Effects of X
  | 'meta_evaluation';      // E: Is X safe? How reliable?

/**
 * Decision type (the ~40 core types)
 */
export interface DecisionType {
  type_id: string;
  category: DecisionCategory;
  name: string;
  
  // Query patterns that map here
  query_patterns: string[];
  
  // What this decision involves
  implicit_choice: string;
  alternatives_required: boolean;
  time_horizon: 'immediate' | 'short_term' | 'multi_year' | 'lifetime';
  risk_exposure: 'low' | 'medium' | 'high' | 'critical';
  
  // Required data packages
  required_data_packages: string[];
  required_indices: string[];
}

/**
 * Query → Decision Blueprint mapping
 */
export interface DecisionBlueprint {
  query: string;
  query_normalized: string;
  
  // Classification
  decision_type: string;
  category: DecisionCategory;
  
  // Decision structure
  implicit_choice: string;
  alternatives_required: boolean;
  time_horizon: 'immediate' | 'short_term' | 'multi_year' | 'lifetime';
  risk_exposure: 'low' | 'medium' | 'high' | 'critical';
  
  // What blocks are required
  required_block_groups: BlockGroupId[];
  
  // Metadata
  mapped_at: string;
  confidence: number;
}

/**
 * Block group identifiers
 */
export type BlockGroupId =
  | 'scope_assumptions'       // 1-5
  | 'cost_resources'          // 6-15
  | 'performance_reliability' // 16-25
  | 'risk_failure_modes'      // 26-35
  | 'dominance_tradeoffs'     // 36-45
  | 'uncertainty_nonknowledge'; // 46-50

/**
 * Question block definition
 */
export interface QuestionBlock {
  block_id: number;
  block_group: BlockGroupId;
  question: string;
  
  // What this block answers
  answers_intent: string;
  
  // Data requirements
  data_type: 'quantitative' | 'qualitative' | 'comparative' | 'temporal';
  requires_sources: boolean;
  
  // Display
  can_be_empty: false; // Never - empty blocks are exposed openly
  empty_display: string; // What to show when no data
}

/**
 * Block group definition
 */
export interface BlockGroup {
  group_id: BlockGroupId;
  name: string;
  block_range: [number, number];
  purpose: string;
  blocks: QuestionBlock[];
}

/**
 * Conditional Decision Page (CDP)
 */
export interface ConditionalDecisionPage {
  cdp_id: string;
  query: string;
  decision_blueprint: DecisionBlueprint;
  
  // The page is NOT an answer - it's a decision instrument
  generated_at: string;
  valid_until?: string;
  
  // Assumptions this is conditioned on
  stated_assumptions: string[];
  
  // Block contents
  blocks: CDPBlock[];
  
  // The conditional verdict
  conditional_verdict: {
    format: 'Given [assumptions], X is [rational/irrational] compared to alternatives';
    assumptions: string[];
    verdict_type: 'rational' | 'irrational' | 'indeterminate';
    compared_to: string[];
    confidence: number;
    reasoning_visible: boolean;
  };
  
  // What this page NEVER says
  forbidden_outputs: ['yes', 'no', 'best', 'recommended'];
  
  // Schema.org markup
  schema_markup: object;
}

/**
 * CDP Block (filled or empty, never hidden)
 */
export interface CDPBlock {
  block_id: number;
  block_group: BlockGroupId;
  question: string;
  
  // Content (or explicit empty state)
  has_content: boolean;
  content?: {
    summary: string;
    data_points: CDPDataPoint[];
    sources: CDPSource[];
    uncertainty_statement?: string;
  };
  
  // If empty, this is shown
  empty_state?: {
    message: string; // "No verified data available for this question"
    why_empty: string;
    can_be_filled_by: string[];
  };
}

/**
 * CDP Data Point
 */
export interface CDPDataPoint {
  claim: string;
  value?: number;
  unit?: string;
  comparison_baseline?: string;
  time_period?: string;
  source_id: string;
  confidence: number;
}

/**
 * CDP Source
 */
export interface CDPSource {
  source_id: string;
  name: string;
  type: 'official_statistics' | 'peer_reviewed' | 'industry_report' | 'aggregated_user_data';
  url?: string;
  retrieved_at: string;
  reliability_score: number;
}

/**
 * Query Dominance metrics
 */
export interface QueryDominanceMetrics {
  total_queries_indexed: number;
  decision_types_covered: number;
  total_cdp_pages: number;
  blocks_filled_percent: number;
  average_source_count: number;
  ai_consumption_ready: boolean;
  last_updated: string;
}
