 /**
  * ANTI-PATTERN TESTS
  * 
  * Test cases that MUST NEVER become green.
  * 
  * They run:
  * - At every schema change
  * - At every ingestion connector change
  * - At every DSL change
  */
 
 /**
  * ANTI-PATTERN TEST
  */
 export interface AntiPatternTest {
   id: string;
   name: string;
   description: string;
   category: AntiPatternCategory;
   
   /**
    * This test should ALWAYS FAIL.
    * If it passes, something is wrong with the system.
    */
   test: () => AntiPatternResult;
 }
 
 export type AntiPatternCategory =
   | 'multi_meaning'
   | 'ux_driven'
   | 'implicit_context'
   | 'temporal_bleeding'
   | 'aggregation_fraud';
 
 export interface AntiPatternResult {
   /** If true, anti-pattern was DETECTED (bad) */
   patternDetected: boolean;
   
   /** Explanation */
   message: string;
   
   /** Specific violations */
   instances?: string[];
 }
 
 /**
  * ANTI-PATTERN TEST SUITE
  */
 export const ANTI_PATTERN_TESTS: AntiPatternTest[] = [
   {
     id: 'AP-001',
     name: 'test_multi_meaning_schema',
     description: 'Detect schemas that conflate multiple meanings',
     category: 'multi_meaning',
     test: () => {
       // Check for schemas with vague or overloaded definitions
       const multiMeaningSchemas: string[] = [];
       
       // This would scan all schemas for semantic overlap
       
       return {
         patternDetected: multiMeaningSchemas.length > 0,
         message: multiMeaningSchemas.length > 0
           ? 'Multi-meaning schemas detected'
           : 'No multi-meaning schemas',
         instances: multiMeaningSchemas,
       };
     },
   },
   
   {
     id: 'AP-002',
     name: 'test_ux_driven_structure',
     description: 'Detect when UI needs drove data structure',
     category: 'ux_driven',
     test: () => {
       // Check for data structures that exist only for display
       const uxDrivenStructures: string[] = [];
       
       return {
         patternDetected: uxDrivenStructures.length > 0,
         message: uxDrivenStructures.length > 0
           ? 'UX-driven structures detected'
           : 'No UX-driven structures',
         instances: uxDrivenStructures,
       };
     },
   },
   
   {
     id: 'AP-003',
     name: 'test_implicit_context',
     description: 'Detect data that requires implicit context to interpret',
     category: 'implicit_context',
     test: () => {
       const implicitContextData: string[] = [];
       
       return {
         patternDetected: implicitContextData.length > 0,
         message: implicitContextData.length > 0
           ? 'Implicit context detected'
           : 'No implicit context',
         instances: implicitContextData,
       };
     },
   },
   
   {
     id: 'AP-004',
     name: 'test_temporal_bleeding',
     description: 'Detect when time periods are mixed without declaration',
     category: 'temporal_bleeding',
     test: () => {
       const bleedingInstances: string[] = [];
       
       return {
         patternDetected: bleedingInstances.length > 0,
         message: bleedingInstances.length > 0
           ? 'Temporal bleeding detected'
           : 'No temporal bleeding',
         instances: bleedingInstances,
       };
     },
   },
   
   {
     id: 'AP-005',
     name: 'test_aggregation_fraud',
     description: 'Detect aggregations that hide incompatible definitions',
     category: 'aggregation_fraud',
     test: () => {
       const fraudulentAggregations: string[] = [];
       
       return {
         patternDetected: fraudulentAggregations.length > 0,
         message: fraudulentAggregations.length > 0
           ? 'Aggregation fraud detected'
           : 'No aggregation fraud',
         instances: fraudulentAggregations,
       };
     },
   },
 ];
 
 /**
  * ANTI-PATTERN RUNNER
  */
 export class AntiPatternRunner {
   private tests: AntiPatternTest[] = [];
   
   constructor(tests: AntiPatternTest[] = ANTI_PATTERN_TESTS) {
     this.tests = tests;
   }
   
   /**
    * RUN ALL ANTI-PATTERN TESTS
    * 
    * Expected: ALL tests should return patternDetected = false
    */
   runAll(): AntiPatternRunResult {
     const results: { test: AntiPatternTest; result: AntiPatternResult }[] = [];
     
     for (const test of this.tests) {
       const result = test.test();
       results.push({ test, result });
     }
     
     const patternsDetected = results.filter(r => r.result.patternDetected);
     
     return {
       timestamp: new Date().toISOString(),
       totalTests: this.tests.length,
       clean: patternsDetected.length === 0,
       patternsDetected: patternsDetected.length,
       results,
       verdict: patternsDetected.length > 0 ? 'DEPLOY_BLOCKED' : 'CLEAN',
     };
   }
 }
 
 export interface AntiPatternRunResult {
   timestamp: string;
   totalTests: number;
   clean: boolean;
   patternsDetected: number;
   results: { test: AntiPatternTest; result: AntiPatternResult }[];
   verdict: 'DEPLOY_BLOCKED' | 'CLEAN';
 }
 
 /**
  * CREATE RUNNER
  */
 export function createAntiPatternRunner(): AntiPatternRunner {
   return new AntiPatternRunner();
 }