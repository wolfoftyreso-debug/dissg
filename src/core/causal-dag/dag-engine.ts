/**
 * CAUSAL DAG ENGINE
 * 
 * Main engine for creating, validating and querying causal DAGs.
 */

import type { CausalNode, CausalEdge, CausalGraph, DAGValidationResult } from './dag-types';
import { detectCycle, topologicalSort, findAncestors, findDescendants } from './dag-algorithms';

export class CausalDAG {
  private nodes: Map<string, CausalNode> = new Map();
  private edges: Map<string, CausalEdge> = new Map();
  private graph: CausalGraph;

  constructor(graph: CausalGraph) {
    this.graph = graph;
    for (const n of graph.nodes) this.nodes.set(n.id, n);
    for (const e of graph.edges) this.edges.set(e.id, e);
  }

  /** Validate DAG integrity */
  validate(): DAGValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const nodesArr = Array.from(this.nodes.values());
    const edgesArr = Array.from(this.edges.values());

    // Check for cycles
    const cycle = detectCycle(nodesArr, edgesArr);
    if (cycle.length > 0) {
      errors.push(`Cycle detected: ${cycle.join(' → ')}`);
    }

    // Check for self-loops (should be prevented by DB constraint too)
    for (const e of edgesArr) {
      if (e.sourceId === e.targetId) {
        errors.push(`Self-loop on node ${e.sourceId}`);
      }
    }

    // Check for isolated nodes
    const connectedNodes = new Set<string>();
    for (const e of edgesArr) {
      connectedNodes.add(e.sourceId);
      connectedNodes.add(e.targetId);
    }
    const isolatedNodes = nodesArr
      .filter(n => !connectedNodes.has(n.id))
      .map(n => n.code);
    if (isolatedNodes.length > 0) {
      warnings.push(`Isolated nodes: ${isolatedNodes.join(', ')}`);
    }

    // Check edge references
    for (const e of edgesArr) {
      if (!this.nodes.has(e.sourceId)) errors.push(`Edge references missing source node: ${e.sourceId}`);
      if (!this.nodes.has(e.targetId)) errors.push(`Edge references missing target node: ${e.targetId}`);
    }

    // Check confidence bounds
    for (const e of edgesArr) {
      if (e.confidence !== undefined && (e.confidence < 0 || e.confidence > 1)) {
        warnings.push(`Edge ${e.id} has confidence outside [0,1]: ${e.confidence}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasCycle: cycle.length > 0,
      isolatedNodes,
    };
  }

  /** Get topological ordering */
  getTopologicalOrder(): CausalNode[] | null {
    return topologicalSort(
      Array.from(this.nodes.values()),
      Array.from(this.edges.values())
    );
  }

  /** Get all upstream causes of a node */
  getAncestors(nodeId: string): CausalNode[] {
    const ids = findAncestors(
      nodeId,
      Array.from(this.nodes.values()),
      Array.from(this.edges.values())
    );
    return Array.from(ids).map(id => this.nodes.get(id)!).filter(Boolean);
  }

  /** Get all downstream effects of a node */
  getDescendants(nodeId: string): CausalNode[] {
    const ids = findDescendants(
      nodeId,
      Array.from(this.nodes.values()),
      Array.from(this.edges.values())
    );
    return Array.from(ids).map(id => this.nodes.get(id)!).filter(Boolean);
  }

  /** Get direct causes (parents) of a node */
  getDirectCauses(nodeId: string): CausalNode[] {
    const parentIds = Array.from(this.edges.values())
      .filter(e => e.targetId === nodeId)
      .map(e => e.sourceId);
    return parentIds.map(id => this.nodes.get(id)!).filter(Boolean);
  }

  /** Get direct effects (children) of a node */
  getDirectEffects(nodeId: string): CausalNode[] {
    const childIds = Array.from(this.edges.values())
      .filter(e => e.sourceId === nodeId)
      .map(e => e.targetId);
    return childIds.map(id => this.nodes.get(id)!).filter(Boolean);
  }

  /** Get all intervention nodes (root causes that can be acted upon) */
  getInterventionPoints(): CausalNode[] {
    return Array.from(this.nodes.values())
      .filter(n => n.nodeType === 'intervention');
  }

  /** Get the causal path between two nodes */
  getCausalPath(fromId: string, toId: string): CausalNode[] | null {
    const adj = new Map<string, string[]>();
    for (const n of this.nodes.values()) adj.set(n.id, []);
    for (const e of this.edges.values()) {
      adj.get(e.sourceId)?.push(e.targetId);
    }

    const visited = new Set<string>();
    const parent = new Map<string, string | null>();
    const queue = [fromId];
    visited.add(fromId);
    parent.set(fromId, null);

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === toId) {
        // Reconstruct path
        const path: CausalNode[] = [];
        let cur: string | null = toId;
        while (cur !== null) {
          path.unshift(this.nodes.get(cur)!);
          cur = parent.get(cur) ?? null;
        }
        return path;
      }
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) {
          visited.add(v);
          parent.set(v, u);
          queue.push(v);
        }
      }
    }
    return null;
  }

  /** Get graph summary statistics */
  getSummary() {
    const nodesArr = Array.from(this.nodes.values());
    const edgesArr = Array.from(this.edges.values());
    return {
      nodeCount: nodesArr.length,
      edgeCount: edgesArr.length,
      interventionPoints: nodesArr.filter(n => n.nodeType === 'intervention').length,
      outcomes: nodesArr.filter(n => n.nodeType === 'outcome').length,
      confounders: nodesArr.filter(n => n.nodeType === 'confounder').length,
      avgConfidence: edgesArr.length > 0
        ? edgesArr.reduce((s, e) => s + (e.confidence ?? 0), 0) / edgesArr.length
        : 0,
    };
  }
}

export function createCausalDAG(graph: CausalGraph): CausalDAG {
  return new CausalDAG(graph);
}
