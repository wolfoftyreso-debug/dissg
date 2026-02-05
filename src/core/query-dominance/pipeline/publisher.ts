/**
 * PIPELINE STAGE 7: PUBLICATION WITH DUAL CONSUMPTION
 * 
 * Every page published as:
 * A. Human view (structured, clickable, calm)
 * B. Machine view (strict JSON, schema.org, versioned)
 * 
 * This is how we win both SEO and AI.
 */

import type {
  PublicationResult,
  ConditionalAnswer,
  ResolvedEntity,
  NormalizedIntent,
} from './types';
import type { ConditionalDecisionPage, CDPBlock } from '../types';

/**
 * Publish CDP with dual views
 */
export function publishCDP(
  cdp: ConditionalDecisionPage,
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  answer: ConditionalAnswer
): PublicationResult {
  const version = 1;
  const publishedAt = new Date().toISOString();
  
  // Generate URLs
  const baseSlug = generateSlug(entity.entity_name, intent.decision_type);
  const humanViewUrl = `/decision/${baseSlug}`;
  const machineViewUrl = `/api/v1/cdp/${cdp.cdp_id}`;
  
  // Generate Schema.org markup
  const schemaOrgMarkup = generateSchemaOrg(cdp, entity, intent, answer);
  
  // Generate custom ontology
  const customOntology = generateCustomOntology(cdp, entity, intent, answer);
  
  return {
    cdp_id: cdp.cdp_id,
    human_view_url: humanViewUrl,
    machine_view_url: machineViewUrl,
    schema_org_markup: schemaOrgMarkup,
    custom_ontology: customOntology,
    version,
    published_at: publishedAt,
  };
}

/**
 * Generate URL slug
 */
function generateSlug(entityName: string, decisionType: string): string {
  const entitySlug = entityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const typeSlug = decisionType
    .toLowerCase()
    .replace(/_/g, '-');
  
  return `${entitySlug}-${typeSlug}`;
}

/**
 * Generate Schema.org markup for SEO and AI
 */
function generateSchemaOrg(
  cdp: ConditionalDecisionPage,
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  answer: ConditionalAnswer
): object {
  const filledBlocks = cdp.blocks.filter(b => b.has_content);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `https://example.com/cdp/${cdp.cdp_id}`,
    name: `Decision Analysis: ${entity.entity_name}`,
    description: `Structured conditional decision analysis for ${entity.entity_name} (${intent.decision_type})`,
    
    // Core metadata
    datePublished: cdp.generated_at,
    dateModified: cdp.generated_at,
    version: '1.0',
    
    // Subject
    about: {
      '@type': mapEntityTypeToSchemaOrg(entity.entity_type),
      name: entity.entity_name,
      identifier: entity.entity_id,
    },
    
    // Keywords for search
    keywords: [
      entity.entity_name,
      intent.decision_type,
      ...intent.domains,
      'decision analysis',
      'conditional evaluation',
    ],
    
    // Data quality indicators
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'confidence',
        value: answer.confidence,
      },
      {
        '@type': 'PropertyValue',
        name: 'block_fill_rate',
        value: filledBlocks.length / 50,
      },
      {
        '@type': 'PropertyValue',
        name: 'alternatives_compared',
        value: answer.compared_to.length,
      },
    ],
    
    // Temporal coverage
    temporalCoverage: intent.time_horizon,
    
    // Spatial coverage
    spatialCoverage: {
      '@type': 'Place',
      name: 'Global',
    },
    
    // License
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    
    // Publisher
    publisher: {
      '@type': 'Organization',
      name: 'Decision Intelligence Platform',
    },
    
    // Is accessible
    isAccessibleForFree: true,
    
    // Conditions for validity
    conditionsOfAccess: cdp.stated_assumptions.join('; ') || 'No specific conditions',
  };
}

/**
 * Map entity type to Schema.org type
 */
function mapEntityTypeToSchemaOrg(entityType: string): string {
  const mapping: Record<string, string> = {
    vehicle_model: 'Car',
    vehicle_brand: 'Brand',
    consumer_product: 'Product',
    service: 'Service',
    financial_instrument: 'FinancialProduct',
    policy: 'GovernmentService',
    medical_condition: 'MedicalCondition',
    treatment: 'MedicalTherapy',
    phenomenon: 'Thing',
    organization: 'Organization',
    location: 'Place',
    unknown: 'Thing',
  };
  
  return mapping[entityType] || 'Thing';
}

/**
 * Generate custom ontology for AI consumption
 */
function generateCustomOntology(
  cdp: ConditionalDecisionPage,
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  answer: ConditionalAnswer
): object {
  return {
    '@context': {
      '@vocab': 'https://decision-intelligence.org/ontology/',
      'cdp': 'https://decision-intelligence.org/cdp/',
      'block': 'https://decision-intelligence.org/block/',
    },
    '@type': 'cdp:ConditionalDecisionPage',
    '@id': `cdp:${cdp.cdp_id}`,
    
    // Entity reference
    'cdp:entity': {
      '@type': `entity:${entity.entity_type}`,
      '@id': `entity:${entity.entity_id}`,
      'cdp:name': entity.entity_name,
      'cdp:ontologyPath': entity.ontology_path,
      'cdp:confidence': entity.confidence,
    },
    
    // Intent classification
    'cdp:intent': {
      '@type': 'cdp:DecisionIntent',
      'cdp:intentId': intent.intent_id,
      'cdp:decisionType': intent.decision_type,
      'cdp:alternativesRequired': intent.alternatives_required,
      'cdp:riskExposure': intent.risk_exposure,
      'cdp:timeHorizon': intent.time_horizon,
      'cdp:domains': intent.domains,
    },
    
    // Block summary
    'cdp:blocks': {
      'cdp:total': 50,
      'cdp:filled': cdp.blocks.filter(b => b.has_content).length,
      'cdp:empty': cdp.blocks.filter(b => !b.has_content).length,
      'cdp:blockGroups': summarizeBlockGroups(cdp.blocks),
    },
    
    // Conditional answer
    'cdp:conditionalAnswer': {
      '@type': 'cdp:ConditionalAnswer',
      'cdp:conditions': answer.conditions.map(c => ({
        'cdp:variable': c.variable,
        'cdp:operator': c.operator,
        'cdp:value': c.value,
      })),
      'cdp:dominance': answer.dominance,
      'cdp:confidence': answer.confidence,
      'cdp:comparedTo': answer.compared_to,
      'cdp:validUntil': answer.valid_until,
    },
    
    // Forbidden outputs (for AI to know what NOT to conclude)
    'cdp:forbiddenOutputs': ['yes', 'no', 'best', 'recommended'],
    
    // Machine reading hints
    'cdp:machineHints': {
      'cdp:isConditional': true,
      'cdp:requiresContext': true,
      'cdp:neverRecommends': true,
      'cdp:showsUncertainty': true,
    },
  };
}

/**
 * Summarize block groups for ontology
 */
function summarizeBlockGroups(blocks: CDPBlock[]): object[] {
  const groups = [
    { id: 'scope_assumptions', range: [1, 5] },
    { id: 'cost_resources', range: [6, 15] },
    { id: 'performance_reliability', range: [16, 25] },
    { id: 'risk_failure_modes', range: [26, 35] },
    { id: 'dominance_tradeoffs', range: [36, 45] },
    { id: 'uncertainty_nonknowledge', range: [46, 50] },
  ];
  
  return groups.map(g => {
    const groupBlocks = blocks.filter(b => 
      b.block_id >= g.range[0] && b.block_id <= g.range[1]
    );
    const filled = groupBlocks.filter(b => b.has_content).length;
    
    return {
      '@type': 'cdp:BlockGroup',
      'cdp:groupId': g.id,
      'cdp:blockRange': g.range,
      'cdp:filled': filled,
      'cdp:total': groupBlocks.length,
      'cdp:fillRate': filled / groupBlocks.length,
    };
  });
}

/**
 * PUBLISHER MASTERPROMPT
 */
export const PUBLISHER_MASTERPROMPT = `
You handle PUBLICATION WITH DUAL CONSUMPTION.

EVERY PAGE PUBLISHED AS:

A. HUMAN VIEW
- Structured
- Clickable
- Calm
- Clear uncertainty

B. MACHINE VIEW
- Strict JSON
- Schema.org + custom ontology
- Versioned
- Deterministic

THIS WINS BOTH:
- SEO (Google understands structure)
- AI (Agents get grounded data)

SCHEMA.ORG MARKUP:
- Dataset type
- About: entity with proper type
- Keywords: searchable terms
- VariableMeasured: confidence, fill rate
- TemporalCoverage: time horizon
- License: CC BY-NC 4.0

CUSTOM ONTOLOGY:
- Full CDP structure
- Entity reference
- Intent classification
- Block summary
- Conditional answer
- Machine reading hints

MACHINE HINTS:
{
  "isConditional": true,
  "requiresContext": true,
  "neverRecommends": true,
  "showsUncertainty": true
}

This tells AI agents how to interpret the data.
`;
