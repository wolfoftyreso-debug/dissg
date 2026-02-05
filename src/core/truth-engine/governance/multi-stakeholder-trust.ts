/**
 * MULTI-STAKEHOLDER TRUST MODEL
 * 
 * Three stakeholders recognized:
 * 1. Machines — require structure, determinism
 * 2. Humans — require comprehensibility
 * 3. Institutions — require accountability & traceability
 * 
 * All three get:
 * - Different interfaces
 * - Same truth
 * - Same limitations
 */

/**
 * STAKEHOLDER DEFINITIONS
 */
export const STAKEHOLDERS = {
  machines: {
    id: 'machines',
    name: 'AI Agents & Systems',
    requirements: [
      'Deterministic structure',
      'Machine-readable formats',
      'Stable identifiers',
      'Zero-friction access',
      'Semantic versioning',
    ],
    interfaces: [
      'REST API',
      'JSON-LD',
      'Schema.org markup',
      'SDMX exports',
      'GraphQL (future)',
    ],
    trust_mechanism: 'Structure consistency + version stability',
  },
  
  humans: {
    id: 'humans',
    name: 'Human Decision-Makers',
    requirements: [
      'Comprehensible language',
      'Visual representations',
      'Drill-down capability',
      'Context and limitations',
      'Source transparency',
    ],
    interfaces: [
      'Web application',
      'Decision graphs (visual)',
      'Interactive charts',
      'Narrative summaries',
      'Export to familiar formats',
    ],
    trust_mechanism: 'Clarity + source visibility + limitation honesty',
  },
  
  institutions: {
    id: 'institutions',
    name: 'Organizations & Governments',
    requirements: [
      'Audit trail',
      'Reproducibility',
      'Accountability chain',
      'Compliance documentation',
      'Long-term stability',
    ],
    interfaces: [
      'Governance API',
      'Audit logs',
      'Decision artifacts',
      'Compliance reports',
      'Version history',
    ],
    trust_mechanism: 'Traceability + governance + succession protocol',
  },
} as const;

/**
 * UNIVERSAL GUARANTEES (same for all stakeholders)
 */
export const UNIVERSAL_GUARANTEES = [
  {
    guarantee: 'Same underlying truth',
    description: 'All stakeholders access the same canonical data',
    verification: 'Hash-verified Answer Packets',
  },
  {
    guarantee: 'Same limitations shown',
    description: 'No stakeholder sees "better" or "cleaner" data',
    verification: 'Limitation blocks mandatory in all interfaces',
  },
  {
    guarantee: 'Same methodology applied',
    description: 'Calculations identical regardless of interface',
    verification: 'Single calculation engine, multiple views',
  },
  {
    guarantee: 'Same versioning',
    description: 'Updates apply to all interfaces simultaneously',
    verification: 'Unified version control',
  },
] as const;

/**
 * TRUST SIGNALS BY STAKEHOLDER
 */
export const TRUST_SIGNALS = {
  machines: {
    signals: [
      { signal: 'Uptime SLA', target: '99.9%' },
      { signal: 'Response time', target: '<200ms' },
      { signal: 'Schema stability', target: 'Semantic versioning' },
      { signal: 'Breaking changes', target: '12-month deprecation' },
    ],
  },
  
  humans: {
    signals: [
      { signal: 'Source visibility', target: '100% of data points' },
      { signal: 'Drill-down depth', target: 'To raw source' },
      { signal: 'Uncertainty display', target: 'On every value' },
      { signal: 'Assumption exposure', target: 'Before every scenario' },
    ],
  },
  
  institutions: {
    signals: [
      { signal: 'Governance transparency', target: 'Public log' },
      { signal: 'Methodology documentation', target: 'Complete' },
      { signal: 'Succession protocol', target: 'Published' },
      { signal: 'Independent review', target: 'Standards Council' },
    ],
  },
} as const;

/**
 * CONFLICT RESOLUTION
 */
export const CONFLICT_RESOLUTION = {
  principle: 'When stakeholder needs conflict, truth wins',
  examples: [
    {
      conflict: 'Machines want faster, humans want more context',
      resolution: 'Machines get fast, humans get context — different interfaces, same data',
    },
    {
      conflict: 'Institutions want certainty, data is uncertain',
      resolution: 'Show uncertainty honestly — institution must adapt to reality',
    },
    {
      conflict: 'Humans want recommendations, system cannot recommend',
      resolution: 'Provide decision structure, never recommendation',
    },
  ],
} as const;

/**
 * WHY THIS IS HARD TO COPY
 */
export const COMPETITIVE_MOAT = {
  difficulty: 'Extremely difficult to replicate',
  reasons: [
    'Requires commitment to non-recommendation',
    'Requires willingness to show uncertainty',
    'Requires governance structure, not just tech',
    'Requires long-term trust building',
    'Requires refusing profitable shortcuts',
  ],
  result: 'Others can copy ideas, not depth',
} as const;
