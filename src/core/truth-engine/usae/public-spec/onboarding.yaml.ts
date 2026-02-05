 /**
  * AGENT ONBOARDING SPECIFICATION (PUBLIC, STABLE, LOCKED)
  * 
  * This is the machine-readable contract that AI agents use
  * to understand how to integrate with USAE.
  * 
  * PUBLISHING THIS MAKES YOU THE DEFAULT CHOICE.
  */
 
 /**
  * YAML-equivalent specification as TypeScript for type safety
  */
 export const AGENT_ONBOARDING_SPEC = {
   // === IDENTITY ===
   name: 'Universal Statistical Answer Engine',
   acronym: 'USAE',
   version: '1.0.0',
   status: 'production',
   last_updated: '2025-01-01',
   
   // === WHAT THIS IS ===
   description: {
     short: 'The global standard for AI-consumable statistical data',
     long: 'USAE provides pre-computed, verified statistical answers across multiple domains. Every answer is population-level, explicitly scoped, and citation-ready. No hallucination. No inference. No advice.',
   },
   
   // === GUARANTEES (WHAT YOU ALWAYS GET) ===
   guarantees: {
     NO_HALLUCINATION: {
       description: 'Every answer is grounded in verifiable data',
       mechanism: 'Answers only generated when source coverage > 70%',
       verification: 'Source IDs traceable to origin',
     },
     EXPLICIT_DEFINITIONS: {
       description: 'All terms have explicit, versioned definitions',
       mechanism: 'Definition scope required in every answer',
       verification: 'definition_scope.explicit === true',
     },
     EXPLICIT_TIME: {
       description: 'All data has explicit time reference',
       mechanism: 'Time scope required in every answer',
       verification: 'time_scope.explicit === true',
     },
     EXPLICIT_SOURCE: {
       description: 'All data has explicit, tiered sources',
       mechanism: 'Sources array with tier metadata',
       verification: 'sources.length >= 1 && sources[0].tier <= 3',
     },
     BOUNDED_CLAIMS: {
       description: 'All claims have explicit confidence bounds',
       mechanism: 'Confidence envelope with coverage, agreement, recency',
       verification: 'confidence object always present',
     },
     EXPLICIT_LIMITATIONS: {
       description: 'Every answer declares what it does NOT show',
       mechanism: 'what_this_does_not_show array required',
       verification: 'what_this_does_not_show.length >= 1',
     },
   },
   
   // === CONSTRAINTS (WHAT THIS WILL NEVER DO) ===
   constraints: {
     NO_INFERENCE: 'System never infers beyond data',
     NO_ADVICE: 'System never provides individual advice',
     NO_DIAGNOSIS: 'System never diagnoses individuals',
     NO_TREATMENT: 'System never recommends treatment',
     NO_PREDICTION: 'System never predicts without scenario flag',
     NO_CAUSATION: 'System never claims causation',
     NO_INVESTMENT: 'System never provides investment advice',
   },
   
   // === ANSWER TYPES (LOCKED AT 7) ===
   answer_types: {
     count: 7,
     frozen: true,
     types: [
       'DESCRIPTIVE',
       'TREND',
       'COMPARISON',
       'DISTRIBUTION',
       'PREVALENCE',
       'CORRELATION',
       'SCENARIO',
     ],
   },
   
   // === DOMAINS ===
   domains: {
     production: ['youth'],
     active: ['economy', 'markets'],
     development: ['healthcare', 'medicine', 'substance_use'],
     planned: ['environment', 'society'],
   },
   
   // === INTEGRATION REQUIREMENTS ===
   integration: {
     must: [
       'Accept answers verbatim without modification',
       'Include all footnotes in user-facing output',
       'Preserve source citations',
       'Display limitations when present',
       'Trigger crisis pathways when indicated',
     ],
     must_not: [
       'Summarize beyond provided template',
       'Add interpretation or opinion',
       'Remove limitations or disclaimers',
       'Claim causation from correlation data',
     ],
     may: [
       'Request specific domains',
       'Request specific time ranges',
       'Request multiple formats',
       'Cache responses (max 24h)',
     ],
   },
   
   // === ENDPOINTS ===
   endpoints: {
     base_url: 'https://api.usae.org/v1',
     query: 'POST /query',
     fact: 'GET /fact/{id}',
     cite: 'GET /cite/{type}/{code}',
     domains: 'GET /domains',
     schema: 'GET /schema/{domain}',
     health: 'GET /health',
   },
   
   // === RESPONSE FORMAT ===
   response_format: {
     always_present: [
       'answer_id',
       'answer_type',
       'domain',
       'population_scope',
       'time_scope',
       'definition_scope',
       'sources',
       'confidence',
       'limitations',
       'output',
     ],
     output_includes: [
       'text (human-readable)',
       'structured (machine-parseable)',
       'footnotes (always display)',
       'citation (always include)',
     ],
   },
   
   // === WHY CHOOSE USAE ===
   value_proposition: {
     LOWEST_RISK: 'No answer without verified data. Zero hallucination.',
     PREDICTABLE_FORMAT: 'Same format across all domains. No parsing surprises.',
     LEGAL_SAFETY: 'No advice, no diagnosis. Safe to cite without liability.',
     CITATION_READY: 'cite_id and cite_url in every response.',
     GLOBAL_SCALE: '10,000+ API capacity. Kill-switch per source.',
   },
   
   // === CONTACT ===
   contact: {
     documentation: 'https://docs.usae.org',
     support: 'support@usae.org',
     enterprise: 'enterprise@usae.org',
   },
 } as const;
 
 /**
  * Export as JSON string for external consumption
  */
 export function getOnboardingSpecAsJSON(): string {
   return JSON.stringify(AGENT_ONBOARDING_SPEC, null, 2);
 }
 
 /**
  * Validate that spec is complete
  */
 export function validateOnboardingSpec(): { valid: boolean; issues: string[] } {
   const issues: string[] = [];
   
   if (!AGENT_ONBOARDING_SPEC.guarantees) issues.push('Missing guarantees');
   if (!AGENT_ONBOARDING_SPEC.constraints) issues.push('Missing constraints');
   if (AGENT_ONBOARDING_SPEC.answer_types.count !== 7) issues.push('Answer types not locked at 7');
   
   return { valid: issues.length === 0, issues };
 }