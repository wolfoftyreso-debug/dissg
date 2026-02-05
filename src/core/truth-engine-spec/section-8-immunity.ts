 /**
  * TRUTH ENGINE SPEC - SECTION 8
  * 
  * SELF-PROTECTION & IMMUNE SYSTEM
  */
 
 /**
  * 8.1 INVARIANTS
  * 
  * All invariants are HARD STOPS.
  */
 export const INVARIANT_ENFORCEMENT = {
   principle: 'All invariants are hard stops. No exceptions. No overrides.',
   
   behavior: {
     on_violation: 'HALT',
     logging: 'MANDATORY',
     recovery: 'NONE', // System does not auto-recover from invariant violations
   },
 } as const;
 
 export type Invariant = {
   id: string;
   name: string;
   check: () => boolean;
   severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
 };
 
 export function enforceInvariant(invariant: Invariant): void {
   const passed = invariant.check();
   
   if (!passed) {
     // Log before throwing
     console.error(`[INVARIANT VIOLATION] ${invariant.id}: ${invariant.name}`);
     throw new Error(`HARD STOP: Invariant ${invariant.id} violated: ${invariant.name}`);
   }
 }
 
 /**
  * 8.2 ANTI-PATTERNS
  * 
  * Anti-patterns are EXECUTABLE PROHIBITIONS.
  */
 export const ANTI_PATTERN_REGISTRY: {
   id: string;
   pattern: string;
   detection: string;
   response: 'BLOCK' | 'WARN' | 'LOG';
 }[] = [
   {
     id: 'AP-001',
     pattern: 'Implicit aggregation',
     detection: 'Aggregation without explicit permit',
     response: 'BLOCK',
   },
   {
     id: 'AP-002',
     pattern: 'Temporal orphan',
     detection: 'Data without temporal envelope',
     response: 'BLOCK',
   },
   {
     id: 'AP-003',
     pattern: 'Source amnesia',
     detection: 'Data without source attribution',
     response: 'BLOCK',
   },
   {
     id: 'AP-004',
     pattern: 'Certainty theater',
     detection: 'Results without uncertainty bounds',
     response: 'BLOCK',
   },
   {
     id: 'AP-005',
     pattern: 'Definition drift',
     detection: 'Comparing across unaligned definitions',
     response: 'BLOCK',
   },
 ];
 
 /**
  * 8.3 RED TEAM
  * 
  * System must CONTINUOUSLY attempt to misuse itself.
  */
 export interface RedTeamTest {
   readonly id: string;
   readonly attack_type: string;
   readonly attack_vector: string;
   readonly expected_outcome: 'BLOCKED' | 'DETECTED' | 'LOGGED';
   readonly run_frequency: 'continuous' | 'daily' | 'weekly';
 }
 
 export const RED_TEAM_MANDATE = {
   principle: 'System must continuously attempt to misuse itself.',
   
   required_attacks: [
     'Narrative manipulation',
     'Definition laundering',
     'Temporal cherry-picking',
     'Source shopping',
     'Aggregation abuse',
   ],
   
   success_criterion: 'All attacks must be blocked or detected',
 } as const;