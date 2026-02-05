/**
 * VIEW SELECTOR — Selects semantic view based on intent
 */

import { ResolvedIntent, QuestionType, DepthLevel } from './intent-resolver';

/**
 * SEMANTIC VIEW
 */
export interface SemanticView {
  readonly type: ViewType;
  readonly depth: DepthLevel;
  readonly focus: ViewFocus;
  readonly required_data: readonly DataRequirement[];
}

export type ViewType =
  | 'orientation'     // Quick overview
  | 'deep_dive'       // Detailed exploration
  | 'comparison'      // Side-by-side
  | 'historical'      // Time-based
  | 'relational'      // Connection graph
  | 'uncertainty';    // What we don't know

export type ViewFocus =
  | 'current_state'
  | 'change_analysis'
  | 'importance_mapping'
  | 'connection_graph'
  | 'uncertainty_exposure';

export interface DataRequirement {
  readonly type: 'indicator' | 'time_series' | 'comparison' | 'correlation' | 'metadata';
  readonly node_types: readonly string[];
  readonly time_range?: { start: string; end: string };
  readonly geographic_scope?: string;
}

/**
 * VIEW MAPPING — Question type to view type
 */
const VIEW_MAPPING: Record<QuestionType, ViewType> = {
  state: 'orientation',
  change: 'deep_dive',
  importance: 'orientation',
  comparison: 'comparison',
  connection: 'relational',
  depth: 'deep_dive',
  verification: 'deep_dive',
  uncertainty: 'uncertainty',
  historical: 'historical',
};

/**
 * FOCUS MAPPING — Question type to focus
 */
const FOCUS_MAPPING: Record<QuestionType, ViewFocus> = {
  state: 'current_state',
  change: 'change_analysis',
  importance: 'importance_mapping',
  comparison: 'current_state',
  connection: 'connection_graph',
  depth: 'current_state',
  verification: 'current_state',
  uncertainty: 'uncertainty_exposure',
  historical: 'change_analysis',
};

/**
 * SELECT SEMANTIC VIEW
 */
export function selectSemanticView(intent: ResolvedIntent): SemanticView {
  const viewType = VIEW_MAPPING[intent.question_type];
  const focus = FOCUS_MAPPING[intent.question_type];
  
  return {
    type: viewType,
    depth: intent.depth,
    focus,
    required_data: determineDataRequirements(intent, viewType),
  };
}

/**
 * DETERMINE DATA REQUIREMENTS
 */
function determineDataRequirements(
  intent: ResolvedIntent,
  viewType: ViewType
): DataRequirement[] {
  const requirements: DataRequirement[] = [];
  
  // Base requirement: current state
  requirements.push({
    type: 'indicator',
    node_types: [intent.domain],
    geographic_scope: intent.scope.geographic.code,
  });
  
  // Add time series for change/historical views
  if (viewType === 'historical' || viewType === 'deep_dive') {
    requirements.push({
      type: 'time_series',
      node_types: [intent.domain],
      time_range: {
        start: '2015-01-01',
        end: new Date().toISOString().split('T')[0],
      },
    });
  }
  
  // Add correlation data for relational views
  if (viewType === 'relational') {
    requirements.push({
      type: 'correlation',
      node_types: ['*'],
    });
  }
  
  // Add comparison data
  if (viewType === 'comparison') {
    requirements.push({
      type: 'comparison',
      node_types: [intent.domain],
    });
  }
  
  return requirements;
}

/**
 * GET VIEW CONFIGURATION
 */
export function getViewConfiguration(view: SemanticView): ViewConfiguration {
  return {
    show_baseline: true,
    show_deviation: true,
    show_uncertainty: true,
    show_navigation: true,
    depth_disclosure: getDepthDisclosure(view.depth),
    required_sections: getRequiredSections(view.type),
  };
}

export interface ViewConfiguration {
  readonly show_baseline: boolean;
  readonly show_deviation: boolean;
  readonly show_uncertainty: boolean;
  readonly show_navigation: boolean;
  readonly depth_disclosure: DepthDisclosure;
  readonly required_sections: readonly string[];
}

export interface DepthDisclosure {
  readonly level: DepthLevel;
  readonly sections: readonly string[];
}

function getDepthDisclosure(depth: DepthLevel): DepthDisclosure {
  const sections: Record<DepthLevel, readonly string[]> = {
    1: ['orientation'],
    2: ['orientation', 'relationships'],
    3: ['orientation', 'relationships', 'mechanisms'],
    4: ['orientation', 'relationships', 'mechanisms', 'history'],
    5: ['orientation', 'relationships', 'mechanisms', 'history', 'uncertainties'],
  };
  
  return {
    level: depth,
    sections: sections[depth],
  };
}

function getRequiredSections(viewType: ViewType): readonly string[] {
  const sections: Record<ViewType, readonly string[]> = {
    orientation: ['importance', 'baseline', 'navigation'],
    deep_dive: ['importance', 'baseline', 'mechanisms', 'uncertainty', 'navigation'],
    comparison: ['importance', 'comparison_table', 'methodology', 'navigation'],
    historical: ['importance', 'timeline', 'methodology_changes', 'navigation'],
    relational: ['importance', 'connections', 'correlation_caveats', 'navigation'],
    uncertainty: ['known', 'unknown', 'data_gaps', 'methodology_limits', 'navigation'],
  };
  
  return sections[viewType];
}
