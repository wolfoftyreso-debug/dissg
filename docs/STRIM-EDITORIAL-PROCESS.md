# 📋 STRIM Redaktionell Process

> **Hur ni uppdaterar innehåll utan att bryta Google-förtroendet**

---

## Grundprinciper

| Regel | Beskrivning |
|-------|-------------|
| **Ingen URL ändras** | Canonical URLs är eviga. Innehållet fördjupas, tas aldrig bort. |
| **Versionering** | Varje ändring skapar ny version. Gamla versioner arkiveras. |
| **Checksums** | Automatisk integritetsverifiering vid publicering. |
| **Validering** | Zod-scheman validerar ALL data innan publicering. |
| **Neutral ton** | Automatisk blockning av värdeord och uppmaningar. |

---

## Workflow

### 1. Skapa utkast (Draft)

```typescript
const entity = {
  canonical_slug: 'ny-substans',
  status: 'draft',
  // ... övriga fält
};
```

### 2. Pre-publish validering

```typescript
import { runPrePublishChecks } from '@/lib/strim/editorial';

const checks = await runPrePublishChecks('substance', 'ny-substans', entity);

// Resultat:
// {
//   passed: true/false,
//   checks: [
//     { name: 'Schema Validation', passed: true, message: '...' },
//     { name: 'Primary Source Required', passed: true, message: '...' },
//     { name: 'Minimum Sources', passed: true, message: '...' },
//     { name: 'Neutral Language', passed: true, message: '...' },
//     { name: 'Integrity Checksum', passed: true, message: 'Checksum: abc123' },
//   ]
// }
```

### 3. Publicering

```typescript
import { publishEntity } from '@/lib/strim/editorial';

const result = await publishEntity('substance', entity);

// Resultat:
// {
//   success: true,
//   entity_id: 'uuid...',
//   canonical_url: 'https://strim.se/data/substans/ny-substans',
//   version: 1
// }
```

---

## Valideringsregler

### Förbjudna ord (automatiskt blockerade)

```
Imperativ: bör, ska, måste, rekommenderas, undvik, prova, testa
Värdeord: bra, dålig, bäst, sämst, fantastisk, hemsk, farlig
Känsloord: lyckligtvis, tyvärr, dessvärre, förhoppningsvis
Normativa: borde, idealt, optimalt, rätt sätt, fel sätt
Kausala (utan evidens): beror på, orsakas av, leder till
```

### Förbjudna mönster

```
/om du/i           - Direkt tilltal
/du kan/i          - Råd
/vi rekommenderar/i
/experter menar/i  - Vag auktoritet
/studier visar/i   - Utan källa
/!/                - Utropstecken
```

---

## Uppdatering av befintliga entiteter

### ✅ Tillåtet

- Fördjupa definitioner med mer kontext
- Lägga till nya källor
- Uppdatera juridisk status
- Lägga till nya relationer
- Korrigera faktafel med källhänvisning

### ❌ Förbjudet

- Ändra canonical_slug
- Ta bort entiteter (markera som 'historical' istället)
- Ändra ID
- Ta bort etablerade relationer utan ersättning

---

## Versionering

Varje uppdatering:

1. Inkrementerar `version`
2. Genererar ny `checksum`
3. Sätter `updated_at`
4. Arkiverar tidigare version (implicit via audit log)

```typescript
// Version 1 → Version 2
{
  version: 2,
  checksum: 'a1b2c3d4',
  updated_at: '2026-02-03T12:00:00Z',
  change_summary: 'Lade till ny källa från Socialstyrelsen 2026'
}
```

---

## Relationer

### Skapa relation

```typescript
import { createRelation } from '@/lib/strim/editorial';

await createRelation(
  'substance', 'alkohol',    // Källa
  'causes',                   // Relationstyp
  'diagnosis', 'alkoholberoende' // Mål
);
```

### Giltiga relationstyper

| Typ | Beskrivning | Exempel |
|-----|-------------|---------|
| `causes` | Orsakar | Substans → Diagnos |
| `treated_by` | Behandlas med | Diagnos → Behandling |
| `regulated_by` | Regleras av | Substans → Lag |
| `affects` | Påverkar | Lag → Behandling |
| `measures` | Mäts av | Statistik → Entitet |
| `defines` | Beskrivs av | Begrepp → Entitet |
| `related_to` | Relaterar till | Begrepp → Begrepp |

---

## Initial seeding

```typescript
import { seedInitialData } from '@/lib/strim/editorial';

const result = await seedInitialData();

// Resultat:
// {
//   success: true,
//   published: 10,
//   relations_created: 9,
//   errors: []
// }
```

---

## Checklista före publicering

- [ ] Minst 2 källor (1 primär)
- [ ] Definition 50-500 tecken
- [ ] Ingen neutral-text-validering fel
- [ ] Slug är URL-safe (`^[a-z0-9-]+$`)
- [ ] Alla required fält ifyllda
- [ ] Relationer pekar på existerande entiteter

---

## Google-förtroende

### Vad Google vill se

1. **Konsekvent struktur** — Samma fält för samma typ
2. **Stabila URL:er** — Inga 404:or eller redirects
3. **JSON-LD** — Korrekt Schema.org markup
4. **Freshness signals** — `dateModified` uppdateras vid ändringar
5. **Citerbarhet** — Tydliga källor

### Vad som bryter förtroendet

- URL:er som försvinner
- Inkonsekvent struktur
- Saknad Schema.org
- Vag eller spekulativ text
- Ej uppdaterad data

---

*STRIM Editorial Process v1 — 2026*
