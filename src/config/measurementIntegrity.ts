/**
 * MEASUREMENT INTEGRITY STANDARD
 * 
 * "The Golf Rule"
 * 
 * A modern golf simulator does not:
 * - Judge the shot
 * - Recommend how to play the next hole
 * - Care about ambition, will, or self-image
 * 
 * It only measures exactly what happens, within defined tolerances,
 * and refuses to show anything when data doesn't hold.
 * 
 * This system applies the same standard to societal data.
 * 
 * Core principle: "Rather nothing than wrong."
 */

// =============================================================================
// SYSTEM PRINCIPLE 01: MEASUREMENT INTEGRITY
// =============================================================================

export const MEASUREMENT_INTEGRITY_PRINCIPLE = {
  id: 'PRINCIPLE_01',
  name: 'Measurement Integrity',
  
  statement: `If data cannot be measured within declared tolerance,
it is not shown.`,
  
  corollaries: [
    'Rather "Unknown" than model guess',
    'Rather empty cell than speculative AI text',
    'Rather blank than "approximately right"',
  ],
  
  why_it_matters: [
    'Professionals will trust the system',
    'Amateurs will be forced to be humble',
    'Power cannot hide behind rhetoric',
  ],
};

// =============================================================================
// THE GOLF-TO-SOCIETY TRANSLATION
// =============================================================================

export const GOLF_SOCIETY_MAPPING = {
  golf: {
    inputs: ['club', 'angle', 'spin'],
    precision: 'sensor precision',
    gap_handling: 'data gap → blank',
    emotion: 'none',
    comparison: 'vs own average',
    feedback: 'adjust → measure again',
  },
  
  society: {
    inputs: ['indicators', 'time', 'place'],
    precision: 'source declaration',
    gap_handling: 'data gap → "Unknown"',
    emotion: 'no narrative',
    comparison: 'vs history / peers',
    feedback: 'policy change → observe again',
  },
  
  shared_principle: 'The system does not care if the player "meant well". It only measures the outcome.',
};

// =============================================================================
// TOLERANCE DECLARATION STANDARD
// =============================================================================

export interface ToleranceDeclaration {
  indicatorCode: string;
  measurementMethod: string;
  precision: {
    value: number;
    unit: string;
    confidenceLevel: number; // 0-1
  };
  temporalResolution: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  spatialResolution: 'point' | 'municipality' | 'region' | 'country' | 'continent' | 'global';
  lastCalibration: string; // ISO date
  knownLimitations: string[];
}

export interface MeasurementResult {
  indicatorCode: string;
  value: number | null;
  withinTolerance: boolean;
  toleranceDeclaration: ToleranceDeclaration;
  showValue: boolean;
  blankReason?: BlankReason;
}

// =============================================================================
// BLANK MODE - WHEN DATA IS NOT SHOWN
// =============================================================================

export type BlankReason = 
  | 'sensor_gap'           // No measurement available
  | 'tolerance_exceeded'   // Measurement exists but outside declared precision
  | 'source_unavailable'   // Source system not responding
  | 'definition_changed'   // Methodology changed, comparison invalid
  | 'temporal_mismatch'    // Time period not aligned
  | 'spatial_mismatch'     // Geographic boundaries changed
  | 'quality_threshold'    // Below minimum data quality score
  | 'pending_verification' // Data exists but not yet verified
  | 'redacted'             // Intentionally withheld (with explanation)
  | 'not_applicable';      // Indicator doesn't apply to this entity

export const BLANK_REASONS_HUMAN_READABLE: Record<BlankReason, string> = {
  sensor_gap: 'No measurement available for this period',
  tolerance_exceeded: 'Measurement uncertainty exceeds acceptable threshold',
  source_unavailable: 'Data source not accessible',
  definition_changed: 'Methodology changed, comparison not valid',
  temporal_mismatch: 'Time periods do not align',
  spatial_mismatch: 'Geographic boundaries have changed',
  quality_threshold: 'Data quality below minimum standard',
  pending_verification: 'Data pending verification',
  redacted: 'Data withheld',
  not_applicable: 'This indicator does not apply here',
};

export interface BlankCell {
  type: 'blank';
  reason: BlankReason;
  humanReadable: string;
  technicalDetails?: string;
  expectedResolution?: string;
  lastAttempt?: string;
}

export function createBlankCell(reason: BlankReason, details?: {
  technicalDetails?: string;
  expectedResolution?: string;
  lastAttempt?: string;
}): BlankCell {
  return {
    type: 'blank',
    reason,
    humanReadable: BLANK_REASONS_HUMAN_READABLE[reason],
    ...details,
  };
}

// =============================================================================
// DATA QUALITY THRESHOLDS
// =============================================================================

export const QUALITY_THRESHOLDS = {
  minimum_confidence: 0.7,      // Below this = blank
  minimum_coverage: 0.8,        // Below this = show with warning
  minimum_recency_days: 365,    // Older than this = show with staleness warning
  
  tolerance_levels: {
    high_precision: 0.02,       // 2% tolerance
    standard: 0.05,             // 5% tolerance  
    low_precision: 0.10,        // 10% tolerance
    exploratory: 0.20,          // 20% tolerance (must be labeled)
  },
};

export function shouldShowValue(params: {
  value: number | null;
  confidence: number;
  coverage: number;
  toleranceLevel: keyof typeof QUALITY_THRESHOLDS.tolerance_levels;
  measuredTolerance: number;
}): { show: boolean; blankReason?: BlankReason; warning?: string } {
  const { value, confidence, coverage, toleranceLevel, measuredTolerance } = params;
  
  // No value = blank
  if (value === null) {
    return { show: false, blankReason: 'sensor_gap' };
  }
  
  // Below confidence threshold = blank
  if (confidence < QUALITY_THRESHOLDS.minimum_confidence) {
    return { show: false, blankReason: 'quality_threshold' };
  }
  
  // Tolerance exceeded = blank
  const maxTolerance = QUALITY_THRESHOLDS.tolerance_levels[toleranceLevel];
  if (measuredTolerance > maxTolerance) {
    return { show: false, blankReason: 'tolerance_exceeded' };
  }
  
  // Low coverage = show with warning
  if (coverage < QUALITY_THRESHOLDS.minimum_coverage) {
    return { show: true, warning: `Coverage: ${(coverage * 100).toFixed(0)}%` };
  }
  
  return { show: true };
}

// =============================================================================
// "WHY THIS IS BLANK" UX COMPONENT SPEC
// =============================================================================

export const WHY_BLANK_UX = {
  component_name: 'WhyBlank',
  
  visual: {
    indicator: '—', // em-dash, not hyphen
    color: 'muted', // from design system
    clickable: true,
    hover_preview: true,
  },
  
  expanded_content: {
    sections: [
      'reason',           // Human-readable explanation
      'technical_cause',  // Technical details (collapsible)
      'when_expected',    // When data might be available
      'what_exists',      // What related data IS available
      'methodology',      // Link to methodology docs
    ],
  },
  
  behavior: {
    default_state: 'collapsed',
    click_expands: true,
    escape_closes: true,
    preserves_context: true, // Doesn't navigate away
  },
  
  accessibility: {
    aria_label: 'Data not available - click for details',
    screen_reader_text: 'This value is blank because: {reason}',
  },
};

export interface WhyBlankProps {
  reason: BlankReason;
  technicalDetails?: string;
  expectedResolution?: string;
  relatedDataAvailable?: {
    indicatorCode: string;
    indicatorName: string;
    value: number;
  }[];
  methodologyUrl?: string;
}

// =============================================================================
// SENSOR STANDARD FOR SOCIETAL DATA
// =============================================================================

export const SOCIETAL_SENSOR_STANDARD = {
  name: 'Societal Data Sensor Standard (SDSS)',
  version: '1.0.0',
  
  principles: [
    'Every value has a declared source',
    'Every source has a declared methodology',
    'Every methodology has declared limitations',
    'Every limitation affects confidence scoring',
    'Below-threshold confidence = blank',
  ],
  
  source_requirements: {
    must_declare: [
      'collection_method',
      'sample_size_or_coverage',
      'temporal_resolution',
      'spatial_resolution',
      'known_biases',
      'revision_history',
    ],
    
    must_provide: [
      'raw_data_access_or_reference',
      'methodology_documentation',
      'update_schedule',
      'contact_for_questions',
    ],
  },
  
  calibration: {
    cross_source_validation: true,
    temporal_consistency_check: true,
    outlier_flagging: true,
    revision_tracking: true,
  },
};

// =============================================================================
// PRE-SENSORISK VS SENSORISK POLITIK
// =============================================================================

export const POLITICAL_MATURITY_MODEL = {
  description: 'Politics today is pre-sensoric. This system introduces sensor-grade feedback.',
  
  pre_sensoric: {
    characteristics: [
      'Lots of narrative',
      'Little measurable feedback',
      'Almost no blanks (always an opinion)',
      'Debate about whether spin is "a feeling"',
      'Excuses when data is missing',
    ],
    
    result: 'Power hides behind rhetoric',
  },
  
  sensoric: {
    characteristics: [
      'Measurement within tolerance',
      'Blank when data doesn\'t hold',
      'No debate about observable facts',
      'No excuses, just acknowledgment of gaps',
      'Outcome measured, regardless of intent',
    ],
    
    result: 'Reality visible, regardless of narrative',
  },
  
  transition_principle: 'Why do we accept lower measurement standards for society than for a golf ball?',
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export function validateToleranceDeclaration(decl: ToleranceDeclaration): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!decl.measurementMethod) {
    issues.push('Missing measurement method');
  }
  
  if (decl.precision.confidenceLevel < 0 || decl.precision.confidenceLevel > 1) {
    issues.push('Confidence level must be between 0 and 1');
  }
  
  if (!decl.knownLimitations?.length) {
    issues.push('Must declare known limitations (even if minimal)');
  }
  
  if (!decl.lastCalibration) {
    issues.push('Missing last calibration date');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateMeasurementResult(result: MeasurementResult): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // If showing value but outside tolerance = invalid
  if (result.showValue && !result.withinTolerance) {
    issues.push('Cannot show value that is outside declared tolerance');
  }
  
  // If not showing, must have blank reason
  if (!result.showValue && !result.blankReason) {
    issues.push('Blank values must have a reason');
  }
  
  // Must have tolerance declaration
  if (!result.toleranceDeclaration) {
    issues.push('Missing tolerance declaration');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// INTEGRITY AUDIT
// =============================================================================

export interface IntegrityAudit {
  timestamp: string;
  scope: string;
  
  totalDataPoints: number;
  shownDataPoints: number;
  blankDataPoints: number;
  
  blanksByReason: Record<BlankReason, number>;
  
  toleranceViolationsBlocked: number;
  qualityThresholdBlocked: number;
  
  integrityScore: number; // 0-100
  
  issues: string[];
  passed: boolean;
}

export function runIntegrityAudit(params: {
  scope: string;
  measurements: MeasurementResult[];
}): IntegrityAudit {
  const issues: string[] = [];
  const blanksByReason: Partial<Record<BlankReason, number>> = {};
  
  let toleranceViolationsBlocked = 0;
  let qualityThresholdBlocked = 0;
  
  for (const m of params.measurements) {
    const validation = validateMeasurementResult(m);
    issues.push(...validation.issues);
    
    if (m.blankReason) {
      blanksByReason[m.blankReason] = (blanksByReason[m.blankReason] || 0) + 1;
      
      if (m.blankReason === 'tolerance_exceeded') {
        toleranceViolationsBlocked++;
      }
      if (m.blankReason === 'quality_threshold') {
        qualityThresholdBlocked++;
      }
    }
  }
  
  const totalDataPoints = params.measurements.length;
  const shownDataPoints = params.measurements.filter(m => m.showValue).length;
  const blankDataPoints = totalDataPoints - shownDataPoints;
  
  // Integrity score: 100 if all shown values are within tolerance
  const validShown = params.measurements.filter(m => m.showValue && m.withinTolerance).length;
  const integrityScore = shownDataPoints > 0 
    ? Math.round((validShown / shownDataPoints) * 100)
    : 100;
  
  return {
    timestamp: new Date().toISOString(),
    scope: params.scope,
    totalDataPoints,
    shownDataPoints,
    blankDataPoints,
    blanksByReason: blanksByReason as Record<BlankReason, number>,
    toleranceViolationsBlocked,
    qualityThresholdBlocked,
    integrityScore,
    issues,
    passed: issues.length === 0 && integrityScore === 100,
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const MEASUREMENT_INTEGRITY_VERSION = '1.0.0';

export const MEASUREMENT_INTEGRITY_SUMMARY = {
  principle: MEASUREMENT_INTEGRITY_PRINCIPLE,
  golfMapping: GOLF_SOCIETY_MAPPING,
  qualityThresholds: QUALITY_THRESHOLDS,
  blankUX: WHY_BLANK_UX,
  sensorStandard: SOCIETAL_SENSOR_STANDARD,
  maturityModel: POLITICAL_MATURITY_MODEL,
};

// =============================================================================
// MANTRA
// =============================================================================

export const MEASUREMENT_MANTRA = {
  text: 'Rather nothing than wrong.',
  
  expanded: [
    'Rather "Unknown" than model guess.',
    'Rather empty cell than speculative AI text.',
    'Rather blank than "approximately right".',
  ],
};
