 /**
  * YOUTH & MEDICAL ANSWER LAYER - PUBLIC API
  * 
  * Safe, normalizing answers for youth questions.
  * 
  * FUNDAMENTAL PRINCIPLE (LOCKED):
  * The system informs, normalizes, and guides –
  * it NEVER diagnoses and NEVER replaces care.
  */
 
 // Types
 export type {
   YouthQuestionClass,
   YouthRiskLevel,
   YouthAnswerPacket,
   YouthAnswerSection,
   MedicalScopeConstraints,
   CrisisModeResponse,
   CrisisResource,
   MedicalSourceTier,
 } from './types';
 
 export {
   YOUTH_QUESTION_CLASSES,
   YOUTH_RISK_LEVELS,
   YOUTH_ANSWER_SECTIONS,
   MEDICAL_SOURCE_TIERS,
 } from './types';
 
 // Crisis Detection
 export {
   CRISIS_KEYWORDS,
   HIGH_RISK_PATTERNS,
   DEFAULT_CRISIS_RESOURCES,
   detectCrisis,
   generateCrisisResponse,
   safetyGate,
   type CrisisDetectionResult,
 } from './crisis-detector';
 
 // Medical API Layer
 export {
   registerMedicalApi,
   getApisByTier,
   getYouthApprovedApis,
   normalizeApiResponse,
   getKnowledgeForTopic,
   validateForYouthUse,
   getApiHealth,
   type MedicalApiConfig,
   type NormalizedMedicalKnowledge,
 } from './medical-api-layer';
 
 // Questions Registry
 export {
   YOUTH_QUESTIONS,
   getQuestionsByClass,
   getQuestionsByRiskLevel,
   getHighRiskQuestions,
   getQuestionStats,
   type RegisteredYouthQuestion,
 } from './questions-registry';
 
 // Answer Generator
 export {
   matchYouthQuestion,
   generateYouthAnswer,
   type GeneratedYouthAnswer,
 } from './answer-generator';
 
 // Answer Packets
 export { ALL_YOUTH_PACKETS, getPacketById } from './packets';
 export { MEDIUM_RISK_PACKETS } from './packets/medium-risk-packets';
 
 // Administration
 export * from './admin';