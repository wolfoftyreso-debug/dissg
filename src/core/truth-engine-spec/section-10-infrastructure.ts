 /**
  * TRUTH ENGINE SPEC - SECTION 10
  * 
  * INFRASTRUCTURE PRINCIPLES
  */
 
 /**
  * 10.1 APPEND-ONLY ABSOLUTISM
  * 
  * No delete. No update.
  */
 export const APPEND_ONLY_ABSOLUTISM = {
   principle: 'No delete. No update.',
   
   allowed_operations: ['CREATE', 'READ', 'SUPERSEDE'] as const,
   
   forbidden_operations: ['UPDATE', 'DELETE', 'TRUNCATE', 'DROP'] as const,
   
   enforcement: 'Database-level constraints plus application-level validation',
 } as const;
 
 export type AllowedOperation = typeof APPEND_ONLY_ABSOLUTISM.allowed_operations[number];
 export type ForbiddenOperation = typeof APPEND_ONLY_ABSOLUTISM.forbidden_operations[number];
 
 export function assertAllowedOperation(operation: string): void {
   const allowed = APPEND_ONLY_ABSOLUTISM.allowed_operations as readonly string[];
   const forbidden = APPEND_ONLY_ABSOLUTISM.forbidden_operations as readonly string[];
   
   if (forbidden.includes(operation.toUpperCase())) {
     throw new Error(`INFRASTRUCTURE VIOLATION: Operation ${operation} is FORBIDDEN`);
   }
   
   if (!allowed.includes(operation.toUpperCase())) {
     throw new Error(`INFRASTRUCTURE VIOLATION: Operation ${operation} is not recognized`);
   }
 }
 
 /**
  * 10.2 HUMAN POWER LIMITATION
  * 
  * No human may change historical truth.
  */
 export const HUMAN_POWER_LIMITATION = {
   principle: 'No human may change historical truth.',
   
   what_humans_can_do: [
     'Create new observations',
     'Create new versions (superseding old)',
     'Add annotations and context',
     'Create conclusions (with expiry)',
   ],
   
   what_humans_cannot_do: [
     'Modify past observations',
     'Delete historical records',
     'Change timestamps retroactively',
     'Override system invariants',
     'Grant themselves new powers',
   ],
   
   enforcement: 'Cryptographic immutability + access control + audit trail',
 } as const;
 
 /**
  * Power check
  */
 export function checkHumanPower(
   action: string,
   targetIsHistorical: boolean
 ): {
   permitted: boolean;
   reason: string;
 } {
   const forbidden = HUMAN_POWER_LIMITATION.what_humans_cannot_do;
   
   if (targetIsHistorical && ['modify', 'delete', 'update', 'change'].some(v => action.toLowerCase().includes(v))) {
     return {
       permitted: false,
       reason: 'Humans cannot modify historical records',
     };
   }
   
   for (const forbiddenAction of forbidden) {
     if (action.toLowerCase().includes(forbiddenAction.toLowerCase().split(' ')[0])) {
       return {
         permitted: false,
         reason: `Action matches forbidden: "${forbiddenAction}"`,
       };
     }
   }
   
   return {
     permitted: true,
     reason: 'Action is within permitted human power',
   };
 }