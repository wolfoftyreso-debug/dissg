/**
 * GLOBAL REALITY MODEL (GRM) — Core Engine
 * 
 * Causal graph traversal, chain discovery, cross-domain reasoning,
 * counterfactual simulation, and intervention ranking.
 */

import type {
  GRMEntity,
  GRMVariable,
  GRMIntervention,
  GRMOutcome,
  GRMCausalLink,
  GRMDiscovery,
  GRMSimulationQuery,
  GRMSimulationResult,
  GRMStats,
  GRMDomain,
} from './types';

// ============================================================================
// GRAPH STRUCTURE
// ============================================================================

interface GRMNode {
  id: string;
  label: string;
  type: 'entity' | 'variable' | 'intervention' | 'outcome';
  domain: GRMDomain;
}

export class GlobalRealityModel {
  private entities: Map<string, GRMEntity> = new Map();
  private variables: Map<string, GRMVariable> = new Map();
  private interventions: Map<string, GRMIntervention> = new Map();
  private outcomes: Map<string, GRMOutcome> = new Map();
  private causalLinks: Map<string, GRMCausalLink> = new Map();

  // Adjacency lists for traversal
  private forwardEdges: Map<string, GRMCausalLink[]> = new Map();
  private reverseEdges: Map<string, GRMCausalLink[]> = new Map();

  // ========================================================================
  // LOADING DATA
  // ========================================================================

  loadEntities(entities: GRMEntity[]) {
    for (const e of entities) this.entities.set(e.id, e);
  }

  loadVariables(variables: GRMVariable[]) {
    for (const v of variables) this.variables.set(v.id, v);
  }

  loadInterventions(interventions: GRMIntervention[]) {
    for (const i of interventions) this.interventions.set(i.id, i);
  }

  loadOutcomes(outcomes: GRMOutcome[]) {
    for (const o of outcomes) this.outcomes.set(o.id, o);
  }

  loadCausalLinks(links: GRMCausalLink[]) {
    for (const link of links) {
      this.causalLinks.set(link.id, link);
      // Forward edges
      if (!this.forwardEdges.has(link.source_id)) this.forwardEdges.set(link.source_id, []);
      this.forwardEdges.get(link.source_id)!.push(link);
      // Reverse edges
      if (!this.reverseEdges.has(link.target_id)) this.reverseEdges.set(link.target_id, []);
      this.reverseEdges.get(link.target_id)!.push(link);
    }
  }

  // ========================================================================
  // STEP 4 — CAUSAL CHAIN TRAVERSAL
  // ========================================================================

  /**
   * Find all causal chains from a source node to any reachable outcome.
   * Uses BFS with max depth to avoid infinite traversal.
   */
  findCausalChains(sourceId: string, maxDepth = 6): { path: GRMNode[]; links: GRMCausalLink[]; totalStrength: number; totalConfidence: number }[] {
    const results: { path: GRMNode[]; links: GRMCausalLink[]; totalStrength: number; totalConfidence: number }[] = [];
    const sourceNode = this.resolveNode(sourceId);
    if (!sourceNode) return results;

    const queue: { nodeId: string; path: GRMNode[]; links: GRMCausalLink[]; visited: Set<string> }[] = [
      { nodeId: sourceId, path: [sourceNode], links: [], visited: new Set([sourceId]) }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.path.length > maxDepth) continue;

      const edges = this.forwardEdges.get(current.nodeId) || [];
      for (const edge of edges) {
        if (current.visited.has(edge.target_id)) continue;

        const targetNode = this.resolveNode(edge.target_id);
        if (!targetNode) continue;

        const newPath = [...current.path, targetNode];
        const newLinks = [...current.links, edge];
        const newVisited = new Set(current.visited);
        newVisited.add(edge.target_id);

        // Record if we've reached an outcome or end node
        if (targetNode.type === 'outcome' || !(this.forwardEdges.get(edge.target_id)?.length)) {
          const totalStrength = newLinks.reduce((s, l) => s * l.strength, 1);
          const totalConfidence = newLinks.reduce((s, l) => s * l.confidence_score, 1);
          results.push({
            path: newPath,
            links: newLinks,
            totalStrength: Math.round(totalStrength * 1000) / 1000,
            totalConfidence: Math.round(totalConfidence * 1000) / 1000,
          });
        }

        // Continue traversing
        if (this.forwardEdges.get(edge.target_id)?.length) {
          queue.push({ nodeId: edge.target_id, path: newPath, links: newLinks, visited: newVisited });
        }
      }
    }

    return results.sort((a, b) => b.totalStrength - a.totalStrength);
  }

  // ========================================================================
  // STEP 7 — CROSS-DOMAIN INTEGRATION
  // ========================================================================

  findCrossDomainPaths(): GRMCausalLink[] {
    return Array.from(this.causalLinks.values()).filter(l => l.is_cross_domain);
  }

  getCrossDomainMatrix(): { source: GRMDomain; target: GRMDomain; count: number; avgStrength: number }[] {
    const matrix = new Map<string, { count: number; totalStrength: number }>();
    for (const link of this.causalLinks.values()) {
      if (!link.is_cross_domain) continue;
      const key = `${link.source_domain}→${link.target_domain}`;
      const entry = matrix.get(key) || { count: 0, totalStrength: 0 };
      entry.count++;
      entry.totalStrength += link.strength;
      matrix.set(key, entry);
    }
    return Array.from(matrix.entries()).map(([key, val]) => {
      const [source, target] = key.split('→') as [GRMDomain, GRMDomain];
      return { source, target, count: val.count, avgStrength: Math.round((val.totalStrength / val.count) * 100) / 100 };
    }).sort((a, b) => b.count - a.count);
  }

  // ========================================================================
  // STEP 8 — DISCOVERY MECHANISMS
  // ========================================================================

  discoverIndirectChains(minConfidence = 0.15): GRMDiscovery[] {
    const discoveries: GRMDiscovery[] = [];
    const allNodeIds = new Set([
      ...this.entities.keys(),
      ...this.variables.keys(),
      ...this.interventions.keys(),
    ]);

    for (const startId of allNodeIds) {
      const chains = this.findCausalChains(startId, 4);
      for (const chain of chains) {
        if (chain.path.length < 3 || chain.totalConfidence < minConfidence) continue;

        const domains = [...new Set(chain.path.map(n => n.domain))];
        if (domains.length < 2) continue; // Only cross-domain discoveries

        const labels = chain.path.map(n => n.label);
        discoveries.push({
          id: `disc-${startId}-${chain.path[chain.path.length - 1].id}`,
          discovery_type: 'indirect_chain',
          chain: chain.path.map(n => n.id),
          chain_labels: labels,
          domains_crossed: domains,
          total_strength: chain.totalStrength,
          total_confidence: chain.totalConfidence,
          inferred_statement: labels.join(' → '),
          potential_intervention_points: chain.path
            .filter(n => n.type === 'variable' || n.type === 'intervention')
            .map(n => n.id),
          status: 'detected',
          detected_at: new Date().toISOString(),
        });
      }
    }

    return discoveries
      .sort((a, b) => b.total_confidence - a.total_confidence)
      .slice(0, 50); // Limit to top 50
  }

  // ========================================================================
  // SIMULATION ENGINE (Counterfactual)
  // ========================================================================

  simulate(query: GRMSimulationQuery): GRMSimulationResult {
    const intervention = this.interventions.get(query.intervention_id);
    if (!intervention) {
      return {
        query,
        affected_outcomes: [],
        total_nodes_affected: 0,
        domains_impacted: [],
        uncertainty_note: 'Intervention not found.',
      };
    }

    const chains = this.findCausalChains(query.intervention_id, 5);
    const affectedOutcomes: GRMSimulationResult['affected_outcomes'] = [];
    const domainsImpacted = new Set<GRMDomain>();

    for (const chain of chains) {
      const lastNode = chain.path[chain.path.length - 1];
      if (lastNode.type !== 'outcome') continue;

      // Calculate propagated effect
      const changePropagated = query.magnitude_change_percent * chain.totalStrength;
      const isNegativeDirection = chain.links.some(l => l.direction === 'negative');
      const finalChange = isNegativeDirection ? -changePropagated : changePropagated;

      // Estimate time to effect
      const totalDelayDays = chain.links.reduce((s, l) => s + (l.effect_delay_min_days || 30), 0);

      affectedOutcomes.push({
        outcome_id: lastNode.id,
        outcome_name: lastNode.label,
        predicted_change_percent: Math.round(finalChange * 100) / 100,
        confidence: chain.totalConfidence,
        causal_path: chain.path.map(n => n.label),
        time_to_effect_months: Math.round(totalDelayDays / 30),
      });

      for (const node of chain.path) domainsImpacted.add(node.domain);
    }

    return {
      query,
      affected_outcomes: affectedOutcomes.sort((a, b) => Math.abs(b.predicted_change_percent) - Math.abs(a.predicted_change_percent)),
      total_nodes_affected: new Set(chains.flatMap(c => c.path.map(n => n.id))).size,
      domains_impacted: [...domainsImpacted],
      uncertainty_note: 'Simulation is based on observed causal strengths. Real-world effects may differ due to confounders, nonlinearities, and feedback loops not yet modeled.',
    };
  }

  // ========================================================================
  // INTERVENTION RANKING
  // ========================================================================

  rankInterventions(outcomeId: string): { intervention: GRMIntervention; totalImpact: number; confidence: number; pathCount: number }[] {
    const rankings: { intervention: GRMIntervention; totalImpact: number; confidence: number; pathCount: number }[] = [];

    for (const intervention of this.interventions.values()) {
      const chains = this.findCausalChains(intervention.id, 5);
      const relevantChains = chains.filter(c => c.path.some(n => n.id === outcomeId));

      if (relevantChains.length === 0) continue;

      const totalImpact = relevantChains.reduce((s, c) => s + c.totalStrength, 0);
      const avgConfidence = relevantChains.reduce((s, c) => s + c.totalConfidence, 0) / relevantChains.length;

      rankings.push({
        intervention,
        totalImpact: Math.round(totalImpact * 1000) / 1000,
        confidence: Math.round(avgConfidence * 1000) / 1000,
        pathCount: relevantChains.length,
      });
    }

    return rankings.sort((a, b) => b.totalImpact * b.confidence - a.totalImpact * a.confidence);
  }

  // ========================================================================
  // STATS
  // ========================================================================

  getStats(): GRMStats {
    const byDomain: Record<string, number> = {};
    const allDomains = [
      ...Array.from(this.entities.values()).map(e => e.domain),
      ...Array.from(this.variables.values()).map(v => v.domain),
      ...Array.from(this.interventions.values()).map(i => i.domain),
      ...Array.from(this.outcomes.values()).map(o => o.domain),
    ];
    for (const d of allDomains) byDomain[d] = (byDomain[d] || 0) + 1;

    const crossDomainLinks = Array.from(this.causalLinks.values()).filter(l => l.is_cross_domain).length;
    const chains = this.discoverIndirectChains(0.05);
    const avgChainLen = chains.length > 0
      ? chains.reduce((s, c) => s + c.chain.length, 0) / chains.length
      : 0;
    const allConfidences = Array.from(this.causalLinks.values()).map(l => l.confidence_score);
    const avgConfidence = allConfidences.length > 0
      ? allConfidences.reduce((s, c) => s + c, 0) / allConfidences.length
      : 0;

    return {
      total_entities: this.entities.size,
      total_variables: this.variables.size,
      total_interventions: this.interventions.size,
      total_outcomes: this.outcomes.size,
      total_causal_links: this.causalLinks.size,
      total_discoveries: chains.length,
      by_domain: byDomain,
      cross_domain_links: crossDomainLinks,
      avg_chain_length: Math.round(avgChainLen * 10) / 10,
      avg_confidence: Math.round(avgConfidence * 100) / 100,
    };
  }

  // ========================================================================
  // INTERNAL
  // ========================================================================

  private resolveNode(id: string): GRMNode | null {
    const entity = this.entities.get(id);
    if (entity) return { id: entity.id, label: entity.name, type: 'entity', domain: entity.domain };

    const variable = this.variables.get(id);
    if (variable) return { id: variable.id, label: variable.name, type: 'variable', domain: variable.domain };

    const intervention = this.interventions.get(id);
    if (intervention) return { id: intervention.id, label: intervention.name, type: 'intervention', domain: intervention.domain };

    const outcome = this.outcomes.get(id);
    if (outcome) return { id: outcome.id, label: outcome.name, type: 'outcome', domain: outcome.domain };

    return null;
  }

  getAllNodes(): GRMNode[] {
    return [
      ...Array.from(this.entities.values()).map(e => ({ id: e.id, label: e.name, type: 'entity' as const, domain: e.domain })),
      ...Array.from(this.variables.values()).map(v => ({ id: v.id, label: v.name, type: 'variable' as const, domain: v.domain })),
      ...Array.from(this.interventions.values()).map(i => ({ id: i.id, label: i.name, type: 'intervention' as const, domain: i.domain })),
      ...Array.from(this.outcomes.values()).map(o => ({ id: o.id, label: o.name, type: 'outcome' as const, domain: o.domain })),
    ];
  }

  getAllLinks(): GRMCausalLink[] {
    return Array.from(this.causalLinks.values());
  }

  getInterventions(): GRMIntervention[] {
    return Array.from(this.interventions.values());
  }

  getOutcomes(): GRMOutcome[] {
    return Array.from(this.outcomes.values());
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createGlobalRealityModel(): GlobalRealityModel {
  return new GlobalRealityModel();
}
