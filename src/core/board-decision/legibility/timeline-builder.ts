/**
 * DECISION TIMELINE BUILDER
 * 
 * Time is linear and irrevocable.
 * No jumping back and forth.
 */

import type { DecisionPreparationDocument } from '../types';
import type { 
  DecisionTimeline, 
  TimelineEvent, 
  TimelineEventType 
} from './types';
import { generateChecksum } from '../workflow/utils';

/**
 * Timeline stage order (fixed, cannot be reordered)
 */
const TIMELINE_ORDER: TimelineEventType[] = [
  'context_established',
  'alternatives_identified',
  'uncertainties_surfaced',
  'decision_locked',
  'outcome_observed',
];

/**
 * Create new decision timeline
 */
export function createTimeline(decisionId: string): DecisionTimeline {
  return {
    decision_id: decisionId,
    events: [],
    is_complete: false,
    missing_stages: [...TIMELINE_ORDER],
  };
}

/**
 * Add event to timeline
 * Validates chronological order
 */
export function addTimelineEvent(
  timeline: DecisionTimeline,
  eventType: TimelineEventType,
  description: string,
  actor: string
): { success: boolean; error?: string; timeline: DecisionTimeline } {
  // Check if event already exists
  if (timeline.events.find(e => e.event_type === eventType)) {
    return {
      success: false,
      error: `Event ${eventType} already exists in timeline`,
      timeline,
    };
  }
  
  // Validate chronological order
  const expectedIndex = TIMELINE_ORDER.indexOf(eventType);
  const lastEventIndex = timeline.events.length > 0
    ? TIMELINE_ORDER.indexOf(timeline.events[timeline.events.length - 1].event_type)
    : -1;
  
  if (expectedIndex !== lastEventIndex + 1) {
    const expectedEvent = TIMELINE_ORDER[lastEventIndex + 1];
    return {
      success: false,
      error: `Timeline violation: Expected ${expectedEvent}, got ${eventType}. Time is linear.`,
      timeline,
    };
  }
  
  // Create event
  const event: TimelineEvent = {
    event_type: eventType,
    timestamp: new Date().toISOString(),
    description,
    actor,
    checksum: generateChecksum({ eventType, description, actor, timestamp: Date.now() }),
  };
  
  // Update timeline
  const updatedEvents = [...timeline.events, event];
  const missingStages = TIMELINE_ORDER.filter(
    stage => !updatedEvents.find(e => e.event_type === stage)
  );
  
  return {
    success: true,
    timeline: {
      ...timeline,
      events: updatedEvents,
      is_complete: missingStages.length === 0,
      missing_stages: missingStages,
    },
  };
}

/**
 * Build timeline from DPD (for existing decisions)
 */
export function buildTimelineFromDPD(
  dpd: DecisionPreparationDocument,
  actor: string
): DecisionTimeline {
  let timeline = createTimeline(dpd.dpd_id);
  
  // Context established
  const contextResult = addTimelineEvent(
    timeline,
    'context_established',
    `Decision context: ${dpd.overview.decision_subject}`,
    actor
  );
  timeline = contextResult.timeline;
  
  // Alternatives identified
  if (dpd.alternatives.length > 0) {
    const altResult = addTimelineEvent(
      timeline,
      'alternatives_identified',
      `${dpd.alternatives.length} alternatives documented: ${dpd.alternatives.map(a => a.id).join(', ')}`,
      actor
    );
    timeline = altResult.timeline;
  }
  
  // Uncertainties surfaced
  if (dpd.knowledge_status.uncertain.length > 0 || dpd.knowledge_status.unknown.length > 0) {
    const uncResult = addTimelineEvent(
      timeline,
      'uncertainties_surfaced',
      `${dpd.knowledge_status.uncertain.length} uncertainties, ${dpd.knowledge_status.unknown.length} unknowns documented`,
      actor
    );
    timeline = uncResult.timeline;
  }
  
  return timeline;
}

/**
 * Lock decision in timeline
 */
export function lockDecisionInTimeline(
  timeline: DecisionTimeline,
  decisionTaken: string,
  actor: string
): { success: boolean; error?: string; timeline: DecisionTimeline } {
  return addTimelineEvent(
    timeline,
    'decision_locked',
    `Decision locked: Alternative ${decisionTaken} selected`,
    actor
  );
}

/**
 * Record outcome observation
 */
export function recordOutcomeInTimeline(
  timeline: DecisionTimeline,
  outcomeDescription: string,
  actor: string
): { success: boolean; error?: string; timeline: DecisionTimeline } {
  return addTimelineEvent(
    timeline,
    'outcome_observed',
    outcomeDescription,
    actor
  );
}

/**
 * Validate timeline integrity
 */
export function validateTimelineIntegrity(timeline: DecisionTimeline): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check chronological order
  for (let i = 0; i < timeline.events.length; i++) {
    const event = timeline.events[i];
    const expectedType = TIMELINE_ORDER[i];
    
    if (event.event_type !== expectedType) {
      errors.push(`Event ${i} should be ${expectedType}, found ${event.event_type}`);
    }
    
    // Check timestamps are ascending
    if (i > 0) {
      const prevTimestamp = new Date(timeline.events[i - 1].timestamp).getTime();
      const currTimestamp = new Date(event.timestamp).getTime();
      
      if (currTimestamp < prevTimestamp) {
        errors.push(`Event ${i} has earlier timestamp than event ${i - 1}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * TIMELINE BUILDER MASTERPROMPT
 */
export const TIMELINE_BUILDER_MASTERPROMPT = `
You manage decision timelines.

ABSOLUTE RULE: Time is linear and irrevocable.

FIXED ORDER:
1. context_established
2. alternatives_identified
3. uncertainties_surfaced
4. decision_locked
5. outcome_observed

You CANNOT:
- Skip stages
- Reorder stages
- Go back in time
- Modify past events

Each event is checksummed.
Each event has a timestamp.
No jumping back and forth.

This protects against:
- Retrospective rationalization
- Narrative manipulation
- History rewriting
`;
