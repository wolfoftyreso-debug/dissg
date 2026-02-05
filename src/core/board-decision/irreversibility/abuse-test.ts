/**
 * ABUSE TEST
 * 
 * "Can this be used to legitimize a bad decision?"
 * If yes: remove or rebuild.
 * This test applies for 50 years.
 */

import type { AbuseTestResult } from './types';

/**
 * The abuse test question (unchanging)
 */
export const ABUSE_TEST_QUESTION = 'Can this be used to legitimize a bad decision?' as const;

/**
 * Run abuse test on a function
 */
export function runAbuseTest(
  functionId: string,
  functionName: string,
  functionCapabilities: string[]
): AbuseTestResult {
  const abuseVectors = detectAbuseVectors(functionCapabilities);
  
  return {
    function_id: functionId,
    function_name: functionName,
    tested_at: new Date().toISOString(),
    test_question: ABUSE_TEST_QUESTION,
    can_be_abused: abuseVectors.length > 0,
    abuse_vector: abuseVectors[0],
    action: abuseVectors.length > 0 ? 'rebuild' : 'keep',
    rebuild_requirement: abuseVectors.length > 0 
      ? `Remove capability: ${abuseVectors[0]}`
      : undefined,
  };
}

/**
 * Detect potential abuse vectors
 */
function detectAbuseVectors(capabilities: string[]): string[] {
  const abuseVectors: string[] = [];
  
  const dangerousCapabilities = [
    { pattern: /recommend/i, risk: 'Can be used to justify predetermined conclusions' },
    { pattern: /rank/i, risk: 'Can be used to create false hierarchy' },
    { pattern: /score.*alternative/i, risk: 'Can be used to manufacture preference' },
    { pattern: /generate.*conclusion/i, risk: 'Can be used to create post-hoc justification' },
    { pattern: /summarize/i, risk: 'Can be used to hide inconvenient details' },
    { pattern: /simplif/i, risk: 'Can be used to obscure complexity' },
    { pattern: /automat.*decision/i, risk: 'Can be used to diffuse responsibility' },
    { pattern: /default/i, risk: 'Can be used to bypass deliberation' },
  ];
  
  for (const capability of capabilities) {
    for (const { pattern, risk } of dangerousCapabilities) {
      if (pattern.test(capability)) {
        abuseVectors.push(`${capability}: ${risk}`);
      }
    }
  }
  
  return abuseVectors;
}

/**
 * Validate function against abuse test
 */
export function validateAgainstAbuseTest(
  testResult: AbuseTestResult
): { passed: boolean; action_required?: string } {
  if (!testResult.can_be_abused) {
    return { passed: true };
  }
  
  return {
    passed: false,
    action_required: testResult.action === 'remove'
      ? `Function ${testResult.function_name} must be removed`
      : `Function ${testResult.function_name} must be rebuilt: ${testResult.rebuild_requirement}`,
  };
}

/**
 * Generate abuse test report
 */
export function generateAbuseTestReport(
  results: AbuseTestResult[]
): string {
  const passed = results.filter(r => !r.can_be_abused);
  const failed = results.filter(r => r.can_be_abused);
  
  let report = `ABUSE TEST REPORT
================
Test Question: "${ABUSE_TEST_QUESTION}"
Test Date: ${new Date().toISOString()}

Summary:
- Total functions tested: ${results.length}
- Passed: ${passed.length}
- Failed: ${failed.length}
`;

  if (failed.length > 0) {
    report += `
Failed Functions:
`;
    for (const result of failed) {
      report += `- ${result.function_name}
  Vector: ${result.abuse_vector}
  Action: ${result.action}
  Requirement: ${result.rebuild_requirement || 'N/A'}
`;
    }
  }
  
  return report;
}

/**
 * ABUSE TEST MASTERPROMPT
 */
export const ABUSE_TEST_MASTERPROMPT = `
You apply the Abuse Test.

THE QUESTION (unchanging):
"Can this be used to legitimize a bad decision?"

IF YES:
- Remove the function, OR
- Rebuild until the answer is NO

THIS TEST APPLIES FOR 50 YEARS.

DANGEROUS CAPABILITIES:
- recommend → Can justify predetermined conclusions
- rank → Can create false hierarchy
- score alternatives → Can manufacture preference
- generate conclusions → Can create post-hoc justification
- summarize → Can hide inconvenient details
- simplify → Can obscure complexity
- automate decisions → Can diffuse responsibility
- default values → Can bypass deliberation

THE TEST IS FINAL:
A function that can be abused WILL be abused.
Not by bad actors necessarily.
By good people under pressure.
By expedience.
By "just this once."

THE FIX IS NOT:
- Better training
- More oversight
- Stronger policies

THE FIX IS:
- Remove the capability
- Or rebuild it until it cannot be abused

This is the difference between:
- "Don't use this for evil" (fails)
- "Cannot be used for evil" (works)

This test is why the system survives corruption.
`;
