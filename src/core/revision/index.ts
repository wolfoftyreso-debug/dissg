 /**
  * AUTOMATED SELF-REVISION MODULE
  * 
  * The system's long-term nervous system.
  * Makes the system self-aware of its own correctness.
  * Survives 10-30 years without degradation.
  * 
  * FUNDAMENTAL PRINCIPLE:
  * The system shall NEVER assume the world is stable.
  * It shall continuously suspect it has changed.
  * 
  * FOUR REVISION LAYERS (all required):
  * 1. DATA - numerical reality
  * 2. DEFINITION - semantic reality
  * 3. SOURCE - institutional reality
  * 4. CONCLUSION - derived truth
  * 
  * EXTREME TRUTH RULES (LOCKED):
  * 1. No truth is eternal
  * 2. No definition is final
  * 3. No source is sacred
  * 4. No conclusion is permanent
  * 
  * EXCEPTION: History is absolute.
  */
 
 // Types
 export type {
   RevisionLayer,
   RevisionEvent,
   RevisionEventType,
   RevisionEvidence,
   RevisionAction,
   RevisionReport,
   LayerRevisionSummary,
   SourceStabilityScore,
   ConclusionStaleness,
 } from './revision-types';
 
 export { EXTREME_TRUTH_RULES } from './revision-types';
 
 // Data revision
 export {
   detectTimeDiscontinuity,
   detectMethodBreak,
   detectRevisedHistory,
   runDataRevisionTests,
   type TimeSeriesPoint,
   type VarianceConfig,
   type MethodChangeNote,
   type HistoricalRevision,
 } from './data-revision';
 
 // Definition revision
 export {
   detectDefinitionDrift,
   detectContextExpansion,
   detectSemanticNarrowing,
   runDefinitionRevisionTests,
   type SchemaVersion,
   type SemanticDifference,
 } from './definition-revision';
 
 // Source revision
 export {
   calculateSourceStabilityScore,
   detectSourceBehaviorChange,
   detectInstitutionalChange,
   detectSingleSourceFragility,
   runSourceRevisionTests,
   type SourceProfile,
   type SourceRevision,
   type SourceMetrics,
   type MetricSourceDependency,
 } from './source-revision';
 
 // Conclusion revision
 export {
   detectStaleConclusionsByChange,
   detectContradictingData,
   runConclusionRevisionTests,
   type StoredConclusion,
   type DataChangeLog,
   type DefinitionChangeLog,
   type SourceChangeLog,
   type TrendAnalysis,
 } from './conclusion-revision';
 
 // Revision engine
 export {
   runRevisionCycle,
   resolveRevisionEvent,
   getRevisionEngineState,
   getEventsByLayer,
   getUnresolvedEvents,
   getConclusionStaleness,
   clearRevisionState,
   runMetaAdaptivityTest,
   type RevisionRunContext,
   type MetaAdaptivityTest,
 } from './revision-engine';
 
 /**
  * MODULE VERSION
  */
 export const REVISION_MODULE_VERSION = '1.0.0' as const;
 
 /**
  * REVISION IS CONSTANT, NOT A POINT EFFORT.
  * 
  * Schedule:
  * - Daily: Quick scans for discontinuities and stale conclusions
  * - Weekly: Full revision cycle across all layers
  * - On-demand: Triggered by significant data updates
  * 
  * Dogmatic systems die.
  * Adaptive reference systems survive civilizations.
  */