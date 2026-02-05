/**
 * CHANGE MANIFEST
 * 
 * No change without manifest → deploy blocked.
 * Public. Append-only. Machine-readable.
 */

// ============================================
// MANIFEST TYPES
// ============================================

export interface ChangeManifest {
  release_id: string;
  created_at: string;
  author: string;
  
  changes: {
    new_nodes: number;
    new_indexes: number;
    modified_indexes: number;
    new_decision_graphs: number;
    new_signals: number;
    deprecated: string[];
  };
  
  breaking_changes: boolean;
  methodology_changes: MethodologyChange[];
  
  checksum: string;
  previous_manifest_id: string | null;
}

export interface MethodologyChange {
  component: string;
  description: string;
  rationale: string;
  backwards_compatible: boolean;
}

// ============================================
// MANIFEST STORE (append-only)
// ============================================

const MANIFEST_HISTORY: ChangeManifest[] = [];

// ============================================
// MANIFEST CREATION
// ============================================

export function createManifest(params: {
  release_id: string;
  author: string;
  new_nodes?: number;
  new_indexes?: number;
  modified_indexes?: number;
  new_decision_graphs?: number;
  new_signals?: number;
  deprecated?: string[];
  methodology_changes?: MethodologyChange[];
}): ChangeManifest {
  const previousManifest = MANIFEST_HISTORY[MANIFEST_HISTORY.length - 1];
  
  const manifest: ChangeManifest = {
    release_id: params.release_id,
    created_at: new Date().toISOString(),
    author: params.author,
    
    changes: {
      new_nodes: params.new_nodes ?? 0,
      new_indexes: params.new_indexes ?? 0,
      modified_indexes: params.modified_indexes ?? 0,
      new_decision_graphs: params.new_decision_graphs ?? 0,
      new_signals: params.new_signals ?? 0,
      deprecated: params.deprecated ?? [],
    },
    
    breaking_changes: (params.methodology_changes ?? []).some(m => !m.backwards_compatible),
    methodology_changes: params.methodology_changes ?? [],
    
    checksum: generateChecksum(params),
    previous_manifest_id: previousManifest?.release_id ?? null,
  };
  
  return manifest;
}

// ============================================
// MANIFEST VALIDATION
// ============================================

export interface ManifestValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateManifest(manifest: ChangeManifest): ManifestValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!manifest.release_id) {
    errors.push('Missing release_id');
  }
  if (!manifest.checksum) {
    errors.push('Missing checksum');
  }
  
  // Check for breaking changes without methodology documentation
  if (manifest.breaking_changes && manifest.methodology_changes.length === 0) {
    errors.push('Breaking changes require methodology documentation');
  }
  
  // Warn on large changes
  const totalChanges = 
    manifest.changes.new_nodes + 
    manifest.changes.new_indexes + 
    manifest.changes.modified_indexes;
    
  if (totalChanges > 50) {
    warnings.push(`Large release: ${totalChanges} changes. Consider splitting.`);
  }
  
  // Warn on deprecations
  if (manifest.changes.deprecated.length > 0) {
    warnings.push(`Deprecating: ${manifest.changes.deprecated.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// MANIFEST REGISTRY
// ============================================

export function registerManifest(manifest: ChangeManifest): boolean {
  const validation = validateManifest(manifest);
  
  if (!validation.valid) {
    console.error('Manifest validation failed:', validation.errors);
    return false;
  }
  
  MANIFEST_HISTORY.push(manifest);
  return true;
}

export function getManifestHistory(): readonly ChangeManifest[] {
  return MANIFEST_HISTORY;
}

export function getLatestManifest(): ChangeManifest | null {
  return MANIFEST_HISTORY[MANIFEST_HISTORY.length - 1] ?? null;
}

export function getManifest(releaseId: string): ChangeManifest | undefined {
  return MANIFEST_HISTORY.find(m => m.release_id === releaseId);
}

// ============================================
// DEPLOY GATE
// ============================================

export function canDeploy(manifest: ChangeManifest): {
  allowed: boolean;
  reason: string;
} {
  const validation = validateManifest(manifest);
  
  if (!validation.valid) {
    return {
      allowed: false,
      reason: `Manifest invalid: ${validation.errors.join('; ')}`,
    };
  }
  
  // Block deploy without manifest
  if (!manifest.checksum) {
    return {
      allowed: false,
      reason: 'No manifest checksum. Deploy blocked.',
    };
  }
  
  return {
    allowed: true,
    reason: 'Manifest valid. Deploy allowed.',
  };
}

// ============================================
// HELPERS
// ============================================

function generateChecksum(params: Record<string, unknown>): string {
  const str = JSON.stringify(params);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}
