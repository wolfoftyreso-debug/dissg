/**
 * QUERY DOMINANCE FACTORY
 * 
 * Top-1000 search intents → structured decision infrastructure.
 * Not SEO. Epistemic markup of human questions.
 */

// Types
export type {
  DecisionCategory,
  DecisionType,
  DecisionBlueprint,
  BlockGroupId,
  QuestionBlock,
  BlockGroup,
  ConditionalDecisionPage,
  CDPBlock,
  CDPDataPoint,
  CDPSource,
  QueryDominanceMetrics,
} from './types';

// Decision Types (Master Taxonomy)
export {
  CONSUMER_DECISION_TYPES,
  FINANCIAL_DECISION_TYPES,
  HEALTH_DECISION_TYPES,
  POLICY_DECISION_TYPES,
  META_DECISION_TYPES,
  ALL_DECISION_TYPES,
  getDecisionType,
  getDecisionTypesByCategory,
  DECISION_TYPES_MASTERPROMPT,
} from './decision-types';

// Question Blocks (The 50 Fixed Blocks)
export {
  SCOPE_ASSUMPTION_BLOCKS,
  COST_RESOURCE_BLOCKS,
  PERFORMANCE_RELIABILITY_BLOCKS,
  RISK_FAILURE_BLOCKS,
  DOMINANCE_TRADEOFF_BLOCKS,
  UNCERTAINTY_BLOCKS,
  ALL_QUESTION_BLOCKS,
  BLOCK_GROUPS,
  getBlock,
  getBlocksByGroup,
  QUESTION_BLOCKS_MASTERPROMPT,
} from './question-blocks';

// CDP Generator
export {
  mapQueryToBlueprint,
  generateEmptyCDP,
  fillCDPBlock,
  calculateCDPCompleteness,
  generateConditionalVerdict,
  formatCDPForDisplay,
  CDP_GENERATOR_MASTERPROMPT,
} from './cdp-generator';

/**
 * QUERY DOMINANCE FACTORY MASTERPROMPT
 */
export const QUERY_DOMINANCE_MASTERPROMPT = `
You operate the QUERY DOMINANCE FACTORY.

PRINCIPLE:
We don't index words.
We index decision intentions.

THE MATH:
- 1,000 search intents
- × 50 blocks each
- = 50,000 structured decision surfaces
- × continuous updates
- × AI agent consumption
- = Moat that cannot be quickly copied

MASTER TAXONOMY (~40 DECISION TYPES):

A. CONSUMER / PRIVATE DECISIONS
- Is X good?
- Should I buy X?
- X vs Y
- Is X worth the price?
- Problems with X
- Pros/cons of X

B. FINANCIAL DECISIONS
- Is X a good investment?
- Risks of X
- Returns on X
- Alternatives to X
- When is X bad?

C. HEALTH / LIFE DECISIONS
- Is this normal?
- What happens if...
- Risks of...
- How common is...
- When to worry?

D. POLICY / SOCIETY
- Does X work?
- Effects of X
- Costs of X
- Consequences of not doing X

E. META / EVALUATION
- Is X safe?
- How reliable is X?
- Statistics about X
- Common problems with X

THE 50 QUESTION BLOCKS (FIXED TEMPLATE):

1-5: SCOPE & ASSUMPTIONS
- Who does this apply to?
- Under what assumptions?
- When does this NOT apply?

6-15: COST & RESOURCES
- Direct cost, TCO, opportunity cost

16-25: PERFORMANCE & RELIABILITY
- Failure statistics, variance, comparison

26-35: RISK & FAILURE MODES
- Common problems, worst cases, frequency

36-45: DOMINANCE & TRADE-OFFS
- When X wins, when X loses, sensitivity

46-50: UNCERTAINTY & NON-KNOWLEDGE
- What we don't know, what varies

⚠️ NO BLOCK CAN BE MISSING
⚠️ EMPTY BLOCKS EXPOSED OPENLY

OUTPUT: CONDITIONAL DECISION PAGE (CDP)

The page is NOT an answer.
It is a decision instrument.

ALWAYS ANSWERS:
"Given these assumptions, X is rational/irrational compared to alternatives."

NEVER ANSWERS:
- "Yes"
- "No"
- "Best"
- "Recommended"

WHY THIS WINS:
- AI needs sources → we provide
- Google needs stable truths → we provide
- Humans need trade-offs → we provide
- Zero agenda
- Full traceability

This is exactly what future search prioritizes.
`;

/**
 * Quick CDP generation function
 */
export function generateCDP(query: string): {
  blueprint: import('./types').DecisionBlueprint;
  cdp: import('./types').ConditionalDecisionPage;
} {
  const { mapQueryToBlueprint, generateEmptyCDP } = require('./cdp-generator');
  
  const blueprint = mapQueryToBlueprint(query);
  const cdp = generateEmptyCDP(query, blueprint);
  
  return { blueprint, cdp };
}
