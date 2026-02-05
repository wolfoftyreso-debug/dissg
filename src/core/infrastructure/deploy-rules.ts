 /**
  * DEPLOY RULES
  * 
  * The most missed part of infrastructure design.
  * 
  * FORBIDDEN:
  * - Hotfix directly in production
  * - "Quick change"
  * - Manual override without trace
  * 
  * ALLOWED:
  * - New version
  * - New schema ID
  * - New pipeline
  * 
  * Old versions live forever. ALWAYS.
  */
 
 /**
  * DEPLOY ACTION TYPES
  */
 export type DeployAction =
   | 'new_version'
   | 'new_schema'
   | 'new_pipeline'
   | 'rollback'
   | 'hotfix'        // FORBIDDEN
   | 'quick_change'  // FORBIDDEN
   | 'manual_override'; // FORBIDDEN
 
 /**
  * DEPLOY RULES
  */
 export interface DeployRule {
   action: DeployAction;
   allowed: boolean;
   requiresApproval: number; // Number of approvers required
   requiresTrace: boolean;
   rollbackPossible: boolean;
   description: string;
 }
 
 export const DEPLOY_RULES: Record<DeployAction, DeployRule> = {
   new_version: {
     action: 'new_version',
     allowed: true,
     requiresApproval: 2,
     requiresTrace: true,
     rollbackPossible: true,
     description: 'Deploy new version of existing component',
   },
   
   new_schema: {
     action: 'new_schema',
     allowed: true,
     requiresApproval: 3,
     requiresTrace: true,
     rollbackPossible: false, // Schemas are additive
     description: 'Add new schema version (old versions remain)',
   },
   
   new_pipeline: {
     action: 'new_pipeline',
     allowed: true,
     requiresApproval: 2,
     requiresTrace: true,
     rollbackPossible: true,
     description: 'Deploy new pipeline version',
   },
   
   rollback: {
     action: 'rollback',
     allowed: true,
     requiresApproval: 1,
     requiresTrace: true,
     rollbackPossible: true,
     description: 'Rollback to previous version',
   },
   
   hotfix: {
     action: 'hotfix',
     allowed: false,
     requiresApproval: -1, // Not applicable
     requiresTrace: true,
     rollbackPossible: false,
     description: 'FORBIDDEN: No hotfixes in production',
   },
   
   quick_change: {
     action: 'quick_change',
     allowed: false,
     requiresApproval: -1,
     requiresTrace: true,
     rollbackPossible: false,
     description: 'FORBIDDEN: No quick changes',
   },
   
   manual_override: {
     action: 'manual_override',
     allowed: false,
     requiresApproval: -1,
     requiresTrace: true,
     rollbackPossible: false,
     description: 'FORBIDDEN: No manual overrides without trace',
   },
 };
 
 /**
  * DEPLOY REQUEST
  */
 export interface DeployRequest {
   id: string;
   action: DeployAction;
   requestedBy: string;
   requestedAt: string;
   component: string;
   fromVersion?: string;
   toVersion: string;
   reason: string;
   approvals: Approval[];
   status: DeployStatus;
 }
 
 export interface Approval {
   approver: string;
   approvedAt: string;
   comment?: string;
 }
 
 export type DeployStatus =
   | 'pending_approval'
   | 'approved'
   | 'deploying'
   | 'deployed'
   | 'failed'
   | 'rejected'
   | 'blocked';
 
 /**
  * VALIDATE DEPLOY REQUEST
  */
 export function validateDeployRequest(
   request: DeployRequest
 ): { valid: boolean; blockReason?: string } {
   const rule = DEPLOY_RULES[request.action];
   
   // Check if action is allowed
   if (!rule.allowed) {
     return {
       valid: false,
       blockReason: `Action ${request.action} is FORBIDDEN: ${rule.description}`,
     };
   }
   
   // Check approvals
   if (request.approvals.length < rule.requiresApproval) {
     return {
       valid: false,
       blockReason: `Requires ${rule.requiresApproval} approvals, has ${request.approvals.length}`,
     };
   }
   
   // Check trace requirement
   if (rule.requiresTrace && !request.reason) {
     return {
       valid: false,
       blockReason: 'Trace required: reason must be provided',
     };
   }
   
   return { valid: true };
 }
 
 /**
  * VERSION REGISTRY
  * 
  * Old versions live forever.
  */
 export interface VersionEntry {
   component: string;
   version: string;
   deployedAt: string;
   deployedBy: string;
   status: 'active' | 'inactive' | 'deprecated';
   deprecatedAt?: string;
   // NEVER deleted, only deprecated
 }
 
 export interface VersionRegistry {
   versions: VersionEntry[];
   
   /** Get all versions for a component (including deprecated) */
   getVersions(component: string): VersionEntry[];
   
   /** Get active version */
   getActive(component: string): VersionEntry | undefined;
   
   /** Add new version (never removes old) */
   addVersion(entry: VersionEntry): void;
   
   /** Deprecate version (never delete) */
   deprecateVersion(component: string, version: string): void;
 }
 
 /**
  * CREATE VERSION REGISTRY
  */
 export function createVersionRegistry(): VersionRegistry {
   const versions: VersionEntry[] = [];
   
   return {
     versions,
     
     getVersions(component: string): VersionEntry[] {
       return versions.filter(v => v.component === component);
     },
     
     getActive(component: string): VersionEntry | undefined {
       return versions.find(v => v.component === component && v.status === 'active');
     },
     
     addVersion(entry: VersionEntry): void {
       // Deprecate current active version
       const current = this.getActive(entry.component);
       if (current) {
         current.status = 'inactive';
       }
       versions.push(entry);
     },
     
     deprecateVersion(component: string, version: string): void {
       const entry = versions.find(
         v => v.component === component && v.version === version
       );
       if (entry) {
         entry.status = 'deprecated';
         entry.deprecatedAt = new Date().toISOString();
       }
       // NEVER delete
     },
   };
 }
 
 /**
  * DEPLOY INVARIANTS
  */
 export const DEPLOY_INVARIANTS = {
   noHotfixes: 'No hotfixes directly in production',
   noQuickChanges: 'No "quick changes" - all changes are versioned',
   noManualOverride: 'No manual override without audit trace',
   versionsLiveForever: 'Old versions are never deleted',
   allDeploysTraced: 'All deploys have reason and approvals',
 } as const;