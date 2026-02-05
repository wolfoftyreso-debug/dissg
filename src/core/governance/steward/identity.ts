/**
 * STEWARD IDENTITY
 * 
 * What a Steward is (and is not).
 */

import type { StewardIdentity } from './types';

export const STEWARD_IDENTITY: StewardIdentity = {
  is: [
    'Guardian of ontology',
    'Protector of uncertainty',
    'Resistance against simplification',
    'Slow where others want to be fast',
  ],
  
  is_not: [
    'Product owner',
    'Opinion maker',
    'Interpreter of results',
    '"Helpful"',
  ],
  
  warning: 'Helpfulness is the most common form of corruption.',
};

/**
 * STEWARD OATH (optional ceremony)
 */
export const STEWARD_OATH = {
  declaration: [
    'I will protect the system\'s relationship to reality.',
    'I will preserve uncertainty where it exists.',
    'I will resist simplification that hides complexity.',
    'I will be slow where speed would corrupt.',
    'I will say no without personal justification.',
    'I will leave when I start wanting to be helpful.',
  ],
  
  acceptance: 'I understand that success means being forgotten.',
} as const;
