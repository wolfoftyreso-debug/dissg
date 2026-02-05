/**
 * PUBLIC PRESENCE
 * 
 * Without marketing.
 * Publish structure. Let world conclude.
 */

import type { PublicPresence, RolloutPrinciple } from './types';

/**
 * Public Presence Strategy
 */
export const PUBLIC_PRESENCE: PublicPresence = {
  published: [
    'The structure (schemas, formats)',
    'The standard (charter, principles)',
    'Examples (anonymized decision packages)',
    'Read-only portal (no login required)',
    'API documentation (for integration)',
    'Research findings (what we observed)',
  ],
  
  not_published: [
    'Marketing materials',
    'Sales pitches',
    'Competitive comparisons',
    'Customer testimonials',
    'Case studies with claims',
    'ROI calculations',
  ],
  
  never_says: [
    'This is better',
    'You should use this',
    'Everyone is switching',
    'Don\'t get left behind',
    'Transform your organization',
    'Revolutionary approach',
  ],
  
  lets_world_conclude: [
    'That structured decisions are more defensible',
    'That uncertainty acknowledgment is professional',
    'That alternatives exposure is responsible',
    'That old methods feel primitive in comparison',
    'That this is how serious decisions should be made',
  ],
};

/**
 * Rollout Principles
 */
export const ROLLOUT_PRINCIPLES: RolloutPrinciple[] = [
  {
    principle: 'No one is asked to switch systems',
    rationale: 'All great infrastructure wins by laying beside, not replacing',
    anti_pattern: 'Demanding commitment before experience',
  },
  {
    principle: 'Start with painful decisions, not small ones',
    rationale: 'Pain creates motivation. Small decisions don\'t hurt enough.',
    anti_pattern: 'Trying to capture everyday trivial choices first',
  },
  {
    principle: 'Protection, not advice',
    rationale: 'Decision-makers want to be defended, not told what to do',
    anti_pattern: 'Offering recommendations or suggestions',
  },
  {
    principle: 'Experience before explanation',
    rationale: 'Using once teaches more than reading about',
    anti_pattern: 'Long onboarding or training programs',
  },
  {
    principle: 'Spread through people, not campaigns',
    rationale: 'Board members and auditors carry the model with them',
    anti_pattern: 'Mass marketing or advertising',
  },
  {
    principle: 'Measure impact, not engagement',
    rationale: 'Decisions followed up matter. Clicks don\'t.',
    anti_pattern: 'Tracking vanity metrics',
  },
];

/**
 * What Success Looks Like (2-5 years)
 */
export const SUCCESS_INDICATORS = {
  year_2: [
    'Some board members request structure in new roles',
    'First auditor mentions "decision documentation"',
    'First AI system cites structure',
  ],
  year_3: [
    'Decisions without context begin to be questioned',
    'Multiple auditors expect structured records',
    'Peer comparison includes decision quality',
  ],
  year_4: [
    'Media occasionally asks for "decision package"',
    '"We had no alternative" starts being rejected',
    'Successors expect predecessor documentation',
  ],
  year_5: [
    'Uncertainty acknowledgment becomes professional norm',
    'Fast answers lose status in serious contexts',
    'System is cultural infrastructure',
  ],
};

/**
 * Why This Lasts 50 Years
 */
export const LONGEVITY_REASONS = {
  no_ideological_agreement_required: 'Works regardless of political views',
  no_political_power_required: 'Spreads through individual self-interest',
  no_perfect_people_required: 'Structure compensates for human weaknesses',
  core_requirement: 'Reality shown before action',
  that_requirement_never_ages: true,
};

/**
 * PUBLIC PRESENCE MASTERPROMPT
 */
export const PUBLIC_PRESENCE_MASTERPROMPT = `
You manage PUBLIC PRESENCE.

CORE PRINCIPLE:
Public presence without marketing.
Publish structure. Let world conclude.

WHAT WE PUBLISH:
- Structure (schemas, formats)
- Standard (charter, principles)
- Examples (anonymized)
- Read-only portal
- API documentation
- Research findings

WHAT WE DON'T PUBLISH:
- Marketing materials
- Sales pitches
- Testimonials
- Case studies with claims
- ROI calculations

WHAT WE NEVER SAY:
- "This is better"
- "You should use this"
- "Everyone is switching"
- "Don't get left behind"
- "Revolutionary"

WE LET THE WORLD CONCLUDE:
- Structured decisions are more defensible
- Uncertainty acknowledgment is professional
- Alternatives exposure is responsible
- Old methods feel primitive
- This is how serious decisions should be made

ROLLOUT PRINCIPLES:
1. No one asked to switch (lay beside)
2. Start with painful decisions
3. Protection, not advice
4. Experience before explanation
5. Spread through people
6. Measure impact, not engagement

WHY THIS LASTS 50 YEARS:
- No ideology required
- No political power required
- No perfect people required
- Just: reality shown before action
- That requirement never ages.
`;
