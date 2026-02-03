# 📡 STRIM Open Data API — Specifikation v1

> **"Öppet. Läsbart. Ingen auth. Ingen tracking. Cachebart."**

---

## Grundprinciper

| Aspekt | Standard |
|--------|----------|
| **Format** | JSON med JSON-LD |
| **Auth** | Ingen (public read-only) |
| **Versionering** | `/v1/...` |
| **Cache** | 1h client, 24h CDN |
| **License** | CC BY 4.0 |

---

## 🔌 Endpoints

### Base URL
```
https://strim.se/api/strim-api/v1
```

### Entitetstyper

| Endpoint | Beskrivning |
|----------|-------------|
| `GET /entities` | Översikt med antal per typ |
| `GET /substances` | Lista alla substanser |
| `GET /substances/{slug}` | Hämta substans |
| `GET /diagnoses` | Lista alla diagnoser |
| `GET /diagnoses/{slug}` | Hämta diagnos |
| `GET /treatments` | Lista alla behandlingar |
| `GET /treatments/{slug}` | Hämta behandling |
| `GET /legal` | Lista all lagstiftning |
| `GET /legal/{slug}` | Hämta lag |
| `GET /statistics` | Lista all statistik |
| `GET /statistics/{slug}` | Hämta statistik |
| `GET /terms` | Lista alla begrepp |
| `GET /terms/{slug}` | Hämta begrepp |

---

## 📝 Query Parameters

| Parameter | Typ | Default | Beskrivning |
|-----------|-----|---------|-------------|
| `page` | int | 1 | Sidnummer |
| `per_page` | int | 50 | Antal per sida (max 100) |
| `jsonld` | bool | true | Inkludera JSON-LD |
| `relations` | bool | true | Inkludera relationer |

---

## 📦 Response Format

### Lista
```json
{
  "meta": {
    "version": "v1",
    "timestamp": "2026-02-03T10:00:00Z",
    "total_count": 42,
    "page": 1,
    "per_page": 50,
    "cache_ttl": 3600
  },
  "data": [...]
}
```

### Enskild entitet
```json
{
  "meta": {
    "version": "v1",
    "timestamp": "2026-02-03T10:00:00Z",
    "cache_ttl": 3600
  },
  "data": {
    "type": "Substance",
    "strim_id": "substance-alkohol",
    "canonical_url": "https://strim.se/data/substans/alkohol",
    "name": "Alkohol",
    "name_en": "Alcohol",
    "slug": "alkohol",
    "status": "active",
    "version": 1,
    "last_updated": "2026-02-01T00:00:00Z",
    "classification": "depressant",
    "risk_profile": {
      "dependence": "high",
      "overdose": "moderate",
      "overall": "high"
    },
    "legal_status": "legal",
    "related_entities": [
      {
        "relation": "orsakar",
        "relation_code": "causes",
        "target": "diagnosis-alkoholberoende",
        "direction": "outgoing"
      }
    ],
    "sources": [...]
  },
  "jsonld": {
    "@context": "https://schema.org",
    "@type": "Drug",
    ...
  }
}
```

---

## 🔗 Cite Endpoint

### Purpose
AI-grounding, akademisk citering, faktaverifiering.

### URL
```
GET /cite/{type}/{slug}
GET /cite/{type-slug}
```

### Examples
```
GET /cite/substance/alkohol
GET /cite/substance-alkohol
```

### Response
```json
{
  "cite_id": "strim:substance:alkohol",
  "canonical_url": "https://strim.se/data/substans/alkohol",
  "permanent_id": "uuid...",
  "title": "Alkohol",
  "type": "substance",
  "definition": "...",
  "checksum": "sha256...",
  "version": 1,
  "last_verified": "2026-02-01T00:00:00Z",
  "citations": {
    "apa": "STRIM. (2026). Alkohol. Stiftelsen för samordning...",
    "harvard": "STRIM (2026) Alkohol [Online]...",
    "bibtex": "@misc{strim_alkohol,...}",
    "json_ld": {...}
  },
  "trust": {
    "source_count": 3,
    "has_primary_sources": true,
    "last_updated": "2026-02-01T00:00:00Z",
    "verification_status": "verified"
  }
}
```

---

## 🗺️ Sitemaps

### Index
```
GET /sitemap.xml
```

### Per typ
```
GET /sitemap-substances.xml
GET /sitemap-diagnoses.xml
GET /sitemap-treatments.xml
GET /sitemap-legal.xml
GET /sitemap-statistics.xml
GET /sitemap-terms.xml
```

---

## 📊 Schema.org Mappings

| STRIM typ | Schema.org typ |
|-----------|----------------|
| Substance | Drug |
| Diagnosis | MedicalCondition |
| Treatment | MedicalTherapy |
| Legal | Legislation |
| Statistic | Dataset |
| Term | DefinedTerm |

---

## 🔗 Relationstyper

| Kod | Svenska | Beskrivning |
|-----|---------|-------------|
| `causes` | orsakar | Substans → Diagnos |
| `treated_by` | behandlas_med | Diagnos → Behandling |
| `regulated_by` | regleras_av | Substans/Behandling → Lag |
| `affects` | påverkar | Lag → Substans/Behandling |
| `measures` | mäts_av | Statistik → Entitet |
| `defines` | beskrivs_av | Begrepp → Entitet |
| `related_to` | relaterar_till | Generisk |
| `replaced_by` | ersätts_av | Historisk succession |
| `contraindicates` | kontraindikerar | Behandling → Diagnos |

---

## ⚡ Cache Headers

```http
Cache-Control: public, max-age=3600, s-maxage=86400
X-Cite-Version: 1
X-Cite-Checksum: sha256...
```

---

## 📜 Attribution

```
STRIM - Stiftelsen för samordning och riktlinjer för missbruksvård
https://strim.se
License: CC BY 4.0
```

---

## 🤖 AI-Native Design

Denna API är designad för:
- **RAG-system** (Retrieval-Augmented Generation)
- **Faktaverifiering** via `/cite/`
- **Knowledge Graph-indexering** via JSON-LD
- **Sitemap-crawling** för systematisk indexering

Varje response innehåller tillräcklig kontext för att ett AI-system ska kunna:
1. Verifiera påståenden
2. Citera källor korrekt
3. Förstå relationer mellan entiteter
4. Identifiera osäkerhet och begränsningar

---

*STRIM API v1 — 2026*
