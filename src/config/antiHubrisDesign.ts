/**
 * Anti-Hubris Design System
 * 
 * Hard, technical limits on model claims.
 * This is not communication. This is architecture.
 * 
 * Core doctrine: "We do not help people decide. We help people see."
 */

// =============================================================================
// PRINCIPLE 1: MODELS ARE ALWAYS SUBORDINATE TO DATA
// =============================================================================

export interface DataBoundaryRule {
  code: string;
  threshold: number;
  consequence: 'metadata_only' | 'description_only' | 'full_output' | 'blocked';
}

/**
 * No model may speak beyond the observed data space.
 * Non-negotiable rule.
 */
export const DATA_BOUNDARY_RULES: DataBoundaryRule[] = [
  {
    code: 'coverage_minimum',
    threshold: 0.70, // 70% coverage required
    consequence: 'metadata_only', // Below this: only metadata, no generated text
  },
  {
    code: 'time_points_minimum',
    threshold: 3, // Minimum 3 data points over time
    consequence: 'description_only', // Below this: description only, no trend analysis
  },
  {
    code: 'quality_score_minimum',
    threshold: 0.50, // 50% quality score
    consequence: 'blocked', // Below this: view is blocked entirely
  },
];

export interface ModelOutputRequirements {
  mandatory_fields: string[];
  must_include_all: boolean;
}

/**
 * Every model output must include these fields.
 */
export const MODEL_OUTPUT_REQUIREMENTS: ModelOutputRequirements = {
  mandatory_fields: [
    'data_interval',      // Time range of underlying data
    'coverage_rate',      // Percentage of coverage
    'stability_measure',  // Confidence/stability indicator
    'uncertainty_range',  // Upper and lower bounds
  ],
  must_include_all: true,
};

export function validateModelOutput(output: {
  coverage?: number;
  dataPoints?: number;
  qualityScore?: number;
}): {
  allowed: 'full_output' | 'description_only' | 'metadata_only' | 'blocked';
  reason?: string;
} {
  if (!output.qualityScore || output.qualityScore < 0.50) {
    return { allowed: 'blocked', reason: 'Quality score below minimum threshold' };
  }
  
  if (!output.coverage || output.coverage < 0.70) {
    return { allowed: 'metadata_only', reason: 'Coverage below 70%' };
  }
  
  if (!output.dataPoints || output.dataPoints < 3) {
    return { allowed: 'description_only', reason: 'Fewer than 3 data points' };
  }
  
  return { allowed: 'full_output' };
}

// =============================================================================
// PRINCIPLE 2: NO MODEL MAY BE "FINAL LAYER"
// =============================================================================

/**
 * No view, text, or signal may lack a visible layer beneath it.
 * This breaks the oracle illusion directly.
 */
export const LAYER_TRANSPARENCY_RULES = {
  principle: {
    en: 'No view, text, or signal may lack a visible layer beneath it.',
    sv: 'Ingen vy, text eller signal får sakna ett synligt lager under sig.',
  },
  
  requirements: {
    all_clickable_downward: true,
    all_summaries_reversible: true,
    no_final_slide: true,
    no_takeaway: true,
  },
  
  forbidden_patterns: [
    'conclusion',
    'takeaway',
    'key_insight',
    'bottom_line',
    'final_word',
  ],
  
  validation_check: 'Every element must have a drill-down path to source data',
};

// =============================================================================
// PRINCIPLE 3: MANDATORY LIMITATION DISPLAY
// =============================================================================

export interface LimitationsBox {
  header: string;
  required_sections: string[];
  position: 'prominent' | 'visible' | 'accessible';
  can_be_hidden: false;
}

/**
 * Every view must show a limitations box.
 * This is not a disclaimer. It is core content.
 */
export const LIMITATIONS_BOX: LimitationsBox = {
  header: 'Limitations of this view', // Never change this header
  required_sections: [
    'what_is_not_measured',
    'what_is_not_compared',
    'what_can_be_misinterpreted',
  ],
  position: 'prominent',
  can_be_hidden: false,
};

export function generateLimitationsContent(params: {
  notMeasured: string[];
  notCompared: string[];
  misinterpretationRisks: string[];
}, language: 'en' | 'sv' = 'en'): string {
  const isEn = language === 'en';
  
  const sections = [
    `**${isEn ? 'Not measured' : 'Mäts inte'}:**`,
    ...params.notMeasured.map(item => `- ${item}`),
    '',
    `**${isEn ? 'Not compared' : 'Jämförs inte'}:**`,
    ...params.notCompared.map(item => `- ${item}`),
    '',
    `**${isEn ? 'Potential misinterpretations' : 'Möjliga feltolkningar'}:**`,
    ...params.misinterpretationRisks.map(item => `- ${item}`),
  ];
  
  return sections.join('\n');
}

// =============================================================================
// PRINCIPLE 4: MODELS MAY NEVER PRIORITIZE
// =============================================================================

/**
 * Total prohibition on prioritization language.
 * The system may show magnitude, but never rank societal value.
 */
export const PRIORITIZATION_PROHIBITION = {
  forbidden_phrases: [
    'most important',
    'key issue',
    'critical area',
    'top priority',
    'main concern',
    'primary focus',
    'biggest problem',
    'worst',
    'best',
    'most urgent',
    'most significant',
  ],
  
  allowed_descriptors: [
    'deviation_magnitude',
    'size',
    'duration',
    'coverage',
    'statistical_significance',
    'persistence',
  ],
  
  rationale: {
    en: 'Value ≠ data. Societal prioritization is a normative choice, not an observation.',
    sv: 'Värde ≠ data. Samhällelig prioritering är ett normativt val, inte en observation.',
  },
};

export function containsPrioritizationLanguage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PRIORITIZATION_PROHIBITION.forbidden_phrases.some(phrase => 
    lowerText.includes(phrase)
  );
}

// =============================================================================
// PRINCIPLE 5: NO UNIFIED "WORLD SCORE"
// =============================================================================

/**
 * There may not exist:
 * - A global index
 * - A total score
 * - A composite "health"
 * 
 * This is painful for UX but vital for integrity.
 */
export const COMPOSITE_INDEX_PROHIBITION = {
  forbidden: [
    'global_index',
    'total_score',
    'composite_health',
    'overall_rating',
    'world_ranking',
    'universal_metric',
  ],
  
  allowed: [
    'parallel_indicators',
    'explicit_dimensions',
    'separate_time_series',
    'domain_specific_measures',
  ],
  
  rationale: {
    en: 'Composite indices hide methodology and impose implicit value weights. Parallel indicators preserve transparency.',
    sv: 'Sammansatta index döljer metodik och påtvingar implicita värdevikter. Parallella indikatorer bevarar transparens.',
  },
  
  exception: {
    allowed_if: 'methodology_fully_exposed_and_weights_user_adjustable',
    label: 'User-Defined Composite (experimental)',
  },
};

// =============================================================================
// PRINCIPLE 6: MODELS MUST SHOW DISAGREEMENT
// =============================================================================

/**
 * If multiple models give different results:
 * - Show them in parallel
 * - Show assumptions
 * - Show sensitivity
 * 
 * Never merge them or choose "best".
 * Disagreement is information, not a problem.
 */
export const MODEL_DISAGREEMENT_RULES = {
  when_models_disagree: {
    required_actions: [
      'show_parallel',
      'show_assumptions_per_model',
      'show_sensitivity',
    ],
    forbidden_actions: [
      'merge_results',
      'select_best',
      'average_outputs',
      'hide_minority_view',
    ],
  },
  
  display_principle: {
    en: 'Disagreement is information, not a problem.',
    sv: 'Oenighet är information, inte ett problem.',
  },
  
  ui_requirement: 'Side-by-side comparison with explicit assumption labels',
};

// =============================================================================
// PRINCIPLE 7: "UNKNOWN" IS A FIRST-CLASS VALUE
// =============================================================================

export type ObservationStatus = 'observed' | 'estimated' | 'interpolated' | 'unknown';

/**
 * "Unknown" is an explicit state with specific properties:
 * - Displayed as result, not error
 * - Filterable
 * - Counted in coverage statistics
 */
export const UNKNOWN_STATUS_DEFINITION = {
  code: 'unknown' as const,
  
  properties: {
    displayed_as_result: true,      // Not as error
    is_filterable: true,            // Can filter to show unknowns
    counted_in_coverage: true,      // Affects coverage statistics
    displayed_in_exports: true,     // Included in data exports
  },
  
  display: {
    label_en: 'Unknown',
    label_sv: 'Okänt',
    icon: 'question_mark',          // Neutral icon
    color: 'neutral_gray',          // Not warning/error color
  },
  
  benefits: {
    en: [
      'System is not pressured to answer',
      'System does not hallucinate',
      'System gains trust over time',
    ],
    sv: [
      'Systemet pressas inte att svara',
      'Systemet hallucinerar inte',
      'Systemet vinner förtroende över tid',
    ],
  },
};

// =============================================================================
// PRINCIPLE 8: INTERNAL HUBRIS ALARM
// =============================================================================

export interface HubrisCheck {
  question: string;
  trigger_condition: 'yes';
  consequence: 'block_release';
}

/**
 * Internal control question for every release.
 * This is your ethical CI pipeline.
 */
export const HUBRIS_ALARM: HubrisCheck = {
  question: 'Could a user cite this as an answer to what should be done?',
  trigger_condition: 'yes',
  consequence: 'block_release',
};

export function performHubrisCheck(content: string): {
  passes: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Check for recommendation language
  const recommendationPatterns = [
    'should', 'must', 'need to', 'recommend', 'suggest',
    'the solution is', 'the answer is', 'what to do',
  ];
  
  for (const pattern of recommendationPatterns) {
    if (lowerContent.includes(pattern)) {
      violations.push(`Contains recommendation language: "${pattern}"`);
    }
  }
  
  // Check for prioritization language
  if (containsPrioritizationLanguage(content)) {
    violations.push('Contains prioritization language');
  }
  
  // Check for causal claims
  const causalPatterns = ['caused', 'led to', 'resulted in', 'because of'];
  for (const pattern of causalPatterns) {
    if (lowerContent.includes(pattern)) {
      violations.push(`Contains causal claim: "${pattern}"`);
    }
  }
  
  return {
    passes: violations.length === 0,
    violations,
  };
}

// =============================================================================
// PRINCIPLE 9: LINGUISTIC MINIMALISM
// =============================================================================

/**
 * All texts must be:
 * - Descriptive
 * - Dry
 * - Without metaphors
 * - Without value words
 */
export const LINGUISTIC_RULES = {
  required_style: [
    'descriptive',
    'dry',
    'factual',
    'neutral',
  ],
  
  forbidden_elements: [
    'metaphors',
    'value_words',
    'emotional_language',
    'dramatic_phrasing',
  ],
  
  examples: {
    good: [
      'Observed deviation relative to baseline.',
      'Indicator shows changed pattern since 2019.',
      'Coverage is 78% across included regions.',
    ],
    forbidden: [
      'Alarming trend',
      'Concerning development',
      'Clear failure',
      'Dramatic shift',
      'Worrying pattern',
    ],
  },
};

export function validateLinguisticStyle(text: string): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  const forbiddenWords = [
    'alarming', 'concerning', 'worrying', 'dramatic', 'shocking',
    'failure', 'success', 'disaster', 'crisis', 'catastrophe',
    'obviously', 'clearly', 'undoubtedly', 'certainly',
  ];
  
  for (const word of forbiddenWords) {
    if (lowerText.includes(word)) {
      violations.push(`Contains forbidden word: "${word}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// =============================================================================
// PRINCIPLE 10: SYSTEM SELF-DESCRIPTION (INTERNAL MANTRA)
// =============================================================================

/**
 * This should be on your wall.
 */
export const SYSTEM_MANTRA = {
  primary: {
    en: 'We do not help people decide. We help people see.',
    sv: 'Vi hjälper inte människor att bestämma. Vi hjälper människor att se.',
  },
  
  supporting: {
    en: [
      'Observation before interpretation.',
      'Data before opinion.',
      'Transparency before convenience.',
      'Silence before speculation.',
    ],
    sv: [
      'Observation före tolkning.',
      'Data före åsikt.',
      'Transparens före bekvämlighet.',
      'Tystnad före spekulation.',
    ],
  },
};

// =============================================================================
// SURVIVAL PROPERTIES
// =============================================================================

export const ANTI_HUBRIS_OUTCOMES = {
  without_these_barriers: {
    en: [
      'You slowly become normative',
      'You become attackable',
      'You eventually become ignored',
    ],
    sv: [
      'Ni blir långsamt normativa',
      'Ni blir attackerbara',
      'Ni blir till slut ignorerade',
    ],
  },
  
  with_these_barriers: {
    en: [
      'You become boring',
      'You become hard to attack',
      'You become permanent',
    ],
    sv: [
      'Ni blir tråkiga',
      'Ni blir svåra att angripa',
      'Ni blir permanenta',
    ],
  },
};

// =============================================================================
// COMPLETE VALIDATION PIPELINE
// =============================================================================

export interface AntiHubrisValidation {
  modelOutputValid: boolean;
  layerTransparencyValid: boolean;
  limitationsPresent: boolean;
  noPrioritization: boolean;
  noCompositeIndex: boolean;
  unknownHandled: boolean;
  hubrisCheckPasses: boolean;
  linguisticallyValid: boolean;
  overallValid: boolean;
  violations: string[];
}

export function runAntiHubrisValidation(content: {
  text: string;
  hasLimitationsBox: boolean;
  hasDrillDown: boolean;
  modelOutput?: { coverage?: number; dataPoints?: number; qualityScore?: number };
}): AntiHubrisValidation {
  const violations: string[] = [];
  
  // Model output validation
  const modelCheck = content.modelOutput 
    ? validateModelOutput(content.modelOutput)
    : { allowed: 'full_output' as const };
  const modelOutputValid = modelCheck.allowed !== 'blocked';
  if (!modelOutputValid) violations.push(modelCheck.reason || 'Model output blocked');
  
  // Layer transparency
  const layerTransparencyValid = content.hasDrillDown;
  if (!layerTransparencyValid) violations.push('Missing drill-down capability');
  
  // Limitations box
  const limitationsPresent = content.hasLimitationsBox;
  if (!limitationsPresent) violations.push('Missing limitations box');
  
  // Prioritization check
  const noPrioritization = !containsPrioritizationLanguage(content.text);
  if (!noPrioritization) violations.push('Contains prioritization language');
  
  // Hubris check
  const hubrisResult = performHubrisCheck(content.text);
  const hubrisCheckPasses = hubrisResult.passes;
  violations.push(...hubrisResult.violations);
  
  // Linguistic validation
  const linguisticResult = validateLinguisticStyle(content.text);
  const linguisticallyValid = linguisticResult.valid;
  violations.push(...linguisticResult.violations);
  
  const overallValid = 
    modelOutputValid &&
    layerTransparencyValid &&
    limitationsPresent &&
    noPrioritization &&
    hubrisCheckPasses &&
    linguisticallyValid;
  
  return {
    modelOutputValid,
    layerTransparencyValid,
    limitationsPresent,
    noPrioritization,
    noCompositeIndex: true, // Would need context to check
    unknownHandled: true,    // Would need context to check
    hubrisCheckPasses,
    linguisticallyValid,
    overallValid,
    violations,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const ANTI_HUBRIS_PRINCIPLES = {
  principle_1: 'Models are always subordinate to data',
  principle_2: 'No model may be final layer',
  principle_3: 'Mandatory limitation display',
  principle_4: 'Models may never prioritize',
  principle_5: 'No unified world score',
  principle_6: 'Models must show disagreement',
  principle_7: 'Unknown is a first-class value',
  principle_8: 'Internal hubris alarm',
  principle_9: 'Linguistic minimalism',
  principle_10: 'System self-description mantra',
};
