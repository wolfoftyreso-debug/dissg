# DEL XX — FULL TEKNISK ARKITEKTUR (SKALBAR & OÄNDLIG)

## 1. Arkitekturprinciper (låsta)

| Princip | Beskrivning |
|---------|-------------|
| **Event-driven** | Allt är tidsstämplat, varje ändring loggas |
| **Read-heavy** | Optimerat för publik last (95% läsning) |
| **Immutable history** | Inget skrivs över, allt versioneras |
| **Separation of concerns** | Data ≠ Analys ≠ Presentation |
| **Explainable by design** | Alla steg loggas och kan spåras |

---

## 2. Lager (uppifrån och ner)

```
┌─────────────────────────────────────────────────────────────┐
│                          UI Layer                            │
│  Web (mobil först) • Kartor (tiles) • Tidsreglage           │
├─────────────────────────────────────────────────────────────┤
│                         API Layer                            │
│  Public Read API • Auth Read API • Admin API                │
├─────────────────────────────────────────────────────────────┤
│                     Simulation Layer                         │
│  Read-only historik • What-if • Känslighetsanalys           │
├─────────────────────────────────────────────────────────────┤
│                     Analytics Layer                          │
│  Trenddetektion • Kluster • Osäkerhet & Konfidens           │
├─────────────────────────────────────────────────────────────┤
│                   Data Lake / Warehouse                      │
│  Tidsserier • Geo-index • Lineage-tabeller                  │
├─────────────────────────────────────────────────────────────┤
│                 Normalize & Semantics                        │
│  Enheter • Intervall • Definitioner • Metadata              │
├─────────────────────────────────────────────────────────────┤
│                      Ingest Layer                            │
│  Myndighets-API • Wikipedia • Validering • Versionering     │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Ingest Layer
- **Källor**: Myndigheter (API/CSV), Wikipedia (MediaWiki API), SCB, Kolada
- **Validering**: Schema-validering, datumlogik, bortfallshantering
- **Versionering**: Varje körning får `source_version`, checksumma

### 2.2 Normalize & Semantics
- **Enheter**: Standardiserade (%, SEK, antal, per 1000)
- **Intervall**: Tidsperioder normaliseras till ISO 8601
- **Metadata**: Per KPI (vad, varför, begränsningar, källa)

### 2.3 Data Lake / Warehouse
- **Tidsserier**: Kolumnformat (Parquet/TimescaleDB)
- **Geo-index**: Tile-baserat (MVT), hierarkiskt
- **Lineage-tabeller**: Från rådata → aggregat → vy

### 2.4 Analytics Layer
- **Trenddetektion**: Flyttande medelvärden, säsongsrensning
- **Brytpunkter**: Change-point detection (Bayesian)
- **Kluster**: DBSCAN för geografiska mönster, k-means för profiler
- **Osäkerhet**: Konfidensintervall på alla beräkningar

### 2.5 Simulation Layer
- **Read-only**: Ändrar aldrig produktionsdata
- **Historisk känslighet**: Beräknas från verklig historik
- **What-if**: Justerar relativa förändringar, inte absoluta värden

### 2.6 API Layer

| API | Syfte | Auth | Cache |
|-----|-------|------|-------|
| Public Read | Masterindex, KPI:er, kartor | Ingen | CDN 5 min |
| Auth Read | Djupare vyer, simulering | JWT | 1 min |
| Admin | Metadata, roller, ingest | JWT + Role | Ingen |

### 2.7 UI Layer
- **Web**: Mobile-first, progressiv förbättring
- **Kartor**: Vector tiles (MVT), heatmaps
- **Navigation**: Tidsreglage, breadcrumbs, djupindikatorer

---

## 3. Datamodell (Supabase)

### Kärntabeller

```sql
-- KPI-definitioner (metadata)
kpi_definitions (
  id, code, name, category, unit,
  description, rationale, is_inverted,
  breakdown_dimensions[], red_flag_conditions
)

-- KPI-värden (tidsserier)
kpi_values (
  id, kpi_id, period_start, period_end,
  value, previous_value, trend, trend_percent,
  confidence, status, region_code, granularity
)

-- Datakällor
data_sources (
  id, code, name, source_type, update_frequency,
  reliability_score, api_endpoint, is_active
)

-- Data-lineage (spårbarhet)
data_lineage (
  id, kpi_value_id, data_source_id,
  raw_values, transformations_applied,
  collected_at, checksum, version
)

-- Analyser och observationer
observations (
  id, kpi_id, observation_type, title, description,
  confidence_level, signal_strength, detected_at
)

-- Analyskedjor (rekursiva "varför")
analysis_chains (
  id, observation_id, level, level_title,
  level_content, analysis_method, sequence_order
)
```

### Geo-tabeller

```sql
-- Regioner (hierarkiskt)
regions (
  id, code, name, level, parent_code,
  geometry, population, area_km2
)

-- Kluster (statistiska mönster)
statistical_clusters (
  id, name, description, member_regions[],
  defining_characteristics, trend_direction
)
```

---

## 4. Prestanda & Kostnad

### Caching-strategi

| Nivå | Data | TTL | Metod |
|------|------|-----|-------|
| L1 | Masterindex | 5 min | CDN Edge |
| L2 | KPI-aggregat | 1 timme | Redis |
| L3 | Kartdata | 24 timmar | Tile-cache |
| L4 | Rådata | Permanent | Cold storage |

### Förberäkningar

```
Aggregeringar körs:
- Varje timme: Nationella aggregat
- Varje natt: Regionala aggregat
- Varje vecka: Klusteromräkning
- Vid ingest: Lineage-uppdatering
```

### Kostnadsprofil (uppskattning)

| Komponent | Kostnad/mån |
|-----------|-------------|
| Supabase Pro | ~$25 |
| CDN (Cloudflare) | ~$0-20 |
| Kartserver | ~$50-100 |
| **Total** | **~$75-145** |

---

## 5. Säkerhet & Etik

### Automatiska spärrar

```typescript
// Minsta observationsstorlek
const MIN_OBSERVATION_THRESHOLD = 30;

// Brus vid djup zoom (differentiell integritet)
const NOISE_FACTOR = 0.02; // 2%

// Zoom-gräns för publik åtkomst
const MAX_PUBLIC_ZOOM = 3; // Områdeskluster
```

### Privacy-by-design

1. **N-threshold**: Ingen vy om N < 30
2. **Brus**: Små slumpvariationer bevarar trend
3. **Segment**: Aldrig individer, alltid kluster
4. **Syntetiska exempel**: Typfall för pedagogik

---

## 6. API-kontrakt (exempel)

### GET /api/v1/kpis

```json
{
  "data": [
    {
      "id": "sysselsattning",
      "name": "Sysselsättningsgrad",
      "value": 78.4,
      "unit": "%",
      "trend": "down",
      "trend_percent": -0.8,
      "confidence": 95,
      "period": "2024-Q4",
      "status": "warning"
    }
  ],
  "meta": {
    "total": 20,
    "last_updated": "2025-01-15T08:00:00Z",
    "source_version": "scb_2025_01"
  }
}
```

### GET /api/v1/kpis/{id}/explain

```json
{
  "kpi_id": "sysselsattning",
  "why_chain": [
    {
      "level": 0,
      "title": "Vad?",
      "content": "Sysselsättningsgraden mäter andelen av befolkningen 20-64 år som arbetar."
    },
    {
      "level": 1,
      "title": "Varför detta värde?",
      "factors": [
        { "name": "Konjunktur", "weight": 0.4, "direction": "negative" },
        { "name": "Demografi", "weight": 0.3, "direction": "neutral" }
      ]
    }
  ],
  "sources": [
    { "name": "SCB AKU", "url": "...", "collected_at": "2025-01-10" }
  ]
}
```
