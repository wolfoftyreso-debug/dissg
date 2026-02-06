/**
 * THE COMMERCIAL PARADOX
 * 
 * STEG 27: WHY INFLEXIBILITY IS VALUABLE
 * 
 * The paradox:
 * - The less you accommodate
 * - The more attractive you become
 * 
 * Because your value IS your inflexibility.
 */

/**
 * THE PARADOX EXPLAINED
 */
export const THE_PARADOX = {
  statement: 'The less you accommodate, the more attractive you become',
  
  mechanism: {
    accommodation: 'Customization implies negotiability',
    inflexibility: 'Fixed standards imply reliability',
    customer_perception: 'Reliability > Customization for serious users',
  },
  
  your_value: 'Your value IS your inflexibility',
} as const;

/**
 * WHY INFLEXIBILITY ATTRACTS
 */
export const WHY_INFLEXIBILITY_ATTRACTS = {
  risk_reduction: {
    flexible_system: 'Risk of special treatment for competitors',
    inflexible_system: 'Guaranteed equal treatment',
    winner: 'Inflexibility reduces competitive risk',
  },
  
  legal_simplification: {
    flexible_system: 'Complex contracts for each variation',
    inflexible_system: 'Standard terms for everyone',
    winner: 'Inflexibility reduces legal overhead',
  },
  
  trust_building: {
    flexible_system: 'If they change for others, they might change on us',
    inflexible_system: 'What we see is what everyone sees',
    winner: 'Inflexibility builds systemic trust',
  },
  
  internal_justification: {
    flexible_system: 'Hard to explain why vendor gave others different terms',
    inflexible_system: 'Easy to explain: everyone gets the same',
    winner: 'Inflexibility simplifies internal politics',
  },
} as const;

/**
 * WHAT CUSTOMERS ACTUALLY NEED
 */
export const WHAT_CUSTOMERS_NEED = {
  what_they_say: 'We need customization',
  
  what_they_mean: 'We need to feel special',
  
  what_they_actually_need: [
    'Reliable data',
    'Consistent access',
    'Equal treatment',
    'Clear terms',
    'Stable interface',
  ],
  
  what_delivers_this: 'Absolute inflexibility on core',
} as const;

/**
 * THE NEUTRAL COMPONENT
 */
export const NEUTRAL_COMPONENT = {
  identity: 'The neutral component that everyone needs',
  
  characteristics: [
    'Same for all users',
    'Trusted by competitors',
    'Acceptable to regulators',
    'Defensible to stakeholders',
    'Reliable over time',
  ],
  
  why_neutrality_requires_inflexibility: [
    'Any customization implies preference',
    'Any exception implies hierarchy',
    'Any negotiation implies malleability',
    'Neutrality requires absolute consistency',
  ],
} as const;

/**
 * MARKET POSITIONING
 */
export const MARKET_POSITIONING = {
  wrong_positioning: {
    message: 'We are flexible and customer-focused',
    implication: 'We can be negotiated with',
    result: 'Race to the bottom',
  },
  
  right_positioning: {
    message: 'We are the fixed standard',
    implication: 'We cannot be negotiated with',
    result: 'Premium positioning',
  },
  
  comparison: {
    flexible_vendors: 'Compete on features and price',
    inflexible_standard: 'Exists in category of one',
  },
} as const;

/**
 * LONG-TERM VALUE CREATION
 */
export const LONG_TERM_VALUE = {
  year_1: {
    customer_reaction: 'Frustrated by inflexibility',
    your_position: 'Maintain standards',
    market_effect: 'Some customers leave',
  },
  
  year_2: {
    customer_reaction: 'Begin to appreciate consistency',
    your_position: 'Maintain standards',
    market_effect: 'Returning customers',
  },
  
  year_3: {
    customer_reaction: 'Actively value the standard',
    your_position: 'Maintain standards',
    market_effect: 'Word-of-mouth growth',
  },
  
  year_5: {
    customer_reaction: 'Cannot imagine alternative',
    your_position: 'Maintain standards',
    market_effect: 'Industry standard status',
  },
  
  year_10: {
    customer_reaction: 'Defend your inflexibility to others',
    your_position: 'Maintain standards',
    market_effect: 'Infrastructure status',
  },
} as const;
