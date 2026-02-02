/**
 * UNIVERSAL AGGREGATION ENGINE
 * Block AB: Anyone can aggregate anything
 * 
 * User combines — System validates
 */

// ============================================================================
// AGGREGATION PRIMITIVES
// ============================================================================

export type AggregationOperation = 
  | 'sum'
  | 'mean'
  | 'median'
  | 'min'
  | 'max'
  | 'count'
  | 'percentile'
  | 'std'
  | 'variance'
  | 'range'
  | 'index'
  | 'delta'
  | 'delta_percent'
  | 'trend'
  | 'acceleration'
  | 'correlation'
  | 'lagged_correlation'
  | 'cluster'
  | 'anomaly'
  | 'forecast'
  | 'decompose';

export interface AggregationPrimitive {
  id: AggregationOperation;
  name: string;
  name_en: string;
  description: string;
  input_type: 'single_series' | 'multiple_series' | 'cross_section';
  output_type: 'scalar' | 'series' | 'matrix' | 'cluster_set';
  parameters?: ParameterDefinition[];
  min_observations?: number;
  requires_numeric: boolean;
  privacy_sensitive: boolean;
}

export interface ParameterDefinition {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'array';
  required: boolean;
  default?: unknown;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    enum?: unknown[];
  };
}

export const AGGREGATION_PRIMITIVES: AggregationPrimitive[] = [
  // Basic Statistics
  {
    id: 'sum',
    name: 'Summa',
    name_en: 'Sum',
    description: 'Total of all values',
    input_type: 'single_series',
    output_type: 'scalar',
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'mean',
    name: 'Medelvärde',
    name_en: 'Mean',
    description: 'Arithmetic average',
    input_type: 'single_series',
    output_type: 'scalar',
    min_observations: 1,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'median',
    name: 'Median',
    name_en: 'Median',
    description: 'Middle value',
    input_type: 'single_series',
    output_type: 'scalar',
    min_observations: 1,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'percentile',
    name: 'Percentil',
    name_en: 'Percentile',
    description: 'Value at given percentile',
    input_type: 'single_series',
    output_type: 'scalar',
    parameters: [
      { name: 'p', type: 'number', required: true, default: 50, description: 'Percentile (0-100)', validation: { min: 0, max: 100 } }
    ],
    min_observations: 10,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'std',
    name: 'Standardavvikelse',
    name_en: 'Standard Deviation',
    description: 'Measure of spread',
    input_type: 'single_series',
    output_type: 'scalar',
    min_observations: 3,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'variance',
    name: 'Varians',
    name_en: 'Variance',
    description: 'Squared deviation from mean',
    input_type: 'single_series',
    output_type: 'scalar',
    min_observations: 3,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'min',
    name: 'Minimum',
    name_en: 'Minimum',
    description: 'Smallest value',
    input_type: 'single_series',
    output_type: 'scalar',
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'max',
    name: 'Maximum',
    name_en: 'Maximum',
    description: 'Largest value',
    input_type: 'single_series',
    output_type: 'scalar',
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'range',
    name: 'Spridning',
    name_en: 'Range',
    description: 'Difference between max and min',
    input_type: 'single_series',
    output_type: 'scalar',
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'count',
    name: 'Antal',
    name_en: 'Count',
    description: 'Number of observations',
    input_type: 'single_series',
    output_type: 'scalar',
    requires_numeric: false,
    privacy_sensitive: true, // Can reveal population sizes
  },
  
  // Index Construction
  {
    id: 'index',
    name: 'Index',
    name_en: 'Index',
    description: 'Construct weighted index from multiple KPIs',
    input_type: 'multiple_series',
    output_type: 'series',
    parameters: [
      { name: 'weights', type: 'array', required: true, description: 'Weights for each input series' },
      { name: 'normalization', type: 'string', required: false, default: 'z_score', description: 'Normalization method', validation: { enum: ['z_score', 'min_max', 'percentile'] } },
    ],
    min_observations: 5,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  
  // Change Analysis
  {
    id: 'delta',
    name: 'Förändring',
    name_en: 'Delta',
    description: 'Absolute change between periods',
    input_type: 'single_series',
    output_type: 'series',
    parameters: [
      { name: 'periods', type: 'number', required: false, default: 1, description: 'Number of periods for comparison' },
    ],
    min_observations: 2,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'delta_percent',
    name: 'Procentuell förändring',
    name_en: 'Percent Change',
    description: 'Percentage change between periods',
    input_type: 'single_series',
    output_type: 'series',
    parameters: [
      { name: 'periods', type: 'number', required: false, default: 1, description: 'Number of periods for comparison' },
    ],
    min_observations: 2,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'trend',
    name: 'Trend',
    name_en: 'Trend',
    description: 'Linear trend direction and strength',
    input_type: 'single_series',
    output_type: 'series',
    parameters: [
      { name: 'window', type: 'number', required: false, default: 12, description: 'Window for trend calculation' },
    ],
    min_observations: 6,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'acceleration',
    name: 'Acceleration',
    name_en: 'Acceleration',
    description: 'Change in rate of change',
    input_type: 'single_series',
    output_type: 'series',
    min_observations: 6,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  
  // Relationship Analysis
  {
    id: 'correlation',
    name: 'Korrelation',
    name_en: 'Correlation',
    description: 'Pearson correlation between two series',
    input_type: 'multiple_series',
    output_type: 'scalar',
    min_observations: 10,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  {
    id: 'lagged_correlation',
    name: 'Laggad korrelation',
    name_en: 'Lagged Correlation',
    description: 'Correlation with time lag',
    input_type: 'multiple_series',
    output_type: 'matrix',
    parameters: [
      { name: 'max_lag', type: 'number', required: false, default: 12, description: 'Maximum lag periods to test' },
    ],
    min_observations: 20,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  
  // Pattern Detection
  {
    id: 'cluster',
    name: 'Klustring',
    name_en: 'Cluster',
    description: 'Group similar observations',
    input_type: 'cross_section',
    output_type: 'cluster_set',
    parameters: [
      { name: 'n_clusters', type: 'number', required: false, default: 5, description: 'Number of clusters', validation: { min: 2, max: 20 } },
      { name: 'method', type: 'string', required: false, default: 'kmeans', description: 'Clustering algorithm', validation: { enum: ['kmeans', 'hierarchical', 'dbscan'] } },
    ],
    min_observations: 20,
    requires_numeric: true,
    privacy_sensitive: true, // Can reveal group characteristics
  },
  {
    id: 'anomaly',
    name: 'Anomali',
    name_en: 'Anomaly Detection',
    description: 'Identify unusual observations',
    input_type: 'single_series',
    output_type: 'series',
    parameters: [
      { name: 'sensitivity', type: 'number', required: false, default: 2, description: 'Standard deviations for anomaly threshold', validation: { min: 1, max: 5 } },
    ],
    min_observations: 30,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  
  // Forecasting
  {
    id: 'forecast',
    name: 'Prognos',
    name_en: 'Forecast',
    description: 'Project future values',
    input_type: 'single_series',
    output_type: 'series',
    parameters: [
      { name: 'periods', type: 'number', required: true, default: 12, description: 'Number of periods to forecast', validation: { min: 1, max: 60 } },
      { name: 'method', type: 'string', required: false, default: 'arima', description: 'Forecasting method', validation: { enum: ['arima', 'ets', 'prophet', 'linear'] } },
      { name: 'confidence', type: 'number', required: false, default: 0.95, description: 'Confidence interval', validation: { min: 0.5, max: 0.99 } },
    ],
    min_observations: 24,
    requires_numeric: true,
    privacy_sensitive: false,
  },
  
  // Decomposition
  {
    id: 'decompose',
    name: 'Dekomponera',
    name_en: 'Decompose',
    description: 'Separate trend, seasonality, and residual',
    input_type: 'single_series',
    output_type: 'matrix',
    parameters: [
      { name: 'period', type: 'number', required: false, default: 12, description: 'Seasonal period' },
      { name: 'model', type: 'string', required: false, default: 'additive', description: 'Decomposition model', validation: { enum: ['additive', 'multiplicative'] } },
    ],
    min_observations: 24,
    requires_numeric: true,
    privacy_sensitive: false,
  },
];

// ============================================================================
// AGGREGATION QUERY
// ============================================================================

export interface AggregationQuery {
  id?: string;
  
  // Data Selection
  kpis: string[];
  geo_codes: string[];
  time_range: {
    start: string;
    end: string;
  };
  demographics?: Record<string, string[]>;
  
  // Operations (executed in order)
  operations: AggregationStep[];
  
  // Output
  output_format: 'json' | 'csv' | 'parquet';
  include_metadata: boolean;
  
  // User info
  user_id?: string;
  api_key?: string;
}

export interface AggregationStep {
  operation: AggregationOperation;
  parameters?: Record<string, unknown>;
  alias?: string;
  input_refs?: string[]; // Reference to previous step results
}

// ============================================================================
// SAFETY LAYER
// ============================================================================

export interface SafetyCheck {
  passed: boolean;
  warnings: SafetyWarning[];
  blocks: SafetyBlock[];
}

export interface SafetyWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggestion?: string;
}

export interface SafetyBlock {
  code: string;
  message: string;
  reason: string;
}

export interface SafetyConfig {
  min_n: number; // Minimum observations for aggregation
  max_demographic_combinations: number;
  blocked_combinations: string[][]; // Dangerous cross-tabulations
  require_confidence_score: boolean;
  max_query_complexity: number;
}

export const DEFAULT_SAFETY_CONFIG: SafetyConfig = {
  min_n: 5, // Protect small populations
  max_demographic_combinations: 3,
  blocked_combinations: [
    ['age', 'location', 'ethnicity'], // Too identifying
    ['health_condition', 'location', 'age'], // Medical privacy
  ],
  require_confidence_score: true,
  max_query_complexity: 100,
};

export function performSafetyCheck(
  query: AggregationQuery,
  config: SafetyConfig = DEFAULT_SAFETY_CONFIG
): SafetyCheck {
  const warnings: SafetyWarning[] = [];
  const blocks: SafetyBlock[] = [];
  
  // Check minimum N
  // (Would check against actual data in practice)
  
  // Check demographic combinations
  const demoDimensions = Object.keys(query.demographics || {});
  if (demoDimensions.length > config.max_demographic_combinations) {
    blocks.push({
      code: 'TOO_MANY_DEMOGRAPHICS',
      message: `Maximum ${config.max_demographic_combinations} demographic dimensions allowed`,
      reason: 'Privacy protection'
    });
  }
  
  // Check blocked combinations
  for (const blocked of config.blocked_combinations) {
    const hasAll = blocked.every(dim => demoDimensions.includes(dim));
    if (hasAll) {
      blocks.push({
        code: 'BLOCKED_COMBINATION',
        message: `Combination ${blocked.join(' + ')} is not allowed`,
        reason: 'Re-identification risk'
      });
    }
  }
  
  // Check query complexity
  const complexity = calculateQueryComplexity(query);
  if (complexity > config.max_query_complexity) {
    warnings.push({
      code: 'HIGH_COMPLEXITY',
      message: `Query complexity ${complexity} exceeds recommended ${config.max_query_complexity}`,
      severity: 'warning',
      suggestion: 'Consider breaking into smaller queries'
    });
  }
  
  // Warn about potential statistical issues
  if (query.operations.some(op => op.operation === 'correlation') && query.kpis.length < 2) {
    warnings.push({
      code: 'INSUFFICIENT_SERIES',
      message: 'Correlation requires at least 2 data series',
      severity: 'error'
    });
  }
  
  return {
    passed: blocks.length === 0,
    warnings,
    blocks
  };
}

function calculateQueryComplexity(query: AggregationQuery): number {
  let complexity = 0;
  
  complexity += query.kpis.length * 2;
  complexity += query.geo_codes.length;
  complexity += Object.keys(query.demographics || {}).length * 5;
  complexity += query.operations.length * 10;
  
  // Expensive operations
  for (const op of query.operations) {
    if (['cluster', 'forecast', 'lagged_correlation'].includes(op.operation)) {
      complexity += 20;
    }
  }
  
  return complexity;
}

// ============================================================================
// AGGREGATION RESULT
// ============================================================================

export interface AggregationResult {
  query_id: string;
  
  // Results
  data: unknown;
  
  // Metadata
  metadata: {
    kpis: string[];
    geo_codes: string[];
    time_range: { start: string; end: string };
    operations_applied: string[];
    observations_used: number;
  };
  
  // Quality
  confidence_score: number;
  coverage_score: number;
  warnings: SafetyWarning[];
  
  // Execution
  executed_at: string;
  execution_time_ms: number;
  cache_hit: boolean;
  
  // Attribution
  data_sources: string[];
  methodology_url: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPrimitiveById(id: AggregationOperation): AggregationPrimitive | undefined {
  return AGGREGATION_PRIMITIVES.find(p => p.id === id);
}

export function getPrivacySensitivePrimitives(): AggregationPrimitive[] {
  return AGGREGATION_PRIMITIVES.filter(p => p.privacy_sensitive);
}

export function validateParameters(
  operation: AggregationOperation,
  params: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const primitive = getPrimitiveById(operation);
  if (!primitive) {
    return { valid: false, errors: [`Unknown operation: ${operation}`] };
  }
  
  const errors: string[] = [];
  
  for (const paramDef of primitive.parameters || []) {
    const value = params[paramDef.name];
    
    if (paramDef.required && value === undefined) {
      errors.push(`Missing required parameter: ${paramDef.name}`);
      continue;
    }
    
    if (value !== undefined && paramDef.validation) {
      if (paramDef.validation.min !== undefined && (value as number) < paramDef.validation.min) {
        errors.push(`${paramDef.name} must be >= ${paramDef.validation.min}`);
      }
      if (paramDef.validation.max !== undefined && (value as number) > paramDef.validation.max) {
        errors.push(`${paramDef.name} must be <= ${paramDef.validation.max}`);
      }
      if (paramDef.validation.enum && !paramDef.validation.enum.includes(value)) {
        errors.push(`${paramDef.name} must be one of: ${paramDef.validation.enum.join(', ')}`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

console.log('[Universal Aggregation] Loaded with', AGGREGATION_PRIMITIVES.length, 'primitives');
