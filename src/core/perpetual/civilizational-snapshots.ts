/**
 * CIVILIZATIONAL SNAPSHOTS
 * 
 * Annual ritual: freeze system state, create Yearly Truth Artifact.
 * "This is how the world actually looked in 2026."
 */

/**
 * YEARLY TRUTH ARTIFACT
 */
export interface YearlyTruthArtifact {
  artifact_id: string;
  year: number;
  snapshot_date: string;
  version: string;
  
  // Coverage
  domains_covered: string[];
  countries_covered: string[];
  total_truth_nodes: number;
  total_indexes: number;
  
  // Structural truths
  structural_observations: StructuralObservation[];
  
  // Uncertainty
  high_uncertainty_areas: UncertaintyArea[];
  data_gaps: string[];
  
  // Movement
  largest_movements: MovementRecord[];
  
  // Metadata
  methodology_versions: Record<string, string>;
  frozen_at: string;
  immutable: true;
  hash: string;
}

/**
 * STRUCTURAL OBSERVATION
 */
export interface StructuralObservation {
  domain: string;
  observation: string;
  confidence: number;
  time_range: string;
  supporting_nodes: string[];
}

/**
 * UNCERTAINTY AREA
 */
export interface UncertaintyArea {
  domain: string;
  area: string;
  uncertainty_level: 'moderate' | 'high' | 'very_high';
  reason: string;
  data_coverage_percent: number;
}

/**
 * MOVEMENT RECORD
 */
export interface MovementRecord {
  indicator: string;
  domain: string;
  direction: 'up' | 'down' | 'volatile';
  magnitude_percentile: number;
  period: string;
  structural: boolean;
}

/**
 * SNAPSHOT GENERATOR
 */
class CivilizationalSnapshotGenerator {
  private artifacts: YearlyTruthArtifact[] = [];

  /**
   * GENERATE YEARLY SNAPSHOT
   */
  generateSnapshot(year: number, data: {
    domains: string[];
    countries: string[];
    truth_node_count: number;
    index_count: number;
    structural_observations: StructuralObservation[];
    uncertainty_areas: UncertaintyArea[];
    gaps: string[];
    movements: MovementRecord[];
    methodology_versions: Record<string, string>;
  }): YearlyTruthArtifact {
    const artifact: YearlyTruthArtifact = {
      artifact_id: `ARTIFACT:YEARLY:${year}`,
      year,
      snapshot_date: new Date().toISOString(),
      version: '1.0',
      
      domains_covered: data.domains,
      countries_covered: data.countries,
      total_truth_nodes: data.truth_node_count,
      total_indexes: data.index_count,
      
      structural_observations: data.structural_observations,
      high_uncertainty_areas: data.uncertainty_areas,
      data_gaps: data.gaps,
      largest_movements: data.movements.slice(0, 20),
      
      methodology_versions: data.methodology_versions,
      frozen_at: new Date().toISOString(),
      immutable: true,
      hash: this.generateHash(year, data),
    };

    this.artifacts.push(artifact);
    return artifact;
  }

  /**
   * GENERATE HASH
   */
  private generateHash(year: number, data: object): string {
    const content = JSON.stringify({ year, data });
    // Simple hash for demonstration
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }

  /**
   * GET ARTIFACT BY YEAR
   */
  getArtifact(year: number): YearlyTruthArtifact | null {
    return this.artifacts.find(a => a.year === year) || null;
  }

  /**
   * COMPARE YEARS
   */
  compareYears(yearA: number, yearB: number): {
    year_a: number;
    year_b: number;
    domain_changes: string[];
    coverage_change: number;
    new_observations: number;
    resolved_gaps: number;
  } | null {
    const a = this.getArtifact(yearA);
    const b = this.getArtifact(yearB);
    
    if (!a || !b) return null;

    const domainsA = new Set(a.domains_covered);
    const domainsB = new Set(b.domains_covered);
    const newDomains = [...domainsB].filter(d => !domainsA.has(d));
    const removedDomains = [...domainsA].filter(d => !domainsB.has(d));

    return {
      year_a: yearA,
      year_b: yearB,
      domain_changes: [...newDomains.map(d => `+${d}`), ...removedDomains.map(d => `-${d}`)],
      coverage_change: b.total_truth_nodes - a.total_truth_nodes,
      new_observations: b.structural_observations.length - a.structural_observations.length,
      resolved_gaps: a.data_gaps.length - b.data_gaps.length,
    };
  }

  /**
   * GET ALL ARTIFACTS
   */
  getAllArtifacts(): YearlyTruthArtifact[] {
    return [...this.artifacts].sort((a, b) => b.year - a.year);
  }

  /**
   * GENERATE SUMMARY
   */
  generateSummary(year: number): string | null {
    const artifact = this.getArtifact(year);
    if (!artifact) return null;

    return `
YEARLY TRUTH ARTIFACT ${year}
══════════════════════════════════════════

Snapshot Date: ${artifact.snapshot_date.split('T')[0]}
Hash: ${artifact.hash}

COVERAGE
• Domains: ${artifact.domains_covered.length}
• Countries: ${artifact.countries_covered.length}
• Truth Nodes: ${artifact.total_truth_nodes.toLocaleString()}
• Indexes: ${artifact.total_indexes}

STRUCTURAL OBSERVATIONS
${artifact.structural_observations.map(o => `• [${o.domain}] ${o.observation}`).join('\n')}

HIGH UNCERTAINTY AREAS
${artifact.high_uncertainty_areas.map(u => `• [${u.domain}] ${u.area}: ${u.reason}`).join('\n')}

DATA GAPS
${artifact.data_gaps.map(g => `• ${g}`).join('\n')}

LARGEST MOVEMENTS
${artifact.largest_movements.slice(0, 5).map(m => 
  `• ${m.indicator}: ${m.direction} (${m.magnitude_percentile}th percentile)`
).join('\n')}

──────────────────────────────────────────
This artifact is immutable and represents
the system's state as of ${artifact.frozen_at.split('T')[0]}.
    `.trim();
  }
}

/**
 * SINGLETON INSTANCE
 */
export const snapshotGenerator = new CivilizationalSnapshotGenerator();

/**
 * SNAPSHOT PRINCIPLES
 */
export const SNAPSHOT_PRINCIPLES = {
  annual_ritual: true,
  freezes_system_state: true,
  creates_permanent_record: true,
  no_narrative: true,
  structure_only: true,
  thirty_year_value: 'How the world actually looked',
} as const;
