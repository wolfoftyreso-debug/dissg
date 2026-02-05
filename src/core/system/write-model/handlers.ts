 /**
  * COMMAND HANDLERS
  * 
  * Process commands and emit events.
  */
 
 import type { Command, CommandResult, CreateDecisionCommand, PublishDecisionCommand, LockDecisionCommand } from './commands';
 import type { DomainEvent, DecisionCreatedEvent, DecisionPublishedEvent, DecisionLockedEvent } from './events';
 import type { HashId, DecisionId } from '../ontology/types';
 import { isWriteAllowed } from '../charter/enforcement';
 
 // ============================================================================
 // HASH GENERATOR
 // ============================================================================
 
 function generateHash(data: string): HashId {
   // In production, use actual SHA-256
   const hash = Array.from(data)
     .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
     .toString(16)
     .padStart(64, '0');
   return `SHA256-${hash}` as HashId;
 }
 
 function generateId(prefix: string): string {
   return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
 }
 
 // ============================================================================
 // HANDLER REGISTRY
 // ============================================================================
 
 type CommandHandler<T extends Command> = (
   command: T,
   previousHash: HashId | null
 ) => { events: DomainEvent[]; result: CommandResult };
 
 const handlers: Map<string, CommandHandler<Command>> = new Map();
 
 // ============================================================================
 // DECISION HANDLERS
 // ============================================================================
 
 function handleCreateDecision(
   command: CreateDecisionCommand,
   previousHash: HashId | null
 ): { events: DomainEvent[]; result: CommandResult } {
   if (!isWriteAllowed()) {
     return {
       events: [],
       result: {
         success: false,
         command_id: command.command_id,
         events_emitted: [],
         errors: ['System is in read-only mode'],
       },
     };
   }
   
   const decisionId = generateId('DEC') as DecisionId;
   const eventId = generateId('EVT');
   const timestamp = new Date().toISOString();
   
   const eventData = JSON.stringify({
     eventId,
     type: 'DecisionCreated',
     decisionId,
     ...command.payload,
     timestamp,
   });
   
   const hash = generateHash(eventData + (previousHash || ''));
   
   const event: DecisionCreatedEvent = {
     event_id: eventId,
     event_type: 'DecisionCreated',
     timestamp,
     version: 1,
     hash,
     previous_hash: previousHash,
     actor: command.actor,
     payload: {
       decision_id: decisionId,
       title: command.payload.title,
       description: command.payload.description,
       geo_scope: command.payload.geo_scope,
     },
   };
   
   return {
     events: [event],
     result: {
       success: true,
       command_id: command.command_id,
       events_emitted: [eventId],
       errors: [],
     },
   };
 }
 
 function handlePublishDecision(
   command: PublishDecisionCommand,
   previousHash: HashId | null
 ): { events: DomainEvent[]; result: CommandResult } {
   if (!isWriteAllowed()) {
     return {
       events: [],
       result: {
         success: false,
         command_id: command.command_id,
         events_emitted: [],
         errors: ['System is in read-only mode'],
       },
     };
   }
   
   const eventId = generateId('EVT');
   const timestamp = new Date().toISOString();
   const hash = generateHash(JSON.stringify(command) + (previousHash || ''));
   
   const event: DecisionPublishedEvent = {
     event_id: eventId,
     event_type: 'DecisionPublished',
     timestamp,
     version: 1,
     hash,
     previous_hash: previousHash,
     actor: command.actor,
     payload: {
       decision_id: command.payload.decision_id,
       published_at: timestamp,
       coverage_percent: 0, // Would be calculated from actual data
     },
   };
   
   return {
     events: [event],
     result: {
       success: true,
       command_id: command.command_id,
       events_emitted: [eventId],
       errors: [],
     },
   };
 }
 
 function handleLockDecision(
   command: LockDecisionCommand,
   previousHash: HashId | null
 ): { events: DomainEvent[]; result: CommandResult } {
   const eventId = generateId('EVT');
   const timestamp = new Date().toISOString();
   const hash = generateHash(JSON.stringify(command) + (previousHash || ''));
   
   const event: DecisionLockedEvent = {
     event_id: eventId,
     event_type: 'DecisionLocked',
     timestamp,
     version: 1,
     hash,
     previous_hash: previousHash,
     actor: command.actor,
     payload: {
       decision_id: command.payload.decision_id,
       locked_at: timestamp,
       reason: command.payload.reason,
       final_hash: hash,
     },
   };
   
   return {
     events: [event],
     result: {
       success: true,
       command_id: command.command_id,
       events_emitted: [eventId],
       errors: [],
     },
   };
 }
 
 // Register handlers
 handlers.set('CreateDecision', handleCreateDecision as CommandHandler<Command>);
 handlers.set('PublishDecision', handlePublishDecision as CommandHandler<Command>);
 handlers.set('LockDecision', handleLockDecision as CommandHandler<Command>);
 
 // ============================================================================
 // DISPATCH
 // ============================================================================
 
 export function dispatchCommand(
   command: Command,
   previousHash: HashId | null
 ): { events: DomainEvent[]; result: CommandResult } {
   const handler = handlers.get(command.command_type);
   
   if (!handler) {
     return {
       events: [],
       result: {
         success: false,
         command_id: command.command_id,
         events_emitted: [],
         errors: [`No handler for command type: ${command.command_type}`],
       },
     };
   }
   
   return handler(command, previousHash);
 }