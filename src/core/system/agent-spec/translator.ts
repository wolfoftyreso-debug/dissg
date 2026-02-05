/**
 * DECISION TRANSLATOR
 * 
 * Mandatory transformation: Query → Decision Form
 * 
 * If query_class ≠ informational, AI must do this before response.
 * No agent may skip this step.
 */

import type { ClassifiedQuery, DecisionTranslation } from './types';

// ═══════════════════════════════════════════════════════════════════
//                         TRANSLATOR
// ═══════════════════════════════════════════════════════════════════

export function translateToDecisionForm(classification: ClassifiedQuery): DecisionTranslation | null {
  // Informational queries don't need translation
  if (classification.query_class === 'informational') {
    return null;
  }
  
  const decisionStatement = generateDecisionStatement(classification);
  const implicitChoice = extractImplicitChoice(classification);
  
  return {
    action: 'translate_to_decision_form',
    original_query: classification.query_text,
    output: {
      decision_statement: decisionStatement,
      implicit_choice: implicitChoice,
      requires_structure: true,
    },
  };
}

function generateDecisionStatement(classification: ClassifiedQuery): string {
  const text = classification.query_text.toLowerCase();
  
  // Extract subject from query
  const subject = extractSubject(text);
  
  // Generate canonical decision statement
  return `Under which assumptions is ${subject} a rational choice compared to alternatives?`;
}

function extractSubject(text: string): string {
  // Common patterns to extract subject
  const patterns = [
    /is\s+(.+?)\s+(a\s+)?good/i,
    /is\s+(.+?)\s+worth/i,
    /should\s+i\s+(buy|get|use|try|choose)\s+(.+)/i,
    /compare\s+(.+)/i,
    /(.+?)\s+vs\s+/i,
    /(.+?)\s+versus\s+/i,
    /review\s+(.+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Get the captured group (either 1 or 2 depending on pattern)
      const subject = match[2] || match[1];
      if (subject) {
        return subject.trim().replace(/[?.!]$/, '');
      }
    }
  }
  
  // Fallback: use cleaned query text
  return text
    .replace(/^(is|should|would|can|do)\s+(i|we|you|one)\s+/i, '')
    .replace(/\?$/, '')
    .trim()
    .slice(0, 50);
}

function extractImplicitChoice(classification: ClassifiedQuery): string {
  const text = classification.query_text.toLowerCase();
  
  if (text.includes('buy') || text.includes('purchase')) {
    return 'purchase_vs_not';
  }
  if (text.includes('move') || text.includes('relocate')) {
    return 'relocate_vs_stay';
  }
  if (text.includes('invest')) {
    return 'invest_vs_not';
  }
  if (text.includes('switch') || text.includes('change')) {
    return 'change_vs_stay';
  }
  if (text.includes('vs') || text.includes('versus') || text.includes('compare')) {
    return 'option_a_vs_option_b';
  }
  if (text.includes('worth')) {
    return 'value_vs_cost';
  }
  
  return 'action_vs_inaction';
}
