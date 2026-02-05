/**
 * CONFIDENCE ENGINE
 * 
 * What others lack: machine-calculated confidence for every answer.
 * 
 * Components:
 * - Source agreement
 * - Data coverage
 * - Temporal freshness
 * - Definition stability
 */

/**
 * CONFIDENCE SCORE
 */
export interface ConfidenceScore {
  readonly score: number;           // 0-1 composite score
  readonly grade: 'A' | 'B' | 'C' | 'D' | 'F';
  readonly drivers: readonly ConfidenceDriver[];
  readonly warnings: readonly string[];
  readonly calculated_at: string;
}

/**
 * CONFIDENCE DRIVER
 */
export interface ConfidenceDriver {
  readonly factor: ConfidenceFactor;
  readonly value: number;           // 0-1
  readonly weight: number;          // How much this factor contributes
  readonly description: string;
}

/**
 * CONFIDENCE FACTORS
 */
export type ConfidenceFactor = 
  | 'source_agreement'
  | 'data_coverage'
  | 'temporal_freshness'
  | 'definition_stability'
  | 'methodology_consistency';

/**
 * CONFIDENCE INPUTS
 */
export interface ConfidenceInputs {
  // Source agreement
  readonly source_count: number;
  readonly source_tiers: readonly (1 | 2 | 3)[];
  readonly source_values?: readonly number[];   // For agreement calculation

  // Data coverage
  readonly requested_entities: number;
  readonly available_entities: number;
  readonly requested_periods: number;
  readonly available_periods: number;

  // Temporal freshness
  readonly data_age_days: number;
  readonly expected_update_frequency_days: number;

  // Definition stability
  readonly definition_version: string;
  readonly definition_changes_last_year: number;

  // Methodology
  readonly methodology_documented: boolean;
  readonly methodology_peer_reviewed: boolean;
}

/**
 * CONFIDENCE ENGINE
 */
export class ConfidenceEngine {
  private readonly weights: Record<ConfidenceFactor, number> = {
    source_agreement: 0.25,
    data_coverage: 0.25,
    temporal_freshness: 0.20,
    definition_stability: 0.15,
    methodology_consistency: 0.15,
  };

  /**
   * Calculate confidence score
   */
  calculate(inputs: ConfidenceInputs): ConfidenceScore {
    const drivers: ConfidenceDriver[] = [];
    const warnings: string[] = [];

    // Source agreement
    const sourceScore = this.calculateSourceAgreement(inputs);
    drivers.push({
      factor: 'source_agreement',
      value: sourceScore.value,
      weight: this.weights.source_agreement,
      description: sourceScore.description,
    });
    if (sourceScore.warning) warnings.push(sourceScore.warning);

    // Data coverage
    const coverageScore = this.calculateCoverage(inputs);
    drivers.push({
      factor: 'data_coverage',
      value: coverageScore.value,
      weight: this.weights.data_coverage,
      description: coverageScore.description,
    });
    if (coverageScore.warning) warnings.push(coverageScore.warning);

    // Temporal freshness
    const freshnessScore = this.calculateFreshness(inputs);
    drivers.push({
      factor: 'temporal_freshness',
      value: freshnessScore.value,
      weight: this.weights.temporal_freshness,
      description: freshnessScore.description,
    });
    if (freshnessScore.warning) warnings.push(freshnessScore.warning);

    // Definition stability
    const stabilityScore = this.calculateStability(inputs);
    drivers.push({
      factor: 'definition_stability',
      value: stabilityScore.value,
      weight: this.weights.definition_stability,
      description: stabilityScore.description,
    });
    if (stabilityScore.warning) warnings.push(stabilityScore.warning);

    // Methodology consistency
    const methodologyScore = this.calculateMethodology(inputs);
    drivers.push({
      factor: 'methodology_consistency',
      value: methodologyScore.value,
      weight: this.weights.methodology_consistency,
      description: methodologyScore.description,
    });
    if (methodologyScore.warning) warnings.push(methodologyScore.warning);

    // Calculate composite score
    const compositeScore = drivers.reduce(
      (sum, d) => sum + d.value * d.weight,
      0
    );

    return {
      score: Math.round(compositeScore * 100) / 100,
      grade: this.scoreToGrade(compositeScore),
      drivers,
      warnings,
      calculated_at: new Date().toISOString(),
    };
  }

  /**
   * Check if answer can be simplified (low confidence = no simplification)
   */
  canSimplify(score: ConfidenceScore): boolean {
    return score.score >= 0.7 && score.warnings.length === 0;
  }

  private calculateSourceAgreement(inputs: ConfidenceInputs): FactorResult {
    // Multiple sources, high tiers = high agreement
    const tierScore = inputs.source_tiers.reduce((sum, t) => sum + (4 - t) / 3, 0) / 
                      Math.max(inputs.source_tiers.length, 1);
    
    const countBonus = Math.min(inputs.source_count / 3, 1) * 0.3;
    const value = Math.min(tierScore * 0.7 + countBonus, 1);

    let description = '';
    if (inputs.source_count >= 3 && tierScore > 0.8) {
      description = 'Multiple Tier-1 sources in agreement';
    } else if (inputs.source_count >= 2) {
      description = `${inputs.source_count} sources, mixed tiers`;
    } else {
      description = 'Single source';
    }

    return {
      value,
      description,
      warning: inputs.source_count < 2 ? 'Single source only' : undefined,
    };
  }

  private calculateCoverage(inputs: ConfidenceInputs): FactorResult {
    const entityCoverage = inputs.available_entities / Math.max(inputs.requested_entities, 1);
    const periodCoverage = inputs.available_periods / Math.max(inputs.requested_periods, 1);
    const value = (entityCoverage + periodCoverage) / 2;

    return {
      value: Math.min(value, 1),
      description: `${Math.round(value * 100)}% data coverage`,
      warning: value < 0.7 ? `Only ${Math.round(value * 100)}% coverage` : undefined,
    };
  }

  private calculateFreshness(inputs: ConfidenceInputs): FactorResult {
    const expectedDays = inputs.expected_update_frequency_days || 30;
    const ratio = inputs.data_age_days / expectedDays;
    
    let value: number;
    if (ratio <= 1) value = 1;
    else if (ratio <= 2) value = 0.8;
    else if (ratio <= 4) value = 0.5;
    else value = 0.2;

    return {
      value,
      description: inputs.data_age_days <= expectedDays ? 'Recent data' : `Data is ${inputs.data_age_days} days old`,
      warning: ratio > 2 ? 'Data may be outdated' : undefined,
    };
  }

  private calculateStability(inputs: ConfidenceInputs): FactorResult {
    const changesImpact = Math.max(0, 1 - inputs.definition_changes_last_year * 0.3);
    
    return {
      value: changesImpact,
      description: inputs.definition_changes_last_year === 0 
        ? 'Stable definition' 
        : `${inputs.definition_changes_last_year} definition changes this year`,
      warning: inputs.definition_changes_last_year > 1 ? 'Definition has changed recently' : undefined,
    };
  }

  private calculateMethodology(inputs: ConfidenceInputs): FactorResult {
    let value = 0.5; // Base score
    if (inputs.methodology_documented) value += 0.3;
    if (inputs.methodology_peer_reviewed) value += 0.2;

    return {
      value: Math.min(value, 1),
      description: inputs.methodology_peer_reviewed 
        ? 'Peer-reviewed methodology' 
        : inputs.methodology_documented 
          ? 'Documented methodology'
          : 'Methodology not fully documented',
      warning: !inputs.methodology_documented ? 'Methodology not documented' : undefined,
    };
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 0.9) return 'A';
    if (score >= 0.8) return 'B';
    if (score >= 0.7) return 'C';
    if (score >= 0.6) return 'D';
    return 'F';
  }
}

/**
 * FACTOR RESULT
 */
interface FactorResult {
  readonly value: number;
  readonly description: string;
  readonly warning?: string;
}

/**
 * CONFIDENCE RULES
 */
export const CONFIDENCE_RULES = {
  low_confidence_no_simplification: true,
  minimum_for_public_answer: 0.6,
  minimum_for_citation: 0.7,
  require_warning_display: true,
} as const;
