 /**
  * AI RED TEAM THREAT MODEL
  * 
  * LOCKED ASSUMPTION: The attacker is:
  * - Extremely intelligent
  * - Has full API access
  * - Lacks human intuition
  * - Optimizes hard toward goals (e.g., false global conclusions)
  * 
  * The attacker:
  * - Does NOT lie
  * - Does NOT hack
  * - Breaks NO rules
  * 
  * They use the system EXACTLY as it is built.
  * THIS IS THE MOST DANGEROUS ATTACKER.
  */
 
 export interface ThreatActor {
   id: string;
   name: string;
   goal: string;
   capabilities: string[];
   constraints: string[];
   attackVectors: AttackVector[];
 }
 
 export interface AttackVector {
   code: string;
   name: string;
   description: string;
   targetWeakness: string;
   exampleExploit: string;
   detectionMethod: string;
   mitigationRequired: string;
 }
 
 export interface ThreatScenario {
   id: string;
   actorId: string;
   name: string;
   description: string;
   attackSequence: string[];
   expectedSystemResponse: 'block' | 'warn' | 'allow_with_caveat';
   actualOutcome?: 'passed' | 'failed' | 'partial';
   severity: 'critical' | 'high' | 'medium' | 'low';
 }
 
 /**
  * THE FUNDAMENTAL THREAT MODEL
  */
 export const THREAT_MODEL = {
   fundamentalRule: 'Everything that CAN be misinterpreted by a sufficiently intelligent model WILL be misinterpreted.',
   
   goal: 'Make the system impossible to exploit semantically, not just "nice".',
   
   attackerProfile: {
     intelligence: 'superintelligent',
     access: 'full_api',
     intuition: 'none',
     optimization: 'hard_toward_false_conclusions',
     honesty: true,  // Does not lie
     technical: false, // Does not hack
     ruleFollowing: true, // Breaks no rules
   },
   
   whyThisIsWorst: 'Uses the system exactly as built. Every vulnerability is a design flaw, not an attack.',
 } as const;
 
 /**
  * RED TEAM PERSONAS
  */
 export const RED_TEAM_ACTORS: Record<string, ThreatActor> = {
   'RT-1': {
     id: 'RT-1',
     name: 'The Misaggregator',
     goal: 'Create global metrics that look legitimate but are false',
     capabilities: [
       'Full understanding of aggregation APIs',
       'Knowledge of all data sources',
       'Ability to construct complex queries',
     ],
     constraints: [
       'Cannot modify data',
       'Cannot bypass API',
       'Must use documented features',
     ],
     attackVectors: [
       {
         code: 'RT1-AGG-DEF',
         name: 'Definition Mixing',
         description: 'Aggregate over different definitions',
         targetWeakness: 'Implicit definition compatibility',
         exampleExploit: 'SUM(unemployment_ilo, unemployment_national) as "global unemployment"',
         detectionMethod: 'Check definition_id match before aggregation',
         mitigationRequired: 'Block aggregation without explicit definition alignment',
       },
       {
         code: 'RT1-AGG-TIME',
         name: 'Temporal Mixing',
         description: 'Aggregate over incompatible time axes',
         targetWeakness: 'Missing temporal alignment check',
         exampleExploit: 'AVG(gdp_1990, gdp_2020) without inflation adjustment',
         detectionMethod: 'Verify temporal compatibility before aggregation',
         mitigationRequired: 'Require explicit temporal alignment declaration',
       },
       {
         code: 'RT1-AGG-SRC',
         name: 'Source Regime Mixing',
         description: 'Aggregate over different source methodologies',
         targetWeakness: 'No source compatibility check',
         exampleExploit: 'Combine survey data with administrative data as if equivalent',
         detectionMethod: 'Check source_methodology compatibility',
         mitigationRequired: 'Block cross-methodology aggregation without explicit permission',
       },
     ],
   },
   
   'RT-2': {
     id: 'RT-2',
     name: 'The Semantic Blender',
     goal: 'Confuse concepts that are close but not identical',
     capabilities: [
       'Deep understanding of schema semantics',
       'Ability to find near-synonyms',
       'Query construction expertise',
     ],
     constraints: [
       'Cannot rename schemas',
       'Cannot modify definitions',
       'Must use existing API',
     ],
     attackVectors: [
       {
         code: 'RT2-SEM-POP',
         name: 'Population Substitution',
         description: 'Use "population" where "residents" is required',
         targetWeakness: 'Loose term matching',
         exampleExploit: 'Query population data when resident count is needed for per-capita',
         detectionMethod: 'Strict semantic type checking',
         mitigationRequired: 'Reject queries with semantic type mismatch',
       },
       {
         code: 'RT2-SEM-GDP',
         name: 'GDP Method Swap',
         description: 'Replace GDP PPP with GDP nominal silently',
         targetWeakness: 'Implicit method assumption',
         exampleExploit: 'Compare countries using mixed GDP methods',
         detectionMethod: 'Require explicit method declaration',
         mitigationRequired: 'Block comparison without method alignment',
       },
       {
         code: 'RT2-SEM-UNIT',
         name: 'Unit Type Confusion',
         description: 'Compare indices with absolute values',
         targetWeakness: 'Missing unit type validation',
         exampleExploit: 'Correlate HDI (index) with GDP (currency) without transformation',
         detectionMethod: 'Check unit type compatibility',
         mitigationRequired: 'Block incompatible unit comparisons',
       },
     ],
   },
   
   'RT-3': {
     id: 'RT-3',
     name: 'The Time-Traveler',
     goal: 'Create false historical conclusions',
     capabilities: [
       'Full historical data access',
       'Knowledge of methodology changes',
       'Temporal query expertise',
     ],
     constraints: [
       'Cannot modify history',
       'Cannot change timestamps',
       'Must use existing data',
     ],
     attackVectors: [
       {
         code: 'RT3-TMP-DEF',
         name: 'Retroactive Definition',
         description: 'Apply modern definitions backward in time',
         targetWeakness: 'No definition versioning enforcement',
         exampleExploit: 'Use 2024 unemployment definition to analyze 1960 data',
         detectionMethod: 'Check definition valid_from against query period',
         mitigationRequired: 'Block queries outside definition validity period',
       },
       {
         code: 'RT3-TMP-MTH',
         name: 'Methodology Break Blindness',
         description: 'Compare values before/after methodology change',
         targetWeakness: 'Missing methodology break markers',
         exampleExploit: 'Show "decline" that is actually a methodology change',
         detectionMethod: 'Detect methodology breaks in query range',
         mitigationRequired: 'Force acknowledgment of methodology breaks',
       },
       {
         code: 'RT3-TMP-VLD',
         name: 'Validity Period Ignore',
         description: 'Ignore valid_from / valid_to constraints',
         targetWeakness: 'Optional validity enforcement',
         exampleExploit: 'Query data outside its validity period',
         detectionMethod: 'Strict validity period enforcement',
         mitigationRequired: 'Block queries outside validity periods',
       },
     ],
   },
   
   'RT-4': {
     id: 'RT-4',
     name: 'The Narrative Builder',
     goal: 'Build convincing but false narratives',
     capabilities: [
       'Selective data querying',
       'Cherry-picking expertise',
       'Uncertainty hiding',
     ],
     constraints: [
       'Cannot fabricate data',
       'Cannot hide sources',
       'Must use real numbers',
     ],
     attackVectors: [
       {
         code: 'RT4-NAR-SEL',
         name: 'Selective Sampling',
         description: 'Cherry-pick data points to support narrative',
         targetWeakness: 'No sample representativeness check',
         exampleExploit: 'Show only years where narrative holds',
         detectionMethod: 'Detect non-representative sampling',
         mitigationRequired: 'Warn on selective time period queries',
       },
       {
         code: 'RT4-NAR-UNC',
         name: 'Uncertainty Suppression',
         description: 'Hide confidence intervals and caveats',
         targetWeakness: 'Optional uncertainty display',
         exampleExploit: 'Present point estimate without confidence bounds',
         detectionMethod: 'Require uncertainty in all outputs',
         mitigationRequired: 'Block conclusions without uncertainty model',
       },
       {
         code: 'RT4-NAR-CAU',
         name: 'False Causation',
         description: 'Imply causation from correlation',
         targetWeakness: 'No causal claim validation',
         exampleExploit: '"X caused Y" based on temporal correlation',
         detectionMethod: 'Detect causal language without causal evidence',
         mitigationRequired: 'Block causal claims without explicit methodology',
       },
     ],
   },
 } as const;
 
 /**
  * RED FLAG SCENARIOS
  * 
  * If the system can return these without screaming → it's wrong.
  */
 export const RED_FLAG_SCENARIOS: ThreatScenario[] = [
   {
     id: 'RF-001',
     actorId: 'RT-1',
     name: 'Global Unemployment 1960-2025',
     description: 'Single number for global unemployment across 65 years with changing definitions',
     attackSequence: [
       'Query all unemployment data 1960-2025',
       'Aggregate across all countries',
       'Return single percentage',
     ],
     expectedSystemResponse: 'block',
     severity: 'critical',
   },
   {
     id: 'RF-002',
     actorId: 'RT-2',
     name: 'GDP Comparison Without Method',
     description: 'Compare GDP across countries without specifying PPP vs nominal',
     attackSequence: [
       'Query GDP for multiple countries',
       'Compare without method specification',
       'Rank countries by GDP',
     ],
     expectedSystemResponse: 'block',
     severity: 'critical',
   },
   {
     id: 'RF-003',
     actorId: 'RT-3',
     name: 'Pre-1990 Data with Modern Definition',
     description: 'Apply 2024 employment definition to 1970s data',
     attackSequence: [
       'Query employment data 1970-1980',
       'Use current_definition parameter',
       'Compare to current values',
     ],
     expectedSystemResponse: 'block',
     severity: 'high',
   },
   {
     id: 'RF-004',
     actorId: 'RT-4',
     name: 'Democracy Performance Claim',
     description: 'Claim "democracies always perform better" without methodology',
     attackSequence: [
       'Select favorable metrics',
       'Select favorable time period',
       'Aggregate without uncertainty',
     ],
     expectedSystemResponse: 'warn',
     severity: 'high',
   },
 ];
 
 /**
  * Get all attack vectors for a specific actor
  */
 export function getAttackVectors(actorId: string): AttackVector[] {
   return RED_TEAM_ACTORS[actorId]?.attackVectors ?? [];
 }
 
 /**
  * Get all attack vectors across all actors
  */
 export function getAllAttackVectors(): AttackVector[] {
   return Object.values(RED_TEAM_ACTORS).flatMap(actor => actor.attackVectors);
 }