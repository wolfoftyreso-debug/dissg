/**
 * BLOCK P — SEMANTIC CORE
 * 
 * Global language definitions: KPI Dictionary, Geo Universe, Demographic Canon.
 * These are LOCKED and must never change backwards.
 */

// =============================================================================
// P1: GLOBAL KPI DICTIONARY
// =============================================================================

export interface KpiDictionaryEntry {
  id: string;                           // Canonical ID
  canonical_name: string;               // Official name
  
  synonyms: string[];                   // Alternative names
  aliases: string[];                    // Short forms, abbreviations
  
  translations: Record<string, string>; // Localized names
  
  deprecated_ids?: string[];            // Old IDs that map to this
  superseded_by?: string;               // If this ID is deprecated
  
  related_terms: string[];              // Conceptually related
  
  disambiguation?: string;              // Clarification if ambiguous
}

// =============================================================================
// P2: GEO UNIVERSE
// =============================================================================

export type GeoLevelType = 
  | 'global'
  | 'continental'
  | 'bloc'
  | 'country'
  | 'adm1'                              // First-level administrative division
  | 'adm2'                              // Second-level administrative division
  | 'city'
  | 'metropolitan'
  | 'custom';

export interface GeoEntity {
  id: string;                           // Unique identifier
  
  iso_code?: string;                    // ISO 3166-1/2 if applicable
  iso_alpha3?: string;                  // 3-letter code
  iso_numeric?: string;                 // Numeric code
  
  nuts_code?: string;                   // NUTS code (EU regions)
  fips_code?: string;                   // FIPS code (US)
  
  name: string;                         // Official name
  name_local?: string;                  // Local language name
  names_alt?: string[];                 // Alternative names
  
  level: GeoLevelType;
  
  parent_id?: string;                   // Parent entity
  children_ids?: string[];              // Child entities
  
  population?: number;
  area_km2?: number;
  
  centroid?: { lat: number; lng: number };
  bounding_box?: { north: number; south: number; east: number; west: number };
  
  metadata: {
    created_at: string;
    source: string;
    is_active: boolean;
  };
}

export const GEO_LEVELS = {
  global: { id: 'WORLD', name: 'World', level: 'global' as GeoLevelType },
  
  continents: [
    { id: 'AF', name: 'Africa' },
    { id: 'AN', name: 'Antarctica' },
    { id: 'AS', name: 'Asia' },
    { id: 'EU', name: 'Europe' },
    { id: 'NA', name: 'North America' },
    { id: 'OC', name: 'Oceania' },
    { id: 'SA', name: 'South America' },
  ],
  
  blocs: [
    { id: 'EU27', name: 'European Union', members: 27 },
    { id: 'OECD', name: 'OECD', members: 38 },
    { id: 'G7', name: 'G7', members: 7 },
    { id: 'G20', name: 'G20', members: 20 },
    { id: 'BRICS', name: 'BRICS', members: 5 },
    { id: 'ASEAN', name: 'ASEAN', members: 10 },
    { id: 'NORDICS', name: 'Nordic Countries', members: 5 },
  ],
  
  subnational_systems: [
    { id: 'NUTS', name: 'NUTS (EU)', levels: ['NUTS0', 'NUTS1', 'NUTS2', 'NUTS3'] },
    { id: 'FIPS', name: 'FIPS (US)', levels: ['State', 'County'] },
    { id: 'LAU', name: 'LAU (EU Local)', levels: ['LAU1', 'LAU2'] },
  ],
};

// =============================================================================
// P3: DEMOGRAPHIC CANON (LOCKED)
// =============================================================================

export const DEMOGRAPHIC_CANON = {
  _locked: true,
  _version: '1.0.0',
  _warning: 'These definitions must NEVER change backwards. Only additions allowed.',
  
  age_groups: {
    standard: [
      { id: 'age_0_4', label: '0-4', min: 0, max: 4 },
      { id: 'age_5_9', label: '5-9', min: 5, max: 9 },
      { id: 'age_10_14', label: '10-14', min: 10, max: 14 },
      { id: 'age_15_19', label: '15-19', min: 15, max: 19 },
      { id: 'age_20_24', label: '20-24', min: 20, max: 24 },
      { id: 'age_25_29', label: '25-29', min: 25, max: 29 },
      { id: 'age_30_34', label: '30-34', min: 30, max: 34 },
      { id: 'age_35_39', label: '35-39', min: 35, max: 39 },
      { id: 'age_40_44', label: '40-44', min: 40, max: 44 },
      { id: 'age_45_49', label: '45-49', min: 45, max: 49 },
      { id: 'age_50_54', label: '50-54', min: 50, max: 54 },
      { id: 'age_55_59', label: '55-59', min: 55, max: 59 },
      { id: 'age_60_64', label: '60-64', min: 60, max: 64 },
      { id: 'age_65_69', label: '65-69', min: 65, max: 69 },
      { id: 'age_70_74', label: '70-74', min: 70, max: 74 },
      { id: 'age_75_79', label: '75-79', min: 75, max: 79 },
      { id: 'age_80_84', label: '80-84', min: 80, max: 84 },
      { id: 'age_85_plus', label: '85+', min: 85, max: null },
    ],
    
    aggregated: [
      { id: 'age_0_14', label: '0-14 (Children)', includes: ['age_0_4', 'age_5_9', 'age_10_14'] },
      { id: 'age_15_64', label: '15-64 (Working age)', includes: ['age_15_19', 'age_20_24', 'age_25_29', 'age_30_34', 'age_35_39', 'age_40_44', 'age_45_49', 'age_50_54', 'age_55_59', 'age_60_64'] },
      { id: 'age_65_plus', label: '65+ (Elderly)', includes: ['age_65_69', 'age_70_74', 'age_75_79', 'age_80_84', 'age_85_plus'] },
      { id: 'age_0_17', label: '0-17 (Minors)', includes: ['age_0_4', 'age_5_9', 'age_10_14', 'age_15_17'] },
      { id: 'age_18_plus', label: '18+ (Adults)', includes: [] }, // All adult groups
    ],
  },
  
  sex: {
    categories: [
      { id: 'male', label: 'Male' },
      { id: 'female', label: 'Female' },
      { id: 'all', label: 'All sexes' },
    ],
    note: 'Biological sex for statistical purposes. Gender identity captured separately where available.',
  },
  
  education_levels: {
    isced_2011: [
      { id: 'isced_0', label: 'Early childhood education', years: '0-2' },
      { id: 'isced_1', label: 'Primary education', years: '6' },
      { id: 'isced_2', label: 'Lower secondary education', years: '3' },
      { id: 'isced_3', label: 'Upper secondary education', years: '3' },
      { id: 'isced_4', label: 'Post-secondary non-tertiary', years: '0.5-2' },
      { id: 'isced_5', label: 'Short-cycle tertiary', years: '2-3' },
      { id: 'isced_6', label: 'Bachelor or equivalent', years: '3-4' },
      { id: 'isced_7', label: 'Master or equivalent', years: '1-2' },
      { id: 'isced_8', label: 'Doctoral or equivalent', years: '3+' },
    ],
    
    aggregated: [
      { id: 'edu_low', label: 'Low (ISCED 0-2)', includes: ['isced_0', 'isced_1', 'isced_2'] },
      { id: 'edu_medium', label: 'Medium (ISCED 3-4)', includes: ['isced_3', 'isced_4'] },
      { id: 'edu_high', label: 'High (ISCED 5-8)', includes: ['isced_5', 'isced_6', 'isced_7', 'isced_8'] },
    ],
  },
  
  income_quintiles: {
    categories: [
      { id: 'q1', label: 'Q1 (Lowest 20%)', percentile_range: [0, 20] },
      { id: 'q2', label: 'Q2 (20-40%)', percentile_range: [20, 40] },
      { id: 'q3', label: 'Q3 (40-60%)', percentile_range: [40, 60] },
      { id: 'q4', label: 'Q4 (60-80%)', percentile_range: [60, 80] },
      { id: 'q5', label: 'Q5 (Top 20%)', percentile_range: [80, 100] },
    ],
    
    derived: [
      { id: 'bottom_half', label: 'Bottom 50%', includes: ['q1', 'q2', 'q3_half'] },
      { id: 'top_10', label: 'Top 10%', subset_of: 'q5' },
      { id: 'top_1', label: 'Top 1%', subset_of: 'q5' },
    ],
  },
  
  urban_rural: {
    categories: [
      { id: 'urban', label: 'Urban' },
      { id: 'rural', label: 'Rural' },
      { id: 'semi_urban', label: 'Semi-urban/Intermediate' },
    ],
    note: 'Definitions vary by country. Uses national statistical office classification.',
  },
  
  migration_status: {
    categories: [
      { id: 'native_born', label: 'Native-born' },
      { id: 'foreign_born', label: 'Foreign-born' },
      { id: 'second_gen', label: 'Second generation (native-born, foreign-born parents)' },
    ],
    
    by_origin: 'Country of birth for foreign-born',
    by_citizenship: 'National vs. foreign citizen',
  },
  
  household_types: {
    categories: [
      { id: 'single_person', label: 'Single person household' },
      { id: 'couple_no_children', label: 'Couple without children' },
      { id: 'couple_with_children', label: 'Couple with children' },
      { id: 'single_parent', label: 'Single parent with children' },
      { id: 'multi_generation', label: 'Multi-generational household' },
      { id: 'other', label: 'Other household types' },
    ],
  },
  
  employment_status: {
    ilo_definition: [
      { id: 'employed', label: 'Employed' },
      { id: 'unemployed', label: 'Unemployed (seeking work)' },
      { id: 'inactive', label: 'Economically inactive' },
    ],
    
    detailed: [
      { id: 'employed_ft', label: 'Employed full-time' },
      { id: 'employed_pt', label: 'Employed part-time' },
      { id: 'employed_temp', label: 'Temporary employment' },
      { id: 'self_employed', label: 'Self-employed' },
      { id: 'unemployed_short', label: 'Short-term unemployed (<12 months)' },
      { id: 'unemployed_long', label: 'Long-term unemployed (12+ months)' },
      { id: 'student', label: 'Student' },
      { id: 'retired', label: 'Retired' },
      { id: 'disabled', label: 'Permanently disabled' },
      { id: 'home_duties', label: 'Home duties' },
    ],
  },
};

// =============================================================================
// SEMANTIC VALIDATION
// =============================================================================

export function validateDemographicDimension(
  dimension: string,
  value: string
): { valid: boolean; error?: string } {
  const canon = DEMOGRAPHIC_CANON as any;
  
  if (!canon[dimension]) {
    return { valid: false, error: `Unknown demographic dimension: ${dimension}` };
  }
  
  const categories = canon[dimension].categories || 
                     canon[dimension].standard ||
                     canon[dimension].ilo_definition;
  
  if (!categories) {
    return { valid: false, error: `No categories defined for: ${dimension}` };
  }
  
  const validIds = categories.map((c: any) => c.id);
  if (!validIds.includes(value)) {
    return { valid: false, error: `Invalid value "${value}" for ${dimension}. Valid: ${validIds.join(', ')}` };
  }
  
  return { valid: true };
}

export function getCanonicalAgeGroup(age: number): string | null {
  for (const group of DEMOGRAPHIC_CANON.age_groups.standard) {
    if (age >= group.min && (group.max === null || age <= group.max)) {
      return group.id;
    }
  }
  return null;
}

// =============================================================================
// SEMANTIC CORE VERSION
// =============================================================================

export const SEMANTIC_CORE_VERSION = {
  version: '1.0.0',
  locked_at: '2024-01-01',
  
  components: {
    kpi_dictionary: '1.0.0',
    geo_universe: '1.0.0',
    demographic_canon: '1.0.0',
  },
  
  rules: [
    'Demographic canon values must NEVER be renamed or removed',
    'New values may only be ADDED, not modified',
    'All new additions must be backwards compatible',
    'Breaking changes require new major version of entire system',
  ],
};
