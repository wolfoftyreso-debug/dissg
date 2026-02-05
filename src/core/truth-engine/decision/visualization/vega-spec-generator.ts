/**
 * VEGA-LITE SPEC GENERATOR
 * 
 * Generates Vega-Lite specifications for Decision Graph visualizations.
 * Each spec includes mandatory limitation annotations.
 * 
 * These visualizations DISPLAY data, never RECOMMEND actions.
 */

/**
 * Vega-Lite specification type
 */
export interface VegaLiteSpec {
  readonly $schema: string;
  readonly width: number | 'container';
  readonly height: number;
  readonly data: { values: unknown[] };
  readonly mark?: string | { type: string; [key: string]: unknown };
  readonly encoding?: Record<string, unknown>;
  readonly title?: string | { text: string; subtitle: string };
  readonly layer?: unknown[];
  readonly config?: Record<string, unknown>;
}

/**
 * Chart type definitions
 */
export type ChartType = 
  | 'trend_line'
  | 'distribution_histogram'
  | 'comparison_bar'
  | 'correlation_heatmap'
  | 'signal_sparkline'
  | 'scenario_fan';

/**
 * Generate Vega-Lite spec based on answer type
 */
export function generateSpec(
  chartType: ChartType,
  data: unknown[],
  options: {
    title: string;
    subtitle?: string;
    xField: string;
    yField: string;
    colorField?: string;
    limitations: string[];
  }
): VegaLiteSpec {
  const baseConfig = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container' as const,
    height: 300,
    config: {
      view: { stroke: 'transparent' },
      axis: { 
        labelFontSize: 11, 
        titleFontSize: 12,
        gridColor: '#e5e7eb',
      },
      legend: { labelFontSize: 11 },
    },
  };

  // Add limitation subtitle
  const limitationText = options.limitations.length > 0
    ? `Limitations: ${options.limitations[0]}`
    : 'Data shown without interpretation';

  const title = {
    text: options.title,
    subtitle: options.subtitle || limitationText,
  };

  switch (chartType) {
    case 'trend_line':
      return {
        ...baseConfig,
        title,
        data: { values: data },
        mark: { type: 'line', point: true, strokeWidth: 2 },
        encoding: {
          x: { field: options.xField, type: 'temporal', title: options.xField },
          y: { field: options.yField, type: 'quantitative', title: options.yField },
          color: options.colorField ? { field: options.colorField, type: 'nominal' } : undefined,
          tooltip: [
            { field: options.xField, type: 'temporal' },
            { field: options.yField, type: 'quantitative' },
          ],
        },
      };

    case 'distribution_histogram':
      return {
        ...baseConfig,
        title,
        data: { values: data },
        mark: { type: 'bar', cornerRadius: 2 },
        encoding: {
          x: { bin: true, field: options.xField, title: options.xField },
          y: { aggregate: 'count', title: 'Count' },
          color: options.colorField ? { field: options.colorField, type: 'nominal' } : { value: '#3b82f6' },
          tooltip: [
            { bin: true, field: options.xField },
            { aggregate: 'count' },
          ],
        },
      };

    case 'comparison_bar':
      return {
        ...baseConfig,
        title,
        data: { values: data },
        mark: { type: 'bar', cornerRadius: 4 },
        encoding: {
          y: { field: options.yField, type: 'nominal', sort: '-x', title: options.yField },
          x: { field: options.xField, type: 'quantitative', title: options.xField },
          color: options.colorField 
            ? { field: options.colorField, type: 'nominal' } 
            : { value: '#3b82f6' },
          tooltip: [
            { field: options.yField, type: 'nominal' },
            { field: options.xField, type: 'quantitative' },
          ],
        },
      };

    case 'correlation_heatmap':
      return {
        ...baseConfig,
        title,
        data: { values: data },
        mark: 'rect',
        encoding: {
          x: { field: options.xField, type: 'nominal', title: options.xField },
          y: { field: options.yField, type: 'nominal', title: options.yField },
          color: {
            field: 'value',
            type: 'quantitative',
            scale: { scheme: 'blueorange', domain: [-1, 1] },
            legend: { title: 'Correlation' },
          },
          tooltip: [
            { field: options.xField, type: 'nominal' },
            { field: options.yField, type: 'nominal' },
            { field: 'value', type: 'quantitative', format: '.2f' },
          ],
        },
      };

    case 'signal_sparkline':
      return {
        ...baseConfig,
        height: 60,
        title,
        data: { values: data },
        mark: { type: 'area', line: true, opacity: 0.3 },
        encoding: {
          x: { field: options.xField, type: 'temporal', axis: null },
          y: { field: options.yField, type: 'quantitative', axis: null },
          tooltip: [
            { field: options.xField, type: 'temporal' },
            { field: options.yField, type: 'quantitative' },
          ],
        },
      };

    case 'scenario_fan':
      return {
        ...baseConfig,
        title: {
          text: `${options.title} (HYPOTHETICAL)`,
          subtitle: 'Scenarios are NOT predictions. Based on historical patterns only.',
        },
        data: { values: data },
        layer: [
          {
            mark: { type: 'area', opacity: 0.2 },
            encoding: {
              x: { field: options.xField, type: 'temporal' },
              y: { field: 'lower', type: 'quantitative' },
              y2: { field: 'upper' },
              color: { value: '#3b82f6' },
            },
          },
          {
            mark: { type: 'line', strokeWidth: 2 },
            encoding: {
              x: { field: options.xField, type: 'temporal' },
              y: { field: options.yField, type: 'quantitative' },
              color: { value: '#1d4ed8' },
            },
          },
        ],
      };

    default:
      return {
        ...baseConfig,
        title,
        data: { values: data },
        mark: 'point',
        encoding: {
          x: { field: options.xField, type: 'quantitative' },
          y: { field: options.yField, type: 'quantitative' },
        },
      };
  }
}

/**
 * Generate spec from Answer Packet
 */
export function generateSpecFromAnswerType(
  answerType: string,
  data: unknown[],
  title: string,
  limitations: string[]
): VegaLiteSpec | null {
  const mapping: Record<string, { chart: ChartType; x: string; y: string }> = {
    'TREND_CHANGE': { chart: 'trend_line', x: 'period', y: 'value' },
    'DISTRIBUTION_STRUCTURE': { chart: 'distribution_histogram', x: 'value', y: 'count' },
    'COMPARISON_CONDITIONAL': { chart: 'comparison_bar', x: 'value', y: 'category' },
    'CORRELATION_OVERVIEW': { chart: 'correlation_heatmap', x: 'factor_a', y: 'factor_b' },
    'DESCRIPTIVE_STAT': { chart: 'comparison_bar', x: 'value', y: 'metric' },
    'SCENARIO_MODEL': { chart: 'scenario_fan', x: 'period', y: 'value' },
  };

  const config = mapping[answerType];
  if (!config) return null;

  return generateSpec(config.chart, data, {
    title,
    xField: config.x,
    yField: config.y,
    limitations,
  });
}

/**
 * VISUALIZATION PRINCIPLES
 */
export const VISUALIZATION_PRINCIPLES = {
  every_chart_must_have: [
    'Limitation annotation',
    'Clear axis labels',
    'Drill-down capability',
    'No interpretive coloring (red=bad, green=good)',
  ],
  never_includes: [
    'Recommendation callouts',
    'Trend predictions',
    'Normative annotations',
  ],
  color_usage: {
    allowed: 'Categorical distinction, value encoding',
    forbidden: 'Normative signaling (good/bad)',
  },
} as const;

/**
 * Standard chart configurations per answer type
 */
export const CHART_CONFIGS: Record<string, {
  primary: ChartType;
  secondary?: ChartType;
  supports_drill_down: boolean;
}> = {
  'TREND_CHANGE': { primary: 'trend_line', supports_drill_down: true },
  'DISTRIBUTION_STRUCTURE': { primary: 'distribution_histogram', secondary: 'comparison_bar', supports_drill_down: true },
  'COMPARISON_CONDITIONAL': { primary: 'comparison_bar', supports_drill_down: true },
  'CORRELATION_OVERVIEW': { primary: 'correlation_heatmap', supports_drill_down: true },
  'RISK_PREVALENCE': { primary: 'comparison_bar', supports_drill_down: true },
  'DESCRIPTIVE_STAT': { primary: 'comparison_bar', supports_drill_down: true },
  'SCENARIO_MODEL': { primary: 'scenario_fan', supports_drill_down: false },
};
