/**
 * LONG-RANGE CONSISTENCY ENGINE
 * 
 * 50-year protection against drift.
 * All changes version-marked, compared backwards, shown openly.
 */

/**
 * DRIFT TYPE
 */
export type DriftType = 
  | 'definition_drift'
  | 'measure_change'
  | 'methodology_change'
  | 'political_reformulation'
  | 'source_change'
  | 'coverage_change';

/**
 * CONSISTENCY CHECK
 */
export interface ConsistencyCheck {
  check_id: string;
  entity_type: 'indicator' | 'domain' | 'source' | 'methodology';
  entity_id: string;
  checked_at: string;
  baseline_version: string;
  current_version: string;
  drift_detected: boolean;
  drift_type: DriftType | null;
  drift_severity: 'none' | 'minor' | 'moderate' | 'major' | 'breaking';
  change_description: string | null;
  backward_compatible: boolean;
}

/**
 * VERSION CHANGE RECORD
 */
export interface VersionChangeRecord {
  record_id: string;
  entity_id: string;
  from_version: string;
  to_version: string;
  change_type: DriftType;
  changed_at: string;
  reason: string;
  impact_assessment: string;
  backward_mapping: string | null;
  forward_mapping: string | null;
  approved_by: string;
  publicly_visible: true;
}

/**
 * CONSISTENCY ENGINE
 */
class LongRangeConsistencyEngine {
  private checks: ConsistencyCheck[] = [];
  private changes: VersionChangeRecord[] = [];

  /**
   * RUN CONSISTENCY CHECK
   */
  runCheck(config: {
    entity_type: ConsistencyCheck['entity_type'];
    entity_id: string;
    baseline_version: string;
    current_version: string;
    baseline_definition: string;
    current_definition: string;
  }): ConsistencyCheck {
    const driftAnalysis = this.analyzeDrift(
      config.baseline_definition,
      config.current_definition
    );

    const check: ConsistencyCheck = {
      check_id: `CHK:${Date.now().toString(36)}`,
      entity_type: config.entity_type,
      entity_id: config.entity_id,
      checked_at: new Date().toISOString(),
      baseline_version: config.baseline_version,
      current_version: config.current_version,
      drift_detected: driftAnalysis.detected,
      drift_type: driftAnalysis.type,
      drift_severity: driftAnalysis.severity,
      change_description: driftAnalysis.description,
      backward_compatible: driftAnalysis.severity !== 'breaking',
    };

    this.checks.push(check);
    return check;
  }

  /**
   * ANALYZE DRIFT
   */
  private analyzeDrift(baseline: string, current: string): {
    detected: boolean;
    type: DriftType | null;
    severity: ConsistencyCheck['drift_severity'];
    description: string | null;
  } {
    if (baseline === current) {
      return { detected: false, type: null, severity: 'none', description: null };
    }

    // Simple similarity check (in production, use semantic analysis)
    const similarity = this.calculateSimilarity(baseline, current);
    
    let severity: ConsistencyCheck['drift_severity'];
    if (similarity > 0.95) severity = 'minor';
    else if (similarity > 0.8) severity = 'moderate';
    else if (similarity > 0.5) severity = 'major';
    else severity = 'breaking';

    return {
      detected: true,
      type: 'definition_drift',
      severity,
      description: `Definition changed: similarity ${Math.round(similarity * 100)}%`,
    };
  }

  /**
   * CALCULATE SIMILARITY
   */
  private calculateSimilarity(a: string, b: string): number {
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    
    return intersection.size / union.size;
  }

  /**
   * RECORD VERSION CHANGE
   */
  recordChange(config: {
    entity_id: string;
    from_version: string;
    to_version: string;
    change_type: DriftType;
    reason: string;
    impact_assessment: string;
    backward_mapping?: string;
    forward_mapping?: string;
    approved_by: string;
  }): VersionChangeRecord {
    const record: VersionChangeRecord = {
      record_id: `VCR:${Date.now().toString(36)}`,
      entity_id: config.entity_id,
      from_version: config.from_version,
      to_version: config.to_version,
      change_type: config.change_type,
      changed_at: new Date().toISOString(),
      reason: config.reason,
      impact_assessment: config.impact_assessment,
      backward_mapping: config.backward_mapping || null,
      forward_mapping: config.forward_mapping || null,
      approved_by: config.approved_by,
      publicly_visible: true,
    };

    this.changes.push(record);
    return record;
  }

  /**
   * GET ENTITY HISTORY
   */
  getEntityHistory(entityId: string): VersionChangeRecord[] {
    return this.changes
      .filter(c => c.entity_id === entityId)
      .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());
  }

  /**
   * GET BREAKING CHANGES
   */
  getBreakingChanges(): ConsistencyCheck[] {
    return this.checks.filter(c => c.drift_severity === 'breaking');
  }

  /**
   * GENERATE CHANGE EXPLANATION
   */
  generateChangeExplanation(entityId: string): string {
    const history = this.getEntityHistory(entityId);
    
    if (history.length === 0) {
      return 'No changes recorded.';
    }

    return history.map(h => 
      `[${h.changed_at.split('T')[0]}] ${h.from_version} → ${h.to_version}: ${h.reason}`
    ).join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_checks: number;
    total_changes: number;
    breaking_changes: number;
    drift_detected_count: number;
  } {
    return {
      total_checks: this.checks.length,
      total_changes: this.changes.length,
      breaking_changes: this.getBreakingChanges().length,
      drift_detected_count: this.checks.filter(c => c.drift_detected).length,
    };
  }
}

/**
 * SINGLETON INSTANCE
 */
export const consistencyEngine = new LongRangeConsistencyEngine();

/**
 * CONSISTENCY PRINCIPLES
 */
export const CONSISTENCY_PRINCIPLES = {
  all_changes_versioned: true,
  all_changes_compared_backward: true,
  all_changes_publicly_visible: true,
  breaking_changes_flagged: true,
  future_can_see_why: true,
  fifty_year_protection: true,
} as const;
