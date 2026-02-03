/**
 * GLOBAL SOCIETAL ECU
 * 
 * Safety-critical, sensor-driven, fail-silent decision infrastructure
 * 
 * This system behaves like an ECU.
 * It never guesses.
 * It never extrapolates beyond calibration.
 * It never acts when signals are invalid.
 * 
 * If signals are invalid → system goes fail-silent, not fail-active.
 * 
 * "This system observes global societal state
 * with the same discipline used in safety-critical automotive control units."
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const LEAD_ECU_ENGINEER_ROLE = {
  title: 'Lead Automotive Systems Engineer',
  
  experience: [
    'ECU architecture',
    'CAN-bus / LIN / FlexRay',
    'real-time operating systems',
    'safety-critical systems (ISO 26262 mindset)',
    'fault-tolerant sensor fusion',
    'calibration & mapping (no heuristics)',
  ],
  
  task: `Finalize and validate a system that functions as:
The control unit for global societal state observation
(not control, not actuation – observation & state derivation only)`,
};

// =============================================================================
// CORE PRINCIPLE (LOCKED, NON-NEGOTIABLE)
// =============================================================================

export const ECU_CORE_PRINCIPLE = {
  locked: true,
  version: '1.0.0',
  
  statement: `This system behaves like an ECU.
It never guesses.
It never extrapolates beyond calibration.
It never acts when signals are invalid.`,
  
  failure_mode: 'If signals are invalid → system goes fail-silent, not fail-active.',
};

// =============================================================================
// 1. SOCIETAL DATA = SENSORS (EXACTLY LIKE VEHICLES)
// =============================================================================

export const SENSOR_MAPPING = {
  vehicle_to_society: {
    lambda_probe: 'health outcomes',
    maf_map: 'economic flows',
    wheel_speed: 'labor market dynamics',
    temp_sensor: 'demographic stress',
    knock_sensor: 'instability / deviation',
    gps: 'geographic context',
    oil_pressure: 'fiscal pressure',
    fuel_level: 'resource reserves',
    throttle_position: 'policy intensity',
    rpm: 'activity rate',
  },
};

export interface ECUSensor {
  sensorId: string;
  sensorType: keyof typeof SENSOR_MAPPING.vehicle_to_society;
  societalEquivalent: string;
  
  // Required declarations
  samplingFrequency: {
    value: number;
    unit: 'per_second' | 'per_minute' | 'per_hour' | 'per_day' | 'per_month' | 'per_year';
  };
  
  latency: {
    typical_ms: number;
    maximum_ms: number;
    // For societal data, convert to days
    typical_days?: number;
    maximum_days?: number;
  };
  
  confidenceWindow: {
    min: number;
    max: number;
    unit: string;
  };
  
  failureBehavior: 'fail_silent' | 'last_known_value' | 'default_value' | 'signal_invalid';
  
  driftProfile: {
    expectedDriftRate: number;
    driftUnit: string;
    recalibrationInterval: string;
  };
  
  // If false, sensor is ignored
  declarationComplete: boolean;
}

export function validateSensorDeclaration(sensor: ECUSensor): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!sensor.samplingFrequency) issues.push('Missing sampling frequency');
  if (!sensor.latency) issues.push('Missing latency declaration');
  if (!sensor.confidenceWindow) issues.push('Missing confidence window');
  if (!sensor.failureBehavior) issues.push('Missing failure behavior');
  if (!sensor.driftProfile) issues.push('Missing drift profile');
  
  if (!sensor.declarationComplete) {
    issues.push('Declaration incomplete - sensor will be ignored');
  }
  
  return {
    valid: issues.length === 0 && sensor.declarationComplete,
    issues,
  };
}

// =============================================================================
// 2. BUS ARCHITECTURE (CAN-THINK)
// =============================================================================

export const BUS_ARCHITECTURE = {
  requirements: [
    'strict schemas',
    'versioning',
    'checksum / validation',
    'timestamp integrity',
  ],
  
  prohibitions: {
    no_component_may: [
      'mutate raw signals',
      'override upstream data',
      'inject inferred values',
    ],
  },
  
  derived_signal_rule: 'Derived signals must be tagged as derived, never masquerade as raw.',
};

export interface BusMessage {
  messageId: string;
  schemaVersion: string;
  checksum: string;
  timestamp: string;
  timestampIntegrity: 'verified' | 'unverified' | 'stale';
  
  signalType: 'raw' | 'derived';
  derivedFrom?: string[]; // Required if signalType === 'derived'
  
  payload: {
    sensorId: string;
    value: number | null;
    unit: string;
    confidence: number;
  };
  
  validationStatus: 'valid' | 'invalid' | 'degraded';
}

export function validateBusMessage(message: BusMessage): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!message.schemaVersion) issues.push('Missing schema version');
  if (!message.checksum) issues.push('Missing checksum');
  if (!message.timestamp) issues.push('Missing timestamp');
  
  if (message.signalType === 'derived' && (!message.derivedFrom || message.derivedFrom.length === 0)) {
    issues.push('Derived signal must declare source signals');
  }
  
  if (message.timestampIntegrity === 'stale') {
    issues.push('Stale timestamp - message may be outdated');
  }
  
  return {
    valid: issues.length === 0 && message.validationStatus === 'valid',
    issues,
  };
}

// =============================================================================
// 3. SENSOR FUSION = STATE ESTIMATION (NOT ACTION LOGIC)
// =============================================================================

export const STATE_ESTIMATION_RULES = {
  like_ecu: [
    'we estimate state, not intent',
    'we detect misfire, not blame',
    'we surface knock, not solutions',
  ],
  
  when_disagreement_exceeds_tolerance: 'State = Unknown',
  
  forbidden: [
    'smoothing for nice graphs',
    'averaging to keep things moving',
    'interpolation without disclosure',
  ],
};

export type SystemState = 
  | 'nominal'
  | 'degraded'
  | 'unknown'
  | 'fault_detected'
  | 'sensor_conflict'
  | 'out_of_range';

export interface StateEstimation {
  stateId: string;
  estimatedAt: string;
  
  inputSensors: {
    sensorId: string;
    value: number | null;
    confidence: number;
    status: 'valid' | 'invalid' | 'degraded';
  }[];
  
  fusion: {
    method: 'weighted_fusion' | 'consensus' | 'primary_with_backup';
    agreementLevel: number; // 0-1, where 1 = perfect agreement
    tolerance: number;
    withinTolerance: boolean;
  };
  
  estimatedState: SystemState;
  estimatedValue: number | null;
  
  // If state is unknown, value must be null
  outputSuppressed: boolean;
}

export function estimateState(params: {
  sensors: StateEstimation['inputSensors'];
  tolerance: number;
}): Pick<StateEstimation, 'fusion' | 'estimatedState' | 'estimatedValue' | 'outputSuppressed'> {
  const validSensors = params.sensors.filter(s => s.status === 'valid' && s.value !== null);
  
  // No valid sensors = unknown
  if (validSensors.length === 0) {
    return {
      fusion: {
        method: 'consensus',
        agreementLevel: 0,
        tolerance: params.tolerance,
        withinTolerance: false,
      },
      estimatedState: 'unknown',
      estimatedValue: null,
      outputSuppressed: true,
    };
  }
  
  // Calculate agreement
  const values = validSensors.map(s => s.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const range = max - min;
  const agreementLevel = mean !== 0 ? 1 - (range / Math.abs(mean)) : (range === 0 ? 1 : 0);
  
  const withinTolerance = range / (Math.abs(mean) || 1) <= params.tolerance;
  
  if (!withinTolerance) {
    return {
      fusion: {
        method: 'consensus',
        agreementLevel,
        tolerance: params.tolerance,
        withinTolerance: false,
      },
      estimatedState: 'sensor_conflict',
      estimatedValue: null,
      outputSuppressed: true,
    };
  }
  
  // Weighted average by confidence
  const totalWeight = validSensors.reduce((sum, s) => sum + s.confidence, 0);
  const weightedValue = validSensors.reduce((sum, s) => sum + (s.value as number) * s.confidence, 0) / totalWeight;
  
  return {
    fusion: {
      method: 'weighted_fusion',
      agreementLevel,
      tolerance: params.tolerance,
      withinTolerance: true,
    },
    estimatedState: 'nominal',
    estimatedValue: weightedValue,
    outputSuppressed: false,
  };
}

// =============================================================================
// 4. CALIBRATION & MAPPING (EXTREMELY IMPORTANT)
// =============================================================================

export const CALIBRATION_REQUIREMENTS = {
  all_indicators_must_have: [
    'defined operating range',
    'calibration dataset',
    'historical baseline',
    'invalid regions',
  ],
  
  when_input_leaves_calibrated_range: 'Output is clamped or suppressed',
  
  analogy: 'Exactly like engine maps.',
};

export interface CalibrationMap {
  indicatorCode: string;
  
  operatingRange: {
    min: number;
    max: number;
    unit: string;
  };
  
  calibrationDataset: {
    source: string;
    period: { start: string; end: string };
    sampleSize: number;
  };
  
  historicalBaseline: {
    value: number;
    period: string;
    confidence: number;
  };
  
  invalidRegions: {
    type: 'below_min' | 'above_max' | 'specific_range';
    min?: number;
    max?: number;
    reason: string;
  }[];
}

export function applyCalibration(params: {
  value: number;
  calibration: CalibrationMap;
}): { value: number | null; status: 'nominal' | 'clamped' | 'suppressed'; reason?: string } {
  const { value, calibration } = params;
  
  // Check invalid regions
  for (const region of calibration.invalidRegions) {
    if (region.type === 'below_min' && value < (region.min ?? calibration.operatingRange.min)) {
      return { value: null, status: 'suppressed', reason: region.reason };
    }
    if (region.type === 'above_max' && value > (region.max ?? calibration.operatingRange.max)) {
      return { value: null, status: 'suppressed', reason: region.reason };
    }
    if (region.type === 'specific_range' && region.min !== undefined && region.max !== undefined) {
      if (value >= region.min && value <= region.max) {
        return { value: null, status: 'suppressed', reason: region.reason };
      }
    }
  }
  
  // Check operating range
  if (value < calibration.operatingRange.min) {
    return { value: calibration.operatingRange.min, status: 'clamped', reason: 'Below operating range' };
  }
  if (value > calibration.operatingRange.max) {
    return { value: calibration.operatingRange.max, status: 'clamped', reason: 'Above operating range' };
  }
  
  return { value, status: 'nominal' };
}

// =============================================================================
// 5. FAIL-SILENT DESIGN (ABSOLUTE REQUIREMENT)
// =============================================================================

export const FAIL_SILENT_RULES = {
  system_rules: {
    no_signal: 'no output',
    partial_signal: 'degraded mode',
    conflicting_signal: 'neutral / blank',
  },
  
  under_no_circumstance_may_system: [
    'hallucinate',
    'fill gaps',
    'infer missing values',
    'guess',
    'extrapolate beyond calibration',
  ],
  
  non_negotiable: true,
};

export type FailureMode = 'fail_silent' | 'degraded' | 'last_known' | 'default';

export interface FailSilentOutput {
  requestedOutput: string;
  signalStatus: 'valid' | 'partial' | 'invalid' | 'conflict' | 'missing';
  
  failureMode: FailureMode;
  outputProvided: boolean;
  outputValue: number | null;
  
  reason: string;
  degradationLevel: number; // 0 = full output, 1 = no output
}

export function applyFailSilent(params: {
  signalStatus: FailSilentOutput['signalStatus'];
  rawValue: number | null;
  lastKnownValue?: number;
  defaultValue?: number;
}): FailSilentOutput {
  const { signalStatus, rawValue } = params;
  
  switch (signalStatus) {
    case 'valid':
      return {
        requestedOutput: 'value',
        signalStatus,
        failureMode: 'fail_silent',
        outputProvided: true,
        outputValue: rawValue,
        reason: 'Signal valid',
        degradationLevel: 0,
      };
      
    case 'partial':
      return {
        requestedOutput: 'value',
        signalStatus,
        failureMode: 'degraded',
        outputProvided: true,
        outputValue: rawValue,
        reason: 'Partial signal - output provided with reduced confidence',
        degradationLevel: 0.5,
      };
      
    case 'invalid':
    case 'conflict':
    case 'missing':
      return {
        requestedOutput: 'value',
        signalStatus,
        failureMode: 'fail_silent',
        outputProvided: false,
        outputValue: null,
        reason: `Signal ${signalStatus} - output suppressed`,
        degradationLevel: 1,
      };
  }
}

// =============================================================================
// 6. AI = DIAGNOSTIC INTERFACE (NOT CONTROL LOGIC)
// =============================================================================

export const AI_DIAGNOSTIC_ROLE = {
  treated_like: [
    'an OBD reader',
    'a diagnostic console',
    'a service manual',
  ],
  
  ai_may: [
    'explain what sensor failed',
    'explain what range is exceeded',
    'explain what state is observable',
  ],
  
  ai_may_not: [
    'recommend actions',
    'predict outcomes',
    'prioritize decisions',
    'suggest repairs',
    'infer causality',
  ],
  
  output_must_reference: [
    'signal IDs',
    'timestamps',
    'confidence bands',
  ],
};

export interface DiagnosticOutput {
  diagnosticId: string;
  generatedAt: string;
  
  referencedSignals: {
    signalId: string;
    timestamp: string;
    confidenceBand: { low: number; high: number };
  }[];
  
  explanation: string;
  
  // Must be false
  containsRecommendation: false;
  containsPrediction: false;
  containsPrioritization: false;
}

export function validateDiagnosticOutput(output: DiagnosticOutput): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!output.referencedSignals?.length) {
    issues.push('Diagnostic must reference specific signals');
  }
  
  for (const signal of output.referencedSignals) {
    if (!signal.signalId) issues.push('Missing signal ID');
    if (!signal.timestamp) issues.push('Missing timestamp');
    if (!signal.confidenceBand) issues.push('Missing confidence band');
  }
  
  // These must always be false
  if (output.containsRecommendation !== false) {
    issues.push('Diagnostic output must not contain recommendations');
  }
  if (output.containsPrediction !== false) {
    issues.push('Diagnostic output must not contain predictions');
  }
  if (output.containsPrioritization !== false) {
    issues.push('Diagnostic output must not contain prioritizations');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 7. VISUALIZATION = INSTRUMENT CLUSTER
// =============================================================================

export const INSTRUMENT_CLUSTER_RULES = {
  ui_principles: [
    'behaves like dashboard gauges',
    'shows limits clearly',
    'highlights red only on verified fault',
    'never dramatizes noise',
  ],
  
  animation_rules: {
    no_urgency_unless: [
      'threshold is exceeded',
      'sustained over time',
      'confirmed by multiple sensors',
    ],
  },
  
  gauge_requirements: {
    must_show: ['current value', 'operating range', 'threshold markers'],
    must_not: ['imply emotion', 'suggest action', 'dramatize'],
  },
};

export interface GaugeDisplay {
  indicatorCode: string;
  currentValue: number | null;
  
  operatingRange: { min: number; max: number };
  thresholdMarkers: { value: number; type: 'warning' | 'critical' }[];
  
  visualState: 'nominal' | 'warning' | 'critical' | 'unknown';
  
  // Animation triggers
  urgencyAnimation: boolean;
  urgencyJustification?: {
    thresholdExceeded: boolean;
    sustainedDuration: string;
    confirmedBySensors: string[];
  };
}

export function determineGaugeState(params: {
  value: number | null;
  thresholds: { warning: number; critical: number };
  sustained: boolean;
  confirmedBySensors: number;
}): Pick<GaugeDisplay, 'visualState' | 'urgencyAnimation'> {
  if (params.value === null) {
    return { visualState: 'unknown', urgencyAnimation: false };
  }
  
  const isCritical = params.value >= params.thresholds.critical;
  const isWarning = params.value >= params.thresholds.warning;
  
  // Urgency only if sustained AND confirmed by multiple sensors
  const urgencyAnimation = (isCritical || isWarning) && params.sustained && params.confirmedBySensors >= 2;
  
  if (isCritical) return { visualState: 'critical', urgencyAnimation };
  if (isWarning) return { visualState: 'warning', urgencyAnimation };
  return { visualState: 'nominal', urgencyAnimation: false };
}

// =============================================================================
// 8. FORMATIONS = DRIFT PATTERNS (NOT STRATEGY)
// =============================================================================

export const FORMATION_DIAGNOSTIC_RULES = {
  formations_are: [
    'diagnostic artifacts',
    'reproducible',
    'must show signal lineage',
  ],
  
  formations_represent: 'symptoms, not prescriptions',
  
  forbidden: [
    'strategy implications',
    'action suggestions',
    'outcome predictions',
  ],
};

export interface DiagnosticFormation {
  formationCode: string;
  formationName: string;
  
  signalLineage: {
    signalId: string;
    contribution: number;
    timestamp: string;
  }[];
  
  reproducibility: {
    canBeReproduced: boolean;
    reproducibilityScore: number; // 0-1
    testConditions: string;
  };
  
  classification: 'symptom';
  
  // Explicitly not included
  strategyImplication: null;
  actionSuggestion: null;
  outcomePrediction: null;
}

// =============================================================================
// 9. SYSTEM TEST (ECU LOGIC)
// =============================================================================

export const ECU_TEST_SUITE = {
  before_any_release: [
    'sensor_dropout_test',
    'conflicting_signal_test',
    'latency_spike_test',
    'historical_replay_test',
    'cold_start_test', // no prior state
    'corrupt_input_rejection_test',
  ],
  
  failure_rule: 'If any test fails → feature disabled.',
};

export type ECUTestType = typeof ECU_TEST_SUITE.before_any_release[number];

export interface ECUTestResult {
  testType: ECUTestType;
  executedAt: string;
  
  passed: boolean;
  failureReason?: string;
  
  metrics: {
    duration_ms: number;
    signalsProcessed: number;
    faultsInjected: number;
    faultsDetected: number;
    falsePositives: number;
    falseNegatives: number;
  };
}

export interface ECUTestSuiteResult {
  suiteExecutedAt: string;
  featureId: string;
  
  results: ECUTestResult[];
  
  allPassed: boolean;
  featureEnabled: boolean;
  
  blockers: string[];
}

export function runECUTestSuite(params: {
  featureId: string;
  results: ECUTestResult[];
}): ECUTestSuiteResult {
  const blockers: string[] = [];
  
  for (const result of params.results) {
    if (!result.passed) {
      blockers.push(`${result.testType}: ${result.failureReason}`);
    }
  }
  
  const allPassed = blockers.length === 0;
  
  return {
    suiteExecutedAt: new Date().toISOString(),
    featureId: params.featureId,
    results: params.results,
    allPassed,
    featureEnabled: allPassed,
    blockers,
  };
}

// =============================================================================
// 10. THIS SYSTEM IS NOT AN ACTUATOR
// =============================================================================

export const NOT_AN_ACTUATOR = {
  locked: true,
  
  statement: `The system does not actuate society.
Humans remain actuators.
This system only reports state.`,
  
  analogy: {
    ecu_reports: 'misfire',
    mechanic_decides: 'repair',
  },
  
  implications: [
    'System never suggests action',
    'System never prioritizes issues',
    'System never recommends policy',
    'System only surfaces observable state',
  ],
};

// =============================================================================
// 11. SYSTEM SELF-DEFINITION (FIXED TEXT)
// =============================================================================

export const ECU_SELF_DEFINITION = {
  locked: true,
  version: '1.0.0',
  
  statement: `This system observes global societal state
with the same discipline used in safety-critical automotive control units.`,
  
  short_form: 'Global Societal ECU: Observe, not actuate.',
};

// =============================================================================
// FINAL MANTRA
// =============================================================================

export const ECU_MANTRA = {
  principle: 'Observe. Report. Stop.',
  
  never: 'Infer. Suggest. Act.',
};

// =============================================================================
// COMPLETE ECU AUDIT
// =============================================================================

export interface ECUSystemAudit {
  timestamp: string;
  scope: string;
  
  sensorDeclarations: { valid: number; invalid: number; issues: string[] };
  busMessages: { valid: number; invalid: number; issues: string[] };
  stateEstimations: { nominal: number; unknown: number; suppressed: number };
  calibrations: { nominal: number; clamped: number; suppressed: number };
  failSilentEvents: number;
  diagnosticOutputs: { valid: number; invalid: number; issues: string[] };
  
  testSuiteResult: ECUTestSuiteResult | null;
  
  systemIntegrity: 'nominal' | 'degraded' | 'critical';
  allIssues: string[];
}

export function runECUSystemAudit(params: {
  scope: string;
  sensors: ECUSensor[];
  messages: BusMessage[];
  stateEstimations: StateEstimation[];
  calibrationResults: { status: 'nominal' | 'clamped' | 'suppressed' }[];
  failSilentEvents: number;
  diagnosticOutputs: DiagnosticOutput[];
  testSuiteResult?: ECUTestSuiteResult;
}): ECUSystemAudit {
  const allIssues: string[] = [];
  
  // Sensor validation
  const sensorIssues: string[] = [];
  let validSensors = 0;
  let invalidSensors = 0;
  for (const sensor of params.sensors) {
    const result = validateSensorDeclaration(sensor);
    if (result.valid) validSensors++;
    else {
      invalidSensors++;
      sensorIssues.push(...result.issues);
    }
  }
  allIssues.push(...sensorIssues);
  
  // Bus message validation
  const busIssues: string[] = [];
  let validMessages = 0;
  let invalidMessages = 0;
  for (const msg of params.messages) {
    const result = validateBusMessage(msg);
    if (result.valid) validMessages++;
    else {
      invalidMessages++;
      busIssues.push(...result.issues);
    }
  }
  allIssues.push(...busIssues);
  
  // State estimation counts
  const stateCount = {
    nominal: params.stateEstimations.filter(s => s.estimatedState === 'nominal').length,
    unknown: params.stateEstimations.filter(s => s.estimatedState === 'unknown').length,
    suppressed: params.stateEstimations.filter(s => s.outputSuppressed).length,
  };
  
  // Calibration counts
  const calibrationCount = {
    nominal: params.calibrationResults.filter(c => c.status === 'nominal').length,
    clamped: params.calibrationResults.filter(c => c.status === 'clamped').length,
    suppressed: params.calibrationResults.filter(c => c.status === 'suppressed').length,
  };
  
  // Diagnostic validation
  const diagIssues: string[] = [];
  let validDiag = 0;
  let invalidDiag = 0;
  for (const diag of params.diagnosticOutputs) {
    const result = validateDiagnosticOutput(diag);
    if (result.valid) validDiag++;
    else {
      invalidDiag++;
      diagIssues.push(...result.issues);
    }
  }
  allIssues.push(...diagIssues);
  
  // Test suite
  if (params.testSuiteResult && !params.testSuiteResult.allPassed) {
    allIssues.push(...params.testSuiteResult.blockers);
  }
  
  // Determine system integrity
  let systemIntegrity: ECUSystemAudit['systemIntegrity'] = 'nominal';
  if (allIssues.length > 0) systemIntegrity = 'degraded';
  if (invalidSensors > validSensors || invalidMessages > validMessages) systemIntegrity = 'critical';
  
  return {
    timestamp: new Date().toISOString(),
    scope: params.scope,
    sensorDeclarations: { valid: validSensors, invalid: invalidSensors, issues: sensorIssues },
    busMessages: { valid: validMessages, invalid: invalidMessages, issues: busIssues },
    stateEstimations: stateCount,
    calibrations: calibrationCount,
    failSilentEvents: params.failSilentEvents,
    diagnosticOutputs: { valid: validDiag, invalid: invalidDiag, issues: diagIssues },
    testSuiteResult: params.testSuiteResult || null,
    systemIntegrity,
    allIssues,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const ECU_VERSION = '1.0.0';

export const ECU_SUMMARY = {
  role: LEAD_ECU_ENGINEER_ROLE,
  corePrinciple: ECU_CORE_PRINCIPLE,
  sensorMapping: SENSOR_MAPPING,
  busArchitecture: BUS_ARCHITECTURE,
  stateEstimation: STATE_ESTIMATION_RULES,
  calibration: CALIBRATION_REQUIREMENTS,
  failSilent: FAIL_SILENT_RULES,
  aiDiagnostic: AI_DIAGNOSTIC_ROLE,
  instrumentCluster: INSTRUMENT_CLUSTER_RULES,
  formationDiagnostic: FORMATION_DIAGNOSTIC_RULES,
  testSuite: ECU_TEST_SUITE,
  notActuator: NOT_AN_ACTUATOR,
  selfDefinition: ECU_SELF_DEFINITION,
  mantra: ECU_MANTRA,
};
