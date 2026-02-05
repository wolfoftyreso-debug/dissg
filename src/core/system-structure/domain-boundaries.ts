 /**
  * DOMAIN BOUNDARIES
  * 
  * Monorepo with HARD domains.
  * Structure that ENFORCES discipline.
  * 
  * Absolute Rules:
  * - core imports NOTHING
  * - query NEVER writes
  * - ingestion can ALWAYS be stopped
  * - audit is APPEND-ONLY
  */
 
 /**
  * DOMAIN DEFINITIONS
  */
 export type SystemDomain =
   | 'core'
   | 'ingestion'
   | 'validation'
   | 'query'
   | 'infrastructure'
   | 'audit'
   | 'docs';
 
 export interface DomainDefinition {
   domain: SystemDomain;
   path: string;
   description: string;
   canImportFrom: SystemDomain[];
   canWriteTo: SystemDomain[];
   canBeStoppedExternally: boolean;
   isAppendOnly: boolean;
   subdirectories: string[];
 }
 
 /**
  * DOMAIN HIERARCHY
  */
 export const DOMAIN_DEFINITIONS: Record<SystemDomain, DomainDefinition> = {
   core: {
     domain: 'core',
     path: '/core',
     description: 'Ontology, schemas, IDs, rules, anti-patterns. The sacred kernel.',
     canImportFrom: [], // IMPORTS NOTHING
     canWriteTo: [],    // WRITES NOTHING
     canBeStoppedExternally: false,
     isAppendOnly: true,
     subdirectories: [
       '/ontology',
       '/schemas',
       '/ids',
       '/rules',
       '/anti_patterns',
     ],
   },
   
   ingestion: {
     domain: 'ingestion',
     path: '/ingestion',
     description: 'Connectors, normalizers, validators, pipelines. The dangerous zone.',
     canImportFrom: ['core'],
     canWriteTo: ['validation'],
     canBeStoppedExternally: true, // CAN ALWAYS BE STOPPED
     isAppendOnly: false,
     subdirectories: [
       '/connectors',
       '/normalizers',
       '/validators',
       '/pipelines',
     ],
   },
   
   validation: {
     domain: 'validation',
     path: '/validation',
     description: 'Invariants, self-tests, red team, revision engine. The immune system.',
     canImportFrom: ['core', 'ingestion'],
     canWriteTo: ['infrastructure'], // Only for blocking
     canBeStoppedExternally: false,
     isAppendOnly: false,
     subdirectories: [
       '/invariants',
       '/self_tests',
       '/red_team',
       '/revision_engine',
     ],
   },
   
   query: {
     domain: 'query',
     path: '/query',
     description: 'DSL, linters, executors, aggregation permits. Read-only interface.',
     canImportFrom: ['core', 'infrastructure'],
     canWriteTo: [], // NEVER WRITES
     canBeStoppedExternally: true,
     isAppendOnly: false,
     subdirectories: [
       '/dsl',
       '/linters',
       '/executors',
       '/aggregation_permits',
     ],
   },
   
   infrastructure: {
     domain: 'infrastructure',
     path: '/infrastructure',
     description: 'IAM, storage, deploy, observability. The indestructible foundation.',
     canImportFrom: ['core'],
     canWriteTo: ['audit'],
     canBeStoppedExternally: false,
     isAppendOnly: false,
     subdirectories: [
       '/iam',
       '/storage',
       '/deploy',
       '/observability',
     ],
   },
   
   audit: {
     domain: 'audit',
     path: '/audit',
     description: 'Logs, decisions, overrides. Eternal memory.',
     canImportFrom: ['core'],
     canWriteTo: [], // WRITES ONLY TO ITSELF
     canBeStoppedExternally: false,
     isAppendOnly: true, // APPEND-ONLY
     subdirectories: [
       '/logs',
       '/decisions',
       '/overrides',
     ],
   },
   
   docs: {
     domain: 'docs',
     path: '/docs',
     description: 'Machine contracts, ontology spec. Executable documentation.',
     canImportFrom: ['core'],
     canWriteTo: [],
     canBeStoppedExternally: true,
     isAppendOnly: false,
     subdirectories: [
       '/machine_contracts',
       '/ontology_spec',
     ],
   },
 };
 
 /**
  * IMPORT VALIDATOR
  */
 export function validateImport(
   fromDomain: SystemDomain,
   toDomain: SystemDomain
 ): { allowed: boolean; reason?: string } {
   const source = DOMAIN_DEFINITIONS[fromDomain];
   
   if (source.canImportFrom.includes(toDomain)) {
     return { allowed: true };
   }
   
   if (fromDomain === 'core') {
     return {
       allowed: false,
       reason: 'FORBIDDEN: core imports NOTHING',
     };
   }
   
   return {
     allowed: false,
     reason: `Domain ${fromDomain} cannot import from ${toDomain}`,
   };
 }
 
 /**
  * WRITE VALIDATOR
  */
 export function validateWrite(
   fromDomain: SystemDomain,
   toDomain: SystemDomain
 ): { allowed: boolean; reason?: string } {
   const source = DOMAIN_DEFINITIONS[fromDomain];
   
   if (fromDomain === 'query') {
     return {
       allowed: false,
       reason: 'FORBIDDEN: query NEVER writes',
     };
   }
   
   if (source.canWriteTo.includes(toDomain)) {
     return { allowed: true };
   }
   
   return {
     allowed: false,
     reason: `Domain ${fromDomain} cannot write to ${toDomain}`,
   };
 }
 
 /**
  * DOMAIN INVARIANTS
  */
 export const DOMAIN_INVARIANTS = {
   coreImportsNothing: 'core imports NOTHING from any domain',
   queryNeverWrites: 'query NEVER writes to any domain',
   ingestionStoppable: 'ingestion can ALWAYS be stopped externally',
   auditAppendOnly: 'audit is APPEND-ONLY, no modifications',
   noCyclicDependencies: 'No domain can create circular imports',
 } as const;
 
 /**
  * SELF-TESTS
  */
 export const DOMAIN_SELF_TESTS = {
   importBoundaries: {
     test: 'FOR EACH import IN codebase: ASSERT validateImport() == true',
     description: 'All imports respect domain boundaries',
     blocking: true,
   },
   writeBoundaries: {
     test: 'FOR EACH write IN runtime: ASSERT validateWrite() == true',
     description: 'All writes respect domain boundaries',
     blocking: true,
   },
   appendOnlyAudit: {
     test: 'ASSERT audit_domain HAS NO delete OR update operations',
     description: 'Audit domain is append-only',
     blocking: true,
   },
 } as const;