/**
 * CIVILIZATIONAL MEMORY LAYER (CML)
 * 
 * Core insight: Truth is worthless if it cannot survive time, narrative, and power shifts.
 * CML makes ST-OS civilization's memory, not just a service.
 * 
 * TRUTH AS ARTIFACT (IMMUTABLE MEMORY)
 * Everything displayed can be stored as a Truth Artifact.
 * This allows the future to ask: "What did they know then — really?"
 */

/**
 * TRUTH ARTIFACT
 * Immutable record of what was known at a point in time
 */
export interface TruthArtifact {
  readonly artifact_id: string;
  readonly artifact_type: 'indicator' | 'index' | 'answer' | 'decision_graph' | 'correlation';
  readonly created_at: string;
  readonly valid_as_of: string;
  readonly expires_at?: string;
  
  // What was known
  readonly what_was_known: KnownFact[];
  readonly what_was_uncertain: UncertaintyRecord[];
  readonly what_was_unknown: UnknownRecord[];
  
  // Provenance
  readonly data_sources: DataSourceRecord[];
  readonly methodology: MethodologyRecord;
  readonly confidence: number; // 0-1
  
  // Immutability
  readonly checksum: string;
  readonly signature?: string;
  readonly supersedes?: string; // Previous artifact_id
  readonly superseded_by?: string; // Future artifact_id
}

/**
 * KNOWN FACT
 */
export interface KnownFact {
  readonly fact_id: string;
  readonly statement: string;
  readonly value?: number | string;
  readonly unit?: string;
  readonly confidence: number;
  readonly source_ids: string[];
}

/**
 * UNCERTAINTY RECORD
 */
export interface UncertaintyRecord {
  readonly uncertainty_type: 'measurement' | 'sampling' | 'methodology' | 'coverage' | 'definition';
  readonly description: string;
  readonly magnitude: 'low' | 'medium' | 'high';
  readonly impact_on_conclusions: string;
}

/**
 * UNKNOWN RECORD
 */
export interface UnknownRecord {
  readonly category: string;
  readonly description: string;
  readonly reason: 'no_data' | 'not_measurable' | 'not_asked' | 'redacted';
  readonly importance: 'critical' | 'significant' | 'minor';
}

/**
 * DATA SOURCE RECORD
 */
export interface DataSourceRecord {
  readonly source_id: string;
  readonly name: string;
  readonly organization: string;
  readonly collection_method: string;
  readonly collection_period: string;
  readonly reliability_score: number;
  readonly url?: string;
}

/**
 * METHODOLOGY RECORD
 */
export interface MethodologyRecord {
  readonly method_id: string;
  readonly description: string;
  readonly version: string;
  readonly changes_from_previous?: string;
  readonly limitations: string[];
  readonly assumptions: string[];
}

/**
 * CREATE TRUTH ARTIFACT
 */
export function createTruthArtifact(params: {
  artifact_type: TruthArtifact['artifact_type'];
  known_facts: KnownFact[];
  uncertainties: UncertaintyRecord[];
  unknowns: UnknownRecord[];
  sources: DataSourceRecord[];
  methodology: MethodologyRecord;
  confidence: number;
}): TruthArtifact {
  const now = new Date().toISOString();
  const artifact_id = `${params.artifact_type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create checksum from content
  const content = JSON.stringify({
    known: params.known_facts,
    uncertain: params.uncertainties,
    unknown: params.unknowns,
    sources: params.sources,
    methodology: params.methodology,
  });
  const checksum = simpleHash(content);
  
  return {
    artifact_id,
    artifact_type: params.artifact_type,
    created_at: now,
    valid_as_of: now,
    what_was_known: params.known_facts,
    what_was_uncertain: params.uncertainties,
    what_was_unknown: params.unknowns,
    data_sources: params.sources,
    methodology: params.methodology,
    confidence: params.confidence,
    checksum,
  };
}

/**
 * SIMPLE HASH (for checksums)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * VERIFY ARTIFACT INTEGRITY
 */
export function verifyArtifactIntegrity(artifact: TruthArtifact): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Verify checksum
  const content = JSON.stringify({
    known: artifact.what_was_known,
    uncertain: artifact.what_was_uncertain,
    unknown: artifact.what_was_unknown,
    sources: artifact.data_sources,
    methodology: artifact.methodology,
  });
  const expectedChecksum = simpleHash(content);
  
  if (expectedChecksum !== artifact.checksum) {
    issues.push('Checksum mismatch — artifact may have been modified');
  }
  
  // Verify required fields
  if (artifact.what_was_known.length === 0) {
    issues.push('Artifact contains no known facts');
  }
  
  if (artifact.data_sources.length === 0) {
    issues.push('Artifact has no data sources');
  }
  
  if (!artifact.methodology?.method_id) {
    issues.push('Artifact has no methodology record');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
