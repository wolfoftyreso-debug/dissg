/**
 * QUERY TEMPLATE ENGINE
 * 
 * STEG 17: QUERY-VARIATION LAYER
 * 
 * Ni skapar mallar, inte frågor.
 * 300+ formuleringar per svar – utan att skapa nytt innehåll.
 */

import type { ProblemObject, UserIntent, QueryTemplateCategory, FacetType } from './problem-objects';

/**
 * Query Template Structure
 */
export interface QueryTemplate {
  readonly template_id: string;
  readonly category: QueryTemplateCategory;
  readonly intent: UserIntent;
  readonly pattern_en: string;
  readonly pattern_sv: string;
  readonly variables: string[];   // Placeholders like {variable}, {region}, {entity_A}
  readonly example_en: string;
  readonly example_sv: string;
  readonly seo_weight: number;    // 0-1, higher = more SEO valuable
  readonly agent_weight: number;  // 0-1, higher = more AI-agent valuable
}

/**
 * Expanded Query - A fully instantiated query from a template
 */
export interface ExpandedQuery {
  readonly query_id: string;
  readonly problem_id: string;
  readonly canonical_question_id: string;
  readonly template_id: string;
  readonly query_text_en: string;
  readonly query_text_sv: string;
  readonly facets: AppliedFacet[];
  readonly canonical_url: string;
  readonly seo_weight: number;
  readonly agent_weight: number;
}

/**
 * Applied Facet - A filter treated as a question modifier
 */
export interface AppliedFacet {
  readonly type: FacetType;
  readonly value: string;
  readonly display_en: string;
  readonly display_sv: string;
}

/**
 * CORE QUERY TEMPLATES
 * 
 * These are the master templates that generate all query variations.
 */
export const QUERY_TEMPLATES: QueryTemplate[] = [
  // ========== TREND TEMPLATES ==========
  {
    template_id: 'T-TREND-001',
    category: 'trend',
    intent: 'understand_trend',
    pattern_en: 'How has {variable} changed over time in {region}?',
    pattern_sv: 'Hur har {variable} förändrats över tid i {region}?',
    variables: ['variable', 'region'],
    example_en: 'How has corporate tax changed over time in Sweden?',
    example_sv: 'Hur har bolagsskatten förändrats över tid i Sverige?',
    seo_weight: 0.95,
    agent_weight: 0.90,
  },
  {
    template_id: 'T-TREND-002',
    category: 'trend',
    intent: 'understand_trend',
    pattern_en: 'Is {variable} increasing or decreasing in {region}?',
    pattern_sv: 'Ökar eller minskar {variable} i {region}?',
    variables: ['variable', 'region'],
    example_en: 'Is life expectancy increasing or decreasing in the EU?',
    example_sv: 'Ökar eller minskar medellivslängden i EU?',
    seo_weight: 0.90,
    agent_weight: 0.85,
  },
  {
    template_id: 'T-TREND-003',
    category: 'trend',
    intent: 'understand_trend',
    pattern_en: 'Historical development of {variable} in {region}',
    pattern_sv: 'Historisk utveckling av {variable} i {region}',
    variables: ['variable', 'region'],
    example_en: 'Historical development of population in Nordic countries',
    example_sv: 'Historisk utveckling av befolkning i Norden',
    seo_weight: 0.85,
    agent_weight: 0.80,
  },
  {
    template_id: 'T-TREND-004',
    category: 'trend',
    intent: 'understand_trend',
    pattern_en: '{variable} trend {region} {time_period}',
    pattern_sv: '{variable} trend {region} {time_period}',
    variables: ['variable', 'region', 'time_period'],
    example_en: 'unemployment trend Sweden 2010-2024',
    example_sv: 'arbetslöshet trend Sverige 2010-2024',
    seo_weight: 0.92,
    agent_weight: 0.88,
  },
  
  // ========== COMPARISON TEMPLATES ==========
  {
    template_id: 'T-COMP-001',
    category: 'comparison',
    intent: 'compare_entities',
    pattern_en: 'Compare {variable} between {entity_A} and {entity_B}',
    pattern_sv: 'Jämför {variable} mellan {entity_A} och {entity_B}',
    variables: ['variable', 'entity_A', 'entity_B'],
    example_en: 'Compare tax rates between Sweden and Denmark',
    example_sv: 'Jämför skattesatser mellan Sverige och Danmark',
    seo_weight: 0.95,
    agent_weight: 0.95,
  },
  {
    template_id: 'T-COMP-002',
    category: 'comparison',
    intent: 'compare_entities',
    pattern_en: 'Which country has higher {variable}?',
    pattern_sv: 'Vilket land har högre {variable}?',
    variables: ['variable'],
    example_en: 'Which country has higher life expectancy?',
    example_sv: 'Vilket land har högre medellivslängd?',
    seo_weight: 0.88,
    agent_weight: 0.82,
  },
  {
    template_id: 'T-COMP-003',
    category: 'comparison',
    intent: 'compare_entities',
    pattern_en: '{variable} {entity_A} vs {entity_B}',
    pattern_sv: '{variable} {entity_A} vs {entity_B}',
    variables: ['variable', 'entity_A', 'entity_B'],
    example_en: 'GDP Sweden vs Norway',
    example_sv: 'BNP Sverige vs Norge',
    seo_weight: 0.90,
    agent_weight: 0.85,
  },
  {
    template_id: 'T-COMP-004',
    category: 'comparison',
    intent: 'compare_entities',
    pattern_en: 'Difference in {variable} between {entity_A} and {entity_B}',
    pattern_sv: 'Skillnad i {variable} mellan {entity_A} och {entity_B}',
    variables: ['variable', 'entity_A', 'entity_B'],
    example_en: 'Difference in healthcare spending between US and UK',
    example_sv: 'Skillnad i sjukvårdsutgifter mellan USA och Storbritannien',
    seo_weight: 0.85,
    agent_weight: 0.88,
  },
  
  // ========== RANKING TEMPLATES ==========
  {
    template_id: 'T-RANK-001',
    category: 'ranking',
    intent: 'find_extremes',
    pattern_en: 'Ranking of {variable} across {region}',
    pattern_sv: 'Ranking av {variable} i {region}',
    variables: ['variable', 'region'],
    example_en: 'Ranking of corporate tax rates across OECD',
    example_sv: 'Ranking av bolagsskattesatser i OECD',
    seo_weight: 0.95,
    agent_weight: 0.90,
  },
  {
    template_id: 'T-RANK-002',
    category: 'ranking',
    intent: 'find_extremes',
    pattern_en: 'Countries with highest {variable}',
    pattern_sv: 'Länder med högst {variable}',
    variables: ['variable'],
    example_en: 'Countries with highest life expectancy',
    example_sv: 'Länder med högst medellivslängd',
    seo_weight: 0.92,
    agent_weight: 0.88,
  },
  {
    template_id: 'T-RANK-003',
    category: 'ranking',
    intent: 'find_extremes',
    pattern_en: 'Countries with lowest {variable}',
    pattern_sv: 'Länder med lägst {variable}',
    variables: ['variable'],
    example_en: 'Countries with lowest unemployment',
    example_sv: 'Länder med lägst arbetslöshet',
    seo_weight: 0.90,
    agent_weight: 0.85,
  },
  {
    template_id: 'T-RANK-004',
    category: 'ranking',
    intent: 'find_extremes',
    pattern_en: 'Top 10 {region} by {variable}',
    pattern_sv: 'Topp 10 {region} efter {variable}',
    variables: ['region', 'variable'],
    example_en: 'Top 10 EU countries by GDP per capita',
    example_sv: 'Topp 10 EU-länder efter BNP per capita',
    seo_weight: 0.88,
    agent_weight: 0.80,
  },
  
  // ========== LEVEL TEMPLATES ==========
  {
    template_id: 'T-LEVEL-001',
    category: 'level',
    intent: 'assess_level',
    pattern_en: 'What is {variable} in {region}?',
    pattern_sv: 'Vad är {variable} i {region}?',
    variables: ['variable', 'region'],
    example_en: 'What is the unemployment rate in Sweden?',
    example_sv: 'Vad är arbetslösheten i Sverige?',
    seo_weight: 0.95,
    agent_weight: 0.95,
  },
  {
    template_id: 'T-LEVEL-002',
    category: 'level',
    intent: 'assess_level',
    pattern_en: 'Current {variable} in {region}',
    pattern_sv: 'Nuvarande {variable} i {region}',
    variables: ['variable', 'region'],
    example_en: 'Current inflation rate in the Eurozone',
    example_sv: 'Nuvarande inflation i euroområdet',
    seo_weight: 0.90,
    agent_weight: 0.88,
  },
  {
    template_id: 'T-LEVEL-003',
    category: 'level',
    intent: 'assess_level',
    pattern_en: '{variable} {region} {year}',
    pattern_sv: '{variable} {region} {year}',
    variables: ['variable', 'region', 'year'],
    example_en: 'population Sweden 2024',
    example_sv: 'befolkning Sverige 2024',
    seo_weight: 0.92,
    agent_weight: 0.90,
  },
  
  // ========== NORMAL RANGE TEMPLATES ==========
  {
    template_id: 'T-NORM-001',
    category: 'normal_range',
    intent: 'understand_normal',
    pattern_en: 'What is normal {variable} in {region}?',
    pattern_sv: 'Vad är normal {variable} i {region}?',
    variables: ['variable', 'region'],
    example_en: 'What is normal unemployment in Sweden?',
    example_sv: 'Vad är normal arbetslöshet i Sverige?',
    seo_weight: 0.85,
    agent_weight: 0.90,
  },
  {
    template_id: 'T-NORM-002',
    category: 'normal_range',
    intent: 'understand_normal',
    pattern_en: 'Typical range of {variable} in {region}',
    pattern_sv: 'Typiskt intervall för {variable} i {region}',
    variables: ['variable', 'region'],
    example_en: 'Typical range of inflation in developed countries',
    example_sv: 'Typiskt intervall för inflation i utvecklade länder',
    seo_weight: 0.80,
    agent_weight: 0.88,
  },
  {
    template_id: 'T-NORM-003',
    category: 'normal_range',
    intent: 'understand_normal',
    pattern_en: 'Average {variable} in {region}',
    pattern_sv: 'Genomsnittlig {variable} i {region}',
    variables: ['variable', 'region'],
    example_en: 'Average life expectancy in OECD',
    example_sv: 'Genomsnittlig medellivslängd i OECD',
    seo_weight: 0.88,
    agent_weight: 0.85,
  },
  
  // ========== ANOMALY TEMPLATES ==========
  {
    template_id: 'T-ANOM-001',
    category: 'anomaly',
    intent: 'detect_anomaly',
    pattern_en: 'Is {variable} unusual in {region}?',
    pattern_sv: 'Är {variable} ovanligt i {region}?',
    variables: ['variable', 'region'],
    example_en: 'Is current inflation unusual in Sweden?',
    example_sv: 'Är nuvarande inflation ovanlig i Sverige?',
    seo_weight: 0.75,
    agent_weight: 0.92,
  },
  {
    template_id: 'T-ANOM-002',
    category: 'anomaly',
    intent: 'detect_anomaly',
    pattern_en: 'Is this {variable} level extreme?',
    pattern_sv: 'Är denna {variable}-nivå extrem?',
    variables: ['variable'],
    example_en: 'Is this unemployment level extreme?',
    example_sv: 'Är denna arbetslöshetsnivå extrem?',
    seo_weight: 0.70,
    agent_weight: 0.90,
  },
  
  // ========== HISTORICAL TEMPLATES ==========
  {
    template_id: 'T-HIST-001',
    category: 'historical',
    intent: 'historical_reference',
    pattern_en: 'When was {variable} last this high in {region}?',
    pattern_sv: 'När var {variable} senast så hög i {region}?',
    variables: ['variable', 'region'],
    example_en: 'When was inflation last this high in the US?',
    example_sv: 'När var inflationen senast så hög i USA?',
    seo_weight: 0.82,
    agent_weight: 0.92,
  },
  {
    template_id: 'T-HIST-002',
    category: 'historical',
    intent: 'historical_reference',
    pattern_en: 'Historical {variable} data for {region}',
    pattern_sv: 'Historisk {variable}-data för {region}',
    variables: ['variable', 'region'],
    example_en: 'Historical GDP data for Germany',
    example_sv: 'Historisk BNP-data för Tyskland',
    seo_weight: 0.85,
    agent_weight: 0.80,
  },
  {
    template_id: 'T-HIST-003',
    category: 'historical',
    intent: 'find_precedent',
    pattern_en: 'When did we last see {variable} like this?',
    pattern_sv: 'När såg vi senast {variable} som detta?',
    variables: ['variable'],
    example_en: 'When did we last see unemployment like this?',
    example_sv: 'När såg vi senast arbetslöshet som detta?',
    seo_weight: 0.78,
    agent_weight: 0.95,
  },
  
  // ========== CORRELATION TEMPLATES ==========
  {
    template_id: 'T-CORR-001',
    category: 'correlation',
    intent: 'find_correlation',
    pattern_en: 'What correlates with {variable}?',
    pattern_sv: 'Vad korrelerar med {variable}?',
    variables: ['variable'],
    example_en: 'What correlates with life expectancy?',
    example_sv: 'Vad korrelerar med medellivslängd?',
    seo_weight: 0.70,
    agent_weight: 0.95,
  },
  {
    template_id: 'T-CORR-002',
    category: 'correlation',
    intent: 'find_correlation',
    pattern_en: 'Relationship between {variable_A} and {variable_B}',
    pattern_sv: 'Samband mellan {variable_A} och {variable_B}',
    variables: ['variable_A', 'variable_B'],
    example_en: 'Relationship between education and income',
    example_sv: 'Samband mellan utbildning och inkomst',
    seo_weight: 0.75,
    agent_weight: 0.90,
  },
  
  // ========== DEPENDENCY TEMPLATES ==========
  {
    template_id: 'T-DEP-001',
    category: 'dependency',
    intent: 'assess_dependency',
    pattern_en: 'What depends on {variable}?',
    pattern_sv: 'Vad beror på {variable}?',
    variables: ['variable'],
    example_en: 'What depends on oil prices?',
    example_sv: 'Vad beror på oljepriset?',
    seo_weight: 0.68,
    agent_weight: 0.95,
  },
  {
    template_id: 'T-DEP-002',
    category: 'dependency',
    intent: 'assess_dependency',
    pattern_en: 'Impact of {variable} on {region}',
    pattern_sv: 'Påverkan av {variable} på {region}',
    variables: ['variable', 'region'],
    example_en: 'Impact of interest rates on housing market',
    example_sv: 'Påverkan av räntor på bostadsmarknaden',
    seo_weight: 0.72,
    agent_weight: 0.88,
  },
];

/**
 * QUERY EXPANSION ENGINE
 * 
 * Generates all possible queries from a problem object
 */
export function expandProblemToQueries(
  problem: ProblemObject,
  templates: QueryTemplate[] = QUERY_TEMPLATES
): ExpandedQuery[] {
  const queries: ExpandedQuery[] = [];
  
  // Get applicable templates based on problem's template categories
  const applicableTemplates = templates.filter(t => 
    problem.template_categories.includes(t.category)
  );
  
  // For each canonical question in the problem
  for (const cqId of problem.canonical_question_ids) {
    // For each applicable template
    for (const template of applicableTemplates) {
      // Generate base query
      const baseQuery = instantiateTemplate(template, problem);
      
      // Apply facet variations
      const facetVariations = generateFacetVariations(problem.available_facets);
      
      for (const facets of facetVariations.slice(0, 10)) { // Limit to avoid explosion
        const queryId = `EQ-${problem.problem_id}-${template.template_id}-${facets.map(f => f.value).join('-')}`;
        
        queries.push({
          query_id: queryId,
          problem_id: problem.problem_id,
          canonical_question_id: cqId,
          template_id: template.template_id,
          query_text_en: applyFacetsToQuery(baseQuery.en, facets),
          query_text_sv: applyFacetsToQuery(baseQuery.sv, facets),
          facets,
          canonical_url: `/answers/${cqId}`,
          seo_weight: template.seo_weight,
          agent_weight: template.agent_weight,
        });
      }
    }
  }
  
  return queries;
}

/**
 * Instantiate a template with problem variables
 */
function instantiateTemplate(
  template: QueryTemplate, 
  problem: ProblemObject
): { en: string; sv: string } {
  let en = template.pattern_en;
  let sv = template.pattern_sv;
  
  // Replace placeholders with variable bindings
  for (const binding of problem.variable_bindings) {
    const placeholder = `{${binding.variable}}`;
    const value_en = binding.default_value || binding.display_name_en;
    const value_sv = binding.default_value || binding.display_name_sv;
    
    en = en.replace(new RegExp(placeholder, 'g'), value_en);
    sv = sv.replace(new RegExp(placeholder, 'g'), value_sv);
  }
  
  // Replace common placeholders
  en = en.replace(/{region}/g, 'the selected region');
  en = en.replace(/{entity_A}/g, 'Entity A');
  en = en.replace(/{entity_B}/g, 'Entity B');
  en = en.replace(/{year}/g, 'current year');
  en = en.replace(/{time_period}/g, 'recent years');
  
  sv = sv.replace(/{region}/g, 'vald region');
  sv = sv.replace(/{entity_A}/g, 'Entitet A');
  sv = sv.replace(/{entity_B}/g, 'Entitet B');
  sv = sv.replace(/{year}/g, 'innevarande år');
  sv = sv.replace(/{time_period}/g, 'senaste åren');
  
  return { en, sv };
}

/**
 * Generate facet variations
 */
function generateFacetVariations(availableFacets: FacetType[]): AppliedFacet[][] {
  const variations: AppliedFacet[][] = [[]]; // Start with no facets
  
  // Sample facet values
  const facetValues: Record<FacetType, string[]> = {
    geographic: ['Sweden', 'EU', 'OECD', 'Nordic'],
    temporal: ['2024', '2023', '2020-2024', 'last decade'],
    demographic: ['total', 'by age', 'by gender'],
    method: ['per capita', 'absolute', 'percentage'],
    comparison: ['vs average', 'vs previous year'],
    granularity: ['national', 'regional'],
  };
  
  // Generate combinations (limited)
  for (const facetType of availableFacets.slice(0, 3)) {
    const values = facetValues[facetType] || [];
    for (const value of values.slice(0, 2)) {
      variations.push([{
        type: facetType,
        value,
        display_en: value,
        display_sv: value,
      }]);
    }
  }
  
  return variations;
}

/**
 * Apply facets to a query string
 */
function applyFacetsToQuery(query: string, facets: AppliedFacet[]): string {
  if (facets.length === 0) return query;
  
  const facetSuffix = facets.map(f => f.display_en).join(', ');
  return `${query} (${facetSuffix})`;
}

/**
 * Get template statistics
 */
export function getTemplateStats() {
  const byCategory = QUERY_TEMPLATES.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const avgSeoWeight = QUERY_TEMPLATES.reduce((sum, t) => sum + t.seo_weight, 0) / QUERY_TEMPLATES.length;
  const avgAgentWeight = QUERY_TEMPLATES.reduce((sum, t) => sum + t.agent_weight, 0) / QUERY_TEMPLATES.length;
  
  return {
    total_templates: QUERY_TEMPLATES.length,
    by_category: byCategory,
    average_seo_weight: avgSeoWeight.toFixed(2),
    average_agent_weight: avgAgentWeight.toFixed(2),
  };
}

/**
 * THE KEY INSIGHT
 * 
 * Sökmotorer belönar:
 * - semantisk täckning
 * - intern konsistens
 * - canonical answers
 * 
 * Google ser:
 * "Den här sidan svarar på allt inom detta problemrum."
 * 
 * Resultat: total SERP-dominans per ämne
 */
export const QUERY_TEMPLATE_PRINCIPLES = {
  templates_not_questions: true,
  deterministic_expansion: true,
  all_point_to_same_answer: true,
  seo_optimized: true,
  agent_optimized: true,
} as const;
