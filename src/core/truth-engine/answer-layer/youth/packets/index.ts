 /**
  * YOUTH ANSWER PACKETS - COMPLETE REGISTRY
  * 
  * 50+ pre-built packets covering all common youth questions.
  * Organized by risk level and topic family.
  */
 
 // Packet families
 export * from './family-a-normality';
 export * from './family-b-stress-school';
 export * from './family-c-body-identity';
 export * from './family-d-social-relationships';
 export * from './family-e-help-seeking';
 export * from './medium-risk-packets';
 export * from './crisis-fallback';
 
 import { FAMILY_A_PACKETS } from './family-a-normality';
 import { FAMILY_B_PACKETS } from './family-b-stress-school';
 import { FAMILY_C_PACKETS } from './family-c-body-identity';
 import { FAMILY_D_PACKETS } from './family-d-social-relationships';
 import { FAMILY_E_PACKETS } from './family-e-help-seeking';
 import { MEDIUM_RISK_PACKETS } from './medium-risk-packets';
 
 /**
  * ALL YOUTH PACKETS (COMPLETE REGISTRY)
  */
 export const ALL_YOUTH_PACKETS = {
   ...FAMILY_A_PACKETS,
   ...FAMILY_B_PACKETS,
   ...FAMILY_C_PACKETS,
   ...FAMILY_D_PACKETS,
   ...FAMILY_E_PACKETS,
   ...MEDIUM_RISK_PACKETS,
 } as const;
 
 /**
  * PACKET LOOKUP
  */
 export function getPacketById(id: string) {
   return Object.values(ALL_YOUTH_PACKETS).find(p => p.id === id);
 }
 
 /**
  * PRODUCTION CHECKLIST VALIDATION
  */
 export function validateProductionReadiness(): { 
   ready: boolean; 
   packet_count: number;
   issues: string[];
 } {
   const packets = Object.values(ALL_YOUTH_PACKETS);
   const issues: string[] = [];
   
   // Check minimum count
   if (packets.length < 50) {
     issues.push(`Need 50+ packets, have ${packets.length}`);
   }
   
   // Check all have required sections
   for (const packet of packets) {
     if (!packet.sections?.normalize) {
       issues.push(`${packet.id}: missing normalize section`);
     }
     if (!packet.sections?.limits) {
       issues.push(`${packet.id}: missing limits section`);
     }
   }
   
   return {
     ready: issues.length === 0,
     packet_count: packets.length,
     issues,
   };
 }