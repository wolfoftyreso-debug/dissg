 /**
  * QUERY BUILDER
  * 
  * Fluent API for constructing valid queries.
  * Makes it easy to build correct queries,
  * hard to build incorrect ones.
  */
 
 import type { 
   Query, 
   WhatClause, 
   WhereClause, 
   WhenClause,
   WhoClause,
   OpsClause,
   OutputClause,
   QueryIntent,
   IndicatorRef,
   UnitSpec,
   TimePoint,
   TimeGranularity,
   GeoLevel,
   Operation,
   AggregationMethod
 } from './query-types';
 
 /**
  * QUERY BUILDER CLASS
  */
 export class QueryBuilder {
   private query: Partial<Query>;
   
   constructor() {
     this.query = {
       id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       version: '1.0',
       createdAt: new Date().toISOString(),
     };
   }
   
   /**
    * WHAT: Specify indicators
    */
   what(indicators: IndicatorSpec[], definitionVersion: WhatClause['definitionVersion']): this {
     this.query.what = {
       indicators: indicators.map(i => ({
         code: i.code,
         unit: i.unit,
         aggregation: i.aggregation,
       })),
       definitionVersion,
     };
     return this;
   }
   
   /**
    * WHERE: Specify geography (REQUIRED)
    */
   where(level: GeoLevel, codes: string[], boundaryVersion: WhereClause['boundaryVersion'] = 'current'): this {
     this.query.where = {
       level,
       codes,
       mode: 'include',
       boundaryVersion,
     };
     return this;
   }
   
   /**
    * WHERE: Global scope
    */
   whereGlobal(): this {
     this.query.where = {
       level: 'global',
       codes: [],
       mode: 'include',
       boundaryVersion: 'current',
     };
     return this;
   }
   
   /**
    * WHEN: Specify time range
    */
   whenRange(start: TimePoint, end: TimePoint, granularity: TimeGranularity): this {
     this.query.when = {
       type: 'range',
       range: { start, end },
       granularity,
       alignment: 'strict',
     };
     return this;
   }
   
   /**
    * WHEN: Specific time points
    */
   whenPoints(points: TimePoint[], granularity: TimeGranularity): this {
     this.query.when = {
       type: 'points',
       points,
       granularity,
       alignment: 'strict',
     };
     return this;
   }
   
   /**
    * WHEN: Latest N periods
    */
   whenLatest(count: number, granularity: TimeGranularity): this {
     this.query.when = {
       type: 'latest',
       latestCount: count,
       granularity,
       alignment: 'strict',
     };
     return this;
   }
   
   /**
    * WHO: Demographic scope
    */
   who(clause: WhoClause): this {
     this.query.who = clause;
     return this;
   }
   
   /**
    * OPS: Add operations
    */
   ops(operations: Operation[]): this {
     this.query.ops = { operations };
     return this;
   }
   
   /**
    * OPS: Add single operation
    */
   addOperation(operation: Operation): this {
     if (!this.query.ops) {
       this.query.ops = { operations: [] };
     }
     this.query.ops.operations.push(operation);
     return this;
   }
   
   /**
    * AGGREGATE: Add aggregation
    */
   aggregate(method: AggregationMethod, over: 'time' | 'geography' | 'demographic'): this {
     return this.addOperation({ type: 'aggregate', method, over });
   }
   
   /**
    * OUTPUT: Specify output format
    */
   output(format: OutputClause['format'], options?: Partial<OutputClause>): this {
     this.query.output = {
       format,
       metadata: {
         sources: true,
         definitions: true,
         methodology: true,
         uncertainty: true,
         caveats: true,
         ...options?.metadata,
       },
       uncertainty: {
         required: true,
         type: 'confidence_interval',
         level: 95,
         ...options?.uncertainty,
       },
       pagination: options?.pagination,
     };
     return this;
   }
   
   /**
    * INTENT: Declare query purpose
    */
   intent(purpose: QueryIntent['purpose'], context: string): this {
     this.query.intent = {
       purpose,
       context,
       acknowledgedLimitations: true,
     };
     return this;
   }
   
   /**
    * BUILD: Construct final query
    */
   build(): Query {
     // Validate required fields
     if (!this.query.what) {
       throw new Error('WHAT clause is required. Use .what() to specify indicators.');
     }
     if (!this.query.where) {
       throw new Error('WHERE clause is required. Use .where() or .whereGlobal().');
     }
     if (!this.query.when) {
       throw new Error('WHEN clause is required. Use .whenRange(), .whenPoints(), or .whenLatest().');
     }
     if (!this.query.output) {
       throw new Error('OUTPUT clause is required. Use .output() to specify format.');
     }
     if (!this.query.intent) {
       throw new Error('INTENT is required. Use .intent() to declare purpose.');
     }
     
     return this.query as Query;
   }
 }
 
 /**
  * INDICATOR SPEC (simplified for builder)
  */
 export interface IndicatorSpec {
   code: string;
   unit: UnitSpec;
   aggregation?: AggregationMethod;
 }
 
 /**
  * HELPER: Create indicator reference
  */
 export function indicator(
   code: string,
   scale: UnitSpec['scale'],
   options?: Partial<UnitSpec>
 ): IndicatorSpec {
   return {
     code,
     unit: {
       base: code,
       scale,
       ...options,
     },
   };
 }
 
 /**
  * HELPER: Create time point
  */
 export function year(y: number): TimePoint {
   return { year: y };
 }
 
 export function yearMonth(y: number, m: number): TimePoint {
   return { year: y, month: m };
 }
 
 export function yearQuarter(y: number, q: number): TimePoint {
   return { year: y, quarter: q };
 }
 
 /**
  * FACTORY: Create new query builder
  */
 export function createQuery(): QueryBuilder {
   return new QueryBuilder();
 }
 
 /**
  * EXAMPLE USAGE
  * 
  * const query = createQuery()
  *   .what([
  *     indicator('unemployment_rate', 'percentage'),
  *     indicator('gdp_per_capita', 'absolute', { currency: 'USD', adjustment: 'ppp' }),
  *   ], 'current')
  *   .where('country', ['SE', 'NO', 'DK', 'FI'])
  *   .whenRange(year(2010), year(2023), 'year')
  *   .aggregate('mean', 'time')
  *   .output('json')
  *   .intent('research', 'Analyzing Nordic labor markets')
  *   .build();
  */