/**
 * CIVILIZATIONAL MEMORY LAYER (CML)
 * 
 * Makes ST-OS civilization's memory, not just a service.
 * Truth that survives time, narrative, and power shifts.
 */

// Truth Artifacts
export {
  createTruthArtifact,
  verifyArtifactIntegrity,
  type TruthArtifact,
  type KnownFact,
  type UncertaintyRecord,
  type UnknownRecord,
  type DataSourceRecord,
  type MethodologyRecord,
} from './truth-artifacts';

// Anti-Narrative Protection
export {
  createNarrativeProtectionLog,
  addNarrativeEvent,
  checkRewriteAttempt,
  generateHistoricalProof,
  type NarrativeProtectionLog,
  type NarrativeEvent,
  type NarrativeEventType,
  type NarrativeEvidence,
  type RewriteAttempt,
  type HistoricalProof,
} from './anti-narrative';

// Generational Comparability
export {
  createGenerationalComparison,
  queryHistoricalNormal,
  type GenerationalComparison,
  type GenerationalPeriod,
  type DefinitionChange,
  type MethodologyChange,
  type UncertaintyEvolution,
  type ComparabilityAssessment,
  type HistoricalNormal,
} from './generational-comparability';
