/**
 * Deviation & Signal System
 * 
 * Design for showing when something requires attention – not what should be done.
 * 
 * Core principle:
 * The system signals when reality deviates from its own historical or comparable pattern.
 * It never says why, and never says what should be done.
 */

// =============================================================================
// 1. DEVIATION DEFINITION (EXACT CRITERIA)
// =============================================================================

export interface DeviationCriteria {
  code: string;
  name_en: string;
  name_sv: string;
  description_en: string;
  description_sv: string;
  measurement_method: string;
  threshold?: number;
}

/**
 * A deviation occurs when observed outcome meets at least one of the following criteria.
 * Deviation = measurable change, NOT problem, crisis, or failure.
 */
export const DEVIATION_CRITERIA: DeviationCriteria[] = [
  {
    code: 'historical_trend_break',
    name_en: 'Breaks own historical trend',
    name_sv: 'Bryter mot egen historisk trend',
    description_en: 'Observed value deviates significantly from established historical pattern',
    description_sv: 'Observerat värde avviker signifikant från etablerat historiskt mönster',
    measurement_method: 'statistical_trend_analysis',
    threshold: 2.0, // standard deviations
  },
  {
    code: 'peer_deviation',
    name_en: 'Deviates significantly from comparable peers',
    name_sv: 'Avviker signifikant från jämförbara peers',
    description_en: 'Observed value differs substantially from similar entities',
    description_sv: 'Observerat värde skiljer sig väsentligt från liknande entiteter',
    measurement_method: 'peer_comparison',
    threshold: 1.5, // standard deviations from peer mean
  },
  {
    code: 'persistent_direction',
    name_en: 'Continues in same direction despite registered countermeasures',
    name_sv: 'Fortsätter i samma riktning trots registrerade motåtgärder',
    description_en: 'Trend persists despite documented interventions',
    description_sv: 'Trend kvarstår trots dokumenterade interventioner',
    measurement_method: 'intervention_correlation',
  },
  {
    code: 'volatility_increase',
    name_en: 'Shows increased volatility without corresponding external shock',
    name_sv: 'Uppvisar ökad volatilitet utan motsvarande extern chock',
    description_en: 'Variance has increased without identifiable external cause',
    description_sv: 'Variansen har ökat utan identifierbar extern orsak',
    measurement_method: 'volatility_analysis',
    threshold: 1.5, // multiplier of historical volatility
  },
  {
    code: 'declining_data_quality',
    name_en: 'Has declining data quality in area where decisions are made',
    name_sv: 'Har fallande datakvalitet i ett område där beslut fattas',
    description_en: 'Coverage or reliability has decreased in decision-relevant domain',
    description_sv: 'Täckning eller tillförlitlighet har minskat i beslutsrelevant domän',
    measurement_method: 'quality_score_tracking',
    threshold: 0.7, // minimum quality score
  },
];

// =============================================================================
// 2. DEVIATION LEVELS (NEUTRAL NOMENCLATURE)
// =============================================================================

export type DeviationLevel = 
  | 'stable'
  | 'changed_pattern'
  | 'high_deviation'
  | 'persistent_deviation'
  | 'insufficient_observation';

export interface DeviationLevelDefinition {
  code: DeviationLevel;
  name_en: string;
  name_sv: string;
  description_en: string;
  description_sv: string;
  visual_weight: number; // 0-1, for UI emphasis (not alarm)
}

/**
 * Non-charged levels only.
 * NO colors that scream "crisis"
 * NO words like "failure", "catastrophe", "acute"
 */
export const DEVIATION_LEVELS: Record<DeviationLevel, DeviationLevelDefinition> = {
  stable: {
    code: 'stable',
    name_en: 'Stable',
    name_sv: 'Stabilt',
    description_en: 'Within historical range',
    description_sv: 'Inom historiskt intervall',
    visual_weight: 0.1,
  },
  changed_pattern: {
    code: 'changed_pattern',
    name_en: 'Changed pattern',
    name_sv: 'Förändrat mönster',
    description_en: 'Trend break identified',
    description_sv: 'Trendbrott identifierat',
    visual_weight: 0.3,
  },
  high_deviation: {
    code: 'high_deviation',
    name_en: 'High deviation',
    name_sv: 'Hög avvikelse',
    description_en: 'Statistically significant',
    description_sv: 'Statistiskt signifikant',
    visual_weight: 0.6,
  },
  persistent_deviation: {
    code: 'persistent_deviation',
    name_en: 'Persistent deviation',
    name_sv: 'Bestående avvikelse',
    description_en: 'Persists over time',
    description_sv: 'Kvarstår över tid',
    visual_weight: 0.8,
  },
  insufficient_observation: {
    code: 'insufficient_observation',
    name_en: 'Insufficient observation basis',
    name_sv: 'Otillräcklig observationsgrund',
    description_en: 'Data is not sufficient',
    description_sv: 'Data räcker inte',
    visual_weight: 0.2,
  },
};

// =============================================================================
// 3. FORBIDDEN TERMINOLOGY
// =============================================================================

export const FORBIDDEN_SIGNAL_TERMS = {
  crisis_words: ['crisis', 'catastrophe', 'disaster', 'emergency', 'acute', 'critical'],
  judgment_words: ['failure', 'success', 'good', 'bad', 'wrong', 'right', 'mistake'],
  causal_words: ['caused', 'led to', 'resulted in', 'because', 'due to'],
  recommendation_words: ['should', 'must', 'need to', 'recommend', 'suggest'],
  
  replacement_guidance: {
    en: 'Use neutral observational language only',
    sv: 'Använd endast neutralt observationsspråk',
  },
};

// =============================================================================
// 4. SIGNAL DISPLAY STRUCTURE (UI/UX)
// =============================================================================

export interface SignalDisplayStructure {
  // A. What is deviating
  indicator: {
    code: string;
    name: string;
    unit: string;
  };
  time_period: {
    start: string;
    end: string;
  };
  comparison_basis: 'own_history' | 'peer_comparison' | 'both';
  
  // B. How much
  deviation_magnitude: {
    value: number;
    unit: string; // 'percent' | 'index' | 'standard_deviation'
    uncertainty: {
      lower: number;
      upper: number;
    };
  };
  
  // C. What cannot be said (PROTECTION)
  non_conclusion_statement: string;
}

export const SIGNAL_DISPLAY_REQUIREMENTS = {
  mandatory_elements: [
    'indicator_identification',
    'time_period',
    'comparison_basis',
    'magnitude_with_unit',
    'uncertainty_range',
    'non_conclusion_box',
  ],
  
  non_conclusion_template: {
    en: 'This signal does not explain causes or outcomes.',
    sv: 'Denna signal förklarar inte orsaker eller utfall.',
  },
};

// =============================================================================
// 5. CLICK-DOWN STRUCTURE: SIGNAL → OBSERVATION
// =============================================================================

export const DRILL_DOWN_SEQUENCE = [
  {
    order: 1,
    element: 'time_series',
    description_en: 'Full time series visualization',
    description_sv: 'Fullständig tidsserievisualisering',
    mandatory: true,
  },
  {
    order: 2,
    element: 'comparison_objects',
    description_en: 'List of comparison entities',
    description_sv: 'Lista över jämförelseobjekt',
    mandatory: true,
  },
  {
    order: 3,
    element: 'method_box',
    description_en: 'Methodology shown FIRST',
    description_sv: 'Metodruta visas FÖRST',
    mandatory: true,
    position: 'prominent', // Must be visible before data
  },
  {
    order: 4,
    element: 'data_gaps',
    description_en: 'Data gaps marked',
    description_sv: 'Datagap markeras',
    mandatory: true,
  },
  {
    order: 5,
    element: 'definition_changes',
    description_en: 'Definition changes shown',
    description_sv: 'Definitionsändringar visas',
    mandatory: true,
  },
];

export const DRILL_DOWN_PROHIBITIONS = {
  no_interpretations: true,
  no_ai_summary_of_causes: true,
  no_ranked_importance: true,
  no_suggested_actions: true,
};

// =============================================================================
// 6. AI ROLE (VERY STRICT)
// =============================================================================

export const AI_SIGNAL_PERMISSIONS = {
  allowed: [
    'describe_what_deviates',
    'indicate_since_when',
    'show_what_is_compared',
    'remind_of_limitations',
  ],
  
  forbidden: [
    'speculate',
    'weigh_interests',
    'suggest_interventions',
    'rank_societal_importance',
    'attribute_causes',
    'predict_outcomes',
  ],
};

export const AI_SIGNAL_TEMPLATE = {
  en: `This indicator shows a statistically significant deviation from its historical baseline starting in {year}.
The data does not explain underlying causes.`,
  
  sv: `Denna indikator visar en statistiskt signifikant avvikelse från sin historiska baslinje med start {year}.
Datan förklarar inte underliggande orsaker.`,
  
  placeholders: ['year'],
  
  validation_rules: [
    'must_include_time_reference',
    'must_include_limitation_statement',
    'must_not_include_causal_language',
    'must_not_include_recommendations',
  ],
};

// =============================================================================
// 7. INTERNAL CONTROL QUESTION (GATE)
// =============================================================================

export interface SignalApprovalGate {
  question: string;
  pass_condition: 'no';
  fail_action: 'redesign';
}

/**
 * Before any new signal type goes live, this question must be answered.
 */
export const SIGNAL_APPROVAL_GATE: SignalApprovalGate = {
  question: 'Can this be interpreted as a recommendation?',
  pass_condition: 'no',
  fail_action: 'redesign',
};

export function validateSignalDesign(signalDescription: string): {
  approved: boolean;
  reason?: string;
} {
  const lowerDesc = signalDescription.toLowerCase();
  
  // Check for forbidden terms
  for (const term of FORBIDDEN_SIGNAL_TERMS.recommendation_words) {
    if (lowerDesc.includes(term)) {
      return {
        approved: false,
        reason: `Contains recommendation language: "${term}"`,
      };
    }
  }
  
  for (const term of FORBIDDEN_SIGNAL_TERMS.causal_words) {
    if (lowerDesc.includes(term)) {
      return {
        approved: false,
        reason: `Contains causal language: "${term}"`,
      };
    }
  }
  
  for (const term of FORBIDDEN_SIGNAL_TERMS.judgment_words) {
    if (lowerDesc.includes(term)) {
      return {
        approved: false,
        reason: `Contains judgment language: "${term}"`,
      };
    }
  }
  
  return { approved: true };
}

// =============================================================================
// 8. CORE DOCTRINE
// =============================================================================

export const DEVIATION_SYSTEM_DOCTRINE = {
  primary_statement: {
    en: 'We highlight deviations in observed outcomes. We do not explain, judge, or prioritize them.',
    sv: 'Vi lyfter fram avvikelser i observerade utfall. Vi förklarar, bedömer eller prioriterar dem inte.',
  },
  
  why_this_works: {
    psychological_effects: {
      en: [
        'Creates cognitive friction: "Why does it look like this?"',
        'Transfers responsibility to the observer',
        'Makes excuses harder',
        'Makes political rhetoric easy to compare with actual outcomes',
      ],
      sv: [
        'Skapar kognitiv friktion: "Varför ser det ut så här?"',
        'Flyttar ansvar till betraktaren',
        'Gör bortförklaringar svårare',
        'Gör politisk retorik lätt att jämföra med faktiska utfall',
      ],
    },
    
    what_we_do_not_do: {
      en: ['accuse', 'drive opinion', 'take a position'],
      sv: ['anklagar', 'driver opinion', 'tar ställning'],
    },
  },
  
  survival_properties: {
    en: [
      'System survives power shifts',
      'System can be used globally',
      'System does not become your identity',
    ],
    sv: [
      'Systemet överlever maktskiften',
      'Systemet kan användas globalt',
      'Systemet blir inte er identitet',
    ],
  },
};

// =============================================================================
// 9. SIGNAL GENERATION HELPERS
// =============================================================================

export interface DeviationSignal {
  id: string;
  indicator_code: string;
  deviation_level: DeviationLevel;
  criteria_met: string[];
  magnitude: number;
  unit: string;
  period_start: string;
  period_end: string;
  comparison_basis: 'own_history' | 'peer_comparison' | 'both';
  uncertainty: { lower: number; upper: number };
  generated_at: string;
}

export function generateSignalText(
  signal: DeviationSignal,
  language: 'en' | 'sv' = 'en'
): string {
  const level = DEVIATION_LEVELS[signal.deviation_level];
  const isEn = language === 'en';
  
  const basisText = signal.comparison_basis === 'own_history'
    ? (isEn ? 'its historical baseline' : 'sin historiska baslinje')
    : signal.comparison_basis === 'peer_comparison'
    ? (isEn ? 'comparable peers' : 'jämförbara peers')
    : (isEn ? 'both historical baseline and peers' : 'både historisk baslinje och peers');
  
  const template = isEn
    ? `This indicator shows ${level.name_en.toLowerCase()} relative to ${basisText} during ${signal.period_start}–${signal.period_end}. The deviation is ${signal.magnitude.toFixed(1)} ${signal.unit} (uncertainty: ${signal.uncertainty.lower.toFixed(1)}–${signal.uncertainty.upper.toFixed(1)}). ${SIGNAL_DISPLAY_REQUIREMENTS.non_conclusion_template.en}`
    : `Denna indikator visar ${level.name_sv.toLowerCase()} i förhållande till ${basisText} under ${signal.period_start}–${signal.period_end}. Avvikelsen är ${signal.magnitude.toFixed(1)} ${signal.unit} (osäkerhet: ${signal.uncertainty.lower.toFixed(1)}–${signal.uncertainty.upper.toFixed(1)}). ${SIGNAL_DISPLAY_REQUIREMENTS.non_conclusion_template.sv}`;
  
  return template;
}

export function classifyDeviation(
  magnitude: number,
  persistenceMonths: number,
  dataQuality: number
): DeviationLevel {
  if (dataQuality < 0.5) {
    return 'insufficient_observation';
  }
  
  if (magnitude < 1.0) {
    return 'stable';
  }
  
  if (magnitude >= 2.0 && persistenceMonths >= 12) {
    return 'persistent_deviation';
  }
  
  if (magnitude >= 2.0) {
    return 'high_deviation';
  }
  
  return 'changed_pattern';
}
