/**
 * QUESTION EMERGENCE
 * 
 * STEG 21: HOW SIGNALS BECOME QUESTIONS
 * 
 * Pipeline:
 * Signal → Classification → Problem Object Update → 
 * CQ Template Selection → New CQ Instantiation → Visibility = Low
 * 
 * The oracle is careful with novelty.
 * New questions are not exposed directly.
 * They are verified over time.
 * Visibility builds gradually.
 */

import type { 
  Signal, 
  SignalType, 
  AnomalySignal, 
  NewDimensionSignal,
  StructuralChangeSignal,
  CrossCouplingSignal,
} from './signal-types';

/**
 * EMERGED QUESTION
 * A question born from a signal
 */
export interface EmergedQuestion {
  readonly question_id: string;
  readonly source_signal_id: string;
  readonly signal_type: SignalType;
  
  // The generated question
  readonly canonical_text_en: string;
  readonly canonical_text_sv: string;
  
  // Core variables extracted from signal
  readonly core_variables: string[];
  readonly entity_scope: string;
  readonly domain: string;
  
  // Emergence metadata
  readonly emerged_at: string;
  readonly emergence_reason: string;
  
  // Initial state
  readonly initial_visibility: 'dormant';  // Always starts dormant
  readonly initial_exposure: 'agent_only'; // Never human UI initially
  readonly verification_status: 'pending';
  
  // Tracking for promotion
  readonly confirmation_count: number;
  readonly source_agreement_count: number;
  readonly time_stable_hours: number;
}

/**
 * QUESTION TEMPLATES
 * How different signal types map to question templates
 */
export const QUESTION_TEMPLATES: Record<string, { en: string; sv: string }> = {
  // Anomaly templates
  trend_deviation: {
    en: 'How has {variable} changed in {entity} compared to its historical trend?',
    sv: 'Hur har {variable} förändrats i {entity} jämfört med sin historiska trend?',
  },
  
  // New dimension templates
  now_available: {
    en: 'What does the newly available data show about {variable} in {scope}?',
    sv: 'Vad visar de nyligen tillgängliga uppgifterna om {variable} i {scope}?',
  },
  first_time_measured: {
    en: 'What is the first measurement of {variable} in {scope}?',
    sv: 'Vad är den första mätningen av {variable} i {scope}?',
  },
  expanded_coverage: {
    en: 'How does {variable} vary across the expanded coverage of {scope}?',
    sv: 'Hur varierar {variable} över den utökade täckningen av {scope}?',
  },
  
  // Structural change templates (meta-questions)
  methodology_change: {
    en: 'How did the measurement methodology for {variable} change in {entity} in {year}?',
    sv: 'Hur förändrades mätmetodiken för {variable} i {entity} år {year}?',
  },
  
  // Cross-coupling templates
  cross_domain_correlation: {
    en: 'What is the observed co-movement between {variable_a} and {variable_b}?',
    sv: 'Vilken samvariation observeras mellan {variable_a} och {variable_b}?',
  },
};

/**
 * QUESTION EMERGENCE ENGINE
 */
export class QuestionEmergenceEngine {
  private emergedQuestions: Map<string, EmergedQuestion> = new Map();
  
  /**
   * Process a signal and potentially generate a question
   */
  processSignal(signal: Signal): EmergedQuestion | null {
    // Validate signal eligibility
    if (!this.isEligibleForQuestionGeneration(signal)) {
      return null;
    }
    
    // Generate question based on signal type
    let question: EmergedQuestion;
    
    switch (signal.type) {
      case 'anomaly':
        question = this.generateFromAnomaly(signal as AnomalySignal);
        break;
      case 'new_dimension':
        question = this.generateFromNewDimension(signal as NewDimensionSignal);
        break;
      case 'structural_change':
        question = this.generateFromStructuralChange(signal as StructuralChangeSignal);
        break;
      case 'cross_coupling':
        question = this.generateFromCrossCoupling(signal as CrossCouplingSignal);
        break;
      default:
        return null;
    }
    
    // Store
    this.emergedQuestions.set(question.question_id, question);
    
    return question;
  }
  
  /**
   * Check if signal is eligible for question generation
   */
  private isEligibleForQuestionGeneration(signal: Signal): boolean {
    // Minimum confidence threshold
    if (signal.confidence < 0.7) return false;
    
    // Type-specific checks
    if (signal.type === 'anomaly') {
      const anom = signal as AnomalySignal;
      // Require significant deviation
      if (Math.abs(anom.deviation.sigma) < 2.0) return false;
    }
    
    return true;
  }
  
  /**
   * Generate question from anomaly signal
   */
  private generateFromAnomaly(signal: AnomalySignal): EmergedQuestion {
    const template = QUESTION_TEMPLATES.trend_deviation;
    
    const textEn = template.en
      .replace('{variable}', signal.variable)
      .replace('{entity}', signal.entity);
    
    const textSv = template.sv
      .replace('{variable}', signal.variable)
      .replace('{entity}', signal.entity);
    
    return {
      question_id: `Q-EMRG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source_signal_id: signal.signal_id,
      signal_type: 'anomaly',
      canonical_text_en: textEn,
      canonical_text_sv: textSv,
      core_variables: [signal.variable],
      entity_scope: signal.entity,
      domain: this.extractDomain(signal.variable),
      emerged_at: new Date().toISOString(),
      emergence_reason: `Statistical deviation of ${signal.deviation.sigma.toFixed(1)}σ detected`,
      initial_visibility: 'dormant',
      initial_exposure: 'agent_only',
      verification_status: 'pending',
      confirmation_count: 0,
      source_agreement_count: 1,
      time_stable_hours: 0,
    };
  }
  
  /**
   * Generate question from new dimension signal
   */
  private generateFromNewDimension(signal: NewDimensionSignal): EmergedQuestion {
    const templateKey = signal.question_template;
    const template = QUESTION_TEMPLATES[templateKey] || QUESTION_TEMPLATES.now_available;
    
    const textEn = template.en
      .replace('{variable}', signal.variable)
      .replace('{scope}', signal.scope);
    
    const textSv = template.sv
      .replace('{variable}', signal.variable)
      .replace('{scope}', signal.scope);
    
    return {
      question_id: `Q-EMRG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source_signal_id: signal.signal_id,
      signal_type: 'new_dimension',
      canonical_text_en: textEn,
      canonical_text_sv: textSv,
      core_variables: [signal.variable],
      entity_scope: signal.scope,
      domain: this.extractDomain(signal.variable),
      emerged_at: new Date().toISOString(),
      emergence_reason: `New ${signal.dimension_type} became available`,
      initial_visibility: 'dormant',
      initial_exposure: 'agent_only',
      verification_status: 'pending',
      confirmation_count: 0,
      source_agreement_count: 1,
      time_stable_hours: 0,
    };
  }
  
  /**
   * Generate question from structural change signal
   */
  private generateFromStructuralChange(signal: StructuralChangeSignal): EmergedQuestion {
    const template = QUESTION_TEMPLATES.methodology_change;
    const year = new Date(signal.change.effective_date).getFullYear().toString();
    
    const textEn = template.en
      .replace('{variable}', signal.variable)
      .replace('{entity}', signal.entity)
      .replace('{year}', year);
    
    const textSv = template.sv
      .replace('{variable}', signal.variable)
      .replace('{entity}', signal.entity)
      .replace('{year}', year);
    
    return {
      question_id: `Q-EMRG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source_signal_id: signal.signal_id,
      signal_type: 'structural_change',
      canonical_text_en: textEn,
      canonical_text_sv: textSv,
      core_variables: [signal.variable],
      entity_scope: signal.entity,
      domain: this.extractDomain(signal.variable),
      emerged_at: new Date().toISOString(),
      emergence_reason: `${signal.change_type} change detected`,
      initial_visibility: 'dormant',
      initial_exposure: 'agent_only',
      verification_status: 'pending',
      confirmation_count: 0,
      source_agreement_count: 1,
      time_stable_hours: 0,
    };
  }
  
  /**
   * Generate question from cross-coupling signal
   */
  private generateFromCrossCoupling(signal: CrossCouplingSignal): EmergedQuestion {
    const template = QUESTION_TEMPLATES.cross_domain_correlation;
    
    const textEn = template.en
      .replace('{variable_a}', signal.dataset_a.variable)
      .replace('{variable_b}', signal.dataset_b.variable);
    
    const textSv = template.sv
      .replace('{variable_a}', signal.dataset_a.variable)
      .replace('{variable_b}', signal.dataset_b.variable);
    
    return {
      question_id: `Q-EMRG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source_signal_id: signal.signal_id,
      signal_type: 'cross_coupling',
      canonical_text_en: textEn,
      canonical_text_sv: textSv,
      core_variables: [signal.dataset_a.variable, signal.dataset_b.variable],
      entity_scope: 'cross_domain',
      domain: `${signal.dataset_a.domain}+${signal.dataset_b.domain}`,
      emerged_at: new Date().toISOString(),
      emergence_reason: 'Cross-domain coupling became possible',
      initial_visibility: 'dormant',
      initial_exposure: 'agent_only',
      verification_status: 'pending',
      confirmation_count: 0,
      source_agreement_count: 1,
      time_stable_hours: 0,
    };
  }
  
  /**
   * Extract domain from variable name
   */
  private extractDomain(variable: string): string {
    const lowerVar = variable.toLowerCase();
    if (lowerVar.includes('unemployment') || lowerVar.includes('employment')) return 'labor';
    if (lowerVar.includes('gdp') || lowerVar.includes('tax')) return 'economy';
    if (lowerVar.includes('mortality') || lowerVar.includes('health')) return 'health';
    if (lowerVar.includes('education') || lowerVar.includes('school')) return 'education';
    if (lowerVar.includes('crime') || lowerVar.includes('safety')) return 'safety';
    return 'general';
  }
  
  /**
   * Get all emerged questions
   */
  getAll(): EmergedQuestion[] {
    return Array.from(this.emergedQuestions.values());
  }
  
  /**
   * Get pending verification questions
   */
  getPendingVerification(): EmergedQuestion[] {
    return this.getAll().filter(q => q.verification_status === 'pending');
  }
  
  /**
   * Get statistics
   */
  getStats(): QuestionEmergenceStats {
    const all = this.getAll();
    const byType: Record<SignalType, number> = {
      anomaly: 0,
      new_dimension: 0,
      structural_change: 0,
      cross_coupling: 0,
    };
    
    for (const q of all) {
      byType[q.signal_type]++;
    }
    
    return {
      total_emerged: all.length,
      pending_verification: all.filter(q => q.verification_status === 'pending').length,
      by_signal_type: byType,
      average_confirmation_count: all.length > 0 
        ? all.reduce((sum, q) => sum + q.confirmation_count, 0) / all.length 
        : 0,
    };
  }
}

/**
 * Statistics interface
 */
export interface QuestionEmergenceStats {
  readonly total_emerged: number;
  readonly pending_verification: number;
  readonly by_signal_type: Record<SignalType, number>;
  readonly average_confirmation_count: number;
}

/**
 * EMERGENCE PRINCIPLES
 */
export const EMERGENCE_PRINCIPLES = {
  // New questions always start
  initial_visibility: 'dormant',
  initial_exposure: 'agent_only',
  human_ui_exposure: 'never_initially',
  
  // Questions only climb if
  climb_requires: [
    'more_data_points_confirm_pattern',
    'multiple_sources_agree',
    'time_shows_stability',
  ],
  
  // Time is a signal
  time_is_a_signal: true,
  
  // The oracle is careful with novelty
  careful_with_novelty: true,
} as const;

/**
 * Create singleton engine
 */
export function createQuestionEmergenceEngine(): QuestionEmergenceEngine {
  return new QuestionEmergenceEngine();
}
