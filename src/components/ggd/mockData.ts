/**
 * Mock data for Guided Global Diagnostics
 */

import type {
  DiagnosticCase,
  SymptomData,
  AxisStatus,
  MeasurementBlock,
  GEDIFaultCode,
  ProbableCause,
  CorrelationData,
  ProjectionData,
  ActionClass,
} from './types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

// =============================================================================
// CREATE NEW CASE
// =============================================================================

export function createDiagnosticCase(
  geoCode: string,
  geoName: string,
  lambdaDeviation: number
): DiagnosticCase {
  return {
    caseId: `GGD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    geoCode,
    geoName,
    geoLevel: geoCode === 'GLOBAL' ? 'global' : 'country',
    timeRangeStart: '2020-01-01',
    timeRangeEnd: '2024-12-31',
    activeGEDICode: null,
    lambdaDeviation,
    userRole: 'analyst',
    dataModelVersion: '2.4.1',
    status: 'in_progress',
    currentStep: 'symptom_definition',
    completedSteps: [],
  };
}

// =============================================================================
// STEP 1: SYMPTOM DATA
// =============================================================================

export function getSymptomData(geoCode: string): SymptomData {
  const deviations: Record<string, SymptomData> = {
    US: {
      currentLambda: 0.82,
      targetLambda: 1.0,
      deviationPercent: -18,
      deviationStart: '2015-Q3',
      trend: 'decreasing',
      trendVelocity: -0.012,
      confidence: 88,
    },
    SE: {
      currentLambda: 1.02,
      targetLambda: 1.0,
      deviationPercent: 2,
      deviationStart: '2022-Q1',
      trend: 'stable',
      trendVelocity: 0.001,
      confidence: 92,
    },
    DE: {
      currentLambda: 0.94,
      targetLambda: 1.0,
      deviationPercent: -6,
      deviationStart: '2019-Q2',
      trend: 'decreasing',
      trendVelocity: -0.008,
      confidence: 89,
    },
    GLOBAL: {
      currentLambda: 0.86,
      targetLambda: 1.0,
      deviationPercent: -14,
      deviationStart: '2018-Q1',
      trend: 'stable',
      trendVelocity: -0.003,
      confidence: 78,
    },
  };
  
  return deviations[geoCode] || deviations['GLOBAL'];
}

// =============================================================================
// STEP 2: AXIS STATUS
// =============================================================================

const AXIS_NAMES: Record<LambdaAxis, { sv: string; en: string }> = {
  ECON: { sv: 'Ekonomi', en: 'Economy' },
  HEALTH: { sv: 'Hälsa', en: 'Health' },
  LABOR: { sv: 'Arbete', en: 'Labor' },
  EDUC: { sv: 'Utbildning', en: 'Education' },
  SOCIAL: { sv: 'Samhälle', en: 'Society' },
  CLIMATE: { sv: 'Miljö', en: 'Climate' },
  GOV: { sv: 'Styrning', en: 'Governance' },
  DEMO: { sv: 'Demografi', en: 'Demographics' },
};

export function getAxisStatus(geoCode: string): AxisStatus[] {
  const axisData: Record<string, AxisStatus[]> = {
    US: [
      { axis: 'HEALTH', name: AXIS_NAMES.HEALTH, status: 'critical', deviation: -14, contribution: 32 },
      { axis: 'SOCIAL', name: AXIS_NAMES.SOCIAL, status: 'critical', deviation: -12, contribution: 28 },
      { axis: 'CLIMATE', name: AXIS_NAMES.CLIMATE, status: 'warning', deviation: -8, contribution: 18 },
      { axis: 'GOV', name: AXIS_NAMES.GOV, status: 'warning', deviation: -6, contribution: 12 },
      { axis: 'ECON', name: AXIS_NAMES.ECON, status: 'normal', deviation: 2, contribution: 5 },
      { axis: 'EDUC', name: AXIS_NAMES.EDUC, status: 'warning', deviation: -4, contribution: 3 },
      { axis: 'LABOR', name: AXIS_NAMES.LABOR, status: 'normal', deviation: 1, contribution: 1 },
      { axis: 'DEMO', name: AXIS_NAMES.DEMO, status: 'normal', deviation: -2, contribution: 1 },
    ],
    SE: [
      { axis: 'DEMO', name: AXIS_NAMES.DEMO, status: 'warning', deviation: -4, contribution: 45 },
      { axis: 'LABOR', name: AXIS_NAMES.LABOR, status: 'normal', deviation: -2, contribution: 20 },
      { axis: 'CLIMATE', name: AXIS_NAMES.CLIMATE, status: 'normal', deviation: 1, contribution: 10 },
      { axis: 'ECON', name: AXIS_NAMES.ECON, status: 'normal', deviation: 2, contribution: 8 },
      { axis: 'HEALTH', name: AXIS_NAMES.HEALTH, status: 'normal', deviation: 3, contribution: 7 },
      { axis: 'GOV', name: AXIS_NAMES.GOV, status: 'normal', deviation: 4, contribution: 5 },
      { axis: 'SOCIAL', name: AXIS_NAMES.SOCIAL, status: 'normal', deviation: 2, contribution: 3 },
      { axis: 'EDUC', name: AXIS_NAMES.EDUC, status: 'normal', deviation: 3, contribution: 2 },
    ],
    GLOBAL: [
      { axis: 'CLIMATE', name: AXIS_NAMES.CLIMATE, status: 'critical', deviation: -16, contribution: 35 },
      { axis: 'SOCIAL', name: AXIS_NAMES.SOCIAL, status: 'critical', deviation: -11, contribution: 25 },
      { axis: 'GOV', name: AXIS_NAMES.GOV, status: 'warning', deviation: -7, contribution: 15 },
      { axis: 'HEALTH', name: AXIS_NAMES.HEALTH, status: 'warning', deviation: -5, contribution: 10 },
      { axis: 'ECON', name: AXIS_NAMES.ECON, status: 'normal', deviation: -2, contribution: 5 },
      { axis: 'EDUC', name: AXIS_NAMES.EDUC, status: 'normal', deviation: -3, contribution: 5 },
      { axis: 'LABOR', name: AXIS_NAMES.LABOR, status: 'normal', deviation: -1, contribution: 3 },
      { axis: 'DEMO', name: AXIS_NAMES.DEMO, status: 'normal', deviation: 2, contribution: 2 },
    ],
  };

  return axisData[geoCode] || axisData['GLOBAL'];
}

// =============================================================================
// STEP 3: MEASUREMENT BLOCKS
// =============================================================================

export function getMeasurementBlocks(geoCode: string, axis: LambdaAxis): MeasurementBlock[] {
  const healthBlocks: MeasurementBlock[] = [
    {
      id: 'life_exp',
      code: 'H-001',
      name: { sv: 'Förväntad livslängd', en: 'Life Expectancy' },
      category: 'Outcomes',
      currentValue: 76.4,
      unit: 'år',
      targetValue: 82.0,
      acceptableRange: [78, 85],
      status: 'critical',
      deviation: -7,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 77 + i * 0.1 - (i > 15 ? i * 0.05 : 0) })),
      confidence: 95,
      source: 'WHO / CDC',
    },
    {
      id: 'health_spend',
      code: 'H-002',
      name: { sv: 'Vårdkostnad/BNP', en: 'Healthcare Spend/GDP' },
      category: 'Input',
      currentValue: 18.3,
      unit: '%',
      targetValue: 10.0,
      acceptableRange: [8, 12],
      status: 'critical',
      deviation: 83,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 13 + i * 0.2 })),
      confidence: 92,
      source: 'OECD',
    },
    {
      id: 'infant_mort',
      code: 'H-003',
      name: { sv: 'Spädbarnsdödlighet', en: 'Infant Mortality' },
      category: 'Outcomes',
      currentValue: 5.4,
      unit: 'per 1000',
      targetValue: 3.0,
      acceptableRange: [2, 4],
      status: 'warning',
      deviation: 80,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 7 - i * 0.08 })),
      confidence: 94,
      source: 'WHO',
    },
    {
      id: 'obesity',
      code: 'H-004',
      name: { sv: 'Fetma (vuxna)', en: 'Obesity (adults)' },
      category: 'Risk Factors',
      currentValue: 42.4,
      unit: '%',
      targetValue: 20.0,
      acceptableRange: [15, 25],
      status: 'critical',
      deviation: 112,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 30 + i * 0.5 })),
      confidence: 90,
      source: 'CDC',
    },
    {
      id: 'mental_health',
      code: 'H-005',
      name: { sv: 'Mental ohälsa', en: 'Mental Health Issues' },
      category: 'Risk Factors',
      currentValue: 21.0,
      unit: '%',
      targetValue: 12.0,
      acceptableRange: [10, 15],
      status: 'critical',
      deviation: 75,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 15 + i * 0.25 })),
      confidence: 85,
      source: 'NIMH',
    },
  ];

  const econBlocks: MeasurementBlock[] = [
    {
      id: 'gdp_cap',
      code: 'E-001',
      name: { sv: 'BNP per capita', en: 'GDP per Capita' },
      category: 'Output',
      currentValue: 76000,
      unit: 'USD',
      targetValue: 65000,
      acceptableRange: [50000, 80000],
      status: 'normal',
      deviation: 17,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 40000 + i * 1500 })),
      confidence: 95,
      source: 'World Bank',
    },
    {
      id: 'productivity',
      code: 'E-002',
      name: { sv: 'Produktivitet', en: 'Productivity' },
      category: 'Efficiency',
      currentValue: 68.5,
      unit: 'USD/h',
      targetValue: 75.0,
      acceptableRange: [60, 80],
      status: 'normal',
      deviation: -9,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 50 + i * 0.8 })),
      confidence: 88,
      source: 'BLS',
    },
    {
      id: 'debt_gdp',
      code: 'E-003',
      name: { sv: 'Statsskuld/BNP', en: 'Debt/GDP' },
      category: 'Risk',
      currentValue: 123,
      unit: '%',
      targetValue: 60,
      acceptableRange: [40, 80],
      status: 'critical',
      deviation: 105,
      historicalData: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, value: 55 + i * 3 })),
      confidence: 95,
      source: 'Treasury',
    },
  ];

  const blocks: Record<LambdaAxis, MeasurementBlock[]> = {
    HEALTH: healthBlocks,
    ECON: econBlocks,
    LABOR: [],
    EDUC: [],
    SOCIAL: [],
    CLIMATE: [],
    GOV: [],
    DEMO: [],
  };

  return blocks[axis] || healthBlocks;
}

// =============================================================================
// STEP 4: GEDI FAULT CODES
// =============================================================================

export function getGEDIFaultCodes(geoCode: string): GEDIFaultCode[] {
  const codes: Record<string, GEDIFaultCode[]> = {
    US: [
      {
        code: 'E-HEALTH-017',
        class: 'economic',
        name: { sv: 'Vårdkostnadsineffektivitet', en: 'Healthcare Cost Inefficiency' },
        description: { sv: 'Systemet spenderar 83% mer än OECD-snitt med sämre utfall', en: 'System spends 83% more than OECD average with worse outcomes' },
        criticality: 'critical',
        duration: 108,
        lambdaImpact: -0.08,
        affectedAxes: ['HEALTH', 'ECON'],
        triggeredAt: '2015-Q3',
        indicators: ['health_spend_gdp', 'life_expectancy', 'infant_mortality'],
      },
      {
        code: 'S-SOC-004',
        class: 'social',
        name: { sv: 'Samhällssammanhållning', en: 'Social Cohesion Deficit' },
        description: { sv: 'Tillitsindex och social kapital under kritisk tröskel', en: 'Trust index and social capital below critical threshold' },
        criticality: 'high',
        duration: 84,
        lambdaImpact: -0.05,
        affectedAxes: ['SOCIAL', 'GOV'],
        triggeredAt: '2017-Q1',
        indicators: ['trust_index', 'polarization', 'social_capital'],
      },
      {
        code: 'C-CLIM-009',
        class: 'climate',
        name: { sv: 'Klimatbana-avvikelse', en: 'Climate Trajectory Deviation' },
        description: { sv: 'Utsläppsbana överskrider Paris-åtaganden', en: 'Emissions trajectory exceeds Paris commitments' },
        criticality: 'high',
        duration: 96,
        lambdaImpact: -0.04,
        affectedAxes: ['CLIMATE'],
        triggeredAt: '2016-Q2',
        indicators: ['co2_per_capita', 'renewable_share', 'emissions_trajectory'],
      },
    ],
    GLOBAL: [
      {
        code: 'G-CLIM-001',
        class: 'climate',
        name: { sv: 'Global klimatavvikelse', en: 'Global Climate Deviation' },
        description: { sv: 'Temperaturökning överskrider 1.5°C-målet', en: 'Temperature rise exceeds 1.5°C target' },
        criticality: 'critical',
        duration: 120,
        lambdaImpact: -0.10,
        affectedAxes: ['CLIMATE'],
        triggeredAt: '2015-Q1',
        indicators: ['global_temp', 'co2_concentration', 'ice_mass'],
      },
    ],
  };

  return codes[geoCode] || codes['GLOBAL'];
}

// =============================================================================
// STEP 5: PROBABLE CAUSES
// =============================================================================

export function getProbableCauses(geoCode: string, axis: LambdaAxis): ProbableCause[] {
  const causes: ProbableCause[] = [
    {
      id: 'market_structure',
      rank: 1,
      name: { sv: 'Marknadsstruktur-ineffektivitet', en: 'Market Structure Inefficiency' },
      description: { sv: 'Fragmenterat system utan prispress eller standardisering', en: 'Fragmented system without price pressure or standardization' },
      probability: 42,
      evidenceStrength: 'strong',
      relatedIndicators: ['admin_costs', 'price_variation', 'market_concentration'],
      mechanismChain: ['Fragmentering', 'Ingen priskonkurrens', 'Kostnadsinflation', 'Sämre utfall'],
      userVerdict: 'pending',
    },
    {
      id: 'demo_mismatch',
      rank: 2,
      name: { sv: 'Demografisk mismatch', en: 'Demographic Mismatch' },
      description: { sv: 'Åldrande befolkning utan motsvarande systemanpassning', en: 'Aging population without corresponding system adaptation' },
      probability: 27,
      evidenceStrength: 'moderate',
      relatedIndicators: ['dependency_ratio', 'chronic_disease_rate', 'workforce_ratio'],
      mechanismChain: ['Åldrande', 'Ökad vårdefterfrågan', 'Kapacitetsbrist', 'Kvalitetsfall'],
      userVerdict: 'pending',
    },
    {
      id: 'regulatory_friction',
      rank: 3,
      name: { sv: 'Regulatorisk friktion', en: 'Regulatory Friction' },
      description: { sv: 'Regelverk förhindrar effektivisering och innovation', en: 'Regulation prevents efficiency and innovation' },
      probability: 18,
      evidenceStrength: 'moderate',
      relatedIndicators: ['regulatory_complexity', 'approval_time', 'compliance_cost'],
      mechanismChain: ['Överreglering', 'Långsam innovation', 'Höga kostnader', 'Suboptimala lösningar'],
      userVerdict: 'pending',
    },
    {
      id: 'external_shock',
      rank: 4,
      name: { sv: 'Extern chock', en: 'External Shock' },
      description: { sv: 'Pandemier och globala händelser har stört systemet', en: 'Pandemics and global events have disrupted the system' },
      probability: 9,
      evidenceStrength: 'weak',
      relatedIndicators: ['pandemic_impact', 'supply_chain_disruption'],
      mechanismChain: ['Extern händelse', 'Systemchock', 'Anpassningssvårigheter'],
      userVerdict: 'pending',
    },
    {
      id: 'behavioral',
      rank: 5,
      name: { sv: 'Beteendefaktorer', en: 'Behavioral Factors' },
      description: { sv: 'Livsstilsval bidrar till systembelastning', en: 'Lifestyle choices contribute to system burden' },
      probability: 4,
      evidenceStrength: 'moderate',
      relatedIndicators: ['obesity_rate', 'smoking_rate', 'exercise_rate'],
      mechanismChain: ['Ohälsosamma val', 'Ökad sjukdomsbörda', 'Systembelastning'],
      userVerdict: 'pending',
    },
  ];

  return causes;
}

// =============================================================================
// STEP 6: CORRELATION DATA
// =============================================================================

export function getCorrelationData(causeId: string): CorrelationData {
  return {
    causeId,
    causeName: 'Marknadsstruktur-ineffektivitet',
    correlations: [
      {
        indicator: 'Administrativa kostnader',
        r2: 0.78,
        lagMonths: 0,
        direction: 'positive',
        significance: 0.001,
        chartData: Array.from({ length: 20 }, (_, i) => ({ x: 2005 + i, y: 15 + i * 0.5 + Math.random() * 2 })),
      },
      {
        indicator: 'Prisspridning',
        r2: 0.65,
        lagMonths: 6,
        direction: 'positive',
        significance: 0.01,
        chartData: Array.from({ length: 20 }, (_, i) => ({ x: 2005 + i, y: 20 + i * 0.8 + Math.random() * 5 })),
      },
      {
        indicator: 'Utfall per dollar',
        r2: 0.82,
        lagMonths: 12,
        direction: 'negative',
        significance: 0.001,
        chartData: Array.from({ length: 20 }, (_, i) => ({ x: 2005 + i, y: 85 - i * 0.4 + Math.random() * 3 })),
      },
    ],
    overallStrength: 0.75,
  };
}

// =============================================================================
// STEP 7: PROJECTION DATA
// =============================================================================

export function getProjectionData(geoCode: string): ProjectionData {
  return {
    projections: [
      // Baseline
      ...Array.from({ length: 11 }, (_, i) => ({
        year: 2024 + i,
        value: 0.82 - i * 0.008,
        confidence: 95 - i * 3,
        scenario: 'baseline' as const,
      })),
      // Optimistic
      ...Array.from({ length: 11 }, (_, i) => ({
        year: 2024 + i,
        value: 0.82 + i * 0.015,
        confidence: 85 - i * 4,
        scenario: 'optimistic' as const,
      })),
      // Pessimistic
      ...Array.from({ length: 11 }, (_, i) => ({
        year: 2024 + i,
        value: 0.82 - i * 0.02,
        confidence: 80 - i * 5,
        scenario: 'pessimistic' as const,
      })),
    ],
    riskZones: [
      { startYear: 2028, endYear: 2032, severity: 'high' },
      { startYear: 2032, endYear: 2034, severity: 'critical' },
    ],
    stabilizingFactors: [
      { factor: 'Teknologisk innovation', impact: 0.02 },
      { factor: 'Demografisk stabilisering', impact: 0.01 },
      { factor: 'Policyreformer', impact: 0.03 },
    ],
    keyAssumptions: [
      'Inga stora externa chocker',
      'Nuvarande policytrender fortsätter',
      'Teknologisk utveckling enligt historisk trend',
      'Ingen betydande migration',
    ],
  };
}

// =============================================================================
// STEP 8: ACTION CLASSES
// =============================================================================

export function getActionClasses(axis: LambdaAxis): ActionClass[] {
  return [
    {
      id: 'competence_investment',
      name: { sv: 'Kompetensinvestering', en: 'Competence Investment' },
      description: { sv: 'Strategiska investeringar i utbildning och kompetens', en: 'Strategic investments in education and skills' },
      category: 'Investment',
      historicalEffectiveness: 72,
      timeToEffect: 36,
      complexity: 'medium',
      examples: [
        { country: 'Finland', year: 1995, outcome: '+0.08 Lambda över 15 år' },
        { country: 'Singapore', year: 1985, outcome: '+0.12 Lambda över 20 år' },
      ],
      relevantAxes: ['EDUC', 'LABOR', 'ECON'],
    },
    {
      id: 'capital_reallocation',
      name: { sv: 'Kapitalomallokering', en: 'Capital Reallocation' },
      description: { sv: 'Omdirigering av resurser till högeffektivitetsområden', en: 'Redirecting resources to high-efficiency areas' },
      category: 'Structural',
      historicalEffectiveness: 65,
      timeToEffect: 24,
      complexity: 'high',
      examples: [
        { country: 'Tyskland', year: 2003, outcome: 'Hartz-reformer: +0.05 Lambda' },
        { country: 'Sverige', year: 1991, outcome: 'Skattereform: +0.03 Lambda' },
      ],
      relevantAxes: ['ECON', 'GOV'],
    },
    {
      id: 'regulatory_simplification',
      name: { sv: 'Regelverksförenkling', en: 'Regulatory Simplification' },
      description: { sv: 'Minskning av onödig byråkrati och friktion', en: 'Reduction of unnecessary bureaucracy and friction' },
      category: 'Governance',
      historicalEffectiveness: 58,
      timeToEffect: 18,
      complexity: 'medium',
      examples: [
        { country: 'Estland', year: 2000, outcome: 'Digital förvaltning: +0.04 Lambda' },
        { country: 'Danmark', year: 2010, outcome: 'Förenkling: +0.02 Lambda' },
      ],
      relevantAxes: ['GOV', 'ECON'],
    },
    {
      id: 'prevention_focus',
      name: { sv: 'Preventionsfokus', en: 'Prevention Focus' },
      description: { sv: 'Omställning från reaktiv till preventiv strategi', en: 'Shift from reactive to preventive strategy' },
      category: 'Healthcare',
      historicalEffectiveness: 68,
      timeToEffect: 48,
      complexity: 'high',
      examples: [
        { country: 'Japan', year: 1980, outcome: 'Preventiv vård: +0.06 Lambda' },
        { country: 'Nederländerna', year: 2005, outcome: 'Folkhälsofokus: +0.03 Lambda' },
      ],
      relevantAxes: ['HEALTH'],
    },
  ];
}

// =============================================================================
// GENERATE REPORT CHECKSUM
// =============================================================================

export function generateChecksum(caseId: string): string {
  const hash = caseId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}
