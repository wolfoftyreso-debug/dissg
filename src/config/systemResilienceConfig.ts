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
