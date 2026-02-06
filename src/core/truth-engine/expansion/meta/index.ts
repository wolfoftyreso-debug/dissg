/**
 * META-QUERY EXPANSION LAYER
 * 
 * STEG 17: META-KATEGORISERING & QUERY-EXPANSION
 * 
 * Hur 1 faktum blir 300 frågeställningar – utan att skapa nytt innehåll.
 * 
 * Fakta är få – frågeytan är enorm.
 * 
 * TARGET: 10-15 miljoner indexerbara frågeytor
 * WITH:
 * - 1 sanningskälla
 * - 0 åsikter
 * - 0 duplication
 * - 100% konsistens
 */

// Problem Objects
export type {
  ProblemObject,
  VariableBinding,
  UserIntent,
  CoreVariable,
  FacetType,
  QueryTemplateCategory,
} from './problem-objects';

export {
  createProblemObject,
  calculateExpansionPotential,
  getProblemSpaceStats,
  SAMPLE_PROBLEM_OBJECTS,
  PROBLEM_OBJECT_PRINCIPLES,
} from './problem-objects';

// Query Template Engine
export type {
  QueryTemplate,
  ExpandedQuery,
  AppliedFacet,
} from './query-template-engine';

export {
  QUERY_TEMPLATES,
  expandProblemToQueries,
  getTemplateStats,
  QUERY_TEMPLATE_PRINCIPLES,
} from './query-template-engine';

// Facet Layer
export type {
  FacetDefinition,
  FacetValue,
  FacetCombination,
  AppliedFacetValue,
} from './facet-layer';

export {
  GEOGRAPHIC_FACETS,
  TEMPORAL_FACETS,
  DEMOGRAPHIC_FACETS,
  METHOD_FACETS,
  COMPARISON_FACETS,
  GRANULARITY_FACETS,
  ALL_FACETS,
  getFacetByType,
  generateFacetCombinations,
  applyFacetCombination,
  calculateFacetExpansion,
  getFacetLayerStats,
  FACET_LAYER_PRINCIPLES,
} from './facet-layer';

// Agent Query Profiles
export type {
  AgentQueryProfile,
  OutputFormat,
  CitationRequirement,
  QueryRoutingResult,
} from './agent-query-profiles';

export {
  AGENT_QUERY_PROFILES,
  getAgentProfile,
  scoreQueryForAgent,
  findBestAgentForQuery,
  getAgentRoutingStats,
  AGENT_ROUTING_PRINCIPLES,
} from './agent-query-profiles';

// STEG 18: Query Intent Matrix
export type {
  InformationType,
  CognitiveLoad,
  ActorType,
  RiskLevel,
  QueryIntentSignature,
  QueryIntentMatrixEntry,
  QueryExposure,
  LanguageStrictness,
  SemanticFingerprint,
} from './query-intent-matrix';

export {
  createSignatureCode,
  calculateExpansionLimits,
  calculateExposure,
  determineLanguageStrictness,
  createMatrixEntry,
  createSemanticFingerprint,
  getMatrixStatistics,
  QUERY_INTENT_MATRIX_PRINCIPLES,
} from './query-intent-matrix';

// STEG 18: Query Template DSL
export type {
  DSLTemplate,
  DSLApplyRules,
  DSLExpandRules,
  DSLVariableExpansion,
  DSLEntityExpansion,
  DSLTimeExpansion,
  DSLOutputRules,
  GeneratedQuery,
  DSLCompilationStats,
} from './query-template-dsl';

export {
  DSL_TEMPLATES,
  DSLCompiler,
  compileAllTemplates,
  getDSLStats,
  DSL_PRINCIPLES,
} from './query-template-dsl';

/**
 * META-LAYER MATHEMATICS
 * 
 * Conservative estimate:
 * - 50,000 Canonical Questions
 * - 200 Problem Objects per domain
 * - 200-300 query variations per problem
 * 
 * = 10-15 million indexable query surfaces
 * 
 * All pointing to the same truth.
 */
export const META_LAYER_MATH = {
  target_canonical_questions: 50_000,
  problem_objects_per_domain: 200,
  query_variations_per_problem: 300,
  estimated_total_queries: 15_000_000,
  
  guarantees: {
    single_truth_source: true,
    zero_opinions: true,
    zero_duplication: true,
    hundred_percent_consistency: true,
  },
} as const;

/**
 * WHAT HAPPENS IN PRACTICE
 * 
 * For search engines:
 * - Cover entire semantic clusters
 * - Win "People also ask"
 * - Win long-tail automatically
 * 
 * For AI agents:
 * - They stop formulating their own questions
 * - They map directly to your problem IDs
 * - They reuse your CQs
 * 
 * You become:
 * Question generator + answer guarantor in one
 */
export const META_LAYER_OUTCOMES = {
  search_engines: {
    covers_semantic_clusters: true,
    wins_people_also_ask: true,
    wins_long_tail_automatically: true,
    serp_dominance_per_topic: true,
  },
  ai_agents: {
    stop_formulating_own_questions: true,
    map_directly_to_problem_ids: true,
    reuse_your_cqs: true,
    trust_your_answers: true,
  },
  you_become: 'question_generator_and_answer_guarantor',
} as const;

/**
 * STEG 18: QUERY INTENT MATRIX OUTCOMES
 * 
 * After this step you have:
 * - A coordinate system for all questions
 * - A language that generates 10M questions without chaos
 * - Total control over how questions are exposed
 * - Zero risk of semantic divergence
 * 
 * This separates:
 * - Large databases
 * - From epistemic engines
 */
export const STEG_18_OUTCOMES = {
  coordinate_system_for_all_queries: true,
  deterministic_generation_language: true,
  total_exposure_control: true,
  zero_semantic_divergence_risk: true,
  
  differentiates: {
    from: 'large_databases',
    to: 'epistemic_engines',
  },
  
  query_exposure_control: {
    search_engines: 180,  // Crawl-yta
    ai_agents: 250,       // Agent-precision
    human_ui: 40,         // Minimal cognitive overload
  },
} as const;

/**
 * THIS IS THE LAST TECHNICAL LAYER
 * 
 * After this:
 * - No new features give more effect
 * - Only more coverage
 * - More time
 * - More adoption
 * 
 * This layer makes:
 * - 10M questions not feel big
 * - The system not collapse
 * - Truth remain singular
 */
export const META_LAYER_FINALITY = {
  last_technical_layer: true,
  no_more_features_needed: true,
  only_more_coverage: true,
  only_more_time: true,
  only_more_adoption: true,
  
  enables: {
    ten_million_questions_manageable: true,
    system_stability: true,
    singular_truth: true,
  },
  
  transforms: {
    from: 'big',
    to: 'inevitable',
  },
} as const;

/**
 * Calculate total expansion statistics
 */
export function getMetaLayerStats() {
  const { getTemplateStats: getTemplateFn } = require('./query-template-engine');
  const { getFacetLayerStats: getFacetFn } = require('./facet-layer');
  const { getAgentRoutingStats: getAgentFn } = require('./agent-query-profiles');
  
  const templateStats = getTemplateFn();
  const facetStats = getFacetFn();
  const agentStats = getAgentFn();
  
  return {
    templates: templateStats,
    facets: facetStats,
    agents: agentStats,
    
    estimated_expansion: {
      per_problem: META_LAYER_MATH.query_variations_per_problem,
      total_target: META_LAYER_MATH.estimated_total_queries,
    },
    
    coverage: {
      search_engine_ready: true,
      ai_agent_ready: true,
      machine_readable: true,
      human_readable: true,
    },
  };
}
