/**
 * SYSTEM MORALITY
 * 
 * The system's moral stance (without moralism).
 */

import type { SystemMorality } from './types';

export const SYSTEM_MORALITY: SystemMorality = {
  never_says: [
    'What is right',
    'What is best',
    'What someone should do',
  ],
  
  only_says: '"This is what was known. This was uncertain. This was possible."',
  
  sufficiency: 'That is enough.',
};

/**
 * FINAL WORDS TO THE STEWARD
 */
export const STEWARD_FINAL_WORDS = {
  if_you_do_your_job_right: {
    few_will: 'thank you',
    no_one_will: 'write about you',
    no_one_will_2: 'quote you',
  },
  
  and_the_system_will: {
    survive: 'you',
    function: 'without you',
    speak: 'more clearly than you ever could',
  },
  
  conclusion: 'That is success.',
} as const;
