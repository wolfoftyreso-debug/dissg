/**
 * DAG ALGORITHMS
 * 
 * Graph algorithms for causal DAG analysis.
 */

import type { CausalNode, CausalEdge } from './dag-types';

/**
 * Detect cycles in the graph using DFS.
 * Returns the cycle path if found, empty array if DAG is valid.
 */
export function detectCycle(nodes: CausalNode[], edges: CausalEdge[]): string[] {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.sourceId)?.push(e.targetId);
  }

  const WHITE = 0, _GRAY = 1, _BLACK = 2;
  const color = new Map<string, number>();
  const parent = new Map<string, string | null>();
  for (const n of nodes) {
    color.set(n.id, WHITE);
    parent.set(n.id, null);
  }

  for (const n of nodes) {
    if (color.get(n.id) === WHITE) {
      const cycle = dfs(n.id, adj, color, parent);
      if (cycle.length > 0) return cycle;
    }
  }
  return [];
}

function dfs(
  u: string,
  adj: Map<string, string[]>,
  color: Map<string, number>,
  parent: Map<string, string | null>
): string[] {
  color.set(u, 1); // GRAY
  for (const v of adj.get(u) ?? []) {
    if (color.get(v) === 1) {
      // Back edge found — reconstruct cycle
      const cycle = [v, u];
      let cur = parent.get(u);
      while (cur && cur !== v) {
        cycle.push(cur);
        cur = parent.get(cur) ?? null;
      }
      return cycle.reverse();
    }
    if (color.get(v) === 0) {
      parent.set(v, u);
      const cycle = dfs(v, adj, color, parent);
      if (cycle.length > 0) return cycle;
    }
  }
  color.set(u, 2); // BLACK
  return [];
}

/**
 * Topological sort using Kahn's algorithm.
 * Returns null if graph has cycles.
 */
export function topologicalSort(nodes: CausalNode[], edges: CausalEdge[]): CausalNode[] | null {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  const nodeMap = new Map<string, CausalNode>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
    nodeMap.set(n.id, n);
  }

  for (const e of edges) {
    adj.get(e.sourceId)?.push(e.targetId);
    inDegree.set(e.targetId, (inDegree.get(e.targetId) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const result: CausalNode[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(nodeMap.get(u)!);
    for (const v of adj.get(u) ?? []) {
      const newDeg = (inDegree.get(v) ?? 1) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) queue.push(v);
    }
  }

  return result.length === nodes.length ? result : null;
}

/**
 * Find all ancestors of a node (upstream causes).
 */
export function findAncestors(nodeId: string, nodes: CausalNode[], edges: CausalEdge[]): Set<string> {
  const reverseAdj = new Map<string, string[]>();
  for (const n of nodes) reverseAdj.set(n.id, []);
  for (const e of edges) {
    reverseAdj.get(e.targetId)?.push(e.sourceId);
  }

  const visited = new Set<string>();
  const stack = [nodeId];
  while (stack.length > 0) {
    const u = stack.pop()!;
    for (const v of reverseAdj.get(u) ?? []) {
      if (!visited.has(v)) {
        visited.add(v);
        stack.push(v);
      }
    }
  }
  return visited;
}

/**
 * Find all descendants of a node (downstream effects).
 */
export function findDescendants(nodeId: string, nodes: CausalNode[], edges: CausalEdge[]): Set<string> {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.sourceId)?.push(e.targetId);
  }

  const visited = new Set<string>();
  const stack = [nodeId];
  while (stack.length > 0) {
    const u = stack.pop()!;
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) {
        visited.add(v);
        stack.push(v);
      }
    }
  }
  return visited;
}
