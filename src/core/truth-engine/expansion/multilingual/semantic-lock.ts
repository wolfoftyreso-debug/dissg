/**
 * SEMANTIC LOCK
 * 
 * STEG 20: ANTI-DRIFT MECHANISM
 * 
 * Prevents language variants from shifting meaning.
 * "utveckling" never becomes "påverkan"
 * "trend" never becomes "orsak"
 * Language never changes epistemic status.
 */

import type { LanguageCode } from './language-layer';

/**
 * FORBIDDEN SEMANTIC SHIFT
 * Types of meaning drift that are blocked
 */
export type ForbiddenShift = 
  | 'normative_framing'      // Adding value judgments
  | 'causal_implication'     // Implying causation
  | 'scope_narrowing'        // Reducing entity scope
  | 'scope_expansion'        // Expanding beyond original
  | 'temporal_shift'         // Changing time frame
  | 'certainty_inflation'    // Making uncertain seem certain
  | 'certainty_deflation'    // Making certain seem uncertain
  | 'actor_attribution'      // Attributing to unspecified actors
  | 'intent_projection';     // Adding motive/intent

/**
 * SEMANTIC LOCK DEFINITION
 * The invariant properties that must be preserved
 */
export interface SemanticLock {
  readonly question_id: string;
  
  // Core variables that must be present in all variants
  readonly core_variables: string[];
  
  // Intent signature from Query Intent Matrix
  readonly intent_signature: string;  // e.g., "[Trend | Low | Finance | Moderate]"
  
  // Forbidden semantic shifts
  readonly forbidden_shifts: ForbiddenShift[];
  
  // Required semantic elements
  readonly required_elements: {
    readonly must_include: string[];
    readonly must_exclude: string[];
  };
  
  // Epistemic bounds
  readonly epistemic_bounds: {
    readonly max_certainty: 'verified' | 'estimated' | 'projected' | 'speculative';
    readonly allows_comparison: boolean;
    readonly allows_trend: boolean;
    readonly allows_ranking: boolean;
  };
}

/**
 * SEMANTIC VALIDATION RESULT
 */
export interface SemanticValidationResult {
  readonly valid: boolean;
  readonly violations: SemanticViolation[];
  readonly warnings: string[];
  readonly confidence: number;  // 0-1
}

/**
 * SEMANTIC VIOLATION
 */
export interface SemanticViolation {
  readonly type: ForbiddenShift;
  readonly severity: 'critical' | 'major' | 'minor';
  readonly description: string;
  readonly detected_phrase: string;
  readonly suggested_fix: string | null;
}

/**
 * LANGUAGE-SPECIFIC FORBIDDEN PATTERNS
 * Words/phrases that indicate semantic drift in each language
 */
export const FORBIDDEN_PATTERNS: Record<LanguageCode, Record<ForbiddenShift, string[]>> = {
  en: {
    normative_framing: ['should', 'must', 'ought to', 'best', 'worst', 'good', 'bad', 'crisis', 'success'],
    causal_implication: ['because of', 'due to', 'caused by', 'leads to', 'results in', 'impact of'],
    scope_narrowing: ['only', 'just', 'merely', 'specifically'],
    scope_expansion: ['all', 'every', 'always', 'universal'],
    temporal_shift: ['recently', 'nowadays', 'in the future', 'soon'],
    certainty_inflation: ['definitely', 'certainly', 'absolutely', 'proven'],
    certainty_deflation: ['maybe', 'perhaps', 'might', 'could be'],
    actor_attribution: ['they', 'the government', 'politicians', 'elites'],
    intent_projection: ['wants to', 'trying to', 'intends to', 'aims to'],
  },
  sv: {
    normative_framing: ['bör', 'måste', 'bäst', 'sämst', 'bra', 'dålig', 'kris', 'framgång'],
    causal_implication: ['på grund av', 'beroende på', 'orsakar', 'leder till', 'resulterar i', 'påverkan av'],
    scope_narrowing: ['bara', 'endast', 'just', 'specifikt'],
    scope_expansion: ['alla', 'varje', 'alltid', 'universellt'],
    temporal_shift: ['nyligen', 'nuförtiden', 'i framtiden', 'snart'],
    certainty_inflation: ['definitivt', 'säkert', 'absolut', 'bevisat'],
    certainty_deflation: ['kanske', 'möjligen', 'eventuellt', 'skulle kunna'],
    actor_attribution: ['de', 'regeringen', 'politiker', 'eliten'],
    intent_projection: ['vill', 'försöker', 'avser', 'syftar till'],
  },
  de: {
    normative_framing: ['sollte', 'muss', 'beste', 'schlechteste', 'gut', 'schlecht', 'Krise', 'Erfolg'],
    causal_implication: ['wegen', 'aufgrund', 'verursacht', 'führt zu', 'resultiert in', 'Auswirkung von'],
    scope_narrowing: ['nur', 'lediglich', 'bloß', 'spezifisch'],
    scope_expansion: ['alle', 'jeder', 'immer', 'universell'],
    temporal_shift: ['kürzlich', 'heutzutage', 'in Zukunft', 'bald'],
    certainty_inflation: ['definitiv', 'sicher', 'absolut', 'bewiesen'],
    certainty_deflation: ['vielleicht', 'möglicherweise', 'eventuell', 'könnte'],
    actor_attribution: ['sie', 'die Regierung', 'Politiker', 'Eliten'],
    intent_projection: ['will', 'versucht', 'beabsichtigt', 'zielt auf'],
  },
  fr: {
    normative_framing: ['devrait', 'doit', 'meilleur', 'pire', 'bon', 'mauvais', 'crise', 'succès'],
    causal_implication: ['à cause de', 'en raison de', 'causé par', 'mène à', 'résulte en', 'impact de'],
    scope_narrowing: ['seulement', 'uniquement', 'juste', 'spécifiquement'],
    scope_expansion: ['tous', 'chaque', 'toujours', 'universel'],
    temporal_shift: ['récemment', 'de nos jours', 'à l\'avenir', 'bientôt'],
    certainty_inflation: ['définitivement', 'certainement', 'absolument', 'prouvé'],
    certainty_deflation: ['peut-être', 'possiblement', 'éventuellement', 'pourrait'],
    actor_attribution: ['ils', 'le gouvernement', 'politiciens', 'élites'],
    intent_projection: ['veut', 'essaie de', 'a l\'intention de', 'vise à'],
  },
  es: {
    normative_framing: ['debería', 'debe', 'mejor', 'peor', 'bueno', 'malo', 'crisis', 'éxito'],
    causal_implication: ['debido a', 'a causa de', 'causado por', 'lleva a', 'resulta en', 'impacto de'],
    scope_narrowing: ['solo', 'únicamente', 'meramente', 'específicamente'],
    scope_expansion: ['todos', 'cada', 'siempre', 'universal'],
    temporal_shift: ['recientemente', 'hoy en día', 'en el futuro', 'pronto'],
    certainty_inflation: ['definitivamente', 'ciertamente', 'absolutamente', 'probado'],
    certainty_deflation: ['quizás', 'posiblemente', 'tal vez', 'podría'],
    actor_attribution: ['ellos', 'el gobierno', 'políticos', 'élites'],
    intent_projection: ['quiere', 'intenta', 'pretende', 'apunta a'],
  },
  pt: {
    normative_framing: ['deveria', 'deve', 'melhor', 'pior', 'bom', 'mau', 'crise', 'sucesso'],
    causal_implication: ['devido a', 'por causa de', 'causado por', 'leva a', 'resulta em', 'impacto de'],
    scope_narrowing: ['só', 'apenas', 'somente', 'especificamente'],
    scope_expansion: ['todos', 'cada', 'sempre', 'universal'],
    temporal_shift: ['recentemente', 'hoje em dia', 'no futuro', 'em breve'],
    certainty_inflation: ['definitivamente', 'certamente', 'absolutamente', 'provado'],
    certainty_deflation: ['talvez', 'possivelmente', 'eventualmente', 'poderia'],
    actor_attribution: ['eles', 'o governo', 'políticos', 'elites'],
    intent_projection: ['quer', 'tenta', 'pretende', 'visa'],
  },
  ar: {
    normative_framing: ['يجب', 'ينبغي', 'أفضل', 'أسوأ', 'جيد', 'سيء', 'أزمة', 'نجاح'],
    causal_implication: ['بسبب', 'نتيجة', 'يسبب', 'يؤدي إلى', 'ينتج عن', 'تأثير'],
    scope_narrowing: ['فقط', 'مجرد', 'تحديداً'],
    scope_expansion: ['كل', 'جميع', 'دائماً', 'عالمي'],
    temporal_shift: ['مؤخراً', 'حالياً', 'في المستقبل', 'قريباً'],
    certainty_inflation: ['بالتأكيد', 'قطعاً', 'مثبت'],
    certainty_deflation: ['ربما', 'من الممكن', 'قد يكون'],
    actor_attribution: ['هم', 'الحكومة', 'السياسيون', 'النخبة'],
    intent_projection: ['يريد', 'يحاول', 'ينوي', 'يهدف'],
  },
  hi: {
    normative_framing: ['चाहिए', 'होना चाहिए', 'सबसे अच्छा', 'सबसे बुरा', 'अच्छा', 'बुरा', 'संकट', 'सफलता'],
    causal_implication: ['के कारण', 'की वजह से', 'से होता है', 'की ओर ले जाता है'],
    scope_narrowing: ['केवल', 'सिर्फ', 'बस'],
    scope_expansion: ['सभी', 'हर', 'हमेशा', 'सार्वभौमिक'],
    temporal_shift: ['हाल ही में', 'आजकल', 'भविष्य में', 'जल्द ही'],
    certainty_inflation: ['निश्चित रूप से', 'निश्चय ही', 'सिद्ध'],
    certainty_deflation: ['शायद', 'संभवतः', 'हो सकता है'],
    actor_attribution: ['वे', 'सरकार', 'राजनेता', 'अभिजात'],
    intent_projection: ['चाहता है', 'कोशिश करता है', 'इरादा रखता है'],
  },
  zh: {
    normative_framing: ['应该', '必须', '最好', '最差', '好', '坏', '危机', '成功'],
    causal_implication: ['由于', '因为', '导致', '引起', '结果'],
    scope_narrowing: ['只', '仅仅', '只是', '具体'],
    scope_expansion: ['所有', '每个', '总是', '普遍'],
    temporal_shift: ['最近', '如今', '将来', '很快'],
    certainty_inflation: ['肯定', '一定', '绝对', '已证明'],
    certainty_deflation: ['也许', '可能', '或许', '大概'],
    actor_attribution: ['他们', '政府', '政治家', '精英'],
    intent_projection: ['想要', '试图', '打算', '旨在'],
  },
  ja: {
    normative_framing: ['べき', 'なければならない', '最良', '最悪', '良い', '悪い', '危機', '成功'],
    causal_implication: ['のため', 'による', 'を引き起こす', 'につながる', '結果として'],
    scope_narrowing: ['だけ', 'のみ', '単に', '特に'],
    scope_expansion: ['すべて', 'あらゆる', '常に', '普遍的'],
    temporal_shift: ['最近', '現在', '将来', 'まもなく'],
    certainty_inflation: ['確実に', '必ず', '絶対に', '証明された'],
    certainty_deflation: ['おそらく', 'たぶん', 'かもしれない'],
    actor_attribution: ['彼ら', '政府', '政治家', 'エリート'],
    intent_projection: ['したい', '試みる', '意図する', '目指す'],
  },
  ko: {
    normative_framing: ['해야', '해야 한다', '최고', '최악', '좋은', '나쁜', '위기', '성공'],
    causal_implication: ['때문에', '으로 인해', '야기하다', '이끌다', '결과로'],
    scope_narrowing: ['만', '단지', '오직', '구체적으로'],
    scope_expansion: ['모든', '모두', '항상', '보편적'],
    temporal_shift: ['최근', '요즘', '미래에', '곧'],
    certainty_inflation: ['확실히', '반드시', '절대로', '증명된'],
    certainty_deflation: ['아마', '어쩌면', '혹시', '될 수도'],
    actor_attribution: ['그들', '정부', '정치인', '엘리트'],
    intent_projection: ['하고 싶다', '시도하다', '의도하다', '목표로 하다'],
  },
  ru: {
    normative_framing: ['должен', 'следует', 'лучший', 'худший', 'хороший', 'плохой', 'кризис', 'успех'],
    causal_implication: ['из-за', 'вследствие', 'вызывает', 'ведёт к', 'приводит к', 'влияние'],
    scope_narrowing: ['только', 'лишь', 'просто', 'конкретно'],
    scope_expansion: ['все', 'каждый', 'всегда', 'универсальный'],
    temporal_shift: ['недавно', 'сейчас', 'в будущем', 'скоро'],
    certainty_inflation: ['определённо', 'точно', 'абсолютно', 'доказано'],
    certainty_deflation: ['возможно', 'может быть', 'наверное', 'вероятно'],
    actor_attribution: ['они', 'правительство', 'политики', 'элита'],
    intent_projection: ['хочет', 'пытается', 'намеревается', 'стремится'],
  },
};

/**
 * SEMANTIC VALIDATOR
 */
export class SemanticValidator {
  /**
   * Validate a language variant against its semantic lock
   */
  validate(
    variant: string,
    language: LanguageCode,
    lock: SemanticLock
  ): SemanticValidationResult {
    const violations: SemanticViolation[] = [];
    const warnings: string[] = [];
    
    // Check for forbidden patterns
    const patterns = FORBIDDEN_PATTERNS[language];
    if (patterns) {
      for (const shift of lock.forbidden_shifts) {
        const forbiddenPhrases = patterns[shift] || [];
        for (const phrase of forbiddenPhrases) {
          if (variant.toLowerCase().includes(phrase.toLowerCase())) {
            violations.push({
              type: shift,
              severity: this.getSeverity(shift),
              description: `Contains forbidden ${shift} pattern`,
              detected_phrase: phrase,
              suggested_fix: `Remove or rephrase "${phrase}"`,
            });
          }
        }
      }
    }
    
    // Check for required elements
    for (const required of lock.required_elements.must_include) {
      // This would need semantic matching, simplified here
      if (!variant.toLowerCase().includes(required.toLowerCase())) {
        warnings.push(`May be missing required element: ${required}`);
      }
    }
    
    // Check for excluded elements
    for (const excluded of lock.required_elements.must_exclude) {
      if (variant.toLowerCase().includes(excluded.toLowerCase())) {
        violations.push({
          type: 'normative_framing',
          severity: 'major',
          description: `Contains excluded element`,
          detected_phrase: excluded,
          suggested_fix: `Remove "${excluded}"`,
        });
      }
    }
    
    // Calculate confidence
    const criticalViolations = violations.filter(v => v.severity === 'critical').length;
    const majorViolations = violations.filter(v => v.severity === 'major').length;
    const confidence = Math.max(0, 1 - (criticalViolations * 0.3) - (majorViolations * 0.1) - (warnings.length * 0.02));
    
    return {
      valid: violations.length === 0,
      violations,
      warnings,
      confidence: Math.round(confidence * 100) / 100,
    };
  }
  
  /**
   * Get severity for a shift type
   */
  private getSeverity(shift: ForbiddenShift): 'critical' | 'major' | 'minor' {
    switch (shift) {
      case 'normative_framing':
      case 'causal_implication':
      case 'certainty_inflation':
        return 'critical';
      case 'scope_narrowing':
      case 'scope_expansion':
      case 'actor_attribution':
        return 'major';
      default:
        return 'minor';
    }
  }
  
  /**
   * Create a semantic lock for a question
   */
  createLock(
    questionId: string,
    coreVariables: string[],
    intentSignature: string
  ): SemanticLock {
    return {
      question_id: questionId,
      core_variables: coreVariables,
      intent_signature: intentSignature,
      forbidden_shifts: [
        'normative_framing',
        'causal_implication',
        'certainty_inflation',
        'actor_attribution',
        'intent_projection',
      ],
      required_elements: {
        must_include: coreVariables,
        must_exclude: [],
      },
      epistemic_bounds: {
        max_certainty: 'verified',
        allows_comparison: true,
        allows_trend: true,
        allows_ranking: true,
      },
    };
  }
}

/**
 * SEMANTIC LOCK PRINCIPLES
 */
export const SEMANTIC_LOCK_PRINCIPLES = {
  language_never_changes_epistemics: true,
  meaning_preserved_across_all_variants: true,
  trend_never_becomes_cause: true,
  description_never_becomes_prescription: true,
  
  validation_is_automatic: true,
  violations_block_publication: true,
} as const;

/**
 * Create singleton validator
 */
export function createSemanticValidator(): SemanticValidator {
  return new SemanticValidator();
}
