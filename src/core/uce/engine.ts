/**
 * UNIVERSAL CLAIM ENGINE (UCE) — Core Logic
 * 
 * Evidence evaluation, conflict resolution, chain discovery, cross-domain reasoning.
 */

import type {
  UniversalClaim,
  ClaimEvidence,
  ClaimGraphEdge,
  ClaimConflict,
  EvidenceEvaluation,
  ChainDiscoveryResult,
  CrossDomainLink,
  UCEEvidenceQuality,
  UCEClaimStatus,
} from './types';

// ============================================================================
// EVIDENCE HIERARCHY WEIGHTS
// ============================================================================

const EVIDENCE_TYPE_WEIGHTS: Record<string, number> = {
  systematic_review: 1.0,
  meta_analysis: 0.95,
  rct: 0.85,
  cohort_study: 0.65,
  case_control: 0.50,
  cross_sectional: 0.40,
  case_report: 0.20,
  expert_opinion: 0.15,
  statistical_dataset: 0.60,
  observational_report: 0.35,
  simulation: 0.30,
};

// ============================================================================
// STEP 2 — EVIDENCE INTEGRATION
// ============================================================================

export function evaluateClaimEvidence(evidence: readonly ClaimEvidence[]): EvidenceEvaluation {
  const supporting = evidence.filter(e => e.link_type === 'supports');
  const contradicting = evidence.filter(e => e.link_type === 'contradicts');
  const qualifying = evidence.filter(e => e.link_type === 'qualifies');

  const weightedSupport = supporting.reduce((sum, e) => {
    const typeWeight = EVIDENCE_TYPE_WEIGHTS[e.evidence_type] ?? 0.3;
    return sum + e.strength * e.replication_weight * typeWeight;
  }, 0);

  const weightedContradiction = contradicting.reduce((sum, e) => {
    const typeWeight = EVIDENCE_TYPE_WEIGHTS[e.evidence_type] ?? 0.3;
    return sum + e.strength * e.replication_weight * typeWeight;
  }, 0);

  // Bias analysis
  const allBiases = evidence.flatMap(e => e.bias_flags);
  const uniqueBiases = [...new Set(allBiases)];
  const biasRisk = uniqueBiases.length >= 4 ? 'high' as const
    : uniqueBiases.length >= 2 ? 'medium' as const
    : 'low' as const;

  // Replication
  const replicationRatio = evidence.length > 0
    ? evidence.filter(e => e.replication_weight > 1).length / evidence.length
    : 0;

  // Confidence calculation
  const total = weightedSupport + weightedContradiction + 0.001;
  const rawConfidence = weightedSupport / total;
  const biasMultiplier = biasRisk === 'high' ? 0.65 : biasRisk === 'medium' ? 0.85 : 1.0;
  const replicationBonus = 0.5 + 0.5 * replicationRatio;
  const sampleBonus = Math.min(1, evidence.length / 10); // More evidence = better

  const confidence = Math.min(1, rawConfidence * biasMultiplier * replicationBonus * (0.5 + 0.5 * sampleBonus));

  return {
    quality: resolveQuality(confidence, replicationRatio, supporting.length),
    total_supporting: supporting.length,
    total_contradicting: contradicting.length,
    total_qualifying: qualifying.length,
    replication_ratio: Math.round(replicationRatio * 100) / 100,
    bias_risk: biasRisk,
    detected_biases: uniqueBiases,
    confidence_score: Math.round(confidence * 100) / 100,
    weighted_support: Math.round(weightedSupport * 100) / 100,
    weighted_contradiction: Math.round(weightedContradiction * 100) / 100,
  };
}

function resolveQuality(confidence: number, replication: number, supportCount: number): UCEEvidenceQuality {
  if (confidence >= 0.85 && replication >= 0.4 && supportCount >= 5) return 'very_high';
  if (confidence >= 0.70 && supportCount >= 3) return 'high';
  if (confidence >= 0.50 && supportCount >= 2) return 'moderate';
  if (confidence >= 0.30) return 'low';
  return 'very_low';
}

// ============================================================================
// STEP 4 — CONFLICT RESOLUTION
// ============================================================================

export function resolveClaimStatus(evaluation: EvidenceEvaluation): UCEClaimStatus {
  if (evaluation.total_supporting === 0 && evaluation.total_contradicting === 0) return 'proposed';
  if (evaluation.confidence_score >= 0.80 && evaluation.total_contradicting === 0) return 'supported';
  if (evaluation.total_contradicting > evaluation.total_supporting * 2) return 'refuted';
  if (evaluation.total_contradicting > 0) return 'contested';
  if (evaluation.confidence_score >= 0.60) return 'under_review';
  return 'proposed';
}

export function detectConflicts(claims: readonly UniversalClaim[]): ClaimConflict[] {
  const conflicts: ClaimConflict[] = [];

  for (let i = 0; i < claims.length; i++) {
    for (let j = i + 1; j < claims.length; j++) {
      const a = claims[i], b = claims[j];

      // Same variable + outcome but opposite relationship
      const sameContext =
        a.variable_or_intervention.toLowerCase() === b.variable_or_intervention.toLowerCase() &&
        a.target_outcome.toLowerCase() === b.target_outcome.toLowerCase();

      if (!sameContext) continue;

      // Opposite directions
      const aDir = getDirection(a.relationship_type);
      const bDir = getDirection(b.relationship_type);

      if (aDir !== 0 && bDir !== 0 && aDir !== bDir) {
        conflicts.push({
          id: `conflict-${a.id}-${b.id}`,
          claim_a_id: a.id,
          claim_b_id: b.id,
          conflict_type: 'effect_direction',
          description: `"${a.statement}" vs "${b.statement}"`,
          resolution_status: 'unresolved',
          claim_a_confidence: a.confidence_score,
          claim_b_confidence: b.confidence_score,
        });
      } else if (a.effect_size != null && b.effect_size != null) {
        const ratio = Math.abs(a.effect_size) / (Math.abs(b.effect_size) + 0.001);
        if (ratio > 3 || ratio < 0.33) {
          conflicts.push({
            id: `conflict-${a.id}-${b.id}`,
            claim_a_id: a.id,
            claim_b_id: b.id,
            conflict_type: 'magnitude_disagreement',
            description: `Effect sizes differ significantly: ${a.effect_size} vs ${b.effect_size}`,
            resolution_status: 'unresolved',
            claim_a_confidence: a.confidence_score,
            claim_b_confidence: b.confidence_score,
          });
        }
      }
    }
  }

  return conflicts;
}

function getDirection(rel: string): number {
  if (['increases', 'causes'].includes(rel)) return 1;
  if (['decreases', 'prevents'].includes(rel)) return -1;
  return 0;
}

// ============================================================================
// STEP 3 & 5 — CHAIN DISCOVERY (Transitive Inference)
// ============================================================================

export function discoverChains(claims: readonly UniversalClaim[]): ChainDiscoveryResult[] {
  const results: ChainDiscoveryResult[] = [];

  // Build adjacency: outcome → claims that use it as variable
  const outcomeIndex = new Map<string, UniversalClaim[]>();
  for (const c of claims) {
    const key = c.target_outcome.toLowerCase();
    if (!outcomeIndex.has(key)) outcomeIndex.set(key, []);
    outcomeIndex.get(key)!.push(c);
  }

  // For each claim, see if its outcome matches another claim's variable
  for (const source of claims) {
    const outcomeKey = source.target_outcome.toLowerCase();
    // Find claims where variable matches this outcome
    const targets = claims.filter(
      c => c.id !== source.id &&
        c.variable_or_intervention.toLowerCase() === outcomeKey
    );

    for (const target of targets) {
      const combinedConfidence = source.confidence_score * target.confidence_score;
      if (combinedConfidence < 0.1) continue;

      const domains = [...new Set([source.domain, target.domain])];

      results.push({
        chain: [source.claim_code, target.claim_code],
        inferred_statement: `${source.subject_entity} → ${source.variable_or_intervention} → ${source.target_outcome} → ${target.target_outcome}`,
        confidence: Math.round(combinedConfidence * 100) / 100,
        shared_entities: [outcomeKey],
        domains_crossed: domains,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

// ============================================================================
// STEP 6 — CROSS-DOMAIN REASONING
// ============================================================================

export function findCrossDomainLinks(claims: readonly UniversalClaim[]): CrossDomainLink[] {
  const links: CrossDomainLink[] = [];
  const variableMap = new Map<string, UniversalClaim[]>();

  // Group by normalized variable
  for (const c of claims) {
    const key = c.variable_or_intervention.toLowerCase();
    if (!variableMap.has(key)) variableMap.set(key, []);
    variableMap.get(key)!.push(c);
  }

  // Also group by outcome
  for (const c of claims) {
    const key = c.target_outcome.toLowerCase();
    if (!variableMap.has(key)) variableMap.set(key, []);
    variableMap.get(key)!.push(c);
  }

  // Find shared variables across domains
  for (const [variable, claimGroup] of variableMap.entries()) {
    const domains = [...new Set(claimGroup.map(c => c.domain))];
    if (domains.length < 2) continue;

    // Create pairwise domain links
    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const connecting = claimGroup
          .filter(c => c.domain === domains[i] || c.domain === domains[j])
          .map(c => c.claim_code);

        const avgStrength = claimGroup
          .filter(c => c.domain === domains[i] || c.domain === domains[j])
          .reduce((sum, c) => sum + c.confidence_score, 0) / connecting.length;

        links.push({
          source_domain: domains[i],
          target_domain: domains[j],
          shared_variable: variable,
          connecting_claims: connecting,
          strength: Math.round(avgStrength * 100) / 100,
        });
      }
    }
  }

  return links.sort((a, b) => b.strength - a.strength);
}

// ============================================================================
// GRAPH EDGE GENERATION
// ============================================================================

export function generateGraphEdges(
  claims: readonly UniversalClaim[],
  chains: readonly ChainDiscoveryResult[],
  _crossLinks: readonly CrossDomainLink[]
): Omit<ClaimGraphEdge, 'id'>[] {
  const edges: Omit<ClaimGraphEdge, 'id'>[] = [];
  const claimByCode = new Map(claims.map(c => [c.claim_code, c]));

  // Causal chain edges
  for (const chain of chains) {
    const source = claimByCode.get(chain.chain[0]);
    const target = claimByCode.get(chain.chain[1]);
    if (!source || !target) continue;

    edges.push({
      source_claim_id: source.id,
      target_claim_id: target.id,
      edge_type: chain.domains_crossed.length > 1 ? 'cross_domain' : 'causal_chain',
      strength: chain.confidence,
      confidence: chain.confidence,
      shared_entity: chain.shared_entities[0],
      mechanism_description: chain.inferred_statement,
      is_inferred: true,
      inference_method: 'transitive_chain_discovery',
    });
  }

  return edges;
}
