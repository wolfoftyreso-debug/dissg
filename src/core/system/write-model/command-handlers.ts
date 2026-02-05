/**
 * COMMAND HANDLERS
 * 
 * Process commands and emit events.
 * Command → Validate → Event → Persist
 * 
 * If validation fails → NO EVENT is created.
 */

import type { Command, CommandResult } from './commands';
import type { DomainEvent } from '../events/types';
import { getEventStore, createEvent } from '../events/event-store';
import { checkLegitimacy, computeLegitimacyStatus, getMissingRequirements } from '../../ontology/legitimacy-engine';
import { validateNoForbiddenConcepts } from '../../ontology/forbidden';

// ═══════════════════════════════════════════════════════════════════
//                         DECISION STATE (for validation)
// ═══════════════════════════════════════════════════════════════════

interface DecisionState {
  id: string;
  status: 'draft' | 'locked';
  context_id: string | null;
  alternatives_count: number;
  uncertainties_count: number;
  scope: { population_size: string; reversibility: string } | null;
  time_horizon: { start: string; end: string | null } | null;
}

/**
 * Rebuild decision state from events
 */
async function getDecisionState(decisionId: string): Promise<DecisionState | null> {
  const store = getEventStore();
  const events = await store.readStream(`decision-${decisionId}`);
  
  if (events.length === 0) return null;
  
  const state: DecisionState = {
    id: decisionId,
    status: 'draft',
    context_id: null,
    alternatives_count: 0,
    uncertainties_count: 0,
    scope: null,
    time_horizon: null,
  };
  
  for (const { event } of events) {
    switch (event.event_type) {
      case 'DecisionCreated':
        state.scope = event.payload.scope;
        state.time_horizon = event.payload.time_horizon;
        break;
      case 'ContextAttached':
        state.context_id = event.aggregate_id;
        break;
      case 'AlternativeAdded':
        state.alternatives_count++;
        break;
      case 'UncertaintyAdded':
        state.uncertainties_count++;
        break;
      case 'DecisionLocked':
        state.status = 'locked';
        break;
    }
  }
  
  return state;
}

// ═══════════════════════════════════════════════════════════════════
//                         COMMAND HANDLER
// ═══════════════════════════════════════════════════════════════════

export async function handleCommand(command: Command): Promise<CommandResult> {
  const store = getEventStore();
  const eventsEmitted: string[] = [];
  const errors: string[] = [];

  try {
    switch (command.command_type) {
      // ────────────────────────────────────────────────────────────
      //                     CREATE DECISION
      // ────────────────────────────────────────────────────────────
      case 'CreateDecision': {
        const streamId = `decision-${command.command_id}`;
        const version = await store.getStreamVersion(streamId);
        
        if (version > 0) {
          errors.push('Decision already exists');
          break;
        }
        
        // Validate no forbidden concepts
        const forbiddenCheck = validateNoForbiddenConcepts({
          title: command.payload.title,
          description: command.payload.description,
        });
        
        if (!forbiddenCheck.valid) {
          errors.push(...forbiddenCheck.violations.map(v => `Forbidden concept: ${v}`));
          break;
        }
        
        const event = createEvent(
          'DecisionCreated',
          command.command_id,
          'decision',
          {
            decision_type: 'policy',
            scope: {
              population_size: 'regional',
              reversibility: 'medium',
            },
            time_horizon: {
              start: new Date().toISOString(),
              end: null,
            },
          },
          command.actor,
          1
        );
        
        await store.append(streamId, [event], 0);
        eventsEmitted.push(event.event_id);
        break;
      }

      // ────────────────────────────────────────────────────────────
      //                     LOCK DECISION
      // ────────────────────────────────────────────────────────────
      case 'LockDecision': {
        const state = await getDecisionState(command.payload.decision_id);
        
        if (!state) {
          errors.push('Decision not found');
          break;
        }
        
        if (state.status === 'locked') {
          errors.push('Decision is already locked');
          break;
        }
        
        // Run legitimacy check
        const legitimacyCheck = {
          context_present: state.context_id !== null,
          alternatives_exposed: state.alternatives_count >= 2,
          uncertainties_acknowledged: state.uncertainties_count >= 1,
          scope_defined: state.scope !== null,
          time_defined: state.time_horizon !== null,
        };
        
        const status = computeLegitimacyStatus(legitimacyCheck);
        
        if (status !== 'legitimate') {
          // Emit rejection event
          const missing = getMissingRequirements(legitimacyCheck);
          const rejectEvent = createEvent(
            'DecisionLockRejected',
            state.id,
            'decision',
            {
              missing_requirements: missing,
              attempted_at: new Date().toISOString(),
            },
            command.actor,
            0
          );
          
          const streamId = `decision-${state.id}`;
          const version = await store.getStreamVersion(streamId);
          await store.append(streamId, [rejectEvent], version);
          
          errors.push(...missing);
          eventsEmitted.push(rejectEvent.event_id);
          break;
        }
        
        // Lock the decision
        const lockEvent = createEvent(
          'DecisionLocked',
          state.id,
          'decision',
          {
            legitimacy_status: 'legitimate',
            locked_at: new Date().toISOString(),
            context_snapshot_id: state.context_id!,
            alternatives_count: state.alternatives_count,
            uncertainties_count: state.uncertainties_count,
          },
          command.actor,
          0
        );
        
        const streamId = `decision-${state.id}`;
        const version = await store.getStreamVersion(streamId);
        await store.append(streamId, [lockEvent], version);
        eventsEmitted.push(lockEvent.event_id);
        break;
      }

      default:
        errors.push(`Unknown command type: ${(command as any).command_type}`);
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return {
    success: errors.length === 0,
    command_id: command.command_id,
    events_emitted: eventsEmitted,
    errors,
  };
}
