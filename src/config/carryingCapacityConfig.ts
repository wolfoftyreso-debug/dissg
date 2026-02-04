/**
 * GLOBAL CARRYING CAPACITY ENGINE (GCCE)
 * 
 * "Hur många människor kan leva bra – givet energi, teknik och resurser?"
 * 
 * Inte ideologi. Inte klimatmoral. Inte tillväxtoptimism.
 * Bara fysik, biologi, teknik och mänskligt välbefinnande.
 */

// === 1. GRUNDDEFINITION ===

export const GCCE_CORE_DEFINITION = {
  sv: 'Hur många människor kan leva ett bra liv på jorden? Det beror på tre saker: hur mycket energi vi har, hur smart vår teknik är, och hur bra vi är på att samarbeta.',
  en: 'How many people can live well on Earth? It depends on three things: how much energy we have, how smart our technology is, and how well we cooperate.'
};

// Simplified "what this is NOT" for 15-year-olds
export const GCCE_NOT_DEFINITIONS = [
  { 
    sv: 'Inte "flest möjliga människor"', 
    en: 'Not "maximum number of people"',
    explanation: 'Vi räknar inte hur många som kan överleva på existensminimum – vi räknar hur många som kan leva bra.'
  },
  { 
    sv: 'Inte "mest pengar"', 
    en: 'Not "most money"',
    explanation: 'BNP mäter ekonomisk aktivitet, inte om människor faktiskt mår bra. Vi fokuserar på livskvalitet.'
  },
  { 
    sv: 'Tänker på framtiden', 
    en: 'Thinking about the future',
    explanation: 'Vi får inte förstöra för nästa generation. Deras chanser räknas lika mycket som våra.'
  }
];

// === 2. DE TRE OBRYTBARA AXLARNA ===

export interface CapacityAxis {
  id: 'energy' | 'technology' | 'institutions';
  icon: string;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  components: { id: string; label: string; labelSv: string }[];
}

export const CAPACITY_AXES: CapacityAxis[] = [
  {
    id: 'energy',
    icon: '⚡',
    label: 'Energy per Capita',
    labelSv: 'Energi per capita',
    description: 'Available energy, stability, cost, and quality',
    descriptionSv: 'Tillgänglig energi, stabilitet, kostnad och kvalitet',
    components: [
      { id: 'available', label: 'Available energy', labelSv: 'Tillgänglig energi' },
      { id: 'stability', label: 'Supply stability', labelSv: 'Stabilitet' },
      { id: 'cost', label: 'Cost', labelSv: 'Kostnad' },
      { id: 'quality', label: 'Quality (continuous vs intermittent)', labelSv: 'Kvalitet (kontinuerlig vs intermittent)' }
    ]
  },
  {
    id: 'technology',
    icon: '🧠',
    label: 'Technical Efficiency',
    labelSv: 'Teknisk effektivitet',
    description: 'How efficiently energy is converted to human needs',
    descriptionSv: 'Hur effektivt energi omvandlas till mänskliga behov',
    components: [
      { id: 'food', label: 'Food production', labelSv: 'Mat' },
      { id: 'housing', label: 'Housing', labelSv: 'Bostäder' },
      { id: 'transport', label: 'Transportation', labelSv: 'Transporter' },
      { id: 'healthcare', label: 'Healthcare', labelSv: 'Vård' },
      { id: 'infrastructure', label: 'Infrastructure', labelSv: 'Infrastruktur' }
    ]
  },
  {
    id: 'institutions',
    icon: '🏛️',
    label: 'Institutional Capacity',
    labelSv: 'Institutionell kapacitet',
    description: 'Ability to organize, reduce waste, handle conflicts, execute decisions',
    descriptionSv: 'Förmåga att organisera, minska slöseri, hantera konflikter, genomföra beslut',
    components: [
      { id: 'organize', label: 'Organizational ability', labelSv: 'Organisationsförmåga' },
      { id: 'efficiency', label: 'Waste reduction', labelSv: 'Minska slöseri' },
      { id: 'conflict', label: 'Conflict handling', labelSv: 'Konflikthantering' },
      { id: 'execution', label: 'Decision execution', labelSv: 'Beslutsgenomförande' }
    ]
  }
];

// === 3. GLOBAL DATA (MOCK) ===

export interface GlobalCapacityData {
  population: {
    current: number;
    unit: string;
    trend: 'growing' | 'stable' | 'declining';
    growthRate: number;
  };
  energyPerCapita: {
    value: number;
    unit: string;
    trend: 'growing' | 'stable' | 'declining';
    changePercent: number;
  };
  technicalEfficiency: {
    index: number;
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
  };
  institutionalQuality: {
    index: number;
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
  };
  humanWellbeing: {
    index: number;
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
  };
  estimatedCapacity: {
    sustainable: [number, number]; // range in billions
    current: number;
    margin: 'positive' | 'neutral' | 'negative';
  };
}

export const GLOBAL_CAPACITY_DATA: GlobalCapacityData = {
  population: {
    current: 8.1,
    unit: 'billion',
    trend: 'growing',
    growthRate: 0.83
  },
  energyPerCapita: {
    value: 21.3,
    unit: 'MWh/year',
    trend: 'stable',
    changePercent: 0.2
  },
  technicalEfficiency: {
    index: 67,
    trend: 'improving',
    changePercent: 1.2
  },
  institutionalQuality: {
    index: 54,
    trend: 'declining',
    changePercent: -0.8
  },
  humanWellbeing: {
    index: 62,
    trend: 'stable',
    changePercent: 0.1
  },
  estimatedCapacity: {
    sustainable: [6, 10],
    current: 8.1,
    margin: 'neutral'
  }
};

// === 4. PRESS ZONES ===

export interface PressZone {
  id: string;
  region: string;
  regionSv: string;
  severity: 'high' | 'moderate' | 'emerging';
  factors: {
    energyPressure: boolean;
    populationGrowth: boolean;
    institutionalWeakness: boolean;
  };
  description: string;
  descriptionSv: string;
}

export const PRESS_ZONES: PressZone[] = [
  {
    id: 'sahel',
    region: 'Sahel Region',
    regionSv: 'Sahelregionen',
    severity: 'high',
    factors: {
      energyPressure: true,
      populationGrowth: true,
      institutionalWeakness: true
    },
    description: 'All three pressure factors present simultaneously',
    descriptionSv: 'Alla tre tryckfaktorer närvarande samtidigt'
  },
  {
    id: 'south_asia',
    region: 'South Asia',
    regionSv: 'Sydasien',
    severity: 'moderate',
    factors: {
      energyPressure: true,
      populationGrowth: true,
      institutionalWeakness: false
    },
    description: 'Energy and population pressure, institutions adapting',
    descriptionSv: 'Energi- och befolkningstryck, institutioner anpassar sig'
  },
  {
    id: 'central_america',
    region: 'Central America',
    regionSv: 'Centralamerika',
    severity: 'moderate',
    factors: {
      energyPressure: false,
      populationGrowth: false,
      institutionalWeakness: true
    },
    description: 'Institutional capacity primary constraint',
    descriptionSv: 'Institutionell kapacitet primär begränsning'
  },
  {
    id: 'mena',
    region: 'Middle East & North Africa',
    regionSv: 'Mellanöstern & Nordafrika',
    severity: 'emerging',
    factors: {
      energyPressure: false,
      populationGrowth: true,
      institutionalWeakness: true
    },
    description: 'Population growth outpacing institutional adaptation',
    descriptionSv: 'Befolkningstillväxt snabbare än institutionell anpassning'
  }
];

// === 5. WHAT INCREASES CARRYING CAPACITY ===

export interface CapacityFactor {
  id: string;
  label: string;
  labelSv: string;
  impact: 'high' | 'moderate' | 'low';
  timeframe: string;
  timeframeSv: string;
  description: string;
  descriptionSv: string;
  historicalEvidence: boolean;
}

export const POSITIVE_FACTORS: CapacityFactor[] = [
  {
    id: 'stable_energy',
    label: 'More stable energy',
    labelSv: 'Mer stabil energi',
    impact: 'high',
    timeframe: 'Years to decades',
    timeframeSv: 'År till decennier',
    description: 'Reliable baseload power enables industrial and agricultural stability',
    descriptionSv: 'Pålitlig baslasteenergi möjliggör industriell och jordbruksmässig stabilitet',
    historicalEvidence: true
  },
  {
    id: 'cheaper_energy',
    label: 'Cheaper energy',
    labelSv: 'Billigare energi',
    impact: 'high',
    timeframe: 'Years',
    timeframeSv: 'År',
    description: 'Lower energy costs directly improve living standards and production',
    descriptionSv: 'Lägre energikostnader förbättrar direkt levnadsstandard och produktion',
    historicalEvidence: true
  },
  {
    id: 'efficient_tech',
    label: 'More efficient technology',
    labelSv: 'Effektivare teknik',
    impact: 'high',
    timeframe: 'Decades',
    timeframeSv: 'Decennier',
    description: 'More output per energy unit multiplies system capacity',
    descriptionSv: 'Mer output per energienhet multiplicerar systemkapacitet',
    historicalEvidence: true
  },
  {
    id: 'better_organization',
    label: 'Better organization',
    labelSv: 'Bättre organisation',
    impact: 'moderate',
    timeframe: 'Decades',
    timeframeSv: 'Decennier',
    description: 'Reduced waste and better coordination increase effective capacity',
    descriptionSv: 'Minskat slöseri och bättre koordination ökar effektiv kapacitet',
    historicalEvidence: true
  }
];

// === 6. ENERGY HONESTY STATEMENTS ===

export const ENERGY_HONESTY = {
  baseline: {
    sv: 'Denna levnadsnivå kräver ungefär {x} MWh energi per person och år.',
    en: 'This living standard requires approximately {x} MWh of energy per person per year.'
  },
  consequence: {
    sv: 'Om energitillgången minskar utan motsvarande effektivisering, sjunker levnadsförmågan.',
    en: 'If energy supply decreases without corresponding efficiency gains, living ability declines.'
  },
  physics: {
    sv: 'Detta är fysik, inte politik.',
    en: 'This is physics, not politics.'
  }
};

// === 7. REGIONAL DATA ===

export interface RegionalCapacity {
  id: string;
  name: string;
  nameSv: string;
  population: number;
  localCapacity: number; // percentage that is locally produced
  importedCapacity: number; // percentage imported
  vulnerabilityIndex: number; // 0-100
  energyPerCapita: number;
}

export const REGIONAL_CAPACITY_DATA: RegionalCapacity[] = [
  {
    id: 'europe',
    name: 'Europe',
    nameSv: 'Europa',
    population: 750,
    localCapacity: 65,
    importedCapacity: 35,
    vulnerabilityIndex: 42,
    energyPerCapita: 32.5
  },
  {
    id: 'north_america',
    name: 'North America',
    nameSv: 'Nordamerika',
    population: 380,
    localCapacity: 92,
    importedCapacity: 8,
    vulnerabilityIndex: 18,
    energyPerCapita: 58.2
  },
  {
    id: 'east_asia',
    name: 'East Asia',
    nameSv: 'Östasien',
    population: 1600,
    localCapacity: 45,
    importedCapacity: 55,
    vulnerabilityIndex: 58,
    energyPerCapita: 28.4
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    nameSv: 'Sydasien',
    population: 1900,
    localCapacity: 78,
    importedCapacity: 22,
    vulnerabilityIndex: 65,
    energyPerCapita: 8.2
  },
  {
    id: 'africa',
    name: 'Africa',
    nameSv: 'Afrika',
    population: 1400,
    localCapacity: 85,
    importedCapacity: 15,
    vulnerabilityIndex: 72,
    energyPerCapita: 4.8
  },
  {
    id: 'latin_america',
    name: 'Latin America',
    nameSv: 'Latinamerika',
    population: 660,
    localCapacity: 88,
    importedCapacity: 12,
    vulnerabilityIndex: 38,
    energyPerCapita: 18.6
  }
];

// === 8. HISTORICAL TIMELINE ===

export interface HistoricalPoint {
  year: number;
  population: number;
  energyPerCapita: number;
  techEfficiency: number;
  note: string;
  noteSv: string;
}

export const HISTORICAL_TIMELINE: HistoricalPoint[] = [
  { year: 1800, population: 1.0, energyPerCapita: 2.5, techEfficiency: 10, note: 'Pre-industrial', noteSv: 'Förindustriell' },
  { year: 1850, population: 1.3, energyPerCapita: 3.2, techEfficiency: 15, note: 'Early industrialization', noteSv: 'Tidig industrialisering' },
  { year: 1900, population: 1.6, energyPerCapita: 5.8, techEfficiency: 25, note: 'Industrial revolution impact', noteSv: 'Industriella revolutionens effekt' },
  { year: 1950, population: 2.5, energyPerCapita: 12.4, techEfficiency: 40, note: 'Post-war expansion', noteSv: 'Efterkrigsexpansion' },
  { year: 1975, population: 4.1, energyPerCapita: 18.2, techEfficiency: 52, note: 'Green revolution', noteSv: 'Gröna revolutionen' },
  { year: 2000, population: 6.1, energyPerCapita: 20.5, techEfficiency: 62, note: 'Digital era begins', noteSv: 'Digital era börjar' },
  { year: 2024, population: 8.1, energyPerCapita: 21.3, techEfficiency: 67, note: 'Current state', noteSv: 'Nuläge' }
];

// === 9. CONNECTIONS TO OTHER SYSTEMS ===

export const SYSTEM_CONNECTIONS = [
  { id: 'demography', label: 'Demography & Immigration', labelSv: 'Demografi & invandring', icon: '👥' },
  { id: 'economy', label: 'Economy', labelSv: 'Ekonomi', icon: '💰' },
  { id: 'climate', label: 'Climate', labelSv: 'Klimat', icon: '🌡️' },
  { id: 'energy', label: 'Energy', labelSv: 'Energi', icon: '⚡' },
  { id: 'resilience', label: 'Resilience', labelSv: 'Resiliens', icon: '🔄' },
  { id: 'intergenerational', label: 'Intergenerational Fairness', labelSv: 'Intergenerationell rättvisa', icon: '⏳' }
];

// === 10. KEY MESSAGES ===

export const KEY_MESSAGES = {
  notOverpopulation: {
    sv: 'Människor är inte problemet. Obalans är problemet.',
    en: 'People are not the problem. Imbalance is the problem.'
  },
  timeAsymmetry: {
    sv: 'Historiskt tar det decennier att bygga bärkraft och år att rasera den.',
    en: 'Historically it takes decades to build carrying capacity and years to destroy it.'
  },
  currentState: {
    sv: 'Nuvarande global bärkraft är starkt beroende av hög energitillförsel och teknisk effektivitet. Systemets marginaler är ojämnt fördelade.',
    en: 'Current global carrying capacity is heavily dependent on high energy supply and technical efficiency. System margins are unevenly distributed.'
  },
  coreQuestion: {
    sv: 'Vi måste matcha mänskligt antal med faktisk systemkapacitet – annars sjunker levnadsförmågan.',
    en: 'We must match human numbers with actual system capacity – otherwise living ability declines.'
  }
};
