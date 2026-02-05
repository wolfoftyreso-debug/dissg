 /**
  * MEDICAL API BANK ADMINISTRATION
  * 
  * Full management of medical APIs with:
  * - Onboarding/registration
  * - Kill switch
  * - Health monitoring
  * - Tier enforcement
  */
 
 import { 
   MEDICAL_SOURCE_TIERS, 
   type MedicalSourceTier 
 } from '../types';
 
 /**
  * API STATUS
  */
 export const API_STATUS = {
   ACTIVE: 'active',
   DISABLED: 'disabled',
   DEGRADED: 'degraded',
   KILLED: 'killed',
 } as const;
 
 export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];
 
 /**
  * REGISTERED API ENTRY
  */
 export interface RegisteredApi {
   readonly id: string;
   readonly name: string;
   readonly version: string;
   readonly tier: MedicalSourceTier;
   readonly base_url: string;
   readonly status: ApiStatus;
   readonly registered_at: string;
   readonly last_health_check: string | null;
   readonly health_score: number;  // 0-100
   readonly rate_limit: number;
   readonly calls_today: number;
   readonly errors_today: number;
   readonly youth_approved: boolean;
   readonly kill_reason: string | null;
 }
 
 /**
  * API BANK STORE
  */
 const apiBank: Map<string, RegisteredApi> = new Map();
 
 /**
  * REGISTER NEW API
  */
 export function registerApi(config: {
   id: string;
   name: string;
   version: string;
   tier: MedicalSourceTier;
   base_url: string;
   rate_limit: number;
 }): RegisteredApi {
   const tierConfig = MEDICAL_SOURCE_TIERS[config.tier];
   
   const api: RegisteredApi = {
     id: config.id,
     name: config.name,
     version: config.version,
     tier: config.tier,
     base_url: config.base_url,
     status: 'active',
     registered_at: new Date().toISOString(),
     last_health_check: null,
     health_score: 100,
     rate_limit: config.rate_limit,
     calls_today: 0,
     errors_today: 0,
     youth_approved: tierConfig.youth_allowed,
     kill_reason: null,
   };
   
   apiBank.set(config.id, api);
   console.log(`[API-BANK] Registered: ${config.id} (Tier ${tierConfig.level})`);
   
   return api;
 }
 
 /**
  * KILL SWITCH - IMMEDIATE API DISABLE
  */
 export function killApi(apiId: string, reason: string): boolean {
   const api = apiBank.get(apiId);
   if (!api) return false;
   
   const killedApi: RegisteredApi = {
     ...api,
     status: 'killed',
     kill_reason: reason,
   };
   
   apiBank.set(apiId, killedApi);
   console.log(`[API-BANK] KILLED: ${apiId} - Reason: ${reason}`);
   
   return true;
 }
 
 /**
  * DISABLE API (Soft disable)
  */
 export function disableApi(apiId: string): boolean {
   const api = apiBank.get(apiId);
   if (!api) return false;
   
   apiBank.set(apiId, { ...api, status: 'disabled' });
   console.log(`[API-BANK] Disabled: ${apiId}`);
   
   return true;
 }
 
 /**
  * ENABLE API
  */
 export function enableApi(apiId: string): boolean {
   const api = apiBank.get(apiId);
   if (!api || api.status === 'killed') return false;
   
   apiBank.set(apiId, { ...api, status: 'active', kill_reason: null });
   console.log(`[API-BANK] Enabled: ${apiId}`);
   
   return true;
 }
 
 /**
  * GET ALL APIS
  */
 export function getAllApis(): RegisteredApi[] {
   return Array.from(apiBank.values());
 }
 
 /**
  * GET ACTIVE APIS
  */
 export function getActiveApis(): RegisteredApi[] {
   return getAllApis().filter(api => api.status === 'active');
 }
 
 /**
  * GET YOUTH-APPROVED ACTIVE APIS
  */
 export function getYouthActiveApis(): RegisteredApi[] {
   return getActiveApis().filter(api => api.youth_approved);
 }
 
 /**
  * GET APIS BY TIER
  */
 export function getApisByTier(tier: MedicalSourceTier): RegisteredApi[] {
   return getAllApis().filter(api => api.tier === tier);
 }
 
 /**
  * RECORD API CALL
  */
 export function recordApiCall(apiId: string, success: boolean): void {
   const api = apiBank.get(apiId);
   if (!api) return;
   
   const updated: RegisteredApi = {
     ...api,
     calls_today: api.calls_today + 1,
     errors_today: success ? api.errors_today : api.errors_today + 1,
   };
   
   // Auto-degrade if error rate too high
   const errorRate = updated.errors_today / Math.max(updated.calls_today, 1);
   if (errorRate > 0.3 && updated.status === 'active') {
     (updated as any).status = 'degraded';
     console.log(`[API-BANK] Auto-degraded: ${apiId} (${Math.round(errorRate * 100)}% errors)`);
   }
   
   apiBank.set(apiId, updated);
 }
 
 /**
  * UPDATE HEALTH CHECK
  */
 export function updateHealthCheck(apiId: string, healthScore: number): void {
   const api = apiBank.get(apiId);
   if (!api) return;
   
   let newStatus: ApiStatus = api.status;
   
   if (healthScore < 50 && api.status === 'active') {
     newStatus = 'degraded';
   } else if (healthScore >= 80 && api.status === 'degraded') {
     newStatus = 'active';
   }
   
   apiBank.set(apiId, {
     ...api,
     last_health_check: new Date().toISOString(),
     health_score: healthScore,
     status: newStatus,
   });
 }
 
 /**
  * API BANK STATISTICS
  */
 export function getApiBankStats(): {
   total: number;
   active: number;
   disabled: number;
   killed: number;
   degraded: number;
   by_tier: Record<string, number>;
   youth_approved: number;
   total_calls_today: number;
   total_errors_today: number;
 } {
   const apis = getAllApis();
   const byTier: Record<string, number> = {};
   
   for (const tier of Object.keys(MEDICAL_SOURCE_TIERS)) {
     byTier[tier] = apis.filter(a => a.tier === tier).length;
   }
   
   return {
     total: apis.length,
     active: apis.filter(a => a.status === 'active').length,
     disabled: apis.filter(a => a.status === 'disabled').length,
     killed: apis.filter(a => a.status === 'killed').length,
     degraded: apis.filter(a => a.status === 'degraded').length,
     by_tier: byTier,
     youth_approved: apis.filter(a => a.youth_approved).length,
     total_calls_today: apis.reduce((sum, a) => sum + a.calls_today, 0),
     total_errors_today: apis.reduce((sum, a) => sum + a.errors_today, 0),
   };
 }
 
 /**
  * RESET DAILY COUNTERS
  */
 export function resetDailyCounters(): void {
   for (const [id, api] of apiBank.entries()) {
     apiBank.set(id, {
       ...api,
       calls_today: 0,
       errors_today: 0,
     });
   }
   console.log('[API-BANK] Daily counters reset');
 }
 
 /**
  * PRE-REGISTER TIER 1 APIS (WHO/CDC/National)
  */
 export function initializeTier1Apis(): void {
   registerApi({
     id: 'api:who:mental_health:v1',
     name: 'WHO Mental Health Data',
     version: '1.0.0',
     tier: 'TIER_1',
     base_url: 'https://api.who.int/mental-health',
     rate_limit: 100,
   });
   
   registerApi({
     id: 'api:who:adolescent_health:v1',
     name: 'WHO Adolescent Health',
     version: '1.0.0',
     tier: 'TIER_1',
     base_url: 'https://api.who.int/adolescent',
     rate_limit: 100,
   });
   
   registerApi({
     id: 'api:cdc:youth_risk:v1',
     name: 'CDC Youth Risk Behavior',
     version: '1.0.0',
     tier: 'TIER_1',
     base_url: 'https://api.cdc.gov/yrbs',
     rate_limit: 50,
   });
   
   registerApi({
     id: 'api:folkhalsomyndigheten:youth:v1',
     name: 'Folkhälsomyndigheten Ungdomsdata',
     version: '1.0.0',
     tier: 'TIER_1',
     base_url: 'https://api.folkhalsomyndigheten.se/youth',
     rate_limit: 100,
   });
   
   registerApi({
     id: 'api:socialstyrelsen:mental_health:v1',
     name: 'Socialstyrelsen Mental Health Statistics',
     version: '1.0.0',
     tier: 'TIER_1',
     base_url: 'https://api.socialstyrelsen.se/mental',
     rate_limit: 100,
   });
   
   console.log('[API-BANK] Tier 1 APIs initialized');
 }