/**
 * DEFENSIBILITY THRESHOLD
 * 
 * System answers: "How hard would it have been to understand
 * the consequences before the decision?"
 * 
 * - Easy → Decision extremely hard to defend
 * - Moderate → Requires strong justification
 * - Hard → Reasonable uncertainty
 * 
 * This is objective accountability measurement, not morality.
 */

import { contextFreeze } from './decision-context-freeze';

/**
 * DIFFICULTY LEVEL
 */
export type UnderstandingDifficulty =
  | 'trivial'      // Consequences were obvious
  | 'easy'         // Required minimal effort to understand
  | 'moderate'     // Required deliberate analysis
  | 'hard'         // Required expert analysis
  | 'very_hard'    // Required specialized expertise
  | 'impossible';  // Could not reasonably be known

/**
 * DEFENSIBILITY RATING
 */
export type DefensibilityRating =
  | 'extremely_difficult'  // Trivial/Easy understanding
  | 'requires_justification'  // Moderate understanding
  | 'reasonable'           // Hard understanding
  | 'strong'               // Very hard understanding
  | 'complete';            // Impossible to have known

/**
 * DEFENSIBILITY ASSESSMENT
 */
export interface DefensibilityAssessment {
  decision_id: string;
  assessed_at: string;
  understanding_difficulty: UnderstandingDifficulty;
  defensibility_rating: DefensibilityRating;
  factors: {
    data_clarity: number;       // 0-1: How clear was the data?
    signal_strength: number;    // 0-1: How strong were warning signals?
    expert_consensus: number;   // 0-1: Was there expert agreement?
    historical_precedent: number; // 0-1: Were similar outcomes known?
    time_available: number;     // 0-1: Was there time to analyze?
    resources_available: number; // 0-1: Were resources available?
  };
  composite_score: number;
  structural_analysis: string;
}

/**
 * DEFENSIBILITY ENGINE
 */
class DefensibilityThresholdEngine {
  private assessments: Map<string, DefensibilityAssessment> = new Map();

  /**
   * ASSESS DEFENSIBILITY
   */
  assessDefensibility(
    decisionId: string,
    factors: Partial<DefensibilityAssessment['factors']>
  ): DefensibilityAssessment {
    const snapshots = contextFreeze.getSnapshotsForDecision(decisionId);
    const hasSnapshot = snapshots.length > 0;
    
    // Default factors if not provided
    const fullFactors: DefensibilityAssessment['factors'] = {
      data_clarity: factors.data_clarity ?? (hasSnapshot ? 0.7 : 0.3),
      signal_strength: factors.signal_strength ?? 0.5,
      expert_consensus: factors.expert_consensus ?? 0.5,
      historical_precedent: factors.historical_precedent ?? 0.4,
      time_available: factors.time_available ?? 0.6,
      resources_available: factors.resources_available ?? 0.7,
    };
    
    // Calculate composite score (higher = harder to understand)
    const weights = {
      data_clarity: 0.25,
      signal_strength: 0.2,
      expert_consensus: 0.15,
      historical_precedent: 0.15,
      time_available: 0.15,
      resources_available: 0.1,
    };
    
    // Invert clarity factors (high clarity = easy to understand = low score)
    const composite = 1 - (
      fullFactors.data_clarity * weights.data_clarity +
      fullFactors.signal_strength * weights.signal_strength +
      fullFactors.expert_consensus * weights.expert_consensus +
      fullFactors.historical_precedent * weights.historical_precedent +
      fullFactors.time_available * weights.time_available +
      fullFactors.resources_available * weights.resources_available
    );
    
    // Determine difficulty
    let difficulty: UnderstandingDifficulty;
    if (composite < 0.2) difficulty = 'trivial';
    else if (composite < 0.35) difficulty = 'easy';
    else if (composite < 0.5) difficulty = 'moderate';
    else if (composite < 0.7) difficulty = 'hard';
    else if (composite < 0.85) difficulty = 'very_hard';
    else difficulty = 'impossible';
    
    // Map to defensibility
    const defensibility = this.mapToDefensibility(difficulty);
    
    const assessment: DefensibilityAssessment = {
      decision_id: decisionId,
      assessed_at: new Date().toISOString(),
      understanding_difficulty: difficulty,
      defensibility_rating: defensibility,
      factors: fullFactors,
      composite_score: composite,
      structural_analysis: this.generateAnalysis(difficulty, defensibility, fullFactors),
    };
    
    this.assessments.set(decisionId, assessment);
    return assessment;
  }

  /**
   * MAP TO DEFENSIBILITY
   */
  private mapToDefensibility(difficulty: UnderstandingDifficulty): DefensibilityRating {
    switch (difficulty) {
      case 'trivial':
      case 'easy':
        return 'extremely_difficult';
      case 'moderate':
        return 'requires_justification';
      case 'hard':
        return 'reasonable';
      case 'very_hard':
        return 'strong';
      case 'impossible':
        return 'complete';
    }
  }

  /**
   * GENERATE ANALYSIS
   */
  private generateAnalysis(
    difficulty: UnderstandingDifficulty,
    defensibility: DefensibilityRating,
    factors: DefensibilityAssessment['factors']
  ): string {
    const lines: string[] = [];
    
    switch (defensibility) {
      case 'extremely_difficult':
        lines.push('The consequences of this decision were foreseeable with minimal effort.');
        break;
      case 'requires_justification':
        lines.push('Understanding the consequences required deliberate analysis.');
        lines.push('A strong justification is needed for proceeding without such analysis.');
        break;
      case 'reasonable':
        lines.push('The consequences required expert-level analysis to anticipate.');
        lines.push('Reasonable actors may have reached different conclusions.');
        break;
      case 'strong':
        lines.push('Anticipating the consequences required specialized expertise.');
        lines.push('Most actors would not have foreseen the outcomes.');
        break;
      case 'complete':
        lines.push('The consequences could not reasonably have been anticipated.');
        lines.push('Available information was insufficient for prediction.');
        break;
    }
    
    // Add factor-specific notes
    if (factors.data_clarity > 0.8) {
      lines.push('Note: Data clarity was high at decision time.');
    }
    if (factors.signal_strength > 0.8) {
      lines.push('Note: Warning signals were strong and visible.');
    }
    if (factors.historical_precedent > 0.7) {
      lines.push('Note: Historical precedent for similar outcomes existed.');
    }
    if (factors.time_available < 0.3) {
      lines.push('Mitigating: Time pressure was significant.');
    }
    
    return lines.join(' ');
  }

  /**
   * GET ASSESSMENT
   */
  getAssessment(decisionId: string): DefensibilityAssessment | null {
    return this.assessments.get(decisionId) || null;
  }

  /**
   * COMPARE DECISIONS
   */
  compareDecisions(decisionIds: string[]): Array<{
    decision_id: string;
    difficulty: UnderstandingDifficulty;
    defensibility: DefensibilityRating;
    score: number;
  }> {
    return decisionIds
      .map(id => {
        const assessment = this.assessments.get(id);
        if (!assessment) return null;
        return {
          decision_id: id,
          difficulty: assessment.understanding_difficulty,
          defensibility: assessment.defensibility_rating,
          score: assessment.composite_score,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => a.score - b.score);
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_assessments: number;
    by_defensibility: Record<DefensibilityRating, number>;
    average_score: number;
  } {
    const byRating: Record<DefensibilityRating, number> = {
      extremely_difficult: 0,
      requires_justification: 0,
      reasonable: 0,
      strong: 0,
      complete: 0,
    };
    
    let totalScore = 0;
    this.assessments.forEach(a => {
      byRating[a.defensibility_rating]++;
      totalScore += a.composite_score;
    });
    
    return {
      total_assessments: this.assessments.size,
      by_defensibility: byRating,
      average_score: this.assessments.size > 0 ? totalScore / this.assessments.size : 0,
    };
  }
}

/**
 * SINGLETON
 */
export const defensibilityThreshold = new DefensibilityThresholdEngine();

/**
 * PRINCIPLES
 */
export const DEFENSIBILITY_PRINCIPLES = {
  objective_measurement: true,
  no_moral_judgment: true,
  difficulty_maps_to_defense: true,
  factors_are_structural: true,
} as const;
