/**
 * BLOCK AI — GLOBAL SIMULATION & SCENARIO ENGINE
 * Configuration for simulation types and parameters
 */

// AI1: Simulation Types
export interface SimulationTypeConfig {
  code: string;
  type: 'kpi_sensitivity' | 'index_sensitivity' | 'lagged_effect' | 'scenario_comparison' | 'stress_test';
  name: string;
  description: string;
  inputSchema: SimulationInput[];
  outputSchema: SimulationOutput[];
  defaultAssumptions: Record<string, unknown>;
  disclaimer: string;
}

export interface SimulationInput {
  name: string;
  type: 'number' | 'percentage' | 'select' | 'multi_select' | 'date_range' | 'kpi_selector' | 'table';
  label: string;
  description: string;
  required: boolean;
  defaultValue?: unknown;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface SimulationOutput {
  name: string;
  type: 'number' | 'percentage' | 'chart' | 'table' | 'comparison';
  label: string;
  description: string;
}

export const SIMULATION_TYPES: SimulationTypeConfig[] = [
  {
    code: 'KPI_SENSITIVITY',
    type: 'kpi_sensitivity',
    name: 'KPI Sensitivity Analysis',
    description: 'Analyze how a KPI responds to changes in input factors',
    inputSchema: [
      { name: 'kpi_id', type: 'kpi_selector', label: 'Välj KPI', description: 'KPI att analysera', required: true },
      { name: 'change_percent', type: 'percentage', label: 'Förändring %', description: 'Procentuell förändring att simulera', required: true, defaultValue: 10, min: -100, max: 100 },
      { name: 'time_horizon', type: 'select', label: 'Tidshorisont', description: 'Period för simulering', required: true, defaultValue: '12m', options: [
        { value: '3m', label: '3 månader' },
        { value: '6m', label: '6 månader' },
        { value: '12m', label: '1 år' },
        { value: '24m', label: '2 år' }
      ]}
    ],
    outputSchema: [
      { name: 'projected_value', type: 'number', label: 'Projicerat värde', description: 'Förväntat värde efter förändring' },
      { name: 'confidence_range', type: 'chart', label: 'Konfidensintervall', description: 'Osäkerhetsband' },
      { name: 'affected_kpis', type: 'table', label: 'Påverkade KPI:er', description: 'Andra KPI:er som påverkas' }
    ],
    defaultAssumptions: {
      correlation_decay: 0.8,
      external_factors_constant: true,
      policy_unchanged: true
    },
    disclaimer: 'SIMULERING, EJ VERKLIGHET. Baserat på historiska korrelationer som kan förändras.'
  },
  {
    code: 'INDEX_SENSITIVITY',
    type: 'index_sensitivity',
    name: 'Index Sensitivity Analysis',
    description: 'Analyze how composite indices respond to component changes',
    inputSchema: [
      { name: 'index_code', type: 'select', label: 'Välj index', description: 'Index att analysera', required: true, options: [
        { value: 'GMI', label: 'Global Master Index' },
        { value: 'SSI', label: 'Social Stability Index' },
        { value: 'EPI', label: 'Economic Performance Index' }
      ]},
      { name: 'component_changes', type: 'table', label: 'Komponentförändringar', description: 'Förändring per komponent', required: true }
    ],
    outputSchema: [
      { name: 'new_index_value', type: 'number', label: 'Nytt indexvärde', description: 'Index efter simulerade förändringar' },
      { name: 'component_contributions', type: 'chart', label: 'Komponentbidrag', description: 'Varje komponents bidrag' },
      { name: 'ranking_change', type: 'comparison', label: 'Rankingförändring', description: 'Förändring i jämförelse med andra' }
    ],
    defaultAssumptions: {
      weights_constant: true,
      normalization_method: 'z_score'
    },
    disclaimer: 'SIMULERING, EJ VERKLIGHET. Viktning och metodik kan förändras.'
  },
  {
    code: 'LAGGED_EFFECT',
    type: 'lagged_effect',
    name: 'Lagged Effect Simulation',
    description: 'Simulate delayed effects from policy or event changes',
    inputSchema: [
      { name: 'trigger_event', type: 'select', label: 'Utlösande händelse', description: 'Event eller policy', required: true },
      { name: 'target_kpis', type: 'multi_select', label: 'Mål-KPI:er', description: 'KPI:er att spåra', required: true },
      { name: 'lag_months', type: 'number', label: 'Förväntad fördröjning (månader)', description: 'Typisk tid innan effekt', required: true, defaultValue: 6, min: 1, max: 60 }
    ],
    outputSchema: [
      { name: 'effect_timeline', type: 'chart', label: 'Effekttidslinje', description: 'Förväntad effekt över tid' },
      { name: 'peak_effect', type: 'number', label: 'Maximal effekt', description: 'Starkaste förväntade effekt' },
      { name: 'duration', type: 'number', label: 'Effektduration', description: 'Hur länge effekten varar' }
    ],
    defaultAssumptions: {
      decay_rate: 0.1,
      compounding: false
    },
    disclaimer: 'SIMULERING, EJ VERKLIGHET. Fördröjningar varierar baserat på många faktorer.'
  },
  {
    code: 'SCENARIO_COMPARISON',
    type: 'scenario_comparison',
    name: 'Scenario Comparison',
    description: 'Compare outcomes under different scenarios',
    inputSchema: [
      { name: 'base_scenario', type: 'select', label: 'Basscenario', description: 'Utgångspunkt', required: true, options: [
        { value: 'current', label: 'Nuvarande trend' },
        { value: 'historical_avg', label: 'Historiskt snitt' }
      ]},
      { name: 'scenarios', type: 'table', label: 'Scenarier', description: 'Scenarier att jämföra', required: true },
      { name: 'time_horizon', type: 'select', label: 'Tidshorisont', description: 'Jämförelseperiod', required: true, defaultValue: '12m' }
    ],
    outputSchema: [
      { name: 'comparison_chart', type: 'chart', label: 'Scenariojämförelse', description: 'Visuell jämförelse' },
      { name: 'outcome_table', type: 'table', label: 'Utfallstabell', description: 'Detaljerad jämförelse' },
      { name: 'best_case', type: 'comparison', label: 'Bästa scenario', description: 'Scenario med bäst utfall' }
    ],
    defaultAssumptions: {
      independent_scenarios: true
    },
    disclaimer: 'SIMULERING, EJ VERKLIGHET. Faktiska utfall beror på många oförutsägbara faktorer.'
  },
  {
    code: 'STRESS_TEST',
    type: 'stress_test',
    name: 'Stress Test',
    description: 'Test system resilience under extreme conditions',
    inputSchema: [
      { name: 'stress_type', type: 'select', label: 'Stresstyp', description: 'Typ av stresstest', required: true, options: [
        { value: 'economic_shock', label: 'Ekonomisk chock' },
        { value: 'pandemic', label: 'Pandemi' },
        { value: 'energy_crisis', label: 'Energikris' },
        { value: 'financial_crisis', label: 'Finanskris' },
        { value: 'climate_extreme', label: 'Klimatextrem' }
      ]},
      { name: 'severity', type: 'select', label: 'Allvarlighetsgrad', description: 'Hur allvarligt scenario', required: true, options: [
        { value: 'moderate', label: 'Måttlig' },
        { value: 'severe', label: 'Allvarlig' },
        { value: 'extreme', label: 'Extrem' }
      ]},
      { name: 'duration_months', type: 'number', label: 'Duration (månader)', description: 'Hur länge stressen varar', required: true, defaultValue: 6, min: 1, max: 36 }
    ],
    outputSchema: [
      { name: 'impact_matrix', type: 'table', label: 'Påverkansmatris', description: 'Påverkan per KPI' },
      { name: 'recovery_timeline', type: 'chart', label: 'Återhämtningstidslinje', description: 'Tid till återhämtning' },
      { name: 'vulnerability_score', type: 'number', label: 'Sårbarhetspoäng', description: 'Systemets sårbarhet' }
    ],
    defaultAssumptions: {
      policy_response: 'moderate',
      international_coordination: true
    },
    disclaimer: 'SIMULERING, EJ VERKLIGHET. Stresstester baseras på historiska kriser och kan inte förutsäga framtida händelser.'
  }
];

// AI2: Standard Simulation Output Format
export interface SimulationResult {
  simulationId: string;
  simulationType: string;
  timestamp: string;
  inputs: Record<string, unknown>;
  assumptions: Record<string, unknown>;
  results: {
    primaryOutput: unknown;
    secondaryOutputs: Record<string, unknown>;
    affectedKpis: Array<{
      kpiId: string;
      kpiName: string;
      currentValue: number;
      projectedValue: number;
      changePercent: number;
      confidence: number;
    }>;
  };
  uncertainty: {
    method: string;
    confidenceLevel: number;
    lowerBound: number;
    upperBound: number;
  };
  historicalSensitivity: {
    periodsAnalyzed: number;
    averageAccuracy: number;
    volatility: number;
  };
  disclaimers: string[];
}

// Helper functions
export function getSimulationType(code: string): SimulationTypeConfig | undefined {
  return SIMULATION_TYPES.find(s => s.code === code);
}

export function formatSimulationDisclaimer(type: SimulationTypeConfig): string {
  return `⚠️ ${type.disclaimer}`;
}

export function validateSimulationInputs(
  type: SimulationTypeConfig,
  inputs: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const schema of type.inputSchema) {
    if (schema.required && inputs[schema.name] === undefined) {
      errors.push(`${schema.label} krävs`);
    }
    if (schema.type === 'number' || schema.type === 'percentage') {
      const value = inputs[schema.name] as number;
      if (schema.min !== undefined && value < schema.min) {
        errors.push(`${schema.label} måste vara minst ${schema.min}`);
      }
      if (schema.max !== undefined && value > schema.max) {
        errors.push(`${schema.label} får vara max ${schema.max}`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}
