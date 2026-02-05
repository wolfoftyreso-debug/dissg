 /**
  * TRUTH ENGINE SPEC - SECTION 3
  * 
  * IDENTITY & VERSIONING
  */
 
 /**
  * 3.1 IDENTITY LAW
  * 
  * Identity is ETERNAL.
  * Meaning is VERSIONED.
  */
 export const IDENTITY_LAW = {
   principle: 'Identity is eternal. Meaning is versioned.',
   implications: [
     'An ID once assigned NEVER changes meaning',
     'If meaning changes, a NEW ID must be created',
     'Old ID continues to reference old meaning',
   ],
 } as const;
 
 /**
  * 3.2 VERSIONING LAW
  */
 export const VERSIONING_LAW = {
   forbidden: [
     'In-place modifications',
     'Meaning changes without new ID',
     'Orphaned versions (no supersedes chain)',
   ],
   required: [
     'supersedes relation for all meaning changes',
     'Explicit version number',
     'Timestamp for version creation',
   ],
 } as const;
 
 /**
  * VERSION STRUCTURE
  */
 export interface Version {
   readonly id: string;
   readonly version_number: number;
   readonly supersedes: string | null; // ID of previous version
   readonly superseded_by: string | null; // ID of next version (null if current)
   readonly valid_from: string;
   readonly valid_to: string | null;
   readonly meaning_hash: string; // Hash of semantic content
 }
 
 /**
  * Validate version chain integrity
  */
 export function validateVersionChain(versions: Version[]): {
   valid: boolean;
   errors: string[];
 } {
   const errors: string[] = [];
   
   // Sort by version number
   const sorted = [...versions].sort((a, b) => a.version_number - b.version_number);
   
   for (let i = 0; i < sorted.length; i++) {
     const current = sorted[i];
     const prev = sorted[i - 1];
     const next = sorted[i + 1];
     
     // Check supersedes chain
     if (i > 0 && current.supersedes !== prev.id) {
       errors.push(`Version ${current.version_number} should supersede ${prev.id}`);
     }
     
     // Check superseded_by chain
     if (next && current.superseded_by !== next.id) {
       errors.push(`Version ${current.version_number} should be superseded by ${next.id}`);
     }
     
     // Check version numbers are sequential
     if (prev && current.version_number !== prev.version_number + 1) {
       errors.push(`Version numbers must be sequential: ${prev.version_number} -> ${current.version_number}`);
     }
   }
   
   return {
     valid: errors.length === 0,
     errors,
   };
 }
 
 /**
  * Assert no in-place modification
  */
 export function assertNoInPlaceModification(
   oldHash: string, 
   newHash: string, 
   newVersionCreated: boolean
 ): void {
   if (oldHash !== newHash && !newVersionCreated) {
     throw new Error('VERSIONING VIOLATION: Meaning changed without creating new version');
   }
 }