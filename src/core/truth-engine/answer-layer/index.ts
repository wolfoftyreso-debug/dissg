 /**
  * ANSWER LAYER - PUBLIC API
  */
 
 // Types
 export type {
   AnswerPacket,
   AnswerDomain,
   IntentType,
   AnswerTemplate,
   TemporalRequirement,
   ComparisonLimit,
   SourceRequirement,
   RefreshPolicy,
   DeeplinkTemplate,
   AnswerPacketRegistry,
 } from './types';
 
 export { ANSWER_DOMAINS, INTENT_TYPES } from './types';
 
 // Invariants
 export {
   validateAnswerPacket,
   hasSufficientCoverage,
   isDataFresh,
 } from './invariants';
 
 // Registry
 export {
   ANSWER_PACKETS,
   getPacket,
   getPacketsByDomain,
   getPacketCount,
 } from './packets';