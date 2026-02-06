/**
 * ORACLE MEMORY
 * 
 * The oracle does NOT learn preferences.
 * It only learns where knowledge gaps exist.
 * 
 * This drives future ingest, not future answers.
 */

// ============================================
// WHAT THE ORACLE LEARNS (EXHAUSTIVE)
// ============================================

export const ORACLE_LEARNING_SCOPE = {
  // What it MAY learn
  allowed_learning: [
    'which_questions_result_in_unknown',
    'which_domains_lack_data',
    'where_coverage_needs_expansion',
    'which_source_conflicts_recur',
    'which_methodologies_diverge',
  ],
  
  // What it MUST NOT learn
  forbidden_learning: [
    'user_preferences',
    'answer_patterns_to_replicate',
    'which_answers_users_like',
    'how_to_phrase_things_for_approval',
    'what_users_want_to_hear',
    'sentiment_or_opinion_signals',
  ],
  
  purpose: 'Learning drives ingest priority, never answer content',
} as const;

// ============================================
// KNOWLEDGE GAP TRACKING
// ============================================

export interface KnowledgeGap {
  gap_id: string;
  domain: string;
  topic: string;
  gap_type: 'no_data' | 'insufficient_coverage' | 'methodology_undefined' | 'source_conflict';
  
  // Statistics
  query_count: number;           // How many times this gap was hit
  first_encountered: string;     // ISO date
  last_encountered: string;      // ISO date
  
  // Context
  sample_queries: string[];      // Up to 5 example queries that hit this gap
  geographic_scope?: string[];   // Which regions are affected
  temporal_scope?: string;       // Which time periods are affected
  
  // Priority
  coverage_priority: number;     // 0-1, higher = more important to fill
}

export interface DomainGapSummary {
  domain: string;
  total_gaps: number;
  high_priority_gaps: number;
  most_requested_gaps: string[];
  coverage_score: number;        // 0-1, how well covered this domain is
}

// ============================================
// GAP RECORDING
// ============================================

export interface GapRecord {
  query: string;
  result_state: 'Unresolved' | 'PartiallyResolved';
  reason: string;
  domain: string;
  timestamp: string;
}

/**
 * Record a knowledge gap encounter
 */
export function recordGapEncounter(
  existingGaps: Map<string, KnowledgeGap>,
  record: GapRecord
): KnowledgeGap {
  const gapId = generateGapId(record.domain, record.reason);
  
  const existing = existingGaps.get(gapId);
  
  if (existing) {
    // Update existing gap
    existing.query_count += 1;
    existing.last_encountered = record.timestamp;
    
    // Add sample query if space
    if (existing.sample_queries.length < 5) {
      existing.sample_queries.push(record.query);
    }
    
    // Recalculate priority based on frequency
    existing.coverage_priority = calculateGapPriority(existing);
    
    return existing;
  }
  
  // Create new gap
  const newGap: KnowledgeGap = {
    gap_id: gapId,
    domain: record.domain,
    topic: extractTopic(record.query),
    gap_type: mapReasonToGapType(record.reason),
    query_count: 1,
    first_encountered: record.timestamp,
    last_encountered: record.timestamp,
    sample_queries: [record.query],
    coverage_priority: 0.1, // Low initial priority
  };
  
  existingGaps.set(gapId, newGap);
  return newGap;
}

function generateGapId(domain: string, reason: string): string {
  const hash = simpleHash(`${domain}:${reason}`);
  return `GAP-${domain.toUpperCase().slice(0, 4)}-${hash}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).slice(0, 6).toUpperCase();
}

function extractTopic(query: string): string {
  // Simple topic extraction - in production this would be more sophisticated
  return query.split(' ').slice(0, 5).join(' ');
}

function mapReasonToGapType(reason: string): KnowledgeGap['gap_type'] {
  if (reason.includes('NO_DATA')) return 'no_data';
  if (reason.includes('COVERAGE')) return 'insufficient_coverage';
  if (reason.includes('METHOD')) return 'methodology_undefined';
  if (reason.includes('CONFLICT')) return 'source_conflict';
  return 'no_data';
}

function calculateGapPriority(gap: KnowledgeGap): number {
  // Priority based on:
  // - Query frequency (more queries = higher priority)
  // - Recency (recent queries = higher priority)
  // - Domain importance (some domains more critical)
  
  const frequencyScore = Math.min(gap.query_count / 100, 1);
  
  const daysSinceFirst = Math.floor(
    (Date.now() - new Date(gap.first_encountered).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyScore = gap.query_count / Math.max(daysSinceFirst, 1);
  const normalizedRecency = Math.min(recencyScore / 10, 1);
  
  return (frequencyScore * 0.6) + (normalizedRecency * 0.4);
}

// ============================================
// INGEST PRIORITY GENERATION
// ============================================

export interface IngestPriority {
  domain: string;
  priority_score: number;
  reason: string;
  recommended_sources: string[];
  estimated_impact: number; // How many queries this would resolve
}

/**
 * Generate ingest priorities from gap data
 */
export function generateIngestPriorities(
  gaps: KnowledgeGap[]
): IngestPriority[] {
  // Group by domain
  const domainGaps = new Map<string, KnowledgeGap[]>();
  
  for (const gap of gaps) {
    const existing = domainGaps.get(gap.domain) || [];
    existing.push(gap);
    domainGaps.set(gap.domain, existing);
  }
  
  // Calculate priorities per domain
  const priorities: IngestPriority[] = [];
  
  for (const [domain, domainGapList] of domainGaps) {
    const totalQueries = domainGapList.reduce((sum, g) => sum + g.query_count, 0);
    const avgPriority = domainGapList.reduce((sum, g) => sum + g.coverage_priority, 0) / domainGapList.length;
    
    priorities.push({
      domain,
      priority_score: avgPriority,
      reason: `${domainGapList.length} gaps affecting ${totalQueries} queries`,
      recommended_sources: getRecommendedSources(domain),
      estimated_impact: totalQueries,
    });
  }
  
  return priorities.sort((a, b) => b.priority_score - a.priority_score);
}

function getRecommendedSources(domain: string): string[] {
  const sourceMap: Record<string, string[]> = {
    economics: ['OECD', 'World Bank', 'IMF', 'Eurostat'],
    health: ['WHO', 'IHME', 'National Health Agencies'],
    demographics: ['UN Population Division', 'National Statistics'],
    labor: ['ILO', 'OECD', 'Eurostat'],
    energy: ['IEA', 'EIA', 'BP Statistical Review'],
    education: ['UNESCO', 'OECD PISA', 'World Bank'],
  };
  
  return sourceMap[domain.toLowerCase()] || ['Primary national sources'];
}

// ============================================
// MEMORY PRINCIPLE
// ============================================

export const ORACLE_MEMORY_PRINCIPLE = {
  statement: 'The oracle learns where it doesn\'t know, not what users want to hear',
  
  drives: 'ingest_priority',
  never_drives: 'answer_content',
  
  anti_pattern: 'Learning to please users',
  correct_pattern: 'Learning to expand coverage',
};
