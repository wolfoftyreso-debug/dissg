/**
 * HTML STRUCTURE
 * 
 * Canonical H1/H2 structure for CDP pages
 * Google loves consistency + clarity
 */

import { CDP_SECTION_ORDER, type CDPSection } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         H1 GENERATOR
// ═══════════════════════════════════════════════════════════════════

/**
 * H1 always same form:
 * "Under which assumptions is {entity} a rational choice?"
 * 
 * ❌ Never:
 * - "Is Volkswagen Golf good?"
 * - "Volkswagen Golf review"
 */
export function generateCanonicalH1(entity: string): string {
  return `Under which assumptions is ${entity} a rational choice?`;
}

// FORBIDDEN H1 patterns
const FORBIDDEN_H1_PATTERNS = [
  /^is\s+.+\s+good/i,
  /^.+\s+review$/i,
  /^best\s+/i,
  /^top\s+/i,
  /^.+\s+vs\s+.+$/i,
  /should\s+you/i,
  /recommend/i,
];

export function validateH1(h1: string): { valid: boolean; reason?: string } {
  for (const pattern of FORBIDDEN_H1_PATTERNS) {
    if (pattern.test(h1)) {
      return { valid: false, reason: `H1 matches forbidden pattern: ${pattern}` };
    }
  }
  
  if (!h1.includes('assumptions') && !h1.includes('conditions')) {
    return { valid: false, reason: 'H1 must reference assumptions or conditions' };
  }
  
  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════
//                         H2 SECTIONS
// ═══════════════════════════════════════════════════════════════════

export interface CDPSectionContent {
  readonly heading: CDPSection;
  readonly content: string;
  readonly order: number;
}

export function generateCDPSections(data: {
  scope: string;
  assumptions: readonly string[];
  alternatives: readonly string[];
  tradeOffs: readonly string[];
  uncertainties: readonly string[];
  limitations: readonly string[];
}): readonly CDPSectionContent[] {
  return [
    {
      heading: 'Decision Scope',
      content: data.scope,
      order: 0,
    },
    {
      heading: 'Assumptions Required',
      content: data.assumptions.map(a => `• ${a}`).join('\n'),
      order: 1,
    },
    {
      heading: 'Alternatives Considered',
      content: data.alternatives.map(a => `• ${a}`).join('\n'),
      order: 2,
    },
    {
      heading: 'Trade-offs & Dominance Conditions',
      content: data.tradeOffs.map(t => `• ${t}`).join('\n'),
      order: 3,
    },
    {
      heading: 'Known Uncertainties',
      content: data.uncertainties.map(u => `• ${u}`).join('\n'),
      order: 4,
    },
    {
      heading: 'What This Does Not Mean',
      content: data.limitations.map(l => `• ${l}`).join('\n'),
      order: 5,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════
//                         META TAGS
// ═══════════════════════════════════════════════════════════════════

export interface MetaTags {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly robots: string;
}

export function generateMetaTags(
  entity: string,
  domain: string,
  canonicalUrl: string
): MetaTags {
  return {
    title: `Decision Structure: ${entity} | ${domain}`,
    description: `Conditional decision framework for ${entity}. Explore assumptions, alternatives, and uncertainties without recommendations.`,
    canonical: canonicalUrl,
    robots: 'index, follow',
  };
}

export function generateUYPMetaTags(
  query: string,
  canonicalUrl: string
): MetaTags {
  return {
    title: 'Cannot Be Answered Responsibly Yet',
    description: `This question requires additional data before a legitimate decision structure can be provided. Data gaps are documented.`,
    canonical: canonicalUrl,
    robots: 'index, follow', // Still index - transparency is valuable
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         E-E-A-T (SYSTEMIC)
// ═══════════════════════════════════════════════════════════════════

/**
 * E-E-A-T without persons.
 * Authority lies in: structure + transparency + consistency
 * 
 * ❌ No author profiles
 * ❌ No "experts say"
 * ❌ No quotes
 */
export const EEAT_PRINCIPLES = {
  EXPERTISE: 'Demonstrated through ontology structure and coverage',
  EXPERIENCE: 'Shown via reference cases and post-decision reviews',
  AUTHORITY: 'Built through consistency and machine-readability',
  TRUST: 'Established by explicit limitations and no recommendations',
} as const;

export function generateEEATSignals(): string[] {
  return [
    'Decision structure follows DecisionLegitimacyOntology v1',
    'All alternatives symmetrically exposed',
    'Uncertainties explicitly documented',
    'No recommendations given',
    'Machine-readable JSON endpoint available',
  ];
}
