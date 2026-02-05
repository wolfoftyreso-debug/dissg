 /**
  * TRUTH ENGINE - ENTITY TESTS (Step 9.6)
  * 
  * Deliberate sabotage tests to prove the system refuses fantasy.
  */
 
 import { runInvariants, validateMeasureWithRegistry } from '../core/invariants';
 import { entityExists } from '../entities/registry';
 import { SWEDEN } from '../entities/sweden';
 import { POPULATION_SWEDEN_2023 } from '../first-truth/insert-first-truth';
 import type { Entity, Measure } from '../core/ontology';
 
 export interface EntityTestResult {
   testName: string;
   expectedToFail: boolean;
   actuallyFailed: boolean;
   passed: boolean;
   errorMessage?: string;
 }
 
 export function runEntitySabotageTests(): EntityTestResult[] {
   const results: EntityTestResult[] = [];
   
   // TEST 1: Valid Sweden entity → should pass
   const swedenResult = runInvariants(SWEDEN);
   results.push({
     testName: 'Valid Sweden entity',
     expectedToFail: false,
     actuallyFailed: !swedenResult.passed,
     passed: swedenResult.passed,
   });
   
   // TEST 2: Entity without valid_from → should fail
   const noTemporalEntity: Entity = {
     ...SWEDEN,
     id: 'entity:v1:sabotage:no-time',
     identifiers: {
       ...SWEDEN.identifiers,
       valid_from: undefined as any,  // REMOVED
     },
   };
   const noTemporalResult = runInvariants(noTemporalEntity);
   results.push({
     testName: 'Entity without valid_from',
     expectedToFail: true,
     actuallyFailed: !noTemporalResult.passed,
     passed: !noTemporalResult.passed,
     errorMessage: noTemporalResult.violations[0]?.message,
   });
   
   // TEST 3: Entity without source → should fail
   const noSourceEntity: Entity = {
     ...SWEDEN,
     id: 'entity:v1:sabotage:no-source',
     identifiers: {
       ...SWEDEN.identifiers,
       source_id: undefined as any,  // REMOVED
     },
   };
   const noSourceResult = runInvariants(noSourceEntity);
   results.push({
     testName: 'Entity without source_id',
     expectedToFail: true,
     actuallyFailed: !noSourceResult.passed,
     passed: !noSourceResult.passed,
     errorMessage: noSourceResult.violations[0]?.message,
   });
   
   // TEST 4: Measure referencing unknown entity (Narnia) → should fail
   const narniaMeasure: Measure = {
     ...POPULATION_SWEDEN_2023,
     id: 'measure:v1:sabotage:narnia',
     entity_id: 'core:entity:country_narnia:v1',  // FANTASY
   };
   const narniaResult = validateMeasureWithRegistry(narniaMeasure, entityExists);
   results.push({
     testName: 'Measure referencing Narnia (fantasy world)',
     expectedToFail: true,
     actuallyFailed: !narniaResult.passed,
     passed: !narniaResult.passed,
     errorMessage: narniaResult.violations[0]?.message,
   });
   
   // TEST 5: Valid measure with valid entity → should pass
   const validResult = validateMeasureWithRegistry(POPULATION_SWEDEN_2023, entityExists);
   results.push({
     testName: 'Valid measure with valid Sweden entity',
     expectedToFail: false,
     actuallyFailed: !validResult.passed,
     passed: validResult.passed,
   });
   
   return results;
 }
 
 /**
  * Run Step 9 verification
  */
 export function runStep9(): {
   tests: EntityTestResult[];
   summary: string;
 } {
   console.log('═══════════════════════════════════════════════════════════════');
   console.log('TRUTH ENGINE - STEP 9: EXPLICIT ENTITIES');
   console.log('═══════════════════════════════════════════════════════════════');
   
   const tests = runEntitySabotageTests();
   const passCount = tests.filter(t => t.passed).length;
   
   console.log(`\n✓ Entity tests: ${passCount}/${tests.length} passed`);
   
   for (const test of tests) {
     const status = test.passed ? '✓' : '✗';
     console.log(`  ${status} ${test.testName}`);
     if (!test.passed && test.errorMessage) {
       console.log(`    Error: ${test.errorMessage}`);
     }
   }
   
   const allPassed = passCount === tests.length;
   const summary = allPassed
     ? `
 ═══════════════════════════════════════════════════════════════
 ✓ STEP 9 COMPLETE: ENTITIES ARE FIRST-CLASS CITIZENS
 ═══════════════════════════════════════════════════════════════
 
 Sweden Entity:
 - ID: ${SWEDEN.id}
 - Valid from: 1523-06-06 (Gustav Vasa)
 - Source: SCB Geographic Registry
 
 New Laws Enforced:
 ❌ No values without entities
 ❌ No entities without time  
 ❌ No entities without source
 ❌ Fantasy worlds REJECTED (Narnia test passed)
 
 THIS IS IRREVERSIBLE.
 ═══════════════════════════════════════════════════════════════
 `
     : `
 ═══════════════════════════════════════════════════════════════
 ✗ STEP 9 FAILED: ENTITY SYSTEM COMPROMISED
 ═══════════════════════════════════════════════════════════════
 
 Failed tests: ${tests.filter(t => !t.passed).map(t => t.testName).join(', ')}
 
 THE SYSTEM ALLOWS FANTASY WORLDS. DO NOT PROCEED.
 ═══════════════════════════════════════════════════════════════
 `;
   
   console.log(summary);
   
   return { tests, summary };
 }