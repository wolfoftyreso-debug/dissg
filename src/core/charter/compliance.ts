/**
 * CHARTER COMPLIANCE
 * 
 * Validation functions to check if artifacts comply with the Charter.
 */

import type { 
  LegitimacyCriteria, 
  AbsoluteProhibition, 
  CharterCompliance,
  FailureMode 
} from './types';
import { DECISION_LEGITIMACY_CHARTER } from './charter-v1';

/**
 * Check if a decision meets legitimacy criteria
 */
export function checkLegitimacy(
  decision: Partial<LegitimacyCriteria>
): { legitimate: boolean; missing: (keyof LegitimacyCriteria)[] } {
  const required: (keyof LegitimacyCriteria)[] = [
    'context_explicit',
    'alternatives_exposed',
    'uncertainties_acknowledged',
    'scope_defined',
    'time_horizon_defined',
    'context_locked',
    'review_possible',
  ];
  
  const missing = required.filter(key => !decision[key]);
  
  return {
    legitimate: missing.length === 0,
    missing,
  };
}

/**
 * Detect prohibition violations
 */
export function detectViolations(
  artifact: {
    recommends?: boolean;
    ranks?: boolean;
    optimizes_conversion?: boolean;
    optimizes_persuasion?: boolean;
    optimizes_outcome?: boolean;
    hides_uncertainty?: boolean;
    rewrites_history?: boolean;
    conclusions_without_assumptions?: boolean;
  }
): AbsoluteProhibition[] {
  const violations: AbsoluteProhibition[] = [];
  
  if (artifact.recommends) violations.push('recommend_choice');
  if (artifact.ranks) violations.push('rank_by_desirability');
  if (artifact.optimizes_conversion) violations.push('optimize_conversion');
  if (artifact.optimizes_persuasion) violations.push('optimize_persuasion');
  if (artifact.optimizes_outcome) violations.push('optimize_outcome');
  if (artifact.hides_uncertainty) violations.push('hide_uncertainty');
  if (artifact.rewrites_history) violations.push('rewrite_history');
  if (artifact.conclusions_without_assumptions) violations.push('conclusions_without_assumptions');
  
  return violations;
}

/**
 * Full compliance check
 */
export function checkCompliance(
  decision: Partial<LegitimacyCriteria>,
  artifact: Parameters<typeof detectViolations>[0]
): CharterCompliance {
  const legitimacy = checkLegitimacy(decision);
  const violations = detectViolations(artifact);
  
  return {
    is_compliant: legitimacy.legitimate && violations.length === 0,
    violations,
    legitimacy_met: decision,
    legitimacy_missing: legitimacy.missing,
    checked_at: new Date().toISOString(),
  };
}

/**
 * Determine failure mode when non-compliant
 */
export function determineFailureMode(
  compliance: CharterCompliance
): FailureMode {
  // Critical violations = refuse
  const critical: AbsoluteProhibition[] = [
    'hide_uncertainty',
    'rewrite_history',
    'recommend_choice',
  ];
  
  if (compliance.violations.some(v => critical.includes(v))) {
    return 'refuse_to_process';
  }
  
  // Missing legitimacy = require context
  if (compliance.legitimacy_missing.length > 2) {
    return 'require_additional_context';
  }
  
  // Other issues = increase friction
  return 'increase_friction';
}

/**
 * Generate compliance report
 */
export function generateComplianceReport(
  compliance: CharterCompliance
): string {
  let report = `CHARTER COMPLIANCE REPORT\n`;
  report += `${'═'.repeat(40)}\n`;
  report += `Checked: ${compliance.checked_at}\n`;
  report += `Status: ${compliance.is_compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}\n\n`;
  
  if (compliance.violations.length > 0) {
    report += `VIOLATIONS (${compliance.violations.length}):\n`;
    for (const v of compliance.violations) {
      report += `  ✗ ${v.replace(/_/g, ' ')}\n`;
    }
    report += '\n';
  }
  
  if (compliance.legitimacy_missing.length > 0) {
    report += `MISSING LEGITIMACY CRITERIA (${compliance.legitimacy_missing.length}):\n`;
    for (const m of compliance.legitimacy_missing) {
      report += `  ○ ${m.replace(/_/g, ' ')}\n`;
    }
    report += '\n';
  }
  
  if (compliance.is_compliant) {
    report += `All ${DECISION_LEGITIMACY_CHARTER.articles.length} Charter articles satisfied.\n`;
  } else {
    const failureMode = determineFailureMode(compliance);
    report += `REQUIRED ACTION: ${failureMode.replace(/_/g, ' ')}\n`;
  }
  
  return report;
}

/**
 * COMPLIANCE MASTERPROMPT
 */
export const COMPLIANCE_MASTERPROMPT = `
You enforce CHARTER COMPLIANCE.

A DECISION IS LEGITIMATE IF AND ONLY IF:
1. Context is explicit
2. At least two realistic alternatives are exposed
3. Known uncertainties are acknowledged
4. Impact scope and time horizon are defined
5. Decision context is locked at commitment
6. Post-decision review is possible without rewriting history

ABSOLUTE PROHIBITIONS (system must NEVER):
- Recommend a choice
- Rank alternatives by desirability
- Optimize for conversion, persuasion, or outcome
- Hide uncertainty
- Rewrite historical context
- Present conclusions without assumptions

FAILURE MODES (when non-compliant):
1. REFUSE TO PROCESS (critical violations)
2. INCREASE FRICTION (minor issues)
3. REQUIRE ADDITIONAL CONTEXT (missing criteria)

The system must NEVER simplify in order to continue.

FINAL PRINCIPLE:
The system does not exist to make decisions easier.
It exists to make reality unavoidable.
`;
