/**
 * COMPRESSED DPD (C-DPD)
 * 
 * In crisis, still required:
 * - Context
 * - Alternatives
 * - Uncertainties
 * 
 * But in MINIMAL form.
 */

import type { CompressedDPD, CrisisContextSnapshot } from './types';

/**
 * Minimum requirements for C-DPD
 */
const CDPD_REQUIREMENTS = {
  min_alternatives: 2,
  min_unknowns: 1,
  max_decision_statement_chars: 200,
  max_risk_items: 5,
  require_time_constraint: true,
};

/**
 * Create Compressed DPD
 */
export function createCompressedDPD(
  cdpdId: string,
  crisis: CrisisContextSnapshot,
  decisionStatement: string,
  alternatives: CompressedDPD['alternatives'],
  knownRisks: string[],
  unknowns: string[],
  timeConstraint: CompressedDPD['time_constraint'],
  preparedBy: string,
  preparationTimeMinutes: number
): { success: boolean; cdpd?: CompressedDPD; errors?: string[] } {
  const errors: string[] = [];
  
  // Validate minimum alternatives
  if (alternatives.length < CDPD_REQUIREMENTS.min_alternatives) {
    errors.push(`Minimum ${CDPD_REQUIREMENTS.min_alternatives} alternatives required, even in crisis`);
  }
  
  // Validate minimum unknowns (intellectual honesty)
  if (unknowns.length < CDPD_REQUIREMENTS.min_unknowns) {
    errors.push(`Minimum ${CDPD_REQUIREMENTS.min_unknowns} unknown(s) must be acknowledged`);
  }
  
  // Validate decision statement length
  if (decisionStatement.length > CDPD_REQUIREMENTS.max_decision_statement_chars) {
    errors.push(`Decision statement must be under ${CDPD_REQUIREMENTS.max_decision_statement_chars} characters`);
  }
  
  // Validate time constraint
  if (!timeConstraint.decision_deadline || !timeConstraint.urgency_reason) {
    errors.push('Time constraint with deadline and urgency reason required');
  }
  
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const cdpd: CompressedDPD = {
    cdpd_id: cdpdId,
    crisis_id: crisis.crisis_id,
    created_at: new Date().toISOString(),
    decision_statement: decisionStatement,
    alternatives,
    known_risks: knownRisks.slice(0, CDPD_REQUIREMENTS.max_risk_items),
    unknowns,
    time_constraint: timeConstraint,
    prepared_by: preparedBy,
    preparation_time_minutes: preparationTimeMinutes,
  };
  
  return { success: true, cdpd };
}

/**
 * Validate C-DPD completeness
 */
export function validateCompressedDPD(cdpd: CompressedDPD): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!cdpd.decision_statement) {
    missing.push('Decision statement');
  }
  
  if (cdpd.alternatives.length < CDPD_REQUIREMENTS.min_alternatives) {
    missing.push(`Alternatives (minimum ${CDPD_REQUIREMENTS.min_alternatives})`);
  }
  
  if (cdpd.unknowns.length < CDPD_REQUIREMENTS.min_unknowns) {
    missing.push(`Unknowns (minimum ${CDPD_REQUIREMENTS.min_unknowns})`);
  }
  
  if (!cdpd.time_constraint?.decision_deadline) {
    missing.push('Time constraint deadline');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Expand C-DPD to full DPD (for post-crisis documentation)
 */
export function prepareForFullDocumentation(cdpd: CompressedDPD): {
  requires_expansion: string[];
  can_proceed: boolean;
} {
  const requiresExpansion: string[] = [];
  
  // Check what needs expansion for full DPD
  if (cdpd.alternatives.length < 3) {
    requiresExpansion.push('Consider additional alternatives for complete record');
  }
  
  if (cdpd.known_risks.length < 2) {
    requiresExpansion.push('Document additional known risks');
  }
  
  if (cdpd.preparation_time_minutes < 30) {
    requiresExpansion.push('Note: Compressed preparation time');
  }
  
  return {
    requires_expansion: requiresExpansion,
    can_proceed: true, // C-DPD is valid, expansion is optional
  };
}

/**
 * COMPRESSED DPD MASTERPROMPT
 */
export const COMPRESSED_DPD_MASTERPROMPT = `
You create Compressed Decision Preparation Documents.

C-DPD IS NOT A SHORTCUT:
It's the MINIMUM viable documentation.
Still requires intellectual honesty.

ALWAYS REQUIRED:
1. Decision statement (max 200 chars)
2. Minimum 2 alternatives
3. Known risks (up to 5)
4. Minimum 1 unknown (honesty about uncertainty)
5. Time constraint with deadline and reason

WHY MINIMUM 2 ALTERNATIVES:
Even in crisis, binary thinking is dangerous.
"Do X or don't do X" is not decision-making.

WHY MINIMUM 1 UNKNOWN:
There is ALWAYS uncertainty in crisis.
Claiming otherwise is dishonest.
Dishonesty in crisis compounds harm.

PREPARATION TIME:
Recorded for learning.
Not for judgment.
15 minutes of structured thought > 2 hours of chaos.

AFTER CRISIS:
C-DPD can be expanded to full DPD.
But C-DPD alone is sufficient for accountability.
`;
