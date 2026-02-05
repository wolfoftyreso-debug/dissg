 /**
  * TRUTH ENGINE - INVARIANT TESTS
  * 
  * Verify that the five laws are enforced.
  */
 
 import type { Measure, Schema, CoreObject } from '../core/ontology';
 import { runInvariants } from '../core/invariants';
 import { create, _clearForTesting, getStats } from '../store/append-only';
 import { POPULATION_SCHEMA, SCB_SOURCE, SWEDEN_ENTITY, SWEDEN_POPULATION_2023 } from '../schemas/population';
 
 /**
  * TEST RESULT
  */
 interface TestResult {
   name: string;
   passed: boolean;
   message: string;
 }
 
 /**
  * RUN ALL TESTS
  */
 export function runAllTests(): {
   passed: number;
   failed: number;
   results: TestResult[];
 } {
   _clearForTesting(); // Start fresh
   
   const results: TestResult[] = [
     testValidMeasureAccepted(),
     testMeasureWithoutTemporalRejected(),
     testMeasureWithoutUnitRejected(),
     testMeasureWithoutSourceRejected(),
     testSchemaWithoutDefinitionRejected(),
     testInvalidBaseClassRejected(),
     testDuplicateIdRejected(),
     testSeedDataWorks(),
   ];
   
   return {
     passed: results.filter(r => r.passed).length,
     failed: results.filter(r => !r.passed).length,
     results,
   };
 }
 
 /**
  * TEST: Valid measure is accepted
  */
 function testValidMeasureAccepted(): TestResult {
   const result = runInvariants(SWEDEN_POPULATION_2023);
   
   return {
     name: 'Valid measure is accepted',
     passed: result.passed && result.violations.length === 0,
     message: result.passed 
       ? 'Valid measure passed all invariants'
       : `Unexpected violations: ${result.violations.map(v => v.message).join(', ')}`,
   };
 }
 
 /**
  * TEST: Measure without temporal is rejected
  */
 function testMeasureWithoutTemporalRejected(): TestResult {
   const badMeasure = {
     id: 'measure:v1:test123',
     baseClass: 'Measure' as const,
     schema_id: 'test',
     entity_id: 'test',
     created_at: new Date().toISOString(),
     created_by: 'test',
     value: 100,
     unit: 'persons',
     // MISSING: temporal
     source: {
       source_id: 'test',
       source_version: '1',
       source_accessed_at: new Date().toISOString(),
     },
     uncertainty: {
       confidence_interval: [100, 100] as [number, number],
       coverage: 1,
       methodology_note: 'test',
     },
   } as unknown as Measure;
   
   const result = runInvariants(badMeasure);
   
   return {
     name: 'Measure without temporal is rejected',
     passed: !result.passed && result.violations.some(v => v.invariant_id === 'INV-001'),
     message: !result.passed 
       ? 'Correctly rejected measure without temporal'
       : 'ERROR: Should have rejected measure without temporal',
   };
 }
 
 /**
  * TEST: Measure without unit is rejected
  */
 function testMeasureWithoutUnitRejected(): TestResult {
   const badMeasure = {
     id: 'measure:v1:test456',
     baseClass: 'Measure' as const,
     schema_id: 'test',
     entity_id: 'test',
     created_at: new Date().toISOString(),
     created_by: 'test',
     value: 100,
     unit: '', // EMPTY UNIT
     temporal: {
       observed_at: new Date().toISOString(),
       valid_from: new Date().toISOString(),
       valid_to: null,
     },
     source: {
       source_id: 'test',
       source_version: '1',
       source_accessed_at: new Date().toISOString(),
     },
     uncertainty: {
       confidence_interval: [100, 100] as [number, number],
       coverage: 1,
       methodology_note: 'test',
     },
   } as Measure;
   
   const result = runInvariants(badMeasure);
   
   return {
     name: 'Measure without unit is rejected',
     passed: !result.passed && result.violations.some(v => v.invariant_id === 'INV-002'),
     message: !result.passed 
       ? 'Correctly rejected measure without unit'
       : 'ERROR: Should have rejected measure without unit',
   };
 }
 
 /**
  * TEST: Measure without source is rejected
  */
 function testMeasureWithoutSourceRejected(): TestResult {
   const badMeasure = {
     id: 'measure:v1:test789',
     baseClass: 'Measure' as const,
     schema_id: 'test',
     entity_id: 'test',
     created_at: new Date().toISOString(),
     created_by: 'test',
     value: 100,
     unit: 'persons',
     temporal: {
       observed_at: new Date().toISOString(),
       valid_from: new Date().toISOString(),
       valid_to: null,
     },
     // MISSING: source
     uncertainty: {
       confidence_interval: [100, 100] as [number, number],
       coverage: 1,
       methodology_note: 'test',
     },
   } as unknown as Measure;
   
   const result = runInvariants(badMeasure);
   
   return {
     name: 'Measure without source is rejected',
     passed: !result.passed && result.violations.some(v => v.invariant_id === 'INV-003'),
     message: !result.passed 
       ? 'Correctly rejected measure without source'
       : 'ERROR: Should have rejected measure without source',
   };
 }
 
 /**
  * TEST: Schema without definition is rejected
  */
 function testSchemaWithoutDefinitionRejected(): TestResult {
   const badSchema = {
     id: 'schema:v1:testabc',
     baseClass: 'Schema' as const,
     schema_id: 'system',
     created_at: new Date().toISOString(),
     created_by: 'test',
     name: 'Bad Schema',
     definition: 'short', // TOO SHORT
     unit: 'test',
     dimension: 'test',
     version: 1,
     supersedes: null,
   } as Schema;
   
   const result = runInvariants(badSchema);
   
   return {
     name: 'Schema without definition is rejected',
     passed: !result.passed && result.violations.some(v => v.invariant_id === 'INV-004'),
     message: !result.passed 
       ? 'Correctly rejected schema without meaningful definition'
       : 'ERROR: Should have rejected schema without definition',
   };
 }
 
 /**
  * TEST: Invalid base class is rejected
  */
 function testInvalidBaseClassRejected(): TestResult {
   const badObject = {
     id: 'invalid:v1:test',
     baseClass: 'InvalidClass' as any,
     schema_id: 'test',
     created_at: new Date().toISOString(),
     created_by: 'test',
   } as CoreObject;
   
   const result = runInvariants(badObject);
   
   return {
     name: 'Invalid base class is rejected',
     passed: !result.passed && result.violations.some(v => v.invariant_id === 'INV-005'),
     message: !result.passed 
       ? 'Correctly rejected invalid base class'
       : 'ERROR: Should have rejected invalid base class',
   };
 }
 
 /**
  * TEST: Duplicate ID is rejected
  */
 function testDuplicateIdRejected(): TestResult {
   _clearForTesting();
   
   // First write should succeed
   const first = create(POPULATION_SCHEMA, 'test');
   if (!first.success) {
     return {
       name: 'Duplicate ID is rejected',
       passed: false,
       message: `First write failed: ${first.error}`,
     };
   }
   
   // Second write with same ID should fail
   const second = create(POPULATION_SCHEMA, 'test');
   
   return {
     name: 'Duplicate ID is rejected',
     passed: !second.success && second.error?.includes('already exists'),
     message: !second.success 
       ? 'Correctly rejected duplicate ID'
       : 'ERROR: Should have rejected duplicate ID',
   };
 }
 
 /**
  * TEST: Seed data works
  */
 function testSeedDataWorks(): TestResult {
   _clearForTesting();
   
   // Write all seed data
   const writes = [
     create(POPULATION_SCHEMA, 'seed'),
     create(SCB_SOURCE, 'seed'),
     create(SWEDEN_ENTITY, 'seed'),
     create(SWEDEN_POPULATION_2023, 'seed'),
   ];
   
   const allSucceeded = writes.every(w => w.success);
   const stats = getStats();
   
   return {
     name: 'Seed data works',
     passed: allSucceeded && stats.totalObjects === 4,
     message: allSucceeded 
       ? `Seed data written: ${stats.totalObjects} objects`
       : `Seed data failed: ${writes.filter(w => !w.success).map(w => w.error).join(', ')}`,
   };
 }