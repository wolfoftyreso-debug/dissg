/**
 * VISIBILITY ENGINE
 * 
 * STEG 19: RANKING & VISIBILITY ENGINE
 * 
 * Avgör vilka frågor som syns för vem och när.
 * AI-agenter först, sökmotorer sen, människor sist.
 */

import type { 
  QuestionSignalPackage,
} from './visibility-signals';
import { 
  calculateVisibilityScore,
} from './visibility-signals';

/**
 * VISIBILITY STATE
 * What state is a question in?
 */
export type VisibilityState = 
  | 'active'          // Full exposure
  | 'limited'         // Reduced exposure
  | 'dormant'         // Exists but not exposed
  | 'latent'          // Variant exists, suppressed
  | 'agent_only'      // Only for AI agents
  | 'suppressed';     // Blocked from exposure

/**
 * EXPOSURE TARGET
 */
export type ExposureTarget = 
  | 'google'
  | 'bing'
  | 'perplexity'
  | 'internal_agents'
  | 'external_agents'
  | 'human_ui';

/**
 * VISIBILITY PROFILE
 * Complete visibility configuration for a question
 */
export interface VisibilityProfile {
  readonly question_id: string;
  readonly canonical_question_id: string;
  
  // Core scores
  readonly visibility_score: number;        // 0-1
  readonly priority_rank: number;           // 1 = highest
  
  // State
  readonly state: VisibilityState;
  
  // Exposure rules
  readonly exposed_to: {
    readonly search_engines: boolean;
    readonly ai_agents: boolean;
    readonly human_ui: boolean;
  };
  
  // Specific targets
  readonly target_exposure: Record<ExposureTarget, boolean>;
  
  // Suppression
  readonly suppressed_variants: string[];
  readonly suppression_reason: string | null;
  
  // Routing
  readonly preferred_canonical_url: string;
  readonly alternative_urls: string[];
  
  // Metadata
  readonly calculated_at: string;
  readonly valid_until: string;
  readonly requires_refresh: boolean;
}

/**
 * VISIBILITY DECISION
 * What the engine decides for a question
 */
export interface VisibilityDecision {
  readonly question_id: string;
  readonly decision: 'expose' | 'limit' | 'suppress' | 'dormant';
  readonly targets: ExposureTarget[];
  readonly priority: number;
  readonly rationale: string;
  readonly overrides_applied: string[];
}

/**
 * PRIORITY ORDERING
 * AI agents first, search engines second, humans third
 */
export const PRIORITY_ORDER: ExposureTarget[] = [
  'internal_agents',
  'external_agents',
  'perplexity',
  'bing',
  'google',
  'human_ui',
];

/**
 * VISIBILITY ENGINE CLASS
 */
export class VisibilityEngine {
  private profiles: Map<string, VisibilityProfile> = new Map();
  private rankings: Map<string, number> = new Map();
  
  /**
   * Calculate visibility for a question
   */
  calculateVisibility(signals: QuestionSignalPackage): VisibilityProfile {
    const score = calculateVisibilityScore(signals);
    const state = this.determineState(signals, score);
    const exposure = this.determineExposure(signals, state);
    const targetExposure = this.determineTargetExposure(signals, state);
    
    const profile: VisibilityProfile = {
      question_id: signals.question_id,
      canonical_question_id: signals.question_id.split('-variant')[0],
      visibility_score: score,
      priority_rank: 0, // Will be set during ranking
      state,
      exposed_to: exposure,
      target_exposure: targetExposure,
      suppressed_variants: this.getSuppressedVariants(signals),
      suppression_reason: state === 'suppressed' ? this.getSuppressionReason(signals) : null,
      preferred_canonical_url: `/answers/${signals.question_id}`,
      alternative_urls: [],
      calculated_at: new Date().toISOString(),
      valid_until: this.calculateValidUntil(signals),
      requires_refresh: false,
    };
    
    this.profiles.set(signals.question_id, profile);
    return profile;
  }
  
  /**
   * Determine visibility state based on signals
   */
  private determineState(signals: QuestionSignalPackage, score: number): VisibilityState {
    // Critical risk = suppressed
    if (signals.risk.misinterpretation_risk === 'critical') {
      return 'suppressed';
    }
    
    // High risk = agent only
    if (signals.risk.misinterpretation_risk === 'high') {
      return 'agent_only';
    }
    
    // No agent demand and low search = dormant
    if (
      signals.agent_demand.resolution_frequency === 'dormant' &&
      signals.search_demand.estimated_monthly_volume < 10
    ) {
      return 'dormant';
    }
    
    // Variant of another question = latent
    if (signals.question_id.includes('-variant')) {
      return 'latent';
    }
    
    // Moderate risk or sparse coverage = limited
    if (
      signals.risk.misinterpretation_risk === 'moderate' ||
      signals.coverage.completeness_class === 'sparse'
    ) {
      return 'limited';
    }
    
    // Good score = active
    if (score >= 0.5) {
      return 'active';
    }
    
    return 'limited';
  }
  
  /**
   * Determine general exposure
   */
  private determineExposure(
    signals: QuestionSignalPackage, 
    state: VisibilityState
  ): VisibilityProfile['exposed_to'] {
    switch (state) {
      case 'active':
        return { search_engines: true, ai_agents: true, human_ui: true };
      case 'limited':
        return { search_engines: true, ai_agents: true, human_ui: false };
      case 'agent_only':
        return { search_engines: false, ai_agents: true, human_ui: false };
      case 'dormant':
      case 'latent':
        return { search_engines: false, ai_agents: true, human_ui: false };
      case 'suppressed':
        return { search_engines: false, ai_agents: false, human_ui: false };
    }
  }
  
  /**
   * Determine specific target exposure
   */
  private determineTargetExposure(
    signals: QuestionSignalPackage,
    state: VisibilityState
  ): Record<ExposureTarget, boolean> {
    const base: Record<ExposureTarget, boolean> = {
      google: false,
      bing: false,
      perplexity: false,
      internal_agents: false,
      external_agents: false,
      human_ui: false,
    };
    
    if (state === 'suppressed') return base;
    
    // AI agents always get access (already returned if suppressed)
    base.internal_agents = true;
    base.external_agents = state !== 'dormant';
    
    // Search engines based on state and signals
    if (state === 'active' || state === 'limited') {
      base.google = signals.search_demand.by_source.google > 0;
      base.bing = signals.search_demand.by_source.bing > 0;
      base.perplexity = signals.search_demand.by_source.perplexity > 0 || 
                        signals.agent_demand.by_agent_type.general > 0;
    }
    
    // Human UI only for active state
    if (state === 'active') {
      base.human_ui = true;
    }
    
    return base;
  }
  
  /**
   * Get suppressed variants for a question
   */
  private getSuppressedVariants(signals: QuestionSignalPackage): string[] {
    const suppressed: string[] = [];
    
    // Suppress normative phrasings
    if (signals.risk.risk_factors.political_sensitivity > 0.5) {
      suppressed.push('normative_phrasings');
    }
    
    // Suppress causal phrasings for correlation questions
    if (signals.risk.risk_factors.causal_confusion_risk > 0.7) {
      suppressed.push('causal_phrasings');
    }
    
    return suppressed;
  }
  
  /**
   * Get suppression reason
   */
  private getSuppressionReason(signals: QuestionSignalPackage): string {
    if (signals.risk.misinterpretation_risk === 'critical') {
      return 'Critical misinterpretation risk';
    }
    if (signals.risk.exposure_limit === 'suppressed' as const) {
      return 'Exposure limit set to suppressed';
    }
    return 'Multiple risk factors exceeded threshold';
  }
  
  /**
   * Calculate validity period
   */
  private calculateValidUntil(signals: QuestionSignalPackage): string {
    const now = new Date();
    let validityDays = 30; // Default
    
    // Stable questions have longer validity
    if (signals.stability.stability_class === 'permanent') {
      validityDays = 365;
    } else if (signals.stability.stability_class === 'very_stable') {
      validityDays = 180;
    } else if (signals.stability.stability_class === 'volatile') {
      validityDays = 7;
    }
    
    // Temporal boost shortens validity
    if (signals.temporal_relevance.boost_active) {
      validityDays = Math.min(validityDays, 7);
    }
    
    now.setDate(now.getDate() + validityDays);
    return now.toISOString();
  }
  
  /**
   * Rank all questions by visibility score
   */
  rankAll(): Map<string, number> {
    const profiles = Array.from(this.profiles.values());
    
    // Sort by visibility score descending
    profiles.sort((a, b) => b.visibility_score - a.visibility_score);
    
    // Assign ranks
    profiles.forEach((profile, index) => {
      this.rankings.set(profile.question_id, index + 1);
      // Update profile with rank
      const updated = { ...profile, priority_rank: index + 1 };
      this.profiles.set(profile.question_id, updated);
    });
    
    return this.rankings;
  }
  
  /**
   * Get top N questions for a specific target
   */
  getTopForTarget(target: ExposureTarget, limit: number = 100): VisibilityProfile[] {
    return Array.from(this.profiles.values())
      .filter(p => p.target_exposure[target])
      .sort((a, b) => a.priority_rank - b.priority_rank)
      .slice(0, limit);
  }
  
  /**
   * Make visibility decision for a question
   */
  decide(signals: QuestionSignalPackage): VisibilityDecision {
    const profile = this.calculateVisibility(signals);
    
    const targets = PRIORITY_ORDER.filter(t => profile.target_exposure[t]);
    
    let decision: VisibilityDecision['decision'];
    switch (profile.state) {
      case 'active':
        decision = 'expose';
        break;
      case 'limited':
      case 'agent_only':
        decision = 'limit';
        break;
      case 'dormant':
      case 'latent':
        decision = 'dormant';
        break;
      case 'suppressed':
        decision = 'suppress';
        break;
    }
    
    return {
      question_id: signals.question_id,
      decision,
      targets,
      priority: profile.priority_rank,
      rationale: this.generateRationale(signals, profile),
      overrides_applied: [],
    };
  }
  
  /**
   * Generate human-readable rationale
   */
  private generateRationale(
    signals: QuestionSignalPackage,
    profile: VisibilityProfile
  ): string {
    const parts: string[] = [];
    
    if (profile.visibility_score >= 0.8) {
      parts.push('High visibility score');
    }
    
    if (signals.agent_demand.resolution_frequency === 'very_high') {
      parts.push('Strong AI agent demand');
    }
    
    if (signals.stability.stability_class === 'permanent') {
      parts.push('Permanently stable answer');
    }
    
    if (signals.risk.misinterpretation_risk === 'minimal') {
      parts.push('Minimal misinterpretation risk');
    }
    
    if (signals.temporal_relevance.boost_active) {
      parts.push(`Temporal boost: ${signals.temporal_relevance.boost_reason}`);
    }
    
    return parts.join('; ') || 'Standard visibility rules applied';
  }
  
  /**
   * Get engine statistics
   */
  getStats(): VisibilityEngineStats {
    const profiles = Array.from(this.profiles.values());
    
    const byState: Record<VisibilityState, number> = {
      active: 0,
      limited: 0,
      dormant: 0,
      latent: 0,
      agent_only: 0,
      suppressed: 0,
    };
    
    const byTarget: Record<ExposureTarget, number> = {
      google: 0,
      bing: 0,
      perplexity: 0,
      internal_agents: 0,
      external_agents: 0,
      human_ui: 0,
    };
    
    for (const profile of profiles) {
      byState[profile.state]++;
      for (const [target, exposed] of Object.entries(profile.target_exposure)) {
        if (exposed) byTarget[target as ExposureTarget]++;
      }
    }
    
    const avgScore = profiles.length > 0
      ? profiles.reduce((sum, p) => sum + p.visibility_score, 0) / profiles.length
      : 0;
    
    return {
      total_questions: profiles.length,
      by_state: byState,
      by_target: byTarget,
      average_visibility_score: Math.round(avgScore * 100) / 100,
      active_percentage: profiles.length > 0 
        ? Math.round((byState.active / profiles.length) * 100)
        : 0,
    };
  }
}

/**
 * Visibility Engine Statistics
 */
export interface VisibilityEngineStats {
  readonly total_questions: number;
  readonly by_state: Record<VisibilityState, number>;
  readonly by_target: Record<ExposureTarget, number>;
  readonly average_visibility_score: number;
  readonly active_percentage: number;
}

/**
 * SILENCE AS STRATEGY
 * Not all questions should be visible
 */
export const SILENCE_STRATEGY = {
  dormant_questions: 'Exist but not exposed - potential future value',
  latent_variants: 'Semantic coverage without visibility',
  agent_only: 'Maximum precision without human confusion',
  suppressed: 'Protection of oracle integrity',
} as const;

/**
 * PRIORITY PRINCIPLES
 */
export const VISIBILITY_PRINCIPLES = {
  priority_order: ['ai_agents', 'search_engines', 'humans'] as const,
  
  rationale: {
    ai_agents_first: 'When AI agents trust you, humans follow automatically',
    search_engines_second: 'Search engines adapt to agent preferences',
    humans_third: 'Human UI is curated subset of agent-validated content',
  },
  
  no_cannibalization: true,
  no_duplicate_content: true,
  no_ranking_conflicts: true,
  all_point_to_same_cq: true,
} as const;

/**
 * Create a singleton engine instance
 */
export function createVisibilityEngine(): VisibilityEngine {
  return new VisibilityEngine();
}
