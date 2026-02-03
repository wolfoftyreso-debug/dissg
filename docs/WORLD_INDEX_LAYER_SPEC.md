# 🌍 WORLD INDEX LAYER SPECIFICATION

## Global Neutral Infrastructure for Verified Data

**Version**: 1.0  
**Status**: Canonical  
**Classification**: Infrastructure-as-Truth

---

## EXECUTIVE SUMMARY

This is not a platform. Not a database. Not a search engine.

**This is a Global Index Layer** — an infrastructure that lies *between* raw data sources and all systems that consume them.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONSUMERS                                 │
│   Google │ LLMs │ Governments │ Markets │ Media │ Researchers   │
└────────────────────────────┬────────────────────────────────────┘
                             │ READ
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              🌍 WORLD INDEX LAYER (GROS)                        │
│                                                                  │
│  • Semantic relationships between data                           │
│  • Cross-jurisdictional mappings                                 │
│  • Temporal versioning                                           │
│  • Confidence scoring                                            │
│  • Source authority chains                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ INDEX
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAW SOURCES                                 │
│   NSOs │ Eurostat │ WHO │ Central Banks │ Price APIs │ Legal DBs│
└─────────────────────────────────────────────────────────────────┘
```

**Key distinction:**
- Sources own data
- We own the *relationships* between data
- Consumers see *how everything connects*

---

# PART I: INDEX OBJECT MODEL

## 1. Core Entity: `IndexObject`

Every piece of indexed reality is represented as an `IndexObject`:

```typescript
interface IndexObject {
  // Identity
  id: UUID;                          // Permanent, never changes
  slug: string;                       // Human-readable URL path
  type: IndexObjectType;              // 'indicator' | 'entity' | 'event' | 'regulation' | 'method'
  
  // Semantic Classification
  domain: DomainCode[];               // ['health', 'economy', 'labor']
  category: CategoryCode;             // 'mortality_rate' | 'gdp_measure' | etc.
  tags: SemanticTag[];                // Machine-readable classifications
  
  // Source Authority
  source: SourceReference;            // Primary source
  secondary_sources: SourceReference[]; // Corroborating sources
  authority_chain: AuthorityNode[];   // Who → Who → Raw Data
  
  // Temporal Properties
  valid_from: ISO8601;                // When this version became true
  valid_to: ISO8601 | null;           // When this version expired (null = current)
  observation_lag: Duration;          // Typical delay from reality → publication
  update_frequency: Frequency;        // How often source updates
  
  // Jurisdictional Scope
  jurisdiction: JurisdictionReference; // Where this applies
  geo_coverage: GeoCoverage;          // Actual geographic scope
  
  // Confidence & Quality
  confidence: ConfidenceScore;        // 0.0 - 1.0
  uncertainty_range: UncertaintyBand; // Statistical bounds
  methodology_version: string;        // Track methodology changes
  
  // Content
  value: IndexValue;                  // The actual data
  metadata: IndexMetadata;            // Extended properties
  
  // Relationships
  relations: IndexRelation[];         // Links to other objects
  
  // Verification
  checksum: SHA256;                   // Content integrity
  lineage_id: UUID;                   // Link to full data lineage
}
```

## 2. Value Types

```typescript
type IndexValue = 
  | NumericValue      // 42.5 ± 0.3
  | CategoricalValue  // 'active' | 'suspended' | 'repealed'
  | RangeValue        // [10, 25]
  | CompositeValue    // { unemployment: 5.2, inflation: 2.1 }
  | TimeSeriesValue   // Array of temporal points
  | BooleanValue      // true/false with confidence
  | TextValue;        // Controlled vocabulary only

interface NumericValue {
  type: 'numeric';
  value: number;
  unit: UnitCode;                     // Standardized unit (ISO/custom)
  precision: number;                  // Decimal places that are meaningful
  uncertainty: UncertaintyBand | null;
  is_estimate: boolean;
  estimation_method: string | null;
}

interface UncertaintyBand {
  lower: number;
  upper: number;
  confidence_level: number;           // 0.95 = 95% CI
  method: 'statistical' | 'expert' | 'model' | 'unknown';
}
```

## 3. Source Authority Chain

Every data point traces back through an authority chain:

```typescript
interface SourceReference {
  source_id: UUID;
  source_type: SourceType;            // 'nso' | 'international_org' | 'central_bank' | 'research' | 'commercial'
  organization: OrganizationReference;
  
  // Access
  access_url: URL;
  access_date: ISO8601;
  access_method: 'api' | 'scrape' | 'manual' | 'feed';
  
  // Reliability
  reliability_score: number;          // Historical accuracy
  timeliness_score: number;           // Punctuality of updates
  coverage_score: number;             // Completeness
  
  // Legal
  license: LicenseType;
  attribution_required: boolean;
  commercial_use_allowed: boolean;
}

interface AuthorityNode {
  level: number;                      // 0 = raw source, higher = more aggregated
  organization: OrganizationReference;
  role: 'collector' | 'aggregator' | 'harmonizer' | 'publisher';
  transformation: TransformationType | null;
  methodology_url: URL | null;
}
```

## 4. Relationship Model

Objects connect through typed relationships:

```typescript
interface IndexRelation {
  relation_type: RelationType;
  target_id: UUID;
  target_type: IndexObjectType;
  
  // Relationship Properties
  strength: number | null;            // For correlations: -1.0 to 1.0
  confidence: number;                 // How sure we are about this relationship
  valid_from: ISO8601;
  valid_to: ISO8601 | null;
  
  // Provenance
  source: 'computed' | 'declared' | 'inferred';
  computation_method: string | null;
}

type RelationType =
  // Hierarchical
  | 'parent_of'           // GDP → GDP_per_capita
  | 'child_of'
  | 'component_of'        // CPI = weighted sum of components
  | 'aggregates'
  
  // Temporal
  | 'replaces'            // New methodology replaces old
  | 'replaced_by'
  | 'precedes'            // Event sequence
  | 'follows'
  
  // Causal (careful!)
  | 'correlates_with'     // Statistical correlation only
  | 'co_moves_with'       // Temporal alignment
  | 'leads'               // Leading indicator
  | 'lags'                // Lagging indicator
  
  // Jurisdictional
  | 'applies_to'          // Regulation → jurisdiction
  | 'supersedes'          // EU law → national law
  | 'harmonized_with'     // Cross-border equivalence
  
  // Semantic
  | 'equivalent_to'       // Different name, same concept
  | 'similar_to'          // Related concept
  | 'opposite_of'         // Inverse relationship
  | 'influences'          // Theoretical/model-based link
  | 'measured_by';        // Concept → indicator
```

---

# PART II: JURISDICTION ABSTRACTION

## 1. The Jurisdiction Problem

Real-world data exists in overlapping, conflicting, and hierarchical jurisdictions:

```
World
├── EU (supranational)
│   ├── Eurozone (monetary union)
│   ├── Schengen (border union)
│   └── Member States
│       ├── Sweden
│       │   ├── Regions (Län)
│       │   │   ├── Municipalities (Kommun)
│       │   │   └── Districts
│       │   └── Functional Regions
│       └── Germany
│           ├── Länder
│           └── Kreise
├── OECD (economic cooperation)
├── NATO (military alliance)
└── UN Member States
    └── etc.
```

**Problems:**
- Same indicator, different definitions across jurisdictions
- Overlapping authority (EU vs national law)
- Temporal changes (new EU member, border changes)
- Functional vs administrative geography

## 2. Jurisdiction Model

```typescript
interface Jurisdiction {
  id: UUID;
  code: JurisdictionCode;             // 'SE', 'EU', 'SE-AB', 'NUTS:SE110'
  
  // Type Classification
  type: JurisdictionType;
  level: JurisdictionLevel;
  
  // Identity
  name: LocalizedString;
  official_name: LocalizedString;
  iso_codes: ISOCodes;
  
  // Hierarchy
  parent_id: UUID | null;
  children_ids: UUID[];
  
  // Temporal
  valid_from: ISO8601;
  valid_to: ISO8601 | null;
  predecessor_id: UUID | null;        // For border changes
  successor_ids: UUID[];
  
  // Geographic
  geometry: GeoJSON | null;           // Boundary polygon
  centroid: GeoPoint | null;
  area_km2: number | null;
  
  // Properties
  population: PopulationReference | null;
  capital: JurisdictionReference | null;
  
  // Authority Domains
  authority_domains: AuthorityDomain[]; // What this jurisdiction controls
  
  // Memberships
  memberships: JurisdictionMembership[];
}

type JurisdictionType =
  | 'sovereign_state'
  | 'supranational'       // EU
  | 'subnational'         // Region, state, province
  | 'municipal'           // City, commune
  | 'special_zone'        // SEZ, tax haven
  | 'treaty_area'         // Schengen, Eurozone
  | 'statistical_region'  // NUTS, LAU
  | 'functional_region';  // Metro area, labor market

type JurisdictionLevel = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = Global
// 1 = Supranational / Continental
// 2 = National
// 3 = Regional (NUTS 1-2)
// 4 = Local (NUTS 3, LAU)
// 5 = Micro (District, neighborhood)
```

## 3. Authority Domains

Each jurisdiction has authority over specific domains:

```typescript
interface AuthorityDomain {
  domain: DomainCode;
  authority_type: AuthorityType;
  constraints: AuthorityConstraint[];
}

type AuthorityType =
  | 'exclusive'           // Only this jurisdiction
  | 'shared'              // With parent/other
  | 'delegated'           // From parent
  | 'advisory'            // Recommendations only
  | 'observer';           // No authority, just data

interface AuthorityConstraint {
  constraint_type: 'temporal' | 'territorial' | 'subject_matter' | 'treaty';
  description: string;
  reference: LegalReference | null;
}
```

## 4. Cross-Jurisdiction Mapping

When comparing across jurisdictions:

```typescript
interface JurisdictionMapping {
  source_jurisdiction: JurisdictionReference;
  target_jurisdiction: JurisdictionReference;
  
  indicator_code: IndicatorCode;
  
  // Comparability Assessment
  comparability_level: ComparabilityLevel;
  comparability_score: number;          // 0.0 - 1.0
  
  // Differences
  definition_difference: DifferenceDescription | null;
  methodology_difference: DifferenceDescription | null;
  coverage_difference: DifferenceDescription | null;
  temporal_difference: DifferenceDescription | null;
  
  // Harmonization
  harmonization_possible: boolean;
  harmonization_method: HarmonizationMethod | null;
  harmonized_indicator_id: UUID | null;
  
  // Warnings
  comparison_warnings: ComparisonWarning[];
}

type ComparabilityLevel =
  | 'identical'           // Same definition, method, coverage
  | 'harmonized'          // Officially aligned (e.g., EU harmonized)
  | 'comparable'          // Similar enough for comparison
  | 'limited'             // Compare with significant caveats
  | 'incomparable';       // Do not compare

interface ComparisonWarning {
  severity: 'info' | 'warning' | 'error';
  code: WarningCode;
  message: LocalizedString;
  technical_detail: string;
}
```

## 5. Temporal Jurisdiction Changes

Handle historical changes:

```typescript
interface JurisdictionChange {
  id: UUID;
  change_type: JurisdictionChangeType;
  effective_date: ISO8601;
  
  // Before
  before_jurisdictions: JurisdictionReference[];
  
  // After
  after_jurisdictions: JurisdictionReference[];
  
  // Mapping
  population_transfer: PopulationTransfer[];
  territory_transfer: TerritoryTransfer[];
  data_continuity: DataContinuityAssessment;
  
  // Source
  legal_basis: LegalReference | null;
}

type JurisdictionChangeType =
  | 'creation'            // New jurisdiction
  | 'dissolution'         // Jurisdiction ends
  | 'merger'              // Multiple → one
  | 'split'               // One → multiple
  | 'border_change'       // Territory transfer
  | 'status_change'       // Type changes (colony → state)
  | 'name_change';        // Just rename
```

---

# PART III: SCHEMA.ORG / JSON-LD IMPLEMENTATION

## 1. Why Google Will Love This

Google's knowledge systems need:
- **Stability**: URLs that don't change
- **Semantics**: Structured data they can parse
- **Authority**: Clear source attribution
- **Freshness**: Timestamps and versioning

We provide all four in a format optimized for crawling and caching.

## 2. Core JSON-LD Patterns

### Statistical Observation

```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "gros": "https://gros.world/schema/",
    "sdmx": "http://purl.org/linked-data/sdmx#"
  },
  "@type": "Observation",
  "@id": "https://gros.world/data/SE/unemployment-rate/2024-Q1",
  
  "name": "Unemployment Rate - Sweden - Q1 2024",
  "description": "Seasonally adjusted unemployment rate for Sweden, Q1 2024",
  
  "observedNode": {
    "@type": "Place",
    "@id": "https://gros.world/jurisdiction/SE",
    "name": "Sweden",
    "identifier": "SE"
  },
  
  "measuredProperty": {
    "@type": "PropertyValue",
    "@id": "https://gros.world/indicator/unemployment-rate",
    "name": "Unemployment Rate",
    "propertyID": "gros:unemployment-rate"
  },
  
  "measuredValue": {
    "@type": "QuantitativeValue",
    "value": 7.4,
    "unitCode": "P1",
    "unitText": "percent",
    "minValue": 7.2,
    "maxValue": 7.6,
    "gros:confidenceLevel": 0.95
  },
  
  "observationDate": "2024-03-31",
  "observationPeriod": "P3M",
  
  "gros:validFrom": "2024-04-15T08:00:00Z",
  "gros:validTo": null,
  "gros:observationLag": "P15D",
  
  "gros:sourceAuthority": {
    "@type": "Organization",
    "@id": "https://gros.world/source/scb",
    "name": "Statistics Sweden",
    "identifier": "SCB"
  },
  
  "gros:methodology": {
    "@type": "CreativeWork",
    "@id": "https://gros.world/method/ilo-unemployment",
    "name": "ILO Unemployment Definition",
    "version": "2013"
  },
  
  "gros:confidence": 0.95,
  "gros:dataQuality": "official",
  "gros:isPreliminary": false,
  
  "gros:lineage": "https://gros.world/lineage/SE-unemp-2024Q1-abc123",
  
  "sdmx:unitMeasure": "sdmx-concept:Percentage"
}
```

### Index Aggregate

```json
{
  "@context": "https://gros.world/context/index.jsonld",
  "@type": "gros:IndexAggregate",
  "@id": "https://gros.world/index/lambda/SE/2024-Q1",
  
  "name": "Lambda Index - Sweden - Q1 2024",
  
  "gros:lambdaValue": {
    "@type": "QuantitativeValue",
    "value": 0.94,
    "minValue": 0.91,
    "maxValue": 0.97
  },
  
  "gros:components": [
    {
      "@type": "gros:IndexComponent",
      "name": "Life & Health",
      "weight": 0.20,
      "value": 0.96,
      "contributing_indicators": 12
    },
    {
      "@type": "gros:IndexComponent",
      "name": "Livelihood & Work",
      "weight": 0.20,
      "value": 0.89,
      "contributing_indicators": 15
    }
  ],
  
  "gros:decomposable": true,
  "gros:reverseToRawData": true,
  
  "gros:methodologyVersion": "lambda-v2.1",
  "gros:lastUpdated": "2024-04-15T08:00:00Z"
}
```

### Jurisdiction

```json
{
  "@context": "https://gros.world/context/jurisdiction.jsonld",
  "@type": ["AdministrativeArea", "gros:Jurisdiction"],
  "@id": "https://gros.world/jurisdiction/SE",
  
  "name": "Sweden",
  "alternateName": ["Sverige", "Kingdom of Sweden"],
  
  "identifier": [
    {"@type": "PropertyValue", "propertyID": "ISO-3166-1-alpha-2", "value": "SE"},
    {"@type": "PropertyValue", "propertyID": "ISO-3166-1-alpha-3", "value": "SWE"},
    {"@type": "PropertyValue", "propertyID": "ISO-3166-1-numeric", "value": "752"}
  ],
  
  "gros:jurisdictionType": "sovereign_state",
  "gros:jurisdictionLevel": 2,
  
  "containedInPlace": {
    "@type": "gros:Jurisdiction",
    "@id": "https://gros.world/jurisdiction/EU",
    "name": "European Union"
  },
  
  "containsPlace": [
    {"@id": "https://gros.world/jurisdiction/SE-AB"},
    {"@id": "https://gros.world/jurisdiction/SE-C"}
  ],
  
  "gros:memberships": [
    {"organization": "EU", "since": "1995-01-01"},
    {"organization": "OECD", "since": "1961-09-28"},
    {"organization": "UN", "since": "1946-11-19"}
  ],
  
  "gros:authorityDomains": [
    {"domain": "fiscal", "type": "exclusive"},
    {"domain": "monetary", "type": "delegated", "to": "EU/ECB"},
    {"domain": "statistics", "type": "shared", "with": "Eurostat"}
  ]
}
```

---

# PART IV: MULTI-CLOUD ARCHITECTURE

## 1. Design Principles

```
┌────────────────────────────────────────────────────────────────────┐
│                    TRUST THROUGH DISTRIBUTION                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  • No single point of control                                       │
│  • No single point of failure                                       │
│  • No ability to silently modify                                    │
│  • Anyone can verify, no one can corrupt                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 2. Architecture Overview

```
                        ┌─────────────────┐
                        │   WRITE LAYER   │
                        │   (Controlled)  │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
     │    GCP      │    │    AWS      │    │   Azure     │
     │             │    │             │    │             │
     │  • Primary  │    │  • Replica  │    │  • Replica  │
     │  • EU       │    │  • US       │    │  • APAC     │
     └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                        ┌──────┴──────┐
                        │  READ LAYER │
                        │   (Open)    │
                        └─────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │ Google  │           │ AI/LLM  │           │ Public  │
   │ Crawlers│           │ Systems │           │ Users   │
   └─────────┘           └─────────┘           └─────────┘
```

## 3. Data Layer Properties

```typescript
interface DataLayerConfig {
  // Immutability
  write_mode: 'append_only';          // Never overwrite
  deletion_policy: 'mark_invalid';    // Never delete, mark as superseded
  
  // Versioning
  version_every_change: true;
  retain_all_versions: true;
  version_checksum: 'sha256';
  
  // Replication
  replication_factor: 3;              // Minimum copies
  geographic_distribution: ['EU', 'US', 'APAC'];
  sync_mode: 'eventual_consistent';   // Prioritize availability
  max_sync_lag: 'PT5M';               // 5 minute max lag
  
  // Verification
  merkle_tree: true;                  // Tamper detection
  public_audit_log: true;
  cryptographic_proofs: true;
}
```

## 4. Verification Protocol

Anyone can verify data integrity:

```typescript
interface VerificationEndpoint {
  // Check single object
  verify_object(id: UUID): VerificationResult;
  
  // Check object history
  verify_lineage(id: UUID): LineageVerification;
  
  // Compare across replicas
  verify_consistency(id: UUID, replicas: CloudProvider[]): ConsistencyResult;
  
  // Audit time range
  audit_period(from: ISO8601, to: ISO8601): AuditReport;
}

interface VerificationResult {
  object_id: UUID;
  checksum_valid: boolean;
  lineage_intact: boolean;
  replicas_consistent: boolean;
  last_verified: ISO8601;
  verification_proof: MerkleProof;
}
```

---

# PART V: ACCESS MODEL — OPEN STRUCTURE, PREMIUM DEPTH

## 1. The Core Principle

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   OPEN: Index, Metadata, History, Relationships, Verification      │
│                                                                     │
│   PREMIUM: Computation, Projection, Export, Composition, API-Write │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Why this works:**
- Everyone can SEE the truth → builds trust
- Few can BUILD on it → creates value
- Even fewer can PREDICT with it → justifies price

## 2. Tier Structure

### Tier 0: Public (No auth)
```yaml
access:
  - Browse all index objects
  - View current values
  - View 2-year history
  - View metadata and sources
  - View methodology descriptions
  - JSON-LD structured data
  - Basic search

limitations:
  - No export
  - No API access
  - No alerts
  - No custom views
  - No projections
  - Graphs are view-only (no interaction)
  
rate_limit: 100 requests/hour (by IP)
```

### Tier 1: Observer (Free, authenticated)
```yaml
access:
  - Everything in Tier 0
  - 10-year history
  - Save favorite indicators
  - Basic alerts (email, max 5)
  - Limited export (CSV, max 100 rows)
  
limitations:
  - No API access
  - No custom dashboards
  - No cross-jurisdiction analysis
  - No projections

rate_limit: 1000 requests/day
```

### Tier 2: Analyst (€99-299/month)
```yaml
access:
  - Everything in Tier 1
  - Full history (all available data)
  - API read access
  - Unlimited export (CSV, JSON, Excel)
  - Custom dashboards (up to 10)
  - Cross-jurisdiction comparisons
  - Correlation explorer
  - Custom alerts (up to 100)
  - Scenario builder (limited)
  
limitations:
  - No write API
  - No white-label
  - No team features
  - Projections marked as "analyst tier"

rate_limit: 10,000 requests/day
api_complexity_limit: medium
```

### Tier 3: Institutional (€2,000-20,000/month)
```yaml
access:
  - Everything in Tier 2
  - Full API access (read + some write)
  - Team accounts (up to 50)
  - White-label embeds
  - Custom index composition
  - Advanced scenario engine
  - Priority data updates
  - Dedicated support
  - Custom integrations
  - Audit-ready exports
  - SLA guarantees

rate_limit: unlimited (fair use)
api_complexity_limit: unlimited
data_freshness: real-time push
```

## 3. Demo Psychology

The demo must create desire without giving satisfaction:

```
┌────────────────────────────────────────────────────────────────────┐
│                         DEMO EXPERIENCE                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  VISIBLE (creates desire):                                          │
│  • All indicators and their current values                         │
│  • All relationships and connections                                │
│  • Historical trends (visible but not exportable)                   │
│  • Comparison tool (shows 3 countries, then "unlock for more")     │
│  • Scenario engine preview (shows interface, grayed out controls)  │
│                                                                     │
│  LOCKED (creates urgency):                                          │
│  • Export button (shows "Export requires Analyst tier")            │
│  • API docs visible but "Get API key" requires auth                │
│  • Historical data beyond 2 years (shows count: "892 more points") │
│  • Interactive graphs (hover shows values, click shows paywall)    │
│  • Alert setup (can configure, then "Activate with Observer tier") │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART VI: INVESTOR & STATE NARRATIVE

## 1. The One-Sentence Pitch

> **"We are building the index layer that Google, governments, and AI will use as the global source of verified reality."**

## 2. Why Now (Market Timing)

```
CONVERGENCE OF FOUR FORCES:

1. AI Grounding Crisis
   - LLMs hallucinate
   - No authoritative fact source
   - Liability concerns growing
   → Need: Verified, citable knowledge infrastructure

2. Post-Truth Fatigue
   - Public exhausted by competing claims
   - Institutions losing credibility
   - Rising demand for neutral reference
   → Need: Non-partisan, verifiable truth layer

3. Data Fragmentation Peak
   - 300+ national statistical offices
   - Incompatible definitions
   - No cross-border comparability
   → Need: Universal harmonization layer

4. Technology Enablement
   - Cloud costs at historic lows
   - Semantic web standards mature
   - Real-time APIs everywhere
   → Capability: Global index now technically possible
```

## 3. Competitive Moat

```
WHY THIS CANNOT BE COPIED:

1. Relationship Capital
   - Source relationships take years to build
   - Methodology negotiations are one-time
   - Historical reconciliation is non-repeatable

2. Historical Continuity
   - Data lineage cannot be reconstructed
   - Versioning history is cumulative
   - Trust accrues over time

3. Network Effects
   - More citations → more authority
   - More users → more feedback → better quality
   - More integrations → higher switching cost

4. Neutral Position
   - First-mover as neutral infrastructure
   - Later entrants perceived as competitors
   - State backing would taint alternatives
```

## 4. Exit Scenarios

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXIT PATHS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PATH A: Infrastructure Acquisition                                  │
│  • Google, Microsoft, or AI lab acquires for grounding              │
│  • Valuation: 10-50x ARR based on strategic value                   │
│  • Timeline: 3-5 years post market dominance                        │
│                                                                      │
│  PATH B: Sovereign Endowment                                         │
│  • Consortium of states creates foundation                           │
│  • Guarantees neutrality and perpetual operation                    │
│  • Founders compensated + board seats                                │
│  • Timeline: 5-7 years, requires proven track record                │
│                                                                      │
│  PATH C: Public Utility Status                                       │
│  • Designated essential infrastructure                               │
│  • Regulated monopoly with guaranteed revenue                       │
│  • Similar to credit rating agencies                                 │
│  • Timeline: 7-10 years, requires regulatory evolution              │
│                                                                      │
│  PATH D: Permanent Independence                                      │
│  • Self-sustaining through commercial tiers                         │
│  • Endowment model (like Wikipedia + Bloomberg)                     │
│  • Profit for shareholders, mission for public                      │
│  • Timeline: Perpetual                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Why States Cannot Ignore This

```
THE COST OF NON-PARTICIPATION:

For Governments:
• Other countries' data becomes the reference
• Lose narrative control to foreign index
• Citizens trust external source over national stats
• Policy debates anchored in external framework

For Central Banks:
• Market participants use different reality
• Policy transmission weakened
• Credibility gap widens

For Institutions:
• Excluded from global comparisons
• Appear opaque/unreliable
• Talent and capital flow to indexed regions

PARTICIPATION IS NOT ENDORSEMENT:
• Index reflects published data, not policy
• Criticism lands on policy, not platform
• Transparency is a signal of confidence
```

## 6. The Ask

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INVESTMENT ASK                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SEED: €2-5M                                                         │
│  • Core team (12 people)                                             │
│  • Index architecture                                                │
│  • First 20 jurisdictions                                           │
│  • Proof of concept with 3 major sources                            │
│                                                                      │
│  SERIES A: €15-25M                                                   │
│  • Scale to 50+ jurisdictions                                       │
│  • Full API infrastructure                                          │
│  • Enterprise sales team                                            │
│  • AI integration partnerships                                      │
│                                                                      │
│  SERIES B: €50-100M                                                  │
│  • Global coverage (200+ jurisdictions)                             │
│  • Real-time capabilities                                           │
│  • Regulatory partnerships                                          │
│  • Become de facto standard                                         │
│                                                                      │
│  USE OF FUNDS:                                                       │
│  • 40% Engineering & Infrastructure                                  │
│  • 25% Data partnerships & integration                              │
│  • 20% Go-to-market & sales                                         │
│  • 15% Operations & governance                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PART VII: TECHNICAL APPENDICES

## Appendix A: Unit Standardization

All units follow ISO standards or explicit custom definitions:

```typescript
type UnitCode = 
  | ISO4217Currency      // 'SEK', 'EUR', 'USD'
  | ISO8601Duration      // 'P1Y', 'P1M', 'P1D'
  | SIUnit               // 'm', 'kg', 's'
  | CustomUnit;          // 'persons', 'households', 'incidents'

interface UnitDefinition {
  code: UnitCode;
  name: LocalizedString;
  symbol: string;
  dimension: Dimension;
  conversion_to_si: ConversionFormula | null;
}
```

## Appendix B: Confidence Scoring

```typescript
interface ConfidenceScore {
  overall: number;                    // 0.0 - 1.0
  
  components: {
    source_reliability: number;       // Historical accuracy of source
    methodology_quality: number;      // Rigor of collection method
    coverage_completeness: number;    // Geographic/temporal coverage
    timeliness: number;               // How current
    consistency: number;              // Agreement across sources
  };
  
  flags: ConfidenceFlag[];
}

type ConfidenceFlag =
  | 'preliminary_data'
  | 'methodology_change'
  | 'coverage_gap'
  | 'source_revision'
  | 'interpolated'
  | 'estimated'
  | 'contested';
```

## Appendix C: API Rate Limiting

```typescript
interface RateLimitPolicy {
  tier: AccessTier;
  
  limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
    concurrent_connections: number;
  };
  
  complexity_budget: {
    max_per_request: number;
    max_per_day: number;
  };
  
  burst_allowance: {
    max_burst: number;
    recovery_rate: number;
  };
}
```

## Appendix D: Webhook Events

```typescript
type WebhookEvent =
  | 'data.updated'
  | 'data.revised'
  | 'methodology.changed'
  | 'source.added'
  | 'source.deprecated'
  | 'jurisdiction.changed'
  | 'alert.triggered'
  | 'index.recalculated';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: ISO8601;
  object_id: UUID;
  object_type: IndexObjectType;
  change_summary: string;
  previous_checksum: SHA256;
  new_checksum: SHA256;
  details_url: URL;
}
```

---

# PART VIII: IMPLEMENTATION ROADMAP

## Phase 1: Foundation (Months 1-6)
```
• Core index object model
• 5 pilot jurisdictions (SE, NO, DK, FI, EU)
• 50 key indicators
• Basic API (read-only)
• JSON-LD output
• Verification endpoint
```

## Phase 2: Expansion (Months 7-12)
```
• 25 jurisdictions
• 200 indicators
• Cross-jurisdiction mappings
• Lambda index (beta)
• Observer tier launch
• First institutional customers
```

## Phase 3: Scale (Months 13-24)
```
• 100 jurisdictions
• 500 indicators
• Full API suite
• Analyst tier launch
• AI integration partnerships
• Multi-cloud deployment
```

## Phase 4: Dominance (Months 25-36)
```
• 200+ jurisdictions
• 1000+ indicators
• Real-time updates
• Institutional tier mature
• De facto standard status
• Self-sustaining revenue
```

---

**END OF WORLD INDEX LAYER SPECIFICATION**

*This document defines the technical, commercial, and strategic foundation for building the global index layer that will become the source of verified reality for machines and humans alike.*
