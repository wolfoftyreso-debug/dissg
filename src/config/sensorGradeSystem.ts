/**
 * SENSOR-GRADE SOCIETAL MEASUREMENT SYSTEM
 * 
 * "If it cannot be measured within tolerance, it is not shown."
 * 
 * The system does not "understand society".
 * It measures observable signals of societal motion with declared tolerance.
 * 
 * No measurement → no output.
 * No tolerance → no confidence.
 * No confidence → no display.
 * 
 * Mantra: "Measure. Show. Stop."
 */

// =============================================================================
// ROLE DEFINITION
// =============================================================================

export const CHIEF_MEASUREMENT_ENGINEER_ROLE = {
  title: 'Chief Measurement Engineer, Systems Architect & UX Disciplinarian',
  
  experience: [
    'sensor-driven sports analytics (golf simulators, motion capture)',
    'multi-sensor fusion systems',
    'statistical tolerance engineering',
    'decision-support without advice',
    'safety-critical software (aviation / medical / finance)',
  ],
  
  task: 'Extend the system so it behaves like a professional-grade measurement instrument, not a narrative engine.',
};

// =============================================================================
// CORE PRINCIPLE (LOCKED)
// =============================================================================

export const CORE_PRINCIPLE = {
  statement: `The system does not "understand society".
It measures observable signals of societal motion with declared tolerance.`,
  
  logic_chain: [
    'No measurement → no output',
    'No tolerance → no confidence',
    'No confidence → no display',
  ],
  
  locked: true,
  version: '1.0.0',
};

// =============================================================================
// 1. SENSOR MODEL FOR SOCIETAL DATA
// =============================================================================

export type SensorGrade = 'primary' | 'secondary' | 'low_resolution' | 'derived' | 'downgraded';

export interface VirtualSensor {
  id: string;
  name: string;
  sourceType: string;
  grade: SensorGrade;
  
  // Required declarations
  resolution: {
    temporal: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    spatial: 'point' | 'municipality' | 'region' | 'country' | 'global';
    precision: number; // e.g., 0.01 = 1%
  };
  
  latency: {
    typical_days: number;
    maximum_days: number;
  };
  
  noiseProfile: {
    type: 'white' | 'systematic' | 'seasonal' | 'unknown';
    magnitude: number;
  };
  
  historicalStability: {
    yearsOfConsistentMethodology: number;
    majorRevisions: number;
    lastMethodologyChange: string | null;
  };
  
  knownFailureModes: string[];
  
  // If any declaration is unknown, sensor is downgraded
  declarationsComplete: boolean;
}

export const SENSOR_TYPE_MAPPING = {
  statistics_authority: { defaultGrade: 'primary' as SensorGrade },
  register_data: { defaultGrade: 'secondary' as SensorGrade },
  survey_data: { defaultGrade: 'low_resolution' as SensorGrade },
  model_output: { defaultGrade: 'derived' as SensorGrade, note: 'Never primary' },
  unofficial_source: { defaultGrade: 'downgraded' as SensorGrade },
};

export function evaluateSensorGrade(sensor: VirtualSensor): SensorGrade {
  // If declarations incomplete → downgrade
  if (!sensor.declarationsComplete) {
    return 'downgraded';
  }
  
  // If noise unknown → downgrade
  if (sensor.noiseProfile.type === 'unknown') {
    return 'downgraded';
  }
  
  // If no failure modes declared → suspicious, downgrade
  if (sensor.knownFailureModes.length === 0) {
    return 'downgraded';
  }
  
  return sensor.grade;
}

// =============================================================================
// 2. SENSOR FUSION (LIKE GOLF)
// =============================================================================

export const SENSOR_FUSION_RULES = {
  principle: 'radar + camera + accelerometer = ball trajectory',
  
  system_must: [
    'fuse multiple independent sources',
    'show divergence explicitly',
    'never average away disagreement',
  ],
  
  when_sensors_disagree: {
    beyond_tolerance: 'Output = Invalid / Unstable',
    not: 'best guess',
  },
};

export interface FusedMeasurement {
  indicatorCode: string;
  sensors: {
    sensorId: string;
    value: number;
    confidence: number;
  }[];
  
  fusion: {
    method: 'weighted_average' | 'consensus' | 'primary_with_validation';
    result: number | null;
    divergence: number; // 0 = perfect agreement, 1 = complete disagreement
    withinTolerance: boolean;
  };
  
  output: {
    value: number | null;
    status: 'valid' | 'unstable' | 'invalid';
    showBlank: boolean;
  };
}

export function fuseSensors(sensors: FusedMeasurement['sensors'], tolerance: number): FusedMeasurement['fusion'] {
  if (sensors.length === 0) {
    return {
      method: 'consensus',
      result: null,
      divergence: 1,
      withinTolerance: false,
    };
  }
  
  if (sensors.length === 1) {
    return {
      method: 'primary_with_validation',
      result: sensors[0].value,
      divergence: 0,
      withinTolerance: true,
    };
  }
  
  // Calculate divergence
  const values = sensors.map(s => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const divergence = mean !== 0 ? range / Math.abs(mean) : (range === 0 ? 0 : 1);
  
  const withinTolerance = divergence <= tolerance;
  
  // If divergence too high, no fusion
  if (!withinTolerance) {
    return {
      method: 'consensus',
      result: null,
      divergence,
      withinTolerance: false,
    };
  }
  
  // Weighted average by confidence
  const totalWeight = sensors.reduce((sum, s) => sum + s.confidence, 0);
  const weightedSum = sensors.reduce((sum, s) => sum + s.value * s.confidence, 0);
  
  return {
    method: 'weighted_average',
    result: totalWeight > 0 ? weightedSum / totalWeight : null,
    divergence,
    withinTolerance,
  };
}

// =============================================================================
// 3. TOLERANCE & BLANK MODE (MANDATORY)
// =============================================================================

export const TOLERANCE_GATES = {
  below_threshold: {
    display: '—',
    meaning: 'Data does not meet measurement standard',
  },
  
  borderline: {
    display: 'value with low confidence badge',
    meaning: 'Data meets minimum but has elevated uncertainty',
  },
  
  above_threshold: {
    display: 'normal',
    meaning: 'Data meets measurement standard',
  },
};

export const BLANK_IS_FIRST_CLASS = {
  statement: 'Blank is a first-class result, not an error.',
  
  applies_to: [
    'indicators',
    'comparisons',
    'trends',
    'formations',
    'AI summaries',
  ],
};

export type ToleranceStatus = 'below' | 'borderline' | 'above';

export function evaluateTolerance(params: {
  measuredValue: number | null;
  confidence: number;
  thresholds: { minimum: number; borderline: number };
}): ToleranceStatus {
  if (params.measuredValue === null) return 'below';
  if (params.confidence < params.thresholds.minimum) return 'below';
  if (params.confidence < params.thresholds.borderline) return 'borderline';
  return 'above';
}

// =============================================================================
// 4. FORMATION LOGIC (GOLF-STYLE FEEDBACK)
// =============================================================================

export const FORMATION_BEHAVIOR = {
  like: 'swing analysis',
  
  must_be: [
    'descriptive',
    'repeatable',
    'historically grounded',
  ],
  
  must_show: [
    'input signals',
    'alignment strength',
    'duration',
    'historical occurrence',
    'breakdown examples',
  ],
  
  may_not: [
    'imply outcome',
    'imply correction',
    'imply optimization',
  ],
};

export interface FormationOutput {
  formationCode: string;
  formationName: string;
  
  inputSignals: {
    indicatorCode: string;
    value: number;
    weight: number;
  }[];
  
  alignmentStrength: number; // 0-1
  duration: {
    start: string;
    end: string;
    months: number;
  };
  
  historicalOccurrence: {
    timesSeen: number;
    contexts: string[];
  };
  
  breakdownExamples: {
    date: string;
    description: string;
    whatBroke: string;
  }[];
  
  // Explicitly forbidden outputs
  impliesOutcome: false;
  impliesCorrection: false;
  impliesOptimization: false;
}

export function validateFormationOutput(formation: FormationOutput): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!formation.inputSignals?.length) {
    issues.push('Formation must show input signals');
  }
  
  if (formation.alignmentStrength === undefined) {
    issues.push('Formation must show alignment strength');
  }
  
  if (!formation.duration) {
    issues.push('Formation must show duration');
  }
  
  if (!formation.historicalOccurrence) {
    issues.push('Formation must show historical occurrence');
  }
  
  if (!formation.breakdownExamples?.length) {
    issues.push('Formation must show breakdown examples');
  }
  
  // These must always be false
  if (formation.impliesOutcome !== false) {
    issues.push('Formation must not imply outcome');
  }
  if (formation.impliesCorrection !== false) {
    issues.push('Formation must not imply correction');
  }
  if (formation.impliesOptimization !== false) {
    issues.push('Formation must not imply optimization');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 5. "SYSTEM NEVER TELLS WHAT TO DO" - CRITICAL CORRECTION
// =============================================================================

export const CONFIGURATION_FEEDBACK_PRINCIPLE = {
  warning: '⚠️ CRITICAL LOCK',
  
  statement: 'The system may NEVER say what needs to be done.',
  
  instead: 'System shows configuration feedback. Users infer adjustments externally.',
  
  golf_analogy: {
    simulator_shows: ['club path', 'face angle', 'spin'],
    golfer_decides: 'what to change',
  },
  
  system_must: [
    'surface misalignment',
    'surface instability',
    'surface noise',
  ],
  
  system_never: [
    'suggest action',
    'suggest policy',
    'suggest solution',
    'suggest priority',
    'suggest correction',
  ],
};

export const FORBIDDEN_ACTION_PHRASES = [
  'should',
  'must',
  'needs to',
  'requires',
  'would benefit from',
  'consider',
  'recommend',
  'suggest',
  'it is advisable',
  'action required',
  'priority',
  'urgent',
  'critical to address',
  'solution',
  'fix',
  'improve',
  'optimize',
] as const;

export function containsForbiddenActionPhrase(text: string): { clean: boolean; found: string[] } {
  const found: string[] = [];
  const lower = text.toLowerCase();
  
  for (const phrase of FORBIDDEN_ACTION_PHRASES) {
    if (lower.includes(phrase)) {
      found.push(phrase);
    }
  }
  
  return {
    clean: found.length === 0,
    found,
  };
}

// =============================================================================
// 6. AI LAYER (STRICT MODE)
// =============================================================================

export const AI_STRICT_MODE = {
  definition: 'AI is treated as a summarization and orientation instrument.',
  
  ai_may: [
    'restate measured signals',
    'explain what is being measured',
    'explain why output is blank',
    'explain uncertainty',
  ],
  
  ai_may_not: [
    'infer intent',
    'infer causality',
    'infer responsibility',
    'infer optimality',
  ],
  
  mandatory_prefix: 'Based on the measured signals shown here…',
  
  forbidden_inferences: [
    'this suggests',
    'this indicates that',
    'this means',
    'the cause is',
    'the reason is',
    'this is because',
    'therefore',
    'as a result',
    'consequently',
    'it follows that',
    'we can conclude',
  ],
};

export function validateAIOutput(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const lower = text.toLowerCase();
  
  // Check for mandatory prefix
  if (!lower.startsWith('based on the measured signals')) {
    issues.push('AI text must start with "Based on the measured signals shown here…"');
  }
  
  // Check for forbidden inferences
  for (const phrase of AI_STRICT_MODE.forbidden_inferences) {
    if (lower.includes(phrase)) {
      issues.push(`Forbidden inference: "${phrase}"`);
    }
  }
  
  // Check for action phrases
  const actionCheck = containsForbiddenActionPhrase(text);
  if (!actionCheck.clean) {
    issues.push(`Contains action phrases: ${actionCheck.found.join(', ')}`);
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// 7. UX: PROFESSIONAL FEEDBACK, NO DRAMA
// =============================================================================

export const UX_PROFESSIONAL_STANDARD = {
  should_feel_like: [
    'a swing replay',
    'a launch monitor',
    'an ECG trace',
  ],
  
  not_like: [
    'a news site',
    'a dashboard game',
    'a story',
  ],
  
  visual_rules: {
    motion: 'calm',
    colors: 'neutral',
    excitement_cues: 'none',
    urgency_framing: 'none',
  },
  
  animation_spec: {
    timing: 'ease-out',
    duration_ms: { min: 200, max: 400 },
    no_bounce: true,
    no_pulse: true,
    no_glow: true,
  },
};

// =============================================================================
// 8. FEEDBACK LOOP (MEASURE → OBSERVE → MEASURE AGAIN)
// =============================================================================

export const FEEDBACK_LOOP_RULES = {
  system_must_support: [
    'before / after comparisons',
    'temporal overlays',
    'historical baselines',
  ],
  
  but_never: [
    'claim improvement',
    'claim deterioration',
    'claim success',
    'claim failure',
  ],
  
  only_allowed_phrase: 'Configuration changed relative to baseline.',
  
  forbidden_value_words: [
    'improved',
    'worsened',
    'better',
    'worse',
    'success',
    'failure',
    'progress',
    'regress',
    'achievement',
    'decline',
  ],
};

export interface TemporalComparison {
  indicatorCode: string;
  baseline: { period: string; value: number };
  current: { period: string; value: number };
  
  change: {
    absolute: number;
    percent: number;
    direction: 'increased' | 'decreased' | 'unchanged';
  };
  
  // Explicitly not included
  interpretation: null;
  valueJudgment: null;
}

export function createTemporalComparison(
  indicatorCode: string,
  baseline: { period: string; value: number },
  current: { period: string; value: number }
): TemporalComparison {
  const absolute = current.value - baseline.value;
  const percent = baseline.value !== 0 ? (absolute / baseline.value) * 100 : 0;
  const direction = absolute > 0 ? 'increased' : absolute < 0 ? 'decreased' : 'unchanged';
  
  return {
    indicatorCode,
    baseline,
    current,
    change: { absolute, percent, direction },
    interpretation: null,
    valueJudgment: null,
  };
}

// =============================================================================
// 9. ERROR HANDLING (CRITICAL)
// =============================================================================

export const ERROR_HANDLING_RULES = {
  when_data_fails: {
    must_show: [
      'why',
      'which sensor failed',
      'what is missing',
      'when it might return',
    ],
    
    never: [
      'hide failure',
      'smooth over gaps',
      'auto-fill',
      'interpolate without disclosure',
    ],
  },
};

export interface DataFailure {
  failureType: 'sensor_offline' | 'validation_failed' | 'source_error' | 'timeout' | 'unknown';
  affectedSensors: string[];
  missingData: string[];
  expectedResolution: string | null;
  timestamp: string;
  
  userMessage: string;
  technicalDetails: string;
}

export function createDataFailure(params: {
  failureType: DataFailure['failureType'];
  affectedSensors: string[];
  missingData: string[];
  expectedResolution: string | null;
}): DataFailure {
  const messages: Record<DataFailure['failureType'], string> = {
    sensor_offline: 'Data source temporarily unavailable',
    validation_failed: 'Data did not pass quality checks',
    source_error: 'Error retrieving data from source',
    timeout: 'Data request timed out',
    unknown: 'Unexpected error occurred',
  };
  
  return {
    ...params,
    timestamp: new Date().toISOString(),
    userMessage: messages[params.failureType],
    technicalDetails: `Affected: ${params.affectedSensors.join(', ')}. Missing: ${params.missingData.join(', ')}`,
  };
}

// =============================================================================
// 10. INTERNAL CERTIFICATION TEST
// =============================================================================

export const CERTIFICATION_TEST = {
  before_shipping_any_feature: [
    'Would a golf pro trust this output?',
    'Would a simulator manufacturer allow this tolerance?',
    'Would "blank" be preferable here?',
  ],
  
  rule: 'If "blank" is better → ship blank.',
};

export interface FeatureCertification {
  featureId: string;
  golfProWouldTrust: boolean;
  manufacturerWouldAllow: boolean;
  blankWouldBeBetter: boolean;
  
  decision: 'ship' | 'ship_blank' | 'reject';
  reason: string;
}

export function certifyFeature(params: Omit<FeatureCertification, 'decision' | 'reason'>): FeatureCertification {
  if (params.blankWouldBeBetter) {
    return {
      ...params,
      decision: 'ship_blank',
      reason: 'Blank is preferable to uncertain output',
    };
  }
  
  if (!params.golfProWouldTrust) {
    return {
      ...params,
      decision: 'reject',
      reason: 'Does not meet professional trust standard',
    };
  }
  
  if (!params.manufacturerWouldAllow) {
    return {
      ...params,
      decision: 'reject',
      reason: 'Tolerance not acceptable for production',
    };
  }
  
  return {
    ...params,
    decision: 'ship',
    reason: 'Meets sensor-grade standards',
  };
}

// =============================================================================
// 11. SYSTEM SELF-DESCRIPTION (LOCKED)
// =============================================================================

export const SYSTEM_SELF_DESCRIPTION = {
  locked: true,
  version: '1.0.0',
  
  internal_statement: `We measure societal motion with sensor-grade discipline.
Interpretation happens outside the instrument.`,
  
  public_statement: `This system measures observable signals with declared tolerance.
It does not interpret, recommend, or predict.`,
};

// =============================================================================
// FINAL MANTRA
// =============================================================================

export const SENSOR_GRADE_MANTRA = {
  text: 'Measure. Show. Stop.',
  
  expanded: 'No more. No less.',
  
  words: ['measure', 'show', 'stop'],
};

// =============================================================================
// COMPLETE SENSOR-GRADE AUDIT
// =============================================================================

export interface SensorGradeAudit {
  timestamp: string;
  scope: string;
  
  sensorsEvaluated: number;
  sensorsDowngraded: number;
  fusionsDivergent: number;
  blanksProduced: number;
  
  formationValidation: { valid: boolean; issues: string[] };
  aiOutputValidation: { valid: boolean; issues: string[] };
  actionPhraseCheck: { clean: boolean; found: string[] };
  
  certification: FeatureCertification | null;
  
  overallPassed: boolean;
  allIssues: string[];
}

export function runSensorGradeAudit(params: {
  scope: string;
  sensors: VirtualSensor[];
  fusions: FusedMeasurement[];
  formations: FormationOutput[];
  aiOutputs: string[];
  allText: string[];
  certificationParams?: Omit<FeatureCertification, 'decision' | 'reason'>;
}): SensorGradeAudit {
  const allIssues: string[] = [];
  
  // Evaluate sensors
  let sensorsDowngraded = 0;
  for (const sensor of params.sensors) {
    const grade = evaluateSensorGrade(sensor);
    if (grade === 'downgraded') sensorsDowngraded++;
  }
  
  // Check fusions
  let fusionsDivergent = 0;
  let blanksProduced = 0;
  for (const fusion of params.fusions) {
    if (!fusion.fusion.withinTolerance) fusionsDivergent++;
    if (fusion.output.showBlank) blanksProduced++;
  }
  
  // Validate formations
  const formationIssues: string[] = [];
  for (const formation of params.formations) {
    const result = validateFormationOutput(formation);
    formationIssues.push(...result.issues);
  }
  allIssues.push(...formationIssues);
  
  // Validate AI outputs
  const aiIssues: string[] = [];
  for (const output of params.aiOutputs) {
    const result = validateAIOutput(output);
    aiIssues.push(...result.issues);
  }
  allIssues.push(...aiIssues);
  
  // Check all text for action phrases
  const actionPhraseFound: string[] = [];
  for (const text of params.allText) {
    const check = containsForbiddenActionPhrase(text);
    actionPhraseFound.push(...check.found);
  }
  if (actionPhraseFound.length > 0) {
    allIssues.push(`Action phrases found: ${[...new Set(actionPhraseFound)].join(', ')}`);
  }
  
  // Certification
  const certification = params.certificationParams
    ? certifyFeature(params.certificationParams)
    : null;
  
  if (certification && certification.decision === 'reject') {
    allIssues.push(`Certification failed: ${certification.reason}`);
  }
  
  return {
    timestamp: new Date().toISOString(),
    scope: params.scope,
    sensorsEvaluated: params.sensors.length,
    sensorsDowngraded,
    fusionsDivergent,
    blanksProduced,
    formationValidation: { valid: formationIssues.length === 0, issues: formationIssues },
    aiOutputValidation: { valid: aiIssues.length === 0, issues: aiIssues },
    actionPhraseCheck: { clean: actionPhraseFound.length === 0, found: [...new Set(actionPhraseFound)] },
    certification,
    overallPassed: allIssues.length === 0,
    allIssues,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const SENSOR_GRADE_VERSION = '1.0.0';

export const SENSOR_GRADE_SUMMARY = {
  role: CHIEF_MEASUREMENT_ENGINEER_ROLE,
  corePrinciple: CORE_PRINCIPLE,
  sensorModel: SENSOR_TYPE_MAPPING,
  fusionRules: SENSOR_FUSION_RULES,
  toleranceGates: TOLERANCE_GATES,
  formationBehavior: FORMATION_BEHAVIOR,
  configurationFeedback: CONFIGURATION_FEEDBACK_PRINCIPLE,
  aiStrictMode: AI_STRICT_MODE,
  uxStandard: UX_PROFESSIONAL_STANDARD,
  feedbackLoop: FEEDBACK_LOOP_RULES,
  errorHandling: ERROR_HANDLING_RULES,
  certification: CERTIFICATION_TEST,
  selfDescription: SYSTEM_SELF_DESCRIPTION,
  mantra: SENSOR_GRADE_MANTRA,
};
