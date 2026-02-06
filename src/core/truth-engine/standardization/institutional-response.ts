/**
 * INSTITUTIONAL RESPONSE PROTOCOL
 * 
 * STEG 23: WHEN STATES AND LARGE ACTORS APPEAR
 * 
 * At this point, these entities will want to:
 * - Collaborate
 * - License
 * - "Coordinate"
 * 
 * The only rule:
 * "We do not change structure. You adapt to it."
 * 
 * They will do it.
 * Because the alternative is worse.
 */

/**
 * INSTITUTIONAL ACTOR TYPES
 */
export type InstitutionalActor = 
  | 'government_agency'
  | 'international_organization'
  | 'major_platform'
  | 'academic_institution'
  | 'media_conglomerate'
  | 'financial_institution'
  | 'regulatory_body';

/**
 * WHAT THEY WANT
 */
export interface InstitutionalRequest {
  readonly actor_type: InstitutionalActor;
  readonly request_type: string;
  readonly real_motivation: string;
  readonly our_response: string;
}

/**
 * COMMON INSTITUTIONAL REQUESTS
 */
export const INSTITUTIONAL_REQUESTS: readonly InstitutionalRequest[] = [
  {
    actor_type: 'government_agency',
    request_type: 'Special data access',
    real_motivation: 'Control over narrative',
    our_response: 'Same access as everyone else',
  },
  {
    actor_type: 'government_agency',
    request_type: 'Custom schema modifications',
    real_motivation: 'Fit their legacy systems',
    our_response: 'You adapt to our schema',
  },
  {
    actor_type: 'international_organization',
    request_type: 'Partnership and coordination',
    real_motivation: 'Influence over standards',
    our_response: 'Use our public schemas',
  },
  {
    actor_type: 'major_platform',
    request_type: 'Exclusive licensing',
    real_motivation: 'Lock out competitors',
    our_response: 'Open to all, exclusive to none',
  },
  {
    actor_type: 'major_platform',
    request_type: 'API priority access',
    real_motivation: 'Speed advantage',
    our_response: 'Standard SLA for all',
  },
  {
    actor_type: 'regulatory_body',
    request_type: 'Compliance adjustments',
    real_motivation: 'Make us fit their rules',
    our_response: 'Our structure is the compliance',
  },
  {
    actor_type: 'financial_institution',
    request_type: 'Custom data feeds',
    real_motivation: 'Proprietary advantage',
    our_response: 'Same data, same format, for all',
  },
  {
    actor_type: 'media_conglomerate',
    request_type: 'Branded partnership',
    real_motivation: 'Credibility transfer',
    our_response: 'No branding, only citation',
  },
];

/**
 * THE ONE RULE
 */
export const THE_ONE_RULE = {
  statement: 'We do not change structure. You adapt to it.',
  
  why_this_works: [
    'We have what they need',
    'They cannot build it themselves',
    'Their alternative is worse',
    'Adapting is cheaper than fighting',
  ],
  
  why_they_comply: [
    'Network effects favor the standard',
    'AI agents already use us',
    'Switching costs are high',
    'Being outside is more expensive',
  ],
  
  exceptions: 'None',
} as const;

/**
 * RESPONSE PROTOCOL
 */
export interface ResponseProtocol {
  readonly request_category: string;
  readonly initial_response: string;
  readonly if_they_push: string;
  readonly final_position: string;
}

/**
 * HOW TO RESPOND
 */
export const RESPONSE_PROTOCOLS: readonly ResponseProtocol[] = [
  {
    request_category: 'Structure change',
    initial_response: 'Our structure is stable and published',
    if_they_push: 'Stability is our value proposition',
    final_position: 'We do not change structure',
  },
  {
    request_category: 'Special access',
    initial_response: 'All access is via public API',
    if_they_push: 'Fairness requires equal access',
    final_position: 'Same terms for everyone',
  },
  {
    request_category: 'Exclusive partnership',
    initial_response: 'We are open to all',
    if_they_push: 'Exclusivity would harm the standard',
    final_position: 'No exclusive arrangements',
  },
  {
    request_category: 'Governance seat',
    initial_response: 'Governance is internal',
    if_they_push: 'External governance creates conflicts',
    final_position: 'Independence is non-negotiable',
  },
  {
    request_category: 'Co-branding',
    initial_response: 'We do not co-brand',
    if_they_push: 'Branding dilutes trust',
    final_position: 'Citation only, no branding',
  },
];

/**
 * WHY THE ALTERNATIVE IS WORSE
 */
export const WHY_ALTERNATIVE_IS_WORSE = {
  for_governments: {
    without_us: 'Build own system, fragment from global standard',
    with_us: 'Use global standard, gain credibility',
    cost_difference: 'Years of effort vs. immediate access',
  },
  
  for_platforms: {
    without_us: 'Build own data layer, train own agents',
    with_us: 'Use trusted source, reduce hallucination',
    cost_difference: 'Massive investment vs. API integration',
  },
  
  for_regulators: {
    without_us: 'Create proprietary compliance format',
    with_us: 'Adopt established standard',
    cost_difference: 'Industry pushback vs. ready adoption',
  },
  
  for_organizations: {
    without_us: 'Maintain separate data standards',
    with_us: 'Join global ecosystem',
    cost_difference: 'Isolation vs. interoperability',
  },
} as const;

/**
 * NEGOTIATION STANCE
 */
export const NEGOTIATION_STANCE = {
  // What we negotiate
  negotiable: [
    'Support and documentation level',
    'Integration assistance',
    'Training and onboarding',
    'SLA tiers (within standard options)',
  ],
  
  // What we never negotiate
  non_negotiable: [
    'Schema structure',
    'Epistemic principles',
    'Access fairness',
    'Governance independence',
    'Exclusivity',
  ],
  
  // The posture
  posture: 'Welcoming but immovable',
  
  // The tone
  tone: 'We are here to help you adapt, not to change for you',
} as const;

/**
 * INSTITUTIONAL PRESSURE RESISTANCE
 */
export const PRESSURE_RESISTANCE = {
  // Pressure types we expect
  expected_pressures: [
    'Regulatory threats',
    'Funding offers',
    'Partnership proposals',
    'Public criticism',
    'Competitor creation',
  ],
  
  // Why we resist
  why_resist: 'Yielding once invites infinite demands',
  
  // How we resist
  how_resist: [
    'Point to published principles',
    'Show consistency over time',
    'Highlight value of stability',
    'Offer alternative accommodations',
  ],
  
  // When we might fail
  failure_mode: 'Internal corruption, not external pressure',
} as const;

/**
 * Calculate institutional pressure response
 */
export function calculatePressureResponse(
  actorType: InstitutionalActor,
  requestType: string,
  pressureLevel: 'low' | 'medium' | 'high'
): { response: string; stance: string } {
  // Find matching protocol
  const protocol = RESPONSE_PROTOCOLS.find(p => 
    requestType.toLowerCase().includes(p.request_category.toLowerCase())
  );
  
  if (!protocol) {
    return {
      response: 'Request does not match our service model',
      stance: 'No accommodation',
    };
  }
  
  // Response based on pressure level
  switch (pressureLevel) {
    case 'low':
      return { response: protocol.initial_response, stance: 'Friendly' };
    case 'medium':
      return { response: protocol.if_they_push, stance: 'Firm' };
    case 'high':
      return { response: protocol.final_position, stance: 'Immovable' };
  }
}

/**
 * THE FINAL TRUTH
 */
export const FINAL_TRUTH = {
  statement: 'They will adapt because the alternative is worse',
  
  evidence: [
    'Every major standard achieved this position',
    'HTTP, DNS, ISO formats all followed this path',
    'Resistance fades when costs become clear',
  ],
  
  timeline: 'Initial pushback, gradual acceptance, eventual advocacy',
} as const;
