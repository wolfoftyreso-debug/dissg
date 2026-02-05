/**
 * EVENT STORE
 * 
 * Append-only event storage.
 * This is the SINGLE SOURCE OF TRUTH.
 * 
 * RULES:
 * - No event may ever be deleted
 * - No event may ever be modified
 * - All events have timestamps, checksums, global ordering
 */

import type { DomainEvent, StoredEvent, EventMetadata, EventType } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         EVENT STORE INTERFACE
// ═══════════════════════════════════════════════════════════════════

export interface EventStore {
  /**
   * Append events to a stream (APPEND-ONLY)
   */
  append(streamId: string, events: DomainEvent[], expectedVersion: number): Promise<void>;
  
  /**
   * Read events from a stream
   */
  readStream(streamId: string, fromVersion?: number): Promise<StoredEvent[]>;
  
  /**
   * Read all events (for projections)
   */
  readAll(fromPosition?: number): Promise<StoredEvent[]>;
  
  /**
   * Get current version of a stream
   */
  getStreamVersion(streamId: string): Promise<number>;
  
  /**
   * Subscribe to new events
   */
  subscribe(callback: (event: StoredEvent) => void): () => void;
}

// ═══════════════════════════════════════════════════════════════════
//                         IN-MEMORY IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════

/**
 * In-memory event store for development.
 * Production should use PostgreSQL, EventStoreDB, or Kafka.
 */
export class InMemoryEventStore implements EventStore {
  private events: StoredEvent[] = [];
  private streams: Map<string, StoredEvent[]> = new Map();
  private subscribers: Set<(event: StoredEvent) => void> = new Set();
  private globalPosition = 0;

  async append(streamId: string, events: DomainEvent[], expectedVersion: number): Promise<void> {
    const stream = this.streams.get(streamId) || [];
    const currentVersion = stream.length;
    
    // Optimistic concurrency check
    if (currentVersion !== expectedVersion) {
      throw new Error(
        `Concurrency conflict: expected version ${expectedVersion}, but stream is at ${currentVersion}`
      );
    }
    
    const storedEvents: StoredEvent[] = events.map((event, index) => {
      this.globalPosition++;
      const stored: StoredEvent = {
        event,
        metadata: {
          stored_at: new Date().toISOString(),
          stream_position: currentVersion + index + 1,
          global_position: this.globalPosition,
        },
      };
      return stored;
    });
    
    // Append to stream
    const newStream = [...stream, ...storedEvents];
    this.streams.set(streamId, newStream);
    
    // Append to global log
    this.events.push(...storedEvents);
    
    // Notify subscribers
    for (const stored of storedEvents) {
      for (const subscriber of this.subscribers) {
        subscriber(stored);
      }
    }
  }

  async readStream(streamId: string, fromVersion = 0): Promise<StoredEvent[]> {
    const stream = this.streams.get(streamId) || [];
    return stream.filter(e => e.metadata.stream_position > fromVersion);
  }

  async readAll(fromPosition = 0): Promise<StoredEvent[]> {
    return this.events.filter(e => e.metadata.global_position > fromPosition);
  }

  async getStreamVersion(streamId: string): Promise<number> {
    const stream = this.streams.get(streamId) || [];
    return stream.length;
  }

  subscribe(callback: (event: StoredEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  /**
   * Get all events (for debugging)
   */
  getAllEvents(): StoredEvent[] {
    return [...this.events];
  }
  
  /**
   * Get event count
   */
  getEventCount(): number {
    return this.events.length;
  }
}

// ═══════════════════════════════════════════════════════════════════
//                         HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate event checksum
 */
export function generateChecksum(event: DomainEvent): string {
  const content = JSON.stringify({
    event_type: event.event_type,
    aggregate_id: event.aggregate_id,
    timestamp: event.timestamp,
    payload: event.payload,
  });
  
  // Simple hash for demo - use crypto.subtle in production
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Create a new event with proper metadata
 */
export function createEvent<T extends DomainEvent>(
  eventType: T['event_type'],
  aggregateId: string,
  aggregateType: T['aggregate_type'],
  payload: T['payload'],
  actor: string,
  version: number
): T {
  const event = {
    event_id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    event_type: eventType,
    aggregate_id: aggregateId,
    aggregate_type: aggregateType,
    timestamp: new Date().toISOString(),
    version,
    checksum: '', // Will be set below
    actor,
    payload,
  } as T;
  
  // Set checksum
  (event as any).checksum = generateChecksum(event);
  
  return event;
}

/**
 * Singleton event store instance
 */
let eventStoreInstance: EventStore | null = null;

export function getEventStore(): EventStore {
  if (!eventStoreInstance) {
    eventStoreInstance = new InMemoryEventStore();
  }
  return eventStoreInstance;
}

export function resetEventStore(): void {
  eventStoreInstance = new InMemoryEventStore();
}
