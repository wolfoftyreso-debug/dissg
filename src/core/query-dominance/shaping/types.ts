/**
 * QUESTION SHAPING ENGINE — TYPES
 * 
 * When the system becomes the reference for how rational questions should be formulated.
 * Most bad decisions don't start with wrong answers — they start with wrong questions.
 */

/**
 * Query Quality Classification
 * No shame, just clarity
 */
export type QueryQuality = 
  | 'decision_ready'      // Can be answered directly
  | 'incomplete'          // Missing dimensions
  | 'imprecise'           // Vague scope
  | 'normative'           // Asks for value judgment
  | 'unanswerable';       // Cannot be structured

/**
 * Query Analysis Result
 */
export interface QueryAnalysisResult {
  original_query: string;
  quality: QueryQuality;
  missing_dimensions: MissingDimension[];
  can_be_answered_directly: boolean;
  translation_needed: boolean;
  normative_elements: string[];
  vague_terms: string[];
}

/**
 * Missing Dimension
 */
export interface MissingDimension {
  dimension: string;
  why_needed: string;
  examples: string[];
  default_assumption?: string;
}

/**
 * Question to Decision Translation
 */
export interface QuestionTranslation {
  original: string;
  translated: string;
  
  // What was changed
  transformations: Transformation[];
  
  // What was revealed
  revealed_assumptions: string[];
  revealed_alternatives: string[];
  revealed_dimensions: string[];
  
  // Quality improvement
  quality_before: QueryQuality;
  quality_after: QueryQuality;
}

/**
 * Transformation applied
 */
export interface Transformation {
  type: 'removed_normative' | 'added_scope' | 'made_conditional' | 'added_alternatives' | 'clarified_term';
  before: string;
  after: string;
  reason: string;
}

/**
 * Decision Gravity Score
 */
export interface DecisionGravity {
  score: 'low' | 'medium' | 'high' | 'critical';
  numeric_score: number; // 0-100
  
  // Components
  components: {
    population_affected: GravityComponent;
    time_horizon: GravityComponent;
    reversibility: GravityComponent;
    uncertainty: GravityComponent;
    financial_exposure: GravityComponent;
  };
  
  // Aggregated reasons
  reasons: string[];
  
  // UX implications
  ux_behavior: UXBehavior;
}

/**
 * Gravity Component
 */
export interface GravityComponent {
  dimension: string;
  value: 'low' | 'medium' | 'high';
  weight: number;
  contribution: number;
  rationale: string;
}

/**
 * UX Behavior based on gravity
 */
export interface UXBehavior {
  response_type: 'direct' | 'scope_selection' | 'full_udf' | 'mandatory_review';
  friction_level: number; // 1-5
  required_acknowledgments: string[];
  cooling_off_suggested: boolean;
  minimum_time_on_page: number; // seconds
}

/**
 * Bad Question Patterns
 */
export interface BadQuestionPattern {
  pattern_id: string;
  pattern_regex: string;
  pattern_type: 'normative' | 'superlative' | 'vague' | 'false_dichotomy' | 'loaded';
  detection_keywords: string[];
  translation_template: string;
  explanation: string;
}

/**
 * Question Shaping Session
 */
export interface QuestionShapingSession {
  session_id: string;
  started_at: string;
  
  // Original input
  original_query: string;
  
  // Analysis
  analysis: QueryAnalysisResult;
  translation: QuestionTranslation;
  gravity: DecisionGravity;
  
  // User journey
  user_acknowledged_scope: boolean;
  user_adjusted_assumptions: boolean;
  time_spent_seconds: number;
  
  // Outcome
  proceeded_to_answer: boolean;
  reformulated_question?: string;
}

/**
 * Question Quality Feedback
 * Phrased without shame
 */
export interface QualityFeedback {
  header: string;           // "To answer this, we first need to clarify..."
  clarifications_needed: ClarificationItem[];
  suggested_reformulation: string;
  why_this_helps: string;
}

/**
 * Clarification Item
 */
export interface ClarificationItem {
  dimension: string;
  current_state: 'missing' | 'vague' | 'assumed';
  question_to_user: string;
  options?: string[];
  default_if_skipped?: string;
}
