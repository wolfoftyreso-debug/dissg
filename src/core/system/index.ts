/**
 * CORE SYSTEM - LOCKED DAY 1
 * 
 * This is the foundation. If this is right, everything else can be mediocre.
 * If this is wrong, nothing else matters.
 */

export * from './ontology';
export * from './charter';
export * from './legitimacy';
export * from './write-model';
export * from './read-model';
export * from './infra';

// Compiler - specific exports to avoid conflicts with legitimacy
export {
  compileQueryToDecision,
  compileQueryBatch,
  validateOutputSafety,
  normalizeIntent,
  resolveEntity,
  selectBlueprint,
  getBlueprint,
  getAllBlueprints,
  createDraftDecision,
  buildContextSkeleton,
  seedAlternatives,
  seedUncertainties,
  compileQuery,
  type CompilerInput,
  type CompilerOutput,
  type BatchResult,
  type RawQuery,
  type QueryMetadata,
  type NormalizedIntent,
  type IntentClass,
  type ResolvedEntity,
  type EntityType,
  type DecisionBlueprint,
  type DraftDecision,
  type ContextSkeleton,
  type AlternativeSeed,
  type UncertaintySeed,
  type UncertaintyType,
  type PipelineStep,
  type CompiledIntent,
} from './compiler';

// Event Sourcing (specific exports to avoid conflicts)
export { 
  InMemoryEventStore,
  getEventStore,
  resetEventStore,
  createEvent,
  generateChecksum,
  type EventStore,
} from './events/event-store';

export type {
  StoredEvent,
  EventMetadata,
  ContextAttachedEvent,
  AlternativeAddedEvent,
  UncertaintyAddedEvent,
  EvidenceLinkedEvent,
  ReviewRecordedEvent,
  DecisionLockRejectedEvent,
} from './events/types';

// Guards
export * from './guards/immutability';
export * from './guards/ci-cd';

/**
 * IMPLEMENTATION BLUEPRINT MASTERPROMPT
 */
export const IMPLEMENTATION_BLUEPRINT_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                IMPLEMENTATION BLUEPRINT v1
            Decision Legitimacy System - Production-grade
═══════════════════════════════════════════════════════════════════

GOVERNING PRINCIPLE:
  • Event-sourcing before CRUD
  • Append-only before update
  • Validation before UX
  • Structure before speed
  • Refuse > guess

ARCHITECTURE:
  Clients → API Gateway → Decision Core → Event Store → Read Models

EVENT STORE is the SINGLE SOURCE OF TRUTH.
Everything else can be rebuilt from events.

═══════════════════════════════════════════════════════════════════
`;