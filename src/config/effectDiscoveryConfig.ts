/**
 * WAVE 6 — BLOCK AW: CAUSAL & EFFECT DISCOVERY ENGINE
 * 
 * Identifierar EFFEKTER utan att ljuga.
 * Inget ord som "orsak" utan metod.
 */

export type EffectType =
  | 'before_after'
  | 'trend_break'
  | 'historical_deviation'
  | 'difference_in_difference'
  | 'lagged_effect'
  | 'diminishing_effect'
  | 'amplifying_effect'
  | 'null_effect';

export interface EffectPrimitive {
  type: EffectType;
  label: string;
  description: string;
  requiredData: string[];
  minDataPoints: number;
  applicableScenarios: string[];
  limitations: string[];
}

export const EFFECT_PRIMITIVES: Record<EffectType, EffectPrimitive> = {
  before_after: {
    type: 'before_after',
    label: 'Före/efter-jämförelse',
    description: 'Jämför utfall före och efter en specifik händelse eller åtgärd',
    requiredData: ['outcome_variable', 'intervention_date'],
    minDataPoints: 24,
    applicableScenarios: ['policy_change', 'budget_allocation', 'regulation'],
    limitations: [
      'Kan inte kontrollera för samtidiga förändringar',
      'Kräver antagande om parallella trender',
      'Känslig för säsongsvariation'
    ]
  },
  trend_break: {
    type: 'trend_break',
    label: 'Trendbrott',
    description: 'Identifierar signifikant avvikelse från etablerad trend',
    requiredData: ['time_series', 'min_24_periods'],
    minDataPoints: 36,
    applicableScenarios: ['sudden_change', 'external_shock', 'policy_implementation'],
    limitations: [
      'Svårt att särskilja från naturlig variation',
      'Kräver stabil förtrend',
      'Multipla brott försvårar tolkning'
    ]
  },
  historical_deviation: {
    type: 'historical_deviation',
    label: 'Historisk avvikelse',
    description: 'Mäter avvikelse från historiskt genomsnitt eller mönster',
    requiredData: ['long_time_series', 'seasonal_adjustment'],
    minDataPoints: 60,
    applicableScenarios: ['anomaly_detection', 'performance_evaluation'],
    limitations: [
      'Historiska mönster kanske inte gäller',
      'Strukturella förändringar påverkar',
      'Kräver korrekt säsongsrensning'
    ]
  },
  difference_in_difference: {
    type: 'difference_in_difference',
    label: 'Skillnad-i-skillnad (DiD)',
    description: 'Jämför förändring i behandlad grupp med kontrollgrupp',
    requiredData: ['treatment_group', 'control_group', 'pre_post_data'],
    minDataPoints: 48,
    applicableScenarios: ['regional_policy', 'targeted_intervention'],
    limitations: [
      'Kräver valid kontrollgrupp',
      'Parallella trender måste antas',
      'Spillover-effekter kan snedvrida'
    ]
  },
  lagged_effect: {
    type: 'lagged_effect',
    label: 'Fördröjd effekt',
    description: 'Identifierar effekter som uppstår med tidsfördröjning',
    requiredData: ['intervention_date', 'time_series', 'lag_hypothesis'],
    minDataPoints: 36,
    applicableScenarios: ['education_policy', 'infrastructure_investment', 'prevention'],
    limitations: [
      'Svårt att bestämma korrekt lagg',
      'Mellanliggande faktorer',
      'Effekten kan avta innan mätning'
    ]
  },
  diminishing_effect: {
    type: 'diminishing_effect',
    label: 'Avtagande effekt',
    description: 'Mäter hur en initial effekt avtar över tid',
    requiredData: ['initial_effect', 'follow_up_series'],
    minDataPoints: 48,
    applicableScenarios: ['stimulus_programs', 'temporary_measures'],
    limitations: [
      'Svårt att särskilja från bakgrundstrend',
      'Halvtiden osäker',
      'Permanenta effekter kan missas'
    ]
  },
  amplifying_effect: {
    type: 'amplifying_effect',
    label: 'Förstärkande effekt',
    description: 'Identifierar när effekter växer över tid',
    requiredData: ['initial_effect', 'compounding_evidence'],
    minDataPoints: 36,
    applicableScenarios: ['network_effects', 'cumulative_impact'],
    limitations: [
      'Svårt att särskilja från positiv trend',
      'Takeffekter kan uppstå',
      'Mättnad kan inträffa'
    ]
  },
  null_effect: {
    type: 'null_effect',
    label: 'Utebliven effekt',
    description: 'Dokumenterar när förväntad effekt inte observeras',
    requiredData: ['intervention', 'expected_outcome', 'actual_outcome'],
    minDataPoints: 24,
    applicableScenarios: ['policy_evaluation', 'failed_intervention'],
    limitations: [
      'Kan bero på otillräcklig power',
      'Fel utfallsmått',
      'För kort uppföljningstid'
    ]
  }
};

export interface MethodologyTag {
  method: string;
  assumptions: string[];
  confidence: number;
  limitations: string[];
}

export interface DiscoveredEffect {
  id: string;
  effectType: EffectType;
  sourceAction?: string;
  targetKpi: string;
  magnitude: number;
  direction: 'positive' | 'negative' | 'neutral';
  timeLagMonths?: number;
  methodology: MethodologyTag;
  geoScope: string;
  timePeriod: {
    start: string;
    end: string;
  };
  validation: {
    pValue?: number;
    standardError?: number;
    replications: number;
    counterexamples: number;
  };
  isVerified: boolean;
}

export const CONFIDENCE_THRESHOLDS = {
  high: 0.85,
  moderate: 0.65,
  low: 0.45,
  preliminary: 0.25
};

export const REQUIRED_METHODOLOGY_FIELDS = [
  'method',
  'assumptions',
  'confidence',
  'limitations'
] as const;

/**
 * Validates that an effect has proper methodology tagging
 */
export function validateMethodologyTag(tag: MethodologyTag): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!tag.method || tag.method.trim() === '') missing.push('method');
  if (!tag.assumptions || tag.assumptions.length === 0) missing.push('assumptions');
  if (typeof tag.confidence !== 'number' || tag.confidence < 0 || tag.confidence > 1) missing.push('confidence');
  if (!tag.limitations || tag.limitations.length === 0) missing.push('limitations');
  
  return { valid: missing.length === 0, missing };
}

/**
 * Creates neutral language for effect descriptions
 */
export function describeEffect(effect: DiscoveredEffect): string {
  const direction = effect.direction === 'positive' ? 'ökning' : 
                    effect.direction === 'negative' ? 'minskning' : 'oförändrad';
  
  const confidence = effect.methodology.confidence >= CONFIDENCE_THRESHOLDS.high ? 'hög' :
                     effect.methodology.confidence >= CONFIDENCE_THRESHOLDS.moderate ? 'moderat' :
                     effect.methodology.confidence >= CONFIDENCE_THRESHOLDS.low ? 'låg' : 'preliminär';
  
  return `Observerad ${direction} (${Math.abs(effect.magnitude).toFixed(1)}%) med ${confidence} konfidens. ` +
         `Analysmetod: ${effect.methodology.method}.`;
}
