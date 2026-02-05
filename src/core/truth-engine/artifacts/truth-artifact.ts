/**
 * TRUTH ARTIFACT — Civilizational Memory
 * 
 * Makes it impossible to rewrite history.
 */

/**
 * TRUTH ARTIFACT — Immutable historical record
 */
export interface TruthArtifact {
  readonly id: string;
  readonly snapshot_date: string;
  readonly truth_nodes: readonly string[];
  readonly known: readonly KnownFact[];
  readonly uncertain: readonly UncertainFact[];
  readonly confidence: number;
  readonly methodology_version: string;
  readonly superseded_by?: string;
  readonly checksum: string;
}

export interface KnownFact {
  readonly statement: string;
  readonly source_nodes: readonly string[];
  readonly confidence: number;
  readonly valid_from: string;
  readonly valid_until?: string;
}

export interface UncertainFact {
  readonly statement: string;
  readonly uncertainty_type: 'data_gap' | 'methodology' | 'definition' | 'coverage';
  readonly description: string;
  readonly resolvable: boolean;
}

/**
 * CREATE TRUTH ARTIFACT
 */
export function createTruthArtifact(
  nodes: string[],
  known: KnownFact[],
  uncertain: UncertainFact[],
  confidence: number
): TruthArtifact {
  const now = new Date().toISOString();
  const id = `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    snapshot_date: now,
    truth_nodes: nodes,
    known,
    uncertain,
    confidence,
    methodology_version: '1.0.0',
    checksum: generateArtifactChecksum(id, nodes, now),
  };
}

/**
 * SUPERSEDE ARTIFACT
 */
export function supersedeArtifact(
  original: TruthArtifact,
  newArtifact: Omit<TruthArtifact, 'id' | 'superseded_by' | 'checksum'>
): { original: TruthArtifact; successor: TruthArtifact } {
  const successorId = `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const successor: TruthArtifact = {
    ...newArtifact,
    id: successorId,
    checksum: generateArtifactChecksum(
      successorId,
      [...newArtifact.truth_nodes],
      newArtifact.snapshot_date
    ),
  };
  
  const updatedOriginal: TruthArtifact = {
    ...original,
    superseded_by: successorId,
  };
  
  return { original: updatedOriginal, successor };
}

/**
 * VALIDATE ARTIFACT CHAIN
 */
export function validateArtifactChain(artifacts: TruthArtifact[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Sort by date
  const sorted = [...artifacts].sort(
    (a, b) => new Date(a.snapshot_date).getTime() - new Date(b.snapshot_date).getTime()
  );
  
  // Validate chain
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    if (current.superseded_by && current.superseded_by !== next.id) {
      errors.push(`Broken chain: ${current.id} should link to ${next.id}`);
    }
  }
  
  // Validate checksums
  for (const artifact of artifacts) {
    const expectedChecksum = generateArtifactChecksum(
      artifact.id,
      [...artifact.truth_nodes],
      artifact.snapshot_date
    );
    
    if (artifact.checksum !== expectedChecksum) {
      errors.push(`Invalid checksum for artifact ${artifact.id}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * QUERY HISTORICAL STATE
 */
export function queryHistoricalState(
  artifacts: TruthArtifact[],
  date: string
): TruthArtifact | null {
  const targetDate = new Date(date).getTime();
  
  // Find the artifact that was valid at the given date
  const validArtifacts = artifacts.filter(a => {
    const snapshotDate = new Date(a.snapshot_date).getTime();
    return snapshotDate <= targetDate;
  });
  
  if (validArtifacts.length === 0) return null;
  
  // Return the most recent one before the target date
  return validArtifacts.reduce((latest, current) => {
    const latestDate = new Date(latest.snapshot_date).getTime();
    const currentDate = new Date(current.snapshot_date).getTime();
    return currentDate > latestDate ? current : latest;
  });
}

/**
 * COMPARE ARTIFACTS
 */
export function compareArtifacts(
  older: TruthArtifact,
  newer: TruthArtifact
): ArtifactComparison {
  return {
    older_id: older.id,
    newer_id: newer.id,
    time_span_days: Math.floor(
      (new Date(newer.snapshot_date).getTime() - new Date(older.snapshot_date).getTime())
      / (1000 * 60 * 60 * 24)
    ),
    known_added: newer.known.filter(
      n => !older.known.some(o => o.statement === n.statement)
    ),
    known_removed: older.known.filter(
      o => !newer.known.some(n => n.statement === o.statement)
    ),
    uncertain_resolved: older.uncertain.filter(
      o => newer.known.some(n => n.statement.includes(o.statement.substring(0, 50)))
    ),
    uncertain_added: newer.uncertain.filter(
      n => !older.uncertain.some(o => o.statement === n.statement)
    ),
    confidence_change: newer.confidence - older.confidence,
    methodology_changed: older.methodology_version !== newer.methodology_version,
  };
}

export interface ArtifactComparison {
  readonly older_id: string;
  readonly newer_id: string;
  readonly time_span_days: number;
  readonly known_added: readonly KnownFact[];
  readonly known_removed: readonly KnownFact[];
  readonly uncertain_resolved: readonly UncertainFact[];
  readonly uncertain_added: readonly UncertainFact[];
  readonly confidence_change: number;
  readonly methodology_changed: boolean;
}

/**
 * HELPER: Generate artifact checksum
 */
function generateArtifactChecksum(
  id: string,
  nodes: string[],
  date: string
): string {
  const input = `${id}:${nodes.join(',')}:${date}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
