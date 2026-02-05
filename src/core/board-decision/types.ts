/**
 * BOARD DECISION PREP ENGINE - TYPES
 * 
 * Types for Decision Preparation Documents.
 * System EXPOSES reality, never RECOMMENDS.
 */

/**
 * ORGANIZATION TYPE
 */
export type OrganizationType =
  | 'housing_association'
  | 'investment_board'
  | 'corporate_board'
  | 'foundation'
  | 'public_committee'
  | 'municipal_board';

/**
 * DECISION INPUT
 */
export interface DecisionInput {
  organization_type: OrganizationType;
  decision_context: string;
  scope: {
    geo: string;
    population_affected: number;
    time_horizon: string;
  };
  constraints: string[];
  decision_domain?: string;
}

/**
 * DECISION ALTERNATIVE (NEUTRAL)
 */
export interface DecisionAlternative {
  id: string;
  label: string;
  description: string;
  assumptions: string[];
  requires: string[];
  blocks: string[];
}

/**
 * CONSEQUENCE DIMENSION
 */
export type ConsequenceDimensionType = 
  | 'economy' 
  | 'liquidity' 
  | 'risk_over_time' 
  | 'reversibility' 
  | 'operational' 
  | 'regulatory' 
  | 'reputational';

export interface ConsequenceDimension {
  dimension: ConsequenceDimensionType | string;
  visible_effect: boolean;
  uncertainty: 'low' | 'medium' | 'high' | 'unknown';
  time_dependency: string;
  notes: string | null;
}

/**
 * RELEVANT DATA POINT
 */
export interface RelevantDataPoint {
  source: string;
  metric: string;
  baseline: number | null;
  current: number | null;
  trend: 'improving' | 'stable' | 'declining' | 'unknown';
  uncertainty: number;
  last_updated: string;
}

/**
 * KNOWLEDGE STATUS
 */
export interface KnowledgeStatus {
  known: string[];
  uncertain: string[];
  unknown: string[];
}

/**
 * IRREVERSIBILITY LEVEL
 */
export type IrreversibilityLevel = 'low' | 'medium' | 'high' | 'permanent';

/**
 * DECISION PREPARATION DOCUMENT (DPD)
 */
export interface DecisionPreparationDocument {
  dpd_id: string;
  generated_at: string;
  version: string;
  
  // 3.1 Overview
  overview: {
    decision_subject: string;
    population_affected: number;
    time_horizon: string;
    irreversibility: IrreversibilityLevel;
    organization_type: OrganizationType;
    geo_scope: string;
  };
  
  // 3.2 Alternatives (NEUTRAL)
  alternatives: DecisionAlternative[];
  
  // 3.3 Relevant Data
  relevant_data: RelevantDataPoint[];
  relevant_indexes: Array<{
    index_id: string;
    index_name: string;
    value: number;
    trend: string;
    relevance: 'primary' | 'secondary' | 'contextual';
  }>;
  
  // 3.4 Consequence Surfaces
  consequence_surfaces: Record<string, ConsequenceDimension[]>;
  
  // 3.5 Knowledge Status
  knowledge_status: KnowledgeStatus;
  
  // 3.6 Disclaimers (ALWAYS PRESENT)
  disclaimers: {
    not_a_recommendation: true;
    does_not_replace_responsibility: true;
    assumes_stated_assumptions: true;
    does_not_apply_to_individuals: true;
    custom: string[];
  };
  
  // Metadata
  constraints_acknowledged: string[];
  assumptions_explicit: string[];
}

/**
 * POST-DECISION LOCK
 */
export interface PostDecisionLock {
  lock_id: string;
  dpd_id: string;
  decision_taken: string;
  decision_date: string;
  context_snapshot_id: string;
  locked_at: string;
  locked_by: string;
  immutable: true;
}
