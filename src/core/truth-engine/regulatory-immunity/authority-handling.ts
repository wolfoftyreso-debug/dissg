/**
 * WHEN AUTHORITIES WANT TO "COLLABORATE"
 * 
 * STEG 28: STAYING OUTSIDE JURISDICTION
 * 
 * It will happen. They will say:
 * - "We want to harmonize"
 * - "We want to certify"
 * - "We want to coordinate standards"
 * 
 * Your only stance: "We publish openly. You are free to use or not."
 */

/**
 * AUTHORITY APPROACHES
 */
export const AUTHORITY_APPROACHES = {
  harmonization: {
    what_they_say: 'We want to harmonize your data with official statistics',
    what_they_mean: 'We want influence over your methodology',
    your_response: 'Our methodology is public. You are welcome to reference it.',
    never_do: 'Enter joint working groups on methodology',
  },
  
  certification: {
    what_they_say: 'We want to certify your data as official',
    what_they_mean: 'We want to create dependency and control',
    your_response: 'We do not seek certification. Our quality speaks for itself.',
    never_do: 'Apply for official recognition',
  },
  
  coordination: {
    what_they_say: 'We want to coordinate standards',
    what_they_mean: 'We want to bring you into our framework',
    your_response: 'Our standards are public. Anyone may adopt them.',
    never_do: 'Join standards bodies where voting affects your core',
  },
  
  oversight: {
    what_they_say: 'We need to ensure accountability',
    what_they_mean: 'We want authority over you',
    your_response: 'Our operations are fully transparent. Review at will.',
    never_do: 'Accept regulatory oversight of content',
  },
} as const;

/**
 * THE STANDARD RESPONSE
 */
export const STANDARD_RESPONSE = {
  text: 'We publish openly. You are free to use or not.',
  
  implications: [
    'We do not need your permission',
    'We do not seek your approval',
    'We do not want your endorsement',
    'We are not asking to be part of your framework',
  ],
  
  tone: 'Respectful but firm',
} as const;

/**
 * THINGS YOU NEVER DO
 */
export const NEVER_DO = {
  seek_certificates: {
    action: 'Apply for official certification',
    why_forbidden: 'Creates dependency on certifying authority',
    alternative: 'Let quality create de facto authority',
  },
  
  apply_for_permissions: {
    action: 'Request permission to operate',
    why_forbidden: 'Implies you need permission',
    alternative: 'Operate as publication, which requires no permission',
  },
  
  join_working_groups: {
    action: 'Participate in government working groups',
    why_forbidden: 'Creates implicit endorsement and future expectations',
    alternative: 'Publish responses to consultations if desired',
  },
  
  accept_funding: {
    action: 'Accept government grants or contracts',
    why_forbidden: 'Creates dependency and leverage',
    alternative: 'Commercial licensing only',
  },
  
  special_access: {
    action: 'Give authorities special access or terms',
    why_forbidden: 'Creates inequality and expectation',
    alternative: 'Same terms as everyone else',
  },
} as const;

/**
 * STAYING OUTSIDE JURISDICTION
 */
export const OUTSIDE_JURISDICTION = {
  principle: 'Operate in a way that creates no regulatory hook',
  
  mechanisms: [
    'Publish, do not serve',
    'Describe, do not advise',
    'Structure, do not create',
    'Reference, do not operate',
  ],
  
  jurisdictional_design: {
    incorporation: 'Neutral jurisdiction with strong publication rights',
    operations: 'Distributed across multiple jurisdictions',
    data: 'Mirrored globally, no single point of control',
  },
} as const;

/**
 * IF REGULATION IS PROPOSED
 */
export const IF_REGULATION_PROPOSED = {
  response_strategy: [
    'Document that we are a publication, not a service',
    'Show that nothing depends on us operationally',
    'Demonstrate that anyone can replicate our work',
    'Explain that regulation would destroy the neutrality that creates value',
  ],
  
  public_statement: `Regulation would destroy the independence that makes us valuable.
If required to operate under government oversight, we would cease to be neutral.
Our value comes from being outside all jurisdictions, accountable only to methodology.`,
  
  nuclear_option: 'Relocate operations to jurisdiction without proposed regulation',
} as const;

/**
 * RELATIONSHIP WITH OFFICIAL STATISTICS
 */
export const OFFICIAL_STATISTICS_RELATIONSHIP = {
  our_position: 'We are complementary, not competitive',
  
  we_do: [
    'Use official statistics as one source among many',
    'Attribute properly to official sources',
    'Respect their methodology within their scope',
  ],
  
  we_do_not: [
    'Claim to replace official statistics',
    'Seek official endorsement',
    'Position ourselves as alternative government',
  ],
  
  coexistence: 'They have their mandate, we have our independence',
} as const;
