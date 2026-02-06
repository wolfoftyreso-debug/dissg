/**
 * ALLOWED METRICS (VERY FEW)
 * 
 * STEG 32: WHAT CAN BE MEASURED
 * 
 * You may NOT measure:
 * - User engagement
 * - Popularity
 * - Shares
 * - Opinion influence
 * 
 * You may measure:
 * - Resolve success rate
 * - Agent fallback rate
 * - Epistemic conflict rate
 * - Historical consistency
 * - Unanswered-but-valid queries
 * 
 * Everything else leads away.
 */

/**
 * FORBIDDEN METRICS
 */
export const FORBIDDEN_METRICS = {
  user_engagement: {
    metric: 'Time on site, clicks, return visits',
    why_forbidden: 'Incentivizes making oracle "engaging" rather than accurate',
    danger: 'Leads to gamification, entertainment, distraction',
  },
  
  popularity: {
    metric: 'Total users, growth rate, market share',
    why_forbidden: 'Incentivizes appealing to masses',
    danger: 'Leads to dumbing down, broadening scope inappropriately',
  },
  
  shares: {
    metric: 'Social shares, viral coefficient',
    why_forbidden: 'Incentivizes shareable content over accurate content',
    danger: 'Leads to sensationalism, clickbait tendencies',
  },
  
  opinion_influence: {
    metric: 'Impact on public discourse, citation in debates',
    why_forbidden: 'Incentivizes taking sides, being relevant to controversies',
    danger: 'Leads to normative drift, politicization',
  },
  
  revenue_per_user: {
    metric: 'Monetization efficiency',
    why_forbidden: 'Incentivizes extracting value from users',
    danger: 'Leads to dark patterns, manipulation',
  },
  
  nps: {
    metric: 'Net Promoter Score',
    why_forbidden: 'Measures satisfaction, which requires pleasing users',
    danger: 'Leads to telling people what they want to hear',
  },
} as const;

/**
 * ALLOWED METRICS
 */
export const ALLOWED_METRICS = {
  resolve_success_rate: {
    metric: 'Percentage of valid queries that receive complete, accurate response',
    why_allowed: 'Measures core function without incentivizing overreach',
    target: 'High, but not at cost of answering invalid queries',
    calculation: 'Valid queries with complete response / Total valid queries',
  },
  
  agent_fallback_rate: {
    metric: 'How often AI agents fall back to other sources after querying oracle',
    why_allowed: 'Indicates whether oracle is serving its purpose for machines',
    target: 'Low – agents should find what they need',
    calculation: 'Agent sessions with fallback / Total agent sessions',
  },
  
  epistemic_conflict_rate: {
    metric: 'Frequency of conflicts between data sources',
    why_allowed: 'Measures data quality and source alignment',
    target: 'Low – sources should agree when they cover same ground',
    calculation: 'Ingests with conflicts / Total ingests',
  },
  
  historical_consistency: {
    metric: 'Degree to which historical data remains unchanged',
    why_allowed: 'Measures integrity of append-only store',
    target: '100% – nothing historical should ever change',
    calculation: 'Historical records unchanged / Total historical records',
  },
  
  unanswered_valid_queries: {
    metric: 'Valid queries that oracle could not answer due to coverage gaps',
    why_allowed: 'Identifies where more data is needed without expanding scope',
    target: 'Decreasing – as coverage expands',
    calculation: 'Valid queries with no data / Total valid queries',
  },
  
  silence_rate: {
    metric: 'Percentage of queries correctly refused (invalid/out of scope)',
    why_allowed: 'Measures discipline in not overreaching',
    target: 'Appropriate to query distribution – not too low',
    calculation: 'Queries correctly refused / Queries that should be refused',
  },
} as const;

/**
 * WHY THESE SPECIFIC METRICS
 */
export const METRIC_PHILOSOPHY = {
  principle: 'Metrics shape behavior; choose metrics that shape toward discipline',
  
  forbidden_metrics_effect: 'Would incentivize expansion, entertainment, popularity',
  allowed_metrics_effect: 'Incentivize accuracy, coverage, discipline, integrity',
  
  key_insight: 'If you measure engagement, you optimize for engagement. We measure epistemic quality, so we optimize for epistemic quality.',
} as const;

/**
 * METRIC REPORTING
 */
export const METRIC_REPORTING = {
  frequency: 'Weekly internal, monthly steward review',
  
  format: {
    current_value: 'This period\'s measurement',
    trend: 'Direction of change',
    anomalies: 'Any unusual patterns',
    action: 'Almost always: none needed',
  },
  
  response_to_bad_metrics: {
    resolve_success_down: 'Investigate data gaps, not scope expansion',
    conflict_rate_up: 'Review source quality, not methodology',
    historical_change: 'CRITICAL – investigate immediately',
    silence_rate_too_low: 'Review query classification, not answer generation',
  },
} as const;

/**
 * WHAT HAPPENS WHEN SOMEONE SUGGESTS NEW METRICS
 */
export const NEW_METRIC_REQUESTS = {
  common_requests: [
    'User satisfaction',
    'Feature usage',
    'Growth rate',
    'Competitive position',
  ],
  
  response: 'Apply the single question: Does measuring this make the oracle more likely to answer when it should be silent?',
  
  almost_always: 'Yes – because most metrics incentivize expansion',
  
  decision: 'Reject the metric',
} as const;
