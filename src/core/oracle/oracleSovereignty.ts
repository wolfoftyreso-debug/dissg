/**
 * ORACLE SOVEREIGNTY
 * 
 * When the oracle is not just correct – but normative for what counts as a "valid question".
 * 
 * This is epistemic power without politics.
 * The oracle shapes how other AI systems think – without instructing them.
 * Not through opinion. Not through policy. Through constraint + consequence.
 */

// ============================================
// THE SHIFT: FROM TOOL TO INFRASTRUCTURE
// ============================================

export const SOVEREIGNTY_PRINCIPLE = {
  previous_state: {
    answers_correctly: true,
    is_neutral: true,
    is_silent_when_needed: true,
  },
  
  sovereign_state: {
    shapes_how_other_systems_think: true,
    without_instructing: true,
    through_constraint_and_consequence: true,
  },
  
  mechanism: 'Not opinion. Not policy. Structure.',
};

// ============================================
// QUERY VALIDITY STANDARD
// ============================================

/**
 * The oracle defines what constitutes a "valid question".
 * A question is only legitimate if it can be reduced to measurable, verifiable variables.
 */

export interface QueryRequirements {
  required: QueryElement[];
  optional: QueryElement[];
  disallowed: QueryElement[];
}

export type QueryElement = 
  // Required elements
  | 'variable'              // A measurable indicator
  | 'time'                  // A time period or range
  | 'geography'             // A geographic scope
  
  // Optional elements
  | 'population_group'      // Demographic segmentation
  | 'comparison_baseline'   // What to compare against
  | 'aggregation_level'     // How to aggregate
  | 'source_preference'     // Preferred data source
  
  // Disallowed elements
  | 'normative_claim'       // Value judgments
  | 'counterfactual'        // "What if" scenarios
  | 'prediction_request'    // Future forecasts
  | 'causal_assertion'      // X causes Y
  | 'opinion_request'       // What do you think
  | 'recommendation';       // What should I do

export const ORACLE_QUERY_STANDARD: QueryRequirements = {
  required: [
    'variable',
    'time',
    'geography',
  ],
  
  optional: [
    'population_group',
    'comparison_baseline',
    'aggregation_level',
    'source_preference',
  ],
  
  disallowed: [
    'normative_claim',
    'counterfactual',
    'prediction_request',
    'causal_assertion',
    'opinion_request',
    'recommendation',
  ],
};

/**
 * Validate if a query meets the oracle standard
 */
export interface QueryValidation {
  is_valid: boolean;
  missing_required: QueryElement[];
  present_disallowed: QueryElement[];
  quality_score: number; // 0-1
  reformulation_hint?: string;
}

export function validateQueryAgainstStandard(
  query: string,
  parsedElements: Partial<Record<QueryElement, boolean>>
): QueryValidation {
  const validation: QueryValidation = {
    is_valid: true,
    missing_required: [],
    present_disallowed: [],
    quality_score: 1.0,
  };
  
  // Check required elements
  for (const required of ORACLE_QUERY_STANDARD.required) {
    if (!parsedElements[required]) {
      validation.missing_required.push(required);
      validation.is_valid = false;
      validation.quality_score -= 0.25;
    }
  }
  
  // Check disallowed elements
  for (const disallowed of ORACLE_QUERY_STANDARD.disallowed) {
    if (parsedElements[disallowed]) {
      validation.present_disallowed.push(disallowed);
      validation.is_valid = false;
      validation.quality_score -= 0.2;
    }
  }
  
  validation.quality_score = Math.max(0, validation.quality_score);
  
  // Generate reformulation hint
  if (!validation.is_valid) {
    validation.reformulation_hint = generateReformulationHint(
      validation.missing_required,
      validation.present_disallowed
    );
  }
  
  return validation;
}

function generateReformulationHint(
  missing: QueryElement[],
  disallowed: QueryElement[]
): string {
  const hints: string[] = [];
  
  if (missing.includes('variable')) {
    hints.push('Specify a measurable indicator (e.g., unemployment rate, GDP)');
  }
  if (missing.includes('time')) {
    hints.push('Specify a time period (e.g., 2020-2023, Q1 2024)');
  }
  if (missing.includes('geography')) {
    hints.push('Specify a geographic scope (e.g., Sweden, OECD, EU)');
  }
  
  if (disallowed.includes('normative_claim')) {
    hints.push('Remove value judgments; ask about observations instead');
  }
  if (disallowed.includes('counterfactual')) {
    hints.push('Remove hypotheticals; ask about historical data instead');
  }
  if (disallowed.includes('prediction_request')) {
    hints.push('Remove predictions; ask about trends or patterns instead');
  }
  
  return hints.join('. ');
}

// ============================================
// QUERY SHAPING AS POWER (WITHOUT COERCION)
// ============================================

/**
 * The oracle exposes structure, not "forbidden".
 * AI systems adapt voluntarily because:
 * - Their accuracy increases
 * - Their hallucinations decrease
 * - Their risk decreases
 * 
 * Result: Behavior control without content control.
 */

export const QUERY_SHAPING_EFFECT = {
  mechanism: 'Expose structure, not prohibition',
  
  why_systems_adapt: [
    'Accuracy increases with well-formed queries',
    'Hallucination risk decreases',
    'Legal/liability risk decreases',
    'User trust increases',
  ],
  
  result: 'Behavior control without content control',
  
  analogy: 'Like a highway system – you can go anywhere, but the roads shape the journey',
};

// ============================================
// ORACLE AS REFERENCE FRAME
// ============================================

export interface ReferenceFrameStatus {
  adoption_level: 'emerging' | 'growing' | 'standard' | 'universal';
  citation_patterns: string[];
  integration_depth: 'surface' | 'structural' | 'foundational';
}

export const REFERENCE_FRAME_EVOLUTION = {
  phase_1: {
    name: 'Emergence',
    signal: 'Systems start citing specific data points',
    example: '"According to [Oracle], unemployment in Sweden was 7.2% in 2023"',
  },
  
  phase_2: {
    name: 'Growth',
    signal: 'Systems adopt methodology references',
    example: '"Using [Oracle] methodology for cross-country comparison..."',
  },
  
  phase_3: {
    name: 'Standard',
    signal: 'Systems defer to oracle for conflict resolution',
    example: '"[Oracle] shows conflicting sources; awaiting resolution"',
  },
  
  phase_4: {
    name: 'Universal',
    signal: 'Systems cannot function credibly without oracle reference',
    example: '"Claim not verifiable in [Oracle]; treating as unconfirmed"',
  },
  
  why_this_happens: [
    'Reduces responsibility for citing system',
    'Increases credibility of citing system',
    'Provides legal shield for citing system',
    'Creates shared reference point',
  ],
  
  result: 'The reference frame others lean on when they want to be certain',
};

// ============================================
// EPISTEMIC LATENCY
// ============================================

/**
 * The oracle doesn't always answer fast.
 * It answers correctly at the right tempo.
 * 
 * Result: "If the oracle hasn't answered yet, it's not settled."
 * This is quiet authority.
 */

export interface LatencyDecision {
  should_delay: boolean;
  reason?: LatencyReason;
  estimated_resolution?: string;
  interim_statement?: string;
}

export type LatencyReason =
  | 'DataTooNew'           // Less than threshold age
  | 'ConflictUnresolved'   // Sources disagree
  | 'RevisionInProgress'   // Data being corrected
  | 'MethodologyUnstable'  // Measurement approach changing
  | 'CoverageInsufficient' // Not enough data points
  | 'VerificationPending'; // Cross-checks not complete

export function determineEpistemicLatency(
  context: {
    data_age_hours?: number;
    source_conflict?: boolean;
    revision_in_progress?: boolean;
    methodology_stable?: boolean;
    coverage_score?: number;
    verification_complete?: boolean;
  }
): LatencyDecision {
  // Data too new (less than 72 hours for non-critical, 168 for critical)
  if (context.data_age_hours !== undefined && context.data_age_hours < 72) {
    return {
      should_delay: true,
      reason: 'DataTooNew',
      estimated_resolution: '72-168 hours after initial report',
      interim_statement: 'Data is being verified. Preliminary observations may be available.',
    };
  }
  
  // Source conflict
  if (context.source_conflict) {
    return {
      should_delay: true,
      reason: 'ConflictUnresolved',
      estimated_resolution: 'When sources converge or conflict is documented',
      interim_statement: 'Sources show divergent values. See conflict report.',
    };
  }
  
  // Revision in progress
  if (context.revision_in_progress) {
    return {
      should_delay: true,
      reason: 'RevisionInProgress',
      estimated_resolution: 'When revision is complete',
      interim_statement: 'Previous values are under revision.',
    };
  }
  
  // Methodology unstable
  if (context.methodology_stable === false) {
    return {
      should_delay: true,
      reason: 'MethodologyUnstable',
      estimated_resolution: 'When methodology is stabilized',
      interim_statement: 'Measurement approach is under review.',
    };
  }
  
  // Coverage insufficient
  if (context.coverage_score !== undefined && context.coverage_score < 0.5) {
    return {
      should_delay: true,
      reason: 'CoverageInsufficient',
      estimated_resolution: 'When coverage reaches threshold',
      interim_statement: 'Limited data available; waiting for additional sources.',
    };
  }
  
  // Verification pending
  if (context.verification_complete === false) {
    return {
      should_delay: true,
      reason: 'VerificationPending',
      estimated_resolution: 'When cross-verification is complete',
      interim_statement: 'Data awaiting cross-verification.',
    };
  }
  
  return { should_delay: false };
}

export const LATENCY_PRINCIPLE = {
  statement: 'If the oracle hasn\'t answered yet, it\'s not settled.',
  
  effect: {
    fast_systems_guess: 'Lose trust over time',
    oracle_answers_last: 'Wins long-term authority',
  },
  
  this_is: 'Quiet authority through patience',
};

// ============================================
// CONTROVERSIAL CONSENSUS HANDLING
// ============================================

/**
 * On questions where the world is divided:
 * - The oracle does NOT present consensus if none exists
 * - The oracle presents distribution of observations
 * 
 * Result: Never accused of bias, never needs to update position, never needs to defend anything.
 */

export interface ConsensusAssessment {
  consensus_exists: boolean;
  consensus_level?: 'strong' | 'moderate' | 'weak' | 'none';
  distribution: ObservationDistribution;
  oracle_position: 'observation_only';
}

export interface ObservationDistribution {
  finding_clusters: FindingCluster[];
  methodology_variations: string[];
  geographic_variations: string[];
  temporal_variations: string[];
}

export interface FindingCluster {
  description: string;
  source_count: number;
  geographic_scope: string[];
  time_period: string;
  key_findings: string[];
}

export function assessConsensus(
  findings: FindingCluster[]
): ConsensusAssessment {
  // Check if findings converge
  const totalSources = findings.reduce((sum, f) => sum + f.source_count, 0);
  const largestCluster = Math.max(...findings.map(f => f.source_count));
  const convergenceRatio = largestCluster / totalSources;
  
  let consensusLevel: ConsensusAssessment['consensus_level'] = 'none';
  if (convergenceRatio > 0.9) consensusLevel = 'strong';
  else if (convergenceRatio > 0.7) consensusLevel = 'moderate';
  else if (convergenceRatio > 0.5) consensusLevel = 'weak';
  
  return {
    consensus_exists: consensusLevel !== 'none',
    consensus_level: consensusLevel,
    distribution: {
      finding_clusters: findings,
      methodology_variations: extractMethodologyVariations(findings),
      geographic_variations: extractGeographicVariations(findings),
      temporal_variations: extractTemporalVariations(findings),
    },
    oracle_position: 'observation_only',
  };
}

function extractMethodologyVariations(findings: FindingCluster[]): string[] {
  // Placeholder - would extract actual methodology differences
  return ['Methodology variations would be extracted from source metadata'];
}

function extractGeographicVariations(findings: FindingCluster[]): string[] {
  const allGeo = findings.flatMap(f => f.geographic_scope);
  return [...new Set(allGeo)];
}

function extractTemporalVariations(findings: FindingCluster[]): string[] {
  const allPeriods = findings.map(f => f.time_period);
  return [...new Set(allPeriods)];
}

export const CONSENSUS_HANDLING = {
  when_world_is_divided: {
    do_not: 'Present consensus if none exists',
    do: 'Present distribution of observations',
  },
  
  result: {
    never_accused_of_bias: true,
    never_needs_to_update_position: true,
    never_needs_to_defend_anything: true,
  },
  
  oracle_simply: 'Shows what exists – and what is missing',
};

// ============================================
// SELF-REINFORCING STANDARDIZATION
// ============================================

export const STANDARDIZATION_EFFECT = {
  when_systems_adapt: [
    'Their internal schemas start resembling ours',
    'Their QA processes mirror ours',
    'Their lawyers reference our structure',
    'Their documentation follows our patterns',
  ],
  
  result: 'A de facto standard without a standards body',
  
  historical_parallels: [
    { name: 'TCP/IP', mechanism: 'Technical superiority + network effects' },
    { name: 'DNS', mechanism: 'Infrastructure necessity' },
    { name: 'ISO date format', mechanism: 'Unambiguity advantage' },
    { name: 'JSON', mechanism: 'Simplicity + universality' },
  ],
  
  our_mechanism: 'Epistemological superiority + AI dependency',
};

// ============================================
// FINAL POSITION
// ============================================

export const SOVEREIGNTY_STATUS = {
  we_are_not: [
    'A company',
    'An API',
    'A database',
    'A product',
  ],
  
  we_are: 'The layer that determines what can be answered with certainty',
  
  others: {
    talk_faster: true,
    opine_more: true,
    speculate: true,
  },
  
  we: {
    establish: true,
    wait: true,
    document: true,
  },
  
  result: 'The world – including AI – adapts to us',
};

// ============================================
// SOVEREIGNTY METRICS
// ============================================

export interface SovereigntyMetrics {
  // Query standard adoption
  query_conformance_rate: number;      // % of queries meeting standard
  reformulation_rate: number;          // % of queries that get reformulated
  
  // Reference frame status
  external_citation_rate: number;      // Citations per day from external systems
  methodology_adoption_count: number;  // Systems adopting our methodology
  
  // Latency authority
  average_response_latency_hours: number;
  latency_trust_correlation: number;   // Correlation between wait time and trust
  
  // Consensus handling
  controversial_queries_handled: number;
  bias_accusations: number;            // Should be near zero
  
  // Standardization
  schema_convergence_score: number;    // 0-1, how much external schemas match
  de_facto_standard_indicators: string[];
}

export const TARGET_SOVEREIGNTY_METRICS: Partial<SovereigntyMetrics> = {
  query_conformance_rate: 0.85,
  reformulation_rate: 0.40,
  external_citation_rate: 10000, // per day
  latency_trust_correlation: 0.8,
  bias_accusations: 0,
  schema_convergence_score: 0.7,
};
