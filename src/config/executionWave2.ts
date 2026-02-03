/**
 * GLOBAL INFINITY SYSTEM — EXECUTION WAVE 2
 * 
 * "200 personer. Inget stopp. Ingen refaktor senare."
 * 
 * Master execution configuration defining all blocks,
 * team assignments, outputs, and dependencies.
 */

// =============================================================================
// EXECUTION OVERVIEW
// =============================================================================

export const EXECUTION_WAVE_2 = {
  version: '2.0.0',
  totalPersonnel: 200,
  totalTeams: 31,
  philosophy: 'Det här är inte ett system för makt. Det är ett system för verklighet.',
};

// =============================================================================
// BLOCK DEFINITIONS
// =============================================================================

export interface ExecutionBlock {
  blockId: string;
  blockName: string;
  teamSize: { teams: number; personsPerTeam: number; total: number };
  owner: string;
  output: string;
  subTasks: {
    taskId: string;
    taskName: string;
    description: string;
    deliverable: string;
  }[];
  dependencies: string[];
  parallelizable: boolean;
}

export const EXECUTION_BLOCKS: ExecutionBlock[] = [
  // ==========================================================================
  // BLOCK M — GLOBAL KPI MASTER LIST
  // ==========================================================================
  {
    blockId: 'M',
    blockName: 'GLOBAL KPI MASTER LIST (1000+ KPI)',
    teamSize: { teams: 5, personsPerTeam: 10, total: 50 },
    owner: 'Chief Data Officer',
    output: 'kpi_master_v1.yaml',
    subTasks: [
      {
        taskId: 'M1',
        taskName: 'PRODUCERA 1000 KPI',
        description: 'Skapa alla mätbara indikatorer som existerar. Om det finns data → KPI.',
        deliverable: 'kpi_master_v1.yaml med 1000+ KPI:er',
      },
    ],
    dependencies: [],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK N — GLOBAL DATASOURCE TOTAL TAKEOVER
  // ==========================================================================
  {
    blockId: 'N',
    blockName: 'GLOBAL DATASOURCE TOTAL TAKEOVER',
    teamSize: { teams: 6, personsPerTeam: 10, total: 60 },
    owner: 'Head of Ingest',
    output: 'sources_global_v1.yaml',
    subTasks: [
      {
        taskId: 'N1',
        taskName: 'INVENTERA ALLA DATAKÄLLOR',
        description: 'Lista ALLA institutioner på planeten som publicerar strukturerad statistik.',
        deliverable: 'sources_global_v1.yaml med 300-500 källor',
      },
    ],
    dependencies: [],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK O — INGEST PIPELINE FACTORY
  // ==========================================================================
  {
    blockId: 'O',
    blockName: 'INGEST PIPELINE FACTORY (MASS PRODUKTION)',
    teamSize: { teams: 4, personsPerTeam: 10, total: 40 },
    owner: 'Platform Lead',
    output: '1 pipeline per källa',
    subTasks: [
      {
        taskId: 'O1',
        taskName: 'SKAPA PIPELINE-GENERATOR',
        description: 'Generator som tar source.yaml → connector + cron + schema-watcher + storage + event emitter',
        deliverable: 'generate_pipeline() function',
      },
      {
        taskId: 'O2',
        taskName: 'BACKFILL ENGINE',
        description: 'Automatisk historik, chunkad, retry-safe, rate-aware',
        deliverable: 'backfill_engine_v1',
      },
    ],
    dependencies: ['N'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK P — SEMANTIC CORE
  // ==========================================================================
  {
    blockId: 'P',
    blockName: 'SEMANTIC CORE (GLOBALT SPRÅK)',
    teamSize: { teams: 3, personsPerTeam: 10, total: 30 },
    owner: 'Chief Architect',
    output: 'semantic_core_v1/',
    subTasks: [
      {
        taskId: 'P1',
        taskName: 'GLOBAL KPI DICTIONARY',
        description: 'Alla KPI med synonymer, alias, deprecated-mapping',
        deliverable: 'kpi_dictionary.yaml',
      },
      {
        taskId: 'P2',
        taskName: 'GEO UNIVERSUM',
        description: 'ISO countries, ADM1/ADM2, NUTS, custom regions, city clusters',
        deliverable: 'geo_universe.yaml',
      },
      {
        taskId: 'P3',
        taskName: 'DEMOGRAPHIC CANON',
        description: 'Låsta dimensioner: ålder, kön, migration, utbildning, hushåll',
        deliverable: 'demographic_canon.yaml',
      },
    ],
    dependencies: ['M'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK Q — GLOBAL MASTER INDEX + 20 SUB-INDEX
  // ==========================================================================
  {
    blockId: 'Q',
    blockName: 'GLOBAL MASTER INDEX + 20 SUB-INDEX',
    teamSize: { teams: 3, personsPerTeam: 10, total: 30 },
    owner: 'Head of Analytics',
    output: 'index_engine_v1',
    subTasks: [
      {
        taskId: 'Q1',
        taskName: 'GLOBAL MASTER INDEX',
        description: '5 pelare, 25+ KPI, viktad, osäkerhet per land',
        deliverable: 'global_master_index.yaml',
      },
      {
        taskId: 'Q2',
        taskName: 'TEMATISKA SUBINDEX (20+)',
        description: 'Health, Workforce, Education, Innovation, Housing, Energy, etc.',
        deliverable: 'sub_indexes/*.yaml',
      },
    ],
    dependencies: ['M', 'P'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK R — RELEVANCE, SIGNAL & ALERT ENGINE
  // ==========================================================================
  {
    blockId: 'R',
    blockName: 'RELEVANCE, SIGNAL & ALERT ENGINE',
    teamSize: { teams: 2, personsPerTeam: 10, total: 20 },
    owner: 'Intelligence Lead',
    output: 'signal_engine_v1',
    subTasks: [
      {
        taskId: 'R1',
        taskName: 'RELEVANCE SCORING',
        description: 'Impact, acceleration, breadth, persistence, confidence per KPI/Region/Country/Index',
        deliverable: 'relevance_scorer.ts',
      },
      {
        taskId: 'R2',
        taskName: 'SIGNAL TYPES',
        description: 'Early warning, structural decline, sudden shock, divergence, convergence',
        deliverable: 'signal_types.yaml',
      },
    ],
    dependencies: ['M', 'Q'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK S — INFINITY QUERY ENGINE (API)
  // ==========================================================================
  {
    blockId: 'S',
    blockName: 'INFINITY QUERY ENGINE (API)',
    teamSize: { teams: 4, personsPerTeam: 10, total: 40 },
    owner: 'API Lead',
    output: '/query, /compare, /correlate, /simulate',
    subTasks: [
      {
        taskId: 'S1',
        taskName: 'DECLARATIVE QUERY DSL',
        description: 'what/where/when/who/ops/output struktur med query-plan och validation',
        deliverable: 'query_dsl_spec.ts',
      },
      {
        taskId: 'S2',
        taskName: 'QUERY OPTIMIZER',
        description: 'Cache, dedup, cost estimation, rate control',
        deliverable: 'query_optimizer.ts',
      },
    ],
    dependencies: ['M', 'N', 'P'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK T — APPLE-LEVEL VISUAL SYSTEM
  // ==========================================================================
  {
    blockId: 'T',
    blockName: 'APPLE-LEVEL VISUAL SYSTEM',
    teamSize: { teams: 4, personsPerTeam: 10, total: 40 },
    owner: 'Design Lead',
    output: 'design_system_v1',
    subTasks: [
      {
        taskId: 'T1',
        taskName: 'DESIGN TOKENS',
        description: 'Färger, spacing, typography, motion, dark/light',
        deliverable: 'design_tokens.ts',
      },
      {
        taskId: 'T2',
        taskName: 'VISUAL COMPONENTS',
        description: 'Global map, smooth curves, index cards, scatter matrix, sankey, heat layers, trend ladders',
        deliverable: 'visual_components/*.tsx',
      },
    ],
    dependencies: [],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK U — BUILD-YOUR-OWN REALITY
  // ==========================================================================
  {
    blockId: 'U',
    blockName: 'BUILD-YOUR-OWN REALITY (POWER USERS)',
    teamSize: { teams: 2, personsPerTeam: 10, total: 20 },
    owner: 'UX Lead',
    output: 'dashboard_engine_v1',
    subTasks: [
      {
        taskId: 'U1',
        taskName: 'DASHBOARD AS CODE',
        description: 'JSON dashboards, versionerade, delbara, embedbara, API-drivna',
        deliverable: 'dashboard_engine.ts',
      },
    ],
    dependencies: ['S', 'T'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK V — MONETIZATION & CONTROL PLANE
  // ==========================================================================
  {
    blockId: 'V',
    blockName: 'MONETIZATION & CONTROL PLANE',
    teamSize: { teams: 2, personsPerTeam: 10, total: 20 },
    owner: 'Platform + Biz',
    output: 'billing_engine_v1',
    subTasks: [
      {
        taskId: 'V1',
        taskName: 'FEATURE GATING',
        description: 'Gate på KPI-count, history, simulation, feeds, rate',
        deliverable: 'feature_gates.ts',
      },
      {
        taskId: 'V2',
        taskName: 'SUBSCRIPTIONS',
        description: 'Free, Plus, Pro, Enterprise - teknisk enforcement',
        deliverable: 'subscription_tiers.ts',
      },
    ],
    dependencies: ['S'],
    parallelizable: true,
  },

  // ==========================================================================
  // BLOCK W — TRUST, TRANSPARENCY, IMMUNITY
  // ==========================================================================
  {
    blockId: 'W',
    blockName: 'TRUST, TRANSPARENCY, IMMUNITY',
    teamSize: { teams: 1, personsPerTeam: 10, total: 10 },
    owner: 'Trust Lead',
    output: 'global trust layer',
    subTasks: [
      {
        taskId: 'W1',
        taskName: 'EVERYWHERE SHOW',
        description: 'source, method, confidence, coverage, version - utan detta → blockera release',
        deliverable: 'trust_layer.ts',
      },
    ],
    dependencies: [],
    parallelizable: true,
  },
];

// =============================================================================
// DOMAIN KPI TARGETS
// =============================================================================

export const KPI_DOMAIN_TARGETS = {
  health: { minimum: 200, examples: ['life_expectancy', 'infant_mortality', 'hospital_beds_per_capita'] },
  economy: { minimum: 200, examples: ['gdp_per_capita', 'inflation_rate', 'unemployment_rate'] },
  workforce_productivity: { minimum: 150, examples: ['labor_force_participation', 'output_per_hour', 'wage_growth'] },
  education_skills: { minimum: 100, examples: ['literacy_rate', 'tertiary_enrollment', 'pisa_scores'] },
  demographics_migration: { minimum: 100, examples: ['population_growth', 'net_migration', 'fertility_rate'] },
  crime_safety: { minimum: 100, examples: ['homicide_rate', 'incarceration_rate', 'road_deaths'] },
  housing_urbanization: { minimum: 80, examples: ['house_price_to_income', 'urban_population_pct', 'homelessness_rate'] },
  energy_resources: { minimum: 80, examples: ['energy_intensity', 'renewable_share', 'electricity_access'] },
  infrastructure_transport: { minimum: 80, examples: ['road_density', 'rail_coverage', 'port_efficiency'] },
  environment_climate: { minimum: 80, examples: ['co2_emissions_per_capita', 'air_quality_pm25', 'forest_coverage'] },
  digitalization_connectivity: { minimum: 50, examples: ['internet_penetration', '5g_coverage', 'digital_skills_index'] },
  governance_institutions: { minimum: 50, examples: ['corruption_perception', 'rule_of_law', 'government_effectiveness'] },
};

export const TOTAL_KPI_TARGET = Object.values(KPI_DOMAIN_TARGETS).reduce((sum, d) => sum + d.minimum, 0);

// =============================================================================
// DATASOURCE REGIONS
// =============================================================================

export const DATASOURCE_REGIONS = [
  { region: 'EU', sources: ['Eurostat', '27 national statistics offices'] },
  { region: 'USA', sources: ['Census Bureau', 'BLS', 'BEA', 'Federal Reserve', '50 state agencies'] },
  { region: 'Canada', sources: ['Statistics Canada'] },
  { region: 'UK', sources: ['ONS', 'NHS Digital'] },
  { region: 'OECD', sources: ['OECD.Stat'] },
  { region: 'Latin America', sources: ['ECLAC', 'national offices'] },
  { region: 'Africa', sources: ['AfDB', 'national offices'] },
  { region: 'Middle East', sources: ['national offices', 'IMF regional'] },
  { region: 'South Asia', sources: ['World Bank regional', 'national offices'] },
  { region: 'East Asia', sources: ['national offices', 'ADB'] },
  { region: 'Oceania', sources: ['ABS Australia', 'Stats NZ'] },
  { region: 'Global', sources: ['World Bank', 'IMF', 'UN agencies', 'WHO', 'ILO', 'FAO'] },
];

export const DATASOURCE_TARGET = { minimum: 300, maximum: 500 };

// =============================================================================
// SUB-INDEX DEFINITIONS
// =============================================================================

export const SUB_INDEXES = [
  'Health Index',
  'Workforce Index',
  'Productivity Index',
  'Education Index',
  'Innovation Index',
  'Housing Stress Index',
  'Energy Security Index',
  'Institutional Trust Index',
  'Digital Readiness Index',
  'Migration Pressure Index',
  'Youth Outlook Index',
  'Aging Index',
  'Urban Stress Index',
  'Climate Vulnerability Index',
  'Economic Resilience Index',
  'Social Mobility Index',
  'Gender Equality Index',
  'Child Wellbeing Index',
  'Infrastructure Quality Index',
  'Financial Stability Index',
];

// =============================================================================
// EXECUTION UTILITIES
// =============================================================================

export function getBlockDependencyOrder(): string[] {
  // Topological sort of blocks
  const order: string[] = [];
  const visited = new Set<string>();
  
  function visit(blockId: string) {
    if (visited.has(blockId)) return;
    const block = EXECUTION_BLOCKS.find(b => b.blockId === blockId);
    if (!block) return;
    
    for (const dep of block.dependencies) {
      visit(dep);
    }
    
    visited.add(blockId);
    order.push(blockId);
  }
  
  for (const block of EXECUTION_BLOCKS) {
    visit(block.blockId);
  }
  
  return order;
}

export function getParallelizableGroups(): string[][] {
  const groups: string[][] = [];
  const completed = new Set<string>();
  
  while (completed.size < EXECUTION_BLOCKS.length) {
    const group: string[] = [];
    
    for (const block of EXECUTION_BLOCKS) {
      if (completed.has(block.blockId)) continue;
      
      const depsComplete = block.dependencies.every(d => completed.has(d));
      if (depsComplete) {
        group.push(block.blockId);
      }
    }
    
    if (group.length === 0) break; // Circular dependency
    
    groups.push(group);
    group.forEach(b => completed.add(b));
  }
  
  return groups;
}

export function getTotalPersonnel(): number {
  return EXECUTION_BLOCKS.reduce((sum, b) => sum + b.teamSize.total, 0);
}

// =============================================================================
// EXECUTION STATUS TRACKING
// =============================================================================

export type BlockStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed' | 'failed';

export interface BlockProgress {
  blockId: string;
  status: BlockStatus;
  progress: number; // 0-100
  tasksCompleted: string[];
  blockers: string[];
  startedAt: string | null;
  completedAt: string | null;
}

export interface ExecutionDashboard {
  waveId: string;
  startedAt: string;
  
  blocks: BlockProgress[];
  
  overall: {
    totalBlocks: number;
    completed: number;
    inProgress: number;
    blocked: number;
    notStarted: number;
    progressPercent: number;
  };
  
  personnel: {
    total: number;
    allocated: number;
    available: number;
  };
}

// =============================================================================
// FINAL ORDER
// =============================================================================

export const FINAL_ORDER = {
  locked: true,
  statement: `Det här är inte ett system för makt.
Det är ett system för verklighet.
Alla får se. De som vill ligga före betalar.`,
};
