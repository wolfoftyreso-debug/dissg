/**
 * MONETIZATION CORE
 * 
 * "AI-agenter betalar inte för data. De betalar för riskreduktion."
 * "Sanningen är alltid fri. Infrastrukturen är det man betalar för."
 */

// Configuration
export {
  MONETIZATION_PRINCIPLES,
  TIER_DEFINITIONS,
  AI_PRICING_MODEL,
  LOCK_IN_MECHANISMS,
  UPSELL_TRIGGERS,
  REVENUE_MODEL,
  MONETIZATION_PHILOSOPHY,
  type MonetizationTier,
  type TierDefinition,
  type AIPricingModel,
} from '@/config/monetizationArchitecture';

// Tier Access Control
export {
  hasFeatureAccess,
  getRateLimit,
  checkRateLimit,
  getHistoricalDepth,
  getBatchLimit,
  getUpsellMessage,
  getRequiredTierForFeature,
  compareTiers,
  isHigherTier,
  getNextTier,
  getTierPricing,
  formatPrice,
  hasSLA,
  getSLA,
  type AccessFeature,
} from './tierAccess';

// Usage Tracking
export {
  UsageManager,
  usageManager,
  calculateBilling,
  type UsageRecord,
  type UsageCheck,
  type BillingEstimate,
} from './usageTracking';

// ============================================
// QUICK ACCESS FUNCTIONS
// ============================================

import { MonetizationTier, TIER_DEFINITIONS } from '@/config/monetizationArchitecture';
import { hasFeatureAccess, AccessFeature, formatPrice } from './tierAccess';
import { usageManager } from './usageTracking';

/**
 * Check if a user can perform an action
 */
export function canPerform(
  userId: string,
  tier: MonetizationTier,
  action: 'resolve' | 'batch' | 'export' | 'historical'
): { allowed: boolean; reason?: string; upsell?: string } {
  // Check feature access
  const featureMap: Record<string, AccessFeature> = {
    export: 'dataset_export',
    historical: 'historical_comparison',
    methodology: 'methodology',
    revision_log: 'revision_log',
  };
  
  if (action in featureMap) {
    const feature = featureMap[action];
    if (!hasFeatureAccess(tier, feature)) {
      return {
        allowed: false,
        reason: `${action} requires ${getRequiredTierForFeature(feature)} tier`,
        upsell: `Upgrade to access ${action}`,
      };
    }
  }
  
  // Check rate limits
  const usageCheck = usageManager.checkRequest(userId, tier);
  if (!usageCheck.allowed) {
    return {
      allowed: false,
      reason: usageCheck.reason,
      upsell: usageCheck.upsell,
    };
  }
  
  return { allowed: true };
}

function getRequiredTierForFeature(feature: AccessFeature): MonetizationTier {
  const tiers: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
  for (const tier of tiers) {
    if (hasFeatureAccess(tier, feature)) return tier;
  }
  return 'enterprise';
}

/**
 * Get tier info for display
 */
export function getTierInfo(tier: MonetizationTier): {
  name: string;
  price: string;
  features: string[];
  target: string[];
} {
  const def = TIER_DEFINITIONS[tier];
  
  const features: string[] = [];
  if (def.access.canonical_answer === 'full') features.push('Full answers');
  if (def.access.numerical_summary) features.push('Numerical summaries');
  if (def.access.historical_comparison) features.push('Historical data');
  if (def.access.revision_log) features.push('Revision logs');
  if (def.access.dataset_export) features.push('Dataset export');
  if (def.sla) features.push(`${def.sla.uptime} SLA`);
  
  return {
    name: def.name,
    price: formatPrice(tier),
    features,
    target: def.target_audience,
  };
}

/**
 * Compare all tiers
 */
export function getAllTierComparison(): Array<{
  tier: MonetizationTier;
  name: string;
  price: string;
  rateLimit: string;
  historicalDepth: string;
  key_features: string[];
}> {
  const tiers: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
  
  return tiers.map(tier => {
    const def = TIER_DEFINITIONS[tier];
    const info = getTierInfo(tier);
    
    return {
      tier,
      name: def.name,
      price: info.price,
      rateLimit: def.limits.rate_limit_per_day > 0 
        ? `${def.limits.rate_limit_per_day}/day`
        : 'Unlimited',
      historicalDepth: def.limits.historical_depth_years > 0
        ? `${def.limits.historical_depth_years} years`
        : def.limits.historical_depth_years === -1 
          ? 'Full history'
          : 'Current only',
      key_features: info.features.slice(0, 3),
    };
  });
}
