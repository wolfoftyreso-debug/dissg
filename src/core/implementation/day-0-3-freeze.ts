 /**
  * DAY 0-3: FREEZE EVERYTHING THAT ISN'T CORE
  * 
  * STOP all new functionality
  * NO new connectors
  * NO UX ideas
  * NO "we'll fix it later"
  * 
  * Self-test: Can someone clone the repo and understand 
  * exactly what is FORBIDDEN?
  */
 
 /**
  * SYSTEM CONSTITUTION (1 page max)
  */
 export const SYSTEM_CONSTITUTION = `
 ================================================================================
                         SYSTEM CONSTITUTION v1.0
 ================================================================================
 
 WHAT THIS IS:
   An institutional reference system for observable reality.
   Not a product. Not a platform. Not a service.
 
 WHAT THIS IS NOT:
   - A tool for generating narratives
   - A system that recommends actions
   - A platform that can be "marketed"
 
 ================================================================================
                              ABSOLUTE PROHIBITIONS
 ================================================================================
 
 1. NO VALUE WORDS
    Forbidden: good, bad, success, failure, crisis, improvement
    Allowed: increased, decreased, changed, unchanged, observed
 
 2. NO CAUSAL CLAIMS
    Forbidden: caused, because, led to, resulted in
    Allowed: correlated with, co-occurred, followed by
 
 3. NO RECOMMENDATIONS
    Forbidden: should, must, need to, recommended
    Allowed: if X then historically Y occurred
 
 4. NO IMPLICIT CONTEXT
    All data must be self-describing.
    If context is required, it must be explicit in the schema.
 
 5. NO "LATEST" OR "CURRENT"
    All schemas are versioned.
    All queries specify exact versions.
 
 6. NO DELETIONS
    Core is append-only.
    History is immutable.
    Supersession creates new versions.
 
 ================================================================================
                              DOMAIN BOUNDARIES
 ================================================================================
 
 /core        → imports NOTHING, writes NOTHING
 /ingestion   → can be stopped externally at any time
 /validation  → reads all, writes nothing
 /query       → NEVER writes to any domain
 /audit       → append-only, no modifications ever
 
 ================================================================================
                              BREAKING CHANGES
 ================================================================================
 
 A broken invariant = STOPPED WORLD
 
 Not a warning.
 Not a log entry.
 Not a ticket.
 
 STOPPED WORLD.
 
 ================================================================================
                              FINAL QUESTION
 ================================================================================
 
 If this system was taken over by someone with completely different values:
   Would the truth survive?
 
 If YES → System is sovereign
 If NO  → Harden more
 
 ================================================================================
 `;
 
 /**
  * FREEZE STATUS
  */
 export interface FreezeStatus {
   frozenAt: string;
   frozenBy: string;
   reason: string;
   allowedActivities: string[];
   forbiddenActivities: string[];
 }
 
 export const CURRENT_FREEZE: FreezeStatus = {
   frozenAt: new Date().toISOString(),
   frozenBy: 'system',
   reason: 'Day 0-3: Core establishment phase',
   allowedActivities: [
     'Create repository structure',
     'Write constitution',
     'Define domain boundaries',
     'Write invariant definitions',
   ],
   forbiddenActivities: [
     'New features',
     'New connectors',
     'UX improvements',
     'Performance optimization',
     'API design',
     'UI work',
     '"Quick fixes"',
   ],
 };
 
 /**
  * REPOSITORY STRUCTURE
  */
 export const REPO_STRUCTURE_TEMPLATE = {
   directories: [
     '/core/ontology',
     '/core/schemas',
     '/core/ids',
     '/core/rules',
     '/core/anti_patterns',
     '/ingestion/connectors',
     '/ingestion/normalizers',
     '/ingestion/validators',
     '/ingestion/pipelines',
     '/validation/invariants',
     '/validation/self_tests',
     '/validation/red_team',
     '/validation/revision_engine',
     '/query/dsl',
     '/query/linters',
     '/query/executors',
     '/query/aggregation_permits',
     '/infrastructure/iam',
     '/infrastructure/storage',
     '/infrastructure/deploy',
     '/infrastructure/observability',
     '/audit/logs',
     '/audit/decisions',
     '/audit/overrides',
     '/docs/machine_contracts',
     '/docs/ontology_spec',
   ],
   files: [
     '/README.md',
     '/CONSTITUTION.md',
     '/FORBIDDEN.md',
   ],
 };
 
 /**
  * FREEZE SELF-TEST
  */
 export function runFreezeSelfTest(): {
   passed: boolean;
   question: string;
   answer: string;
 } {
   const question = 'Can someone clone the repo and understand exactly what is FORBIDDEN?';
   
   // Check if constitution is clear
   const constitutionLength = SYSTEM_CONSTITUTION.length;
   const hasClearProhibitions = SYSTEM_CONSTITUTION.includes('ABSOLUTE PROHIBITIONS');
   const hasExamples = SYSTEM_CONSTITUTION.includes('Forbidden:');
   
   const passed = hasClearProhibitions && hasExamples && constitutionLength < 5000;
   
   return {
     passed,
     question,
     answer: passed 
       ? 'YES - Constitution is clear and concise'
       : 'NO - Write harder. Make prohibitions explicit.',
   };
 }