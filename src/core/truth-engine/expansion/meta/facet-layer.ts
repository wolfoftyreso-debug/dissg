/**
 * FACET LAYER
 * 
 * STEG 17: FILTER SOM FRÅGOR
 * 
 * Ni behandlar filter som frågor.
 * "Bolagsskatt i Sverige" = samma faktum + annan fasett
 * 
 * Detta exploderar täckningen utan nytt innehåll.
 */

import type { FacetType } from './problem-objects';

/**
 * Facet Definition
 */
export interface FacetDefinition {
  readonly type: FacetType;
  readonly code: string;
  readonly name_en: string;
  readonly name_sv: string;
  readonly values: FacetValue[];
  readonly is_hierarchical: boolean;
  readonly allows_multiple: boolean;
  readonly default_value?: string;
}

/**
 * Facet Value
 */
export interface FacetValue {
  readonly code: string;
  readonly label_en: string;
  readonly label_sv: string;
  readonly parent_code?: string;  // For hierarchical facets
  readonly sort_order: number;
  readonly is_default?: boolean;
}

/**
 * Facet Combination
 * A specific combination of facet values that creates a unique query surface
 */
export interface FacetCombination {
  readonly combination_id: string;
  readonly facets: AppliedFacetValue[];
  readonly query_suffix_en: string;
  readonly query_suffix_sv: string;
  readonly url_slug: string;
  readonly seo_value: number;
}

/**
 * Applied Facet Value
 */
export interface AppliedFacetValue {
  readonly facet_type: FacetType;
  readonly facet_code: string;
  readonly value_code: string;
  readonly value_label_en: string;
  readonly value_label_sv: string;
}

/**
 * GEOGRAPHIC FACETS
 */
export const GEOGRAPHIC_FACETS: FacetDefinition = {
  type: 'geographic',
  code: 'geo',
  name_en: 'Geographic Scope',
  name_sv: 'Geografiskt område',
  values: [
    { code: 'global', label_en: 'Global', label_sv: 'Globalt', sort_order: 1 },
    { code: 'oecd', label_en: 'OECD', label_sv: 'OECD', sort_order: 2 },
    { code: 'eu', label_en: 'European Union', label_sv: 'EU', sort_order: 3 },
    { code: 'nordic', label_en: 'Nordic countries', label_sv: 'Norden', sort_order: 4 },
    { code: 'se', label_en: 'Sweden', label_sv: 'Sverige', sort_order: 10, is_default: true },
    { code: 'no', label_en: 'Norway', label_sv: 'Norge', sort_order: 11 },
    { code: 'dk', label_en: 'Denmark', label_sv: 'Danmark', sort_order: 12 },
    { code: 'fi', label_en: 'Finland', label_sv: 'Finland', sort_order: 13 },
    { code: 'de', label_en: 'Germany', label_sv: 'Tyskland', sort_order: 20 },
    { code: 'gb', label_en: 'United Kingdom', label_sv: 'Storbritannien', sort_order: 21 },
    { code: 'fr', label_en: 'France', label_sv: 'Frankrike', sort_order: 22 },
    { code: 'us', label_en: 'United States', label_sv: 'USA', sort_order: 30 },
    { code: 'jp', label_en: 'Japan', label_sv: 'Japan', sort_order: 40 },
    { code: 'cn', label_en: 'China', label_sv: 'Kina', sort_order: 41 },
  ],
  is_hierarchical: true,
  allows_multiple: true,
  default_value: 'se',
};

/**
 * TEMPORAL FACETS
 */
export const TEMPORAL_FACETS: FacetDefinition = {
  type: 'temporal',
  code: 'time',
  name_en: 'Time Period',
  name_sv: 'Tidsperiod',
  values: [
    { code: 'latest', label_en: 'Latest available', label_sv: 'Senaste tillgängliga', sort_order: 1, is_default: true },
    { code: '2024', label_en: '2024', label_sv: '2024', sort_order: 2 },
    { code: '2023', label_en: '2023', label_sv: '2023', sort_order: 3 },
    { code: '2022', label_en: '2022', label_sv: '2022', sort_order: 4 },
    { code: '2021', label_en: '2021', label_sv: '2021', sort_order: 5 },
    { code: '2020', label_en: '2020', label_sv: '2020', sort_order: 6 },
    { code: 'last_5y', label_en: 'Last 5 years', label_sv: 'Senaste 5 åren', sort_order: 10 },
    { code: 'last_10y', label_en: 'Last 10 years', label_sv: 'Senaste 10 åren', sort_order: 11 },
    { code: 'last_20y', label_en: 'Last 20 years', label_sv: 'Senaste 20 åren', sort_order: 12 },
    { code: 'pre_covid', label_en: 'Pre-COVID (before 2020)', label_sv: 'Före covid (innan 2020)', sort_order: 20 },
    { code: 'post_covid', label_en: 'Post-COVID (2020+)', label_sv: 'Efter covid (2020+)', sort_order: 21 },
    { code: 'all_time', label_en: 'All available data', label_sv: 'All tillgänglig data', sort_order: 100 },
  ],
  is_hierarchical: false,
  allows_multiple: false,
  default_value: 'latest',
};

/**
 * DEMOGRAPHIC FACETS
 */
export const DEMOGRAPHIC_FACETS: FacetDefinition = {
  type: 'demographic',
  code: 'demo',
  name_en: 'Demographic Segment',
  name_sv: 'Demografiskt segment',
  values: [
    { code: 'total', label_en: 'Total population', label_sv: 'Total befolkning', sort_order: 1, is_default: true },
    { code: 'male', label_en: 'Male', label_sv: 'Män', sort_order: 10 },
    { code: 'female', label_en: 'Female', label_sv: 'Kvinnor', sort_order: 11 },
    { code: 'age_0_14', label_en: 'Age 0-14', label_sv: 'Ålder 0-14', sort_order: 20 },
    { code: 'age_15_24', label_en: 'Age 15-24', label_sv: 'Ålder 15-24', sort_order: 21 },
    { code: 'age_25_54', label_en: 'Age 25-54', label_sv: 'Ålder 25-54', sort_order: 22 },
    { code: 'age_55_64', label_en: 'Age 55-64', label_sv: 'Ålder 55-64', sort_order: 23 },
    { code: 'age_65_plus', label_en: 'Age 65+', label_sv: 'Ålder 65+', sort_order: 24 },
    { code: 'working_age', label_en: 'Working age (15-64)', label_sv: 'Arbetsför ålder (15-64)', sort_order: 30 },
  ],
  is_hierarchical: false,
  allows_multiple: true,
  default_value: 'total',
};

/**
 * METHOD FACETS
 */
export const METHOD_FACETS: FacetDefinition = {
  type: 'method',
  code: 'method',
  name_en: 'Measurement Method',
  name_sv: 'Mätmetod',
  values: [
    { code: 'absolute', label_en: 'Absolute numbers', label_sv: 'Absoluta tal', sort_order: 1, is_default: true },
    { code: 'per_capita', label_en: 'Per capita', label_sv: 'Per capita', sort_order: 2 },
    { code: 'per_gdp', label_en: 'As % of GDP', label_sv: 'Som % av BNP', sort_order: 3 },
    { code: 'percent', label_en: 'Percentage', label_sv: 'Procent', sort_order: 4 },
    { code: 'index', label_en: 'Index (base year)', label_sv: 'Index (basår)', sort_order: 5 },
    { code: 'growth_rate', label_en: 'Growth rate', label_sv: 'Tillväxttakt', sort_order: 10 },
    { code: 'yoy_change', label_en: 'Year-over-year change', label_sv: 'Årlig förändring', sort_order: 11 },
    { code: 'ppp', label_en: 'PPP adjusted', label_sv: 'PPP-justerat', sort_order: 20 },
    { code: 'real', label_en: 'Real (inflation adjusted)', label_sv: 'Realt (inflationsjusterat)', sort_order: 21 },
    { code: 'nominal', label_en: 'Nominal', label_sv: 'Nominellt', sort_order: 22 },
  ],
  is_hierarchical: false,
  allows_multiple: false,
  default_value: 'absolute',
};

/**
 * COMPARISON FACETS
 */
export const COMPARISON_FACETS: FacetDefinition = {
  type: 'comparison',
  code: 'compare',
  name_en: 'Comparison Baseline',
  name_sv: 'Jämförelsegrund',
  values: [
    { code: 'none', label_en: 'No comparison', label_sv: 'Ingen jämförelse', sort_order: 1, is_default: true },
    { code: 'vs_avg', label_en: 'vs Average', label_sv: 'vs Genomsnitt', sort_order: 2 },
    { code: 'vs_median', label_en: 'vs Median', label_sv: 'vs Median', sort_order: 3 },
    { code: 'vs_prev_year', label_en: 'vs Previous year', label_sv: 'vs Föregående år', sort_order: 10 },
    { code: 'vs_5y_ago', label_en: 'vs 5 years ago', label_sv: 'vs 5 år sedan', sort_order: 11 },
    { code: 'vs_10y_ago', label_en: 'vs 10 years ago', label_sv: 'vs 10 år sedan', sort_order: 12 },
    { code: 'vs_pre_covid', label_en: 'vs Pre-COVID (2019)', label_sv: 'vs Före covid (2019)', sort_order: 20 },
    { code: 'vs_oecd', label_en: 'vs OECD average', label_sv: 'vs OECD-genomsnitt', sort_order: 30 },
    { code: 'vs_eu', label_en: 'vs EU average', label_sv: 'vs EU-genomsnitt', sort_order: 31 },
  ],
  is_hierarchical: false,
  allows_multiple: false,
  default_value: 'none',
};

/**
 * GRANULARITY FACETS
 */
export const GRANULARITY_FACETS: FacetDefinition = {
  type: 'granularity',
  code: 'granularity',
  name_en: 'Geographic Granularity',
  name_sv: 'Geografisk detaljnivå',
  values: [
    { code: 'national', label_en: 'National level', label_sv: 'Nationell nivå', sort_order: 1, is_default: true },
    { code: 'regional', label_en: 'Regional level', label_sv: 'Regional nivå', sort_order: 2 },
    { code: 'municipal', label_en: 'Municipal level', label_sv: 'Kommunal nivå', sort_order: 3 },
    { code: 'nuts2', label_en: 'NUTS-2 regions', label_sv: 'NUTS-2-regioner', sort_order: 10 },
    { code: 'nuts3', label_en: 'NUTS-3 regions', label_sv: 'NUTS-3-regioner', sort_order: 11 },
  ],
  is_hierarchical: true,
  allows_multiple: false,
  default_value: 'national',
};

/**
 * ALL FACET DEFINITIONS
 */
export const ALL_FACETS: FacetDefinition[] = [
  GEOGRAPHIC_FACETS,
  TEMPORAL_FACETS,
  DEMOGRAPHIC_FACETS,
  METHOD_FACETS,
  COMPARISON_FACETS,
  GRANULARITY_FACETS,
];

/**
 * Get facet by type
 */
export function getFacetByType(type: FacetType): FacetDefinition | undefined {
  return ALL_FACETS.find(f => f.type === type);
}

/**
 * Generate all valid facet combinations for a set of facet types
 */
export function generateFacetCombinations(
  facetTypes: FacetType[],
  maxCombinations: number = 100
): FacetCombination[] {
  const combinations: FacetCombination[] = [];
  
  // Get applicable facets
  const applicableFacets = facetTypes
    .map(type => getFacetByType(type))
    .filter((f): f is FacetDefinition => f !== undefined);
  
  if (applicableFacets.length === 0) return combinations;
  
  // Generate combinations (simplified - just top values from each)
  const generateRecursive = (
    index: number,
    current: AppliedFacetValue[]
  ): void => {
    if (combinations.length >= maxCombinations) return;
    
    if (index >= applicableFacets.length) {
      if (current.length > 0) {
        const combo = createCombination(current);
        combinations.push(combo);
      }
      return;
    }
    
    const facet = applicableFacets[index];
    
    // Option 1: Skip this facet
    generateRecursive(index + 1, current);
    
    // Option 2: Apply each value of this facet
    for (const value of facet.values.slice(0, 3)) { // Limit to top 3 values
      generateRecursive(index + 1, [
        ...current,
        {
          facet_type: facet.type,
          facet_code: facet.code,
          value_code: value.code,
          value_label_en: value.label_en,
          value_label_sv: value.label_sv,
        },
      ]);
    }
  };
  
  generateRecursive(0, []);
  
  return combinations;
}

/**
 * Create a facet combination object
 */
function createCombination(facets: AppliedFacetValue[]): FacetCombination {
  const id = facets.map(f => `${f.facet_code}:${f.value_code}`).join('|');
  const suffix_en = facets.map(f => f.value_label_en).join(', ');
  const suffix_sv = facets.map(f => f.value_label_sv).join(', ');
  const slug = facets.map(f => f.value_code).join('-');
  
  // SEO value based on specificity
  const seo_value = Math.min(1.0, 0.5 + (facets.length * 0.15));
  
  return {
    combination_id: id,
    facets,
    query_suffix_en: suffix_en,
    query_suffix_sv: suffix_sv,
    url_slug: slug,
    seo_value,
  };
}

/**
 * Apply facet combination to a base query
 */
export function applyFacetCombination(
  baseQuery: { en: string; sv: string },
  combination: FacetCombination
): { en: string; sv: string; url: string } {
  if (combination.facets.length === 0) {
    return { en: baseQuery.en, sv: baseQuery.sv, url: '' };
  }
  
  return {
    en: `${baseQuery.en} (${combination.query_suffix_en})`,
    sv: `${baseQuery.sv} (${combination.query_suffix_sv})`,
    url: combination.url_slug,
  };
}

/**
 * Calculate total query surface from facets
 */
export function calculateFacetExpansion(facetTypes: FacetType[]): {
  facet_count: number;
  value_count: number;
  combination_count: number;
  expansion_multiplier: number;
} {
  const facets = facetTypes
    .map(type => getFacetByType(type))
    .filter((f): f is FacetDefinition => f !== undefined);
  
  const value_count = facets.reduce((sum, f) => sum + f.values.length, 0);
  
  // Theoretical max combinations (cartesian product)
  const max_combinations = facets.reduce((product, f) => {
    return product * (f.values.length + 1); // +1 for "not applied"
  }, 1);
  
  // Practical limit
  const practical_combinations = Math.min(max_combinations, 500);
  
  return {
    facet_count: facets.length,
    value_count,
    combination_count: practical_combinations,
    expansion_multiplier: practical_combinations,
  };
}

/**
 * THE KEY INSIGHT
 * 
 * Filter som frågor:
 * - "Bolagsskatt i Sverige"
 * - "Bolagsskatt 2023"
 * - "Bolagsskatt per capita"
 * - "Bolagsskatt före och efter 2010"
 * 
 * Alla är: samma faktum + annan fasett
 * 
 * Detta exploderar täckningen utan nytt innehåll.
 */
export const FACET_LAYER_PRINCIPLES = {
  filters_are_questions: true,
  same_fact_different_facet: true,
  no_new_content: true,
  explodes_coverage: true,
  deterministic: true,
} as const;

/**
 * Get facet layer statistics
 */
export function getFacetLayerStats() {
  const allValues = ALL_FACETS.reduce((sum, f) => sum + f.values.length, 0);
  
  return {
    total_facet_types: ALL_FACETS.length,
    total_facet_values: allValues,
    facets_by_type: ALL_FACETS.map(f => ({
      type: f.type,
      code: f.code,
      value_count: f.values.length,
    })),
    theoretical_max_expansion: ALL_FACETS.reduce((product, f) => 
      product * (f.values.length + 1), 1
    ),
  };
}
