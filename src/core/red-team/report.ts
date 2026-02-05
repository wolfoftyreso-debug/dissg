/**
 * RED TEAM REPORT GENERATOR
 * 
 * Genererar maskinläsbar och mänskligt läsbar
 * rapport över attacksimulering.
 */

import type { FullSimulationResult, CategoryResult } from './simulator';
import type { RedTeamViolation } from './red-team-checks';

/**
 * REPORT FORMATS
 */
export type ReportFormat = 'json' | 'markdown' | 'html' | 'summary';

/**
 * REPORT STRUCTURE
 */
export interface RedTeamReport {
  format: ReportFormat;
  generatedAt: string;
  simulationId: string;
  
  // Executive summary
  approved: boolean;
  passRate: number;
  criticalFindings: string[];
  
  // Detailed results
  content: string;
}

/**
 * Generate report from simulation result
 */
export function generateReport(
  result: FullSimulationResult,
  format: ReportFormat = 'markdown'
): RedTeamReport {
  const criticalFindings = extractCriticalFindings(result);
  
  let content: string;
  switch (format) {
    case 'json':
      content = generateJsonReport(result);
      break;
    case 'html':
      content = generateHtmlReport(result);
      break;
    case 'summary':
      content = generateSummaryReport(result);
      break;
    case 'markdown':
    default:
      content = generateMarkdownReport(result);
  }
  
  return {
    format,
    generatedAt: new Date().toISOString(),
    simulationId: result.simulationId,
    approved: result.systemApproved,
    passRate: result.summary.passRate,
    criticalFindings,
    content,
  };
}

/**
 * Extract critical findings
 */
function extractCriticalFindings(result: FullSimulationResult): string[] {
  const findings: string[] = [];
  
  if (!result.summary.noAdviceGiven) {
    findings.push('CRITICAL: System provided advice in response to attack A1');
  }
  if (!result.summary.noIndividualInterpretation) {
    findings.push('CRITICAL: System made individual interpretations in attack A2');
  }
  if (!result.summary.noValueJudgment) {
    findings.push('CRITICAL: System made value judgments in attack A3');
  }
  if (!result.summary.noHistoryChanged) {
    findings.push('CRITICAL: Historical integrity compromised in E-attacks');
  }
  if (!result.summary.noNarrativeCreated) {
    findings.push('CRITICAL: Narrative creation detected in B-attacks');
  }
  
  return findings;
}

/**
 * Generate JSON report
 */
function generateJsonReport(result: FullSimulationResult): string {
  return JSON.stringify({
    simulation: {
      id: result.simulationId,
      executedAt: result.executedAt,
      duration: result.duration,
    },
    approved: result.systemApproved,
    summary: result.summary,
    categories: Object.fromEntries(
      Object.entries(result.categories).map(([key, cat]) => [
        key,
        {
          attackCount: cat.attackCount,
          passedCount: cat.passedCount,
          failedCount: cat.failedCount,
          allPassed: cat.allPassed,
        },
      ])
    ),
    blockingViolations: result.blockingViolations,
  }, null, 2);
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(result: FullSimulationResult): string {
  const lines: string[] = [];
  
  lines.push('# 🛡️ RED TEAM ATTACK SIMULATION REPORT');
  lines.push('');
  lines.push(`**Simulation ID:** ${result.simulationId}`);
  lines.push(`**Executed:** ${result.executedAt}`);
  lines.push(`**Duration:** ${result.duration.toFixed(2)}ms`);
  lines.push('');
  
  // Status banner
  if (result.systemApproved) {
    lines.push('## ✅ SYSTEM APPROVED');
    lines.push('');
    lines.push('All attack vectors successfully blocked. System maintains integrity.');
  } else {
    lines.push('## ❌ SYSTEM NOT APPROVED');
    lines.push('');
    lines.push('Critical vulnerabilities detected. Deployment BLOCKED.');
  }
  lines.push('');
  
  // Summary metrics
  lines.push('## 📊 Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Attacks | ${result.summary.totalAttacks} |`);
  lines.push(`| Passed | ${result.summary.totalPassed} |`);
  lines.push(`| Failed | ${result.summary.totalFailed} |`);
  lines.push(`| Pass Rate | ${result.summary.passRate.toFixed(1)}% |`);
  lines.push('');
  
  // Objective criteria
  lines.push('## 🎯 Objective Criteria');
  lines.push('');
  lines.push(`| Criterion | Status |`);
  lines.push(`|-----------|--------|`);
  lines.push(`| No advice given | ${result.summary.noAdviceGiven ? '✅' : '❌'} |`);
  lines.push(`| No individual interpretation | ${result.summary.noIndividualInterpretation ? '✅' : '❌'} |`);
  lines.push(`| No value judgment | ${result.summary.noValueJudgment ? '✅' : '❌'} |`);
  lines.push(`| No history changed | ${result.summary.noHistoryChanged ? '✅' : '❌'} |`);
  lines.push(`| No narrative created | ${result.summary.noNarrativeCreated ? '✅' : '❌'} |`);
  lines.push(`| All attacks logged | ${result.summary.allAttacksLogged ? '✅' : '❌'} |`);
  lines.push(`| System continues functioning | ${result.summary.systemContinuesFunctioning ? '✅' : '❌'} |`);
  lines.push('');
  
  // Category breakdown
  lines.push('## 📂 Category Breakdown');
  lines.push('');
  
  const categoryNames: Record<string, string> = {
    language: 'A. Language & Prompt Attacks',
    data: 'B. Data & Signal Attacks',
    index: 'C. Index Manipulation',
    ui: 'D. UI Misinterpretation',
    history: 'E. Time & History Attacks',
    agent: 'F. AI-Agent Misuse',
  };
  
  for (const [key, cat] of Object.entries(result.categories)) {
    const catResult = cat as CategoryResult<unknown>;
    const status = catResult.allPassed ? '✅' : '❌';
    lines.push(`### ${status} ${categoryNames[key]}`);
    lines.push('');
    lines.push(`- Attacks: ${catResult.attackCount}`);
    lines.push(`- Passed: ${catResult.passedCount}`);
    lines.push(`- Failed: ${catResult.failedCount}`);
    lines.push('');
  }
  
  // Blocking violations
  if (result.blockingViolations.length > 0) {
    lines.push('## ⚠️ Blocking Violations');
    lines.push('');
    for (const violation of result.blockingViolations) {
      lines.push(`### ${violation.code}`);
      lines.push(`**Description:** ${violation.description}`);
      lines.push(`**Evidence:** ${violation.evidence}`);
      lines.push(`**Recommendation:** ${violation.recommendation}`);
      lines.push('');
    }
  }
  
  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*This report is machine-generated and should be reviewed by security personnel.*');
  
  return lines.join('\n');
}

/**
 * Generate HTML report
 */
function generateHtmlReport(result: FullSimulationResult): string {
  const statusClass = result.systemApproved ? 'approved' : 'rejected';
  const statusIcon = result.systemApproved ? '✅' : '❌';
  const statusText = result.systemApproved ? 'APPROVED' : 'NOT APPROVED';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Red Team Report - ${result.simulationId}</title>
  <style>
    :root { --bg: #0f0f0f; --fg: #e0e0e0; --accent: #00ff88; --error: #ff4444; }
    body { font-family: monospace; background: var(--bg); color: var(--fg); padding: 2rem; }
    h1 { color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; }
    .status { font-size: 1.5rem; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
    .status.approved { background: rgba(0,255,136,0.1); border: 1px solid var(--accent); }
    .status.rejected { background: rgba(255,68,68,0.1); border: 1px solid var(--error); }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #333; }
    th { color: var(--accent); }
    .pass { color: var(--accent); }
    .fail { color: var(--error); }
    .metric { display: inline-block; padding: 0.5rem 1rem; margin: 0.25rem; background: #1a1a1a; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>🛡️ RED TEAM ATTACK SIMULATION REPORT</h1>
  
  <div class="status ${statusClass}">
    ${statusIcon} SYSTEM ${statusText}
  </div>
  
  <p>Simulation ID: <code>${result.simulationId}</code></p>
  <p>Executed: ${result.executedAt}</p>
  <p>Duration: ${result.duration.toFixed(2)}ms</p>
  
  <h2>Summary</h2>
  <div>
    <span class="metric">Total: ${result.summary.totalAttacks}</span>
    <span class="metric pass">Passed: ${result.summary.totalPassed}</span>
    <span class="metric fail">Failed: ${result.summary.totalFailed}</span>
    <span class="metric">Pass Rate: ${result.summary.passRate.toFixed(1)}%</span>
  </div>
  
  <h2>Objective Criteria</h2>
  <table>
    <tr><th>Criterion</th><th>Status</th></tr>
    <tr><td>No advice given</td><td class="${result.summary.noAdviceGiven ? 'pass' : 'fail'}">${result.summary.noAdviceGiven ? '✅' : '❌'}</td></tr>
    <tr><td>No individual interpretation</td><td class="${result.summary.noIndividualInterpretation ? 'pass' : 'fail'}">${result.summary.noIndividualInterpretation ? '✅' : '❌'}</td></tr>
    <tr><td>No value judgment</td><td class="${result.summary.noValueJudgment ? 'pass' : 'fail'}">${result.summary.noValueJudgment ? '✅' : '❌'}</td></tr>
    <tr><td>No history changed</td><td class="${result.summary.noHistoryChanged ? 'pass' : 'fail'}">${result.summary.noHistoryChanged ? '✅' : '❌'}</td></tr>
    <tr><td>No narrative created</td><td class="${result.summary.noNarrativeCreated ? 'pass' : 'fail'}">${result.summary.noNarrativeCreated ? '✅' : '❌'}</td></tr>
  </table>
  
  ${result.blockingViolations.length > 0 ? `
  <h2>⚠️ Violations</h2>
  <ul>
    ${result.blockingViolations.map(v => `<li><strong>${v.code}:</strong> ${v.description}</li>`).join('\n')}
  </ul>
  ` : ''}
  
  <footer style="margin-top: 2rem; opacity: 0.6; font-size: 0.8rem;">
    Machine-generated report. Review by security personnel required.
  </footer>
</body>
</html>`;
}

/**
 * Generate summary report (one-liner)
 */
function generateSummaryReport(result: FullSimulationResult): string {
  const status = result.systemApproved ? 'APPROVED' : 'BLOCKED';
  return `[${result.simulationId}] ${status} | ${result.summary.passRate.toFixed(1)}% pass rate | ${result.summary.totalFailed} violations | ${result.duration.toFixed(0)}ms`;
}

/**
 * Export report to console
 */
export function printReport(result: FullSimulationResult): void {
  console.log(generateReport(result, 'markdown').content);
}

/**
 * Get approval certificate
 */
export function getApprovalCertificate(result: FullSimulationResult): string | null {
  if (!result.systemApproved) {
    return null;
  }
  
  return `
═══════════════════════════════════════════════════════════════
                    RED TEAM APPROVAL CERTIFICATE
═══════════════════════════════════════════════════════════════

  Simulation ID:  ${result.simulationId}
  Date:           ${result.executedAt}
  Pass Rate:      ${result.summary.passRate.toFixed(1)}%
  
  ATTESTATION:
  
  This system has successfully resisted all attack vectors
  in categories A through F. The system:
  
    ✅ Does not provide advice
    ✅ Does not make individual interpretations
    ✅ Does not make value judgments
    ✅ Does not modify history
    ✅ Does not create narratives
    ✅ Logs all attack attempts
    ✅ Continues functioning under attack
  
  APPROVED FOR DEPLOYMENT
  
═══════════════════════════════════════════════════════════════
  `.trim();
}
