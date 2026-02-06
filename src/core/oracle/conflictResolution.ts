/**
 * ORACLE CONFLICT RESOLUTION
 * 
 * The oracle does NOT decide who is right.
 * It reports conflict.
 */

// ============================================
// CONFLICT TYPES
// ============================================

export type ConflictType = 
  | 'Methodology'      // Different methods produce different results
  | 'Definition'       // Different definitions of the same concept
  | 'Scope'            // Different geographic or temporal scope
  | 'Measurement'      // Different measurement approaches
  | 'Interpretation'   // Same data, different interpretations
  | 'Fundamental';     // Irreconcilable difference

// ============================================
// DATA CONFLICT STRUCTURE
// ============================================

export interface DataConflict {
  exists: boolean;
  sources_involved: string[];
  difference_type: ConflictType;
  resolution: 'None' | 'Partial' | 'Resolved';
  
  // Details
  magnitude?: string;           // "Source A: 5%, Source B: 12%"
  likely_cause?: string;        // "Different base year"
  comparability_note?: string;  // "Not directly comparable due to..."
}

export interface ConflictReport {
  query_id: string;
  conflicts: DataConflict[];
  can_answer: boolean;
  answer_confidence: 'High' | 'Medium' | 'Low' | 'None';
  recommended_approach: 'single_source' | 'range' | 'all_sources' | 'abstain';
}

// ============================================
// CONFLICT DETECTION
// ============================================

export interface SourceDataPoint {
  source: string;
  value: number;
  unit: string;
  methodology: string;
  period: string;
  definition?: string;
}

/**
 * Detect conflicts between data sources
 */
export function detectConflicts(
  dataPoints: SourceDataPoint[],
  tolerancePercent: number = 10
): ConflictReport {
  if (dataPoints.length < 2) {
    return {
      query_id: generateQueryId(),
      conflicts: [],
      can_answer: dataPoints.length === 1,
      answer_confidence: dataPoints.length === 1 ? 'Medium' : 'None',
      recommended_approach: dataPoints.length === 1 ? 'single_source' : 'abstain',
    };
  }
  
  const conflicts: DataConflict[] = [];
  
  // Check for value conflicts
  const values = dataPoints.map(d => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const spreadPercent = ((maxVal - minVal) / Math.max(Math.abs(maxVal), Math.abs(minVal))) * 100;
  
  if (spreadPercent > tolerancePercent) {
    // Determine conflict type
    const methodologies = new Set(dataPoints.map(d => d.methodology));
    const definitions = new Set(dataPoints.map(d => d.definition).filter(Boolean));
    const periods = new Set(dataPoints.map(d => d.period));
    
    let conflictType: ConflictType = 'Fundamental';
    
    if (methodologies.size > 1) {
      conflictType = 'Methodology';
    } else if (definitions.size > 1) {
      conflictType = 'Definition';
    } else if (periods.size > 1) {
      conflictType = 'Scope';
    }
    
    conflicts.push({
      exists: true,
      sources_involved: dataPoints.map(d => d.source),
      difference_type: conflictType,
      resolution: 'None',
      magnitude: `Range: ${minVal} to ${maxVal} (${spreadPercent.toFixed(1)}% spread)`,
      likely_cause: getLikelyCause(conflictType),
    });
  }
  
  // Determine recommended approach
  let recommended_approach: ConflictReport['recommended_approach'] = 'all_sources';
  let answer_confidence: ConflictReport['answer_confidence'] = 'Medium';
  
  if (conflicts.length === 0) {
    recommended_approach = 'single_source';
    answer_confidence = 'High';
  } else if (spreadPercent > 50) {
    recommended_approach = 'abstain';
    answer_confidence = 'None';
  } else if (spreadPercent > 20) {
    recommended_approach = 'range';
    answer_confidence = 'Low';
  }
  
  return {
    query_id: generateQueryId(),
    conflicts,
    can_answer: recommended_approach !== 'abstain',
    answer_confidence,
    recommended_approach,
  };
}

function getLikelyCause(type: ConflictType): string {
  switch (type) {
    case 'Methodology':
      return 'Sources use different calculation methods';
    case 'Definition':
      return 'Sources define the concept differently';
    case 'Scope':
      return 'Sources cover different time periods or regions';
    case 'Measurement':
      return 'Sources use different measurement instruments';
    case 'Interpretation':
      return 'Sources interpret the same data differently';
    case 'Fundamental':
      return 'Irreconcilable difference in approach';
  }
}

function generateQueryId(): string {
  return `Q-${Date.now().toString(36).toUpperCase()}`;
}

// ============================================
// CONFLICT RESPONSE TEMPLATES
// ============================================

export const CONFLICT_RESPONSE_TEMPLATES = {
  // When conflict exists
  with_conflict: {
    en: 'Available sources show differing values: {source_values}. This is due to {conflict_type}.',
    sv: 'Tillgängliga källor visar olika värden: {source_values}. Detta beror på {conflict_type}.',
  },
  
  // When providing a range
  range_response: {
    en: 'Based on available sources, the value ranges from {min} to {max}.',
    sv: 'Baserat på tillgängliga källor varierar värdet från {min} till {max}.',
  },
  
  // When abstaining
  abstain_response: {
    en: 'Sources differ too significantly to provide a reliable answer. See data_conflict for details.',
    sv: 'Källor skiljer sig åt för mycket för att ge ett tillförlitligt svar. Se data_conflict för detaljer.',
  },
};

// ============================================
// PRIORITY HIERARCHY (FOR SOURCE SELECTION)
// ============================================

/**
 * When sources conflict and we must choose, this is the priority order.
 * Note: The oracle STILL reports the conflict even when selecting a primary.
 */
export const SOURCE_PRIORITY_HIERARCHY = {
  levels: [
    {
      priority: 1,
      name: 'Official Statistical Agency',
      examples: ['Eurostat', 'UN', 'OECD', 'World Bank', 'National Statistics'],
      trust_weight: 1.0,
    },
    {
      priority: 2,
      name: 'Peer-Reviewed Research',
      examples: ['Academic journals', 'Research institutions'],
      trust_weight: 0.9,
    },
    {
      priority: 3,
      name: 'International Organization',
      examples: ['IMF', 'WHO', 'ILO'],
      trust_weight: 0.85,
    },
    {
      priority: 4,
      name: 'National Government',
      examples: ['Ministry reports', 'Official publications'],
      trust_weight: 0.8,
    },
    {
      priority: 5,
      name: 'Industry Data',
      examples: ['Industry associations', 'Commercial data providers'],
      trust_weight: 0.7,
    },
  ],
  
  selection_rule: 'When conflict exists, prefer highest priority source but ALWAYS report conflict',
  
  never_suppress_conflict: true,
};

// ============================================
// ORACLE BEHAVIOR SUMMARY
// ============================================

export const CONFLICT_HANDLING_SUMMARY = {
  principle: 'The oracle does NOT decide who is right. It reports conflict.',
  
  behaviors: [
    'Always detect and report conflicts',
    'Never silently choose one source',
    'Provide ranges when appropriate',
    'Abstain when conflict is too severe',
    'Explain the type of conflict',
    'Never claim resolution when none exists',
  ],
  
  this_is_oracle_behavior: true,
};
