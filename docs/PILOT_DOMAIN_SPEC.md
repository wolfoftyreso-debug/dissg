# 💰 PILOT DOMAIN SPECIFICATION

## Price / Cost / Market Index

**Version**: 1.0  
**Status**: Canonical  
**Domain**: `price`  
**Launch Target**: 30-60 days

---

## WHY PRICE IS THE OPTIMAL STARTING DOMAIN

```
┌────────────────────────────────────────────────────────────────────┐
│                    DOMAIN SELECTION CRITERIA                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  REQUIREMENT              PRICE DOMAIN SCORE                        │
│  ───────────              ──────────────────                        │
│                                                                     │
│  1. High data density         ████████████ 95%                      │
│     → Prices exist for everything, everywhere                       │
│                                                                     │
│  2. Many sources              ████████████ 90%                      │
│     → Official stats + private APIs + scraping                      │
│                                                                     │
│  3. Clear jurisdictions       ████████████ 95%                      │
│     → Tax, currency, regulation = jurisdiction-bound                │
│                                                                     │
│  4. Visible time change       ████████████ 100%                     │
│     → Daily updates, immediate visibility                           │
│                                                                     │
│  5. Immediate value           ████████████ 95%                      │
│     → Everyone cares about prices                                   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  OVERALL FIT: 95%                                                   │
│  RECOMMENDATION: OPTIMAL STARTING DOMAIN                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## PART I: STRATEGIC RATIONALE

### 1.1 Price Connects Everything

```typescript
const PRICE_CONNECTIONS = {
  // Price touches all societal domains
  domains_connected: {
    health: 'Healthcare costs, medicine prices, insurance',
    housing: 'Rent, mortgage rates, construction costs',
    energy: 'Electricity, fuel, heating',
    food: 'Groceries, restaurants, agriculture',
    transport: 'Fuel, tickets, vehicle costs',
    labor: 'Wages, employment costs',
    finance: 'Interest rates, currency, investments',
    government: 'Taxes, subsidies, fees',
  },
  
  // This means...
  implication: `
    Starting with price means your relation engine 
    immediately connects to EVERY other domain.
    
    When you later add health, it already links to price.
    When you later add housing, it already links to price.
    
    Price is the connective tissue of the economy.
    Build price first = build connections first.
  `,
};
```

### 1.2 Price Has Natural Relations

```typescript
const PRICE_RELATIONS = {
  // Price depends on...
  upstream: {
    taxation: 'VAT, excise duties, carbon tax',
    subsidies: 'Agricultural, energy, housing',
    legislation: 'Price controls, minimum wage',
    currency: 'Exchange rates, inflation targeting',
    energy: 'Production costs, transport costs',
    geopolitics: 'Trade wars, sanctions, supply chains',
    weather: 'Agricultural yields, energy demand',
  },
  
  // Price affects...
  downstream: {
    consumption: 'Purchasing behavior',
    inflation: 'CPI, purchasing power',
    inequality: 'Cost burden distribution',
    business: 'Margins, viability',
    policy: 'Intervention decisions',
  },
  
  // This means...
  implication: `
    Your relation engine starts working immediately.
    Every price index naturally links to 5-10 other indices.
    The knowledge graph builds itself.
  `,
};
```

### 1.3 Price Is Time-Sensitive

```typescript
const PRICE_TEMPORALITY = {
  update_frequencies: {
    real_time: ['Stock prices', 'Currency', 'Commodities'],
    daily: ['Fuel prices', 'Electricity spot'],
    weekly: ['Grocery baskets'],
    monthly: ['CPI', 'Rent indices'],
    quarterly: ['Housing prices'],
    annual: ['Tax rates', 'Regulated prices'],
  },
  
  // This means...
  implication: `
    Your frontend is ALIVE from day 1.
    Users see changes immediately.
    Time-series visualization has real data.
    Version history is meaningful.
  `,
};
```

### 1.4 Price Is Politically "Safe"

```typescript
const PRICE_SAFETY = {
  // You do NOT...
  you_do_not: [
    'Set prices',
    'Recommend purchases',
    'Compare vendors normatively',
    'Advise on financial decisions',
    'Take political positions',
  ],
  
  // You DO...
  you_do: [
    'Index published prices',
    'Show price over time',
    'Show price across geography',
    'Show price relationships',
    'Cite original sources',
  ],
  
  // This means...
  implication: `
    No one can accuse you of market manipulation.
    No one can accuse you of political bias.
    You're just showing what things cost.
    
    Perfect for building trust before tackling
    more sensitive domains (crime, health, governance).
  `,
};
```

### 1.5 Price Is AI Gold

```typescript
const PRICE_AI_VALUE = {
  // AI can immediately...
  ai_capabilities: {
    compare: 'Price X in Stockholm vs Malmö over 5 years',
    correlate: 'Electricity price vs industrial output',
    simulate: 'If carbon tax increases 20%, what happens to transport costs?',
    explain: 'Why did food prices spike in Q2 2022?',
    verify: 'Is it true that Sweden has the highest electricity prices in EU?',
  },
  
  // This means...
  implication: `
    Your LLM integration becomes concrete, not theoretical.
    Users can ask real questions and get real answers.
    The "AI reasons, Index knows" architecture proves itself.
  `,
};
```

---

## PART II: PILOT SCOPE DEFINITION

### 2.1 Geographic Scope

```typescript
const PILOT_GEOGRAPHY = {
  // Primary market
  primary: {
    country: 'SE',
    name: 'Sweden',
    nuts_level: 'NUTS0',
    full_coverage: true,
  },
  
  // Regional depth
  regions: [
    {
      code: 'SE110',
      name: 'Stockholm',
      nuts_level: 'NUTS3',
      rationale: 'Capital, highest prices, most data',
    },
    {
      code: 'SE224',
      name: 'Malmö',
      nuts_level: 'NUTS3',
      rationale: 'Southern hub, different price dynamics',
    },
    {
      code: 'SE232',
      name: 'Gothenburg',
      nuts_level: 'NUTS3',
      rationale: 'Western hub, industrial focus',
    },
  ],
  
  // Comparison markets
  comparison: [
    {
      country: 'NO',
      name: 'Norway',
      rationale: 'Neighboring, different currency, oil economy',
    },
    {
      country: 'DK',
      name: 'Denmark',
      rationale: 'Neighboring, EU member, similar structure',
    },
    {
      country: 'FI',
      name: 'Finland',
      rationale: 'Nordic, EU member, different energy mix',
    },
  ],
  
  // Total geographic objects
  total_jurisdictions: 7, // SE + 3 regions + 3 countries
};
```

### 2.2 Category Scope

```typescript
const PILOT_CATEGORIES = {
  // Category 1: Daily Goods
  daily_goods: {
    code: 'GOODS_DAILY',
    name: 'Dagligvaror',
    indices: [
      { code: 'BASKET_GROCERY', name: 'Matkorg (standard)', items: 50 },
      { code: 'MILK_LITER', name: 'Mjölk (liter)', unit: 'SEK' },
      { code: 'BREAD_LOAF', name: 'Bröd (limpa)', unit: 'SEK' },
      { code: 'EGGS_DOZEN', name: 'Ägg (12-pack)', unit: 'SEK' },
      { code: 'MEAT_BEEF_KG', name: 'Nötkött (kg)', unit: 'SEK' },
      { code: 'VEGETABLES_BASKET', name: 'Grönsakskorg', unit: 'SEK' },
    ],
  },
  
  // Category 2: Energy
  energy: {
    code: 'ENERGY',
    name: 'Energi',
    indices: [
      { code: 'ELEC_SPOT_SE1', name: 'El spotpris SE1', unit: 'öre/kWh' },
      { code: 'ELEC_SPOT_SE2', name: 'El spotpris SE2', unit: 'öre/kWh' },
      { code: 'ELEC_SPOT_SE3', name: 'El spotpris SE3', unit: 'öre/kWh' },
      { code: 'ELEC_SPOT_SE4', name: 'El spotpris SE4', unit: 'öre/kWh' },
      { code: 'ELEC_CONSUMER', name: 'El konsumentpris (snitt)', unit: 'öre/kWh' },
      { code: 'GAS_PETROL_95', name: 'Bensin 95', unit: 'SEK/liter' },
      { code: 'GAS_DIESEL', name: 'Diesel', unit: 'SEK/liter' },
      { code: 'HEAT_DISTRICT', name: 'Fjärrvärme', unit: 'öre/kWh' },
    ],
  },
  
  // Category 3: Housing
  housing: {
    code: 'HOUSING',
    name: 'Boende',
    indices: [
      { code: 'RENT_APT_2R', name: 'Hyra 2 rum', unit: 'SEK/månad' },
      { code: 'RENT_APT_3R', name: 'Hyra 3 rum', unit: 'SEK/månad' },
      { code: 'MORTGAGE_RATE', name: 'Bolåneränta (snitt)', unit: '%' },
      { code: 'HOUSE_PRICE_SQM', name: 'Bostadspris (kr/kvm)', unit: 'SEK' },
      { code: 'CONSTRUCTION_INDEX', name: 'Byggkostnadsindex', unit: 'index' },
    ],
  },
  
  // Category 4: Services
  services: {
    code: 'SERVICES',
    name: 'Tjänster',
    indices: [
      { code: 'TRANSPORT_MONTHLY', name: 'Månadskort kollektivtrafik', unit: 'SEK' },
      { code: 'INTERNET_FIBER', name: 'Fiber (100 Mbit)', unit: 'SEK/månad' },
      { code: 'MOBILE_PLAN', name: 'Mobilabonnemang (standard)', unit: 'SEK/månad' },
      { code: 'CHILDCARE_FEE', name: 'Förskola (maxavgift)', unit: 'SEK/månad' },
      { code: 'GYM_MEMBERSHIP', name: 'Gym (standard)', unit: 'SEK/månad' },
    ],
  },
  
  // Category 5: Macro Indices
  macro: {
    code: 'MACRO',
    name: 'Makroindex',
    indices: [
      { code: 'CPI_TOTAL', name: 'KPI (total)', unit: 'index' },
      { code: 'CPI_FOOD', name: 'KPI Livsmedel', unit: 'index' },
      { code: 'CPI_HOUSING', name: 'KPI Boende', unit: 'index' },
      { code: 'CPI_TRANSPORT', name: 'KPI Transport', unit: 'index' },
      { code: 'CPI_ENERGY', name: 'KPI Energi', unit: 'index' },
      { code: 'INFLATION_YOY', name: 'Inflation (årstakt)', unit: '%' },
      { code: 'REPO_RATE', name: 'Reporänta', unit: '%' },
      { code: 'EUR_SEK', name: 'EUR/SEK', unit: 'SEK' },
      { code: 'USD_SEK', name: 'USD/SEK', unit: 'SEK' },
    ],
  },
};
```

### 2.3 Total Pilot Scope

```
┌────────────────────────────────────────────────────────────────────┐
│                    PILOT SCOPE SUMMARY                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GEOGRAPHY:                                                         │
│  ───────────                                                        │
│  • 1 Primary country (Sweden)                                       │
│  • 3 Regions (Stockholm, Malmö, Gothenburg)                         │
│  • 3 Comparison countries (Norway, Denmark, Finland)                │
│  • Total: 7 jurisdictions                                           │
│                                                                     │
│  CATEGORIES:                                                        │
│  ────────────                                                       │
│  • Daily goods: ~6 indices                                          │
│  • Energy: ~8 indices                                               │
│  • Housing: ~5 indices                                              │
│  • Services: ~5 indices                                             │
│  • Macro: ~9 indices                                                │
│  • Total: ~33 base indices                                          │
│                                                                     │
│  TOTAL INDEX OBJECTS:                                               │
│  ─────────────────────                                              │
│  • 33 indices × 7 jurisdictions = ~230 geo-specific objects         │
│  • Plus time versions (monthly for 2 years) = ~5,500 versions       │
│  • Plus relations (~5 per object) = ~27,500 relation edges          │
│                                                                     │
│  INITIAL PILOT:                                                     │
│  ───────────────                                                    │
│  • Sweden only: 33 × 4 (national + 3 regions) = 132 objects         │
│  • With 24 months history = ~3,168 time versions                    │
│  • This is the MVP target                                           │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  MVP TARGET: ~130 INDEX OBJECTS WITH 24 MONTHS HISTORY              │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## PART III: EXAMPLE INDEX OBJECT

### 3.1 Complete Example: Electricity Price SE3

```typescript
const EXAMPLE_INDEX: IndexObject = {
  // Core identity
  id: {
    global_hash: 'ix_a7f3b2c1d4e5f6789012345678901234',
    semantic_id: 'price.energy.electricity.spot.se3',
    url_slug: 'el-spotpris-se3',
    version: 47,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  
  // Human-readable
  display: {
    name_sv: 'Elpris spotmarknad SE3',
    name_en: 'Electricity spot price SE3',
    description_sv: 'Spotpris för el i elområde SE3 (Stockholm/Mälardalen)',
    description_en: 'Spot price for electricity in bidding zone SE3',
  },
  
  // Current value
  value: {
    amount: 0.89,
    unit: 'SEK/kWh',
    observed_at: '2024-01-15T07:00:00Z',
    observation_type: 'mechanical_reading',
  },
  
  // Jurisdiction
  jurisdiction: {
    primary: {
      country: 'SE',
      region: 'SE3',
      region_name: 'Stockholm/Mälardalen',
    },
    applies_to: 'Consumers and businesses in SE3 bidding zone',
    legal_basis: 'Nord Pool market rules',
  },
  
  // Source attribution
  attribution: {
    primary_source: {
      authority: 'Nord Pool',
      authority_type: 'market_operator',
      url: 'https://www.nordpoolgroup.com/',
      api_endpoint: 'https://api.nordpoolgroup.com/v1/prices/SE3',
    },
    secondary_sources: [
      {
        authority: 'Energimyndigheten',
        role: 'regulatory_oversight',
        url: 'https://www.energimyndigheten.se/',
      },
      {
        authority: 'SCB',
        role: 'statistical_aggregation',
        url: 'https://www.scb.se/',
      },
    ],
    collection_method: 'api_direct',
    collection_frequency: 'hourly',
  },
  
  // Confidence
  confidence: {
    score: 0.98,
    level: 'very_high',
    factors: {
      source_reliability: 0.99,
      methodology_clarity: 0.98,
      data_freshness: 1.00,
      cross_validation: 0.95,
    },
    limitations: [
      'Spot price only - excludes network fees and taxes',
      'Hourly average - not real-time',
    ],
  },
  
  // Time dimension
  temporal: {
    period_type: 'hourly',
    valid_from: '2024-01-15T07:00:00Z',
    valid_to: '2024-01-15T08:00:00Z',
    history_available_from: '2011-11-01T00:00:00Z',
    update_frequency: 'hourly',
    next_update_expected: '2024-01-15T09:00:00Z',
  },
  
  // Relations
  relations: [
    {
      type: 'component_of',
      target_id: 'ix_consumer_electricity_total_se3',
      strength: 0.4, // Spot is ~40% of consumer price
      description: 'Spotpris utgör ca 40% av konsumentpriset',
    },
    {
      type: 'influenced_by',
      target_id: 'ix_weather_temperature_se3',
      strength: 0.3,
      lag_days: 0,
      description: 'Temperatur påverkar efterfrågan',
    },
    {
      type: 'influenced_by',
      target_id: 'ix_hydro_reservoir_level_se',
      strength: 0.5,
      lag_days: 0,
      description: 'Vattenkraftsmagasin påverkar utbud',
    },
    {
      type: 'influenced_by',
      target_id: 'ix_wind_production_se',
      strength: 0.3,
      lag_days: 0,
      description: 'Vindkraftsproduktion påverkar utbud',
    },
    {
      type: 'compared_with',
      target_id: 'ix_price_electricity_spot_se1',
      description: 'Jämförelse med elområde SE1',
    },
    {
      type: 'compared_with',
      target_id: 'ix_price_electricity_spot_no1',
      description: 'Jämförelse med Norge',
    },
  ],
  
  // Versioning
  versioning: {
    current_version: 47,
    previous_hash: 'ix_a7f3b2c1d4e5f6789012345678901233',
    change_type: 'value_update',
    change_reason: 'Hourly price update from Nord Pool',
  },
};
```

### 3.2 What This Single Object Demonstrates

```
┌────────────────────────────────────────────────────────────────────┐
│                    ONE OBJECT = ENTIRE SYSTEM                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  THIS SINGLE ELECTRICITY PRICE OBJECT DEMONSTRATES:                 │
│                                                                     │
│  ✓ DATA ARCHITECTURE                                                │
│    → Global hash, semantic ID, versioning                           │
│                                                                     │
│  ✓ JURISDICTION BINDING                                             │
│    → Geographic scope, legal basis                                  │
│                                                                     │
│  ✓ FULL ATTRIBUTION                                                 │
│    → Primary source, secondary sources, collection method           │
│                                                                     │
│  ✓ MECHANICAL CONFIDENCE                                            │
│    → Multi-factor scoring, explicit limitations                     │
│                                                                     │
│  ✓ TIME DIMENSION                                                   │
│    → Period type, history, update frequency                         │
│                                                                     │
│  ✓ RELATION ENGINE                                                  │
│    → Component_of, influenced_by, compared_with                     │
│    → Quantified strength, time lag                                  │
│                                                                     │
│  ✓ IMMUTABLE HISTORY                                                │
│    → Version chain, change tracking                                 │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  ONE INDEX OBJECT = PROOF OF ENTIRE ARCHITECTURE                    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## PART IV: DATA SOURCES FOR PILOT

### 4.1 Primary Sources

```typescript
const PILOT_SOURCES = {
  // Official statistics
  official: [
    {
      code: 'SCB',
      name: 'Statistiska Centralbyrån',
      country: 'SE',
      categories: ['CPI', 'Housing', 'Construction'],
      api: 'https://api.scb.se/',
      frequency: 'monthly',
      reliability: 0.99,
    },
    {
      code: 'NORDPOOL',
      name: 'Nord Pool',
      region: 'Nordics',
      categories: ['Electricity spot'],
      api: 'https://www.nordpoolgroup.com/api/',
      frequency: 'hourly',
      reliability: 0.99,
    },
    {
      code: 'RIKSBANK',
      name: 'Sveriges Riksbank',
      country: 'SE',
      categories: ['Interest rates', 'Currency'],
      api: 'https://www.riksbank.se/api/',
      frequency: 'daily',
      reliability: 0.99,
    },
    {
      code: 'ENERGIMYNDIGHETEN',
      name: 'Energimyndigheten',
      country: 'SE',
      categories: ['Energy prices', 'Fuel'],
      url: 'https://www.energimyndigheten.se/',
      frequency: 'weekly',
      reliability: 0.98,
    },
  ],
  
  // Market data
  market: [
    {
      code: 'PRICERUNNER',
      name: 'PriceRunner (Prisjakt)',
      region: 'Nordics',
      categories: ['Consumer goods'],
      api: 'Internal/Partner',
      frequency: 'real-time',
      reliability: 0.95,
    },
    {
      code: 'HEMNET',
      name: 'Hemnet',
      country: 'SE',
      categories: ['Housing prices'],
      api: 'Partner/Scrape',
      frequency: 'daily',
      reliability: 0.95,
    },
  ],
  
  // Aggregators
  aggregators: [
    {
      code: 'EUROSTAT',
      name: 'Eurostat',
      region: 'EU',
      categories: ['HICP', 'Housing', 'Energy'],
      api: 'https://ec.europa.eu/eurostat/api/',
      frequency: 'monthly',
      reliability: 0.98,
      use_for: 'Cross-country comparison',
    },
  ],
};
```

### 4.2 Source Priority Matrix

```
┌────────────────────────────────────────────────────────────────────┐
│                    SOURCE PRIORITY MATRIX                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CATEGORY         PRIMARY           SECONDARY         VALIDATION    │
│  ────────         ───────           ─────────         ──────────    │
│                                                                     │
│  CPI/Inflation    SCB               Eurostat          Riksbank      │
│  Electricity      Nord Pool         Energimynd.       SCB           │
│  Fuel             Energimynd.       Circle K/OKQ8     SCB           │
│  Housing prices   SCB               Hemnet            Valueguard    │
│  Rent             SCB               Hyresgästfören.   Bolagsverket  │
│  Interest rates   Riksbank          SCB               ECB           │
│  Currency         Riksbank          ECB               Bloomberg     │
│  Consumer goods   PriceRunner       MatHem            SCB           │
│  Services         SCB               Sector orgs       Municipal     │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  RULE: Primary source defines value.                                │
│        Secondary sources validate.                                  │
│        Discrepancies flagged, not resolved.                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## PART V: RELATION MAPPING

### 5.1 Price Relation Types

```typescript
const PRICE_RELATIONS = {
  // Compositional
  compositional: {
    component_of: 'This price is part of a larger price',
    composed_of: 'This price contains sub-components',
    example: 'Spot electricity is component_of consumer electricity price',
  },
  
  // Causal (with caveats)
  causal: {
    influenced_by: 'This factor affects this price',
    influences: 'This price affects this outcome',
    attributes: ['strength', 'lag_days', 'confidence'],
    caveat: 'Correlation observed, causation claimed by source',
  },
  
  // Comparative
  comparative: {
    compared_with: 'Same metric, different geography',
    alternative_to: 'Substitute goods/services',
    example: 'SE3 electricity compared_with NO1 electricity',
  },
  
  // Temporal
  temporal: {
    supersedes: 'This version replaces previous',
    historical: 'Historical series available',
  },
  
  // Regulatory
  regulatory: {
    regulated_by: 'This authority controls this price',
    taxed_by: 'Tax component applied by',
    subsidized_by: 'Subsidy applied by',
  },
};
```

### 5.2 Example Relation Graph

```
┌────────────────────────────────────────────────────────────────────┐
│                    ELECTRICITY PRICE RELATIONS                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        ┌─────────────────┐                          │
│                        │  Consumer       │                          │
│                        │  Electricity    │                          │
│                        │  Price SE3      │                          │
│                        └────────┬────────┘                          │
│                                 │                                   │
│           ┌─────────────────────┼─────────────────────┐             │
│           │                     │                     │             │
│           ▼                     ▼                     ▼             │
│   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     │
│   │  Spot Price   │     │  Network Fee  │     │  Energy Tax   │     │
│   │  (40%)        │     │  (35%)        │     │  (25%)        │     │
│   └───────┬───────┘     └───────────────┘     └───────────────┘     │
│           │                                                         │
│     ┌─────┴─────┬─────────────┬─────────────┐                       │
│     │           │             │             │                       │
│     ▼           ▼             ▼             ▼                       │
│ ┌────────┐ ┌────────┐   ┌────────┐   ┌────────┐                     │
│ │ Hydro  │ │ Wind   │   │ Demand │   │ Import │                     │
│ │ Level  │ │ Prod.  │   │ (Temp) │   │ Cables │                     │
│ └────────┘ └────────┘   └────────┘   └────────┘                     │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  LATERAL RELATIONS:                                                 │
│                                                                     │
│  Spot SE3 ←─compared_with─→ Spot SE1                                │
│  Spot SE3 ←─compared_with─→ Spot NO1                                │
│  Spot SE3 ←─compared_with─→ Spot DK1                                │
│                                                                     │
│  REGULATORY RELATIONS:                                              │
│                                                                     │
│  Energy Tax ←─regulated_by─→ Swedish Parliament                     │
│  Network Fee ←─regulated_by─→ Energimarknadsinspektionen             │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## PART VI: 30-60 DAY DELIVERABLES

### 6.1 Week 1-2: Infrastructure

```typescript
const WEEK_1_2 = {
  deliverables: [
    'Database schema for index objects',
    'Ingestion pipeline for 3 sources (SCB, Nord Pool, Riksbank)',
    'Basic API endpoints (read-only)',
    'Admin interface for monitoring',
  ],
  success_criteria: [
    'Can ingest and store 10 index objects',
    'Can retrieve by ID and semantic path',
    'Version history working',
  ],
};
```

### 6.2 Week 3-4: Data Population

```typescript
const WEEK_3_4 = {
  deliverables: [
    'All 33 base indices defined',
    '4 jurisdictions populated (SE national + 3 regions)',
    '24 months history for each index',
    'Basic relation mapping (5 relations per index)',
  ],
  success_criteria: [
    '~130 index objects in database',
    '~3,000 time versions',
    '~650 relation edges',
  ],
};
```

### 6.3 Week 5-6: Frontend MVP

```typescript
const WEEK_5_6 = {
  deliverables: [
    'Public read-only frontend',
    'Index detail pages with full attribution',
    'Time series visualization',
    'Relation graph visualization',
    'Search functionality',
    'Schema.org markup for SEO',
  ],
  success_criteria: [
    'Every index has public URL',
    'Google can crawl and index',
    'Mobile responsive',
    'TTFB < 100ms',
  ],
};
```

### 6.4 Week 7-8: Polish & Launch

```typescript
const WEEK_7_8 = {
  deliverables: [
    'LLM query interface (basic)',
    'Comparison view (geography)',
    'API documentation',
    'Press materials',
    'Beta user onboarding',
  ],
  success_criteria: [
    'Can answer "What is the electricity price in Stockholm?"',
    'Can compare Sweden vs Norway on 3 indices',
    'External users can query API',
    'Indexed by Google',
  ],
};
```

---

## PART VII: SUCCESS METRICS

```typescript
const SUCCESS_METRICS = {
  // Technical
  technical: {
    uptime: '99.9%',
    api_latency_p50: '<50ms',
    api_latency_p99: '<200ms',
    data_freshness: 'Within update frequency of source',
  },
  
  // Content
  content: {
    index_objects: '>100',
    time_versions: '>3,000',
    relation_edges: '>500',
    sources_integrated: '>5',
  },
  
  // Adoption
  adoption: {
    google_indexed_pages: '>100',
    api_consumers: '>10 (beta)',
    journalist_citations: '>3',
    academic_references: '>1',
  },
  
  // Validation
  validation: {
    data_accuracy: '>99% match with source',
    attribution_completeness: '100%',
    confidence_calibration: 'Within 5% of actual',
  },
};
```

---

## NEXT STEP

```
┌────────────────────────────────────────────────────────────────────┐
│                    READY FOR STEP 9                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PILOT DOMAIN: DEFINED ✓                                            │
│  • Price / Cost / Market Index                                      │
│  • Sweden + 3 regions + 3 comparison countries                      │
│  • 33 base indices                                                  │
│  • ~130 initial index objects                                       │
│                                                                     │
│  NEXT:                                                              │
│  ═════                                                              │
│                                                                     │
│  STEP 9 – THE FIRST 100 INDEX OBJECTS                               │
│                                                                     │
│  Exact list:                                                        │
│  • Object ID                                                        │
│  • Name (SV/EN)                                                     │
│  • Exact source                                                     │
│  • Exact API endpoint                                               │
│  • Exact jurisdiction                                               │
│  • Update frequency                                                 │
│  • Initial relations                                                │
│                                                                     │
│  This is the engineering specification.                             │
│  No philosophy. Just code.                                          │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

**END OF PILOT DOMAIN SPECIFICATION**

*"Start with price. Connect everything. Prove the system. Scale to the world."*
