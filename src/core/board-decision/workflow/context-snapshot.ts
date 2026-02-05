/**
 * DECISION CONTEXT SNAPSHOT
 * 
 * The decision's DNA - immutable, complete, traceable.
 * Created automatically when protocol is locked.
 */

import type { DecisionPreparationDocument } from '../types';
import type { DecisionContextSnapshot, ScheduledReview } from './types';
import { generateChecksum } from './utils';

/**
 * Create decision context snapshot
 * Called automatically by system when protocol is signed
 */
export function createContextSnapshot(params: {
  dpd: DecisionPreparationDocument;
  decision_taken: string;
  decision_date: string;
}): DecisionContextSnapshot {
  const { dpd } = params;
  
  const dcs_id = `dcs_${dpd.dpd_id}_${Date.now()}`;
  const dpd_checksum = generateChecksum(dpd);
  
  // Lock all index versions
  const index_versions = dpd.relevant_indexes.map(idx => ({
    index_id: idx.index_id,
    version: '1.0', // Would come from actual index system
    value_at_decision: idx.value,
    timestamp: new Date().toISOString(),
  }));
  
  // Timestamp all signals
  const signal_timestamps = dpd.relevant_data.map(d => ({
    signal_id: d.source,
    value: d.current,
    timestamp: d.last_updated,
  }));
  
  const snapshot: DecisionContextSnapshot = {
    dcs_id,
    created_at: new Date().toISOString(),
    
    dpd_snapshot: dpd,
    dpd_checksum,
    
    index_versions,
    signal_timestamps,
    
    locked: true,
    immutable: true,
  };
  
  return snapshot;
}

/**
 * Verify snapshot integrity
 */
export function verifySnapshotIntegrity(snapshot: DecisionContextSnapshot): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Verify DPD checksum
  const currentChecksum = generateChecksum(snapshot.dpd_snapshot);
  if (currentChecksum !== snapshot.dpd_checksum) {
    errors.push('DPD checksum mismatch - snapshot may be corrupted');
  }
  
  // Verify locked status
  if (!snapshot.locked) {
    errors.push('Snapshot is not locked');
  }
  
  if (!snapshot.immutable) {
    errors.push('Snapshot is not marked immutable');
  }
  
  // Verify all indexes have timestamps
  const missingTimestamps = snapshot.index_versions.filter(v => !v.timestamp);
  if (missingTimestamps.length > 0) {
    errors.push(`${missingTimestamps.length} index versions missing timestamps`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Schedule automatic PDRC based on irreversibility
 */
export function scheduleReview(params: {
  snapshot: DecisionContextSnapshot;
  decision_taken: string;
  irreversibility: 'low' | 'medium' | 'high' | 'permanent';
}): ScheduledReview {
  const { snapshot, decision_taken, irreversibility } = params;
  
  // Calculate review date based on irreversibility
  const reviewDelayMonths = getReviewDelay(irreversibility);
  const scheduled_date = addMonths(new Date(), reviewDelayMonths).toISOString().split('T')[0];
  
  // Calculate reminder dates
  const reminder_dates = calculateReminderDates(scheduled_date, irreversibility);
  
  const review: ScheduledReview = {
    review_id: `pdrc_${snapshot.dcs_id}_${Date.now()}`,
    dcs_id: snapshot.dcs_id,
    dpd_id: snapshot.dpd_snapshot.dpd_id,
    decision_taken,
    
    scheduled_date,
    reminder_dates,
    
    irreversibility_level: irreversibility,
    auto_scheduled: true,
    
    status: 'pending',
    result: null,
  };
  
  return review;
}

/**
 * Get review delay based on irreversibility
 */
function getReviewDelay(irreversibility: 'low' | 'medium' | 'high' | 'permanent'): number {
  switch (irreversibility) {
    case 'low': return 6;      // 6 months
    case 'medium': return 12;  // 12 months
    case 'high': return 24;    // 24 months
    case 'permanent': return 36; // 36 months
    default: return 12;
  }
}

/**
 * Calculate reminder dates
 */
function calculateReminderDates(
  scheduled_date: string, 
  irreversibility: 'low' | 'medium' | 'high' | 'permanent'
): string[] {
  const reminders: string[] = [];
  const scheduledDate = new Date(scheduled_date);
  
  // Always remind 1 month before
  reminders.push(addMonths(scheduledDate, -1).toISOString().split('T')[0]);
  
  // For high/permanent, also remind 3 months before
  if (irreversibility === 'high' || irreversibility === 'permanent') {
    reminders.push(addMonths(scheduledDate, -3).toISOString().split('T')[0]);
  }
  
  // For permanent, also remind 6 months before
  if (irreversibility === 'permanent') {
    reminders.push(addMonths(scheduledDate, -6).toISOString().split('T')[0]);
  }
  
  return reminders.sort();
}

/**
 * Helper: Add months to date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Compare snapshot to current state (for PDRC)
 */
export function compareSnapshotToCurrentState(
  snapshot: DecisionContextSnapshot,
  currentIndexValues: Record<string, number>
): {
  deviations: Array<{
    index_id: string;
    expected: number;
    observed: number;
    deviation_percent: number;
  }>;
} {
  const deviations: Array<{
    index_id: string;
    expected: number;
    observed: number;
    deviation_percent: number;
  }> = [];
  
  for (const indexVersion of snapshot.index_versions) {
    const currentValue = currentIndexValues[indexVersion.index_id];
    if (currentValue !== undefined) {
      const expected = indexVersion.value_at_decision;
      const deviation_percent = ((currentValue - expected) / expected) * 100;
      
      if (Math.abs(deviation_percent) > 5) { // 5% threshold
        deviations.push({
          index_id: indexVersion.index_id,
          expected,
          observed: currentValue,
          deviation_percent,
        });
      }
    }
  }
  
  return { deviations };
}
