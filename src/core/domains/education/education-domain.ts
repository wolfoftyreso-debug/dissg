/**
 * EDUCATION SYSTEM LOAD DOMAIN
 * 
 * Auto-generated via Domain Autogenerator.
 * Direct coupling to health, demographics, economy.
 */

/**
 * DOMAIN METADATA
 */
export const EDUCATION_DOMAIN = {
  code: 'EDU',
  name: 'Education System Load',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  auto_generated: true,
  coupling: ['health', 'demographics', 'economy'],
} as const;

/**
 * TRUTH NODE DEFINITIONS
 */
export const EDUCATION_TRUTH_NODES = [
  // Class Size
  { id: 'EDU:CLASS_SIZE:PRIMARY', name: 'Primary School Class Size', unit: 'students', category: 'capacity' },
  { id: 'EDU:CLASS_SIZE:SECONDARY', name: 'Secondary School Class Size', unit: 'students', category: 'capacity' },
  { id: 'EDU:CLASS_SIZE:REGIONAL_VAR', name: 'Class Size Regional Variation', unit: 'coefficient', category: 'disparity' },
  
  // Teacher Density
  { id: 'EDU:TEACHER_DENSITY:PRIMARY', name: 'Primary Teacher-Student Ratio', unit: 'ratio', category: 'capacity' },
  { id: 'EDU:TEACHER_DENSITY:SECONDARY', name: 'Secondary Teacher-Student Ratio', unit: 'ratio', category: 'capacity' },
  { id: 'EDU:TEACHER_SHORTAGE', name: 'Teacher Shortage Index', unit: 'index', category: 'pressure' },
  { id: 'EDU:TEACHER_TURNOVER', name: 'Teacher Turnover Rate', unit: 'percent', category: 'stability' },
  
  // Attendance
  { id: 'EDU:ABSENCE_RATE:PRIMARY', name: 'Primary Absence Rate', unit: 'percent', category: 'attendance' },
  { id: 'EDU:ABSENCE_RATE:SECONDARY', name: 'Secondary Absence Rate', unit: 'percent', category: 'attendance' },
  { id: 'EDU:CHRONIC_ABSENCE', name: 'Chronic Absence Rate', unit: 'percent', category: 'attendance' },
  
  // Results (aggregate only)
  { id: 'EDU:RESULT_VARIANCE:MATH', name: 'Math Result Variance', unit: 'stddev', category: 'outcomes' },
  { id: 'EDU:RESULT_VARIANCE:READING', name: 'Reading Result Variance', unit: 'stddev', category: 'outcomes' },
  { id: 'EDU:COMPLETION_RATE:SECONDARY', name: 'Secondary Completion Rate', unit: 'percent', category: 'outcomes' },
  
  // Regional Load
  { id: 'EDU:REGIONAL_LOAD:URBAN', name: 'Urban Education Load', unit: 'index', category: 'regional' },
  { id: 'EDU:REGIONAL_LOAD:RURAL', name: 'Rural Education Load', unit: 'index', category: 'regional' },
  { id: 'EDU:REGIONAL_DISPARITY', name: 'Regional Education Disparity', unit: 'gini', category: 'disparity' },
  
  // Time Series Anchors (20-30 year)
  { id: 'EDU:TREND:ENROLLMENT', name: 'Enrollment Trend (20yr)', unit: 'index', category: 'trend' },
  { id: 'EDU:TREND:CLASS_SIZE', name: 'Class Size Trend (20yr)', unit: 'index', category: 'trend' },
  { id: 'EDU:TREND:TEACHER_RATIO', name: 'Teacher Ratio Trend (20yr)', unit: 'index', category: 'trend' },
] as const;

/**
 * INDEX DEFINITIONS
 */
export const EDUCATION_INDEXES = [
  {
    id: 'IDX:EDU:CAPACITY',
    name: 'Education Capacity Index',
    components: ['EDU:CLASS_SIZE:PRIMARY', 'EDU:TEACHER_DENSITY:PRIMARY', 'EDU:TEACHER_SHORTAGE'],
    weights: [0.3, 0.4, 0.3],
  },
  {
    id: 'IDX:EDU:STUDENT_PRESSURE',
    name: 'Student Pressure Index',
    components: ['EDU:CLASS_SIZE:PRIMARY', 'EDU:CLASS_SIZE:SECONDARY', 'EDU:CHRONIC_ABSENCE'],
    weights: [0.35, 0.35, 0.3],
  },
  {
    id: 'IDX:EDU:REGIONAL_LOAD',
    name: 'Regional Education Load Index',
    components: ['EDU:REGIONAL_LOAD:URBAN', 'EDU:REGIONAL_LOAD:RURAL', 'EDU:REGIONAL_DISPARITY'],
    weights: [0.4, 0.4, 0.2],
  },
  {
    id: 'IDX:EDU:STABILITY',
    name: 'Education System Stability',
    components: ['EDU:TEACHER_TURNOVER', 'EDU:COMPLETION_RATE:SECONDARY', 'EDU:CHRONIC_ABSENCE'],
    weights: [0.3, 0.4, 0.3],
  },
  {
    id: 'IDX:EDU:OUTCOME_EQUITY',
    name: 'Education Outcome Equity',
    components: ['EDU:RESULT_VARIANCE:MATH', 'EDU:RESULT_VARIANCE:READING', 'EDU:REGIONAL_DISPARITY'],
    weights: [0.35, 0.35, 0.3],
  },
] as const;

/**
 * DECISION GRAPH DEFINITIONS
 */
export const EDUCATION_DECISION_GRAPHS = [
  {
    id: 'DG:EDU:CAPACITY_OVERVIEW',
    name: 'Education Capacity Overview',
    entry_question: 'How is the education system handling current load?',
    nodes: ['EDU:CLASS_SIZE:PRIMARY', 'EDU:TEACHER_DENSITY:PRIMARY', 'IDX:EDU:CAPACITY'],
  },
  {
    id: 'DG:EDU:REGIONAL_DISPARITIES',
    name: 'Regional Education Disparities',
    entry_question: 'Where are the largest education gaps?',
    nodes: ['EDU:REGIONAL_LOAD:URBAN', 'EDU:REGIONAL_LOAD:RURAL', 'EDU:REGIONAL_DISPARITY'],
  },
  {
    id: 'DG:EDU:TREND_STABILITY',
    name: 'Education Trend Stability',
    entry_question: 'Is the education system stabilizing or deteriorating?',
    nodes: ['EDU:TREND:ENROLLMENT', 'EDU:TREND:CLASS_SIZE', 'IDX:EDU:STABILITY'],
  },
] as const;

/**
 * DOMAIN STATISTICS
 */
export const EDUCATION_STATS = {
  truth_nodes: EDUCATION_TRUTH_NODES.length,
  indexes: EDUCATION_INDEXES.length,
  decision_graphs: EDUCATION_DECISION_GRAPHS.length,
} as const;
