/**
 * Guided Global Diagnostics (GGD) Types
 * 
 * "ODIS for civilization" - strict step-by-step diagnostic flow.
 */

import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

// =============================================================================
// CASE MANAGEMENT
// =============================================================================

export interface DiagnosticCase {
  caseId: string;
  createdAt: string;
  geoCode: string;
  geoName: string;
  geoLevel: 'global' | 'continent' | 'country' | 'region' | 'municipality';
  timeRangeStart: string;
  timeRangeEnd: string;
  activeGEDICode: string | null;
  lambdaDeviation: number;
  userRole: 'analyst' | 'journalist' | 'policymaker' | 'researcher' | 'citizen';
  dataModelVersion: string;
  status: 'in_progress' | 'completed' | 'archived';
  currentStep: DiagnosticStep;
  completedSteps: DiagnosticStep[];
}

export type DiagnosticStep = 
  | 'symptom_definition'
  | 'axis_selection'
  | 'measurement_blocks'
  | 'fault_codes'
  | 'probable_causes'
  | 'correlation_verification'
  | 'lambda_projection'
  | 'action_classes'
  | 'simulation'
  | 'report_generation';

export const DIAGNOSTIC_STEPS: DiagnosticStep[] = [
  'symptom_definition',
  'axis_selection',
  'measurement_blocks',
  'fault_codes',
  'probable_causes',
  'correlation_verification',
  'lambda_projection',
  'action_classes',
  'simulation',
  'report_generation',
];

export const STEP_LABELS: Record<DiagnosticStep, { sv: string; en: string }> = {
  symptom_definition: { sv: '1. Symptomdefinition', en: '1. Symptom Definition' },
  axis_selection: { sv: '2. Systemkomponenter', en: '2. System Components' },
  measurement_blocks: { sv: '3. Mätvärdesblock', en: '3. Measurement Blocks' },
  fault_codes: { sv: '4. Felkodslogik', en: '4. Fault Code Logic' },
  probable_causes: { sv: '5. Troliga orsaker', en: '5. Probable Causes' },
  correlation_verification: { sv: '6. Verifiering', en: '6. Verification' },
  lambda_projection: { sv: '7. Systemstatus', en: '7. System Status' },
  action_classes: { sv: '8. Åtgärdsklasser', en: '8. Action Classes' },
  simulation: { sv: '9. Simulering', en: '9. Simulation' },
  report_generation: { sv: 'Rapport', en: 'Report' },
};

// =============================================================================
// STEP 1: SYMPTOM DEFINITION
// =============================================================================

export interface SymptomData {
  currentLambda: number;
  targetLambda: number; // Always 1.0
  deviationPercent: number;
  deviationStart: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendVelocity: number; // Change per year
  confidence: number;
}

// =============================================================================
// STEP 2: AXIS SELECTION
// =============================================================================

export interface AxisStatus {
  axis: LambdaAxis;
  name: { sv: string; en: string };
  status: 'critical' | 'warning' | 'normal';
  deviation: number;
  contribution: number; // How much this axis contributes to overall deviation
}

export interface AxisSelectionData {
  axes: AxisStatus[];
  primaryAxis: LambdaAxis | null;
  secondaryAxes: LambdaAxis[];
}

// =============================================================================
// STEP 3: MEASUREMENT BLOCKS
// =============================================================================

export interface MeasurementBlock {
  id: string;
  code: string;
  name: { sv: string; en: string };
  category: string;
  currentValue: number;
  unit: string;
  targetValue: number;
  acceptableRange: [number, number];
  status: 'critical' | 'warning' | 'normal';
  deviation: number;
  historicalData: { year: number; value: number }[];
  confidence: number;
  source: string;
}

// =============================================================================
// STEP 4: FAULT CODES (GEDI)
// =============================================================================

export interface GEDIFaultCode {
  code: string;
  class: 'economic' | 'social' | 'systemic' | 'climate' | 'governance';
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  criticality: 'low' | 'medium' | 'high' | 'critical';
  duration: number; // months
  lambdaImpact: number;
  affectedAxes: LambdaAxis[];
  triggeredAt: string;
  indicators: string[];
}

// =============================================================================
// STEP 5: PROBABLE CAUSES
// =============================================================================

export interface ProbableCause {
  id: string;
  rank: number;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  probability: number;
  evidenceStrength: 'weak' | 'moderate' | 'strong';
  relatedIndicators: string[];
  mechanismChain: string[];
  userVerdict: 'supported' | 'rejected' | 'pending';
}

// =============================================================================
// STEP 6: CORRELATION VERIFICATION
// =============================================================================

export interface CorrelationData {
  causeId: string;
  causeName: string;
  correlations: {
    indicator: string;
    r2: number;
    lagMonths: number;
    direction: 'positive' | 'negative';
    significance: number;
    chartData: { x: number; y: number }[];
  }[];
  overallStrength: number;
}

// =============================================================================
// STEP 7: LAMBDA PROJECTION
// =============================================================================

export interface LambdaProjection {
  year: number;
  value: number;
  confidence: number;
  scenario: 'baseline' | 'optimistic' | 'pessimistic';
}

export interface ProjectionData {
  projections: LambdaProjection[];
  riskZones: { startYear: number; endYear: number; severity: string }[];
  stabilizingFactors: { factor: string; impact: number }[];
  keyAssumptions: string[];
}

// =============================================================================
// STEP 8: ACTION CLASSES
// =============================================================================

export interface ActionClass {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  category: string;
  historicalEffectiveness: number; // 0-100
  timeToEffect: number; // months
  complexity: 'low' | 'medium' | 'high';
  examples: { country: string; year: number; outcome: string }[];
  relevantAxes: LambdaAxis[];
}

// =============================================================================
// DIAGNOSTIC REPORT
// =============================================================================

export interface DiagnosticReport {
  caseId: string;
  generatedAt: string;
  version: string;
  checksum: string;
  
  // Summary
  geoCode: string;
  geoName: string;
  analysisTimeRange: string;
  lambdaDeviation: number;
  
  // Findings
  primaryAxis: LambdaAxis;
  secondaryAxes: LambdaAxis[];
  activeFaultCodes: string[];
  topCauses: { name: string; probability: number }[];
  
  // Projections
  baselineProjection: { year: number; lambda: number }[];
  
  // Action classes
  relevantActionClasses: string[];
  
  // Sources
  dataSources: string[];
  methodology: string;
  limitations: string[];
  
  // Verification
  qrCode: string;
  signatureHash: string;
}
