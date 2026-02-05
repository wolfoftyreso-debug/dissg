/**
 * TRUTH NODE — THE SMALLEST UNIT
 * 
 * Everything in the system is a Truth Node.
 * This makes everything navigable, comparable, versionable.
 */

/**
 * TRUTH NODE (CORE OBJECT)
 */
export interface TruthNode {
  readonly node_id: string;
  readonly type: TruthNodeType;
  readonly scope: TruthScope;
  readonly semantic_importance: SemanticImportanceMarkers;
  readonly data_ref: readonly DataReference[];
  readonly confidence: number;
  readonly limitations: readonly string[];
  readonly relations: TruthRelations;
  readonly metadata: TruthNodeMetadata;
}

export type TruthNodeType = 
  | 'answer'       // Answer Packet
  | 'index'        // Aggregated Index
  | 'signal'       // Change Detection
  | 'decision'     // Decision Graph Node
  | 'indicator'    // Raw Indicator
  | 'entity'       // Geographic/Organizational Entity
  | 'artifact';    // Historical Truth Artifact

/**
 * SCOPE — Where and when this truth applies
 */
export interface TruthScope {
  readonly geo: GeoScope;
  readonly population: PopulationScope;
  readonly time: TimeScope;
}

export interface GeoScope {
  readonly level: 'global' | 'region' | 'country' | 'nuts1' | 'nuts2' | 'nuts3' | 'municipality';
  readonly code: string;
  readonly name: string;
}

export interface PopulationScope {
  readonly type: 'total' | 'demographic' | 'defined';
  readonly definition?: string;
  readonly size_estimate?: number;
}

export interface TimeScope {
  readonly type: 'point' | 'range' | 'series';
  readonly start: string;
  readonly end?: string;
  readonly granularity: 'year' | 'quarter' | 'month' | 'week' | 'day';
}

/**
 * SEMANTIC IMPORTANCE MARKERS
 * Used for attention guidance (not behavior control)
 */
export interface SemanticImportanceMarkers {
  readonly structural: boolean;  // 🧱 Persistent, systemic
  readonly acute: boolean;       // ⚡ Recent deviation
  readonly contextual: boolean;  // 🌊 Normal variation
  readonly importance_score: number;
  readonly importance_rationale?: string;
}

/**
 * DATA REFERENCE — Links to underlying data
 */
export interface DataReference {
  readonly ref_id: string;
  readonly ref_type: 'kpi_value' | 'observation' | 'source' | 'artifact';
  readonly source_id: string;
  readonly source_name: string;
  readonly timestamp: string;
}

/**
 * TRUTH RELATIONS — 4-way navigation
 */
export interface TruthRelations {
  readonly up: readonly RelationLink[];      // Why this exists (context)
  readonly down: readonly RelationLink[];    // More granular (depth)
  readonly side: readonly RelationLink[];    // Related systems (lateral)
  readonly forward: readonly RelationLink[]; // Next valid questions
}

export interface RelationLink {
  readonly target_id: string;
  readonly relationship: RelationType;
  readonly strength: number;
  readonly data_available: boolean;
}

export type RelationType = 
  | 'parent_of'
  | 'child_of'
  | 'correlates_with'
  | 'influences'
  | 'part_of'
  | 'precedes'
  | 'follows'
  | 'contrasts_with'
  | 'similar_to';

/**
 * METADATA
 */
export interface TruthNodeMetadata {
  readonly created_at: string;
  readonly updated_at: string;
  readonly version: number;
  readonly checksum: string;
  readonly methodology_version: string;
}

/**
 * CREATE TRUTH NODE
 */
export function createTruthNode(
  type: TruthNodeType,
  scope: TruthScope,
  importance: SemanticImportanceMarkers,
  confidence: number
): TruthNode {
  const now = new Date().toISOString();
  const node_id = `tn_${type}_${scope.geo.code}_${Date.now()}`;
  
  return {
    node_id,
    type,
    scope,
    semantic_importance: importance,
    data_ref: [],
    confidence,
    limitations: [],
    relations: {
      up: [],
      down: [],
      side: [],
      forward: [],
    },
    metadata: {
      created_at: now,
      updated_at: now,
      version: 1,
      checksum: generateChecksum(node_id, now),
      methodology_version: '1.0.0',
    },
  };
}

/**
 * GENERATE CHECKSUM
 */
function generateChecksum(id: string, timestamp: string): string {
  const input = `${id}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * VALIDATE TRUTH NODE
 */
export function validateTruthNode(node: Partial<TruthNode>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!node.node_id) errors.push('Missing node_id');
  if (!node.type) errors.push('Missing type');
  if (!node.scope) errors.push('Missing scope');
  if (!node.scope?.geo) errors.push('Missing geo scope');
  if (!node.scope?.time) errors.push('Missing time scope');
  if (node.confidence === undefined) errors.push('Missing confidence');
  if (node.confidence !== undefined && (node.confidence < 0 || node.confidence > 1)) {
    errors.push('Confidence must be between 0 and 1');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
