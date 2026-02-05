/**
 * DS-1 DECISION STANDARD
 * 
 * Open, short standard — not a framework.
 * What must be VISIBLE, not how to decide.
 */

import type { DecisionPreparationDocument, PostDecisionLock } from '../types';
import type { WorkflowState } from '../workflow/types';
import type { DS1Standard, DS1ComplianceResult } from './types';

/**
 * The DS-1 Standard Definition
 */
export const DS1_STANDARD: DS1Standard = {
  version: '1.0',
  requirements: {
    context_before_decision: true,
    alternatives_identified: true,
    uncertainties_explicit: true,
    context_locked_at_decision: true,
    follow_up_scheduled: true,
  },
};

/**
 * Check DS-1 compliance
 * Binary: compliant or not. No grades. No partial credit.
 */
export function checkDS1Compliance(
  dpd: DecisionPreparationDocument | null,
  workflow: WorkflowState | null,
  lock: PostDecisionLock | null
): DS1ComplianceResult {
  const checks = {
    has_dpd: false,
    has_agenda: false,
    has_alternatives: false,
    has_uncertainties: false,
    context_locked: false,
    has_pdrc_scheduled: false,
  };
  
  const missing: string[] = [];
  
  // Check 1: Has DPD (context before decision)
  if (dpd) {
    checks.has_dpd = true;
  } else {
    missing.push('Decision Preparation Document');
  }
  
  // Check 2: Has agenda
  if (workflow?.agenda) {
    checks.has_agenda = true;
  } else {
    missing.push('Board Agenda');
  }
  
  // Check 3: Alternatives identified
  if (dpd && dpd.alternatives.length >= 2) {
    checks.has_alternatives = true;
  } else {
    missing.push('Alternatives (minimum 2)');
  }
  
  // Check 4: Uncertainties explicit
  if (dpd && (dpd.knowledge_status.uncertain.length > 0 || dpd.knowledge_status.unknown.length > 0)) {
    checks.has_uncertainties = true;
  } else {
    missing.push('Explicit uncertainties');
  }
  
  // Check 5: Context locked
  if (lock && lock.immutable) {
    checks.context_locked = true;
  } else {
    missing.push('Locked decision context');
  }
  
  // Check 6: PDRC scheduled (lock exists = PDRC should be scheduled)
  if (lock && lock.context_snapshot_id) {
    checks.has_pdrc_scheduled = true;
  } else {
    missing.push('Post-Decision Reality Check scheduled');
  }
  
  // Binary compliance
  const compliant = Object.values(checks).every(v => v === true);
  
  return {
    decision_id: dpd?.dpd_id || 'unknown',
    compliant,
    checks,
    missing,
    checked_at: new Date().toISOString(),
  };
}

/**
 * Generate compliance statement
 * For organizations to declare: "We follow DS-1"
 */
export function generateComplianceStatement(
  organizationName: string,
  complianceRate: number
): string {
  if (complianceRate >= 0.95) {
    return `${organizationName} follows DS-1 decision standard.`;
  } else if (complianceRate >= 0.80) {
    return `${organizationName} follows DS-1 decision standard with documented deviations.`;
  } else {
    return `${organizationName} is adopting DS-1 decision standard.`;
  }
}

/**
 * DS-1 STANDARD MASTERPROMPT
 */
export const DS1_STANDARD_MASTERPROMPT = `
You verify DS-1 Decision Standard compliance.

DS-1 REQUIRES (what must be VISIBLE):
1. Context before decision
2. Alternatives identified
3. Uncertainties explicit
4. Context locked at decision
5. Follow-up scheduled

DS-1 DOES NOT REQUIRE:
- How to decide
- What to decide
- How long to deliberate
- Who should attend

COMPLIANCE:
Binary: yes or no.
No stamps. No licenses. No partial credit.

ORGANIZATIONS CAN SAY:
"We follow DS-1 decision standard."

YOU VERIFY:
- Does DPD exist?
- Does agenda exist?
- Is context locked?
- Is PDRC scheduled?

If all yes → compliant.
If any no → not compliant.

This is not certification.
This is visibility.
`;
