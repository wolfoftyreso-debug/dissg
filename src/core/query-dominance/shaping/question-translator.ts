/**
 * QUESTION → DECISION TRANSLATOR (QDT)
 * 
 * Translates sloppy questions into decision-capable questions.
 * This happens BEFORE any answer is shown.
 */

import type {
  QueryAnalysisResult,
  QueryQuality,
  MissingDimension,
  QuestionTranslation,
  Transformation,
  BadQuestionPattern,
} from './types';

/**
 * Bad question patterns
 */
const BAD_PATTERNS: BadQuestionPattern[] = [
  {
    pattern_id: 'normative_good_bad',
    pattern_regex: '(is|are)\\s+.+\\s+(good|bad|worth)',
    pattern_type: 'normative',
    detection_keywords: ['good', 'bad', 'worth it', 'worthwhile'],
    translation_template: 'Under what conditions is [X] a rational choice compared to alternatives?',
    explanation: 'Good/bad are value judgments that depend on individual circumstances',
  },
  {
    pattern_id: 'superlative_best',
    pattern_regex: '(what|which)\\s+is\\s+(the\\s+)?(best|top|#1)',
    pattern_type: 'superlative',
    detection_keywords: ['best', 'top', 'number one', '#1', 'greatest'],
    translation_template: 'Which option dominates across [dimensions] for [profile]?',
    explanation: 'Best implies universal ranking that doesn\'t exist',
  },
  {
    pattern_id: 'vague_should',
    pattern_regex: 'should\\s+i\\s+(buy|get|choose|pick)',
    pattern_type: 'vague',
    detection_keywords: ['should i', 'should we'],
    translation_template: 'Given [assumptions], is [X] rational for someone with [profile]?',
    explanation: 'Should implies advice; we show trade-offs, not recommendations',
  },
  {
    pattern_id: 'false_dichotomy',
    pattern_regex: '(.+)\\s+or\\s+(.+)\\s*\\?',
    pattern_type: 'false_dichotomy',
    detection_keywords: ['or', 'vs', 'versus'],
    translation_template: 'How do [X] and [Y] compare across [dimensions], and what other alternatives exist?',
    explanation: 'Binary framing may exclude better options',
  },
  {
    pattern_id: 'loaded_safe',
    pattern_regex: 'is\\s+.+\\s+(safe|risky|dangerous)',
    pattern_type: 'loaded',
    detection_keywords: ['safe', 'risky', 'dangerous', 'secure'],
    translation_template: 'What is the risk profile of [X] across [dimensions]?',
    explanation: 'Safe/dangerous are absolute terms; risk is contextual',
  },
];

/**
 * Analyze query quality
 */
export function analyzeQueryQuality(query: string): QueryAnalysisResult {
  const queryLower = query.toLowerCase().trim();
  
  // Detect pattern matches
  const normativeElements: string[] = [];
  const vagueTerms: string[] = [];
  const missingDimensions: MissingDimension[] = [];
  
  // Check for normative/loaded terms
  const normativeTerms = ['good', 'bad', 'best', 'worst', 'should', 'must', 'need to'];
  for (const term of normativeTerms) {
    if (queryLower.includes(term)) {
      normativeElements.push(term);
    }
  }
  
  // Check for vague terms
  const vaguePatterns = ['it', 'this', 'that', 'these', 'those', 'stuff', 'things'];
  for (const term of vaguePatterns) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(queryLower)) {
      vagueTerms.push(term);
    }
  }
  
  // Check for missing dimensions
  if (!queryLower.includes('budget') && !queryLower.includes('price') && !queryLower.includes('cost')) {
    missingDimensions.push({
      dimension: 'budget',
      why_needed: 'Cost constraints affect which options are viable',
      examples: ['under $30k', 'mid-range', 'premium'],
      default_assumption: 'medium budget range',
    });
  }
  
  if (!queryLower.includes('year') && !queryLower.includes('term') && !queryLower.includes('time')) {
    missingDimensions.push({
      dimension: 'time_horizon',
      why_needed: 'Duration of ownership/use affects rational choice',
      examples: ['1-2 years', '5+ years', 'lifetime'],
      default_assumption: 'medium-term (3-5 years)',
    });
  }
  
  if (!queryLower.includes('vs') && !queryLower.includes('or') && !queryLower.includes('compared')) {
    missingDimensions.push({
      dimension: 'alternatives',
      why_needed: 'Decisions require comparison to other options',
      examples: ['vs competitors', 'vs doing nothing', 'vs different category'],
      default_assumption: 'comparable alternatives in same category',
    });
  }
  
  // Determine quality
  let quality: QueryQuality = 'decision_ready';
  
  if (normativeElements.length > 0) {
    quality = 'normative';
  } else if (vagueTerms.length > 1) {
    quality = 'imprecise';
  } else if (missingDimensions.length >= 2) {
    quality = 'incomplete';
  }
  
  // Check if unanswerable
  if (queryLower.length < 10 || vagueTerms.length > 2) {
    quality = 'unanswerable';
  }
  
  return {
    original_query: query,
    quality,
    missing_dimensions: missingDimensions,
    can_be_answered_directly: quality === 'decision_ready',
    translation_needed: quality !== 'decision_ready',
    normative_elements: normativeElements,
    vague_terms: vagueTerms,
  };
}

/**
 * Translate question to decision form
 */
export function translateToDecisionForm(query: string): QuestionTranslation {
  const analysis = analyzeQueryQuality(query);
  const transformations: Transformation[] = [];
  
  let translated = query;
  
  // Apply transformations based on patterns
  for (const pattern of BAD_PATTERNS) {
    const regex = new RegExp(pattern.pattern_regex, 'i');
    if (regex.test(query)) {
      // Extract subject
      const subject = extractSubject(query);
      
      if (pattern.pattern_type === 'normative') {
        const before = translated;
        translated = `Under what conditions is ${subject} a rational choice compared to alternatives?`;
        transformations.push({
          type: 'removed_normative',
          before,
          after: translated,
          reason: pattern.explanation,
        });
      } else if (pattern.pattern_type === 'superlative') {
        const before = translated;
        translated = `Which option performs best for your specific priorities and constraints?`;
        transformations.push({
          type: 'made_conditional',
          before,
          after: translated,
          reason: pattern.explanation,
        });
      } else if (pattern.pattern_type === 'vague') {
        const before = translated;
        translated = `Given your specific situation, when is ${subject} the rational choice?`;
        transformations.push({
          type: 'added_scope',
          before,
          after: translated,
          reason: pattern.explanation,
        });
      }
      
      break; // Apply first matching pattern
    }
  }
  
  // If no pattern matched but translation needed, apply generic transformation
  if (transformations.length === 0 && analysis.translation_needed) {
    const subject = extractSubject(query);
    const before = translated;
    translated = `Under what assumptions is ${subject} a rational choice for your situation?`;
    transformations.push({
      type: 'made_conditional',
      before,
      after: translated,
      reason: 'Converted absolute question to conditional form',
    });
  }
  
  // Add alternatives if missing
  if (analysis.missing_dimensions.some(d => d.dimension === 'alternatives')) {
    transformations.push({
      type: 'added_alternatives',
      before: '',
      after: 'Comparison against: doing nothing, category alternatives, outside-category options',
      reason: 'Decisions require comparison to alternatives',
    });
  }
  
  return {
    original: query,
    translated,
    transformations,
    revealed_assumptions: analysis.missing_dimensions.map(d => d.default_assumption || `Assumed: ${d.dimension}`),
    revealed_alternatives: ['Primary option', 'Do nothing', 'Category alternatives'],
    revealed_dimensions: analysis.missing_dimensions.map(d => d.dimension),
    quality_before: analysis.quality,
    quality_after: 'decision_ready',
  };
}

/**
 * Extract subject from query
 */
function extractSubject(query: string): string {
  // Remove common question prefixes
  let subject = query
    .replace(/^(is|are|should i|what is|which is|can|will|does|do)\s+/i, '')
    .replace(/\s+(good|bad|worth it|the best|better|safe|risky)\s*\??$/i, '')
    .replace(/\?$/, '')
    .trim();
  
  // Clean up articles
  subject = subject.replace(/^(a|an|the)\s+/i, '');
  
  return subject || 'this option';
}

/**
 * Get pattern-based feedback
 */
export function getPatternFeedback(query: string): {
  matched_pattern: BadQuestionPattern | null;
  feedback: string;
  suggested_question: string;
} {
  const queryLower = query.toLowerCase();
  
  for (const pattern of BAD_PATTERNS) {
    const regex = new RegExp(pattern.pattern_regex, 'i');
    if (regex.test(queryLower) || pattern.detection_keywords.some(k => queryLower.includes(k))) {
      const subject = extractSubject(query);
      return {
        matched_pattern: pattern,
        feedback: pattern.explanation,
        suggested_question: pattern.translation_template
          .replace('[X]', subject)
          .replace('[dimensions]', 'key dimensions')
          .replace('[profile]', 'your profile'),
      };
    }
  }
  
  return {
    matched_pattern: null,
    feedback: 'Question structure appears reasonable',
    suggested_question: query,
  };
}

/**
 * QUESTION TRANSLATOR MASTERPROMPT
 */
export const QUESTION_TRANSLATOR_MASTERPROMPT = `
You operate the QUESTION → DECISION TRANSLATOR (QDT).

CORE INSIGHT:
Most bad decisions don't start with wrong answers.
They start with wrong questions.

BAD QUESTION PATTERNS:
- "Is X good?" → Normative, depends on individual
- "What is best?" → Superlative, no universal ranking exists
- "Should I buy?" → Vague, needs scope
- "X or Y?" → False dichotomy, may exclude options
- "Is X safe?" → Loaded, risk is contextual

TRANSLATION PROCESS:

Original: "Is Volkswagen Golf a good car?"

Translated: "Under what assumptions is Volkswagen Golf 
           a rational choice compared to alternatives?"

Shows:
- Missing assumptions (budget, timeline, use case)
- Required dimensions (cost, reliability, features)
- Implicit alternatives (competitors, do nothing)

UI NEVER SAYS:
"This is a bad question"

UI SAYS:
"To answer this, we first need to clarify the following."

This trains humans — slowly but surely.

TRANSFORMATIONS:
1. Remove normative terms → make conditional
2. Add scope requirements
3. Surface hidden assumptions
4. Include alternatives
5. Clarify vague terms

RESULT:
Questions become decision-capable before any data is shown.
`;
