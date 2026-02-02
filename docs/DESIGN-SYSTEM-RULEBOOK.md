# GLOBAL UI/UX RULEBOOK

> **BLOCK 1 OUTPUT**: Standardisering av hela systemets visuella språk
> 
> Definition of done: En användare ska aldrig behöva "lära om" när den byter vy.

---

## 1. FÄRG → BETYDELSE (OBRYTBAR)

### Statusfärger (endast tre + neutral)

| Färg | CSS Variable | Betydelse | ALDRIG används för |
|------|-------------|-----------|-------------------|
| 🟢 Grön | `--status-positive` / `--trend-up` | Förbättring, stabil trend uppåt | "bra", "rätt", moral |
| 🟡 Gul | `--status-warning` | Avvikelse, behöver uppmärksamhet | "medel", "varning" generellt |
| 🔴 Röd | `--status-critical` / `--trend-down` | Negativ trend, kritiskt läge | "dåligt", "fel", skuld |
| ⚫ Grå | `--status-neutral` / `--trend-stable` | Stabil, ingen förändring | "tråkigt", "inaktivt" |

### Färgkod
```css
--status-positive: 145 55% 38%;     /* HSL: Grön */
--status-warning: 40 95% 48%;        /* HSL: Gul */
--status-critical: 0 75% 48%;        /* HSL: Röd */
--status-neutral: 210 10% 55%;       /* HSL: Grå */
```

### FÖRBJUDET
- ❌ Grön för "bättre land"
- ❌ Röd för "sämre politiker"
- ❌ Färggradient från grön till röd på kartor
- ❌ Subjektiva färgval per vy

---

## 2. FORM → FUNKTION (OBRYTBAR)

### Ikonografi

| Ikon | Betydelse | Användning |
|------|-----------|------------|
| ↑ / TrendingUp | Ökning (ej värdering) | Trender, förändring |
| ↓ / TrendingDown | Minskning (ej värdering) | Trender, förändring |
| → / Minus | Stabil | Ingen förändring |
| ⓘ / Info | Mer information finns | Klickbar förklaring |
| ⚠️ / AlertTriangle | Osäkerhet, datavarning | Kvalitetsindikator |
| ❌ / XCircle | Vad detta INTE är | Disclaimers |
| 🔍 / Search | Utforska djupare | Drilldown |
| 📊 / BarChart | Data/statistik | Visualiseringar |
| 🌐 / Globe | Global nivå | Geografisk kontext |
| 🏛️ / Building | Institution | Ansvar/organisation |
| ❤️ / Heart | Mänskligt välbefinnande | HWI-relaterat |
| ⚡ / Zap | Energi | Energi-pelare |
| 👥 / Users | Demografi | Befolkning |

### FÖRBJUDET
- ❌ Samma ikon för olika funktioner
- ❌ Dekorativa ikoner utan funktion
- ❌ Emoji som primär navigation

---

## 3. TEXT → SEMANTIK (OBRYTBAR)

### Terminologi-standard

| ✅ ANVÄND | ❌ ANVÄND ALDRIG |
|-----------|-----------------|
| ökar | förbättras (värdering) |
| minskar | försämras (värdering) |
| förändras | utvecklas (implicit riktning) |
| sammanfaller med | orsakar |
| korrelerar med | leder till |
| observeras | bevisas |
| data visar | sanningen är |
| osäkerhet finns | vi vet inte |
| rapporterad | verklig |
| estimerad | exakt |

### Rubriker

| Typ | Storlek | Vikt | Användning |
|-----|---------|------|------------|
| H1 | 24-32px | Bold | Sidtitel (1 per sida) |
| H2 | 18-24px | Semibold | Sektionsrubriker |
| H3 | 14-16px | Medium | Korttitlar |
| Label | 10-12px | Semibold, uppercase | Kategori-headers |
| Body | 14px | Regular | Löptext |
| Data | 14-16px | tabular-nums | Siffror |

### FÖRBJUDET SPRÅK
```
bättre, sämre, lyckades, misslyckades, framgång, nederlag,
kris (utan definition), katastrof, fantastisk, 
förmodligen, antagligen, säkert, definitivt
```

---

## 4. KOMPONENTER → KONSISTENS

### Kort (Cards)

```tsx
// STANDARD DATAKORT
<Card className="data-card">
  <CardHeader className="pb-2">
    <span className="section-header">KATEGORI</span>
    <CardTitle className="text-lg">Titel</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Innehåll */}
  </CardContent>
</Card>
```

### Badges

| Variant | Användning |
|---------|------------|
| `variant="outline"` | Neutral information |
| `className="bg-status-positive/10 text-status-positive"` | Positiv trend |
| `className="bg-status-warning/10 text-status-warning"` | Varning |
| `className="bg-status-critical/10 text-status-critical"` | Kritiskt |

### Knappar

| Typ | CSS-klass | Användning |
|-----|-----------|------------|
| Primär | `btn-myndighet-primary` | Huvudhandling |
| Sekundär | `btn-myndighet` | Sekundär handling |
| Ghost | `variant="ghost"` | Subtil interaktion |

---

## 5. LAYOUT → HIERARKI

### Navigationsstruktur (ALLTID)

```
Värld → Region → Land → System → Indikator
```

### Breadcrumbs (OBLIGATORISKT)

```tsx
<Breadcrumb>
  <BreadcrumbItem>Världen</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>Europa</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>Sverige</BreadcrumbItem>
</Breadcrumb>
```

### Sidstruktur

1. Breadcrumbs (alltid)
2. Titel + Beskrivning
3. Tidväljare (om relevant)
4. Huvudinnehåll
5. Kontextmeddelanden
6. Disclaimers
7. Footer

---

## 6. DISCLAIMERS (OBLIGATORISKA)

### "Vad detta INTE är"-rutan

```tsx
<Card className="bg-destructive/5 border-destructive/20">
  <CardHeader className="pb-2">
    <div className="flex items-center gap-2">
      <XCircle className="h-4 w-4 text-destructive" />
      <CardTitle className="text-sm">Detta är INTE:</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Badge variant="outline" className="text-xs border-destructive/30">
          ❌ {item}
        </Badge>
      ))}
    </div>
  </CardContent>
</Card>
```

### Osäkerhetsindikator

```tsx
<div className="flex items-center gap-1 text-xs text-muted-foreground">
  <AlertTriangle className="h-3 w-3" />
  <span>Osäkerhet: ±{uncertainty}%</span>
</div>
```

---

## 7. DATAVISNING

### Grafer

- **Linjediagram**: Trend över tid
- **Stapeldiagram**: Jämförelser
- **Inga 3D-effekter**
- **Inga skuggor**
- **Alltid y-axel från 0 (eller tydligt markerat om inte)**

### Kartor

- **5-gradig neutral skala** (ljusgrå → mörklila)
- **Aldrig röd-grön gradient**
- **Alltid legend synlig**
- **Klick = detaljer**

### Siffror

```tsx
<span className="font-data">{value.toLocaleString('sv-SE')}</span>
```

---

## 8. AVVIKELSER ATT FIXA

### Identifierade problem

| Fil | Problem | Fix |
|-----|---------|-----|
| `GlobalRealityIndex.tsx` | Använder hårdkodade färger | Byt till CSS-variabler |
| `PillarBar` | Inline `style={{ backgroundColor }}` | Använd Tailwind-klasser |
| Flera komponenter | Inkonsekvent ikonbruk | Standardisera enligt tabell |
| `RegionalMap` | Saknar breadcrumbs | Lägg till |

---

## 9. ACCESSIBILITY

- **Kontrast**: Minst 4.5:1 för text
- **Fokusringar**: `ring-2 ring-ring`
- **Skärmläsare**: `aria-label` på alla interaktiva element
- **Tangentbord**: Tab-navigering fungerar

---

## 10. PRESTANDA

- **Lazy loading**: Alla tunga komponenter
- **Memoization**: `useMemo` för beräkningar
- **Virtualisering**: Listor > 50 items
- **Bilder**: WebP, lazy, srcset

---

## CHECKLISTA FÖR NY KOMPONENT

- [ ] Använder endast CSS-variabler för färger
- [ ] Följer typografi-hierarki
- [ ] Har breadcrumbs om det är en sida
- [ ] Har disclaimer om det visar data
- [ ] Har osäkerhetsindikator
- [ ] Använder korrekta ikoner
- [ ] Använder neutralt språk
- [ ] Fungerar med tangentbord
- [ ] Har `font-data` på siffror

---

*Senast uppdaterad: 2026-02-02*
