/**
 * DECISION GRAPH FACTORY
 * 
 * Auto-generates decision graphs based on decision type.
 * Takes a decision description and produces a complete question tree.
 * 
 * Factory CREATES structure, never DECIDES outcomes.
 */

import type { DecisionGraphSchemaV1, DecisionNodeSchema, DecisionScope, DecisionDomain } from '../schema/decision-graph-schema';

/**
 * Decision type blueprints
 */
export interface DecisionBlueprint {
  readonly type_id: string;
  readonly name: string;
  readonly description: string;
  readonly domains: readonly DecisionDomain[];
  readonly required_context: readonly string[];
  readonly question_patterns: readonly QuestionPattern[];
  readonly signal_types: readonly string[];
  readonly typical_assumptions: readonly string[];
}

interface QuestionPattern {
  readonly pattern_id: string;
  readonly question_template: string;
  readonly answer_type: string;
  readonly required: boolean;
  readonly confidence_threshold: number;
  readonly placeholders: readonly string[];
}

/**
 * REGISTERED BLUEPRINTS
 */
export const DECISION_BLUEPRINTS: Record<string, DecisionBlueprint> = {
  // INVESTMENT DECISIONS
  investment: {
    type_id: 'investment',
    name: 'Investment Decision',
    description: 'Capital allocation and infrastructure investment questions',
    domains: ['economy', 'markets', 'infrastructure'],
    required_context: ['sector', 'country', 'investment_horizon'],
    question_patterns: [
      { pattern_id: 'demand_trend', question_template: 'How has demand for {sector} changed over the past {period}?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, placeholders: ['sector', 'period'] },
      { pattern_id: 'volatility', question_template: 'How volatile is demand in {sector}?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, placeholders: ['sector'] },
      { pattern_id: 'regional', question_template: 'How does demand differ across regions in {country}?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.7, placeholders: ['country'] },
      { pattern_id: 'rate_corr', question_template: 'How does {sector} correlate with interest rates?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, placeholders: ['sector'] },
      { pattern_id: 'energy_corr', question_template: 'What is the relationship with energy prices?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'policy', question_template: 'What policy signals are relevant to {sector}?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.5, placeholders: ['sector'] },
      { pattern_id: 'competition', question_template: 'How has competitive landscape changed?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, placeholders: [] },
    ],
    signal_types: ['policy', 'media', 'events'],
    typical_assumptions: ['time_horizon', 'baseline_conditions', 'regulatory_stability'],
  },

  // HEALTHCARE PLANNING
  healthcare: {
    type_id: 'healthcare',
    name: 'Healthcare Resource Planning',
    description: 'Capacity, staffing, and resource allocation questions',
    domains: ['healthcare'],
    required_context: ['region', 'facility_type'],
    question_patterns: [
      { pattern_id: 'occupancy', question_template: 'What has been the historical bed occupancy rate in {region}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, placeholders: ['region'] },
      { pattern_id: 'wait_time', question_template: 'How have wait times trended over the past 3 years?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'regional_var', question_template: 'How does capacity utilization vary by region?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'seasonal', question_template: 'What are the seasonal demand patterns?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.8, placeholders: [] },
      { pattern_id: 'staffing', question_template: 'How is healthcare staffing trending?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'readmission', question_template: 'What are the current readmission rates?', answer_type: 'RISK_PREVALENCE', required: false, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'demographic', question_template: 'How is the patient demographic changing?', answer_type: 'TREND_CHANGE', required: false, confidence_threshold: 0.6, placeholders: [] },
    ],
    signal_types: ['events', 'policy'],
    typical_assumptions: ['population_growth', 'no_pandemic', 'staffing_trajectory'],
  },

  // POLICY DECISIONS
  policy: {
    type_id: 'policy',
    name: 'Policy Impact Assessment',
    description: 'Reform outcomes, system impacts, and historical precedent questions',
    domains: ['society', 'education'],
    required_context: ['country', 'policy_area'],
    question_patterns: [
      { pattern_id: 'precedent', question_template: 'What outcomes have similar reforms had historically?', answer_type: 'COMPARISON_CONDITIONAL', required: true, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'variation', question_template: 'What is the normal variation in {policy_area} outcomes?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, placeholders: ['policy_area'] },
      { pattern_id: 'correlation', question_template: 'How do outcomes correlate with key input factors?', answer_type: 'CORRELATION_OVERVIEW', required: true, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'affected', question_template: 'Which groups are most affected by system changes?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'dependencies', question_template: 'What other systems depend on current structure?', answer_type: 'CORRELATION_OVERVIEW', required: false, confidence_threshold: 0.5, placeholders: [] },
      { pattern_id: 'timeline', question_template: 'What is the typical implementation timeline for similar reforms?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.6, placeholders: [] },
    ],
    signal_types: ['policy', 'media'],
    typical_assumptions: ['implementation_fidelity', 'funding_maintained', 'political_stability'],
  },

  // MARKET ENTRY
  market_entry: {
    type_id: 'market_entry',
    name: 'Market Entry Analysis',
    description: 'Market sizing, competition, and entry barrier questions',
    domains: ['economy', 'markets'],
    required_context: ['market', 'country', 'sector'],
    question_patterns: [
      { pattern_id: 'size', question_template: 'What is the current market size for {sector} in {country}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.7, placeholders: ['sector', 'country'] },
      { pattern_id: 'growth', question_template: 'How has the market grown over the past 5 years?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'concentration', question_template: 'What is the market concentration?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'barriers', question_template: 'What are the regulatory entry barriers?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'comparable', question_template: 'How have similar entries performed in comparable markets?', answer_type: 'COMPARISON_CONDITIONAL', required: false, confidence_threshold: 0.5, placeholders: [] },
    ],
    signal_types: ['policy', 'media', 'events'],
    typical_assumptions: ['market_definition', 'regulatory_environment', 'competitive_response'],
  },

  // RESOURCE ALLOCATION
  resource_allocation: {
    type_id: 'resource_allocation',
    name: 'Resource Allocation',
    description: 'Budget, staffing, and resource distribution questions',
    domains: ['economy', 'society'],
    required_context: ['organization_type', 'resource_type'],
    question_patterns: [
      { pattern_id: 'current', question_template: 'What is the current allocation of {resource_type}?', answer_type: 'DESCRIPTIVE_STAT', required: true, confidence_threshold: 0.8, placeholders: ['resource_type'] },
      { pattern_id: 'efficiency', question_template: 'How does efficiency vary across allocation targets?', answer_type: 'DISTRIBUTION_STRUCTURE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'trend', question_template: 'How has allocation changed over time?', answer_type: 'TREND_CHANGE', required: true, confidence_threshold: 0.7, placeholders: [] },
      { pattern_id: 'benchmark', question_template: 'How does this compare to peer organizations?', answer_type: 'COMPARISON_CONDITIONAL', required: false, confidence_threshold: 0.6, placeholders: [] },
      { pattern_id: 'constraint', question_template: 'What are the binding constraints?', answer_type: 'DESCRIPTIVE_STAT', required: false, confidence_threshold: 0.6, placeholders: [] },
    ],
    signal_types: ['policy'],
    typical_assumptions: ['budget_stability', 'demand_projections', 'efficiency_targets'],
  },
};

/**
 * FACTORY CLASS
 */
export class DecisionGraphFactory {
  /**
   * Create a decision graph from a blueprint and context
   */
  static createFromBlueprint(
    blueprintId: string,
    context: Record<string, string>,
    options?: {
      graphId?: string;
      title?: string;
      includeOptional?: boolean;
    }
  ): DecisionGraphSchemaV1 {
    const blueprint = DECISION_BLUEPRINTS[blueprintId];
    if (!blueprint) {
      throw new Error(`Unknown blueprint: ${blueprintId}`);
    }

    // Validate required context
    const missingContext = blueprint.required_context.filter(
      key => !context[key]
    );
    if (missingContext.length > 0) {
      throw new Error(`Missing required context: ${missingContext.join(', ')}`);
    }

    const graphId = options?.graphId || `${blueprintId}_${Date.now()}`;
    const title = options?.title || blueprint.name;

    // Build nodes from patterns
    const nodes: DecisionNodeSchema[] = blueprint.question_patterns
      .filter(p => p.required || options?.includeOptional)
      .map(pattern => this.patternToNode(pattern, context));

    // Build scope
    const scope: DecisionScope = {
      domain: [...blueprint.domains],
      geography: context.country || context.region || 'global',
      population: context.population,
      time_horizon: context.time_horizon || 'not_specified',
    };

    return {
      decision_graph_id: graphId,
      version: 'v1',
      title,
      description: blueprint.description,
      scope,
      nodes,
      assumptions: blueprint.typical_assumptions.map(a => ({
        assumption_id: a,
        description: this.getAssumptionDescription(a),
        impact_level: 'medium' as const,
        required: true,
      })),
      signals: blueprint.signal_types.map(s => ({
        signal_type: s as 'news' | 'events' | 'volatility' | 'policy' | 'media',
        index_ref: `index:signals:${s}:v1`,
      })),
      outputs: {
        charts: true,
        tables: true,
        download: ['json', 'csv'],
      },
      governance: {
        no_recommendation: true,
        read_only: true,
        audit_trail: true,
        version_locked: true,
      },
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Convert a question pattern to a node
   */
  private static patternToNode(
    pattern: QuestionPattern,
    context: Record<string, string>
  ): DecisionNodeSchema {
    // Fill in placeholders
    let question = pattern.question_template;
    for (const placeholder of pattern.placeholders) {
      question = question.replace(`{${placeholder}}`, context[placeholder] || `[${placeholder}]`);
    }

    return {
      node_id: pattern.pattern_id,
      question,
      answer_type: pattern.answer_type as DecisionNodeSchema['answer_type'],
      required: pattern.required,
      confidence_threshold: pattern.confidence_threshold,
      status: 'unresolved',
    };
  }

  /**
   * Get assumption description
   */
  private static getAssumptionDescription(assumptionId: string): string {
    const descriptions: Record<string, string> = {
      time_horizon: 'What time horizon is relevant for this analysis?',
      baseline_conditions: 'Economic and social conditions remain within historical range',
      regulatory_stability: 'No major regulatory disruption assumed',
      population_growth: 'Population growth follows official projections',
      no_pandemic: 'No major pandemic event in analysis period',
      staffing_trajectory: 'Staffing levels remain at current trajectory',
      implementation_fidelity: 'Reform implemented as designed',
      funding_maintained: 'Funding levels maintained during transition',
      political_stability: 'Political environment remains stable',
      market_definition: 'Market boundaries defined consistently',
      competitive_response: 'Competitors respond rationally',
      budget_stability: 'Budget constraints remain stable',
      demand_projections: 'Demand follows historical patterns',
      efficiency_targets: 'Efficiency improvements achievable',
    };
    return descriptions[assumptionId] || `Assumption: ${assumptionId}`;
  }

  /**
   * List all available blueprints
   */
  static listBlueprints(): { id: string; name: string; domains: readonly string[] }[] {
    return Object.entries(DECISION_BLUEPRINTS).map(([id, bp]) => ({
      id,
      name: bp.name,
      domains: bp.domains,
    }));
  }

  /**
   * Get blueprint by domain
   */
  static getBlueprintsForDomain(domain: DecisionDomain): DecisionBlueprint[] {
    return Object.values(DECISION_BLUEPRINTS).filter(bp =>
      bp.domains.includes(domain)
    );
  }

  /**
   * Auto-detect blueprint from description
   */
  static detectBlueprint(description: string): string | null {
    const lower = description.toLowerCase();
    
    if (lower.includes('invest') || lower.includes('capital') || lower.includes('build')) {
      return 'investment';
    }
    if (lower.includes('health') || lower.includes('hospital') || lower.includes('capacity')) {
      return 'healthcare';
    }
    if (lower.includes('policy') || lower.includes('reform') || lower.includes('legislation')) {
      return 'policy';
    }
    if (lower.includes('market') || lower.includes('entry') || lower.includes('launch')) {
      return 'market_entry';
    }
    if (lower.includes('resource') || lower.includes('budget') || lower.includes('allocation')) {
      return 'resource_allocation';
    }
    
    return null;
  }
}

/**
 * FACTORY PRINCIPLES
 */
export const FACTORY_PRINCIPLES = {
  creates: 'Question structures',
  never_creates: 'Recommendations or decisions',
  input: 'Decision type + context',
  output: 'Complete question tree',
  all_graphs_have: [
    'no_recommendation: true',
    'read_only: true',
    'Explicit assumptions',
    'Data gap identification',
  ],
} as const;
