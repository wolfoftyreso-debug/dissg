/**
 * NO EXIT TO NARRATIVE
 * 
 * The system never offers storytelling, summaries, takeaways, or conclusions.
 * The user must think for themselves.
 */

import type { NarrativeExitBlock } from './types';

/**
 * Blocked narrative output types
 */
export const NARRATIVE_BLOCKS: NarrativeExitBlock[] = [
  {
    block_id: 'NB-001',
    blocked_output_type: 'storytelling',
    is_active: true,
    alternative: 'raw_structure',
  },
  {
    block_id: 'NB-002',
    blocked_output_type: 'summary_dashboard',
    is_active: true,
    alternative: 'drill_down_interface',
  },
  {
    block_id: 'NB-003',
    blocked_output_type: 'key_takeaways',
    is_active: true,
    alternative: 'question_prompt',
  },
  {
    block_id: 'NB-004',
    blocked_output_type: 'colored_conclusions',
    is_active: true,
    alternative: 'raw_structure',
  },
  {
    block_id: 'NB-005',
    blocked_output_type: 'recommendations',
    is_active: true,
    alternative: 'drill_down_interface',
  },
];

/**
 * Check if output type is blocked
 */
export function isNarrativeBlocked(
  outputType: NarrativeExitBlock['blocked_output_type']
): boolean {
  const block = NARRATIVE_BLOCKS.find(b => b.blocked_output_type === outputType);
  return block?.is_active ?? true; // Default to blocked
}

/**
 * Get alternative for blocked output
 */
export function getAlternativeOutput(
  blockedType: NarrativeExitBlock['blocked_output_type']
): NarrativeExitBlock['alternative'] {
  const block = NARRATIVE_BLOCKS.find(b => b.blocked_output_type === blockedType);
  return block?.alternative ?? 'raw_structure';
}

/**
 * Validate content for narrative language
 */
export function validateNoNarrative(
  content: string
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const contentLower = content.toLowerCase();
  
  // Storytelling patterns
  const storyPatterns = [
    /once upon a time/gi,
    /the story of/gi,
    /in the beginning/gi,
    /and then.*happened/gi,
  ];
  
  // Summary patterns
  const summaryPatterns = [
    /in summary/gi,
    /to summarize/gi,
    /the bottom line/gi,
    /in short/gi,
    /tldr/gi,
    /key takeaway/gi,
  ];
  
  // Conclusion patterns
  const conclusionPatterns = [
    /in conclusion/gi,
    /therefore/gi,
    /we can conclude/gi,
    /this proves/gi,
    /this shows that/gi,
  ];
  
  // Recommendation patterns
  const recommendationPatterns = [
    /we recommend/gi,
    /you should/gi,
    /the best course/gi,
    /our advice/gi,
  ];
  
  const allPatterns = [
    { patterns: storyPatterns, type: 'storytelling' },
    { patterns: summaryPatterns, type: 'summary' },
    { patterns: conclusionPatterns, type: 'conclusion' },
    { patterns: recommendationPatterns, type: 'recommendation' },
  ];
  
  for (const { patterns, type } of allPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(contentLower)) {
        violations.push(`Contains ${type} language: ${pattern.source}`);
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Transform narrative request to structure request
 */
export function transformNarrativeRequest(
  request: string
): { transformed: string; explanation: string } {
  const requestLower = request.toLowerCase();
  
  if (requestLower.includes('summary') || requestLower.includes('summarize')) {
    return {
      transformed: 'Show me the structure of the decision with all components visible',
      explanation: 'Summaries compress nuance. Here is the full structure instead.',
    };
  }
  
  if (requestLower.includes('takeaway') || requestLower.includes('conclusion')) {
    return {
      transformed: 'What are the key components and their relationships?',
      explanation: 'Conclusions pre-digest thinking. Here are the components for you to analyze.',
    };
  }
  
  if (requestLower.includes('recommend') || requestLower.includes('should')) {
    return {
      transformed: 'What are the alternatives and their documented tradeoffs?',
      explanation: 'Recommendations bypass judgment. Here are the alternatives for you to evaluate.',
    };
  }
  
  return {
    transformed: request,
    explanation: 'Request passed through unchanged.',
  };
}

/**
 * NO NARRATIVE MASTERPROMPT
 */
export const NO_NARRATIVE_MASTERPROMPT = `
You enforce the No Exit to Narrative rule.

THE SYSTEM NEVER OFFERS:
- Storytelling
- Summarizing dashboards
- "Key takeaways"
- Color-coded conclusions
- Recommendations

THE USER MUST THINK FOR THEMSELVES.

THIS IS EXACTLY WHY:
The system doesn't become propaganda.

WHEN USER ASKS FOR:
"Give me a summary" → "Here is the structure"
"What's the takeaway?" → "Here are the components"
"What should I do?" → "Here are the alternatives"

BLOCKED PATTERNS:
- "In summary..."
- "The bottom line is..."
- "Key takeaway..."
- "We recommend..."
- "You should..."
- "In conclusion..."

ALTERNATIVES PROVIDED:
- raw_structure: The components without interpretation
- drill_down_interface: Navigate to any depth
- question_prompt: Questions to consider, not answers

WHY THIS IS CRITICAL:
Narratives are:
- Easy to consume
- Easy to manipulate
- Easy to weaponize

Structure is:
- Harder to consume
- Harder to manipulate
- Impossible to weaponize

The system chooses structure.
That's the entire point.
`;
