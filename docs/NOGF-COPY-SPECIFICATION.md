# NOGF Pedagogical Copy Specification

**Version 1.0**  
**Status: Produktionsklar**  
**Målgrupp: UX-skribenter, frontend-utvecklare**

---

## Grundprincip

> **Alla ska förstå helheten på 30 sekunder – och kunna gräva hur djupt de vill.**

| Krav | Implementation |
|------|----------------|
| Ingen statistikbakgrund krävs | Klarspråk i alla rubriker |
| Ingen politisk kunskap krävs | Strukturellt fokus, ej politiskt |
| Ingen expertjargong i ytan | Tekniska termer i djupnivåer |
| Full spårbarhet i djupet | Klickbar kedja till källa |

---

## 1. Startsidan (30 sekunder)

### Huvudrubrik

```
Hur går det för Sverige just nu?
```

### Statusindikator (sammanvägd)

| Status | Färg | Text |
|--------|------|------|
| Förbättras | 🟢 | "Sverige förbättras" |
| Stabilt med risker | 🟡 | "Sverige är stabilt men med risker" |
| Försämras | 🔴 | "Sverige försämras" |

### Undertext (neutral, faktabaserad)

```
"Flera centrala indikatorer har försämrats de senaste 8 veckorna."
```

eller

```
"De flesta områden visar stabil utveckling. Två områden kräver uppmärksamhet."
```

> **Regel**: Detta är hela svaret för 80% av besökarna.

---

## 2. Översiktssektion (2 minuter)

### Områdesindelning

| Block | Innehåll | Vardagsrelevans |
|-------|----------|-----------------|
| **Hälsa & Liv** | Livslängd, överdödlighet, vårdköer | "Påverkar din och dina närståendes hälsa" |
| **Arbete & Ekonomi** | Sysselsättning, produktivitet, skattebas | "Påverkar jobb och levnadsstandard" |
| **Trygghet & Stabilitet** | Våldsbrott, förtroende, utanförskap | "Påverkar din vardag och säkerhet" |
| **Kärnfunktioner** | Skola, vård, rättsväsende | "Påverkar samhällets grundläggande funktioner" |
| **Infrastruktur & Framtid** | Energi, bostäder, beredskap | "Påverkar Sveriges långsiktiga förmåga" |

### Blockformat

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🟡 Trygghet & Stabilitet                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Detta område påverkar din vardag och säkerhet.                          │
│                                                                         │
│ 3 indikatorer • 1 varning                                               │
│                                                                         │
│                                              [Visa mer →]               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Områdesfördjupning (5 minuter)

### Struktur

**1. Diagram** (ett enda, tydligt)
- Tidslinje med markerade beslut/händelser
- Trendlinje med konfidensintervall

**2. Tre frågor med svar:**

#### "Vad ser vi?"
```
"Tryggheten har försämrats långsamt sedan våren 2022."
```

#### "Vad betyder det för dig?"
```
"Detta hänger ihop med fler grova brott och längre handläggningstider."
```

#### "Hur säkra är vi?"
```
"Datat är starkt och uppdateras veckovis."
```

### Konfidensformuleringar

| Konfidens | Formulering |
|-----------|-------------|
| >90% | "Datat är starkt och pålitligt" |
| 70-90% | "Datat är tillförlitligt men med viss osäkerhet" |
| 50-70% | "Datat är indikativt, tolka med försiktighet" |
| <50% | "Preliminära siffror, stor osäkerhet" |

---

## 4. Rotorsaksvy ("Visa varför")

### Knapptext
```
[Visa varför detta händer]
```

### Faktorpresentation

```
┌─────────────────────────────────────────────────────────────────────────┐
│ VARFÖR DETTA HÄNDER                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ████████████ Faktor A                                    ↑ Stark        │
│ Demografisk förändring (åldrande befolkning)                            │
│                                                                         │
│ ██████░░░░░░ Faktor B                                    → Neutral      │
│ Arbetskraftsinvandring (minskande)                                      │
│                                                                         │
│ ███░░░░░░░░░ Faktor C                                    ↓ Svag         │
│ Konjunkturläge                                                          │
│                                                                         │
│ Klicka på en faktor för att se hur den beräknats.                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Styrkeformuleringar

| Styrka | Visuellt | Text |
|--------|----------|------|
| >0.7 | ████████████ | "Stark påverkan" |
| 0.4-0.7 | ██████░░░░░░ | "Måttlig påverkan" |
| <0.4 | ███░░░░░░░░░ | "Svag påverkan" |

---

## 5. Analysvy ("Visa hur vi vet det")

### Knapptext
```
[Visa hur detta analyserats]
```

### Innehåll

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HUR VI VET DETTA                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ METOD                                                                   │
│ Trendanalys med 12 månaders glidande medelvärde.                        │
│ Brytpunktsdetektering för att identifiera förändringar.                 │
│                                                                         │
│ TIDSFÖRSKJUTNING                                                        │
│ Denna indikator påverkas av Faktor A med ca 18 månaders fördröjning.    │
│                                                                         │
│ DATAPUNKTER                                                             │
│ Baserat på 156 månadsvärden (2011-01 till 2024-01).                     │
│                                                                         │
│ KÄLLOR                                                                  │
│ • SCB Arbetskraftsundersökningen (AKU)                                  │
│ • Socialstyrelsen patientregistret                                      │
│                                                                         │
│ OSÄKERHET                                                               │
│ ±1,2 procentenheter (95% konfidensintervall)                            │
│                                                                         │
│                                    [Visa originaldata hos SCB →]        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Språkregler

### Tillåtna formuleringar

| Mönster | Exempel |
|---------|---------|
| "Detta mäter..." | "Detta mäter hur stor del av befolkningen som arbetar." |
| "Detta betyder..." | "Detta betyder att färre bidrar till skattebasen." |
| "Detta sammanfaller med..." | "Detta sammanfaller med ökad arbetslöshet i gruppen 25-34." |
| "Här är osäkerheten..." | "Här är osäkerheten ca 2 procentenheter." |

### Förbjudna formuleringar

| ❌ Aldrig | Varför |
|----------|--------|
| "Borde" | Normativt |
| "Måste" | Imperativt |
| "Misslyckande" | Värderande |
| "Skandal" | Emotionellt |
| "Katastrofalt" | Överdrivet |
| "Regeringen har..." | Politiskt |

> **Regel**: Systemet visar verkligheten – inte ilska. Ilskan uppstår av sig själv.

---

## 7. Ansvarsformulering

### Publik formulering

```
ANSVARSOMRÅDE

Nationell nivå – Hälso- och sjukvårdssystemet
```

### Visar

- ✅ Strukturellt ansvar
- ✅ Systemnivå
- ✅ Uppföljningsstatus

### Visar inte

- ❌ Personnamn
- ❌ Partitillhörighet
- ❌ Individuell kritik

---

## 8. Interaktionsmönster

### Progressiv avslöjning

```
Nivå 1: Status (30 sek)
    │
    └── [Visa områden]
            │
            Nivå 2: Översikt (2 min)
                │
                └── [Visa detaljer]
                        │
                        Nivå 3: Fördjupning (5 min)
                            │
                            └── [Visa varför]
                                    │
                                    Nivå 4: Rotorsak
                                        │
                                        └── [Visa hur vi vet]
                                                │
                                                Nivå 5: Full transparens
```

### Breadcrumb

```
Sverige → Trygghet & Stabilitet → Våldsbrott → Analys
```

---

## 9. Responsiv anpassning

### Mobil (320-768px)

- En kolumn
- Kollapsade sektioner
- Svep för diagram
- Sticky statusindikator

### Tablet (768-1024px)

- Två kolumner för KPI-kort
- Sidopanel för fördjupning
- Touch-optimerade knappar

### Desktop (1024px+)

- Tre kolumner för KPI-kort
- Fullständig sidopanel
- Hover-tooltips

---

## 10. Varningsformuleringar

### Neutral varning

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ OBSERVERA                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Denna indikator har försämrats under 18 månader i följd.                │
│                                                                         │
│ Inga beslut eller åtgärder är registrerade under denna period.          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Icke-neutral varning (FÖRBJUDEN)

```
❌ "Ansvariga har misslyckats"
❌ "Situationen är katastrofal"
❌ "Ingen gör något"
```

---

## Dokumenthistorik

| Version | Datum | Förändring |
|---------|-------|------------|
| 1.0 | 2026-02-01 | Initial copy-specifikation |

---

*Detta dokument specificerar all pedagogisk copy för NOGF:s publika lager. Det är bindande för all textproduktion i systemet.*
