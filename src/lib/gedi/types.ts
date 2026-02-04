/**
 * GEDI - Global Equivalent Diagnostic Interface
 * 
 * Regulatory-level diagnostic codes for societal systems.
 * Equivalent to EOBD/OBD-II for vehicles.
 */

// =============================================================================
// GEDI CODE STATUS
// =============================================================================

export type GEDIStatus = 'PASS' | 'FAIL' | 'PENDING' | 'INSUFFICIENT_DATA';

export interface GEDIStatusResult {
  status: GEDIStatus;
  code: string | null;
  triggeredAt: string | null;
  dataQuality: number; // 0-100
  confidence: number; // 0-100
  requiresAction: boolean;
}

// =============================================================================
// GEDI CODE DEFINITION
// =============================================================================

export interface GEDICodeDefinition {
  code: string;
  category: GEDICategory;
  title: { sv: string; en: string };
  description: { sv: string; en: string };
  triggerCondition: string;
  toleranceDefinition: string;
  internationalBasis: string; // UN, WHO, IPCC, etc.
  requiredDataCoverage: number; // 0-100
  affectedSystems: string[];
  guidedAnalysisSteps: GuidedStep[];
}

export type GEDICategory = 
  | 'PERFORMANCE'
  | 'SUSTAINABILITY'
  | 'EQUALITY'
  | 'HEALTH'
  | 'CLIMATE'
  | 'DEMOCRACY'
  | 'INTEGRITY';

export interface GuidedStep {
  order: number;
  title: { sv: string; en: string };
  instruction: { sv: string; en: string };
  requiredIndicators: string[];
  expectedDuration: string;
  isComplete: boolean;
}

// =============================================================================
// PROBABLE CAUSES
// =============================================================================

export interface ProbableCause {
  rank: number;
  causeId: string;
  title: { sv: string; en: string };
  probability: number; // 0-100
  correlationStrength: number; // 0-1
  historicalPrecedent: boolean;
  affectedIndicators: string[];
  suggestedExamination: string[];
}

// =============================================================================
// GEDI ASSESSMENT
// =============================================================================

export interface GEDIAssessment {
  assessmentId: string;
  timestamp: string;
  geoScope: string;
  period: { start: string; end: string };
  overallStatus: GEDIStatus;
  codeResults: GEDICodeResult[];
  dataQualityScore: number;
  certificationHash: string | null;
}

export interface GEDICodeResult {
  code: string;
  status: GEDIStatus;
  currentValue: number | null;
  toleranceRange: { min: number; max: number } | null;
  deviation: number | null;
  deviationDirection: 'above' | 'below' | 'within' | null;
  probableCauses: ProbableCause[];
  guidedAnalysisComplete: boolean;
  lastAssessed: string;
}
