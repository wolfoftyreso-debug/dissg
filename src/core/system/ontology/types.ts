 /**
  * CORE ONTOLOGY TYPES
  * 
  * These types are immutable contracts. Breaking changes = major version bump.
  */
 
 // ============================================================================
 // FUNDAMENTAL IDENTIFIERS
 // ============================================================================
 
 export type EntityId = `ENT-${string}`;
 export type DecisionId = `DEC-${string}`;
 export type ObservationId = `OBS-${string}`;
 export type IndicatorId = `IND-${string}`;
 export type SourceId = `SRC-${string}`;
 export type HashId = `SHA256-${string}`;
 
 // ============================================================================
 // TEMPORAL TYPES
 // ============================================================================
 
 export interface TimePoint {
   readonly iso: string;
   readonly precision: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute';
   readonly timezone: string;
 }
 
 export interface TimeRange {
   readonly start: TimePoint;
   readonly end: TimePoint;
   readonly is_complete: boolean;
 }
 
 // ============================================================================
 // GEOGRAPHIC TYPES
 // ============================================================================
 
 export interface GeoScope {
   readonly level: 'global' | 'continent' | 'country' | 'region' | 'municipality' | 'local';
   readonly code: string;
   readonly name: string;
   readonly parent?: GeoScope;
 }
 
 // ============================================================================
 // CONFIDENCE & UNCERTAINTY
 // ============================================================================
 
 export interface Confidence {
   readonly level: number; // 0.0 - 1.0
   readonly method: 'statistical' | 'expert' | 'derived' | 'unknown';
   readonly sample_size?: number;
   readonly margin_of_error?: number;
 }
 
 export interface Uncertainty {
   readonly type: 'data_gap' | 'methodology' | 'temporal' | 'definitional' | 'unknown';
   readonly description: string;
   readonly severity: 'low' | 'medium' | 'high' | 'critical';
 }
 
 // ============================================================================
 // DATA PROVENANCE
 // ============================================================================
 
 export interface Provenance {
   readonly source_id: SourceId;
   readonly collected_at: TimePoint;
   readonly hash: HashId;
   readonly chain: readonly HashId[];
   readonly transformations: readonly Transformation[];
 }
 
 export interface Transformation {
   readonly type: 'aggregation' | 'normalization' | 'imputation' | 'filtering';
   readonly description: string;
   readonly reversible: boolean;
 }
 
 // ============================================================================
 // OBSERVATION (FUNDAMENTAL UNIT)
 // ============================================================================
 
 export interface Observation {
   readonly id: ObservationId;
   readonly indicator_id: IndicatorId;
   readonly value: number | null;
   readonly unit: string;
   readonly time: TimePoint;
   readonly geo: GeoScope;
   readonly confidence: Confidence;
   readonly uncertainties: readonly Uncertainty[];
   readonly provenance: Provenance;
   readonly is_provisional: boolean;
 }
 
 // ============================================================================
 // INDICATOR (MEASURABLE CONCEPT)
 // ============================================================================
 
 export interface Indicator {
   readonly id: IndicatorId;
   readonly code: string;
   readonly name: string;
   readonly name_sv: string;
   readonly definition: string;
   readonly unit: string;
   readonly direction: 'higher_better' | 'lower_better' | 'neutral';
   readonly domain: string;
   readonly subdomain: string;
   readonly source_ids: readonly SourceId[];
   readonly update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
 }
 
 // ============================================================================
 // SOURCE (DATA ORIGIN)
 // ============================================================================
 
 export interface Source {
   readonly id: SourceId;
   readonly code: string;
   readonly name: string;
   readonly organization: string;
   readonly tier: 1 | 2 | 3;
   readonly reliability_score: number;
   readonly methodology_url?: string;
   readonly last_updated: TimePoint;
 }