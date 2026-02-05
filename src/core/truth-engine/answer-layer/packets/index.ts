 /**
  * ANSWER PACKET REGISTRY
  * 
  * Central registry of all Answer Packets.
  * Each packet maps to 3-10 search intents.
  */
 
 import type { AnswerPacketRegistry } from '../types';
 import { POPULATION_BASIC } from './population-basic';
 
 /**
  * MASTER REGISTRY
  * 
  * All packets must be registered here to be active.
  */
 export const ANSWER_PACKETS: AnswerPacketRegistry = {
   'population_basic': POPULATION_BASIC,
   // Future packets:
   // 'population_trend': POPULATION_TREND,
   // 'age_structure': AGE_STRUCTURE,
   // 'fertility': FERTILITY,
   // 'gdp_basic': GDP_BASIC,
   // ... ~75 total packets
 };
 
 /**
  * Get packet by ID
  */
 export function getPacket(packetId: string) {
   const packet = ANSWER_PACKETS[packetId];
   if (!packet) {
     return null;
   }
   return packet;
 }
 
 /**
  * Get all packets for a domain
  */
 export function getPacketsByDomain(domain: string) {
   return Object.values(ANSWER_PACKETS).filter(p => p.domain === domain);
 }
 
 /**
  * Get packet count
  */
 export function getPacketCount(): number {
   return Object.keys(ANSWER_PACKETS).length;
 }