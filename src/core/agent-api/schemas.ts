/**
 * AGENT-NATIVE API SCHEMAS
 * 
 * Strict schemas for AI agents. No guessing allowed.
 * HTTP 409 if any field is missing.
 */

/**
 * SCOPE ENVELOPE (always required)
 */
export interface ScopeEnvelope {
  geo: string;           // ISO country/region code
  population: string;    // Population segment
  time: TimeScope;       // Time specification
}

export interface TimeScope {
  start: string;         // ISO date
  end: string;           // ISO date
  granularity: 'day' | 'month' | 'quarter' | 'year';
}

/**
 * ORIENTATION ENVELOPE (semantic position)
 */
export interface OrientationEnvelope {
  baseline: BaselineSpec;
  deviation: DeviationSpec;
  direction: DirectionSpec;
}

export interface BaselineSpec {
  type: 'historical_mean' | 'peer_mean' | 'target' | 'none';
  value: number | null;
  period: string | null;
}

export interface DeviationSpec {
  absolute: number | null;
  relative_percent: number | null;
  z_score: number | null;
  percentile: number | null;
}

export interface DirectionSpec {
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  confidence: number;     // 0-1
  periods_analyzed: number;
}

/**
 * IMPORTANCE ENVELOPE (structural significance)
 */
export interface ImportanceEnvelope {
  structural: boolean;    // Long-term structural change
  acute: boolean;         // Short-term spike
  contextual: boolean;    // Context-dependent significance
  score: number;          // 0-100
}

/**
 * UNCERTAINTY ENVELOPE (always required)
 */
export interface UncertaintyEnvelope {
  confidence: number;     // 0-1
  coverage: number;       // 0-1 data completeness
  gaps: DataGap[];
  sources_agree: boolean;
  methodology_stable: boolean;
}

export interface DataGap {
  type: 'temporal' | 'geographic' | 'demographic' | 'methodological';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

/**
 * RELATIONS ENVELOPE (graph navigation)
 */
export interface RelationsEnvelope {
  up: RelationLink[];     // Parent nodes
  side: RelationLink[];   // Sibling nodes
  forward: RelationLink[]; // Causal/temporal successors
  down: RelationLink[];   // Child nodes
}

export interface RelationLink {
  node_id: string;
  relation_type: string;
  strength: number;       // 0-1
  bidirectional: boolean;
}

/**
 * FULL AGENT RESPONSE (all fields mandatory)
 */
export interface AgentResponse<T = unknown> {
  // Request tracking
  request_id: string;
  version: string;
  pinned_at: string;
  
  // Mandatory envelopes
  scope: ScopeEnvelope;
  orientation: OrientationEnvelope;
  importance: ImportanceEnvelope;
  uncertainty: UncertaintyEnvelope;
  relations: RelationsEnvelope;
  
  // Actual data
  data: T;
  
  // Navigation
  next_valid_queries: string[];
  
  // Caching
  cache_key: string;
  cache_valid_until: string;
}

/**
 * SEMANTIC CONFLICT ERROR
 */
export interface SemanticConflictError {
  error: 'semantic_conflict';
  code: 409;
  missing_fields: string[];
  reason: string;
  suggestions: string[];
}

/**
 * GRAPH NODE RESPONSE
 */
export interface GraphNodeResponse {
  node_id: string;
  node_type: string;
  created_at: string;
  version: number;
  
  // Core data
  value: number | null;
  unit: string;
  
  // Full envelopes
  scope: ScopeEnvelope;
  orientation: OrientationEnvelope;
  importance: ImportanceEnvelope;
  uncertainty: UncertaintyEnvelope;
  relations: RelationsEnvelope;
}

/**
 * GRAPH TRAVERSAL RESPONSE
 */
export interface GraphTraversalResponse {
  start_node: string;
  depth: number;
  direction: 'up' | 'down' | 'side' | 'forward' | 'all';
  
  nodes: GraphNodeResponse[];
  edges: GraphEdge[];
  
  truncated: boolean;
  total_available: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation_type: string;
  strength: number;
}

/**
 * SEMANTIC ANSWER RESPONSE
 */
export interface SemanticAnswerResponse {
  query: {
    domain: string;
    scope: string;
    population: string;
  };
  
  answer: {
    text: string;
    value: number | null;
    unit: string | null;
  };
  
  // All mandatory envelopes
  scope: ScopeEnvelope;
  orientation: OrientationEnvelope;
  importance: ImportanceEnvelope;
  uncertainty: UncertaintyEnvelope;
  relations: RelationsEnvelope;
  
  // Limitations (always shown)
  limitations: string[];
  does_not_mean: string[];
}

/**
 * INDEX RESPONSE
 */
export interface IndexResponse {
  index_id: string;
  version: string;
  calculated_at: string;
  
  // Index value
  value: number;
  previous_value: number | null;
  change: number | null;
  
  // Components
  components: IndexComponent[];
  weights: Record<string, number>;
  
  // All mandatory envelopes
  scope: ScopeEnvelope;
  orientation: OrientationEnvelope;
  importance: ImportanceEnvelope;
  uncertainty: UncertaintyEnvelope;
  relations: RelationsEnvelope;
}

export interface IndexComponent {
  component_id: string;
  value: number;
  weight: number;
  contribution: number;
}

/**
 * DECISION RESOLVE RESPONSE
 */
export interface DecisionResolveResponse {
  graph_id: string;
  resolved_at: string;
  
  // Decision data
  current_state: Record<string, unknown>;
  historical_context: Record<string, unknown>;
  relevant_factors: string[];
  
  // All mandatory envelopes
  scope: ScopeEnvelope;
  orientation: OrientationEnvelope;
  importance: ImportanceEnvelope;
  uncertainty: UncertaintyEnvelope;
  relations: RelationsEnvelope;
  
  // Hard limits
  no_recommendations: true;
  no_advice: true;
  data_only: true;
}

/**
 * VALIDATE RESPONSE COMPLETENESS
 * 
 * Returns missing fields or null if complete.
 */
export function validateResponseCompleteness(
  response: Partial<AgentResponse>
): string[] | null {
  const required = [
    'request_id',
    'version',
    'pinned_at',
    'scope',
    'orientation',
    'importance',
    'uncertainty',
    'relations',
    'data',
  ];
  
  const missing = required.filter(field => !(field in response));
  
  if (missing.length > 0) {
    return missing;
  }
  
  // Check nested required fields
  const nestedMissing: string[] = [];
  
  if (response.scope) {
    if (!response.scope.geo) nestedMissing.push('scope.geo');
    if (!response.scope.population) nestedMissing.push('scope.population');
    if (!response.scope.time) nestedMissing.push('scope.time');
  }
  
  if (response.uncertainty) {
    if (response.uncertainty.confidence === undefined) {
      nestedMissing.push('uncertainty.confidence');
    }
  }
  
  return nestedMissing.length > 0 ? nestedMissing : null;
}

/**
 * CREATE SEMANTIC CONFLICT ERROR
 */
export function createSemanticConflict(
  missingFields: string[],
  reason: string
): SemanticConflictError {
  return {
    error: 'semantic_conflict',
    code: 409,
    missing_fields: missingFields,
    reason,
    suggestions: [
      'Provide all required parameters',
      'Use /api/graph/node/{id} for specific node access',
      'Check /api/docs for required fields',
    ],
  };
}
