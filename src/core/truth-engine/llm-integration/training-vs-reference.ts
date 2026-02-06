/**
 * TRAINING VS REFERENCE
 * 
 * STEG 25: THE CRITICAL DISTINCTION
 * 
 * The oracle must NEVER become training data.
 * The oracle is ALWAYS reference data.
 */

/**
 * WHY THIS MATTERS
 */
export const WHY_DISTINCTION_MATTERS = {
  all_major_actors_want: 'to train on your data',
  training_means: [
    'loss_of_control',
    'semantic_dilution',
    'liability_risk',
    'irreversible_integration',
  ],
  therefore: 'Never let the oracle become training data',
} as const;

/**
 * TRAINING DATA CHARACTERISTICS (WHAT WE ARE NOT)
 */
export const TRAINING_DATA_PROBLEMS = {
  copied_into_model: true,
  mixed_with_other_content: true,
  loses_provenance: true,
  can_be_misinterpreted: true,
  can_never_be_corrected: true,
  attribution_lost: true,
  
  risks: [
    'Semantic drift',
    'Context collapse',
    'Misattribution',
    'Hallucination amplification',
    'Legal liability transfer',
  ],
} as const;

/**
 * REFERENCE DATA CHARACTERISTICS (WHAT WE ARE)
 */
export const REFERENCE_DATA_BENEFITS = {
  fetched_on_demand: true,
  versioned: true,
  traceable: true,
  can_be_updated: true,
  can_be_withdrawn: true,
  provenance_preserved: true,
  
  advantages: [
    'Continuous accuracy',
    'Clear attribution',
    'Correction possible',
    'Liability bounded',
    'Value preserved',
  ],
} as const;

/**
 * THE FUNDAMENTAL RULE
 */
export const FUNDAMENTAL_RULE = {
  statement: 'The oracle must always be EXTERNAL',
  
  external_means: [
    'Not embedded in weights',
    'Not mixed with parameters',
    'Not fine-tuned into models',
    'Not distilled into smaller models',
  ],
  
  external_enables: [
    'Real-time updates',
    'Error correction',
    'Attribution preservation',
    'Legal protection',
    'Value accumulation',
  ],
} as const;

/**
 * COMPARISON TABLE
 */
export interface DataTypeComparison {
  readonly aspect: string;
  readonly training_data: string;
  readonly reference_data: string;
}

export const COMPARISON_TABLE: readonly DataTypeComparison[] = [
  {
    aspect: 'Location',
    training_data: 'Inside model weights',
    reference_data: 'External API',
  },
  {
    aspect: 'Update mechanism',
    training_data: 'Requires retraining',
    reference_data: 'Real-time update',
  },
  {
    aspect: 'Error correction',
    training_data: 'Impossible after training',
    reference_data: 'Immediate correction possible',
  },
  {
    aspect: 'Attribution',
    training_data: 'Lost in aggregation',
    reference_data: 'Preserved per-query',
  },
  {
    aspect: 'Provenance',
    training_data: 'Untraceable',
    reference_data: 'Full chain of custody',
  },
  {
    aspect: 'Liability',
    training_data: 'Transferred to model operator',
    reference_data: 'Bounded to accuracy claims',
  },
  {
    aspect: 'Value over time',
    training_data: 'Degrades (stale)',
    reference_data: 'Accumulates (fresh)',
  },
  {
    aspect: 'Control',
    training_data: 'None after release',
    reference_data: 'Full, continuous',
  },
];
