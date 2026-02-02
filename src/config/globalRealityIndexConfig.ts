/**
 * GLOBAL REALITY INDEX (GRI)
 * 
 * "Hur mår världen – just nu – i ett mänskligt och strukturellt perspektiv?"
 * 
 * GRI är inte ett betyg. Det är en lägesbild.
 * Ingen ranking. Ingen moral. Ingen prognos.
 */

// === 1. CORE IDENTITY ===

export const GRI_IDENTITY = {
  name: 'Global Reality Index',
  shortName: 'GRI',
  purpose: {
    sv: 'En sammansatt realtidsöversikt baserad på få, bärande indikatorer',
    en: 'A composite real-time overview based on few, foundational indicators'
  },
  question: {
    sv: 'Är världen sammantaget mer stabil, mer pressad eller mer fragmenterad än tidigare?',
    en: 'Is the world overall more stable, more pressured, or more fragmented than before?'
  }
};

// === 2. THE SIX PILLARS ===

export type PillarId = 
  | 'human_wellbeing'
  | 'energy_capacity'
  | 'economic_space'
  | 'demographic_balance'
  | 'institutional_capacity'
  | 'global_stability';

export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface GRIPillar {
  id: PillarId;
  name: string;
  nameSv: string;
  icon: string;
  description: string;
  descriptionSv: string;
  subIndicators: {
    id: string;
    name: string;
    nameSv: string;
  }[];
  color: string;
}

export const GRI_PILLARS: GRIPillar[] = [
  {
    id: 'human_wellbeing',
    name: 'Human Wellbeing',
    nameSv: 'Mänskligt välbefinnande',
    icon: '❤️',
    description: 'Health, material security, future outlook',
    descriptionSv: 'Hälsa, materiell trygghet, framtidsutsikter',
    color: 'hsl(340, 82%, 52%)',
    subIndicators: [
      { id: 'hwi', name: 'Human Wellbeing Index', nameSv: 'Välbefinnandeindex (HWI)' },
      { id: 'health', name: 'Health outcomes', nameSv: 'Hälsoutfall' },
      { id: 'material_security', name: 'Material security', nameSv: 'Materiell trygghet' },
      { id: 'future_outlook', name: 'Future outlook', nameSv: 'Framtidsutsikter' }
    ]
  },
  {
    id: 'energy_capacity',
    name: 'Energy & Capacity',
    nameSv: 'Energi & bärkraft',
    icon: '⚡',
    description: 'Energy per capita, cost, supply stability',
    descriptionSv: 'Energi per capita, kostnad, försörjningsstabilitet',
    color: 'hsl(45, 93%, 47%)',
    subIndicators: [
      { id: 'energy_per_capita', name: 'Energy per capita', nameSv: 'Energi per capita' },
      { id: 'energy_cost', name: 'Energy cost', nameSv: 'Energikostnad' },
      { id: 'supply_stability', name: 'Supply stability', nameSv: 'Försörjningsstabilitet' }
    ]
  },
  {
    id: 'economic_space',
    name: 'Economic Space',
    nameSv: 'Ekonomiskt handlingsutrymme',
    icon: '💼',
    description: 'Debt pressure, investment vs maintenance, real income',
    descriptionSv: 'Skuldtryck, investering vs underhåll, real inkomstutveckling',
    color: 'hsl(142, 76%, 36%)',
    subIndicators: [
      { id: 'debt_pressure', name: 'Debt pressure', nameSv: 'Skuldtryck' },
      { id: 'investment_ratio', name: 'Investment vs maintenance', nameSv: 'Investering vs underhåll' },
      { id: 'real_income', name: 'Real income development', nameSv: 'Real inkomstutveckling' }
    ]
  },
  {
    id: 'demographic_balance',
    name: 'Demographic Balance',
    nameSv: 'Demografisk balans',
    icon: '👥',
    description: 'Population growth, age structure, urbanization, migration',
    descriptionSv: 'Befolkningstillväxt, åldersstruktur, urbanisering, migrationsflöden',
    color: 'hsl(262, 83%, 58%)',
    subIndicators: [
      { id: 'population_growth', name: 'Population growth', nameSv: 'Befolkningstillväxt' },
      { id: 'age_structure', name: 'Age structure', nameSv: 'Åldersstruktur' },
      { id: 'urbanization', name: 'Urbanization', nameSv: 'Urbanisering' },
      { id: 'migration_flows', name: 'Migration flows (aggregated)', nameSv: 'Migrationsflöden (aggregerat)' }
    ]
  },
  {
    id: 'institutional_capacity',
    name: 'Institutional Capacity',
    nameSv: 'Institutionell kapacitet',
    icon: '🏛️',
    description: 'Implementation ability, legitimacy, resilience',
    descriptionSv: 'Genomförandeförmåga, legitimitet, resiliens',
    color: 'hsl(217, 91%, 60%)',
    subIndicators: [
      { id: 'implementation', name: 'Implementation ability', nameSv: 'Genomförandeförmåga' },
      { id: 'legitimacy', name: 'Legitimacy', nameSv: 'Legitimitet' },
      { id: 'resilience', name: 'Institutional resilience', nameSv: 'Institutionell resiliens' }
    ]
  },
  {
    id: 'global_stability',
    name: 'Global Stability',
    nameSv: 'Global stabilitet',
    icon: '🌐',
    description: 'Conflict intensity, trade flows, systemic risk',
    descriptionSv: 'Konfliktintensitet, handelsflöden, systemisk risk',
    color: 'hsl(190, 95%, 39%)',
    subIndicators: [
      { id: 'conflict_intensity', name: 'Conflict intensity', nameSv: 'Konfliktintensitet' },
      { id: 'trade_flows', name: 'Trade flows', nameSv: 'Handelsflöden' },
      { id: 'systemic_risk', name: 'Systemic risk (not events)', nameSv: 'Systemisk risk (ej händelser)' }
    ]
  }
];

// === 3. GLOBAL STATUS LEVELS ===

export type GlobalStatus = 'stable' | 'pressured' | 'critical' | 'transitional';

export interface GlobalStatusConfig {
  id: GlobalStatus;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  color: string;
}

export const GLOBAL_STATUS_LEVELS: GlobalStatusConfig[] = [
  {
    id: 'stable',
    label: 'Stable',
    labelSv: 'Stabil',
    description: 'Most pillars stable or improving. Margins adequate.',
    descriptionSv: 'De flesta pelare stabila eller förbättras. Marginaler tillräckliga.',
    color: 'hsl(142, 76%, 36%)'
  },
  {
    id: 'pressured',
    label: 'Pressured',
    labelSv: 'Pressat',
    description: 'Several pillars declining simultaneously. Margins decreasing. Regional variation increasing.',
    descriptionSv: 'Flera pelare försämras samtidigt. Marginalerna minskar. Variationen mellan regioner ökar.',
    color: 'hsl(45, 93%, 47%)'
  },
  {
    id: 'critical',
    label: 'Critical',
    labelSv: 'Kritiskt',
    description: 'Multiple pillars in sharp decline. Systemic stress observable.',
    descriptionSv: 'Flera pelare i kraftig nedgång. Systemisk stress observerbar.',
    color: 'hsl(0, 84%, 60%)'
  },
  {
    id: 'transitional',
    label: 'Transitional',
    labelSv: 'Omställning',
    description: 'Major structural shifts underway. High uncertainty.',
    descriptionSv: 'Stora strukturella skiften pågår. Hög osäkerhet.',
    color: 'hsl(262, 83%, 58%)'
  }
];

// === 4. TREND LABELS ===

export const TREND_LABELS: Record<TrendDirection, { sv: string; en: string; symbol: string }> = {
  improving: { sv: 'Förbättras', en: 'Improving', symbol: '↑' },
  stable: { sv: 'Stabil', en: 'Stable', symbol: '→' },
  declining: { sv: 'Försämras', en: 'Declining', symbol: '↓' }
};

// === 5. TIME PERIODS ===

export const TIME_PERIODS = [
  { id: 'today', label: 'Idag', labelEn: 'Today' },
  { id: '5y', label: '5 år', labelEn: '5 years' },
  { id: '20y', label: '20 år', labelEn: '20 years' },
  { id: 'max', label: 'Max', labelEn: 'Max' }
];

// === 6. WHAT GRI IS NOT (MANDATORY DISCLAIMER) ===

export const GRI_DISCLAIMERS = {
  title: { sv: 'GRI är INTE:', en: 'GRI is NOT:' },
  items: [
    { sv: 'en prognos', en: 'a forecast' },
    { sv: 'ett mål', en: 'a goal' },
    { sv: 'en rekommendation', en: 'a recommendation' },
    { sv: 'ett politiskt ställningstagande', en: 'a political position' }
  ]
};

// === 7. REGIONAL DIFFERENTIATION ===

export interface RegionalData {
  regionCode: string;
  regionName: string;
  regionNameSv: string;
  overallStatus: GlobalStatus;
  pillarStatuses: Partial<Record<PillarId, TrendDirection>>;
}

export const SAMPLE_REGIONAL_DATA: RegionalData[] = [
  {
    regionCode: 'EUR',
    regionName: 'Europe',
    regionNameSv: 'Europa',
    overallStatus: 'pressured',
    pillarStatuses: {
      human_wellbeing: 'stable',
      energy_capacity: 'declining',
      economic_space: 'declining',
      demographic_balance: 'declining',
      institutional_capacity: 'stable',
      global_stability: 'stable'
    }
  },
  {
    regionCode: 'NAM',
    regionName: 'North America',
    regionNameSv: 'Nordamerika',
    overallStatus: 'pressured',
    pillarStatuses: {
      human_wellbeing: 'declining',
      energy_capacity: 'stable',
      economic_space: 'declining',
      demographic_balance: 'stable',
      institutional_capacity: 'declining',
      global_stability: 'stable'
    }
  },
  {
    regionCode: 'EAS',
    regionName: 'East Asia',
    regionNameSv: 'Östasien',
    overallStatus: 'transitional',
    pillarStatuses: {
      human_wellbeing: 'improving',
      energy_capacity: 'stable',
      economic_space: 'stable',
      demographic_balance: 'declining',
      institutional_capacity: 'stable',
      global_stability: 'declining'
    }
  },
  {
    regionCode: 'SAS',
    regionName: 'South Asia',
    regionNameSv: 'Sydasien',
    overallStatus: 'pressured',
    pillarStatuses: {
      human_wellbeing: 'improving',
      energy_capacity: 'declining',
      economic_space: 'stable',
      demographic_balance: 'stable',
      institutional_capacity: 'stable',
      global_stability: 'declining'
    }
  },
  {
    regionCode: 'AFR',
    regionName: 'Sub-Saharan Africa',
    regionNameSv: 'Subsahariska Afrika',
    overallStatus: 'critical',
    pillarStatuses: {
      human_wellbeing: 'declining',
      energy_capacity: 'declining',
      economic_space: 'declining',
      demographic_balance: 'stable',
      institutional_capacity: 'declining',
      global_stability: 'declining'
    }
  },
  {
    regionCode: 'LAM',
    regionName: 'Latin America',
    regionNameSv: 'Latinamerika',
    overallStatus: 'pressured',
    pillarStatuses: {
      human_wellbeing: 'stable',
      energy_capacity: 'stable',
      economic_space: 'declining',
      demographic_balance: 'stable',
      institutional_capacity: 'declining',
      global_stability: 'stable'
    }
  },
  {
    regionCode: 'MEN',
    regionName: 'Middle East & North Africa',
    regionNameSv: 'Mellanöstern & Nordafrika',
    overallStatus: 'critical',
    pillarStatuses: {
      human_wellbeing: 'declining',
      energy_capacity: 'stable',
      economic_space: 'declining',
      demographic_balance: 'declining',
      institutional_capacity: 'declining',
      global_stability: 'declining'
    }
  },
  {
    regionCode: 'OCE',
    regionName: 'Oceania',
    regionNameSv: 'Oceanien',
    overallStatus: 'stable',
    pillarStatuses: {
      human_wellbeing: 'stable',
      energy_capacity: 'stable',
      economic_space: 'stable',
      demographic_balance: 'stable',
      institutional_capacity: 'stable',
      global_stability: 'stable'
    }
  }
];

// === 8. CONTEXT MESSAGE ===

export const CONTEXT_MESSAGES = {
  timeSnapshot: {
    sv: 'Denna status är ett ögonblick i en längre utveckling.',
    en: 'This status is a moment in a longer development.'
  },
  regionalVariation: {
    sv: 'Globalt läge döljer stora regionala skillnader.',
    en: 'Global status hides large regional differences.'
  },
  responsibility: {
    sv: 'Detta läge är resultatet av många samtidiga beslut och strukturer.',
    en: 'This situation is the result of many simultaneous decisions and structures.'
  }
};

// === 9. HELPER FUNCTIONS ===

export const getPillarById = (id: PillarId): GRIPillar | undefined => {
  return GRI_PILLARS.find(p => p.id === id);
};

export const getStatusConfig = (status: GlobalStatus): GlobalStatusConfig | undefined => {
  return GLOBAL_STATUS_LEVELS.find(s => s.id === status);
};

export const calculateGlobalStatus = (pillarTrends: Record<PillarId, TrendDirection>): GlobalStatus => {
  const declining = Object.values(pillarTrends).filter(t => t === 'declining').length;
  const improving = Object.values(pillarTrends).filter(t => t === 'improving').length;
  
  if (declining >= 4) return 'critical';
  if (declining >= 2) return 'pressured';
  if (improving >= 4) return 'stable';
  return 'transitional';
};
