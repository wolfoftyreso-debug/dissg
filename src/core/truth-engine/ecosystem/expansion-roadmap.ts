/**
 * 12-MONTH EXPANSION ROADMAP
 * 
 * Quarter 1: Foundation domains stable
 * Quarter 2: Second wave domains
 * Quarter 3: Global scale
 * Quarter 4: Full ecosystem
 * 
 * All on the same core. No new architecture.
 */

export interface RoadmapQuarter {
  readonly quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  readonly theme: string;
  readonly domains: readonly string[];
  readonly decision_types_target: number;
  readonly indices_target: number;
  readonly key_deliverables: readonly string[];
  readonly success_metrics: readonly RoadmapMetric[];
}

export interface RoadmapMetric {
  readonly metric_id: string;
  readonly name: string;
  readonly target: number;
  readonly unit: string;
}

export const EXPANSION_ROADMAP: RoadmapQuarter[] = [
  // QUARTER 1: Foundation
  {
    quarter: 'Q1',
    theme: 'Foundation Domains Stable',
    domains: ['youth', 'economy', 'markets', 'healthcare'],
    decision_types_target: 20,
    indices_target: 10,
    key_deliverables: [
      'Youth domain fully operational',
      'Economy indices live',
      'Markets exposure tools',
      'Healthcare capacity planning',
      '10 Decision Types per domain',
      'Public API stable',
      'GDG v1.0 published',
    ],
    success_metrics: [
      { metric_id: 'api_requests', name: 'Daily API Requests', target: 10000, unit: 'requests' },
      { metric_id: 'decision_graphs', name: 'Decision Graphs Created', target: 1000, unit: 'graphs' },
      { metric_id: 'data_coverage', name: 'Data Coverage', target: 80, unit: 'percent' },
      { metric_id: 'uptime', name: 'API Uptime', target: 99.5, unit: 'percent' },
    ],
  },
  
  // QUARTER 2: Second Wave
  {
    quarter: 'Q2',
    theme: 'Second Wave Domains',
    domains: ['environment', 'education', 'infrastructure'],
    decision_types_target: 35,
    indices_target: 25,
    key_deliverables: [
      'Environment domain operational',
      'Education outcomes live',
      'Infrastructure investment tools',
      'Regional Decision Graphs',
      'Sensor & flow data integration',
      'Partner SDK v1.0',
      'First external verifications',
    ],
    success_metrics: [
      { metric_id: 'api_requests', name: 'Daily API Requests', target: 50000, unit: 'requests' },
      { metric_id: 'partner_apps', name: 'Partner Applications', target: 10, unit: 'apps' },
      { metric_id: 'countries', name: 'Countries Covered', target: 15, unit: 'countries' },
      { metric_id: 'indices_live', name: 'Live Indices', target: 25, unit: 'indices' },
    ],
  },
  
  // QUARTER 3: Global Scale
  {
    quarter: 'Q3',
    theme: 'Global Comparisons',
    domains: ['global', 'cross_domain', 'resilience'],
    decision_types_target: 60,
    indices_target: 40,
    key_deliverables: [
      'Global country comparisons',
      'System risk & resilience indices',
      'Cross-domain correlations',
      'Multi-country Decision Graphs',
      'AI agent integration SDK',
      'Academic verification program',
      'Enterprise tier launch',
    ],
    success_metrics: [
      { metric_id: 'api_requests', name: 'Daily API Requests', target: 200000, unit: 'requests' },
      { metric_id: 'enterprise_clients', name: 'Enterprise Clients', target: 20, unit: 'clients' },
      { metric_id: 'countries', name: 'Countries Covered', target: 50, unit: 'countries' },
      { metric_id: 'ai_integrations', name: 'AI Agent Integrations', target: 5, unit: 'integrations' },
    ],
  },
  
  // QUARTER 4: Full Ecosystem
  {
    quarter: 'Q4',
    theme: 'Full Partner Ecosystem',
    domains: ['all'],
    decision_types_target: 100,
    indices_target: 50,
    key_deliverables: [
      '100+ Decision Types',
      '50+ Indices live',
      'Full partner ecosystem',
      'Self-service partner onboarding',
      'Artifact citation standard',
      'Multi-language support',
      'GDG adoption by third parties',
    ],
    success_metrics: [
      { metric_id: 'api_requests', name: 'Daily API Requests', target: 1000000, unit: 'requests' },
      { metric_id: 'partner_apps', name: 'Partner Applications', target: 50, unit: 'apps' },
      { metric_id: 'artifacts_created', name: 'Decision Artifacts Created', target: 100000, unit: 'artifacts' },
      { metric_id: 'gdg_adopters', name: 'GDG Adopters', target: 10, unit: 'organizations' },
    ],
  },
];

/**
 * DOMAIN EXPANSION QUEUE
 */
export interface DomainExpansion {
  readonly domain_id: string;
  readonly name: string;
  readonly target_quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly decision_types: readonly string[];
  readonly indices: readonly string[];
  readonly data_sources: readonly string[];
  readonly dependencies: readonly string[];
}

export const DOMAIN_EXPANSION_QUEUE: DomainExpansion[] = [
  // Q1 Domains
  {
    domain_id: 'youth',
    name: 'Youth & Demographics',
    target_quarter: 'Q1',
    priority: 'critical',
    decision_types: ['capacity_planning', 'resource_allocation', 'regional_comparison'],
    indices: ['youth_unemployment', 'education_access', 'health_coverage'],
    data_sources: ['eurostat', 'national_statistics', 'oecd'],
    dependencies: [],
  },
  {
    domain_id: 'economy',
    name: 'Economy & Labor',
    target_quarter: 'Q1',
    priority: 'critical',
    decision_types: ['investment_feasibility', 'demand_forecast', 'system_stability'],
    indices: ['gdp_growth', 'unemployment', 'inflation', 'productivity'],
    data_sources: ['eurostat', 'imf', 'world_bank', 'national_statistics'],
    dependencies: [],
  },
  {
    domain_id: 'markets',
    name: 'Financial Markets',
    target_quarter: 'Q1',
    priority: 'high',
    decision_types: ['market_exposure', 'investment_feasibility', 'system_stability'],
    indices: ['volatility', 'correlation', 'concentration', 'liquidity'],
    data_sources: ['central_banks', 'market_data', 'regulatory_filings'],
    dependencies: ['economy'],
  },
  {
    domain_id: 'healthcare',
    name: 'Healthcare Systems',
    target_quarter: 'Q1',
    priority: 'critical',
    decision_types: ['capacity_planning', 'resource_allocation', 'operational_bottleneck'],
    indices: ['load', 'wait_time', 'coverage', 'outcomes'],
    data_sources: ['health_registries', 'who', 'national_health_data'],
    dependencies: [],
  },
  
  // Q2 Domains
  {
    domain_id: 'environment',
    name: 'Environment & Climate',
    target_quarter: 'Q2',
    priority: 'high',
    decision_types: ['investment_feasibility', 'policy_impact', 'system_stability'],
    indices: ['emissions', 'renewable_share', 'resource_efficiency'],
    data_sources: ['eea', 'ipcc', 'national_environment_data'],
    dependencies: ['economy'],
  },
  {
    domain_id: 'education',
    name: 'Education Systems',
    target_quarter: 'Q2',
    priority: 'high',
    decision_types: ['resource_allocation', 'intervention_evaluation', 'regional_comparison'],
    indices: ['outcomes', 'equity', 'access', 'efficiency'],
    data_sources: ['oecd_pisa', 'national_education_data', 'unesco'],
    dependencies: ['youth'],
  },
  {
    domain_id: 'infrastructure',
    name: 'Infrastructure & Transport',
    target_quarter: 'Q2',
    priority: 'medium',
    decision_types: ['investment_feasibility', 'operational_bottleneck', 'capacity_planning'],
    indices: ['utilization', 'degradation', 'throughput', 'accessibility'],
    data_sources: ['transport_authorities', 'utility_data', 'municipal_data'],
    dependencies: [],
  },
  
  // Q3 Domains
  {
    domain_id: 'global',
    name: 'Global Comparisons',
    target_quarter: 'Q3',
    priority: 'high',
    decision_types: ['regional_comparison', 'policy_impact'],
    indices: ['convergence', 'disparity', 'competitiveness'],
    data_sources: ['all_previous'],
    dependencies: ['economy', 'healthcare', 'education'],
  },
  {
    domain_id: 'resilience',
    name: 'System Resilience',
    target_quarter: 'Q3',
    priority: 'medium',
    decision_types: ['system_stability', 'demand_forecast'],
    indices: ['fragility', 'redundancy', 'recovery_capacity'],
    data_sources: ['cross_domain'],
    dependencies: ['all_q1', 'all_q2'],
  },
];

/**
 * ROADMAP PRINCIPLES
 */
export const ROADMAP_PRINCIPLES = {
  same_core: {
    statement: 'All expansion happens on the same architecture',
    enforcement: 'No new core components after Q1',
  },
  
  additive_only: {
    statement: 'New domains add to, never replace, existing structure',
    enforcement: 'Schema versioning + backwards compatibility',
  },
  
  quality_over_speed: {
    statement: 'Data quality gates must pass before domain goes live',
    enforcement: 'Coverage thresholds + verification requirements',
  },
  
  partner_leverage: {
    statement: 'Partners drive vertical depth, core drives horizontal coverage',
    enforcement: 'Partner SDK + domain APIs',
  },
} as const;
