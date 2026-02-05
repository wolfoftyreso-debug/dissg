 /**
  * OPERATIONAL PRINCIPLES
  * 
  * Derived from Charter articles. Enforceable rules.
  */
 
 // ============================================================================
 // SYSTEM NEVER DOES (HARD BLOCKS)
 // ============================================================================
 
 export const SYSTEM_NEVER_DOES = [
   'Declare something "best" or "worst"',
   'Claim causation between variables',
   'Recommend specific actions',
   'Predict future outcomes',
   'Compare entities without explicit criteria',
   'Present data without source attribution',
   'Hide uncertainty or confidence levels',
   'Generate content without data backing',
   'Allow edits to historical records',
   'Prioritize any actor over another',
 ] as const;
 
 // ============================================================================
 // SYSTEM ALWAYS DOES (HARD REQUIREMENTS)
 // ============================================================================
 
 export const SYSTEM_ALWAYS_DOES = [
   'Show provenance for every data point',
   'Declare uncertainty in every output',
   'Provide drill-down for every aggregation',
   'State limitations of every view',
   'Hash and chain all changes',
   'Log all modifications to Trust Log',
   'Fail silent when data is insufficient',
   'Treat "unknown" as valid first-class result',
   'Apply same method across all entities',
   'Preserve complete history immutably',
 ] as const;
 
 // ============================================================================
 // FAIL-SILENT TRIGGERS
 // ============================================================================
 
 export const FAIL_SILENT_TRIGGERS = {
   coverage_below: 70,           // percent
   data_points_below: 3,         // count
   confidence_below: 0.5,        // 0-1
   source_divergence_above: 0.3, // 0-1
   data_age_above_days: 365,     // days
 } as const;
 
 // ============================================================================
 // ROLE DEFINITIONS
 // ============================================================================
 
 export const SYSTEM_ROLES = {
   builder: {
     name: 'Builder',
     description: 'Develops technology and code',
     permissions: ['write_code', 'deploy', 'test'],
     restrictions: ['modify_ontology', 'modify_charter', 'modify_data'],
   },
   steward: {
     name: 'Steward',
     description: 'Manages methodology and data quality',
     permissions: ['review_ontology', 'approve_sources', 'define_methods'],
     restrictions: ['write_code', 'modify_charter'],
   },
   guardian: {
     name: 'Guardian',
     description: 'Protects constitutional principles',
     permissions: ['veto_changes', 'trigger_shutdown', 'audit_all'],
     restrictions: ['write_code', 'modify_ontology', 'modify_data'],
   },
 } as const;
 
 export type SystemRole = keyof typeof SYSTEM_ROLES;
 
 // ============================================================================
 // PRINCIPLE VALIDATOR
 // ============================================================================
 
 export function validateSystemNever(action: string): boolean {
   return !SYSTEM_NEVER_DOES.some(forbidden => 
     action.toLowerCase().includes(forbidden.toLowerCase())
   );
 }
 
 export function checkFailSilent(params: {
   coverage?: number;
   dataPoints?: number;
   confidence?: number;
   sourceDivergence?: number;
   dataAgeDays?: number;
 }): { shouldFail: boolean; reasons: string[] } {
   const reasons: string[] = [];
   
   if (params.coverage !== undefined && params.coverage < FAIL_SILENT_TRIGGERS.coverage_below) {
     reasons.push(`Coverage ${params.coverage}% below threshold ${FAIL_SILENT_TRIGGERS.coverage_below}%`);
   }
   if (params.dataPoints !== undefined && params.dataPoints < FAIL_SILENT_TRIGGERS.data_points_below) {
     reasons.push(`Data points ${params.dataPoints} below threshold ${FAIL_SILENT_TRIGGERS.data_points_below}`);
   }
   if (params.confidence !== undefined && params.confidence < FAIL_SILENT_TRIGGERS.confidence_below) {
     reasons.push(`Confidence ${params.confidence} below threshold ${FAIL_SILENT_TRIGGERS.confidence_below}`);
   }
   if (params.sourceDivergence !== undefined && params.sourceDivergence > FAIL_SILENT_TRIGGERS.source_divergence_above) {
     reasons.push(`Source divergence ${params.sourceDivergence} above threshold ${FAIL_SILENT_TRIGGERS.source_divergence_above}`);
   }
   if (params.dataAgeDays !== undefined && params.dataAgeDays > FAIL_SILENT_TRIGGERS.data_age_above_days) {
     reasons.push(`Data age ${params.dataAgeDays} days above threshold ${FAIL_SILENT_TRIGGERS.data_age_above_days}`);
   }
   
   return {
     shouldFail: reasons.length > 0,
     reasons,
   };
 }