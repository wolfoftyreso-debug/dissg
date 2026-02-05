 /**
  * IAM AS CONSTITUTION
  * 
  * IAM is not access control – it is LAW.
  * 
  * Roles (minimal):
  * - ingest_writer
  * - validator
  * - core_writer (VERY FEW, often 0)
  * - query_reader
  * - audit_reader
  */
 
 /**
  * ROLE DEFINITIONS
  */
 export type SystemRole =
   | 'ingest_writer'
   | 'validator'
   | 'core_writer'
   | 'query_reader'
   | 'audit_reader';
 
 export interface RoleDefinition {
   role: SystemRole;
   description: string;
   permissions: Permission[];
   restrictions: string[];
   maxPrincipals: number | 'unlimited';
   humanAssignable: boolean;
 }
 
 export interface Permission {
   resource: string;
   actions: PermissionAction[];
 }
 
 export type PermissionAction =
   | 'read'
   | 'write'
   | 'append'
   | 'delete'  // NEVER granted
   | 'update'  // RARELY granted
   | 'list'
   | 'execute';
 
 /**
  * ROLE DEFINITIONS (LOCKED)
  */
 export const ROLE_DEFINITIONS: Record<SystemRole, RoleDefinition> = {
   ingest_writer: {
     role: 'ingest_writer',
     description: 'Writes raw data to ingestion zone',
     permissions: [
       { resource: 'ingestion/*', actions: ['write', 'append'] },
       { resource: 'ingestion/*', actions: ['read', 'list'] },
     ],
     restrictions: [
       'Cannot read validation zone',
       'Cannot read canonical core',
       'Cannot read query zone',
       'No delete permission anywhere',
     ],
     maxPrincipals: 'unlimited',
     humanAssignable: false, // Only services
   },
   
   validator: {
     role: 'validator',
     description: 'Validates data and forwards to core',
     permissions: [
       { resource: 'ingestion/*', actions: ['read', 'list'] },
       { resource: 'validation/*', actions: ['read', 'write', 'list'] },
       { resource: 'canonical_core/*', actions: ['read', 'list'] },
     ],
     restrictions: [
       'Cannot write to canonical core directly',
       'No delete permission anywhere',
     ],
     maxPrincipals: 5,
     humanAssignable: false,
   },
   
   core_writer: {
     role: 'core_writer',
     description: 'Writes validated data to canonical core (MOST RESTRICTED)',
     permissions: [
       { resource: 'canonical_core/*', actions: ['append'] }, // ONLY append
       { resource: 'validation/*', actions: ['read'] },
     ],
     restrictions: [
       'APPEND ONLY - no update, no delete',
       'Can only receive from validation zone',
       'Must verify validation signature',
       'All writes logged to audit',
     ],
     maxPrincipals: 2, // VERY FEW
     humanAssignable: false, // NEVER
   },
   
   query_reader: {
     role: 'query_reader',
     description: 'Reads from canonical core for queries',
     permissions: [
       { resource: 'canonical_core/*', actions: ['read', 'list'] },
       { resource: 'query_cache/*', actions: ['read', 'write', 'list'] },
     ],
     restrictions: [
       'Cannot write to canonical core',
       'Cannot read ingestion or validation zones',
     ],
     maxPrincipals: 'unlimited',
     humanAssignable: false,
   },
   
   audit_reader: {
     role: 'audit_reader',
     description: 'Reads audit logs for compliance',
     permissions: [
       { resource: 'audit/*', actions: ['read', 'list'] },
     ],
     restrictions: [
       'Read-only',
       'Cannot modify logs',
       'Cannot access data zones',
     ],
     maxPrincipals: 10,
     humanAssignable: true, // Auditors can be human
   },
 };
 
 /**
  * IAM INVARIANTS
  */
 export const IAM_INVARIANTS = {
   noWriteAndDelete: 'No role has both write and delete permissions',
   noHumanCoreWrite: 'No human can write to canonical core',
   coreWriteViaPipeline: 'Core writes only via signed pipeline',
   auditAllWrites: 'All write operations are logged',
   minimalPermissions: 'Each role has minimum required permissions',
 } as const;
 
 /**
  * VALIDATE ROLE ASSIGNMENT
  */
 export interface RoleAssignment {
   principalId: string;
   principalType: 'service' | 'pipeline' | 'human';
   role: SystemRole;
   assignedAt: string;
   assignedBy: string;
   expiresAt?: string;
 }
 
 export function validateRoleAssignment(
   assignment: RoleAssignment
 ): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   const roleDef = ROLE_DEFINITIONS[assignment.role];
   
   // Check human assignability
   if (assignment.principalType === 'human' && !roleDef.humanAssignable) {
     violations.push(
       `Role ${assignment.role} cannot be assigned to humans`
     );
   }
   
   // Special check for core_writer
   if (assignment.role === 'core_writer') {
     if (assignment.principalType === 'human') {
       violations.push(
         'CRITICAL: core_writer cannot be assigned to humans'
       );
     }
     if (assignment.principalType !== 'pipeline') {
       violations.push(
         'core_writer should only be assigned to signed pipelines'
       );
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * CHECK FOR FORBIDDEN PERMISSION COMBINATIONS
  */
 export function checkForbiddenCombinations(
   principalId: string,
   roles: SystemRole[]
 ): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   
   // Collect all permissions
   const allPermissions: Permission[] = [];
   for (const role of roles) {
     allPermissions.push(...ROLE_DEFINITIONS[role].permissions);
   }
   
   // Check for write + delete on same resource
   const resourceActions = new Map<string, Set<PermissionAction>>();
   for (const perm of allPermissions) {
     const existing = resourceActions.get(perm.resource) ?? new Set();
     perm.actions.forEach(a => existing.add(a));
     resourceActions.set(perm.resource, existing);
   }
   
   for (const [resource, actions] of resourceActions) {
     if (actions.has('write') && actions.has('delete')) {
       violations.push(
         `FORBIDDEN: ${principalId} has both write and delete on ${resource}`
       );
     }
     if (actions.has('append') && actions.has('delete')) {
       violations.push(
         `FORBIDDEN: ${principalId} has both append and delete on ${resource}`
       );
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * SELF-TESTS
  */
 export const IAM_SELF_TESTS = {
   noWriteDeleteCombo: {
     test: 'FOR EACH principal: ASSERT NOT (has_write AND has_delete)',
     description: 'No principal has both write and delete',
     critical: true,
   },
   
   noHumanCoreWrite: {
     test: 'ASSERT no_human_principal CAN write canonical_core',
     description: 'No human can write to core',
     critical: true,
   },
   
   coreWriterCount: {
     test: 'ASSERT count(core_writer_principals) <= 2',
     description: 'Very few core writers exist',
     critical: true,
   },
   
   allWritesAudited: {
     test: 'FOR EACH write_operation: ASSERT audit_log_exists',
     description: 'All writes have audit trail',
     critical: true,
   },
 } as const;