/**
 * REFUSAL PROTOCOL
 * 
 * How to say no (practically).
 * All criticism must be structural, not personal.
 */

import type { RefusalProtocol, RefusalPhrase } from './types';

export const STANDARD_REFUSAL_PHRASES: readonly RefusalPhrase[] = [
  {
    phrase: 'That would reduce uncertainty visibility.',
    use_when: 'Proposal hides unknowns',
  },
  {
    phrase: 'That introduces implicit recommendation.',
    use_when: 'Proposal suggests preference',
  },
  {
    phrase: 'That breaks symmetry between alternatives.',
    use_when: 'Proposal favors one option',
  },
  {
    phrase: 'That makes the system persuasive.',
    use_when: 'Proposal adds influence',
  },
];

export const NEVER_SAY = [
  'I don\'t like it',
  'It feels wrong',
  'Users won\'t understand',
] as const;

export const REFUSAL_PROTOCOL: RefusalProtocol = {
  standard_phrases: STANDARD_REFUSAL_PHRASES,
  never_say: NEVER_SAY,
  principle: 'All criticism must be structural, not personal.',
};
