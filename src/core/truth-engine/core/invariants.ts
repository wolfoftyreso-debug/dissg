 /**
  * TRUTH ENGINE - INVARIANT RUNNER
  * 
  * All invariants are HARD STOPS.
  * Violation = rejection. No exceptions.
  */
 
 import type { CoreObject, Measure, Schema, Entity } from './ontology';
 import { BASE_CLASSES, isMeasure, isSchema, isEntity } from './ontology';
 
 /**
  * INVARIANT DEFINITION
  */
 export interface Invariant {
   readonly id: string;
   readonly name: string;
   readonly description: string;
   readonly severity: 'CRITICAL' | 'HIGH';
   readonly check: (obj: CoreObject) => InvariantResult;
 }
 
 export interface InvariantResult {
   readonly passed: boolean;
   readonly invariant_id: string;
   readonly message: string;
   readonly details?: unknown;
 }
 
 /**
  * CORE INVARIANTS (THE FIVE LAWS)
  */
 export const CORE_INVARIANTS: Invariant[] = [
   // LAW 1: No object without temporal axis
   {
     id: 'INV-001',
     name: 'Temporal Requirement',
     description: 'No object without time axis',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (isMeasure(obj)) {
         const measure = obj as Measure;
         const hasTemporal = 
           !!(measure.temporal?.observed_at &&
           measure.temporal?.valid_from);
         
         return {
           passed: hasTemporal,
           invariant_id: 'INV-001',
           message: hasTemporal 
             ? 'Temporal envelope present'
             : 'VIOLATION: Measure lacks temporal envelope',
         };
       }
       
       // Non-measures must have created_at
       return {
         passed: !!obj.created_at,
         invariant_id: 'INV-001',
         message: obj.created_at 
           ? 'Creation timestamp present'
           : 'VIOLATION: Object lacks created_at',
       };
     },
   },
   
   // LAW 2: No measure without unit
   {
     id: 'INV-002',
     name: 'Unit Requirement',
     description: 'No measure without unit',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isMeasure(obj)) {
         return { passed: true, invariant_id: 'INV-002', message: 'Not a measure' };
       }
       
       const measure = obj as Measure;
       const hasUnit = !!measure.unit && measure.unit.length > 0;
       
       return {
         passed: hasUnit,
         invariant_id: 'INV-002',
         message: hasUnit 
           ? `Unit specified: ${measure.unit}`
           : 'VIOLATION: Measure lacks unit',
       };
     },
   },
   
   // LAW 3: No value without source
   {
     id: 'INV-003',
     name: 'Source Requirement',
     description: 'No value without source',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isMeasure(obj)) {
         return { passed: true, invariant_id: 'INV-003', message: 'Not a measure' };
       }
       
       const measure = obj as Measure;
       const hasSource = 
         !!(measure.source?.source_id &&
         measure.source?.source_version);
       
       return {
         passed: hasSource,
         invariant_id: 'INV-003',
         message: hasSource 
           ? `Source specified: ${measure.source.source_id}`
           : 'VIOLATION: Measure lacks source envelope',
       };
     },
   },
   
   // LAW 4: No schema without definition
   {
     id: 'INV-004',
     name: 'Definition Requirement',
     description: 'No schema without definition',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isSchema(obj)) {
         return { passed: true, invariant_id: 'INV-004', message: 'Not a schema' };
       }
       
       const schema = obj as Schema;
       const hasDefinition = 
         !!schema.definition && 
         schema.definition.length > 10; // Meaningful definition
       
       return {
         passed: hasDefinition,
         invariant_id: 'INV-004',
         message: hasDefinition 
           ? 'Definition present'
           : 'VIOLATION: Schema lacks meaningful definition',
       };
     },
   },
   
   // LAW 5: Valid base class
   {
     id: 'INV-005',
     name: 'Ontological Closure',
     description: 'Object must be instance of permitted base class',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       const validClass = BASE_CLASSES.includes(obj.baseClass);
       
       return {
         passed: validClass,
         invariant_id: 'INV-005',
         message: validClass 
           ? `Valid base class: ${obj.baseClass}`
           : `VIOLATION: Invalid base class: ${obj.baseClass}`,
       };
     },
   },
 ];
 
 /**
  * ENTITY INVARIANTS (Step 9)
  * 
  * ❌ No values without entities
  * ❌ No entities without time
  * ❌ No entities without source
  */
 export const ENTITY_INVARIANTS: Invariant[] = [
   // LAW 6: Measures must reference valid entity
   {
     id: 'INV-006',
     name: 'Entity Reference Requirement',
     description: 'Measures must reference a valid entity',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isMeasure(obj)) {
         return { passed: true, invariant_id: 'INV-006', message: 'Not a measure' };
       }
       
       const measure = obj as Measure;
       const hasEntityRef = !!measure.entity_id && measure.entity_id.length > 0;
       
       return {
         passed: hasEntityRef,
         invariant_id: 'INV-006',
         message: hasEntityRef 
           ? `Entity reference: ${measure.entity_id}`
           : 'VIOLATION: Measure lacks entity_id reference',
       };
     },
   },
   
   // LAW 7: Entities must have temporal bounds
   {
     id: 'INV-007',
     name: 'Entity Temporal Bounds',
     description: 'Entities must have valid_from in identifiers',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isEntity(obj)) {
         return { passed: true, invariant_id: 'INV-007', message: 'Not an entity' };
       }
       
       const entity = obj as Entity;
       const hasValidFrom = !!entity.identifiers?.valid_from;
       
       return {
         passed: hasValidFrom,
         invariant_id: 'INV-007',
         message: hasValidFrom 
           ? `Entity valid from: ${entity.identifiers.valid_from}`
           : 'VIOLATION: Entity lacks valid_from temporal bound',
       };
     },
   },
   
   // LAW 8: Entities must have source
   {
     id: 'INV-008',
     name: 'Entity Source Requirement',
     description: 'Entities must reference a source',
     severity: 'CRITICAL',
     check: (obj: CoreObject): InvariantResult => {
       if (!isEntity(obj)) {
         return { passed: true, invariant_id: 'INV-008', message: 'Not an entity' };
       }
       
       const entity = obj as Entity;
       const hasSource = !!entity.identifiers?.source_id;
       
       return {
         passed: hasSource,
         invariant_id: 'INV-008',
         message: hasSource 
           ? `Entity source: ${entity.identifiers.source_id}`
           : 'VIOLATION: Entity lacks source_id reference',
       };
     },
   },
 ];
 
 /**
  * RUN ALL INVARIANTS
  */
 export function runInvariants(obj: CoreObject): {
   passed: boolean;
   results: InvariantResult[];
   violations: InvariantResult[];
 } {
   const results = [...CORE_INVARIANTS, ...ENTITY_INVARIANTS].map(inv => inv.check(obj));
   const violations = results.filter(r => !r.passed);
   
   return {
     passed: violations.length === 0,
     results,
     violations,
   };
 }
 
 /**
  * HARD STOP - Throws on any violation
  */
 export function enforceInvariants(obj: CoreObject): void {
   const { passed, violations } = runInvariants(obj);
   
   if (!passed) {
     const messages = violations.map(v => v.message).join('; ');
     throw new Error(`INVARIANT VIOLATION: ${messages}`);
   }
 }
 
 /**
  * ENTITY REGISTRY VALIDATION
  * 
  * Step 9.3: assert_entity_exists
  * If entity_id is not in registry, reject.
  */
 export function assertEntityExists(
   entityId: string, 
   registryCheck: (id: string) => boolean
 ): InvariantResult {
   const exists = registryCheck(entityId);
   
   return {
     passed: exists,
     invariant_id: 'INV-009',
     message: exists 
       ? `Entity exists: ${entityId}`
       : `VIOLATION: Unknown entity_id: ${entityId} - Fantasy worlds are not allowed`,
   };
 }
 
 /**
  * VALIDATE MEASURE WITH ENTITY REGISTRY
  */
 export function validateMeasureWithRegistry(
   measure: Measure,
   entityExistsCheck: (id: string) => boolean
 ): {
   passed: boolean;
   results: InvariantResult[];
   violations: InvariantResult[];
 } {
   // Run standard invariants
   const standardResult = runInvariants(measure);
   
   // Check entity registry
   const entityResult = assertEntityExists(measure.entity_id, entityExistsCheck);
   
   const allResults = [...standardResult.results, entityResult];
   const violations = allResults.filter(r => !r.passed);
   
   return {
     passed: violations.length === 0,
     results: allResults,
     violations,
   };
 }