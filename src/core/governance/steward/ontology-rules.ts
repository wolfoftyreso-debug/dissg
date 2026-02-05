/**
 * ONTOLOGY CHANGES
 * 
 * Extremely rare. If it goes fast → it's wrong.
 */

import type { OntologyChangeRule } from './types';

export const ONTOLOGY_CHANGE_RULE: OntologyChangeRule = {
  permitted_when: [
    'Reality can no longer be expressed correctly',
    'Uncertainty has become systematically invisible',
    'Decisions are no longer comparable over time',
  ],
  
  process: [
    'Public diff',
    'Motivated in terms of loss of legibility',
    'Minimum 90 days delay',
    'Backward compatibility required',
  ],
  
  warning: 'If it goes fast → it is wrong.',
};

export const ONTOLOGY_PROTECTION = {
  default_answer: 'No',
  burden_of_proof: 'On the proposer',
  review_authority: 'All Stewards must agree',
  emergency_override: 'None exists',
} as const;
