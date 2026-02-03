# 🔬 GLOBAL MULTI-INDEX ANALYSIS ENGINE (LAMBDA SYSTEM)

> **Ett oscilloskop för civilisationen**
> Inte för att tala om vad man ska tycka, utan för att göra det omöjligt att säga "vi visste inte".

---

## Syfte

Bygg ett globalt, öppet, verifierbart analys- och beslutsstödssystem som:

- ✅ Aggregerar all tillgänglig offentlig data
- ✅ Korskorrelerar data över domäner
- ✅ Skapar index som fungerar som sensorer
- ✅ Analyserar avvikelser mot forskning och historiska utfall
- ✅ Presenterar resultat utan åsikt, utan rekommendation

---

## Arkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Headlines│  │ Summaries│  │Click-Path│  │QR Verify │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      LAMBDA CALCULATOR                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  λ = 1.0 (balanced) │ λ < 1.0 (inefficient) │ λ > 1.0    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYSIS ENGINES                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Correlation    │  │ Underperformance│  │    Research     │ │
│  │    Engine       │  │    Detector     │  │   Alignment     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      INDEX REGISTRY                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │Living     │ │Shadow     │ │Health &   │ │Social &   │       │
│  │Basic (6)  │ │Economy (3)│ │Function(5)│ │Cultural(5)│       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│  ┌───────────┐                                                  │
│  │Productivity                                                  │
│  │& Work (5) │                                                  │
│  └───────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                │
│  WHO │ OECD │ World Bank │ IMF │ Eurostat │ National Stats     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Index-lager (Sensorer)

### 1.1 Basala levnadsindex
| Kod | Namn | Beskrivning |
|-----|------|-------------|
| `BIG_MAC_INDEX` | Big Mac-index | Köpkraftsparitet |
| `STAPLE_FOOD_INDEX` | Baslivsmedelsindex | Kalorikostnad per dag |
| `HOUSING_AFFORDABILITY_INDEX` | Bostadsindex | Hyra/köp vs medianinkomst |
| `ENERGY_COST_INDEX` | Energikostnadsindex | El, värme, drivmedel |
| `TRANSPORT_INDEX` | Transportindex | Pendlingskostnad |
| `TIME_COST_INDEX` | Tidskostnadsindex | Arbetstid för basliv |

### 1.2 Skuggekonomi (extremt viktigt – saknas nästan överallt)
| Kod | Namn | Beskrivning |
|-----|------|-------------|
| `INFORMAL_MARKET_INDEX` | Informell marknadsindex | Svart ekonomi som andel av BNP |
| `CORRUPTION_FRICTION_INDEX` | Korruptionsfriktionsindex | Resursförlust genom korruption |
| `PARALLEL_ECONOMY_INDEX` | Parallellekonomiskt index | Indikatorer på desperation |

### 1.3 Hälsa & funktion
| Kod | Namn | Beskrivning |
|-----|------|-------------|
| `LIFE_EXPECTANCY_QUALITY_ADJUSTED` | QALY-livslängd | Kvalitetsjusterad livslängd |
| `METABOLIC_DISEASE_INDEX` | Metabol sjukdomsindex | Diabetes, obesitas, hjärt-kärl |
| `MENTAL_HEALTH_INDEX` | Psykisk ohälsoindex | Depression, ångest, suicid |
| `SUBSTANCE_PREVALENCE_INDEX` | Substansbruksindex | Alkohol, droger, tobak |
| `HEALTHCARE_EFFICIENCY_INDEX` | Sjukvårdseffektivitetsindex | Utfall per investerad krona |

### 1.4 Socialt & kulturellt
| Kod | Namn |
|-----|------|
| `FAMILY_FORMATION_INDEX` | Familjebildningsindex |
| `FERTILITY_INDEX` | Fertilitetsindex |
| `LONELINESS_INDEX` | Ensamhetsindex |
| `SOCIAL_TRUST_INDEX` | Social tillitsindex |
| `VIOLENCE_INDEX` | Våldsindex |

### 1.5 Produktivitet & arbete
| Kod | Namn |
|-----|------|
| `AUTOMATION_RISK_INDEX` | Automatiseringsriskindex |
| `WAGE_PRODUCTIVITY_GAP` | Löne-produktivitetsgap |
| `ADMINISTRATIVE_OVERHEAD_INDEX` | Administrativ överbyggnadsindex |
| `EDUCATION_MISMATCH_INDEX` | Utbildningsmatchningsindex |
| `SKILL_WASTE_INDEX` | Kompetensspillsindex |

---

## 2. Korrelationsmotor

### Regler
- **Alla index kan korsas mot alla andra**
- Analyseras över: tid, geografi, demografi, policyperioder
- Identifierar: starka korrelationer, svaga men stabila mönster, brytpunkter
- Särskiljer: kortsiktiga effekter vs långsiktiga konsekvenser

### Output
```typescript
{
  pearson_r: 0.72,
  spearman_rho: 0.68,
  confidence_level: 'high',
  stability_score: 0.85,
  spurious_warning: false,
  time_lag_months: 6,
  lag_direction: 'a_leads'
}
```

---

## 3. Forskningsramverk

Varje analys märks med:

| Alignment | Betydelse |
|-----------|-----------|
| `aligned_with_consensus` | I linje med majoriteten av aktuell forskning |
| `conflicts_with_established` | I konflikt med etablerad forskning |
| `insufficient_evidence` | Otillräcklig evidens |
| `emerging_pattern` | Nytt mönster utan tillräcklig forskningsbas |
| `contested` | Aktivt debatterat i forskarsamhället |

**Viktigt:** Systemet föreslår inte policy. Det säger endast: *"Historiskt och globalt har detta samband observerats X gånger."*

---

## 4. Underpresteringsdetektor

### Klassificering

| Klass | Beskrivning |
|-------|-------------|
| `overperforming_low_resource` | Överpresterar trots låg resursinsats |
| `overperforming_high_resource` | Presterar bra med hög insats (förväntat) |
| `underperforming_high_resource` | Underpresterar trots hög resursinsats |
| `underperforming_low_resource` | Underpresterar med låg insats |
| `structurally_locked` | Strukturellt låst system |

### Output
```typescript
{
  performance_class: 'underperforming_high_resource',
  efficiency_ratio: 0.65,
  vs_global_median: -12.5,
  vs_peer_group_median: -8.3,
  estimated_resource_waste_percent: 23.4
}
```

---

## 5. Lambda-integration

```
λ ≈ 1.0 → Balanserat system
λ < 1.0 → Ineffektivitet, spill
λ > 1.0 → Överhettning, risk
```

### Lambda-band

| Intervall | Status | Färg |
|-----------|--------|------|
| 0 – 0.70 | Kritisk ineffektivitet | 🔴 |
| 0.70 – 0.85 | Betydande ineffektivitet | 🟠 |
| 0.85 – 0.90 | Måttlig ineffektivitet | 🟡 |
| 0.90 – 1.10 | Balanserad | 🔵 |
| 1.10 – 1.15 | Måttlig överhettning | 🟣 |
| 1.15 – 1.30 | Betydande överhettning | 💜 |
| 1.30+ | Kritisk överhettning | 🔴 |

---

## 6. Presentation (Svart på vitt)

### Krav
- ✅ Begriplig för en 18-åring
- ✅ Klickbart djup: index → komponenter → rådata → källa
- ✅ Visar: vad, hur mycket, sedan när, i relation till vad

### Förbjudet
- ❌ Spekulativt språk
- ❌ Moral
- ❌ Politiska värdeord

---

## 7. Filstruktur

```
src/lib/lambda/
├── index-types.ts          # Alla typdefinitioner
├── index-registry.ts       # 24 indexdefinitioner
├── correlation-engine.ts   # Korrelationsberäkningar
├── underperformance-detector.ts
├── lambda-calculator.ts    # Lambda-beräkning
├── presentation.ts         # Textgenerering
└── index.ts               # Exports
```

---

## Användning

```typescript
import { 
  computeLambda, 
  calculateCorrelation,
  analyzePerformance,
  generateHeadline,
  INDEX_REGISTRY 
} from '@/lib/lambda';

// Beräkna Lambda för Sverige
const lambda = computeLambda({
  geo_code: 'SE',
  geo_level: 'country',
  period: '2024',
  index_values: indexMap,
});

console.log(generateHeadline(lambda, 'sv'));
// → "λ 0.94 — Inom normalintervall"
```

---

*LAMBDA SYSTEM v1.0 — Global Reality OS*
