 /**
  * CORE SYSTEM INDEX
  * 
  * The permanent global reference system architecture.
  * All exports are locked specifications, not features.
  */
 
 // =============================================================================
 // SECTION 1: CONSTITUTION (IMMUTABLE)
 // =============================================================================
 
 export {
   SYSTEM_CONSTITUTION,
   validateConstitutionalCompliance,
   type ConstitutionArticle,
 } from './constitution';
 
 // =============================================================================
 // SECTION 2: ONTOLOGY (THE 6 BASE TYPES)
 // =============================================================================
 
 export {
   BASE_OBJECT_TYPES,
   isValidBaseObject,
   validateBaseObjectCompleteness,
   type BaseObjectType,
   type BaseObjectFields,
   type Entity,
   type Attribute,
   type Relation,
   type Event,
   type Measure,
   type Source,
   type AnyBaseObject,
 } from './ontology/base-objects';
 
 export {
   parseVersion,
   formatVersion,
   compareVersions,
   isBreakingChange,
   SchemaRegistry,
   globalSchemaRegistry,
   type SemanticVersion,
   type SchemaDefinition,
   type SchemaField,
 } from './ontology/semantic-versioning';
 
 // =============================================================================
 // SECTION 3: INGESTION PIPELINE
 // =============================================================================
 
 export {
   INGESTION_RULES,
   normalizeRawData,
   validateNormalizedData,
   canonicalizeValidatedData,
   runIngestionPipeline,
   type PipelineStage,
   type PipelineResult,
   type PipelineError,
   type IngestionRules,
 } from './ingestion/pipeline';
 
 // =============================================================================
 // SECTION 4: CANONICAL DATA CORE
 // =============================================================================
 
 export {
   ALLOWED_OPERATIONS,
   FORBIDDEN_OPERATIONS,
   assertAllowedOperation,
   validateSupersede,
   type AllowedOperation,
   type ForbiddenOperation,
   type OperationResult,
   type SupersedeResult,
   type ImmutableRecord,
   type CanonicalDataStore,
 } from './data-core/operations';
 
 // =============================================================================
 // SECTION 5: QUERY CAPABILITIES
 // =============================================================================
 
 export {
   CAPABILITY_TIERS,
   checkCapability,
   canPerformQuery,
   type CapabilityTier,
   type TierCapabilities,
 } from './query/capabilities';
 
 // =============================================================================
 // SECTION 6: AI CONSUMER CONTRACT
 // =============================================================================
 
 export {
   AI_CONSUMER_CONTRACT,
   verifyContractCompliance,
   getContractAsJSON,
   getContractEndpoint,
   type ContractComplianceCheck,
 } from './contracts/ai-consumer-contract';
 
 // =============================================================================
 // SECTION 7: SELF-IMPROVEMENT
 // =============================================================================
 
 export {
   DAILY_DIAGNOSTIC_QUESTIONS,
   runDailyDiagnostics,
   evaluateResult,
   getQuestionsByCategory,
   generateActionItems,
   type DiagnosticQuestion,
   type DiagnosticResult,
   type DailyDiagnosticReport,
 } from './self-improvement/daily-prompts';
 
 // =============================================================================
 // SECTION 8: TRUTH ENGINE SPEC (THE CONSTITUTION)
 // =============================================================================
 
 export {
   TRUTH_ENGINE_SPEC,
   TRUTH_ENGINE_PURPOSE,
   PERMITTED_BASE_CLASSES,
   IDENTITY_LAW,
   VERSIONING_LAW,
   HISTORICAL_SANCTITY_LAW,
   SOURCE_NEUTRALITY_LAW,
   AGGREGATION_PROHIBITION,
   INVARIANT_ENFORCEMENT,
   RED_TEAM_MANDATE,
   REVISION_DUTY,
   CONCLUSION_PERISHABILITY,
   APPEND_ONLY_ABSOLUTISM,
   HUMAN_POWER_LIMITATION,
   PERMITTED_EVOLUTION,
   FORBIDDEN_EVOLUTION,
   SURVIVAL_PRINCIPLE,
   ULTIMATE_QUESTION,
   FINAL_STATUS,
   runUltimateVerification,
 } from './truth-engine-spec';
 
 // =============================================================================
 // SECTION 9: IMPLEMENTATION PLAN
 // =============================================================================
 
 export {
   runFullProgressCheck,
 } from './implementation';
 
 // =============================================================================
 // SECTION 10: SUPER-AI SIMULATION
 // =============================================================================
 
 export {
   runFullSuperAISimulation,
   NEXT_STEPS as SIMULATION_NEXT_STEPS,
 } from './super-ai-simulation';
 
 // =============================================================================
 // SECTION 11: STRESS TEST CASES
 // =============================================================================
 
 export {
   runFullInequalityStressTest,
   CASE_SIGNIFICANCE,
 } from './stress-test-cases';