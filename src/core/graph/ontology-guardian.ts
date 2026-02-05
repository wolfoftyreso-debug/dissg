 /**
  * ONTOLOGY GUARDIAN
  * 
  * Automatic protection mechanism that:
  * - Runs all anti-pattern tests
  * - Blocks ingestion
  * - Blocks schema deployment
  * - Requires explicit override with logging
  * 
  * PRINCIPLE: Make errors impossible, not just detectable.
  */
 
 import { ANTI_PATTERNS, detectAntiPattern, type AntiPattern } from './anti-patterns';
 
 /**
  * GUARDIAN OPERATION TYPES
  */
 export type GuardianOperation = 
   | 'ingestion'           // New data coming in
   | 'schema_deploy'       // Schema changes
   | 'aggregation'         // Data aggregation
   | 'relation_create'     // New relation
   | 'entity_update'       // Entity modification
   | 'query_execute';      // Query execution
 
 /**
  * GUARDIAN VERDICT
  */
 export interface GuardianVerdict {
   allowed: boolean;
   operation: GuardianOperation;
   violations: ViolationRecord[];
   warnings: ViolationRecord[];
   timestamp: string;
   checksPerformed: number;
   executionTimeMs: number;
 }
 
 export interface ViolationRecord {
   antiPatternCode: string;
   antiPatternName: string;
   severity: 'blocking' | 'error' | 'warning';
   details: string;
   failAction: string;
   requiresOverride: boolean;
 }
 
 /**
  * OVERRIDE REQUEST
  * 
  * Overrides are intentionally painful, public, and traceable.
  */
 export interface OverrideRequest {
   id: string;
   operation: GuardianOperation;
   violationCodes: string[];
   
   // Required justification
   justification: string;
   businessRationale: string;
   technicalRationale: string;
   
   // Risk assessment
   acceptedRisks: string[];
   mitigationPlan: string;
   
   // Accountability
   requestedBy: string;
   approvedBy: string | null;
   
   // Temporal
   requestedAt: string;
   expiresAt: string; // Overrides are temporary by default
   
   // Status
   status: 'pending' | 'approved' | 'rejected' | 'expired';
 }
 
 export interface OverrideLog {
   overrideId: string;
   operation: GuardianOperation;
   violationCodes: string[];
   justification: string;
   requestedBy: string;
   approvedBy: string;
   appliedAt: string;
   outcome: 'success' | 'failure';
   notes: string;
 }
 
 /**
  * GUARDIAN STATE
  */
 interface GuardianState {
   activeOverrides: Map<string, OverrideRequest>;
   overrideLog: OverrideLog[];
   verdictHistory: GuardianVerdict[];
   isEnabled: boolean;
 }
 
 const guardianState: GuardianState = {
   activeOverrides: new Map(),
   overrideLog: [],
   verdictHistory: [],
   isEnabled: true,
 };
 
 /**
  * RUN GUARDIAN CHECK
  * 
  * Main entry point for all operations.
  */
 export function runGuardianCheck(
   operation: GuardianOperation,
   context: Record<string, unknown>
 ): GuardianVerdict {
   const startTime = performance.now();
   const violations: ViolationRecord[] = [];
   const warnings: ViolationRecord[] = [];
   
   if (!guardianState.isEnabled) {
     return {
       allowed: true,
       operation,
       violations: [],
       warnings: [],
       timestamp: new Date().toISOString(),
       checksPerformed: 0,
       executionTimeMs: 0,
     };
   }
   
   // Get relevant anti-patterns for this operation
   const relevantPatterns = getRelevantPatterns(operation);
   
   // Run each check
   for (const pattern of relevantPatterns) {
     const result = detectAntiPattern(pattern.code, context);
     
     if (result.violated) {
       const record: ViolationRecord = {
         antiPatternCode: pattern.code,
         antiPatternName: pattern.name,
         severity: pattern.severity,
         details: result.details ?? pattern.description,
         failAction: pattern.failAction,
         requiresOverride: pattern.severity === 'blocking',
       };
       
       if (pattern.severity === 'warning') {
         warnings.push(record);
       } else {
         violations.push(record);
       }
     }
   }
   
   // Check for active overrides
   const blockingViolations = violations.filter(v => v.severity === 'blocking');
   const hasOverride = checkActiveOverrides(operation, blockingViolations.map(v => v.antiPatternCode));
   
   const executionTimeMs = performance.now() - startTime;
   
   const verdict: GuardianVerdict = {
     allowed: blockingViolations.length === 0 || hasOverride,
     operation,
     violations,
     warnings,
     timestamp: new Date().toISOString(),
     checksPerformed: relevantPatterns.length,
     executionTimeMs,
   };
   
   // Log verdict
   guardianState.verdictHistory.push(verdict);
   
   // Keep only last 1000 verdicts
   if (guardianState.verdictHistory.length > 1000) {
     guardianState.verdictHistory = guardianState.verdictHistory.slice(-1000);
   }
   
   return verdict;
 }
 
 /**
  * GET RELEVANT PATTERNS FOR OPERATION
  */
 function getRelevantPatterns(operation: GuardianOperation): AntiPattern[] {
   const patterns = Object.values(ANTI_PATTERNS);
   
   switch (operation) {
     case 'ingestion':
       // All patterns apply to ingestion
       return patterns;
       
     case 'schema_deploy':
       // Focus on structural and semantic patterns
       return patterns.filter(p => 
         p.category === 'structural' || 
         p.category === 'semantic' ||
         p.category === 'meta'
       );
       
     case 'aggregation':
       // Focus on aggregation-related patterns
       return patterns.filter(p => 
         p.code.includes('AGG') || 
         p.code.includes('UNIT') ||
         p.code.includes('TEMP')
       );
       
     case 'relation_create':
       return patterns.filter(p => p.category === 'structural');
       
     case 'entity_update':
       return patterns.filter(p => 
         p.category === 'temporal' || 
         p.code.includes('MIGRATE')
       );
       
     case 'query_execute':
       return patterns.filter(p => 
         p.code.includes('AGG') || 
         p.code.includes('TEMP')
       );
       
     default:
       return patterns;
   }
 }
 
 /**
  * CHECK FOR ACTIVE OVERRIDES
  */
 function checkActiveOverrides(operation: GuardianOperation, violationCodes: string[]): boolean {
   for (const [, override] of guardianState.activeOverrides) {
     if (
       override.status === 'approved' &&
       override.operation === operation &&
       new Date(override.expiresAt) > new Date() &&
       violationCodes.every(code => override.violationCodes.includes(code))
     ) {
       return true;
     }
   }
   return false;
 }
 
 /**
  * REQUEST OVERRIDE
  * 
  * Creates an override request. Must be approved before use.
  */
 export function requestOverride(
   operation: GuardianOperation,
   violationCodes: string[],
   justification: {
     rationale: string;
     businessRationale: string;
     technicalRationale: string;
     acceptedRisks: string[];
     mitigationPlan: string;
   },
   requestedBy: string,
   durationHours: number = 24
 ): OverrideRequest {
   // Validate that all violation codes exist
   for (const code of violationCodes) {
     if (!ANTI_PATTERNS[code]) {
       throw new Error(`Unknown anti-pattern code: ${code}`);
     }
   }
   
   // Generate unique ID
   const id = `override_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   
   const override: OverrideRequest = {
     id,
     operation,
     violationCodes,
     justification: justification.rationale,
     businessRationale: justification.businessRationale,
     technicalRationale: justification.technicalRationale,
     acceptedRisks: justification.acceptedRisks,
     mitigationPlan: justification.mitigationPlan,
     requestedBy,
     approvedBy: null,
     requestedAt: new Date().toISOString(),
     expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString(),
     status: 'pending',
   };
   
   guardianState.activeOverrides.set(id, override);
   
   return override;
 }
 
 /**
  * APPROVE OVERRIDE
  * 
  * Must be different person from requester.
  */
 export function approveOverride(overrideId: string, approvedBy: string): boolean {
   const override = guardianState.activeOverrides.get(overrideId);
   
   if (!override) {
     throw new Error(`Override not found: ${overrideId}`);
   }
   
   if (override.status !== 'pending') {
     throw new Error(`Override is not pending: ${override.status}`);
   }
   
   // Self-approval is forbidden
   if (override.requestedBy === approvedBy) {
     throw new Error('Self-approval is forbidden. Different person must approve.');
   }
   
   override.approvedBy = approvedBy;
   override.status = 'approved';
   
   // Log the approval
   guardianState.overrideLog.push({
     overrideId,
     operation: override.operation,
     violationCodes: override.violationCodes,
     justification: override.justification,
     requestedBy: override.requestedBy,
     approvedBy,
     appliedAt: new Date().toISOString(),
     outcome: 'success',
     notes: 'Override approved and active',
   });
   
   return true;
 }
 
 /**
  * REJECT OVERRIDE
  */
 export function rejectOverride(overrideId: string, rejectedBy: string, reason: string): boolean {
   const override = guardianState.activeOverrides.get(overrideId);
   
   if (!override) {
     throw new Error(`Override not found: ${overrideId}`);
   }
   
   override.status = 'rejected';
   
   // Log the rejection
   guardianState.overrideLog.push({
     overrideId,
     operation: override.operation,
     violationCodes: override.violationCodes,
     justification: override.justification,
     requestedBy: override.requestedBy,
     approvedBy: rejectedBy,
     appliedAt: new Date().toISOString(),
     outcome: 'failure',
     notes: `Rejected: ${reason}`,
   });
   
   return true;
 }
 
 /**
  * GET GUARDIAN STATS
  */
 export function getGuardianStats(): {
   totalChecks: number;
   totalBlocked: number;
   totalWarnings: number;
   activeOverrides: number;
   recentVerdicts: GuardianVerdict[];
 } {
   const recentVerdicts = guardianState.verdictHistory.slice(-10);
   
   return {
     totalChecks: guardianState.verdictHistory.length,
     totalBlocked: guardianState.verdictHistory.filter(v => !v.allowed).length,
     totalWarnings: guardianState.verdictHistory.reduce((sum, v) => sum + v.warnings.length, 0),
     activeOverrides: Array.from(guardianState.activeOverrides.values())
       .filter(o => o.status === 'approved' && new Date(o.expiresAt) > new Date()).length,
     recentVerdicts,
   };
 }
 
 /**
  * GET OVERRIDE LOG
  */
 export function getOverrideLog(): OverrideLog[] {
   return [...guardianState.overrideLog];
 }
 
 /**
  * ENABLE/DISABLE GUARDIAN
  * 
  * Disabling requires override!
  */
 export function setGuardianEnabled(enabled: boolean, justification?: string): void {
   if (!enabled && !justification) {
     throw new Error('Disabling guardian requires justification');
   }
   
   guardianState.isEnabled = enabled;
   
   if (!enabled) {
     guardianState.overrideLog.push({
       overrideId: 'guardian_disabled',
       operation: 'ingestion',
       violationCodes: ['GUARDIAN_DISABLED'],
       justification: justification!,
       requestedBy: 'system',
       approvedBy: 'system',
       appliedAt: new Date().toISOString(),
       outcome: 'success',
       notes: 'Guardian disabled',
     });
   }
 }
 
 /**
  * EXPIRE OLD OVERRIDES
  * 
  * Should be called periodically.
  */
 export function expireOldOverrides(): number {
   const now = new Date();
   let expiredCount = 0;
   
   for (const [id, override] of guardianState.activeOverrides) {
     if (new Date(override.expiresAt) < now && override.status === 'approved') {
       override.status = 'expired';
       expiredCount++;
       
       guardianState.overrideLog.push({
         overrideId: id,
         operation: override.operation,
         violationCodes: override.violationCodes,
         justification: override.justification,
         requestedBy: override.requestedBy,
         approvedBy: override.approvedBy ?? 'none',
         appliedAt: new Date().toISOString(),
         outcome: 'success',
         notes: 'Override expired automatically',
       });
     }
   }
   
   return expiredCount;
 }