 /**
  * TRUTH ENGINE SPEC - SECTION 4
  * 
  * TEMPORAL LAW
  */
 
 /**
  * 4.1 ABSOLUTE TIME REQUIREMENT
  * 
  * NO data point without:
  * - observed_at
  * - valid_from
  * - valid_to (nullable)
  */
 export interface TemporalEnvelope {
   readonly observed_at: string;  // When observation was made
   readonly valid_from: string;   // When validity begins
   readonly valid_to: string | null; // When validity ends (null = ongoing)
 }
 
 export function validateTemporalEnvelope(envelope: Partial<TemporalEnvelope>): {
   valid: boolean;
   missing: string[];
 } {
   const missing: string[] = [];
   
   if (!envelope.observed_at) missing.push('observed_at');
   if (!envelope.valid_from) missing.push('valid_from');
   // valid_to is nullable, so not required
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }
 
 /**
  * 4.2 HISTORICAL SANCTITY
  * 
  * History may NEVER be overwritten, only replaced with new versions.
  */
 export const HISTORICAL_SANCTITY_LAW = {
   principle: 'History may never be overwritten, only replaced with new versions.',
   
   allowed: [
     'Create new version superseding old',
     'Mark old version as superseded',
     'Add correction with explicit link to original',
   ],
   
   forbidden: [
     'UPDATE of historical record',
     'DELETE of historical record',
     'Modification of observed_at timestamp',
     'Retroactive changes without new version',
   ],
 } as const;
 
 /**
  * Assert historical sanctity
  */
 export function assertHistoricalSanctity(
   operation: 'CREATE' | 'UPDATE' | 'DELETE',
   isHistoricalRecord: boolean
 ): void {
   if (isHistoricalRecord && operation === 'UPDATE') {
     throw new Error('TEMPORAL VIOLATION: Cannot UPDATE historical record. Create new version instead.');
   }
   
   if (isHistoricalRecord && operation === 'DELETE') {
     throw new Error('TEMPORAL VIOLATION: Cannot DELETE historical record. Mark as superseded instead.');
   }
 }
 
 /**
  * Time comparison utilities
  */
 export function isWithinValidityPeriod(
   envelope: TemporalEnvelope,
   queryTime: string
 ): boolean {
   const query = new Date(queryTime);
   const from = new Date(envelope.valid_from);
   const to = envelope.valid_to ? new Date(envelope.valid_to) : new Date('9999-12-31');
   
   return query >= from && query <= to;
 }