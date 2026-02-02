/**
 * Simplification Components Index
 * 
 * All components that enforce:
 * - Fewer choices
 * - Fewer words  
 * - More truths per second
 */

// Config
export {
  URL_HIERARCHY,
  MAX_NAVIGATION_DEPTH,
  LINK_RULES,
  CONTENT_RULES,
  DESIGN_RULES,
  SEO_RULES,
  SCHEMA_RULES,
  NAVIGATION_RULES,
  FACT_LAYER_REQUIREMENTS,
  SIMPLIFICATION_CHECKLIST,
  SIMPLIFICATION_DONE_CRITERIA,
  isValidSentence,
  countInternalLinks,
  validateLink,
  generateOptimizedTitle,
  generateOptimizedDescription,
  validatePageStructure,
  type LinkType,
  type SemanticLink as SemanticLinkType,
} from '@/config/simplificationConfig';

// SEO Components
export { 
  OptimizedPageHead, 
  SimplePageHead 
} from '@/components/seo/OptimizedPageHead';

// Content Components
export {
  SimplifiedSummary,
  WhatThisShowsBlock,
  SectionBlock,
  SemanticLink,
  SemanticLinkGroup,
} from '@/components/content/SimplifiedContentBlock';

// Layout Components
export {
  SimplifiedPageLayout,
  PageHeader,
  FactPageTemplate,
  IndicatorPageTemplate,
} from '@/components/layout/SimplifiedPageLayout';

// Navigation Components
export {
  DataDrivenNav,
  TopFactsNav,
  RecentUpdatesNav,
  BreadcrumbNav,
} from '@/components/navigation/DataDrivenNav';
