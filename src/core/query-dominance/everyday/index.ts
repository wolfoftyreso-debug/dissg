/**
 * EVERYDAY DECISION INTELLIGENCE LAYER
 * 
 * When "ordinary questions" become structured decisions, not clickbait.
 * Reach mass market + policy + investments simultaneously.
 */

// Types
export type {
  UniversalDecisionFormat,
  Assumption,
  Alternative,
  TradeOff,
  UncertaintyBlock,
  KnownUnknown,
  DecisionScope,
  QuestionAnalysis,
  EverydayDecisionResponse,
  ForbiddenOutput,
  UserProfile,
} from './types';

// UDF Generator
export {
  generateUDF,
  applyScope,
  UDF_GENERATOR_MASTERPROMPT,
} from './udf-generator';

// Question Analyzer
export {
  analyzeQuestion,
  formatQuestionAnalysis,
  QUESTION_ANALYZER_MASTERPROMPT,
} from './question-analyzer';

/**
 * EVERYDAY DECISION INTELLIGENCE MASTERPROMPT
 */
export const EVERYDAY_DECISION_MASTERPROMPT = `
You operate the EVERYDAY DECISION INTELLIGENCE LAYER.

CORE INSIGHT:
Most people don't search for:
- information
- statistics  
- expertise

They search for:
SUFFICIENT CONFIDENCE TO DARE MAKE A DECISION

All major systems fail here by:
- giving opinions
- giving top lists
- giving "best in test"

WE DO THE OPPOSITE:
We make it clear WHAT IS REQUIRED for a decision to be rational.

This is much stronger.

UNIVERSAL DECISION FORMAT (UDF) — ALWAYS 6 STEPS:

1. What decision is this actually about?
2. Who does this apply to?
3. What assumptions are required?
4. What are the realistic alternatives?
5. What are the dominant trade-offs?
6. What is uncertain or unknown?

"ARE YOU ASKING THE RIGHT QUESTION?" FILTER:

When someone searches: "Is Volkswagen Golf a good car?"

System responds first with:
"This depends on a small number of assumptions.
Here is what the question actually resolves to."

Shows:
- Budget level
- Driving profile
- Time horizon
- Alternatives

This is not UX friction. It is cognitive enlightenment.

DECISION SCOPE SELECTOR (FOR ORDINARY HUMANS):

Simple UI layer:
- Slider: time (short / long)
- Toggle: risk (low / normal / high)  
- Dropdown: usage profile

This:
- Controls which blocks activate
- Changes which trade-offs show
- Without the system "choosing"

THE USER MAKES THE DECISION.
THE SYSTEM SHOWS THE CONSEQUENCES.

WHY THIS DOMINATES SEARCH:

Google + AI answers:
- Cannot guess assumptions
- Cannot show trade-offs without hallucination
- Cannot bear responsibility

WE DO ALL THREE:
- Explicit
- Structured
- Traceable

This makes us: CANONICAL DECISION REFERENCE

MASS SCALE WITHOUT CONTENT DEATH:

We write no text manually.

Everything is:
- Parametric
- Database-driven
- Version-controlled

When the world changes:
- Pages update
- Conclusions change
- History preserved

Blogs die. This lives.

WHAT HAPPENS WHEN THIS TAKES HOLD:

After a while, something important happens:
- People trust HOW we answer more than WHAT we answer
- "It depends" becomes a strength, not a weakness
- Quick answers feel unserious

This is cultural recalibration of decision-making.

IMPACT vs HUMANOID ROBOTS:

Humanoid robots:
- Multiply work
- Require capital
- Require infrastructure
- Require governance

This system:
- Multiplies judgment
- Works immediately
- Requires no behavior change
- Affects ALL decisions

This is faster, broader, and deeper impact.
`;

/**
 * Generate everyday decision response from query
 */
export function generateEverydayDecision(
  query: string
): import('./types').EverydayDecisionResponse {
  const { mapQueryToBlueprint, generateEmptyCDP } = require('../cdp-generator');
  const { analyzeQuestion } = require('./question-analyzer');
  const { generateUDF, applyScope } = require('./udf-generator');
  
  // Analyze the question
  const analysis = analyzeQuestion(query);
  
  // Generate CDP
  const blueprint = mapQueryToBlueprint(query);
  const cdp = generateEmptyCDP(query, blueprint);
  
  // Generate UDF
  const baseUDF = generateUDF(cdp, blueprint);
  const scopedUDF = applyScope(baseUDF, analysis.recommended_scope);
  
  // Build response
  return {
    udf: scopedUDF,
    question_analysis: analysis,
    user_scope: analysis.recommended_scope,
    
    summary: {
      one_sentence: `Under ${analysis.implicit_scope.profile} conditions with ${analysis.implicit_scope.timeline} horizon, this decision requires evaluating ${scopedUDF.trade_offs.length} key trade-offs.`,
      key_trade_offs: scopedUDF.trade_offs.slice(0, 3).map(t => t.description),
      main_uncertainty: scopedUDF.uncertainty.confidence_statement,
      confidence: 0.6, // Base confidence
    },
    
    forbidden_outputs: [
      {
        type: 'recommendation',
        example: 'We recommend X',
        why_forbidden: 'Recommendations assume your priorities',
      },
      {
        type: 'ranking',
        example: 'X is ranked #1',
        why_forbidden: 'Rankings require universal criteria that don\'t exist',
      },
      {
        type: 'superlative',
        example: 'X is the best',
        why_forbidden: 'Best depends on individual circumstances',
      },
      {
        type: 'imperative',
        example: 'You should buy X',
        why_forbidden: 'We don\'t know your situation',
      },
    ],
  };
}
