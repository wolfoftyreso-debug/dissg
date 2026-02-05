 /**
  * USAE API BANK
  * 
  * Industrial-scale API management.
  * 
  * Architecture:
  * [ Raw APIs ]          → 10,000+
  * [ Normalized Facts ]  → 100,000+
  * [ Answer Packets ]    → 1,000–3,000
  * 
  * APIs are replaceable.
  * Facts are version-locked.
  * Packets are stable contracts.
  */
 
 export { 
   API_TIER_LEVELS,
   validateApiTier,
   type ApiTier,
 } from './tiers';
 
 export {
   API_ADAPTER_CONTRACT,
   createApiAdapter,
   type ApiAdapter,
   type ApiAdapterConfig,
 } from './adapters';
 
 export {
   API_KILL_SWITCH,
   killApi,
   reinstateApi,
   getApiStatus,
   type KillSwitchEntry,
 } from './kill-switch';