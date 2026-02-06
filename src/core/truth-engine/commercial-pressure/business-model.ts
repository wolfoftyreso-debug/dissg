/**
 * THE ONLY ALLOWED BUSINESS MODEL
 * 
 * STEG 27: SELL ACCESS, NOT INFLUENCE
 * 
 * The oracle sells access to data.
 * The oracle never sells influence over data.
 */

/**
 * ALLOWED COMMERCIAL ACTIVITIES
 */
export const ALLOWED_ACTIVITIES = {
  api_licenses: {
    description: 'Access to query the oracle',
    allowed: true,
    variants: ['Per-query', 'Monthly subscription', 'Enterprise agreement'],
  },
  
  volume_pricing: {
    description: 'Tiered pricing based on usage',
    allowed: true,
    variants: ['Query count', 'Data volume', 'Concurrent connections'],
  },
  
  sla_guarantees: {
    description: 'Uptime and response time commitments',
    allowed: true,
    variants: ['99.9% uptime', 'Sub-100ms response', '24/7 support'],
  },
  
  latency_tiers: {
    description: 'Faster access for higher tiers',
    allowed: true,
    variants: ['Standard', 'Priority', 'Real-time'],
  },
  
  export_formats: {
    description: 'Different output formats',
    allowed: true,
    variants: ['JSON', 'CSV', 'Parquet', 'API streaming'],
  },
  
  historical_access: {
    description: 'Access to historical data',
    allowed: true,
    variants: ['30 days', '1 year', 'Full archive'],
  },
} as const;

/**
 * FORBIDDEN COMMERCIAL ACTIVITIES
 */
export const FORBIDDEN_ACTIVITIES = {
  exclusive_data: {
    description: 'Data only available to one customer',
    forbidden: true,
    reason: 'Destroys universality',
  },
  
  custom_answers: {
    description: 'Tailored responses for specific customers',
    forbidden: true,
    reason: 'Creates multiple truths',
  },
  
  private_definitions: {
    description: 'Customer-specific semantic definitions',
    forbidden: true,
    reason: 'Fragments the standard',
  },
  
  industry_versions: {
    description: 'Sector-specific oracle variants',
    forbidden: true,
    reason: 'Creates parallel standards',
  },
  
  white_label_core: {
    description: 'Rebranding of core oracle',
    forbidden: true,
    reason: 'Obscures provenance',
  },
  
  editorial_influence: {
    description: 'Customer input on what oracle says',
    forbidden: true,
    reason: 'Destroys independence',
  },
  
  preferential_timing: {
    description: 'Early access to new data',
    forbidden: true,
    reason: 'Creates information asymmetry',
  },
} as const;

/**
 * THE CORE PRINCIPLE
 */
export const CORE_PRINCIPLE = {
  statement: 'The core is always the same for everyone',
  
  implications: [
    'Same schema for all',
    'Same definitions for all',
    'Same latency class gets same speed',
    'Same data for same queries',
    'No customer sees different truth',
  ],
  
  exceptions: 'None',
} as const;

/**
 * PRICING PHILOSOPHY
 */
export const PRICING_PHILOSOPHY = {
  what_you_pay_for: [
    'Access speed',
    'Query volume',
    'Support level',
    'Historical depth',
    'Export options',
  ],
  
  what_you_never_pay_for: [
    'Different answers',
    'Early information',
    'Influence over content',
    'Exclusivity',
    'Customization of core',
  ],
  
  principle: 'Price differentiates access, not truth',
} as const;

/**
 * LICENSE TIERS (EXAMPLE STRUCTURE)
 */
export const LICENSE_TIERS = {
  observer: {
    name: 'Observer',
    price: 'Free',
    access: 'Read-only, rate-limited',
    support: 'Community',
    sla: 'Best effort',
    data_for_tier: 'Same as all tiers',
  },
  
  professional: {
    name: 'Professional',
    price: '€99-€299/month',
    access: 'Higher rate limits, API access',
    support: 'Email',
    sla: '99.5% uptime',
    data_for_tier: 'Same as all tiers',
  },
  
  institutional: {
    name: 'Institutional',
    price: '€2,000-€20,000/month',
    access: 'Unlimited, priority',
    support: 'Dedicated',
    sla: '99.9% uptime',
    data_for_tier: 'Same as all tiers',
  },
  
  note: 'All tiers see the same truth. Only access parameters differ.',
} as const;
