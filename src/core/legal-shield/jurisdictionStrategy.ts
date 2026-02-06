/**
 * JURISDICTION STRATEGY
 * 
 * Structure for maximum legal protection:
 * - No publisher liabilities
 * - No national media requirements
 * - No free speech conflicts
 * 
 * "Ni är infrastruktur, inte innehåll."
 */

// ============================================
// JURISDICTION CLASSIFICATION
// ============================================

export type JurisdictionType = 
  | 'neutral'      // Switzerland, Singapore
  | 'eu'           // EU GDPR jurisdiction
  | 'us'           // US Section 230 jurisdiction
  | 'offshore';    // Cayman, BVI, etc.

export interface Jurisdiction {
  code: string;
  name: string;
  type: JurisdictionType;
  
  // Legal environment
  has_publisher_liability: boolean;
  has_media_regulation: boolean;
  has_data_localization: boolean;
  
  // Suitability
  suitable_for: string[];
  risks: string[];
}

export const RECOMMENDED_JURISDICTIONS: Record<string, Jurisdiction> = {
  CH: {
    code: 'CH',
    name: 'Switzerland',
    type: 'neutral',
    has_publisher_liability: false,
    has_media_regulation: false,
    has_data_localization: false,
    suitable_for: ['holding_company', 'ip_ownership', 'data_storage'],
    risks: ['higher_costs'],
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    type: 'neutral',
    has_publisher_liability: false,
    has_media_regulation: false,
    has_data_localization: false,
    suitable_for: ['operational_entity', 'api_licensing', 'asia_operations'],
    risks: ['complex_setup'],
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    type: 'eu',
    has_publisher_liability: false,
    has_media_regulation: false,
    has_data_localization: true, // GDPR
    suitable_for: ['eu_operations', 'api_licensing'],
    risks: ['gdpr_compliance'],
  },
  EE: {
    code: 'EE',
    name: 'Estonia',
    type: 'eu',
    has_publisher_liability: false,
    has_media_regulation: false,
    has_data_localization: true, // GDPR
    suitable_for: ['digital_operations', 'e_residency'],
    risks: ['small_market'],
  },
};

// ============================================
// CORPORATE STRUCTURE
// ============================================

export interface CorporateEntity {
  name: string;
  jurisdiction: string;
  role: 'holding' | 'operational' | 'data' | 'licensing';
  owns: string[];  // Entity names it owns
  licenses_to: string[];  // Entities it licenses to
}

export const RECOMMENDED_STRUCTURE: CorporateEntity[] = [
  {
    name: 'DISSG Holding AG',
    jurisdiction: 'CH',
    role: 'holding',
    owns: ['DISSG Data AG', 'DISSG Operations Pte'],
    licenses_to: [],
  },
  {
    name: 'DISSG Data AG',
    jurisdiction: 'CH',
    role: 'data',
    owns: [],
    licenses_to: ['DISSG Operations Pte', 'DISSG EU BV'],
  },
  {
    name: 'DISSG Operations Pte',
    jurisdiction: 'SG',
    role: 'operational',
    owns: [],
    licenses_to: [],
  },
  {
    name: 'DISSG EU BV',
    jurisdiction: 'NL',
    role: 'licensing',
    owns: [],
    licenses_to: [],
  },
];

// ============================================
// LIABILITY SHIELD LAYERS
// ============================================

export interface LiabilityShield {
  layer: number;
  name: string;
  mechanism: string;
  protects_against: string[];
}

export const LIABILITY_SHIELDS: LiabilityShield[] = [
  {
    layer: 1,
    name: 'Functional Neutrality',
    mechanism: 'No opinions, predictions, or recommendations in code',
    protects_against: [
      'defamation_claims',
      'professional_liability',
      'advisory_liability',
    ],
  },
  {
    layer: 2,
    name: 'Provenance Transfer',
    mechanism: 'All interpretation responsibility assigned to user',
    protects_against: [
      'decision_liability',
      'investment_losses',
      'policy_failures',
    ],
  },
  {
    layer: 3,
    name: 'Corporate Structure',
    mechanism: 'Multi-jurisdiction entity separation',
    protects_against: [
      'jurisdictional_overreach',
      'asset_seizure',
      'regulatory_capture',
    ],
  },
  {
    layer: 4,
    name: 'Infrastructure Classification',
    mechanism: 'Legal classification as index provider, not publisher',
    protects_against: [
      'media_regulation',
      'content_liability',
      'editorial_responsibility',
    ],
  },
  {
    layer: 5,
    name: 'Contractual Safe Harbor',
    mechanism: 'Explicit user acceptance of liability on access',
    protects_against: [
      'third_party_claims',
      'downstream_liability',
      'integration_failures',
    ],
  },
];

// ============================================
// REGULATORY CLASSIFICATION
// ============================================

export interface RegulatoryPosition {
  classification: string;
  description: string;
  
  // What we claim to be
  positive_identity: string[];
  
  // What we explicitly are not
  negative_identity: string[];
  
  // Legal precedents
  analogous_entities: string[];
}

export const REGULATORY_POSITION: RegulatoryPosition = {
  classification: 'Neutral Index Provider',
  description: 'A data aggregation and normalization infrastructure providing versioned, source-referenced statistics without interpretation or advice.',
  
  positive_identity: [
    'data_aggregation_service',
    'format_normalization_provider',
    'version_control_infrastructure',
    'provenance_exposure_system',
    'machine_readable_api_provider',
  ],
  
  negative_identity: [
    'publisher',
    'media_outlet',
    'financial_advisor',
    'policy_consultant',
    'rating_agency',
    'analyst_firm',
  ],
  
  analogous_entities: [
    'internet_backbone_providers',      // Neutral infrastructure
    'weather_api_services',             // Data without advice
    'currency_exchange_data_feeds',     // Numbers without recommendations
    'time_synchronization_services',    // Infrastructure, not content
    'dns_providers',                    // Neutral routing
  ],
};

// ============================================
// COMPLIANCE DOCUMENTATION
// ============================================

export interface ComplianceDocumentation {
  document_type: string;
  version: string;
  last_updated: string;
  jurisdiction_specific: Record<string, string>;
}

export const REQUIRED_DOCUMENTATION: ComplianceDocumentation[] = [
  {
    document_type: 'Terms of Service',
    version: '1.0.0',
    last_updated: '2024-01-01',
    jurisdiction_specific: {
      EU: 'Includes GDPR compliance section',
      US: 'Includes Section 230 safe harbor',
      GLOBAL: 'Includes universal liability waiver',
    },
  },
  {
    document_type: 'Data Processing Agreement',
    version: '1.0.0',
    last_updated: '2024-01-01',
    jurisdiction_specific: {
      EU: 'GDPR Article 28 compliant',
      US: 'CCPA compliant',
    },
  },
  {
    document_type: 'API License Agreement',
    version: '1.0.0',
    last_updated: '2024-01-01',
    jurisdiction_specific: {
      GLOBAL: 'Includes liability transfer clause',
    },
  },
];

// ============================================
// ANTI-CAPTURE MECHANISMS
// ============================================

export const ANTI_CAPTURE_MECHANISMS = {
  // If system integrity is threatened
  nuclear_option: {
    trigger_conditions: [
      'attempted_content_censorship',
      'forced_editorial_control',
      'regulatory_capture_attempt',
      'hostile_acquisition',
    ],
    response: 'automatic_ipfs_publication',
    description: 'All code and data automatically published to IPFS and public mirrors',
  },
  
  // Distributed operations
  redundancy: {
    data_mirrors: 3,
    jurisdiction_spread: ['CH', 'SG', 'EE'],
    backup_frequency: 'daily',
  },
  
  // Governance protection
  governance: {
    change_latency_months: 18, // 18-month delay for core changes
    required_consensus: 0.75, // 75% of stewards
    exit_protocol: true, // Founders exit protocol in place
  },
};
