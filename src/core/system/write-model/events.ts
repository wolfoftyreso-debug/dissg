 /**
  * DOMAIN EVENTS
  * 
  * All changes are events. Events are immutable facts.
  */
 
 import type { HashId, DecisionId, EntityId, TimePoint, ObservationId } from '../ontology/types';
 
 // ============================================================================
 // BASE EVENT
 // ============================================================================
 
 export interface BaseEvent {
   readonly event_id: string;
   readonly event_type: string;
   readonly timestamp: string;
   readonly version: number;
   readonly hash: HashId;
   readonly previous_hash: HashId | null;
   readonly actor: string;
 }
 
 // ============================================================================
 // DECISION EVENTS
 // ============================================================================
 
 export interface DecisionCreatedEvent extends BaseEvent {
   readonly event_type: 'DecisionCreated';
   readonly payload: {
     readonly decision_id: DecisionId;
     readonly title: string;
     readonly description: string;
     readonly geo_scope: string;
   };
 }
 
 export interface DecisionPublishedEvent extends BaseEvent {
   readonly event_type: 'DecisionPublished';
   readonly payload: {
     readonly decision_id: DecisionId;
     readonly published_at: string;
     readonly coverage_percent: number;
   };
 }
 
 export interface DecisionLockedEvent extends BaseEvent {
   readonly event_type: 'DecisionLocked';
   readonly payload: {
     readonly decision_id: DecisionId;
     readonly locked_at: string;
     readonly reason: string;
     readonly final_hash: HashId;
   };
 }
 
 export interface DecisionSupersededEvent extends BaseEvent {
   readonly event_type: 'DecisionSuperseded';
   readonly payload: {
     readonly old_decision_id: DecisionId;
     readonly new_decision_id: DecisionId;
     readonly reason: string;
   };
 }
 
 // ============================================================================
 // OBSERVATION EVENTS
 // ============================================================================
 
 export interface ObservationRecordedEvent extends BaseEvent {
   readonly event_type: 'ObservationRecorded';
   readonly payload: {
     readonly observation_id: ObservationId;
     readonly indicator_id: string;
     readonly value: number | null;
     readonly time: string;
     readonly source_id: string;
   };
 }
 
 export interface ObservationCorrectedEvent extends BaseEvent {
   readonly event_type: 'ObservationCorrected';
   readonly payload: {
     readonly observation_id: ObservationId;
     readonly old_value: number | null;
     readonly new_value: number | null;
     readonly correction_reason: string;
     readonly source_id: string;
   };
 }
 
 // ============================================================================
 // SYSTEM EVENTS
 // ============================================================================
 
 export interface CharterViolationEvent extends BaseEvent {
   readonly event_type: 'CharterViolation';
   readonly payload: {
     readonly article_number: number;
     readonly violation_description: string;
     readonly action_taken: 'warn' | 'block' | 'shutdown';
     readonly context: string;
   };
 }
 
 export interface SystemStateChangedEvent extends BaseEvent {
   readonly event_type: 'SystemStateChanged';
   readonly payload: {
     readonly old_state: string;
     readonly new_state: string;
     readonly reason: string;
   };
 }
 
 // ============================================================================
 // EVENT UNION
 // ============================================================================
 
 export type DomainEvent =
   | DecisionCreatedEvent
   | DecisionPublishedEvent
   | DecisionLockedEvent
   | DecisionSupersededEvent
   | ObservationRecordedEvent
   | ObservationCorrectedEvent
   | CharterViolationEvent
   | SystemStateChangedEvent;
 
 export type EventType = DomainEvent['event_type'];