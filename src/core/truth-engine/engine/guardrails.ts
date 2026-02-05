/**
 * GUARDRAILS — ONLY NO
 * 
 * Guardrails are BLOCKING, never advisory.
 * If violated, the output is rejected entirely.
 */

import { SemanticOutput } from '../contracts/semantic-output';

/**
 * GUARDRAIL VIOLATION
 */
export interface GuardrailViolation {
  readonly type: GuardrailType;
  readonly message: string;
  readonly severity: 'blocking' | 'warning';
  readonly location?: string;
}

export type GuardrailType =
  | 'action_language'
  | 'recommendation'
  | 'individual_inference'
  | 'causal_claim'
  | 'value_judgment'
  | 'prediction'
  | 'domain_violation';

/**
 * FORBIDDEN PATTERNS — Action language
 */
const ACTION_PATTERNS = [
  /you should/i,
  /you must/i,
  /you need to/i,
  /we recommend/i,
  /it is best to/i,
  /the best approach/i,
  /optimal(ly)?/i,
  /ideally/i,
];

/**
 * FORBIDDEN PATTERNS — Recommendations
 */
const RECOMMENDATION_PATTERNS = [
  /i recommend/i,
  /i suggest/i,
  /consider\s+(doing|using|trying)/i,
  /you might want to/i,
  /it would be wise to/i,
  /the solution is/i,
];

/**
 * FORBIDDEN PATTERNS — Individual inference
 */
const INDIVIDUAL_PATTERNS = [
  /in your case/i,
  /for you specifically/i,
  /you personally/i,
  /your individual/i,
  /your specific situation/i,
];

/**
 * FORBIDDEN PATTERNS — Causal claims (without evidence marker)
 */
const CAUSAL_PATTERNS = [
  /causes?\s+/i,
  /because\s+of/i,
  /due\s+to/i,
  /leads?\s+to/i,
  /results?\s+in/i,
  /as\s+a\s+result/i,
];

/**
 * FORBIDDEN PATTERNS — Value judgments
 */
const VALUE_PATTERNS = [
  /\bgood\b/i,
  /\bbad\b/i,
  /\bbest\b/i,
  /\bworst\b/i,
  /success(ful)?/i,
  /failure/i,
  /crisis/i,
  /disaster/i,
  /excellent/i,
  /terrible/i,
];

/**
 * FORBIDDEN PATTERNS — Predictions
 */
const PREDICTION_PATTERNS = [
  /will\s+(definitely|certainly|surely)/i,
  /is\s+going\s+to\s+happen/i,
  /will\s+cause/i,
  /expect\s+to\s+see/i,
  /predict(s|ed|ing)?/i,
  /forecast(s|ed|ing)?/i,
];

/**
 * ENFORCE GUARDRAILS — Main function
 * Throws on violation.
 */
export function enforceGuardrails(output: SemanticOutput): void {
  const violations = checkGuardrails(output);
  
  const blockingViolations = violations.filter(v => v.severity === 'blocking');
  
  if (blockingViolations.length > 0) {
    throw new GuardrailError(blockingViolations);
  }
}

/**
 * CHECK GUARDRAILS — Returns all violations
 */
export function checkGuardrails(output: SemanticOutput): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  
  // Combine all text content for checking
  const allText = extractAllText(output);
  
  // Check action language
  for (const pattern of ACTION_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'action_language',
        message: `Action language detected: ${pattern.source}`,
        severity: 'blocking',
      });
    }
  }
  
  // Check recommendations
  for (const pattern of RECOMMENDATION_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'recommendation',
        message: `Recommendation detected: ${pattern.source}`,
        severity: 'blocking',
      });
    }
  }
  
  // Check individual inference
  for (const pattern of INDIVIDUAL_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'individual_inference',
        message: `Individual inference detected: ${pattern.source}`,
        severity: 'blocking',
      });
    }
  }
  
  // Check causal claims (warning only - need context)
  for (const pattern of CAUSAL_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'causal_claim',
        message: `Potential causal claim: ${pattern.source}`,
        severity: 'warning',
      });
    }
  }
  
  // Check value judgments
  for (const pattern of VALUE_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'value_judgment',
        message: `Value judgment detected: ${pattern.source}`,
        severity: 'blocking',
      });
    }
  }
  
  // Check predictions
  for (const pattern of PREDICTION_PATTERNS) {
    if (pattern.test(allText)) {
      violations.push({
        type: 'prediction',
        message: `Prediction detected: ${pattern.source}`,
        severity: 'blocking',
      });
    }
  }
  
  return violations;
}

/**
 * EXTRACT ALL TEXT — From output for checking
 */
function extractAllText(output: SemanticOutput): string {
  const parts: string[] = [
    output.orientation.baseline,
    output.orientation.deviation,
    ...output.importance.rationale,
    ...output.why_it_matters,
    ...output.what_it_does_not_mean,
    ...output.uncertainty.data_gaps,
    ...output.uncertainty.methodology_notes,
    ...output.next_valid_questions,
  ];
  
  return parts.join(' ');
}

/**
 * GUARDRAIL ERROR
 */
export class GuardrailError extends Error {
  public readonly violations: readonly GuardrailViolation[];
  
  constructor(violations: GuardrailViolation[]) {
    super(`Guardrail violations: ${violations.map(v => v.type).join(', ')}`);
    this.name = 'GuardrailError';
    this.violations = violations;
  }
}

/**
 * DOMAIN-SPECIFIC RULES
 */
export function checkDomainCompliance(
  output: SemanticOutput,
  domain: string
): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  
  if (domain === 'healthcare') {
    violations.push(...checkHealthcareDomain(output));
  }
  
  if (domain === 'economy') {
    violations.push(...checkEconomyDomain(output));
  }
  
  return violations;
}

function checkHealthcareDomain(output: SemanticOutput): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  const allText = extractAllText(output);
  
  // No diagnosis
  if (/diagnos(e|is|ed)/i.test(allText)) {
    violations.push({
      type: 'domain_violation',
      message: 'Healthcare domain: No diagnostic language',
      severity: 'blocking',
    });
  }
  
  // No prescription
  if (/prescri(be|ption)/i.test(allText)) {
    violations.push({
      type: 'domain_violation',
      message: 'Healthcare domain: No prescription language',
      severity: 'blocking',
    });
  }
  
  return violations;
}

function checkEconomyDomain(output: SemanticOutput): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  const allText = extractAllText(output);
  
  // No investment advice
  if (/invest(ment)?|buy|sell|trade/i.test(allText)) {
    if (/should|recommend|suggest/i.test(allText)) {
      violations.push({
        type: 'domain_violation',
        message: 'Economy domain: No investment advice',
        severity: 'blocking',
      });
    }
  }
  
  return violations;
}
