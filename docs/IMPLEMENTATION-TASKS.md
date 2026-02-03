# IMPLEMENTERINGS-TASKS

## Baserat på MASTERPROMPT v1.0

---

## 📊 ÖVERSIKT

| Fas | Namn | Prioritet | Status |
|-----|------|-----------|--------|
| 0 | Infrastruktur & Datamodeller | 🔴 Kritisk | Ej påbörjad |
| 1 | Prioriteringsmotorn | 🔴 Kritisk | Ej påbörjad |
| 2 | Lambda-motorn | 🔴 Kritisk | Delvis |
| 3 | Förklaringsmotorn | 🟡 Hög | Delvis |
| 4 | Tidslinje- & Årsrapportmotorn | 🟡 Hög | Ej påbörjad |
| 5 | Prognosmotorn | 🟢 Medium | Ej påbörjad |
| 6 | Ansvars- & Beslutsmotorn | 🟢 Medium | Ej påbörjad |
| 7 | Verifiering & Transparens | 🟡 Hög | Delvis |
| 8 | Global UX-standard | 🟡 Hög | Ej påbörjad |

---

## FAS 0: INFRASTRUKTUR & DATAMODELLER

### 0.1 Kärnschema (Beroende: Ingen)
```
Priority: CRITICAL
Dependencies: None
Est. time: 2-3 dagar
```

**Tasks:**
- [ ] `kpi_definitions` - Alla mätbara index med metadata
- [ ] `data_sources` - Källregister med reliabilitetsscore
- [ ] `data_lineage` - Spårbarhet från rådata till visualisering
- [ ] `countries` / `regions` / `municipalities` - Geografisk hierarki
- [ ] `time_series_values` - Tidsstämplade värden med osäkerhetsintervall

### 0.2 Normaliserings-engine (Beroende: 0.1)
```
Priority: CRITICAL
Dependencies: 0.1
Est. time: 1-2 dagar
```

**Tasks:**
- [ ] Z-score normalisering per indikator
- [ ] Min-max skalning med outlier-hantering
- [ ] Viktningslogik per domän
- [ ] Aggregeringsregler (geo, tid, demografi)

### 0.3 API-lager (Beroende: 0.1, 0.2)
```
Priority: HIGH
Dependencies: 0.1, 0.2
Est. time: 2-3 dagar
```

**Tasks:**
- [ ] REST endpoints: `/api/v1/indicators`, `/api/v1/lambda`, `/api/v1/compare`
- [ ] Query DSL implementation (what, where, when, who, ops, output)
- [ ] Rate limiting per licensnivå
- [ ] Webhook-registrering för dataförändringar

---

## FAS 1: PRIORITERINGSMOTORN

### 1.1 Prioritetsformel (Beroende: 0.1)
```
Priority: CRITICAL
Dependencies: 0.1
Est. time: 2 dagar
```

**Formel:**
```typescript
Priority = (Impact × Scope × Urgency) ÷ Reversibility
```

**Tasks:**
- [ ] Impact-score: Kvantifierad effekt på population
- [ ] Scope-score: Geografisk/demografisk omfattning
- [ ] Urgency-score: Tidshorisont och acceleration
- [ ] Reversibility-score: Hur lätt att ångra/korrigera
- [ ] Viktningslogik: Konfigurerbar per kontext

### 1.2 Topp-N beräkning (Beroende: 1.1)
```
Priority: HIGH
Dependencies: 1.1
Est. time: 1 dag
```

**Tasks:**
- [ ] Global topp 5
- [ ] Nationell topp 5 (per land)
- [ ] Regional topp 5 (per region)
- [ ] "Oviktigt trots uppmärksamhet" - låg score, hög medieexponering

### 1.3 UI: PriorityDashboard (Beroende: 1.2)
```
Priority: HIGH
Dependencies: 1.2
Est. time: 2 dagar
```

**Tasks:**
- [ ] `<PriorityRanking />` - Topp 5 med förklaring
- [ ] `<AttentionMismatch />` - Skillnad media vs faktisk prioritet
- [ ] `<PriorityHistory />` - Hur prioriteringen förändrats

---

## FAS 2: LAMBDA-MOTORN (INDEX)

### 2.1 Index-registrering (Beroende: 0.1)
```
Priority: CRITICAL
Dependencies: 0.1
Est. time: 3 dagar
Status: DELVIS KLAR
```

**Existerande index (i system):**
- [x] Big Mac Index
- [x] Health Index
- [x] Education Index
- [ ] Housing Index
- [ ] Violence Index
- [ ] Productivity Index
- [ ] Resource Leakage Index
- [ ] Inequality Index

**Tasks:**
- [ ] Komplettera alla 24+ index med metadata
- [ ] Normalisering per index
- [ ] Korrelationsmatris mellan index

### 2.2 Lambda-beräkning (Beroende: 2.1)
```
Priority: CRITICAL
Dependencies: 2.1
Est. time: 2 dagar
Status: DELVIS KLAR
```

**Tasks:**
- [x] Lambda-formel: `λ = S_observed / S_optimal`
- [x] Femdomäns-aggregering (Liv, Försörjning, Kunskap, Stabilitet, Resurs)
- [ ] Historisk Lambda-serie per geo
- [ ] Avvikelsedetektering med orsaksmarkering

### 2.3 UI: LambdaDashboard (Beroende: 2.2)
```
Priority: HIGH
Dependencies: 2.2
Status: DELVIS KLAR
```

**Tasks:**
- [x] `<LambdaGauge />` - Visuell indikator
- [x] `<LambdaSummary />` - Textuell sammanfattning
- [ ] `<LambdaDrivers />` - Vad driver avvikelsen
- [ ] `<LambdaHistory />` - Tidsserie med beslutsmarkörer

---

## FAS 3: FÖRKLARINGSMOTORN

### 3.1 Tre-nivå-system (Beroende: 0.1)
```
Priority: HIGH
Dependencies: 0.1
Est. time: 2 dagar
Status: KLAR
```

**Tasks:**
- [x] Nivå 1: "Vad ser jag?"
- [x] Nivå 2: "Varför ser det ut så?"
- [x] Nivå 3: "Hur vet vi detta?"

### 3.2 Språkvalidering (Beroende: 3.1)
```
Priority: HIGH
Dependencies: 3.1
Status: KLAR
```

**Tasks:**
- [x] Förbjudna ord (jargong, byråkratiska, politiska, värdeladdade)
- [x] Automatisk varning vid överträdelse
- [ ] AI-genererad förenkling med kvalitetskontroll

### 3.3 Antagandeexponering (Beroende: 3.1)
```
Priority: HIGH
Dependencies: 3.1
Status: KLAR
```

**Tasks:**
- [x] `<AssumptionExposer />` - Alla antaganden synliga
- [x] Toggle-funktion: se hur resultat ändras
- [ ] "Vad händer om"-simulering

### 3.4 Kontextuell siffervisning (Beroende: 3.1)
```
Priority: HIGH
Dependencies: 3.1
Status: KLAR
```

**Tasks:**
- [x] `<NumberWithContext />` - Tre obligatoriska frågor
- [x] Intuitiva jämförelser (per person, arbetstid, livstid)
- [x] Varningar vid smal zoom / ovanliga perioder

---

## FAS 4: TIDSLINJE- & ÅRSRAPPORTMOTORN

### 4.1 Tidslinjekärna (Beroende: 0.1, 2.1)
```
Priority: HIGH
Dependencies: 0.1, 2.1
Est. time: 3 dagar
```

**Tasks:**
- [ ] `decision_timeline` - Beslutsmarkering på tidsserier
- [ ] `policy_periods` - Ansvarsperioder (regeringar, ministrar)
- [ ] `events` - Externa chocker (pandemi, kris)
- [ ] Länkning: beslut → utfall

### 4.2 Årsrapportgenerering (Beroende: 4.1)
```
Priority: HIGH
Dependencies: 4.1
Est. time: 2 dagar
```

**Struktur per rapport:**
1. Orientering (max 5 nyckelrörelser)
2. Lång tidslinje
3. Beslut markerade i grafer
4. Orsaksanalys
5. Jämförelser
6. Konsekvensriktning

**Tasks:**
- [ ] `<YearInReview />` - Huvudkomponent
- [ ] `<KeyMovements />` - Topp 5 förändringar
- [ ] `<DecisionImpact />` - Beslut → utfall
- [ ] PDF-export med QR-verifiering

### 4.3 Nivåer (Beroende: 4.2)
```
Priority: MEDIUM
Dependencies: 4.2
```

**Tasks:**
- [ ] Global årsrapport
- [ ] Nationell årsrapport
- [ ] Regional årsrapport
- [ ] Kommunal årsrapport

---

## FAS 5: PROGNOSMOTORN

### 5.1 Prognosramverk (Beroende: 0.1, 2.1)
```
Priority: MEDIUM
Dependencies: 0.1, 2.1
Est. time: 3 dagar
```

**Tasks:**
- [ ] Trendextrapolering med konfidensintervall
- [ ] Scenarioanalys (baseline, optimistisk, pessimistisk)
- [ ] Historiska jämförelser ("när såg det likadant ut?")
- [ ] "Trendbrytare" - vad skulle ändra banan

### 5.2 Osäkerhetsvisualisering (Beroende: 5.1)
```
Priority: MEDIUM
Dependencies: 5.1
```

**Tasks:**
- [ ] `<ForecastFan />` - Fläktdiagram med osäkerhet
- [ ] `<HistoricalAccuracy />` - Hur träffsäker modellen varit
- [ ] `<TrendBreakers />` - Vad kan ändra trenden

---

## FAS 6: ANSVARS- & BESLUTSMOTORN

### 6.1 Beslutsmappning (Beroende: 4.1)
```
Priority: MEDIUM
Dependencies: 4.1
Est. time: 2 dagar
```

**Tasks:**
- [ ] `policy_decisions` - Databas över beslut
- [ ] `decision_outcomes` - Kopplade utfall
- [ ] `responsibility_assignments` - Vem hade ansvar
- [ ] Tidsfördröjningslogik (beslut → effekt)

### 6.2 Utfallsanalys (Beroende: 6.1)
```
Priority: MEDIUM
Dependencies: 6.1
```

**Neutralt språk:**
> "Under denna period, med detta ansvar, förändrades detta utfall."

**Tasks:**
- [ ] `<DecisionTrace />` - Beslut → utfall
- [ ] `<BeforeAfter />` - Trend före/efter beslut
- [ ] `<ResponsibilityMap />` - Vem ansvarade

---

## FAS 7: VERIFIERING & TRANSPARENS

### 7.1 Evidence Link System (Beroende: 0.3)
```
Priority: HIGH
Dependencies: 0.3
Status: KLAR
```

**Tasks:**
- [x] SHA-256 checksumming
- [x] Kortkod-generering (XXXX-XXXX)
- [x] QR-kod per visualisering
- [x] API för verifiering

### 7.2 Källspårning (Beroende: 0.1)
```
Priority: HIGH
Dependencies: 0.1
```

**Tasks:**
- [ ] `<SourceChain />` - Klickbar källkedja
- [ ] `<MethodologyNote />` - Metodbeskrivning
- [ ] `<DataFreshness />` - Senast uppdaterad

---

## FAS 8: GLOBAL UX-STANDARD

### 8.1 Designsystem (Beroende: Ingen)
```
Priority: HIGH
Dependencies: None
Est. time: 2 dagar
```

**Regler:**
- Myndighetsblå bas
- Inga dekorativa ikoner
- Allt klickbart
- Mobil = desktop

**Tasks:**
- [ ] Uppdatera design tokens i index.css
- [ ] Standardisera alla komponenter
- [ ] Dark mode (samma neutralitet)
- [ ] Responsiv breakpoints

### 8.2 Global konsistens (Beroende: 8.1)
```
Priority: MEDIUM
Dependencies: 8.1
```

**Tasks:**
- [ ] Samma struktur oavsett språk
- [ ] Alla begrepp definierade och klickbara
- [ ] Obligatoriska block: "Detta visar" / "Detta visar inte"

---

## 📅 REKOMMENDERAD ORDNING

1. **Vecka 1:** Fas 0 (Infrastruktur)
2. **Vecka 2:** Fas 1 (Prioritering) + Fas 2 (Lambda komplettering)
3. **Vecka 3:** Fas 3 (Förklaring komplettering) + Fas 7 (Verifiering)
4. **Vecka 4:** Fas 4 (Tidslinje)
5. **Vecka 5-6:** Fas 5-6 (Prognos, Ansvar)
6. **Löpande:** Fas 8 (UX-standard)

---

## 🔗 BEROENDEGRAF

```
                    ┌─────────────────────────────────────────┐
                    │        FAS 0: INFRASTRUKTUR             │
                    │  (Schema, Normalisering, API)           │
                    └─────────────────┬───────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐         ┌─────────────────┐          ┌─────────────────┐
│ FAS 1:          │         │ FAS 2:          │          │ FAS 3:          │
│ PRIORITERING    │         │ LAMBDA/INDEX    │          │ FÖRKLARING      │
└────────┬────────┘         └────────┬────────┘          └────────┬────────┘
         │                            │                            │
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────┐
                    │        FAS 4: TIDSLINJE                 │
                    │  (Årsrapport, Beslutsmappning)          │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────┼───────────────────────┐
                    │                                         │
                    ▼                                         ▼
          ┌─────────────────┐                       ┌─────────────────┐
          │ FAS 5: PROGNOS  │                       │ FAS 6: ANSVAR   │
          └─────────────────┘                       └─────────────────┘
                    │                                         │
                    └─────────────────┬───────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────┐
                    │     FAS 7: VERIFIERING & TRANSPARENS    │
                    └─────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────┐
                    │        FAS 8: GLOBAL UX-STANDARD        │
                    └─────────────────────────────────────────┘
```

---

*Lambda System v1.0 - Implementeringsplan*
