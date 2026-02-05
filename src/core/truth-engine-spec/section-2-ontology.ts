 /**
  * TRUTH ENGINE SPEC - SECTION 2
  * 
  * ONTOLOGICAL CONSTITUTION
  */
 
 /**
  * 2.1 PERMITTED BASE CLASSES
  * 
  * ONLY these types may exist. NO OTHERS.
  */
 export const PERMITTED_BASE_CLASSES = [
   'Entity',
   'Attribute',
   'Relation',
   'Event',
   'Measure',
   'Source',
   'Schema',
   'Version',
   'Conclusion',
 ] as const;
 
 export type PermittedBaseClass = typeof PERMITTED_BASE_CLASSES[number];
 
 /**
  * 2.2 ONTOLOGICAL CLOSURE
  * 
  * Every object MUST be an instance of EXACTLY ONE base class.
  */
 export interface OntologicalObject {
   readonly id: string;
   readonly baseClass: PermittedBaseClass;
   readonly created_at: string;
   readonly created_by: string;
 }
 
 /**
  * Validate ontological compliance
  */
 export function validateOntologicalCompliance(obj: unknown): {
   compliant: boolean;
   error?: string;
 } {
   if (typeof obj !== 'object' || obj === null) {
     return { compliant: false, error: 'Object is null or not an object' };
   }
   
   const typed = obj as Record<string, unknown>;
   
   if (!('baseClass' in typed)) {
     return { compliant: false, error: 'Object lacks baseClass property' };
   }
   
   if (!PERMITTED_BASE_CLASSES.includes(typed.baseClass as PermittedBaseClass)) {
     return { 
       compliant: false, 
       error: `Invalid baseClass: ${typed.baseClass}. Permitted: ${PERMITTED_BASE_CLASSES.join(', ')}` 
     };
   }
   
   return { compliant: true };
 }
 
 /**
  * ONTOLOGICAL LAW: No other types may exist
  */
 export function assertNoForeignTypes(typeNames: string[]): void {
   const foreignTypes = typeNames.filter(t => !PERMITTED_BASE_CLASSES.includes(t as PermittedBaseClass));
   
   if (foreignTypes.length > 0) {
     throw new Error(`ONTOLOGICAL VIOLATION: Foreign types detected: ${foreignTypes.join(', ')}`);
   }
 }