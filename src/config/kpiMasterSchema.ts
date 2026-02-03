/**
 * BLOCK M — GLOBAL KPI MASTER SCHEMA
 * 
 * Schema definition for 1000+ KPIs across all domains.
 * Each KPI must have complete metadata for semantic clarity.
 */

// =============================================================================
// KPI SCHEMA
// =============================================================================

export type KpiDirection = 'higher_is_better' | 'higher_is_worse' | 'neutral';

export type GeoLevel = 
  | 'global'
  | 'continental'
  | 'national'
  | 'regional_adm1'
  | 'local_adm2'
  | 'municipal'
  | 'district';

export type UpdateFrequency = 
  | 'realtime'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'irregular';

export type DemographicDimension =
  | 'age_group'
  | 'sex'
  | 'education_level'
  | 'income_quintile'
  | 'urban_rural'
  | 'migration_status'
  | 'household_type'
  | 'employment_status'
  | 'disability_status'
  | 'ethnicity';

export interface KpiDefinition {
  id: string;                           // e.g., "health.life_expectancy"
  code: string;                         // Short code, e.g., "LE"
  name: string;                         // Human readable
  name_local?: Record<string, string>;  // Translations
  
  domain: string;                       // Primary domain
  subdomain?: string;                   // Optional subdomain
  
  definition: string;                   // Max 2 sentences
  definition_extended?: string;         // Full methodology
  
  unit: string;                         // e.g., "years", "per 100,000", "%"
  unit_symbol?: string;                 // e.g., "yr", "%"
  
  direction: KpiDirection;
  
  preferred_sources: string[];          // Source IDs in priority order
  
  geo_levels_supported: GeoLevel[];
  demographic_dimensions: DemographicDimension[];
  
  update_frequency: UpdateFrequency;
  typical_lag_days: number;
  
  confidence_rules: {
    minimum_sources: number;
    minimum_coverage_percent: number;
    maximum_age_days: number;
  };
  
  normalization?: {
    type: 'per_capita' | 'per_area' | 'per_gdp' | 'indexed' | 'standardized' | 'none';
    base_year?: number;
    base_value?: number;
  };
  
  comparability: {
    cross_country: boolean;
    cross_time: boolean;
    known_breaks: { year: number; description: string }[];
  };
  
  related_kpis: string[];               // IDs of related KPIs
  
  tags: string[];
  
  metadata: {
    created_at: string;
    created_by: string;
    version: number;
    deprecated: boolean;
    deprecated_by?: string;
  };
}

// =============================================================================
// DOMAIN STRUCTURE
// =============================================================================

export interface KpiDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  
  subdomains: {
    id: string;
    name: string;
    kpi_count: number;
  }[];
  
  target_kpi_count: number;
  current_kpi_count: number;
}

export const KPI_DOMAINS: KpiDomain[] = [
  {
    id: 'health',
    name: 'Health',
    description: 'Physical and mental health outcomes, healthcare systems',
    icon: 'heart',
    color: 'hsl(0, 70%, 50%)',
    subdomains: [
      { id: 'mortality', name: 'Mortality & Life Expectancy', kpi_count: 0 },
      { id: 'morbidity', name: 'Disease & Morbidity', kpi_count: 0 },
      { id: 'healthcare', name: 'Healthcare System', kpi_count: 0 },
      { id: 'mental', name: 'Mental Health', kpi_count: 0 },
      { id: 'maternal', name: 'Maternal & Child Health', kpi_count: 0 },
      { id: 'nutrition', name: 'Nutrition', kpi_count: 0 },
    ],
    target_kpi_count: 200,
    current_kpi_count: 0,
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'Economic output, trade, finance, monetary indicators',
    icon: 'trending-up',
    color: 'hsl(120, 70%, 40%)',
    subdomains: [
      { id: 'output', name: 'Output & Growth', kpi_count: 0 },
      { id: 'trade', name: 'Trade & Balance', kpi_count: 0 },
      { id: 'prices', name: 'Prices & Inflation', kpi_count: 0 },
      { id: 'finance', name: 'Finance & Banking', kpi_count: 0 },
      { id: 'fiscal', name: 'Fiscal Policy', kpi_count: 0 },
      { id: 'monetary', name: 'Monetary Policy', kpi_count: 0 },
    ],
    target_kpi_count: 200,
    current_kpi_count: 0,
  },
  {
    id: 'workforce',
    name: 'Workforce & Productivity',
    description: 'Labor market, employment, wages, productivity',
    icon: 'users',
    color: 'hsl(200, 70%, 50%)',
    subdomains: [
      { id: 'employment', name: 'Employment & Unemployment', kpi_count: 0 },
      { id: 'wages', name: 'Wages & Compensation', kpi_count: 0 },
      { id: 'productivity', name: 'Productivity', kpi_count: 0 },
      { id: 'labor_force', name: 'Labor Force', kpi_count: 0 },
      { id: 'working_conditions', name: 'Working Conditions', kpi_count: 0 },
    ],
    target_kpi_count: 150,
    current_kpi_count: 0,
  },
  {
    id: 'education',
    name: 'Education & Skills',
    description: 'Education attainment, quality, access, skills',
    icon: 'book-open',
    color: 'hsl(280, 70%, 50%)',
    subdomains: [
      { id: 'attainment', name: 'Educational Attainment', kpi_count: 0 },
      { id: 'quality', name: 'Education Quality', kpi_count: 0 },
      { id: 'access', name: 'Access & Enrollment', kpi_count: 0 },
      { id: 'skills', name: 'Skills & Competencies', kpi_count: 0 },
      { id: 'spending', name: 'Education Spending', kpi_count: 0 },
    ],
    target_kpi_count: 100,
    current_kpi_count: 0,
  },
  {
    id: 'demographics',
    name: 'Demographics & Migration',
    description: 'Population structure, growth, migration patterns',
    icon: 'users-2',
    color: 'hsl(40, 70%, 50%)',
    subdomains: [
      { id: 'population', name: 'Population Structure', kpi_count: 0 },
      { id: 'fertility', name: 'Fertility & Birth', kpi_count: 0 },
      { id: 'migration', name: 'Migration', kpi_count: 0 },
      { id: 'aging', name: 'Aging', kpi_count: 0 },
      { id: 'urbanization', name: 'Urbanization', kpi_count: 0 },
    ],
    target_kpi_count: 100,
    current_kpi_count: 0,
  },
  {
    id: 'crime',
    name: 'Crime & Safety',
    description: 'Crime rates, public safety, justice system',
    icon: 'shield',
    color: 'hsl(0, 0%, 40%)',
    subdomains: [
      { id: 'violent', name: 'Violent Crime', kpi_count: 0 },
      { id: 'property', name: 'Property Crime', kpi_count: 0 },
      { id: 'justice', name: 'Justice System', kpi_count: 0 },
      { id: 'perception', name: 'Safety Perception', kpi_count: 0 },
    ],
    target_kpi_count: 100,
    current_kpi_count: 0,
  },
  {
    id: 'housing',
    name: 'Housing & Urbanization',
    description: 'Housing affordability, conditions, urban development',
    icon: 'home',
    color: 'hsl(30, 70%, 50%)',
    subdomains: [
      { id: 'affordability', name: 'Housing Affordability', kpi_count: 0 },
      { id: 'conditions', name: 'Housing Conditions', kpi_count: 0 },
      { id: 'construction', name: 'Construction', kpi_count: 0 },
      { id: 'homelessness', name: 'Homelessness', kpi_count: 0 },
    ],
    target_kpi_count: 80,
    current_kpi_count: 0,
  },
  {
    id: 'energy',
    name: 'Energy & Resources',
    description: 'Energy production, consumption, security',
    icon: 'zap',
    color: 'hsl(60, 70%, 50%)',
    subdomains: [
      { id: 'production', name: 'Energy Production', kpi_count: 0 },
      { id: 'consumption', name: 'Energy Consumption', kpi_count: 0 },
      { id: 'renewables', name: 'Renewables', kpi_count: 0 },
      { id: 'security', name: 'Energy Security', kpi_count: 0 },
      { id: 'resources', name: 'Natural Resources', kpi_count: 0 },
    ],
    target_kpi_count: 80,
    current_kpi_count: 0,
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Transport',
    description: 'Physical infrastructure, transport networks',
    icon: 'truck',
    color: 'hsl(220, 70%, 50%)',
    subdomains: [
      { id: 'roads', name: 'Roads & Highways', kpi_count: 0 },
      { id: 'rail', name: 'Rail', kpi_count: 0 },
      { id: 'ports', name: 'Ports & Shipping', kpi_count: 0 },
      { id: 'aviation', name: 'Aviation', kpi_count: 0 },
      { id: 'utilities', name: 'Utilities', kpi_count: 0 },
    ],
    target_kpi_count: 80,
    current_kpi_count: 0,
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    description: 'Environmental quality, emissions, climate indicators',
    icon: 'leaf',
    color: 'hsl(140, 70%, 40%)',
    subdomains: [
      { id: 'emissions', name: 'Emissions', kpi_count: 0 },
      { id: 'air_quality', name: 'Air Quality', kpi_count: 0 },
      { id: 'water', name: 'Water', kpi_count: 0 },
      { id: 'biodiversity', name: 'Biodiversity', kpi_count: 0 },
      { id: 'climate', name: 'Climate', kpi_count: 0 },
    ],
    target_kpi_count: 80,
    current_kpi_count: 0,
  },
  {
    id: 'digital',
    name: 'Digitalization & Connectivity',
    description: 'Digital infrastructure, adoption, skills',
    icon: 'wifi',
    color: 'hsl(260, 70%, 50%)',
    subdomains: [
      { id: 'infrastructure', name: 'Digital Infrastructure', kpi_count: 0 },
      { id: 'adoption', name: 'Technology Adoption', kpi_count: 0 },
      { id: 'skills', name: 'Digital Skills', kpi_count: 0 },
      { id: 'ecommerce', name: 'E-Commerce', kpi_count: 0 },
    ],
    target_kpi_count: 50,
    current_kpi_count: 0,
  },
  {
    id: 'governance',
    name: 'Governance & Institutions',
    description: 'Institutional quality, governance, rule of law',
    icon: 'landmark',
    color: 'hsl(180, 70%, 40%)',
    subdomains: [
      { id: 'corruption', name: 'Corruption', kpi_count: 0 },
      { id: 'rule_of_law', name: 'Rule of Law', kpi_count: 0 },
      { id: 'effectiveness', name: 'Government Effectiveness', kpi_count: 0 },
      { id: 'democracy', name: 'Democratic Quality', kpi_count: 0 },
    ],
    target_kpi_count: 50,
    current_kpi_count: 0,
  },
];

// =============================================================================
// EXAMPLE KPIS (STARTER SET)
// =============================================================================

export const EXAMPLE_KPIS: Partial<KpiDefinition>[] = [
  // Health
  {
    id: 'health.life_expectancy_at_birth',
    code: 'LE',
    name: 'Life Expectancy at Birth',
    domain: 'health',
    subdomain: 'mortality',
    definition: 'Average number of years a newborn is expected to live if current mortality rates continue.',
    unit: 'years',
    direction: 'higher_is_better',
    preferred_sources: ['WHO', 'EUROSTAT', 'OECD'],
    geo_levels_supported: ['global', 'national', 'regional_adm1'],
    demographic_dimensions: ['sex', 'urban_rural'],
    update_frequency: 'annual',
  },
  {
    id: 'health.infant_mortality_rate',
    code: 'IMR',
    name: 'Infant Mortality Rate',
    domain: 'health',
    subdomain: 'maternal',
    definition: 'Number of deaths of infants under one year of age per 1,000 live births.',
    unit: 'per 1,000 live births',
    direction: 'higher_is_worse',
    preferred_sources: ['WHO', 'UNICEF'],
    geo_levels_supported: ['global', 'national'],
    demographic_dimensions: ['sex'],
    update_frequency: 'annual',
  },
  
  // Economy
  {
    id: 'economy.gdp_per_capita_ppp',
    code: 'GDPPC',
    name: 'GDP per Capita (PPP)',
    domain: 'economy',
    subdomain: 'output',
    definition: 'Gross domestic product divided by population, adjusted for purchasing power parity.',
    unit: 'international dollars',
    direction: 'higher_is_better',
    preferred_sources: ['WORLD_BANK', 'IMF'],
    geo_levels_supported: ['global', 'national'],
    demographic_dimensions: [],
    update_frequency: 'annual',
  },
  {
    id: 'economy.unemployment_rate',
    code: 'UNEMP',
    name: 'Unemployment Rate',
    domain: 'economy',
    subdomain: 'output',
    definition: 'Percentage of the labor force that is without work but available and seeking employment.',
    unit: '%',
    direction: 'higher_is_worse',
    preferred_sources: ['ILO', 'EUROSTAT', 'BLS'],
    geo_levels_supported: ['global', 'national', 'regional_adm1'],
    demographic_dimensions: ['age_group', 'sex', 'education_level'],
    update_frequency: 'monthly',
  },
  
  // Environment
  {
    id: 'environment.co2_emissions_per_capita',
    code: 'CO2PC',
    name: 'CO2 Emissions per Capita',
    domain: 'environment',
    subdomain: 'emissions',
    definition: 'Total carbon dioxide emissions from fossil fuel combustion divided by population.',
    unit: 'tonnes per capita',
    direction: 'higher_is_worse',
    preferred_sources: ['IEA', 'EDGAR'],
    geo_levels_supported: ['global', 'national'],
    demographic_dimensions: [],
    update_frequency: 'annual',
  },
];

// =============================================================================
// VALIDATION
// =============================================================================

export function validateKpi(kpi: Partial<KpiDefinition>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!kpi.id) errors.push('Missing id');
  if (!kpi.name) errors.push('Missing name');
  if (!kpi.definition) errors.push('Missing definition');
  if (kpi.definition && kpi.definition.split('.').length > 3) {
    errors.push('Definition exceeds 2 sentences');
  }
  if (!kpi.unit) errors.push('Missing unit');
  if (!kpi.direction) errors.push('Missing direction');
  if (!kpi.preferred_sources || kpi.preferred_sources.length === 0) {
    errors.push('Missing preferred_sources');
  }
  if (!kpi.geo_levels_supported || kpi.geo_levels_supported.length === 0) {
    errors.push('Missing geo_levels_supported');
  }
  if (!kpi.update_frequency) errors.push('Missing update_frequency');
  
  return { valid: errors.length === 0, errors };
}

export function getKpiCompleteness(kpi: KpiDefinition): number {
  const requiredFields = [
    'id', 'code', 'name', 'domain', 'definition', 'unit', 'direction',
    'preferred_sources', 'geo_levels_supported', 'update_frequency',
  ];
  
  const optionalFields = [
    'subdomain', 'definition_extended', 'demographic_dimensions',
    'normalization', 'comparability', 'related_kpis', 'tags',
  ];
  
  let filled = 0;
  const total = requiredFields.length + optionalFields.length;
  
  for (const field of requiredFields) {
    if ((kpi as any)[field]) filled++;
  }
  
  for (const field of optionalFields) {
    if ((kpi as any)[field]) filled += 0.5; // Optional fields count half
  }
  
  return Math.round((filled / total) * 100);
}
