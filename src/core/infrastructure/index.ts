 /**
  * INFRASTRUCTURE MODULE
  * 
  * AWS AS INDESTRUCTIBLE CORE
  * 
  * This is not "cloud setup". This is how you make the core
  * physically impossible to corrupt, even by yourself in 5 years.
  * 
  * FOUR ISOLATED ZONES:
  * [ INGESTION ] → [ VALIDATION ] → [ CANONICAL CORE ] → [ QUERY ]
  * 
  * FUNDAMENTAL RULES:
  * - Nothing writes backward
  * - No zone skips another
  * - Canonical core is UNTOUCHABLE
  * - Old versions live forever
  */
 
 // Zone Architecture
 export {
   type Zone,
   ZONE_HIERARCHY,
   type ZoneCapabilities,
   ZONE_CAPABILITIES,
   ZONE_INVARIANTS,
   validateZoneFlow,
   checkZoneHealth,
   type ZoneHealthStatus,
 } from './zone-architecture';
 
 // Canonical Core
 export {
   type CoreObject,
   CORE_PRINCIPLES,
   type WritePermission,
   validateCorePermissions,
   generateCoreKey,
   CORE_SELF_TESTS,
 } from './canonical-core';
 
 // IAM Constitution
 export {
   type SystemRole,
   type RoleDefinition,
   type Permission,
   type PermissionAction,
   ROLE_DEFINITIONS,
   IAM_INVARIANTS,
   type RoleAssignment,
   validateRoleAssignment,
   checkForbiddenCombinations,
   IAM_SELF_TESTS,
 } from './iam-constitution';
 
 // Ingestion Pipeline
 export {
   type PipelineStage,
   PIPELINE_STAGES,
   type PipelineRun,
   type PipelineStatus,
   type StageResult,
   type StageError,
   PIPELINE_INVARIANTS,
   type StageValidator,
   type PipelineContext,
   type ValidationOutput,
   STAGE_VALIDATORS,
   runPipeline,
   PIPELINE_SELF_TESTS,
 } from './ingestion-pipeline';
 
 // Deploy Rules
 export {
   type DeployAction,
   type DeployRule,
   DEPLOY_RULES,
   type DeployRequest,
   type Approval,
   type DeployStatus,
   validateDeployRequest,
   type VersionEntry,
   type VersionRegistry,
   createVersionRegistry,
   DEPLOY_INVARIANTS,
 } from './deploy-rules';
 
 // Catastrophe Tests
 export {
   type CatastropheScenario,
   type AttackVector,
   type ExpectedOutcome,
   CATASTROPHE_SCENARIOS,
   type CatastropheTestResult,
   runCatastropheTest,
   META_TEST,
   type TruthPreservationCertificate,
   generateTruthCertificate,
 } from './catastrophe-test';
 
 /**
  * MODULE VERSION
  */
 export const INFRASTRUCTURE_VERSION = '1.0.0' as const;
 
 /**
  * INFRASTRUCTURE INVARIANTS (ABSOLUTE)
  */
 export const INFRASTRUCTURE_INVARIANTS = {
   // Zone rules
   noBackwardWrites: 'No zone can write to a zone earlier in hierarchy',
   noZoneSkipping: 'Data must flow through all zones in order',
   
   // Core rules
   coreAppendOnly: 'Canonical core is append-only, never modify',
   coreNoHumanWrite: 'No human can write to canonical core',
   coreVersioned: 'All core objects are versioned and content-addressed',
   
   // IAM rules
   noWriteAndDelete: 'No principal has both write and delete',
   minimalPermissions: 'Each role has minimum required permissions',
   
   // Pipeline rules
   failHard: 'Single error stops entire pipeline',
   noPartialWrites: 'Either all writes or nothing writes',
   
   // Deploy rules
   noHotfixes: 'No hotfixes in production',
   versionsForever: 'Old versions live forever',
   
   // Ultimate rule
   truthImmutable: 'What is written cannot be changed',
 } as const;
 
 /**
  * META-QUESTION
  * 
  * Ask regularly: Is this system closer to an ARCHIVE than an APPLICATION?
  * 
  * If yes → correct
  * If no → you have built too much "product"
  */
 export const META_QUESTION = 
   'Is this system closer to an ARCHIVE than an APPLICATION?' as const;