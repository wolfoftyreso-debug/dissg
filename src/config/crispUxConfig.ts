/**
 * MASTER EXECUTION BLOCK 23
 * CRISP UI/UX PASS — "TELIA / AMAZON-GRADE"
 * 
 * Mål: Systemet ska kännas stabilt, lugnt, exakt, professionellt.
 * Inget wow. Inget trams. Bara total tillit.
 */

// ============================================================
// 1. CONFIDENCE PRINCIPLE
// ============================================================

export const CONFIDENCE_PRINCIPLES = {
  coreFeeling: 'Det här systemet vet exakt vad det gör.',
  achievedThrough: [
    'Omedelbar respons',
    'Förutsägbara mönster',
    'Inga överraskningar',
  ],
  rule: 'All UX designar bort osäkerhet.',
} as const;

// ============================================================
// 2. MICROINTERACTION DISCIPLINE
// ============================================================

export interface MicrointeractionRule {
  readonly trigger: string;
  readonly response: string;
  readonly maxLatencyMs: number;
  readonly fallback: string;
}

export const MICROINTERACTION_RULES: readonly MicrointeractionRule[] = [
  { trigger: 'Klick på knapp', response: 'Omedelbar visuell feedback (hover→active state)', maxLatencyMs: 50, fallback: 'Opacity change' },
  { trigger: 'Navigering', response: 'Skeleton loader visas direkt', maxLatencyMs: 100, fallback: 'Fade transition' },
  { trigger: 'Data laddas', response: 'Progressiv rendering', maxLatencyMs: 300, fallback: 'Skeleton cards' },
  { trigger: 'Formulär submit', response: 'Button disabled + spinner', maxLatencyMs: 50, fallback: 'Loading text' },
  { trigger: 'Error uppstår', response: 'Inline error med kontext', maxLatencyMs: 100, fallback: 'Toast notification' },
  { trigger: 'Success', response: 'Subtil bekräftelse', maxLatencyMs: 100, fallback: 'Checkmark icon' },
] as const;

export const AMAZON_RULE = 'Visa strukturen först. Data fylls i efterhand.';

// ============================================================
// 3. LATENCY ILLUSION
// ============================================================

export interface LatencyStrategy {
  readonly technique: string;
  readonly description: string;
  readonly implementation: string;
}

export const LATENCY_STRATEGIES: readonly LatencyStrategy[] = [
  { technique: 'Preload', description: 'Ladda nästa sannolika vy', implementation: 'React.lazy + Suspense med preload på hover' },
  { technique: 'Cache', description: 'Spara senaste session', implementation: 'React Query staleTime + localStorage fallback' },
  { technique: 'Optimistic UI', description: 'Visa förväntad state direkt', implementation: 'useMutation med optimisticUpdate' },
  { technique: 'Progressive rendering', description: 'Visa partiell data först', implementation: 'Streaming + skeleton states' },
  { technique: 'Prefetch on intent', description: 'Ladda vid hover/focus', implementation: 'prefetchQuery on mouseEnter' },
] as const;

export const TELIA_PRINCIPLE = 'Förväntansstyrning, inte bara hastighet.';

// ============================================================
// 4. VISUAL RESTRAINT
// ============================================================

export const VISUAL_RESTRAINT_RULES = {
  colors: {
    maxAccentColors: 2,
    primary: 'hsl(var(--primary))', // Myndighetsblå
    secondary: 'hsl(var(--secondary))', // Neutral grå
    rule: 'Gråskala för allt utom primär action',
  },
  gradients: {
    allowed: false,
    exception: 'Endast om gradienten representerar data (t.ex. heatmap)',
  },
  text: {
    forbidden: ['Utropstecken', 'Emojis', 'Laddade ord', 'Superlativ'],
    required: ['Neutralt språk', 'Exakta termer', 'Mätbara påståenden'],
  },
  rule: 'Saklighet = auktoritet.',
} as const;

// ============================================================
// 5. TYPOGRAPHY & READABILITY
// ============================================================

export const TYPOGRAPHY_RULES = {
  fontFamilies: 1, // Max en font family
  hierarchy: {
    h1: { size: '2.25rem', weight: 600, usage: 'Sidtitel, en per vy' },
    h2: { size: '1.5rem', weight: 600, usage: 'Sektioner' },
    h3: { size: '1.25rem', weight: 500, usage: 'Undersektioner' },
    body: { size: '1rem', weight: 400, usage: 'Brödtext' },
    small: { size: '0.875rem', weight: 400, usage: 'Metadata, hjälptext' },
    caption: { size: '0.75rem', weight: 400, usage: 'Timestamps, källhänvisningar' },
  },
  spacing: {
    principle: 'Luft, luft, luft',
    rule: 'Om något känns trångt → ta bort något',
    minLineHeight: 1.5,
    minParagraphSpacing: '1rem',
  },
  reference: 'Telia.se är skolexempel',
} as const;

// ============================================================
// 6. NAVIGATION CONSISTENCY
// ============================================================

export const NAVIGATION_RULES = {
  requirements: [
    'Samma menystruktur överallt',
    'Samma beteende på mobil & desktop',
    'Inga "smarta" dolda funktioner',
    'Breadcrumbs på alla djupa vyer',
    'Aktiv route alltid markerad',
  ],
  userGuarantees: [
    'Aldrig undra var något finns',
    'Aldrig bli osäker på var man är',
    'Alltid kunna gå tillbaka',
    'Alltid se var man kom ifrån',
  ],
  rule: 'Konsistens > kreativitet.',
} as const;

// ============================================================
// 7. COPY PRECISION
// ============================================================

export interface CopyRule {
  readonly category: string;
  readonly bad: string;
  readonly good: string;
  readonly reason: string;
}

export const COPY_RULES: readonly CopyRule[] = [
  { category: 'CTA', bad: 'Upptäck hur världen förändras', good: 'Visa utveckling över tid', reason: 'Beskrivande, inte säljande' },
  { category: 'Error', bad: 'Hoppsan! Något gick fel', good: 'Data kunde inte laddas', reason: 'Exakt, inte personligt' },
  { category: 'Success', bad: 'Fantastiskt! Du har sparat!', good: 'Sparat', reason: 'Bekräftande, inte överdriven' },
  { category: 'Empty state', bad: 'Inget att se här ännu...', good: 'Ingen data för vald period', reason: 'Förklarande, inte nedlåtande' },
  { category: 'Loading', bad: 'Vänta lite...', good: 'Laddar data', reason: 'Status, inte ursäkt' },
  { category: 'Action', bad: 'Klicka här för att lära dig mer!', good: 'Läs mer om metod', reason: 'Direkt, inte uppmanande' },
] as const;

export const COPY_PRINCIPLE = 'Språk ska inte sälja. Det ska förklara.';

// ============================================================
// 8. ERROR STATES THAT BUILD TRUST
// ============================================================

export interface ErrorTemplate {
  readonly type: string;
  readonly structure: {
    readonly whatHappened: string;
    readonly whatDidNotHappen: string;
    readonly whatUserCanDo: string;
  };
  readonly example: string;
}

export const ERROR_TEMPLATES: readonly ErrorTemplate[] = [
  {
    type: 'data_load_failure',
    structure: {
      whatHappened: 'Denna data kunde inte laddas just nu.',
      whatDidNotHappen: 'Inga inställningar har ändrats.',
      whatUserCanDo: 'Försök igen eller kontakta support om problemet kvarstår.',
    },
    example: 'Denna data kunde inte laddas just nu.\nInga inställningar har ändrats.\nFörsök igen.',
  },
  {
    type: 'save_failure',
    structure: {
      whatHappened: 'Dina ändringar kunde inte sparas.',
      whatDidNotHappen: 'Din data finns fortfarande lokalt.',
      whatUserCanDo: 'Kontrollera din anslutning och försök igen.',
    },
    example: 'Dina ändringar kunde inte sparas.\nDin data finns fortfarande lokalt.\nKontrollera anslutning.',
  },
  {
    type: 'auth_failure',
    structure: {
      whatHappened: 'Du kunde inte loggas in.',
      whatDidNotHappen: 'Inga uppgifter har sparats.',
      whatUserCanDo: 'Kontrollera dina uppgifter eller återställ lösenord.',
    },
    example: 'Du kunde inte loggas in.\nInga uppgifter har sparats.\nKontrollera uppgifter.',
  },
  {
    type: 'network_error',
    structure: {
      whatHappened: 'Anslutningen till servern bröts.',
      whatDidNotHappen: 'Dina senaste ändringar kan ha gått förlorade.',
      whatUserCanDo: 'Kontrollera din internetanslutning.',
    },
    example: 'Anslutningen bröts.\nSenaste ändringar kan ha gått förlorade.\nKontrollera internet.',
  },
] as const;

export const ERROR_PRINCIPLE = 'Transparens även i fel = förtroende.';

// ============================================================
// 9. SETTINGS & PAYMENT FLOWS
// ============================================================

export const PAYMENT_UX_RULES = {
  requirements: [
    'Extremt tydliga priser',
    'Aldrig kännas som en fälla',
    'Alltid visa vad som ingår',
    'Alltid visa vad som INTE ingår',
    'Enkel avbrytning',
    'Ingen dark pattern',
  ],
  principle: 'Ingen ska ångra ett klick.',
  reference: 'Telia.se betalflöde',
  forbiddenPatterns: [
    'Dolda kostnader',
    'Pre-selected add-ons',
    'Svår avbrytning',
    'Countdown-timers',
    'Fake scarcity',
    'Guilt-tripping copy',
  ],
} as const;

// ============================================================
// 10. CRISP REVIEW CHECKLIST
// ============================================================

export interface CrispCheckItem {
  readonly id: string;
  readonly question: string;
  readonly failAction: string;
  readonly category: 'stability' | 'clarity' | 'trust' | 'usability';
}

export const CRISP_CHECKLIST: readonly CrispCheckItem[] = [
  { id: 'CC_01', question: 'Känns den stabil?', failAction: 'Minska animationer, öka kontrast', category: 'stability' },
  { id: 'CC_02', question: 'Känns den självklar?', failAction: 'Förenkla navigation, tydligare labels', category: 'clarity' },
  { id: 'CC_03', question: 'Kan man använda den utan instruktion?', failAction: 'Lägg till inline hjälp, förbättra affordance', category: 'usability' },
  { id: 'CC_04', question: 'Skulle en myndighet våga använda detta?', failAction: 'Öka formell ton, ta bort informellt språk', category: 'trust' },
  { id: 'CC_05', question: 'Skulle en bank våga använda detta?', failAction: 'Öka säkerhetskänsla, tydligare bekräftelser', category: 'trust' },
  { id: 'CC_06', question: 'Finns det något som kan tas bort?', failAction: 'Kör remove-pass', category: 'clarity' },
] as const;

// ============================================================
// 11. REMOVE PASS
// ============================================================

export const REMOVE_PASS_TARGETS = {
  buttons: {
    question: 'Behövs denna knapp verkligen?',
    alternatives: ['Kombinera med annan action', 'Flytta till overflow-meny', 'Ta bort helt'],
  },
  text: {
    question: 'Kan detta sägas med färre ord?',
    alternatives: ['Korta ner', 'Ersätt med ikon', 'Ta bort helt'],
  },
  visualElements: {
    question: 'Tillför detta element förståelse?',
    alternatives: ['Förenkla', 'Byt till enklare variant', 'Ta bort helt'],
  },
  features: {
    question: 'Används denna funktion?',
    alternatives: ['Flytta till advanced', 'Dölj bakom toggle', 'Ta bort helt'],
  },
  rule: 'Varje borttagning ökar kvaliteten.',
} as const;

// ============================================================
// 12. FINAL GOAL
// ============================================================

export const INFRASTRUCTURE_GOAL = {
  feeling: 'Det här är inte ett projekt. Det här är infrastruktur.',
  references: ['Telia', 'Skatteverket', 'Amazon AWS Console'],
  characteristics: [
    'Stabilt',
    'Förutsägbart',
    'Pålitligt',
    'Professionellt',
    'Tidlöst',
  ],
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function validateCopy(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (text.includes('!')) issues.push('Innehåller utropstecken');
  if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) issues.push('Innehåller emoji');
  if (/fantastisk|otrolig|wow|häftig/i.test(text)) issues.push('Innehåller laddade ord');
  if (/bäst|störst|först|unik/i.test(text)) issues.push('Innehåller superlativ');
  
  return { valid: issues.length === 0, issues };
}

export function getCrispScore(answers: Record<string, boolean>): number {
  const passed = CRISP_CHECKLIST.filter(item => answers[item.id]).length;
  return Math.round((passed / CRISP_CHECKLIST.length) * 100);
}

export function getErrorMessage(type: string): ErrorTemplate | undefined {
  return ERROR_TEMPLATES.find(t => t.type === type);
}

export function shouldRemove(element: 'button' | 'text' | 'visual' | 'feature', usagePercent: number): boolean {
  const thresholds = { button: 5, text: 10, visual: 15, feature: 3 };
  return usagePercent < thresholds[element];
}
