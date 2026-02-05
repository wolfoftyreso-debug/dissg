/**
 * URL BUILDER
 * 
 * Canonical URL structure:
 * /decision/{domain}/{entity}
 * /decision/{domain}/{entity}/assumptions
 * /decision/{domain}/{entity}/uncertainty
 * /reference/{decision_id}
 * /cannot-answer/{query_hash}
 */

import type { CanonicalUrl, PageType } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         SLUG UTILITIES
// ═══════════════════════════════════════════════════════════════════

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hashQuery(query: string): string {
  // Simple hash for query identification
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ═══════════════════════════════════════════════════════════════════
//                         URL BUILDERS
// ═══════════════════════════════════════════════════════════════════

export function buildCDPUrl(domain: string, entity: string, variant?: 'assumptions' | 'uncertainty'): string {
  const base = `/decision/${toSlug(domain)}/${toSlug(entity)}`;
  return variant ? `${base}/${variant}` : base;
}

export function buildDRCUrl(decisionId: string): string {
  return `/reference/${decisionId}`;
}

export function buildUYPUrl(queryHash: string): string {
  return `/cannot-answer/${queryHash}`;
}

export function buildJsonUrl(path: string): string {
  return `${path}.json`;
}

// ═══════════════════════════════════════════════════════════════════
//                         URL PARSER
// ═══════════════════════════════════════════════════════════════════

export interface ParsedUrl {
  readonly pageType: PageType;
  readonly domain?: string;
  readonly entity?: string;
  readonly variant?: 'assumptions' | 'uncertainty';
  readonly decisionId?: string;
  readonly queryHash?: string;
}

export function parseUrl(path: string): ParsedUrl | null {
  // CDP: /decision/{domain}/{entity}[/variant]
  const cdpMatch = path.match(/^\/decision\/([^/]+)\/([^/]+)(?:\/(assumptions|uncertainty))?$/);
  if (cdpMatch) {
    return {
      pageType: 'CDP',
      domain: cdpMatch[1],
      entity: cdpMatch[2],
      variant: cdpMatch[3] as 'assumptions' | 'uncertainty' | undefined,
    };
  }
  
  // DRC: /reference/{decision_id}
  const drcMatch = path.match(/^\/reference\/([^/]+)$/);
  if (drcMatch) {
    return {
      pageType: 'DRC',
      decisionId: drcMatch[1],
    };
  }
  
  // UYP: /cannot-answer/{query_hash}
  const uypMatch = path.match(/^\/cannot-answer\/([^/]+)$/);
  if (uypMatch) {
    return {
      pageType: 'UYP',
      queryHash: uypMatch[1],
    };
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════
//                         CANONICAL URL
// ═══════════════════════════════════════════════════════════════════

export function getCanonicalUrl(parsed: ParsedUrl, baseUrl: string): string {
  let path: string;
  
  switch (parsed.pageType) {
    case 'CDP':
      path = buildCDPUrl(parsed.domain!, parsed.entity!, parsed.variant);
      break;
    case 'DRC':
      path = buildDRCUrl(parsed.decisionId!);
      break;
    case 'UYP':
      path = buildUYPUrl(parsed.queryHash!);
      break;
  }
  
  return `${baseUrl}${path}`;
}
