# National Operational Governance Framework (NOGF)

**Version 1.0**  
**Status: Formaliserad specifikation**

---

## Sammanfattning

National Operational Governance Framework (NOGF) är ett neutralt, icke-politiskt ledningsramverk för statlig förvaltning. Det möjliggör kontinuerlig, mätbar och spårbar ledning genom aggregerade nyckeltal, tydligt ansvar och systematisk uppföljning av beslut.

---

## Del I — Ramverkets grund

### Syfte

Att möjliggöra kontinuerlig, mätbar och spårbar ledning av en stat genom:
- Aggregerade nyckeltal
- Tydligt ansvar  
- Systematisk uppföljning av beslut

### Vad ramverket är

| Funktion | Beskrivning |
|----------|-------------|
| **Styr- och uppföljningsramverk** | Strukturerad övervakning av nationella tillstånd |
| **Ansvarssystem** | Tydlig koppling mellan indikatorer och ansvariga |
| **Beslutsunderlagssystem** | Faktabaserat underlag utan rekommendationer |

### Vad ramverket inte är

- ❌ **Inte politiskt** — Tar inte ställning för eller emot politiska beslut
- ❌ **Inte normativt** — Säger inte vad som *borde* göras
- ❌ **Inte ideologiskt** — Oberoende av vänster/höger, liberal/konservativ
- ❌ **Inte beslutsfattande** — Fattar inga beslut, endast dokumenterar

> **Kärnprincip**: Ramverket säger *vad som händer*, inte *vad man ska vilja*.

---

## Grundaxiom

Dessa principer är icke-förhandlingsbara. Om något saknas existerar inte ledning.

| # | Axiom | Konsekvens |
|---|-------|------------|
| 1 | All styrning kräver mätning | Utan mått, ingen styrning |
| 2 | All mätning kräver kontext | Utan kontext, ingen mening |
| 3 | All analys kräver spårbarhet | Utan spårbarhet, ingen tillit |
| 4 | Allt ansvar kräver synlighet | Utan synlighet, inget ansvar |
| 5 | All förvaltning kräver uppföljning | Utan uppföljning, ingen förvaltning |

---

## Ledningsdefinition

**Ledning** är förmågan att:

1. **Observera** verkligheten korrekt
2. **Fatta** informerade beslut
3. **Följa upp** effekter
4. **Justera** kontinuerligt

> Allt annat är administration.

---

## Del II — Ramverkets komponenter

### Komponent 1: Nationell indikatoruppsättning

**Krav:**
- 15–20 indikatorer (ej fler, ej färre)
- Tidsserier över minst 10 år
- Fokus på **trender** snarare än absoluta nivåer
- Samma indikatorer över tid (stabilitet)

**Kategorier:**

| Kategori | Fokus | Exempel |
|----------|-------|---------|
| Demografi & Hälsa | Befolkningsutveckling, livslängd | Förväntad livslängd, överdödlighet |
| Arbete & Produktivitet | Arbetskraft, effektivitet | Sysselsättningsgrad, BNP per arbetad timme |
| Ekonomisk bärkraft | Statsfinanser, tillväxt | Skattebasens tillväxt, statsskuldskvot |
| Social stabilitet | Sammanhållning, brottslighet | Förtroende, våldsbrott per capita |
| Kärnsystemfunktion | Kritisk infrastruktur | Vårdköer, energitillgänglighet |
| Infrastruktur | Fysisk kapacitet | Elnätskapacitet, bostadsbyggande |
| Systemrisk & Styrning | Beslutskvalitet, riskexponering | Beredskapslager, beslutsspårbarhet |

---

### Komponent 2: Ansvarsmodell

Varje indikator **måste** ha tre ansvarsnivåer:

| Nivå | Roll | Exempel |
|------|------|---------|
| **Formellt ansvar** | Politisk nivå | Minister/departement |
| **Operativt ansvar** | Myndighet/verk | Myndighetschef |
| **Uppföljningsansvar** | Kontrollorgan | Riksrevision/intern revision |

> **Regel**: Om ingen ansvarar får indikatorn inte finnas i systemet.

**Ansvarsspegel:**

```
┌─────────────────────────────────────────────────────────────┐
│ KPI: Sysselsättningsgrad                                    │
├─────────────────────────────────────────────────────────────┤
│ Formellt ansvar:     Arbetsmarknadsdepartementet            │
│ Operativt ansvar:    Arbetsförmedlingen                     │
│ Uppföljningsansvar:  Riksrevisionen                         │
├─────────────────────────────────────────────────────────────┤
│ Status: ⚠️ Varning (68,2% — mål 75%)                         │
│ Trend:  ↓ -0,3% senaste kvartalet                           │
│ Beslut: 2 aktiva åtgärder registrerade                      │
└─────────────────────────────────────────────────────────────┘
```

---

### Komponent 3: Iakttagelsemodell

Systemet producerar **endast observationer**, aldrig rekommendationer.

**Tillåtna output:**
- ✅ Observationer ("KPI X har sjunkit 5% på 3 månader")
- ✅ Avvikelser ("Avvikelse från 10-årsmedel")
- ✅ Mönster ("Säsongsmönster identifierat")
- ✅ Samband ("Korrelation 0.72 med KPI Y, 18 månaders fördröjning")

**Förbjudna output:**
- ❌ Rekommendationer ("Ni borde...")
- ❌ Värderingar ("Detta är dåligt...")
- ❌ Prioriteringar ("Detta är viktigast...")

> **Regel**: Beslut fattas *utanför* systemet men *loggas i* systemet.

---

### Komponent 4: Spårbar analyskedja

Varje iakttagelse måste kunna brytas ner i 5 nivåer:

```
Nivå 1: Iakttagelse
    └── "Överdödligheten har ökat 4,2%"
    
Nivå 2: Metod
    └── "Beräknat som avvikelse från 5-årsbaslinjen 2015-2019"
    
Nivå 3: Bidragande faktorer
    └── "Åldersgrupp 65+ står för 78% av ökningen"
    
Nivå 4: Datakällor
    └── "Socialstyrelsen dödsorsaksregister, SCB befolkningsstatistik"
    
Nivå 5: Aggregerad datapunkt
    └── "Månadsdata jan-dec 2024, riksnivå"
```

> **Regel**: Ingen "black box". Ingen auktoritet utan bevis.

---

### Komponent 5: Beslut–Utfall-koppling

Alla beslut i systemet måste:

| Krav | Implementation |
|------|----------------|
| **Tidsstämplas** | ISO 8601, automatiskt vid registrering |
| **Kopplas till indikatorer** | Explicit länkning till berörda KPI:er |
| **Följas upp automatiskt** | Schemalagd jämförelse: förväntat vs faktiskt utfall |

**Beslutslivscykel:**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Beslut     │ → │   Förväntat  │ → │   Faktiskt   │ → │  Effektiv-   │
│   fattat     │    │   utfall     │    │   utfall     │    │   itetsmått  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
    2024-01-15          "−0,5% på       "−0,2% på           35% av
    "Reform X"           12 mån"          12 mån"           förväntan
```

> **Regel**: Beslut utan uppföljning = ogiltigt beslut.

---

### Komponent 6: Kontinuerlig feedback-loop

| Frekvens | Aktivitet |
|----------|-----------|
| **Daglig** | Automatisk datainsamling |
| **Veckovis** | Avvikelserapport till operativ nivå |
| **Månadsvis** | Statusrapport till departementsnivå |
| **Kvartalsvis** | Samlad nationell lägesbild |

**Principer:**
- Små, kontinuerliga justeringar
- Ingen "reformretorik"
- Ingen väntan på fleråriga "utvärderingar"
- Korrigering sker löpande

---

## Del III — Referensimplementation

### Användarroller

#### Roll 1: Statsminister (Nationell överblick)

| Kapabilitet | Beskrivning |
|-------------|-------------|
| Nationell översikt | Alla 20 indikatorer på en skärm |
| Varningssystem | Kritiska avvikelser markerade |
| Beslutsspårning | Alla aktiva beslut och deras status |
| Ansvarsöversikt | Vilka departement har varningar |

#### Roll 2: Departementsansvarig (Sektorfokus)

| Kapabilitet | Beskrivning |
|-------------|-------------|
| Sina indikatorer | Endast relevanta KPI:er |
| Trendanalys | Detaljerad historik och prognoser |
| Ansvarsvy | Underliggande myndigheter |
| Beslutskoppling | Egna besluts effekter |

#### Roll 3: Operativ nivå (Datanivå)

| Kapabilitet | Beskrivning |
|-------------|-------------|
| Datapipelines | Kvalitet och tillgänglighet |
| Insatseffekter | Mätning av genomförda åtgärder |
| Helhetspåverkan | Hur insatser påverkar nationell nivå |

> **Roller är funktionella, inte personliga.**

---

### Systemets huvudflöde

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VARDAGSANVÄNDNING                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Logga in                                                           │
│      │                                                                  │
│      ▼                                                                  │
│   2. Se översikt (20 KPI:er)                                            │
│      │                                                                  │
│      ▼                                                                  │
│   3. Identifiera avvikelse (röd/gul markering)                          │
│      │                                                                  │
│      ▼                                                                  │
│   4. Klicka ner → förstå varför (5-nivåsanalys)                         │
│      │                                                                  │
│      ▼                                                                  │
│   5. Fatta beslut (UTANFÖR systemet)                                    │
│      │                                                                  │
│      ▼                                                                  │
│   6. Logga beslutet (I systemet)                                        │
│      │                                                                  │
│      ▼                                                                  │
│   7. Följ utfallet automatiskt                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Ansvarssynlighet

Systemet ska alltid kunna svara på dessa frågor:

| Fråga | Svar från systemet |
|-------|-------------------|
| Vilken indikator försämras? | Konkret KPI med trend |
| Vem har ansvar? | Departement + myndighet |
| Vad har gjorts? | Registrerade beslut/åtgärder |
| Vad hände? | Faktiskt utfall vs förväntat |
| Vad hände sedan? | Efterföljande justeringar |

> **Utan värdering. Utan skuld. Med fakta.**

---

## Del IV — Positionering

### Varför detta inte är kontroversiellt

Systemet:
- ❌ Säger **inte** vad man ska göra
- ❌ Säger **inte** vem som har rätt
- ❌ Säger **inte** vilken ideologi som är bäst

Systemet:
- ✅ Säger: *"Detta hände när detta gjordes."*

> **Det är revision, inte politik.**

### Varför detta kan införas var som helst

Alla samhällen har:
- Resurser
- Beslut
- Konsekvenser

Alla ledare, oavsett land, behöver:
- Veta vad som händer
- Veta om de lyckas
- Veta när de inte gör det

---

## Del V — Den sakliga slutsatsen

### Varför systemet saknas

Det saknas **inte** för att:
- ❌ Världen inte kan bygga det
- ❌ Världen inte förstår det
- ❌ Världen inte har data

Det saknas för att:

> **Det gör ledning mätbar och ansvar kontinuerligt. Och det är krävande.**

---

## Bilaga A: Teknisk datamodell

### Entiteter

```
kpi_definitions          →  Indikatorspecifikationer
kpi_values               →  Tidsseridata per indikator
observations             →  Systemgenererade iakttagelser
analysis_chains          →  5-nivåsanalyskedjor
factor_contributions     →  Bidragande faktorer per analys
data_sources             →  Datakälleregister
data_lineage             →  Spårbarhet till rådata
policy_decisions         →  Registrerade beslut
decision_timeline        →  Kronologisk beslutshistorik
action_options           →  Möjliga åtgärdsalternativ
action_evaluations       →  Bedömning av åtgärder
evaluation_weights       →  Viktkonfiguration för prioritering
```

### Relationer

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ kpi_definitions │──────▶│   kpi_values    │──────▶│  observations   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │                        │
         │                         │                        ▼
         │                         │               ┌─────────────────┐
         │                         │               │ analysis_chains │
         │                         │               └─────────────────┘
         │                         │                        │
         ▼                         ▼                        ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  data_sources   │──────▶│  data_lineage   │◀──────│factor_contribut.│
└─────────────────┘       └─────────────────┘       └─────────────────┘
         
┌─────────────────┐       ┌─────────────────┐
│policy_decisions │──────▶│decision_timeline│
└─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│ action_options  │──────▶│action_evaluation│
└─────────────────┘       └─────────────────┘
```

---

## Bilaga B: API-kontrakt

### Endpoints

| Endpoint | Metod | Beskrivning |
|----------|-------|-------------|
| `/kpi-api` | GET | Hämta KPI-definitioner och värden |
| `/analyze-kpi` | POST | Trigga djupanalys av specifik KPI |
| `/kpi-decisions` | GET/POST | Läs/registrera beslut |
| `/kpi-forecast` | POST | Generera prognos |
| `/prioritize-actions` | POST | Beräkna åtgärdsprioritering |

---

## Bilaga C: Implementeringsstatus

| Komponent | Status | Kommentar |
|-----------|--------|-----------|
| Indikatoruppsättning (20 KPI) | ✅ Implementerad | 7 kategorier, fullständig tidsserie |
| Ansvarsmodell | ✅ Implementerad | Departementsvy med KPI-koppling |
| Iakttagelsemodell | ✅ Implementerad | Observation + analyskedja |
| Spårbar analyskedja | ✅ Implementerad | 5-nivåsdjup |
| Beslut-utfall-koppling | ⚠️ Delvis | UI finns, databasintegration pågår |
| Kontinuerlig feedback | ⚠️ Delvis | Manuell uppdatering, automation saknas |

---

## Dokumenthistorik

| Version | Datum | Förändring |
|---------|-------|------------|
| 1.0 | 2026-02-01 | Initial formalisering |

---

*Detta dokument beskriver ramverket NOGF och dess referensimplementation. Det är avsett som ett neutralt, icke-politiskt underlag för diskussion och vidareutveckling.*
