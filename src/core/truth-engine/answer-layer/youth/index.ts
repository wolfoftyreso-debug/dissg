 /**
  * YOUTH & MEDICAL ANSWER LAYER - PUBLIC API
  * 
  * Safe, normalizing answers for youth questions.
  * 
  * FUNDAMENTAL PRINCIPLE (LOCKED):
  * The system informs, normalizes, and guides –
  * it NEVER diagnoses and NEVER replaces care.
  * 
  * PRODUCTION CHECKLIST:
  * ✔ 50+ packets (low → medium risk)
  * ✔ Crisis fallback for all high-risk
  * ✔ All packets mapped to MAO AnswerTypes
  * ✔ Only Tier 1-2 medical sources
  * ✔ CI blocks diagnosis/treatment language
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
 } from './crisis-detector';
 export type { CrisisDetectionResult as LegacyCrisisResult } from './crisis-detector';
 
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
 
 // Answer Packets (50+ production-ready)
 export { ALL_YOUTH_PACKETS, getPacketById, validateProductionReadiness } from './packets';
 export { MEDIUM_RISK_PACKETS } from './packets/medium-risk-packets';
 export { FAMILY_A_PACKETS } from './packets/family-a-normality';
 export { FAMILY_B_PACKETS } from './packets/family-b-stress-school';
 export { FAMILY_C_PACKETS } from './packets/family-c-body-identity';
 export { FAMILY_D_PACKETS } from './packets/family-d-social-relationships';
 export { FAMILY_E_PACKETS } from './packets/family-e-help-seeking';
 export { 
   PACKET_CRISIS_SUPPORT,
   generateCrisisFallbackResponse,
   getCrisisResourcesForRegion,
   CRISIS_RESOURCES,
 } from './packets/crisis-fallback';
 
 // Crisis Detection Engine (3-level)
 export {
   detectCrisisLevel,
   quickCrisisCheck,
   RISK_THRESHOLDS,
   CRISIS_REGEX_PATTERNS,
 } from './detection/crisis-detection-engine';
 export type { CrisisDetectionResult, DetectionMode, SessionContext } from './detection/crisis-detection-engine';
 
 // Administration
 export * from './admin';