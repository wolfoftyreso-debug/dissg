/**
 * 🔗 MASTER EXECUTION BLOCK 48
 * 
 * AUTO INTERNAL LINK ENGINE — Core Generation Logic
 * 
 * Builds self-explaining knowledge graph skeleton where:
 * - Every page knows where it belongs
 * - Every page points to relevant truths
 * - No manual links needed
 * - Everything created deterministically from data
 * 
 * 📌 Google loves this.
 * 📌 AI agents require this.
 */

import {
  SemanticLink,
  LinkGroup,
  GeneratedLinks,
  PageContext,
  ScopeLevel,
  LINK_CONFIG,
  SCOPE_HIERARCHY,
  SCOPE_CHILDREN,
} from './linkTypes';

// ============================================================
// URL BUILDERS
// ============================================================

function buildFactUrl(topic: string, scope: ScopeLevel, location: string, timeRange: string): string {
  return `/facts/${topic}/${scope}/${location.toLowerCase()}/${timeRange}`;
}

function buildIndicatorUrl(code: string): string {
  return `/indicators/${code.toLowerCase()}`;
}

function buildQuestionUrl(code: string): string {
  return `/questions/${code.toLowerCase()}`;
}

// Reserved for future use
// function buildLocationUrl(scope: ScopeLevel, code: string): string {
//   return `/locations/${scope}/${code.toLowerCase()}`;
// }

// ============================================================
// A. HIERARCHY LINKS (Vertical)
// ============================================================

function generateHierarchyLinks(ctx: PageContext): SemanticLink[] {
  const links: SemanticLink[] = [];
  
  // Parent level link
  const parentScope = SCOPE_HIERARCHY[ctx.scopeLevel];
  if (parentScope) {
    const parentLocation = getParentLocation(ctx.locationCode, parentScope);
    if (parentLocation) {
      links.push({
        url: buildFactUrl(ctx.topic, parentScope, parentLocation.code, ctx.timeRange),
        title: `${formatTopic(ctx.topic)} in ${parentLocation.name} (${formatTimeRange(ctx.timeRange)})`,
        relationType: 'hierarchy_parent',
        priority: 0.95,
        ariaLabel: `View broader context: ${parentLocation.name}`,
      });
    }
  }
  
  // Global context (always link to global if not already there)
  if (ctx.scopeLevel !== 'global') {
    links.push({
      url: buildFactUrl(ctx.topic, 'global', 'world', ctx.timeRange),
      title: `Global ${formatTopic(ctx.topic)} (${formatTimeRange(ctx.timeRange)})`,
      relationType: 'hierarchy_parent',
      priority: 0.9,
      ariaLabel: 'View global context',
    });
  }
  
  // Child level examples (if applicable)
  const childScope = SCOPE_CHILDREN[ctx.scopeLevel];
  if (childScope) {
    const childLocations = getChildLocations(ctx.locationCode, childScope);
    childLocations.slice(0, 3).forEach((child, index) => {
      links.push({
        url: buildFactUrl(ctx.topic, childScope, child.code, ctx.timeRange),
        title: `${formatTopic(ctx.topic)} in ${child.name} (${formatTimeRange(ctx.timeRange)})`,
        relationType: 'hierarchy_child',
        priority: 0.85 - (index * 0.05),
        ariaLabel: `View details for ${child.name}`,
      });
    });
  }
  
  return links;
}

// ============================================================
// B. TIME LINKS (Horizontal)
// ============================================================

function generateTimeLinks(ctx: PageContext): SemanticLink[] {
  const links: SemanticLink[] = [];
  const [startYear, endYear] = parseTimeRange(ctx.timeRange);
  
  if (!startYear || !endYear) return links;
  
  const periodLength = endYear - startYear;
  
  // Previous period
  const prevEnd = startYear;
  const prevStart = startYear - periodLength;
  if (prevStart >= 1900) {
    links.push({
      url: buildFactUrl(ctx.topic, ctx.scopeLevel, ctx.locationCode, `${prevStart}-${prevEnd}`),
      title: `${formatTopic(ctx.topic)} in ${ctx.locationName} (${prevStart}–${prevEnd})`,
      relationType: 'time_previous',
      priority: 0.9,
      ariaLabel: `Earlier period: ${prevStart}–${prevEnd}`,
    });
  }
  
  // Next period (if data might exist)
  const currentYear = new Date().getFullYear();
  if (endYear < currentYear) {
    const nextStart = endYear;
    const nextEnd = Math.min(endYear + periodLength, currentYear);
    links.push({
      url: buildFactUrl(ctx.topic, ctx.scopeLevel, ctx.locationCode, `${nextStart}-${nextEnd}`),
      title: `${formatTopic(ctx.topic)} in ${ctx.locationName} (${nextStart}–${nextEnd})`,
      relationType: 'time_next',
      priority: 0.9,
      ariaLabel: `Later period: ${nextStart}–${nextEnd}`,
    });
  }
  
  // Long historical series (century view)
  if (periodLength < 50) {
    const centuryStart = Math.floor(startYear / 100) * 100;
    links.push({
      url: buildFactUrl(ctx.topic, ctx.scopeLevel, ctx.locationCode, `${centuryStart}-${currentYear}`),
      title: `${formatTopic(ctx.topic)} in ${ctx.locationName} (${centuryStart}–${currentYear})`,
      relationType: 'time_series',
      priority: 0.8,
      ariaLabel: `Full historical series from ${centuryStart}`,
    });
  }
  
  return links;
}

// ============================================================
// C. DOMAIN LINKS (Semantic)
// ============================================================

function generateDomainLinks(ctx: PageContext): SemanticLink[] {
  const links: SemanticLink[] = [];
  
  // Link to parent question (for fact pages)
  if (ctx.parentQuestionCode) {
    links.push({
      url: buildQuestionUrl(ctx.parentQuestionCode),
      title: `${formatTopic(ctx.parentQuestionCode)} – Overview`,
      relationType: 'domain_question',
      priority: 0.95,
      ariaLabel: 'View the broader question this fact addresses',
    });
  }
  
  // Link to indicators used
  if (ctx.indicatorCodes) {
    ctx.indicatorCodes.slice(0, 4).forEach((code, index) => {
      links.push({
        url: buildIndicatorUrl(code),
        title: `${formatIndicator(code)} – Methodology`,
        relationType: 'domain_indicator',
        priority: 0.85 - (index * 0.05),
        ariaLabel: `View methodology for ${formatIndicator(code)}`,
      });
    });
  }
  
  // Related questions based on topic
  const relatedQuestions = getRelatedQuestions(ctx.topic);
  relatedQuestions.slice(0, 2).forEach((q, index) => {
    links.push({
      url: buildQuestionUrl(q.code),
      title: q.title,
      relationType: 'domain_question',
      priority: 0.75 - (index * 0.05),
    });
  });
  
  return links;
}

// ============================================================
// D. COMPARISON LINKS (Cluster)
// ============================================================

function generateComparisonLinks(ctx: PageContext): SemanticLink[] {
  const links: SemanticLink[] = [];
  
  // Only for country, region, municipality levels
  if (ctx.scopeLevel === 'global' || ctx.scopeLevel === 'continent') {
    return links;
  }
  
  // Similar locations in same scope
  const similarLocations = getSimilarLocations(ctx.locationCode, ctx.scopeLevel);
  similarLocations.slice(0, LINK_CONFIG.MAX_COMPARISON_LINKS).forEach((loc, index) => {
    links.push({
      url: buildFactUrl(ctx.topic, ctx.scopeLevel, loc.code, ctx.timeRange),
      title: `${formatTopic(ctx.topic)} in ${loc.name} (${formatTimeRange(ctx.timeRange)})`,
      relationType: 'comparison_similar',
      priority: 0.7 - (index * 0.05),
      ariaLabel: `Compare with similar ${ctx.scopeLevel}: ${loc.name}`,
    });
  });
  
  return links;
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generateSemanticLinks(ctx: PageContext): GeneratedLinks {
  // Generate all link types
  const hierarchyLinks = generateHierarchyLinks(ctx);
  const timeLinks = generateTimeLinks(ctx);
  const domainLinks = generateDomainLinks(ctx);
  const comparisonLinks = generateComparisonLinks(ctx);
  
  // Combine all
  let allLinks = [
    ...hierarchyLinks,
    ...timeLinks,
    ...domainLinks,
    ...comparisonLinks,
  ];
  
  const totalBeforeLimit = allLinks.length;
  
  // Deduplicate by URL
  const seenUrls = new Set<string>();
  allLinks = allLinks.filter(link => {
    if (seenUrls.has(link.url)) return false;
    seenUrls.add(link.url);
    return true;
  });
  
  // Sort by priority (descending)
  allLinks.sort((a, b) => b.priority - a.priority);
  
  // Limit to max
  allLinks = allLinks.slice(0, LINK_CONFIG.MAX_LINKS_PER_PAGE);
  
  // Group for rendering
  const grouped: LinkGroup[] = ([
    {
      heading: 'Context',
      category: 'hierarchy' as const,
      links: allLinks.filter(l => 
        l.relationType === 'hierarchy_parent' || 
        l.relationType === 'hierarchy_child'
      ).slice(0, LINK_CONFIG.MAX_LINKS_PER_CATEGORY),
    },
    {
      heading: 'Time series',
      category: 'time' as const,
      links: allLinks.filter(l => 
        l.relationType.startsWith('time_')
      ).slice(0, LINK_CONFIG.MAX_LINKS_PER_CATEGORY),
    },
    {
      heading: 'Related topics',
      category: 'domain' as const,
      links: allLinks.filter(l => 
        l.relationType.startsWith('domain_')
      ).slice(0, LINK_CONFIG.MAX_LINKS_PER_CATEGORY),
    },
    {
      heading: 'Compare with similar',
      category: 'comparison' as const,
      links: allLinks.filter(l => 
        l.relationType.startsWith('comparison_')
      ).slice(0, LINK_CONFIG.MAX_COMPARISON_LINKS),
    },
  ] as LinkGroup[]).filter(group => group.links.length > 0);
  
  return {
    all: allLinks,
    grouped,
    totalBeforeLimit,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function parseTimeRange(range: string): [number | null, number | null] {
  const parts = range.split('-').map(p => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return [null, null];
}

function formatTimeRange(range: string): string {
  return range.replace('-', '–');
}

function formatTopic(topic: string): string {
  return topic
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatIndicator(code: string): string {
  return code
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// ============================================================
// DATA LOOKUPS (Stub implementations - connect to real data)
// ============================================================

interface LocationInfo {
  code: string;
  name: string;
}

function getParentLocation(childCode: string, _parentScope: ScopeLevel): LocationInfo | null {
  // Stub: In production, query from locations database
  const parentMap: Record<string, LocationInfo> = {
    'SE': { code: 'EU', name: 'Europe' },
    'stockholm': { code: 'SE', name: 'Sweden' },
    'gothenburg': { code: 'SE', name: 'Sweden' },
    'malmo': { code: 'SE', name: 'Sweden' },
  };
  return parentMap[childCode.toLowerCase()] || null;
}

function getChildLocations(parentCode: string, _childScope: ScopeLevel): LocationInfo[] {
  // Stub: In production, query from locations database
  const childrenMap: Record<string, LocationInfo[]> = {
    'SE': [
      { code: 'stockholm', name: 'Stockholm' },
      { code: 'gothenburg', name: 'Gothenburg' },
      { code: 'malmo', name: 'Malmö' },
    ],
    'EU': [
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'SE', name: 'Sweden' },
    ],
  };
  return childrenMap[parentCode.toUpperCase()] || [];
}

function getSimilarLocations(locationCode: string, _scope: ScopeLevel): LocationInfo[] {
  // Stub: In production, query from cluster/comparability database
  const similarMap: Record<string, LocationInfo[]> = {
    'SE': [
      { code: 'NO', name: 'Norway' },
      { code: 'DK', name: 'Denmark' },
      { code: 'FI', name: 'Finland' },
      { code: 'NL', name: 'Netherlands' },
    ],
    'stockholm': [
      { code: 'gothenburg', name: 'Gothenburg' },
      { code: 'malmo', name: 'Malmö' },
      { code: 'uppsala', name: 'Uppsala' },
    ],
  };
  return similarMap[locationCode.toLowerCase()] || [];
}

function getRelatedQuestions(topic: string): Array<{ code: string; title: string }> {
  // Stub: In production, query from question taxonomy
  const relatedMap: Record<string, Array<{ code: string; title: string }>> = {
    'work-and-ai': [
      { code: 'economic-sustainability', title: 'Economic Sustainability' },
      { code: 'education-and-skills', title: 'Education and Skills' },
    ],
    'climate-adaptation': [
      { code: 'environmental-sustainability', title: 'Environmental Sustainability' },
      { code: 'infrastructure-resilience', title: 'Infrastructure Resilience' },
    ],
  };
  return relatedMap[topic.toLowerCase()] || [];
}

// ============================================================
// QUALITY VALIDATION
// ============================================================

export interface LinkQualityReport {
  isHealthy: boolean;
  totalLinks: number;
  linksByCategory: Record<string, number>;
  issues: string[];
  suggestions: string[];
}

export function validateLinkQuality(links: GeneratedLinks): LinkQualityReport {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check minimum links
  if (links.all.length < LINK_CONFIG.MIN_LINKS_HEALTHY) {
    issues.push(`Only ${links.all.length} links (minimum: ${LINK_CONFIG.MIN_LINKS_HEALTHY})`);
    suggestions.push('Add more related content or check data connections');
  }
  
  // Check category distribution
  const categoryCount = links.grouped.reduce((acc, g) => {
    acc[g.category] = g.links.length;
    return acc;
  }, {} as Record<string, number>);
  
  if (!categoryCount['hierarchy']) {
    issues.push('No hierarchy links (orphan page risk)');
    suggestions.push('Ensure page has valid parent/child relationships');
  }
  
  if (!categoryCount['domain']) {
    issues.push('No domain links (topical isolation)');
    suggestions.push('Connect to related questions or indicators');
  }
  
  return {
    isHealthy: issues.length === 0,
    totalLinks: links.all.length,
    linksByCategory: categoryCount,
    issues,
    suggestions,
  };
}
