/**
 * HEALTH TRUTH NODES — PRODUCTION DATA
 * 
 * Population-level health observations.
 * Machine-generated, machine-validated, human-readable.
 */

import type { SemanticOutput } from '../contracts/semantic-output';

export interface HealthTruthNode {
  node_id: string;
  type: 'answer';
  scope: {
    geo: string;
    population: string;
    time: string;
  };
  orientation: {
    baseline: string;
    deviation: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'mixed';
    magnitude: 'low' | 'medium' | 'high' | 'extreme';
    persistence: 'short' | 'medium' | 'long' | 'structural';
  };
  importance: {
    structural: boolean;
    acute: boolean;
    contextual: boolean;
    rationale: string[];
  };
  why_it_matters: string[];
  what_it_does_not_mean: string[];
  uncertainty: {
    sources: string[];
    data_gaps: string[];
    confidence: number;
  };
  next_valid_questions: string[];
}

// ============================================
// PRODUCTION TRUTH NODES
// ============================================

export const HEALTH_TRUTH_NODES: HealthTruthNode[] = [
  // TN-HEALTH-001
  {
    node_id: "health.anxiety_prevalence.youth.v1",
    type: "answer",
    scope: {
      geo: "SE",
      population: "youth_13_19",
      time: "2005-2024"
    },
    orientation: {
      baseline: "Anxiety symptoms have historically been common among adolescents.",
      deviation: "Reported prevalence is above historical baseline.",
      direction: "increasing",
      magnitude: "medium",
      persistence: "long"
    },
    importance: {
      structural: true,
      acute: false,
      contextual: false,
      rationale: [
        "Affects large population segment",
        "Correlates with multiple downstream systems (school, healthcare)"
      ]
    },
    why_it_matters: [
      "Indicates population-level mental health pressure",
      "Impacts education and healthcare demand"
    ],
    what_it_does_not_mean: [
      "This does not imply individual diagnosis",
      "This does not predict individual outcomes"
    ],
    uncertainty: {
      sources: ["self-report bias", "definition changes over time"],
      data_gaps: ["clinical confirmation rates"],
      confidence: 0.78
    },
    next_valid_questions: [
      "How does prevalence vary by region?",
      "How has reporting frequency changed over time?",
      "How does this correlate with sleep duration?"
    ]
  },

  // TN-HEALTH-002
  {
    node_id: "health.sleep_insufficiency.youth.v1",
    type: "answer",
    scope: {
      geo: "SE",
      population: "youth_13_19",
      time: "2000-2024"
    },
    orientation: {
      baseline: "Adequate sleep duration was historically within recommended ranges.",
      deviation: "Average sleep duration is below historical norms.",
      direction: "decreasing",
      magnitude: "medium",
      persistence: "long"
    },
    importance: {
      structural: true,
      acute: false,
      contextual: false,
      rationale: [
        "Foundational for cognitive and emotional functioning",
        "Linked to multiple reported health outcomes"
      ]
    },
    why_it_matters: [
      "Sleep is a cross-domain dependency",
      "Persistent deficit amplifies other stress indicators"
    ],
    what_it_does_not_mean: [
      "This does not indicate sleep disorders",
      "This does not prescribe interventions"
    ],
    uncertainty: {
      sources: ["self-reported sleep duration"],
      data_gaps: ["objective sleep measurements"],
      confidence: 0.81
    },
    next_valid_questions: [
      "How does sleep duration correlate with reported stress?",
      "How has weekday vs weekend sleep changed?"
    ]
  },

  // TN-HEALTH-003
  {
    node_id: "health.stress_prevalence.adults.v1",
    type: "answer",
    scope: {
      geo: "SE",
      population: "adults_20_64",
      time: "2005-2024"
    },
    orientation: {
      baseline: "Reported stress levels have fluctuated within a stable range.",
      deviation: "Recent levels exceed historical variation.",
      direction: "increasing",
      magnitude: "medium",
      persistence: "medium"
    },
    importance: {
      structural: true,
      acute: true,
      contextual: false,
      rationale: [
        "Linked to work capacity and health service demand"
      ]
    },
    why_it_matters: [
      "Stress prevalence affects productivity and healthcare utilization"
    ],
    what_it_does_not_mean: [
      "This does not imply burnout diagnosis",
      "This does not predict individual illness"
    ],
    uncertainty: {
      sources: ["survey methodology differences"],
      data_gaps: ["longitudinal individual tracking"],
      confidence: 0.75
    },
    next_valid_questions: [
      "How does stress vary by age group?",
      "How does stress correlate with sick leave?"
    ]
  },

  // TN-HEALTH-004
  {
    node_id: "health.sick_leave.mental_health.v1",
    type: "answer",
    scope: {
      geo: "SE",
      population: "working_age",
      time: "2000-2024"
    },
    orientation: {
      baseline: "Mental health-related sick leave has existed as a stable component.",
      deviation: "Proportion has increased relative to other causes.",
      direction: "increasing",
      magnitude: "high",
      persistence: "long"
    },
    importance: {
      structural: true,
      acute: false,
      contextual: false,
      rationale: [
        "Direct impact on labor market",
        "Strain on social insurance systems"
      ]
    },
    why_it_matters: [
      "Signals long-term workforce sustainability risks"
    ],
    what_it_does_not_mean: [
      "This does not indicate cause at individual level"
    ],
    uncertainty: {
      sources: ["diagnostic coding practices"],
      data_gaps: ["severity differentiation"],
      confidence: 0.83
    },
    next_valid_questions: [
      "How has duration of sick leave changed?",
      "How does this vary by sector?"
    ]
  },

  // TN-HEALTH-005
  {
    node_id: "health.mental_burden.regional_variation.v1",
    type: "answer",
    scope: {
      geo: "SE_regions",
      population: "all",
      time: "2010-2024"
    },
    orientation: {
      baseline: "Regional differences have been persistent but moderate.",
      deviation: "Some regions consistently exceed national averages.",
      direction: "mixed",
      magnitude: "medium",
      persistence: "long"
    },
    importance: {
      structural: true,
      acute: false,
      contextual: false,
      rationale: [
        "Indicates uneven system load"
      ]
    },
    why_it_matters: [
      "Regional disparities affect access to care"
    ],
    what_it_does_not_mean: [
      "This does not explain causation"
    ],
    uncertainty: {
      sources: ["regional reporting differences"],
      data_gaps: ["within-region heterogeneity"],
      confidence: 0.77
    },
    next_valid_questions: [
      "How does healthcare capacity differ by region?",
      "How stable are these differences over time?"
    ]
  }
];

// ============================================
// LOOKUP & VALIDATION
// ============================================

export function getTruthNode(nodeId: string): HealthTruthNode | undefined {
  return HEALTH_TRUTH_NODES.find(n => n.node_id === nodeId);
}

export function getTruthNodesByScope(geo: string): HealthTruthNode[] {
  return HEALTH_TRUTH_NODES.filter(n => n.scope.geo === geo || n.scope.geo.startsWith(geo));
}

export function getTruthNodesByDirection(direction: HealthTruthNode['orientation']['direction']): HealthTruthNode[] {
  return HEALTH_TRUTH_NODES.filter(n => n.orientation.direction === direction);
}

export function getStructuralNodes(): HealthTruthNode[] {
  return HEALTH_TRUTH_NODES.filter(n => n.importance.structural);
}

// Node count by status
export const HEALTH_NODE_STATS = {
  total: HEALTH_TRUTH_NODES.length,
  structural: HEALTH_TRUTH_NODES.filter(n => n.importance.structural).length,
  acute: HEALTH_TRUTH_NODES.filter(n => n.importance.acute).length,
  increasing: HEALTH_TRUTH_NODES.filter(n => n.orientation.direction === 'increasing').length,
  decreasing: HEALTH_TRUTH_NODES.filter(n => n.orientation.direction === 'decreasing').length,
  avg_confidence: HEALTH_TRUTH_NODES.reduce((sum, n) => sum + n.uncertainty.confidence, 0) / HEALTH_TRUTH_NODES.length,
} as const;
