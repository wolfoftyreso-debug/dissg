/**
 * 📊 PLATFORM COMPARISON
 * 
 * Global Open Reference Layer vs. Closed Analysis Platforms
 * 
 * Objective, dimension-by-dimension comparison.
 * No rhetoric. No attack. Only structural differences.
 */

// ============================================
// DOCUMENT METADATA
// ============================================

export const DOCUMENT_META = {
  title: {
    en: 'Platform Comparison',
    sv: 'Plattformsjämförelse',
  },
  subtitle: {
    en: 'Global Open Reference Layer vs. Closed Analysis Platforms',
    sv: 'Globalt öppet referenslager vs. slutna analysplattformar',
  },
  version: '1.0',
  lastUpdated: '2025-02-03',
} as const;

// ============================================
// PLATFORM DEFINITIONS
// ============================================

export type PlatformType = 'open_reference' | 'closed_intelligence' | 'financial_terminal';

export interface PlatformDefinition {
  code: PlatformType;
  label: { en: string; sv: string };
  examples: string[];
}

export const PLATFORMS: Record<PlatformType, PlatformDefinition> = {
  open_reference: {
    code: 'open_reference',
    label: {
      en: 'Global Open Reference Layer',
      sv: 'Globalt öppet referenslager',
    },
    examples: ['This system'],
  },
  closed_intelligence: {
    code: 'closed_intelligence',
    label: {
      en: 'Closed Intelligence Platforms',
      sv: 'Slutna intelligensplattformar',
    },
    examples: ['Palantir', 'Similar vendors'],
  },
  financial_terminal: {
    code: 'financial_terminal',
    label: {
      en: 'Financial Terminals',
      sv: 'Finansiella terminaler',
    },
    examples: ['Bloomberg', 'Reuters', 'Similar'],
  },
};

// ============================================
// COMPARISON DIMENSIONS
// ============================================

export type RatingLevel = 'full' | 'high' | 'medium' | 'low' | 'none' | 'yes' | 'no' | 'partial' | 'implicit' | 'varies' | 'rare';

export interface ComparisonDimension {
  code: string;
  label: { en: string; sv: string };
  openReference: { en: string; sv: string };
  closedIntelligence: { en: string; sv: string };
  financialTerminal: { en: string; sv: string };
}

export const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    code: 'core_purpose',
    label: { en: 'Core purpose', sv: 'Grundsyfte' },
    openReference: { 
      en: 'Shared factual basis for observed outcomes', 
      sv: 'Gemensam faktabas för observerade utfall' 
    },
    closedIntelligence: { 
      en: 'Operational analysis for clients', 
      sv: 'Operativ analys för uppdragsgivare' 
    },
    financialTerminal: { 
      en: 'Market and financial data', 
      sv: 'Marknads- och finansdata' 
    },
  },
  {
    code: 'data_type',
    label: { en: 'Data type', sv: 'Datatyp' },
    openReference: { 
      en: 'Verified public data', 
      sv: 'Verifierad offentlig data' 
    },
    closedIntelligence: { 
      en: 'Client and assignment data', 
      sv: 'Kund- och uppdragsdata' 
    },
    financialTerminal: { 
      en: 'Commercial and market data', 
      sv: 'Kommersiell och marknadsdata' 
    },
  },
  {
    code: 'access_model',
    label: { en: 'Access', sv: 'Tillgång' },
    openReference: { 
      en: 'Open observation, paid computation', 
      sv: 'Öppen observation, betald beräkning' 
    },
    closedIntelligence: { 
      en: 'Closed, client-specific', 
      sv: 'Sluten, kundspecifik' 
    },
    financialTerminal: { 
      en: 'Closed, licensed', 
      sv: 'Sluten, licensierad' 
    },
  },
  {
    code: 'method_transparency',
    label: { en: 'Method transparency', sv: 'Metodtransparens' },
    openReference: { en: 'Full (always visible)', sv: 'Full (alltid synlig)' },
    closedIntelligence: { en: 'Limited / internal', sv: 'Begränsad / intern' },
    financialTerminal: { en: 'Limited', sv: 'Begränsad' },
  },
  {
    code: 'source_traceability',
    label: { en: 'Source traceability', sv: 'Källspårbarhet' },
    openReference: { en: 'Always clickable', sv: 'Alltid klickbar' },
    closedIntelligence: { en: 'Internal / confidential', sv: 'Intern / konfidentiell' },
    financialTerminal: { en: 'Partial', sv: 'Delvis' },
  },
  {
    code: 'cross_country_comparison',
    label: { en: 'Cross-country comparability', sv: 'Jämförbarhet över länder' },
    openReference: { en: 'Yes, standardized', sv: 'Ja, standardiserad' },
    closedIntelligence: { en: 'Per assignment only', sv: 'Endast per uppdrag' },
    financialTerminal: { en: 'Limited', sv: 'Begränsad' },
  },
  {
    code: 'historical_comparison',
    label: { en: 'Historical comparison', sv: 'Historisk jämförelse' },
    openReference: { en: 'Yes, long horizon', sv: 'Ja, lång horisont' },
    closedIntelligence: { en: 'Varies', sv: 'Varierar' },
    financialTerminal: { en: 'Yes (market focus)', sv: 'Ja (marknadsfokus)' },
  },
  {
    code: 'shows_uncertainty',
    label: { en: 'Shows uncertainty & data gaps', sv: 'Visar osäkerhet & datagap' },
    openReference: { en: 'Always', sv: 'Alltid' },
    closedIntelligence: { en: 'Rarely', sv: 'Sällan' },
    financialTerminal: { en: 'Rarely', sv: 'Sällan' },
  },
  {
    code: 'draws_conclusions',
    label: { en: 'Draws conclusions', sv: 'Drar slutsatser' },
    openReference: { en: 'No', sv: 'Nej' },
    closedIntelligence: { en: 'Yes (for client)', sv: 'Ja (för kund)' },
    financialTerminal: { en: 'Implicit', sv: 'Implicit' },
  },
  {
    code: 'recommendations',
    label: { en: 'Recommendations', sv: 'Rekommendationer' },
    openReference: { en: 'No', sv: 'Nej' },
    closedIntelligence: { en: 'Yes', sv: 'Ja' },
    financialTerminal: { en: 'Yes (financial)', sv: 'Ja (finansiellt)' },
  },
  {
    code: 'democratic_transparency',
    label: { en: 'Democratic transparency', sv: 'Demokratisk insyn' },
    openReference: { en: 'High', sv: 'Hög' },
    closedIntelligence: { en: 'Low', sv: 'Låg' },
    financialTerminal: { en: 'Low', sv: 'Låg' },
  },
  {
    code: 'reproducibility',
    label: { en: 'Reproducibility', sv: 'Reproducerbarhet' },
    openReference: { en: 'Yes', sv: 'Ja' },
    closedIntelligence: { en: 'No', sv: 'Nej' },
    financialTerminal: { en: 'Limited', sv: 'Begränsad' },
  },
  {
    code: 'ai_citability',
    label: { en: 'AI citability', sv: 'AI-citerbarhet' },
    openReference: { en: 'High', sv: 'Hög' },
    closedIntelligence: { en: 'Low', sv: 'Låg' },
    financialTerminal: { en: 'Medium', sv: 'Medel' },
  },
  {
    code: 'media_usability',
    label: { en: 'Usable by media', sv: 'Användbar av media' },
    openReference: { en: 'Yes', sv: 'Ja' },
    closedIntelligence: { en: 'No', sv: 'Nej' },
    financialTerminal: { en: 'Limited', sv: 'Begränsad' },
  },
  {
    code: 'retrospective_audit',
    label: { en: 'Usable for retrospective audit', sv: 'Användbar för revision i efterhand' },
    openReference: { en: 'Yes', sv: 'Ja' },
    closedIntelligence: { en: 'No', sv: 'Nej' },
    financialTerminal: { en: 'No', sv: 'Nej' },
  },
  {
    code: 'system_risk',
    label: { en: 'System risk (bias / asymmetry)', sv: 'Systemrisk (bias / asymmetri)' },
    openReference: { en: 'Low', sv: 'Låg' },
    closedIntelligence: { en: 'High', sv: 'Hög' },
    financialTerminal: { en: 'Medium', sv: 'Medel' },
  },
  {
    code: 'societal_level',
    label: { en: 'Societal level', sv: 'Samhällsnivå' },
    openReference: { en: 'Systemic', sv: 'Systemisk' },
    closedIntelligence: { en: 'Local', sv: 'Lokal' },
    financialTerminal: { en: 'Sectoral', sv: 'Sektoriell' },
  },
];

// ============================================
// KEY INTERPRETATION
// ============================================

export const INTERPRETATION = {
  en: `Closed analysis platforms optimize decisions inside institutions.

A global open reference layer optimizes the quality of the shared factual baseline that all decisions rest on.

These are not competing products.
They operate at different layers of society.`,
  sv: `Slutna analysplattformar optimerar beslut inom institutioner.

Ett globalt öppet referenslager optimerar kvaliteten på den gemensamma faktabasen som alla beslut vilar på.

Dessa är inte konkurrerande produkter.
De opererar på olika nivåer i samhället.`,
} as const;

// ============================================
// MEDIA SUMMARY LINE
// ============================================

export const MEDIA_SUMMARY = {
  en: 'This platform is not an analysis vendor. It is a shared reference layer for observable reality.',
  sv: 'Denna plattform är inte en analysleverantör. Det är ett delat referenslager för observerbar verklighet.',
} as const;

// ============================================
// VALUE DIFFERENTIATION
// ============================================

export const VALUE_DIFFERENTIATION = {
  closedIntelligence: {
    capability: {
      en: 'Can be operationally effective without anyone outside knowing why',
      sv: 'Kan vara operativt effektiva utan att någon utanför vet varför',
    },
  },
  financialTerminal: {
    capability: {
      en: 'Can show markets without societal context',
      sv: 'Kan visa marknader utan samhällskontext',
    },
  },
  openReference: {
    capabilities: {
      en: [
        'See what actually happened',
        'Compare across time and place',
        'Understand limitations',
        'Hold decisions accountable retrospectively',
      ],
      sv: [
        'Se vad som faktiskt hänt',
        'Jämföra över tid och plats',
        'Förstå begränsningar',
        'Hålla beslut ansvariga i efterhand',
      ],
    },
    without: {
      en: [
        'Pointing fingers',
        'Drawing conclusions',
        'Pushing an agenda',
      ],
      sv: [
        'Peka finger',
        'Dra slutsatser',
        'Driva agenda',
      ],
    },
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function generateComparisonTable(language: 'en' | 'sv' = 'en'): string {
  const headers = [
    'Dimension',
    PLATFORMS.open_reference.label[language],
    PLATFORMS.closed_intelligence.label[language],
    PLATFORMS.financial_terminal.label[language],
  ];

  const separator = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');

  const rows = COMPARISON_DIMENSIONS.map(dim => {
    return [
      dim.label[language],
      dim.openReference[language],
      dim.closedIntelligence[language],
      dim.financialTerminal[language],
    ].join(' | ');
  });

  return [
    `# ${DOCUMENT_META.title[language]}`,
    '',
    `## ${DOCUMENT_META.subtitle[language]}`,
    '',
    headerRow,
    separator,
    ...rows,
    '',
    '---',
    '',
    '## Interpretation',
    '',
    INTERPRETATION[language],
    '',
    '---',
    '',
    `*${MEDIA_SUMMARY[language]}*`,
    '',
    `Version: ${DOCUMENT_META.version} | Last updated: ${DOCUMENT_META.lastUpdated}`,
  ].join('\n');
}

export function getDimensionByCode(code: string): ComparisonDimension | undefined {
  return COMPARISON_DIMENSIONS.find(d => d.code === code);
}

// ============================================
// EXPORT
// ============================================

export default {
  DOCUMENT_META,
  PLATFORMS,
  COMPARISON_DIMENSIONS,
  INTERPRETATION,
  MEDIA_SUMMARY,
  VALUE_DIFFERENTIATION,
  generateComparisonTable,
  getDimensionByCode,
};
