# 📊 STRIM Schema.org Implementation

> **Hur STRIM blir maskinläsbar enligt Googles regler**

---

## Grundprincip

```
Varje STRIM-entitet ska kunna förstås korrekt av en maskin 
utan att läsa brödtexten.
```

Schema markup får **aldrig** ljuga, förenkla eller marknadsföra.

---

## Entitetstyp → Schema.org Mapping

| STRIM-typ | Schema.org Type | Primära fält |
|-----------|-----------------|--------------|
| Substans | `Drug` | name, drugClass, legalStatus |
| Diagnos | `MedicalCondition` | name, code (ICD-10), possibleTreatment |
| Behandling | `MedicalTherapy` | name, medicalSpecialty, indication |
| Lag | `Legislation` | name, jurisdiction, legislationDate |
| Statistik | `Dataset` | name, temporalCoverage, spatialCoverage |
| Begrepp | `DefinedTerm` | name, termCode, inDefinedTermSet |

---

## Global Organisation (alla sidor)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://strim.se/#organization",
  "name": "Stiftelsen för samordning och riktlinjer för missbruksvård",
  "url": "https://strim.se",
  "logo": "https://strim.se/static/logo.png",
  "nonprofitStatus": "Nonprofit",
  "foundingLocation": {
    "@type": "Country",
    "name": "Sverige"
  }
}
```

---

## Exempel: Substans (Alkohol)

```json
{
  "@context": "https://schema.org",
  "@type": "Drug",
  "@id": "https://strim.se/data/substans/alkohol",
  "name": "Alkohol",
  "description": "Alkohol (etanol, C₂H₅OH) är en psykoaktiv substans som produceras genom jäsning av sockerarter.",
  "drugClass": "Centraldämpande",
  "administrationRoute": ["Oral"],
  "legalStatus": {
    "@type": "DrugLegalStatus",
    "name": "Laglig i Sverige"
  },
  "isRelatedTo": [
    {
      "@type": "MedicalCondition",
      "@id": "https://strim.se/data/diagnos/alkoholberoende"
    }
  ],
  "publisher": {
    "@id": "https://strim.se/#organization"
  }
}
```

---

## Exempel: Diagnos (Alkoholberoende)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  "@id": "https://strim.se/data/diagnos/alkoholberoende",
  "name": "Alkoholberoende",
  "description": "Alkoholberoende är ett tillstånd karakteriserat av nedsatt kontroll över alkoholkonsumtion.",
  "code": {
    "@type": "MedicalCode",
    "codingSystem": "ICD-10",
    "codeValue": "F10.2"
  },
  "possibleTreatment": {
    "@type": "MedicalTherapy",
    "@id": "https://strim.se/data/behandling/laro"
  },
  "cause": {
    "@type": "Drug",
    "@id": "https://strim.se/data/substans/alkohol"
  },
  "publisher": {
    "@id": "https://strim.se/#organization"
  }
}
```

---

## Exempel: Behandling (LARO)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  "@id": "https://strim.se/data/behandling/laro",
  "name": "LARO – Läkemedelsassisterad rehabilitering vid opioidberoende",
  "description": "LARO är en behandlingsform där opioider med lång halveringstid ges under kontrollerade former.",
  "medicalSpecialty": "AddictionMedicine",
  "indication": {
    "@type": "MedicalCondition",
    "@id": "https://strim.se/data/diagnos/opioidberoende"
  },
  "publisher": {
    "@id": "https://strim.se/#organization"
  }
}
```

---

## Användning i React

```tsx
import { JsonLdHead } from '@/components/strim/JsonLdHead';

function SubstancePage({ substance }) {
  return (
    <>
      <JsonLdHead
        entity={{ type: 'substance', data: substance }}
        title={substance.name_sv}
        description={substance.definition}
        canonicalUrl={`https://strim.se/data/substans/${substance.canonical_slug}`}
      />
      {/* Page content */}
    </>
  );
}
```

---

## Automatisk generering

```typescript
import { generateJsonLdGraph } from '@/lib/strim/schema-org';

const substance = {
  canonical_slug: 'alkohol',
  name_sv: 'Alkohol',
  definition: 'Alkohol är en psykoaktiv substans...',
  classification_primary: 'depressant',
  current_legal_status: 'legal',
  causes_diagnoses: ['alkoholberoende'],
};

const jsonLd = generateJsonLdGraph({ type: 'substance', data: substance });
// → Complete JSON-LD with @graph including Organization
```

---

## Validering före publicering

```typescript
import { validateBeforePublish } from '@/lib/strim/schema-validation';

const result = validateBeforePublish('Drug', schema);

if (!result.canPublish) {
  console.log('Issues:', result.issues);
  // ❌ description contains forbidden marketing language
  // ⚠️ description exceeds 320 chars
}
```

---

## Kvalitetsregler

### ✅ Tillåtet
- Neutral, faktabaserad beskrivning
- Referenser till andra STRIM-entiteter via @id
- ICD-koder, SFS-nummer, andra standardkoder
- Tomma/utelämnade fält vid osäkerhet

### ❌ Förbjudet
- Marknadsföringsord (bäst, ledande, unik)
- Utropstecken
- Överdrivna påståenden
- Felaktiga eller gissade koder
- Brutna @id-referenser

---

## Google Knowledge Graph

Med korrekt Schema.org kan Google:

1. **Bygga Knowledge Panels** för STRIM-entiteter
2. **Korslänka** mellan substanser, diagnoser, behandlingar
3. **Använda STRIM i AI-svar** som faktakälla
4. **Visa medicinska koder** (ICD-10) i sökresultat

---

## Filer

| Fil | Syfte |
|-----|-------|
| `src/lib/strim/schema-org.ts` | Schema-generatorer |
| `src/lib/strim/schema-validation.ts` | Kvalitetsvalidering |
| `src/components/strim/JsonLdHead.tsx` | React-komponent |

---

*STRIM Schema.org v1 — 2026*
