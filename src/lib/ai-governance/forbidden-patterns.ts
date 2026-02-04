/**
 * AI GOVERNANCE: Forbidden Language Patterns
 * 
 * OEM-class diagnostic system.
 * AI may NEVER use these patterns.
 */

// =============================================================================
// FORBIDDEN VALUE WORDS (Swedish + English)
// =============================================================================

export const FORBIDDEN_VALUE_WORDS = [
  // Positive value words
  'bra', 'good', 'excellent', 'framgång', 'success', 'successful',
  'fantastisk', 'fantastic', 'utmärkt', 'outstanding', 'impressive',
  'remarkable', 'anmärkningsvärd', 'positiv', 'positive', 'förbättring',
  'improvement', 'improved', 'förbättrad', 'optimal', 'ideal',
  
  // Negative value words
  'dålig', 'bad', 'terrible', 'fruktansvärd', 'misslyckad', 'failed',
  'failure', 'katastrof', 'catastrophe', 'catastrophic', 'kris', 'crisis',
  'alarmerande', 'alarming', 'oroande', 'worrying', 'concerning',
  'problematisk', 'problematic', 'negativ', 'negative', 'försämring',
  'deterioration', 'collapse', 'kollaps',
  
  // Superlatives
  'bäst', 'best', 'värst', 'worst', 'mest', 'most', 'minst', 'least',
  'största', 'largest', 'smallest', 'minsta', 'högst', 'highest',
  'lowest', 'lägst', 'extremt', 'extremely', 'incredibly', 'otroligt',
] as const;

// =============================================================================
// FORBIDDEN NORMATIVE EXPRESSIONS
// =============================================================================

export const FORBIDDEN_NORMATIVE_EXPRESSIONS = [
  // Prescriptive
  'bör', 'should', 'borde', 'ought', 'måste', 'must', 'need to',
  'behöver', 'needs', 'ska', 'shall', 'rekommenderar', 'recommend',
  'föreslår', 'suggest', 'advise', 'råder',
  
  // Imperative
  'gör', 'do', 'undvik', 'avoid', 'välj', 'choose', 'prioritera',
  'prioritize', 'fokusera', 'focus on', 'satsa', 'invest in',
  
  // Evaluative conclusions
  'det är viktigt', 'it is important', 'det är nödvändigt',
  'it is necessary', 'det är avgörande', 'it is crucial',
  'det är kritiskt', 'it is critical',
] as const;

// =============================================================================
// FORBIDDEN INTENT INTERPRETATION
// =============================================================================

export const FORBIDDEN_INTENT_PATTERNS = [
  // Government/policy intent
  /regeringen\s+(vill|försöker|planerar|avser)/gi,
  /the government\s+(wants|tries|plans|intends)/gi,
  /politikerna\s+(vill|försöker)/gi,
  /politicians\s+(want|try)/gi,
  
  // Market intent
  /marknaden\s+(försöker|vill|tror)/gi,
  /the market\s+(tries|wants|believes)/gi,
  /investerare\s+(tror|förväntar)/gi,
  /investors\s+(believe|expect)/gi,
  
  // Institutional intent
  /myndigheten\s+(vill|avser|planerar)/gi,
  /the authority\s+(wants|intends|plans)/gi,
  /centralbanken\s+(signalerar|vill)/gi,
  /the central bank\s+(signals|wants)/gi,
] as const;

// =============================================================================
// FORBIDDEN FUTURE CLAIMS WITHOUT MODEL SUPPORT
// =============================================================================

export const FORBIDDEN_FUTURE_PATTERNS = [
  /kommer att\s+(öka|minska|förbättras|försämras)/gi,
  /will\s+(increase|decrease|improve|worsen)/gi,
  /är på väg att/gi,
  /is going to/gi,
  /förutspår/gi,
  /predicts/gi,
  /garanterat/gi,
  /guaranteed/gi,
  /säkert/gi,
  /certainly/gi,
  /definitivt/gi,
  /definitely/gi,
] as const;

// =============================================================================
// VALIDATION FUNCTION
// =============================================================================

export interface ViolationReport {
  hasViolation: boolean;
  violations: {
    type: 'value_word' | 'normative' | 'intent' | 'future_claim';
    match: string;
    position: number;
    severity: 'warning' | 'critical';
  }[];
  cleanedText: string | null;
}

export function validateAIOutput(text: string): ViolationReport {
  const violations: ViolationReport['violations'] = [];
  const lowerText = text.toLowerCase();
  
  // Check value words
  for (const word of FORBIDDEN_VALUE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lowerText)) !== null) {
      violations.push({
        type: 'value_word',
        match: match[0],
        position: match.index,
        severity: 'critical',
      });
    }
  }
  
  // Check normative expressions
  for (const expr of FORBIDDEN_NORMATIVE_EXPRESSIONS) {
    const regex = new RegExp(`\\b${expr}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lowerText)) !== null) {
      violations.push({
        type: 'normative',
        match: match[0],
        position: match.index,
        severity: 'critical',
      });
    }
  }
  
  // Check intent patterns
  for (const pattern of FORBIDDEN_INTENT_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      violations.push({
        type: 'intent',
        match: match[0],
        position: match.index,
        severity: 'critical',
      });
    }
  }
  
  // Check future claims
  for (const pattern of FORBIDDEN_FUTURE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      violations.push({
        type: 'future_claim',
        match: match[0],
        position: match.index,
        severity: 'warning',
      });
    }
  }
  
  return {
    hasViolation: violations.length > 0,
    violations,
    cleanedText: null, // Never auto-clean, always reject
  };
}
