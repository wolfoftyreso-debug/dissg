 /**
  * ENTITY DEFINITIONS
  * 
  * Core entity types in the ontology.
  */
 
 import type { EntityId, DecisionId, TimePoint, GeoScope, Confidence, HashId } from './types';
 
 // ============================================================================
 // DECISION ENTITY
 // ============================================================================
 
 export type DecisionStatus = 
   | 'draft'
   | 'in_review'
   | 'published'
   | 'locked'
   | 'superseded'
   | 'withdrawn';
 
 export interface Decision {
   readonly id: DecisionId;
   readonly entity_id: EntityId;
   readonly title: string;
   readonly title_sv: string;
   readonly description: string;
   readonly status: DecisionStatus;
   readonly created_at: TimePoint;
   readonly locked_at?: TimePoint;
   readonly geo_scope: GeoScope;
   readonly confidence: Confidence;
   readonly hash: HashId;
   readonly previous_hash?: HashId;
 }
 
 // ============================================================================
 // DECISION POINT
 // ============================================================================
 
 export interface DecisionPoint {
   readonly id: EntityId;
   readonly decision_id: DecisionId;
   readonly question: string;
   readonly question_sv: string;
   readonly options: readonly DecisionOption[];
   readonly context_required: readonly string[];
   readonly cannot_answer_reasons?: readonly string[];
 }
 
 export interface DecisionOption {
   readonly id: string;
   readonly label: string;
   readonly label_sv: string;
   readonly implications: readonly string[];
   readonly data_support: number; // 0.0 - 1.0
 }
 
 // ============================================================================
 // ACTOR ENTITY
 // ============================================================================
 
 export type ActorType = 
   | 'institution'
   | 'organization'
   | 'agency'
   | 'municipality'
   | 'region'
   | 'state';
 
 export interface Actor {
   readonly id: EntityId;
   readonly type: ActorType;
   readonly name: string;
   readonly name_sv: string;
   readonly jurisdiction: GeoScope;
   readonly responsibilities: readonly string[];
 }
 
 // ============================================================================
 // CDP (CANONICAL DECISION PAGE)
 // ============================================================================
 
 export interface CDP {
   readonly id: EntityId;
   readonly decision_id: DecisionId;
   readonly slug: string;
   readonly canonical_url: string;
   readonly version: number;
   readonly published_at?: TimePoint;
   readonly coverage_percent: number;
   readonly can_answer: boolean;
   readonly gaps: readonly string[];
 }