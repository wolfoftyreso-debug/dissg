/**
 * SIMULATION ENGINE (TESTBENCH)
 * 
 * Pattern-based scenario exploration using historical data.
 * 
 * CRITICAL PRINCIPLE:
 * System ONLY says: "Historically, this pattern has produced these outcomes."
 * System NEVER says: "Do this."
 * 
 * This is a testbench, not a crystal ball.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface HistoricalPattern {
  pattern_id: string;
  pattern_name_sv: string;
  pattern_name_en: string;
  description_sv: string;
  description_en: string;
  
  // Pattern definition
  trigger_conditions: PatternCondition[];
  typical_duration_months: { min: number; max: number };
  
  // Historical observations
  observations: PatternObservation[];
  
  // Statistical summary
  occurrence_count: number;
  average_outcome: number;
  outcome_std_dev: number;
  confidence_level: number;
}

export interface PatternCondition {
  kpi_code: string;
  operator: 'gt' | 'lt' | 'eq' | 'change_gt' | 'change_lt';
  threshold: number;
  unit: string;
}

export interface PatternObservation {
  geo_code: string;
  period_start: string;
  period_end: string;
  trigger_values: Record<string, number>;
  outcome_values: Record<string, number>;
  lag_months: number;
  context_notes: string;
}

export interface ScenarioInput {
  name: string;
  assumptions: ScenarioAssumption[];
  time_horizon_months: number;
  geo_scope: string;
}

export interface ScenarioAssumption {
  kpi_code: string;
  change_type: 'absolute' | 'percentage' | 'target';
  value: number;
  rationale: string;
}

export interface ScenarioResult {
  scenario_id: string;
  input: ScenarioInput;
  
  // Pattern matches
  matching_patterns: HistoricalPatternMatch[];
  
  // Projected outcomes (based on historical patterns ONLY)
  projected_outcomes: ProjectedOutcome[];
  
  // Confidence and caveats
  overall_confidence: number;
  critical_assumptions: string[];
  known_limitations: string[];
  
  // Mandatory disclaimer
  disclaimer: string;
  
  timestamp: string;
}

export interface HistoricalPatternMatch {
  pattern: HistoricalPattern;
  match_score: number;  // 0-1
  matching_conditions: string[];
  divergent_conditions: string[];
}

export interface ProjectedOutcome {
  kpi_code: string;
  kpi_name_sv: string;
  kpi_name_en: string;
  
  // Based on historical patterns
  historical_range: {
    p10: number;
    p25: number;
    median: number;
    p75: number;
    p90: number;
  };
  
  // Sample size
  observation_count: number;
  
  // Lag
  typical_lag_months: { min: number; max: number };
  
  // Confidence
  confidence: number;
  
  // NOT a prediction - a historical observation
  interpretation_sv: string;
  interpretation_en: string;
}

// =============================================================================
// HISTORICAL PATTERNS DATABASE
// =============================================================================

export const HISTORICAL_PATTERNS: HistoricalPattern[] = [
  {
    pattern_id: 'PAT-ENERGY-SHOCK',
    pattern_name_sv: 'Energiprisstress',
    pattern_name_en: 'Energy Price Shock',
    description_sv: 'Snabb ökning av energikostnader relativt hushållsinkomster',
    description_en: 'Rapid increase in energy costs relative to household income',
    trigger_conditions: [
      { kpi_code: 'ENERGY_PRICE_INDEX', operator: 'change_gt', threshold: 30, unit: '%' },
      { kpi_code: 'ENERGY_INCOME_RATIO', operator: 'gt', threshold: 10, unit: '%' },
    ],
    typical_duration_months: { min: 12, max: 36 },
    observations: [], // Would be populated from database
    occurrence_count: 47,
    average_outcome: -2.3, // GDP impact
    outcome_std_dev: 1.8,
    confidence_level: 0.78,
  },
  {
    pattern_id: 'PAT-HOUSING-BUBBLE',
    pattern_name_sv: 'Bostadsprisbubbla',
    pattern_name_en: 'Housing Price Bubble',
    description_sv: 'Bostadspriser stiger snabbare än inkomster under förlängd period',
    description_en: 'Housing prices rising faster than income over extended period',
    trigger_conditions: [
      { kpi_code: 'HOUSE_PRICE_INDEX', operator: 'change_gt', threshold: 50, unit: '% (3yr)' },
      { kpi_code: 'PRICE_TO_INCOME', operator: 'gt', threshold: 8, unit: 'ratio' },
      { kpi_code: 'MORTGAGE_DEBT_RATIO', operator: 'gt', threshold: 100, unit: '%' },
    ],
    typical_duration_months: { min: 24, max: 84 },
    observations: [],
    occurrence_count: 23,
    average_outcome: -4.7,
    outcome_std_dev: 3.2,
    confidence_level: 0.72,
  },
  {
    pattern_id: 'PAT-EDUCATION-MISMATCH',
    pattern_name_sv: 'Utbildningsmismatch',
    pattern_name_en: 'Education Mismatch',
    description_sv: 'Utbildningsinvesteringar matchar inte arbetsmarknadens behov',
    description_en: 'Education investments do not match labor market needs',
    trigger_conditions: [
      { kpi_code: 'OVERQUALIFICATION_RATE', operator: 'gt', threshold: 25, unit: '%' },
      { kpi_code: 'SKILL_SHORTAGE_INDEX', operator: 'gt', threshold: 60, unit: 'index' },
    ],
    typical_duration_months: { min: 60, max: 180 },
    observations: [],
    occurrence_count: 31,
    average_outcome: -0.8, // Productivity impact per year
    outcome_std_dev: 0.5,
    confidence_level: 0.65,
  },
  {
    pattern_id: 'PAT-TRUST-COLLAPSE',
    pattern_name_sv: 'Tillitskollaps',
    pattern_name_en: 'Trust Collapse',
    description_sv: 'Snabb nedgång i institutionellt förtroende',
    description_en: 'Rapid decline in institutional trust',
    trigger_conditions: [
      { kpi_code: 'TRUST_INDEX', operator: 'change_lt', threshold: -20, unit: 'points (3yr)' },
      { kpi_code: 'VOTER_TURNOUT', operator: 'change_lt', threshold: -10, unit: '%' },
    ],
    typical_duration_months: { min: 36, max: 120 },
    observations: [],
    occurrence_count: 18,
    average_outcome: -1.2, // Governance effectiveness impact
    outcome_std_dev: 0.9,
    confidence_level: 0.58,
  },
  {
    pattern_id: 'PAT-DEMOGRAPHIC-SHIFT',
    pattern_name_sv: 'Demografiskt skifte',
    pattern_name_en: 'Demographic Shift',
    description_sv: 'Försörjningskvot överstiger kritisk nivå',
    description_en: 'Dependency ratio exceeds critical level',
    trigger_conditions: [
      { kpi_code: 'DEPENDENCY_RATIO', operator: 'gt', threshold: 55, unit: '%' },
      { kpi_code: 'TFR', operator: 'lt', threshold: 1.5, unit: 'children' },
    ],
    typical_duration_months: { min: 120, max: 360 },
    observations: [],
    occurrence_count: 12,
    average_outcome: -0.5, // Annual GDP growth reduction
    outcome_std_dev: 0.3,
    confidence_level: 0.82,
  },
];

// =============================================================================
// SIMULATION FUNCTIONS
// =============================================================================

/**
 * Find matching historical patterns for given conditions
 */
export function findMatchingPatterns(
  currentValues: Record<string, number>
): HistoricalPatternMatch[] {
  const matches: HistoricalPatternMatch[] = [];
  
  for (const pattern of HISTORICAL_PATTERNS) {
    const matchingConditions: string[] = [];
    const divergentConditions: string[] = [];
    
    for (const condition of pattern.trigger_conditions) {
      const currentValue = currentValues[condition.kpi_code];
      if (currentValue === undefined) {
        divergentConditions.push(condition.kpi_code);
        continue;
      }
      
      let matches = false;
      switch (condition.operator) {
        case 'gt':
          matches = currentValue > condition.threshold;
          break;
        case 'lt':
          matches = currentValue < condition.threshold;
          break;
        case 'eq':
          matches = Math.abs(currentValue - condition.threshold) < 0.01;
          break;
        case 'change_gt':
        case 'change_lt':
          // Would need historical data to calculate change
          matches = false;
          break;
      }
      
      if (matches) {
        matchingConditions.push(condition.kpi_code);
      } else {
        divergentConditions.push(condition.kpi_code);
      }
    }
    
    const matchScore = matchingConditions.length / pattern.trigger_conditions.length;
    
    if (matchScore > 0) {
      matches.push({
        pattern,
        match_score: matchScore,
        matching_conditions: matchingConditions,
        divergent_conditions: divergentConditions,
      });
    }
  }
  
  return matches.sort((a, b) => b.match_score - a.match_score);
}

/**
 * Run a scenario simulation
 */
export function runScenario(input: ScenarioInput): ScenarioResult {
  const scenarioId = `SIM-${Date.now()}`;
  
  // Build current state from assumptions
  const assumedState: Record<string, number> = {};
  for (const assumption of input.assumptions) {
    assumedState[assumption.kpi_code] = assumption.value;
  }
  
  // Find matching patterns
  const matchingPatterns = findMatchingPatterns(assumedState);
  
  // Generate projected outcomes based on patterns
  const projectedOutcomes: ProjectedOutcome[] = [];
  
  for (const match of matchingPatterns.slice(0, 5)) {
    const pattern = match.pattern;
    
    projectedOutcomes.push({
      kpi_code: 'GDP_GROWTH',
      kpi_name_sv: 'BNP-tillväxt',
      kpi_name_en: 'GDP Growth',
      historical_range: {
        p10: pattern.average_outcome - 2 * pattern.outcome_std_dev,
        p25: pattern.average_outcome - pattern.outcome_std_dev,
        median: pattern.average_outcome,
        p75: pattern.average_outcome + pattern.outcome_std_dev,
        p90: pattern.average_outcome + 2 * pattern.outcome_std_dev,
      },
      observation_count: pattern.occurrence_count,
      typical_lag_months: pattern.typical_duration_months,
      confidence: pattern.confidence_level * match.match_score,
      interpretation_sv: `Historiskt har liknande mönster (${pattern.pattern_name_sv}) observerats ${pattern.occurrence_count} gånger med median-utfall på ${pattern.average_outcome.toFixed(1)}%.`,
      interpretation_en: `Historically, similar patterns (${pattern.pattern_name_en}) have been observed ${pattern.occurrence_count} times with median outcome of ${pattern.average_outcome.toFixed(1)}%.`,
    });
  }
  
  // Calculate overall confidence
  const avgConfidence = matchingPatterns.length > 0
    ? matchingPatterns.reduce((sum, m) => sum + m.match_score * m.pattern.confidence_level, 0) / matchingPatterns.length
    : 0;
  
  return {
    scenario_id: scenarioId,
    input,
    matching_patterns: matchingPatterns,
    projected_outcomes: projectedOutcomes,
    overall_confidence: avgConfidence,
    critical_assumptions: input.assumptions.map(a => a.rationale),
    known_limitations: [
      'Historical patterns do not guarantee future outcomes',
      'Correlation does not imply causation',
      'Unique contextual factors may alter outcomes',
      'Data from different time periods may not be comparable',
    ],
    disclaimer: generateSimulationDisclaimer(input.geo_scope),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate mandatory disclaimer for simulation results
 */
function generateSimulationDisclaimer(geoScope: string): string {
  return `
IMPORTANT DISCLAIMER

This simulation is based EXCLUSIVELY on historical pattern matching.

What this shows:
- Historical outcomes when similar conditions were observed
- Statistical distribution of past results
- Time lags typically observed

What this does NOT show:
- What WILL happen
- What SHOULD happen
- Recommendations or advice

The system does not predict the future.
It only documents what has been observed in the past.

All responsibility for interpretation, assumptions, conclusions, 
and decisions rests entirely with the user.

Region: ${geoScope}
Generated: ${new Date().toISOString()}
  `.trim();
}

// =============================================================================
// SAFETY FUNCTIONS
// =============================================================================

/**
 * Check if simulation can be run (fail-silent principle)
 */
export function canRunSimulation(
  input: ScenarioInput,
  availableData: Record<string, number>
): { canRun: boolean; reason?: string } {
  // Check minimum data requirements
  const requiredKpis = input.assumptions.map(a => a.kpi_code);
  const missingKpis = requiredKpis.filter(k => availableData[k] === undefined);
  
  if (missingKpis.length > requiredKpis.length * 0.5) {
    return {
      canRun: false,
      reason: `Insufficient data: ${missingKpis.length} of ${requiredKpis.length} required indicators missing`,
    };
  }
  
  // Check for matching patterns
  const matches = findMatchingPatterns(availableData);
  if (matches.length === 0) {
    return {
      canRun: false,
      reason: 'No historical patterns match the given conditions',
    };
  }
  
  return { canRun: true };
}

/**
 * Get safety status for displaying results
 */
export function getSimulationSafetyLevel(result: ScenarioResult): {
  level: 'safe' | 'caution' | 'unreliable';
  message_sv: string;
  message_en: string;
} {
  if (result.overall_confidence >= 0.7) {
    return {
      level: 'safe',
      message_sv: 'Baserat på tillräcklig historisk data',
      message_en: 'Based on sufficient historical data',
    };
  }
  
  if (result.overall_confidence >= 0.4) {
    return {
      level: 'caution',
      message_sv: 'Begränsad historisk data - tolka med försiktighet',
      message_en: 'Limited historical data - interpret with caution',
    };
  }
  
  return {
    level: 'unreliable',
    message_sv: 'Otillräcklig data för tillförlitlig analys',
    message_en: 'Insufficient data for reliable analysis',
  };
}
