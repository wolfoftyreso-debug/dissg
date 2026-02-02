# DEL XXI — DESIGNSYSTEM (SEMANTIK, INTE STIL)

## Grundprincip

> **Färg = mening, aldrig dekoration**
> 
> Designsystemet kommunicerar data, inte åsikter.

---

## 1. Semantiska färger

### Trendfärger (riktning över tid)

| Färg | Betydelse | CSS-variabel | Användning |
|------|-----------|--------------|------------|
| 🟢 Grön | Förbättring över tid | `--trend-positive` | Värdet rör sig i önskvärd riktning |
| 🟡 Gul | Osäkert / oförändrat | `--trend-warning` | Stagnation eller hög osäkerhet |
| 🔴 Röd | Försämring över tid | `--trend-negative` | Värdet rör sig i oönskad riktning |
| ⚪ Grå | Otillräckligt data | `--trend-neutral` | För få observationer eller saknad data |

### ⚠️ Viktigt

Färg får **aldrig** betyda "bra/dålig politik". Bara **riktning**.

- ✅ Grön = förbättring jämfört med förra perioden
- ❌ Grön = regeringen gör rätt

---

## 2. Pilar med ord (obligatoriskt)

Ingen ikon utan text. Alltid förklarande suffix.

| Symbol | Text | Betydelse |
|--------|------|-----------|
| 🔺 | "Ökar jämfört med föregående period" | Positiv förändring (om KPI ej inverterat) |
| 🔻 | "Minskar jämfört med föregående period" | Negativ förändring (om KPI ej inverterat) |
| ➡️ | "Oförändrat" | Förändring < 0.1 procentenhet |

### Inverterade KPI:er

Vissa KPI:er är inverterade (lägre = bättre):
- Arbetslöshet (lägre är bättre → grön vid minskning)
- Våldsbrott (lägre är bättre → grön vid minskning)
- Sjukskrivning (lägre är bättre → grön vid minskning)

---

## 3. Siffror i två rader (standard)

### Format

```
┌────────────────────────────┐
│  71,8 %                    │  ← Läge (absolut värde)
│  −0,8 p.e. sedan 12 mån    │  ← Förändring (relativ)
└────────────────────────────┘
```

### Regler

1. **Läge först**: Aktuellt värde med enhet
2. **Förändring under**: Relativ förändring med tidsperiod
3. **Aldrig blandat**: "71,8 % (−0,8)" är förbjudet

### Enheter

| Typ | Format | Exempel |
|-----|--------|---------|
| Procent | `XX,X %` | 71,8 % |
| Procentenheter | `±X,X p.e.` | −0,8 p.e. |
| Antal | `X XXX` | 10 591 482 |
| Per capita | `X,X/1000 inv` | 3,2/1000 inv |
| Kronor | `X XXX SEK` | 312 000 SEK |

---

## 4. Knappar (fast ordlista)

### Primära handlingar

| Knapp | Funktion | Ikon |
|-------|----------|------|
| **Visa varför** | Öppnar orsakskedja | `HelpCircle` |
| **Visa hur vi vet** | Öppnar metodologi & källor | `FileText` |
| **Visa på karta** | Navigerar till geografisk vy | `MapPin` |
| **Visa historik** | Visar tidsserie | `Clock` |
| **Simulera** | Öppnar simuleringsläge | `Sparkles` |

### Sekundära handlingar

| Knapp | Funktion |
|-------|----------|
| **Jämför** | Välj jämförelseobjekt |
| **Ladda ner** | Exportera data |
| **Dela** | Kopiera länk |

### ⚠️ Inga kreativa varianter

- ✅ "Visa varför"
- ❌ "Förklara", "Djupdyk", "Utforska orsaker"

Igenkänning är viktigare än variation.

---

## 5. Typografi

### Hierarki

| Nivå | Storlek | Vikt | Användning |
|------|---------|------|------------|
| H1 | 24px | Bold | Sidtitel |
| H2 | 18px | Semibold | Sektionsrubrik |
| H3 | 16px | Medium | Kortrubrik |
| Body | 14px | Regular | Brödtext |
| Caption | 12px | Regular | Etiketter, metadata |
| Micro | 10px | Regular | Timestamps, disclaimers |

### Siffror

- **Tabellär**: Monospace för siffror i tabeller
- **Tusentalsavgränsare**: Mellanslag (10 591 482)
- **Decimalavgränsare**: Komma (71,8)

---

## 6. Ikoner

### Kategorier

| Kategori | Ikon | Användning |
|----------|------|------------|
| Demografi & Hälsa | `Heart` | Block A |
| Arbete & Produktivitet | `Briefcase` | Block B |
| Ekonomisk Bärkraft | `TrendingUp` | Block C |
| Social Stabilitet | `Shield` | Block D |
| Kärnsystem | `Building` | Block E |
| Infrastruktur | `Zap` | Block F |
| Systemrisk | `AlertTriangle` | Block G |

### Status

| Status | Ikon | Färg |
|--------|------|------|
| Positiv | `TrendingUp` | `--trend-positive` |
| Varning | `AlertCircle` | `--trend-warning` |
| Kritisk | `AlertTriangle` | `--trend-negative` |
| Neutral | `Minus` | `--trend-neutral` |

---

## 7. Komponenter

### KPI-kort (standard)

```
┌─────────────────────────────────────┐
│ 📊 Sysselsättningsgrad              │
│                                     │
│ 71,8 %                    🔻        │
│ −0,8 p.e. sedan 12 mån              │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━ 95% konfidens │
│                                     │
│ [Visa varför] [Visa på karta]       │
└─────────────────────────────────────┘
```

### Trendbadge

```
┌──────────────────────┐
│ 🔻 −0,8 % / 12 mån   │
└──────────────────────┘
```

### Disclaimer-banner

```
┌─────────────────────────────────────────────────┐
│ ⚠️ Datapunkt = statistisk observation,         │
│    inte en person                               │
└─────────────────────────────────────────────────┘
```

---

## 8. CSS-variabler

```css
:root {
  /* Semantiska trendfärger */
  --trend-positive: 142 76% 36%;      /* Grön */
  --trend-warning: 38 92% 50%;        /* Gul */
  --trend-negative: 0 72% 51%;        /* Röd */
  --trend-neutral: 220 9% 46%;        /* Grå */
  
  /* Konfidensnivåer */
  --confidence-high: 142 76% 36%;     /* >90% */
  --confidence-medium: 38 92% 50%;    /* 70-90% */
  --confidence-low: 0 72% 51%;        /* <70% */
  
  /* Datalager */
  --layer-a: 217 91% 60%;             /* Öppna myndighetsdata */
  --layer-b: 38 92% 50%;              /* Aggregerad statistik */
  --layer-c: 0 72% 51%;               /* Analysresultat */
  
  /* Simulering (tydligt avgränsad) */
  --simulation-bg: 280 100% 97%;
  --simulation-border: 280 100% 70%;
}
```

---

## 9. Tillgänglighet

### Kontrast

- Alla textfärger: minst 4.5:1 kontrast
- Ikoner: minst 3:1 kontrast
- Fokusringar: synliga i alla lägen

### Alternativ till färg

Färg är **aldrig** enda informationsbäraren:
- Pilar + text för trend
- Mönster för diagram
- Etiketter för allt

### Skärmläsare

```html
<!-- Korrekt -->
<span aria-label="Sysselsättningsgrad minskar med 0,8 procentenheter">
  🔻 −0,8 p.e.
</span>

<!-- Felaktigt -->
<span>🔻 −0,8 p.e.</span>
```
