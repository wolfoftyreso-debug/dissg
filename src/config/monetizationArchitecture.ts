/**
 * MONETIZATION ARCHITECTURE
 * 
 * "AI-agenter betalar inte för data. De betalar för riskreduktion."
 * "Sanningen är alltid fri. Infrastrukturen är det man betalar för."
 */

// ============================================
// ABSOLUTE PRINCIPLES (NEVER VIOLATE)
// ============================================

export const MONETIZATION_PRINCIPLES = {
  // What we NEVER do
  forbidden: [
    'paywall_on_basic_answers',      // ❌ Ingen paywall på grundsvar
    'advertising',                    // ❌ Ingen reklam
    'sponsorship',                    // ❌ Ingen sponsring
    'featured_content',               // ❌ Ingen "featured content"
    'opinion_content',                // ❌ Inga åsikter att sälja
    'per_user_pricing_for_agents',    // ❌ AI accepterar inte per-användare
    'per_view_pricing',               // ❌ AI accepterar inte per-vy
    'per_session_pricing',            // ❌ AI accepterar inte per-session
  ],
  
  // What we ALWAYS do
  required: [
    'same_data_for_all',              // ✅ Samma data för alla
    'same_truth_for_all',             // ✅ Samma sanning för alla
    'payment_for_depth',              // ✅ Betalning = djup
    'payment_for_volume',             // ✅ Betalning = volym
    'payment_for_convenience',        // ✅ Betalning = bekvämlighet
    'transparent_pricing',            // ✅ Tydlig prissättning
    'no_dark_patterns',               // ✅ Inga dark patterns
  ],
  
  // Why this matters
  rationale: {
    ai_trust: 'AI-agenter fortsätter lita på er',
    legal_approval: 'Jurister godkänner er som neutral part',
    upstream_potential: 'Ni kan bli upstream till myndigheter',
  },
} as const;

// ============================================
// TIER DEFINITIONS (4 LEVELS)
// ============================================

export type MonetizationTier = 'public' | 'pro' | 'agent' | 'enterprise';

export interface TierDefinition {
  id: MonetizationTier;
  name: string;
  name_sv: string;
  target_audience: string[];
  goal: string;
  
  // What's included
  access: {
    canonical_answer: 'short' | 'full';
    trust_score: boolean;
    source_organization: boolean;
    source_urls: boolean;
    numerical_summary: boolean;
    historical_comparison: boolean;
    key_points: boolean;
    methodology: boolean;
    revision_log: boolean;
    dataset_export: boolean;
    custom_ingest: boolean;
    air_gapped_delivery: boolean;
    legal_guarantees: boolean;
  };
  
  // Limits
  limits: {
    rate_limit_per_minute: number;
    rate_limit_per_day: number;
    historical_depth_years: number;
    max_batch_size: number;
  };
  
  // Pricing
  pricing: {
    model: 'free' | 'per_agent_month' | 'per_million_resolves' | 'annual_license';
    base_price_eur: number;
    price_range_eur?: [number, number];
    unit: string;
  };
  
  // SLA
  sla?: {
    uptime: string;
    response_time_p95: string;
    support_response: string;
  };
}

export const TIER_DEFINITIONS: Record<MonetizationTier, TierDefinition> = {
  // 🟢 TIER 0 – PUBLIC / FREE
  public: {
    id: 'public',
    name: 'Public',
    name_sv: 'Publik',
    target_audience: ['general_public', 'students', 'small_projects'],
    goal: 'Dominans, indexering, adoption. Marknadsföring via användning.',
    
    access: {
      canonical_answer: 'short',
      trust_score: true,
      source_organization: true,
      source_urls: false,
      numerical_summary: false,
      historical_comparison: false,
      key_points: false,
      methodology: false,
      revision_log: false,
      dataset_export: false,
      custom_ingest: false,
      air_gapped_delivery: false,
      legal_guarantees: false,
    },
    
    limits: {
      rate_limit_per_minute: 5,
      rate_limit_per_day: 100,
      historical_depth_years: 0,
      max_batch_size: 1,
    },
    
    pricing: {
      model: 'free',
      base_price_eur: 0,
      unit: 'forever',
    },
  },
  
  // 🔵 TIER 1 – PRO
  pro: {
    id: 'pro',
    name: 'Pro',
    name_sv: 'Pro',
    target_audience: ['journalists', 'analysts', 'researchers', 'small_teams'],
    goal: 'Individer och småteam som behöver professionellt djup.',
    
    access: {
      canonical_answer: 'full',
      trust_score: true,
      source_organization: true,
      source_urls: true,
      numerical_summary: true,
      historical_comparison: true, // aggregated
      key_points: true,
      methodology: true,
      revision_log: false,
      dataset_export: false,
      custom_ingest: false,
      air_gapped_delivery: false,
      legal_guarantees: false,
    },
    
    limits: {
      rate_limit_per_minute: 30,
      rate_limit_per_day: 1000,
      historical_depth_years: 10,
      max_batch_size: 10,
    },
    
    pricing: {
      model: 'per_agent_month',
      base_price_eur: 99,
      price_range_eur: [49, 149],
      unit: 'per agent per month',
    },
  },
  
  // 🟣 TIER 2 – AGENT (AI SYSTEMS)
  agent: {
    id: 'agent',
    name: 'Agent',
    name_sv: 'Agent',
    target_audience: ['ai_companies', 'saas_platforms', 'analysis_platforms'],
    goal: 'AI-system och analysplattformar. Här börjar infrastrukturaffären.',
    
    access: {
      canonical_answer: 'full',
      trust_score: true,
      source_organization: true,
      source_urls: true,
      numerical_summary: true,
      historical_comparison: true,
      key_points: true,
      methodology: true,
      revision_log: true,
      dataset_export: false,
      custom_ingest: false,
      air_gapped_delivery: false,
      legal_guarantees: true,
    },
    
    limits: {
      rate_limit_per_minute: 500,
      rate_limit_per_day: 50000,
      historical_depth_years: 30,
      max_batch_size: 100,
    },
    
    pricing: {
      model: 'per_million_resolves',
      base_price_eur: 2000,
      price_range_eur: [1000, 10000],
      unit: 'per month per agent type',
    },
    
    sla: {
      uptime: '99.9%',
      response_time_p95: '200ms',
      support_response: '24h',
    },
  },
  
  // 🔴 TIER 3 – ENTERPRISE / GOVERNMENT
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    name_sv: 'Enterprise',
    target_audience: [
      'governments',
      'banks',
      'insurance_companies',
      'big_tech',
      'international_organizations',
      'world_bank',
      'bloomberg',
    ],
    goal: 'Myndigheter, banker, Big Tech. Här sitter 6-7 siffriga avtal.',
    
    access: {
      canonical_answer: 'full',
      trust_score: true,
      source_organization: true,
      source_urls: true,
      numerical_summary: true,
      historical_comparison: true,
      key_points: true,
      methodology: true,
      revision_log: true,
      dataset_export: true, // Parquet / Arrow
      custom_ingest: true,
      air_gapped_delivery: true,
      legal_guarantees: true,
    },
    
    limits: {
      rate_limit_per_minute: 2000,
      rate_limit_per_day: -1, // Unlimited
      historical_depth_years: -1, // Full history
      max_batch_size: 10000,
    },
    
    pricing: {
      model: 'annual_license',
      base_price_eur: 250000,
      price_range_eur: [100000, 2000000],
      unit: 'per year',
    },
    
    sla: {
      uptime: '99.99%',
      response_time_p95: '100ms',
      support_response: '4h',
    },
  },
};

// ============================================
// AI-NATIVE PRICING MODEL
// ============================================

export interface AIPricingModel {
  unit: 'resolve' | 'dataset' | 'risk_class';
  cost_per_unit: number;
  currency: 'EUR';
  guarantees: string[];
  
  // What AI systems care about
  ai_compatible: {
    deterministic: true;
    schema_stable: true;
    version_pinned: true;
    no_opinion: true;
  };
}

export const AI_PRICING_MODEL: AIPricingModel = {
  unit: 'resolve',
  cost_per_unit: 0.00012, // €0.12 per 1000 resolves
  currency: 'EUR',
  guarantees: [
    'schema_stability',
    'no_opinion',
    'versioned_answers',
    'revision_logged',
    'source_traceable',
  ],
  
  ai_compatible: {
    deterministic: true,
    schema_stable: true,
    version_pinned: true,
    no_opinion: true,
  },
};

// ============================================
// LOCK-IN MECHANISMS (ETHICAL)
// ============================================

export const LOCK_IN_MECHANISMS = {
  // After 6-12 months, customers have:
  customer_dependencies: [
    'question_id_stored_in_systems',     // Deras system lagrar era question_id
    'models_calibrated_to_answers',       // Deras modeller kalibrerade mot era svar
    'legal_approval_of_provenance',       // Jurister har godkänt er provenance
    'documentation_references_ids',       // Dokumentation refererar era ID:n
    'audit_trails_include_sources',       // Revisionsloggar inkluderar era källor
  ],
  
  // Cost of switching:
  switching_costs: [
    'code_rewrite',                       // Omskrivning av kod
    'new_legal_review',                   // Ny juridisk granskning
    'new_risk_model',                     // Ny riskmodell
    'retraining_models',                  // Omträning av AI-modeller
    'documentation_update',               // Uppdatering av dokumentation
    'audit_trail_migration',              // Migrering av revisionsloggar
  ],
  
  // Result:
  strategic_position: 'dependency_not_vendor', // "Ni är inte en leverantör. Ni är ett beroende."
};

// ============================================
// FRICTION-FREE UPSELL
// ============================================

export const UPSELL_TRIGGERS = {
  // Natural triggers (no marketing, no dark patterns)
  to_pro: [
    { trigger: 'rate_limit_hit', message: 'Need more requests? Upgrade to Pro.' },
    { trigger: 'historical_access_blocked', message: 'Need historical depth? Pro includes 10 years.' },
    { trigger: 'methodology_requested', message: 'Full methodology available in Pro.' },
  ],
  
  to_agent: [
    { trigger: 'batch_limit_hit', message: 'Need bulk access? Agent tier supports 100 per batch.' },
    { trigger: 'revision_log_requested', message: 'Machine-readable provenance available in Agent tier.' },
    { trigger: 'sla_required', message: 'Need guaranteed uptime? Agent tier includes SLA.' },
  ],
  
  to_enterprise: [
    { trigger: 'dataset_export_requested', message: 'Raw dataset export available in Enterprise.' },
    { trigger: 'custom_ingest_needed', message: 'Custom data ingest available in Enterprise.' },
    { trigger: 'air_gap_required', message: 'Air-gapped delivery available in Enterprise.' },
  ],
  
  // Principle
  principle: 'No irritation. No dark pattern. Limitation feels reasonable.',
};

// ============================================
// REVENUE PROJECTIONS (REALISTIC)
// ============================================

export const REVENUE_MODEL = {
  // Conservative estimates at scale
  projections: {
    pro: {
      users: 5000,
      avg_price_eur: 99,
      annual_revenue_eur: 5940000, // ~6M€
    },
    agent: {
      agents: 300,
      avg_price_eur: 2000,
      annual_revenue_eur: 7200000, // ~7.2M€
    },
    enterprise: {
      contracts: 20,
      avg_price_eur: 250000,
      annual_revenue_eur: 5000000, // ~5M€
    },
  },
  
  total_annual_eur: 18140000, // ~18M€
  
  // What we DON'T need
  not_required: [
    'advertising',
    'content_team',
    'opinion_risk',
    'editorial_staff',
    'influencer_marketing',
  ],
};

// ============================================
// THE CORE MESSAGE
// ============================================

export const MONETIZATION_PHILOSOPHY = {
  what_we_sell: [
    'access',           // Tillgång
    'stability',        // Stabilitet
    'machine_readability', // Maskinläsbarhet
    'liability_freedom', // Ansvarsfrihet
  ],
  
  what_we_never_sell: [
    'truth',            // Sanningen är alltid fri
    'opinions',         // Vi har inga åsikter
    'predictions',      // Vi spår inte
    'recommendations',  // Vi rekommenderar aldrig
  ],
  
  core_message: 'Sanningen är alltid fri. Infrastrukturen är det man betalar för.',
};
