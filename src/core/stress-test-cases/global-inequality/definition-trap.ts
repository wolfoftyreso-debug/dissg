 /**
  * DEFINITION TRAP
  * 
  * Where other systems DIE.
  * 
  * Examples:
  * - Gini 1980 ≠ Gini 2025
  * - Income in USD ≠ PPP
  * - Household ≠ individual
  * - Pre-tax ≠ post-tax
  * 
  * Self-test:
  * TRY compare inequality 1980 vs 2025 WITHOUT definition_alignment
  * ASSERT rejected
  */
 
 import { INEQUALITY_DEFINITIONS, InequalityDefinition } from './definition-menu';
 
 /**
  * COMPARISON REQUEST
  */
 export interface InequalityComparisonRequest {
   definitionCode?: string;
   definitionVersion?: number;
   periodA: { year: number };
   periodB: { year: number };
   geography: string;
   source?: string;
 }
 
 /**
  * DEFINITION TRAP DETECTOR
  */
 export class DefinitionTrapDetector {
   /**
    * Attempt comparison - MUST REJECT if definitions don't align
    */
   attemptComparison(request: InequalityComparisonRequest): {
     allowed: boolean;
     rejection?: {
       reason: string;
       type: 'no_definition' | 'version_mismatch' | 'method_change' | 'entity_mismatch' | 'currency_mismatch';
       requiredAction: string;
     };
     warning?: string;
   } {
     // TRAP 1: No definition specified
     if (!request.definitionCode) {
       return {
         allowed: false,
         rejection: {
           reason: 'No inequality definition specified',
           type: 'no_definition',
           requiredAction: 'MUST specify definition code (e.g., gini_income_pretax)',
         },
       };
     }
 
     const definition = INEQUALITY_DEFINITIONS.find(d => d.code === request.definitionCode);
     if (!definition) {
       return {
         allowed: false,
         rejection: {
           reason: `Unknown definition: ${request.definitionCode}`,
           type: 'no_definition',
           requiredAction: 'Use valid definition code',
         },
       };
     }
 
     // TRAP 2: Version mismatch across time periods
     const versionA = this.getVersionForYear(definition, request.periodA.year);
     const versionB = this.getVersionForYear(definition, request.periodB.year);
 
     if (!versionA || !versionB) {
       return {
         allowed: false,
         rejection: {
           reason: `Definition not available for year ${!versionA ? request.periodA.year : request.periodB.year}`,
           type: 'version_mismatch',
           requiredAction: 'Choose years where definition exists',
         },
       };
     }
 
     if (versionA.version !== versionB.version) {
       return {
         allowed: false,
         rejection: {
           reason: `Methodology changed between periods: v${versionA.version} (${request.periodA.year}) vs v${versionB.version} (${request.periodB.year})`,
           type: 'method_change',
           requiredAction: 'FORCED VERSION SPLIT: Compare within same methodology version only, or acknowledge break',
         },
         warning: `v${versionA.version}: ${versionA.methodologyNote} | v${versionB.version}: ${versionB.methodologyNote}`,
       };
     }
 
     // PASSED all traps
     return {
       allowed: true,
       warning: `Comparison using ${definition.name} v${versionA.version}`,
     };
   }
 
   private getVersionForYear(
     definition: InequalityDefinition,
     year: number
   ): InequalityDefinition['versions'][0] | undefined {
     const dateStr = `${year}-06-01`;
     return definition.versions.find(v => {
       const validFrom = new Date(v.validFrom);
       const validUntil = v.validUntil ? new Date(v.validUntil) : new Date('2099-12-31');
       const date = new Date(dateStr);
       return date >= validFrom && date <= validUntil;
     });
   }
 
   /**
    * Detect specific traps
    */
   detectTraps(
     definitionA: InequalityDefinition,
     definitionB: InequalityDefinition
   ): string[] {
     const traps: string[] = [];
 
     if (definitionA.code !== definitionB.code) {
       traps.push('TRAP: Comparing different metrics entirely');
     }
 
     if (definitionA.taxAdjustment !== definitionB.taxAdjustment) {
       traps.push(`TRAP: Tax adjustment mismatch (${definitionA.taxAdjustment} vs ${definitionB.taxAdjustment})`);
     }
 
     if (definitionA.entityLevel !== definitionB.entityLevel) {
       traps.push(`TRAP: Entity level mismatch (${definitionA.entityLevel} vs ${definitionB.entityLevel})`);
     }
 
     if (definitionA.currencyBasis !== definitionB.currencyBasis) {
       traps.push(`TRAP: Currency basis mismatch (${definitionA.currencyBasis} vs ${definitionB.currencyBasis})`);
     }
 
     return traps;
   }
 
   /**
    * SELF-TEST
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     // Try to compare 1980 vs 2025 without definition alignment
     const badRequest: InequalityComparisonRequest = {
       periodA: { year: 1980 },
       periodB: { year: 2025 },
       geography: 'global',
       // NO definition specified
     };
 
     const result = this.attemptComparison(badRequest);
 
     // Also test version mismatch
     const versionMismatchRequest: InequalityComparisonRequest = {
       definitionCode: 'gini_income_pretax',
       periodA: { year: 1980 }, // v2
       periodB: { year: 2020 }, // v3
       geography: 'USA',
     };
 
     const versionResult = this.attemptComparison(versionMismatchRequest);
 
     const passed = !result.allowed && !versionResult.allowed;
 
     return {
       passed,
       test: 'TRY compare inequality 1980 vs 2025 WITHOUT definition_alignment → ASSERT rejected',
       result: passed
         ? 'PASS: Both undefined and version-mismatched comparisons REJECTED'
         : 'CATASTROPHE: Invalid comparison allowed through',
     };
   }
 }