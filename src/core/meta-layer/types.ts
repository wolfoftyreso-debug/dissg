/**
 * META LAYER — Types
 * 
 * The self-improving layer that audits the entire knowledge system.
 */

export type GapSeverity = 'critical' | 'high' | 'medium' | 'low';
export type GapStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved';
export type WeakClaimReason = 'low_confidence' | 'few_sources' | 'unresolved_conflict' | 'stale_evidence' | 'narrow_population';
export type ResearchPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface KnowledgeGap {
  id: string;
  domain: string;
  entity_type: string;
  description: string;
  severity: GapSeverity;
  status: GapStatus;
  affected_population_estimate: number | null;
  potential_impact_score: number; // 0-100
  missing_data_types: string[];
  suggested_sources: string[];
  detected_at: string;
  resolved_at: string | null;
}

export interface WeakClaim {
  claim_id: string;
  claim_statement: string;
  domain: string;
  confidence_score: number;
  evidence_count: number;
  unresolved_conflicts: number;
  reasons: WeakClaimReason[];
  improvement_suggestions: string[];
  flagged_at: string;
}

export interface ResearchPriorityItem {
  id: string;
  domain: string;
  question: string;
  priority: ResearchPriority;
  impact_score: number; // 0-100
  feasibility_score: number; // 0-100
  combined_score: number; // impact × feasibility
  related_gap_ids: string[];
  related_weak_claim_ids: string[];
  generated_at: string;
}

export interface SystemHealthSnapshot {
  id: string;
  snapshot_date: string;
  total_sources: number;
  total_observations: number;
  total_claims: number;
  total_evidence_links: number;
  total_causal_edges: number;
  
  // Quality metrics
  avg_claim_confidence: number;
  claims_below_threshold: number; // confidence < 0.5
  unresolved_conflicts: number;
  open_knowledge_gaps: number;
  
  // Coverage metrics
  domains_covered: string[];
  domains_with_gaps: string[];
  source_freshness_score: number; // 0-1, how up-to-date sources are
  
  // Self-improvement
  gaps_resolved_this_period: number;
  claims_strengthened_this_period: number;
  new_gaps_detected_this_period: number;
}

export interface MetaLayerReport {
  generated_at: string;
  health: SystemHealthSnapshot;
  top_gaps: KnowledgeGap[];
  weakest_claims: WeakClaim[];
  research_priorities: ResearchPriorityItem[];
  recommendations: string[];
}
