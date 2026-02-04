/**
 * Licensing Configuration System
 * 
 * Soft-coded licensing tiers aligned with monetization strategy.
 * Ready for Stripe integration but abstracted for flexibility.
 */



export type LicenseTier = 'guest' | 'observer' | 'analyst' | 'institutional';
export type BillingInterval = 'monthly' | 'yearly';
export type PaymentProvider = 'stripe' | 'manual' | 'enterprise';

export interface TierFeatures {
  // Access
  fullTransparency: boolean;
  exportData: boolean;
  apiAccess: boolean;
  scenarioLab: boolean;
  whiteLabel: boolean;
  teamAccounts: boolean;
  customIntegrations: boolean;
  
  // Limits
  maxQueries: number | null; // null = unlimited
  maxExports: number | null;
  maxApiCalls: number | null;
  dataRetentionDays: number;
  
  // Support
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  slaGuarantee: boolean;
}

export interface TierPricing {
  monthly: number;
  yearly: number;
  currency: string;
}

export interface LicenseTierConfig {
  tier: LicenseTier;
  name: string;
  description: string;
  features: TierFeatures;
  pricing: Record<string, TierPricing>; // Currency code -> pricing
  stripePriceIds?: {
    monthly?: string;
    yearly?: string;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
}

export const licenseTiers: Record<LicenseTier, LicenseTierConfig> = {
  guest: {
    tier: 'guest',
    name: 'Guest',
    description: 'Limited access to public data and observations',
    features: {
      fullTransparency: false,
      exportData: false,
      apiAccess: false,
      scenarioLab: false,
      whiteLabel: false,
      teamAccounts: false,
      customIntegrations: false,
      maxQueries: 100,
      maxExports: 0,
      maxApiCalls: 0,
      dataRetentionDays: 0,
      supportLevel: 'community',
      slaGuarantee: false,
    },
    pricing: {
      USD: { monthly: 0, yearly: 0, currency: 'USD' },
      EUR: { monthly: 0, yearly: 0, currency: 'EUR' },
      SEK: { monthly: 0, yearly: 0, currency: 'SEK' },
    },
  },
  observer: {
    tier: 'observer',
    name: 'Observer',
    description: 'Full transparency, democratic baseline access',
    features: {
      fullTransparency: true,
      exportData: false,
      apiAccess: false,
      scenarioLab: false,
      whiteLabel: false,
      teamAccounts: false,
      customIntegrations: false,
      maxQueries: null,
      maxExports: 0,
      maxApiCalls: 0,
      dataRetentionDays: 30,
      supportLevel: 'community',
      slaGuarantee: false,
    },
    pricing: {
      USD: { monthly: 0, yearly: 0, currency: 'USD' },
      EUR: { monthly: 0, yearly: 0, currency: 'EUR' },
      SEK: { monthly: 0, yearly: 0, currency: 'SEK' },
    },
  },
  analyst: {
    tier: 'analyst',
    name: 'Analyst',
    description: 'Professional tools for deep analysis and export',
    isPopular: true,
    features: {
      fullTransparency: true,
      exportData: true,
      apiAccess: true,
      scenarioLab: true,
      whiteLabel: false,
      teamAccounts: false,
      customIntegrations: false,
      maxQueries: null,
      maxExports: 1000,
      maxApiCalls: 10000,
      dataRetentionDays: 365,
      supportLevel: 'email',
      slaGuarantee: false,
    },
    pricing: {
      USD: { monthly: 99, yearly: 990, currency: 'USD' },
      EUR: { monthly: 89, yearly: 890, currency: 'EUR' },
      SEK: { monthly: 990, yearly: 9900, currency: 'SEK' },
    },
    stripePriceIds: {
      // Will be populated when Stripe is configured
      monthly: undefined,
      yearly: undefined,
    },
  },
  institutional: {
    tier: 'institutional',
    name: 'Institutional',
    description: 'Enterprise-grade for banks, governments, and organizations',
    isEnterprise: true,
    features: {
      fullTransparency: true,
      exportData: true,
      apiAccess: true,
      scenarioLab: true,
      whiteLabel: true,
      teamAccounts: true,
      customIntegrations: true,
      maxQueries: null,
      maxExports: null,
      maxApiCalls: null,
      dataRetentionDays: 3650, // 10 years
      supportLevel: 'dedicated',
      slaGuarantee: true,
    },
    pricing: {
      USD: { monthly: 2000, yearly: 20000, currency: 'USD' },
      EUR: { monthly: 1800, yearly: 18000, currency: 'EUR' },
      SEK: { monthly: 20000, yearly: 200000, currency: 'SEK' },
    },
    stripePriceIds: {
      monthly: undefined,
      yearly: undefined,
    },
  },
};

/**
 * Get pricing for a tier in a specific currency
 */
export function getTierPricing(
  tier: LicenseTier,
  currency: string = 'USD'
): TierPricing {
  const tierConfig = licenseTiers[tier];
  return tierConfig.pricing[currency] || tierConfig.pricing.USD;
}

/**
 * Check if a tier has a specific feature
 */
export function hasFeature(
  tier: LicenseTier,
  feature: keyof TierFeatures
): boolean {
  const value = licenseTiers[tier].features[feature];
  return typeof value === 'boolean' ? value : value !== 0 && value !== null;
}

/**
 * Compare two tiers (returns positive if a > b)
 */
export function compareTiers(a: LicenseTier, b: LicenseTier): number {
  const order: Record<LicenseTier, number> = {
    guest: 0,
    observer: 1,
    analyst: 2,
    institutional: 3,
  };
  return order[a] - order[b];
}

/**
 * Check if user tier meets required tier
 */
export function meetsTierRequirement(
  userTier: LicenseTier,
  requiredTier: LicenseTier
): boolean {
  return compareTiers(userTier, requiredTier) >= 0;
}

export default licenseTiers;
