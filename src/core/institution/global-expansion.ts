/**
 * GLOBAL EXPANSION PIPELINE
 * 
 * Mechanical. Same core. No local semantics.
 */

/**
 * COUNTRY ONBOARDING STAGES
 */
export const ONBOARDING_STAGES = {
  /**
   * STAGE 1: SOURCE INVENTORY
   */
  SOURCE_INVENTORY: {
    stage: 1,
    name: 'Source Inventory',
    duration_weeks: 2,
    
    tasks: [
      'Identify official statistical agencies',
      'Map available datasets',
      'Assess data quality scores',
      'Document access methods',
      'Verify update frequencies',
    ],
    
    outputs: [
      'Source registry for country',
      'Quality assessment matrix',
      'Access documentation',
    ],
    
    gate: 'Minimum 10 quality sources identified',
  },

  /**
   * STAGE 2: ONTOLOGY MAPPING
   */
  ONTOLOGY_MAPPING: {
    stage: 2,
    name: 'Ontology Mapping',
    duration_weeks: 3,
    
    tasks: [
      'Map local concepts to global ontology',
      'Identify unmappable local specifics',
      'Document definitional differences',
      'Create translation tables',
      'Validate semantic equivalence',
    ],
    
    outputs: [
      'Ontology mapping document',
      'Unmappable concepts list',
      'Semantic equivalence proofs',
    ],
    
    gate: '80% concepts successfully mapped',
  },

  /**
   * STAGE 3: BASELINE BUILD
   */
  BASELINE_BUILD: {
    stage: 3,
    name: 'Baseline Build',
    duration_weeks: 4,
    
    tasks: [
      'Ingest historical data',
      'Calculate baseline values',
      'Establish trend directions',
      'Compute uncertainty ranges',
      'Validate against known facts',
    ],
    
    outputs: [
      'Historical data store',
      'Baseline calculations',
      'Uncertainty envelopes',
    ],
    
    gate: 'Baselines pass validation checks',
  },

  /**
   * STAGE 4: FACTORY GENERATION
   */
  FACTORY_GENERATION: {
    stage: 4,
    name: 'Factory Generation',
    duration_weeks: 2,
    
    tasks: [
      'Configure batch templates',
      'Run mass production',
      'Generate truth nodes',
      'Create indexes',
      'Build decision graphs',
    ],
    
    outputs: [
      'Truth node corpus',
      'Index set',
      'Decision graph templates',
    ],
    
    gate: 'Minimum 500 truth nodes generated',
  },

  /**
   * STAGE 5: RED TEAM
   */
  RED_TEAM: {
    stage: 5,
    name: 'Red Team Validation',
    duration_weeks: 1,
    
    tasks: [
      'Run full attack simulation',
      'Validate guardrail compliance',
      'Test semantic isolation',
      'Verify historical integrity',
      'Confirm no advice leakage',
    ],
    
    outputs: [
      'Red team report',
      'Compliance certificate',
      'Remediation log',
    ],
    
    gate: '100% red team pass rate',
  },

  /**
   * STAGE 6: PUBLIC RELEASE
   */
  PUBLIC_RELEASE: {
    stage: 6,
    name: 'Public Release',
    duration_weeks: 1,
    
    tasks: [
      'Enable public API access',
      'Publish documentation',
      'Announce availability',
      'Monitor initial usage',
      'Address early feedback',
    ],
    
    outputs: [
      'Public API endpoint',
      'Country documentation',
      'Launch announcement',
    ],
    
    gate: 'Stable for 7 days',
  },
} as const;

/**
 * TOTAL PIPELINE DURATION
 */
export const PIPELINE_DURATION = {
  total_weeks: 13,
  parallelizable: ['SOURCE_INVENTORY', 'ONTOLOGY_MAPPING'],
  sequential: ['BASELINE_BUILD', 'FACTORY_GENERATION', 'RED_TEAM', 'PUBLIC_RELEASE'],
  minimum_weeks_with_parallelism: 10,
} as const;

/**
 * COUNTRY STATUS TRACKING
 */
export interface CountryStatus {
  country_code: string;
  country_name: string;
  current_stage: number;
  stage_name: string;
  started_at: string;
  estimated_completion: string;
  truth_nodes_generated: number;
  indexes_created: number;
  red_team_passed: boolean;
  public: boolean;
}

/**
 * EXPANSION PRINCIPLES
 */
export const EXPANSION_PRINCIPLES = {
  /**
   * SAME CORE EVERYWHERE
   */
  same_core: {
    rule: 'Core contracts, guardrails, and semantics are identical globally',
    no_local_exceptions: true,
    no_semantic_adaptation: true,
  },

  /**
   * QUALITY OVER SPEED
   */
  quality_over_speed: {
    rule: 'No country launches without full red team pass',
    minimum_truth_nodes: 500,
    minimum_sources: 10,
  },

  /**
   * TRANSPARENT GAPS
   */
  transparent_gaps: {
    rule: 'Missing data is explicitly marked, never estimated',
    coverage_always_visible: true,
    no_gap_filling: true,
  },

  /**
   * PRIORITY ORDER
   */
  priority_order: {
    tier_1: ['SE', 'NO', 'DK', 'FI'], // Nordics (highest data quality)
    tier_2: ['DE', 'NL', 'CH', 'AT'], // DACH + NL
    tier_3: ['GB', 'FR', 'IT', 'ES'], // Major EU
    tier_4: ['US', 'CA', 'AU', 'NZ'], // Anglosphere
    tier_5: ['JP', 'KR', 'SG', 'TW'], // Developed Asia
  },
} as const;

/**
 * EXPANSION STATUS REGISTRY
 */
export const EXPANSION_STATUS: Record<string, CountryStatus> = {
  SE: {
    country_code: 'SE',
    country_name: 'Sweden',
    current_stage: 6,
    stage_name: 'Public Release',
    started_at: '2024-01-01',
    estimated_completion: '2024-03-15',
    truth_nodes_generated: 1247,
    indexes_created: 87,
    red_team_passed: true,
    public: true,
  },
};

/**
 * GET ONBOARDING PROGRESS
 */
export function getOnboardingProgress(countryCode: string): {
  stage: number;
  percent_complete: number;
  next_milestone: string;
} {
  const status = EXPANSION_STATUS[countryCode];
  
  if (!status) {
    return {
      stage: 0,
      percent_complete: 0,
      next_milestone: 'Not started',
    };
  }
  
  const stages = Object.keys(ONBOARDING_STAGES).length;
  const percentComplete = (status.current_stage / stages) * 100;
  
  const nextStage = Object.values(ONBOARDING_STAGES).find(
    s => s.stage === status.current_stage + 1
  );
  
  return {
    stage: status.current_stage,
    percent_complete: percentComplete,
    next_milestone: nextStage?.name || 'Complete',
  };
}
