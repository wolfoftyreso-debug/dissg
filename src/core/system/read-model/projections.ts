/**
 * READ MODEL PROJECTIONS
 * 
 * Build read-optimized views from events.
 * 
 * RULES:
 * - Projections are REGENERABLE from events
 * - Projections can be destroyed and rebuilt
 * - The ONLY truth is the event store
 */

import type { StoredEvent, DomainEvent } from '../events/types';
import { getEventStore } from '../events/event-store';

// ═══════════════════════════════════════════════════════════════════
//                         DECISION PROJECTION
// ═══════════════════════════════════════════════════════════════════

export interface DecisionProjection {
  id: string;
  status: 'draft' | 'locked';
  legitimacy_status: 'incomplete' | 'legitimate' | 'illegitimate';
  decision_type: string;
  gravity_score: number;
  scope: {
    population_size: string;
    reversibility: string;
  };
  time_horizon: {
    start: string;
    end: string | null;
  };
  context_id: string | null;
  alternatives: AlternativeProjection[];
  uncertainties: UncertaintyProjection[];
  evidence: EvidenceProjection[];
  created_at: string;
  locked_at: string | null;
  lock_attempts: LockAttemptProjection[];
}

export interface AlternativeProjection {
  id: string;
  label: string;
  description: string;
  trade_offs: Array<{ dimension: string; effect: string }>;
  added_at: string;
}

export interface UncertaintyProjection {
  id: string;
  description: string;
  uncertainty_type: string;
  impact_range: string;
  added_at: string;
}

export interface EvidenceProjection {
  id: string;
  source_type: string;
  reference: string;
  validity_start: string;
  validity_end: string | null;
  added_at: string;
}

export interface LockAttemptProjection {
  attempted_at: string;
  missing_requirements: string[];
}

// ═══════════════════════════════════════════════════════════════════
//                         PROJECTION BUILDER
// ═══════════════════════════════════════════════════════════════════

/**
 * Build a decision projection from events
 */
export async function buildDecisionProjection(
  decisionId: string
): Promise<DecisionProjection | null> {
  const store = getEventStore();
  const events = await store.readStream(`decision-${decisionId}`);
  
  if (events.length === 0) return null;
  
  const projection: DecisionProjection = {
    id: decisionId,
    status: 'draft',
    legitimacy_status: 'incomplete',
    decision_type: '',
    gravity_score: 0.5,
    scope: { population_size: '', reversibility: '' },
    time_horizon: { start: '', end: null },
    context_id: null,
    alternatives: [],
    uncertainties: [],
    evidence: [],
    created_at: '',
    locked_at: null,
    lock_attempts: [],
  };
  
  for (const { event, metadata } of events) {
    applyEventToProjection(projection, event, metadata.stored_at);
  }
  
  // Calculate legitimacy status
  projection.legitimacy_status = calculateLegitimacyStatus(projection);
  
  return projection;
}

/**
 * Apply a single event to projection
 */
function applyEventToProjection(
  projection: DecisionProjection,
  event: DomainEvent,
  storedAt: string
): void {
  switch (event.event_type) {
    case 'DecisionCreated':
      projection.decision_type = event.payload.decision_type;
      projection.scope = event.payload.scope;
      projection.time_horizon = event.payload.time_horizon;
      projection.created_at = event.timestamp;
      break;
      
    case 'ContextAttached':
      projection.context_id = event.aggregate_id;
      break;
      
    case 'AlternativeAdded':
      projection.alternatives.push({
        id: event.aggregate_id,
        label: event.payload.label,
        description: event.payload.description,
        trade_offs: [...event.payload.trade_offs],
        added_at: event.timestamp,
      });
      break;
      
    case 'UncertaintyAdded':
      projection.uncertainties.push({
        id: event.aggregate_id,
        description: event.payload.description,
        uncertainty_type: event.payload.uncertainty_type,
        impact_range: event.payload.impact_range,
        added_at: event.timestamp,
      });
      break;
      
    case 'EvidenceLinked':
      projection.evidence.push({
        id: event.aggregate_id,
        source_type: event.payload.source_type,
        reference: event.payload.reference,
        validity_start: event.payload.validity_period.start,
        validity_end: event.payload.validity_period.end,
        added_at: event.timestamp,
      });
      break;
      
    case 'DecisionLocked':
      projection.status = 'locked';
      projection.legitimacy_status = 'legitimate';
      projection.locked_at = event.payload.locked_at;
      break;
      
    case 'DecisionLockRejected':
      projection.lock_attempts.push({
        attempted_at: event.payload.attempted_at,
        missing_requirements: [...event.payload.missing_requirements],
      });
      break;
  }
}

/**
 * Calculate legitimacy status from projection state
 */
function calculateLegitimacyStatus(
  projection: DecisionProjection
): 'incomplete' | 'legitimate' | 'illegitimate' {
  if (projection.status === 'locked') {
    return 'legitimate';
  }
  
  const checks = [
    projection.context_id !== null,
    projection.alternatives.length >= 2,
    projection.uncertainties.length >= 1,
    projection.scope.population_size !== '',
    projection.time_horizon.start !== '',
  ];
  
  const passedCount = checks.filter(Boolean).length;
  
  if (passedCount === checks.length) {
    return 'legitimate'; // Ready to lock
  }
  
  if (passedCount === 0) {
    return 'illegitimate';
  }
  
  return 'incomplete';
}

// ═══════════════════════════════════════════════════════════════════
//                         PROJECTION STORE
// ═══════════════════════════════════════════════════════════════════

/**
 * In-memory projection store
 * Production should use PostgreSQL, Elastic, etc.
 */
class ProjectionStore {
  private decisions: Map<string, DecisionProjection> = new Map();
  private unsubscribe: (() => void) | null = null;
  
  /**
   * Start listening to events
   */
  start(): void {
    const store = getEventStore();
    this.unsubscribe = store.subscribe(async (storedEvent) => {
      await this.handleEvent(storedEvent);
    });
  }
  
  /**
   * Stop listening
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  
  /**
   * Handle incoming event
   */
  private async handleEvent(storedEvent: StoredEvent): Promise<void> {
    const { event } = storedEvent;
    
    // Extract decision ID
    let decisionId: string | null = null;
    
    if (event.aggregate_type === 'decision') {
      decisionId = event.aggregate_id;
    } else if ('decision_id' in event.payload) {
      decisionId = (event.payload as any).decision_id;
    }
    
    if (decisionId) {
      // Rebuild projection
      const projection = await buildDecisionProjection(decisionId);
      if (projection) {
        this.decisions.set(decisionId, projection);
      }
    }
  }
  
  /**
   * Get decision
   */
  getDecision(id: string): DecisionProjection | null {
    return this.decisions.get(id) || null;
  }
  
  /**
   * Get all decisions
   */
  getAllDecisions(): DecisionProjection[] {
    return Array.from(this.decisions.values());
  }
  
  /**
   * Rebuild all projections from events
   */
  async rebuild(): Promise<void> {
    this.decisions.clear();
    
    const store = getEventStore();
    const allEvents = await store.readAll();
    
    // Group by decision
    const decisionIds = new Set<string>();
    
    for (const { event } of allEvents) {
      if (event.aggregate_type === 'decision') {
        decisionIds.add(event.aggregate_id);
      } else if ('decision_id' in event.payload) {
        decisionIds.add((event.payload as any).decision_id);
      }
    }
    
    // Build projections
    for (const id of decisionIds) {
      const projection = await buildDecisionProjection(id);
      if (projection) {
        this.decisions.set(id, projection);
      }
    }
  }
}

// Singleton
let projectionStoreInstance: ProjectionStore | null = null;

export function getProjectionStore(): ProjectionStore {
  if (!projectionStoreInstance) {
    projectionStoreInstance = new ProjectionStore();
  }
  return projectionStoreInstance;
}
