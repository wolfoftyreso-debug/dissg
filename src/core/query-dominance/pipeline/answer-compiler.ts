/**
 * PIPELINE STAGE 6: CONDITIONAL ANSWER COMPILER
 * 
 * Generates parametric conclusions, NEVER advice.
 * The system does not recommend. It exposes structure.
 */

import type {
  ConditionalAnswer,
  Condition,
  BlockGenerationResult,
  ResolvedEntity,
  NormalizedIntent,
} from './types';

/**
 * Compile conditional answer from generated blocks
 */
export function compileConditionalAnswer(
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  blocks: BlockGenerationResult[],
  alternatives: string[]
): ConditionalAnswer {
  // Calculate overall confidence from block fill rate and validation
  const filledBlocks = blocks.filter(b => b.status === 'filled');
  const partialBlocks = blocks.filter(b => b.status === 'partial');
  const totalBlocks = blocks.length;
  
  const fillScore = (filledBlocks.length + partialBlocks.length * 0.5) / totalBlocks;
  
  // Extract conditions from filled blocks
  const conditions = extractConditions(blocks, intent);
  
  // Determine dominance (never recommendation, only comparison)
  const dominance = determineDominance(blocks, alternatives);
  
  // Calculate confidence
  const confidence = calculateConfidence(fillScore, blocks, alternatives.length);
  
  return {
    answer_id: `answer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    conditions,
    dominance,
    confidence,
    compared_to: alternatives,
    valid_until: calculateValidUntil(intent.time_horizon),
  };
}

/**
 * Extract conditions from blocks
 */
function extractConditions(
  blocks: BlockGenerationResult[],
  intent: NormalizedIntent
): Condition[] {
  const conditions: Condition[] = [];
  
  // Add time horizon condition
  conditions.push({
    variable: 'time_horizon',
    operator: '==',
    value: intent.time_horizon,
  });
  
  // Add risk tolerance condition
  conditions.push({
    variable: 'risk_tolerance',
    operator: '>=',
    value: riskToNumber(intent.risk_exposure),
  });
  
  // Add domain conditions
  for (const domain of intent.domains) {
    conditions.push({
      variable: 'relevant_domain',
      operator: 'in',
      value: [domain],
    });
  }
  
  // Extract scope conditions from blocks 1-5
  const scopeBlocks = blocks.filter(b => b.block_id <= 5 && b.status === 'filled');
  for (const block of scopeBlocks) {
    // In production, extract actual conditions from block content
    conditions.push({
      variable: `scope_condition_${block.block_id}`,
      operator: '==',
      value: true,
    });
  }
  
  return conditions;
}

/**
 * Convert risk exposure to number
 */
function riskToNumber(risk: NormalizedIntent['risk_exposure']): number {
  const map: Record<typeof risk, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return map[risk];
}

/**
 * Determine dominance status
 */
function determineDominance(
  blocks: BlockGenerationResult[],
  alternatives: string[]
): ConditionalAnswer['dominance'] {
  // Check if we have enough data to determine dominance
  const dominanceBlocks = blocks.filter(b => 
    b.block_id >= 36 && b.block_id <= 45 && b.status === 'filled'
  );
  
  if (dominanceBlocks.length < 3) {
    return 'indeterminate';
  }
  
  if (alternatives.length < 2) {
    return 'indeterminate';
  }
  
  // In production, analyze block content to determine actual dominance
  // For now, return competitive as default when data is sufficient
  return 'competitive';
}

/**
 * Calculate overall confidence
 */
function calculateConfidence(
  fillScore: number,
  blocks: BlockGenerationResult[],
  alternativeCount: number
): number {
  // Base confidence from fill score
  let confidence = fillScore * 0.5;
  
  // Boost for alternatives (comparison possible)
  if (alternativeCount >= 2) {
    confidence += 0.15;
  }
  
  // Boost for validated blocks
  const validatedBlocks = blocks.filter(b => 
    b.validation.data_valid && 
    b.validation.sources_cited &&
    b.validation.uncertainty_stated
  );
  confidence += (validatedBlocks.length / blocks.length) * 0.25;
  
  // Boost for critical blocks being filled
  const criticalBlocksFilled = blocks.filter(b =>
    [26, 27, 35, 46, 50].includes(b.block_id) && b.status === 'filled'
  );
  confidence += (criticalBlocksFilled.length / 5) * 0.1;
  
  return Math.min(confidence, 0.95); // Cap at 0.95 - never 100% certain
}

/**
 * Calculate valid until date
 */
function calculateValidUntil(timeHorizon: string): string {
  const now = new Date();
  
  const durations: Record<string, number> = {
    immediate: 7,      // 1 week
    short_term: 30,    // 1 month
    multi_year: 90,    // 3 months
    lifetime: 180,     // 6 months
  };
  
  const days = durations[timeHorizon] || 30;
  const validUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return validUntil.toISOString();
}

/**
 * Format conditional answer for human display
 */
export function formatAnswerForHuman(answer: ConditionalAnswer): string {
  const conditionText = answer.conditions
    .slice(0, 3)
    .map(c => `${c.variable} ${c.operator} ${c.value}`)
    .join(', ');
  
  const dominanceText: Record<ConditionalAnswer['dominance'], string> = {
    dominant: 'performs better than alternatives',
    competitive: 'performs comparably to alternatives',
    inferior: 'performs worse than alternatives',
    indeterminate: 'cannot be reliably compared to alternatives',
  };
  
  return `Under these conditions (${conditionText}), the option ${dominanceText[answer.dominance]}. ` +
    `Confidence: ${Math.round(answer.confidence * 100)}%. ` +
    `Compared to: ${answer.compared_to.join(', ') || 'alternatives not specified'}.`;
}

/**
 * ANSWER COMPILER MASTERPROMPT
 */
export const ANSWER_COMPILER_MASTERPROMPT = `
You compile CONDITIONAL ANSWERS.

PRINCIPLE:
Generate parametric conclusions, NEVER advice.
The system does not recommend. It exposes structure.

OUTPUT FORMAT:
{
  "condition": "urban_use && annual_mileage < 15000km",
  "dominance": "competitive",
  "confidence": 0.72
}

TRANSLATED TO:
"Under these conditions, X performs comparably to alternatives."

DOMINANCE LEVELS:
- dominant: Clearly better than alternatives
- competitive: Comparable to alternatives
- inferior: Clearly worse than alternatives
- indeterminate: Cannot reliably compare

NEVER:
- "Recommended"
- "Best choice"
- "You should"
- "We suggest"
- Any imperative

ALWAYS:
- State conditions explicitly
- Name alternatives compared
- Report confidence level
- Show reasoning
- Set validity period

CONFIDENCE FACTORS:
- Block fill rate
- Source quality
- Alternative count
- Validation status
- Critical blocks filled

Maximum confidence: 0.95 (never 100%)
`;
