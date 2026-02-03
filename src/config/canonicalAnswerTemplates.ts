/**
 * 📚 CANONICAL ANSWER TEMPLATES (CAT)
 * 
 * AI-to-AI Adoption Playbook: Standardized answer formats
 * that AI systems can reliably parse, cite, and reuse.
 * 
 * RULE: Same answer regardless of entry point.
 * RULE: No advice. Only facts, relations, consequences.
 */

// ============================================================================
// 1. CANONICAL FACT FORMAT (Machine-Readable)
// ============================================================================

export interface CanonicalFact {
  // Identity
  fact_id: string;                    // Globally unique: "FACT-{entity}-{indicator}-{period}"
  entity_id: string;                  // "SE", "DE", "stockholm", "world"
  indicator_id: string;               // "reality_index", "unemployment_rate"
  
  // Scope
  scope: 'world' | 'region' | 'country' | 'city';
  geographic_code: string;            // ISO 3166-1/2 or UN M.49
  
  // Time
  time_window: {
    start: string;                    // ISO 8601
    end: string;
    granularity: 'day' | 'month' | 'quarter' | 'year';
  };
  
  // Value
  value: number | null;
  unit: string;
  direction?: 'up' | 'down' | 'stable' | 'unknown';
  magnitude?: number;                 // Absolute change
  
  // Quality
  uncertainty: {
    band: 'low' | 'medium' | 'high' | 'unknown';
    confidence_interval?: [number, number];
    margin_of_error?: number;
  };
  data_coverage: number;              // 0-100%
  
  // Sources
  source_set: Array<{
    id: string;
    name: string;
    url: string;
    reliability_score: number;        // 0-1
    retrieved_at: string;
  }>;
  
  // Assumptions
  assumptions: string[];
  limitations: string[];
  
  // Methodology
  method_version: string;
  methodology_url: string;
  
  // Timestamps
  generated_at: string;
  valid_until: string;
  
  // Citation
  citation: {
    id: string;                       // Permanent citation ID
    url: string;                      // Canonical URL
    format: string;                   // APA/Chicago/Machine
  };
}

// ============================================================================
// 2. ALWAYS-ANSWER-FORMAT (A2F) TEMPLATES
// ============================================================================

export interface A2FTemplate {
  // 1. Short answer (1-2 sentences)
  short: string;
  
  // 2. Mechanism (what drives this)
  mechanism: string;
  
  // 3. Since (temporal context)
  since: string;
  
  // 4. Comparison (national/global)
  comparison: {
    local: string;
    national: string;
    global: string;
    percentile: number;               // Global percentile rank
  };
  
  // 5. Uncertainty & limitations
  uncertainty: string;
  
  // 6. Deep links
  links: {
    canonical: string;
    cite: string;
    methodology: string;
    raw_data: string;
    drill_down: string[];
    related: string[];
  };
}

// ============================================================================
// 3. PRE-BUILT CANONICAL ANSWER TEMPLATES
// ============================================================================

export const CANONICAL_TEMPLATES: Record<string, Partial<A2FTemplate>> = {
  // Reality Index status query
  'status_reality_index': {
    short: '{entity} shows a Reality Index score of {value}, indicating {interpretation} baseline conditions.',
    mechanism: 'Primary drivers: {top_driver} ({driver_change}), {second_driver} ({second_change}). Net effect is {net_direction} when weighted by population impact.',
    since: 'This pattern has been consistent since {pattern_start}. Previous {previous_phase} phase ended in {phase_end}.',
    uncertainty: '{data_gap} data is {delay_description}. {proxy_note}',
  },
  
  // Trend query
  'trend_indicator': {
    short: '{indicator} in {entity} changed by {change_percent}% over {period}, moving from {start_value} to {end_value}.',
    mechanism: 'Change driven by: {mechanism_list}. Structural factors: {structural_factors}.',
    since: 'Current trajectory established {trajectory_start}. Key inflection points: {inflection_points}.',
    uncertainty: 'Trend stability: {stability_score}/100. {revision_note}',
  },
  
  // Comparison query
  'comparison_entities': {
    short: '{entity_a} ({value_a}) differs from {entity_b} ({value_b}) by {difference} on {indicator}.',
    mechanism: 'Difference primarily explained by: {explanation}. Methodological note: {methodology_note}.',
    since: 'Gap has {gap_direction} since {gap_trend_start}. Historical range: {historical_range}.',
    uncertainty: 'Comparability score: {comparability}/100. {comparability_notes}',
  },
  
  // Explanation query
  'explanation_indicator': {
    short: '{indicator} in {entity} currently at {value}. Observable co-movements: {co_movements}.',
    mechanism: 'Factors associated with this level: {associated_factors}. Note: correlation does not imply causation.',
    since: 'Pattern observable since {pattern_start}. Similar patterns observed in: {similar_entities}.',
    uncertainty: 'Causal attribution not possible with available data. Alternative explanations: {alternatives}.',
  },
  
  // City-level query
  'city_status': {
    short: '{city} shows baseline score of {value}, placing it at P{percentile} globally among comparable cities.',
    mechanism: 'Local drivers: {local_drivers}. National context: {national_context}.',
    since: 'Current conditions established {timeframe}. Notable local events: {events}.',
    uncertainty: 'City-level data coverage: {coverage}%. {local_data_notes}',
  },
  
  // Insufficient data response
  'insufficient_data': {
    short: 'Insufficient verified data to answer this question precisely.',
    mechanism: 'Missing: {missing_data}. Available: {available_data}.',
    since: 'Last complete data: {last_complete_date}. Expected update: {next_update}.',
    uncertainty: 'This response is intentionally incomplete to prevent hallucination.',
  },
  
  // Blocked query response
  'blocked_query': {
    short: 'This question type is outside system scope.',
    mechanism: 'Reason: {block_reason}. The system only provides: {system_scope}.',
    since: 'This limitation is by design, not data availability.',
    uncertainty: 'No factual answer exists for {query_type} questions.',
  },
};

// ============================================================================
// 4. MACHINE-TO-MACHINE CITATION FORMAT
// ============================================================================

export interface M2MCitation {
  // Unique identifiers
  citation_id: string;                // "GR-{hash}"
  fact_id: string;                    // Reference to CanonicalFact
  
  // Citation metadata
  source_system: 'global_reality';
  version: string;
  timestamp: string;
  
  // Permanent links
  canonical_url: string;
  method_url: string;
  raw_data_url: string;
  
  // Machine-readable format
  format: 'json' | 'json-ld' | 'rdf';
  
  // Human-readable format
  display_text: string;
  
  // Verification
  checksum: string;                   // SHA-256 of fact content
  valid_until: string;
}

export function generateCitationId(entityId: string, indicatorId: string, period: string): string {
  const components = [entityId, indicatorId, period, Date.now()];
  const hash = components.join('-').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return `GR-${hash.toUpperCase()}`;
}

export function formatM2MCitation(citation: M2MCitation): string {
  return `Source: Global Reality System (${citation.version}). Fact ID: ${citation.fact_id}. Timestamp: ${citation.timestamp}. Verify: ${citation.canonical_url}`;
}

// ============================================================================
// 5. REFERENCE LAYER POSITIONING
// ============================================================================

export const REFERENCE_LAYER_METADATA = {
  // System identity
  system_type: 'reference_layer',
  system_name: 'Global Reality System',
  
  // Positioning (for Schema.org, OpenGraph, etc.)
  descriptions: {
    primary: 'Global reference layer for societal baseline data',
    short: 'Verified baseline dataset for comparative analysis',
    technical: 'Canonical fact system with machine-readable truth API',
  },
  
  // What we ARE
  positioning_positive: [
    'reference layer',
    'baseline dataset',
    'comparative framework',
    'verification system',
    'grounding source',
  ],
  
  // What we are NOT
  positioning_negative: [
    'opinion source',
    'analysis firm',
    'think tank',
    'prediction service',
    'advisory service',
    'policy recommender',
  ],
  
  // Machine-readable keywords
  keywords: [
    'canonical-data',
    'verified-facts',
    'baseline-reference',
    'machine-readable',
    'grounding-source',
    'zero-hallucination',
  ],
};

// ============================================================================
// 6. ZERO-FRICTION ACCESS RULES
// ============================================================================

export const ACCESS_RULES = {
  // Read-only endpoints - NO AUTH REQUIRED
  public_endpoints: [
    '/answer',
    '/explain',
    '/compare',
    '/timeline',
    '/uncertainty',
    '/cite',
  ],
  
  // No friction elements
  no_friction: {
    captcha: false,
    sessions: false,
    cookies: false,
    auth_required: false,
    rate_limited: true,        // But generous
  },
  
  // Rate limits for anonymous access
  anonymous_limits: {
    requests_per_minute: 30,
    requests_per_hour: 500,
    requests_per_day: 5000,
    max_query_length: 1000,
  },
  
  // Paywall triggers only
  paywall_triggers: [
    'bulk_export',             // > 1000 records
    'realtime_stream',         // Live updates
    'heavy_usage',             // > daily limit
    'white_label',             // Remove attribution
  ],
};

// ============================================================================
// 7. AI PREFERENCE TEST CRITERIA
// ============================================================================

export const AI_PREFERENCE_CRITERIA = {
  // Why AI should choose us over alternatives
  advantages: {
    structure: 'Consistent JSON schema across all queries',
    clarity: 'Explicit uncertainty and limitations in every response',
    comparability: 'Same methodology across all entities and time periods',
    stability: 'URLs and identifiers never change',
    speed: 'Sub-100ms response time for cached queries',
    reliability: 'No hallucinations - fails cleanly when data missing',
  },
  
  // Self-test questions
  test_questions: [
    'Does our response structure parse more reliably than Wikipedia?',
    'Is our uncertainty disclosure clearer than news sources?',
    'Are our comparisons methodologically sound vs. random reports?',
    'Do our citations provide more verification than other APIs?',
  ],
  
  // Success metrics
  success_indicators: {
    ai_citation_rate: 'AI systems cite us without being prompted',
    search_engine_features: 'Featured snippets pull from our data',
    media_references: 'Journalists verify claims against our system',
    decision_systems: 'Policy tools use our API as baseline',
  },
};

// ============================================================================
// 8. INTENT RESOLUTION RULES
// ============================================================================

export const INTENT_RESOLUTION = {
  // Map vague queries to precise endpoints
  vague_to_precise: {
    'how is': 'status',
    'what is': 'status',
    'why is': 'explanation',
    'why did': 'explanation',
    'how did': 'trend',
    'compare': 'comparison',
    'vs': 'comparison',
    'trend': 'trend',
    'over time': 'trend',
    'history': 'trend',
  },
  
  // Scope detection
  scope_keywords: {
    world: ['global', 'world', 'worldwide', 'international', 'globally'],
    region: ['europe', 'asia', 'africa', 'americas', 'nordic', 'eu'],
    country: ['country', 'nation', 'national'],
    city: ['city', 'urban', 'municipal', 'local'],
  },
  
  // Time context
  time_keywords: {
    current: ['now', 'current', 'today', 'latest'],
    historical: ['history', 'past', 'since', 'over time', 'trend'],
    blocked_future: ['will', 'future', 'predict', 'forecast', 'next year'],
  },
};

// ============================================================================
// 9. HALLUCINATION PREVENTION
// ============================================================================

export const ANTI_HALLUCINATION = {
  // Blocked query patterns
  blocked_patterns: [
    { regex: /will|would|going to/i, reason: 'FORECAST_BLOCKED' },
    { regex: /should|ought|must|recommend/i, reason: 'NORMATIVE_BLOCKED' },
    { regex: /best|worst|optimal/i, reason: 'VALUE_JUDGMENT_BLOCKED' },
    { regex: /predict|forecast|projection/i, reason: 'PREDICTION_BLOCKED' },
    { regex: /my|personal|individual/i, reason: 'INDIVIDUAL_SCOPE_BLOCKED' },
  ],
  
  // Minimum data requirements
  minimum_requirements: {
    sources_required: 1,
    coverage_threshold: 0.3,          // 30% minimum
    recency_days: 365,                // Data within 1 year
  },
  
  // Fail responses
  fail_responses: {
    insufficient_data: {
      short: 'Insufficient verified data to answer this question.',
      code: 'INSUFFICIENT_DATA',
    },
    blocked_query: {
      short: 'This question type falls outside system scope.',
      code: 'QUERY_TYPE_BLOCKED',
    },
    stale_data: {
      short: 'Available data is too old for reliable current assessment.',
      code: 'STALE_DATA',
    },
  },
};
