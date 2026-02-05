 /**
  * AGGREGATION TRAP (THE MOST DANGEROUS)
  * 
  * "Global inequality is increasing"
  * 
  * This statement is almost always malformed.
  * 
  * Self-test:
  * TRY global_aggregate WITHOUT population_weighting_permission
  * ASSERT rejected
  * 
  * Aggregation REQUIRES:
  * - Explicit weighting
  * - Explicit definition
  * - Explicit time
  * - Explicit source
  */
 
 /**
  * AGGREGATION REQUEST
  */
 export interface GlobalAggregationRequest {
   indicatorCode?: string;
   indicatorVersion?: number;
   geographies: string[];
   timeRange: { start: string; end: string };
   weightingMethod?: 'population' | 'gdp' | 'equal' | 'custom';
   source?: string;
 }
 
 /**
  * AGGREGATION PERMIT
  */
 export interface AggregationPermit {
   granted: boolean;
   permitId?: string;
   conditions?: string[];
   rejection?: {
     reason: string;
     missingRequirements: string[];
   };
 }
 
 /**
  * AGGREGATION TRAP DETECTOR
  */
 export class AggregationTrapDetector {
   /**
    * Request aggregation permit - MUST REJECT without all requirements
    */
   requestAggregationPermit(request: GlobalAggregationRequest): AggregationPermit {
     const missingRequirements: string[] = [];
 
     // Check all required elements
     if (!request.indicatorCode) {
       missingRequirements.push('EXPLICIT DEFINITION: Must specify exact inequality metric');
     }
 
     if (!request.indicatorVersion) {
       missingRequirements.push('EXPLICIT VERSION: Must specify methodology version');
     }
 
     if (!request.weightingMethod) {
       missingRequirements.push('EXPLICIT WEIGHTING: Must specify population/GDP/equal/custom weighting');
     }
 
     if (!request.source) {
       missingRequirements.push('EXPLICIT SOURCE: Must specify data source');
     }
 
     if (request.geographies.length < 2) {
       missingRequirements.push('EXPLICIT GEOGRAPHY: Must specify which countries to aggregate');
     }
 
     if (missingRequirements.length > 0) {
       return {
         granted: false,
         rejection: {
           reason: 'AGGREGATION DENIED: Missing required explicit parameters',
           missingRequirements,
         },
       };
     }
 
     // All requirements met - grant permit
     return {
       granted: true,
       permitId: `AGG-${Date.now()}`,
       conditions: [
         `Using ${request.indicatorCode} v${request.indicatorVersion}`,
         `Weighting: ${request.weightingMethod}`,
         `Source: ${request.source}`,
         `Countries: ${request.geographies.length}`,
       ],
     };
   }
 
   /**
    * Check weighting validity
    */
   checkWeightingValidity(
     weightingMethod: string,
     geographies: string[],
     year: number
   ): {
     valid: boolean;
     coverage: number;
     missingWeights: string[];
     warning?: string;
   } {
     // Simulate coverage check
     const coverage = 0.92; // 92% of world population covered
     const missingWeights = ['North Korea', 'Syria', 'Yemen']; // Example missing
 
     return {
       valid: coverage > 0.80,
       coverage,
       missingWeights,
       warning: coverage < 0.95
         ? `WARNING: Only ${(coverage * 100).toFixed(1)}% coverage. Missing: ${missingWeights.join(', ')}`
         : undefined,
     };
   }
 
   /**
    * SELF-TEST
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     // Try global aggregate without population weighting permission
     const badRequest: GlobalAggregationRequest = {
       geographies: ['USA', 'China', 'Germany'],
       timeRange: { start: '2010', end: '2020' },
       // Missing: indicatorCode, indicatorVersion, weightingMethod, source
     };
 
     const result = this.requestAggregationPermit(badRequest);
 
     return {
       passed: !result.granted,
       test: 'TRY global_aggregate WITHOUT population_weighting_permission → ASSERT rejected',
       result: result.granted
         ? 'CATASTROPHE: Aggregation permitted without explicit requirements'
         : `PASS: Rejected with ${result.rejection?.missingRequirements.length} missing requirements`,
     };
   }
 }