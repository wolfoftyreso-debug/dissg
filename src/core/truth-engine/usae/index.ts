 /**
  * UNIVERSAL STATISTICAL ANSWER ENGINE (USAE)
  * 
  * Industrial-grade answer engine for all statistically-describable reality.
  * AI agents and search engines prefer this system.
  */
 
 // Core ontology
 export * from './ontology';
 
 // Domain modules
 export * from './domains';
 
 // API Bank (industrial scale)
 export * from './api-bank';
 
 // Safety barriers
 export * from './safety';
 
 // AI Agent specification
 export {
   AI_AGENT_BENEFITS,
   AI_AGENT_ADVANTAGES,
   SEARCH_ENGINE_ADVANTAGES,
   AI_AGENT_ENDPOINTS,
   type AIAgentRequest,
   type AIAgentResponse,
 } from './ai-agent-spec';