# NOGF Technical Blueprint

**Version 1.0**  
**Status: Byggbar specifikation**  
**Målgrupp: Arkitektteam, utvecklare**

---

## Sammanfattning

Detta dokument beskriver den tekniska arkitekturen för en referensimplementation av National Operational Governance Framework (NOGF). Det är ett operativt systemrecept – inte en produktbeskrivning.

---

## 1. Arkitekturprinciper

### Kärnprincip

> **Event-driven, read-heavy, spårbar, deterministisk.**

### Systemet ska alltid kunna svara

| Fråga | Källa |
|-------|-------|
| Vad vet vi? | TimeSeries + Observations |
| Varför vet vi det? | AnalysisChain |
| Hur kom vi fram till det? | DataLineage |

### Huvudlager

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              UI (rollbaserat)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                              Read-API                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Analysmotor          │  Spårbarhetslager     │  Faktalager             │
│  (observations)       │  (lineage)            │  (timeseries)           │
├─────────────────────────────────────────────────────────────────────────┤
│                    Normalisering & Semantik                             │
├─────────────────────────────────────────────────────────────────────────┤
│                    Datainhämtning (Ingest)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                    Externa datakällor                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Datamodell – Kärnobjekt

> **Dessa objekt måste låsas tidigt. Allt annat bygger på dem.**

### 2.1 Indicator (kpi_definitions)

```sql
CREATE TABLE kpi_definitions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  unit            TEXT NOT NULL,
  category        kpi_category NOT NULL,
  kpi_index       INTEGER NOT NULL,
  is_inverted     BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  rationale       TEXT NOT NULL,
  breakdown_dimensions TEXT[] DEFAULT '{}',
  calculation_formula TEXT,
  red_flag_conditions JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

**Regel**: Allt i systemet knyts till en Indicator.

### 2.2 TimeSeries (kpi_values)

```sql
CREATE TABLE kpi_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id          UUID REFERENCES kpi_definitions(id) NOT NULL,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  value           NUMERIC NOT NULL,
  previous_value  NUMERIC,
  trend           trend_direction DEFAULT 'stable',
  trend_percent   NUMERIC,
  status          kpi_status DEFAULT 'neutral',
  confidence      INTEGER DEFAULT 80,
  is_provisional  BOOLEAN DEFAULT false,
  granularity     TEXT DEFAULT 'national',
  region_code     TEXT,
  data_source_id  UUID REFERENCES data_sources(id),
  raw_data        JSONB,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(kpi_id, period_start, period_end, granularity, region_code)
);
```

**Regel**: Endast tidsserier. Inga "aktuella siffror" utan historik.

### 2.3 Observation (observations)

```sql
CREATE TABLE observations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id                  UUID REFERENCES kpi_definitions(id) NOT NULL,
  kpi_value_id            UUID REFERENCES kpi_values(id),
  observation_type        observation_type NOT NULL,
  title                   TEXT NOT NULL,
  description             TEXT NOT NULL,
  observation_period_start DATE NOT NULL,
  observation_period_end   DATE NOT NULL,
  detected_at             TIMESTAMPTZ DEFAULT now(),
  signal_strength         NUMERIC NOT NULL,
  confidence_level        NUMERIC NOT NULL,
  status                  analysis_status DEFAULT 'pending',
  model_version           TEXT DEFAULT '1.0',
  analysis_version        TEXT DEFAULT '1.0',
  acknowledged_at         TIMESTAMPTZ,
  acknowledged_by         TEXT,
  created_at              TIMESTAMPTZ DEFAULT now()
);
```

**Observationstyper (ENUM)**:
- `trend_deviation` – Avvikelse från långsiktig trend
- `threshold_breach` – Tröskelvärde överskridet
- `correlation_detected` – Samband identifierat
- `pattern_match` – Mönsterigenkänning
- `lag_signal` – Tidsförskjuten signal
- `anomaly` – Statistisk anomali

**Regel**: Observationer är systemets röst. De är inte beslut.

### 2.4 AnalysisChain (analysis_chains + factor_contributions)

```sql
CREATE TABLE analysis_chains (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id  UUID REFERENCES observations(id) NOT NULL,
  level           INTEGER NOT NULL,
  level_title     TEXT NOT NULL,
  level_content   JSONB NOT NULL,
  analysis_method analysis_method,
  method_rationale TEXT,
  alternatives_tested JSONB,
  sequence_order  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE factor_contributions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_chain_id     UUID REFERENCES analysis_chains(id) NOT NULL,
  factor_name           TEXT NOT NULL,
  factor_kpi_id         UUID REFERENCES kpi_definitions(id),
  contribution_strength NUMERIC NOT NULL,
  time_relation         TEXT NOT NULL,
  description           TEXT NOT NULL,
  stability_score       NUMERIC NOT NULL,
  uncertainty           NUMERIC NOT NULL,
  evidence_periods      INTEGER NOT NULL,
  evidence_total_periods INTEGER NOT NULL,
  sequence_order        INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT now()
);
```

**Analysmetoder (ENUM)**:
- `trend_detection`
- `change_point_detection`
- `correlation_analysis`
- `lag_analysis`
- `regression`
- `decomposition`
- `anomaly_detection`

**Regel**: Detta är klickkedjan bakåt. Varje steg måste vara reproducerbart.

### 2.5 DataSource (data_sources)

```sql
CREATE TABLE data_sources (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  description           TEXT,
  source_type           data_source_type DEFAULT 'api',
  base_url              TEXT,
  api_endpoint          TEXT,
  update_frequency      update_frequency NOT NULL,
  requires_auth         BOOLEAN DEFAULT false,
  auth_type             TEXT,
  reliability_score     INTEGER DEFAULT 80,
  is_active             BOOLEAN DEFAULT true,
  last_successful_fetch TIMESTAMPTZ,
  last_fetch_error      TEXT,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 DataLineage (data_lineage)

```sql
CREATE TABLE data_lineage (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id        UUID REFERENCES data_sources(id) NOT NULL,
  kpi_value_id          UUID REFERENCES kpi_values(id),
  observation_id        UUID REFERENCES observations(id),
  analysis_chain_id     UUID REFERENCES analysis_chains(id),
  original_source       TEXT NOT NULL,
  collection_method     TEXT NOT NULL,
  collection_interval   TEXT NOT NULL,
  collected_at          TIMESTAMPTZ NOT NULL,
  aggregation_level     TEXT NOT NULL,
  raw_values            JSONB NOT NULL,
  transformations_applied JSONB DEFAULT '[]',
  corrections_applied   JSONB DEFAULT '[]',
  methodology_changes   JSONB DEFAULT '[]',
  data_cleaning_notes   TEXT,
  missing_data_count    INTEGER DEFAULT 0,
  checksum              TEXT NOT NULL,
  version               INTEGER DEFAULT 1,
  created_at            TIMESTAMPTZ DEFAULT now()
);
```

**Regel**: Inget skrivs över. Allt versioneras.

### 2.7 Decision (policy_decisions + decision_timeline)

```sql
CREATE TABLE policy_decisions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  decision_date       DATE NOT NULL,
  target_kpis         UUID[] DEFAULT '{}',
  expected_effect     TEXT,
  measured_effect     TEXT,
  effectiveness_score INTEGER,
  status              TEXT DEFAULT 'active',
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE decision_timeline (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id         UUID REFERENCES policy_decisions(id),
  action_id           UUID REFERENCES action_options(id),
  event_title         TEXT NOT NULL,
  event_description   TEXT,
  event_type          TEXT,
  event_date          DATE NOT NULL,
  event_timestamp     TIMESTAMPTZ,
  affected_kpi_ids    UUID[] DEFAULT '{}',
  responsible_entity  TEXT,
  responsible_level   TEXT,
  source_document     TEXT,
  source_url          TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);
```

**Regel**: Systemet dömer inte beslutet. Systemet följer upp det.

---

## 3. Datainhämtning (Ingest)

### Principer

| Princip | Implementation |
|---------|----------------|
| Pull-baserad | Schemalagda jobb, ej push |
| Idempotent | Samma input → samma output |
| Tidsstämplad vid källa | Bevarar ursprunglig timestamp |
| Validerad vid ingest | Schemakontroll före insert |

### Ingestflöde

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ Extern API │ → │  Ingestor  │ → │  Validator │ → │ Normalizer │ → │ TimeSeries │
└────────────┘    └────────────┘    └────────────┘    └────────────┘    │   Store    │
                                                                        └────────────┘
                        │                 │
                        ▼                 ▼
                 ┌────────────┐    ┌────────────┐
                 │ Ingest Log │    │ Error Log  │
                 └────────────┘    └────────────┘
```

### Ingest Log Schema

```sql
CREATE TABLE ingest_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id  UUID REFERENCES data_sources(id) NOT NULL,
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  status          TEXT DEFAULT 'running',
  records_fetched INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed  INTEGER DEFAULT 0,
  error_message   TEXT,
  metadata        JSONB DEFAULT '{}'
);
```

### Edge Function: kpi-ingest

```typescript
// supabase/functions/kpi-ingest/index.ts
// Handles:
// - Schema validation
// - Data normalization
// - Duplicate detection
// - Version management
// - Lineage tracking
```

---

## 4. Normalisering & Semantik

> **Detta är där de flesta system misslyckas.**

### Regler

| Regel | Beskrivning |
|-------|-------------|
| Enhetliga tidsintervall | Allt normaliseras till månad/kvartal/år |
| Konsekvent aggregation | Samma metod för alla perioder |
| Samma definition över tid | Metodologiändringar loggas explicit |
| Metadatadriven omräkning | Formler i metadata, ej i kod |

### Metodologiändringar

Alla förändringar i definition:
1. **Versioneras** – Ny version skapas
2. **Loggas** – I methodology_changes array
3. **Visas i UI** – Varning vid tidsseriebrott

```json
{
  "methodology_changes": [
    {
      "effective_date": "2020-01-01",
      "description": "Ny beräkningsmetod för arbetsför befolkning",
      "impact": "Ökade andelen med ca 2 procentenheter",
      "source_document": "SCB metoddokument 2019-12"
    }
  ]
}
```

---

## 5. Analysmotor

### Analysklasser (Version 1)

Endast tre klasser i första versionen:

#### 5.1 Trendanalys

| Typ | Beräkning | Tröskel |
|-----|-----------|---------|
| Långsam försämring | Linjär regression, 12+ mån | R² > 0.7, lutning < -0.5σ |
| Acceleration | Andra derivatan | > 2σ förändring |

#### 5.2 Brytpunktsdetektering

| Metod | Implementation |
|-------|----------------|
| CUSUM | Kumulativ summa av avvikelser |
| PELT | Pruned Exact Linear Time |

**Tröskel**: Brytpunkt om signal > 3σ från baslinje.

#### 5.3 Sambandsanalys

| Typ | Beräkning |
|-----|-----------|
| Lead/Lag | Korskorrelation med tidsförskjutning |
| Styrka | Pearson-korrelation |

**Tröskel**: r > 0.6 med p < 0.05

### Vad analysmotorn INTE gör

- ❌ Ingen prediktiv galenskap
- ❌ Ingen besluts-AI
- ❌ Inga rekommendationer

### Vad analysmotorn gör

- ✅ Deterministisk analys
- ✅ Reproducerbarhet
- ✅ Konfidensintervall

---

## 6. Spårbarhet & Lineage

### Krav

Varje observation måste kunna visa:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Observation: "Överdödligheten har ökat 4,2%"                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Nivå 1: Sammanfattning                                                  │
│   └── "Observerad ökning sedan Q3 2023"                                 │
│                                                                         │
│ Nivå 2: Analysmetod                                                     │
│   └── trend_detection, 12-månaders rullande medelvärde                  │
│                                                                         │
│ Nivå 3: Bidragande faktorer                                             │
│   └── Åldersgrupp 65+: 78%, Åldersgrupp 45-64: 15%                      │
│                                                                         │
│ Nivå 4: Datakällor                                                      │
│   └── Socialstyrelsen dödsorsaksregister (reliability: 95%)             │
│                                                                         │
│ Nivå 5: Rådata                                                          │
│   └── Aggregerad månadsdata, checksum: a7f3b2c1...                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tekniska krav

| Krav | Implementation |
|------|----------------|
| Immutable logs | INSERT-only tables, soft delete |
| Hashad analyskedja | SHA-256 av input + parametrar |
| Reproducible runs | Samma seed → samma resultat |

### Lineage-hashning

```typescript
function computeAnalysisHash(input: AnalysisInput): string {
  const canonical = JSON.stringify({
    kpiId: input.kpiId,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    method: input.method,
    parameters: input.parameters,
    inputChecksum: input.dataChecksum
  });
  return sha256(canonical);
}
```

> **Regel**: Om du inte kan återskapa analysen exakt – då är den ogiltig.

---

## 7. Read-API

### Principer

| Princip | Implementation |
|---------|----------------|
| Read-only | Ingen mutation via API |
| Rollfiltrerat | JWT-baserad access |
| Cache-optimerat | Stale-while-revalidate |

### Edge Functions

| Endpoint | Metod | Beskrivning |
|----------|-------|-------------|
| `kpi-api` | GET | KPI-definitioner och aktuella värden |
| `analyze-kpi` | POST | Trigga djupanalys |
| `kpi-forecast` | POST | Generera prognos |
| `kpi-decisions` | GET/POST | Läs/registrera beslut |
| `prioritize-actions` | POST | Beräkna åtgärdsprioritering |
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
