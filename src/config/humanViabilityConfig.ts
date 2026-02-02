// Human Viability Engine (HVE) Configuration
// "Hur bra fungerar civilisationen för människor – givet verkliga begränsningar?"

// === BLOCK 1: ONTOLOGICAL ASSUMPTIONS ===
// These are declared, not hidden

export interface OntologicalAssumption {
  id: string;
  statement: string;
  implication: string;
  evidenceBasis: string;
}

export const CORE_ASSUMPTIONS: OntologicalAssumption[] = [
  {
    id: 'bio-constant',
    statement: 'Människan är biologiskt konstant (≈300 000 år)',
    implication: 'Våra kognitiva och sociala mönster upprepas oavsett teknologisk kontext',
    evidenceBasis: 'Paleoantropologi, genetik, beteendeforskning'
  },
  {
    id: 'cyclic-civilizations',
    statement: 'Civilisationer är cykliska',
    implication: 'Uppgång, mognad och omvandling är normala faser, inte undantag',
    evidenceBasis: 'Arkeologi, historisk analys av 50+ civilisationer'
  },
  {
    id: 'energy-prerequisite',
    statement: 'Energi är en förutsättning för mänskligt välbefinnande',
    implication: 'Utan tillräcklig energi per capita kollapsar komplexitet och livskvalitet',
    evidenceBasis: 'Termodynamik, ekonomisk historia, utvecklingsdata'
  },
  {
    id: 'no-perfect-sustainability',
    statement: 'Perfekt hållbarhet existerar inte – bara hanterbar belastning',
    implication: 'All mänsklig aktivitet har kostnad; frågan är om belastningen är acceptabel',
    evidenceBasis: 'Ekologi, entropi, resursteori'
  },
  {
    id: 'transparency-accountability',
    statement: 'Transparens är en förutsättning för ansvar',
    implication: 'Utan synlighet kan varken kollektiv eller individ hållas ansvarig',
    evidenceBasis: 'Institutionell teori, demokratiforskning'
  },
  {
    id: 'birth-debt-failure',
    statement: 'Skuld vid födsel är ett strukturellt misslyckande',
    implication: 'Varje generation som ärver större skuld än föregående har berövats handlingsutrymme',
    evidenceBasis: 'Intergenerationell ekonomi, etik'
  }
];

// === BLOCK 2: CORE QUESTION ===
export const CORE_QUESTION = `Givet tillgänglig energi, resurser och institutionell kapacitet – 
hur bra lever människor just nu, och hur förändras detta över tid?`;

// === BLOCK 3: HUMAN WELL-BEING INDEX (HWI) ===

export interface HWIComponent {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  weight: number;
  dataPoints: string[];
  inverted: boolean; // true = lower is better
}

export const HWI_COMPONENTS: HWIComponent[] = [
  {
    id: 'physical-health',
    name: 'Physical Health',
    nameSv: 'Fysisk hälsa',
    description: 'Livslängd, sjukdomsbörda, tillgång till vård',
    weight: 0.15,
    dataPoints: ['life_expectancy', 'healthy_life_years', 'healthcare_access', 'preventable_deaths'],
    inverted: false
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    nameSv: 'Psykisk hälsa',
    description: 'Psykisk ohälsa, ensamhet, meningsfullhet',
    weight: 0.12,
    dataPoints: ['depression_prevalence', 'suicide_rate', 'loneliness_index', 'life_satisfaction'],
    inverted: false
  },
  {
    id: 'material-security',
    name: 'Material Security',
    nameSv: 'Materiell trygghet',
    description: 'Boende, mat, basala behov',
    weight: 0.15,
    dataPoints: ['poverty_rate', 'housing_stability', 'food_security', 'basic_needs_met'],
    inverted: false
  },
  {
    id: 'future-prospects',
    name: 'Future Prospects',
    nameSv: 'Framtidsutsikter (barn, unga)',
    description: 'Utbildning, sysselsättning, möjligheter för unga',
    weight: 0.12,
    dataPoints: ['youth_unemployment', 'education_quality', 'intergenerational_mobility', 'youth_optimism'],
    inverted: false
  },
  {
    id: 'autonomy',
    name: 'Autonomy & Agency',
    nameSv: 'Autonomi & handlingsutrymme',
    description: 'Frihet att forma sitt liv, rörlighet, val',
    weight: 0.10,
    dataPoints: ['personal_freedom_index', 'economic_mobility', 'regulatory_burden', 'choice_availability'],
    inverted: false
  },
  {
    id: 'social-stability',
    name: 'Social Stability',
    nameSv: 'Social stabilitet',
    description: 'Tillit, säkerhet, sammanhållning',
    weight: 0.12,
    dataPoints: ['social_trust', 'crime_rate', 'community_cohesion', 'institutional_trust'],
    inverted: false
  },
  {
    id: 'energy-access',
    name: 'Energy Access',
    nameSv: 'Energitillgång per capita',
    description: 'Tillgänglig energi för liv och arbete',
    weight: 0.12,
    dataPoints: ['energy_per_capita', 'energy_affordability', 'energy_reliability', 'energy_poverty'],
    inverted: false
  },
  {
    id: 'debt-pressure',
    name: 'Debt Pressure',
    nameSv: 'Skuldtryck (individ + kollektiv)',
    description: 'Skuldbörda som begränsar handlingsutrymme',
    weight: 0.12,
    dataPoints: ['public_debt_per_capita', 'household_debt', 'pension_gap', 'infrastructure_deficit'],
    inverted: true // lower debt = better
  }
];

// === BLOCK 4: BORN WITH DEBT DETECTOR ===

export type DebtLevel = 'low' | 'moderate' | 'high' | 'unsustainable';

export interface BirthDebtAssessment {
  level: DebtLevel;
  publicDebtPerCapita: number;
  pensionGap: number;
  infrastructureDeficit: number;
  ecologicalDebt: number;
  totalBurdenIndex: number;
  description: string;
}

export const DEBT_LEVEL_THRESHOLDS: Record<DebtLevel, { max: number; description: string; color: string }> = {
  low: {
    max: 25,
    description: 'Ny generation ärver hanterbar strukturell belastning',
    color: 'hsl(var(--success))'
  },
  moderate: {
    max: 50,
    description: 'Strukturell belastning kräver uppmärksamhet men är hanterbar',
    color: 'hsl(var(--warning))'
  },
  high: {
    max: 75,
    description: 'Betydande strukturell belastning begränsar framtida handlingsutrymme',
    color: 'hsl(var(--destructive))'
  },
  unsustainable: {
    max: 100,
    description: 'Ohållbar strukturell belastning – nuvarande kurs kan inte upprätthållas',
    color: 'hsl(var(--destructive))'
  }
};

export interface DebtComponent {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  unit: string;
  weight: number;
}

export const DEBT_COMPONENTS: DebtComponent[] = [
  {
    id: 'public-debt',
    name: 'Public Debt per Capita',
    nameSv: 'Statsskuld per capita',
    description: 'Ackumulerad offentlig skuld fördelad på befolkning',
    unit: 'SEK',
    weight: 0.30
  },
  {
    id: 'pension-gap',
    name: 'Pension Gap',
    nameSv: 'Pensionsgap',
    description: 'Skillnad mellan utlovade pensioner och finansiering',
    unit: 'SEK per capita',
    weight: 0.25
  },
  {
    id: 'infrastructure-deficit',
    name: 'Infrastructure Deficit',
    nameSv: 'Infrastrukturellt underhållsunderskott',
    description: 'Uppskjutet underhåll av vägar, järnvägar, VA, elnät',
    unit: 'SEK per capita',
    weight: 0.25
  },
  {
    id: 'ecological-debt',
    name: 'Ecological Debt',
    nameSv: 'Ekologisk skuld',
    description: 'Resursutarmning och miljöskuld som framtida generationer ärver',
    unit: 'index 0-100',
    weight: 0.20
  }
];

// === BLOCK 5: ENERGY REALITY LAYER ===

export interface EnergyRealityData {
  energyPerCapita: number; // kWh/year
  energySources: EnergySource[];
  energyCost: number; // % of income
  importDependency: number; // %
  gridReliability: number; // % uptime
  scarcityRisk: 'low' | 'moderate' | 'elevated' | 'critical';
}

export interface EnergySource {
  type: string;
  share: number;
  reliability: number;
  cost: number;
  carbonIntensity: number;
  tradeoffs: string[];
}

export const ENERGY_TRUTHS = [
  'Människor behöver värme',
  'Människor behöver transporter',
  'Människor behöver industri',
  'Energi = civilisationens blodomlopp',
  'Varje energikälla har trade-offs',
  'Ingen energikälla är "gratis" eller "ren" i absolut mening'
];

export interface EnergyScarcityScenario {
  trigger: string;
  probability: 'low' | 'moderate' | 'high';
  humanImpact: string;
  timeframe: string;
}

// === BLOCK 6: POPULATION × ENERGY × WELL-BEING TRIANGLE ===

export interface TriangleBalance {
  population: number;
  energyPerCapita: number;
  institutionalEfficiency: number;
  overallBalance: 'balanced' | 'strained' | 'critical';
  bottleneck: 'none' | 'population' | 'energy' | 'institutions' | 'multiple';
  explanation: string;
}

export const TRIANGLE_THRESHOLDS = {
  population: {
    sustainable: 'Befolkning i balans med tillgängliga resurser',
    strained: 'Befolkningstryck överstiger resurskapacitet',
    critical: 'Befolkning långt över bärkraft givet nuvarande system'
  },
  energy: {
    sustainable: 'Energitillgång möter behov',
    strained: 'Energibrist begränsar utveckling',
    critical: 'Energikris hotar grundläggande funktioner'
  },
  institutions: {
    sustainable: 'Institutioner fungerar effektivt',
    strained: 'Institutionell kapacitet överskreds',
    critical: 'Systemisk institutionell svikt'
  }
};

// === BLOCK 7: IF NOTHING CHANGES PROJECTION ===

export interface TrendProjection {
  horizon: '5y' | '10y' | '25y';
  direction: 'improving' | 'stable' | 'declining' | 'accelerating_decline';
  confidence: number;
  keyDrivers: string[];
  humanOutcome: string;
  uncertainties: string[];
}

export const PROJECTION_LANGUAGE = {
  improving: 'pekar data på förbättring av mänskligt välbefinnande',
  stable: 'indikerar data fortsatt stabilitet',
  declining: 'pekar data på gradvis försämring',
  accelerating_decline: 'visar data på accelererande försämring'
};

// === BLOCK 8: SHARED RESPONSIBILITY VIEW ===

export const RESPONSIBILITY_FRAMING = {
  notPolitician: 'Detta är inte "politikerns problem"',
  notMarket: 'Detta är inte "marknadens problem"',
  notPeople: 'Detta är inte "folkets fel"',
  shared: 'Detta är det gemensamma utfallet av hur systemet är byggt.'
};

export interface ResponsibilityDistribution {
  structural: number; // % attributable to system design
  political: number; // % attributable to policy choices
  market: number; // % attributable to market dynamics
  behavioral: number; // % attributable to individual choices
  external: number; // % attributable to external factors
  explanation: string;
}

// === BLOCK 9: NATIONAL STATUS ===

export type NationalStatus = 'stable' | 'concerning' | 'critical' | 'crisis';

export interface NationalStatusAssessment {
  status: NationalStatus;
  headline: string;
  explanation: string;
  keyIndicators: {
    name: string;
    trend: 'improving' | 'stable' | 'declining';
    severity: 'low' | 'moderate' | 'high';
  }[];
  actionSpaceRemaining: 'ample' | 'limited' | 'narrow' | 'minimal';
  uncertainties: string[];
  dataQuality: number;
}

export const STATUS_DEFINITIONS: Record<NationalStatus, { label: string; description: string; color: string }> = {
  stable: {
    label: 'Stabilt',
    description: 'Centrala indikatorer visar stabil eller positiv utveckling',
    color: 'hsl(var(--success))'
  },
  concerning: {
    label: 'Oroande',
    description: 'Flera indikatorer visar negativ trend som kräver uppmärksamhet',
    color: 'hsl(var(--warning))'
  },
  critical: {
    label: 'Kritiskt',
    description: 'Flera centrala indikatorer försämras samtidigt, handlingsutrymmet minskar',
    color: 'hsl(var(--destructive))'
  },
  crisis: {
    label: 'Kris',
    description: 'Akut systemisk stress, omedelbar handling krävs',
    color: 'hsl(var(--destructive))'
  }
};

// === BLOCK 10: SYSTEM PURPOSE ===

export const SYSTEM_PURPOSE = {
  not: [
    'kontroll',
    'övervakning', 
    'central styrning',
    'politisk agenda',
    'moralisk dom'
  ],
  is: 'Att göra verkligheten så tydlig att ansvar inte längre kan undvikas – kollektivt eller individuellt.',
  for: ['nationer', 'regioner', 'världen'],
  principle: `Människor gör inte ingenting för att de är onda.
De gör ingenting för att de inte förstår vad som faktiskt händer.

Det här systemet är byggt för att ingen längre ska kunna säga "jag visste inte" –
samtidigt som det respekterar att beslut alltid är mänskliga.`
};

// === EXAMPLE DATA ===

export const EXAMPLE_SWEDEN_HVE: {
  hwi: { componentId: string; value: number; trend: 'up' | 'down' | 'stable' }[];
  birthDebt: BirthDebtAssessment;
  energy: EnergyRealityData;
  triangle: TriangleBalance;
  projection: TrendProjection;
  nationalStatus: NationalStatusAssessment;
} = {
  hwi: [
    { componentId: 'physical-health', value: 78, trend: 'stable' },
    { componentId: 'mental-health', value: 62, trend: 'down' },
    { componentId: 'material-security', value: 71, trend: 'down' },
    { componentId: 'future-prospects', value: 58, trend: 'down' },
    { componentId: 'autonomy', value: 74, trend: 'stable' },
    { componentId: 'social-stability', value: 65, trend: 'down' },
    { componentId: 'energy-access', value: 82, trend: 'down' },
    { componentId: 'debt-pressure', value: 45, trend: 'down' } // inverted: lower is worse here means higher debt
  ],
  birthDebt: {
    level: 'high',
    publicDebtPerCapita: 485000,
    pensionGap: 120000,
    infrastructureDeficit: 95000,
    ecologicalDebt: 62,
    totalBurdenIndex: 68,
    description: 'Betydande strukturell belastning begränsar framtida handlingsutrymme'
  },
  energy: {
    energyPerCapita: 52000,
    energySources: [
      { type: 'Kärnkraft', share: 30, reliability: 92, cost: 0.45, carbonIntensity: 12, tradeoffs: ['Avfall', 'Investeringskostnad', 'Politisk osäkerhet'] },
      { type: 'Vattenkraft', share: 40, reliability: 88, cost: 0.25, carbonIntensity: 4, tradeoffs: ['Väderberoende', 'Ekosystempåverkan', 'Begränsad expansion'] },
      { type: 'Vindkraft', share: 18, reliability: 35, cost: 0.38, carbonIntensity: 11, tradeoffs: ['Intermittent', 'Markanvändning', 'Balanseringsbehov'] },
      { type: 'Fossil', share: 8, reliability: 95, cost: 0.85, carbonIntensity: 450, tradeoffs: ['Utsläpp', 'Importberoende', 'Prisvolatilitet'] },
      { type: 'Övrigt', share: 4, reliability: 60, cost: 0.55, carbonIntensity: 25, tradeoffs: ['Varierande'] }
    ],
    energyCost: 8.5,
    importDependency: 12,
    gridReliability: 99.2,
    scarcityRisk: 'moderate'
  },
  triangle: {
    population: 10.5,
    energyPerCapita: 52000,
    institutionalEfficiency: 72,
    overallBalance: 'strained',
    bottleneck: 'institutions',
    explanation: 'Institutionell kapacitet når inte längre upp till befolkningens behov. Energitillgång är tillfredställande men minskar per capita.'
  },
  projection: {
    horizon: '10y',
    direction: 'declining',
    confidence: 0.68,
    keyDrivers: [
      'Ökande försörjningskvot',
      'Minskande energiproduktion per capita',
      'Ackumulerat infrastrukturunderskott',
      'Fallande social tillit'
    ],
    humanOutcome: 'Om observerade trender fortsätter, pekar data på gradvis försämring av materiell trygghet och framtidsutsikter för yngre generationer.',
    uncertainties: [
      'Teknologiska genombrott',
      'Policyförändringar',
      'Externa chocker',
      'Demografisk utveckling'
    ]
  },
  nationalStatus: {
    status: 'concerning',
    headline: 'Nationellt läge: Oroande',
    explanation: 'Flera centrala indikatorer visar negativ trend. Handlingsutrymmet minskar men är fortfarande betydande.',
    keyIndicators: [
      { name: 'Psykisk ohälsa (15-29 år)', trend: 'declining', severity: 'high' },
      { name: 'Bostadstillgänglighet', trend: 'declining', severity: 'high' },
      { name: 'Social tillit', trend: 'declining', severity: 'moderate' },
      { name: 'Energi per capita', trend: 'declining', severity: 'moderate' },
      { name: 'Vårdens tillgänglighet', trend: 'declining', severity: 'moderate' },
      { name: 'Medellivslängd', trend: 'stable', severity: 'low' }
    ],
    actionSpaceRemaining: 'limited',
    uncertainties: [
      'Datakvalitet varierar mellan indikatorer',
      'Vissa trender kan vara konjunkturella',
      'Externa faktorer kan förändra bilden'
    ],
    dataQuality: 0.78
  }
};
