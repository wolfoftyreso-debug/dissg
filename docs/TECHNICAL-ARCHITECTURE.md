# TEKNISK ARKITEKTUR

## Lambda System v1.0

---

## 📐 SYSTEMÖVERSIKT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Web    │  │  Mobile  │  │   API    │  │ Widgets  │  │   AI     │       │
│  │   App    │  │   App    │  │  Client  │  │  Embed   │  │ Agents   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┘
        │             │             │             │             │
        └─────────────┴─────────────┴──────┬──────┴─────────────┘
                                           │
┌──────────────────────────────────────────┴──────────────────────────────────┐
│                              API GATEWAY                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth/Limits  │  │  Query DSL   │  │   Caching    │  │   Logging    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴──────────────────────────────────┐
│                            ENGINE LAYER                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Priority   │ │   Lambda    │ │ Explanation │ │  Timeline   │            │
│  │   Engine    │ │   Engine    │ │   Engine    │ │   Engine    │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Forecast   │ │Accountability│ │ Correlation │ │   Evidence  │            │
│  │   Engine    │ │   Engine    │ │   Engine    │ │   Linker    │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴──────────────────────────────────┐
│                          DATA PROCESSING LAYER                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │Normalization│ │ Aggregation │ │ Validation  │ │ Versioning  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴──────────────────────────────────┐
│                           DATA INGESTION LAYER                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Eurostat  │ │  World Bank │ │    OECD     │ │ National    │            │
│  │   Adapter   │ │   Adapter   │ │   Adapter   │ │  Adapters   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴──────────────────────────────────┐
│                             DATA STORAGE                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐ │
│  │   PostgreSQL/Supabase │  │    Time Series DB    │  │   Document Store   │ │
│  │   (Master Data)       │  │    (Metrics/Values)  │  │   (Lineage/Audit)  │ │
│  └──────────────────────┘  └──────────────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATAMODELLER

### Kärnschema (PostgreSQL)

```sql
-- =====================================================
-- MASTER DATA
-- =====================================================

-- Geografisk hierarki
CREATE TABLE geo_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,          -- "SE", "SE-AB", "SE-0180"
  name VARCHAR(255) NOT NULL,
  name_local JSONB,                          -- {"sv": "Stockholm", "en": "Stockholm"}
  level VARCHAR(20) NOT NULL,                -- "country", "region", "municipality"
  parent_id UUID REFERENCES geo_entities(id),
  population INTEGER,
  area_km2 NUMERIC,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indikatorer / KPIs
CREATE TABLE indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,          -- "HEALTH_LIFE_EXPECTANCY"
  name VARCHAR(255) NOT NULL,
  name_local JSONB,
  description TEXT,
  description_local JSONB,
  unit VARCHAR(50) NOT NULL,                 -- "years", "percent", "index"
  domain VARCHAR(50) NOT NULL,               -- "health", "economy", "education"
  subdomain VARCHAR(50),
  polarity VARCHAR(10) DEFAULT 'positive',   -- "positive" = higher is better
  aggregation_method VARCHAR(20) DEFAULT 'mean',
  source_ids UUID[],
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Datakällor
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,          -- "EUROSTAT", "SCB", "WHO"
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  reliability_score NUMERIC(3,2) DEFAULT 1.0,
  update_frequency VARCHAR(20),              -- "daily", "monthly", "yearly"
  api_endpoint VARCHAR(500),
  metadata JSONB,
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- TIME SERIES DATA
-- =====================================================

-- Värden (huvudtabell för all tidseriedata)
CREATE TABLE indicator_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id UUID NOT NULL REFERENCES indicators(id),
  geo_id UUID NOT NULL REFERENCES geo_entities(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  value NUMERIC NOT NULL,
  value_normalized NUMERIC,                   -- Z-score normaliserat
  uncertainty_lower NUMERIC,
  uncertainty_upper NUMERIC,
  source_id UUID REFERENCES data_sources(id),
  methodology_version VARCHAR(20),
  is_provisional BOOLEAN DEFAULT false,
  lineage_id UUID,                            -- Länk till data_lineage
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(indicator_id, geo_id, period_start, period_end)
);

-- Index för snabba tidsserieuppslag
CREATE INDEX idx_values_indicator_geo_period 
  ON indicator_values(indicator_id, geo_id, period_start DESC);

-- =====================================================
-- LAMBDA SYSTEM
-- =====================================================

-- Lambda-beräkningar
CREATE TABLE lambda_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geo_id UUID NOT NULL REFERENCES geo_entities(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  lambda_value NUMERIC(4,3) NOT NULL,        -- t.ex. 0.923
  lambda_uncertainty NUMERIC(4,3),
  
  -- Domänbidrag
  domain_health NUMERIC(4,3),
  domain_economy NUMERIC(4,3),
  domain_education NUMERIC(4,3),
  domain_stability NUMERIC(4,3),
  domain_resources NUMERIC(4,3),
  
  -- Metadata
  calculation_version VARCHAR(20),
  contributing_indicators JSONB,              -- Lista med vikter
  calculation_method VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(geo_id, period_start, period_end, calculation_version)
);

-- =====================================================
-- BESLUT & ANSVAR
-- =====================================================

-- Beslut/händelser
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE,
  title VARCHAR(500) NOT NULL,
  title_local JSONB,
  description TEXT,
  decision_date DATE NOT NULL,
  effective_date DATE,
  decision_type VARCHAR(50),                  -- "legislation", "policy", "budget"
  geo_id UUID REFERENCES geo_entities(id),
  responsible_institution VARCHAR(255),
  source_url VARCHAR(500),
  related_indicator_ids UUID[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kopplade utfall
CREATE TABLE decision_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES decisions(id),
  indicator_id UUID NOT NULL REFERENCES indicators(id),
  baseline_date DATE,
  baseline_value NUMERIC,
  observation_date DATE,
  observation_value NUMERIC,
  change_absolute NUMERIC,
  change_percent NUMERIC,
  time_lag_months INTEGER,
  attribution_confidence NUMERIC(3,2),       -- 0.00 - 1.00
  confounding_factors TEXT[],
  methodology_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- VERIFIERING & SPÅRBARHET
-- =====================================================

-- Data lineage (spårbarhet)
CREATE TABLE data_lineage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES data_sources(id),
  original_identifier VARCHAR(255),
  raw_value JSONB,
  transformations_applied JSONB[],
  checksum VARCHAR(64),                       -- SHA-256
  fetched_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1
);

-- Evidence links (verifieringskoder)
CREATE TABLE evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(9) UNIQUE NOT NULL,      -- "XXXX-XXXX"
  query_hash VARCHAR(64) NOT NULL,
  query_params JSONB NOT NULL,
  data_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  accessed_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ
);

-- =====================================================
-- PRIORITERING
-- =====================================================

CREATE TABLE priority_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geo_id UUID NOT NULL REFERENCES geo_entities(id),
  ranking_date DATE NOT NULL,
  scope VARCHAR(20) DEFAULT 'all',            -- "all", "health", "economy"
  
  -- Topp-frågor med scores
  ranked_items JSONB NOT NULL,
  /*
    [
      {
        "indicator_id": "uuid",
        "rank": 1,
        "impact_score": 0.85,
        "scope_score": 0.72,
        "urgency_score": 0.91,
        "reversibility_score": 0.45,
        "total_score": 1.42,
        "explanation": "..."
      }
    ]
  */
  
  -- Oviktigt trots uppmärksamhet
  attention_mismatches JSONB,
  
  calculation_version VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(geo_id, ranking_date, scope)
);
```

---

## 🔌 API-STRUKTUR

### Query DSL

```typescript
// Query DSL Interface
interface LambdaQuery {
  what: {
    indicators: string[];           // ["HEALTH_*", "ECON_GDP"]
    aggregation?: 'mean' | 'sum' | 'latest';
  };
  where: {
    geo: string[];                  // ["SE", "SE-AB"]
    level?: 'country' | 'region' | 'municipality';
  };
  when: {
    start: string;                  // "2020-01-01"
    end: string;                    // "2024-12-31"
    granularity?: 'day' | 'month' | 'quarter' | 'year';
  };
  who?: {
    demographic?: string[];         // ["age:18-24", "gender:female"]
  };
  ops?: {
    normalize?: boolean;
    compare_to?: string;            // "OECD_MEDIAN"
    trend?: boolean;
  };
  output: {
    format: 'json' | 'csv' | 'chart';
    include_metadata?: boolean;
    include_lineage?: boolean;
  };
}
```

### REST Endpoints

```yaml
# Core Data
GET  /api/v1/indicators                    # Lista alla indikatorer
GET  /api/v1/indicators/{code}             # Specifik indikator
GET  /api/v1/indicators/{code}/values      # Tidsserie för indikator
GET  /api/v1/geo                           # Geografisk hierarki
GET  /api/v1/geo/{code}                    # Specifik geo-enhet

# Lambda System
GET  /api/v1/lambda/{geo_code}             # Aktuellt Lambda-värde
GET  /api/v1/lambda/{geo_code}/history     # Lambda-tidsserie
GET  /api/v1/lambda/{geo_code}/drivers     # Vad driver Lambda

# Prioritering
GET  /api/v1/priority/{geo_code}           # Topp-prioriteringar
GET  /api/v1/priority/{geo_code}/mismatch  # Uppmärksamhet vs prioritet

# Beslut & Ansvar
GET  /api/v1/decisions                     # Lista beslut
GET  /api/v1/decisions/{id}                # Specifikt beslut
GET  /api/v1/decisions/{id}/outcomes       # Kopplade utfall

# Verifiering
GET  /api/v1/evidence/{short_code}         # Verifiera via kod
POST /api/v1/evidence                      # Skapa ny evidence link

# Query (flexibel)
POST /api/v1/query                         # Kör Query DSL
```

### Webhooks

```yaml
# Webhook Events
data.updated:
  - trigger: När datakälla uppdateras
  - payload: { source_id, indicators_affected, timestamp }

lambda.changed:
  - trigger: När Lambda-värde ändras signifikant (±0.05)
  - payload: { geo_id, old_value, new_value, drivers }

priority.shifted:
  - trigger: När prioriteringsordning ändras
  - payload: { geo_id, old_ranking, new_ranking }

decision.linked:
  - trigger: När nytt beslut kopplas till utfall
  - payload: { decision_id, outcomes }
```

---

## 🏗️ KOMPONENTARKITEKTUR (Frontend)

```
src/
├── components/
│   ├── lambda/
│   │   ├── LambdaGauge.tsx           # Visuell mätare
│   │   ├── LambdaSummary.tsx         # Textsammanfattning
│   │   ├── LambdaDrivers.tsx         # Drivkraftsanalys
│   │   ├── LambdaHistory.tsx         # Tidsserie
│   │   ├── DiagnosticDashboard.tsx   # Huvudpanel
│   │   ├── DiagnosticCodeList.tsx    # Felkoder (DTC)
│   │   ├── TriangulationPanel.tsx    # 3-sensor validering
│   │   ├── EvidenceLinkBadge.tsx     # Verifieringskod
│   │   ├── ExplanationCard.tsx       # Tre-nivå förklaring
│   │   ├── AssumptionExposer.tsx     # Synliga antaganden
│   │   └── NumberWithContext.tsx     # Kontextuell siffervisning
│   │
│   ├── priority/
│   │   ├── PriorityRanking.tsx       # Topp 5 lista
│   │   ├── AttentionMismatch.tsx     # Media vs faktisk prioritet
│   │   └── PriorityExplainer.tsx     # Förklaring av ranking
│   │
│   ├── timeline/
│   │   ├── DecisionTimeline.tsx      # Beslutstidslinje
│   │   ├── YearInReview.tsx          # Årsrapport
│   │   ├── BeforeAfter.tsx           # Före/efter-jämförelse
│   │   └── DecisionMarker.tsx        # Beslutsmarkör på graf
│   │
│   ├── forecast/
│   │   ├── ForecastFan.tsx           # Fläktdiagram med osäkerhet
│   │   ├── ScenarioSelector.tsx      # Scenarioval
│   │   └── TrendBreakers.tsx         # Vad bryter trenden
│   │
│   ├── verification/
│   │   ├── SourceChain.tsx           # Klickbar källkedja
│   │   ├── MethodologyNote.tsx       # Metodbeskrivning
│   │   └── QRVerification.tsx        # QR-kod för verifiering
│   │
│   └── ui/
│       └── [shadcn components]
│
├── lib/
│   ├── lambda/
│   │   ├── index-types.ts            # Typdefinitioner
│   │   ├── index-registry.ts         # Index-katalog
│   │   ├── normalization.ts          # Normaliseringslogik
│   │   ├── correlation-engine.ts     # Korrelationsberäkning
│   │   ├── lambda-calculator.ts      # Lambda-beräkning
│   │   ├── underperformance-detector.ts
│   │   ├── diagnostic-codes.ts       # DTC-logik
│   │   ├── sensor-triangulation.ts   # 3-sensor validering
│   │   ├── evidence-link.ts          # Evidence-länk system
│   │   ├── explanation-engine.ts     # Förklaringsmotor
│   │   └── signal-terminology.ts     # Signalterminologi
│   │
│   └── api/
│       ├── client.ts                 # API-klient
│       ├── hooks.ts                  # React Query hooks
│       └── types.ts                  # API-typer
│
├── pages/
│   ├── Index.tsx                     # Startsida
│   ├── Reality.tsx                   # Reality Dashboard
│   ├── Lambda.tsx                    # Lambda-översikt
│   ├── Priority.tsx                  # Prioriteringar
│   ├── Timeline.tsx                  # Tidslinje/Årsrapport
│   └── Verify.tsx                    # Verifieringssida
│
└── docs/
    ├── MASTERPROMPT.md               # Systemkonstitution
    ├── MANIFEST.md                   # Filosofiskt manifest
    ├── IMPLEMENTATION-TASKS.md       # Byggplan
    ├── AGENT-PROMPTS.md              # AI-agent prompter
    ├── PITCH-WEF-DAVOS.md            # Pitch-dokument
    └── TECHNICAL-ARCHITECTURE.md     # Detta dokument
```

---

## 🔐 SÄKERHET & SKALNING

### Licensnivåer

| Tier | Rate Limit | Features |
|------|------------|----------|
| Guest | 10 req/min | Read-only, limited endpoints |
| Observer | 100 req/min | Full read, no export |
| Analyst | 1000 req/min | Export, scenarios, alerts |
| Institutional | 10000 req/min | Full API, webhooks, white-label |

### Caching-strategi

```
┌─────────────────┐
│    CDN Edge     │  TTL: 1h (static assets)
└────────┬────────┘
         │
┌────────┴────────┐
│   Redis Cache   │  TTL: 5min (frequently accessed)
└────────┬────────┘
         │
┌────────┴────────┐
│  Query Cache    │  TTL: 1min (computed results)
└────────┬────────┘
         │
┌────────┴────────┐
│   PostgreSQL    │  Source of truth
└─────────────────┘
```

### Datavalidering

```typescript
// Varje datapunkt måste passera
interface ValidationPipeline {
  // 1. Schemavalidering
  schema: {
    required: ['value', 'source_id', 'period_start'];
    types: { value: 'number', ... };
  };
  
  // 2. Rimlighetskontroll
  sanity: {
    min_value?: number;
    max_value?: number;
    max_change_percent?: number;  // Jämfört med förra värdet
  };
  
  // 3. Källvalidering
  source: {
    reliability_threshold: 0.7;
    require_methodology: true;
  };
  
  // 4. Konsistenskontroll
  consistency: {
    check_against: ['similar_indicators', 'peer_geos'];
    outlier_threshold: 3;  // Standardavvikelser
  };
}
```

---

*Lambda System v1.0 - Teknisk Arkitektur*
