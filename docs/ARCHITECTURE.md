# Nationellt Ledningssystem - Systemarkitektur

## Översikt

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATAKÄLLOR (EXTERNA)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  SCB        Socialstyrelsen    BRÅ        Arbetsförmedlingen    SKR        │
│  PX-Web     Statistikdatabas   Statistik  REST API              Väntetider │
│                                                                              │
│  Skatteverket    ESV    Domstolsverket    Lantmäteriet    Svenska Kraftnät │
│  Inbetalningar   ÖFR    Målstatistik      Lagfarter       MIMER            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INGEST-LAGER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  Scheduler   │    │   Ingestor   │    │  Validator   │                  │
│  │  (Cron)      │───▶│  (Edge Fn)   │───▶│  (Schema)    │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                              │                   │                          │
│                              ▼                   ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  Normalizer  │◀───│  Transform   │◀───│  Raw Store   │                  │
│  │  (Semantik)  │    │  (Mapping)   │    │  (JSON)      │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATALAGER (PostgreSQL)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐    ┌────────────────────┐                          │
│  │   data_sources     │    │   kpi_definitions  │                          │
│  │   (17 källor)      │    │   (20 KPI:er)      │                          │
│  └────────────────────┘    └────────────────────┘                          │
│            │                         │                                       │
│            └─────────┬───────────────┘                                       │
│                      ▼                                                       │
│  ┌────────────────────┐    ┌────────────────────┐                          │
│  │   kpi_values       │    │   kpi_alerts       │                          │
│  │   (Tidsserier)     │    │   (Varningar)      │                          │
│  └────────────────────┘    └────────────────────┘                          │
│            │                                                                 │
│            ▼                                                                 │
│  ┌────────────────────┐    ┌────────────────────┐                          │
│  │   ingest_log       │    │   policy_decisions │                          │
│  │   (Audit trail)    │    │   (Beslutsspårning)│                          │
│  └────────────────────┘    └────────────────────┘                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI-LAGER                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Trend Detection                                │  │
│  │   • Bayesian change-point detection                                  │  │
│  │   • STL decomposition (seasonal/trend)                               │  │
│  │   • Anomaly flagging                                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Change Attribution                             │  │
│  │   • SHAP-liknande förklaringar                                       │  │
│  │   • Kausala hints (ej bevis)                                         │  │
│  │   • Korrelationsanalys                                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Now-casting                                    │  │
│  │   • Interpolering vid saknade perioder                               │  │
│  │   • Osäkerhetsflaggor                                                │  │
│  │   • Datakvalitetsbedömning                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Beslutsstöd (NIVÅ 4)                          │  │
│  │   • Åtgärdsförslag                                                   │  │
│  │   • Effektprognoser                                                  │  │
│  │   • Prioriteringsmatris                                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│                  AI förklarar, prioriterar, varnar. Aldrig beslutar.        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           READ API (Edge Functions)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GET /kpi-api/overview      → Alla 20 KPI:er med senaste värden            │
│  GET /kpi-api/kpi?id=X      → Enskild KPI med fullständig info             │
│  GET /kpi-api/timeseries    → Historisk data för grafer                    │
│  GET /kpi-api/alerts        → Aktiva varningar                             │
│  GET /kpi-api/sources       → Datakällornas status                         │
│                                                                              │
│  POST /kpi-ingest           → Trigger manuell datahämtning (admin)         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React/TypeScript)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  NIVÅ 1 - ÖVERSIKT                                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  7 kategorier × 3-4 KPI:er = 20 nyckeltal                             │ │
│  │  Status (grön/gul/röd) + Trend + Konfidens                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  NIVÅ 2 - FÖRKLARING (click-through)                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Detaljer + Datakällor + Röda flaggor + Trendutveckling               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  NIVÅ 3 - KONSEKVENS (framtida)                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Prognos vid status quo + Tidsfördröjning + Irreversibilitet          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  NIVÅ 4 - BESLUTSSTÖD (framtida)                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Åtgärdsförslag + Viktning + Osäkerhet                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  NIVÅ 5 - UPPFÖLJNING (framtida)                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Beslut → Effekt → Justering                                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Dataflöde

```
                    PULL (Schemalagt)
                         │
     ┌───────────────────┴───────────────────┐
     │                                       │
     ▼                                       ▼
┌─────────┐                           ┌─────────┐
│  Källa  │                           │  Källa  │
│  (SCB)  │                           │  (BRÅ)  │
└────┬────┘                           └────┬────┘
     │                                     │
     ▼                                     ▼
┌─────────────────────────────────────────────────┐
│              INGEST EDGE FUNCTION               │
│  1. Validera schema                             │
│  2. Tidsstämpla                                 │
│  3. Normalisera till gemensam semantik          │
│  4. Aggregera (nation/region/kommun/vecka)      │
│  5. Beräkna trend & status                      │
│  6. Logga i audit trail                         │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              PostgreSQL (Supabase)              │
│                                                 │
│  kpi_values                                     │
│  ├─ kpi_id                                      │
│  ├─ period_start / period_end                   │
│  ├─ value / previous_value                      │
│  ├─ status (enum: positive/warning/critical)    │
│  ├─ trend (enum: up/down/stable)                │
│  ├─ trend_percent                               │
│  ├─ confidence (0-100)                          │
│  ├─ raw_data (JSONB - originalkälla)            │
│  └─ created_at / updated_at                     │
│                                                 │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              AI-ANALYS (FRAMTIDA)               │
│                                                 │
│  • Trenddetektering                             │
│  • Kausalitetshints                             │
│  • Now-casting                                  │
│  • Förklaringar                                 │
│                                                 │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              READ API (Edge Function)           │
│                                                 │
│  Läs-separerat från ingest för säkerhet         │
│                                                 │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              DASHBOARD (React)                  │
│                                                 │
│  Real-time polling var 5:e minut                │
│  Visar röd/gul/grön + trend                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Uppdateringsschema

| Källa | Frekvens | Tid (UTC) |
|-------|----------|-----------|
| Svenska Kraftnät | Daglig | 04:00 |
| Socialstyrelsen (överdödlighet) | Veckovis | 07:00 |
| SKR Väntetider | Veckovis | 05:00 |
| BRÅ | Månadsvis | 08:00 |
| SCB | Månadsvis | 06:00 |
| Arbetsförmedlingen | Veckovis | 06:30 |
| Interna beräkningar | Veckovis | 09:00 |

## Säkerhet & Compliance

- **RLS aktiverat**: Alla tabeller
- **Läs-only för dashboard**: Inget skrivåtkomst via frontend
- **Audit trail**: Fullständig logg på all ingest
- **Källspårbarhet**: Varje datapunkt kopplad till källa
- **Ingen persondata**: Endast aggregerad styrdata
