/**
 * FACELESS LANGUAGE VALIDATOR
 * 
 * "Ansiktslöst språk" - All text must be observation-only.
 * No causal claims. No normative language. No predictions.
 * 
 * This protects from: political processes, lawsuits, regulation.
 */

// ============================================
// FORBIDDEN LANGUAGE PATTERNS
// ============================================

/**
 * Verbs that imply causation or recommendation
 */
const FORBIDDEN_VERBS = [
  // Causal
  'led to', 'caused', 'resulted in', 'drove', 'triggered',
  'produced', 'created', 'generated', 'induced', 'sparked',
  
  // Swedish causal
  'ledde till', 'orsakade', 'resulterade i', 'drev', 'utlöste',
  'skapade', 'genererade', 'framkallade',
  
  // Normative
  'should', 'must', 'ought', 'need to', 'have to',
  'bör', 'måste', 'borde', 'ska',
  
  // Predictive
  'will', 'is going to', 'is expected to', 'is likely to',
  'kommer att', 'förväntas', 'troligen',
];

/**
 * Phrases that imply judgment or opinion
 */
const FORBIDDEN_PHRASES = [
  // Value judgments
  'is good', 'is bad', 'is better', 'is worse', 'is best', 'is worst',
  'är bra', 'är dåligt', 'är bättre', 'är sämre', 'är bäst', 'är sämst',
  
  // Success/failure
  'succeeded', 'failed', 'worked', 'didn\'t work',
  'lyckades', 'misslyckades', 'fungerade', 'fungerade inte',
  
  // Recommendations
  'we recommend', 'we suggest', 'we advise', 'you should',
  'vi rekommenderar', 'vi föreslår', 'vi råder',
  
  // Predictions
  'will likely', 'is expected', 'we predict', 'forecast shows',
  'kommer troligen', 'förväntas', 'vi förutspår',
];

/**
 * Allowed observation verbs
 */
const ALLOWED_VERBS = [
  // Pure observation
  'is', 'was', 'are', 'were', 'has been', 'have been',
  'är', 'var', 'har varit',
  
  // Observable
  'can be observed', 'is observed', 'was observed',
  'kan observeras', 'observeras', 'observerades',
  
  // Descriptive
  'shows', 'indicates', 'displays', 'exhibits', 'demonstrates',
  'visar', 'indikerar', 'uppvisar', 'demonstrerar',
  
  // Measurement
  'measures', 'measured', 'records', 'recorded',
  'mäter', 'mättes', 'registrerar', 'registrerades',
  
  // Co-occurrence (NOT causation)
  'correlates with', 'co-occurs with', 'coincides with',
  'korrelerar med', 'sammanfaller med', 'uppträder samtidigt',
];

// ============================================
// LANGUAGE VIOLATION TYPES
// ============================================

export type ViolationType = 
  | 'causal_claim'
  | 'normative_statement'
  | 'prediction'
  | 'value_judgment'
  | 'recommendation'
  | 'opinion';

export interface LanguageViolation {
  type: ViolationType;
  pattern: string;
  match: string;
  position: number;
  severity: 'warning' | 'block';
  suggested_replacement?: string;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Check text for forbidden language patterns
 */
export function validateLanguage(text: string): {
  valid: boolean;
  violations: LanguageViolation[];
  sanitized?: string;
} {
  const violations: LanguageViolation[] = [];
  const lowerText = text.toLowerCase();
  
  // Check forbidden verbs
  for (const verb of FORBIDDEN_VERBS) {
    const pattern = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = text.matchAll(pattern);
    
    for (const match of matches) {
      const type = categorizeViolation(verb);
      violations.push({
        type,
        pattern: verb,
        match: match[0],
        position: match.index!,
        severity: type === 'causal_claim' || type === 'recommendation' ? 'block' : 'warning',
        suggested_replacement: getSuggestedReplacement(verb),
      });
    }
  }
  
  // Check forbidden phrases
  for (const phrase of FORBIDDEN_PHRASES) {
    const pattern = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.matchAll(pattern);
    
    for (const match of matches) {
      const type = categorizeViolation(phrase);
      violations.push({
        type,
        pattern: phrase,
        match: match[0],
        position: match.index!,
        severity: 'block',
        suggested_replacement: getSuggestedReplacement(phrase),
      });
    }
  }
  
  const blockingViolations = violations.filter(v => v.severity === 'block');
  
  return {
    valid: blockingViolations.length === 0,
    violations,
    sanitized: violations.length > 0 ? sanitizeText(text, violations) : undefined,
  };
}

/**
 * Categorize what type of violation this is
 */
function categorizeViolation(pattern: string): ViolationType {
  const p = pattern.toLowerCase();
  
  if (['led to', 'caused', 'resulted in', 'drove', 'ledde till', 'orsakade'].some(v => p.includes(v))) {
    return 'causal_claim';
  }
  if (['should', 'must', 'ought', 'bör', 'måste'].some(v => p.includes(v))) {
    return 'normative_statement';
  }
  if (['will', 'is going to', 'expected to', 'kommer att', 'förväntas'].some(v => p.includes(v))) {
    return 'prediction';
  }
  if (['good', 'bad', 'better', 'worse', 'bra', 'dålig'].some(v => p.includes(v))) {
    return 'value_judgment';
  }
  if (['recommend', 'suggest', 'advise', 'rekommenderar', 'föreslår'].some(v => p.includes(v))) {
    return 'recommendation';
  }
  
  return 'opinion';
}

/**
 * Get suggested neutral replacement
 */
function getSuggestedReplacement(pattern: string): string | undefined {
  const replacements: Record<string, string> = {
    // Causal → Co-occurrence
    'led to': 'coincided with',
    'caused': 'was observed alongside',
    'resulted in': 'was followed by',
    'ledde till': 'sammanföll med',
    'orsakade': 'observerades samtidigt som',
    
    // Normative → Neutral
    'should': 'could',
    'must': 'may',
    'bör': 'kan',
    'måste': 'kan',
    
    // Predictive → Observational
    'will likely': 'has historically',
    'is expected to': 'has previously',
    'kommer troligen': 'har historiskt',
    'förväntas': 'har tidigare',
  };
  
  return replacements[pattern.toLowerCase()];
}

/**
 * Sanitize text by replacing violations with neutral language
 */
function sanitizeText(text: string, violations: LanguageViolation[]): string {
  let result = text;
  
  // Sort by position descending to avoid index shifts
  const sorted = [...violations]
    .filter(v => v.suggested_replacement)
    .sort((a, b) => b.position - a.position);
  
  for (const violation of sorted) {
    if (violation.suggested_replacement) {
      result = 
        result.substring(0, violation.position) +
        violation.suggested_replacement +
        result.substring(violation.position + violation.match.length);
    }
  }
  
  return result;
}

// ============================================
// CANONICAL ANSWER TEMPLATES
// ============================================

/**
 * Templates for neutral language patterns
 */
export const NEUTRAL_TEMPLATES = {
  // Instead of: "This tax led to reduced investments"
  trend_observation: (subject: string, direction: string, period: string) =>
    `${subject} ${direction} can be observed during ${period}`,
  
  // Instead of: "Policy X caused outcome Y"
  co_occurrence: (factorA: string, factorB: string, period: string) =>
    `Simultaneous ${factorA} and ${factorB} can be observed during ${period}`,
  
  // Instead of: "Country A is better than Country B"
  comparison: (entityA: string, entityB: string, metric: string, difference: string) =>
    `${entityA} ${metric} is ${difference} compared to ${entityB}`,
  
  // Instead of: "This will likely continue"
  historical_pattern: (pattern: string, period: string) =>
    `${pattern} has been observed during ${period}`,
  
  // Swedish versions
  sv: {
    trend_observation: (subject: string, direction: string, period: string) =>
      `${subject} ${direction} kan observeras under ${period}`,
    
    co_occurrence: (factorA: string, factorB: string, period: string) =>
      `Samtidig ${factorA} och ${factorB} kan observeras under ${period}`,
    
    comparison: (entityA: string, entityB: string, metric: string, difference: string) =>
      `${entityA} ${metric} är ${difference} jämfört med ${entityB}`,
    
    historical_pattern: (pattern: string, period: string) =>
      `${pattern} har observerats under ${period}`,
  },
};

// ============================================
// VALIDATION REPORT
// ============================================

export interface LanguageValidationReport {
  text_hash: string;
  validated_at: string;
  is_compliant: boolean;
  violation_count: number;
  blocking_violations: number;
  violations: LanguageViolation[];
  compliance_certificate?: string;
}

/**
 * Generate a validation report for audit trail
 */
export function generateValidationReport(text: string): LanguageValidationReport {
  const result = validateLanguage(text);
  const blockingCount = result.violations.filter(v => v.severity === 'block').length;
  
  return {
    text_hash: simpleHash(text),
    validated_at: new Date().toISOString(),
    is_compliant: result.valid,
    violation_count: result.violations.length,
    blocking_violations: blockingCount,
    violations: result.violations,
    compliance_certificate: result.valid 
      ? `LANG-COMPLIANT-${Date.now().toString(36).toUpperCase()}`
      : undefined,
  };
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
