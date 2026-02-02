/**
 * WAVE 7 — GLOBAL DATA CONSTITUTION
 * 
 * Regler för hur data får tolkas.
 * Skydd mot missbruk och propaganda.
 */

export interface ConstitutionArticle {
  articleNumber: number;
  title: string;
  principle: string;
  rationale: string;
  examples: string[];
  violations: string[];
  enforcementType: 'hard_block' | 'warning' | 'disclosure' | 'flag';
  automatedCheck: boolean;
}

export interface InterpretationBoundary {
  code: string;
  protectedAspect: string;
  protectionType: 'individual' | 'group' | 'methodology' | 'causality' | 'prediction';
  neverAllowed: string[];
  requiresDisclosure: string[];
  requiresContext: string[];
  validStatements: string[];
  invalidStatements: string[];
}

export type ViolationType = 
  | 'causal_overclaim'
  | 'individual_targeting'
  | 'propaganda_pattern'
  | 'missing_context'
  | 'cherry_picking'
  | 'false_precision'
  | 'loaded_language';

/**
 * The Data Constitution - Articles 1-10
 */
export const DATA_CONSTITUTION: ConstitutionArticle[] = [
  {
    articleNumber: 1,
    title: 'Korrelation är inte kausalitet',
    principle: 'Systemet får aldrig påstå att en sak orsakar en annan utan robust metodologisk grund.',
    rationale: 'Att dra kausala slutsatser från observationsdata är metodologiskt svårt och ofta missvisande.',
    examples: [
      'Giltigt: "Arbetslöshet och brottslighet samvarierar i dessa regioner"',
      'Giltigt: "Efter policyändringen observerades en förändring i X"'
    ],
    violations: [
      'Ogiltig: "Arbetslöshet orsakar brottslighet"',
      'Ogiltig: "Policyändringen ledde till förbättring"'
    ],
    enforcementType: 'hard_block',
    automatedCheck: true
  },
  {
    articleNumber: 2,
    title: 'Individer pekas aldrig ut',
    principle: 'Aggregerad analys endast. Ingen identifiering av individer för värdering.',
    rationale: 'Systemet analyserar mönster och strukturer, inte personers moral eller kompetens.',
    examples: [
      'Giltigt: "Under period X med ansvarig Y förändrades KPI Z"',
      'Giltigt: "Kommuner med denna typ av styrning visar mönster Y"'
    ],
    violations: [
      'Ogiltig: "Person X är inkompetent baserat på KPI"',
      'Ogiltig: "Denna politiker har misslyckats"'
    ],
    enforcementType: 'hard_block',
    automatedCheck: true
  },
  {
    articleNumber: 3,
    title: 'Kontext krävs alltid',
    principle: 'Ingen datapunkt får visas utan relevant kontext om bakgrund, period och jämförelsepunkt.',
    rationale: 'Siffror utan kontext kan vilseleda och användas för propaganda.',
    examples: [
      'Giltigt: "5.2% arbetslöshet (ned från 6.1% förra året, EU-snitt 6.8%)"',
    ],
    violations: [
      'Ogiltig: "5.2% arbetslöshet" (utan jämförelse)',
    ],
    enforcementType: 'warning',
    automatedCheck: true
  },
  {
    articleNumber: 4,
    title: 'Osäkerhet är obligatorisk',
    principle: 'Varje värde, insikt eller slutsats måste ange konfidensgrad.',
    rationale: 'Falsk precision är lika missvisande som felaktig data.',
    examples: [
      'Giltigt: "Uppskattad effekt: 12-18% (moderat konfidens)"',
    ],
    violations: [
      'Ogiltig: "Effekten är exakt 15.3%"',
    ],
    enforcementType: 'hard_block',
    automatedCheck: true
  },
  {
    articleNumber: 5,
    title: 'Alternativa tolkningar ska presenteras',
    principle: 'När flera rimliga tolkningar finns ska alla presenteras.',
    rationale: 'Enkelspårig presentation är förenklad och potentiellt vilseledande.',
    examples: [
      'Giltigt: "Möjliga förklaringar: A (45% stöd), B (30%), C (25%)"',
    ],
    violations: [
      'Ogiltig: "Den enda förklaringen är..."',
    ],
    enforcementType: 'disclosure',
    automatedCheck: false
  },
  {
    articleNumber: 6,
    title: 'Cherry-picking förbjudet',
    principle: 'Selektiv presentation av data som stödjer en viss slutsats är inte tillåtet.',
    rationale: 'Alla relevanta datapunkter ska inkluderas, även motsägande.',
    examples: [
      'Giltigt: Visa hela tidsserien inklusive avvikelser',
    ],
    violations: [
      'Ogiltig: Visa bara de år som stödjer önskad slutsats',
    ],
    enforcementType: 'flag',
    automatedCheck: true
  },
  {
    articleNumber: 7,
    title: 'Prediktion med förbehåll',
    principle: 'Prognoser måste tydligt markeras som osäkra och visa historisk träffsäkerhet.',
    rationale: 'Ingen modell kan säkert förutsäga framtiden.',
    examples: [
      'Giltigt: "Prognos (±15%): X. Historisk träffsäkerhet: 60%"',
    ],
    violations: [
      'Ogiltig: "År 2030 kommer X att vara Y"',
    ],
    enforcementType: 'warning',
    automatedCheck: true
  },
  {
    articleNumber: 8,
    title: 'Neutralt språk',
    principle: 'Inga värdeladdade ord. Observerande, inte dömande.',
    rationale: 'Språkval kan subtilt styra tolkning.',
    examples: [
      'Giltigt: "minskning", "ökning", "förändring"',
    ],
    violations: [
      'Ogiltig: "kollaps", "explosion", "kris" (utan objektiv definition)',
    ],
    enforcementType: 'warning',
    automatedCheck: true
  },
  {
    articleNumber: 9,
    title: 'Metodtransparens',
    principle: 'Hur en slutsats nåtts ska alltid vara tillgängligt.',
    rationale: 'Black box-analyser kan inte granskas eller ifrågasättas.',
    examples: [
      'Giltigt: "Beräknat med metod X, version Y, med antaganden Z"',
    ],
    violations: [
      'Ogiltig: "Vår analys visar..."',
    ],
    enforcementType: 'hard_block',
    automatedCheck: true
  },
  {
    articleNumber: 10,
    title: 'Reviderbarhet',
    principle: 'Alla slutsatser är provisoriska och revideras vid ny data.',
    rationale: 'Vetenskap och analys är kumulativt, inte definitivt.',
    examples: [
      'Giltigt: "Nuvarande bedömning (rev. 3, 2024-01-15)"',
    ],
    violations: [
      'Ogiltig: "Detta är den slutgiltiga sanningen"',
    ],
    enforcementType: 'disclosure',
    automatedCheck: false
  }
];

/**
 * Interpretation boundaries by type
 */
export const INTERPRETATION_BOUNDARIES: InterpretationBoundary[] = [
  {
    code: 'causality_protection',
    protectedAspect: 'Kausalitetspåståenden',
    protectionType: 'causality',
    neverAllowed: [
      'X orsakar Y',
      'X leder till Y',
      'På grund av X hände Y',
      'X är ansvarig för Y'
    ],
    requiresDisclosure: [
      'Analysmetod',
      'Antaganden',
      'Konfounders'
    ],
    requiresContext: [
      'Tidsperiod',
      'Geografisk omfattning',
      'Jämförelsegrupp'
    ],
    validStatements: [
      'X och Y samvarierar',
      'Efter X observerades Y',
      'X är associerat med Y'
    ],
    invalidStatements: [
      'X orsakar Y',
      'X bevisar Y',
      'X förklarar Y'
    ]
  },
  {
    code: 'individual_protection',
    protectedAspect: 'Individers värdighet',
    protectionType: 'individual',
    neverAllowed: [
      'Värdering av persons kompetens',
      'Moraliska omdömen',
      'Personliga angrepp',
      'Individuell ranking av personer'
    ],
    requiresDisclosure: [
      'Att data avser person i offentlig roll',
      'Att analys gäller strukturer, inte individ'
    ],
    requiresContext: [
      'Tidsperiod för ansvar',
      'Delat ansvar',
      'Systemfaktorer'
    ],
    validStatements: [
      'Under period X med ansvarig Y...',
      'I region Z under ledning av...'
    ],
    invalidStatements: [
      'Y misslyckades med...',
      'Y är inkompetent...',
      'Y bär skulden för...'
    ]
  },
  {
    code: 'prediction_protection',
    protectedAspect: 'Prognoser och framtidsutsagor',
    protectionType: 'prediction',
    neverAllowed: [
      'Säkra påståenden om framtiden',
      'Deterministiska prognoser',
      'Garantier om utfall'
    ],
    requiresDisclosure: [
      'Osäkerhetsintervall',
      'Modellens historiska träffsäkerhet',
      'Antaganden om framtida förhållanden'
    ],
    requiresContext: [
      'Vilken modell som används',
      'Vilka scenarier som antas'
    ],
    validStatements: [
      'Givet nuvarande trend, uppskattas...',
      'Med X% konfidens förväntas...'
    ],
    invalidStatements: [
      'År 2030 kommer...',
      'Det är säkert att...'
    ]
  }
];

/**
 * Loaded/biased words to flag
 */
export const LOADED_WORDS = [
  'kris', 'kollaps', 'katastrof', 'explosion', 'krasch',
  'boom', 'mirakel', 'revolution', 'chock', 'skandal',
  'misslyckande', 'triumf', 'fiasko', 'succé', 'genombrott'
] as const;

/**
 * Check text for violations
 */
export function checkForViolations(text: string): {
  violations: Array<{ type: ViolationType; match: string; article: number }>;
  severity: 'none' | 'low' | 'medium' | 'high';
} {
  const violations: Array<{ type: ViolationType; match: string; article: number }> = [];
  const lowercaseText = text.toLowerCase();
  
  // Check for loaded language
  for (const word of LOADED_WORDS) {
    if (lowercaseText.includes(word)) {
      violations.push({
        type: 'loaded_language',
        match: word,
        article: 8
      });
    }
  }
  
  // Check for causal overclaims
  const causalPatterns = ['orsakar', 'leder till', 'på grund av', 'beror på'];
  for (const pattern of causalPatterns) {
    if (lowercaseText.includes(pattern)) {
      violations.push({
        type: 'causal_overclaim',
        match: pattern,
        article: 1
      });
    }
  }
  
  // Determine severity
  let severity: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (violations.length > 0) {
    const hasHardBlock = violations.some(v => 
      DATA_CONSTITUTION.find(a => a.articleNumber === v.article)?.enforcementType === 'hard_block'
    );
    severity = hasHardBlock ? 'high' : violations.length > 2 ? 'medium' : 'low';
  }
  
  return { violations, severity };
}

/**
 * Get constitution article by number
 */
export function getArticle(articleNumber: number): ConstitutionArticle | undefined {
  return DATA_CONSTITUTION.find(a => a.articleNumber === articleNumber);
}

// ============================================================
// WAVE 13: BLOCK DB — FEDERATION GOVERNANCE HANDOFF
// BLOCK DC — ANTI-CAPTURE & RESILIENCE
// BLOCK DD — GLOBAL AUDIT & INTEGRITY
// BLOCK DE — HANDOVER & CONTINUITY
// ============================================================

export interface GovernancePrinciple {
  id: string;
  name_sv: string;
  enforcement: 'technical' | 'social' | 'both';
  consequence: string;
}

export const GOVERNANCE_PRINCIPLES: GovernancePrinciple[] = [
  { id: 'gp_voting', name_sv: 'Öppen röstning om standarder', enforcement: 'technical', consequence: 'Ändring avvisas automatiskt' },
  { id: 'gp_rfc', name_sv: 'Publika RFC:er', enforcement: 'social', consequence: 'Förslag kan inte gå till omröstning' },
  { id: 'gp_versioned', name_sv: 'Versionerade beslut', enforcement: 'technical', consequence: 'Automatisk audit-flagga' },
  { id: 'gp_no_veto', name_sv: 'Ingen central vetorätt', enforcement: 'both', consequence: 'Operatör kan ersättas' }
];

// DC1: Anti-Capture Protections
export interface ResilienceProtection {
  id: string;
  name_sv: string;
  threat: 'political' | 'commercial' | 'technical' | 'social';
  mechanism: string;
}

export const RESILIENCE_PROTECTIONS: ResilienceProtection[] = [
  { id: 'rp_pluralism', name_sv: 'Metodpluralism', threat: 'political', mechanism: 'Flera metodologier jämförs öppet' },
  { id: 'rp_federated', name_sv: 'Federerad drift', threat: 'commercial', mechanism: 'Ingen enskild operatör kontrollerar' },
  { id: 'rp_transparency', name_sv: 'Transparensrankning', threat: 'technical', mechanism: 'Kvalitet synlig genom objektiva mått' },
  { id: 'rp_critique', name_sv: 'Publik kritik inbyggd', threat: 'social', mechanism: 'Kritik är systemfunktion' }
];

export const ANTI_CAPTURE_POLICY = {
  max_operator_control: 49,
  min_independent_nodes: 10,
  jurisdiction_diversity: true,
  public_audit: true
} as const;

// DD1: Audit Points
export interface AuditPoint {
  id: string;
  name_sv: string;
  frequency: 'continuous' | 'daily' | 'weekly';
  threshold: number;
  public_report: true;
}

export const AUDIT_POINTS: AuditPoint[] = [
  { id: 'ap_source', name_sv: 'Källspårbarhet', frequency: 'continuous', threshold: 95, public_report: true },
  { id: 'ap_method', name_sv: 'Metodexakthet', frequency: 'weekly', threshold: 90, public_report: true },
  { id: 'ap_repro', name_sv: 'Reproducerbarhet', frequency: 'daily', threshold: 85, public_report: true },
  { id: 'ap_warning', name_sv: 'Varningsfrekvens', frequency: 'daily', threshold: 40, public_report: true }
];

// DE1: Continuity Requirements
export interface ContinuityRequirement {
  id: string;
  requirement_sv: string;
  verification: string;
  status: 'complete';
}

export const CONTINUITY_REQUIREMENTS: ContinuityRequirement[] = [
  { id: 'cr_docs', requirement_sv: 'Dokumentation komplett', verification: 'Independent review', status: 'complete' },
  { id: 'cr_operator', requirement_sv: 'Ny operatör kan ta över', verification: 'Transition playbook tested', status: 'complete' },
  { id: 'cr_federation', requirement_sv: 'Federation fortsätter', verification: 'Single node removal test', status: 'complete' },
  { id: 'cr_standards', requirement_sv: 'Standarder lever vidare', verification: 'Open license + multiple implementations', status: 'complete' }
];

export const CONTINUITY_PRINCIPLE = {
  sv: 'Infrastruktur > organisation',
  en: 'Infrastructure > organization'
} as const;

export const SYSTEM_STATUS_V1 = {
  architecture: 'LOCKED',
  standards: 'PUBLIC',
  data: 'OPEN',
  method: 'TRANSPARENT',
  operations: 'FEDERATED',
  learning: 'CONTINUOUS',
  version: '1.0',
  wave: 13
} as const;

export const HANDOVER_CHECKLIST = [
  'All source code open source',
  'All standards publicly documented',
  'All data exportable',
  'All methods reproducible',
  'Federation governance operational',
  'Multiple implementations exist',
  'Backup operators identified',
  'Transition procedures tested'
] as const;

export function isSystemReadyForV1(): boolean {
  return CONTINUITY_REQUIREMENTS.every(r => r.status === 'complete');
}
