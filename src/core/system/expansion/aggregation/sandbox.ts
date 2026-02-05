 /**
  * AGGREGATION SANDBOX
  * 
  * Protects the core by running all new aggregations in isolation
  * 
  * - Runs on copies of read-models
  * - No writes
  * - No locks
  * - No recommendations
  */
 
 import type { AggregationType, AggregationResult } from './registry';
 
 export interface SandboxConfig {
   readonly sandbox_id: string;
   readonly created_at: string;
   readonly read_model_snapshot: string; // Hash of source data
   readonly isolation_level: 'full';
   readonly write_access: false;
   readonly lock_access: false;
   readonly recommendation_access: false;
 }
 
 export interface SandboxExecution {
   readonly execution_id: string;
   readonly sandbox_id: string;
   readonly aggregation_type: AggregationType;
   readonly started_at: string;
   readonly completed_at: string | null;
   readonly status: 'running' | 'completed' | 'failed' | 'rejected';
   readonly rejection_reason?: string;
 }
 
 export interface SandboxResult {
   readonly execution_id: string;
   readonly result: AggregationResult | null;
   readonly validation: {
     readonly passed: boolean;
     readonly checks: readonly {
       readonly check: string;
       readonly passed: boolean;
       readonly details?: string;
     }[];
   };
   readonly ready_for_publication: boolean;
 }
 
 /**
  * SANDBOX VALIDATION CHECKS
  */
 const SANDBOX_CHECKS = [
   {
     id: 'no_recommendations',
     description: 'Result contains no recommendations',
     check: (result: AggregationResult) => result.is_recommendation === false,
   },
   {
     id: 'has_limitations',
     description: 'Result includes limitations',
     check: (result: AggregationResult) => result.limitations.length > 0,
   },
   {
     id: 'minimum_samples',
     description: 'Meets minimum sample requirement',
     check: (result: AggregationResult) => result.sample_count >= 20,
   },
   {
     id: 'no_forbidden_phrases',
     description: 'Contains no forbidden phrases',
     check: (result: AggregationResult) => {
       const text = JSON.stringify(result).toLowerCase();
       const forbidden = ['best', 'worst', 'should', 'recommend', 'optimal'];
       return !forbidden.some(phrase => text.includes(phrase));
     },
   },
   {
     id: 'descriptive_only',
     description: 'Output is purely descriptive',
     check: (result: AggregationResult) => {
       const text = JSON.stringify(result).toLowerCase();
       const normative = ['must', 'should', 'ought', 'need to', 'have to'];
       return !normative.some(phrase => text.includes(phrase));
     },
   },
 ] as const;
 
 /**
  * Aggregation Sandbox Class
  */
 export class AggregationSandbox {
   private readonly config: SandboxConfig;
   private readonly executions: Map<string, SandboxExecution> = new Map();
   private readonly results: Map<string, SandboxResult> = new Map();
 
   constructor(config: Omit<SandboxConfig, 'write_access' | 'lock_access' | 'recommendation_access' | 'isolation_level'>) {
     this.config = {
       ...config,
       isolation_level: 'full',
       write_access: false,
       lock_access: false,
       recommendation_access: false,
     };
   }
 
   getConfig(): SandboxConfig {
     return this.config;
   }
 
   startExecution(aggregationType: AggregationType): string {
     const executionId = `EXEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
     
     const execution: SandboxExecution = {
       execution_id: executionId,
       sandbox_id: this.config.sandbox_id,
       aggregation_type: aggregationType,
       started_at: new Date().toISOString(),
       completed_at: null,
       status: 'running',
     };
     
     this.executions.set(executionId, execution);
     return executionId;
   }
 
   completeExecution(executionId: string, result: AggregationResult): SandboxResult {
     const execution = this.executions.get(executionId);
     if (!execution) {
       throw new Error(`Execution not found: ${executionId}`);
     }
     
     // Run all validation checks
     const checks = SANDBOX_CHECKS.map(check => ({
       check: check.id,
       passed: check.check(result),
       details: check.description,
     }));
     
     const allPassed = checks.every(c => c.passed);
     
     const sandboxResult: SandboxResult = {
       execution_id: executionId,
       result: allPassed ? result : null,
       validation: {
         passed: allPassed,
         checks,
       },
       ready_for_publication: allPassed,
     };
     
     // Update execution status
     this.executions.set(executionId, {
       ...execution,
       completed_at: new Date().toISOString(),
       status: allPassed ? 'completed' : 'rejected',
       rejection_reason: allPassed ? undefined : 'Validation failed',
     });
     
     this.results.set(executionId, sandboxResult);
     return sandboxResult;
   }
 
   getExecution(executionId: string): SandboxExecution | undefined {
     return this.executions.get(executionId);
   }
 
   getResult(executionId: string): SandboxResult | undefined {
     return this.results.get(executionId);
   }
 
   listExecutions(): readonly SandboxExecution[] {
     return Array.from(this.executions.values());
   }
 }
 
 export function createSandbox(snapshotHash: string): AggregationSandbox {
   return new AggregationSandbox({
     sandbox_id: `SANDBOX-${Date.now()}`,
     created_at: new Date().toISOString(),
     read_model_snapshot: snapshotHash,
   });
 }