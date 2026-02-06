/**
 * VISIBILITY SIGNALS
 * 
 * STEG 19: DE 6 KÄRNSIGNALERNA
 * 
 * Varje fråga får ett Visibility Score baserat på
 * strukturella signaler – inte klick, CTR eller engagement.
 */

/**
 * SIGNAL 1: AGENT DEMAND
 * Hur ofta AI-agenter resolverar denna fråga
 */
export interface AgentDemandSignal {
  readonly signal_type: 'agent_demand';
  readonly total_resolutions: number;
  readonly unique_agents: number;
  readonly resolution_frequency: 'very_high' | 'high' | 'medium' | 'low' | 'dormant';
  readonly trend: 'accelerating' | 'stable' | 'declining';
  readonly last_resolution: string | null;
  
  // Agent type breakdown
  readonly by_agent_type: {
    readonly finance: number;
    readonly policy: number;
    readonly journalism: number;
    readonly research: number;
    readonly general: number;
    readonly machine: number;
  };
}

/**
 * SIGNAL 2: SEARCH DEMAND
 * Extern efterfrågan från sökmotorer
 */
export interface SearchDemandSignal {
  readonly signal_type: 'search_demand';
  readonly estimated_monthly_volume: number;
  readonly long_tail_variants: number;
  readonly recurring_pattern: boolean;
  readonly trend: 'rising' | 'stable' | 'falling';
  readonly seasonality: 'none' | 'quarterly' | 'annual' | 'event_driven';
  
  // Source breakdown
  readonly by_source: {
    readonly google: number;
    readonly bing: number;
    readonly perplexity: number;
    readonly other_ai: number;
  };
}

/**
 * SIGNAL 3: STABILITY
 * Hur stabil är frågan över tid?
 */
export interface StabilitySignal {
  readonly signal_type: 'stability';
  readonly years_unchanged: number;
  readonly revision_count: number;
  readonly last_revision: string | null;
  readonly stability_class: 'permanent' | 'very_stable' | 'stable' | 'volatile' | 'experimental';
  
  // What caused instability
  readonly revision_causes: ('methodology_change' | 'source_update' | 'definition_change' | 'error_correction')[];
}

/**
 * SIGNAL 4: RISK LEVEL
 * Hur lätt är frågan att feltolka?
 */
export interface RiskSignal {
  readonly signal_type: 'risk';
  readonly misinterpretation_risk: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
  readonly requires_context: boolean;
  readonly sensitive_domains: string[];
  readonly exposure_limit: 'unrestricted' | 'limited' | 'restricted' | 'suppressed';
  
  // Risk factors
  readonly risk_factors: {
    readonly political_sensitivity: number;  // 0-1
    readonly statistical_complexity: number; // 0-1
    readonly causal_confusion_risk: number;  // 0-1
    readonly cherry_picking_risk: number;    // 0-1
  };
}

/**
 * SIGNAL 5: COVERAGE COMPLETENESS
 * Hur komplett är datatäckningen?
 */
export interface CoverageSignal {
  readonly signal_type: 'coverage';
  readonly geographic_coverage: number;      // 0-1
  readonly temporal_coverage_years: number;
  readonly data_freshness_days: number;
  readonly source_count: number;
  readonly completeness_class: 'comprehensive' | 'good' | 'partial' | 'sparse' | 'experimental';
  
  // Coverage details
  readonly coverage_gaps: string[];
  readonly strongest_regions: string[];
  readonly weakest_regions: string[];
}

/**
 * SIGNAL 6: TEMPORAL RELEVANCE
 * Är frågan just nu särskilt relevant?
 */
export interface TemporalRelevanceSignal {
  readonly signal_type: 'temporal_relevance';
  readonly current_relevance: number;        // 0-1
  readonly baseline_relevance: number;       // 0-1
  readonly boost_active: boolean;
  readonly boost_reason: string | null;
  readonly boost_expires: string | null;
  
  // What's driving relevance
  readonly relevance_drivers: {
    readonly election_cycle: boolean;
    readonly crisis_situation: boolean;
    readonly policy_change: boolean;
    readonly demographic_shift: boolean;
    readonly media_attention: boolean;
  };
}

/**
 * Combined Signal Package for a Question
 */
export interface QuestionSignalPackage {
  readonly question_id: string;
  readonly signals_updated_at: string;
  readonly agent_demand: AgentDemandSignal;
  readonly search_demand: SearchDemandSignal;
  readonly stability: StabilitySignal;
  readonly risk: RiskSignal;
  readonly coverage: CoverageSignal;
  readonly temporal_relevance: TemporalRelevanceSignal;
}

/**
 * SIGNAL WEIGHTS
 * How much each signal contributes to visibility
 */
export const SIGNAL_WEIGHTS = {
  agent_demand: 0.25,        // AI agents are primary
  search_demand: 0.20,       // Search volume matters
  stability: 0.20,           // Stable = trustworthy
  risk: 0.15,                // Risk limits exposure
  coverage: 0.10,            // Completeness boosts
  temporal_relevance: 0.10,  // Temporary boosts
} as const;

/**
 * Calculate individual signal scores (0-1)
 */
export function calculateAgentDemandScore(signal: AgentDemandSignal): number {
  const frequencyScores: Record<AgentDemandSignal['resolution_frequency'], number> = {
    very_high: 1.0,
    high: 0.8,
    medium: 0.5,
    low: 0.2,
    dormant: 0.0,
  };
  
  const trendModifiers: Record<AgentDemandSignal['trend'], number> = {
    accelerating: 1.2,
    stable: 1.0,
    declining: 0.8,
  };
  
  let score = frequencyScores[signal.resolution_frequency];
  score *= trendModifiers[signal.trend];
  
  // Agent diversity bonus
  if (signal.unique_agents > 5) score *= 1.1;
  
  return Math.min(1.0, score);
}

export function calculateSearchDemandScore(signal: SearchDemandSignal): number {
  // Log scale for volume
  const volumeScore = Math.min(1.0, Math.log10(signal.estimated_monthly_volume + 1) / 6);
  
  const trendModifiers: Record<SearchDemandSignal['trend'], number> = {
    rising: 1.2,
    stable: 1.0,
    falling: 0.8,
  };
  
  let score = volumeScore * trendModifiers[signal.trend];
  
  // Long-tail bonus
  if (signal.long_tail_variants > 10) score *= 1.1;
  
  return Math.min(1.0, score);
}

export function calculateStabilityScore(signal: StabilitySignal): number {
  const classScores: Record<StabilitySignal['stability_class'], number> = {
    permanent: 1.0,
    very_stable: 0.9,
    stable: 0.7,
    volatile: 0.3,
    experimental: 0.1,
  };
  
  let score = classScores[signal.stability_class];
  
  // Years bonus
  if (signal.years_unchanged >= 10) score *= 1.1;
  else if (signal.years_unchanged >= 5) score *= 1.05;
  
  // Revision penalty
  if (signal.revision_count > 5) score *= 0.9;
  
  return Math.min(1.0, score);
}

export function calculateRiskScore(signal: RiskSignal): number {
  // Inverted: low risk = high score
  const riskScores: Record<RiskSignal['misinterpretation_risk'], number> = {
    minimal: 1.0,
    low: 0.85,
    moderate: 0.6,
    high: 0.3,
    critical: 0.1,
  };
  
  let score = riskScores[signal.misinterpretation_risk];
  
  // Context penalty
  if (signal.requires_context) score *= 0.95;
  
  // Sensitive domains penalty
  if (signal.sensitive_domains.length > 0) {
    score *= (1 - signal.sensitive_domains.length * 0.05);
  }
  
  return Math.max(0, Math.min(1.0, score));
}

export function calculateCoverageScore(signal: CoverageSignal): number {
  const classScores: Record<CoverageSignal['completeness_class'], number> = {
    comprehensive: 1.0,
    good: 0.8,
    partial: 0.5,
    sparse: 0.2,
    experimental: 0.05,
  };
  
  let score = classScores[signal.completeness_class];
  
  // Geographic coverage bonus
  score *= (0.5 + signal.geographic_coverage * 0.5);
  
  // Freshness bonus/penalty
  if (signal.data_freshness_days < 30) score *= 1.1;
  else if (signal.data_freshness_days > 365) score *= 0.9;
  
  // Source diversity bonus
  if (signal.source_count >= 3) score *= 1.05;
  
  return Math.min(1.0, score);
}

export function calculateTemporalRelevanceScore(signal: TemporalRelevanceSignal): number {
  let score = signal.baseline_relevance;
  
  if (signal.boost_active) {
    // Apply temporal boost
    score = signal.current_relevance;
  }
  
  // Driver bonuses
  const drivers = signal.relevance_drivers;
  if (drivers.election_cycle) score *= 1.15;
  if (drivers.crisis_situation) score *= 1.2;
  if (drivers.policy_change) score *= 1.1;
  
  return Math.min(1.0, score);
}

/**
 * Calculate composite visibility score
 */
export function calculateVisibilityScore(signals: QuestionSignalPackage): number {
  const scores = {
    agent_demand: calculateAgentDemandScore(signals.agent_demand),
    search_demand: calculateSearchDemandScore(signals.search_demand),
    stability: calculateStabilityScore(signals.stability),
    risk: calculateRiskScore(signals.risk),
    coverage: calculateCoverageScore(signals.coverage),
    temporal_relevance: calculateTemporalRelevanceScore(signals.temporal_relevance),
  };
  
  let weightedSum = 0;
  for (const [key, weight] of Object.entries(SIGNAL_WEIGHTS)) {
    weightedSum += scores[key as keyof typeof scores] * weight;
  }
  
  return Math.round(weightedSum * 100) / 100;
}

/**
 * SIGNAL PRINCIPLES
 */
export const SIGNAL_PRINCIPLES = {
  no_clicks: true,
  no_ctr: true,
  no_engagement_metrics: true,
  only_structural_signals: true,
  agent_demand_primary: true,
  risk_limits_exposure: true,
} as const;
