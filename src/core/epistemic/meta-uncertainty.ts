/**
 * META-UNCERTAINTY TRACKING
 * 
 * Beyond uncertainty in data, track uncertainty in:
 * - Measurement method
 * - Reporting culture
 * - Incentive changes
 * 
 * Extremely few systems do this.
 */

/**
 * META-UNCERTAINTY TYPES
 */
export type MetaUncertaintyType =
  | 'measurement_method'
  | 'reporting_culture'
  | 'incentive_structure'
  | 'definitional_ambiguity'
  | 'coverage_bias'
  | 'temporal_lag'
  | 'political_pressure';

/**
 * META-UNCERTAINTY RECORD
 */
export interface MetaUncertaintyRecord {
  id: string;
  node_id: string;
  uncertainty_type: MetaUncertaintyType;
  description: string;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  affected_periods: {
    start: string;
    end: string | null;
  };
  impact: {
    direction: 'underreporting' | 'overreporting' | 'distortion' | 'unknown';
    magnitude: 'minor' | 'moderate' | 'significant' | 'unknown';
    effect: string;
  };
  detection_method: string;
  mitigation_available: boolean;
  mitigation_description: string | null;
  created_at: string;
}

/**
 * CULTURAL SHIFT
 */
export interface CulturalShift {
  id: string;
  domain: string;
  description: string;
  approximate_date: string;
  affected_nodes: string[];
  impact_type: 'reporting_increase' | 'reporting_decrease' | 'category_shift';
  confidence: number;
}

/**
 * INCENTIVE CHANGE
 */
export interface IncentiveChange {
  id: string;
  description: string;
  effective_date: string;
  source: string;
  affected_nodes: string[];
  expected_effect: string;
  observed_effect: string | null;
}

/**
 * META-UNCERTAINTY ENGINE
 */
class MetaUncertaintyEngine {
  private records: MetaUncertaintyRecord[] = [];
  private culturalShifts: CulturalShift[] = [];
  private incentiveChanges: IncentiveChange[] = [];

  /**
   * REGISTER META-UNCERTAINTY
   */
  registerUncertainty(
    record: Omit<MetaUncertaintyRecord, 'id' | 'created_at'>
  ): MetaUncertaintyRecord {
    const full: MetaUncertaintyRecord = {
      ...record,
      id: `MU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    
    this.records.push(full);
    return full;
  }

  /**
   * REGISTER CULTURAL SHIFT
   */
  registerCulturalShift(shift: Omit<CulturalShift, 'id'>): CulturalShift {
    const full: CulturalShift = {
      ...shift,
      id: `CS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.culturalShifts.push(full);
    
    // Auto-create meta-uncertainty records for affected nodes
    for (const nodeId of shift.affected_nodes) {
      this.registerUncertainty({
        node_id: nodeId,
        uncertainty_type: 'reporting_culture',
        description: `Cultural shift: ${shift.description}`,
        risk_level: 'moderate',
        affected_periods: {
          start: shift.approximate_date,
          end: null,
        },
        impact: {
          direction: shift.impact_type === 'reporting_increase' ? 'overreporting' : 
                     shift.impact_type === 'reporting_decrease' ? 'underreporting' : 'distortion',
          magnitude: 'moderate',
          effect: `Trend may reflect ${shift.impact_type} rather than reality change`,
        },
        detection_method: 'cultural_analysis',
        mitigation_available: false,
        mitigation_description: null,
      });
    }
    
    return full;
  }

  /**
   * REGISTER INCENTIVE CHANGE
   */
  registerIncentiveChange(change: Omit<IncentiveChange, 'id'>): IncentiveChange {
    const full: IncentiveChange = {
      ...change,
      id: `IC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.incentiveChanges.push(full);
    
    // Auto-create meta-uncertainty records
    for (const nodeId of change.affected_nodes) {
      this.registerUncertainty({
        node_id: nodeId,
        uncertainty_type: 'incentive_structure',
        description: `Incentive change: ${change.description}`,
        risk_level: 'high',
        affected_periods: {
          start: change.effective_date,
          end: null,
        },
        impact: {
          direction: 'distortion',
          magnitude: 'significant',
          effect: change.expected_effect,
        },
        detection_method: 'policy_tracking',
        mitigation_available: false,
        mitigation_description: null,
      });
    }
    
    return full;
  }

  /**
   * GET UNCERTAINTIES FOR NODE
   */
  getUncertaintiesForNode(nodeId: string): MetaUncertaintyRecord[] {
    return this.records.filter(r => r.node_id === nodeId);
  }

  /**
   * GET CRITICAL UNCERTAINTIES
   */
  getCriticalUncertainties(): MetaUncertaintyRecord[] {
    return this.records.filter(r => r.risk_level === 'critical');
  }

  /**
   * GET UNCERTAINTIES BY TYPE
   */
  getUncertaintiesByType(type: MetaUncertaintyType): MetaUncertaintyRecord[] {
    return this.records.filter(r => r.uncertainty_type === type);
  }

  /**
   * ASSESS NODE RELIABILITY
   */
  assessNodeReliability(nodeId: string): {
    reliability_score: number;
    factors: string[];
    recommendations: string[];
  } {
    const uncertainties = this.getUncertaintiesForNode(nodeId);
    
    if (uncertainties.length === 0) {
      return {
        reliability_score: 0.9,
        factors: ['No known meta-uncertainties'],
        recommendations: [],
      };
    }
    
    // Calculate score
    let score = 1.0;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    for (const u of uncertainties) {
      switch (u.risk_level) {
        case 'critical':
          score -= 0.3;
          factors.push(`Critical: ${u.description}`);
          recommendations.push('Consider alternative data sources');
          break;
        case 'high':
          score -= 0.2;
          factors.push(`High risk: ${u.description}`);
          break;
        case 'moderate':
          score -= 0.1;
          factors.push(`Moderate: ${u.description}`);
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    }
    
    return {
      reliability_score: Math.max(0.1, score),
      factors,
      recommendations,
    };
  }

  /**
   * GENERATE REPORT
   */
  generateReport(nodeId: string): string {
    const uncertainties = this.getUncertaintiesForNode(nodeId);
    const reliability = this.assessNodeReliability(nodeId);
    
    const lines = [
      `META-UNCERTAINTY REPORT: ${nodeId}`,
      '═'.repeat(50),
      '',
      `Reliability Score: ${(reliability.reliability_score * 100).toFixed(0)}%`,
      '',
    ];
    
    if (uncertainties.length === 0) {
      lines.push('No meta-uncertainties detected.');
    } else {
      lines.push('Detected Meta-Uncertainties:');
      lines.push('');
      
      for (const u of uncertainties) {
        lines.push(`• [${u.risk_level.toUpperCase()}] ${u.uncertainty_type}`);
        lines.push(`  ${u.description}`);
        lines.push(`  Impact: ${u.impact.effect}`);
        lines.push(`  Period: ${u.affected_periods.start} → ${u.affected_periods.end || 'ongoing'}`);
        lines.push('');
      }
    }
    
    if (reliability.recommendations.length > 0) {
      lines.push('Recommendations:');
      for (const rec of reliability.recommendations) {
        lines.push(`  → ${rec}`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_records: number;
    by_type: Record<MetaUncertaintyType, number>;
    cultural_shifts: number;
    incentive_changes: number;
  } {
    const byType: Record<MetaUncertaintyType, number> = {
      measurement_method: 0,
      reporting_culture: 0,
      incentive_structure: 0,
      definitional_ambiguity: 0,
      coverage_bias: 0,
      temporal_lag: 0,
      political_pressure: 0,
    };
    
    for (const r of this.records) {
      byType[r.uncertainty_type]++;
    }
    
    return {
      total_records: this.records.length,
      by_type: byType,
      cultural_shifts: this.culturalShifts.length,
      incentive_changes: this.incentiveChanges.length,
    };
  }
}

/**
 * SINGLETON
 */
export const metaUncertainty = new MetaUncertaintyEngine();

/**
 * PRINCIPLES
 */
export const META_UNCERTAINTY_PRINCIPLES = {
  track_measurement_uncertainty: true,
  track_cultural_shifts: true,
  track_incentive_changes: true,
  affects_reliability_score: true,
  extremely_rare_capability: true,
} as const;
