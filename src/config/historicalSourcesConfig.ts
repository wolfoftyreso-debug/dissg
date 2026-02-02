/**
 * 📚 MASTER EXECUTION BLOCK 40
 * 
 * GLOBAL HISTORICAL SOURCES & INGESTION (PER DOMAIN)
 * 
 * Source Registry, Ingestion Pipeline, Versioning, Cross-Source Validation
 * 
 * Principles:
 * - Only open, citable sources
 * - Original sources prioritized over compilations
 * - Every data point marked with source, year, method, uncertainty
 * - No data point without source ID
 */

// ============================================================
// SOURCE PRINCIPLES (LOCKED)
// ============================================================

export const SOURCE_PRINCIPLES = {
  requirements: [
    'Only open, citable sources',
    'Original sources prioritized over compilations',
    'Every data point marked with source, year, method, uncertainty',
    'No data point without source ID',
  ],
  mandatory_fields: [
    'source_id',
    'year',
    'method',
    'uncertainty_class',
  ],
  rule: {
    sv: 'Källan är förstaklass-objekt i databasen.',
    en: 'The source is a first-class object in the database.',
  },
} as const;

// ============================================================
// SOURCE TYPES
// ============================================================

export type SourceMethodology = 
  | 'observation'      // Direct measurement
  | 'survey'           // Survey-based
  | 'estimate'         // Statistical estimate
  | 'reconstruction'   // Historical reconstruction
  | 'proxy'            // Proxy indicator
  | 'compilation';     // Meta-analysis of multiple sources

export type UncertaintyClass = 
  | 'high_confidence'      // Modern data, well-documented
  | 'moderate_confidence'  // Recent historical, some gaps
  | 'low_confidence'       // Historical estimates
  | 'reconstructed';       // Deep historical, significant uncertainty

export type SourceLicense = 
  | 'open'             // Fully open
  | 'attribution'      // Attribution required
  | 'non_commercial'   // NC license
  | 'restricted';      // Limited use

export type DomainCategory = 
  | 'economy'
  | 'labor_productivity'
  | 'energy_resources'
  | 'health_demography'
  | 'education'
  | 'institutions'
  | 'conflict';

// ============================================================
// SOURCE REGISTRY INTERFACE
// ============================================================

export interface HistoricalSource {
  source_id: string;
  title: string;
  publisher: string;
  domain: DomainCategory;
  coverage_years: { start: number; end: number };
  geographic_scope: 'global' | 'regional' | 'national' | 'subnational';
  countries_covered?: string[];
  methodology: SourceMethodology;
  known_limitations: string[];
  license: SourceLicense;
  url?: string;
  doi?: string;
  last_verified: string; // ISO date
  update_frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'irregular' | 'historical_only';
  is_primary: boolean; // Original vs compilation
  parent_sources?: string[]; // If compilation, which sources does it aggregate
  version: string;
  deprecated?: boolean;
  deprecation_reason?: string;
}

// ============================================================
// SOURCES PER DOMAIN
// ============================================================

export const DOMAIN_SOURCES: Record<DomainCategory, HistoricalSource[]> = {
  // ─────────────────────────────────────────────────────────
  // 2.1 ECONOMY & LIVING STANDARDS (100-200+ years)
  // ─────────────────────────────────────────────────────────
  economy: [
    {
      source_id: 'SRC-ECON-001',
      title: 'Maddison Project Database',
      publisher: 'Groningen Growth and Development Centre',
      domain: 'economy',
      coverage_years: { start: 1, end: 2020 },
      geographic_scope: 'global',
      methodology: 'reconstruction',
      known_limitations: [
        'Pre-1820 data based on limited historical records',
        'Country boundaries may differ from modern definitions',
        'PPP adjustments carry uncertainty for early periods',
      ],
      license: 'open',
      url: 'https://www.rug.nl/ggdc/historicaldevelopment/maddison/',
      last_verified: '2024-01-15',
      update_frequency: 'irregular',
      is_primary: false,
      version: '2020',
    },
    {
      source_id: 'SRC-ECON-002',
      title: 'World Bank World Development Indicators',
      publisher: 'World Bank',
      domain: 'economy',
      coverage_years: { start: 1960, end: 2024 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Coverage varies by country and indicator',
        'Some values are estimates for missing years',
      ],
      license: 'attribution',
      url: 'https://data.worldbank.org/',
      last_verified: '2024-06-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2024',
    },
    {
      source_id: 'SRC-ECON-003',
      title: 'Penn World Table',
      publisher: 'Groningen Growth and Development Centre',
      domain: 'economy',
      coverage_years: { start: 1950, end: 2019 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Capital stock estimates have high uncertainty',
        'TFP calculations depend on functional form assumptions',
      ],
      license: 'open',
      url: 'https://www.rug.nl/ggdc/productivity/pwt/',
      last_verified: '2024-01-10',
      update_frequency: 'irregular',
      is_primary: false,
      version: '10.01',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.2 LABOR, PRODUCTIVITY & TECHNOLOGY (50-150 years)
  // ─────────────────────────────────────────────────────────
  labor_productivity: [
    {
      source_id: 'SRC-LABOR-001',
      title: 'ILO Labour Statistics',
      publisher: 'International Labour Organization',
      domain: 'labor_productivity',
      coverage_years: { start: 1990, end: 2024 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Informal sector often underrepresented',
        'Definition of employment varies by country',
      ],
      license: 'attribution',
      url: 'https://ilostat.ilo.org/',
      last_verified: '2024-06-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2024',
    },
    {
      source_id: 'SRC-LABOR-002',
      title: 'OECD Productivity Statistics',
      publisher: 'OECD',
      domain: 'labor_productivity',
      coverage_years: { start: 1970, end: 2023 },
      geographic_scope: 'regional',
      countries_covered: ['OECD members'],
      methodology: 'estimate',
      known_limitations: [
        'Limited to OECD countries',
        'Sectoral productivity measures have allocation issues',
      ],
      license: 'attribution',
      url: 'https://stats.oecd.org/',
      last_verified: '2024-05-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2023',
    },
    {
      source_id: 'SRC-LABOR-003',
      title: 'Historical Working Hours (Huberman & Minns)',
      publisher: 'Academic Research',
      domain: 'labor_productivity',
      coverage_years: { start: 1870, end: 2000 },
      geographic_scope: 'regional',
      methodology: 'reconstruction',
      known_limitations: [
        'Based on limited historical surveys',
        'Excludes informal and agricultural work',
      ],
      license: 'open',
      last_verified: '2024-01-01',
      update_frequency: 'historical_only',
      is_primary: true,
      version: '2007',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.3 ENERGY & RESOURCES (100-200 years)
  // ─────────────────────────────────────────────────────────
  energy_resources: [
    {
      source_id: 'SRC-ENERGY-001',
      title: 'BP Statistical Review of World Energy',
      publisher: 'BP / Energy Institute',
      domain: 'energy_resources',
      coverage_years: { start: 1965, end: 2023 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Some countries have incomplete reporting',
        'Renewable categories evolved over time',
      ],
      license: 'attribution',
      url: 'https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy.html',
      last_verified: '2024-06-15',
      update_frequency: 'annual',
      is_primary: true,
      version: '2023',
    },
    {
      source_id: 'SRC-ENERGY-002',
      title: 'IEA World Energy Statistics',
      publisher: 'International Energy Agency',
      domain: 'energy_resources',
      coverage_years: { start: 1971, end: 2022 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Non-OECD data quality varies',
        'Traditional biomass often underreported',
      ],
      license: 'restricted',
      url: 'https://www.iea.org/data-and-statistics',
      last_verified: '2024-04-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2023',
    },
    {
      source_id: 'SRC-ENERGY-003',
      title: 'Historical Energy Transitions (Smil)',
      publisher: 'Academic Research',
      domain: 'energy_resources',
      coverage_years: { start: 1800, end: 2020 },
      geographic_scope: 'global',
      methodology: 'reconstruction',
      known_limitations: [
        '19th century data highly uncertain',
        'Regional variations not fully captured',
      ],
      license: 'open',
      last_verified: '2024-01-01',
      update_frequency: 'historical_only',
      is_primary: true,
      version: '2017',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.4 HEALTH & DEMOGRAPHY (200-500 years where possible)
  // ─────────────────────────────────────────────────────────
  health_demography: [
    {
      source_id: 'SRC-DEMO-001',
      title: 'UN World Population Prospects',
      publisher: 'United Nations',
      domain: 'health_demography',
      coverage_years: { start: 1950, end: 2100 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Projections carry increasing uncertainty',
        'Some countries lack vital registration',
      ],
      license: 'open',
      url: 'https://population.un.org/wpp/',
      last_verified: '2024-06-01',
      update_frequency: 'irregular',
      is_primary: true,
      version: '2022',
    },
    {
      source_id: 'SRC-DEMO-002',
      title: 'Human Mortality Database',
      publisher: 'Max Planck Institute / UC Berkeley',
      domain: 'health_demography',
      coverage_years: { start: 1751, end: 2023 },
      geographic_scope: 'national',
      methodology: 'observation',
      known_limitations: [
        'Limited to countries with good vital registration',
        'Early data may have registration gaps',
      ],
      license: 'attribution',
      url: 'https://www.mortality.org/',
      last_verified: '2024-05-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2024',
    },
    {
      source_id: 'SRC-DEMO-003',
      title: 'Gapminder Historical Data',
      publisher: 'Gapminder Foundation',
      domain: 'health_demography',
      coverage_years: { start: 1800, end: 2024 },
      geographic_scope: 'global',
      methodology: 'compilation',
      known_limitations: [
        'Pre-1900 data heavily interpolated',
        'Some indicators are model-based',
      ],
      license: 'open',
      url: 'https://www.gapminder.org/data/',
      last_verified: '2024-03-01',
      update_frequency: 'irregular',
      is_primary: false,
      parent_sources: ['SRC-DEMO-001', 'SRC-DEMO-002'],
      version: '2024',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.5 EDUCATION & SKILLS (50-150 years)
  // ─────────────────────────────────────────────────────────
  education: [
    {
      source_id: 'SRC-EDU-001',
      title: 'UNESCO Institute for Statistics',
      publisher: 'UNESCO',
      domain: 'education',
      coverage_years: { start: 1970, end: 2023 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Quality measures limited',
        'Private education often undercounted',
      ],
      license: 'open',
      url: 'http://data.uis.unesco.org/',
      last_verified: '2024-05-15',
      update_frequency: 'annual',
      is_primary: true,
      version: '2023',
    },
    {
      source_id: 'SRC-EDU-002',
      title: 'Barro-Lee Educational Attainment Dataset',
      publisher: 'Academic Research',
      domain: 'education',
      coverage_years: { start: 1950, end: 2015 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Based on census data with gaps',
        '5-year intervals only',
      ],
      license: 'open',
      url: 'http://www.barrolee.com/',
      last_verified: '2024-01-01',
      update_frequency: 'irregular',
      is_primary: true,
      version: '2.2',
    },
    {
      source_id: 'SRC-EDU-003',
      title: 'Historical Literacy Rates (OWID)',
      publisher: 'Our World in Data',
      domain: 'education',
      coverage_years: { start: 1800, end: 2020 },
      geographic_scope: 'global',
      methodology: 'reconstruction',
      known_limitations: [
        'Pre-1900 estimates highly uncertain',
        'Definition of literacy varies',
      ],
      license: 'open',
      url: 'https://ourworldindata.org/literacy',
      last_verified: '2024-02-01',
      update_frequency: 'irregular',
      is_primary: false,
      version: '2021',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.6 INSTITUTIONS & GOVERNANCE (50-200 years)
  // ─────────────────────────────────────────────────────────
  institutions: [
    {
      source_id: 'SRC-INST-001',
      title: 'Varieties of Democracy (V-Dem)',
      publisher: 'V-Dem Institute',
      domain: 'institutions',
      coverage_years: { start: 1789, end: 2023 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Expert coding introduces subjectivity',
        'Historical periods have fewer coders',
      ],
      license: 'open',
      url: 'https://www.v-dem.net/',
      last_verified: '2024-04-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '14',
    },
    {
      source_id: 'SRC-INST-002',
      title: 'Polity5 Project',
      publisher: 'Center for Systemic Peace',
      domain: 'institutions',
      coverage_years: { start: 1800, end: 2018 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Ordinal scale limits precision',
        'Transition periods may be miscoded',
      ],
      license: 'open',
      url: 'https://www.systemicpeace.org/polityproject.html',
      last_verified: '2024-01-01',
      update_frequency: 'irregular',
      is_primary: true,
      version: '2018',
    },
    {
      source_id: 'SRC-INST-003',
      title: 'World Governance Indicators',
      publisher: 'World Bank',
      domain: 'institutions',
      coverage_years: { start: 1996, end: 2022 },
      geographic_scope: 'global',
      methodology: 'estimate',
      known_limitations: [
        'Composite index masks component variation',
        'Perception-based measures',
      ],
      license: 'open',
      url: 'https://info.worldbank.org/governance/wgi/',
      last_verified: '2024-03-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '2023',
    },
  ],

  // ─────────────────────────────────────────────────────────
  // 2.7 CONFLICT & INSTABILITY (200-500 years)
  // ─────────────────────────────────────────────────────────
  conflict: [
    {
      source_id: 'SRC-CONF-001',
      title: 'Correlates of War Project',
      publisher: 'University of Michigan',
      domain: 'conflict',
      coverage_years: { start: 1816, end: 2020 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Battle deaths estimates vary',
        'Intrastate conflicts undercounted before 1946',
      ],
      license: 'open',
      url: 'https://correlatesofwar.org/',
      last_verified: '2024-02-01',
      update_frequency: 'irregular',
      is_primary: true,
      version: '5.0',
    },
    {
      source_id: 'SRC-CONF-002',
      title: 'Uppsala Conflict Data Program (UCDP)',
      publisher: 'Uppsala University',
      domain: 'conflict',
      coverage_years: { start: 1946, end: 2023 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        '25 battle deaths threshold excludes low-intensity violence',
        'Non-state conflicts may be undercounted',
      ],
      license: 'open',
      url: 'https://ucdp.uu.se/',
      last_verified: '2024-06-01',
      update_frequency: 'annual',
      is_primary: true,
      version: '24.1',
    },
    {
      source_id: 'SRC-CONF-003',
      title: 'ACLED (Armed Conflict Location & Event Data)',
      publisher: 'ACLED',
      domain: 'conflict',
      coverage_years: { start: 1997, end: 2024 },
      geographic_scope: 'global',
      methodology: 'observation',
      known_limitations: [
        'Media-based coding may miss remote events',
        'Coverage expansion over time affects comparability',
      ],
      license: 'attribution',
      url: 'https://acleddata.com/',
      last_verified: '2024-06-15',
      update_frequency: 'weekly',
      is_primary: true,
      version: '2024',
    },
  ],
};

// ============================================================
// INGESTION PIPELINE CONFIGURATION
// ============================================================

export interface IngestionStep {
  step: number;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
}

export const INGESTION_PIPELINE: IngestionStep[] = [
  {
    step: 1,
    name: { sv: 'Hämta rådata', en: 'Fetch raw data' },
    description: { sv: 'Ladda ner data från originalkälla', en: 'Download data from original source' },
  },
  {
    step: 2,
    name: { sv: 'Normalisera format', en: 'Normalize format' },
    description: { sv: 'Konvertera till standardformat', en: 'Convert to standard format' },
  },
  {
    step: 3,
    name: { sv: 'Märk metod & osäkerhet', en: 'Mark method & uncertainty' },
    description: { sv: 'Tilldela metodologi och osäkerhetsklass', en: 'Assign methodology and uncertainty class' },
  },
  {
    step: 4,
    name: { sv: 'Mappa till indikatorer', en: 'Map to indicators' },
    description: { sv: 'Koppla till interna indikatordefinitioner', en: 'Link to internal indicator definitions' },
  },
  {
    step: 5,
    name: { sv: 'Validera mot intervall', en: 'Validate against ranges' },
    description: { sv: 'Kontrollera att värden är rimliga', en: 'Check that values are reasonable' },
  },
  {
    step: 6,
    name: { sv: 'Lagra med versionshash', en: 'Store with version hash' },
    description: { sv: 'Spara med checksumma och versionsID', en: 'Save with checksum and version ID' },
  },
];

// ============================================================
// VERSIONING RULES
// ============================================================

export const VERSIONING_RULES = {
  immutable_history: true, // Old versions always accessible
  revision_explanation_required: true,
  ui_disclaimer: {
    sv: 'Data reviderad {year} baserat på uppdaterad metodik.',
    en: 'Data revised in {year} based on updated methodology.',
  },
  principle: {
    sv: 'Historien skrivs inte om – den förklaras om.',
    en: 'History is not rewritten – it is re-explained.',
  },
};

// ============================================================
// CROSS-SOURCE VALIDATION
// ============================================================

export const CROSS_SOURCE_VALIDATION = {
  when_multiple_sources: {
    show_range: true,
    show_median: true,
    show_deviation: true,
  },
  disclaimer: {
    sv: 'Tre oberoende estimat finns för denna period. Visade värden representerar det centrala estimatet.',
    en: 'Three independent estimates exist for this period. Values shown represent the central estimate.',
  },
};

// ============================================================
// API & EXPORT REQUIREMENTS
// ============================================================

export const EXPORT_REQUIREMENTS = {
  mandatory_fields: [
    'source_id',
    'method',
    'uncertainty_class',
    'version',
  ],
  principle: {
    sv: 'Ingen datapunkt får lämna systemet utan kontext.',
    en: 'No data point may leave the system without context.',
  },
};

// ============================================================
// NIGHTLY SOURCE AUDIT
// ============================================================

export const NIGHTLY_AUDIT_CHECKS = [
  'check_links',
  'verify_licenses',
  'detect_methodology_changes',
  'flag_deprecated_sources',
];

// ============================================================
// UI TEXT
// ============================================================

export const SOURCE_UI_TEXT = {
  view_sources: { sv: 'Visa källor', en: 'View sources' },
  how_far_back: { sv: 'Hur långt bak går denna data?', en: 'How far back does this data go?' },
  what_changed: { sv: 'Vad har ändrats över tid?', en: 'What changed over time?' },
  source_list: { sv: 'Källförteckning', en: 'Source list' },
  source_timeline: { sv: 'Källtidslinje', en: 'Source timeline' },
  per_datapoint: { sv: 'Per datapunkt', en: 'Per data point' },
  methodology: { sv: 'Metodik', en: 'Methodology' },
  limitations: { sv: 'Begränsningar', en: 'Limitations' },
  coverage: { sv: 'Täckning', en: 'Coverage' },
  last_verified: { sv: 'Senast verifierad', en: 'Last verified' },
  license: { sv: 'Licens', en: 'License' },
};
