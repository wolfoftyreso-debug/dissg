/**
 * LICENSE TERMS THAT PROTECT EPISTEMICS
 * 
 * STEG 27: LEGAL PROTECTION OF TRUTH
 * 
 * Your licenses must explicitly state what is forbidden
 * to protect from misuse, reputation damage, and legal claims.
 */

/**
 * MANDATORY LICENSE TERMS
 */
export const MANDATORY_LICENSE_TERMS = {
  no_modification: {
    term: 'Data may not be modified',
    legal_text: 'Licensee shall not alter, transform, or create derivative works from Oracle data that misrepresent the original content, meaning, or context.',
    protects_against: 'Data manipulation',
  },
  
  no_false_conclusions: {
    term: 'Data may not be summarized as "oracle conclusion"',
    legal_text: 'Licensee shall not present their own analysis, interpretation, or conclusions as statements or conclusions of the Oracle.',
    protects_against: 'Attribution of opinions',
  },
  
  attribution_required: {
    term: 'Data used for advice requires clear attribution',
    legal_text: 'Any use of Oracle data in advisory, consulting, or decision-support contexts must clearly attribute the data source and distinguish Oracle data from Licensee analysis.',
    protects_against: 'Hidden use in advice',
  },
  
  not_decision_maker: {
    term: 'Oracle may not be presented as decision-maker',
    legal_text: 'Licensee shall not represent or imply that the Oracle makes, recommends, or endorses any decisions, actions, or policies.',
    protects_against: 'Responsibility transfer',
  },
  
  preserve_uncertainty: {
    term: 'Uncertainty indicators must be preserved',
    legal_text: 'When displaying Oracle data, Licensee must preserve and display all associated uncertainty indicators, confidence intervals, and data quality flags.',
    protects_against: 'False precision claims',
  },
  
  no_selective_display: {
    term: 'Data may not be selectively presented to mislead',
    legal_text: 'Licensee shall not selectively display, filter, or present Oracle data in a manner designed or likely to mislead users about the full context or meaning of the data.',
    protects_against: 'Cherry-picking',
  },
} as const;

/**
 * FORBIDDEN USE CASES
 */
export const FORBIDDEN_USE_CASES = {
  training_ai: {
    use_case: 'Using data to train AI models',
    forbidden: true,
    license_text: 'Oracle data may not be used for training, fine-tuning, or otherwise incorporating into machine learning models.',
  },
  
  political_advertising: {
    use_case: 'Using data in political advertising',
    forbidden: true,
    license_text: 'Oracle data may not be used in political advertising, campaign materials, or partisan communications.',
  },
  
  financial_advice: {
    use_case: 'Presenting as financial advice',
    forbidden: true,
    license_text: 'Oracle data may not be presented as financial, investment, or trading advice.',
  },
  
  automated_trading: {
    use_case: 'Direct input to trading systems',
    forbidden: true,
    license_text: 'Oracle data may not be used as direct automated input to financial trading or investment systems.',
  },
  
  government_policy: {
    use_case: 'Citing as policy recommendation',
    forbidden: true,
    license_text: 'Oracle data may not be cited as policy recommendation or governmental guidance.',
  },
} as const;

/**
 * ATTRIBUTION REQUIREMENTS
 */
export const ATTRIBUTION_REQUIREMENTS = {
  minimum_attribution: {
    text: 'Source: [Oracle Name], [Date Retrieved]',
    required_for: 'All public displays',
  },
  
  full_attribution: {
    text: 'Data from [Oracle Name]. Query: [Query ID]. Retrieved: [Timestamp]. This is observational data, not advice or recommendation.',
    required_for: 'Professional and institutional use',
  },
  
  disclaimer_requirement: {
    text: 'This data is provided for informational purposes only. The Oracle does not provide advice, recommendations, or endorsements.',
    required_for: 'Any context where advice might be implied',
  },
} as const;

/**
 * BREACH CONSEQUENCES
 */
export const BREACH_CONSEQUENCES = {
  minor_breach: {
    examples: ['Missing attribution', 'Incomplete disclaimer'],
    consequence: 'Written warning, 30 days to cure',
  },
  
  major_breach: {
    examples: ['Modifying data', 'Presenting as advice'],
    consequence: 'Immediate license suspension',
  },
  
  severe_breach: {
    examples: ['Training AI on data', 'Misrepresenting oracle position'],
    consequence: 'Permanent ban, potential legal action',
  },
} as const;

/**
 * AUDIT RIGHTS
 */
export const AUDIT_RIGHTS = {
  oracle_rights: [
    'Inspect how data is displayed',
    'Review attribution compliance',
    'Check for prohibited uses',
    'Access usage logs',
  ],
  
  audit_frequency: 'Annual or upon reasonable suspicion',
  
  non_compliance_discovery: 'Triggers major breach protocol',
} as const;
