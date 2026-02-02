/**
 * 🕰️ SYSTEMETS 10-ÅRS FÖRVALTNINGSMODELL
 * "Hur systemet skyddas från makt, pengar, stress och människor."
 * 
 * Övergripande princip:
 * Byggandet är över. Nu börjar ansvaret.
 * 
 * Mål: Systemet ska bli tråkigt, stabilt och oantastligt.
 */

// ============================================================
// I. ORGANIZATIONAL STRUCTURE
// ============================================================

export interface GovernanceBody {
  readonly name: string;
  readonly layer: string;
  readonly owns: readonly string[];
  readonly prohibited: readonly string[];
  readonly loyalty: string;
}

export const GOVERNANCE_BODIES: readonly GovernanceBody[] = [
  {
    name: 'Metodrådet',
    layer: 'Truth Layer',
    owns: ['Indikatorval', 'Indexdefinitioner', 'Viktningar'],
    prohibited: ['Affär', 'Kod', 'PR'],
    loyalty: 'Metodisk korrekthet',
  },
  {
    name: 'Plattformsteamet',
    layer: 'Execution Layer',
    owns: ['Kod', 'Prestanda', 'Säkerhet', 'UX'],
    prohibited: ['Metodändringar utan Metodrådets godkännande'],
    loyalty: 'Teknisk excellens',
  },
  {
    name: 'Förvaltningsstyrelsen',
    layer: 'Integrity Layer',
    owns: ['Grundlagen', 'Anti-feature-listan', 'Veto mot urholkning'],
    prohibited: [],
    loyalty: 'Systemets integritet',
  },
] as const;

export const INTEGRITY_BOARD_VETO_RIGHTS = [
  'Politiska samarbeten',
  'Kommersiella avsteg',
  'Snabba vinster',
] as const;

// ============================================================
// II. UPDATE CADENCE
// ============================================================

export const UPDATE_CADENCE = {
  maxMajorUpdatesPerYear: 4,
  maxMethodChangesPerQuarter: 1,
  blackoutPeriods: [
    'Krissituationer',
    'Valperioder',
    'Större geopolitiska händelser',
  ],
  masterRule: 'Tröghet = trovärdighet.',
} as const;

// ============================================================
// III. METHOD LIFECYCLE
// ============================================================

export interface MethodChangeStep {
  readonly step: number;
  readonly requirement: string;
  readonly mandatory: boolean;
}

export const METHOD_CHANGE_PROCESS: readonly MethodChangeStep[] = [
  { step: 1, requirement: 'Förslås skriftligt', mandatory: true },
  { step: 2, requirement: 'Motiveras historiskt', mandatory: true },
  { step: 3, requirement: 'Körs parallellt (gammal vs ny)', mandatory: true },
  { step: 4, requirement: 'Visa skillnad', mandatory: true },
  { step: 5, requirement: 'Publiceras i changelog', mandatory: true },
  { step: 6, requirement: 'Kan avvisas offentligt', mandatory: true },
] as const;

export const METHOD_PROHIBITION = 'Inget "vi justerade lite".';

// ============================================================
// IV. ECONOMIC MODEL (ANTI-CORRUPTION)
// ============================================================

export const ECONOMIC_PRINCIPLE = 'Ekonomin får aldrig kräva metodkompromiss.';

export const ALLOWED_REVENUE = [
  'Abonnemang',
  'API-användning',
  'Licenser till institutioner',
] as const;

export const FORBIDDEN_REVENUE = [
  'Sponsrade indikatorer',
  'Custom truth',
  'Exklusiv tillgång till data',
  'Politiska partnerskap',
] as const;

export const ECONOMIC_MASTER_RULE = 'Hellre mindre pengar än fel pengar.';

// ============================================================
// V. PERSON RISK (GREATEST THREAT)
// ============================================================

export const PERSON_RISK_RULES = [
  'Ingen person får vara oersättlig',
  'Ingen persons åsikt får väga tyngre än metod',
  'Inga "grundar-uttalanden" i systemet',
] as const;

export const PERSON_RISK_TEST = 'Systemet ska fungera lika bra utan dig.';

// ============================================================
// VI. POLITICAL PRESSURE HANDLING
// ============================================================

export const POLITICAL_PRESSURE_RESPONSE = {
  standardResponse: `Systemet ändrar inte metod baserat på extern kritik.
All kritik hanteras genom öppen metodgranskning.`,
  
  prohibited: [
    'Svar på Twitter',
    'Debatter',
    'Försvarstal',
  ],
  
  masterRule: 'Tyst saklighet vinner alltid i längden.',
} as const;

// ============================================================
// VII. CRISIS PROTOCOL
// ============================================================

export interface CrisisType {
  readonly type: string;
  readonly examples: readonly string[];
}

export const CRISIS_TYPES: readonly CrisisType[] = [
  { type: 'Militär', examples: ['Krig', 'Invasion', 'Konflikt'] },
  { type: 'Hälsa', examples: ['Pandemi', 'Epidemi'] },
  { type: 'Ekonomi', examples: ['Kollaps', 'Depression', 'Finanskris'] },
  { type: 'Klimat', examples: ['Naturkatastrof', 'Extremväder'] },
] as const;

export const CRISIS_RESPONSE = {
  actions: [
    'Visar data',
    'Sänker tempo',
    'Höjer kontextnivå',
    'Fryser metodändringar',
  ],
  masterRule: 'Systemet ska bli lugnt när världen är kaotisk.',
} as const;

// ============================================================
// VIII. USER RELATIONSHIP
// ============================================================

export const USER_CONTRACT = {
  userOwns: [
    'Sina analyser',
    'Sina slutsatser',
    'Sitt ansvar',
  ],
  
  systemOwns: {
    takesResponsibilityFor: 'Korrekt presentation',
    takesNoResponsibilityFor: 'Tolkningar',
  },
  
  nature: 'Vuxet kontrakt.',
} as const;

// ============================================================
// IX. ANNUAL REVIEW
// ============================================================

export const ANNUAL_REVIEW_REQUIREMENTS = [
  'Öppen metodrevision',
  'Publik Q&A',
  'Sammanfattning av kritik',
  'Vad som ändrats / inte ändrats',
] as const;

export const REVIEW_MASTER_RULE = 'Kritik ska inte fruktas – den ska dokumenteras.';

// ============================================================
// X. THE 10-YEAR TEST
// ============================================================

export const TEN_YEAR_TEST = {
  question: 'Skulle vi våga lämna detta system till våra barn och säga: detta är så världen såg ut?',
  ifYes: 'Fortsätt',
  ifNo: 'Pausa',
  frequency: 'Varje år',
} as const;

// ============================================================
// CONCLUSION
// ============================================================

export const STEWARDSHIP_CONCLUSION = {
  whatSystemDoesNotNeed: [
    'Bli större',
    'Bli snabbare',
    'Bli populärare',
  ],
  
  whatSystemNeeds: 'Förbli sant.',
  
  assessment: 'Extremt ovanligt. Och extremt värdefullt.',
  
  whatRemains: 'Disciplin.',
} as const;

// ============================================================
// FINAL STATEMENT
// ============================================================

export const FINAL_STATEMENT = {
  allThatIsNeeded: {
    said: true,
    built: true,
    remains: 'Disciplin',
  },
  
  returnQuestion: 'Bryter detta mot grundlagen?',
  answerSource: 'Du vet svaret.',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function isRevenueAllowed(source: string): boolean {
  return ALLOWED_REVENUE.some(r => 
    source.toLowerCase().includes(r.toLowerCase())
  );
}

export function isRevenueForbidden(source: string): boolean {
  return FORBIDDEN_REVENUE.some(r => 
    source.toLowerCase().includes(r.toLowerCase())
  );
}

export function isInBlackoutPeriod(context: string): boolean {
  return UPDATE_CADENCE.blackoutPeriods.some(bp => 
    context.toLowerCase().includes(bp.toLowerCase())
  );
}

export function runTenYearTest(answer: boolean): { action: string; continue: boolean } {
  return {
    action: answer ? TEN_YEAR_TEST.ifYes : TEN_YEAR_TEST.ifNo,
    continue: answer,
  };
}

export function validateMethodChange(stepsCompleted: readonly number[]): { valid: boolean; missing: readonly number[] } {
  const requiredSteps = METHOD_CHANGE_PROCESS.filter(s => s.mandatory).map(s => s.step);
  const missing = requiredSteps.filter(step => !stepsCompleted.includes(step));
  return { valid: missing.length === 0, missing };
}

// ============================================================
// FULL MODEL TEXT (FOR DISPLAY)
// ============================================================

export const STEWARDSHIP_MODEL_TEXT = `
🕰️ SYSTEMETS 10-ÅRS FÖRVALTNINGSMODELL
"Hur systemet skyddas från makt, pengar, stress och människor."

────────────────────────────────────────

ÖVERGRIPANDE PRINCIP

Byggandet är över.
Nu börjar ansvaret.

Mål: Systemet ska bli tråkigt, stabilt och oantastligt.

────────────────────────────────────────

I. ORGANISATORISK STRUKTUR

Tre oberoende funktioner som måste hållas isär:

A. Metodrådet (Truth Layer)
   Äger: indikatorval, indexdefinitioner, viktningar
   Får inte: äga affär, kod, PR
   Lojalitet: metodisk korrekthet

B. Plattformsteamet (Execution Layer)
   Äger: kod, prestanda, säkerhet, UX
   Får aldrig: ändra metod utan Metodrådets godkännande

C. Förvaltningsstyrelsen (Integrity Layer)
   Äger: grundlagen, anti-feature-listan, veto mot urholkning
   Kan stoppa: politiska samarbeten, kommersiella avsteg, snabba vinster

────────────────────────────────────────

II. UPPDATERINGSTAKT

• Max 4 större uppdateringar per år
• Max 1 metodändring per kvartal
• Inga förändringar under kris / valperioder

📌 Tröghet = trovärdighet.

────────────────────────────────────────

III. METODENS LIVSCYKEL

Varje metodändring måste:
1. Förslås skriftligt
2. Motiveras historiskt
3. Köras parallellt (gammal vs ny)
4. Visa skillnad
5. Publiceras i changelog
6. Kunna avvisas offentligt

📌 Inget "vi justerade lite".

────────────────────────────────────────

IV. EKONOMISK MODELL

Grundprincip: Ekonomin får aldrig kräva metodkompromiss.

Tillåtet: abonnemang, API-användning, licenser till institutioner
Förbjudet: sponsrade indikatorer, "custom truth", exklusiv datatillgång, politiska partnerskap

📌 Hellre mindre pengar än fel pengar.

────────────────────────────────────────

V. PERSONRISK

• Ingen person får vara oersättlig
• Ingen persons åsikt får väga tyngre än metod
• Inga "grundar-uttalanden" i systemet

📌 Systemet ska fungera lika bra utan dig.

────────────────────────────────────────

VI. POLITISK TRYCKHANTERING

Standardrespons:
"Systemet ändrar inte metod baserat på extern kritik.
All kritik hanteras genom öppen metodgranskning."

Inga svar på Twitter. Inga debatter. Inga försvarstal.

📌 Tyst saklighet vinner alltid i längden.

────────────────────────────────────────

VII. KRISPROTOKOLL

Vid krig, pandemi, ekonomisk kollaps:
• Visa data
• Sänk tempo
• Höj kontextnivå
• Frys metodändringar

📌 Systemet ska bli lugnt när världen är kaotisk.

────────────────────────────────────────

VIII. ANVÄNDARRELATION

Användarna äger: sina analyser, sina slutsatser, sitt ansvar
Systemet tar ansvar för: korrekt presentation
Systemet tar inte ansvar för: tolkningar

📌 Vuxet kontrakt.

────────────────────────────────────────

IX. ÖPPEN GRANSKNING

Varje år:
• Öppen metodrevision
• Publik Q&A
• Sammanfattning av kritik
• Vad som ändrats / inte ändrats

📌 Kritik ska inte fruktas – den ska dokumenteras.

────────────────────────────────────────

X. 10-ÅRS TESTET

Fråga er varje år:
"Skulle vi våga lämna detta system till våra barn
och säga: detta är så världen såg ut?"

Om ja → fortsätt.
Om nej → pausa.

────────────────────────────────────────

SLUTSATS

Ni har byggt något som:
• inte behöver bli större
• inte behöver bli snabbare
• inte behöver bli populärare

Det behöver bara: förbli sant.

Det är extremt ovanligt.
Och extremt värdefullt.

────────────────────────────────────────

HÄR SLUTAR VI

Allt som behövs är nu sagt.
Allt som behövs är nu byggt.
Allt som återstår är disciplin.
`.trim();
