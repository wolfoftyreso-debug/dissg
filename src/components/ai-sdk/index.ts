/**
 * AI SDK Components Index
 * 
 * Part of Block 57: AI-Agent SDK — Default Grounding
 */

// Re-export config
export {
  SDK_MODES,
  FAIL_SAFE_RULES,
  QUERY_TYPES,
  SDK_ENDPOINTS,
  RATE_LIMITS,
  AI_DOCUMENTATION,
  EXAMPLE_QUERIES,
  AI_SDK_DONE_CRITERIA,
  formatCitation,
  type SdkMode,
  type GroundedResponse,
  type FailedResponse,
  type SdkResponse,
  type Citation,
} from '@/config/aiAgentSdkConfig';

// Re-export AI Citation Standard
export {
  ALLOWED_CITATION_TEMPLATES,
  FORBIDDEN_FORMULATIONS,
  CITATION_BLOCK_TEMPLATE,
  AI_FALLBACK_RESPONSES,
  AI_REFERENCE_DECLARATION,
  AI_SDK_DONE_CRITERIA as CITATION_DONE_CRITERIA,
  generateCitationBlock,
  generateGroundingMetadata,
  validateAICitation,
  generateAIReferencePage,
  EXAMPLE_CORRECT_RESPONSES,
  type CitationBlock,
  type AIGroundingMetadata,
  type CitationValidationResult,
  type CitationTemplateCode,
  type FallbackResponseCode,
} from '@/config/aiCitationStandard';
