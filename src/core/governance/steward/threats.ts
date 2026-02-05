/**
 * INTERNAL THREATS
 * 
 * The five most common threats (all internal).
 */

import type { InternalThreat } from './types';

export const INTERNAL_THREATS: readonly InternalThreat[] = [
  {
    id: 1,
    statement: '"We should make it easier to understand"',
    response_type: 'question',
    response: 'For whom? At whose expense?',
  },
  {
    id: 2,
    statement: '"Users want answers"',
    response_type: 'answer',
    response: 'They want protection, even if they don\'t know it.',
  },
  {
    id: 3,
    statement: '"AI can summarize this"',
    response_type: 'statement',
    response: 'No. Summary is power.',
  },
  {
    id: 4,
    statement: '"Everyone else does it this way"',
    response_type: 'statement',
    response: 'Relevance: zero.',
  },
  {
    id: 5,
    statement: '"This increases adoption"',
    response_type: 'statement',
    response: 'Adoption without legitimacy is decay.',
  },
];

export const THREAT_RECOGNITION = {
  source: 'Almost always internal',
  disguise: 'Usually sounds reasonable',
  detection: 'Ask: does this reduce visible uncertainty?',
} as const;
