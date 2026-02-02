# 🇸🇪 NOGF — Nationellt Offentligt Gransknings-Facit

> **"Enkelhet på ytan, oändlighet i djupet"**

---

## Vad är detta?

NOGF är Sveriges första öppna samhällsintelligenssystem. Det ger medborgare, journalister, forskare och beslutsfattare tillgång till ett gemensamt facit för hur Sverige utvecklas.

**Systemet besvarar tre frågor — alltid:**
1. **Hur går det?** — Aktuella värden med trendindikation
2. **Var händer det?** — Geografisk och demografisk nedbrytning
3. **Varför händer det?** — Korrelationer, fördröjningar och samvariation

---

## Kärnprinciper

### 1. Användaren väljer aldrig komplexitet
Komplexiteten erbjuder sig själv vid rätt tillfälle. Systemet börjar med det viktigaste och låter användaren gräva djupare vid behov.

### 2. Allt är relationellt
Ingen datapunkt existerar isolerat. Varje värde vet:
- Vilket KPI det tillhör
- Vilken geografisk nivå
- Vilken demografisk dimension  
- Vilken tidsperiod
- Vem som bar ansvar
- Vilken källa
- Vilken osäkerhet

### 3. Mastervärdet styr allt
**Nationellt Funktionsindex** är systemets ryggrad. Alla andra KPI:er förklarar detta — de konkurrerar inte.

### 4. Ansvar, inte skuld
Systemet mappar **mandat**, inte orsak. Frågan är alltid:
> "Vem hade ansvaret när detta förändrades?"

### 5. Korrelation utan vilseledning
Samvariation visas alltid med:
- Styrka
- Stabilitet
- Tidsförskjutning
- Osäkerhetsintervall
- Kausal disclaimer

---

## Systemarkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                    NATIONELLT FUNKTIONSINDEX                    │
│                  (Statsministerns masteransvar)                  │
├─────────────────────────────────────────────────────────────────┤
│  A. Demografi    B. Arbete    C. Ekonomi    D. Stabilitet       │
│  & Hälsa         & Prod.      & Bärkraft    & Trygghet          │
├─────────────────────────────────────────────────────────────────┤
│  E. Kärnsystem   F. Infrastr.  G. Systemrisk                    │
│  & Funktion      & Flöden      & Styrning                       │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ 20 KPIs │ ──────▶ │ Djup    │ ──────▶ │ Oändlig │
    │ (Ytan)  │         │ Analys  │         │ Rekursiv│
    └─────────┘         └─────────┘         └─────────┘
```

---

## Datakällor

| Källa | Typ | Frekvens | Status |
|-------|-----|----------|--------|
| SCB PX-Web | API | Dag/Vecka/Månad | ✅ Aktiv |
| Kolada | API | Årlig | ✅ Aktiv |
| Svenska Kraftnät | API | Realtid | ✅ Aktiv |
| Socialstyrelsen | API | Kvartalsvis | 🔄 Planerad |
| BRÅ | API | Månadsvis | 🔄 Planerad |
| Arbetsförmedlingen | API | Veckovis | 🔄 Planerad |

---

## Användargränssnitt

### Startvy: "Visa mig det viktiga"
Prioriterat efter:
1. **Genomslag** — Påverkar flest människor
2. **Brådska** — Förändras snabbast
3. **Aktualitet** — Uppdaterad nyligen

### Progression
```
Översikt → KPI-kort → Djupanalys → Regional → Demografisk → Historisk → Ansvar
    ▲                                                                    │
    └────────────────── Alltid tillbaka till helheten ◀─────────────────┘
```

### Interaktion
- **Jämför**: Kön, regioner, tid, mandatperioder
- **Borra**: Oändligt rekursivt djup
- **Simulera**: "Vad händer om?"
- **Förklara**: Klartextförklaringar för alla

---

## Ansvarsmappning

| Nivå | Mandat | KPI-koppling |
|------|--------|--------------|
| **Nationell** | Statsminister/Minister | Master-index + Kategori |
| **Regional** | Regionpolitiker | Regional breakdown |
| **Kommunal** | Kommunpolitiker | Kommunal breakdown |

**Regel**: Vi pekar aldrig på skuld — vi visar vem som hade mandatet.

---

## Rekursivt djup

Varje element i systemet kan besvaras med fem frågor:
1. **Definition**: Vad är detta?
2. **Komposition**: Vad består det av?
3. **Tidslinje**: Hur har det förändrats?
4. **Samvariation**: Vad korrelerar?
5. **Ansvar**: Vem bar mandatet?

Det finns inget "slut". Användaren bestämmer djupet.

---

## Teknisk design

### Principer
- **Infinite by design**: Nya KPIs = nya noder, inget omskrivet
- **Versionerad**: Data, metoder, definitioner, ansvarsmatris
- **Skalbar**: Miljontals datapunkter, hundratals API:er
- **Öppen**: All data tillgänglig, all metod transparent

### Stack
```
Frontend:  React + TypeScript + Tailwind + Recharts
Backend:   Supabase (Postgres + Edge Functions)
Ingest:    Schemalagda cron-jobb (dagligen 06:00 UTC)
API:       RESTful edge functions + realtime subscriptions
```

---

## Vad detta betyder

När systemet är fullt implementerat:
- **Politik blir mätbar** — resultat synliggörs
- **Ansvar blir synligt** — mandat kopplas till utfall
- **Bullshit dör långsamt** — data ersätter tyckande

---

## Filosofi

> *"Data utan kontext är brus. Kontext utan data är bullshit. Vi levererar båda."*

Detta är inte ett projekt. Det är infrastruktur.

En gemensam verklighetsreferens för ett demokratiskt samhälle.

---

## Licens

Öppen data. Öppen kod. Öppen metod.

För folket. Av folket. Om folket.

---

*Senast uppdaterad: 2026-02-02*
