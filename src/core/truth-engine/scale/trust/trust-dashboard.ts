/**
 * TRUST DASHBOARD
 * 
 * Strategically critical: Show how you say no.
 * 
 * Dashboard shows:
 * - All Answer Types
 * - All domains
 * - All sources (Tier + status)
 * - Latest updates
 * - Blocked answers (safety)
 */

import type { CanonicalAnswerTypeCode } from '../../usae/mao/canonical-types';
import type { DomainCode } from '../../usae/mao/unified-body';

/**
 * TRUST DASHBOARD STATE
 */
export interface TrustDashboardState {
  readonly generated_at: string;
  readonly mao_version: string;
  
  // Answer Types
  readonly answer_types: readonly AnswerTypeStatus[];
  
  // Domains
  readonly domains: readonly DomainStatus[];
  
  // Sources
  readonly sources: readonly SourceStatus[];
  
  // Recent Activity
  readonly recent_updates: readonly RecentUpdate[];
  
  // Safety Stats
  readonly safety_stats: SafetyStats;
  
  // System Health
  readonly system_health: SystemHealth;
}

/**
 * ANSWER TYPE STATUS
 */
export interface AnswerTypeStatus {
  readonly type_code: CanonicalAnswerTypeCode;
  readonly display_name: string;
  readonly description: string;
  readonly packet_count: number;
  readonly last_generated: string | null;
  readonly avg_confidence: number;
}

/**
 * DOMAIN STATUS
 */
export interface DomainStatus {
  readonly domain_code: DomainCode;
  readonly display_name: string;
  readonly packet_count: number;
  readonly source_count: number;
  readonly coverage_score: number;
  readonly last_update: string | null;
  readonly is_active: boolean;
}

/**
 * SOURCE STATUS
 */
export interface SourceStatus {
  readonly source_id: string;
  readonly source_name: string;
  readonly tier: 1 | 2 | 3;
  readonly status: 'active' | 'stale' | 'error' | 'deprecated';
  readonly last_fetch: string | null;
  readonly fetch_error?: string;
  readonly domains_served: readonly DomainCode[];
  readonly measures_provided: number;
}

/**
 * RECENT UPDATE
 */
export interface RecentUpdate {
  readonly timestamp: string;
  readonly type: 'packet_generated' | 'source_updated' | 'definition_changed' | 'safety_block';
  readonly entity_id: string;
  readonly description: string;
  readonly domain?: DomainCode;
}

/**
 * SAFETY STATS
 */
export interface SafetyStats {
  readonly total_blocked_24h: number;
  readonly total_blocked_7d: number;
  readonly blocked_by_reason: Record<string, number>;
  readonly crisis_triggers_24h: number;
  readonly normative_blocks_24h: number;
}

/**
 * SYSTEM HEALTH
 */
export interface SystemHealth {
  readonly status: 'healthy' | 'degraded' | 'critical';
  readonly uptime_percent_30d: number;
  readonly avg_response_time_ms: number;
  readonly error_rate_24h: number;
  readonly last_full_refresh: string;
}

/**
 * TRUST DASHBOARD BUILDER
 */
export class TrustDashboard {
  private state: TrustDashboardState;

  constructor() {
    this.state = this.buildInitialState();
  }

  /**
   * Get current dashboard state
   */
  getState(): TrustDashboardState {
    return {
      ...this.state,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * Get public API response
   */
  getPublicView(): PublicTrustView {
    return {
      version: this.state.mao_version,
      generated_at: new Date().toISOString(),
      answer_types: this.state.answer_types.length,
      active_domains: this.state.domains.filter(d => d.is_active).length,
      tier_1_sources: this.state.sources.filter(s => s.tier === 1).length,
      total_sources: this.state.sources.length,
      blocked_last_24h: this.state.safety_stats.total_blocked_24h,
      avg_confidence: this.calculateAvgConfidence(),
      system_status: this.state.system_health.status,
      transparency_url: '/trust/dashboard',
    };
  }

  /**
   * Record a block event
   */
  recordBlock(reason: string, domain?: DomainCode): void {
    this.state = {
      ...this.state,
      safety_stats: {
        ...this.state.safety_stats,
        total_blocked_24h: this.state.safety_stats.total_blocked_24h + 1,
        blocked_by_reason: {
          ...this.state.safety_stats.blocked_by_reason,
          [reason]: (this.state.safety_stats.blocked_by_reason[reason] || 0) + 1,
        },
      },
      recent_updates: [
        {
          timestamp: new Date().toISOString(),
          type: 'safety_block',
          entity_id: `block:${Date.now()}`,
          description: `Blocked: ${reason}`,
          domain,
        },
        ...this.state.recent_updates.slice(0, 99),
      ],
    };
  }

  /**
   * Record a packet generation
   */
  recordPacketGeneration(packetId: string, domain: DomainCode): void {
    this.state = {
      ...this.state,
      recent_updates: [
        {
          timestamp: new Date().toISOString(),
          type: 'packet_generated',
          entity_id: packetId,
          description: `Generated: ${packetId}`,
          domain,
        },
        ...this.state.recent_updates.slice(0, 99),
      ],
    };
  }

  private buildInitialState(): TrustDashboardState {
    return {
      generated_at: new Date().toISOString(),
      mao_version: '1.0.0',
      
      answer_types: [
        { type_code: 'DESCRIPTIVE_STAT', display_name: 'Descriptive Statistics', description: 'Point-in-time observations', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'TREND_CHANGE', display_name: 'Trend Analysis', description: 'Changes over time', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'COMPARISON_CONDITIONAL', display_name: 'Comparisons', description: 'Cross-entity comparisons', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'DISTRIBUTION_STRUCTURE', display_name: 'Distributions', description: 'Structural patterns', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'RISK_PREVALENCE', display_name: 'Risk & Prevalence', description: 'Frequency of conditions', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'CORRELATION_OVERVIEW', display_name: 'Correlations', description: 'Observed relationships', packet_count: 0, last_generated: null, avg_confidence: 0 },
        { type_code: 'SCENARIO_MODEL', display_name: 'Scenarios', description: 'Conditional projections', packet_count: 0, last_generated: null, avg_confidence: 0 },
      ],
      
      domains: [
        { domain_code: 'economy', display_name: 'Economy', packet_count: 0, source_count: 3, coverage_score: 0.85, last_update: null, is_active: true },
        { domain_code: 'healthcare', display_name: 'Healthcare', packet_count: 0, source_count: 2, coverage_score: 0.75, last_update: null, is_active: true },
        { domain_code: 'youth', display_name: 'Youth', packet_count: 0, source_count: 2, coverage_score: 0.8, last_update: null, is_active: true },
        { domain_code: 'markets', display_name: 'Markets', packet_count: 0, source_count: 2, coverage_score: 0.9, last_update: null, is_active: true },
        { domain_code: 'education', display_name: 'Education', packet_count: 0, source_count: 2, coverage_score: 0.7, last_update: null, is_active: true },
        { domain_code: 'labor', display_name: 'Labor', packet_count: 0, source_count: 2, coverage_score: 0.8, last_update: null, is_active: true },
        { domain_code: 'housing', display_name: 'Housing', packet_count: 0, source_count: 1, coverage_score: 0.6, last_update: null, is_active: true },
        { domain_code: 'crime', display_name: 'Crime', packet_count: 0, source_count: 1, coverage_score: 0.65, last_update: null, is_active: true },
        { domain_code: 'environment', display_name: 'Environment', packet_count: 0, source_count: 2, coverage_score: 0.75, last_update: null, is_active: true },
        { domain_code: 'migration', display_name: 'Migration', packet_count: 0, source_count: 1, coverage_score: 0.6, last_update: null, is_active: true },
        { domain_code: 'society', display_name: 'Society', packet_count: 0, source_count: 2, coverage_score: 0.7, last_update: null, is_active: true },
        { domain_code: 'substance_use', display_name: 'Substance Use', packet_count: 0, source_count: 1, coverage_score: 0.5, last_update: null, is_active: true },
        { domain_code: 'medicine', display_name: 'Medicine', packet_count: 0, source_count: 1, coverage_score: 0.55, last_update: null, is_active: true },
      ],
      
      sources: [
        { source_id: 'eurostat', source_name: 'Eurostat', tier: 1, status: 'active', last_fetch: new Date().toISOString(), domains_served: ['economy', 'labor'], measures_provided: 150 },
        { source_id: 'world_bank', source_name: 'World Bank', tier: 1, status: 'active', last_fetch: new Date().toISOString(), domains_served: ['economy', 'education'], measures_provided: 200 },
        { source_id: 'who', source_name: 'World Health Organization', tier: 1, status: 'active', last_fetch: new Date().toISOString(), domains_served: ['healthcare', 'youth'], measures_provided: 100 },
        { source_id: 'oecd', source_name: 'OECD', tier: 1, status: 'active', last_fetch: new Date().toISOString(), domains_served: ['economy', 'education', 'healthcare'], measures_provided: 180 },
        { source_id: 'national_statistics', source_name: 'National Statistics Offices', tier: 2, status: 'active', last_fetch: new Date().toISOString(), domains_served: ['society', 'crime', 'housing'], measures_provided: 300 },
      ],
      
      recent_updates: [],
      
      safety_stats: {
        total_blocked_24h: 0,
        total_blocked_7d: 0,
        blocked_by_reason: {},
        crisis_triggers_24h: 0,
        normative_blocks_24h: 0,
      },
      
      system_health: {
        status: 'healthy',
        uptime_percent_30d: 99.9,
        avg_response_time_ms: 45,
        error_rate_24h: 0.001,
        last_full_refresh: new Date().toISOString(),
      },
    };
  }

  private calculateAvgConfidence(): number {
    const types = this.state.answer_types.filter(t => t.packet_count > 0);
    if (types.length === 0) return 0;
    return types.reduce((sum, t) => sum + t.avg_confidence, 0) / types.length;
  }
}

/**
 * PUBLIC TRUST VIEW (for external consumption)
 */
export interface PublicTrustView {
  readonly version: string;
  readonly generated_at: string;
  readonly answer_types: number;
  readonly active_domains: number;
  readonly tier_1_sources: number;
  readonly total_sources: number;
  readonly blocked_last_24h: number;
  readonly avg_confidence: number;
  readonly system_status: 'healthy' | 'degraded' | 'critical';
  readonly transparency_url: string;
}

/**
 * WHY THIS WINS
 */
export const TRUST_DASHBOARD_VALUE = {
  google_can_verify: true,
  ai_agents_can_whitelist: true,
  journalists_can_audit: true,
  regulators_get_comfort: true,
  shows_how_we_say_no: true,
} as const;
