/**
 * ENVIRONMENT REALITY CHARTER
 * 
 * This is the CONSTITUTION for environmental data presentation.
 * These rules CANNOT be overridden.
 * 
 * Core principle:
 * "Show what is measured, how it's measured, and what happened.
 *  Never say what should be done."
 */

/**
 * ARTICLE 1: Observation Mode is DEFAULT
 * 
 * Users start in observation mode. Model mode requires explicit selection.
 * There is NO automatic switching between modes.
 */
export const OBSERVATION_IS_DEFAULT = true;

/**
 * ARTICLE 2: Correlation Warning is LOCKED
 * 
 * This warning appears on EVERY environmental data view.
 * It CANNOT be disabled, hidden, or minimized.
 */
export const CORRELATION_WARNING_LOCKED = true;
export const CORRELATION_WARNING_DISMISSABLE = false;

/**
 * ARTICLE 3: Forbidden Language
 * 
 * These phrases are BLOCKED from all environmental content.
 * Violation of this list is a system error.
 */
export const FORBIDDEN_PHRASES = {
  causal_claims: [
    'caused by',
    'orsakas av',
    'leads to',
    'leder till',
    'results in',
    'resulterar i',
    'because of',
    'på grund av',
    'due to',
    'beror på',
    'proves that',
    'bevisar att',
    'shows that',  // without qualification
    'visar att',   // without qualification
  ],
  
  prescriptive_language: [
    'should',
    'bör',
    'must',
    'måste',
    'need to',
    'behöver',
    'have to',
    'ought to',
    'borde',
  ],
  
  alarmist_language: [
    'catastrophe',
    'katastrof',
    'disaster',
    'emergency',
    'nödläge',
    'crisis',
    'kris',
    'apocalypse',
    'collapse',
    'kollaps',
    'doom',
    'extinction',
    'utrotning',
  ],
  
  denialist_language: [
    'hoax',
    'bluff',
    'myth',
    'myt',
    'fake',
    'falskt',
    'scam',
    'bedrägeri',
    'conspiracy',
    'konspiration',
  ],
  
  certainty_claims: [
    'will definitely',
    'kommer definitivt',
    'guaranteed',
    'garanterat',
    'certain',
    'säkert',
    'inevitable',
    'oundvikligt',
    'no doubt',
    'utan tvivel',
  ],
  
  comparative_value: [
    'better',
    'bättre',
    'worse',
    'sämre',
    'good',
    'bra',
    'bad',
    'dåligt',
    'right',
    'rätt',
    'wrong',
    'fel',
  ],
} as const;

/**
 * ARTICLE 4: Required Context
 * 
 * Every environmental data point MUST include:
 */
export const REQUIRED_CONTEXT_FIELDS = [
  'measurement_method',      // How was this measured?
  'data_source',             // Who collected this?
  'temporal_coverage',       // What period does this cover?
  'spatial_coverage',        // What geography does this cover?
  'uncertainty_range',       // What's the error margin?
  'known_limitations',       // What doesn't this capture?
  'last_updated',            // When was this last updated?
] as const;

/**
 * ARTICLE 5: Model Mode Requirements
 * 
 * When in model mode, these elements are MANDATORY:
 */
export const MODEL_MODE_REQUIREMENTS = [
  'explicit_scenario_label',      // Clear "THIS IS A MODEL" marker
  'assumptions_visible',          // All assumptions listed
  'multiple_models_shown',        // Never single model
  'range_not_point',              // Intervals only, no single predictions
  'no_probability_labels',        // No "most likely" etc.
  'historical_analogues',         // Show similar past situations
  'divergence_explained',         // Where do models disagree?
] as const;

/**
 * ARTICLE 6: What Happened When Requirements
 * 
 * Historical correlation analysis MUST include:
 */
export const WHAT_HAPPENED_WHEN_REQUIREMENTS = [
  'multiple_countries',           // At least 3 examples
  'multiple_periods',             // At least 2 time periods
  'confounding_factors',          // Other things that changed
  'alternative_explanations',     // Other possible causes
  'exceptions_shown',             // Cases that contradict
  'attribution_confidence',       // How sure are we?
] as const;

/**
 * ARTICLE 7: Allowed Language Patterns
 * 
 * These neutral formulations ARE allowed:
 */
export const ALLOWED_LANGUAGE_PATTERNS = {
  observation: [
    'observed',
    'observerades',
    'measured',
    'uppmättes',
    'recorded',
    'registrerades',
    'data show',
    'data visar',
    'according to measurements',
    'enligt mätningar',
  ],
  
  correlation: [
    'co-movement observed',
    'samrörelse observerades',
    'correlation found',
    'korrelation funnen',
    'moved together',
    'rörde sig tillsammans',
    'changed during the same period',
    'förändrades under samma period',
  ],
  
  uncertainty: [
    'uncertainty range',
    'osäkerhetsintervall',
    'confidence level',
    'konfidensnivå',
    'margin of error',
    'felmarginal',
    'models diverge',
    'modeller divergerar',
    'data quality varies',
    'datakvalitet varierar',
  ],
  
  historical: [
    'historically, under similar conditions',
    'historiskt, under liknande förhållanden',
    'in past cases',
    'i tidigare fall',
    'outcomes ranged between',
    'utfall varierade mellan',
    'exceptions include',
    'undantag inkluderar',
  ],
} as const;

/**
 * ARTICLE 8: Media/AI Citation Requirements
 * 
 * Every claim must be traceable to a specific data point.
 */
export interface CitationRequirement {
  observationId: string;        // Unique ID for the observation
  modelId?: string;             // If model-based, which model
  accessUrl: string;            // Direct link to this exact data
  timestamp: string;            // When this was generated
  version: string;              // Data version
  checksumHash: string;         // Proof of data integrity
}

/**
 * Validate text against charter rules
 * Returns violations if any
 */
export function validateAgainstCharter(text: string): {
  isValid: boolean;
  violations: {
    category: keyof typeof FORBIDDEN_PHRASES;
    phrase: string;
    suggestion: string;
  }[];
} {
  const violations: {
    category: keyof typeof FORBIDDEN_PHRASES;
    phrase: string;
    suggestion: string;
  }[] = [];
  
  const lowerText = text.toLowerCase();
  
  for (const [category, phrases] of Object.entries(FORBIDDEN_PHRASES)) {
    for (const phrase of phrases) {
      if (lowerText.includes(phrase.toLowerCase())) {
        violations.push({
          category: category as keyof typeof FORBIDDEN_PHRASES,
          phrase,
          suggestion: getSuggestion(category as keyof typeof FORBIDDEN_PHRASES, phrase),
        });
      }
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations,
  };
}

function getSuggestion(category: keyof typeof FORBIDDEN_PHRASES, phrase: string): string {
  const suggestions: Record<keyof typeof FORBIDDEN_PHRASES, string> = {
    causal_claims: 'Use: "observed correlation between X and Y"',
    prescriptive_language: 'Remove prescription, show data only',
    alarmist_language: 'Use: "observed trend" or "measured change"',
    denialist_language: 'Show the data with uncertainty, let reader judge',
    certainty_claims: 'Use: "based on available data" with confidence level',
    comparative_value: 'Remove value judgment, show numbers only',
  };
  return suggestions[category];
}

/**
 * Generate charter-compliant observation statement
 */
export function generateObservationStatement(params: {
  indicatorName: string;
  value: number;
  unit: string;
  change: number;
  period: { start: number; end: number };
  confidence: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
}): string {
  const direction = params.change > 0 ? 'increased' : params.change < 0 ? 'decreased' : 'remained stable';
  const magnitude = Math.abs(params.change);
  
  return `${params.indicatorName} ${direction} by ${magnitude.toFixed(1)}${params.unit} ` +
         `between ${params.period.start} and ${params.period.end}. ` +
         `Confidence: ${params.confidence}. ` +
         `This observation does not, by itself, establish causation.`;
}

/**
 * Charter version - for audit trail
 */
export const CHARTER_VERSION = '1.0.0';
export const CHARTER_ADOPTED = '2026-02-02';
