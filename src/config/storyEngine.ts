/**
 * VISUAL STORY ENGINE
 * Block AD: Data tells the story itself
 * 
 * This is UI magic, not text.
 */

// ============================================================================
// STORY TYPES
// ============================================================================

export type StoryType = 
  | 'situation_summary'    // Current state overview
  | 'trend_narrative'      // What's been happening
  | 'comparison_story'     // How X compares to Y
  | 'change_alert'         // Something significant changed
  | 'milestone_reached'    // Important threshold crossed
  | 'pattern_discovered'   // Interesting pattern found
  | 'correlation_insight'  // Relationship between indicators
  | 'forecast_preview'     // What might happen next
  | 'retrospective'        // Looking back at a period
  | 'deep_dive';           // Detailed exploration

export interface VisualStory {
  id: string;
  type: StoryType;
  
  // Content
  title: string;
  subtitle?: string;
  summary: string;
  
  // Visual elements
  hero_visualization: VisualizationType;
  supporting_visualizations: VisualizationType[];
  
  // Key points
  key_insights: StoryInsight[];
  
  // Data
  kpi_codes: string[];
  geo_codes: string[];
  time_range: { start: string; end: string };
  
  // Navigation
  drill_down_options: DrillDownOption[];
  related_stories: string[];
  
  // Meta
  generated_at: string;
  confidence: number;
  data_freshness: string;
  sources: string[];
}

export interface StoryInsight {
  icon: string;
  headline: string;
  detail: string;
  direction?: 'positive' | 'negative' | 'neutral';
  magnitude?: 'minor' | 'moderate' | 'major' | 'extreme';
  confidence: number;
}

export interface DrillDownOption {
  label: string;
  description: string;
  target_type: 'kpi' | 'region' | 'time' | 'demographic';
  target_id: string;
}

// ============================================================================
// VISUALIZATION TYPES
// ============================================================================

export type VisualizationType = 
  | TimeSeriesViz
  | ComparisonViz
  | MapViz
  | RankingViz
  | IndexCardViz
  | SparklineViz
  | HeatmapViz
  | SankeyViz;

export interface TimeSeriesViz {
  type: 'time_series';
  title: string;
  series: {
    kpi_code: string;
    geo_code: string;
    color: string;
    label: string;
  }[];
  annotations?: {
    date: string;
    label: string;
    type: 'event' | 'threshold' | 'milestone';
  }[];
  smooth: boolean;
  show_confidence: boolean;
}

export interface ComparisonViz {
  type: 'comparison';
  title: string;
  items: {
    geo_code: string;
    value: number;
    rank?: number;
    change?: number;
    highlight?: boolean;
  }[];
  kpi_code: string;
  sort_by: 'value' | 'change' | 'name';
}

export interface MapViz {
  type: 'map';
  title: string;
  kpi_code: string;
  geo_level: 'country' | 'nuts1' | 'nuts2' | 'nuts3';
  color_scale: 'sequential' | 'diverging' | 'categorical';
  show_labels: boolean;
  highlight_codes?: string[];
}

export interface RankingViz {
  type: 'ranking';
  title: string;
  kpi_code: string;
  items: {
    geo_code: string;
    geo_name: string;
    value: number;
    rank: number;
    previous_rank?: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  show_top_n: number;
}

export interface IndexCardViz {
  type: 'index_card';
  title: string;
  index_id: string;
  geo_code: string;
  current_value: number;
  previous_value: number;
  trend: 'up' | 'down' | 'stable';
  pillar_breakdown: {
    pillar_id: string;
    name: string;
    score: number;
    contribution: number;
  }[];
}

export interface SparklineViz {
  type: 'sparkline';
  kpi_code: string;
  geo_code: string;
  values: number[];
  labels: string[];
  highlight_last: boolean;
  show_trend: boolean;
}

export interface HeatmapViz {
  type: 'heatmap';
  title: string;
  x_axis: string[]; // e.g., months
  y_axis: string[]; // e.g., countries
  values: number[][];
  color_scale: string;
  annotations?: { x: number; y: number; label: string }[];
}

export interface SankeyViz {
  type: 'sankey';
  title: string;
  nodes: { id: string; name: string }[];
  links: { source: string; target: string; value: number }[];
}

// ============================================================================
// STORY TEMPLATES
// ============================================================================

export interface StoryTemplate {
  id: string;
  type: StoryType;
  name: string;
  description: string;
  required_inputs: StoryInput[];
  output_structure: Partial<VisualStory>;
}

export interface StoryInput {
  name: string;
  type: 'kpi' | 'geo' | 'time_range' | 'threshold' | 'comparison_geo';
  required: boolean;
  multiple: boolean;
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'situation_overview',
    type: 'situation_summary',
    name: 'Situation Overview',
    description: 'Current state summary for a country or region',
    required_inputs: [
      { name: 'geo', type: 'geo', required: true, multiple: false },
      { name: 'kpis', type: 'kpi', required: false, multiple: true },
    ],
    output_structure: {
      hero_visualization: {
        type: 'index_card',
        title: '',
        index_id: 'gmi',
        geo_code: '',
        current_value: 0,
        previous_value: 0,
        trend: 'stable',
        pillar_breakdown: [],
      },
    },
  },
  {
    id: 'trend_analysis',
    type: 'trend_narrative',
    name: 'Trend Analysis',
    description: 'What has been happening over time',
    required_inputs: [
      { name: 'kpi', type: 'kpi', required: true, multiple: false },
      { name: 'geo', type: 'geo', required: true, multiple: false },
      { name: 'time_range', type: 'time_range', required: true, multiple: false },
    ],
    output_structure: {
      hero_visualization: {
        type: 'time_series',
        title: '',
        series: [],
        smooth: true,
        show_confidence: true,
      },
    },
  },
  {
    id: 'country_comparison',
    type: 'comparison_story',
    name: 'Country Comparison',
    description: 'Compare multiple countries on selected indicators',
    required_inputs: [
      { name: 'geo', type: 'geo', required: true, multiple: true },
      { name: 'kpi', type: 'kpi', required: true, multiple: false },
    ],
    output_structure: {
      hero_visualization: {
        type: 'comparison',
        title: '',
        items: [],
        kpi_code: '',
        sort_by: 'value',
      },
    },
  },
  {
    id: 'change_alert_story',
    type: 'change_alert',
    name: 'Change Alert',
    description: 'Something significant just changed',
    required_inputs: [
      { name: 'kpi', type: 'kpi', required: true, multiple: false },
      { name: 'geo', type: 'geo', required: true, multiple: false },
    ],
    output_structure: {},
  },
  {
    id: 'global_ranking',
    type: 'comparison_story',
    name: 'Global Ranking',
    description: 'Where countries stand on a KPI',
    required_inputs: [
      { name: 'kpi', type: 'kpi', required: true, multiple: false },
    ],
    output_structure: {
      hero_visualization: {
        type: 'ranking',
        title: '',
        kpi_code: '',
        items: [],
        show_top_n: 20,
      },
    },
  },
  {
    id: 'regional_map',
    type: 'situation_summary',
    name: 'Regional Map',
    description: 'Geographic distribution of a KPI',
    required_inputs: [
      { name: 'kpi', type: 'kpi', required: true, multiple: false },
      { name: 'geo_level', type: 'geo', required: false, multiple: false },
    ],
    output_structure: {
      hero_visualization: {
        type: 'map',
        title: '',
        kpi_code: '',
        geo_level: 'country',
        color_scale: 'sequential',
        show_labels: true,
      },
    },
  },
];

// ============================================================================
// STORY GENERATION
// ============================================================================

export interface StoryGenerationRequest {
  template_id?: string;
  type?: StoryType;
  inputs: Record<string, unknown>;
  preferences?: {
    complexity: 'simple' | 'detailed';
    style: 'data_focused' | 'narrative' | 'visual_heavy';
    language: string;
  };
}

export interface StoryGenerationResult {
  story: VisualStory;
  generation_time_ms: number;
  template_used: string;
  data_coverage: number;
}

export function generateStory(request: StoryGenerationRequest): StoryGenerationResult {
  const start = Date.now();
  
  // Get template
  const template = request.template_id 
    ? STORY_TEMPLATES.find(t => t.id === request.template_id)
    : STORY_TEMPLATES.find(t => t.type === request.type);
  
  if (!template) {
    throw new Error('No suitable template found');
  }
  
  // Generate story based on template and inputs
  const story: VisualStory = {
    id: `story_${Date.now()}`,
    type: template.type,
    title: generateStoryTitle(template, request.inputs),
    subtitle: generateStorySubtitle(template, request.inputs),
    summary: generateStorySummary(template, request.inputs),
    hero_visualization: generateHeroVisualization(template, request.inputs),
    supporting_visualizations: [],
    key_insights: generateKeyInsights(template, request.inputs),
    kpi_codes: Array.isArray(request.inputs.kpi) ? request.inputs.kpi as string[] : [request.inputs.kpi as string].filter(Boolean),
    geo_codes: Array.isArray(request.inputs.geo) ? request.inputs.geo as string[] : [request.inputs.geo as string].filter(Boolean),
    time_range: request.inputs.time_range as { start: string; end: string } || { start: '2020-01-01', end: '2024-12-01' },
    drill_down_options: [],
    related_stories: [],
    generated_at: new Date().toISOString(),
    confidence: 0.85,
    data_freshness: 'current',
    sources: ['Eurostat', 'World Bank', 'OECD'],
  };
  
  return {
    story,
    generation_time_ms: Date.now() - start,
    template_used: template.id,
    data_coverage: 0.9,
  };
}

function generateStoryTitle(template: StoryTemplate, inputs: Record<string, unknown>): string {
  const geo = inputs.geo as string || 'Global';
  const kpi = inputs.kpi as string || 'Overview';
  
  switch (template.type) {
    case 'situation_summary':
      return `${geo} Current Situation`;
    case 'trend_narrative':
      return `${kpi} Trend in ${geo}`;
    case 'comparison_story':
      return `Comparing ${Array.isArray(inputs.geo) ? (inputs.geo as string[]).length : 2} Regions`;
    case 'change_alert':
      return `Alert: ${kpi} Changed Significantly`;
    default:
      return 'Data Story';
  }
}

function generateStorySubtitle(template: StoryTemplate, inputs: Record<string, unknown>): string {
  return `Generated from latest available data`;
}

function generateStorySummary(template: StoryTemplate, inputs: Record<string, unknown>): string {
  switch (template.type) {
    case 'situation_summary':
      return `An overview of the current situation based on key indicators.`;
    case 'trend_narrative':
      return `Analysis of how the indicator has evolved over time.`;
    case 'comparison_story':
      return `A comparison showing relative performance across regions.`;
    default:
      return `Data-driven insights from multiple sources.`;
  }
}

function generateHeroVisualization(template: StoryTemplate, inputs: Record<string, unknown>): VisualizationType {
  if (template.output_structure.hero_visualization) {
    return { ...template.output_structure.hero_visualization };
  }
  
  // Default to time series
  return {
    type: 'time_series',
    title: 'Trend Over Time',
    series: [],
    smooth: true,
    show_confidence: true,
  };
}

function generateKeyInsights(template: StoryTemplate, inputs: Record<string, unknown>): StoryInsight[] {
  // Generate placeholder insights
  return [
    {
      icon: '📈',
      headline: 'Positive Trend Detected',
      detail: 'The indicator has shown consistent improvement over the past 12 months.',
      direction: 'positive',
      magnitude: 'moderate',
      confidence: 0.85,
    },
    {
      icon: '🔍',
      headline: 'Notable Deviation',
      detail: 'Performance differs significantly from the regional average.',
      direction: 'neutral',
      magnitude: 'moderate',
      confidence: 0.78,
    },
    {
      icon: '⚠️',
      headline: 'Data Gap Identified',
      detail: 'Some periods have incomplete data coverage.',
      direction: 'neutral',
      magnitude: 'minor',
      confidence: 0.92,
    },
  ];
}

// ============================================================================
// AUTO-GENERATED VIEWS
// ============================================================================

export interface AutoView {
  id: string;
  title: string;
  description: string;
  trigger: 'daily' | 'on_change' | 'on_request';
  components: ViewComponent[];
  priority: number;
  geo_scope: string[];
}

export interface ViewComponent {
  type: 'story' | 'visualization' | 'metric' | 'alert';
  config: unknown;
  position: { row: number; col: number; width: number; height: number };
}

export const AUTO_VIEWS: AutoView[] = [
  {
    id: 'daily_global_summary',
    title: 'Global Daily Summary',
    description: 'Top changes and insights across all tracked countries',
    trigger: 'daily',
    components: [],
    priority: 100,
    geo_scope: ['WORLD'],
  },
  {
    id: 'europe_watch',
    title: 'Europe Watch',
    description: 'Key developments across EU member states',
    trigger: 'daily',
    components: [],
    priority: 90,
    geo_scope: ['EU27'],
  },
  {
    id: 'crisis_monitor',
    title: 'Crisis Monitor',
    description: 'Active crisis situations and emerging risks',
    trigger: 'on_change',
    components: [],
    priority: 100,
    geo_scope: ['WORLD'],
  },
];

console.log('[Story Engine] Loaded with', STORY_TEMPLATES.length, 'templates');
