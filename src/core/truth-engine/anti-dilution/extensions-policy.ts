/**
 * EXTENSIONS POLICY
 * 
 * STEG 26: EXTENSIONS, NOT MODIFICATIONS
 * 
 * You allow:
 * - External visualizations
 * - Pedagogical layers
 * - Analysis tools
 * - UX experiments
 * 
 * But:
 * - They may never write back
 * - They may never change structure
 * - They may never affect visibility
 */

/**
 * ALLOWED EXTENSIONS
 */
export const ALLOWED_EXTENSIONS = {
  visualization: {
    description: 'Graphical representation of data',
    allowed: true,
    restrictions: [
      'Must use unmodified core data',
      'Must preserve all uncertainty indicators',
      'Must link back to source',
    ],
  },
  
  pedagogy: {
    description: 'Educational explanations',
    allowed: true,
    restrictions: [
      'Must clearly separate from core data',
      'Must not replace core output',
      'Must acknowledge limitations',
    ],
  },
  
  analysis: {
    description: 'Derived calculations and insights',
    allowed: true,
    restrictions: [
      'Must show methodology',
      'Must be clearly labeled as derived',
      'Must not modify source data',
    ],
  },
  
  ux: {
    description: 'User interface improvements',
    allowed: true,
    restrictions: [
      'Must preserve access to raw data',
      'Must not hide uncertainty',
      'Must not editorialize',
    ],
  },
  
  translation: {
    description: 'Language localization',
    allowed: true,
    restrictions: [
      'Must preserve semantic meaning',
      'Must keep original available',
      'Must not interpret or adapt',
    ],
  },
} as const;

/**
 * FORBIDDEN EXTENSION BEHAVIORS
 */
export const FORBIDDEN_BEHAVIORS = {
  write_back: {
    description: 'Any extension writing to core',
    forbidden: true,
    reason: 'Violates immutability',
    enforcement: 'Architecturally impossible',
  },
  
  structure_change: {
    description: 'Modifying schema or format',
    forbidden: true,
    reason: 'Violates contract',
    enforcement: 'Schema validation rejects',
  },
  
  visibility_control: {
    description: 'Hiding or prioritizing core data',
    forbidden: true,
    reason: 'Introduces bias',
    enforcement: 'Audit logging detects',
  },
  
  summarization: {
    description: 'Replacing data with summaries',
    forbidden: true,
    reason: 'Information loss',
    enforcement: 'Raw data access mandatory',
  },
  
  interpretation: {
    description: 'Adding meaning or judgment',
    forbidden: true,
    reason: 'Epistemological corruption',
    enforcement: 'Output validation',
  },
} as const;

/**
 * EXTENSION ARCHITECTURE
 */
export const EXTENSION_ARCHITECTURE = {
  layer_model: {
    core: {
      level: 0,
      access: 'read_only',
      modifications: 'none',
    },
    extension: {
      level: 1,
      access: 'read_core_write_extension',
      modifications: 'own_layer_only',
    },
    application: {
      level: 2,
      access: 'read_extension_write_application',
      modifications: 'own_layer_only',
    },
  },
  
  data_flow: {
    permitted: 'Up only (core → extension → application)',
    forbidden: 'Down (application → extension → core)',
  },
  
  isolation: {
    core_database: 'Separate, read-only replicas',
    extension_database: 'Separate, no core write access',
    api_gateway: 'Enforces direction rules',
  },
} as const;

/**
 * HOW TO SAY NO WITHOUT CONFLICT
 */
export const SAYING_NO_GRACEFULLY = {
  when_asked: 'Can we get a simpler version?',
  
  response: 'That simplification already exists - above the core.',
  
  offer: {
    read_only_core: 'Full access to unmodified data',
    freedom_to_build: 'Build any adaptation you need',
    no_influence_down: 'Your changes stay in your layer',
  },
  
  positioning: 'Cooperative but immovable',
  
  example_responses: {
    simplify_format: 'Build a translator layer. Core format is fixed.',
    merge_concepts: 'Create a mapping in your layer. Core distinctions remain.',
    add_summaries: 'Add summary endpoint in your application. Core returns full data.',
    make_friendlier: 'Add UX layer. Core output is for machines.',
  },
} as const;

/**
 * HISTORICAL PRECEDENTS
 */
export const PRECEDENTS = {
  how_systems_survive_decades: [
    {
      system: 'Web browsers',
      strategy: 'Extensions add features, core HTML unchanged',
    },
    {
      system: 'Databases',
      strategy: 'Views and procedures wrap, core SQL unchanged',
    },
    {
      system: 'Operating systems',
      strategy: 'Applications layer on kernel, kernel minimal',
    },
    {
      system: 'The internet',
      strategy: 'Protocols fixed, applications infinite',
    },
  ],
  
  lesson: 'Stability at core, flexibility at edges',
} as const;
