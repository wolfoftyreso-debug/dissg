/**
 * Monetization Configuration
 * 
 * 🔥 FINAL HARDENING & MONETIZATION PLAYBOOK
 * "MAKE IT A MONSTER" – Commercial, deployed, scalable
 * 
 * PRINCIPLE: Price by responsibility, not usage
 * 
 * We sell:
 * - Computational capacity
 * - Methodological confidence
 * - Legal clarity
 * - Decision-support hygiene
 */

export type SubscriptionTier = 'guest' | 'observer' | 'analyst' | 'institutional';

export interface TierFeature {
  key: string;
  name: {
    en: string;
    sv: string;
  };
  description: {
    en: string;
    sv: string;
  };
}

export interface TierDefinition {
  tier: SubscriptionTier;
  name: {
    en: string;
    sv: string;
  };
  description: {
    en: string;
    sv: string;
  };
  pricing: {
    monthly: number | null; // null = contact sales / free
    yearly: number | null;
    currency: 'EUR';
  };
  stripePriceIds: {
    monthly: string | null;
    yearly: string | null;
  };
  target: {
    en: string;
    sv: string;
  };
  features: TierFeatureAccess;
  selfServe: boolean; // Can be purchased directly via UI
  requiresApproval: boolean;
}

export interface TierFeatureAccess {
  viewData: boolean | 'limited';
  comparisons: boolean | 'limited';
  deepAnalysis: boolean;
  scenarioLab: boolean | 'limited';
  saveViews: boolean;
  exportPdf: boolean | 'watermarked';
  apiAccess: boolean;
  teamAccounts: boolean;
  auditLogs: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
  sla: boolean;
}

// ============================================
// TIER DEFINITIONS
// ============================================

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierDefinition> = {
  guest: {
    tier: 'guest',
    name: {
      en: 'Guest',
      sv: 'Gäst'
    },
    description: {
      en: 'Browse public data without an account',
      sv: 'Utforska öppen data utan konto'
    },
    pricing: {
      monthly: null,
      yearly: null,
      currency: 'EUR'
    },
    stripePriceIds: {
      monthly: null,
      yearly: null
    },
    target: {
      en: 'Anyone curious about the data',
      sv: 'Alla som är nyfikna på datan'
    },
    features: {
      viewData: 'limited',
      comparisons: 'limited',
      deepAnalysis: false,
      scenarioLab: false,
      saveViews: false,
      exportPdf: false,
      apiAccess: false,
      teamAccounts: false,
      auditLogs: false,
      prioritySupport: false,
      customIntegrations: false,
      sla: false
    },
    selfServe: false,
    requiresApproval: false
  },

  observer: {
    tier: 'observer',
    name: {
      en: 'Observer',
      sv: 'Observatör'
    },
    description: {
      en: 'Full transparency. Facts only. No tools.',
      sv: 'Full transparens. Endast fakta. Inga verktyg.'
    },
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'EUR'
    },
    stripePriceIds: {
      monthly: 'price_observer_free',
      yearly: null
    },
    target: {
      en: 'Citizens, journalists, researchers seeking transparency',
      sv: 'Medborgare, journalister, forskare som söker transparens'
    },
    features: {
      viewData: true,
      comparisons: true,
      deepAnalysis: false,
      scenarioLab: false,
      saveViews: false,
      exportPdf: false,
      apiAccess: false,
      teamAccounts: false,
      auditLogs: false,
      prioritySupport: false,
      customIntegrations: false,
      sla: false
    },
    selfServe: true,
    requiresApproval: false
  },

  analyst: {
    tier: 'analyst',
    name: {
      en: 'Analyst',
      sv: 'Analytiker'
    },
    description: {
      en: 'Professional tools. Full responsibility.',
      sv: 'Professionella verktyg. Fullt ansvar.'
    },
    pricing: {
      monthly: 199,
      yearly: 1990, // ~17% discount
      currency: 'EUR'
    },
    stripePriceIds: {
      monthly: 'price_analyst_monthly',
      yearly: 'price_analyst_yearly'
    },
    target: {
      en: 'Researchers, journalists, policy analysts',
      sv: 'Forskare, journalister, policyanalytiker'
    },
    features: {
      viewData: true,
      comparisons: true,
      deepAnalysis: true,
      scenarioLab: 'limited',
      saveViews: true,
      exportPdf: 'watermarked',
      apiAccess: false,
      teamAccounts: false,
      auditLogs: false,
      prioritySupport: false,
      customIntegrations: false,
      sla: false
    },
    selfServe: true,
    requiresApproval: false
  },

  institutional: {
    tier: 'institutional',
    name: {
      en: 'Institutional',
      sv: 'Institutionell'
    },
    description: {
      en: 'Enterprise infrastructure. Full power. Full accountability.',
      sv: 'Enterprise-infrastruktur. Full kraft. Fullt ansvar.'
    },
    pricing: {
      monthly: null, // Contact sales: €2,000 - €20,000/month
      yearly: null,
      currency: 'EUR'
    },
    stripePriceIds: {
      monthly: null, // Custom invoicing
      yearly: null
    },
    target: {
      en: 'Governments, central banks, major institutions',
      sv: 'Myndigheter, centralbanker, stora institutioner'
    },
    features: {
      viewData: true,
      comparisons: true,
      deepAnalysis: true,
      scenarioLab: true,
      saveViews: true,
      exportPdf: true,
      apiAccess: true,
      teamAccounts: true,
      auditLogs: true,
      prioritySupport: true,
      customIntegrations: true,
      sla: true
    },
    selfServe: false,
    requiresApproval: true
  }
};

// ============================================
// FEATURE MATRIX (For UI display)
// ============================================

export const FEATURE_MATRIX: TierFeature[] = [
  {
    key: 'viewData',
    name: { en: 'View Data', sv: 'Visa data' },
    description: { en: 'Access to all public indicators', sv: 'Tillgång till alla öppna indikatorer' }
  },
  {
    key: 'comparisons',
    name: { en: 'Comparisons', sv: 'Jämförelser' },
    description: { en: 'Compare across countries and time', sv: 'Jämför mellan länder och tid' }
  },
  {
    key: 'deepAnalysis',
    name: { en: 'Deep Analysis', sv: 'Djupanalys' },
    description: { en: 'Statistical breakdowns and correlations', sv: 'Statistiska nedbrytningar och korrelationer' }
  },
  {
    key: 'scenarioLab',
    name: { en: 'Scenario Lab', sv: 'Scenariolabb' },
    description: { en: 'What-if simulations and projections', sv: 'Vad-om-simuleringar och projektioner' }
  },
  {
    key: 'saveViews',
    name: { en: 'Save Views', sv: 'Spara vyer' },
    description: { en: 'Persist your analysis configurations', sv: 'Spara dina analyskonfigurationer' }
  },
  {
    key: 'exportPdf',
    name: { en: 'Export PDF', sv: 'Exportera PDF' },
    description: { en: 'Download reports for offline use', sv: 'Ladda ner rapporter för offline-användning' }
  },
  {
    key: 'apiAccess',
    name: { en: 'API Access', sv: 'API-åtkomst' },
    description: { en: 'Programmatic access to all data', sv: 'Programmatisk åtkomst till all data' }
  },
  {
    key: 'teamAccounts',
    name: { en: 'Team Accounts', sv: 'Teamkonton' },
    description: { en: 'Manage multiple users under one organization', sv: 'Hantera flera användare under en organisation' }
  },
  {
    key: 'auditLogs',
    name: { en: 'Audit Logs', sv: 'Granskningsloggar' },
    description: { en: 'Full trail of all actions and queries', sv: 'Fullständig spårning av alla åtgärder och frågor' }
  },
  {
    key: 'prioritySupport',
    name: { en: 'Priority Support', sv: 'Prioriterad support' },
    description: { en: 'Direct access to technical team', sv: 'Direktåtkomst till tekniskt team' }
  },
  {
    key: 'sla',
    name: { en: 'SLA', sv: 'SLA' },
    description: { en: 'Guaranteed uptime and response times', sv: 'Garanterad drifttid och svarstider' }
  }
];

// ============================================
// LEGAL REQUIREMENTS (Must accept before purchase)
// ============================================

export const LEGAL_CHECKBOXES = {
  termsOfService: {
    required: true,
    text: {
      en: 'I accept the Terms of Service',
      sv: 'Jag accepterar användarvillkoren'
    }
  },
  responsibilityClause: {
    required: true,
    text: {
      en: 'I understand that all interpretations, conclusions, and decisions based on this data are my sole responsibility',
      sv: 'Jag förstår att alla tolkningar, slutsatser och beslut baserade på denna data är mitt eget ansvar'
    }
  },
  scenarioDisclaimer: {
    required: true,
    forTiers: ['analyst', 'institutional'],
    text: {
      en: 'I acknowledge that scenario simulations are hypothetical projections, not predictions, and carry no guarantee of accuracy',
      sv: 'Jag bekräftar att scenariosimulationer är hypotetiska projektioner, inte förutsägelser, och inte har någon garanti för riktighet'
    }
  },
  dataUsagePolicy: {
    required: true,
    text: {
      en: 'I agree to use the data in accordance with the Data Usage Policy and will provide proper attribution',
      sv: 'Jag samtycker till att använda datan i enlighet med dataanvändningspolicyn och kommer att ge korrekt attribution'
    }
  }
};

// ============================================
// GRACE PERIOD & DOWNGRADE RULES
// ============================================

export const PAYMENT_RULES = {
  gracePeriodDays: 14,
  warningDays: [14, 7, 3, 1], // Days before downgrade to show warning
  downgradeTarget: 'observer' as SubscriptionTier,
  retryAttempts: 3,
  retryIntervalHours: 24
};

// ============================================
// STRIPE WEBHOOK EVENTS TO HANDLE
// ============================================

export const STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed'
] as const;

// ============================================
// MONSTER UX RULES
// ============================================

export const MONSTER_UX_RULES = {
  itShouldFeel: [
    'fast',
    'calm',
    'clinical',
    'exact'
  ],
  itShouldNotFeel: [
    'hype',
    'marketing',
    'colorful arrows',
    'opinion'
  ],
  forbidden: [
    'distracting animations',
    'emojis in analysis views',
    'insights you should know',
    'call-to-action in analysis views',
    'gamification',
    'achievement badges',
    'social sharing prompts'
  ]
};

// ============================================
// TIER HIERARCHY (for permission checks)
// ============================================

export const TIER_HIERARCHY: SubscriptionTier[] = [
  'guest',
  'observer', 
  'analyst',
  'institutional'
];

/**
 * Check if a tier has at least the permissions of another tier
 */
export function tierAtLeast(
  currentTier: SubscriptionTier, 
  requiredTier: SubscriptionTier
): boolean {
  const currentIndex = TIER_HIERARCHY.indexOf(currentTier);
  const requiredIndex = TIER_HIERARCHY.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}

/**
 * Get feature access for a specific tier
 */
export function getFeatureAccess(
  tier: SubscriptionTier, 
  feature: keyof TierFeatureAccess
): boolean | 'limited' | 'watermarked' {
  return SUBSCRIPTION_TIERS[tier].features[feature];
}

/**
 * Check if a feature is available (true or limited)
 */
export function hasFeatureAccess(
  tier: SubscriptionTier, 
  feature: keyof TierFeatureAccess
): boolean {
  const access = getFeatureAccess(tier, feature);
  return access === true || access === 'limited' || access === 'watermarked';
}

/**
 * Check if feature has full (non-limited) access
 */
export function hasFullFeatureAccess(
  tier: SubscriptionTier, 
  feature: keyof TierFeatureAccess
): boolean {
  return getFeatureAccess(tier, feature) === true;
}
