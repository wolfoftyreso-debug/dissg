/**
 * ADOPTION BY INEVITABILITY — TYPES
 * 
 * How the system gets used because alternatives feel worse.
 * This is not "launch". This is gradual norm shift.
 */

/**
 * Adoption Entry Point
 * Start where decisions are already painful
 */
export type AdoptionEntryPoint =
  | 'board_capital_decision'
  | 'long_horizon_investment'
  | 'policy_with_criticism_risk'
  | 'major_purchase'
  | 'portfolio_allocation'
  | 'regulatory_compliance'
  | 'audit_preparation'
  | 'crisis_response';

/**
 * Adoption Vector
 * How adoption spreads without central sales
 */
export type AdoptionVector =
  | 'board_member_migration'
  | 'auditor_expectation'
  | 'media_inquiry'
  | 'ai_system_reference'
  | 'peer_comparison'
  | 'successor_inheritance'
  | 'regulator_adoption';

/**
 * Commitment Level
 */
export type CommitmentLevel =
  | 'zero_commitment'      // Single use, no account
  | 'light_touch'          // Occasional use
  | 'regular_use'          // Part of process
  | 'standard_practice'    // Default approach
  | 'cultural_norm';       // Can't imagine without

/**
 * Entry Point Definition
 */
export interface EntryPointDefinition {
  id: AdoptionEntryPoint;
  name: string;
  pain_description: string;
  protection_offered: string;
  typical_actors: string[];
  gravity_level: 'high' | 'critical' | 'extreme';
}

/**
 * Vector Definition
 */
export interface VectorDefinition {
  id: AdoptionVector;
  name: string;
  mechanism: string;
  unstoppable_because: string;
  typical_timeline_years: number;
}

/**
 * Zero Commitment Session
 * Use without commitment mode
 */
export interface ZeroCommitmentSession {
  session_id: string;
  tool_used: 'DPD' | 'CDP' | 'PDRC' | 'UDF';
  decision_context: string;
  started_at: string;
  completed_at?: string;
  
  // No account required
  no_account: true;
  no_contract: true;
  no_process_change: true;
  
  // Outcome
  structure_generated: boolean;
  exportable: boolean;
}

/**
 * Psychological Hook
 * The thing that makes people continue
 */
export interface PsychologicalHook {
  core_statement: string;
  triggers: string[];
  protection_feeling: string;
  without_it_feels: string;
}

/**
 * Adoption Metrics (What Actually Matters)
 */
export interface AdoptionMetrics {
  period_start: string;
  period_end: string;
  
  // NOT measured
  not_measured: {
    users: 'not_tracked';
    clicks: 'not_tracked';
    time_on_page: 'not_tracked';
  };
  
  // Actually measured
  decisions_with_locked_context: number;
  decisions_followed_up: number;
  decision_legibility_score: number; // 0-1
  post_hoc_explanation_reduction: number; // percentage decrease
  
  // Vector tracking
  board_member_migrations: number;
  auditor_requests: number;
  media_structure_inquiries: number;
  ai_system_references: number;
}

/**
 * Cultural Shift Indicator
 * Signs that the system is becoming infrastructure
 */
export interface CulturalShiftIndicator {
  indicator: string;
  observed: boolean;
  first_observed_at?: string;
  prevalence: 'rare' | 'occasional' | 'common' | 'standard';
}

/**
 * Long-Term Adoption State
 */
export interface LongTermAdoptionState {
  years_active: number;
  
  // Cultural indicators
  decisions_without_context_questioned: boolean;
  no_alternative_rejected: boolean;
  uncertainty_respected: boolean;
  fast_answers_lost_status: boolean;
  
  // Infrastructure status
  is_cultural_infrastructure: boolean;
  replacement_difficulty: 'easy' | 'moderate' | 'difficult' | 'impossible';
}

/**
 * Rollout Principle
 */
export interface RolloutPrinciple {
  principle: string;
  rationale: string;
  anti_pattern: string;
}

/**
 * Public Presence (Without Marketing)
 */
export interface PublicPresence {
  published: string[];
  not_published: string[];
  never_says: string[];
  lets_world_conclude: string[];
}
