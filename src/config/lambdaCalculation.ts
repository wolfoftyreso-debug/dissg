/**
 * LAMBDA 1.0 – EXACT CALCULATION SPECIFICATION
 * 
 * "Lambda is not a goal. It is the RESULT of balanced parameters."
 * 
 * Based on combustion physics: λ = actual air-fuel ratio / stoichiometric ratio
 * Translated to societal systems: λ = observed system function / optimal system function
 */

// =============================================================================
// CORE FORMULA
// =============================================================================

/**
 * Global Lambda Formula:
 * 
 * λ = S_observed / S_optimal
 * 
 * Where:
 * S_observed = Σ(wi × Ii_normalized) for all indicators
 * S_optimal = theoretical maximum under current constraints
 * 
 * Result interpretation:
 * λ = 1.0 → System in balance (optimal combustion)
 * λ < 1.0 → "Rich mixture" - inefficiency, waste, underutilization
 * λ > 1.0 → "Lean mixture" - overstress, resource strain, burnout
 */

export interface LambdaParameter {
  code: string;
  name: { sv: string; en: string };
  engineAnalog: string;
  indicators: string[];
  weight: number;
  description: { sv: string; en: string };
}

// =============================================================================
// THE FIVE PARAMETERS (Engine Analogy)
// =============================================================================

export const LAMBDA_PARAMETERS: LambdaParameter[] = [
  {
    code: 'AIR_MASS',
    name: { sv: 'Luftmassa', en: 'Air Mass' },
    engineAnalog: 'Human capacity / labor input',
    indicators: [
      'education_attainment',
      'health_life_expectancy',
      'labor_force_participation',
      'skills_match_index',
      'cognitive_capacity_proxy',
    ],
    weight: 0.25,
    description: {
      sv: 'Mänsklig kapacitet: utbildning, hälsa, arbetskraft, kompetensmatchning',
      en: 'Human capacity: education, health, labor force, skills matching',
    },
  },
  {
    code: 'FUEL',
    name: { sv: 'Bränsle', en: 'Fuel' },
    engineAnalog: 'Resources / capital input',
    indicators: [
      'energy_consumption_per_capita',
      'capital_formation_gdp_ratio',
      'natural_resource_rents',
      'investment_rate',
      'credit_availability',
    ],
    weight: 0.20,
    description: {
      sv: 'Resurser: energi, kapital, råvaror, naturresurser',
      en: 'Resources: energy, capital, raw materials, natural resources',
    },
  },
  {
    code: 'TEMPERATURE',
    name: { sv: 'Temperatur', en: 'Temperature' },
    engineAnalog: 'System tempo / change rate',
    indicators: [
      'gdp_growth_rate',
      'reform_velocity_index',
      'demographic_change_rate',
      'technology_adoption_speed',
      'urbanization_rate',
    ],
    weight: 0.20,
    description: {
      sv: 'Tempo & stress: tillväxttakt, reformhastighet, demografisk förändring',
      en: 'Tempo & stress: growth rate, reform speed, demographic change',
    },
  },
  {
    code: 'PRESSURE',
    name: { sv: 'Tryck', en: 'Pressure' },
    engineAnalog: 'System load / stress',
    indicators: [
      'debt_to_gdp_ratio',
      'population_density',
      'infrastructure_utilization',
      'housing_affordability_index',
      'healthcare_system_load',
    ],
    weight: 0.20,
    description: {
      sv: 'Belastning: skuldsättning, befolkningstäthet, infrastrukturutnyttjande',
      en: 'Load: debt levels, population density, infrastructure utilization',
    },
  },
  {
    code: 'IGNITION_TIMING',
    name: { sv: 'Tändtidpunkt', en: 'Ignition Timing' },
    engineAnalog: 'Decision timing / policy response',
    indicators: [
      'policy_response_lag',
      'reform_implementation_delay',
      'crisis_response_time',
      'regulatory_adaptation_speed',
      'investment_decision_timing',
    ],
    weight: 0.15,
    description: {
      sv: 'Beslut: politiska reformer, investeringar, regleringar, krishantering',
      en: 'Decisions: policy reforms, investments, regulations, crisis management',
    },
  },
];

// =============================================================================
// CALCULATION METHODOLOGY
// =============================================================================

export interface LambdaCalculation {
  scope: {
    level: 'global' | 'continental' | 'national' | 'regional' | 'local';
    code: string;
    name: string;
  };
  period: {
    start: string;
    end: string;
    type: 'annual' | 'quarterly' | 'monthly';
  };
  result: {
    lambda: number;
    uncertainty: number;
    confidence_interval: [number, number];
  };
  parameters: {
    code: string;
    value: number;
    contribution: number;
    deviation_from_optimal: number;
    driving_indicators: { code: string; impact: number }[];
  }[];
  metadata: {
    calculation_version: string;
    calculated_at: string;
    data_completeness: number;
    methodology_hash: string;
  };
}

export const CALCULATION_STEPS = [
  {
    step: 1,
    name: { sv: 'Datainsamling', en: 'Data Collection' },
    description: {
      sv: 'Hämta alla indikatorer för varje parameter från verifierade källor',
      en: 'Retrieve all indicators for each parameter from verified sources',
    },
  },
  {
    step: 2,
    name: { sv: 'Normalisering', en: 'Normalization' },
    description: {
      sv: 'Transformera alla indikatorer till 0-1 skala med min-max eller z-score',
      en: 'Transform all indicators to 0-1 scale using min-max or z-score',
    },
  },
  {
    step: 3,
    name: { sv: 'Parameterberäkning', en: 'Parameter Calculation' },
    description: {
      sv: 'Aggregera indikatorer inom varje parameter med definierade vikter',
      en: 'Aggregate indicators within each parameter using defined weights',
    },
  },
  {
    step: 4,
    name: { sv: 'Lambda-beräkning', en: 'Lambda Calculation' },
    description: {
      sv: 'Beräkna λ = S_observed / S_optimal med osäkerhetsintervall',
      en: 'Calculate λ = S_observed / S_optimal with uncertainty interval',
    },
  },
  {
    step: 5,
    name: { sv: 'Validering', en: 'Validation' },
    description: {
      sv: 'Verifiera mot historiska värden och kända systemtillstånd',
      en: 'Verify against historical values and known system states',
    },
  },
];

// =============================================================================
// INTERPRETATION ZONES (NO MORAL COLORS)
// =============================================================================

export type LambdaZone = 'CRITICAL_LOW' | 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL_HIGH';

export interface ZoneDefinition {
  zone: LambdaZone;
  range: { min: number; max: number };
  engineState: { sv: string; en: string };
  systemState: { sv: string; en: string };
  consequences: { sv: string; en: string };
}

export const LAMBDA_ZONES: ZoneDefinition[] = [
  {
    zone: 'CRITICAL_LOW',
    range: { min: 0, max: 0.80 },
    engineState: { sv: 'Kraftigt för fett', en: 'Severely rich' },
    systemState: { sv: 'Allvarlig ineffektivitet', en: 'Severe inefficiency' },
    consequences: { sv: 'Massivt resursspill, systemisk korruption, stagnation', en: 'Massive resource waste, systemic corruption, stagnation' },
  },
  {
    zone: 'LOW',
    range: { min: 0.80, max: 0.95 },
    engineState: { sv: 'För fett', en: 'Rich mixture' },
    systemState: { sv: 'Underutnyttjande', en: 'Underutilization' },
    consequences: { sv: 'Ineffektivitet, spillförluster, potential outtjänad', en: 'Inefficiency, waste losses, unrealized potential' },
  },
  {
    zone: 'OPTIMAL',
    range: { min: 0.95, max: 1.05 },
    engineState: { sv: 'Optimal förbränning', en: 'Optimal combustion' },
    systemState: { sv: 'Balans', en: 'Balance' },
    consequences: { sv: 'Maximal nytta per resurs, stabil temperatur', en: 'Maximum utility per resource, stable temperature' },
  },
  {
    zone: 'HIGH',
    range: { min: 1.05, max: 1.20 },
    engineState: { sv: 'För magert', en: 'Lean mixture' },
    systemState: { sv: 'Överbelastning', en: 'Overstress' },
    consequences: { sv: 'Resursstress, utbrändhet, systemslitage', en: 'Resource strain, burnout, system wear' },
  },
  {
    zone: 'CRITICAL_HIGH',
    range: { min: 1.20, max: 2.0 },
    engineState: { sv: 'Kritiskt magert', en: 'Critically lean' },
    systemState: { sv: 'Kollapsrisk', en: 'Collapse risk' },
    consequences: { sv: 'Överhettning, irreversibla skador, systemkollaps', en: 'Overheating, irreversible damage, system collapse' },
  },
];

export function getLambdaZone(lambda: number): ZoneDefinition {
  return LAMBDA_ZONES.find(z => lambda >= z.range.min && lambda < z.range.max) || LAMBDA_ZONES[2];
}

// =============================================================================
// DEVIATION ANALYSIS
// =============================================================================

export interface DeviationAnalysis {
  lambda: number;
  deviation_from_optimal: number;
  primary_drivers: {
    parameter: string;
    contribution: number;
    direction: 'positive' | 'negative';
  }[];
  historical_comparison: {
    previous_period: number;
    change: number;
    trend: 'improving' | 'stable' | 'deteriorating';
  };
}

export const LAMBDA_DOCTRINE = {
  sv: 'Lambda är inte ett mål. Det är RESULTATET av att alla ingående parametrar är korrekt balanserade.',
  en: 'Lambda is not a goal. It is the RESULT of all input parameters being correctly balanced.',
};
