/**
 * STEWARD HANDBOOK MODULE
 * 
 * How to protect a decision system from people (including yourself).
 * The final artifact that determines if everything survives 50 years.
 */

// Types
export type {
  StewardIdentity,
  DailyPrinciple,
  InternalThreat,
  OntologyChangeRule,
  RefusalPhrase,
  RefusalProtocol,
  AIRelation,
  ResignationSignal,
  SuccessionRule,
  SystemMorality,
} from './types';

export { STEWARD_MISSION } from './types';

// Identity
export { STEWARD_IDENTITY, STEWARD_OATH } from './identity';

// Principles
export { DAILY_PRINCIPLES, PRINCIPLE_ENFORCEMENT } from './principles';

// Threats
export { INTERNAL_THREATS, THREAT_RECOGNITION } from './threats';

// Ontology Rules
export { ONTOLOGY_CHANGE_RULE, ONTOLOGY_PROTECTION } from './ontology-rules';

// Refusal Protocol
export { 
  STANDARD_REFUSAL_PHRASES, 
  NEVER_SAY, 
  REFUSAL_PROTOCOL 
} from './refusal';

// AI Relation
export { AI_RELATION, AI_BOUNDARIES } from './ai-relation';

// Succession
export { 
  RESIGNATION_SIGNALS, 
  RESIGNATION_REQUIREMENT,
  SUCCESSION_RULE,
  SUCCESSION_TEST,
} from './succession';

// Morality
export { SYSTEM_MORALITY, STEWARD_FINAL_WORDS } from './morality';

// Oath
export {
  CORE_COMMITMENT,
  POSITIVE_DUTIES,
  NEGATIVE_DUTIES,
  AUTHORITY,
  CHANGE_DISCIPLINE,
  AI_ACKNOWLEDGMENT,
  SUCCESSION_COMMITMENT,
  RESIGNATION_CLAUSE,
  FINAL_STATEMENT,
  STEWARD_OATH_COMPLETE,
  type OathSignature,
} from './oath';

// ============================================================================
// FINAL STATUS
// ============================================================================

export const HANDBOOK_STATUS = {
  now_exists: [
    'Architecture',
    'Discipline',
    'Protection',
    'Succession',
  ],
  nothing_more_to_build: true,
  only_remaining: 'Not to destroy it',
} as const;

export const HANDBOOK_VERSION = '1.0.0' as const;
