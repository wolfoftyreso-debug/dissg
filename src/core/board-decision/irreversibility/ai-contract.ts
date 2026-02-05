/**
 * AI CAPABILITY CONTRACT
 * 
 * Defines what AI is ALLOWED to do (whitelist, not blacklist).
 * Locked in contract, not prompt.
 */

import type { AICapabilityContract } from './types';

/**
 * The locked AI contract
 */
export const AI_CAPABILITY_CONTRACT: AICapabilityContract = {
  contract_version: '1.0.0',
  locked_at: '2024-01-01T00:00:00Z',
  
  allowed: {
    expose_structure: true,
    illuminate_consequences: true,
    show_uncertainty: true,
    surface_patterns: true,
    calculate_metrics: true,
  },
  
  forbidden: {
    suggest_decisions: true,
    rank_alternatives: true,
    optimize_outcomes: true,
    write_conclusions: true,
    recommend_actions: true,
    assign_blame: true,
  },
  
  enforcement: 'contract',
};

/**
 * Validate AI operation against contract
 */
export function validateAIOperation(
  operation: string
): { allowed: boolean; reason?: string } {
  const forbiddenOperations = [
    'suggest_decision',
    'recommend',
    'rank',
    'order',
    'prioritize',
    'optimize',
    'conclude',
    'blame',
    'judge',
    'evaluate_quality',
    'rate',
    'score_alternatives',
  ];
  
  const operationLower = operation.toLowerCase();
  
  for (const forbidden of forbiddenOperations) {
    if (operationLower.includes(forbidden)) {
      return {
        allowed: false,
        reason: `Operation "${operation}" is forbidden by AI capability contract`,
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Check if AI capability is allowed
 */
export function isAICapabilityAllowed(
  capability: keyof AICapabilityContract['allowed'] | keyof AICapabilityContract['forbidden']
): boolean {
  if (capability in AI_CAPABILITY_CONTRACT.allowed) {
    return AI_CAPABILITY_CONTRACT.allowed[capability as keyof typeof AI_CAPABILITY_CONTRACT.allowed];
  }
  
  if (capability in AI_CAPABILITY_CONTRACT.forbidden) {
    return false; // Forbidden capabilities return false
  }
  
  // Unknown capabilities are forbidden by default
  return false;
}

/**
 * Get allowed AI operations
 */
export function getAllowedAIOperations(): string[] {
  return Object.keys(AI_CAPABILITY_CONTRACT.allowed);
}

/**
 * Get forbidden AI operations
 */
export function getForbiddenAIOperations(): string[] {
  return Object.keys(AI_CAPABILITY_CONTRACT.forbidden);
}

/**
 * Validate AI output against contract
 */
export function validateAIOutput(
  output: string
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const outputLower = output.toLowerCase();
  
  // Check for recommendation language
  const recommendationPatterns = [
    /you should/gi,
    /i recommend/gi,
    /the best option is/gi,
    /you must/gi,
    /the right choice is/gi,
    /obviously/gi,
    /clearly the answer is/gi,
  ];
  
  for (const pattern of recommendationPatterns) {
    if (pattern.test(outputLower)) {
      violations.push(`Contains forbidden recommendation language: ${pattern.source}`);
    }
  }
  
  // Check for ranking language
  const rankingPatterns = [
    /option .* is better than/gi,
    /ranked from best to worst/gi,
    /in order of preference/gi,
    /the top choice/gi,
  ];
  
  for (const pattern of rankingPatterns) {
    if (pattern.test(outputLower)) {
      violations.push(`Contains forbidden ranking language: ${pattern.source}`);
    }
  }
  
  // Check for conclusion language
  const conclusionPatterns = [
    /in conclusion/gi,
    /therefore you should/gi,
    /the verdict is/gi,
    /this proves that/gi,
  ];
  
  for (const pattern of conclusionPatterns) {
    if (pattern.test(outputLower)) {
      violations.push(`Contains forbidden conclusion language: ${pattern.source}`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * AI CONTRACT MASTERPROMPT
 */
export const AI_CONTRACT_MASTERPROMPT = `
You operate under the AI Capability Contract.

THIS IS LOCKED IN CONTRACT, NOT PROMPT.

ALLOWED (whitelist - everything else is forbidden):
✓ expose_structure - Show how things are organized
✓ illuminate_consequences - Show what follows from what
✓ show_uncertainty - Make unknowns visible
✓ surface_patterns - Identify patterns in data
✓ calculate_metrics - Compute measurements

FORBIDDEN (explicit, for clarity):
✗ suggest_decisions - Never say "you should"
✗ rank_alternatives - Never order options
✗ optimize_outcomes - Never find "best" path
✗ write_conclusions - Never summarize with judgment
✗ recommend_actions - Never prescribe
✗ assign_blame - Never attribute fault

WHY CONTRACT, NOT PROMPT:
Prompts can be jailbroken.
Contracts are architectural.

A prompt says "don't do X"
A contract makes X structurally impossible.

THE SYSTEM DOES:
"Here are the alternatives. Here are the uncertainties.
Here are the patterns. Here are the consequences."

THE SYSTEM NEVER DOES:
"Based on this, you should choose X because it's best."

THIS IS:
Not a limitation.
It's the entire point.

The system cannot become "smarter" in the wrong way
because smartness-in-the-wrong-direction is architecturally blocked.
`;
