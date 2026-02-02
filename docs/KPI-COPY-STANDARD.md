# KPI Copy-Standard: Supertydlighet

Detta dokument definierar den obligatoriska copy-standarden för alla KPI-kort i systemet.
Ingen KPI får gå live utan att följa denna standard.

---

## 🎯 GRUNDPRINCIPER

### Princip 1: Inga symboler utan ord
Varje pil, färg och procent måste alltid ha en förklarande text bredvid sig.

❌ **Fel:** `↗ +50 %`

✅ **Rätt:** `🔺 Överdödligheten har ökat med 50 % jämfört med förra året`

### Princip 2: All förändring måste svara på tre frågor
1. **Vad** har ändrats?
2. **Jämfört med vad?**
3. **Under vilken tid?**

Om något av detta saknas → datan visas inte.

### Princip 3: Absolutvärde ≠ Förändring
Dessa får aldrig blandas visuellt:
- **Absolutvärde** = hur det är (NULÄGE)
- **Förändring** = hur det har rört sig (FÖRÄNDRING)

De ska alltid stå i olika sektioner.

---

## 📋 OBLIGATORISK STRUKTUR FÖR VARJE KPI-KORT

```
┌─────────────────────────────────────────────────────────────┐
│  [IKON] [KPI-NAMN]                              [STATUS]    │
│  [Kort beskrivning av vad som mäts]                         │
├─────────────────────────────────────────────────────────────┤
│  NULÄGE                                                     │
│  [STORT VÄRDE] [ENHET]                         [SPARKLINE]  │
├─────────────────────────────────────────────────────────────┤
│  FÖRÄNDRING                                                 │
│  [PILJIKON] Har [ökat/minskat] med [VÄRDE] [ENHET]          │
│  Jämfört med [REFERENSPERIOD]                               │
│                                                             │
│  📉 Trend: [TRENDTEXT]                                      │
├─────────────────────────────────────────────────────────────┤
│  [VARNING om kritisk]           [Förklara enkelt-knapp]     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 COPY-MALLAR PER KPI-TYP

### Typ A: Procentandel (lägesindikator)
**Exempel:** Arbetsför befolkning

```
[NULÄGE]
71,8 % av befolkningen 18-64 år

[FÖRÄNDRING]
🔻 Har minskat med 0,8 procentenheter
Jämfört med samma period förra året

📉 Trend: −1,2 procentenheter (12 månader)
```

### Typ B: Absolut värde
**Exempel:** Förväntad livslängd

```
[NULÄGE]
83,2 år

[FÖRÄNDRING]
🔻 Har minskat med 0,2 år
Jämfört med samma period förra året

📉 Trend: −0,2 år (12 månader)
```

### Typ C: Avvikelse från baslinje
**Exempel:** Överdödlighet

```
[NULÄGE]
+4,2 % fler dödsfall än normalt

[FÖRÄNDRING]
🔺 Avvikelsen har ökat med 1,4 procentenheter
Jämfört med samma period förra året
⚠️ Detta betyder att avvikelsen har ökat – inte att 50 % fler dör.

📈 Trend: Uppåtgående sedan Q3 2023
```

### Typ D: Per capita / per 100 000
**Exempel:** Grova våldsbrott

```
[NULÄGE]
42,8 fall per 100 000 invånare

[FÖRÄNDRING]
🔺 Har ökat med 4,4 fall per 100 000
Jämfört med samma period förra året

📈 Trend: +8,2 per 100 000 (12 månader)
```

### Typ E: Tidsmått
**Exempel:** Vårdkö, Rättssystemets genomloppstid

```
[NULÄGE]
67 dagar (medianväntetid)

[FÖRÄNDRING]
🔺 Har ökat med 9 dagar
Jämfört med samma period förra året

📈 Trend: +18 dagar (12 månader)
```

### Typ F: Index
**Exempel:** Energistabilitet

```
[NULÄGE]
68 av 100 (stabilitetsindex)

[FÖRÄNDRING]
🔻 Har minskat med 6 indexenheter
Jämfört med samma period förra året

📉 Trend: −14 indexenheter (12 månader)
```

### Typ G: Kvot
**Exempel:** Försörjningskvot

```
[NULÄGE]
1,72 försörjda per arbetande person

[FÖRÄNDRING]
🔺 Har ökat med 0,04 enheter
Jämfört med samma period förra året
⚠️ Högre kvot = fler att försörja per arbetande.

📈 Trend: +0,09 (12 månader)
```

---

## 🔁 PILAR – REGLER

Pilar får ALDRIG stå ensamma. Varje pil måste kompletteras med:
- Text som beskriver riktningen
- Referensperiod

| Ikon | Betydelse | Fullständig text |
|------|-----------|------------------|
| 🔺 | Ökning | "Har ökat med [X] jämfört med [period]" |
| 🔻 | Minskning | "Har minskat med [X] jämfört med [period]" |
| ➡️ | Oförändrat | "Oförändrad jämfört med [period]" |

---

## 🧠 "FÖRKLARA ENKELT"-FORMAT

Varje KPI ska ha en förklaring som:
1. Kan förstås av en 12-åring
2. Innehåller en enda mening
3. Inte använder statistiska termer

### Mall för "Förklara enkelt"

```
[IKON] [KPI-NAMN]

[En mening som förklarar vad måttet mäter]

[Status: "Det går åt rätt håll" / "Det går åt fel håll" / "Det är stabilt"]

Varför det spelar roll: [En mening om samhällspåverkan]
```

### Exempel

**Överdödlighet:**
> "Fler människor dör nu än vad som är normalt för den här tiden på året."
> 
> Det går åt fel håll just nu.
> 
> Varför det spelar roll: Överdödlighet kan visa på dolda problem – pandemier, värmeböljar, vårdkris eller försämrad folkhälsa.

---

## 🎨 FÄRG- OCH STATUSREGLER

| Status | Färg | Betydelse |
|--------|------|-----------|
| 🟢 Positiv | `--status-positive` | Bra utveckling, inom målbild |
| 🟡 Varning | `--status-warning` | Avvikelse som kräver uppmärksamhet |
| 🔴 Kritisk | `--status-critical` | Allvarlig avvikelse, kräver åtgärd |
| ⚪ Neutral | `--muted-foreground` | Stabil, ingen tydlig trend |

### Regel för färgval
Färgen ska alltid matcha **utfallet**, inte riktningen.

- Om minskning är BRA (t.ex. överdödlighet minskar) → 🟢 grön
- Om minskning är DÅLIG (t.ex. livslängd minskar) → 🔴 röd

---

## 🧪 FÖRSKOLELÄRARTESTET

Innan ett KPI får gå live, måste det testas:

### Procedur
1. Visa KPI-kortet för 5 personer utan statistikbakgrund
2. Be dem svara:
   - "Vad betyder siffran?"
   - "Är det bättre eller sämre nu?"
   - "Jämfört med vad?"
3. Dokumentera svaren

### Godkännandekrav
- **5/5 korrekt** → Godkänd
- **4/5 korrekt** → Mindre justering krävs
- **<4/5 korrekt** → Underkänd, kräver omarbetning

---

## ✅ CHECKLISTA FÖR NYTT KPI

- [ ] Har kortet en ikon och beskrivning?
- [ ] Är NULÄGE och FÖRÄNDRING visuellt separerade?
- [ ] Svarar förändringen på: vad, jämfört med vad, under vilken tid?
- [ ] Har pilar alltid text bredvid sig?
- [ ] Är procent tydligt märkt som "andel" eller "förändring"?
- [ ] Finns "Förklara enkelt"-knapp?
- [ ] Har KPI:t klarat förskolelärartestet?

---

## 📚 ORDLISTA

| Term | Använd istället |
|------|-----------------|
| Procentuell förändring | "X % högre/lägre än [period]" |
| Trend | "Har [ökat/minskat] sedan [tidpunkt]" |
| Baslinje | "Vad som normalt förväntas" |
| Konfidensintervall | "Osäkerhet i siffran" |
| Statistiskt signifikant | "Tydlig förändring" |

---

*Dokumentversion: 1.0*
*Senast uppdaterad: 2026-02-02*
