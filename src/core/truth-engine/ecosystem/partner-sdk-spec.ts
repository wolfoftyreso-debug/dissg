/**
 * PARTNER SDK SPECIFICATION
 * 
 * What partners can build on top of the Truth Engine.
 * 
 * OPEN SHELL:
 * - Decision Graphs
 * - Diagram specs
 * - SDKs
 * 
 * LOCKED CORE:
 * - Answer Packets
 * - Index definitions
 * - Confidence engine
 * - Governance
 */

/**
 * PARTNER TIERS
 */
export interface PartnerTier {
  readonly tier_id: string;
  readonly name: string;
  readonly description: string;
  readonly access_level: 'read' | 'build' | 'extend';
  readonly rate_limits: PartnerRateLimits;
  readonly allowed_operations: readonly string[];
  readonly forbidden_operations: readonly string[];
  readonly pricing_model: 'free' | 'usage' | 'enterprise';
}

export interface PartnerRateLimits {
  requests_per_minute: number;
  requests_per_day: number;
  max_concurrent: number;
  max_complexity: number;
}

export const PARTNER_TIERS: Record<string, PartnerTier> = {
  // Open tier - anyone can read
  open: {
    tier_id: 'open',
    name: 'Open Access',
    description: 'Read-only access to public data and Decision Graphs',
    access_level: 'read',
    rate_limits: {
      requests_per_minute: 30,
      requests_per_day: 1000,
      max_concurrent: 5,
      max_complexity: 50,
    },
    allowed_operations: [
      'read_decision_types',
      'read_public_graphs',
      'read_public_indices',
      'read_methodology',
    ],
    forbidden_operations: [
      'create_graphs',
      'access_raw_data',
      'bulk_export',
      'white_label',
    ],
    pricing_model: 'free',
  },
  
  // Builder tier - can build applications
  builder: {
    tier_id: 'builder',
    name: 'Builder',
    description: 'Build applications on top of Decision Graphs',
    access_level: 'build',
    rate_limits: {
      requests_per_minute: 120,
      requests_per_day: 10000,
      max_concurrent: 20,
      max_complexity: 100,
    },
    allowed_operations: [
      'read_decision_types',
      'create_decision_graphs',
      'resolve_graphs',
      'read_indices',
      'embed_visualizations',
      'use_sdk',
    ],
    forbidden_operations: [
      'modify_answer_packets',
      'modify_indices',
      'access_governance',
      'white_label',
    ],
    pricing_model: 'usage',
  },
  
  // Enterprise tier - full integration
  enterprise: {
    tier_id: 'enterprise',
    name: 'Enterprise',
    description: 'Full integration with custom domains and white-label options',
    access_level: 'extend',
    rate_limits: {
      requests_per_minute: 1000,
      requests_per_day: 100000,
      max_concurrent: 100,
      max_complexity: 500,
    },
    allowed_operations: [
      'all_builder_operations',
      'bulk_export',
      'custom_decision_types',
      'white_label',
      'dedicated_support',
      'sla_guarantee',
    ],
    forbidden_operations: [
      'modify_core_engine',
      'modify_governance',
      'bypass_validation',
    ],
    pricing_model: 'enterprise',
  },
};

/**
 * VERTICAL DOMAINS
 * 
 * Partners can build vertical applications in these domains.
 * They own the UX. We own the truth engine.
 */
export interface VerticalDomain {
  readonly domain_id: string;
  readonly name: string;
  readonly description: string;
  readonly decision_types: readonly string[];
  readonly indices: readonly string[];
  readonly target_users: readonly string[];
  readonly example_applications: readonly string[];
}

export const VERTICAL_DOMAINS: Record<string, VerticalDomain> = {
  energy: {
    domain_id: 'energy',
    name: 'Energy & Utilities',
    description: 'Energy investment, grid planning, renewable transition',
    decision_types: ['investment_feasibility', 'capacity_planning', 'demand_forecast'],
    indices: ['stability', 'volatility', 'growth', 'load'],
    target_users: ['energy_companies', 'grid_operators', 'investors', 'regulators'],
    example_applications: [
      'Renewable investment analyzer',
      'Grid stability monitor',
      'Energy demand forecaster',
    ],
  },
  
  healthcare: {
    domain_id: 'healthcare',
    name: 'Healthcare',
    description: 'Capacity planning, resource allocation, system health',
    decision_types: ['capacity_planning', 'resource_allocation', 'system_stability'],
    indices: ['load', 'stress', 'wait_time', 'coverage'],
    target_users: ['hospitals', 'health_authorities', 'insurers', 'policymakers'],
    example_applications: [
      'Hospital capacity planner',
      'Regional health monitor',
      'Wait time analyzer',
    ],
  },
  
  finance: {
    domain_id: 'finance',
    name: 'Finance & Markets',
    description: 'Market exposure, risk assessment, portfolio analysis',
    decision_types: ['market_exposure', 'investment_feasibility', 'system_stability'],
    indices: ['volatility', 'correlation', 'concentration', 'tail_risk'],
    target_users: ['asset_managers', 'banks', 'risk_officers', 'regulators'],
    example_applications: [
      'Market exposure dashboard',
      'Risk concentration analyzer',
      'Volatility regime monitor',
    ],
  },
  
  policy: {
    domain_id: 'policy',
    name: 'Policy & Governance',
    description: 'Policy impact, intervention evaluation, regional comparison',
    decision_types: ['policy_impact', 'intervention_evaluation', 'regional_comparison'],
    indices: ['disparity', 'coverage', 'effect_size', 'stability'],
    target_users: ['policymakers', 'researchers', 'ngos', 'journalists'],
    example_applications: [
      'Policy impact simulator',
      'Regional disparity tracker',
      'Reform outcome analyzer',
    ],
  },
  
  education: {
    domain_id: 'education',
    name: 'Education',
    description: 'System analysis, resource allocation, outcome evaluation',
    decision_types: ['resource_allocation', 'intervention_evaluation', 'regional_comparison'],
    indices: ['coverage', 'disparity', 'outcome', 'efficiency'],
    target_users: ['education_authorities', 'schools', 'researchers', 'parents'],
    example_applications: [
      'School resource analyzer',
      'Outcome disparity tracker',
      'Reform impact evaluator',
    ],
  },
  
  infrastructure: {
    domain_id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Investment planning, system stability, bottleneck analysis',
    decision_types: ['investment_feasibility', 'operational_bottleneck', 'system_stability'],
    indices: ['throughput', 'utilization', 'stress', 'degradation'],
    target_users: ['infrastructure_operators', 'municipalities', 'investors', 'planners'],
    example_applications: [
      'Infrastructure investment planner',
      'Network bottleneck analyzer',
      'Asset degradation tracker',
    ],
  },
};

/**
 * SDK CAPABILITIES
 */
export interface SDKCapability {
  readonly capability_id: string;
  readonly name: string;
  readonly description: string;
  readonly available_in: readonly string[];
  readonly code_example: string;
}

export const SDK_CAPABILITIES: SDKCapability[] = [
  {
    capability_id: 'create_decision',
    name: 'Create Decision',
    description: 'Create a decision graph from type and context',
    available_in: ['builder', 'enterprise'],
    code_example: `
const decision = new Decision('investment_feasibility', {
  country: 'SE',
  sector: 'energy',
  time_horizon: '10y'
});
const graph = await decision.resolve();
    `,
  },
  {
    capability_id: 'read_nodes',
    name: 'Read Nodes',
    description: 'Access individual question nodes and their answers',
    available_in: ['open', 'builder', 'enterprise'],
    code_example: `
const demandTrend = graph.nodes['demand_trend'];
console.log(demandTrend.summary);
console.log(demandTrend.confidence);
    `,
  },
  {
    capability_id: 'get_visualization',
    name: 'Get Visualization',
    description: 'Get chart specifications for rendering',
    available_in: ['builder', 'enterprise'],
    code_example: `
const chartSpec = graph.nodes['demand_trend'].chart_spec;
// Render with Vega-Lite, Chart.js, or any compatible library
    `,
  },
  {
    capability_id: 'confidence_summary',
    name: 'Confidence Summary',
    description: 'Get overall confidence and completeness metrics',
    available_in: ['open', 'builder', 'enterprise'],
    code_example: `
const summary = decision.confidenceSummary();
console.log(summary.overall);
console.log(summary.low_confidence_nodes);
    `,
  },
  {
    capability_id: 'export_artifact',
    name: 'Export Artifact',
    description: 'Export decision as reproducible artifact',
    available_in: ['builder', 'enterprise'],
    code_example: `
const artifact = decision.toArtifact();
// artifact.id is permanent, versioned, reproducible
    `,
  },
];

/**
 * PARTNER ECOSYSTEM PRINCIPLES
 */
export const ECOSYSTEM_PRINCIPLES = {
  open_shell: {
    description: 'Partners can build any UX on top of Decision Graphs',
    includes: ['Decision Graphs', 'Diagram specs', 'SDKs', 'Visualizations'],
  },
  
  locked_core: {
    description: 'The truth engine remains under central governance',
    includes: ['Answer Packets', 'Index definitions', 'Confidence engine', 'Governance'],
  },
  
  vertical_freedom: {
    description: 'Partners own their vertical applications entirely',
    includes: ['Custom UX', 'Custom branding', 'Custom pricing', 'Customer relationships'],
  },
  
  no_replacement: {
    description: 'No one can replace the data and truth engine',
    enforced_by: ['API structure', 'Governance locks', 'Data provenance'],
  },
} as const;
