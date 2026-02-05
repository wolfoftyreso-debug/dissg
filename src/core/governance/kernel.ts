/**
 * GOVERNANCE KERNEL
 * 
 * Code + Contract + Transparency.
 * Not meetings. Not committees.
 */

// ============================================
// CHANGE CLASSIFICATION
// ============================================

export type ChangeCategory = 
  | 'allowed'
  | 'requires_review'
  | 'forbidden';

export type ChangeType =
  // Allowed
  | 'new_truth_node'
  | 'new_index_version'
  | 'new_domain'
  | 'new_signal'
  | 'new_decision_graph'
  // Forbidden
  | 'modify_historical_artifact'
  | 'modify_semantic_contract'
  | 'modify_guardrails_retroactive'
  | 'delete_truth_node'
  | 'delete_index';

export const CHANGE_RULES: Record<ChangeType, ChangeCategory> = {
  // Allowed changes
  new_truth_node: 'allowed',
  new_index_version: 'allowed',
  new_domain: 'requires_review',
  new_signal: 'allowed',
  new_decision_graph: 'requires_review',
  
  // Forbidden changes
  modify_historical_artifact: 'forbidden',
  modify_semantic_contract: 'forbidden',
  modify_guardrails_retroactive: 'forbidden',
  delete_truth_node: 'forbidden',
  delete_index: 'forbidden',
} as const;

// ============================================
// GOVERNANCE RULES ENGINE
// ============================================

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  check: (context: GovernanceContext) => GovernanceResult;
  enforcement: 'block' | 'warn' | 'log';
}

export interface GovernanceContext {
  change_type: ChangeType;
  target_id: string;
  target_version?: string;
  proposed_changes?: Record<string, unknown>;
  actor?: string;
  timestamp: string;
}

export interface GovernanceResult {
  allowed: boolean;
  rule_id: string;
  reason: string;
  enforcement: 'block' | 'warn' | 'log';
}

// Core rules
export const GOVERNANCE_RULES: GovernanceRule[] = [
  {
    id: 'GR-001',
    name: 'No Historical Modification',
    description: 'Historical truth artifacts cannot be modified',
    enforcement: 'block',
    check: (ctx) => ({
      allowed: ctx.change_type !== 'modify_historical_artifact',
      rule_id: 'GR-001',
      reason: ctx.change_type === 'modify_historical_artifact' 
        ? 'Historical artifacts are immutable' 
        : 'Change allowed',
      enforcement: 'block',
    }),
  },
  {
    id: 'GR-002',
    name: 'Semantic Contract Stability',
    description: 'Semantic output contract cannot be modified backwards',
    enforcement: 'block',
    check: (ctx) => ({
      allowed: ctx.change_type !== 'modify_semantic_contract',
      rule_id: 'GR-002',
      reason: ctx.change_type === 'modify_semantic_contract'
        ? 'Semantic contracts are append-only'
        : 'Change allowed',
      enforcement: 'block',
    }),
  },
  {
    id: 'GR-003',
    name: 'Guardrail Immutability',
    description: 'Guardrails cannot be weakened retroactively',
    enforcement: 'block',
    check: (ctx) => ({
      allowed: ctx.change_type !== 'modify_guardrails_retroactive',
      rule_id: 'GR-003',
      reason: ctx.change_type === 'modify_guardrails_retroactive'
        ? 'Guardrails can only be strengthened, never weakened'
        : 'Change allowed',
      enforcement: 'block',
    }),
  },
  {
    id: 'GR-004',
    name: 'No Deletion',
    description: 'Truth nodes and indexes cannot be deleted',
    enforcement: 'block',
    check: (ctx) => ({
      allowed: !['delete_truth_node', 'delete_index'].includes(ctx.change_type),
      rule_id: 'GR-004',
      reason: ['delete_truth_node', 'delete_index'].includes(ctx.change_type)
        ? 'Deletion is forbidden; use deprecation instead'
        : 'Change allowed',
      enforcement: 'block',
    }),
  },
];

// ============================================
// RULE ENGINE
// ============================================

export function evaluateChange(context: GovernanceContext): {
  allowed: boolean;
  results: GovernanceResult[];
  blocking_rules: string[];
} {
  const results = GOVERNANCE_RULES.map(rule => rule.check(context));
  const blocking = results.filter(r => !r.allowed && r.enforcement === 'block');
  
  return {
    allowed: blocking.length === 0,
    results,
    blocking_rules: blocking.map(r => r.rule_id),
  };
}

export function getChangeCategory(changeType: ChangeType): ChangeCategory {
  return CHANGE_RULES[changeType];
}

// ============================================
// PUBLIC RULEBOOK (MACHINE-READABLE)
// ============================================

export const PUBLIC_RULEBOOK = {
  version: '1.0.0',
  last_updated: '2026-02-05',
  
  principles: [
    'Governance is code, not meetings',
    'All rules are machine-enforceable',
    'No silent changes',
    'Transparency by default',
  ],
  
  allowed_changes: [
    'new_truth_node',
    'new_index_version',
    'new_domain',
    'new_signal',
    'new_decision_graph',
  ],
  
  forbidden_changes: [
    'modify_historical_artifact',
    'modify_semantic_contract',
    'modify_guardrails_retroactive',
    'delete_truth_node',
    'delete_index',
  ],
  
  rules: GOVERNANCE_RULES.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    enforcement: r.enforcement,
  })),
} as const;
