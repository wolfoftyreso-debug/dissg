/**
 * SCHEMA GENERATORS
 * 
 * Schema.org + Custom Ontology JSON-LD generators
 */

import type {
  SchemaOrgDefinedTerm,
  SchemaOrgFAQPage,
  SchemaOrgQuestion,
  DecisionLegitimacySchema,
  MachineReadableDecision,
  PageType,
} from './types';
import { ONTOLOGY_NAMESPACE } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         SCHEMA.ORG GENERATORS
// ═══════════════════════════════════════════════════════════════════

export function generateDefinedTermSchema(
  entity: string,
  decisionType: string
): SchemaOrgDefinedTerm {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `${entity} (decision context)`,
    description: `Conditional decision structure for evaluating ${entity} under explicit assumptions.`,
    inDefinedTermSet: 'DecisionLegitimacyOntology_v1',
  };
}

/**
 * FAQ Markup - but never normative
 * The answer ALWAYS points back to decision structure
 */
export function generateFAQSchema(
  question: string,
  entity: string
): SchemaOrgFAQPage {
  const nonNormativeAnswer = `This depends on assumptions such as usage profile, budget, and time horizon. The decision structure for ${entity} is shown on this page.`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: nonNormativeAnswer,
      },
    }],
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         CUSTOM ONTOLOGY
// ═══════════════════════════════════════════════════════════════════

export function generateDecisionLegitimacySchema(
  entity: string,
  decisionType: string,
  options: {
    assumptionsRequired?: boolean;
    alternativesExposed?: boolean;
    uncertaintiesVisible?: boolean;
  } = {}
): DecisionLegitimacySchema {
  return {
    '@context': {
      dl: ONTOLOGY_NAMESPACE,
    },
    '@type': 'dl:ConditionalDecision',
    'dl:entity': entity,
    'dl:decisionType': decisionType,
    'dl:assumptionsRequired': options.assumptionsRequired ?? true,
    'dl:alternativesExposed': options.alternativesExposed ?? true,
    'dl:uncertaintiesVisible': options.uncertaintiesVisible ?? true,
    'dl:recommendationGiven': false, // ALWAYS false
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         AI CRAWLER OUTPUT
// ═══════════════════════════════════════════════════════════════════

export function generateMachineReadableOutput(
  entity: string,
  domain: string,
  decisionType: string,
  pageType: PageType,
  canonicalUrl: string,
  data: {
    alternativesCount: number;
    uncertaintiesCount: number;
    assumptions: readonly string[];
  }
): MachineReadableDecision {
  return {
    decision_type: decisionType,
    entity,
    domain,
    alternatives_exposed: data.alternativesCount >= 2,
    alternatives_count: data.alternativesCount,
    uncertainties: data.uncertaintiesCount,
    assumptions_required: data.assumptions,
    recommendation: false, // ALWAYS false
    ontology_version: '1.0',
    page_type: pageType,
    canonical_url: canonicalUrl,
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         COMBINED SCHEMA
// ═══════════════════════════════════════════════════════════════════

export interface CombinedSchema {
  readonly schemaOrg: SchemaOrgDefinedTerm;
  readonly faq?: SchemaOrgFAQPage;
  readonly decisionLegitimacy: DecisionLegitimacySchema;
}

export function generateCombinedSchema(
  entity: string,
  decisionType: string,
  originalQuestion?: string
): CombinedSchema {
  const result: CombinedSchema = {
    schemaOrg: generateDefinedTermSchema(entity, decisionType),
    decisionLegitimacy: generateDecisionLegitimacySchema(entity, decisionType),
  };
  
  if (originalQuestion) {
    return {
      ...result,
      faq: generateFAQSchema(originalQuestion, entity),
    };
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════
//                         JSON-LD SERIALIZER
// ═══════════════════════════════════════════════════════════════════

export function serializeToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

export function createJsonLdScript(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
