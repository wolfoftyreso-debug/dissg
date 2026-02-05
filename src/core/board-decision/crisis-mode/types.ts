/**
 * CRISIS-MODE DECISION ENGINE — TYPES
 * 
 * When time is short, consequences large, and mistakes cost people.
 * Crisis explains tempo. NOT responsibility abandonment.
 */

import type { OrganizationType } from '../types';

/**
 * Crisis severity level
 */
export type CrisisSeverity = 'elevated' | 'high' | 'critical' | 'extreme';

/**
 * Crisis time horizon
 */
export type CrisisTimeHorizon = 'hours' | 'days' | 'days-weeks' | 'weeks-months';

/**
 * Crisis Context Snapshot (CCS)
 * Freezes the current state when crisis is declared
 */
export interface CrisisContextSnapshot {
  crisis_id: string;
  declared_at: string;
  declared_by: string;
  
  reason: string;
  severity: CrisisSeverity;
  
  scope: {
    geo: string;
    population_affected: string | number;
    organization_type?: OrganizationType;
    time_horizon: CrisisTimeHorizon;
  };
  
  // What triggered the crisis
  trigger_indicators: Array<{
    indicator: string;
    threshold_exceeded: string;
    current_value: string;
  }>;
  
  // Baseline frozen at declaration
  baseline_snapshot: {
    key_metrics: Record<string, number | string>;
    captured_at: string;
  };
  
  // Status
  status: 'active' | 'resolved' | 'escalated';
  resolved_at?: string;
  resolution_reason?: string;
}

/**
 * Compressed Decision Preparation Document (C-DPD)
 * Minimal but complete documentation for crisis decisions
 */
export interface CompressedDPD {
  cdpd_id: string;
  crisis_id: string;
  created_at: string;
  
  // Core requirement 1: Context (compressed)
  decision_statement: string;
  
  // Core requirement 2: Alternatives (minimum 2)
  alternatives: Array<{
    id: string;
    label: string;
    key_tradeoff: string;
  }>;
  
  // Core requirement 3: Known risks
  known_risks: string[];
  
  // Core requirement 4: Unknowns (minimum 1)
  unknowns: string[];
  
  // Core requirement 5: Time constraint (always required)
  time_constraint: {
    decision_deadline: string;
    urgency_reason: string;
  };
  
  // Metadata
  prepared_by: string;
  preparation_time_minutes: number;
}

/**
 * Time-bound crisis decision
 * All crisis decisions MUST have expiry
 */
export interface CrisisDecision {
  decision_id: string;
  cdpd_id: string;
  crisis_id: string;
  
  decision_taken: string;
  decided_at: string;
  decided_by: string[];
  
  // MANDATORY: No crisis decision can become permanent by default
  time_bounds: {
    effective_from: string;
    expires_at: string;
    review_required: true;
    max_extensions: number;
    current_extensions: number;
  };
  
  // Acknowledgements (short but sharp friction)
  acknowledgements: {
    uncertainty_acknowledged: boolean;
    uncertainty_acknowledged_by: string;
    time_limit_acknowledged: boolean;
    time_limit_acknowledged_by: string;
    impact_acknowledged: boolean;
    impact_acknowledged_by: string;
  };
  
  // Lock
  context_snapshot_id: string;
  locked: boolean;
}

/**
 * Crisis decision extension request
 */
export interface CrisisExtensionRequest {
  extension_id: string;
  decision_id: string;
  
  requested_at: string;
  requested_by: string;
  
  new_expiry: string;
  justification: string;
  
  // Must reassess
  reassessment: {
    original_unknowns_resolved: string[];
    new_unknowns_identified: string[];
    risks_materialized: string[];
  };
  
  approved: boolean;
  approved_by?: string;
  approved_at?: string;
}

/**
 * Post-crisis audit (OBLIGATORY)
 * Generated automatically when crisis is resolved
 */
export interface PostCrisisAudit {
  audit_id: string;
  crisis_id: string;
  
  generated_at: string;
  
  // Summary
  summary: {
    crisis_duration_hours: number;
    decisions_taken: number;
    decisions_extended: number;
    temporary_measures_made_permanent: number;
    known_risks_ignored: number;
    unknown_risks_materialized: number;
  };
  
  // Decision log
  decisions: Array<{
    decision_id: string;
    statement: string;
    decided_at: string;
    expired_at: string;
    was_extended: boolean;
    outcome_observed?: string;
  }>;
  
  // Lessons (patterns, not judgments)
  lessons: Array<{
    category: 'timing' | 'information_gap' | 'coordination' | 'communication' | 'scope';
    observation: string;
    frequency: number;
  }>;
  
  // NOT blame. NOT legal. Institutional memory.
  disclaimer: string;
}

/**
 * Crisis friction checkpoints
 */
export interface CrisisFrictionCheckpoint {
  checkpoint_type: 'uncertainty' | 'time_limit' | 'impact';
  prompt: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}
