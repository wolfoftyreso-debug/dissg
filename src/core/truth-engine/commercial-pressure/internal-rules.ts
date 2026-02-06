/**
 * INTERNAL RULES OF THUMB
 * 
 * STEG 27: EXTREMELY IMPORTANT GUIDELINES
 * 
 * The oracle is sold best when it is not sold at all –
 * it is licensed.
 */

/**
 * THE FUNDAMENTAL RULE
 */
export const FUNDAMENTAL_RULE = {
  if_a_deal: [
    'Requires a meeting about "content"',
    'Requires an exception',
    'Requires "just a small adjustment"',
  ],
  
  then_answer: 'NO',
  
  no_exceptions: true,
} as const;

/**
 * DEAL QUALIFICATION MATRIX
 */
export const DEAL_QUALIFICATION = {
  green_light: {
    characteristics: [
      'Standard API license',
      'Standard pricing tier',
      'No content discussions',
      'No schema requests',
      'No exclusivity requests',
    ],
    action: 'Proceed normally',
  },
  
  yellow_light: {
    characteristics: [
      'Enterprise volume',
      'SLA negotiations',
      'Support level discussions',
      'Integration assistance',
    ],
    action: 'Proceed with standard enterprise terms',
  },
  
  red_light: {
    characteristics: [
      'Content modification requests',
      'Schema change requests',
      'Exclusivity requests',
      'Early access requests',
      'Custom definition requests',
    ],
    action: 'Decline politely and explain constraints',
  },
} as const;

/**
 * MEETING RULES
 */
export const MEETING_RULES = {
  allowed_meeting_topics: [
    'Technical integration',
    'Pricing and terms',
    'Support arrangements',
    'Use case understanding',
    'API documentation',
  ],
  
  forbidden_meeting_topics: [
    'Data customization',
    'Schema modifications',
    'Definition changes',
    'Content influence',
    'Early access',
  ],
  
  if_forbidden_topic_raised: {
    response: 'That aspect is fixed. Let me explain our extension model.',
    redirect_to: 'How they can build their customization on top',
  },
} as const;

/**
 * SALES PHILOSOPHY
 */
export const SALES_PHILOSOPHY = {
  principle: 'The oracle is sold best when it is not sold at all – it is licensed',
  
  difference: {
    selling: 'Convincing someone to buy by meeting their needs',
    licensing: 'Providing access to a standard on fixed terms',
  },
  
  implications: [
    'No negotiation on content',
    'No persuasion on features',
    'No accommodation of requests',
    'Take it or leave it (politely)',
  ],
} as const;

/**
 * PRICE NEGOTIATION RULES
 */
export const PRICE_RULES = {
  negotiable: [
    'Volume discounts (standard tiers)',
    'Annual vs monthly payment',
    'Support level selection',
    'Multi-year commitments',
  ],
  
  not_negotiable: [
    'Access to different data',
    'Custom features',
    'Early access',
    'Exclusivity',
    'Schema modifications',
  ],
  
  discount_cap: 'Maximum 20% for volume, never for content',
} as const;

/**
 * WALK-AWAY TRIGGERS
 */
export const WALK_AWAY_TRIGGERS = {
  immediate_decline: [
    'Customer insists on data modification',
    'Customer wants exclusive access',
    'Customer wants to influence methodology',
    'Customer wants to suppress data',
    'Customer wants custom definitions',
  ],
  
  response: 'Thank you for your interest. Our structure does not accommodate this.',
  
  follow_up: 'If your needs change, our standard terms remain available.',
} as const;

/**
 * INTERNAL ACCOUNTABILITY
 */
export const INTERNAL_ACCOUNTABILITY = {
  who_can_approve_exceptions: 'No one',
  
  escalation_path: 'There is no escalation for content exceptions',
  
  sales_incentives: {
    rewarded_for: 'Standard license volume',
    not_rewarded_for: 'Custom deals',
    penalty_for: 'Promising content changes',
  },
  
  review_process: 'All deals reviewed for compliance with commercial principles',
} as const;

/**
 * CULTURAL PRINCIPLES
 */
export const CULTURAL_PRINCIPLES = {
  we_are_not: [
    'A vendor trying to close deals',
    'A service trying to please customers',
    'A platform seeking adoption at any cost',
  ],
  
  we_are: [
    'A standard providing access',
    'An infrastructure serving all equally',
    'A baseline that does not negotiate',
  ],
  
  mantra: 'Consistency over accommodation. Always.',
} as const;
