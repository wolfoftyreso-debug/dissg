/**
 * QUERY PRESSURE → ANSWER LOOP
 * 
 * Top unanswered measurable questions → mapped to nodes or gaps.
 * System stays ahead of demand.
 */

import { queryPressureEngine, type QueryPressureSignal, type UnansweredQuestion } from './query-pressure-engine';
import { knowledgeGapFactory, type KnowledgeGap } from './knowledge-gap-factory';

/**
 * QUERY MAPPING RESULT
 */
export interface QueryMappingResult {
  question: string;
  status: 'answered' | 'gap_identified' | 'out_of_scope';
  mapped_nodes: string[];
  gap?: KnowledgeGap;
  priority: number;
}

/**
 * ANSWER LOOP STATE
 */
export interface AnswerLoopState {
  total_queries_processed: number;
  answered_count: number;
  gap_count: number;
  out_of_scope_count: number;
  last_run: string;
  top_pressure_points: QueryPressureSignal[];
}

/**
 * EXISTING NODE REGISTRY (simplified)
 */
const EXISTING_NODES: Record<string, string[]> = {
  'unemployment': ['LBR:UNEMP:TOTAL', 'LBR:UNEMP:YOUTH', 'LBR:UNEMP:LONG_TERM'],
  'housing': ['HSG:SHORTAGE:RELATIVE', 'HSG:AFFORD:PRICE_INCOME', 'HSG:CROWD:RATE'],
  'education': ['EDU:CLASS_SIZE:PRIMARY', 'EDU:TEACHER_SHORTAGE', 'EDU:ABSENCE_RATE:PRIMARY'],
  'health': ['HLTH:LOAD:TOTAL', 'HLTH:WAIT:PRIMARY', 'HLTH:CAPACITY:BEDS'],
  'demographics': ['DEMO:DEPENDENCY:RATIO', 'DEMO:AGE:MEDIAN', 'DEMO:POPULATION:TOTAL'],
};

/**
 * QUERY ANSWER LOOP
 */
class QueryAnswerLoop {
  private mappings: QueryMappingResult[] = [];
  private state: AnswerLoopState = {
    total_queries_processed: 0,
    answered_count: 0,
    gap_count: 0,
    out_of_scope_count: 0,
    last_run: new Date().toISOString(),
    top_pressure_points: [],
  };

  /**
   * PROCESS TOP QUERIES
   */
  processTopQueries(limit: number = 100): QueryMappingResult[] {
    const topPressure = queryPressureEngine.getTopPressurePoints(limit);
    const unanswered = queryPressureEngine.getPrioritizedUnanswered(limit);
    
    this.state.top_pressure_points = topPressure;
    this.mappings = [];
    
    for (const question of unanswered) {
      const result = this.mapQuestion(question);
      this.mappings.push(result);
      
      if (result.status === 'answered') {
        this.state.answered_count++;
      } else if (result.status === 'gap_identified') {
        this.state.gap_count++;
      } else {
        this.state.out_of_scope_count++;
      }
    }
    
    this.state.total_queries_processed = this.mappings.length;
    this.state.last_run = new Date().toISOString();
    
    return this.mappings;
  }

  /**
   * MAP QUESTION TO NODES OR GAPS
   */
  private mapQuestion(question: UnansweredQuestion): QueryMappingResult {
    // Check if we have nodes for this domain
    const domains = question.domains_touched;
    const matchedNodes: string[] = [];
    
    for (const domain of domains) {
      const domainKey = domain.toLowerCase();
      if (EXISTING_NODES[domainKey]) {
        matchedNodes.push(...EXISTING_NODES[domainKey]);
      }
    }
    
    // If we have nodes, question can be answered
    if (matchedNodes.length > 0) {
      return {
        question: question.question_pattern,
        status: 'answered',
        mapped_nodes: matchedNodes,
        priority: question.priority_score,
      };
    }
    
    // If out of scope, mark as such
    if (question.gap_classification === 'out_of_scope') {
      return {
        question: question.question_pattern,
        status: 'out_of_scope',
        mapped_nodes: [],
        priority: question.priority_score,
      };
    }
    
    // Otherwise, register as knowledge gap
    const gap = this.registerGap(question);
    
    return {
      question: question.question_pattern,
      status: 'gap_identified',
      mapped_nodes: [],
      gap,
      priority: question.priority_score,
    };
  }

  /**
   * REGISTER KNOWLEDGE GAP
   */
  private registerGap(question: UnansweredQuestion): KnowledgeGap {
    const domain = question.domains_touched[0] || 'unknown';
    
    switch (question.gap_classification) {
      case 'data_gap':
        return knowledgeGapFactory.registerDataGap({
          question: question.question_pattern,
          domain,
          sources_needed: ['source_1', 'source_2', 'source_3'],
          sources_available: [],
        });
        
      case 'method_gap':
        return knowledgeGapFactory.registerMethodGap({
          question: question.question_pattern,
          domain,
          alternative_approaches: [],
          complexity: 'medium',
        });
        
      case 'definition_problem':
        return knowledgeGapFactory.registerDefinitionGap({
          question: question.question_pattern,
          domain,
          ambiguity: 'Term lacks canonical definition',
          conflicting_definitions: [],
        });
        
      default:
        return knowledgeGapFactory.registerDataGap({
          question: question.question_pattern,
          domain,
          sources_needed: ['unknown'],
          sources_available: [],
        });
    }
  }

  /**
   * GET STATE
   */
  getState(): AnswerLoopState {
    return { ...this.state };
  }

  /**
   * GET PRIORITY GAPS
   */
  getPriorityGaps(): QueryMappingResult[] {
    return this.mappings
      .filter(m => m.status === 'gap_identified')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 20);
  }

  /**
   * GET PUBLIC GAP REPORT
   */
  getPublicGapReport(): string {
    const gaps = this.getPriorityGaps();
    
    if (gaps.length === 0) {
      return 'No knowledge gaps currently registered.';
    }
    
    const lines = [
      'KNOWLEDGE GAPS — Cannot be answered yet',
      '═'.repeat(50),
      '',
    ];
    
    for (const gap of gaps) {
      const gapType = gap.gap?.gap_type || 'unknown';
      const reason = gap.gap?.resolution_path || 'Resolution path undefined';
      
      lines.push(`• ${gap.question}`);
      lines.push(`  Type: ${gapType}`);
      lines.push(`  Why: ${reason}`);
      lines.push('');
    }
    
    return lines.join('\n');
  }

  /**
   * INGEST SAMPLE QUERIES
   */
  ingestSampleQueries(): void {
    const sampleSignals: Omit<QueryPressureSignal, 'first_seen'>[] = [
      { query_pattern: 'housing affordability trends', domain_hint: 'housing', frequency_30d: 1240, answerable: true, gap_type: null, societal_impact: 0.9, trend: 'rising' },
      { query_pattern: 'teacher shortage by region', domain_hint: 'education', frequency_30d: 890, answerable: true, gap_type: null, societal_impact: 0.85, trend: 'rising' },
      { query_pattern: 'youth unemployment causes', domain_hint: 'labor', frequency_30d: 1100, answerable: false, gap_type: 'method', societal_impact: 0.88, trend: 'stable' },
      { query_pattern: 'mental health treatment wait times', domain_hint: 'health', frequency_30d: 2100, answerable: false, gap_type: 'data', societal_impact: 0.92, trend: 'rising' },
      { query_pattern: 'immigration economic impact', domain_hint: 'economy', frequency_30d: 3200, answerable: false, gap_type: 'definition', societal_impact: 0.75, trend: 'stable' },
      { query_pattern: 'climate adaptation costs', domain_hint: 'environment', frequency_30d: 780, answerable: false, gap_type: 'data', societal_impact: 0.82, trend: 'rising' },
    ];
    
    for (const signal of sampleSignals) {
      queryPressureEngine.ingestSignal({
        ...signal,
        first_seen: new Date().toISOString(),
      });
    }
  }
}

/**
 * SINGLETON INSTANCE
 */
export const queryAnswerLoop = new QueryAnswerLoop();

/**
 * ANSWER LOOP PRINCIPLES
 */
export const ANSWER_LOOP_PRINCIPLES = {
  top_100_unanswered: true,
  maps_to_nodes_or_gaps: true,
  gaps_published_openly: true,
  system_stays_ahead: true,
  never_speculates: true,
} as const;
