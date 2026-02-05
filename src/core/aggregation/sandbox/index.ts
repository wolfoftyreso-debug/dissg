/**
 * AGGREGATION SANDBOX – PUBLIC API
 * 
 * Isolated computation environment for descriptive patterns.
 * Sandbox sees world. World never sees sandbox directly.
 */

// Types
export type {
  AggregationSnapshot,
  AggregationJob,
  AggregationResultRaw,
  ExecutionLimits,
  JobStatus,
  GateName,
  GateResult,
  GateOutcome,
  ValidationPipelineResult,
  PromotionRecord,
  ExperimentalAggregation,
  ExternalSourceIntegration,
  SandboxAuditEntry,
} from './types';

export {
  JOB_STATUS,
  GATE_NAMES,
  GATE_RESULTS,
} from './types';

// Snapshot Builder
export {
  buildSnapshot,
  generateSnapshotId,
  calculateChecksum,
  validateSnapshot,
  snapshotRegistry,
  createNightlySnapshotConfig,
  type SnapshotConfig,
  type SnapshotValidationResult,
  type ScheduledSnapshotConfig,
} from './snapshot-builder';

// Job Executor
export {
  createJob,
  executeJob,
  executeBatch,
  jobQueue,
  DEFAULT_EXECUTION_LIMITS,
  STRICT_EXECUTION_LIMITS,
  type ExecutorResult,
  type BatchExecutionResult,
} from './job-executor';

// Validation Gates
export {
  validateSchema,
  scanNormativity,
  checkBoundaries,
  checkLegibility,
  runValidationPipeline,
  getGateDescription,
  getDispositionAction,
} from './validation-gates';

// Promotion Flow
export {
  checkPromotionEligibility,
  incrementVersion,
  incrementMinorVersion,
  createPromotionRecord,
  createDeprecationRecord,
  createAuditEntry,
  promotionRegistry,
  executePromotionFlow,
  type PromotionEligibility,
  type DeprecationRecord,
  type PromotionFlowResult,
} from './promotion';
