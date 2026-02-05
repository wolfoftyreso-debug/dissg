 /**
  * MASTERPROMPT COMPLIANCE AUDIT
  * 
  * Systematisk utvärdering av systemets överensstämmelse
  * med den globala masterpromten.
  * 
  * Körs kontinuerligt som självrevision.
  */
 
 export interface ComplianceCheck {
   section: number;
   name: string;
   requirement: string;
   status: 'compliant' | 'partial' | 'non_compliant' | 'not_implemented';
   evidence: string[];
   gaps: string[];
   priority: 'critical' | 'high' | 'medium' | 'low';
   actionRequired?: string;
 }
 
 export interface SelfRevisionQuestion {
   id: string;
   question: string;
   answer: boolean | null;
   evidence?: string;
   requiresImprovement: boolean;
 }
 
 // =============================================================================
 // SEKTION 1: SYSTEMIDENTITET
 // =============================================================================
 
 export const SECTION_1_IDENTITY: ComplianceCheck = {
   section: 1,
   name: 'Systemidentitet',
   requirement: 'Kontinuerligt exekverande global datamotor utan terminalt tillstånd',
   status: 'compliant',
   evidence: [
     'IDENTITY_SUMMARY i systemArchitecture.ts definierar identitet',
     'Lambda-systemet implementerar balansmått',
     '70+ databastabeller för global data',
     '43 edge functions för kontinuerlig exekvering',
     'Nodbaserad arkitektur med relationsbindningar',
   ],
   gaps: [
     'Saknar explicit "orakel-lager" dokumentation',
     'AI-grounding integration ej fullständig',
   ],
   priority: 'medium',
 };
 
 // =============================================================================
 // SEKTION 2: DATAINSAMLING & ANSVAR
 // =============================================================================
 
 export const SECTION_2_DATA: ComplianceCheck = {
   section: 2,
   name: 'Datainsamling & Ansvar',
   requirement: 'Aktiv sökning efter nya informationsströmmar med metadata bevarad',
   status: 'partial',
   evidence: [
     'DATA_INGESTION_LAYER definierar källkategorier',
     'data_sources tabell med reliability_score',
     'data_lineage för spårbarhet',
     'data_versions för historisk caching',
     'Metadata om uppdateringsfrekvens bevaras',
   ],
   gaps: [
     'Automatisk integration av nya källor ej implementerad',
     'Aktiv sökning efter nya strömmar saknas',
     'Osäkerhetsmetadata ej konsekvent på alla datapunkter',
   ],
   priority: 'high',
   actionRequired: 'Implementera auto-discovery för nya datakällor',
 };
 
 // =============================================================================
 // SEKTION 3: ARKITEKTURPRINCIPER
 // =============================================================================
 
 export const SECTION_3_ARCHITECTURE: ComplianceCheck = {
   section: 3,
   name: 'Arkitekturprinciper',
   requirement: 'Nodbaserad, relationsbunden data utan slutna hierarkier eller låsningar',
   status: 'compliant',
   evidence: [
     'Alla entiteter har UUID-baserade relationer',
     'Varje datapunkt kan navigeras vidare (5-lagers djup)',
     'Inga slutna kategorier i datamodellen',
     'lineage_chain_links möjliggör kedjade relationer',
     'Loopar tillåtna genom relation_type i causal_chains',
   ],
   gaps: [
     'Vissa UI-vyer når dead-ends (åtgärdas i Fas 3)',
     'Inte alla index är återanvändbara ännu',
   ],
   priority: 'medium',
 };
 
 // =============================================================================
 // SEKTION 4: INDEX & ÄGDA MÅTT
 // =============================================================================
 
 export const SECTION_4_INDEX: ComplianceCheck = {
   section: 4,
   name: 'Index & Ägda Mått',
   requirement: 'Egna sammansatta index med dokumenterad beräkningslogik',
   status: 'compliant',
   evidence: [
     'Lambda-systemet (λ) är egendefinierat balansmått',
     'Reality Index med 5 domäner',
     'calculated_indicators tabell för sammansatta index',
     'global_master_index_config för viktning',
     'Fullständig dokumentation i lib/lambda/',
   ],
   gaps: [
     'Vissa index saknar reproducerbarhetstest',
   ],
   priority: 'low',
 };
 
 // =============================================================================
 // SEKTION 5: ANVÄNDARNIVÅER & KAPABILITETER
 // =============================================================================
 
 export const SECTION_5_USER_LEVELS: ComplianceCheck = {
   section: 5,
   name: 'Användarnivåer & Kapabiliteter',
   requirement: 'Tydligt separerade lager: Open, Premium, Enterprise/Stat/Militär',
   status: 'compliant',
   evidence: [
     'access_tiers tabell med tier_type',
     'USER_LICENSE_MODEL definierar Guest/Observer/Analyst/Institutional',
     'api_keys med license_tier och differentierade rättigheter',
     'RLS-policies separerar access per användarnivå',
     'Premium-funktioner (portfolio, scenario) bakom licens',
   ],
   gaps: [
     'Enterprise-nivå ej fullt differentierad ännu',
     'Militär/Stat-nivå ej explicit',
   ],
   priority: 'medium',
 };
 
 // =============================================================================
 // SEKTION 6: PROGNOS- OCH SIMULERINGSMODULER
 // =============================================================================
 
 export const SECTION_6_FORECAST: ComplianceCheck = {
   section: 6,
   name: 'Prognos- och Simuleringsmoduler',
   requirement: 'Tydlig separation mellan historik och hypotetiska scenarier',
   status: 'partial',
   evidence: [
     'SCENARIO_LAB config med modelltyper',
     'kpi-forecast edge function',
     'simulation_sessions i databas',
     'Confidence intervals i forecasts',
   ],
   gaps: [
     'Multipla samtidiga framtidsgrenar ej fullt implementerade',
     'Kausal visualisering ej konsekvent',
     'Parameterstyrning behöver förbättras',
   ],
   priority: 'high',
   actionRequired: 'Utöka Scenario Lab (Fas 4, prioritet #14)',
 };
 
 // =============================================================================
 // SEKTION 7: SJÄLVREVISION (OBLIGATORISK LOOP)
 // =============================================================================
 
 export const SELF_REVISION_QUESTIONS: SelfRevisionQuestion[] = [
   {
     id: 'SR1',
     question: 'Finns det någon datapunkt i systemet som inte kan leda vidare?',
     answer: true, // Ja, det finns några
     evidence: 'Vissa indikatorer når dead-end utan djupare drill-down',
     requiresImprovement: true,
   },
   {
     id: 'SR2',
     question: 'Finns det någon modul som är svårare att förstå än nödvändigt?',
     answer: true,
     evidence: 'Lambda-beräkningen saknar pedagogisk förklaring för 15-åringar',
     requiresImprovement: true,
   },
   {
     id: 'SR3',
     question: 'Finns det extern data som borde vara integrerad men inte är det?',
     answer: true,
     evidence: 'Realtidsdata från centralbanker ej automatiskt integrerad',
     requiresImprovement: true,
   },
   {
     id: 'SR4',
     question: 'Finns det index som kan förbättras genom ny kombination?',
     answer: true,
     evidence: 'Cross-domain intelligence ej fullt implementerad',
     requiresImprovement: true,
   },
   {
     id: 'SR5',
     question: 'Finns det användarflöden som inte känns självklara för en 15-åring?',
     answer: true,
     evidence: 'Onboarding-flow ej optimerad, complexity-gating saknas',
     requiresImprovement: true,
   },
 ];
 
 // =============================================================================
 // SEKTION 8: GRUNDPRINCIP
 // =============================================================================
 
 export const SECTION_8_PRINCIPLE: ComplianceCheck = {
   section: 8,
   name: 'Grundprincip',
   requirement: 'Demokratisera beslutsstöd, eliminera informationsasymmetrier',
   status: 'compliant',
   evidence: [
     'Gratis observation-lager för alla',
     'Samma metod för alla (P06)',
     'Ingen rekommendation från systemet (P02)',
     'Open method docs (OPERATIONS_FUTURE)',
     'IDENTITY_SUMMARY bekräftar mission',
   ],
   gaps: [
     'Global räckvidd ej uppnådd (192 länder av 195 saknar djupdata)',
   ],
   priority: 'low',
 };
 
 // =============================================================================
 // SEKTION 9: SLUTLIG KONTROLL
 // =============================================================================
 
 export const SECTION_9_FINAL: ComplianceCheck = {
   section: 9,
   name: 'Slutlig Kontroll',
   requirement: 'Systemet är igång, expanderande, självreviderande, öppet men differentierat',
   status: 'compliant',
   evidence: [
     '✓ Är igång: 90+ sidor, 43 edge functions',
     '✓ Är expanderande: Kontinuerlig utvecklingsplan',
     '✓ Är självreviderande: Self-test engine, audit-log',
     '✓ Är öppet men differentierat: Tier-system',
     '✓ Är tekniskt kompromisslöst: TypeScript, Supabase, RLS',
     '⚠ Mänskligt intuitivt: Behöver förbättras (Fas 3)',
   ],
   gaps: [
     'UX-intuitivitet under pågående förbättring',
   ],
   priority: 'medium',
 };
 
 // =============================================================================
 // AGGREGERAD COMPLIANCE SUMMARY
 // =============================================================================
 
 export const ALL_COMPLIANCE_CHECKS: ComplianceCheck[] = [
   SECTION_1_IDENTITY,
   SECTION_2_DATA,
   SECTION_3_ARCHITECTURE,
   SECTION_4_INDEX,
   SECTION_5_USER_LEVELS,
   SECTION_6_FORECAST,
   SECTION_8_PRINCIPLE,
   SECTION_9_FINAL,
 ];
 
 export function calculateComplianceScore(): {
   score: number;
   compliant: number;
   partial: number;
   nonCompliant: number;
   total: number;
 } {
   const checks = ALL_COMPLIANCE_CHECKS;
   const compliant = checks.filter(c => c.status === 'compliant').length;
   const partial = checks.filter(c => c.status === 'partial').length;
   const nonCompliant = checks.filter(c => c.status === 'non_compliant').length;
   
   // Score: compliant = 1.0, partial = 0.5, non_compliant = 0
   const score = ((compliant * 1.0) + (partial * 0.5)) / checks.length;
   
   return {
     score: Math.round(score * 100),
     compliant,
     partial,
     nonCompliant,
     total: checks.length,
   };
 }
 
 export function getImprovementActions(): string[] {
   const actions: string[] = [];
   
   // From compliance checks
   ALL_COMPLIANCE_CHECKS
     .filter(c => c.actionRequired)
     .forEach(c => actions.push(c.actionRequired!));
   
   // From self-revision
   SELF_REVISION_QUESTIONS
     .filter(q => q.requiresImprovement)
     .forEach(q => actions.push(`Åtgärda: ${q.question}`));
   
   return actions;
 }
 
 // =============================================================================
 // CONTINUOUS SELF-REVISION LOOP
 // =============================================================================
 
 export function runSelfRevision(): {
   timestamp: string;
   complianceScore: number;
   improvementsNeeded: number;
   criticalGaps: string[];
   nextActions: string[];
 } {
   const compliance = calculateComplianceScore();
   const improvements = SELF_REVISION_QUESTIONS.filter(q => q.requiresImprovement);
   
   const criticalGaps = ALL_COMPLIANCE_CHECKS
     .filter(c => c.priority === 'critical' && c.status !== 'compliant')
     .flatMap(c => c.gaps);
   
   return {
     timestamp: new Date().toISOString(),
     complianceScore: compliance.score,
     improvementsNeeded: improvements.length,
     criticalGaps,
     nextActions: getImprovementActions().slice(0, 5), // Top 5
   };
 }
 
 // =============================================================================
 // EXPORT FOR EXTERNAL PROMPTS
 // =============================================================================
 
 export const MASTERPROMPT_SUMMARY = {
   identity: 'Global aggregerad besluts- och statistikmotor',
   purpose: 'Demokratisera extremt avancerat beslutsstöd globalt',
   principles: [
     'Aldrig nå terminalt tillstånd',
     'Alltid kunna expandera',
     'Principiellt enkel att använda',
     'Tillförlitlighet är källans egenskap',
     'Loopar tillåtna, låsningar förbjudna',
   ],
   selfRevisionLoop: {
     frequency: 'continuous',
     questions: SELF_REVISION_QUESTIONS.length,
     trigger: 'Om svaret är ja på någon punkt → initiera förbättring',
   },
   finalCheck: {
     isRunning: true,
     isExpanding: true,
     isSelfRevising: true,
     isOpenButDifferentiated: true,
     isTechnicallyUncompromised: true,
     isHumanlyIntuitive: false, // Under improvement
   },
 };