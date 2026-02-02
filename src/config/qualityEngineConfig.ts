/**
 * BLOCK AK — GLOBAL QUALITY & CONSISTENCY ENGINE
 * Configuration for data quality rules and automatic flagging
 */

// AK1: Quality Rule Types
export interface QualityRuleConfig {
  code: string;
  name: string;
  ruleType: 'anomaly_detection' | 'definition_drift' | 'sudden_jump' | 'source_conflict' | 'missing_data' | 'stale_data';
  appliesTo: 'kpi' | 'media' | 'event' | 'fast_data' | 'all';
  description: string;
  severity: 'info' | 'warning' | 'critical';
  autoAction: 'flag' | 'lower_confidence' | 'stop_feed' | 'quarantine';
  conditionConfig: Record<string, unknown>;
  uiMessage: string;
}

export const QUALITY_RULES: QualityRuleConfig[] = [
  // Anomaly Detection
  {
    code: 'ANOMALY_3SIGMA',
    name: 'Statistisk avvikelse (3σ)',
    ruleType: 'anomaly_detection',
    appliesTo: 'all',
    description: 'Värdet avviker mer än 3 standardavvikelser från historiskt medelvärde',
    severity: 'warning',
    autoAction: 'lower_confidence',
    conditionConfig: { threshold_sigma: 3, min_history_points: 12 },
    uiMessage: 'Ovanligt värde detekterat - kan vara fel eller verklig förändring'
  },
  {
    code: 'ANOMALY_5SIGMA',
    name: 'Extrem avvikelse (5σ)',
    ruleType: 'anomaly_detection',
    appliesTo: 'all',
    description: 'Värdet avviker mer än 5 standardavvikelser',
    severity: 'critical',
    autoAction: 'quarantine',
    conditionConfig: { threshold_sigma: 5, min_history_points: 12 },
    uiMessage: 'Extremt ovanligt värde - verifiering krävs'
  },

  // Sudden Jumps
  {
    code: 'JUMP_10PCT',
    name: 'Snabb förändring (>10%)',
    ruleType: 'sudden_jump',
    appliesTo: 'kpi',
    description: 'Värdet har förändrats mer än 10% sedan föregående mätning',
    severity: 'info',
    autoAction: 'flag',
    conditionConfig: { threshold_percent: 10 },
    uiMessage: 'Snabb förändring observerad'
  },
  {
    code: 'JUMP_20PCT',
    name: 'Stor snabb förändring (>20%)',
    ruleType: 'sudden_jump',
    appliesTo: 'kpi',
    description: 'Värdet har förändrats mer än 20% sedan föregående mätning',
    severity: 'warning',
    autoAction: 'lower_confidence',
    conditionConfig: { threshold_percent: 20 },
    uiMessage: 'Stor snabb förändring - verifiera datakälla'
  },
  {
    code: 'JUMP_50PCT',
    name: 'Extrem förändring (>50%)',
    ruleType: 'sudden_jump',
    appliesTo: 'kpi',
    description: 'Värdet har förändrats mer än 50% sedan föregående mätning',
    severity: 'critical',
    autoAction: 'quarantine',
    conditionConfig: { threshold_percent: 50 },
    uiMessage: 'Extrem förändring - data satt i karantän'
  },

  // Stale Data
  {
    code: 'STALE_7D',
    name: 'Data äldre än 7 dagar',
    ruleType: 'stale_data',
    appliesTo: 'fast_data',
    description: 'Realtidsdata har inte uppdaterats på 7 dagar',
    severity: 'info',
    autoAction: 'flag',
    conditionConfig: { max_age_days: 7 },
    uiMessage: 'Data kan vara inaktuell'
  },
  {
    code: 'STALE_30D',
    name: 'Data äldre än 30 dagar',
    ruleType: 'stale_data',
    appliesTo: 'kpi',
    description: 'KPI har inte uppdaterats på 30 dagar',
    severity: 'warning',
    autoAction: 'lower_confidence',
    conditionConfig: { max_age_days: 30 },
    uiMessage: 'Data har inte uppdaterats på länge'
  },
  {
    code: 'STALE_90D',
    name: 'Data äldre än 90 dagar',
    ruleType: 'stale_data',
    appliesTo: 'all',
    description: 'Data har inte uppdaterats på 90 dagar',
    severity: 'critical',
    autoAction: 'stop_feed',
    conditionConfig: { max_age_days: 90 },
    uiMessage: 'Data är mycket gammal - automatisk feed stoppad'
  },

  // Source Conflicts
  {
    code: 'SOURCE_CONFLICT_5PCT',
    name: 'Källkonflikt (>5% avvikelse)',
    ruleType: 'source_conflict',
    appliesTo: 'kpi',
    description: 'Olika källor rapporterar värden som avviker mer än 5%',
    severity: 'info',
    autoAction: 'flag',
    conditionConfig: { max_deviation: 0.05, min_sources: 2 },
    uiMessage: 'Mindre avvikelse mellan källor'
  },
  {
    code: 'SOURCE_CONFLICT_15PCT',
    name: 'Källkonflikt (>15% avvikelse)',
    ruleType: 'source_conflict',
    appliesTo: 'kpi',
    description: 'Olika källor rapporterar värden som avviker mer än 15%',
    severity: 'warning',
    autoAction: 'lower_confidence',
    conditionConfig: { max_deviation: 0.15, min_sources: 2 },
    uiMessage: 'Betydande avvikelse mellan källor - verifiera'
  },
  {
    code: 'SOURCE_CONFLICT_30PCT',
    name: 'Stor källkonflikt (>30% avvikelse)',
    ruleType: 'source_conflict',
    appliesTo: 'kpi',
    description: 'Olika källor rapporterar värden som avviker mer än 30%',
    severity: 'critical',
    autoAction: 'quarantine',
    conditionConfig: { max_deviation: 0.30, min_sources: 2 },
    uiMessage: 'Allvarlig konflikt mellan källor - data i karantän'
  },

  // Definition Drift
  {
    code: 'DEFINITION_CHANGE',
    name: 'Definitionsförändring detekterad',
    ruleType: 'definition_drift',
    appliesTo: 'kpi',
    description: 'KPI-definition eller beräkningsmetod har förändrats',
    severity: 'critical',
    autoAction: 'flag',
    conditionConfig: {},
    uiMessage: 'Definitionsförändring - jämförelser kan vara missvisande'
  },
  {
    code: 'METHODOLOGY_CHANGE',
    name: 'Metodförändring',
    ruleType: 'definition_drift',
    appliesTo: 'kpi',
    description: 'Insamlingsmetod eller datakälla har förändrats',
    severity: 'warning',
    autoAction: 'flag',
    conditionConfig: {},
    uiMessage: 'Metodförändring - historisk jämförelse påverkas'
  },

  // Missing Data
  {
    code: 'MISSING_EXPECTED',
    name: 'Förväntad data saknas',
    ruleType: 'missing_data',
    appliesTo: 'all',
    description: 'Förväntad uppdatering har inte kommit',
    severity: 'info',
    autoAction: 'flag',
    conditionConfig: {},
    uiMessage: 'Uppdatering saknas'
  },
  {
    code: 'MISSING_CRITICAL',
    name: 'Kritisk data saknas',
    ruleType: 'missing_data',
    appliesTo: 'all',
    description: 'Kritisk data saknas för beräkning',
    severity: 'critical',
    autoAction: 'stop_feed',
    conditionConfig: {},
    uiMessage: 'Kritisk data saknas - beräkning stoppad'
  }
];

// AK2: Auto-Flagging Actions
export interface FlagAction {
  action: 'flag' | 'lower_confidence' | 'stop_feed' | 'quarantine';
  label: string;
  description: string;
  confidenceReduction?: number;
  requiresManualReview: boolean;
  notifyAdmin: boolean;
}

export const FLAG_ACTIONS: Record<string, FlagAction> = {
  flag: {
    action: 'flag',
    label: 'Flagga',
    description: 'Visa varning i UI men behåll data',
    requiresManualReview: false,
    notifyAdmin: false
  },
  lower_confidence: {
    action: 'lower_confidence',
    label: 'Sänk konfidenspoäng',
    description: 'Sänk confidence-score och visa varning',
    confidenceReduction: 0.2,
    requiresManualReview: false,
    notifyAdmin: false
  },
  stop_feed: {
    action: 'stop_feed',
    label: 'Stoppa feed',
    description: 'Stoppa automatiska uppdateringar tills problemet åtgärdats',
    requiresManualReview: true,
    notifyAdmin: true
  },
  quarantine: {
    action: 'quarantine',
    label: 'Karantän',
    description: 'Isolera data helt tills manuell verifiering skett',
    requiresManualReview: true,
    notifyAdmin: true
  }
};

// Quality Status Colors
export const QUALITY_STATUS_COLORS = {
  good: 'hsl(var(--accent))',
  info: 'hsl(var(--muted-foreground))',
  warning: 'hsl(45, 93%, 47%)', // Amber
  critical: 'hsl(var(--destructive))'
} as const;

// Helper functions
export function getQualityRule(code: string): QualityRuleConfig | undefined {
  return QUALITY_RULES.find(r => r.code === code);
}

export function getRulesForEntity(entityType: 'kpi' | 'media' | 'event' | 'fast_data'): QualityRuleConfig[] {
  return QUALITY_RULES.filter(r => r.appliesTo === entityType || r.appliesTo === 'all');
}

export function calculateAdjustedConfidence(
  originalConfidence: number,
  flags: Array<{ severity: 'info' | 'warning' | 'critical'; action: string }>
): number {
  let confidence = originalConfidence;
  
  for (const flag of flags) {
    if (flag.action === 'lower_confidence') {
      const reduction = FLAG_ACTIONS.lower_confidence.confidenceReduction || 0.2;
      confidence *= (1 - reduction);
    }
    if (flag.severity === 'critical') {
      confidence *= 0.5;
    } else if (flag.severity === 'warning') {
      confidence *= 0.8;
    }
  }
  
  return Math.max(0, Math.min(1, confidence));
}

export function shouldShowWarning(flags: Array<{ severity: 'info' | 'warning' | 'critical' }>): boolean {
  return flags.some(f => f.severity === 'warning' || f.severity === 'critical');
}

export function getHighestSeverity(flags: Array<{ severity: 'info' | 'warning' | 'critical' }>): 'info' | 'warning' | 'critical' | null {
  if (flags.some(f => f.severity === 'critical')) return 'critical';
  if (flags.some(f => f.severity === 'warning')) return 'warning';
  if (flags.some(f => f.severity === 'info')) return 'info';
  return null;
}

// ============================================================
// WAVE 11: BLOCK CM — PUBLIC REPRODUCIBILITY ENGINE
// BLOCK CN — PUBLIC FEEDBACK & CORRECTION LOOP
// ============================================================

export interface ReproducibilityPackage {
  id: string;
  analysis_type: 'single_value' | 'comparison' | 'trend' | 'correlation' | 'index';
  title: string;
  query: { kpi_ids: string[]; region_codes: string[]; period_start: string; period_end: string };
  method: { method_id: string; method_version: string; formula?: string };
  sources: { source_id: string; source_name: string; source_url: string; checksum: string }[];
  original_result: { value: unknown; calculated_at: string; confidence: number };
  reproducibility: { fully_reproducible: boolean; blockers?: string[] };
}

export const REPRODUCE_BUTTON_CONFIG = {
  always_visible: true,
  position: 'top-right' as const,
  label: { sv: 'Återskapa analys', en: 'Reproduce analysis' }
};

export interface ForkedAnalysis {
  id: string;
  original_id: string;
  forked_at: string;
  forked_by: string;
  changes: { field: string; original_value: unknown; new_value: unknown }[];
  visibility: 'private' | 'public' | 'unlisted';
}

export type FeedbackType = 'error_report' | 'method_critique' | 'source_suggestion' | 'improvement_proposal' | 'data_correction';

export interface FeedbackSubmission {
  id: string;
  type: FeedbackType;
  submitted_at: string;
  target_type: 'kpi' | 'method' | 'source' | 'visualization' | 'general';
  target_id?: string;
  title: string;
  description: string;
  status: 'pending' | 'acknowledged' | 'investigating' | 'resolved' | 'rejected';
  public: true; // Always public
}

export const CORRECTION_POLICIES = [
  { rule: 'Inget tas bort', enforcement: 'strict' as const, rationale: 'Felaktig data märks som korrigerad, inte raderad.' },
  { rule: 'Fel rättas via version', enforcement: 'strict' as const, rationale: 'Korrigeringar skapar ny version med länk till original.' },
  { rule: 'Ändringslogg synlig', enforcement: 'strict' as const, rationale: 'Alla ändringar loggas med tidsstämpel och anledning.' }
] as const;

export interface RevisionEntry {
  id: string;
  entity_type: 'kpi_value' | 'method' | 'source' | 'analysis';
  entity_id: string;
  revision_number: number;
  created_at: string;
  change_type: 'correction' | 'update' | 'methodology_change';
  change_summary: string;
  reason: string;
  previous_revision_id?: string;
}
