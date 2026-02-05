 /**
  * AUDIT MEMORY
  * 
  * Eternal memory. Every decision is stored.
  * 
  * NOTHING is deleted.
  * NOTHING is edited.
  */
 
 /**
  * AUDIT ENTRY TYPES
  */
 export type AuditEntryType =
   | 'schema_override'
   | 'ingestion_block'
   | 'deploy_decision'
   | 'access_grant'
   | 'access_revoke'
   | 'invariant_exception'
   | 'red_team_finding'
   | 'revision_event';
 
 /**
  * AUDIT ENTRY
  */
 export interface AuditEntry {
   id: string;
   type: AuditEntryType;
   timestamp: string;
   
   /** Who made this decision */
   actor: string;
   
   /** What was decided */
   decision: string;
   
   /** Why (required) */
   rationale: string;
   
   /** Affected entities */
   affectedEntities: string[];
   
   /** Full context snapshot */
   context: Record<string, unknown>;
   
   /** Hash for integrity verification */
   hash: string;
   
   /** Previous entry hash (chain) */
   previousHash?: string;
 }
 
 /**
  * AUDIT LOG
  */
 export class AuditLog {
   private entries: AuditEntry[] = [];
   private lastHash?: string;
   
   /**
    * APPEND ENTRY (only operation allowed)
    */
   append(entry: Omit<AuditEntry, 'id' | 'hash' | 'previousHash'>): AuditEntry {
     const fullEntry: AuditEntry = {
       ...entry,
       id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       previousHash: this.lastHash,
       hash: '', // Will be computed
     };
     
     fullEntry.hash = this.computeHash(fullEntry);
     this.lastHash = fullEntry.hash;
     
     this.entries.push(fullEntry);
     
     return fullEntry;
   }
   
   /**
    * GET ALL ENTRIES (read-only)
    */
   getAll(): readonly AuditEntry[] {
     return Object.freeze([...this.entries]);
   }
   
   /**
    * GET BY TYPE
    */
   getByType(type: AuditEntryType): AuditEntry[] {
     return this.entries.filter(e => e.type === type);
   }
   
   /**
    * GET BY DATE RANGE
    */
   getByDateRange(start: string, end: string): AuditEntry[] {
     return this.entries.filter(e => 
       e.timestamp >= start && e.timestamp <= end
     );
   }
   
   /**
    * VERIFY CHAIN INTEGRITY
    */
   verifyIntegrity(): { valid: boolean; brokenAt?: string } {
     for (let i = 1; i < this.entries.length; i++) {
       const entry = this.entries[i];
       const previousEntry = this.entries[i - 1];
       
       if (entry.previousHash !== previousEntry.hash) {
         return { valid: false, brokenAt: entry.id };
       }
       
       const recomputedHash = this.computeHash({
         ...entry,
         hash: '',
       } as AuditEntry);
       
       if (recomputedHash !== entry.hash) {
         return { valid: false, brokenAt: entry.id };
       }
     }
     
     return { valid: true };
   }
   
   /**
    * COMPUTE HASH
    */
   private computeHash(entry: AuditEntry): string {
     const str = JSON.stringify({
       type: entry.type,
       timestamp: entry.timestamp,
       actor: entry.actor,
       decision: entry.decision,
       rationale: entry.rationale,
       affectedEntities: entry.affectedEntities,
       context: entry.context,
       previousHash: entry.previousHash,
     });
     
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       const char = str.charCodeAt(i);
       hash = ((hash << 5) - hash) + char;
       hash = hash & hash;
     }
     return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
   }
   
   // ============================================
   // FORBIDDEN OPERATIONS (will throw)
   // ============================================
   
   delete(): never {
     throw new Error('FORBIDDEN: Audit entries cannot be deleted');
   }
   
   update(): never {
     throw new Error('FORBIDDEN: Audit entries cannot be updated');
   }
   
   clear(): never {
     throw new Error('FORBIDDEN: Audit log cannot be cleared');
   }
 }
 
 /**
  * AUDIT INVARIANTS
  */
 export const AUDIT_INVARIANTS = {
   appendOnly: 'Only append operations allowed',
   noDelete: 'Delete is forbidden',
   noUpdate: 'Update is forbidden',
   chainIntegrity: 'Hash chain must be unbroken',
   rationaleRequired: 'Every entry must have rationale',
 } as const;
 
 /**
  * CREATE AUDIT LOG
  */
 export function createAuditLog(): AuditLog {
   return new AuditLog();
 }