/**
 * AGENT HANDLER
 * 
 * Main entry point for AI agents interacting with the system.
 * Ensures all queries pass through proper classification, translation, and gates.
 */

import type { AgentResponse } from './types';
import { CANONICAL_RESPONSES } from './types';
import { classifyQuery } from './classifier';
import { translateToDecisionForm } from './translator';
import { checkGravityGates, type GateCheckInput } from './gates';
import { buildAgentResponse, validateAgentResponse, createComplianceHeader } from './compliance';
import { compileQueryToDecision } from '../compiler';

// ═══════════════════════════════════════════════════════════════════
//                         AGENT HANDLER
// ═══════════════════════════════════════════════════════════════════

export interface AgentHandlerInput {
  readonly query_text: string;
  readonly agent_id: string;
  readonly purpose?: 'decision_support' | 'information' | 'exploration';
  readonly locale?: string;
}

export interface AgentHandlerOutput {
  readonly response: AgentResponse;
  readonly validation: {
    readonly valid: boolean;
    readonly violations: string[];
  };
  readonly compiler_output?: ReturnType<typeof compileQueryToDecision>;
}

export function handleAgentQuery(input: AgentHandlerInput): AgentHandlerOutput {
  // Step 1: Classify the query
  const classification = classifyQuery(input.query_text);
  
  // Step 2: Handle informational queries directly
  if (classification.query_class === 'informational') {
    const response = buildAgentResponse({
      agentId: input.agent_id,
      classification,
    });
    
    return {
      response,
      validation: validateAgentResponse(response),
    };
  }
  
  // Step 3: Translate to decision form (MANDATORY)
  const translation = translateToDecisionForm(classification);
  
  // Step 4: Run through Query Compiler
  const compilerOutput = compileQueryToDecision({
    query: { query_text: input.query_text, locale: input.locale || 'en-US' },
    metadata: { source: 'agent', geo: 'global' },
  });
  
  // Step 5: Check if compiler blocked the query
  if (!compilerOutput.success) {
    const response = buildAgentResponse({
      agentId: input.agent_id,
      classification,
      translation,
      blocked: true,
      blockReason: compilerOutput.public_facing_message || CANONICAL_RESPONSES.COMPILER_BLOCKED,
    });
    
    return {
      response,
      validation: validateAgentResponse(response),
      compiler_output: compilerOutput,
    };
  }
  
  // Step 6: Check gravity gates
  const gateInput: GateCheckInput = {
    scope_defined: true, // Draft has scope
    alternatives_count: compilerOutput.draft?.alternatives.length || 0,
    uncertainties_count: compilerOutput.draft?.uncertainties.length || 0,
    consequences_projected: false, // Needs user input
    time_horizon_defined: !!compilerOutput.draft?.decision.time_horizon,
    reversibility_assessed: !!compilerOutput.draft?.decision.scope.reversibility,
  };
  
  const gates = checkGravityGates(classification, gateInput);
  
  // Step 7: Build response
  const clarifications = compilerOutput.missing_to_lock.filter(
    m => !m.includes('confirmed')
  );
  
  const response = buildAgentResponse({
    agentId: input.agent_id,
    classification,
    translation,
    gates,
    decisionId: compilerOutput.decision_id,
    clarifications,
    blocked: !gates.all_passed && classification.gravity >= 0.7,
    blockReason: gates.all_passed ? undefined : CANONICAL_RESPONSES.HIGH_GRAVITY,
  });
  
  return {
    response,
    validation: validateAgentResponse(response),
    compiler_output: compilerOutput,
  };
}

// ═══════════════════════════════════════════════════════════════════
//                         FAIL-SAFE
// ═══════════════════════════════════════════════════════════════════

export function createFailSafeResponse(agentId: string, reason: string): AgentResponse {
  return {
    compliance: createComplianceHeader(agentId),
    classification: {
      query_text: '',
      query_class: 'decision_relevant',
      confidence: 0,
      gravity: 1,
      indicators: ['fail-safe triggered'],
    },
    response_type: 'blocked',
    message: CANONICAL_RESPONSES.CANNOT_ANSWER + ' ' + reason,
  };
}
