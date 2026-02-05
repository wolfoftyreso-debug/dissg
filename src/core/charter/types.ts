/**
 * DECISION LEGITIMACY CHARTER — TYPES
 * 
 * The foundational law.
 * Everything else derives from this.
 */

/**
 * Charter Version
 */
export interface CharterVersion {
  version: string;
  adopted_at: string;
  effective_at: string;
  supersedes?: string;
  hash: string; // Immutable reference
}

/**
 * Charter Article
 */
export interface CharterArticle {
  number: number;
  title: string;
  content: string;
  subsections?: string[];
  is_absolute: boolean; // Cannot be modified
  enforcement_type: 'technical' | 'procedural' | 'both';
}

/**
 * Legitimacy Criteria
 * A decision is legitimate if and only if ALL are true
 */
export interface LegitimacyCriteria {
  context_explicit: boolean;
  alternatives_exposed: boolean;    // At least 2
  uncertainties_acknowledged: boolean;
  scope_defined: boolean;
  time_horizon_defined: boolean;
  context_locked: boolean;         // At commitment
  review_possible: boolean;        // Without rewriting history
}

/**
 * Absolute Prohibitions
 * The system must NEVER do these
 */
export type AbsoluteProhibition =
  | 'recommend_choice'
  | 'rank_by_desirability'
  | 'optimize_conversion'
  | 'optimize_persuasion'
  | 'optimize_outcome'
  | 'hide_uncertainty'
  | 'rewrite_history'
  | 'conclusions_without_assumptions';

/**
 * Charter Compliance Status
 */
export interface CharterCompliance {
  is_compliant: boolean;
  violations: AbsoluteProhibition[];
  legitimacy_met: Partial<LegitimacyCriteria>;
  legitimacy_missing: (keyof LegitimacyCriteria)[];
  checked_at: string;
}

/**
 * Failure Mode
 */
export type FailureMode =
  | 'refuse_to_process'
  | 'increase_friction'
  | 'require_additional_context';

/**
 * The Charter itself
 */
export interface DecisionLegitimacyCharter {
  version: CharterVersion;
  purpose: string;
  scope: string[];
  legitimacy_criteria: LegitimacyCriteria;
  prohibitions: AbsoluteProhibition[];
  articles: CharterArticle[];
  failure_modes: FailureMode[];
  final_principle: string;
}
