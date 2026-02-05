/**
 * MEASUREMENT LINEAGE (DATA FAMILY TREE)
 * 
 * For every node and index:
 * - Raw source
 * - Method
 * - Normalization
 * - Aggregation
 * - Version
 * 
 * Everything traceable backwards in the chain.
 * Future AI can "translate" old measures to new without losing truth.
 */

/**
 * LINEAGE STEP TYPES
 */
export type LineageStepType =
  | 'raw_collection'
  | 'cleaning'
  | 'normalization'
  | 'transformation'
  | 'aggregation'
  | 'derivation'
  | 'index_calculation';

/**
 * LINEAGE STEP
 */
export interface LineageStep {
  step_id: string;
  step_type: LineageStepType;
  order: number;
  input_ids: string[];
  output_id: string;
  method: string;
  method_version: string;
  parameters: Record<string, unknown>;
  timestamp: string;
  reversible: boolean;
  checksum: string;
}

/**
 * LINEAGE CHAIN
 */
export interface LineageChain {
  node_id: string;
  version: string;
  raw_source: {
    source_id: string;
    source_name: string;
    collection_date: string;
    collection_method: string;
    original_format: string;
  };
  steps: LineageStep[];
  final_checksum: string;
  created_at: string;
}

/**
 * TRANSLATION MAPPING
 */
export interface TranslationMapping {
  from_version: string;
  to_version: string;
  translation_function: string;
  accuracy_loss: number;
  reversible: boolean;
  caveats: string[];
}

/**
 * MEASUREMENT LINEAGE ENGINE
 */
class MeasurementLineageEngine {
  private chains: Map<string, LineageChain[]> = new Map();
  private translations: Map<string, TranslationMapping[]> = new Map();

  /**
   * REGISTER LINEAGE CHAIN
   */
  registerChain(chain: LineageChain): void {
    const existing = this.chains.get(chain.node_id) || [];
    existing.push(chain);
    this.chains.set(chain.node_id, existing);
  }

  /**
   * GET LINEAGE CHAIN
   */
  getChain(nodeId: string, version?: string): LineageChain | null {
    const chains = this.chains.get(nodeId);
    if (!chains || chains.length === 0) return null;
    
    if (version) {
      return chains.find(c => c.version === version) || null;
    }
    
    return chains[chains.length - 1];
  }

  /**
   * TRACE TO RAW SOURCE
   */
  traceToRawSource(nodeId: string): {
    source: LineageChain['raw_source'];
    steps_count: number;
    total_transformations: number;
  } | null {
    const chain = this.getChain(nodeId);
    if (!chain) return null;
    
    return {
      source: chain.raw_source,
      steps_count: chain.steps.length,
      total_transformations: chain.steps.filter(
        s => s.step_type === 'transformation' || s.step_type === 'derivation'
      ).length,
    };
  }

  /**
   * REGISTER TRANSLATION
   */
  registerTranslation(nodeId: string, mapping: TranslationMapping): void {
    const existing = this.translations.get(nodeId) || [];
    existing.push(mapping);
    this.translations.set(nodeId, existing);
  }

  /**
   * FIND TRANSLATION PATH
   */
  findTranslationPath(
    nodeId: string,
    fromVersion: string,
    toVersion: string
  ): TranslationMapping[] | null {
    const translations = this.translations.get(nodeId);
    if (!translations) return null;
    
    // Simple direct path
    const direct = translations.find(
      t => t.from_version === fromVersion && t.to_version === toVersion
    );
    if (direct) return [direct];
    
    // Try to find path through intermediate versions
    const path: TranslationMapping[] = [];
    let currentVersion = fromVersion;
    const visited = new Set<string>();
    
    while (currentVersion !== toVersion && !visited.has(currentVersion)) {
      visited.add(currentVersion);
      const next = translations.find(t => t.from_version === currentVersion);
      if (!next) return null;
      path.push(next);
      currentVersion = next.to_version;
    }
    
    if (currentVersion === toVersion) return path;
    return null;
  }

  /**
   * CALCULATE TRANSLATION ACCURACY
   */
  calculateTranslationAccuracy(path: TranslationMapping[]): {
    combined_accuracy: number;
    reversible: boolean;
    total_caveats: string[];
  } {
    let accuracy = 1.0;
    let reversible = true;
    const caveats: string[] = [];
    
    for (const step of path) {
      accuracy *= (1 - step.accuracy_loss);
      reversible = reversible && step.reversible;
      caveats.push(...step.caveats);
    }
    
    return {
      combined_accuracy: accuracy,
      reversible,
      total_caveats: [...new Set(caveats)],
    };
  }

  /**
   * VERIFY CHAIN INTEGRITY
   */
  verifyChainIntegrity(nodeId: string): {
    valid: boolean;
    issues: string[];
  } {
    const chain = this.getChain(nodeId);
    if (!chain) return { valid: false, issues: ['Chain not found'] };
    
    const issues: string[] = [];
    
    // Check step order
    for (let i = 1; i < chain.steps.length; i++) {
      if (chain.steps[i].order <= chain.steps[i - 1].order) {
        issues.push(`Step order violation at step ${i}`);
      }
    }
    
    // Check input-output connections
    const outputs = new Set<string>();
    outputs.add(chain.raw_source.source_id);
    
    for (const step of chain.steps) {
      for (const input of step.input_ids) {
        if (!outputs.has(input)) {
          issues.push(`Missing input ${input} for step ${step.step_id}`);
        }
      }
      outputs.add(step.output_id);
    }
    
    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * GENERATE LINEAGE REPORT
   */
  generateLineageReport(nodeId: string): string {
    const chain = this.getChain(nodeId);
    if (!chain) return `No lineage found for ${nodeId}`;
    
    const lines = [
      `MEASUREMENT LINEAGE: ${nodeId}`,
      '═'.repeat(50),
      '',
      `Raw Source: ${chain.raw_source.source_name}`,
      `Collected: ${chain.raw_source.collection_date}`,
      `Method: ${chain.raw_source.collection_method}`,
      '',
      'Transformation Chain:',
    ];
    
    for (const step of chain.steps) {
      lines.push(`  ${step.order}. [${step.step_type}] ${step.method} (v${step.method_version})`);
    }
    
    lines.push('');
    lines.push(`Final Checksum: ${chain.final_checksum}`);
    
    return lines.join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_nodes: number;
    total_chains: number;
    total_translations: number;
  } {
    let totalChains = 0;
    let totalTranslations = 0;
    
    this.chains.forEach(chains => { totalChains += chains.length; });
    this.translations.forEach(trans => { totalTranslations += trans.length; });
    
    return {
      total_nodes: this.chains.size,
      total_chains: totalChains,
      total_translations: totalTranslations,
    };
  }
}

/**
 * SINGLETON
 */
export const measurementLineage = new MeasurementLineageEngine();

/**
 * PRINCIPLES
 */
export const LINEAGE_PRINCIPLES = {
  all_steps_tracked: true,
  raw_source_always_known: true,
  translations_explicit: true,
  accuracy_loss_calculated: true,
  future_ai_compatible: true,
} as const;
