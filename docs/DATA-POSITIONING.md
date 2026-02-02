# DATA POSITIONING — SYSTEMLAG

> **Version:** 1.0.0  
> **Status:** ORUBBLIG  
> **Antagen:** 2026-02-02

---

## 🏛️ OFFICIELL POSITION

Denna text ska visas **överallt** i systemet:

> "Denna plattform producerar ingen primärdata.  
> All data presenteras exakt såsom den publicerats av ursprunglig källa.  
> Plattformen ansvarar för aggregation, struktur och visualisering – inte innehåll."

### Obligatoriska visningsplatser

| Plats | Format |
|-------|--------|
| Footer (alla sidor) | Full text |
| API-respons | `meta.positioning` |
| Graf-hover | Tooltip |
| Alla exports | Header/metadata |

---

## 🚫 FÖRBJUDNA DATAOPERATIONER

Dessa operationer är **tekniskt spärrade** i systemet:

| Operation | Kod | Beskrivning |
|-----------|-----|-------------|
| Värdeändring | `NO_VALUE_MOD` | Ingen datarensning som ändrar värden |
| Imputering | `NO_IMPUTE` | Ingen imputering av saknade värden |
| Justering | `NO_ADJUST` | Ingen "justering" av värden |
| Auto-interpolation | `NO_AUTO_INTERP` | Ingen interpolation utan explicit användarval |

---

## ✅ TILLÅTNA DATAOPERATIONER

Dessa operationer är tillåtna **med full transparens**:

| Operation | Kod | Kräver visning av |
|-----------|-----|-------------------|
| Gruppering | `GROUP` | `group_by`, `group_count`, `source_points` |
| Summering | `SUM` | `sum_method`, `included_values`, `excluded_values` |
| Normalisering | `NORM` | `norm_method`, `scale_min`, `scale_max`, `original_range` |
| Tidsjustering | `TIME_ADJ` | `adjustment_method`, `original_period`, `adjusted_period` |

---

## 🔐 RÅDATAGARANTI

För **varje datapunkt** gäller:

1. **"Visa rådata"** — alltid tillgänglig
2. **"Visa källa"** — alltid tillgänglig  
3. **"Visa exakt datapost"** — alltid tillgänglig
4. **Max 1 klick** från graf till rå post

### Integritet

Varje datapunkt har:
- SHA-256 checksumma vid ingest
- Versions-ID
- Käll-URL vid tidpunkt för ingest

**Användarverifiering:**
> "Detta är exakt vad källan publicerade."

---

## 📍 KÄLLATTRIBUTION

Obligatoriska fält för alla datapunkter:

| Fält | Beskrivning |
|------|-------------|
| `sourceName` | Källa (organisation) |
| `sourceUrl` | URL till ursprungskälla |
| `license` | Licensinformation |
| `lastUpdated` | Senaste uppdatering |

### Standardtext

> "Källa: {sourceName} – detta värde har inte ändrats av plattformen."

### Käll-disclaimer (juridiskt skydd)

> "Eventuella fel, definitioner eller metodval härrör från ursprunglig datakälla."

---

## 🚫 FÖRBJUDNA VÄRDEORD

Systemet får **ALDRIG** använda:

| ❌ Förbjudet | ✅ Tillåtet alternativ |
|--------------|------------------------|
| bättre/sämre | ökade/minskade |
| lyckades/misslyckades | uppnåddes/uppnåddes inte |
| framgång/fiasko | målvärdet nåddes/nåddes ej |
| positivt/negativt | i positiv/negativ riktning enligt definition |
| bra/dåligt | förändrades |
| stark/svag | högre/lägre |

### Tillåtna neutrala formuleringar

- "ökade", "minskade", "förändrades", "var oförändrad"
- "sammanfaller med", "avviker från", "skiljer sig från"
- "observerades", "uppmättes", "registrerades", "noterades"
- "korrelerar med", "samvarierar med", "förekommer tillsammans med"

---

## 👤 ANVÄNDARDRIVEN JÄMFÖRELSE

### Systemet föreslår ALDRIG jämförelser

Användaren måste explicit välja:
1. Källa A
2. Källa B
3. KPI
4. Period
5. Visualisering

### Systemet:
- Validerar jämförbarhet
- Visar skillnad i definition
- Visar skillnad i mätmetod
- Visar skillnad i täckning

---

## 📊 METODSYNLIGHET

**Ingen formel får vara dold.**

All aggregering måste visa:
- Exakt formel
- Exakt urval
- Exakt viktning
- Exakt tidsfönster

### Export inkluderar alltid:
- `method_json` — metodbeskrivning
- `sources` — alla källor
- `confidence` — konfidensgrad
- `checksums` — verifieringsdata
- `formula` — beräkningsformel

---

## 🎯 "BLAME THE SOURCE" UX

När något ser konstigt ut, säger systemet:

> "Detta värde kommer från {sourceName}.  
> Plattformen har inte ändrat siffran."

**Detta avväpnar ALL kritik.**

---

## ✓ PUBLIK VERIFIERING

Alla kan:
1. Kopiera rådatapunkt
2. Gå till käll-URL
3. Verifiera siffran manuellt
4. Exportera med checksumma

**Transparens till max.**

---

## ⚠️ ANTI-FELTOLKNING

Systemet varnar för:

| Situation | Varning |
|-----------|---------|
| Cherry-picking | "Du har valt ett partiellt urval. Den fullständiga datamängden kan visa annat mönster." |
| Ogiltig jämförelse | "Denna jämförelse använder olika definitioner eller mätmetoder." |
| Statistiskt svag | "Denna jämförelse är möjlig – men metodiskt svag." |

---

## 🏆 SLUTSATS: VÅR IDENTITET

Vi är **inte** en dataleverantör.  
Vi är ett **öppet aggregations- och jämförelselager**.

Vi pekar. Vi visar. Vi döljer inget.  
Ansvar ligger alltid hos källan – och hos användarens tolkning.

Detta gör oss:
- ✓ Juridiskt säkra
- ✓ Moraliskt rena
- ✓ Tekniskt oöverträffade
- ✓ Omöjliga att smutskasta

---

*Detta dokument är systemlag och kan inte ändras utan fullständig versionshistorik.*
