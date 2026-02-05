 /**
  * SOURCE REVISION LAYER
  * 
  * Detects when sources change in:
  * - Credibility
  * - Methodology
  * - Incentives
  * - Stability
  * 
  * Sources are NOT static.
  */
 
 import type { RevisionEvent, RevisionEvidence, RevisionAction, SourceStabilityScore } from './revision-types';
 
 /**
  * SOURCE PROFILE
  */
 export interface SourceProfile {
   id: string;
   name: string;
   type: 'government' | 'international' | 'academic' | 'commercial' | 'ngo';
   methodology: string;
   methodologyVersion: string;
   organizationalStructure: string;
   mandate: string;
   fundingSources: string[];
   lastMajorChange?: string;
   revisionHistory: SourceRevision[];
   metrics: SourceMetrics[];
 }
 
 export interface SourceRevision {
   timestamp: string;
   type: 'methodology' | 'structure' | 'mandate' | 'merge' | 'split';
   description: string;
   impactSeverity: 'low' | 'medium' | 'high';
 }
 
 export interface SourceMetrics {
   period: string;
   publishedValues: number;
   revisionsIssued: number;
   volatilityScore: number;  // Standard deviation of revisions
   consistencyScore: number; // How consistent with historical patterns
 }
 
 /**
  * TEST SR-1: SOURCE BEHAVIOR OVER TIME
  * 
  * FOR EACH source:
  *   TRACK consistency, revision_rate, volatility
  * 
  * Create Source Stability Score.
  */
 export function calculateSourceStabilityScore(
   source: SourceProfile
 ): SourceStabilityScore {
   const metrics = source.metrics;
   if (metrics.length === 0) {
     return {
       sourceId: source.id,
       score: 50, // Unknown
       components: {
         consistency: 50,
         revisionRate: 50,
         volatility: 50,
         methodStability: 50,
         institutionalHealth: 50,
       },
       trend: 'stable',
       lastAssessed: new Date().toISOString(),
       flags: ['insufficient_history'],
     };
   }
   
   // Calculate component scores
   const avgConsistency = metrics.reduce((sum, m) => sum + m.consistencyScore, 0) / metrics.length;
   
   const totalRevisions = metrics.reduce((sum, m) => sum + m.revisionsIssued, 0);
   const totalPublished = metrics.reduce((sum, m) => sum + m.publishedValues, 0);
   const revisionRate = totalPublished > 0 ? (totalRevisions / totalPublished) * 100 : 0;
   const revisionScore = Math.max(0, 100 - revisionRate * 10); // Lower revision rate = higher score
   
   const avgVolatility = metrics.reduce((sum, m) => sum + m.volatilityScore, 0) / metrics.length;
   const volatilityScore = Math.max(0, 100 - avgVolatility);
   
   // Method stability based on revision history
   const methodChanges = source.revisionHistory.filter(r => r.type === 'methodology').length;
   const yearsOfHistory = metrics.length; // Assuming one metric per period
   const methodStability = Math.max(0, 100 - (methodChanges / Math.max(1, yearsOfHistory)) * 50);
   
   // Institutional health
   const structuralChanges = source.revisionHistory.filter(
     r => r.type === 'structure' || r.type === 'merge' || r.type === 'split'
   ).length;
   const institutionalHealth = Math.max(0, 100 - structuralChanges * 20);
   
   // Overall score
   const score = (
     avgConsistency * 0.25 +
     revisionScore * 0.2 +
     volatilityScore * 0.2 +
     methodStability * 0.2 +
     institutionalHealth * 0.15
   );
   
   // Trend calculation
   let trend: 'improving' | 'stable' | 'degrading' = 'stable';
   if (metrics.length >= 3) {
     const recent = metrics.slice(-3);
     const older = metrics.slice(0, 3);
     const recentAvg = recent.reduce((sum, m) => sum + m.consistencyScore, 0) / recent.length;
     const olderAvg = older.reduce((sum, m) => sum + m.consistencyScore, 0) / older.length;
     if (recentAvg > olderAvg + 5) trend = 'improving';
     else if (recentAvg < olderAvg - 5) trend = 'degrading';
   }
   
   // Flags
   const flags: string[] = [];
   if (avgConsistency < 70) flags.push('low_consistency');
   if (revisionRate > 20) flags.push('high_revision_rate');
   if (avgVolatility > 30) flags.push('high_volatility');
   if (methodChanges > 2) flags.push('frequent_method_changes');
   if (structuralChanges > 0) flags.push('structural_changes');
   
   return {
     sourceId: source.id,
     score: Math.round(score),
     components: {
       consistency: Math.round(avgConsistency),
       revisionRate: Math.round(revisionScore),
       volatility: Math.round(volatilityScore),
       methodStability: Math.round(methodStability),
       institutionalHealth: Math.round(institutionalHealth),
     },
     trend,
     lastAssessed: new Date().toISOString(),
     flags,
   };
 }
 
 /**
  * DETECT SOURCE BEHAVIOR CHANGE
  */
 export function detectSourceBehaviorChange(
   previousScore: SourceStabilityScore,
   currentScore: SourceStabilityScore
 ): RevisionEvent | null {
   const scoreDelta = currentScore.score - previousScore.score;
   
   // Significant degradation
   if (scoreDelta < -10) {
     return createSourceRevisionEvent({
       type: 'source_behavior_change',
       severity: scoreDelta < -20 ? 'critical' : 'warning',
       entityId: currentScore.sourceId,
       description: `Source stability degraded by ${Math.abs(scoreDelta)} points`,
       evidence: {
         before: previousScore,
         after: currentScore,
         delta: scoreDelta,
       },
       action: { required: 'flag_review', automatic: false, executed: false },
     });
   }
   
   return null;
 }
 
 /**
  * TEST SR-2: INSTITUTIONAL CHANGE
  * 
  * IF source_reorganizes OR merges OR changes mandate:
  *   REQUIRE source_version_increment
  */
 export function detectInstitutionalChange(
   source: SourceProfile
 ): RevisionEvent | null {
   const recentChanges = source.revisionHistory.filter(r => {
     const changeDate = new Date(r.timestamp);
     const oneYearAgo = new Date();
     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
     return changeDate > oneYearAgo;
   });
   
   const significantChanges = recentChanges.filter(
     r => r.type === 'structure' || r.type === 'merge' || r.type === 'split' || r.type === 'mandate'
   );
   
   if (significantChanges.length === 0) return null;
   
   const highImpact = significantChanges.filter(c => c.impactSeverity === 'high');
   
   return createSourceRevisionEvent({
     type: 'institutional_change',
     severity: highImpact.length > 0 ? 'critical' : 'warning',
     entityId: source.id,
     description: `Institutional change detected: ${significantChanges.map(c => c.type).join(', ')}`,
     evidence: {
       before: source.mandate,
       after: significantChanges,
     },
     action: { required: 'new_version', automatic: false, executed: false },
   });
 }
 
 /**
  * TEST SR-3: SINGLE SOURCE FRAGILITY
  * 
  * IF metric RELIES_ON single_source FOR extended_time:
  *   FLAG fragility
  */
 export interface MetricSourceDependency {
   metricId: string;
   sources: {
     sourceId: string;
     contribution: number; // 0-100%
     since: string;
   }[];
 }
 
 export function detectSingleSourceFragility(
   dependency: MetricSourceDependency,
   fragilityThreshold: number = 80, // % from single source
   extendedTimeMonths: number = 24
 ): RevisionEvent | null {
   // Find dominant sources
   const dominantSources = dependency.sources.filter(s => s.contribution >= fragilityThreshold);
   
   if (dominantSources.length === 0) return null;
   
   for (const source of dominantSources) {
     const sinceDate = new Date(source.since);
     const monthsAgo = (Date.now() - sinceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
     
     if (monthsAgo >= extendedTimeMonths) {
       return createSourceRevisionEvent({
         type: 'single_source_fragility',
         severity: source.contribution >= 95 ? 'critical' : 'warning',
         entityId: dependency.metricId,
         description: `Single source fragility: ${source.sourceId} provides ${source.contribution}% of data for ${Math.round(monthsAgo)} months`,
         evidence: {
           before: null,
           after: {
             sourceId: source.sourceId,
             contribution: source.contribution,
             durationMonths: Math.round(monthsAgo),
           },
           relatedEntities: [source.sourceId],
         },
         action: { required: 'flag_review', automatic: false, executed: false },
       });
     }
   }
   
   return null;
 }
 
 /**
  * Helper to create source revision events
  */
 function createSourceRevisionEvent(params: {
   type: 'source_behavior_change' | 'institutional_change' | 'single_source_fragility';
   severity: 'info' | 'warning' | 'critical';
   entityId: string;
   description: string;
   evidence: RevisionEvidence;
   action: RevisionAction;
 }): RevisionEvent {
   return {
     id: `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
     layer: 'source',
     type: params.type,
     severity: params.severity,
     detectedAt: new Date().toISOString(),
     entityId: params.entityId,
     entityType: 'source',
     description: params.description,
     evidence: params.evidence,
     action: params.action,
     resolved: false,
   };
 }
 
 /**
  * RUN ALL SOURCE REVISION TESTS
  */
 export function runSourceRevisionTests(
   source: SourceProfile,
   previousStabilityScore?: SourceStabilityScore,
   dependencies: MetricSourceDependency[] = []
 ): RevisionEvent[] {
   const events: RevisionEvent[] = [];
   
   // SR-1: Source behavior (stability score)
   const currentScore = calculateSourceStabilityScore(source);
   if (previousStabilityScore) {
     const behaviorChange = detectSourceBehaviorChange(previousStabilityScore, currentScore);
     if (behaviorChange) events.push(behaviorChange);
   }
   
   // SR-2: Institutional change
   const institutionalChange = detectInstitutionalChange(source);
   if (institutionalChange) events.push(institutionalChange);
   
   // SR-3: Single source fragility
   for (const dep of dependencies) {
     const fragility = detectSingleSourceFragility(dep);
     if (fragility) events.push(fragility);
   }
   
   return events;
 }