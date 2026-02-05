/**
 * DOMAIN AUTOGENERATOR
 * 
 * Never manually choose the next domain again.
 * The system proposes them itself.
 */

/**
 * DOMAIN PROPOSAL
 */
export interface DomainProposal {
  proposed_domain: string;
  domain_code: string;
  data_density: number;        // 0-1
  system_impact: 'low' | 'medium' | 'high' | 'critical';
  query_pressure: number;      // requests/day seeking this
  coupling: string[];          // connected domains
  coverage_gap: number;        // % of questions unanswerable
  risk_score: number;          // 0-1 (complexity risk)
  readiness: 'not_ready' | 'partial' | 'ready';
  proposed_at: string;
  auto_generated: true;
}

/**
 * DOMAIN SCORING WEIGHTS
 */
export const DOMAIN_SCORING = {
  data_density_weight: 0.25,
  system_impact_weight: 0.30,
  query_pressure_weight: 0.25,
  coupling_weight: 0.10,
  risk_penalty_weight: 0.10,
} as const;

/**
 * IMPACT SCORES
 */
const IMPACT_SCORES: Record<string, number> = {
  low: 0.25,
  medium: 0.50,
  high: 0.75,
  critical: 1.0,
};

/**
 * DOMAIN CANDIDATE REGISTRY
 */
export const DOMAIN_CANDIDATES: DomainProposal[] = [
  {
    proposed_domain: 'Education System Load',
    domain_code: 'EDU',
    data_density: 0.82,
    system_impact: 'high',
    query_pressure: 847,
    coupling: ['health', 'demographics', 'economy'],
    coverage_gap: 0.67,
    risk_score: 0.23,
    readiness: 'ready',
    proposed_at: new Date().toISOString(),
    auto_generated: true,
  },
  {
    proposed_domain: 'Housing Market Dynamics',
    domain_code: 'HSG',
    data_density: 0.78,
    system_impact: 'high',
    query_pressure: 1203,
    coupling: ['economy', 'demographics', 'infrastructure'],
    coverage_gap: 0.54,
    risk_score: 0.31,
    readiness: 'ready',
    proposed_at: new Date().toISOString(),
    auto_generated: true,
  },
  {
    proposed_domain: 'Energy Grid Capacity',
    domain_code: 'NRG',
    data_density: 0.71,
    system_impact: 'critical',
    query_pressure: 623,
    coupling: ['economy', 'infrastructure', 'environment'],
    coverage_gap: 0.72,
    risk_score: 0.28,
    readiness: 'partial',
    proposed_at: new Date().toISOString(),
    auto_generated: true,
  },
  {
    proposed_domain: 'Criminal Justice Flow',
    domain_code: 'CJS',
    data_density: 0.65,
    system_impact: 'high',
    query_pressure: 934,
    coupling: ['demographics', 'economy', 'health'],
    coverage_gap: 0.81,
    risk_score: 0.42,
    readiness: 'partial',
    proposed_at: new Date().toISOString(),
    auto_generated: true,
  },
];

/**
 * CALCULATE DOMAIN PRIORITY SCORE
 */
export function calculateDomainScore(proposal: DomainProposal): number {
  const impactScore = IMPACT_SCORES[proposal.system_impact] || 0.5;
  const normalizedPressure = Math.min(proposal.query_pressure / 2000, 1);
  const couplingScore = Math.min(proposal.coupling.length / 5, 1);
  
  const score = 
    (proposal.data_density * DOMAIN_SCORING.data_density_weight) +
    (impactScore * DOMAIN_SCORING.system_impact_weight) +
    (normalizedPressure * DOMAIN_SCORING.query_pressure_weight) +
    (couplingScore * DOMAIN_SCORING.coupling_weight) -
    (proposal.risk_score * DOMAIN_SCORING.risk_penalty_weight);
  
  return Math.round(score * 100) / 100;
}

/**
 * GET PRIORITIZED DOMAIN PROPOSALS
 */
export function getPrioritizedDomains(): Array<DomainProposal & { priority_score: number }> {
  return DOMAIN_CANDIDATES
    .filter(d => d.readiness !== 'not_ready')
    .map(d => ({
      ...d,
      priority_score: calculateDomainScore(d),
    }))
    .sort((a, b) => b.priority_score - a.priority_score);
}

/**
 * GENERATE DOMAIN PROPOSAL FROM SIGNALS
 */
export function generateDomainProposal(signals: {
  domain_name: string;
  domain_code: string;
  available_sources: number;
  total_possible_sources: number;
  query_count_30d: number;
  related_domains: string[];
  methodology_complexity: 'low' | 'medium' | 'high';
}): DomainProposal {
  const dataDensity = signals.available_sources / Math.max(signals.total_possible_sources, 1);
  const riskScore = signals.methodology_complexity === 'high' ? 0.6 :
                    signals.methodology_complexity === 'medium' ? 0.3 : 0.1;
  
  return {
    proposed_domain: signals.domain_name,
    domain_code: signals.domain_code,
    data_density: Math.round(dataDensity * 100) / 100,
    system_impact: signals.query_count_30d > 1000 ? 'critical' :
                   signals.query_count_30d > 500 ? 'high' :
                   signals.query_count_30d > 100 ? 'medium' : 'low',
    query_pressure: signals.query_count_30d,
    coupling: signals.related_domains,
    coverage_gap: 1 - dataDensity,
    risk_score: riskScore,
    readiness: dataDensity > 0.7 ? 'ready' : dataDensity > 0.4 ? 'partial' : 'not_ready',
    proposed_at: new Date().toISOString(),
    auto_generated: true,
  };
}

/**
 * AUTOGENERATOR PRINCIPLES
 */
export const AUTOGENERATOR_PRINCIPLES = {
  never_manual_selection: true,
  system_proposes: true,
  human_approves: true,
  machine_builds: true,
  continuous: true,
} as const;
