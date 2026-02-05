/**
 * DECISION CONTEXT FREEZE
 * 
 * Before major decisions: generate immutable snapshot.
 * - Read-only
 * - Version-locked
 * - Publicly verifiable
 * 
 * Decision cannot be separated from its context.
 */

import { calculateBurden, type ImpactScale, type BurdenLevel } from './decision-burden';

/**
 * CONTEXT SNAPSHOT
 */
export interface DecisionContextSnapshot {
  readonly snapshot_id: string;
  readonly decision_id: string;
  readonly frozen_at: string;
  readonly checksum: string;
  readonly burden: {
    level: BurdenLevel;
    impact_scale: ImpactScale;
  };
  readonly context: {
    readonly relevant_truth_nodes: ReadonlyArray<{
      node_id: string;
      value_at_freeze: number | null;
      uncertainty: number;
      last_updated: string;
    }>;
    readonly relevant_indexes: ReadonlyArray<{
      index_id: string;
      value_at_freeze: number;
      trend_direction: 'improving' | 'stable' | 'declining';
    }>;
    readonly structural_factors: ReadonlyArray<{
      factor: string;
      relevance: 'primary' | 'secondary' | 'contextual';
      status: string;
    }>;
    readonly known_uncertainties: ReadonlyArray<{
      area: string;
      type: 'data' | 'methodology' | 'interpretation';
      severity: 'low' | 'moderate' | 'high';
      description: string;
    }>;
    readonly known_tradeoffs: ReadonlyArray<{
      tradeoff: string;
      option_a: string;
      option_b: string;
      documented_at: string;
    }>;
    readonly explicit_non_knowledge: ReadonlyArray<{
      what_is_unknown: string;
      why_unknown: 'no_data' | 'insufficient_data' | 'definitional' | 'inherent';
      impact_if_wrong: string;
    }>;
  };
  readonly immutable: true;
}

/**
 * FREEZE REQUEST
 */
export interface ContextFreezeRequest {
  decision_id: string;
  decision_title: string;
  affected_population: number;
  reversibility: 'fully' | 'partially' | 'irreversible';
  time_pressure: 'none' | 'moderate' | 'urgent' | 'crisis';
  relevant_node_ids: string[];
  relevant_index_ids: string[];
}

/**
 * CONTEXT FREEZE ENGINE
 */
class DecisionContextFreezeEngine {
  private snapshots: Map<string, DecisionContextSnapshot> = new Map();

  /**
   * FREEZE CONTEXT
   */
  freezeContext(request: ContextFreezeRequest): DecisionContextSnapshot {
    const burden = calculateBurden({
      affected_population: request.affected_population,
      reversibility: request.reversibility,
      time_pressure: request.time_pressure,
      uncertainty_level: 0.5, // Would calculate from actual data
    });
    
    const snapshot_id = `CTX-${request.decision_id}-${Date.now()}`;
    const frozen_at = new Date().toISOString();
    
    // Build context (would fetch real data in production)
    const snapshot: DecisionContextSnapshot = {
      snapshot_id,
      decision_id: request.decision_id,
      frozen_at,
      checksum: this.generateChecksum(snapshot_id, frozen_at),
      burden: {
        level: burden.burden_level,
        impact_scale: burden.impact_scale,
      },
      context: {
        relevant_truth_nodes: request.relevant_node_ids.map(id => ({
          node_id: id,
          value_at_freeze: null, // Would fetch real values
          uncertainty: 0.2,
          last_updated: frozen_at,
        })),
        relevant_indexes: request.relevant_index_ids.map(id => ({
          index_id: id,
          value_at_freeze: 0,
          trend_direction: 'stable' as const,
        })),
        structural_factors: [],
        known_uncertainties: [],
        known_tradeoffs: [],
        explicit_non_knowledge: [],
      },
      immutable: true,
    };
    
    // Store immutably
    this.snapshots.set(snapshot.snapshot_id, Object.freeze(snapshot) as DecisionContextSnapshot);
    
    return snapshot;
  }

  /**
   * GET SNAPSHOT
   */
  getSnapshot(snapshotId: string): DecisionContextSnapshot | null {
    return this.snapshots.get(snapshotId) || null;
  }

  /**
   * GET SNAPSHOTS FOR DECISION
   */
  getSnapshotsForDecision(decisionId: string): DecisionContextSnapshot[] {
    const results: DecisionContextSnapshot[] = [];
    this.snapshots.forEach(snapshot => {
      if (snapshot.decision_id === decisionId) {
        results.push(snapshot);
      }
    });
    return results;
  }

  /**
   * VERIFY SNAPSHOT
   */
  verifySnapshot(snapshotId: string): {
    exists: boolean;
    valid: boolean;
    checksum_matches: boolean;
  } {
    const snapshot = this.snapshots.get(snapshotId);
    
    if (!snapshot) {
      return { exists: false, valid: false, checksum_matches: false };
    }
    
    const expectedChecksum = this.generateChecksum(snapshot.snapshot_id, snapshot.frozen_at);
    
    return {
      exists: true,
      valid: snapshot.immutable === true,
      checksum_matches: snapshot.checksum === expectedChecksum,
    };
  }

  /**
   * GENERATE CHECKSUM
   */
  private generateChecksum(snapshotId: string, timestamp: string): string {
    // Simple hash for demo - would use SHA-256 in production
    const input = `${snapshotId}:${timestamp}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `CHK-${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_snapshots: number;
    by_burden_level: Record<BurdenLevel, number>;
  } {
    const byLevel: Record<BurdenLevel, number> = {
      minimal: 0,
      standard: 0,
      elevated: 0,
      critical: 0,
      maximum: 0,
    };
    
    this.snapshots.forEach(s => {
      byLevel[s.burden.level]++;
    });
    
    return {
      total_snapshots: this.snapshots.size,
      by_burden_level: byLevel,
    };
  }
}

/**
 * SINGLETON
 */
export const contextFreeze = new DecisionContextFreezeEngine();

/**
 * PRINCIPLES
 */
export const CONTEXT_FREEZE_PRINCIPLES = {
  read_only: true,
  version_locked: true,
  publicly_verifiable: true,
  decision_inseparable_from_context: true,
} as const;
