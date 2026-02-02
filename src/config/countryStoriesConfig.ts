/**
 * MODULE — COMPARATIVE COUNTRY STORIES (CCS)
 * "Visa vad som hände – inte vad man borde tycka om det."
 * 
 * Faktabaserade händelsekedjor, byggda på data, tidslinjer och kontext.
 * Inga slutsatser. Inga rekommendationer. Bara observerbara mönster.
 * 
 * SYSTEMFRÅGA:
 * "Vad förändrades i land A under period X, och vilka mätbara utfall följde 
 * – jämfört med liknande länder som inte förändrade samma sak?"
 */

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP
// ═══════════════════════════════════════════════════════════════

export const CCS_CORE_PRINCIPLE = {
  statement: 'Berättelser är hur människor förstår världen. Systemets jobb är att se till att berättelserna är sanna, jämförbara och kompletta.',
  statementEn: 'Stories are how people understand the world. The system\'s job is to ensure stories are true, comparable, and complete.',
  enforced: true,
  
  selection_rule: 'System never selects "good" or "bad" examples – only clear ones.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK RA — STORY GENERATOR ENGINE
// ═══════════════════════════════════════════════════════════════

export interface CountryStory {
  id: string;
  country: CountryContext;
  shift: PolicyShift;
  period: TimePeriod;
  comparisonGroup: ComparisonGroup;
  outcomes: StoryOutcomes;
  limitations: StoryLimitations;
  generatedAt: string;
  dataVersion: string;
}

export interface CountryContext {
  code: string;
  name: string;
  nameSv: string;
  startingPosition: ContextFactor[];
  structuralFactors: ContextFactor[];
  differentiatingFactors: string[];
}

export interface ContextFactor {
  name: string;
  nameSv: string;
  value: number | string;
  unit?: string;
  year: number;
  source: string;
}

export interface PolicyShift {
  id: string;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  type: ShiftType;
  dateStart: string;
  dateEnd?: string;
  scope: 'national' | 'regional' | 'sectoral';
  magnitude: 'minor' | 'moderate' | 'major' | 'transformational';
  sourceDocuments: string[];
}

export type ShiftType = 
  | 'policy_reform'
  | 'economic_shock'
  | 'institutional_change'
  | 'demographic_shift'
  | 'external_event'
  | 'technological_change';

export const SHIFT_TYPE_LABELS: Record<ShiftType, { en: string; sv: string }> = {
  policy_reform: { en: 'Policy reform', sv: 'Policyreform' },
  economic_shock: { en: 'Economic shock', sv: 'Ekonomisk chock' },
  institutional_change: { en: 'Institutional change', sv: 'Institutionell förändring' },
  demographic_shift: { en: 'Demographic shift', sv: 'Demografisk förändring' },
  external_event: { en: 'External event', sv: 'Extern händelse' },
  technological_change: { en: 'Technological change', sv: 'Teknologisk förändring' },
};

export interface TimePeriod {
  before: { start: string; end: string };
  after: { start: string; end: string };
  observationEnd: string;
  isOngoing: boolean;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK RB — STORY STRUCTURE (ALLA SER LIKADANA UT)
// ═══════════════════════════════════════════════════════════════

export const STORY_STRUCTURE = {
  sections: [
    {
      id: 'context',
      title: 'Context',
      titleSv: 'Kontext',
      description: 'Country starting position and structural factors',
      descriptionSv: 'Landets utgångsläge och strukturella faktorer',
      required: true,
    },
    {
      id: 'what_changed',
      title: 'What changed?',
      titleSv: 'Vad förändrades?',
      description: 'Neutral description of the change',
      descriptionSv: 'Neutral beskrivning av förändringen',
      required: true,
    },
    {
      id: 'what_happened',
      title: 'What happened after?',
      titleSv: 'Vad hände efteråt?',
      description: 'Observable outcomes with timeline',
      descriptionSv: 'Observerbara utfall med tidslinje',
      required: true,
    },
    {
      id: 'comparison',
      title: 'Comparison',
      titleSv: 'Jämförelse',
      description: 'Similar countries/regions, same period, same metrics',
      descriptionSv: 'Liknande länder/regioner, samma period, samma mätvärden',
      required: true,
    },
    {
      id: 'observations',
      title: 'What can be observed?',
      titleSv: 'Vad kan man observera?',
      description: 'Patterns, similarities, and uncertainties',
      descriptionSv: 'Mönster, likheter och osäkerheter',
      required: true,
    },
  ],
  
  closingStatement: {
    sv: 'Detta tyder på ett samband i denna kontext, men andra faktorer kan ha påverkat utfallet.',
    en: 'This suggests a relationship in this context, but other factors may have influenced the outcome.',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK RC — MULTIPLE OUTCOMES VIEW
// ═══════════════════════════════════════════════════════════════

export interface StoryOutcomes {
  primary: OutcomeObservation[];
  secondary: OutcomeObservation[];
  unintended: OutcomeObservation[];
}

export interface OutcomeObservation {
  id: string;
  indicator: string;
  indicatorSv: string;
  direction: 'increase' | 'decrease' | 'stable' | 'volatile';
  magnitude: number;
  confidence: number;
  timeLag: TimeLagInfo;
  dataPoints: DataPoint[];
  comparisonValues?: ComparisonValue[];
}

export interface DataPoint {
  date: string;
  value: number;
  isProjected?: boolean;
}

export interface ComparisonValue {
  countryCode: string;
  countryName: string;
  value: number;
  date: string;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK RD — TIME & LAG EXPLICIT
// ═══════════════════════════════════════════════════════════════

export interface TimeLagInfo {
  months: number;
  certainty: 'high' | 'medium' | 'low';
  fullEffectObserved: boolean;
  note?: string;
  noteSv?: string;
}

export const TIME_LAG_DISPLAY = {
  template_sv: 'Effekter började synas efter ca {months} månader/år.',
  template_en: 'Effects became visible after approximately {months} months/years.',
  
  not_observed_sv: 'Full effekt osäker / ej observerad ännu.',
  not_observed_en: 'Full effect uncertain / not yet observed.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK RE — "WHERE THIS STORY DOES NOT APPLY"
// ═══════════════════════════════════════════════════════════════

export interface StoryLimitations {
  structuralDifferences: LimitationFactor[];
  contextDependencies: string[];
  dataLimitations: string[];
  generalizabilityNote: string;
  generalizabilityNoteSv: string;
}

export interface LimitationFactor {
  factor: string;
  factorSv: string;
  explanation: string;
  explanationSv: string;
  affectedCountries?: string[];
}

// ═══════════════════════════════════════════════════════════════
// BLOCK RF — STORY NAVIGATION
// ═══════════════════════════════════════════════════════════════

export interface StoryNavigationState {
  selectedCountry: string;
  selectedPeriod: TimePeriod;
  comparisonGroup: string[];
  selectedIndicators: string[];
}

export interface ComparisonGroup {
  id: string;
  name: string;
  nameSv: string;
  countries: string[];
  criteria: string[];
  criteriaSv: string[];
}

export const DEFAULT_COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    id: 'nordic',
    name: 'Nordic countries',
    nameSv: 'Nordiska länder',
    countries: ['SE', 'NO', 'DK', 'FI', 'IS'],
    criteria: ['Similar welfare models', 'High institutional capacity'],
    criteriaSv: ['Liknande välfärdsmodeller', 'Hög institutionell kapacitet'],
  },
  {
    id: 'eu_similar_gdp',
    name: 'EU countries with similar GDP',
    nameSv: 'EU-länder med liknande BNP',
    countries: ['DE', 'NL', 'BE', 'AT', 'FR'],
    criteria: ['Similar GDP per capita', 'EU membership'],
    criteriaSv: ['Liknande BNP per capita', 'EU-medlemskap'],
  },
  {
    id: 'oecd_advanced',
    name: 'Advanced OECD economies',
    nameSv: 'Avancerade OECD-ekonomier',
    countries: ['DE', 'FR', 'UK', 'JP', 'CA', 'AU'],
    criteria: ['High development level', 'OECD membership'],
    criteriaSv: ['Hög utvecklingsnivå', 'OECD-medlemskap'],
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK RG — MISUSE PROTECTION
// ═══════════════════════════════════════════════════════════════

export const MISUSE_PROTECTION = {
  always_visible_warning: {
    sv: '⚠️ Denna jämförelse visar observerade skillnader, inte bevis för orsak eller universell lösning.',
    en: '⚠️ This comparison shows observed differences, not proof of cause or universal solution.',
  },
  
  share_includes_warning: true,
  
  forbidden_framings: [
    'proves that',
    'demonstrates the superiority of',
    'shows we should',
    'the right approach',
    'the wrong approach',
    'failure of',
    'success of',
  ],
  
  required_context_for_sharing: [
    'comparison_group',
    'time_period',
    'data_sources',
    'limitations',
    'warning_text',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// EXAMPLE STORIES
// ═══════════════════════════════════════════════════════════════

export const EXAMPLE_STORIES: CountryStory[] = [
  {
    id: 'sweden-energy-transition-2020',
    country: {
      code: 'SE',
      name: 'Sweden',
      nameSv: 'Sverige',
      startingPosition: [
        { name: 'Renewable share', nameSv: 'Förnybar andel', value: 54.6, unit: '%', year: 2019, source: 'Eurostat' },
        { name: 'Nuclear share', nameSv: 'Kärnkraftsandel', value: 34.2, unit: '%', year: 2019, source: 'Energimyndigheten' },
      ],
      structuralFactors: [
        { name: 'Hydropower capacity', nameSv: 'Vattenkraftskapacitet', value: 'High', year: 2019, source: 'IEA' },
        { name: 'Grid interconnection', nameSv: 'Nätinterkonnektion', value: 'Strong Nordic', year: 2019, source: 'ENTSO-E' },
      ],
      differentiatingFactors: [
        'Already high renewable base',
        'Strong grid connections to neighbors',
        'Low population density',
      ],
    },
    shift: {
      id: 'se-energy-policy-2020',
      title: 'Accelerated renewable energy targets',
      titleSv: 'Accelererade mål för förnybar energi',
      description: 'Sweden set new targets for 100% renewable electricity by 2040.',
      descriptionSv: 'Sverige satte nya mål för 100% förnybar el till 2040.',
      type: 'policy_reform',
      dateStart: '2020-01-01',
      scope: 'national',
      magnitude: 'major',
      sourceDocuments: ['Government Energy Agreement 2016', 'Climate Policy Framework'],
    },
    period: {
      before: { start: '2017-01-01', end: '2019-12-31' },
      after: { start: '2020-01-01', end: '2024-12-31' },
      observationEnd: '2024-12-31',
      isOngoing: true,
    },
    comparisonGroup: DEFAULT_COMPARISON_GROUPS[0],
    outcomes: {
      primary: [
        {
          id: 'renewable-share',
          indicator: 'Renewable electricity share',
          indicatorSv: 'Andel förnybar el',
          direction: 'increase',
          magnitude: 8.2,
          confidence: 0.9,
          timeLag: { months: 12, certainty: 'high', fullEffectObserved: false },
          dataPoints: [
            { date: '2019', value: 54.6 },
            { date: '2020', value: 56.1 },
            { date: '2021', value: 58.4 },
            { date: '2022', value: 60.2 },
            { date: '2023', value: 62.1 },
            { date: '2024', value: 62.8 },
          ],
        },
      ],
      secondary: [
        {
          id: 'electricity-price',
          indicator: 'Electricity price variability',
          indicatorSv: 'Elprisvariabilitet',
          direction: 'volatile',
          magnitude: 45,
          confidence: 0.7,
          timeLag: { months: 24, certainty: 'medium', fullEffectObserved: false },
          dataPoints: [],
        },
      ],
      unintended: [
        {
          id: 'regional-disparity',
          indicator: 'North-South price difference',
          indicatorSv: 'Prisskillnad nord-syd',
          direction: 'increase',
          magnitude: 120,
          confidence: 0.85,
          timeLag: { months: 18, certainty: 'high', fullEffectObserved: true },
          dataPoints: [],
        },
      ],
    },
    limitations: {
      structuralDifferences: [
        {
          factor: 'Existing hydropower base',
          factorSv: 'Befintlig vattenkraftsbas',
          explanation: 'Countries without significant hydropower face different challenges',
          explanationSv: 'Länder utan betydande vattenkraft möter andra utmaningar',
        },
      ],
      contextDependencies: [
        'Nordic market integration',
        'Existing grid infrastructure',
      ],
      dataLimitations: [
        'Ongoing policy - full effects not yet observable',
      ],
      generalizabilityNote: 'This pattern may not apply to countries with different energy mixes or grid structures.',
      generalizabilityNoteSv: 'Detta mönster kanske inte gäller länder med annan energimix eller nätstruktur.',
    },
    generatedAt: '2024-12-01',
    dataVersion: '2024.4',
  },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const COMPARATIVE_COUNTRY_STORIES_SYSTEM = {
  name: 'Comparative Country Stories',
  acronym: 'CCS',
  version: '1.0',
  
  core_principle: CCS_CORE_PRINCIPLE,
  
  blocks: {
    RA: 'Story Generator Engine',
    RB: 'Story Structure (standardized)',
    RC: 'Multiple Outcomes View',
    RD: 'Time & Lag Explicit',
    RE: '"Where This Story Does Not Apply"',
    RF: 'Story Navigation',
    RG: 'Misuse Protection',
    RH: 'Story Feed',
  },
  
  description: 'Datadriven verklighetsberättelse.',
} as const;
