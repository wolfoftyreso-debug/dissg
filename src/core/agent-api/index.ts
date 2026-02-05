/**
 * AGENT-NATIVE API
 * 
 * Machine-first. Deterministic. No guessing.
 */

// Schemas
export {
  type ScopeEnvelope,
  type TimeScope,
  type OrientationEnvelope,
  type ImportanceEnvelope,
  type UncertaintyEnvelope,
  type RelationsEnvelope,
  type AgentResponse,
  type SemanticConflictError,
  type GraphNodeResponse,
  type GraphTraversalResponse,
  type SemanticAnswerResponse,
  type IndexResponse,
  type DecisionResolveResponse,
  validateResponseCompleteness,
  createSemanticConflict,
} from './schemas';

// Guardrails
export {
  AGENT_POLICY_HEADER,
  DEFAULT_POLICY,
  parseAgentPolicy,
  checkContentAgainstPolicy,
  runGuardrailCheck,
  createGuardrailResponse,
  requirePolicyHeader,
  type PolicyFlag,
  type AgentPolicy,
  type PolicyViolation,
  type GuardrailResult,
} from './guardrails';

// SDK
import { TruthEngineSDK as SDK, createAgentSDK as createSDKFn } from './sdk';
export { SDK as TruthEngineSDK, createSDKFn as createAgentSDK };
export { SDK_FUNCTIONS, SDK_CONTRACT, type AgentSDKConfig, type SDKResponse } from './sdk';

// Documentation
export {
  AGENT_DOCS,
  MACHINE_FIRST_DECLARATION,
  generateMarkdownDocs,
} from './docs';

/**
 * API VERSION
 */
export const AGENT_API_VERSION = '1.0.0' as const;

/**
 * ENDPOINT REGISTRY
 */
export const ENDPOINTS = {
  // Graph traversal
  'GET /api/graph/node/{id}': 'Get single truth node',
  'GET /api/graph/traverse': 'Traverse graph from node',
  
  // Semantic retrieval
  'GET /api/semantic/answer': 'Get structured answer',
  
  // Index access
  'GET /api/index/{index_id}': 'Get index value',
  
  // Decision underlag
  'GET /api/decision/{graph_id}/resolve': 'Resolve decision graph',
} as const;

/**
 * API RULES
 */
export const API_RULES = {
  no_free_language: true,
  no_summaries: true,
  always_schema: true,
  always_uncertainty: true,
  deterministic: true,
  version_pinned: true,
  cache_stable: true,
} as const;

/**
 * QUICK SDK FACTORY
 */
export function createSDK(baseUrl: string, apiKey?: string) {
  return new SDK({ baseUrl, apiKey });
}
