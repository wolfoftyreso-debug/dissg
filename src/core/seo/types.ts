/**
 * SEO & STRUCTURED DATA SPEC v1
 * 
 * PRINCIPLES (ABSOLUTE):
 * - No clickbait
 * - No "best of"
 * - No recommendation
 * - All structured data points to decision structure, not conclusion
 * - Same page = human + machine, never two truths
 */

// ═══════════════════════════════════════════════════════════════════
//                         PAGE TYPES
// ═══════════════════════════════════════════════════════════════════

/**
 * Exactly three public page types:
 * 1. CDP - Conditional Decision Page ("Is X good?" questions)
 * 2. DRC - Decision Reference Case (historical, locked decisions)
 * 3. UYP - Unanswerable Yet Page ("Cannot be answered responsibly yet")
 */
export type PageType = 'CDP' | 'DRC' | 'UYP';

export interface PageTypeConfig {
  readonly type: PageType;
  readonly name: string;
  readonly purpose: string;
  readonly urlPattern: string;
}

export const PAGE_TYPES: Record<PageType, PageTypeConfig> = {
  CDP: {
    type: 'CDP',
    name: 'Conditional Decision Page',
    purpose: '"Is X good?" questions',
    urlPattern: '/decision/{domain}/{entity}',
  },
  DRC: {
    type: 'DRC',
    name: 'Decision Reference Case',
    purpose: 'Historical, locked decisions',
    urlPattern: '/reference/{decision_id}',
  },
  UYP: {
    type: 'UYP',
    name: 'Unanswerable Yet Page',
    purpose: '"This cannot be answered responsibly yet"',
    urlPattern: '/cannot-answer/{query_hash}',
  },
};

// ═══════════════════════════════════════════════════════════════════
//                         URL STRUCTURE
// ═══════════════════════════════════════════════════════════════════

export interface CanonicalUrl {
  readonly path: string;
  readonly domain: string;
  readonly entity: string;
  readonly variant?: 'assumptions' | 'uncertainty';
}

// ═══════════════════════════════════════════════════════════════════
//                         HTML STRUCTURE
// ═══════════════════════════════════════════════════════════════════

/**
 * H2 sections in fixed order (Google loves consistency)
 */
export const CDP_SECTION_ORDER = [
  'Decision Scope',
  'Assumptions Required',
  'Alternatives Considered',
  'Trade-offs & Dominance Conditions',
  'Known Uncertainties',
  'What This Does Not Mean',
] as const;

export type CDPSection = typeof CDP_SECTION_ORDER[number];

// ═══════════════════════════════════════════════════════════════════
//                         SCHEMA.ORG TYPES
// ═══════════════════════════════════════════════════════════════════

export interface SchemaOrgDefinedTerm {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'DefinedTerm';
  readonly name: string;
  readonly description: string;
  readonly inDefinedTermSet: string;
}

export interface SchemaOrgFAQPage {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'FAQPage';
  readonly mainEntity: readonly SchemaOrgQuestion[];
}

export interface SchemaOrgQuestion {
  readonly '@type': 'Question';
  readonly name: string;
  readonly acceptedAnswer: {
    readonly '@type': 'Answer';
    readonly text: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         CUSTOM ONTOLOGY
// ═══════════════════════════════════════════════════════════════════

export const ONTOLOGY_NAMESPACE = 'https://decisionlegitimacy.org/ontology#';

export interface DecisionLegitimacySchema {
  readonly '@context': {
    readonly dl: typeof ONTOLOGY_NAMESPACE;
  };
  readonly '@type': 'dl:ConditionalDecision';
  readonly 'dl:entity': string;
  readonly 'dl:decisionType': string;
  readonly 'dl:assumptionsRequired': boolean;
  readonly 'dl:alternativesExposed': boolean;
  readonly 'dl:uncertaintiesVisible': boolean;
  readonly 'dl:recommendationGiven': false; // ALWAYS false
}

// ═══════════════════════════════════════════════════════════════════
//                         AI CRAWLER OUTPUT
// ═══════════════════════════════════════════════════════════════════

export interface MachineReadableDecision {
  readonly decision_type: string;
  readonly entity: string;
  readonly domain: string;
  readonly alternatives_exposed: boolean;
  readonly alternatives_count: number;
  readonly uncertainties: number;
  readonly assumptions_required: readonly string[];
  readonly recommendation: false; // ALWAYS false
  readonly ontology_version: string;
  readonly page_type: PageType;
  readonly canonical_url: string;
}

// ═══════════════════════════════════════════════════════════════════
//                         UYP (UNANSWERABLE YET)
// ═══════════════════════════════════════════════════════════════════

export interface UnanswerableYetData {
  readonly query_hash: string;
  readonly original_query: string;
  readonly data_gaps: readonly string[];
  readonly missing_requirements: readonly string[];
  readonly estimated_resolution?: string;
}
