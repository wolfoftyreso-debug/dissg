 /**
  * FORMAL QUERY-DSL MODULE
  * 
  * A language where AI CANNOT ask wrong questions
  * without being stopped.
  * 
  * STRUCTURE (FIXED):
  * - WHAT: indicators to retrieve
  * - WHERE: geographic scope (REQUIRED)
  * - WHEN: time interval (REQUIRED)
  * - WHO: demographic scope (optional)
  * - OPS: operations to perform
  * - OUTPUT: format specification
  * 
  * PRINCIPLES:
  * 1. No implicit geography (WHERE is required)
  * 2. No implicit time (WHEN is required)
  * 3. No implicit definitions (version must be explicit)
  * 4. No implicit units (unit spec is required)
  * 5. No implicit aggregation (permission required)
  * 6. All queries are auditable (intent required)
  */
 
 // Types
 export type {
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
   AggregationMethod,
   FilterCondition,
   TransformMethod,
   ComparisonBaseline,
   CorrelationMethod,
   DemographicDimension,
   QueryResult,
   ResultData,
   ResultMetadata,
   QueryWarning,
   SourceInfo,
   DefinitionInfo,
   MethodologyInfo,
 } from './query-types';
 
 // Validator
 export {
   validateQuery,
   formatValidationErrors,
   VALIDATION_ERRORS,
   type ValidationResult,
   type ValidationError,
   type ValidationWarning,
 } from './query-validator';
 
 // Executor
 export {
   executeQuery,
   type ExecutionContext,
   type ExecutionResult,
   type ExecutionError,
   type DataSource,
   type Definition,
   type AggregationPermission,
   type ExecutionOptions,
 } from './query-executor';
 
 // Builder
 export {
   QueryBuilder,
   createQuery,
   indicator,
   year,
   yearMonth,
   yearQuarter,
   type IndicatorSpec,
 } from './query-builder';
 
 // Blocker
 export {
   checkBlockRules,
   addBlockRule,
   getBlockRules,
   formatBlockResult,
   type BlockResult,
   type BlockReason,
   type BlockCategory,
   type BlockContext,
 } from './query-blocker';
 
 /**
  * MODULE VERSION
  */
 export const QUERY_DSL_VERSION = '1.0.0' as const;
 
 /**
  * QUERY DSL INVARIANTS
  * 
  * These can never be violated:
  */
 export const QUERY_DSL_INVARIANTS = {
   noImplicitGeography: 'WHERE clause is always required. No default geography.',
   noImplicitTime: 'WHEN clause is always required. No default time period.',
   noImplicitDefinition: 'Definition version must be explicit. No assumption of "current".',
   noImplicitUnit: 'Unit specification is required. No guessing of units.',
   noImplicitAggregation: 'Aggregation requires explicit permission. No silent aggregation.',
   allQueriesAuditable: 'Intent declaration is required. All queries leave audit trail.',
   uncertaintyMandatory: 'Complex queries must include uncertainty. No "clean" results.',
 } as const;