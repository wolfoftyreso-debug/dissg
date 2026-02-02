/**
 * 🧱 ACCESS & MONETIZATION ARCHITECTURE
 * 
 * PRINCIP:
 * - Data är alltid öppen att titta på
 * - Verktyg, persistens och automation kostar
 * - Ingen inlåsning, bara skalning
 * - Betalning = kontroll + kontinuitet + integration
 */

// ============================================================
// CORE PRINCIPLES
// ============================================================

export const ACCESS_PRINCIPLES = {
  data_always_open: true,
  tools_persistence_automation_cost: true,
  no_lock_in: true,
  payment_equals: ['control', 'continuity', 'integration'],
  
  we_charge_for: [
    'antal dashboards',
    'antal sparade vyer',
    'antal prenumerationer',
    'export',
    'API-access',
    'automation',
    'SLA',
  ],
  
  we_never_charge_for: [
    'sanning',
    'datatillgång',
    'insyn',
    'förståelse',
  ],
  
  moral_foundation: 'Detta är varför ni inte blir ifrågasatta moraliskt.',
} as const;

// ============================================================
// ACCESS TIER TYPES
// ============================================================

export type AccessTierCode = 'PUBLIC' | 'FREE' | 'PRO' | 'ORG' | 'PLATFORM';

export interface AccessFeature {
  readonly feature: string;
  readonly included: boolean;
  readonly limit?: number | 'unlimited';
}

export interface AccessTierConfig {
  readonly code: AccessTierCode;
  readonly level: number;
  readonly name: string;
  readonly name_sv: string;
  readonly purpose: string;
  readonly target_user: string;
  readonly tagline: string;
  readonly features: readonly AccessFeature[];
  readonly price_monthly_sek?: number;
  readonly price_monthly_eur?: number;
  readonly price_annual_sek?: number;
  readonly ctaText: string;
}

// ============================================================
// TIER 0: PUBLIC / ANONYMOUS
// ============================================================

const TIER_PUBLIC: AccessTierConfig = {
  code: 'PUBLIC',
  level: 0,
  name: 'Public',
  name_sv: 'Offentlig / Anonym',
  purpose: 'Förstå världen. Bygga förtroende.',
  target_user: 'Alla',
  tagline: 'Wikipedia + Bloomberg + SCB – men begripligt',
  features: [
    { feature: 'explore_all_public_data', included: true },
    { feature: 'view_all_indexes', included: true },
    { feature: 'view_maps_graphs_timeseries', included: true },
    { feature: 'use_correlations', included: true },
    { feature: 'run_session_analysis', included: true },
    { feature: 'explain_engine', included: true },
    { feature: 'qr_verification', included: true },
    { feature: 'save_anything', included: false },
    { feature: 'export', included: false },
    { feature: 'dashboards', included: false },
    { feature: 'alerts', included: false },
    { feature: 'api_access', included: false },
  ],
  price_monthly_sek: 0,
  price_monthly_eur: 0,
  ctaText: 'Börja utforska',
} as const;

// ============================================================
// TIER 1: FREE ACCOUNT
// ============================================================

const TIER_FREE: AccessTierConfig = {
  code: 'FREE',
  level: 1,
  name: 'Free Account',
  name_sv: 'Gratis konto',
  purpose: 'Prova på att arbeta med systemet.',
  target_user: 'Nyfikna, studenter, allmänhet',
  tagline: 'Här börjar folk förstå värdet',
  features: [
    { feature: 'explore_all_public_data', included: true },
    { feature: 'view_all_indexes', included: true },
    { feature: 'view_maps_graphs_timeseries', included: true },
    { feature: 'use_correlations', included: true },
    { feature: 'run_session_analysis', included: true },
    { feature: 'explain_engine', included: true },
    { feature: 'qr_verification', included: true },
    { feature: 'saved_dashboards', included: true, limit: 1 },
    { feature: 'saved_views', included: true, limit: 1 },
    { feature: 'basic_filters', included: true },
    { feature: 'full_history', included: true },
    { feature: 'private_personal_data', included: true },
    { feature: 'export', included: false },
    { feature: 'api_access', included: false },
    { feature: 'alerts', included: false },
  ],
  price_monthly_sek: 0,
  price_monthly_eur: 0,
  ctaText: 'Skapa gratis konto',
} as const;

// ============================================================
// TIER 2: PRO
// ============================================================

const TIER_PRO: AccessTierConfig = {
  code: 'PRO',
  level: 2,
  name: 'Pro',
  name_sv: 'Pro',
  purpose: 'Arbeta seriöst med data.',
  target_user: 'Individer, analytiker, journalister',
  tagline: 'Analyskomfort och minne',
  features: [
    { feature: 'explore_all_public_data', included: true },
    { feature: 'view_all_indexes', included: true },
    { feature: 'view_maps_graphs_timeseries', included: true },
    { feature: 'use_correlations', included: true },
    { feature: 'run_session_analysis', included: true },
    { feature: 'explain_engine', included: true },
    { feature: 'qr_verification', included: true },
    { feature: 'saved_dashboards', included: true, limit: 'unlimited' },
    { feature: 'saved_views', included: true, limit: 'unlimited' },
    { feature: 'advanced_multi_indicator_crossing', included: true },
    { feature: 'time_storage_version_history', included: true },
    { feature: 'export_csv', included: true },
    { feature: 'export_png', included: true },
    { feature: 'export_pdf', included: true },
    { feature: 'indicator_subscriptions', included: true },
    { feature: 'discrete_alerts', included: true },
    { feature: 'verified_link_sharing', included: true },
    { feature: 'api_access', included: false },
    { feature: 'automation', included: false },
    { feature: 'team_features', included: false },
  ],
  price_monthly_sek: 299,
  price_monthly_eur: 29,
  price_annual_sek: 2990,
  ctaText: 'Uppgradera till Pro',
} as const;

// ============================================================
// TIER 3: ORG
// ============================================================

const TIER_ORG: AccessTierConfig = {
  code: 'ORG',
  level: 3,
  name: 'Organization',
  name_sv: 'Organisation',
  purpose: 'Använda systemet i beslut.',
  target_user: 'Företag, myndigheter, NGO:er',
  tagline: 'API From View – exponera egna vyer som API',
  features: [
    { feature: 'explore_all_public_data', included: true },
    { feature: 'view_all_indexes', included: true },
    { feature: 'saved_dashboards', included: true, limit: 'unlimited' },
    { feature: 'saved_views', included: true, limit: 'unlimited' },
    { feature: 'export_csv', included: true },
    { feature: 'export_png', included: true },
    { feature: 'export_pdf', included: true },
    { feature: 'indicator_subscriptions', included: true },
    { feature: 'discrete_alerts', included: true },
    { feature: 'team_dashboards', included: true },
    { feature: 'roles_permissions', included: true },
    { feature: 'shared_views', included: true },
    { feature: 'organization_truth_views', included: true },
    { feature: 'audit_log', included: true },
    { feature: 'sla', included: true },
    { feature: 'support_priority', included: true },
    { feature: 'api_from_view', included: true }, // CORE FEATURE
    { feature: 'api_access', included: true },
  ],
  price_monthly_sek: 2999,
  price_monthly_eur: 299,
  price_annual_sek: 29990,
  ctaText: 'Starta Organisation',
} as const;

// ============================================================
// TIER 4: PLATFORM / STATE / ENTERPRISE
// ============================================================

const TIER_PLATFORM: AccessTierConfig = {
  code: 'PLATFORM',
  level: 4,
  name: 'Platform / Enterprise',
  name_sv: 'Plattform / Stat / Enterprise',
  purpose: 'Samhällsstyrning, nationell analys, stora system.',
  target_user: 'Stater, stora organisationer, infrastruktur',
  tagline: 'Infrastrukturlicens, inte SaaS',
  features: [
    { feature: 'everything_in_org', included: true },
    { feature: 'high_api_rate_limits', included: true },
    { feature: 'batch_access', included: true },
    { feature: 'white_label_dashboards', included: true },
    { feature: 'custom_domain', included: true },
    { feature: 'dedicated_data_pipelines', included: true },
    { feature: 'internal_index_mirroring', included: true },
    { feature: 'contracted_governance_model', included: true },
    { feature: 'dedicated_support', included: true },
  ],
  price_monthly_sek: undefined, // Custom pricing
  price_monthly_eur: undefined,
  ctaText: 'Kontakta oss',
} as const;

// ============================================================
// ALL TIERS
// ============================================================

export const ACCESS_TIERS: readonly AccessTierConfig[] = [
  TIER_PUBLIC,
  TIER_FREE,
  TIER_PRO,
  TIER_ORG,
  TIER_PLATFORM,
] as const;

// ============================================================
// API FROM VIEW (CORE ORG FEATURE)
// ============================================================

export interface APIFromViewConfig {
  readonly description: string;
  readonly steps: readonly string[];
  readonly output: readonly string[];
  readonly value_statement: string;
}

export const API_FROM_VIEW: APIFromViewConfig = {
  description: 'Användaren kan exponera egna vyer som API:er',
  steps: [
    '1. Bygga en egen sammanställning (dashboard/view)',
    '2. Klicka: "Expose as API"',
    '3. Få endpoint, schema, statement_id, verifieringslänk',
    '4. Använda datan i egna system',
  ],
  output: ['endpoint', 'schema', 'statement_id', 'verify_url'],
  value_statement: 'Detta är extremt värdefullt och självklart betalt.',
} as const;

// ============================================================
// PAYMENT TRIGGERS
// ============================================================

export interface PaymentTrigger {
  readonly action: string;
  readonly prompt: string;
  readonly tier_required: AccessTierCode;
}

export const PAYMENT_TRIGGERS: readonly PaymentTrigger[] = [
  { action: 'save_dashboard', prompt: 'Vill du spara detta?', tier_required: 'FREE' },
  { action: 'save_more_dashboards', prompt: 'Uppgradera för obegränsade dashboards', tier_required: 'PRO' },
  { action: 'export', prompt: 'Vill du exportera detta?', tier_required: 'PRO' },
  { action: 'subscribe', prompt: 'Vill du prenumerera på detta?', tier_required: 'PRO' },
  { action: 'set_alert', prompt: 'Vill du få notiser om förändringar?', tier_required: 'PRO' },
  { action: 'expose_api', prompt: 'Vill du använda detta automatiskt?', tier_required: 'ORG' },
  { action: 'team_share', prompt: 'Vill du dela med teamet?', tier_required: 'ORG' },
] as const;

export const PRODUCT_LOGIC = {
  always_show: [
    'Du kan göra detta nu',
    'Vill du spara detta?',
    'Vill du prenumerera?',
    'Vill du använda detta automatiskt?',
  ],
  principle: 'Betalning triggas av handling, inte murar.',
} as const;

// ============================================================
// VALUE LADDER
// ============================================================

export const VALUE_LADDER = {
  steps: [
    { level: 0, action: 'Förstå', tier: 'PUBLIC' as AccessTierCode },
    { level: 1, action: 'Spara', tier: 'FREE' as AccessTierCode },
    { level: 2, action: 'Arbeta', tier: 'PRO' as AccessTierCode },
    { level: 3, action: 'Automatisera', tier: 'ORG' as AccessTierCode },
    { level: 4, action: 'Styra', tier: 'PLATFORM' as AccessTierCode },
  ],
  philosophy: 'Ingen press. Ingen bullshit. Bara nytta → betalning.',
} as const;

// ============================================================
// UNIVERSAL FEATURES (ALL TIERS)
// ============================================================

export const UNIVERSAL_FEATURES = {
  same_data: true,
  same_methods: true,
  same_verification: true,
  same_qr_system: true,
  difference: 'hur mycket kontroll du har över flödet',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTierByCode(code: AccessTierCode): AccessTierConfig | undefined {
  return ACCESS_TIERS.find(tier => tier.code === code);
}

export function hasFeature(tierCode: AccessTierCode, feature: string): boolean {
  const tier = getTierByCode(tierCode);
  if (!tier) return false;
  const feat = tier.features.find(f => f.feature === feature);
  return feat?.included ?? false;
}

export function getFeatureLimit(tierCode: AccessTierCode, feature: string): number | 'unlimited' | undefined {
  const tier = getTierByCode(tierCode);
  if (!tier) return undefined;
  const feat = tier.features.find(f => f.feature === feature);
  return feat?.limit;
}

export function getUpgradePath(currentTier: AccessTierCode): AccessTierCode | null {
  const current = getTierByCode(currentTier);
  if (!current) return null;
  const next = ACCESS_TIERS.find(t => t.level === current.level + 1);
  return next?.code ?? null;
}

export function getRequiredTierForFeature(feature: string): AccessTierCode | null {
  for (const tier of ACCESS_TIERS) {
    const feat = tier.features.find(f => f.feature === feature && f.included);
    if (feat) return tier.code;
  }
  return null;
}

export function shouldPromptUpgrade(
  currentTier: AccessTierCode,
  attemptedFeature: string
): { shouldPrompt: boolean; targetTier?: AccessTierCode; message?: string } {
  if (hasFeature(currentTier, attemptedFeature)) {
    return { shouldPrompt: false };
  }
  
  const requiredTier = getRequiredTierForFeature(attemptedFeature);
  if (requiredTier) {
    const trigger = PAYMENT_TRIGGERS.find(t => t.tier_required === requiredTier);
    return {
      shouldPrompt: true,
      targetTier: requiredTier,
      message: trigger?.prompt,
    };
  }
  
  return { shouldPrompt: false };
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const ACCESS_ARCHITECTURE_COMPLETE = {
  principles: ACCESS_PRINCIPLES,
  tiers: ACCESS_TIERS,
  apiFromView: API_FROM_VIEW,
  paymentTriggers: PAYMENT_TRIGGERS,
  productLogic: PRODUCT_LOGIC,
  universalFeatures: UNIVERSAL_FEATURES,
  valueLadder: VALUE_LADDER,
} as const;
