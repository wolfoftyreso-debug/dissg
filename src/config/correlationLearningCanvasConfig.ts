/**
 * MODULE — CORRELATION & LEARNING CANVAS (CLC)
 * "Visa mig vad som rör sig tillsammans – och hjälp mig förstå varför det kan vara relevant."
 * 
 * Arbetsytan. Superenkel. Supersnygg. Supersann.
 * 
 * DESIGNPRINCIPER (OBLIGATORISKA):
 * ❌ inga avancerade reglage i startläget
 * ❌ inga statistiska termer i UI
 * ❌ inga "insights" utan förklaring
 * ✅ drag & drop
 * ✅ tydlig text
 * ✅ allt klickbart till metod & data
 * 
 * Om en smart person inte fattar på 30 sek → designfel.
 */

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ABSOLUT)
// ═══════════════════════════════════════════════════════════════

export const CLC_CORE_PRINCIPLE = {
  statement: 'Systemet hjälper människor att tänka. Inte att dra snabba slutsatser.',
  statementEn: 'The system helps people think. Not to draw quick conclusions.',
  enforced: true,
  
  design_rules: {
    no_advanced_controls_at_start: true,
    no_statistical_terms_in_ui: true,
    no_insights_without_explanation: true,
    drag_and_drop: true,
    clear_text: true,
    everything_clickable_to_source: true,
  },
  
  test: '30 second rule: If a smart person doesn\'t get it in 30 seconds → design failure',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK PA — LEARNING CANVAS STRUCTURE
// ═══════════════════════════════════════════════════════════════

export interface CanvasSection {
  id: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
}

export const CANVAS_SECTIONS: CanvasSection[] = [
  {
    id: 'selection',
    title: 'What are you comparing?',
    titleSv: 'Vad jämför du?',
    description: 'Choose data points to explore',
    descriptionSv: 'Välj datapunkter att utforska',
  },
  {
    id: 'visualization',
    title: 'What do we see?',
    titleSv: 'Vad ser vi?',
    description: 'Visual patterns over time',
    descriptionSv: 'Visuella mönster över tid',
  },
  {
    id: 'interpretation',
    title: 'What does this mean?',
    titleSv: 'Vad betyder detta?',
    description: 'Understanding, not conclusions',
    descriptionSv: 'Förståelse, inte slutsatser',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK PB — DATA PICKER (EXTREMT ENKEL)
// ═══════════════════════════════════════════════════════════════

export interface DataCategory {
  id: string;
  name: string;
  nameSv: string;
  icon: string;
  color: string;
  indicators: DataIndicator[];
}

export interface DataIndicator {
  id: string;
  name: string;
  nameSv: string;
  unit: string;
  description: string;
  descriptionSv: string;
  category: string;
  available_regions: string[];
  available_years: [number, number]; // [start, end]
}

export const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'economy',
    name: 'Economy',
    nameSv: 'Ekonomi',
    icon: '💰',
    color: 'hsl(var(--chart-1))',
    indicators: [
      {
        id: 'gdp_per_capita',
        name: 'Economic output per person',
        nameSv: 'Ekonomisk produktion per person',
        unit: 'EUR',
        description: 'Total economic value divided by population',
        descriptionSv: 'Totalt ekonomiskt värde delat på befolkning',
        category: 'economy',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
      {
        id: 'household_purchasing_power',
        name: 'Household purchasing power',
        nameSv: 'Hushållens köpkraft',
        unit: 'Index',
        description: 'What households can afford after inflation',
        descriptionSv: 'Vad hushåll har råd med efter inflation',
        category: 'economy',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
      {
        id: 'unemployment_rate',
        name: 'People without work',
        nameSv: 'Andel utan arbete',
        unit: '%',
        description: 'Share of workforce looking for jobs',
        descriptionSv: 'Andel av arbetskraften som söker jobb',
        category: 'economy',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    nameSv: 'Energi',
    icon: '⚡',
    color: 'hsl(var(--chart-2))',
    indicators: [
      {
        id: 'energy_price',
        name: 'Energy price',
        nameSv: 'Energipris',
        unit: 'EUR/MWh',
        description: 'Average cost of electricity',
        descriptionSv: 'Genomsnittlig kostnad för el',
        category: 'energy',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2010, 2024],
      },
      {
        id: 'renewable_share',
        name: 'Renewable energy share',
        nameSv: 'Andel förnybar energi',
        unit: '%',
        description: 'Electricity from renewable sources',
        descriptionSv: 'El från förnybara källor',
        category: 'energy',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    nameSv: 'Hälsa',
    icon: '🏥',
    color: 'hsl(var(--chart-3))',
    indicators: [
      {
        id: 'life_expectancy',
        name: 'Life expectancy',
        nameSv: 'Förväntad livslängd',
        unit: 'years',
        description: 'Average years a person is expected to live',
        descriptionSv: 'Genomsnittliga år en person förväntas leva',
        category: 'health',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
      {
        id: 'healthcare_spending',
        name: 'Healthcare spending',
        nameSv: 'Sjukvårdsutgifter',
        unit: '% of GDP',
        description: 'Share of economy spent on healthcare',
        descriptionSv: 'Andel av ekonomin som går till sjukvård',
        category: 'health',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    nameSv: 'Utbildning',
    icon: '📚',
    color: 'hsl(var(--chart-4))',
    indicators: [
      {
        id: 'education_spending',
        name: 'Education spending',
        nameSv: 'Utbildningsutgifter',
        unit: '% of GDP',
        description: 'Share of economy spent on education',
        descriptionSv: 'Andel av ekonomin som går till utbildning',
        category: 'education',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
      {
        id: 'tertiary_education',
        name: 'Higher education rate',
        nameSv: 'Andel med högre utbildning',
        unit: '%',
        description: 'Share of adults with university education',
        descriptionSv: 'Andel vuxna med universitetsutbildning',
        category: 'education',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    nameSv: 'Miljö',
    icon: '🌍',
    color: 'hsl(var(--chart-5))',
    indicators: [
      {
        id: 'co2_emissions',
        name: 'CO₂ emissions',
        nameSv: 'CO₂-utsläpp',
        unit: 'tons/capita',
        description: 'Carbon dioxide emissions per person',
        descriptionSv: 'Koldioxidutsläpp per person',
        category: 'environment',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2000, 2024],
      },
      {
        id: 'air_quality',
        name: 'Air quality',
        nameSv: 'Luftkvalitet',
        unit: 'Index',
        description: 'Measure of clean air',
        descriptionSv: 'Mått på ren luft',
        category: 'environment',
        available_regions: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'UK'],
        available_years: [2010, 2024],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK PC — VISUALIZATION (INGEN MAGI)
// ═══════════════════════════════════════════════════════════════

export interface MovementDescription {
  pattern: 'together' | 'opposite' | 'no_pattern' | 'mixed';
  timing: 'before' | 'after' | 'parallel' | 'unclear';
  strength: 'strong' | 'moderate' | 'weak';
}

export const MOVEMENT_DESCRIPTIONS: Record<string, { sv: string; en: string }> = {
  together_strong: {
    sv: 'Dessa kurvor rör sig ofta i samma riktning',
    en: 'These curves often move in the same direction',
  },
  together_moderate: {
    sv: 'Dessa kurvor rör sig ibland i samma riktning',
    en: 'These curves sometimes move in the same direction',
  },
  opposite_strong: {
    sv: 'När den ena stiger, sjunker den andra ofta',
    en: 'When one rises, the other often falls',
  },
  no_pattern: {
    sv: 'Inget tydligt mönster syns i denna period',
    en: 'No clear pattern visible in this period',
  },
  mixed: {
    sv: 'Mönstret varierar under olika perioder',
    en: 'The pattern varies across different periods',
  },
};

export const TIMING_DESCRIPTIONS: Record<string, { sv: string; en: string }> = {
  before: {
    sv: 'Förändringen i A sker ofta före förändringen i B',
    en: 'The change in A often occurs before the change in B',
  },
  after: {
    sv: 'Förändringen i A sker ofta efter förändringen i B',
    en: 'The change in A often occurs after the change in B',
  },
  parallel: {
    sv: 'Förändringarna sker ungefär samtidigt',
    en: 'The changes occur roughly at the same time',
  },
  unclear: {
    sv: 'Timing-mönstret är otydligt',
    en: 'The timing pattern is unclear',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK PD — KORRELATIONSFÖRKLARING (TEXT, INTE SIFFROR)
// ═══════════════════════════════════════════════════════════════

export interface CorrelationExplanation {
  primary_text: string;
  primary_textSv: string;
  consistency_text: string;
  consistency_textSv: string;
  exceptions_text: string;
  exceptions_textSv: string;
  causation_warning: string;
  causation_warningSv: string;
}

export function generateCorrelationExplanation(
  indicatorA: string,
  indicatorB: string,
  yearsMatched: number,
  totalYears: number,
  hasExceptions: boolean
): CorrelationExplanation {
  return {
    primary_text: `When ${indicatorA} increased during this period, ${indicatorB} also often increased.`,
    primary_textSv: `När ${indicatorA} ökade under denna period, ökade också ${indicatorB} ofta.`,
    
    consistency_text: `This pattern is visible in ${yearsMatched} of ${totalYears} years.`,
    consistency_textSv: `Detta mönster syns i ${yearsMatched} av ${totalYears} år.`,
    
    exceptions_text: hasExceptions 
      ? 'There are also periods where the pattern does not appear.'
      : 'The pattern is consistent across the period.',
    exceptions_textSv: hasExceptions
      ? 'Det finns också perioder där sambandet inte syns.'
      : 'Mönstret är konsekvent under perioden.',
    
    causation_warning: 'This does not mean that one causes the other.',
    causation_warningSv: 'Detta betyder inte att det ena orsakar det andra.',
  };
}

// FORBIDDEN: Never show raw correlation coefficients in UI
export const FORBIDDEN_STATISTICAL_TERMS = [
  'correlation coefficient',
  'korrelationskoefficient',
  'r-value',
  'r-värde',
  'p-value',
  'p-värde',
  'statistical significance',
  'statistisk signifikans',
  'regression',
  'regression',
  'R²',
  'R-squared',
  'standard deviation',
  'standardavvikelse',
  'variance',
  'varians',
];

// ═══════════════════════════════════════════════════════════════
// BLOCK PE — "WHAT ELSE MOVED?"
// ═══════════════════════════════════════════════════════════════

export interface RelatedMovement {
  indicator: DataIndicator;
  similarity: 'high' | 'medium' | 'low';
  direction: 'same' | 'opposite';
}

export const WHAT_ELSE_MOVED_FRAMING = {
  intro_sv: 'Under samma period rörde sig även dessa datapunkter på liknande sätt:',
  intro_en: 'During the same period, these data points also moved similarly:',
  
  disclaimer_sv: 'Visas eftersom de ofta rör sig samtidigt, inte för att de orsakar.',
  disclaimer_en: 'Shown because they often move together, not because they cause.',
  
  explore_sv: 'Utforska detta samband',
  explore_en: 'Explore this relationship',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK PF — LEARNING MOMENTS
// ═══════════════════════════════════════════════════════════════

export interface LearningMoment {
  id: string;
  trigger: string; // When to show this learning moment
  message: string;
  messageSv: string;
  learn_more: string;
  learn_moreSv: string;
  link_text: string;
  link_textSv: string;
}

export const LEARNING_MOMENTS: LearningMoment[] = [
  {
    id: 'recurring_pattern',
    trigger: 'strong_correlation_detected',
    message: 'This is an example of a recurring pattern. Similar patterns have been observed in other countries/periods.',
    messageSv: 'Detta är ett exempel på ett återkommande mönster. Liknande mönster har observerats i andra länder/perioder.',
    learn_more: 'Would you like to see other examples?',
    learn_moreSv: 'Vill du se andra exempel?',
    link_text: 'Show other examples',
    link_textSv: 'Visa andra exempel',
  },
  {
    id: 'time_lag',
    trigger: 'timing_pattern_detected',
    message: 'Notice how the change in one appears before the other. This could indicate a delayed relationship, but many factors could explain this.',
    messageSv: 'Lägg märke till hur förändringen i den ena kommer före den andra. Detta kan indikera ett fördröjt samband, men många faktorer kan förklara detta.',
    learn_more: 'Learn about time lags in data',
    learn_moreSv: 'Lär dig om tidsfördröjning i data',
    link_text: 'Read more',
    link_textSv: 'Läs mer',
  },
  {
    id: 'exception_period',
    trigger: 'exception_detected',
    message: 'The pattern breaks here. When patterns have exceptions, it often means other factors are involved.',
    messageSv: 'Mönstret bryts här. När mönster har undantag betyder det ofta att andra faktorer är inblandade.',
    learn_more: 'Why do patterns have exceptions?',
    learn_moreSv: 'Varför har mönster undantag?',
    link_text: 'Explore',
    link_textSv: 'Utforska',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK PG — DECISION ANNOTATIONS (FAKTA)
// ═══════════════════════════════════════════════════════════════

export interface DecisionAnnotation {
  date: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  source: string;
  related_indicators: string[];
}

export const DECISION_ANNOTATION_FRAMING = {
  prefix_sv: 'Under denna period fattades beslut relaterade till',
  prefix_en: 'During this period, decisions related to',
  
  no_evaluation_note_sv: 'Systemet visar när beslut fattades, inte hur de påverkade.',
  no_evaluation_note_en: 'The system shows when decisions were made, not how they affected.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK PH — MISINTERPRETATION GUARD (STÄNDIGT SYNLIG)
// ═══════════════════════════════════════════════════════════════

export const MISINTERPRETATION_GUARD = {
  always_visible: true,
  
  warning: {
    icon: '⚠️',
    text_sv: `Detta är observerade samband över tid.
Samband kan påverkas av andra faktorer.
Systemet visar mönster, inte orsaker.`,
    text_en: `These are observed relationships over time.
Relationships can be affected by other factors.
The system shows patterns, not causes.`,
  },
  
  position: 'bottom_fixed',
  style: 'subtle_but_clear',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK PI — SPARA & DELA (UTAN MANIPULATION)
// ═══════════════════════════════════════════════════════════════

export interface ShareableComparison {
  id: string;
  created_at: string;
  
  // Data
  indicators: string[];
  regions: string[];
  time_range: [number, number];
  
  // Always included in share
  method_description: string;
  uncertainty_note: string;
  warning_text: string;
  
  // Metadata
  share_url: string;
}

export const SHARE_REQUIREMENTS = {
  must_include: [
    'data_sources',
    'time_period',
    'methodology_description',
    'uncertainty_indicators',
    'misinterpretation_warning',
  ],
  
  share_message_template_sv: `Jämförelse: {indicators}
Period: {time_range}
Källa: NOGF Data
⚠️ Visar samband, inte orsaker.`,

  share_message_template_en: `Comparison: {indicators}
Period: {time_range}
Source: NOGF Data
⚠️ Shows patterns, not causes.`,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK PJ — "WHAT DID WE LEARN HERE?"
// ═══════════════════════════════════════════════════════════════

export interface SessionSummary {
  indicators_compared: string[];
  time_period: string;
  
  observations: Array<{
    text_sv: string;
    text_en: string;
  }>;
  
  caveats: Array<{
    text_sv: string;
    text_en: string;
  }>;
}

export function generateSessionSummary(
  indicatorA: string,
  indicatorB: string,
  period: string,
  patternStrength: 'strong' | 'moderate' | 'weak' | 'none',
  otherFactors: string[]
): SessionSummary {
  const observations: Array<{ text_sv: string; text_en: string }> = [];
  const caveats: Array<{ text_sv: string; text_en: string }> = [];
  
  if (patternStrength === 'strong') {
    observations.push({
      text_sv: `${indicatorA} och ${indicatorB} rörde sig ofta samtidigt under period ${period}`,
      text_en: `${indicatorA} and ${indicatorB} often moved together during ${period}`,
    });
  } else if (patternStrength === 'moderate') {
    observations.push({
      text_sv: `Ett måttligt samband syntes mellan ${indicatorA} och ${indicatorB}`,
      text_en: `A moderate relationship was visible between ${indicatorA} and ${indicatorB}`,
    });
  } else if (patternStrength === 'weak') {
    observations.push({
      text_sv: `Sambandet var svagt och varierade under perioden`,
      text_en: `The relationship was weak and varied across the period`,
    });
  } else {
    observations.push({
      text_sv: `Inget tydligt mönster kunde observeras`,
      text_en: `No clear pattern was observable`,
    });
  }
  
  if (otherFactors.length > 0) {
    caveats.push({
      text_sv: `Flera andra faktorer förändrades också: ${otherFactors.join(', ')}`,
      text_en: `Several other factors also changed: ${otherFactors.join(', ')}`,
    });
  }
  
  caveats.push({
    text_sv: 'Observerade mönster innebär inte orsakssamband',
    text_en: 'Observed patterns do not imply causation',
  });
  
  return {
    indicators_compared: [indicatorA, indicatorB],
    time_period: period,
    observations,
    caveats,
  };
}

export const SESSION_SUMMARY_INTRO = {
  sv: 'I denna jämförelse såg vi att:',
  en: 'In this comparison we saw that:',
} as const;

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const CORRELATION_LEARNING_CANVAS_SYSTEM = {
  name: 'Correlation & Learning Canvas',
  acronym: 'CLC',
  version: '1.0',
  
  core_principle: CLC_CORE_PRINCIPLE,
  
  blocks: {
    PA: 'Learning Canvas (3-part main view)',
    PB: 'Data Picker (extremely simple)',
    PC: 'Visualization (no magic)',
    PD: 'Correlation Explanation (text, not numbers)',
    PE: '"What Else Moved?"',
    PF: 'Learning Moments',
    PG: 'Decision Annotations (facts only)',
    PH: 'Misinterpretation Guard (always visible)',
    PI: 'Save & Share (without manipulation)',
    PJ: '"What Did We Learn Here?"',
  },
  
  ui_requirements: {
    no_statistical_terms: true,
    drag_and_drop: true,
    everything_clickable: true,
    thirty_second_test: true,
  },
  
  safety_features: {
    causation_warnings: 'always_visible',
    context_in_shares: 'mandatory',
    forbidden_terms: FORBIDDEN_STATISTICAL_TERMS,
  },
  
  description: 'Arbetsytan där människor själva ser mönster utan att systemet påstår orsak.',
} as const;
