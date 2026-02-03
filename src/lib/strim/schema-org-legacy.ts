/**
 * STRIM JSON-LD Generator (Legacy)
 * 
 * Original implementation for backwards compatibility.
 * New code should use schema-org.ts directly.
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
// GENERIC GENERATOR
// =============================================================================

export function generateJsonLd(
  entity: StrimBaseEntity & Record<string, unknown>,
  type: StrimEntityType
): Record<string, unknown> {
  const name = (entity.name_sv || entity.term_sv || entity.indicator_name_sv || entity.canonical_slug) as string;
  return createBaseJsonLd(type, entity.canonical_slug, name, entity.updated_at);
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
