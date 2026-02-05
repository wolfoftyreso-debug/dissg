/**
 * RESPONSIBILITY SCALING ENGINE — TYPES
 * 
 * Responsibility scales with consequence, not with title.
 * No shortcuts. No escape. Human-AI symmetry.
 */

/**
 * Affected Population Scale
 */
export type AffectedPopulation = 
  | '1'      // Individual
  | '10'     // Family/team
  | '100'    // Organization
  | '1000'   // Community
  | '10000'  // Region
  | '1M+'    // Nation/Global

/**
 * Time Horizon Scale
 */
export type TimeHorizon = 
  | 'minutes'
  | 'days'
  | 'months'
  | 'years'
  | 'decades'
  | 'generational'

/**
 * Irreversibility Level
 */
export type IrreversibilityLevel = 'low' | 'medium' | 'high' | 'permanent';

/**
 * Uncertainty Level
 */
export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'extreme';

/**
 * Decision Gravity Calculation Input
 */
export interface GravityInput {
  affected_population: AffectedPopulation;
  time_horizon: TimeHorizon;
  irreversibility: IrreversibilityLevel;
  uncertainty: UncertaintyLevel;
}

/**
 * Decision Gravity Result
 */
export interface GravityResult {
  decision_gravity: number; // 0-1
  class: 'trivial' | 'low' | 'medium' | 'high' | 'critical' | 'extreme';
  required_gates: GateType[];
  minimum_review_time_seconds: number;
  cooling_off_hours: number;
}

/**
 * Responsibility Gate Types
 */
export type GateType = 
  | 'scope_lock'
  | 'alternatives_exposure'
  | 'uncertainty_acknowledgement'
  | 'consequence_projection';

/**
 * Gate Status
 */
export interface GateStatus {
  gate: GateType;
  passed: boolean;
  passed_at?: string;
  data?: Record<string, unknown>;
  bypass_attempted?: boolean;
}

/**
 * Gate 1: Scope Lock
 */
export interface ScopeLockGate {
  who_affected: string[];
  when_affected: string;
  duration: string;
  locked_at: string;
  user_confirmed: boolean;
}

/**
 * Gate 2: Alternatives Exposure
 */
export interface AlternativesExposureGate {
  alternatives_shown: AlternativeOption[];
  minimum_alternatives: number;
  all_viewed: boolean;
  trade_offs_visible: boolean;
}

export interface AlternativeOption {
  id: string;
  title: string;
  description: string;
  trade_offs: string[];
  viewed: boolean;
}

/**
 * Gate 3: Uncertainty Acknowledgement
 */
export interface UncertaintyAcknowledgementGate {
  uncertainties: UncertaintyItem[];
  user_acknowledged: boolean;
  acknowledgement_text: string;
}

export interface UncertaintyItem {
  dimension: string;
  level: UncertaintyLevel;
  what_is_unknown: string;
  why_unknown: string;
}

/**
 * Gate 4: Consequence Projection
 */
export interface ConsequenceProjectionGate {
  projections: ConsequenceProjection[];
  worst_case_shown: boolean;
  user_reviewed: boolean;
}

export interface ConsequenceProjection {
  scenario: 'best' | 'expected' | 'worst';
  probability_range: [number, number]; // e.g., [0.1, 0.3]
  description: string;
  impact_dimensions: string[];
}

/**
 * Responsibility Session
 */
export interface ResponsibilitySession {
  session_id: string;
  decision_id: string;
  started_at: string;
  
  // Actor (human or AI)
  actor_type: 'human' | 'ai_agent';
  actor_id: string;
  
  // Gravity
  gravity_input: GravityInput;
  gravity_result: GravityResult;
  
  // Gates
  gate_statuses: GateStatus[];
  all_gates_passed: boolean;
  
  // Anti-escape
  escape_attempts: EscapeAttempt[];
  
  // Timing
  time_on_gates_seconds: number;
  cooling_off_completed: boolean;
  
  // Outcome
  decision_made: boolean;
  decision_timestamp?: string;
}

/**
 * Escape Attempt (logged, blocked)
 */
export interface EscapeAttempt {
  timestamp: string;
  attempt_type: EscapeAttemptType;
  description: string;
  blocked: boolean;
  block_reason: string;
}

export type EscapeAttemptType = 
  | 'gravity_manipulation'    // Tried to lower gravity manually
  | 'decision_splitting'      // Tried to break up decision
  | 'responsibility_deflection' // Tried to outsource to "experts"
  | 'process_hiding'          // Tried to hide behind procedure
  | 'gate_bypass'             // Tried to skip a gate
  | 'time_manipulation';      // Tried to skip waiting period

/**
 * Responsibility UX State
 */
export interface ResponsibilityUX {
  // Visual weight
  color_saturation: number;  // 0-100, lower = heavier
  tempo_multiplier: number;  // 1 = normal, 0.5 = slow
  
  // Required interactions
  forced_scroll: boolean;
  confirmation_required: boolean;
  double_confirmation_required: boolean;
  
  // Messaging
  tone: 'neutral' | 'measured' | 'grave';
  
  // No moral language
  forbidden_phrases: string[];
}

/**
 * Human-AI Symmetry Enforcement
 */
export interface SymmetryEnforcement {
  same_gravity: boolean;
  same_gates: boolean;
  same_requirements: boolean;
  actor_type: 'human' | 'ai_agent';
  
  // Audit trail
  decisions_traceable_to_actor: boolean;
  no_blame_transfer_allowed: boolean;
}
