/**
 * SELF-TEST ENGINE: Test Runner
 * 
 * Continuous and batch testing infrastructure.
 * Runs validation tests against all system components.
 */

import { 
  SYSTEM_FAULT_CODES, 
  type SystemFaultCodeDefinition,
  type SystemSeverity,
  type SystemDomain 
} from './system-fault-codes';

// =============================================================================
// TYPES
// =============================================================================

export type TestType = 'realtime' | 'batch' | 'manual';
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestResult {
  testId: string;
  testName: string;
  category: SystemDomain;
  type: TestType;
  status: TestStatus;
  startTime: string;
  endTime: string | null;
  durationMs: number | null;
  faultCodesTriggered: string[];
  details: {
    checksPerformed: number;
    checksPassed: number;
    checksFailed: number;
    warnings: string[];
    errors: string[];
  };
}

export interface TestSuite {
  id: string;
  name: string;
  domain: SystemDomain;
  tests: TestDefinition[];
  runOrder: 'sequential' | 'parallel';
}

export interface TestDefinition {
  id: string;
  name: string;
  description: string;
  faultCodeOnFail: string;
  checkFn: () => Promise<TestCheckResult>;
  isEnabled: boolean;
  runInterval?: number; // ms for realtime tests
}

export interface TestCheckResult {
  passed: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// =============================================================================
// TEST QUESTIONS (Every test must answer these)
// =============================================================================

export interface DiagnosticTestQuestions {
  hasData: boolean;
  isTraceable: boolean;
  hasTolerance: boolean;
  isDeterministic: boolean;
  canBeMisunderstood: boolean;
}

export function evaluateTestQuestions(questions: DiagnosticTestQuestions): {
  passed: boolean;
  failedQuestions: string[];
} {
  const failedQuestions: string[] = [];
  
  if (!questions.hasData) {
    failedQuestions.push('Finns data?');
  }
  if (!questions.isTraceable) {
    failedQuestions.push('Är datan spårbar?');
  }
  if (!questions.hasTolerance) {
    failedQuestions.push('Finns tolerans?');
  }
  if (!questions.isDeterministic) {
    failedQuestions.push('Är logiken deterministisk?');
  }
  if (questions.canBeMisunderstood) {
    failedQuestions.push('Kan användaren missförstå?');
  }
  
  return {
    passed: failedQuestions.length === 0,
    failedQuestions,
  };
}

// =============================================================================
// ACTIVE FAULT CODES (System-level)
// =============================================================================

interface ActiveSystemFault {
  code: string;
  triggeredAt: string;
  testId: string;
  severity: SystemSeverity;
  autoRemediation: boolean;
  remediationAttempted: boolean;
  resolved: boolean;
  resolvedAt: string | null;
}

let activeSystemFaults: ActiveSystemFault[] = [];
let testResults: TestResult[] = [];

// =============================================================================
// TEST RUNNER
// =============================================================================

export async function runTest(test: TestDefinition): Promise<TestResult> {
  const startTime = new Date().toISOString();
  const startMs = Date.now();
  
  const result: TestResult = {
    testId: test.id,
    testName: test.name,
    category: test.faultCodeOnFail.split('-')[0] as SystemDomain,
    type: 'manual',
    status: 'running',
    startTime,
    endTime: null,
    durationMs: null,
    faultCodesTriggered: [],
    details: {
      checksPerformed: 1,
      checksPassed: 0,
      checksFailed: 0,
      warnings: [],
      errors: [],
    },
  };

  try {
    const checkResult = await test.checkFn();
    
    if (checkResult.passed) {
      result.status = 'passed';
      result.details.checksPassed = 1;
    } else {
      result.status = 'failed';
      result.details.checksFailed = 1;
      result.details.errors.push(checkResult.message);
      result.faultCodesTriggered.push(test.faultCodeOnFail);
      
      // Trigger the fault code
      triggerSystemFault(test.faultCodeOnFail, test.id);
    }
  } catch (error) {
    result.status = 'failed';
    result.details.checksFailed = 1;
    result.details.errors.push(error instanceof Error ? error.message : 'Unknown error');
    result.faultCodesTriggered.push(test.faultCodeOnFail);
    
    triggerSystemFault(test.faultCodeOnFail, test.id);
  }

  result.endTime = new Date().toISOString();
  result.durationMs = Date.now() - startMs;
  
  testResults.push(result);
  
  return result;
}

export async function runTestSuite(suite: TestSuite): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  if (suite.runOrder === 'parallel') {
    const promises = suite.tests
      .filter(t => t.isEnabled)
      .map(test => runTest(test));
    results.push(...await Promise.all(promises));
  } else {
    for (const test of suite.tests.filter(t => t.isEnabled)) {
      results.push(await runTest(test));
    }
  }
  
  return results;
}

// =============================================================================
// FAULT MANAGEMENT
// =============================================================================

function triggerSystemFault(code: string, testId: string): void {
  const definition = SYSTEM_FAULT_CODES.find(fc => fc.code === code);
  if (!definition) return;
  
  // Check if already active
  const existing = activeSystemFaults.find(f => f.code === code && !f.resolved);
  if (existing) return;
  
  activeSystemFaults.push({
    code,
    triggeredAt: new Date().toISOString(),
    testId,
    severity: definition.severity,
    autoRemediation: definition.autoRemediation,
    remediationAttempted: false,
    resolved: false,
    resolvedAt: null,
  });
}

export function resolveSystemFault(code: string): void {
  const fault = activeSystemFaults.find(f => f.code === code && !f.resolved);
  if (fault) {
    fault.resolved = true;
    fault.resolvedAt = new Date().toISOString();
  }
}

export function getActiveSystemFaults(): ActiveSystemFault[] {
  return activeSystemFaults.filter(f => !f.resolved);
}

export function getAllSystemFaults(): ActiveSystemFault[] {
  return [...activeSystemFaults];
}

export function getTestResults(): TestResult[] {
  return [...testResults];
}

export function clearTestResults(): void {
  testResults = [];
}

export function clearResolvedFaults(): void {
  activeSystemFaults = activeSystemFaults.filter(f => !f.resolved);
}

// =============================================================================
// SYSTEM STATE EVALUATION
// =============================================================================

export interface SystemHealthState {
  overallStatus: 'healthy' | 'degraded' | 'critical' | 'locked';
  activeFaultCount: number;
  criticalFaultCount: number;
  systemicFaultCount: number;
  lambdaEnabled: boolean;
  diagnosticsEnabled: boolean;
  lastTestRun: string | null;
  domainHealth: Record<SystemDomain, 'healthy' | 'warning' | 'critical'>;
}

export function evaluateSystemHealth(): SystemHealthState {
  const activeFaults = getActiveSystemFaults();
  const criticalFaults = activeFaults.filter(f => f.severity === 'critical');
  const systemicFaults = activeFaults.filter(f => f.severity === 'systemic');
  
  // Determine overall status
  let overallStatus: SystemHealthState['overallStatus'] = 'healthy';
  if (activeFaults.length > 0) overallStatus = 'degraded';
  if (criticalFaults.length > 0) overallStatus = 'critical';
  if (systemicFaults.length > 0) overallStatus = 'locked';
  
  // Determine domain health
  const domainHealth: Record<SystemDomain, 'healthy' | 'warning' | 'critical'> = {
    SYS: 'healthy',
    DAT: 'healthy',
    MOD: 'healthy',
    UI: 'healthy',
    AI: 'healthy',
    SEC: 'healthy',
  };
  
  for (const fault of activeFaults) {
    const definition = SYSTEM_FAULT_CODES.find(fc => fc.code === fault.code);
    if (!definition) continue;
    
    const domain = definition.domain;
    if (fault.severity === 'critical' || fault.severity === 'systemic') {
      domainHealth[domain] = 'critical';
    } else if (fault.severity === 'warning' && domainHealth[domain] !== 'critical') {
      domainHealth[domain] = 'warning';
    }
  }
  
  // Determine feature availability
  const lambdaEnabled = systemicFaults.length === 0;
  const diagnosticsEnabled = !activeFaults.some(f => 
    f.severity === 'critical' && 
    SYSTEM_FAULT_CODES.find(fc => fc.code === f.code)?.affectedComponents.includes('DiagnosticView')
  );
  
  const lastResult = testResults[testResults.length - 1];
  
  return {
    overallStatus,
    activeFaultCount: activeFaults.length,
    criticalFaultCount: criticalFaults.length,
    systemicFaultCount: systemicFaults.length,
    lambdaEnabled,
    diagnosticsEnabled,
    lastTestRun: lastResult?.endTime || null,
    domainHealth,
  };
}
