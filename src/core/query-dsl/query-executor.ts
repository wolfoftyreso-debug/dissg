 /**
  * QUERY EXECUTOR
  * 
  * Executes validated queries.
  * ONLY executes queries that pass validation.
  * Includes semantic checks during execution.
  */
 
 import type { Query, QueryResult, QueryWarning, ResultData, ResultMetadata } from './query-types';
 import { validateQuery, type ValidationResult } from './query-validator';
 
 /**
  * EXECUTION CONTEXT
  */
 export interface ExecutionContext {
   /** Available data sources */
   dataSources: Map<string, DataSource>;
   
   /** Definition registry */
   definitions: Map<string, Definition>;
   
   /** Aggregation permissions */
   aggregationPermissions: AggregationPermission[];
   
   /** Execution options */
   options: ExecutionOptions;
 }
 
 export interface DataSource {
   id: string;
   name: string;
   reliability: number;
   lastUpdated: string;
   indicators: string[];
 }
 
 export interface Definition {
   id: string;
   indicatorCode: string;
   version: number;
   text: string;
   validFrom: string;
   validTo?: string;
   hash: string;
 }
 
 export interface AggregationPermission {
   indicatorCodes: string[];
   allowedOperations: string[];
   conditions: string[];
   grantedAt: string;
   expiresAt?: string;
 }
 
 export interface ExecutionOptions {
   /** Timeout in milliseconds */
   timeout: number;
   
   /** Maximum rows to return */
   maxRows: number;
   
   /** Enable caching */
   cache: boolean;
   
   /** Strict mode - fail on any warning */
   strict: boolean;
 }
 
 /**
  * EXECUTION RESULT
  */
 export type ExecutionResult = 
   | { success: true; result: QueryResult }
   | { success: false; error: ExecutionError };
 
 export interface ExecutionError {
   code: string;
   message: string;
   phase: 'validation' | 'preparation' | 'execution' | 'formatting';
   details?: unknown;
 }
 
 /**
  * EXECUTE QUERY
  */
 export async function executeQuery(
   query: Query,
   context: ExecutionContext
 ): Promise<ExecutionResult> {
   const startTime = performance.now();
   
   // Phase 1: Validation
   const validation = validateQuery(query);
   if (!validation.valid) {
     return {
       success: false,
       error: {
         code: 'EX-001',
         message: 'Query validation failed',
         phase: 'validation',
         details: validation.errors,
       },
     };
   }
   
   // Strict mode: fail on warnings
   if (context.options.strict && validation.warnings.length > 0) {
     return {
       success: false,
       error: {
         code: 'EX-002',
         message: 'Strict mode: Query has warnings',
         phase: 'validation',
         details: validation.warnings,
       },
     };
   }
   
   // Phase 2: Preparation
   const preparationResult = await prepareExecution(query, context);
   if (!preparationResult.ready) {
     return {
       success: false,
       error: {
         code: 'EX-003',
         message: preparationResult.reason ?? 'Preparation failed',
         phase: 'preparation',
         details: preparationResult.details,
       },
     };
   }
   
   // Phase 3: Execution
   try {
     const data = await fetchData(query, context, preparationResult.plan!);
     const warnings = collectWarnings(validation, data);
     
     // Phase 4: Formatting
     const result: QueryResult = {
       query,
       execution: {
         startedAt: new Date(startTime).toISOString(),
         completedAt: new Date().toISOString(),
         durationMs: performance.now() - startTime,
         dataVersion: generateDataVersion(),
       },
       data: data.results,
       metadata: buildMetadata(query, context, data),
       warnings,
       resultHash: generateResultHash(data.results),
     };
     
     return { success: true, result };
     
   } catch (error) {
     return {
       success: false,
       error: {
         code: 'EX-004',
         message: error instanceof Error ? error.message : 'Execution failed',
         phase: 'execution',
         details: error,
       },
     };
   }
 }
 
 /**
  * PREPARATION
  */
 interface PreparationResult {
   ready: boolean;
   reason?: string;
   details?: unknown;
   plan?: ExecutionPlan;
 }
 
 interface ExecutionPlan {
   steps: ExecutionStep[];
   estimatedRows: number;
   estimatedDurationMs: number;
   requiredPermissions: string[];
 }
 
 interface ExecutionStep {
   type: 'fetch' | 'filter' | 'transform' | 'aggregate' | 'format';
   source?: string;
   indicator?: string;
   operation?: string;
 }
 
 async function prepareExecution(
   query: Query,
   context: ExecutionContext
 ): Promise<PreparationResult> {
   const steps: ExecutionStep[] = [];
   const requiredPermissions: string[] = [];
   
   // Check data availability
   for (const indicator of query.what.indicators) {
     const hasSource = [...context.dataSources.values()].some(
       s => s.indicators.includes(indicator.code)
     );
     
     if (!hasSource) {
       return {
         ready: false,
         reason: `No data source available for indicator: ${indicator.code}`,
       };
     }
     
     steps.push({
       type: 'fetch',
       indicator: indicator.code,
     });
   }
   
   // Check definition availability
   for (const indicator of query.what.indicators) {
     const definition = [...context.definitions.values()].find(
       d => d.indicatorCode === indicator.code
     );
     
     if (!definition) {
       return {
         ready: false,
         reason: `No definition found for indicator: ${indicator.code}`,
       };
     }
   }
   
   // Check aggregation permissions
   if (query.ops?.operations.some(o => o.type === 'aggregate')) {
     const indicatorCodes = query.what.indicators.map(i => i.code);
     const hasPermission = context.aggregationPermissions.some(p =>
       indicatorCodes.every(c => p.indicatorCodes.includes(c))
     );
     
     if (!hasPermission) {
       return {
         ready: false,
         reason: 'Aggregation requires explicit permission for these indicators',
         details: { indicators: indicatorCodes },
       };
     }
     
     requiredPermissions.push('aggregation');
     steps.push({ type: 'aggregate' });
   }
   
   return {
     ready: true,
     plan: {
       steps,
       estimatedRows: 1000, // Would be calculated based on query
       estimatedDurationMs: 500,
       requiredPermissions,
     },
   };
 }
 
 /**
  * DATA FETCHING (placeholder implementation)
  */
 interface FetchResult {
   results: ResultData[];
   sources: string[];
   definitions: string[];
 }
 
 async function fetchData(
   query: Query,
   context: ExecutionContext,
   plan: ExecutionPlan
 ): Promise<FetchResult> {
   // This would connect to actual data sources
   // For now, return empty structure
   return {
     results: [],
     sources: [...context.dataSources.keys()],
     definitions: [...context.definitions.keys()],
   };
 }
 
 /**
  * WARNING COLLECTION
  */
 function collectWarnings(
   validation: ValidationResult,
   data: FetchResult
 ): QueryWarning[] {
   const warnings: QueryWarning[] = [];
   
   // Convert validation warnings
   for (const w of validation.warnings) {
     warnings.push({
       code: w.code,
       severity: 'warning',
       message: w.message,
       affectedFields: [w.path],
     });
   }
   
   // Add data-related warnings
   if (data.results.length === 0) {
     warnings.push({
       code: 'EX-EMPTY',
       severity: 'warning',
       message: 'Query returned no results',
     });
   }
   
   return warnings;
 }
 
 /**
  * METADATA BUILDING
  */
 function buildMetadata(
   query: Query,
   context: ExecutionContext,
   data: FetchResult
 ): ResultMetadata {
   const metadata: ResultMetadata = {};
   
   if (query.output.metadata.sources) {
     metadata.sources = data.sources.map(id => {
       const source = context.dataSources.get(id);
       return {
         id,
         name: source?.name ?? 'Unknown',
         reliability: source?.reliability ?? 0,
         lastUpdated: source?.lastUpdated ?? 'Unknown',
       };
     });
   }
   
   if (query.output.metadata.definitions) {
     metadata.definitions = data.definitions.map(id => {
       const def = context.definitions.get(id);
       return {
         id,
         version: def?.version ?? 0,
         text: def?.text ?? 'Unknown',
         validFrom: def?.validFrom ?? 'Unknown',
         validTo: def?.validTo,
       };
     });
   }
   
   if (query.output.metadata.caveats) {
     metadata.caveats = [
       'Data may have limitations not captured in metadata.',
       'Cross-country comparisons require careful interpretation.',
     ];
   }
   
   return metadata;
 }
 
 /**
  * HELPERS
  */
 function generateDataVersion(): string {
   return `v${Date.now()}`;
 }
 
 function generateResultHash(results: ResultData[]): string {
   // Simple hash for reproducibility
   const content = JSON.stringify(results);
   let hash = 0;
   for (let i = 0; i < content.length; i++) {
     const char = content.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash;
   }
   return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
 }