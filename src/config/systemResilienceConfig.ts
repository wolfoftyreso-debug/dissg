/**
 * WAVE 14 — BLOCK DL, DM, DN, DO
 * RESILIENCE, GOVERNANCE, HEALTH & VERSION PLANNING
 * 
 * Systemet tål extrema händelser, har mänsklig kontroll där det behövs,
 * visar sitt tillstånd öppet och förbereder framtiden.
 */

// ============================================
// BLOCK DL: GLOBAL LOAD & FAILURE IMMUNITY
// ============================================

export type ResilienceMode = 
  | 'full_operational'
  | 'degraded'
  | 'read_only'
  | 'regional_isolated'
  | 'emergency';

export interface SystemRegion {
  id: string;
  name: string;
  status: ResilienceMode;
  lastHealthCheck: string;
  latencyMs: number;
  errorRate: number;
  isolatedAt?: string;
  isolationReason?: string;
}

export interface ResilienceState {
  globalMode: ResilienceMode;
  regions: SystemRegion[];
  lastSnapshotAt: string;
  snapshotAvailable: boolean;
  degradedFeatures: string[];
  activeAlerts: string[];
}

export const RESILIENCE_CONFIG = {
  modes: {
    full_operational: {
      name: 'Full drift',
      description: 'Alla funktioner tillgängliga',
      color: 'green',
    },
    degraded: {
      name: 'Degraderad',
      description: 'Vissa funktioner begränsade',
      color: 'yellow',
    },
    read_only: {
      name: 'Endast läsning',
      description: 'Inga uppdateringar, data tillgänglig',
      color: 'orange',
    },
    regional_isolated: {
      name: 'Regional isolering',
      description: 'Regioner frikopplade för skydd',
      color: 'orange',
    },
    emergency: {
      name: 'Nödläge',
      description: 'Minimalt läge, offline snapshots aktiva',
      color: 'red',
    },
  },
  
  immunityMechanisms: {
    regionalIsolation: {
      enabled: true,
      description: 'Isolera regioner vid problem',
      autoTriggerThreshold: { errorRate: 0.1, latencyMs: 5000 },
    },
    readOnlyFallback: {
      enabled: true,
      description: 'Fallback till read-only vid skriv-fel',
      preservesAllData: true,
    },
    gracefulDegradation: {
      enabled: true,
      description: 'Stäng av icke-kritiska funktioner först',
      priorityOrder: ['discovery', 'optimization', 'learning', 'analysis', 'core_data'],
    },
    offlineSnapshots: {
      enabled: true,
      description: 'Regelbundna offline-säkerhetskopior',
      frequencyHours: 6,
      retentionDays: 90,
    },
  },
  
  principle: 'Systemet får aldrig bli svart.',
} as const;

// ============================================
// BLOCK DM: HUMAN-IN-THE-LOOP GOVERNANCE
// ============================================

export type HumanDecisionType = 
  | 'new_standard'
  | 'new_method'
  | 'sensitive_combination'
  | 'federation_rule'
  | 'major_change'
  | 'data_removal';

export interface HumanDecisionRequest {
  id: string;
  type: HumanDecisionType;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedAt: string;
  deadline?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  decidedBy?: string;
  decidedAt?: string;
  decision?: string;
  rationale?: string;
}

export const HUMAN_GOVERNANCE_CONFIG = {
  decisionsRequiringHuman: {
    new_standard: {
      name: 'Nya standarder',
      description: 'Införande av nya datastandards',
      minApprovers: 3,
      escalationDays: 7,
    },
    new_method: {
      name: 'Nya metoder',
      description: 'Nya analysmetoder i produktion',
      minApprovers: 2,
      escalationDays: 5,
    },
    sensitive_combination: {
      name: 'Känsliga kombinationer',
      description: 'Data som kan identifiera individer',
      minApprovers: 3,
      escalationDays: 3,
      requiresPrivacyReview: true,
    },
    federation_rule: {
      name: 'Federationsregler',
      description: 'Ändringar i federationsstyrning',
      minApprovers: 5,
      escalationDays: 14,
      requiresFederationVote: true,
    },
    major_change: {
      name: 'Större ändringar',
      description: 'Betydande systemförändringar',
      minApprovers: 3,
      escalationDays: 7,
    },
    data_removal: {
      name: 'Dataradering',
      description: 'Borttagning av data (ej arkivering)',
      minApprovers: 4,
      escalationDays: 5,
      requiresLegalReview: true,
    },
  },
  
  automatedDecisions: [
    'routine_updates',
    'scheduled_ingests',
    'low_risk_optimizations',
    'cache_management',
    'standard_alerts',
  ],
  
  principle: 'Allt annat = automation.',
} as const;

// ============================================
// BLOCK DN: GLOBAL HEALTH MONITOR
// ============================================

export interface SystemHealthMetrics {
  timestamp: string;
  coverage: {
    countriesActive: number;
    countriesTotal: number;
    kpisActive: number;
    kpisTotal: number;
    percentCovered: number;
  };
  performance: {
    avgLatencyMs: number;
    p95LatencyMs: number;
    requestsPerMinute: number;
    cacheHitRate: number;
  };
  errors: {
    errorRate: number;
    errorsLast24h: number;
    criticalErrors: number;
    warningsActive: number;
  };
  data: {
    freshnessHours: number;
    staleSources: number;
    pendingIngests: number;
    failedIngests: number;
  };
  uncertainty: {
    avgConfidence: number;
    lowConfidenceKpis: number;
    missingDataPoints: number;
  };
  userActivity: {
    activeSessionsLast24h: number;
    queriesLast24h: number;
    exportsLast24h: number;
  };
}

export interface HealthAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  isPublic: boolean;
}

export const HEALTH_MONITOR_CONFIG = {
  metrics: {
    coverage: {
      name: 'Datatäckning',
      warningThreshold: 80,
      criticalThreshold: 60,
      unit: '%',
    },
    latency: {
      name: 'Latens',
      warningThreshold: 1000,
      criticalThreshold: 3000,
      unit: 'ms',
    },
    errorRate: {
      name: 'Felgrad',
      warningThreshold: 0.01,
      criticalThreshold: 0.05,
      unit: '%',
    },
    freshness: {
      name: 'Datafärskhet',
      warningThreshold: 48,
      criticalThreshold: 168,
      unit: 'timmar',
    },
    confidence: {
      name: 'Osäkerhetsnivå',
      warningThreshold: 70,
      criticalThreshold: 50,
      unit: '% genomsnittligt förtroende',
    },
    warnings: {
      name: 'Aktiva varningar',
      warningThreshold: 10,
      criticalThreshold: 50,
      unit: 'stycken',
    },
  },
  
  publicVisibility: {
    allMetricsPublic: true,
    realTimeUpdates: true,
    historicalAccess: true,
    alertsPublic: true,
  },
  
  reporting: {
    frequencyMinutes: 5,
    retentionDays: 365,
    aggregationLevels: ['1min', '5min', '1hour', '1day'],
  },
  
  principle: 'Om hälsan sjunker → syns publikt.',
} as const;

// ============================================
// BLOCK DO: VERSION 2.0 PREP
// ============================================

export interface VersionPlan {
  currentVersion: string;
  plannedVersion: string;
  plannedReleaseDate?: string;
  features: {
    id: string;
    name: string;
    description: string;
    status: 'proposed' | 'approved' | 'in_development' | 'testing' | 'ready';
    breakingChange: boolean;
    migrationPath?: string;
  }[];
  compatibilityPromise: {
    minSupportedVersion: string;
    deprecationNoticeMonths: number;
    parallelVersioning: boolean;
  };
}

export const VERSION_PLANNING_CONFIG = {
  principles: {
    noBreakingChanges: {
      enforced: true,
      description: 'Inga breaking changes utan migration',
    },
    parallelVersions: {
      enabled: true,
      description: 'Gamla och nya versioner körs parallellt',
      overlapMonths: 12,
    },
    clearMigration: {
      required: true,
      description: 'Tydlig migrationsväg för alla ändringar',
    },
    longSupport: {
      minMonths: 24,
      description: 'Minst 24 månaders support per major version',
    },
  },
  
  deprecationPolicy: {
    noticeRequiredMonths: 6,
    documentationRequired: true,
    migrationToolsRequired: true,
    userNotificationRequired: true,
  },
  
  versionNaming: {
    format: 'MAJOR.MINOR',
    majorIncrement: 'Breaking changes or major features',
    minorIncrement: 'New features, improvements',
  },
  
  principle: 'Evolution, inte revolution.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateSystemHealth(
  metrics: SystemHealthMetrics
): { score: number; status: 'healthy' | 'degraded' | 'critical' } {
  const config = HEALTH_MONITOR_CONFIG.metrics;
  let issues = 0;
  let critical = 0;
  
  if (metrics.coverage.percentCovered < config.coverage.warningThreshold) issues++;
  if (metrics.coverage.percentCovered < config.coverage.criticalThreshold) critical++;
  
  if (metrics.performance.avgLatencyMs > config.latency.warningThreshold) issues++;
  if (metrics.performance.avgLatencyMs > config.latency.criticalThreshold) critical++;
  
  if (metrics.errors.errorRate > config.errorRate.warningThreshold) issues++;
  if (metrics.errors.errorRate > config.errorRate.criticalThreshold) critical++;
  
  if (critical > 0) return { score: 30, status: 'critical' };
  if (issues > 2) return { score: 60, status: 'degraded' };
  if (issues > 0) return { score: 80, status: 'degraded' };
  
  return { score: 100, status: 'healthy' };
}

export function determineResilienceMode(
  metrics: SystemHealthMetrics,
  regions: SystemRegion[]
): ResilienceMode {
  const isolatedRegions = regions.filter(r => r.status === 'regional_isolated');
  const failingRegions = regions.filter(r => r.errorRate > 0.1);
  
  if (failingRegions.length === regions.length) return 'emergency';
  if (metrics.errors.errorRate > 0.05) return 'read_only';
  if (isolatedRegions.length > 0) return 'regional_isolated';
  if (metrics.errors.errorRate > 0.01) return 'degraded';
  
  return 'full_operational';
}

export function requiresHumanDecision(actionType: string): boolean {
  const humanRequired = Object.keys(HUMAN_GOVERNANCE_CONFIG.decisionsRequiringHuman);
  return humanRequired.includes(actionType);
}

export const SYSTEM_RESILIENCE_STATUS = {
  version: '14.0',
  blocks: ['DL', 'DM', 'DN', 'DO'],
  capabilities: [
    'failure_immunity',
    'human_governance',
    'health_monitoring',
    'version_planning',
  ],
  currentVersion: '1.1',
  nextPlannedVersion: '2.0',
} as const;

// ============================================
// WAVE 14 COMPLETE STATUS
// ============================================

export const WAVE_14_STATUS = {
  version: '1.1',
  wave: 14,
  completedAt: new Date().toISOString(),
  capabilities: {
    selfDiscovering: true,
    selfOptimizing: true,
    selfLearning: true,
    totalTransparency: true,
    longTermOperations: true,
  },
  blocks: {
    DF: 'auto_discovery_engine_v1',
    DG: 'auto_kpi_engine_v1',
    DH: 'pipeline_optimizer_v1',
    DI: 'relation_discovery_v1',
    DJ: 'learning_feedback_loop_v1',
    DK: 'insight_lifecycle_v1',
    DL: 'resilience_engine_v1',
    DM: 'hitl_governance_v1',
    DN: 'system_health_dashboard_v1',
    DO: 'v2_prep_plan_v1',
  },
  principle: 'Världen förändras – systemet hänger med.',
} as const;

// ============================================
// MODULE — RESILIENCE CAPACITY MAP (RCM)
// "Var finns buffertar, redundans och återhämtningsförmåga?"
// ============================================

export const RCM_CORE_PRINCIPLE = {
  statement: 'Risk utan resiliens skapar rädsla. Resiliens utan risk skapar naivitet. Systemet visar båda.',
  statementEn: 'Risk without resilience creates fear. Resilience without risk creates naivety. The system shows both.',
  enforced: true,
} as const;

// BLOCK SA — RESILIENCE DIMENSIONS
export type ResilienceDimensionId = 
  | 'physical_buffers'
  | 'economic_elasticity'
  | 'institutional_capacity'
  | 'social_cohesion'
  | 'competence_learning'
  | 'ecological_margins';

export interface ResilienceDimension {
  id: ResilienceDimensionId;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  icon: string;
  indicators: string[];
  indicatorsSv: string[];
}

export const RESILIENCE_DIMENSIONS: ResilienceDimension[] = [
  {
    id: 'physical_buffers',
    name: 'Physical Buffers',
    nameSv: 'Fysiska buffertar',
    description: 'Energy reserves, storage capacity, infrastructure redundancy, healthcare capacity',
    descriptionSv: 'Energireserver, lagerkapacitet, infrastrukturredundans, vårdkapacitet',
    icon: '🏗️',
    indicators: ['Energy reserves (days)', 'Hospital beds per capita', 'Infrastructure redundancy'],
    indicatorsSv: ['Energireserver (dagar)', 'Sjukhusplatser per capita', 'Infrastrukturredundans'],
  },
  {
    id: 'economic_elasticity',
    name: 'Economic Elasticity',
    nameSv: 'Ekonomisk elasticitet',
    description: 'Household margins, fiscal space, credit availability',
    descriptionSv: 'Hushållens marginaler, statens handlingsutrymme, kredittillgång',
    icon: '💰',
    indicators: ['Household savings rate', 'Government debt headroom', 'Credit availability'],
    indicatorsSv: ['Hushållens sparkvot', 'Statligt skuldmarginal', 'Kredittillgång'],
  },
  {
    id: 'institutional_capacity',
    name: 'Institutional Capacity',
    nameSv: 'Institutionell kapacitet',
    description: 'Implementation ability, competence, stability, governance quality',
    descriptionSv: 'Genomförandeförmåga, kompetens, stabilitet, styrningskvalitet',
    icon: '🏛️',
    indicators: ['Government effectiveness', 'Regulatory quality', 'Rule of law'],
    indicatorsSv: ['Regeringseffektivitet', 'Regleringskomfort', 'Rättsstatens styrka'],
  },
  {
    id: 'social_cohesion',
    name: 'Social Cohesion',
    nameSv: 'Social sammanhållning',
    description: 'Trust levels, social networks, informal support systems',
    descriptionSv: 'Tillitsnivåer, sociala nätverk, informella stödsystem',
    icon: '🤝',
    indicators: ['Interpersonal trust', 'Civic participation', 'Social support availability'],
    indicatorsSv: ['Mellanmänsklig tillit', 'Medborgerligt deltagande', 'Socialt stöd'],
  },
  {
    id: 'competence_learning',
    name: 'Competence & Learning',
    nameSv: 'Kompetens & lärandeförmåga',
    description: 'Education levels, adaptability, retraining capacity',
    descriptionSv: 'Utbildningsnivåer, anpassningsförmåga, omställningskapacitet',
    icon: '🎓',
    indicators: ['Adult education participation', 'Skills mismatch rate', 'R&D investment'],
    indicatorsSv: ['Vuxenutbildningsdeltagande', 'Kompetensgap', 'FoU-investeringar'],
  },
  {
    id: 'ecological_margins',
    name: 'Ecological Margins',
    nameSv: 'Ekologiska marginaler',
    description: 'Nature\'s absorption capacity, environmental buffers',
    descriptionSv: 'Naturens absorptionsförmåga, miljöbuffertar',
    icon: '🌿',
    indicators: ['Carbon sink capacity', 'Water reserves', 'Biodiversity index'],
    indicatorsSv: ['Koldioxidupptagningsförmåga', 'Vattenreserver', 'Biodiversitetsindex'],
  },
];

// BLOCK SB — CAPACITY METRICS
export interface CapacityMetrics {
  currentLoad: number;
  spareCapacity: number;
  recoverySpeed: number;
  dependencyRisk: number;
}

export interface DimensionScore {
  dimensionId: ResilienceDimensionId;
  metrics: CapacityMetrics;
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

// BLOCK SC — RESILIENCE PROFILE
export interface ResilienceProfile {
  entityId: string;
  entityType: 'country' | 'region' | 'municipality';
  entityName: string;
  entityNameSv: string;
  dimensions: DimensionScore[];
  overallResilience: number;
  overallTrend: 'improving' | 'stable' | 'declining';
  generatedAt: string;
  dataVersion: string;
}

export const RESILIENCE_LEVEL_LABELS = {
  high: { en: 'Strong capacity', sv: 'Stark kapacitet', threshold: 70 },
  medium: { en: 'Moderate capacity', sv: 'Måttlig kapacitet', threshold: 40 },
  low: { en: 'Limited capacity', sv: 'Begränsad kapacitet', threshold: 0 },
} as const;

// BLOCK SD — SHOCK TYPES
export type ShockType = 
  | 'energy_shock'
  | 'economic_downturn'
  | 'demographic_change'
  | 'health_crisis'
  | 'geopolitical_disruption'
  | 'climate_event';

export interface ShockTypeConfig {
  id: ShockType;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  relevantDimensions: ResilienceDimensionId[];
  dimensionWeights: Record<ResilienceDimensionId, number>;
}

export const SHOCK_TYPES: ShockTypeConfig[] = [
  {
    id: 'energy_shock',
    name: 'Energy shock',
    nameSv: 'Energichock',
    description: 'Sudden disruption in energy supply or price',
    descriptionSv: 'Plötslig störning i energiförsörjning eller pris',
    relevantDimensions: ['physical_buffers', 'economic_elasticity', 'institutional_capacity'],
    dimensionWeights: {
      physical_buffers: 0.4, economic_elasticity: 0.3, institutional_capacity: 0.15,
      social_cohesion: 0.05, competence_learning: 0.05, ecological_margins: 0.05,
    },
  },
  {
    id: 'economic_downturn',
    name: 'Economic downturn',
    nameSv: 'Ekonomisk nedgång',
    description: 'Recession or financial crisis',
    descriptionSv: 'Lågkonjunktur eller finanskris',
    relevantDimensions: ['economic_elasticity', 'social_cohesion', 'institutional_capacity'],
    dimensionWeights: {
      physical_buffers: 0.1, economic_elasticity: 0.4, institutional_capacity: 0.2,
      social_cohesion: 0.15, competence_learning: 0.1, ecological_margins: 0.05,
    },
  },
  {
    id: 'health_crisis',
    name: 'Health crisis',
    nameSv: 'Hälsokris',
    description: 'Pandemic or healthcare system overload',
    descriptionSv: 'Pandemi eller överbelastat sjukvårdssystem',
    relevantDimensions: ['physical_buffers', 'institutional_capacity', 'social_cohesion'],
    dimensionWeights: {
      physical_buffers: 0.35, economic_elasticity: 0.1, institutional_capacity: 0.25,
      social_cohesion: 0.2, competence_learning: 0.05, ecological_margins: 0.05,
    },
  },
  {
    id: 'demographic_change',
    name: 'Demographic change',
    nameSv: 'Demografisk förändring',
    description: 'Aging population or migration shifts',
    descriptionSv: 'Åldrande befolkning eller migrationsförändringar',
    relevantDimensions: ['competence_learning', 'social_cohesion', 'economic_elasticity'],
    dimensionWeights: {
      physical_buffers: 0.1, economic_elasticity: 0.25, institutional_capacity: 0.15,
      social_cohesion: 0.2, competence_learning: 0.25, ecological_margins: 0.05,
    },
  },
  {
    id: 'geopolitical_disruption',
    name: 'Geopolitical disruption',
    nameSv: 'Geopolitisk störning',
    description: 'Trade disruption, sanctions, or conflict',
    descriptionSv: 'Handelsstörningar, sanktioner eller konflikt',
    relevantDimensions: ['physical_buffers', 'institutional_capacity', 'economic_elasticity'],
    dimensionWeights: {
      physical_buffers: 0.3, economic_elasticity: 0.25, institutional_capacity: 0.2,
      social_cohesion: 0.15, competence_learning: 0.05, ecological_margins: 0.05,
    },
  },
  {
    id: 'climate_event',
    name: 'Climate event',
    nameSv: 'Klimathändelse',
    description: 'Extreme weather or environmental disaster',
    descriptionSv: 'Extremväder eller miljökatastrof',
    relevantDimensions: ['ecological_margins', 'physical_buffers', 'institutional_capacity'],
    dimensionWeights: {
      physical_buffers: 0.25, economic_elasticity: 0.1, institutional_capacity: 0.2,
      social_cohesion: 0.1, competence_learning: 0.05, ecological_margins: 0.3,
    },
  },
];

// BLOCK SE — STRESS/RESILIENCE ZONES
export type StressResilienceZone = 'critical' | 'pressured' | 'latent_risk' | 'stable';

export const STRESS_RESILIENCE_ZONES: Record<StressResilienceZone, {
  name: string; nameSv: string; description: string; descriptionSv: string; color: string;
}> = {
  critical: {
    name: 'Critical zone', nameSv: 'Kritisk zon',
    description: 'High stress with limited capacity', descriptionSv: 'Hög stress med begränsad kapacitet',
    color: 'hsl(var(--destructive))',
  },
  pressured: {
    name: 'Pressured but manageable', nameSv: 'Pressad men hanterbar',
    description: 'High stress but strong capacity', descriptionSv: 'Hög stress men stark kapacitet',
    color: 'hsl(var(--warning))',
  },
  latent_risk: {
    name: 'Latent vulnerability', nameSv: 'Latent sårbarhet',
    description: 'Low stress but limited reserves', descriptionSv: 'Låg stress men begränsade reserver',
    color: 'hsl(var(--secondary))',
  },
  stable: {
    name: 'Stable zone', nameSv: 'Stabil zon',
    description: 'Low stress with strong reserves', descriptionSv: 'Låg stress med starka reserver',
    color: 'hsl(var(--success))',
  },
};

export function calculateZone(stress: number, resilience: number): StressResilienceZone {
  const highStress = stress >= 60;
  const highResilience = resilience >= 50;
  if (highStress && !highResilience) return 'critical';
  if (highStress && highResilience) return 'pressured';
  if (!highStress && !highResilience) return 'latent_risk';
  return 'stable';
}

// BLOCK SF — EROSION
export const EROSION_WARNING = {
  template_sv: 'Även hög kapacitet kan eroderas om belastning är långvarig.',
  template_en: 'Even high capacity can erode under prolonged stress.',
} as const;

// BLOCK SH — CLARIFICATION
export const RESILIENCE_CLARIFICATION = {
  sv: 'Resiliens betyder inte att problem saknas. Det betyder att systemet har marginaler när problem uppstår.',
  en: 'Resilience does not mean problems are absent. It means the system has margins when problems arise.',
} as const;

// BLOCK SI — GLOBAL SNAPSHOT
export type GlobalResilienceStatus = 'stable' | 'pressured' | 'fragmented';

export interface GlobalResilienceSnapshot {
  status: GlobalResilienceStatus;
  statusSv: string;
  averageScore: number;
  regionalVariation: { region: string; regionSv: string; score: number; trend: 'improving' | 'stable' | 'declining' }[];
  lastUpdated: string;
}

export const GLOBAL_STATUS_LABELS: Record<GlobalResilienceStatus, { sv: string; en: string }> = {
  stable: { sv: 'Stabil', en: 'Stable' },
  pressured: { sv: 'Pressad', en: 'Pressured' },
  fragmented: { sv: 'Fragmenterad', en: 'Fragmented' },
};

// EXAMPLE DATA
export const EXAMPLE_PROFILES: ResilienceProfile[] = [
  {
    entityId: 'SE', entityType: 'country', entityName: 'Sweden', entityNameSv: 'Sverige',
    dimensions: [
      { dimensionId: 'physical_buffers', metrics: { currentLoad: 55, spareCapacity: 45, recoverySpeed: 72, dependencyRisk: 38 }, overallScore: 65, trend: 'stable', lastUpdated: '2024-12-01' },
      { dimensionId: 'economic_elasticity', metrics: { currentLoad: 62, spareCapacity: 38, recoverySpeed: 68, dependencyRisk: 42 }, overallScore: 58, trend: 'declining', lastUpdated: '2024-12-01' },
      { dimensionId: 'institutional_capacity', metrics: { currentLoad: 48, spareCapacity: 52, recoverySpeed: 78, dependencyRisk: 22 }, overallScore: 75, trend: 'stable', lastUpdated: '2024-12-01' },
      { dimensionId: 'social_cohesion', metrics: { currentLoad: 45, spareCapacity: 55, recoverySpeed: 65, dependencyRisk: 28 }, overallScore: 68, trend: 'declining', lastUpdated: '2024-12-01' },
      { dimensionId: 'competence_learning', metrics: { currentLoad: 52, spareCapacity: 48, recoverySpeed: 70, dependencyRisk: 35 }, overallScore: 62, trend: 'stable', lastUpdated: '2024-12-01' },
      { dimensionId: 'ecological_margins', metrics: { currentLoad: 40, spareCapacity: 60, recoverySpeed: 55, dependencyRisk: 45 }, overallScore: 58, trend: 'stable', lastUpdated: '2024-12-01' },
    ],
    overallResilience: 64, overallTrend: 'stable', generatedAt: '2024-12-01', dataVersion: '2024.4',
  },
];
