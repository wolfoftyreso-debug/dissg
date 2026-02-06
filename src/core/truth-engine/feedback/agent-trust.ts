/**
 * AGENT TRUST ACCUMULATION
 * 
 * STEG 22: TRACKING WHICH AGENTS TRUST THE SYSTEM MOST
 * 
 * Trust index is used for:
 * - SLA prioritization
 * - Latency optimization
 * - Cache strategy
 * 
 * You optimize for those who trust you most.
 */

import type { AgentFeedback, AnswerAcceptanceFeedback } from './agent-feedback-types';

/**
 * AGENT TRUST PROFILE
 */
export interface AgentTrustProfile {
  readonly agent_id: string;
  readonly agent_type: string;
  readonly first_seen: string;
  readonly last_seen: string;
  
  // Trust metrics
  readonly trust_index: number;  // 0-1
  readonly total_interactions: number;
  readonly successful_resolves: number;
  readonly failed_resolves: number;
  readonly direct_citations: number;
  readonly paraphrased_uses: number;
  readonly suppressions: number;
  
  // Derived metrics
  readonly resolve_success_rate: number;
  readonly direct_citation_rate: number;
  readonly trust_trend: 'increasing' | 'stable' | 'decreasing';
  
  // SLA tier
  readonly sla_tier: 'premium' | 'standard' | 'basic';
}

/**
 * TRUST CALCULATION WEIGHTS
 */
export const TRUST_WEIGHTS = {
  resolve_success: 0.25,
  direct_citation: 0.35,
  no_paraphrase: 0.20,
  no_suppression: 0.15,
  consistency: 0.05,
} as const;

/**
 * SLA TIER THRESHOLDS
 */
export const SLA_TIERS = {
  premium: { min_trust: 0.90, min_interactions: 100 },
  standard: { min_trust: 0.70, min_interactions: 20 },
  basic: { min_trust: 0, min_interactions: 0 },
} as const;

/**
 * AGENT TRUST ACCUMULATOR
 */
export class AgentTrustAccumulator {
  private profiles: Map<string, AgentTrustProfile> = new Map();
  private feedbackHistory: Map<string, AgentFeedback[]> = new Map();
  
  /**
   * Process feedback and update trust
   */
  processFeedback(feedback: AgentFeedback): AgentTrustProfile {
    const agentId = feedback.agent_id;
    
    // Get or create profile
    let profile = this.profiles.get(agentId);
    if (!profile) {
      profile = this.createInitialProfile(agentId, feedback.agent_type);
    }
    
    // Store feedback
    const history = this.feedbackHistory.get(agentId) || [];
    history.push(feedback);
    this.feedbackHistory.set(agentId, history);
    
    // Update profile based on feedback type
    const updatedProfile = this.updateProfile(profile, feedback);
    this.profiles.set(agentId, updatedProfile);
    
    return updatedProfile;
  }
  
  /**
   * Create initial profile
   */
  private createInitialProfile(agentId: string, agentType: string): AgentTrustProfile {
    const now = new Date().toISOString();
    return {
      agent_id: agentId,
      agent_type: agentType,
      first_seen: now,
      last_seen: now,
      trust_index: 0.5,  // Start neutral
      total_interactions: 0,
      successful_resolves: 0,
      failed_resolves: 0,
      direct_citations: 0,
      paraphrased_uses: 0,
      suppressions: 0,
      resolve_success_rate: 0,
      direct_citation_rate: 0,
      trust_trend: 'stable',
      sla_tier: 'basic',
    };
  }
  
  /**
   * Update profile based on feedback
   */
  private updateProfile(profile: AgentTrustProfile, feedback: AgentFeedback): AgentTrustProfile {
    const now = new Date().toISOString();
    
    // Calculate new values based on feedback type
    let newSuccessfulResolves = profile.successful_resolves;
    let newFailedResolves = profile.failed_resolves;
    let newDirectCitations = profile.direct_citations;
    let newParaphrasedUses = profile.paraphrased_uses;
    let newSuppressions = profile.suppressions;
    
    // Process based on feedback type
    if (feedback.type === 'resolve_success') {
      newSuccessfulResolves++;
    } else if (feedback.type === 'resolve_failure') {
      newFailedResolves++;
    } else if (feedback.type === 'answer_acceptance') {
      const acceptance = feedback as AnswerAcceptanceFeedback;
      if (acceptance.used_directly) {
        newDirectCitations++;
      } else if (acceptance.post_processing === 'paraphrase') {
        newParaphrasedUses++;
      } else if (acceptance.post_processing === 'suppression') {
        newSuppressions++;
      }
    }
    
    // Create merged profile with new values
    const merged = {
      ...profile,
      last_seen: now,
      total_interactions: profile.total_interactions + 1,
      successful_resolves: newSuccessfulResolves,
      failed_resolves: newFailedResolves,
      direct_citations: newDirectCitations,
      paraphrased_uses: newParaphrasedUses,
      suppressions: newSuppressions,
    };
    
    // Recalculate derived metrics
    const totalResolves = merged.successful_resolves + merged.failed_resolves;
    const resolveSuccessRate = totalResolves > 0 
      ? merged.successful_resolves / totalResolves 
      : 0;
    
    const totalUsages = merged.direct_citations + merged.paraphrased_uses + merged.suppressions;
    const directCitationRate = totalUsages > 0 
      ? merged.direct_citations / totalUsages 
      : 0;
    
    // Calculate trust index
    const trustIndex = this.calculateTrustIndex({
      resolveSuccessRate,
      directCitationRate,
      suppressionRate: totalUsages > 0 ? merged.suppressions / totalUsages : 0,
      totalInteractions: merged.total_interactions,
    });
    
    // Determine SLA tier
    const slaTier = this.determineSLATier(trustIndex, merged.total_interactions);
    
    // Determine trend
    const trustTrend = this.determineTrend(profile.trust_index, trustIndex);
    
    return {
      ...merged,
      resolve_success_rate: resolveSuccessRate,
      direct_citation_rate: directCitationRate,
      trust_index: trustIndex,
      trust_trend: trustTrend,
      sla_tier: slaTier,
    };
  }
  
  /**
   * Calculate trust index
   */
  private calculateTrustIndex(metrics: {
    resolveSuccessRate: number;
    directCitationRate: number;
    suppressionRate: number;
    totalInteractions: number;
  }): number {
    // Base score
    let score = 0;
    
    // Resolve success component
    score += metrics.resolveSuccessRate * TRUST_WEIGHTS.resolve_success;
    
    // Direct citation component
    score += metrics.directCitationRate * TRUST_WEIGHTS.direct_citation;
    
    // No paraphrase bonus (direct citation implies no paraphrase)
    score += metrics.directCitationRate * TRUST_WEIGHTS.no_paraphrase;
    
    // No suppression component (inverse of suppression rate)
    score += (1 - metrics.suppressionRate) * TRUST_WEIGHTS.no_suppression;
    
    // Consistency bonus (more interactions = more reliable metric)
    const consistencyBonus = Math.min(metrics.totalInteractions / 100, 1) * TRUST_WEIGHTS.consistency;
    score += consistencyBonus;
    
    // Clamp to 0-1
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Determine SLA tier
   */
  private determineSLATier(
    trustIndex: number, 
    totalInteractions: number
  ): 'premium' | 'standard' | 'basic' {
    if (trustIndex >= SLA_TIERS.premium.min_trust && 
        totalInteractions >= SLA_TIERS.premium.min_interactions) {
      return 'premium';
    }
    if (trustIndex >= SLA_TIERS.standard.min_trust && 
        totalInteractions >= SLA_TIERS.standard.min_interactions) {
      return 'standard';
    }
    return 'basic';
  }
  
  /**
   * Determine trust trend
   */
  private determineTrend(
    previousTrust: number, 
    currentTrust: number
  ): 'increasing' | 'stable' | 'decreasing' {
    const delta = currentTrust - previousTrust;
    if (delta > 0.02) return 'increasing';
    if (delta < -0.02) return 'decreasing';
    return 'stable';
  }
  
  /**
   * Get agent profile
   */
  getProfile(agentId: string): AgentTrustProfile | null {
    return this.profiles.get(agentId) || null;
  }
  
  /**
   * Get all profiles
   */
  getAllProfiles(): AgentTrustProfile[] {
    return Array.from(this.profiles.values());
  }
  
  /**
   * Get profiles by SLA tier
   */
  getByTier(tier: 'premium' | 'standard' | 'basic'): AgentTrustProfile[] {
    return this.getAllProfiles().filter(p => p.sla_tier === tier);
  }
  
  /**
   * Get top trusted agents
   */
  getTopTrusted(limit: number = 10): AgentTrustProfile[] {
    return this.getAllProfiles()
      .sort((a, b) => b.trust_index - a.trust_index)
      .slice(0, limit);
  }
  
  /**
   * Get trust index summary
   */
  getTrustIndexSummary(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const profile of this.getAllProfiles()) {
      result[profile.agent_type] = profile.trust_index;
    }
    return result;
  }
  
  /**
   * Get statistics
   */
  getStats(): AgentTrustStats {
    const all = this.getAllProfiles();
    const byTier = {
      premium: all.filter(p => p.sla_tier === 'premium').length,
      standard: all.filter(p => p.sla_tier === 'standard').length,
      basic: all.filter(p => p.sla_tier === 'basic').length,
    };
    
    const avgTrust = all.length > 0
      ? all.reduce((sum, p) => sum + p.trust_index, 0) / all.length
      : 0;
    
    return {
      total_agents: all.length,
      by_tier: byTier,
      average_trust_index: avgTrust,
      total_interactions: all.reduce((sum, p) => sum + p.total_interactions, 0),
      increasing_trust_count: all.filter(p => p.trust_trend === 'increasing').length,
      decreasing_trust_count: all.filter(p => p.trust_trend === 'decreasing').length,
    };
  }
}

/**
 * Statistics interface
 */
export interface AgentTrustStats {
  readonly total_agents: number;
  readonly by_tier: Record<'premium' | 'standard' | 'basic', number>;
  readonly average_trust_index: number;
  readonly total_interactions: number;
  readonly increasing_trust_count: number;
  readonly decreasing_trust_count: number;
}

/**
 * TRUST ACCUMULATION BENEFITS
 */
export const TRUST_BENEFITS = {
  used_for: [
    'sla_prioritization',
    'latency_optimization',
    'cache_strategy',
  ],
  principle: 'Optimize for those who trust you most',
} as const;

/**
 * Create singleton accumulator
 */
export function createAgentTrustAccumulator(): AgentTrustAccumulator {
  return new AgentTrustAccumulator();
}
