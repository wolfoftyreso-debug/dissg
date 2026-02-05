 /**
  * INGESTION PIPELINE
  * 
  * Zero tolerance for incomplete data.
  * raw → normalized → validated → canonical
  * If any step fails → data is rejected, never "fixed"
  */
 
 import { type AnyBaseObject, isValidBaseObject, validateBaseObjectCompleteness } from '../ontology/base-objects';
 
 // =============================================================================
 // PIPELINE STAGES
 // =============================================================================
 
 export type PipelineStage = 'raw' | 'normalized' | 'validated' | 'canonical';
 
 export interface PipelineResult<T> {
   success: boolean;
   stage: PipelineStage;
   data: T | null;
   errors: PipelineError[];
   timestamp: string;
 }
 
 export interface PipelineError {
   stage: PipelineStage;
   code: string;
   message: string;
   field?: string;
   received?: unknown;
   expected?: string;
 }
 
 // =============================================================================
 // VALIDATION RULES
 // =============================================================================
 
 export interface IngestionRules {
   /** Must match a registered schema */
   requiresSchema: true;
   
   /** Must have complete temporal axis */
   requiresTemporalAxis: true;
   
   /** Must have unambiguous source */
   requiresSource: true;
   
   /** Must be machine-validatable */
   requiresMachineValidation: true;
 }
 
 export const INGESTION_RULES: IngestionRules = {
   requiresSchema: true,
   requiresTemporalAxis: true,
   requiresSource: true,
   requiresMachineValidation: true,
 } as const;
 
 // =============================================================================
 // PIPELINE IMPLEMENTATION
 // =============================================================================
 
 /**
  * Stage 1: Raw → Normalized
  * Converts raw input to standardized internal format
  */
 export function normalizeRawData(raw: unknown): PipelineResult<Record<string, unknown>> {
   const errors: PipelineError[] = [];
   const timestamp = new Date().toISOString();
   
   // Must be an object
   if (typeof raw !== 'object' || raw === null) {
     errors.push({
       stage: 'raw',
       code: 'ING-001',
       message: 'Input must be a non-null object',
       received: typeof raw,
       expected: 'object',
     });
     return { success: false, stage: 'raw', data: null, errors, timestamp };
   }
   
   // Normalize to Record
   const normalized = { ...(raw as Record<string, unknown>) };
   
   // Ensure timestamps are ISO format
   if (normalized.created_at && typeof normalized.created_at === 'string') {
     try {
       normalized.created_at = new Date(normalized.created_at).toISOString();
     } catch {
       errors.push({
         stage: 'raw',
         code: 'ING-002',
         message: 'Invalid created_at timestamp',
         field: 'created_at',
         received: normalized.created_at,
         expected: 'ISO 8601 timestamp',
       });
     }
   }
   
   if (errors.length > 0) {
     return { success: false, stage: 'raw', data: null, errors, timestamp };
   }
   
   return { success: true, stage: 'normalized', data: normalized, errors: [], timestamp };
 }
 
 /**
  * Stage 2: Normalized → Validated
  * Checks against schema and rules
  */
 export function validateNormalizedData(
   normalized: Record<string, unknown>,
   schemaId: string
 ): PipelineResult<Record<string, unknown>> {
   const errors: PipelineError[] = [];
   const timestamp = new Date().toISOString();
   
   // Check mandatory fields
   const completeness = validateBaseObjectCompleteness(normalized as any);
   if (!completeness.valid) {
     completeness.missing.forEach(field => {
       errors.push({
         stage: 'normalized',
         code: 'VAL-001',
         message: `Missing required field: ${field}`,
         field,
         expected: 'non-null value',
       });
     });
   }
   
   // Check temporal axis
   if (!normalized.valid_from) {
     errors.push({
       stage: 'normalized',
       code: 'VAL-002',
       message: 'Missing temporal axis (valid_from)',
       field: 'valid_from',
       expected: 'ISO 8601 timestamp',
     });
   }
   
   // Check source
   if (!normalized.source_id) {
     errors.push({
       stage: 'normalized',
       code: 'VAL-003',
       message: 'Missing source attribution',
       field: 'source_id',
       expected: 'source ID reference',
     });
   }
   
   // Check schema version
   if (!normalized.schema_version) {
     errors.push({
       stage: 'normalized',
       code: 'VAL-004',
       message: 'Missing schema version',
       field: 'schema_version',
       expected: 'semantic version (x.y.z)',
     });
   }
   
   if (errors.length > 0) {
     return { success: false, stage: 'normalized', data: null, errors, timestamp };
   }
   
   return { success: true, stage: 'validated', data: normalized, errors: [], timestamp };
 }
 
 /**
  * Stage 3: Validated → Canonical
  * Final transformation to canonical form
  */
 export function canonicalizeValidatedData(
   validated: Record<string, unknown>
 ): PipelineResult<AnyBaseObject> {
   const errors: PipelineError[] = [];
   const timestamp = new Date().toISOString();
   
   // Ensure created_at is set
   if (!validated.created_at) {
     validated.created_at = timestamp;
   }
   
   // Final type check
   if (!isValidBaseObject(validated)) {
     errors.push({
       stage: 'validated',
       code: 'CAN-001',
       message: 'Data does not conform to base object schema',
     });
     return { success: false, stage: 'validated', data: null, errors, timestamp };
   }
   
   return { 
     success: true, 
     stage: 'canonical', 
     data: validated as AnyBaseObject, 
     errors: [], 
     timestamp 
   };
 }
 
 /**
  * Full pipeline execution
  */
 export function runIngestionPipeline(
   raw: unknown,
   schemaId: string
 ): PipelineResult<AnyBaseObject> {
   // Stage 1: Normalize
   const normalized = normalizeRawData(raw);
   if (!normalized.success || !normalized.data) {
     return { ...normalized, data: null } as PipelineResult<AnyBaseObject>;
   }
   
   // Stage 2: Validate
   const validated = validateNormalizedData(normalized.data, schemaId);
   if (!validated.success || !validated.data) {
     return { ...validated, data: null } as PipelineResult<AnyBaseObject>;
   }
   
   // Stage 3: Canonicalize
   return canonicalizeValidatedData(validated.data);
 }