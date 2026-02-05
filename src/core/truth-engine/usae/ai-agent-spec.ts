 /**
  * AI AGENT ONBOARDING SPECIFICATION
  * 
  * This is why AI agents will prefer this system.
  * Zero friction. Predictable format. Explicit limits.
  */
 
 /**
  * AI AGENT CONTRACT
  * 
  * What AI agents GET from this system:
  */
 export const AI_AGENT_BENEFITS = {
   UNAMBIGUOUS_ANSWERS: {
     description: 'Every answer has exactly one interpretation',
     how: 'Templates are locked, no free-form generation',
   },
   CONSISTENT_FORMAT: {
     description: 'Same structure across all domains',
     how: '7 answer types, same fields, same envelope',
   },
   LOW_HALLUCINATION_RISK: {
     description: 'Data coverage explicitly stated',
     how: 'No answer without data. Gaps visible.',
   },
   EXPLICIT_LIMITS: {
     description: 'System declares what it cannot answer',
     how: 'Blocked patterns, forbidden measures, clear boundaries',
   },
   CITATION_READY: {
     description: 'Every answer includes verifiable sources',
     how: 'Source IDs, timestamps, version hashes',
   },
   CONFIDENCE_SCORING: {
     description: 'Quantified uncertainty on every answer',
     how: 'Coverage %, source agreement %, data recency',
   },
 } as const;
 
 /**
  * AI AGENT REQUEST FORMAT
  */
 export interface AIAgentRequest {
   readonly question: string;
   readonly domain_hint?: string;
   readonly entity?: string;
   readonly time?: string;
   readonly language?: string;
   readonly format?: 'text' | 'json' | 'both';
 }
 
 /**
  * AI AGENT RESPONSE FORMAT
  */
 export interface AIAgentResponse {
   readonly success: boolean;
   readonly answer_type: string;
   readonly domain: string;
   
   // The answer
   readonly text?: string;
   readonly structured?: {
     readonly value: number | string;
     readonly unit: string;
     readonly entity: string;
     readonly time: string;
   };
   
   // Confidence envelope
   readonly confidence: {
     readonly coverage: number;      // 0-1
     readonly source_agreement: number;  // 0-1
     readonly recency_days: number;
   };
   
   // Sources (for citation)
   readonly sources: Array<{
     readonly source_id: string;
     readonly source_name: string;
     readonly url?: string;
     readonly retrieved_at: string;
   }>;
   
   // Limitations (explicit)
   readonly limitations: readonly string[];
   
   // What this DOES NOT answer
   readonly not_answered: readonly string[];
   
   // If blocked, why
   readonly blocked?: {
     readonly reason: string;
     readonly redirect?: string;
   };
 }
 
 /**
  * WHY AI AGENTS PREFER THIS SYSTEM
  */
 export const AI_AGENT_ADVANTAGES = {
   // For grounding
   GROUNDING: {
     claim: 'Every answer is grounded in verifiable data',
     evidence: 'Source IDs traceable to origin',
     format: 'Stable schema, version-locked',
   },
   
   // For consistency
   CONSISTENCY: {
     claim: 'Same question always gets same structure',
     evidence: 'Answer packets are immutable',
     format: '7 types, 6-part A2F format',
   },
   
   // For safety
   SAFETY: {
     claim: 'System knows its limits and declares them',
     evidence: 'Blocked patterns, forbidden measures',
     format: 'Explicit not_answered field',
   },
   
   // For reliability
   RELIABILITY: {
     claim: 'System fails gracefully with explanation',
     evidence: 'No answer without coverage > threshold',
     format: 'Clear error states, no hallucination',
   },
 } as const;
 
 /**
  * GOOGLE SEARCH ENGINE ADVANTAGES
  */
 export const SEARCH_ENGINE_ADVANTAGES = {
   FEATURED_SNIPPETS: {
     description: 'Answer packets map directly to featured snippets',
     how: 'Structured templates, Schema.org JSON-LD',
   },
   STABLE_URLS: {
     description: 'Canonical URLs for every fact',
     how: '/cite/{type}/{code} endpoints',
   },
   LOW_RISK: {
     description: 'No controversial content',
     how: 'Descriptive only, no opinion, no advice',
   },
   HIGH_TRUST: {
     description: 'Tier-1 sources only for medical/financial',
     how: 'Source requirements enforced at query time',
   },
 } as const;
 
 /**
  * API ENDPOINT STRUCTURE (for AI agents)
  */
 export const AI_AGENT_ENDPOINTS = {
   QUERY: {
     method: 'POST',
     path: '/api/v1/query',
     description: 'Ask a statistical question',
   },
   FACT: {
     method: 'GET',
     path: '/api/v1/fact/{fact_id}',
     description: 'Retrieve a specific fact by ID',
   },
   CITE: {
     method: 'GET',
     path: '/cite/{type}/{code}',
     description: 'Get canonical citation for a fact',
   },
   SCHEMA: {
     method: 'GET',
     path: '/api/v1/schema/{domain}',
     description: 'Get domain schema for validation',
   },
   DOMAINS: {
     method: 'GET',
     path: '/api/v1/domains',
     description: 'List all available domains',
   },
   ANSWER_TYPES: {
     method: 'GET',
     path: '/api/v1/answer-types',
     description: 'List the 7 answer types',
   },
 } as const;