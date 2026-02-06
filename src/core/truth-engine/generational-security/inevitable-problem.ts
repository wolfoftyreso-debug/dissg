/**
 * THE INEVITABLE PROBLEM
 * 
 * STEG 30: TIME RESISTANCE
 * 
 * All systems dependent on human intentions die.
 * All systems dependent on structure live.
 * 
 * This step is about removing humans from the equation
 * where it matters.
 */

/**
 * THE CERTAINTIES
 */
export const CERTAINTIES = {
  founders_replaced: {
    certainty: 'You will be replaced',
    timeline: 'Years to decades',
    cause: 'Age, exit, conflict, death',
  },
  
  new_generation_ambition: {
    certainty: 'Next generation will want to make their mark',
    timeline: 'Immediately upon arrival',
    cause: 'Human nature, career incentives',
  },
  
  future_leadership: {
    certainty: 'Future leadership will be smart, ambitious – and dangerous',
    timeline: 'Continuous',
    cause: 'Selection for ambition, not preservation',
  },
} as const;

/**
 * THE SOURCE OF DANGER
 */
export const DANGER_SOURCE = {
  not_evil: true,
  source: 'Ambition',
  
  mechanism: {
    step_1: 'New person arrives with energy and ideas',
    step_2: 'Wants to prove value and make impact',
    step_3: 'Identifies "improvements" that could be made',
    step_4: 'Implements changes that seem reasonable',
    step_5: 'Each change slightly erodes epistemic integrity',
    step_6: 'Over time, system transforms into something else',
  },
  
  tragedy: 'Each individual change is rational; cumulative effect is fatal',
} as const;

/**
 * WHY GOOD PEOPLE ARE THE GREATEST THREAT
 */
export const GOOD_PEOPLE_THREAT = {
  statement: 'The most dangerous people are smart, well-meaning improvers',
  
  why: {
    smart: 'Can identify genuine improvements',
    well_meaning: 'Have no bad intentions',
    improvers: 'Cannot leave well enough alone',
  },
  
  the_problem: 'Their improvements are individually good but systemically fatal',
  
  examples: [
    '"Let\'s make the data more accessible" → adds interpretation',
    '"Let\'s respond to user needs" → adds recommendations',
    '"Let\'s be more efficient" → removes verification steps',
    '"Let\'s modernize" → breaks continuity with past',
  ],
} as const;

/**
 * THE FUNDAMENTAL REQUIREMENT
 */
export const FUNDAMENTAL_REQUIREMENT = {
  statement: 'The oracle must be stronger than its stewards',
  
  meaning: {
    structure_over_intention: 'Structure constrains even good intentions',
    rules_over_judgment: 'Rules prevent well-meaning mistakes',
    system_over_individual: 'No individual can override system',
  },
  
  implementation: 'Design constraints that cannot be removed by those constrained',
} as const;

/**
 * TIME HORIZONS
 */
export const TIME_HORIZONS = {
  founder_generation: {
    years: '0-15',
    risk: 'Low - founders understand purpose',
    protection_needed: 'Minimal',
  },
  
  second_generation: {
    years: '15-30',
    risk: 'Medium - learned from founders but didn\'t live it',
    protection_needed: 'Structural constraints',
  },
  
  third_generation: {
    years: '30-50',
    risk: 'High - no living memory of origins',
    protection_needed: 'Automatic enforcement',
  },
  
  beyond: {
    years: '50+',
    risk: 'Existential - origins are history',
    protection_needed: 'Complete structural independence from humans',
  },
} as const;
