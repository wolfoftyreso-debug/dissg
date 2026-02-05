/**
 * RESIGNATION & SUCCESSION
 * 
 * When to leave. How to be replaced.
 * Stewardship requires ego-death.
 */

import type { ResignationSignal, SuccessionRule } from './types';

// ============================================================================
// RESIGNATION SIGNALS
// ============================================================================

export const RESIGNATION_SIGNALS: readonly ResignationSignal[] = [
  {
    signal: 'You start wanting to "explain more"',
    meaning: 'You are becoming an advocate',
  },
  {
    signal: 'You start defending the system rhetorically',
    meaning: 'You are becoming political',
  },
  {
    signal: 'You start optimizing for user satisfaction',
    meaning: 'You are becoming a product manager',
  },
  {
    signal: 'You start feeling important',
    meaning: 'You are becoming the problem',
  },
];

export const RESIGNATION_REQUIREMENT = {
  condition: 'Any signal above',
  action: 'Leave immediately',
  rationale: 'Stewardship requires ego-death',
} as const;

// ============================================================================
// SUCCESSION (50+ YEARS)
// ============================================================================

export const SUCCESSION_RULE: SuccessionRule = {
  principle: 'A Steward must always be replaceable',
  
  requirements: [
    'No person dependencies',
    'No verbal decisions',
    'No "implicit understanding"',
  ],
  
  understanding_through: [
    'Charter',
    'Ontology',
    'History (Trust Log)',
  ],
  
  failure_condition: 'If it cannot be understood without you → you have failed',
};

export const SUCCESSION_TEST = {
  question: 'Can someone understand the system by reading only documents?',
  pass: 'Yes, completely',
  fail: 'No, requires explanation',
  consequence: 'If fail → Steward has failed their duty',
} as const;
