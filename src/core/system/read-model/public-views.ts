 /**
  * PUBLIC VIEWS
  * 
  * Read-only views for public consumption.
  * No authentication required.
  */
 
 import type { DecisionId } from '../ontology/types';
 import type { CDP } from '../ontology/entities';
 
 // ============================================================================
 // CDP VIEW
 // ============================================================================
 
 export interface CDPView {
   readonly id: string;
   readonly decision_id: DecisionId;
   readonly slug: string;
   readonly title: string;
   readonly title_sv: string;
   readonly description: string;
   readonly coverage_percent: number;
   readonly can_answer: boolean;
   readonly published_at: string | null;
   readonly last_updated: string;
   readonly gaps: readonly string[];
   readonly limitations: readonly string[];
 }
 
 // ============================================================================
 // INDEX VIEW
 // ============================================================================
 
 export interface IndexView {
   readonly code: string;
   readonly name: string;
   readonly name_sv: string;
   readonly current_value: number | null;
   readonly change_percent: number | null;
   readonly last_updated: string;
   readonly confidence: number;
   readonly geo_scope: string;
 }
 
 // ============================================================================
 // OBSERVATION VIEW
 // ============================================================================
 
 export interface ObservationView {
   readonly indicator_code: string;
   readonly indicator_name: string;
   readonly value: number | null;
   readonly unit: string;
   readonly time: string;
   readonly geo_code: string;
   readonly source_name: string;
   readonly confidence: number;
   readonly is_provisional: boolean;
 }
 
 // ============================================================================
 // PUBLIC API RESPONSE
 // ============================================================================
 
 export interface PublicAPIResponse<T> {
   readonly success: boolean;
   readonly data: T | null;
   readonly error: string | null;
   readonly metadata: {
     readonly version: string;
     readonly timestamp: string;
     readonly coverage: number;
     readonly uncertainty: string;
     readonly limitations: readonly string[];
   };
 }
 
 export function createPublicResponse<T>(
   data: T,
   coverage: number,
   limitations: readonly string[]
 ): PublicAPIResponse<T> {
   return {
     success: true,
     data,
     error: null,
     metadata: {
       version: '1.0.0',
       timestamp: new Date().toISOString(),
       coverage,
       uncertainty: coverage < 80 ? 'high' : coverage < 95 ? 'medium' : 'low',
       limitations,
     },
   };
 }
 
 export function createErrorResponse<T>(
   error: string,
   limitations: readonly string[] = []
 ): PublicAPIResponse<T> {
   return {
     success: false,
     data: null,
     error,
     metadata: {
       version: '1.0.0',
       timestamp: new Date().toISOString(),
       coverage: 0,
       uncertainty: 'unknown',
       limitations,
     },
   };
 }