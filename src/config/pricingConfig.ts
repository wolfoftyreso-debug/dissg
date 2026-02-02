/**
 * 💳 MASTER EXECUTION BLOCK 29
 * PRISSÄTTNING & UPPGRADERINGSLOGIK (HANDLING → BETALNING)
 * 
 * Princip:
 * - Titta = gratis
 * - Förstå = gratis
 * - Spara / automatisera / integrera = betalt
 * - Mer ansvar → mer betalt
 * - Samma sanning för alla
 */

// ============================================================
// PRICING TIERS
// ============================================================

export interface PricingTier {
  readonly code: 'FREE' | 'PRO' | 'ORG' | 'ENTERPRISE';
  readonly name: string;
  readonly name_sv: string;
  readonly price_monthly_sek: number | null;
  readonly price_monthly_eur: number | null;
  readonly price_annual_sek: number | null;
  readonly price_annual_eur: number | null;
  readonly savings_annual_percent: number;
  readonly features: readonly string[];
  readonly limitations: readonly string[];
  readonly target_audience: string;
  readonly cta_text: string;
  readonly cta_text_sv: string;
}

export const PRICING_FREE: PricingTier = {
  code: 'FREE',
  name: 'Free',
  name_sv: 'Gratis',
  price_monthly_sek: 0,
  price_monthly_eur: 0,
  price_annual_sek: 0,
  price_annual_eur: 0,
  savings_annual_percent: 0,
  features: [
    '1 dashboard',
    '1 sparad vy',
    'Obegränsad session-analys',
    'Full dataåtkomst',
    'QR-verifiering',
    'Explain Engine',
  ],
  limitations: [
    'Ingen export',
    'Ingen API',
    'Inga alerts',
  ],
  target_audience: 'Nyfikna, studenter, allmänhet',
  cta_text: 'Get Started Free',
  cta_text_sv: 'Kom igång gratis',
} as const;

export const PRICING_PRO: PricingTier = {
  code: 'PRO',
  name: 'Pro',
  name_sv: 'Pro',
  price_monthly_sek: 349,
  price_monthly_eur: 32,
  price_annual_sek: 3490,
  price_annual_eur: 320,
  savings_annual_percent: 17,
  features: [
    'Obegränsade dashboards',
    'Obegränsade sparade vyer',
    'Export (CSV/PNG/PDF)',
    'Prenumerationer & alerts',
    'Versionshistorik',
    'Delning via verifierade länkar',
    'Avancerad korsning',
  ],
  limitations: [
    'Ingen API-åtkomst',
    'Ingen automation',
  ],
  target_audience: 'Analytiker, journalister, forskare',
  cta_text: 'Upgrade to Pro',
  cta_text_sv: 'Uppgradera till Pro',
} as const;

export const PRICING_ORG: PricingTier = {
  code: 'ORG',
  name: 'Organization',
  name_sv: 'Organisation',
  price_monthly_sek: 4990,
  price_monthly_eur: 459,
  price_annual_sek: 49900,
  price_annual_eur: 4590,
  savings_annual_percent: 17,
  features: [
    'Allt i Pro',
    'Team & roller',
    'Delade dashboards',
    'Audit-logg',
    'SLA (99.5%)',
    'API from View',
    '1M API-anrop/mån inkluderat',
    'Prioriterad support',
  ],
  limitations: [],
  target_audience: 'Företag, myndigheter, NGO:er',
  cta_text: 'Start Organization',
  cta_text_sv: 'Starta Organisation',
} as const;

export const PRICING_ENTERPRISE: PricingTier = {
  code: 'ENTERPRISE',
  name: 'Enterprise',
  name_sv: 'Enterprise',
  price_monthly_sek: null, // Custom
  price_monthly_eur: null,
  price_annual_sek: null,
  price_annual_eur: null,
  savings_annual_percent: 0,
  features: [
    'Allt i Organisation',
    'Dedikerade pipelines',
    'White-label / egen domän',
    'Hög tillgänglighet (99.9%)',
    'Batch + streaming',
    'Governance-anpassning',
    'Juridiskt ramverk',
    'Dedikerad support & rådgivning',
  ],
  limitations: [],
  target_audience: 'Stater, stora organisationer',
  cta_text: 'Contact Sales',
  cta_text_sv: 'Kontakta oss',
} as const;

export const PRICING_TIERS: readonly PricingTier[] = [
  PRICING_FREE,
  PRICING_PRO,
  PRICING_ORG,
  PRICING_ENTERPRISE,
] as const;

// ============================================================
// API PRICING (ORG+)
// ============================================================

export const API_PRICING = {
  base_included_calls: 1_000_000,
  extra_million_sek: 500,
  extra_million_eur: 46,
  rate_limit_per_minute: 1000,
  rate_limit_per_day: 100_000,
} as const;

// ============================================================
// UPGRADE TRIGGERS
// ============================================================

export interface UpgradeTrigger {
  readonly action: string;
  readonly action_sv: string;
  readonly from_tier: 'FREE' | 'PRO' | 'ORG';
  readonly to_tier: 'PRO' | 'ORG' | 'ENTERPRISE';
  readonly modal_title: string;
  readonly modal_title_sv: string;
  readonly modal_message: string;
  readonly modal_message_sv: string;
  readonly cta: string;
  readonly cta_sv: string;
}

export const UPGRADE_TRIGGERS: readonly UpgradeTrigger[] = [
  // FREE → PRO
  {
    action: 'save_additional_view',
    action_sv: 'Spara ytterligare vy',
    from_tier: 'FREE',
    to_tier: 'PRO',
    modal_title: 'Keep this view?',
    modal_title_sv: 'Vill du behålla detta?',
    modal_message: 'With Pro you can save unlimited views and dashboards.',
    modal_message_sv: 'Med Pro kan du spara obegränsat antal vyer och dashboards.',
    cta: 'Upgrade to Pro',
    cta_sv: 'Uppgradera till Pro',
  },
  {
    action: 'export',
    action_sv: 'Exportera',
    from_tier: 'FREE',
    to_tier: 'PRO',
    modal_title: 'Export this data?',
    modal_title_sv: 'Vill du exportera detta?',
    modal_message: 'Pro includes export to CSV, PNG and PDF with full verification.',
    modal_message_sv: 'Pro inkluderar export till CSV, PNG och PDF med full verifiering.',
    cta: 'Upgrade to Pro',
    cta_sv: 'Uppgradera till Pro',
  },
  {
    action: 'subscribe_indicator',
    action_sv: 'Prenumerera på indikator',
    from_tier: 'FREE',
    to_tier: 'PRO',
    modal_title: 'Stay updated?',
    modal_title_sv: 'Vill du hålla dig uppdaterad?',
    modal_message: 'Subscribe to get notified when significant changes occur.',
    modal_message_sv: 'Prenumerera för att få notiser vid signifikanta förändringar.',
    cta: 'Upgrade to Pro',
    cta_sv: 'Uppgradera till Pro',
  },
  // PRO → ORG
  {
    action: 'expose_api',
    action_sv: 'Exponera som API',
    from_tier: 'PRO',
    to_tier: 'ORG',
    modal_title: 'Use this in other systems?',
    modal_title_sv: 'Vill du använda detta i andra system?',
    modal_message: 'Organization includes API from View – expose any dashboard as a verified API endpoint.',
    modal_message_sv: 'Organisation inkluderar API from View – exponera vilken dashboard som helst som ett verifierat API-endpoint.',
    cta: 'Upgrade to Organization',
    cta_sv: 'Uppgradera till Organisation',
  },
  {
    action: 'automate_flow',
    action_sv: 'Automatisera flöde',
    from_tier: 'PRO',
    to_tier: 'ORG',
    modal_title: 'Automate this workflow?',
    modal_title_sv: 'Vill du automatisera detta?',
    modal_message: 'Organization includes automation, API access and team collaboration.',
    modal_message_sv: 'Organisation inkluderar automation, API-åtkomst och team-samarbete.',
    cta: 'Upgrade to Organization',
    cta_sv: 'Uppgradera till Organisation',
  },
  {
    action: 'invite_team',
    action_sv: 'Bjud in team',
    from_tier: 'PRO',
    to_tier: 'ORG',
    modal_title: 'Work together?',
    modal_title_sv: 'Vill du samarbeta?',
    modal_message: 'Organization includes team dashboards, roles and shared views.',
    modal_message_sv: 'Organisation inkluderar team-dashboards, roller och delade vyer.',
    cta: 'Upgrade to Organization',
    cta_sv: 'Uppgradera till Organisation',
  },
  // ORG → ENTERPRISE
  {
    action: 'rate_limit_reached',
    action_sv: 'Rate limit nått',
    from_tier: 'ORG',
    to_tier: 'ENTERPRISE',
    modal_title: 'Need more capacity?',
    modal_title_sv: 'Behöver ni mer kapacitet?',
    modal_message: 'Enterprise includes dedicated pipelines and custom rate limits.',
    modal_message_sv: 'Enterprise inkluderar dedikerade pipelines och anpassade rate limits.',
    cta: 'Contact Sales',
    cta_sv: 'Kontakta oss',
  },
  {
    action: 'white_label',
    action_sv: 'White-label',
    from_tier: 'ORG',
    to_tier: 'ENTERPRISE',
    modal_title: 'Need this as infrastructure?',
    modal_title_sv: 'Behöver ni detta som infrastruktur?',
    modal_message: 'Enterprise includes white-label dashboards, custom domain and governance.',
    modal_message_sv: 'Enterprise inkluderar white-label dashboards, egen domän och governance.',
    cta: 'Contact Sales',
    cta_sv: 'Kontakta oss',
  },
  {
    action: 'batch_access',
    action_sv: 'Batch-åtkomst',
    from_tier: 'ORG',
    to_tier: 'ENTERPRISE',
    modal_title: 'Need batch processing?',
    modal_title_sv: 'Behöver ni batch-bearbetning?',
    modal_message: 'Enterprise includes batch + streaming access for large-scale operations.',
    modal_message_sv: 'Enterprise inkluderar batch + streaming för storskaliga operationer.',
    cta: 'Contact Sales',
    cta_sv: 'Kontakta oss',
  },
] as const;

// ============================================================
// UX RULES (PAYMENT WITHOUT FRUSTRATION)
// ============================================================

export const PAYMENT_UX_RULES = {
  principles: [
    'Ingen paywall på data',
    'Alltid prova först',
    'Betala när du vill behålla eller koppla vidare',
    'Aldrig låst innehåll, bara låst kontroll',
  ],
  
  copy_patterns: {
    save: {
      en: 'Do you want to save this?',
      sv: 'Vill du spara detta?',
    },
    automate: {
      en: 'Do you want this automatically?',
      sv: 'Vill du få detta automatiskt?',
    },
    external: {
      en: 'Do you want to use this externally?',
      sv: 'Vill du använda detta externt?',
    },
  },
  
  never_block: [
    'data access',
    'viewing',
    'understanding',
    'verification',
    'explanation',
  ],
  
  always_allow: [
    'explore all public data',
    'view all indexes',
    'use correlations',
    'run session analysis',
    'verify via QR',
  ],
} as const;

// ============================================================
// FAIRNESS PRINCIPLE
// ============================================================

export const FAIRNESS_PRINCIPLE = {
  same_for_all: [
    'Data',
    'Methods',
    'Verification (QR / statement_id)',
  ],
  only_difference: 'What you do with the result',
  moral_status: 'Moraliskt hållbar',
  political_status: 'Politiskt neutral',
  commercial_status: 'Kommersiellt stark',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getPricingTier(code: PricingTier['code']): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.code === code);
}

export function getUpgradeTrigger(
  action: string,
  currentTier: 'FREE' | 'PRO' | 'ORG'
): UpgradeTrigger | undefined {
  return UPGRADE_TRIGGERS.find(
    t => t.action === action && t.from_tier === currentTier
  );
}

export function getMonthlyPrice(tier: PricingTier, currency: 'SEK' | 'EUR'): number | null {
  return currency === 'SEK' ? tier.price_monthly_sek : tier.price_monthly_eur;
}

export function getAnnualPrice(tier: PricingTier, currency: 'SEK' | 'EUR'): number | null {
  return currency === 'SEK' ? tier.price_annual_sek : tier.price_annual_eur;
}

export function formatPrice(amount: number | null, currency: 'SEK' | 'EUR'): string {
  if (amount === null) return 'Kontakta oss';
  if (amount === 0) return 'Gratis';
  return currency === 'SEK' 
    ? `${amount.toLocaleString('sv-SE')} kr`
    : `€${amount.toLocaleString('en-US')}`;
}

export function shouldShowUpgradeModal(
  action: string,
  currentTier: 'FREE' | 'PRO' | 'ORG'
): { show: boolean; trigger?: UpgradeTrigger } {
  const trigger = getUpgradeTrigger(action, currentTier);
  return {
    show: !!trigger,
    trigger,
  };
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const PRICING_CONFIG_COMPLETE = {
  tiers: PRICING_TIERS,
  apiPricing: API_PRICING,
  upgradeTriggers: UPGRADE_TRIGGERS,
  uxRules: PAYMENT_UX_RULES,
  fairness: FAIRNESS_PRINCIPLE,
} as const;
