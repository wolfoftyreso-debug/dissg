 /**
  * DEVELOPMENT PRIORITIES - LOCKED SYSTEM ROLE
  * 
  * These definitions are immutable and define the system's fundamental nature.
  * No feature development may contradict these priorities.
  */
 
 export const SYSTEM_ROLE_DEFINITION = {
   // Core identity - LOCKED
   identity: {
     type: 'machine-layer' as const,
     nature: 'write-once-read-infinite' as const,
     uxPriority: 'secondary-and-replaceable' as const,
     revenueModel: 'access-and-capability-based' as const,
     discoveryModel: 'usage-not-pitch' as const,
   },
   
   // Improvement domains - the ONLY areas of active development
   improvementDomains: [
     'structural-perfection',
     'machine-interaction',
     'indestructible-operation',
   ] as const,
   
   // Locked constraints
   constraints: {
     noProductPitching: true,
     noMarketingDrivenFeatures: true,
     noUxCompromisesToSemantics: true,
     noManualExceptions: true,
     noSpecialCases: true,
   },
 } as const;
 
 export type ImprovementDomain = typeof SYSTEM_ROLE_DEFINITION.improvementDomains[number];
 
 /**
  * Priority ordering for all development decisions
  */
 export const DEVELOPMENT_PRIORITY_ORDER = [
   {
     rank: 1,
     domain: 'structural-perfection' as const,
     description: 'Data model correctness, schema enforcement, relationship integrity',
     blocksLower: true,
   },
   {
     rank: 2,
     domain: 'machine-interaction' as const,
     description: 'API stability, format consistency, AI-consumability',
     blocksLower: true,
   },
   {
     rank: 3,
     domain: 'indestructible-operation' as const,
     description: 'Uptime, immutability, audit trails, recovery',
     blocksLower: false,
   },
   {
     rank: 4,
     domain: 'ux-refinement' as const,
     description: 'Visual polish, interaction patterns, accessibility',
     blocksLower: false,
   },
 ] as const;
 
 /**
  * Feature gate - prevents features that violate system role
  */
 export function validateFeatureAgainstSystemRole(feature: {
   name: string;
   domain: ImprovementDomain | 'ux-refinement';
   modifiesSemantics: boolean;
   requiresManualException: boolean;
   compromisesStructure: boolean;
 }): { allowed: boolean; reason?: string } {
   
   if (feature.modifiesSemantics && feature.domain === 'ux-refinement') {
     return {
       allowed: false,
       reason: 'UX features may not modify semantic structure',
     };
   }
   
   if (feature.requiresManualException) {
     return {
       allowed: false,
       reason: 'No manual exceptions allowed - system must be fully automated',
     };
   }
   
   if (feature.compromisesStructure) {
     return {
       allowed: false,
       reason: 'No feature may compromise structural integrity',
     };
   }
   
   return { allowed: true };
 }
 
 /**
  * AWS Deployment Principles (conceptual, not implementation)
  */
 export const DEPLOYMENT_PRINCIPLES = {
   dataStores: {
     immutable: true,
     noOverwrite: true,
     versionedSchemas: true,
   },
   
   optimization: {
     readHeavy: true,
     noFrontendState: true,
     strictApiAccess: true,
   },
   
   layers: {
     coreIndex: 'Immutable data layer',
     relations: 'Graph/relationship layer',
     query: 'Replaceable query layer',
     auth: 'Entitlement/access layer',
   },
   
   premium: {
     moreQueries: true,
     deeperTraversal: true,
     batchAccess: true,
     historicalSnapshots: true,
     moreData: false, // Premium is NEVER about "more data"
   },
 } as const;
 
 /**
  * Google/Indexing Principles
  */
 export const INDEXING_PRINCIPLES = {
   required: {
     canonicalUrls: 'Every object has exactly one canonical URL',
     machineMetadataFirst: 'Schema.org and JSON-LD before HTML',
     htmlNotPrimary: 'HTML is presentation, not truth',
     consistentIds: 'Same ID regardless of presentation layer',
   },
   
   robotsPolicy: {
     allowIndexing: true,
     preventBulkScraping: true,
   },
   
   googleRelationship: {
     shouldFind: true,
     shouldUnderstand: true,
     shouldCite: true,
     shouldDefineStructure: false,
     shouldControlSchema: false,
     shouldBeDependency: false,
   },
 } as const;