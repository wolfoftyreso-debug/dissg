/**
 * INFINITE DEPTH NAVIGATOR
 * 
 * Every answer is a node in a semantic graph universe.
 * Every node has:
 * - context_above: why this exists
 * - related_nodes: what connects
 * - deeper_nodes: how to go deeper
 * - parallel_views: other ways to see the same thing
 * 
 * Knowledge without bottom, but with full order.
 */

/**
 * NAVIGATION DIRECTION
 */
export type NavigationDirection = 
  | 'deeper'      // More granular detail
  | 'broader'     // Higher abstraction
  | 'lateral'     // Same level, different angle
  | 'temporal'    // Same thing, different time
  | 'geographic'  // Same thing, different place
  | 'demographic' // Same thing, different population
  | 'methodological'; // Same thing, different measurement

/**
 * SEMANTIC NODE
 */
export interface SemanticNode {
  readonly node_id: string;
  readonly node_type: 'answer' | 'question' | 'indicator' | 'comparison';
  readonly content_summary: string;
  readonly depth_level: number; // 0 = highest abstraction
  
  // Navigation
  readonly context_above: readonly ContextLink[];
  readonly related_nodes: readonly RelatedLink[];
  readonly deeper_nodes: readonly DeeperLink[];
  readonly parallel_views: readonly ParallelView[];
  
  // Data state
  readonly data_available: boolean;
  readonly data_gaps: readonly string[];
  readonly last_updated: string;
}

/**
 * CONTEXT LINK (WHY THIS EXISTS)
 */
export interface ContextLink {
  readonly parent_node_id: string;
  readonly relationship: string;
  readonly explanation: string;
}

/**
 * RELATED LINK (WHAT CONNECTS)
 */
export interface RelatedLink {
  readonly target_node_id: string;
  readonly relationship_type: 'correlates' | 'part_of' | 'influences' | 'measured_by' | 'defined_by';
  readonly strength: 'strong' | 'moderate' | 'weak';
  readonly description: string;
}

/**
 * DEEPER LINK (HOW TO GO DEEPER)
 */
export interface DeeperLink {
  readonly direction: NavigationDirection;
  readonly target_question: string;
  readonly target_node_id?: string; // May not exist yet
  readonly data_available: boolean;
  readonly example_dimensions?: readonly string[];
}

/**
 * PARALLEL VIEW (OTHER PERSPECTIVES)
 */
export interface ParallelView {
  readonly view_type: 'alternative_metric' | 'different_source' | 'adjusted_method' | 'raw_vs_normalized';
  readonly description: string;
  readonly target_node_id: string;
  readonly difference_explanation: string;
}

/**
 * DEPTH NAVIGATION RULES
 */
export const DEPTH_NAVIGATION_RULES = {
  always_available: [
    'temporal: over time',
    'geographic: by region',
    'demographic: by population segment',
  ],
  conditional: [
    'methodological: if multiple measurement methods exist',
    'source-based: if multiple sources available',
  ],
  never_generate: [
    'Causal claims beyond stated correlations',
    'Predictions without scenario flag',
    'Recommendations or advice',
    'Individual-level inference from population data',
  ],
} as const;

/**
 * EXAMPLE: YOUTH ANXIETY NODE
 */
export const YOUTH_ANXIETY_EXAMPLE: SemanticNode = {
  node_id: 'youth_anxiety_prevalence_se_2024',
  node_type: 'answer',
  content_summary: 'Self-reported anxiety prevalence among youth (15-24) in Sweden, 2024',
  depth_level: 2,
  
  context_above: [
    {
      parent_node_id: 'youth_mental_health_overview',
      relationship: 'component_of',
      explanation: 'Anxiety is one of several mental health indicators tracked for youth populations',
    },
    {
      parent_node_id: 'public_health_indicators_se',
      relationship: 'measured_by',
      explanation: 'Part of national public health monitoring',
    },
  ],
  
  related_nodes: [
    {
      target_node_id: 'youth_depression_prevalence_se_2024',
      relationship_type: 'correlates',
      strength: 'strong',
      description: 'Often co-occur in same populations',
    },
    {
      target_node_id: 'youth_sleep_quality_se_2024',
      relationship_type: 'correlates',
      strength: 'moderate',
      description: 'Sleep disturbances frequently associated',
    },
  ],
  
  deeper_nodes: [
    {
      direction: 'temporal',
      target_question: 'How has youth anxiety prevalence changed over time?',
      target_node_id: 'youth_anxiety_trend_se_2010_2024',
      data_available: true,
      example_dimensions: ['yearly', 'by cohort'],
    },
    {
      direction: 'geographic',
      target_question: 'How does this vary by region?',
      target_node_id: 'youth_anxiety_by_region_se_2024',
      data_available: true,
      example_dimensions: ['by county', 'urban vs rural'],
    },
    {
      direction: 'demographic',
      target_question: 'How does this differ by demographic group?',
      data_available: true,
      example_dimensions: ['by gender', 'by age band', 'by socioeconomic background'],
    },
    {
      direction: 'methodological',
      target_question: 'What is the difference between self-reported and clinical prevalence?',
      data_available: true,
      example_dimensions: ['survey-based', 'clinical diagnosis', 'treatment-seeking'],
    },
  ],
  
  parallel_views: [
    {
      view_type: 'alternative_metric',
      description: 'Anxiety as GAD-7 score distribution',
      target_node_id: 'youth_gad7_distribution_se_2024',
      difference_explanation: 'Shows severity distribution rather than binary prevalence',
    },
    {
      view_type: 'different_source',
      description: 'School health survey vs national health survey',
      target_node_id: 'youth_anxiety_school_survey_se_2024',
      difference_explanation: 'Different sampling and methodology',
    },
  ],
  
  data_available: true,
  data_gaps: [
    'Clinical diagnosis data has 6-month lag',
    'Rural areas underrepresented in some surveys',
  ],
  last_updated: '2024-12-01',
};

/**
 * GENERATE NEXT QUESTIONS
 */
export function generateNextQuestions(node: SemanticNode): string[] {
  const questions: string[] = [];
  
  for (const deeper of node.deeper_nodes) {
    if (deeper.data_available) {
      questions.push(deeper.target_question);
    }
  }
  
  return questions;
}

/**
 * GET NAVIGATION OPTIONS
 */
export function getNavigationOptions(node: SemanticNode): {
  can_go_deeper: boolean;
  can_go_broader: boolean;
  has_parallel_views: boolean;
  available_directions: NavigationDirection[];
} {
  const directions = new Set<NavigationDirection>();
  
  for (const link of node.deeper_nodes) {
    directions.add(link.direction);
  }
  
  return {
    can_go_deeper: node.deeper_nodes.length > 0,
    can_go_broader: node.context_above.length > 0,
    has_parallel_views: node.parallel_views.length > 0,
    available_directions: Array.from(directions),
  };
}
