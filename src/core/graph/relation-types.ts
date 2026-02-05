 /**
  * RELATION TYPES
  * 
  * Formella relationstyper mellan basobjekten.
  * Hierarkier är relationer, inte struktur.
  */
 
 export type BaseObjectType = 'entity' | 'attribute' | 'relation' | 'event' | 'measure' | 'source';
 
 /**
  * RELATION CATEGORIES
  * All relations must fall into one of these categories.
  */
 export type RelationCategory = 
   | 'structural'      // Defines how things are organized
   | 'temporal'        // Defines time-based connections
   | 'semantic'        // Defines meaning relationships
   | 'provenance'      // Defines data origin and trust
   | 'measurement'     // Defines quantitative connections
   | 'supersession';   // Defines version replacement
 
 /**
  * RELATION DIRECTION
  */
 export type RelationDirection = 'unidirectional' | 'bidirectional' | 'asymmetric';
 
 /**
  * FORMAL RELATION TYPE DEFINITION
  */
 export interface RelationTypeDefinition {
   code: string;
   name: string;
   category: RelationCategory;
   direction: RelationDirection;
   fromTypes: BaseObjectType[];
   toTypes: BaseObjectType[];
   inverseName: string | null;
   description: string;
   constraints: RelationConstraint[];
   schemaVersion: string;
 }
 
 export interface RelationConstraint {
   type: 'cardinality' | 'temporal' | 'exclusivity' | 'transitivity';
   rule: string;
 }
 
 /**
  * CANONICAL RELATION TYPES
  * 
  * These are the ONLY allowed relations in the system.
  * New relation types require formal definition.
  */
 export const RELATION_TYPES: Record<string, RelationTypeDefinition> = {
   // ============================================================
   // STRUCTURAL RELATIONS
   // ============================================================
   
   'part_of': {
     code: 'part_of',
     name: 'Part Of',
     category: 'structural',
     direction: 'asymmetric',
     fromTypes: ['entity'],
     toTypes: ['entity'],
     inverseName: 'has_part',
     description: 'Entity A is a component of Entity B',
     constraints: [
       { type: 'transitivity', rule: 'If A part_of B and B part_of C, then A part_of C' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'contains': {
     code: 'contains',
     name: 'Contains',
     category: 'structural',
     direction: 'asymmetric',
     fromTypes: ['entity'],
     toTypes: ['entity'],
     inverseName: 'contained_in',
     description: 'Entity A geographically or logically contains Entity B',
     constraints: [
       { type: 'transitivity', rule: 'If A contains B and B contains C, then A contains C' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'borders': {
     code: 'borders',
     name: 'Borders',
     category: 'structural',
     direction: 'bidirectional',
     fromTypes: ['entity'],
     toTypes: ['entity'],
     inverseName: null,
     description: 'Entity A shares a border with Entity B',
     constraints: [
       { type: 'exclusivity', rule: 'An entity cannot border itself' },
     ],
     schemaVersion: '1.0.0',
   },
   
   // ============================================================
   // TEMPORAL RELATIONS
   // ============================================================
   
   'preceded_by': {
     code: 'preceded_by',
     name: 'Preceded By',
     category: 'temporal',
     direction: 'asymmetric',
     fromTypes: ['entity', 'event'],
     toTypes: ['entity', 'event'],
     inverseName: 'precedes',
     description: 'A came after B in time',
     constraints: [
       { type: 'temporal', rule: 'A.valid_from >= B.valid_to' },
       { type: 'transitivity', rule: 'If A preceded_by B and B preceded_by C, then A preceded_by C' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'concurrent_with': {
     code: 'concurrent_with',
     name: 'Concurrent With',
     category: 'temporal',
     direction: 'bidirectional',
     fromTypes: ['event', 'measure'],
     toTypes: ['event', 'measure'],
     inverseName: null,
     description: 'A and B overlapped in time',
     constraints: [
       { type: 'temporal', rule: 'Time ranges must overlap' },
     ],
     schemaVersion: '1.0.0',
   },
   
   // ============================================================
   // SEMANTIC RELATIONS
   // ============================================================
   
   'has_attribute': {
     code: 'has_attribute',
     name: 'Has Attribute',
     category: 'semantic',
     direction: 'asymmetric',
     fromTypes: ['entity'],
     toTypes: ['attribute'],
     inverseName: 'attribute_of',
     description: 'Entity A has property B',
     constraints: [],
     schemaVersion: '1.0.0',
   },
   
   'related_to': {
     code: 'related_to',
     name: 'Related To',
     category: 'semantic',
     direction: 'bidirectional',
     fromTypes: ['entity', 'attribute', 'measure'],
     toTypes: ['entity', 'attribute', 'measure'],
     inverseName: null,
     description: 'Generic semantic relationship (use sparingly)',
     constraints: [
       { type: 'exclusivity', rule: 'Must specify sub-type if possible' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'defined_by': {
     code: 'defined_by',
     name: 'Defined By',
     category: 'semantic',
     direction: 'asymmetric',
     fromTypes: ['measure', 'attribute'],
     toTypes: ['source'],
     inverseName: 'defines',
     description: 'The meaning of A is specified by source B',
     constraints: [],
     schemaVersion: '1.0.0',
   },
   
   'same_as': {
     code: 'same_as',
     name: 'Same As',
     category: 'semantic',
     direction: 'bidirectional',
     fromTypes: ['entity', 'attribute', 'measure'],
     toTypes: ['entity', 'attribute', 'measure'],
     inverseName: null,
     description: 'A and B are the same concept from different sources',
     constraints: [
       { type: 'exclusivity', rule: 'Requires explicit definition match verification' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'similar_to': {
     code: 'similar_to',
     name: 'Similar To',
     category: 'semantic',
     direction: 'bidirectional',
     fromTypes: ['entity', 'attribute', 'measure'],
     toTypes: ['entity', 'attribute', 'measure'],
     inverseName: null,
     description: 'A and B are similar but NOT identical (definitions differ)',
     constraints: [
       { type: 'exclusivity', rule: 'Requires explicit difference documentation' },
     ],
     schemaVersion: '1.0.0',
   },
   
   // ============================================================
   // PROVENANCE RELATIONS
   // ============================================================
   
   'sourced_from': {
     code: 'sourced_from',
     name: 'Sourced From',
     category: 'provenance',
     direction: 'asymmetric',
     fromTypes: ['measure', 'event', 'attribute'],
     toTypes: ['source'],
     inverseName: 'is_source_of',
     description: 'Data A came from source B',
     constraints: [
       { type: 'cardinality', rule: 'Every data object MUST have at least one source' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'derived_from': {
     code: 'derived_from',
     name: 'Derived From',
     category: 'provenance',
     direction: 'asymmetric',
     fromTypes: ['measure', 'attribute'],
     toTypes: ['measure', 'attribute'],
     inverseName: 'is_basis_for',
     description: 'A was calculated or transformed from B',
     constraints: [
       { type: 'cardinality', rule: 'Derivation chain must be finite' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'validates': {
     code: 'validates',
     name: 'Validates',
     category: 'provenance',
     direction: 'asymmetric',
     fromTypes: ['source', 'measure'],
     toTypes: ['measure', 'event'],
     inverseName: 'validated_by',
     description: 'A provides evidence supporting B',
     constraints: [],
     schemaVersion: '1.0.0',
   },
   
   'contradicts': {
     code: 'contradicts',
     name: 'Contradicts',
     category: 'provenance',
     direction: 'bidirectional',
     fromTypes: ['measure', 'source'],
     toTypes: ['measure', 'source'],
     inverseName: null,
     description: 'A and B provide conflicting information (BOTH are stored)',
     constraints: [
       { type: 'exclusivity', rule: 'Contradiction is data, not error' },
     ],
     schemaVersion: '1.0.0',
   },
   
   // ============================================================
   // MEASUREMENT RELATIONS
   // ============================================================
   
   'measures': {
     code: 'measures',
     name: 'Measures',
     category: 'measurement',
     direction: 'asymmetric',
     fromTypes: ['measure'],
     toTypes: ['entity', 'attribute'],
     inverseName: 'measured_by',
     description: 'Measure A quantifies entity/attribute B',
     constraints: [],
     schemaVersion: '1.0.0',
   },
   
   'aggregates': {
     code: 'aggregates',
     name: 'Aggregates',
     category: 'measurement',
     direction: 'asymmetric',
     fromTypes: ['measure'],
     toTypes: ['measure'],
     inverseName: 'aggregated_into',
     description: 'Measure A is computed from multiple instances of B',
     constraints: [
       { type: 'cardinality', rule: 'Must reference at least 2 source measures' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'triggered_by': {
     code: 'triggered_by',
     name: 'Triggered By',
     category: 'measurement',
     direction: 'asymmetric',
     fromTypes: ['event'],
     toTypes: ['measure', 'event'],
     inverseName: 'triggers',
     description: 'Event A was detected because of B (correlation, NOT causation)',
     constraints: [
       { type: 'exclusivity', rule: 'Does NOT imply causation' },
     ],
     schemaVersion: '1.0.0',
   },
   
   // ============================================================
   // SUPERSESSION RELATIONS
   // ============================================================
   
   'supersedes': {
     code: 'supersedes',
     name: 'Supersedes',
     category: 'supersession',
     direction: 'asymmetric',
     fromTypes: ['entity', 'attribute', 'measure', 'source'],
     toTypes: ['entity', 'attribute', 'measure', 'source'],
     inverseName: 'superseded_by',
     description: 'A replaces B (B remains immutable)',
     constraints: [
       { type: 'temporal', rule: 'A.created_at > B.created_at' },
       { type: 'exclusivity', rule: 'Superseded object MUST NOT be modified' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'corrects': {
     code: 'corrects',
     name: 'Corrects',
     category: 'supersession',
     direction: 'asymmetric',
     fromTypes: ['measure', 'attribute'],
     toTypes: ['measure', 'attribute'],
     inverseName: 'corrected_by',
     description: 'A is a correction of B (error discovered)',
     constraints: [
       { type: 'exclusivity', rule: 'Must include correction rationale' },
     ],
     schemaVersion: '1.0.0',
   },
   
   'redefines': {
     code: 'redefines',
     name: 'Redefines',
     category: 'supersession',
     direction: 'asymmetric',
     fromTypes: ['attribute', 'measure'],
     toTypes: ['attribute', 'measure'],
     inverseName: 'redefined_by',
     description: 'A has a new definition that replaces B (semantic change)',
     constraints: [
       { type: 'exclusivity', rule: 'REQUIRES new ID - same ID redefine is forbidden' },
     ],
     schemaVersion: '1.0.0',
   },
 } as const;
 
 /**
  * Get all relation types for a specific category
  */
 export function getRelationTypesByCategory(category: RelationCategory): RelationTypeDefinition[] {
   return Object.values(RELATION_TYPES).filter(r => r.category === category);
 }
 
 /**
  * Get all valid relation types FROM a specific object type
  */
 export function getValidRelationsFrom(objectType: BaseObjectType): RelationTypeDefinition[] {
   return Object.values(RELATION_TYPES).filter(r => r.fromTypes.includes(objectType));
 }
 
 /**
  * Get all valid relation types TO a specific object type
  */
 export function getValidRelationsTo(objectType: BaseObjectType): RelationTypeDefinition[] {
   return Object.values(RELATION_TYPES).filter(r => r.toTypes.includes(objectType));
 }
 
 /**
  * Validate if a relation is allowed between two object types
  */
 export function isRelationValid(
   relationCode: string,
   fromType: BaseObjectType,
   toType: BaseObjectType
 ): { valid: boolean; error?: string } {
   const relation = RELATION_TYPES[relationCode];
   
   if (!relation) {
     return { valid: false, error: `Unknown relation type: ${relationCode}` };
   }
   
   if (!relation.fromTypes.includes(fromType)) {
     return { 
       valid: false, 
       error: `Relation ${relationCode} cannot originate from ${fromType}` 
     };
   }
   
   if (!relation.toTypes.includes(toType)) {
     return { 
       valid: false, 
       error: `Relation ${relationCode} cannot point to ${toType}` 
     };
   }
   
   return { valid: true };
 }