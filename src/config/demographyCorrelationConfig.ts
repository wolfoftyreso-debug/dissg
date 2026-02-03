/**
 * Demographic Correlation Analysis Configuration
 * 
 * Statistical covariation framework for demographic and societal indicators.
 * High-sensitivity module requiring rigorous epistemic controls.
 */

// === 1. DEMOGRAPHIC INDICATORS ===

export interface DemographicIndicator {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  unit: string;
  category: 'flow' | 'stock' | 'structure';
}

export const DEMOGRAPHIC_INDICATORS: DemographicIndicator[] = [
  {
    id: 'total_immigration',
    name: 'Annual Immigration Volume',
    nameSv: 'Total invandring per år',
    description: 'Total number of persons immigrating during calendar year',
    unit: 'persons',
    category: 'flow'
  },
  {
    id: 'net_migration',
    name: 'Net Migration Balance',
    nameSv: 'Nettoinvandring',
    description: 'Immigration minus emigration (net population change from migration)',
    unit: 'persons',
    category: 'flow'
  },
  {
    id: 'foreign_born_share',
    name: 'Foreign-Born Population Share',
    nameSv: 'Andel utrikes födda',
    description: 'Percentage of population born outside the jurisdiction',
    unit: '%',
    category: 'stock'
  },
  {
    id: 'immigration_per_1000',
    name: 'Immigration Rate per 1,000',
    nameSv: 'Invandring per 1 000 invånare',
    description: 'Annual immigration relative to total population',
    unit: 'per 1,000',
    category: 'flow'
  },
  {
    id: 'age_distribution',
    name: 'Population Age Structure',
    nameSv: 'Åldersfördelning',
    description: 'Distribution of age cohorts in the population',
    unit: '%',
    category: 'structure'
  },
  {
    id: 'time_in_country',
    name: 'Residence Duration Cohorts',
    nameSv: 'Tid i landet (kohorter)',
    description: 'Distribution based on arrival year cohorts',
    unit: 'years',
    category: 'structure'
  }
];

// === 2. SOCIETAL OUTCOME METRICS ===

export interface SocietalOutcome {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  unit: string;
  category: 'crime' | 'labor' | 'education' | 'economy' | 'housing' | 'municipal';
  subTypes?: string[];
}

export const SOCIETAL_OUTCOMES: SocietalOutcome[] = [
  {
    id: 'violent_crime',
    name: 'Reported Violent Crime Rate',
    nameSv: 'Anmälda våldsbrott',
    description: 'Reported violent crime incidents per 100,000 population',
    unit: 'per 100,000',
    category: 'crime',
    subTypes: ['Assault', 'Robbery', 'Sexual offenses', 'Homicide']
  },
  {
    id: 'unemployment_total',
    name: 'Total Unemployment Rate',
    nameSv: 'Arbetslöshet (total)',
    description: 'Percentage of labor force without employment',
    unit: '%',
    category: 'labor'
  },
  {
    id: 'unemployment_youth',
    name: 'Youth Unemployment Rate',
    nameSv: 'Ungdomsarbetslöshet',
    description: 'Unemployment rate among persons aged 15-24',
    unit: '%',
    category: 'labor'
  },
  {
    id: 'unemployment_longterm',
    name: 'Long-Term Unemployment',
    nameSv: 'Långtidsarbetslöshet',
    description: 'Unemployed for more than 12 consecutive months',
    unit: '%',
    category: 'labor'
  },
  {
    id: 'employment_rate',
    name: 'Employment Rate',
    nameSv: 'Sysselsättningsgrad',
    description: 'Percentage of population aged 20-64 in employment',
    unit: '%',
    category: 'labor'
  },
  {
    id: 'education_outcomes',
    name: 'Educational Attainment',
    nameSv: 'Utbildningsutfall',
    description: 'Percentage achieving upper secondary qualification eligibility',
    unit: '%',
    category: 'education'
  },
  {
    id: 'income_distribution',
    name: 'Income Distribution Index',
    nameSv: 'Inkomstfördelning',
    description: 'Gini coefficient for income distribution',
    unit: 'index',
    category: 'economy'
  },
  {
    id: 'overcrowding',
    name: 'Housing Overcrowding Rate',
    nameSv: 'Trångboddhet',
    description: 'Percentage living in overcrowded housing conditions',
    unit: '%',
    category: 'housing'
  },
  {
    id: 'municipal_costs',
    name: 'Municipal Expenditure per Capita',
    nameSv: 'Kommunala kostnader',
    description: 'Municipal government cost per resident',
    unit: 'SEK/capita',
    category: 'municipal'
  }
];

// === 3. TIME PERIODS ===

export type TimePeriod = '5y' | '10y' | '20y' | 'max';

export interface TimePeriodOption {
  id: TimePeriod;
  label: string;
  labelSv: string;
  warning?: string;
}

export const TIME_PERIODS: TimePeriodOption[] = [
  { 
    id: '5y', 
    label: '5 years', 
    labelSv: '5 år',
    warning: 'Korta tidsperioder kan ge missvisande intryck.'
  },
  { 
    id: '10y', 
    label: '10 years', 
    labelSv: '10 år',
    warning: 'Korta tidsperioder kan ge missvisande intryck.'
  },
  { id: '20y', label: '20 years', labelSv: '20 år' },
  { id: 'max', label: 'All available data', labelSv: 'Så långt data finns' }
];

export const DEFAULT_TIME_PERIOD: TimePeriod = 'max';

// === 4. GEOGRAPHIC LEVELS ===

export type GeoLevel = 'national' | 'regional' | 'municipal';

export interface GeoLevelOption {
  id: GeoLevel;
  label: string;
  labelSv: string;
  warning?: string;
}

export const GEO_LEVELS: GeoLevelOption[] = [
  { id: 'national', label: 'National', labelSv: 'Nation' },
  { id: 'regional', label: 'Regional', labelSv: 'Region' },
  { 
    id: 'municipal', 
    label: 'Municipal', 
    labelSv: 'Kommun',
    warning: 'Små områden är känsligare för variation och slump.'
  }
];

// === 5. MANDATORY DISCLAIMERS ===

export const CORRELATION_DISCLAIMER = {
  sv: 'Denna vy visar hur två indikatorer har förändrats över tid.\nSamvariation betyder inte orsak.',
  en: 'This view shows how two indicators have changed over time.\nCovariation does not mean causation.'
};

export const WHAT_THIS_DOES_NOT_SHOW = {
  title: {
    sv: 'Detta visar inte',
    en: 'This does not show'
  },
  items: [
    { sv: 'individuellt beteende', en: 'individual behavior' },
    { sv: 'orsaker på individnivå', en: 'causes at individual level' },
    { sv: 'ansvar hos enskilda grupper', en: 'responsibility of specific groups' },
    { sv: 'framtida utveckling', en: 'future development' }
  ]
};

// === 6. CONTROL VARIABLES ===

export interface ControlVariable {
  id: string;
  name: string;
  nameSv: string;
  description: string;
}

export const CONTROL_VARIABLES: ControlVariable[] = [
  { id: 'population_size', name: 'Population size', nameSv: 'Befolkningsstorlek', description: 'Total befolkning i området' },
  { id: 'age_structure', name: 'Age structure', nameSv: 'Åldersstruktur', description: 'Fördelning av åldersgrupper' },
  { id: 'urbanization', name: 'Urbanization', nameSv: 'Urbanisering', description: 'Andel boende i städer' },
  { id: 'economic_cycles', name: 'Economic cycles', nameSv: 'Ekonomiska cykler', description: 'Konjunkturläge under perioden' },
  { id: 'law_changes', name: 'Legislative changes', nameSv: 'Lagändringar', description: 'Relevanta lagändringar under perioden' },
  { id: 'reporting_practices', name: 'Reporting practices', nameSv: 'Rapporteringspraxis', description: 'Förändringar i hur statistik samlas in' }
];

export const CONTROL_VARIABLES_HEADER = {
  sv: 'Andra faktorer som förändrades samtidigt:',
  en: 'Other factors that changed simultaneously:'
};

// === 7. TEXT EXPLANATIONS (NOT NUMBERS) ===

export interface CorrelationStrength {
  range: [number, number];
  textSv: string;
  textEn: string;
}

export const CORRELATION_TEXT_TEMPLATES: CorrelationStrength[] = [
  {
    range: [0.8, 1.0],
    textSv: 'Under denna period förändrades båda indikatorerna i samma riktning under de flesta år.',
    textEn: 'During this period, both indicators changed in the same direction in most years.'
  },
  {
    range: [0.5, 0.8],
    textSv: 'Under denna period ökade/minskade båda indikatorerna ofta samtidigt. Sambandet är tydligare under vissa år och svagare under andra.',
    textEn: 'During this period, both indicators often increased/decreased together. The relationship is clearer in some years and weaker in others.'
  },
  {
    range: [0.2, 0.5],
    textSv: 'Under denna period fanns ett svagt samband mellan indikatorerna. Många år följde de inte samma mönster.',
    textEn: 'During this period, there was a weak relationship between the indicators. Many years did not follow the same pattern.'
  },
  {
    range: [-0.2, 0.2],
    textSv: 'Under denna period fanns inget tydligt samband mellan indikatorerna.',
    textEn: 'During this period, there was no clear relationship between the indicators.'
  },
  {
    range: [-1.0, -0.2],
    textSv: 'Under denna period rörde sig indikatorerna ofta i motsatt riktning.',
    textEn: 'During this period, the indicators often moved in opposite directions.'
  }
];

export const MULTIPLE_FACTORS_NOTE = {
  sv: 'Detta kan bero på flera samverkande faktorer.',
  en: 'This may be due to multiple interacting factors.'
};

// === 8. CROSS-COUNTRY COMPARISON ===

export const CROSS_COUNTRY_PROMPT = {
  sv: 'Visa samma indikatorer i jämförbara länder',
  en: 'Show the same indicators in comparable countries'
};

export const CROSS_COUNTRY_INSIGHTS = {
  sv: [
    'Mönster är sällan unika för ett land',
    'Kontext spelar stor roll',
    'Institutioner spelar stor roll'
  ],
  en: [
    'Patterns are rarely unique to one country',
    'Context matters significantly',
    'Institutions play a major role'
  ]
};

// === 9. VIABILITY CONNECTION ===

export const VIABILITY_CONNECTION = {
  question: {
    sv: 'Hur påverkar detta människors faktiska levnadsförmåga och samhällets långsiktiga stabilitet?',
    en: 'How does this affect people\'s actual ability to live and society\'s long-term stability?'
  },
  focus: {
    sv: ['bostäder', 'arbete', 'trygghet', 'integrationens tempo', 'institutionell kapacitet'],
    en: ['housing', 'work', 'security', 'pace of integration', 'institutional capacity']
  },
  notAbout: {
    sv: ['skuld', 'identitet', 'ideologi'],
    en: ['blame', 'identity', 'ideology']
  }
};

// === 10. TRANSPARENCY PRINCIPLES ===

export const TRANSPARENCY_PRINCIPLES = {
  sv: [
    'Visa datan öppet',
    'Visa osäkerheter',
    'Visa hela tidslinjer',
    'Visa alternativa tolkningar'
  ],
  en: [
    'Show data openly',
    'Show uncertainties',
    'Show complete timelines',
    'Show alternative interpretations'
  ]
};

export const TRANSPARENCY_OUTCOME = {
  sv: 'Transparens ersätter polarisering.',
  en: 'Transparency replaces polarization.'
};

// === HELPER FUNCTIONS ===

export const getCorrelationText = (coefficient: number, lang: 'sv' | 'en' = 'sv'): string => {
  const template = CORRELATION_TEXT_TEMPLATES.find(
    t => coefficient >= t.range[0] && coefficient <= t.range[1]
  );
  return template ? (lang === 'sv' ? template.textSv : template.textEn) : '';
};

export const formatIndicatorWithContext = (
  value: number,
  unit: string,
  comparison?: { type: 'previous_year' | 'comparable_countries'; value: number }
): string => {
  let result = `${value.toLocaleString()} ${unit}`;
  
  if (comparison) {
    const diff = value - comparison.value;
    const diffPercent = ((diff / comparison.value) * 100).toFixed(1);
    const direction = diff > 0 ? 'över' : 'under';
    
    if (comparison.type === 'previous_year') {
      result += ` (${diff > 0 ? '+' : ''}${diffPercent}% jämfört med föregående år)`;
    } else {
      result += ` (${direction} genomsnittet för jämförbara länder)`;
    }
  }
  
  return result;
};
