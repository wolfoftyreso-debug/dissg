/**
 * HOUSING SYSTEM LOAD DOMAIN
 * 
 * Auto-generated via Domain Autogenerator.
 * Systemic bottleneck affecting everything.
 */

/**
 * DOMAIN METADATA
 */
export const HOUSING_DOMAIN = {
  code: 'HSG',
  name: 'Housing System Load',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  auto_generated: true,
  coupling: ['economy', 'demographics', 'infrastructure', 'health'],
} as const;

/**
 * TRUTH NODE DEFINITIONS
 */
export const HOUSING_TRUTH_NODES = [
  // Housing Shortage Indicators
  { id: 'HSG:SHORTAGE:ABSOLUTE', name: 'Absolute Housing Shortage', unit: 'units', category: 'shortage' },
  { id: 'HSG:SHORTAGE:RELATIVE', name: 'Relative Housing Shortage', unit: 'percent', category: 'shortage' },
  { id: 'HSG:SHORTAGE:WAITING_TIME', name: 'Average Queue Time (rental)', unit: 'years', category: 'shortage' },
  { id: 'HSG:SHORTAGE:QUEUE_LENGTH', name: 'Housing Queue Length', unit: 'persons', category: 'shortage' },
  
  // Construction Rate
  { id: 'HSG:BUILD:RATE', name: 'Housing Construction Rate', unit: 'units_per_year', category: 'supply' },
  { id: 'HSG:BUILD:VS_NEED', name: 'Construction vs Need Ratio', unit: 'ratio', category: 'supply' },
  { id: 'HSG:BUILD:PERMITS', name: 'Building Permits Issued', unit: 'count', category: 'supply' },
  { id: 'HSG:BUILD:COMPLETION', name: 'Construction Completion Rate', unit: 'percent', category: 'supply' },
  { id: 'HSG:BUILD:TREND', name: 'Construction Trend (20yr)', unit: 'index', category: 'trend' },
  
  // Overcrowding
  { id: 'HSG:CROWD:RATE', name: 'Overcrowding Rate', unit: 'percent', category: 'quality' },
  { id: 'HSG:CROWD:SEVERE', name: 'Severe Overcrowding Rate', unit: 'percent', category: 'quality' },
  { id: 'HSG:CROWD:CHILDREN', name: 'Child Overcrowding Rate', unit: 'percent', category: 'quality' },
  { id: 'HSG:QUALITY:SUBSTANDARD', name: 'Substandard Housing Rate', unit: 'percent', category: 'quality' },
  
  // Affordability (aggregate)
  { id: 'HSG:AFFORD:PRICE_INCOME', name: 'Price-to-Income Ratio', unit: 'ratio', category: 'affordability' },
  { id: 'HSG:AFFORD:RENT_INCOME', name: 'Rent-to-Income Ratio', unit: 'percent', category: 'affordability' },
  { id: 'HSG:AFFORD:COST_BURDEN', name: 'Housing Cost Burden Rate', unit: 'percent', category: 'affordability' },
  { id: 'HSG:AFFORD:TREND', name: 'Affordability Trend (20yr)', unit: 'index', category: 'trend' },
  
  // Regional Imbalance
  { id: 'HSG:REGIONAL:DISPARITY', name: 'Regional Housing Disparity', unit: 'gini', category: 'regional' },
  { id: 'HSG:REGIONAL:URBAN_PRESSURE', name: 'Urban Housing Pressure', unit: 'index', category: 'regional' },
  { id: 'HSG:REGIONAL:RURAL_VACANCY', name: 'Rural Vacancy Rate', unit: 'percent', category: 'regional' },
  { id: 'HSG:REGIONAL:MOBILITY_LOCK', name: 'Housing Mobility Lock Index', unit: 'index', category: 'regional' },
  
  // Tenure Structure
  { id: 'HSG:TENURE:OWNERSHIP', name: 'Home Ownership Rate', unit: 'percent', category: 'structure' },
  { id: 'HSG:TENURE:RENTAL', name: 'Rental Rate', unit: 'percent', category: 'structure' },
  { id: 'HSG:TENURE:SOCIAL', name: 'Social Housing Share', unit: 'percent', category: 'structure' },
] as const;

/**
 * INDEX DEFINITIONS
 */
export const HOUSING_INDEXES = [
  {
    id: 'IDX:HSG:PRESSURE',
    name: 'Housing Pressure Index',
    components: ['HSG:SHORTAGE:RELATIVE', 'HSG:AFFORD:COST_BURDEN', 'HSG:CROWD:RATE'],
    weights: [0.4, 0.35, 0.25],
  },
  {
    id: 'IDX:HSG:SUPPLY_CONSTRAINT',
    name: 'Supply Constraint Index',
    components: ['HSG:BUILD:VS_NEED', 'HSG:BUILD:COMPLETION', 'HSG:SHORTAGE:ABSOLUTE'],
    weights: [0.4, 0.3, 0.3],
  },
  {
    id: 'IDX:HSG:AFFORDABILITY',
    name: 'Housing Affordability Index',
    components: ['HSG:AFFORD:PRICE_INCOME', 'HSG:AFFORD:RENT_INCOME', 'HSG:AFFORD:COST_BURDEN'],
    weights: [0.35, 0.35, 0.3],
  },
  {
    id: 'IDX:HSG:QUALITY',
    name: 'Housing Quality Index',
    components: ['HSG:CROWD:RATE', 'HSG:QUALITY:SUBSTANDARD', 'HSG:CROWD:CHILDREN'],
    weights: [0.35, 0.35, 0.3],
  },
  {
    id: 'IDX:HSG:REGIONAL_BALANCE',
    name: 'Regional Housing Balance',
    components: ['HSG:REGIONAL:DISPARITY', 'HSG:REGIONAL:URBAN_PRESSURE', 'HSG:REGIONAL:MOBILITY_LOCK'],
    weights: [0.35, 0.35, 0.3],
  },
  {
    id: 'IDX:HSG:SYSTEM_HEALTH',
    name: 'Housing System Health',
    components: ['HSG:BUILD:TREND', 'HSG:AFFORD:TREND', 'HSG:SHORTAGE:RELATIVE'],
    weights: [0.35, 0.35, 0.3],
  },
] as const;

/**
 * DECISION GRAPH DEFINITIONS
 */
export const HOUSING_DECISION_GRAPHS = [
  {
    id: 'DG:HSG:SYSTEM_STATE',
    name: 'Housing System State',
    entry_question: 'What is the overall state of the housing system?',
    nodes: ['IDX:HSG:PRESSURE', 'IDX:HSG:SUPPLY_CONSTRAINT', 'HSG:SHORTAGE:RELATIVE'],
  },
  {
    id: 'DG:HSG:AFFORDABILITY',
    name: 'Housing Affordability Analysis',
    entry_question: 'How affordable is housing?',
    nodes: ['HSG:AFFORD:PRICE_INCOME', 'HSG:AFFORD:RENT_INCOME', 'IDX:HSG:AFFORDABILITY'],
  },
  {
    id: 'DG:HSG:REGIONAL',
    name: 'Regional Housing Analysis',
    entry_question: 'Where are the housing imbalances?',
    nodes: ['HSG:REGIONAL:DISPARITY', 'HSG:REGIONAL:URBAN_PRESSURE', 'IDX:HSG:REGIONAL_BALANCE'],
  },
] as const;

/**
 * DOMAIN STATISTICS
 */
export const HOUSING_STATS = {
  truth_nodes: HOUSING_TRUTH_NODES.length,
  indexes: HOUSING_INDEXES.length,
  decision_graphs: HOUSING_DECISION_GRAPHS.length,
} as const;
