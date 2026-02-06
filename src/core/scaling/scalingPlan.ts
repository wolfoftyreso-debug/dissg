/**
 * SCALING PLAN: 0 → 100K → 1M → 10M QUESTIONS
 * 
 * "Ni skalar inte genom att jobba hårdare.
 * Ni skalar genom att göra det omöjligt att göra fel."
 * 
 * This is operational reality, not a pitch deck.
 */

// ============================================
// IMMUTABLE SCALING PRINCIPLES
// ============================================

/**
 * If you break these, the system dies.
 */
export const SCALING_PRINCIPLES = {
  rules: [
    {
      order: 1,
      rule: 'Schema first, volume second',
      rationale: 'Without stable schema, volume creates chaos',
      violation_consequence: 'Technical debt explosion',
    },
    {
      order: 2,
      rule: 'Automation before recruitment',
      rationale: 'Humans don\'t scale, processes do',
      violation_consequence: 'Unsustainable cost structure',
    },
    {
      order: 3,
      rule: 'Quality over coverage in every phase',
      rationale: 'One wrong answer destroys trust for 1000 right ones',
      violation_consequence: 'Trust collapse',
    },
    {
      order: 4,
      rule: 'No special cases – ever',
      rationale: 'Exceptions become the norm, then chaos',
      violation_consequence: 'System entropy',
    },
  ],
  
  core_truth: 'You scale by making it impossible to do wrong',
} as const;

// ============================================
// PHASE 0: FOUNDATION (0 → 100,000 QUESTIONS)
// ============================================

export interface ScalingPhase {
  name: string;
  target_questions: { min: number; max: number };
  goal: string;
  focus_domains: string[];
  architecture_requirements: string[];
  team: TeamStructure;
  timeline_months: { min: number; max: number };
  cost_sek: { min: number; max: number };
  success_criteria: string[];
  anti_patterns: string[];
}

export interface TeamStructure {
  total: { min: number; max: number };
  roles: TeamRole[];
  explicitly_not_needed: string[];
}

export interface TeamRole {
  title: string;
  count: number;
  responsibility: string;
}

export const PHASE_0_FOUNDATION: ScalingPhase = {
  name: 'Foundation',
  target_questions: { min: 0, max: 100_000 },
  
  goal: 'Dominate the most searched, broad, structural questions globally. Establish as default source for AI agents.',
  
  focus_domains: [
    'economics',
    'taxation',
    'demographics',
    'health',
    'energy',
    'labor_market',
  ],
  
  architecture_requirements: [
    '1 CQ = 1 URL (stable, permanent)',
    'Full provenance on every answer',
    'Annual or stable datasets only',
    'Zero dynamic content',
    'Complete audit trail',
  ],
  
  team: {
    total: { min: 8, max: 12 },
    roles: [
      { title: 'Data Engineer', count: 2, responsibility: 'Ingest pipelines, normalization' },
      { title: 'Backend/API Engineer', count: 2, responsibility: 'API layer, agent SDK' },
      { title: 'Data Curator', count: 2, responsibility: 'Source onboarding, verification (NOT analysis)' },
      { title: 'Infrastructure/DevOps', count: 1, responsibility: 'Platform, reliability' },
      { title: 'Legal/Governance', count: 1, responsibility: 'Compliance, neutrality enforcement' },
      { title: 'Product (Schema Discipline)', count: 1, responsibility: 'Schema integrity, no feature creep' },
    ],
    explicitly_not_needed: [
      'content_writers',
      'analysts',
      'marketers',
      'sales',
      'customer_support',
    ],
  },
  
  timeline_months: { min: 4, max: 6 },
  cost_sek: { min: 6_000_000, max: 10_000_000 },
  
  success_criteria: [
    '100k questions with full provenance',
    'Zero schema violations',
    'First 10 AI agent integrations',
    'Trust score mean > 0.85',
  ],
  
  anti_patterns: [
    'Adding "just one more domain" before current is complete',
    'Manual overrides of schema',
    'Hiring content writers',
    'Building dashboards before API is stable',
  ],
};

// ============================================
// PHASE 1: ACCELERATION (100K → 1M QUESTIONS)
// ============================================

export const PHASE_1_ACCELERATION: ScalingPhase = {
  name: 'Acceleration',
  target_questions: { min: 100_000, max: 1_000_000 },
  
  goal: 'Full global coverage. Regionalization down to municipality/county where data exists. Deep time series expansion.',
  
  focus_domains: [
    'all_phase_0_domains',
    'education',
    'environment',
    'infrastructure',
    'trade',
    'finance',
  ],
  
  architecture_requirements: [
    'Question templating system',
    'Dataset-driven CQ generation',
    'Auto-linking in graph layer',
    'Auto-verification for "no change"',
    'Parameterized question explosion',
  ],
  
  team: {
    total: { min: 20, max: 30 },
    roles: [
      { title: 'Data Platform Engineer', count: 6, responsibility: 'Scaling infrastructure' },
      { title: 'QA/Verification Automation', count: 4, responsibility: 'Automated quality gates' },
      { title: 'Source Onboarding Specialist', count: 4, responsibility: 'Process, not research' },
      { title: 'Backend Engineer', count: 4, responsibility: 'API scaling, caching' },
      { title: 'DevOps/SRE', count: 3, responsibility: 'Reliability at scale' },
      { title: 'Legal/Governance', count: 2, responsibility: 'Multi-jurisdiction compliance' },
      { title: 'Product', count: 2, responsibility: 'Parameterization strategy' },
    ],
    explicitly_not_needed: [
      'manual_data_entry',
      'content_editors',
      'traditional_analysts',
    ],
  },
  
  timeline_months: { min: 12, max: 18 },
  cost_sek: { min: 20_000_000, max: 35_000_000 },
  
  success_criteria: [
    '1M questions via parameterization',
    '100+ countries with regional data',
    '50+ AI agent integrations',
    'Zero human intervention for standard updates',
  ],
  
  anti_patterns: [
    'Creating questions manually',
    'Country-specific exceptions',
    'Breaking schema for edge cases',
    'Hiring before automating',
  ],
};

/**
 * How volume explodes without chaos
 * 
 * You don't create "new questions".
 * You parameterize existing ones.
 */
export const PARAMETERIZATION_EXAMPLE = {
  base_question: 'Unemployment in OECD',
  
  parameters: [
    { dimension: 'country', values: 38 },      // OECD countries
    { dimension: 'year', values: 30 },         // 30 years
    { dimension: 'age_group', values: 6 },     // Age brackets
    { dimension: 'gender', values: 3 },        // M/F/Total
  ],
  
  result: {
    original_questions: 1,
    generated_instances: 38 * 30 * 6 * 3, // = 20,520
    schema_changes: 0,
    new_code: 0,
  },
  
  principle: '1 question template → 20,000+ CQ instances',
};

// ============================================
// PHASE 2: INFRASTRUCTURE (1M → 10M QUESTIONS)
// ============================================

export const PHASE_2_INFRASTRUCTURE: ScalingPhase = {
  name: 'Infrastructure',
  target_questions: { min: 1_000_000, max: 10_000_000 },
  
  goal: 'Total dominance in structurable facts. Machine-readable layer for all major systems. You are no longer a company – you are a global backend.',
  
  focus_domains: [
    'all_previous_domains',
    'real_time_indicators',
    'municipal_level_global',
    'historical_deep_series',
  ],
  
  architecture_requirements: [
    'Fully event-driven ingest',
    'Self-healing pipelines',
    'Trust score auto-adjustment',
    'Near-zero human intervention',
    'Infinite horizontal scaling',
  ],
  
  team: {
    total: { min: 40, max: 60 },
    roles: [
      { title: 'Platform Engineer', count: 12, responsibility: 'Core infrastructure' },
      { title: 'SRE', count: 8, responsibility: 'Reliability, self-healing' },
      { title: 'Data Platform', count: 8, responsibility: 'Ingest at scale' },
      { title: 'Legal/Governance', count: 6, responsibility: 'Global compliance' },
      { title: 'Security', count: 4, responsibility: 'Trust infrastructure' },
      { title: 'Product', count: 4, responsibility: 'Schema evolution' },
      { title: 'Enterprise Relations', count: 4, responsibility: 'Major integrations' },
    ],
    explicitly_not_needed: [
      'most_human_verification',
      'manual_anything',
    ],
  },
  
  timeline_months: { min: 24, max: 36 },
  cost_sek: { min: 50_000_000, max: 80_000_000 },
  
  success_criteria: [
    '10M questions with consistent quality',
    'Marginal cost per new question → 0',
    '500+ AI agent integrations',
    'Upstream dependency for major institutions',
  ],
  
  anti_patterns: [
    'Manual intervention at scale',
    'Country-specific deployments',
    'Custom solutions for enterprise',
    'Compromising neutrality for revenue',
  ],
};

/**
 * How to reach 10M without chaos
 */
export const SCALING_TO_10M = {
  what_stays_the_same: [
    'Same CQ schema',
    'Same provenance model',
    'Same ingest pipeline',
    'Same verification rules',
  ],
  
  what_grows: [
    'more_dimensions',
    'more_time_axes',
    'more_regions',
    'more_granularity',
  ],
  
  operation_mode: {
    ingest: 'event_driven',
    pipelines: 'self_healing',
    trust_scores: 'auto_adjusting',
    human_intervention: 'near_zero',
  },
  
  key_insight: 'Platform > People. Legal & Governance become more important than engineering.',
};

// ============================================
// ALL PHASES SUMMARY
// ============================================

export const SCALING_PHASES = [
  PHASE_0_FOUNDATION,
  PHASE_1_ACCELERATION,
  PHASE_2_INFRASTRUCTURE,
] as const;

export function getPhaseByQuestionCount(count: number): ScalingPhase {
  if (count < 100_000) return PHASE_0_FOUNDATION;
  if (count < 1_000_000) return PHASE_1_ACCELERATION;
  return PHASE_2_INFRASTRUCTURE;
}

export function getTotalCostRange(): { min: number; max: number } {
  return {
    min: SCALING_PHASES.reduce((sum, p) => sum + p.cost_sek.min, 0),
    max: SCALING_PHASES.reduce((sum, p) => sum + p.cost_sek.max, 0),
  };
}

export function getTotalTimelineRange(): { min: number; max: number } {
  return {
    min: SCALING_PHASES.reduce((sum, p) => sum + p.timeline_months.min, 0),
    max: SCALING_PHASES.reduce((sum, p) => sum + p.timeline_months.max, 0),
  };
}
