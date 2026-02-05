/**
 * DECISION ARTIFACTS
 * 
 * Every Decision Graph becomes:
 * - An artifact ID
 * - Version controlled
 * - Reproducible
 * 
 * Organizations can say:
 * "This decision was made based on these questions and this evidence."
 * 
 * This is legally powerful, organizationally invaluable, and AI-safe.
 */

/**
 * DECISION ARTIFACT
 */
export interface DecisionArtifact {
  /** Permanent, unique artifact ID */
  readonly artifact_id: string;
  
  /** Version number (immutable per version) */
  readonly version: number;
  
  /** Reproducibility hash */
  readonly hash: string;
  
  /** Decision type */
  readonly decision_type: string;
  
  /** Context at resolution time */
  readonly context: Readonly<Record<string, string>>;
  
  /** All question nodes with answers */
  readonly nodes: readonly ArtifactNode[];
  
  /** Confidence metrics */
  readonly confidence: {
    readonly overall: number;
    readonly completeness: number;
    readonly by_node: Readonly<Record<string, number>>;
  };
  
  /** Assumptions made */
  readonly assumptions: readonly ArtifactAssumption[];
  
  /** Limitations acknowledged */
  readonly limitations: readonly ArtifactLimitation[];
  
  /** Data sources used */
  readonly sources: readonly ArtifactSource[];
  
  /** Timestamp */
  readonly resolved_at: string;
  
  /** Valid until (after this, must re-resolve) */
  readonly valid_until: string;
  
  /** Governance attestation */
  readonly governance: {
    readonly gdg_version: string;
    readonly no_recommendation: true;
    readonly no_optimization: true;
    readonly audit_trail_id: string;
  };
  
  /** Signature (cryptographic proof) */
  readonly signature: string;
}

export interface ArtifactNode {
  readonly node_id: string;
  readonly question: string;
  readonly answer_type: string;
  readonly status: 'resolved' | 'unresolved' | 'insufficient_data';
  readonly confidence: number;
  readonly summary: string | null;
  readonly data_points: number;
  readonly time_range: { start: string; end: string } | null;
  readonly limitations: readonly string[];
}

export interface ArtifactAssumption {
  readonly assumption_id: string;
  readonly description: string;
  readonly required: boolean;
  readonly value_used: string | null;
}

export interface ArtifactLimitation {
  readonly limitation_id: string;
  readonly type: string;
  readonly description: string;
  readonly severity: 'minor' | 'moderate' | 'major';
}

export interface ArtifactSource {
  readonly source_id: string;
  readonly name: string;
  readonly reliability_score: number;
  readonly last_updated: string;
}

/**
 * ARTIFACT REGISTRY
 */
export interface ArtifactRegistry {
  /** Store an artifact (immutable once stored) */
  store(artifact: DecisionArtifact): Promise<string>;
  
  /** Retrieve by artifact ID */
  get(artifactId: string): Promise<DecisionArtifact | null>;
  
  /** Retrieve by artifact ID and version */
  getVersion(artifactId: string, version: number): Promise<DecisionArtifact | null>;
  
  /** List all versions of an artifact */
  listVersions(artifactId: string): Promise<number[]>;
  
  /** Verify artifact integrity */
  verify(artifact: DecisionArtifact): Promise<boolean>;
  
  /** Search artifacts by criteria */
  search(criteria: ArtifactSearchCriteria): Promise<DecisionArtifact[]>;
}

export interface ArtifactSearchCriteria {
  decision_type?: string;
  context_country?: string;
  context_sector?: string;
  resolved_after?: string;
  resolved_before?: string;
  min_confidence?: number;
  limit?: number;
}

/**
 * ARTIFACT ID GENERATION
 */
export function generateArtifactId(
  decisionType: string,
  context: Record<string, string>,
  timestamp: Date
): string {
  const contextPart = Object.entries(context)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}_${v}`)
    .join('_');
  
  const datePart = timestamp.toISOString().split('T')[0].replace(/-/g, '');
  
  return `${decisionType}_${contextPart}_${datePart}`;
}

/**
 * HASH GENERATION
 */
export function generateArtifactHash(artifact: Omit<DecisionArtifact, 'hash' | 'signature'>): string {
  // In production, this would be a proper cryptographic hash
  const content = JSON.stringify({
    artifact_id: artifact.artifact_id,
    version: artifact.version,
    decision_type: artifact.decision_type,
    context: artifact.context,
    nodes: artifact.nodes,
    resolved_at: artifact.resolved_at,
  });
  
  // Simple hash for demo (would use SHA-256 in production)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * ARTIFACT CITATION FORMAT
 */
export function formatCitation(artifact: DecisionArtifact): string {
  return `Decision Artifact ${artifact.artifact_id} v${artifact.version} (${artifact.resolved_at.split('T')[0]}). ` +
    `Resolved via Global Decision Grammar v${artifact.governance.gdg_version}. ` +
    `Hash: ${artifact.hash.substring(0, 20)}...`;
}

/**
 * ARTIFACT PRINCIPLES
 */
export const ARTIFACT_PRINCIPLES = {
  permanence: {
    statement: 'Once stored, an artifact cannot be modified',
    enforcement: 'Immutable storage + cryptographic hash',
  },
  
  reproducibility: {
    statement: 'Given the same inputs and timestamp, the same artifact results',
    enforcement: 'Deterministic resolution + input logging',
  },
  
  accountability: {
    statement: 'Organizations can cite artifacts as decision basis',
    enforcement: 'Permanent IDs + public verification',
  },
  
  legal_power: {
    statement: 'Artifacts serve as evidence of due diligence',
    use_cases: [
      'Board decisions',
      'Regulatory filings',
      'Investment committees',
      'Policy evaluations',
    ],
  },
  
  ai_safety: {
    statement: 'AI models can reference artifacts without hallucination risk',
    enforcement: 'Structured output + verification endpoints',
  },
} as const;
