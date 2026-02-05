/**
 * UNIVERSAL IMPORTANCE ENGINE (UIE)
 * 
 * This is what no one else has.
 * 
 * UIE always answers three questions — mechanically:
 * 1. What is structurally important?
 * 2. What is acutely relevant right now?
 * 3. What is contextual noise?
 * 
 * This is not valuation. It is system impact.
 */

/**
 * IMPORTANCE CLASSIFICATION
 */
export type ImportanceClass = 'structural' | 'acute' | 'contextual' | 'emerging';

/**
 * IMPORTANCE FACTORS (HOW UIE CALCULATES)
 */
export interface ImportanceFactors {
  readonly system_impact: number;        // 0-1: affects other systems
  readonly historical_deviation: number; // Standard deviations from baseline
  readonly population_reach: number;     // 0-1: fraction affected
  readonly temporal_persistence: number; // 0-1: stable over time
  readonly cross_domain_links: number;   // Count of connected domains
}

/**
 * IMPORTANCE SCORE
 */
export interface ImportanceScore {
  readonly indicator_id: string;
  readonly classification: ImportanceClass;
  readonly composite_score: number; // 0-100
  readonly factors: ImportanceFactors;
  readonly rationale: string;
  readonly evidence_basis: string[];
}

/**
 * IMPORTANCE THRESHOLDS (LOCKED)
 */
export const IMPORTANCE_THRESHOLDS = {
  structural: {
    min_composite: 70,
    min_persistence: 0.7,
    min_system_impact: 0.5,
    description: 'Long-term, systemic, affects many',
  },
  acute: {
    min_composite: 50,
    min_deviation: 1.5, // Standard deviations
    description: 'Recent deviation, requires attention',
  },
  emerging: {
    min_composite: 30,
    min_deviation: 1.0,
    max_persistence: 0.3, // Still new
    description: 'New pattern, insufficient data',
  },
  contextual: {
    max_composite: 30,
    description: 'Normal variation, noise, seasonal',
  },
} as const;

/**
 * IMPORTANCE WEIGHTS (DEFAULT, TRANSPARENT)
 */
export const IMPORTANCE_WEIGHTS = {
  system_impact: 0.30,
  historical_deviation: 0.25,
  population_reach: 0.20,
  temporal_persistence: 0.15,
  cross_domain_links: 0.10,
} as const;

/**
 * CALCULATE IMPORTANCE SCORE
 */
export function calculateImportance(factors: ImportanceFactors): ImportanceScore {
  const composite = Math.round(
    factors.system_impact * IMPORTANCE_WEIGHTS.system_impact * 100 +
    Math.min(factors.historical_deviation / 3, 1) * IMPORTANCE_WEIGHTS.historical_deviation * 100 +
    factors.population_reach * IMPORTANCE_WEIGHTS.population_reach * 100 +
    factors.temporal_persistence * IMPORTANCE_WEIGHTS.temporal_persistence * 100 +
    Math.min(factors.cross_domain_links / 5, 1) * IMPORTANCE_WEIGHTS.cross_domain_links * 100
  );

  let classification: ImportanceClass;
  let rationale: string;

  if (composite >= IMPORTANCE_THRESHOLDS.structural.min_composite &&
      factors.temporal_persistence >= IMPORTANCE_THRESHOLDS.structural.min_persistence) {
    classification = 'structural';
    rationale = 'Persistent systemic factor affecting multiple systems';
  } else if (composite >= IMPORTANCE_THRESHOLDS.acute.min_composite &&
             factors.historical_deviation >= IMPORTANCE_THRESHOLDS.acute.min_deviation) {
    classification = 'acute';
    rationale = 'Recent significant deviation from baseline';
  } else if (composite >= IMPORTANCE_THRESHOLDS.emerging.min_composite &&
             factors.temporal_persistence <= IMPORTANCE_THRESHOLDS.emerging.max_persistence!) {
    classification = 'emerging';
    rationale = 'New pattern detected, requires observation';
  } else {
    classification = 'contextual';
    rationale = 'Within normal variation range';
  }

  const evidence: string[] = [];
  if (factors.system_impact > 0.5) evidence.push('High system impact');
  if (factors.historical_deviation > 2) evidence.push('Deviation exceeds 2σ');
  if (factors.population_reach > 0.3) evidence.push('Affects >30% of population');
  if (factors.cross_domain_links > 3) evidence.push('Connected to multiple domains');

  return {
    indicator_id: '', // Set by caller
    classification,
    composite_score: composite,
    factors,
    rationale,
    evidence_basis: evidence,
  };
}

/**
 * IMPORTANCE MAP (DOMAIN-LEVEL OUTPUT)
 */
export interface ImportanceMap {
  readonly domain: string;
  readonly generated_at: string;
  readonly structural: readonly ImportanceScore[];
  readonly acute: readonly ImportanceScore[];
  readonly emerging: readonly ImportanceScore[];
  readonly contextual_summary: string;
  readonly methodology_note: string;
}

/**
 * GENERATE IMPORTANCE MAP
 */
export function generateImportanceMap(
  domain: string,
  scores: ImportanceScore[]
): ImportanceMap {
  return {
    domain,
    generated_at: new Date().toISOString(),
    structural: scores.filter(s => s.classification === 'structural'),
    acute: scores.filter(s => s.classification === 'acute'),
    emerging: scores.filter(s => s.classification === 'emerging'),
    contextual_summary: `${scores.filter(s => s.classification === 'contextual').length} indicators within normal range`,
    methodology_note: 'Importance calculated from system impact, deviation, reach, persistence, and cross-domain links. Not recommendations.',
  };
}

/**
 * UIE OUTPUT FORMAT (MACHINE-READABLE)
 */
export interface UIEOutput {
  readonly importance: {
    readonly structural: readonly string[];
    readonly acute: readonly string[];
    readonly contextual: readonly string[];
  };
  readonly domain: string;
  readonly timestamp: string;
  readonly methodology: string;
}

/**
 * FORMAT UIE OUTPUT
 */
export function formatUIEOutput(map: ImportanceMap): UIEOutput {
  return {
    importance: {
      structural: map.structural.map(s => s.rationale),
      acute: map.acute.map(s => s.rationale),
      contextual: [map.contextual_summary],
    },
    domain: map.domain,
    timestamp: map.generated_at,
    methodology: map.methodology_note,
  };
}
