/**
 * 🕰️ MASTER EXECUTION BLOCK 39
 * 
 * EXTREME HISTORICAL DEPTH LAYER (DATA → CONTEXT → CONTINUITY)
 * 
 * ÖVERORDNAT MÅL:
 * Att göra historien läsbar som process, inte som berättelse.
 * Att visa hur långsamma strukturer formar nutiden.
 */

// ============================================================
// TIME DEPTH STANDARDS (LOCKED PRINCIPLES)
// ============================================================

export const TIME_DEPTH_PRINCIPLES = {
  /**
   * Grundregel: Maximalt historiskt djup som källorna tillåter.
   * Ingen "cutoff" för bekvämlighet.
   * Hellre gles data långt bak än tät data kort bak.
   */
  priority_order: [
    '50_years_over_10_years',
    '200_years_where_possible',
    '500_2000_years_for_deep_structures',
  ],
  deep_structure_domains: [
    'demography',
    'warfare',
    'state_capacity',
    'energy_regimes',
    'urbanization',
  ],
} as const;

// ============================================================
// HISTORICAL LAYERS (FIXED STRUCTURE)
// ============================================================

export type HistoricalLayerType = 'quantitative' | 'structural' | 'event_markers';

export interface QuantitativeData {
  year: number;
  value: number | null;
  confidence: number; // 0-1
  is_estimated: boolean;
  source_id: string;
}

export interface StructuralContext {
  id: string;
  period_start: number;
  period_end: number | null;
  type: 'institutional' | 'technological' | 'economic' | 'energy_regime';
  name: { sv: string; en: string };
  description: { sv: string; en: string };
}

export interface EventMarker {
  id: string;
  year: number;
  year_end?: number;
  type: 'war' | 'reform' | 'collapse' | 'external_shock' | 'transition';
  name: { sv: string; en: string };
  /** Events explain breaks in curves, never as "story" */
  curve_break_explanation: { sv: string; en: string };
}

export interface HistoricalDataset {
  indicator_id: string;
  time_range: { start: number; end: number };
  resolution: 'annual' | 'decadal' | 'century' | 'epoch';
  data_density: 'dense' | 'moderate' | 'sparse' | 'reconstructed';
  quantitative: QuantitativeData[];
  structural_contexts: StructuralContext[];
  event_markers: EventMarker[];
}

// ============================================================
// HISTORICAL RESOLUTION (HONESTY FIRST)
// ============================================================

export interface ResolutionMetadata {
  period: { start: number; end: number };
  resolution: 'annual' | 'decadal' | 'century' | 'epoch';
  data_density: 'dense' | 'moderate' | 'sparse' | 'reconstructed';
  uncertainty_level: 'low' | 'medium' | 'high' | 'very_high';
  disclaimer: { sv: string; en: string };
}

export const RESOLUTION_DISCLAIMERS: Record<string, { sv: string; en: string }> = {
  pre_1850: {
    sv: 'Data före 1850 är gles och rekonstruerad från historiska uppskattningar.',
    en: 'Data before 1850 is sparse and reconstructed from historical estimates.',
  },
  pre_1900: {
    sv: 'Data före 1900 har begränsad täckning och bygger delvis på estimat.',
    en: 'Data before 1900 has limited coverage and is partly based on estimates.',
  },
  pre_1950: {
    sv: 'Data före 1950 kan ha lägre precision på grund av insamlingsmetoder.',
    en: 'Data before 1950 may have lower precision due to collection methods.',
  },
  modern: {
    sv: 'Modern data (efter 1960) har generellt hög tillförlitlighet.',
    en: 'Modern data (post-1960) generally has high reliability.',
  },
};

// ============================================================
// GLOBAL HISTORICAL TIMELINE LAYERS
// ============================================================

export interface TimelineLayer {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  color: string;
  default_visible: boolean;
  time_range: { start: number; end: number };
}

export const GLOBAL_TIMELINE_LAYERS: TimelineLayer[] = [
  {
    id: 'industrialization',
    name: { sv: 'Industrialisering', en: 'Industrialization' },
    description: { sv: 'Övergång till industriell produktion', en: 'Transition to industrial production' },
    color: 'hsl(var(--chart-1))',
    default_visible: true,
    time_range: { start: 1760, end: 2025 },
  },
  {
    id: 'energy_transitions',
    name: { sv: 'Energiövergångar', en: 'Energy transitions' },
    description: { sv: 'Skifte mellan dominerande energikällor', en: 'Shifts between dominant energy sources' },
    color: 'hsl(var(--chart-2))',
    default_visible: true,
    time_range: { start: 1800, end: 2025 },
  },
  {
    id: 'state_formation',
    name: { sv: 'Staters uppkomst/fall', en: 'State formation/collapse' },
    description: { sv: 'Bildande och upplösning av statsbildningar', en: 'Formation and dissolution of states' },
    color: 'hsl(var(--chart-3))',
    default_visible: false,
    time_range: { start: -3000, end: 2025 },
  },
  {
    id: 'major_wars',
    name: { sv: 'Stora krig', en: 'Major wars' },
    description: { sv: 'Konflikter med omfattande påverkan', en: 'Conflicts with extensive impact' },
    color: 'hsl(var(--chart-4))',
    default_visible: false,
    time_range: { start: -500, end: 2025 },
  },
  {
    id: 'demographic_transitions',
    name: { sv: 'Demografiska övergångar', en: 'Demographic transitions' },
    description: { sv: 'Strukturella skiften i befolkning', en: 'Structural shifts in population' },
    color: 'hsl(var(--chart-5))',
    default_visible: true,
    time_range: { start: 1700, end: 2025 },
  },
  {
    id: 'technological_revolutions',
    name: { sv: 'Tekniska revolutioner', en: 'Technological revolutions' },
    description: { sv: 'Genomgripande teknologiska skiften', en: 'Transformative technological shifts' },
    color: 'hsl(var(--primary))',
    default_visible: true,
    time_range: { start: 1450, end: 2025 },
  },
];

// ============================================================
// HISTORICAL COMPARISON RULES (WHAT IS ALLOWED)
// ============================================================

export const COMPARISON_RULES = {
  allowed: [
    {
      type: 'same_country_different_epochs',
      description: { sv: 'Samma land över olika epoker', en: 'Same country across different epochs' },
    },
    {
      type: 'different_countries_same_phase',
      description: { sv: 'Olika länder i samma utvecklingsfas', en: 'Different countries in same development phase' },
    },
    {
      type: 'same_indicator_system_shifts',
      description: { sv: 'Samma indikator före/efter systemskiften', en: 'Same indicator before/after system shifts' },
    },
  ],
  blocked: [
    {
      type: 'ancient_modern_without_normalization',
      description: { sv: 'Antika samhällen ↔ moderna stater (utan normalisering)', en: 'Ancient societies ↔ modern states (without normalization)' },
      reason: { sv: 'Kräver kontextuell normalisering', en: 'Requires contextual normalization' },
    },
    {
      type: 'wartime_peacetime_without_flag',
      description: { sv: 'Krigstid ↔ fredstid utan flagga', en: 'Wartime ↔ peacetime without flag' },
      reason: { sv: 'Måste markeras med strukturell kontext', en: 'Must be marked with structural context' },
    },
  ],
  mandatory_rule: {
    sv: 'All jämförelse kräver epokmatchning.',
    en: 'All comparison requires epoch matching.',
  },
};

// ============================================================
// HISTORICAL SOURCES (ACADEMIC DISCIPLINE)
// ============================================================

export interface HistoricalSource {
  id: string;
  name: string;
  type: 'national_archive' | 'historical_database' | 'academic_meta' | 'international_org';
  url?: string;
  time_coverage: { start: number; end: number };
  domains: string[];
  reliability: 'high' | 'medium' | 'reconstructed';
}

export const HISTORICAL_SOURCES: HistoricalSource[] = [
  {
    id: 'maddison',
    name: 'Maddison Project Database',
    type: 'historical_database',
    url: 'https://www.rug.nl/ggdc/historicaldevelopment/maddison/',
    time_coverage: { start: 1, end: 2020 },
    domains: ['gdp', 'population', 'economic_growth'],
    reliability: 'high',
  },
  {
    id: 'cow',
    name: 'Correlates of War',
    type: 'historical_database',
    url: 'https://correlatesofwar.org/',
    time_coverage: { start: 1816, end: 2020 },
    domains: ['warfare', 'alliances', 'state_capacity'],
    reliability: 'high',
  },
  {
    id: 'owid',
    name: 'Our World in Data',
    type: 'historical_database',
    url: 'https://ourworldindata.org/',
    time_coverage: { start: 1800, end: 2024 },
    domains: ['health', 'education', 'environment', 'poverty'],
    reliability: 'high',
  },
  {
    id: 'gapminder',
    name: 'Gapminder',
    type: 'historical_database',
    url: 'https://www.gapminder.org/',
    time_coverage: { start: 1800, end: 2024 },
    domains: ['health', 'education', 'income'],
    reliability: 'high',
  },
  {
    id: 'world_bank_historical',
    name: 'World Bank Historical Data',
    type: 'international_org',
    url: 'https://data.worldbank.org/',
    time_coverage: { start: 1960, end: 2024 },
    domains: ['economy', 'development', 'finance'],
    reliability: 'high',
  },
  {
    id: 'un_historical',
    name: 'UN Historical Statistics',
    type: 'international_org',
    time_coverage: { start: 1950, end: 2024 },
    domains: ['demography', 'trade', 'development'],
    reliability: 'high',
  },
  {
    id: 'vdem',
    name: 'Varieties of Democracy (V-Dem)',
    type: 'academic_meta',
    url: 'https://www.v-dem.net/',
    time_coverage: { start: 1789, end: 2023 },
    domains: ['democracy', 'governance', 'institutions'],
    reliability: 'high',
  },
  {
    id: 'clio_infra',
    name: 'Clio Infra',
    type: 'historical_database',
    url: 'https://clio-infra.eu/',
    time_coverage: { start: 1500, end: 2010 },
    domains: ['economy', 'demography', 'institutions'],
    reliability: 'medium',
  },
];

// ============================================================
// UI TEXT & LABELS
// ============================================================

export const HISTORICAL_UI_TEXT = {
  section_title: {
    sv: 'Historiskt djup',
    en: 'Historical depth',
  },
  evolution_tab: {
    sv: 'Hur detta utvecklats över tid',
    en: 'How this evolved over time',
  },
  timeline_title: {
    sv: 'Global tidslinje',
    en: 'Global timeline',
  },
  toggle_layers: {
    sv: 'Visa/dölj lager',
    en: 'Show/hide layers',
  },
  data_density: {
    sv: 'Datatäthet',
    en: 'Data density',
  },
  uncertainty: {
    sv: 'Osäkerhet',
    en: 'Uncertainty',
  },
  breakpoints: {
    sv: 'Brytpunkter',
    en: 'Breakpoints',
  },
  slow_vs_fast: {
    sv: 'Långsam vs snabb förändring',
    en: 'Slow vs fast change',
  },
  source_info: {
    sv: 'Källinformation',
    en: 'Source information',
  },
  not_new_label: {
    sv: 'Detta är inte nytt',
    en: 'This is not new',
  },
  perspective_label: {
    sv: 'Nutiden i perspektiv',
    en: 'The present in perspective',
  },
  report_footer: {
    sv: 'Historisk data speglar uppskattningar och rekonstruktioner. Tolka trender, inte enskilda punkter.',
    en: 'Historical data reflects estimates and reconstructions. Interpret trends, not point values.',
  },
};

// ============================================================
// VISUALIZATION RULES
// ============================================================

export const VISUALIZATION_RULES = {
  zoom_range: {
    min_years: 10,
    max_years: 2000,
  },
  smoothing: {
    /** Curves auto-smooth when data is sparse */
    sparse_data_smoothing: true,
    smoothing_window_years: 10,
  },
  period_markers: {
    /** Periods marked with bands, not arrows */
    use_bands: true,
    use_arrows: false,
  },
  aesthetic: {
    /** History should feel calm and comprehensible, not dramatic */
    color_palette: 'muted',
    animation_style: 'gentle',
    avoid_dramatic_effects: true,
  },
};

// ============================================================
// INTEGRATION POINTS
// ============================================================

export const INTEGRATION_POINTS = {
  big_questions: {
    tab_id: 'historical_evolution',
    tab_label: HISTORICAL_UI_TEXT.evolution_tab,
    content: {
      show_long_timeline: true, // 100-500 years where possible
      show_breakpoints: true,
      show_slow_vs_fast: true,
    },
  },
  risk_conflict: {
    connection_type: 'pattern_recognition',
    show_previous_instability: true,
    show_recurring_patterns: true,
    show_slow_stressors: true,
    /**
     * IMPORTANT:
     * ❌ No "history repeats itself" logic
     * ✅ "History shows recurring structures"
     */
    forbidden_language: ['history repeats', 'will happen again', 'inevitable'],
    allowed_language: ['recurring structures', 'similar patterns observed', 'historically associated with'],
  },
};

// ============================================================
// DEFINITION OF DONE (VALIDATION CHECKLIST)
// ============================================================

export const DEFINITION_OF_DONE = {
  criteria: [
    'Every main indicator goes as far back as possible',
    'All breakpoints are marked',
    'Uncertainty is always visible',
    'History is never used as rhetoric',
    'The present is always put in proportion',
  ],
  validation_questions: [
    { sv: 'När började detta?', en: 'When did this begin?' },
    { sv: 'Hur ofta har detta hänt förr?', en: 'How often has this happened before?' },
    { sv: 'Vad var annorlunda då?', en: 'What was different then?' },
    { sv: 'Vad har visat sig vara stabilt över tid?', en: 'What has proven stable over time?' },
  ],
};
