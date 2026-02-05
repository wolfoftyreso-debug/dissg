/**
 * DECISION SDK
 * 
 * SDK for AI agents and frontend applications.
 * Provides simple interface to Decision Graphs.
 * 
 * AI agents use this to ORCHESTRATE, not to DECIDE.
 */

import { supabase } from "@/integrations/supabase/client";
import type { DecisionType } from "@/core/truth-engine/decision/registry";

// ============================================
// TYPES
// ============================================

export interface DecisionContext {
  [key: string]: string;
}

export interface ResolvedNode {
  node_id: string;
  question: string;
  answer_type: string;
  status: 'resolved' | 'unresolved' | 'insufficient_data';
  confidence: number;
  data_coverage: number;
  summary?: string;
  limitations: string[];
  chart_spec?: unknown;
}

export interface ResolvedGraph {
  decision_graph_id: string;
  title: string;
  description: string;
  nodes: ResolvedNode[];
  overall_confidence: number;
  completeness: number;
  assumptions: { id: string; description: string; required: boolean }[];
  data_gaps: { node_id: string; gap_type: string; severity: string }[];
  governance: {
    no_recommendation: boolean;
    read_only: boolean;
  };
  resolved_at: string;
}

export interface DecisionSDKOptions {
  include_charts?: boolean;
  include_indices?: boolean;
  include_signals?: boolean;
  include_assumptions?: boolean;
  confidence_threshold?: number;
}

// ============================================
// DECISION CLASS (AI AGENT INTERFACE)
// ============================================

/**
 * Decision class for AI agents.
 * 
 * Usage:
 * ```
 * const d = new Decision('investment_feasibility', { country: 'SE', sector: 'energy' });
 * const graph = await d.resolve();
 * graph.nodes['demand_trend'].chart();
 * ```
 */
export class Decision {
  private type: string;
  private context: DecisionContext;
  private options: DecisionSDKOptions;
  private resolved: ResolvedGraph | null = null;

  constructor(
    type: string,
    context: DecisionContext,
    options: DecisionSDKOptions = {}
  ) {
    this.type = type;
    this.context = context;
    this.options = {
      include_charts: true,
      include_indices: true,
      include_signals: true,
      include_assumptions: true,
      ...options,
    };
  }

  /**
   * Resolve the decision graph
   */
  async resolve(): Promise<ResolvedGraph> {
    const { data, error } = await supabase.functions.invoke("decision", {
      body: {
        template_id: this.type,
        context: this.context,
        ...this.options,
      },
    });

    if (error) throw new Error(`Failed to resolve decision: ${error.message}`);
    if (!data?.success) throw new Error(data?.error || "Unknown error");

    this.resolved = data.graph;
    return data.graph;
  }

  /**
   * Get a specific node
   */
  node(nodeId: string): ResolvedNode | null {
    if (!this.resolved) return null;
    return this.resolved.nodes.find(n => n.node_id === nodeId) || null;
  }

  /**
   * Get all nodes
   */
  get nodes(): Record<string, ResolvedNode> {
    if (!this.resolved) return {};
    return Object.fromEntries(
      this.resolved.nodes.map(n => [n.node_id, n])
    );
  }

  /**
   * Get confidence summary
   */
  confidenceSummary(): {
    overall: number;
    completeness: number;
    by_node: Record<string, number>;
    low_confidence_nodes: string[];
  } {
    if (!this.resolved) {
      return { overall: 0, completeness: 0, by_node: {}, low_confidence_nodes: [] };
    }

    const threshold = this.options.confidence_threshold || 0.7;
    const byNode = Object.fromEntries(
      this.resolved.nodes.map(n => [n.node_id, n.confidence])
    );
    const lowConfidence = this.resolved.nodes
      .filter(n => n.confidence < threshold)
      .map(n => n.node_id);

    return {
      overall: this.resolved.overall_confidence,
      completeness: this.resolved.completeness,
      by_node: byNode,
      low_confidence_nodes: lowConfidence,
    };
  }

  /**
   * Get data gaps
   */
  dataGaps(): { node_id: string; gap_type: string; severity: string }[] {
    return this.resolved?.data_gaps || [];
  }

  /**
   * Get assumptions
   */
  assumptions(): { id: string; description: string; required: boolean }[] {
    return this.resolved?.assumptions || [];
  }

  /**
   * Check if fully resolved
   */
  isComplete(): boolean {
    return this.resolved?.completeness === 1;
  }

  /**
   * Export to JSON
   */
  toJSON(): unknown {
    return this.resolved;
  }
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Create a decision from description (auto-detect type)
 */
export async function createDecision(
  description: string,
  context: DecisionContext
): Promise<Decision> {
  // Import at runtime to avoid circular deps
  const { detectDecisionType } = await import("@/core/truth-engine/decision/registry");
  
  const detected = detectDecisionType(description);
  if (!detected) {
    throw new Error(`Could not detect decision type from: "${description}"`);
  }
  
  return new Decision(detected.type_id, context);
}

/**
 * List available decision types
 */
export async function listDecisionTypes(): Promise<DecisionType[]> {
  const { listDecisionTypes: list } = await import("@/core/truth-engine/decision/registry");
  return list();
}

/**
 * Get decision type by ID
 */
export async function getDecisionType(typeId: string): Promise<DecisionType | null> {
  const { getDecisionType: get } = await import("@/core/truth-engine/decision/registry");
  return get(typeId);
}

// ============================================
// REACT HOOKS
// ============================================

import { useState, useCallback, useMemo } from "react";

/**
 * React hook for decision graphs
 */
export function useDecision(
  type: string,
  context: DecisionContext,
  options?: DecisionSDKOptions
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [graph, setGraph] = useState<ResolvedGraph | null>(null);

  const decision = useMemo(
    () => new Decision(type, context, options),
    [type, JSON.stringify(context), JSON.stringify(options)]
  );

  const resolve = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await decision.resolve();
      setGraph(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Unknown error");
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [decision]);

  return {
    isLoading,
    error,
    graph,
    resolve,
    nodes: decision.nodes,
    confidenceSummary: () => decision.confidenceSummary(),
    dataGaps: () => decision.dataGaps(),
    isComplete: () => decision.isComplete(),
  };
}

// ============================================
// SDK PRINCIPLES
// ============================================

export const SDK_PRINCIPLES = {
  ai_agents_use_this_to: 'Orchestrate, not decide',
  frontend_uses_this_to: 'Display, not recommend',
  never_provides: [
    'Recommendations',
    'Optimal choices',
    'Value judgments',
    'Action suggestions',
  ],
  always_provides: [
    'Structured questions',
    'Verified answers',
    'Confidence levels',
    'Data gaps',
    'Limitations',
  ],
} as const;
