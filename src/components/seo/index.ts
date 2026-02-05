/**
 * SEO Components Index
 * 
 * SEO & STRUCTURED DATA SPEC v1
 * Canonical Decision Pages (CDP) + Query Compiler Outputs
 * 
 * PRINCIPLES (ABSOLUTE):
 * - No clickbait
 * - No "best of"
 * - No recommendation
 * - All structured data points to decision structure, not conclusion
 * - Same page = human + machine, never two truths
 */

// Page Templates
export { FactPageTemplate, type FactPageData } from './FactPageTemplate';
export { IndicatorPageTemplate, type IndicatorPageData } from './IndicatorPageTemplate';
export { DebatePageTemplate, type DebatePageData } from './DebatePageTemplate';
export { SemanticLinkSection, InlineSemanticLinks } from './SemanticLinkSection';
export { CDPPageTemplate, type CDPPageData } from './CDPPageTemplate';
export { UYPPageTemplate } from './UYPPageTemplate';
export { SEOSpecViewer } from './SEOSpecViewer';

// Machine-readable metadata for AI grounding
export { MachineReadableHead } from './MachineReadableHead';

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

// Re-export core SEO utilities
export * from '@/core/seo';
