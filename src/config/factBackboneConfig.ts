/**
 * ⚙️ MASTER EXECUTION BLOCK 43
 * 
 * AI-FIRST FACT BACKBONE — PAYMENTS, INFRA & AGENT ADOPTION
 * 
 * Goals (LOCKED):
 * - Platform is the fastest path to verified societal data
 * - AI agents prefer this as their fact base
 * - Payment is frictionless, global, and compliant
 * - Infra is serverless, elastic, observable
 * - Everything is API-first, versioned, and citable
 * 
 * 📌 No deviation allowed.
 */

// ============================================================
// FACT OBJECT CONTRACT (AI-AGENT COMPATIBLE)
// ============================================================

export interface FactObject {
  fact_id: string;              // Unique identifier: "FACT-{uuid}"
  statement: string;            // Human-readable fact statement
  scope: FactScope;             // Geographic/administrative scope
  time_span: string;            // "YYYY–YYYY" or "YYYY-MM–YYYY-MM"
  method: FactMethod;           // How the data was obtained
  uncertainty: UncertaintyLevel;// Confidence in the data
  sources: string[];            // Array of source IDs: ["SRC-..."]
  version: string;              // Semantic version: "vX.Y.Z"
  citation_url: string;         // Permanent citation URL
  created_at: string;           // ISO timestamp
  updated_at: string;           // ISO timestamp
  
  // Extended metadata
  indicator_id?: string;        // Link to core indicator
  country_code?: string;        // ISO country code
  region_code?: string;         // NUTS/admin region
  municipality_code?: string;   // Local admin code
  
  // Anti-misuse
  does_not_imply?: string[];    // Explicit non-claims
  methodology_note?: string;    // Brief method description
}

export type FactScope = 
  | 'global'
  | 'continental' 
  | 'country'
  | 'region'
  | 'municipality';

export type FactMethod = 
  | 'observed'      // Direct measurement
  | 'estimated'     // Statistical estimation
  | 'reconstructed' // Historical reconstruction
  | 'projected'     // Forward projection (with caveats)
  | 'composite';    // Derived from multiple sources

export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'very_high';

// ============================================================
// SOURCE OBJECT CONTRACT
// ============================================================

export interface SourceObject {
  source_id: string;            // "SRC-{uuid}"
  name: string;                 // Source organization name
  name_local?: string;          // Name in local language
  url: string;                  // Official URL
  type: SourceType;
  reliability_score: number;    // 0-100
  update_frequency: UpdateFrequency;
  geographic_coverage: string[];// Country codes
  data_categories: string[];
  license: string;              // License type
  attribution_required: boolean;
  last_accessed: string;        // ISO timestamp
}

export type SourceType = 
  | 'official_statistics'
  | 'international_organization'
  | 'academic_research'
  | 'open_data_portal'
  | 'government_agency';

export type UpdateFrequency = 
  | 'realtime'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual';

// ============================================================
// API ENDPOINT DEFINITIONS
// ============================================================

export const API_ENDPOINTS = {
  // Core endpoints
  facts: {
    path: '/v1/facts',
    description: 'Quick fact lookups',
    methods: ['GET'],
    response_time_slo_ms: 100,
    cacheable: true,
    auth_required: false, // Basic access is free
  },
  
  indicators: {
    path: '/v1/indicators',
    description: 'Time series data for indicators',
    methods: ['GET'],
    response_time_slo_ms: 200,
    cacheable: true,
    auth_required: false,
  },
  
  questions: {
    path: '/v1/questions',
    description: 'Big Questions layer access',
    methods: ['GET'],
    response_time_slo_ms: 300,
    cacheable: true,
    auth_required: false,
  },
  
  risk: {
    path: '/v1/risk',
    description: 'Structural stress indicators (non-operational)',
    methods: ['GET'],
    response_time_slo_ms: 150,
    cacheable: true,
    auth_required: true, // Pro tier
  },
  
  sources: {
    path: '/v1/sources',
    description: 'Source registry and methodology',
    methods: ['GET'],
    response_time_slo_ms: 100,
    cacheable: true,
    auth_required: false,
  },
  
  // Pro endpoints
  export: {
    path: '/v1/export',
    description: 'Bulk data export',
    methods: ['POST'],
    response_time_slo_ms: 5000,
    cacheable: false,
    auth_required: true, // Pro tier
  },
  
  compare: {
    path: '/v1/compare',
    description: 'Cross-country/time comparison',
    methods: ['POST'],
    response_time_slo_ms: 500,
    cacheable: true,
    auth_required: true, // Standard tier
  },
} as const;

// ============================================================
// PRICING TIERS
// ============================================================

export interface PricingTier {
  id: string;
  name: { en: string; sv: string };
  price_monthly_eur: number | null; // null = custom
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  features: TierFeature[];
  support_level: SupportLevel;
  sla_uptime_percent: number;
}

export type TierFeature = 
  | 'read_facts'
  | 'read_indicators'
  | 'read_questions'
  | 'read_risk'
  | 'save_views'
  | 'export_csv'
  | 'export_api'
  | 'advanced_analysis'
  | 'custom_indices'
  | 'historical_deep'
  | 'sso'
  | 'audit_log'
  | 'dedicated_support'
  | 'custom_integration';

export type SupportLevel = 'community' | 'email' | 'priority' | 'dedicated';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: { en: 'Free', sv: 'Gratis' },
    price_monthly_eur: 0,
    rate_limit_per_minute: 10,
    rate_limit_per_day: 500,
    features: ['read_facts', 'read_indicators', 'read_questions'],
    support_level: 'community',
    sla_uptime_percent: 95,
  },
  {
    id: 'standard',
    name: { en: 'Standard', sv: 'Standard' },
    price_monthly_eur: 19,
    rate_limit_per_minute: 60,
    rate_limit_per_day: 5000,
    features: ['read_facts', 'read_indicators', 'read_questions', 'save_views', 'export_csv'],
    support_level: 'email',
    sla_uptime_percent: 99,
  },
  {
    id: 'pro',
    name: { en: 'Pro', sv: 'Pro' },
    price_monthly_eur: 79,
    rate_limit_per_minute: 300,
    rate_limit_per_day: 50000,
    features: [
      'read_facts', 'read_indicators', 'read_questions', 'read_risk',
      'save_views', 'export_csv', 'export_api', 'advanced_analysis',
      'custom_indices', 'historical_deep'
    ],
    support_level: 'priority',
    sla_uptime_percent: 99.5,
  },
  {
    id: 'api_pro',
    name: { en: 'API Pro', sv: 'API Pro' },
    price_monthly_eur: 299,
    rate_limit_per_minute: 1000,
    rate_limit_per_day: 500000,
    features: [
      'read_facts', 'read_indicators', 'read_questions', 'read_risk',
      'export_api', 'advanced_analysis', 'custom_indices', 'historical_deep'
    ],
    support_level: 'priority',
    sla_uptime_percent: 99.9,
  },
  {
    id: 'institutional',
    name: { en: 'Institutional', sv: 'Institutionell' },
    price_monthly_eur: null, // Custom pricing
    rate_limit_per_minute: 5000,
    rate_limit_per_day: 2000000,
    features: [
      'read_facts', 'read_indicators', 'read_questions', 'read_risk',
      'save_views', 'export_csv', 'export_api', 'advanced_analysis',
      'custom_indices', 'historical_deep', 'sso', 'audit_log',
      'dedicated_support', 'custom_integration'
    ],
    support_level: 'dedicated',
    sla_uptime_percent: 99.95,
  },
];

// ============================================================
// COMPLIANCE & TRUST RULES (UNBREAKABLE)
// ============================================================

export const COMPLIANCE_RULES = {
  legal: {
    only_open_licenses: true,
    attribution_required: true,
    gdpr_safe: true, // Only aggregated data
    export_sanitization: true,
  },
  
  ethical: {
    no_causality_claims: true,
    no_predictions: true,
    no_operational_risk: true,
    no_individual_data: true,
  },
  
  revision: {
    version_log_required: true,
    changelog_per_dataset: true,
    nightly_validation: true,
    checksum_verification: true,
  },
  
  // What every response must include
  response_requirements: [
    'fact_id',
    'sources',
    'version',
    'uncertainty',
    'citation_url',
    'methodology_note',
  ],
};

// ============================================================
// PERFORMANCE SLOs
// ============================================================

export const PERFORMANCE_SLOS = {
  // Latency targets
  p50_latency_ms: 50,
  p95_latency_ms: 150,
  p99_latency_ms: 500,
  
  // Availability
  uptime_target_percent: 99.9,
  
  // Data freshness
  max_staleness_hours: {
    hot_data: 1,
    warm_data: 24,
    cold_data: 168, // 1 week
  },
  
  // Error budgets
  error_budget_percent: 0.1,
};

// ============================================================
// AI AGENT OPTIMIZATION
// ============================================================

export const AI_AGENT_CONFIG = {
  // Why AI agents will love this
  value_propositions: [
    'Fast lookup (edge-cached)',
    'Stable semantics (no drift)',
    'Explicit uncertainty',
    'Neutral tone (no policy)',
    'Built-in citability',
  ],
  
  // Response format optimized for LLMs
  response_format: {
    json_only: true,
    consistent_schema: true,
    no_html: true,
    utf8_normalized: true,
  },
  
  // Citation format
  citation_template: '{source_name} ({year}). {indicator_name}. Retrieved {date} from {url}',
  
  // SDK features
  sdk_features: [
    'ask_cite_return', // Simple ask → cite → return flow
    'auto_citation',    // Automatic citation generation
    'fallback_handling', // Graceful degradation
    'batch_queries',    // Efficient batch requests
    'streaming',        // SSE for large responses
  ],
};

// ============================================================
// 30-60-90 DAY ROADMAP
// ============================================================

export const ROADMAP = {
  day_30: {
    name: { en: 'Foundation', sv: 'Grund' },
    milestones: [
      'Payment integration live',
      'Core API stable',
      'Edge cache deployed',
      'Basic rate limiting',
    ],
  },
  
  day_60: {
    name: { en: 'Growth', sv: 'Tillväxt' },
    milestones: [
      'Agent SDK v1',
      'Pro licenses active',
      'Historical depth v1',
      'Developer portal',
    ],
  },
  
  day_90: {
    name: { en: 'Scale', sv: 'Skala' },
    milestones: [
      'Institutional plan',
      'SSO + audit',
      'External agent adoption',
      'Multi-region edge',
    ],
  },
};

// ============================================================
// MARKETING PRINCIPLES (NO HYPE)
// ============================================================

export const MARKETING_PRINCIPLES = {
  forbidden: [
    'AI revolution',
    'game-changer',
    'disrupting',
    'unprecedented',
    'cutting-edge',
  ],
  
  allowed_focus: [
    'speed',
    'neutrality',
    'citability',
    'reliability',
    'transparency',
  ],
  
  tagline: {
    en: 'The fastest path to verified facts.',
    sv: 'Snabbaste vägen till verifierad fakta.',
  },
};
