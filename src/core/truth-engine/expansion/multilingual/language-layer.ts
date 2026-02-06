/**
 * MULTILINGUAL LANGUAGE LAYER
 * 
 * STEG 20: SPRÅK SOM GRÄNSSNITT – INTE KÄLLA
 * 
 * Grundprincip:
 * - Sanning: språkoberoende
 * - Frågor: språkberoende
 * - Svar: språkberoende
 * - Epistemik: språkoberoende
 * 
 * Det finns exakt ett faktum, men många uttryck.
 */
// Language configs imported from rollout layer for reference

/**
 * LANGUAGE CODE
 * ISO 639-1 codes for supported languages
 */
export type LanguageCode = 
  | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'sv'
  | 'ar' | 'hi' | 'zh' | 'ja' | 'ko' | 'ru';

/**
 * LANGUAGE VARIANT
 * A question expressed in a specific language
 */
export interface LanguageVariant {
  readonly language: LanguageCode;
  readonly text: string;
  readonly is_canonical: boolean;  // English is always canonical
  readonly localized_at: string;
  readonly verified: boolean;
  readonly native_speaker_reviewed: boolean;
}

/**
 * MULTILINGUAL QUESTION
 * One CQ with multiple language expressions
 */
export interface MultilingualQuestion {
  readonly question_id: string;
  readonly canonical_language: 'en';  // Always English
  readonly canonical_text: string;
  
  // All language variants map to same CQ
  readonly language_variants: Record<LanguageCode, LanguageVariant>;
  
  // Semantic core (language-independent)
  readonly semantic_core: {
    readonly core_variables: string[];
    readonly intent_type: string;
    readonly domain: string;
    readonly entity_scope: string;
  };
  
  // Coverage tracking
  readonly languages_available: LanguageCode[];
  readonly languages_pending: LanguageCode[];
}

/**
 * PRIORITY LANGUAGE ORDER
 * Realistic expansion order for maximum impact
 */
export const LANGUAGE_PRIORITY_ORDER: readonly LanguageCode[] = [
  'en',  // 1. English - global routing
  'es',  // 2. Spanish - 500M+ speakers
  'fr',  // 3. French - institutional
  'de',  // 4. German - EU economic
  'pt',  // 5. Portuguese - Brazil + Portugal
  'sv',  // 6. Swedish/Nordic - home market
  'ar',  // 7. Arabic - MENA region
  'ja',  // 8. Japanese - high-value market
  'ko',  // 9. Korean - tech-forward
  'zh',  // 10. Chinese - separate strategy
] as const;

/**
 * LANGUAGE EXPANSION WAVE
 */
export type ExpansionWave = 
  | 'wave_1_core'      // en, es, fr, de
  | 'wave_2_global'    // pt, ar, ru
  | 'wave_3_asian'     // ja, ko, zh
  | 'wave_4_nordic';   // sv, no, da, fi

export const EXPANSION_WAVES: Record<ExpansionWave, LanguageCode[]> = {
  wave_1_core: ['en', 'es', 'fr', 'de'],
  wave_2_global: ['pt', 'ar', 'ru'],
  wave_3_asian: ['ja', 'ko', 'zh'],
  wave_4_nordic: ['sv'],
} as const;

/**
 * LANGUAGE CHARACTERISTICS
 * How different languages express questions
 */
export interface LanguageCharacteristics {
  readonly code: LanguageCode;
  readonly name: string;
  readonly native_name: string;
  
  // Question patterns
  readonly question_word_order: 'svo' | 'sov' | 'vso' | 'flexible';
  readonly explicit_time_required: boolean;
  readonly formal_informal_distinction: boolean;
  
  // Search behavior
  readonly primary_search_engine: 'google' | 'baidu' | 'yandex' | 'naver';
  readonly typical_query_style: 'keyword' | 'natural' | 'mixed';
  
  // Population reach
  readonly speakers_millions: number;
  readonly internet_users_millions: number;
}

export const LANGUAGE_CHARACTERISTICS: Record<LanguageCode, LanguageCharacteristics> = {
  en: {
    code: 'en',
    name: 'English',
    native_name: 'English',
    question_word_order: 'svo',
    explicit_time_required: true,
    formal_informal_distinction: false,
    primary_search_engine: 'google',
    typical_query_style: 'mixed',
    speakers_millions: 1500,
    internet_users_millions: 1200,
  },
  es: {
    code: 'es',
    name: 'Spanish',
    native_name: 'Español',
    question_word_order: 'flexible',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'natural',
    speakers_millions: 550,
    internet_users_millions: 400,
  },
  fr: {
    code: 'fr',
    name: 'French',
    native_name: 'Français',
    question_word_order: 'svo',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'natural',
    speakers_millions: 280,
    internet_users_millions: 200,
  },
  de: {
    code: 'de',
    name: 'German',
    native_name: 'Deutsch',
    question_word_order: 'sov',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'mixed',
    speakers_millions: 130,
    internet_users_millions: 100,
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    native_name: 'Português',
    question_word_order: 'svo',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'natural',
    speakers_millions: 260,
    internet_users_millions: 180,
  },
  sv: {
    code: 'sv',
    name: 'Swedish',
    native_name: 'Svenska',
    question_word_order: 'svo',
    explicit_time_required: true,
    formal_informal_distinction: false,
    primary_search_engine: 'google',
    typical_query_style: 'keyword',
    speakers_millions: 10,
    internet_users_millions: 9,
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    native_name: 'العربية',
    question_word_order: 'vso',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'mixed',
    speakers_millions: 420,
    internet_users_millions: 250,
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    native_name: 'हिन्दी',
    question_word_order: 'sov',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'mixed',
    speakers_millions: 600,
    internet_users_millions: 300,
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    native_name: '中文',
    question_word_order: 'svo',
    explicit_time_required: false,
    formal_informal_distinction: true,
    primary_search_engine: 'baidu',
    typical_query_style: 'keyword',
    speakers_millions: 1100,
    internet_users_millions: 1000,
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    native_name: '日本語',
    question_word_order: 'sov',
    explicit_time_required: false,  // Often implicit
    formal_informal_distinction: true,
    primary_search_engine: 'google',
    typical_query_style: 'keyword',
    speakers_millions: 125,
    internet_users_millions: 100,
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    native_name: '한국어',
    question_word_order: 'sov',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'naver',
    typical_query_style: 'keyword',
    speakers_millions: 80,
    internet_users_millions: 50,
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    native_name: 'Русский',
    question_word_order: 'flexible',
    explicit_time_required: true,
    formal_informal_distinction: true,
    primary_search_engine: 'yandex',
    typical_query_style: 'natural',
    speakers_millions: 250,
    internet_users_millions: 120,
  },
};

/**
 * CORE PRINCIPLE
 */
export const LANGUAGE_LAYER_PRINCIPLE = {
  truth_is_language_independent: true,
  questions_are_language_dependent: true,
  answers_are_language_dependent: true,
  epistemics_are_language_independent: true,
  
  implication: 'Exactly one fact, many expressions',
} as const;

/**
 * Calculate total reach for a set of languages
 */
export function calculateLanguageReach(languages: LanguageCode[]): {
  speakers: number;
  internet_users: number;
  coverage_percent: number;
} {
  let speakers = 0;
  let internet_users = 0;
  
  for (const lang of languages) {
    const chars = LANGUAGE_CHARACTERISTICS[lang];
    if (chars) {
      speakers += chars.speakers_millions;
      internet_users += chars.internet_users_millions;
    }
  }
  
  // Total world population ~8B, internet users ~5B
  const coverage_percent = Math.round((internet_users / 5000) * 100);
  
  return { speakers, internet_users, coverage_percent };
}

/**
 * Get languages by primary search engine
 */
export function getLanguagesBySearchEngine(
  engine: 'google' | 'baidu' | 'yandex' | 'naver'
): LanguageCode[] {
  return Object.values(LANGUAGE_CHARACTERISTICS)
    .filter(l => l.primary_search_engine === engine)
    .map(l => l.code);
}
