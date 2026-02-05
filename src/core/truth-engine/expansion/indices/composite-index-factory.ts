/**
 * COMPOSITE INDEX FACTORY
 * 
 * This is where value explodes - but only if indices are honest.
 * 
 * All indices:
 * - Are transparent
 * - Have open weights
 * - Can be decomposed
 * - Can be criticized
 * 
 * That makes them strong.
 */

/**
 * INDEX COMPONENT
 */
export interface IndexComponent {
  readonly measure_id: string;
  readonly name: string;
  readonly weight: number;           // 0-1, must sum to 1 within index
  readonly direction: 'higher_better' | 'lower_better' | 'neutral';
  readonly normalization: 'z_score' | 'min_max' | 'percentile';
  readonly source_id: string;
  readonly update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

/**
 * COMPOSITE INDEX DEFINITION
 */
export interface CompositeIndexDefinition {
  readonly index_id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly category: IndexCategory;
  readonly components: readonly IndexComponent[];
  readonly aggregation_method: 'weighted_average' | 'geometric_mean' | 'harmonic_mean';
  readonly update_schedule: string;
  readonly geographic_scope: 'global' | 'regional' | 'national' | 'local';
  readonly methodology_url: string;
  readonly limitations: readonly string[];
}

/**
 * INDEX CATEGORY
 */
export type IndexCategory = 
  | 'societal'
  | 'economic'
  | 'health'
  | 'environmental'
  | 'institutional'
  | 'stability';

/**
 * COMPUTED INDEX VALUE
 */
export interface ComputedIndexValue {
  readonly index_id: string;
  readonly computed_at: string;
  readonly period: string;
  readonly geographic_code: string;
  readonly composite_value: number;       // 0-100 normalized
  readonly component_values: readonly ComponentValue[];
  readonly confidence: number;            // 0-1
  readonly data_coverage: number;         // 0-1
  readonly warnings: readonly string[];
}

/**
 * COMPONENT VALUE
 */
export interface ComponentValue {
  readonly measure_id: string;
  readonly raw_value: number;
  readonly normalized_value: number;      // 0-100
  readonly weighted_contribution: number; // To final index
  readonly data_age_days: number;
  readonly source_id: string;
}

/**
 * MASTER INDEX DEFINITIONS
 */
export const MASTER_INDICES: Record<string, CompositeIndexDefinition> = {
  societal_stress: {
    index_id: 'societal_stress',
    name: 'Societal Stress Index',
    description: 'Measures aggregate stress indicators across population',
    version: '1.0.0',
    category: 'societal',
    components: [
      { measure_id: 'sick_leave_rate', name: 'Sick Leave Rate', weight: 0.25, direction: 'lower_better', normalization: 'z_score', source_id: 'national_statistics', update_frequency: 'monthly' },
      { measure_id: 'sleep_deprivation', name: 'Sleep Deprivation Prevalence', weight: 0.20, direction: 'lower_better', normalization: 'z_score', source_id: 'health_surveys', update_frequency: 'yearly' },
      { measure_id: 'mental_health_prevalence', name: 'Mental Health Issues Prevalence', weight: 0.30, direction: 'lower_better', normalization: 'z_score', source_id: 'who', update_frequency: 'yearly' },
      { measure_id: 'work_intensity', name: 'Work Intensity Index', weight: 0.25, direction: 'lower_better', normalization: 'z_score', source_id: 'eurostat', update_frequency: 'yearly' },
    ],
    aggregation_method: 'weighted_average',
    update_schedule: 'monthly',
    geographic_scope: 'national',
    methodology_url: '/methodology/societal-stress-index',
    limitations: [
      'Self-reported data may underestimate true prevalence',
      'Work intensity definitions vary by country',
      'Mental health stigma affects reporting rates',
    ],
  },
  
  system_stability: {
    index_id: 'system_stability',
    name: 'System Stability Index',
    description: 'Measures institutional and societal stability signals',
    version: '1.0.0',
    category: 'stability',
    components: [
      { measure_id: 'news_volatility', name: 'News Flow Volatility', weight: 0.20, direction: 'lower_better', normalization: 'z_score', source_id: 'media_analysis', update_frequency: 'daily' },
      { measure_id: 'policy_change_rate', name: 'Policy Change Frequency', weight: 0.20, direction: 'neutral', normalization: 'z_score', source_id: 'government_data', update_frequency: 'monthly' },
      { measure_id: 'economic_volatility', name: 'Economic Volatility', weight: 0.25, direction: 'lower_better', normalization: 'z_score', source_id: 'central_bank', update_frequency: 'monthly' },
      { measure_id: 'institutional_trust', name: 'Institutional Trust Level', weight: 0.35, direction: 'higher_better', normalization: 'z_score', source_id: 'eurobarometer', update_frequency: 'yearly' },
    ],
    aggregation_method: 'weighted_average',
    update_schedule: 'weekly',
    geographic_scope: 'national',
    methodology_url: '/methodology/system-stability-index',
    limitations: [
      'Trust surveys have sampling limitations',
      'Policy change counting is methodology-dependent',
      'News volatility may reflect media dynamics, not real instability',
    ],
  },
  
  healthcare_load: {
    index_id: 'healthcare_load',
    name: 'Healthcare Load Index',
    description: 'Measures pressure on healthcare system',
    version: '1.0.0',
    category: 'health',
    components: [
      { measure_id: 'wait_times', name: 'Average Wait Times', weight: 0.30, direction: 'lower_better', normalization: 'z_score', source_id: 'hospital_stats', update_frequency: 'weekly' },
      { measure_id: 'bed_occupancy', name: 'Bed Occupancy Rate', weight: 0.25, direction: 'neutral', normalization: 'min_max', source_id: 'hospital_stats', update_frequency: 'daily' },
      { measure_id: 'staff_turnover', name: 'Staff Turnover Rate', weight: 0.20, direction: 'lower_better', normalization: 'z_score', source_id: 'employment_data', update_frequency: 'quarterly' },
      { measure_id: 'referral_volume', name: 'Referral Volume Trend', weight: 0.25, direction: 'neutral', normalization: 'z_score', source_id: 'health_registry', update_frequency: 'monthly' },
    ],
    aggregation_method: 'weighted_average',
    update_schedule: 'weekly',
    geographic_scope: 'regional',
    methodology_url: '/methodology/healthcare-load-index',
    limitations: [
      'Private healthcare not always included',
      'Regional reporting standards vary',
      'Seasonal patterns may not be fully adjusted',
    ],
  },
  
  environmental_pressure: {
    index_id: 'environmental_pressure',
    name: 'Environmental Pressure Index',
    description: 'Measures environmental stress and resource use',
    version: '1.0.0',
    category: 'environmental',
    components: [
      { measure_id: 'emissions_intensity', name: 'Emissions Intensity', weight: 0.30, direction: 'lower_better', normalization: 'z_score', source_id: 'environment_agency', update_frequency: 'yearly' },
      { measure_id: 'resource_consumption', name: 'Resource Consumption Rate', weight: 0.25, direction: 'lower_better', normalization: 'z_score', source_id: 'eurostat', update_frequency: 'yearly' },
      { measure_id: 'extreme_events', name: 'Extreme Weather Events', weight: 0.25, direction: 'lower_better', normalization: 'z_score', source_id: 'weather_service', update_frequency: 'monthly' },
      { measure_id: 'regional_vulnerability', name: 'Regional Vulnerability Score', weight: 0.20, direction: 'lower_better', normalization: 'min_max', source_id: 'climate_research', update_frequency: 'yearly' },
    ],
    aggregation_method: 'geometric_mean',
    update_schedule: 'monthly',
    geographic_scope: 'regional',
    methodology_url: '/methodology/environmental-pressure-index',
    limitations: [
      'Historical baselines affect trend interpretation',
      'Extreme event attribution has uncertainty',
      'Regional boundaries may not match ecosystem boundaries',
    ],
  },
};

/**
 * COMPOSITE INDEX ENGINE
 */
export class CompositeIndexEngine {
  private definitions: Map<string, CompositeIndexDefinition> = new Map();
  private computedValues: Map<string, ComputedIndexValue[]> = new Map();
  
  constructor() {
    // Load master indices
    for (const [id, def] of Object.entries(MASTER_INDICES)) {
      this.definitions.set(id, def);
    }
  }
  
  /**
   * Get index definition
   */
  getDefinition(indexId: string): CompositeIndexDefinition | null {
    return this.definitions.get(indexId) || null;
  }
  
  /**
   * Compute index value from component inputs
   */
  compute(
    indexId: string, 
    componentInputs: Record<string, number>,
    geoCode: string
  ): ComputedIndexValue | null {
    const definition = this.definitions.get(indexId);
    if (!definition) return null;
    
    const componentValues: ComponentValue[] = [];
    const warnings: string[] = [];
    let totalWeight = 0;
    let weightedSum = 0;
    
    for (const component of definition.components) {
      const rawValue = componentInputs[component.measure_id];
      if (rawValue === undefined) {
        warnings.push(`Missing data for ${component.name}`);
        continue;
      }
      
      // Normalize value (simplified - real implementation uses historical data)
      const normalized = this.normalize(rawValue, component.normalization);
      
      // Apply direction
      const directionAdjusted = component.direction === 'lower_better' 
        ? 100 - normalized 
        : normalized;
      
      const contribution = directionAdjusted * component.weight;
      
      componentValues.push({
        measure_id: component.measure_id,
        raw_value: rawValue,
        normalized_value: normalized,
        weighted_contribution: contribution,
        data_age_days: 0, // Would be calculated from actual data
        source_id: component.source_id,
      });
      
      weightedSum += contribution;
      totalWeight += component.weight;
    }
    
    // Calculate composite value
    const coverage = totalWeight / definition.components.reduce((s, c) => s + c.weight, 0);
    const compositeValue = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    const result: ComputedIndexValue = {
      index_id: indexId,
      computed_at: new Date().toISOString(),
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      geographic_code: geoCode,
      composite_value: Math.round(compositeValue * 100) / 100,
      component_values: componentValues,
      confidence: coverage * 0.9, // Confidence scales with coverage
      data_coverage: coverage,
      warnings,
    };
    
    // Store result
    const key = `${indexId}:${geoCode}`;
    const existing = this.computedValues.get(key) || [];
    this.computedValues.set(key, [...existing, result].slice(-100));
    
    return result;
  }
  
  /**
   * Get decomposition (for transparency)
   */
  decompose(indexId: string, geoCode: string): IndexDecomposition | null {
    const definition = this.definitions.get(indexId);
    const key = `${indexId}:${geoCode}`;
    const values = this.computedValues.get(key);
    
    if (!definition || !values || values.length === 0) return null;
    
    const latest = values[values.length - 1];
    
    return {
      index: definition,
      latest_value: latest,
      component_breakdown: latest.component_values.map(cv => ({
        name: definition.components.find(c => c.measure_id === cv.measure_id)?.name || cv.measure_id,
        weight: definition.components.find(c => c.measure_id === cv.measure_id)?.weight || 0,
        raw_value: cv.raw_value,
        normalized_value: cv.normalized_value,
        contribution_percent: (cv.weighted_contribution / latest.composite_value) * 100,
      })),
      methodology: definition.methodology_url,
      limitations: definition.limitations,
      criticizable: true,
    };
  }
  
  /**
   * List all indices
   */
  listIndices(): readonly CompositeIndexDefinition[] {
    return Array.from(this.definitions.values());
  }
  
  private normalize(value: number, method: 'z_score' | 'min_max' | 'percentile'): number {
    // Simplified normalization (real implementation uses historical distributions)
    switch (method) {
      case 'z_score':
        // Convert z-score to 0-100 scale (assuming mean=0, std=1)
        return Math.min(100, Math.max(0, 50 + value * 15));
      case 'min_max':
        // Assume value is already 0-100 or 0-1
        return value > 1 ? value : value * 100;
      case 'percentile':
        return Math.min(100, Math.max(0, value));
      default:
        return value;
    }
  }
}

/**
 * INDEX DECOMPOSITION (for transparency)
 */
export interface IndexDecomposition {
  readonly index: CompositeIndexDefinition;
  readonly latest_value: ComputedIndexValue;
  readonly component_breakdown: readonly {
    name: string;
    weight: number;
    raw_value: number;
    normalized_value: number;
    contribution_percent: number;
  }[];
  readonly methodology: string;
  readonly limitations: readonly string[];
  readonly criticizable: boolean; // Always true
}

/**
 * INDEX TRANSPARENCY RULES
 */
export const INDEX_TRANSPARENCY_RULES = {
  all_indices_are_transparent: true,
  weights_are_public: true,
  can_be_decomposed: true,
  can_be_criticized: true,
  this_makes_them_strong: true,
} as const;
