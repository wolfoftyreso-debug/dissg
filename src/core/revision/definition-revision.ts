 /**
  * DEFINITION REVISION LAYER
  * 
  * Detects when concepts mean something different than before.
  * Semantic drift is EXTREMELY dangerous.
  */
 
 import type { RevisionEvent, RevisionEvidence, RevisionAction } from './revision-types';
 
 /**
  * SCHEMA VERSION
  */
 export interface SchemaVersion {
   id: string;
   version: number;
   definitionText: string;
   definitionHash: string;
   validFrom: string;
   validTo?: string;
   footnotes: string[];
   exceptions: string[];
   inclusions: string[];
   exclusions: string[];
 }
 
 /**
  * SEMANTIC DIFFERENCE RESULT
  */
 export interface SemanticDifference {
   overallScore: number;  // 0-100, higher = more different
   textSimilarity: number;
   footnotesChanged: boolean;
   exceptionsChanged: boolean;
   scopeChanged: 'narrowed' | 'widened' | 'unchanged';
   details: string[];
 }
 
 /**
  * TEST DEF-1: DEFINITION DRIFT DETECTOR
  * 
  * FOR EACH schema_version:
  *   COMPARE definition_text OVER TIME
  *   IF semantic_difference > threshold:
  *     REQUIRE new_schema_id
  */
 export function detectDefinitionDrift(
   versions: SchemaVersion[],
   threshold: number = 30
 ): RevisionEvent | null {
   if (versions.length < 2) return null;
   
   // Sort by version
   const sorted = [...versions].sort((a, b) => a.version - b.version);
   
   for (let i = 1; i < sorted.length; i++) {
     const prev = sorted[i - 1];
     const curr = sorted[i];
     
     const diff = calculateSemanticDifference(prev, curr);
     
     if (diff.overallScore > threshold) {
       return createDefinitionRevisionEvent({
         type: 'definition_drift',
         severity: diff.overallScore > 60 ? 'critical' : 'warning',
         entityId: curr.id,
         description: `Definition drift detected between v${prev.version} and v${curr.version}: ${diff.overallScore}% semantic change`,
         evidence: {
           before: {
             version: prev.version,
             definition: prev.definitionText.substring(0, 200),
           },
           after: {
             version: curr.version,
             definition: curr.definitionText.substring(0, 200),
           },
           delta: diff.overallScore,
           threshold,
         },
         action: { 
           required: diff.overallScore > 60 ? 'new_version' : 'flag_review', 
           automatic: false, 
           executed: false 
         },
       });
     }
   }
   
   return null;
 }
 
 /**
  * TEST DEF-2: CONTEXT EXPANSION
  * 
  * IF new_exceptions OR footnotes appear:
  *   FLAG semantic_widening
  * 
  * Semantics that "widen" are EXTREMELY dangerous.
  */
 export function detectContextExpansion(
   prevVersion: SchemaVersion,
   currVersion: SchemaVersion
 ): RevisionEvent | null {
   const newFootnotes = currVersion.footnotes.filter(f => !prevVersion.footnotes.includes(f));
   const newExceptions = currVersion.exceptions.filter(e => !prevVersion.exceptions.includes(e));
   const newInclusions = currVersion.inclusions.filter(i => !prevVersion.inclusions.includes(i));
   
   const hasExpansion = newFootnotes.length > 0 || newExceptions.length > 0 || newInclusions.length > 0;
   
   if (!hasExpansion) return null;
   
   const expansionDetails: string[] = [];
   if (newFootnotes.length > 0) expansionDetails.push(`${newFootnotes.length} new footnotes`);
   if (newExceptions.length > 0) expansionDetails.push(`${newExceptions.length} new exceptions`);
   if (newInclusions.length > 0) expansionDetails.push(`${newInclusions.length} new inclusions`);
   
   return createDefinitionRevisionEvent({
     type: 'context_expansion',
     severity: 'warning',
     entityId: currVersion.id,
     description: `Semantic widening detected: ${expansionDetails.join(', ')}. Review for potential meaning shift.`,
     evidence: {
       before: {
         footnotes: prevVersion.footnotes.length,
         exceptions: prevVersion.exceptions.length,
         inclusions: prevVersion.inclusions.length,
       },
       after: {
         footnotes: currVersion.footnotes.length,
         exceptions: currVersion.exceptions.length,
         inclusions: currVersion.inclusions.length,
         newFootnotes,
         newExceptions,
         newInclusions,
       },
     },
     action: { required: 'flag_review', automatic: false, executed: false },
   });
 }
 
 /**
  * DETECT SEMANTIC NARROWING
  */
 export function detectSemanticNarrowing(
   prevVersion: SchemaVersion,
   currVersion: SchemaVersion
 ): RevisionEvent | null {
   const removedInclusions = prevVersion.inclusions.filter(i => !currVersion.inclusions.includes(i));
   const newExclusions = currVersion.exclusions.filter(e => !prevVersion.exclusions.includes(e));
   
   const hasNarrowing = removedInclusions.length > 0 || newExclusions.length > 0;
   
   if (!hasNarrowing) return null;
   
   return createDefinitionRevisionEvent({
     type: 'semantic_narrowing',
     severity: 'warning',
     entityId: currVersion.id,
     description: `Semantic narrowing detected: scope has been reduced`,
     evidence: {
       before: {
         inclusions: prevVersion.inclusions,
         exclusions: prevVersion.exclusions,
       },
       after: {
         inclusions: currVersion.inclusions,
         exclusions: currVersion.exclusions,
         removedInclusions,
         newExclusions,
       },
     },
     action: { required: 'flag_review', automatic: false, executed: false },
   });
 }
 
 /**
  * CALCULATE SEMANTIC DIFFERENCE
  */
 function calculateSemanticDifference(
   v1: SchemaVersion,
   v2: SchemaVersion
 ): SemanticDifference {
   // Text similarity (simple Jaccard-like)
   const words1 = new Set(v1.definitionText.toLowerCase().split(/\s+/));
   const words2 = new Set(v2.definitionText.toLowerCase().split(/\s+/));
   const intersection = new Set([...words1].filter(w => words2.has(w)));
   const union = new Set([...words1, ...words2]);
   const textSimilarity = (intersection.size / union.size) * 100;
   
   // Check changes
   const footnotesChanged = 
     v1.footnotes.length !== v2.footnotes.length ||
     !v1.footnotes.every(f => v2.footnotes.includes(f));
   
   const exceptionsChanged =
     v1.exceptions.length !== v2.exceptions.length ||
     !v1.exceptions.every(e => v2.exceptions.includes(e));
   
   // Scope change
   const newInclusions = v2.inclusions.filter(i => !v1.inclusions.includes(i)).length;
   const removedInclusions = v1.inclusions.filter(i => !v2.inclusions.includes(i)).length;
   const newExclusions = v2.exclusions.filter(e => !v1.exclusions.includes(e)).length;
   
   let scopeChanged: 'narrowed' | 'widened' | 'unchanged' = 'unchanged';
   if (newInclusions > removedInclusions && newExclusions === 0) {
     scopeChanged = 'widened';
   } else if (removedInclusions > newInclusions || newExclusions > 0) {
     scopeChanged = 'narrowed';
   }
   
   // Calculate overall score
   const details: string[] = [];
   let overallScore = 100 - textSimilarity; // Start with text difference
   
   if (footnotesChanged) {
     overallScore += 10;
     details.push('Footnotes changed');
   }
   if (exceptionsChanged) {
     overallScore += 15;
     details.push('Exceptions changed');
   }
   if (scopeChanged !== 'unchanged') {
     overallScore += 20;
     details.push(`Scope ${scopeChanged}`);
   }
   
   return {
     overallScore: Math.min(100, overallScore),
     textSimilarity,
     footnotesChanged,
     exceptionsChanged,
     scopeChanged,
     details,
   };
 }
 
 /**
  * Helper to create definition revision events
  */
 function createDefinitionRevisionEvent(params: {
   type: 'definition_drift' | 'context_expansion' | 'semantic_narrowing';
   severity: 'info' | 'warning' | 'critical';
   entityId: string;
   description: string;
   evidence: RevisionEvidence;
   action: RevisionAction;
 }): RevisionEvent {
   return {
     id: `DEF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
     layer: 'definition',
     type: params.type,
     severity: params.severity,
     detectedAt: new Date().toISOString(),
     entityId: params.entityId,
     entityType: 'schema',
     description: params.description,
     evidence: params.evidence,
     action: params.action,
     resolved: false,
   };
 }
 
 /**
  * RUN ALL DEFINITION REVISION TESTS
  */
 export function runDefinitionRevisionTests(
   versions: SchemaVersion[],
   driftThreshold: number = 30
 ): RevisionEvent[] {
   const events: RevisionEvent[] = [];
   
   if (versions.length < 2) return events;
   
   // DEF-1: Definition drift
   const drift = detectDefinitionDrift(versions, driftThreshold);
   if (drift) events.push(drift);
   
   // Sort versions
   const sorted = [...versions].sort((a, b) => a.version - b.version);
   
   // Compare adjacent versions for expansion/narrowing
   for (let i = 1; i < sorted.length; i++) {
     const prev = sorted[i - 1];
     const curr = sorted[i];
     
     // DEF-2: Context expansion
     const expansion = detectContextExpansion(prev, curr);
     if (expansion) events.push(expansion);
     
     // Additional: Semantic narrowing
     const narrowing = detectSemanticNarrowing(prev, curr);
     if (narrowing) events.push(narrowing);
   }
   
   return events;
 }