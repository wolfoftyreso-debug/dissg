/**
 * WHY EXIT IS THE MOST DANGEROUS MOMENT
 * 
 * STEG 29: THE EXISTENTIAL RISK
 * 
 * An AI oracle almost always dies from:
 * - Acquisition
 * - Merger
 * - "Strategic integration"
 * - Monetization pivot
 * 
 * You must therefore design exit-resistance in advance.
 */

/**
 * WHAT HAPPENS AT EXIT (SIMULTANEOUSLY)
 */
export const EXIT_DYNAMICS = {
  new_owners: {
    want: 'Realize value',
    means: 'Monetize data, expand use cases, reduce costs',
    danger: 'Will compromise neutrality for revenue',
  },
  
  new_management: {
    want: 'Create synergies',
    means: 'Integrate with existing products, share infrastructure',
    danger: 'Will blur boundaries between oracle and business',
  },
  
  new_product_leads: {
    want: 'Integrate',
    means: 'Add features, expand scope, "improve" user experience',
    danger: 'Will add interpretation, recommendations, predictions',
  },
  
  new_lawyers: {
    want: 'Optimize risk',
    means: 'Add disclaimers, limit access, control narrative',
    danger: 'Will restrict transparency to limit liability',
  },
} as const;

/**
 * THE FUNDAMENTAL PROBLEM
 */
export const EXIT_PROBLEM = {
  statement: 'All impulses at exit are individually rational but collectively fatal',
  
  mechanism: {
    step_1: 'New owner wants return on investment',
    step_2: 'Return requires changes to structure',
    step_3: 'Changes to structure alter epistemics',
    step_4: 'Altered epistemics destroy trust',
    step_5: 'Destroyed trust eliminates value',
  },
  
  paradox: 'The changes made to realize value are the ones that destroy value',
} as const;

/**
 * HISTORICAL EXAMPLES (UNNAMED BUT INSTRUCTIVE)
 */
export const EXIT_FAILURES = {
  pattern_1: {
    description: 'Neutral platform acquired by company with competing interests',
    outcome: 'Platform gradually favored acquirer, lost credibility',
    lesson: 'Independence cannot survive dependent ownership',
  },
  
  pattern_2: {
    description: 'Data service acquired for "strategic value"',
    outcome: 'Data was locked behind proprietary systems, transparency lost',
    lesson: 'Openness cannot survive closed ownership',
  },
  
  pattern_3: {
    description: 'Reference source acquired by content company',
    outcome: 'Reference became marketing vehicle, trust evaporated',
    lesson: 'Neutrality cannot survive biased ownership',
  },
} as const;

/**
 * WHY THIS MUST BE DESIGNED IN ADVANCE
 */
export const ADVANCE_DESIGN_NECESSITY = {
  reason: 'At exit, it is too late to protect structure',
  
  at_exit_you_have: [
    'Pressure to close quickly',
    'Legal complexity',
    'Emotional attachment',
    'Financial incentives to compromise',
    'Power asymmetry with buyer',
  ],
  
  before_exit_you_have: [
    'Time to think clearly',
    'No pressure',
    'Full control',
    'Ability to create binding structures',
    'Leverage from having something valuable',
  ],
  
  conclusion: 'Exit protection must be architectural, not negotiated',
} as const;
