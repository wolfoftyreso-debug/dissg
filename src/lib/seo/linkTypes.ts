/**
 * 🔗 MASTER EXECUTION BLOCK 48
 * 
 * AUTO INTERNAL LINK ENGINE — Type Definitions
 * 
 * Relation types for semantic graph navigation:
 * A. HIERARCHY (vertical) - parent/child levels
 * B. TIME (horizontal) - periods, sequences
 * C. DOMAIN (semantic) - topic connections
 * D. COMPARISON (cluster) - similar entities
 */

// ============================================================
// CORE TYPES
// ============================================================

export type LinkRelationType = 
  | 'hierarchy_parent'
  | 'hierarchy_child'
  | 'time_previous'
  | 'time_next'
  | 'time_series'
  | 'domain_question'
  | 'domain_indicator'
  | 'domain_source'
  | 'comparison_similar'
  | 'comparison_cluster';

export type PageType = 
  | 'fact'
  | 'indicator'
  | 'question'
  | 'location'
  | 'history';

export type ScopeLevel = 
  | 'global'
  | 'continent'
  | 'country'
  | 'region'
  | 'municipality';

// ============================================================
// LINK STRUCTURE
// ============================================================

export interface SemanticLink {
  /** Target URL */
  url: string;
  
  /** Descriptive anchor text (never "read more") */
  title: string;
  
  /** Relation type for categorization */
  relationType: LinkRelationType;
  
  /** Priority for sorting (1.0 = highest) */
  priority: number;
  
  /** Optional: aria-label for accessibility */
  ariaLabel?: string;
}

export interface LinkGroup {
  /** Section heading */
  heading: string;
  
  /** Grouped links */
  links: SemanticLink[];
  
  /** Relation category */
  category: 'hierarchy' | 'time' | 'domain' | 'comparison';
}

// ============================================================
// PAGE CONTEXT (Input for link generation)
// ============================================================

export interface PageContext {
  /** Page type */
  pageType: PageType;
  
  /** Topic/question code */
  topic: string;
  
  /** Geographic scope level */
  scopeLevel: ScopeLevel;
  
  /** Location identifier */
  locationCode: string;
  
  /** Location display name */
  locationName: string;
  
  /** Time range (e.g., "1990-2024") */
  timeRange: string;
  
  /** Indicator codes used on this page */
  indicatorCodes?: string[];
  
  /** Source IDs */
  sourceIds?: string[];
  
  /** Parent question code (for facts) */
  parentQuestionCode?: string;
  
  /** Cluster/comparison group ID */
  comparisonClusterId?: string;
}

// ============================================================
// LINK ENGINE OUTPUT
// ============================================================

export interface GeneratedLinks {
  /** All links, deduplicated and limited */
  all: SemanticLink[];
  
  /** Grouped by category for rendering */
  grouped: LinkGroup[];
  
  /** Total before limit (for debugging) */
  totalBeforeLimit: number;
  
  /** Generation timestamp */
  generatedAt: string;
}

// ============================================================
// CONFIGURATION
// ============================================================

export const LINK_CONFIG = {
  /** Maximum links per page */
  MAX_LINKS_PER_PAGE: 25,
  
  /** Maximum links per category */
  MAX_LINKS_PER_CATEGORY: 8,
  
  /** Maximum comparison links */
  MAX_COMPARISON_LINKS: 5,
  
  /** Minimum links for healthy page */
  MIN_LINKS_HEALTHY: 5,
} as const;

// ============================================================
// SCOPE HIERARCHY (for vertical navigation)
// ============================================================

export const SCOPE_HIERARCHY: Record<ScopeLevel, ScopeLevel | null> = {
  global: null,
  continent: 'global',
  country: 'continent',
  region: 'country',
  municipality: 'region',
};

export const SCOPE_CHILDREN: Record<ScopeLevel, ScopeLevel | null> = {
  global: 'continent',
  continent: 'country',
  country: 'region',
  region: 'municipality',
  municipality: null,
};
