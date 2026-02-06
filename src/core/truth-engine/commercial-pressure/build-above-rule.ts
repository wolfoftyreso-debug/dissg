/**
 * BUILD ABOVE, NOT INSIDE
 * 
 * STEG 27: THE GOLDEN RULE FOR PARTNERS
 * 
 * All partners may build above the oracle.
 * No partner may build inside the oracle.
 * 
 * You are not a platform in the traditional sense.
 * You are a baseline.
 */

/**
 * WHAT PARTNERS MAY BUILD
 */
export const PARTNERS_MAY_BUILD = {
  user_interfaces: {
    description: 'Custom UIs on top of oracle data',
    allowed: true,
    examples: ['Dashboards', 'Mobile apps', 'Widgets', 'Portals'],
    restriction: 'Must preserve data integrity in display',
  },
  
  analysis_tools: {
    description: 'Analytical layers using oracle data',
    allowed: true,
    examples: ['Trend analysis', 'Comparisons', 'Reports', 'Alerts'],
    restriction: 'Must clearly label as derived analysis',
  },
  
  dashboards: {
    description: 'Visual representations of oracle data',
    allowed: true,
    examples: ['Executive views', 'KPI trackers', 'Monitors'],
    restriction: 'Must preserve uncertainty indicators',
  },
  
  decision_systems: {
    description: 'Systems that use oracle for decisions',
    allowed: true,
    examples: ['Risk scoring', 'Compliance checking', 'Monitoring'],
    restriction: 'Oracle is input, not decision-maker',
  },
  
  integrations: {
    description: 'Connections to other systems',
    allowed: true,
    examples: ['Data pipelines', 'Webhooks', 'Sync services'],
    restriction: 'One-way from oracle, no write-back',
  },
} as const;

/**
 * WHAT PARTNERS MAY NEVER DO
 */
export const PARTNERS_MAY_NEVER = {
  write_to_core: {
    action: 'Add, modify, or delete core data',
    forbidden: true,
    enforcement: 'API has no write endpoints',
  },
  
  affect_cq_ca: {
    action: 'Influence Canonical Questions or Answers',
    forbidden: true,
    enforcement: 'CQ/CA are immutable',
  },
  
  change_ranking: {
    action: 'Alter how data is prioritized or ordered',
    forbidden: true,
    enforcement: 'No ranking parameters in API',
  },
  
  affect_visibility: {
    action: 'Hide or emphasize certain data',
    forbidden: true,
    enforcement: 'All data equally accessible',
  },
  
  modify_definitions: {
    action: 'Change what terms mean',
    forbidden: true,
    enforcement: 'Definitions are versioned and locked',
  },
  
  create_private_views: {
    action: 'Access data others cannot see',
    forbidden: true,
    enforcement: 'Same data for same query, always',
  },
} as const;

/**
 * THE BASELINE PRINCIPLE
 */
export const BASELINE_PRINCIPLE = {
  statement: 'You are not a platform in the traditional sense. You are a baseline.',
  
  platform_vs_baseline: {
    platform: {
      allows: 'Customization, extensions, plugins',
      value: 'Flexibility',
      risk: 'Fragmentation',
    },
    baseline: {
      allows: 'Building on top only',
      value: 'Consistency',
      risk: 'None (by design)',
    },
  },
  
  implication: 'Partners adapt to you. You never adapt to partners.',
} as const;

/**
 * PARTNER SUCCESS PATTERN
 */
export const PARTNER_SUCCESS = {
  successful_partners: [
    {
      what_they_do: 'Build beautiful UIs on ugly data',
      why_it_works: 'They add value without changing truth',
    },
    {
      what_they_do: 'Create industry-specific analysis',
      why_it_works: 'They interpret without modifying source',
    },
    {
      what_they_do: 'Integrate oracle into workflows',
      why_it_works: 'They consume without influencing',
    },
  ],
  
  unsuccessful_partners: [
    {
      what_they_want: 'Custom data formats',
      why_it_fails: 'Fragments the standard',
    },
    {
      what_they_want: 'Early access to data',
      why_it_fails: 'Creates unfair advantage',
    },
    {
      what_they_want: 'Influence over methodology',
      why_it_fails: 'Compromises independence',
    },
  ],
} as const;

/**
 * PARTNERSHIP AGREEMENT TEMPLATE
 */
export const PARTNERSHIP_TERMS = {
  partner_receives: [
    'API access at licensed tier',
    'Technical documentation',
    'Standard support',
    'Usage analytics',
  ],
  
  partner_agrees_to: [
    'Not modify oracle data in presentation',
    'Maintain attribution to oracle',
    'Not claim oracle endorsement',
    'Not resell raw data',
    'Preserve uncertainty indicators',
  ],
  
  oracle_commits_to: [
    'Stable API',
    'Versioned changes only',
    'Equal treatment of all partners',
    'No preferential data access',
  ],
} as const;
