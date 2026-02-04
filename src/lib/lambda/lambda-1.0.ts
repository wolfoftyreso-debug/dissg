/**
 * LAMBDA 1.0 – Global Optimal Balance Index (GOBI)
 * 
 * Referensvärde för optimal "förbränning" i ett samhällssystem.
 * 
 * Lambda = 1.0 → systemet är i balans
 * Lambda < 1.0 → underpresterande (ineffektivitet, friktion)
 * Lambda > 1.0 → överhettning (ohållbar tillväxt, risk)
 * 
 * Beräknas som GEOMETRISKT MEDEL av 8 axlar.
 * Geometriskt medel straffar extremvärden och förhindrar "kompenserande lögner".
 */

// =============================================================================
// LAMBDA 1.0 AXES (8 CORE DIMENSIONS)
// =============================================================================

export type LambdaAxis = 
  | 'ECON'    // Ekonomi: produktivitet, real tillväxt
  | 'HEALTH'  // Hälsa: förväntad livslängd, friskår
  | 'LABOR'   // Arbete: sysselsättning, matchning
  | 'EDUC'    // Utbildning: kompetens, output
  | 'SOCIAL'  // Samhälle: tillit, brott
  | 'CLIMATE' // Miljö: resursutnyttjande
  | 'GOV'     // Styrning: effektivitet, korruption
  | 'DEMO';   // Demografi: försörjningskvot

export interface AxisDefinition {
  code: LambdaAxis;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  icon: string;
  
  // Component indicators
  indicators: string[];
  
  // Normalization range (0.7 - 1.3)
  optimalValue: number; // 1.0
  minValue: number;     // 0.7
  maxValue: number;     // 1.3
  
  // GEDI mapping
  relatedGEDICodes: string[];
}

export const LAMBDA_AXES: Record<LambdaAxis, AxisDefinition> = {
  ECON: {
    code: 'ECON',
    name: { sv: 'Ekonomi', en: 'Economy' },
    description: { sv: 'Produktivitet, real tillväxt, resursutnyttjande', en: 'Productivity, real growth, resource utilization' },
    icon: '📊',
    indicators: ['gdp_per_capita_ppp', 'productivity_growth', 'tfp', 'investment_rate'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: ['GEDI-001', 'GEDI-002'],
  },
  HEALTH: {
    code: 'HEALTH',
    name: { sv: 'Hälsa', en: 'Health' },
    description: { sv: 'Förväntad livslängd, friskår, vårdeffektivitet', en: 'Life expectancy, healthy years, care efficiency' },
    icon: '🏥',
    indicators: ['life_expectancy', 'healthy_life_years', 'healthcare_efficiency', 'avoidable_mortality'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: ['GEDI-004'],
  },
  LABOR: {
    code: 'LABOR',
    name: { sv: 'Arbete', en: 'Labor' },
    description: { sv: 'Sysselsättning, arbetsmarknadsmatching, löneproduktivitet', en: 'Employment, labor market matching, wage-productivity' },
    icon: '💼',
    indicators: ['employment_rate', 'labor_force_participation', 'job_vacancy_match', 'wage_productivity_ratio'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: [],
  },
  EDUC: {
    code: 'EDUC',
    name: { sv: 'Utbildning', en: 'Education' },
    description: { sv: 'Kompetens, utbildningsutfall, matchning', en: 'Skills, education outcomes, matching' },
    icon: '🎓',
    indicators: ['pisa_score', 'tertiary_attainment', 'education_job_match', 'skill_mismatch_index'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: [],
  },
  SOCIAL: {
    code: 'SOCIAL',
    name: { sv: 'Samhälle', en: 'Society' },
    description: { sv: 'Tillit, trygghet, social sammanhållning', en: 'Trust, safety, social cohesion' },
    icon: '👥',
    indicators: ['social_trust', 'institutional_trust', 'crime_rate_inverse', 'civic_participation'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: ['GEDI-003'],
  },
  CLIMATE: {
    code: 'CLIMATE',
    name: { sv: 'Miljö', en: 'Climate' },
    description: { sv: 'Resursutnyttjande, utsläpp, resiliens', en: 'Resource utilization, emissions, resilience' },
    icon: '🌡️',
    indicators: ['co2_per_gdp', 'renewable_share', 'resource_efficiency', 'environmental_performance'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: ['GEDI-005'],
  },
  GOV: {
    code: 'GOV',
    name: { sv: 'Styrning', en: 'Governance' },
    description: { sv: 'Effektivitet, korruption, regelkvalitet', en: 'Efficiency, corruption, regulatory quality' },
    icon: '🏛️',
    indicators: ['government_effectiveness', 'corruption_control', 'regulatory_quality', 'rule_of_law'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: ['GEDI-006', 'GEDI-007'],
  },
  DEMO: {
    code: 'DEMO',
    name: { sv: 'Demografi', en: 'Demographics' },
    description: { sv: 'Försörjningskvot, åldersstruktur, migration', en: 'Dependency ratio, age structure, migration' },
    icon: '👶',
    indicators: ['dependency_ratio_inverse', 'working_age_share', 'net_migration_balance', 'fertility_replacement'],
    optimalValue: 1.0,
    minValue: 0.7,
    maxValue: 1.3,
    relatedGEDICodes: [],
  },
};

// =============================================================================
// LAMBDA 1.0 INTERPRETATION BANDS
// =============================================================================

export type LambdaInterpretation = 
  | 'CRITICAL_LOW'      // < 0.85
  | 'STRUCTURAL_WEAK'   // 0.85-0.95
  | 'OPTIMAL_BALANCE'   // 0.95-1.05
  | 'OVERHEAT'          // 1.05-1.15
  | 'CRITICAL_HIGH';    // > 1.15

export interface LambdaBand {
  min: number;
  max: number;
  interpretation: LambdaInterpretation;
  label: { sv: string; en: string };
  color: string;
  description: { sv: string; en: string };
  triggersGEDI: boolean;
}

export const LAMBDA_INTERPRETATION_BANDS: LambdaBand[] = [
  {
    min: 0,
    max: 0.85,
    interpretation: 'CRITICAL_LOW',
    label: { sv: 'Systemiskt fel', en: 'Systemic failure' },
    color: '#dc2626', // red-600
    description: { 
      sv: 'Allvarlig obalans med strukturella fel i flera dimensioner.',
      en: 'Serious imbalance with structural failures across dimensions.'
    },
    triggersGEDI: true,
  },
  {
    min: 0.85,
    max: 0.95,
    interpretation: 'STRUCTURAL_WEAK',
    label: { sv: 'Strukturell svaghet', en: 'Structural weakness' },
    color: '#f97316', // orange-500
    description: { 
      sv: 'Systemet underpresterar med identifierbara svagheter.',
      en: 'System underperforming with identifiable weaknesses.'
    },
    triggersGEDI: true,
  },
  {
    min: 0.95,
    max: 1.05,
    interpretation: 'OPTIMAL_BALANCE',
    label: { sv: 'Optimal balans', en: 'Optimal balance' },
    color: '#3b82f6', // blue-500
    description: { 
      sv: 'Systemet opererar inom optimalt intervall.',
      en: 'System operating within optimal range.'
    },
    triggersGEDI: false,
  },
  {
    min: 1.05,
    max: 1.15,
    interpretation: 'OVERHEAT',
    label: { sv: 'Överhettning', en: 'Overheating' },
    color: '#a855f7', // purple-500
    description: { 
      sv: 'Systemet visar tecken på stress och ohållbar tillväxt.',
      en: 'System showing signs of stress and unsustainable growth.'
    },
    triggersGEDI: true,
  },
  {
    min: 1.15,
    max: 2.0,
    interpretation: 'CRITICAL_HIGH',
    label: { sv: 'Instabil tillväxt', en: 'Unstable growth' },
    color: '#be123c', // rose-700
    description: { 
      sv: 'Allvarlig risk för systemkollaps eller korrektion.',
      en: 'Serious risk of system collapse or correction.'
    },
    triggersGEDI: true,
  },
];

// =============================================================================
// AXIS VALUE (Normalized 0.7-1.3)
// =============================================================================

export interface AxisValue {
  axis: LambdaAxis;
  value: number; // 0.7-1.3 range, 1.0 = optimal
  rawScore: number; // Original score before normalization
  confidence: number; // 0-100
  dataCoverage: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  deviation: number; // How far from 1.0
  contributionToLambda: number; // Impact on final Lambda
  rankAmongAxes: number;
  isPrimaryDriver: boolean;
  underlyingIndicators: {
    code: string;
    value: number;
    weight: number;
  }[];
}

// =============================================================================
// LAMBDA 1.0 CALCULATION
// =============================================================================

export interface Lambda1Input {
  geoCode: string;
  geoLevel: 'global' | 'country' | 'region' | 'municipality' | 'sector';
  period: string;
  axisValues: Partial<Record<LambdaAxis, number>>; // Raw axis scores
  historicalData?: { period: string; lambda: number }[];
}

export interface Lambda1Result {
  // Core Lambda value
  lambda: number;
  interpretation: LambdaInterpretation;
  band: LambdaBand;
  
  // Components
  axes: AxisValue[];
  primaryDrivers: LambdaAxis[]; // Top 3 most impactful
  weakestAxes: LambdaAxis[];    // Bottom 3
  
  // Confidence
  confidenceInterval: { lower: number; upper: number };
  dataCoverage: number;
  uncertainty: number;
  
  // Trend
  trend: 'improving' | 'stable' | 'declining';
  lambda1yAgo: number | null;
  lambda5yAgo: number | null;
  changeRate: number | null;
  
  // GEDI Integration
  triggersGEDIMaster: boolean;
  activeGEDICodes: string[];
  suggestedExaminations: string[];
  
  // Metadata
  geoCode: string;
  geoLevel: string;
  period: string;
  calculatedAt: string;
  methodologyVersion: string;
}

// =============================================================================
// GEOMETRIC MEAN CALCULATION (CORE FORMULA)
// =============================================================================

/**
 * Calculate geometric mean of axis values.
 * 
 * Lambda = (ECON × HEALTH × LABOR × EDUC × SOCIAL × CLIMATE × GOV × DEMO)^(1/8)
 * 
 * Why geometric mean?
 * - Penalizes extreme values
 * - Prevents "compensating lies" (high in one area can't mask low in another)
 * - Exactly like engine tuning: rich mixture can't compensate for timing issues
 */
function calculateGeometricMean(values: number[]): number {
  if (values.length === 0) return 1.0;
  
  // Filter out zero or negative values (would break log)
  const validValues = values.filter(v => v > 0);
  if (validValues.length === 0) return 1.0;
  
  // Calculate geometric mean: (a1 × a2 × ... × an)^(1/n)
  const product = validValues.reduce((acc, val) => acc * val, 1);
  const geometricMean = Math.pow(product, 1 / validValues.length);
  
  return roundTo(geometricMean, 4);
}

/**
 * Normalize raw score to 0.7-1.3 range
 * Maps percentile scores (0-100) to lambda axis scale
 */
function normalizeToAxisRange(rawScore: number, min = 0, max = 100): number {
  // Map 0-100 to 0.7-1.3
  // 50 (median) → 1.0
  // 0 → 0.7
  // 100 → 1.3
  const normalized = 0.7 + (rawScore / 100) * 0.6;
  return Math.max(0.7, Math.min(1.3, normalized));
}

/**
 * Get interpretation band for Lambda value
 */
export function getLambdaBand(lambda: number): LambdaBand {
  return LAMBDA_INTERPRETATION_BANDS.find(b => lambda >= b.min && lambda < b.max) 
    || LAMBDA_INTERPRETATION_BANDS[2]; // Default to optimal
}

// =============================================================================
// MAIN CALCULATION FUNCTION
// =============================================================================

export function calculateLambda1(input: Lambda1Input): Lambda1Result {
  const allAxes: LambdaAxis[] = ['ECON', 'HEALTH', 'LABOR', 'EDUC', 'SOCIAL', 'CLIMATE', 'GOV', 'DEMO'];
  
  // Convert input values to axis values
  const axisValues: AxisValue[] = allAxes.map((axis, index) => {
    const rawScore = input.axisValues[axis] ?? 50; // Default to median
    const value = normalizeToAxisRange(rawScore);
    const deviation = value - 1.0;
    
    return {
      axis,
      value,
      rawScore,
      confidence: rawScore !== undefined ? 85 : 50,
      dataCoverage: rawScore !== undefined ? 90 : 60,
      trend: 'stable' as const,
      deviation,
      contributionToLambda: 0, // Will be calculated
      rankAmongAxes: 0, // Will be calculated
      isPrimaryDriver: false,
      underlyingIndicators: LAMBDA_AXES[axis].indicators.map(ind => ({
        code: ind,
        value: 50 + (rawScore - 50) * 0.8 + Math.random() * 10 - 5, // Simulated
        weight: 1 / LAMBDA_AXES[axis].indicators.length,
      })),
    };
  });
  
  // Calculate geometric mean (CORE FORMULA)
  const axisNormalizedValues = axisValues.map(av => av.value);
  const lambda = calculateGeometricMean(axisNormalizedValues);
  
  // Calculate contributions and rank
  const avgValue = axisNormalizedValues.reduce((a, b) => a + b, 0) / axisNormalizedValues.length;
  for (const av of axisValues) {
    av.contributionToLambda = (av.value - avgValue) / avgValue;
  }
  
  // Sort by absolute deviation to find drivers
  const sortedByDeviation = [...axisValues].sort(
    (a, b) => Math.abs(b.deviation) - Math.abs(a.deviation)
  );
  
  sortedByDeviation.forEach((av, i) => {
    av.rankAmongAxes = i + 1;
    av.isPrimaryDriver = i < 3;
  });
  
  // Get interpretation
  const band = getLambdaBand(lambda);
  
  // Identify weak and strong axes
  const sortedByValue = [...axisValues].sort((a, b) => a.value - b.value);
  const weakestAxes = sortedByValue.slice(0, 3).map(av => av.axis);
  const primaryDrivers = sortedByDeviation.slice(0, 3).map(av => av.axis);
  
  // GEDI Integration
  const triggersGEDIMaster = lambda < 0.9 || lambda > 1.1;
  const activeGEDICodes: string[] = [];
  
  for (const av of axisValues) {
    if (av.value < 0.9) {
      activeGEDICodes.push(...LAMBDA_AXES[av.axis].relatedGEDICodes);
    }
  }
  
  // Suggested examinations based on weak axes
  const suggestedExaminations = weakestAxes.flatMap(axis => [
    `Undersök ${LAMBDA_AXES[axis].name.sv}-indikatorer i detalj`,
    `Jämför ${LAMBDA_AXES[axis].name.sv} med peer-grupp`,
  ]);
  
  // Historical comparison
  const lambda1yAgo = input.historicalData?.find(h => {
    const year = parseInt(input.period.slice(0, 4)) - 1;
    return h.period.startsWith(year.toString());
  })?.lambda ?? null;
  
  const lambda5yAgo = input.historicalData?.find(h => {
    const year = parseInt(input.period.slice(0, 4)) - 5;
    return h.period.startsWith(year.toString());
  })?.lambda ?? null;
  
  // Calculate trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  let changeRate: number | null = null;
  
  if (lambda1yAgo !== null) {
    changeRate = lambda - lambda1yAgo;
    if (changeRate > 0.02) trend = 'improving';
    else if (changeRate < -0.02) trend = 'declining';
  }
  
  // Confidence interval (wider with less data)
  const avgCoverage = axisValues.reduce((sum, av) => sum + av.dataCoverage, 0) / axisValues.length;
  const uncertainty = 0.1 * (1 - avgCoverage / 100);
  
  return {
    lambda,
    interpretation: band.interpretation,
    band,
    
    axes: axisValues,
    primaryDrivers,
    weakestAxes,
    
    confidenceInterval: {
      lower: roundTo(lambda - uncertainty, 4),
      upper: roundTo(lambda + uncertainty, 4),
    },
    dataCoverage: avgCoverage,
    uncertainty,
    
    trend,
    lambda1yAgo,
    lambda5yAgo,
    changeRate,
    
    triggersGEDIMaster,
    activeGEDICodes: [...new Set(activeGEDICodes)],
    suggestedExaminations,
    
    geoCode: input.geoCode,
    geoLevel: input.geoLevel,
    period: input.period,
    calculatedAt: new Date().toISOString(),
    methodologyVersion: '1.0.0',
  };
}

// =============================================================================
// SIMULATION (PRO FEATURE)
// =============================================================================

export interface SimulationScenario {
  name: string;
  axisChanges: Partial<Record<LambdaAxis, number>>; // Delta changes
}

export function simulateLambdaChange(
  currentResult: Lambda1Result,
  scenario: SimulationScenario
): Lambda1Result {
  // Create new input with modified values
  const newAxisValues: Partial<Record<LambdaAxis, number>> = {};
  
  for (const av of currentResult.axes) {
    const delta = scenario.axisChanges[av.axis] ?? 0;
    // Convert back to raw score, apply delta, ensure bounds
    const newRaw = Math.max(0, Math.min(100, av.rawScore + delta));
    newAxisValues[av.axis] = newRaw;
  }
  
  return calculateLambda1({
    geoCode: currentResult.geoCode,
    geoLevel: currentResult.geoLevel as Lambda1Input['geoLevel'],
    period: currentResult.period,
    axisValues: newAxisValues,
  });
}

export function calculateRequiredChanges(
  currentResult: Lambda1Result,
  targetLambda: number = 1.0
): Partial<Record<LambdaAxis, number>> {
  // Calculate what changes needed to reach target
  const currentLambda = currentResult.lambda;
  const gap = targetLambda - currentLambda;
  
  // Distribute required change across weakest axes
  const requiredChanges: Partial<Record<LambdaAxis, number>> = {};
  
  // Focus on weakest axes
  const axesByPotential = [...currentResult.axes]
    .filter(av => av.value < 1.0)
    .sort((a, b) => a.value - b.value);
  
  const totalPotential = axesByPotential.reduce((sum, av) => sum + (1.0 - av.value), 0);
  
  for (const av of axesByPotential) {
    const potential = 1.0 - av.value;
    const share = totalPotential > 0 ? potential / totalPotential : 1 / axesByPotential.length;
    // Convert gap to raw score change (rough approximation)
    const requiredChange = (gap * share) * 100 * 1.5;
    requiredChanges[av.axis] = roundTo(requiredChange, 1);
  }
  
  return requiredChanges;
}

// =============================================================================
// UTILITIES
// =============================================================================

function roundTo(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

// =============================================================================
// MOCK DATA FOR DEMO
// =============================================================================

export const MOCK_COUNTRY_DATA: Record<string, Partial<Record<LambdaAxis, number>>> = {
  'SE': { ECON: 72, HEALTH: 85, LABOR: 68, EDUC: 75, SOCIAL: 78, CLIMATE: 82, GOV: 88, DEMO: 55 },
  'NO': { ECON: 78, HEALTH: 88, LABOR: 72, EDUC: 78, SOCIAL: 82, CLIMATE: 75, GOV: 90, DEMO: 58 },
  'US': { ECON: 82, HEALTH: 58, LABOR: 75, EDUC: 68, SOCIAL: 45, CLIMATE: 42, GOV: 72, DEMO: 65 },
  'DE': { ECON: 75, HEALTH: 80, LABOR: 78, EDUC: 72, SOCIAL: 62, CLIMATE: 68, GOV: 85, DEMO: 48 },
  'JP': { ECON: 68, HEALTH: 92, LABOR: 72, EDUC: 82, SOCIAL: 75, CLIMATE: 58, GOV: 78, DEMO: 38 },
  'GLOBAL': { ECON: 50, HEALTH: 55, LABOR: 52, EDUC: 48, SOCIAL: 45, CLIMATE: 40, GOV: 55, DEMO: 50 },
};

export function getMockLambdaResult(geoCode: string): Lambda1Result {
  const data = MOCK_COUNTRY_DATA[geoCode] || MOCK_COUNTRY_DATA['GLOBAL'];
  return calculateLambda1({
    geoCode,
    geoLevel: geoCode === 'GLOBAL' ? 'global' : 'country',
    period: '2024',
    axisValues: data,
    historicalData: [
      { period: '2023', lambda: 0.98 },
      { period: '2019', lambda: 0.95 },
    ],
  });
}
