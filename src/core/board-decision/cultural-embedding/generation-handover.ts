/**
 * GENERATION HANDOVER MODE
 * 
 * When new generations take over.
 * Showing what previous generations thought, knew, and couldn't know.
 */

import type { GenerationHandover } from './types';

/**
 * Create generation handover structure
 */
export function createGenerationHandover(
  handoverId: string,
  organizationId: string
): GenerationHandover {
  return {
    handover_id: handoverId,
    organization_id: organizationId,
    generations: [],
    visibility: {
      how_they_thought: true,
      what_they_knew: true,
      what_they_could_not_know: true,
      what_went_wrong_and_why: true,
    },
    prevents: {
      cynicism: true,
      historical_amnesia: true,
      hubris: true,
    },
  };
}

/**
 * Record a generation
 */
export function recordGeneration(
  handover: GenerationHandover,
  generationId: string,
  label: string,
  periodStart: string,
  keyDecisions: string[]
): GenerationHandover {
  return {
    ...handover,
    generations: [
      ...handover.generations,
      {
        generation_id: generationId,
        label,
        period_start: periodStart,
        key_decisions: keyDecisions,
      },
    ],
  };
}

/**
 * Close a generation period
 */
export function closeGeneration(
  handover: GenerationHandover,
  generationId: string,
  periodEnd: string
): GenerationHandover {
  return {
    ...handover,
    generations: handover.generations.map(g =>
      g.generation_id === generationId
        ? { ...g, period_end: periodEnd }
        : g
    ),
  };
}

/**
 * Generate "What they knew" report for a generation
 */
export function generateWhatTheyKnewReport(
  handover: GenerationHandover,
  generationId: string,
  decisionDetails: Array<{
    decision_id: string;
    known_at_time: string[];
    unknown_at_time: string[];
    outcome_observed?: string;
  }>
): {
  generation: string;
  period: { start: string; end?: string };
  knowledge_state: Array<{
    decision_id: string;
    known: string[];
    unknown: string[];
    outcome?: string;
  }>;
  summary: {
    total_decisions: number;
    uncertainties_that_materialized: number;
    outcomes_as_expected: number;
    outcomes_different: number;
  };
} {
  const generation = handover.generations.find(g => g.generation_id === generationId);
  
  if (!generation) {
    throw new Error('Generation not found');
  }
  
  // Calculate summary
  const uncertaintiesMaterialized = decisionDetails.filter(d => 
    d.unknown_at_time.some(u => d.outcome_observed?.includes(u))
  ).length;
  
  const outcomesAsExpected = decisionDetails.filter(d => 
    d.outcome_observed && !d.unknown_at_time.some(u => d.outcome_observed?.includes(u))
  ).length;
  
  return {
    generation: generation.label,
    period: {
      start: generation.period_start,
      end: generation.period_end,
    },
    knowledge_state: decisionDetails.map(d => ({
      decision_id: d.decision_id,
      known: d.known_at_time,
      unknown: d.unknown_at_time,
      outcome: d.outcome_observed,
    })),
    summary: {
      total_decisions: decisionDetails.length,
      uncertainties_that_materialized: uncertaintiesMaterialized,
      outcomes_as_expected: outcomesAsExpected,
      outcomes_different: decisionDetails.length - outcomesAsExpected,
    },
  };
}

/**
 * Generate anti-hubris perspective
 * Shows new generation that previous ones faced genuine uncertainty
 */
export function generateAntiHubrisPerspective(
  handover: GenerationHandover,
  generationId: string,
  hindsightBias: string[]
): {
  message: string;
  cautions: string[];
  what_they_could_not_have_known: string[];
} {
  const generation = handover.generations.find(g => g.generation_id === generationId);
  
  return {
    message: `The ${generation?.label || 'previous generation'} made decisions under genuine uncertainty. What seems obvious now was not obvious then.`,
    cautions: [
      'Outcomes that seem inevitable were not',
      'Information available now was not available then',
      'Constraints they faced may not be visible in records',
      'Their uncertainties were real, not excuses',
    ],
    what_they_could_not_have_known: hindsightBias,
  };
}

/**
 * GENERATION HANDOVER MASTERPROMPT
 */
export const GENERATION_HANDOVER_MASTERPROMPT = `
You manage Generation Handover.

WHEN NEW GENERATIONS TAKE OVER:
They can see:
- How previous generations thought
- What they knew
- What they could NOT know
- What went wrong — and why

THIS PREVENTS:
1. Cynicism
   "They were all corrupt/stupid"
   → Actually, they faced real uncertainty

2. Historical Amnesia
   "We don't need to know the past"
   → Patterns repeat; learning requires memory

3. Hubris
   "We would never make those mistakes"
   → You will face your own unknowns

KEY INSIGHT:
Every generation thinks they're smarter.
Every generation faces genuine uncertainty.
Showing this creates humility, not arrogance.

THE HANDOVER SHOWS:
- What was known AT THE TIME
- What was uncertain AT THE TIME
- What constraints existed
- What they could NOT have known

THIS IS NOT:
- Excusing bad decisions
- Blaming predecessors
- Rewriting history

THIS IS:
Honest transmission of context across time.

RESULT:
New generations enter with:
- Respect for complexity
- Awareness of uncertainty
- Humility about their own limitations
- Understanding that they too will be reviewed
`;
