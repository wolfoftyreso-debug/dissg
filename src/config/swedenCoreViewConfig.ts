// Sverige Core View Configuration
// "Hur mår Sverige – och varför ser det ut som det gör?"
// Ingång för alla: medborgare, journalister, beslutsfattare, forskare

// === NATIONELLT LÄGE ===

export type NationalStatus = 'critical' | 'stressed' | 'stable' | 'positive';

export interface NationalStatusConfig {
  status: NationalStatus;
  label: string;
  labelSv: string;
  description: string;
  color: string;
}

export const NATIONAL_STATUS_OPTIONS: Record<NationalStatus, NationalStatusConfig> = {
  critical: {
    status: 'critical',
    label: 'Critical',
    labelSv: 'Kritiskt',
    description: 'Flera nyckelindikatorer visar negativ utveckling',
    color: 'hsl(var(--destructive))'
  },
  stressed: {
    status: 'stressed',
    label: 'Stressed',
    labelSv: 'Pressat',
    description: 'Blandad utveckling med tydliga utmaningar',
    color: 'hsl(var(--warning))'
  },
  stable: {
    status: 'stable',
    label: 'Stable',
    labelSv: 'Stabilt',
    description: 'Indikatorerna visar balanserad utveckling',
    color: 'hsl(var(--muted-foreground))'
  },
  positive: {
    status: 'positive',
    label: 'Positive',
    labelSv: 'Positivt',
    description: 'Flera nyckelindikatorer visar positiv utveckling',
    color: 'hsl(var(--primary))'
  }
};

export const NATIONAL_STATUS_SUBTITLE = {
  sv: 'Baserat på samlad utveckling i välbefinnande, energi, trygghet och ekonomiskt handlingsutrymme.',
  en: 'Based on combined development in wellbeing, energy, safety and economic capacity.'
};

// === DE 8 OBLIGATORISKA NYCKELKURVORNA ===

export interface KeyCurveConfig {
  id: string;
  order: number;
  title: string;
  titleSv: string;
  description: string;
  curves: CurveDefinition[];
  note?: string;
}

export interface CurveDefinition {
  id: string;
  name: string;
  nameSv: string;
  unit: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

export const KEY_CURVES: KeyCurveConfig[] = [
  {
    id: 'population_demography',
    order: 1,
    title: 'Population & Demographics',
    titleSv: 'Befolkning & demografi',
    description: 'Visar hur Sveriges befolkning förändrats över tid.',
    curves: [
      { id: 'total_population', name: 'Total population', nameSv: 'Total befolkning', unit: 'miljoner', color: 'primary' },
      { id: 'foreign_born_share', name: 'Share born abroad', nameSv: 'Andel utrikes födda', unit: '%', color: 'secondary' },
      { id: 'age_0_19', name: 'Age 0-19', nameSv: 'Ålder 0-19', unit: '%', color: 'tertiary' }
    ]
  },
  {
    id: 'immigration_flow_stock',
    order: 2,
    title: 'Immigration (flow & stock)',
    titleSv: 'Invandring (flöde & stock)',
    description: 'Visar invandringens volym och intensitet över tid.',
    curves: [
      { id: 'immigration_per_year', name: 'Immigration per year', nameSv: 'Invandring per år', unit: 'personer', color: 'primary' },
      { id: 'net_migration', name: 'Net migration', nameSv: 'Nettoinvandring', unit: 'personer', color: 'secondary' },
      { id: 'immigration_per_1000', name: 'Per 1,000 inhabitants', nameSv: 'Per 1 000 invånare', unit: '‰', color: 'tertiary' }
    ],
    note: 'Flöde ≠ andel – visas alltid separat.'
  },
  {
    id: 'labor_market',
    order: 3,
    title: 'Labor Market',
    titleSv: 'Arbetsmarknad',
    description: 'Visar sysselsättning och arbetslöshet över tid.',
    curves: [
      { id: 'employment_rate', name: 'Employment rate', nameSv: 'Sysselsättningsgrad', unit: '%', color: 'primary' },
      { id: 'unemployment_total', name: 'Unemployment (total)', nameSv: 'Arbetslöshet (total)', unit: '%', color: 'secondary' },
      { id: 'unemployment_longterm', name: 'Long-term unemployment', nameSv: 'Långtidsarbetslöshet', unit: '%', color: 'tertiary' }
    ],
    note: 'Arbetsmarknadens förmåga att absorbera nya grupper är central för samhällsstabilitet.'
  },
  {
    id: 'violence_safety',
    order: 4,
    title: 'Violence & Safety',
    titleSv: 'Våld & trygghet',
    description: 'Visar utvecklingen av anmälda brott över tid.',
    curves: [
      { id: 'violent_crimes_total', name: 'Violent crimes (total)', nameSv: 'Anmälda våldsbrott totalt', unit: 'per 100 000', color: 'primary' },
      { id: 'deadly_violence', name: 'Deadly violence', nameSv: 'Dödligt våld', unit: 'antal', color: 'secondary' },
      { id: 'gun_violence', name: 'Gun violence', nameSv: 'Skjutvapenvåld', unit: 'antal', color: 'tertiary' }
    ],
    note: 'Separerade kategorier – aldrig hopklumpat.'
  },
  {
    id: 'economic_capacity',
    order: 5,
    title: 'Economic Capacity',
    titleSv: 'Ekonomiskt handlingsutrymme',
    description: 'Visar samhällets ekonomiska marginaler.',
    curves: [
      { id: 'gdp_per_capita', name: 'GDP per capita (real)', nameSv: 'BNP per capita (realt)', unit: 'SEK', color: 'primary' },
      { id: 'national_debt_per_capita', name: 'National debt per capita', nameSv: 'Statsskuld per capita', unit: 'SEK', color: 'secondary' },
      { id: 'municipal_costs', name: 'Municipal cost development', nameSv: 'Kommunernas kostnadsutveckling', unit: 'index', color: 'tertiary' }
    ]
  },
  {
    id: 'housing_overcrowding',
    order: 6,
    title: 'Housing & Overcrowding',
    titleSv: 'Bostäder & trångboddhet',
    description: 'Visar bostadssituationen över tid.',
    curves: [
      { id: 'housing_construction', name: 'Housing construction', nameSv: 'Bostadsbyggande', unit: 'bostäder/år', color: 'primary' },
      { id: 'overcrowding', name: 'Overcrowding', nameSv: 'Trångboddhet', unit: '%', color: 'secondary' },
      { id: 'housing_cost', name: 'Average housing cost', nameSv: 'Genomsnittlig boendekostnad', unit: 'SEK/mån', color: 'tertiary' }
    ]
  },
  {
    id: 'energy_living_conditions',
    order: 7,
    title: 'Energy & Living Conditions',
    titleSv: 'Energi & levnadsförutsättningar',
    description: 'Visar energitillgång och kostnader över tid.',
    curves: [
      { id: 'energy_per_capita', name: 'Energy per capita', nameSv: 'Energi per capita', unit: 'kWh', color: 'primary' },
      { id: 'electricity_price', name: 'Electricity price (real)', nameSv: 'Elpris (realt)', unit: 'öre/kWh', color: 'secondary' },
      { id: 'energy_mix', name: 'Energy mix', nameSv: 'Energimix', unit: '%', color: 'tertiary' }
    ],
    note: 'Energi = grund för allt annat.'
  },
  {
    id: 'human_wellbeing_index',
    order: 8,
    title: 'Human Wellbeing Index (HWI)',
    titleSv: 'Samlat mänskligt välbefinnande (HWI)',
    description: 'Sammanfattar hur människor i Sverige haft det över tid, baserat på flera faktorer.',
    curves: [
      { id: 'hwi_total', name: 'HWI Index', nameSv: 'HWI-index', unit: 'index', color: 'primary' }
    ]
  }
];

// === STANDARDKORRELATIONER (1-KLICK) ===

export interface StandardCorrelation {
  id: string;
  indicator1: string;
  indicator1Sv: string;
  indicator2: string;
  indicator2Sv: string;
  category: string;
}

export const STANDARD_CORRELATIONS: StandardCorrelation[] = [
  { id: 'immigration_employment', indicator1: 'Immigration', indicator1Sv: 'Invandring', indicator2: 'Employment', indicator2Sv: 'Sysselsättning', category: 'labor' },
  { id: 'immigration_violence', indicator1: 'Immigration', indicator1Sv: 'Invandring', indicator2: 'Violent crimes', indicator2Sv: 'Våldsbrott', category: 'crime' },
  { id: 'immigration_municipal_costs', indicator1: 'Immigration', indicator1Sv: 'Invandring', indicator2: 'Municipal costs', indicator2Sv: 'Kommunala kostnader', category: 'economy' },
  { id: 'population_housing_shortage', indicator1: 'Population', indicator1Sv: 'Befolkning', indicator2: 'Housing shortage', indicator2Sv: 'Bostadsbrist', category: 'housing' },
  { id: 'energy_household_economy', indicator1: 'Energy', indicator1Sv: 'Energi', indicator2: 'Household economy', indicator2Sv: 'Hushållens ekonomi', category: 'economy' }
];

export const CORRELATION_HEADER = {
  sv: 'Denna jämförelse visar hur två indikatorer samvarierar över tid.\nDen visar inte orsaker.',
  en: 'This comparison shows how two indicators covary over time.\nIt does not show causes.'
};

// === TEXTLAGER ===

export interface TextLayer {
  type: 'what_we_see' | 'what_this_doesnt_say' | 'explore_further';
  icon: string;
  title: string;
  titleSv: string;
}

export const TEXT_LAYERS: TextLayer[] = [
  { type: 'what_we_see', icon: '✅', title: 'What we see', titleSv: 'Vad vi ser' },
  { type: 'what_this_doesnt_say', icon: '⚠️', title: "What this doesn't say", titleSv: 'Vad detta inte säger' },
  { type: 'explore_further', icon: '🔍', title: 'Explore further', titleSv: 'Vad du kan utforska vidare' }
];

// === ÅRSPERSPEKTIV ===

export const YEAR_PERSPECTIVE_WARNING = {
  sv: (startYear: number, endYear: number) => 
    `Du tittar nu på perioden ${startYear}–${endYear}.\nKortare perioder kan förstärka variation.`,
  en: (startYear: number, endYear: number) => 
    `You are now viewing the period ${startYear}–${endYear}.\nShorter periods may amplify variation.`
};

// === ANSVAR & BESLUT ===

export interface GovernmentPeriod {
  startYear: number;
  endYear: number;
  government: string;
  primeMinister: string;
  coalition: string;
}

export const GOVERNMENT_PERIODS: GovernmentPeriod[] = [
  { startYear: 2022, endYear: 2024, government: 'Regeringen Kristersson', primeMinister: 'Ulf Kristersson', coalition: 'M, KD, L (stöd SD)' },
  { startYear: 2021, endYear: 2022, government: 'Regeringen Andersson', primeMinister: 'Magdalena Andersson', coalition: 'S' },
  { startYear: 2014, endYear: 2021, government: 'Regeringen Löfven', primeMinister: 'Stefan Löfven', coalition: 'S, MP' },
  { startYear: 2006, endYear: 2014, government: 'Regeringen Reinfeldt', primeMinister: 'Fredrik Reinfeldt', coalition: 'M, FP, C, KD' },
  { startYear: 1996, endYear: 2006, government: 'Regeringen Persson', primeMinister: 'Göran Persson', coalition: 'S' },
  { startYear: 1991, endYear: 1994, government: 'Regeringen Bildt', primeMinister: 'Carl Bildt', coalition: 'M, FP, C, KD' }
];

export const GOVERNMENT_PERIOD_HEADER = {
  sv: 'Under denna period var följande regeringar / mandatperioder aktiva.',
  en: 'During this period, the following governments / mandate periods were active.'
};

// === PRINCIPER ===

export const CORE_VIEW_PRINCIPLES = {
  sv: [
    'Få men bärande indikatorer',
    'Lång tid först (minst 20 år där möjligt)',
    'Nivå + riktning alltid tillsammans',
    'Inga slutsatser – bara mönster',
    'Allt klickbart till förklaring'
  ],
  en: [
    'Few but essential indicators',
    'Long term first (at least 20 years where possible)',
    'Level + direction always together',
    'No conclusions – only patterns',
    'Everything clickable to explanation'
  ]
};

// === GLOBAL MALL ===

export const GLOBAL_TEMPLATE_NOTE = {
  sv: 'Denna vy är mall för alla länder. Skillnader: datatäthet och osäkerhetsmarkering.',
  en: 'This view is the template for all countries. Differences: data density and uncertainty marking.'
};
