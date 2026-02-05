/**
 * ROLE SEPARATION (TECHNICALLY ENFORCED)
 * 
 * No admin role with everything. Ever.
 * 
 * Role        | Can Read | Can Write | Can Lock | Can Change Ontology
 * ------------|----------|-----------|----------|--------------------
 * Reader      | ✅       | ❌        | ❌       | ❌
 * Contributor | ✅       | ✅        | ❌       | ❌
 * Locker      | ✅       | ❌        | ✅       | ❌
 * Steward     | ✅       | ❌        | ❌       | ⚠️ (process)
 * Operator    | ❌       | ❌        | ❌       | ❌
 */

import type { SystemRole, RolePermissions } from './types';

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export const ROLE_PERMISSIONS: Record<SystemRole, RolePermissions> = {
  reader: {
    role: 'reader',
    can_read: true,
    can_write: false,
    can_lock: false,
    can_change_ontology: false,
  },
  contributor: {
    role: 'contributor',
    can_read: true,
    can_write: true,
    can_lock: false,
    can_change_ontology: false,
  },
  locker: {
    role: 'locker',
    can_read: true,
    can_write: false,
    can_lock: true,
    can_change_ontology: false,
  },
  steward: {
    role: 'steward',
    can_read: true,
    can_write: false,
    can_lock: false,
    can_change_ontology: 'with_process',
  },
  operator: {
    role: 'operator',
    can_read: false,
    can_write: false,
    can_lock: false,
    can_change_ontology: false,
  },
} as const;

// ============================================================================
// PERMISSION CHECKS
// ============================================================================

export function canRead(role: SystemRole): boolean {
  return ROLE_PERMISSIONS[role].can_read;
}

export function canWrite(role: SystemRole): boolean {
  return ROLE_PERMISSIONS[role].can_write;
}

export function canLock(role: SystemRole): boolean {
  return ROLE_PERMISSIONS[role].can_lock;
}

export function canChangeOntology(role: SystemRole): boolean | 'with_process' {
  return ROLE_PERMISSIONS[role].can_change_ontology;
}

// ============================================================================
// ACTION VALIDATORS
// ============================================================================

export function validateAction(
  role: SystemRole,
  action: 'read' | 'write' | 'lock' | 'change_ontology'
): { allowed: boolean; reason: string | null } {
  switch (action) {
    case 'read':
      return canRead(role)
        ? { allowed: true, reason: null }
        : { allowed: false, reason: `Role ${role} cannot read` };
    
    case 'write':
      return canWrite(role)
        ? { allowed: true, reason: null }
        : { allowed: false, reason: `Role ${role} cannot write` };
    
    case 'lock':
      return canLock(role)
        ? { allowed: true, reason: null }
        : { allowed: false, reason: `Role ${role} cannot lock` };
    
    case 'change_ontology':
      const ontologyPerm = canChangeOntology(role);
      if (ontologyPerm === true) {
        return { allowed: true, reason: null };
      } else if (ontologyPerm === 'with_process') {
        return { 
          allowed: true, 
          reason: 'Requires 90-day delay and public diff' 
        };
      }
      return { allowed: false, reason: `Role ${role} cannot change ontology` };
    
    default:
      return { allowed: false, reason: 'Unknown action' };
  }
}

// ============================================================================
// CRITICAL CONSTRAINT
// ============================================================================

export const NO_ADMIN_CONSTRAINT = {
  rule: 'No admin role with all permissions',
  enforced: true,
  reason: 'Prevents single point of compromise',
  
  // Verify no role has all permissions
  validate(): boolean {
    for (const role of Object.values(ROLE_PERMISSIONS)) {
      const hasAll = 
        role.can_read && 
        role.can_write && 
        role.can_lock && 
        role.can_change_ontology === true;
      
      if (hasAll) {
        throw new Error(`SECURITY VIOLATION: Role ${role.role} has all permissions`);
      }
    }
    return true;
  },
} as const;

// Run validation at module load
NO_ADMIN_CONSTRAINT.validate();
