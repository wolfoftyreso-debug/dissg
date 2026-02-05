/**
 * EVENT TYPES
 * 
 * All domain events in the Decision Legitimacy System.
 * Events are IMMUTABLE. No event may ever be deleted.
 */

// ═══════════════════════════════════════════════════════════════════
//                         BASE EVENT
// ═══════════════════════════════════════════════════════════════════

export interface BaseEvent {
  readonly event_id: string;
  readonly event_type: string;
  readonly aggregate_id: string;
  readonly aggregate_type: 'decision' | 'context' | 'alternative' | 'uncertainty' | 'evidence' | 'review';
  readonly timestamp: string;
  readonly version: number;
  readonly checksum: string;
  readonly actor: string;       // Who caused this event
  readonly causation_id?: string; // What command caused this
  readonly correlation_id?: string; // Request chain
}

// ═══════════════════════════════════════════════════════════════════
//                         DECISION EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface DecisionCreatedEvent extends BaseEvent {
  readonly event_type: 'DecisionCreated';
  readonly aggregate_type: 'decision';
  readonly payload: {
    readonly decision_type: string;
    readonly scope: {
      readonly population_size: string;
      readonly reversibility: string;
    };
    readonly time_horizon: {
      readonly start: string;
      readonly end: string | null;
    };
  };
}

export interface DecisionLockedEvent extends BaseEvent {
  readonly event_type: 'DecisionLocked';
  readonly aggregate_type: 'decision';
  readonly payload: {
    readonly legitimacy_status: 'legitimate';
    readonly locked_at: string;
    readonly context_snapshot_id: string;
    readonly alternatives_count: number;
    readonly uncertainties_count: number;
  };
}

export interface DecisionLockRejectedEvent extends BaseEvent {
  readonly event_type: 'DecisionLockRejected';
  readonly aggregate_type: 'decision';
  readonly payload: {
    readonly missing_requirements: string[];
    readonly attempted_at: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         CONTEXT EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface ContextAttachedEvent extends BaseEvent {
  readonly event_type: 'ContextAttached';
  readonly aggregate_type: 'context';
  readonly payload: {
    readonly decision_id: string;
    readonly description: string;
    readonly affected_population: string;
    readonly geographic_scope: string;
    readonly assumptions: ReadonlyArray<{
      readonly text: string;
      readonly is_testable: boolean;
    }>;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         ALTERNATIVE EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface AlternativeAddedEvent extends BaseEvent {
  readonly event_type: 'AlternativeAdded';
  readonly aggregate_type: 'alternative';
  readonly payload: {
    readonly decision_id: string;
    readonly label: string;
    readonly description: string;
    readonly trade_offs: ReadonlyArray<{
      readonly dimension: string;
      readonly effect: string;
    }>;
    readonly required_assumptions: readonly string[];
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         UNCERTAINTY EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface UncertaintyAddedEvent extends BaseEvent {
  readonly event_type: 'UncertaintyAdded';
  readonly aggregate_type: 'uncertainty';
  readonly payload: {
    readonly decision_id: string;
    readonly description: string;
    readonly uncertainty_type: string;
    readonly impact_range: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         EVIDENCE EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface EvidenceLinkedEvent extends BaseEvent {
  readonly event_type: 'EvidenceLinked';
  readonly aggregate_type: 'evidence';
  readonly payload: {
    readonly decision_id: string;
    readonly source_type: string;
    readonly reference: string;
    readonly validity_period: {
      readonly start: string;
      readonly end: string | null;
    };
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         REVIEW EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface ReviewRecordedEvent extends BaseEvent {
  readonly event_type: 'ReviewRecorded';
  readonly aggregate_type: 'review';
  readonly payload: {
    readonly decision_id: string;
    readonly expected_vs_observed: string;
    readonly foreseeable_deviation: boolean;
    readonly learnings: readonly string[];
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         EVENT UNION
// ═══════════════════════════════════════════════════════════════════

export type DomainEvent =
  | DecisionCreatedEvent
  | DecisionLockedEvent
  | DecisionLockRejectedEvent
  | ContextAttachedEvent
  | AlternativeAddedEvent
  | UncertaintyAddedEvent
  | EvidenceLinkedEvent
  | ReviewRecordedEvent;

export type EventType = DomainEvent['event_type'];

// ═══════════════════════════════════════════════════════════════════
//                         EVENT METADATA
// ═══════════════════════════════════════════════════════════════════

export interface EventMetadata {
  readonly stored_at: string;
  readonly stream_position: number;
  readonly global_position: number;
}

export interface StoredEvent<T extends DomainEvent = DomainEvent> {
  readonly event: T;
  readonly metadata: EventMetadata;
}
