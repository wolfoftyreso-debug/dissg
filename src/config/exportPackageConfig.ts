/**
 * EXPORT PACKAGE CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hur systemet paketeras för export till andra länder.
 * 
 * Systemet är:
 * - Tekniskt replikerbart
 * - Metodologiskt dokumenterat
 * - Kulturellt anpassningsbart
 * - Juridiskt hållbart
 */

export interface CountryProfile {
  countryCode: string;
  countryName: string;
  localLanguages: string[];
  governmentType: 'parliamentary' | 'presidential' | 'semi_presidential' | 'other';
  statisticsAgency: string;
  dataAvailability: 'high' | 'medium' | 'low';
  adaptationNotes: string[];
}

export interface ExportPackage {
  version: string;
  releaseDate: string;
  
  // Core components
  coreFramework: {
    rootKPIDefinition: boolean;
    kpiHierarchy: boolean;
    thresholdSystem: boolean;
    analysisEngine: boolean;
  };
  
  // Adaptable components
  adaptableComponents: {
    kpiDefinitions: boolean;
    dataSourceIntegrations: boolean;
    governingPeriodTracking: boolean;
    partyStatistics: boolean;
    publicCommitmentFormat: boolean;
  };
  
  // Documentation
  documentation: {
    technicalSpec: boolean;
    methodologyGuide: boolean;
    implementationPlaybook: boolean;
    legalFramework: boolean;
  };
  
  // Support
  supportLevel: 'community' | 'standard' | 'enterprise';
}

/**
 * UNIVERSAL KPI TEMPLATE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Core KPIs that apply to any country.
 */
export const UNIVERSAL_KPI_TEMPLATE = {
  categories: [
    {
      id: 'demographics_health',
      universalName: 'Demographics & Health',
      description: 'Population base and physical capacity',
      suggestedKPIs: [
        'life_expectancy',
        'mortality_rate',
        'working_age_population',
      ],
    },
    {
      id: 'labor_productivity',
      universalName: 'Labor & Productivity',
      description: 'Economic participation and output',
      suggestedKPIs: [
        'employment_rate',
        'productivity_per_worker',
        'long_term_unemployment',
      ],
    },
    {
      id: 'economic_sustainability',
      universalName: 'Economic Sustainability',
      description: 'Fiscal capacity and burden',
      suggestedKPIs: [
        'tax_base',
        'public_spending_per_capita',
        'dependency_ratio',
      ],
    },
    {
      id: 'social_stability',
      universalName: 'Social Stability',
      description: 'Cohesion and security',
      suggestedKPIs: [
        'crime_rate',
        'youth_exclusion',
        'social_trust_index',
      ],
    },
    {
      id: 'core_systems',
      universalName: 'Core Public Systems',
      description: 'State capacity to deliver',
      suggestedKPIs: [
        'healthcare_access',
        'education_outcomes',
        'justice_system_efficiency',
      ],
    },
    {
      id: 'infrastructure',
      universalName: 'Infrastructure',
      description: 'Physical and digital capacity',
      suggestedKPIs: [
        'housing_availability',
        'energy_security',
        'digital_connectivity',
      ],
    },
    {
      id: 'governance',
      universalName: 'Governance & Risk',
      description: 'System health and steering',
      suggestedKPIs: [
        'regional_inequality',
        'policy_effectiveness',
        'institutional_trust',
      ],
    },
  ],
};

/**
 * ADAPTATION GUIDE
 */
export interface AdaptationGuide {
  step: number;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
  deliverables: string[];
}

export const IMPLEMENTATION_STEPS: AdaptationGuide[] = [
  {
    step: 1,
    title: 'Data Landscape Assessment',
    description: 'Map available official statistics and data sources in target country',
    duration: '2-4 weeks',
    prerequisites: ['Access to national statistics agency', 'List of existing indicators'],
    deliverables: ['Data availability matrix', 'Quality assessment report'],
  },
  {
    step: 2,
    title: 'KPI Localization',
    description: 'Adapt universal KPI definitions to local context and data availability',
    duration: '4-6 weeks',
    prerequisites: ['Data landscape completed', 'Local expert consultation'],
    deliverables: ['Localized KPI definitions', 'Data source mappings'],
  },
  {
    step: 3,
    title: 'Governing Period Mapping',
    description: 'Document historical government compositions and decision authority',
    duration: '2-3 weeks',
    prerequisites: ['Historical election data', 'Government formation records'],
    deliverables: ['Governing period database', 'Responsibility mapping'],
  },
  {
    step: 4,
    title: 'Technical Integration',
    description: 'Connect to data sources and configure analysis engine',
    duration: '6-8 weeks',
    prerequisites: ['API access or data feeds', 'Technical infrastructure'],
    deliverables: ['Working data pipeline', 'Initial dashboard'],
  },
  {
    step: 5,
    title: 'Calibration & Validation',
    description: 'Validate calculations and calibrate thresholds to local context',
    duration: '4-6 weeks',
    prerequisites: ['Historical data available', 'Domain expert review'],
    deliverables: ['Calibrated thresholds', 'Validation report'],
  },
  {
    step: 6,
    title: 'Public Launch Preparation',
    description: 'Translate interface, prepare documentation, stakeholder briefing',
    duration: '4-6 weeks',
    prerequisites: ['Full system operational', 'Legal review complete'],
    deliverables: ['Localized public interface', 'Launch communications'],
  },
];

/**
 * LICENSE AND USAGE TERMS
 */
export const EXPORT_LICENSING = {
  coreLicense: 'Open Source (MIT)',
  dataLicense: 'Country-specific (respects source terms)',
  commercialUse: 'Allowed with attribution',
  modifications: 'Allowed, derivative works must remain open',
  attribution: 'Required - "Based on Swedish National Operating Framework"',
  warranty: 'None - provided as-is',
  support: 'Community-based for open source, paid enterprise support available',
};

/**
 * QUALITY CERTIFICATION
 */
export interface QualityCertification {
  level: 'basic' | 'standard' | 'certified';
  requirements: string[];
  benefits: string[];
}

export const QUALITY_LEVELS: QualityCertification[] = [
  {
    level: 'basic',
    requirements: [
      'Uses core framework methodology',
      'Documents all data sources',
      'Publishes update frequency',
    ],
    benefits: [
      'Can use "Compatible with NOGF" badge',
      'Listed in implementation directory',
    ],
  },
  {
    level: 'standard',
    requirements: [
      'All basic requirements',
      'Independent data quality audit',
      'Minimum 12 months operational history',
      'Public API for data access',
    ],
    benefits: [
      'Can use "NOGF Standard" badge',
      'Included in cross-country comparisons',
      'Access to methodology updates',
    ],
  },
  {
    level: 'certified',
    requirements: [
      'All standard requirements',
      'Third-party methodology audit',
      'Formal data sharing agreement',
      'Governance board oversight',
    ],
    benefits: [
      'Can use "NOGF Certified" badge',
      'Full cross-country analytics integration',
      'Participation in methodology development',
      'Priority support access',
    ],
  },
];

/**
 * Generate country adaptation report
 */
export function generateAdaptationEstimate(
  country: CountryProfile
): {
  estimatedDuration: string;
  estimatedCost: string;
  keyRisks: string[];
  recommendations: string[];
} {
  const baseDuration = country.dataAvailability === 'high' ? 16 : 
                       country.dataAvailability === 'medium' ? 24 : 36;
  
  const risks: string[] = [];
  const recommendations: string[] = [];
  
  if (country.dataAvailability === 'low') {
    risks.push('Limited data availability may require proxy indicators');
    recommendations.push('Prioritize building data infrastructure in parallel');
  }
  
  if (country.governmentType === 'presidential') {
    recommendations.push('Adapt governing period tracking to executive terms');
  }
  
  if (country.localLanguages.length > 1) {
    risks.push('Multi-language requirements increase translation effort');
    recommendations.push('Prioritize dominant official language for initial release');
  }
  
  return {
    estimatedDuration: `${baseDuration}-${baseDuration + 8} weeks`,
    estimatedCost: country.dataAvailability === 'high' ? '€50,000-100,000' :
                   country.dataAvailability === 'medium' ? '€100,000-200,000' : '€200,000-400,000',
    keyRisks: risks,
    recommendations,
  };
}
