/**
 * WAVE 12: BLOCK CT — 10-YEAR OPERATIONS & EVOLUTION
 * BLOCK CW — METRICS OF TRUTH (INTERNAL CONTROL)
 * 
 * "Historien skrivs inte om – den kompletteras."
 * Om truth metrics faller → pausa expansion.
 */

// ============================================================
// CT1: TECHNICAL SUSTAINABILITY
// ============================================================

export interface TechnicalSustainabilityRule {
  id: string;
  category: 'compatibility' | 'versioning' | 'migration' | 'archival';
  rule_sv: string;
  rule_en: string;
  enforcement: 'automated' | 'policy' | 'both';
  verification_method: string;
}

export const TECHNICAL_SUSTAINABILITY_RULES: TechnicalSustainabilityRule[] = [
  {
    id: 'ts_01',
    category: 'compatibility',
    rule_sv: 'Bakåtkompatibilitet för alla API-versioner i 5 år',
    rule_en: 'Backward compatibility for all API versions for 5 years',
    enforcement: 'automated',
    verification_method: 'Automated regression tests against all supported versions'
  },
  {
    id: 'ts_02',
    category: 'versioning',
    rule_sv: 'Alla standarder versioneras med SemVer',
    rule_en: 'All standards versioned with SemVer',
    enforcement: 'policy',
    verification_method: 'Release checklist verification'
  },
  {
    id: 'ts_03',
    category: 'migration',
    rule_sv: 'Migrationsverktyg tillhandahålls för alla breaking changes',
    rule_en: 'Migration tools provided for all breaking changes',
    enforcement: 'both',
    verification_method: 'Migration test suite + documentation review'
  },
  {
    id: 'ts_04',
    category: 'archival',
    rule_sv: 'Inget försvinner – all data arkiveras permanent',
    rule_en: 'Nothing disappears – all data archived permanently',
    enforcement: 'automated',
    verification_method: 'Archive integrity checks + retrieval tests'
  }
];

// ============================================================
// CT2: KNOWLEDGE SUSTAINABILITY
// ============================================================

export interface KnowledgeSustainabilityRule {
  id: string;
  type: 'learnings' | 'methods' | 'conclusions';
  rule_sv: string;
  rule_en: string;
  retention_period: 'permanent' | '10_years' | '5_years';
  access_after_deprecation: boolean;
}

export const KNOWLEDGE_SUSTAINABILITY_RULES: KnowledgeSustainabilityRule[] = [
  {
    id: 'ks_01',
    type: 'learnings',
    rule_sv: 'Lärdomar versioneras och bevaras permanent',
    rule_en: 'Learnings are versioned and preserved permanently',
    retention_period: 'permanent',
    access_after_deprecation: true
  },
  {
    id: 'ks_02',
    type: 'methods',
    rule_sv: 'Metoder arkiveras med full dokumentation',
    rule_en: 'Methods archived with full documentation',
    retention_period: 'permanent',
    access_after_deprecation: true
  },
  {
    id: 'ks_03',
    type: 'conclusions',
    rule_sv: 'Gamla slutsatser bevaras med kontext',
    rule_en: 'Old conclusions preserved with context',
    retention_period: 'permanent',
    access_after_deprecation: true
  }
];

export const EVOLUTION_PRINCIPLE = {
  sv: 'Historien skrivs inte om – den kompletteras',
  en: 'History is not rewritten – it is complemented'
} as const;

// ============================================================
// 10-YEAR EVOLUTION PLAN
// ============================================================

export interface EvolutionMilestone {
  year: number;
  phase: string;
  goals: string[];
  success_criteria: string[];
  risks: string[];
}

export const TEN_YEAR_EVOLUTION: EvolutionMilestone[] = [
  {
    year: 1,
    phase: 'Foundation',
    goals: [
      '100 federated nodes',
      'G-DSP v1.0 stable',
      'Core API stable',
      'First external integrations'
    ],
    success_criteria: [
      '>90% uptime',
      '>95% API stability',
      '>80% user satisfaction'
    ],
    risks: ['Technical debt', 'Adoption slower than expected']
  },
  {
    year: 2,
    phase: 'Expansion',
    goals: [
      '250 federated nodes',
      'Multi-language support',
      'Academic partnerships',
      'Media integrations'
    ],
    success_criteria: [
      '>50 countries covered',
      '>1000 active API users',
      'First peer-reviewed publications'
    ],
    risks: ['Quality dilution', 'Coordination complexity']
  },
  {
    year: 3,
    phase: 'Consolidation',
    goals: [
      '500 federated nodes',
      'Governance model stable',
      'Self-sustaining finances',
      'Educational programs'
    ],
    success_criteria: [
      'Revenue > operating costs',
      '>90% node transparency score',
      'Academic curriculum adoption'
    ],
    risks: ['Governance disputes', 'Funding gaps']
  },
  {
    year: 5,
    phase: 'Maturity',
    goals: [
      '1000 federated nodes',
      'Global coverage',
      'Industry standard',
      'Policy influence'
    ],
    success_criteria: [
      'Referenced in policy documents',
      '>100 institutional partners',
      'Recognized as authoritative source'
    ],
    risks: ['Regulatory challenges', 'Competition']
  },
  {
    year: 10,
    phase: 'Legacy',
    goals: [
      '5000+ federated nodes',
      'Full federation governance',
      'Operator-independent',
      'Generational knowledge transfer'
    ],
    success_criteria: [
      'Survives operator transition',
      'Multiple independent implementations',
      'Long-term archival proven'
    ],
    risks: ['Technological obsolescence', 'Mission drift']
  }
];

// ============================================================
// CW1: METRICS OF TRUTH — INTERNAL CONTROL
// ============================================================

export interface TruthMetric {
  id: string;
  name_sv: string;
  name_en: string;
  calculation: string;
  target_threshold: number;
  critical_threshold: number;
  action_if_critical: string;
}

export const TRUTH_METRICS: TruthMetric[] = [
  {
    id: 'tm_method_coverage',
    name_sv: '% datapunkter med full metod',
    name_en: '% data points with full methodology',
    calculation: 'data_with_method / total_data_points * 100',
    target_threshold: 95,
    critical_threshold: 80,
    action_if_critical: 'Pause new data ingestion until methodology documented'
  },
  {
    id: 'tm_reproducibility',
    name_sv: '% analyser reproducerbara',
    name_en: '% analyses reproducible',
    calculation: 'reproducible_analyses / total_analyses * 100',
    target_threshold: 90,
    critical_threshold: 75,
    action_if_critical: 'Flag non-reproducible analyses, require fixes'
  },
  {
    id: 'tm_warning_rate',
    name_sv: '% användarfrågor med varning',
    name_en: '% user queries with warnings',
    calculation: 'queries_with_warnings / total_queries * 100',
    target_threshold: 30,
    critical_threshold: 50,
    action_if_critical: 'Review warning calibration, may indicate data quality issues'
  },
  {
    id: 'tm_node_transparency',
    name_sv: '% federerade noder med hög transparens',
    name_en: '% federated nodes with high transparency',
    calculation: 'high_transparency_nodes / total_nodes * 100',
    target_threshold: 80,
    critical_threshold: 60,
    action_if_critical: 'Pause new node onboarding, focus on existing node quality'
  }
];

export interface TruthMetricSnapshot {
  metric_id: string;
  value: number;
  measured_at: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export function evaluateTruthMetric(
  metric: TruthMetric,
  value: number
): 'healthy' | 'warning' | 'critical' {
  if (value >= metric.target_threshold) return 'healthy';
  if (value >= metric.critical_threshold) return 'warning';
  return 'critical';
}

export function shouldPauseExpansion(metrics: TruthMetricSnapshot[]): boolean {
  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  return criticalCount >= 2; // Pause if 2+ metrics are critical
}

// ============================================================
// SYSTEM HEALTH DASHBOARD CONFIG
// ============================================================

export interface SystemHealthCheck {
  category: string;
  checks: {
    name: string;
    endpoint?: string;
    threshold?: number;
  }[];
}

export const SYSTEM_HEALTH_CHECKS: SystemHealthCheck[] = [
  {
    category: 'Data Quality',
    checks: [
      { name: 'Method documentation coverage', threshold: 95 },
      { name: 'Source attribution rate', threshold: 100 },
      { name: 'Reproducibility score', threshold: 90 }
    ]
  },
  {
    category: 'Federation Health',
    checks: [
      { name: 'Active nodes', threshold: 100 },
      { name: 'Sync success rate', threshold: 99 },
      { name: 'Average node transparency', threshold: 80 }
    ]
  },
  {
    category: 'API Reliability',
    checks: [
      { name: 'Uptime', threshold: 99.9 },
      { name: 'Response time p95', threshold: 500 },
      { name: 'Error rate', threshold: 0.1 }
    ]
  }
];
