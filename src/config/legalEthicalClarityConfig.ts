/**
 * LEGAL, ETHICAL & CLARITY FRAMEWORK (LECF)
 * 
 * "Maximal tydlighet utan normativa påståenden."
 * 
 * Språk- och presentationsmotorn som allt annat måste passera igenom.
 */

// === 1. GRUNDPRINCIPER (OBRYTBARA) ===

export interface CorePrinciple {
  id: string;
  order: number;
  principle: string;
  principleSv: string;
  description: string;
  descriptionSv: string;
}

export const CORE_PRINCIPLES: CorePrinciple[] = [
  {
    id: 'describe_not_prescribe',
    order: 1,
    principle: 'The system describes – it does not prescribe',
    principleSv: 'Systemet beskriver – det föreskriver inte',
    description: 'All outputs are descriptive observations, never recommendations or value judgments',
    descriptionSv: 'Alla utdata är beskrivande observationer, aldrig rekommendationer eller värdeomdömen'
  },
  {
    id: 'correlation_not_blame',
    order: 2,
    principle: 'The system shows correlation – not blame',
    principleSv: 'Systemet visar samband – inte skuld',
    description: 'Covariation is presented as pattern observation, never as causal attribution',
    descriptionSv: 'Samvariation presenteras som mönsterobservation, aldrig som orsaksattribuering'
  },
  {
    id: 'aggregate_never_individual',
    order: 3,
    principle: 'The system aggregates – never individualizes',
    principleSv: 'Systemet aggregerar – aldrig individualiserar',
    description: 'All data represents statistical patterns, never individual cases or behaviors',
    descriptionSv: 'All data representerar statistiska mönster, aldrig enskilda fall eller beteenden'
  },
  {
    id: 'uncertainty_equals_level',
    order: 4,
    principle: 'Uncertainty is shown as clearly as level',
    principleSv: 'Systemet redovisar osäkerhet lika tydligt som nivå',
    description: 'Every data point includes its confidence interval and limitations',
    descriptionSv: 'Varje datapunkt inkluderar sitt konfidensintervall och sina begränsningar'
  },
  {
    id: 'global_consistency',
    order: 5,
    principle: 'The system is globally consistent',
    principleSv: 'Systemet är konsekvent globalt',
    description: 'Same methodology and language standards apply across all countries',
    descriptionSv: 'Samma metodologi och språkstandarder gäller i alla länder'
  }
];

// === 2. STANDARDSPRÅK (TEXTMALL) ===

export interface TextTemplate {
  section: 'what_is_shown' | 'data_construction' | 'interpretation' | 'limitations';
  label: string;
  labelSv: string;
  template: string;
  templateSv: string;
}

export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    section: 'what_is_shown',
    label: 'What is shown',
    labelSv: 'Vad visas',
    template: 'This view shows the development of {indicator} over time in {geography}.',
    templateSv: 'Denna vy visar utvecklingen av {indicator} över tid i {geography}.'
  },
  {
    section: 'data_construction',
    label: 'How data is constructed',
    labelSv: 'Hur datan är konstruerad',
    template: 'The indicator is based on reported data from {source} and is aggregated at {level} level.',
    templateSv: 'Indikatorn baseras på rapporterad data från {source} och är aggregerad på {level}-nivå.'
  },
  {
    section: 'interpretation',
    label: 'How it can be interpreted',
    labelSv: 'Hur det kan tolkas',
    template: 'Simultaneous change may indicate covariation, but not causation.',
    templateSv: 'Samtidig förändring kan indikera samvariation, men inte orsak.'
  },
  {
    section: 'limitations',
    label: 'Limitations',
    labelSv: 'Begränsningar',
    template: 'Other factors may affect the outcome.',
    templateSv: 'Andra faktorer kan påverka utfallet.'
  }
];

// === 3. KÄNSLIGA VARIABLER ===

export type SensitiveVariableType = 'gender' | 'ethnicity' | 'immigration' | 'crime';

export interface SensitiveVariableConfig {
  type: SensitiveVariableType;
  icon: string;
  label: string;
  labelSv: string;
  rules: string[];
  rulesSv: string[];
  forbidden: string[];
  forbiddenSv: string[];
  standardText: string;
  standardTextSv: string;
}

export const SENSITIVE_VARIABLES: SensitiveVariableConfig[] = [
  {
    type: 'gender',
    icon: '👤',
    label: 'Gender',
    labelSv: 'Kön',
    rules: [
      'Only when relevant for outcome',
      'Always binary + "other/unknown" according to data source',
      'No normative interpretation'
    ],
    rulesSv: [
      'Endast när relevant för utfall',
      'Alltid binärt + "annan/okänd" enligt datakälla',
      'Ingen normativ tolkning'
    ],
    forbidden: [
      'Gendered value judgments',
      'Biological determinism claims',
      'Stereotyping language'
    ],
    forbiddenSv: [
      'Könsbaserade värdeomdömen',
      'Biologisk determinism',
      'Stereotypiserande språk'
    ],
    standardText: 'Differences between groups may be affected by several structural factors.',
    standardTextSv: 'Skillnader mellan grupper kan påverkas av flera strukturella faktorer.'
  },
  {
    type: 'ethnicity',
    icon: '🌍',
    label: 'Ethnicity / Origin',
    labelSv: 'Etnicitet / Ursprung',
    rules: [
      'Never use biological concepts',
      'Use only administrative definitions (e.g., country of birth, citizenship)',
      'Report exactly how groups are defined'
    ],
    rulesSv: [
      'Använder aldrig biologiska begrepp',
      'Använder endast administrativa definitioner (t.ex. födelseland, medborgarskap)',
      'Redovisar exakt hur grupper definieras'
    ],
    forbidden: [
      'Racial categorizations',
      'Cultural generalizations',
      'Group-based attributions'
    ],
    forbiddenSv: [
      'Raskategoriseringar',
      'Kulturella generaliseringar',
      'Grupptillskrivningar'
    ],
    standardText: 'Groups are defined according to official statistics and do not represent individual characteristics.',
    standardTextSv: 'Grupperna definieras enligt officiell statistik och representerar inte individuella egenskaper.'
  },
  {
    type: 'immigration',
    icon: '✈️',
    label: 'Immigration',
    labelSv: 'Invandring',
    rules: [
      'Always split into: flow (per year), stock (share), cohorts (time in country)',
      'Never merged concepts',
      'Never loaded words'
    ],
    rulesSv: [
      'Alltid uppdelat i: flöde (per år), stock (andel), kohorter (tid i landet)',
      'Aldrig sammanslagna begrepp',
      'Aldrig laddade ord'
    ],
    forbidden: [
      '"Wave"',
      '"Flood"',
      '"Invasion"',
      '"Crisis" (without definition)',
      'Group-specific prejudices'
    ],
    forbiddenSv: [
      '"Våg"',
      '"Flod"',
      '"Invasion"',
      '"Kris" (utan definition)',
      'Gruppspecifika fördomar'
    ],
    standardText: 'Immigration is a demographic change that affects multiple societal systems simultaneously.',
    standardTextSv: 'Invandring är en demografisk förändring som påverkar flera samhällssystem samtidigt.'
  },
  {
    type: 'crime',
    icon: '⚖️',
    label: 'Violence & Crime',
    labelSv: 'Våld & Brott',
    rules: [
      'Strictly distinguish reported, solved, deadly',
      'Report legislative changes and reporting practices',
      'Show per capita, not absolute numbers'
    ],
    rulesSv: [
      'Skiljer strikt på anmält, uppklarat, dödligt',
      'Redovisar lagändringar och rapporteringspraxis',
      'Visar per capita, inte absoluta tal'
    ],
    forbidden: [
      'Group-based crime attribution',
      'Sensationalist framing',
      'Implied causation'
    ],
    forbiddenSv: [
      'Gruppbaserad brottstillskrivning',
      'Sensationalistisk inramning',
      'Underförstådd kausalitet'
    ],
    standardText: 'Changes in statistics can be affected by both actual criminality and reporting.',
    standardTextSv: 'Förändringar i statistik kan påverkas av både faktisk brottslighet och rapportering.'
  }
];

// === 4. "NO BLAME"-ARKITEKTUR ===

export const FORBIDDEN_LANGUAGE = {
  causalClaims: [
    'leads to', 'causes', 'results in', 'is due to', 'because of',
    'leder till', 'orsakar', 'resulterar i', 'beror på', 'på grund av'
  ],
  blamingPatterns: [
    'X is responsible for', 'X creates', 'X destroys',
    'X är ansvarig för', 'X skapar', 'X förstör'
  ],
  groupGeneralizations: [
    'all X', 'X always', 'X never', 'typical X',
    'alla X', 'X alltid', 'X aldrig', 'typisk X'
  ]
};

export const ALLOWED_LANGUAGE = {
  correlational: [
    { en: 'covaries with', sv: 'samvarierar med' },
    { en: 'coincides in time with', sv: 'sammanfaller i tid med' },
    { en: 'develops in parallel with', sv: 'utvecklas parallellt med' },
    { en: 'is observed alongside', sv: 'observeras tillsammans med' },
    { en: 'shows similar patterns to', sv: 'visar liknande mönster som' }
  ],
  temporal: [
    { en: 'during the same period', sv: 'under samma period' },
    { en: 'over the observed timeframe', sv: 'under den observerade tidsramen' },
    { en: 'concurrently', sv: 'samtidigt' }
  ],
  uncertainty: [
    { en: 'may indicate', sv: 'kan indikera' },
    { en: 'suggests possible', sv: 'antyder möjlig' },
    { en: 'appears to be associated with', sv: 'verkar vara associerat med' }
  ]
};

// === 5. KONTEXTAUTOMATIK ===

export interface ContextWarning {
  trigger: 'short_period' | 'small_area' | 'extreme_values' | 'low_sample';
  condition: string;
  conditionSv: string;
  warning: string;
  warningSv: string;
  severity: 'info' | 'caution' | 'warning';
}

export const CONTEXT_WARNINGS: ContextWarning[] = [
  {
    trigger: 'short_period',
    condition: 'Time period less than 10 years',
    conditionSv: 'Tidsperiod kortare än 10 år',
    warning: 'Short time periods may amplify random variation.',
    warningSv: 'Korta tidsperioder kan förstärka slumpvariation.',
    severity: 'caution'
  },
  {
    trigger: 'small_area',
    condition: 'Geographic level below regional',
    conditionSv: 'Geografisk nivå under regional',
    warning: 'Small areas are more sensitive to random variation.',
    warningSv: 'Små områden är mer känsliga för slumpvariation.',
    severity: 'caution'
  },
  {
    trigger: 'extreme_values',
    condition: 'Values in top/bottom 5%',
    conditionSv: 'Värden i topp/botten 5%',
    warning: 'Extreme values may represent statistical outliers.',
    warningSv: 'Extrema värden kan representera statistiska avvikare.',
    severity: 'info'
  },
  {
    trigger: 'low_sample',
    condition: 'Sample size below threshold',
    conditionSv: 'Urvalsstorlek under tröskelvärde',
    warning: 'Small samples increase statistical uncertainty.',
    warningSv: 'Små urval ökar statistisk osäkerhet.',
    severity: 'warning'
  }
];

// === 6. DISCLAIMER-MODELL ===

export interface MicroDisclaimer {
  id: string;
  context: string[];
  text: string;
  textSv: string;
}

export const MICRO_DISCLAIMERS: MicroDisclaimer[] = [
  {
    id: 'correlation_not_causation',
    context: ['comparison', 'correlation', 'trend'],
    text: 'Covariation ≠ causation',
    textSv: 'Samvariation ≠ orsak'
  },
  {
    id: 'aggregate_data',
    context: ['group', 'demographic', 'category'],
    text: 'Aggregate patterns, not individuals',
    textSv: 'Aggregerade mönster, inte individer'
  },
  {
    id: 'reporting_changes',
    context: ['crime', 'health', 'social'],
    text: 'May be affected by reporting practices',
    textSv: 'Kan påverkas av rapporteringspraxis'
  },
  {
    id: 'definition_varies',
    context: ['international', 'comparison', 'cross-country'],
    text: 'Definitions may vary between countries',
    textSv: 'Definitioner kan variera mellan länder'
  },
  {
    id: 'data_lag',
    context: ['recent', 'current', 'latest'],
    text: 'Most recent data may be preliminary',
    textSv: 'Senaste data kan vara preliminär'
  }
];

// === 7. GLOBAL ÖVERSÄTTNINGSSTANDARD ===

export interface CanonicalTerm {
  id: string;
  canonical: string;
  canonicalSv: string;
  definition: string;
  definitionSv: string;
  doNotTranslateAs: string[];
}

export const CANONICAL_TERMS: CanonicalTerm[] = [
  {
    id: 'foreign_born',
    canonical: 'Born abroad',
    canonicalSv: 'Utrikes född',
    definition: 'Person registered as born outside the current country of residence',
    definitionSv: 'Person registrerad som född utanför nuvarande bosättningsland',
    doNotTranslateAs: ['immigrant', 'foreigner', 'alien']
  },
  {
    id: 'unemployment',
    canonical: 'Unemployment rate',
    canonicalSv: 'Arbetslöshet',
    definition: 'Share of labor force without employment, according to ILO definition',
    definitionSv: 'Andel av arbetskraften utan anställning, enligt ILO:s definition',
    doNotTranslateAs: ['jobless', 'out of work']
  },
  {
    id: 'violent_crime',
    canonical: 'Reported violent crime',
    canonicalSv: 'Anmälda våldsbrott',
    definition: 'Crimes against person reported to authorities',
    definitionSv: 'Brott mot person anmälda till myndigheter',
    doNotTranslateAs: ['violence', 'crime wave', 'crime epidemic']
  }
];

// === 8. ETISK BACKSTOP ===

export const ETHICAL_BACKSTOP = {
  principle: {
    en: 'This system shows structural patterns.\nIt does not describe individuals and does not attribute responsibility to groups.',
    sv: 'Detta system visar strukturella mönster.\nDet beskriver inte individer och tillskriver inte ansvar till grupper.'
  },
  protection: {
    user: {
      en: 'Protects you from drawing unfounded conclusions',
      sv: 'Skyddar dig från att dra ogrundade slutsatser'
    },
    platform: {
      en: 'Ensures platform neutrality and legal compliance',
      sv: 'Säkerställer plattformsneutralitet och juridisk efterlevnad'
    },
    society: {
      en: 'Supports fact-based public discourse',
      sv: 'Stödjer faktabaserad offentlig debatt'
    }
  }
};

// === UTILITY FUNCTIONS ===

/**
 * Generate standard text for an indicator view
 */
export const generateStandardText = (
  indicator: string,
  geography: string,
  source: string,
  level: string,
  lang: 'en' | 'sv' = 'sv'
): Record<string, string> => {
  const templates = TEXT_TEMPLATES;
  
  return {
    whatIsShown: templates.find(t => t.section === 'what_is_shown')?.[lang === 'sv' ? 'templateSv' : 'template']
      ?.replace('{indicator}', indicator)
      .replace('{geography}', geography) || '',
    dataConstruction: templates.find(t => t.section === 'data_construction')?.[lang === 'sv' ? 'templateSv' : 'template']
      ?.replace('{source}', source)
      .replace('{level}', level) || '',
    interpretation: templates.find(t => t.section === 'interpretation')?.[lang === 'sv' ? 'templateSv' : 'template'] || '',
    limitations: templates.find(t => t.section === 'limitations')?.[lang === 'sv' ? 'templateSv' : 'template'] || ''
  };
};

/**
 * Check if text contains forbidden language
 */
export const containsForbiddenLanguage = (text: string): { hasForbidden: boolean; matches: string[] } => {
  const lowerText = text.toLowerCase();
  const matches: string[] = [];
  
  [...FORBIDDEN_LANGUAGE.causalClaims, ...FORBIDDEN_LANGUAGE.blamingPatterns, ...FORBIDDEN_LANGUAGE.groupGeneralizations]
    .forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        matches.push(phrase);
      }
    });
  
  return { hasForbidden: matches.length > 0, matches };
};

/**
 * Get appropriate context warnings based on view parameters
 */
export const getContextWarnings = (params: {
  yearSpan?: number;
  geoLevel?: 'national' | 'regional' | 'municipal' | 'local';
  isExtreme?: boolean;
  sampleSize?: number;
}): ContextWarning[] => {
  const warnings: ContextWarning[] = [];
  
  if (params.yearSpan && params.yearSpan < 10) {
    warnings.push(CONTEXT_WARNINGS.find(w => w.trigger === 'short_period')!);
  }
  if (params.geoLevel && ['municipal', 'local'].includes(params.geoLevel)) {
    warnings.push(CONTEXT_WARNINGS.find(w => w.trigger === 'small_area')!);
  }
  if (params.isExtreme) {
    warnings.push(CONTEXT_WARNINGS.find(w => w.trigger === 'extreme_values')!);
  }
  if (params.sampleSize && params.sampleSize < 100) {
    warnings.push(CONTEXT_WARNINGS.find(w => w.trigger === 'low_sample')!);
  }
  
  return warnings;
};

/**
 * Get relevant micro-disclaimers for a context
 */
export const getRelevantDisclaimers = (contexts: string[]): MicroDisclaimer[] => {
  return MICRO_DISCLAIMERS.filter(d => 
    d.context.some(c => contexts.includes(c))
  );
};

/**
 * Get standard text for a sensitive variable
 */
export const getSensitiveVariableText = (
  type: SensitiveVariableType,
  lang: 'en' | 'sv' = 'sv'
): string => {
  const config = SENSITIVE_VARIABLES.find(v => v.type === type);
  return config?.[lang === 'sv' ? 'standardTextSv' : 'standardText'] || '';
};
