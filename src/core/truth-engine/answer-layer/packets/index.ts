 /**
  * ANSWER PACKET REGISTRY
  * 
  * Central registry of all Answer Packets.
  * Each packet maps to 3-10 search intents.
  */
 
import type { AnswerPacketV2 } from '../types';
import { POPULATION_BASIC_V2 } from './population-basic-v2';
import { POPULATION_TREND } from './population-trend';
import { POPULATION_COMPARISON } from './population-comparison';
import { AGE_STRUCTURE } from './age-structure';
import { GDP_BASIC } from './gdp-basic';
import { LIFE_EXPECTANCY } from './life-expectancy';
 
 /**
  * MASTER REGISTRY
  * 
  * All packets must be registered here to be active.
  */
export const ANSWER_PACKETS: Record<string, AnswerPacketV2> = {
  'answer:population_basic:v1': POPULATION_BASIC_V2,
  'answer:population_trend:v1': POPULATION_TREND,
  'answer:population_comparison:v1': POPULATION_COMPARISON,
  'answer:age_structure:v1': AGE_STRUCTURE,
  'answer:gdp_basic:v1': GDP_BASIC,
  'answer:life_expectancy:v1': LIFE_EXPECTANCY,
};

/**
  * All packets as array
  */
export const ALL_PACKETS: readonly AnswerPacketV2[] = Object.values(ANSWER_PACKETS);
 
 /**
  * Get packet by ID
  */
export function getPacket(packetId: string): AnswerPacketV2 | null {
   const packet = ANSWER_PACKETS[packetId];
  return packet || null;
 }
 
 /**
  * Get all packets for a domain
  */
export function getPacketsByDomain(domain: string): AnswerPacketV2[] {
  return ALL_PACKETS.filter(p => p.intent.domain === domain);
 }
 
 /**
  * Get packet count
  */
 export function getPacketCount(): number {
   return Object.keys(ANSWER_PACKETS).length;
 }