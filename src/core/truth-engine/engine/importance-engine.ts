/**
 * IMPORTANCE ENGINE (UIE) — Machine-calculated priority
 * 
 * No human weights. No model opinions.
 * This is SYSTEM IMPACT.
 */

import { TruthNode } from '../ontology';

/**
 * IMPORTANCE CALCULATION RESULT
 */
export interface ImportanceResult {
  readonly node_id: string;
  readonly structural: boolean;
  readonly acute: boolean;
  readonly contextual: boolean;
  readonly score: number;
  readonly rationale: readonly string[];
}

/**
 * IMPORTANCE THRESHOLDS
 */
export const IMPORTANCE_THRESHOLDS = {
  structural_impact: 0.7,
  acute_volatility: 2.0, // Standard deviations
  persistence_structural: 24, // months
  cross_domain_links: 3,
  population_affected_percent: 5,
} as const;

/**
 * CALCULATE IMPORTANCE — Main function
 */
export function calculateImportance(nodes: TruthNode[]): ImportanceResult[] {
  return nodes.map(node => calculateNodeImportance(node));
}

/**
 * CALCULATE NODE IMPORTANCE
 */
function calculateNodeImportance(node: TruthNode): ImportanceResult {
  const rationale: string[] = [];
  
  // Calculate structural importance
  const isStructural = checkStructural(node, rationale);
  
  // Calculate acute importance
  const isAcute = checkAcute(node, rationale);
  
  // If neither structural nor acute, it's contextual
  const isContextual = !isStructural && !isAcute;
  if (isContextual) {
    rationale.push('Normal variation within expected range');
  }
  
  // Calculate overall score
  const score = calculateImportanceScore(node, isStructural, isAcute);
  
  return {
    node_id: node.node_id,
    structural: isStructural,
    acute: isAcute,
    contextual: isContextual,
    score,
    rationale,
  };
}

/**
 * CHECK STRUCTURAL — Is this a persistent, systemic force?
 */
function checkStructural(node: TruthNode, rationale: string[]): boolean {
  const checks: boolean[] = [];
  
  // High system impact
  if (node.semantic_importance.importance_score >= IMPORTANCE_THRESHOLDS.structural_impact) {
    checks.push(true);
    rationale.push(`High system impact: ${(node.semantic_importance.importance_score * 100).toFixed(0)}%`);
  }
  
  // Long persistence
  if (node.semantic_importance.structural) {
    checks.push(true);
    rationale.push('Persistent pattern over extended timeframe');
  }
  
  // Cross-domain links
  const totalRelations = 
    node.relations.up.length + 
    node.relations.down.length + 
    node.relations.side.length;
  
  if (totalRelations >= IMPORTANCE_THRESHOLDS.cross_domain_links) {
    checks.push(true);
    rationale.push(`Affects ${totalRelations} connected systems`);
  }
  
  return checks.length >= 2; // Need at least 2 structural indicators
}

/**
 * CHECK ACUTE — Is this a recent deviation?
 */
function checkAcute(node: TruthNode, rationale: string[]): boolean {
  if (node.semantic_importance.acute) {
    rationale.push('Recent deviation from historical baseline');
    return true;
  }
  
  return false;
}

/**
 * CALCULATE IMPORTANCE SCORE
 */
function calculateImportanceScore(
  node: TruthNode,
  isStructural: boolean,
  isAcute: boolean
): number {
  let score = node.semantic_importance.importance_score;
  
  // Boost for structural
  if (isStructural) score = Math.min(1, score * 1.3);
  
  // Boost for acute
  if (isAcute) score = Math.min(1, score * 1.2);
  
  // Reduce for low confidence
  score *= node.confidence;
  
  return Math.round(score * 100) / 100;
}

/**
 * RANK BY IMPORTANCE
 */
export function rankByImportance(results: ImportanceResult[]): ImportanceResult[] {
  return [...results].sort((a, b) => {
    // Structural first
    if (a.structural && !b.structural) return -1;
    if (!a.structural && b.structural) return 1;
    
    // Then acute
    if (a.acute && !b.acute) return -1;
    if (!a.acute && b.acute) return 1;
    
    // Then by score
    return b.score - a.score;
  });
}

/**
 * FILTER BY IMPORTANCE CLASS
 */
export function filterByImportanceClass(
  results: ImportanceResult[],
  classes: ('structural' | 'acute' | 'contextual')[]
): ImportanceResult[] {
  return results.filter(r => {
    if (classes.includes('structural') && r.structural) return true;
    if (classes.includes('acute') && r.acute) return true;
    if (classes.includes('contextual') && r.contextual) return true;
    return false;
  });
}

/**
 * GET IMPORTANCE SUMMARY
 */
export function getImportanceSummary(results: ImportanceResult[]): ImportanceSummary {
  return {
    total: results.length,
    structural_count: results.filter(r => r.structural).length,
    acute_count: results.filter(r => r.acute).length,
    contextual_count: results.filter(r => r.contextual).length,
    average_score: results.reduce((sum, r) => sum + r.score, 0) / results.length || 0,
    top_structural: results.filter(r => r.structural).slice(0, 3).map(r => r.node_id),
    top_acute: results.filter(r => r.acute).slice(0, 3).map(r => r.node_id),
  };
}

export interface ImportanceSummary {
  readonly total: number;
  readonly structural_count: number;
  readonly acute_count: number;
  readonly contextual_count: number;
  readonly average_score: number;
  readonly top_structural: readonly string[];
  readonly top_acute: readonly string[];
}
