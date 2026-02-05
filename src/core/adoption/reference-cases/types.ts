/**
 * REFERENCE CASE FACTORY — TYPES
 * 
 * When the system shows — not claims — its value.
 * Living artifacts, not marketing.
 */

/**
 * Reference Case Category
 */
export type ReferenceCaseCategory =
  | 'everyday_consumer'      // High recognition
  | 'board_governance'       // Corporate decisions
  | 'public_policy'          // Government (anonymized)
  | 'failed_outcome'         // Legitimate decision, bad outcome
  | 'ignored_uncertainty'    // Uncertainty was flagged but ignored
  | 'learning_changed';      // Follow-up changed understanding

/**
 * Decision Scope
 */
export type DecisionScope =
  | 'individual'
  | 'household'
  | 'team'
  | 'organization'
  | 'municipal'
  | 'regional'
  | 'national';

/**
 * Outcome Classification
 */
export type OutcomeClassification =
  | 'positive'
  | 'mixed'
  | 'negative'
  | 'unknown'
  | 'too_early';

/**
 * Decision Context Snapshot (DCS)
 * What was known at decision time
 */
export interface DecisionContextSnapshot {
  snapshot_id: string;
  captured_at: string;
  
  // Context at decision time
  decision_title: string;
  decision_description: string;
  scope: DecisionScope;
  time_horizon_years: number;
  
  // What was known
  known_factors: string[];
  known_constraints: string[];
  
  // What could not be known
  unknowable_at_time: string[];
  
  // External context
  market_conditions?: string;
  regulatory_environment?: string;
  technological_state?: string;
}

/**
 * Alternative Considered
 */
export interface AlternativeConsidered {
  id: string;
  title: string;
  description: string;
  
  // Trade-offs visible at decision time
  perceived_advantages: string[];
  perceived_disadvantages: string[];
  
  // Why not chosen
  rejection_reason?: string;
  
  // Was this the chosen option?
  was_chosen: boolean;
}

/**
 * Known Uncertainty
 * Uncertainty flagged at decision time
 */
export interface KnownUncertainty {
  id: string;
  uncertainty_description: string;
  
  // How it was flagged
  flagged_by: 'system' | 'human' | 'external';
  flag_date: string;
  
  // Risk assessment at time
  estimated_probability?: string;
  potential_impact?: string;
  
  // What happened (post-decision)
  materialized?: boolean;
  materialized_date?: string;
  actual_impact?: string;
}

/**
 * Post-Decision Reality Check
 */
export interface PostDecisionRealityCheck {
  check_id: string;
  performed_at: string;
  
  // Time since decision
  months_since_decision: number;
  
  // Outcome assessment
  outcome: OutcomeClassification;
  outcome_description: string;
  
  // Deviation analysis
  deviation_from_expected: boolean;
  deviation_description?: string;
  was_deviation_foreseeable: boolean;
  deviation_was_flagged_pre_decision?: boolean;
  
  // Learnings
  key_learnings: string[];
  what_would_not_change: string[];
  what_would_change: string[];
}

/**
 * Reference Case (Complete Structure)
 */
export interface ReferenceCase {
  case_id: string;
  case_code: string;
  version: string;
  
  // Classification
  category: ReferenceCaseCategory;
  is_anonymized: boolean;
  
  // The five required parts
  context_snapshot: DecisionContextSnapshot;
  alternatives_considered: AlternativeConsidered[];
  known_uncertainties: KnownUncertainty[];
  decision_taken: {
    chosen_alternative_id: string;
    decision_date: string;
    decision_rationale: string;
    decision_maker_type: 'individual' | 'committee' | 'board' | 'government';
  };
  reality_check?: PostDecisionRealityCheck;
  
  // Quality metrics
  decision_legibility_score: number; // 0-1
  documentation_completeness: number; // 0-1
  
  // Public visibility
  is_public: boolean;
  published_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Reference Case Summary (for listings)
 */
export interface ReferenceCaseSummary {
  case_id: string;
  case_code: string;
  title: string;
  category: ReferenceCaseCategory;
  scope: DecisionScope;
  time_horizon_years: number;
  alternatives_count: number;
  uncertainties_count: number;
  decision_legibility_score: number;
  outcome?: OutcomeClassification;
  was_deviation_foreseeable?: boolean;
}

/**
 * Reference Library Statistics
 */
export interface ReferenceLibraryStats {
  total_cases: number;
  by_category: Record<ReferenceCaseCategory, number>;
  by_outcome: Record<OutcomeClassification, number>;
  average_legibility_score: number;
  cases_with_reality_check: number;
  foreseeable_deviations_flagged: number;
}
