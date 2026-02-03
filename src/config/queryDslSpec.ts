/**
 * BLOCK S — INFINITY QUERY DSL SPECIFICATION
 * 
 * Declarative query language for the Infinity Query Engine.
 * All queries follow the what/where/when/who/ops/output structure.
 */

// =============================================================================
// QUERY STRUCTURE
// =============================================================================

export interface InfinityQuery {
  /** What data to retrieve - KPI IDs, index codes, or metric expressions */
  what: WhatClause[];
  
  /** Geographic scope - countries, regions, cities */
  where: WhereClause[];
  
  /** Time range and granularity */
  when: WhenClause;
  
  /** Demographic filters */
  who?: WhoClause;
  
  /** Operations to apply - aggregations, comparisons, calculations */
  ops?: OperationClause[];
  
  /** Output format and structure */
  output: OutputClause;
}

// =============================================================================
// WHAT CLAUSE
// =============================================================================

export type WhatType = 'kpi' | 'index' | 'metric' | 'expression';

export interface WhatClause {
  type: WhatType;
  id: string;                           // KPI ID, index code, or expression
  alias?: string;                       // Optional alias for output
  
  // For expressions
  formula?: string;                     // e.g., "kpi:gdp / kpi:population"
}

// =============================================================================
// WHERE CLAUSE
// =============================================================================

export type GeoType = 'country' | 'region' | 'city' | 'adm1' | 'adm2' | 'custom';

export interface WhereClause {
  type: GeoType;
  codes: string[];                      // ISO codes or custom IDs
  
  // For custom regions
  definition?: {
    include: string[];
    exclude?: string[];
  };
}

// =============================================================================
// WHEN CLAUSE
// =============================================================================

export type TimeGranularity = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface WhenClause {
  start: string;                        // ISO date or relative: "-5Y", "-10Y"
  end: string;                          // ISO date or "latest"
  granularity: TimeGranularity;
  
  // Advanced time options
  compare_to?: {
    type: 'period' | 'baseline';
    value: string;                      // "-1Y", "2019", etc.
  };
}

// =============================================================================
// WHO CLAUSE
// =============================================================================

export interface WhoClause {
  age_groups?: string[];                // e.g., ["0-14", "15-64", "65+"]
  sex?: ('male' | 'female' | 'all')[];
  education_levels?: string[];
  income_quintiles?: (1 | 2 | 3 | 4 | 5)[];
  urban_rural?: ('urban' | 'rural' | 'all')[];
  
  custom_dimensions?: Record<string, string[]>;
}

// =============================================================================
// OPERATIONS CLAUSE
// =============================================================================

export type OperationType = 
  | 'aggregate'
  | 'compare'
  | 'rank'
  | 'normalize'
  | 'growth'
  | 'correlate'
  | 'forecast';

export interface OperationClause {
  op: OperationType;
  params: Record<string, any>;
}

export interface AggregateOp extends OperationClause {
  op: 'aggregate';
  params: {
    method: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'weighted_mean';
    over: 'time' | 'geo' | 'demographic';
    weights?: string;                   // KPI ID for weights
  };
}

export interface CompareOp extends OperationClause {
  op: 'compare';
  params: {
    type: 'absolute' | 'relative' | 'rank';
    baseline?: string;                  // Country code or "average"
  };
}

export interface GrowthOp extends OperationClause {
  op: 'growth';
  params: {
    type: 'yoy' | 'cagr' | 'absolute';
    periods?: number;
  };
}

export interface CorrelateOp extends OperationClause {
  op: 'correlate';
  params: {
    with: string;                       // KPI ID to correlate with
    method: 'pearson' | 'spearman' | 'kendall';
    lag?: number;                       // Time lag in periods
  };
}

// =============================================================================
// OUTPUT CLAUSE
// =============================================================================

export type OutputFormat = 'json' | 'csv' | 'chart_json' | 'table' | 'sdmx';

export interface OutputClause {
  format: OutputFormat;
  
  include?: {
    metadata?: boolean;                 // Source, method, confidence
    uncertainty?: boolean;              // Confidence intervals
    explanation?: boolean;              // Plain-language explanation
    source_links?: boolean;             // Links to original sources
  };
  
  limit?: number;
  offset?: number;
  
  sort?: {
    by: string;                         // Field to sort by
    order: 'asc' | 'desc';
  };
}

// =============================================================================
// QUERY RESPONSE
// =============================================================================

export interface QueryResponse<T = any> {
  query_id: string;
  executed_at: string;
  execution_time_ms: number;
  
  query: InfinityQuery;
  
  data: T;
  
  metadata: {
    sources_used: string[];
    coverage: {
      temporal: { start: string; end: string; gaps: string[] };
      geographic: { requested: number; available: number; missing: string[] };
    };
    confidence: number;                 // 0-100
    freshness: {
      oldest_data: string;
      newest_data: string;
    };
  };
  
  explanation?: {
    what_this_shows: string;
    what_this_does_not_show: string[];
    methodology_notes: string[];
    limitations: string[];
  };
  
  warnings?: string[];
  errors?: string[];
}

// =============================================================================
// QUERY EXAMPLES
// =============================================================================

export const QUERY_EXAMPLES: { name: string; description: string; query: InfinityQuery }[] = [
  {
    name: 'Basic GDP comparison',
    description: 'Compare GDP per capita across Nordic countries over 10 years',
    query: {
      what: [{ type: 'kpi', id: 'economy.gdp_per_capita_ppp' }],
      where: [{ type: 'country', codes: ['SE', 'NO', 'DK', 'FI', 'IS'] }],
      when: { start: '-10Y', end: 'latest', granularity: 'year' },
      output: { format: 'chart_json', include: { metadata: true, uncertainty: true } },
    },
  },
  {
    name: 'Life expectancy by sex',
    description: 'Life expectancy trends split by sex for EU countries',
    query: {
      what: [{ type: 'kpi', id: 'health.life_expectancy_at_birth' }],
      where: [{ type: 'region', codes: ['EU27'] }],
      when: { start: '2000', end: 'latest', granularity: 'year' },
      who: { sex: ['male', 'female'] },
      output: { format: 'json', include: { explanation: true } },
    },
  },
  {
    name: 'Growth calculation',
    description: 'Calculate 5-year CAGR for unemployment rate',
    query: {
      what: [{ type: 'kpi', id: 'economy.unemployment_rate' }],
      where: [{ type: 'country', codes: ['US', 'GB', 'DE', 'FR'] }],
      when: { start: '-5Y', end: 'latest', granularity: 'year' },
      ops: [{ op: 'growth', params: { type: 'cagr', periods: 5 } }],
      output: { format: 'table', sort: { by: 'growth_rate', order: 'desc' } },
    },
  },
  {
    name: 'Correlation analysis',
    description: 'Correlate education spending with PISA scores',
    query: {
      what: [{ type: 'kpi', id: 'education.spending_per_student' }],
      where: [{ type: 'region', codes: ['OECD'] }],
      when: { start: '2010', end: 'latest', granularity: 'year' },
      ops: [
        { op: 'correlate', params: { with: 'education.pisa_math_score', method: 'pearson', lag: 3 } },
      ],
      output: { format: 'json', include: { explanation: true, uncertainty: true } },
    },
  },
  {
    name: 'Index with subcomponents',
    description: 'Global Master Index with pillar breakdown',
    query: {
      what: [
        { type: 'index', id: 'gmi', alias: 'overall' },
        { type: 'index', id: 'gmi.prosperity', alias: 'prosperity' },
        { type: 'index', id: 'gmi.stability', alias: 'stability' },
        { type: 'index', id: 'gmi.sustainability', alias: 'sustainability' },
      ],
      where: [{ type: 'country', codes: ['SE'] }],
      when: { start: '-20Y', end: 'latest', granularity: 'year' },
      output: { format: 'chart_json', include: { metadata: true } },
    },
  },
];

// =============================================================================
// QUERY VALIDATION
// =============================================================================

export function validateQuery(query: InfinityQuery): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // What validation
  if (!query.what || query.what.length === 0) {
    errors.push('Query must specify at least one item in "what"');
  }
  
  // Where validation
  if (!query.where || query.where.length === 0) {
    errors.push('Query must specify at least one location in "where"');
  }
  
  // When validation
  if (!query.when) {
    errors.push('Query must specify time range in "when"');
  } else {
    if (!query.when.start) errors.push('Query must specify start date');
    if (!query.when.end) errors.push('Query must specify end date');
    if (!query.when.granularity) errors.push('Query must specify time granularity');
  }
  
  // Output validation
  if (!query.output) {
    errors.push('Query must specify output format');
  } else {
    if (!query.output.format) errors.push('Query must specify output format type');
  }
  
  return { valid: errors.length === 0, errors };
}

// =============================================================================
// QUERY BUILDER HELPERS
// =============================================================================

export function buildQuery(): QueryBuilder {
  return new QueryBuilder();
}

class QueryBuilder {
  private query: Partial<InfinityQuery> = {};
  
  what(items: WhatClause[]): this {
    this.query.what = items;
    return this;
  }
  
  kpi(id: string, alias?: string): this {
    if (!this.query.what) this.query.what = [];
    this.query.what.push({ type: 'kpi', id, alias });
    return this;
  }
  
  where(clauses: WhereClause[]): this {
    this.query.where = clauses;
    return this;
  }
  
  countries(...codes: string[]): this {
    if (!this.query.where) this.query.where = [];
    this.query.where.push({ type: 'country', codes });
    return this;
  }
  
  when(start: string, end: string, granularity: TimeGranularity): this {
    this.query.when = { start, end, granularity };
    return this;
  }
  
  lastYears(years: number): this {
    this.query.when = { start: `-${years}Y`, end: 'latest', granularity: 'year' };
    return this;
  }
  
  who(clause: WhoClause): this {
    this.query.who = clause;
    return this;
  }
  
  ops(operations: OperationClause[]): this {
    this.query.ops = operations;
    return this;
  }
  
  output(format: OutputFormat, options?: Partial<OutputClause>): this {
    this.query.output = { format, ...options };
    return this;
  }
  
  build(): InfinityQuery {
    if (!this.query.output) {
      this.query.output = { format: 'json' };
    }
    return this.query as InfinityQuery;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const QUERY_DSL_VERSION = '1.0.0';
