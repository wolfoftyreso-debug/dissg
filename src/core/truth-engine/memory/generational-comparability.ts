/**
 * GENERATIONAL COMPARABILITY
 * 
 * The system can always answer:
 * - What was normal then?
 * - How did this look over 5, 10, 30 years?
 * - When did definitions change?
 * - When did uncertainty increase?
 * 
 * This is historical intelligence, not just data.
 */

/**
 * GENERATIONAL COMPARISON
 */
export interface GenerationalComparison {
  readonly comparison_id: string;
  readonly indicator_id: string;
  readonly generated_at: string;
  
  // Time periods
  readonly periods: GenerationalPeriod[];
  
  // Changes over time
  readonly definition_changes: DefinitionChange[];
  readonly methodology_changes: MethodologyChange[];
  readonly uncertainty_evolution: UncertaintyEvolution[];
  
  // Comparability assessment
  readonly comparability: ComparabilityAssessment;
}

/**
 * GENERATIONAL PERIOD
 */
export interface GenerationalPeriod {
  readonly period_id: string;
  readonly label: string;
  readonly start_year: number;
  readonly end_year: number;
  readonly normal_range: { min: number; max: number };
  readonly mean_value: number;
  readonly volatility: number;
  readonly data_quality: 'high' | 'medium' | 'low' | 'reconstructed';
  readonly notes: string[];
}

/**
 * DEFINITION CHANGE
 */
export interface DefinitionChange {
  readonly change_id: string;
  readonly effective_date: string;
  readonly what_changed: string;
  readonly previous_definition: string;
  readonly new_definition: string;
  readonly impact_on_comparability: 'breaking' | 'significant' | 'minor' | 'none';
  readonly adjustment_factor?: number;
  readonly source: string;
}

/**
 * METHODOLOGY CHANGE
 */
export interface MethodologyChange {
  readonly change_id: string;
  readonly effective_date: string;
  readonly description: string;
  readonly reason: string;
  readonly impact_on_values: 'increases' | 'decreases' | 'mixed' | 'unknown';
  readonly estimated_magnitude?: number;
}

/**
 * UNCERTAINTY EVOLUTION
 */
export interface UncertaintyEvolution {
  readonly period: string;
  readonly confidence_level: number;
  readonly data_coverage: number;
  readonly methodology_stability: number;
  readonly notes: string;
}

/**
 * COMPARABILITY ASSESSMENT
 */
export interface ComparabilityAssessment {
  readonly fully_comparable_periods: string[][];
  readonly comparable_with_adjustment: string[][];
  readonly not_comparable: string[][];
  readonly overall_score: number; // 0-1
  readonly warnings: string[];
  readonly recommendations: string[];
}

/**
 * CREATE GENERATIONAL COMPARISON
 */
export function createGenerationalComparison(
  indicator_id: string,
  periods: GenerationalPeriod[],
  definition_changes: DefinitionChange[],
  methodology_changes: MethodologyChange[]
): GenerationalComparison {
  // Assess comparability
  const comparability = assessComparability(periods, definition_changes);
  
  // Calculate uncertainty evolution
  const uncertainty_evolution = periods.map(p => ({
    period: p.label,
    confidence_level: p.data_quality === 'high' ? 0.9 : 
                      p.data_quality === 'medium' ? 0.7 : 
                      p.data_quality === 'low' ? 0.5 : 0.3,
    data_coverage: p.data_quality === 'reconstructed' ? 0.5 : 0.9,
    methodology_stability: countMethodologyChanges(methodology_changes, p.start_year, p.end_year) === 0 ? 1.0 : 0.7,
    notes: p.data_quality === 'reconstructed' ? 'Values are estimates based on historical reconstruction' : '',
  }));
  
  return {
    comparison_id: `gc_${indicator_id}_${Date.now()}`,
    indicator_id,
    generated_at: new Date().toISOString(),
    periods,
    definition_changes,
    methodology_changes,
    uncertainty_evolution,
    comparability,
  };
}

/**
 * ASSESS COMPARABILITY
 */
function assessComparability(
  periods: GenerationalPeriod[],
  changes: DefinitionChange[]
): ComparabilityAssessment {
  const periodLabels = periods.map(p => p.label);
  const fullyComparable: string[][] = [];
  const withAdjustment: string[][] = [];
  const notComparable: string[][] = [];
  
  // Check each pair of periods
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const p1 = periods[i];
      const p2 = periods[j];
      
      // Find breaking changes between periods
      const breakingChanges = changes.filter(c => {
        const changeYear = new Date(c.effective_date).getFullYear();
        return changeYear > p1.start_year && 
               changeYear <= p2.end_year && 
               c.impact_on_comparability === 'breaking';
      });
      
      const significantChanges = changes.filter(c => {
        const changeYear = new Date(c.effective_date).getFullYear();
        return changeYear > p1.start_year && 
               changeYear <= p2.end_year && 
               c.impact_on_comparability === 'significant';
      });
      
      if (breakingChanges.length > 0) {
        notComparable.push([p1.label, p2.label]);
      } else if (significantChanges.length > 0 || p1.data_quality === 'reconstructed' || p2.data_quality === 'reconstructed') {
        withAdjustment.push([p1.label, p2.label]);
      } else {
        fullyComparable.push([p1.label, p2.label]);
      }
    }
  }
  
  const total = fullyComparable.length + withAdjustment.length + notComparable.length;
  const score = total > 0 ? (fullyComparable.length + withAdjustment.length * 0.5) / total : 0;
  
  const warnings: string[] = [];
  if (notComparable.length > 0) {
    warnings.push(`${notComparable.length} period pairs cannot be directly compared due to definition changes`);
  }
  if (periods.some(p => p.data_quality === 'reconstructed')) {
    warnings.push('Some periods use reconstructed data with higher uncertainty');
  }
  
  return {
    fully_comparable_periods: fullyComparable,
    comparable_with_adjustment: withAdjustment,
    not_comparable: notComparable,
    overall_score: score,
    warnings,
    recommendations: [
      'Always note definition change dates when comparing across periods',
      'Use adjustment factors when available',
      'Report uncertainty ranges for reconstructed periods',
    ],
  };
}

function countMethodologyChanges(changes: MethodologyChange[], startYear: number, endYear: number): number {
  return changes.filter(c => {
    const year = new Date(c.effective_date).getFullYear();
    return year >= startYear && year <= endYear;
  }).length;
}

/**
 * QUERY HISTORICAL NORMAL
 */
export interface HistoricalNormal {
  readonly indicator_id: string;
  readonly query_year: number;
  readonly normal_range: { min: number; max: number };
  readonly mean: number;
  readonly based_on_period: string;
  readonly data_quality: string;
  readonly confidence: number;
  readonly caveats: string[];
}

export function queryHistoricalNormal(
  comparison: GenerationalComparison,
  year: number
): HistoricalNormal | null {
  // Find the period containing this year
  const period = comparison.periods.find(
    p => year >= p.start_year && year <= p.end_year
  );
  
  if (!period) {
    return null;
  }
  
  const caveats: string[] = [];
  if (period.data_quality === 'reconstructed') {
    caveats.push('Values are historical estimates');
  }
  
  // Check for methodology changes in this period
  const changes = comparison.methodology_changes.filter(c => {
    const changeYear = new Date(c.effective_date).getFullYear();
    return changeYear >= period.start_year && changeYear <= period.end_year;
  });
  
  if (changes.length > 0) {
    caveats.push(`${changes.length} methodology change(s) occurred in this period`);
  }
  
  return {
    indicator_id: comparison.indicator_id,
    query_year: year,
    normal_range: period.normal_range,
    mean: period.mean_value,
    based_on_period: period.label,
    data_quality: period.data_quality,
    confidence: period.data_quality === 'high' ? 0.9 : 
                period.data_quality === 'medium' ? 0.7 : 
                period.data_quality === 'low' ? 0.5 : 0.3,
    caveats,
  };
}
