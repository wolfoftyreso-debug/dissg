/**
 * CONTROLLED INFINITE EXPLORATION
 * 
 * The system allows infinite exploration, but only via:
 * - Semantically valid questions
 * - Existing nodes
 * - Defined relationships
 * 
 * The user can never:
 * - End up in speculation
 * - Be drawn into narrative
 * - Be manipulated toward conclusion
 * 
 * This is controlled infinity.
 */

/**
 * EXPLORATION BOUNDARY
 * Defines what exploration is allowed
 */
export interface ExplorationBoundary {
  readonly node_id: string;
  readonly allowed_directions: ExplorationDirection[];
  readonly forbidden_paths: string[];
  readonly requires_data: boolean;
  readonly depth_limit?: number;
}

export type ExplorationDirection = 
  | 'deeper'      // More granular
  | 'broader'     // More abstract
  | 'lateral'     // Related topics
  | 'historical'  // Time-based
  | 'comparative' // Cross-entity
  | 'uncertainty';// What we don't know

/**
 * EXPLORATION REQUEST
 */
export interface ExplorationRequest {
  readonly from_node: string;
  readonly direction: ExplorationDirection;
  readonly query: string;
  readonly depth_requested: number;
}

/**
 * EXPLORATION VALIDATION
 */
export interface ExplorationValidation {
  readonly allowed: boolean;
  readonly reason?: string;
  readonly alternative_paths?: string[];
  readonly data_available: boolean;
  readonly confidence: number;
}

/**
 * SPECULATION PATTERNS (FORBIDDEN)
 */
export const SPECULATION_PATTERNS = [
  /what if/i,
  /would happen if/i,
  /predict/i,
  /forecast/i,
  /will be in \d+ years/i,
  /future of/i,
  /expect to see/i,
  /going to cause/i,
] as const;

/**
 * NARRATIVE PATTERNS (FORBIDDEN)
 */
export const NARRATIVE_PATTERNS = [
  /the story of/i,
  /the narrative/i,
  /the real reason/i,
  /what they don't want/i,
  /hidden truth/i,
  /conspiracy/i,
  /actually means/i,
] as const;

/**
 * CONCLUSION PATTERNS (FORBIDDEN)
 */
export const CONCLUSION_PATTERNS = [
  /therefore we should/i,
  /this proves/i,
  /the answer is/i,
  /the solution is/i,
  /the only way/i,
  /clearly shows/i,
  /obviously/i,
] as const;

/**
 * VALIDATE EXPLORATION REQUEST
 */
export function validateExplorationRequest(request: ExplorationRequest): ExplorationValidation {
  const query = request.query;
  
  // Check for speculation
  for (const pattern of SPECULATION_PATTERNS) {
    if (pattern.test(query)) {
      return {
        allowed: false,
        reason: 'Exploration cannot lead to speculation. Try: "What has historically happened when...?"',
        alternative_paths: ['historical_patterns', 'observed_correlations'],
        data_available: false,
        confidence: 0,
      };
    }
  }
  
  // Check for narrative
  for (const pattern of NARRATIVE_PATTERNS) {
    if (pattern.test(query)) {
      return {
        allowed: false,
        reason: 'Exploration shows data and patterns, not narratives. Try: "What does the data show about...?"',
        alternative_paths: ['data_patterns', 'measured_relationships'],
        data_available: false,
        confidence: 0,
      };
    }
  }
  
  // Check for conclusion-seeking
  for (const pattern of CONCLUSION_PATTERNS) {
    if (pattern.test(query)) {
      return {
        allowed: false,
        reason: 'The system does not provide conclusions. Try: "What are the observed patterns in...?"',
        alternative_paths: ['pattern_exploration', 'uncertainty_mapping'],
        data_available: false,
        confidence: 0,
      };
    }
  }
  
  // Valid exploration
  return {
    allowed: true,
    data_available: true, // Would check against data catalog
    confidence: 0.8,
  };
}

/**
 * EXPLORATION PATH
 */
export interface ExplorationPath {
  readonly path_id: string;
  readonly from_node: string;
  readonly to_node: string;
  readonly direction: ExplorationDirection;
  readonly relationship: string;
  readonly data_coverage: number;
  readonly valid: boolean;
}

/**
 * GENERATE VALID PATHS
 */
export function generateValidPaths(from_node: string, available_data: string[]): ExplorationPath[] {
  // This would be populated from the actual knowledge graph
  // Showing structure only
  const paths: ExplorationPath[] = [
    {
      path_id: `${from_node}_deeper_1`,
      from_node,
      to_node: `${from_node}_temporal`,
      direction: 'deeper',
      relationship: 'temporal_breakdown',
      data_coverage: 0.95,
      valid: true,
    },
    {
      path_id: `${from_node}_deeper_2`,
      from_node,
      to_node: `${from_node}_geographic`,
      direction: 'deeper',
      relationship: 'geographic_breakdown',
      data_coverage: 0.85,
      valid: true,
    },
    {
      path_id: `${from_node}_lateral_1`,
      from_node,
      to_node: `${from_node}_related`,
      direction: 'lateral',
      relationship: 'correlation',
      data_coverage: 0.75,
      valid: true,
    },
    {
      path_id: `${from_node}_historical_1`,
      from_node,
      to_node: `${from_node}_history`,
      direction: 'historical',
      relationship: 'time_series',
      data_coverage: 0.90,
      valid: true,
    },
    {
      path_id: `${from_node}_uncertainty_1`,
      from_node,
      to_node: `${from_node}_gaps`,
      direction: 'uncertainty',
      relationship: 'data_limitations',
      data_coverage: 1.0, // We always know our gaps
      valid: true,
    },
  ];
  
  return paths;
}

/**
 * DEAD END CHECK
 * Ensures no path leads to a dead end
 */
export function checkDeadEnd(path: ExplorationPath): {
  is_dead_end: boolean;
  reason?: string;
  alternatives?: string[];
} {
  if (!path.valid) {
    return {
      is_dead_end: true,
      reason: 'Path not valid',
      alternatives: ['return_to_parent', 'try_different_direction'],
    };
  }
  
  if (path.data_coverage < 0.1) {
    return {
      is_dead_end: true,
      reason: 'Insufficient data coverage',
      alternatives: ['view_available_data', 'explore_uncertainty'],
    };
  }
  
  return {
    is_dead_end: false,
  };
}

/**
 * EXPLORATION STATE
 */
export interface ExplorationState {
  readonly session_id: string;
  readonly current_node: string;
  readonly path_history: readonly string[];
  readonly depth_level: number;
  readonly available_paths: readonly ExplorationPath[];
  readonly blocked_paths: readonly string[];
  readonly can_go_deeper: boolean;
  readonly can_go_broader: boolean;
}

/**
 * CREATE EXPLORATION STATE
 */
export function createExplorationState(
  node_id: string,
  available_data: string[]
): ExplorationState {
  const paths = generateValidPaths(node_id, available_data);
  
  return {
    session_id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    current_node: node_id,
    path_history: [node_id],
    depth_level: 1,
    available_paths: paths,
    blocked_paths: [],
    can_go_deeper: paths.some(p => p.direction === 'deeper' && p.valid),
    can_go_broader: paths.some(p => p.direction === 'broader' && p.valid),
  };
}
