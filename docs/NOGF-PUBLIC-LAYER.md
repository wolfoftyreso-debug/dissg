# NOGF Public Layer Specification

**Version 1.0**  
**Status: Formaliserad specifikation**  
**Målgrupp: UX-team, frontend-utvecklare, kommunikationsstrateger**

---

## Sammanfattning

Detta dokument specificerar det publika ytanalyslagret för NOGF – en öppen instrumentpanel som ger allmänheten samma lägesbild som ledningen, utan tolkning, retorik eller filter.

> **Kärnprincip**: Samma data. Samma indikatorer. Olika vyer.

---

## 1. Grundprincip

### Vystruktur

| Vy | Målgrupp | Detaljnivå | Access |
|----|----------|------------|--------|
| **Ledningsvy** | Statsminister, departement | Full detalj, intern metadata | Autentiserad |
| **Publik vy** | Allmänheten | Aggregerad, pedagogisk | Öppen |

### Oförhandlingsbar regel

> **Ingen parallell sanning. Ingen "kommunikationsversion".**

---

## 2. Definition: Vad den publika sidan är

### Är

| Egenskap | Beskrivning |
|----------|-------------|
| **Öppen** | Ingen inloggning krävs |
| **Faktabaserad** | Endast verifierbara datapunkter |
| **Lätt att orientera sig i** | Progressiv disclosure |
| **Klickbar på djupet** | Full spårbarhet till källa |
| **Spårbar till källa** | Varje siffra har ursprung |

### Är inte

| Egenskap | Varför inte |
|----------|-------------|
| Opinionsbildning | Systemet tar inte ställning |
| Aktivism | Ingen agenda |
| Politik | Ingen ideologi |
| Kommentarstråd | Ingen debatt |
| Debattforum | Ingen interaktion |

> **Definition**: Det är en publik instrumentpanel.

---

## 3. Publik startsida: "Hur går det för Sverige?"

### Toppsektion: Nationellt läge

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     HUR GÅR DET FÖR SVERIGE?                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │                                                             │     │
│     │                    NATIONELLT LÄGE                          │     │
│     │                                                             │     │
│     │                        🟡                                   │     │
│     │                      OSÄKERT                                │     │
│     │                                                             │     │
│     │     Flera centrala indikatorer visar negativ trend          │     │
│     │              de senaste 3 månaderna.                        │     │
│     │                                                             │     │
│     │              Uppdaterad: 2026-02-01                         │     │
│     │                                                             │     │
│     └─────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Statusnivåer

| Status | Färg | Kriterium |
|--------|------|-----------|
| Stabilt | 🟢 | ≤2 varningar, 0 kritiska |
| Osäkert | 🟡 | 3-5 varningar, ≤1 kritisk |
| Försämras | 🔴 | >5 varningar ELLER >1 kritisk |

### Textregel

> **Inget tyckande. Bara läge.**

---

## 4. KPI-presentation (publik)

### Kortformat

Varje KPI visas som:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📊 Arbetsför ålder i arbete                                   🟡 68,2%  │
├─────────────────────────────────────────────────────────────────────────┤
│ Visar hur stor del av befolkningen som faktiskt kan arbeta             │
│ och bidra till samhället.                                              │
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────┐       │
│ │ ▁▂▃▄▅▆▇▆▅▄▃▂▁                                                │       │
│ │           ↘ -0,3%                                            │       │
│ └───────────────────────────────────────────────────────────────┘       │
│                                                                         │
│                                          [Läs mer →]                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Komponenter

| Element | Beskrivning |
|---------|-------------|
| **Namn** | Folkligt begripligt, ej tekniskt |
| **Förklaring** | "Vad mäter detta?" – max 2 meningar |
| **Aktuellt värde** | Senaste datapunkt |
| **Trend** | Pil + procentförändring |
| **Färgstatus** | 🟢/🟡/🔴 |
| **Mini-tidslinje** | Sparkline, 12 månader |

---

## 5. Fördjupningsvy

### A. Tidslinje (full historik)

- Samma diagram som ledningsvyn
- Samma beslutmarkeringar
- Samma brytpunkter
- Interaktiv zoom

### B. "Vad ser vi?"

Kort sammanfattning i klarspråk:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ VAD SER VI?                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Denna indikator har försämrats sedan juli 2023.                         │
│                                                                         │
│ Förändringen sammanfaller med:                                          │
│ • Demografisk förskjutning (åldrande befolkning)                        │
│ • Minskad arbetskraftsinvandring                                        │
│                                                                         │
│ Inget beslut registrerat under perioden.                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### C. "Hur vet vi det?"

Expanderbar sektion:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HUR VET VI DET?                                               [Visa ▼] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 1. ANALYSMETOD                                                          │
│    Trendanalys med 12-månaders glidande medelvärde                      │
│    Konfidensgrad: 82%                                                   │
│                                                                         │
│ 2. BIDRAGANDE FAKTORER                                                  │
│    • Åldersgrupp 55-64: 45% av förändringen                             │
│    • Åldersgrupp 25-34: 28% av förändringen                             │
│                                                                         │
│ 3. DATAKÄLLA                                                            │
│    SCB Arbetskraftsundersökningen (AKU)                                 │
│    Uppdateras: Månadsvis                                                │
│    Tillförlitlighet: Hög (95%)                                          │
│                                                                         │
│ 4. OSÄKERHET                                                            │
│    ±1,2 procentenheter (95% konfidensintervall)                         │
│                                                                         │
│                                         [Visa originaldata →]           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Regel**: Pedagogik, inte förenkling av sanningen.

---

## 6. Full spårbarhet

### Klickkedja

```
KPI → Analys → Datakälla → Originalmyndighet
```

### Datapunktsinformation

Varje datapunkt visar:

| Fält | Exempel |
|------|---------|
| **Källa** | SCB, Arbetskraftsundersökningen |
| **Uppdateringsdatum** | 2026-01-15 |
| **Licens** | CC0 (Public Domain) |
| **Begränsningar** | "Säsongsrensad, ej arbetslösa i åtgärder" |

> **Regel**: Inget dolt. Inget "lita på oss".

---

## 7. Ansvarsvisning

### Publik presentation

| Visa | Visa inte |
|------|-----------|
| Ansvarsområde | Personnamn |
| Systemnivå | Politisk färg |
| Departementsansvar | Intern organisation |

### Exempel

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ANSVAR                                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Område:     Hälso- och sjukvårdssystemet                                │
│ Nivå:       Nationell                                                   │
│ Departement: Socialdepartementet                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Regel**: Ingen personexponering. Full strukturell transparens.

---

## 8. Varningsvisning

### Neutral formulering

När något går fel:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ OBSERVERA                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Denna indikator har försämrats under längre tid.                        │
│                                                                         │
│ Inga registrerade förändringar eller beslut är kopplade                 │
│ till perioden.                                                          │
│                                                                         │
│ Senaste förändring: Ingen registrerad sedan 2023-06                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Regel**: Faktum, inte anklagelse.

---

## 9. Juridik & Compliance

### Vad som gör systemet lagligt

| Krav | Implementation |
|------|----------------|
| Endast öppna data | PSI-direktivet, Öppna data-lagen |
| Endast aggregerad data | Inga individer identifierbara |
| Ingen persondata | GDPR-kompatibelt by design |
| Ingen intern information | Endast publicerade källor |
| Full källhänvisning | CC-BY eller motsvarande |

### Vad systemet INTE gör

| Aktivitet | Varför inte |
|-----------|-------------|
| Tolkar lag | Utanför scope |
| Fattar beslut | Endast observation |
| Lämnar rekommendationer | Ingen normativ funktion |

> **Systemet redovisar verkligheten.**

---

## 10. Effektanalys

### Vad medborgaren får

| Före | Efter |
|------|-------|
| Fragmenterad information | Samlad lägesbild |
| Tolkad av media | Otolkad, spårbar |
| Historik okänd | Full historik tillgänglig |
| Samband dolda | Samband visualiserade |
| Informationsasymmetri | Samma data som makten |

### Vad detta tar bort

- Gissningar
- Narrativ
- "Det känns som"
- Informationsasymmetri

---

## 11. Systemarkitektur

### Publik arkitektur

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PUBLIK VY                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│   │   Next.js   │    │    CDN      │    │   Cache     │                 │
│   │   (SSR)     │ ←──│  (Edge)     │ ←──│  (Redis)    │                 │
│   └─────────────┘    └─────────────┘    └─────────────┘                 │
│          │                                     │                        │
│          ▼                                     ▼                        │
│   ┌─────────────────────────────────────────────────────────┐           │
│   │                    PUBLIC READ-API                       │           │
│   │                   (rate-limited)                         │           │
│   └─────────────────────────────────────────────────────────┘           │
│                              │                                          │
│                              ▼                                          │
│   ┌─────────────────────────────────────────────────────────┐           │
│   │              SAMMA BACKEND (Supabase)                    │           │
│   │              SAMMA DATAMODELL                            │           │
│   └─────────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tekniska krav

| Krav | Implementation |
|------|----------------|
| Samma backend | Supabase |
| Samma datamodell | Inga parallella databaser |
| Separat Read-API | public-api edge function |
| Cache + CDN | Stale-while-revalidate |
| Full mobilresponsivitet | Mobile-first design |
| Hög tillgänglighet | 99.9% uptime |

---

## 12. Slutlig definition

### Vad detta inte är

- ❌ Ett oppositionsverktyg
- ❌ Ett granskningsprogram
- ❌ Ett avslöjandesystem

### Vad detta är

> **En öppen instrumentpanel för ett land.**

Motsvarar:
- Balansräkningen
- Resultaträkningen
- Kassaflödet

...för ett helt samhälle.

---

## 13. Komponentspecifikation

### React-komponenter

| Komponent | Beskrivning |
|-----------|-------------|
| `PublicOverview` | Startsida med nationell status |
| `NationalStatusBadge` | Stor statusindikator |
| `PublicKPIGrid` | Rutnät med alla 20 KPI:er |
| `PublicKPICard` | Enskilt KPI-kort (förenklad) |
| `PublicKPIDetail` | Fördjupningsvy |
| `PublicTimeline` | Interaktiv tidslinje |
| `AnalysisExplainer` | "Hur vet vi det?"-sektion |
| `SourceCredits` | Källhänvisningar |
| `ResponsibilityBadge` | Ansvarsområde-display |

### URL-struktur

| Route | Beskrivning |
|-------|-------------|
| `/public` | Startsida |
| `/public/kpi/:code` | KPI-fördjupning |
| `/public/kpi/:code/analysis` | Fullständig analys |
| `/public/sources` | Alla datakällor |
| `/public/about` | Om systemet |

---

## Dokumenthistorik

| Version | Datum | Förändring |
|---------|-------|------------|
| 1.0 | 2026-02-01 | Initial specifikation |

---

*Detta dokument specificerar det publika lagret av NOGF. Det är avsett för UX-, frontend- och kommunikationsteam.*
