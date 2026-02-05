/**
 * TRUST ANCHOR — TYPES
 * 
 * When truth gets a fixed point in time.
 * Civilizational design.
 */

/**
 * Artifact types that can be included in snapshots
 */
export type SnapshotArtifactType =
  | 'ontology'
  | 'decision_standards'
  | 'reference_cases'
  | 'legitimacy_rules'
  | 'semantic_definitions'
  | 'governance_charter'
  | 'methodology_specs'
  | 'data_constitution';

/**
 * Immutable Truth Snapshot (ITS)
 * Created at regular intervals (e.g., quarterly)
 */
export interface ImmutableTruthSnapshot {
  snapshot_id: string;
  version: string;
  
  // Timing
  period: string; // e.g., "2030_Q1"
  timestamp: string; // ISO timestamp
  
  // Content
  included_artifacts: SnapshotArtifactType[];
  artifact_hashes: Record<SnapshotArtifactType, string>;
  
  // Verification
  root_hash: string; // Merkle root of all artifacts
  previous_snapshot_hash: string | null; // Chain link
  
  // Metadata
  created_by: 'system_automatic' | 'governance_manual';
  witness_count: number;
  
  // Immutability
  is_sealed: boolean;
  sealed_at?: string;
}

/**
 * Mirror Institution
 * Third parties that hold copies of snapshots
 */
export interface MirrorInstitution {
  id: string;
  name: string;
  type: 'academic' | 'archive' | 'foundation' | 'data_bank' | 'government';
  jurisdiction: string;
  
  // Status
  is_active: boolean;
  last_sync: string;
  snapshots_held: string[]; // snapshot_ids
  
  // Verification
  public_key?: string;
  verification_endpoint?: string;
}

/**
 * AI Compatibility Layer
 * Ensures future AI can understand historical context
 */
export interface AICompatibilityMetadata {
  snapshot_id: string;
  
  // What future AI needs to know
  decision_context_schema_version: string;
  semantic_definitions_version: string;
  
  // Self-describing structure
  ontology_explanation: string;
  methodology_explanation: string;
  
  // Verification instructions
  how_to_verify_integrity: string;
  how_to_compare_to_later_versions: string;
  
  // Temporal context
  what_was_known_at_time: string[];
  what_was_not_known_at_time: string[];
  dominant_uncertainties: string[];
}

/**
 * Time-Proof Test Result
 * "Can this still be true in 30 years?"
 */
export interface TimeProofTestResult {
  test_id: string;
  tested_at: string;
  
  // Subject
  feature_name: string;
  feature_description: string;
  
  // The test
  question: 'If someone reads this in 2055, can they understand what we knew, what we did not know, and why decisions were made?';
  
  // Result
  passes: boolean;
  
  // If fails
  failure_reasons?: string[];
  required_changes?: string[];
  
  // If passes
  durability_factors?: string[];
}

/**
 * Death Mode Configuration
 * What survives if everything fails
 */
export interface DeathModeConfig {
  // What must survive
  essential_artifacts: SnapshotArtifactType[];
  
  // Where they survive
  minimum_mirror_count: number;
  required_jurisdictions: string[];
  
  // How they survive
  export_formats: ('json' | 'xml' | 'csv' | 'markdown')[];
  include_verification_tools: boolean;
  include_self_description: boolean;
  
  // Access
  public_after_death: boolean;
  no_authentication_required: boolean;
}

/**
 * Trust Anchor Status
 */
export interface TrustAnchorStatus {
  latest_snapshot: ImmutableTruthSnapshot | null;
  total_snapshots: number;
  chain_valid: boolean;
  
  // Mirrors
  active_mirrors: number;
  total_mirrors: number;
  mirror_coverage_by_jurisdiction: Record<string, number>;
  
  // Durability
  oldest_snapshot_age_years: number;
  time_proof_test_pass_rate: number;
  
  // Death mode readiness
  death_mode_ready: boolean;
  essential_artifacts_mirrored: boolean;
}

/**
 * Verification Request
 */
export interface SnapshotVerificationRequest {
  snapshot_id: string;
  artifact_type?: SnapshotArtifactType;
  requester: string;
  purpose: string;
}

/**
 * Verification Result
 */
export interface SnapshotVerificationResult {
  snapshot_id: string;
  verified_at: string;
  
  // Results
  hash_valid: boolean;
  chain_valid: boolean;
  mirrors_confirmed: number;
  
  // Details
  computed_hash: string;
  expected_hash: string;
  verification_path: string[];
}
