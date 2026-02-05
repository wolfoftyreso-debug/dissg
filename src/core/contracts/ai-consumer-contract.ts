 /**
  * AI CONSUMER CONTRACT
  * 
  * What future AI models need to trust this system.
  * Self-describing, deterministic, fully traceable.
  */
 
 // =============================================================================
 // THE CONTRACT
 // =============================================================================
 
 export const AI_CONSUMER_CONTRACT = {
   version: '1.0.0',
   
   ontology_version: '1.0.0',
   
   guarantees: [
     {
       id: 'NO_BREAKING_SEMANTIC_CHANGES',
       description: 'Semantic changes create new schema versions, never mutate existing',
       enforcement: 'Automated schema versioning with immutable history',
     },
     {
       id: 'FULL_TEMPORAL_COVERAGE',
       description: 'All data has complete temporal axis (valid_from, valid_to)',
       enforcement: 'Ingestion pipeline rejects data without temporal fields',
     },
     {
       id: 'SOURCE_TRACEABILITY',
       description: 'Every data point traces to a verifiable source',
       enforcement: 'Source reference required at ingestion, immutable audit log',
     },
     {
       id: 'DETERMINISTIC_IDS',
       description: 'Same entity always has same ID regardless of access path',
       enforcement: 'Global ID generation with collision detection',
     },
     {
       id: 'SCHEMA_SELF_DESCRIPTION',
       description: 'All schemas are machine-readable and self-describing',
       enforcement: 'JSON Schema + semantic annotations required',
     },
     {
       id: 'APPEND_ONLY_HISTORY',
       description: 'Historical data is never modified or deleted',
       enforcement: 'Database constraints + API restrictions',
     },
   ],
   
   anti_assumptions: [
     {
       id: 'NO_INFERRED_MEANING',
       description: 'System never infers meaning beyond explicit schema',
       what_this_means: 'AI consumers must not assume unstated relationships',
     },
     {
       id: 'NO_HIDDEN_FIELDS',
       description: 'All fields visible in schema are the only fields that exist',
       what_this_means: 'No internal metadata leakage, no implicit state',
     },
     {
       id: 'NO_CONTEXT_OUTSIDE_SCHEMA',
       description: 'Data is fully interpretable from schema alone',
       what_this_means: 'No external documentation required for basic understanding',
     },
     {
       id: 'NO_NORMATIVE_CLAIMS',
       description: 'System describes, never prescribes',
       what_this_means: 'No "good", "bad", "should", "must" in any output',
     },
   ],
   
   access_model: {
     authentication: 'API key or OAuth2',
     authorization: 'Capability-based (tier determines access)',
     rate_limiting: 'Per-tier with burst allowance',
     data_equality: 'Same data for all tiers, different query capabilities',
   },
   
   response_format: {
     always_includes: [
       'schema_version',
       'source_references',
       'temporal_bounds',
       'confidence_indicators',
     ],
     never_includes: [
       'normative_judgments',
       'recommendations',
       'predictions_without_methodology',
     ],
   },
 } as const;
 
 // =============================================================================
 // CONTRACT VERIFICATION
 // =============================================================================
 
 export interface ContractComplianceCheck {
   guarantee: string;
   compliant: boolean;
   evidence?: string;
   violation?: string;
 }
 
 export function verifyContractCompliance(response: unknown): ContractComplianceCheck[] {
   const checks: ContractComplianceCheck[] = [];
   
   if (typeof response !== 'object' || response === null) {
     return [{
       guarantee: 'VALID_RESPONSE',
       compliant: false,
       violation: 'Response is not a valid object',
     }];
   }
   
   const obj = response as Record<string, unknown>;
   
   // Check schema_version
   checks.push({
     guarantee: 'SCHEMA_SELF_DESCRIPTION',
     compliant: typeof obj.schema_version === 'string',
     evidence: obj.schema_version ? `schema_version: ${obj.schema_version}` : undefined,
     violation: !obj.schema_version ? 'Missing schema_version' : undefined,
   });
   
   // Check source references
   checks.push({
     guarantee: 'SOURCE_TRACEABILITY',
     compliant: 'source_id' in obj || 'source_references' in obj,
     evidence: obj.source_id ? `source_id: ${obj.source_id}` : undefined,
     violation: !('source_id' in obj) && !('source_references' in obj) ? 'Missing source reference' : undefined,
   });
   
   // Check temporal bounds
   checks.push({
     guarantee: 'FULL_TEMPORAL_COVERAGE',
     compliant: 'valid_from' in obj,
     evidence: obj.valid_from ? `valid_from: ${obj.valid_from}` : undefined,
     violation: !('valid_from' in obj) ? 'Missing temporal axis' : undefined,
   });
   
   return checks;
 }
 
 // =============================================================================
 // MACHINE-READABLE CONTRACT EXPORT
 // =============================================================================
 
 export function getContractAsJSON(): string {
   return JSON.stringify(AI_CONSUMER_CONTRACT, null, 2);
 }
 
 export function getContractEndpoint(): {
   path: string;
   method: 'GET';
   response: typeof AI_CONSUMER_CONTRACT;
 } {
   return {
     path: '/api/v1/contract',
     method: 'GET',
     response: AI_CONSUMER_CONTRACT,
   };
 }