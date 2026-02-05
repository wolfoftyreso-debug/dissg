/**
 * INDEX FACTORY
 * 
 * Index byggs endast via deklarativa recept.
 * Alla vikter öppna. Alla transformationer loggade.
 * Index som inte kan förklaras = förbjudna.
 */

import type { TruthNode } from '../types';

// Index recipe - deklarativt, maskinläsbart
export interface IndexRecipe {
  index_id: string;
  version: string;
  inputs: string[]; // Truth Node IDs or indicator codes
  method: {
    normalize: 'zscore' | 'minmax' | 'rank' | 'none';
    aggregate: 'weighted_mean' | 'geometric_mean' | 'median' | 'sum';
    weights?: Record<string, number>;
  };
  constraints: {
    no_forecast: true;
    no_recommendation: true;
    min_coverage: number; // 0-1
    min_sources: number;
  };
  metadata: {
    domain: string;
    description: string;
    methodology_url?: string;
  };
}

export interface IndexValue {
  index_id: string;
  geo_code: string;
  time_point: string;
  value: number;
  normalized_inputs: Record<string, number>;
  raw_inputs: Record<string, number>;
  coverage: number;
  computation_log: ComputationStep[];
}

interface ComputationStep {
  step: string;
  input: unknown;
  output: unknown;
  method: string;
}

interface IndexResult {
  success: boolean;
  value?: IndexValue;
  error?: string;
  coverage?: number;
}

/**
 * Z-score normalization
 */
function zscoreNormalize(values: number[]): number[] {
  if (values.length < 2) return values;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  );
  if (std === 0) return values.map(() => 0);
  return values.map(v => (v - mean) / std);
}

/**
 * Min-max normalization to 0-1
 */
function minmaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map(v => (v - min) / (max - min));
}

/**
 * Rank normalization
 */
function rankNormalize(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  return values.map(v => sorted.indexOf(v) / (values.length - 1));
}

/**
 * Aggregation methods
 */
function weightedMean(
  values: Record<string, number>, 
  weights: Record<string, number>
): number {
  let sum = 0;
  let weightSum = 0;
  for (const [key, value] of Object.entries(values)) {
    const weight = weights[key] ?? 1;
    sum += value * weight;
    weightSum += weight;
  }
  return weightSum > 0 ? sum / weightSum : 0;
}

function geometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.some(v => v <= 0)) return 0;
  return Math.pow(
    values.reduce((prod, v) => prod * v, 1),
    1 / values.length
  );
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Compute index from recipe and nodes
 */
export function computeIndex(
  recipe: IndexRecipe,
  nodes: Map<string, TruthNode>,
  geo_code: string,
  time_point: string
): IndexResult {
  const log: ComputationStep[] = [];
  const rawInputs: Record<string, number> = {};
  const normalizedInputs: Record<string, number> = {};
  
  // Collect input values
  let foundCount = 0;
  for (const inputId of recipe.inputs) {
    const node = nodes.get(inputId);
    if (node && node.scope.geo_code === geo_code) {
      // Get value for time point (simplified)
      const value = node.values[node.values.length - 1];
      rawInputs[inputId] = value;
      foundCount++;
    }
  }
  
  // Check coverage constraint
  const coverage = foundCount / recipe.inputs.length;
  if (coverage < recipe.constraints.min_coverage) {
    return {
      success: false,
      error: `insufficient_coverage:${coverage.toFixed(2)}<${recipe.constraints.min_coverage}`,
      coverage,
    };
  }
  
  log.push({
    step: 'collect_inputs',
    input: recipe.inputs,
    output: rawInputs,
    method: 'node_lookup',
  });
  
  // Normalize
  const rawValues = Object.values(rawInputs);
  let normalizedValues: number[];
  
  switch (recipe.method.normalize) {
    case 'zscore':
      normalizedValues = zscoreNormalize(rawValues);
      break;
    case 'minmax':
      normalizedValues = minmaxNormalize(rawValues);
      break;
    case 'rank':
      normalizedValues = rankNormalize(rawValues);
      break;
    default:
      normalizedValues = rawValues;
  }
  
  // Map back to keys
  const keys = Object.keys(rawInputs);
  keys.forEach((key, i) => {
    normalizedInputs[key] = normalizedValues[i];
  });
  
  log.push({
    step: 'normalize',
    input: rawInputs,
    output: normalizedInputs,
    method: recipe.method.normalize,
  });
  
  // Aggregate
  let finalValue: number;
  const weights = recipe.method.weights || 
    Object.fromEntries(keys.map(k => [k, 1]));
  
  switch (recipe.method.aggregate) {
    case 'weighted_mean':
      finalValue = weightedMean(normalizedInputs, weights);
      break;
    case 'geometric_mean':
      finalValue = geometricMean(Object.values(normalizedInputs));
      break;
    case 'median':
      finalValue = median(Object.values(normalizedInputs));
      break;
    case 'sum':
      finalValue = Object.values(normalizedInputs).reduce((a, b) => a + b, 0);
      break;
    default:
      finalValue = 0;
  }
  
  log.push({
    step: 'aggregate',
    input: normalizedInputs,
    output: finalValue,
    method: `${recipe.method.aggregate}:weights=${JSON.stringify(weights)}`,
  });
  
  return {
    success: true,
    value: {
      index_id: recipe.index_id,
      geo_code,
      time_point,
      value: finalValue,
      normalized_inputs: normalizedInputs,
      raw_inputs: rawInputs,
      coverage,
      computation_log: log,
    },
  };
}

// ============================================
// STANDARD INDEX RECIPES
// ============================================

export const HEALTHCARE_LOAD_INDEX: IndexRecipe = {
  index_id: 'healthcare_load_index',
  version: '1.0.0',
  inputs: [
    'wait_times_specialist',
    'wait_times_emergency',
    'bed_occupancy_rate',
    'staff_turnover_rate',
    'patient_to_nurse_ratio',
  ],
  method: {
    normalize: 'zscore',
    aggregate: 'weighted_mean',
    weights: {
      wait_times_specialist: 0.2,
      wait_times_emergency: 0.25,
      bed_occupancy_rate: 0.25,
      staff_turnover_rate: 0.15,
      patient_to_nurse_ratio: 0.15,
    },
  },
  constraints: {
    no_forecast: true,
    no_recommendation: true,
    min_coverage: 0.6,
    min_sources: 3,
  },
  metadata: {
    domain: 'healthcare',
    description: 'Composite measure of healthcare system operational load',
  },
};

export const ECONOMIC_PRESSURE_INDEX: IndexRecipe = {
  index_id: 'economic_pressure_index',
  version: '1.0.0',
  inputs: [
    'cpi_all_items',
    'housing_cost_index',
    'energy_price_index',
    'food_price_index',
    'wage_growth_real',
  ],
  method: {
    normalize: 'minmax',
    aggregate: 'weighted_mean',
    weights: {
      cpi_all_items: 0.15,
      housing_cost_index: 0.3,
      energy_price_index: 0.2,
      food_price_index: 0.2,
      wage_growth_real: 0.15,
    },
  },
  constraints: {
    no_forecast: true,
    no_recommendation: true,
    min_coverage: 0.7,
    min_sources: 3,
  },
  metadata: {
    domain: 'economy',
    description: 'Composite measure of economic pressure on households',
  },
};

export const MENTAL_HEALTH_BURDEN_INDEX: IndexRecipe = {
  index_id: 'mental_health_burden_index',
  version: '1.0.0',
  inputs: [
    'anxiety_prevalence',
    'depression_prevalence',
    'stress_self_reported',
    'sleep_insufficiency',
    'psych_medication_use',
  ],
  method: {
    normalize: 'zscore',
    aggregate: 'weighted_mean',
  },
  constraints: {
    no_forecast: true,
    no_recommendation: true,
    min_coverage: 0.5,
    min_sources: 2,
  },
  metadata: {
    domain: 'health',
    description: 'Composite measure of population mental health burden',
  },
};

// Registry of all standard indexes
export const INDEX_REGISTRY: Record<string, IndexRecipe> = {
  healthcare_load_index: HEALTHCARE_LOAD_INDEX,
  economic_pressure_index: ECONOMIC_PRESSURE_INDEX,
  mental_health_burden_index: MENTAL_HEALTH_BURDEN_INDEX,
} as const;
