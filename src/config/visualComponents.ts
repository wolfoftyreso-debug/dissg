/**
 * VISUAL COMPONENT SPECIFICATIONS — APPLE + NASA + MYNDIGHET
 * Block T: Design Lead
 * 
 * Component specs for every visualization type.
 * Nothing should look "BI". Everything institutional and precise.
 */

// ============================================================================
// BASE CHART CONFIGURATION
// ============================================================================

export interface ChartConfig {
  id: string;
  name: string;
  category: ChartCategory;
  description: string;
  useCases: string[];
  antiPatterns: string[];
  dataRequirements: DataRequirements;
  visualSpec: VisualSpec;
  interactionSpec: InteractionSpec;
  accessibilitySpec: AccessibilitySpec;
}

export type ChartCategory = 
  | 'time_series'
  | 'comparison'
  | 'distribution'
  | 'relationship'
  | 'geographic'
  | 'flow'
  | 'ranking'
  | 'composition';

export interface DataRequirements {
  minDataPoints: number;
  maxDataPoints: number;
  dimensions: DimensionRequirement[];
  measures: MeasureRequirement[];
}

export interface DimensionRequirement {
  name: string;
  type: 'temporal' | 'categorical' | 'geographic' | 'numeric';
  required: boolean;
}

export interface MeasureRequirement {
  name: string;
  type: 'numeric';
  aggregatable: boolean;
  required: boolean;
}

export interface VisualSpec {
  minWidth: number;
  minHeight: number;
  aspectRatio?: string;
  colors: ColorSpec;
  typography: TypographySpec;
  spacing: SpacingSpec;
  animation: AnimationSpec;
}

export interface ColorSpec {
  primary: string;
  series: string[];
  positive: string;
  negative: string;
  neutral: string;
  grid: string;
  axis: string;
  label: string;
  background: string;
}

export interface TypographySpec {
  titleSize: string;
  labelSize: string;
  valueSize: string;
  tickSize: string;
  fontFamily: string;
  fontWeight: string;
}

export interface SpacingSpec {
  margin: { top: number; right: number; bottom: number; left: number };
  padding: number;
  gridGap: number;
}

export interface AnimationSpec {
  enabled: boolean;
  duration: number;
  easing: string;
  stagger: number;
}

export interface InteractionSpec {
  hoverable: boolean;
  clickable: boolean;
  selectable: boolean;
  zoomable: boolean;
  pannable: boolean;
  brushable: boolean;
  tooltipBehavior: 'hover' | 'click' | 'both';
}

export interface AccessibilitySpec {
  ariaLabel: string;
  keyboardNavigable: boolean;
  screenReaderDescription: string;
  highContrastMode: boolean;
  reducedMotion: boolean;
}

// ============================================================================
// CHART COMPONENT SPECIFICATIONS
// ============================================================================

export const CHART_COMPONENTS: ChartConfig[] = [
  // =========== TIME SERIES ===========
  {
    id: 'smooth_time_curve',
    name: 'Smooth Time Curve',
    category: 'time_series',
    description: 'Primary chart for showing trends over time. Smooth bezier curves with optional confidence bands.',
    useCases: [
      'KPI trends over years',
      'Index evolution',
      'Comparing multiple countries over time',
      'Showing historical context',
    ],
    antiPatterns: [
      'Never use for categorical data',
      'Avoid with less than 5 data points',
      'Do not use dual y-axes',
      'Never use 3D perspective',
    ],
    dataRequirements: {
      minDataPoints: 5,
      maxDataPoints: 500,
      dimensions: [
        { name: 'time', type: 'temporal', required: true },
        { name: 'series', type: 'categorical', required: false },
      ],
      measures: [
        { name: 'value', type: 'numeric', aggregatable: true, required: true },
        { name: 'confidence_lower', type: 'numeric', aggregatable: false, required: false },
        { name: 'confidence_upper', type: 'numeric', aggregatable: false, required: false },
      ],
    },
    visualSpec: {
      minWidth: 400,
      minHeight: 250,
      aspectRatio: '16:9',
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: ['hsl(220, 70%, 50%)', 'hsl(152, 60%, 42%)', 'hsl(280, 65%, 55%)'],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 10%, 60%)',
        grid: 'hsl(220, 10%, 90%)',
        axis: 'hsl(220, 15%, 35%)',
        label: 'hsl(220, 15%, 35%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1.125rem',
        labelSize: '0.75rem',
        valueSize: '0.875rem',
        tickSize: '0.75rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '400',
      },
      spacing: {
        margin: { top: 20, right: 30, bottom: 40, left: 60 },
        padding: 0,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 50,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: true,
      pannable: true,
      brushable: true,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Time series chart showing trend over time',
      keyboardNavigable: true,
      screenReaderDescription: 'Navigate with arrow keys to explore data points',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== COMPARISON ===========
  {
    id: 'horizontal_bar',
    name: 'Horizontal Bar Chart',
    category: 'comparison',
    description: 'Compare values across categories. Bars sorted by value, labels always readable.',
    useCases: [
      'Country rankings',
      'Category comparisons',
      'Budget breakdowns',
      'Performance metrics',
    ],
    antiPatterns: [
      'Never truncate y-axis',
      'Avoid more than 20 bars',
      'Do not use gradient fills',
      'Never use 3D effects',
    ],
    dataRequirements: {
      minDataPoints: 2,
      maxDataPoints: 30,
      dimensions: [
        { name: 'category', type: 'categorical', required: true },
      ],
      measures: [
        { name: 'value', type: 'numeric', aggregatable: true, required: true },
      ],
    },
    visualSpec: {
      minWidth: 350,
      minHeight: 200,
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: ['hsl(220, 70%, 50%)'],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 15%, 75%)',
        grid: 'hsl(220, 10%, 92%)',
        axis: 'hsl(220, 15%, 35%)',
        label: 'hsl(220, 20%, 22%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.875rem',
        valueSize: '0.75rem',
        tickSize: '0.75rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '500',
      },
      spacing: {
        margin: { top: 10, right: 60, bottom: 20, left: 120 },
        padding: 4,
        gridGap: 8,
      },
      animation: {
        enabled: true,
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 30,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: false,
      pannable: false,
      brushable: false,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Horizontal bar chart comparing categories',
      keyboardNavigable: true,
      screenReaderDescription: 'Use up/down arrows to navigate bars',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== GEOGRAPHIC ===========
  {
    id: 'choropleth_map',
    name: 'Choropleth Map',
    category: 'geographic',
    description: 'Geographic distribution of a single metric. Color intensity represents value.',
    useCases: [
      'Country-level KPI comparison',
      'Regional variations',
      'Population density',
      'Economic indicators',
    ],
    antiPatterns: [
      'Never use rainbow color scales',
      'Avoid diverging scales for non-diverging data',
      'Do not add 3D terrain',
      'Never animate color transitions rapidly',
    ],
    dataRequirements: {
      minDataPoints: 3,
      maxDataPoints: 300,
      dimensions: [
        { name: 'geo_code', type: 'geographic', required: true },
      ],
      measures: [
        { name: 'value', type: 'numeric', aggregatable: true, required: true },
      ],
    },
    visualSpec: {
      minWidth: 500,
      minHeight: 350,
      aspectRatio: '4:3',
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: [
          'hsl(220, 15%, 95%)',
          'hsl(220, 40%, 75%)',
          'hsl(220, 60%, 55%)',
          'hsl(220, 70%, 40%)',
          'hsl(220, 80%, 25%)',
        ],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 5%, 88%)',
        grid: 'hsl(220, 10%, 85%)',
        axis: 'transparent',
        label: 'hsl(220, 20%, 22%)',
        background: 'hsl(210, 20%, 98%)',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.75rem',
        valueSize: '0.875rem',
        tickSize: '0.625rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '400',
      },
      spacing: {
        margin: { top: 10, right: 10, bottom: 30, left: 10 },
        padding: 0,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 0,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: true,
      pannable: true,
      brushable: false,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Geographic map showing regional data',
      keyboardNavigable: true,
      screenReaderDescription: 'Navigate regions with arrow keys, press Enter for details',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== RELATIONSHIP ===========
  {
    id: 'scatter_matrix',
    name: 'Scatter Matrix',
    category: 'relationship',
    description: 'Explore relationships between multiple variables. Dots represent observations.',
    useCases: [
      'Correlation exploration',
      'Multi-variable analysis',
      'Outlier detection',
      'Cluster identification',
    ],
    antiPatterns: [
      'Never imply causation from correlation',
      'Avoid with less than 20 data points',
      'Do not use with more than 5 variables',
      'Never hide the disclaimer about correlation',
    ],
    dataRequirements: {
      minDataPoints: 20,
      maxDataPoints: 1000,
      dimensions: [
        { name: 'observation_id', type: 'categorical', required: true },
        { name: 'category', type: 'categorical', required: false },
      ],
      measures: [
        { name: 'x_value', type: 'numeric', aggregatable: false, required: true },
        { name: 'y_value', type: 'numeric', aggregatable: false, required: true },
      ],
    },
    visualSpec: {
      minWidth: 450,
      minHeight: 400,
      aspectRatio: '1:1',
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: ['hsl(220, 70%, 50%)', 'hsl(152, 60%, 42%)', 'hsl(38, 85%, 50%)'],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 10%, 70%)',
        grid: 'hsl(220, 10%, 92%)',
        axis: 'hsl(220, 15%, 35%)',
        label: 'hsl(220, 20%, 22%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.75rem',
        valueSize: '0.75rem',
        tickSize: '0.625rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '400',
      },
      spacing: {
        margin: { top: 20, right: 20, bottom: 50, left: 60 },
        padding: 0,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 5,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: true,
      pannable: true,
      brushable: true,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Scatter plot showing relationship between variables',
      keyboardNavigable: true,
      screenReaderDescription: 'Points represent observations. Use Tab to navigate.',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== FLOW ===========
  {
    id: 'sankey_flow',
    name: 'Sankey Flow Diagram',
    category: 'flow',
    description: 'Show flows between categories. Width represents magnitude.',
    useCases: [
      'Budget allocation',
      'Migration flows',
      'Resource distribution',
      'Process flows',
    ],
    antiPatterns: [
      'Avoid more than 8 source nodes',
      'Never use more than 3 levels',
      'Do not use gradient fills',
      'Avoid crossing flows when possible',
    ],
    dataRequirements: {
      minDataPoints: 3,
      maxDataPoints: 50,
      dimensions: [
        { name: 'source', type: 'categorical', required: true },
        { name: 'target', type: 'categorical', required: true },
      ],
      measures: [
        { name: 'flow_value', type: 'numeric', aggregatable: true, required: true },
      ],
    },
    visualSpec: {
      minWidth: 600,
      minHeight: 400,
      aspectRatio: '16:10',
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: [
          'hsl(220, 70%, 55%)',
          'hsl(152, 60%, 45%)',
          'hsl(280, 60%, 55%)',
          'hsl(38, 80%, 50%)',
          'hsl(340, 65%, 55%)',
          'hsl(180, 50%, 45%)',
        ],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 10%, 70%)',
        grid: 'transparent',
        axis: 'transparent',
        label: 'hsl(220, 20%, 22%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.75rem',
        valueSize: '0.875rem',
        tickSize: '0.625rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '500',
      },
      spacing: {
        margin: { top: 20, right: 100, bottom: 20, left: 100 },
        padding: 20,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: false,
      pannable: false,
      brushable: false,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Sankey diagram showing flows between categories',
      keyboardNavigable: true,
      screenReaderDescription: 'Flows from sources to targets. Navigate with Tab.',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== RANKING ===========
  {
    id: 'trend_ladder',
    name: 'Trend Ladder',
    category: 'ranking',
    description: 'Show ranking changes over time. Lines connect position across periods.',
    useCases: [
      'Country ranking evolution',
      'Performance tracking',
      'Competitive analysis',
      'Index position changes',
    ],
    antiPatterns: [
      'Avoid more than 15 entities',
      'Never use with less than 3 time periods',
      'Do not use crossing line colors',
      'Avoid rapid animation of changes',
    ],
    dataRequirements: {
      minDataPoints: 3,
      maxDataPoints: 100,
      dimensions: [
        { name: 'entity', type: 'categorical', required: true },
        { name: 'period', type: 'temporal', required: true },
      ],
      measures: [
        { name: 'rank', type: 'numeric', aggregatable: false, required: true },
      ],
    },
    visualSpec: {
      minWidth: 500,
      minHeight: 400,
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: ['hsl(220, 70%, 50%)', 'hsl(152, 60%, 42%)', 'hsl(38, 85%, 50%)'],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 10%, 60%)',
        grid: 'hsl(220, 10%, 92%)',
        axis: 'hsl(220, 15%, 35%)',
        label: 'hsl(220, 20%, 22%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.875rem',
        valueSize: '0.75rem',
        tickSize: '0.75rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '500',
      },
      spacing: {
        margin: { top: 20, right: 120, bottom: 40, left: 120 },
        padding: 0,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 50,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: false,
      pannable: false,
      brushable: false,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Ranking ladder showing position changes over time',
      keyboardNavigable: true,
      screenReaderDescription: 'Navigate entities to hear ranking history',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
  
  // =========== COMPOSITION ===========
  {
    id: 'stacked_area',
    name: 'Stacked Area Chart',
    category: 'composition',
    description: 'Show composition changes over time. Areas stack to 100% or absolute values.',
    useCases: [
      'Market share evolution',
      'Budget composition over time',
      'Population structure changes',
      'Energy mix evolution',
    ],
    antiPatterns: [
      'Avoid more than 7 categories',
      'Never use with volatile baseline categories',
      'Do not use 3D perspective',
      'Avoid dark colors at bottom',
    ],
    dataRequirements: {
      minDataPoints: 5,
      maxDataPoints: 200,
      dimensions: [
        { name: 'time', type: 'temporal', required: true },
        { name: 'category', type: 'categorical', required: true },
      ],
      measures: [
        { name: 'value', type: 'numeric', aggregatable: true, required: true },
      ],
    },
    visualSpec: {
      minWidth: 500,
      minHeight: 300,
      aspectRatio: '16:9',
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        series: [
          'hsl(220, 70%, 55%)',
          'hsl(152, 55%, 48%)',
          'hsl(38, 80%, 52%)',
          'hsl(280, 55%, 58%)',
          'hsl(340, 60%, 55%)',
          'hsl(180, 45%, 48%)',
          'hsl(60, 60%, 48%)',
        ],
        positive: 'hsl(152, 60%, 42%)',
        negative: 'hsl(0, 65%, 50%)',
        neutral: 'hsl(220, 10%, 70%)',
        grid: 'hsl(220, 10%, 92%)',
        axis: 'hsl(220, 15%, 35%)',
        label: 'hsl(220, 20%, 22%)',
        background: 'transparent',
      },
      typography: {
        titleSize: '1rem',
        labelSize: '0.75rem',
        valueSize: '0.75rem',
        tickSize: '0.625rem',
        fontFamily: '"SF Pro Text", system-ui, sans-serif',
        fontWeight: '400',
      },
      spacing: {
        margin: { top: 20, right: 100, bottom: 40, left: 60 },
        padding: 0,
        gridGap: 0,
      },
      animation: {
        enabled: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 0,
      },
    },
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: true,
      pannable: true,
      brushable: true,
      tooltipBehavior: 'hover',
    },
    accessibilitySpec: {
      ariaLabel: 'Stacked area chart showing composition over time',
      keyboardNavigable: true,
      screenReaderDescription: 'Categories stack to show total. Navigate time with arrows.',
      highContrastMode: true,
      reducedMotion: true,
    },
  },
];

// ============================================================================
// DATA CARD COMPONENTS
// ============================================================================

export interface DataCardSpec {
  id: string;
  name: string;
  type: 'metric' | 'comparison' | 'trend' | 'ranking' | 'status';
  layout: 'compact' | 'standard' | 'expanded';
  elements: CardElement[];
  interactionSpec: InteractionSpec;
}

export interface CardElement {
  type: 'value' | 'label' | 'trend' | 'sparkline' | 'badge' | 'icon' | 'source';
  position: 'primary' | 'secondary' | 'tertiary' | 'footer';
  format?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DATA_CARDS: DataCardSpec[] = [
  {
    id: 'metric_card_standard',
    name: 'Standard Metric Card',
    type: 'metric',
    layout: 'standard',
    elements: [
      { type: 'value', position: 'primary', size: 'xl', format: 'number' },
      { type: 'label', position: 'secondary', size: 'sm' },
      { type: 'trend', position: 'tertiary', size: 'md' },
      { type: 'source', position: 'footer', size: 'sm' },
    ],
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: false,
      zoomable: false,
      pannable: false,
      brushable: false,
      tooltipBehavior: 'hover',
    },
  },
  {
    id: 'index_card',
    name: 'Index Score Card',
    type: 'ranking',
    layout: 'expanded',
    elements: [
      { type: 'value', position: 'primary', size: 'xl', format: 'score' },
      { type: 'label', position: 'secondary', size: 'md' },
      { type: 'sparkline', position: 'tertiary' },
      { type: 'badge', position: 'tertiary', size: 'sm' },
      { type: 'trend', position: 'footer', size: 'sm' },
    ],
    interactionSpec: {
      hoverable: true,
      clickable: true,
      selectable: true,
      zoomable: false,
      pannable: false,
      brushable: false,
      tooltipBehavior: 'click',
    },
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getChartById(id: string): ChartConfig | undefined {
  return CHART_COMPONENTS.find(c => c.id === id);
}

export function getChartsByCategory(category: ChartCategory): ChartConfig[] {
  return CHART_COMPONENTS.filter(c => c.category === category);
}

export function validateDataForChart(
  chartId: string, 
  dataPoints: number, 
  dimensions: string[], 
  measures: string[]
): { valid: boolean; errors: string[] } {
  const chart = getChartById(chartId);
  if (!chart) return { valid: false, errors: ['Chart not found'] };
  
  const errors: string[] = [];
  
  if (dataPoints < chart.dataRequirements.minDataPoints) {
    errors.push(`Minimum ${chart.dataRequirements.minDataPoints} data points required`);
  }
  if (dataPoints > chart.dataRequirements.maxDataPoints) {
    errors.push(`Maximum ${chart.dataRequirements.maxDataPoints} data points allowed`);
  }
  
  for (const req of chart.dataRequirements.dimensions) {
    if (req.required && !dimensions.includes(req.name)) {
      errors.push(`Required dimension missing: ${req.name}`);
    }
  }
  
  for (const req of chart.dataRequirements.measures) {
    if (req.required && !measures.includes(req.name)) {
      errors.push(`Required measure missing: ${req.name}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

console.log('[Visual Components] Specifications loaded:', CHART_COMPONENTS.length, 'chart types');
