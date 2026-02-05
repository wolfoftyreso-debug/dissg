/**
 * AGGREGATION SANDBOX – SNAPSHOT BUILDER
 * 
 * Builds read-only snapshots from read models.
 * Sandbox works ONLY on snapshots, never live data.
 */

import type { AggregationSnapshot } from './types';

// ============================================================================
// SNAPSHOT CONFIGURATION
// ============================================================================

export interface SnapshotConfig {
  /** Source models to include */
  source_models: readonly string[];
  
  /** Time window */
  time_window: {
    start: string;
    end: string;
  };
  
  /** Filters to apply */
  filters?: Record<string, unknown>;
  
  /** Schema version */
  schema_version: string;
}

// ============================================================================
// SNAPSHOT BUILDER
// ============================================================================

/**
 * Generate a deterministic snapshot ID
 */
export function generateSnapshotId(config: SnapshotConfig): string {
  const content = JSON.stringify({
    models: [...config.source_models].sort(),
    window: config.time_window,
    filters: config.filters || {},
    version: config.schema_version,
  });
  
  // Simple hash for ID (in production, use crypto.subtle)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  return `snap_${timestamp}_${Math.abs(hash).toString(36)}`;
}

/**
 * Calculate checksum for snapshot data
 */
export function calculateChecksum(data: unknown): string {
  const content = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Build a snapshot from configuration
 */
export function buildSnapshot(
  config: SnapshotConfig,
  recordCount: number
): AggregationSnapshot {
  return {
    snapshot_id: generateSnapshotId(config),
    source_models: config.source_models,
    time_window: config.time_window,
    record_count: recordCount,
    checksum: calculateChecksum(config),
    created_at: new Date().toISOString(),
    schema_version: config.schema_version,
  };
}

// ============================================================================
// SNAPSHOT VALIDATION
// ============================================================================

export interface SnapshotValidationResult {
  valid: boolean;
  errors: readonly string[];
  warnings: readonly string[];
}

export function validateSnapshot(snapshot: AggregationSnapshot): SnapshotValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!snapshot.snapshot_id) {
    errors.push('Missing snapshot_id');
  }
  
  if (!snapshot.source_models || snapshot.source_models.length === 0) {
    errors.push('Missing source_models');
  }
  
  if (!snapshot.time_window?.start || !snapshot.time_window?.end) {
    errors.push('Missing time_window');
  }
  
  if (snapshot.record_count <= 0) {
    errors.push('Invalid record_count');
  }
  
  if (!snapshot.checksum) {
    errors.push('Missing checksum');
  }
  
  // Warnings
  if (snapshot.record_count < 10) {
    warnings.push('Low record count may affect reliability');
  }
  
  const snapshotAge = Date.now() - new Date(snapshot.created_at).getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  if (snapshotAge > 30 * dayInMs) {
    warnings.push('Snapshot older than 30 days');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SNAPSHOT REGISTRY
// ============================================================================

/**
 * In-memory snapshot registry (would be persistent in production)
 */
class SnapshotRegistry {
  private snapshots: Map<string, AggregationSnapshot> = new Map();
  
  register(snapshot: AggregationSnapshot): void {
    const validation = validateSnapshot(snapshot);
    if (!validation.valid) {
      throw new Error(`Invalid snapshot: ${validation.errors.join(', ')}`);
    }
    this.snapshots.set(snapshot.snapshot_id, snapshot);
  }
  
  get(snapshotId: string): AggregationSnapshot | undefined {
    return this.snapshots.get(snapshotId);
  }
  
  getBySourceModel(modelName: string): readonly AggregationSnapshot[] {
    return Array.from(this.snapshots.values())
      .filter(s => s.source_models.includes(modelName));
  }
  
  getLatest(sourceModels: readonly string[]): AggregationSnapshot | undefined {
    const matching = Array.from(this.snapshots.values())
      .filter(s => sourceModels.every(m => s.source_models.includes(m)))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return matching[0];
  }
  
  list(): readonly AggregationSnapshot[] {
    return Array.from(this.snapshots.values());
  }
}

export const snapshotRegistry = new SnapshotRegistry();

// ============================================================================
// SCHEDULED SNAPSHOT BUILDER
// ============================================================================

export interface ScheduledSnapshotConfig {
  /** Cron expression or interval */
  schedule: string;
  
  /** Snapshot configuration */
  config: SnapshotConfig;
  
  /** Enabled */
  enabled: boolean;
}

/**
 * Create a nightly snapshot configuration
 */
export function createNightlySnapshotConfig(
  sourceModels: readonly string[],
  lookbackDays: number = 365
): ScheduledSnapshotConfig {
  const end = new Date();
  const start = new Date(end.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
  
  return {
    schedule: '0 2 * * *', // 2 AM daily
    config: {
      source_models: sourceModels,
      time_window: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      schema_version: '1.0.0',
    },
    enabled: true,
  };
}
