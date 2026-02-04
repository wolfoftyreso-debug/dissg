/**
 * ============================================================================
 * DISSG – DIAGNOSTIC INFORMATION SYSTEM FOR SOCIETAL GOVERNANCE
 * ============================================================================
 * 
 * Central system configuration defining terminology, hierarchy, and identity.
 * All naming and semantic structure originates from this file.
 * 
 * Core Principle: "Oscilloscope for Civilization"
 * - Clinical diagnostics without policy recommendations
 * - Makes reality measurable, comprehensible, independent of narrative
 * - Treats the world like a vehicle fleet, nations as vehicles, indicators as sensors
 */

// ============================================================================
// SYSTEM IDENTITY
// ============================================================================

export const SYSTEM = {
  name: 'DISSG',
  fullName: 'Diagnostic Information System for Societal Governance',
  version: '1.0.0',
  tagline: 'Oscilloscope for Civilization',
  description: 'Clinical diagnostics for societal governance without policy recommendations',
  
  // Epistemic statement
  purpose: 'This platform does not tell you what to think. It shows what can be observed.',
  
  // Legal classification
  classification: 'Observational decision-support infrastructure',
} as const;

// ============================================================================
// 7-LEVEL NAVIGATION HIERARCHY
// ============================================================================

export type HierarchyLevel = 
  | 'civilization'
  | 'continent'
  | 'nation'
  | 'region'
  | 'system'
  | 'indicator'
  | 'datapoint';

export interface HierarchyNode {
  level: HierarchyLevel;
  code: string;
  name: string;
  nameLocal?: string;
  parent?: string;
}

export const HIERARCHY_LEVELS: Record<HierarchyLevel, { 
  order: number;
  label: string;
  labelEn: string;
  description: string;
}> = {
  civilization: {
    order: 0,
    label: 'Civilisation',
    labelEn: 'Civilization',
    description: 'Global humanity aggregate',
  },
  continent: {
    order: 1,
    label: 'Världsdel',
    labelEn: 'Continent',
    description: 'Continental or major regional grouping',
  },
  nation: {
    order: 2,
    label: 'Nation',
    labelEn: 'Nation',
    description: 'Sovereign state or territory',
  },
  region: {
    order: 3,
    label: 'Region',
    labelEn: 'Region',
    description: 'Sub-national administrative region',
  },
  system: {
    order: 4,
    label: 'System',
    labelEn: 'System',
    description: 'Functional domain (health, economy, etc.)',
  },
  indicator: {
    order: 5,
    label: 'Indikator',
    labelEn: 'Indicator',
    description: 'Measurable metric within a system',
  },
  datapoint: {
    order: 6,
    label: 'Datapunkt',
    labelEn: 'Datapoint',
    description: 'Individual measurement or observation',
  },
};

// ============================================================================
// CONTINENTS / WORLD REGIONS
// ============================================================================

export const CONTINENTS = [
  { code: 'EUROPE', name: 'Europa', nameEn: 'Europe' },
  { code: 'ASIA', name: 'Asien', nameEn: 'Asia' },
  { code: 'AFRICA', name: 'Afrika', nameEn: 'Africa' },
  { code: 'NORTH_AMERICA', name: 'Nordamerika', nameEn: 'North America' },
  { code: 'SOUTH_AMERICA', name: 'Sydamerika', nameEn: 'South America' },
  { code: 'OCEANIA', name: 'Oceanien', nameEn: 'Oceania' },
  { code: 'ANTARCTICA', name: 'Antarktis', nameEn: 'Antarctica' },
] as const;

// ============================================================================
// DIAGNOSTIC DOMAINS (SYSTEMS)
// ============================================================================

export interface DiagnosticDomain {
  code: string;
  name: string;
  nameEn: string;
  weight: number;
  marker: string; // Text marker instead of icon
  description: string;
  descriptionEn: string;
}

export const DIAGNOSTIC_DOMAINS: DiagnosticDomain[] = [
  {
    code: 'vitality',
    name: 'Vitalitet',
    nameEn: 'Vitality',
    weight: 0.20,
    marker: '[VIT]',
    description: 'Livslängd, dödlighet, sjukdomsbörda, vårdtillgång',
    descriptionEn: 'Life expectancy, mortality, disease burden, healthcare access',
  },
  {
    code: 'livelihood',
    name: 'Försörjning',
    nameEn: 'Livelihood',
    weight: 0.20,
    marker: '[FÖR]',
    description: 'Sysselsättning, arbetskraft, inkomst, jobbens bärkraft',
    descriptionEn: 'Employment, labor force, income, job sustainability',
  },
  {
    code: 'capacity',
    name: 'Kapacitet',
    nameEn: 'Capacity',
    weight: 0.20,
    marker: '[KAP]',
    description: 'Läskunnighet, utbildningsmatch, kompetensutveckling',
    descriptionEn: 'Literacy, education match, skills development',
  },
  {
    code: 'stability',
    name: 'Stabilitet',
    nameEn: 'Stability',
    weight: 0.20,
    marker: '[STA]',
    description: 'Våld, institutionell kontinuitet, försörjningssäkerhet',
    descriptionEn: 'Violence, institutional continuity, supply security',
  },
  {
    code: 'sustainability',
    name: 'Hållbarhet',
    nameEn: 'Sustainability',
    weight: 0.20,
    marker: '[HÅL]',
    description: 'Energi, resurseffektivitet, miljöpåverkan, långsiktig bärkraft',
    descriptionEn: 'Energy, resource efficiency, environmental impact, long-term viability',
  },
];

// ============================================================================
// VIEW MODES
// ============================================================================

export const VIEW_MODES = {
  domains: { code: 'domains', label: 'Domäner', labelEn: 'Domains', marker: '[DOM]' },
  ranking: { code: 'ranking', label: 'Ranking', labelEn: 'Ranking', marker: '[RNK]' },
  timeline: { code: 'timeline', label: 'Tidslinje', labelEn: 'Timeline', marker: '[TID]' },
  distribution: { code: 'distribution', label: 'Fördelning', labelEn: 'Distribution', marker: '[FRD]' },
  comparison: { code: 'comparison', label: 'Jämförelse', labelEn: 'Comparison', marker: '[JMF]' },
} as const;

// ============================================================================
// DATA QUALITY GRADES
// ============================================================================

export const DATA_QUALITY = {
  A: { label: 'Hög kvalitet', labelEn: 'High quality', description: 'Complete, verified, recent' },
  B: { label: 'God kvalitet', labelEn: 'Good quality', description: 'Mostly complete, some gaps' },
  C: { label: 'Begränsad', labelEn: 'Limited', description: 'Significant gaps or uncertainty' },
  D: { label: 'Preliminär', labelEn: 'Preliminary', description: 'Estimates only, high uncertainty' },
} as const;

// ============================================================================
// EPISTEMIC CONSTRAINTS
// ============================================================================

export const EPISTEMIC_RULES = {
  // Things the system NEVER does
  never: [
    'Characterize jurisdictions as "successful" or "failing"',
    'Assign positive or negative valuation',
    'Recommend actions or policies',
    'Use causal language ("caused by", "led to")',
    'Make predictive claims without confidence intervals',
    'Hide methodology or data sources',
  ],
  
  // How the system frames outputs
  framingPattern: 'During this observation period, baseline conditions changed as follows.',
  
  // Required disclosures
  requiredDisclosures: [
    'Confidence interval',
    'Data coverage percentage',
    'Last update timestamp',
    'Methodology version',
  ],
} as const;

// ============================================================================
// BREADCRUMB BUILDER
// ============================================================================

export function buildBreadcrumb(nodes: HierarchyNode[]): string {
  return nodes
    .sort((a, b) => HIERARCHY_LEVELS[a.level].order - HIERARCHY_LEVELS[b.level].order)
    .map(n => n.name)
    .join(' → ');
}

export function getBreadcrumbPath(currentLevel: HierarchyLevel): HierarchyLevel[] {
  const order = HIERARCHY_LEVELS[currentLevel].order;
  return (Object.keys(HIERARCHY_LEVELS) as HierarchyLevel[])
    .filter(level => HIERARCHY_LEVELS[level].order <= order);
}
