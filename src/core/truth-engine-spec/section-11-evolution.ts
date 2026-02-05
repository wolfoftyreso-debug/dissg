 /**
  * TRUTH ENGINE SPEC - SECTION 11
  * 
  * EVOLUTION WITHOUT DEGENERATION
  */
 
 /**
  * 11.1 PERMITTED CHANGES
  */
 export const PERMITTED_EVOLUTION = {
   allowed: [
     {
       type: 'Additive semantics',
       description: 'Adding new types, fields, or capabilities',
       example: 'Adding new base class "Hypothesis"',
     },
     {
       type: 'Increased explicitness',
       description: 'Making implicit rules explicit',
       example: 'Converting convention to enforced constraint',
     },
     {
       type: 'More rules, never fewer',
       description: 'Adding constraints or invariants',
       example: 'Adding new validation requirement',
     },
     {
       type: 'Stricter enforcement',
       description: 'Upgrading warnings to errors',
       example: 'Changing WARN to BLOCK for anti-pattern',
     },
   ],
 } as const;
 
 /**
  * 11.2 FORBIDDEN CHANGES
  */
 export const FORBIDDEN_EVOLUTION = {
   forbidden: [
     {
       type: 'Simplification',
       description: 'Removing required fields or constraints',
       example: 'Making uncertainty optional',
       why_forbidden: 'Reduces system integrity',
     },
     {
       type: 'Merger',
       description: 'Combining distinct concepts',
       example: 'Merging Source and Schema types',
       why_forbidden: 'Loses semantic precision',
     },
     {
       type: 'Implicitness',
       description: 'Making explicit rules implicit',
       example: 'Removing required documentation',
       why_forbidden: 'Enables hidden assumptions',
     },
     {
       type: 'Exception creation',
       description: 'Adding special cases to universal rules',
       example: '"Except for admin users"',
       why_forbidden: 'Creates attack surface',
     },
   ],
 } as const;
 
 /**
  * Evolution validation
  */
 export interface ProposedChange {
   id: string;
   type: string;
   description: string;
   adds_constraint: boolean;
   removes_constraint: boolean;
   changes_semantics: boolean;
   affected_invariants: string[];
 }
 
 export function validateEvolution(change: ProposedChange): {
   permitted: boolean;
   classification: 'ADDITIVE' | 'STRICTER' | 'DEGENERATIVE' | 'UNCLEAR';
   reason: string;
 } {
   // Forbidden: removes constraint
   if (change.removes_constraint) {
     return {
       permitted: false,
       classification: 'DEGENERATIVE',
       reason: 'Removing constraints is forbidden evolution',
     };
   }
   
   // Forbidden: changes semantics without adding constraint
   if (change.changes_semantics && !change.adds_constraint) {
     return {
       permitted: false,
       classification: 'DEGENERATIVE',
       reason: 'Semantic changes must be additive',
     };
   }
   
   // Permitted: adds constraint
   if (change.adds_constraint) {
     return {
       permitted: true,
       classification: 'STRICTER',
       reason: 'Adding constraints is permitted evolution',
     };
   }
   
   // Additive without constraint change
   return {
     permitted: true,
     classification: 'ADDITIVE',
     reason: 'Additive change without removing existing capability',
   };
 }