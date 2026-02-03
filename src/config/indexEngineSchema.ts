/**
 * BLOCK Q — INDEX ENGINE SCHEMA
 * 
 * Global Master Index + 20 Thematic Sub-Indexes.
 * Each index = product.
 */

// =============================================================================
// INDEX STRUCTURE
// =============================================================================

export interface IndexDefinition {
  id: string;
  code: string;
  name: string;
  name_local?: Record<string, string>;
  
  description: string;
  short_description: string;
  
  type: 'master' | 'thematic' | 'composite';
  
  pillars: IndexPillar[];
  
  methodology: {
    aggregation: 'weighted_average' | 'geometric_mean' | 'min_max_normalized';
    normalization: 'min_max' | 'z_score' | 'percentile';
    missing_data_handling: 'exclude' | 'impute_mean' | 'impute_regression';
    update_frequency: 'annual' | 'quarterly' | 'monthly';
  };
  
  coverage: {
    countries: number;
    years_available: { start: number; end: number };
    last_updated: string;
  };
  
  interpretation: {
    scale: { min: number; max: number };
    direction: 'higher_is_better' | 'higher_is_worse';
    benchmark_tiers: { label: string; min: number; max: number; color: string }[];
  };
  
  documentation: {
    full_methodology_url?: string;
    academic_references?: string[];
    comparable_indexes?: string[];
  };
  
  metadata: {
    version: string;
    created_at: string;
    last_calculated: string;
  };
}

export interface IndexPillar {
  id: string;
  name: string;
  weight: number;                       // 0-1, all pillars must sum to 1
  description: string;
  
  indicators: IndexIndicator[];
}

export interface IndexIndicator {
  kpi_id: string;                       // Reference to KPI master
  weight: number;                       // Weight within pillar
  transformation?: 'log' | 'sqrt' | 'none';
  invert?: boolean;                     // If higher_is_worse, invert for index
}

// =============================================================================
// GLOBAL MASTER INDEX
// =============================================================================

export const GLOBAL_MASTER_INDEX: IndexDefinition = {
  id: 'gmi',
  code: 'GMI',
  name: 'Global Master Index',
  
  description: 'Comprehensive measure of national development across five core dimensions: prosperity, stability, sustainability, capability, and resilience.',
  short_description: 'Overall national development score',
  
  type: 'master',
  
  pillars: [
    {
      id: 'gmi.prosperity',
      name: 'Prosperity',
      weight: 0.20,
      description: 'Economic output, income levels, and material wellbeing',
      indicators: [
        { kpi_id: 'economy.gdp_per_capita_ppp', weight: 0.4 },
        { kpi_id: 'economy.median_income', weight: 0.3 },
        { kpi_id: 'economy.poverty_rate', weight: 0.2, invert: true },
        { kpi_id: 'economy.gini_coefficient', weight: 0.1, invert: true },
      ],
    },
    {
      id: 'gmi.stability',
      name: 'Stability',
      weight: 0.20,
      description: 'Political, economic, and social stability',
      indicators: [
        { kpi_id: 'governance.political_stability', weight: 0.3 },
        { kpi_id: 'economy.inflation_volatility', weight: 0.2, invert: true },
        { kpi_id: 'crime.homicide_rate', weight: 0.2, invert: true },
        { kpi_id: 'governance.rule_of_law', weight: 0.3 },
      ],
    },
    {
      id: 'gmi.sustainability',
      name: 'Sustainability',
      weight: 0.20,
      description: 'Environmental and fiscal sustainability',
      indicators: [
        { kpi_id: 'environment.co2_emissions_per_capita', weight: 0.3, invert: true },
        { kpi_id: 'environment.renewable_energy_share', weight: 0.2 },
        { kpi_id: 'economy.debt_to_gdp', weight: 0.2, invert: true },
        { kpi_id: 'demographics.dependency_ratio', weight: 0.15, invert: true },
        { kpi_id: 'environment.air_quality_pm25', weight: 0.15, invert: true },
      ],
    },
    {
      id: 'gmi.capability',
      name: 'Capability',
      weight: 0.20,
      description: 'Human capital and institutional capacity',
      indicators: [
        { kpi_id: 'education.tertiary_enrollment', weight: 0.25 },
        { kpi_id: 'health.life_expectancy_at_birth', weight: 0.25 },
        { kpi_id: 'digital.internet_penetration', weight: 0.2 },
        { kpi_id: 'governance.government_effectiveness', weight: 0.3 },
      ],
    },
    {
      id: 'gmi.resilience',
      name: 'Resilience',
      weight: 0.20,
      description: 'Ability to withstand and recover from shocks',
      indicators: [
        { kpi_id: 'economy.foreign_reserves_months', weight: 0.25 },
        { kpi_id: 'infrastructure.healthcare_capacity', weight: 0.25 },
        { kpi_id: 'digital.digital_readiness', weight: 0.2 },
        { kpi_id: 'economy.export_diversification', weight: 0.15 },
        { kpi_id: 'energy.energy_independence', weight: 0.15 },
      ],
    },
  ],
  
  methodology: {
    aggregation: 'weighted_average',
    normalization: 'min_max',
    missing_data_handling: 'exclude',
    update_frequency: 'annual',
  },
  
  coverage: {
    countries: 195,
    years_available: { start: 2000, end: 2024 },
    last_updated: '2024-01-15',
  },
  
  interpretation: {
    scale: { min: 0, max: 100 },
    direction: 'higher_is_better',
    benchmark_tiers: [
      { label: 'Very High', min: 80, max: 100, color: 'hsl(142, 76%, 36%)' },
      { label: 'High', min: 60, max: 80, color: 'hsl(142, 76%, 50%)' },
      { label: 'Medium', min: 40, max: 60, color: 'hsl(45, 93%, 47%)' },
      { label: 'Low', min: 20, max: 40, color: 'hsl(25, 95%, 53%)' },
      { label: 'Very Low', min: 0, max: 20, color: 'hsl(0, 84%, 60%)' },
    ],
  },
  
  documentation: {
    comparable_indexes: ['HDI', 'SDG Index', 'Legatum Prosperity Index'],
  },
  
  metadata: {
    version: '1.0.0',
    created_at: '2024-01-01',
    last_calculated: '2024-01-15',
  },
};

// =============================================================================
// THEMATIC SUB-INDEXES
// =============================================================================

export const SUB_INDEX_DEFINITIONS: Partial<IndexDefinition>[] = [
  {
    id: 'idx.health',
    code: 'HI',
    name: 'Health Index',
    description: 'Comprehensive measure of population health outcomes and healthcare system performance',
    type: 'thematic',
    pillars: [
      {
        id: 'idx.health.outcomes',
        name: 'Health Outcomes',
        weight: 0.5,
        description: 'Population health status',
        indicators: [
          { kpi_id: 'health.life_expectancy_at_birth', weight: 0.3 },
          { kpi_id: 'health.infant_mortality_rate', weight: 0.2, invert: true },
          { kpi_id: 'health.maternal_mortality_ratio', weight: 0.2, invert: true },
          { kpi_id: 'health.healthy_life_expectancy', weight: 0.3 },
        ],
      },
      {
        id: 'idx.health.system',
        name: 'Healthcare System',
        weight: 0.5,
        description: 'Healthcare capacity and access',
        indicators: [
          { kpi_id: 'health.physicians_per_1000', weight: 0.25 },
          { kpi_id: 'health.hospital_beds_per_1000', weight: 0.25 },
          { kpi_id: 'health.health_expenditure_per_capita', weight: 0.25 },
          { kpi_id: 'health.universal_health_coverage', weight: 0.25 },
        ],
      },
    ],
  },
  {
    id: 'idx.workforce',
    code: 'WI',
    name: 'Workforce Index',
    description: 'Labor market health and employment quality',
    type: 'thematic',
    pillars: [
      {
        id: 'idx.workforce.employment',
        name: 'Employment',
        weight: 0.5,
        description: 'Employment levels and quality',
        indicators: [
          { kpi_id: 'workforce.employment_rate', weight: 0.3 },
          { kpi_id: 'workforce.unemployment_rate', weight: 0.3, invert: true },
          { kpi_id: 'workforce.youth_unemployment', weight: 0.2, invert: true },
          { kpi_id: 'workforce.long_term_unemployment', weight: 0.2, invert: true },
        ],
      },
      {
        id: 'idx.workforce.quality',
        name: 'Job Quality',
        weight: 0.5,
        description: 'Working conditions and wages',
        indicators: [
          { kpi_id: 'workforce.median_wage', weight: 0.4 },
          { kpi_id: 'workforce.wage_growth', weight: 0.3 },
          { kpi_id: 'workforce.part_time_involuntary', weight: 0.15, invert: true },
          { kpi_id: 'workforce.gender_wage_gap', weight: 0.15, invert: true },
        ],
      },
    ],
  },
  {
    id: 'idx.education',
    code: 'EI',
    name: 'Education Index',
    description: 'Educational attainment and quality',
    type: 'thematic',
  },
  {
    id: 'idx.innovation',
    code: 'II',
    name: 'Innovation Index',
    description: 'Research, development, and innovation capacity',
    type: 'thematic',
  },
  {
    id: 'idx.housing_stress',
    code: 'HSI',
    name: 'Housing Stress Index',
    description: 'Housing affordability and quality challenges',
    type: 'thematic',
  },
  {
    id: 'idx.energy_security',
    code: 'ESI',
    name: 'Energy Security Index',
    description: 'Energy independence and resilience',
    type: 'thematic',
  },
  {
    id: 'idx.institutional_trust',
    code: 'ITI',
    name: 'Institutional Trust Index',
    description: 'Public trust in institutions and governance quality',
    type: 'thematic',
  },
  {
    id: 'idx.digital_readiness',
    code: 'DRI',
    name: 'Digital Readiness Index',
    description: 'Digital infrastructure and adoption',
    type: 'thematic',
  },
  {
    id: 'idx.migration_pressure',
    code: 'MPI',
    name: 'Migration Pressure Index',
    description: 'Net migration dynamics and integration',
    type: 'thematic',
  },
  {
    id: 'idx.youth_outlook',
    code: 'YOI',
    name: 'Youth Outlook Index',
    description: 'Prospects and opportunities for young people',
    type: 'thematic',
  },
  {
    id: 'idx.aging',
    code: 'AI',
    name: 'Aging Index',
    description: 'Population aging dynamics and elder care',
    type: 'thematic',
  },
  {
    id: 'idx.urban_stress',
    code: 'USI',
    name: 'Urban Stress Index',
    description: 'Urban livability and infrastructure pressure',
    type: 'thematic',
  },
  {
    id: 'idx.climate_vulnerability',
    code: 'CVI',
    name: 'Climate Vulnerability Index',
    description: 'Exposure and sensitivity to climate risks',
    type: 'thematic',
  },
  {
    id: 'idx.economic_resilience',
    code: 'ERI',
    name: 'Economic Resilience Index',
    description: 'Ability to withstand economic shocks',
    type: 'thematic',
  },
  {
    id: 'idx.social_mobility',
    code: 'SMI',
    name: 'Social Mobility Index',
    description: 'Intergenerational economic mobility',
    type: 'thematic',
  },
  {
    id: 'idx.gender_equality',
    code: 'GEI',
    name: 'Gender Equality Index',
    description: 'Gender gaps across economic and social dimensions',
    type: 'thematic',
  },
  {
    id: 'idx.child_wellbeing',
    code: 'CWI',
    name: 'Child Wellbeing Index',
    description: 'Health, education, and safety of children',
    type: 'thematic',
  },
  {
    id: 'idx.infrastructure_quality',
    code: 'IQI',
    name: 'Infrastructure Quality Index',
    description: 'Physical infrastructure condition and investment',
    type: 'thematic',
  },
  {
    id: 'idx.financial_stability',
    code: 'FSI',
    name: 'Financial Stability Index',
    description: 'Banking sector health and financial system resilience',
    type: 'thematic',
  },
  {
    id: 'idx.productivity',
    code: 'PI',
    name: 'Productivity Index',
    description: 'Economic output per worker and efficiency',
    type: 'thematic',
  },
];

// =============================================================================
// INDEX CALCULATION
// =============================================================================

export interface IndexCalculationResult {
  index_id: string;
  country_code: string;
  year: number;
  
  overall_score: number;
  
  pillar_scores: {
    pillar_id: string;
    score: number;
    weight: number;
    weighted_contribution: number;
  }[];
  
  indicator_scores: {
    kpi_id: string;
    raw_value: number | null;
    normalized_value: number | null;
    weight: number;
    source: string;
  }[];
  
  metadata: {
    calculated_at: string;
    data_coverage: number;              // % of indicators with data
    confidence: number;
    missing_indicators: string[];
  };
}

export function validateIndexDefinition(index: IndexDefinition): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check pillar weights sum to 1
  const pillarWeightSum = index.pillars.reduce((sum, p) => sum + p.weight, 0);
  if (Math.abs(pillarWeightSum - 1) > 0.001) {
    errors.push(`Pillar weights sum to ${pillarWeightSum}, must equal 1`);
  }
  
  // Check each pillar's indicator weights sum to 1
  for (const pillar of index.pillars) {
    const indicatorWeightSum = pillar.indicators.reduce((sum, i) => sum + i.weight, 0);
    if (Math.abs(indicatorWeightSum - 1) > 0.001) {
      errors.push(`Pillar "${pillar.name}" indicator weights sum to ${indicatorWeightSum}, must equal 1`);
    }
  }
  
  // Check minimum indicators
  const totalIndicators = index.pillars.reduce((sum, p) => sum + p.indicators.length, 0);
  if (totalIndicators < 10) {
    errors.push(`Index has only ${totalIndicators} indicators, minimum 10 required`);
  }
  
  return { valid: errors.length === 0, errors };
}

// =============================================================================
// INDEX REGISTRY
// =============================================================================

export const INDEX_REGISTRY = {
  master: GLOBAL_MASTER_INDEX,
  thematic: SUB_INDEX_DEFINITIONS,
  
  getAll(): (IndexDefinition | Partial<IndexDefinition>)[] {
    return [this.master, ...this.thematic];
  },
  
  getById(id: string): IndexDefinition | Partial<IndexDefinition> | undefined {
    if (id === 'gmi') return this.master;
    return this.thematic.find(i => i.id === id);
  },
  
  getCount(): { master: number; thematic: number; total: number } {
    return {
      master: 1,
      thematic: this.thematic.length,
      total: 1 + this.thematic.length,
    };
  },
};
