/**
 * THE NATURE OF DILUTION
 * 
 * STEG 26: WHAT ALWAYS HAPPENS
 * 
 * Most systems don't die from attacks.
 * They die from adaptation.
 */

/**
 * THE FATAL REQUESTS
 */
export const FATAL_REQUESTS = {
  warning: 'When you become the standard, people will say:',
  
  requests: [
    {
      sounds_like: 'Can we simplify the format?',
      actual_effect: 'Destroys precision',
      category: 'simplification',
    },
    {
      sounds_like: 'Can we merge these concepts?',
      actual_effect: 'Destroys boundaries',
      category: 'conflation',
    },
    {
      sounds_like: 'Can we make answers more user-friendly?',
      actual_effect: 'Destroys neutrality',
      category: 'adaptation',
    },
    {
      sounds_like: 'Can we help the model a little more?',
      actual_effect: 'Destroys separation',
      category: 'assistance',
    },
    {
      sounds_like: 'Can we add a summary?',
      actual_effect: 'Destroys completeness',
      category: 'compression',
    },
    {
      sounds_like: 'Can we prioritize the important parts?',
      actual_effect: 'Destroys objectivity',
      category: 'ranking',
    },
  ],
  
  truth: 'All of these sound reasonable. All of these are existential threats.',
} as const;

/**
 * WHY DILUTION HAPPENS
 */
export const WHY_DILUTION_HAPPENS = {
  external_pressure: [
    'Users want convenience',
    'Partners want integration',
    'Markets want features',
    'Regulators want compliance',
  ],
  
  internal_pressure: [
    'Teams want to ship',
    'Leaders want growth',
    'Developers want elegance',
    'Designers want usability',
  ],
  
  the_trap: 'Each compromise seems small. Cumulative effect is fatal.',
} as const;

/**
 * HOW DILUTION PROGRESSES
 */
export const DILUTION_STAGES = {
  stage_1: {
    name: 'Convenience layer',
    request: 'Just a helper on top',
    actual: 'Sets precedent for interpretation',
  },
  stage_2: {
    name: 'Format flexibility',
    request: 'Alternative output option',
    actual: 'Multiple truths emerge',
  },
  stage_3: {
    name: 'Concept consolidation',
    request: 'Merge for simplicity',
    actual: 'Distinctions lost forever',
  },
  stage_4: {
    name: 'User adaptation',
    request: 'Make it friendlier',
    actual: 'Neutrality abandoned',
  },
  stage_5: {
    name: 'Core modification',
    request: 'Update the schema',
    actual: 'Original contract broken',
  },
  
  endpoint: 'System becomes what everyone else already is',
} as const;

/**
 * RECOGNIZING DILUTION ATTEMPTS
 */
export const DILUTION_SIGNALS = {
  language_patterns: [
    'just', // "Can we just..."
    'little', // "Just a little change..."
    'simple', // "A simple improvement..."
    'quick', // "Quick fix..."
    'easy', // "Easy addition..."
    'minor', // "Minor adjustment..."
  ],
  
  reasoning_patterns: [
    'users_want_it',
    'competitors_have_it',
    'would_increase_adoption',
    'only_affects_edge_cases',
    'backwards_compatible',
  ],
  
  emotional_patterns: [
    'we_owe_it_to_users',
    'we_are_being_too_rigid',
    'times_have_changed',
    'we_need_to_evolve',
  ],
} as const;

/**
 * THE FUNDAMENTAL TRUTH
 */
export const FUNDAMENTAL_TRUTH = {
  statement: 'Strictness is not a cost. Strictness is the product.',
  
  corollary: 'The moment you become flexible, you become replaceable.',
  
  evidence: [
    'ISO standards last decades because they don\'t adapt',
    'TCP/IP survives because it doesn\'t negotiate',
    'UTC time works because it doesn\'t localize core',
  ],
} as const;
