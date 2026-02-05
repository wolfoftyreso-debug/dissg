 /**
  * USAE ONTOLOGY - PUBLIC API
  */
 
 export {
   ANSWER_TYPES,
   validateAnswerType,
   getAnswerType,
   inferAnswerType,
   FORBIDDEN_ANSWER_PATTERNS,
   validateOutputSafety,
   type AnswerTypeCode,
   type AnswerType,
 } from './answer-types';
 
 export {
   DOMAIN_REGISTRY,
   getDomainConfig,
   validateDomainExists,
   type DomainCode,
   type DomainConfig,
 } from './domain-registry';