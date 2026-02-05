 /**
  * COMMANDS
  * 
  * Intent to change state. Commands are validated before events are emitted.
  */
 
 import type { DecisionId, ObservationId } from '../ontology/types';
 
 // ============================================================================
 // BASE COMMAND
 // ============================================================================
 
 export interface BaseCommand {
   readonly command_id: string;
   readonly command_type: string;
   readonly timestamp: string;
   readonly actor: string;
 }
 
 // ============================================================================
 // DECISION COMMANDS
 // ============================================================================
 
 export interface CreateDecisionCommand extends BaseCommand {
   readonly command_type: 'CreateDecision';
   readonly payload: {
     readonly title: string;
     readonly description: string;
     readonly geo_scope: string;
   };
 }
 
 export interface PublishDecisionCommand extends BaseCommand {
   readonly command_type: 'PublishDecision';
   readonly payload: {
     readonly decision_id: DecisionId;
   };
 }
 
 export interface LockDecisionCommand extends BaseCommand {
   readonly command_type: 'LockDecision';
   readonly payload: {
     readonly decision_id: DecisionId;
     readonly reason: string;
   };
 }
 
 // ============================================================================
 // OBSERVATION COMMANDS
 // ============================================================================
 
 export interface RecordObservationCommand extends BaseCommand {
   readonly command_type: 'RecordObservation';
   readonly payload: {
     readonly indicator_id: string;
     readonly value: number | null;
     readonly time: string;
     readonly source_id: string;
     readonly confidence: number;
   };
 }
 
 export interface CorrectObservationCommand extends BaseCommand {
   readonly command_type: 'CorrectObservation';
   readonly payload: {
     readonly observation_id: ObservationId;
     readonly new_value: number | null;
     readonly correction_reason: string;
   };
 }
 
 // ============================================================================
 // COMMAND UNION
 // ============================================================================
 
 export type Command =
   | CreateDecisionCommand
   | PublishDecisionCommand
   | LockDecisionCommand
   | RecordObservationCommand
   | CorrectObservationCommand;
 
 export type CommandType = Command['command_type'];
 
 // ============================================================================
 // COMMAND RESULT
 // ============================================================================
 
 export interface CommandResult {
   readonly success: boolean;
   readonly command_id: string;
   readonly events_emitted: readonly string[];
   readonly errors: readonly string[];
 }