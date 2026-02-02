/**
 * INTERGENERATIONAL FAIRNESS ENGINE (IFE)
 * 
 * "Vem får nyttan – och vem betalar, över generationer?"
 * 
 * Detta är inte moral. Detta är bokföring över tid.
 */

// === 1. CORE QUESTION ===

export const IFE_CORE_QUESTION = {
  sv: 'Hur fördelas nyttor, kostnader och risker mellan nu levande människor och framtida generationer?',
  en: 'How are benefits, costs, and risks distributed between current and future generations?'
};

export const IFE_WARNING = {
  sv: 'Om detta inte mäts → exploatering sker automatiskt.',
  en: 'If this is not measured → exploitation happens automatically.'
};

// === 2. DEBT CATEGORIES ===

export interface DebtCategory {
  id: 'financial' | 'infrastructural' | 'ecological' | 'institutional';
  icon: string;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  components: { id: string; label: string; labelSv: string }[];
  currentLevel: 'low' | 'moderate' | 'high' | 'critical';
  trendDirection: 'improving' | 'stable' | 'worsening';
}

export const DEBT_CATEGORIES: DebtCategory[] = [
  {
    id: 'financial',
    icon: '💰',
    label: 'Financial Debt',
    labelSv: 'Finansiell skuld',
    description: 'Explicit and implicit financial obligations passed to future generations',
    descriptionSv: 'Explicita och implicita finansiella åtaganden som förs vidare till framtida generationer',
    components: [
      { id: 'state_debt', label: 'State debt per capita', labelSv: 'Statsskuld per capita' },
      { id: 'implicit_debt', label: 'Implicit debt (pensions, commitments)', labelSv: 'Implicit skuld (pensioner, åtaganden)' },
      { id: 'municipal_debt', label: 'Municipal debt', labelSv: 'Kommunal skuld' },
      { id: 'guarantees', label: 'Guarantees & future commitments', labelSv: 'Garantier & framtida åtaganden' }
    ],
    currentLevel: 'moderate',
    trendDirection: 'worsening'
  },
  {
    id: 'infrastructural',
    icon: '🏗️',
    label: 'Infrastructural Debt',
    labelSv: 'Infrastrukturell skuld',
    description: 'Deferred maintenance and investment gaps',
    descriptionSv: 'Eftersatt underhåll och investeringsgap',
    components: [
      { id: 'maintenance', label: 'Maintenance deficit', labelSv: 'Underhållsunderskott' },
      { id: 'deferred', label: 'Deferred infrastructure', labelSv: 'Eftersatt infrastruktur' },
      { id: 'investment_gap', label: 'Investment gap', labelSv: 'Investeringsgap' }
    ],
    currentLevel: 'high',
    trendDirection: 'worsening'
  },
  {
    id: 'ecological',
    icon: '🌍',
    label: 'Ecological Debt',
    labelSv: 'Ekologisk skuld',
    description: 'Resource depletion and environmental restoration needs',
    descriptionSv: 'Resursutarmning och miljöåterställningsbehov',
    components: [
      { id: 'resource_depletion', label: 'Resource depletion', labelSv: 'Resursutarmning' },
      { id: 'restoration', label: 'Environmental restoration needs', labelSv: 'Miljöåterställningsbehov' },
      { id: 'long_term', label: 'Long-term burdens', labelSv: 'Långsiktiga belastningar' }
    ],
    currentLevel: 'high',
    trendDirection: 'stable'
  },
  {
    id: 'institutional',
    icon: '🏛️',
    label: 'Institutional Erosion',
    labelSv: 'Institutionell erosion',
    description: 'The most overlooked debt - capacity and trust degradation',
    descriptionSv: 'Den mest förbisedda skulden - kapacitets- och förtroendenedbrytning',
    components: [
      { id: 'capacity', label: 'Decreased capacity', labelSv: 'Minskad kapacitet' },
      { id: 'competence', label: 'Competence loss', labelSv: 'Kompetensförlust' },
      { id: 'trust', label: 'Trust erosion', labelSv: 'Förtroendenedbrytning' }
    ],
    currentLevel: 'moderate',
    trendDirection: 'worsening'
  }
];

// === 3. GENERATION COHORT DATA ===

export interface CohortData {
  birthYear: number;
  label: string;
  labelSv: string;
  debtAtBirth: number; // SEK per capita
  energyAccess: number; // 0-100
  housingAffordability: number; // 0-100
  laborMarketAccess: number; // 0-100
  futureOutlook: number; // 0-100
  bornWithDebtLevel: 'low' | 'moderate' | 'high' | 'unsustainable';
  structuralBurden: string;
  structuralBurdenSv: string;
}

export const COHORT_DATA: CohortData[] = [
  {
    birthYear: 1945,
    label: 'Post-war generation',
    labelSv: 'Efterkrigsgenerationen',
    debtAtBirth: 8500,
    energyAccess: 65,
    housingAffordability: 85,
    laborMarketAccess: 90,
    futureOutlook: 88,
    bornWithDebtLevel: 'low',
    structuralBurden: 'Low debt, expanding economy, strong institutions',
    structuralBurdenSv: 'Låg skuld, expanderande ekonomi, starka institutioner'
  },
  {
    birthYear: 1960,
    label: 'Baby boomers',
    labelSv: 'Baby boomers',
    debtAtBirth: 42000,
    energyAccess: 82,
    housingAffordability: 72,
    laborMarketAccess: 85,
    futureOutlook: 82,
    bornWithDebtLevel: 'low',
    structuralBurden: 'Moderate debt, peak welfare expansion',
    structuralBurdenSv: 'Måttlig skuld, välfärdsexpansionens höjdpunkt'
  },
  {
    birthYear: 1975,
    label: 'Generation X',
    labelSv: 'Generation X',
    debtAtBirth: 125000,
    energyAccess: 88,
    housingAffordability: 58,
    laborMarketAccess: 72,
    futureOutlook: 68,
    bornWithDebtLevel: 'moderate',
    structuralBurden: 'Rising debt, 90s crisis impact, housing pressure begins',
    structuralBurdenSv: 'Stigande skuld, 90-talskrisens påverkan, bostadspress börjar'
  },
  {
    birthYear: 1990,
    label: 'Millennials',
    labelSv: 'Millennials',
    debtAtBirth: 285000,
    energyAccess: 92,
    housingAffordability: 38,
    laborMarketAccess: 62,
    futureOutlook: 52,
    bornWithDebtLevel: 'high',
    structuralBurden: 'High debt, housing crisis, pension uncertainty',
    structuralBurdenSv: 'Hög skuld, bostadskris, pensionsosäkerhet'
  },
  {
    birthYear: 2005,
    label: 'Generation Z',
    labelSv: 'Generation Z',
    debtAtBirth: 420000,
    energyAccess: 90,
    housingAffordability: 25,
    laborMarketAccess: 55,
    futureOutlook: 42,
    bornWithDebtLevel: 'high',
    structuralBurden: 'Very high debt, infrastructure deficit, climate burden',
    structuralBurdenSv: 'Mycket hög skuld, infrastrukturunderskott, klimatbelastning'
  },
  {
    birthYear: 2020,
    label: 'Generation Alpha',
    labelSv: 'Generation Alpha',
    debtAtBirth: 580000,
    energyAccess: 85,
    housingAffordability: 18,
    laborMarketAccess: 48,
    futureOutlook: 35,
    bornWithDebtLevel: 'unsustainable',
    structuralBurden: 'Critical debt levels, systemic restoration needs',
    structuralBurdenSv: 'Kritiska skuldnivåer, systemiska återställningsbehov'
  }
];

// === 4. BENEFIT VS COST EXAMPLES ===

export interface BenefitCostExample {
  id: string;
  decision: string;
  decisionSv: string;
  year: number;
  immediateBenefit: string;
  immediateBenefitSv: string;
  longTermCost: string;
  longTermCostSv: string;
  timeShift: number; // years
  costBearers: string;
  costBearersSv: string;
}

export const BENEFIT_COST_EXAMPLES: BenefitCostExample[] = [
  {
    id: 'housing_deregulation',
    decision: 'Housing market deregulation',
    decisionSv: 'Bostadsmarknadsavreglering',
    year: 1990,
    immediateBenefit: 'Increased homeowner wealth, lower public costs',
    immediateBenefitSv: 'Ökad förmögenhet för bostadsägare, lägre offentliga kostnader',
    longTermCost: 'Housing affordability crisis for new entrants',
    longTermCostSv: 'Bostadskris för nya generationer',
    timeShift: 25,
    costBearers: 'Generations born after 1985',
    costBearersSv: 'Generationer födda efter 1985'
  },
  {
    id: 'infrastructure_underinvestment',
    decision: 'Infrastructure maintenance deferral',
    decisionSv: 'Uppskjutet infrastrukturunderhåll',
    year: 2000,
    immediateBenefit: 'Lower taxes, balanced budgets',
    immediateBenefitSv: 'Lägre skatter, balanserade budgetar',
    longTermCost: 'Accumulated maintenance debt, higher restoration costs',
    longTermCostSv: 'Ackumulerad underhållsskuld, högre återställningskostnader',
    timeShift: 20,
    costBearers: 'Taxpayers 2020-2050',
    costBearersSv: 'Skattebetalare 2020-2050'
  },
  {
    id: 'pension_promises',
    decision: 'Pension benefit expansion',
    decisionSv: 'Pensionsförmånsexpansion',
    year: 1985,
    immediateBenefit: 'Higher pensions for current retirees, political support',
    immediateBenefitSv: 'Högre pensioner för nuvarande pensionärer, politiskt stöd',
    longTermCost: 'Unfunded liabilities, lower returns for future retirees',
    longTermCostSv: 'Ofinansierade åtaganden, lägre avkastning för framtida pensionärer',
    timeShift: 35,
    costBearers: 'Workers born after 1970',
    costBearersSv: 'Arbetare födda efter 1970'
  }
];

// === 5. FAIRNESS BALANCE LEVELS ===

export const FAIRNESS_LEVELS = {
  balanced: {
    label: 'Balanced',
    labelSv: 'Balans',
    description: 'Costs and benefits distributed relatively evenly across generations',
    descriptionSv: 'Kostnader och nyttor relativt jämnt fördelade över generationer',
    color: 'green'
  },
  slight_shift: {
    label: 'Slight future shift',
    labelSv: 'Lätt framtidsförskjutning',
    description: 'Some costs shifted to future generations',
    descriptionSv: 'Viss kostnadförskjutning till framtida generationer',
    color: 'yellow'
  },
  significant_shift: {
    label: 'Significant future shift',
    labelSv: 'Kraftig framtidsförskjutning',
    description: 'Major costs borne by future generations',
    descriptionSv: 'Huvudsakliga kostnader bärs av framtida generationer',
    color: 'red'
  }
};

// === 6. TIME RESPONSIBILITY ===

export const TIME_RESPONSIBILITY = {
  template: {
    sv: 'Detta beslut kräver {x} år av framtida arbete för att neutralisera.',
    en: 'This decision requires {x} years of future work to neutralize.'
  },
  principle: {
    sv: 'Tid är den sanna valutan.',
    en: 'Time is the true currency.'
  }
};

// === 7. GLOBAL COMPARISON DATA ===

export interface CountryFairnessData {
  code: string;
  name: string;
  nameSv: string;
  futureShiftScore: number; // 0-100, higher = more shifted to future
  investmentScore: number; // 0-100, higher = more investing for future
  debtPerYouth: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export const GLOBAL_FAIRNESS_DATA: CountryFairnessData[] = [
  { code: 'NO', name: 'Norway', nameSv: 'Norge', futureShiftScore: 22, investmentScore: 85, debtPerYouth: 180000, trend: 'stable' },
  { code: 'SE', name: 'Sweden', nameSv: 'Sverige', futureShiftScore: 48, investmentScore: 62, debtPerYouth: 420000, trend: 'worsening' },
  { code: 'DE', name: 'Germany', nameSv: 'Tyskland', futureShiftScore: 55, investmentScore: 58, debtPerYouth: 380000, trend: 'stable' },
  { code: 'US', name: 'United States', nameSv: 'USA', futureShiftScore: 72, investmentScore: 45, debtPerYouth: 850000, trend: 'worsening' },
  { code: 'JP', name: 'Japan', nameSv: 'Japan', futureShiftScore: 85, investmentScore: 35, debtPerYouth: 1200000, trend: 'worsening' },
  { code: 'CH', name: 'Switzerland', nameSv: 'Schweiz', futureShiftScore: 28, investmentScore: 78, debtPerYouth: 145000, trend: 'improving' }
];

// === 8. KEY MESSAGES ===

export const KEY_MESSAGES = {
  workShifted: {
    sv: 'Detta är arbete som skjutits på framtiden.',
    en: 'This is work that has been pushed to the future.'
  },
  energyEquivalent: {
    sv: 'Visas i arbete/energi-ekvivalenter, inte moral.',
    en: 'Shown in work/energy equivalents, not morality.'
  },
  structuralPosition: {
    sv: 'Detta är den strukturella startpositionen för en person född detta år.',
    en: 'This is the structural starting position for a person born this year.'
  },
  averageBurden: {
    sv: 'En genomsnittlig person född detta år förväntas bära följande strukturella belastning.',
    en: 'An average person born this year is expected to carry the following structural burden.'
  },
  populismVisible: {
    sv: 'Gör populism synlig utan att säga ordet.',
    en: 'Makes populism visible without saying the word.'
  },
  decisionCorrelation: {
    sv: 'Beslut fattade under följande mandatperioder sammanfaller med denna utveckling.',
    en: 'Decisions made during the following terms coincide with this development.'
  },
  civilizationWarning: {
    sv: 'Civilisationer dör när de lever på framtiden utan att veta det.',
    en: 'Civilizations die when they live on the future without knowing it.'
  }
};

// === 9. MANDATE PERIOD CORRELATION ===

export interface MandatePeriod {
  start: number;
  end: number;
  leader: string;
  party: string;
  debtChange: number; // percentage
  infrastructureInvestment: number; // relative to need
}

export const SWEDEN_MANDATE_PERIODS: MandatePeriod[] = [
  { start: 2022, end: 2026, leader: 'Ulf Kristersson', party: 'M', debtChange: 8, infrastructureInvestment: 72 },
  { start: 2018, end: 2022, leader: 'Stefan Löfven / Magdalena Andersson', party: 'S', debtChange: 15, infrastructureInvestment: 68 },
  { start: 2014, end: 2018, leader: 'Stefan Löfven', party: 'S', debtChange: -5, infrastructureInvestment: 75 },
  { start: 2010, end: 2014, leader: 'Fredrik Reinfeldt', party: 'M', debtChange: 12, infrastructureInvestment: 62 },
  { start: 2006, end: 2010, leader: 'Fredrik Reinfeldt', party: 'M', debtChange: 8, infrastructureInvestment: 58 }
];
