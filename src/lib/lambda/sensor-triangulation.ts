/**
 * SENSOR TRIANGULATION ENGINE
 * 
 * Cross-validation between multiple data sources.
 * No single data point is trusted - only convergence.
 * 
 * Modeled after automotive multi-sensor fusion:
 * MAF vs Lambda vs EGT = must agree within tolerance
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SensorReading {
  sensor_id: string;
  kpi_code: string;
  source_code: string;
  value: number;
  unit: string;
  timestamp: string;
  confidence: number;
  methodology: string;
}

export interface TriangulationGroup {
  group_id: string;
  name_sv: string;
  name_en: string;
  sensors: string[];  // KPI codes that should agree
  tolerance: number;  // Max acceptable deviation (%)
  weight_distribution: Record<string, number>;  // Sensor weights
}

export interface TriangulationResult {
  group_id: string;
  status: 'confirmed' | 'partial' | 'divergent' | 'insufficient';
  consensus_value: number | null;
  confidence: number;
  deviation: number;
  individual_readings: SensorReading[];
  divergent_sensors: string[];
  timestamp: string;
}

export interface ValidationReport {
  timestamp: string;
  total_groups: number;
  confirmed_groups: number;
  partial_groups: number;
  divergent_groups: number;
  insufficient_groups: number;
  overall_system_confidence: number;
  results: TriangulationResult[];
  warnings: string[];
}

// =============================================================================
// STANDARD TRIANGULATION GROUPS
// =============================================================================

export const TRIANGULATION_GROUPS: TriangulationGroup[] = [
  {
    group_id: 'TRI-SHADOW-ECO',
    name_sv: 'Skuggekonomi-validering',
    name_en: 'Shadow Economy Validation',
    sensors: ['CASH_RATIO', 'TAX_GAP', 'INFORMAL_EMPLOYMENT', 'UNREPORTED_INCOME'],
    tolerance: 15,
    weight_distribution: {
      'CASH_RATIO': 0.3,
      'TAX_GAP': 0.3,
      'INFORMAL_EMPLOYMENT': 0.25,
      'UNREPORTED_INCOME': 0.15,
    },
  },
  {
    group_id: 'TRI-HEALTH-MENTAL',
    name_sv: 'Psykisk hälsa-validering',
    name_en: 'Mental Health Validation',
    sensors: ['DEPRESSION_RATE', 'ANXIETY_RATE', 'ANTIDEPRESSANT_USE', 'SICK_LEAVE_MENTAL'],
    tolerance: 20,
    weight_distribution: {
      'DEPRESSION_RATE': 0.3,
      'ANXIETY_RATE': 0.25,
      'ANTIDEPRESSANT_USE': 0.25,
      'SICK_LEAVE_MENTAL': 0.2,
    },
  },
  {
    group_id: 'TRI-SUBSTANCE',
    name_sv: 'Substansanvändning-validering',
    name_en: 'Substance Use Validation',
    sensors: ['DRUG_SEIZURES', 'DRUG_MORTALITY', 'DRUG_PRICE_INDEX', 'TREATMENT_ADMISSIONS'],
    tolerance: 25,
    weight_distribution: {
      'DRUG_SEIZURES': 0.2,
      'DRUG_MORTALITY': 0.3,
      'DRUG_PRICE_INDEX': 0.25,
      'TREATMENT_ADMISSIONS': 0.25,
    },
  },
  {
    group_id: 'TRI-LABOR-STRESS',
    name_sv: 'Arbetsmarknadsstress-validering',
    name_en: 'Labour Market Stress Validation',
    sensors: ['UNEMPLOYMENT', 'UNDEREMPLOYMENT', 'GIG_ECONOMY_SHARE', 'JOB_SECURITY_INDEX'],
    tolerance: 15,
    weight_distribution: {
      'UNEMPLOYMENT': 0.35,
      'UNDEREMPLOYMENT': 0.25,
      'GIG_ECONOMY_SHARE': 0.2,
      'JOB_SECURITY_INDEX': 0.2,
    },
  },
  {
    group_id: 'TRI-HOUSING',
    name_sv: 'Bostadsmarknad-validering',
    name_en: 'Housing Market Validation',
    sensors: ['PRICE_TO_INCOME', 'RENT_BURDEN', 'HOMELESSNESS_RATE', 'HOUSING_WAIT_TIME'],
    tolerance: 20,
    weight_distribution: {
      'PRICE_TO_INCOME': 0.3,
      'RENT_BURDEN': 0.25,
      'HOMELESSNESS_RATE': 0.25,
      'HOUSING_WAIT_TIME': 0.2,
    },
  },
  {
    group_id: 'TRI-SOCIAL-COHESION',
    name_sv: 'Social sammanhållning-validering',
    name_en: 'Social Cohesion Validation',
    sensors: ['TRUST_INDEX', 'VOTER_TURNOUT', 'VOLUNTEER_RATE', 'COMMUNITY_PARTICIPATION'],
    tolerance: 15,
    weight_distribution: {
      'TRUST_INDEX': 0.35,
      'VOTER_TURNOUT': 0.25,
      'VOLUNTEER_RATE': 0.2,
      'COMMUNITY_PARTICIPATION': 0.2,
    },
  },
  {
    group_id: 'TRI-ENERGY-STRESS',
    name_sv: 'Energistress-validering',
    name_en: 'Energy Stress Validation',
    sensors: ['ENERGY_COST_SHARE', 'FUEL_POVERTY', 'GRID_RELIABILITY', 'ENERGY_INTENSITY'],
    tolerance: 15,
    weight_distribution: {
      'ENERGY_COST_SHARE': 0.3,
      'FUEL_POVERTY': 0.25,
      'GRID_RELIABILITY': 0.25,
      'ENERGY_INTENSITY': 0.2,
    },
  },
  {
    group_id: 'TRI-SECURITY',
    name_sv: 'Säkerhet-validering',
    name_en: 'Security Validation',
    sensors: ['CRIME_RATE', 'FEAR_OF_CRIME', 'POLICE_TRUST', 'CONVICTION_RATE'],
    tolerance: 20,
    weight_distribution: {
      'CRIME_RATE': 0.3,
      'FEAR_OF_CRIME': 0.25,
      'POLICE_TRUST': 0.25,
      'CONVICTION_RATE': 0.2,
    },
  },
];

// =============================================================================
// TRIANGULATION FUNCTIONS
// =============================================================================

/**
 * Perform triangulation for a single group
 */
export function triangulateGroup(
  group: TriangulationGroup,
  readings: SensorReading[]
): TriangulationResult {
  const groupReadings = readings.filter(r => group.sensors.includes(r.kpi_code));
  
  // Insufficient data
  if (groupReadings.length < 2) {
    return {
      group_id: group.group_id,
      status: 'insufficient',
      consensus_value: null,
      confidence: 0,
      deviation: 0,
      individual_readings: groupReadings,
      divergent_sensors: [],
      timestamp: new Date().toISOString(),
    };
  }
  
  // Normalize values to percentiles for comparison
  const normalizedValues = groupReadings.map(r => ({
    sensor: r.kpi_code,
    normalized: r.value, // Would be normalized against baseline
    weight: group.weight_distribution[r.kpi_code] || 1 / groupReadings.length,
  }));
  
  // Calculate weighted consensus
  const totalWeight = normalizedValues.reduce((sum, v) => sum + v.weight, 0);
  const consensusValue = normalizedValues.reduce(
    (sum, v) => sum + v.normalized * v.weight,
    0
  ) / totalWeight;
  
  // Calculate deviations from consensus
  const deviations = normalizedValues.map(v => ({
    sensor: v.sensor,
    deviation: Math.abs(v.normalized - consensusValue) / consensusValue * 100,
  }));
  
  const maxDeviation = Math.max(...deviations.map(d => d.deviation));
  const divergentSensors = deviations
    .filter(d => d.deviation > group.tolerance)
    .map(d => d.sensor);
  
  // Determine status
  let status: TriangulationResult['status'];
  if (divergentSensors.length === 0) {
    status = 'confirmed';
  } else if (divergentSensors.length < groupReadings.length / 2) {
    status = 'partial';
  } else {
    status = 'divergent';
  }
  
  // Calculate confidence
  const baseConfidence = groupReadings.length / group.sensors.length;
  const deviationPenalty = maxDeviation / 100;
  const confidence = Math.max(0, Math.min(1, baseConfidence - deviationPenalty * 0.5));
  
  return {
    group_id: group.group_id,
    status,
    consensus_value: consensusValue,
    confidence,
    deviation: maxDeviation,
    individual_readings: groupReadings,
    divergent_sensors: divergentSensors,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run full validation across all triangulation groups
 */
export function runFullValidation(readings: SensorReading[]): ValidationReport {
  const results = TRIANGULATION_GROUPS.map(group => triangulateGroup(group, readings));
  
  const confirmed = results.filter(r => r.status === 'confirmed').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const divergent = results.filter(r => r.status === 'divergent').length;
  const insufficient = results.filter(r => r.status === 'insufficient').length;
  
  // Calculate overall system confidence
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
  
  // Generate warnings
  const warnings: string[] = [];
  
  if (divergent > 0) {
    warnings.push(`${divergent} sensor groups show significant divergence`);
  }
  
  if (insufficient > results.length * 0.3) {
    warnings.push('More than 30% of sensor groups have insufficient data');
  }
  
  results
    .filter(r => r.status === 'divergent')
    .forEach(r => {
      const group = TRIANGULATION_GROUPS.find(g => g.group_id === r.group_id);
      if (group) {
        warnings.push(`${group.name_en}: Sensors diverge by ${r.deviation.toFixed(1)}%`);
      }
    });
  
  return {
    timestamp: new Date().toISOString(),
    total_groups: results.length,
    confirmed_groups: confirmed,
    partial_groups: partial,
    divergent_groups: divergent,
    insufficient_groups: insufficient,
    overall_system_confidence: avgConfidence,
    results,
    warnings,
  };
}

/**
 * Get triangulation status color
 */
export function getTriangulationColor(status: TriangulationResult['status']): string {
  switch (status) {
    case 'confirmed': return '#3b82f6';   // Blue
    case 'partial': return '#f59e0b';     // Amber
    case 'divergent': return '#dc2626';   // Red
    case 'insufficient': return '#6b7280'; // Gray
    default: return '#6b7280';
  }
}

/**
 * Get triangulation status label
 */
export function getTriangulationLabel(
  status: TriangulationResult['status'],
  language: 'sv' | 'en'
): string {
  const labels: Record<TriangulationResult['status'], { sv: string; en: string }> = {
    'confirmed': { sv: 'Bekräftad', en: 'Confirmed' },
    'partial': { sv: 'Delvis', en: 'Partial' },
    'divergent': { sv: 'Divergerande', en: 'Divergent' },
    'insufficient': { sv: 'Otillräcklig', en: 'Insufficient' },
  };
  return labels[status][language];
}
