 /**
  * API ADAPTER SYSTEM
  * 
  * Every API uses the same adapter contract.
  * This is how the system scales to thousands of APIs.
  */
 
 export interface ApiAdapterConfig {
   readonly api_id: string;
   readonly api_name: string;
   readonly tier: 1 | 2 | 3;
   readonly base_url: string;
   readonly domains: readonly string[];
   readonly age_scope: { min: number; max: number } | null;
   readonly geographic_scope: readonly string[];
   readonly rate_limit: {
     readonly requests_per_minute: number;
     readonly requests_per_day: number;
   };
 }
 
 export interface ApiAdapter {
   readonly config: ApiAdapterConfig;
   
   // Core operations
   fetch: (endpoint: string, params: Record<string, unknown>) => Promise<unknown>;
   normalize: (rawData: unknown) => NormalizedFact[];
   validate: (data: unknown) => ValidationResult;
   
   // State
   readonly status: 'active' | 'degraded' | 'killed';
   readonly last_fetch: Date | null;
   readonly error_rate: number;
 }
 
 export interface NormalizedFact {
   readonly fact_id: string;
   readonly api_source: string;
   readonly domain: string;
   readonly measure: string;
   readonly value: number;
   readonly unit: string;
   readonly entity: string;
   readonly time: string;
   readonly version: string;
   readonly checksum: string;
 }
 
 export interface ValidationResult {
   readonly valid: boolean;
   readonly errors: string[];
   readonly warnings: string[];
 }
 
 /**
  * API ADAPTER CONTRACT (IMMUTABLE)
  * 
  * Every adapter MUST implement these operations:
  * - fetch: External call
  * - normalize: Map to ontology
  * - validate: Schema + age scope
  * - cache: Immutable snapshot
  * - kill_switch: Enabled
  */
 export const API_ADAPTER_CONTRACT = {
   required_operations: ['fetch', 'normalize', 'validate'],
   snapshot_policy: 'immutable', // Never live dependencies
   version_locking: true, // Per import
   kill_switch: 'per_api', // Not global
 } as const;
 
 /**
  * CREATE API ADAPTER
  */
 export function createApiAdapter(config: ApiAdapterConfig): Partial<ApiAdapter> {
   return {
     config,
     status: 'active',
     last_fetch: null,
     error_rate: 0,
   };
 }