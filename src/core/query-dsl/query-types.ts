 /**
  * FORMAL QUERY-DSL TYPES
  * 
  * A language where AI CANNOT ask wrong questions
  * without being stopped.
  * 
  * PRINCIPLE: The query structure makes errors
  * syntactically or semantically impossible.
  */
 
 /**
  * QUERY STRUCTURE (FIXED)
  * 
  * Every query MUST have:
  * - what: indicators to retrieve
  * - where: geographic scope
  * - when: time interval
  * - who: demographic scope (optional)
  * - ops: operations to perform
  * - output: format specification
  */
 export interface Query {
   /** Query identifier */
   id: string;
   
   /** Query version for reproducibility */
   version: '1.0';
   
   /** Timestamp of query creation */
   createdAt: string;
   
   /** WHAT: Indicators to retrieve */
   what: WhatClause;
   
   /** WHERE: Geographic scope (REQUIRED) */
   where: WhereClause;
   
   /** WHEN: Time interval (REQUIRED) */
   when: WhenClause;
   
   /** WHO: Demographic scope (optional) */
   who?: WhoClause;
   
   /** OPS: Operations to perform */
   ops?: OpsClause;
   
   /** OUTPUT: Format specification */
   output: OutputClause;
   
   /** Declaration of intent (for audit) */
   intent: QueryIntent;
 }
 
 /**
  * WHAT CLAUSE
  */
 export interface WhatClause {
   /** Indicator codes to retrieve */
   indicators: IndicatorRef[];
   
   /** Required: explicit definition version */
   definitionVersion: 'current' | 'as_of_date' | 'specific';
   
   /** If definitionVersion is 'as_of_date' */
   definitionAsOfDate?: string;
   
   /** If definitionVersion is 'specific' */
   definitionIds?: string[];
 }
 
 export interface IndicatorRef {
   /** Indicator code */
   code: string;
   
   /** Required: unit specification */
   unit: UnitSpec;
   
   /** Required: aggregation method if multiple values */
   aggregation?: AggregationMethod;
 }
 
 export interface UnitSpec {
   /** Base unit */
   base: string;
   
   /** Scale (e.g., 'per_100k', 'per_capita', 'absolute') */
   scale: 'absolute' | 'per_capita' | 'per_100k' | 'per_million' | 'percentage' | 'index';
   
   /** Currency code if monetary */
   currency?: string;
   
   /** Adjustment (e.g., 'nominal', 'real', 'ppp') */
   adjustment?: 'nominal' | 'real' | 'ppp';
   
   /** Base year for real/ppp adjustment */
   baseYear?: number;
 }
 
 export type AggregationMethod = 
   | 'sum'
   | 'mean'
   | 'median'
   | 'weighted_mean'
   | 'min'
   | 'max'
   | 'count'
   | 'none'; // No aggregation - return all values
 
 /**
  * WHERE CLAUSE (REQUIRED - no implicit geography)
  */
 export interface WhereClause {
   /** Geographic level */
   level: GeoLevel;
   
   /** Geographic codes */
   codes: string[];
   
   /** Include or exclude */
   mode: 'include' | 'exclude';
   
   /** Boundary version (borders change!) */
   boundaryVersion: 'current' | 'as_of_date' | 'specific';
   
   /** If boundaryVersion is 'as_of_date' */
   boundaryAsOfDate?: string;
 }
 
 export type GeoLevel = 
   | 'global'
   | 'continent'
   | 'region'
   | 'country'
   | 'nuts1'
   | 'nuts2'
   | 'nuts3'
   | 'municipality'
   | 'custom';
 
 /**
  * WHEN CLAUSE (REQUIRED - no implicit time)
  */
 export interface WhenClause {
   /** Time specification type */
   type: 'range' | 'points' | 'latest' | 'all_available';
   
   /** For 'range' type */
   range?: {
     start: TimePoint;
     end: TimePoint;
   };
   
   /** For 'points' type */
   points?: TimePoint[];
   
   /** For 'latest' type - how many periods back */
   latestCount?: number;
   
   /** Granularity of time */
   granularity: TimeGranularity;
   
   /** Alignment requirement */
   alignment: 'strict' | 'nearest' | 'interpolate';
 }
 
 export interface TimePoint {
   year: number;
   month?: number;  // 1-12
   day?: number;    // 1-31
   quarter?: number; // 1-4
 }
 
 export type TimeGranularity = 
   | 'day'
   | 'week'
   | 'month'
   | 'quarter'
   | 'year'
   | 'decade'
   | 'century';
 
 /**
  * WHO CLAUSE (demographic scope)
  */
 export interface WhoClause {
   /** Demographic dimensions */
   dimensions: DemographicDimension[];
   
   /** Combination mode */
   mode: 'intersection' | 'union';
 }
 
 export interface DemographicDimension {
   type: 'age' | 'sex' | 'education' | 'income' | 'occupation' | 'ethnicity' | 'custom';
   values: string[];
   definitionId?: string; // Required for 'custom'
 }
 
 /**
  * OPS CLAUSE (operations)
  */
 export interface OpsClause {
   /** Operations to perform in order */
   operations: Operation[];
 }
 
 export type Operation =
   | { type: 'filter'; condition: FilterCondition }
   | { type: 'transform'; method: TransformMethod }
   | { type: 'aggregate'; method: AggregationMethod; over: 'time' | 'geography' | 'demographic' }
   | { type: 'compare'; baseline: ComparisonBaseline }
   | { type: 'correlate'; with: IndicatorRef; method: CorrelationMethod };
 
 export interface FilterCondition {
   field: string;
   operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in';
   value: unknown;
 }
 
 export type TransformMethod =
   | 'normalize_0_100'
   | 'z_score'
   | 'log'
   | 'sqrt'
   | 'diff'
   | 'pct_change'
   | 'rolling_mean'
   | 'cumulative';
 
 export interface ComparisonBaseline {
   type: 'previous_period' | 'specific_period' | 'reference_value' | 'peer_group';
   period?: TimePoint;
   value?: number;
   peerGroup?: string[];
 }
 
 export type CorrelationMethod = 'pearson' | 'spearman' | 'kendall';
 
 /**
  * OUTPUT CLAUSE
  */
 export interface OutputClause {
   /** Output format */
   format: 'json' | 'csv' | 'jsonld' | 'sdmx';
   
   /** Include metadata */
   metadata: {
     sources: boolean;
     definitions: boolean;
     methodology: boolean;
     uncertainty: boolean;
     caveats: boolean;
   };
   
   /** Uncertainty requirements */
   uncertainty: {
     required: boolean;
     type: 'confidence_interval' | 'standard_error' | 'range' | 'qualitative';
     level?: number; // e.g., 95 for 95% CI
   };
   
   /** Pagination */
   pagination?: {
     limit: number;
     offset: number;
   };
 }
 
 /**
  * QUERY INTENT (for audit trail)
  */
 export interface QueryIntent {
   /** Purpose of the query */
   purpose: 'exploration' | 'verification' | 'publication' | 'decision_support' | 'research';
   
   /** Usage context */
   context: string;
   
   /** Acknowledgment of limitations */
   acknowledgedLimitations: boolean;
 }
 
 /**
  * QUERY RESULT
  */
 export interface QueryResult {
   /** Original query */
   query: Query;
   
   /** Execution metadata */
   execution: {
     startedAt: string;
     completedAt: string;
     durationMs: number;
     dataVersion: string;
   };
   
   /** Result data */
   data: ResultData[];
   
   /** Metadata as requested */
   metadata: ResultMetadata;
   
   /** Warnings and caveats */
   warnings: QueryWarning[];
   
   /** Hash for reproducibility */
   resultHash: string;
 }
 
 export interface ResultData {
   indicator: string;
   geography: string;
   time: string;
   value: number | null;
   uncertainty?: {
     lower: number;
     upper: number;
     type: string;
   };
   flags?: string[];
 }
 
 export interface ResultMetadata {
   sources?: SourceInfo[];
   definitions?: DefinitionInfo[];
   methodology?: MethodologyInfo;
   caveats?: string[];
 }
 
 export interface SourceInfo {
   id: string;
   name: string;
   reliability: number;
   lastUpdated: string;
 }
 
 export interface DefinitionInfo {
   id: string;
   version: number;
   text: string;
   validFrom: string;
   validTo?: string;
 }
 
 export interface MethodologyInfo {
   collection: string;
   processing: string;
   limitations: string[];
 }
 
 export interface QueryWarning {
   code: string;
   severity: 'info' | 'warning' | 'critical';
   message: string;
   affectedFields?: string[];
 }