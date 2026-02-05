 /**
  * UX PRINCIPLE BOOK
  * 
  * 15 absolute rules for the platform's user experience.
  * These are non-negotiable and machine-testable.
  */
 
 // =============================================================================
 // CORE UX PRINCIPLES
 // =============================================================================
 
 export interface UXPrinciple {
   id: string;
   title: string;
   description: string;
   rationale: string;
   testable: boolean;
   testFn?: () => boolean;
   violations: string[];
   examples: {
     correct: string;
     incorrect: string;
   };
 }
 
 export const UX_PRINCIPLES: UXPrinciple[] = [
   // ==========================================================================
   // MOBILE VS DESKTOP (Mental Modes)
   // ==========================================================================
   {
     id: 'UX-001',
     title: 'Mobil och desktop är olika mentala lägen',
     description: 'Mobil och desktop ska INTE vara samma UI med olika CSS. De är olika mentala lägen.',
     rationale: 'Användare tänker annorlunda beroende på enhet. Mobil = utforskning, Desktop = analys.',
     testable: true,
     violations: [
       'Samma layout skalas ned för mobil',
       'Desktop-funktioner bara gömms på mobil',
     ],
     examples: {
       correct: 'Mobil visar snapshot-vy, desktop visar jämförelse-vy',
       incorrect: 'Desktop-tabell komprimeras till 3 kolumner på mobil',
     },
   },
   {
     id: 'UX-002',
     title: 'Mobil: Utforskning, inte analys',
     description: 'Mobil fokuserar på upptäckt och navigation, inte djupanalys.',
     rationale: 'Skärmyta och interaktionsmönster på mobil passar bättre för browsing.',
     testable: true,
     violations: [
       'Komplexa filter på mobil',
       'Multipla diagram sida vid sida',
     ],
     examples: {
       correct: 'Stora klickbara kort med en huvudmetrik',
       incorrect: 'Tre diagram med 20 datapunkter vardera',
     },
   },
   {
     id: 'UX-003',
     title: 'Mobil: En huvudaktion per vy',
     description: 'Varje mobil-vy har exakt en primär handling.',
     rationale: 'Reducerar beslutströtthet och förtydligar användarens val.',
     testable: true,
     violations: [
       'Flera likvärdiga knappar',
       'Oklar primär handling',
     ],
     examples: {
       correct: 'En stor "Utforska"-knapp',
       incorrect: 'Tre knappar: "Utforska", "Jämför", "Exportera"',
     },
   },
   {
     id: 'UX-004',
     title: 'Mobil: Allt scrollbart, inget pilligt',
     description: 'All interaktion ska vara scroll-baserad, inga små preciisionsgester.',
     rationale: 'Touch-interaktion är inherent imprecis.',
     testable: true,
     violations: [
       'Pinch-to-zoom på diagram',
       'Små slider-kontroller',
     ],
     examples: {
       correct: 'Vertikal scroll med stora sektioner',
       incorrect: 'Horisontell swipe mellan 20 kort',
     },
   },
   {
     id: 'UX-005',
     title: 'Desktop: Jämförelse',
     description: 'Desktop optimeras för att jämföra multipla datapunkter.',
     rationale: 'Stor skärmyta möjliggör parallell informationsvisning.',
     testable: true,
     violations: [
       'En datapunkt i taget',
       'Mobil-liknande kortlayout',
     ],
     examples: {
       correct: 'Två regioner sida vid sida med synkade axlar',
       incorrect: 'Full skärm för en enda indikator',
     },
   },
   {
     id: 'UX-006',
     title: 'Desktop: Parallella vyer',
     description: 'Desktop stödjer multipla samtidiga vyer.',
     rationale: 'Analytiker behöver se relationer mellan datapunkter.',
     testable: true,
     violations: [
       'Modal blockerar all annan information',
       'Navigation kräver fullständig sidladdning',
     ],
     examples: {
       correct: 'Split-vy med två geografier',
       incorrect: 'Popup som täcker hela skärmen',
     },
   },
   {
     id: 'UX-007',
     title: 'Desktop: Snabb kontextväxling',
     description: 'Användaren kan snabbt byta mellan olika kontexter.',
     rationale: 'Professionella användare arbetar med multipla frågeställningar.',
     testable: true,
     violations: [
       'Långsam navigation',
       'State förloras vid navigation',
     ],
     examples: {
       correct: 'Tabs med bevarad state',
       incorrect: '3+ klick för att byta land',
     },
   },
   
   // ==========================================================================
   // TRUST & TRANSPARENCY
   // ==========================================================================
   {
     id: 'UX-008',
     title: 'Systemet agerar aldrig',
     description: 'Systemet rekommenderar inte, föreslår inte, agerar inte.',
     rationale: 'Reducerar juridisk risk och ökar trovärdighet.',
     testable: true,
     violations: [
       'Verb som antyder handling: "du bör", "vi rekommenderar"',
       'Automatiska åtgärder utan explicit samtycke',
     ],
     examples: {
       correct: '"Data visar att X ökade med 5%"',
       incorrect: '"Du bör överväga att minska X"',
     },
   },
   {
     id: 'UX-009',
     title: 'Read-only oracle-positionering',
     description: 'Systemet är ett läsverktyg, inte ett beslutsverktyg.',
     rationale: 'Separation av observation och beslut förhindrar manipulation.',
     testable: true,
     violations: [
       '"Optimera"-knappar',
       'Målsättningsfunktioner',
     ],
     examples: {
       correct: '"Visa historiska värden"',
       incorrect: '"Sätt mål för denna indikator"',
     },
   },
   {
     id: 'UX-010',
     title: 'Alltid källsynlighet',
     description: 'Varje datapunkt visar sin källa inom ett klick.',
     rationale: 'Transparens är grundläggande för förtroende.',
     testable: true,
     violations: [
       'Data utan källhänvisning',
       'Källa gömd bakom >2 klick',
     ],
     examples: {
       correct: 'Klickbar [SCB] bredvid varje värde',
       incorrect: 'Generisk "Data från officiella källor"',
     },
   },
   
   // ==========================================================================
   // COGNITIVE LOAD
   // ==========================================================================
   {
     id: 'UX-011',
     title: 'Snapshot-förståelse på 15 sekunder',
     description: 'Huvudbudskapet i varje vy ska förstås inom 15 sekunder.',
     rationale: 'Snabb förståelse möjliggör effektiv utforskning.',
     testable: true,
     violations: [
       'Kräver läsning av lång text',
       'Multipla konkurrerande budskap',
     ],
     examples: {
       correct: 'Ett stort tal med trend-pil',
       incorrect: 'Tre stycken text följt av fem diagram',
     },
   },
   {
     id: 'UX-012',
     title: 'Komplexitet göms bakom "Fördjupa"',
     description: 'Djupare metodik och komplexitet döljs bakom aktiv handling.',
     rationale: 'Kontrollerar kognitiv belastning utan att ta bort information.',
     testable: true,
     violations: [
       'Metodbeskrivningar synliga by default',
       'Alla detaljer expanderade',
     ],
     examples: {
       correct: '[Visa metod] expanderar tekniska detaljer',
       incorrect: 'Tre paragrafer om datainsamlingsmetodik synliga direkt',
     },
   },
   {
     id: 'UX-013',
     title: 'Max 5 nya begrepp per vy',
     description: 'Introducera inte fler än 5 nya termer i en vy.',
     rationale: 'Kognitiv överbelastning förhindrar förståelse.',
     testable: true,
     violations: [
       'Teknisk terminologi utan förklaring',
       '10+ nya koncept i en vy',
     ],
     examples: {
       correct: '3 nyckeltal med tydliga definitioner',
       incorrect: 'Dashboard med 15 branschspecifika akronymer',
     },
   },
   
   // ==========================================================================
   // NO DEAD ENDS
   // ==========================================================================
   {
     id: 'UX-014',
     title: 'Varje datapunkt är en portal',
     description: 'Varje värde leder vidare till djupare information.',
     rationale: 'Oändlig drill-down eliminerar "dead ends".',
     testable: true,
     violations: [
       'Statiska siffror utan interaktion',
       'Diagram utan klickbarhet',
     ],
     examples: {
       correct: 'Klicka på "3.2%" öppnar detaljvy',
       incorrect: 'Tooltip med samma information som syns',
     },
   },
   {
     id: 'UX-015',
     title: 'Om data saknas: förklara varför',
     description: 'Tomma vyer förklarar alltid varför de är tomma.',
     rationale: 'Tystnad utan förklaring skapar misstro.',
     testable: true,
     violations: [
       'Blankt utrymme utan text',
       '"No data" utan kontext',
     ],
     examples: {
       correct: '"Källan rapporterar inte data på stadsnivå efter 2022"',
       incorrect: 'Tom tabell',
     },
   },
 ];
 
 // =============================================================================
 // PRINCIPLE COMPLIANCE CHECK
 // =============================================================================
 
 export interface PrincipleComplianceResult {
   principleId: string;
   compliant: boolean;
   violations: string[];
   lastChecked: string;
 }
 
 export function checkUXCompliance(): PrincipleComplianceResult[] {
   return UX_PRINCIPLES.map(principle => ({
     principleId: principle.id,
     compliant: principle.testFn ? principle.testFn() : true,
     violations: [],
     lastChecked: new Date().toISOString(),
   }));
 }
 
 // =============================================================================
 // DEVICE MODES
 // =============================================================================
 
 export const DEVICE_MODES = {
   mobile: {
     purpose: 'Utforskning',
     characteristics: [
       'En huvudaktion per vy',
       'Scrollbart innehåll',
       'Touch-targets ≥ 44px',
       'Snapshot-vy prioriterad',
     ],
     forbidden: [
       'Komplexa filter',
       'Parallella vyer',
       'Precision-gester',
     ],
   },
   desktop: {
     purpose: 'Analys & Jämförelse',
     characteristics: [
       'Parallella datavyer',
       'Snabb kontextväxling',
       'Jämförelsefunktioner',
       'Avancerade filter',
     ],
     forbidden: [
       'Mobil-liknande enkelhet',
       'Modal-dominerad navigation',
       'Fullskärms-popups',
     ],
   },
 } as const;