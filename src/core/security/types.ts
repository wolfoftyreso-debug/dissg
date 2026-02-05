/**
 * SYSTEM HARDENING & SECURITY — TYPES
 * 
 * Defense-in-depth for decision truth.
 * 
 * Threat Model (realistic, not paranoid):
 * 1. Data manipulation (alter history, "clean up" uncertainty)
 * 2. Semantic corruption (sneak in ranking, recommendation)
 * 3. API misuse (write without legitimacy)
 * 4. AI hallucination coupling (agents making things up)
 * 5. Insider risk (well-meaning improvements)
 * 6. External pressure (legal, PR, commercial)
 * 
 * We ignore:
 * - DDoS (standard infra)
 * - UI defacement (superficial)
 */

// ============================================================================
// THREAT MODEL
// ============================================================================

export type ThreatCategory = 
  | 'data_manipulation'
  | 'semantic_corruption'
  | 'api_misuse'
  | 'ai_hallucination'
  | 'insider_risk'
  | 'external_pressure';

export interface Threat {
  readonly category: ThreatCategory;
  readonly description: string;
  readonly mitigations: string[];
  readonly severity: 'critical' | 'high' | 'medium';
}

// ============================================================================
// CRYPTOGRAPHIC INTEGRITY
// ============================================================================

export interface HashableEvent {
  readonly event_id: string;
  readonly prev_hash: string;
  readonly payload_hash: string;
  readonly hash: string;
  readonly timestamp: string;
}

export interface MerkleRoot {
  readonly root_hash: string;
  readonly period: 'daily' | 'weekly';
  readonly event_count: number;
  readonly created_at: string;
  readonly published_to: string[];
}

// ============================================================================
// ROLE SEPARATION
// ============================================================================

export type SystemRole = 
  | 'reader'      // Can read only
  | 'contributor' // Can read + write
  | 'locker'      // Can read + lock
  | 'steward'     // Can read + ontology (with process)
  | 'operator';   // Infrastructure only, no data access

export interface RolePermissions {
  readonly role: SystemRole;
  readonly can_read: boolean;
  readonly can_write: boolean;
  readonly can_lock: boolean;
  readonly can_change_ontology: boolean | 'with_process';
}

// ============================================================================
// ONTOLOGY LOCKS
// ============================================================================

export interface OntologyVersion {
  readonly version: string;
  readonly immutable: true;
  readonly created_at: string;
  readonly locked_at: string;
  readonly api_version: string;
}

export interface OntologyChangeRequest {
  readonly from_version: string;
  readonly to_version: string;
  readonly public_diff_url: string;
  readonly backward_compatible: boolean;
  readonly delay_days: number; // minimum 90
  readonly status: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// AI SAFETY BOUNDARY
// ============================================================================

export type AIAllowedAction = 
  | 'read_read_models'
  | 'call_query_compiler'
  | 'suggest_missing_fields';

export type AIForbiddenAction = 
  | 'write_events'
  | 'lock_decisions'
  | 'create_alternatives'
  | 'formulate_conclusion';

export interface AgentRateLimit {
  readonly agent_id: string;
  readonly decision_id: string | null;
  readonly gravity_score: number;
  readonly requests_per_minute: number;
  readonly requests_per_hour: number;
}

// ============================================================================
// ANTI-SUMMARY GUARD
// ============================================================================

export interface ForbiddenPhrase {
  readonly pattern: string;
  readonly regex: RegExp;
  readonly category: 'conclusion' | 'recommendation' | 'ranking';
  readonly severity: 'block' | 'warn';
}

// ============================================================================
// AUDIT & FORENSICS
// ============================================================================

export interface AuditEvent {
  readonly event_id: string;
  readonly event_type: string;
  readonly actor_id: string;
  readonly actor_role: SystemRole;
  readonly timestamp: string;
  readonly payload_hash: string;
  readonly success: boolean;
  readonly failure_reason: string | null;
}

export interface TamperAlert {
  readonly alert_id: string;
  readonly alert_type: 'hash_mismatch' | 'forbidden_field' | 'unauthorized_role' | 'chain_break';
  readonly detected_at: string;
  readonly details: Record<string, unknown>;
  readonly severity: 'critical' | 'high';
}

// ============================================================================
// DISASTER MODES
// ============================================================================

export type DisasterMode = 
  | 'infra_down'      // Read-only snapshots continue
  | 'org_gone'        // Public mirrors live
  | 'key_loss'        // Multi-sig + threshold recovery
  | 'hostile_takeover'; // Ontology + Charter cannot change fast enough

export interface DisasterResponse {
  readonly mode: DisasterMode;
  readonly trigger: string;
  readonly automatic_actions: string[];
  readonly manual_actions: string[];
}

// ============================================================================
// RED TEAM
// ============================================================================

export interface RedTeamTest {
  readonly test_id: string;
  readonly description: string;
  readonly attack_vector: string;
  readonly expected_result: 'blocked' | 'detected';
  readonly frequency: 'quarterly';
}

// ============================================================================
// COMMAND VALIDATION
// ============================================================================

export interface ValidationGate {
  readonly name: string;
  readonly order: number;
  readonly required: boolean;
  readonly validator: string;
}

export interface WriteAttempt {
  readonly attempt_id: string;
  readonly command_type: string;
  readonly actor_id: string;
  readonly passed_gates: string[];
  readonly failed_gate: string | null;
  readonly allowed: boolean;
  readonly timestamp: string;
}
