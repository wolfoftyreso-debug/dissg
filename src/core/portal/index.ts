/**
 * PUBLIC READ-ONLY PORTAL — PUBLIC API
 * 
 * Transparency without narrative. Insight without influence.
 * 
 * Purpose (hard-locked):
 * - Show how decisions are structured
 * - Show what was known and uncertain
 * - Enable verification over time
 * 
 * NOT:
 * - Influence decisions
 * - Interpret outcomes
 * - Simplify to conclusions
 * - Create debate or ranking
 */

// Types
export type {
  PortalSection,
  PortalSectionConfig,
  LegitimacyStatus,
  ReviewStatus,
  PublicDecision,
  DecisionDetailView,
  DecisionContext,
  DecisionAssumption,
  DecisionAlternative,
  DecisionTradeoff,
  DecisionUncertainty,
  DecisionEvidence,
  DecisionReview,
  OutcomeClassification,
  ReferenceCase,
  CannotAnswerEntry,
  MethodDocument,
  PublicAPIEndpoint,
  PublicationDelay,
  ExportRequirements,
  TrustAnchor,
} from './types';

// Sections
export {
  SECTION_DECISIONS,
  SECTION_REFERENCE_CASES,
  SECTION_CANNOT_ANSWER,
  SECTION_METHOD_STANDARDS,
  ALL_PORTAL_SECTIONS,
  METHOD_DOCUMENTS,
  getSectionById,
  getSectionPath,
  getMethodDocument,
} from './sections';

// API
export {
  PUBLIC_API_ENDPOINTS,
  EXPORT_REQUIREMENTS,
  API_RESPONSE_HEADERS,
  API_CONSTRAINTS,
  getEndpointByPath,
  isReadOnlyEndpoint,
  validateExportRequest,
} from './api';

// Principles
export {
  ACCESS_PRINCIPLES,
  UX_PRINCIPLES,
  CONTENT_PRINCIPLES,
  PUBLICATION_PRINCIPLES,
  MEDIA_SAFE_PRINCIPLES,
  IRREPLACEABILITY,
  FORBIDDEN_ELEMENTS,
  ALLOWED_ELEMENTS,
} from './principles';

// Trust Anchors
export {
  TRUST_ANCHOR_LOCATIONS,
  CHECKSUM_CONFIG,
  ARCHIVING_POLICY,
  createTrustAnchor,
  generateChecksum,
  verifyChecksum,
  createVerificationResult,
  type VerificationResult,
} from './trust-anchors';

// ============================================================================
// VERSION & STATUS
// ============================================================================

export const PORTAL_SPEC_VERSION = {
  version: '1.0',
  status: 'ready',
  created: '2025-01-01',
  
  // Core statement
  statement: 'Transparency without narrative. Insight without influence.',
  
  // What it shows
  shows: 'How responsibility looked in reality',
  
  // Why irreplaceable
  irreplaceable: 'It does not argue. It does not convince. It does not sell.',
} as const;
