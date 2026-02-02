/**
 * WAVE 14 — BLOCK DF, DG, DH
 * AUTOMATED DATA DISCOVERY & PIPELINE OPTIMIZATION
 * 
 * Systemet hittar ny data, föreslår KPIs och optimerar sig självt.
 */

// ============================================
// BLOCK DF: AUTOMATED DATA DISCOVERY
// ============================================

export type DiscoverySourceType = 
  | 'open_data_portal'
  | 'government_site'
  | 'rss_press'
  | 'research_metadata'
  | 'api_catalog';

export interface DiscoverySource {
  id: string;
  type: DiscoverySourceType;
  name: string;
  url: string;
  scanFrequency: 'hourly' | 'daily' | 'weekly';
  lastScanned: string | null;
  discoveredItems: number;
  isActive: boolean;
}

export interface DiscoveredDataset {
  id: string;
  sourceId: string;
  title: string;
  description: string;
  format: string[];
  updateFrequency: string;
  coverage: {
    geographic: string[];
    temporal: { start: string; end: string };
  };
  suggestedCategory: string;
  suggestedKpis: string[];
  qualityScore: number;
  discoveredAt: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'ingesting';
  reviewNotes?: string;
}

export const DISCOVERY_MECHANISMS: Record<DiscoverySourceType, {
  name: string;
  description: string;
  scanPatterns: string[];
  priorityLevel: number;
}> = {
  open_data_portal: {
    name: 'Open Data Portaler',
    description: 'Skannar officiella öppna data-portaler',
    scanPatterns: ['CKAN', 'DCAT', 'Socrata', 'ArcGIS Hub'],
    priorityLevel: 1,
  },
  government_site: {
    name: 'Myndighetssajter',
    description: 'Skannar myndigheter och officiella organ',
    scanPatterns: ['statistik', 'öppna data', 'publikationer', 'rapporter'],
    priorityLevel: 2,
  },
  rss_press: {
    name: 'RSS & Pressmeddelanden',
    description: 'Övervakar nyheter om datauppdateringar',
    scanPatterns: ['ny statistik', 'uppdaterad data', 'publicering'],
    priorityLevel: 3,
  },
  research_metadata: {
    name: 'Forskningsmetadata',
    description: 'Skannar akademiska databaser och repositories',
    scanPatterns: ['DataCite', 'Zenodo', 'Figshare', 'OSF'],
    priorityLevel: 4,
  },
  api_catalog: {
    name: 'API-kataloger',
    description: 'Upptäcker nya API-endpoints',
    scanPatterns: ['OpenAPI', 'GraphQL', 'REST catalog'],
    priorityLevel: 2,
  },
};

export const DISCOVERY_WORKFLOW = {
  steps: [
    { step: 1, action: 'scan', description: 'Skanna källa enligt schema' },
    { step: 2, action: 'extract', description: 'Extrahera metadata' },
    { step: 3, action: 'classify', description: 'Klassificera automatiskt' },
    { step: 4, action: 'score', description: 'Bedöm kvalitet och relevans' },
    { step: 5, action: 'queue', description: 'Lägg till i review-kö' },
    { step: 6, action: 'review', description: 'Mänsklig granskning (gate)' },
    { step: 7, action: 'ingest', description: 'Starta ingest-pipeline' },
  ],
  reviewRequired: true,
  autoApproveThreshold: null, // Aldrig auto-approve
} as const;

// ============================================
// BLOCK DG: AUTOMATED KPI & SIGNAL EXPANSION
// ============================================

export interface SuggestedKPI {
  id: string;
  name: string;
  suggestedCode: string;
  description: string;
  unit: string;
  sourceDatasetId: string;
  suggestedDomain: string;
  suggestedNormalization: 'per_capita' | 'percentage' | 'index' | 'raw' | 'log_scale';
  calculationMethod: string;
  confidence: number;
  discoveredAt: string;
  status: 'suggested' | 'approved' | 'rejected' | 'active';
  reviewedBy?: string;
  reviewedAt?: string;
}

export const KPI_DISCOVERY_RULES = {
  identificationCriteria: [
    'Numerisk tidsserie med minst 5 datapunkter',
    'Geografisk täckning identifierbar',
    'Källa verifierbar',
    'Uppdateringsfrekvens känd',
  ],
  
  domainClassification: {
    economy: ['BNP', 'arbetslöshet', 'inflation', 'handel', 'export', 'import'],
    health: ['dödstal', 'sjukdom', 'vård', 'hälsa', 'livslängd'],
    environment: ['utsläpp', 'klimat', 'energi', 'vatten', 'luft'],
    education: ['utbildning', 'skola', 'kunskap', 'kompetens'],
    governance: ['demokrati', 'korruption', 'rättsstat', 'förtroende'],
    social: ['jämlikhet', 'fattigdom', 'bostäder', 'kriminalitet'],
  },
  
  normalizationSuggestion: {
    population_related: 'per_capita',
    ratio_or_share: 'percentage',
    composite: 'index',
    absolute_count: 'raw',
    exponential_growth: 'log_scale',
  },
  
  humanApprovalRequired: true,
  disclaimer: 'Människa godkänner – systemet gör jobbet.',
} as const;

// ============================================
// BLOCK DH: SELF-OPTIMIZING PIPELINES
// ============================================

export interface PipelineMetrics {
  pipelineId: string;
  name: string;
  currentFrequency: string;
  suggestedFrequency: string;
  lastRunDuration: number;
  averageRunDuration: number;
  errorRate: number;
  dataFreshness: number; // hours since last update
  costPerRun: number;
  criticalityScore: number;
}

export interface OptimizationSuggestion {
  id: string;
  pipelineId: string;
  type: 'frequency' | 'batching' | 'priority' | 'cost';
  currentState: string;
  suggestedState: string;
  expectedImprovement: string;
  riskLevel: 'low' | 'medium' | 'high';
  autoApplicable: boolean;
  appliedAt?: string;
}

export const PIPELINE_OPTIMIZATION_CONFIG = {
  rules: {
    frequency: {
      description: 'Justera cron-frekvens baserat på dataändringshastighet',
      factors: ['change_velocity', 'user_demand', 'source_update_pattern'],
    },
    batching: {
      description: 'Batcha relaterade jobb för effektivitet',
      factors: ['shared_dependencies', 'geographic_overlap', 'time_correlation'],
    },
    priority: {
      description: 'Prioritera kritiska källor',
      factors: ['usage_frequency', 'downstream_dependencies', 'data_criticality'],
    },
    cost: {
      description: 'Sänk kostnad utan dataförlust',
      factors: ['compute_efficiency', 'storage_optimization', 'cache_utilization'],
    },
  },
  
  autoOptimization: {
    enabled: true,
    lowRiskOnly: true,
    requiresNotification: true,
    rollbackEnabled: true,
  },
  
  principle: 'Inga manuella tuning-möten.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function classifyDiscoveredDataset(
  metadata: Partial<DiscoveredDataset>
): { category: string; kpis: string[]; quality: number } {
  // Simplified classification logic
  const category = 'economy'; // Would use ML in production
  const kpis = metadata.suggestedKpis || [];
  const quality = calculateQualityScore(metadata);
  
  return { category, kpis, quality };
}

function calculateQualityScore(metadata: Partial<DiscoveredDataset>): number {
  let score = 0;
  
  if (metadata.format?.length) score += 20;
  if (metadata.updateFrequency) score += 20;
  if (metadata.coverage?.geographic?.length) score += 20;
  if (metadata.coverage?.temporal?.start) score += 20;
  if (metadata.description && metadata.description.length > 50) score += 20;
  
  return score;
}

export function suggestNormalization(
  unit: string,
  values: number[]
): 'per_capita' | 'percentage' | 'index' | 'raw' | 'log_scale' {
  if (unit.includes('per') || unit.includes('capita')) return 'per_capita';
  if (unit.includes('%') || unit.includes('andel')) return 'percentage';
  if (Math.max(...values) / Math.min(...values) > 1000) return 'log_scale';
  return 'raw';
}

export const AUTO_DISCOVERY_STATUS = {
  version: '14.0',
  blocks: ['DF', 'DG', 'DH'],
  capabilities: [
    'automated_source_scanning',
    'kpi_suggestion',
    'pipeline_optimization',
  ],
  humanGateRequired: true,
} as const;
