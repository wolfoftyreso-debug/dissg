/**
 * REFERENCE CASE EXECUTOR
 * 
 * Runs the Volkswagen Golf case through the full event-sourcing pipeline.
 * This demonstrates the complete flow from decision → lock → review.
 */

import {
  DECISION_CREATE_REQUEST,
  CONTEXT_ATTACH_REQUEST,
  ALTERNATIVES,
  UNCERTAINTIES,
  EVIDENCE,
  REVIEW_REQUEST,
} from './data';
import { getEventStore, createEvent, resetEventStore } from '@/core/system/events/event-store';
import { buildDecisionProjection } from '@/core/system/read-model/projections';
import type { DecisionProjection } from '@/core/system/read-model/projections';

// ═══════════════════════════════════════════════════════════════════
//                         EXECUTION RESULT
// ═══════════════════════════════════════════════════════════════════

export interface ExecutionStep {
  step: string;
  endpoint: string;
  method: 'POST' | 'GET';
  request?: unknown;
  response: unknown;
  events_emitted: string[];
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  case_id: string;
  total_events: number;
  steps: ExecutionStep[];
  final_projection: DecisionProjection | null;
  execution_time_ms: number;
}

// ═══════════════════════════════════════════════════════════════════
//                         EXECUTOR
// ═══════════════════════════════════════════════════════════════════

export async function executeVolkswagenGolfCase(): Promise<ExecutionResult> {
  const startTime = performance.now();
  const steps: ExecutionStep[] = [];
  const store = getEventStore();
  
  // Reset for clean execution
  resetEventStore();
  
  const decisionId = 'DEC-001';
  const streamId = `decision-${decisionId}`;
  let version = 0;

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: CREATE DECISION
  // ─────────────────────────────────────────────────────────────────
  
  const decisionEvent = createEvent(
    'DecisionCreated',
    decisionId,
    'decision',
    {
      decision_type: DECISION_CREATE_REQUEST.decision_type,
      scope: DECISION_CREATE_REQUEST.scope,
      time_horizon: DECISION_CREATE_REQUEST.time_horizon,
    },
    'system',
    1
  );
  
  await store.append(streamId, [decisionEvent], version);
  version++;
  
  steps.push({
    step: 'Create Decision',
    endpoint: '/v1/decisions',
    method: 'POST',
    request: DECISION_CREATE_REQUEST,
    response: { decision_id: decisionId, status: 'draft' },
    events_emitted: ['DecisionCreated'],
    timestamp: new Date().toISOString(),
  });

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: ATTACH CONTEXT
  // ─────────────────────────────────────────────────────────────────
  
  const contextId = `CTX-${Date.now()}`;
  const contextEvent = createEvent(
    'ContextAttached',
    contextId,
    'context',
    {
      decision_id: decisionId,
      description: CONTEXT_ATTACH_REQUEST.description,
      affected_population: CONTEXT_ATTACH_REQUEST.affected_population,
      geographic_scope: CONTEXT_ATTACH_REQUEST.geographic_scope,
      assumptions: CONTEXT_ATTACH_REQUEST.assumptions,
    },
    'system',
    1
  );
  
  await store.append(streamId, [contextEvent], version);
  version++;
  
  steps.push({
    step: 'Attach Context',
    endpoint: '/v1/contexts',
    method: 'POST',
    request: CONTEXT_ATTACH_REQUEST,
    response: { context_id: contextId, status: 'attached' },
    events_emitted: ['ContextAttached'],
    timestamp: new Date().toISOString(),
  });

  // ─────────────────────────────────────────────────────────────────
  // STEP 3: ADD ALTERNATIVES (3)
  // ─────────────────────────────────────────────────────────────────
  
  for (const alt of ALTERNATIVES) {
    const altId = `ALT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const altEvent = createEvent(
      'AlternativeAdded',
      altId,
      'alternative',
      {
        decision_id: decisionId,
        label: alt.label,
        description: alt.description,
        trade_offs: [...alt.trade_offs],
        required_assumptions: [...alt.required_assumptions],
      },
      'system',
      1
    );
    
    await store.append(streamId, [altEvent], version);
    version++;
    
    steps.push({
      step: `Add Alternative: ${alt.label}`,
      endpoint: '/v1/alternatives',
      method: 'POST',
      request: alt,
      response: { alternative_id: altId, status: 'added' },
      events_emitted: ['AlternativeAdded'],
      timestamp: new Date().toISOString(),
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 4: ADD UNCERTAINTIES (2)
  // ─────────────────────────────────────────────────────────────────
  
  for (const unc of UNCERTAINTIES) {
    const uncId = `UNC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const uncEvent = createEvent(
      'UncertaintyAdded',
      uncId,
      'uncertainty',
      {
        decision_id: decisionId,
        description: unc.description,
        uncertainty_type: unc.uncertainty_type,
        impact_range: unc.impact_range,
      },
      'system',
      1
    );
    
    await store.append(streamId, [uncEvent], version);
    version++;
    
    steps.push({
      step: `Add Uncertainty: ${unc.uncertainty_type}`,
      endpoint: '/v1/uncertainties',
      method: 'POST',
      request: unc,
      response: { uncertainty_id: uncId, status: 'added' },
      events_emitted: ['UncertaintyAdded'],
      timestamp: new Date().toISOString(),
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 5: LINK EVIDENCE
  // ─────────────────────────────────────────────────────────────────
  
  for (const ev of EVIDENCE) {
    const evId = `EV-${Date.now()}`;
    const evEvent = createEvent(
      'EvidenceLinked',
      evId,
      'evidence',
      {
        decision_id: decisionId,
        source_type: ev.source_type,
        reference: ev.reference,
        validity_period: ev.validity_period,
      },
      'system',
      1
    );
    
    await store.append(streamId, [evEvent], version);
    version++;
    
    steps.push({
      step: 'Link Evidence',
      endpoint: '/v1/evidence',
      method: 'POST',
      request: ev,
      response: { evidence_id: evId, status: 'linked' },
      events_emitted: ['EvidenceLinked'],
      timestamp: new Date().toISOString(),
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 6: LEGITIMACY CHECK
  // ─────────────────────────────────────────────────────────────────
  
  const projection = await buildDecisionProjection(decisionId);
  
  const legitimacyCheck = {
    legitimate: projection?.legitimacy_status === 'legitimate',
    checks: {
      context_present: projection?.context_id !== null,
      alternatives_exposed: (projection?.alternatives.length ?? 0) >= 2,
      uncertainties_acknowledged: (projection?.uncertainties.length ?? 0) >= 1,
      scope_defined: projection?.scope.population_size !== '',
      time_defined: projection?.time_horizon.start !== '',
    },
  };
  
  steps.push({
    step: 'Legitimacy Check',
    endpoint: `/v1/decisions/${decisionId}/legitimacy`,
    method: 'GET',
    response: legitimacyCheck,
    events_emitted: [],
    timestamp: new Date().toISOString(),
  });

  // ─────────────────────────────────────────────────────────────────
  // STEP 7: LOCK DECISION
  // ─────────────────────────────────────────────────────────────────
  
  const lockedAt = '2026-01-15T10:00:00Z';
  const lockEvent = createEvent(
    'DecisionLocked',
    decisionId,
    'decision',
    {
      legitimacy_status: 'legitimate',
      locked_at: lockedAt,
      context_snapshot_id: projection?.context_id ?? '',
      alternatives_count: projection?.alternatives.length ?? 0,
      uncertainties_count: projection?.uncertainties.length ?? 0,
    },
    'system',
    1
  );
  
  await store.append(streamId, [lockEvent], version);
  version++;
  
  steps.push({
    step: 'Lock Decision',
    endpoint: `/v1/decisions/${decisionId}/lock`,
    method: 'POST',
    response: { status: 'locked', locked_at: lockedAt },
    events_emitted: ['DecisionLocked'],
    timestamp: new Date().toISOString(),
  });

  // ─────────────────────────────────────────────────────────────────
  // STEP 8: POST-DECISION REVIEW (simulated after 5 years)
  // ─────────────────────────────────────────────────────────────────
  
  const reviewId = `REV-${Date.now()}`;
  const reviewEvent = createEvent(
    'ReviewRecorded',
    reviewId,
    'review',
    {
      decision_id: decisionId,
      expected_vs_observed: REVIEW_REQUEST.expected_vs_observed,
      foreseeable_deviation: REVIEW_REQUEST.foreseeable_deviation,
      learnings: [...REVIEW_REQUEST.learnings],
    },
    'system',
    1
  );
  
  await store.append(streamId, [reviewEvent], version);
  
  steps.push({
    step: 'Post-Decision Review',
    endpoint: '/v1/reviews',
    method: 'POST',
    request: REVIEW_REQUEST,
    response: { review_id: reviewId, status: 'recorded' },
    events_emitted: ['ReviewRecorded'],
    timestamp: new Date().toISOString(),
  });

  // ─────────────────────────────────────────────────────────────────
  // FINAL
  // ─────────────────────────────────────────────────────────────────
  
  const finalProjection = await buildDecisionProjection(decisionId);
  const allEvents = await store.readAll();
  const endTime = performance.now();
  
  return {
    success: true,
    case_id: 'REF-001',
    total_events: allEvents.length,
    steps,
    final_projection: finalProjection,
    execution_time_ms: Math.round(endTime - startTime),
  };
}
