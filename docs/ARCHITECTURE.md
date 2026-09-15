# Nationellt Ledningssystem - Fullständig Systemarkitektur

> **Version:** 2.0 | **Uppdaterad:** 2026-02-01

---

## Executive Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │  Decision   │  │  Analysis   │  │  Administration     │ │
│  │   Views     │  │   Engine    │  │   Tools     │  │      Panel          │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         └────────────────┴────────────────┴─────────────────────┘           │
│                    React + TypeScript + TanStack Query                       │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                    │
│                    Supabase Edge Functions (Deno)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐      │
│  │ kpi-api  │ │kpi-ingest│ │kpi-fore- │ │prioritize│ │ kpi-decisions│      │
│  │          │ │          │ │  cast    │ │ -actions │ │              │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘      │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│     AI LAYER        │ │    DATA LAYER       │ │  EXTERNAL SOURCES   │
│  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │
│  │ AI Gateway    │  │ │  │  PostgreSQL   │  │ │  │     SCB       │  │
│  │               │  │ │  │  (Supabase)   │  │ │  │   Kolada      │  │
│  │               │  │ │  │               │  │ │  │   BRÅ m.fl.   │  │
│  │ • Gemini 3    │  │ │  │ • KPI Data    │  │ │  │               │  │
│  │ • GPT-5       │  │ │  │ • Actions     │  │ │  │   17 källor   │  │
│  └───────────────┘  │ │  │ • Evaluations │  │ │  └───────────────┘  │
└─────────────────────┘ │  └───────────────┘  │ └─────────────────────┘
                        └─────────────────────┘
```

---

## 1. Frontend Layer

### 1.1 Teknologistack

| Komponent | Teknologi | Version | Syfte |
|-----------|-----------|---------|-------|
| Framework | React | 18.3.x | UI-ramverk |
| Språk | TypeScript | 5.x | Typsäkerhet |
| Build Tool | Vite | 5.x | Snabb utveckling |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Komponenter | shadcn/ui | Latest | Tillgängliga UI-komponenter |
| State | TanStack Query | 5.x | Server state management |
| Routing | React Router | 6.x | SPA-navigering |
| Charts | Recharts | 2.x | Datavisualisering |

### 1.2 Komponentarkitektur

```
src/
├── components/
│   ├── ui/                      # shadcn/ui baskomponenter
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...                  # 40+ UI-primitiver
│   │
│   └── dashboard/               # Domänspecifika komponenter
│       ├── AppHeader.tsx        # Huvudnavigering & systemstatus
│       ├── BottomNav.tsx        # Mobilnavigering (5 flikar)
│       ├── OverviewHeader.tsx   # KPI-summering & periodval
│       ├── CategorySection.tsx  # Kollapsbar kategorigrupp
│       ├── KPICard.tsx          # Enskild KPI-visning
│       ├── KPIDetailPanel.tsx   # Slide-over detaljpanel
│       ├── PriorityMatrix.tsx   # Beslutsprioriteringsmatris
│       ├── DecisionPriorityPanel.tsx  # Wrapper för beslutsstöd
│       ├── NewActionForm.tsx    # Skapa åtgärdsförslag
│       ├── ForecastPanel.tsx    # AI-prognoser
│       └── HistoryPanel.tsx     # Historisk trend
│
├── hooks/
│   ├── useKPIData.ts            # KPI data fetching & caching
│   ├── use-mobile.tsx           # Responsiv design hook
│   └── use-toast.ts             # Notifikationssystem
│
├── pages/
│   ├── Index.tsx                # Huvuddashboard
│   └── NotFound.tsx             # 404-sida
│
├── types/
│   └── kpi.ts                   # KPI TypeScript interfaces
│
├── data/
│   └── mockKPIs.ts              # Fallback mock-data (20 KPI:er)
│
├── config/
│   └── dataSourcesConfig.ts     # Datakällekonfiguration (17 källor)
│
└── integrations/
    └── supabase/
        ├── client.ts            # Supabase-klient (auto-genererad)
        └── types.ts             # Databastyper (auto-genererad)
```

### 1.3 Designsystem

```css
/* Semantiska färgvariabler (HSL-format) */
:root {
  /* Bas */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  
  /* KPI-statusfärger */
  --positive: 142 71% 45%;      /* Grön - allt bra */
  --warning: 38 92% 50%;        /* Orange - uppmärksamhet krävs */
  --critical: 0 84% 60%;        /* Röd - akut */
  --neutral: 215 16% 47%;       /* Grå - stabil/okänd */
}
```

### 1.4 Data Flow Pattern

```typescript
// Server state med TanStack Query
const { data: kpis, isLoading } = useQuery({
  queryKey: ['kpi_overview'],
  queryFn: async () => {
    const { data } = await supabase
      .from('kpi_values')
      .select('*, kpi_definitions(*)')
      .order('period_end', { ascending: false });
    return transformToKPIs(data);
  },
  staleTime: 5 * 60 * 1000,  // 5 min cache
});

// Mutations med invalidering
const mutation = useMutation({
  mutationFn: (payload) => 
    supabase.functions.invoke('prioritize-actions', { body: payload }),
  onSuccess: () => queryClient.invalidateQueries(['action_evaluations']),
});
```

---

## 2. API Gateway Layer

### 2.1 Edge Functions

| Funktion | Syfte | Metod | Rate Limit |
|----------|-------|-------|------------|
| `kpi-api` | CRUD för KPI-värden | GET/POST | 100/min |
| `kpi-ingest` | Datainsamling från externa källor | POST | 10/min |
| `kpi-forecast` | AI-driven prognos | POST | 20/min |
| `kpi-decisions` | Hämta beslutsstöd | GET | 50/min |
| `prioritize-actions` | AI-utvärdering av åtgärder | POST | 10/min |

### 2.2 Edge Function Template

```typescript
// supabase/functions/[name]/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // Business logic...
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

---

## 3. AI Layer

### 3.1 AI Gateway

```
┌─────────────────────────────────────────────────────────────────┐
│                         AI GATEWAY                               │
│              (configured via environment variables)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   GOOGLE GEMINI                    OPENAI GPT                   │
│   ─────────────                    ──────────                   │
│   gemini-3-pro-preview             gpt-5                        │
│   gemini-3-flash-preview ★         gpt-5-mini                   │
│   gemini-2.5-pro                   gpt-5-nano                   │
│   gemini-2.5-flash                 gpt-5.2                      │
│   gemini-2.5-flash-lite                                         │
│                                                                  │
│   ★ = Standardmodell (balans hastighet/kvalitet)                │
│                                                                  │
│   Autentisering: AI_API_KEY                                     │
│   Felhantering: 429 = Rate limit, 402 = Krediter slut           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 AI-funktioner i systemet

| Funktion | Modell | Användning |
|----------|--------|------------|
| **Beslutsprioritering** | gemini-3-flash-preview | Viktar åtgärder mot effekt, kostnad, risk, reversibilitet |
| **KPI-prognoser** | gemini-2.5-flash | Tidsserieanalys & trendprediktion |
| **Anomalidetektion** | gemini-2.5-flash-lite | Identifierar avvikande värden |
| **Executive Summaries** | gemini-3-flash-preview | Genererar lägesrapporter |
| **Dokumentanalys** | gemini-2.5-pro | Analyserar utredningar & PM |

### 3.3 Beslutsprioriteringsalgoritm

```
┌─────────────────────────────────────────────────────────────────┐
│              BESLUTSPRIORITERING - VIKTNINGSMODELL               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   DIMENSION        VIKT    BESKRIVNING                          │
│   ──────────────────────────────────────────────────────────────│
│   Effekt           40%     Förväntad positiv påverkan på        │
│                            målindikatorerna                      │
│                                                                  │
│   Kostnad          25%     Kostnadseffektivitet relativt        │
│                            förväntad nytta                       │
│                                                                  │
│   Risk             20%     Sannolikhet för negativa             │
│                            sidoeffekter (inverterad)             │
│                                                                  │
│   Reversibilitet   15%     Möjlighet att backa vid              │
│                            misslyckande                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│   FORMEL:                                                        │
│   score = (effect × 0.40) + (cost × 0.25) +                     │
│           ((100 - risk) × 0.20) + (reversibility × 0.15)        │
├─────────────────────────────────────────────────────────────────┤
│   PRIORITETSNIVÅER                                               │
│   ≥80: KRITISK  │ ≥65: HÖG │ ≥45: MEDEL │ ≥25: LÅG │ <25: BEVAKA│
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Layer

### 4.1 Databasschema (ERD)

```
┌─────────────────────┐         ┌─────────────────────┐
│   kpi_definitions   │         │     kpi_values      │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)             │◄────────│ kpi_id (FK)         │
│ code                │         │ id (PK)             │
│ name                │         │ value               │
│ description         │         │ previous_value      │
│ category (ENUM)     │         │ trend (ENUM)        │
│ unit                │         │ trend_percent       │
│ rationale           │         │ status (ENUM)       │
│ is_inverted         │         │ confidence          │
│ kpi_index           │         │ period_start/end    │
│ red_flag_conditions │         │ data_source_id (FK) │
└─────────────────────┘         └─────────────────────┘
         │
         ▼
┌─────────────────────┐         ┌─────────────────────┐
│   action_options    │         │ action_evaluations  │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)             │◄────────│ action_id (FK)      │
│ title               │         │ id (PK)             │
│ description         │         │ effect_score        │
│ target_kpi_ids[]    │         │ cost_score          │
│ category            │         │ risk_score          │
│ responsible_dept    │         │ reversibility_score │
│ estimated_cost_sek  │         │ weighted_score      │
│ status (ENUM)       │         │ priority (ENUM)     │
│ proposed_at         │         │ *_rationale (×4)    │
└─────────────────────┘         │ summary             │
                                │ recommendation      │
┌─────────────────────┐         │ kpi_impact_forecast │
│   data_sources      │         │ evaluated_at        │
├─────────────────────┤         └─────────────────────┘
│ id (PK)             │
│ code                │         ┌─────────────────────┐
│ name                │         │ evaluation_weights  │
│ source_type (ENUM)  │         ├─────────────────────┤
│ base_url            │         │ effect_weight: 0.40 │
│ api_endpoint        │         │ cost_weight: 0.25   │
│ update_frequency    │         │ risk_weight: 0.20   │
│ requires_auth       │         │ reversibility: 0.15 │
│ reliability_score   │         │ is_active           │
│ last_successful_fetch         └─────────────────────┘
└─────────────────────┘
```

### 4.2 Enum-typer

```sql
-- KPI-kategorier (7 systemområden)
CREATE TYPE kpi_category AS ENUM (
  'demografi_halsa',        -- A. Demografi & Hälsa
  'arbete_produktivitet',   -- B. Arbete & Produktivitet
  'ekonomisk_barkraft',     -- C. Ekonomisk Bärkraft
  'social_stabilitet',      -- D. Social Stabilitet
  'karnsystem_funktion',    -- E. Kärnsystemfunktion
  'infrastruktur',          -- F. Infrastruktur
  'systemrisk_styrning'     -- G. Systemrisk & Styrning
);

-- Statusfärger
CREATE TYPE kpi_status AS ENUM ('positive', 'warning', 'critical', 'neutral');

-- Trendriktning
CREATE TYPE trend_direction AS ENUM ('up', 'down', 'stable');

-- Åtgärdsstatus
CREATE TYPE action_status AS ENUM (
  'proposed', 'under_review', 'approved', 
  'in_progress', 'completed', 'rejected', 'deferred'
);

-- Prioritetsnivå
CREATE TYPE priority_level AS ENUM ('critical', 'high', 'medium', 'low', 'monitor');
```

---

## 5. Externa Datakällor

### 5.1 Datakällor (17 st)

| Myndighet | API | Autentisering | KPI:er |
|-----------|-----|---------------|--------|
| **SCB** | PxWebApi 2.0 | Ingen | Befolkning, Överdödlighet, Produktivitet |
| **Socialstyrelsen** | REST | Ingen | Vårdkötider |
| **Kolada** | REST v3 | Ingen | Regionala nyckeltal |
| **Arbetsförmedlingen** | REST | API-nyckel | Sysselsättning |
| **Svenska Kraftnät** | MIMER | Ingen | Effektbalans |
| **Riksgälden** | REST | Ingen | Statsskuld |
| **BRÅ** | Manuell fil | - | Våldsbrott |
| **Försäkringskassan** | Manuell fil | - | Sjuktal |

### 5.2 Ingest Pipeline

```
SCHEDULE → FETCH → TRANSFORM → VALIDATE → STORE → NOTIFY
    │         │         │           │         │        │
    ▼         ▼         ▼           ▼         ▼        ▼
  Cron     API call   Normalize   Anomaly   Insert   Realtime
           + auth     + map       check     + trend   update
```

---

## 6. Säkerhet & Behörighet

### 6.1 Nuvarande säkerhet

| Nivå | Åtgärd | Status |
|------|--------|--------|
| Transport | HTTPS | ✅ |
| API | CORS | ✅ |
| Database | RLS policies | ✅ |
| Secrets | Env variables | ✅ |
| Encryption | At-rest (Supabase) | ✅ |

### 6.2 Planerad rollmodell

| Roll | Behörigheter |
|------|--------------|
| **Statsminister** | Full läsning, prioriterade vyer, summaries |
| **Departementschef** | Fullt eget område, begränsat andra |
| **Myndighetsrep** | Läs relevanta KPI:er, föreslå åtgärder |
| **Analytiker** | Full läsning, skapa prognoser, export |
| **Systemadmin** | Allt + användarhantering |

---

## 7. Deployment

### 7.1 Miljöer

| Miljö | URL | Syfte |
|-------|-----|-------|
| Preview | `<preview-url>` | Utveckling |
| Production | Publicerad | Live |

### 7.2 Deploy-flöde

```
Code Change → Auto Preview → Edge Deploy (auto) → DB Migration (manual) → Publish
```

---

## 8. Roadmap

```
FAS 1: FOUNDATION ✅
├── KPI-definitioner & mockdata
├── Dashboard-UI med kategorier
├── Beslutsprioriteringsmotor
└── Edge functions arkitektur

FAS 2: DATA INTEGRATION 🔜
├── SCB PxWebApi integration
├── Kolada API integration
└── Schemalagd datainsamling

FAS 3: AUTHENTICATION 🔜
├── Supabase Auth
├── Rollbaserad åtkomst
└── Audit logging

FAS 4: ADVANCED AI 🔜
├── Tidsserieprediktion
├── Anomalidetektion
└── Dokumentanalys

FAS 5: COLLABORATION 🔜
├── Kommentarer
├── Notifikationer
└── Export (PDF/PPT)
```

---

## Appendix: Äldre arkitekturdokumentation

<details>
<summary>Klicka för att expandera originalöversikt</summary>

### Ursprunglig Datakällöversikt

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
```

### Ingest-lager (original)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Scheduler   │    │   Ingestor   │    │  Validator   │
│  (Cron)      │───▶│  (Edge Fn)   │───▶│  (Schema)    │
└──────────────┘    └──────────────┘    └──────────────┘
                           │                   │
                           ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Normalizer  │◀───│  Transform   │◀───│  Raw Store   │
│  (Semantik)  │    │  (Mapping)   │    │  (JSON)      │
└──────────────┘    └──────────────┘    └──────────────┘
```

</details>

---

*Dokumentet senast uppdaterat: 2026-02-01*
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
