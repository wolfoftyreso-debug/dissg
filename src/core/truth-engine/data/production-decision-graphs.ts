/**
 * PRODUCTION DECISION GRAPHS
 * 
 * GDG-compliant decision graphs.
 * Returns underlag, never conclusions.
 */

import type { GDGAnswerType } from '../standards/global-decision-grammar';

export interface DecisionGraphNode {
  node_id: string;
  question: string;
  answer_type: GDGAnswerType;
  answer_packet_ref: string;
  required: boolean;
  confidence_threshold: number;
}

export interface DecisionGraphSignal {
  signal_type: 'volatility' | 'trend' | 'anomaly';
  index_ref: string;
}

export interface DecisionGraph {
  decision_graph_id: string;
  version: string;
  title: string;
  scope: {
    domain: string[];
    geography: string;
    population: string;
    time_horizon: string;
  };
  nodes: DecisionGraphNode[];
  signals?: DecisionGraphSignal[];
  outputs: {
    charts: boolean;
    tables: boolean;
    download: ('json' | 'csv')[];
  };
  governance: {
    no_recommendation: true;
    read_only: true;
  };
  // Display metadata
  shows: string;
  does_not_show: string;
}

// ============================================
// PRODUCTION DECISION GRAPHS
// ============================================

export const PRODUCTION_DECISION_GRAPHS: DecisionGraph[] = [
  // DG-001 — HEALTHCARE CAPACITY CHECK
  {
    decision_graph_id: "healthcare.capacity_check.v1",
    version: "v1",
    title: "Healthcare Capacity Check",
    scope: {
      domain: ["healthcare"],
      geography: "SE",
      population: "all",
      time_horizon: "current_12m"
    },
    nodes: [
      {
        node_id: "current_load",
        question: "What is the current healthcare system load?",
        answer_type: "DESCRIPTIVE_STAT",
        answer_packet_ref: "healthcare:answer:system_load_current:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "wait_time_trend",
        question: "How have waiting times changed over time?",
        answer_type: "TREND_CHANGE",
        answer_packet_ref: "healthcare:answer:waiting_times_trend:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "regional_variation",
        question: "How does load vary by region?",
        answer_type: "DISTRIBUTION_STRUCTURE",
        answer_packet_ref: "healthcare:answer:regional_load_distribution:v1",
        required: true,
        confidence_threshold: 0.6
      },
      {
        node_id: "signal_context",
        question: "Are there signals indicating abnormal pressure?",
        answer_type: "CORRELATION_OVERVIEW",
        answer_packet_ref: "signals:answer:healthcare_pressure_signals:v1",
        required: false,
        confidence_threshold: 0.5
      }
    ],
    signals: [
      { signal_type: "volatility", index_ref: "signals.media_volatility.v1" }
    ],
    outputs: {
      charts: true,
      tables: true,
      download: ["json", "csv"]
    },
    governance: {
      no_recommendation: true,
      read_only: true
    },
    shows: "Belastning, trend, variation, signaler",
    does_not_show: "Vad man ska göra"
  },

  // DG-002 — YOUTH WELLBEING PRESSURE
  {
    decision_graph_id: "health.youth_wellbeing_pressure.v1",
    version: "v1",
    title: "Youth Wellbeing Pressure",
    scope: {
      domain: ["health"],
      geography: "SE",
      population: "youth_13_19",
      time_horizon: "2000-2024"
    },
    nodes: [
      {
        node_id: "anxiety_prevalence",
        question: "How common are anxiety symptoms among youth?",
        answer_type: "RISK_PREVALENCE",
        answer_packet_ref: "health:answer:anxiety_prevalence_youth:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "sleep_deficit",
        question: "How has sleep duration changed?",
        answer_type: "TREND_CHANGE",
        answer_packet_ref: "health:answer:sleep_insufficiency_youth:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "stress_correlation",
        question: "How do sleep and stress move together?",
        answer_type: "CORRELATION_OVERVIEW",
        answer_packet_ref: "health:answer:sleep_stress_correlation_youth:v1",
        required: false,
        confidence_threshold: 0.6
      },
      {
        node_id: "regional_diff",
        question: "Are there regional differences?",
        answer_type: "COMPARISON_CONDITIONAL",
        answer_packet_ref: "health:answer:youth_wellbeing_regional_comparison:v1",
        required: false,
        confidence_threshold: 0.6
      }
    ],
    outputs: {
      charts: true,
      tables: true,
      download: ["json"]
    },
    governance: {
      no_recommendation: true,
      read_only: true
    },
    shows: "Normalitet, förändring, samvariation",
    does_not_show: "Individ, åtgärd, moral"
  },

  // DG-003 — COST OF LIVING PRESSURE
  {
    decision_graph_id: "economy.cost_of_living_pressure.v1",
    version: "v1",
    title: "Cost of Living Pressure",
    scope: {
      domain: ["economy"],
      geography: "SE",
      population: "households",
      time_horizon: "2000-2024"
    },
    nodes: [
      {
        node_id: "overall_pressure",
        question: "How has overall cost pressure evolved?",
        answer_type: "TREND_CHANGE",
        answer_packet_ref: "economy:answer:cost_of_living_trend:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "component_breakdown",
        question: "Which cost components contribute most?",
        answer_type: "DISTRIBUTION_STRUCTURE",
        answer_packet_ref: "economy:answer:cost_components_distribution:v1",
        required: true,
        confidence_threshold: 0.7
      },
      {
        node_id: "volatility_context",
        question: "Is cost pressure volatile or stable?",
        answer_type: "DESCRIPTIVE_STAT",
        answer_packet_ref: "economy:answer:inflation_volatility_context:v1",
        required: false,
        confidence_threshold: 0.6
      },
      {
        node_id: "regional_compare",
        question: "How does pressure vary regionally?",
        answer_type: "COMPARISON_CONDITIONAL",
        answer_packet_ref: "economy:answer:regional_cost_pressure:v1",
        required: false,
        confidence_threshold: 0.6
      }
    ],
    signals: [
      { signal_type: "volatility", index_ref: "economy.inflation_volatility.v1" }
    ],
    outputs: {
      charts: true,
      tables: true,
      download: ["json", "csv"]
    },
    governance: {
      no_recommendation: true,
      read_only: true
    },
    shows: "Tryck, komponenter, stabilitet",
    does_not_show: "Köp/sälj, råd"
  }
];

// ============================================
// LOOKUP & VALIDATION
// ============================================

export function getDecisionGraph(graphId: string): DecisionGraph | undefined {
  return PRODUCTION_DECISION_GRAPHS.find(g => g.decision_graph_id === graphId);
}

export function getDecisionGraphsByDomain(domain: string): DecisionGraph[] {
  return PRODUCTION_DECISION_GRAPHS.filter(g => g.scope.domain.includes(domain));
}

export function validateDecisionGraph(graph: DecisionGraph): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Must have governance constraints
  if (!graph.governance.no_recommendation) {
    errors.push('Missing no_recommendation governance constraint');
  }
  if (!graph.governance.read_only) {
    errors.push('Missing read_only governance constraint');
  }
  
  // Must have at least one required node
  const requiredNodes = graph.nodes.filter(n => n.required);
  if (requiredNodes.length === 0) {
    errors.push('Decision graph must have at least one required node');
  }
  
  // All nodes must have confidence thresholds
  const missingThresholds = graph.nodes.filter(n => n.confidence_threshold === undefined);
  if (missingThresholds.length > 0) {
    errors.push(`Nodes missing confidence_threshold: ${missingThresholds.map(n => n.node_id).join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors };
}

export function getRequiredAnswerPackets(graphId: string): string[] {
  const graph = getDecisionGraph(graphId);
  if (!graph) return [];
  return graph.nodes
    .filter(n => n.required)
    .map(n => n.answer_packet_ref);
}

export const DECISION_GRAPH_STATS = {
  total: PRODUCTION_DECISION_GRAPHS.length,
  by_domain: {
    healthcare: PRODUCTION_DECISION_GRAPHS.filter(g => g.scope.domain.includes('healthcare')).length,
    health: PRODUCTION_DECISION_GRAPHS.filter(g => g.scope.domain.includes('health')).length,
    economy: PRODUCTION_DECISION_GRAPHS.filter(g => g.scope.domain.includes('economy')).length,
  },
  total_nodes: PRODUCTION_DECISION_GRAPHS.reduce((sum, g) => sum + g.nodes.length, 0),
  required_nodes: PRODUCTION_DECISION_GRAPHS.reduce(
    (sum, g) => sum + g.nodes.filter(n => n.required).length, 0
  ),
} as const;
