/**
 * AUTOMATIC MENTAL MODEL BUILDER
 * 
 * For every topic, the system builds a mental map that allows
 * immediate understanding without summary or conclusion.
 */

import { CognitivePrimitive, AttentionMarker, classifyAttention } from './cognitive-primitives';

/**
 * MENTAL MODEL STRUCTURE
 */
export interface MentalModel {
  readonly topic_id: string;
  readonly topic_label: string;
  readonly generated_at: string;
  
  // Core primitives
  readonly baseline: BaselineState;
  readonly current_state: CurrentState;
  readonly direction: DirectionState;
  readonly persistence: PersistenceState;
  readonly couplings: CouplingState[];
  readonly uncertainty: UncertaintyState;
  
  // Meta
  readonly attention_marker: AttentionMarker;
  readonly primitives_used: CognitivePrimitive[];
  readonly confidence: number;
}

/**
 * BASELINE STATE
 */
export interface BaselineState {
  readonly type: 'historical_average' | 'peer_comparison' | 'target' | 'pre_event';
  readonly value: number;
  readonly unit: string;
  readonly period: string;
  readonly description: string;
}

/**
 * CURRENT STATE
 */
export interface CurrentState {
  readonly value: number;
  readonly unit: string;
  readonly as_of: string;
  readonly relation_to_baseline: 'above' | 'below' | 'within' | 'at';
  readonly deviation_magnitude: number; // Standard deviations
  readonly percentile?: number;
}

/**
 * DIRECTION STATE
 */
export interface DirectionState {
  readonly trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  readonly velocity: 'accelerating' | 'decelerating' | 'constant';
  readonly since: string;
  readonly confidence: number;
}

/**
 * PERSISTENCE STATE
 */
export interface PersistenceState {
  readonly pattern: 'transient' | 'seasonal' | 'cyclical' | 'multi_year' | 'structural';
  readonly duration_months: number;
  readonly stability_score: number; // 0-1
  readonly expected_duration?: string;
}

/**
 * COUPLING STATE
 */
export interface CouplingState {
  readonly coupled_with: string;
  readonly relationship: 'correlates' | 'co_occurs' | 'precedes' | 'follows';
  readonly strength: number; // 0-1
  readonly mechanism_known: boolean;
  readonly note?: string;
}

/**
 * UNCERTAINTY STATE
 */
export interface UncertaintyState {
  readonly confidence_level: number; // 0-1
  readonly data_quality: 'high' | 'medium' | 'low';
  readonly known_biases: string[];
  readonly data_gaps: string[];
  readonly methodology_notes: string[];
}

/**
 * BUILD MENTAL MODEL
 */
export function buildMentalModel(params: {
  topic_id: string;
  topic_label: string;
  current_value: number;
  baseline_value: number;
  baseline_std: number;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  persistence_months: number;
  couplings: Array<{ name: string; strength: number }>;
  uncertainties: string[];
  data_quality: 'high' | 'medium' | 'low';
}): MentalModel {
  const deviation = (params.current_value - params.baseline_value) / params.baseline_std;
  const persistence_score = Math.min(params.persistence_months / 36, 1); // Normalize to 3 years
  const system_impact = params.couplings.reduce((sum, c) => sum + c.strength, 0) / Math.max(params.couplings.length, 1);
  
  const attention_marker = classifyAttention(persistence_score, Math.abs(deviation), system_impact);
  
  return {
    topic_id: params.topic_id,
    topic_label: params.topic_label,
    generated_at: new Date().toISOString(),
    
    baseline: {
      type: 'historical_average',
      value: params.baseline_value,
      unit: params.unit,
      period: 'historical norm',
      description: `Historical average: ${params.baseline_value} ${params.unit}`,
    },
    
    current_state: {
      value: params.current_value,
      unit: params.unit,
      as_of: new Date().toISOString().split('T')[0],
      relation_to_baseline: deviation > 0.5 ? 'above' : deviation < -0.5 ? 'below' : 'within',
      deviation_magnitude: Math.round(deviation * 100) / 100,
    },
    
    direction: {
      trend: params.trend,
      velocity: 'constant',
      since: new Date(Date.now() - params.persistence_months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      confidence: params.data_quality === 'high' ? 0.9 : params.data_quality === 'medium' ? 0.7 : 0.5,
    },
    
    persistence: {
      pattern: params.persistence_months > 24 ? 'structural' : params.persistence_months > 12 ? 'multi_year' : 'transient',
      duration_months: params.persistence_months,
      stability_score: persistence_score,
    },
    
    couplings: params.couplings.map(c => ({
      coupled_with: c.name,
      relationship: 'correlates' as const,
      strength: c.strength,
      mechanism_known: false,
    })),
    
    uncertainty: {
      confidence_level: params.data_quality === 'high' ? 0.85 : params.data_quality === 'medium' ? 0.65 : 0.45,
      data_quality: params.data_quality,
      known_biases: params.uncertainties.filter(u => u.includes('bias')),
      data_gaps: params.uncertainties.filter(u => u.includes('missing') || u.includes('gap')),
      methodology_notes: params.uncertainties.filter(u => !u.includes('bias') && !u.includes('missing')),
    },
    
    attention_marker,
    primitives_used: ['baseline', 'deviation', 'direction', 'persistence', 'coupling', 'uncertainty'],
    confidence: params.data_quality === 'high' ? 0.85 : params.data_quality === 'medium' ? 0.65 : 0.45,
  };
}

/**
 * FORMAT MENTAL MODEL FOR DISPLAY
 */
export function formatMentalModelSummary(model: MentalModel): string {
  const marker = model.attention_marker === 'structural' ? '🧱' : 
                 model.attention_marker === 'acute' ? '⚡' : '🌊';
  
  const direction = model.direction.trend === 'increasing' ? '↑' :
                    model.direction.trend === 'decreasing' ? '↓' : '→';
  
  return `${marker} ${model.topic_label}: ${model.current_state.value} ${model.current_state.unit} (${model.current_state.relation_to_baseline} baseline) ${direction}`;
}
