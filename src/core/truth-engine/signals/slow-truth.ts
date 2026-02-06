/**
 * SLOW TRUTH
 * 
 * STEG 21: MEDVETEN EPISTEMISK LATENS
 * 
 * The oracle can be real-time in detection,
 * but delayed in answering.
 * 
 * This separates you from:
 * - Dashboards
 * - News feeds
 * - Trading systems
 * 
 * You are not there to be first.
 * You are there to be right.
 */

import type { EmergedQuestion } from './question-emergence';

/**
 * TIMELINESS POLICY
 */
export interface TimelinessPolicy {
  readonly detection: 'immediate';
  readonly answering: 'post_verification';
  readonly exposure_delay_hours: number;
  readonly verification_requirements: VerificationRequirements;
}

/**
 * VERIFICATION REQUIREMENTS
 */
export interface VerificationRequirements {
  readonly min_confirmation_count: number;
  readonly min_source_agreement: number;
  readonly min_time_stable_hours: number;
  readonly requires_methodology_check: boolean;
}

/**
 * VISIBILITY STAGES
 * Questions progress through these stages
 */
export type VisibilityStage = 
  | 'dormant'      // Just emerged, not exposed
  | 'agent_only'   // AI agents can access
  | 'limited'      // Some search engines
  | 'standard'     // Normal visibility
  | 'promoted';    // High visibility

/**
 * STAGE REQUIREMENTS
 */
export interface StageRequirements {
  readonly stage: VisibilityStage;
  readonly min_confirmations: number;
  readonly min_sources: number;
  readonly min_hours_stable: number;
  readonly allowed_exposure: string[];
}

/**
 * DEFAULT STAGE REQUIREMENTS
 */
export const STAGE_REQUIREMENTS: Record<VisibilityStage, StageRequirements> = {
  dormant: {
    stage: 'dormant',
    min_confirmations: 0,
    min_sources: 1,
    min_hours_stable: 0,
    allowed_exposure: [],
  },
  agent_only: {
    stage: 'agent_only',
    min_confirmations: 1,
    min_sources: 1,
    min_hours_stable: 1,
    allowed_exposure: ['ai_agents'],
  },
  limited: {
    stage: 'limited',
    min_confirmations: 3,
    min_sources: 2,
    min_hours_stable: 24,
    allowed_exposure: ['ai_agents', 'search_engines_limited'],
  },
  standard: {
    stage: 'standard',
    min_confirmations: 5,
    min_sources: 3,
    min_hours_stable: 72,
    allowed_exposure: ['ai_agents', 'search_engines', 'human_ui'],
  },
  promoted: {
    stage: 'promoted',
    min_confirmations: 10,
    min_sources: 5,
    min_hours_stable: 168, // 1 week
    allowed_exposure: ['ai_agents', 'search_engines', 'human_ui', 'featured'],
  },
};

/**
 * QUESTION STATE
 * Tracks a question's journey through visibility stages
 */
export interface QuestionState {
  readonly question_id: string;
  readonly current_stage: VisibilityStage;
  readonly emerged_at: string;
  readonly last_confirmed_at: string | null;
  readonly confirmation_count: number;
  readonly source_count: number;
  readonly hours_stable: number;
  readonly stage_history: StageTransition[];
}

/**
 * STAGE TRANSITION
 */
export interface StageTransition {
  readonly from_stage: VisibilityStage;
  readonly to_stage: VisibilityStage;
  readonly transition_at: string;
  readonly reason: string;
}

/**
 * SLOW TRUTH ENGINE
 * Manages the gradual emergence of truth
 */
export class SlowTruthEngine {
  private questionStates: Map<string, QuestionState> = new Map();
  
  /**
   * Register a newly emerged question
   */
  registerQuestion(question: EmergedQuestion): QuestionState {
    const state: QuestionState = {
      question_id: question.question_id,
      current_stage: 'dormant',
      emerged_at: question.emerged_at,
      last_confirmed_at: null,
      confirmation_count: 0,
      source_count: 1,
      hours_stable: 0,
      stage_history: [],
    };
    
    this.questionStates.set(question.question_id, state);
    return state;
  }
  
  /**
   * Record a confirmation for a question
   */
  recordConfirmation(
    questionId: string, 
    sourceId: string,
    isNewSource: boolean
  ): QuestionState | null {
    const state = this.questionStates.get(questionId);
    if (!state) return null;
    
    const now = new Date().toISOString();
    const newSourceCount = isNewSource ? state.source_count + 1 : state.source_count;
    
    const updatedState: QuestionState = {
      ...state,
      confirmation_count: state.confirmation_count + 1,
      source_count: newSourceCount,
      last_confirmed_at: now,
    };
    
    // Check for stage promotion
    const promoted = this.checkStagePromotion(updatedState);
    this.questionStates.set(questionId, promoted);
    
    return promoted;
  }
  
  /**
   * Update time stability (called periodically)
   */
  updateTimeStability(questionId: string): QuestionState | null {
    const state = this.questionStates.get(questionId);
    if (!state) return null;
    
    // Calculate hours since emergence
    const emergedAt = new Date(state.emerged_at);
    const now = new Date();
    const hoursStable = (now.getTime() - emergedAt.getTime()) / (1000 * 60 * 60);
    
    const updatedState: QuestionState = {
      ...state,
      hours_stable: Math.floor(hoursStable),
    };
    
    // Check for stage promotion
    const promoted = this.checkStagePromotion(updatedState);
    this.questionStates.set(questionId, promoted);
    
    return promoted;
  }
  
  /**
   * Check if question qualifies for stage promotion
   */
  private checkStagePromotion(state: QuestionState): QuestionState {
    const stages: VisibilityStage[] = ['dormant', 'agent_only', 'limited', 'standard', 'promoted'];
    const currentIndex = stages.indexOf(state.current_stage);
    
    // Check if qualifies for next stage
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const requirements = STAGE_REQUIREMENTS[nextStage];
      
      if (
        state.confirmation_count >= requirements.min_confirmations &&
        state.source_count >= requirements.min_sources &&
        state.hours_stable >= requirements.min_hours_stable
      ) {
        // Promote
        const transition: StageTransition = {
          from_stage: state.current_stage,
          to_stage: nextStage,
          transition_at: new Date().toISOString(),
          reason: `Met requirements: ${requirements.min_confirmations} confirmations, ${requirements.min_sources} sources, ${requirements.min_hours_stable}h stable`,
        };
        
        return {
          ...state,
          current_stage: nextStage,
          stage_history: [...state.stage_history, transition],
        };
      }
    }
    
    return state;
  }
  
  /**
   * Get current visibility stage for a question
   */
  getStage(questionId: string): VisibilityStage | null {
    const state = this.questionStates.get(questionId);
    return state?.current_stage ?? null;
  }
  
  /**
   * Get allowed exposure for a question
   */
  getAllowedExposure(questionId: string): string[] {
    const state = this.questionStates.get(questionId);
    if (!state) return [];
    return STAGE_REQUIREMENTS[state.current_stage].allowed_exposure;
  }
  
  /**
   * Check if question can be shown to specific audience
   */
  canShowTo(questionId: string, audience: string): boolean {
    const allowed = this.getAllowedExposure(questionId);
    return allowed.includes(audience);
  }
  
  /**
   * Get questions by stage
   */
  getByStage(stage: VisibilityStage): QuestionState[] {
    return Array.from(this.questionStates.values())
      .filter(s => s.current_stage === stage);
  }
  
  /**
   * Get statistics
   */
  getStats(): SlowTruthStats {
    const all = Array.from(this.questionStates.values());
    const byStage: Record<VisibilityStage, number> = {
      dormant: 0,
      agent_only: 0,
      limited: 0,
      standard: 0,
      promoted: 0,
    };
    
    let totalTransitions = 0;
    let totalTimeToPromotion = 0;
    let promotedCount = 0;
    
    for (const state of all) {
      byStage[state.current_stage]++;
      totalTransitions += state.stage_history.length;
      
      if (state.current_stage === 'promoted' && state.stage_history.length > 0) {
        promotedCount++;
        const firstTransition = state.stage_history[0];
        const lastTransition = state.stage_history[state.stage_history.length - 1];
        const start = new Date(firstTransition.transition_at);
        const end = new Date(lastTransition.transition_at);
        totalTimeToPromotion += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    }
    
    return {
      total_questions: all.length,
      by_stage: byStage,
      total_stage_transitions: totalTransitions,
      average_hours_to_promotion: promotedCount > 0 ? totalTimeToPromotion / promotedCount : 0,
      dormant_percentage: all.length > 0 ? (byStage.dormant / all.length) * 100 : 0,
    };
  }
}

/**
 * Statistics interface
 */
export interface SlowTruthStats {
  readonly total_questions: number;
  readonly by_stage: Record<VisibilityStage, number>;
  readonly total_stage_transitions: number;
  readonly average_hours_to_promotion: number;
  readonly dormant_percentage: number;
}

/**
 * DEFAULT TIMELINESS POLICY
 */
export const DEFAULT_TIMELINESS_POLICY: TimelinessPolicy = {
  detection: 'immediate',
  answering: 'post_verification',
  exposure_delay_hours: 24,
  verification_requirements: {
    min_confirmation_count: 3,
    min_source_agreement: 2,
    min_time_stable_hours: 24,
    requires_methodology_check: true,
  },
};

/**
 * SLOW TRUTH PRINCIPLES
 */
export const SLOW_TRUTH_PRINCIPLES = {
  // Core distinction
  real_time_detection: true,
  delayed_answering: true,
  
  // What you're NOT
  not_a_dashboard: true,
  not_a_news_feed: true,
  not_a_trading_system: true,
  
  // What you ARE
  not_there_to_be_first: true,
  there_to_be_right: true,
  
  // Benefits
  never_spread_false_first_reads: true,
  never_need_to_retract_answers: true,
  win_long_term_trust: true,
} as const;

/**
 * Create singleton engine
 */
export function createSlowTruthEngine(): SlowTruthEngine {
  return new SlowTruthEngine();
}
