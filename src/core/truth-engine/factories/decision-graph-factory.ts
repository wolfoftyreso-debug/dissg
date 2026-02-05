/**
 * DECISION GRAPH BLUEPRINT FACTORY
 * 
 * Sluta bygga beslut manuellt.
 * Varje blueprint: fasta nodtyper, förbjudna svar, obligatoriska osäkerheter.
 */

// Blueprint definition
export interface DecisionBlueprint {
  blueprint_id: string;
  version: string;
  category: 'investment' | 'capacity' | 'stability' | 'policy_risk';
  
  // Structure
  node_types: NodeTypeSpec[];
  edge_types: EdgeTypeSpec[];
  
  // Constraints
  forbidden_outputs: string[];
  required_uncertainties: string[];
  
  // Validation
  min_nodes: number;
  max_depth: number;
}

interface NodeTypeSpec {
  type: string;
  required: boolean;
  max_instances: number;
  allowed_connections: string[];
}

interface EdgeTypeSpec {
  type: string;
  allowed_sources: string[];
  allowed_targets: string[];
  requires_weight: boolean;
}

// Decision Graph instance
export interface DecisionGraph {
  graph_id: string;
  blueprint_id: string;
  scope: {
    geo_code: string;
    domain: string;
    time_context: string;
  };
  nodes: DecisionNode[];
  edges: DecisionEdge[];
  uncertainties: UncertaintyNode[];
  created_at: string;
}

interface DecisionNode {
  node_id: string;
  type: string;
  label: string;
  truth_node_refs: string[];
  importance: number;
}

interface DecisionEdge {
  edge_id: string;
  type: string;
  source: string;
  target: string;
  weight?: number;
  label?: string;
}

interface UncertaintyNode {
  uncertainty_id: string;
  applies_to: string[];
  type: 'data_gap' | 'methodology_limit' | 'temporal_lag' | 'definition_mismatch';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Validation result
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================
// STANDARD BLUEPRINTS
// ============================================

export const INVESTMENT_BLUEPRINT: DecisionBlueprint = {
  blueprint_id: 'investment_decision',
  version: '1.0.0',
  category: 'investment',
  
  node_types: [
    { type: 'context', required: true, max_instances: 1, allowed_connections: ['factor', 'constraint'] },
    { type: 'factor', required: true, max_instances: 10, allowed_connections: ['factor', 'outcome'] },
    { type: 'constraint', required: true, max_instances: 5, allowed_connections: ['outcome'] },
    { type: 'outcome', required: true, max_instances: 5, allowed_connections: [] },
  ],
  
  edge_types: [
    { type: 'influences', allowed_sources: ['factor'], allowed_targets: ['factor', 'outcome'], requires_weight: true },
    { type: 'constrains', allowed_sources: ['constraint'], allowed_targets: ['outcome'], requires_weight: false },
    { type: 'contextualizes', allowed_sources: ['context'], allowed_targets: ['factor', 'constraint'], requires_weight: false },
  ],
  
  forbidden_outputs: [
    'should invest',
    'should not invest',
    'recommended',
    'best option',
    'optimal',
    'buy',
    'sell',
    'hold',
  ],
  
  required_uncertainties: [
    'data_coverage',
    'temporal_validity',
    'external_factors',
  ],
  
  min_nodes: 5,
  max_depth: 4,
};

export const CAPACITY_BLUEPRINT: DecisionBlueprint = {
  blueprint_id: 'capacity_decision',
  version: '1.0.0',
  category: 'capacity',
  
  node_types: [
    { type: 'demand_signal', required: true, max_instances: 5, allowed_connections: ['gap', 'trend'] },
    { type: 'supply_state', required: true, max_instances: 5, allowed_connections: ['gap', 'constraint'] },
    { type: 'gap', required: true, max_instances: 3, allowed_connections: ['scenario'] },
    { type: 'constraint', required: false, max_instances: 5, allowed_connections: ['scenario'] },
    { type: 'trend', required: true, max_instances: 3, allowed_connections: ['scenario'] },
    { type: 'scenario', required: true, max_instances: 3, allowed_connections: [] },
  ],
  
  edge_types: [
    { type: 'drives', allowed_sources: ['demand_signal', 'supply_state'], allowed_targets: ['gap'], requires_weight: true },
    { type: 'projects_to', allowed_sources: ['gap', 'trend'], allowed_targets: ['scenario'], requires_weight: false },
    { type: 'limits', allowed_sources: ['constraint'], allowed_targets: ['scenario'], requires_weight: false },
  ],
  
  forbidden_outputs: [
    'should expand',
    'should reduce',
    'recommended capacity',
    'optimal level',
    'must',
    'need to',
  ],
  
  required_uncertainties: [
    'demand_forecast_confidence',
    'supply_measurement_accuracy',
    'external_dependencies',
  ],
  
  min_nodes: 8,
  max_depth: 4,
};

export const STABILITY_BLUEPRINT: DecisionBlueprint = {
  blueprint_id: 'stability_assessment',
  version: '1.0.0',
  category: 'stability',
  
  node_types: [
    { type: 'stress_indicator', required: true, max_instances: 10, allowed_connections: ['threshold', 'coupling'] },
    { type: 'threshold', required: true, max_instances: 5, allowed_connections: ['risk_state'] },
    { type: 'coupling', required: false, max_instances: 5, allowed_connections: ['risk_state'] },
    { type: 'risk_state', required: true, max_instances: 3, allowed_connections: [] },
  ],
  
  edge_types: [
    { type: 'triggers', allowed_sources: ['stress_indicator'], allowed_targets: ['threshold'], requires_weight: true },
    { type: 'amplifies', allowed_sources: ['coupling'], allowed_targets: ['risk_state'], requires_weight: true },
    { type: 'indicates', allowed_sources: ['threshold'], allowed_targets: ['risk_state'], requires_weight: false },
  ],
  
  forbidden_outputs: [
    'will collapse',
    'will recover',
    'predicted',
    'forecast',
    'certain',
    'guaranteed',
  ],
  
  required_uncertainties: [
    'threshold_calibration',
    'coupling_stability',
    'measurement_lag',
  ],
  
  min_nodes: 6,
  max_depth: 3,
};

export const POLICY_RISK_BLUEPRINT: DecisionBlueprint = {
  blueprint_id: 'policy_risk_assessment',
  version: '1.0.0',
  category: 'policy_risk',
  
  node_types: [
    { type: 'policy_change', required: true, max_instances: 5, allowed_connections: ['affected_indicator', 'dependency'] },
    { type: 'affected_indicator', required: true, max_instances: 10, allowed_connections: ['impact_scenario'] },
    { type: 'dependency', required: false, max_instances: 5, allowed_connections: ['impact_scenario'] },
    { type: 'impact_scenario', required: true, max_instances: 3, allowed_connections: [] },
  ],
  
  edge_types: [
    { type: 'affects', allowed_sources: ['policy_change'], allowed_targets: ['affected_indicator'], requires_weight: true },
    { type: 'depends_on', allowed_sources: ['affected_indicator'], allowed_targets: ['dependency'], requires_weight: false },
    { type: 'results_in', allowed_sources: ['affected_indicator', 'dependency'], allowed_targets: ['impact_scenario'], requires_weight: false },
  ],
  
  forbidden_outputs: [
    'good policy',
    'bad policy',
    'should implement',
    'should avoid',
    'recommended',
    'effective',
    'ineffective',
  ],
  
  required_uncertainties: [
    'implementation_variance',
    'second_order_effects',
    'baseline_uncertainty',
  ],
  
  min_nodes: 6,
  max_depth: 3,
};

// Registry
export const BLUEPRINT_REGISTRY: Record<string, DecisionBlueprint> = {
  investment_decision: INVESTMENT_BLUEPRINT,
  capacity_decision: CAPACITY_BLUEPRINT,
  stability_assessment: STABILITY_BLUEPRINT,
  policy_risk_assessment: POLICY_RISK_BLUEPRINT,
};

/**
 * Validate a decision graph against its blueprint
 */
export function validateGraph(
  graph: DecisionGraph,
  blueprint: DecisionBlueprint
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check minimum nodes
  if (graph.nodes.length < blueprint.min_nodes) {
    errors.push(`Insufficient nodes: ${graph.nodes.length} < ${blueprint.min_nodes}`);
  }
  
  // Check required node types
  for (const spec of blueprint.node_types.filter(t => t.required)) {
    const count = graph.nodes.filter(n => n.type === spec.type).length;
    if (count === 0) {
      errors.push(`Missing required node type: ${spec.type}`);
    }
    if (count > spec.max_instances) {
      errors.push(`Too many ${spec.type} nodes: ${count} > ${spec.max_instances}`);
    }
  }
  
  // Check required uncertainties
  for (const required of blueprint.required_uncertainties) {
    const hasIt = graph.uncertainties.some(u => 
      u.type === required || u.description.toLowerCase().includes(required)
    );
    if (!hasIt) {
      errors.push(`Missing required uncertainty: ${required}`);
    }
  }
  
  // Check forbidden outputs (scan all labels)
  const allLabels = [
    ...graph.nodes.map(n => n.label.toLowerCase()),
    ...graph.edges.map(e => (e.label || '').toLowerCase()),
  ].join(' ');
  
  for (const forbidden of blueprint.forbidden_outputs) {
    if (allLabels.includes(forbidden.toLowerCase())) {
      errors.push(`Forbidden output detected: "${forbidden}"`);
    }
  }
  
  // Check edge type validity
  for (const edge of graph.edges) {
    const spec = blueprint.edge_types.find(t => t.type === edge.type);
    if (!spec) {
      errors.push(`Unknown edge type: ${edge.type}`);
      continue;
    }
    
    const sourceNode = graph.nodes.find(n => n.node_id === edge.source);
    const targetNode = graph.nodes.find(n => n.node_id === edge.target);
    
    if (sourceNode && !spec.allowed_sources.includes(sourceNode.type)) {
      errors.push(`Invalid edge source: ${edge.type} from ${sourceNode.type}`);
    }
    if (targetNode && !spec.allowed_targets.includes(targetNode.type)) {
      errors.push(`Invalid edge target: ${edge.type} to ${targetNode.type}`);
    }
    if (spec.requires_weight && edge.weight === undefined) {
      warnings.push(`Edge ${edge.edge_id} should have weight`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create a decision graph from blueprint
 */
export function createDecisionGraph(
  blueprint_id: string,
  scope: DecisionGraph['scope'],
  nodes: Omit<DecisionNode, 'node_id'>[],
  edges: Omit<DecisionEdge, 'edge_id'>[],
  uncertainties: Omit<UncertaintyNode, 'uncertainty_id'>[]
): { graph: DecisionGraph; validation: ValidationResult } {
  const blueprint = BLUEPRINT_REGISTRY[blueprint_id];
  if (!blueprint) {
    throw new Error(`Unknown blueprint: ${blueprint_id}`);
  }
  
  // Generate IDs
  const graph: DecisionGraph = {
    graph_id: `dg:${blueprint_id}:${scope.geo_code}:${Date.now().toString(36)}`,
    blueprint_id,
    scope,
    nodes: nodes.map((n, i) => ({ ...n, node_id: `n${i}` })),
    edges: edges.map((e, i) => ({ ...e, edge_id: `e${i}` })),
    uncertainties: uncertainties.map((u, i) => ({ ...u, uncertainty_id: `u${i}` })),
    created_at: new Date().toISOString(),
  };
  
  const validation = validateGraph(graph, blueprint);
  
  return { graph, validation };
}
