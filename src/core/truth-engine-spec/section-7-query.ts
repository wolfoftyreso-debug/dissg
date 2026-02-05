 /**
  * TRUTH ENGINE SPEC - SECTION 7
  * 
  * QUERY CONTRACT (AI-SAFE)
  */
 
 /**
  * 7.1 INVALID QUERIES
  * 
  * A query is INVALID if it lacks:
  * - definition
  * - time axis
  * - source
  * - uncertainty requirement
  */
 export interface ValidQuery {
   readonly definition_id: string;
   readonly time_range: {
     from: string;
     to: string;
   };
   readonly source_ids: string[] | 'all';
   readonly uncertainty_requirement: {
     max_uncertainty: number;
     min_coverage: number;
   };
   readonly geography?: string;
   readonly aggregation_permit_id?: string;
 }
 
 export function validateQuery(query: Partial<ValidQuery>): {
   valid: boolean;
   invalid_reasons: string[];
 } {
   const reasons: string[] = [];
   
   if (!query.definition_id) {
     reasons.push('Missing definition_id: Query must specify what is being measured');
   }
   
   if (!query.time_range) {
     reasons.push('Missing time_range: Query must specify temporal scope');
   }
   
   if (!query.source_ids) {
     reasons.push('Missing source_ids: Query must specify data sources');
   }
   
   if (!query.uncertainty_requirement) {
     reasons.push('Missing uncertainty_requirement: Query must declare acceptable uncertainty');
   }
   
   return {
     valid: reasons.length === 0,
     invalid_reasons: reasons,
   };
 }
 
 /**
  * 7.2 RESULT REQUIREMENT
  * 
  * ALL results MUST contain:
  * - value
  * - confidence_interval
  * - coverage
  * - definition_id
  * - time_range
  * - source_set
  */
 export interface ValidResult {
   readonly value: unknown;
   readonly confidence_interval: [number, number];
   readonly coverage: number;
   readonly definition_id: string;
   readonly time_range: {
     from: string;
     to: string;
   };
   readonly source_set: string[];
 }
 
 export function validateResult(result: Partial<ValidResult>): {
   valid: boolean;
   missing: string[];
 } {
   const required: (keyof ValidResult)[] = [
     'value',
     'confidence_interval',
     'coverage',
     'definition_id',
     'time_range',
     'source_set',
   ];
   
   const missing = required.filter(key => !(key in result) || result[key] === undefined);
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }
 
 /**
  * Query rejection
  */
 export interface QueryRejection {
   readonly query_id: string;
   readonly rejected_at: string;
   readonly reasons: string[];
   readonly suggested_corrections: string[];
 }
 
 export function rejectInvalidQuery(
   queryId: string,
   validation: { valid: boolean; invalid_reasons: string[] }
 ): QueryRejection | null {
   if (validation.valid) return null;
   
   return {
     query_id: queryId,
     rejected_at: new Date().toISOString(),
     reasons: validation.invalid_reasons,
     suggested_corrections: validation.invalid_reasons.map(r => 
       r.replace('Missing', 'Add').replace(':', ' to specify')
     ),
   };
 }