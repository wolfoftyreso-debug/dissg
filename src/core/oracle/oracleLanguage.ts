/**
 * ORACLE LANGUAGE DISCIPLINE
 * 
 * The oracle may ONLY use descriptive language.
 * This is not style. This is law + epistemology + AI safety.
 */

// ============================================
// ALLOWED VERBS (EXHAUSTIVE LIST)
// ============================================

export const ALLOWED_VERBS = {
  // Being/State
  being: ['is', 'are', 'was', 'were', 'has been', 'have been'],
  being_sv: ['är', 'var', 'har varit'],
  
  // Observation
  observation: ['is observed', 'was observed', 'can be observed', 'is seen'],
  observation_sv: ['observeras', 'observerades', 'kan observeras'],
  
  // Display/Show
  display: ['shows', 'showed', 'displays', 'displayed', 'exhibits', 'exhibited'],
  display_sv: ['visar', 'visade', 'uppvisar', 'uppvisade'],
  
  // Reporting
  reporting: ['is reported', 'was reported', 'reports', 'reported'],
  reporting_sv: ['rapporteras', 'rapporterades'],
  
  // Measurement
  measurement: ['measures', 'measured', 'records', 'recorded'],
  measurement_sv: ['mäter', 'mättes', 'registrerar', 'registrerades'],
  
  // Indication
  indication: ['indicates', 'indicated', 'suggests', 'suggested'],
  indication_sv: ['indikerar', 'indikerade', 'antyder', 'antydde'],
  
  // Co-occurrence (NOT causation)
  cooccurrence: [
    'correlates with', 'correlated with',
    'co-occurs with', 'co-occurred with',
    'coincides with', 'coincided with',
    'moves with', 'moved with',
  ],
  cooccurrence_sv: [
    'korrelerar med', 'korrelerade med',
    'sammanfaller med', 'sammanföll med',
    'uppträder samtidigt som',
  ],
} as const;

// ============================================
// FORBIDDEN VERBS (NEVER USE)
// ============================================

export const FORBIDDEN_VERBS = {
  // Causation
  causation: [
    'causes', 'caused',
    'leads to', 'led to',
    'results in', 'resulted in',
    'produces', 'produced',
    'creates', 'created',
    'drives', 'drove',
    'triggers', 'triggered',
    'generates', 'generated',
    'induces', 'induced',
  ],
  causation_sv: [
    'orsakar', 'orsakade',
    'leder till', 'ledde till',
    'resulterar i', 'resulterade i',
    'skapar', 'skapade',
    'driver', 'drev',
    'utlöser', 'utlöste',
  ],
  
  // Normative
  normative: [
    'should', 'ought', 'must', 'need to', 'have to',
    'is good', 'is bad', 'is better', 'is worse',
    'is best', 'is worst',
    'is right', 'is wrong',
  ],
  normative_sv: [
    'bör', 'borde', 'måste', 'behöver',
    'är bra', 'är dåligt', 'är bättre', 'är sämre',
    'är rätt', 'är fel',
  ],
  
  // Predictive
  predictive: [
    'will', 'will be', 'is going to',
    'is expected to', 'is likely to',
    'probably will', 'may become',
  ],
  predictive_sv: [
    'kommer att', 'ska bli',
    'förväntas', 'kommer troligen',
    'lär bli',
  ],
  
  // Interpretive
  interpretive: [
    'means that', 'implies that',
    'proves that', 'demonstrates that',
    'shows that' // when used causally
  ],
  interpretive_sv: [
    'betyder att', 'innebär att',
    'bevisar att', 'visar att' // when used causally
  ],
  
  // Success/Failure
  success_failure: [
    'succeeded', 'failed',
    'worked', 'didn\'t work',
    'achieved', 'failed to achieve',
  ],
  success_failure_sv: [
    'lyckades', 'misslyckades',
    'fungerade', 'fungerade inte',
    'uppnådde', 'misslyckades med',
  ],
} as const;

// ============================================
// REPLACEMENT MAPPING
// ============================================

export const VERB_REPLACEMENTS: Record<string, string> = {
  // Causation → Co-occurrence
  'causes': 'is observed alongside',
  'caused': 'was observed alongside',
  'leads to': 'coincides with',
  'led to': 'coincided with',
  'results in': 'is followed by',
  'resulted in': 'was followed by',
  'drives': 'correlates with',
  'drove': 'correlated with',
  
  // Swedish
  'orsakar': 'observeras tillsammans med',
  'orsakade': 'observerades tillsammans med',
  'leder till': 'sammanfaller med',
  'ledde till': 'sammanföll med',
  
  // Normative → Neutral
  'should': 'could',
  'must': 'may',
  'bör': 'kan',
  'måste': 'kan',
  
  // Predictive → Historical
  'will': 'has historically',
  'will be': 'has been',
  'is expected to': 'has previously',
  'kommer att': 'har historiskt',
  'förväntas': 'har tidigare',
};

// ============================================
// LANGUAGE VALIDATION
// ============================================

export interface LanguageValidationResult {
  is_valid: boolean;
  violations: LanguageViolation[];
  corrected_text?: string;
}

export interface LanguageViolation {
  original: string;
  category: 'causation' | 'normative' | 'predictive' | 'interpretive' | 'success_failure';
  position: number;
  suggested_replacement?: string;
}

/**
 * Validate oracle language compliance
 */
export function validateOracleLanguage(text: string): LanguageValidationResult {
  const violations: LanguageViolation[] = [];
  let correctedText = text;
  
  // Check all forbidden categories
  const categories = ['causation', 'normative', 'predictive', 'interpretive', 'success_failure'] as const;
  
  for (const category of categories) {
    const patterns = [
      ...FORBIDDEN_VERBS[category],
      ...FORBIDDEN_VERBS[`${category}_sv` as keyof typeof FORBIDDEN_VERBS] || [],
    ];
    
    for (const pattern of patterns) {
      const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const replacement = VERB_REPLACEMENTS[pattern.toLowerCase()];
        violations.push({
          original: match[0],
          category,
          position: match.index,
          suggested_replacement: replacement,
        });
        
        if (replacement) {
          correctedText = correctedText.replace(
            new RegExp(`\\b${escapeRegex(match[0])}\\b`, 'i'),
            replacement
          );
        }
      }
    }
  }
  
  return {
    is_valid: violations.length === 0,
    violations,
    corrected_text: violations.length > 0 ? correctedText : undefined,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// ORACLE SENTENCE TEMPLATES
// ============================================

/**
 * Pre-approved sentence structures for oracle responses
 */
export const ORACLE_SENTENCE_TEMPLATES = {
  // Observation
  observation: {
    en: '{subject} {value} is observed in {context} during {period}.',
    sv: '{subject} {value} observeras i {context} under {period}.',
  },
  
  // Trend
  trend: {
    en: '{subject} has {direction} from {value1} to {value2} between {period1} and {period2}.',
    sv: '{subject} har {direction} från {value1} till {value2} mellan {period1} och {period2}.',
  },
  
  // Comparison
  comparison: {
    en: '{entity1} {metric} is {difference} compared to {entity2}.',
    sv: '{entity1} {metric} är {difference} jämfört med {entity2}.',
  },
  
  // Co-occurrence (NOT causation)
  cooccurrence: {
    en: 'Simultaneous {factor1} and {factor2} can be observed during {period}.',
    sv: 'Samtidig {factor1} och {factor2} kan observeras under {period}.',
  },
  
  // Variation
  variation: {
    en: 'Studies from {sources} show varying results depending on {factors}.',
    sv: 'Studier från {sources} visar varierande resultat beroende på {factors}.',
  },
  
  // Limitation
  limitation: {
    en: 'Data for {scope} is not available for {missing_aspect}.',
    sv: 'Data för {scope} finns inte tillgänglig för {missing_aspect}.',
  },
};

// ============================================
// CONTROVERSIAL TOPIC HANDLING
// ============================================

/**
 * For controversial topics, the oracle describes the distribution of facts,
 * not positions.
 */
export const CONTROVERSIAL_TOPIC_PROTOCOL = {
  principle: 'The oracle describes the landscape, not positions',
  
  example_wrong: 'Immigration increases crime',
  example_correct: 'Studies from X, Y, and Z show varying relationships between immigration and crime rates depending on country, time period, and methodology.',
  
  required_elements: [
    'name_sources_explicitly',
    'acknowledge_variation',
    'specify_conditions_for_variation',
    'never_take_position',
    'never_imply_consensus_without_evidence',
  ],
  
  result: {
    politically_uninteresting_to_attack: true,
    epistemically_impregnable: true,
  },
};
