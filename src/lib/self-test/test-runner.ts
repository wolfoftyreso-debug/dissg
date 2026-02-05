 /**
  * SELF-TEST RUNNER
  * 
  * Continuous and batch testing infrastructure.
  * Deterministic yes/no answers only.
  */
 
 import { SYSTEM_FAULT_CODES, type SystemFaultCodeDefinition, type SystemDomain } from './system-fault-codes';
 
 export type TestType = 'structural' | 'semantic' | 'machine-readability' | 'aggregability' | 'security';
 export type TestStatus = 'pass' | 'fail' | 'warning' | 'skipped';
 
 export interface TestResult {
   testId: string;
   testType: TestType;
   status: TestStatus;
   faultCode?: string;
   details: string;
   timestamp: Date;
   deterministicAnswer: boolean; // Must always be true
   evidence?: Record<string, unknown>;
 }
 
 export interface TestCheckResult {
   passed: boolean;
   faultCode?: string;
   details: string;
   evidence?: Record<string, unknown>;
 }
 
 export interface TestDefinition {
   id: string;
   type: TestType;
   name: string;
   description: string;
   check: () => TestCheckResult;
 }
 
 export interface TestSuite {
   name: string;
   description: string;
   tests: TestDefinition[];
 }
 
 // Diagnostic test questions (from masterprompt)
 export interface DiagnosticTestQuestions {
   // Structural Integrity
   hasObjectsWithoutSchema: boolean;
   hasNonReversibleRelations: boolean;
   hasFieldsWithoutSemanticDefinition: boolean;
   hasUndeclaredConcepts: boolean;
   hasTimeSeriesWithoutTemporalAxis: boolean;
   
   // Semantic Stability
   hasMultiMeaningConcepts: boolean;
   hasSemanticDrift: boolean;
   
   // Machine Readability (0-100 scores)
   machineReadabilityScores: Record<string, number>;
   
   // Aggregability
   directlyAggregable: string[];
   requiresTransformation: string[];
   impossibleToAggregate: string[];
 }
 
 // Test results storage
 const testResults: TestResult[] = [];
 const activeSystemFaults: Map<string, { fault: SystemFaultCodeDefinition; detectedAt: Date; resolved: boolean }> = new Map();
 
 /**
  * Run a single test and record result
  */
 export function runTest(test: TestDefinition): TestResult {
   const checkResult = test.check();
   
   const result: TestResult = {
     testId: test.id,
     testType: test.type,
     status: checkResult.passed ? 'pass' : 'fail',
     faultCode: checkResult.faultCode,
     details: checkResult.details,
     timestamp: new Date(),
     deterministicAnswer: true, // Always deterministic
     evidence: checkResult.evidence,
   };
   
   testResults.push(result);
   
   // Register fault if test failed
   if (!checkResult.passed && checkResult.faultCode) {
     const faultDef = SYSTEM_FAULT_CODES[checkResult.faultCode];
     if (faultDef) {
       activeSystemFaults.set(checkResult.faultCode, {
         fault: faultDef,
         detectedAt: new Date(),
         resolved: false,
       });
     }
   }
   
   return result;
 }
 
 /**
  * Run entire test suite
  */
 export function runTestSuite(suite: TestSuite): TestResult[] {
   return suite.tests.map(test => runTest(test));
 }
 
 /**
  * Mark a fault as resolved
  */
 export function resolveSystemFault(faultCode: string): boolean {
   const fault = activeSystemFaults.get(faultCode);
   if (fault) {
     fault.resolved = true;
     return true;
   }
   return false;
 }
 
 /**
  * Get all active (unresolved) faults
  */
 export function getActiveSystemFaults(): Array<{ code: string; fault: SystemFaultCodeDefinition; detectedAt: Date }> {
   return Array.from(activeSystemFaults.entries())
     .filter(([_, data]) => !data.resolved)
     .map(([code, data]) => ({
       code,
       fault: data.fault,
       detectedAt: data.detectedAt,
     }));
 }
 
 /**
  * Get all faults (including resolved)
  */
 export function getAllSystemFaults(): Array<{ code: string; fault: SystemFaultCodeDefinition; detectedAt: Date; resolved: boolean }> {
   return Array.from(activeSystemFaults.entries())
     .map(([code, data]) => ({
       code,
       fault: data.fault,
       detectedAt: data.detectedAt,
       resolved: data.resolved,
     }));
 }
 
 /**
  * Get test results
  */
 export function getTestResults(options?: { type?: TestType; since?: Date }): TestResult[] {
   let results = [...testResults];
   
   if (options?.type) {
     results = results.filter(r => r.testType === options.type);
   }
   
   if (options?.since) {
     results = results.filter(r => r.timestamp >= options.since);
   }
   
   return results;
 }
 
 /**
  * Clear test results (for testing purposes only)
  */
 export function clearTestResults(): void {
   testResults.length = 0;
 }
 
 /**
  * Clear resolved faults
  */
 export function clearResolvedFaults(): void {
   for (const [code, data] of activeSystemFaults.entries()) {
     if (data.resolved) {
       activeSystemFaults.delete(code);
     }
   }
 }
 
 /**
  * System health state based on active faults
  */
 export interface SystemHealthState {
   status: 'healthy' | 'degraded' | 'critical';
   criticalFaults: number;
   warningFaults: number;
   infoFaults: number;
   blockedDomains: SystemDomain[];
   lastCheck: Date;
 }
 
 export function evaluateSystemHealth(): SystemHealthState {
   const activeFaults = getActiveSystemFaults();
   
   const criticalFaults = activeFaults.filter(f => f.fault.severity === 'critical');
   const warningFaults = activeFaults.filter(f => f.fault.severity === 'warning');
   const infoFaults = activeFaults.filter(f => f.fault.severity === 'info');
   
   const blockedDomains = [...new Set(
     criticalFaults
       .filter(f => f.fault.blockingLevel === 'full')
       .map(f => f.fault.domain)
   )];
   
   let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
   if (criticalFaults.length > 0) {
     status = 'critical';
   } else if (warningFaults.length > 0) {
     status = 'degraded';
   }
   
   return {
     status,
     criticalFaults: criticalFaults.length,
     warningFaults: warningFaults.length,
     infoFaults: infoFaults.length,
     blockedDomains,
     lastCheck: new Date(),
   };
 }
 
 /**
  * Evaluate the diagnostic test questions
  * Returns deterministic yes/no for each question
  */
 export function evaluateTestQuestions(): DiagnosticTestQuestions {
   // These would be populated by actual system checks
   // For now, returning structure with defaults
   return {
     hasObjectsWithoutSchema: false,
     hasNonReversibleRelations: false,
     hasFieldsWithoutSemanticDefinition: false,
     hasUndeclaredConcepts: false,
     hasTimeSeriesWithoutTemporalAxis: false,
     hasMultiMeaningConcepts: false,
     hasSemanticDrift: false,
     machineReadabilityScores: {},
     directlyAggregable: [],
     requiresTransformation: [],
     impossibleToAggregate: [],
   };
 }