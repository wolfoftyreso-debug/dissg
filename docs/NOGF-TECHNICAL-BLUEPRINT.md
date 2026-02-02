# NOGF Technical Blueprint
## Complete API Specification & Data Flow Architecture

**Version:** 2.0  
**Status:** Production Ready  
**Last Updated:** 2026-02-02

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INFINITY ANALYTICS SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   PUBLIC    │  │  ANALYTICS  │  │    FEEDS    │  │    ADMIN    │        │
│  │   LAYER     │  │   ENGINE    │  │   SERVICE   │  │   CONSOLE   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                   │                                         │
│                          ┌────────▼────────┐                               │
│                          │   API GATEWAY   │                               │
│                          │  (Rate Limit,   │                               │
│                          │   Auth, Cache)  │                               │
│                          └────────┬────────┘                               │
│                                   │                                         │
│         ┌─────────────────────────┼─────────────────────────┐              │
│         │                         │                         │              │
│  ┌──────▼──────┐  ┌──────────────▼──────────────┐  ┌───────▼───────┐      │
│  │   QUERY     │  │      SEMANTIC CORE          │  │    SIGNAL     │      │
│  │   ENGINE    │  │  (KPI Dictionary, Geo,      │  │    ENGINE     │      │
│  │             │  │   Demographics, Mapping)    │  │               │      │
│  └──────┬──────┘  └──────────────┬──────────────┘  └───────┬───────┘      │
│         │                         │                         │              │
│         └─────────────────────────┼─────────────────────────┘              │
│                                   │                                         │
│                          ┌────────▼────────┐                               │
│                          │   DATA LAYER    │                               │
│                          │  (PostgreSQL +  │                               │
│                          │   TimescaleDB)  │                               │
│                          └────────┬────────┘                               │
│                                   │                                         │
│         ┌─────────────────────────┼─────────────────────────┐              │
│         │                         │                         │              │
│  ┌──────▼──────┐  ┌──────────────▼──────────────┐  ┌───────▼───────┐      │
│  │   INGEST    │  │      EVENT GRAPH            │  │    NEWS       │      │
│  │   PIPELINE  │  │   (Global Events,           │  │    INGEST     │      │
│  │             │  │    Correlations)            │  │               │      │
│  └──────┬──────┘  └─────────────────────────────┘  └───────┬───────┘      │
│         │                                                   │              │
│         └───────────────────────┬───────────────────────────┘              │
│                                 │                                          │
│                    ┌────────────▼────────────┐                             │
│                    │    EXTERNAL SOURCES     │                             │
│                    │  (1000+ APIs, 200+      │                             │
│                    │   Countries, Real-time) │                             │
│                    └─────────────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Architecture

### 2.1 Ingest Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         INGEST PIPELINE FLOW                              │
└──────────────────────────────────────────────────────────────────────────┘

  EXTERNAL SOURCES                    PROCESSING                    STORAGE
  ════════════════                    ══════════                    ═══════

  ┌─────────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
  │  Eurostat   │────▶│  Fetch  │────▶│Checksum │────▶│  Raw    │
  │  API        │     │         │     │  Check  │     │  Store  │
  └─────────────┘     └─────────┘     └────┬────┘     └────┬────┘
                                           │               │
  ┌─────────────┐     ┌─────────┐     ┌────▼────┐     ┌────▼────┐
  │  World Bank │────▶│  Fetch  │────▶│ Schema  │────▶│ Version │
  │  WDI        │     │         │     │ Detect  │     │   Tag   │
  └─────────────┘     └─────────┘     └────┬────┘     └────┬────┘
                                           │               │
  ┌─────────────┐     ┌─────────┐     ┌────▼────┐     ┌────▼────┐
  │    OECD     │────▶│  Fetch  │────▶│Transform│────▶│Semantic │
  │  SDMX-JSON  │     │         │     │  Apply  │     │  Map    │
  └─────────────┘     └─────────┘     └────┬────┘     └────┬────┘
                                           │               │
  ┌─────────────┐     ┌─────────┐     ┌────▼────┐     ┌────▼────┐
  │    IMF      │────▶│  Fetch  │────▶│Validate │────▶│  Emit   │
  │  DataMapper │     │         │     │  Stats  │     │  Event  │
  └─────────────┘     └─────────┘     └────┬────┘     └────┬────┘
                                           │               │
  ┌─────────────┐     ┌─────────┐     ┌────▼────┐     ┌────▼────┐
  │  National   │────▶│  Fetch  │────▶│Lineage  │────▶│  Store  │
  │  Stats APIs │     │         │     │  Log    │     │  Final  │
  └─────────────┘     └─────────┘     └─────────┘     └─────────┘
```

### 2.2 Query Execution Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         QUERY EXECUTION FLOW                              │
└──────────────────────────────────────────────────────────────────────────┘

  USER REQUEST          PROCESSING           EXECUTION           RESPONSE
  ════════════          ══════════           ═════════           ════════

  ┌─────────────┐
  │  Query DSL  │
  │  Request    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     ┌─────────────┐
  │   Parse &   │────▶│   Safety    │
  │   Validate  │     │   Check     │
  └─────────────┘     └──────┬──────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │   PASSED    │   │   BLOCKED   │
             └──────┬──────┘   └──────┬──────┘
                    │                 │
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │   Build     │   │   Return    │
             │   Query     │   │   Error     │
             │   Plan      │   │   + Reason  │
             └──────┬──────┘   └─────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ▼          ▼          ▼
  ┌───────────┐ ┌───────────┐ ┌───────────┐
  │   Cache   │ │   Join    │ │ Aggregate │
  │   Check   │ │   Tables  │ │   Data    │
  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
        │             │             │
        ▼             ▼             ▼
  ┌───────────────────────────────────────┐
  │          Result Assembly              │
  └───────────────────┬───────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
  ┌───────────┐ ┌───────────┐ ┌───────────┐
  │   Add     │ │   Add     │ │   Add     │
  │ Metadata  │ │ Confidence│ │ Warnings  │
  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
               ┌─────────────┐
               │   Return    │
               │   Response  │
               └─────────────┘
```

### 2.3 Relevance Engine Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      RELEVANCE ENGINE FLOW                                │
└──────────────────────────────────────────────────────────────────────────┘

    SIGNAL COLLECTION                FUSION                    OUTPUT
    ═════════════════                ══════                    ══════

    ┌─────────────────┐
    │   KPI DATA      │
    │  • Value        │──────┐
    │  • Change %     │      │
    │  • Trend        │      │
    │  • Coverage     │      │
    └─────────────────┘      │
                             │
    ┌─────────────────┐      │      ┌─────────────────┐
    │   EVENT GRAPH   │      │      │                 │
    │  • Severity     │──────┼─────▶│   MULTI-SIGNAL  │
    │  • Recency      │      │      │     FUSION      │
    │  • Connections  │      │      │                 │
    └─────────────────┘      │      │  Weighted       │
                             │      │  Combination    │
    ┌─────────────────┐      │      │                 │
    │   NEWS VOLUME   │      │      │  Signal scores: │
    │  • Articles/24h │──────┼─────▶│  • Impact: 20%  │
    │  • Acceleration │      │      │  • Accel: 15%   │
    │  • Diversity    │      │      │  • Breadth: 12% │
    └─────────────────┘      │      │  • Persist: 10% │
                             │      │  • Conf: 8%     │
    ┌─────────────────┐      │      │  • Events: 15%  │
    │   USER BEHAVIOR │      │      │  • News: 13%    │
    │  • Views        │──────┼─────▶│  • User: 5%     │
    │  • Saves        │      │      │  • Search: 2%   │
    │  • Shares       │      │      │                 │
    └─────────────────┘      │      └────────┬────────┘
                             │               │
    ┌─────────────────┐      │               ▼
    │   SEARCH TREND  │      │      ┌─────────────────┐
    │  • Volume       │──────┘      │   TIER ASSIGN   │
    │  • Trend        │             │                 │
    └─────────────────┘             │  ≥80: Critical  │
                                    │  ≥65: High      │
                                    │  ≥50: Medium    │
                                    │  ≥35: Low       │
                                    │  <35: Background│
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   FRONT PAGE    │
                                    │                 │
                                    │  3 Critical     │
                                    │  7 High         │
                                    │  10 Medium      │
                                    └─────────────────┘
```

---

## 3. Complete API Specification

### 3.1 Base Configuration

```yaml
base_url: https://api.infinityanalytics.io/v1
content_type: application/json
authentication: Bearer token OR API key
rate_limits:
  free: 100 requests/day
  plus: 1000 requests/day
  pro: 10000 requests/day
  enterprise: unlimited
```

### 3.2 Core Endpoints

#### 3.2.1 KPI Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           KPI ENDPOINTS                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET /kpis                         List all available KPIs               │
│  GET /kpis/{kpi_code}              Get KPI definition                    │
│  GET /kpis/{kpi_code}/values       Get KPI values (time series)          │
│  GET /kpis/{kpi_code}/latest       Get latest value                      │
│  GET /kpis/{kpi_code}/trend        Get trend analysis                    │
│  GET /kpis/{kpi_code}/forecast     Get forecast (Pro+)                   │
│  GET /kpis/{kpi_code}/correlations Get correlated KPIs                   │
│  GET /kpis/search                  Search KPIs by keyword                │
│  GET /kpis/categories              List KPI categories                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**GET /kpis/{kpi_code}/values**

Request:
```json
{
  "kpi_code": "unemployment_rate_total",
  "geo_codes": ["SE", "DE", "FR"],
  "period": {
    "start": "2020-01-01",
    "end": "2024-12-31"
  },
  "demographics": {
    "age_group": ["15-24", "25-54"],
    "sex": ["total"]
  },
  "frequency": "monthly",
  "include_metadata": true
}
```

Response:
```json
{
  "kpi": {
    "code": "unemployment_rate_total",
    "name": "Unemployment Rate",
    "unit": "percent",
    "direction": "lower_is_better"
  },
  "data": [
    {
      "geo_code": "SE",
      "geo_name": "Sweden",
      "period": "2024-01",
      "value": 7.4,
      "previous_value": 7.6,
      "change_percent": -2.6,
      "trend": "improving",
      "confidence": 0.95,
      "source": "Eurostat"
    }
  ],
  "metadata": {
    "total_observations": 180,
    "coverage": 0.98,
    "last_updated": "2024-02-01T00:00:00Z",
    "methodology_url": "https://docs.infinityanalytics.io/kpi/unemployment"
  },
  "query_info": {
    "execution_time_ms": 45,
    "cache_hit": true
  }
}
```

#### 3.2.2 Geographic Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        GEOGRAPHIC ENDPOINTS                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET /geo/countries                List all countries                    │
│  GET /geo/countries/{code}         Get country details                   │
│  GET /geo/regions                  List regions (NUTS)                   │
│  GET /geo/regions/{code}           Get region details                    │
│  GET /geo/clusters                 List geographic clusters              │
│  GET /geo/compare                  Compare multiple geos                 │
│  GET /geo/hierarchy/{code}         Get geo hierarchy                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**GET /geo/compare**

Request:
```json
{
  "geo_codes": ["SE", "NO", "DK", "FI"],
  "kpi_codes": ["gdp_per_capita", "unemployment_rate", "life_expectancy"],
  "period": "latest",
  "include_ranking": true,
  "include_eu_average": true
}
```

Response:
```json
{
  "comparison": [
    {
      "geo_code": "NO",
      "geo_name": "Norway",
      "values": {
        "gdp_per_capita": { "value": 89154, "rank": 1, "vs_eu_avg": "+142%" },
        "unemployment_rate": { "value": 3.5, "rank": 2, "vs_eu_avg": "-45%" },
        "life_expectancy": { "value": 83.2, "rank": 1, "vs_eu_avg": "+3.1y" }
      },
      "composite_score": 94.2
    }
  ],
  "eu_averages": {
    "gdp_per_capita": 36850,
    "unemployment_rate": 6.4,
    "life_expectancy": 80.1
  }
}
```

#### 3.2.3 Index Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          INDEX ENDPOINTS                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET /indexes                      List all indexes                      │
│  GET /indexes/{index_id}           Get index definition                  │
│  GET /indexes/{index_id}/values    Get index values                      │
│  GET /indexes/{index_id}/ranking   Get country ranking                   │
│  GET /indexes/{index_id}/pillars   Get pillar breakdown                  │
│  GET /indexes/{index_id}/simulate  Simulate weight changes (Pro+)        │
│  GET /indexes/gmi                  Global Master Index                   │
│  GET /indexes/gmi/components       GMI component analysis                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.4 Query DSL Endpoint

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         QUERY DSL ENDPOINT                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  POST /query                       Execute declarative query             │
│  POST /query/validate              Validate query without executing      │
│  POST /query/explain               Get query execution plan              │
│  GET  /query/history               Get query history (authenticated)     │
│  POST /query/save                  Save query template (Pro+)            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**POST /query**

Request:
```json
{
  "what": {
    "kpis": ["unemployment_rate_total", "gdp_growth_real"],
    "indexes": ["gmi"]
  },
  "where": {
    "geo_codes": ["SE", "DE", "FR", "IT", "ES"],
    "geo_level": "country"
  },
  "when": {
    "start": "2019-01-01",
    "end": "2024-12-31",
    "frequency": "quarterly"
  },
  "who": {
    "age_group": ["25-54"],
    "sex": ["total"]
  },
  "ops": [
    { "operation": "delta_percent", "periods": 4 },
    { "operation": "correlation", "pairs": [["unemployment_rate_total", "gdp_growth_real"]] }
  ],
  "output": {
    "format": "json",
    "include_metadata": true,
    "include_confidence": true,
    "include_sources": true
  }
}
```

Response:
```json
{
  "query_id": "q_abc123",
  "results": {
    "time_series": [],
    "correlations": [
      {
        "kpi_a": "unemployment_rate_total",
        "kpi_b": "gdp_growth_real",
        "coefficient": -0.72,
        "p_value": 0.001,
        "interpretation": "Strong negative correlation",
        "lag_months": 3
      }
    ]
  },
  "metadata": {
    "observations": 240,
    "coverage": 0.95,
    "confidence": 0.88
  },
  "warnings": [],
  "sources": ["Eurostat", "OECD", "National Statistics"],
  "execution": {
    "time_ms": 234,
    "cache_hit": false,
    "complexity_score": 45
  }
}
```

#### 3.2.5 Event Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          EVENT ENDPOINTS                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET /events                       List recent events                    │
│  GET /events/{event_id}            Get event details                     │
│  GET /events/search                Search events                         │
│  GET /events/types                 List event types                      │
│  GET /events/timeline              Event timeline                        │
│  GET /events/by-kpi/{kpi_code}     Events affecting KPI                  │
│  GET /events/by-geo/{geo_code}     Events in geography                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.6 Feed Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          FEED ENDPOINTS                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET  /feeds                       List available feeds                  │
│  GET  /feeds/{feed_id}             Get feed definition                   │
│  GET  /feeds/{feed_id}/events      Get feed events                       │
│  POST /feeds/subscribe             Subscribe to feed (Pro+)              │
│  GET  /feeds/subscriptions         List subscriptions                    │
│  DELETE /feeds/subscriptions/{id}  Unsubscribe                           │
│  GET  /feeds/stream                SSE stream (Enterprise)               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**GET /feeds/stream (Server-Sent Events)**

```
event: kpi_update
data: {"kpi":"unemployment_rate","geo":"SE","value":7.2,"change":-0.2}

event: signal
data: {"type":"threshold_crossed","kpi":"inflation","geo":"DE","severity":"high"}

event: event
data: {"type":"policy.rate_decision","geo":"EU","description":"ECB raises rates"}
```

#### 3.2.7 Search Endpoints

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         SEARCH ENDPOINTS                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GET /search                       Global search                         │
│  GET /search/autocomplete          Autocomplete suggestions              │
│  GET /search/facets                Get search facets                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Models

### 4.1 Core Data Models

```typescript
// KPI Definition
interface KPIDefinition {
  code: string;
  name: string;
  name_local?: Record<string, string>;
  description: string;
  category: string;
  subcategory: string;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better' | 'neutral';
  preferred_sources: string[];
  geo_levels_supported: ('country' | 'nuts1' | 'nuts2' | 'nuts3' | 'municipality')[];
  demographic_dimensions: string[];
  update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  normalization_method: 'z_score' | 'min_max' | 'percentile';
  is_active: boolean;
}

// KPI Value
interface KPIValue {
  id: string;
  kpi_code: string;
  geo_code: string;
  period_start: string;
  period_end: string;
  value: number;
  previous_value?: number;
  status: 'provisional' | 'confirmed' | 'revised';
  trend: 'improving' | 'declining' | 'stable';
  trend_percent?: number;
  confidence: number;
  source_id: string;
  checksum: string;
  revision: number;
}

// Global Event
interface GlobalEvent {
  id: string;
  event_type_id: string;
  occurred_at: string;
  detected_at: string;
  ongoing: boolean;
  geo_codes: string[];
  title: string;
  description: string;
  severity: number; // 1-10
  related_kpis: string[];
  related_events: string[];
  news_volume: {
    last_24h: number;
    last_7d: number;
    sources: number;
  };
  confidence: number;
  verification_status: 'unverified' | 'partially_verified' | 'verified';
}

// Relevance Score
interface RelevanceScore {
  object_id: string;
  object_type: 'kpi' | 'country' | 'region' | 'index' | 'event';
  signal_scores: Record<string, number>;
  total_score: number; // 0-100
  percentile: number;
  tier: 'critical' | 'high' | 'medium' | 'low' | 'background';
  top_factors: {
    signal: string;
    contribution: number;
    explanation: string;
  }[];
}
```

### 4.2 Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE SCHEMA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  kpi_definitions        KPI metadata and configuration           │
│  kpi_values             Time-series KPI data (TimescaleDB)       │
│  kpi_value_revisions    Immutable revision history               │
│                                                                  │
│  countries              Country metadata                         │
│  regions                NUTS region hierarchy                    │
│  geo_clusters           Dynamic geographic clusters              │
│                                                                  │
│  data_sources           External source registry                 │
│  data_lineage           Full data provenance                     │
│                                                                  │
│  global_events          Event graph nodes                        │
│  event_kpi_links        Event-KPI relationships                  │
│                                                                  │
│  observations           AI-generated insights                    │
│  analysis_chains        Deep analysis trees                      │
│                                                                  │
│  indexes                Index definitions                        │
│  index_values           Computed index scores                    │
│                                                                  │
│  feed_definitions       Feed configuration                       │
│  feed_events            Published feed events                    │
│  feed_subscriptions     User subscriptions                       │
│                                                                  │
│  api_keys               API authentication                       │
│  api_usage_log          Usage tracking                           │
│                                                                  │
│  relevance_scores       Calculated relevance (hypertable)        │
│  daily_priority_snapshots  Daily rankings                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                  │
└──────────────────────────────────────────────────────────────────────────┘

  API KEY FLOW                          OAUTH FLOW
  ════════════                          ══════════

  ┌─────────┐                          ┌─────────┐
  │ Request │                          │ Request │
  │ + API   │                          │ Login   │
  │ Key     │                          └────┬────┘
  └────┬────┘                               │
       │                                    ▼
       ▼                              ┌─────────┐
  ┌─────────┐                         │ Auth    │
  │ Validate│                         │ Provider│
  │ Key     │                         └────┬────┘
  └────┬────┘                               │
       │                                    ▼
       ▼                              ┌─────────┐
  ┌─────────┐                         │ Token   │
  │ Check   │                         │ Issued  │
  │ Limits  │                         └────┬────┘
  └────┬────┘                               │
       │                                    ▼
       ▼                              ┌─────────┐
  ┌─────────┐                         │ Request │
  │ Process │                         │ + Token │
  │ Request │                         └────┬────┘
  └─────────┘                               │
                                            ▼
                                      ┌─────────┐
                                      │ Validate│
                                      │ Token   │
                                      └────┬────┘
                                            │
                                            ▼
                                      ┌─────────┐
                                      │ Process │
                                      │ Request │
                                      └─────────┘
```

### 5.2 License Tiers

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         LICENSE TIERS                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TIER        RATE LIMIT    FEATURES                     PRICE           │
│  ────        ──────────    ────────                     ─────           │
│                                                                          │
│  Free        100/day       • Basic KPIs                 €0/mo           │
│                            • 5 years history                             │
│                            • Country level only                          │
│                            • JSON format                                 │
│                                                                          │
│  Plus        1,000/day     • All KPIs                   €49/mo          │
│                            • 20 years history                            │
│                            • NUTS2 regions                               │
│                            • CSV/JSON formats                            │
│                            • Basic alerts                                │
│                                                                          │
│  Pro         10,000/day    • All features               €199/mo         │
│                            • Full history                                │
│                            • All geo levels                              │
│                            • All formats                                 │
│                            • Forecasting                                 │
│                            • Feed subscriptions                          │
│                            • Query templates                             │
│                                                                          │
│  Enterprise  Unlimited     • Everything                 Custom          │
│                            • SSE streams                                 │
│                            • White-label                                 │
│                            • Custom indexes                              │
│                            • SLA guarantee                               │
│                            • Dedicated support                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Error Handling

### 6.1 Error Response Format

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Upgrade to Pro for higher limits.",
    "details": {
      "limit": 100,
      "used": 100,
      "resets_at": "2024-02-01T00:00:00Z"
    },
    "documentation_url": "https://docs.infinityanalytics.io/errors/rate-limit"
  },
  "request_id": "req_xyz789"
}
```

### 6.2 Error Codes

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          ERROR CODES                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CODE                        HTTP    DESCRIPTION                         │
│  ────                        ────    ───────────                         │
│                                                                          │
│  UNAUTHORIZED                401     Invalid or missing API key          │
│  FORBIDDEN                   403     Insufficient permissions            │
│  NOT_FOUND                   404     Resource not found                  │
│  RATE_LIMIT_EXCEEDED         429     Rate limit exceeded                 │
│  INVALID_REQUEST             400     Malformed request                   │
│  INVALID_PARAMETER           400     Invalid parameter value             │
│  QUERY_TOO_COMPLEX           400     Query exceeds complexity limit      │
│  PRIVACY_VIOLATION           403     Query would violate privacy rules   │
│  INSUFFICIENT_DATA           404     Not enough data for operation       │
│  SERVICE_UNAVAILABLE         503     Temporary service issue             │
│  INTERNAL_ERROR              500     Internal server error               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Caching Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CACHING STRATEGY                                   │
└──────────────────────────────────────────────────────────────────────────┘

  LAYER 1: CDN EDGE
  ═════════════════
  • Static responses: 24h
  • KPI latest values: 5 min
  • Index rankings: 1h
  • Geographic data: 24h

  LAYER 2: API GATEWAY (Redis)
  ════════════════════════════
  • Query results: 15 min
  • Search results: 5 min
  • Aggregations: 1h
  • Rate limit counters: 1 min

  LAYER 3: APPLICATION (In-Memory)
  ════════════════════════════════
  • KPI definitions: 24h
  • Geographic hierarchy: 24h
  • User sessions: 30 min

  CACHE INVALIDATION
  ══════════════════
  • On data ingest: Invalidate affected KPIs
  • On event detection: Invalidate related views
  • On schema change: Full invalidation
  • Manual: Admin trigger
```

---

## 8. Security Measures

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       SECURITY MEASURES                                   │
└──────────────────────────────────────────────────────────────────────────┘

  TRANSPORT
  ═════════
  • TLS 1.3 only
  • Certificate pinning for mobile
  • HSTS enabled

  AUTHENTICATION
  ══════════════
  • API keys (hashed, rotatable)
  • OAuth 2.0 + PKCE
  • JWT tokens (RS256)
  • Rate limiting per key

  AUTHORIZATION
  ═════════════
  • Role-based access control
  • Endpoint-level permissions
  • Data-level restrictions
  • Geographic restrictions

  DATA PROTECTION
  ═══════════════
  • Min-N aggregation (n≥5)
  • Demographic combination limits
  • Blocked cross-tabulations
  • Audit logging

  INFRASTRUCTURE
  ══════════════
  • WAF protection
  • DDoS mitigation
  • SOC 2 compliance
  • GDPR compliance
```

---

## 9. Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT ARCHITECTURE                               │
└──────────────────────────────────────────────────────────────────────────┘

                              USERS
                                │
                                ▼
                    ┌───────────────────────┐
                    │      Cloudflare       │
                    │    (CDN + WAF)        │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Load Balancer      │
                    └───────────┬───────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
  │  API Pod 1  │       │  API Pod 2  │       │  API Pod N  │
  │  (K8s)      │       │  (K8s)      │       │  (K8s)      │
  └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
         │                     │                     │
         └──────────────┬──────┴─────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │   Redis     │ │  PostgreSQL │ │   Kafka     │
  │   Cluster   │ │  + Timescale│ │   Cluster   │
  └─────────────┘ └─────────────┘ └─────────────┘

  REGIONS: EU-WEST-1 (Primary), EU-CENTRAL-1 (DR)
```

---

**Document Version:** 2.0  
**Classification:** Internal Technical Reference  
**Maintainer:** Platform Architecture Team
| `scb-fetch` | POST | Hämta SCB-data |
| `kpi-ingest` | POST | Ingest-pipeline |

### Response-struktur

```typescript
interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    version: string;
    cached: boolean;
  };
}
```

---

## 8. UI-logik

### Principer

| Princip | Implementation |
|---------|----------------|
| Stateful navigation | URL reflekterar alltid tillstånd |
| Breadcrumbs | Alltid synlig väg tillbaka |
| Ingen pagination i analyskedja | Hela kedjan laddas |
| Allt klickbart bakåt | Varje nivå är interaktiv |

### UX-regel

> **Användaren ska aldrig tappa kontext.**

### Komponentstruktur

```
src/components/
├── dashboard/
│   ├── OverviewHeader.tsx        # Nationell sammanfattning
│   ├── KPICard.tsx               # Indikator-kort
│   ├── KPIDetailPanel.tsx        # Djupdykning
│   ├── IndicatorsPanel.tsx       # Tabell med alla KPI:er
│   ├── DecisionsTimelinePanel.tsx # Beslut + tidslinje
│   ├── ResponsibilityPanel.tsx   # Departementsvy
│   ├── AnalysisPanel.tsx         # Systemhälsa + korrelationer
│   └── BottomNav.tsx             # Navigation
├── observations/
│   ├── ObservationsPanel.tsx     # Iakttagelselista
│   ├── ObservationCard.tsx       # Enskild iakttagelse
│   └── AnalysisDrillDown.tsx     # 5-nivåsdjup
└── ui/                           # shadcn/ui komponenter
```

---

## 9. Säkerhet & Governance

### Absoluta krav

| Krav | Implementation |
|------|----------------|
| Rollbaserad access | RLS-policies per tabell |
| Full audit-logg | analysis_audit_log |
| Read-separation | Separata policies för read/write |
| Inga personuppgifter | Endast aggregerad data |
| Kryptering i vila | Supabase default encryption |
| Kryptering i transit | TLS 1.3 |

### RLS-strategi

```sql
-- Alla kan läsa (public data)
CREATE POLICY "Public read access" ON kpi_values
  FOR SELECT USING (true);

-- Endast service role kan skriva
CREATE POLICY "Service can insert" ON kpi_values
  FOR INSERT WITH CHECK (true);
```

### Audit-loggning

```sql
CREATE TABLE analysis_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,
  actor           TEXT,
  entity_snapshot JSONB NOT NULL,
  context         JSONB DEFAULT '{}',
  logged_at       TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. Systemkonsekvenser

### Vad detta system gör omöjligt

| Beteende | Varför omöjligt |
|----------|-----------------|
| Beslut utan uppföljning | Alla beslut kopplas till KPI:er |
| Påståenden utan bevis | Spårbarhet till datakälla |
| Oansvar utan synlighet | Ansvarskoppling per indikator |
| "Vi visste inte" | Full audit-logg + observationer |

### Vad detta system gör trivialt

| Kapabilitet | Implementation |
|-------------|----------------|
| Se helheten | 20 KPI:er på en skärm |
| Se trender tidigt | Automatisk trenddetektering |
| Justera smått | Kontinuerlig feedback-loop |
| Följa effekter | Beslut-utfall-koppling |
| Förvalta med ansvar | Synlig ansvarskedja |

---

## 11. Implementeringsstatus

### Befintlig implementation

| Komponent | Status | Tabell/Fil |
|-----------|--------|------------|
| Indicator | ✅ | kpi_definitions |
| TimeSeries | ✅ | kpi_values |
| Observation | ✅ | observations |
| AnalysisChain | ✅ | analysis_chains |
| DataSource | ✅ | data_sources |
| DataLineage | ✅ | data_lineage |
| Decision | ✅ | policy_decisions |
| Timeline | ✅ | decision_timeline |
| Audit | ✅ | analysis_audit_log |

### Edge Functions

| Funktion | Status | Beskrivning |
|----------|--------|-------------|
| kpi-api | ✅ | Read API |
| analyze-kpi | ✅ | Djupanalys |
| kpi-forecast | ✅ | Prognoser |
| kpi-decisions | ✅ | Beslut CRUD |
| prioritize-actions | ✅ | Åtgärdsprioritering |
| scb-fetch | ✅ | SCB-integration |
| kpi-ingest | ✅ | Dataingest |

### UI-komponenter

| Vy | Status | Beskrivning |
|----|--------|-------------|
| Översikt | ✅ | KPI-kort med kategorier |
| Indikatorer | ✅ | Sökbar tabell |
| Beslut | ✅ | Tidslinje + händelser |
| Ansvar | ✅ | Departementsvy |
| Analys | ✅ | Korrelationer + hälsa |
| Inställningar | ✅ | Konfiguration |

---

## 12. Nästa steg

### Prioriterat

1. **Databasintegration för Beslut** – Koppla UI till policy_decisions
2. **Automatiserad analys** – Schemalagd körning av analysmotor
3. **Autentisering** – Rollbaserad access (Statsminister → Operativ)

### Framtida

- Real-time prenumeration via Supabase Realtime
- Export/rapport-generering
- Extern API-dokumentation

---

## Dokumenthistorik

| Version | Datum | Förändring |
|---------|-------|------------|
| 1.0 | 2026-02-01 | Initial teknisk blueprint |

---

*Detta dokument är en teknisk specifikation för implementation av NOGF. Det är avsett för arkitekt- och utvecklingsteam.*
