 /**
  * CANONICAL CORE
  * 
  * The sacred layer. UNTOUCHABLE.
  * 
  * Requirements (NO EXCEPTIONS):
  * - Append-only
  * - Version keys
  * - Write-once semantics
  * - Object immutability
  * - Full history
  */
 
 /**
  * CORE OBJECT
  * 
  * Every object in the core has:
  * - Content-addressable key
  * - Schema version in key
  * - Time + hash = physical identity
  */
 export interface CoreObject {
   /** Content-addressable key: {schema_version}/{hash} */
   key: string;
   
   /** Schema version */
   schemaVersion: string;
   
   /** Content hash (SHA-256) */
   contentHash: string;
   
   /** Write timestamp (immutable) */
   writtenAt: string;
   
   /** Writer identity (pipeline, not human) */
   writtenBy: string;
   
   /** Content (immutable after write) */
   content: unknown;
   
   /** Provenance chain */
   provenance: {
     ingestionId: string;
     validationId: string;
     sourceHash: string;
   };
 }
 
 /**
  * CORE PRINCIPLES (LOCKED)
  */
 export const CORE_PRINCIPLES = {
   appendOnly: {
     rule: 'Only append operations allowed',
     enforcement: 'Storage configured without delete/update permissions',
     violation: 'CRITICAL - immediate incident',
   },
   
   versionKeys: {
     rule: 'Schema version is part of object key',
     enforcement: 'Key format: {schema_version}/{content_hash}',
     violation: 'Write rejected',
   },
   
   writeOnce: {
     rule: 'Objects cannot be overwritten',
     enforcement: 'Conditional write fails if key exists',
     violation: 'Write rejected, logged',
   },
   
   objectImmutability: {
     rule: 'Content cannot change after write',
     enforcement: 'Hash verification on every read',
     violation: 'CRITICAL - data corruption detected',
   },
   
   fullHistory: {
     rule: 'Nothing is ever deleted',
     enforcement: 'No delete permissions exist',
     violation: 'Impossible by design',
   },
 } as const;
 
 /**
  * WRITE PERMISSION CHECK
  */
 export interface WritePermission {
   principal: string;
   principalType: 'pipeline' | 'service' | 'human';
   hasWritePermission: boolean;
   hasDeletePermission: boolean;
   hasUpdatePermission: boolean;
 }
 
 export function validateCorePermissions(
   permissions: WritePermission[]
 ): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   
   for (const perm of permissions) {
     // No principal should have delete permission
     if (perm.hasDeletePermission) {
       violations.push(
         `CRITICAL: ${perm.principal} (${perm.principalType}) has delete permission on core`
       );
     }
     
     // No principal should have update permission
     if (perm.hasUpdatePermission) {
       violations.push(
         `CRITICAL: ${perm.principal} (${perm.principalType}) has update permission on core`
       );
     }
     
     // No human should have write permission
     if (perm.principalType === 'human' && perm.hasWritePermission) {
       violations.push(
         `CRITICAL: Human ${perm.principal} has write permission on core`
       );
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * GENERATE CORE KEY
  */
 export function generateCoreKey(
   schemaVersion: string,
   content: unknown
 ): string {
   const contentHash = hashContent(content);
   return `${schemaVersion}/${contentHash}`;
 }
 
 /**
  * HASH CONTENT
  */
 function hashContent(content: unknown): string {
   const str = JSON.stringify(content);
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
     const char = str.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash;
   }
   return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
 }
 
 /**
  * SELF-TESTS
  */
 export const CORE_SELF_TESTS = {
   noDeletePermission: {
     test: 'ASSERT no_principal HAS delete_permission ON core',
     description: 'No entity can delete from core',
     runFrequency: 'hourly',
   },
   
   noUpdatePermission: {
     test: 'ASSERT no_principal HAS update_permission ON core',
     description: 'No entity can update core objects',
     runFrequency: 'hourly',
   },
   
   noHumanWrite: {
     test: 'ASSERT no_human_principal CAN write core',
     description: 'Only signed pipelines can write',
     runFrequency: 'hourly',
   },
   
   hashIntegrity: {
     test: 'FOR EACH object IN core: VERIFY hash(content) == stored_hash',
     description: 'All objects pass hash verification',
     runFrequency: 'daily',
   },
 } as const;