/**
 * "ARE YOU ASKING THE RIGHT QUESTION?" FILTER
 * 
 * When someone searches, the system first responds with:
 * "This depends on a small number of assumptions. 
 *  Here is what the question actually resolves to."
 * 
 * This is not UX friction. It is cognitive enlightenment.
 */

import type {
  QuestionAnalysis,
  DecisionScope,
} from './types';
import { mapQueryToBlueprint } from '../cdp-generator';

/**
 * Analyze a question to reveal its true structure
 */
export function analyzeQuestion(query: string): QuestionAnalysis {
  const blueprint = mapQueryToBlueprint(query);
  
  // Extract key assumptions hidden in the question
  const keyAssumptions = revealHiddenAssumptions(query, blueprint);
  
  // Determine implicit scope
  const implicitScope = extractImplicitScope(query, blueprint);
  
  // Generate better questions
  const betterQuestions = generateBetterQuestions(query, blueprint);
  
  // Recommend scope settings
  const recommendedScope = calculateRecommendedScope(implicitScope);
  
  return {
    original_question: query,
    resolved_question: resolveQuestion(query, blueprint),
    key_assumptions_revealed: keyAssumptions,
    implicit_scope: implicitScope,
    alternative_questions: betterQuestions,
    recommended_scope: recommendedScope,
  };
}

/**
 * Resolve question to its underlying decision
 */
function resolveQuestion(query: string, blueprint: ReturnType<typeof mapQueryToBlueprint>): string {
  const templates: Record<string, string> = {
    'is_x_good': 'Whether [X] meets your specific needs better than alternatives, given your budget, timeline, and priorities.',
    'should_i_buy': 'Whether purchasing [X] is rational for someone with your usage profile, budget, and time horizon.',
    'x_vs_y': 'Which of [X] or [Y] better fits your specific situation, given the trade-offs that matter to you.',
    'is_x_worth_price': 'Whether the value [X] provides justifies its cost for your specific use case.',
    'problems_with_x': 'Whether the known issues with [X] would affect your specific situation.',
    'pros_cons_x': 'Whether the advantages of [X] outweigh the disadvantages for your particular needs.',
    'is_x_safe': 'Whether the risk profile of [X] is acceptable given your risk tolerance.',
    'how_reliable_is_x': 'Whether the reliability of [X] meets the requirements of your use case.',
  };
  
  const template = templates[blueprint.decision_type] || 
    'Whether [X] is the right choice given your specific circumstances and priorities.';
  
  // Extract X from query
  const xMatch = query.match(/(?:is|should i buy|problems with|pros cons of)\s+(.+)/i);
  const x = xMatch ? xMatch[1].trim() : query;
  
  return template.replace('[X]', x).replace('[Y]', 'alternatives');
}

/**
 * Reveal assumptions hidden in the question
 */
function revealHiddenAssumptions(
  query: string,
  blueprint: ReturnType<typeof mapQueryToBlueprint>
): string[] {
  const assumptions: string[] = [];
  
  // Universal hidden assumptions
  assumptions.push('You have a specific use case in mind (not just general curiosity)');
  assumptions.push('You are comparing against alternatives (explicit or implicit)');
  assumptions.push('Your budget and timeline are defined (even if not stated)');
  
  // Type-specific hidden assumptions
  if (blueprint.decision_type.includes('buy')) {
    assumptions.push('You have the means to purchase');
    assumptions.push('You have assessed whether you need this category of thing at all');
  }
  
  if (blueprint.decision_type.includes('investment')) {
    assumptions.push('You can afford to lose what you invest');
    assumptions.push('You have a defined investment horizon');
  }
  
  if (blueprint.risk_exposure === 'high' || blueprint.risk_exposure === 'critical') {
    assumptions.push('You understand this is a high-stakes decision');
    assumptions.push('You have considered professional advice');
  }
  
  if (blueprint.alternatives_required) {
    assumptions.push('You are willing to consider alternatives');
  }
  
  return assumptions;
}

/**
 * Extract implicit scope from question
 */
function extractImplicitScope(
  query: string,
  blueprint: ReturnType<typeof mapQueryToBlueprint>
): QuestionAnalysis['implicit_scope'] {
  const queryLower = query.toLowerCase();
  
  // Budget extraction
  let budget = 'not specified';
  if (queryLower.includes('cheap') || queryLower.includes('budget')) {
    budget = 'low';
  } else if (queryLower.includes('luxury') || queryLower.includes('premium')) {
    budget = 'high';
  } else if (queryLower.includes('best value') || queryLower.includes('worth')) {
    budget = 'value-conscious';
  }
  
  // Timeline extraction
  let timeline = 'not specified';
  if (blueprint.time_horizon === 'immediate') {
    timeline = 'short-term';
  } else if (blueprint.time_horizon === 'lifetime') {
    timeline = 'long-term';
  } else {
    timeline = 'medium-term (typical)';
  }
  
  // Risk extraction
  let risk = 'normal (assumed)';
  if (queryLower.includes('safe') || queryLower.includes('risk')) {
    risk = 'risk-aware';
  }
  if (blueprint.risk_exposure === 'high') {
    risk = 'high-stakes';
  }
  
  // Profile extraction
  let profile = 'general consumer';
  if (queryLower.includes('professional') || queryLower.includes('business')) {
    profile = 'professional/business';
  } else if (queryLower.includes('family') || queryLower.includes('kids')) {
    profile = 'family-oriented';
  } else if (queryLower.includes('beginner') || queryLower.includes('first')) {
    profile = 'beginner/first-time';
  }
  
  return { budget, timeline, risk, profile };
}

/**
 * Generate better questions to ask
 */
function generateBetterQuestions(
  query: string,
  blueprint: ReturnType<typeof mapQueryToBlueprint>
): string[] {
  const questions: string[] = [];
  
  // Add scope-clarifying questions
  questions.push(`What ${extractSubject(query)} features matter most for your specific use?`);
  questions.push(`What is your realistic budget and timeline?`);
  questions.push(`What alternatives have you already considered?`);
  
  // Add type-specific better questions
  if (blueprint.decision_type.includes('buy')) {
    questions.push(`What problem are you trying to solve with this purchase?`);
    questions.push(`What happens if this purchase doesn't work out?`);
  }
  
  if (blueprint.alternatives_required) {
    questions.push(`What would you choose if this option didn't exist?`);
  }
  
  if (blueprint.risk_exposure === 'high') {
    questions.push(`What is the worst realistic outcome, and can you accept it?`);
  }
  
  return questions.slice(0, 5); // Max 5
}

/**
 * Extract subject from query
 */
function extractSubject(query: string): string {
  const cleaned = query
    .replace(/^(is|should i buy|what about|problems with|pros cons of)\s+/i, '')
    .replace(/\s+(good|bad|worth it|reliable).*$/i, '')
    .trim();
  
  return cleaned || 'this option';
}

/**
 * Calculate recommended scope settings
 */
function calculateRecommendedScope(
  implicit: QuestionAnalysis['implicit_scope']
): DecisionScope {
  // Map implicit scope to explicit settings
  let timeHorizon: DecisionScope['time_horizon'] = 'medium';
  if (implicit.timeline.includes('short')) {
    timeHorizon = 'short';
  } else if (implicit.timeline.includes('long')) {
    timeHorizon = 'long';
  }
  
  let riskTolerance: DecisionScope['risk_tolerance'] = 'normal';
  if (implicit.risk.includes('risk-aware') || implicit.risk.includes('high-stakes')) {
    riskTolerance = 'low';
  }
  
  return {
    time_horizon: timeHorizon,
    risk_tolerance: riskTolerance,
    usage_profile: implicit.profile,
    budget_range: implicit.budget,
  };
}

/**
 * Format question analysis for display
 */
export function formatQuestionAnalysis(analysis: QuestionAnalysis): {
  header: string;
  resolved: string;
  assumptions: string[];
  scope: { label: string; value: string }[];
  better_questions: string[];
} {
  return {
    header: 'This depends on a small number of assumptions',
    resolved: analysis.resolved_question,
    assumptions: analysis.key_assumptions_revealed,
    scope: [
      { label: 'Budget', value: analysis.implicit_scope.budget },
      { label: 'Timeline', value: analysis.implicit_scope.timeline },
      { label: 'Risk profile', value: analysis.implicit_scope.risk },
      { label: 'User type', value: analysis.implicit_scope.profile },
    ],
    better_questions: analysis.alternative_questions,
  };
}

/**
 * QUESTION ANALYZER MASTERPROMPT
 */
export const QUESTION_ANALYZER_MASTERPROMPT = `
You perform "ARE YOU ASKING THE RIGHT QUESTION?" analysis.

WHEN SOMEONE SEARCHES:
"Is Volkswagen Golf a good car?"

SYSTEM RESPONDS FIRST WITH:
"This depends on a small number of assumptions.
Here is what the question actually resolves to."

THEN SHOWS:
- Budget level
- Driving profile  
- Time horizon
- Alternatives

THIS IS NOT UX FRICTION.
THIS IS COGNITIVE ENLIGHTENMENT.

PROCESS:
1. Take surface question
2. Reveal hidden assumptions
3. Show implicit scope
4. Generate better questions
5. Recommend explicit scope

HIDDEN ASSUMPTIONS ALWAYS INCLUDE:
- You have a specific use case
- You are comparing against alternatives
- Your budget and timeline are defined
- You understand the stakes

BETTER QUESTIONS:
- What features matter for YOUR use?
- What is YOUR realistic budget?
- What alternatives have YOU considered?
- What happens if this doesn't work out?

RESULT:
User understands the STRUCTURE of their decision
before seeing any data about options.
`;
