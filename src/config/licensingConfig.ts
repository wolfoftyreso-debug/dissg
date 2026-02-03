/**
 * API POLICY & LICENSING FRAMEWORK
 * 
 * Enterprise data licensing architecture with transparent access tiers.
 * Open data visibility. Licensed intelligence.
 */

// License tier definitions
export type LicenseTier = 'open' | 'plus' | 'pro' | 'enterprise';

export const licenseTiers: Record<LicenseTier, {
  name: string;
  color: string;
  description: string;
  price: string;
  features: string[];
  limits: {
    ratePerMinute: number;
    ratePerDay: number;
    queryComplexity: number;
    nutsLevels: number[];
  };
  permissions: {
    commercialUse: boolean;
    attribution: 'required' | 'recommended' | 'optional';
    whiteLabel: boolean;
    bulkExport: boolean;
    feeds: boolean;
    correlations: boolean;
    customIntegration: boolean;
    sla: boolean;
  };
  typicalUsers: string[];
}> = {
  open: {
    name: 'Open Access',
    color: 'text-green-500',
    description: 'Non-commercial access to all public data',
    price: 'Free',
    features: [
      'Full read access to aggregated public data',
      'Data sharing with mandatory attribution',
      'Media and journalistic use',
      'Educational and research purposes',
    ],
    limits: {
      ratePerMinute: 30,
      ratePerDay: 1000,
      queryComplexity: 10,
      nutsLevels: [0, 1],
    },
    permissions: {
      commercialUse: false,
      attribution: 'required',
      whiteLabel: false,
      bulkExport: false,
      feeds: false,
      correlations: false,
      customIntegration: false,
      sla: false,
    },
    typicalUsers: ['General public', 'Educational institutions', 'Researchers', 'Journalists'],
  },
  plus: {
    name: 'Commercial License',
    color: 'text-blue-500',
    description: 'Commercial use and third-party publication rights',
    price: 'From SEK 4,900/month',
    features: [
      'All Open Access features',
      'Commercial use authorization',
      'Third-party publication rights',
      'Analytics and reporting applications',
      'Regional data access (NUTS 2)',
      'Basic correlation analysis',
    ],
    limits: {
      ratePerMinute: 120,
      ratePerDay: 50000,
      queryComplexity: 50,
      nutsLevels: [0, 1, 2],
    },
    permissions: {
      commercialUse: true,
      attribution: 'recommended',
      whiteLabel: false,
      bulkExport: false,
      feeds: true,
      correlations: true,
      customIntegration: false,
      sla: false,
    },
    typicalUsers: ['Media organizations', 'Consulting firms', 'Analytics providers', 'News agencies'],
  },
  pro: {
    name: 'Intelligence License',
    color: 'text-purple-500',
    description: 'Full integration capabilities and premium analytics',
    price: 'From SEK 14,900/month',
    features: [
      'All Commercial License features',
      'White-label deployment authorization',
      'Internal decision support systems',
      'Automated data feeds',
      'Bulk export and streaming access',
      'Granular data (NUTS 3)',
      'Advanced correlation engine',
      'Relevance scoring algorithms',
    ],
    limits: {
      ratePerMinute: 600,
      ratePerDay: 500000,
      queryComplexity: 200,
      nutsLevels: [0, 1, 2, 3],
    },
    permissions: {
      commercialUse: true,
      attribution: 'optional',
      whiteLabel: true,
      bulkExport: true,
      feeds: true,
      correlations: true,
      customIntegration: true,
      sla: true,
    },
    typicalUsers: ['Government agencies', 'Regional authorities', 'Large enterprises', 'Financial institutions'],
  },
  enterprise: {
    name: 'Enterprise Agreement',
    color: 'text-amber-500',
    description: 'Customized solutions for large-scale deployments',
    price: 'Contact sales',
    features: [
      'All Intelligence License features',
      'Custom service level agreements',
      'Dedicated technical support',
      'Jurisdiction-specific legal addenda',
      'On-premise deployment option',
      'Custom data feed configuration',
      'Priority feature development',
    ],
    limits: {
      ratePerMinute: 3000,
      ratePerDay: 5000000,
      queryComplexity: 1000,
      nutsLevels: [0, 1, 2, 3],
    },
    permissions: {
      commercialUse: true,
      attribution: 'optional',
      whiteLabel: true,
      bulkExport: true,
      feeds: true,
      correlations: true,
      customIntegration: true,
      sla: true,
    },
    typicalUsers: ['National governments', 'International organizations', 'Global enterprises'],
  },
};

// Legal disclaimer framework (globally applicable)
export const legalDisclaimers = {
  noAdvice: {
    id: 'no_advice',
    title: 'Informational Purpose Only',
    shortText: 'Observation, not recommendation',
    fullText: `This platform provides system-generated indicators derived from publicly available data sources. 
The information presented constitutes observation and aggregation, not advice, recommendations, or decision-making guidance. 
Users should consult qualified professionals before taking action based on presented information.`,
  },
  noCausality: {
    id: 'no_causality',
    title: 'Correlation Disclaimer',
    shortText: 'Correlation does not establish causation',
    fullText: `Displayed relationships indicate statistical covariation over time. 
Causal relationships are not established, implied, or verified by this system. 
Statistical patterns require contextual interpretation and professional analysis.`,
  },
  liabilityLimit: {
    id: 'liability_limit',
    title: 'Limitation of Liability',
    shortText: 'User assumes decision responsibility',
    fullText: `Users bear sole responsibility for decisions made using platform information. 
The platform operator accepts no liability for consequences arising from user decisions based on presented data or analysis.`,
  },
  dataQuality: {
    id: 'data_quality',
    title: 'Data Quality Framework',
    shortText: 'Aggregation responsibility only',
    fullText: `The platform is responsible for aggregation, normalization, and presentation processes. 
Underlying source data quality remains the responsibility of respective data providers. 
All data points include uncertainty indicators and timestamp documentation.`,
  },
};

// Data category definitions (strict separation)
export const dataCategories = {
  openSource: {
    name: 'Public Source Data',
    description: 'Data originating from government agencies, statistical offices, and international organizations',
    ownership: 'Not owned by platform',
    policy: [
      'Mandatory source attribution',
      'Direct links to original sources',
      'License compliance verification',
      'No modification of raw data',
    ],
    examples: ['Statistics Sweden (SCB)', 'Eurostat', 'WHO', 'World Bank', 'OECD'],
  },
  systemGenerated: {
    name: 'Platform-Generated Intelligence',
    description: 'Processed data, aggregations, and analytical outputs produced by platform algorithms',
    ownership: 'Platform intellectual property',
    policy: [
      'Commercial licensing applies',
      'Reuse permitted per license terms',
      'White-label rights in Pro/Enterprise tiers',
    ],
    examples: [
      'Normalizations',
      'Aggregations',
      'Composite indices',
      'Relevance scores',
      'Cluster analysis',
      'Correlation outputs',
      'Signal indicators',
      'Automated feeds',
    ],
  },
};

// Attribution requirements
export const attributionConfig = {
  required: {
    template: 'Data and analytics provided by {{platform}}. {{source_url}}',
    shortTemplate: 'Source: {{platform}}',
    placement: 'Visible adjacent to presented data',
  },
  recommended: {
    template: 'Based on data from {{platform}}',
    shortTemplate: '{{platform}}',
    placement: 'Footer or data source section',
  },
  optional: {
    template: null,
    shortTemplate: null,
    placement: 'At user discretion',
  },
};

// Anti-misuse policy framework
export const antiMisusePolicy = {
  prohibited: [
    'Mass database replication',
    'Scraping for competing services',
    'Reverse engineering of aggregated data',
    'Privacy protection circumvention',
    'Unlicensed resale or redistribution',
    'Automated feed replication',
  ],
  technicalProtections: [
    'Rate limiting per API key',
    'Query complexity thresholds',
    'Complete usage audit logging',
    'Automated violation detection',
    'IP-based throttling',
    'Scraping pattern detection',
  ],
  violationActions: {
    warning: 'Initial violation: email notification',
    temporaryBlock: 'Repeated violations: temporary suspension (24-72 hours)',
    permanentBlock: 'Severe violations: permanent access revocation',
  },
};

// Jurisdiction-specific addenda
export const jurisdictionAdditions = {
  EU: {
    name: 'European Union / EEA',
    notes: 'GDPR compliance through aggregation and anonymization',
    additionalTerms: [
      'Data Processing Agreement (DPA) available',
      'EU-based server infrastructure',
      'Privacy by design implementation',
    ],
  },
  US: {
    name: 'United States',
    notes: 'Enhanced liability disclaimers',
    additionalTerms: [
      'No warranty disclaimer',
      'Limitation of liability clause',
      'Choice of law provision',
    ],
  },
  PUBLIC_SECTOR: {
    name: 'Public Sector',
    notes: 'Procurement-compliant documentation available',
    additionalTerms: [
      'Public procurement compatible terms',
      'Standard IT service agreements',
      'Framework agreement eligibility',
    ],
  },
};

// Pricing logic transparency
export const pricingLogic = {
  basedOn: [
    'Geographic granularity (NUTS level)',
    'Update frequency (real-time versus daily)',
    'Decision-proximity signals (automated feeds)',
    'Service level agreement tier',
  ],
  notBasedOn: [
    'Number of data points accessed',
    'Request volume (within reasonable limits)',
    'Number of users (within organization)',
  ],
};

// Platform identity
export const platformIdentity = {
  name: 'STRIM',
  tagline: 'Open observation. Licensed intelligence.',
  mission: 'Infrastructure for measuring and understanding societal conditions.',
  principles: [
    'All data remains visible to all users',
    'All processed intelligence is available for licensing',
    'All methodologies are documented and transparent',
    'All weights are visible and auditable',
    'All versions are tracked and traceable',
    'All historical data is immutable',
  ],
};

// Economic sustainability framework
export interface RevenueStream {
  id: string;
  name: string;
  type: 'usage' | 'subscription' | 'enterprise' | 'value_add';
  gates_public_data: false; // Public data access is never gated
  target_segment: string;
}

export const REVENUE_STREAMS: RevenueStream[] = [
  { id: 'rs_api_volume', name: 'API Request Volume', type: 'usage', gates_public_data: false, target_segment: 'Developers' },
  { id: 'rs_automation', name: 'Automation & Feed Services', type: 'subscription', gates_public_data: false, target_segment: 'Media organizations' },
  { id: 'rs_whitelabel', name: 'White-Label Deployment', type: 'value_add', gates_public_data: false, target_segment: 'Enterprise clients' },
  { id: 'rs_enterprise_sla', name: 'Enterprise SLA', type: 'enterprise', gates_public_data: false, target_segment: 'Government agencies' }
];

// Legal core clauses for immunity hardening
export interface LegalClause {
  id: string;
  name: string;
  principle: string;
  implementation: string;
}

export const LEGAL_CORE_CLAUSES: LegalClause[] = [
  { id: 'lc_non_ownership', name: 'Data Non-Ownership', principle: 'The system never claims ownership of data passing through it', implementation: 'All data retains original source license' },
  { id: 'lc_attribution', name: 'Attribution by Design', principle: 'All data points require source attribution', implementation: 'Data without verified source is not displayed' },
  { id: 'lc_no_advisory', name: 'Non-Advisory Declaration', principle: 'The system never provides advice or recommendations', implementation: 'All output labeled as observation' },
  { id: 'lc_jurisdiction_neutral', name: 'Jurisdiction-Neutral API', principle: 'API functions independently of local legislation', implementation: 'No data requires specific jurisdictional compliance' }
];

export const LEGAL_CORE_STATEMENT = 'The system observes. The user interprets.' as const;
