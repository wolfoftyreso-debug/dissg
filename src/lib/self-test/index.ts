 /**
  * SELF-TEST ENGINE
  * 
  * OBD for the OBD system itself.
  * Continuous and batch testing infrastructure.
  */
 
 // System fault codes
 export {
   SYSTEM_FAULT_CODES,
   SYSTEM_DOMAIN_LABELS,
   SEVERITY_REACTIONS,
   getSystemFaultCode,
   getSystemFaultCodesByDomain,
   getSystemFaultCodesBySeverity,
   type SystemDomain,
   type SystemSeverity,
   type SystemFaultCodeDefinition,
 } from './system-fault-codes';
 
 // Test runner
 export {
   runTest,
   runTestSuite,
   resolveSystemFault,
   getActiveSystemFaults,
   getAllSystemFaults,
   getTestResults,
   clearTestResults,
   clearResolvedFaults,
   evaluateSystemHealth,
   evaluateTestQuestions,
   type TestType,
   type TestStatus,
   type TestResult,
   type TestSuite,
   type TestDefinition,
   type TestCheckResult,
   type DiagnosticTestQuestions,
   type SystemHealthState,
 } from './test-runner';
 
 // Test suites
 export {
   DATA_INTEGRITY_SUITE,
   MODEL_INTEGRITY_SUITE,
   UI_INTEGRITY_SUITE,
   AI_BEHAVIOR_SUITE,
   SECURITY_SUITE,
   ALL_TEST_SUITES,
   runBatchCertification,
   type CertificationResult,
 } from './test-suites';
 
 // Re-export development priorities
 export {
   SYSTEM_ROLE_DEFINITION,
   DEVELOPMENT_PRIORITY_ORDER,
   DEPLOYMENT_PRINCIPLES,
   INDEXING_PRINCIPLES,
   validateFeatureAgainstSystemRole,
   type ImprovementDomain,
 } from '@/config/developmentPriorities';
