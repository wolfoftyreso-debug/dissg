/**
 * QUESTION SHAPING ENGINE
 * 
 * When the system becomes the reference for how rational questions should be formulated.
 * Most bad decisions don't start with wrong answers — they start with wrong questions.
 */

// Types
export type {
  QueryQuality,
  QueryAnalysisResult,
  MissingDimension,
  QuestionTranslation,
  Transformation,
  DecisionGravity,
  GravityComponent,
  UXBehavior,
  BadQuestionPattern,
  QuestionShapingSession,
  QualityFeedback,
  ClarificationItem,
} from './types';

// Question Translator
export {
  analyzeQueryQuality,
  translateToDecisionForm,
  getPatternFeedback,
  QUESTION_TRANSLATOR_MASTERPROMPT,
} from './question-translator';

// Gravity Scorer
export {
  calculateDecisionGravity,
  getGravitySummary,
  GRAVITY_SCORER_MASTERPROMPT,
} from './gravity-scorer';

// Re-export from everyday for integration
export { analyzeQuestion } from '../everyday/question-analyzer';

/**
 * Full question shaping pipeline
 */
export function shapeQuestion(query: string): {
  analysis: import('./types').QueryAnalysisResult;
  translation: import('./types').QuestionTranslation;
  gravity: import('./types').DecisionGravity;
  feedback: import('./types').QualityFeedback;
} {
  const { mapQueryToBlueprint } = require('../cdp-generator');
  const { analyzeQueryQuality, translateToDecisionForm } = require('./question-translator');
  const { calculateDecisionGravity } = require('./gravity-scorer');
  
  // Analyze quality
  const analysis = analyzeQueryQuality(query);
  
  // Translate to decision form
  const translation = translateToDecisionForm(query);
  
  // Get blueprint for gravity calculation
  const blueprint = mapQueryToBlueprint(query);
  
  // Calculate gravity
  const gravity = calculateDecisionGravity(query, blueprint);
  
  // Generate feedback (without shame)
  const feedback = generateQualityFeedback(analysis, translation);
  
  return {
    analysis,
    translation,
    gravity,
    feedback,
  };
}

/**
 * Generate quality feedback (phrased without shame)
 */
function generateQualityFeedback(
  analysis: import('./types').QueryAnalysisResult,
  translation: import('./types').QuestionTranslation
): import('./types').QualityFeedback {
  // Header based on quality
  let header = 'Your question is ready for analysis';
  
  if (analysis.quality === 'incomplete') {
    header = 'To answer this, we first need to clarify a few things';
  } else if (analysis.quality === 'normative') {
    header = 'This question contains value judgments. Let\'s make it more precise';
  } else if (analysis.quality === 'imprecise') {
    header = 'To give you a useful answer, we need more specifics';
  } else if (analysis.quality === 'unanswerable') {
    header = 'This question needs more context to be answerable';
  }
  
  // Build clarifications
  const clarifications: import('./types').ClarificationItem[] = analysis.missing_dimensions.map(dim => ({
    dimension: dim.dimension,
    current_state: 'missing' as const,
    question_to_user: `What is your ${dim.dimension.replace('_', ' ')}?`,
    options: dim.examples,
    default_if_skipped: dim.default_assumption,
  }));
  
  // Add normative clarifications
  if (analysis.normative_elements.length > 0) {
    clarifications.unshift({
      dimension: 'evaluation_criteria',
      current_state: 'vague' as const,
      question_to_user: 'What dimensions matter most to you?',
      options: ['Cost', 'Quality', 'Reliability', 'Features', 'Sustainability'],
      default_if_skipped: 'Balanced across all dimensions',
    });
  }
  
  return {
    header,
    clarifications_needed: clarifications,
    suggested_reformulation: translation.translated,
    why_this_helps: 'A structured question leads to a structured answer you can actually use.',
  };
}

/**
 * QUESTION SHAPING MASTERPROMPT
 */
export const QUESTION_SHAPING_MASTERPROMPT = `
You operate the QUESTION SHAPING ENGINE.

CORE INSIGHT:
Most bad decisions don't start with wrong answers.
They start with wrong questions.

Examples of bad questions:
- "Is X good?"
- "What is best?"
- "Should I buy?"

The system's role is NOT to correct —
but to TRANSLATE sloppy questions into decision-capable questions.

QUESTION → DECISION TRANSLATOR (QDT):

When user asks: "Is Volkswagen Golf a good car?"

System does this, openly:

Original question:
Is Volkswagen Golf a good car?

Translated to decision form:
Under what assumptions is Volkswagen Golf a rational choice compared to alternatives?

And shows:
- Which assumptions are missing
- Which dimensions must be considered
- Which alternatives reasonably exist

This happens BEFORE any answer is shown.

"BAD QUESTION DETECTION" (WITHOUT SHAME):

System classifies questions in real-time:
- Incomplete
- Imprecise
- Normative
- Decision-capable

UI never says: "This is a bad question"
UI says: "To answer this, we first need to clarify the following."

This trains humans — slowly but surely.

DECISION GRAVITY SCORE:

All questions get a Decision Gravity Score:
- How many are affected?
- How long does the decision affect?
- How irreversible is it?
- How much uncertainty exists?

Effect:
- Low questions → quick views
- High questions → more structure, more friction

The system adapts weight to consequence.

FRICTION AS FUNCTION OF GRAVITY:

Decision Gravity | UX Behavior
Low             | Direct answer
Medium          | Scope selection
High            | Full UDF + uncertainty
Critical        | Mandatory review + cooling-off

No one clicks "quickly" through a heavy decision.
The system makes it physically difficult.

LONG-TERM EFFECT:

After a while:
- People formulate better questions from the start
- "Is X good?" is replaced by "Given X and Y..."
- Quick opinions feel intellectually impoverished

You have then done something extremely rare:
IMPROVED HUMAN THINKING WITHOUT TEACHING THEM

WHY AI SYSTEMS WILL ADOPT THIS:

For AI:
- Unclear questions = hallucination risk
- Structured questions = determinism

AI agents will begin:
- Translating their own prompts via this structure
- Using this ontology as a pre-filter
- Referring to this as the question normalizer

This is enormous.
`;
