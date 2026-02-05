/**
 * QUERY PRESSURE ENGINE
 * 
 * What the world is trying to get answers to.
 * The system always stays ahead of demand.
 */

/**
 * QUERY PRESSURE SIGNAL
 */
export interface QueryPressureSignal {
  query_pattern: string;
  domain_hint: string;
  frequency_30d: number;
  answerable: boolean;
  gap_type: 'data' | 'method' | 'definition' | 'scope' | null;
  societal_impact: number;  // 0-1
  first_seen: string;
  trend: 'rising' | 'stable' | 'falling';
}

/**
 * UNANSWERED QUESTION
 */
export interface UnansweredQuestion {
  question_pattern: string;
  normalized_form: string;
  frequency: number;
  domains_touched: string[];
  gap_classification: 'data_gap' | 'method_gap' | 'definition_problem' | 'out_of_scope';
  resolution_path: string | null;
  priority_score: number;
  first_asked: string;
}

/**
 * QUERY PRESSURE AGGREGATOR
 */
export class QueryPressureEngine {
  private signals: QueryPressureSignal[] = [];
  private unanswered: UnansweredQuestion[] = [];

  /**
   * INGEST QUERY SIGNAL
   */
  ingestSignal(signal: QueryPressureSignal): void {
    const existing = this.signals.find(s => s.query_pattern === signal.query_pattern);
    
    if (existing) {
      existing.frequency_30d = signal.frequency_30d;
      existing.trend = signal.trend;
    } else {
      this.signals.push(signal);
    }

    if (!signal.answerable) {
      this.registerUnanswered(signal);
    }
  }

  /**
   * REGISTER UNANSWERED QUESTION
   */
  private registerUnanswered(signal: QueryPressureSignal): void {
    const gapClassification = this.classifyGap(signal.gap_type);
    
    const question: UnansweredQuestion = {
      question_pattern: signal.query_pattern,
      normalized_form: this.normalizeQuestion(signal.query_pattern),
      frequency: signal.frequency_30d,
      domains_touched: [signal.domain_hint],
      gap_classification: gapClassification,
      resolution_path: this.suggestResolution(gapClassification),
      priority_score: signal.frequency_30d * signal.societal_impact,
      first_asked: signal.first_seen,
    };

    const existing = this.unanswered.find(u => u.normalized_form === question.normalized_form);
    if (!existing) {
      this.unanswered.push(question);
    }
  }

  /**
   * CLASSIFY GAP TYPE
   */
  private classifyGap(type: string | null): UnansweredQuestion['gap_classification'] {
    switch (type) {
      case 'data': return 'data_gap';
      case 'method': return 'method_gap';
      case 'definition': return 'definition_problem';
      default: return 'out_of_scope';
    }
  }

  /**
   * NORMALIZE QUESTION
   */
  private normalizeQuestion(pattern: string): string {
    return pattern
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 100);
  }

  /**
   * SUGGEST RESOLUTION PATH
   */
  private suggestResolution(gap: UnansweredQuestion['gap_classification']): string | null {
    switch (gap) {
      case 'data_gap':
        return 'Identify and integrate additional data sources';
      case 'method_gap':
        return 'Develop methodology for measurement';
      case 'definition_problem':
        return 'Establish clear ontological definition';
      case 'out_of_scope':
        return null;
    }
  }

  /**
   * GET TOP PRESSURE POINTS
   */
  getTopPressurePoints(limit: number = 20): QueryPressureSignal[] {
    return [...this.signals]
      .filter(s => !s.answerable)
      .sort((a, b) => (b.frequency_30d * b.societal_impact) - (a.frequency_30d * a.societal_impact))
      .slice(0, limit);
  }

  /**
   * GET PRIORITIZED UNANSWERED QUESTIONS
   */
  getPrioritizedUnanswered(limit: number = 50): UnansweredQuestion[] {
    return [...this.unanswered]
      .filter(u => u.gap_classification !== 'out_of_scope')
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, limit);
  }

  /**
   * GET DOMAIN DEMAND
   */
  getDomainDemand(): Record<string, number> {
    const demand: Record<string, number> = {};
    
    for (const signal of this.signals) {
      if (!demand[signal.domain_hint]) {
        demand[signal.domain_hint] = 0;
      }
      demand[signal.domain_hint] += signal.frequency_30d;
    }
    
    return demand;
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_signals: number;
    unanswered_count: number;
    top_domains: Array<{ domain: string; demand: number }>;
    rising_trends: number;
  } {
    const demand = this.getDomainDemand();
    
    return {
      total_signals: this.signals.length,
      unanswered_count: this.unanswered.length,
      top_domains: Object.entries(demand)
        .map(([domain, d]) => ({ domain, demand: d }))
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 10),
      rising_trends: this.signals.filter(s => s.trend === 'rising').length,
    };
  }
}

/**
 * SINGLETON INSTANCE
 */
export const queryPressureEngine = new QueryPressureEngine();

/**
 * ENGINE PRINCIPLES
 */
export const PRESSURE_ENGINE_PRINCIPLES = {
  tracks_what_world_asks: true,
  identifies_gaps: true,
  prioritizes_by_impact: true,
  stays_ahead_of_demand: true,
  never_guesses: true,
} as const;
