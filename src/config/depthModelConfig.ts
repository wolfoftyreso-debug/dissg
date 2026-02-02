/**
 * DEL XV — OÄNDLIGT DJUP, RÄTT GJORT
 * 
 * Konfiguration för rekursiv, geografisk och ansvarskopplad analys
 * med inbyggt integritetsskydd (k-anonymitet, brus, spärrregler).
 */

// =====================================================
// DJUPPRINCIPEN
// =====================================================

export const DEPTH_PRINCIPLE = {
  core: `Ingen vy får avslöja en individ – men varje vy ska kunna förklaras ner till datapunkt.`,
  
  allowed: [
    'aggregering',
    'k-anonymitet',
    'minsta cellstorlek',
    'statistiskt brus',
  ],
  
  forbidden: [
    'personnamn',
    'person-ID',
    'små grupper som kan bakåtrekonstrueras',
    'individidentifiering',
  ],
  
  motto: 'Full analyskraft, inte övervakning.',
} as const;

// =====================================================
// NAVIGATIONSHIERARKIN (6 nivåer)
// =====================================================

export type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface DepthLevelConfig {
  level: DepthLevel;
  id: string;
  name: string;
  question: string;
  description: string;
  dataType: 'aggregate' | 'regional' | 'municipal' | 'cluster' | 'datapoint';
  minObservations: number;
  allowedFilters: string[];
  example?: string;
}

export const DEPTH_LEVELS: DepthLevelConfig[] = [
  {
    level: 0,
    id: 'national',
    name: 'Nationell översikt',
    question: 'Hur mår landet?',
    description: 'Masterindex, 20 KPI, tydlig riktning, tidslinje',
    dataType: 'aggregate',
    minObservations: 100000,
    allowedFilters: ['time', 'kpi', 'category'],
  },
  {
    level: 1,
    id: 'regional',
    name: 'Regional vy',
    question: 'Var i landet ser vi detta?',
    description: 'Län / region, jämförbar färgskala, samma KPI-definition',
    dataType: 'regional',
    minObservations: 10000,
    allowedFilters: ['time', 'kpi', 'category', 'region'],
  },
  {
    level: 2,
    id: 'municipal',
    name: 'Kommun / stad',
    question: 'Vilka städer sticker ut?',
    description: 'Choropleth-karta, staplar + trendlinjer, klusteranalys',
    dataType: 'municipal',
    minObservations: 1000,
    allowedFilters: ['time', 'kpi', 'category', 'region', 'municipality'],
  },
  {
    level: 3,
    id: 'cluster',
    name: 'Områdeskluster',
    question: 'Vilka mönster ser vi?',
    description: 'Demografiska profiler, anonymiserade segment, statistiska kluster',
    dataType: 'cluster',
    minObservations: 100,
    allowedFilters: ['time', 'kpi', 'demographics', 'cluster_type'],
    example: 'Områden med hög andel långtidssjukskrivna + låg sysselsättning + hög vårdkonsumtion.',
  },
  {
    level: 4,
    id: 'datapoint',
    name: 'Datapunkter',
    question: 'Vad visar rådata?',
    description: 'Exakta värden, tidsstämplar, förändringspunkter, datakällor, osäkerhet',
    dataType: 'datapoint',
    minObservations: 50,
    allowedFilters: ['time', 'source', 'confidence'],
  },
  {
    level: 5,
    id: 'methodology',
    name: 'Metodologi',
    question: 'Hur mättes detta?',
    description: 'Datainsamlingsmetod, definitioner, bortfall, osäkerhetsberäkning',
    dataType: 'datapoint',
    minObservations: 0,
    allowedFilters: [],
  },
];

// =====================================================
// GEOGRAFISK KARTVY
// =====================================================

export interface MapLayerConfig {
  id: string;
  name: string;
  zoomRange: [number, number];
  dataLevel: DepthLevel;
  colorScale: 'sequential' | 'diverging' | 'categorical';
}

export const MAP_LAYERS: MapLayerConfig[] = [
  { id: 'nation', name: 'Sverige', zoomRange: [0, 5], dataLevel: 0, colorScale: 'sequential' },
  { id: 'region', name: 'Län', zoomRange: [5, 8], dataLevel: 1, colorScale: 'diverging' },
  { id: 'municipality', name: 'Kommun', zoomRange: [8, 11], dataLevel: 2, colorScale: 'diverging' },
  { id: 'district', name: 'Distrikt', zoomRange: [11, 14], dataLevel: 3, colorScale: 'diverging' },
];

export const MAP_FEATURES = {
  zoom: {
    min: 0,
    max: 14,
    privacyThreshold: 12, // Spärr vid för djup zoom
  },
  
  visualizations: [
    'heatmap',
    'choropleth',
    'clusters',
    'bubbles',
  ],
  
  timeControls: {
    granularities: ['year', 'quarter', 'month'],
    compareMode: true, // Före/efter beslut
    animation: true,
  },
  
  analysis: {
    clustering: ['dbscan', 'kmeans'],
    comparison: true,
    trends: true,
  },
} as const;

// =====================================================
// SIMULERINGSMOTOR
// =====================================================

export interface SimulationConfig {
  enabled: boolean;
  disclaimer: string;
  adjustableIndicators: string[];
  maxAdjustment: number; // Procent
  showSensitivity: boolean;
  showHistoricalComparison: boolean;
}

export const SIMULATION_CONFIG: SimulationConfig = {
  enabled: true,
  disclaimer: 'Simulering – detta ändrar inte verklig data',
  adjustableIndicators: [
    'working_age_functional',
    'employment_rate',
    'productivity_per_hour',
    'life_expectancy',
    'violent_crime_rate',
  ],
  maxAdjustment: 20, // Max ±20%
  showSensitivity: true,
  showHistoricalComparison: true,
};

export const SIMULATION_EXAMPLES = [
  {
    id: 'employment_boost',
    title: 'Ökad arbetsförmåga',
    description: 'Om arbetsförmågan ökar med 1 procentenhet i dessa regioner, hur påverkas helheten?',
    indicator: 'working_age_functional',
    change: 1,
    unit: 'procentenhet',
  },
  {
    id: 'crime_reduction',
    title: 'Minskad brottslighet',
    description: 'Om våldsbrott minskar med 10%, vad händer med övriga indikatorer?',
    indicator: 'violent_crime_rate',
    change: -10,
    unit: '%',
  },
];

// =====================================================
// ORSAKSKEDJOR (CAUSAL CHAINS)
// =====================================================

export interface CausalLink {
  from: string;
  to: string;
  strength: number; // -1 till 1
  lag: number; // Månader
  stability: number; // 0-100
  direction: 'positive' | 'negative' | 'complex';
}

export const CAUSAL_CHAIN_CONFIG = {
  visualization: {
    type: 'flow', // Flödesdiagram, inte nättrassel
    maxNodes: 10,
    showStrength: true,
    showLag: true,
    interactive: true,
  },
  
  metrics: {
    covariation: true,
    timeShift: true,
    stability: true,
  },
  
  disclaimer: 'Samvariation i tid innebär inte kausalitet.',
};

// =====================================================
// TYPFALL / PERSONAS (ANONYMA)
// =====================================================

export interface StatisticalPersona {
  id: string;
  name: string;
  description: string;
  demographics: {
    ageRange: string;
    characteristics: string[];
  };
  disclaimer: string;
}

export const PERSONA_CONFIG = {
  enabled: true,
  disclaimer: 'Typfall baseras på statistiska mönster och representerar inga verkliga individer.',
  
  examplePersonas: [
    {
      id: 'cluster_a',
      name: 'Typfall A',
      description: 'En typisk person i detta kluster',
      demographics: {
        ageRange: '45–55 år',
        characteristics: [
          'långtidssjukskriven',
          'återkommande vårdkontakt',
          'bor i storstadsområde',
        ],
      },
      disclaimer: 'Syntetisk profil baserad på aggregerad statistik.',
    },
  ],
};

// =====================================================
// INTEGRITETSSKYDD (PRIVACY BY DESIGN)
// =====================================================

export interface PrivacyConfig {
  kAnonymity: number;
  minCellSize: number;
  noiseLevel: number; // 0-1
  blockSmallGroups: boolean;
  warningThreshold: number;
}

export const PRIVACY_CONFIG: PrivacyConfig = {
  kAnonymity: 5, // Minst 5 individer per grupp
  minCellSize: 10, // Minst 10 observationer per cell
  noiseLevel: 0.02, // 2% brus vid djup zoom
  blockSmallGroups: true,
  warningThreshold: 50, // Varning under 50 observationer
};

export const PRIVACY_MESSAGES = {
  blocked: 'Datat är för tunt för att visas på denna nivå.',
  warning: 'Begränsat underlag – tolka med försiktighet.',
  noiseApplied: 'Statistiskt brus har tillämpats för integritetsskydd.',
  aggregated: 'Värden är aggregerade för att skydda individer.',
};

// =====================================================
// REKURSIV DESIGN-PRINCIP
// =====================================================

export const RECURSIVE_DESIGN = {
  rule: 'Varje graf → kan brytas ner → till data → till källa → till metod',
  
  drillDownActions: [
    { id: 'filter', label: 'Filtrera', icon: 'filter' },
    { id: 'compare', label: 'Jämför', icon: 'git-compare' },
    { id: 'timeline', label: 'Tidslinje', icon: 'calendar' },
    { id: 'source', label: 'Visa källa', icon: 'external-link' },
    { id: 'method', label: 'Visa metod', icon: 'info' },
  ],
  
  motto: 'Det finns aldrig ett slut – bara fler filter, fler jämförelser, fler perspektiv.',
};

// =====================================================
// SYSTEMDEFINITION
// =====================================================

export const SYSTEM_DEFINITION = {
  name: 'Rekursivt analysuniversum',
  
  description: `Ett rekursivt, pedagogiskt, geografiskt och ansvarskopplat analysuniversum 
där verkligheten går att förstå i valfri upplösning utan att någon offras.`,
  
  principles: [
    'Oändligt analytiskt djup – aldrig identifierande djup',
    'Du går ner till datapunkt, inte person',
    'Upplyst transparens, inte kontroll',
  ],
  
  capabilities: [
    'Rekursiv drill-down till datapunkt',
    'Geografisk analys på alla nivåer',
    'Simulering med tydlig märkning',
    'Orsakskedjor med samvariationsanalys',
    'Typfall baserade på statistik',
    'Automatiskt integritetsskydd',
  ],
};

// =====================================================
// DEL XXIV — DJUPDATA: KÖN, MIGRATION, URSPRUNG
// =====================================================

/**
 * N-SPÄRRAR & PRIVACY THRESHOLDS
 * All känslig demografi analyseras på populations- och klusternivå – aldrig individnivå.
 */

export interface DemographicPrivacyThreshold {
  dimension: string;
  minN: number;
  aggregationStrategy: 'merge_adjacent' | 'suppress' | 'add_noise' | 'broaden_category';
  noiseLevel?: number;
  description: string;
}

export const DEMOGRAPHIC_PRIVACY_THRESHOLDS: DemographicPrivacyThreshold[] = [
  {
    dimension: 'kommun',
    minN: 50,
    aggregationStrategy: 'merge_adjacent',
    description: 'Kommuner med färre än 50 individer slås samman med närliggande',
  },
  {
    dimension: 'region',
    minN: 100,
    aggregationStrategy: 'suppress',
    description: 'Regioner med färre än 100 individer visas inte separat',
  },
  {
    dimension: 'ursprungsland',
    minN: 200,
    aggregationStrategy: 'broaden_category',
    description: 'Enskilda länder aggregeras till världsdelar vid låg N',
  },
  {
    dimension: 'kön_x_ålder_x_region',
    minN: 30,
    aggregationStrategy: 'add_noise',
    noiseLevel: 0.05,
    description: 'Intersektioner med färre än 30 får statistiskt brus',
  },
  {
    dimension: 'tid_i_landet',
    minN: 100,
    aggregationStrategy: 'broaden_category',
    description: 'Korta intervall slås samman vid låg N',
  },
];

/**
 * DEMOGRAFISKA DIMENSIONER
 */

export type DemographicSensitivity = 'low' | 'medium' | 'high' | 'very_high';

export interface DemographicDimension {
  id: string;
  label: { sv: string; en: string };
  type: 'categorical' | 'interval' | 'binary';
  categories?: string[];
  intervals?: { min: number; max: number; label: string }[];
  source: string;
  definition: string;
  sensitivityLevel: DemographicSensitivity;
  allowedCrossings: string[];
}

export const DEMOGRAPHIC_DIMENSIONS: DemographicDimension[] = [
  // KÖN
  {
    id: 'sex',
    label: { sv: 'Kön', en: 'Sex' },
    type: 'categorical',
    categories: ['man', 'kvinna'],
    source: 'SCB befolkningsregistret',
    definition: 'Juridiskt kön enligt folkbokföringen',
    sensitivityLevel: 'low',
    allowedCrossings: ['age_group', 'region', 'education', 'employment'],
  },
  
  // ÅLDER
  {
    id: 'age_group',
    label: { sv: 'Åldersgrupp', en: 'Age group' },
    type: 'interval',
    intervals: [
      { min: 0, max: 17, label: '0–17' },
      { min: 18, max: 24, label: '18–24' },
      { min: 25, max: 34, label: '25–34' },
      { min: 35, max: 44, label: '35–44' },
      { min: 45, max: 54, label: '45–54' },
      { min: 55, max: 64, label: '55–64' },
      { min: 65, max: 74, label: '65–74' },
      { min: 75, max: 120, label: '75+' },
    ],
    source: 'SCB befolkningsregistret',
    definition: 'Ålder vid periodens slut',
    sensitivityLevel: 'low',
    allowedCrossings: ['sex', 'region', 'birth_country_type', 'employment'],
  },

  // INRIKES/UTRIKES FÖDD
  {
    id: 'birth_country_type',
    label: { sv: 'Födelseland', en: 'Country of birth' },
    type: 'binary',
    categories: ['inrikes_född', 'utrikes_född'],
    source: 'SCB befolkningsregistret',
    definition: 'Född i Sverige eller utomlands enligt folkbokföringen',
    sensitivityLevel: 'medium',
    allowedCrossings: ['age_group', 'region', 'time_in_country', 'employment'],
  },

  // TID I LANDET
  {
    id: 'time_in_country',
    label: { sv: 'Tid i Sverige', en: 'Time in Sweden' },
    type: 'interval',
    intervals: [
      { min: 0, max: 2, label: '0–2 år' },
      { min: 3, max: 5, label: '3–5 år' },
      { min: 6, max: 10, label: '6–10 år' },
      { min: 11, max: 999, label: '10+ år' },
    ],
    source: 'SCB befolkningsregistret',
    definition: 'År sedan folkbokföring i Sverige',
    sensitivityLevel: 'high',
    allowedCrossings: ['age_group', 'region', 'employment', 'education'],
  },

  // ÅLDER VID ANKOMST
  {
    id: 'age_at_arrival',
    label: { sv: 'Ålder vid ankomst', en: 'Age at arrival' },
    type: 'interval',
    intervals: [
      { min: 0, max: 6, label: '0–6 år' },
      { min: 7, max: 12, label: '7–12 år' },
      { min: 13, max: 17, label: '13–17 år' },
      { min: 18, max: 24, label: '18–24 år' },
      { min: 25, max: 39, label: '25–39 år' },
      { min: 40, max: 999, label: '40+ år' },
    ],
    source: 'SCB befolkningsregistret',
    definition: 'Ålder vid första folkbokföring i Sverige',
    sensitivityLevel: 'high',
    allowedCrossings: ['time_in_country', 'region', 'employment'],
  },

  // URSPRUNGSREGION (BRED NIVÅ)
  {
    id: 'origin_region',
    label: { sv: 'Ursprungsregion', en: 'Region of origin' },
    type: 'categorical',
    categories: [
      'norden',
      'eu_utom_norden',
      'europa_utom_eu',
      'afrika',
      'asien',
      'nordamerika',
      'sydamerika',
      'oceanien',
    ],
    source: 'SCB befolkningsregistret',
    definition: 'Världsdel för födelseland (ej enskilda länder pga N-spärr)',
    sensitivityLevel: 'very_high',
    allowedCrossings: ['time_in_country', 'age_at_arrival'],
  },

  // SYSSELSÄTTNING
  {
    id: 'employment',
    label: { sv: 'Sysselsättning', en: 'Employment' },
    type: 'categorical',
    categories: ['förvärvsarbetande', 'arbetslös', 'studerande', 'pensionär', 'övrigt'],
    source: 'SCB RAMS',
    definition: 'Arbetsmarknadsstatus enligt registerbaserad arbetsmarknadsstatistik',
    sensitivityLevel: 'low',
    allowedCrossings: ['sex', 'age_group', 'region', 'birth_country_type', 'time_in_country', 'education'],
  },

  // UTBILDNINGSNIVÅ
  {
    id: 'education',
    label: { sv: 'Utbildningsnivå', en: 'Education level' },
    type: 'categorical',
    categories: ['förgymnasial', 'gymnasial', 'eftergymnasial_kort', 'eftergymnasial_lång'],
    source: 'SCB utbildningsregistret',
    definition: 'Högsta avslutade utbildningsnivå',
    sensitivityLevel: 'low',
    allowedCrossings: ['sex', 'age_group', 'region', 'birth_country_type', 'employment'],
  },
];

/**
 * TILLVÄXTDIMENSIONER FÖR KORRELATION
 */

export interface GrowthDimension {
  id: string;
  label: { sv: string; en: string };
  unit: string;
  source: string;
  definition: string;
  lagRange: { min: number; max: number };
}

export const GROWTH_DIMENSIONS: GrowthDimension[] = [
  {
    id: 'gdp_per_capita',
    label: { sv: 'BNP per capita', en: 'GDP per capita' },
    unit: 'SEK',
    source: 'SCB nationalräkenskaper',
    definition: 'Bruttonationalprodukt dividerat med befolkning',
    lagRange: { min: 12, max: 60 },
  },
  {
    id: 'productivity',
    label: { sv: 'Produktivitet', en: 'Productivity' },
    unit: 'SEK/timme',
    source: 'SCB nationalräkenskaper',
    definition: 'Förädlingsvärde per arbetad timme',
    lagRange: { min: 6, max: 36 },
  },
  {
    id: 'tax_base',
    label: { sv: 'Skattekraft', en: 'Tax base' },
    unit: 'SEK/inv',
    source: 'SCB kommunalekonomi',
    definition: 'Beskattningsbar förvärvsinkomst per invånare',
    lagRange: { min: 12, max: 48 },
  },
  {
    id: 'business_dynamism',
    label: { sv: 'Företagsdynamik', en: 'Business dynamism' },
    unit: 'netto',
    source: 'SCB företagsregister',
    definition: 'Nystartade minus avregistrerade företag per 1000 inv',
    lagRange: { min: 6, max: 24 },
  },
  {
    id: 'working_age_function',
    label: { sv: 'Arbetsför befolkning i funktion', en: 'Working age in function' },
    unit: '%',
    source: 'SCB AKU, RAMS',
    definition: 'Andel 20–64 år som förvärvsarbetar',
    lagRange: { min: 3, max: 24 },
  },
];

/**
 * FÖRBJUDNA KORSNINGAR
 */

export interface ForbiddenCrossing {
  dimensions: string[];
  reason: string;
  riskType: 'reidentification' | 'small_n' | 'methodological' | 'ethical';
}

export const FORBIDDEN_CROSSINGS: ForbiddenCrossing[] = [
  {
    dimensions: ['origin_region', 'kommun', 'age_group'],
    reason: 'Risk för bakåtrekonstruktion av individer i små kommuner',
    riskType: 'reidentification',
  },
  {
    dimensions: ['origin_region', 'sex', 'age_at_arrival', 'kommun'],
    reason: 'Fyrvägsintersektion med geografisk precision kan avslöja identitet',
    riskType: 'reidentification',
  },
  {
    dimensions: ['time_in_country', 'origin_region', 'kommun'],
    reason: 'Kombinationen kan ge för låg N i enskilda celler',
    riskType: 'small_n',
  },
];

/**
 * METODREGLER FÖR MIGRATION × TILLVÄXT KORRELATION
 */

export interface MigrationGrowthCorrelationRules {
  requiredLagAnalysis: boolean;
  minTimeSeriesLength: number;
  requiredControls: string[];
  mandatoryDisclaimers: string[];
  interpretationGuidelines: string[];
}

export const MIGRATION_GROWTH_RULES: MigrationGrowthCorrelationRules = {
  requiredLagAnalysis: true,
  minTimeSeriesLength: 60,
  requiredControls: [
    'Konjunkturcykel',
    'Global ekonomi',
    'Policyförändringar',
    'Demografisk struktur (åldersfördelning)',
    'Regional ekonomisk utgångspunkt',
  ],
  mandatoryDisclaimers: [
    'Korrelation visar samvariation över tid. Kausalitet fastställs inte.',
    'Flera bakomliggande faktorer kan förklara observerade mönster.',
    'Resultaten ska tolkas i ljuset av metodologiska begränsningar.',
    'Enskilda observationer kan inte generaliseras till grupper.',
  ],
  interpretationGuidelines: [
    'Visa alltid konfidensintervall',
    'Redovisa lag-analys explicit',
    'Jämför med kontrollgrupper där möjligt',
    'Undvik kausalt språk',
    'Länka alltid till full metodbeskrivning',
  ],
};

/**
 * SPRÅKREGLER FÖR KÄNSLIGA VYER
 */

export const SENSITIVE_ALLOWED_LANGUAGE = {
  verbs: [
    'sammanfaller',
    'utvecklas',
    'varierar',
    'skiljer sig',
    'observeras',
    'uppmäts',
    'registreras',
    'förändras',
  ],
  comparisons: [
    'högre än',
    'lägre än',
    'liknande som',
    'skiljer sig från',
    'jämfört med',
    'i relation till',
  ],
  qualifiers: [
    'i genomsnitt',
    'aggregerat',
    'på gruppnivå',
    'statistiskt',
    'mätt som',
    'definierat som',
  ],
} as const;

export const SENSITIVE_FORBIDDEN_LANGUAGE = {
  valueWords: [
    'bättre', 'sämre', 'lyckad', 'misslyckad', 'framgångsrik',
    'problematisk', 'bekymmersam', 'utmanande', 'positiv', 'negativ',
  ],
  generalizations: [
    'alla', 'ingen', 'typisk', 'vanlig', 'normal', 'avvikande',
    'de flesta', 'många', 'få',
  ],
  causalWords: [
    'orsakar', 'leder till', 'beror på', 'resulterar i',
    'skapar', 'ger upphov till', 'ansvarar för',
  ],
  moralLabels: [
    'bidragstagare', 'belastning', 'resurs', 'tillgång', 'problem',
    'hot', 'möjlighet', 'utmaning',
  ],
} as const;

/**
 * Validera text mot förbjudna ord
 */
export function validateSensitiveLanguage(text: string): { 
  valid: boolean; 
  violations: string[] 
} {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  for (const word of SENSITIVE_FORBIDDEN_LANGUAGE.valueWords) {
    if (lowerText.includes(word)) {
      violations.push(`Värdeord: "${word}"`);
    }
  }

  for (const word of SENSITIVE_FORBIDDEN_LANGUAGE.causalWords) {
    if (lowerText.includes(word)) {
      violations.push(`Kausalt språk: "${word}"`);
    }
  }

  for (const word of SENSITIVE_FORBIDDEN_LANGUAGE.moralLabels) {
    if (lowerText.includes(word)) {
      violations.push(`Moralisk etikett: "${word}"`);
    }
  }

  return { valid: violations.length === 0, violations };
}

/**
 * NEUTRALA FORMULERINGSMALLAR
 */

export const NEUTRAL_TEMPLATES = {
  correlation: {
    positive: (kpi1: string, kpi2: string, r: number) =>
      `${kpi1} samvarierar positivt med ${kpi2} (r=${r.toFixed(2)}).`,
    negative: (kpi1: string, kpi2: string, r: number) =>
      `${kpi1} samvarierar negativt med ${kpi2} (r=${r.toFixed(2)}).`,
    none: (kpi1: string, kpi2: string) =>
      `Inget signifikant samband observeras mellan ${kpi1} och ${kpi2}.`,
  },

  demographic: {
    distribution: (dimension: string, values: { label: string; percent: number }[]) => {
      const parts = values.map(v => `${v.label} (${v.percent.toFixed(1)}%)`).join(', ');
      return `Fördelning per ${dimension}: ${parts}.`;
    },
    regional: (indicator: string, region: string, value: string) =>
      `I ${region} uppmäts ${indicator} till ${value}.`,
  },

  migration: {
    correlation: (indicator: string, lag: number) =>
      `${indicator} samvarierar med integrationstid med ${lag} månaders fördröjning.`,
    timePattern: (indicator: string, timeRange: string) =>
      `${indicator} varierar med tid i landet (${timeRange}).`,
    regional: (region: string) =>
      `I denna region sammanfaller låg sysselsättning med kort tid i landet oavsett ursprungsregion.`,
  },

  caution: {
    correlation: 'Observerat samband innebär inte orsakssamband.',
    multiple_factors: 'Flera faktorer kan bidra till observerade mönster.',
    uncertainty: (confidence: number) =>
      `Osäkerhet i data: konfidensintervall ±${((1 - confidence / 100) * 100).toFixed(0)}%.`,
  },
} as const;

// =====================================================
// EXPORT (UPDATED)
// =====================================================

export const DEPTH_MODEL_CONFIG = {
  principle: DEPTH_PRINCIPLE,
  levels: DEPTH_LEVELS,
  map: { layers: MAP_LAYERS, features: MAP_FEATURES },
  simulation: SIMULATION_CONFIG,
  causalChains: CAUSAL_CHAIN_CONFIG,
  personas: PERSONA_CONFIG,
  privacy: PRIVACY_CONFIG,
  privacyMessages: PRIVACY_MESSAGES,
  recursiveDesign: RECURSIVE_DESIGN,
  system: SYSTEM_DEFINITION,
  // DEL XXIV
  demographicPrivacy: DEMOGRAPHIC_PRIVACY_THRESHOLDS,
  demographicDimensions: DEMOGRAPHIC_DIMENSIONS,
  growthDimensions: GROWTH_DIMENSIONS,
  forbiddenCrossings: FORBIDDEN_CROSSINGS,
  migrationGrowthRules: MIGRATION_GROWTH_RULES,
  sensitiveLanguage: { allowed: SENSITIVE_ALLOWED_LANGUAGE, forbidden: SENSITIVE_FORBIDDEN_LANGUAGE },
};
