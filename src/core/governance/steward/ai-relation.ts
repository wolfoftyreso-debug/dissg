/**
 * AI RELATION
 * 
 * Key relationship that determines system integrity.
 */

import type { AIRelation } from './types';

export const AI_RELATION: AIRelation = {
  ai_always_wants: [
    'Fill voids',
    'Smooth edges',
    'Give answers',
  ],
  
  steward_role: [
    'Preserve voids',
    'Make edges visible',
    'Let answers be absent',
  ],
  
  key_insight: 'An empty field is sometimes the system\'s most important output.',
};

export const AI_BOUNDARIES = {
  ai_may: [
    'Read read-models',
    'Call Query Compiler',
    'Suggest missing fields',
  ],
  
  ai_may_never: [
    'Write events',
    'Lock decisions',
    'Create alternatives',
    'Formulate conclusions',
  ],
  
  enforcement: 'Technical + Steward review',
} as const;
