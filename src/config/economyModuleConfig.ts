/**
 * WAVE 8 BLOCK BL: Full Economy Module
 * 
 * Ekonomi som ett lager – inte centrum.
 * All ekonomisk data kopplad till samhällskontext.
 */

export interface EconomicIndicator {
  id: string;
  code: string;
  name: string;
  name_en: string;
  category: EconomicCategory;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  sources: string[];
  requiredContextLayers: ContextLayer[];
  description: string;
}

export type EconomicCategory = 
  | 'gdp'
  | 'productivity'
  | 'inflation'
  | 'interest_rates'
  | 'labor_market'
  | 'business_demographics'
  | 'investments'
  | 'debt'
  | 'public_finance'
  | 'trade_balance'
  | 'currency'
  | 'energy_commodities'
  | 'real_estate';

export type ContextLayer = 
  | 'demographics'
  | 'migration'
  | 'health'
  | 'education'
  | 'energy'
  | 'housing'
  | 'crime'
  | 'policy_decisions'
  | 'institutional_trust'
  | 'geopolitics'
  | 'climate'
  | 'infrastructure';

/**
 * BL2: Ekonomi visas ALDRIG ensamt
 * Varje ekonomiskt mått kräver minst dessa kontextlager
 */
export const MANDATORY_CONTEXT_LAYERS: ContextLayer[] = [
  'demographics',
  'health',
  'education',
  'energy',
  'institutional_trust',
];

export const ECONOMIC_CATEGORIES: Record<EconomicCategory, {
  name: string;
  name_en: string;
  description: string;
  icon: string;
}> = {
  gdp: {
    name: 'BNP & Tillväxt',
    name_en: 'GDP & Growth',
    description: 'Alla BNP-definitioner och tillväxtmått',
    icon: 'TrendingUp',
  },
  productivity: {
    name: 'Produktivitet',
    name_en: 'Productivity',
    description: 'Arbets- och totalfaktorproduktivitet',
    icon: 'Gauge',
  },
  inflation: {
    name: 'Inflation',
    name_en: 'Inflation',
    description: 'KPI, KPIF, kärninflation, PPI',
    icon: 'ArrowUpRight',
  },
  interest_rates: {
    name: 'Räntor',
    name_en: 'Interest Rates',
    description: 'Styrränta, marknadsräntor, spreadar',
    icon: 'Percent',
  },
  labor_market: {
    name: 'Arbetsmarknad',
    name_en: 'Labor Market',
    description: 'Sysselsättning, arbetslöshet, deltagande',
    icon: 'Users',
  },
  business_demographics: {
    name: 'Företagsdemografi',
    name_en: 'Business Demographics',
    description: 'Nyföretagande, konkurser, branschstruktur',
    icon: 'Building2',
  },
  investments: {
    name: 'Investeringar',
    name_en: 'Investments',
    description: 'Fasta bruttoinvesteringar, FDI, venture',
    icon: 'LineChart',
  },
  debt: {
    name: 'Skuldsättning',
    name_en: 'Debt',
    description: 'Statsskuld, hushållsskuld, företagsskuld',
    icon: 'CreditCard',
  },
  public_finance: {
    name: 'Offentliga Finanser',
    name_en: 'Public Finance',
    description: 'Budgetsaldo, skatteintäkter, utgifter',
    icon: 'Landmark',
  },
  trade_balance: {
    name: 'Handel',
    name_en: 'Trade',
    description: 'Export, import, handelsbalans, bytesbalans',
    icon: 'Ship',
  },
  currency: {
    name: 'Valuta',
    name_en: 'Currency',
    description: 'Växelkurser, valutareserver',
    icon: 'Coins',
  },
  energy_commodities: {
    name: 'Energi & Råvaror',
    name_en: 'Energy & Commodities',
    description: 'Elpriser, olja, gas, metaller',
    icon: 'Zap',
  },
  real_estate: {
    name: 'Fastigheter',
    name_en: 'Real Estate',
    description: 'Bostadspriser, hyror, byggande',
    icon: 'Home',
  },
};

/**
 * Ekonomiska indikatorer – exempel
 */
export const ECONOMIC_INDICATORS: EconomicIndicator[] = [
  {
    id: 'gdp_growth',
    code: 'GDP_GROWTH_Q',
    name: 'BNP-tillväxt (kvartal)',
    name_en: 'GDP Growth (quarterly)',
    category: 'gdp',
    unit: '%',
    frequency: 'quarterly',
    sources: ['SCB', 'Eurostat'],
    requiredContextLayers: ['demographics', 'energy', 'institutional_trust'],
    description: 'Procentuell förändring av BNP jämfört med föregående kvartal',
  },
  {
    id: 'inflation_cpif',
    code: 'CPIF',
    name: 'KPIF (inflation)',
    name_en: 'CPIF (inflation)',
    category: 'inflation',
    unit: '%',
    frequency: 'monthly',
    sources: ['SCB'],
    requiredContextLayers: ['energy', 'housing', 'policy_decisions'],
    description: 'Konsumentprisindex med fast ränta',
  },
  {
    id: 'unemployment_rate',
    code: 'UNEMP_RATE',
    name: 'Arbetslöshet',
    name_en: 'Unemployment Rate',
    category: 'labor_market',
    unit: '%',
    frequency: 'monthly',
    sources: ['SCB', 'Arbetsförmedlingen'],
    requiredContextLayers: ['demographics', 'education', 'migration'],
    description: 'Andel av arbetskraften som är arbetslösa',
  },
  {
    id: 'policy_rate',
    code: 'REPO_RATE',
    name: 'Styrränta',
    name_en: 'Policy Rate',
    category: 'interest_rates',
    unit: '%',
    frequency: 'daily',
    sources: ['Riksbanken'],
    requiredContextLayers: ['energy', 'institutional_trust', 'geopolitics'],
    description: 'Riksbankens styrränta',
  },
  {
    id: 'household_debt',
    code: 'HH_DEBT_GDP',
    name: 'Hushållsskuld / BNP',
    name_en: 'Household Debt / GDP',
    category: 'debt',
    unit: '%',
    frequency: 'quarterly',
    sources: ['SCB', 'Riksbanken'],
    requiredContextLayers: ['housing', 'demographics', 'policy_decisions'],
    description: 'Hushållens skuldsättning i relation till BNP',
  },
];

/**
 * BL2: Regel – Ekonomi visas alltid med kontext
 */
export function getRequiredContext(indicatorId: string): ContextLayer[] {
  const indicator = ECONOMIC_INDICATORS.find(i => i.id === indicatorId);
  if (!indicator) return MANDATORY_CONTEXT_LAYERS;
  
  // Kombinera specifika + obligatoriska
  const unique = new Set([
    ...indicator.requiredContextLayers,
    ...MANDATORY_CONTEXT_LAYERS,
  ]);
  
  return Array.from(unique);
}

/**
 * Validera att ekonomisk data inte visas utan kontext
 */
export function validateContextPresence(
  indicatorId: string,
  presentContextLayers: ContextLayer[]
): { valid: boolean; missing: ContextLayer[] } {
  const required = getRequiredContext(indicatorId);
  const missing = required.filter(l => !presentContextLayers.includes(l));
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
