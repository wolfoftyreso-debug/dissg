/**
 * DECISION LEGITIMACY LAYER — TYPES
 * 
 * A decision is not legitimate because someone has power.
 * It is legitimate because reality has been passed correctly.
 */

/**
 * Legitimacy Criteria (binary, not moral)
 */
export type LegitimacyCriterion = 
  | 'context_explicit'
  | 'alternatives_exposed'
  | 'uncertainty_acknowledged'
  | 'responsibility_scaled'
  | 'scope_defined'
  | 'consequences_projected'
  | 'actor_traceable'
  | 'time_appropriate';

/**
 * Legitimacy Status
 */
export type LegitimacyStatus = 
  | 'legitimate'
  | 'partially_legitimate'
  | 'illegitimate'
  | 'unknown';

/**
 * Legitimacy Check Result
 */
export interface LegitimacyCheck {
  decision_id: string;
  decision_legitimate: boolean;
  status: LegitimacyStatus;
  
  // Criteria assessment
  criteria_met: LegitimacyCriterion[];
  criteria_failed: LegitimacyCriterion[];
  criteria_unknown: LegitimacyCriterion[];
  
  // Scoring
  legitimacy_score: number; // 0-1
  
  // Generated statement
  legitimacy_statement: string;
  
  // Metadata
  checked_at: string;
  checker_version: string;
}

/**
 * Criterion Definition
 */
export interface CriterionDefinition {
  id: LegitimacyCriterion;
  name: string;
  description: string;
  requirement: string;
  validation_method: 'structural' | 'temporal' | 'actor' | 'content';
}

/**
 * Legitimacy Statement (auto-generated)
 */
export interface LegitimacyStatement {
  summary: string;
  criteria_explanations: {
    criterion: LegitimacyCriterion;
    met: boolean;
    explanation: string;
  }[];
  limitations: string[];
  generated_at: string;
}

/**
 * Civilizational Interface Types
 */

/**
 * Interface Layer
 */
export type InterfaceLayer = 
  | 'individual_society'
  | 'data_action'
  | 'power_responsibility'
  | 'ai_human';

/**
 * Interface Symmetry Check
 */
export interface InterfaceSymmetry {
  layer: InterfaceLayer;
  balanced: boolean;
  imbalance_description?: string;
  requirements_same: boolean;
}

/**
 * Civilizational Decision Record
 */
export interface CivilizationalDecisionRecord {
  decision_id: string;
  
  // Legitimacy
  legitimacy_check: LegitimacyCheck;
  
  // Interface layers
  interface_symmetries: InterfaceSymmetry[];
  
  // Comparability
  globally_comparable: boolean;
  comparison_dimensions: string[];
  
  // Temporal
  generational_relevance: boolean;
  time_horizon_classification: string;
  
  // Machine-readable
  version: string;
  schema: string;
  language_agnostic: boolean;
}

/**
 * Decision Comparison (cross-country, cross-culture)
 */
export interface DecisionComparison {
  decision_a_id: string;
  decision_b_id: string;
  
  comparable: boolean;
  comparison_validity: number; // 0-1
  
  shared_criteria: LegitimacyCriterion[];
  divergent_criteria: LegitimacyCriterion[];
  
  structural_alignment: number;
  temporal_alignment: number;
  
  comparison_notes: string[];
}

/**
 * Legitimacy Charter
 */
export interface LegitimacyCharter {
  version: string;
  adopted_at: string;
  
  core_principle: string;
  criteria: CriterionDefinition[];
  
  what_legitimacy_is: string[];
  what_legitimacy_is_not: string[];
  
  enforcement_method: string;
  amendment_process: string;
}
