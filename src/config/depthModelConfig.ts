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
// EXPORT
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
};
