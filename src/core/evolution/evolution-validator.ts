 /**
  * EVOLUTION VALIDATOR
  * 
  * Validates that changes follow allowed evolution directions.
  * Blocks forbidden operations.
  */
 
 import {
   type EvolutionChange,
   type AllowedEvolutionDirection,
   ALLOWED_EVOLUTION_DIRECTIONS,
   ALLOWED_SCHEMA_OPERATIONS,
   FORBIDDEN_SCHEMA_OPERATIONS,
   FORBIDDEN_COMMIT_PATTERNS,
 } from './evolution-types';
 
 /**
  * EVOLUTION LAWS (IMMUTABLE)
  */
 export const EVOLUTION_LAWS = {
   fundamentalLaw: 'Every change must make the system stricter, not freer',
   entropyLaw: 'If complexity increases without stricter rules → degeneration',
   
   allowedDirections: {
     additive_semantics: 'New concepts, never changed existing ones',
     increased_explicitness: 'Less implicit, more formal',
     new_relations: 'More relations, fewer assumptions',
     better_self_tests: 'Improved validation coverage',
     narrower_contracts: 'Stricter interfaces',
   },
   
   forbiddenDirections: {
     simplification: 'Simplification = information loss',
     merging: 'Merging = semantic risk',
     practical_equivalence: '"In practice" is death',
   },
 } as const;
 
 /**
  * VALIDATE EVOLUTION DIRECTION
  */
 export function validateEvolutionDirection(
   change: EvolutionChange
 ): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   
   // Check if direction is allowed
   if (change.direction === 'FORBIDDEN') {
     violations.push('Change direction explicitly marked as FORBIDDEN');
   } else if (!ALLOWED_EVOLUTION_DIRECTIONS.includes(change.direction)) {
     violations.push(`Unknown evolution direction: ${change.direction}`);
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * VALIDATE SCHEMA OPERATION
  */
 export function validateSchemaOperation(
   change: EvolutionChange
 ): { valid: boolean; violations: string[] } {
   const violations: string[] = [];
   
   if (!change.schemaOperation) {
     return { valid: true, violations: [] };
   }
   
   // Check for forbidden operations
   if ((FORBIDDEN_SCHEMA_OPERATIONS as readonly string[]).includes(change.schemaOperation)) {
     violations.push(`FORBIDDEN schema operation: ${change.schemaOperation}`);
     
     // Add specific explanations
     switch (change.schemaOperation) {
       case 'MODIFY_IN_PLACE':
         violations.push('Use SUPERSEDE to create new version with new ID');
         break;
       case 'RENAME_WITHOUT_NEW_ID':
         violations.push('Use SUPERSEDE to create new schema with new name');
         break;
       case 'WIDEN_MEANING':
         violations.push('Use SPLIT to separate meanings into distinct schemas');
         break;
       case 'RELAX_CONSTRAINTS':
         violations.push('Constraints can only be narrowed, never relaxed');
         break;
     }
   }
   
   // Check if operation is known
   if (!(ALLOWED_SCHEMA_OPERATIONS as readonly string[]).includes(change.schemaOperation) &&
       !(FORBIDDEN_SCHEMA_OPERATIONS as readonly string[]).includes(change.schemaOperation)) {
     violations.push(`Unknown schema operation: ${change.schemaOperation}`);
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * VALIDATE COMMIT MESSAGE
  */
 export function validateCommitMessage(
   commitMessage: string
 ): { valid: boolean; violations: string[]; warnings: string[] } {
   const violations: string[] = [];
   const warnings: string[] = [];
   
   const lowerMessage = commitMessage.toLowerCase();
   
   for (const pattern of FORBIDDEN_COMMIT_PATTERNS) {
     if (lowerMessage.includes(pattern)) {
       if (['simplify', 'cleanup', 'merge', 'combine', 'consolidate'].includes(pattern)) {
         violations.push(`FORBIDDEN pattern in commit: "${pattern}" - indicates degeneration`);
       } else {
         warnings.push(`WARNING pattern in commit: "${pattern}" - review carefully`);
       }
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
     warnings,
   };
 }
 
 /**
  * FULL EVOLUTION VALIDATION
  */
 export function validateEvolutionChange(
   change: EvolutionChange
 ): {
   valid: boolean;
   approved: boolean;
   violations: string[];
   warnings: string[];
   recommendation: string;
 } {
   const allViolations: string[] = [];
   const allWarnings: string[] = [];
   
   // Validate direction
   const directionResult = validateEvolutionDirection(change);
   allViolations.push(...directionResult.violations);
   
   // Validate schema operation
   const schemaResult = validateSchemaOperation(change);
   allViolations.push(...schemaResult.violations);
   
   // Validate commit message
   if (change.commitMessage) {
     const commitResult = validateCommitMessage(change.commitMessage);
     allViolations.push(...commitResult.violations);
     allWarnings.push(...commitResult.warnings);
   }
   
   const valid = allViolations.length === 0;
   const approved = valid && allWarnings.length === 0;
   
   let recommendation: string;
   if (approved) {
     recommendation = 'Change follows evolution laws - proceed';
   } else if (valid) {
     recommendation = 'Change valid but has warnings - review carefully';
   } else {
     recommendation = 'Change violates evolution laws - BLOCK';
   }
   
   return {
     valid,
     approved,
     violations: allViolations,
     warnings: allWarnings,
     recommendation,
   };
 }
 
 /**
  * EVOLUTION SELF-TESTS
  */
 export const EVOLUTION_SELF_TESTS = {
   directionCheck: {
     test: 'ASSERT change_type IN allowed_evolution_directions',
     description: 'All changes follow allowed directions',
   },
   
   schemaCheck: {
     test: 'ASSERT no_schema_diff CONTAINS in_place_modification',
     description: 'No in-place schema modifications',
   },
   
   commitCheck: {
     test: 'ASSERT no_commit_message CONTAINS forbidden_patterns',
     description: 'Commit messages reveal no degeneration',
   },
   
   entropyCheck: {
     test: 'ASSERT semantic_entropy(t) <= semantic_entropy(t-1)',
     description: 'Semantic entropy never increases',
   },
 } as const;