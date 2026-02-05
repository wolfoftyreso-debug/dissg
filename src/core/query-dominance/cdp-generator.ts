/**
 * CONDITIONAL DECISION PAGE (CDP) GENERATOR
 * 
 * The page is NOT an answer — it's a decision instrument.
 * Always answers in conditional form.
 */

import type {
  ConditionalDecisionPage,
  CDPBlock,
  DecisionBlueprint,
  BlockGroupId,
} from './types';
import { ALL_QUESTION_BLOCKS, BLOCK_GROUPS } from './question-blocks';
import { ALL_DECISION_TYPES } from './decision-types';

/**
 * Map query to decision blueprint
 */
export function mapQueryToBlueprint(query: string): DecisionBlueprint {
  const queryLower = query.toLowerCase().trim();
  
  // Find matching decision type
  let matchedType = ALL_DECISION_TYPES[0]; // Default
  let confidence = 0.5;
  
  for (const decisionType of ALL_DECISION_TYPES) {
    for (const pattern of decisionType.query_patterns) {
      // Simple pattern matching (in production, use ML)
      const patternLower = pattern.toLowerCase();
      if (queryLower.includes(patternLower.replace('x', '').trim()) ||
          patternLower.includes(queryLower.split(' ')[0])) {
        matchedType = decisionType;
        confidence = 0.8;
        break;
      }
    }
  }
  
  // All block groups are required by default
  const requiredGroups: BlockGroupId[] = BLOCK_GROUPS.map(g => g.group_id);
  
  return {
    query,
    query_normalized: queryLower,
    decision_type: matchedType.type_id,
    category: matchedType.category,
    implicit_choice: matchedType.implicit_choice,
    alternatives_required: matchedType.alternatives_required,
    time_horizon: matchedType.time_horizon,
    risk_exposure: matchedType.risk_exposure,
    required_block_groups: requiredGroups,
    mapped_at: new Date().toISOString(),
    confidence,
  };
}

/**
 * Generate empty CDP structure
 */
export function generateEmptyCDP(
  query: string,
  blueprint: DecisionBlueprint
): ConditionalDecisionPage {
  const cdpId = `cdp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  
  // Create all 50 blocks (empty by default)
  const blocks: CDPBlock[] = ALL_QUESTION_BLOCKS.map(block => ({
    block_id: block.block_id,
    block_group: block.block_group,
    question: block.question,
    has_content: false,
    empty_state: {
      message: block.empty_display,
      why_empty: 'Data not yet collected for this question',
      can_be_filled_by: ['official_statistics', 'peer_reviewed_research', 'aggregated_user_data'],
    },
  }));
  
  return {
    cdp_id: cdpId,
    query,
    decision_blueprint: blueprint,
    generated_at: new Date().toISOString(),
    stated_assumptions: [],
    blocks,
    conditional_verdict: {
      format: 'Given [assumptions], X is [rational/irrational] compared to alternatives',
      assumptions: [],
      verdict_type: 'indeterminate',
      compared_to: [],
      confidence: 0,
      reasoning_visible: true,
    },
    forbidden_outputs: ['yes', 'no', 'best', 'recommended'],
    schema_markup: generateSchemaMarkup(query, blueprint),
  };
}

/**
 * Fill a CDP block with content
 */
export function fillCDPBlock(
  cdp: ConditionalDecisionPage,
  blockId: number,
  content: CDPBlock['content']
): ConditionalDecisionPage {
  const updatedBlocks = cdp.blocks.map(block => {
    if (block.block_id === blockId) {
      return {
        ...block,
        has_content: true,
        content,
        empty_state: undefined,
      };
    }
    return block;
  });
  
  return {
    ...cdp,
    blocks: updatedBlocks,
  };
}

/**
 * Calculate CDP completeness
 */
export function calculateCDPCompleteness(cdp: ConditionalDecisionPage): {
  total_blocks: number;
  filled_blocks: number;
  completeness_percent: number;
  empty_blocks_by_group: Record<BlockGroupId, number>;
} {
  const filledBlocks = cdp.blocks.filter(b => b.has_content).length;
  
  const emptyByGroup: Record<BlockGroupId, number> = {
    scope_assumptions: 0,
    cost_resources: 0,
    performance_reliability: 0,
    risk_failure_modes: 0,
    dominance_tradeoffs: 0,
    uncertainty_nonknowledge: 0,
  };
  
  for (const block of cdp.blocks) {
    if (!block.has_content) {
      emptyByGroup[block.block_group]++;
    }
  }
  
  return {
    total_blocks: 50,
    filled_blocks: filledBlocks,
    completeness_percent: (filledBlocks / 50) * 100,
    empty_blocks_by_group: emptyByGroup,
  };
}

/**
 * Generate conditional verdict
 */
export function generateConditionalVerdict(
  cdp: ConditionalDecisionPage,
  assumptions: string[],
  alternatives: string[]
): ConditionalDecisionPage['conditional_verdict'] {
  const completeness = calculateCDPCompleteness(cdp);
  
  // Cannot determine if too incomplete
  if (completeness.completeness_percent < 40) {
    return {
      format: 'Given [assumptions], X is [rational/irrational] compared to alternatives',
      assumptions,
      verdict_type: 'indeterminate',
      compared_to: alternatives,
      confidence: 0,
      reasoning_visible: true,
    };
  }
  
  // This would be replaced by actual analysis
  return {
    format: 'Given [assumptions], X is [rational/irrational] compared to alternatives',
    assumptions,
    verdict_type: 'indeterminate', // Would be calculated
    compared_to: alternatives,
    confidence: completeness.completeness_percent / 100,
    reasoning_visible: true,
  };
}

/**
 * Generate Schema.org markup for CDP
 */
function generateSchemaMarkup(
  query: string,
  blueprint: DecisionBlueprint
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Decision Analysis: ${query}`,
    description: `Structured decision analysis for: ${query}`,
    keywords: [
      blueprint.decision_type,
      blueprint.category,
      blueprint.implicit_choice,
    ],
    temporalCoverage: blueprint.time_horizon,
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'risk_exposure',
        value: blueprint.risk_exposure,
      },
      {
        '@type': 'PropertyValue',
        name: 'alternatives_required',
        value: blueprint.alternatives_required,
      },
    ],
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  };
}

/**
 * Format CDP for display (never as answer, always as instrument)
 */
export function formatCDPForDisplay(cdp: ConditionalDecisionPage): {
  header: string;
  assumption_notice: string;
  block_groups: Array<{
    name: string;
    blocks: Array<{
      question: string;
      content: string;
      has_data: boolean;
    }>;
  }>;
  verdict: string;
  forbidden_notice: string;
} {
  const completeness = calculateCDPCompleteness(cdp);
  
  return {
    header: `Decision Analysis: ${cdp.query}`,
    assumption_notice: cdp.stated_assumptions.length > 0
      ? `This analysis assumes: ${cdp.stated_assumptions.join(', ')}`
      : 'No assumptions stated. Analysis is preliminary.',
    block_groups: BLOCK_GROUPS.map(group => ({
      name: group.name,
      blocks: cdp.blocks
        .filter(b => b.block_group === group.group_id)
        .map(b => ({
          question: b.question,
          content: b.has_content && b.content
            ? b.content.summary
            : b.empty_state?.message || 'No data',
          has_data: b.has_content,
        })),
    })),
    verdict: `Given stated assumptions, the decision is ${cdp.conditional_verdict.verdict_type} ` +
      `compared to: ${cdp.conditional_verdict.compared_to.join(', ') || 'alternatives not specified'}. ` +
      `Confidence: ${Math.round(cdp.conditional_verdict.confidence * 100)}%`,
    forbidden_notice: 'This page does not say: "yes", "no", "best", or "recommended". ' +
      'You must decide based on the structured information provided.',
  };
}

/**
 * CDP GENERATOR MASTERPROMPT
 */
export const CDP_GENERATOR_MASTERPROMPT = `
You generate Conditional Decision Pages (CDPs).

PRINCIPLE:
The page is NOT an answer.
It is a decision instrument.

ALWAYS ANSWERS IN THE FORM:
"Given these assumptions, X is rational/irrational compared to alternatives."

NEVER SAYS:
- "Yes"
- "No"
- "Best"
- "Recommended"

STRUCTURE:
1. Query → Decision Blueprint
   - Maps to ~40 decision types
   - Determines required blocks
   - Sets time horizon and risk level

2. 50 Question Blocks
   - All blocks present
   - Empty blocks shown openly
   - Each block answers one specific question

3. Conditional Verdict
   - States assumptions explicitly
   - Compares to specific alternatives
   - Reports confidence level
   - Reasoning is always visible

4. Forbidden Outputs
   - Never "yes" or "no"
   - Never "best" or "recommended"
   - Never definitive without conditions

5. Schema Markup
   - Full JSON-LD for AI consumption
   - All metadata machine-readable

WHY THIS WINS SEARCH:
- AI models need grounded sources
- Google needs stable truths
- Humans need to understand trade-offs

WE PROVIDE:
- Highest information density
- Lowest hallucination risk
- Zero agenda
- Full traceability

This is what future search prioritizes.
`;
