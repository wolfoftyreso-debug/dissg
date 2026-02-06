/**
 * KEY SCALING METRICS
 * 
 * "Ni mäter inte sidvisningar, MAU, eller likes.
 * Ni mäter infrastruktur-dominans."
 * 
 * These are the ONLY metrics that matter.
 */

// ============================================
// WHAT WE DON'T MEASURE (VANITY METRICS)
// ============================================

export const VANITY_METRICS = {
  explicitly_not_measured: [
    'page_views',
    'monthly_active_users',
    'likes',
    'shares',
    'time_on_site',
    'bounce_rate',
    'newsletter_signups',
    'social_followers',
  ],
  
  reason: 'These measure attention, not infrastructure adoption',
};

// ============================================
// CORE METRICS (THE ONLY ONES THAT MATTER)
// ============================================

export interface CoreMetric {
  code: string;
  name: string;
  description: string;
  calculation: string;
  target_phase_0: number;
  target_phase_1: number;
  target_phase_2: number;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better';
}

export const CORE_METRICS: CoreMetric[] = [
  {
    code: 'ARR',
    name: 'Agent Reuse Rate',
    description: 'Percentage of AI agents that query us more than once per day',
    calculation: 'agents_with_multiple_daily_queries / total_active_agents',
    target_phase_0: 0.40,
    target_phase_1: 0.65,
    target_phase_2: 0.80,
    unit: 'ratio',
    direction: 'higher_is_better',
  },
  {
    code: 'DCR',
    name: 'Direct Citation Rate',
    description: 'Percentage of our answers that get cited in downstream content',
    calculation: 'cited_answers / total_answers_served',
    target_phase_0: 0.20,
    target_phase_1: 0.40,
    target_phase_2: 0.60,
    unit: 'ratio',
    direction: 'higher_is_better',
  },
  {
    code: 'RSF',
    name: 'Resolve Success Without Fallback',
    description: 'Percentage of resolve requests answered without needing fallback',
    calculation: 'successful_resolves / total_resolve_requests',
    target_phase_0: 0.70,
    target_phase_1: 0.85,
    target_phase_2: 0.95,
    unit: 'ratio',
    direction: 'higher_is_better',
  },
  {
    code: 'TSM',
    name: 'Trust Score Mean',
    description: 'Average trust score across all served answers',
    calculation: 'sum(trust_scores) / count(answers)',
    target_phase_0: 0.85,
    target_phase_1: 0.88,
    target_phase_2: 0.92,
    unit: 'score',
    direction: 'higher_is_better',
  },
  {
    code: 'QIP',
    name: 'Question ID Propagation',
    description: 'Number of external systems storing our question IDs',
    calculation: 'count(distinct_external_systems_with_our_ids)',
    target_phase_0: 50,
    target_phase_1: 500,
    target_phase_2: 5000,
    unit: 'count',
    direction: 'higher_is_better',
  },
  {
    code: 'MCQ',
    name: 'Marginal Cost per Question',
    description: 'Cost to add one new question to the system',
    calculation: 'operational_cost_delta / new_questions_added',
    target_phase_0: 100, // SEK
    target_phase_1: 10,
    target_phase_2: 1,
    unit: 'SEK',
    direction: 'lower_is_better',
  },
  {
    code: 'ZHI',
    name: 'Zero Human Intervention Rate',
    description: 'Percentage of updates requiring no human touch',
    calculation: 'automated_updates / total_updates',
    target_phase_0: 0.50,
    target_phase_1: 0.85,
    target_phase_2: 0.98,
    unit: 'ratio',
    direction: 'higher_is_better',
  },
];

// ============================================
// METRIC TRACKING
// ============================================

export interface MetricSnapshot {
  metric_code: string;
  value: number;
  timestamp: string;
  phase: 0 | 1 | 2;
  on_target: boolean;
}

export function evaluateMetric(
  metric: CoreMetric,
  currentValue: number,
  currentPhase: 0 | 1 | 2
): { on_target: boolean; gap: number; status: 'ahead' | 'on_track' | 'behind' } {
  const target = 
    currentPhase === 0 ? metric.target_phase_0 :
    currentPhase === 1 ? metric.target_phase_1 :
    metric.target_phase_2;
  
  const gap = metric.direction === 'higher_is_better'
    ? target - currentValue
    : currentValue - target;
  
  const on_target = gap <= 0;
  
  let status: 'ahead' | 'on_track' | 'behind';
  if (gap < 0) {
    status = 'ahead';
  } else if (gap < target * 0.1) {
    status = 'on_track';
  } else {
    status = 'behind';
  }
  
  return { on_target, gap, status };
}

// ============================================
// DASHBOARD DATA
// ============================================

export interface ScalingDashboard {
  current_phase: 0 | 1 | 2;
  total_questions: number;
  metrics: Record<string, MetricSnapshot>;
  health: 'healthy' | 'warning' | 'critical';
  next_milestone: string;
}

export function calculateDashboardHealth(
  metrics: MetricSnapshot[]
): 'healthy' | 'warning' | 'critical' {
  const offTrack = metrics.filter(m => !m.on_target).length;
  const total = metrics.length;
  
  if (offTrack === 0) return 'healthy';
  if (offTrack / total < 0.3) return 'warning';
  return 'critical';
}

// ============================================
// SUCCESS DEFINITION
// ============================================

export const SUCCESS_DEFINITION = {
  when_these_are_high: [
    'AgentReuseRate',
    'DirectCitationRate',
    'ResolveSuccessWithoutFallback',
    'TrustScoreMean',
    'QuestionIDPropagation',
  ],
  
  then: 'You have won – regardless of whether anyone knows your name',
  
  explanation: 'Infrastructure dominance is measured by dependency, not visibility',
};
