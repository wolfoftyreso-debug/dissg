 /**
  * REFERENCE VIEWS
  * 
  * Detailed views for citation and verification.
  */
 
 import type { HashId, SourceId } from '../ontology/types';
 
 // ============================================================================
 // CITATION REFERENCE
 // ============================================================================
 
 export interface CitationReference {
   readonly cite_id: string;
   readonly canonical_url: string;
   readonly title: string;
   readonly statement: string;
   readonly time_range: string;
   readonly geo_scope: string;
   readonly sources: readonly SourceCitation[];
   readonly hash: HashId;
   readonly generated_at: string;
   readonly valid_until: string | null;
 }
 
 export interface SourceCitation {
   readonly source_id: SourceId;
   readonly source_name: string;
   readonly organization: string;
   readonly tier: 1 | 2 | 3;
   readonly url: string | null;
   readonly retrieved_at: string;
 }
 
 // ============================================================================
 // METHOD REFERENCE
 // ============================================================================
 
 export interface MethodReference {
   readonly method_id: string;
   readonly name: string;
   readonly description: string;
   readonly version: string;
   readonly steps: readonly MethodStep[];
   readonly assumptions: readonly string[];
   readonly limitations: readonly string[];
   readonly reproducibility_instructions: string;
 }
 
 export interface MethodStep {
   readonly order: number;
   readonly name: string;
   readonly description: string;
   readonly inputs: readonly string[];
   readonly outputs: readonly string[];
 }
 
 // ============================================================================
 // PROVENANCE VIEW
 // ============================================================================
 
 export interface ProvenanceView {
   readonly entity_id: string;
   readonly hash_chain: readonly HashId[];
   readonly sources: readonly SourceCitation[];
   readonly transformations: readonly TransformationStep[];
   readonly created_at: string;
   readonly last_modified: string;
   readonly is_locked: boolean;
 }
 
 export interface TransformationStep {
   readonly order: number;
   readonly type: string;
   readonly description: string;
   readonly reversible: boolean;
   readonly applied_at: string;
 }
 
 // ============================================================================
 // TRUST SNAPSHOT
 // ============================================================================
 
 export interface TrustSnapshot {
   readonly snapshot_id: string;
   readonly taken_at: string;
   readonly system_hash: HashId;
   readonly event_count: number;
   readonly entity_count: number;
   readonly coverage_summary: {
     readonly total_indicators: number;
     readonly active_indicators: number;
     readonly avg_coverage: number;
     readonly countries_covered: number;
   };
   readonly charter_status: 'compliant' | 'degraded' | 'violation';
 }