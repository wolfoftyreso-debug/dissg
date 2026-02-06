/**
 * LEGAL POSITIONING
 * 
 * STEG 28: IMPORTANT DETAILS
 * 
 * In all documents, API-headers, and metadata:
 * - "Reference-only"
 * - "Non-operational"
 * - "No service guarantee"
 * - "No decision support"
 * 
 * You offer: information, not function.
 */

/**
 * MANDATORY LEGAL STATEMENTS
 */
export const MANDATORY_STATEMENTS = {
  reference_only: {
    text: 'Reference-only',
    meaning: 'For informational consultation, not operational use',
    placement: ['API headers', 'Documentation', 'Terms of use'],
  },
  
  non_operational: {
    text: 'Non-operational',
    meaning: 'Not designed for integration into operational systems',
    placement: ['API headers', 'License terms', 'Technical documentation'],
  },
  
  no_service_guarantee: {
    text: 'No service guarantee',
    meaning: 'No SLA, no uptime commitment, no availability promise',
    placement: ['Terms of service', 'API documentation'],
  },
  
  no_decision_support: {
    text: 'No decision support',
    meaning: 'Not for use in decision-making systems',
    placement: ['API headers', 'License terms', 'Every response'],
  },
  
  not_advice: {
    text: 'Not advice',
    meaning: 'Information only, not recommendation',
    placement: ['Every output', 'Documentation', 'UI'],
  },
} as const;

/**
 * API HEADER REQUIREMENTS
 */
export const API_HEADERS = {
  required_response_headers: {
    'X-Content-Type': 'reference-only',
    'X-Operational-Use': 'prohibited',
    'X-Decision-Support': 'false',
    'X-Service-Guarantee': 'none',
    'X-Advice': 'not-provided',
  },
  
  required_disclaimers: {
    every_response: true,
    format: 'JSON metadata block',
  },
} as const;

/**
 * WHAT YOU OFFER VS WHAT YOU DON'T
 */
export const OFFER_DISTINCTION = {
  you_offer: {
    information: 'Structured data about observations',
    reference: 'Verified facts with provenance',
    archive: 'Historical record of data',
    methodology: 'Transparent processing approach',
  },
  
  you_do_not_offer: {
    function: 'Operational capability',
    service: 'Guaranteed availability',
    support: 'Decision-making assistance',
    advice: 'Recommendations of any kind',
    reliability: 'Uptime commitments',
  },
} as const;

/**
 * TERMS OF SERVICE ESSENTIALS
 */
export const TERMS_ESSENTIALS = {
  service_description: `
This service provides access to structured reference data.
It is NOT a service in the traditional sense.
It is a publication that may be consulted.

NO GUARANTEES ARE PROVIDED regarding:
- Availability
- Accuracy
- Timeliness
- Completeness
- Fitness for any purpose
`,

  use_restrictions: `
This data MAY NOT be used for:
- Real-time operational decisions
- Automated trading or investment
- Medical diagnosis or treatment
- Legal proceedings as authoritative source
- Any use requiring guaranteed availability

Users assume ALL RISK for any use of this data.
`,

  liability_limitation: `
The provider accepts NO LIABILITY for:
- Decisions made using this data
- Systems that depend on this data
- Losses resulting from unavailability
- Errors in data or methodology
- Any consequential damages

USE IS ENTIRELY AT USER'S OWN RISK.
`,
} as const;

/**
 * WHEN LEGISLATION IS WRITTEN BROADLY
 */
export const BROAD_LEGISLATION_DEFENSE = {
  concern: 'Legislation often captures unintended targets',
  
  defense_documentation: {
    we_are: 'A reference publication',
    not: 'A digital service, platform, or infrastructure',
    evidence: 'Read-only, non-operational, no user accounts required',
  },
  
  arguments: [
    'Legislative intent targets operational services',
    'We provide information, not function',
    'Nothing depends on us for operation',
    'Anyone can replicate our data from public sources',
    'Regulation would destroy the independence that creates value',
  ],
  
  precedents: [
    'Libraries are not regulated as publishers',
    'Encyclopedias are not regulated as advice',
    'Dictionaries are not regulated as services',
    'Archives are not regulated as platforms',
  ],
} as const;

/**
 * DOCUMENTATION PACKAGE FOR LEGAL REVIEW
 */
export const LEGAL_PACKAGE = {
  required_documents: [
    'Terms of Service with full disclaimers',
    'Technical documentation showing non-operational design',
    'API specification showing read-only nature',
    'License terms prohibiting operational use',
    'Methodology documentation showing public sources',
  ],
  
  purpose: 'Provide complete defense against regulatory classification',
  
  maintenance: 'Review quarterly, update with each new regulation',
} as const;
