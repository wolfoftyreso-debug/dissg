/**
 * NEXT-QUESTION ENGINE
 * 
 * Oändlig djup, kontrollerad.
 * Aldrig "vad ska jag göra?"
 * Alltid "vad behöver förstås mer?"
 */

import type { TruthNode } from '../types';

// Question types - never advisory
export type QuestionType = 
  | 'decompose'      // Break down aggregate
  | 'compare'        // Cross-geo or cross-time
  | 'correlate'      // Find co-movement
  | 'historicize'    // Extend timeline
  | 'localize'       // Drill down geo
  | 'contextualize'  // Add related domain
  | 'validate'       // Check methodology
  | 'uncertain';     // Explore data gaps

export interface NextQuestion {
  question_id: string;
  type: QuestionType;
  text: string;
  rationale: string;
  priority: number; // 0-1
  data_available: boolean;
  leads_to: string[]; // Truth Node IDs that would answer this
  blocked_reason?: string;
}

interface QuestionContext {
  current_node: TruthNode;
  viewed_nodes: string[];
  depth: number;
  uncertainty_threshold: number;
}

// FORBIDDEN question patterns
const FORBIDDEN_PATTERNS = [
  /what should/i,
  /what must/i,
  /what to do/i,
  /how to fix/i,
  /how to solve/i,
  /recommend/i,
  /best way/i,
  /optimal/i,
  /should we/i,
  /is it good/i,
  /is it bad/i,
];

/**
 * Check if question is forbidden (advisory)
 */
function isForbidden(text: string): boolean {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Generate decomposition questions
 */
function generateDecomposeQuestions(node: TruthNode): NextQuestion[] {
  const questions: NextQuestion[] = [];
  
  // Geographic decomposition
  if (node.scope.geo_level === 'country') {
    questions.push({
      question_id: `decompose_geo_${node.id}`,
      type: 'decompose',
      text: `What is the regional distribution within ${node.scope.geo_code}?`,
      rationale: 'National aggregates may hide significant regional variation',
      priority: 0.8,
      data_available: true, // Would check registry
      leads_to: [], // Would populate from registry
    });
  }
  
  // Temporal decomposition
  if (node.values.length > 12) {
    questions.push({
      question_id: `decompose_time_${node.id}`,
      type: 'decompose',
      text: 'How does the seasonal pattern compare to the long-term trend?',
      rationale: 'Separating cyclical from structural changes improves interpretation',
      priority: 0.7,
      data_available: true,
      leads_to: [],
    });
  }
  
  // Component decomposition (if composite)
  questions.push({
    question_id: `decompose_component_${node.id}`,
    type: 'decompose',
    text: 'What are the constituent components of this measure?',
    rationale: 'Aggregate measures require component visibility for valid interpretation',
    priority: 0.9,
    data_available: true,
    leads_to: [],
  });
  
  return questions;
}

/**
 * Generate comparison questions
 */
function generateCompareQuestions(node: TruthNode): NextQuestion[] {
  const questions: NextQuestion[] = [];
  
  // Peer comparison
  questions.push({
    question_id: `compare_peer_${node.id}`,
    type: 'compare',
    text: `How does ${node.scope.geo_code} compare to peer entities?`,
    rationale: 'Relative position provides context for absolute values',
    priority: 0.7,
    data_available: true,
    leads_to: [],
  });
  
  // Historical comparison
  questions.push({
    question_id: `compare_historical_${node.id}`,
    type: 'compare',
    text: 'How does the current period compare to equivalent historical periods?',
    rationale: 'Historical baselines reveal whether current state is unusual',
    priority: 0.6,
    data_available: node.values.length > 24,
    leads_to: [],
  });
  
  return questions;
}

/**
 * Generate correlation questions
 */
function generateCorrelateQuestions(node: TruthNode): NextQuestion[] {
  const questions: NextQuestion[] = [];
  
  // Cross-domain
  questions.push({
    question_id: `correlate_cross_${node.id}`,
    type: 'correlate',
    text: 'What indicators from other domains show co-movement?',
    rationale: 'Cross-domain patterns may reveal systemic relationships',
    priority: 0.6,
    data_available: true,
    leads_to: [],
  });
  
  // Leading indicators
  questions.push({
    question_id: `correlate_lead_${node.id}`,
    type: 'correlate',
    text: 'Which indicators historically moved before this one?',
    rationale: 'Time-lagged relationships aid interpretation of current state',
    priority: 0.5,
    data_available: true,
    leads_to: [],
  });
  
  return questions;
}

/**
 * Generate uncertainty questions
 */
function generateUncertaintyQuestions(node: TruthNode): NextQuestion[] {
  const questions: NextQuestion[] = [];
  
  // Data gaps
  questions.push({
    question_id: `uncertain_gap_${node.id}`,
    type: 'uncertain',
    text: 'What data gaps exist in this measurement?',
    rationale: 'Understanding limitations prevents overconfident interpretation',
    priority: 0.8,
    data_available: true,
    leads_to: [],
  });
  
  // Methodology
  questions.push({
    question_id: `uncertain_method_${node.id}`,
    type: 'validate',
    text: 'How was this data collected and processed?',
    rationale: 'Methodology transparency is prerequisite for valid use',
    priority: 0.9,
    data_available: true,
    leads_to: [],
  });
  
  // Definition changes
  questions.push({
    question_id: `uncertain_definition_${node.id}`,
    type: 'validate',
    text: 'Has the definition of this measure changed over time?',
    rationale: 'Definition drift can invalidate time series comparisons',
    priority: 0.7,
    data_available: true,
    leads_to: [],
  });
  
  return questions;
}

/**
 * Generate localization questions
 */
function generateLocalizeQuestions(node: TruthNode): NextQuestion[] {
  const questions: NextQuestion[] = [];
  
  if (node.scope.geo_level !== 'municipal') {
    questions.push({
      question_id: `localize_${node.id}`,
      type: 'localize',
      text: 'What does this look like at lower geographic levels?',
      rationale: 'Sub-national variation often exceeds cross-national differences',
      priority: 0.6,
      data_available: true,
      leads_to: [],
    });
  }
  
  return questions;
}

/**
 * MAIN ENGINE: Generate next valid questions
 */
export function generateNextQuestions(
  context: QuestionContext
): NextQuestion[] {
  const { current_node, viewed_nodes, depth } = context;
  
  // Collect all candidate questions
  const candidates: NextQuestion[] = [
    ...generateDecomposeQuestions(current_node),
    ...generateCompareQuestions(current_node),
    ...generateCorrelateQuestions(current_node),
    ...generateUncertaintyQuestions(current_node),
    ...generateLocalizeQuestions(current_node),
  ];
  
  // Filter and validate
  const valid = candidates
    .filter(q => !isForbidden(q.text))
    .filter(q => !viewed_nodes.includes(q.question_id))
    .map(q => ({
      ...q,
      // Adjust priority by depth (deeper = lower priority)
      priority: q.priority * Math.pow(0.9, depth),
    }))
    .sort((a, b) => b.priority - a.priority);
  
  // Return top questions
  return valid.slice(0, 5);
}

/**
 * Get the single most important next question
 */
export function getNextQuestion(context: QuestionContext): NextQuestion | null {
  const questions = generateNextQuestions(context);
  return questions.length > 0 ? questions[0] : null;
}

/**
 * Validate that a question is not advisory
 */
export function validateQuestion(text: string): { valid: boolean; reason?: string } {
  if (isForbidden(text)) {
    return { 
      valid: false, 
      reason: 'Question implies advisory intent. System provides observation, not recommendation.' 
    };
  }
  return { valid: true };
}

// Question type descriptions
export const QUESTION_TYPE_INFO: Record<QuestionType, { label: string; description: string }> = {
  decompose: { 
    label: 'Decompose', 
    description: 'Break down aggregate into components' 
  },
  compare: { 
    label: 'Compare', 
    description: 'Cross-entity or cross-time comparison' 
  },
  correlate: { 
    label: 'Correlate', 
    description: 'Find co-movement patterns' 
  },
  historicize: { 
    label: 'Historicize', 
    description: 'Extend timeline perspective' 
  },
  localize: { 
    label: 'Localize', 
    description: 'Drill down to smaller geography' 
  },
  contextualize: { 
    label: 'Contextualize', 
    description: 'Add related domain information' 
  },
  validate: { 
    label: 'Validate', 
    description: 'Examine methodology and definitions' 
  },
  uncertain: { 
    label: 'Uncertainty', 
    description: 'Explore data limitations' 
  },
};
