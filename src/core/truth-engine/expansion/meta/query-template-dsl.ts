/**
 * QUERY TEMPLATE DSL
 * 
 * STEG 18: SPRÅKET SOM SKAPAR 10M FRÅGOR
 * 
 * Ni behöver inte prompts.
 * Ni behöver ett deterministiskt språk.
 */

import type { InformationType, ActorType, RiskLevel, CognitiveLoad, QueryIntentSignature } from './query-intent-matrix';
import { createSemanticFingerprint, createMatrixEntry } from './query-intent-matrix';

/**
 * DSL TEMPLATE DEFINITION
 */
export interface DSLTemplate {
  readonly template_id: string;
  readonly name: string;
  
  // Pattern definitions
  readonly pattern_en: string;
  readonly pattern_sv: string;
  
  // Application rules
  readonly applies_to: DSLApplyRules;
  
  // Expansion rules
  readonly expand: DSLExpandRules;
  
  // Output control
  readonly output: DSLOutputRules;
}

/**
 * DSL APPLY RULES
 * When this template should be used
 */
export interface DSLApplyRules {
  readonly intent: InformationType | InformationType[];
  readonly risk_max: RiskLevel;
  readonly actors: ActorType[];
  readonly cognitive_load_max?: CognitiveLoad;
}

/**
 * DSL EXPAND RULES
 * What variables to expand
 */
export interface DSLExpandRules {
  readonly variable: DSLVariableExpansion;
  readonly entity: DSLEntityExpansion;
  readonly time?: DSLTimeExpansion;
}

/**
 * Variable expansion rules
 */
export interface DSLVariableExpansion {
  readonly type: 'fixed' | 'domain' | 'any';
  readonly values?: string[];
  readonly domain_codes?: string[];
}

/**
 * Entity expansion rules
 */
export interface DSLEntityExpansion {
  readonly type: 'fixed' | 'geo_level' | 'any';
  readonly values?: string[];
  readonly geo_levels?: ('global' | 'bloc' | 'country' | 'region' | 'municipal')[];
}

/**
 * Time expansion rules
 */
export interface DSLTimeExpansion {
  readonly type: 'fixed' | 'range' | 'any';
  readonly values?: string[];
  readonly range_years?: number;
}

/**
 * DSL OUTPUT RULES
 */
export interface DSLOutputRules {
  readonly max_queries: number;
  readonly deduplicate: boolean;
  readonly generate_fingerprints: boolean;
  readonly languages: ('en' | 'sv')[];
}

/**
 * GENERATED QUERY
 */
export interface GeneratedQuery {
  readonly query_id: string;
  readonly template_id: string;
  readonly text_en: string;
  readonly text_sv: string;
  readonly fingerprint: string;
  readonly signature: QueryIntentSignature;
  readonly canonical_url: string;
  readonly exposure: {
    readonly search_engines: boolean;
    readonly ai_agents: boolean;
    readonly human_ui: boolean;
  };
}

/**
 * CORE DSL TEMPLATES
 */
export const DSL_TEMPLATES: DSLTemplate[] = [
  // ========== TREND TEMPLATES ==========
  {
    template_id: 'DSL-TREND-BASIC',
    name: 'Basic Trend Query',
    pattern_en: 'How has {variable} changed over time in {entity}?',
    pattern_sv: 'Hur har {variable} förändrats över tid i {entity}?',
    applies_to: {
      intent: 'trend',
      risk_max: 'moderate',
      actors: ['finance', 'policy', 'journalism', 'general'],
    },
    expand: {
      variable: { type: 'domain', domain_codes: ['TAX', 'DEMO', 'ECON', 'HEALTH'] },
      entity: { type: 'geo_level', geo_levels: ['country', 'bloc'] },
    },
    output: {
      max_queries: 200,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  {
    template_id: 'DSL-TREND-DIRECTION',
    name: 'Trend Direction Query',
    pattern_en: 'Is {variable} increasing or decreasing in {entity}?',
    pattern_sv: 'Ökar eller minskar {variable} i {entity}?',
    applies_to: {
      intent: 'trend',
      risk_max: 'moderate',
      actors: ['finance', 'policy', 'journalism', 'general'],
    },
    expand: {
      variable: { type: 'domain', domain_codes: ['LABOR', 'HOUSING', 'CRIME'] },
      entity: { type: 'geo_level', geo_levels: ['country', 'region'] },
    },
    output: {
      max_queries: 150,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  
  // ========== LEVEL TEMPLATES ==========
  {
    template_id: 'DSL-LEVEL-CURRENT',
    name: 'Current Level Query',
    pattern_en: 'What is the current {variable} in {entity}?',
    pattern_sv: 'Vad är nuvarande {variable} i {entity}?',
    applies_to: {
      intent: 'level',
      risk_max: 'minimal',
      actors: ['general', 'finance', 'policy', 'journalism', 'corporate'],
      cognitive_load_max: 'low',
    },
    expand: {
      variable: { type: 'any' },
      entity: { type: 'geo_level', geo_levels: ['global', 'bloc', 'country'] },
    },
    output: {
      max_queries: 300,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  {
    template_id: 'DSL-LEVEL-YEAR',
    name: 'Level at Year Query',
    pattern_en: '{variable} in {entity} {time}',
    pattern_sv: '{variable} i {entity} {time}',
    applies_to: {
      intent: 'level',
      risk_max: 'minimal',
      actors: ['general', 'finance', 'policy', 'journalism', 'machine_only'],
    },
    expand: {
      variable: { type: 'any' },
      entity: { type: 'geo_level', geo_levels: ['country'] },
      time: { type: 'range', range_years: 10 },
    },
    output: {
      max_queries: 500,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  
  // ========== COMPARISON TEMPLATES ==========
  {
    template_id: 'DSL-COMPARE-ENTITIES',
    name: 'Entity Comparison Query',
    pattern_en: 'Compare {variable} between {entity_a} and {entity_b}',
    pattern_sv: 'Jämför {variable} mellan {entity_a} och {entity_b}',
    applies_to: {
      intent: 'comparison',
      risk_max: 'moderate',
      actors: ['finance', 'policy', 'journalism', 'corporate'],
    },
    expand: {
      variable: { type: 'domain', domain_codes: ['TAX', 'LABOR', 'HEALTH', 'EDU'] },
      entity: { type: 'geo_level', geo_levels: ['country'] },
    },
    output: {
      max_queries: 400,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  {
    template_id: 'DSL-COMPARE-VS',
    name: 'VS Comparison Query',
    pattern_en: '{variable} {entity_a} vs {entity_b}',
    pattern_sv: '{variable} {entity_a} vs {entity_b}',
    applies_to: {
      intent: 'comparison',
      risk_max: 'minimal',
      actors: ['general', 'finance', 'journalism', 'machine_only'],
    },
    expand: {
      variable: { type: 'any' },
      entity: { type: 'geo_level', geo_levels: ['country', 'bloc'] },
    },
    output: {
      max_queries: 600,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  
  // ========== RANKING TEMPLATES ==========
  {
    template_id: 'DSL-RANK-HIGHEST',
    name: 'Highest Ranking Query',
    pattern_en: 'Countries with highest {variable}',
    pattern_sv: 'Länder med högst {variable}',
    applies_to: {
      intent: 'ranking',
      risk_max: 'minimal',
      actors: ['general', 'journalism', 'policy', 'finance'],
    },
    expand: {
      variable: { type: 'any' },
      entity: { type: 'fixed', values: ['global', 'OECD', 'EU', 'Nordic'] },
    },
    output: {
      max_queries: 250,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  {
    template_id: 'DSL-RANK-LOWEST',
    name: 'Lowest Ranking Query',
    pattern_en: 'Countries with lowest {variable}',
    pattern_sv: 'Länder med lägst {variable}',
    applies_to: {
      intent: 'ranking',
      risk_max: 'minimal',
      actors: ['general', 'journalism', 'policy', 'finance'],
    },
    expand: {
      variable: { type: 'any' },
      entity: { type: 'fixed', values: ['global', 'OECD', 'EU', 'Nordic'] },
    },
    output: {
      max_queries: 250,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  
  // ========== CORRELATION TEMPLATES (HIGH RISK) ==========
  {
    template_id: 'DSL-CORR-OBSERVED',
    name: 'Observed Correlation Query',
    pattern_en: 'Observed relationship between {variable_a} and {variable_b}',
    pattern_sv: 'Observerat samband mellan {variable_a} och {variable_b}',
    applies_to: {
      intent: 'correlation',
      risk_max: 'high',
      actors: ['academic', 'policy', 'finance'],
      cognitive_load_max: 'high',
    },
    expand: {
      variable: { type: 'domain', domain_codes: ['HEALTH', 'ECON', 'EDU'] },
      entity: { type: 'geo_level', geo_levels: ['country', 'bloc'] },
    },
    output: {
      max_queries: 50, // Limited due to high risk
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
  
  // ========== DISTRIBUTION TEMPLATES ==========
  {
    template_id: 'DSL-DIST-SPREAD',
    name: 'Distribution Spread Query',
    pattern_en: 'Distribution of {variable} across {entity}',
    pattern_sv: 'Fördelning av {variable} i {entity}',
    applies_to: {
      intent: 'distribution',
      risk_max: 'moderate',
      actors: ['policy', 'academic', 'journalism'],
      cognitive_load_max: 'medium',
    },
    expand: {
      variable: { type: 'domain', domain_codes: ['INEQUALITY', 'HOUSING', 'WELFARE'] },
      entity: { type: 'geo_level', geo_levels: ['country', 'region'] },
    },
    output: {
      max_queries: 100,
      deduplicate: true,
      generate_fingerprints: true,
      languages: ['en', 'sv'],
    },
  },
];

/**
 * DSL COMPILER
 * Compiles templates into generated queries
 */
export class DSLCompiler {
  private templates: DSLTemplate[];
  private generatedQueries: Map<string, GeneratedQuery> = new Map();
  
  constructor(templates: DSLTemplate[] = DSL_TEMPLATES) {
    this.templates = templates;
  }
  
  /**
   * Compile all templates
   */
  compileAll(): GeneratedQuery[] {
    const allQueries: GeneratedQuery[] = [];
    
    for (const template of this.templates) {
      const queries = this.compileTemplate(template);
      allQueries.push(...queries);
    }
    
    // Deduplicate by fingerprint
    const uniqueQueries = this.deduplicateQueries(allQueries);
    
    return uniqueQueries;
  }
  
  /**
   * Compile a single template
   */
  compileTemplate(template: DSLTemplate): GeneratedQuery[] {
    const queries: GeneratedQuery[] = [];
    const variables = this.expandVariables(template.expand.variable);
    const entities = this.expandEntities(template.expand.entity);
    const times = template.expand.time ? this.expandTimes(template.expand.time) : ['current'];
    
    let count = 0;
    const maxQueries = template.output.max_queries;
    
    for (const variable of variables) {
      for (const entity of entities) {
        for (const time of times) {
          if (count >= maxQueries) break;
          
          const query = this.generateQuery(template, variable, entity, time);
          if (query && !this.generatedQueries.has(query.fingerprint)) {
            queries.push(query);
            this.generatedQueries.set(query.fingerprint, query);
            count++;
          }
        }
        if (count >= maxQueries) break;
      }
      if (count >= maxQueries) break;
    }
    
    return queries;
  }
  
  /**
   * Generate a single query
   */
  private generateQuery(
    template: DSLTemplate,
    variable: string,
    entity: string,
    time: string
  ): GeneratedQuery | null {
    const intent = Array.isArray(template.applies_to.intent) 
      ? template.applies_to.intent[0] 
      : template.applies_to.intent;
    
    // Create fingerprint
    const fp = createSemanticFingerprint(intent, variable, entity, time);
    
    // Create signature
    const signature: QueryIntentSignature = {
      information_type: intent,
      cognitive_load: 'low',
      actor_type: template.applies_to.actors[0] || 'general',
      risk_level: template.applies_to.risk_max,
    };
    
    // Get matrix entry for exposure rules
    const matrixEntry = createMatrixEntry(signature);
    
    // Generate text
    let text_en = template.pattern_en
      .replace('{variable}', variable)
      .replace('{entity}', entity)
      .replace('{entity_a}', entity)
      .replace('{entity_b}', 'comparison target')
      .replace('{time}', time)
      .replace('{variable_a}', variable)
      .replace('{variable_b}', 'related variable');
    
    let text_sv = template.pattern_sv
      .replace('{variable}', variable)
      .replace('{entity}', entity)
      .replace('{entity_a}', entity)
      .replace('{entity_b}', 'jämförelseobjekt')
      .replace('{time}', time)
      .replace('{variable_a}', variable)
      .replace('{variable_b}', 'relaterad variabel');
    
    return {
      query_id: `Q-${template.template_id}-${fp.hash}`,
      template_id: template.template_id,
      text_en,
      text_sv,
      fingerprint: fp.hash,
      signature,
      canonical_url: `/answers/${intent}/${variable.toLowerCase().replace(/\s+/g, '-')}`,
      exposure: {
        search_engines: matrixEntry.exposure.search_engines > 0,
        ai_agents: matrixEntry.exposure.ai_agents > 0,
        human_ui: matrixEntry.exposure.human_ui > 0 && matrixEntry.expose_publicly,
      },
    };
  }
  
  /**
   * Expand variables based on rules
   */
  private expandVariables(rules: DSLVariableExpansion): string[] {
    if (rules.type === 'fixed' && rules.values) {
      return rules.values;
    }
    
    if (rules.type === 'domain' && rules.domain_codes) {
      // Sample variables per domain
      const domainVariables: Record<string, string[]> = {
        TAX: ['corporate tax rate', 'income tax', 'VAT rate', 'tax revenue'],
        DEMO: ['population', 'population growth', 'birth rate', 'death rate'],
        ECON: ['GDP', 'GDP per capita', 'inflation', 'unemployment'],
        HEALTH: ['life expectancy', 'healthcare spending', 'infant mortality'],
        LABOR: ['employment rate', 'wages', 'working hours'],
        HOUSING: ['house prices', 'rent levels', 'housing stock'],
        CRIME: ['crime rate', 'homicide rate', 'incarceration rate'],
        EDU: ['education spending', 'literacy rate', 'tertiary enrollment'],
        INEQUALITY: ['Gini coefficient', 'poverty rate', 'income inequality'],
        WELFARE: ['social spending', 'pension coverage', 'unemployment benefits'],
      };
      
      return rules.domain_codes.flatMap(code => domainVariables[code] || []);
    }
    
    // 'any' type - return common variables
    return [
      'GDP', 'population', 'unemployment', 'inflation', 
      'life expectancy', 'tax rate', 'education spending'
    ];
  }
  
  /**
   * Expand entities based on rules
   */
  private expandEntities(rules: DSLEntityExpansion): string[] {
    if (rules.type === 'fixed' && rules.values) {
      return rules.values;
    }
    
    if (rules.type === 'geo_level' && rules.geo_levels) {
      const geoEntities: Record<string, string[]> = {
        global: ['World', 'Global'],
        bloc: ['OECD', 'EU', 'Nordic', 'G7', 'G20'],
        country: ['Sweden', 'Norway', 'Denmark', 'Finland', 'Germany', 'UK', 'France', 'US', 'Japan'],
        region: ['Stockholm', 'Skåne', 'Västra Götaland'],
        municipal: ['Stockholm municipality', 'Gothenburg', 'Malmö'],
      };
      
      return rules.geo_levels.flatMap(level => geoEntities[level] || []);
    }
    
    return ['Sweden', 'EU', 'OECD'];
  }
  
  /**
   * Expand times based on rules
   */
  private expandTimes(rules: DSLTimeExpansion): string[] {
    if (rules.type === 'fixed' && rules.values) {
      return rules.values;
    }
    
    if (rules.type === 'range' && rules.range_years) {
      const currentYear = new Date().getFullYear();
      const times: string[] = [];
      for (let i = 0; i < rules.range_years; i++) {
        times.push(String(currentYear - i));
      }
      return times;
    }
    
    return ['2024', '2023', '2022', '2021', '2020'];
  }
  
  /**
   * Deduplicate queries by fingerprint
   */
  private deduplicateQueries(queries: GeneratedQuery[]): GeneratedQuery[] {
    const seen = new Set<string>();
    return queries.filter(q => {
      if (seen.has(q.fingerprint)) return false;
      seen.add(q.fingerprint);
      return true;
    });
  }
  
  /**
   * Get compilation statistics
   */
  getStats(): DSLCompilationStats {
    return {
      templates_count: this.templates.length,
      total_generated: this.generatedQueries.size,
      by_intent: this.countByIntent(),
      by_risk: this.countByRisk(),
      exposure_summary: this.summarizeExposure(),
    };
  }
  
  private countByIntent(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const q of this.generatedQueries.values()) {
      const intent = q.signature.information_type;
      counts[intent] = (counts[intent] || 0) + 1;
    }
    return counts;
  }
  
  private countByRisk(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const q of this.generatedQueries.values()) {
      const risk = q.signature.risk_level;
      counts[risk] = (counts[risk] || 0) + 1;
    }
    return counts;
  }
  
  private summarizeExposure(): { search: number; agent: number; ui: number } {
    let search = 0, agent = 0, ui = 0;
    for (const q of this.generatedQueries.values()) {
      if (q.exposure.search_engines) search++;
      if (q.exposure.ai_agents) agent++;
      if (q.exposure.human_ui) ui++;
    }
    return { search, agent, ui };
  }
}

/**
 * DSL Compilation Statistics
 */
export interface DSLCompilationStats {
  readonly templates_count: number;
  readonly total_generated: number;
  readonly by_intent: Record<string, number>;
  readonly by_risk: Record<string, number>;
  readonly exposure_summary: {
    readonly search: number;
    readonly agent: number;
    readonly ui: number;
  };
}

/**
 * DSL PRINCIPLES
 */
export const DSL_PRINCIPLES = {
  deterministic_not_prompts: true,
  templates_create_queries: true,
  anti_duplication_by_design: true,
  semantic_fingerprints_prevent_conflicts: true,
  same_semantics_all_languages: true,
} as const;

/**
 * Quick compile function
 */
export function compileAllTemplates(): GeneratedQuery[] {
  const compiler = new DSLCompiler();
  return compiler.compileAll();
}

/**
 * Get DSL statistics
 */
export function getDSLStats(): DSLCompilationStats {
  const compiler = new DSLCompiler();
  compiler.compileAll();
  return compiler.getStats();
}
