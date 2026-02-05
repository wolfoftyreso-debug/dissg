 /**
  * TRUTH ENGINE SPEC - SECTION 1
  * 
  * FORMAL DEFINITIONS
  */
 
 /**
  * 1.1 TRUTH
  * 
  * A statement is TRUE only in relation to:
  * - definition
  * - time
  * - source
  * - uncertainty
  * 
  * Without these, the statement is INVALID, not false.
  */
 export interface TruthStatement {
   readonly statement: string;
   readonly definition_id: string;
   readonly time_range: {
     valid_from: string;
     valid_to: string | null;
   };
   readonly source_id: string;
   readonly uncertainty: {
     confidence_interval: [number, number];
     coverage: number;
     methodology_note: string;
   };
 }
 
 export function validateTruthStatement(input: Partial<TruthStatement>): {
   valid: boolean;
   missing: string[];
 } {
   const required = ['statement', 'definition_id', 'time_range', 'source_id', 'uncertainty'];
   const missing = required.filter(key => !(key in input) || input[key as keyof TruthStatement] === undefined);
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }
 
 /**
  * 1.2 DATA
  * 
  * Data is OBSERVATIONS.
  * Data may NEVER contain conclusions.
  */
 export interface DataPoint {
   readonly observation: unknown;
   readonly observed_at: string;
   readonly observer_id: string;
   readonly methodology_id: string;
   // FORBIDDEN: conclusions, interpretations, recommendations
 }
 
 export function isDataNotConclusion(input: unknown): boolean {
   if (typeof input !== 'object' || input === null) return true;
   
   const forbiddenKeys = ['conclusion', 'interpretation', 'recommendation', 'inference', 'prediction'];
   const keys = Object.keys(input);
   
   return !keys.some(key => forbiddenKeys.includes(key.toLowerCase()));
 }
 
 /**
  * 1.3 CONCLUSION
  * 
  * A conclusion is a derivation that MUST be invalidatable.
  * Conclusions are stored separately and are ALWAYS time-limited.
  */
 export interface Conclusion {
   readonly id: string;
   readonly derivation: string;
   readonly premises: string[]; // IDs of source data
   readonly methodology: string;
   readonly confidence: number;
   readonly valid_until: string; // REQUIRED: conclusions expire
   readonly invalidation_conditions: string[];
   readonly created_at: string;
 }
 
 export function validateConclusion(conclusion: Partial<Conclusion>): {
   valid: boolean;
   errors: string[];
 } {
   const errors: string[] = [];
   
   if (!conclusion.valid_until) {
     errors.push('REQUIRED: valid_until must be set. Conclusions cannot be eternal.');
   }
   
   if (!conclusion.invalidation_conditions || conclusion.invalidation_conditions.length === 0) {
     errors.push('REQUIRED: invalidation_conditions must be specified. All conclusions must be falsifiable.');
   }
   
   if (!conclusion.premises || conclusion.premises.length === 0) {
     errors.push('REQUIRED: premises must be specified. Conclusions must trace to data.');
   }
   
   return {
     valid: errors.length === 0,
     errors,
   };
 }