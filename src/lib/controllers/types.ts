 /**
  * CONTROLLER SYSTEM: Type Definitions
  * 
  * Machine-executable control and revision specifications.
  * Each controller tests a specific aspect of system integrity.
  */
 
 // =============================================================================
 // CONTROLLER TYPES
 // =============================================================================
 
 export type ControllerDomain = 
   | 'DATA'        // Data Integrity
   | 'NAVIGATION'  // No Dead Ends
   | 'UI'          // All Buttons Work
   | 'CHART'       // Chart Integrity
   | 'COGNITION';  // Cognitive Load
 
 export type ControllerStatus = 'passing' | 'warning' | 'failing' | 'not_run';
 
 export interface ControlCheck {
   id: string;
   name: string;
   description: string;
   domain: ControllerDomain;
   severity: 'critical' | 'warning' | 'info';
   checkFn: () => Promise<ControlCheckResult> | ControlCheckResult;
   autoFix?: () => Promise<boolean>;
   isEnabled: boolean;
 }
 
 export interface ControlCheckResult {
   passed: boolean;
   message: string;
   details?: Record<string, unknown>;
   affectedItems?: string[];
   recommendation?: string;
 }
 
 export interface ControllerResult {
   domain: ControllerDomain;
   name: string;
   status: ControllerStatus;
   checksRun: number;
   checksPassed: number;
   checksFailed: number;
   checksWarning: number;
   executionTimeMs: number;
   lastRun: string;
   findings: ControllerFinding[];
 }
 
 export interface ControllerFinding {
   checkId: string;
   severity: 'critical' | 'warning' | 'info';
   title: string;
   description: string;
   affectedItems: string[];
   recommendation: string;
   autoFixAvailable: boolean;
   fixAttempted: boolean;
   fixSucceeded: boolean | null;
 }
 
 export interface ControllerSuite {
   domain: ControllerDomain;
   name: string;
   description: string;
   checks: ControlCheck[];
   runOrder: 'sequential' | 'parallel';
 }
 
 // =============================================================================
 // SELF-REVISION QUESTIONS (Mandatory Loop)
 // =============================================================================
 
 export interface SelfRevisionQuestion {
   id: string;
   question: string;
   domain: ControllerDomain | 'SYSTEM';
   checkFn: () => Promise<boolean> | boolean;
   improvementAction: string;
 }
 
 export const SELF_REVISION_QUESTIONS: SelfRevisionQuestion[] = [
   {
     id: 'SRQ-001',
     question: 'Finns det någon datapunkt i systemet som inte kan leda vidare?',
     domain: 'NAVIGATION',
     checkFn: () => true, // Implement navigation depth check
     improvementAction: 'Implementera drill-down för alla datapunkter',
   },
   {
     id: 'SRQ-002',
     question: 'Finns det någon modul som är svårare att förstå än nödvändigt?',
     domain: 'COGNITION',
     checkFn: () => true, // Implement complexity check
     improvementAction: 'Förenkla gränssnitt eller lägg till förklaringar',
   },
   {
     id: 'SRQ-003',
     question: 'Finns det extern data som borde vara integrerad men inte är det?',
     domain: 'DATA',
     checkFn: () => true, // Implement coverage check
     improvementAction: 'Identifiera och integrera saknade datakällor',
   },
   {
     id: 'SRQ-004',
     question: 'Finns det index som kan förbättras genom ny kombination?',
     domain: 'DATA',
     checkFn: () => true, // Implement index optimization check
     improvementAction: 'Skapa nya sammansatta index',
   },
   {
     id: 'SRQ-005',
     question: 'Finns det användarflöden som inte känns självklara för en 15-åring?',
     domain: 'COGNITION',
     checkFn: () => false, // This needs improvement
     improvementAction: 'Förbättra UX med enklare förklaringar',
   },
 ];
 
 // =============================================================================
 // SYSTEM STATE
 // =============================================================================
 
 export interface SystemAuditState {
   isRunning: boolean;
   lastFullAudit: string | null;
   controllerResults: Record<ControllerDomain, ControllerResult | null>;
   selfRevisionResults: SelfRevisionResult[];
   overallHealth: 'healthy' | 'degraded' | 'critical';
   totalFindings: number;
   criticalFindings: number;
 }
 
 export interface SelfRevisionResult {
   questionId: string;
   passed: boolean;
   lastChecked: string;
   improvementInitiated: boolean;
 }