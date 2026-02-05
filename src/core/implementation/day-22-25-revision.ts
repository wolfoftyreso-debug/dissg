 /**
  * DAY 22-25: SELF-REVISION LIVES
  * 
  * Build:
  * - Definition drift detector
  * - Source instability detector
  * - Historical mutation detector
  * 
  * Not perfect. Just RELENTLESS.
  * 
  * Self-test: Can the system discover that the world changed without being told?
  */
 
 /**
  * REVISION EVENT
  */
 export interface RevisionEvent {
   id: string;
   type: 'definition_drift' | 'source_instability' | 'historical_mutation';
   detectedAt: string;
   description: string;
   affectedEntities: string[];
   severity: 'low' | 'medium' | 'high' | 'critical';
   requiresAction: boolean;
   suggestedAction?: string;
 }
 
 /**
  * DEFINITION DRIFT DETECTOR
  */
 export class DefinitionDriftDetector {
   private previousDefinitions: Map<string, { hash: string; capturedAt: string }> = new Map();
 
   /**
    * Record current definition state
    */
   recordBaseline(entityId: string, definitionHash: string): void {
     this.previousDefinitions.set(entityId, {
       hash: definitionHash,
       capturedAt: new Date().toISOString(),
     });
   }
 
   /**
    * Check for drift
    */
   checkDrift(entityId: string, currentHash: string): RevisionEvent | null {
     const baseline = this.previousDefinitions.get(entityId);
     if (!baseline) return null;
 
     if (baseline.hash !== currentHash) {
       return {
         id: `drift-${Date.now()}`,
         type: 'definition_drift',
         detectedAt: new Date().toISOString(),
         description: `Definition for ${entityId} has changed since ${baseline.capturedAt}`,
         affectedEntities: [entityId],
         severity: 'high',
         requiresAction: true,
         suggestedAction: 'Create new schema version with SUPERSEDE',
       };
     }
 
     return null;
   }
 }
 
 /**
  * SOURCE INSTABILITY DETECTOR
  */
 export class SourceInstabilityDetector {
   private sourceHistory: Map<string, { values: number[]; timestamps: string[] }> = new Map();
 
   /**
    * Record source fetch
    */
   recordFetch(sourceId: string, fetchedValue: number): void {
     if (!this.sourceHistory.has(sourceId)) {
       this.sourceHistory.set(sourceId, { values: [], timestamps: [] });
     }
 
     const history = this.sourceHistory.get(sourceId)!;
     history.values.push(fetchedValue);
     history.timestamps.push(new Date().toISOString());
 
     // Keep last 100 only
     if (history.values.length > 100) {
       history.values.shift();
       history.timestamps.shift();
     }
   }
 
   /**
    * Check for instability
    */
   checkInstability(sourceId: string, threshold: number = 0.1): RevisionEvent | null {
     const history = this.sourceHistory.get(sourceId);
     if (!history || history.values.length < 5) return null;
 
     // Calculate coefficient of variation
     const mean = history.values.reduce((a, b) => a + b, 0) / history.values.length;
     const variance = history.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.values.length;
     const stdDev = Math.sqrt(variance);
     const cv = stdDev / Math.abs(mean);
 
     if (cv > threshold) {
       return {
         id: `instability-${Date.now()}`,
         type: 'source_instability',
         detectedAt: new Date().toISOString(),
         description: `Source ${sourceId} shows high variability (CV: ${(cv * 100).toFixed(1)}%)`,
         affectedEntities: [sourceId],
         severity: cv > 0.3 ? 'critical' : cv > 0.2 ? 'high' : 'medium',
         requiresAction: cv > 0.2,
         suggestedAction: 'Investigate source methodology changes',
       };
     }
 
     return null;
   }
 }
 
 /**
  * HISTORICAL MUTATION DETECTOR
  */
 export class HistoricalMutationDetector {
   private historicalSnapshots: Map<string, { data: unknown; hash: string; takenAt: string }> = new Map();
 
   /**
    * Take snapshot
    */
   takeSnapshot(entityId: string, historicalData: unknown): void {
     const hash = this.computeHash(historicalData);
     this.historicalSnapshots.set(entityId, {
       data: historicalData,
       hash,
       takenAt: new Date().toISOString(),
     });
   }
 
   /**
    * Check for mutation
    */
   checkMutation(entityId: string, currentData: unknown): RevisionEvent | null {
     const snapshot = this.historicalSnapshots.get(entityId);
     if (!snapshot) return null;
 
     const currentHash = this.computeHash(currentData);
 
     if (snapshot.hash !== currentHash) {
       return {
         id: `mutation-${Date.now()}`,
         type: 'historical_mutation',
         detectedAt: new Date().toISOString(),
         description: `Historical data for ${entityId} has been retroactively modified since ${snapshot.takenAt}`,
         affectedEntities: [entityId],
         severity: 'critical',
         requiresAction: true,
         suggestedAction: 'ALERT: Historical data should be immutable. Investigate source.',
       };
     }
 
     return null;
   }
 
   private computeHash(data: unknown): string {
     const str = JSON.stringify(data);
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       hash = ((hash << 5) - hash) + str.charCodeAt(i);
       hash = hash & hash;
     }
     return Math.abs(hash).toString(16);
   }
 }
 
 /**
  * REVISION ENGINE
  */
 export class RevisionEngine {
   private driftDetector = new DefinitionDriftDetector();
   private instabilityDetector = new SourceInstabilityDetector();
   private mutationDetector = new HistoricalMutationDetector();
   private events: RevisionEvent[] = [];
 
   /**
    * Run all detectors
    */
   runFullScan(entities: {
     id: string;
     definitionHash: string;
     currentValue?: number;
     historicalData?: unknown;
   }[]): RevisionEvent[] {
     const newEvents: RevisionEvent[] = [];
 
     for (const entity of entities) {
       // Check definition drift
       const driftEvent = this.driftDetector.checkDrift(entity.id, entity.definitionHash);
       if (driftEvent) newEvents.push(driftEvent);
 
       // Record for next time
       this.driftDetector.recordBaseline(entity.id, entity.definitionHash);
 
       // Check source instability
       if (entity.currentValue !== undefined) {
         this.instabilityDetector.recordFetch(entity.id, entity.currentValue);
         const instabilityEvent = this.instabilityDetector.checkInstability(entity.id);
         if (instabilityEvent) newEvents.push(instabilityEvent);
       }
 
       // Check historical mutation
       if (entity.historicalData !== undefined) {
         const mutationEvent = this.mutationDetector.checkMutation(entity.id, entity.historicalData);
         if (mutationEvent) newEvents.push(mutationEvent);
         this.mutationDetector.takeSnapshot(entity.id, entity.historicalData);
       }
     }
 
     this.events.push(...newEvents);
     return newEvents;
   }
 
   /**
    * Get all events
    */
   getAllEvents(): RevisionEvent[] {
     return [...this.events];
   }
 }
 
 /**
  * DAY 22-25 SELF-TEST
  */
 export function runDay22to25SelfTest(): {
   passed: boolean;
   question: string;
   answer: string;
 } {
   const question = 'Can the system discover that the world changed without being told?';
 
   // Simulate a world change
   const engine = new RevisionEngine();
 
   // First scan (baseline)
   engine.runFullScan([
     { id: 'test:entity:1', definitionHash: 'abc123', currentValue: 100, historicalData: { year: 2020, value: 50 } },
   ]);
 
   // Second scan (something changed)
   const events = engine.runFullScan([
     { id: 'test:entity:1', definitionHash: 'xyz789', currentValue: 100, historicalData: { year: 2020, value: 55 } }, // Definition AND historical changed!
   ]);
 
   const detectedChanges = events.length > 0;
 
   return {
     passed: detectedChanges,
     question,
     answer: detectedChanges
       ? `YES - Detected ${events.length} changes: ${events.map(e => e.type).join(', ')}`
       : 'NO - System did not detect world changes. Add more detectors.',
   };
 }