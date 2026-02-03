/**
 * LAMBDA SELF-CALIBRATION & MODEL EVOLUTION
 * 
 * "Learn continuously, drift never"
 * 
 * FUNDAMENTAL PRINCIPLE (IMMUTABLE):
 * The model may improve – but NEVER rewrite reality backwards.
 * 
 * All improvement is:
 * - version-controlled
 * - transparent
 * - reproducible
 * 
 * No retroactive rewriting. No silent adjustments.
 */

// =============================================================================
// RULE 2: WHAT MAY / MAY NOT BE CALIBRATED
// =============================================================================

/**
 * MAY be calibrated (within defined intervals)
 */
export const CALIBRATABLE_PARAMETERS = [
  'indicator_weighting',        // Indikatorviktning
  'latency_assumptions',        // Latensantaganden
  'uncertainty_models',         // Osäkerhetsmodeller
  'data_quality_assessments',   // Datakvalitetsbedömningar
  'sensor_relevance_per_scope', // Sensor-relevans per scope
] as const;

/**
 * MAY NEVER be calibrated
 */
export const IMMUTABLE_PARAMETERS = [
  'indicator_definitions',      // Definitioner av indikatorer
  'historical_datapoints',      // Historiska datapunkter
  'normalization_scales_retroactive', // Normaliseringsskalor bakåt
  'political_target_values',    // Mål-/idealvärden för politiska ändamål
] as const;

export type CalibratableParameter = typeof CALIBRATABLE_PARAMETERS[number];
export type ImmutableParameter = typeof IMMUTABLE_PARAMETERS[number];

// =============================================================================
// RULE 3: CALIBRATION TRIGGERS
// =============================================================================

/**
 * Calibration may ONLY be triggered by observable error patterns.
 * No manual "adjustment for reasonableness".
 */
export const VALID_CALIBRATION_TRIGGERS = [
  {
    code: 'SYSTEMATIC_BIAS',
    name: 'Systematic Over/Underestimation',
    description: 'Model consistently predicts too high or too low',
    minObservations: 12,
  },
  {
    code: 'LATENCY_MISMATCH',
    name: 'Latency Deviation',
    description: 'Observed vs expected latency differs significantly',
    minObservations: 6,
  },
  {
    code: 'COVERAGE_IMPROVEMENT',
    name: 'Improved Data Coverage',
    description: 'New data sources reduce uncertainty',
    minObservations: 1,
  },
  {
    code: 'META_STUDY_EVIDENCE',
    name: 'New Evidence (Meta-studies)',
    description: 'Peer-reviewed evidence of new relationships',
    minObservations: 3,
  },
] as const;

export type CalibrationTriggerCode = typeof VALID_CALIBRATION_TRIGGERS[number]['code'];

// =============================================================================
// RULE 4: CALIBRATION LOOP (ECU ANALOGY)
// =============================================================================

export type CalibrationStep = 'observation' | 'residual_analysis' | 'candidate_adjustment' | 'backtest' | 'approval';

export interface CalibrationLoopStep {
  step: CalibrationStep;
  order: number;
  name: {
    sv: string;
    en: string;
  };
  description: {
    sv: string;
    en: string;
  };
  requiredInputs: string[];
  outputs: string[];
}

export const CALIBRATION_LOOP: CalibrationLoopStep[] = [
  {
    step: 'observation',
    order: 1,
    name: { sv: 'Observation', en: 'Observation' },
    description: {
      sv: 'Jämför modellens tidigare prediktioner/antaganden med observerat utfall',
      en: 'Compare model predictions/assumptions with observed outcomes',
    },
    requiredInputs: ['historical_predictions', 'actual_outcomes'],
    outputs: ['prediction_outcome_pairs'],
  },
  {
    step: 'residual_analysis',
    order: 2,
    name: { sv: 'Residualanalys', en: 'Residual Analysis' },
    description: {
      sv: 'Var avviker modellen? I vilka scopes? Under vilka förhållanden?',
      en: 'Where does the model deviate? In which scopes? Under what conditions?',
    },
    requiredInputs: ['prediction_outcome_pairs'],
    outputs: ['residual_patterns', 'deviation_scopes', 'condition_factors'],
  },
  {
    step: 'candidate_adjustment',
    order: 3,
    name: { sv: 'Kandidatjustering', en: 'Candidate Adjustment' },
    description: {
      sv: 'Föreslå små ändringar inom låsta intervall',
      en: 'Propose small adjustments within locked intervals',
    },
    requiredInputs: ['residual_patterns', 'calibration_bounds'],
    outputs: ['candidate_changes'],
  },
  {
    step: 'backtest',
    order: 4,
    name: { sv: 'Backtest', en: 'Backtest' },
    description: {
      sv: 'Kör ändringen på historiska fönster, jämför stabilitet, bias, osäkerhet',
      en: 'Run changes on historical windows, compare stability, bias, uncertainty',
    },
    requiredInputs: ['candidate_changes', 'historical_data'],
    outputs: ['backtest_results', 'stability_metrics', 'bias_comparison'],
  },
  {
    step: 'approval',
    order: 5,
    name: { sv: 'Godkännande', en: 'Approval' },
    description: {
      sv: 'Automatiskt om förbättring är statistiskt signifikant, annars: ingen ändring',
      en: 'Automatic if improvement is statistically significant, otherwise: no change',
    },
    requiredInputs: ['backtest_results', 'significance_threshold'],
    outputs: ['approval_decision', 'new_version_id'],
  },
];

// =============================================================================
// RULE 5: VERSION MANAGEMENT (ABSOLUTE REQUIREMENT)
// =============================================================================

export interface ModelVersion {
  versionId: string;
  previousVersionId: string | null;
  createdAt: string;
  changelog: VersionChange[];
  motivation: string;
  historicalImpact: {
    described: string;
    applied: false; // NEVER applied retroactively
  };
  calibrationTrigger: CalibrationTriggerCode;
  backtestResults: BacktestResult;
}

export interface VersionChange {
  parameter: CalibratableParameter;
  previousValue: number;
  newValue: number;
  changePercent: number;
  scope: string;
}

export interface BacktestResult {
  biasReduction: number;       // % reduction in systematic bias
  uncertaintyReduction: number; // % reduction in uncertainty
  stabilityScore: number;       // 0-1, higher is better
  significanceLevel: number;    // p-value
  historicalFactsPreserved: boolean;
  reproducible: boolean;
}

// =============================================================================
// RULE 6: DRIFT GUARDS
// =============================================================================

export const DRIFT_GUARDS = {
  maxChangePerVersion: 0.05,      // Max 5% change per version
  maxAccumulatedChangePerYear: 0.15, // Max 15% accumulated per year
  alarmThreshold: 0.10,           // Alarm at 10% unexpected jump
  manualReviewThreshold: 0.12,    // Manual review required at 12%
} as const;

export interface DriftCheck {
  currentVersionId: string;
  previousVersionId: string;
  parameterChanges: {
    parameter: CalibratableParameter;
    changePercent: number;
    withinBounds: boolean;
  }[];
  totalDrift: number;
  yearlyAccumulatedDrift: number;
  status: 'ok' | 'warning' | 'alarm' | 'blocked';
  requiresManualReview: boolean;
}

export const checkDrift = (changes: VersionChange[], yearlyHistory: VersionChange[]): DriftCheck['status'] => {
  const maxChange = Math.max(...changes.map(c => Math.abs(c.changePercent)));
  const yearlyTotal = yearlyHistory.reduce((sum, c) => sum + Math.abs(c.changePercent), 0);
  
  if (maxChange > DRIFT_GUARDS.maxChangePerVersion) return 'blocked';
  if (yearlyTotal > DRIFT_GUARDS.maxAccumulatedChangePerYear) return 'blocked';
  if (maxChange > DRIFT_GUARDS.manualReviewThreshold) return 'alarm';
  if (maxChange > DRIFT_GUARDS.alarmThreshold) return 'warning';
  return 'ok';
};

// =============================================================================
// RULE 7: THREE-LAYER SEPARATION (CRITICAL ARCHITECTURE)
// =============================================================================

export const SYSTEM_LAYERS = {
  data: {
    name: 'Data Layer',
    description: 'Raw data (immutable)',
    calibratable: false,
    examples: ['sensor_readings', 'source_values', 'timestamps'],
  },
  model: {
    name: 'Model Layer',
    description: 'How data is weighted (versioned)',
    calibratable: true,
    examples: ['weights', 'latency_models', 'uncertainty_estimators'],
  },
  interpretation: {
    name: 'Interpretation Layer',
    description: 'Presentation & text',
    calibratable: false,
    examples: ['templates', 'visualizations', 'language'],
  },
} as const;

// =============================================================================
// RULE 8: LEARNING ≠ THINKING
// =============================================================================

export const SYSTEM_CAPABILITIES = {
  allowed: [
    'learn_patterns',
    'improve_precision',
    'reduce_uncertainty',
  ],
  forbidden: [
    'develop_opinions',
    'change_goals',
    'optimize_for_narrative',
  ],
} as const;

// =============================================================================
// RULE 9: GLOBAL CONSISTENCY
// =============================================================================

export interface GlobalConsistencyTest {
  testedGlobally: boolean;
  testedDevelopmentLevels: string[];
  testedCultures: string[];
  improvementScope: 'global' | 'regional' | 'single_country';
  accepted: boolean; // Only global improvements accepted
}

export const validateGlobalConsistency = (test: GlobalConsistencyTest): boolean => {
  if (!test.testedGlobally) return false;
  if (test.testedDevelopmentLevels.length < 3) return false;
  if (test.testedCultures.length < 3) return false;
  if (test.improvementScope !== 'global') return false;
  return true;
};

// =============================================================================
// RULE 10: SELF-TEST BEFORE RELEASE (MANDATORY)
// =============================================================================

export interface ReleaseTest {
  lessBias: boolean;
  lowerUncertainty: boolean;
  betterPredictiveCoherence: boolean;
  historicalFactsUnchanged: boolean;
  fullyReproducible: boolean;
}

export const canRelease = (test: ReleaseTest): boolean => {
  return (
    test.lessBias &&
    test.lowerUncertainty &&
    test.betterPredictiveCoherence &&
    test.historicalFactsUnchanged &&
    test.fullyReproducible
  );
};

export const RELEASE_REQUIREMENTS = [
  { code: 'less_bias', label: { sv: 'Mindre bias', en: 'Less bias' } },
  { code: 'lower_uncertainty', label: { sv: 'Lägre osäkerhet', en: 'Lower uncertainty' } },
  { code: 'better_coherence', label: { sv: 'Bättre prediktiv koherens', en: 'Better predictive coherence' } },
  { code: 'history_preserved', label: { sv: 'Oförändrade historiska fakta', en: 'Historical facts unchanged' } },
  { code: 'reproducible', label: { sv: 'Full reproducerbarhet', en: 'Fully reproducible' } },
];

// =============================================================================
// RULE 11: USER COMMUNICATION
// =============================================================================

export const VERSION_UPDATE_TEMPLATES = {
  standard: {
    sv: 'Modell uppdaterad till v{version}. Resultat oförändrade historiskt. Konfidensintervall förbättrade.',
    en: 'Model updated to v{version}. Results unchanged historically. Confidence intervals improved.',
  },
  uncertaintyReduced: {
    sv: 'Modell uppdaterad till v{version}. Osäkerhet minskad med {percent}%. Historiska värden oförändrade.',
    en: 'Model updated to v{version}. Uncertainty reduced by {percent}%. Historical values unchanged.',
  },
  coverageImproved: {
    sv: 'Modell uppdaterad till v{version}. Ny datakälla integrerad. Täckning förbättrad.',
    en: 'Model updated to v{version}. New data source integrated. Coverage improved.',
  },
};

// NEVER use:
export const FORBIDDEN_UPDATE_PHRASES = [
  'Nu vet vi bättre',
  'Now we know better',
  'Previous version was wrong',
  'Tidigare version var fel',
  'Korrigerat',
  'Corrected',
];

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const CALIBRATION_DOCTRINE = {
  sv: 'Lambda förbättras som en motor trimmas: i små steg, under belastning, med full loggning.',
  en: 'Lambda improves like an engine is tuned: in small steps, under load, with full logging.',
};

export const FUNDAMENTAL_PRINCIPLE = {
  sv: 'Modellen får bli bättre – men aldrig ändra verkligheten bakåt.',
  en: 'The model may improve – but never rewrite reality backwards.',
};
