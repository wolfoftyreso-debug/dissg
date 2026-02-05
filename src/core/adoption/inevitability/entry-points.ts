/**
 * ADOPTION ENTRY POINTS
 * 
 * Start where decisions are already painful.
 * Decision-makers want protection, not advice.
 */

import type { EntryPointDefinition, AdoptionEntryPoint } from './types';

/**
 * All Entry Points
 */
export const ENTRY_POINTS: EntryPointDefinition[] = [
  {
    id: 'board_capital_decision',
    name: 'Board Capital Decisions',
    pain_description: 'High stakes, unclear accountability, post-hoc criticism risk',
    protection_offered: 'Traceable reasoning, explicit alternatives, documented uncertainty',
    typical_actors: ['Board members', 'CEOs', 'CFOs'],
    gravity_level: 'critical',
  },
  {
    id: 'long_horizon_investment',
    name: 'Long Horizon Investments',
    pain_description: 'Outcome unknown for years, easy to blame in hindsight',
    protection_offered: 'Locked assumptions, time-stamped context, scenario documentation',
    typical_actors: ['Investment committees', 'Pension funds', 'Endowments'],
    gravity_level: 'extreme',
  },
  {
    id: 'policy_with_criticism_risk',
    name: 'Policy Decisions with Criticism Risk',
    pain_description: 'Public scrutiny, political attack surface, media exposure',
    protection_offered: 'Explicit trade-offs, acknowledged limitations, transparent reasoning',
    typical_actors: ['Ministers', 'Agency heads', 'Municipal leaders'],
    gravity_level: 'extreme',
  },
  {
    id: 'major_purchase',
    name: 'Major Purchases',
    pain_description: 'Large commitment, difficult to reverse, stakeholder expectations',
    protection_offered: 'Documented criteria, alternatives considered, risk acknowledgement',
    typical_actors: ['Procurement officers', 'Executives', 'Committees'],
    gravity_level: 'high',
  },
  {
    id: 'portfolio_allocation',
    name: 'Portfolio Allocation',
    pain_description: 'Multiple competing options, uncertain outcomes, benchmark pressure',
    protection_offered: 'Assumption-locked scenarios, explicit risk tolerance, rebalancing rationale',
    typical_actors: ['Asset managers', 'Family offices', 'Wealth advisors'],
    gravity_level: 'critical',
  },
  {
    id: 'regulatory_compliance',
    name: 'Regulatory Compliance Decisions',
    pain_description: 'Legal exposure, audit risk, interpretation uncertainty',
    protection_offered: 'Documented interpretation, external reference, decision trail',
    typical_actors: ['Compliance officers', 'Legal counsel', 'Risk managers'],
    gravity_level: 'high',
  },
  {
    id: 'audit_preparation',
    name: 'Audit Preparation',
    pain_description: 'Need to explain past decisions, scattered documentation',
    protection_offered: 'Structured decision records, traceable reasoning, exportable evidence',
    typical_actors: ['Internal audit', 'External auditors', 'Board committees'],
    gravity_level: 'high',
  },
  {
    id: 'crisis_response',
    name: 'Crisis Response',
    pain_description: 'Time pressure, high stakes, incomplete information',
    protection_offered: 'Rapid structure, explicit unknowns, documented constraints',
    typical_actors: ['Crisis teams', 'Executives', 'Emergency responders'],
    gravity_level: 'extreme',
  },
];

/**
 * Get entry point by ID
 */
export function getEntryPoint(id: AdoptionEntryPoint): EntryPointDefinition | undefined {
  return ENTRY_POINTS.find(ep => ep.id === id);
}

/**
 * Get entry points by gravity level
 */
export function getEntryPointsByGravity(
  level: 'high' | 'critical' | 'extreme'
): EntryPointDefinition[] {
  return ENTRY_POINTS.filter(ep => ep.gravity_level === level);
}

/**
 * Common pattern across all entry points
 */
export const ENTRY_POINT_PATTERN = {
  common_need: 'Decision-makers want protection, not advice',
  psychological_driver: 'Fear of being blamed for something that could have been foreseen',
  solution_offered: 'Traceable, defensible, structured record of reasoning',
  adoption_trigger: 'First time they can say "I can show exactly how we thought"',
};

/**
 * ENTRY POINTS MASTERPROMPT
 */
export const ENTRY_POINTS_MASTERPROMPT = `
You manage ADOPTION ENTRY POINTS.

CORE INSIGHT:
Adoption starts where decisions are already painful.
Not with small decisions. With ones that carry risk.

PERFECT ENTRY POINTS:
1. Board capital decisions
2. Long horizon investments
3. Policy with criticism risk
4. Major purchases
5. Portfolio allocation
6. Regulatory compliance
7. Audit preparation
8. Crisis response

COMMON PATTERN:
Decision-makers want PROTECTION, not advice.

THE TRIGGER:
"If someone asks me how we thought, I can show exactly."

Once someone has that protection once,
they don't want to be without it again.

NO SALES REQUIRED:
The pain already exists.
The solution fits the pain.
Adoption is inevitable.
`;
