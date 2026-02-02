/**
 * WAVE 7 — RADICAL OPENNESS LAYER
 * 
 * Kärnprinciper:
 * - Öppenhet som default
 * - Ingen exklusiv sanning
 * - Reproducerbarhet över prestige
 */

export interface ReproducibilityRecord {
  id: string;
  entityType: 'insight' | 'learning' | 'effect' | 'observation' | 'chain';
  entityId: string;
  
  // What's needed to reproduce
  requiredDataSources: string[];
  requiredTimeRange: { start: string; end: string };
  requiredGeoScope: string[];
  
  // Method specification
  methodCode: string;
  methodVersion: string;
  methodParameters: Record<string, unknown>;
  
  // Status
  reproductionCount: number;
  lastReproducedAt?: string;
  lastReproductionMatched: boolean;
  deviationIfAny?: number;
  
  // Public access
  isPubliclyReproducible: boolean;
  reproductionEndpoint?: string;
  reproductionQuery?: Record<string, unknown>;
}

export interface PublicExperiment {
  id: string;
  experimentCode: string;
  title: string;
  hypothesis: string;
  
  // Full methodology
  methodology: string;
  dataSources: string[];
  analysisMethod: string;
  assumptions: string[];
  
  // Status
  status: 'proposed' | 'active' | 'completed' | 'failed' | 'withdrawn';
  startedAt?: string;
  completedAt?: string;
  
  // Results
  resultSummary?: string;
  resultData?: Record<string, unknown>;
  conclusion?: string;
  limitations?: string[];
  
  // Transparency
  allDataPublic: boolean;
  replicationInstructions?: string;
}

export interface MethodDefinition {
  code: string;
  version: string;
  name: string;
  description: string;
  mathematicalFormula?: string;
  pseudocode?: string;
  assumptions: string[];
  limitations: string[];
  applicableTo: string[];
  notApplicableTo: string[];
  academicReferences: string[];
}

/**
 * The 5 Core Principles - locked forever
 */
export const CORE_PRINCIPLES = {
  openness_default: {
    number: 1,
    title: 'Öppenhet som default',
    description: 'All rådata synlig, alla metoder dokumenterade, alla antaganden explicit visade',
    requirements: [
      'Varje datapunkt har synlig källa',
      'Varje beräkning har dokumenterad metod',
      'Varje antagande är explicit listat'
    ]
  },
  no_exclusive_truth: {
    number: 2,
    title: 'Ingen exklusiv sanning',
    description: 'Ingen hemlig modell, ingen dold viktning, ingen black box som kräver förtroende',
    requirements: [
      'Alla modeller är publikt beskrivna',
      'Alla viktningar är synliga och justerbara',
      'Inga proprietära algoritmer utan dokumentation'
    ]
  },
  orchestration_not_access: {
    number: 3,
    title: 'Skillnaden ligger i orkestrering, inte åtkomst',
    description: 'Alla kan se, alla kan använda, alla kan bygga. De som vill automatisera, skala, integrera → betalar',
    requirements: [
      'Grunddata är gratis och öppen',
      'API-åtkomst för automatisering är betald tjänst',
      'Ingen funktionalitet kräver hemlig data'
    ]
  },
  reproducibility_over_prestige: {
    number: 4,
    title: 'Reproducerbarhet över prestige',
    description: 'Varje siffra ska gå att återskapa, varje insikt ska gå att ifrågasätta, varje slutsats ska kunna falsifieras',
    requirements: [
      'Varje insikt har en "reproducera"-funktion',
      'Alla steg i analysen är spårbara',
      'Falsifiering är välkommet och dokumenterat'
    ]
  },
  system_speaks: {
    number: 5,
    title: 'Systemet talar – inte vi',
    description: 'Inga åsikter, inga narrativ, endast observerade mönster, effekter, osäkerheter',
    requirements: [
      'Alla texter genereras från datamallar',
      'Inget värderande språk används',
      'Osäkerhet visas alltid'
    ]
  }
} as const;

/**
 * Standard transparency disclaimer for all outputs
 */
export const TRANSPARENCY_STATEMENT = 
  "Baserat på tillgänglig offentlig data observeras följande mönster, " +
  "under dessa antaganden, med denna osäkerhet.";

/**
 * Forbidden phrases - never use these
 */
export const FORBIDDEN_PHRASES = [
  'vår modell säger',
  'systemet rekommenderar',
  'detta är sanningen',
  'det bästa alternativet',
  'experterna menar',
  'det är uppenbart att',
  'alla vet att',
  'utan tvekan'
] as const;

/**
 * Required disclosure elements for any insight
 */
export const REQUIRED_DISCLOSURES = [
  'source',      // Var kommer datan ifrån
  'method',      // Hur analyserades den
  'confidence',  // Hur säkra är vi
  'coverage',    // Hur komplett är datan
  'alternatives' // Finns alternativa tolkningar
] as const;

/**
 * Generate reproduction URL for an insight
 */
export function generateReproductionUrl(
  entityType: string,
  entityId: string,
  methodCode: string
): string {
  return `/api/reproduce?entity=${entityType}&id=${entityId}&method=${methodCode}`;
}

/**
 * Check if content contains forbidden phrases
 */
export function containsForbiddenPhrase(text: string): { found: boolean; phrases: string[] } {
  const lowercaseText = text.toLowerCase();
  const found = FORBIDDEN_PHRASES.filter(phrase => lowercaseText.includes(phrase));
  return { found: found.length > 0, phrases: found };
}

/**
 * Validate that all required disclosures are present
 */
export function validateDisclosures(
  disclosures: Record<string, unknown>
): { valid: boolean; missing: string[] } {
  const missing = REQUIRED_DISCLOSURES.filter(key => !disclosures[key]);
  return { valid: missing.length === 0, missing };
}
