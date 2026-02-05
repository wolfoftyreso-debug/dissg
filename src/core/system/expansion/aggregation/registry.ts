 /**
  * AGGREGATION REGISTRY
  * 
  * Manages all aggregation types with strict constraints
  */
 
 export type AggregationType = 
   | 'prevalence'
   | 'decision_pattern'
   | 'outcome_variance';
 
 export interface AggregationClass {
   readonly type: AggregationType;
   readonly dimensions: readonly string[];
   readonly interpretation: 'descriptive_only';
   readonly requires_minimum_samples: number;
   readonly forbidden_outputs: readonly string[];
 }
 
 export interface AggregationResult {
   readonly aggregation_id: string;
   readonly type: AggregationType;
   readonly computed_at: string;
   readonly sample_count: number;
   readonly dimensions_used: readonly string[];
   readonly result: Record<string, unknown>;
   readonly limitations: readonly string[];
   readonly is_recommendation: false; // Always false, enforced
 }
 
 /**
  * ALLOWED AGGREGATION TYPES
  */
 export const ALLOWED_AGGREGATIONS: readonly AggregationType[] = [
   'prevalence',
   'decision_pattern', 
   'outcome_variance',
 ] as const;
 
 /**
  * FORBIDDEN AGGREGATION OUTPUTS
  * 
  * These phrases can NEVER appear in aggregation results
  */
 export const FORBIDDEN_AGGREGATIONS = {
   rankings: [
     'top performers',
     'best outcomes',
     'most successful',
     'highest rated',
     'recommended',
     'optimal choice',
     'best choice',
     'worst performers',
     'lowest rated',
   ],
   recommendations: [
     'you should',
     'we recommend',
     'the best option is',
     'choose this',
     'avoid this',
     'preferred',
   ],
   causation: [
     'caused by',
     'resulted in',
     'led to',
     'because of',
     'due to',
   ],
 } as const;
 
 /**
  * Aggregation Registry Class
  */
 export class AggregationRegistry {
   private readonly aggregations: Map<string, AggregationClass> = new Map();
   private readonly results: Map<string, AggregationResult> = new Map();
 
   registerClass(id: string, aggregation: AggregationClass): void {
     if (!ALLOWED_AGGREGATIONS.includes(aggregation.type)) {
       throw new Error(`Aggregation type not allowed: ${aggregation.type}`);
     }
     if (aggregation.interpretation !== 'descriptive_only') {
       throw new Error('All aggregations must be descriptive_only');
     }
     this.aggregations.set(id, aggregation);
   }
 
   validateResult(result: AggregationResult): { valid: boolean; violations: string[] } {
     const violations: string[] = [];
     
     // Check recommendation flag
     if (result.is_recommendation !== false) {
       violations.push('is_recommendation must always be false');
     }
     
     // Check for forbidden phrases
     const resultText = JSON.stringify(result.result).toLowerCase();
     
     for (const phrase of FORBIDDEN_AGGREGATIONS.rankings) {
       if (resultText.includes(phrase.toLowerCase())) {
         violations.push(`Forbidden ranking phrase: "${phrase}"`);
       }
     }
     
     for (const phrase of FORBIDDEN_AGGREGATIONS.recommendations) {
       if (resultText.includes(phrase.toLowerCase())) {
         violations.push(`Forbidden recommendation phrase: "${phrase}"`);
       }
     }
     
     for (const phrase of FORBIDDEN_AGGREGATIONS.causation) {
       if (resultText.includes(phrase.toLowerCase())) {
         violations.push(`Forbidden causation phrase: "${phrase}"`);
       }
     }
     
     return { valid: violations.length === 0, violations };
   }
 
   storeResult(result: AggregationResult): void {
     const validation = this.validateResult(result);
     if (!validation.valid) {
       throw new Error(`Invalid aggregation: ${validation.violations.join(', ')}`);
     }
     this.results.set(result.aggregation_id, result);
   }
 
   getClass(id: string): AggregationClass | undefined {
     return this.aggregations.get(id);
   }
 
   getResult(id: string): AggregationResult | undefined {
     return this.results.get(id);
   }
 
   listClasses(): readonly AggregationClass[] {
     return Array.from(this.aggregations.values());
   }
 }
 
 export function createAggregationRegistry(): AggregationRegistry {
   return new AggregationRegistry();
 }