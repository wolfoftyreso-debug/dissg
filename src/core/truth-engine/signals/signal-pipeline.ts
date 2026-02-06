/**
 * SIGNAL PIPELINE
 * 
 * STEG 21: KOMPLETT SIGNAL → FRÅGA PIPELINE
 * 
 * Signal → Signal Classification → Problem Object Update →
 * CQ Template Selection → New CQ Instantiation → Slow Truth Registration
 * 
 * Världen genererar själv sin frågestruktur –
 * och oraklet registrerar den.
 * 
 * This is extreme scalability.
 */

import type { Signal, SignalClassification } from './signal-types';
import type { EmergedQuestion } from './question-emergence';
import { QuestionEmergenceEngine } from './question-emergence';
import type { QuestionState, VisibilityStage } from './slow-truth';
import { SlowTruthEngine } from './slow-truth';

/**
 * PIPELINE RESULT
 */
export interface PipelineResult {
  readonly signal_id: string;
  readonly signal_type: string;
  readonly processed_at: string;
  
  // Classification
  readonly classification: {
    readonly eligible: boolean;
    readonly reason: string;
  };
  
  // Emergence
  readonly question_emerged: boolean;
  readonly emerged_question: EmergedQuestion | null;
  
  // Slow truth registration
  readonly registered: boolean;
  readonly initial_stage: VisibilityStage | null;
  
  // Summary
  readonly pipeline_status: 'complete' | 'filtered' | 'error';
  readonly error?: string;
}

/**
 * PIPELINE STATISTICS
 */
export interface PipelineStats {
  readonly signals_processed: number;
  readonly questions_emerged: number;
  readonly questions_filtered: number;
  readonly by_signal_type: Record<string, number>;
  readonly emergence_rate: number;
  readonly average_processing_time_ms: number;
}

/**
 * SIGNAL PIPELINE
 * Complete pipeline from signal detection to question emergence
 */
export class SignalPipeline {
  private emergenceEngine = new QuestionEmergenceEngine();
  private slowTruthEngine = new SlowTruthEngine();
  
  // Statistics
  private signalsProcessed = 0;
  private questionsEmerged = 0;
  private questionsFiltered = 0;
  private bySignalType: Record<string, number> = {};
  private totalProcessingTime = 0;
  
  /**
   * Process a signal through the complete pipeline
   */
  process(signal: Signal): PipelineResult {
    const startTime = Date.now();
    const processedAt = new Date().toISOString();
    
    this.signalsProcessed++;
    this.bySignalType[signal.type] = (this.bySignalType[signal.type] || 0) + 1;
    
    try {
      // Step 1: Classification
      const classification = this.classify(signal);
      
      if (!classification.eligible_for_question_generation) {
        this.questionsFiltered++;
        this.recordProcessingTime(startTime);
        
        return {
          signal_id: signal.signal_id,
          signal_type: signal.type,
          processed_at: processedAt,
          classification: {
            eligible: false,
            reason: classification.reason,
          },
          question_emerged: false,
          emerged_question: null,
          registered: false,
          initial_stage: null,
          pipeline_status: 'filtered',
        };
      }
      
      // Step 2: Question Emergence
      const emergedQuestion = this.emergenceEngine.processSignal(signal);
      
      if (!emergedQuestion) {
        this.questionsFiltered++;
        this.recordProcessingTime(startTime);
        
        return {
          signal_id: signal.signal_id,
          signal_type: signal.type,
          processed_at: processedAt,
          classification: {
            eligible: true,
            reason: classification.reason,
          },
          question_emerged: false,
          emerged_question: null,
          registered: false,
          initial_stage: null,
          pipeline_status: 'filtered',
        };
      }
      
      this.questionsEmerged++;
      
      // Step 3: Slow Truth Registration
      const questionState = this.slowTruthEngine.registerQuestion(emergedQuestion);
      
      this.recordProcessingTime(startTime);
      
      return {
        signal_id: signal.signal_id,
        signal_type: signal.type,
        processed_at: processedAt,
        classification: {
          eligible: true,
          reason: classification.reason,
        },
        question_emerged: true,
        emerged_question: emergedQuestion,
        registered: true,
        initial_stage: questionState.current_stage,
        pipeline_status: 'complete',
      };
      
    } catch (error) {
      this.recordProcessingTime(startTime);
      
      return {
        signal_id: signal.signal_id,
        signal_type: signal.type,
        processed_at: processedAt,
        classification: {
          eligible: false,
          reason: 'Error during processing',
        },
        question_emerged: false,
        emerged_question: null,
        registered: false,
        initial_stage: null,
        pipeline_status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Classify a signal
   */
  private classify(signal: Signal): SignalClassification {
    // Confidence check
    if (signal.confidence < 0.7) {
      return {
        signal,
        classification: {
          type: signal.type,
          severity: 'low',
          urgency: 'delayed',
          verification_required: true,
        },
        eligible_for_question_generation: false,
        reason: `Low confidence: ${signal.confidence}`,
      };
    }
    
    // Type-specific classification
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let urgency: 'immediate' | 'standard' | 'delayed' = 'standard';
    
    if (signal.type === 'anomaly') {
      const anom = signal as any;
      const sigma = Math.abs(anom.deviation?.sigma || 0);
      
      if (sigma >= 4.0) {
        severity = 'critical';
        urgency = 'immediate';
      } else if (sigma >= 3.0) {
        severity = 'high';
      } else if (sigma < 2.0) {
        return {
          signal,
          classification: {
            type: signal.type,
            severity: 'low',
            urgency: 'delayed',
            verification_required: true,
          },
          eligible_for_question_generation: false,
          reason: `Insufficient deviation: ${sigma}σ`,
        };
      }
    }
    
    if (signal.type === 'structural_change') {
      const struct = signal as any;
      if (struct.change?.impact_assessment === 'breaking') {
        severity = 'critical';
        urgency = 'immediate';
      }
    }
    
    return {
      signal,
      classification: {
        type: signal.type,
        severity,
        urgency,
        verification_required: severity !== 'critical',
      },
      eligible_for_question_generation: true,
      reason: `Eligible: ${severity} severity, ${urgency} urgency`,
    };
  }
  
  /**
   * Record processing time
   */
  private recordProcessingTime(startTime: number) {
    this.totalProcessingTime += Date.now() - startTime;
  }
  
  /**
   * Process multiple signals in batch
   */
  processBatch(signals: Signal[]): PipelineResult[] {
    return signals.map(signal => this.process(signal));
  }
  
  /**
   * Get pipeline statistics
   */
  getStats(): PipelineStats {
    return {
      signals_processed: this.signalsProcessed,
      questions_emerged: this.questionsEmerged,
      questions_filtered: this.questionsFiltered,
      by_signal_type: { ...this.bySignalType },
      emergence_rate: this.signalsProcessed > 0 
        ? this.questionsEmerged / this.signalsProcessed 
        : 0,
      average_processing_time_ms: this.signalsProcessed > 0
        ? this.totalProcessingTime / this.signalsProcessed
        : 0,
    };
  }
  
  /**
   * Get emergence engine
   */
  getEmergenceEngine(): QuestionEmergenceEngine {
    return this.emergenceEngine;
  }
  
  /**
   * Get slow truth engine
   */
  getSlowTruthEngine(): SlowTruthEngine {
    return this.slowTruthEngine;
  }
  
  /**
   * Record a confirmation (passthrough to slow truth)
   */
  recordConfirmation(questionId: string, sourceId: string, isNewSource: boolean): QuestionState | null {
    return this.slowTruthEngine.recordConfirmation(questionId, sourceId, isNewSource);
  }
  
  /**
   * Update time stability for all questions
   */
  updateAllTimeStability(): void {
    const questions = this.emergenceEngine.getAll();
    for (const q of questions) {
      this.slowTruthEngine.updateTimeStability(q.question_id);
    }
  }
}

/**
 * PIPELINE PRINCIPLES
 */
export const PIPELINE_PRINCIPLES = {
  // What the oracle does
  registers_change: true,
  never_chases_news: true,
  
  // The world generates its own question structure
  world_generates_questions: true,
  oracle_registers_them: true,
  
  // Extreme scalability
  no_manual_roadmap: true,
  no_what_to_cover_next: true,
  no_trend_chasing: true,
  
  // Result
  extreme_scalability: true,
} as const;

/**
 * STEG 21 OUTCOMES
 */
export const STEG_21_OUTCOMES = {
  // What you have
  system_discovers_new_questions_itself: true,
  zero_speculation: true,
  zero_reactivity: true,
  maximum_long_term_relevance: true,
  
  // What you built
  an_oracle_that_listens: true,
  not_an_oracle_that_reacts: true,
} as const;

/**
 * Create singleton pipeline
 */
export function createSignalPipeline(): SignalPipeline {
  return new SignalPipeline();
}
