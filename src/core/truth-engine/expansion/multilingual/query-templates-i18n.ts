/**
 * LANGUAGE-SPECIFIC QUERY TEMPLATES
 * 
 * STEG 20: NATURLIGA UTTRYCK PER SPRÅK
 * 
 * Olika språk ställer frågor olika, även om de menar samma sak.
 * Samma CQ, olika naturliga uttryck.
 */

import type { LanguageCode } from './language-layer';

/**
 * INTENT TYPE
 */
export type IntentType = 
  | 'trend'
  | 'comparison'
  | 'level'
  | 'ranking'
  | 'distribution'
  | 'composition'
  | 'anomaly';

/**
 * QUERY TEMPLATE
 */
export interface QueryTemplate {
  readonly intent: IntentType;
  readonly template: string;
  readonly natural_variants: string[];
  readonly search_keywords: string[];
}

/**
 * LANGUAGE TEMPLATE SET
 */
export interface LanguageTemplateSet {
  readonly language: LanguageCode;
  readonly templates: Record<IntentType, QueryTemplate[]>;
}

/**
 * ENGLISH TEMPLATES (Canonical)
 */
const EN_TEMPLATES: LanguageTemplateSet = {
  language: 'en',
  templates: {
    trend: [
      {
        intent: 'trend',
        template: 'How has {variable} changed over time in {entity}?',
        natural_variants: [
          'What is the trend in {variable} in {entity}?',
          '{variable} development over time in {entity}',
          'Historical {variable} in {entity}',
          '{variable} trend {entity}',
        ],
        search_keywords: ['trend', 'change', 'development', 'over time', 'historical'],
      },
      {
        intent: 'trend',
        template: 'How has {variable} evolved since {year}?',
        natural_variants: [
          '{variable} since {year}',
          '{variable} from {year} to present',
        ],
        search_keywords: ['since', 'from', 'evolved', 'changed'],
      },
    ],
    comparison: [
      {
        intent: 'comparison',
        template: 'How does {variable} compare between {entity_a} and {entity_b}?',
        natural_variants: [
          '{variable} {entity_a} vs {entity_b}',
          'Compare {variable} in {entity_a} and {entity_b}',
          'Difference in {variable} between {entity_a} and {entity_b}',
        ],
        search_keywords: ['compare', 'vs', 'versus', 'difference', 'between'],
      },
    ],
    level: [
      {
        intent: 'level',
        template: 'What is the current {variable} in {entity}?',
        natural_variants: [
          '{variable} in {entity}',
          'Current {variable} {entity}',
          '{entity} {variable}',
        ],
        search_keywords: ['current', 'what is', 'level', 'rate'],
      },
    ],
    ranking: [
      {
        intent: 'ranking',
        template: 'Which countries have the highest {variable}?',
        natural_variants: [
          'Top {variable} by country',
          '{variable} ranking',
          'Best/worst {variable} countries',
        ],
        search_keywords: ['highest', 'lowest', 'ranking', 'top', 'best', 'worst'],
      },
    ],
    distribution: [
      {
        intent: 'distribution',
        template: 'How is {variable} distributed across {entity}?',
        natural_variants: [
          '{variable} distribution in {entity}',
          '{variable} breakdown by region',
        ],
        search_keywords: ['distribution', 'breakdown', 'spread', 'across'],
      },
    ],
    composition: [
      {
        intent: 'composition',
        template: 'What is the composition of {variable} in {entity}?',
        natural_variants: [
          '{variable} breakdown in {entity}',
          'Components of {variable}',
        ],
        search_keywords: ['composition', 'breakdown', 'components', 'share'],
      },
    ],
    anomaly: [
      {
        intent: 'anomaly',
        template: 'Are there unusual patterns in {variable} in {entity}?',
        natural_variants: [
          '{variable} anomalies',
          'Unusual {variable} trends',
        ],
        search_keywords: ['unusual', 'anomaly', 'outlier', 'exception'],
      },
    ],
  },
};

/**
 * SWEDISH TEMPLATES
 */
const SV_TEMPLATES: LanguageTemplateSet = {
  language: 'sv',
  templates: {
    trend: [
      {
        intent: 'trend',
        template: 'Hur har {variable} utvecklats över tid i {entity}?',
        natural_variants: [
          'Utvecklingen av {variable} i {entity}',
          '{variable} trend i {entity}',
          'Historisk {variable} i {entity}',
          '{variable} över tid {entity}',
        ],
        search_keywords: ['utveckling', 'trend', 'över tid', 'historisk'],
      },
      {
        intent: 'trend',
        template: 'Hur har {variable} förändrats sedan {year}?',
        natural_variants: [
          '{variable} sedan {year}',
          '{variable} från {year} till idag',
        ],
        search_keywords: ['sedan', 'från', 'förändrats', 'utvecklats'],
      },
    ],
    comparison: [
      {
        intent: 'comparison',
        template: 'Hur skiljer sig {variable} mellan {entity_a} och {entity_b}?',
        natural_variants: [
          '{variable} {entity_a} vs {entity_b}',
          'Jämför {variable} i {entity_a} och {entity_b}',
          'Skillnad i {variable} mellan {entity_a} och {entity_b}',
        ],
        search_keywords: ['jämför', 'skillnad', 'mellan', 'vs'],
      },
    ],
    level: [
      {
        intent: 'level',
        template: 'Vad är nuvarande {variable} i {entity}?',
        natural_variants: [
          '{variable} i {entity}',
          'Aktuell {variable} {entity}',
          '{entity} {variable}',
        ],
        search_keywords: ['nuvarande', 'aktuell', 'vad är', 'nivå'],
      },
    ],
    ranking: [
      {
        intent: 'ranking',
        template: 'Vilka länder har högst {variable}?',
        natural_variants: [
          'Topp {variable} per land',
          '{variable} ranking',
          'Bästa/sämsta {variable} länder',
        ],
        search_keywords: ['högst', 'lägst', 'ranking', 'topp', 'bäst', 'sämst'],
      },
    ],
    distribution: [
      {
        intent: 'distribution',
        template: 'Hur är {variable} fördelad i {entity}?',
        natural_variants: [
          '{variable} fördelning i {entity}',
          '{variable} per region',
        ],
        search_keywords: ['fördelning', 'per region', 'spridning'],
      },
    ],
    composition: [
      {
        intent: 'composition',
        template: 'Vad består {variable} av i {entity}?',
        natural_variants: [
          '{variable} sammansättning i {entity}',
          'Komponenter av {variable}',
        ],
        search_keywords: ['sammansättning', 'komponenter', 'består av', 'andel'],
      },
    ],
    anomaly: [
      {
        intent: 'anomaly',
        template: 'Finns det ovanliga mönster i {variable} i {entity}?',
        natural_variants: [
          '{variable} avvikelser',
          'Ovanlig {variable} trend',
        ],
        search_keywords: ['ovanlig', 'avvikelse', 'anomali', 'undantag'],
      },
    ],
  },
};

/**
 * GERMAN TEMPLATES
 */
const DE_TEMPLATES: LanguageTemplateSet = {
  language: 'de',
  templates: {
    trend: [
      {
        intent: 'trend',
        template: 'Wie hat sich {variable} im Zeitverlauf in {entity} entwickelt?',
        natural_variants: [
          'Entwicklung von {variable} in {entity}',
          '{variable} Trend in {entity}',
          'Historische {variable} in {entity}',
        ],
        search_keywords: ['Entwicklung', 'Trend', 'im Zeitverlauf', 'historisch'],
      },
    ],
    comparison: [
      {
        intent: 'comparison',
        template: 'Wie unterscheidet sich {variable} zwischen {entity_a} und {entity_b}?',
        natural_variants: [
          '{variable} {entity_a} vs {entity_b}',
          'Vergleich {variable} in {entity_a} und {entity_b}',
        ],
        search_keywords: ['Vergleich', 'Unterschied', 'zwischen', 'vs'],
      },
    ],
    level: [
      {
        intent: 'level',
        template: 'Wie hoch ist die aktuelle {variable} in {entity}?',
        natural_variants: [
          '{variable} in {entity}',
          'Aktuelle {variable} {entity}',
        ],
        search_keywords: ['aktuell', 'wie hoch', 'Niveau', 'Rate'],
      },
    ],
    ranking: [
      {
        intent: 'ranking',
        template: 'Welche Länder haben die höchste {variable}?',
        natural_variants: [
          'Top {variable} nach Land',
          '{variable} Ranking',
        ],
        search_keywords: ['höchste', 'niedrigste', 'Ranking', 'Top'],
      },
    ],
    distribution: [
      {
        intent: 'distribution',
        template: 'Wie ist {variable} in {entity} verteilt?',
        natural_variants: [
          '{variable} Verteilung in {entity}',
        ],
        search_keywords: ['Verteilung', 'verteilt', 'nach Region'],
      },
    ],
    composition: [
      {
        intent: 'composition',
        template: 'Woraus besteht {variable} in {entity}?',
        natural_variants: [
          '{variable} Zusammensetzung in {entity}',
        ],
        search_keywords: ['Zusammensetzung', 'Komponenten', 'Anteil'],
      },
    ],
    anomaly: [
      {
        intent: 'anomaly',
        template: 'Gibt es ungewöhnliche Muster bei {variable} in {entity}?',
        natural_variants: [
          '{variable} Anomalien',
        ],
        search_keywords: ['ungewöhnlich', 'Anomalie', 'Ausreißer'],
      },
    ],
  },
};

/**
 * FRENCH TEMPLATES
 */
const FR_TEMPLATES: LanguageTemplateSet = {
  language: 'fr',
  templates: {
    trend: [
      {
        intent: 'trend',
        template: 'Comment {variable} a-t-il évolué au fil du temps dans {entity}?',
        natural_variants: [
          'Évolution de {variable} dans {entity}',
          'Tendance {variable} dans {entity}',
          '{variable} historique dans {entity}',
        ],
        search_keywords: ['évolution', 'tendance', 'au fil du temps', 'historique'],
      },
    ],
    comparison: [
      {
        intent: 'comparison',
        template: 'Comment {variable} se compare-t-il entre {entity_a} et {entity_b}?',
        natural_variants: [
          '{variable} {entity_a} vs {entity_b}',
          'Comparaison {variable} entre {entity_a} et {entity_b}',
        ],
        search_keywords: ['comparaison', 'différence', 'entre', 'vs'],
      },
    ],
    level: [
      {
        intent: 'level',
        template: 'Quel est le niveau actuel de {variable} dans {entity}?',
        natural_variants: [
          '{variable} dans {entity}',
          '{variable} actuel {entity}',
        ],
        search_keywords: ['actuel', 'quel est', 'niveau', 'taux'],
      },
    ],
    ranking: [
      {
        intent: 'ranking',
        template: 'Quels pays ont le plus haut {variable}?',
        natural_variants: [
          'Top {variable} par pays',
          'Classement {variable}',
        ],
        search_keywords: ['plus haut', 'plus bas', 'classement', 'top'],
      },
    ],
    distribution: [
      {
        intent: 'distribution',
        template: 'Comment {variable} est-il distribué dans {entity}?',
        natural_variants: [
          'Distribution de {variable} dans {entity}',
        ],
        search_keywords: ['distribution', 'répartition', 'par région'],
      },
    ],
    composition: [
      {
        intent: 'composition',
        template: 'Quelle est la composition de {variable} dans {entity}?',
        natural_variants: [
          'Composition de {variable} dans {entity}',
        ],
        search_keywords: ['composition', 'composants', 'part'],
      },
    ],
    anomaly: [
      {
        intent: 'anomaly',
        template: 'Y a-t-il des schémas inhabituels dans {variable} dans {entity}?',
        natural_variants: [
          'Anomalies de {variable}',
        ],
        search_keywords: ['inhabituel', 'anomalie', 'exception'],
      },
    ],
  },
};

/**
 * SPANISH TEMPLATES
 */
const ES_TEMPLATES: LanguageTemplateSet = {
  language: 'es',
  templates: {
    trend: [
      {
        intent: 'trend',
        template: '¿Cómo ha evolucionado {variable} a lo largo del tiempo en {entity}?',
        natural_variants: [
          'Evolución de {variable} en {entity}',
          'Tendencia de {variable} en {entity}',
          '{variable} histórico en {entity}',
        ],
        search_keywords: ['evolución', 'tendencia', 'a lo largo del tiempo', 'histórico'],
      },
    ],
    comparison: [
      {
        intent: 'comparison',
        template: '¿Cómo se compara {variable} entre {entity_a} y {entity_b}?',
        natural_variants: [
          '{variable} {entity_a} vs {entity_b}',
          'Comparación de {variable} entre {entity_a} y {entity_b}',
        ],
        search_keywords: ['comparación', 'diferencia', 'entre', 'vs'],
      },
    ],
    level: [
      {
        intent: 'level',
        template: '¿Cuál es el nivel actual de {variable} en {entity}?',
        natural_variants: [
          '{variable} en {entity}',
          '{variable} actual {entity}',
        ],
        search_keywords: ['actual', 'cuál es', 'nivel', 'tasa'],
      },
    ],
    ranking: [
      {
        intent: 'ranking',
        template: '¿Qué países tienen el mayor {variable}?',
        natural_variants: [
          'Top {variable} por país',
          'Ranking de {variable}',
        ],
        search_keywords: ['mayor', 'menor', 'ranking', 'top'],
      },
    ],
    distribution: [
      {
        intent: 'distribution',
        template: '¿Cómo se distribuye {variable} en {entity}?',
        natural_variants: [
          'Distribución de {variable} en {entity}',
        ],
        search_keywords: ['distribución', 'por región'],
      },
    ],
    composition: [
      {
        intent: 'composition',
        template: '¿Cuál es la composición de {variable} en {entity}?',
        natural_variants: [
          'Composición de {variable} en {entity}',
        ],
        search_keywords: ['composición', 'componentes', 'participación'],
      },
    ],
    anomaly: [
      {
        intent: 'anomaly',
        template: '¿Hay patrones inusuales en {variable} en {entity}?',
        natural_variants: [
          'Anomalías de {variable}',
        ],
        search_keywords: ['inusual', 'anomalía', 'excepción'],
      },
    ],
  },
};

/**
 * ALL LANGUAGE TEMPLATES
 */
export const LANGUAGE_TEMPLATES: Record<LanguageCode, LanguageTemplateSet> = {
  en: EN_TEMPLATES,
  sv: SV_TEMPLATES,
  de: DE_TEMPLATES,
  fr: FR_TEMPLATES,
  es: ES_TEMPLATES,
  // Placeholders for additional languages
  pt: EN_TEMPLATES, // TODO: Portuguese templates
  ar: EN_TEMPLATES, // TODO: Arabic templates
  hi: EN_TEMPLATES, // TODO: Hindi templates
  zh: EN_TEMPLATES, // TODO: Chinese templates
  ja: EN_TEMPLATES, // TODO: Japanese templates
  ko: EN_TEMPLATES, // TODO: Korean templates
  ru: EN_TEMPLATES, // TODO: Russian templates
};

/**
 * TEMPLATE GENERATOR
 */
export class MultilingualTemplateGenerator {
  /**
   * Generate all variants for a question in a specific language
   */
  generateVariants(
    language: LanguageCode,
    intent: IntentType,
    variables: Record<string, string>
  ): string[] {
    const templateSet = LANGUAGE_TEMPLATES[language];
    if (!templateSet) return [];
    
    const templates = templateSet.templates[intent];
    if (!templates) return [];
    
    const variants: string[] = [];
    
    for (const template of templates) {
      // Generate from main template
      variants.push(this.fillTemplate(template.template, variables));
      
      // Generate from natural variants
      for (const variant of template.natural_variants) {
        variants.push(this.fillTemplate(variant, variables));
      }
    }
    
    return variants;
  }
  
  /**
   * Fill a template with variables
   */
  private fillTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }
  
  /**
   * Get search keywords for a language and intent
   */
  getSearchKeywords(language: LanguageCode, intent: IntentType): string[] {
    const templateSet = LANGUAGE_TEMPLATES[language];
    if (!templateSet) return [];
    
    const templates = templateSet.templates[intent];
    if (!templates) return [];
    
    const keywords: string[] = [];
    for (const template of templates) {
      keywords.push(...template.search_keywords);
    }
    
    return [...new Set(keywords)];
  }
  
  /**
   * Get all available intents for a language
   */
  getAvailableIntents(language: LanguageCode): IntentType[] {
    const templateSet = LANGUAGE_TEMPLATES[language];
    if (!templateSet) return [];
    
    return Object.keys(templateSet.templates) as IntentType[];
  }
}

/**
 * Create singleton generator
 */
export function createTemplateGenerator(): MultilingualTemplateGenerator {
  return new MultilingualTemplateGenerator();
}

/**
 * TEMPLATE PRINCIPLES
 */
export const TEMPLATE_PRINCIPLES = {
  same_cq_different_expressions: true,
  natural_for_each_language: true,
  search_keyword_coverage: true,
  all_variants_map_to_same_answer: true,
} as const;
