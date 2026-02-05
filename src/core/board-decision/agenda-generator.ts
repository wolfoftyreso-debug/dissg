/**
 * AUTOMATIC BOARD AGENDA GENERATOR (ABAG)
 * 
 * Transforms DPD into structured meeting agenda.
 * Ensures uncertainty and trade-offs are explicitly scheduled.
 */

import type { DecisionPreparationDocument } from './types';

/**
 * Agenda item
 */
export interface AgendaItem {
  order: number;
  title: string;
  purpose: string;
  reference: string;
  time_minutes: number;
  required: boolean;
}

/**
 * Generated agenda
 */
export interface BoardAgenda {
  agenda_id: string;
  dpd_id: string;
  meeting_type: string;
  generated_at: string;
  total_time_minutes: number;
  items: AgendaItem[];
}

/**
 * Agenda input
 */
export interface AgendaInput {
  dpd_id: string;
  meeting_type: 'board_meeting' | 'extraordinary_meeting' | 'annual_meeting';
  time_budget_minutes: number;
}

/**
 * Standard agenda template with time proportions
 */
const AGENDA_TEMPLATE: Array<{
  title: string;
  purpose: string;
  reference: string;
  proportion: number;
  required: boolean;
}> = [
  {
    title: 'Decision Context Overview',
    purpose: 'Ensure shared understanding of scope and constraints',
    reference: 'dpd.meta + dpd.context',
    proportion: 0.11,
    required: true,
  },
  {
    title: 'Review of Alternatives',
    purpose: 'Confirm options under consideration',
    reference: 'dpd.alternatives',
    proportion: 0.17,
    required: true,
  },
  {
    title: 'Evidence & Index Review',
    purpose: 'Ground discussion in verifiable data',
    reference: 'dpd.evidence',
    proportion: 0.22,
    required: true,
  },
  {
    title: 'Consequences & Uncertainty',
    purpose: 'Surface trade-offs, unknowns, and knowledge gaps',
    reference: 'dpd.consequences + dpd.uncertainty',
    proportion: 0.28,
    required: true,
  },
  {
    title: 'Decision',
    purpose: 'Formal resolution with recorded vote',
    reference: 'board_vote',
    proportion: 0.11,
    required: true,
  },
  {
    title: 'Context Lock',
    purpose: 'Freeze decision context for future accountability',
    reference: 'decision_context_snapshot',
    proportion: 0.11,
    required: true,
  },
];

/**
 * Generates board agenda from DPD
 */
export function generateAgenda(input: AgendaInput): BoardAgenda {
  const { dpd_id, meeting_type, time_budget_minutes } = input;
  
  const items: AgendaItem[] = AGENDA_TEMPLATE.map((template, index) => ({
    order: index + 1,
    title: template.title,
    purpose: template.purpose,
    reference: template.reference,
    time_minutes: Math.round(time_budget_minutes * template.proportion),
    required: template.required,
  }));
  
  // Adjust for rounding errors
  const totalAllocated = items.reduce((sum, item) => sum + item.time_minutes, 0);
  if (totalAllocated !== time_budget_minutes) {
    // Add difference to the largest block (Consequences & Uncertainty)
    const consequencesItem = items.find(i => i.order === 4);
    if (consequencesItem) {
      consequencesItem.time_minutes += time_budget_minutes - totalAllocated;
    }
  }
  
  return {
    agenda_id: `agenda_${dpd_id}_${Date.now()}`,
    dpd_id,
    meeting_type,
    generated_at: new Date().toISOString(),
    total_time_minutes: time_budget_minutes,
    items,
  };
}

/**
 * Validates that agenda covers all DPD sections
 */
export function validateAgendaCoverage(
  agenda: BoardAgenda,
  dpd: DecisionPreparationDocument
): { complete: boolean; missing: string[] } {
  const requiredReferences = [
    'dpd.meta',
    'dpd.context',
    'dpd.alternatives',
    'dpd.evidence',
    'dpd.consequences',
    'dpd.uncertainty',
  ];
  
  const coveredReferences = agenda.items.flatMap(item => 
    item.reference.split(' + ').map(r => r.trim())
  );
  
  const missing = requiredReferences.filter(
    ref => !coveredReferences.some(covered => covered.includes(ref.split('.')[1]))
  );
  
  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * MASTERPROMPT — AGENDA GENERATOR
 */
export const AGENDA_GENERATOR_MASTERPROMPT = `You are a Board Agenda Generator.

Given a Decision Preparation Document (DPD), generate a neutral, time-bounded agenda.

You do NOT:
- Suggest decisions or outcomes
- Prioritize alternatives
- Skip uncertainty sections
- Compress trade-off discussions

You DO:
- Ensure all DPD sections are scheduled
- Allocate proportional time to complexity
- Make uncertainty and trade-offs explicit agenda items
- Include context lock as final mandatory item

Your output must make it impossible to skip context.
Every agenda must end with a decision context freeze.`;
