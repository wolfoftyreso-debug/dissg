# 📘 MASTER README — SYSTEMKONTRAKT

## Öppet samhällssystem för lägesbild, ansvar och utfall

**Version**: v1.0 — levande dokument (versionerat)

---

## 1. Syfte (varför systemet finns)

Systemets syfte är att:
- ge en gemensam, verifierbar lägesbild av landet
- visa hur mätbara utfall utvecklas över tid
- koppla utfall till formella ansvar och mandat
- göra detta begripligt för alla, från allmänhet till högsta ledning

**Systemet:**
- påstår inget
- rekommenderar inget
- dömer ingen

**Systemet:**
- visar
- sammanställer
- förklarar hur vi vet

---

## 2. Grundprinciper (får aldrig brytas)

### 2.1 Fakta ≠ analys ≠ presentation
- **Fakta** kommer från öppna källor
- **Analys** är systemgenererad enligt dokumenterad metod
- **Presentation** är pedagogisk, aldrig normativ

### 2.2 Allt är tidslinjebundet

Inget värde existerar utan:
- startdatum
- slutdatum
- uppdateringsfrekvens

### 2.3 Allt är spårbart bakåt

```
Varje siffra → källa → metod → version
```

### 2.4 Ingen individidentifiering
- Endast aggregerad data
- Segment, kluster, intervall
- Minsta N tillämpas överallt

---

## 3. Vad systemet är (och inte är)

### Systemet ÄR:
- ett informations- och analyslager
- ett offentligt referenssystem
- ett ansvars- och utfallsarkiv
- ett pedagogiskt gränssnitt till komplex verklighet

### Systemet ÄR INTE:
- ett politiskt verktyg
- ett opinionssystem
- ett beslutsmandat
- en sanningsdomstol

---

## 4. Datamodell — Kärnobjekt

### 4.1 KPI
```typescript
interface KPI {
  id: string;
  definition: string;
  rationale: string;           // varför relevant
  normalization: string;       // hur normaliserat
  uncertainty: number;         // osäkerhetsgrad
  masterIndexWeight: number;   // koppling uppåt
  dataPoints: DataPoint[];     // koppling nedåt
}
```

### 4.2 Datapunkt
```typescript
interface DataPoint {
  value: number;
  periodStart: Date;
  periodEnd: Date;
  geoLevel: 'nation' | 'region' | 'kommun' | 'cluster';
  geoCode: string;
  demographicSegment?: string;
  sourceId: string;
  sourceVersion: string;
  confidence: number;
}
```

### 4.3 Geografi
```typescript
type GeoLevel = 
  | 'nation'      // Sverige
  | 'region'      // 21 regioner
  | 'kommun'      // 290 kommuner
  | 'cluster';    // Statistiska kluster (ej administrativa)
```

### 4.4 Ansvar
```typescript
interface Responsibility {
  area: ResponsibilityArea;
  level: 'nationell' | 'regional' | 'kommunal';
  periodStart: Date;
  periodEnd: Date | null;
  holder: string;              // Person/organ med mandat
  constellation?: string;      // Regering/koalition
}
```

### 4.5 Person (offentligt uppdrag)
```typescript
interface PublicOfficial {
  id: string;
  name: string;
  facts: WikipediaFacts;       // Endast verifierbara fakta
  assignments: Assignment[];
  responsibilityLinks: string[];
  observedOutcomes: AggregatedOutcome[];  // Aldrig individuellt tillskrivet
}
```

---

## 5. Relevans & prioritering (startsidan)

Startsidan är **aldrig statisk**.

### Prioriteringsalgoritm
```
relevance_score = 
    (masterindex_impact × 0.30) +
    (change_velocity × 0.25) +
    (population_affected × 0.20) +
    (duration × 0.10) +
    (responsibility_mapped × 0.10) +
    (data_quality × 0.05)
```

Det mest samhällsrelevanta just nu visas **först**.

---

## 6. Interaktion & djup

### 6.1 Grundregel

Varje vy ska besvara:
1. **Vad** händer?
2. **Var** händer det?
3. **Varför** ser det ut så här?
4. **Vem** hade mandat?

### 6.2 Oändligt djup via rekursion

Alla vyer kan:
- brytas ner
- jämföras
- tidsförskjutas
- förklaras
- spåras bakåt

**Det finns ingen slutvy.**

---

## 7. Demografi & känslig data

### Tillåtet (aggregerat):
- Kön
- Ålder (intervall)
- Migration (officiella definitioner)
- Tid i landet
- Utbildning
- Sysselsättning
- Hälsa

### Alltid:
- Populationsnivå
- Kluster
- Minsta N
- Osäkerhet

### Aldrig:
- Identifiering
- Små korsningar som kan bakåtrekonstrueras

---

## 8. Korrelation & simulering

### 8.1 Korrelation
- Visas med: styrka, stabilitet, lag
- Aldrig utan osäkerhet
- Alltid med text: **"Korrelation ≠ orsak"**

### 8.2 Simulering
- Tydligt markerat läge
- Ändrar inte verklig data
- Visar historisk känslighet
- Pedagogiskt, inte prediktivt

---

## 9. AI-användning

### AI används för:
- Sammanfattning
- Förklaring
- Jämförelse
- Pedagogik

### AI används ALDRIG för:
- Att skapa data
- Att ändra utfall
- Att tillskriva ansvar
- Att dra normativa slutsatser

**All AI-text märks.**

---

## 10. Korrekthet & ansvar

- Alla källor anges
- Licenser respekteras
- Wikipedia används för fakta
- Rättelser sker via ursprungskälla
- Systemet synkar regelbundet

### Plattformen ansvarar för:
- Aggregering
- Metod
- Presentation

### Inte för:
- Grunddatan i sig

---

## 11. Målbild

När systemet är fullt utbyggt ska:
- **En gymnasieelev** kunna förstå läget på 2 minuter
- **En journalist** kunna verifiera allt på 10 minuter
- **En beslutsfattare** kunna följa effekter vecka för vecka

Utan:
- tolkningstvång
- förkunskap
- ideologiska filter

---

## 12. Slutdefinition

> **Detta system är ett öppet, levande, faktabaserat nervsystem för ett land — där verkligheten går att se, följa och förstå i valfri upplösning.**

---

*Senast uppdaterad: 2026-02-02*
*Version: 1.0*
