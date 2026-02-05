/**
 * DAILY PRINCIPLES
 * 
 * Non-negotiable. If something breaks these → stop.
 */

import type { DailyPrinciple } from './types';

export const DAILY_PRINCIPLES: readonly DailyPrinciple[] = [
  {
    id: 1,
    principle: 'Structure > Sentiment',
    always: 'Structural integrity',
    never: 'Emotional appeal',
  },
  {
    id: 2,
    principle: 'Explicit ignorance > Implicit certainty',
    always: 'Declare what is unknown',
    never: 'Assume knowledge exists',
  },
  {
    id: 3,
    principle: 'Refusal > Guessing',
    always: 'Refuse to answer',
    never: 'Fill gaps with speculation',
  },
  {
    id: 4,
    principle: 'Time > Urgency',
    always: 'Take time needed',
    never: 'Rush for external pressure',
  },
  {
    id: 5,
    principle: 'Symmetry > Optimization',
    always: 'Treat all alternatives equally',
    never: 'Optimize for preferred outcomes',
  },
];

export const PRINCIPLE_ENFORCEMENT = {
  violation_response: 'Stop immediately',
  no_exceptions: true,
  override_authority: 'None',
} as const;
