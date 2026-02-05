 /**
  * ZONE ARCHITECTURE
  * 
  * Four isolated zones where nothing writes backward
  * and no zone can skip another.
  * 
  * [ INGESTION ] → [ VALIDATION ] → [ CANONICAL CORE ] → [ QUERY ]
  */
 
 /**
  * ZONE DEFINITIONS
  */
 export type Zone = 
   | 'ingestion'
   | 'validation'
   | 'canonical_core'
   | 'query';
 
 export const ZONE_HIERARCHY: readonly Zone[] = [
   'ingestion',
   'validation',
   'canonical_core',
   'query',
 ] as const;
 
 /**
  * ZONE CAPABILITIES
  */
 export interface ZoneCapabilities {
   zone: Zone;
   canRead: Zone[];
   canWrite: Zone[];
   canShutdown: boolean;
   canScale: boolean;
   canReplace: boolean;
 }
 
 export const ZONE_CAPABILITIES: Record<Zone, ZoneCapabilities> = {
   ingestion: {
     zone: 'ingestion',
     canRead: [],
     canWrite: ['validation'], // Only forward
     canShutdown: true,
     canScale: true,
     canReplace: true,
   },
   
   validation: {
     zone: 'validation',
     canRead: ['ingestion', 'canonical_core'], // Can read all for validation
     canWrite: ['canonical_core'], // Only forward
     canShutdown: true,
     canScale: true,
     canReplace: false, // Critical - replace requires new version
   },
   
   canonical_core: {
     zone: 'canonical_core',
     canRead: [],
     canWrite: [], // WRITES NOTHING - only receives
     canShutdown: false, // NEVER
     canScale: false, // Fixed
     canReplace: false, // NEVER
   },
   
   query: {
     zone: 'query',
     canRead: ['canonical_core'],
     canWrite: [], // Never writes to core
     canShutdown: true,
     canScale: true,
     canReplace: true,
   },
 } as const;
 
 /**
  * ZONE INVARIANTS
  */
 export const ZONE_INVARIANTS = {
   noBackwardWrites: 'No zone can write to a zone earlier in the hierarchy',
   noZoneSkipping: 'Data must flow through all zones in order',
   coreImmutable: 'Canonical core cannot be modified, only appended',
   validationBlocksAll: 'Validation zone can block any downstream write',
   queryIsolated: 'Query zone has no write path to any other zone',
 } as const;
 
 /**
  * VALIDATE ZONE FLOW
  */
 export function validateZoneFlow(
   from: Zone,
   to: Zone,
   operation: 'read' | 'write'
 ): { allowed: boolean; reason?: string } {
   const capabilities = ZONE_CAPABILITIES[from];
   
   if (operation === 'write') {
     // Check if write is allowed
     if (!capabilities.canWrite.includes(to)) {
       return {
         allowed: false,
         reason: `Zone ${from} cannot write to ${to}`,
       };
     }
     
     // Check for backward writes
     const fromIndex = ZONE_HIERARCHY.indexOf(from);
     const toIndex = ZONE_HIERARCHY.indexOf(to);
     
     if (toIndex < fromIndex) {
       return {
         allowed: false,
         reason: `Backward write from ${from} to ${to} violates zone hierarchy`,
       };
     }
     
     // Check for zone skipping
     if (toIndex > fromIndex + 1) {
       return {
         allowed: false,
         reason: `Zone skip from ${from} to ${to} violates sequential flow`,
       };
     }
   }
   
   if (operation === 'read') {
     if (!capabilities.canRead.includes(to)) {
       return {
         allowed: false,
         reason: `Zone ${from} cannot read from ${to}`,
       };
     }
   }
   
   return { allowed: true };
 }
 
 /**
  * ZONE HEALTH CHECK
  */
 export interface ZoneHealthStatus {
   zone: Zone;
   status: 'healthy' | 'degraded' | 'critical' | 'offline';
   lastCheck: string;
   invariantsIntact: boolean;
   violations: string[];
 }
 
 export function checkZoneHealth(zone: Zone): ZoneHealthStatus {
   // This would connect to actual infrastructure
   // For now, return structure
   return {
     zone,
     status: 'healthy',
     lastCheck: new Date().toISOString(),
     invariantsIntact: true,
     violations: [],
   };
 }