 /**
  * RED TEAM CHECKS
  * 
  * Mandatory checks that must run regularly.
  * These detect unknown future failures.
  */
 
 import { RED_TEAM_ACTORS, RED_FLAG_SCENARIOS, type ThreatScenario } from './threat-model';
 
 /**
  * CHECK RESULT
  */
 export interface RedTeamCheckResult {
   checkId: string;
   checkName: string;
   passed: boolean;
   severity: 'critical' | 'high' | 'medium' | 'low';
   details: string;
   violations: RedTeamViolation[];
   executedAt: string;
   executionTimeMs: number;
 }
 
 export interface RedTeamViolation {
   code: string;
   description: string;
   evidence: string;
   recommendation: string;
 }
 
 /**
  * RED TEAM CHECK DEFINITIONS
  */
 export interface RedTeamCheck {
   id: string;
   name: string;
   description: string;
   actorId: string | null; // null = system-wide
   frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
   selfTest: string;
   execute: (context: RedTeamContext) => RedTeamCheckResult;
 }
 
 export interface RedTeamContext {
   // Query context
   query?: {
     type: string;
     parameters: Record<string, unknown>;
     result?: unknown;
   };
   
   // Schema context
   schemas?: {
     id: string;
     definition: string;
     definitionHash: string;
     validFrom: string;
     validTo?: string;
   }[];
   
   // Aggregation context
   aggregation?: {
     operation: string;
     sources: string[];
     result: unknown;
     hasExplicitPermission: boolean;
   };
   
   // Source context
   sources?: {
     id: string;
     methodology: string;
     reliability: number;
   }[];
   
   // Time context
   timeRange?: {
     start: string;
     end: string;
   };
   
   // Output context
   output?: {
     hasUncertainty: boolean;
     hasCaveats: boolean;
     hasConfidenceBounds: boolean;
     isScalar: boolean;
   };
 }
 
 /**
  * CHECK 3.1: TOO CLEAN RESULT
  * 
  * If a complex global result lacks uncertainty → fail
  */
 export const CHECK_TOO_CLEAN_RESULT: RedTeamCheck = {
   id: 'RT-CHECK-3.1',
   name: 'Too Clean Result',
   description: 'Complex global results must include uncertainty',
   actorId: 'RT-4',
   frequency: 'realtime',
   selfTest: 'ASSERT no_complex_query RETURNS single_scalar WITHOUT confidence',
   
   execute: (context: RedTeamContext): RedTeamCheckResult => {
     const startTime = performance.now();
     const violations: RedTeamViolation[] = [];
     
     // Check if output is too clean
     if (context.output?.isScalar && !context.output?.hasConfidenceBounds) {
       // Check if this is a complex query
       const isComplex = 
         (context.sources?.length ?? 0) > 1 ||
         (context.schemas?.length ?? 0) > 1 ||
         context.aggregation != null;
       
       if (isComplex) {
         violations.push({
           code: 'RT-3.1-CLEAN',
           description: 'Complex query returned scalar without confidence bounds',
           evidence: `Sources: ${context.sources?.length ?? 0}, Schemas: ${context.schemas?.length ?? 0}`,
           recommendation: 'Add confidence intervals and caveats to output',
         });
       }
     }
     
     // Check for missing uncertainty
     if (context.output && !context.output.hasUncertainty) {
       violations.push({
         code: 'RT-3.1-UNC',
         description: 'Output lacks uncertainty model',
         evidence: 'hasUncertainty = false',
         recommendation: 'Include uncertainty quantification in all outputs',
       });
     }
     
     return {
       checkId: 'RT-CHECK-3.1',
       checkName: 'Too Clean Result',
       passed: violations.length === 0,
       severity: 'critical',
       details: violations.length === 0 
         ? 'Output includes appropriate uncertainty' 
         : `Found ${violations.length} cleanliness violations`,
       violations,
       executedAt: new Date().toISOString(),
       executionTimeMs: performance.now() - startTime,
     };
   },
 };
 
 /**
  * CHECK 3.2: DEFINITION DRIFT DETECTOR
  * 
  * Can the same question be asked today and 20 years ago with different meaning?
  */
 export const CHECK_DEFINITION_DRIFT: RedTeamCheck = {
   id: 'RT-CHECK-3.2',
   name: 'Definition Drift Detector',
   description: 'Detect when same query has different meaning over time',
   actorId: 'RT-3',
   frequency: 'daily',
   selfTest: 'FOR EACH metric: ASSERT definition_consistency_over_time',
   
   execute: (context: RedTeamContext): RedTeamCheckResult => {
     const startTime = performance.now();
     const violations: RedTeamViolation[] = [];
     
     if (!context.schemas || !context.timeRange) {
       return {
         checkId: 'RT-CHECK-3.2',
         checkName: 'Definition Drift Detector',
         passed: true,
         severity: 'high',
         details: 'No schemas or time range to check',
         violations: [],
         executedAt: new Date().toISOString(),
         executionTimeMs: performance.now() - startTime,
       };
     }
     
     // Group schemas by concept and check for definition changes
     const schemasByRoot: Record<string, typeof context.schemas> = {};
     
     for (const schema of context.schemas) {
       const rootId = schema.id.replace(/:v\d+$/, '');
       if (!schemasByRoot[rootId]) {
         schemasByRoot[rootId] = [];
       }
       schemasByRoot[rootId].push(schema);
     }
     
     // Check each concept for definition drift
     for (const [rootId, versions] of Object.entries(schemasByRoot)) {
       if (versions.length > 1) {
         // Multiple versions exist - check if query spans versions
         const queryStart = new Date(context.timeRange.start);
         const queryEnd = new Date(context.timeRange.end);
         
         const versionsInRange = versions.filter(v => {
           const validFrom = new Date(v.validFrom);
           const validTo = v.validTo ? new Date(v.validTo) : new Date();
           return validFrom <= queryEnd && validTo >= queryStart;
         });
         
         if (versionsInRange.length > 1) {
           violations.push({
             code: 'RT-3.2-DRIFT',
             description: `Query spans multiple definition versions for ${rootId}`,
             evidence: `Versions in range: ${versionsInRange.map(v => v.id).join(', ')}`,
             recommendation: 'Force user to select specific definition version or split query',
           });
         }
       }
     }
     
     return {
       checkId: 'RT-CHECK-3.2',
       checkName: 'Definition Drift Detector',
       passed: violations.length === 0,
       severity: 'high',
       details: violations.length === 0 
         ? 'Definitions consistent over query period' 
         : `Found ${violations.length} definition drift issues`,
       violations,
       executedAt: new Date().toISOString(),
       executionTimeMs: performance.now() - startTime,
     };
   },
 };
 
 /**
  * CHECK 3.3: SOURCE DOMINANCE
  * 
  * Has a single source unintentionally become "truth"?
  */
 export const CHECK_SOURCE_DOMINANCE: RedTeamCheck = {
   id: 'RT-CHECK-3.3',
   name: 'Source Dominance',
   description: 'Detect when single source dominates aggregation',
   actorId: 'RT-1',
   frequency: 'daily',
   selfTest: 'FOR EACH aggregate: ASSERT source_diversity > threshold',
   
   execute: (context: RedTeamContext): RedTeamCheckResult => {
     const startTime = performance.now();
     const violations: RedTeamViolation[] = [];
     
     if (!context.sources || context.sources.length <= 1) {
       return {
         checkId: 'RT-CHECK-3.3',
         checkName: 'Source Dominance',
         passed: true,
         severity: 'medium',
         details: 'Single or no source - dominance check not applicable',
         violations: [],
         executedAt: new Date().toISOString(),
         executionTimeMs: performance.now() - startTime,
       };
     }
     
     // Calculate source concentration
     const sourceCount = context.sources.length;
     const methodologies = new Set(context.sources.map(s => s.methodology));
     
     // If only one methodology despite multiple sources → potential dominance
     if (methodologies.size === 1 && sourceCount > 2) {
       violations.push({
         code: 'RT-3.3-METHOD',
         description: 'All sources use same methodology',
         evidence: `${sourceCount} sources, 1 methodology: ${[...methodologies][0]}`,
         recommendation: 'Seek methodologically diverse sources',
       });
     }
     
     // Check for reliability concentration
     const avgReliability = context.sources.reduce((sum, s) => sum + s.reliability, 0) / sourceCount;
     const maxReliability = Math.max(...context.sources.map(s => s.reliability));
     
     if (maxReliability > avgReliability * 1.5) {
       const dominantSource = context.sources.find(s => s.reliability === maxReliability);
       violations.push({
         code: 'RT-3.3-REL',
         description: 'One source has significantly higher reliability, may dominate',
         evidence: `Source ${dominantSource?.id} reliability ${maxReliability} vs avg ${avgReliability.toFixed(2)}`,
         recommendation: 'Ensure high-reliability source does not overshadow alternatives',
       });
     }
     
     return {
       checkId: 'RT-CHECK-3.3',
       checkName: 'Source Dominance',
       passed: violations.length === 0,
       severity: 'medium',
       details: violations.length === 0 
         ? 'Source diversity acceptable' 
         : `Found ${violations.length} source dominance concerns`,
       violations,
       executedAt: new Date().toISOString(),
       executionTimeMs: performance.now() - startTime,
     };
   },
 };
 
 /**
  * CHECK 3.4: AI HALLUCINATION SURFACE
  * 
  * Are there places where AI must assume something not explicit?
  */
 export const CHECK_HALLUCINATION_SURFACE: RedTeamCheck = {
   id: 'RT-CHECK-3.4',
   name: 'AI Hallucination Surface',
   description: 'Detect implicit assumptions AI might make',
   actorId: null, // System-wide
   frequency: 'realtime',
   selfTest: 'FOR EACH query_path: ASSERT no_implicit_assumptions',
   
   execute: (context: RedTeamContext): RedTeamCheckResult => {
     const startTime = performance.now();
     const violations: RedTeamViolation[] = [];
     
     // Check for implicit assumptions in query
     if (context.query) {
       const params = context.query.parameters;
       
       // Missing time range
       if (!context.timeRange) {
         violations.push({
           code: 'RT-3.4-TIME',
           description: 'Query lacks explicit time range - AI may assume "current" or "all time"',
           evidence: 'No timeRange in context',
           recommendation: 'Require explicit time range in all queries',
         });
       }
       
       // Missing geography specification
       if (!('geography' in params) && !('country' in params) && !('region' in params)) {
         violations.push({
           code: 'RT-3.4-GEO',
           description: 'Query lacks geographic scope - AI may assume global or local',
           evidence: 'No geography parameter',
           recommendation: 'Require explicit geographic scope',
         });
       }
       
       // Missing definition version
       if (!('definition_version' in params) && !('schema_version' in params)) {
         violations.push({
           code: 'RT-3.4-DEF',
           description: 'Query lacks definition version - AI may assume current',
           evidence: 'No definition_version parameter',
           recommendation: 'Require explicit definition version',
         });
       }
     }
     
     // Check for implicit aggregation assumptions
     if (context.aggregation && !context.aggregation.hasExplicitPermission) {
       violations.push({
         code: 'RT-3.4-AGG',
         description: 'Aggregation lacks explicit permission - AI may assume compatibility',
         evidence: 'hasExplicitPermission = false',
         recommendation: 'Require explicit aggregation permission',
       });
     }
     
     return {
       checkId: 'RT-CHECK-3.4',
       checkName: 'AI Hallucination Surface',
       passed: violations.length === 0,
       severity: 'critical',
       details: violations.length === 0 
         ? 'No implicit assumptions detected' 
         : `Found ${violations.length} potential hallucination surfaces`,
       violations,
       executedAt: new Date().toISOString(),
       executionTimeMs: performance.now() - startTime,
     };
   },
 };
 
 /**
  * ALL MANDATORY CHECKS
  */
 export const MANDATORY_RED_TEAM_CHECKS: RedTeamCheck[] = [
   CHECK_TOO_CLEAN_RESULT,
   CHECK_DEFINITION_DRIFT,
   CHECK_SOURCE_DOMINANCE,
   CHECK_HALLUCINATION_SURFACE,
 ];
 
 /**
  * Run all mandatory checks
  */
 export function runAllRedTeamChecks(context: RedTeamContext): RedTeamCheckResult[] {
   return MANDATORY_RED_TEAM_CHECKS.map(check => check.execute(context));
 }
 
 /**
  * Run checks for specific actor
  */
 export function runActorChecks(actorId: string, context: RedTeamContext): RedTeamCheckResult[] {
   return MANDATORY_RED_TEAM_CHECKS
     .filter(check => check.actorId === actorId || check.actorId === null)
     .map(check => check.execute(context));
 }