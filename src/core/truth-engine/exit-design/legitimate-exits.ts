/**
 * WHAT EXIT LOOKS LIKE IN PRACTICE
 * 
 * STEG 29: LEGITIMATE EXITS
 * 
 * Examples of legitimate exits:
 * - Sale of API business
 * - Licensing to Big Tech
 * - IPO of operational company
 * - Regional subsidiaries
 * 
 * All of these change nothing in CQ/CA, ranking, or epistemics.
 */

/**
 * LEGITIMATE EXIT EXAMPLES
 */
export const LEGITIMATE_EXITS = {
  api_business_sale: {
    what_is_sold: 'Company that operates API access service',
    what_remains_unchanged: 'Protocol, schema, data, methodology',
    buyer_receives: 'Customer relationships, infrastructure, revenue stream',
    buyer_cannot_change: 'Data definitions, epistemic rules, history',
    
    example_scenario: `
      Company A has built API infrastructure and customer base.
      Company A is sold to Company B.
      Company B continues operating API access.
      Protocol data remains unchanged.
      Users notice no difference in data quality.
    `,
  },
  
  big_tech_licensing: {
    what_is_sold: 'License to access and redistribute protocol data',
    what_remains_unchanged: 'Protocol, schema, control, exclusivity',
    buyer_receives: 'Right to use data in their products',
    buyer_cannot_change: 'Data source, methodology, other users access',
    
    example_scenario: `
      Big Tech company licenses protocol data.
      They integrate it into their products.
      They pay license fees.
      They cannot modify the data.
      They cannot prevent others from licensing.
    `,
  },
  
  operational_ipo: {
    what_is_sold: 'Shares in operational company (public offering)',
    what_remains_unchanged: 'Protocol foundation independence',
    shareholders_receive: 'Ownership in profitable access business',
    shareholders_cannot_change: 'Protocol governance, data integrity',
    
    example_scenario: `
      Operational company goes public.
      Shareholders own shares in API business.
      Foundation remains independent.
      Protocol cannot be changed by shareholder vote.
    `,
  },
  
  regional_subsidiaries: {
    what_is_sold: 'Regional operating rights',
    what_remains_unchanged: 'Global protocol, data consistency',
    buyer_receives: 'Right to operate in specific region',
    buyer_cannot_change: 'Protocol definitions, global methodology',
    
    example_scenario: `
      Regional company licenses operating rights.
      They serve local customers.
      They use global protocol data.
      They cannot create regional variations.
    `,
  },
} as const;

/**
 * WHAT ALL LEGITIMATE EXITS HAVE IN COMMON
 */
export const EXIT_COMMONALITIES = {
  protocol_unchanged: {
    cq_ca_unchanged: true,
    ranking_unchanged: true,
    epistemics_unchanged: true,
    methodology_unchanged: true,
    history_unchanged: true,
  },
  
  access_unchanged: {
    public_access_same: true,
    api_access_same: true,
    verification_possible: true,
    no_exclusive_rights: true,
  },
  
  governance_unchanged: {
    foundation_independent: true,
    board_composition_stable: true,
    charter_intact: true,
    oversight_continuous: true,
  },
} as const;

/**
 * THE VALUE PROPOSITION
 */
export const EXIT_VALUE = {
  for_founders: {
    financial_return: 'Full value of operational business',
    legacy_preservation: 'Protocol continues unchanged',
    reputation_protection: 'No association with future degradation',
  },
  
  for_buyers: {
    revenue_stream: 'Profitable access business',
    trust_inheritance: 'Credibility comes with purchase',
    risk_limitation: 'Cannot accidentally destroy value',
  },
  
  for_users: {
    continuity: 'Same data, same quality, same access',
    guarantee: 'Protocol cannot be changed by new owner',
    alternatives: 'Other operators can emerge if needed',
  },
  
  for_society: {
    stability: 'Reference infrastructure remains stable',
    independence: 'No single entity controls truth',
    resilience: 'System survives ownership changes',
  },
} as const;

/**
 * EXIT PROCESS
 */
export const EXIT_PROCESS = {
  pre_exit: {
    ensure: 'Structural separation is complete',
    verify: 'Protocol is independently governed',
    document: 'All constraints are legally binding',
  },
  
  during_exit: {
    scope: 'Only operational entity is for sale',
    clarify: 'Protocol remains with foundation',
    communicate: 'Users understand nothing changes',
  },
  
  post_exit: {
    monitor: 'New operator respects constraints',
    maintain: 'Foundation independence',
    report: 'Any concerns publicly',
  },
} as const;
