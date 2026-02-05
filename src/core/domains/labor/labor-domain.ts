/**
 * LABOR MARKET PRESSURE DOMAIN
 * 
 * Auto-generated via Domain Autogenerator.
 * Bridge between economy, health, and stability.
 */

/**
 * DOMAIN METADATA
 */
export const LABOR_DOMAIN = {
  code: 'LBR',
  name: 'Labor Market Pressure',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  auto_generated: true,
  coupling: ['economy', 'health', 'stability', 'demographics'],
} as const;

/**
 * TRUTH NODE DEFINITIONS
 */
export const LABOR_TRUTH_NODES = [
  // Unemployment Components
  { id: 'LBR:UNEMP:TOTAL', name: 'Total Unemployment Rate', unit: 'percent', category: 'unemployment' },
  { id: 'LBR:UNEMP:YOUTH', name: 'Youth Unemployment (15-24)', unit: 'percent', category: 'unemployment' },
  { id: 'LBR:UNEMP:LONG_TERM', name: 'Long-term Unemployment', unit: 'percent', category: 'unemployment' },
  { id: 'LBR:UNEMP:HIDDEN', name: 'Hidden Unemployment (underutilization)', unit: 'percent', category: 'unemployment' },
  
  // Part-time / Involuntary
  { id: 'LBR:PARTTIME:INVOLUNTARY', name: 'Involuntary Part-time Rate', unit: 'percent', category: 'underemployment' },
  { id: 'LBR:PARTTIME:TOTAL', name: 'Part-time Employment Share', unit: 'percent', category: 'structure' },
  { id: 'LBR:GIG:SHARE', name: 'Gig Economy Share', unit: 'percent', category: 'structure' },
  
  // Sick Leave (aggregate)
  { id: 'LBR:SICK:RATE', name: 'Sick Leave Rate', unit: 'days_per_year', category: 'health' },
  { id: 'LBR:SICK:LONG_TERM', name: 'Long-term Sick Leave Rate', unit: 'percent', category: 'health' },
  { id: 'LBR:SICK:TREND', name: 'Sick Leave Trend (10yr)', unit: 'index', category: 'trend' },
  
  // Matching Gap
  { id: 'LBR:MATCH:VACANCY_RATIO', name: 'Vacancy-to-Unemployment Ratio', unit: 'ratio', category: 'matching' },
  { id: 'LBR:MATCH:SKILL_GAP', name: 'Skill Mismatch Index', unit: 'index', category: 'matching' },
  { id: 'LBR:MATCH:REGIONAL', name: 'Regional Matching Efficiency', unit: 'index', category: 'matching' },
  { id: 'LBR:MATCH:SECTORAL', name: 'Sectoral Mismatch', unit: 'index', category: 'matching' },
  
  // Regional Variation
  { id: 'LBR:REGIONAL:DISPARITY', name: 'Regional Employment Disparity', unit: 'gini', category: 'regional' },
  { id: 'LBR:REGIONAL:URBAN', name: 'Urban Employment Rate', unit: 'percent', category: 'regional' },
  { id: 'LBR:REGIONAL:RURAL', name: 'Rural Employment Rate', unit: 'percent', category: 'regional' },
  
  // Long-term Series
  { id: 'LBR:TREND:PARTICIPATION', name: 'Participation Rate (30yr)', unit: 'percent', category: 'trend' },
  { id: 'LBR:TREND:EMPLOYMENT', name: 'Employment Rate (30yr)', unit: 'percent', category: 'trend' },
  { id: 'LBR:TREND:STRUCTURAL', name: 'Structural Unemployment (30yr)', unit: 'percent', category: 'trend' },
  
  // Pressure Indicators
  { id: 'LBR:PRESSURE:ENTRY', name: 'Labor Market Entry Pressure', unit: 'index', category: 'pressure' },
  { id: 'LBR:PRESSURE:EXIT', name: 'Labor Market Exit Pressure', unit: 'index', category: 'pressure' },
  { id: 'LBR:PRESSURE:WAGE', name: 'Wage Pressure Index', unit: 'index', category: 'pressure' },
] as const;

/**
 * INDEX DEFINITIONS
 */
export const LABOR_INDEXES = [
  {
    id: 'IDX:LBR:TIGHTNESS',
    name: 'Labor Market Tightness',
    components: ['LBR:MATCH:VACANCY_RATIO', 'LBR:UNEMP:TOTAL', 'LBR:PRESSURE:WAGE'],
    weights: [0.4, 0.35, 0.25],
  },
  {
    id: 'IDX:LBR:PARTICIPATION_PRESSURE',
    name: 'Participation Pressure Index',
    components: ['LBR:TREND:PARTICIPATION', 'LBR:PARTTIME:INVOLUNTARY', 'LBR:UNEMP:HIDDEN'],
    weights: [0.4, 0.3, 0.3],
  },
  {
    id: 'IDX:LBR:VOLATILITY',
    name: 'Labor Market Volatility',
    components: ['LBR:UNEMP:TOTAL', 'LBR:GIG:SHARE', 'LBR:PARTTIME:INVOLUNTARY'],
    weights: [0.4, 0.3, 0.3],
  },
  {
    id: 'IDX:LBR:HEALTH_BURDEN',
    name: 'Labor Health Burden',
    components: ['LBR:SICK:RATE', 'LBR:SICK:LONG_TERM', 'LBR:SICK:TREND'],
    weights: [0.4, 0.35, 0.25],
  },
  {
    id: 'IDX:LBR:MATCHING_EFFICIENCY',
    name: 'Matching Efficiency Index',
    components: ['LBR:MATCH:VACANCY_RATIO', 'LBR:MATCH:SKILL_GAP', 'LBR:MATCH:REGIONAL'],
    weights: [0.35, 0.35, 0.3],
  },
  {
    id: 'IDX:LBR:YOUTH_PRESSURE',
    name: 'Youth Labor Pressure',
    components: ['LBR:UNEMP:YOUTH', 'LBR:PRESSURE:ENTRY', 'LBR:MATCH:SKILL_GAP'],
    weights: [0.4, 0.3, 0.3],
  },
  {
    id: 'IDX:LBR:STRUCTURAL_HEALTH',
    name: 'Structural Labor Health',
    components: ['LBR:TREND:STRUCTURAL', 'LBR:UNEMP:LONG_TERM', 'LBR:REGIONAL:DISPARITY'],
    weights: [0.35, 0.35, 0.3],
  },
] as const;

/**
 * DECISION GRAPH DEFINITIONS
 */
export const LABOR_DECISION_GRAPHS = [
  {
    id: 'DG:LBR:MARKET_STATE',
    name: 'Labor Market State Overview',
    entry_question: 'What is the current state of the labor market?',
    nodes: ['LBR:UNEMP:TOTAL', 'IDX:LBR:TIGHTNESS', 'LBR:MATCH:VACANCY_RATIO'],
  },
  {
    id: 'DG:LBR:MATCHING_GAPS',
    name: 'Labor Matching Analysis',
    entry_question: 'Where are the largest matching inefficiencies?',
    nodes: ['LBR:MATCH:SKILL_GAP', 'LBR:MATCH:REGIONAL', 'IDX:LBR:MATCHING_EFFICIENCY'],
  },
  {
    id: 'DG:LBR:YOUTH_ENTRY',
    name: 'Youth Labor Entry',
    entry_question: 'How difficult is labor market entry for youth?',
    nodes: ['LBR:UNEMP:YOUTH', 'LBR:PRESSURE:ENTRY', 'IDX:LBR:YOUTH_PRESSURE'],
  },
] as const;

/**
 * DOMAIN STATISTICS
 */
export const LABOR_STATS = {
  truth_nodes: LABOR_TRUTH_NODES.length,
  indexes: LABOR_INDEXES.length,
  decision_graphs: LABOR_DECISION_GRAPHS.length,
} as const;
