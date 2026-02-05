/**
 * INTERNAL LINKS
 * 
 * CDP links always to:
 * - Related decision types
 * - Alternative entities
 * - Uncertainty explanations
 * - Method descriptions
 * 
 * This builds knowledge graph, not blog network.
 */

import { buildCDPUrl, buildDRCUrl, toSlug } from './url-builder';

// ═══════════════════════════════════════════════════════════════════
//                         LINK TYPES
// ═══════════════════════════════════════════════════════════════════

export type InternalLinkType = 
  | 'related_decision'
  | 'alternative_entity'
  | 'uncertainty_explanation'
  | 'method_description'
  | 'reference_case';

export interface InternalLink {
  readonly type: InternalLinkType;
  readonly href: string;
  readonly text: string;
  readonly rel: 'related' | 'alternate';
}

// ═══════════════════════════════════════════════════════════════════
//                         LINK GENERATORS
// ═══════════════════════════════════════════════════════════════════

export function generateRelatedDecisionLinks(
  currentDomain: string,
  relatedDomains: readonly string[],
  entity: string
): readonly InternalLink[] {
  return relatedDomains.map(domain => ({
    type: 'related_decision' as const,
    href: buildCDPUrl(domain, entity),
    text: `${entity} in ${domain} context`,
    rel: 'related' as const,
  }));
}

export function generateAlternativeEntityLinks(
  domain: string,
  alternatives: readonly string[]
): readonly InternalLink[] {
  return alternatives.map(alt => ({
    type: 'alternative_entity' as const,
    href: buildCDPUrl(domain, alt),
    text: `Decision structure: ${alt}`,
    rel: 'alternate' as const,
  }));
}

export function generateUncertaintyLinks(
  domain: string,
  entity: string
): readonly InternalLink[] {
  return [{
    type: 'uncertainty_explanation' as const,
    href: buildCDPUrl(domain, entity, 'uncertainty'),
    text: 'Detailed uncertainty analysis',
    rel: 'related' as const,
  }];
}

export function generateMethodLinks(): readonly InternalLink[] {
  return [{
    type: 'method_description' as const,
    href: '/method/decision-legitimacy-ontology',
    text: 'Decision Legitimacy Methodology',
    rel: 'related' as const,
  }];
}

export function generateReferenceLinks(
  relatedDecisionIds: readonly string[]
): readonly InternalLink[] {
  return relatedDecisionIds.map(id => ({
    type: 'reference_case' as const,
    href: buildDRCUrl(id),
    text: `Reference case: ${id}`,
    rel: 'related' as const,
  }));
}

// ═══════════════════════════════════════════════════════════════════
//                         COMBINED LINK SET
// ═══════════════════════════════════════════════════════════════════

export interface LinkSet {
  readonly related: readonly InternalLink[];
  readonly alternatives: readonly InternalLink[];
  readonly methodology: readonly InternalLink[];
  readonly references: readonly InternalLink[];
}

export function generateFullLinkSet(
  domain: string,
  entity: string,
  options: {
    relatedDomains?: readonly string[];
    alternativeEntities?: readonly string[];
    referenceIds?: readonly string[];
  } = {}
): LinkSet {
  return {
    related: [
      ...generateRelatedDecisionLinks(domain, options.relatedDomains || [], entity),
      ...generateUncertaintyLinks(domain, entity),
    ],
    alternatives: generateAlternativeEntityLinks(domain, options.alternativeEntities || []),
    methodology: generateMethodLinks(),
    references: generateReferenceLinks(options.referenceIds || []),
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         HTML GENERATION
// ═══════════════════════════════════════════════════════════════════

export function linksToHtml(links: readonly InternalLink[]): string {
  return links
    .map(link => `<a href="${link.href}" rel="${link.rel}">${link.text}</a>`)
    .join('\n');
}
