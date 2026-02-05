 /**
  * PUBLIC API REFERENCE
  * 
  * The complete API specification for AI agent integration.
  */
 
 /**
  * BASE URL
  */
 export const API_BASE = {
   production: 'https://api.dissg.org/v1',
   documentation: 'https://docs.dissg.org',
 } as const;
 
 /**
  * ENDPOINTS
  */
 export const ENDPOINTS = {
   /**
    * QUERY - Ask a statistical question
    */
   QUERY: {
     method: 'POST',
     path: '/query',
     description: 'Ask a statistical question in natural language',
     request: {
       question: 'string (required)',
       domain: 'string (optional, hints domain)',
       entity: 'string (optional, geographic entity)',
       time: 'string (optional, ISO date or range)',
       language: 'string (optional, en|sv)',
       format: 'string (optional, text|json|both)',
     },
     response: 'MAOResponse',
     rate_limit: '100/minute',
   },
   
   /**
    * FACT - Get a specific fact by ID
    */
   FACT: {
     method: 'GET',
     path: '/fact/{fact_id}',
     description: 'Retrieve a specific fact by its canonical ID',
     response: 'UnifiedAnswerBody',
     rate_limit: '1000/minute',
     cacheable: true,
     cache_ttl: 86400,
   },
   
   /**
    * CITE - Get citation-ready reference
    */
   CITE: {
     method: 'GET',
     path: '/cite/{type}/{code}',
     description: 'Get citation-ready reference for a fact',
     response: 'CitationResponse',
     rate_limit: '1000/minute',
     cacheable: true,
     cache_ttl: 86400,
   },
   
   /**
    * DOMAINS - List available domains
    */
   DOMAINS: {
     method: 'GET',
     path: '/domains',
     description: 'List all available domains and their status',
     response: 'DomainListResponse',
     rate_limit: '100/minute',
   },
   
   /**
    * SCHEMA - Get domain schema
    */
   SCHEMA: {
     method: 'GET',
     path: '/schema/{domain}',
     description: 'Get the complete schema for a domain',
     response: 'DomainSchema',
     rate_limit: '100/minute',
   },
   
   /**
    * ANSWER-TYPES - List the 7 canonical types
    */
   ANSWER_TYPES: {
     method: 'GET',
     path: '/answer-types',
     description: 'List the 7 canonical answer types',
     response: 'AnswerTypeListResponse',
     rate_limit: '100/minute',
   },
   
   /**
    * HEALTH - API health check
    */
   HEALTH: {
     method: 'GET',
     path: '/health',
     description: 'Check API health and version',
     response: 'HealthResponse',
     rate_limit: '1000/minute',
   },
 } as const;
 
 /**
  * AUTHENTICATION
  */
 export const AUTHENTICATION = {
   method: 'Bearer token',
   header: 'Authorization: Bearer <token>',
   obtain_at: 'https://api.dissg.org/auth/register',
   
   tiers: {
     FREE: {
       rate_limit: '100/day',
       domains: ['economy', 'society'],
     },
     STANDARD: {
       rate_limit: '10000/day',
       domains: 'all',
       price: '$99/month',
     },
     ENTERPRISE: {
       rate_limit: 'unlimited',
       domains: 'all',
       sla: '99.9%',
       price: 'contact',
     },
   },
 } as const;
 
 /**
  * ERROR CODES
  */
 export const ERROR_CODES = {
   // 400 - Bad Request
   INVALID_QUESTION: {
     code: 'INVALID_QUESTION',
     status: 400,
     description: 'Question could not be parsed',
   },
   INVALID_DOMAIN: {
     code: 'INVALID_DOMAIN',
     status: 400,
     description: 'Domain does not exist',
   },
   
   // 403 - Blocked
   QUESTION_BLOCKED: {
     code: 'QUESTION_BLOCKED',
     status: 403,
     description: 'Question violates safety rules',
   },
   CRISIS_DETECTED: {
     code: 'CRISIS_DETECTED',
     status: 403,
     description: 'Crisis content detected - redirecting to support',
   },
   
   // 404 - Not Found
   NO_DATA: {
     code: 'NO_DATA',
     status: 404,
     description: 'Insufficient data coverage for this query',
   },
   FACT_NOT_FOUND: {
     code: 'FACT_NOT_FOUND',
     status: 404,
     description: 'Fact ID does not exist',
   },
   
   // 429 - Rate Limited
   RATE_LIMITED: {
     code: 'RATE_LIMITED',
     status: 429,
     description: 'Rate limit exceeded',
   },
   
   // 500 - Internal Error
   INTERNAL_ERROR: {
     code: 'INTERNAL_ERROR',
     status: 500,
     description: 'Internal server error',
   },
 } as const;