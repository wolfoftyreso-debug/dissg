 /**
  * SELF-TEST RUNNER
  * 
  * Continuous validation engine.
  * Runs the 5 mandatory tests + principle checks.
  */
 
 import { SYSTEM_FAULT_CODES } from './system-fault-codes';
 
 export type TestType = 
   | 'principle_check'
   | 'ontological_density'
   | 'semantic_overlap'
   | 'aggregability'
   | 'ai_confusion'
   | 'historical_integrity';
 
 export type TestStatus = 'pass' | 'fail' | 'warning' | 'skipped';
 
 export interface TestResult {
   testId: string;
   testType: TestType;
   status: TestStatus;
   faultCodes: string[];
   details: Record<string, unknown>;
   executedAt: string;
   durationMs: number;
 }
 
 export interface TestSuite {
   id: string;
   name: string;
   description: string;
   tests: TestDefinition[];
 }
 
 export interface TestDefinition {
   id: string;
   type: TestType;
   name: string;
   description: string;
   faultCodesOnFail: string[];
   check: () => Promise<TestCheckResult>;
 }
 
 export interface TestCheckResult {
   passed: boolean;
   warnings: string[];
   errors: string[];
   data?: Record<string, unknown>;
 }
 
 // ============================================================
 // DIAGNOSTIC QUESTIONS (the system's conscience)
 // ============================================================
 
 export interface DiagnosticTestQuestions {
   question: string;
   testType: TestType;
   mustBeYes: boolean;
   faultCodeOnFail: string;
 }
 
 export const SYSTEM_DIAGNOSTIC_QUESTIONS: DiagnosticTestQuestions[] = [
   // Principle 1: Machines are primary users
   {
     question: 'Can an unknown AI model use the system without documentation?',
     testType: 'principle_check',
     mustBeYes: true,
     faultCodeOnFail: 'SYS-MRP-001',
   },
   
   // Principle 2: Explicit uncertainty
   {
     question: 'Is there data that appears clean but is actually uncertain?',
     testType: 'principle_check',
     mustBeYes: false, // Must be NO
     faultCodeOnFail: 'DAT-UNC-001',
   },
   
   // Principle 3: Temporal axis
   {
     question: 'Can every data point be reproduced exactly as it appeared at a historical moment?',
     testType: 'principle_check',
     mustBeYes: true,
     faultCodeOnFail: 'DAT-TMP-002',
   },
   
   // Structural discipline
   {
     question: 'Is there any object that is only understood if you already know what it is?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'MOD-NRM-002',
   },
   {
     question: 'Is there something that lies under something else without a formal relation?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'MOD-HIR-001',
   },
   {
     question: 'Is there a numeric value that cannot be unambiguously converted to another unit?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'MOD-UNT-001',
   },
   
   // Semantic warfare
   {
     question: 'Has data been discarded because it was contradictory?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'DAT-UNC-002',
   },
   {
     question: 'Are there two data points with the same value but different definitions treated as the same?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'DAT-SEM-001',
   },
   {
     question: 'Has a schema been changed without receiving a new ID?',
     testType: 'principle_check',
     mustBeYes: false,
     faultCodeOnFail: 'DAT-SEM-002',
   },
   
   // Future robustness
   {
     question: 'Can the system describe the same reality even if all current institutions disappear?',
     testType: 'principle_check',
     mustBeYes: true,
     faultCodeOnFail: 'SYS-MRP-001',
   },
   {
     question: 'Can the system understand, validate, and develop itself without you?',
     testType: 'principle_check',
     mustBeYes: true,
     faultCodeOnFail: 'SYS-MRP-001',
   },
 ];
 
 // ============================================================
 // TEST EXECUTION ENGINE
 // ============================================================
 
 interface SystemFault {
   faultCode: string;
   detectedAt: string;
   testId: string;
   details: Record<string, unknown>;
   resolved: boolean;
   resolvedAt?: string;
 }
 
 const activeSystemFaults: SystemFault[] = [];
 const testResults: TestResult[] = [];
 
 export async function runTest(test: TestDefinition): Promise<TestResult> {
   const startTime = performance.now();
   
   try {
     const result = await test.check();
     const endTime = performance.now();
     
     const testResult: TestResult = {
       testId: test.id,
       testType: test.type,
       status: result.passed ? (result.warnings.length > 0 ? 'warning' : 'pass') : 'fail',
       faultCodes: result.passed ? [] : test.faultCodesOnFail,
       details: {
         warnings: result.warnings,
         errors: result.errors,
         ...result.data,
       },
       executedAt: new Date().toISOString(),
       durationMs: endTime - startTime,
     };
     
     testResults.push(testResult);
     
     // Register faults if failed
     if (!result.passed) {
       for (const faultCode of test.faultCodesOnFail) {
         registerSystemFault(faultCode, test.id, testResult.details);
       }
     }
     
     return testResult;
   } catch (error) {
     const endTime = performance.now();
     
     const testResult: TestResult = {
       testId: test.id,
       testType: test.type,
       status: 'fail',
       faultCodes: ['SYS-MRP-001'], // Test execution failure
       details: { error: error instanceof Error ? error.message : 'Unknown error' },
       executedAt: new Date().toISOString(),
       durationMs: endTime - startTime,
     };
     
     testResults.push(testResult);
     return testResult;
   }
 }
 
 export async function runTestSuite(suite: TestSuite): Promise<TestResult[]> {
   const results: TestResult[] = [];
   
   for (const test of suite.tests) {
     const result = await runTest(test);
     results.push(result);
   }
   
   return results;
 }
 
 function registerSystemFault(
   faultCode: string, 
   testId: string, 
   details: Record<string, unknown>
 ): void {
   const existingFault = activeSystemFaults.find(
     f => f.faultCode === faultCode && !f.resolved
   );
   
   if (!existingFault) {
     activeSystemFaults.push({
       faultCode,
       detectedAt: new Date().toISOString(),
       testId,
       details,
       resolved: false,
     });
   }
 }
 
 export function resolveSystemFault(faultCode: string): boolean {
   const fault = activeSystemFaults.find(
     f => f.faultCode === faultCode && !f.resolved
   );
   
   if (fault) {
     fault.resolved = true;
     fault.resolvedAt = new Date().toISOString();
     return true;
   }
   
   return false;
 }
 
 export function getActiveSystemFaults(): SystemFault[] {
   return activeSystemFaults.filter(f => !f.resolved);
 }
 
 export function getAllSystemFaults(): SystemFault[] {
   return [...activeSystemFaults];
 }
 
 export function getTestResults(): TestResult[] {
   return [...testResults];
 }
 
 export function clearTestResults(): void {
   testResults.length = 0;
 }
 
 export function clearResolvedFaults(): void {
   const activeFaults = activeSystemFaults.filter(f => !f.resolved);
   activeSystemFaults.length = 0;
   activeSystemFaults.push(...activeFaults);
 }
 
 // ============================================================
 // SYSTEM HEALTH EVALUATION
 // ============================================================
 
 export interface SystemHealthState {
   healthy: boolean;
   criticalFaults: number;
   errorFaults: number;
   warningFaults: number;
   lastChecked: string;
   canOperate: boolean;
 }
 
 export function evaluateSystemHealth(): SystemHealthState {
   const activeFaults = getActiveSystemFaults();
   
   let criticalFaults = 0;
   let errorFaults = 0;
   let warningFaults = 0;
   
   for (const fault of activeFaults) {
     const faultDef = SYSTEM_FAULT_CODES[fault.faultCode];
     if (faultDef) {
       switch (faultDef.severity) {
         case 'CRITICAL':
           criticalFaults++;
           break;
         case 'ERROR':
           errorFaults++;
           break;
         case 'WARNING':
           warningFaults++;
           break;
       }
     }
   }
   
   return {
     healthy: criticalFaults === 0 && errorFaults === 0,
     criticalFaults,
     errorFaults,
     warningFaults,
     lastChecked: new Date().toISOString(),
     canOperate: criticalFaults === 0,
   };
 }
 
 // ============================================================
 // DIAGNOSTIC QUESTION EVALUATOR
 // ============================================================
 
 export function evaluateTestQuestions(
   answers: Map<string, boolean>
 ): { passed: boolean; faults: string[] } {
   const faults: string[] = [];
   
   for (const question of SYSTEM_DIAGNOSTIC_QUESTIONS) {
     const answer = answers.get(question.question);
     
     if (answer === undefined) {
       continue; // Question not answered
     }
     
     const expectedAnswer = question.mustBeYes;
     
     if (answer !== expectedAnswer) {
       faults.push(question.faultCodeOnFail);
     }
   }
   
   return {
     passed: faults.length === 0,
     faults,
   };
 }