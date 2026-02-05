 /**
  * CANONICAL DATA CORE OPERATIONS
  * 
  * Rules:
  * - Append-only
  * - No UPDATE
  * - No DELETE
  * - Only: INSERT, SUPERSEDE (with new version)
  * 
  * History is sacred.
  */
 
 import type { AnyBaseObject, BaseObjectFields } from '../ontology/base-objects';
 
 // =============================================================================
 // ALLOWED OPERATIONS
 // =============================================================================
 
 export type AllowedOperation = 'INSERT' | 'SUPERSEDE';
 
 export type ForbiddenOperation = 'UPDATE' | 'DELETE' | 'MODIFY' | 'OVERWRITE';
 
 export const ALLOWED_OPERATIONS: readonly AllowedOperation[] = ['INSERT', 'SUPERSEDE'] as const;
 
 export const FORBIDDEN_OPERATIONS: readonly ForbiddenOperation[] = [
   'UPDATE',
   'DELETE', 
   'MODIFY',
   'OVERWRITE',
 ] as const;
 
 // =============================================================================
 // OPERATION RESULTS
 // =============================================================================
 
 export interface OperationResult {
   success: boolean;
   operation: AllowedOperation;
   objectId: string;
   timestamp: string;
   version: number;
   error?: string;
 }
 
 export interface SupersedeResult extends OperationResult {
   operation: 'SUPERSEDE';
   previousVersion: number;
   previousObjectId: string;
 }
 
 // =============================================================================
 // IMMUTABLE RECORD
 // =============================================================================
 
 export interface ImmutableRecord<T extends BaseObjectFields> {
   /** Internal version number (auto-incremented) */
   _version: number;
   
   /** ID of the record this supersedes (null if first) */
   _supersedes: string | null;
   
   /** ID of the record that supersedes this (null if current) */
   _superseded_by: string | null;
   
   /** When this record was inserted */
   _inserted_at: string;
   
   /** The actual data */
   data: T;
 }
 
 // =============================================================================
 // DATA STORE INTERFACE
 // =============================================================================
 
 export interface CanonicalDataStore {
   /**
    * INSERT - Add new object to the store
    * Only allowed operation for new data
    */
   insert(object: AnyBaseObject): Promise<OperationResult>;
   
   /**
    * SUPERSEDE - Create new version that supersedes existing
    * Creates new record, marks old as superseded
    */
   supersede(existingId: string, newObject: AnyBaseObject): Promise<SupersedeResult>;
   
   /**
    * READ - Get current version of an object
    */
   get(id: string): Promise<ImmutableRecord<AnyBaseObject> | null>;
   
   /**
    * READ - Get all versions of an object
    */
   getHistory(id: string): Promise<ImmutableRecord<AnyBaseObject>[]>;
   
   /**
    * READ - Get object at specific point in time
    */
   getAsOf(id: string, timestamp: string): Promise<ImmutableRecord<AnyBaseObject> | null>;
 }
 
 // =============================================================================
 // OPERATION GUARDS
 // =============================================================================
 
 /**
  * Throws if operation is forbidden
  */
 export function assertAllowedOperation(operation: string): asserts operation is AllowedOperation {
   if (FORBIDDEN_OPERATIONS.includes(operation as ForbiddenOperation)) {
     throw new Error(
       `CONSTITUTIONAL VIOLATION: Operation "${operation}" is forbidden. ` +
       `Only ${ALLOWED_OPERATIONS.join(', ')} are permitted.`
     );
   }
   
   if (!ALLOWED_OPERATIONS.includes(operation as AllowedOperation)) {
     throw new Error(
       `Unknown operation: "${operation}". ` +
       `Only ${ALLOWED_OPERATIONS.join(', ')} are permitted.`
     );
   }
 }
 
 /**
  * Validate that a supersede operation is valid
  */
 export function validateSupersede(
   existing: ImmutableRecord<AnyBaseObject>,
   replacement: AnyBaseObject
 ): { valid: boolean; errors: string[] } {
   const errors: string[] = [];
   
   // Must be same type
   if (existing.data.type !== replacement.type) {
     errors.push(`Type mismatch: cannot supersede ${existing.data.type} with ${replacement.type}`);
   }
   
   // Schema version must be >= existing
   const existingVersion = existing.data.schema_version.split('.').map(Number);
   const newVersion = replacement.schema_version.split('.').map(Number);
   
   if (newVersion[0] < existingVersion[0]) {
     errors.push('Cannot supersede with older major schema version');
   }
   
   // Must have valid_from >= existing valid_from
   if (new Date(replacement.valid_from) < new Date(existing.data.valid_from)) {
     errors.push('Cannot supersede with earlier valid_from');
   }
   
   return {
     valid: errors.length === 0,
     errors,
   };
 }