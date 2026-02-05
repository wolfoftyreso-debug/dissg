 /**
  * ONTOLOGY RELATIONS
  * 
  * How entities relate to each other.
  */
 
 import type { EntityId, IndicatorId, DecisionId } from './types';
 
 // ============================================================================
 // RELATION TYPES
 // ============================================================================
 
 export type RelationType =
   | 'depends_on'        // A depends on B
   | 'contradicts'       // A contradicts B
   | 'supports'          // A provides evidence for B
   | 'supersedes'        // A replaces B
   | 'part_of'           // A is part of B
   | 'measured_by'       // A is measured by B
   | 'affects'           // A affects B (observed co-movement, NOT causation)
   | 'related_to';       // Generic relation
 
 // ============================================================================
 // RELATION DEFINITION
 // ============================================================================
 
 export interface Relation {
   readonly id: string;
   readonly type: RelationType;
   readonly source_id: EntityId | IndicatorId | DecisionId;
   readonly target_id: EntityId | IndicatorId | DecisionId;
   readonly strength: number; // 0.0 - 1.0
   readonly bidirectional: boolean;
   readonly evidence_ids: readonly string[];
   readonly created_at: string;
 }
 
 // ============================================================================
 // INDICATOR RELATIONS
 // ============================================================================
 
 export interface IndicatorRelation {
   readonly source_indicator: IndicatorId;
   readonly target_indicator: IndicatorId;
   readonly relation_type: 'co_movement' | 'leading' | 'lagging' | 'component';
   readonly lag_periods?: number;
   readonly correlation_coefficient?: number;
   readonly time_range: string;
   readonly is_causal: false; // ALWAYS FALSE - we never claim causation
 }
 
 // ============================================================================
 // DECISION RELATIONS
 // ============================================================================
 
 export interface DecisionRelation {
   readonly source_decision: DecisionId;
   readonly target_decision: DecisionId;
   readonly relation_type: 'prerequisite' | 'alternative' | 'consequence' | 'supersedes';
   readonly description: string;
 }