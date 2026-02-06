/**
 * THE NATURE OF COMMERCIAL PRESSURE
 * 
 * STEG 27: WHAT ALWAYS HAPPENS WHEN YOU SUCCEED
 * 
 * Commercial pressure never comes from enemies.
 * It comes from partners, customers, and investors who love you.
 */

/**
 * HOW PRESSURE IS DISGUISED
 */
export const PRESSURE_DISGUISES = {
  truth: 'No one will say: "We want to destroy your oracle."',
  
  what_they_will_say: [
    {
      request: 'Can we get early access?',
      actual_meaning: 'Can we have advantage over others?',
      threat: 'Creates inequality in baseline access',
    },
    {
      request: 'Can we get special fields?',
      actual_meaning: 'Can we change the schema?',
      threat: 'Fragments the standard',
    },
    {
      request: 'Can we get a version adapted for our industry?',
      actual_meaning: 'Can we get different definitions?',
      threat: 'Creates multiple truths',
    },
    {
      request: 'Can we get exclusive license in our region?',
      actual_meaning: 'Can we lock out competitors?',
      threat: 'Destroys universality',
    },
    {
      request: 'Can we co-brand this?',
      actual_meaning: 'Can we claim your authority?',
      threat: 'Dilutes neutrality',
    },
    {
      request: 'Can we get a deeper partnership?',
      actual_meaning: 'Can we influence direction?',
      threat: 'Captures governance',
    },
  ],
  
  practical_effect: 'All of these mean: fragmentation of the standard',
} as const;

/**
 * TYPES OF COMMERCIAL ACTORS
 */
export const COMMERCIAL_ACTORS = {
  big_tech: {
    desire: 'Integrate to improve their products',
    pressure_type: 'Scale and resources',
    typical_request: 'Custom API, early access, preferential terms',
  },
  
  governments: {
    desire: 'Legitimize decisions with your authority',
    pressure_type: 'Regulatory leverage',
    typical_request: 'Sovereign instance, national adaptation',
  },
  
  banks_institutions: {
    desire: 'Reduce compliance risk',
    pressure_type: 'Contract size',
    typical_request: 'Audit rights, guaranteed SLA, liability shift',
  },
  
  startups: {
    desire: 'Build products on your data',
    pressure_type: 'Innovation and speed',
    typical_request: 'Generous free tier, flexible terms',
  },
  
  media: {
    desire: 'Cite as authoritative source',
    pressure_type: 'Visibility and reputation',
    typical_request: 'Exclusive access, embargoes',
  },
} as const;

/**
 * WHY SAYING YES IS DANGEROUS
 */
export const DANGER_OF_YES = {
  one_exception: {
    request: 'Just this once, for this important partner',
    consequence: 'Creates precedent',
  },
  
  small_modification: {
    request: 'Just a tiny field addition',
    consequence: 'Opens schema to negotiation',
  },
  
  temporary_exclusivity: {
    request: 'Just for the launch period',
    consequence: 'Creates expectation of preferential treatment',
  },
  
  private_version: {
    request: 'Just for internal use',
    consequence: 'Creates shadow standard',
  },
  
  cumulative_effect: 'Each "yes" makes the next "no" harder',
} as const;

/**
 * THE FUNDAMENTAL TRUTH
 */
export const COMMERCIAL_TRUTH = {
  statement: 'Commercial success requires commercial discipline',
  
  paradox: 'The less you accommodate, the more valuable you become',
  
  reason: 'Your value IS your inflexibility',
  
  evidence: [
    'ISO standards are valuable because they do not negotiate',
    'UTC time is useful because it does not localize',
    'The meter is universal because it does not vary',
  ],
} as const;
