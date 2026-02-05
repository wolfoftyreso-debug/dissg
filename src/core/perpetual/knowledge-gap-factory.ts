/**
 * KNOWLEDGE GAP FACTORY
 * 
 * For every gap: inventory sources, classify the problem.
 * "This cannot be answered yet — here is why."
 */

/**
 * GAP CLASSIFICATION
 */
export type GapType = 'data_gap' | 'method_gap' | 'definition_gap';

/**
 * KNOWLEDGE GAP
 */
export interface KnowledgeGap {
  gap_id: string;
  question: string;
  domain: string;
  gap_type: GapType;
  severity: 'minor' | 'moderate' | 'major' | 'blocking';
  
  // Data gap specifics
  data_sources_needed: string[];
  data_sources_available: string[];
  coverage_percent: number;
  
  // Method gap specifics
  methodology_exists: boolean;
  methodology_validated: boolean;
  alternative_approaches: string[];
  
  // Definition gap specifics
  definition_ambiguity: string | null;
  conflicting_definitions: string[];
  resolution_proposal: string | null;
  
  // Resolution
  resolution_path: string;
  estimated_resolution_months: number | null;
  blocking_dependencies: string[];
  
  created_at: string;
  last_assessed: string;
}

/**
 * GAP RESPONSE
 */
export interface GapResponse {
  answerable: false;
  gap_id: string;
  reason: string;
  gap_type: GapType;
  what_we_know: string[];
  what_we_cannot_know: string[];
  resolution_path: string | null;
  estimated_timeline: string | null;
}

/**
 * KNOWLEDGE GAP REGISTRY
 */
class KnowledgeGapFactory {
  private gaps: Map<string, KnowledgeGap> = new Map();

  /**
   * REGISTER DATA GAP
   */
  registerDataGap(config: {
    question: string;
    domain: string;
    sources_needed: string[];
    sources_available: string[];
  }): KnowledgeGap {
    const coverage = config.sources_available.length / Math.max(config.sources_needed.length, 1);
    
    const gap: KnowledgeGap = {
      gap_id: this.generateId('DATA', config.domain),
      question: config.question,
      domain: config.domain,
      gap_type: 'data_gap',
      severity: coverage < 0.25 ? 'blocking' : coverage < 0.5 ? 'major' : coverage < 0.75 ? 'moderate' : 'minor',
      
      data_sources_needed: config.sources_needed,
      data_sources_available: config.sources_available,
      coverage_percent: Math.round(coverage * 100),
      
      methodology_exists: true,
      methodology_validated: true,
      alternative_approaches: [],
      
      definition_ambiguity: null,
      conflicting_definitions: [],
      resolution_proposal: null,
      
      resolution_path: `Acquire ${config.sources_needed.length - config.sources_available.length} additional data sources`,
      estimated_resolution_months: Math.ceil((config.sources_needed.length - config.sources_available.length) * 2),
      blocking_dependencies: config.sources_needed.filter(s => !config.sources_available.includes(s)),
      
      created_at: new Date().toISOString(),
      last_assessed: new Date().toISOString(),
    };

    this.gaps.set(gap.gap_id, gap);
    return gap;
  }

  /**
   * REGISTER METHOD GAP
   */
  registerMethodGap(config: {
    question: string;
    domain: string;
    alternative_approaches: string[];
    complexity: 'low' | 'medium' | 'high';
  }): KnowledgeGap {
    const gap: KnowledgeGap = {
      gap_id: this.generateId('METHOD', config.domain),
      question: config.question,
      domain: config.domain,
      gap_type: 'method_gap',
      severity: config.complexity === 'high' ? 'blocking' : config.complexity === 'medium' ? 'major' : 'moderate',
      
      data_sources_needed: [],
      data_sources_available: [],
      coverage_percent: 0,
      
      methodology_exists: false,
      methodology_validated: false,
      alternative_approaches: config.alternative_approaches,
      
      definition_ambiguity: null,
      conflicting_definitions: [],
      resolution_proposal: null,
      
      resolution_path: 'Develop and validate measurement methodology',
      estimated_resolution_months: config.complexity === 'high' ? 12 : config.complexity === 'medium' ? 6 : 3,
      blocking_dependencies: ['methodology_development'],
      
      created_at: new Date().toISOString(),
      last_assessed: new Date().toISOString(),
    };

    this.gaps.set(gap.gap_id, gap);
    return gap;
  }

  /**
   * REGISTER DEFINITION GAP
   */
  registerDefinitionGap(config: {
    question: string;
    domain: string;
    ambiguity: string;
    conflicting_definitions: string[];
    resolution_proposal?: string;
  }): KnowledgeGap {
    const gap: KnowledgeGap = {
      gap_id: this.generateId('DEF', config.domain),
      question: config.question,
      domain: config.domain,
      gap_type: 'definition_gap',
      severity: config.conflicting_definitions.length > 2 ? 'blocking' : 'major',
      
      data_sources_needed: [],
      data_sources_available: [],
      coverage_percent: 0,
      
      methodology_exists: true,
      methodology_validated: true,
      alternative_approaches: [],
      
      definition_ambiguity: config.ambiguity,
      conflicting_definitions: config.conflicting_definitions,
      resolution_proposal: config.resolution_proposal || null,
      
      resolution_path: 'Establish canonical ontological definition',
      estimated_resolution_months: 3,
      blocking_dependencies: ['ontology_resolution'],
      
      created_at: new Date().toISOString(),
      last_assessed: new Date().toISOString(),
    };

    this.gaps.set(gap.gap_id, gap);
    return gap;
  }

  /**
   * GENERATE GAP ID
   */
  private generateId(prefix: string, domain: string): string {
    const timestamp = Date.now().toString(36);
    return `GAP:${prefix}:${domain.toUpperCase()}:${timestamp}`;
  }

  /**
   * CREATE GAP RESPONSE
   */
  createGapResponse(gapId: string): GapResponse | null {
    const gap = this.gaps.get(gapId);
    if (!gap) return null;

    return {
      answerable: false,
      gap_id: gap.gap_id,
      reason: this.formatReason(gap),
      gap_type: gap.gap_type,
      what_we_know: this.extractKnown(gap),
      what_we_cannot_know: this.extractUnknown(gap),
      resolution_path: gap.resolution_path,
      estimated_timeline: gap.estimated_resolution_months 
        ? `${gap.estimated_resolution_months} months` 
        : null,
    };
  }

  /**
   * FORMAT REASON
   */
  private formatReason(gap: KnowledgeGap): string {
    switch (gap.gap_type) {
      case 'data_gap':
        return `Insufficient data: ${gap.coverage_percent}% coverage (${gap.data_sources_available.length}/${gap.data_sources_needed.length} sources)`;
      case 'method_gap':
        return 'No validated methodology exists for this measurement';
      case 'definition_gap':
        return `Definition ambiguity: ${gap.conflicting_definitions.length} conflicting definitions`;
    }
  }

  /**
   * EXTRACT KNOWN
   */
  private extractKnown(gap: KnowledgeGap): string[] {
    const known: string[] = [];
    
    if (gap.data_sources_available.length > 0) {
      known.push(`Data available from ${gap.data_sources_available.length} sources`);
    }
    if (gap.methodology_exists) {
      known.push('Measurement methodology exists');
    }
    if (gap.resolution_proposal) {
      known.push(`Resolution proposal: ${gap.resolution_proposal}`);
    }
    
    return known.length > 0 ? known : ['Gap identified and classified'];
  }

  /**
   * EXTRACT UNKNOWN
   */
  private extractUnknown(gap: KnowledgeGap): string[] {
    const unknown: string[] = [];
    
    if (gap.gap_type === 'data_gap') {
      unknown.push(`Missing ${gap.data_sources_needed.length - gap.data_sources_available.length} required data sources`);
    }
    if (!gap.methodology_validated) {
      unknown.push('Methodology not yet validated');
    }
    if (gap.definition_ambiguity) {
      unknown.push(`Definition unclear: ${gap.definition_ambiguity}`);
    }
    
    return unknown;
  }

  /**
   * GET ALL GAPS
   */
  getAllGaps(): KnowledgeGap[] {
    return Array.from(this.gaps.values());
  }

  /**
   * GET GAPS BY DOMAIN
   */
  getGapsByDomain(domain: string): KnowledgeGap[] {
    return this.getAllGaps().filter(g => g.domain === domain);
  }

  /**
   * GET BLOCKING GAPS
   */
  getBlockingGaps(): KnowledgeGap[] {
    return this.getAllGaps().filter(g => g.severity === 'blocking');
  }
}

/**
 * SINGLETON INSTANCE
 */
export const knowledgeGapFactory = new KnowledgeGapFactory();

/**
 * GAP FACTORY PRINCIPLES
 */
export const GAP_FACTORY_PRINCIPLES = {
  gaps_are_first_class: true,
  never_hide_limitations: true,
  classify_every_gap: true,
  provide_resolution_path: true,
  silence_over_speculation: true,
} as const;
