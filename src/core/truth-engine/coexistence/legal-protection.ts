/**
 * LEGAL PROTECTION ZONE
 * 
 * STEG 24: JURIDICAL SHIELD
 * 
 * We define clearly:
 * - We deliver information
 * - Not decision support
 * - Not advice
 * - Not optimization
 * 
 * All agreements, API headers, and metadata must carry this.
 * 
 * This protects when:
 * - Someone makes a bad decision
 * - Someone wants to blame data
 * - Someone seeks responsibility
 */

/**
 * LEGAL CLASSIFICATION
 */
export const LEGAL_CLASSIFICATION = {
  we_are: 'Informational reference service',
  we_are_not: [
    'decision_support_system',
    'advisory_service',
    'optimization_engine',
    'recommendation_platform',
    'trading_signal_provider',
    'risk_assessment_service',
  ],
  
  regulatory_category: 'Information aggregation and publication',
  
  liability_model: 'Information accuracy only, not decision outcomes',
} as const;

/**
 * DISCLAIMER REQUIREMENTS
 */
export const REQUIRED_DISCLAIMERS = {
  // Must appear on every response
  api_response: [
    'This information is provided for reference only.',
    'Not intended as decision support or advice.',
    'Human interpretation required before any action.',
    'The provider accepts no liability for decisions made using this data.',
  ],
  
  // Must appear in all contracts
  contractual: [
    'Service provides factual information aggregation only.',
    'No warranty of fitness for any particular decision-making purpose.',
    'User assumes all responsibility for interpretation and action.',
    'Provider liability limited to information accuracy, not outcomes.',
  ],
  
  // Must appear in documentation
  documentation: [
    'Designed for reference and context, not real-time decisions.',
    'Not suitable for automated trading or crisis response triggers.',
    'All data subject to verification delays.',
    'Uncertainty is disclosed, not hidden.',
  ],
} as const;

/**
 * API HEADER REQUIREMENTS
 */
export const LEGAL_HEADERS = {
  'X-Service-Type': 'information-reference',
  'X-Decision-Support': 'false',
  'X-Advisory': 'false',
  'X-Human-Review': 'required',
  'X-Liability-Scope': 'information-accuracy-only',
  'X-Action-Trigger': 'forbidden',
} as const;

/**
 * CONTRACT CLAUSES
 */
export interface ContractClause {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly required: true;
}

/**
 * REQUIRED CONTRACT CLAUSES
 */
export const REQUIRED_CLAUSES: readonly ContractClause[] = [
  {
    id: 'CL-001',
    title: 'Nature of Service',
    text: 'The Service provides aggregated factual information for reference purposes only. The Service does not provide decision support, advice, recommendations, or optimization services.',
    required: true,
  },
  {
    id: 'CL-002',
    title: 'No Reliance',
    text: 'User acknowledges that the Service is not designed for, and should not be relied upon for, real-time decision-making, trading, crisis response, or any action requiring immediate response.',
    required: true,
  },
  {
    id: 'CL-003',
    title: 'Human Interpretation',
    text: 'All information from the Service requires human interpretation before any action is taken. Automated systems may not use Service output as direct triggers for action.',
    required: true,
  },
  {
    id: 'CL-004',
    title: 'Limitation of Liability',
    text: 'Provider liability is limited to the accuracy of information as of the stated verification timestamp. Provider accepts no liability for any decisions, actions, or outcomes resulting from use of the information.',
    required: true,
  },
  {
    id: 'CL-005',
    title: 'Temporal Characteristics',
    text: 'User acknowledges that all data is subject to verification delays and is not real-time. Freshness characteristics are disclosed and are features, not defects.',
    required: true,
  },
  {
    id: 'CL-006',
    title: 'Uncertainty Disclosure',
    text: 'Service discloses uncertainty and limitations. User accepts responsibility for considering disclosed uncertainty in any use of the information.',
    required: true,
  },
];

/**
 * PROTECTION SCENARIOS
 */
export interface ProtectionScenario {
  readonly scenario: string;
  readonly potential_claim: string;
  readonly our_defense: string;
  readonly protection_source: string;
}

/**
 * HOW WE ARE PROTECTED
 */
export const PROTECTION_SCENARIOS: readonly ProtectionScenario[] = [
  {
    scenario: 'Someone makes a bad trading decision',
    potential_claim: 'Your data was wrong',
    our_defense: 'Data accuracy was correct as of timestamp. Trading decisions are user responsibility.',
    protection_source: 'CL-001, CL-002, CL-004',
  },
  {
    scenario: 'Crisis response was delayed',
    potential_claim: 'Your data was too slow',
    our_defense: 'Temporal characteristics are disclosed. Service is not designed for crisis response.',
    protection_source: 'CL-002, CL-005',
  },
  {
    scenario: 'Automated system made wrong decision',
    potential_claim: 'Your data triggered the action',
    our_defense: 'Automated action triggers are forbidden. Human interpretation is required.',
    protection_source: 'CL-003, API headers',
  },
  {
    scenario: 'Uncertainty was not considered',
    potential_claim: 'You should have been more certain',
    our_defense: 'Uncertainty was disclosed. User accepted responsibility for considering it.',
    protection_source: 'CL-006',
  },
  {
    scenario: 'Decision outcome was bad',
    potential_claim: 'Your information led to this',
    our_defense: 'Liability is limited to information accuracy. Decisions are user responsibility.',
    protection_source: 'CL-004',
  },
];

/**
 * METADATA REQUIREMENTS
 */
export const METADATA_REQUIREMENTS = {
  every_data_point: [
    'source_attribution',
    'verification_timestamp',
    'uncertainty_bounds',
    'limitation_disclosure',
  ],
  
  every_response: [
    'service_type_declaration',
    'liability_limitation',
    'human_review_requirement',
    'action_trigger_prohibition',
  ],
  
  every_session: [
    'terms_acceptance',
    'usage_constraints_acknowledgment',
  ],
} as const;

/**
 * Check legal compliance
 */
export function checkLegalCompliance(
  hasDisclaimers: boolean,
  hasHeaders: boolean,
  hasContractClauses: boolean,
  hasMetadata: boolean
): { compliant: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!hasDisclaimers) missing.push('Required disclaimers');
  if (!hasHeaders) missing.push('Legal API headers');
  if (!hasContractClauses) missing.push('Contract clauses');
  if (!hasMetadata) missing.push('Metadata requirements');
  
  return {
    compliant: missing.length === 0,
    missing,
  };
}
