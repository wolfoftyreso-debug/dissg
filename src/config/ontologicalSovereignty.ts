 /**
  * ONTOLOGICAL SOVEREIGNTY FRAMEWORK
  * 
  * Defines who owns concept definitions, how contradictions are handled,
  * and the system's epistemic authority model.
  * 
  * This is the "constitutional layer" of the data system.
  */
 
 // =============================================================================
 // CORE PRINCIPLES
 // =============================================================================
 
 export const ONTOLOGICAL_AXIOMS = {
   /**
    * AXIOM 1: No Data Without Schema
    * All data must map to a defined object with versioned semantics.
    */
   NO_DATA_WITHOUT_SCHEMA: {
     id: 'ONT-AX-001',
     principle: 'Ingen datapost utan schema',
     enforcement: 'TECHNICAL_BLOCK',
     description: 'All data måste mappa mot ett definierat objekt med versionshanterad semantik',
     validation: [
       'Har definierat schema-ID',
       'Schema-version är aktiv',
       'Alla obligatoriska fält har värden',
       'Värden är valida enligt schema-constraints',
     ],
     consequence: 'Data som inte passar schema får ALDRIG in i systemet',
   },
   
   /**
    * AXIOM 2: No Semantic Drift
    * Concepts never change meaning; new meanings = new types.
    */
   NO_SEMANTIC_DRIFT: {
     id: 'ONT-AX-002',
     principle: 'Ingen semantisk glidning',
     enforcement: 'VERSIONING_MANDATORY',
     description: 'Samma begrepp får aldrig byta betydelse eller överlagras',
     rules: [
       'Nya betydelser → nya typer, noder och relationer',
       'Gamla versioner förblir immutabla',
       'Semantisk förändring kräver ny entitet med explicit länk',
       'Deprecation markeras, aldrig deletion',
     ],
     consequence: 'Semantisk integritet bevaras över tid',
   },
   
   /**
    * AXIOM 3: No Human Shortcuts
    * Admin UI cannot bypass validation or create exceptions.
    */
   NO_HUMAN_SHORTCUTS: {
     id: 'ONT-AX-003',
     principle: 'Ingen mänsklig genväg',
     enforcement: 'UI_CONSTRAINT',
     description: 'Admin-UI kan aldrig kringgå systemets validering',
     forbidden: [
       'Fixa lite snabbt',
       'Lägga in halvdata',
       'Göra specialundantag',
       'Override utan audit trail',
     ],
     consequence: 'All data är maskin-validerad utan undantag',
   },
 } as const;
 
 // =============================================================================
 // TRUTH AUTHORITY MODEL
 // =============================================================================
 
 export type TruthAuthorityLevel = 
   | 'PRIMARY_SOURCE'      // Officiell myndighet, direktrapportör
   | 'AGGREGATOR'          // Eurostat, WHO, OECD
   | 'DERIVED'             // Beräknade index, normaliserade värden
   | 'THIRD_PARTY'         // Akademisk forskning, NGO
   | 'UNVERIFIED';         // Ej verifierad källa
 
 export interface TruthAuthority {
   level: TruthAuthorityLevel;
   weight: number;           // 0.0 - 1.0
   overridePolicy: 'NEVER' | 'WITH_EVIDENCE' | 'HIGHER_AUTHORITY_ONLY';
   displayPriority: number;  // Visningsordning vid konflikt
 }
 
 export const TRUTH_AUTHORITY_CONFIG: Record<TruthAuthorityLevel, TruthAuthority> = {
   PRIMARY_SOURCE: {
     level: 'PRIMARY_SOURCE',
     weight: 1.0,
     overridePolicy: 'NEVER',
     displayPriority: 1,
   },
   AGGREGATOR: {
     level: 'AGGREGATOR',
     weight: 0.9,
     overridePolicy: 'HIGHER_AUTHORITY_ONLY',
     displayPriority: 2,
   },
   DERIVED: {
     level: 'DERIVED',
     weight: 0.8,
     overridePolicy: 'WITH_EVIDENCE',
     displayPriority: 3,
   },
   THIRD_PARTY: {
     level: 'THIRD_PARTY',
     weight: 0.6,
     overridePolicy: 'WITH_EVIDENCE',
     displayPriority: 4,
   },
   UNVERIFIED: {
     level: 'UNVERIFIED',
     weight: 0.3,
     overridePolicy: 'WITH_EVIDENCE',
     displayPriority: 5,
   },
 };
 
 // =============================================================================
 // CONTRADICTION RESOLUTION
 // =============================================================================
 
 export type ContradictionStrategy = 
   | 'PARALLEL_TRUTHS'       // Båda existerar som separata noder
   | 'TEMPORAL_VERSIONING'   // Tid avgör vilken som är aktuell
   | 'AUTHORITY_WEIGHTED'    // Högre auktoritet vinner
   | 'EXPLICIT_CONFLICT'     // Markeras som konflikt, kräver manuell resolution
   | 'NEWEST_WINS';          // Senaste uppdatering vinner (UNDVIK)
 
 export interface ContradictionRule {
   id: string;
   scenario: string;
   strategy: ContradictionStrategy;
   resolution: string;
   automated: boolean;
 }
 
 export const CONTRADICTION_RULES: ContradictionRule[] = [
   {
     id: 'CONT-001',
     scenario: 'Två officiella källor rapporterar olika värden för samma period',
     strategy: 'PARALLEL_TRUTHS',
     resolution: 'Båda värden sparas som separata noder med explicit käll-ID',
     automated: true,
   },
   {
     id: 'CONT-002',
     scenario: 'Historiskt värde revideras av samma källa',
     strategy: 'TEMPORAL_VERSIONING',
     resolution: 'Ny version skapas, gamla versionen bevaras med revisions-länk',
     automated: true,
   },
   {
     id: 'CONT-003',
     scenario: 'Aggregator och primärkälla har olika värden',
     strategy: 'AUTHORITY_WEIGHTED',
     resolution: 'Primärkälla visas först, aggregator visas som alternativ',
     automated: true,
   },
   {
     id: 'CONT-004',
     scenario: 'Definition av begrepp ändras av myndighet',
     strategy: 'EXPLICIT_CONFLICT',
     resolution: 'Ny entitet skapas med explicit definitions-brott-markering',
     automated: false,
   },
   {
     id: 'CONT-005',
     scenario: 'Metodologibyte mitt i tidsserie',
     strategy: 'TEMPORAL_VERSIONING',
     resolution: 'Serien bryts, båda serier behålls med metodologi-metadata',
     automated: true,
   },
 ];
 
 // =============================================================================
 // SYSTEM EPISTEMIC STANCE
 // =============================================================================
 
 export const EPISTEMIC_STANCE = {
   /**
    * Systemet är DESKRIPTIVT, aldrig NORMATIVT
    */
   mode: 'DESCRIPTIVE' as const,
   
   /**
    * Systemet observerar, rekommenderar aldrig
    */
   actions: {
     OBSERVES: true,
     DESCRIBES: true,
     COMPARES: true,
     CALCULATES: true,
     RECOMMENDS: false,
     ADVISES: false,
     PREDICTS: false,   // Endast inom explicit scenariomodul
     JUDGES: false,
   },
   
   /**
    * Språkliga spärrar
    */
   forbiddenVerbs: [
     'bör', 'ska', 'måste', 'rekommenderar',
     'should', 'must', 'recommend', 'advise',
     'föreslår', 'suggest', 'propose',
   ],
   
   /**
    * Tillåtna verb
    */
   allowedVerbs: [
     'visar', 'indikerar', 'mäter', 'observerar',
     'shows', 'indicates', 'measures', 'observes',
     'jämför', 'beräknar', 'aggregerar',
     'compares', 'calculates', 'aggregates',
   ],
 };
 
 // =============================================================================
 // SCHEMA GOVERNANCE
 // =============================================================================
 
 export interface SchemaGovernance {
   /**
    * Vem får skapa nya scheman?
    */
   creationAuthority: 'SYSTEM_ONLY' | 'STEWARDS' | 'ANY_ADMIN';
   
   /**
    * Vem får modifiera existerande scheman?
    */
   modificationAuthority: 'SYSTEM_ONLY' | 'STEWARDS';
   
   /**
    * Kan scheman tas bort?
    */
   deletionPolicy: 'NEVER' | 'DEPRECATION_ONLY';
   
   /**
    * Hur hanteras breaking changes?
    */
   breakingChangePolicy: 'NEW_VERSION' | 'NEW_SCHEMA';
 }
 
 export const SCHEMA_GOVERNANCE: SchemaGovernance = {
   creationAuthority: 'STEWARDS',
   modificationAuthority: 'SYSTEM_ONLY',
   deletionPolicy: 'DEPRECATION_ONLY',
   breakingChangePolicy: 'NEW_VERSION',
 };
 
 // =============================================================================
 // VALIDATION FUNCTIONS
 // =============================================================================
 
 export function validateOntologicalCompliance(data: unknown): {
   compliant: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   
   // Check AXIOM 1: Schema requirement
   if (!data || typeof data !== 'object') {
     violations.push('ONT-AX-001: Data saknar objektstruktur');
   }
   
   const obj = data as Record<string, unknown>;
   
   if (!obj.schemaId) {
     violations.push('ONT-AX-001: Data saknar schema-ID');
   }
   
   if (!obj.schemaVersion) {
     violations.push('ONT-AX-001: Data saknar schema-version');
   }
   
   // Check AXIOM 2: Semantic integrity
   if (obj.semanticOverride) {
     violations.push('ONT-AX-002: Semantisk override ej tillåten');
   }
   
   // Check AXIOM 3: No shortcuts
   if (obj.bypassValidation) {
     violations.push('ONT-AX-003: Validation bypass ej tillåten');
   }
   
   if (obj.partialData === true) {
     violations.push('ONT-AX-003: Partiell data ej tillåten');
   }
   
   return {
     compliant: violations.length === 0,
     violations,
   };
 }
 
 export function checkVerbCompliance(text: string): {
   compliant: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   const lowerText = text.toLowerCase();
   
   for (const verb of EPISTEMIC_STANCE.forbiddenVerbs) {
     if (lowerText.includes(verb.toLowerCase())) {
       violations.push(`Förbjudet verb upptäckt: "${verb}"`);
     }
   }
   
   return {
     compliant: violations.length === 0,
     violations,
   };
 }