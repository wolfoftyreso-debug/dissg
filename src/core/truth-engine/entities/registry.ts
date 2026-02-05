 /**
  * TRUTH ENGINE - ENTITY REGISTRY
  * 
  * Step 9.4: Central registry for all known entities.
  * 
  * Rule: If an entity_id is not in this registry,
  * any measure referencing it MUST be rejected.
  */
 
 import type { Entity } from '../core/ontology';
 import { SWEDEN, SWEDEN_ENTITY_SOURCE } from './sweden';
 
 /**
  * ENTITY_REGISTRY
  * 
  * This is the single source of truth for entity existence.
  * Fantasy worlds (Narnia, etc.) are not allowed.
  */
 const ENTITY_REGISTRY: Map<string, Entity> = new Map();
 
 // Register Sweden
 ENTITY_REGISTRY.set(SWEDEN.id, SWEDEN);
 
 /**
  * Check if an entity exists
  */
 export function entityExists(entityId: string): boolean {
   return ENTITY_REGISTRY.has(entityId);
 }
 
 /**
  * Get an entity by ID
  */
 export function getEntity(entityId: string): Entity | undefined {
   return ENTITY_REGISTRY.get(entityId);
 }
 
 /**
  * Register a new entity (with validation)
  */
 export function registerEntity(entity: Entity): { success: boolean; error?: string } {
   if (!entity.id) {
     return { success: false, error: 'Entity missing id' };
   }
   if (entity.baseClass !== 'Entity') {
     return { success: false, error: 'Object is not an Entity' };
   }
   if (ENTITY_REGISTRY.has(entity.id)) {
     return { success: false, error: `Entity ${entity.id} already exists` };
   }
   
   ENTITY_REGISTRY.set(entity.id, entity);
   return { success: true };
 }
 
 /**
  * Get all registered entities
  */
 export function getAllEntities(): Entity[] {
   return Array.from(ENTITY_REGISTRY.values());
 }
 
 /**
  * Get registry stats
  */
 export function getRegistryStats(): { count: number; types: Record<string, number> } {
   const types: Record<string, number> = {};
   
   for (const entity of ENTITY_REGISTRY.values()) {
     const type = entity.entity_type;
     types[type] = (types[type] || 0) + 1;
   }
   
   return {
     count: ENTITY_REGISTRY.size,
     types,
   };
 }
 
 /**
  * Export for direct access (read-only)
  */
 export { SWEDEN, SWEDEN_ENTITY_SOURCE };