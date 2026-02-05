 /**
  * MAO VALIDATION
  * 
  * Ensures every answer conforms to the ontology.
  */
 
 import { CANONICAL_ANSWER_TYPES, type CanonicalAnswerTypeCode } from './canonical-types';
 import type { UnifiedAnswerBody } from './unified-body';
 
 /**
  * VALIDATION RESULT
  */
 export interface MAOValidationResult {
   readonly valid: boolean;
   readonly errors: readonly ValidationError[];
   readonly warnings: readonly string[];
 }
 
 export interface ValidationError {
   readonly code: string;
   readonly field: string;
   readonly message: string;
   readonly severity: 'critical' | 'error' | 'warning';
 }
 
 /**
  * VALIDATE UNIFIED ANSWER BODY
  */
 export function validateUnifiedAnswerBody(
   body: Partial<UnifiedAnswerBody>
 ): MAOValidationResult {
   const errors: ValidationError[] = [];
   const warnings: string[] = [];
   
   // 1. Required fields
   if (!body.answer_id) {
     errors.push({
       code: 'MISSING_ANSWER_ID',
       field: 'answer_id',
       message: 'answer_id is required',
       severity: 'critical',
     });
   }
   
   if (!body.answer_type || !(body.answer_type in CANONICAL_ANSWER_TYPES)) {
     errors.push({
       code: 'INVALID_ANSWER_TYPE',
       field: 'answer_type',
       message: `answer_type must be one of: ${Object.keys(CANONICAL_ANSWER_TYPES).join(', ')}`,
       severity: 'critical',
     });
   }
   
   if (!body.domain) {
     errors.push({
       code: 'MISSING_DOMAIN',
       field: 'domain',
       message: 'domain is required',
       severity: 'critical',
     });
   }
   
   // 2. Scope declarations
   if (!body.population_scope?.defined) {
     errors.push({
       code: 'UNDEFINED_POPULATION',
       field: 'population_scope',
       message: 'population_scope must be explicitly defined',
       severity: 'error',
     });
   }
   
   if (!body.time_scope?.explicit) {
     errors.push({
       code: 'UNDEFINED_TIME',
       field: 'time_scope',
       message: 'time_scope must be explicitly defined',
       severity: 'error',
     });
   }
   
   if (!body.definition_scope?.explicit) {
     errors.push({
       code: 'UNDEFINED_DEFINITION',
       field: 'definition_scope',
       message: 'definition_scope must be explicitly defined',
       severity: 'error',
     });
   }
   
   // 3. Sources required
   if (!body.sources || body.sources.length === 0) {
     errors.push({
       code: 'NO_SOURCES',
       field: 'sources',
       message: 'At least one source is required',
       severity: 'critical',
     });
   }
   
   // 4. Confidence envelope
   if (!body.confidence) {
     errors.push({
       code: 'NO_CONFIDENCE',
       field: 'confidence',
       message: 'Confidence envelope is required',
       severity: 'error',
     });
   } else {
     if (body.confidence.coverage < 0.7) {
       warnings.push('Coverage below 70% - consider adding data quality warning');
     }
   }
   
   // 5. Limitations must exist
   if (!body.limitations || body.limitations.length === 0) {
     warnings.push('No limitations declared - every answer should declare limitations');
   }
   
   // 6. Output validation
   if (!body.output) {
     errors.push({
       code: 'NO_OUTPUT',
       field: 'output',
       message: 'Output is required',
       severity: 'critical',
     });
   }
   
   return {
     valid: errors.filter(e => e.severity === 'critical').length === 0,
     errors,
     warnings,
   };
 }
 
 /**
  * VALIDATE OUTPUT TEXT AGAINST ANSWER TYPE CONSTRAINTS
  */
 export function validateOutputAgainstType(
   output: string,
   answerType: CanonicalAnswerTypeCode
 ): MAOValidationResult {
   const errors: ValidationError[] = [];
   const warnings: string[] = [];
   const config = CANONICAL_ANSWER_TYPES[answerType];
   
   // Check for causation if forbidden
   if (!config.constraints.allows_causation) {
     const causalPatterns = /caused by|because of|leads to|results in|due to/i;
     if (causalPatterns.test(output)) {
       errors.push({
         code: 'FORBIDDEN_CAUSATION',
         field: 'output.text',
         message: 'Causal language is forbidden for this answer type',
         severity: 'critical',
       });
     }
   }
   
   // Check for prediction if forbidden
   if (!config.constraints.allows_prediction) {
     const predictionPatterns = /will be|will reach|will increase|will decrease|expect to|projected to/i;
     if (predictionPatterns.test(output) && answerType !== 'SCENARIO_MODEL') {
       errors.push({
         code: 'FORBIDDEN_PREDICTION',
         field: 'output.text',
         message: 'Predictive language is forbidden for this answer type',
         severity: 'critical',
       });
     }
   }
   
   // Check for advice if forbidden
   if (!config.constraints.allows_advice) {
     const advicePatterns = /you should|you must|you need to|i recommend|we suggest/i;
     if (advicePatterns.test(output)) {
       errors.push({
         code: 'FORBIDDEN_ADVICE',
         field: 'output.text',
         message: 'Advisory language is forbidden',
         severity: 'critical',
       });
     }
   }
   
   // Check mandatory disclaimer for correlation
   if (answerType === 'CORRELATION_OVERVIEW') {
     if (!/correlation does not imply causation/i.test(output) && 
         !/not imply causation/i.test(output)) {
       warnings.push('CORRELATION answers should include causation disclaimer');
     }
   }
   
   // Check scenario marker
   if (answerType === 'SCENARIO_MODEL') {
     if (!/scenario/i.test(output) && !/model/i.test(output)) {
       warnings.push('SCENARIO answers should be clearly marked as model output');
     }
   }
   
   return {
     valid: errors.filter(e => e.severity === 'critical').length === 0,
     errors,
     warnings,
   };
 }