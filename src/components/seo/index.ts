/**
 * SEO Components Index
 * 
 * Block 45: Canonical Fact Page — AI + Google Dominance
 * Components optimized for search engines and AI agents.
 * 
 * CRITICAL RULES:
 * ❌ No images, graphs, CTAs, forms, value words
 * ✅ Text, structure, links, sources
 */

export { FactPageTemplate, type FactPageData } from './FactPageTemplate';

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
