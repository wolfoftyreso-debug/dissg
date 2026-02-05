 /**
  * UNIFIED ANSWER BODY
  * 
  * ALL answers share this structure.
  * This makes consumption identical across all domains.
  */
 
 import type { CanonicalAnswerTypeCode } from './canonical-types';
 
 /**
  * DOMAIN CODES (EXHAUSTIVE LIST)
  */
 export const DOMAIN_CODES = [
   'healthcare',
   'youth',
   'economy',
   'markets',
   'medicine',
   'substance_use',
   'society',
   'environment',
   'education',
   'labor',
   'crime',
   'housing',
   'migration',
 ] as const;
 
 export type DomainCode = typeof DOMAIN_CODES[number];
 
 /**
  * UNIFIED ANSWER BODY (ALL ANSWERS SHARE THIS)
  * 
  * This structure is what makes:
  *   - LLMs consume all answers identically
  *   - Google interpret all answers identically
  *   - No special cases required
  */
 export interface UnifiedAnswerBody {
   // === IDENTIFICATION ===
   readonly answer_id: string;
   readonly answer_type: CanonicalAnswerTypeCode;
   readonly domain: DomainCode;
   readonly version: number;
   readonly generated_at: string;
   
   // === SCOPE DECLARATIONS (ALL EXPLICIT) ===
   readonly population_scope: PopulationScope;
   readonly time_scope: TimeScope;
   readonly definition_scope: DefinitionScope;
   readonly geographic_scope: GeographicScope;
   
   // === SOURCE CHAIN ===
   readonly sources: readonly SourceReference[];
   
   // === CONFIDENCE ENVELOPE ===
   readonly confidence: ConfidenceEnvelope;
   
   // === LIMITATIONS (ALWAYS PRESENT) ===
   readonly limitations: readonly string[];
   readonly what_this_does_not_show: readonly string[];
   
   // === THE ANSWER ===
   readonly output: AnswerOutput;
 }
 
 /**
  * POPULATION SCOPE
  */
 export interface PopulationScope {
   readonly defined: boolean;
   readonly description: string;
   readonly size?: number;
   readonly characteristics?: readonly string[];
 }
 
 /**
  * TIME SCOPE
  */
 export interface TimeScope {
   readonly explicit: boolean;
   readonly point?: string;
   readonly range_start?: string;
   readonly range_end?: string;
   readonly granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
 }
 
 /**
  * DEFINITION SCOPE
  */
 export interface DefinitionScope {
   readonly explicit: boolean;
   readonly definition_id: string;
   readonly definition_source: string;
   readonly definition_text: string;
   readonly methodology?: string;
 }
 
 /**
  * GEOGRAPHIC SCOPE
  */
 export interface GeographicScope {
   readonly level: 'global' | 'continental' | 'national' | 'regional' | 'local';
   readonly entities: readonly string[];
   readonly entity_type: string;
 }
 
 /**
  * SOURCE REFERENCE
  */
 export interface SourceReference {
   readonly source_id: string;
   readonly source_name: string;
   readonly tier: 1 | 2 | 3;
   readonly url?: string;
   readonly retrieved_at: string;
   readonly version?: string;
 }
 
 /**
  * CONFIDENCE ENVELOPE
  */
 export interface ConfidenceEnvelope {
   readonly coverage: number;          // 0-1: data completeness
   readonly source_agreement: number;  // 0-1: consensus across sources
   readonly recency_days: number;      // how old is the data
   readonly methodology_stability: number; // 0-1: has definition changed
 }
 
 /**
  * ANSWER OUTPUT
  */
 export interface AnswerOutput {
   // Text format (for humans)
   readonly text: string;
   
   // Structured format (for machines)
   readonly structured: {
     readonly primary_value: number | string;
     readonly unit: string;
     readonly entity: string;
     readonly time: string;
     readonly secondary_values?: Record<string, number | string>;
   };
   
   // Footnotes (always present)
   readonly footnotes: readonly string[];
   
   // Citation-ready format
   readonly citation: {
     readonly cite_id: string;
     readonly cite_url: string;
   };
 }