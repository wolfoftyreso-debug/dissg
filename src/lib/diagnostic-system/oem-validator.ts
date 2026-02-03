/**
 * OEM-Class Validation Rules
 * 
 * Tvingar fram VIDA/ODIS-nivå på allt innehåll.
 * Ingen data visas utan att klara dessa krav.
 */

// =============================================================================
// VALIDATION LEVELS
// =============================================================================

export type ValidationLevel = 
  | 'oem_certified'    // Fullt certifierat - kan användas överallt
  | 'diagnostic_valid' // Giltigt för diagnos - kan trigga felkoder
  | 'display_only'     // Endast visning - ej i beräkningar
  | 'locked'           // Låst - kan inte visas i diagnosläge
  | 'rejected';        // Avvisad - ska tas bort

// =============================================================================
// VALIDATION REQUIREMENTS
// =============================================================================

export interface OEMRequirements {
  // Mandatory for any display
  hasSource: boolean;
  hasDefinition: boolean;
  hasUnit: boolean;
  
  // Mandatory for diagnostic use
  hasSetpoint: boolean;
  hasTolerance: boolean;
  hasHistorical: boolean;
  
  // Mandatory for Lambda calculation
  hasMethodology: boolean;
  hasUncertainty: boolean;
  hasPeerComparison: boolean;
  
  // UI requirements
  isClickableToSource: boolean;
  hasMethodLink: boolean;
  hasHistoryGraph: boolean;
  hasComparisonView: boolean;
  hasUncertaintyMarker: boolean;
  
  // Content quality
  noValueWords: boolean;
  noInterpretation: boolean;
  noIntentAssumption: boolean;
}

// =============================================================================
// PAGE VALIDATION
// =============================================================================

export interface PageValidationResult {
  pagePath: string;
  validationLevel: ValidationLevel;
  passedChecks: string[];
  failedChecks: string[];
  lockedInDiagnosticMode: boolean;
  lockReason: string | null;
  validatedAt: string;
}

export interface PageValidationRules {
  // All values must be clickable
  allValuesClickable: boolean;
  // Every value has method documentation
  allValuesHaveMethod: boolean;
  // Historical data available
  hasHistoricalView: boolean;
  // Comparison available
  hasComparisonView: boolean;
  // Uncertainty is marked
  uncertaintyIsMarked: boolean;
}

export function validatePage(
  pagePath: string,
  rules: PageValidationRules
): PageValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  if (rules.allValuesClickable) {
    passed.push('Alla värden är klickbara');
  } else {
    failed.push('Alla värden är INTE klickbara');
  }

  if (rules.allValuesHaveMethod) {
    passed.push('Alla värden har metod');
  } else {
    failed.push('Metod saknas för ett eller flera värden');
  }

  if (rules.hasHistoricalView) {
    passed.push('Historisk vy finns');
  } else {
    failed.push('Historisk vy saknas');
  }

  if (rules.hasComparisonView) {
    passed.push('Jämförelsevy finns');
  } else {
    failed.push('Jämförelsevy saknas');
  }

  if (rules.uncertaintyIsMarked) {
    passed.push('Osäkerhet är markerad');
  } else {
    failed.push('Osäkerhetsmarkering saknas');
  }

  let validationLevel: ValidationLevel;
  let lockedInDiagnosticMode = false;
  let lockReason: string | null = null;

  if (failed.length === 0) {
    validationLevel = 'oem_certified';
  } else if (failed.length <= 1) {
    validationLevel = 'diagnostic_valid';
  } else if (failed.length <= 3) {
    validationLevel = 'display_only';
    lockedInDiagnosticMode = true;
    lockReason = `Sidan låses i diagnosläge: ${failed.join(', ')}`;
  } else {
    validationLevel = 'locked';
    lockedInDiagnosticMode = true;
    lockReason = 'För många valideringsfel - sidan är låst';
  }

  return {
    pagePath,
    validationLevel,
    passedChecks: passed,
    failedChecks: failed,
    lockedInDiagnosticMode,
    lockReason,
    validatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// INDEX VALIDATION
// =============================================================================

export interface IndexValidationResult {
  indexCode: string;
  indexName: string;
  isTransparent: boolean;
  hasComponentBreakdown: boolean;
  hasExactWeighting: boolean;
  hasDataSources: boolean;
  hasTimeSensitivity: boolean;
  canDisableComponents: boolean;
  allowedInDiagnosticMode: boolean;
  validationErrors: string[];
  validatedAt: string;
}

export function validateIndex(
  indexCode: string,
  indexName: string,
  config: {
    hasComponentBreakdown: boolean;
    hasExactWeighting: boolean;
    hasDataSources: boolean;
    hasTimeSensitivity: boolean;
    canDisableComponents: boolean;
  }
): IndexValidationResult {
  const errors: string[] = [];

  if (!config.hasComponentBreakdown) {
    errors.push('Indexet saknar nedbrytning till underparametrar');
  }
  if (!config.hasExactWeighting) {
    errors.push('Exakt viktning visas inte');
  }
  if (!config.hasDataSources) {
    errors.push('Datakällor per komponent saknas');
  }
  if (!config.hasTimeSensitivity) {
    errors.push('Tidskänslighet visas inte');
  }
  if (!config.canDisableComponents) {
    errors.push('Komponenter kan inte deaktiveras individuellt');
  }

  const isTransparent = errors.length === 0;

  return {
    indexCode,
    indexName,
    isTransparent,
    hasComponentBreakdown: config.hasComponentBreakdown,
    hasExactWeighting: config.hasExactWeighting,
    hasDataSources: config.hasDataSources,
    hasTimeSensitivity: config.hasTimeSensitivity,
    canDisableComponents: config.canDisableComponents,
    allowedInDiagnosticMode: isTransparent,
    validationErrors: errors,
    validatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// DATA DISPLAY VALIDATION
// =============================================================================

export interface DataDisplayValidation {
  canDisplay: boolean;
  blockingReasons: string[];
  requiredBefore: string[];
}

export function validateDataDisplay(data: {
  hasSource: boolean;
  hasDefinition: boolean;
  hasScale: boolean;
  hasTimeAxis: boolean;
  graphHasZeroLine: boolean;
}): DataDisplayValidation {
  const blocking: string[] = [];
  const required: string[] = [];

  if (!data.hasSource) {
    blocking.push('Källa saknas');
    required.push('Lägg till verifierad källa');
  }
  if (!data.hasDefinition) {
    blocking.push('Definition saknas');
    required.push('Lägg till definition/metod');
  }
  if (!data.hasScale) {
    blocking.push('Skala saknas');
    required.push('Visa skala på graf');
  }
  if (!data.hasTimeAxis) {
    blocking.push('Tidsaxel saknas');
    required.push('Visa tidsaxel på trend');
  }

  return {
    canDisplay: blocking.length === 0,
    blockingReasons: blocking,
    requiredBefore: required,
  };
}

// =============================================================================
// DIAGNOSTIC FLOW GATE
// =============================================================================

export interface DiagnosticFlowGate {
  stepNumber: number;
  stepName: string;
  isUnlocked: boolean;
  unlockRequirements: string[];
  completedRequirements: string[];
  pendingRequirements: string[];
}

export function checkDiagnosticFlowGate(
  stepNumber: number,
  stepName: string,
  requirements: Array<{ name: string; completed: boolean }>
): DiagnosticFlowGate {
  const completed = requirements.filter(r => r.completed).map(r => r.name);
  const pending = requirements.filter(r => !r.completed).map(r => r.name);
  const isUnlocked = pending.length === 0;

  return {
    stepNumber,
    stepName,
    isUnlocked,
    unlockRequirements: requirements.map(r => r.name),
    completedRequirements: completed,
    pendingRequirements: pending,
  };
}

// =============================================================================
// SPECULATIVE CONTENT DETECTOR
// =============================================================================

const VALUE_WORDS = [
  'bra', 'dåligt', 'bäst', 'sämst', 'katastrof', 'fantastisk', 'utmärkt',
  'kris', 'framgång', 'misslyckande', 'succé', 'problem', 'lösning',
  'måste', 'bör', 'ska', 'borde',
];

const INTERPRETATION_PATTERNS = [
  /beror på/gi,
  /orsakas av/gi,
  /leder till/gi,
  /resulterar i/gi,
  /betyder att/gi,
  /visar att/gi,
  /bevisar att/gi,
];

const INTENT_PATTERNS = [
  /vill ha/gi,
  /försöker/gi,
  /planerar/gi,
  /avser/gi,
  /tänker/gi,
];

export interface SpeculativeContentCheck {
  isSpeculative: boolean;
  containsValueWords: boolean;
  valueWordsFound: string[];
  containsInterpretation: boolean;
  interpretationsFound: string[];
  containsIntentAssumption: boolean;
  intentAssumptionsFound: string[];
}

export function checkForSpeculativeContent(text: string): SpeculativeContentCheck {
  const lowerText = text.toLowerCase();
  
  const valueWordsFound = VALUE_WORDS.filter(word => lowerText.includes(word));
  
  const interpretationsFound: string[] = [];
  for (const pattern of INTERPRETATION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      interpretationsFound.push(...matches);
    }
  }
  
  const intentAssumptionsFound: string[] = [];
  for (const pattern of INTENT_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      intentAssumptionsFound.push(...matches);
    }
  }

  return {
    isSpeculative: valueWordsFound.length > 0 || interpretationsFound.length > 0 || intentAssumptionsFound.length > 0,
    containsValueWords: valueWordsFound.length > 0,
    valueWordsFound,
    containsInterpretation: interpretationsFound.length > 0,
    interpretationsFound,
    containsIntentAssumption: intentAssumptionsFound.length > 0,
    intentAssumptionsFound,
  };
}
