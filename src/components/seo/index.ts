/**
 * SEO Components Index
 * 
 * Block 45: Canonical Fact Page — AI + Google Dominance
 * Block 48: Auto Internal Link Engine
 * Block 49: Indicator Page — Definition, method, usage
 * Block 50: Debate Page — Neutral, data-first contested topics
 * 
 * Components optimized for search engines and AI agents.
 * 
 * CRITICAL RULES:
 * ❌ No images, graphs, CTAs, forms, value words
 * ✅ Text, structure, links, sources
 */

export { FactPageTemplate, type FactPageData } from './FactPageTemplate';
export { IndicatorPageTemplate, type IndicatorPageData } from './IndicatorPageTemplate';
export { DebatePageTemplate, type DebatePageData } from './DebatePageTemplate';
export { SemanticLinkSection, InlineSemanticLinks } from './SemanticLinkSection';

// Re-export config utilities
export { 
  createDatasetSchema,
  createBreadcrumbSchema,
  generateCitations,
  URL_RULES,
  META_RULES,
  SITEMAP_CONFIG,
  ROBOTS_CONFIG,
  SEVEN_DAY_CHECKLIST,
} from '@/config/seoFactStructureConfig';
