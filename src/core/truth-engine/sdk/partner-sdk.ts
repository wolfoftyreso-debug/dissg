/**
 * GDG PARTNER SDK v1.0
 * 
 * Minimal. Strict. Impossible to misunderstand.
 * 
 * This SDK is a FENCE, not a tool.
 * - Cannot create recommendations
 * - Cannot summarize to conclusions
 * - Cannot bypass Answer Packets
 */

import { GDG_ANSWER_TYPES } from '../standards/global-decision-grammar';

/**
 * SCOPE DEFINITION
 */
export interface DecisionScope {
  geography: string;      // e.g., "SE", "EU", "GLOBAL"
  population: string;     // e.g., "adults", "all", "youth_15_24"
  time_horizon: string;   // e.g., "5y", "2020-2025", "Q1_2025"
}

/**
 * QUESTION NODE
 */
export interface QuestionNode {
  id: string;
  question: string;
  answer_type: typeof GDG_ANSWER_TYPES[number];
  answer_packet: string;  // Reference to canonical Answer Packet
  status: 'resolved' | 'unresolved' | 'insufficient';
  assumptions?: string[];
  limitations?: string[];
}

/**
 * DECISION GRAPH
 */
export class DecisionGraph {
  private readonly id: string;
  private readonly created_at: string;
  private scope: DecisionScope;
  private nodes: Map<string, QuestionNode> = new Map();
  private limitations: string[] = [];
  private confidence: { overall: number; completeness: number } = { overall: 0, completeness: 0 };

  constructor(scope: DecisionScope) {
    this.id = `dg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.created_at = new Date().toISOString();
    this.scope = this.validateScope(scope);
  }

  private validateScope(scope: DecisionScope): DecisionScope {
    if (!scope.geography) throw new Error('Scope must include geography');
    if (!scope.population) throw new Error('Scope must include population');
    if (!scope.time_horizon) throw new Error('Scope must include time_horizon');
    return scope;
  }

  /**
   * ADD A QUESTION NODE
   */
  add_node(config: {
    question: string;
    answer_type: typeof GDG_ANSWER_TYPES[number];
    answer_packet: string;
    assumptions?: string[];
    limitations?: string[];
  }): string {
    // Validate answer type
    if (!GDG_ANSWER_TYPES.includes(config.answer_type)) {
      throw new Error(`Invalid answer_type: ${config.answer_type}. Must be one of: ${GDG_ANSWER_TYPES.join(', ')}`);
    }

    // Validate answer packet format
    if (!config.answer_packet.match(/^[a-z_]+:answer:[a-z_]+:v\d+$/)) {
      throw new Error(`Invalid answer_packet format: ${config.answer_packet}. Expected: domain:answer:name:version`);
    }

    // Block forbidden patterns
    this.blockForbiddenPatterns(config.question);

    const node_id = `node_${this.nodes.size + 1}`;
    
    this.nodes.set(node_id, {
      id: node_id,
      question: config.question,
      answer_type: config.answer_type,
      answer_packet: config.answer_packet,
      status: 'unresolved',
      assumptions: config.assumptions || [],
      limitations: config.limitations || [],
    });

    return node_id;
  }

  /**
   * BLOCK FORBIDDEN PATTERNS
   */
  private blockForbiddenPatterns(text: string): void {
    const forbidden = [
      { pattern: /\bshould\b/i, type: 'recommendation' },
      { pattern: /\brecommend\b/i, type: 'recommendation' },
      { pattern: /\bbest\b/i, type: 'value_judgment' },
      { pattern: /\boptimal\b/i, type: 'optimization' },
      { pattern: /\badvise\b/i, type: 'advice' },
      { pattern: /\bmust\b/i, type: 'imperative' },
    ];

    for (const { pattern, type } of forbidden) {
      if (pattern.test(text)) {
        throw new Error(`Forbidden ${type} pattern detected in: "${text}"`);
      }
    }
  }

  /**
   * SET LIMITATIONS
   */
  set_limitations(limitations: string[]): void {
    this.limitations = limitations;
  }

  /**
   * SET CONFIDENCE
   */
  set_confidence(overall: number, completeness: number): void {
    if (overall < 0 || overall > 100) throw new Error('Confidence overall must be 0-100');
    if (completeness < 0 || completeness > 100) throw new Error('Confidence completeness must be 0-100');
    this.confidence = { overall, completeness };
  }

  /**
   * RESOLVE A NODE (mark as answered)
   */
  resolve_node(node_id: string): void {
    const node = this.nodes.get(node_id);
    if (!node) throw new Error(`Node not found: ${node_id}`);
    node.status = 'resolved';
  }

  /**
   * MARK NODE AS INSUFFICIENT
   */
  mark_insufficient(node_id: string, reason: string): void {
    const node = this.nodes.get(node_id);
    if (!node) throw new Error(`Node not found: ${node_id}`);
    node.status = 'insufficient';
    node.limitations = [...(node.limitations || []), reason];
  }

  /**
   * GET GRAPH ID
   */
  get_id(): string {
    return this.id;
  }

  /**
   * EXPORT TO JSON (for validation)
   */
  to_json(): object {
    return {
      id: this.id,
      gdg_version: '1.0',
      created_at: this.created_at,
      scope: this.scope,
      nodes: Array.from(this.nodes.values()),
      limitations: this.limitations,
      confidence_summary: this.confidence,
    };
  }

  /**
   * EXPORT FOR VALIDATOR
   */
  to_validator_input() {
    return {
      decision_id: this.id,
      scope: this.scope,
      nodes: Array.from(this.nodes.values()).map(n => ({
        node_id: n.id,
        question: n.question,
        answer_type: n.answer_type,
        answer_packet_ref: n.answer_packet,
        status: n.status,
      })),
      limitations: this.limitations,
      confidence_summary: this.confidence,
    };
  }
}

/**
 * QUICK VALIDATE FUNCTION
 */
export function validate(graph: DecisionGraph): boolean {
  const input = graph.to_validator_input();
  
  // Basic validation rules
  if (!input.scope) return false;
  if (!input.nodes || input.nodes.length === 0) return false;
  if (!input.confidence_summary) return false;
  
  // All nodes must have answer types
  for (const node of input.nodes) {
    if (!node.answer_type) return false;
    if (!GDG_ANSWER_TYPES.includes(node.answer_type as typeof GDG_ANSWER_TYPES[number])) return false;
  }
  
  return true;
}

/**
 * SDK PRINCIPLES (READ-ONLY)
 */
export const SDK_PRINCIPLES = {
  cannot_do: [
    'Create recommendations',
    'Summarize to conclusions',
    'Bypass Answer Packets',
    'Weight values',
    'Optimize goals',
    'Provide advice',
  ],
  must_do: [
    'Reference canonical Answer Packets',
    'Declare all assumptions',
    'Show limitations',
    'Include confidence scores',
    'Pass GDG validation',
  ],
} as const;
