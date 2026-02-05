/**
 * ANSWER PACKET FACTORY
 * 
 * Humans design rules. Machines produce answers.
 * 
 * Ontology + Measures → AnswerType Mapper → Packet Generator → 
 * Safety Validator → Answer Packets (v1)
 */

import type { CanonicalAnswerTypeCode } from '../../usae/mao/canonical-types';
import type { DomainCode } from '../../usae/mao/unified-body';

/**
 * PACKET TEMPLATE
 */
export interface PacketTemplate {
  readonly template_id: string;
  readonly answer_type: CanonicalAnswerTypeCode;
  readonly domain: DomainCode;
  readonly text_template: string;
  readonly required_measures: readonly string[];
  readonly limitations_template: readonly string[];
  readonly footnotes_template: readonly string[];
}

/**
 * GENERATED PACKET
 */
export interface GeneratedPacket {
  readonly packet_id: string;
  readonly version: number;
  readonly answer_type: CanonicalAnswerTypeCode;
  readonly domain: DomainCode;
  readonly generated_at: string;
  readonly template_used: string;
  readonly measures_bound: readonly BoundMeasure[];
  readonly text: string;
  readonly limitations: readonly string[];
  readonly confidence_inputs: ConfidenceInputs;
  readonly validation_status: 'valid' | 'warning' | 'failed';
  readonly validation_errors?: readonly string[];
}

/**
 * BOUND MEASURE
 */
export interface BoundMeasure {
  readonly measure_id: string;
  readonly value: number | string;
  readonly unit: string;
  readonly source_id: string;
  readonly observed_at: string;
}

/**
 * CONFIDENCE INPUTS
 */
export interface ConfidenceInputs {
  readonly source_count: number;
  readonly source_tiers: readonly number[];
  readonly data_age_days: number;
  readonly definition_version: string;
  readonly coverage_ratio: number;
}

/**
 * FACTORY CONFIGURATION
 */
export interface FactoryConfig {
  readonly auto_generate: boolean;
  readonly require_multiple_sources: boolean;
  readonly max_data_age_days: number;
  readonly min_coverage_ratio: number;
  readonly fail_on_warning: boolean;
}

export const DEFAULT_FACTORY_CONFIG: FactoryConfig = {
  auto_generate: true,
  require_multiple_sources: true,
  max_data_age_days: 365,
  min_coverage_ratio: 0.7,
  fail_on_warning: false,
};

/**
 * FACTORY REGISTRY
 */
export class AnswerPacketFactory {
  private templates: Map<string, PacketTemplate> = new Map();
  private generated: Map<string, GeneratedPacket> = new Map();
  private config: FactoryConfig;

  constructor(config: FactoryConfig = DEFAULT_FACTORY_CONFIG) {
    this.config = config;
    this.registerDefaultTemplates();
  }

  /**
   * Register a packet template
   */
  registerTemplate(template: PacketTemplate): void {
    this.templates.set(template.template_id, template);
  }

  /**
   * Generate packet from template + measures
   */
  generatePacket(
    templateId: string,
    measures: readonly BoundMeasure[],
    overrides?: Partial<Pick<GeneratedPacket, 'text' | 'limitations'>>
  ): GeneratedPacket | null {
    const template = this.templates.get(templateId);
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }

    // Validate required measures
    const validation = this.validateMeasures(template, measures);
    if (validation.status === 'failed') {
      return {
        packet_id: `${template.domain}:packet:${templateId}:failed`,
        version: 0,
        answer_type: template.answer_type,
        domain: template.domain,
        generated_at: new Date().toISOString(),
        template_used: templateId,
        measures_bound: measures,
        text: '',
        limitations: [],
        confidence_inputs: this.calculateConfidenceInputs(measures),
        validation_status: 'failed',
        validation_errors: validation.errors,
      };
    }

    // Generate text from template
    const text = overrides?.text || this.interpolateText(template.text_template, measures);
    const limitations = overrides?.limitations || template.limitations_template;

    const packet: GeneratedPacket = {
      packet_id: `${template.domain}:answer:${templateId}:v1`,
      version: 1,
      answer_type: template.answer_type,
      domain: template.domain,
      generated_at: new Date().toISOString(),
      template_used: templateId,
      measures_bound: measures,
      text,
      limitations,
      confidence_inputs: this.calculateConfidenceInputs(measures),
      validation_status: validation.status,
      validation_errors: validation.errors.length > 0 ? validation.errors : undefined,
    };

    this.generated.set(packet.packet_id, packet);
    return packet;
  }

  /**
   * Get all generated packets
   */
  getAllPackets(): readonly GeneratedPacket[] {
    return Array.from(this.generated.values());
  }

  /**
   * Get factory stats
   */
  getStats(): FactoryStats {
    const packets = Array.from(this.generated.values());
    return {
      total_templates: this.templates.size,
      total_generated: packets.length,
      by_status: {
        valid: packets.filter(p => p.validation_status === 'valid').length,
        warning: packets.filter(p => p.validation_status === 'warning').length,
        failed: packets.filter(p => p.validation_status === 'failed').length,
      },
      by_domain: this.countByDomain(packets),
      by_answer_type: this.countByAnswerType(packets),
    };
  }

  private validateMeasures(
    template: PacketTemplate,
    measures: readonly BoundMeasure[]
  ): { status: 'valid' | 'warning' | 'failed'; errors: string[] } {
    const errors: string[] = [];
    const measureIds = new Set(measures.map(m => m.measure_id));

    // Check required measures
    for (const required of template.required_measures) {
      if (!measureIds.has(required)) {
        errors.push(`Missing required measure: ${required}`);
      }
    }

    // Check data age
    const now = Date.now();
    for (const measure of measures) {
      const age = (now - new Date(measure.observed_at).getTime()) / (1000 * 60 * 60 * 24);
      if (age > this.config.max_data_age_days) {
        errors.push(`Measure ${measure.measure_id} is ${Math.round(age)} days old (max: ${this.config.max_data_age_days})`);
      }
    }

    if (errors.length > 0) {
      return { 
        status: errors.some(e => e.includes('Missing required')) ? 'failed' : 'warning', 
        errors 
      };
    }

    return { status: 'valid', errors: [] };
  }

  private interpolateText(template: string, measures: readonly BoundMeasure[]): string {
    let text = template;
    for (const measure of measures) {
      text = text.replace(`{{${measure.measure_id}}}`, `${measure.value} ${measure.unit}`);
    }
    return text;
  }

  private calculateConfidenceInputs(measures: readonly BoundMeasure[]): ConfidenceInputs {
    const sources = new Set(measures.map(m => m.source_id));
    const ages = measures.map(m => 
      (Date.now() - new Date(m.observed_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      source_count: sources.size,
      source_tiers: [1, 2], // Would be derived from source registry
      data_age_days: Math.max(...ages, 0),
      definition_version: 'v1',
      coverage_ratio: 0.85, // Would be calculated from actual coverage
    };
  }

  private countByDomain(packets: GeneratedPacket[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const p of packets) {
      counts[p.domain] = (counts[p.domain] || 0) + 1;
    }
    return counts;
  }

  private countByAnswerType(packets: GeneratedPacket[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const p of packets) {
      counts[p.answer_type] = (counts[p.answer_type] || 0) + 1;
    }
    return counts;
  }

  private registerDefaultTemplates(): void {
    // Economy templates
    this.registerTemplate({
      template_id: 'inflation_current',
      answer_type: 'DESCRIPTIVE_STAT',
      domain: 'economy',
      text_template: 'Current inflation rate is {{inflation_rate}}.',
      required_measures: ['inflation_rate'],
      limitations_template: ['Based on official CPI data', 'Regional variations may apply'],
      footnotes_template: ['Updated monthly'],
    });

    // Healthcare templates
    this.registerTemplate({
      template_id: 'wait_times_trend',
      answer_type: 'TREND_CHANGE',
      domain: 'healthcare',
      text_template: 'Healthcare wait times have {{wait_time_trend}} over the past {{period}}.',
      required_measures: ['wait_time_trend', 'period'],
      limitations_template: ['Aggregated across facility types', 'Emergency care excluded'],
      footnotes_template: ['Source: National health registry'],
    });

    // Youth templates
    this.registerTemplate({
      template_id: 'sleep_problems_common',
      answer_type: 'RISK_PREVALENCE',
      domain: 'youth',
      text_template: 'Sleep problems are reported by approximately {{prevalence}} of teenagers.',
      required_measures: ['prevalence'],
      limitations_template: ['Self-reported data', 'Definition of "sleep problems" varies'],
      footnotes_template: ['Many teens experience temporary sleep changes during puberty'],
    });

    // Markets templates
    this.registerTemplate({
      template_id: 'index_volatility_historical',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      domain: 'markets',
      text_template: 'Historical volatility for {{index_name}} averages {{volatility}}.',
      required_measures: ['index_name', 'volatility'],
      limitations_template: ['Past performance does not predict future results', 'Calculated over {{period}}'],
      footnotes_template: ['Based on daily closing prices'],
    });
  }
}

/**
 * FACTORY STATS
 */
export interface FactoryStats {
  readonly total_templates: number;
  readonly total_generated: number;
  readonly by_status: {
    readonly valid: number;
    readonly warning: number;
    readonly failed: number;
  };
  readonly by_domain: Record<string, number>;
  readonly by_answer_type: Record<string, number>;
}

/**
 * CI RULE: If a packet cannot be auto-generated, it should be questioned
 */
export const FACTORY_PRINCIPLES = {
  humans_design_rules: true,
  machines_produce_answers: true,
  manual_packets_require_justification: true,
  failed_generation_blocks_release: true,
} as const;
