/**
 * GLOBAL DECISION INTELLIGENCE SYSTEM (GDIS)
 * 
 * 12-Layer Architecture:
 * Source → Ingestion → Observation → Variable → Claim → Evidence →
 * Causal → Problem Mapping → Intervention Library → Priority Engine →
 * Decision Intelligence → Transparency
 */

// ─── Layer 1–3: Source / Ingestion / Observation ───

export type SourceCategory = 'research_db' | 'statistics' | 'health_data' | 'environment' | 'economic' | 'policy';

export interface DataSource {
  id: string;
  name: string;
  category: SourceCategory;
  organization: string;
  reliabilityScore: number; // 0–1
  updateFrequency: string;
  url?: string;
}

// ─── Layer 4: Variable Layer ───

export type VariableDomain = 'health' | 'climate' | 'economy' | 'education' | 'environment' | 'governance' | 'security';

export interface GlobalVariable {
  id: string;
  code: string;
  name: string;
  domain: VariableDomain;
  unit: string;
  direction: 'higher_better' | 'lower_better' | 'neutral';
  globalCoverage: number; // 0–1
}

// ─── Layer 5–6: Claim + Evidence ───

export type EvidenceGrade = 'meta_analysis' | 'systematic_review' | 'rct' | 'cohort' | 'observational' | 'expert_opinion';

export interface KnowledgeClaim {
  id: string;
  statement: string;
  domain: VariableDomain;
  evidenceGrade: EvidenceGrade;
  confidence: number;
  replicationCount: number;
  biasRisk: 'low' | 'medium' | 'high';
  sourceCount: number;
}

// ─── Layer 7: Causal Layer ───

export interface CausalLink {
  id: string;
  fromVariable: string;
  toVariable: string;
  mechanism: string;
  strength: number;    // 0–1
  confidence: number;  // 0–1
  lagMonths?: number;
  bidirectional: boolean;
  domains: VariableDomain[];
}

// ─── Layer 8: Problem Mapping ───

export type ProblemSeverity = 'critical' | 'severe' | 'moderate' | 'emerging';

export interface GlobalProblem {
  id: string;
  code: string;
  title: string;
  description: string;
  domain: VariableDomain;
  severity: ProblemSeverity;
  populationAffected: number;
  dalysOrEquivalent: number; // disability-adjusted life years or economic equivalent
  trendDirection: 'improving' | 'stable' | 'worsening';
  relatedVariables: string[];
  relatedClaims: string[];
  geographicScope: string;
}

// ─── Layer 9: Intervention Library ───

export type InterventionStatus = 'proven' | 'promising' | 'experimental' | 'theoretical';
export type CostLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type ScaleLevel = 'local' | 'national' | 'regional' | 'global';

export interface Intervention {
  id: string;
  name: string;
  description: string;
  domain: VariableDomain;
  targetProblems: string[];
  status: InterventionStatus;
  costLevel: CostLevel;
  scalability: ScaleLevel;
  timeToEffect: string;
  evidenceGrade: EvidenceGrade;
  effectSize: string;
  population: string;
  sideEffects: string[];
  implementationBarriers: string[];
}

// ─── Layer 10: Priority Engine ───

export interface PriorityScore {
  interventionId: string;
  interventionName: string;
  domain: VariableDomain;
  impact: number;       // 1–10
  cost: number;         // 1–10 (10 = cheapest)
  evidence: number;     // 1–10
  scalability: number;  // 1–10
  priorityScore: number;
  rank: number;
  targetProblem: string;
  rationale: string;
}

// ─── Layer 11: Decision Intelligence ───

export interface DecisionRecommendation {
  id: string;
  question: string;
  topInterventions: PriorityScore[];
  evidenceSummary: string;
  uncertainties: string[];
  limitations: string[];
  generatedAt: string;
}

// ─── Layer 12: Transparency ───

export interface TransparencyRecord {
  id: string;
  entityType: 'problem' | 'intervention' | 'recommendation';
  entityId: string;
  methodology: string;
  dataSources: string[];
  uncertaintyLevel: number;
  auditTrail: string[];
  lastVerified: string;
  machineReadable: boolean;
}

// ─── System stats ───

export interface GDISStats {
  totalProblems: number;
  totalInterventions: number;
  totalClaims: number;
  totalCausalLinks: number;
  domainCoverage: Record<VariableDomain, number>;
  avgConfidence: number;
}
