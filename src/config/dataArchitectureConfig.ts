/**
 * 🧩 MASTER EXECUTION BLOCK 41
 * 
 * "ALL DATA IN – SIMPLE OUT"
 * Global Data Aggregation & Progressive Complexity
 * 
 * Principle:
 * - All open, relevant data connected
 * - No view requires prior knowledge
 * - Advanced work requires permission/license – not a different system
 */

// ============================================================
// DATA CONTRACT (UNBREAKABLE)
// ============================================================

export interface DataContract {
  indicator_id: string;
  domain: DataDomain;
  time_span: { start: number; end: number };
  geographic_level: GeographicLevel;
  source_id: string;
  method: DataMethod;
  uncertainty_level: UncertaintyLevel;
  license: 'open' | 'attribution' | 'restricted';
}

export type DataDomain = 
  | 'economy'
  | 'health'
  | 'education'
  | 'environment'
  | 'governance'
  | 'demographics'
  | 'infrastructure'
  | 'security'
  | 'energy'
  | 'labor';

export type GeographicLevel = 
  | 'world'
  | 'region'
  | 'country'
  | 'subnational'
  | 'municipality';

export type DataMethod = 
  | 'observed'
  | 'estimated'
  | 'reconstructed';

export type UncertaintyLevel = 
  | 'low'
  | 'medium'
  | 'high';

// Rule: If any field is missing, data point is not displayed
export const DATA_CONTRACT_VALIDATION = {
  required_fields: [
    'indicator_id',
    'domain', 
    'time_span',
    'geographic_level',
    'source_id',
    'method',
    'uncertainty_level',
    'license',
  ],
  rule: {
    sv: 'Om något saknas → datapunkten visas inte.',
    en: 'If anything is missing → the data point is not displayed.',
  },
};

// ============================================================
// DATA SOURCES (MAXIMAL BREADTH)
// ============================================================

export interface DataSourceCategory {
  id: string;
  name: { sv: string; en: string };
  sources: DataSourceDefinition[];
}

export interface DataSourceDefinition {
  id: string;
  name: string;
  organization: string;
  url?: string;
  coverage: GeographicLevel[];
  domains: DataDomain[];
  update_frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'irregular';
  historical_depth_years?: number;
  is_connected: boolean;
}

export const DATA_SOURCE_CATEGORIES: DataSourceCategory[] = [
  // GLOBAL SOURCES
  {
    id: 'global',
    name: { sv: 'Globala', en: 'Global' },
    sources: [
      { id: 'un-undp', name: 'UNDP', organization: 'United Nations', coverage: ['world', 'country'], domains: ['economy', 'health', 'education'], update_frequency: 'annual', is_connected: false },
      { id: 'un-who', name: 'WHO', organization: 'United Nations', coverage: ['world', 'country'], domains: ['health'], update_frequency: 'annual', is_connected: false },
      { id: 'un-fao', name: 'FAO', organization: 'United Nations', coverage: ['world', 'country'], domains: ['environment', 'economy'], update_frequency: 'annual', is_connected: false },
      { id: 'un-ilo', name: 'ILO', organization: 'United Nations', coverage: ['world', 'country'], domains: ['labor'], update_frequency: 'annual', is_connected: false },
      { id: 'worldbank', name: 'World Development Indicators', organization: 'World Bank', coverage: ['world', 'country'], domains: ['economy', 'health', 'education', 'infrastructure'], update_frequency: 'annual', historical_depth_years: 60, is_connected: true },
      { id: 'imf', name: 'World Economic Outlook', organization: 'IMF', coverage: ['world', 'country'], domains: ['economy'], update_frequency: 'quarterly', is_connected: false },
      { id: 'oecd', name: 'OECD Statistics', organization: 'OECD', coverage: ['country'], domains: ['economy', 'education', 'health', 'labor'], update_frequency: 'quarterly', is_connected: false },
      { id: 'iea', name: 'World Energy Statistics', organization: 'IEA', coverage: ['world', 'country'], domains: ['energy'], update_frequency: 'annual', is_connected: false },
      { id: 'unesco', name: 'UNESCO Institute for Statistics', organization: 'UNESCO', coverage: ['world', 'country'], domains: ['education'], update_frequency: 'annual', is_connected: false },
      { id: 'owid', name: 'Our World in Data', organization: 'OWID', coverage: ['world', 'country'], domains: ['economy', 'health', 'education', 'environment', 'demographics'], update_frequency: 'irregular', historical_depth_years: 200, is_connected: true },
    ],
  },
  // NATIONAL SOURCES (Examples)
  {
    id: 'national',
    name: { sv: 'Nationella', en: 'National' },
    sources: [
      { id: 'scb', name: 'SCB', organization: 'Statistics Sweden', coverage: ['country', 'subnational', 'municipality'], domains: ['economy', 'demographics', 'labor', 'education'], update_frequency: 'monthly', is_connected: true },
      { id: 'eurostat', name: 'Eurostat', organization: 'European Commission', coverage: ['region', 'country', 'subnational'], domains: ['economy', 'demographics', 'labor'], update_frequency: 'monthly', is_connected: false },
    ],
  },
  // ACADEMIC / HISTORICAL
  {
    id: 'academic',
    name: { sv: 'Akademiska / Historiska', en: 'Academic / Historical' },
    sources: [
      { id: 'maddison', name: 'Maddison Project', organization: 'University of Groningen', coverage: ['world', 'country'], domains: ['economy'], update_frequency: 'irregular', historical_depth_years: 2000, is_connected: true },
      { id: 'cow', name: 'Correlates of War', organization: 'University of Michigan', coverage: ['world', 'country'], domains: ['security'], update_frequency: 'irregular', historical_depth_years: 200, is_connected: true },
      { id: 'vdem', name: 'V-Dem', organization: 'V-Dem Institute', coverage: ['country'], domains: ['governance'], update_frequency: 'annual', historical_depth_years: 230, is_connected: true },
    ],
  },
];

// ============================================================
// VIEW LAYERS (THREE TIERS)
// ============================================================

export type ViewLayer = 'simple' | 'detailed' | 'advanced';

export interface ViewLayerConfig {
  id: ViewLayer;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  target_audience: { sv: string; en: string };
  goal: { sv: string; en: string };
  requires_auth: boolean;
  requires_license: boolean;
  features: string[];
}

export const VIEW_LAYERS: Record<ViewLayer, ViewLayerConfig> = {
  // LAYER 1 — SIMPLE OVERVIEW (ALL)
  simple: {
    id: 'simple',
    name: { sv: 'Enkel översikt', en: 'Simple overview' },
    description: { 
      sv: 'Hur går det – i stora drag?', 
      en: 'How is it going – in broad terms?' 
    },
    target_audience: { 
      sv: 'Alla, inklusive gymnasieelever', 
      en: 'Everyone, including high school students' 
    },
    goal: { 
      sv: 'Förstå på 60 sekunder', 
      en: 'Understand in 60 seconds' 
    },
    requires_auth: false,
    requires_license: false,
    features: [
      '5-7 key indicators',
      'Clear words (no indices)',
      'No advanced interaction',
      'Color + short text',
      'Click = deeper exploration',
    ],
  },

  // LAYER 2 — DETAILED ANALYSIS (LOGGED IN / STANDARD)
  detailed: {
    id: 'detailed',
    name: { sv: 'Fördjupad analys', en: 'Detailed analysis' },
    description: { 
      sv: 'Vad händer – och hur hänger det ihop?', 
      en: 'What is happening – and how is it connected?' 
    },
    target_audience: { 
      sv: 'Journalister, tjänstemän, NGO, engagerade medborgare', 
      en: 'Journalists, civil servants, NGOs, engaged citizens' 
    },
    goal: { 
      sv: 'Förstå sammanhang och trender', 
      en: 'Understand context and trends' 
    },
    requires_auth: false,
    requires_license: false,
    features: [
      'Timelines',
      'Comparisons',
      'Correlations (marked as non-causal)',
      'Maps',
      'Historical depth',
    ],
  },

  // LAYER 3 — ADVANCED MODELING (PRO / LICENSE)
  advanced: {
    id: 'advanced',
    name: { sv: 'Avancerad modellering', en: 'Advanced modeling' },
    description: { 
      sv: 'Låt mig arbeta med detta professionellt', 
      en: 'Let me work with this professionally' 
    },
    target_audience: { 
      sv: 'Analytiker, myndigheter, forskare, organisationer', 
      en: 'Analysts, authorities, researchers, organizations' 
    },
    goal: { 
      sv: 'Professionellt analysarbete', 
      en: 'Professional analytical work' 
    },
    requires_auth: true,
    requires_license: true,
    features: [
      'Weight indicators',
      'Build custom indices',
      'Create scenarios (sensitivity, not forecast)',
      'Combine domains',
      'Export via API',
      'Save, share, automate',
    ],
  },
};

// ============================================================
// PERMISSION & LICENSE TIERS
// ============================================================

export type LicenseTier = 'free' | 'standard' | 'pro' | 'enterprise';

export interface LicenseTierConfig {
  id: LicenseTier;
  name: { sv: string; en: string };
  price_indicator: string;
  features: { sv: string[]; en: string[] };
}

export const LICENSE_TIERS: Record<LicenseTier, LicenseTierConfig> = {
  free: {
    id: 'free',
    name: { sv: 'Gratis', en: 'Free' },
    price_indicator: '€0',
    features: {
      sv: [
        'All data',
        'Alla enkla vyer',
        'Alla Big Questions',
        'Alla nivåer (värld → kommun)',
        'Alla språk',
      ],
      en: [
        'All data',
        'All simple views',
        'All Big Questions',
        'All levels (world → municipality)',
        'All languages',
      ],
    },
  },
  standard: {
    id: 'standard',
    name: { sv: 'Standard', en: 'Standard' },
    price_indicator: '€0',
    features: {
      sv: [
        'Spara vyer (begränsat)',
        'Följa frågor',
        'Enkla rapporter',
      ],
      en: [
        'Save views (limited)',
        'Follow questions',
        'Simple reports',
      ],
    },
  },
  pro: {
    id: 'pro',
    name: { sv: 'Professionell', en: 'Professional' },
    price_indicator: '€/month',
    features: {
      sv: [
        'Avancerad aggregering',
        'Egen indikatorbyggare',
        'Djup historisk analys',
        'Full rapportmotor',
        'API-export',
      ],
      en: [
        'Advanced aggregation',
        'Custom indicator builder',
        'Deep historical analysis',
        'Full report engine',
        'API export',
      ],
    },
  },
  enterprise: {
    id: 'enterprise',
    name: { sv: 'Enterprise', en: 'Enterprise' },
    price_indicator: 'Custom',
    features: {
      sv: [
        'Högre API-gränser',
        'Automatiserade flöden',
        'Team & roller',
        'Revisionslogg',
      ],
      en: [
        'Higher API limits',
        'Automated workflows',
        'Teams & roles',
        'Audit log',
      ],
    },
  },
};

// ============================================================
// VIEW SIMPLIFICATION RULES (ABSOLUTE)
// ============================================================

export const VIEW_SIMPLIFICATION_RULES = {
  absolute: [
    { sv: 'Inga diagram utan textförklaring', en: 'No charts without text explanation' },
    { sv: 'Inga pilar utan förklaring', en: 'No arrows without explanation' },
    { sv: 'Inga procent utan bas', en: 'No percentages without base' },
    { sv: 'Inga index utan "vad betyder detta i verkligheten?"', en: 'No indices without "what does this mean in reality?"' },
  ],
  bad_example: '+0.2% QoQ',
  good_example: {
    sv: 'En liten ökning jämfört med förra kvartalet. Fortfarande under det långsiktiga genomsnittet.',
    en: 'A small increase compared to last quarter. Still below long-term average.',
  },
};

// ============================================================
// PROGRESSIVE DISCLOSURE
// ============================================================

export const PROGRESSIVE_DISCLOSURE = {
  principle: {
    sv: 'Visa minsta möjliga som krävs. Avslöja mer först när användaren ber om det.',
    en: 'Show the minimum necessary. Reveal more only when the user asks.',
  },
  triggers: [
    { sv: 'Visa detaljer', en: 'Show details' },
    { sv: 'Hur beräknas detta?', en: 'How is this calculated?' },
    { sv: 'Se osäkerhet', en: 'See uncertainty' },
    { sv: 'Bygg egen modell', en: 'Build custom model' },
  ],
  rule: {
    sv: 'Ingen överbelastning. Aldrig.',
    en: 'No overload. Never.',
  },
};

// ============================================================
// SAFE ADVANCED ANALYSIS
// ============================================================

export const SAFE_ANALYSIS = {
  allowed: [
    'Correlation',
    'Sensitivity analysis',
    'Weighting',
    'Historical comparison',
  ],
  forbidden: [
    'Forecasts with dates',
    'Policy recommendations',
    'Operational conclusions',
  ],
  disclaimer: {
    sv: 'Denna analys utforskar samband i data. Den förutsäger inte utfall.',
    en: 'This analysis explores relationships in the data. It does not predict outcomes.',
  },
};

// ============================================================
// DEFINITION OF DONE
// ============================================================

export const DEFINITION_OF_DONE = [
  { sv: 'Alla stora frågor kan förstås utan bakgrund', en: 'All big questions can be understood without background' },
  { sv: 'All data kan nås utan betalvägg', en: 'All data accessible without paywall' },
  { sv: 'Avancerat arbete är kraftfullt men säkert', en: 'Advanced work is powerful but safe' },
  { sv: 'Ingen vy kan missförstås lätt', en: 'No view can be easily misunderstood' },
  { sv: 'Systemet känns lugnt, rent, självklart', en: 'The system feels calm, clean, obvious' },
];
