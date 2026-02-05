 /**
  * EVENT STORE
  * 
  * Append-only store with hash chaining.
  * History CANNOT be changed.
  */
 
 import type { DomainEvent, EventType } from './events';
 import type { HashId } from '../ontology/types';
 
 // ============================================================================
 // EVENT STORE STATE
 // ============================================================================
 
 interface EventStoreState {
   events: DomainEvent[];
   lastHash: HashId | null;
   version: number;
 }
 
 const store: EventStoreState = {
   events: [],
   lastHash: null,
   version: 0,
 };
 
 // ============================================================================
 // APPEND (THE ONLY WRITE OPERATION)
 // ============================================================================
 
 export function appendEvents(events: readonly DomainEvent[]): void {
   for (const event of events) {
     // Verify hash chain
     if (store.lastHash !== null && event.previous_hash !== store.lastHash) {
       throw new Error(`Hash chain broken! Expected ${store.lastHash}, got ${event.previous_hash}`);
     }
     
     store.events.push(event);
     store.lastHash = event.hash;
     store.version++;
   }
 }
 
 // ============================================================================
 // READ OPERATIONS
 // ============================================================================
 
 export function getEvents(): readonly DomainEvent[] {
   return [...store.events];
 }
 
 export function getEventsByType<T extends EventType>(type: T): DomainEvent[] {
   return store.events.filter(e => e.event_type === type);
 }
 
 export function getEventsAfter(hash: HashId): DomainEvent[] {
   const index = store.events.findIndex(e => e.hash === hash);
   if (index === -1) return [];
   return store.events.slice(index + 1);
 }
 
 export function getEventsBefore(hash: HashId): DomainEvent[] {
   const index = store.events.findIndex(e => e.hash === hash);
   if (index === -1) return [];
   return store.events.slice(0, index);
 }
 
 export function getLastHash(): HashId | null {
   return store.lastHash;
 }
 
 export function getVersion(): number {
   return store.version;
 }
 
 // ============================================================================
 // REPLAY
 // ============================================================================
 
 export type EventProjector<T> = (state: T, event: DomainEvent) => T;
 
 export function replay<T>(
   initialState: T,
   projector: EventProjector<T>,
   upToHash?: HashId
 ): T {
   let state = initialState;
   
   for (const event of store.events) {
     state = projector(state, event);
     if (upToHash && event.hash === upToHash) break;
   }
   
   return state;
 }
 
 // ============================================================================
 // VERIFICATION
 // ============================================================================
 
 export function verifyHashChain(): { valid: boolean; brokenAt?: number } {
   let expectedPrevious: HashId | null = null;
   
   for (let i = 0; i < store.events.length; i++) {
     const event = store.events[i];
     
     if (event.previous_hash !== expectedPrevious) {
       return { valid: false, brokenAt: i };
     }
     
     expectedPrevious = event.hash;
   }
   
   return { valid: true };
 }
 
 export function getEventCount(): number {
   return store.events.length;
 }
 
 // ============================================================================
 // SNAPSHOT (FOR READ MODELS)
 // ============================================================================
 
 export interface EventStoreSnapshot {
   readonly hash: HashId | null;
   readonly version: number;
   readonly event_count: number;
   readonly taken_at: string;
 }
 
 export function takeSnapshot(): EventStoreSnapshot {
   return {
     hash: store.lastHash,
     version: store.version,
     event_count: store.events.length,
     taken_at: new Date().toISOString(),
   };
 }