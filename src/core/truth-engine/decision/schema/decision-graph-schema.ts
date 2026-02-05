/**
 * DECISION GRAPH SCHEMA v1 (LOCKED CONTRACT)
 * 
 * This is the formal specification for Decision Graphs.
 * All implementations MUST conform to this schema.
 * 
 * Version: 1.0.0 (LOCKED)
 */

/**
 * DECISION GRAPH SCHEMA v1
 */
export interface DecisionGraphSchemaV1 {
  readonly decision_graph_id: string;
  readonly version: 'v1';
  readonly title: string;
  readonly description: string;
  
  readonly scope: DecisionScope;
  readonly nodes: readonly DecisionNodeSchema[];
  readonly assumptions: readonly AssumptionSchema[];
  readonly signals: readonly SignalSchema[];
  readonly outputs: OutputOptions;
  readonly governance: GovernanceRules;
  
  readonly created_at: string;
  readonly resolved_at?: string;
}

/**
 * SCOPE DEFINITION
 */
export interface DecisionScope {
  readonly domain: DecisionDomain[];
  readonly geography: string;           // ISO-3166 or region code
  readonly population?: string;          // Defined cohort
  readonly time_horizon: string;         // Explicit duration
}

/**
 * SUPPORTED DOMAINS
 */
export type DecisionDomain =
  | 'economy'
  | 'healthcare'
  | 'markets'
  | 'youth'
  | 'environment'
  | 'education'
  | 'infrastructure'
  | 'society'
  | 'labor'
  | 'energy';

/**
 * NODE SCHEMA
 */
export interface DecisionNodeSchema {
  readonly node_id: string;
  readonly question: string;
  readonly answer_type: AnswerTypeV1;
  readonly required: boolean;
  readonly answer_packet_ref?: string;   // format: answer:namespace:id:vX
  readonly params?: Record<string, unknown>;
  readonly status: NodeStatusV1;
  readonly confidence_threshold: number;  // 0-1, default 0.7
  readonly depends_on?: readonly string[];
  readonly resolved_answer?: ResolvedAnswerSchema;
}

/**
 * ANSWER TYPE v1 (aligned with Master Answer Ontology)
 */
export type AnswerTypeV1 =
  | 'DESCRIPTIVE_STAT'
  | 'TREND_CHANGE'
  | 'DISTRIBUTION_STRUCTURE'
  | 'COMPARISON_CONDITIONAL'
  | 'RISK_PREVALENCE'
  | 'CORRELATION_OVERVIEW'
  | 'SCENARIO_MODEL';

/**
 * NODE STATUS v1
 */
export type NodeStatusV1 =
  | 'unresolved'
  | 'resolved'
  | 'insufficient_data';

/**
 * RESOLVED ANSWER SCHEMA
 */
export interface ResolvedAnswerSchema {
  readonly answer_packet_id: string;
  readonly summary: string;
  readonly data: unknown;
  readonly confidence: number;
  readonly data_coverage: number;
  readonly source_count: number;
  readonly freshness_days: number;
  readonly limitations: readonly string[];
  readonly resolved_at: string;
}

/**
 * ASSUMPTION SCHEMA
 */
export interface AssumptionSchema {
  readonly assumption_id: string;
  readonly description: string;
  readonly impact_level: 'low' | 'medium' | 'high';
  readonly options?: readonly string[];
  readonly selected_option?: string;
  readonly required: boolean;
}

/**
 * SIGNAL SCHEMA
 */
export interface SignalSchema {
  readonly signal_type: 'news' | 'events' | 'volatility' | 'policy' | 'media';
  readonly index_ref: string;            // format: index:namespace:id:vX
  readonly current_value?: number;
  readonly trend?: 'increasing' | 'decreasing' | 'stable';
  readonly interpretation?: string;
}

/**
 * OUTPUT OPTIONS
 */
export interface OutputOptions {
  readonly charts: boolean;
  readonly tables: boolean;
  readonly download: readonly ('json' | 'csv' | 'pdf')[];
}

/**
 * GOVERNANCE RULES (HARD LOCKED)
 */
export interface GovernanceRules {
  readonly no_recommendation: true;      // ALWAYS true
  readonly read_only: true;               // ALWAYS true
  readonly audit_trail: boolean;
  readonly version_locked: boolean;
}

/**
 * CI VALIDATION RULES
 */
export const SCHEMA_CI_RULES = {
  // All required nodes must be resolved or marked insufficient_data
  required_nodes_must_resolve: true,
  
  // No decisions or optimizations allowed
  no_decisions_allowed: true,
  no_optimizations_allowed: true,
  
  // Only Answer Packets can be used
  only_answer_packets: true,
  
  // Governance rules are immutable
  governance_is_immutable: true,
} as const;

/**
 * SCHEMA VERSION
 */
export const CURRENT_SCHEMA_VERSION = 'v1' as const;

/**
 * Validate a decision graph against schema v1
 */
export function validateDecisionGraph(graph: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!graph || typeof graph !== 'object') {
    return { valid: false, errors: ['Graph must be an object'] };
  }
  
  const g = graph as Record<string, unknown>;
  
  // Check required fields
  if (!g.decision_graph_id) errors.push('Missing decision_graph_id');
  if (g.version !== 'v1') errors.push('Version must be v1');
  if (!g.title) errors.push('Missing title');
  if (!g.scope) errors.push('Missing scope');
  if (!Array.isArray(g.nodes)) errors.push('Nodes must be an array');
  
  // Check governance
  const gov = g.governance as Record<string, unknown> | undefined;
  if (!gov?.no_recommendation) errors.push('no_recommendation must be true');
  if (!gov?.read_only) errors.push('read_only must be true');
  
  // Check nodes
  if (Array.isArray(g.nodes)) {
    const nodes = g.nodes as DecisionNodeSchema[];
    const requiredNodes = nodes.filter(n => n.required);
    const unresolvedRequired = requiredNodes.filter(
      n => n.status === 'unresolved'
    );
    if (unresolvedRequired.length > 0) {
      errors.push(`${unresolvedRequired.length} required nodes unresolved`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Create empty graph from schema
 */
export function createEmptyGraph(
  graphId: string,
  title: string,
  scope: DecisionScope
): DecisionGraphSchemaV1 {
  return {
    decision_graph_id: graphId,
    version: 'v1',
    title,
    description: '',
    scope,
    nodes: [],
    assumptions: [],
    signals: [],
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
