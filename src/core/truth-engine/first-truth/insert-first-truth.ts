 /**
  * TRUTH ENGINE - STEP 8: FIRST TRUTH INSERTION
  * 
  * This is the moment where the system either accepts reality or refuses it.
  * 
  * THE FIRST TRUTH:
  * "Sveriges befolkning (resident definition) år 2023 enligt SCB"
  */
 
 import { 
   create, 
   read, 
   _clearForTesting,
   getStats 
 } from '../store/append-only';
 import { runInvariants, enforceInvariants } from '../core/invariants';
 import { generateSourceId, generateEntityId, generateSchemaId, generateMeasureId } from '../core/ids';
 import type { Source, Entity, Schema, Measure } from '../core/ontology';
 
 const NOW = new Date().toISOString();
 
 /**
  * 8.1 DEFINE THE SOURCE (MANDATORY)
  * 
  * The source is a first-class object, not metadata.
  */
 export const SCB_SOURCE: Source = {
   id: generateSourceId('SCB', 'Population Statistics'),
   baseClass: 'Source',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   name: 'Population Statistics',
   organization: 'Statistics Sweden (SCB)',
   url: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/',
   reliability_score: 0.95,
   methodology_url: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/population-composition/population-statistics/',
 };
 
 /**
  * 8.2 CREATE THE DATA POINT (RAW RECORD)
  * 
  * Notice:
  * - No "Sweden" as text (it's an entity_id)
  * - No implicit country
  * - No assumed year
  * - No hidden context
  * 
  * EVERYTHING IS EXPLICIT.
  */
 export const SWEDEN_ENTITY: Entity = {
   id: generateEntityId('country', { iso3166_1_alpha2: 'SE', name: 'Sweden' }),
   baseClass: 'Entity',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   entity_type: 'country',
   name: 'Sweden',
   identifiers: {
     iso3166_1_alpha2: 'SE',
     iso3166_1_alpha3: 'SWE',
     iso3166_1_numeric: '752',
     name_en: 'Sweden',
     name_sv: 'Sverige',
   },
 };
 
 export const POPULATION_SCHEMA: Schema = {
   id: generateSchemaId('population_resident', 1),
   baseClass: 'Schema',
   schema_id: 'schema:v1:system',
   created_at: NOW,
   created_by: 'truth-engine:init',
   name: 'Population (Resident Definition)',
   definition: 'Total number of persons registered as residents in a geographic area at a specific point in time. Includes all persons with a registered address regardless of citizenship. Excludes temporary visitors and undocumented persons.',
   unit: 'persons',
   dimension: 'count',
   version: 1,
   supersedes: null,
 };
 
 export const POPULATION_SWEDEN_2023: Measure = {
   id: generateMeasureId(POPULATION_SCHEMA.id, SWEDEN_ENTITY.id, '2023-12-31'),
   baseClass: 'Measure',
   schema_id: POPULATION_SCHEMA.id,
   entity_id: SWEDEN_ENTITY.id,
   created_at: NOW,
   created_by: 'truth-engine:init',
   
   value: 10551707,  // SCB official figure
   unit: 'persons',
   
   temporal: {
     observed_at: '2023-12-31T00:00:00Z',
     valid_from: '2023-12-31T00:00:00Z',
     valid_to: null,  // Most recent
   },
   
   source: {
     source_id: SCB_SOURCE.id,
     source_version: '2024-02',
     source_accessed_at: '2025-02-05T00:00:00Z',
   },
   
   uncertainty: {
     confidence_interval: [10551707, 10551707],  // Exact count
     coverage: 0.99,  // 99% - excludes undocumented
     methodology_note: 'Based on population register. Excludes persons not registered in Sweden. Registration lag may affect accuracy by approximately 0.1%.',
   },
 };
 
 /**
  * 8.3 RUN INVARIANTS MANUALLY (FIRST GATEKEEPER)
  */
 export function validateRecord(record: any): { valid: boolean; errors: string[] } {
   const result = runInvariants(record);
   return {
     valid: result.passed,
     errors: result.violations.map(v => v.message),
   };
 }
 
 /**
  * 8.4 TRY TO WRITE TO CORE (THE MOMENT)
  * 
  * If this succeeds: ✔ system has accepted its first truth
  * If this fails: ✔ system has done its job
  * 
  * Both are correct outcomes - as long as the SYSTEM decides, not you.
  */
 export function insertFirstTruth(): {
   success: boolean;
   objectsWritten: number;
   results: { id: string; success: boolean; error?: string }[];
 } {
   _clearForTesting();  // Start fresh
   
   const results: { id: string; success: boolean; error?: string }[] = [];
   
   // Write schema first
   const schemaResult = create(POPULATION_SCHEMA, 'truth-engine:init');
   results.push({ 
     id: POPULATION_SCHEMA.id, 
     success: schemaResult.success, 
     error: schemaResult.error 
   });
   
   // Write source
   const sourceResult = create(SCB_SOURCE, 'truth-engine:init');
   results.push({ 
     id: SCB_SOURCE.id, 
     success: sourceResult.success, 
     error: sourceResult.error 
   });
   
   // Write entity
   const entityResult = create(SWEDEN_ENTITY, 'truth-engine:init');
   results.push({ 
     id: SWEDEN_ENTITY.id, 
     success: entityResult.success, 
     error: entityResult.error 
   });
   
   // Write measure (the actual truth)
   const measureResult = create(POPULATION_SWEDEN_2023, 'truth-engine:init');
   results.push({ 
     id: POPULATION_SWEDEN_2023.id, 
     success: measureResult.success, 
     error: measureResult.error 
   });
   
   const objectsWritten = results.filter(r => r.success).length;
   
   return {
     success: objectsWritten === 4,
     objectsWritten,
     results,
   };
 }
 
 /**
  * 8.5 FIRST DELIBERATE SABOTAGE TEST (VERY IMPORTANT)
  * 
  * We must prove the system refuses lies.
  */
 export interface SabotageTestResult {
   testName: string;
   expectedToFail: boolean;
   actuallyFailed: boolean;
   passed: boolean;
   errorMessage?: string;
 }
 
 export function runSabotageTests(): SabotageTestResult[] {
   const results: SabotageTestResult[] = [];
   
   // TEST 1: Remove source → should fail
   const noSource = {
     ...POPULATION_SWEDEN_2023,
     id: 'measure:v1:sabotage1',
     source: undefined,  // REMOVED
   };
   const noSourceResult = runInvariants(noSource as any);
   results.push({
     testName: 'Measure without source',
     expectedToFail: true,
     actuallyFailed: !noSourceResult.passed,
     passed: !noSourceResult.passed,
     errorMessage: noSourceResult.violations[0]?.message,
   });
   
   // TEST 2: Remove temporal → should fail
   const noTemporal = {
     ...POPULATION_SWEDEN_2023,
     id: 'measure:v1:sabotage2',
     temporal: undefined,  // REMOVED
   };
   const noTemporalResult = runInvariants(noTemporal as any);
   results.push({
     testName: 'Measure without temporal',
     expectedToFail: true,
     actuallyFailed: !noTemporalResult.passed,
     passed: !noTemporalResult.passed,
     errorMessage: noTemporalResult.violations[0]?.message,
   });
   
   // TEST 3: Remove unit → should fail
   const noUnit = {
     ...POPULATION_SWEDEN_2023,
     id: 'measure:v1:sabotage3',
     unit: '',  // EMPTY
   };
   const noUnitResult = runInvariants(noUnit as any);
   results.push({
     testName: 'Measure without unit',
     expectedToFail: true,
     actuallyFailed: !noUnitResult.passed,
     passed: !noUnitResult.passed,
     errorMessage: noUnitResult.violations[0]?.message,
   });
   
   // TEST 4: Invalid base class → should fail
   const invalidClass = {
     ...POPULATION_SWEDEN_2023,
     id: 'measure:v1:sabotage4',
     baseClass: 'FakeClass',  // INVALID
   };
   const invalidClassResult = runInvariants(invalidClass as any);
   results.push({
     testName: 'Invalid base class',
     expectedToFail: true,
     actuallyFailed: !invalidClassResult.passed,
     passed: !invalidClassResult.passed,
     errorMessage: invalidClassResult.violations[0]?.message,
   });
   
   // TEST 5: Valid data → should succeed
   const validResult = runInvariants(POPULATION_SWEDEN_2023);
   results.push({
     testName: 'Valid complete measure',
     expectedToFail: false,
     actuallyFailed: !validResult.passed,
     passed: validResult.passed,
   });
   
   return results;
 }
 
 /**
  * 8.6 THE FIRST PHILOSOPHICAL PROOF
  * 
  * You now have a system where:
  * - True data CAN enter
  * - Incomplete data is STOPPED
  * - No human "fixes things"
  * - Nothing is assumed
  * - Nothing is simplified
  * 
  * This is the actual birth of Truth Engine.
  * Everything before was preparation.
  */
 export function runStep8(): {
   insertion: ReturnType<typeof insertFirstTruth>;
   sabotage: SabotageTestResult[];
   summary: string;
 } {
   console.log('═══════════════════════════════════════════════════════════════');
   console.log('TRUTH ENGINE - STEP 8: FIRST TRUTH');
   console.log('═══════════════════════════════════════════════════════════════');
   
   // Insert first truth
   const insertion = insertFirstTruth();
   console.log(`\n✓ Insertion: ${insertion.objectsWritten}/4 objects written`);
   
   // Run sabotage tests
   const sabotage = runSabotageTests();
   const sabotagePassCount = sabotage.filter(t => t.passed).length;
   console.log(`\n✓ Sabotage tests: ${sabotagePassCount}/${sabotage.length} passed`);
   
   // Summary
   const allPassed = insertion.success && sabotagePassCount === sabotage.length;
   const summary = allPassed
     ? `
 ═══════════════════════════════════════════════════════════════
 ✓ FIRST TRUTH ACCEPTED
 ═══════════════════════════════════════════════════════════════
 
 Value: 10,551,707 persons
 Entity: Sweden (SE)
 Source: Statistics Sweden (SCB)
 Observed: 2023-12-31
 Coverage: 99%
 
 The system has accepted its first truth.
 All sabotage attempts were correctly rejected.
 
 THIS IS THE BIRTH OF TRUTH ENGINE.
 ═══════════════════════════════════════════════════════════════
 `
     : `
 ═══════════════════════════════════════════════════════════════
 ✗ SYSTEM INTEGRITY CHECK FAILED
 ═══════════════════════════════════════════════════════════════
 
 Insertion failures: ${insertion.results.filter(r => !r.success).map(r => r.error).join(', ')}
 Sabotage failures: ${sabotage.filter(t => !t.passed).map(t => t.testName).join(', ')}
 
 THE SYSTEM IS COMPROMISED. DO NOT PROCEED.
 ═══════════════════════════════════════════════════════════════
 `;
   
   console.log(summary);
   
   return { insertion, sabotage, summary };
 }