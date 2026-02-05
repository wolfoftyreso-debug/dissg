/**
 * DEFINITION DRIFT ENGINE
 * 
 * Words change meaning. Diagnoses get redefined.
 * Economic measures get rebased. Political concepts drift.
 * 
 * This engine ensures no silent drift. Ever.
 */

/**
 * CHANGE TYPES
 */
export type DefinitionChangeType =
  | 'scope_narrowed'
  | 'scope_widened'
  | 'method_changed'
  | 'threshold_adjusted'
  | 'category_merged'
  | 'category_split'
  | 'rebased'
  | 'terminology_updated'
  | 'legal_redefined';

/**
 * COMPARABILITY LEVEL
 */
export type ComparabilityLevel =
  | 'full'           // Direct comparison valid
  | 'partial'        // Comparison with caveats
  | 'narrative_only' // Conceptually related but not comparable
  | 'incompatible';  // Cannot be compared

/**
 * DEFINITION VERSION
 */
export interface DefinitionVersion {
  version: string;
  valid_from: string;
  valid_to: string | null;
  changed_from: string | null;
  change_type: DefinitionChangeType | null;
  change_description: string;
  comparability_to_previous: ComparabilityLevel;
  source_document: string | null;
  methodology_hash: string;
}

/**
 * DRIFT RECORD
 */
export interface DriftRecord {
  node_id: string;
  detected_at: string;
  drift_type: 'semantic' | 'methodological' | 'cultural' | 'political';
  severity: 'minor' | 'moderate' | 'major' | 'breaking';
  old_version: string;
  new_version: string;
  impact_assessment: string;
  requires_restatement: boolean;
}

/**
 * COMPARABILITY ASSESSMENT
 */
export interface ComparabilityAssessment {
  node_a: string;
  node_b: string;
  version_a: string;
  version_b: string;
  level: ComparabilityLevel;
  caveats: string[];
  adjustment_factor: number | null;
  confidence: number;
}

/**
 * DEFINITION DRIFT ENGINE
 */
class DefinitionDriftEngine {
  private definitions: Map<string, DefinitionVersion[]> = new Map();
  private driftRecords: DriftRecord[] = [];
  private assessments: ComparabilityAssessment[] = [];

  /**
   * REGISTER DEFINITION VERSION
   */
  registerVersion(nodeId: string, version: DefinitionVersion): void {
    const versions = this.definitions.get(nodeId) || [];
    versions.push(version);
    this.definitions.set(nodeId, versions);
  }

  /**
   * GET CURRENT DEFINITION
   */
  getCurrentDefinition(nodeId: string): DefinitionVersion | null {
    const versions = this.definitions.get(nodeId);
    if (!versions || versions.length === 0) return null;
    return versions.find(v => v.valid_to === null) || versions[versions.length - 1];
  }

  /**
   * GET DEFINITION AT TIME
   */
  getDefinitionAt(nodeId: string, date: string): DefinitionVersion | null {
    const versions = this.definitions.get(nodeId);
    if (!versions) return null;
    
    const targetDate = new Date(date);
    return versions.find(v => {
      const from = new Date(v.valid_from);
      const to = v.valid_to ? new Date(v.valid_to) : new Date();
      return targetDate >= from && targetDate <= to;
    }) || null;
  }

  /**
   * DETECT DRIFT
   */
  detectDrift(nodeId: string, newDefinition: Partial<DefinitionVersion>): DriftRecord | null {
    const current = this.getCurrentDefinition(nodeId);
    if (!current) return null;
    
    // Compare methodology hashes
    if (newDefinition.methodology_hash && 
        newDefinition.methodology_hash !== current.methodology_hash) {
      const record: DriftRecord = {
        node_id: nodeId,
        detected_at: new Date().toISOString(),
        drift_type: 'methodological',
        severity: this.assessSeverity(newDefinition.change_type || null),
        old_version: current.version,
        new_version: newDefinition.version || 'unknown',
        impact_assessment: 'Methodology change detected',
        requires_restatement: newDefinition.change_type === 'rebased',
      };
      
      this.driftRecords.push(record);
      return record;
    }
    
    return null;
  }

  /**
   * ASSESS SEVERITY
   */
  private assessSeverity(changeType: DefinitionChangeType | null): DriftRecord['severity'] {
    switch (changeType) {
      case 'terminology_updated':
        return 'minor';
      case 'threshold_adjusted':
      case 'scope_narrowed':
      case 'scope_widened':
        return 'moderate';
      case 'method_changed':
      case 'category_merged':
      case 'category_split':
        return 'major';
      case 'rebased':
      case 'legal_redefined':
        return 'breaking';
      default:
        return 'minor';
    }
  }

  /**
   * ASSESS COMPARABILITY
   */
  assessComparability(
    nodeA: string, 
    versionA: string, 
    nodeB: string, 
    versionB: string
  ): ComparabilityAssessment {
    const defA = this.getVersionByNumber(nodeA, versionA);
    const defB = this.getVersionByNumber(nodeB, versionB);
    
    if (!defA || !defB) {
      return {
        node_a: nodeA,
        node_b: nodeB,
        version_a: versionA,
        version_b: versionB,
        level: 'incompatible',
        caveats: ['One or both definitions not found'],
        adjustment_factor: null,
        confidence: 0,
      };
    }
    
    // Same methodology = full comparability
    if (defA.methodology_hash === defB.methodology_hash) {
      return {
        node_a: nodeA,
        node_b: nodeB,
        version_a: versionA,
        version_b: versionB,
        level: 'full',
        caveats: [],
        adjustment_factor: 1.0,
        confidence: 0.95,
      };
    }
    
    // Check version chain
    if (nodeA === nodeB) {
      return this.assessVersionChainComparability(nodeA, versionA, versionB);
    }
    
    return {
      node_a: nodeA,
      node_b: nodeB,
      version_a: versionA,
      version_b: versionB,
      level: 'narrative_only',
      caveats: ['Different nodes with different methodologies'],
      adjustment_factor: null,
      confidence: 0.4,
    };
  }

  /**
   * ASSESS VERSION CHAIN COMPARABILITY
   */
  private assessVersionChainComparability(
    nodeId: string,
    versionA: string,
    versionB: string
  ): ComparabilityAssessment {
    const versions = this.definitions.get(nodeId) || [];
    const indexA = versions.findIndex(v => v.version === versionA);
    const indexB = versions.findIndex(v => v.version === versionB);
    
    if (indexA === -1 || indexB === -1) {
      return {
        node_a: nodeId,
        node_b: nodeId,
        version_a: versionA,
        version_b: versionB,
        level: 'incompatible',
        caveats: ['Version not found in chain'],
        adjustment_factor: null,
        confidence: 0,
      };
    }
    
    // Check all versions between for breaking changes
    const [start, end] = indexA < indexB ? [indexA, indexB] : [indexB, indexA];
    const caveats: string[] = [];
    let hasBreaking = false;
    
    for (let i = start + 1; i <= end; i++) {
      const v = versions[i];
      if (v.comparability_to_previous === 'incompatible') {
        hasBreaking = true;
        caveats.push(`Breaking change in ${v.version}: ${v.change_description}`);
      } else if (v.comparability_to_previous === 'partial') {
        caveats.push(`Partial compatibility in ${v.version}`);
      }
    }
    
    return {
      node_a: nodeId,
      node_b: nodeId,
      version_a: versionA,
      version_b: versionB,
      level: hasBreaking ? 'incompatible' : caveats.length > 0 ? 'partial' : 'full',
      caveats,
      adjustment_factor: hasBreaking ? null : 1.0,
      confidence: hasBreaking ? 0.2 : caveats.length > 0 ? 0.7 : 0.95,
    };
  }

  /**
   * GET VERSION BY NUMBER
   */
  private getVersionByNumber(nodeId: string, version: string): DefinitionVersion | null {
    const versions = this.definitions.get(nodeId);
    if (!versions) return null;
    return versions.find(v => v.version === version) || null;
  }

  /**
   * GET ALL DRIFT RECORDS
   */
  getDriftRecords(): DriftRecord[] {
    return [...this.driftRecords];
  }

  /**
   * GET BREAKING DRIFTS
   */
  getBreakingDrifts(): DriftRecord[] {
    return this.driftRecords.filter(r => r.severity === 'breaking');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_definitions: number;
    total_versions: number;
    drift_records: number;
    breaking_drifts: number;
  } {
    let totalVersions = 0;
    this.definitions.forEach(versions => {
      totalVersions += versions.length;
    });
    
    return {
      total_definitions: this.definitions.size,
      total_versions: totalVersions,
      drift_records: this.driftRecords.length,
      breaking_drifts: this.getBreakingDrifts().length,
    };
  }
}

/**
 * SINGLETON
 */
export const definitionDriftEngine = new DefinitionDriftEngine();

/**
 * PRINCIPLES
 */
export const DEFINITION_DRIFT_PRINCIPLES = {
  no_silent_drift: true,
  all_changes_versioned: true,
  comparability_always_shown: true,
  history_never_rewritten: true,
} as const;
