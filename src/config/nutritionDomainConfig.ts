/**
 * 🥗 MASTER EXECUTION BLOCK 50
 * 
 * NUTRITION & DIET — Domain Configuration
 * 
 * PRINCIPLE (LOCKED):
 * - No dietary advice
 * - No recommendations
 * - No lifestyle advice
 * - Only observed/estimated data
 * - Always uncertainty + method
 * 
 * The system shows what is observed, not what to do.
 */

// ============================================================
// DOMAIN STRUCTURE
// ============================================================

export const NUTRITION_DOMAIN = {
  code: 'nutrition',
  name: 'Nutrition & Diet',
  description: 'Population-level data on food intake, dietary patterns and related health outcomes.',
  
  /** Root URL */
  baseUrl: '/nutrition/',
  
  /** Subcategories (exact) */
  categories: {
    intake: {
      code: 'intake',
      name: 'Dietary Intake',
      description: 'Population-level nutrient and energy intake data.',
      url: '/nutrition/intake/',
    },
    healthOutcomes: {
      code: 'health-outcomes',
      name: 'Health Outcomes',
      description: 'Aggregated health indicators associated with dietary patterns.',
      url: '/nutrition/health-outcomes/',
    },
    foodSystems: {
      code: 'food-systems',
      name: 'Food Systems',
      description: 'Food supply, availability and economic indicators.',
      url: '/nutrition/food-systems/',
    },
    consumptionPatterns: {
      code: 'consumption-patterns',
      name: 'Consumption Patterns',
      description: 'Food group consumption at population level.',
      url: '/nutrition/consumption-patterns/',
    },
    debates: {
      code: 'debates',
      name: 'Data Debates',
      description: 'What population data shows about contested nutrition topics.',
      url: '/nutrition/debates/',
    },
  },
} as const;

// ============================================================
// CORE INDICATORS (V1 - LOCKED)
// ============================================================

export interface NutritionIndicator {
  code: string;
  name: string;
  category: keyof typeof NUTRITION_DOMAIN.categories;
  unit: string;
  description: string;
  collectionMethod: 'survey' | 'sales_proxy' | 'food_balance_sheets' | 'registry' | 'mixed';
  limitations: string[];
  primarySources: string[];
}

export const NUTRITION_INDICATORS: NutritionIndicator[] = [
  // A. INTAKE (population)
  {
    code: 'energy-intake-kcal',
    name: 'Energy intake',
    category: 'intake',
    unit: 'kcal/capita/day',
    description: 'Average daily energy intake per capita from dietary surveys or food balance sheets.',
    collectionMethod: 'mixed',
    limitations: ['Underreporting common in surveys', 'Food balance sheets overestimate actual consumption'],
    primarySources: ['FAO', 'National dietary surveys'],
  },
  {
    code: 'macronutrient-distribution',
    name: 'Macronutrient distribution',
    category: 'intake',
    unit: '% of energy',
    description: 'Share of energy from carbohydrates, fats and proteins.',
    collectionMethod: 'survey',
    limitations: ['Self-reported data', 'Seasonal variation not captured'],
    primarySources: ['National dietary surveys', 'EFSA'],
  },
  {
    code: 'sugar-intake',
    name: 'Sugar intake',
    category: 'intake',
    unit: 'g/capita/day',
    description: 'Average daily intake of free or added sugars.',
    collectionMethod: 'mixed',
    limitations: ['Definition of "added sugar" varies', 'Underreporting in surveys'],
    primarySources: ['National dietary surveys', 'WHO'],
  },
  {
    code: 'fiber-intake',
    name: 'Fiber intake',
    category: 'intake',
    unit: 'g/capita/day',
    description: 'Average daily dietary fiber intake.',
    collectionMethod: 'survey',
    limitations: ['Difficult to measure accurately', 'Supplement use often excluded'],
    primarySources: ['National dietary surveys'],
  },
  {
    code: 'salt-intake',
    name: 'Salt intake',
    category: 'intake',
    unit: 'g/capita/day',
    description: 'Average daily sodium/salt intake.',
    collectionMethod: 'mixed',
    limitations: ['Discretionary salt hard to capture', 'Processed food contribution often estimated'],
    primarySources: ['WHO', 'National surveys', 'Urinary sodium studies'],
  },
  
  // B. FOOD GROUPS
  {
    code: 'red-meat-consumption',
    name: 'Red meat consumption',
    category: 'consumptionPatterns',
    unit: 'g/capita/day',
    description: 'Average consumption of unprocessed red meat (beef, pork, lamb).',
    collectionMethod: 'mixed',
    limitations: ['Definition varies by study', 'Sales data vs actual consumption'],
    primarySources: ['FAO', 'National dietary surveys', 'OECD'],
  },
  {
    code: 'processed-meat-consumption',
    name: 'Processed meat consumption',
    category: 'consumptionPatterns',
    unit: 'g/capita/day',
    description: 'Average consumption of processed meat products.',
    collectionMethod: 'mixed',
    limitations: ['Classification varies', 'Artisanal products often excluded'],
    primarySources: ['FAO', 'National dietary surveys'],
  },
  {
    code: 'dairy-consumption',
    name: 'Dairy consumption',
    category: 'consumptionPatterns',
    unit: 'kg/capita/year',
    description: 'Total dairy product consumption including milk, cheese, yogurt.',
    collectionMethod: 'food_balance_sheets',
    limitations: ['Lactose-free alternatives often excluded', 'Waste not subtracted'],
    primarySources: ['FAO', 'OECD', 'IDF'],
  },
  {
    code: 'fish-seafood-consumption',
    name: 'Fish and seafood consumption',
    category: 'consumptionPatterns',
    unit: 'kg/capita/year',
    description: 'Total fish and seafood consumption.',
    collectionMethod: 'food_balance_sheets',
    limitations: ['Recreational fishing often excluded', 'Import/export adjustments uncertain'],
    primarySources: ['FAO', 'National statistics'],
  },
  {
    code: 'fruit-vegetable-consumption',
    name: 'Fruit and vegetable consumption',
    category: 'consumptionPatterns',
    unit: 'g/capita/day',
    description: 'Combined fruit and vegetable intake.',
    collectionMethod: 'mixed',
    limitations: ['Juice inclusion varies', 'Potatoes often excluded from vegetables'],
    primarySources: ['WHO', 'FAO', 'National dietary surveys'],
  },
  {
    code: 'ultra-processed-foods',
    name: 'Ultra-processed food consumption',
    category: 'consumptionPatterns',
    unit: '% of energy',
    description: 'Share of energy from ultra-processed foods (NOVA classification).',
    collectionMethod: 'survey',
    limitations: ['NOVA classification debated', 'Limited country coverage'],
    primarySources: ['Academic cohort studies', 'National dietary surveys'],
  },
  
  // C. HEALTH OUTCOMES (aggregated)
  {
    code: 'bmi-distribution',
    name: 'BMI distribution',
    category: 'healthOutcomes',
    unit: 'population %',
    description: 'Distribution of Body Mass Index categories in adult population.',
    collectionMethod: 'survey',
    limitations: ['Self-reported height/weight biased', 'BMI limitations as health indicator'],
    primarySources: ['WHO', 'National health surveys'],
  },
  {
    code: 'obesity-prevalence',
    name: 'Obesity prevalence',
    category: 'healthOutcomes',
    unit: '% adults BMI≥30',
    description: 'Share of adult population with BMI of 30 or higher.',
    collectionMethod: 'survey',
    limitations: ['Measurement vs self-report varies', 'Age standardization differs'],
    primarySources: ['WHO', 'OECD', 'National health surveys'],
  },
  {
    code: 'type2-diabetes-prevalence',
    name: 'Type 2 diabetes prevalence',
    category: 'healthOutcomes',
    unit: '% adults',
    description: 'Share of adult population with diagnosed type 2 diabetes.',
    collectionMethod: 'registry',
    limitations: ['Undiagnosed cases not counted', 'Diagnostic criteria changed over time'],
    primarySources: ['IDF', 'WHO', 'National diabetes registries'],
  },
  {
    code: 'cvd-mortality',
    name: 'Cardiovascular mortality',
    category: 'healthOutcomes',
    unit: 'per 100,000',
    description: 'Age-standardized cardiovascular disease mortality rate.',
    collectionMethod: 'registry',
    limitations: ['Cause-of-death coding varies', 'Competing risks not shown'],
    primarySources: ['WHO', 'National cause-of-death registries'],
  },
  
  // D. SYSTEMS & ENVIRONMENT
  {
    code: 'food-supply-kcal',
    name: 'Food supply',
    category: 'foodSystems',
    unit: 'kcal/capita/day',
    description: 'Total food energy available per capita (not actual intake).',
    collectionMethod: 'food_balance_sheets',
    limitations: ['Includes waste and losses', 'Does not equal consumption'],
    primarySources: ['FAO'],
  },
  {
    code: 'food-import-dependency',
    name: 'Food import dependency',
    category: 'foodSystems',
    unit: '% of supply',
    description: 'Share of food supply from imports.',
    collectionMethod: 'food_balance_sheets',
    limitations: ['Re-exports complicate calculation', 'Seasonal variation'],
    primarySources: ['FAO', 'National trade statistics'],
  },
  {
    code: 'food-price-index',
    name: 'Food price index',
    category: 'foodSystems',
    unit: 'index (base=100)',
    description: 'Consumer price index for food and non-alcoholic beverages.',
    collectionMethod: 'sales_proxy',
    limitations: ['Basket composition differs', 'Quality changes not fully captured'],
    primarySources: ['National statistics offices', 'FAO', 'World Bank'],
  },
  {
    code: 'food-expenditure-share',
    name: 'Food expenditure share',
    category: 'foodSystems',
    unit: '% of household income',
    description: 'Share of household income spent on food.',
    collectionMethod: 'survey',
    limitations: ['Excludes eating out in some surveys', 'Income definition varies'],
    primarySources: ['National household surveys', 'Eurostat', 'USDA'],
  },
];

// ============================================================
// PRIMARY SOURCES (Mandatory)
// ============================================================

export const NUTRITION_SOURCES = {
  who: {
    code: 'WHO',
    name: 'World Health Organization',
    type: 'international_organization' as const,
    url: 'https://www.who.int/',
  },
  fao: {
    code: 'FAO',
    name: 'Food and Agriculture Organization',
    type: 'international_organization' as const,
    url: 'https://www.fao.org/',
  },
  oecd: {
    code: 'OECD',
    name: 'Organisation for Economic Co-operation and Development',
    type: 'international_organization' as const,
    url: 'https://www.oecd.org/',
  },
  idf: {
    code: 'IDF',
    name: 'International Diabetes Federation',
    type: 'international_organization' as const,
    url: 'https://www.idf.org/',
  },
  efsa: {
    code: 'EFSA',
    name: 'European Food Safety Authority',
    type: 'regional_authority' as const,
    url: 'https://www.efsa.europa.eu/',
  },
} as const;

// ============================================================
// MANDATORY DISCLAIMERS
// ============================================================

export const NUTRITION_DISCLAIMERS = {
  /** Standard disclaimer for all nutrition pages */
  standard: 'These data describe population-level patterns. They do not provide individual dietary advice and do not establish causality.',
  
  /** For health outcome pages */
  healthOutcome: 'Observed associations between dietary factors and health outcomes do not establish causation. Individual risk depends on many factors not captured in population data.',
  
  /** For debate pages */
  debate: 'This page summarizes what population-level data shows about a contested topic. It does not endorse any dietary approach or provide recommendations.',
  
  /** For correlation views */
  correlation: 'Correlation does not imply causation. These data show patterns of co-occurrence only. Many confounding factors are not controlled for.',
} as const;

// ============================================================
// COLLECTION METHOD LABELS
// ============================================================

export const COLLECTION_METHOD_LABELS: Record<NutritionIndicator['collectionMethod'], string> = {
  survey: 'National dietary surveys',
  sales_proxy: 'Sales and retail data',
  food_balance_sheets: 'Food balance sheets (FAO methodology)',
  registry: 'Administrative registries',
  mixed: 'Multiple methods (see methodology)',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getIndicatorsByCategory(category: keyof typeof NUTRITION_DOMAIN.categories): NutritionIndicator[] {
  return NUTRITION_INDICATORS.filter(i => i.category === category);
}

export function getIndicatorByCode(code: string): NutritionIndicator | undefined {
  return NUTRITION_INDICATORS.find(i => i.code === code);
}

export function buildNutritionFactUrl(
  category: string,
  scope: 'global' | 'country' | 'region',
  location: string,
  timeRange: string
): string {
  return `/facts/nutrition/${category}/${scope}/${location.toLowerCase()}/${timeRange}`;
}

export function buildNutritionIndicatorUrl(indicatorCode: string): string {
  return `/indicators/nutrition/${indicatorCode}`;
}

export function buildNutritionDebateUrl(debateSlug: string): string {
  return `/nutrition/debates/${debateSlug}`;
}
