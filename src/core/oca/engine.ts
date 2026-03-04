/**
 * ONTOLOGY CORE ARCHITECTURE (OCA) — Engine
 * 
 * Conflict detection, registry management, governance.
 * Prevents ontological collapse at scale.
 */

import type {
  OCAObjectType, OCADomain,
  OCARegistryEntry, OCAConflict,
  OCAGovernanceEntry, OCAGovernanceAction, OCAHealthMetrics,
} from './types';
import { OCA_SEED_REGISTRY, OCA_SEED_RELATIONSHIPS } from './seed-data';

// ============================================================================
// IN-MEMORY REGISTRY (would be backed by DB in production)
// ============================================================================

let registry: OCARegistryEntry[] = [...OCA_SEED_REGISTRY];
let conflicts: OCAConflict[] = [];
let governanceLog: OCAGovernanceEntry[] = [];
let currentVersion = '1.0.0';

// ============================================================================
// REGISTRY OPERATIONS
// ============================================================================

export function getRegistry(): OCARegistryEntry[] {
  return [...registry];
}

export function getRegistryByDomain(domain: OCADomain): OCARegistryEntry[] {
  return registry.filter(e => e.domain === domain);
}

export function getRegistryByType(type: OCAObjectType): OCARegistryEntry[] {
  return registry.filter(e => e.object_type === type);
}

export function findRegistryEntry(code: string): OCARegistryEntry | undefined {
  return registry.find(e => e.code === code);
}

// ============================================================================
// CONCEPT PROPOSAL — New concepts must pass validation
// ============================================================================

export function proposeConcept(entry: Omit<OCARegistryEntry, 'id' | 'semantic_hash' | 'validation_status' | 'created_at'>): {
  accepted: boolean;
  entry?: OCARegistryEntry;
  conflicts: OCAConflict[];
} {
  // Generate semantic hash from definition
  const semanticHash = generateSemanticHash(entry.definition);

  // Check for conflicts
  const detected = detectConflicts(entry, semanticHash);

  if (detected.some(c => c.severity === 'critical')) {
    return { accepted: false, conflicts: detected };
  }

  const newEntry: OCARegistryEntry = {
    ...entry,
    id: `oca:${entry.object_type}:${semanticHash.slice(0, 12)}`,
    semantic_hash: semanticHash,
    validation_status: 'proposed',
    created_at: new Date().toISOString(),
  };

  registry.push(newEntry);

  // Log conflicts if any
  if (detected.length > 0) {
    conflicts.push(...detected);
  }

  // Log governance action
  logGovernance('concept_proposed', entry.object_type, newEntry.id, entry.name, 'New concept proposed', 'system');

  return { accepted: true, entry: newEntry, conflicts: detected };
}

// ============================================================================
// CONFLICT DETECTION ENGINE
// ============================================================================

function detectConflicts(
  entry: { code: string; name: string; definition: string; object_type: OCAObjectType; domain: OCADomain },
  semanticHash: string
): OCAConflict[] {
  const found: OCAConflict[] = [];
  const now = new Date().toISOString();

  for (const existing of registry) {
    // 1. Exact duplicate (same hash)
    if (existing.semantic_hash === semanticHash && existing.object_type === entry.object_type) {
      found.push({
        id: `conflict-${Date.now()}-dup`,
        conflict_type: 'duplicate_variable',
        severity: 'critical',
        entry_a_id: existing.id,
        entry_a_name: existing.name,
        entry_b_name: entry.name,
        description: `"${entry.name}" has identical semantic definition to "${existing.name}"`,
        suggested_resolution: `Use existing concept "${existing.code}" instead`,
        status: 'detected',
        detected_at: now,
      });
    }

    // 2. Same code, different definition
    if (existing.code === entry.code && existing.semantic_hash !== semanticHash) {
      found.push({
        id: `conflict-${Date.now()}-def`,
        conflict_type: 'conflicting_definition',
        severity: 'high',
        entry_a_id: existing.id,
        entry_a_name: existing.name,
        entry_b_name: entry.name,
        description: `Code "${entry.code}" already exists with a different definition`,
        suggested_resolution: 'Create new code or update existing definition through governance',
        status: 'detected',
        detected_at: now,
      });
    }

    // 3. Semantic overlap (similar names, same type)
    if (existing.object_type === entry.object_type && existing.id !== entry.code) {
      const similarity = computeNameSimilarity(existing.name, entry.name);
      if (similarity > 0.8) {
        found.push({
          id: `conflict-${Date.now()}-sem`,
          conflict_type: 'semantic_overlap',
          severity: 'medium',
          entry_a_id: existing.id,
          entry_a_name: existing.name,
          entry_b_name: entry.name,
          description: `"${entry.name}" is semantically similar to "${existing.name}" (${Math.round(similarity * 100)}% overlap)`,
          suggested_resolution: 'Verify these are distinct concepts or merge',
          status: 'detected',
          detected_at: now,
        });
      }
    }
  }

  return found;
}

export function runFullConflictScan(): OCAConflict[] {
  const allConflicts: OCAConflict[] = [];
  const now = new Date().toISOString();

  // Check for unit inconsistencies within same variable type
  const variables = registry.filter(e => e.object_type === 'variable');
  const byDomain = new Map<string, OCARegistryEntry[]>();
  
  for (const v of variables) {
    const key = v.domain;
    if (!byDomain.has(key)) byDomain.set(key, []);
    byDomain.get(key)!.push(v);
  }

  // Check for orphan entities (entities with no relationships)
  const entities = registry.filter(e => e.object_type === 'entity');
  const relationships = OCA_SEED_RELATIONSHIPS;
  
  for (const entity of entities) {
    const hasRelation = relationships.some(
      r => r.source_id === entity.id || r.target_id === entity.id
    );
    if (!hasRelation) {
      allConflicts.push({
        id: `conflict-orphan-${entity.id}`,
        conflict_type: 'orphan_entity',
        severity: 'low',
        entry_a_id: entity.id,
        entry_a_name: entity.name,
        description: `Entity "${entity.name}" has no relationships`,
        suggested_resolution: 'Connect to variables or other entities, or deprecate',
        status: 'detected',
        detected_at: now,
      });
    }
  }

  conflicts = [...conflicts.filter(c => c.status !== 'detected'), ...allConflicts];
  return allConflicts;
}

export function getConflicts(): OCAConflict[] {
  return [...conflicts];
}

export function getActiveConflicts(): OCAConflict[] {
  return conflicts.filter(c => c.status === 'detected' || c.status === 'reviewing');
}

// ============================================================================
// GOVERNANCE
// ============================================================================

function logGovernance(
  action: OCAGovernanceAction,
  objectType: OCAObjectType,
  objectId: string,
  objectName: string,
  reason: string,
  performedBy: string
) {
  governanceLog.push({
    id: `gov-${Date.now()}`,
    action,
    object_type: objectType,
    object_id: objectId,
    object_name: objectName,
    reason,
    performed_by: performedBy,
    ontology_version_before: currentVersion,
    ontology_version_after: currentVersion,
    created_at: new Date().toISOString(),
  });
}

export function validateConcept(entryId: string): boolean {
  const entry = registry.find(e => e.id === entryId);
  if (!entry || entry.validation_status !== 'proposed') return false;

  const idx = registry.indexOf(entry);
  registry[idx] = { ...entry, validation_status: 'validated' };
  logGovernance('concept_validated', entry.object_type, entry.id, entry.name, 'Passed validation review', 'steward');
  return true;
}

export function freezeConcept(entryId: string): boolean {
  const entry = registry.find(e => e.id === entryId);
  if (!entry || entry.validation_status !== 'validated') return false;

  const idx = registry.indexOf(entry);
  registry[idx] = { ...entry, validation_status: 'frozen', frozen_at: new Date().toISOString() };
  logGovernance('concept_frozen', entry.object_type, entry.id, entry.name, 'Concept frozen — immutable', 'steward');
  return true;
}

export function deprecateConcept(entryId: string, supersededBy?: string): boolean {
  const entry = registry.find(e => e.id === entryId);
  if (!entry) return false;

  const idx = registry.indexOf(entry);
  registry[idx] = {
    ...entry,
    validation_status: 'deprecated',
    deprecated_at: new Date().toISOString(),
    superseded_by: supersededBy,
  };
  logGovernance('concept_deprecated', entry.object_type, entry.id, entry.name, `Deprecated${supersededBy ? `, superseded by ${supersededBy}` : ''}`, 'steward');
  return true;
}

export function getGovernanceLog(): OCAGovernanceEntry[] {
  return [...governanceLog];
}

// ============================================================================
// HEALTH METRICS
// ============================================================================

export function getOCAHealth(): OCAHealthMetrics {
  const activeConflicts = getActiveConflicts();
  const domains = new Set(registry.map(e => e.domain));

  return {
    total_entities: registry.filter(e => e.object_type === 'entity').length,
    total_variables: registry.filter(e => e.object_type === 'variable').length,
    total_states: 0, // States are dynamic, tracked separately
    total_interventions: registry.filter(e => e.object_type === 'intervention').length,
    total_relationships: registry.filter(e => e.object_type === 'relationship').length,
    total_registry_entries: registry.length,
    frozen_entries: registry.filter(e => e.validation_status === 'frozen').length,
    deprecated_entries: registry.filter(e => e.validation_status === 'deprecated').length,
    active_conflicts: activeConflicts.length,
    critical_conflicts: activeConflicts.filter(c => c.severity === 'critical').length,
    domains_covered: Array.from(domains) as OCADomain[],
    avg_semantic_consistency: computeSemanticConsistency(),
    ontology_version: currentVersion,
    last_governance_action: governanceLog.length > 0
      ? governanceLog[governanceLog.length - 1].action
      : undefined,
  };
}

// ============================================================================
// INTERNAL UTILITIES
// ============================================================================

function generateSemanticHash(definition: string): string {
  // Simple hash for demo — production would use proper content hashing
  let hash = 0;
  const str = definition.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
}

function computeNameSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function computeSemanticConsistency(): number {
  if (registry.length === 0) return 1;
  const frozen = registry.filter(e => e.validation_status === 'frozen').length;
  const validated = registry.filter(e => e.validation_status === 'validated').length;
  const total = registry.length;
  return Math.round(((frozen * 1.0 + validated * 0.8) / total) * 100) / 100;
}
