/**
 * INFINITY QUERY DSL
 * Deklarativt query-språk för hela systemet
 * 
 * REGEL: Användaren beskriver vad – systemet bestämmer hur.
 */

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface InfinityQuery {
  // What to query
  kpis: string[];                      // KPI codes from taxonomy
  
  // Where
  geo: GeoFilter;
  
  // When
  time: TimeFilter;
  
  // Who (optional demographic filtering)
  demographics?: DemographicFilter;
  
  // How to process
  operations?: QueryOperation[];
  
  // Output format
  output?: OutputSpec;
  
  // Safety & metadata
  options?: QueryOptions;
}

export interface GeoFilter {
  type: 'country' | 'nuts' | 'municipality' | 'cluster';
  codes: string[];                     // ISO/NUTS/cluster codes
  include_children?: boolean;          // Include sub-regions
  exclude?: string[];                  // Exclude specific regions
}

export interface TimeFilter {
  type: 'range' | 'latest' | 'periods';
  start?: string;                      // ISO date
  end?: string;                        // ISO date
  periods?: number;                    // Last N periods
  period_type?: 'month' | 'quarter' | 'year';
  as_of?: string;                      // Point-in-time (revision aware)
}

export interface DemographicFilter {
  age_groups?: string[];               // e.g., ['15_24', '25_44']
  sex?: 'all' | 'male' | 'female';
  education?: string[];
  migration_background?: 'all' | 'native' | 'foreign_born';
  income_quintile?: number[];
}

export type QueryOperation = 
  | AggregateOperation
  | CompareOperation
  | CorrelateOperation
  | TrendOperation
  | NormalizeOperation
  | ClusterOperation
  | SimulateOperation;

export interface AggregateOperation {
  type: 'aggregate';
  method: 'sum' | 'avg' | 'median' | 'min' | 'max' | 'weighted_avg';
  group_by?: string[];                 // Dimensions to group by
  weights?: Record<string, number>;    // For weighted operations
}

export interface CompareOperation {
  type: 'compare';
  baseline: string;                    // Region or time period
  method: 'difference' | 'ratio' | 'percentile_rank' | 'z_score';
}

export interface CorrelateOperation {
  type: 'correlate';
  method: 'pearson' | 'spearman' | 'time_lagged';
  lag_periods?: number;
  min_observations?: number;
}

export interface TrendOperation {
  type: 'trend';
  method: 'linear' | 'moving_avg' | 'yoy' | 'acceleration';
  window?: number;                     // For moving averages
  forecast_periods?: number;           // Project forward
}

export interface NormalizeOperation {
  type: 'normalize';
  method: 'percentile' | 'z_score' | 'min_max' | 'index_100';
  reference_group?: string[];          // Countries/regions for normalization
}

export interface ClusterOperation {
  type: 'cluster';
  method: 'kmeans' | 'hierarchical' | 'similarity';
  n_clusters?: number;
  distance_metric?: 'euclidean' | 'manhattan' | 'cosine';
}

export interface SimulateOperation {
  type: 'simulate';
  scenario: ScenarioSpec;
  confidence_intervals?: number[];     // e.g., [0.5, 0.9, 0.95]
}

export interface ScenarioSpec {
  name: string;
  changes: {
    kpi_code: string;
    change_type: 'absolute' | 'percent' | 'target';
    value: number;
    period?: string;
  }[];
  propagate_effects?: boolean;
}

export interface OutputSpec {
  format: 'table' | 'timeseries' | 'map' | 'scatter' | 'sankey' | 'radar';
  include_metadata?: boolean;
  include_uncertainty?: boolean;
  max_rows?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface QueryOptions {
  // Privacy & safety
  min_n?: number;                      // Minimum sample size
  block_risky_combinations?: boolean;  // Block demographic cross-tabs
  
  // Quality
  min_confidence?: number;             // 0-1
  require_revision_history?: boolean;
  max_data_lag_months?: number;
  
  // Explain
  include_explain_plan?: boolean;
  include_data_lineage?: boolean;
  include_methodology?: boolean;
  
  // Performance
  cache_ttl_seconds?: number;
  timeout_ms?: number;
}

// ============================================================================
// QUERY RESULT TYPES
// ============================================================================

export interface QueryResult {
  data: QueryDataPoint[];
  metadata: QueryMetadata;
  explain?: ExplainPlan;
  warnings?: QueryWarning[];
}

export interface QueryDataPoint {
  // Dimensions
  kpi_code: string;
  geo_code: string;
  period: string;
  demographic_key?: string;
  
  // Values
  value: number;
  value_normalized?: number;
  
  // Context
  confidence: number;
  is_estimated: boolean;
  source_ids: string[];
  
  // Computed (if operations applied)
  trend?: number;
  comparison_value?: number;
  cluster_id?: string;
}

export interface QueryMetadata {
  query_id: string;
  executed_at: string;
  execution_time_ms: number;
  
  total_rows: number;
  rows_returned: number;
  
  kpis_requested: number;
  kpis_available: number;
  
  geo_coverage: number;              // 0-1
  time_coverage: number;             // 0-1
  
  data_sources_used: string[];
  methodology_version: string;
}

export interface ExplainPlan {
  steps: ExplainStep[];
  estimated_cost: number;
  data_sources_queried: string[];
  joins_performed: string[];
  aggregations_applied: string[];
  privacy_checks: string[];
}

export interface ExplainStep {
  step_number: number;
  operation: string;
  description: string;
  estimated_rows: number;
  estimated_time_ms: number;
}

export interface QueryWarning {
  type: 'coverage' | 'confidence' | 'methodology' | 'privacy' | 'timeliness';
  severity: 'info' | 'warning' | 'error';
  message: string;
  affected_elements: string[];
  suggestion?: string;
}

// ============================================================================
// QUERY VALIDATION
// ============================================================================

export interface QueryValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface ValidationSuggestion {
  field: string;
  current_value: unknown;
  suggested_value: unknown;
  reason: string;
}

export function validateQuery(query: InfinityQuery): QueryValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: ValidationSuggestion[] = [];
  
  // Required fields
  if (!query.kpis || query.kpis.length === 0) {
    errors.push({
      field: 'kpis',
      message: 'At least one KPI must be specified',
      code: 'REQUIRED_FIELD'
    });
  }
  
  if (!query.geo || !query.geo.codes || query.geo.codes.length === 0) {
    errors.push({
      field: 'geo',
      message: 'Geographic scope must be specified',
      code: 'REQUIRED_FIELD'
    });
  }
  
  if (!query.time) {
    errors.push({
      field: 'time',
      message: 'Time filter must be specified',
      code: 'REQUIRED_FIELD'
    });
  }
  
  // Complexity limits
  if (query.kpis && query.kpis.length > 50) {
    errors.push({
      field: 'kpis',
      message: 'Maximum 50 KPIs per query',
      code: 'LIMIT_EXCEEDED'
    });
  }
  
  if (query.geo?.codes && query.geo.codes.length > 500) {
    errors.push({
      field: 'geo.codes',
      message: 'Maximum 500 regions per query',
      code: 'LIMIT_EXCEEDED'
    });
  }
  
  // Privacy warnings
  if (query.demographics && Object.keys(query.demographics).length > 2) {
    warnings.push({
      field: 'demographics',
      message: 'Multiple demographic filters may trigger small-N protections',
      code: 'PRIVACY_RISK'
    });
  }
  
  // Performance suggestions
  if (query.time?.type === 'range' && !query.time.period_type) {
    suggestions.push({
      field: 'time.period_type',
      current_value: undefined,
      suggested_value: 'year',
      reason: 'Specify period_type for better aggregation'
    });
  }
  
  // Methodology suggestions
  if (query.operations?.some(op => op.type === 'correlate') && 
      (!query.options?.min_confidence || query.options.min_confidence < 0.7)) {
    suggestions.push({
      field: 'options.min_confidence',
      current_value: query.options?.min_confidence,
      suggested_value: 0.7,
      reason: 'Correlation analysis benefits from higher confidence threshold'
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

// ============================================================================
// QUERY BUILDER (Fluent API)
// ============================================================================

export class QueryBuilder {
  private query: Partial<InfinityQuery> = {};
  
  kpis(...codes: string[]): QueryBuilder {
    this.query.kpis = codes;
    return this;
  }
  
  countries(...codes: string[]): QueryBuilder {
    this.query.geo = { type: 'country', codes };
    return this;
  }
  
  nuts(level: 1 | 2 | 3, ...codes: string[]): QueryBuilder {
    this.query.geo = { type: 'nuts', codes };
    return this;
  }
  
  timeRange(start: string, end: string): QueryBuilder {
    this.query.time = { type: 'range', start, end };
    return this;
  }
  
  latest(periods: number = 1, periodType: 'month' | 'quarter' | 'year' = 'year'): QueryBuilder {
    this.query.time = { type: 'latest', periods, period_type: periodType };
    return this;
  }
  
  lastYears(n: number): QueryBuilder {
    this.query.time = { type: 'periods', periods: n, period_type: 'year' };
    return this;
  }
  
  byAge(...groups: string[]): QueryBuilder {
    this.query.demographics = { ...this.query.demographics, age_groups: groups };
    return this;
  }
  
  bySex(sex: 'all' | 'male' | 'female'): QueryBuilder {
    this.query.demographics = { ...this.query.demographics, sex };
    return this;
  }
  
  aggregate(method: AggregateOperation['method'], groupBy?: string[]): QueryBuilder {
    const op: AggregateOperation = { type: 'aggregate', method, group_by: groupBy };
    this.query.operations = [...(this.query.operations || []), op];
    return this;
  }
  
  compare(baseline: string, method: CompareOperation['method'] = 'difference'): QueryBuilder {
    const op: CompareOperation = { type: 'compare', baseline, method };
    this.query.operations = [...(this.query.operations || []), op];
    return this;
  }
  
  correlate(method: CorrelateOperation['method'] = 'pearson'): QueryBuilder {
    const op: CorrelateOperation = { type: 'correlate', method };
    this.query.operations = [...(this.query.operations || []), op];
    return this;
  }
  
  trend(method: TrendOperation['method'] = 'linear'): QueryBuilder {
    const op: TrendOperation = { type: 'trend', method };
    this.query.operations = [...(this.query.operations || []), op];
    return this;
  }
  
  normalize(method: NormalizeOperation['method'] = 'percentile'): QueryBuilder {
    const op: NormalizeOperation = { type: 'normalize', method };
    this.query.operations = [...(this.query.operations || []), op];
    return this;
  }
  
  asTable(): QueryBuilder {
    this.query.output = { ...this.query.output, format: 'table' };
    return this;
  }
  
  asTimeseries(): QueryBuilder {
    this.query.output = { ...this.query.output, format: 'timeseries' };
    return this;
  }
  
  asMap(): QueryBuilder {
    this.query.output = { ...this.query.output, format: 'map' };
    return this;
  }
  
  withUncertainty(): QueryBuilder {
    this.query.output = { ...this.query.output, include_uncertainty: true };
    return this;
  }
  
  withExplain(): QueryBuilder {
    this.query.options = { ...this.query.options, include_explain_plan: true };
    return this;
  }
  
  minConfidence(level: number): QueryBuilder {
    this.query.options = { ...this.query.options, min_confidence: level };
    return this;
  }
  
  build(): InfinityQuery {
    const result = this.query as InfinityQuery;
    const validation = validateQuery(result);
    
    if (!validation.valid) {
      throw new Error(`Invalid query: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    return result;
  }
}

// Factory function
export function query(): QueryBuilder {
  return new QueryBuilder();
}

// ============================================================================
// EXAMPLE QUERIES
// ============================================================================

export const EXAMPLE_QUERIES = {
  // Basic: Get unemployment for Sweden
  basicSweden: () => query()
    .kpis('unemployment_rate')
    .countries('SE')
    .lastYears(10)
    .build(),
  
  // Compare: Sweden vs Norway vs Denmark
  nordicComparison: () => query()
    .kpis('unemployment_rate', 'gdp_per_capita', 'life_expectancy')
    .countries('SE', 'NO', 'DK', 'FI')
    .lastYears(5)
    .compare('SE', 'difference')
    .asTable()
    .build(),
  
  // Correlation: Employment vs GDP across EU
  euCorrelation: () => query()
    .kpis('employment_rate', 'gdp_growth')
    .countries('DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI')
    .lastYears(15)
    .correlate('pearson')
    .minConfidence(0.8)
    .withExplain()
    .build(),
  
  // Demographic: Youth unemployment by sex
  youthByGender: () => query()
    .kpis('youth_unemployment')
    .countries('SE')
    .lastYears(10)
    .bySex('all')
    .trend('linear')
    .asTimeseries()
    .withUncertainty()
    .build(),
  
  // Regional: Swedish NUTS2 regions
  swedishRegions: () => query()
    .kpis('employment_rate', 'gdp_per_capita')
    .nuts(2, 'SE11', 'SE12', 'SE21', 'SE22', 'SE23', 'SE31', 'SE32', 'SE33')
    .lastYears(5)
    .normalize('percentile')
    .asMap()
    .build()
};

console.log('[Query DSL] Ready');
