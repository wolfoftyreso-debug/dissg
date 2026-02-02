/**
 * 🌐 MASTER EXECUTION BLOCK 33
 * GLOBAL MUNICIPAL-LEVEL ARCHITECTURE
 * WORLD → COUNTRY → REGION → MUNICIPALITY
 * 
 * MÅL (LÅST):
 * - Alla länder → ner till lägsta fungerande lokala förvaltningsnivå
 * - Jämförbarhet utan att förvanska lokala skillnader
 * - Samma semantik globalt, olika datadensitet lokalt
 * - Inget visas utan korrekt kontext
 * 
 * "Lokal verklighet i global kontext."
 */

// ============================================================
// TYPES
// ============================================================

export type AdminLevel = 'world' | 'country' | 'admin1' | 'admin2' | 'municipality';

export type DataTier = 'A' | 'B' | 'C' | 'D';

export type MunicipalDataCategory = 
  | 'population'
  | 'demographics'
  | 'economy'
  | 'health'
  | 'education'
  | 'crime'
  | 'infrastructure'
  | 'municipal_finance'
  | 'migration';

export interface GMID {
  readonly iso3: string;
  readonly admin1: string;
  readonly admin2?: string;
  readonly local_code: string;
  readonly full: string;
}

export interface MunicipalEntity {
  readonly gmid: GMID;
  readonly name_local: string;
  readonly name_en: string;
  readonly population?: number;
  readonly area_km2?: number;
  readonly data_tier: DataTier;
  readonly admin_level: AdminLevel;
  readonly parent_gmid?: string;
  readonly local_term: string; // kommun, city, commune, shi, etc.
}

export interface DataTierConfig {
  readonly tier: DataTier;
  readonly name_en: string;
  readonly name_sv: string;
  readonly description: string;
  readonly indicator_coverage: string;
  readonly typical_regions: readonly string[];
}

// ============================================================
// 1. GLOBAL ADMINISTRATIVE MODEL (HARDCODED HIERARCHY)
// ============================================================

export const ADMIN_HIERARCHY = {
  levels: [
    { level: 0, code: 'world', name: 'World' },
    { level: 1, code: 'country', name: 'Country' },
    { level: 2, code: 'admin1', name: 'State/Region/Province' },
    { level: 3, code: 'admin2', name: 'County/Prefecture/District' },
    { level: 4, code: 'municipality', name: 'Municipality/City/Local Authority' },
  ] as const,
  
  /**
   * "Municipality" är en funktionell nivå, inte ett namn.
   * Den mappas till lokala termer per land.
   */
  local_term_mappings: {
    SWE: { term: 'kommun', level: 'municipality' },
    USA: { term: 'city/county/township', level: 'municipality' },
    FRA: { term: 'commune', level: 'municipality' },
    JPN: { term: 'shi/ku/cho/son', level: 'municipality' },
    IND: { term: 'municipal corporation/panchayat', level: 'municipality' },
    DEU: { term: 'Gemeinde', level: 'municipality' },
    GBR: { term: 'local authority', level: 'municipality' },
    NOR: { term: 'kommune', level: 'municipality' },
    DNK: { term: 'kommune', level: 'municipality' },
    FIN: { term: 'kunta', level: 'municipality' },
    NLD: { term: 'gemeente', level: 'municipality' },
    BEL: { term: 'gemeente/commune', level: 'municipality' },
    ESP: { term: 'municipio', level: 'municipality' },
    ITA: { term: 'comune', level: 'municipality' },
    POL: { term: 'gmina', level: 'municipality' },
    BRA: { term: 'município', level: 'municipality' },
    MEX: { term: 'municipio', level: 'municipality' },
    ZAF: { term: 'local municipality', level: 'municipality' },
    NGA: { term: 'local government area', level: 'municipality' },
    KEN: { term: 'county', level: 'municipality' },
    AUS: { term: 'local government area', level: 'municipality' },
    CAN: { term: 'municipality', level: 'municipality' },
    CHN: { term: '县/区', level: 'municipality' },
    KOR: { term: '시/군/구', level: 'municipality' },
  } as const,
} as const;

// ============================================================
// 2. GLOBAL MUNICIPAL ID (GMID)
// ============================================================

export const GMID_CONFIG = {
  /**
   * GMID = {ISO3}-{ADMIN1}-{ADMIN2}-{LOCAL_CODE}
   * 
   * Examples:
   * - SWE-STO-0180 (Stockholms kommun)
   * - USA-CA-LA-06037 (Los Angeles County)
   * - FRA-IDF-075 (Paris)
   */
  format: '{ISO3}-{ADMIN1}-{ADMIN2}-{LOCAL_CODE}',
  separator: '-',
  
  usage: [
    'data',
    'reports',
    'api',
    'qr_verification',
    'history',
    'merger_tracking',
  ] as const,
  
  persistence: {
    permanent: true,
    survives_mergers: true,
    tracks_successor: true,
  },
} as const;

export function parseGMID(gmidString: string): GMID | null {
  const parts = gmidString.split('-');
  if (parts.length < 3) return null;
  
  return {
    iso3: parts[0],
    admin1: parts[1],
    admin2: parts.length > 3 ? parts[2] : undefined,
    local_code: parts[parts.length - 1],
    full: gmidString,
  };
}

export function formatGMID(
  iso3: string,
  admin1: string,
  localCode: string,
  admin2?: string
): string {
  if (admin2) {
    return `${iso3}-${admin1}-${admin2}-${localCode}`;
  }
  return `${iso3}-${admin1}-${localCode}`;
}

// ============================================================
// 3. DATA DENSITY STRATEGY
// ============================================================

export const DATA_TIERS: readonly DataTierConfig[] = [
  {
    tier: 'A',
    name_en: 'Full Statistics',
    name_sv: 'Full statistik',
    description: 'Comprehensive official statistics with high granularity',
    indicator_coverage: '80-100%',
    typical_regions: ['OECD', 'EU', 'USA', 'Japan', 'South Korea', 'Australia'],
  },
  {
    tier: 'B',
    name_en: 'Partial Statistics',
    name_sv: 'Delvis statistik',
    description: 'National sources with gaps in some indicators',
    indicator_coverage: '50-80%',
    typical_regions: ['Brazil', 'Mexico', 'South Africa', 'India (urban)', 'China (major cities)'],
  },
  {
    tier: 'C',
    name_en: 'Proxy Data',
    name_sv: 'Proxy-data',
    description: 'Regional or national breakdown estimates',
    indicator_coverage: '20-50%',
    typical_regions: ['Most developing countries', 'Rural areas in emerging markets'],
  },
  {
    tier: 'D',
    name_en: 'Minimal',
    name_sv: 'Minimal',
    description: 'Structure and population only',
    indicator_coverage: '<20%',
    typical_regions: ['Conflict zones', 'Remote areas', 'Small island nations'],
  },
] as const;

export const DATA_TIER_WARNINGS = {
  A: null,
  B: {
    sv: 'Denna kommun har delvis begränsad dataprecision.',
    en: 'This municipality has partially limited data precision.',
  },
  C: {
    sv: 'Denna kommun har begränsad dataprecision. Värden baseras delvis på regionala uppskattningar.',
    en: 'This municipality has limited data precision. Values are partly based on regional estimates.',
  },
  D: {
    sv: 'Denna kommun har minimal datatäckning. Endast grundläggande information tillgänglig.',
    en: 'This municipality has minimal data coverage. Only basic information available.',
  },
} as const;

// ============================================================
// 4. ALLOWED DATA ON MUNICIPAL LEVEL (STRICT)
// ============================================================

export const MUNICIPAL_DATA_RULES = {
  allowed: [
    {
      category: 'population',
      description: 'Befolkning, demografi (aggregerad)',
      min_aggregation: 'municipal',
    },
    {
      category: 'economy',
      description: 'Inkomst, sysselsättning där tillgängligt',
      min_aggregation: 'municipal',
    },
    {
      category: 'health',
      description: 'Aggregerade hälsoutfall',
      min_aggregation: 'municipal',
    },
    {
      category: 'education',
      description: 'Utbildningsnivå, skolresultat (aggregerat)',
      min_aggregation: 'municipal',
    },
    {
      category: 'crime',
      description: 'Brottslighet (aggregerad, ej individ)',
      min_aggregation: 'municipal',
    },
    {
      category: 'infrastructure',
      description: 'Infrastrukturindikatorer',
      min_aggregation: 'municipal',
    },
    {
      category: 'municipal_finance',
      description: 'Kommunala finanser (där öppet)',
      min_aggregation: 'municipal',
    },
    {
      category: 'migration',
      description: 'Migration (aggregerad, anonym)',
      min_aggregation: 'municipal',
    },
  ] as const,
  
  forbidden: [
    {
      type: 'individual_data',
      description: 'Individdata',
      reason: 'Privacy protection',
    },
    {
      type: 'small_group_identifiable',
      description: 'Identifierbara smågrupper',
      reason: 'Statistical disclosure risk',
    },
    {
      type: 'unqualified_ranking',
      description: 'Ranking av kommuner utan osäkerhetsflagga',
      reason: 'Misleading without context',
    },
  ] as const,
  
  principle: 'Kommunnivå ≠ personnivå. Aldrig.',
} as const;

// ============================================================
// 5. MUNICIPAL VIEW STRUCTURE (STANDARDIZED GLOBALLY)
// ============================================================

export const MUNICIPAL_VIEW_TEMPLATE = {
  sections: [
    {
      id: 'overview',
      name_sv: 'Översikt',
      name_en: 'Overview',
      content: [
        'location_context', // Var är vi?
        'size_metrics',     // Hur stor är kommunen?
        'data_tier_badge',  // Datatäckning (Tier A–D)
      ],
    },
    {
      id: 'key_indicators',
      name_sv: 'Nyckelindikatorer',
      name_en: 'Key Indicators',
      content: [
        'primary_indicators',
        'comparison_region',
        'comparison_country',
        'comparison_cluster', // liknande kommuner
      ],
    },
    {
      id: 'timelines',
      name_sv: 'Tidslinjer',
      name_en: 'Timelines',
      content: [
        'historical_data',  // Minst 10 år där möjligt
        'breakpoints',      // Brytpunkter markerade
      ],
    },
    {
      id: 'responsibility',
      name_sv: 'Ansvar & struktur',
      name_en: 'Responsibility & Structure',
      content: [
        'responsibility_levels', // Vilken nivå ansvarar för vad
        'municipal_powers',
        'regional_powers',
        'national_powers',
      ],
    },
    {
      id: 'explanation',
      name_sv: 'Förklaringslager',
      name_en: 'Explanation Layer',
      content: [
        'what_this_means',
        'what_this_does_not_mean',
        'uncertainty_disclosure',
      ],
    },
    {
      id: 'verification',
      name_sv: 'Verifiering',
      name_en: 'Verification',
      content: [
        'statement_id',
        'qr_code',
        'sources',
      ],
    },
  ] as const,
  
  required_for_all_languages: true,
  required_for_all_tiers: true,
} as const;

// ============================================================
// 6. COMPARISONS (VERY IMPORTANT)
// ============================================================

export const COMPARISON_RULES = {
  /**
   * Systemet tillåter endast jämförelser som är semantiskt giltiga.
   */
  allowed: [
    {
      type: 'peer_comparison',
      description: 'Kommun ↔ liknande kommuner (storlek, ekonomi)',
      requires_normalization: true,
    },
    {
      type: 'historical_comparison',
      description: 'Kommun ↔ egen historik',
      requires_normalization: false,
    },
    {
      type: 'regional_average',
      description: 'Kommun ↔ regionalt snitt',
      requires_normalization: true,
    },
    {
      type: 'national_average',
      description: 'Kommun ↔ nationellt snitt',
      requires_normalization: true,
    },
  ] as const,
  
  blocked: [
    {
      type: 'size_mismatch',
      description: 'Liten kommun ↔ megastad (utan normalisering)',
      reason: 'Incomparable scale',
    },
    {
      type: 'tier_mismatch',
      description: 'Olika datatier utan varning',
      reason: 'Data quality incompatibility',
    },
    {
      type: 'context_mismatch',
      description: 'Helt olika förvaltningssystem',
      reason: 'Structural incomparability',
    },
  ] as const,
  
  principle: 'Jämförelse utan rimlighet = blockerad',
  
  warnings: {
    tier_difference: {
      sv: 'Jämförelsen inkluderar kommuner med olika datakvalitet.',
      en: 'Comparison includes municipalities with different data quality.',
    },
    size_difference: {
      sv: 'Stor storleksskillnad. Värden är normaliserade.',
      en: 'Significant size difference. Values are normalized.',
    },
  },
} as const;

// ============================================================
// 7. POLITICAL RESPONSIBILITY AT MUNICIPAL LEVEL
// ============================================================

export const MUNICIPAL_RESPONSIBILITY_CONFIG = {
  /**
   * Systemet kopplar kommunala indikatorer till ansvarsnivå, inte person/skuld.
   */
  principle: 'Ansvarsnivå, inte personlig skuld',
  
  display_rules: {
    show_responsibility_level: true,
    show_role_history: true,
    show_person_names: false, // Endast som rollhistorik
    show_blame_attribution: false, // Aldrig
  },
  
  example_text: {
    sv: 'Detta utfall ligger inom kommunalt ansvar enligt landets förvaltningsstruktur.',
    en: 'This outcome falls within municipal responsibility according to the country\'s administrative structure.',
  },
  
  responsibility_levels: [
    { level: 'municipal', examples: ['local services', 'zoning', 'primary education'] },
    { level: 'regional', examples: ['healthcare', 'public transport', 'secondary education'] },
    { level: 'national', examples: ['defense', 'monetary policy', 'foreign affairs'] },
  ] as const,
} as const;

// ============================================================
// 8. MAP & VISUALIZATION
// ============================================================

export const MUNICIPAL_VISUALIZATION_CONFIG = {
  map: {
    smallest_clickable_unit: 'municipality',
    color_scale_adjusted_by_tier: true,
    zoom_behavior: 'more_data_not_more_interpretation',
  },
  
  color_scales: {
    tier_A: { opacity: 1.0, saturation: 1.0 },
    tier_B: { opacity: 0.9, saturation: 0.9 },
    tier_C: { opacity: 0.7, saturation: 0.8 },
    tier_D: { opacity: 0.5, saturation: 0.6 },
  },
  
  zoom_principle: 'Ju närmare → desto tydligare osäkerhet',
  
  uncertainty_display: {
    on_hover: true,
    in_popup: true,
    in_tooltip: true,
  },
} as const;

// ============================================================
// 9. API & MUNICIPAL LEVEL
// ============================================================

export const MUNICIPAL_API_CONFIG = {
  endpoint_pattern: '/data?level=municipality&gmid={GMID}',
  
  required_response_fields: [
    'gmid',
    'data_tier',
    'uncertainty',
    'comparability_warning',
    'sources',
    'statement_id',
  ] as const,
  
  optional_params: [
    'indicators',
    'period_start',
    'period_end',
    'comparison_gmids',
    'language',
  ] as const,
  
  examples: {
    single: '/data?level=municipality&gmid=SWE-STO-0180',
    comparison: '/data?level=municipality&gmid=SWE-STO-0180&comparison_gmids=SWE-STO-0184,SWE-STO-0186',
    filtered: '/data?level=municipality&gmid=SWE-STO-0180&indicators=population,economy',
  },
} as const;

// ============================================================
// 10. REPORTS AT MUNICIPAL LEVEL
// ============================================================

export const MUNICIPAL_REPORT_CONFIG = {
  demo: {
    length: 'limited',
    max_indicators: 5,
    max_pages: 3,
    includes_verification: false,
    marked_as_demo: true,
  },
  
  paid: {
    length: 'full',
    max_indicators: null, // unlimited
    includes: [
      'full_municipal_report',
      'effect_analysis',
      'responsibility_structure',
      'peer_comparison',
      'verified_pdf',
      'historical_analysis',
    ],
  },
  
  target_audiences: [
    'municipalities',
    'journalists',
    'ngo',
    'government_agencies',
    'researchers',
    'citizens',
  ] as const,
  
  value_proposition: 'Lokal data i global kontext, verifierad och jämförbar',
} as const;

// ============================================================
// 11. DEFINITION OF DONE (GLOBAL MUNICIPAL)
// ============================================================

export const MUNICIPAL_DEFINITION_OF_DONE = {
  criteria: [
    {
      id: 'every_municipality_has_gmid',
      description: 'Varje kommun i världen har en GMID-post',
      verification: 'database_check',
    },
    {
      id: 'every_municipality_viewable',
      description: 'Varje kommun kan visas (även med låg data)',
      verification: 'ui_test',
    },
    {
      id: 'uncertainty_always_shown',
      description: 'Systemet alltid ärligt visar osäkerhet',
      verification: 'automated_check',
    },
    {
      id: 'no_political_abuse',
      description: 'Inga kommunala vyer kan missbrukas politiskt',
      verification: 'review_process',
    },
    {
      id: 'all_languages_work',
      description: 'Samma vy fungerar på alla språk',
      verification: 'i18n_test',
    },
  ] as const,
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getDataTierConfig(tier: DataTier): DataTierConfig | undefined {
  return DATA_TIERS.find(t => t.tier === tier);
}

export function getDataTierWarning(
  tier: DataTier,
  language: 'sv' | 'en'
): string | null {
  const warning = DATA_TIER_WARNINGS[tier];
  if (!warning) return null;
  return warning[language];
}

export function isComparisonAllowed(
  gmid1: string,
  gmid2: string,
  tier1: DataTier,
  tier2: DataTier,
  population1: number,
  population2: number
): { allowed: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check tier mismatch
  if (tier1 !== tier2) {
    if (Math.abs(DATA_TIERS.findIndex(t => t.tier === tier1) - 
                 DATA_TIERS.findIndex(t => t.tier === tier2)) > 1) {
      return { allowed: false, warnings: ['Data tier difference too large'] };
    }
    warnings.push(COMPARISON_RULES.warnings.tier_difference.en);
  }
  
  // Check size mismatch (10x difference)
  const sizeRatio = Math.max(population1, population2) / Math.min(population1, population2);
  if (sizeRatio > 10) {
    warnings.push(COMPARISON_RULES.warnings.size_difference.en);
  }
  
  return { allowed: true, warnings };
}

export function getLocalTerm(iso3: string): string {
  const mapping = ADMIN_HIERARCHY.local_term_mappings[iso3 as keyof typeof ADMIN_HIERARCHY.local_term_mappings];
  return mapping?.term || 'municipality';
}

export function validateMunicipalData(
  category: MunicipalDataCategory,
  aggregationLevel: AdminLevel
): { valid: boolean; reason?: string } {
  const rule = MUNICIPAL_DATA_RULES.allowed.find(r => r.category === category);
  if (!rule) {
    return { valid: false, reason: 'Category not in allowed list' };
  }
  
  // Municipality level is always valid for allowed categories
  if (aggregationLevel === 'municipality') {
    return { valid: true };
  }
  
  return { valid: true };
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const MUNICIPAL_CONFIG_COMPLETE = {
  adminHierarchy: ADMIN_HIERARCHY,
  gmidConfig: GMID_CONFIG,
  dataTiers: DATA_TIERS,
  dataTierWarnings: DATA_TIER_WARNINGS,
  dataRules: MUNICIPAL_DATA_RULES,
  viewTemplate: MUNICIPAL_VIEW_TEMPLATE,
  comparisonRules: COMPARISON_RULES,
  responsibilityConfig: MUNICIPAL_RESPONSIBILITY_CONFIG,
  visualizationConfig: MUNICIPAL_VISUALIZATION_CONFIG,
  apiConfig: MUNICIPAL_API_CONFIG,
  reportConfig: MUNICIPAL_REPORT_CONFIG,
  definitionOfDone: MUNICIPAL_DEFINITION_OF_DONE,
} as const;
