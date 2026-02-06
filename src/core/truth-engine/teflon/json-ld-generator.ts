/**
 * JSON-LD GENERATOR
 * 
 * Machine-first landing pages:
 * 1. JSON-LD (PRIMARY)
 * 2. Schema.org / Dataset
 * 3. Plain HTML (SECONDARY)
 * 4. Human-readable last
 * 
 * AI reads structure, not text.
 */

import type { CanonicalQuestionObject, CanonicalAnswer, DataProvenance } from './canonical-question-object';

/**
 * Base URL for canonical references
 */
const BASE_URL = 'https://dissg.global';

/**
 * Generate JSON-LD for a question (Schema.org Question + Dataset)
 */
export function generateQuestionJsonLd(
  cqo: CanonicalQuestionObject,
  answer?: CanonicalAnswer
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Question',
    '@id': `${BASE_URL}/index/questions/${cqo.question_id}`,
    
    // Core identifiers
    identifier: cqo.question_id,
    url: `${BASE_URL}/index/questions/${cqo.question_id}`,
    
    // The question
    name: cqo.question_en,
    text: cqo.question_en,
    inLanguage: ['en', 'sv'],
    
    // Accepted answer (if available)
    ...(answer && {
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': `${BASE_URL}/index/answers/${answer.id}`,
        text: answer.answer_blob,
        dateCreated: answer.retrieved_at,
        dateModified: answer.last_verified_at,
        author: {
          '@type': 'Organization',
          name: 'DISSG',
          url: BASE_URL,
        },
      },
    }),
    
    // Classification
    about: {
      '@type': 'Thing',
      name: cqo.domain_code,
      identifier: cqo.domain_code,
    },
    
    // Temporal scope
    temporalCoverage: cqo.time_scope,
    
    // Geographic scope
    spatialCoverage: {
      '@type': 'Place',
      name: cqo.geographic_scope,
    },
    
    // Quality signals
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'certaintyLevel',
        value: cqo.certainty_level,
      },
      {
        '@type': 'PropertyValue',
        name: 'verificationStatus',
        value: cqo.verification_status,
      },
      {
        '@type': 'PropertyValue',
        name: 'lastVerified',
        value: cqo.last_verified_at,
      },
      {
        '@type': 'PropertyValue',
        name: 'primaryAgent',
        value: cqo.primary_ai_agent,
      },
      {
        '@type': 'PropertyValue',
        name: 'intentLayer',
        value: cqo.intent_layer,
      },
    ],
    
    // Keywords for retrieval
    keywords: cqo.ai_retrieval_tags.join(', '),
    
    // Publisher
    publisher: {
      '@type': 'Organization',
      name: 'DISSG',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    
    // Dates
    dateCreated: cqo.last_verified_at,
    dateModified: cqo.last_verified_at,
  };
}

/**
 * Generate JSON-LD Dataset for structured data
 */
export function generateDatasetJsonLd(
  cqo: CanonicalQuestionObject,
  answer: CanonicalAnswer,
  provenance: DataProvenance[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${BASE_URL}/datasets/${cqo.question_id}`,
    
    // Identifiers
    identifier: cqo.question_id,
    url: `${BASE_URL}/datasets/${cqo.question_id}`,
    
    // Names
    name: cqo.question_en,
    alternateName: cqo.question_sv,
    description: answer.summary_for_embedding,
    
    // Keywords
    keywords: cqo.ai_retrieval_tags,
    
    // Temporal
    temporalCoverage: `${answer.valid_from}/${answer.valid_until || 'present'}`,
    
    // Spatial
    spatialCoverage: {
      '@type': 'Place',
      name: cqo.geographic_scope,
    },
    
    // Distribution
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${BASE_URL}/api/v1/questions/${cqo.question_id}/data`,
    },
    
    // Provenance
    creator: {
      '@type': 'Organization',
      name: 'DISSG',
      url: BASE_URL,
    },
    
    // Sources
    isBasedOn: provenance.map(p => ({
      '@type': 'Dataset',
      name: p.source_dataset_id,
      creator: {
        '@type': 'Organization',
        name: p.source_org,
      },
      url: p.source_url,
    })),
    
    // Quality
    variableMeasured: provenance.map(p => ({
      '@type': 'PropertyValue',
      name: 'value',
      value: p.value,
      unitText: p.unit,
      validFrom: p.valid_for_period,
    })),
    
    // Dates
    dateCreated: answer.retrieved_at,
    dateModified: answer.last_verified_at,
    
    // License
    license: 'https://creativecommons.org/licenses/by/4.0/',
    
    // Version
    version: answer.version.toString(),
  };
}

/**
 * Generate provenance JSON-LD for a single data point
 */
export function generateProvenanceJsonLd(provenance: DataProvenance): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Observation',
    
    // The value
    measuredValue: provenance.value,
    unitText: provenance.unit,
    
    // Source
    observedNode: {
      '@type': 'Organization',
      name: provenance.source_org,
    },
    
    // Dataset
    measurementMethod: provenance.source_dataset_id,
    
    // Temporal
    observationDate: provenance.retrieved_at,
    validFrom: provenance.valid_for_period,
    
    // Quality
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'confidence',
        value: provenance.confidence,
      },
      {
        '@type': 'PropertyValue',
        name: 'isPreliminary',
        value: provenance.is_preliminary,
      },
      {
        '@type': 'PropertyValue',
        name: 'revisionNumber',
        value: provenance.revision_number,
      },
    ],
    
    // Geographic
    ...(provenance.geo_code && {
      observationAbout: {
        '@type': 'Place',
        identifier: provenance.geo_code,
        name: provenance.geo_level,
      },
    }),
  };
}

/**
 * Generate full JSON-LD bundle for a question page
 */
export function generateFullJsonLd(
  cqo: CanonicalQuestionObject,
  answer?: CanonicalAnswer,
  provenance?: DataProvenance[]
): string {
  const graphs: Record<string, unknown>[] = [
    generateQuestionJsonLd(cqo, answer),
  ];
  
  if (answer && provenance) {
    graphs.push(generateDatasetJsonLd(cqo, answer, provenance));
    provenance.forEach(p => graphs.push(generateProvenanceJsonLd(p)));
  }
  
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphs,
  }, null, 2);
}

/**
 * Generate minimal JSON-LD for embedding in HTML
 */
export function generateMinimalJsonLd(cqo: CanonicalQuestionObject): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Question',
    '@id': `${BASE_URL}/index/questions/${cqo.question_id}`,
    identifier: cqo.question_id,
    name: cqo.question_en,
    inLanguage: 'en',
    keywords: cqo.ai_retrieval_tags.join(', '),
    dateModified: cqo.last_verified_at,
  });
}
