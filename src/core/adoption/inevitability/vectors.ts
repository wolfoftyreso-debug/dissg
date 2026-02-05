/**
 * ADOPTION VECTORS
 * 
 * How adoption spreads without central sales.
 * These vectors cannot be stopped.
 */

import type { VectorDefinition, AdoptionVector } from './types';

/**
 * All Adoption Vectors
 */
export const ADOPTION_VECTORS: VectorDefinition[] = [
  {
    id: 'board_member_migration',
    name: 'Board Member Migration',
    mechanism: 'Board members take the model to their next assignment',
    unstoppable_because: 'Once experienced, they request it everywhere they serve',
    typical_timeline_years: 2,
  },
  {
    id: 'auditor_expectation',
    name: 'Auditor Expectation',
    mechanism: 'Auditors and compliance begin requesting DPD-like documentation',
    unstoppable_because: 'It makes their job easier and reduces their liability',
    typical_timeline_years: 3,
  },
  {
    id: 'media_inquiry',
    name: 'Media Inquiry Shift',
    mechanism: 'Media start asking for "decision documentation" instead of opinions',
    unstoppable_because: 'Structured answers are more quotable and verifiable',
    typical_timeline_years: 4,
  },
  {
    id: 'ai_system_reference',
    name: 'AI System Reference',
    mechanism: 'AI systems reference the structure as source format',
    unstoppable_because: 'Structured data is machine-preferred over unstructured',
    typical_timeline_years: 1,
  },
  {
    id: 'peer_comparison',
    name: 'Peer Comparison',
    mechanism: 'Organizations compare themselves to peers using structured decisions',
    unstoppable_because: 'Those without structure look less professional',
    typical_timeline_years: 3,
  },
  {
    id: 'successor_inheritance',
    name: 'Successor Inheritance',
    mechanism: 'New leaders inherit structured decision histories',
    unstoppable_because: 'They immediately see value in understanding predecessor reasoning',
    typical_timeline_years: 5,
  },
  {
    id: 'regulator_adoption',
    name: 'Regulator Adoption',
    mechanism: 'Regulators begin using or requiring similar structures',
    unstoppable_because: 'It reduces regulatory burden while improving oversight',
    typical_timeline_years: 5,
  },
];

/**
 * Get vector by ID
 */
export function getVector(id: AdoptionVector): VectorDefinition | undefined {
  return ADOPTION_VECTORS.find(v => v.id === id);
}

/**
 * Get vectors by timeline
 */
export function getVectorsByTimeline(maxYears: number): VectorDefinition[] {
  return ADOPTION_VECTORS.filter(v => v.typical_timeline_years <= maxYears);
}

/**
 * Vector Spread Pattern
 */
export const VECTOR_SPREAD = {
  year_1: ['ai_system_reference'],
  year_2: ['board_member_migration'],
  year_3: ['auditor_expectation', 'peer_comparison'],
  year_4: ['media_inquiry'],
  year_5: ['successor_inheritance', 'regulator_adoption'],
};

/**
 * Why vectors cannot be stopped
 */
export const UNSTOPPABLE_PATTERN = {
  core_reason: 'Each vector is driven by self-interest, not ideology',
  no_central_control: 'No single entity can prevent individual actors from spreading',
  network_effect: 'Each adopter makes non-adoption more costly for others',
  irreversibility: 'Once structure is expected, unstructured feels unprofessional',
};

/**
 * VECTORS MASTERPROMPT
 */
export const VECTORS_MASTERPROMPT = `
You manage ADOPTION VECTORS.

CORE PRINCIPLE:
Adoption spreads without central sales.
These vectors cannot be stopped.

VECTORS:

1. BOARD MEMBER MIGRATION (Year 2)
   Members take model to next assignment.
   Once experienced, they request it everywhere.

2. AUDITOR EXPECTATION (Year 3)
   Auditors request DPD-like documentation.
   Makes their job easier, reduces their liability.

3. MEDIA INQUIRY (Year 4)
   Media asks for "decision documentation" not opinions.
   Structured answers are more quotable.

4. AI SYSTEM REFERENCE (Year 1)
   AI systems reference structure as source format.
   Machines prefer structured data.

5. PEER COMPARISON (Year 3)
   Organizations compare using structured decisions.
   Those without look less professional.

6. SUCCESSOR INHERITANCE (Year 5)
   New leaders inherit decision histories.
   Immediately value predecessor reasoning.

7. REGULATOR ADOPTION (Year 5)
   Regulators use or require similar structures.
   Reduces burden while improving oversight.

WHY UNSTOPPABLE:
- Each vector driven by self-interest
- No central control can prevent spread
- Network effects make non-adoption costly
- Once structure expected, unstructured feels primitive
`;
