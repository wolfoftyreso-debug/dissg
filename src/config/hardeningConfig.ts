/**
 * Hardening Configuration
 * 
 * 🔥 FINAL HARDENING PLAYBOOK
 * "MAKE IT A MONSTER" - Operational checklist
 */

// ============================================
// TEST CHECKLIST (Per tier, per view)
// ============================================

export const TIER_TEST_CHECKLIST = {
  viewChecklist: [
    { key: 'immediate_understanding', text: { en: 'User immediately understands what they see', sv: 'Användaren förstår omedelbart vad de ser' } },
    { key: 'what_this_is', text: { en: 'Clear "what this is / is not" text visible', sv: 'Tydlig "vad detta är / inte är"-text synlig' } },
    { key: 'drilldown', text: { en: 'Can click deeper everywhere', sv: 'Kan klicka sig djupare överallt' } },
    { key: 'source_method_uncertainty', text: { en: 'Source + method + uncertainty always visible', sv: 'Källa + metod + osäkerhet alltid synlig' } },
    { key: 'no_dead_ends', text: { en: 'No dead ends in navigation', sv: 'Inga döda ändar i navigation' } },
    { key: 'lock_clarity', text: { en: 'Locked features clearly explain why', sv: 'Låsta funktioner förklarar tydligt varför' } },
  ],
  
  rule: {
    en: 'If a new user can misinterpret a number in 10 seconds → FAIL → adjust copy/UX',
    sv: 'Om en ny användare kan misstolka en siffra på 10 sekunder → FAIL → justera copy/UX'
  },
  
  tiers: ['guest', 'observer', 'analyst', 'institutional'] as const,
};

// ============================================
// SECURITY TEST CHECKLIST
// ============================================

export const SECURITY_TESTS = [
  { key: 'url_manipulation', text: { en: 'URL manipulation fails silently', sv: 'URL-manipulering misslyckas tyst' } },
  { key: 'api_without_scope', text: { en: 'API calls without proper scope rejected', sv: 'API-anrop utan rätt scope avvisas' } },
  { key: 'views_without_role', text: { en: 'Loading views without role fails correctly', sv: 'Laddning av vyer utan roll misslyckas korrekt' } },
  { key: 'auth_bypass', text: { en: 'Cannot bypass authentication', sv: 'Kan inte kringgå autentisering' } },
  { key: 'rls_policies', text: { en: 'RLS policies enforced on all tables', sv: 'RLS-policyer tillämpas på alla tabeller' } },
  { key: 'webhook_verification', text: { en: 'Stripe webhooks verified with signature', sv: 'Stripe webhooks verifierade med signatur' } },
];

// ============================================
// STRIPE INTEGRATION CHECKLIST
// ============================================

export const STRIPE_CHECKLIST = {
  products: [
    { id: 'observer_free', name: 'Observer', price: 0, active: true },
    { id: 'analyst_monthly', name: 'Analyst Monthly', price: 199, active: true },
    { id: 'analyst_yearly', name: 'Analyst Yearly', price: 1990, active: true },
    { id: 'institutional_custom', name: 'Institutional', price: null, active: false }, // Off-Stripe
  ],
  
  webhookEvents: [
    'checkout.session.completed',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'customer.subscription.paused',
    'customer.subscription.resumed',
  ],
  
  flows: {
    paymentSuccess: [
      'Upgrade tier in database',
      'Unlock features immediately',
      'Create audit log entry',
      'Send confirmation email',
    ],
    paymentFailed: [
      'Set status to past_due',
      'Start grace period (14 days)',
      'Show UI warning',
      'Schedule retry attempts',
      'Downgrade to Observer after grace period',
    ],
  },
  
  legalRequirements: [
    'Terms of Service acceptance',
    'Responsibility clause acceptance',
    'Scenario disclaimer (for Analyst+)',
    'Data usage policy acceptance',
  ],
};

// ============================================
// PERFORMANCE REQUIREMENTS
// ============================================

export const PERFORMANCE_REQUIREMENTS = {
  loadTests: {
    expectedTrafficMultiplier: 10,
    apiBurstSimulation: true,
    concurrentScenarioRuns: true,
  },
  
  fallbacks: {
    apiDown: {
      action: 'Show last known data',
      indicator: 'Clear stale data flag',
    },
    aiTimeout: {
      action: 'Show static analysis',
      indicator: 'AI unavailable notice',
    },
    stripeDown: {
      action: 'Read-only mode',
      indicator: 'Purchases temporarily disabled',
    },
  },
  
  targets: {
    pageLoad: 2000, // ms
    apiResponse: 500, // ms
    databaseQuery: 100, // ms
  },
};

// ============================================
// UX REQUIREMENTS (Monster feel)
// ============================================

export const MONSTER_UX = {
  shouldFeel: ['fast', 'calm', 'clinical', 'exact'],
  shouldNotFeel: ['hype', 'marketing', 'colorful arrows', 'opinion'],
  
  forbidden: [
    'Distracting animations',
    'Emojis in analysis views',
    'Insights you should know',
    'Call-to-action in analysis views',
    'Gamification elements',
    'Achievement badges',
    'Social sharing prompts',
    'Newsletter popups',
    'Cookie consent overload',
  ],
  
  required: [
    'Source attribution on all data',
    'Uncertainty indicators',
    'Method documentation links',
    'Clear tier indication',
    'Obvious locked state',
  ],
};

// ============================================
// FINAL MONSTER CHECK
// ============================================

export const MONSTER_CHECKLIST = [
  { key: 'all_tiers_tested', text: 'All tiers tested hands-on' },
  { key: 'no_misinterpretation', text: 'Nothing can be misinterpreted quickly' },
  { key: 'payment_flow', text: 'Payment → unlock → downgrade works perfectly' },
  { key: 'stripe_secure', text: 'Stripe flows are bomb-secure' },
  { key: 'price_feels_right', text: 'Price feels "ouch" but reasonable' },
  { key: 'free_tier_generous', text: 'Free tier is generous but powerless' },
  { key: 'paid_tier_serious', text: 'Paid tier feels heavy, serious, responsibility-requiring' },
  { key: 'can_be_silent', text: 'Team can be completely silent publicly' },
];

// ============================================
// LAUNCH READINESS SCORE
// ============================================

export function calculateLaunchReadiness(completedChecks: string[]): {
  score: number;
  percentage: number;
  ready: boolean;
  missing: string[];
} {
  const allChecks = MONSTER_CHECKLIST.map(c => c.key);
  const completed = completedChecks.filter(c => allChecks.includes(c));
  const missing = allChecks.filter(c => !completedChecks.includes(c));
  
  const score = completed.length;
  const percentage = Math.round((score / allChecks.length) * 100);
  const ready = percentage === 100;
  
  return { score, percentage, ready, missing };
}
