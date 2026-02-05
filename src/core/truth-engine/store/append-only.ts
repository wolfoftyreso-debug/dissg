 /**
  * TRUTH ENGINE - APPEND-ONLY CORE STORE
  * 
  * Fundamental law: No delete. No update.
  * 
  * Allowed operations: CREATE, READ, SUPERSEDE
  * Forbidden operations: UPDATE, DELETE
  */
 
 import type { CoreObject, BaseClass } from '../core/ontology';
 import { enforceInvariants } from '../core/invariants';
 import { isValidId } from '../core/ids';
 
 /**
  * STORE STATE (in-memory for now, would be persistent in production)
  */
 interface StoreState {
   objects: Map<string, CoreObject>;
   writeLog: WriteLogEntry[];
 }
 
 interface WriteLogEntry {
   readonly id: string;
   readonly operation: 'CREATE' | 'SUPERSEDE';
   readonly timestamp: string;
   readonly writer: string;
   readonly object_hash: string;
 }
 
 const state: StoreState = {
   objects: new Map(),
   writeLog: [],
 };
 
 /**
  * ALLOWED OPERATIONS
  */
 type AllowedOperation = 'CREATE' | 'READ' | 'SUPERSEDE';
 
 /**
  * WRITE RESULT
  */
 export interface WriteResult {
   readonly success: boolean;
   readonly operation: AllowedOperation;
   readonly id: string;
   readonly timestamp: string;
   readonly error?: string;
 }
 
 /**
  * CREATE - Write new object (only if ID doesn't exist)
  */
 export function create(obj: CoreObject, writer: string): WriteResult {
   const timestamp = new Date().toISOString();
   
   // Enforce all invariants BEFORE write
   try {
     enforceInvariants(obj);
   } catch (error) {
     return {
       success: false,
       operation: 'CREATE',
       id: obj.id,
       timestamp,
       error: error instanceof Error ? error.message : 'Unknown invariant violation',
     };
   }
   
   // Check for duplicate ID (no overwrites)
   if (state.objects.has(obj.id)) {
     return {
       success: false,
       operation: 'CREATE',
       id: obj.id,
       timestamp,
       error: 'FORBIDDEN: Object with this ID already exists. Use SUPERSEDE instead.',
     };
   }
   
   // Validate ID format
   if (!isValidId(obj.id)) {
     return {
       success: false,
       operation: 'CREATE',
       id: obj.id,
       timestamp,
       error: 'INVALID: ID format is incorrect',
     };
   }
   
   // Write to store
   state.objects.set(obj.id, Object.freeze(obj)); // Immutable
   
   // Log the write
   state.writeLog.push({
     id: obj.id,
     operation: 'CREATE',
     timestamp,
     writer,
     object_hash: hashObject(obj),
   });
   
   return {
     success: true,
     operation: 'CREATE',
     id: obj.id,
     timestamp,
   };
 }
 
 /**
  * READ - Get object by ID
  */
 export function read(id: string): CoreObject | null {
   return state.objects.get(id) || null;
 }
 
 /**
  * READ ALL - Get all objects of a type
  */
 export function readAll(baseClass?: BaseClass): CoreObject[] {
   const all = Array.from(state.objects.values());
   if (!baseClass) return all;
   return all.filter(obj => obj.baseClass === baseClass);
 }
 
 /**
  * EXISTS - Check if ID exists
  */
 export function exists(id: string): boolean {
   return state.objects.has(id);
 }
 
 /**
  * GET WRITE LOG - Audit trail
  */
 export function getWriteLog(): readonly WriteLogEntry[] {
   return Object.freeze([...state.writeLog]);
 }
 
 /**
  * FORBIDDEN OPERATIONS - These throw immediately
  */
 export function update(): never {
   throw new Error('FORBIDDEN: UPDATE operation is not permitted. Truth Engine is append-only.');
 }
 
 export function deleteObject(): never {
   throw new Error('FORBIDDEN: DELETE operation is not permitted. Truth Engine is append-only.');
 }
 
 /**
  * HASH OBJECT (for audit log)
  */
 function hashObject(obj: CoreObject): string {
   const str = JSON.stringify(obj, Object.keys(obj).sort());
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
     const char = str.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash;
   }
   return Math.abs(hash).toString(16).padStart(8, '0');
 }
 
 /**
  * STORE STATS
  */
 export function getStats(): {
   totalObjects: number;
   objectsByClass: Record<string, number>;
   totalWrites: number;
 } {
   const objects = Array.from(state.objects.values());
   const byClass: Record<string, number> = {};
   
   for (const obj of objects) {
     byClass[obj.baseClass] = (byClass[obj.baseClass] || 0) + 1;
   }
   
   return {
     totalObjects: objects.length,
     objectsByClass: byClass,
     totalWrites: state.writeLog.length,
   };
 }
 
 /**
  * CLEAR STORE (for testing only - would not exist in production)
  */
 export function _clearForTesting(): void {
   state.objects.clear();
   state.writeLog.length = 0;
 }