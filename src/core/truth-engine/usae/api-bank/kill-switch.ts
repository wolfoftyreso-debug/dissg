 /**
  * API KILL SWITCH
  * 
  * Per-API, not global.
  * One-click shutdown capability.
  */
 
 export interface KillSwitchEntry {
   readonly api_id: string;
   readonly killed_at: string;
   readonly killed_by: string;
   readonly reason: string;
   readonly affected_packets: readonly string[];
   readonly auto_triggered: boolean;
 }
 
 // In-memory registry (would be database in production)
 const killedApis: Map<string, KillSwitchEntry> = new Map();
 
 /**
  * KILL AN API
  */
 export function killApi(
   api_id: string,
   reason: string,
   killed_by: string = 'system',
   affected_packets: string[] = [],
   auto_triggered: boolean = false
 ): KillSwitchEntry {
   const entry: KillSwitchEntry = {
     api_id,
     killed_at: new Date().toISOString(),
     killed_by,
     reason,
     affected_packets,
     auto_triggered,
   };
   
   killedApis.set(api_id, entry);
   console.warn(`[KILL SWITCH] API ${api_id} killed: ${reason}`);
   
   return entry;
 }
 
 /**
  * REINSTATE AN API
  */
 export function reinstateApi(api_id: string): boolean {
   if (killedApis.has(api_id)) {
     killedApis.delete(api_id);
     console.info(`[KILL SWITCH] API ${api_id} reinstated`);
     return true;
   }
   return false;
 }
 
 /**
  * GET API STATUS
  */
 export function getApiStatus(api_id: string): 'active' | 'killed' {
   return killedApis.has(api_id) ? 'killed' : 'active';
 }
 
 /**
  * GET ALL KILLED APIS
  */
 export function getAllKilledApis(): KillSwitchEntry[] {
   return Array.from(killedApis.values());
 }
 
 /**
  * API KILL SWITCH CONFIG
  */
 export const API_KILL_SWITCH = {
   auto_kill_threshold: {
     error_rate: 0.30, // 30% error rate triggers auto-kill
     response_time_ms: 10000, // 10s timeout triggers warning
   },
   review_period_hours: 24,
   requires_manual_reinstate: true,
 } as const;