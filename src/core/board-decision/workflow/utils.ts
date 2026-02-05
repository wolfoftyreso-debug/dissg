/**
 * WORKFLOW UTILITIES
 * 
 * Common utilities for board decision workflow.
 */

/**
 * Generate checksum for any object
 * In production, use crypto.subtle or similar
 */
export function generateChecksum(obj: unknown): string {
  const str = JSON.stringify(obj, Object.keys(obj as object).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `chk_${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Validate role permission for action
 */
export function validatePermission(
  role: string,
  action: string,
  permissions: Record<string, Record<string, boolean>>
): boolean {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  return rolePerms[action] === true;
}

/**
 * Format date for display
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('sv-SE');
}

/**
 * Format timestamp for audit
 */
export function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toISOString();
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
