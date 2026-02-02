/**
 * GLOBAL EXPANSION & INGEST ARCHITECTURE
 * 
 * "Många små rör. En gemensam sanning."
 * 
 * 4-layer ingest architecture for 200+ global data sources
 */

// Data depth levels
export type DataDepthLevel = 'global_baseline' | 'regional_bloc' | 'national_deep';

export const dataDepthConfig: Record<DataDepthLevel, {
  label: string;
  description: string;
  color: string;
  features: string[];
}> = {
  global_baseline: {
    label: 'Global Baseline',
    description: 'Grundläggande indikatorer för alla länder',
    color: 'bg-green-500/20 text-green-500',
    features: ['Befolkning', 'Livslängd', 'BNP per capita', 'Sysselsättning', 'Utbildning', 'Hälsa', 'Migration'],
  },
  regional_bloc: {
    label: 'Regional Bloc',
    description: 'Utökad data för EU/OECD-länder',
    color: 'bg-blue-500/20 text-blue-500',
    features: ['Regional nivå (NUTS)', 'Köns- och åldersuppdelning', 'Arbetsmarknad', 'Detaljerad hälsa', 'Tidsserier'],
  },
  national_deep: {
    label: 'Nationellt djup',
    description: 'Fullständigt djup med ansvar och simulering',
    color: 'bg-purple-500/20 text-purple-500',
    features: ['Kommun/stad', 'Kluster', 'Ansvarsmodell', 'Politikerprofiler', 'Feeds', 'Simulering'],
  },
};

// ============ 4-LAYER INGEST ARCHITECTURE ============
export const ingestLayers = {
  layer1: {
    name: 'Source Connectors',
    description: 'Hämta exakt det källan publicerar',
    responsibilities: ['API / FTP / bulk download', 'Ingen transform', 'Checksummor', 'Råformat bevaras'],
    principle: '📌 Rådata är helig.',
  },
  layer2: {
    name: 'Schema & Versionering',
    description: 'Förstå vad datan är',
    responsibilities: ['Schema-detektion', 'Versionsstämpel', 'Breaking change-detektion', 'Käll-ID + licens'],
    principle: '📌 Inget skrivs över. Allt är append-only.',
  },
  layer3: {
    name: 'Semantisk Mappning',
    description: 'Översätta till gemensamt språk',
    responsibilities: ['KPI-mappning', 'Enheter', 'Geografi (ISO, NUTS)', 'Demografi'],
    principle: '📌 All mappning är konfig, inte kod.',
  },
  layer4: {
    name: 'Aggregering & Indexering',
    description: 'Göra datan användbar',
    responsibilities: ['Tidsserier', 'Normalisering', 'Index', 'Kluster', 'Feed-triggers'],
    principle: '📌 Här börjar ert värde.',
  },
} as const;

// Schedule types
export type ScheduleType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';

export const scheduleConfig: Record<ScheduleType, { label: string; cronExample: string }> = {
  hourly: { label: 'Varje timme', cronExample: '0 * * * *' },
  daily: { label: 'Dagligen', cronExample: '0 6 * * *' },
  weekly: { label: 'Veckovis', cronExample: '0 6 * * 1' },
  monthly: { label: 'Månadsvis', cronExample: '0 6 1 * *' },
  quarterly: { label: 'Kvartalsvis', cronExample: '0 6 1 1,4,7,10 *' },
};

// Global data sources catalog (200+)
export const globalDataSourcesCatalog = {
  global: [
    { code: 'WORLD_BANK_WDI', name: 'World Bank - WDI', indicators: 1600, schedule: 'weekly' as ScheduleType },
    { code: 'WHO_GHO', name: 'WHO Global Health', indicators: 2100, schedule: 'weekly' as ScheduleType },
    { code: 'IMF_WEO', name: 'IMF World Economic', indicators: 400, schedule: 'quarterly' as ScheduleType },
    { code: 'UN_DATA', name: 'UN Data', indicators: 800, schedule: 'monthly' as ScheduleType },
    { code: 'ILO_STAT', name: 'ILO Statistics', indicators: 500, schedule: 'monthly' as ScheduleType },
    { code: 'UNESCO_UIS', name: 'UNESCO Statistics', indicators: 300, schedule: 'monthly' as ScheduleType },
    { code: 'FAO_STAT', name: 'FAO Statistics', indicators: 700, schedule: 'monthly' as ScheduleType },
    { code: 'UNDP_HDI', name: 'UNDP HDI', indicators: 50, schedule: 'quarterly' as ScheduleType },
  ],
  europe: [
    { code: 'EUROSTAT', name: 'Eurostat', indicators: 3000, schedule: 'monthly' as ScheduleType },
    { code: 'ECB_SDW', name: 'ECB Data Warehouse', indicators: 500, schedule: 'daily' as ScheduleType },
    { code: 'ECDC', name: 'ECDC', indicators: 200, schedule: 'weekly' as ScheduleType },
  ],
  oecd: [
    { code: 'OECD_STATS', name: 'OECD Statistics', indicators: 2500, schedule: 'monthly' as ScheduleType },
  ],
  americas: [
    { code: 'ECLAC', name: 'UN ECLAC', indicators: 400, schedule: 'monthly' as ScheduleType },
    { code: 'BLS_US', name: 'US Bureau of Labor', indicators: 800, schedule: 'monthly' as ScheduleType },
    { code: 'STATCAN', name: 'Statistics Canada', indicators: 600, schedule: 'monthly' as ScheduleType },
  ],
  sweden: [
    { code: 'SCB', name: 'Statistics Sweden', indicators: 2000, schedule: 'daily' as ScheduleType },
    { code: 'KOLADA', name: 'Kolada', indicators: 5000, schedule: 'daily' as ScheduleType },
    { code: 'SVK', name: 'Svenska Kraftnät', indicators: 50, schedule: 'hourly' as ScheduleType },
  ],
} as const;

// Pipeline status
export type PipelineStatus = 'pending' | 'fetching' | 'validating' | 'mapping' | 'aggregating' | 'complete' | 'failed' | 'partial';

export const pipelineStatusConfig: Record<PipelineStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Väntar', color: 'text-muted-foreground', icon: '⏳' },
  fetching: { label: 'Hämtar', color: 'text-blue-500', icon: '⬇️' },
  validating: { label: 'Validerar', color: 'text-yellow-500', icon: '🔍' },
  mapping: { label: 'Mappar', color: 'text-purple-500', icon: '🔄' },
  aggregating: { label: 'Aggregerar', color: 'text-orange-500', icon: '📊' },
  complete: { label: 'Klar', color: 'text-green-500', icon: '✅' },
  failed: { label: 'Misslyckad', color: 'text-red-500', icon: '❌' },
  partial: { label: 'Delvis', color: 'text-yellow-600', icon: '⚠️' },
};

// Onboarding steps for new countries
export const countryOnboardingSteps = [
  { step: 1, name: 'Identifiera källor', description: 'Kartlägg tillgängliga datakällor' },
  { step: 2, name: 'Skapa connector', description: 'Implementera käll-specifik hämtning' },
  { step: 3, name: 'Mappa semantik', description: 'Koppla till gemensamt begreppsbibliotek' },
  { step: 4, name: 'Kör historik', description: 'Importera historiska data' },
  { step: 5, name: 'Släpp i produktion', description: 'Aktivera live-ingest' },
] as const;

// Regional blocs
export const regionalBlocs = {
  eu: { name: 'EU', code: 'eu', color: '#003399', dataDepth: 'regional_bloc' as DataDepthLevel },
  oecd: { name: 'OECD', code: 'oecd', color: '#0077B5', dataDepth: 'regional_bloc' as DataDepthLevel },
  nordic: { name: 'Norden', code: 'nordic', color: '#003366', dataDepth: 'regional_bloc' as DataDepthLevel },
};

// Regions for grouping
export const regions = {
  europe: { name: 'Europa', emoji: '🇪🇺' },
  north_america: { name: 'Nordamerika', emoji: '🌎' },
  south_america: { name: 'Sydamerika', emoji: '🌎' },
  asia_pacific: { name: 'Asien-Stillahavsregionen', emoji: '🌏' },
  africa: { name: 'Afrika', emoji: '🌍' },
  middle_east: { name: 'Mellanöstern', emoji: '🌍' },
};

// Comparability levels
export type ComparabilityLevel = 'full' | 'partial' | 'limited' | 'none';

export const comparabilityConfig: Record<ComparabilityLevel, {
  label: string;
  description: string;
  color: string;
  score: { min: number; max: number };
}> = {
  full: { label: 'Full jämförbarhet', description: 'Samma definitioner', color: 'text-green-500', score: { min: 0.85, max: 1.0 } },
  partial: { label: 'Delvis jämförbar', description: 'Liknande definitioner', color: 'text-yellow-500', score: { min: 0.60, max: 0.84 } },
  limited: { label: 'Begränsad', description: 'Olika definitioner', color: 'text-orange-500', score: { min: 0.30, max: 0.59 } },
  none: { label: 'Ej jämförbar', description: 'Kan inte jämföras', color: 'text-red-500', score: { min: 0, max: 0.29 } },
};

// Global data sources (legacy)
export const globalDataSources = {
  worldbank: { name: 'World Bank', coverage: 'global', depth: 'global_baseline' as DataDepthLevel, reliability: 95 },
  who: { name: 'WHO', coverage: 'global', depth: 'global_baseline' as DataDepthLevel, reliability: 90 },
  imf: { name: 'IMF', coverage: 'global', depth: 'global_baseline' as DataDepthLevel, reliability: 95 },
  oecd: { name: 'OECD', coverage: 'oecd', depth: 'regional_bloc' as DataDepthLevel, reliability: 95 },
  eurostat: { name: 'Eurostat', coverage: 'eu', depth: 'regional_bloc' as DataDepthLevel, reliability: 95 },
};

// GMI components
export const gmiComponents = [
  { id: 'health', name: 'Hälsa', icon: '🏥', defaultWeight: 0.20, kpis: ['life_expectancy', 'infant_mortality'] },
  { id: 'workforce', name: 'Arbetsförmåga', icon: '💼', defaultWeight: 0.25, kpis: ['employment_rate', 'unemployment'] },
  { id: 'economy', name: 'Ekonomi', icon: '💰', defaultWeight: 0.20, kpis: ['gdp_per_capita', 'government_debt'] },
  { id: 'education', name: 'Utbildning', icon: '🎓', defaultWeight: 0.15, kpis: ['tertiary_education', 'adult_literacy'] },
  { id: 'stability', name: 'Stabilitet', icon: '🤝', defaultWeight: 0.20, kpis: ['crime_rate', 'social_trust'] },
];

// Helpers
export function getComparabilityLevel(score: number): ComparabilityLevel {
  if (score >= 0.85) return 'full';
  if (score >= 0.60) return 'partial';
  if (score >= 0.30) return 'limited';
  return 'none';
}

export function getTotalIndicators(): number {
  return Object.values(globalDataSourcesCatalog).flat().reduce((sum, s) => sum + s.indicators, 0);
}

export function getTotalSources(): number {
  return Object.values(globalDataSourcesCatalog).flat().length;
}

export function isFeatureAvailable(dataDepth: DataDepthLevel, feature: string): boolean {
  const depthOrder: DataDepthLevel[] = ['global_baseline', 'regional_bloc', 'national_deep'];
  const requiredDepth: Record<string, DataDepthLevel> = {
    regional: 'regional_bloc', municipal: 'national_deep', responsibility: 'national_deep', feeds: 'national_deep', simulation: 'national_deep',
  };
  return depthOrder.indexOf(dataDepth) >= depthOrder.indexOf(requiredDepth[feature] || 'global_baseline');
}

// ============================================================
// WAVE 12: BLOCK CQ — GLOBAL ADOPTION PLAYBOOK
// BLOCK CR — FEDERATION EXPANSION (1000 NODES)
// BLOCK CS — GLOBAL CURATION (UTAN CENTRAL MAKT)
// ============================================================

export type UserCategory = 'journalists' | 'researchers' | 'policy_analysts' | 'ngos' | 'enterprises';

export interface AdoptionTarget {
  priority: number;
  category: UserCategory;
  label_sv: string;
  entry_point: 'free' | 'api' | 'enterprise';
  value_proposition: string;
  conversion_path: string;
}

export const ADOPTION_TARGETS: AdoptionTarget[] = [
  { priority: 1, category: 'journalists', label_sv: 'Journalister & redaktioner', entry_point: 'free', value_proposition: 'Snabb faktakoll med full källtransparens', conversion_path: 'Gratis → Embed SDK → API' },
  { priority: 2, category: 'researchers', label_sv: 'Forskare & universitet', entry_point: 'free', value_proposition: 'Reproducerbar data med metoddokumentation', conversion_path: 'Gratis → API → Institutionslicens' },
  { priority: 3, category: 'policy_analysts', label_sv: 'Policyanalytiker & myndigheter', entry_point: 'free', value_proposition: 'Tvärsektoriell analys med jämförbarhetsflaggor', conversion_path: 'Gratis → Feeds → Enterprise SLA' },
  { priority: 4, category: 'ngos', label_sv: 'NGOs & civilsamhälle', entry_point: 'free', value_proposition: 'Oberoende data för opinionsbildning', conversion_path: 'Gratis → Embed → White-label' },
  { priority: 5, category: 'enterprises', label_sv: 'Företag & investerare', entry_point: 'api', value_proposition: 'Kontextuell data utan bias', conversion_path: 'API trial → Enterprise' }
];

export interface AdoptionLeverage {
  id: string;
  type: 'content' | 'tool' | 'education' | 'event';
  name_sv: string;
  target_audience: UserCategory[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'ongoing';
  cost: 'free';
}

export const ADOPTION_LEVERAGES: AdoptionLeverage[] = [
  { id: 'al_01', type: 'content', name_sv: 'What Changed Today?-feeds', target_audience: ['journalists', 'policy_analysts'], frequency: 'daily', cost: 'free' },
  { id: 'al_02', type: 'tool', name_sv: 'Embed SDK till medier', target_audience: ['journalists', 'ngos'], frequency: 'ongoing', cost: 'free' },
  { id: 'al_03', type: 'education', name_sv: 'Kursmaterial för universitet', target_audience: ['researchers'], frequency: 'ongoing', cost: 'free' },
  { id: 'al_04', type: 'event', name_sv: 'Öppna seminarier om metod', target_audience: ['researchers', 'policy_analysts'], frequency: 'monthly', cost: 'free' }
];

// CR1: Federation Node Types
export type FederatedNodeType = 'university' | 'national_statistics' | 'regional_hub' | 'media_house' | 'research_institute';

export interface FederatedNodeSpec {
  type: FederatedNodeType;
  label_sv: string;
  min_transparency_score: number;
  verification_requirements: string[];
}

export const FEDERATED_NODE_SPECS: FederatedNodeSpec[] = [
  { type: 'university', label_sv: 'Universitet', min_transparency_score: 0.8, verification_requirements: ['Institutional affiliation'] },
  { type: 'national_statistics', label_sv: 'Nationell statistikbyrå', min_transparency_score: 0.9, verification_requirements: ['Government registration'] },
  { type: 'regional_hub', label_sv: 'Regional datahubb', min_transparency_score: 0.7, verification_requirements: ['Regional authority'] },
  { type: 'media_house', label_sv: 'Mediehus', min_transparency_score: 0.75, verification_requirements: ['Press credentials'] },
  { type: 'research_institute', label_sv: 'Forskningsinstitut', min_transparency_score: 0.85, verification_requirements: ['Research track record'] }
];

export const FEDERATION_TARGETS = { year_1: 100, year_3: 500, year_5: 1000, year_10: 5000 } as const;

// CS1: Curation Signals — No Central Power
export interface CurationSignal {
  id: string;
  name_sv: string;
  weight: number;
  higher_is_better: boolean;
}

export const CURATION_SIGNALS: CurationSignal[] = [
  { id: 'cs_transparency', name_sv: 'Transparensscore', weight: 0.25, higher_is_better: true },
  { id: 'cs_reproducibility', name_sv: 'Reproducerbarhet', weight: 0.25, higher_is_better: true },
  { id: 'cs_method_clarity', name_sv: 'Metodklarhet', weight: 0.20, higher_is_better: true },
  { id: 'cs_coverage', name_sv: 'Datatäckning', weight: 0.15, higher_is_better: true },
  { id: 'cs_user_verification', name_sv: 'Användarverifiering', weight: 0.15, higher_is_better: true }
];

export const CURATION_POLICY = {
  removal_allowed: false,
  downranking_allowed: true,
  reason: 'Algoritmisk prioritering, aldrig borttagning'
} as const;
