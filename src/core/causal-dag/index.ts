/**
 * CAUSAL DAG ENGINE
 * 
 * Directed Acyclic Graph engine for causal intelligence.
 * Replaces linear sequence_order with formal graph-based causal modeling.
 */

export { CausalDAG, createCausalDAG } from './dag-engine';
export type { CausalNode, CausalEdge, CausalGraph, DAGValidationResult } from './dag-types';
export { topologicalSort, findAncestors, findDescendants, detectCycle } from './dag-algorithms';
