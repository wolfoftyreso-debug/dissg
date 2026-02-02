/**
 * 🔗 MASTER EXECUTION BLOCK 48
 * 
 * React Hook for Semantic Links
 * 
 * Provides automatic link generation for any page context.
 * Memoized for performance.
 */

import { useMemo } from 'react';
import { 
  generateSemanticLinks, 
  validateLinkQuality,
  type LinkQualityReport,
} from '@/lib/seo/linkEngine';
import type { 
  PageContext, 
  SemanticLink,
  LinkGroup,
} from '@/lib/seo/linkTypes';

interface UseSemanticLinksResult {
  /** All generated links */
  links: SemanticLink[];
  
  /** Links grouped by category for sectioned rendering */
  groupedLinks: LinkGroup[];
  
  /** Quality validation report */
  quality: LinkQualityReport;
  
  /** Whether the page has healthy link coverage */
  isHealthy: boolean;
  
  /** Total links generated (before limit) */
  totalGenerated: number;
}

/**
 * Hook to generate semantic links for a page
 * 
 * @example
 * ```tsx
 * const { groupedLinks, isHealthy } = useSemanticLinks({
 *   pageType: 'fact',
 *   topic: 'work-and-ai',
 *   scopeLevel: 'country',
 *   locationCode: 'SE',
 *   locationName: 'Sweden',
 *   timeRange: '1990-2024',
 *   parentQuestionCode: 'work-and-ai',
 *   indicatorCodes: ['employment_rate', 'automation_index'],
 * });
 * ```
 */
export function useSemanticLinks(context: PageContext): UseSemanticLinksResult {
  // Memoize link generation (expensive operation)
  const generatedLinks = useMemo(() => {
    return generateSemanticLinks(context);
  }, [
    context.pageType,
    context.topic,
    context.scopeLevel,
    context.locationCode,
    context.timeRange,
    // Stringify arrays for dependency comparison
    JSON.stringify(context.indicatorCodes),
    JSON.stringify(context.sourceIds),
    context.parentQuestionCode,
    context.comparisonClusterId,
  ]);
  
  // Memoize quality validation
  const quality = useMemo(() => {
    return validateLinkQuality(generatedLinks);
  }, [generatedLinks]);
  
  return {
    links: generatedLinks.all,
    groupedLinks: generatedLinks.grouped,
    quality,
    isHealthy: quality.isHealthy,
    totalGenerated: generatedLinks.totalBeforeLimit,
  };
}

/**
 * Simple hook for getting links from FactPageData
 */
export function useFactPageLinks(fact: {
  topic: string;
  scope: 'global' | 'country' | 'region' | 'municipality';
  location: string;
  locationCode: string;
  timeRange: string;
  sources?: Array<{ name: string }>;
}): UseSemanticLinksResult {
  const context: PageContext = {
    pageType: 'fact',
    topic: fact.topic,
    scopeLevel: fact.scope,
    locationCode: fact.locationCode,
    locationName: fact.location,
    timeRange: fact.timeRange,
    parentQuestionCode: fact.topic,
    sourceIds: fact.sources?.map(s => s.name),
  };
  
  return useSemanticLinks(context);
}

export default useSemanticLinks;
