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

// === 4B. JURISDICTION SELECTION ===

export interface JurisdictionOption {
  id: string;
  label: string;
  labelSv: string;
  type: 'country' | 'region' | 'municipality';
  parentId?: string;
  dataTier: 'A' | 'B' | 'C' | 'D';
}

// Countries with demographic data
export const COUNTRIES: JurisdictionOption[] = [
  { id: 'se', label: 'Sweden', labelSv: 'Sverige', type: 'country', dataTier: 'A' },
  { id: 'no', label: 'Norway', labelSv: 'Norge', type: 'country', dataTier: 'A' },
  { id: 'dk', label: 'Denmark', labelSv: 'Danmark', type: 'country', dataTier: 'A' },
  { id: 'fi', label: 'Finland', labelSv: 'Finland', type: 'country', dataTier: 'A' },
  { id: 'de', label: 'Germany', labelSv: 'Tyskland', type: 'country', dataTier: 'A' },
  { id: 'nl', label: 'Netherlands', labelSv: 'Nederländerna', type: 'country', dataTier: 'A' },
  { id: 'gb', label: 'United Kingdom', labelSv: 'Storbritannien', type: 'country', dataTier: 'A' },
  { id: 'fr', label: 'France', labelSv: 'Frankrike', type: 'country', dataTier: 'A' },
  { id: 'us', label: 'United States', labelSv: 'USA', type: 'country', dataTier: 'B' },
  { id: 'ca', label: 'Canada', labelSv: 'Kanada', type: 'country', dataTier: 'B' },
  { id: 'au', label: 'Australia', labelSv: 'Australien', type: 'country', dataTier: 'B' },
];

// Swedish regions (example - would be dynamic in production)
export const SWEDISH_REGIONS: JurisdictionOption[] = [
  { id: 'se-ab', label: 'Stockholm', labelSv: 'Stockholm', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-o', label: 'Västra Götaland', labelSv: 'Västra Götaland', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-m', label: 'Skåne', labelSv: 'Skåne', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-e', label: 'Östergötland', labelSv: 'Östergötland', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-d', label: 'Södermanland', labelSv: 'Södermanland', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-c', label: 'Uppsala', labelSv: 'Uppsala', type: 'region', parentId: 'se', dataTier: 'A' },
  { id: 'se-z', label: 'Jämtland', labelSv: 'Jämtland', type: 'region', parentId: 'se', dataTier: 'B' },
  { id: 'se-ac', label: 'Västerbotten', labelSv: 'Västerbotten', type: 'region', parentId: 'se', dataTier: 'B' },
  { id: 'se-bd', label: 'Norrbotten', labelSv: 'Norrbotten', type: 'region', parentId: 'se', dataTier: 'B' },
];

// Helper to get regions for a country
export const getRegionsForCountry = (countryId: string): JurisdictionOption[] => {
  if (countryId === 'se') return SWEDISH_REGIONS;
  // Other countries would have their own regions
  return [];
};

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

// === 6. CONTROL VARIABLES (Full Explanation Pyramid) ===

export interface ControlVariableSource {
  name: string;
  url: string;
  type: 'primary' | 'secondary';
  coverage: string;
}

export interface ControlVariable {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  // Level 1: Observation (What?)
  observation: {
    sv: string;
    en: string;
  };
  // Level 2: Mechanism (Why/Drivers?)
  mechanism: {
    sv: string;
    en: string;
  };
  // Level 3: Method (How do we know?)
  method: {
    sv: string;
    en: string;
    dataFrequency: string;
    latestUpdate: string;
  };
  // Level 4: Limitations (What doesn't this show?)
  limitations: {
    sv: string[];
    en: string[];
  };
  // Level 5: Sources (Raw data)
  sources: ControlVariableSource[];
  // Trend data for sparkline
  trendDirection: 'up' | 'down' | 'stable' | 'volatile';
  changePercent?: number;
  relevanceScore: number; // 0-100, how relevant to the analysis
}

export const CONTROL_VARIABLES: ControlVariable[] = [
  { 
    id: 'population_size', 
    name: 'Population size', 
    nameSv: 'Befolkningsstorlek', 
    description: 'Total befolkning i området',
    observation: {
      sv: 'Sveriges befolkning ökade från 8,9 till 10,5 miljoner under analysperioden.',
      en: 'Sweden\'s population increased from 8.9 to 10.5 million during the analysis period.'
    },
    mechanism: {
      sv: 'Befolkningsökning påverkar brottsnivåer genom ökad befolkningstäthet, förändrad åldersstruktur och urbanisering. Fler personer innebär fler potentiella händelser, men också fler rapportörer.',
      en: 'Population growth affects crime levels through increased density, changed age structure and urbanization.'
    },
    method: {
      sv: 'Folkbokföring via Skatteverket. Alla personer med uppehållstillstånd >12 månader registreras.',
      en: 'Population registry via Swedish Tax Agency. All persons with residence >12 months are registered.',
      dataFrequency: 'Månadsvis',
      latestUpdate: '2024-01-15'
    },
    limitations: {
      sv: ['Exkluderar papperslösa', 'Registreringsfördröjning ~2 månader', 'Regional fördelning kan avvika'],
      en: ['Excludes undocumented persons', 'Registration delay ~2 months', 'Regional distribution may differ']
    },
    sources: [
      { name: 'SCB Befolkningsstatistik', url: 'https://www.scb.se/be0101', type: 'primary', coverage: '1749-2024' },
      { name: 'Eurostat Population', url: 'https://ec.europa.eu/eurostat', type: 'secondary', coverage: '1960-2024' }
    ],
    trendDirection: 'up',
    changePercent: 18.4,
    relevanceScore: 85
  },
  { 
    id: 'age_structure', 
    name: 'Age structure', 
    nameSv: 'Åldersstruktur', 
    description: 'Fördelning av åldersgrupper',
    observation: {
      sv: 'Andelen 15-24-åringar minskade från 12,8% till 11,2% under perioden. Medianåldern ökade från 39 till 41 år.',
      en: 'The proportion of 15-24 year olds decreased from 12.8% to 11.2%. Median age increased from 39 to 41.'
    },
    mechanism: {
      sv: 'Åldersstruktur påverkar brottsstatistik starkt då personer 15-30 år står för majoriteten av anmälda brott. En åldrande befolkning tenderar korrelera med lägre brottsnivåer, allt annat lika.',
      en: 'Age structure strongly affects crime statistics as persons 15-30 account for the majority of reported crimes.'
    },
    method: {
      sv: 'Åldersfördelning beräknas från folkbokföring. Kohorter definieras i 5-årsintervall.',
      en: 'Age distribution calculated from population registry. Cohorts defined in 5-year intervals.',
      dataFrequency: 'Årlig',
      latestUpdate: '2024-01-10'
    },
    limitations: {
      sv: ['Ålder vid brott kan skilja från ålder vid dom', 'Kriminalitetsbenägenhet varierar inom kohorter', 'Historiska data saknar finfördelning'],
      en: ['Age at crime may differ from age at conviction', 'Criminal propensity varies within cohorts', 'Historical data lacks granularity']
    },
    sources: [
      { name: 'SCB Befolkningsstatistik', url: 'https://www.scb.se/be0101', type: 'primary', coverage: '1860-2024' },
      { name: 'BRÅ Kriminalstatistik', url: 'https://www.bra.se', type: 'secondary', coverage: '1950-2024' }
    ],
    trendDirection: 'up',
    changePercent: 5.1,
    relevanceScore: 92
  },
  { 
    id: 'urbanization', 
    name: 'Urbanization', 
    nameSv: 'Urbanisering', 
    description: 'Andel boende i städer',
    observation: {
      sv: 'Andelen boende i tätorter ökade från 83% till 88% under analysperioden.',
      en: 'The proportion living in urban areas increased from 83% to 88% during the analysis period.'
    },
    mechanism: {
      sv: 'Urbanisering ökar befolkningstäthet och anonymitet, vilket kan påverka både brottsbenägenhet och anmälningsbenägenhet. Städer har också fler polisresurser per capita.',
      en: 'Urbanization increases population density and anonymity, affecting both crime propensity and reporting rates.'
    },
    method: {
      sv: 'Tätortsdefinition: sammanhängande bebyggelse med >200 invånare och <200m mellan hus. Mäts via GIS-analys.',
      en: 'Urban area definition: continuous settlement with >200 inhabitants and <200m between buildings.',
      dataFrequency: 'Vart 5:e år',
      latestUpdate: '2020-12-31'
    },
    limitations: {
      sv: ['Definition ändrades 2015', 'Pendling ej inkluderad', 'Förorter klassificeras olika över tid'],
      en: ['Definition changed 2015', 'Commuting not included', 'Suburbs classified differently over time']
    },
    sources: [
      { name: 'SCB Tätorter', url: 'https://www.scb.se/mi0810', type: 'primary', coverage: '1960-2020' },
      { name: 'UN World Urbanization', url: 'https://population.un.org/wup/', type: 'secondary', coverage: '1950-2050' }
    ],
    trendDirection: 'up',
    changePercent: 6.0,
    relevanceScore: 78
  },
  { 
    id: 'economic_cycles', 
    name: 'Economic cycles', 
    nameSv: 'Ekonomiska cykler', 
    description: 'Konjunkturläge under perioden',
    observation: {
      sv: 'Perioden inkluderade finanskrisen 2008-2009 (-5% BNP), återhämtning 2010-2019, och pandemikrisen 2020 (-2,8% BNP).',
      en: 'The period included the 2008-2009 financial crisis (-5% GDP), recovery 2010-2019, and pandemic crisis 2020 (-2.8% GDP).'
    },
    mechanism: {
      sv: 'Konjunkturnedgångar korrelerar historiskt med ökad egendomsbrottslighet men minskad våldsbrott (färre tillfällen). Arbetslöshet påverkar ungdomsbrottslighet med 1-2 års fördröjning.',
      en: 'Economic downturns historically correlate with increased property crime but decreased violent crime.'
    },
    method: {
      sv: 'BNP-förändring beräknas kvartalsvis. Konjunkturindikatorn är ett viktat index av produktion, sysselsättning och konsumtion.',
      en: 'GDP change calculated quarterly. Business cycle indicator is weighted index of production, employment, and consumption.',
      dataFrequency: 'Kvartalsvis',
      latestUpdate: '2024-Q3'
    },
    limitations: {
      sv: ['Regional variation stor', 'Branscheffekter ej separerade', 'Tidsfördröjning mellan ekonomi och brott oklar'],
      en: ['Large regional variation', 'Sector effects not separated', 'Time lag between economy and crime unclear']
    },
    sources: [
      { name: 'SCB Nationalräkenskaper', url: 'https://www.scb.se/nr0103', type: 'primary', coverage: '1950-2024' },
      { name: 'Konjunkturinstitutet', url: 'https://www.konj.se', type: 'primary', coverage: '1996-2024' }
    ],
    trendDirection: 'volatile',
    relevanceScore: 71
  },
  { 
    id: 'law_changes', 
    name: 'Legislative changes', 
    nameSv: 'Lagändringar', 
    description: 'Relevanta lagändringar under perioden',
    observation: {
      sv: 'Under perioden genomfördes 12 större straffrättsliga reformer, inklusive skärpta straff för våldsbrott (2010, 2017) och ny sexualbrottslagstiftning (2018).',
      en: 'During the period, 12 major criminal law reforms were implemented.'
    },
    mechanism: {
      sv: 'Lagändringar påverkar statistiken genom: (1) nya brottskategorier ökar anmälningar, (2) straffskärpningar kan ha avskräckande effekt, (3) definitionsändringar bryter tidsserier.',
      en: 'Legislative changes affect statistics through: (1) new crime categories increase reports, (2) harsher penalties may deter, (3) definition changes break time series.'
    },
    method: {
      sv: 'Riksdagsbeslut och SFS-publikationer. Ikraftträdandedatum registreras. Effektbedömningar görs av Brå.',
      en: 'Parliamentary decisions and SFS publications. Entry into force dates recorded. Effect assessments by Brå.',
      dataFrequency: 'Löpande',
      latestUpdate: '2024-07-01'
    },
    limitations: {
      sv: ['Effekt vs korrelation svår att särskilja', 'Internationella jämförelser problematiska', 'Praxis ändras utan lagändring'],
      en: ['Effect vs correlation hard to distinguish', 'International comparisons problematic', 'Practice changes without legislation']
    },
    sources: [
      { name: 'Riksdagen.se', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/', type: 'primary', coverage: '1974-2024' },
      { name: 'BRÅ Reformuppföljningar', url: 'https://www.bra.se/publikationer', type: 'primary', coverage: '2000-2024' }
    ],
    trendDirection: 'up',
    relevanceScore: 88
  },
  { 
    id: 'reporting_practices', 
    name: 'Reporting practices', 
    nameSv: 'Rapporteringspraxis', 
    description: 'Förändringar i hur statistik samlas in',
    observation: {
      sv: 'Anmälningsbenägenheten för våldsbrott ökade från ~30% till ~45% under perioden. Digitala anmälningskanaler infördes 2015.',
      en: 'Reporting propensity for violent crimes increased from ~30% to ~45% during the period.'
    },
    mechanism: {
      sv: 'Ökad anmälningsbenägenhet ökar registrerad brottslighet utan att faktisk brottslighet ökar. Faktorer: attityder, tillgänglighet, förtroende för rättsväsendet.',
      en: 'Increased reporting propensity increases registered crime without actual crime increasing.'
    },
    method: {
      sv: 'Nationella trygghetsundersökningen (NTU) jämför självrapporterad utsatthet med polisanmälningar. Årlig enkät till 200 000 personer.',
      en: 'National Crime Survey (NTU) compares self-reported victimization with police reports. Annual survey to 200,000 persons.',
      dataFrequency: 'Årlig',
      latestUpdate: '2024-01-25'
    },
    limitations: {
      sv: ['Enkätbortfall ~40%', 'Minnesbias', 'Definitioner av utsatthet subjektiva', 'Vissa brott saknar "mörkertalsdata"'],
      en: ['Survey non-response ~40%', 'Recall bias', 'Victimization definitions subjective', 'Some crimes lack "dark figure" data']
    },
    sources: [
      { name: 'BRÅ NTU', url: 'https://www.bra.se/ntu', type: 'primary', coverage: '2006-2024' },
      { name: 'Polisens anmälningsstatistik', url: 'https://polisen.se/statistik', type: 'primary', coverage: '1975-2024' }
    ],
    trendDirection: 'up',
    changePercent: 50,
    relevanceScore: 95
  }
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
