/**
 * POST-DECISION LOCK
 * 
 * When decision is made, lock the context.
 * Future can see:
 * - What was known
 * - What was uncertain
 * - What alternatives existed
 * 
 * No one can say "we didn't know".
 */

import { contextFreeze } from '../accountability/decision-context-freeze';
import { dpdGenerator } from './dpd-generator';
import type { PostDecisionLock } from './types';

/**
 * POST-DECISION LOCK ENGINE
 */
class PostDecisionLockEngine {
  private locks: Map<string, PostDecisionLock> = new Map();

  /**
   * LOCK DECISION
   */
  lockDecision(params: {
    dpd_id: string;
    decision_taken: string;
    decision_date: string;
    locked_by: string;
  }): PostDecisionLock | null {
    const dpd = dpdGenerator.getDPD(params.dpd_id);
    if (!dpd) return null;

    // Create context snapshot
    const snapshot = contextFreeze.freezeContext({
      decision_id: params.dpd_id,
      decision_title: dpd.overview.decision_subject,
      affected_population: dpd.overview.population_affected,
      reversibility: this.mapIrreversibility(dpd.overview.irreversibility),
      time_pressure: 'none',
      relevant_node_ids: [],
      relevant_index_ids: dpd.relevant_indexes.map(i => i.index_id),
    });

    const lock: PostDecisionLock = {
      lock_id: `LOCK-${Date.now()}`,
      dpd_id: params.dpd_id,
      decision_taken: params.decision_taken,
      decision_date: params.decision_date,
      context_snapshot_id: snapshot.snapshot_id,
      locked_at: new Date().toISOString(),
      locked_by: params.locked_by,
      immutable: true,
    };

    // Freeze the lock
    this.locks.set(lock.lock_id, Object.freeze(lock) as PostDecisionLock);
    return lock;
  }

  /**
   * MAP IRREVERSIBILITY
   */
  private mapIrreversibility(
    level: 'low' | 'medium' | 'high' | 'permanent'
  ): 'fully' | 'partially' | 'irreversible' {
    switch (level) {
      case 'low': return 'fully';
      case 'medium': return 'partially';
      case 'high': 
      case 'permanent': return 'irreversible';
    }
  }

  /**
   * GET LOCK
   */
  getLock(lockId: string): PostDecisionLock | null {
    return this.locks.get(lockId) || null;
  }

  /**
   * GET LOCKS FOR DPD
   */
  getLocksForDPD(dpdId: string): PostDecisionLock[] {
    const results: PostDecisionLock[] = [];
    this.locks.forEach(lock => {
      if (lock.dpd_id === dpdId) {
        results.push(lock);
      }
    });
    return results;
  }

  /**
   * VERIFY LOCK INTEGRITY
   */
  verifyLock(lockId: string): {
    exists: boolean;
    immutable: boolean;
    context_valid: boolean;
  } {
    const lock = this.locks.get(lockId);
    if (!lock) {
      return { exists: false, immutable: false, context_valid: false };
    }

    const contextVerification = contextFreeze.verifySnapshot(lock.context_snapshot_id);

    return {
      exists: true,
      immutable: lock.immutable === true,
      context_valid: contextVerification.valid,
    };
  }

  /**
   * GENERATE ACCOUNTABILITY REPORT
   */
  generateAccountabilityReport(lockId: string): string {
    const lock = this.locks.get(lockId);
    if (!lock) return 'Lock not found';

    const dpd = dpdGenerator.getDPD(lock.dpd_id);
    if (!dpd) return 'DPD not found';

    const lines = [
      '═══════════════════════════════════════════════════════',
      'DECISION ACCOUNTABILITY RECORD',
      '═══════════════════════════════════════════════════════',
      '',
      `Decision: ${dpd.overview.decision_subject}`,
      `Taken: ${lock.decision_date}`,
      `Alternative chosen: ${lock.decision_taken}`,
      '',
      'AT DECISION TIME:',
      '',
      'KNOWN FACTORS:',
      ...dpd.knowledge_status.known.map(k => `  ✓ ${k}`),
      '',
      'UNCERTAIN FACTORS:',
      ...dpd.knowledge_status.uncertain.map(u => `  ⚠ ${u}`),
      '',
      'UNKNOWN FACTORS:',
      ...dpd.knowledge_status.unknown.map(u => `  ? ${u}`),
      '',
      'ALTERNATIVES AVAILABLE:',
      ...dpd.alternatives.map(a => `  • ${a.label}`),
      '',
      '───────────────────────────────────────────────────────',
      'This record is immutable and cryptographically verifiable.',
      `Context snapshot: ${lock.context_snapshot_id}`,
      `Locked at: ${lock.locked_at}`,
      '═══════════════════════════════════════════════════════',
    ];

    return lines.join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_locks: number;
    by_organization_type: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    
    this.locks.forEach(lock => {
      const dpd = dpdGenerator.getDPD(lock.dpd_id);
      if (dpd) {
        const type = dpd.overview.organization_type;
        byType[type] = (byType[type] || 0) + 1;
      }
    });

    return {
      total_locks: this.locks.size,
      by_organization_type: byType,
    };
  }
}

/**
 * SINGLETON
 */
export const postDecisionLock = new PostDecisionLockEngine();
