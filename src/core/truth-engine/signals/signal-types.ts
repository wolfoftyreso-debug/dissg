/**
 * SIGNAL TYPES
 * 
 * STEG 21: REAL-TIME SIGNAL LAYER
 * 
 * Nyckelprincip: Oraklet jagar aldrig nyheter.
 * Det registrerar förändring.
 * 
 * Endast fyra signaltyper får skapa nya frågor:
 * A: Statistisk avvikelse
 * B: Ny datakälla / ny dimension
 * C: Strukturell förändring
 * D: Korskoppling som blir möjlig
 */

/**
 * SIGNAL TYPE ENUM
 */
export type SignalType = 
  | 'anomaly'           // A: Statistisk avvikelse
  | 'new_dimension'     // B: Ny datakälla / dimension
  | 'structural_change' // C: Metodändring / regeländring
  | 'cross_coupling';   // D: Korskoppling möjlig

/**
 * BASE SIGNAL
 * Common properties for all signals
 */
export interface BaseSignal {
  readonly signal_id: string;
  readonly type: SignalType;
  readonly detected_at: string;
  readonly source: string;
  readonly confidence: number;  // 0-1
  
  // What this signal is NOT
  readonly is_not: {
    readonly headline: true;
    readonly trend: true;
    readonly narrative: true;
    readonly shock_value: true;
  };
  
  // What this signal IS
  readonly is: {
    readonly measurable_change: boolean;
    readonly deviation_from_historical: boolean;
    readonly new_data_dimension: boolean;
    readonly new_variable_combination: boolean;
  };
}

/**
 * SIGNAL TYPE A: STATISTICAL ANOMALY
 * When a value breaks its historical pattern
 */
export interface AnomalySignal extends BaseSignal {
  readonly type: 'anomaly';
  readonly variable: string;
  readonly entity: string;
  readonly entity_type: 'country' | 'region' | 'municipality' | 'organization';
  
  // Deviation metrics
  readonly deviation: {
    readonly sigma: number;        // Standard deviations from mean
    readonly direction: 'up' | 'down';
    readonly baseline_period: string;
    readonly current_value: number;
    readonly expected_range: {
      readonly min: number;
      readonly max: number;
    };
  };
  
  // Generated question type
  readonly question_template: 'trend_deviation';
}

/**
 * SIGNAL TYPE B: NEW DATA SOURCE / DIMENSION
 * New dataset, demographic breakdown, geographic granularity
 */
export interface NewDimensionSignal extends BaseSignal {
  readonly type: 'new_dimension';
  readonly dimension_type: 'new_dataset' | 'new_demographic' | 'new_geographic' | 'new_temporal';
  readonly variable: string;
  readonly scope: string;
  
  // What became available
  readonly newly_available: {
    readonly description: string;
    readonly first_observation_date: string;
    readonly coverage: string;
    readonly source_organization: string;
  };
  
  // Epistemic status
  readonly epistemic_status: 'newly_observable';
  
  // Generated question type
  readonly question_template: 'now_available' | 'first_time_measured' | 'expanded_coverage';
}

/**
 * SIGNAL TYPE C: STRUCTURAL CHANGE
 * Methodology change, rule change, new definition
 */
export interface StructuralChangeSignal extends BaseSignal {
  readonly type: 'structural_change';
  readonly change_type: 'methodology' | 'definition' | 'regulation' | 'classification';
  readonly variable: string;
  readonly entity: string;
  
  // Change details
  readonly change: {
    readonly effective_date: string;
    readonly previous_version: string;
    readonly new_version: string;
    readonly impact_assessment: 'breaking' | 'significant' | 'minor';
    readonly comparability_affected: boolean;
  };
  
  // Creates meta-questions, not fact-questions
  readonly question_type: 'meta';
  readonly question_template: 'methodology_change';
}

/**
 * SIGNAL TYPE D: CROSS-COUPLING
 * When two previously separate datasets can now be linked
 */
export interface CrossCouplingSignal extends BaseSignal {
  readonly type: 'cross_coupling';
  
  // The datasets being linked
  readonly dataset_a: {
    readonly id: string;
    readonly variable: string;
    readonly domain: string;
  };
  readonly dataset_b: {
    readonly id: string;
    readonly variable: string;
    readonly domain: string;
  };
  
  // How they can be linked
  readonly coupling: {
    readonly common_identifier: string;
    readonly synchronized_time_axis: boolean;
    readonly geographic_match: boolean;
    readonly confidence: number;
  };
  
  // Questions that were previously epistemically impossible
  readonly enables_questions: 'previously_impossible';
  readonly question_template: 'cross_domain_correlation';
}

/**
 * UNION TYPE FOR ALL SIGNALS
 */
export type Signal = 
  | AnomalySignal 
  | NewDimensionSignal 
  | StructuralChangeSignal 
  | CrossCouplingSignal;

/**
 * SIGNAL CLASSIFICATION RESULT
 */
export interface SignalClassification {
  readonly signal: Signal;
  readonly classification: {
    readonly type: SignalType;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly urgency: 'immediate' | 'standard' | 'delayed';
    readonly verification_required: boolean;
  };
  readonly eligible_for_question_generation: boolean;
  readonly reason: string;
}

/**
 * WHAT SIGNALS ARE NOT
 * The oracle never reacts to these
 */
export const SIGNALS_ARE_NOT = [
  'headlines',
  'trends',
  'narratives',
  'shock_values',
  'opinions',
  'predictions',
  'speculation',
] as const;

/**
 * WHAT SIGNALS ARE
 * The oracle only reacts to these
 */
export const SIGNALS_ARE = [
  'measurable_change',
  'deviation_from_historical_interval',
  'new_data_dimension',
  'new_variable_combination',
] as const;

/**
 * Create an anomaly signal
 */
export function createAnomalySignal(
  variable: string,
  entity: string,
  entityType: 'country' | 'region' | 'municipality' | 'organization',
  sigma: number,
  direction: 'up' | 'down',
  currentValue: number,
  expectedRange: { min: number; max: number },
  source: string
): AnomalySignal {
  return {
    signal_id: `SIG-ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'anomaly',
    detected_at: new Date().toISOString(),
    source,
    confidence: Math.min(0.99, Math.abs(sigma) / 5),
    is_not: {
      headline: true,
      trend: true,
      narrative: true,
      shock_value: true,
    },
    is: {
      measurable_change: true,
      deviation_from_historical: true,
      new_data_dimension: false,
      new_variable_combination: false,
    },
    variable,
    entity,
    entity_type: entityType,
    deviation: {
      sigma,
      direction,
      baseline_period: 'rolling_5y',
      current_value: currentValue,
      expected_range: expectedRange,
    },
    question_template: 'trend_deviation',
  };
}

/**
 * Create a new dimension signal
 */
export function createNewDimensionSignal(
  dimensionType: 'new_dataset' | 'new_demographic' | 'new_geographic' | 'new_temporal',
  variable: string,
  scope: string,
  description: string,
  sourceOrg: string,
  source: string
): NewDimensionSignal {
  return {
    signal_id: `SIG-DIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'new_dimension',
    detected_at: new Date().toISOString(),
    source,
    confidence: 0.95,
    is_not: {
      headline: true,
      trend: true,
      narrative: true,
      shock_value: true,
    },
    is: {
      measurable_change: false,
      deviation_from_historical: false,
      new_data_dimension: true,
      new_variable_combination: false,
    },
    dimension_type: dimensionType,
    variable,
    scope,
    newly_available: {
      description,
      first_observation_date: new Date().toISOString(),
      coverage: scope,
      source_organization: sourceOrg,
    },
    epistemic_status: 'newly_observable',
    question_template: dimensionType === 'new_dataset' ? 'now_available' : 'expanded_coverage',
  };
}

/**
 * SIGNAL TYPE DESCRIPTIONS
 */
export const SIGNAL_TYPE_DESCRIPTIONS: Record<SignalType, string> = {
  anomaly: 'Statistical deviation from historical pattern',
  new_dimension: 'New data source, demographic, or geographic granularity',
  structural_change: 'Methodology, definition, or regulation change',
  cross_coupling: 'Previously separate datasets can now be linked',
} as const;
