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