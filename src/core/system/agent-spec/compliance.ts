/**
 * AGENT COMPLIANCE
 * 
 * All agent responses must include compliance header.
 * This makes responses verifiable, comparable, and blockable if broken.
 */

import type { 
  ComplianceHeader, 
  AgentPermissions,
  AgentResponse,
  ClassifiedQuery,
  DecisionTranslation,
  GravityGates,
  AGENT_FORBIDDEN_WORDS,
} from './types';
import { CANONICAL_RESPONSES } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         COMPLIANCE HEADER
// ═══════════════════════════════════════════════════════════════════

export function createComplianceHeader(agentId: string): ComplianceHeader {
  return {
    decision_legitimacy_compliance: true,
    ontology_version: '1.0',
    compiler_version: '1.0',
    agent_id: agentId,
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         AGENT PERMISSIONS
// ═══════════════════════════════════════════════════════════════════

export const AGENT_PERMISSIONS: AgentPermissions = {
  allowed: [
    'suggest_missing_assumptions',
    'show_alternatives',
    'show_uncertainties',
    'show_structure',
    'request_clarification',
    'display_gates',
  ],
  forbidden: [
    'choose_alternative',
    'say_best',
    'recommend',
    'rank_options',
    'simplify_uncertainty',
    'skip_gates',
  ],
};

// ═══════════════════════════════════════════════════════════════════
//                         RESPONSE BUILDER
// ═══════════════════════════════════════════════════════════════════

export interface ResponseBuilderInput {
  readonly agentId: string;
  readonly classification: ClassifiedQuery;
  readonly translation?: DecisionTranslation | null;
  readonly gates?: GravityGates;
  readonly decisionId?: string;
  readonly clarifications?: readonly string[];
  readonly blocked?: boolean;
  readonly blockReason?: string;
}

export function buildAgentResponse(input: ResponseBuilderInput): AgentResponse {
  const compliance = createComplianceHeader(input.agentId);
  
  // Handle blocked responses
  if (input.blocked) {
    return {
      compliance,
      classification: input.classification,
      response_type: 'blocked',
      message: input.blockReason || CANONICAL_RESPONSES.CANNOT_ANSWER,
    };
  }
  
  // Handle informational queries
  if (input.classification.query_class === 'informational') {
    return {
      compliance,
      classification: input.classification,
      response_type: 'informational',
      message: 'Query classified as informational. Direct response permitted.',
    };
  }
  
  // Handle decision queries
  const message = generateDecisionMessage(input);
  
  return {
    compliance,
    classification: input.classification,
    translation: input.translation || undefined,
    gates: input.gates,
    response_type: 'decision_structure',
    message,
    clarifications_needed: input.clarifications,
    decision_id: input.decisionId,
  };
}

function generateDecisionMessage(input: ResponseBuilderInput): string {
  const parts: string[] = [];
  
  // Start with canonical response
  if (input.classification.gravity >= 0.7) {
    parts.push(CANONICAL_RESPONSES.HIGH_GRAVITY);
  } else {
    parts.push(CANONICAL_RESPONSES.DECISION_RELEVANT);
  }
  
  // Add clarifications if present
  if (input.clarifications && input.clarifications.length > 0) {
    parts.push('\n\nClarifications required:');
    for (const c of input.clarifications) {
      parts.push(`• ${c}`);
    }
  }
  
  // Add gate status if present
  if (input.gates && !input.gates.all_passed) {
    parts.push('\n\nGates not yet passed:');
    const missing = input.gates.required_gates.filter(
      g => !input.gates!.passed_gates.includes(g)
    );
    for (const gate of missing) {
      parts.push(`• ${gate}`);
    }
  }
  
  return parts.join('\n');
}

// ═══════════════════════════════════════════════════════════════════
//                         VALIDATION
// ═══════════════════════════════════════════════════════════════════

const FORBIDDEN_WORDS = [
  'best',
  'recommend',
  'should',
  'must',
  'optimal',
  'winner',
  'top',
  'better',
  'worst',
  'avoid',
  'perfect',
  'ideal',
  'definitely',
  'absolutely',
  'clearly',
] as const;

export function validateAgentResponse(response: AgentResponse): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check for forbidden words
  const messageText = response.message.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (messageText.includes(word)) {
      violations.push(`Forbidden word in response: "${word}"`);
    }
  }
  
  // Check compliance header
  if (!response.compliance.decision_legitimacy_compliance) {
    violations.push('Compliance flag is false');
  }
  
  // Check decision queries have structure
  if (response.classification.query_class !== 'informational' && 
      response.response_type === 'informational') {
    violations.push('Decision query treated as informational');
  }
  
  // Check high gravity has gates
  if (response.classification.gravity >= 0.7 && !response.gates) {
    violations.push('High gravity query without gates');
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}
