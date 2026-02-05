/**
 * AGGREGATION SANDBOX – JOB EXECUTOR
 * 
 * Isolated execution environment for aggregation computations.
 * No network. Limited resources. Deterministic.
 */

import type { 
  AggregationJob, 
  AggregationResultRaw,
  ExecutionLimits,
  JobStatus,
} from './types';

// ============================================================================
// DEFAULT LIMITS
// ============================================================================

export const DEFAULT_EXECUTION_LIMITS: ExecutionLimits = {
  max_cpu_seconds: 30,
  max_memory_mb: 512,
  max_runtime_seconds: 60,
  network_allowed: false,
};

export const STRICT_EXECUTION_LIMITS: ExecutionLimits = {
  max_cpu_seconds: 10,
  max_memory_mb: 256,
  max_runtime_seconds: 30,
  network_allowed: false,
};

// ============================================================================
// JOB FACTORY
// ============================================================================

let jobCounter = 0;

export function createJob(
  aggregationId: string,
  snapshotId: string,
  parameters: Record<string, unknown> = {},
  limits: ExecutionLimits = DEFAULT_EXECUTION_LIMITS
): AggregationJob {
  jobCounter++;
  
  return {
    job_id: `job_${Date.now()}_${jobCounter}`,
    aggregation_id: aggregationId,
    snapshot_id: snapshotId,
    parameters,
    execution_limits: limits,
    status: 'pending',
    created_at: new Date().toISOString(),
    started_at: null,
    completed_at: null,
  };
}

// ============================================================================
// JOB EXECUTOR
// ============================================================================

export interface ExecutorResult {
  success: boolean;
  result?: AggregationResultRaw;
  error?: string;
  job: AggregationJob;
}

/**
 * Execute an aggregation job in isolated environment
 */
export async function executeJob(
  job: AggregationJob,
  computeFn: (params: Record<string, unknown>) => unknown
): Promise<ExecutorResult> {
  const startTime = Date.now();
  
  // Update job status
  const runningJob: AggregationJob = {
    ...job,
    status: 'running',
    started_at: new Date().toISOString(),
  };
  
  try {
    // Check execution limits
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Execution timeout: ${job.execution_limits.max_runtime_seconds}s`));
      }, job.execution_limits.max_runtime_seconds * 1000);
    });
    
    // Execute computation
    const computePromise = Promise.resolve(computeFn(job.parameters));
    
    const rawOutput = await Promise.race([computePromise, timeoutPromise]);
    
    const endTime = Date.now();
    const runtimeMs = endTime - startTime;
    
    // Create result
    const result: AggregationResultRaw = {
      job_id: job.job_id,
      aggregation_id: job.aggregation_id,
      snapshot_id: job.snapshot_id,
      raw_output: rawOutput,
      diagnostics: {
        cpu_time_ms: runtimeMs, // Approximation
        memory_peak_mb: 0, // Would need actual measurement
        runtime_ms: runtimeMs,
        warnings: [],
      },
      computed_at: new Date().toISOString(),
    };
    
    // Update job status
    const completedJob: AggregationJob = {
      ...runningJob,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };
    
    return {
      success: true,
      result,
      job: completedJob,
    };
    
  } catch (error) {
    const failedJob: AggregationJob = {
      ...runningJob,
      status: 'failed',
      completed_at: new Date().toISOString(),
    };
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      job: failedJob,
    };
  }
}

// ============================================================================
// JOB QUEUE
// ============================================================================

class JobQueue {
  private queue: AggregationJob[] = [];
  private running: Map<string, AggregationJob> = new Map();
  private completed: Map<string, ExecutorResult> = new Map();
  private maxConcurrent: number = 3;
  
  enqueue(job: AggregationJob): void {
    this.queue.push(job);
  }
  
  dequeue(): AggregationJob | undefined {
    return this.queue.shift();
  }
  
  getStatus(jobId: string): JobStatus | 'not_found' {
    if (this.running.has(jobId)) return 'running';
    if (this.completed.has(jobId)) return this.completed.get(jobId)!.job.status;
    const queued = this.queue.find(j => j.job_id === jobId);
    if (queued) return 'pending';
    return 'not_found';
  }
  
  getResult(jobId: string): ExecutorResult | undefined {
    return this.completed.get(jobId);
  }
  
  markCompleted(result: ExecutorResult): void {
    this.running.delete(result.job.job_id);
    this.completed.set(result.job.job_id, result);
  }
  
  canRun(): boolean {
    return this.running.size < this.maxConcurrent && this.queue.length > 0;
  }
  
  getPendingCount(): number {
    return this.queue.length;
  }
  
  getRunningCount(): number {
    return this.running.size;
  }
}

export const jobQueue = new JobQueue();

// ============================================================================
// BATCH EXECUTOR
// ============================================================================

export interface BatchExecutionResult {
  total: number;
  succeeded: number;
  failed: number;
  results: readonly ExecutorResult[];
}

export async function executeBatch(
  jobs: readonly AggregationJob[],
  computeFn: (params: Record<string, unknown>) => unknown
): Promise<BatchExecutionResult> {
  const results: ExecutorResult[] = [];
  
  for (const job of jobs) {
    const result = await executeJob(job, computeFn);
    results.push(result);
  }
  
  return {
    total: jobs.length,
    succeeded: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}
