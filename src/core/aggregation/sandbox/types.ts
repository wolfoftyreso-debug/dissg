/**
 * AGGREGATION SANDBOX – TYPES
 * 
 * Isolated computation environment for descriptive patterns.
 * Read-only access to world. World never sees sandbox directly.
 */

// ============================================================================
// SNAPSHOT (DATA INGEST)
// ============================================================================

export interface AggregationSnapshot {
  /** Unique snapshot identifier */
  snapshot_id: string;
  
  /** Source read models used */
  source_models: readonly string[];
  
  /** Time window covered */
  time_window: {
    start: string;
    end: string;
  };
  
  /** Number of records */
  record_count: number;
  
  /** SHA-256 checksum for integrity */
  checksum: string;
  
  /** Creation timestamp */
  created_at: string;
  
  /** Schema version */
  schema_version: string;
}

// ============================================================================
// JOB EXECUTION
// ============================================================================

export const JOB_STATUS = [
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
] as const;

export type JobStatus = typeof JOB_STATUS[number];

export interface ExecutionLimits {
  /** Max CPU time in seconds */
  max_cpu_seconds: number;
  /** Max memory in MB */
  max_memory_mb: number;
  /** Max runtime in seconds */
  max_runtime_seconds: number;
  /** Network access (always false) */
  network_allowed: false;
}

export interface AggregationJob {
  /** Job identifier */
  job_id: string;
  
  /** Aggregation being computed */
  aggregation_id: string;
  
  /** Snapshot to process */
  snapshot_id: string;
  
  /** Computation parameters */
  parameters: Record<string, unknown>;
  
  /** Execution constraints */
  execution_limits: ExecutionLimits;
  
  /** Current status */
  status: JobStatus;
  
  /** Creation timestamp */
  created_at: string;
  
  /** Start timestamp */
  started_at: string | null;
  
  /** Completion timestamp */
  completed_at: string | null;
}

// ============================================================================
// RAW OUTPUT (INTERNAL ONLY)
// ============================================================================

export interface AggregationResultRaw {
  /** Job that produced this */
  job_id: string;
  
  /** Aggregation identifier */
  aggregation_id: string;
  
  /** Snapshot used */
  snapshot_id: string;
  
  /** Raw computation output */
  raw_output: unknown;
  
  /** Execution diagnostics */
  diagnostics: {
    cpu_time_ms: number;
    memory_peak_mb: number;
    runtime_ms: number;
    warnings: string[];
  };
  
  /** Timestamp */
  computed_at: string;
}

// ============================================================================
// VALIDATION GATES
// ============================================================================

export const GATE_NAMES = [
  'schema_validation',
  'normativity_scan',
  'boundary_check',
  'legibility_check',
] as const;

export type GateName = typeof GATE_NAMES[number];

export const GATE_RESULTS = [
  'pass',
  'fail',
  'warn',
] as const;

export type GateResult = typeof GATE_RESULTS[number];

export interface GateOutcome {
  /** Which gate */
  gate: GateName;
  
  /** Result */
  result: GateResult;
  
  /** Details */
  details: string;
  
  /** Violations found */
  violations: readonly string[];
  
  /** Timestamp */
  checked_at: string;
}

export interface ValidationPipelineResult {
  /** Job being validated */
  job_id: string;
  
  /** All gate outcomes */
  gates: readonly GateOutcome[];
  
  /** Overall pass/fail */
  passed: boolean;
  
  /** Final disposition */
  disposition: 'promote' | 'block' | 'deprecate' | 'cannot_answer';
  
  /** Steward alert required */
  requires_steward_review: boolean;
  
  /** Timestamp */
  validated_at: string;
}

// ============================================================================
// PROMOTION
// ============================================================================

export interface PromotionRecord {
  /** Promotion identifier */
  promotion_id: string;
  
  /** Source job */
  job_id: string;
  
  /** Aggregation being promoted */
  aggregation_id: string;
  
  /** New version */
  new_version: string;
  
  /** Previous version (null if first) */
  previous_version: string | null;
  
  /** Validation result */
  validation_result: ValidationPipelineResult;
  
  /** Promoted at */
  promoted_at: string;
  
  /** Promoted by (system or steward) */
  promoted_by: string;
}

// ============================================================================
// EXPERIMENTAL ZONE
// ============================================================================

export interface ExperimentalAggregation {
  /** Experiment identifier */
  experiment_id: string;
  
  /** Aggregation being tested */
  aggregation_id: string;
  
  /** Hypothesis being tested */
  hypothesis: string;
  
  /** Status */
  status: 'active' | 'concluded' | 'abandoned';
  
  /** Results (never public) */
  results: readonly AggregationResultRaw[];
  
  /** Started at */
  started_at: string;
  
  /** Concluded at */
  concluded_at: string | null;
  
  /** Conclusion (if any) */
  conclusion: string | null;
}

// ============================================================================
// INTEGRATION REGISTRY
// ============================================================================

export interface ExternalSourceIntegration {
  /** Integration identifier */
  integration_id: string;
  
  /** Source name */
  source_name: string;
  
  /** Connection type */
  connection_type: 'api' | 'file' | 'stream';
  
  /** Status */
  status: 'active' | 'paused' | 'deprecated';
  
  /** Last sync */
  last_sync_at: string | null;
  
  /** Known limitations */
  limitations: readonly string[];
  
  /** Bias annotations */
  known_biases: readonly string[];
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export interface SandboxAuditEntry {
  /** Entry identifier */
  entry_id: string;
  
  /** Action type */
  action: 'snapshot_created' | 'job_started' | 'job_completed' | 'validation_run' | 'promotion' | 'deprecation';
  
  /** Entity affected */
  entity_id: string;
  
  /** Details */
  details: Record<string, unknown>;
  
  /** Timestamp */
  timestamp: string;
}
