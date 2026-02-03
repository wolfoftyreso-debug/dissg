/**
 * STRIM JSON-LD Generator
 * 
 * Generates Schema.org structured data for all STRIM entities.
 * Used for SEO and Google Knowledge Graph integration.
 */

import type { StrimEntityType, StrimBaseEntity, StrimSource } from './api';

const STRIM_BASE_URL = 'https://strim.se';

// =============================================================================
// SCHEMA.ORG TYPE MAPPINGS
// =============================================================================

export const SCHEMA_ORG_TYPES: Record<StrimEntityType, string> = {
  substance: 'Drug',
  diagnosis: 'MedicalCondition',
  treatment: 'MedicalTherapy',
  legal: 'Legislation',
  statistic: 'Dataset',
  term: 'DefinedTerm',
};

const SWEDISH_PATHS: Record<StrimEntityType, string> = {
  substance: 'substans',
  diagnosis: 'diagnos',
  treatment: 'behandling',
  legal: 'lag',
  statistic: 'statistik',
  term: 'begrepp',
};

// =============================================================================
// EXTENDED ENTITY TYPES FOR JSON-LD
// =============================================================================

interface SubstanceEntity extends StrimBaseEntity {
  name_sv: string;
  classification_primary?: string;
  pharmacological_class?: string;
  pharmacology?: { mechanism_of_action?: string };
  risk_category?: string;
  current_legal_status?: string;
}

interface DiagnosisEntity extends StrimBaseEntity {
  name_sv: string;
  definition?: string;
  icd_10_code?: string;
  icd_11_code?: string;
  typical_onset_age?: string;
}

interface TreatmentEntity extends StrimBaseEntity {
  name_sv: string;
  evidence_summary?: string;
  method_type?: string;
  evidence_level?: string;
  contraindications?: string[];
}

interface LegalEntity extends StrimBaseEntity {
  name_sv: string;
  jurisdiction?: string;
  jurisdiction_level?: string;
  valid_from?: string;
  valid_to?: string;
  summary?: string;
  sfs_number?: string;
}

interface StatisticEntity extends StrimBaseEntity {
  indicator_name_sv: string;
  unit?: string;
  first_available_year?: number;
  last_available_year?: number;
  geography_level?: string;
  data_source?: string;
  data_source_url?: string;
  uncertainty_description?: string;
}

interface TermEntity extends StrimBaseEntity {
  term_sv: string;
  term_en?: string;
  definition_sv?: string;
  usage_context?: string[];
}

// =============================================================================
// BASE JSON-LD
// =============================================================================

function createBaseJsonLd(
  type: StrimEntityType,
  slug: string,
  name: string,
  updatedAt: string
): Record<string, unknown> {
  const schemaType = SCHEMA_ORG_TYPES[type];
  const path = SWEDISH_PATHS[type];
  const canonicalUrl = `${STRIM_BASE_URL}/data/${path}/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': canonicalUrl,
    name,
    url: canonicalUrl,
    inLanguage: 'sv',
    dateModified: updatedAt,
    isPartOf: {
      '@type': 'Dataset',
      name: 'STRIM',
      url: STRIM_BASE_URL,
      description: 'Svenskt datalager för substansbruk och missbruksvård',
      creator: {
        '@type': 'Organization',
        name: 'Stiftelsen för samordning och riktlinjer för missbruksvård',
        url: STRIM_BASE_URL,
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    },
  };
}

// =============================================================================
// SUBSTANCE JSON-LD
// =============================================================================

export function generateSubstanceJsonLd(substance: SubstanceEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'substance',
    substance.canonical_slug,
    substance.name_sv,
    substance.updated_at
  );

  return {
    ...base,
    drugClass: substance.classification_primary,
    activeIngredient: substance.pharmacological_class,
    ...(substance.pharmacology?.mechanism_of_action && {
      mechanismOfAction: substance.pharmacology.mechanism_of_action,
    }),
    warning: substance.risk_category !== 'unknown' 
      ? `Riskprofil: ${substance.risk_category}` 
      : undefined,
    legalStatus: {
      '@type': 'DrugLegalStatus',
      applicableLocation: {
        '@type': 'AdministrativeArea',
        name: 'Sverige',
      },
      description: substance.current_legal_status,
    },
    ...(substance.sources?.length && {
      citation: substance.sources.map((s: StrimSource) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    }),
  };
}

// =============================================================================
// DIAGNOSIS JSON-LD
// =============================================================================

export function generateDiagnosisJsonLd(diagnosis: DiagnosisEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'diagnosis',
    diagnosis.canonical_slug,
    diagnosis.name_sv,
    diagnosis.updated_at
  );

  return {
    ...base,
    description: diagnosis.definition,
    ...(diagnosis.icd_10_code && {
      code: {
        '@type': 'MedicalCode',
        codeValue: diagnosis.icd_10_code,
        codingSystem: 'ICD-10',
      },
    }),
    ...(diagnosis.icd_11_code && {
      alternateName: `ICD-11: ${diagnosis.icd_11_code}`,
    }),
    ...(diagnosis.typical_onset_age && {
      typicalAgeRange: diagnosis.typical_onset_age,
    }),
    ...(diagnosis.sources?.length && {
      citation: diagnosis.sources.map((s: StrimSource) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    }),
  };
}

// =============================================================================
// TREATMENT JSON-LD
// =============================================================================

export function generateTreatmentJsonLd(treatment: TreatmentEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'treatment',
    treatment.canonical_slug,
    treatment.name_sv,
    treatment.updated_at
  );

  const evidenceMap: Record<string, string> = {
    level_1a: 'EvidenceLevelA',
    level_1b: 'EvidenceLevelA',
    level_2a: 'EvidenceLevelB',
    level_2b: 'EvidenceLevelB',
    level_3: 'EvidenceLevelC',
    level_4: 'EvidenceLevelC',
    level_5: 'EvidenceLevelC',
  };

  return {
    ...base,
    ...(treatment.evidence_summary && {
      description: treatment.evidence_summary,
    }),
    procedureType: treatment.method_type,
    ...(treatment.evidence_level && treatment.evidence_level !== 'unknown' && {
      evidenceLevel: evidenceMap[treatment.evidence_level] || 'EvidenceLevelC',
    }),
    ...(treatment.contraindications?.length && {
      contraindication: treatment.contraindications.map(c => ({
        '@type': 'MedicalContraindication',
        name: c,
      })),
    }),
    ...(treatment.sources?.length && {
      citation: treatment.sources.map((s: StrimSource) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    }),
  };
}

// =============================================================================
// LEGAL JSON-LD
// =============================================================================

export function generateLegalJsonLd(legal: LegalEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'legal',
    legal.canonical_slug,
    legal.name_sv,
    legal.updated_at
  );

  return {
    ...base,
    '@type': 'Legislation',
    legislationType: legal.jurisdiction_level || 'national',
    legislationJurisdiction: {
      '@type': 'AdministrativeArea',
      name: legal.jurisdiction === 'SE' ? 'Sverige' : legal.jurisdiction,
    },
    dateEnacted: legal.valid_from,
    ...(legal.valid_to && {
      expires: legal.valid_to,
    }),
    description: legal.summary,
    ...(legal.sfs_number && {
      legislationIdentifier: legal.sfs_number,
    }),
    ...(legal.sources?.length && {
      citation: legal.sources.map((s: StrimSource) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    }),
  };
}

// =============================================================================
// STATISTIC JSON-LD
// =============================================================================

export function generateStatisticJsonLd(statistic: StatisticEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'statistic',
    statistic.canonical_slug,
    statistic.indicator_name_sv,
    statistic.updated_at
  );

  return {
    ...base,
    '@type': 'Dataset',
    measurementTechnique: statistic.unit,
    ...(statistic.first_available_year && statistic.last_available_year && {
      temporalCoverage: `${statistic.first_available_year}/${statistic.last_available_year}`,
    }),
    spatialCoverage: {
      '@type': 'AdministrativeArea',
      name: statistic.geography_level === 'national' ? 'Sverige' : statistic.geography_level,
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${STRIM_BASE_URL}/api/strim-api/v1/statistics/${statistic.canonical_slug}`,
    },
    creator: {
      '@type': 'Organization',
      name: statistic.data_source,
      ...(statistic.data_source_url && { url: statistic.data_source_url }),
    },
    ...(statistic.uncertainty_description && {
      variableMeasured: {
        '@type': 'PropertyValue',
        name: statistic.indicator_name_sv,
        unitText: statistic.unit,
        description: statistic.uncertainty_description,
      },
    }),
  };
}

// =============================================================================
// TERM JSON-LD
// =============================================================================

export function generateTermJsonLd(term: TermEntity): Record<string, unknown> {
  const base = createBaseJsonLd(
    'term',
    term.canonical_slug,
    term.term_sv,
    term.updated_at
  );

  return {
    ...base,
    '@type': 'DefinedTerm',
    description: term.definition_sv,
    ...(term.term_en && {
      alternateName: term.term_en,
    }),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'STRIM Begreppsordlista',
      url: `${STRIM_BASE_URL}/data/begrepp`,
    },
    ...(term.usage_context?.length && {
      usageNote: `Används inom: ${term.usage_context.join(', ')}`,
    }),
    ...(term.sources?.length && {
      citation: term.sources.map((s: StrimSource) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    }),
  };
}

// =============================================================================
// GENERIC GENERATOR
// =============================================================================

export function generateJsonLd(
  entity: StrimBaseEntity & Record<string, unknown>,
  type: StrimEntityType
): Record<string, unknown> {
  switch (type) {
    case 'substance':
      return generateSubstanceJsonLd(entity as unknown as SubstanceEntity);
    case 'diagnosis':
      return generateDiagnosisJsonLd(entity as unknown as DiagnosisEntity);
    case 'treatment':
      return generateTreatmentJsonLd(entity as unknown as TreatmentEntity);
    case 'legal':
      return generateLegalJsonLd(entity as unknown as LegalEntity);
    case 'statistic':
      return generateStatisticJsonLd(entity as unknown as StatisticEntity);
    case 'term':
      return generateTermJsonLd(entity as unknown as TermEntity);
    default:
      return createBaseJsonLd(type, '', '', new Date().toISOString());
  }
}

// =============================================================================
// WEBSITE JSON-LD (for homepage)
// =============================================================================

export function generateWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${STRIM_BASE_URL}/#website`,
    url: STRIM_BASE_URL,
    name: 'STRIM',
    description: 'Stiftelsen för samordning och riktlinjer för missbruksvård - Svenskt datalager för substansbruk och beroendevård',
    inLanguage: 'sv',
    publisher: {
      '@type': 'Organization',
      '@id': `${STRIM_BASE_URL}/#organization`,
      name: 'STRIM',
      url: STRIM_BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${STRIM_BASE_URL}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${STRIM_BASE_URL}/sok?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// =============================================================================
// DATASET CATALOG JSON-LD
// =============================================================================

export function generateDataCatalogJsonLd(entityCounts: Record<StrimEntityType, number>): Record<string, unknown> {
  const totalEntities = Object.values(entityCounts).reduce((sum, count) => sum + count, 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    '@id': `${STRIM_BASE_URL}/data/#catalog`,
    name: 'STRIM Data Catalog',
    description: 'Komplett katalog över STRIM:s kanoniska dataobjekt',
    url: `${STRIM_BASE_URL}/data`,
    provider: {
      '@type': 'Organization',
      name: 'STRIM',
      url: STRIM_BASE_URL,
    },
    dataset: [
      {
        '@type': 'Dataset',
        name: 'Substanser',
        description: 'Katalog över psykoaktiva substanser',
        url: `${STRIM_BASE_URL}/data/substans`,
        distribution: {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: `${STRIM_BASE_URL}/api/strim-api/v1/substances`,
        },
      },
      {
        '@type': 'Dataset',
        name: 'Diagnoser',
        description: 'Katalog över beroendetillstånd och diagnoser',
        url: `${STRIM_BASE_URL}/data/diagnos`,
      },
      {
        '@type': 'Dataset',
        name: 'Behandlingsmetoder',
        description: 'Katalog över evidensbaserade behandlingsmetoder',
        url: `${STRIM_BASE_URL}/data/behandling`,
      },
      {
        '@type': 'Dataset',
        name: 'Lagstiftning',
        description: 'Katalog över relevant lagstiftning',
        url: `${STRIM_BASE_URL}/data/lag`,
      },
      {
        '@type': 'Dataset',
        name: 'Statistik',
        description: 'Nationell statistik om substansbruk',
        url: `${STRIM_BASE_URL}/data/statistik`,
      },
      {
        '@type': 'Dataset',
        name: 'Begrepp',
        description: 'Ordlista och definitioner',
        url: `${STRIM_BASE_URL}/data/begrepp`,
      },
    ],
    size: `${totalEntities} entiteter`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
}
