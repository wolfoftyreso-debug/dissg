/**
 * BLOCK AM — PUBLIC + PRO MODE
 * Configuration for access tiers and feature gates
 */

// AM1 & AM2: Access Tier Definitions
export interface AccessTierConfig {
  code: 'public' | 'pro' | 'enterprise';
  name: string;
  description: string;
  tagline: string;
  features: AccessFeatures;
  limits: AccessLimits;
  pricing?: {
    monthly: number;
    annual: number;
    currency: string;
  };
  ctaText: string;
}

export interface AccessFeatures {
  // Data Access
  dataVisible: boolean;
  aggregationLevel: 'basic' | 'full';
  historicalDepth: 'limited' | 'full' | 'unlimited';
  
  // Comparison & Analysis
  comparison: boolean;
  correlationAnalysis: boolean;
  regionalBreakdown: boolean;
  customFilters: boolean;
  
  // Sharing & Export
  sharing: boolean;
  export: 'none' | 'basic' | 'full';
  embedWidgets: boolean;
  
  // Automation
  automation: boolean;
  feeds: boolean;
  webhooks: boolean;
  scheduledReports: boolean;
  
  // Advanced
  simulation: boolean;
  api: boolean;
  bulk: boolean;
  whiteLabel: boolean;
  
  // Support
  support: 'community' | 'email' | 'priority' | 'dedicated';
  sla: boolean;
}

export interface AccessLimits {
  queriesPerDay: number;
  apiCallsPerMinute?: number;
  exportsPerMonth?: number;
  savedDashboards?: number;
  feedSubscriptions?: number;
  webhookEndpoints?: number;
}

export const ACCESS_TIERS: AccessTierConfig[] = [
  {
    code: 'public',
    name: 'Publik',
    description: 'Full insyn i alla data, gratis för alla',
    tagline: 'All data synlig för alla',
    features: {
      dataVisible: true,
      aggregationLevel: 'basic',
      historicalDepth: 'limited',
      comparison: true,
      correlationAnalysis: false,
      regionalBreakdown: true,
      customFilters: false,
      sharing: true,
      export: 'basic',
      embedWidgets: false,
      automation: false,
      feeds: false,
      webhooks: false,
      scheduledReports: false,
      simulation: false,
      api: false,
      bulk: false,
      whiteLabel: false,
      support: 'community',
      sla: false
    },
    limits: {
      queriesPerDay: 1000,
      exportsPerMonth: 10,
      savedDashboards: 0
    },
    ctaText: 'Börja utforska'
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'Fullständig kraft för professionell analys',
    tagline: 'Automation, feeds, simulering, API',
    features: {
      dataVisible: true,
      aggregationLevel: 'full',
      historicalDepth: 'full',
      comparison: true,
      correlationAnalysis: true,
      regionalBreakdown: true,
      customFilters: true,
      sharing: true,
      export: 'full',
      embedWidgets: true,
      automation: true,
      feeds: true,
      webhooks: true,
      scheduledReports: true,
      simulation: true,
      api: true,
      bulk: true,
      whiteLabel: false,
      support: 'email',
      sla: false
    },
    limits: {
      queriesPerDay: 100000,
      apiCallsPerMinute: 60,
      exportsPerMonth: 1000,
      savedDashboards: 50,
      feedSubscriptions: 20,
      webhookEndpoints: 10
    },
    pricing: {
      monthly: 990,
      annual: 9900,
      currency: 'SEK'
    },
    ctaText: 'Uppgradera till Pro'
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    description: 'Skräddarsydd lösning för organisationer',
    tagline: 'White-label, dedikerad support, obegränsat',
    features: {
      dataVisible: true,
      aggregationLevel: 'full',
      historicalDepth: 'unlimited',
      comparison: true,
      correlationAnalysis: true,
      regionalBreakdown: true,
      customFilters: true,
      sharing: true,
      export: 'full',
      embedWidgets: true,
      automation: true,
      feeds: true,
      webhooks: true,
      scheduledReports: true,
      simulation: true,
      api: true,
      bulk: true,
      whiteLabel: true,
      support: 'dedicated',
      sla: true
    },
    limits: {
      queriesPerDay: -1, // Unlimited
      apiCallsPerMinute: 1000,
      exportsPerMonth: -1,
      savedDashboards: -1,
      feedSubscriptions: -1,
      webhookEndpoints: -1
    },
    ctaText: 'Kontakta oss'
  }
];

// Feature Gate Checks
export interface FeatureGate {
  feature: keyof AccessFeatures;
  name: string;
  description: string;
  upgradeMessage: string;
}

export const FEATURE_GATES: FeatureGate[] = [
  {
    feature: 'correlationAnalysis',
    name: 'Korrelationsanalys',
    description: 'Analysera samband mellan KPI:er',
    upgradeMessage: 'Uppgradera till Pro för att se korrelationer'
  },
  {
    feature: 'simulation',
    name: 'Simulering',
    description: 'Testa scenarier och prognoser',
    upgradeMessage: 'Uppgradera till Pro för simuleringsverktyg'
  },
  {
    feature: 'feeds',
    name: 'Automatiska feeds',
    description: 'Få uppdateringar när data förändras',
    upgradeMessage: 'Uppgradera till Pro för automatiska feeds'
  },
  {
    feature: 'api',
    name: 'API-åtkomst',
    description: 'Programmatisk åtkomst till all data',
    upgradeMessage: 'Uppgradera till Pro för API-åtkomst'
  },
  {
    feature: 'automation',
    name: 'Automation',
    description: 'Schemalägg rapporter och alerts',
    upgradeMessage: 'Uppgradera till Pro för automation'
  },
  {
    feature: 'whiteLabel',
    name: 'White-label',
    description: 'Anpassa varumärke och design',
    upgradeMessage: 'Kontakta oss för Enterprise-lösning'
  }
];

// Helper functions
export function getTierConfig(code: string): AccessTierConfig | undefined {
  return ACCESS_TIERS.find(t => t.code === code);
}

export function hasFeature(
  tierCode: 'public' | 'pro' | 'enterprise',
  feature: keyof AccessFeatures
): boolean {
  const tier = getTierConfig(tierCode);
  if (!tier) return false;
  
  const value = tier.features[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value !== 'none';
  return true;
}

export function getLimit(
  tierCode: 'public' | 'pro' | 'enterprise',
  limit: keyof AccessLimits
): number {
  const tier = getTierConfig(tierCode);
  if (!tier) return 0;
  
  const value = tier.limits[limit];
  return value ?? 0;
}

export function isUnlimited(
  tierCode: 'public' | 'pro' | 'enterprise',
  limit: keyof AccessLimits
): boolean {
  return getLimit(tierCode, limit) === -1;
}

export function checkLimitExceeded(
  tierCode: 'public' | 'pro' | 'enterprise',
  limit: keyof AccessLimits,
  currentUsage: number
): { exceeded: boolean; remaining: number; message?: string } {
  const maxLimit = getLimit(tierCode, limit);
  
  if (maxLimit === -1) {
    return { exceeded: false, remaining: Infinity };
  }
  
  const exceeded = currentUsage >= maxLimit;
  const remaining = Math.max(0, maxLimit - currentUsage);
  
  return {
    exceeded,
    remaining,
    message: exceeded ? `Gräns nådd (${maxLimit}). Uppgradera för mer.` : undefined
  };
}

export function getUpgradeMessage(feature: keyof AccessFeatures): string | undefined {
  const gate = FEATURE_GATES.find(g => g.feature === feature);
  return gate?.upgradeMessage;
}

// Tier comparison for upgrade prompts
export function shouldPromptUpgrade(
  currentTier: 'public' | 'pro' | 'enterprise',
  attemptedFeature: keyof AccessFeatures
): { shouldPrompt: boolean; targetTier?: 'pro' | 'enterprise'; message?: string } {
  if (hasFeature(currentTier, attemptedFeature)) {
    return { shouldPrompt: false };
  }
  
  if (hasFeature('pro', attemptedFeature)) {
    return {
      shouldPrompt: true,
      targetTier: 'pro',
      message: getUpgradeMessage(attemptedFeature)
    };
  }
  
  if (hasFeature('enterprise', attemptedFeature)) {
    return {
      shouldPrompt: true,
      targetTier: 'enterprise',
      message: getUpgradeMessage(attemptedFeature)
    };
  }
  
  return { shouldPrompt: false };
}
