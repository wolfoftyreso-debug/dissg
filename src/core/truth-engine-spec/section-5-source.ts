 /**
  * TRUTH ENGINE SPEC - SECTION 5
  * 
  * SOURCE SOVEREIGNTY
  */
 
 /**
  * 5.1 SOURCE REQUIREMENT
  * 
  * NO data without:
  * - source_id
  * - source_version
  */
 export interface SourceEnvelope {
   readonly source_id: string;
   readonly source_version: string;
   readonly source_accessed_at: string;
   readonly source_methodology_id: string | null;
 }
 
 export function validateSourceEnvelope(envelope: Partial<SourceEnvelope>): {
   valid: boolean;
   missing: string[];
 } {
   const missing: string[] = [];
   
   if (!envelope.source_id) missing.push('source_id');
   if (!envelope.source_version) missing.push('source_version');
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }
 
 /**
  * 5.2 SOURCE NEUTRALITY
  * 
  * Contradicting sources COEXIST.
  * Consensus is a DERIVED state, never base data.
  */
 export const SOURCE_NEUTRALITY_LAW = {
   principle: 'Contradicting sources coexist. Consensus is derived, never base data.',
   
   implications: [
     'No source has priority over another at data level',
     'Conflicts are preserved, not resolved',
     'Consensus must be computed, not asserted',
     'User must choose which source to trust',
   ],
   
   forbidden: [
     'Automatic source priority',
     'Hidden source selection',
     'Conflict resolution without transparency',
     'Single-source dominance',
   ],
 } as const;
 
 /**
  * Source conflict structure
  */
 export interface SourceConflict {
   readonly indicator_id: string;
   readonly time_range: { from: string; to: string };
   readonly sources: {
     source_id: string;
     value: unknown;
     methodology: string;
   }[];
   readonly conflict_type: 'value_difference' | 'methodology_difference' | 'coverage_difference';
   readonly resolution: null; // ALWAYS null at data level
 }
 
 /**
  * Assert source neutrality
  */
 export function assertSourceNeutrality(
   sources: string[],
   selectedSource: string | null
 ): {
   neutral: boolean;
   warning?: string;
 } {
   if (selectedSource && sources.length > 1) {
     return {
       neutral: true,
       warning: `User selected source ${selectedSource}. ${sources.length - 1} alternative sources exist.`,
     };
   }
   
   if (sources.length === 1) {
     return {
       neutral: true,
       warning: 'Only one source available. Source diversity not possible.',
     };
   }
   
   return { neutral: true };
 }