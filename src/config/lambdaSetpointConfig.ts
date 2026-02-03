/**
 * LAMBDA 1.0 – GLOBAL REALITY SETPOINT
 * 
 * "Lambda 1.0 for the world"
 * 
 * In a combustion engine:
 * - Lambda = 1.0 → perfect air-fuel ratio → maximum efficiency
 * - Lambda < 1.0 → too rich → inefficiency, soot, wear
 * - Lambda > 1.0 → too lean → heat stress, knock, failure
 * 
 * For society:
 * - Lambda ≈ 1.0 → stable, sustainable, low systemic stress
 * - Lambda < 0.9 → overload / socially "too rich"
 * - Lambda > 1.1 → resource stress / "too lean"
 */

// =============================================================================
// FORMAL DEFINITION (ISO-STYLE)
// =============================================================================

export const LAMBDA_DEFINITION = {
  id: 'LAMBDA_1.0',
  version: '1.0.0',
  name: 'Global Reality Setpoint',
  symbol: 'λ',
  
  formalDefinition: {
    en: `Lambda 1.0 represents the state where aggregated system indicators show maximum long-term human welfare, minimal systemic stress, high stability, and low risk of collapse, within physical, biological, and economic boundaries.`,
    sv: `Lambda 1.0 representerar det tillstånd där aggregerade systemindikatorer visar maximal långsiktig mänsklig välfärd, minimal systemstress, hög stabilitet och låg risk för kollaps, inom fysiska, biologiska och ekonomiska gränser.`,
  },
  
  formula: 'λ = current_system_balance / optimal_system_balance',
  
  interpretation: {
    optimal: { min: 0.95, max: 1.05, label: 'Stable', color: 'emerald' },
    caution_low: { min: 0.85, max: 0.95, label: 'Elevated Stress', color: 'amber' },
    caution_high: { min: 1.05, max: 1.15, label: 'Resource Strain', color: 'amber' },
    critical_low: { min: 0, max: 0.85, label: 'System Overload', color: 'red' },
    critical_high: { min: 1.15, max: 2.0, label: 'Critical Strain', color: 'red' },
  },
  
  whatLambdaIsNot: [
    'A perfect society',
    'Utopia',
    'Justice according to any ideology',
    'Good or bad policy',
    'Left or right politics',
    'A moral judgment',
  ],
  
  whatLambdaIs: [
    'An observable balance state',
    'A systemic sweet spot',
    'A measurable optimum given known constraints',
    'A steering value based on measurement data',
    'Fractal and scalable across all levels',
  ],
} as const;

// =============================================================================
// SENSOR LAYER (RAW DATA CATEGORIES)
// =============================================================================

export interface LambdaSensor {
  id: string;
  name: string;
  category: LambdaSensorCategory;
  weight: number; // System impact weight (not opinion-based)
  direction: 'higher_better' | 'lower_better' | 'optimal_range';
  optimalRange?: { min: number; max: number };
  unit: string;
  description: string;
}

export type LambdaSensorCategory = 
  | 'health'
  | 'economy'
  | 'labor'
  | 'housing'
  | 'energy'
  | 'education'
  | 'safety'
  | 'governance'
  | 'environment'
  | 'demographics';

export const LAMBDA_SENSORS: LambdaSensor[] = [
  // Health
  {
    id: 'life_expectancy',
    name: 'Life Expectancy',
    category: 'health',
    weight: 0.12,
    direction: 'higher_better',
    unit: 'years',
    description: 'Average life expectancy at birth',
  },
  {
    id: 'disease_burden',
    name: 'Disease Burden (DALYs)',
    category: 'health',
    weight: 0.08,
    direction: 'lower_better',
    unit: 'DALYs per 100k',
    description: 'Disability-adjusted life years lost',
  },
  
  // Economy
  {
    id: 'real_wages',
    name: 'Real Wage Growth',
    category: 'economy',
    weight: 0.10,
    direction: 'optimal_range',
    optimalRange: { min: 0.5, max: 4.0 },
    unit: '% annual',
    description: 'Inflation-adjusted wage growth',
  },
  {
    id: 'debt_to_gdp',
    name: 'Public Debt to GDP',
    category: 'economy',
    weight: 0.07,
    direction: 'optimal_range',
    optimalRange: { min: 30, max: 90 },
    unit: '% of GDP',
    description: 'Government debt as share of GDP',
  },
  
  // Housing
  {
    id: 'housing_affordability',
    name: 'Housing Affordability',
    category: 'housing',
    weight: 0.09,
    direction: 'lower_better',
    unit: 'price-to-income ratio',
    description: 'Median home price to median income',
  },
  
  // Labor
  {
    id: 'employment_rate',
    name: 'Employment Rate',
    category: 'labor',
    weight: 0.10,
    direction: 'optimal_range',
    optimalRange: { min: 70, max: 80 },
    unit: '% of working age',
    description: 'Share of working-age population employed',
  },
  {
    id: 'youth_unemployment',
    name: 'Youth Unemployment',
    category: 'labor',
    weight: 0.06,
    direction: 'lower_better',
    unit: '%',
    description: 'Unemployment rate ages 15-24',
  },
  
  // Energy
  {
    id: 'energy_access',
    name: 'Energy Access',
    category: 'energy',
    weight: 0.05,
    direction: 'higher_better',
    unit: '% population',
    description: 'Population with reliable energy access',
  },
  
  // Education
  {
    id: 'education_attainment',
    name: 'Educational Attainment',
    category: 'education',
    weight: 0.08,
    direction: 'higher_better',
    unit: 'years',
    description: 'Average years of schooling',
  },
  
  // Safety
  {
    id: 'violent_crime_rate',
    name: 'Violent Crime Rate',
    category: 'safety',
    weight: 0.07,
    direction: 'lower_better',
    unit: 'per 100k',
    description: 'Violent crimes per 100,000 population',
  },
  
  // Environment
  {
    id: 'ecological_footprint',
    name: 'Ecological Footprint',
    category: 'environment',
    weight: 0.08,
    direction: 'optimal_range',
    optimalRange: { min: 1.0, max: 2.5 },
    unit: 'global hectares per capita',
    description: 'Resource consumption vs biocapacity',
  },
  
  // Demographics
  {
    id: 'fertility_rate',
    name: 'Fertility Rate',
    category: 'demographics',
    weight: 0.05,
    direction: 'optimal_range',
    optimalRange: { min: 1.8, max: 2.3 },
    unit: 'births per woman',
    description: 'Total fertility rate',
  },
  {
    id: 'dependency_ratio',
    name: 'Dependency Ratio',
    category: 'demographics',
    weight: 0.05,
    direction: 'optimal_range',
    optimalRange: { min: 40, max: 60 },
    unit: '%',
    description: 'Non-working to working age ratio',
  },
];

// =============================================================================
// SYSTEM STRESS INDICATORS
// =============================================================================

export interface SystemStressIndicator {
  id: string;
  name: string;
  description: string;
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export const SYSTEM_STRESS_INDICATORS: SystemStressIndicator[] = [
  {
    id: 'tension_buildup',
    name: 'Tension Buildup',
    description: 'Accumulation of unresolved systemic pressures',
    thresholds: { low: 0.2, medium: 0.4, high: 0.6, critical: 0.8 },
  },
  {
    id: 'divergence',
    name: 'Systemic Divergence',
    description: 'Gap between system components (inequality, regional gaps)',
    thresholds: { low: 0.15, medium: 0.3, high: 0.5, critical: 0.7 },
  },
  {
    id: 'inertia',
    name: 'System Inertia',
    description: 'Resistance to necessary adaptation',
    thresholds: { low: 0.25, medium: 0.45, high: 0.65, critical: 0.85 },
  },
  {
    id: 'recovery_capacity',
    name: 'Recovery Capacity',
    description: 'Ability to bounce back from shocks (inverse stress)',
    thresholds: { low: 0.8, medium: 0.6, high: 0.4, critical: 0.2 },
  },
];

// =============================================================================
// LAMBDA LEVELS (FRACTAL SCALABILITY)
// =============================================================================

export type LambdaLevel = 
  | 'global'
  | 'continental'
  | 'national'
  | 'regional'
  | 'municipal'
  | 'sector';

export const LAMBDA_LEVELS: Record<LambdaLevel, { emoji: string; name: string; description: string }> = {
  global: {
    emoji: '🌍',
    name: 'Global Lambda',
    description: 'Worldwide system balance',
  },
  continental: {
    emoji: '🌐',
    name: 'Continental Lambda',
    description: 'Regional bloc balance (EU, ASEAN, etc.)',
  },
  national: {
    emoji: '🇺🇳',
    name: 'National Lambda',
    description: 'Country-level system balance',
  },
  regional: {
    emoji: '🏙',
    name: 'Regional Lambda',
    description: 'State/province level balance',
  },
  municipal: {
    emoji: '🏘',
    name: 'Municipal Lambda',
    description: 'City/town level balance',
  },
  sector: {
    emoji: '🧩',
    name: 'Sector Lambda',
    description: 'Domain-specific balance (labor, energy, health)',
  },
};

// =============================================================================
// WHAT THE SYSTEM SAYS (AND DOESN'T SAY)
// =============================================================================

export const SYSTEM_SAYS = {
  examples: [
    'Lambda for Sweden is 0.93 and falling',
    'Primary stress originates from housing + labor market',
    'Actions in area X have historically reduced stress Y',
    'Data coverage is 78% for this indicator',
    'Uncertainty range: ±0.04',
  ],
  
  neverSays: [
    'Do this',
    'Vote for that',
    'Think this way',
    'This policy is good/bad',
    'You should...',
    'The right answer is...',
  ],
} as const;

// =============================================================================
// VALIDATION & CALCULATION HELPERS
// =============================================================================

export interface LambdaCalculationResult {
  value: number;
  level: LambdaLevel;
  entityId: string;
  entityName: string;
  timestamp: string;
  sensorReadings: Array<{
    sensorId: string;
    rawValue: number;
    normalizedValue: number;
    contribution: number;
    uncertainty: number;
    dataQuality: 'high' | 'medium' | 'low' | 'insufficient';
  }>;
  stressAnalysis: {
    tensionBuildup: number;
    divergence: number;
    inertia: number;
    recoveryCapacity: number;
    overallStress: number;
  };
  interpretation: {
    status: 'optimal' | 'caution_low' | 'caution_high' | 'critical_low' | 'critical_high';
    label: string;
    color: string;
  };
  uncertainty: number;
  dataCoverage: number;
  primaryStressors: string[];
  improvingFactors: string[];
}

/**
 * Interpret a Lambda value according to the defined thresholds
 */
export function interpretLambda(value: number): {
  status: string;
  label: string;
  color: string;
} {
  const { interpretation } = LAMBDA_DEFINITION;
  
  if (value >= interpretation.optimal.min && value <= interpretation.optimal.max) {
    return { status: 'optimal', label: interpretation.optimal.label, color: interpretation.optimal.color };
  }
  if (value >= interpretation.caution_low.min && value < interpretation.caution_low.max) {
    return { status: 'caution_low', label: interpretation.caution_low.label, color: interpretation.caution_low.color };
  }
  if (value > interpretation.caution_high.min && value <= interpretation.caution_high.max) {
    return { status: 'caution_high', label: interpretation.caution_high.label, color: interpretation.caution_high.color };
  }
  if (value < interpretation.critical_low.max) {
    return { status: 'critical_low', label: interpretation.critical_low.label, color: interpretation.critical_low.color };
  }
  return { status: 'critical_high', label: interpretation.critical_high.label, color: interpretation.critical_high.color };
}

/**
 * Format Lambda value for display
 */
export function formatLambda(value: number): string {
  return `λ ${value.toFixed(2)}`;
}

/**
 * Get sensor categories with their aggregate weights
 */
export function getSensorCategoryWeights(): Record<LambdaSensorCategory, number> {
  return LAMBDA_SENSORS.reduce((acc, sensor) => {
    acc[sensor.category] = (acc[sensor.category] || 0) + sensor.weight;
    return acc;
  }, {} as Record<LambdaSensorCategory, number>);
}
