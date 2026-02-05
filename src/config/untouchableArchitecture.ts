 /**
  * UNTOUCHABLE ARCHITECTURE
  * 
  * Mechanisms that make the system impossible to compromise over time.
  * These are the "constitutional locks" of the system.
  */
 
 // =============================================================================
 // IMMUTABILITY GUARANTEES
 // =============================================================================
 
 export const IMMUTABILITY_RULES = {
   /**
    * Raw data kan ALDRIG modifieras efter inmatning
    */
   RAW_DATA_IMMUTABLE: {
     id: 'IMM-001',
     rule: 'Rådata är immutabel',
     enforcement: 'DATABASE_CONSTRAINT',
     description: 'När data väl är inmatad kan den aldrig ändras, endast versioneras',
     technicalImpl: 'INSERT-only tables med append-only log',
   },
   
   /**
    * Schema-versioner kan ALDRIG tas bort
    */
   SCHEMA_VERSIONS_PRESERVED: {
     id: 'IMM-002',
     rule: 'Schema-versioner bevaras för evigt',
     enforcement: 'DATABASE_CONSTRAINT',
     description: 'Alla historiska schemaversioner måste kunna återställas',
     technicalImpl: 'Soft delete med version chain',
   },
   
   /**
    * Audit log kan ALDRIG redigeras
    */
   AUDIT_LOG_APPEND_ONLY: {
     id: 'IMM-003',
     rule: 'Audit log är append-only',
     enforcement: 'DATABASE_CONSTRAINT',
     description: 'Ingen rad i audit log kan någonsin modifieras eller raderas',
     technicalImpl: 'Write-once table med hash-chain verification',
   },
   
   /**
    * Checksums måste matcha över tid
    */
   CHECKSUM_VERIFICATION: {
     id: 'IMM-004',
     rule: 'Checksum-verifikation obligatorisk',
     enforcement: 'APPLICATION_LAYER',
     description: 'Alla data-hämtningar verifierar checksum mot original',
     technicalImpl: 'SHA-256 per datablock med merkle tree',
   },
 };
 
 // =============================================================================
 // SEPARATION OF CONCERNS
 // =============================================================================
 
 export const SEPARATION_RULES = {
   /**
    * Data och presentation är strikt separerade
    */
   DATA_PRESENTATION_SEPARATION: {
     id: 'SEP-001',
     rule: 'Data och presentation är separerade',
     description: 'Ingen presentationslogik i datalager, ingen datalogik i UI',
     violation: 'UI-kod som direkt manipulerar dataformat',
   },
   
   /**
    * Observation och tolkning är strikt separerade
    */
   OBSERVATION_INTERPRETATION_SEPARATION: {
     id: 'SEP-002',
     rule: 'Observation och tolkning är separerade',
     description: 'Systemet observerar aldrig och tolkar i samma operation',
     violation: 'Beräkningar som inkluderar normativa termer',
   },
   
   /**
    * Källa och aggregering är strikt separerade
    */
   SOURCE_AGGREGATION_SEPARATION: {
     id: 'SEP-003',
     rule: 'Källa och aggregering är separerade',
     description: 'Rådata och beräknade värden lever i separata lager',
     violation: 'Aggregerade värden som saknar länk till källdata',
   },
 };
 
 // =============================================================================
 // ANTI-CORRUPTION BARRIERS
 // =============================================================================
 
 export const ANTI_CORRUPTION_BARRIERS = {
   /**
    * Ingen single point of failure för dataintegritet
    */
   NO_SINGLE_POINT_OF_FAILURE: {
     id: 'ACB-001',
     barrier: 'Distribuerad verifikation',
     description: 'Dataintegritet verifieras av multipla oberoende system',
     implementation: [
       'Checksum verification i databas',
       'Checksum verification i API-lager',
       'Checksum verification i klient',
       'Extern audit-tjänst',
     ],
   },
   
   /**
    * Ingen admin kan override säkerhetsregler
    */
   NO_ADMIN_OVERRIDE: {
     id: 'ACB-002',
     barrier: 'Teknisk omöjlighet för override',
     description: 'Administrativa funktioner kan inte kringgå valideringsregler',
     implementation: [
       'Validering i databaslager (triggers, constraints)',
       'Validering i API-lager',
       'Inga "sudo"-kommandon för datamanipulation',
       'Alla ändringar kräver audit trail',
     ],
   },
   
   /**
    * Automatisk anomali-detektering
    */
   ANOMALY_DETECTION: {
     id: 'ACB-003',
     barrier: 'Automatisk anomali-alarm',
     description: 'Systemet larmar automatiskt vid ovanliga mönster',
     triggers: [
       'Bulk-ändringar över tröskel',
       'Ändringar utanför normal arbetstid',
       'Ändringar från okända IP-adresser',
       'Schema-ändringar utan godkännande',
     ],
   },
   
   /**
    * Forkability - öppen metodologi
    */
   FORKABILITY: {
     id: 'ACB-004',
     barrier: 'Öppen och kopierbar arkitektur',
     description: 'Metodbeskrivningar, API-strukturer och datamodeller är öppna',
     purpose: 'Världen kan kopiera och jämföra om huvudsystemet kompromissas',
     exports: [
       'Fullständig API-specifikation (OpenAPI)',
       'Datamodell-dokumentation',
       'Beräkningsmetodik',
       'Valideringsregler',
     ],
   },
 };
 
 // =============================================================================
 // EXIT-SAFE MODE
 // =============================================================================
 
 export const EXIT_SAFE_MODE = {
   /**
    * Vad triggar exit-safe mode?
    */
   triggers: [
     'Försök att modifiera immutabel data',
     'Brott mot ontologiska axiom',
     'Administrativ override av säkerhetsregler',
     'Extern kompromissindikator',
     'Intern inkonsistens detekterad',
   ],
   
   /**
    * Vad händer i exit-safe mode?
    */
   actions: [
     'Tolkande funktioner fryses',
     'Systemet går in i read-only referensläge',
     'Alla skrivoperationer blockeras',
     'Fullständig audit-log exporteras',
     'Extern notifiering skickas',
   ],
   
   /**
    * Återställning kräver
    */
   recoveryRequirements: [
     'Fullständig integritetsverifikation',
     'Identifikation av kompromiss-vektor',
     'Åtgärd av underliggande problem',
     'Extern audit-godkännande',
   ],
 };
 
 // =============================================================================
 // NUCLEAR OPTION
 // =============================================================================
 
 export const NUCLEAR_OPTION = {
   description: 'Sista skyddsmekanism vid försök till kapning eller censur',
   
   /**
    * Triggers för nuclear option
    */
   triggers: [
     'Rättslig order att modifiera historisk data',
     'Försök till censur av specifika datapunkter',
     'Kompromisserat ägarskap',
     'Tvingad nedstängning utan saklig grund',
   ],
   
   /**
    * Automatiska åtgärder
    */
   automaticActions: [
     'All kod publiceras till IPFS',
     'All data publiceras till IPFS',
     'Publik spegling aktiveras',
     'Fullständig dataexport görs tillgänglig',
     'Metodologi och beräkningar dokumenteras permanent',
   ],
   
   /**
    * Garantier
    */
   guarantees: [
     'Ingen enskild aktör kan förstöra systemet',
     'Data överlever organisationen',
     'Metodologi är reproducerbar av andra',
     'Världen kan verifiera oberoende',
   ],
 };
 
 // =============================================================================
 // FEATURE GATE
 // =============================================================================
 
 export const FEATURE_GATE_RULES = {
   description: 'Alla funktioner måste passera gate innan de aktiveras',
   
   /**
    * Frågor varje funktion måste besvara
    */
   questions: [
     {
       id: 'FG-001',
       question: 'Kräver funktionen förklaring?',
       failCondition: 'Om ja → förenkla eller eliminera',
     },
     {
       id: 'FG-002',
       question: 'Kan funktionen missbrukas för propaganda?',
       failCondition: 'Om ja → funktionen dör',
     },
     {
       id: 'FG-003',
       question: 'Kompromissar funktionen dataintegritet?',
       failCondition: 'Om ja → funktionen dör',
     },
     {
       id: 'FG-004',
       question: 'Ökar funktionen systemkomplexitet väsentligt?',
       failCondition: 'Om ja utan proportionell nytta → funktionen dör',
     },
     {
       id: 'FG-005',
       question: 'Kan funktionen leda till semantisk glidning?',
       failCondition: 'Om ja → funktionen dör',
     },
   ],
   
   /**
    * Prioriteringsordning
    */
   priorityOrder: [
     '1. Djup (historik och källkvalitet)',
     '2. Integritet (verifierbarhet och transparens)',
     '3. Stabilitet (långsiktig hållbarhet)',
     '4. Bredd (nya indikatorer och geografier)',
     '5. UX (användarvänlighet)',
   ],
 };
 
 // =============================================================================
 // DECENTRALIZED OPERATION
 // =============================================================================
 
 export const DECENTRALIZED_OPERATION = {
   description: 'Juridisk och politisk sköld genom geografisk distribution',
   
   /**
    * Rättsordningar för drift
    */
   jurisdictions: [
     { code: 'EU', description: 'Europeiska Unionen (GDPR-skydd)' },
     { code: 'CH', description: 'Schweiz (neutralitetsskydd)' },
     { code: 'SG', description: 'Singapore (teknologivänlig)' },
   ],
   
   /**
    * Ingen enskild jurisdiktion kan stänga ner
    */
   resilience: 'Systemet körs i minst 2 jurisdiktioner samtidigt',
   
   /**
    * Data-suveränitet
    */
   dataSovereignty: 'Data ägs av systemet, inte av värdorganisation',
 };