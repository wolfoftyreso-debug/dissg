# 🔌 API v1 — PRODUKTPLAN & ENDPOINTS

> **"Fakta är fria. Intelligens är premium."**

---

## Gemensamt för alla nivåer

| Aspekt | Standard |
|--------|----------|
| **Format** | JSON (Arrow/Parquet för bulk i Pro) |
| **Auth** | API-nyckel (OAuth2 för Enterprise) |
| **Versionering** | `/v1/...` |
| **Explainability** | `?explain=true` på alla analysendpoints |
| **Privacy** | min-N, brus, blockerade korsningar |
| **Metadata** | källa, definition, osäkerhet medföljer alltid |

---

## 🟢 FREE API (Öppen bas)

**Syfte:** Transparens, spridning, förtroende

### Begränsningar
- Nation/region endast
- 1 KPI per query
- Grov geo
- Ingen klustring
- Ingen korrelation
- Låg rate-limit

### Endpoints

#### 1) KPI-översikt
```http
GET /v1/free/kpi
```
**Svar:** Lista över alla KPI:er med definitioner

#### 2) Tidsserie (grund)
```http
GET /v1/free/timeseries
  ?kpi=workforce_functional_rate
  &geo=country:SE
  &from=2010-01-01
  &to=2026-01-01
  &grain=year
```

#### 3) Enkel karta (choropleth)
```http
GET /v1/free/map
  ?kpi=gdp_per_capita
  &geo_level=region
  &time=2025
```

#### 4) Metadata
```http
GET /v1/free/meta/kpi/{kpi_id}
```

---

## 🔵 PLUS API (Analysnivå)

**Syfte:** Media, analytiker, policy

### Tillåtet
- Kommun + kluster
- Upp till 3 KPI
- Demografiska filter (godkända)
- Korrelation (med lag)
- Ansvarsmappning
- Medel rate-limit

### Endpoints

#### 1) Avancerad tidsserie
```http
POST /v1/plus/timeseries
```
```json
{
  "kpis": ["workforce_functional_rate", "long_term_sick_leave"],
  "geo": ["region:01", "region:03"],
  "time": {
    "from": "2012-01-01",
    "to": "2026-01-01",
    "grain": "quarter"
  },
  "demographics": {
    "sex": ["female"],
    "age": ["45-64"]
  }
}
```

#### 2) Korrelation (förklarbar)
```http
POST /v1/plus/correlation
```
```json
{
  "x": "foreign_born_share",
  "y": "gdp_per_capita",
  "geo_level": "region",
  "time": "2010-2025",
  "lags": [0, 4, 8]
}
```

#### 3) Kluster (liknande områden)
```http
POST /v1/plus/cluster
```
```json
{
  "kpis": ["workforce_functional_rate", "healthcare_load"],
  "geo_level": "municipality",
  "time": "2024",
  "method": "dbscan"
}
```

#### 4) Ansvar & historik
```http
GET /v1/plus/responsibility
  ?kpi=workforce_functional_rate
  &geo=country:SE
  &time=2014-2022
```

---

## 🟣 PRO / INTELLIGENCE API (Premium)

**Syfte:** Regeringar, myndigheter, företag

### Tillåtet
- Obegränsade KPI
- Full geo + kluster
- Relevansscore
- Orsakskedjor
- Simulering (historisk känslighet)
- Scenariojämförelser
- Hög rate / SLA

### Endpoints

#### 1) Relevans & prioritering
```http
GET /v1/pro/relevance
  ?scope=country:SE
  &limit=10
```

#### 2) Orsakskedjor
```http
POST /v1/pro/causal-chain
```
```json
{
  "target_kpi": "master_index",
  "depth": 3,
  "time": "2022-2025"
}
```

#### 3) Simulering (what-if)
```http
POST /v1/pro/simulate
```
```json
{
  "change": {
    "kpi": "workforce_functional_rate",
    "delta": 0.01
  },
  "geo": "region:01",
  "time": "2025",
  "mode": "sensitivity"
}
```

#### 4) Scenarier
```http
POST /v1/pro/scenario/compare
```
```json
{
  "scenarios": [
    {
      "name": "A",
      "changes": [{"kpi": "education_completion", "delta": 0.02}]
    },
    {
      "name": "B", 
      "changes": [{"kpi": "employment_rate", "delta": 0.01}]
    }
  ],
  "geo": "country:SE",
  "time": "2025"
}
```

#### 5) Bulk & streaming
```http
POST /v1/pro/bulk/export
GET  /v1/pro/stream/updates
```

---

## 🔐 Feature-Gating

| Funktion | FREE | PLUS | PRO |
|----------|------|------|-----|
| KPI per query | 1 | ≤3 | ∞ |
| Geo-nivå | Region | Kommun | Alla |
| Kluster | ❌ | ✅ | ✅ |
| Korrelation | ❌ | ✅ | ✅ |
| Demografi | ❌ | ✅ | ✅ |
| Ansvarsmappning | ❌ | ✅ | ✅ |
| Relevansscore | ❌ | ❌ | ✅ |
| Orsakskedjor | ❌ | ❌ | ✅ |
| Simulering | ❌ | ❌ | ✅ |
| Bulk export | ❌ | ❌ | ✅ |
| Streaming | ❌ | ❌ | ✅ |

### Gating sker på:
- Endpoint
- Query-komplexitet
- Historiskt djup
- Samtidiga dimensioner

---

## 🧾 Juridik & Språk

- Premium levererar **indikationer**, inte råd
- `explain=true` visar metod, vikter, osäkerhet
- Attribution krävs endast för Free

---

## Responsformat

Alla responses följer:

```json
{
  "meta": {
    "request_id": "uuid",
    "tier": "free|plus|pro",
    "timestamp": "ISO8601",
    "cache_hit": true
  },
  "data": { ... },
  "sources": [
    {
      "name": "SCB",
      "url": "...",
      "retrieved_at": "ISO8601"
    }
  ],
  "methodology": {
    "version": "1.0",
    "doc_url": "..."
  },
  "uncertainty": {
    "confidence": 0.85,
    "data_quality": "high"
  }
}
```

---

*NOGF API v1 — 2026*
