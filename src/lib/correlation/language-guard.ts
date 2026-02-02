/**
 * LANGUAGE GUARD
 * Ensures system never uses causal or normative language
 * 
 * IMMUTABLE RULE: System speaks only in observations, never implications
 */

import { FORBIDDEN_LANGUAGE_PATTERNS } from '@/types/correlation';

export interface LanguageCheckResult {
  isValid: boolean;
  violations: string[];
  sanitized: string;
}

/**
 * Check text for forbidden language patterns
 */
export function checkLanguage(text: string): LanguageCheckResult {
  const violations: string[] = [];
  let sanitized = text;

  for (const pattern of FORBIDDEN_LANGUAGE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      violations.push(`Forbidden pattern: "${match[0]}"`);
      sanitized = sanitized.replace(pattern, '[BLOCKED]');
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    sanitized,
  };
}

/**
 * Allowed statement templates (locked vocabulary)
 */
export const ALLOWED_TEMPLATES = {
  // Observation statements
  observed: (what: string, when: string) => 
    `Observed: ${what} during ${when}`,
  
  notObserved: (what: string, when: string) =>
    `Not observed: ${what} during ${when}`,
  
  // Correlation statements
  correlationPresent: (a: string, b: string, r: number, period: string) =>
    `Co-movement observed between ${a} and ${b} (r=${r.toFixed(2)}) during ${period}`,
  
  correlationAbsent: (a: string, b: string, period: string) =>
    `No consistent co-movement observed between ${a} and ${b} during ${period}`,
  
  correlationUnstable: (a: string, b: string, period: string) =>
    `Correlation between ${a} and ${b} varies across subperiods of ${period}`,
  
  // Variation statements
  variesBy: (metric: string, dimension: string) =>
    `${metric} varies by ${dimension}`,
  
  // Insufficiency statements
  insufficientData: (reason: string) =>
    `Data insufficient: ${reason}`,
  
  // Context statements
  alsoMoved: (variables: string[]) =>
    `During this period, ${variables.join(', ')} also changed`,
  
  didNotMove: (variables: string[]) =>
    `${variables.join(', ')} did not show significant movement`,
} as const;

/**
 * Swedish templates
 */
export const ALLOWED_TEMPLATES_SV = {
  observed: (what: string, when: string) => 
    `Observerat: ${what} under ${when}`,
  
  notObserved: (what: string, when: string) =>
    `Ej observerat: ${what} under ${when}`,
  
  correlationPresent: (a: string, b: string, r: number, period: string) =>
    `Samvariation observerad mellan ${a} och ${b} (r=${r.toFixed(2)}) under ${period}`,
  
  correlationAbsent: (a: string, b: string, period: string) =>
    `Ingen konsistent samvariation observerad mellan ${a} och ${b} under ${period}`,
  
  correlationUnstable: (a: string, b: string, period: string) =>
    `Korrelationen mellan ${a} och ${b} varierar över delperioder av ${period}`,
  
  variesBy: (metric: string, dimension: string) =>
    `${metric} varierar per ${dimension}`,
  
  insufficientData: (reason: string) =>
    `Data otillräcklig: ${reason}`,
  
  alsoMoved: (variables: string[]) =>
    `Under denna period förändrades även ${variables.join(', ')}`,
  
  didNotMove: (variables: string[]) =>
    `${variables.join(', ')} visade ingen signifikant förändring`,
} as const;

/**
 * Mandatory disclaimers (always shown)
 */
export const MANDATORY_DISCLAIMERS = {
  correlationNotCausation: {
    en: 'Correlation does not imply causation. This view shows statistical co-movement only.',
    sv: 'Korrelation innebär inte kausalitet. Denna vy visar endast statistisk samvariation.',
  },
  sectorNotCompany: {
    en: 'This view shows sector-level performance. Market performance reflects multiple factors and does not imply causation with other outcomes.',
    sv: 'Denna vy visar sektornivå. Marknadsutveckling reflekterar flera faktorer och innebär inte kausalitet med andra utfall.',
  },
  multipleFactors: {
    en: 'Multiple factors influence observed patterns. Alternative explanations exist.',
    sv: 'Flera faktorer påverkar observerade mönster. Alternativa förklaringar finns.',
  },
  userInterpretation: {
    en: 'Interpretation is the responsibility of the user. The system makes no claims.',
    sv: 'Tolkning är användarens ansvar. Systemet gör inga påståenden.',
  },
} as const;

/**
 * Block causal claims in AI/user-generated content
 */
export function blockCausalClaims(text: string): string {
  let result = text;
  
  const replacements: [RegExp, string][] = [
    [/caused by/gi, 'coincided with'],
    [/led to/gi, 'preceded'],
    [/resulted in/gi, 'was followed by'],
    [/due to/gi, 'concurrent with'],
    [/because of/gi, 'during the same period as'],
    [/proves that/gi, 'is observed alongside'],
    [/shows that .+ caused/gi, 'shows co-movement with'],
    [/gynnades av/gi, 'sammanföll med'],
    [/orsakades av/gi, 'var samtidig med'],
    [/ledde till/gi, 'föregick'],
    [/berodde på/gi, 'var samtida med'],
    [/bevisar att/gi, 'observeras tillsammans med'],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}
