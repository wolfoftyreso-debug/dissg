/**
 * STEWARDSHIP & ANTI-CAPTURE FRAMEWORK — TYPES
 * 
 * Institutional immunology.
 * How the system is protected against power, money, ideology —
 * and well-meaning improvements.
 */

/**
 * The Four Separated Powers
 * These roles can NEVER overlap
 */
export type StewardshipRole =
  | 'truth_steward'      // Owns ontology, standards, legitimacy rules
  | 'system_operator'    // Runs infrastructure, scales performance
  | 'interface_designer' // Works with UX, never touches structure
  | 'external_verifier'; // Academia, auditors, independent bodies

/**
 * Role Definition
 */
export interface RoleDefinition {
  role: StewardshipRole;
  
  // What this role owns
  owns: string[];
  
  // What this role can do
  can_do: string[];
  
  // What this role can NEVER do
  never_can: string[];
  
  // Change authority
  change_authority: 'none' | 'propose' | 'approve' | 'execute';
}

/**
 * Change Request
 */
export interface ChangeRequest {
  id: string;
  
  // What
  target_component: 'ontology' | 'standards' | 'legitimacy_rules' | 'interface' | 'infrastructure';
  proposed_change: string;
  rationale: string;
  
  // Who
  proposed_by: StewardshipRole;
  proposed_at: string;
  
  // Validation
  passes_no_urgency_rule: boolean;
  urgency_justification_attempted?: string;
  urgency_rejection_reason?: string;
  
  // The only valid motivation
  increases_decision_legibility: boolean;
  maintains_uncertainty_visibility: boolean;
  
  // Latency
  effective_date: string; // Must be 18+ months from proposal
  preview_start_date: string;
  
  // Backward compatibility
  is_backward_compatible: boolean;
  migration_path?: string;
  
  // Status
  status: 'proposed' | 'preview' | 'approved' | 'rejected' | 'effective';
}

/**
 * Forbidden Revenue Sources
 */
export type ForbiddenRevenueSource =
  | 'recommendations'
  | 'ranking'
  | 'sponsorship'
  | 'affiliate'
  | 'outcome_based_compensation'
  | 'data_selling'
  | 'behavioral_targeting';

/**
 * Allowed Revenue Sources
 */
export type AllowedRevenueSource =
  | 'infrastructure_access'
  | 'sla_agreements'
  | 'private_mirrors'
  | 'integration_costs'
  | 'api_licensing'
  | 'enterprise_support';

/**
 * Economic Firewall Status
 */
export interface EconomicFirewallStatus {
  all_revenue_compliant: boolean;
  revenue_sources: AllowedRevenueSource[];
  violations: ForbiddenRevenueSource[];
  last_audit: string;
}

/**
 * Capture Attempt Detection
 */
export interface CaptureAttempt {
  id: string;
  detected_at: string;
  
  // The attempt
  type: 'urgency_pressure' | 'user_friendliness' | 'summarization' | 'choice_help' | 'conversion_optimization' | 'economic_pressure';
  description: string;
  proposed_by: string;
  
  // The argument used
  argument: string;
  
  // Why it's capture
  capture_mechanism: string;
  what_would_be_lost: string;
  
  // Response
  blocked: boolean;
  response: string;
}

/**
 * Succession Readiness
 */
export interface SuccessionReadiness {
  // Can the system survive without current people?
  documentation_complete: boolean;
  no_oral_traditions: boolean;
  no_implicit_understanding: boolean;
  
  // Can it be read?
  all_core_documented: boolean;
  documentation_is_structural: boolean;
  
  // Can it be verified?
  verification_instructions_embedded: boolean;
  third_party_verifiable: boolean;
  
  // Can it be understood?
  self_describing: boolean;
  context_preserved: boolean;
  
  // Score
  succession_score: number; // 0-1
}

/**
 * Anti-Capture Audit Result
 */
export interface AntiCaptureAudit {
  audit_id: string;
  performed_at: string;
  
  // Separation of powers
  role_separation_intact: boolean;
  role_violations: string[];
  
  // Change latency
  all_changes_have_latency: boolean;
  rushed_changes: string[];
  
  // Economic firewall
  economic_firewall_intact: boolean;
  revenue_violations: string[];
  
  // Capture attempts
  capture_attempts_detected: number;
  capture_attempts_blocked: number;
  
  // Overall
  system_integrity_score: number; // 0-1
}
