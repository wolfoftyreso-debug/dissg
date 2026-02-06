/**
 * PUBLIC SCHEMAS
 * 
 * STEG 23: STANDARDISERING GENOM LÄSBARHET, INTE TVÅNG
 * 
 * Publishes openly (free, static):
 * - CQ-schema (read-only)
 * - Problem Object-schema
 * - Intent Matrix
 * - Provenance model
 * - Epistemic states
 * 
 * No adoption required.
 * Imitation is trivial.
 * 
 * This creates an ecosystem that naturally forms around the structure.
 */

/**
 * PUBLIC SCHEMA TYPES
 */
export type PublicSchemaType = 
  | 'canonical_question'
  | 'problem_object'
  | 'intent_matrix'
  | 'provenance'
  | 'epistemic_state'
  | 'entity_registry'
  | 'query_dsl'
  | 'response_format';

/**
 * PUBLIC SCHEMA DEFINITION
 */
export interface PublicSchema {
  readonly type: PublicSchemaType;
  readonly version: string;
  readonly url: string;
  readonly format: 'json-schema' | 'yaml' | 'openapi' | 'graphql';
  readonly license: 'CC0' | 'CC-BY' | 'MIT';
  readonly stability: 'stable' | 'beta' | 'experimental';
  readonly breaking_changes_locked: boolean;
  readonly documentation_url: string;
}

/**
 * ALL PUBLIC SCHEMAS
 */
export const PUBLIC_SCHEMAS: Record<PublicSchemaType, PublicSchema> = {
  canonical_question: {
    type: 'canonical_question',
    version: '1.0.0',
    url: '/schemas/canonical-question.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/canonical-question',
  },
  problem_object: {
    type: 'problem_object',
    version: '1.0.0',
    url: '/schemas/problem-object.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/problem-object',
  },
  intent_matrix: {
    type: 'intent_matrix',
    version: '1.0.0',
    url: '/schemas/intent-matrix.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/intent-matrix',
  },
  provenance: {
    type: 'provenance',
    version: '1.0.0',
    url: '/schemas/provenance.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/provenance',
  },
  epistemic_state: {
    type: 'epistemic_state',
    version: '1.0.0',
    url: '/schemas/epistemic-state.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/epistemic-state',
  },
  entity_registry: {
    type: 'entity_registry',
    version: '1.0.0',
    url: '/schemas/entity-registry.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/entity-registry',
  },
  query_dsl: {
    type: 'query_dsl',
    version: '1.0.0',
    url: '/schemas/query-dsl.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/query-dsl',
  },
  response_format: {
    type: 'response_format',
    version: '1.0.0',
    url: '/schemas/response-format.json',
    format: 'json-schema',
    license: 'CC0',
    stability: 'stable',
    breaking_changes_locked: true,
    documentation_url: '/docs/schemas/response-format',
  },
};

/**
 * PUBLICATION PRINCIPLES
 */
export const PUBLICATION_PRINCIPLES = {
  // Access
  access: {
    free: true,
    no_registration: true,
    no_api_key_for_schemas: true,
    static_hosting: true,
    cdn_distributed: true,
  },
  
  // Licensing
  licensing: {
    default: 'CC0',
    rationale: 'Zero friction for adoption',
    no_attribution_required: true,
    commercial_use_allowed: true,
    modification_allowed: true,
  },
  
  // Stability
  stability: {
    breaking_changes_forbidden: true,
    deprecation_period_months: 24,
    backwards_compatibility_guaranteed: true,
    version_pinning_supported: true,
  },
  
  // Core principle
  principle: 'We do not require adoption. We make imitation trivial.',
} as const;

/**
 * SCHEMA DISCOVERY
 */
export interface SchemaDiscovery {
  readonly well_known_url: string;
  readonly format: 'json';
  readonly contents: {
    readonly schemas: Record<string, string>;
    readonly documentation: string;
    readonly version: string;
  };
}

/**
 * Well-known discovery endpoint
 */
export const SCHEMA_DISCOVERY: SchemaDiscovery = {
  well_known_url: '/.well-known/truth-engine-schemas.json',
  format: 'json',
  contents: {
    schemas: {
      canonical_question: '/schemas/canonical-question.json',
      problem_object: '/schemas/problem-object.json',
      intent_matrix: '/schemas/intent-matrix.json',
      provenance: '/schemas/provenance.json',
      epistemic_state: '/schemas/epistemic-state.json',
      entity_registry: '/schemas/entity-registry.json',
      query_dsl: '/schemas/query-dsl.json',
      response_format: '/schemas/response-format.json',
    },
    documentation: '/docs/schemas',
    version: '1.0.0',
  },
};

/**
 * Get all public schemas
 */
export function getAllPublicSchemas(): PublicSchema[] {
  return Object.values(PUBLIC_SCHEMAS);
}

/**
 * Get schema by type
 */
export function getSchemaByType(type: PublicSchemaType): PublicSchema {
  return PUBLIC_SCHEMAS[type];
}

/**
 * Check if schema is stable
 */
export function isSchemaStable(type: PublicSchemaType): boolean {
  return PUBLIC_SCHEMAS[type].stability === 'stable';
}

/**
 * THE ECOSYSTEM EFFECT
 */
export const ECOSYSTEM_EFFECT = {
  cause: 'Free, stable, readable schemas with zero friction',
  effect: 'Ecosystem naturally forms around the structure',
  mechanism: 'Imitation is cheaper than invention',
} as const;
