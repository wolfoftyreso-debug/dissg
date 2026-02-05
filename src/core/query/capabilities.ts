 /**
  * QUERY LAYER CAPABILITIES
  * 
  * Data is the same everywhere.
  * Capability differs.
  * 
  * Free: Simple queries, single entities, basic relations
  * Premium: Deep graph traversal, batch queries, historical comparisons
  */
 
 // =============================================================================
 // CAPABILITY TIERS
 // =============================================================================
 
 export type CapabilityTier = 'free' | 'standard' | 'professional' | 'enterprise';
 
 export interface TierCapabilities {
   tier: CapabilityTier;
   
   // Query limits
   maxQueriesPerMinute: number;
   maxQueriesPerDay: number;
   maxResultsPerQuery: number;
   
   // Graph traversal
   maxTraversalDepth: number;
   allowCyclicTraversal: boolean;
   
   // Batch operations
   allowBatchQueries: boolean;
   maxBatchSize: number;
   
   // Historical access
   allowHistoricalQueries: boolean;
   maxHistoricalRangeMonths: number;
   
   // Advanced features
   allowAggregations: boolean;
   allowCorrelations: boolean;
   allowExport: boolean;
   exportFormats: string[];
   
   // AI/Model access
   allowModelOptimizedEndpoints: boolean;
   allowStreamingQueries: boolean;
 }
 
 export const CAPABILITY_TIERS: Record<CapabilityTier, TierCapabilities> = {
   free: {
     tier: 'free',
     maxQueriesPerMinute: 10,
     maxQueriesPerDay: 100,
     maxResultsPerQuery: 100,
     maxTraversalDepth: 1,
     allowCyclicTraversal: false,
     allowBatchQueries: false,
     maxBatchSize: 0,
     allowHistoricalQueries: false,
     maxHistoricalRangeMonths: 0,
     allowAggregations: false,
     allowCorrelations: false,
     allowExport: false,
     exportFormats: [],
     allowModelOptimizedEndpoints: false,
     allowStreamingQueries: false,
   },
   
   standard: {
     tier: 'standard',
     maxQueriesPerMinute: 60,
     maxQueriesPerDay: 1000,
     maxResultsPerQuery: 1000,
     maxTraversalDepth: 3,
     allowCyclicTraversal: false,
     allowBatchQueries: true,
     maxBatchSize: 10,
     allowHistoricalQueries: true,
     maxHistoricalRangeMonths: 12,
     allowAggregations: true,
     allowCorrelations: false,
     allowExport: true,
     exportFormats: ['json', 'csv'],
     allowModelOptimizedEndpoints: false,
     allowStreamingQueries: false,
   },
   
   professional: {
     tier: 'professional',
     maxQueriesPerMinute: 300,
     maxQueriesPerDay: 10000,
     maxResultsPerQuery: 10000,
     maxTraversalDepth: 6,
     allowCyclicTraversal: true,
     allowBatchQueries: true,
     maxBatchSize: 100,
     allowHistoricalQueries: true,
     maxHistoricalRangeMonths: 60,
     allowAggregations: true,
     allowCorrelations: true,
     allowExport: true,
     exportFormats: ['json', 'csv', 'parquet'],
     allowModelOptimizedEndpoints: true,
     allowStreamingQueries: true,
   },
   
   enterprise: {
     tier: 'enterprise',
     maxQueriesPerMinute: -1, // Unlimited
     maxQueriesPerDay: -1,    // Unlimited
     maxResultsPerQuery: -1,  // Unlimited
     maxTraversalDepth: -1,   // Unlimited
     allowCyclicTraversal: true,
     allowBatchQueries: true,
     maxBatchSize: -1,        // Unlimited
     allowHistoricalQueries: true,
     maxHistoricalRangeMonths: -1, // All history
     allowAggregations: true,
     allowCorrelations: true,
     allowExport: true,
     exportFormats: ['json', 'csv', 'parquet', 'avro', 'protobuf'],
     allowModelOptimizedEndpoints: true,
     allowStreamingQueries: true,
   },
 } as const;
 
 // =============================================================================
 // CAPABILITY CHECKS
 // =============================================================================
 
 export function checkCapability(
   tier: CapabilityTier,
   capability: keyof Omit<TierCapabilities, 'tier'>
 ): boolean | number | string[] {
   return CAPABILITY_TIERS[tier][capability];
 }
 
 export function canPerformQuery(
   tier: CapabilityTier,
   query: {
     traversalDepth?: number;
     batchSize?: number;
     historicalMonths?: number;
     requiresAggregation?: boolean;
     requiresCorrelation?: boolean;
   }
 ): { allowed: boolean; reason?: string } {
   const caps = CAPABILITY_TIERS[tier];
   
   if (query.traversalDepth && caps.maxTraversalDepth !== -1 && query.traversalDepth > caps.maxTraversalDepth) {
     return { allowed: false, reason: `Traversal depth ${query.traversalDepth} exceeds limit of ${caps.maxTraversalDepth}` };
   }
   
   if (query.batchSize && !caps.allowBatchQueries) {
     return { allowed: false, reason: 'Batch queries not allowed on this tier' };
   }
   
   if (query.batchSize && caps.maxBatchSize !== -1 && query.batchSize > caps.maxBatchSize) {
     return { allowed: false, reason: `Batch size ${query.batchSize} exceeds limit of ${caps.maxBatchSize}` };
   }
   
   if (query.historicalMonths && !caps.allowHistoricalQueries) {
     return { allowed: false, reason: 'Historical queries not allowed on this tier' };
   }
   
   if (query.historicalMonths && caps.maxHistoricalRangeMonths !== -1 && query.historicalMonths > caps.maxHistoricalRangeMonths) {
     return { allowed: false, reason: `Historical range ${query.historicalMonths} months exceeds limit of ${caps.maxHistoricalRangeMonths}` };
   }
   
   if (query.requiresAggregation && !caps.allowAggregations) {
     return { allowed: false, reason: 'Aggregations not allowed on this tier' };
   }
   
   if (query.requiresCorrelation && !caps.allowCorrelations) {
     return { allowed: false, reason: 'Correlations not allowed on this tier' };
   }
   
   return { allowed: true };
 }