/**
 * QUERY NORMALIZATION ENGINE
 * 
 * LLMs don't do exact searches. They reduce questions to semantic cores.
 * Each CQ matches 50-200 different phrasings.
 * 
 * RULE: Rather too many phrasings than too few - redundancy is strength.
 */

import type { AlternatePhrasings, QueryIntentVariant } from './llm-retrieval-playbook';

// =============================================================================
// SEMANTIC TAG EXPANSION
// =============================================================================

/**
 * Domain-specific semantic expansions
 */
const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  // Economics
  'corporate_tax': ['business tax', 'company tax', 'corporate income tax', 'CIT', 'business taxation'],
  'gdp': ['gross domestic product', 'economic output', 'national output', 'economic production'],
  'inflation': ['price increase', 'cost of living', 'price level', 'purchasing power'],
  'unemployment': ['joblessness', 'out of work', 'job seekers', 'labor market'],
  
  // Demographics
  'population': ['inhabitants', 'residents', 'people count', 'demographic size'],
  'birth_rate': ['fertility', 'births per capita', 'natality', 'reproduction rate'],
  'death_rate': ['mortality', 'deaths per capita', 'death toll'],
  'life_expectancy': ['lifespan', 'longevity', 'expected lifetime', 'years of life'],
  
  // Health
  'healthcare': ['medical care', 'health services', 'medical system', 'health system'],
  'hospital_beds': ['medical beds', 'inpatient capacity', 'hospital capacity'],
  
  // Energy
  'energy': ['power', 'electricity', 'fuel', 'energy consumption'],
  'renewable': ['green energy', 'clean energy', 'sustainable energy', 'renewables'],
  'emissions': ['CO2', 'carbon', 'greenhouse gas', 'pollution', 'carbon dioxide'],
  
  // Education
  'education': ['schooling', 'learning', 'academic', 'educational'],
  'literacy': ['reading ability', 'literacy rate', 'can read'],
  
  // Governance
  'government': ['public sector', 'state', 'administration', 'authorities'],
  'spending': ['expenditure', 'budget', 'fiscal', 'public spending'],
  'debt': ['borrowing', 'liabilities', 'government debt', 'public debt'],
};

/**
 * Intent-based question templates
 */
const INTENT_TEMPLATES: Record<string, (topic: string) => string[]> = {
  what: (topic) => [
    `What is ${topic}?`,
    `What is the ${topic}?`,
    `What are ${topic}?`,
    `${topic} definition`,
    `${topic} explained`,
    `Current ${topic}`,
  ],
  why: (topic) => [
    `Why is ${topic} important?`,
    `Why does ${topic} matter?`,
    `Why ${topic}?`,
    `Reasons for ${topic}`,
  ],
  how: (topic) => [
    `How has ${topic} changed?`,
    `How does ${topic} work?`,
    `How to measure ${topic}?`,
    `How ${topic} is calculated?`,
  ],
  compare: (topic) => [
    `${topic} comparison`,
    `Compare ${topic}`,
    `${topic} by country`,
    `${topic} ranking`,
    `Which country has highest ${topic}?`,
    `Which country has lowest ${topic}?`,
  ],
  trend: (topic) => [
    `${topic} trend`,
    `${topic} over time`,
    `${topic} history`,
    `${topic} historical data`,
    `Is ${topic} increasing?`,
    `Is ${topic} decreasing?`,
  ],
  data: (topic) => [
    `${topic} data`,
    `${topic} statistics`,
    `${topic} numbers`,
    `${topic} figures`,
    `${topic} stats`,
  ],
};

// =============================================================================
// PHRASING GENERATORS
// =============================================================================

/**
 * Generate all semantic expansions for a topic
 */
export function expandSemanticTags(tags: string[]): string[] {
  const expanded = new Set<string>();
  
  tags.forEach(tag => {
    expanded.add(tag);
    const tagKey = tag.toLowerCase().replace(/\s+/g, '_');
    if (SEMANTIC_EXPANSIONS[tagKey]) {
      SEMANTIC_EXPANSIONS[tagKey].forEach(exp => expanded.add(exp));
    }
  });
  
  return Array.from(expanded);
}

/**
 * Generate all intent variants for a topic
 */
export function generateIntentVariants(topic: string): QueryIntentVariant[] {
  const variants: QueryIntentVariant[] = [];
  let priority = 1;
  
  Object.entries(INTENT_TEMPLATES).forEach(([intent, generator]) => {
    const phrasings = generator(topic);
    phrasings.forEach(phrasing => {
      variants.push({
        intent: intent as QueryIntentVariant['intent'],
        phrasing,
        priority: priority++,
      });
    });
  });
  
  return variants;
}

/**
 * Generate geographic variants
 */
export function generateGeoVariants(topic: string, geoScope: string): string[] {
  const variants: string[] = [];
  
  const geoExpansions: Record<string, string[]> = {
    global: ['worldwide', 'world', 'global', 'international', 'all countries'],
    regional: ['regional', 'by region', 'across regions'],
    national: ['by country', 'national', 'per country'],
    eu: ['EU', 'European Union', 'Europe', 'European'],
    oecd: ['OECD', 'OECD countries', 'developed countries'],
  };
  
  const expansions = geoExpansions[geoScope.toLowerCase()] || [geoScope];
  expansions.forEach(geo => {
    variants.push(`${topic} ${geo}`);
    variants.push(`${geo} ${topic}`);
  });
  
  return variants;
}

/**
 * Generate temporal variants
 */
export function generateTemporalVariants(topic: string, timeScope: string): string[] {
  const variants: string[] = [];
  
  const timeExpansions: Record<string, string[]> = {
    yearly: ['annual', 'per year', 'yearly', 'by year'],
    quarterly: ['quarterly', 'per quarter', 'Q1', 'Q2', 'Q3', 'Q4'],
    monthly: ['monthly', 'per month', 'by month'],
    daily: ['daily', 'per day', 'by day'],
    historical: ['historical', 'over time', 'time series', 'since', 'from'],
    realtime: ['current', 'now', 'today', 'latest', 'real-time'],
  };
  
  const expansions = timeExpansions[timeScope] || [timeScope];
  expansions.forEach(time => {
    variants.push(`${topic} ${time}`);
    variants.push(`${time} ${topic}`);
  });
  
  return variants;
}

/**
 * Generate language variants (Swedish examples)
 */
export function generateSwedishVariants(englishTopic: string): string[] {
  const translations: Record<string, string[]> = {
    'corporate tax': ['bolagsskatt', 'företagsskatt', 'bolagsskatten'],
    'gdp': ['BNP', 'bruttonationalprodukt'],
    'inflation': ['inflation', 'prisökning'],
    'unemployment': ['arbetslöshet', 'arbetslösa'],
    'population': ['befolkning', 'invånare'],
    'healthcare': ['sjukvård', 'vård', 'hälsovård'],
    'energy': ['energi', 'el', 'elektricitet'],
    'emissions': ['utsläpp', 'koldioxidutsläpp', 'CO2-utsläpp'],
    'education': ['utbildning', 'skola'],
    'government spending': ['offentliga utgifter', 'statsutgifter'],
  };
  
  const key = englishTopic.toLowerCase();
  return translations[key] || [];
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

/**
 * Generate comprehensive alternate phrasings for a question
 */
export function generateAlternatePhrasings(
  question_id: string,
  primaryQuestion: string,
  semanticTags: string[],
  geoScope: string = 'global',
  timeScope: string = 'yearly'
): AlternatePhrasings {
  // Extract topic from question
  const topic = primaryQuestion
    .replace(/^(what is|how|why|when|where|what are)\s+/i, '')
    .replace(/\?$/, '')
    .trim();
  
  // Expand semantic tags
  const expandedTags = expandSemanticTags(semanticTags);
  
  // Generate all variants
  const alternates = new Set<string>();
  
  // Intent variants
  const intentVariants = generateIntentVariants(topic);
  intentVariants.forEach(v => alternates.add(v.phrasing));
  
  // Geographic variants
  generateGeoVariants(topic, geoScope).forEach(v => alternates.add(v));
  
  // Temporal variants
  generateTemporalVariants(topic, timeScope).forEach(v => alternates.add(v));
  
  // Semantic expansion variants
  expandedTags.forEach(tag => {
    alternates.add(tag);
    alternates.add(`${tag} data`);
    alternates.add(`${tag} statistics`);
  });
  
  // Swedish variants
  const swedishVariants = generateSwedishVariants(topic);
  
  return {
    question_id,
    primary_phrasing: primaryQuestion,
    semantic_tags: expandedTags,
    alternate_phrasings: Array.from(alternates).slice(0, 200), // Max 200
    intent_variants: intentVariants,
    negative_phrasings: [], // TODO: Add negatives
    language_variants: {
      sv: swedishVariants,
    },
  };
}

/**
 * Match user query against phrasings
 * Returns match score 0-100
 */
export function matchQueryToPhrasings(
  query: string,
  phrasings: AlternatePhrasings
): { score: number; matchedPhrasings: string[]; matchType: string } {
  const normalizedQuery = query.toLowerCase().trim();
  const matched: string[] = [];
  let bestScore = 0;
  let matchType = 'none';
  
  // Exact primary match
  if (normalizedQuery === phrasings.primary_phrasing.toLowerCase()) {
    return { score: 100, matchedPhrasings: [phrasings.primary_phrasing], matchType: 'exact' };
  }
  
  // Check alternate phrasings
  phrasings.alternate_phrasings.forEach(alt => {
    const altLower = alt.toLowerCase();
    if (normalizedQuery === altLower) {
      matched.push(alt);
      bestScore = Math.max(bestScore, 95);
      matchType = 'alternate_exact';
    } else if (normalizedQuery.includes(altLower) || altLower.includes(normalizedQuery)) {
      matched.push(alt);
      bestScore = Math.max(bestScore, 80);
      matchType = 'partial';
    }
  });
  
  // Check semantic tags
  phrasings.semantic_tags.forEach(tag => {
    if (normalizedQuery.includes(tag.toLowerCase())) {
      matched.push(tag);
      bestScore = Math.max(bestScore, 60);
      if (matchType === 'none') matchType = 'semantic';
    }
  });
  
  return { score: bestScore, matchedPhrasings: matched, matchType };
}
