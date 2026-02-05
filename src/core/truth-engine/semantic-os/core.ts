/**
 * SEMANTIC TRUTH OS (ST-OS)
 * 
 * The meaning layer above all data, answers, and decisions.
 * 
 * CORE PRINCIPLE (HARDLOCKED):
 * The system shall never say what to do.
 * The system shall always show what is important, why, and what logically follows.
 * 
 * This is semantic truth, not recommendation.
 */

/**
 * SEMANTIC TRUTH STACK (FINAL ARCHITECTURE)
 */
export const SEMANTIC_TRUTH_STACK = {
  layers: [
    {
      level: 0,
      name: 'Raw Data & APIs',
      description: 'External sources, official statistics, real-time feeds',
      responsibility: 'Ingestion, validation, provenance',
    },
    {
      level: 1,
      name: 'Normalization & Ontology',
      description: 'Unified schema, base classes, semantic typing',
      responsibility: 'Structure, consistency, machine-readability',
    },
    {
      level: 2,
      name: 'Answer Packets',
      description: 'Canonical answers with full scope declarations',
      responsibility: 'Truth units with limitations and sources',
    },
    {
      level: 3,
      name: 'Index & Signals',
      description: 'Aggregated indicators and change detection',
      responsibility: 'Relevance scoring, trend identification',
    },
    {
      level: 4,
      name: 'Decision Graphs',
      description: 'GDG-compliant question structures',
      responsibility: 'Decision decomposition without advice',
    },
    {
      level: 5,
      name: 'SEMANTIC TRUTH OS',
      description: 'The meaning layer',
      responsibility: 'Importance, navigation, comprehension',
    },
  ],
  principle: 'ST-OS is not data. It is the meaning layer.',
} as const;

/**
 * ST-OS CORE CAPABILITIES
 */
export const STOS_CAPABILITIES = {
  importance: {
    name: 'Universal Importance Engine',
    description: 'Answers: What is important? Why? What follows?',
    outputs: ['structural', 'acute', 'contextual'],
  },
  navigation: {
    name: 'Semantic Navigation',
    description: 'Four-way infinite exploration',
    directions: ['up', 'down', 'lateral', 'forward'],
  },
  guardfences: {
    name: 'Semantic Guardfences',
    description: 'Automatic misinterpretation protection',
    locks: ['causality', 'individual_inference', 'action', 'value_neutrality'],
  },
  cognition: {
    name: 'Cognition Alignment',
    description: 'Matches how humans actually understand',
    principles: ['progressive_disclosure', 'context_preservation', 'uncertainty_visibility'],
  },
} as const;

/**
 * ST-OS HARDLOCKS (CANNOT BE OVERRIDDEN)
 */
export const STOS_HARDLOCKS = [
  {
    id: 'no_recommendations',
    rule: 'System never says what to do',
    enforcement: 'Pattern detection + block',
  },
  {
    id: 'always_show_why',
    rule: 'Every importance claim has systemic basis',
    enforcement: 'Required evidence_basis field',
  },
  {
    id: 'infinite_depth',
    rule: 'Every node has further exploration paths',
    enforcement: 'Required deeper_nodes field',
  },
  {
    id: 'full_compliance',
    rule: 'Domain constraints are architecturally enforced',
    enforcement: 'Schema + prompt + runtime checks',
  },
] as const;

/**
 * ST-OS VERSION
 */
export const STOS_VERSION = {
  version: '1.0.0',
  codename: 'SEMANTIC_TRUTH_OS',
  released: '2025-01-01',
  status: 'active',
} as const;
