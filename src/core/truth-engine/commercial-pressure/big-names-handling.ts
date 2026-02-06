/**
 * HANDLING "BIG NAMES" WITHOUT YIELDING
 * 
 * STEG 27: HOW TO SAY NO TO POWER
 * 
 * When Big Tech / States / Banks say:
 * "We want to collaborate, but..."
 * 
 * Your response is always the same.
 */

/**
 * THE STANDARD RESPONSE
 */
export const STANDARD_RESPONSE = {
  trigger: '"We want to collaborate, but..."',
  
  response: `Our structure is fixed.
Collaboration happens through adoption, not adaptation.`,
  
  tone: 'Respectful but immovable',
} as const;

/**
 * THE TYPICAL PROGRESSION
 */
export const TYPICAL_PROGRESSION = {
  phase_1: {
    name: 'Initial frustration',
    their_reaction: 'But we are [important entity], we need flexibility',
    your_response: 'We treat all entities equally. That is our value.',
    duration: 'Days to weeks',
  },
  
  phase_2: {
    name: 'Negotiation attempts',
    their_reaction: 'What if we pay more / commit longer?',
    your_response: 'Access tiers differ. Core never differs.',
    duration: 'Weeks',
  },
  
  phase_3: {
    name: 'Acceptance',
    their_reaction: 'Fine, we will work within your framework',
    your_response: 'Welcome. Here is your API key.',
    duration: 'Permanent',
  },
  
  phase_4: {
    name: 'Appreciation',
    their_reaction: 'Actually, this consistency is valuable',
    your_response: 'That is why we built it this way.',
    duration: 'Long-term relationship',
  },
  
  alternative: {
    name: 'They walk away',
    their_reaction: 'We will build our own',
    your_response: 'Good luck.',
    outcome: 'They return when their version fails',
  },
} as const;

/**
 * WHY BIG NAMES EVENTUALLY ACCEPT
 */
export const WHY_THEY_ACCEPT = {
  reason_1: {
    name: 'Build vs Buy',
    reality: 'Building a neutral oracle is extremely hard',
    implication: 'They cannot replicate your neutrality internally',
  },
  
  reason_2: {
    name: 'Credibility',
    reality: 'Internal systems lack external credibility',
    implication: 'They need third-party verification',
  },
  
  reason_3: {
    name: 'Maintenance',
    reality: 'Maintaining data quality is expensive',
    implication: 'Easier to license than build',
  },
  
  reason_4: {
    name: 'Consistency',
    reality: 'Their partners/competitors use you too',
    implication: 'Common baseline is valuable',
  },
  
  conclusion: 'The alternative is building something worse themselves',
} as const;

/**
 * NEGOTIATION SCRIPTS
 */
export const NEGOTIATION_SCRIPTS = {
  when_they_offer_money: {
    offer: 'We will pay 10x for customization',
    response: 'Our pricing reflects access. Content is not for sale.',
  },
  
  when_they_threaten_to_leave: {
    threat: 'We will go to your competitor',
    response: 'We wish you well. Our terms remain open if you return.',
  },
  
  when_they_claim_uniqueness: {
    claim: 'Our industry is special, we need different data',
    response: 'Our data is universal. Industry interpretation is your value-add.',
  },
  
  when_they_invoke_regulation: {
    claim: 'Regulators require us to have custom version',
    response: 'We can provide compliance documentation. Data remains standard.',
  },
  
  when_they_want_exclusivity: {
    request: 'Can we be the only one in our region?',
    response: 'Universal access is core to our value. No exclusivity.',
  },
  
  when_they_want_early_access: {
    request: 'Can we see data before others?',
    response: 'All users see data at the same time. No exceptions.',
  },
} as const;

/**
 * INTERNAL GUIDELINES FOR SALES TEAM
 */
export const SALES_GUIDELINES = {
  never_promise: [
    'Customization',
    'Exclusive access',
    'Early data',
    'Schema changes',
    'Definition modifications',
    'Special treatment',
  ],
  
  always_emphasize: [
    'Universal standard benefits everyone',
    'Consistency is the product',
    'All customers get same truth',
    'Flexibility is in how you USE data, not in data itself',
  ],
  
  escalation_triggers: [
    'Customer insists on customization',
    'Customer offers large premium for exceptions',
    'Customer claims regulatory requirement',
  ],
  
  escalation_response: 'Politely decline. Refer to partnership terms.',
} as const;

/**
 * CASE STUDIES (ANONYMIZED)
 */
export const CASE_STUDIES = {
  case_1: {
    entity_type: 'Major tech company',
    initial_request: 'Custom API with additional fields',
    our_response: 'Standard API with documentation on extension patterns',
    outcome: 'They built extension layer, became top customer',
  },
  
  case_2: {
    entity_type: 'National government',
    initial_request: 'Sovereign instance with national data',
    our_response: 'Same global instance, filtered view for their region',
    outcome: 'Accepted, now advocate for the system',
  },
  
  case_3: {
    entity_type: 'Global bank',
    initial_request: 'Pre-release data for risk models',
    our_response: 'Same release time as everyone',
    outcome: 'Accepted, value consistency for regulatory compliance',
  },
} as const;
