/**
 * CI/CD GUARDRAILS
 * 
 * Automated tests that:
 * - Ensure >= 2 alternatives
 * - Ensure >= 1 uncertainty
 * - Block forbidden fields
 * - Diff ontology changes
 * 
 * Deploy may NEVER bypass legitimacy rules.
 */

import type { Decision, Alternative, Uncertainty } from '../../ontology/types';
import { FORBIDDEN_CONCEPTS, detectForbiddenConcepts } from '../../ontology/forbidden';
import { checkLegitimacy, computeLegitimacyStatus } from '../../ontology/legitimacy-engine';

// ═══════════════════════════════════════════════════════════════════
//                         GUARDRAIL RESULTS
// ═══════════════════════════════════════════════════════════════════

export interface GuardrailResult {
  passed: boolean;
  guardrail: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface GuardrailReport {
  passed: boolean;
  timestamp: string;
  results: GuardrailResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         GUARDRAILS
// ═══════════════════════════════════════════════════════════════════

/**
 * Check minimum alternatives requirement
 */
export function checkMinimumAlternatives(
  alternatives: Alternative[]
): GuardrailResult {
  const passed = alternatives.length >= 2;
  return {
    passed,
    guardrail: 'MINIMUM_ALTERNATIVES',
    message: passed 
      ? `✓ ${alternatives.length} alternatives (>= 2 required)` 
      : `✗ Only ${alternatives.length} alternative(s) (>= 2 required)`,
    severity: 'error',
  };
}

/**
 * Check minimum uncertainties requirement
 */
export function checkMinimumUncertainties(
  uncertainties: Uncertainty[]
): GuardrailResult {
  const passed = uncertainties.length >= 1;
  return {
    passed,
    guardrail: 'MINIMUM_UNCERTAINTIES',
    message: passed 
      ? `✓ ${uncertainties.length} uncertainty/ies (>= 1 required)` 
      : `✗ No uncertainties declared (>= 1 required)`,
    severity: 'error',
  };
}

/**
 * Check for forbidden concepts in text content
 */
export function checkForbiddenConcepts(
  content: Record<string, unknown>
): GuardrailResult {
  const textContent = JSON.stringify(content);
  const detected = detectForbiddenConcepts(textContent);
  const passed = detected.length === 0;
  
  return {
    passed,
    guardrail: 'FORBIDDEN_CONCEPTS',
    message: passed 
      ? '✓ No forbidden concepts detected' 
      : `✗ Forbidden concepts found: ${detected.join(', ')}`,
    severity: 'error',
  };
}

/**
 * Check for forbidden field names
 */
export function checkForbiddenFields(
  fieldNames: string[]
): GuardrailResult {
  const forbidden = [
    'recommendation',
    'ranking',
    'score',
    'best',
    'optimal',
    'suggested',
  ];
  
  const found = fieldNames.filter(f => 
    forbidden.some(b => f.toLowerCase().includes(b))
  );
  
  const passed = found.length === 0;
  
  return {
    passed,
    guardrail: 'FORBIDDEN_FIELDS',
    message: passed 
      ? '✓ No forbidden field names' 
      : `✗ Forbidden fields found: ${found.join(', ')}`,
    severity: 'error',
  };
}

/**
 * Check legitimacy status
 */
export function checkLegitimacyGuardrail(
  decision: Decision,
  context: unknown | null
): GuardrailResult {
  const check = checkLegitimacy(decision, context as any);
  const status = computeLegitimacyStatus(check);
  const passed = status === 'legitimate';
  
  return {
    passed,
    guardrail: 'LEGITIMACY_CHECK',
    message: passed 
      ? '✓ Decision meets all legitimacy requirements' 
      : `✗ Legitimacy status: ${status}`,
    severity: 'error',
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         FULL GUARDRAIL RUN
// ═══════════════════════════════════════════════════════════════════

/**
 * Run all guardrails on a decision
 */
export function runGuardrails(
  decision: Decision,
  context: unknown | null
): GuardrailReport {
  const results: GuardrailResult[] = [];
  
  // Run all checks
  results.push(checkMinimumAlternatives(decision.alternatives));
  results.push(checkMinimumUncertainties(decision.uncertainties));
  results.push(checkForbiddenConcepts({ decision }));
  results.push(checkForbiddenFields(Object.keys(decision)));
  results.push(checkLegitimacyGuardrail(decision, context));
  
  const passed = results.every(r => r.passed || r.severity === 'warning');
  const failed = results.filter(r => !r.passed && r.severity === 'error').length;
  const warnings = results.filter(r => !r.passed && r.severity === 'warning').length;
  
  return {
    passed,
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed,
      warnings,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         ONTOLOGY DIFF
// ═══════════════════════════════════════════════════════════════════

export interface OntologyDiff {
  added_fields: string[];
  removed_fields: string[];
  changed_fields: string[];
  is_breaking: boolean;
}

/**
 * Diff two ontology versions
 */
export function diffOntology(
  oldSchema: Record<string, unknown>,
  newSchema: Record<string, unknown>
): OntologyDiff {
  const oldFields = Object.keys(oldSchema);
  const newFields = Object.keys(newSchema);
  
  const added = newFields.filter(f => !oldFields.includes(f));
  const removed = oldFields.filter(f => !newFields.includes(f));
  const changed = oldFields.filter(f => 
    newFields.includes(f) && 
    JSON.stringify(oldSchema[f]) !== JSON.stringify(newSchema[f])
  );
  
  // Breaking = removed fields or changed field types
  const is_breaking = removed.length > 0 || changed.length > 0;
  
  return {
    added_fields: added,
    removed_fields: removed,
    changed_fields: changed,
    is_breaking,
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         MASTERPROMPT
// ═══════════════════════════════════════════════════════════════════

export const CI_CD_GUARDRAILS_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
                    CI/CD GUARDRAILS
═══════════════════════════════════════════════════════════════════

Automated tests that BLOCK deployment if violated:

  1. MINIMUM_ALTERNATIVES
     → Decision must have >= 2 alternatives
     → BLOCKS: deployment, lock, publish
     
  2. MINIMUM_UNCERTAINTIES
     → Decision must have >= 1 uncertainty
     → BLOCKS: deployment, lock, publish
     
  3. FORBIDDEN_CONCEPTS
     → No recommendations, rankings, scores
     → BLOCKS: any code that contains forbidden concepts
     
  4. FORBIDDEN_FIELDS
     → No fields named: recommendation, ranking, score, best, optimal
     → BLOCKS: schema changes, migrations
     
  5. LEGITIMACY_CHECK
     → Decision must pass all legitimacy requirements
     → BLOCKS: lock operation

ONTOLOGY CHANGES:

  Breaking changes (removed/changed fields) → REQUIRES:
    • Manual approval
    • Migration plan
    • Version bump to v2

Deploy may NEVER bypass legitimacy rules.

═══════════════════════════════════════════════════════════════════
`;
