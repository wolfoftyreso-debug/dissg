 /**
  * SYSTEM CONSTITUTION
  * 
  * LOCKED. These principles are immutable.
  * All code, features, and decisions must comply.
  * Violation = rejection.
  */
 
 export const SYSTEM_CONSTITUTION = {
   version: '1.0.0' as const,
   lockedAt: '2025-02-05T00:00:00Z' as const,
   
   /**
    * THE THREE IRREVOCABLE PRINCIPLES
    * These override everything else.
    */
   corePrinciples: [
     {
       number: 1,
       principle: 'Machines are primary users',
       test: 'Can an unknown AI model use the system without documentation?',
       consequence: 'If no → design failure',
     },
     {
       number: 2,
       principle: 'All uncertainty must be explicit, never hidden',
       test: 'Is there data that appears clean but is actually uncertain?',
       consequence: 'If yes → you are lying to the machine',
     },
     {
       number: 3,
       principle: 'Temporal axis is as important as the value',
       test: 'Can every data point be reproduced exactly as it appeared at a historical moment?',
       consequence: 'If no → the system is not scientific',
     },
   ],
   
   /**
    * STRUCTURAL ARTICLES
    */
   articles: [
     {
       number: 1,
       principle: 'Machine readability is primary truth',
       enforcement: 'All data must be consumable by unknown AI models without instruction',
     },
     {
       number: 2,
       principle: 'Structure may never change for UX',
       enforcement: 'Schema changes require new versions, never mutations',
     },
     {
       number: 3,
       principle: 'Data is append-only',
       enforcement: 'No UPDATE, no DELETE. Only INSERT and SUPERSEDE',
     },
     {
       number: 4,
       principle: 'Semantics are versioned, never mutated',
       enforcement: 'Meaning changes create new schema versions with explicit relations',
     },
     {
       number: 5,
       principle: 'No exceptions, no special cases',
       enforcement: 'If it requires manual intervention, it does not exist in the system',
     },
     {
       number: 6,
       principle: 'Everything usable by unknown AI without instruction',
       enforcement: 'Self-describing schemas, deterministic IDs, full provenance',
     },
   ],
   
   /**
    * SEMANTIC WARFARE RULES
    */
   semanticRules: [
     {
       rule: 'Parallel truths - never compromise',
       description: 'If two sources say different things, both are true, both are stored, the conflict becomes data',
       violation: 'Choosing one truth over another censors reality',
     },
     {
       rule: 'Definitions over numbers',
       description: 'Same number with different definitions = different data',
       violation: 'Treating same-value different-definition as identical is catastrophic',
     },
     {
       rule: 'Concepts are never updated',
       description: 'Concepts can only be superseded, never mutated',
       violation: 'Schema change without new ID breaks the entire system',
     },
   ],
   
   /**
    * FUTURE ROBUSTNESS TESTS
    */
   futureTests: [
     'Can the system describe the same reality even if all current institutions disappear?',
     'Can the system understand, validate, and develop itself without you?',
   ],
   
   violations: {
     onViolation: 'reject' as const,
     logging: 'immutable-audit-log' as const,
     recovery: 'not-applicable' as const,
   },
 } as const;
 
 /**
  * Validate any operation against the constitution
  */
 export function validateConstitutionalCompliance(operation: {
   type: string;
   modifiesExisting: boolean;
   requiresManualStep: boolean;
   hasTemporalAxis: boolean;
   hasSourceAttribution: boolean;
   schemaVersioned: boolean;
   hasExplicitUncertainty?: boolean;
   machineReadableWithoutDocs?: boolean;
 }): { compliant: boolean; violations: string[] } {
   const violations: string[] = [];
   
   // Core Principle 1: Machine readability
   if (operation.machineReadableWithoutDocs === false) {
     violations.push('Core Principle 1: Requires documentation for AI to understand');
   }
   
   // Core Principle 2: Explicit uncertainty
   if (operation.hasExplicitUncertainty === false) {
     violations.push('Core Principle 2: Hidden uncertainty violates explicit truth');
   }
   
   // Core Principle 3: Temporal axis
   if (!operation.hasTemporalAxis) {
     violations.push('Core Principle 3: Missing temporal axis - data without time is propaganda');
   }
   
   // Article 3: Append-only
   if (operation.modifiesExisting) {
     violations.push('Article 3: Data modification violates append-only principle');
   }
   
   // Article 5: No manual intervention
   if (operation.requiresManualStep) {
     violations.push('Article 5: Manual intervention violates automation principle');
   }
   
   // Article 6: Source attribution
   if (!operation.hasSourceAttribution) {
     violations.push('Article 6: Missing source attribution violates provenance requirement');
   }
   
   // Article 4: Schema versioning
   if (!operation.schemaVersioned) {
     violations.push('Article 4: Missing schema version violates semantic versioning');
   }
   
   return {
     compliant: violations.length === 0,
     violations,
   };
 }
 
 export type ConstitutionArticle = typeof SYSTEM_CONSTITUTION.articles[number];
 export type CorePrinciple = typeof SYSTEM_CONSTITUTION.corePrinciples[number];
 export type SemanticRule = typeof SYSTEM_CONSTITUTION.semanticRules[number];