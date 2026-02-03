/**
 * OEM-Class Content Classification System
 * 
 * Klassificerar allt innehåll enligt 6-nivå systemet.
 * Ingen datapunkt får sakna klass.
 */

// =============================================================================
// CLASSIFICATION LEVELS (LOCKED)
// =============================================================================

export type ContentClassification = 
  | 'diagnostic_ready'      // 1. Diagnostiskt färdig - kan användas i felkodssystem
  | 'diagnostic_incomplete' // 2. Diagnostiskt ofullständig - saknar något krav
  | 'informational'         // 3. Informationsmässig - läsning, ej diagnos
  | 'speculative'           // 4. Spekulativ - ej tillåten i diagnosläge
  | 'calibrating'           // 5. Under kalibrering - arbete pågår
  | 'deprecated';           // 6. Ska bort - markerad för radering

export interface ClassificationCriteria {
  hasVerifiedSource: boolean;
  hasSetpoint: boolean;
  hasTolerance: boolean;
  hasHistoricalData: boolean;
  hasMethodology: boolean;
  hasUncertaintyMargin: boolean;
  hasPeerComparison: boolean;
  isClickableToSource: boolean;
  containsValueWords: boolean;      // "bra", "dåligt", etc.
  containsInterpretation: boolean;  // Drar slutsatser utan data
  containsIntentAssumption: boolean; // Tolkar intentioner
}

export interface ClassifiedContent {
  id: string;
  path: string;
  type: 'datapoint' | 'page' | 'graph' | 'index' | 'text' | 'parameter';
  name: string;
  classification: ContentClassification;
  criteria: ClassificationCriteria;
  missingRequirements: string[];
  diagnosticPlacement?: DiagnosticPlacement;
  classifiedAt: string;
  classifiedBy: 'system' | 'manual';
  lockReason?: string;
}

// =============================================================================
// DIAGNOSTIC PLACEMENT
// =============================================================================

export interface DiagnosticPlacement {
  system: string;       // Globalt, Land, Region
  subsystem: string;    // Ekonomi, Hälsa, Energi
  measureBlock: string; // Mortalitet, Pris, etc.
  parameter: string;    // Specifik mätpunkt
  fullPath: string;     // System → Subsystem → Mätblock → Parameter
}

// =============================================================================
// CLASSIFICATION ENGINE
// =============================================================================

export function classifyContent(
  content: Omit<ClassifiedContent, 'classification' | 'missingRequirements' | 'classifiedAt' | 'classifiedBy'>
): ClassifiedContent {
  const criteria = content.criteria;
  const missing: string[] = [];

  // Check for speculative content (immediate disqualification)
  if (criteria.containsValueWords || criteria.containsInterpretation || criteria.containsIntentAssumption) {
    if (criteria.containsValueWords) missing.push('Innehåller värdeord');
    if (criteria.containsInterpretation) missing.push('Drar slutsats utan data');
    if (criteria.containsIntentAssumption) missing.push('Tolkar intentioner');
    
    return {
      ...content,
      classification: 'speculative',
      missingRequirements: missing,
      classifiedAt: new Date().toISOString(),
      classifiedBy: 'system',
      lockReason: 'Diagnostiskt ogiltigt – informationsläge',
    };
  }

  // Check diagnostic readiness requirements
  const diagnosticRequirements: Array<[keyof ClassificationCriteria, string]> = [
    ['hasVerifiedSource', 'Verifierad källa saknas'],
    ['hasSetpoint', 'Börvärde saknas'],
    ['hasTolerance', 'Toleransintervall saknas'],
    ['hasHistoricalData', 'Historisk data saknas'],
    ['hasMethodology', 'Metod/definition saknas'],
    ['hasUncertaintyMargin', 'Osäkerhetsmarginal saknas'],
    ['isClickableToSource', 'Ej klickbar till källa'],
  ];

  for (const [key, message] of diagnosticRequirements) {
    if (!criteria[key]) {
      missing.push(message);
    }
  }

  // Determine classification based on missing requirements
  let classification: ContentClassification;
  let lockReason: string | undefined;

  if (missing.length === 0) {
    classification = 'diagnostic_ready';
  } else if (missing.length <= 2) {
    classification = 'diagnostic_incomplete';
    lockReason = `Saknar: ${missing.join(', ')}`;
  } else if (missing.length <= 4) {
    classification = 'calibrating';
    lockReason = 'Under kalibrering – för många saknade krav';
  } else {
    classification = 'informational';
    lockReason = 'Kan endast användas som läsning – ej diagnos';
  }

  return {
    ...content,
    classification,
    missingRequirements: missing,
    classifiedAt: new Date().toISOString(),
    classifiedBy: 'system',
    lockReason,
  };
}

// =============================================================================
// CLASSIFICATION VALIDATORS
// =============================================================================

export function canUseInDiagnosis(content: ClassifiedContent): boolean {
  return content.classification === 'diagnostic_ready';
}

export function canUseInLambda(content: ClassifiedContent): boolean {
  return content.classification === 'diagnostic_ready' 
    && content.criteria.hasSetpoint 
    && content.criteria.hasTolerance
    && content.criteria.hasVerifiedSource
    && content.criteria.hasHistoricalData;
}

export function canTriggerFaultCode(content: ClassifiedContent): boolean {
  return canUseInDiagnosis(content) && content.diagnosticPlacement !== undefined;
}

export function getClassificationColor(classification: ContentClassification): string {
  switch (classification) {
    case 'diagnostic_ready': return 'hsl(var(--success))';
    case 'diagnostic_incomplete': return 'hsl(var(--warning))';
    case 'informational': return 'hsl(var(--muted-foreground))';
    case 'speculative': return 'hsl(var(--destructive))';
    case 'calibrating': return 'hsl(var(--accent))';
    case 'deprecated': return 'hsl(var(--muted))';
  }
}

export function getClassificationLabel(classification: ContentClassification): string {
  switch (classification) {
    case 'diagnostic_ready': return 'DIAGNOSTISKT FÄRDIG';
    case 'diagnostic_incomplete': return 'OFULLSTÄNDIG';
    case 'informational': return 'INFORMATION';
    case 'speculative': return 'SPEKULATIV';
    case 'calibrating': return 'UNDER KALIBRERING';
    case 'deprecated': return 'SKA BORT';
  }
}

// =============================================================================
// BATCH CLASSIFICATION
// =============================================================================

export interface ClassificationReport {
  totalItems: number;
  byClassification: Record<ContentClassification, number>;
  diagnosticReadyPercent: number;
  commonMissingRequirements: Array<{ requirement: string; count: number }>;
  speculativeItems: ClassifiedContent[];
  lambdaEligible: ClassifiedContent[];
  generatedAt: string;
}

export function generateClassificationReport(items: ClassifiedContent[]): ClassificationReport {
  const byClassification: Record<ContentClassification, number> = {
    diagnostic_ready: 0,
    diagnostic_incomplete: 0,
    informational: 0,
    speculative: 0,
    calibrating: 0,
    deprecated: 0,
  };

  const missingCounts: Record<string, number> = {};

  for (const item of items) {
    byClassification[item.classification]++;
    
    for (const req of item.missingRequirements) {
      missingCounts[req] = (missingCounts[req] || 0) + 1;
    }
  }

  const commonMissing = Object.entries(missingCounts)
    .map(([requirement, count]) => ({ requirement, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalItems: items.length,
    byClassification,
    diagnosticReadyPercent: items.length > 0 
      ? (byClassification.diagnostic_ready / items.length) * 100 
      : 0,
    commonMissingRequirements: commonMissing,
    speculativeItems: items.filter(i => i.classification === 'speculative'),
    lambdaEligible: items.filter(canUseInLambda),
    generatedAt: new Date().toISOString(),
  };
}
