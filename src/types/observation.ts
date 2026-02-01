// Förklarbarhet & Spårbarhetssystem - Typdefinitioner

export type ObservationType = 
  | 'trend_deviation'
  | 'threshold_breach'
  | 'correlation_detected'
  | 'pattern_match'
  | 'lag_signal'
  | 'anomaly';

export type AnalysisStatus = 'pending' | 'in_progress' | 'completed' | 'verified';

export type AnalysisMethod = 
  | 'trend_detection'
  | 'change_point_detection'
  | 'correlation_analysis'
  | 'lag_analysis'
  | 'regression'
  | 'decomposition'
  | 'anomaly_detection';

// Språk & semantik - endast observationsspråk
export const OBSERVATION_PHRASES = {
  indicates: 'Data indikerar',
  coincides: 'Mönstret sammanfaller med',
  preceded: 'Förändringen föregicks av',
  correlation: 'Korrelation observerad, kausalitet ej fastställd',
  continuous: 'har förändrats kontinuerligt',
  detected: 'Signal detekterad',
} as const;

// ============================================
// OBSERVATION (Iakttagelse)
// ============================================
export interface Observation {
  id: string;
  observation_type: ObservationType;
  title: string;
  description: string; // Alltid observationsspråk
  
  kpi_id: string;
  kpi_value_id?: string;
  kpi_name?: string; // Joined
  
  signal_strength: number; // 0-100
  confidence_level: number; // 0-100
  
  observation_period_start: string;
  observation_period_end: string;
  detected_at: string;
  
  status: AnalysisStatus;
  acknowledged_at?: string;
  acknowledged_by?: string;
  
  analysis_version: string;
  model_version: string;
  
  created_at: string;
}

// ============================================
// ANALYSIS CHAIN - 5 Nivåer
// ============================================
export type AnalysisLevel = 1 | 2 | 3 | 4 | 5;

export const ANALYSIS_LEVEL_TITLES: Record<AnalysisLevel, string> = {
  1: 'Analysöversikt',
  2: 'Rotorsaksanalys',
  3: 'Faktoranalys',
  4: 'Datakällor & Bearbetning',
  5: 'Rå Tidsserie',
};

export const ANALYSIS_LEVEL_DESCRIPTIONS: Record<AnalysisLevel, string> = {
  1: 'Vad har förändrats, när, hur stark signal, hur säker slutsats',
  2: 'Vilken analysmetod användes och varför',
  3: 'Bidragsstyrka per faktor med osäkerhet',
  4: 'Fullständig datakedja från källa till värde',
  5: 'Originalvärden på datapunktsnivå',
};

export interface AnalysisChain {
  id: string;
  observation_id: string;
  level: AnalysisLevel;
  level_title: string;
  level_content: AnalysisLevelContent;
  
  analysis_method?: AnalysisMethod;
  method_rationale?: string;
  alternatives_tested?: AlternativeMethod[];
  
  sequence_order: number;
  created_at: string;
}

// Innehåll per nivå
export interface AnalysisLevelContent {
  // Nivå 1: Översikt
  summary?: string;
  change_description?: string;
  deviation_start?: string;
  signal_strength?: number;
  confidence?: number;
  top_factors?: string[];
  
  // Nivå 2: Metod
  method_description?: string;
  why_chosen?: string;
  statistical_details?: Record<string, unknown>;
  
  // Nivå 3: Faktorer (separat tabell)
  
  // Nivå 4: Datakällor
  source_info?: SourceInfo[];
  
  // Nivå 5: Rådata
  time_series?: TimeSeriesPoint[];
  missing_data_markers?: string[];
  correction_markers?: string[];
  methodology_change_markers?: string[];
}

export interface AlternativeMethod {
  method: AnalysisMethod;
  reason_rejected: string;
  result_summary?: string;
}

export interface SourceInfo {
  data_source_id: string;
  source_name: string;
  original_source: string; // Myndighet
  collection_interval: string;
  aggregation_level: string;
  transformations: string[];
  quality_notes?: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  is_missing?: boolean;
  is_corrected?: boolean;
  correction_note?: string;
}

// ============================================
// FACTOR CONTRIBUTION
// ============================================
export interface FactorContribution {
  id: string;
  analysis_chain_id: string;
  
  factor_name: string;
  factor_kpi_id?: string;
  
  contribution_strength: number; // 0-100
  time_relation: string; // "föregick med 2-3 veckor"
  stability_score: number; // 0-100
  uncertainty: number; // 0-100
  
  evidence_periods: number;
  evidence_total_periods: number;
  
  description: string; // Observationsspråk
  
  sequence_order: number;
  created_at: string;
}

// ============================================
// DATA LINEAGE
// ============================================
export interface DataLineage {
  id: string;
  observation_id?: string;
  kpi_value_id?: string;
  analysis_chain_id?: string;
  
  data_source_id: string;
  original_source: string;
  
  collection_method: string;
  collection_interval: string;
  collected_at: string;
  
  aggregation_level: string;
  transformations_applied: Transformation[];
  data_cleaning_notes?: string;
  
  missing_data_count: number;
  corrections_applied: Correction[];
  methodology_changes: MethodologyChange[];
  
  raw_values: TimeSeriesPoint[];
  
  checksum: string;
  version: number;
  
  created_at: string;
}

export interface Transformation {
  type: string;
  description: string;
  applied_at: string;
}

export interface Correction {
  date: string;
  original_value: number;
  corrected_value: number;
  reason: string;
}

export interface MethodologyChange {
  date: string;
  description: string;
  impact: string;
}

// ============================================
// DECISION TIMELINE
// ============================================
export interface DecisionTimelineEvent {
  id: string;
  decision_id?: string;
  action_id?: string;
  
  event_type?: string;
  event_title: string;
  event_description?: string;
  
  event_date: string;
  event_timestamp?: string;
  
  affected_kpi_ids: string[];
  
  responsible_level?: string;
  responsible_entity?: string;
  
  source_document?: string;
  source_url?: string;
  
  created_at: string;
}

// ============================================
// NAVIGATION STATE
// ============================================
export interface AnalysisNavigationState {
  observation_id: string;
  current_level: AnalysisLevel;
  breadcrumbs: AnalysisBreadcrumb[];
}

export interface AnalysisBreadcrumb {
  level: AnalysisLevel;
  title: string;
  chain_id?: string;
}
