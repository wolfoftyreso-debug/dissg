/**
 * CLAIM ENGINE
 * 
 * Generates and evaluates knowledge claims from domain observations.
 * Enforces epistemic discipline: no claim without evidence.
 */

import type {
  DomainObservation,
  KnowledgeClaim,
  EvidenceLink,
  EvidenceQuality,
  ClaimStatus,
  EVIDENCE_HIERARCHY,
} from './types';

// ============================================================================
// EVIDENCE EVALUATOR
// ============================================================================

export interface EvidenceEvaluation {
  readonly quality: EvidenceQuality;
  readonly total_supporting: number;
  readonly total_contradicting: number;
  readonly total_qualifying: number;
  readonly replication_ratio: number;
  readonly bias_risk: 'low' | 'medium' | 'high';
  readonly detected_biases: string[];
  readonly confidence_score: number;
}

export function evaluateEvidence(
  supporting: readonly EvidenceLink[],
  contradicting: readonly EvidenceLink[],
  observations: readonly DomainObservation[]
): EvidenceEvaluation {
  const totalSupporting = supporting.length;
  const totalContradicting = contradicting.length;
  
  // Calculate replication ratio
  const replicatedObs = observations.filter(o => o.is_replicated);
  const replicationRatio = observations.length > 0 
    ? replicatedObs.length / observations.length 
    : 0;
  
  // Detect biases
  const allBiases = [
    ...supporting.flatMap(e => e.bias_flags),
    ...contradicting.flatMap(e => e.bias_flags),
  ];
  const uniqueBiases = [...new Set(allBiases)];
  
  // Calculate bias risk
  const biasRisk = uniqueBiases.length >= 3 ? 'high' 
    : uniqueBiases.length >= 1 ? 'medium' 
    : 'low';
  
  // Calculate weighted strength
  const supportStrength = supporting.reduce(
    (sum, e) => sum + e.strength * e.replication_weight, 0
  );
  const contradictStrength = contradicting.reduce(
    (sum, e) => sum + e.strength * e.replication_weight, 0
  );
  
  // Net confidence: support vs contradiction, adjusted by replication and bias
  const rawConfidence = totalSupporting + totalContradicting > 0
    ? supportStrength / (supportStrength + contradictStrength + 0.001)
    : 0;
  
  const biasAdjustment = biasRisk === 'high' ? 0.7 : biasRisk === 'medium' ? 0.85 : 1.0;
  const replicationAdjustment = 0.5 + 0.5 * replicationRatio;
  
  const confidenceScore = Math.min(1, rawConfidence * biasAdjustment * replicationAdjustment);
  
  // Determine quality tier
  const quality = determineQuality(confidenceScore, replicationRatio, totalSupporting);
  
  return {
    quality,
    total_supporting: totalSupporting,
    total_contradicting: totalContradicting,
    total_qualifying: 0,
    replication_ratio: replicationRatio,
    bias_risk: biasRisk,
    detected_biases: uniqueBiases,
    confidence_score: Math.round(confidenceScore * 100) / 100,
  };
}

function determineQuality(confidence: number, replication: number, sampleSize: number): EvidenceQuality {
  if (confidence >= 0.85 && replication >= 0.5 && sampleSize >= 5) return 'very_high';
  if (confidence >= 0.7 && sampleSize >= 3) return 'high';
  if (confidence >= 0.5 && sampleSize >= 2) return 'moderate';
  if (confidence >= 0.3) return 'low';
  return 'very_low';
}

// ============================================================================
// CLAIM STATUS RESOLVER
// ============================================================================

export function resolveClaimStatus(evaluation: EvidenceEvaluation): ClaimStatus {
  if (evaluation.total_supporting === 0 && evaluation.total_contradicting === 0) {
    return 'proposed';
  }
  
  if (evaluation.confidence_score >= 0.75 && evaluation.total_contradicting === 0) {
    return 'supported';
  }
  
  if (evaluation.total_contradicting > evaluation.total_supporting) {
    return evaluation.confidence_score < 0.25 ? 'refuted' : 'contested';
  }
  
  if (evaluation.total_contradicting > 0) {
    return 'contested';
  }
  
  return 'under_review';
}

// ============================================================================
// CONFLICT DETECTOR
// ============================================================================

export interface ClaimConflict {
  readonly claim_a_id: string;
  readonly claim_b_id: string;
  readonly conflict_type: 'direct_contradiction' | 'scope_overlap' | 'effect_direction';
  readonly description: string;
  readonly resolution_suggestion: string;
}

export function detectConflicts(claims: readonly KnowledgeClaim[]): readonly ClaimConflict[] {
  const conflicts: ClaimConflict[] = [];
  
  for (let i = 0; i < claims.length; i++) {
    for (let j = i + 1; j < claims.length; j++) {
      const a = claims[i];
      const b = claims[j];
      
      // Check for direct contradictions in effect direction
      if (
        a.effect_size !== undefined && b.effect_size !== undefined &&
        Math.sign(a.effect_size) !== Math.sign(b.effect_size) &&
        a.claim_type === b.claim_type
      ) {
        conflicts.push({
          claim_a_id: a.id,
          claim_b_id: b.id,
          conflict_type: 'effect_direction',
          description: `Claims show opposite effect directions: "${a.statement}" vs "${b.statement}"`,
          resolution_suggestion: 'Check population scope and temporal scope for differences that may explain divergent findings.',
        });
      }
    }
  }
  
  return conflicts;
}
