 /**
  * TRAVERSAL RULES
  * 
  * Defines how the graph can be navigated.
  * Machine-readable, no hidden shortcuts.
  */
 
 import type { BaseObjectType, RelationCategory } from './relation-types';
 
 /**
  * TRAVERSAL OPERATION TYPES
  */
 export type TraversalOperation = 
   | 'follow'           // Navigate along a relation
   | 'reverse'          // Navigate against a relation
   | 'aggregate'        // Collect all connected nodes
   | 'filter'           // Apply conditions
   | 'project'          // Extract specific fields
   | 'temporal_slice';  // Get state at specific time
 
 /**
  * TRAVERSAL DEPTH LIMITS
  * 
  * Prevents infinite loops and enforces query cost limits.
  */
 export const TRAVERSAL_LIMITS = {
   maxDepth: 10,                    // Maximum relation hops
   maxNodesPerLevel: 1000,          // Maximum nodes at any traversal level
   maxTotalNodes: 10000,            // Maximum total nodes in result
   timeoutMs: 30000,                // Maximum query execution time
   defaultPageSize: 100,            // Default pagination size
   maxPageSize: 500,                // Maximum pagination size
 } as const;
 
 /**
  * TRAVERSAL COST MODEL
  * 
  * Used for query optimization and rate limiting.
  */
 export interface TraversalCost {
   depth: number;
   estimatedNodes: number;
   estimatedTimeMs: number;
   complexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'expensive';
 }
 
 export function estimateTraversalCost(
   startNodes: number,
   depth: number,
   avgFanout: number = 5
 ): TraversalCost {
   const estimatedNodes = Math.min(
     startNodes * Math.pow(avgFanout, depth),
     TRAVERSAL_LIMITS.maxTotalNodes
   );
   
   const estimatedTimeMs = estimatedNodes * 0.1; // 0.1ms per node estimate
   
   let complexity: TraversalCost['complexity'];
   if (estimatedNodes < 10) complexity = 'trivial';
   else if (estimatedNodes < 100) complexity = 'simple';
   else if (estimatedNodes < 1000) complexity = 'moderate';
   else if (estimatedNodes < 5000) complexity = 'complex';
   else complexity = 'expensive';
   
   return {
     depth,
     estimatedNodes,
     estimatedTimeMs,
     complexity,
   };
 }
 
 /**
  * TRAVERSAL PATH SPECIFICATION
  * 
  * Declarative path definition for graph queries.
  */
 export interface TraversalPath {
   steps: TraversalStep[];
   options: TraversalOptions;
 }
 
 export interface TraversalStep {
   relation: string;
   direction: 'forward' | 'reverse';
   filter?: TraversalFilter;
   limit?: number;
 }
 
 export interface TraversalFilter {
   field: string;
   operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
   value: unknown;
 }
 
 export interface TraversalOptions {
   maxDepth: number;
   includePaths: boolean;
   temporalSlice?: string; // ISO timestamp - get state at this time
   includeSuperseded: boolean;
   pageSize: number;
   cursor?: string;
 }
 
 /**
  * DEFAULT TRAVERSAL OPTIONS
  */
 export const DEFAULT_TRAVERSAL_OPTIONS: TraversalOptions = {
   maxDepth: 3,
   includePaths: false,
   includeSuperseded: false,
   pageSize: TRAVERSAL_LIMITS.defaultPageSize,
 };
 
 /**
  * TRAVERSAL RESULT
  */
 export interface TraversalResult<T = unknown> {
   nodes: TraversalNode<T>[];
   paths?: TraversalPathResult[];
   metadata: TraversalMetadata;
 }
 
 export interface TraversalNode<T = unknown> {
   id: string;
   type: BaseObjectType;
   data: T;
   depth: number;
   reachedVia?: string; // Relation code
 }
 
 export interface TraversalPathResult {
   nodeIds: string[];
   relations: string[];
 }
 
 export interface TraversalMetadata {
   totalNodes: number;
   maxDepthReached: number;
   executionTimeMs: number;
   truncated: boolean;
   truncationReason?: string;
   nextCursor?: string;
   temporalSlice?: string;
 }
 
 /**
  * TRAVERSAL VALIDATION
  * 
  * Ensures traversal operations are valid before execution.
  */
 export interface TraversalValidation {
   valid: boolean;
   errors: string[];
   warnings: string[];
   estimatedCost: TraversalCost;
 }
 
 export function validateTraversal(path: TraversalPath): TraversalValidation {
   const errors: string[] = [];
   const warnings: string[] = [];
   
   // Check depth limit
   if (path.steps.length > TRAVERSAL_LIMITS.maxDepth) {
     errors.push(`Traversal depth ${path.steps.length} exceeds maximum ${TRAVERSAL_LIMITS.maxDepth}`);
   }
   
   // Check options
   if (path.options.maxDepth > TRAVERSAL_LIMITS.maxDepth) {
     errors.push(`Requested maxDepth ${path.options.maxDepth} exceeds limit ${TRAVERSAL_LIMITS.maxDepth}`);
   }
   
   if (path.options.pageSize > TRAVERSAL_LIMITS.maxPageSize) {
     warnings.push(`Requested pageSize ${path.options.pageSize} capped to ${TRAVERSAL_LIMITS.maxPageSize}`);
   }
   
   // Estimate cost
   const estimatedCost = estimateTraversalCost(1, path.steps.length);
   
   if (estimatedCost.complexity === 'expensive') {
     warnings.push('Query is expensive - consider adding filters or reducing depth');
   }
   
   return {
     valid: errors.length === 0,
     errors,
     warnings,
     estimatedCost,
   };
 }
 
 /**
  * FORBIDDEN TRAVERSAL PATTERNS
  * 
  * Anti-patterns that must be blocked.
  */
 export const FORBIDDEN_PATTERNS = {
   /**
    * Self-referential loops without bounds
    */
   unboundedRecursion: {
     description: 'Traversal that can loop infinitely',
     detection: 'Same relation type repeated without depth limit',
   },
   
   /**
    * Queries that ignore temporal axis
    */
   temporallyBlind: {
     description: 'Query that mixes data from different time periods without awareness',
     detection: 'Aggregation without temporal_slice or time bounds',
   },
   
   /**
    * Superseded data treated as current
    */
   staleDataAccess: {
     description: 'Accessing superseded data without explicit flag',
     detection: 'includeSuperseded=false but query returns superseded nodes',
   },
   
   /**
    * Cross-source aggregation without declaration
    */
   blindAggregation: {
     description: 'Aggregating data from multiple sources without source awareness',
     detection: 'Aggregation spanning multiple source IDs without explicit handling',
   },
 } as const;
 
 /**
  * ALLOWED TRAVERSAL PATTERNS BY CATEGORY
  */
 export const TRAVERSAL_PATTERNS: Record<RelationCategory, {
   allowedOperations: TraversalOperation[];
   requiresTemporalContext: boolean;
   maxDefaultDepth: number;
 }> = {
   structural: {
     allowedOperations: ['follow', 'reverse', 'aggregate', 'filter'],
     requiresTemporalContext: false,
     maxDefaultDepth: 5,
   },
   temporal: {
     allowedOperations: ['follow', 'reverse', 'temporal_slice', 'filter'],
     requiresTemporalContext: true,
     maxDefaultDepth: 10,
   },
   semantic: {
     allowedOperations: ['follow', 'reverse', 'aggregate', 'filter'],
     requiresTemporalContext: false,
     maxDefaultDepth: 3,
   },
   provenance: {
     allowedOperations: ['follow', 'reverse', 'aggregate'],
     requiresTemporalContext: false,
     maxDefaultDepth: 5,
   },
   measurement: {
     allowedOperations: ['follow', 'reverse', 'aggregate', 'temporal_slice', 'project'],
     requiresTemporalContext: true,
     maxDefaultDepth: 3,
   },
   supersession: {
     allowedOperations: ['follow', 'reverse'],
     requiresTemporalContext: true,
     maxDefaultDepth: 10, // Version chains can be long
   },
 };