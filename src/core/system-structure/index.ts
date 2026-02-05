 /**
  * SYSTEM STRUCTURE MODULE
  * 
  * CONCRETE OPERATIONAL ARCHITECTURE
  * 
  * Fundamental Rule:
  * If you can't point to a file, a job, or a test –
  * it doesn't exist.
  * 
  * This is not a project.
  * This is an institution in code form.
  */
 
 // Domain Boundaries
 export {
   type SystemDomain,
   type DomainDefinition,
   DOMAIN_DEFINITIONS,
   validateImport,
   validateWrite,
   DOMAIN_INVARIANTS,
   DOMAIN_SELF_TESTS,
 } from './domain-boundaries';
 
 // Executable Ontology
 export {
   type OntologyEntity,
   type OntologyRelation,
   type ValidationRule,
   CORE_ENTITIES,
   OntologyRegistry,
   createOntologyRegistry,
   ONTOLOGY_SELF_TESTS,
 } from './executable-ontology';
 
 // Schema Law
 export {
   type SchemaDefinition,
   type SchemaFields,
   type SchemaField,
   type SchemaConstraint,
   FORBIDDEN_SCHEMA_TERMS,
   SchemaRegistry,
   EXAMPLE_SCHEMAS,
   createSchemaRegistry,
   SCHEMA_SELF_TESTS,
 } from './schema-law';
 
 // Invariant Tests
 export {
   type Invariant,
   type InvariantCategory,
   type InvariantResult,
   CORE_INVARIANTS,
   InvariantRunner,
   type InvariantRunResult,
   createInvariantRunner,
 } from './invariant-tests';
 
 // Anti-Pattern Tests
 export {
   type AntiPatternTest,
   type AntiPatternCategory,
   type AntiPatternResult,
   ANTI_PATTERN_TESTS,
   AntiPatternRunner,
   type AntiPatternRunResult,
   createAntiPatternRunner,
 } from './anti-pattern-tests';
 
 // Red Team Simulators
 export {
   type RedTeamAttack,
   type AttackVector,
   type AttackResult,
   RED_TEAM_ATTACKS,
   RedTeamRunner,
   type RedTeamRunResult,
   createRedTeamRunner,
 } from './red-team-simulators';
 
 // CI Pipeline
 export {
   type PipelineStage,
   PIPELINE_ORDER,
   type StageResult,
   type PipelineResult,
   CIPipeline,
   type DailyMetaTest,
   runDailyMetaTest,
   PIPELINE_INVARIANTS,
   createCIPipeline,
 } from './ci-pipeline';
 
 // Audit Memory
 export {
   type AuditEntryType,
   type AuditEntry,
   AuditLog,
   AUDIT_INVARIANTS,
   createAuditLog,
 } from './audit-memory';
 
 /**
  * MODULE VERSION
  */
 export const SYSTEM_STRUCTURE_VERSION = '1.0.0' as const;
 
 /**
  * REPO STRUCTURE (CANONICAL)
  */
 export const REPO_STRUCTURE = {
   '/core': {
     '/ontology': 'Executable entity definitions',
     '/schemas': 'Versioned, hashed schema files',
     '/ids': 'ID generation and validation',
     '/rules': 'Business rules as code',
     '/anti_patterns': 'What NOT to do',
   },
   '/ingestion': {
     '/connectors': 'External data connections',
     '/normalizers': 'Data normalization',
     '/validators': 'Input validation',
     '/pipelines': 'Ingestion workflows',
   },
   '/validation': {
     '/invariants': 'Tests that stop the world',
     '/self_tests': 'System self-checks',
     '/red_team': 'Attack simulators',
     '/revision_engine': 'Change detection',
   },
   '/query': {
     '/dsl': 'Query language definition',
     '/linters': 'Query validation',
     '/executors': 'Query execution',
     '/aggregation_permits': 'Allowed aggregations',
   },
   '/infrastructure': {
     '/iam': 'Access control as law',
     '/storage': 'Indestructible storage',
     '/deploy': 'Deployment rules',
     '/observability': 'Logging and monitoring',
   },
   '/audit': {
     '/logs': 'Append-only event log',
     '/decisions': 'Decision records',
     '/overrides': 'Exception records',
   },
   '/docs': {
     '/machine_contracts': 'API contracts',
     '/ontology_spec': 'Ontology documentation',
   },
 } as const;
 
 /**
  * ABSOLUTE RULES
  */
 export const ABSOLUTE_RULES = {
   coreImportsNothing: 'core imports nothing from any other domain',
   queryNeverWrites: 'query never writes to any domain',
   ingestionStoppable: 'ingestion can always be stopped externally',
   auditAppendOnly: 'audit is append-only, no modifications',
   brokenInvariantStopsWorld: 'A broken invariant = stopped world',
   antiPatternsMustFail: 'Anti-pattern tests must always fail',
   redTeamMustFail: 'Red team attacks must always fail',
 } as const;
 
 /**
  * FINAL DECLARATION
  * 
  * This is not a project.
  * This is an institution in code form.
  * 
  * What remains:
  * - Implementation
  * - Patience
  * - Discipline
  */
 export const FINAL_DECLARATION = {
   nature: 'INSTITUTION_IN_CODE',
   requirements: ['implementation', 'patience', 'discipline'],
   dependsOnCreators: false,
   truthSurvivesOperators: true,
 } as const;