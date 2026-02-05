/**
 * PUBLIC READ-ONLY PORTAL — TYPES
 * 
 * Transparency without narrative. Insight without influence.
 * 
 * The portal shall:
 * - Show how decisions are structured
 * - Show what was known and uncertain
 * - Enable verification over time
 * 
 * The portal shall NOT:
 * - Influence decisions
 * - Interpret outcomes
 * - Simplify to conclusions
 * - Create debate or ranking
 */

// ============================================================================
// PORTAL SECTIONS (FIXED)
// ============================================================================

export type PortalSection = 'decisions' | 'reference_cases' | 'cannot_answer' | 'method_standards';

export interface PortalSectionConfig {
  readonly id: PortalSection;
  readonly name: string;
  readonly description: string;
  readonly path: string;
  readonly allowsInteraction: false; // Always false
}

// ============================================================================
// DECISION LISTING
// ============================================================================

export type LegitimacyStatus = 'legitimate' | 'pending_review' | 'incomplete' | 'invalidated';
export type ReviewStatus = 'not_reviewed' | 'under_review' | 'reviewed' | 'disputed';

export interface PublicDecision {
  readonly decision_id: string;
  readonly domain: string;
  readonly scope_population: string;
  readonly scope_time_horizon: string;
  readonly alternatives_count: number;
  readonly uncertainties_count: number;
  readonly legibility_score: number; // 0-100
  readonly legitimacy_status: LegitimacyStatus;
  readonly review_status: ReviewStatus;
  readonly locked_at: string | null;
  readonly published_at: string;
  readonly publication_delay_months: number | null;
}

// ============================================================================
// DECISION DETAIL VIEW
// ============================================================================

export interface DecisionDetailView {
  // Canonical Block (top)
  readonly header: {
    readonly decision_id: string;
    readonly decision_type: string;
    readonly scope: string; // "Individual | EU | 5 years"
    readonly legitimacy_status: LegitimacyStatus;
    readonly locked_at: string | null;
  };
  
  // Fixed order sections
  readonly context: DecisionContext;
  readonly assumptions: DecisionAssumption[];
  readonly alternatives: DecisionAlternative[];
  readonly tradeoffs: DecisionTradeoff[];
  readonly uncertainties: DecisionUncertainty[];
  readonly evidence: DecisionEvidence[];
  readonly review: DecisionReview | null;
}

export interface DecisionContext {
  readonly decision_question: string;
  readonly scope_definition: string;
  readonly time_horizon: string;
  readonly population_affected: string;
  readonly locked: boolean;
}

export interface DecisionAssumption {
  readonly id: string;
  readonly assumption_text: string;
  readonly is_explicit: boolean;
  readonly source: string | null;
}

export interface DecisionAlternative {
  readonly id: string;
  readonly alternative_name: string;
  readonly description: string;
  readonly is_evaluated: boolean;
  // Symmetric - no ranking or preference
}

export interface DecisionTradeoff {
  readonly id: string;
  readonly dimension: string;
  readonly description: string;
  readonly affects_alternatives: string[];
}

export interface DecisionUncertainty {
  readonly id: string;
  readonly uncertainty_type: string;
  readonly description: string;
  readonly data_gap: string | null;
  readonly severity: 'low' | 'medium' | 'high';
}

export interface DecisionEvidence {
  readonly id: string;
  readonly source_name: string;
  readonly source_url: string | null;
  readonly access_date: string;
  readonly reliability_score: number;
}

export interface DecisionReview {
  readonly reviewed_at: string;
  readonly reviewer_type: 'internal' | 'external' | 'peer';
  readonly outcome: 'confirmed' | 'disputed' | 'updated';
  readonly notes: string | null;
}

// ============================================================================
// REFERENCE CASES
// ============================================================================

export type OutcomeClassification = 'positive' | 'negative' | 'mixed' | 'unknown';

export interface ReferenceCase {
  readonly case_id: string;
  readonly decision_id: string;
  readonly domain: string;
  readonly why_reference: string;
  readonly outcome: OutcomeClassification;
  readonly deviation_foreseeable: boolean;
  readonly lessons: string[];
  readonly created_at: string;
}

// ============================================================================
// CANNOT ANSWER YET
// ============================================================================

export interface CannotAnswerEntry {
  readonly query_hash: string; // Anonymous
  readonly domain: string;
  readonly data_gaps: string[];
  readonly last_coverage_check: string;
  readonly created_at: string;
}

// ============================================================================
// METHOD & STANDARDS
// ============================================================================

export interface MethodDocument {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly content_type: 'charter' | 'ontology' | 'guide' | 'exclusions';
  readonly version: string;
  readonly last_updated: string;
}

// ============================================================================
// PUBLIC API ENDPOINTS
// ============================================================================

export interface PublicAPIEndpoint {
  readonly method: 'GET';
  readonly path: string;
  readonly description: string;
  readonly response_type: string;
}

// ============================================================================
// PUBLICATION DELAY
// ============================================================================

export interface PublicationDelay {
  readonly decision_id: string;
  readonly delay_months: number;
  readonly reason: 'sensitivity' | 'review_pending' | 'legal';
  readonly publish_after: string;
  readonly is_visible: true; // Always visible
}

// ============================================================================
// EXPORT REQUIREMENTS
// ============================================================================

export interface ExportRequirements {
  readonly requires_scope: true;
  readonly requires_time_horizon: true;
  readonly requires_uncertainty_block: true;
  readonly prevents_isolated_quotes: true;
  readonly prevents_numbers_without_baseline: true;
}

// ============================================================================
// TRUST ANCHORS
// ============================================================================

export interface TrustAnchor {
  readonly artifact_id: string;
  readonly checksum_sha256: string;
  readonly mirrored_at: string;
  readonly mirror_locations: string[];
  readonly verifiable: boolean;
}
