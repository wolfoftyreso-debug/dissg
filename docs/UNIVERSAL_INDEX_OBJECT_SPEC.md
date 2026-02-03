# 🔬 UNIVERSAL INDEX OBJECT (UIO) SPECIFICATION

## The Technical & Semantic Backbone

**Version**: 2.0  
**Status**: Canonical  
**Classification**: Core Infrastructure

---

## FOUNDATIONAL PRINCIPLE

> **We do not store data. We store indexed claims about reality.**

Every piece of information in the system is a **verifiable assertion** with:
- Source authority
- Temporal validity
- Jurisdictional scope
- Relationship graph
- Immutable versioning

---

# PART I: THE UNIVERSAL INDEX OBJECT

## 1.1 Core Schema (Non-Negotiable)

```typescript
/**
 * Universal Index Object (UIO)
 * 
 * The atomic unit of all indexed reality.
 * Nothing exists in the system outside this structure.
 */
interface UniversalIndexObject {
  // ═══════════════════════════════════════════════════════════════
  // IDENTITY (Immutable)
  // ═══════════════════════════════════════════════════════════════
  
  id: GlobalHash;                     // SHA-256 of canonical content
  slug: string;                       // Human-readable path component
  type: IndexEntityType;              // Primary classification
  
  // ═══════════════════════════════════════════════════════════════
  // CLAIM (The indexed assertion)
  // ═══════════════════════════════════════════════════════════════
  
  claim: {
    statement: string;                // Semantic core in natural language
    value: ClaimValue;                // Structured value
    unit: UnitCode | null;            // Measurement unit if applicable
    precision: number;                // Meaningful decimal places
  };
  
  // ═══════════════════════════════════════════════════════════════
  // SOURCE AUTHORITY
  // ═══════════════════════════════════════════════════════════════
  
  source: {
    authority: AuthorityReference;    // Who makes this claim
    origin: OriginType;               // API | document | report | database
    source_id: string;                // Original reference identifier
    access_url: URL | null;           // Where to verify
    access_date: ISO8601;             // When we accessed it
    license: LicenseType;             // Usage rights
  };
  
  // ═══════════════════════════════════════════════════════════════
  // JURISDICTION (Where this applies)
  // ═══════════════════════════════════════════════════════════════
  
  jurisdiction: {
    scope: JurisdictionScope;         // local | regional | national | supranational | global
    country: ISO3166Alpha2 | null;    // 'SE', 'US', null for global
    region: string | null;            // NUTS code, state code, etc.
    municipality: string | null;      // Local administrative unit
    custom_area: GeoJSON | null;      // For non-standard areas
  };
  
  // ═══════════════════════════════════════════════════════════════
  // TEMPORAL VALIDITY
  // ═══════════════════════════════════════════════════════════════
  
  time: {
    observed_at: ISO8601;             // When the measurement was taken
    valid_from: ISO8601;              // When this claim became true
    valid_to: ISO8601 | null;         // When this claim expired (null = current)
    observation_lag: Duration;        // Typical delay reality → publication
    update_frequency: Frequency;      // How often source updates
  };
  
  // ═══════════════════════════════════════════════════════════════
  // CONFIDENCE & QUALITY
  // ═══════════════════════════════════════════════════════════════
  
  confidence: {
    score: number;                    // 0.0 - 1.0
    method: ConfidenceMethod;         // official | inferred | aggregated | estimated
    uncertainty: UncertaintyBand | null;
    flags: QualityFlag[];             // preliminary | revised | interpolated | contested
  };
  
  // ═══════════════════════════════════════════════════════════════
  // RELATIONSHIPS (The power layer)
  // ═══════════════════════════════════════════════════════════════
  
  relations: IndexRelation[];
  
  // ═══════════════════════════════════════════════════════════════
  // IMMUTABILITY & VERSIONING
  // ═══════════════════════════════════════════════════════════════
  
  immutability: {
    version: SemanticVersion;         // vX.Y.Z
    previous_version: GlobalHash | null;
    created_at: ISO8601;
    checksum: SHA256;                 // Content integrity
    merkle_proof: MerkleProof | null; // Tamper evidence
  };
  
  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════
  
  metadata: {
    category: CategoryCode;           // Primary domain
    subcategory: SubcategoryCode;     // Specific classification
    tags: SemanticTag[];              // Machine-readable labels
    languages: LanguageCode[];        // Available translations
    methodology_id: UUID | null;      // Link to methodology documentation
  };
}
```

## 1.2 Claim Value Types

```typescript
type ClaimValue = 
  | NumericClaim
  | TextClaim
  | CategoricalClaim
  | BooleanClaim
  | RangeClaim
  | VectorClaim
  | TimeSeriesClaim;

interface NumericClaim {
  type: 'numeric';
  value: number;
  lower_bound: number | null;         // Confidence interval
  upper_bound: number | null;
}

interface TextClaim {
  type: 'text';
  value: string;
  language: LanguageCode;
  normalized_form: string;            // Canonical representation
}

interface CategoricalClaim {
  type: 'categorical';
  value: string;
  vocabulary: VocabularyReference;    // Controlled vocabulary source
  code: string;                       // Machine code
}

interface BooleanClaim {
  type: 'boolean';
  value: boolean;
  confidence: number;                 // How sure (for inferred booleans)
}

interface RangeClaim {
  type: 'range';
  min: number;
  max: number;
  typical: number | null;             // Most common value
}

interface VectorClaim {
  type: 'vector';
  dimensions: string[];               // What each dimension represents
  values: number[];
}

interface TimeSeriesClaim {
  type: 'timeseries';
  points: TimePoint[];
  aggregation: AggregationType;       // sum | average | end_of_period
}
```

## 1.3 Relationship Types (Day 1 Requirements)

```typescript
type RelationType =
  // ═══ VERSIONING ═══
  | 'supersedes'          // This replaces previous version
  | 'superseded_by'       // This was replaced by newer version
  
  // ═══ DERIVATION ═══
  | 'derived_from'        // Calculated from source(s)
  | 'component_of'        // Part of an aggregate
  | 'aggregates'          // Combines multiple sources
  
  // ═══ DEPENDENCY ═══
  | 'depends_on'          // Requires this to be true
  | 'prerequisite_for'    // Must exist before this
  
  // ═══ CONFLICT ═══
  | 'conflicts_with'      // Contradictory claims
  | 'supersedes_in'       // Replaces only in specific jurisdiction
  
  // ═══ CORRELATION ═══
  | 'correlates_with'     // Statistical correlation (NOT causal)
  | 'co_moves_with'       // Temporal alignment
  | 'inversely_correlates'// Negative correlation
  
  // ═══ REGULATORY ═══
  | 'regulated_by'        // Subject to this regulation
  | 'regulates'           // Controls this entity
  | 'authorized_by'       // Legal authority source
  
  // ═══ INFLUENCE ═══
  | 'influenced_by'       // Theoretical/model relationship
  | 'influences'          // Affects this entity
  
  // ═══ SEMANTIC ═══
  | 'equivalent_to'       // Same concept, different source
  | 'similar_to'          // Related but not identical
  | 'opposite_of'         // Inverse concept
  | 'broader_than'        // More general category
  | 'narrower_than'       // More specific category
  
  // ═══ TEMPORAL ═══
  | 'precedes'            // Comes before in time
  | 'follows'             // Comes after in time
  | 'concurrent_with';    // Same time period

interface IndexRelation {
  type: RelationType;
  target_id: GlobalHash;
  
  // Relationship properties
  strength: number | null;            // -1.0 to 1.0 for correlations
  confidence: number;                 // How sure about this relationship
  lag: Duration | null;               // Time delay (for leads/lags)
  
  // Validity
  valid_from: ISO8601;
  valid_to: ISO8601 | null;
  
  // Provenance
  source: 'computed' | 'declared' | 'inferred' | 'manual';
  methodology: string | null;
}
```

---

# PART II: INDEX TYPES (DOMAIN TAXONOMY)

## 2.1 Primary Index Domains

```typescript
type PrimaryDomain =
  | 'health'              // Life, mortality, disease, healthcare
  | 'economy'             // GDP, trade, finance, markets
  | 'labor'               // Employment, wages, workforce
  | 'price'               // Consumer prices, commodities, assets
  | 'crime'               // Safety, justice, violence
  | 'education'           // Schools, skills, literacy
  | 'environment'         // Climate, resources, pollution
  | 'energy'              // Production, consumption, infrastructure
  | 'governance'          // Policy, institutions, democracy
  | 'demographics'        // Population, migration, fertility
  | 'housing'             // Real estate, construction, affordability
  | 'transport'           // Infrastructure, mobility, logistics
  | 'technology'          // R&D, innovation, digitalization
  | 'social'              // Inequality, welfare, cohesion
  | 'legal';              // Laws, regulations, compliance
```

## 2.2 Domain Specifications

### HEALTH Domain

```typescript
const HEALTH_DOMAIN: DomainSpec = {
  code: 'health',
  name: 'Life & Health',
  description: 'Human longevity, disease burden, and healthcare systems',
  
  lambda_weight: 0.20,  // Default weight in Lambda calculation
  
  subcategories: [
    {
      code: 'mortality',
      indicators: [
        'life_expectancy',
        'infant_mortality',
        'maternal_mortality',
        'age_standardized_death_rate',
        'excess_mortality',
        'preventable_deaths',
      ]
    },
    {
      code: 'morbidity',
      indicators: [
        'disease_prevalence',
        'incidence_rate',
        'disability_adjusted_life_years',
        'healthy_life_expectancy',
        'chronic_disease_burden',
      ]
    },
    {
      code: 'healthcare_access',
      indicators: [
        'physician_density',
        'hospital_beds_per_capita',
        'wait_times',
        'out_of_pocket_expenditure',
        'health_insurance_coverage',
      ]
    },
    {
      code: 'healthcare_quality',
      indicators: [
        'patient_outcomes',
        'treatment_success_rates',
        'readmission_rates',
        'medical_errors',
        'patient_satisfaction',
      ]
    },
    {
      code: 'public_health',
      indicators: [
        'vaccination_coverage',
        'disease_surveillance',
        'epidemic_preparedness',
        'sanitation_access',
        'clean_water_access',
      ]
    },
    {
      code: 'mental_health',
      indicators: [
        'depression_prevalence',
        'anxiety_disorders',
        'suicide_rate',
        'mental_health_service_access',
        'psychiatric_beds',
      ]
    },
  ],
  
  primary_sources: [
    'WHO',
    'EUROSTAT',
    'OECD_HEALTH',
    'NATIONAL_HEALTH_AGENCIES',
    'IHME_GBD',
  ],
  
  typical_update_frequency: 'annual',
  typical_observation_lag: 'P6M',  // 6 months
};
```

### ECONOMY Domain

```typescript
const ECONOMY_DOMAIN: DomainSpec = {
  code: 'economy',
  name: 'Economic Activity',
  description: 'Production, trade, finance, and market dynamics',
  
  lambda_weight: 0.20,
  
  subcategories: [
    {
      code: 'output',
      indicators: [
        'gdp_nominal',
        'gdp_real',
        'gdp_per_capita',
        'gdp_growth_rate',
        'industrial_production',
        'manufacturing_output',
        'service_sector_output',
      ]
    },
    {
      code: 'trade',
      indicators: [
        'exports',
        'imports',
        'trade_balance',
        'current_account',
        'terms_of_trade',
        'export_diversification',
      ]
    },
    {
      code: 'finance',
      indicators: [
        'interest_rates',
        'money_supply',
        'credit_growth',
        'bank_lending',
        'stock_market_index',
        'bond_yields',
        'foreign_exchange_reserves',
      ]
    },
    {
      code: 'fiscal',
      indicators: [
        'government_revenue',
        'government_expenditure',
        'budget_balance',
        'public_debt',
        'debt_to_gdp',
        'tax_revenue',
      ]
    },
    {
      code: 'inflation',
      indicators: [
        'cpi',
        'core_inflation',
        'producer_price_index',
        'gdp_deflator',
        'inflation_expectations',
      ]
    },
    {
      code: 'investment',
      indicators: [
        'gross_fixed_capital_formation',
        'fdi_inflow',
        'fdi_outflow',
        'portfolio_investment',
        'business_investment',
      ]
    },
  ],
  
  primary_sources: [
    'IMF',
    'WORLD_BANK',
    'OECD',
    'EUROSTAT',
    'NATIONAL_CENTRAL_BANKS',
    'NATIONAL_STATISTICAL_OFFICES',
  ],
  
  typical_update_frequency: 'quarterly',
  typical_observation_lag: 'P45D',
};
```

### LABOR Domain

```typescript
const LABOR_DOMAIN: DomainSpec = {
  code: 'labor',
  name: 'Livelihood & Work',
  description: 'Employment, wages, workforce dynamics, and job quality',
  
  lambda_weight: 0.20,
  
  subcategories: [
    {
      code: 'employment',
      indicators: [
        'unemployment_rate',
        'employment_rate',
        'labor_force_participation',
        'youth_unemployment',
        'long_term_unemployment',
        'underemployment',
      ]
    },
    {
      code: 'wages',
      indicators: [
        'average_wage',
        'median_wage',
        'real_wage_growth',
        'minimum_wage',
        'wage_distribution',
        'gender_pay_gap',
      ]
    },
    {
      code: 'job_quality',
      indicators: [
        'part_time_employment',
        'temporary_contracts',
        'job_security_index',
        'working_hours',
        'work_life_balance',
        'job_satisfaction',
      ]
    },
    {
      code: 'skills',
      indicators: [
        'skill_mismatch',
        'vacancy_rate',
        'hard_to_fill_vacancies',
        'training_participation',
        'digital_skills',
      ]
    },
    {
      code: 'labor_market_dynamics',
      indicators: [
        'job_creation_rate',
        'job_destruction_rate',
        'labor_turnover',
        'hiring_rate',
        'separation_rate',
      ]
    },
  ],
  
  primary_sources: [
    'ILO',
    'OECD_EMPLOYMENT',
    'EUROSTAT_LFS',
    'NATIONAL_LABOR_AGENCIES',
  ],
  
  typical_update_frequency: 'monthly',
  typical_observation_lag: 'P30D',
};
```

### PRICE Domain

```typescript
const PRICE_DOMAIN: DomainSpec = {
  code: 'price',
  name: 'Prices & Purchasing Power',
  description: 'Consumer prices, commodities, assets, and real purchasing power',
  
  lambda_weight: 0.10,  // Derived impact on other domains
  
  subcategories: [
    {
      code: 'consumer_prices',
      indicators: [
        'cpi_all_items',
        'cpi_food',
        'cpi_housing',
        'cpi_transport',
        'cpi_healthcare',
        'cpi_education',
        'cpi_recreation',
      ]
    },
    {
      code: 'asset_prices',
      indicators: [
        'house_price_index',
        'rent_index',
        'stock_price_index',
        'bond_prices',
        'commercial_real_estate',
      ]
    },
    {
      code: 'commodities',
      indicators: [
        'oil_price',
        'gas_price',
        'electricity_price',
        'food_commodity_prices',
        'metal_prices',
        'agricultural_prices',
      ]
    },
    {
      code: 'purchasing_power',
      indicators: [
        'ppp_conversion_factor',
        'real_effective_exchange_rate',
        'big_mac_index',
        'cost_of_living_index',
        'basket_affordability',
      ]
    },
    {
      code: 'price_comparison',
      indicators: [
        'product_price_comparison',
        'service_price_comparison',
        'cross_border_price_gap',
        'online_vs_offline_prices',
      ]
    },
  ],
  
  primary_sources: [
    'NATIONAL_STATISTICAL_OFFICES',
    'PRISJAKT',
    'PRICERUNNER',
    'COMMODITY_EXCHANGES',
    'CENTRAL_BANKS',
    'IEA',
  ],
  
  typical_update_frequency: 'daily',  // For commodities
  typical_observation_lag: 'P1D',
};
```

### CRIME Domain

```typescript
const CRIME_DOMAIN: DomainSpec = {
  code: 'crime',
  name: 'Safety & Security',
  description: 'Crime rates, justice system, and public safety',
  
  lambda_weight: 0.10,
  
  subcategories: [
    {
      code: 'violent_crime',
      indicators: [
        'homicide_rate',
        'assault_rate',
        'robbery_rate',
        'sexual_violence_rate',
        'gun_violence',
        'gang_related_violence',
      ]
    },
    {
      code: 'property_crime',
      indicators: [
        'burglary_rate',
        'theft_rate',
        'vehicle_theft',
        'vandalism',
        'fraud_rate',
      ]
    },
    {
      code: 'organized_crime',
      indicators: [
        'drug_trafficking',
        'human_trafficking',
        'money_laundering',
        'cybercrime',
        'organized_crime_index',
      ]
    },
    {
      code: 'justice_system',
      indicators: [
        'clearance_rate',
        'conviction_rate',
        'incarceration_rate',
        'recidivism_rate',
        'court_case_duration',
        'prison_capacity',
      ]
    },
    {
      code: 'perception',
      indicators: [
        'fear_of_crime',
        'trust_in_police',
        'perceived_safety',
        'neighborhood_safety',
      ]
    },
  ],
  
  primary_sources: [
    'UNODC',
    'EUROSTAT_CRIME',
    'NATIONAL_POLICE',
    'NATIONAL_JUSTICE_AGENCIES',
    'BRA',  // Sweden specific
  ],
  
  typical_update_frequency: 'annual',
  typical_observation_lag: 'P3M',
};
```

### ENVIRONMENT Domain

```typescript
const ENVIRONMENT_DOMAIN: DomainSpec = {
  code: 'environment',
  name: 'Resource & Environment Base',
  description: 'Climate, resources, pollution, and environmental sustainability',
  
  lambda_weight: 0.10,
  
  subcategories: [
    {
      code: 'climate',
      indicators: [
        'co2_emissions',
        'co2_per_capita',
        'temperature_anomaly',
        'sea_level',
        'arctic_ice_extent',
        'extreme_weather_events',
      ]
    },
    {
      code: 'air_quality',
      indicators: [
        'pm25_concentration',
        'pm10_concentration',
        'ozone_levels',
        'no2_levels',
        'air_quality_index',
      ]
    },
    {
      code: 'water',
      indicators: [
        'water_stress',
        'freshwater_availability',
        'water_quality_index',
        'wastewater_treatment',
        'ocean_acidification',
      ]
    },
    {
      code: 'land_use',
      indicators: [
        'forest_coverage',
        'deforestation_rate',
        'land_degradation',
        'protected_areas',
        'urban_sprawl',
      ]
    },
    {
      code: 'biodiversity',
      indicators: [
        'species_extinction_rate',
        'biodiversity_index',
        'ecosystem_health',
        'invasive_species',
      ]
    },
    {
      code: 'waste',
      indicators: [
        'municipal_waste_generated',
        'recycling_rate',
        'hazardous_waste',
        'plastic_pollution',
        'circular_economy_rate',
      ]
    },
  ],
  
  primary_sources: [
    'NOAA',
    'NASA',
    'EUROPEAN_ENVIRONMENT_AGENCY',
    'UNEP',
    'COPERNICUS',
    'NATIONAL_ENVIRONMENTAL_AGENCIES',
  ],
  
  typical_update_frequency: 'annual',
  typical_observation_lag: 'P6M',
};
```

### LEGAL Domain

```typescript
const LEGAL_DOMAIN: DomainSpec = {
  code: 'legal',
  name: 'Law & Regulation',
  description: 'Legislation, regulations, court decisions, and compliance',
  
  lambda_weight: 0.05,  // Indirect effect through other domains
  
  subcategories: [
    {
      code: 'legislation',
      indicators: [
        'active_laws',
        'new_legislation_rate',
        'repealed_laws',
        'regulatory_burden',
        'legislative_complexity',
      ]
    },
    {
      code: 'regulation',
      indicators: [
        'regulatory_quality_index',
        'compliance_costs',
        'enforcement_actions',
        'regulatory_changes',
        'deregulation_index',
      ]
    },
    {
      code: 'court_system',
      indicators: [
        'case_backlog',
        'average_case_duration',
        'appeal_rate',
        'judicial_independence',
        'court_efficiency',
      ]
    },
    {
      code: 'property_rights',
      indicators: [
        'property_rights_index',
        'contract_enforcement',
        'intellectual_property',
        'land_registration',
      ]
    },
    {
      code: 'business_law',
      indicators: [
        'ease_of_doing_business',
        'starting_business_time',
        'contract_enforcement_time',
        'insolvency_proceedings',
        'investor_protection',
      ]
    },
  ],
  
  primary_sources: [
    'NATIONAL_PARLIAMENTS',
    'OFFICIAL_GAZETTES',
    'EUR_LEX',
    'WORLD_BANK_DB',
    'WJP_RULE_OF_LAW',
  ],
  
  typical_update_frequency: 'real_time',  // Laws are events
  typical_observation_lag: 'P0D',
};
```

## 2.3 Complete Domain Registry

```typescript
const ALL_DOMAINS: DomainSpec[] = [
  HEALTH_DOMAIN,
  ECONOMY_DOMAIN,
  LABOR_DOMAIN,
  PRICE_DOMAIN,
  CRIME_DOMAIN,
  EDUCATION_DOMAIN,       // Knowledge & Competence
  ENVIRONMENT_DOMAIN,
  ENERGY_DOMAIN,          // Energy systems
  GOVERNANCE_DOMAIN,      // Institutions & democracy
  DEMOGRAPHICS_DOMAIN,    // Population dynamics
  HOUSING_DOMAIN,         // Real estate & affordability
  TRANSPORT_DOMAIN,       // Mobility & logistics
  TECHNOLOGY_DOMAIN,      // Innovation & R&D
  SOCIAL_DOMAIN,          // Inequality & welfare
  LEGAL_DOMAIN,
];

// Lambda Domain Mapping (for composite index)
const LAMBDA_DOMAINS = {
  'life_health': ['health'],
  'livelihood_work': ['labor', 'economy'],
  'knowledge_competence': ['education', 'technology'],
  'stability_security': ['crime', 'governance', 'social'],
  'resource_environment': ['environment', 'energy'],
};
```

---

# PART III: API DESIGN

## 3.1 Design Principles

```
┌────────────────────────────────────────────────────────────────────┐
│                      API DESIGN PRINCIPLES                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. ZERO FRICTION READ                                              │
│     • No auth required for public data                              │
│     • Immediate response for cached data                            │
│     • Progressive disclosure (summary → detail)                     │
│                                                                     │
│  2. SEMANTIC FIRST                                                  │
│     • All endpoints return JSON-LD                                  │
│     • Schema.org compatible                                         │
│     • Machine-readable metadata                                     │
│                                                                     │
│  3. PREDICTABLE STRUCTURE                                           │
│     • RESTful with consistent patterns                              │
│     • GraphQL for complex queries                                   │
│     • Stable URLs (never break)                                     │
│                                                                     │
│  4. TRANSPARENT LIMITS                                              │
│     • Rate limits in headers                                        │
│     • Complexity budget visible                                     │
│     • Clear upgrade path                                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 3.2 REST API Structure

### Base URL Pattern

```
https://api.gros.world/v1/{resource}
https://api.gros.world/v1/{resource}/{id}
https://api.gros.world/v1/{resource}/{id}/{sub-resource}
```

### Core Endpoints

```yaml
# ═══════════════════════════════════════════════════════════════════
# INDEX OBJECTS
# ═══════════════════════════════════════════════════════════════════

GET /v1/objects
  # List all index objects (paginated)
  params:
    - domain: string          # Filter by domain
    - jurisdiction: string    # Filter by jurisdiction
    - category: string        # Filter by category
    - updated_since: ISO8601  # Only changed after this date
    - limit: number           # Max 1000
    - offset: number
  returns: IndexObjectList

GET /v1/objects/{id}
  # Get single index object by ID
  returns: UniversalIndexObject

GET /v1/objects/{id}/history
  # Get all versions of an object
  returns: VersionHistory

GET /v1/objects/{id}/relations
  # Get all relationships
  params:
    - type: RelationType[]    # Filter by relationship type
    - depth: number           # How many hops (max 3)
  returns: RelationGraph

# ═══════════════════════════════════════════════════════════════════
# INDICATORS
# ═══════════════════════════════════════════════════════════════════

GET /v1/indicators
  # List all available indicators
  params:
    - domain: string
    - jurisdiction: string
  returns: IndicatorList

GET /v1/indicators/{code}
  # Get indicator definition and metadata
  returns: IndicatorDefinition

GET /v1/indicators/{code}/values
  # Get time series data
  params:
    - jurisdiction: string[]  # One or more jurisdictions
    - from: ISO8601
    - to: ISO8601
    - frequency: 'daily' | 'monthly' | 'quarterly' | 'annual'
  returns: TimeSeriesData

GET /v1/indicators/{code}/compare
  # Compare across jurisdictions
  params:
    - jurisdictions: string[] # Up to 10
    - period: string          # 'latest' | '2023' | '2020-2023'
  returns: ComparisonResult

# ═══════════════════════════════════════════════════════════════════
# JURISDICTIONS
# ═══════════════════════════════════════════════════════════════════

GET /v1/jurisdictions
  # List all jurisdictions
  params:
    - type: JurisdictionType
    - level: number
    - parent: string
  returns: JurisdictionList

GET /v1/jurisdictions/{code}
  # Get jurisdiction details
  returns: JurisdictionDetails

GET /v1/jurisdictions/{code}/indicators
  # List all indicators available for this jurisdiction
  returns: AvailableIndicators

GET /v1/jurisdictions/{code}/profile
  # Get complete jurisdiction profile
  returns: JurisdictionProfile

# ═══════════════════════════════════════════════════════════════════
# LAMBDA INDEX
# ═══════════════════════════════════════════════════════════════════

GET /v1/lambda/{jurisdiction}
  # Get current Lambda value
  returns: LambdaValue

GET /v1/lambda/{jurisdiction}/history
  # Get Lambda time series
  params:
    - from: ISO8601
    - to: ISO8601
  returns: LambdaTimeSeries

GET /v1/lambda/{jurisdiction}/decomposition
  # Get Lambda broken down by domain
  returns: LambdaDecomposition

GET /v1/lambda/compare
  # Compare Lambda across jurisdictions
  params:
    - jurisdictions: string[]
  returns: LambdaComparison

# ═══════════════════════════════════════════════════════════════════
# VERIFICATION
# ═══════════════════════════════════════════════════════════════════

GET /v1/verify/{id}
  # Verify object integrity
  returns: VerificationResult

GET /v1/verify/lineage/{id}
  # Get full data lineage
  returns: DataLineage

GET /v1/audit
  # Get public audit log
  params:
    - from: ISO8601
    - to: ISO8601
    - type: AuditEventType[]
  returns: AuditLog

# ═══════════════════════════════════════════════════════════════════
# SEARCH
# ═══════════════════════════════════════════════════════════════════

GET /v1/search
  # Semantic search across all objects
  params:
    - q: string               # Natural language query
    - domain: string[]
    - jurisdiction: string[]
    - type: IndexEntityType[]
  returns: SearchResults

POST /v1/search/structured
  # Structured query (premium)
  body: StructuredQuery
  returns: SearchResults
```

## 3.3 GraphQL Schema

```graphql
type Query {
  # Single object lookup
  object(id: ID!): IndexObject
  
  # Object listing with filters
  objects(
    domain: [String!]
    jurisdiction: [String!]
    category: [String!]
    after: String
    first: Int
  ): IndexObjectConnection!
  
  # Indicator queries
  indicator(code: String!): Indicator
  indicators(domain: String, jurisdiction: String): [Indicator!]!
  
  # Time series data
  timeSeries(
    indicator: String!
    jurisdiction: String!
    from: DateTime
    to: DateTime
    frequency: Frequency
  ): TimeSeries!
  
  # Jurisdiction queries
  jurisdiction(code: String!): Jurisdiction
  jurisdictions(type: JurisdictionType, level: Int): [Jurisdiction!]!
  
  # Lambda index
  lambda(jurisdiction: String!): LambdaValue
  lambdaHistory(
    jurisdiction: String!
    from: DateTime
    to: DateTime
  ): [LambdaValue!]!
  
  # Verification
  verify(id: ID!): VerificationResult!
  lineage(id: ID!): DataLineage!
  
  # Search
  search(query: String!, filters: SearchFilters): SearchResults!
}

type IndexObject {
  id: ID!
  slug: String!
  type: IndexEntityType!
  
  claim: Claim!
  source: SourceAuthority!
  jurisdiction: JurisdictionScope!
  time: TemporalValidity!
  confidence: ConfidenceScore!
  
  relations(type: [RelationType!], depth: Int): [IndexRelation!]!
  
  history: [IndexObject!]!
  
  # Computed fields
  isCurrentVersion: Boolean!
  latestVersion: IndexObject
}

type Claim {
  statement: String!
  value: ClaimValue!
  unit: String
  precision: Int
}

union ClaimValue = NumericValue | TextValue | CategoricalValue | BooleanValue

type NumericValue {
  value: Float!
  lowerBound: Float
  upperBound: Float
}

type IndexRelation {
  type: RelationType!
  target: IndexObject!
  strength: Float
  confidence: Float!
  validFrom: DateTime!
  validTo: DateTime
}

type LambdaValue {
  value: Float!
  uncertainty: UncertaintyBand
  timestamp: DateTime!
  
  domains: [DomainScore!]!
  methodology: String!
  
  # Decomposition
  components(depth: Int): [LambdaComponent!]!
}

type LambdaComponent {
  name: String!
  weight: Float!
  score: Float!
  indicators: [Indicator!]!
}
```

## 3.4 Response Format

All responses include standard metadata:

```typescript
interface APIResponse<T> {
  // Payload
  data: T;
  
  // Metadata
  meta: {
    request_id: UUID;
    timestamp: ISO8601;
    version: string;
    
    // Caching
    cache_status: 'hit' | 'miss' | 'stale';
    cache_expires: ISO8601;
    etag: string;
    
    // Rate limiting
    rate_limit: {
      limit: number;
      remaining: number;
      reset: ISO8601;
    };
    
    // Complexity (for premium queries)
    complexity?: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
  
  // Pagination (if applicable)
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
    next_cursor?: string;
  };
  
  // JSON-LD context
  '@context'?: JSONLDContext;
  '@type'?: string;
  '@id'?: string;
}
```

## 3.5 Authentication & Rate Limits

```yaml
# ═══════════════════════════════════════════════════════════════════
# PUBLIC ACCESS (No Auth)
# ═══════════════════════════════════════════════════════════════════

rate_limits:
  requests_per_minute: 30
  requests_per_hour: 300
  requests_per_day: 1000

allowed_endpoints:
  - GET /v1/objects/*
  - GET /v1/indicators/*
  - GET /v1/jurisdictions/*
  - GET /v1/lambda/*
  - GET /v1/verify/*
  - GET /v1/search (basic)

restrictions:
  - max_results_per_request: 100
  - max_history_depth: 2_years
  - no_bulk_export: true
  - no_graphql: true

# ═══════════════════════════════════════════════════════════════════
# OBSERVER TIER (Free, API Key)
# ═══════════════════════════════════════════════════════════════════

rate_limits:
  requests_per_minute: 60
  requests_per_hour: 1000
  requests_per_day: 5000

additional_access:
  - max_results_per_request: 500
  - max_history_depth: 10_years
  - graphql: read_only
  - webhooks: 5

# ═══════════════════════════════════════════════════════════════════
# ANALYST TIER (Paid)
# ═══════════════════════════════════════════════════════════════════

rate_limits:
  requests_per_minute: 300
  requests_per_hour: 10000
  requests_per_day: 100000

additional_access:
  - max_results_per_request: 5000
  - max_history_depth: all
  - graphql: full
  - webhooks: 100
  - bulk_export: true
  - comparison_tool: true
  - custom_queries: true

complexity_budget:
  per_request: 1000
  per_day: 50000

# ═══════════════════════════════════════════════════════════════════
# INSTITUTIONAL TIER (Enterprise)
# ═══════════════════════════════════════════════════════════════════

rate_limits:
  requests_per_minute: unlimited (fair use)
  requests_per_hour: unlimited
  requests_per_day: unlimited

additional_access:
  - priority_queue: true
  - dedicated_endpoints: true
  - real_time_push: true
  - custom_integrations: true
  - write_api: limited
  - white_label: true
  - sla_guarantee: 99.9%
```

## 3.6 Webhook Events

```typescript
interface WebhookSubscription {
  id: UUID;
  url: URL;                           // Your endpoint
  secret: string;                     // For signature verification
  
  events: WebhookEventType[];
  filters: {
    domains?: DomainCode[];
    jurisdictions?: JurisdictionCode[];
    indicators?: IndicatorCode[];
    min_change_percent?: number;
  };
  
  active: boolean;
  created_at: ISO8601;
}

type WebhookEventType =
  | 'object.created'
  | 'object.updated'
  | 'object.superseded'
  | 'indicator.value_changed'
  | 'indicator.methodology_changed'
  | 'jurisdiction.changed'
  | 'lambda.threshold_crossed'
  | 'alert.triggered'
  | 'source.updated'
  | 'source.deprecated';

interface WebhookPayload {
  id: UUID;
  type: WebhookEventType;
  timestamp: ISO8601;
  
  object: {
    id: GlobalHash;
    type: IndexEntityType;
    domain: DomainCode;
    jurisdiction: JurisdictionCode;
  };
  
  change: {
    field: string;
    previous_value: any;
    new_value: any;
    change_percent?: number;
  };
  
  signature: string;                  // HMAC-SHA256
}
```

---

# PART IV: FRONTEND LOGIC — THE "DESIRE" ARCHITECTURE

## 4.1 Core Psychological Principle

```
┌────────────────────────────────────────────────────────────────────┐
│                  THE DESIRE ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SHOW EVERYTHING → BLOCK NOTHING → LOCK INTERACTION                 │
│                                                                     │
│  User can SEE:     100% of data                                     │
│  User can READ:    100% of values                                   │
│  User can VERIFY:  100% of sources                                  │
│  User can TOUCH:   Varies by tier                                   │
│  User can BUILD:   Premium only                                     │
│                                                                     │
│  The frustration is never "I can't see this"                        │
│  The frustration is "I can see it but can't USE it"                 │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 4.2 Visual Hierarchy by Tier

### Public (No Account)

```
┌────────────────────────────────────────────────────────────────────┐
│  SWEDEN — Economic Overview                                  [🔓]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ GDP Growth      │  │ Unemployment    │  │ Inflation       │     │
│  │                 │  │                 │  │                 │     │
│  │    +2.1%        │  │    7.4%         │  │    2.3%         │     │
│  │    ▲ +0.3       │  │    ▼ -0.2       │  │    ▼ -0.5       │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  [GRAPH: 2-year history, view only, no hover details]        │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📊 See full 10-year history                    [Create Free │  │
│  │  📥 Export this data                             Account →] │  │
│  │  🔔 Get alerts when this changes                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Source: SCB, Riksbanken | Updated: 2024-04-15 | Methodology ℹ️    │
└────────────────────────────────────────────────────────────────────┘
```

**What's visible but locked:**
- Hover shows "[Create account to see value details]"
- Graph is static image (no interaction)
- Export button shows paywall
- Compare button shows tier requirement

### Observer Tier (Free Account)

```
┌────────────────────────────────────────────────────────────────────┐
│  SWEDEN — Economic Overview                      [Observer 🔓]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ GDP Growth      │  │ Unemployment    │  │ Inflation       │     │
│  │ Q1 2024         │  │ Mar 2024        │  │ Mar 2024        │     │
│  │    +2.1%        │  │    7.4%         │  │    2.3%         │     │
│  │    ▲ +0.3 QoQ   │  │    ▼ -0.2 MoM   │  │    ▼ -0.5 YoY   │     │
│  │    [HOVER: OK]  │  │    [HOVER: OK]  │  │    [HOVER: OK]  │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  [INTERACTIVE GRAPH: 10-year history]                        │  │
│  │  ████████████████████████████████████████████████████████████ │  │
│  │  ████████████████████████████████████████████████████████████ │  │
│  │                                                               │  │
│  │  Hover: Shows values ✓                                        │  │
│  │  Zoom: ✗ [Upgrade to Analyst]                                │  │
│  │  Overlay: ✗ [Upgrade to Analyst]                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📥 Export (max 100 rows)            [Download CSV]          │  │
│  │  🔔 Alerts (5/5 used)                [Manage Alerts]         │  │
│  │  📊 Compare with other countries     [Upgrade to Analyst →] │  │
│  │  🧮 Build custom index               [Upgrade to Analyst →] │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Source: SCB, Riksbanken | Updated: 2024-04-15 | [Full Lineage]    │
└────────────────────────────────────────────────────────────────────┘
```

**What's visible but locked:**
- Compare tool shows grayed jurisdictions beyond 2
- Custom index shows the builder, but "Run" is locked
- Advanced graph features visible but inactive
- Export limited to 100 rows (counter shows)

### Analyst Tier (Paid)

```
┌────────────────────────────────────────────────────────────────────┐
│  SWEDEN — Economic Overview                      [Analyst 🔓 Pro] │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [TOOLBAR: Full access]                                             │
│  Compare ▼ | Overlay ▼ | Export ▼ | Alert ▼ | API | Embed         │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  [FULL INTERACTIVE GRAPH]                                     │  │
│  │  • All history available                                      │  │
│  │  • Multiple indicators overlay                                │  │
│  │  • Correlation analysis                                       │  │
│  │  • Trend lines                                                │  │
│  │  • Anomaly detection                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────────┐  ┌────────────────────────────────┐   │
│  │ CUSTOM INDEX BUILDER   │  │ SCENARIO ENGINE                │   │
│  │                        │  │ [Upgrade to Institutional →]   │   │
│  │ Your indicators:       │  │                                │   │
│  │ • GDP Weight: 30%      │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │ • Employment: 25%      │  │ ░░ Projection tools locked ░░ │   │
│  │ • Health: 20%          │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │ • Education: 25%       │  │                                │   │
│  │                        │  │                                │   │
│  │ [Run Analysis] ✓       │  │                                │   │
│  └────────────────────────┘  └────────────────────────────────┘   │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**What's visible but locked:**
- Scenario engine visible but locked
- Team sharing shows "Institutional only"
- API write access locked
- Custom webhooks beyond 100 locked

## 4.3 Paywall UI Patterns

### The Soft Block

```tsx
interface SoftBlockProps {
  feature: string;
  requiredTier: 'observer' | 'analyst' | 'institutional';
  preview?: ReactNode;  // Show a glimpse of what they'd get
}

const SoftBlock: React.FC<SoftBlockProps> = ({ feature, requiredTier, preview }) => (
  <div className="soft-block">
    {preview && (
      <div className="preview-container opacity-50 pointer-events-none">
        {preview}
      </div>
    )}
    
    <div className="overlay absolute inset-0 bg-gradient-to-t from-background/95 to-transparent">
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {feature} requires {tierNames[requiredTier]}
        </p>
        <Button variant="outline" size="sm">
          Upgrade to unlock
        </Button>
      </div>
    </div>
  </div>
);
```

### The Counter Block

```tsx
// Shows usage against limit
const CounterBlock: React.FC<{ used: number; limit: number; feature: string }> = ({
  used,
  limit,
  feature,
}) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span>{used}/{limit} {feature}</span>
    {used >= limit && (
      <Badge variant="secondary">
        <Link href="/upgrade">Upgrade for more</Link>
      </Badge>
    )}
  </div>
);
```

### The Preview Tease

```tsx
// Shows partial data with "See more" locked
const PreviewTease: React.FC<{ data: any[]; visibleCount: number; totalCount: number }> = ({
  data,
  visibleCount,
  totalCount,
}) => (
  <div>
    {data.slice(0, visibleCount).map(item => (
      <DataRow key={item.id} data={item} />
    ))}
    
    {totalCount > visibleCount && (
      <div className="border-t pt-4 text-center">
        <p className="text-muted-foreground mb-2">
          +{totalCount - visibleCount} more data points
        </p>
        <Button variant="ghost" size="sm">
          Unlock full dataset →
        </Button>
      </div>
    )}
  </div>
);
```

## 4.4 Engagement Hooks

### The "Almost There" State

When a user is close to a limit:

```tsx
// Shows when 80%+ of limit used
const AlmostThereNotice: React.FC = () => (
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>You're using 4 of 5 alerts</AlertTitle>
    <AlertDescription>
      Upgrade to Analyst for unlimited alerts and real-time notifications.
    </AlertDescription>
  </Alert>
);
```

### The "You Could Do This" Hint

```tsx
// Appears when user views data that could be compared
const ComparisonHint: React.FC<{ currentJurisdiction: string }> = ({ currentJurisdiction }) => (
  <Card className="bg-muted/30 border-dashed">
    <CardContent className="py-4">
      <p className="text-sm text-muted-foreground">
        💡 Compare {currentJurisdiction} with similar economies
      </p>
      <div className="flex gap-2 mt-2">
        {['Norway', 'Denmark', 'Finland'].map(country => (
          <Badge key={country} variant="outline" className="opacity-50">
            {country}
          </Badge>
        ))}
        <Badge variant="secondary">+ 50 more</Badge>
      </div>
      <Button variant="link" size="sm" className="mt-2 p-0">
        Unlock comparisons →
      </Button>
    </CardContent>
  </Card>
);
```

### The Saved Query Reminder

```tsx
// When user views same data multiple times
const SaveQueryPrompt: React.FC = () => (
  <div className="fixed bottom-4 right-4 bg-card shadow-lg rounded-lg p-4 max-w-sm">
    <p className="font-medium">You've viewed this 3 times</p>
    <p className="text-sm text-muted-foreground mt-1">
      Set up an alert to get notified when it changes.
    </p>
    <div className="flex gap-2 mt-3">
      <Button size="sm">Create alert</Button>
      <Button size="sm" variant="ghost">Dismiss</Button>
    </div>
  </div>
);
```

## 4.5 Zero Dead-Ends Implementation

Every displayed value must be explorable:

```tsx
interface ExplainableValueProps {
  value: number;
  unit: string;
  indicator: IndicatorDefinition;
  source: SourceAuthority;
}

const ExplainableValue: React.FC<ExplainableValueProps> = ({
  value,
  unit,
  indicator,
  source,
}) => {
  const [depth, setDepth] = useState(0);
  
  return (
    <div className="explainable-value">
      {/* Level 0: The value */}
      <button 
        onClick={() => setDepth(1)}
        className="text-2xl font-bold hover:underline cursor-help"
      >
        {formatValue(value, unit)}
      </button>
      
      {depth >= 1 && (
        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
          {/* Level 1: Plain language explanation */}
          <p className="text-sm">{indicator.plain_language_description}</p>
          <button 
            onClick={() => setDepth(2)}
            className="text-xs text-primary hover:underline mt-2"
          >
            How is this measured? →
          </button>
        </div>
      )}
      
      {depth >= 2 && (
        <div className="mt-2 p-3 bg-muted/30 rounded-lg">
          {/* Level 2: Methodology */}
          <p className="text-sm">{indicator.methodology_summary}</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>Collection: {indicator.collection_method}</li>
            <li>Frequency: {indicator.update_frequency}</li>
            <li>Coverage: {indicator.geographic_coverage}</li>
          </ul>
          <button 
            onClick={() => setDepth(3)}
            className="text-xs text-primary hover:underline mt-2"
          >
            View source & limitations →
          </button>
        </div>
      )}
      
      {depth >= 3 && (
        <div className="mt-2 p-3 border rounded-lg">
          {/* Level 3: Source and limitations */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{source.organization_name}</Badge>
            <span className="text-xs text-muted-foreground">
              Updated: {formatDate(source.last_update)}
            </span>
          </div>
          
          <div className="text-sm">
            <strong>What this shows:</strong>
            <p className="text-muted-foreground">{indicator.what_this_shows}</p>
          </div>
          
          <div className="text-sm mt-2">
            <strong>What this does NOT show:</strong>
            <ul className="text-muted-foreground list-disc list-inside">
              {indicator.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" asChild>
              <a href={source.methodology_url} target="_blank">
                Full methodology
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`/lineage/${indicator.id}`}>
                View data lineage
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

# PART V: IMMUTABILITY & VERSIONING

## 5.1 Core Principle

```
┌────────────────────────────────────────────────────────────────────┐
│                     IMMUTABILITY RULES                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Data is NEVER modified                                          │
│     → Only new versions are created                                 │
│                                                                     │
│  2. Versions are NEVER deleted                                      │
│     → Only marked as superseded                                     │
│                                                                     │
│  3. History is ALWAYS preserved                                     │
│     → Complete audit trail from creation                            │
│                                                                     │
│  4. Checksums are ALWAYS verified                                   │
│     → Tamper detection at every level                               │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 5.2 Version Chain

```typescript
interface VersionChain {
  object_id: GlobalHash;              // Current version ID (content hash)
  slug: string;                       // Stable URL identifier
  
  // Version info
  version: SemanticVersion;           // v1.2.3
  created_at: ISO8601;
  
  // Chain links
  previous_version: GlobalHash | null;
  next_version: GlobalHash | null;    // Populated when superseded
  
  // Status
  status: 'current' | 'superseded' | 'retracted';
  superseded_at: ISO8601 | null;
  superseded_reason: SupersessionReason | null;
  
  // Integrity
  checksum: SHA256;
  merkle_root: SHA256;                // For batch verification
  signature: Ed25519Signature | null; // Optional cryptographic signing
}

type SupersessionReason =
  | 'new_data'            // Updated measurement
  | 'methodology_change'  // Same data, different calculation
  | 'correction'          // Error fix
  | 'source_revision'     // Source revised their data
  | 'merge'               // Combined with other object
  | 'split';              // Split into multiple objects
```

## 5.3 Merkle Tree Structure

```
                    [Root Hash]
                    /          \
            [Branch 1]        [Branch 2]
            /        \        /        \
        [Leaf 1]  [Leaf 2]  [Leaf 3]  [Leaf 4]
            |         |         |         |
         Object    Object    Object    Object
         v1.0      v1.1      v1.2      v1.3
```

```typescript
interface MerkleProof {
  leaf_hash: SHA256;                  // Hash of the object
  leaf_index: number;                 // Position in tree
  sibling_hashes: SHA256[];           // Path to root
  root_hash: SHA256;                  // Root of Merkle tree
  tree_size: number;                  // Total objects in tree
  
  // Verification
  timestamp: ISO8601;
  verifier: URL;                      // Public verification endpoint
}

// Verification function
function verifyMerkleProof(proof: MerkleProof, object: UniversalIndexObject): boolean {
  let hash = computeLeafHash(object);
  
  for (const siblingHash of proof.sibling_hashes) {
    hash = computeParentHash(hash, siblingHash, proof.leaf_index);
  }
  
  return hash === proof.root_hash;
}
```

---

# PART VI: WHY THIS IS IMPOSSIBLE TO COPY

## 6.1 Moat Analysis

```
┌────────────────────────────────────────────────────────────────────┐
│                    COMPETITIVE MOAT LAYERS                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  LAYER 1: RELATIONSHIP CAPITAL                                      │
│  • Source partnerships take 12-24 months each                       │
│  • Methodology negotiations are one-time                            │
│  • Authority trust accumulates over years                           │
│  Time to replicate: 3-5 years                                       │
│                                                                     │
│  LAYER 2: HISTORICAL DEPTH                                          │
│  • Past versions cannot be recreated                                │
│  • Data lineage is cumulative                                       │
│  • Methodology changes are temporal events                          │
│  Time to replicate: Never (impossible for past)                     │
│                                                                     │
│  LAYER 3: NETWORK EFFECTS                                           │
│  • More citations → higher authority                                │
│  • More users → more feedback → better quality                      │
│  • More integrations → higher switching cost                        │
│  Time to replicate: Exponentially harder with our growth            │
│                                                                     │
│  LAYER 4: NEUTRAL POSITION                                          │
│  • First-mover as infrastructure, not competitor                    │
│  • State/corporate backing would taint alternatives                 │
│  • Independence is the product                                      │
│  Time to replicate: Impossible (position is taken)                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 6.2 What a Competitor Would Need

```typescript
interface CompetitorRequirements {
  // Technical
  build_object_model: {
    effort: 'medium';
    time: '3-6 months';
    replicable: true;
  };
  
  // Data
  collect_sources: {
    effort: 'massive';
    time: '2-4 years';
    replicable: 'partially';  // Current data yes, history no
  };
  
  // Relationships
  negotiate_partnerships: {
    effort: 'enormous';
    time: '3-5 years';
    replicable: true;  // But we already have them
  };
  
  // Trust
  establish_neutrality: {
    effort: 'impossible if backed by interested party';
    time: '5-10 years';
    replicable: 'questionable';
  };
  
  // History
  recreate_past_versions: {
    effort: 'infinite';
    time: 'never';
    replicable: false;  // Past is gone
  };
  
  // Network
  match_citations: {
    effort: 'dependent on our failure';
    time: 'unknown';
    replicable: 'only if we fail';
  };
}

// Total assessment
const REPLICATION_FEASIBILITY = {
  by_startup: 'extremely_difficult',
  by_big_tech: 'possible_but_suspicious',  // Would be seen as capture
  by_government: 'possible_but_tainted',   // Would lose neutrality
  by_ngo: 'possible_but_slow',             // Best competitor profile
  
  conclusion: 'Viable competition requires 5+ years and neutral positioning',
};
```

---

# PART VII: SUMMARY CHECKLIST

## Implementation Priority

```
PHASE 1 (Months 1-3): CORE OBJECT MODEL
□ Universal Index Object schema finalized
□ Relationship types implemented
□ Immutability/versioning working
□ 10 pilot indicators indexed
□ 3 jurisdictions covered (SE, NO, DK)

PHASE 2 (Months 4-6): API & VERIFICATION
□ REST API v1 live
□ GraphQL optional
□ Verification endpoints
□ Merkle proofs
□ Public audit log

PHASE 3 (Months 7-9): FRONTEND & TIERS
□ Public view (no auth)
□ Observer tier (free account)
□ Analyst tier (paid)
□ Soft blocks implemented
□ Zero dead-ends audit passed

PHASE 4 (Months 10-12): SCALE & PREMIUM
□ 100 indicators
□ 25 jurisdictions
□ Lambda index live
□ Institutional tier
□ Enterprise API
□ First paying customers
```

---

**END OF UNIVERSAL INDEX OBJECT SPECIFICATION**

*This document defines the atomic structure upon which all of GROS is built. Every design decision flows from these foundational principles.*
