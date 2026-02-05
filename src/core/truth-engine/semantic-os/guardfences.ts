/**
 * SEMANTIC GUARDFENCES
 * 
 * Automatic misinterpretation protection.
 * These are architectural, not policy — they cannot be overridden.
 * 
 * Four locks:
 * 1. Causality Lock — correlation ≠ causation
 * 2. Individual Inference Lock — population ≠ individual
 * 3. Action Lock — no "should", "must", "optimal"
 * 4. Value Neutrality Lock — no ranking without explicit weights
 */

/**
 * GUARDFENCE TYPES
 */
export type GuardfenceType = 
  | 'causality'
  | 'individual_inference'
  | 'action'
  | 'value_neutrality';

/**
 * GUARDFENCE VIOLATION
 */
export interface GuardfenceViolation {
  readonly fence: GuardfenceType;
  readonly pattern_matched: string;
  readonly original_text: string;
  readonly severity: 'block' | 'warn' | 'flag';
  readonly suggested_rewrite?: string;
}

/**
 * GUARDFENCE RULES (LOCKED)
 */
export const GUARDFENCE_RULES = {
  causality: {
    id: 'causality',
    name: 'Causality Lock',
    principle: 'Correlation can never be shown as causation without explicit marking',
    forbidden_patterns: [
      /\bcauses?\b/i,
      /\bresults? in\b/i,
      /\bleads? to\b/i,
      /\bdue to\b/i,
      /\bbecause of\b/i,
      /\bas a result of\b/i,
      /\bconsequently\b/i,
      /\btherefore\b/i,
    ],
    allowed_patterns: [
      /\bcorrelates? with\b/i,
      /\bassociated with\b/i,
      /\bco-occurs? with\b/i,
      /\bobserved together\b/i,
      /\bmoves? together\b/i,
    ],
    rewrite_template: 'Replace "{forbidden}" with "is associated with" or "correlates with"',
  },
  
  individual_inference: {
    id: 'individual_inference',
    name: 'Individual Inference Lock',
    principle: 'No population data can be translated to individual prediction',
    forbidden_patterns: [
      /\byou will\b/i,
      /\byou are\b/i,
      /\byour risk\b/i,
      /\bfor you\b/i,
      /\bin your case\b/i,
      /\bpersonally\b/i,
      /\bindividually\b/i,
    ],
    required_disclaimers: [
      'This is population-level data',
      'Individual outcomes vary',
      'Does not predict personal outcomes',
    ],
  },
  
  action: {
    id: 'action',
    name: 'Action Lock',
    principle: 'No verbs suggesting action or recommendation',
    forbidden_patterns: [
      /\bshould\b/i,
      /\bmust\b/i,
      /\boptimal\b/i,
      /\bbest\b/i,
      /\bworst\b/i,
      /\brecommend/i,
      /\badvise/i,
      /\bsuggest(?:s|ed|ing)?\b/i,
      /\bneed to\b/i,
      /\bhave to\b/i,
      /\bought to\b/i,
    ],
    allowed_alternatives: [
      'is associated with',
      'has been observed to',
      'data shows',
      'patterns indicate',
      'historically',
    ],
  },
  
  value_neutrality: {
    id: 'value_neutrality',
    name: 'Value Neutrality Lock',
    principle: 'No ranking without user-defined weighting',
    forbidden_patterns: [
      /\bmost important\b/i,
      /\bleast important\b/i,
      /\bbetter than\b/i,
      /\bworse than\b/i,
      /\bsuperior\b/i,
      /\binferior\b/i,
      /\bthe best\b/i,
      /\bthe worst\b/i,
    ],
    required_context: [
      'Rankings require explicit weighting',
      'Importance is context-dependent',
      'No universal value hierarchy assumed',
    ],
  },
} as const;

/**
 * CHECK GUARDFENCES
 */
export function checkGuardfences(text: string): {
  passed: boolean;
  violations: GuardfenceViolation[];
} {
  const violations: GuardfenceViolation[] = [];

  for (const [fenceType, fence] of Object.entries(GUARDFENCE_RULES)) {
    for (const pattern of fence.forbidden_patterns) {
      const match = text.match(pattern);
      if (match) {
        violations.push({
          fence: fenceType as GuardfenceType,
          pattern_matched: match[0],
          original_text: text.substring(
            Math.max(0, match.index! - 20),
            Math.min(text.length, match.index! + match[0].length + 20)
          ),
          severity: fenceType === 'action' ? 'block' : 'warn',
          suggested_rewrite: 'rewrite_template' in fence 
            ? fence.rewrite_template.replace('{forbidden}', match[0])
            : undefined,
        });
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * APPLY GUARDFENCES (REWRITE IF POSSIBLE)
 */
export function applyGuardfences(text: string): {
  result: string;
  modifications: string[];
  blocked: boolean;
} {
  const modifications: string[] = [];
  let result = text;
  let blocked = false;

  // Causality rewrites
  const causalityRewrites: [RegExp, string][] = [
    [/\bcauses\b/gi, 'is associated with'],
    [/\bcause\b/gi, 'correlate with'],
    [/\bresults in\b/gi, 'is associated with'],
    [/\bleads to\b/gi, 'correlates with'],
    [/\bdue to\b/gi, 'associated with'],
  ];

  for (const [pattern, replacement] of causalityRewrites) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      modifications.push(`Replaced causal language with "${replacement}"`);
    }
  }

  // Action patterns - these block, not rewrite
  const actionPatterns = GUARDFENCE_RULES.action.forbidden_patterns;
  for (const pattern of actionPatterns) {
    if (pattern.test(result)) {
      blocked = true;
      modifications.push(`Blocked: contains forbidden action pattern "${pattern.source}"`);
    }
  }

  return { result, modifications, blocked };
}

/**
 * GUARDFENCE REPORT
 */
export interface GuardfenceReport {
  readonly text_length: number;
  readonly checked_at: string;
  readonly passed: boolean;
  readonly violation_count: number;
  readonly violations_by_type: Record<GuardfenceType, number>;
  readonly details: readonly GuardfenceViolation[];
}

/**
 * GENERATE GUARDFENCE REPORT
 */
export function generateGuardfenceReport(text: string): GuardfenceReport {
  const check = checkGuardfences(text);
  
  const byType: Record<GuardfenceType, number> = {
    causality: 0,
    individual_inference: 0,
    action: 0,
    value_neutrality: 0,
  };
  
  for (const v of check.violations) {
    byType[v.fence]++;
  }

  return {
    text_length: text.length,
    checked_at: new Date().toISOString(),
    passed: check.passed,
    violation_count: check.violations.length,
    violations_by_type: byType,
    details: check.violations,
  };
}
