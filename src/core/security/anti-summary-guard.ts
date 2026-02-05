/**
 * ANTI-SUMMARY GUARD
 * 
 * Automatic tests + runtime checks that block:
 * - "In conclusion..."
 * - "Best option is..."
 * - "Recommended choice..."
 * - "Top-ranked..."
 * 
 * Applied in:
 * - API response
 * - Public view
 * - AI output
 */

import type { ForbiddenPhrase } from './types';

// ============================================================================
// FORBIDDEN PHRASES
// ============================================================================

export const FORBIDDEN_PHRASES: readonly ForbiddenPhrase[] = [
  // Conclusions
  {
    pattern: 'In conclusion',
    regex: /in\s+conclusion/i,
    category: 'conclusion',
    severity: 'block',
  },
  {
    pattern: 'To conclude',
    regex: /to\s+conclude/i,
    category: 'conclusion',
    severity: 'block',
  },
  {
    pattern: 'In summary',
    regex: /in\s+summary/i,
    category: 'conclusion',
    severity: 'block',
  },
  {
    pattern: 'To summarize',
    regex: /to\s+summar(ize|ise)/i,
    category: 'conclusion',
    severity: 'block',
  },
  {
    pattern: 'The bottom line',
    regex: /the\s+bottom\s+line/i,
    category: 'conclusion',
    severity: 'block',
  },
  
  // Recommendations
  {
    pattern: 'Best option is',
    regex: /best\s+(option|choice|alternative)\s+(is|would\s+be)/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'Recommended choice',
    regex: /recommend(ed)?\s+(choice|option|decision)/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'You should choose',
    regex: /you\s+should\s+(choose|pick|select|go\s+with)/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'We recommend',
    regex: /we\s+recommend/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'Our recommendation',
    regex: /our\s+recommendation/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'The optimal choice',
    regex: /the\s+optimal\s+(choice|option|path|decision)/i,
    category: 'recommendation',
    severity: 'block',
  },
  {
    pattern: 'The preferred option',
    regex: /the\s+preferred\s+(option|choice|alternative)/i,
    category: 'recommendation',
    severity: 'block',
  },
  
  // Rankings
  {
    pattern: 'Top-ranked',
    regex: /top[-\s]ranked/i,
    category: 'ranking',
    severity: 'block',
  },
  {
    pattern: 'Number one choice',
    regex: /number\s+(one|1)\s+(choice|option)/i,
    category: 'ranking',
    severity: 'block',
  },
  {
    pattern: 'Best performing',
    regex: /best\s+performing/i,
    category: 'ranking',
    severity: 'block',
  },
  {
    pattern: 'Highest rated',
    regex: /highest\s+rated/i,
    category: 'ranking',
    severity: 'block',
  },
  {
    pattern: 'Winner is',
    regex: /(the\s+)?winner\s+is/i,
    category: 'ranking',
    severity: 'block',
  },
  {
    pattern: 'Clear winner',
    regex: /clear\s+winner/i,
    category: 'ranking',
    severity: 'block',
  },
] as const;

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

export interface SummaryGuardResult {
  passed: boolean;
  violations: {
    phrase: string;
    category: string;
    position: number;
    severity: 'block' | 'warn';
  }[];
}

export function checkForForbiddenPhrases(text: string): SummaryGuardResult {
  const violations: SummaryGuardResult['violations'] = [];
  
  for (const forbidden of FORBIDDEN_PHRASES) {
    const match = forbidden.regex.exec(text);
    if (match) {
      violations.push({
        phrase: forbidden.pattern,
        category: forbidden.category,
        position: match.index,
        severity: forbidden.severity,
      });
    }
  }
  
  return {
    passed: violations.filter(v => v.severity === 'block').length === 0,
    violations,
  };
}

// ============================================================================
// API RESPONSE GUARD
// ============================================================================

export function guardAPIResponse<T extends Record<string, unknown>>(
  response: T
): { allowed: boolean; blocked_fields: string[]; sanitized: T } {
  const blockedFields: string[] = [];
  const sanitized = { ...response };
  
  function scanObject(obj: Record<string, unknown>, path = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        const result = checkForForbiddenPhrases(value);
        if (!result.passed) {
          blockedFields.push(fullPath);
          // Remove the field or replace with error
          (obj as any)[key] = '[BLOCKED: Forbidden phrase detected]';
        }
      } else if (typeof value === 'object' && value !== null) {
        scanObject(value as Record<string, unknown>, fullPath);
      }
    }
  }
  
  scanObject(sanitized);
  
  return {
    allowed: blockedFields.length === 0,
    blocked_fields: blockedFields,
    sanitized,
  };
}

// ============================================================================
// RUNTIME CHECKS
// ============================================================================

export const ANTI_SUMMARY_CONFIG = {
  enabled: true,
  check_api_responses: true,
  check_public_views: true,
  check_ai_output: true,
  block_on_violation: true,
  log_violations: true,
} as const;
