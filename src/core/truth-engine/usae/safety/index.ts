 /**
  * USAE SAFETY LAYER
  * 
  * Three immutable barriers:
  * 1. No API can create new answer types
  * 2. No API can change language
  * 3. No API can increase safety risk
  */
 
 export { 
   SAFETY_BARRIERS,
   validateApiSafety,
   validateAnswerSafety,
   type SafetyValidationResult,
 } from './barriers';
 
 export {
   INTAKE_REQUIREMENTS,
   validateApiIntake,
   type IntakeValidationResult,
 } from './intake';