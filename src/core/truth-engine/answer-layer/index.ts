 /**
  * ANSWER LAYER - PUBLIC API
  */
 
 // Types
 export type {
  AnswerPacketV2,
   AnswerDomain,
   IntentType,
  IntentMatch,
  GeneratedAnswer,
  LLMContract,
 } from './types';
 
export { ANSWER_DOMAINS, INTENT_TYPES, LLM_CONTRACT } from './types';
 
// Invariants  
export { validateAnswerPacket } from './invariants';
 
 // Registry
 export {
   ANSWER_PACKETS,
  ALL_PACKETS,
   getPacket,
   getPacketsByDomain,
   getPacketCount,
 } from './packets';

// Generator
export { matchIntent, validateInputs } from './generator/intent-matcher';
export { generateAnswer } from './generator/answer-generator';

// Live testing
export { runLiveCase, runAllLiveCases } from './tests/live-case';