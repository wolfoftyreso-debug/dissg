/**
 * LICENSING MODEL
 * 
 * Truth is free. Convenience costs.
 */

/**
 * LICENSE TIERS
 */
export const LICENSE_TIERS = {
  /**
   * FREE TIER (Everyone)
   */
  FREE: {
    tier: 'free',
    name: 'Public Access',
    price: 0,
    
    includes: [
      'Read-only Truth Nodes',
      'All indexes (current + historical)',
      'Decision context data',
      'Full API access (rate limited)',
      'Uncertainty envelopes',
      'Complete provenance',
    ],
    
    rate_limit: {
      requests_per_minute: 60,
      requests_per_day: 10000,
    },
    
    restrictions: [
      'No SLA',
      'No priority support',
      'Standard latency',
    ],
    
    truth_locked: false, // NEVER
  },

  /**
   * PROFESSIONAL TIER
   */
  PROFESSIONAL: {
    tier: 'professional',
    name: 'Professional',
    price_monthly_eur: 99,
    
    includes: [
      'Everything in Free',
      'Higher rate limits',
      'Precomputed views',
      'Faster response times',
      'Email support',
    ],
    
    rate_limit: {
      requests_per_minute: 300,
      requests_per_day: 100000,
    },
    
    sla: {
      uptime: 0.99,
      response_time_p95_ms: 500,
    },
    
    truth_locked: false,
  },

  /**
   * ENTERPRISE TIER
   */
  ENTERPRISE: {
    tier: 'enterprise',
    name: 'Enterprise',
    price_monthly_eur: 999,
    
    includes: [
      'Everything in Professional',
      'Dedicated infrastructure',
      'Private mirrors',
      'Custom SDK builds',
      'Agent SLA guarantees',
      'Priority support',
      'Onboarding assistance',
    ],
    
    rate_limit: {
      requests_per_minute: 1000,
      requests_per_day: 1000000,
    },
    
    sla: {
      uptime: 0.999,
      response_time_p95_ms: 200,
    },
    
    truth_locked: false,
  },

  /**
   * INSTITUTIONAL TIER
   */
  INSTITUTIONAL: {
    tier: 'institutional',
    name: 'Institutional',
    price: 'custom',
    
    includes: [
      'Everything in Enterprise',
      'On-premise deployment option',
      'Custom data pipelines',
      'Dedicated account manager',
      'Governance participation rights',
      'Early access to new domains',
    ],
    
    rate_limit: 'unlimited',
    
    sla: {
      uptime: 0.9999,
      response_time_p95_ms: 100,
    },
    
    truth_locked: false,
  },
} as const;

/**
 * LICENSING PRINCIPLES
 */
export const LICENSING_PRINCIPLES = {
  /**
   * TRUTH IS NEVER LOCKED
   */
  truth_never_locked: {
    rule: 'Access to truth cannot be gated by payment',
    enforcement: 'All tiers include full read access to all truth nodes',
    rationale: 'Truth is public infrastructure',
  },

  /**
   * CONVENIENCE IS COMMERCIAL
   */
  convenience_commercial: {
    rule: 'Speed, support, and SLA are commercial products',
    what_costs: [
      'Lower latency',
      'Higher throughput',
      'Precomputed aggregations',
      'Dedicated support',
      'Custom integrations',
    ],
    what_is_free: [
      'Truth nodes',
      'Indexes',
      'Uncertainty data',
      'Historical data',
      'API access',
    ],
  },

  /**
   * NO EXCLUSIVITY
   */
  no_exclusivity: {
    rule: 'No customer can have exclusive access to any data',
    enforcement: 'Contracts cannot include exclusivity clauses',
    rationale: 'Truth belongs to everyone',
  },

  /**
   * REVENUE TRANSPARENCY
   */
  revenue_transparency: {
    rule: 'Revenue sources are public',
    published: [
      'Total revenue per tier',
      'Customer count per tier',
      'Revenue by category',
    ],
    not_published: [
      'Individual customer identities',
      'Specific contract terms',
    ],
  },
} as const;

/**
 * PREMIUM FEATURES (Never content-locked)
 */
export const PREMIUM_FEATURES = {
  precomputed_views: {
    description: 'Pre-calculated aggregations for faster access',
    free_alternative: 'Calculate from raw data',
    value: 'Speed, not access',
  },
  
  higher_frequency: {
    description: 'More frequent data updates',
    free_alternative: 'Standard update frequency',
    value: 'Freshness, not access',
  },
  
  agent_sla: {
    description: 'Guaranteed response times for AI agents',
    free_alternative: 'Best-effort response times',
    value: 'Reliability, not access',
  },
  
  enterprise_sdk: {
    description: 'Additional SDK features and support',
    free_alternative: 'Standard SDK (full functionality)',
    value: 'Convenience, not access',
  },
  
  private_mirrors: {
    description: 'Dedicated infrastructure copies',
    free_alternative: 'Shared infrastructure',
    value: 'Isolation, not access',
  },
} as const;

/**
 * LICENSE VALIDATION
 */
export function validateLicenseModel(): {
  valid: boolean;
  truth_accessible_at_all_tiers: boolean;
  no_content_lock: boolean;
} {
  const allTiers = Object.values(LICENSE_TIERS);
  
  return {
    valid: allTiers.every(tier => tier.truth_locked === false),
    truth_accessible_at_all_tiers: true,
    no_content_lock: allTiers.every(tier => 
      'includes' in tier && 
      (tier.includes as readonly string[]).some(i => i.includes('Truth Nodes'))
    ),
  };
}

/**
 * LICENSING STATEMENT
 */
export const LICENSING_STATEMENT = `
Truth is free. Convenience costs.

Every user, regardless of payment, has full access to:
• All truth nodes
• All indexes (current and historical)  
• All uncertainty data
• Complete provenance chains

Premium tiers provide:
• Faster response times
• Higher rate limits
• Dedicated support
• Custom integrations

We never lock truth behind a paywall.
`.trim();
