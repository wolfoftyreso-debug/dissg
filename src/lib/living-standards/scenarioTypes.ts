/**
 * Scenario Lab Types
 * For exploring historical relationships without making predictions
 */

import type { HumanBaseLayerIndicators } from './types';

/**
 * Adjustable parameters in the scenario lab
 */
export interface ScenarioParameters {
  investmentLevel: number;      // 0-100 relative scale
  educationLevel: number;       // 0-100 relative scale
  urbanizationRate: number;     // 0-100 percentage
  energyAccess: number;         // 0-100 percentage
  fertilityRate: number;        // 0-10 births per woman
  tradeOpenness: number;        // 0-100 relative scale
  // Demographics (read-only context)
  populationSize: number;
  populationGrowthRate: number;
  medianAge: number;
}

/**
 * A scenario result - always a RANGE, never a point
 */
export interface ScenarioOutcome {
  parametersUsed: Partial<ScenarioParameters>;
  
  // Possible outcome ranges (not predictions!)
  outcomeRanges: {
    indicatorId: keyof HumanBaseLayerIndicators;
    currentValue: number;
    lowEstimate: number;
    midEstimate: number;
    highEstimate: number;
    confidenceBand: number; // How wide the uncertainty is (%)
    yearsToEffect: { min: number; max: number };
  }[];
  
  // Historical analogues that informed this
  historicalAnalogues: HistoricalAnalogue[];
  
  // What the data does NOT cover
  limitations: string[];
  
  // Explicit assumptions
  assumptions: string[];
}

/**
 * A historical case similar to current parameters
 */
export interface HistoricalAnalogue {
  countryCode: string;
  countryName: string;
  periodStart: number;
  periodEnd: number;
  
  // How similar this case was
  similarityScore: number; // 0-100
  similarityDimensions: {
    dimension: string;
    matchQuality: 'high' | 'medium' | 'low';
  }[];
  
  // What actually happened
  outcomes: {
    indicatorId: keyof HumanBaseLayerIndicators;
    startValue: number;
    endValue: number;
    changePercent: number;
    yearsElapsed: number;
  }[];
  
  // Context that may have influenced outcomes
  contextFactors: string[];
}

/**
 * Find countries with similar profiles at a given time
 */
export interface SimilarCountryQuery {
  referenceCountry: string;
  referenceYear: number;
  
  // Which dimensions to match on
  matchDimensions: (keyof HumanBaseLayerIndicators | 'population' | 'geography')[];
  
  // Tolerance for matching
  tolerance: 'strict' | 'moderate' | 'loose';
}

export interface SimilarCountryResult {
  query: SimilarCountryQuery;
  
  matches: {
    countryCode: string;
    countryName: string;
    matchYear: number;
    
    // How well it matched at the reference point
    overallSimilarity: number;
    dimensionMatches: {
      dimension: string;
      referenceValue: number;
      matchValue: number;
      deviation: number;
    }[];
    
    // What happened afterward (the trajectory)
    trajectory: {
      indicatorId: keyof HumanBaseLayerIndicators;
      values: { year: number; value: number }[];
      netChange: number;
      yearsTracked: number;
    }[];
    
    // Key divergence points
    divergences: {
      year: number;
      description: string;
      indicatorsAffected: (keyof HumanBaseLayerIndicators)[];
    }[];
  }[];
  
  // What patterns emerged across similar countries
  observedPatterns: ObservedPattern[];
}

/**
 * An observed pattern - NEVER a recommendation
 */
export interface ObservedPattern {
  id: string;
  
  // Neutral, factual statement
  statement: string; // e.g., "Countries that experienced X also tended to see Y"
  
  // Statistical backing
  support: {
    countriesObserved: number;
    timePeriod: { start: number; end: number };
    correlationStrength: 'strong' | 'moderate' | 'weak';
    exceptions: number;
    exceptionExamples: string[];
  };
  
  // Uncertainty and caveats
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    reasons: string[];
  };
  
  // What this pattern does NOT show
  limitations: string[];
  
  // Conditions under which pattern was observed
  conditions: string[];
}

/**
 * Language rules for scenario descriptions
 * Enforces non-normative, non-predictive language
 */
export const SCENARIO_LANGUAGE_RULES = {
  // Words that are BLOCKED
  forbidden: [
    'should', 'must', 'better', 'worse', 'optimal', 'best', 'recommended',
    'will', 'predict', 'forecast', 'guarantee', 'ensure', 'leads to',
    'causes', 'results in', 'success', 'failure', 'borde', 'måste',
    'bättre', 'sämre', 'optimal', 'bäst', 'rekommenderas', 'kommer att',
    'förutsäger', 'garanterar', 'leder till', 'orsakar', 'framgång', 'misslyckande'
  ],
  
  // Approved neutral phrasings
  approved: {
    association: 'observerades tillsammans med',
    tendency: 'tenderade att',
    pattern: 'mönster observerat i',
    range: 'historiskt intervall',
    uncertainty: 'osäkerhet kvarstår kring',
    noData: 'data saknas för',
    limitation: 'denna analys täcker inte'
  }
} as const;

/**
 * Validate that a statement uses neutral language
 */
export function validateNeutralLanguage(statement: string): {
  isValid: boolean;
  violations: string[];
} {
  const lowercased = statement.toLowerCase();
  const violations: string[] = [];
  
  for (const forbidden of SCENARIO_LANGUAGE_RULES.forbidden) {
    if (lowercased.includes(forbidden.toLowerCase())) {
      violations.push(`Blockerat ord: "${forbidden}"`);
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}
