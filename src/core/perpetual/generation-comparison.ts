/**
 * GENERATION-OVER-GENERATION COMPARISON ENGINE
 * 
 * 5, 10, 25, 50 year comparisons.
 * Same ontology, same contracts, visible uncertainty.
 */

/**
 * COMPARISON HORIZON
 */
export type ComparisonHorizon = 5 | 10 | 25 | 50;

/**
 * GENERATION COMPARISON
 */
export interface GenerationComparison {
  comparison_id: string;
  horizon_years: ComparisonHorizon;
  base_year: number;
  comparison_year: number;
  generated_at: string;
  
  // Ontology alignment
  ontology_version_base: string;
  ontology_version_comparison: string;
  ontology_compatible: boolean;
  
  // Domain comparisons
  domain_comparisons: DomainComparison[];
  
  // Overall assessment
  structural_changes: StructuralChange[];
  continuity_score: number;  // 0-1
  uncertainty_in_comparison: number;  // 0-1
  
  // Caveats
  caveats: string[];
  methodology_changes: string[];
}

/**
 * DOMAIN COMPARISON
 */
export interface DomainComparison {
  domain: string;
  comparable: boolean;
  incomparability_reason: string | null;
  
  // If comparable
  key_indicators_changed: IndicatorChange[];
  structural_shift_detected: boolean;
  shift_description: string | null;
}

/**
 * INDICATOR CHANGE
 */
export interface IndicatorChange {
  indicator_id: string;
  indicator_name: string;
  base_value: number | null;
  comparison_value: number | null;
  change_percent: number | null;
  change_direction: 'up' | 'down' | 'stable' | 'unknown';
  structural: boolean;
  confidence: number;
}

/**
 * STRUCTURAL CHANGE
 */
export interface StructuralChange {
  domain: string;
  change_type: 'regime_shift' | 'trend_reversal' | 'volatility_change' | 'level_shift';
  description: string;
  occurred_approximately: string;
  confidence: number;
}

/**
 * COMPARISON ENGINE
 */
class GenerationComparisonEngine {
  private comparisons: GenerationComparison[] = [];

  /**
   * GENERATE COMPARISON
   */
  generateComparison(config: {
    horizon: ComparisonHorizon;
    base_year: number;
    domains: string[];
    indicators: Array<{
      domain: string;
      indicator_id: string;
      indicator_name: string;
      values: Record<number, number | null>;
    }>;
    ontology_versions: Record<number, string>;
  }): GenerationComparison {
    const comparisonYear = config.base_year + config.horizon;
    const baseOntology = config.ontology_versions[config.base_year] || 'unknown';
    const compOntology = config.ontology_versions[comparisonYear] || 'unknown';
    
    const domainComparisons: DomainComparison[] = config.domains.map(domain => {
      const domainIndicators = config.indicators.filter(i => i.domain === domain);
      
      const changes: IndicatorChange[] = domainIndicators.map(ind => {
        const baseVal = ind.values[config.base_year];
        const compVal = ind.values[comparisonYear];
        
        let changePercent: number | null = null;
        let direction: IndicatorChange['change_direction'] = 'unknown';
        
        if (baseVal !== null && compVal !== null && baseVal !== 0) {
          changePercent = ((compVal - baseVal) / Math.abs(baseVal)) * 100;
          direction = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable';
        }
        
        return {
          indicator_id: ind.indicator_id,
          indicator_name: ind.indicator_name,
          base_value: baseVal,
          comparison_value: compVal,
          change_percent: changePercent !== null ? Math.round(changePercent * 10) / 10 : null,
          change_direction: direction,
          structural: Math.abs(changePercent || 0) > 30,
          confidence: baseVal !== null && compVal !== null ? 0.9 : 0.3,
        };
      });
      
      const structuralShifts = changes.filter(c => c.structural);
      
      return {
        domain,
        comparable: domainIndicators.length > 0,
        incomparability_reason: domainIndicators.length === 0 ? 'No indicators available' : null,
        key_indicators_changed: changes,
        structural_shift_detected: structuralShifts.length > 0,
        shift_description: structuralShifts.length > 0 
          ? `${structuralShifts.length} indicator(s) show structural change`
          : null,
      };
    });
    
    const structuralChanges: StructuralChange[] = domainComparisons
      .filter(dc => dc.structural_shift_detected)
      .map(dc => ({
        domain: dc.domain,
        change_type: 'level_shift' as const,
        description: dc.shift_description || 'Structural change detected',
        occurred_approximately: `${config.base_year}-${comparisonYear}`,
        confidence: 0.7,
      }));
    
    const comparison: GenerationComparison = {
      comparison_id: `GENCOMP:${config.horizon}Y:${config.base_year}`,
      horizon_years: config.horizon,
      base_year: config.base_year,
      comparison_year: comparisonYear,
      generated_at: new Date().toISOString(),
      
      ontology_version_base: baseOntology,
      ontology_version_comparison: compOntology,
      ontology_compatible: baseOntology === compOntology,
      
      domain_comparisons: domainComparisons,
      structural_changes: structuralChanges,
      
      continuity_score: this.calculateContinuity(domainComparisons),
      uncertainty_in_comparison: baseOntology !== compOntology ? 0.3 : 0.1,
      
      caveats: this.generateCaveats(config.horizon, baseOntology !== compOntology),
      methodology_changes: baseOntology !== compOntology 
        ? [`Ontology changed from ${baseOntology} to ${compOntology}`]
        : [],
    };
    
    this.comparisons.push(comparison);
    return comparison;
  }

  /**
   * CALCULATE CONTINUITY
   */
  private calculateContinuity(domains: DomainComparison[]): number {
    const comparable = domains.filter(d => d.comparable);
    if (comparable.length === 0) return 0;
    
    const nonStructural = comparable.filter(d => !d.structural_shift_detected);
    return nonStructural.length / comparable.length;
  }

  /**
   * GENERATE CAVEATS
   */
  private generateCaveats(horizon: ComparisonHorizon, ontologyChanged: boolean): string[] {
    const caveats: string[] = [];
    
    if (horizon >= 25) {
      caveats.push('Long-range comparisons subject to methodological drift');
    }
    if (horizon >= 50) {
      caveats.push('Institutional and definitional changes likely over this period');
    }
    if (ontologyChanged) {
      caveats.push('Ontology versions differ; some concepts may not align perfectly');
    }
    
    caveats.push('All comparisons use same base methodology where possible');
    caveats.push('Uncertainty increases with time horizon');
    
    return caveats;
  }

  /**
   * GET AVAILABLE HORIZONS
   */
  getAvailableHorizons(): ComparisonHorizon[] {
    return [5, 10, 25, 50];
  }

  /**
   * GET COMPARISONS
   */
  getComparisons(): GenerationComparison[] {
    return this.comparisons;
  }
}

/**
 * SINGLETON INSTANCE
 */
export const generationComparisonEngine = new GenerationComparisonEngine();

/**
 * COMPARISON PRINCIPLES
 */
export const COMPARISON_PRINCIPLES = {
  same_ontology: true,
  same_contracts: true,
  visible_uncertainty: true,
  invaluable_for_historians: true,
  invaluable_for_ai: true,
  invaluable_for_institutions: true,
  horizons: [5, 10, 25, 50] as const,
} as const;
