/**
 * MASTER EXECUTION BLOCK 24
 * TELIA / AMAZON UI DECONSTRUCTION → IMPLEMENTATION RULES
 * 
 * Mål: Återskapa känslan "Det här systemet är stabilare än jag själv."
 * Fokus: Kontroll över användarens mentala energi.
 */

// ============================================================
// CORE: WHY TELIA FEELS RIGHT
// ============================================================

export const TELIA_CORE_PRINCIPLES = {
  keyAchievements: [
    'Total förutsägbarhet',
    'Omedelbar respons',
    'Ingen kognitiv belastning',
  ],
  insight: 'Det är inte snygghet. Det är kontroll över användarens mentala energi.',
  targetFeeling: 'Det här systemet är stabilare än jag själv.',
} as const;

// ============================================================
// PRINCIPLE 1: NOTHING IS SURPRISING
// ============================================================

export interface PredictabilityRule {
  readonly id: string;
  readonly rule: string;
  readonly test: string;
  readonly failAction: string;
}

export const PREDICTABILITY_RULES: readonly PredictabilityRule[] = [
  { id: 'P1_01', rule: 'Klick leder alltid till exakt det man förväntar sig', test: 'Visa label till 5 personer, fråga vad som händer', failAction: 'Byt label' },
  { id: 'P1_02', rule: 'Inga smarta genvägar', test: 'Finns dolda shortcuts?', failAction: 'Ta bort eller gör explicita' },
  { id: 'P1_03', rule: 'Inga dolda lager', test: 'Finns info som kräver hover/extra klick?', failAction: 'Visa direkt eller ta bort' },
  { id: 'P1_04', rule: 'Ingen ikon utan text', test: 'Finns standalone ikoner?', failAction: 'Lägg till label' },
  { id: 'P1_05', rule: 'Ingen text utan handling', test: 'Finns CTA:er som inte gör något tydligt?', failAction: 'Byt till beskrivande verb' },
] as const;

export const PREDICTABILITY_MASTER_RULE = 'Om man kan missförstå → det är fel.';

// ============================================================
// PRINCIPLE 2: STRUCTURE BEFORE CONTENT
// ============================================================

export interface SkeletonRequirement {
  readonly component: string;
  readonly skeletonType: 'lines' | 'cards' | 'table' | 'chart' | 'map' | 'text';
  readonly showImmediately: boolean;
  readonly fillBehavior: 'progressive' | 'instant' | 'fade';
}

export const SKELETON_REQUIREMENTS: readonly SkeletonRequirement[] = [
  { component: 'KPICard', skeletonType: 'cards', showImmediately: true, fillBehavior: 'fade' },
  { component: 'DataTable', skeletonType: 'table', showImmediately: true, fillBehavior: 'progressive' },
  { component: 'LineChart', skeletonType: 'chart', showImmediately: true, fillBehavior: 'progressive' },
  { component: 'GlobalMap', skeletonType: 'map', showImmediately: true, fillBehavior: 'progressive' },
  { component: 'TextBlock', skeletonType: 'lines', showImmediately: true, fillBehavior: 'fade' },
  { component: 'StatNumber', skeletonType: 'text', showImmediately: true, fillBehavior: 'instant' },
] as const;

export const AMAZON_SPINNER_RULE = 'Never show a spinner if you can show structure.';

// ============================================================
// PRINCIPLE 3: EVERYTHING FEELS FAST
// ============================================================

export interface PerceivedSpeedTechnique {
  readonly technique: string;
  readonly trigger: string;
  readonly implementation: string;
  readonly expectedGain: string;
}

export const PERCEIVED_SPEED_TECHNIQUES: readonly PerceivedSpeedTechnique[] = [
  { technique: 'Preload on hover', trigger: 'mouseenter på nav-länk', implementation: 'prefetchQuery eller dynamic import', expectedGain: '200-500ms besparing' },
  { technique: 'Preload on scroll', trigger: 'Element närmar sig viewport', implementation: 'IntersectionObserver + prefetch', expectedGain: 'Seamless scroll-to-section' },
  { technique: 'Cache last selection', trigger: 'Användaren byter vy', implementation: 'localStorage + React Query staleTime', expectedGain: 'Instant tillbaka-navigering' },
  { technique: 'Optimistic filter', trigger: 'Filter-ändring', implementation: 'useMutation optimisticUpdate', expectedGain: 'Omedelbar feedback' },
  { technique: 'Predictive fetch', trigger: 'Vanlig användarresa', implementation: 'Preload nästa 2 sannolika vyer', expectedGain: 'Zero perceived latency' },
] as const;

export const HUMAN_PERCEPTION_RULE = 'Människan mäter respons, inte millisekunder.';

// ============================================================
// PRINCIPLE 4: VISUAL SILENCE
// ============================================================

export interface ColorUsageRule {
  readonly purpose: string;
  readonly allowed: boolean;
  readonly examples: readonly string[];
}

export const COLOR_USAGE_RULES: readonly ColorUsageRule[] = [
  { purpose: 'Nivå/status', allowed: true, examples: ['Grön = bra trend', 'Röd = varning', 'Grå = neutral'] },
  { purpose: 'Förändring', allowed: true, examples: ['Blå = ökning', 'Orange = minskning'] },
  { purpose: 'Varning/error', allowed: true, examples: ['Röd bakgrund', 'Gul kant'] },
  { purpose: 'Dekoration', allowed: false, examples: ['Gradients för "snygghet"', 'Färg på rubriker', 'Accentfärg utan mening'] },
  { purpose: 'Branding', allowed: false, examples: ['Färgglada ikoner', 'Dekorativa linjer'] },
] as const;

export const VISUAL_SILENCE_RULE = 'Tyst UI = auktoritet.';

// ============================================================
// PRINCIPLE 5: TEXT THAT NEVER BRAGS
// ============================================================

export interface CopyTransformation {
  readonly category: string;
  readonly before: string;
  readonly after: string;
  readonly reason: string;
}

export const COPY_TRANSFORMATIONS: readonly CopyTransformation[] = [
  { category: 'CTA', before: 'Få insikter', after: 'Visa utveckling', reason: 'Beskriver handling, inte löfte' },
  { category: 'CTA', before: 'Upptäck samband', after: 'Jämför indikatorer', reason: 'Konkret, inte mystifierande' },
  { category: 'Heading', before: 'Kraftfull analys', after: 'Analysverktyg', reason: 'Neutralt, inte säljande' },
  { category: 'Empty state', before: 'Börja utforska!', after: 'Välj ett land för att visa data', reason: 'Instruktion, inte uppmaning' },
  { category: 'Success', before: 'Fantastiskt! Du är klar!', after: 'Sparat', reason: 'Bekräftelse, inte firande' },
  { category: 'Feature', before: 'Unik AI-driven analys', after: 'Automatisk jämförelse', reason: 'Funktion, inte magi' },
] as const;

export const COPY_MASTER_RULE = 'All marknadsretorik bort.';

// ============================================================
// PRINCIPLE 6: ERRORS THAT BUILD TRUST
// ============================================================

export interface ErrorStateStructure {
  readonly type: string;
  readonly whatHappened: string;
  readonly whatWasNotAffected: string;
  readonly nextStep: string;
  readonly tone: 'calm' | 'informative' | 'helpful';
}

export const ERROR_STATE_EXAMPLES: readonly ErrorStateStructure[] = [
  {
    type: 'data_load',
    whatHappened: 'Data för denna period kunde inte hämtas.',
    whatWasNotAffected: 'Dina sparade vyer är intakta.',
    nextStep: 'Försök igen eller välj en annan period.',
    tone: 'calm',
  },
  {
    type: 'save_failed',
    whatHappened: 'Dina ändringar kunde inte sparas till servern.',
    whatWasNotAffected: 'Dina ändringar finns kvar lokalt.',
    nextStep: 'Kontrollera din anslutning och försök igen.',
    tone: 'informative',
  },
  {
    type: 'auth_expired',
    whatHappened: 'Din session har löpt ut.',
    whatWasNotAffected: 'Dina senaste ändringar har sparats automatiskt.',
    nextStep: 'Logga in igen för att fortsätta.',
    tone: 'helpful',
  },
] as const;

export const ERROR_MASTER_RULE = 'Fel utan panik = mognad.';

// ============================================================
// PRINCIPLE 7: PAYMENT WITHOUT ANXIETY
// ============================================================

export interface PaymentPrinciple {
  readonly principle: string;
  readonly implementation: string;
  readonly antiPattern: string;
}

export const PAYMENT_PRINCIPLES: readonly PaymentPrinciple[] = [
  { principle: 'Inga överraskningar', implementation: 'Visa totalpris innan checkout', antiPattern: 'Dolda avgifter' },
  { principle: 'Allt framgår innan köp', implementation: 'Feature-jämförelse på pricing-sida', antiPattern: 'Vag "kontakta oss" för pris' },
  { principle: 'Känns rimligt', implementation: 'Kontextualisera pris mot värde', antiPattern: 'Anchor pricing tricks' },
  { principle: 'Betala = kontroll, inte sanning', implementation: 'Paid ger verktyg, inte mer data', antiPattern: 'Exklusiva insikter för betalande' },
] as const;

export const PAYMENT_MASTER_RULE = 'Ingen ska känna sig lurad.';

// ============================================================
// PRINCIPLE 8: MOBILE IS ADULT
// ============================================================

export interface MobileParityRule {
  readonly feature: string;
  readonly mobileImplementation: string;
  readonly notAllowed: string;
}

export const MOBILE_PARITY_RULES: readonly MobileParityRule[] = [
  { feature: 'Grafer', mobileImplementation: 'Touch-optimerad med pinch-zoom', notAllowed: '"Se på desktop för full graf"' },
  { feature: 'Kartor', mobileImplementation: 'Swipe-navigering, tap för detalj', notAllowed: '"Kartan fungerar bäst på desktop"' },
  { feature: 'Filter', mobileImplementation: 'Bottom sheet eller modal', notAllowed: 'Gömd i burger-meny' },
  { feature: 'Export', mobileImplementation: 'Native share sheet', notAllowed: '"Exportera på desktop"' },
  { feature: 'Jämförelser', mobileImplementation: 'Swipe mellan länder', notAllowed: 'Side-by-side only' },
] as const;

export const MOBILE_MASTER_RULE = 'Mobil är ofta beslutsplattform.';

// ============================================================
// PRINCIPLE 9: NO WOW MOMENTS
// ============================================================

export interface AnimationRule {
  readonly type: string;
  readonly allowed: boolean;
  readonly purpose: string | null;
  readonly maxDuration: number | null;
}

export const ANIMATION_RULES: readonly AnimationRule[] = [
  { type: 'Page transition', allowed: true, purpose: 'Orienteringshjälp', maxDuration: 200 },
  { type: 'Data loading', allowed: true, purpose: 'Progress-indikation', maxDuration: 300 },
  { type: 'Hover feedback', allowed: true, purpose: 'Interaktionsbekräftelse', maxDuration: 150 },
  { type: 'Chart animation', allowed: true, purpose: 'Dataförståelse', maxDuration: 500 },
  { type: 'Decorative entrance', allowed: false, purpose: null, maxDuration: null },
  { type: 'Parallax effects', allowed: false, purpose: null, maxDuration: null },
  { type: 'Attention-grabbing', allowed: false, purpose: null, maxDuration: null },
] as const;

export const WOW_MASTER_RULE = 'Wow skapar osäkerhet. Systemet ska fungera, inte imponera.';

// ============================================================
// FINAL TEST: INSTITUTIONAL TRUST
// ============================================================

export interface InstitutionalTest {
  readonly institution: string;
  readonly question: string;
  readonly failCriteria: readonly string[];
}

export const INSTITUTIONAL_TESTS: readonly InstitutionalTest[] = [
  {
    institution: 'Skatteverket',
    question: 'Skulle Skatteverket våga använda detta?',
    failCriteria: ['Informell ton', 'Oklara källor', 'Spekulativa påståenden'],
  },
  {
    institution: 'Bank',
    question: 'Skulle en bank våga använda detta?',
    failCriteria: ['Osäker känsla', 'Oklara bekräftelser', 'Tvetydig feedback'],
  },
  {
    institution: 'Krismyndighet',
    question: 'Skulle en krismyndighet våga använda detta?',
    failCriteria: ['Långsam respons', 'Komplex navigation', 'Otydlig prioritering'],
  },
  {
    institution: 'Under stress',
    question: 'Skulle det fungera under stress?',
    failCriteria: ['Kräver koncentration', 'Många steg', 'Oklara felmeddelanden'],
  },
] as const;

// ============================================================
// IMPLEMENTATION CHECKLIST (FOR TEAMS)
// ============================================================

export interface ImplementationCheckItem {
  readonly id: string;
  readonly task: string;
  readonly priority: 'critical' | 'high' | 'medium';
  readonly team: 'frontend' | 'design' | 'content' | 'all';
}

export const IMPLEMENTATION_CHECKLIST: readonly ImplementationCheckItem[] = [
  { id: 'IC_01', task: 'Skeleton UI på alla datadrivna komponenter', priority: 'critical', team: 'frontend' },
  { id: 'IC_02', task: 'Preload nästa sannolika vy', priority: 'high', team: 'frontend' },
  { id: 'IC_03', task: 'Ta bort alla dekorativa färger', priority: 'critical', team: 'design' },
  { id: 'IC_04', task: 'Ersätt pitch-copy med beskrivningar', priority: 'critical', team: 'content' },
  { id: 'IC_05', task: 'Implementera 3-stegs error states', priority: 'high', team: 'frontend' },
  { id: 'IC_06', task: 'Verifiera mobil-paritet för alla features', priority: 'high', team: 'all' },
  { id: 'IC_07', task: 'Granska paid-flöde för dark patterns', priority: 'critical', team: 'all' },
  { id: 'IC_08', task: 'Ta bort minst 10% UI-element', priority: 'medium', team: 'design' },
  { id: 'IC_09', task: 'Kör institutionella tester', priority: 'high', team: 'all' },
  { id: 'IC_10', task: 'Verifiera att alla ikoner har labels', priority: 'medium', team: 'design' },
] as const;

// ============================================================
// FINAL FEELING
// ============================================================

export const FINAL_FEELING = {
  userThought: 'Det här är inte en sajt. Det här är ett system.',
  reference: 'Exakt den känslan man får på Telia.se.',
  achieved_when: [
    'Ingen animation utan syfte',
    'Ingen färg utan mening',
    'Ingen text utan handling',
    'Ingen feature utan nytta',
  ],
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function runInstitutionalTest(
  answers: Record<string, boolean>
): { passed: boolean; failures: readonly InstitutionalTest[] } {
  const failures = INSTITUTIONAL_TESTS.filter(test => !answers[test.institution]);
  return { passed: failures.length === 0, failures };
}

export function getChecklistByTeam(team: string): readonly ImplementationCheckItem[] {
  return IMPLEMENTATION_CHECKLIST.filter(item => item.team === team || item.team === 'all');
}

export function isAnimationAllowed(type: string): boolean {
  const rule = ANIMATION_RULES.find(r => r.type === type);
  return rule?.allowed ?? false;
}

export function isColorUsageAllowed(purpose: string): boolean {
  const rule = COLOR_USAGE_RULES.find(r => r.purpose === purpose);
  return rule?.allowed ?? false;
}
