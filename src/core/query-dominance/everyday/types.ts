/**
 * EVERYDAY DECISION INTELLIGENCE LAYER — TYPES
 * 
 * When "ordinary questions" become structured decisions, not clickbait.
 * This is how you reach mass market + policy + investments simultaneously.
 */

/**
 * Universal Decision Format (UDF)
 * ALL CDPs must follow this — consistency across all domains
 */
export interface UniversalDecisionFormat {
  udf_id: string;
  
  // Step 1: What decision is this actually about?
  actual_decision: {
    surface_question: string;      // What they asked
    underlying_decision: string;   // What they're really deciding
    decision_type: string;         // Classification
    stakes: 'low' | 'medium' | 'high' | 'critical';
  };
  
  // Step 2: Who does this apply to?
  applicability: {
    applies_to: string[];          // User profiles this fits
    does_not_apply_to: string[];   // Explicitly excluded profiles
    geographic_scope: string;
    temporal_scope: string;
  };
  
  // Step 3: What assumptions are required?
  required_assumptions: Assumption[];
  
  // Step 4: What are the realistic alternatives?
  alternatives: Alternative[];
  
  // Step 5: What are the dominant trade-offs?
  trade_offs: TradeOff[];
  
  // Step 6: What is uncertain or unknown?
  uncertainty: UncertaintyBlock;
  
  // Metadata
  generated_at: string;
  valid_until: string;
  version: number;
}

/**
 * Assumption — explicit, required for decision validity
 */
export interface Assumption {
  assumption_id: string;
  variable: string;
  description: string;
  current_value: string | number | boolean;
  allowed_values: (string | number | boolean)[];
  impact_if_wrong: 'negligible' | 'moderate' | 'significant' | 'decision_reversal';
  is_user_adjustable: boolean;
}

/**
 * Alternative — must always have at least 2
 */
export interface Alternative {
  alternative_id: string;
  name: string;
  description: string;
  category: string;
  comparable: boolean;
  why_included: string;
  key_differences: string[];
}

/**
 * Trade-off — never hidden, always explicit
 */
export interface TradeOff {
  trade_off_id: string;
  dimension_a: string;
  dimension_b: string;
  relationship: 'inverse' | 'correlated' | 'independent' | 'conditional';
  description: string;
  who_cares: string[];           // User profiles who care about this
  magnitude: 'minor' | 'moderate' | 'major';
}

/**
 * Uncertainty block — what we don't know
 */
export interface UncertaintyBlock {
  known_unknowns: KnownUnknown[];
  data_gaps: string[];
  methodology_limitations: string[];
  time_sensitivity: string;
  confidence_statement: string;
}

/**
 * Known unknown — explicit about what varies
 */
export interface KnownUnknown {
  variable: string;
  why_unknown: string;
  potential_range: string;
  impact_on_decision: string;
}

/**
 * Decision Scope Selector — user input for parameterization
 */
export interface DecisionScope {
  time_horizon: 'short' | 'medium' | 'long';
  risk_tolerance: 'low' | 'normal' | 'high';
  usage_profile: string;
  budget_range?: string;
  priority_dimension?: string;
}

/**
 * Question Analysis — "Are you asking the right question?"
 */
export interface QuestionAnalysis {
  original_question: string;
  resolved_question: string;
  key_assumptions_revealed: string[];
  implicit_scope: {
    budget: string;
    timeline: string;
    risk: string;
    profile: string;
  };
  alternative_questions: string[];  // Better questions to ask
  recommended_scope: DecisionScope;
}

/**
 * Everyday Decision Response — what users actually see
 */
export interface EverydayDecisionResponse {
  udf: UniversalDecisionFormat;
  question_analysis: QuestionAnalysis;
  user_scope: DecisionScope;
  
  // Simplified output
  summary: {
    one_sentence: string;          // "Under these conditions, X is rational if..."
    key_trade_offs: string[];      // Top 3 trade-offs
    main_uncertainty: string;      // Biggest unknown
    confidence: number;
  };
  
  // Never includes
  forbidden_outputs: ForbiddenOutput[];
}

/**
 * Forbidden outputs — what the system NEVER says
 */
export interface ForbiddenOutput {
  type: 'recommendation' | 'ranking' | 'superlative' | 'imperative';
  example: string;
  why_forbidden: string;
}

/**
 * User profile for applicability matching
 */
export interface UserProfile {
  profile_id: string;
  name: string;
  characteristics: Record<string, string | number | boolean>;
  typical_priorities: string[];
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
}
