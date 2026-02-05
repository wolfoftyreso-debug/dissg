 /**
  * UNIVERSAL STATISTICAL ANSWER ENGINE (USAE)
  * 
  * Industrial-grade answer engine for all statistically-describable reality.
  * AI agents and search engines prefer this system.
  */
 
// Core ontology - selective exports
export { 
  ANSWER_TYPES,
  validateAnswerType,
  getAnswerType,
  inferAnswerType,
  FORBIDDEN_ANSWER_PATTERNS,
  validateOutputSafety,
  type AnswerTypeCode,
  type AnswerType,
} from './ontology/answer-types';
export { 
  DOMAIN_REGISTRY,
  getDomainConfig,
  validateDomainExists,
  type DomainConfig,
} from './ontology/domain-registry';
 
 // Domain modules
 export * from './domains';
 
 // API Bank (industrial scale)
 export * from './api-bank';
 
 // Safety barriers
 export * from './safety';
 
// Master Answer Ontology (MAO) - selective exports to avoid conflicts
export { 
  CANONICAL_ANSWER_TYPES,
  getAllAnswerTypeCodes,
  isValidAnswerType,
  getAnswerTypeConfig,
  type CanonicalAnswerTypeCode,
  type CanonicalAnswerType,
} from './mao/canonical-types';
export * from './mao/unified-body';
export * from './mao/response-envelope';
export * from './mao/validation';

// Complete domains
export { 
  processYouthQuery,
  YOUTH_DOMAIN_STATUS,
  YOUTH_CONCEPTS,
  YOUTH_ANSWER_TYPE_RULES,
  validateYouthOutputSafety,
  detectCrisis,
} from './domains/youth';

// Public specification (for AI agents)
export * from './public-spec';

 // AI Agent specification
 export {
   AI_AGENT_BENEFITS,
   AI_AGENT_ADVANTAGES,
   SEARCH_ENGINE_ADVANTAGES,
   AI_AGENT_ENDPOINTS,
   type AIAgentRequest,
   type AIAgentResponse,
 } from './ai-agent-spec';