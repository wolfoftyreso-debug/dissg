 /**
  * ANSWER LAYER INVARIANTS
  * 
  * Rules that MUST be satisfied before an answer is generated.
  * Failure = silence, not speculation.
  */
 
 import type { AnswerPacket, AnswerTemplate } from './types';
 
 /**
  * INV-A01: Packet must have valid domain
  */
 export function assertValidDomain(packet: AnswerPacket): void {
   const validDomains = [
     'population', 'economy', 'health', 'education', 'crime',
     'migration', 'housing', 'environment', 'governance', 'labor',
     'welfare', 'ranking'
   ];
   if (!validDomains.includes(packet.domain)) {
     throw new Error(`INV-A01: Invalid domain "${packet.domain}"`);
   }
 }
 
 /**
  * INV-A02: Packet must have at least one required measure
  */
 export function assertHasMeasures(packet: AnswerPacket): void {
   if (!packet.required_measures || packet.required_measures.length === 0) {
     throw new Error(`INV-A02: Packet "${packet.packet_id}" has no required measures`);
   }
 }
 
 /**
  * INV-A03: Minimum coverage must be defined and > 0
  */
 export function assertMinimumCoverage(packet: AnswerPacket): void {
   if (typeof packet.minimum_coverage !== 'number' || packet.minimum_coverage <= 0) {
     throw new Error(`INV-A03: Packet "${packet.packet_id}" missing valid minimum_coverage`);
   }
 }
 
 /**
  * INV-A04: Template must have all six sections
  */
 export function assertCompleteTemplate(template: AnswerTemplate): void {
   const required = [
     'fact_template',
     'timeline_template', 
     'comparison_template',
     'uncertainty_template',
     'deeplinks'
   ];
   
   for (const field of required) {
     if (!(field in template) || template[field as keyof AnswerTemplate] === undefined) {
       throw new Error(`INV-A04: Template missing required field "${field}"`);
     }
   }
 }
 
 /**
  * INV-A05: Causation-blocked packets cannot claim causation
  */
 export function assertCausationCompliance(packet: AnswerPacket): void {
   if (packet.causation_blocked && packet.intent_type === 'causation') {
     throw new Error(
       `INV-A05: Packet "${packet.packet_id}" is causation-blocked but has causation intent`
     );
   }
 }
 
 /**
  * INV-A06: Disclaimers must exist
  */
 export function assertHasDisclaimers(packet: AnswerPacket): void {
   if (!packet.mandatory_disclaimers || packet.mandatory_disclaimers.length === 0) {
     throw new Error(`INV-A06: Packet "${packet.packet_id}" has no mandatory disclaimers`);
   }
 }
 
 /**
  * INV-A07: Source requirements must specify minimum reliability
  */
 export function assertSourceRequirements(packet: AnswerPacket): void {
   if (
     !packet.source_requirements ||
     typeof packet.source_requirements.minimum_reliability !== 'number'
   ) {
     throw new Error(`INV-A07: Packet "${packet.packet_id}" missing source reliability threshold`);
   }
 }
 
 /**
  * VALIDATE FULL PACKET
  */
 export function validateAnswerPacket(packet: AnswerPacket): void {
   assertValidDomain(packet);
   assertHasMeasures(packet);
   assertMinimumCoverage(packet);
   assertCompleteTemplate(packet.answer_template);
   assertCausationCompliance(packet);
   assertHasDisclaimers(packet);
   assertSourceRequirements(packet);
 }
 
 /**
  * DATA COVERAGE CHECK
  * 
  * Returns false if we don't have enough data to answer.
  * Silence over speculation.
  */
 export function hasSufficientCoverage(
   packet: AnswerPacket,
   availableDataPoints: number,
   requiredDataPoints: number
 ): boolean {
   const coverage = availableDataPoints / requiredDataPoints;
   return coverage >= packet.minimum_coverage;
 }
 
 /**
  * STALENESS CHECK
  */
 export function isDataFresh(
   packet: AnswerPacket,
   lastUpdateDate: Date
 ): boolean {
   const now = new Date();
   const ageInDays = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24);
   return ageInDays <= packet.temporal_requirement.maximum_age_days;
 }