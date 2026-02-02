/**
 * 🧩 FEATURE-VALUE-PAYMENT MODEL
 * INLOGGAD ANVÄNDARE → BESLUTSSTÖD
 * 
 * GRUNDPRINCIP:
 * - Man får leka, förstå och prova
 * - Man betalar för minne, ansvar, samarbete och påverkan
 * - Demo visar hela djupet, men med kvantitativa spärrar
 * - Inget låses hårt → allt tonas ner i demo
 * 
 * "Ni bygger inte ett verktyg.
 * Ni bygger ett tänkandets operativsystem."
 */

// ============================================================
// TYPES
// ============================================================

export type FeatureCategory = 
  | 'core'
  | 'save_organize'
  | 'share_collaborate'
  | 'indicators_markers'
  | 'political_analysis'
  | 'reports'
  | 'api_automation';

export type AccessLevel = 'anonymous' | 'free' | 'pro' | 'org' | 'enterprise';

export interface DemoLimit {
  readonly max_count: number | null;
  readonly time_limited: boolean;
  readonly read_only_after_session: boolean;
  readonly marked_as_demo: boolean;
}

export interface Feature {
  readonly id: string;
  readonly category: FeatureCategory;
  readonly name_sv: string;
  readonly name_en: string;
  readonly description_sv: string;
  readonly always_available: boolean;
  readonly demo_limit: DemoLimit | null;
  readonly requires_tier: AccessLevel;
  readonly payment_rationale: string;
}

// ============================================================
// CORE FEATURES (ALWAYS AVAILABLE FOR LOGGED-IN USERS)
// ============================================================

export const CORE_FEATURES: readonly Feature[] = [
  {
    id: 'realtime_analysis',
    category: 'core',
    name_sv: 'Realtidsanalys',
    name_en: 'Real-time analysis',
    description_sv: 'Köra analyser i realtid',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Förståelse är gratis',
  },
  {
    id: 'chat_interpretation',
    category: 'core',
    name_sv: 'Chatt för tolkning',
    name_en: 'Chat for interpretation',
    description_sv: 'Använda chatt för att förstå data',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Förståelse är gratis',
  },
  {
    id: 'temporary_views',
    category: 'core',
    name_sv: 'Tillfälliga sammanställningar',
    name_en: 'Temporary views',
    description_sv: 'Bygga sammanställningar som inte sparas',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Förståelse är gratis',
  },
  {
    id: 'responsibility_structure',
    category: 'core',
    name_sv: 'Ansvarsstrukturer',
    name_en: 'Responsibility structures',
    description_sv: 'Se politiska ansvarsstrukturer',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Insyn är gratis',
  },
  {
    id: 'indicator_comparison',
    category: 'core',
    name_sv: 'Jämföra indikatorer',
    name_en: 'Compare indicators',
    description_sv: 'Jämföra indikatorer mot varandra',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Förståelse är gratis',
  },
  {
    id: 'history_context',
    category: 'core',
    name_sv: 'Historik & kontext',
    name_en: 'History & context',
    description_sv: 'Se historik och kontext för data',
    always_available: true,
    demo_limit: null,
    requires_tier: 'free',
    payment_rationale: 'Förståelse är gratis',
  },
] as const;

// ============================================================
// SAVE & ORGANIZE (PAYMENT LOGIC: MEMORY = PAYMENT)
// ============================================================

export const SAVE_ORGANIZE_FEATURES: readonly Feature[] = [
  {
    id: 'save_reports',
    category: 'save_organize',
    name_sv: 'Spara rapporter',
    name_en: 'Save reports',
    description_sv: 'Spara genererade rapporter permanent',
    always_available: false,
    demo_limit: { max_count: 1, time_limited: true, read_only_after_session: true, marked_as_demo: true },
    requires_tier: 'pro',
    payment_rationale: 'Spara = ansvar = betalning',
  },
  {
    id: 'save_indications',
    category: 'save_organize',
    name_sv: 'Spara indikationer',
    name_en: 'Save indications',
    description_sv: 'Markera "detta är intressant" permanent',
    always_available: false,
    demo_limit: { max_count: 2, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Spara = ansvar = betalning',
  },
  {
    id: 'create_folders',
    category: 'save_organize',
    name_sv: 'Skapa mappar / projekt',
    name_en: 'Create folders / projects',
    description_sv: 'Organisera material i mappar',
    always_available: false,
    demo_limit: { max_count: 1, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Struktur = betalning',
  },
  {
    id: 'version_history',
    category: 'save_organize',
    name_sv: 'Versionshistorik',
    name_en: 'Version history',
    description_sv: 'Se tidigare versioner av sparade objekt',
    always_available: false,
    demo_limit: null,
    requires_tier: 'pro',
    payment_rationale: 'Kontinuitet = betalning',
  },
  {
    id: 'tags_markers',
    category: 'save_organize',
    name_sv: 'Taggar & markörer',
    name_en: 'Tags & markers',
    description_sv: 'Tagga och markera innehåll',
    always_available: false,
    demo_limit: { max_count: 3, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Organisation = betalning',
  },
] as const;

// ============================================================
// SHARE & COLLABORATE (PAYMENT LOGIC: SHARING = POWER = PAYMENT)
// ============================================================

export const SHARE_COLLABORATE_FEATURES: readonly Feature[] = [
  {
    id: 'share_reports_internal',
    category: 'share_collaborate',
    name_sv: 'Dela rapporter internt',
    name_en: 'Share reports internally',
    description_sv: 'Dela rapporter via länk',
    always_available: false,
    demo_limit: { max_count: 1, time_limited: true, read_only_after_session: false, marked_as_demo: true },
    requires_tier: 'pro',
    payment_rationale: 'Delning = makt = betalning',
  },
  {
    id: 'share_insights',
    category: 'share_collaborate',
    name_sv: 'Dela insikter',
    name_en: 'Share insights',
    description_sv: 'Dela markerade stycken',
    always_available: false,
    demo_limit: { max_count: 1, time_limited: true, read_only_after_session: false, marked_as_demo: true },
    requires_tier: 'pro',
    payment_rationale: 'Delning = makt = betalning',
  },
  {
    id: 'comments',
    category: 'share_collaborate',
    name_sv: 'Kommentarer',
    name_en: 'Comments',
    description_sv: 'Kommentera sakligt, versionsbundet',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Samarbete = betalning',
  },
  {
    id: 'view_activity',
    category: 'share_collaborate',
    name_sv: 'Aktivitetslogg',
    name_en: 'Activity log',
    description_sv: 'Se vem som tittat / ändrat',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Spårbarhet = betalning',
  },
  {
    id: 'persistent_links',
    category: 'share_collaborate',
    name_sv: 'Beständiga länkar',
    name_en: 'Persistent links',
    description_sv: 'Länkar som inte upphör',
    always_available: false,
    demo_limit: null,
    requires_tier: 'pro',
    payment_rationale: 'Kontinuitet = betalning',
  },
  {
    id: 'team_sharing',
    category: 'share_collaborate',
    name_sv: 'Team-delning',
    name_en: 'Team sharing',
    description_sv: 'Dela till team / organisation',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Samarbete = betalning',
  },
  {
    id: 'role_management',
    category: 'share_collaborate',
    name_sv: 'Rollstyrning',
    name_en: 'Role management',
    description_sv: 'Hantera roller och behörigheter',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Ansvar = betalning',
  },
] as const;

// ============================================================
// INDICATORS & MARKERS (HIGH VALUE: THINKING MEMORY)
// ============================================================

export const INDICATORS_MARKERS_FEATURES: readonly Feature[] = [
  {
    id: 'create_indications',
    category: 'indicators_markers',
    name_sv: 'Skapa indikationer',
    name_en: 'Create indications',
    description_sv: '"Detta mönster är relevant för X"',
    always_available: false,
    demo_limit: { max_count: 3, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Tänkandets minne = extremt betalvärt',
  },
  {
    id: 'time_markers',
    category: 'indicators_markers',
    name_sv: 'Markörer i tid',
    name_en: 'Time markers',
    description_sv: '"Här skedde något"',
    always_available: false,
    demo_limit: { max_count: 3, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Tänkandets minne = extremt betalvärt',
  },
  {
    id: 'hypothesis_notes',
    category: 'indicators_markers',
    name_sv: 'Hypotes-anteckningar',
    name_en: 'Hypothesis notes',
    description_sv: 'Privata anteckningar om hypoteser',
    always_available: false,
    demo_limit: { max_count: 2, time_limited: true, read_only_after_session: true, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Tänkandets minne = extremt betalvärt',
  },
  {
    id: 'searchable_markers',
    category: 'indicators_markers',
    name_sv: 'Sökbara markörer',
    name_en: 'Searchable markers',
    description_sv: 'Sök bland alla markörer',
    always_available: false,
    demo_limit: null,
    requires_tier: 'pro',
    payment_rationale: 'Organisation = betalning',
  },
  {
    id: 'link_to_reports',
    category: 'indicators_markers',
    name_sv: 'Koppla till rapporter',
    name_en: 'Link to reports',
    description_sv: 'Koppla markörer till rapporter & dashboards',
    always_available: false,
    demo_limit: null,
    requires_tier: 'pro',
    payment_rationale: 'Integration = betalning',
  },
] as const;

// ============================================================
// POLITICAL / STRUCTURAL ANALYSIS (ADVANCED)
// ============================================================

export const POLITICAL_ANALYSIS_FEATURES: readonly Feature[] = [
  {
    id: 'responsibility_levels',
    category: 'political_analysis',
    name_sv: 'Ansvar per nivå',
    name_en: 'Responsibility by level',
    description_sv: 'Se ansvar: kommun → stat → EU',
    always_available: true,
    demo_limit: { max_count: 3, time_limited: false, read_only_after_session: false, marked_as_demo: false },
    requires_tier: 'free',
    payment_rationale: 'Insyn är gratis, djup kostar',
  },
  {
    id: 'mandate_periods',
    category: 'political_analysis',
    name_sv: 'Mandatperioder',
    name_en: 'Mandate periods',
    description_sv: 'Koppla indikatorer till mandatperioder',
    always_available: false,
    demo_limit: { max_count: 2, time_limited: false, read_only_after_session: false, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Känsligt men sakligt = högt värde',
  },
  {
    id: 'historical_outcomes',
    category: 'political_analysis',
    name_sv: 'Historiska utfall',
    name_en: 'Historical outcomes',
    description_sv: 'Se historiska utfall per ansvarig roll',
    always_available: false,
    demo_limit: { max_count: 2, time_limited: false, read_only_after_session: false, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Känsligt men sakligt = högt värde',
  },
  {
    id: 'before_during_after',
    category: 'political_analysis',
    name_sv: 'Före / under / efter',
    name_en: 'Before / during / after',
    description_sv: 'Jämföra perioder före, under och efter',
    always_available: false,
    demo_limit: { max_count: 2, time_limited: false, read_only_after_session: false, marked_as_demo: false },
    requires_tier: 'pro',
    payment_rationale: 'Känsligt men sakligt = högt värde',
  },
  {
    id: 'full_history_comparison',
    category: 'political_analysis',
    name_sv: 'Full historik & korsjämförelser',
    name_en: 'Full history & cross-comparisons',
    description_sv: 'Obegränsad historik och jämförelser',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Djup analys = betalning',
  },
  {
    id: 'responsibility_linked_reports',
    category: 'political_analysis',
    name_sv: 'Rapporter kopplade till ansvar',
    name_en: 'Responsibility-linked reports',
    description_sv: 'Rapporter med ansvarskoppling',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Institutionell analys = betalning',
  },
] as const;

// ============================================================
// API & AUTOMATION (LATER STEP)
// ============================================================

export const API_AUTOMATION_FEATURES: readonly Feature[] = [
  {
    id: 'api_preview',
    category: 'api_automation',
    name_sv: 'API-förhandsvisning',
    name_en: 'API preview',
    description_sv: 'Visa hur API skulle se ut',
    always_available: false,
    demo_limit: { max_count: 1, time_limited: true, read_only_after_session: true, marked_as_demo: true },
    requires_tier: 'free',
    payment_rationale: 'Prova gratis, använd betalt',
  },
  {
    id: 'expose_as_api',
    category: 'api_automation',
    name_sv: 'Exponera som API',
    name_en: 'Expose as API',
    description_sv: 'Exponera sparade sammanställningar som API',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Integration = pengar',
  },
  {
    id: 'versioned_endpoints',
    category: 'api_automation',
    name_sv: 'Versionerade endpoints',
    name_en: 'Versioned endpoints',
    description_sv: 'API-endpoints med versionshantering',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Integration = pengar',
  },
  {
    id: 'statement_id_in_api',
    category: 'api_automation',
    name_sv: 'Statement-ID i API',
    name_en: 'Statement ID in API',
    description_sv: 'Statement-ID följer med alla API-svar',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Verifiering = värde',
  },
  {
    id: 'auto_updates',
    category: 'api_automation',
    name_sv: 'Automatiska uppdateringar',
    name_en: 'Automatic updates',
    description_sv: 'Automatiska uppdateringar av API-data',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Automation = betalning',
  },
  {
    id: 'api_audit_log',
    category: 'api_automation',
    name_sv: 'API audit-logg',
    name_en: 'API audit log',
    description_sv: 'Logg över alla API-anrop',
    always_available: false,
    demo_limit: null,
    requires_tier: 'org',
    payment_rationale: 'Spårbarhet = betalning',
  },
] as const;

// ============================================================
// ALL FEATURES
// ============================================================

export const ALL_FEATURES: readonly Feature[] = [
  ...CORE_FEATURES,
  ...SAVE_ORGANIZE_FEATURES,
  ...SHARE_COLLABORATE_FEATURES,
  ...INDICATORS_MARKERS_FEATURES,
  ...POLITICAL_ANALYSIS_FEATURES,
  ...API_AUTOMATION_FEATURES,
] as const;

// ============================================================
// ADOBE-STYLE MODEL (THE FEELING)
// ============================================================

export const ADOBE_STYLE_MODEL = {
  principles: [
    'Allt syns',
    'Allt går att prova',
    'Inget känns låst',
  ],
  
  requires_payment: [
    'sparande',
    'kontinuitet',
    'samarbete',
    'automation',
  ],
  
  allowed_copy: [
    'Prova',
    'Spara',
    'Fortsätt arbeta',
    'Använd detta över tid',
  ],
  
  forbidden_copy: [
    'Premium data',
    'Låst innehåll',
    'Uppgradera för sanningen',
    'Exklusiv tillgång',
  ],
} as const;

// ============================================================
// FUTURE EXTENSIONS (FOLLOWS SAME LOGIC)
// ============================================================

export const FUTURE_EXTENSIONS = {
  planned: [
    {
      id: 'decision_logs',
      name_sv: 'Beslutsloggar',
      description: '"Vi gjorde X → detta hände"',
    },
    {
      id: 'policy_simulations',
      name_sv: 'Policy-simuleringar',
      description: 'Historiska, ej prognoser',
    },
    {
      id: 'scenario_comparisons',
      name_sv: 'Scenario-jämförelser',
      description: 'Jämföra olika scenarier',
    },
    {
      id: 'similar_contexts',
      name_sv: 'Liknande kontexter',
      description: '"Vad brukade fungera i liknande kontexter"',
    },
    {
      id: 'expert_comments',
      name_sv: 'Externa kommentarer',
      description: 'Expertläge',
    },
    {
      id: 'academic_mode',
      name_sv: 'Akademiskt läge',
      description: 'För forskare',
    },
  ],
  
  common_logic: 'Prova gratis → arbeta seriöst = betala',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getFeatureById(id: string): Feature | undefined {
  return ALL_FEATURES.find(f => f.id === id);
}

export function getFeaturesByCategory(category: FeatureCategory): readonly Feature[] {
  return ALL_FEATURES.filter(f => f.category === category);
}

export function canAccessFeature(
  featureId: string,
  userTier: AccessLevel,
  usageCount: number = 0
): { allowed: boolean; demo: boolean; reason?: string } {
  const feature = getFeatureById(featureId);
  if (!feature) return { allowed: false, demo: false, reason: 'Feature not found' };
  
  const tierOrder: Record<AccessLevel, number> = {
    anonymous: 0,
    free: 1,
    pro: 2,
    org: 3,
    enterprise: 4,
  };
  
  const userTierLevel = tierOrder[userTier];
  const requiredTierLevel = tierOrder[feature.requires_tier];
  
  // Full access
  if (userTierLevel >= requiredTierLevel) {
    return { allowed: true, demo: false };
  }
  
  // Demo access
  if (feature.demo_limit && feature.demo_limit.max_count !== null) {
    if (usageCount < feature.demo_limit.max_count) {
      return { allowed: true, demo: true };
    }
    return { 
      allowed: false, 
      demo: true, 
      reason: `Demo-gräns nådd (${feature.demo_limit.max_count})` 
    };
  }
  
  return { 
    allowed: false, 
    demo: false, 
    reason: `Kräver ${feature.requires_tier}` 
  };
}

export function getRemainingDemoUses(
  featureId: string,
  usageCount: number
): number | null {
  const feature = getFeatureById(featureId);
  if (!feature?.demo_limit?.max_count) return null;
  return Math.max(0, feature.demo_limit.max_count - usageCount);
}

export function getPaymentRationale(featureId: string): string | undefined {
  return getFeatureById(featureId)?.payment_rationale;
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const FEATURE_MODEL_COMPLETE = {
  core: CORE_FEATURES,
  saveOrganize: SAVE_ORGANIZE_FEATURES,
  shareCollaborate: SHARE_COLLABORATE_FEATURES,
  indicatorsMarkers: INDICATORS_MARKERS_FEATURES,
  politicalAnalysis: POLITICAL_ANALYSIS_FEATURES,
  apiAutomation: API_AUTOMATION_FEATURES,
  allFeatures: ALL_FEATURES,
  adobeStyleModel: ADOBE_STYLE_MODEL,
  futureExtensions: FUTURE_EXTENSIONS,
} as const;
