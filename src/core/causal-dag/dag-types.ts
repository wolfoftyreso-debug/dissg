/**
 * CAUSAL DAG TYPES
 */

export interface CausalNode {
  id: string;
  code: string;
  label: string;
  nodeType: 'intervention' | 'mechanism' | 'outcome' | 'confounder' | 'mediator' | 'variable';
  kpiId?: string;
  observationId?: string;
  metadata?: Record<string, unknown>;
}

export interface CausalEdge {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: 'causal' | 'correlational' | 'confounding' | 'mediating';
  strength?: number;
  confidence?: number;
  lagMonths?: number;
  evidenceSummary?: string;
  evidenceSources?: string[];
  mechanism?: string;
  isFalsifiable: boolean;
  falsificationCriteria?: string;
}

export interface CausalGraph {
  id: string;
  code: string;
  title: string;
  description?: string;
  domain: string;
  nodes: CausalNode[];
  edges: CausalEdge[];
}

export interface DAGValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasCycle: boolean;
  isolatedNodes: string[];
}
