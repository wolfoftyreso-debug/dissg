/**
 * GLOBAL TRUST SCORE ENGINE
 * 
 * Calculates and manages trust scores for all entities.
 * "AI-agenter använder inte känsla. De använder riskminimering."
 */

import { 
  TrustFactors, 
  GlobalTrustScore, 
  ConfidenceBand,
  TRUST_FACTOR_WEIGHTS,
  TrustScoreOutput,
  RevisionEntry,
  RevisionLogOutput
} from './types';

// ============================================
// TRUST SCORE CALCULATION
// ============================================

/**
 * Calculate weighted trust score from factors
 */
export function calculateTrustScore(factors: TrustFactors): number {
  let score = 0;
  
  for (const [key, weight] of Object.entries(TRUST_FACTOR_WEIGHTS)) {
    const factorKey = key as keyof TrustFactors;
    score += factors[factorKey] * weight;
  }
  
  // Round to 2 decimal places
  return Math.round(score * 100) / 100;
}

/**
 * Determine confidence band from trust score
 */
export function getConfidenceBand(score: number): ConfidenceBand {
  if (score >= 0.95) return 'Exceptional';
  if (score >= 0.90) return 'Very High';
  if (score >= 0.80) return 'High';
  if (score >= 0.65) return 'Moderate';
  if (score >= 0.50) return 'Low';
  return 'Insufficient';
}

/**
 * Generate human-readable trust drivers
 */
export function generateTrustDrivers(
  factors: TrustFactors,
  sourceInfo?: { organization?: string; methodologyYears?: number }
): string[] {
  const drivers: string[] = [];
  
  // Source authority
  if (factors.sourceAuthority >= 0.90) {
    drivers.push(sourceInfo?.organization 
      ? `${sourceInfo.organization} primary source` 
      : 'Tier 1 authoritative source');
  } else if (factors.sourceAuthority >= 0.75) {
    drivers.push('High-authority institutional source');
  }
  
  // Historical accuracy
  if (factors.historicalAccuracy >= 0.90) {
    drivers.push('No significant errors in historical record');
  } else if (factors.historicalAccuracy >= 0.75) {
    drivers.push('Strong historical accuracy');
  }
  
  // Methodology stability
  if (sourceInfo?.methodologyYears && sourceInfo.methodologyYears >= 10) {
    drivers.push(`${sourceInfo.methodologyYears}+ years unchanged methodology`);
  } else if (sourceInfo?.methodologyYears && sourceInfo.methodologyYears >= 5) {
    drivers.push(`${sourceInfo.methodologyYears} years stable methodology`);
  }
  
  // Update discipline
  if (factors.updateDiscipline >= 0.90) {
    drivers.push('Consistent update schedule maintained');
  }
  
  // Cross-source agreement
  if (factors.crossSourceAgreement >= 0.85) {
    drivers.push('High cross-dataset agreement');
  } else if (factors.crossSourceAgreement >= 0.70) {
    drivers.push('Good agreement with secondary sources');
  }
  
  // Revision transparency
  if (factors.revisionTransparency >= 0.90) {
    drivers.push('Full revision history with explanations');
  }
  
  // Agent reuse
  if (factors.agentReuseFrequency >= 0.50) {
    drivers.push('High AI agent reuse rate');
  } else if (factors.agentReuseFrequency >= 0.25) {
    drivers.push('Growing AI agent adoption');
  }
  
  return drivers;
}

/**
 * Build complete GlobalTrustScore object
 */
export function buildTrustScore(
  entityType: GlobalTrustScore['entityType'],
  entityId: string,
  factors: TrustFactors,
  sourceInfo?: { organization?: string; methodologyYears?: number }
): GlobalTrustScore {
  const trustScore = calculateTrustScore(factors);
  
  return {
    entityType,
    entityId,
    factors,
    trustScore,
    confidenceBand: getConfidenceBand(trustScore),
    trustDrivers: generateTrustDrivers(factors, sourceInfo),
    calculatedAt: new Date().toISOString(),
  };
}

// ============================================
// JSON-LD OUTPUT FORMATTERS
// ============================================

/**
 * Format trust score for machine-readable output
 */
export function formatTrustScoreOutput(score: GlobalTrustScore): TrustScoreOutput {
  return {
    '@context': 'https://dissg.global/schema/trust',
    '@type': 'TrustScore',
    value: score.trustScore,
    confidence_band: score.confidenceBand,
    drivers: score.trustDrivers,
    factors: {
      source_authority: score.factors.sourceAuthority,
      historical_accuracy: score.factors.historicalAccuracy,
      update_discipline: score.factors.updateDiscipline,
      schema_consistency: score.factors.schemaConsistency,
      cross_source_agreement: score.factors.crossSourceAgreement,
      revision_transparency: score.factors.revisionTransparency,
      agent_reuse_frequency: score.factors.agentReuseFrequency,
    },
    calculated_at: score.calculatedAt,
  };
}

/**
 * Format revision history for machine-readable output
 */
export function formatRevisionLogOutput(
  entityType: string,
  entityId: string,
  revisions: RevisionEntry[]
): RevisionLogOutput {
  return {
    '@context': 'https://dissg.global/schema/revision',
    '@type': 'RevisionHistory',
    entity_type: entityType,
    entity_id: entityId,
    total_revisions: revisions.length,
    revisions: revisions.map(r => ({
      date: r.createdAt,
      change: describeChange(r),
      reason: r.changeReason,
      impact: r.impactLevel,
    })),
  };
}

function describeChange(revision: RevisionEntry): string {
  switch (revision.changeType) {
    case 'value_correction':
      return `Value revised from ${JSON.stringify(revision.previousValue)} to ${JSON.stringify(revision.newValue)}`;
    case 'methodology_update':
      return 'Methodology updated';
    case 'source_revision':
      return 'Source data revised';
    case 'schema_change':
      return 'Schema structure changed';
    default:
      return 'Data updated';
  }
}

// ============================================
// TRUST SCORE MODIFIERS
// ============================================

/**
 * Adjust trust score based on anomaly detection
 */
export function adjustForAnomaly(
  currentScore: number,
  anomalyCount: number,
  resolutionRate: number
): number {
  // Unresolved anomalies reduce trust
  const anomalyPenalty = Math.min(anomalyCount * 0.02, 0.15);
  
  // High resolution rate partially offsets penalty
  const resolutionBonus = resolutionRate * anomalyPenalty * 0.5;
  
  return Math.max(0, currentScore - anomalyPenalty + resolutionBonus);
}

/**
 * Calculate trust impact of a revision
 */
export function calculateRevisionImpact(
  impactLevel: RevisionEntry['impactLevel'],
  wasTransparent: boolean
): number {
  const baseImpacts: Record<string, number> = {
    'none': 0,
    'low': -0.01,
    'medium': -0.03,
    'high': -0.08,
    'critical': -0.15,
  };
  
  const impact = baseImpacts[impactLevel] || 0;
  
  // Transparent revisions reduce negative impact by 60%
  return wasTransparent ? impact * 0.4 : impact;
}

// ============================================
// DEFAULT FACTOR PRESETS
// ============================================

/**
 * Default trust factors for different source authority levels
 */
export const AUTHORITY_PRESETS: Record<string, Partial<TrustFactors>> = {
  'Tier 1': {
    sourceAuthority: 0.95,
    historicalAccuracy: 0.90,
    updateDiscipline: 0.85,
    schemaConsistency: 0.90,
  },
  'Tier 2': {
    sourceAuthority: 0.80,
    historicalAccuracy: 0.75,
    updateDiscipline: 0.70,
    schemaConsistency: 0.75,
  },
  'Tier 3': {
    sourceAuthority: 0.60,
    historicalAccuracy: 0.60,
    updateDiscipline: 0.55,
    schemaConsistency: 0.60,
  },
  'Tier 4': {
    sourceAuthority: 0.40,
    historicalAccuracy: 0.45,
    updateDiscipline: 0.40,
    schemaConsistency: 0.45,
  },
};

/**
 * Initialize trust factors with authority preset
 */
export function initializeTrustFactors(
  authorityLevel: string,
  overrides?: Partial<TrustFactors>
): TrustFactors {
  const preset = AUTHORITY_PRESETS[authorityLevel] || AUTHORITY_PRESETS['Tier 3'];
  
  return {
    sourceAuthority: preset.sourceAuthority ?? 0.50,
    historicalAccuracy: preset.historicalAccuracy ?? 0.50,
    updateDiscipline: preset.updateDiscipline ?? 0.50,
    schemaConsistency: preset.schemaConsistency ?? 0.50,
    crossSourceAgreement: 0.50,
    revisionTransparency: 0.50,
    agentReuseFrequency: 0.00, // Starts at 0, grows with usage
    ...overrides,
  };
}

// ============================================
// TRUST THRESHOLD CONSTANTS
// ============================================

export const TRUST_THRESHOLDS = {
  /** Minimum score for AI agents to safely autocite */
  SAFE_AUTOCITE: 0.85,
  
  /** Minimum score to be considered a "default answer candidate" */
  DEFAULT_CANDIDATE: 0.90,
  
  /** Score below which data should be flagged with warnings */
  LOW_CONFIDENCE_WARNING: 0.65,
  
  /** Score below which data should not be served to AI agents */
  AI_BLOCK_THRESHOLD: 0.50,
  
  /** Minimum citation rate to qualify as default candidate */
  MIN_CITATION_RATE: 0.80,
  
  /** Minimum fetches before considering for default status */
  MIN_FETCHES_FOR_DEFAULT: 1000,
};
