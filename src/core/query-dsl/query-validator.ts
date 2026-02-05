 /**
  * QUERY VALIDATOR
  * 
  * Ensures AI cannot ask wrong questions.
  * Validation happens BEFORE execution.
  * Invalid queries are REJECTED, not fixed.
  */
 
 import type { 
   Query, 
   WhatClause, 
   WhereClause, 
   WhenClause,
   IndicatorRef,
   UnitSpec,
   OpsClause,
   Operation
 } from './query-types';
 
 /**
  * VALIDATION RESULT
  */
 export interface ValidationResult {
   valid: boolean;
   errors: ValidationError[];
   warnings: ValidationWarning[];
   suggestions: string[];
 }
 
 export interface ValidationError {
   code: string;
   path: string;
   message: string;
   severity: 'fatal' | 'blocking';
 }
 
 export interface ValidationWarning {
   code: string;
   path: string;
   message: string;
 }
 
 /**
  * VALIDATION ERROR CODES
  */
 export const VALIDATION_ERRORS = {
   // Structure errors
   MISSING_WHAT: 'QV-001',
   MISSING_WHERE: 'QV-002',
   MISSING_WHEN: 'QV-003',
   MISSING_OUTPUT: 'QV-004',
   MISSING_INTENT: 'QV-005',
   
   // What clause errors
   EMPTY_INDICATORS: 'QV-101',
   MISSING_DEFINITION_VERSION: 'QV-102',
   MISSING_UNIT_SPEC: 'QV-103',
   INCOMPATIBLE_UNITS: 'QV-104',
   AMBIGUOUS_INDICATOR: 'QV-105',
   
   // Where clause errors
   IMPLICIT_GEOGRAPHY: 'QV-201',
   INVALID_GEO_LEVEL: 'QV-202',
   EMPTY_GEO_CODES: 'QV-203',
   MISSING_BOUNDARY_VERSION: 'QV-204',
   INCOMPATIBLE_GEO_LEVELS: 'QV-205',
   
   // When clause errors
   IMPLICIT_TIME: 'QV-301',
   INVALID_TIME_RANGE: 'QV-302',
   MISSING_GRANULARITY: 'QV-303',
   CROSS_DEFINITION_TIME: 'QV-304',
   
   // Ops clause errors
   INVALID_AGGREGATION: 'QV-401',
   INCOMPATIBLE_COMPARISON: 'QV-402',
   MISSING_AGGREGATION_PERMISSION: 'QV-403',
   
   // Output clause errors
   UNCERTAINTY_REQUIRED: 'QV-501',
   MISSING_METADATA_ACK: 'QV-502',
   
   // Intent errors
   LIMITATIONS_NOT_ACKNOWLEDGED: 'QV-601',
 } as const;
 
 /**
  * VALIDATE QUERY
  * 
  * Returns validation result. Invalid queries are REJECTED.
  */
 export function validateQuery(query: Query): ValidationResult {
   const errors: ValidationError[] = [];
   const warnings: ValidationWarning[] = [];
   const suggestions: string[] = [];
   
   // Structure validation
   validateStructure(query, errors);
   
   if (errors.length > 0) {
     return { valid: false, errors, warnings, suggestions };
   }
   
   // What clause validation
   validateWhatClause(query.what, errors, warnings);
   
   // Where clause validation
   validateWhereClause(query.where, errors, warnings);
   
   // When clause validation
   validateWhenClause(query.when, errors, warnings);
   
   // Ops clause validation (if present)
   if (query.ops) {
     validateOpsClause(query.ops, query.what, errors, warnings, suggestions);
   }
   
   // Output clause validation
   validateOutputClause(query.output, errors, warnings);
   
   // Intent validation
   validateIntent(query.intent, errors);
   
   // Cross-clause validation
   validateCrossClauses(query, errors, warnings, suggestions);
   
   return {
     valid: errors.length === 0,
     errors,
     warnings,
     suggestions,
   };
 }
 
 /**
  * STRUCTURE VALIDATION
  */
 function validateStructure(query: Query, errors: ValidationError[]): void {
   if (!query.what) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_WHAT,
       path: 'what',
       message: 'WHAT clause is required. Specify which indicators to retrieve.',
       severity: 'fatal',
     });
   }
   
   if (!query.where) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_WHERE,
       path: 'where',
       message: 'WHERE clause is required. No implicit geography allowed.',
       severity: 'fatal',
     });
   }
   
   if (!query.when) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_WHEN,
       path: 'when',
       message: 'WHEN clause is required. No implicit time allowed.',
       severity: 'fatal',
     });
   }
   
   if (!query.output) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_OUTPUT,
       path: 'output',
       message: 'OUTPUT clause is required. Specify output format and metadata requirements.',
       severity: 'fatal',
     });
   }
   
   if (!query.intent) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_INTENT,
       path: 'intent',
       message: 'INTENT declaration is required for audit trail.',
       severity: 'fatal',
     });
   }
 }
 
 /**
  * WHAT CLAUSE VALIDATION
  */
 function validateWhatClause(
   what: WhatClause,
   errors: ValidationError[],
   warnings: ValidationWarning[]
 ): void {
   if (!what.indicators || what.indicators.length === 0) {
     errors.push({
       code: VALIDATION_ERRORS.EMPTY_INDICATORS,
       path: 'what.indicators',
       message: 'At least one indicator must be specified.',
       severity: 'fatal',
     });
     return;
   }
   
   if (!what.definitionVersion) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_DEFINITION_VERSION,
       path: 'what.definitionVersion',
       message: 'Definition version must be explicit. Choose: current, as_of_date, or specific.',
       severity: 'blocking',
     });
   }
   
   // Validate each indicator
   for (let i = 0; i < what.indicators.length; i++) {
     const indicator = what.indicators[i];
     validateIndicatorRef(indicator, `what.indicators[${i}]`, errors, warnings);
   }
   
   // Check for unit compatibility if multiple indicators
   if (what.indicators.length > 1) {
     const unitTypes = new Set(what.indicators.map(i => i.unit?.scale));
     if (unitTypes.size > 1) {
       warnings.push({
         code: VALIDATION_ERRORS.INCOMPATIBLE_UNITS,
         path: 'what.indicators',
         message: `Multiple unit types detected: ${[...unitTypes].join(', ')}. Ensure comparability.`,
       });
     }
   }
 }
 
 function validateIndicatorRef(
   ref: IndicatorRef,
   path: string,
   errors: ValidationError[],
   warnings: ValidationWarning[]
 ): void {
   if (!ref.unit) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_UNIT_SPEC,
       path: `${path}.unit`,
       message: 'Unit specification is required. No implicit units allowed.',
       severity: 'blocking',
     });
   } else {
     validateUnitSpec(ref.unit, `${path}.unit`, warnings);
   }
 }
 
 function validateUnitSpec(
   unit: UnitSpec,
   path: string,
   warnings: ValidationWarning[]
 ): void {
   // Check for monetary units without currency
   if (['gdp', 'income', 'expenditure'].some(t => unit.base.toLowerCase().includes(t))) {
     if (!unit.currency) {
       warnings.push({
         code: 'QV-103-WARN',
         path,
         message: 'Monetary indicator without currency specification.',
       });
     }
     if (!unit.adjustment) {
       warnings.push({
         code: 'QV-103-WARN',
         path,
         message: 'Monetary indicator without adjustment (nominal/real/ppp) specification.',
       });
     }
   }
 }
 
 /**
  * WHERE CLAUSE VALIDATION
  */
 function validateWhereClause(
   where: WhereClause,
   errors: ValidationError[],
   warnings: ValidationWarning[]
 ): void {
   if (!where.level) {
     errors.push({
       code: VALIDATION_ERRORS.INVALID_GEO_LEVEL,
       path: 'where.level',
       message: 'Geographic level must be explicit.',
       severity: 'blocking',
     });
   }
   
   if (!where.codes || where.codes.length === 0) {
     // Exception for 'global' level
     if (where.level !== 'global') {
       errors.push({
         code: VALIDATION_ERRORS.EMPTY_GEO_CODES,
         path: 'where.codes',
         message: 'Geographic codes are required (except for global level).',
         severity: 'blocking',
       });
     }
   }
   
   if (!where.boundaryVersion) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_BOUNDARY_VERSION,
       path: 'where.boundaryVersion',
       message: 'Boundary version is required. Borders change over time.',
       severity: 'blocking',
     });
   }
 }
 
 /**
  * WHEN CLAUSE VALIDATION
  */
 function validateWhenClause(
   when: WhenClause,
   errors: ValidationError[],
   warnings: ValidationWarning[]
 ): void {
   if (!when.type) {
     errors.push({
       code: VALIDATION_ERRORS.IMPLICIT_TIME,
       path: 'when.type',
       message: 'Time type must be explicit. Choose: range, points, latest, or all_available.',
       severity: 'blocking',
     });
   }
   
   if (when.type === 'range' && (!when.range?.start || !when.range?.end)) {
     errors.push({
       code: VALIDATION_ERRORS.INVALID_TIME_RANGE,
       path: 'when.range',
       message: 'Time range requires both start and end.',
       severity: 'blocking',
     });
   }
   
   if (!when.granularity) {
     errors.push({
       code: VALIDATION_ERRORS.MISSING_GRANULARITY,
       path: 'when.granularity',
       message: 'Time granularity is required.',
       severity: 'blocking',
     });
   }
   
   // Warn about long time ranges
   if (when.type === 'range' && when.range) {
     const yearSpan = when.range.end.year - when.range.start.year;
     if (yearSpan > 30) {
       warnings.push({
         code: 'QV-304-WARN',
         path: 'when.range',
         message: `Query spans ${yearSpan} years. Definition and methodology changes are likely.`,
       });
     }
   }
 }
 
 /**
  * OPS CLAUSE VALIDATION
  */
 function validateOpsClause(
   ops: OpsClause,
   what: WhatClause,
   errors: ValidationError[],
   warnings: ValidationWarning[],
   suggestions: string[]
 ): void {
   for (let i = 0; i < ops.operations.length; i++) {
     const op = ops.operations[i];
     validateOperation(op, `ops.operations[${i}]`, what, errors, warnings, suggestions);
   }
 }
 
 function validateOperation(
   op: Operation,
   path: string,
   what: WhatClause,
   errors: ValidationError[],
   warnings: ValidationWarning[],
   suggestions: string[]
 ): void {
   if (op.type === 'aggregate') {
     // Check if aggregation makes sense for the indicators
     if (what.indicators.length > 1) {
       warnings.push({
         code: VALIDATION_ERRORS.INVALID_AGGREGATION,
         path,
         message: 'Aggregating multiple indicators. Ensure they are semantically compatible.',
       });
     }
     
     suggestions.push(
       'Aggregation requires explicit permission. Ensure definition compatibility is verified.'
     );
   }
   
   if (op.type === 'compare') {
     if (!op.baseline) {
       errors.push({
         code: VALIDATION_ERRORS.INCOMPATIBLE_COMPARISON,
         path,
         message: 'Comparison requires explicit baseline specification.',
         severity: 'blocking',
       });
     }
   }
 }
 
 /**
  * OUTPUT CLAUSE VALIDATION
  */
 function validateOutputClause(
   output: Query['output'],
   errors: ValidationError[],
   warnings: ValidationWarning[]
 ): void {
   // Uncertainty is required by default for complex queries
   if (!output.uncertainty?.required) {
     warnings.push({
       code: VALIDATION_ERRORS.UNCERTAINTY_REQUIRED,
       path: 'output.uncertainty',
       message: 'Uncertainty information is not required. Consider enabling for transparency.',
     });
   }
   
   // Metadata should include sources
   if (!output.metadata?.sources) {
     warnings.push({
       code: VALIDATION_ERRORS.MISSING_METADATA_ACK,
       path: 'output.metadata.sources',
       message: 'Source information not requested. Provenance is recommended.',
     });
   }
 }
 
 /**
  * INTENT VALIDATION
  */
 function validateIntent(
   intent: Query['intent'],
   errors: ValidationError[]
 ): void {
   if (!intent.acknowledgedLimitations) {
     errors.push({
       code: VALIDATION_ERRORS.LIMITATIONS_NOT_ACKNOWLEDGED,
       path: 'intent.acknowledgedLimitations',
       message: 'Query must acknowledge that data has limitations.',
       severity: 'blocking',
     });
   }
 }
 
 /**
  * CROSS-CLAUSE VALIDATION
  */
 function validateCrossClauses(
   query: Query,
   errors: ValidationError[],
   warnings: ValidationWarning[],
   suggestions: string[]
 ): void {
   // Check for cross-definition time queries
   if (query.what.definitionVersion === 'current' && query.when.type === 'range') {
     const startYear = query.when.range?.start.year;
     const currentYear = new Date().getFullYear();
     
     if (startYear && currentYear - startYear > 10) {
       warnings.push({
         code: VALIDATION_ERRORS.CROSS_DEFINITION_TIME,
         path: 'what.definitionVersion + when.range',
         message: `Using current definition for data from ${startYear}. Definitions may have changed.`,
       });
       
       suggestions.push(
         'Consider using definitionVersion: "as_of_date" to match historical definitions.'
       );
     }
   }
   
   // Check for global aggregation
   if (query.where.level === 'global' && query.ops?.operations.some(o => o.type === 'aggregate')) {
     warnings.push({
       code: 'QV-GLOBAL-AGG',
       path: 'where.level + ops.aggregate',
       message: 'Global aggregation detected. Ensure cross-country comparability is verified.',
     });
   }
 }
 
 /**
  * FORMAT VALIDATION ERROR MESSAGE
  */
 export function formatValidationErrors(result: ValidationResult): string {
   if (result.valid) {
     return 'Query is valid.';
   }
   
   const lines: string[] = ['Query validation failed:'];
   
   for (const error of result.errors) {
     lines.push(`  [${error.code}] ${error.path}: ${error.message}`);
   }
   
   if (result.warnings.length > 0) {
     lines.push('');
     lines.push('Warnings:');
     for (const warning of result.warnings) {
       lines.push(`  [${warning.code}] ${warning.path}: ${warning.message}`);
     }
   }
   
   if (result.suggestions.length > 0) {
     lines.push('');
     lines.push('Suggestions:');
     for (const suggestion of result.suggestions) {
       lines.push(`  • ${suggestion}`);
     }
   }
   
   return lines.join('\n');
 }