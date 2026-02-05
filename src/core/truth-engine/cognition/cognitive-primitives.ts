/**
 * HUMAN COGNITION ALIGNMENT LAYER (HCAL)
 * 
 * Core insight: Humans don't understand the world in tables.
 * They understand it in mental models: contrast, normality, change, impact.
 * 
 * HCAL makes ST-OS speak the brain's language without losing precision.
 */

/**
 * COGNITIVE PRIMITIVES (LOCKED)
 * 
 * All views, explanations, and depth-steps MUST use at least one of these.
 * If something cannot be explained via these → it is not shown.
 */
export type CognitivePrimitive = 
  | 'baseline'      // What is normal?
  | 'deviation'     // What deviates?
  | 'direction'     // Where is it moving?
  | 'magnitude'     // How big is it?
  | 'persistence'   // How long does it last?
  | 'coupling'      // What hangs together?
  | 'uncertainty';  // What don't we know?

/**
 * PRIMITIVE DEFINITIONS (LOCKED)
 */
export const COGNITIVE_PRIMITIVE_DEFINITIONS = {
  baseline: {
    id: 'baseline',
    question: 'What is normal?',
    description: 'Historical or reference range against which current state is compared',
    examples: ['10-year average', 'pre-crisis level', 'peer group median'],
    required_data: ['historical_series', 'reference_period'],
  },
  deviation: {
    id: 'deviation',
    question: 'What deviates?',
    description: 'How current state differs from baseline',
    examples: ['2σ above mean', '15% below trend', 'outside normal range'],
    required_data: ['current_value', 'baseline_value', 'standard_deviation'],
  },
  direction: {
    id: 'direction',
    question: 'Where is it moving?',
    description: 'Trajectory of change over time',
    examples: ['increasing', 'decreasing', 'stable', 'accelerating', 'decelerating'],
    required_data: ['time_series', 'trend_calculation'],
  },
  magnitude: {
    id: 'magnitude',
    question: 'How big is it?',
    description: 'Size of effect or population affected',
    examples: ['affects 500,000 people', '3% of GDP', 'moderate effect size'],
    required_data: ['absolute_value', 'denominator', 'scale_reference'],
  },
  persistence: {
    id: 'persistence',
    question: 'How long does it last?',
    description: 'Temporal stability of the pattern',
    examples: ['seasonal', 'multi-year trend', 'structural shift'],
    required_data: ['duration', 'stability_score'],
  },
  coupling: {
    id: 'coupling',
    question: 'What hangs together?',
    description: 'Relationships with other indicators or systems',
    examples: ['correlates with X', 'part of syndrome Y', 'affects system Z'],
    required_data: ['correlation_matrix', 'causal_graph'],
  },
  uncertainty: {
    id: 'uncertainty',
    question: 'What don\'t we know?',
    description: 'Limits of knowledge, data gaps, confidence bounds',
    examples: ['self-report bias', 'missing data for region X', 'CI: 95%'],
    required_data: ['confidence_interval', 'data_gaps', 'methodology_limits'],
  },
} as const;

/**
 * PRIMITIVE CHECK
 * Validates that content uses at least one cognitive primitive
 */
export interface PrimitiveUsage {
  readonly primitive: CognitivePrimitive;
  readonly present: boolean;
  readonly value?: string | number;
  readonly confidence?: number;
}

export function checkPrimitiveUsage(content: Record<string, unknown>): {
  valid: boolean;
  primitives_used: CognitivePrimitive[];
  missing_required: CognitivePrimitive[];
} {
  const primitives_used: CognitivePrimitive[] = [];
  
  const primitiveFields: Record<CognitivePrimitive, string[]> = {
    baseline: ['baseline', 'historical_average', 'normal_range', 'reference'],
    deviation: ['deviation', 'difference', 'delta', 'change_from_baseline'],
    direction: ['direction', 'trend', 'trajectory', 'movement'],
    magnitude: ['magnitude', 'size', 'scale', 'population_affected', 'absolute_value'],
    persistence: ['persistence', 'duration', 'stability', 'temporal_pattern'],
    coupling: ['coupling', 'correlation', 'relationship', 'connected_to', 'couplings'],
    uncertainty: ['uncertainty', 'confidence', 'data_gaps', 'limitations', 'unknown'],
  };

  for (const [primitive, fields] of Object.entries(primitiveFields)) {
    for (const field of fields) {
      if (content[field] !== undefined && content[field] !== null) {
        primitives_used.push(primitive as CognitivePrimitive);
        break;
      }
    }
  }

  return {
    valid: primitives_used.length > 0,
    primitives_used: [...new Set(primitives_used)],
    missing_required: [], // All primitives are optional, but at least one required
  };
}

/**
 * ATTENTION MARKERS
 * Guides attention without manipulation
 */
export type AttentionMarker = 'structural' | 'acute' | 'background';

export const ATTENTION_MARKERS = {
  structural: {
    symbol: '🧱',
    label: 'Structural',
    description: 'Slow, deep forces — long-term systemic patterns',
    typical_persistence: 'years to decades',
    attention_weight: 0.8,
  },
  acute: {
    symbol: '⚡',
    label: 'Acute',
    description: 'Temporary but important changes — recent deviations',
    typical_persistence: 'weeks to months',
    attention_weight: 0.6,
  },
  background: {
    symbol: '🌊',
    label: 'Background',
    description: 'Normal variation — does not require focus',
    typical_persistence: 'seasonal or cyclical',
    attention_weight: 0.2,
  },
} as const;

/**
 * CLASSIFY ATTENTION
 */
export function classifyAttention(
  persistence: number,  // 0-1, higher = more persistent
  deviation: number,    // standard deviations from baseline
  system_impact: number // 0-1
): AttentionMarker {
  if (persistence > 0.7 && system_impact > 0.5) {
    return 'structural';
  }
  if (deviation > 1.5 || (deviation > 1 && system_impact > 0.3)) {
    return 'acute';
  }
  return 'background';
}
