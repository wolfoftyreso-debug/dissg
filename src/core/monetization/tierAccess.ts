/**
 * TIER ACCESS CONTROL
 * 
 * Determines what each tier can access.
 * "Samma data för alla. Betalning = djup, volym, bekvämlighet."
 */

import { 
  MonetizationTier, 
  TIER_DEFINITIONS,
  UPSELL_TRIGGERS,
} from '@/config/monetizationArchitecture';

// ============================================
// ACCESS CHECK FUNCTIONS
// ============================================

export type AccessFeature = 
  | 'canonical_answer_full'
  | 'source_urls'
  | 'numerical_summary'
  | 'historical_comparison'
  | 'key_points'
  | 'methodology'
  | 'revision_log'
  | 'dataset_export'
  | 'custom_ingest'
  | 'air_gapped_delivery'
  | 'legal_guarantees';

/**
 * Check if a tier has access to a specific feature
 */
export function hasFeatureAccess(
  tier: MonetizationTier,
  feature: AccessFeature
): boolean {
  const tierDef = TIER_DEFINITIONS[tier];
  if (!tierDef) return false;
  
  const accessMap: Record<AccessFeature, keyof typeof tierDef.access> = {
    canonical_answer_full: 'canonical_answer',
    source_urls: 'source_urls',
    numerical_summary: 'numerical_summary',
    historical_comparison: 'historical_comparison',
    key_points: 'key_points',
    methodology: 'methodology',
    revision_log: 'revision_log',
    dataset_export: 'dataset_export',
    custom_ingest: 'custom_ingest',
    air_gapped_delivery: 'air_gapped_delivery',
    legal_guarantees: 'legal_guarantees',
  };
  
  const accessKey = accessMap[feature];
  if (accessKey === 'canonical_answer') {
    return tierDef.access.canonical_answer === 'full';
  }
  
  return tierDef.access[accessKey] === true;
}

/**
 * Get rate limit for a tier
 */
export function getRateLimit(tier: MonetizationTier): {
  per_minute: number;
  per_day: number;
} {
  const tierDef = TIER_DEFINITIONS[tier];
  return {
    per_minute: tierDef.limits.rate_limit_per_minute,
    per_day: tierDef.limits.rate_limit_per_day,
  };
}

/**
 * Check if rate limit allows request
 */
export function checkRateLimit(
  tier: MonetizationTier,
  requestsThisMinute: number,
  requestsToday: number
): { allowed: boolean; reason?: string; upsell?: string } {
  const limits = getRateLimit(tier);
  
  if (requestsThisMinute >= limits.per_minute) {
    const upsell = getUpsellMessage(tier, 'rate_limit_hit');
    return {
      allowed: false,
      reason: `Rate limit exceeded: ${limits.per_minute} requests per minute`,
      upsell,
    };
  }
  
  if (limits.per_day > 0 && requestsToday >= limits.per_day) {
    const upsell = getUpsellMessage(tier, 'rate_limit_hit');
    return {
      allowed: false,
      reason: `Daily limit exceeded: ${limits.per_day} requests per day`,
      upsell,
    };
  }
  
  return { allowed: true };
}

/**
 * Get historical depth limit
 */
export function getHistoricalDepth(tier: MonetizationTier): number {
  return TIER_DEFINITIONS[tier].limits.historical_depth_years;
}

/**
 * Get batch size limit
 */
export function getBatchLimit(tier: MonetizationTier): number {
  return TIER_DEFINITIONS[tier].limits.max_batch_size;
}

// ============================================
// UPSELL LOGIC (FRICTION-FREE)
// ============================================

type UpsellTrigger = 
  | 'rate_limit_hit'
  | 'historical_access_blocked'
  | 'methodology_requested'
  | 'batch_limit_hit'
  | 'revision_log_requested'
  | 'sla_required'
  | 'dataset_export_requested'
  | 'custom_ingest_needed'
  | 'air_gap_required';

/**
 * Get upsell message for a trigger
 */
export function getUpsellMessage(
  currentTier: MonetizationTier,
  trigger: UpsellTrigger
): string | undefined {
  // Determine target tier
  let targetTier: 'to_pro' | 'to_agent' | 'to_enterprise';
  
  if (currentTier === 'public') {
    targetTier = 'to_pro';
  } else if (currentTier === 'pro') {
    targetTier = 'to_agent';
  } else if (currentTier === 'agent') {
    targetTier = 'to_enterprise';
  } else {
    return undefined; // Already at highest tier
  }
  
  const triggers = UPSELL_TRIGGERS[targetTier];
  const match = triggers.find(t => t.trigger === trigger);
  return match?.message;
}

/**
 * Get required tier for a feature
 */
export function getRequiredTierForFeature(feature: AccessFeature): MonetizationTier {
  const tierOrder: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
  
  for (const tier of tierOrder) {
    if (hasFeatureAccess(tier, feature)) {
      return tier;
    }
  }
  
  return 'enterprise'; // Default to highest
}

// ============================================
// TIER COMPARISON
// ============================================

export function compareTiers(
  tierA: MonetizationTier,
  tierB: MonetizationTier
): -1 | 0 | 1 {
  const order: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
  const indexA = order.indexOf(tierA);
  const indexB = order.indexOf(tierB);
  
  if (indexA < indexB) return -1;
  if (indexA > indexB) return 1;
  return 0;
}

export function isHigherTier(
  tier: MonetizationTier,
  thanTier: MonetizationTier
): boolean {
  return compareTiers(tier, thanTier) > 0;
}

export function getNextTier(tier: MonetizationTier): MonetizationTier | null {
  const order: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
  const index = order.indexOf(tier);
  return index < order.length - 1 ? order[index + 1] : null;
}

// ============================================
// PRICING HELPERS
// ============================================

export function getTierPricing(tier: MonetizationTier): {
  model: string;
  basePrice: number;
  unit: string;
  range?: [number, number];
} {
  const tierDef = TIER_DEFINITIONS[tier];
  return {
    model: tierDef.pricing.model,
    basePrice: tierDef.pricing.base_price_eur,
    unit: tierDef.pricing.unit,
    range: tierDef.pricing.price_range_eur,
  };
}

export function formatPrice(tier: MonetizationTier): string {
  const pricing = getTierPricing(tier);
  
  if (pricing.model === 'free') {
    return 'Free';
  }
  
  if (pricing.range) {
    return `€${pricing.range[0]} – €${pricing.range[1]} ${pricing.unit}`;
  }
  
  return `€${pricing.basePrice} ${pricing.unit}`;
}

// ============================================
// SLA ACCESS
// ============================================

export function hasSLA(tier: MonetizationTier): boolean {
  return TIER_DEFINITIONS[tier].sla !== undefined;
}

export function getSLA(tier: MonetizationTier): {
  uptime: string;
  response_time_p95: string;
  support_response: string;
} | null {
  return TIER_DEFINITIONS[tier].sla ?? null;
}
