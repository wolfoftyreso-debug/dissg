/**
 * GEDI Assessment Engine
 * 
 * Evaluates regulatory-level diagnostic codes.
 * Determines PASS/FAIL status and generates guided analysis.
 */

import { 
  type GEDIAssessment, 
  type GEDICodeResult, 
  type GEDIStatus,
  type ProbableCause 
} from './types';
import { GEDI_CODES, getGEDICode } from './codes';

// =============================================================================
// MOCK DATA SOURCE (Would be replaced with real data)
// =============================================================================

interface MockIndicatorData {
  gini?: number;
  co2_emissions?: number;
  paris_target?: number;
  cpi?: number;
  democracy_index?: number;
  health_spending_growth?: number;
  health_outcome_growth?: number;
  resource_consumption?: number;
  regeneration_rate?: number;
  dataCoverage: number;
}

function getMockData(geoScope: string): MockIndicatorData {
  // Simulated data - in production would fetch from real sources
  const dataByScope: Record<string, MockIndicatorData> = {
    'SE': {
      gini: 0.28,
      co2_emissions: 4.5,
      paris_target: 5.0,
      cpi: 85,
      democracy_index: 9.4,
      health_spending_growth: 3.2,
      health_outcome_growth: 0.5,
      resource_consumption: 1.8,
      regeneration_rate: 1.0,
      dataCoverage: 92
    },
    'GLOBAL': {
      gini: 0.42,
      co2_emissions: 38.0,
      paris_target: 30.0,
      cpi: 43,
      democracy_index: 5.3,
      health_spending_growth: 4.1,
      health_outcome_growth: -0.2,
      resource_consumption: 1.75,
      regeneration_rate: 1.0,
      dataCoverage: 78
    },
    'US': {
      gini: 0.41,
      co2_emissions: 14.0,
      paris_target: 12.0,
      cpi: 69,
      democracy_index: 7.9,
      health_spending_growth: 5.2,
      health_outcome_growth: -0.3,
      resource_consumption: 2.1,
      regeneration_rate: 1.0,
      dataCoverage: 95
    }
  };
  
  return dataByScope[geoScope] || dataByScope['GLOBAL'];
}

// =============================================================================
// PROBABLE CAUSES DATABASE
// =============================================================================

const PROBABLE_CAUSES_MAP: Record<string, ProbableCause[]> = {
  'GEDI-001': [
    {
      rank: 1,
      causeId: 'admin_overhead',
      title: { sv: 'Administrativ overhead', en: 'Administrative overhead' },
      probability: 42,
      correlationStrength: 0.78,
      historicalPrecedent: true,
      affectedIndicators: ['admin_cost_ratio', 'process_time'],
      suggestedExamination: ['Granska administrationsandel', 'Jämför med effektiva system']
    },
    {
      rank: 2,
      causeId: 'misaligned_incentives',
      title: { sv: 'Felriktade incitament', en: 'Misaligned incentives' },
      probability: 31,
      correlationStrength: 0.65,
      historicalPrecedent: true,
      affectedIndicators: ['outcome_per_dollar', 'incentive_structure'],
      suggestedExamination: ['Analysera incitamentsstruktur', 'Jämför med resultatbaserade system']
    },
    {
      rank: 3,
      causeId: 'structural_inefficiency',
      title: { sv: 'Strukturell ineffektivitet', en: 'Structural inefficiency' },
      probability: 17,
      correlationStrength: 0.52,
      historicalPrecedent: true,
      affectedIndicators: ['capital_utilization', 'capacity_usage'],
      suggestedExamination: ['Kartlägg resursflöden', 'Identifiera flaskhalsar']
    }
  ],
  'GEDI-003': [
    {
      rank: 1,
      causeId: 'capital_concentration',
      title: { sv: 'Kapitalkoncentration', en: 'Capital concentration' },
      probability: 45,
      correlationStrength: 0.82,
      historicalPrecedent: true,
      affectedIndicators: ['wealth_top1pct', 'capital_share'],
      suggestedExamination: ['Visa förmögenhetsfördelning', 'Analysera ägande']
    },
    {
      rank: 2,
      causeId: 'wage_stagnation',
      title: { sv: 'Lönestagnation', en: 'Wage stagnation' },
      probability: 33,
      correlationStrength: 0.71,
      historicalPrecedent: true,
      affectedIndicators: ['real_wage_growth', 'productivity_gap'],
      suggestedExamination: ['Jämför löner med produktivitet', 'Visa reallöneutveckling']
    }
  ],
  'GEDI-004': [
    {
      rank: 1,
      causeId: 'admin_cost_growth',
      title: { sv: 'Ökande administrationskostnader', en: 'Rising administrative costs' },
      probability: 48,
      correlationStrength: 0.85,
      historicalPrecedent: true,
      affectedIndicators: ['admin_share', 'non_clinical_spending'],
      suggestedExamination: ['Bryt ner utgiftsökning per kategori']
    },
    {
      rank: 2,
      causeId: 'treatment_inflation',
      title: { sv: 'Behandlingsinflation', en: 'Treatment inflation' },
      probability: 28,
      correlationStrength: 0.62,
      historicalPrecedent: true,
      affectedIndicators: ['treatment_per_capita', 'intervention_rate'],
      suggestedExamination: ['Jämför behandlingsfrekvens med utfall']
    }
  ],
  'GEDI-005': [
    {
      rank: 1,
      causeId: 'transport_emissions',
      title: { sv: 'Transportsektorns utsläpp', en: 'Transport sector emissions' },
      probability: 38,
      correlationStrength: 0.76,
      historicalPrecedent: true,
      affectedIndicators: ['vehicle_emissions', 'transport_share'],
      suggestedExamination: ['Analysera transportmix', 'Jämför elektrifieringsgrad']
    },
    {
      rank: 2,
      causeId: 'industry_emissions',
      title: { sv: 'Industriutsläpp', en: 'Industrial emissions' },
      probability: 32,
      correlationStrength: 0.69,
      historicalPrecedent: true,
      affectedIndicators: ['industrial_co2', 'energy_intensity'],
      suggestedExamination: ['Identifiera huvudsektorer', 'Jämför med bästa praxis']
    }
  ]
};

// =============================================================================
// ASSESSMENT FUNCTIONS
// =============================================================================

function evaluateGEDICode(
  code: string, 
  data: MockIndicatorData
): GEDICodeResult {
  const definition = getGEDICode(code);
  if (!definition) {
    return {
      code,
      status: 'INSUFFICIENT_DATA',
      currentValue: null,
      toleranceRange: null,
      deviation: null,
      deviationDirection: null,
      probableCauses: [],
      guidedAnalysisComplete: false,
      lastAssessed: new Date().toISOString()
    };
  }

  // Check data coverage
  if (data.dataCoverage < definition.requiredDataCoverage) {
    return {
      code,
      status: 'INSUFFICIENT_DATA',
      currentValue: null,
      toleranceRange: null,
      deviation: null,
      deviationDirection: null,
      probableCauses: [],
      guidedAnalysisComplete: false,
      lastAssessed: new Date().toISOString()
    };
  }

  // Evaluate based on code
  let status: GEDIStatus = 'PASS';
  let currentValue: number | null = null;
  let toleranceRange: { min: number; max: number } | null = null;
  let deviation: number | null = null;
  let deviationDirection: 'above' | 'below' | 'within' | null = null;

  switch (code) {
    case 'GEDI-003': // Inequality
      currentValue = data.gini ?? null;
      toleranceRange = { min: 0, max: 0.40 };
      if (currentValue !== null) {
        if (currentValue > 0.40) {
          status = 'FAIL';
          deviation = currentValue - 0.40;
          deviationDirection = 'above';
        } else {
          deviationDirection = 'within';
        }
      }
      break;

    case 'GEDI-004': // Health
      if (data.health_spending_growth !== undefined && data.health_outcome_growth !== undefined) {
        currentValue = data.health_outcome_growth;
        if (data.health_spending_growth > 0 && data.health_outcome_growth <= 0) {
          status = 'FAIL';
          deviation = Math.abs(data.health_outcome_growth);
          deviationDirection = 'below';
        } else {
          deviationDirection = 'within';
        }
      }
      break;

    case 'GEDI-005': // Climate
      if (data.co2_emissions !== undefined && data.paris_target !== undefined) {
        currentValue = data.co2_emissions;
        toleranceRange = { min: 0, max: data.paris_target };
        if (data.co2_emissions > data.paris_target) {
          status = 'FAIL';
          deviation = data.co2_emissions - data.paris_target;
          deviationDirection = 'above';
        } else {
          deviationDirection = 'within';
        }
      }
      break;

    case 'GEDI-007': // Corruption
      currentValue = data.cpi ?? null;
      toleranceRange = { min: 50, max: 100 };
      if (currentValue !== null) {
        if (currentValue < 50) {
          status = 'FAIL';
          deviation = 50 - currentValue;
          deviationDirection = 'below';
        } else {
          deviationDirection = 'within';
        }
      }
      break;

    case 'GEDI-002': // Sustainability
      if (data.resource_consumption !== undefined && data.regeneration_rate !== undefined) {
        currentValue = data.resource_consumption;
        toleranceRange = { min: 0, max: data.regeneration_rate };
        if (data.resource_consumption > data.regeneration_rate) {
          status = 'FAIL';
          deviation = data.resource_consumption - data.regeneration_rate;
          deviationDirection = 'above';
        } else {
          deviationDirection = 'within';
        }
      }
      break;

    default:
      status = 'PENDING';
  }

  return {
    code,
    status,
    currentValue,
    toleranceRange,
    deviation,
    deviationDirection,
    probableCauses: status === 'FAIL' ? (PROBABLE_CAUSES_MAP[code] || []) : [],
    guidedAnalysisComplete: false,
    lastAssessed: new Date().toISOString()
  };
}

// =============================================================================
// MAIN ASSESSMENT FUNCTION
// =============================================================================

export function runGEDIAssessment(geoScope: string): GEDIAssessment {
  const data = getMockData(geoScope);
  const timestamp = new Date().toISOString();
  
  const codeResults: GEDICodeResult[] = GEDI_CODES.map(code => 
    evaluateGEDICode(code.code, data)
  );

  // Determine overall status
  const hasFailures = codeResults.some(r => r.status === 'FAIL');
  const hasInsufficientData = codeResults.some(r => r.status === 'INSUFFICIENT_DATA');
  const allPassed = codeResults.every(r => r.status === 'PASS');

  let overallStatus: GEDIStatus = 'PASS';
  if (hasFailures) overallStatus = 'FAIL';
  else if (hasInsufficientData && !allPassed) overallStatus = 'PENDING';

  // Generate certification hash if passed
  const certificationHash = overallStatus === 'PASS'
    ? `GEDI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    : null;

  return {
    assessmentId: `ASSESS-${Date.now()}`,
    timestamp,
    geoScope,
    period: {
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    overallStatus,
    codeResults,
    dataQualityScore: data.dataCoverage,
    certificationHash
  };
}

export function getGEDIAssessmentSummary(assessment: GEDIAssessment): {
  passCount: number;
  failCount: number;
  pendingCount: number;
  insufficientDataCount: number;
} {
  return {
    passCount: assessment.codeResults.filter(r => r.status === 'PASS').length,
    failCount: assessment.codeResults.filter(r => r.status === 'FAIL').length,
    pendingCount: assessment.codeResults.filter(r => r.status === 'PENDING').length,
    insufficientDataCount: assessment.codeResults.filter(r => r.status === 'INSUFFICIENT_DATA').length
  };
}
