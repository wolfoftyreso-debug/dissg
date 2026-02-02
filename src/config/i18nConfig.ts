/**
 * 🌍 MASTER EXECUTION BLOCK 32
 * GLOBAL I18N / L10N ARCHITECTURE (MISSION-CRITICAL)
 * 
 * MÅL (OBRYTBARA):
 * - Språket ska alltid vara korrekt
 * - Inget innehåll ska visas utan att ha passerat översättning
 * - Översättningar ska testas automatiskt varje natt
 * - Samma sanning, samma metod, alla språk
 * 
 * "Ni behandlar språk som infrastruktur, inte som presentation."
 */

// ============================================================
// TYPES
// ============================================================

export type SupportedLanguage = 'en' | 'sv' | 'de' | 'fr' | 'es' | 'fi' | 'no' | 'da';

export type TranslationStatus = 
  | 'untranslated'
  | 'machine_translated'
  | 'semantically_verified'
  | 'rule_checked'
  | 'approved'
  | 'flagged';

export type DetectionMethod = 
  | 'url_override'
  | 'user_preference'
  | 'accept_language'
  | 'geo_ip'
  | 'default';

export interface TranslationKey {
  readonly key: string;
  readonly context: string;
  readonly constraints: readonly string[];
  readonly category: TranslationCategory;
}

export type TranslationCategory = 
  | 'ui'
  | 'analysis'
  | 'report'
  | 'error'
  | 'tooltip'
  | 'pdf'
  | 'api'
  | 'legal';

export interface LanguageRule {
  readonly language: SupportedLanguage;
  readonly forbidden_causal: readonly string[];
  readonly forbidden_value_loaded: readonly string[];
  readonly forbidden_imperative: readonly string[];
}

export interface TranslationEntry {
  readonly key: string;
  readonly translations: Record<SupportedLanguage, string | null>;
  readonly status: Record<SupportedLanguage, TranslationStatus>;
  readonly context: string;
  readonly constraints: readonly string[];
  readonly last_verified: string;
  readonly version: number;
}

// ============================================================
// 1. AUTO-DETECTION (PRIORITY ORDER - FIXED)
// ============================================================

export const LANGUAGE_DETECTION_PRIORITY: readonly DetectionMethod[] = [
  'url_override',        // 1. ?lang=xx
  'user_preference',     // 2. Inloggad användares val
  'accept_language',     // 3. Browser / OS
  'geo_ip',              // 4. Endast fallback
  'default',             // 5. Engelska
] as const;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_DETECTION_CONFIG = {
  url_param: 'lang',
  cookie_name: 'preferred_language',
  storage_key: 'user_language_preference',
  geo_ip_enabled: true,
  remember_choice: true,
} as const;

// ============================================================
// 2. ALL TEXT = LOOSE CODES (NOTHING HARDCODED)
// ============================================================

export const TEXT_SOURCE_RULES = {
  /**
   * 0 strängar hårdkodade i UI
   * All text hämtas via t(key, context)
   */
  zero_hardcoded_strings: true,
  
  required_categories: [
    'headings',
    'buttons',
    'tooltips',
    'warnings',
    'error_states',
    'pdf_texts',
    'api_texts',
    'legal_texts',
  ] as const,
  
  translation_function: 't(key, context)',
  
  fallback_behavior: 'english_with_flag',
} as const;

// ============================================================
// 3. CONTEXT-AWARE TRANSLATION (CRITICAL)
// ============================================================

export const TRANSLATION_CONTEXT_REQUIREMENTS = {
  /**
   * Varje översättningsnyckel måste ha kontext
   * Samma ord kan inte återanvändas i olika kontexter utan explicit tillåtelse
   */
  require_context: true,
  require_constraints: true,
  allow_context_reuse: false,
  
  example_entry: {
    key: 'correlation.notice',
    context: 'non-causal statistical explanation',
    constraints: ['no causality language', 'neutral tone'],
  },
} as const;

// ============================================================
// 4. TRANSLATION PIPELINE (AUTOMATED)
// ============================================================

export const TRANSLATION_PIPELINE = {
  stages: [
    {
      order: 1,
      name: 'untranslated',
      description: 'Ny text → märks untranslated',
      automated: true,
    },
    {
      order: 2,
      name: 'machine_translation',
      description: 'Maskinöversättning (primär)',
      automated: true,
      provider: 'deepl', // or similar high-quality provider
    },
    {
      order: 3,
      name: 'semantic_check',
      description: 'Semantisk kontroll (AI)',
      automated: true,
      ai_model: 'google/gemini-2.5-flash',
    },
    {
      order: 4,
      name: 'rule_check',
      description: 'Regelkontroll (no causality, no sentiment)',
      automated: true,
    },
    {
      order: 5,
      name: 'approved',
      description: 'Godkänd → publicerad',
      automated: false,
      requires_human: true,
    },
  ] as const,
  
  failure_behavior: {
    on_deviation: 'fallback_to_english',
    flag_for_review: true,
    block_publish: false,
  },
  
  truth_baseline: 'en' as SupportedLanguage,
} as const;

// ============================================================
// 5. LANGUAGE RULES (HARD) - PER LANGUAGE
// ============================================================

export const LANGUAGE_RULES: readonly LanguageRule[] = [
  {
    language: 'sv',
    forbidden_causal: [
      'leder till',
      'orsakar',
      'resulterar i',
      'ger upphov till',
      'beror på',
      'förklaras av',
      'påverkar direkt',
    ],
    forbidden_value_loaded: [
      'bättre',
      'sämre',
      'lyckades',
      'misslyckades',
      'framgång',
      'bakslag',
      'positivt',
      'negativt',
    ],
    forbidden_imperative: [
      'bör',
      'måste',
      'ska',
      'rekommenderas',
      'gör',
      'undvik',
    ],
  },
  {
    language: 'en',
    forbidden_causal: [
      'leads to',
      'causes',
      'results in',
      'gives rise to',
      'is due to',
      'is explained by',
      'directly affects',
    ],
    forbidden_value_loaded: [
      'better',
      'worse',
      'succeeded',
      'failed',
      'success',
      'setback',
      'positive',
      'negative',
    ],
    forbidden_imperative: [
      'should',
      'must',
      'shall',
      'recommended',
      'do',
      'avoid',
    ],
  },
  {
    language: 'de',
    forbidden_causal: [
      'führt zu',
      'verursacht',
      'resultiert in',
      'bewirkt',
      'beruht auf',
      'erklärt sich durch',
    ],
    forbidden_value_loaded: [
      'besser',
      'schlechter',
      'gelungen',
      'gescheitert',
      'Erfolg',
      'Rückschlag',
      'positiv',
      'negativ',
    ],
    forbidden_imperative: [
      'sollte',
      'muss',
      'soll',
      'empfohlen',
      'vermeiden',
    ],
  },
  {
    language: 'fr',
    forbidden_causal: [
      'mène à',
      'cause',
      'résulte en',
      'provoque',
      'est dû à',
      's\'explique par',
    ],
    forbidden_value_loaded: [
      'meilleur',
      'pire',
      'réussi',
      'échoué',
      'succès',
      'échec',
      'positif',
      'négatif',
    ],
    forbidden_imperative: [
      'devrait',
      'doit',
      'recommandé',
      'éviter',
      'faire',
    ],
  },
  {
    language: 'es',
    forbidden_causal: [
      'lleva a',
      'causa',
      'resulta en',
      'provoca',
      'se debe a',
      'se explica por',
    ],
    forbidden_value_loaded: [
      'mejor',
      'peor',
      'exitoso',
      'fallido',
      'éxito',
      'fracaso',
      'positivo',
      'negativo',
    ],
    forbidden_imperative: [
      'debería',
      'debe',
      'recomendado',
      'evitar',
      'hacer',
    ],
  },
  {
    language: 'fi',
    forbidden_causal: [
      'johtaa',
      'aiheuttaa',
      'tuloksena',
      'johtuu',
      'selittyy',
    ],
    forbidden_value_loaded: [
      'parempi',
      'huonompi',
      'onnistui',
      'epäonnistui',
      'menestys',
      'takaisku',
    ],
    forbidden_imperative: [
      'pitäisi',
      'täytyy',
      'suositeltava',
      'vältä',
    ],
  },
  {
    language: 'no',
    forbidden_causal: [
      'fører til',
      'forårsaker',
      'resulterer i',
      'skyldes',
      'forklares av',
    ],
    forbidden_value_loaded: [
      'bedre',
      'verre',
      'lyktes',
      'mislyktes',
      'suksess',
      'tilbakeslag',
    ],
    forbidden_imperative: [
      'bør',
      'må',
      'skal',
      'anbefalt',
      'unngå',
    ],
  },
  {
    language: 'da',
    forbidden_causal: [
      'fører til',
      'forårsager',
      'resulterer i',
      'skyldes',
      'forklares af',
    ],
    forbidden_value_loaded: [
      'bedre',
      'værre',
      'lykkedes',
      'mislykkedes',
      'succes',
      'tilbageslag',
    ],
    forbidden_imperative: [
      'bør',
      'skal',
      'må',
      'anbefalet',
      'undgå',
    ],
  },
] as const;

// ============================================================
// 6. NIGHTLY VALIDATION (CRON JOB)
// ============================================================

export const NIGHTLY_VALIDATION_CONFIG = {
  schedule: '0 3 * * *', // 03:00 every night
  
  checks: [
    {
      id: 'missing_translations',
      name: 'Saknade översättningar',
      severity: 'critical',
      block_deploy: true,
    },
    {
      id: 'semantic_deviation',
      name: 'Avvikande betydelse vs engelska',
      severity: 'critical',
      block_deploy: true,
    },
    {
      id: 'text_overflow',
      name: 'För långa texter (layout-break)',
      severity: 'warning',
      block_deploy: false,
    },
    {
      id: 'forbidden_words',
      name: 'Förbjudna ord',
      severity: 'critical',
      block_deploy: true,
    },
    {
      id: 'terminology_drift',
      name: 'Terminologi-drift',
      severity: 'warning',
      block_deploy: false,
    },
  ] as const,
  
  scope: {
    render_all_pages: true,
    for_all_languages: true,
    for_all_key_views: true,
  },
  
  on_critical_failure: {
    generate_report: true,
    block_deployment: true,
    auto_rollback: true,
    notify_language_owners: true,
  },
  
  principle: 'Inget språk får degradera systemets korrekthet',
} as const;

// ============================================================
// 7. PDF & REPORTS (SPECIAL PROTECTION)
// ============================================================

export const PDF_I18N_CONFIG = {
  rules: {
    generate_per_language: true,
    same_statement_id: true,
    same_data: true,
    same_method: true,
    only_text_changes: true,
  },
  
  footer_requirements: [
    'language_code',
    'version',
    'verify_url',
    'qr_code',
    'translation_version',
  ] as const,
  
  verification: {
    cross_language_comparison: true,
    semantic_equivalence_check: true,
    statement_id_tracking: true,
  },
  
  principle: 'Det ska gå att verifiera att två PDF:er på olika språk betyder samma sak',
} as const;

// ============================================================
// 8. API & I18N
// ============================================================

export const API_I18N_CONFIG = {
  response_fields: {
    language: true,
    fallback_language: true,
    translation_version: true,
  },
  
  request_handling: {
    accept_language_header: true,
    query_param: 'lang',
    default_if_missing: 'en' as SupportedLanguage,
  },
  
  principle: 'API är aldrig språklöst',
} as const;

// ============================================================
// 9. TRANSLATION REGRESSION TESTING
// ============================================================

export const REGRESSION_TESTING_CONFIG = {
  triggers: [
    'method_change',
    'text_change',
    'rule_change',
  ] as const,
  
  check_question: 'Har detta ändrat betydelsen i något språk?',
  
  on_semantic_change: {
    flag: true,
    require_manual_review: true,
    block_deploy: true,
  },
  
  principle: 'Språkdrift = sanningsdrift',
} as const;

// ============================================================
// 10. ORGANIZATION & RESPONSIBILITY
// ============================================================

export interface LanguageOwner {
  readonly language: SupportedLanguage;
  readonly role: 'language_owner';
  readonly responsibilities: readonly string[];
}

export const TRANSLATION_ROLES = {
  language_owner: {
    description: 'Ansvarig för ett specifikt språk',
    responsibilities: [
      'Godkänna översättningar',
      'Granska semantisk korrekthet',
      'Uppdatera terminologi',
    ],
  },
  
  translation_qa: {
    description: 'Global kvalitetssäkring',
    responsibilities: [
      'Cross-language consistency',
      'Terminologi-drift detection',
      'Nightly report review',
    ],
  },
  
  method_veto: {
    description: 'Språkoberoende metodgranskning',
    responsibilities: [
      'Verifiera att översättning inte ändrar betydelse',
      'Blockera publicering vid metodavvikelse',
    ],
  },
} as const;

export const TRANSLATION_GOVERNANCE = {
  no_quick_fixes: true,
  require_review: true,
  audit_all_changes: true,
  version_all_translations: true,
} as const;

// ============================================================
// 11. DEFINITION OF DONE (I18N)
// ============================================================

export const I18N_DEFINITION_OF_DONE = {
  criteria: [
    {
      id: 'all_strings_code_based',
      description: 'Alla strängar är kodbaserade',
      automated_check: true,
    },
    {
      id: 'semantic_consistency',
      description: 'Alla språk följer samma semantik',
      automated_check: true,
    },
    {
      id: 'nightly_tests_pass',
      description: 'Nattliga tester körs utan fel',
      automated_check: true,
    },
    {
      id: 'fallback_correct',
      description: 'Fallback alltid är korrekt',
      automated_check: true,
    },
    {
      id: 'no_broken_text',
      description: 'Användaren aldrig ser trasig text',
      automated_check: true,
    },
  ] as const,
  
  validation: {
    all_criteria_must_pass: true,
    block_release_on_failure: true,
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getLanguageRules(language: SupportedLanguage): LanguageRule | undefined {
  return LANGUAGE_RULES.find(r => r.language === language);
}

export function validateText(
  text: string,
  language: SupportedLanguage,
  context: string
): { valid: boolean; violations: string[] } {
  const rules = getLanguageRules(language);
  if (!rules) return { valid: true, violations: [] };
  
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Check forbidden causal words
  for (const word of rules.forbidden_causal) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Forbidden causal word: "${word}"`);
    }
  }
  
  // Check forbidden value-loaded words
  for (const word of rules.forbidden_value_loaded) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Forbidden value-loaded word: "${word}"`);
    }
  }
  
  // Check forbidden imperative words
  for (const word of rules.forbidden_imperative) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Forbidden imperative word: "${word}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

export function detectLanguage(
  urlParam: string | null,
  userPreference: SupportedLanguage | null,
  acceptLanguage: string | null,
  geoIpLanguage: SupportedLanguage | null
): { language: SupportedLanguage; method: DetectionMethod } {
  // 1. URL override
  if (urlParam && isValidLanguage(urlParam)) {
    return { language: urlParam as SupportedLanguage, method: 'url_override' };
  }
  
  // 2. User preference (logged in)
  if (userPreference) {
    return { language: userPreference, method: 'user_preference' };
  }
  
  // 3. Accept-Language header
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage);
    if (parsed) {
      return { language: parsed, method: 'accept_language' };
    }
  }
  
  // 4. Geo-IP
  if (geoIpLanguage) {
    return { language: geoIpLanguage, method: 'geo_ip' };
  }
  
  // 5. Default
  return { language: DEFAULT_LANGUAGE, method: 'default' };
}

function isValidLanguage(lang: string): lang is SupportedLanguage {
  const supported: readonly string[] = ['en', 'sv', 'de', 'fr', 'es', 'fi', 'no', 'da'];
  return supported.includes(lang);
}

function parseAcceptLanguage(header: string): SupportedLanguage | null {
  const languages = header.split(',').map(part => {
    const [lang] = part.trim().split(';');
    return lang.split('-')[0].toLowerCase();
  });
  
  for (const lang of languages) {
    if (isValidLanguage(lang)) {
      return lang;
    }
  }
  
  return null;
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const I18N_CONFIG_COMPLETE = {
  detection: {
    priority: LANGUAGE_DETECTION_PRIORITY,
    default: DEFAULT_LANGUAGE,
    config: LANGUAGE_DETECTION_CONFIG,
  },
  textRules: TEXT_SOURCE_RULES,
  contextRequirements: TRANSLATION_CONTEXT_REQUIREMENTS,
  pipeline: TRANSLATION_PIPELINE,
  languageRules: LANGUAGE_RULES,
  nightlyValidation: NIGHTLY_VALIDATION_CONFIG,
  pdfConfig: PDF_I18N_CONFIG,
  apiConfig: API_I18N_CONFIG,
  regressionTesting: REGRESSION_TESTING_CONFIG,
  roles: TRANSLATION_ROLES,
  governance: TRANSLATION_GOVERNANCE,
  definitionOfDone: I18N_DEFINITION_OF_DONE,
} as const;
