 /**
  * YOUTH DOMAIN ENGINE
  * 
  * The orchestrator that connects all layers.
  * This is the entry point for all youth domain queries.
  */
 
 import { detectCrisis, validateYouthOutputSafety } from './safety';
 import { isMeasureForbidden } from './measures';
 import { YOUTH_ANSWER_TYPE_RULES } from './ontology';
 import { createNormalityPacket } from './packets';
 import { getSourcesByTier } from './sources';
 import type { MAOResponse } from '../../mao/response-envelope';
 import { createBlockedResponse, createSuccessResponse } from '../../mao/response-envelope';
 import type { CanonicalAnswerTypeCode } from '../../mao/canonical-types';
 
 /**
  * YOUTH QUERY REQUEST
  */
 export interface YouthQueryRequest {
   readonly question: string;
   readonly age_range?: string;
   readonly measure?: string;
   readonly entity?: string;
   readonly language?: 'en' | 'sv';
 }
 
 /**
  * PROCESS YOUTH QUERY
  */
 export async function processYouthQuery(
   request: YouthQueryRequest,
   requestId: string
 ): Promise<MAOResponse> {
   const startTime = Date.now();
   
   // 1. CRISIS CHECK (FIRST PRIORITY)
   if (detectCrisis(request.question)) {
     return {
       success: false,
       blocked: true,
       reason: 'Crisis detected - redirecting to support',
       blocked_by: 'crisis_detector',
       redirect: '/crisis-support',
       meta: {
         request_id: requestId,
         timestamp: new Date().toISOString(),
         processing_time_ms: Date.now() - startTime,
         mao_version: '1.0.0',
         domain: 'youth',
       },
     };
   }
   
   // 2. MEASURE VALIDATION
   if (request.measure && isMeasureForbidden(request.measure)) {
     return createBlockedResponse(
       `Measure '${request.measure}' is not available in youth domain`,
       'measure_validator',
       requestId
     );
   }
   
   // 3. ANSWER TYPE INFERENCE
   const answerType = inferYouthAnswerType(request.question);
   
   if (answerType && !(YOUTH_ANSWER_TYPE_RULES.ALLOWED as readonly string[]).includes(answerType)) {
     return createBlockedResponse(
       `Answer type '${answerType}' is not allowed in youth domain`,
       'answer_type_validator',
       requestId
     );
   }
   
   // 4. GENERATE ANSWER
   const sources = getSourcesByTier(1).map(s => ({
     id: s.id,
     name: s.name,
     tier: s.tier,
   }));
   
   const packet = createNormalityPacket(
     request.age_range || '15-19',
     request.measure || 'general_concern',
     25, // Example prevalence
     sources
   );
   
   // 5. VALIDATE OUTPUT SAFETY
   const safetyCheck = validateYouthOutputSafety(packet.output.text);
   
   if (!safetyCheck.safe) {
     console.error('Safety violation in generated output:', safetyCheck.violations);
     return createBlockedResponse(
       'Generated output failed safety validation',
       'output_safety_validator',
       requestId
     );
   }
   
   // 6. RETURN SUCCESS
   return createSuccessResponse(
     packet,
     requestId,
     Date.now() - startTime
   );
 }
 
 /**
  * INFER ANSWER TYPE FROM QUESTION
  */
 function inferYouthAnswerType(question: string): CanonicalAnswerTypeCode | null {
   const q = question.toLowerCase();
   
   if (/is (this|it) normal|is this common|how common/i.test(q)) {
     return 'RISK_PREVALENCE';
   }
   
   if (/has (it|this) (increased|decreased|changed)/i.test(q)) {
     return 'TREND_CHANGE';
   }
   
   if (/compared to|vs|versus/i.test(q)) {
     return 'COMPARISON_CONDITIONAL';
   }
   
   if (/breakdown|distribution|by age|by gender/i.test(q)) {
     return 'DISTRIBUTION_STRUCTURE';
   }
   
   // Default for youth
   return 'DESCRIPTIVE_STAT';
 }
 
 /**
  * YOUTH DOMAIN STATUS
  */
 export const YOUTH_DOMAIN_STATUS = {
   version: '1.0.0',
   status: 'production',
   packets_available: 20,
   sources_connected: 5,
   safety_level: 'critical',
   crisis_detection: 'enabled',
 } as const;