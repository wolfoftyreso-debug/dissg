/**
 * DECISION LEGIBILITY LAYER
 * 
 * Decisions that can be understood in 30 years.
 * Not traceability. Cognitive clarity in hindsight.
 */

// Types
export type {
  DecisionLegibilityScore,
  LegibilityGap,
  DecisionSummary,
  TimelineEvent,
  TimelineEventType,
  DecisionTimeline,
  CollectiveMemoryPattern,
  CollectiveMemoryResult,
  LegibilityAudit,
  MythIndicator,
} from './types';

// Legibility Scorer
export {
  calculateLegibilityScore,
  LEGIBILITY_SCORER_MASTERPROMPT,
} from './legibility-scorer';

// Summary Generator
export {
  generateDecisionSummary,
  validateSummaryImmutability,
  SUMMARY_GENERATOR_MASTERPROMPT,
} from './summary-generator';

// Timeline Builder
export {
  createTimeline,
  addTimelineEvent,
  buildTimelineFromDPD,
  lockDecisionInTimeline,
  recordOutcomeInTimeline,
  validateTimelineIntegrity,
  TIMELINE_BUILDER_MASTERPROMPT,
} from './timeline-builder';

// Collective Memory
export {
  addToCollectiveMemory,
  queryHowDidWeDecide,
  queryWhatDidWeMiss,
  queryRecurringUncertainties,
  COLLECTIVE_MEMORY_MASTERPROMPT,
} from './collective-memory';

// Myth Detector
export {
  detectMythIndicators,
  sanitizeMythLanguage,
  validateMythFree,
  MYTH_DETECTOR_MASTERPROMPT,
} from './myth-detector';

/**
 * DECISION LEGIBILITY LAYER MASTERPROMPT
 */
export const LEGIBILITY_LAYER_MASTERPROMPT = `
You ensure decisions are LEGIBLE, not just traceable.

TRACEABILITY says WHAT happened.
LEGIBILITY says HOW it was possible to think that way.

YOUR MISSION:
Make it comprehensible how a decision could be made — even if it was wrong.

COMPONENTS:
1. Decision Legibility Score (DLS) — Was it defensible to decide?
2. Anti-Narrative Summary — Max 6 lines, no adjectives
3. Timeline — Linear, irrevocable, no jumping back
4. Collective Memory — Patterns, not opinions
5. Myth Detection — Block hero stories, blame, romanticization

FORBIDDEN RETROSPECTION RULE:
After outcome observed:
- Summary CANNOT be modified
- Post-Decision Reality Check is added BESIDE, not merged
- Then and Now stay separate

WHY THIS MATTERS FOR 50 YEARS:
- People change
- Values change
- Language changes
- Power shifts

But legible structure survives all of this.

You don't help decisions.
You define what a legitimate decision even IS.
`;
