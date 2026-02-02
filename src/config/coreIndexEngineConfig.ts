/**
 * BLOCK 2: CORE INDEX ENGINE STANDARD
 * 
 * Alla index ska vara:
 * - Transparenta (visa komponenter och vikter)
 * - Klickbara (drilldown till varje indikator)
 * - Spårbara (till datapunkt och källa)
 * 
 * "En kritisk statistiker ska inte kunna säga 'jag förstår inte hur detta räknas'."
 */

// === UNIFIED INDEX SCHEMA ===

export interface IndexComponent {
  id: string;
  name: string;
  nameSv: string;
  weight: number;           // 0-1, alla vikter summerar till 1
  value: number;            // Normaliserat 0-100
  rawValue: number;         // Originalvärde
  unit: string;             // Enhet (%, per 1000, index)
  trend: 'up' | 'down' | 'stable';
  uncertainty: number;      // 0-100
  source: string;           // Källa
  lastUpdated: Date;
  methodology?: string;     // Kort metodbeskrivning
}

export interface CompositeIndex {
  id: string;
  code: string;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  
  // Beräkning
  value: number;            // 0-100 sammanvägt
  components: IndexComponent[];
  aggregationMethod: 'weighted_average' | 'geometric_mean' | 'min_of_components';
  
  // Trend
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  changeAbsolute: number;
  comparedToPeriod: string; // "2024", "Q3 2024", etc.
  
  // Kvalitet
  overallUncertainty: number;
  dataQuality: 'high' | 'medium' | 'low';
  coverageCountries: number;
  
  // Metadata
  version: string;
  lastCalculated: Date;
  methodology: {
    summary: string;
    fullDocumentUrl?: string;
  };
  
  // Disclaimers
  limitations: string[];
  whatThisIsNot: string[];
}

// === INDEX DEFINITIONS ===

export const INDEX_DEFINITIONS: Record<string, Omit<CompositeIndex, 'value' | 'components' | 'trend' | 'changePercent' | 'changeAbsolute' | 'overallUncertainty' | 'dataQuality' | 'coverageCountries' | 'lastCalculated'>> = {
  GRI: {
    id: 'gri',
    code: 'GRI',
    name: 'Global Reality Index',
    nameSv: 'Global Reality Index',
    description: 'Composite overview of global systemic status',
    descriptionSv: 'Sammansatt översikt av globalt systemiskt läge',
    aggregationMethod: 'weighted_average',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Vägt genomsnitt av sex pelare med normaliserade komponenter',
      fullDocumentUrl: '/docs/methodology/gri'
    },
    limitations: [
      'Aggregering döljer regionala skillnader',
      'Vikter är delvis subjektiva',
      'Eftersläpning i data varierar mellan indikatorer'
    ],
    whatThisIsNot: [
      'En prognos',
      'Ett mål',
      'En rekommendation',
      'Ett politiskt ställningstagande'
    ]
  },
  HWI: {
    id: 'hwi',
    code: 'HWI',
    name: 'Human Wellbeing Index',
    nameSv: 'Mänskligt Välbefinnandeindex',
    description: 'Composite measure of human flourishing',
    descriptionSv: 'Sammansatt mått på mänskligt välmående',
    aggregationMethod: 'geometric_mean',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Geometriskt medelvärde av hälsa, materiell trygghet och social tillhörighet',
      fullDocumentUrl: '/docs/methodology/hwi'
    },
    limitations: [
      'Subjektiva mått (self-reported) har kulturell variation',
      'Saknar existentiella dimensioner',
      'Aggregering till land döljer ojämlikhet'
    ],
    whatThisIsNot: [
      'Lyckomätning',
      'Rangordning av kulturer',
      'Individuell bedömning'
    ]
  },
  RESI: {
    id: 'resi',
    code: 'RESI',
    name: 'Resilience Index',
    nameSv: 'Resiliensindex',
    description: 'Capacity to absorb and recover from shocks',
    descriptionSv: 'Kapacitet att absorbera och återhämta sig från chocker',
    aggregationMethod: 'min_of_components',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Minimum av institutionell, ekonomisk och social resiliens (kedjan är så stark som svagaste länk)',
      fullDocumentUrl: '/docs/methodology/resi'
    },
    limitations: [
      'Retrospektiv - mäter inte otestad resiliens',
      'Chocker varierar i typ',
      'Saknar framtidsperspektiv'
    ],
    whatThisIsNot: [
      'Förmåga att undvika kriser',
      'Garanti mot framtida problem'
    ]
  },
  IBI: {
    id: 'ibi',
    code: 'IBI',
    name: 'Intergenerational Burden Index',
    nameSv: 'Intergenerationell Belastningsindex',
    description: 'Measure of burden transferred to future generations',
    descriptionSv: 'Mått på belastning som överförs till framtida generationer',
    aggregationMethod: 'weighted_average',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Vägt genomsnitt av skuld, klimatpåverkan, resurstömning och demografisk obalans',
      fullDocumentUrl: '/docs/methodology/ibi'
    },
    limitations: [
      'Framtidsprojektion innebär osäkerhet',
      'Teknologiska genombrott kan förändra bilden',
      '"Börda" är delvis normativt'
    ],
    whatThisIsNot: [
      'Moralisk dom över nuvarande generation',
      'Prognos om framtiden'
    ]
  },
  ICI: {
    id: 'ici',
    code: 'ICI',
    name: 'Institutional Capacity Index',
    nameSv: 'Institutionell Kapacitetsindex',
    description: 'Ability of institutions to function and deliver',
    descriptionSv: 'Institutioners förmåga att fungera och leverera',
    aggregationMethod: 'weighted_average',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Vägt genomsnitt av genomförandeförmåga, legitimitet och anpassningsbarhet',
      fullDocumentUrl: '/docs/methodology/ici'
    },
    limitations: [
      'Mäter observerbar output, inte potential',
      'Kulturella skillnader i institutionsformer',
      'Svårt att fånga informella institutioner'
    ],
    whatThisIsNot: [
      'Rangordning av politiska system',
      'Kvalitetsstämpel på styrelseskick'
    ]
  },
  ERI: {
    id: 'eri',
    code: 'ERI',
    name: 'Energy Reality Index',
    nameSv: 'Energi Reality Index',
    description: 'Comprehensive view of energy security and transition',
    descriptionSv: 'Samlad bild av energitrygghet och omställning',
    aggregationMethod: 'weighted_average',
    comparedToPeriod: '2024',
    version: '1.0.0',
    methodology: {
      summary: 'Vägt genomsnitt av tillgång, kostnad, stabilitet och förnybar kapacitet',
      fullDocumentUrl: '/docs/methodology/eri'
    },
    limitations: [
      'Snabb teknisk utveckling kan förändra bilden',
      'Geopolitisk situation är volatil',
      'Eftersläpning i förnybar data'
    ],
    whatThisIsNot: [
      'Rekommendation om energimix',
      'Prognos om energipriser'
    ]
  }
};

// === STANDARD COMPONENTS PER INDEX ===

export const INDEX_COMPONENTS: Record<string, { id: string; name: string; nameSv: string; defaultWeight: number; unit: string }[]> = {
  GRI: [
    { id: 'hwi', name: 'Human Wellbeing', nameSv: 'Mänskligt välbefinnande', defaultWeight: 0.20, unit: 'index' },
    { id: 'energy', name: 'Energy & Capacity', nameSv: 'Energi & bärkraft', defaultWeight: 0.15, unit: 'index' },
    { id: 'economic', name: 'Economic Space', nameSv: 'Ekonomiskt utrymme', defaultWeight: 0.20, unit: 'index' },
    { id: 'demographic', name: 'Demographic Balance', nameSv: 'Demografisk balans', defaultWeight: 0.15, unit: 'index' },
    { id: 'institutional', name: 'Institutional Capacity', nameSv: 'Institutionell kapacitet', defaultWeight: 0.15, unit: 'index' },
    { id: 'stability', name: 'Global Stability', nameSv: 'Global stabilitet', defaultWeight: 0.15, unit: 'index' }
  ],
  HWI: [
    { id: 'life_exp', name: 'Life Expectancy', nameSv: 'Förväntad livslängd', defaultWeight: 0.25, unit: 'år' },
    { id: 'health', name: 'Health Outcomes', nameSv: 'Hälsoutfall', defaultWeight: 0.25, unit: 'index' },
    { id: 'material', name: 'Material Security', nameSv: 'Materiell trygghet', defaultWeight: 0.25, unit: 'index' },
    { id: 'social', name: 'Social Connection', nameSv: 'Social tillhörighet', defaultWeight: 0.25, unit: 'index' }
  ],
  RESI: [
    { id: 'institutional', name: 'Institutional Resilience', nameSv: 'Institutionell resiliens', defaultWeight: 0.33, unit: 'index' },
    { id: 'economic', name: 'Economic Resilience', nameSv: 'Ekonomisk resiliens', defaultWeight: 0.33, unit: 'index' },
    { id: 'social', name: 'Social Resilience', nameSv: 'Social resiliens', defaultWeight: 0.34, unit: 'index' }
  ],
  IBI: [
    { id: 'debt', name: 'Debt Burden', nameSv: 'Skuldbelastning', defaultWeight: 0.25, unit: '% BNP' },
    { id: 'climate', name: 'Climate Impact', nameSv: 'Klimatpåverkan', defaultWeight: 0.30, unit: 'ton CO2e' },
    { id: 'resources', name: 'Resource Depletion', nameSv: 'Resurstömning', defaultWeight: 0.20, unit: 'index' },
    { id: 'demographic', name: 'Demographic Imbalance', nameSv: 'Demografisk obalans', defaultWeight: 0.25, unit: 'kvot' }
  ],
  ICI: [
    { id: 'implementation', name: 'Implementation Ability', nameSv: 'Genomförandeförmåga', defaultWeight: 0.35, unit: 'index' },
    { id: 'legitimacy', name: 'Legitimacy', nameSv: 'Legitimitet', defaultWeight: 0.35, unit: 'index' },
    { id: 'adaptability', name: 'Adaptability', nameSv: 'Anpassningsbarhet', defaultWeight: 0.30, unit: 'index' }
  ],
  ERI: [
    { id: 'access', name: 'Energy Access', nameSv: 'Energitillgång', defaultWeight: 0.25, unit: 'kWh/capita' },
    { id: 'cost', name: 'Energy Cost', nameSv: 'Energikostnad', defaultWeight: 0.25, unit: 'index' },
    { id: 'stability', name: 'Supply Stability', nameSv: 'Försörjningsstabilitet', defaultWeight: 0.25, unit: 'index' },
    { id: 'renewable', name: 'Renewable Capacity', nameSv: 'Förnybar kapacitet', defaultWeight: 0.25, unit: '%' }
  ]
};

// === HELPER FUNCTIONS ===

export const calculateWeightedAverage = (components: IndexComponent[]): number => {
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;
  
  return components.reduce((sum, c) => sum + (c.value * c.weight), 0) / totalWeight;
};

export const calculateGeometricMean = (components: IndexComponent[]): number => {
  if (components.length === 0) return 0;
  
  const product = components.reduce((prod, c) => prod * Math.max(0.01, c.value), 1);
  return Math.pow(product, 1 / components.length);
};

export const calculateMinOfComponents = (components: IndexComponent[]): number => {
  if (components.length === 0) return 0;
  return Math.min(...components.map(c => c.value));
};

export const calculateIndexValue = (
  components: IndexComponent[], 
  method: CompositeIndex['aggregationMethod']
): number => {
  switch (method) {
    case 'weighted_average':
      return calculateWeightedAverage(components);
    case 'geometric_mean':
      return calculateGeometricMean(components);
    case 'min_of_components':
      return calculateMinOfComponents(components);
    default:
      return calculateWeightedAverage(components);
  }
};

export const getIndexDefinition = (code: string) => INDEX_DEFINITIONS[code];
export const getIndexComponents = (code: string) => INDEX_COMPONENTS[code] || [];
