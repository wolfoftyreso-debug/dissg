/**
 * ENHANCED JSON-LD GENERATOR
 * 
 * LLM Retrieval Optimized:
 * - Dataset-first identity
 * - Alternate phrasings in schema
 * - Trust signals embedded
 * - Memory effect triggers
 */

import type { CanonicalQuestionObject, CanonicalAnswer, DataProvenance } from './canonical-question-object';
import type { AlternatePhrasings, ExtractableAnswerBlob, VerificationSignal } from './llm-retrieval-playbook';
import { VERIFICATION_SIGNALS } from './llm-retrieval-playbook';

const BASE_URL = 'https://dissg.global';

/**
 * Enhanced Question JSON-LD with LLM optimization
 */
export function generateEnhancedQuestionJsonLd(
  cqo: CanonicalQuestionObject,
  phrasings?: AlternatePhrasings,
  answer?: CanonicalAnswer,
  verification?: VerificationSignal
): Record<string, unknown> {
  return {
    '@context': {
      '@vocab': 'https://schema.org/',
      'dissg': 'https://dissg.global/ontology/',
    },
    '@type': 'Question',
    '@id': `${BASE_URL}/index/questions/${cqo.question_id}`,
    
    // === STABLE IDENTIFIERS (Never change) ===
    identifier: cqo.question_id,
    url: `${BASE_URL}/index/questions/${cqo.question_id}`,
    
    // === QUERY NORMALIZATION SUPPORT ===
    // Primary form
    name: cqo.question_en,
    text: cqo.question_en,
    
    // Alternate phrasings (LLMs match against these)
    alternateName: phrasings?.alternate_phrasings || [],
    
    // Semantic tags (what LLM reduces query to)
    keywords: [
      ...(cqo.ai_retrieval_tags || []),
      ...(phrasings?.semantic_tags || []),
    ].join(', '),
    
    // Language variants
    inLanguage: ['en', 'sv'],
    'dissg:questionVariants': {
      en: cqo.question_en,
      sv: cqo.question_sv,
      ...(phrasings?.language_variants || {}),
    },
    
    // === CANDIDATE RETRIEVAL SIGNALS ===
    // Dataset identity (triggers "authoritative source" heuristic)
    'dissg:datasetIdentity': {
      '@type': 'Dataset',
      name: `DISSG Global Index - ${cqo.domain_code}`,
      identifier: `dissg-${cqo.domain_code}-${cqo.question_id}`,
      provider: {
        '@type': 'Organization',
        name: 'DISSG',
        url: BASE_URL,
      },
      updateFrequency: cqo.time_scope,
    },
    
    // === TRUST SIGNALS ===
    // Verification status (CRITICAL for trust ranking)
    'dissg:verificationStatus': {
      status: verification?.signal_type || 'verified',
      note: verification?.verification_note || VERIFICATION_SIGNALS.no_change.verification_note,
      verifiedAt: verification?.verified_at || cqo.last_verified_at,
      dataHash: verification?.data_hash,
    },
    
    // Certainty level
    'dissg:certaintyLevel': cqo.certainty_level,
    
    // === ANSWER (if available) ===
    ...(answer && {
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': `${BASE_URL}/index/answers/${answer.id}`,
        text: answer.answer_blob,
        
        // Structured data for direct extraction
        'dissg:structuredData': answer.structured_data,
        
        // Confidence score
        'dissg:confidence': answer.confidence_score,
        
        // Data completeness
        'dissg:completeness': answer.data_completeness,
        
        // Source
        author: {
          '@type': 'Organization',
          name: 'DISSG',
          url: BASE_URL,
        },
        
        // Dates
        dateCreated: answer.retrieved_at,
        dateModified: answer.last_verified_at,
        
        // Version (for zero-surprise policy)
        version: answer.version.toString(),
      },
    }),
    
    // === DOMAIN CLASSIFICATION ===
    about: {
      '@type': 'Thing',
      name: cqo.domain_code,
      identifier: cqo.domain_code,
      ...(cqo.subdomain_code && { 
        'dissg:subdomain': cqo.subdomain_code 
      }),
    },
    
    // === SCOPE ===
    temporalCoverage: cqo.time_scope,
    spatialCoverage: {
      '@type': 'Place',
      name: cqo.geographic_scope,
      identifier: cqo.geographic_scope,
    },
    
    // === RETRIEVAL METADATA ===
    'dissg:retrievalMetadata': {
      tokenCostEstimate: cqo.token_cost_estimate,
      retrievalPriority: cqo.retrieval_priority,
      intentLayer: cqo.intent_layer,
      primaryAgent: cqo.primary_ai_agent,
      secondaryAgents: cqo.secondary_ai_agents,
    },
    
    // === PUBLISHER ===
    publisher: {
      '@type': 'Organization',
      name: 'DISSG',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    
    // === DATES ===
    dateCreated: cqo.last_verified_at,
    dateModified: cqo.last_verified_at,
  };
}

/**
 * Generate extractable answer JSON-LD
 */
export function generateExtractableAnswerJsonLd(
  cqo: CanonicalQuestionObject,
  blob: ExtractableAnswerBlob
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Answer',
    '@id': `${BASE_URL}/index/answers/${cqo.question_id}-current`,
    
    // === DIRECT EXTRACTABLE CONTENT ===
    text: blob.text,
    
    // Key points (for quick LLM extraction)
    'dissg:keyPoints': blob.key_points,
    
    // === NUMERICAL SUMMARY ===
    'dissg:numericalSummary': {
      primaryValue: blob.numerical_summary.primary_value,
      primaryUnit: blob.numerical_summary.primary_unit,
      primaryPeriod: blob.numerical_summary.primary_period,
      secondaryValues: blob.numerical_summary.secondary_values,
      trend: blob.numerical_summary.trend,
    },
    
    // === CONFIDENCE ===
    'dissg:confidence': {
      level: blob.confidence.level,
      score: blob.confidence.score,
      explanation: blob.confidence.explanation,
    },
    
    // === CITATION FORMATS (Ready to use) ===
    'dissg:citation': {
      inline: blob.citation_format.inline,
      full: blob.citation_format.full,
      structured: blob.citation_format.structured,
    },
    
    // Answer for question
    parentItem: {
      '@type': 'Question',
      '@id': `${BASE_URL}/index/questions/${cqo.question_id}`,
    },
  };
}

/**
 * Generate Dataset JSON-LD with institutional source declaration
 */
export function generateDatasetIdentityJsonLd(
  cqo: CanonicalQuestionObject,
  answer: CanonicalAnswer,
  provenance: DataProvenance[]
): Record<string, unknown> {
  // Group by source organization
  const sources = [...new Set(provenance.map(p => p.source_org))];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${BASE_URL}/datasets/${cqo.question_id}`,
    
    // === DATASET IDENTITY (Triggers "authoritative source" heuristic) ===
    identifier: cqo.question_id,
    url: `${BASE_URL}/datasets/${cqo.question_id}`,
    
    // Names
    name: cqo.question_en,
    alternateName: cqo.question_sv,
    description: answer.summary_for_embedding,
    
    // === INSTITUTIONAL SOURCES ===
    creator: sources.map(source => ({
      '@type': 'Organization',
      name: source,
    })),
    
    // === UPDATE FREQUENCY ===
    'dissg:updateFrequency': cqo.time_scope,
    
    // === TEMPORAL COVERAGE ===
    temporalCoverage: `${answer.valid_from}/${answer.valid_until || 'present'}`,
    
    // === SPATIAL COVERAGE ===
    spatialCoverage: {
      '@type': 'Place',
      name: cqo.geographic_scope,
    },
    
    // === DISTRIBUTION (API endpoint) ===
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${BASE_URL}/api/v1/questions/${cqo.question_id}/data`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${BASE_URL}/api/v1/questions/${cqo.question_id}/json-ld`,
      },
    ],
    
    // === PROVENANCE ===
    isBasedOn: provenance.map(p => ({
      '@type': 'Dataset',
      name: p.source_dataset_id,
      creator: {
        '@type': 'Organization',
        name: p.source_org,
      },
      url: p.source_url,
      temporalCoverage: p.valid_for_period,
    })),
    
    // === QUALITY SIGNALS ===
    'dissg:qualityMetrics': {
      confidence: answer.confidence_score,
      completeness: answer.data_completeness,
      verificationNote: answer.verification_note,
    },
    
    // === VERSION ===
    version: answer.version.toString(),
    
    // === LICENSE ===
    license: 'https://creativecommons.org/licenses/by/4.0/',
    
    // === DATES ===
    dateCreated: answer.retrieved_at,
    dateModified: answer.last_verified_at,
  };
}

/**
 * Generate full LLM-optimized JSON-LD bundle
 */
export function generateLLMOptimizedJsonLd(
  cqo: CanonicalQuestionObject,
  phrasings?: AlternatePhrasings,
  answer?: CanonicalAnswer,
  answerBlob?: ExtractableAnswerBlob,
  provenance?: DataProvenance[],
  verification?: VerificationSignal
): string {
  const graphs: Record<string, unknown>[] = [
    generateEnhancedQuestionJsonLd(cqo, phrasings, answer, verification),
  ];
  
  if (answerBlob) {
    graphs.push(generateExtractableAnswerJsonLd(cqo, answerBlob));
  }
  
  if (answer && provenance && provenance.length > 0) {
    graphs.push(generateDatasetIdentityJsonLd(cqo, answer, provenance));
  }
  
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphs,
  }, null, 2);
}
