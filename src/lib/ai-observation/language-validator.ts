/**
 * LANGUAGE VALIDATOR
 * 
 * Ensures AI output strictly adheres to neutral observation language.
 * Blocks any causal, normative, or value-laden phrases.
 */

import { FORBIDDEN_PHRASES, ALLOWED_OBSERVATION_PHRASES } from '@/types/ai-observation';

export interface ValidationResult {
  is_valid: boolean;
  violations: string[];
  sanitized_text: string;
  warning_count: number;
}

// Extended forbidden patterns with regex support
const FORBIDDEN_PATTERNS: RegExp[] = [
  // Causal language
  /\bcaused?\s+by\b/gi,
  /\bled\s+to\b/gi,
  /\bresulted?\s+in\b/gi,
  /\bbecause\s+of?\b/gi,
  /\btherefore\b/gi,
  /\bconsequently\b/gi,
  /\bthus\b/gi,
  /\bhence\b/gi,
  /\bdue\s+to\b/gi,
  /\bas\s+a\s+result\b/gi,
  
  // Normative language
  /\bshould\b/gi,
  /\bought\s+to\b/gi,
  /\bmust\b/gi,
  /\bneed\s+to\b/gi,
  /\bbetter\b/gi,
  /\bworse\b/gi,
  /\bgood\b/gi,
  /\bbad\b/gi,
  
  // Attribution language
  /\bfavou?red\b/gi,
  /\bbenefited?\b/gi,
  /\bharmed?\b/gi,
  /\bdamaged?\b/gi,
  /\bexploited?\b/gi,
  /\btook\s+advantage\b/gi,
  
  // Certainty language
  /\bproves?\b/gi,
  /\bdemonstrates?\b/gi,
  /\bshows?\s+that\b/gi,
  /\bobviously\b/gi,
  /\bclearly\b/gi,
  /\bcertainly\b/gi,
  /\bundoubtedly\b/gi,
  /\bdefinitely\b/gi,
  
  // Improvement/deterioration (hidden value judgments)
  /\bimprov(ed?|ing|ement)\b/gi,
  /\bdeteriorat(ed?|ing|ion)\b/gi,
  /\bworsen(ed?|ing)?\b/gi,
  /\bprogress(ed?|ing)?\b/gi,
  /\bdeclin(ed?|ing|e)\b/gi,  // Note: "decline" is borderline, context-dependent
  
  // Intent attribution
  /\bintentional(ly)?\b/gi,
  /\bdeliberate(ly)?\b/gi,
  /\bpurposeful(ly)?\b/gi,
  /\baimed?\s+(at|to)\b/gi,
  /\bdesigned?\s+to\b/gi
];

// Neutral replacement suggestions
const REPLACEMENT_SUGGESTIONS: Record<string, string> = {
  'caused by': 'occurred during the same period as',
  'led to': 'preceded',
  'resulted in': 'was followed by',
  'because': 'during the period when',
  'therefore': '[remove - no causal claims allowed]',
  'better': 'higher/lower [specify direction]',
  'worse': 'higher/lower [specify direction]',
  'improved': 'increased/decreased [specify]',
  'deteriorated': 'changed [specify direction]',
  'proves': 'is consistent with',
  'demonstrates': 'exhibits',
  'shows that': 'indicates co-occurrence with',
  'clearly': '[remove - avoid certainty language]',
  'obviously': '[remove - avoid certainty language]'
};

/**
 * Validates text against the strict neutrality requirements
 */
export function validateObservationLanguage(text: string): ValidationResult {
  const violations: string[] = [];
  let sanitizedText = text;
  
  // Check against forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        violations.push(`Forbidden phrase: "${match}"`);
        
        // Attempt to suggest replacement
        const lowerMatch = match.toLowerCase();
        const suggestion = Object.entries(REPLACEMENT_SUGGESTIONS).find(
          ([key]) => lowerMatch.includes(key)
        );
        
        if (suggestion) {
          sanitizedText = sanitizedText.replace(
            new RegExp(match, 'gi'),
            `[BLOCKED: ${suggestion[1]}]`
          );
        } else {
          sanitizedText = sanitizedText.replace(
            new RegExp(match, 'gi'),
            '[BLOCKED]'
          );
        }
      }
    }
  }
  
  // Check for simple forbidden words
  for (const phrase of FORBIDDEN_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    if (regex.test(text)) {
      violations.push(`Forbidden word: "${phrase}"`);
    }
  }
  
  return {
    is_valid: violations.length === 0,
    violations,
    sanitized_text: sanitizedText,
    warning_count: violations.length
  };
}

/**
 * Generates a neutral observation statement from a template
 */
export function generateNeutralStatement(
  template_type: keyof typeof ALLOWED_OBSERVATION_PHRASES,
  variables: Record<string, string>
): string {
  const templates = ALLOWED_OBSERVATION_PHRASES[template_type];
  
  // Select appropriate template based on available variables
  const selectedTemplate = templates[0] as string;
  
  // Replace variables in template
  let result = selectedTemplate;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(`{${key}}`, value);
  }
  
  // Validate the result
  const validation = validateObservationLanguage(result);
  if (!validation.is_valid) {
    console.error('Generated statement failed validation:', validation.violations);
    return validation.sanitized_text;
  }
  
  return result;
}

/**
 * Enforces the mandatory disclaimer on all outputs
 */
export function appendMandatoryDisclaimer(text: string): string {
  const disclaimer = "\n\n---\n**Observed patterns do not imply causation or intent.**";
  
  if (!text.includes("do not imply causation")) {
    return text + disclaimer;
  }
  
  return text;
}

/**
 * Validates that the output contains required context elements
 */
export function validateCompleteness(observation: {
  what: string;
  when: string;
  where: string;
  alternatives_shown: boolean;
  limits_shown: boolean;
}): { is_complete: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!observation.what || observation.what.trim() === '') {
    missing.push('observation description');
  }
  if (!observation.when || observation.when.trim() === '') {
    missing.push('time period');
  }
  if (!observation.where || observation.where.trim() === '') {
    missing.push('geographic scope');
  }
  if (!observation.alternatives_shown) {
    missing.push('alternative patterns (what else moved)');
  }
  if (!observation.limits_shown) {
    missing.push('limitations and caveats');
  }
  
  return {
    is_complete: missing.length === 0,
    missing
  };
}
