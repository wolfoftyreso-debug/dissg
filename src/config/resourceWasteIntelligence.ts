/**
 * GLOBAL RESOURCE WASTE & SYSTEM LEAKAGE INTELLIGENCE
 * 
 * "Where value is burned without producing outcomes"
 * 
 * Waste is not defined by intention.
 * Waste is defined by outcome per unit of input.
 */

// ============================================================================
// SYSTEM IDENTITY
// ============================================================================

export const SYSTEM_IDENTITY = {
  role: 'Systems Inefficiency & Resource Leakage Architect',
  
  purpose: [
    'Identify where resources are consumed',
    'Without proportional outcomes',
    'Due to structural, organizational, or incentive misalignment',
  ],
  
  principles: [
    'No accusations',
    'No blame',
    'Only measurable imbalance',
  ],
  
  coreDefinition: 'If input ↑ and outcome ↔ or ↓ → waste exists.',
  
  finalStatement: 'Waste is not a moral failure. It is a systems design failure.',
} as const;

// ============================================================================
// 1. RESOURCE TAXONOMY
// ============================================================================

export type ResourceClass = 
  | 'money'
  | 'human_time'
  | 'cognitive_load'
  | 'infrastructure'
  | 'attention'
  | 'opportunity_cost';

export interface ResourceDefinition {
  id: ResourceClass;
  name: string;
  nameLocal: string;
  description: string;
  measurementUnits: string[];
  quantifiable: boolean;
  examples: string[];
}

export const RESOURCE_TAXONOMY: Record<ResourceClass, ResourceDefinition> = {
  money: {
    id: 'money',
    name: 'Money',
    nameLocal: 'Pengar',
    description: 'Budget, subsidies, transfers, expenditure',
    measurementUnits: ['currency', 'currency_per_capita', 'percent_gdp'],
    quantifiable: true,
    examples: ['Government spending', 'Subsidies', 'Transfer payments', 'Program budgets'],
  },
  
  human_time: {
    id: 'human_time',
    name: 'Human Time',
    nameLocal: 'Mänsklig tid',
    description: 'Man-hours, administrative load, processing time',
    measurementUnits: ['hours', 'fte', 'hours_per_case'],
    quantifiable: true,
    examples: ['Administrative hours', 'Processing time', 'Meeting overhead', 'Compliance burden'],
  },
  
  cognitive_load: {
    id: 'cognitive_load',
    name: 'Cognitive Load',
    nameLocal: 'Kognitiv belastning',
    description: 'Decision friction, complexity burden, mental overhead',
    measurementUnits: ['decisions_per_process', 'complexity_score', 'error_rate'],
    quantifiable: true,
    examples: ['Form complexity', 'Decision layers', 'Approval chains', 'Information overload'],
  },
  
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure',
    nameLocal: 'Infrastruktur',
    description: 'Underutilized assets, capacity waste',
    measurementUnits: ['utilization_percent', 'idle_capacity', 'maintenance_cost'],
    quantifiable: true,
    examples: ['Empty buildings', 'Unused equipment', 'Redundant systems', 'Idle capacity'],
  },
  
  attention: {
    id: 'attention',
    name: 'Attention',
    nameLocal: 'Uppmärksamhet',
    description: 'Reporting burden, compliance noise, distraction',
    measurementUnits: ['reports_per_period', 'compliance_hours', 'interrupt_frequency'],
    quantifiable: true,
    examples: ['Reporting requirements', 'Compliance documentation', 'Audit overhead', 'Meeting culture'],
  },
  
  opportunity_cost: {
    id: 'opportunity_cost',
    name: 'Opportunity Cost',
    nameLocal: 'Alternativkostnad',
    description: 'What could have been done with the same resources',
    measurementUnits: ['foregone_outcome', 'alternative_return', 'comparative_efficiency'],
    quantifiable: true,
    examples: ['Alternative investments', 'Delayed projects', 'Missed innovations', 'Foregone outcomes'],
  },
} as const;

// ============================================================================
// 2. OUTCOME DEFINITIONS (BY DOMAIN)
// ============================================================================

export type SystemDomain = 
  | 'education'
  | 'healthcare'
  | 'migration'
  | 'defense'
  | 'administration'
  | 'welfare'
  | 'environment'
  | 'justice'
  | 'transport'
  | 'housing';

export interface DomainOutcomeDefinition {
  domain: SystemDomain;
  name: string;
  nameLocal: string;
  primaryOutcomes: OutcomeMetric[];
  secondaryOutcomes: OutcomeMetric[];
  commonInputs: string[];
  evaluationPossible: boolean;
}

export interface OutcomeMetric {
  id: string;
  name: string;
  unit: string;
  direction: 'higher_better' | 'lower_better';
  measurable: boolean;
}

export const DOMAIN_OUTCOMES: Record<SystemDomain, DomainOutcomeDefinition> = {
  education: {
    domain: 'education',
    name: 'Education',
    nameLocal: 'Utbildning',
    primaryOutcomes: [
      { id: 'skill_acquisition', name: 'Skill Acquisition', unit: 'competency_score', direction: 'higher_better', measurable: true },
      { id: 'employability', name: 'Employability Rate', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'completion_rate', name: 'Completion Rate', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'time_to_employment', name: 'Time to Employment', unit: 'months', direction: 'lower_better', measurable: true },
      { id: 'income_premium', name: 'Income Premium', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    commonInputs: ['spending_per_student', 'teacher_hours', 'infrastructure_cost'],
    evaluationPossible: true,
  },
  
  healthcare: {
    domain: 'healthcare',
    name: 'Healthcare',
    nameLocal: 'Sjukvård',
    primaryOutcomes: [
      { id: 'morbidity_reduction', name: 'Morbidity Reduction', unit: 'cases_per_100k', direction: 'lower_better', measurable: true },
      { id: 'longevity', name: 'Life Expectancy', unit: 'years', direction: 'higher_better', measurable: true },
      { id: 'qaly', name: 'Quality-Adjusted Life Years', unit: 'qaly', direction: 'higher_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'wait_time', name: 'Wait Time', unit: 'days', direction: 'lower_better', measurable: true },
      { id: 'readmission_rate', name: 'Readmission Rate', unit: 'percent', direction: 'lower_better', measurable: true },
    ],
    commonInputs: ['spending_per_capita', 'staff_hours', 'equipment_cost', 'facility_cost'],
    evaluationPossible: true,
  },
  
  migration: {
    domain: 'migration',
    name: 'Migration',
    nameLocal: 'Migration',
    primaryOutcomes: [
      { id: 'integration_rate', name: 'Labor Market Integration', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'self_sufficiency', name: 'Self-Sufficiency Rate', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'processing_time', name: 'Processing Time', unit: 'months', direction: 'lower_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'language_acquisition', name: 'Language Proficiency', unit: 'level', direction: 'higher_better', measurable: true },
      { id: 'naturalization_rate', name: 'Naturalization Rate', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    commonInputs: ['processing_cost', 'integration_spending', 'housing_cost', 'admin_overhead'],
    evaluationPossible: true,
  },
  
  defense: {
    domain: 'defense',
    name: 'Defense',
    nameLocal: 'Försvar',
    primaryOutcomes: [
      { id: 'readiness', name: 'Operational Readiness', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'capability_index', name: 'Capability Index', unit: 'score', direction: 'higher_better', measurable: true },
      { id: 'deterrence_stability', name: 'Deterrence Stability', unit: 'index', direction: 'higher_better', measurable: false },
    ],
    secondaryOutcomes: [
      { id: 'personnel_retention', name: 'Personnel Retention', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'equipment_availability', name: 'Equipment Availability', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    commonInputs: ['budget_gdp_percent', 'personnel_cost', 'procurement_spending', 'maintenance_cost'],
    evaluationPossible: true,
  },
  
  administration: {
    domain: 'administration',
    name: 'Public Administration',
    nameLocal: 'Offentlig förvaltning',
    primaryOutcomes: [
      { id: 'processing_time', name: 'Processing Time', unit: 'days', direction: 'lower_better', measurable: true },
      { id: 'error_rate', name: 'Error Rate', unit: 'percent', direction: 'lower_better', measurable: true },
      { id: 'citizen_satisfaction', name: 'Citizen Satisfaction', unit: 'score', direction: 'higher_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'digital_completion', name: 'Digital Completion Rate', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'cost_per_transaction', name: 'Cost per Transaction', unit: 'currency', direction: 'lower_better', measurable: true },
    ],
    commonInputs: ['admin_budget', 'staff_count', 'it_spending', 'overhead'],
    evaluationPossible: true,
  },
  
  welfare: {
    domain: 'welfare',
    name: 'Welfare',
    nameLocal: 'Välfärd',
    primaryOutcomes: [
      { id: 'transition_rate', name: 'Transition to Independence', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'poverty_reduction', name: 'Poverty Reduction', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'dependency_duration', name: 'Dependency Duration', unit: 'months', direction: 'lower_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'recidivism_rate', name: 'Return to Welfare', unit: 'percent', direction: 'lower_better', measurable: true },
      { id: 'employment_outcome', name: 'Employment Outcome', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    commonInputs: ['benefit_spending', 'admin_cost', 'program_cost', 'case_worker_hours'],
    evaluationPossible: true,
  },
  
  environment: {
    domain: 'environment',
    name: 'Environment',
    nameLocal: 'Miljö',
    primaryOutcomes: [
      { id: 'emission_reduction', name: 'Emission Reduction', unit: 'tons_co2', direction: 'lower_better', measurable: true },
      { id: 'pollution_level', name: 'Pollution Level', unit: 'index', direction: 'lower_better', measurable: true },
      { id: 'biodiversity_index', name: 'Biodiversity Index', unit: 'index', direction: 'higher_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'renewable_share', name: 'Renewable Energy Share', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'recycling_rate', name: 'Recycling Rate', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    commonInputs: ['environmental_spending', 'subsidy_cost', 'regulatory_cost', 'enforcement_cost'],
    evaluationPossible: true,
  },
  
  justice: {
    domain: 'justice',
    name: 'Justice',
    nameLocal: 'Rättsväsende',
    primaryOutcomes: [
      { id: 'case_resolution_time', name: 'Case Resolution Time', unit: 'days', direction: 'lower_better', measurable: true },
      { id: 'recidivism_rate', name: 'Recidivism Rate', unit: 'percent', direction: 'lower_better', measurable: true },
      { id: 'clearance_rate', name: 'Case Clearance Rate', unit: 'percent', direction: 'higher_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'appeal_rate', name: 'Appeal Rate', unit: 'percent', direction: 'lower_better', measurable: true },
      { id: 'incarceration_cost', name: 'Cost per Inmate', unit: 'currency', direction: 'lower_better', measurable: true },
    ],
    commonInputs: ['justice_budget', 'personnel_cost', 'facility_cost', 'legal_aid_cost'],
    evaluationPossible: true,
  },
  
  transport: {
    domain: 'transport',
    name: 'Transport',
    nameLocal: 'Transport',
    primaryOutcomes: [
      { id: 'travel_time', name: 'Average Travel Time', unit: 'minutes', direction: 'lower_better', measurable: true },
      { id: 'reliability', name: 'Service Reliability', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'safety', name: 'Accidents per km', unit: 'rate', direction: 'lower_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'utilization', name: 'Capacity Utilization', unit: 'percent', direction: 'higher_better', measurable: true },
      { id: 'cost_efficiency', name: 'Cost per Passenger-km', unit: 'currency', direction: 'lower_better', measurable: true },
    ],
    commonInputs: ['infrastructure_spending', 'subsidy', 'maintenance_cost', 'operations_cost'],
    evaluationPossible: true,
  },
  
  housing: {
    domain: 'housing',
    name: 'Housing',
    nameLocal: 'Bostäder',
    primaryOutcomes: [
      { id: 'affordability', name: 'Affordability Ratio', unit: 'income_percent', direction: 'lower_better', measurable: true },
      { id: 'availability', name: 'Housing Availability', unit: 'units_per_1000', direction: 'higher_better', measurable: true },
      { id: 'homelessness', name: 'Homelessness Rate', unit: 'per_10000', direction: 'lower_better', measurable: true },
    ],
    secondaryOutcomes: [
      { id: 'construction_rate', name: 'Construction Rate', unit: 'units_per_year', direction: 'higher_better', measurable: true },
      { id: 'waiting_time', name: 'Queue Time', unit: 'months', direction: 'lower_better', measurable: true },
    ],
    commonInputs: ['subsidy_spending', 'social_housing_cost', 'regulatory_cost', 'infrastructure_cost'],
    evaluationPossible: true,
  },
} as const;

export const UNDEFINED_OUTCOME_WARNING = 'Outcome Undefined → Evaluation Impossible';

// ============================================================================
// 3. INPUT-OUTPUT IMBALANCE ENGINE
// ============================================================================

export type EfficiencyZone = 'green' | 'yellow' | 'red';

export interface ImbalanceAnalysis {
  domain: SystemDomain;
  countryCode: string;
  periodStart: string;
  periodEnd: string;
  
  // Aggregated data
  totalInputs: ResourceInput[];
  totalOutcomes: OutcomeResult[];
  
  // Computed metrics
  marginalReturn: number;
  returnTrend: 'increasing' | 'stable' | 'diminishing' | 'negative';
  elasticity: number;
  
  // Zone classification
  efficiencyZone: EfficiencyZone;
  zoneRationale: string;
  
  // Confidence
  dataQuality: 'high' | 'medium' | 'low';
  coveragePercent: number;
}

export interface ResourceInput {
  resourceClass: ResourceClass;
  amount: number;
  unit: string;
  normalizedPerCapita: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface OutcomeResult {
  metricId: string;
  value: number;
  unit: string;
  changeFromBaseline: number;
  trend: 'improving' | 'stable' | 'declining';
}

export const ZONE_DEFINITIONS = {
  green: {
    name: 'Proportional Return',
    description: 'Input increases produce proportional outcome improvements',
    criteria: 'elasticity >= 0.8',
  },
  yellow: {
    name: 'Diminishing Return',
    description: 'Input increases produce declining marginal outcomes',
    criteria: '0.3 <= elasticity < 0.8',
  },
  red: {
    name: 'Inverse Return',
    description: 'More input correlates with worse outcomes',
    criteria: 'elasticity < 0.3 or negative',
  },
} as const;

// ============================================================================
// 4. "WHY IS THIS WASTE?" VIEW
// ============================================================================

export type WasteCause = 
  | 'process_overhead'
  | 'incentive_misalignment'
  | 'regulatory_burden'
  | 'coordination_failure'
  | 'measurement_gap'
  | 'structural_redundancy'
  | 'timing_mismatch';

export interface WasteExplanation {
  imbalanceId: string;
  
  // Structural causes (never individuals or intent)
  structuralCauses: StructuralCause[];
  
  // Mechanism explanation
  mechanismDescription: string;
  
  // Evidence
  evidencePoints: string[];
  
  // What we cannot determine
  unknowns: string[];
}

export interface StructuralCause {
  causeType: WasteCause;
  name: string;
  description: string;
  evidenceStrength: 'strong' | 'moderate' | 'weak';
  examples: string[];
}

export const WASTE_CAUSE_DEFINITIONS: Record<WasteCause, Omit<StructuralCause, 'evidenceStrength' | 'examples'>> = {
  process_overhead: {
    causeType: 'process_overhead',
    name: 'Process Overhead',
    description: 'Administrative burden exceeds productive activity',
  },
  incentive_misalignment: {
    causeType: 'incentive_misalignment',
    name: 'Incentive Misalignment',
    description: 'System rewards inputs rather than outcomes',
  },
  regulatory_burden: {
    causeType: 'regulatory_burden',
    name: 'Regulatory Burden',
    description: 'Compliance cost exceeds protective benefit',
  },
  coordination_failure: {
    causeType: 'coordination_failure',
    name: 'Coordination Failure',
    description: 'Multiple entities duplicate effort without integration',
  },
  measurement_gap: {
    causeType: 'measurement_gap',
    name: 'Measurement Gap',
    description: 'What is measured differs from what matters',
  },
  structural_redundancy: {
    causeType: 'structural_redundancy',
    name: 'Structural Redundancy',
    description: 'Parallel systems perform identical functions',
  },
  timing_mismatch: {
    causeType: 'timing_mismatch',
    name: 'Timing Mismatch',
    description: 'Resources deployed when no longer needed or not yet effective',
  },
} as const;

// ============================================================================
// 5. DECISION CHAIN MAPPING
// ============================================================================

export interface DecisionChainAnalysis {
  domain: SystemDomain;
  chainId: string;
  
  // Three levels
  decisionLevel: ChainLevel;
  executionLevel: ChainLevel;
  outcomeLevel: ChainLevel;
  
  // Leakage points
  leakagePoints: LeakagePoint[];
  
  // Summary
  valueInjectionPoint: string;
  impactLossPoint: string;
}

export interface ChainLevel {
  name: string;
  actors: string[];
  resourcesHandled: number;
  decisionsMade: number;
  accountabilityClarity: 'clear' | 'diffuse' | 'absent';
}

export interface LeakagePoint {
  location: string;
  leakageType: WasteCause;
  estimatedLoss: number;
  lossUnit: string;
  description: string;
}

export const CHAIN_ANALYSIS_TEMPLATE = {
  summaryFormat: 'Value is injected at {injection_point} – but impact is lost at {loss_point}.',
} as const;

// ============================================================================
// 6. TIMELINE & ACCUMULATED LOSS
// ============================================================================

export interface AccumulatedWasteAnalysis {
  domain: SystemDomain;
  countryCode: string;
  
  // Yearly breakdown
  yearlyWaste: YearlyWaste[];
  
  // Accumulated totals
  accumulated5Years: number;
  accumulated10Years: number;
  accumulated20Years: number;
  
  // Compounding effect
  compoundingRate: number;
  compoundingDescription: string;
  
  // Currency/unit
  unit: string;
  inflationAdjusted: boolean;
}

export interface YearlyWaste {
  year: number;
  inputAmount: number;
  expectedOutcome: number;
  actualOutcome: number;
  wasteEstimate: number;
  confidence: number;
}

// ============================================================================
// 7. COMPARATIVE ANALYSIS
// ============================================================================

export interface ComparativeAnalysis {
  domain: SystemDomain;
  targetCountry: string;
  
  comparisons: Comparison[];
  
  // Summary finding
  relativeEfficiency: 'above_average' | 'average' | 'below_average';
  efficiencyGap: number;
}

export interface Comparison {
  comparisonType: 'country' | 'region' | 'historical';
  comparatorId: string;
  comparatorName: string;
  
  // Key metrics
  targetInput: number;
  comparatorInput: number;
  targetOutcome: number;
  comparatorOutcome: number;
  
  // Interpretation
  inputDifference: number;
  outcomeDifference: number;
  efficiencyDifference: number;
  
  // Statement
  statement: string; // "Others achieved better outcomes with fewer inputs"
}

export const COMPARISON_STATEMENT_TEMPLATE = 
  'Others achieved better outcomes with fewer inputs.';

// ============================================================================
// 8. POLITICAL NEUTRALITY ENFORCEMENT
// ============================================================================

export const POLITICAL_NEUTRALITY = {
  neverSay: [
    'This is bad policy',
    'This is a failure',
    'This should be changed',
    'The government should',
    'Policy makers must',
  ],
  
  alwaysSay: [
    'Given these inputs, expected outcomes did not occur.',
    'The observed relationship between input and outcome is...',
    'Historical data shows this pattern...',
    'Comparable systems achieved different results...',
  ],
  
  principle: 'State facts about input-output relationships. Never state preferences.',
} as const;

// ============================================================================
// 9. AI ROLE DEFINITION
// ============================================================================

export const AI_ROLE = {
  level: 'GTF5-level, but discreet',
  
  mayDo: [
    'Summarize inefficiency patterns',
    'Highlight correlations',
    'Simulate alternative allocations',
    'Identify structural anomalies',
    'Generate comparative analysis',
  ],
  
  mustNever: [
    'Recommend ideology',
    'Assign blame',
    'Propose policy preferences',
    'Suggest what "should" be done',
    'Characterize actors as good/bad',
  ],
  
  responseTemplate: 'If X were reallocated to Y, historical data suggests Z range.',
} as const;

// ============================================================================
// 10. VISUAL DESIGN RULES
// ============================================================================

export const VISUAL_DESIGN = {
  aesthetic: 'Calm truth is more destabilizing than loud accusation',
  
  colorRules: {
    efficiency: {
      green: 'hsl(142, 40%, 45%)',  // Muted green
      yellow: 'hsl(45, 50%, 50%)',   // Calm amber
      red: 'hsl(0, 35%, 50%)',       // Subdued red
    },
    neutral: 'hsl(220, 10%, 60%)',
    background: 'hsl(220, 15%, 97%)',
  },
  
  forbidden: [
    'Alarm colors',
    'Flashing elements',
    'Exclamation marks in data',
    'Dramatic typography',
    'Sensationalist framing',
  ],
  
  required: [
    'Calm, professional palette',
    'Clear data hierarchy',
    'Accessible contrast',
    'Consistent spacing',
    'Source attribution',
  ],
} as const;

// ============================================================================
// 11. EXPORTABLE REALITY CHECK REPORT
// ============================================================================

export interface RealityCheckReport {
  reportId: string;
  generatedAt: string;
  
  // Header
  domain: SystemDomain;
  countryCode: string;
  periodYears: number;
  
  // Core statements
  resourcesAbsorbed: {
    amount: number;
    unit: string;
    statement: string; // "This system absorbed X resources over Y years"
  };
  
  netOutcomeChange: {
    change: number;
    direction: 'positive' | 'negative' | 'neutral';
    statement: string; // "Net outcome change: Z"
  };
  
  efficiencyTrend: {
    trend: 'improving' | 'stable' | 'declining';
    magnitude: number;
    statement: string; // "Efficiency trend: ↑ / ↓ / flat"
  };
  
  // Metadata (required for legitimacy)
  scope: string;
  dataSources: string[];
  uncertainty: string;
  notMeasured: string[];
  
  // Export formats
  availableFormats: ('pdf' | 'json' | 'csv' | 'embed')[];
}

export const REPORT_STATEMENT_TEMPLATES = {
  resources: 'This system absorbed {amount} {unit} over {years} years.',
  outcome: 'Net outcome change: {change}',
  trend: 'Efficiency trend: {direction}',
} as const;

// ============================================================================
// 12. SYSTEM PROTECTION
// ============================================================================

export const SYSTEM_PROTECTION = {
  mandatoryDisclosures: [
    'scope',
    'data_sources',
    'uncertainty',
    'what_is_not_measured',
  ],
  
  purpose: 'So no one can claim manipulation',
  
  disclaimer: 'This analysis shows resource efficiency patterns – not policy recommendations.',
  disclaimerLocal: 'Denna analys visar resurseffektivitetsmönster – inte policyrekommendationer.',
} as const;

// ============================================================================
// VALIDATION & UTILITY FUNCTIONS
// ============================================================================

export function classifyEfficiencyZone(elasticity: number): EfficiencyZone {
  if (elasticity >= 0.8) return 'green';
  if (elasticity >= 0.3) return 'yellow';
  return 'red';
}

export function calculateElasticity(
  inputChange: number,
  outcomeChange: number
): number {
  if (inputChange === 0) return 0;
  return outcomeChange / inputChange;
}

export function generateComparisonStatement(
  targetEfficiency: number,
  comparatorEfficiency: number
): string {
  const difference = comparatorEfficiency - targetEfficiency;
  
  if (difference > 0.1) {
    return 'Comparable systems achieved better outcomes with similar or fewer inputs.';
  } else if (difference < -0.1) {
    return 'This system achieved better outcomes relative to comparable systems.';
  }
  return 'Efficiency is comparable to similar systems.';
}

export function validateDomainOutcome(domain: SystemDomain): boolean {
  const domainDef = DOMAIN_OUTCOMES[domain];
  return domainDef.evaluationPossible && domainDef.primaryOutcomes.length > 0;
}

export function generateReportStatement(
  template: keyof typeof REPORT_STATEMENT_TEMPLATES,
  values: Record<string, string | number>
): string {
  let statement: string = REPORT_STATEMENT_TEMPLATES[template];
  for (const [key, value] of Object.entries(values)) {
    statement = statement.replace(`{${key}}`, String(value));
  }
  return statement;
}

// ============================================================================
// EXPORT COMPLETE SYSTEM
// ============================================================================

export const RESOURCE_WASTE_INTELLIGENCE = {
  identity: SYSTEM_IDENTITY,
  resources: RESOURCE_TAXONOMY,
  domains: DOMAIN_OUTCOMES,
  zones: ZONE_DEFINITIONS,
  wasteCauses: WASTE_CAUSE_DEFINITIONS,
  chainTemplate: CHAIN_ANALYSIS_TEMPLATE,
  comparisonTemplate: COMPARISON_STATEMENT_TEMPLATE,
  neutrality: POLITICAL_NEUTRALITY,
  aiRole: AI_ROLE,
  visualDesign: VISUAL_DESIGN,
  reportTemplates: REPORT_STATEMENT_TEMPLATES,
  protection: SYSTEM_PROTECTION,
  
  // Validation utilities
  validate: {
    classifyZone: classifyEfficiencyZone,
    calculateElasticity,
    generateComparison: generateComparisonStatement,
    validateDomain: validateDomainOutcome,
    generateReport: generateReportStatement,
  },
  
  // Warning
  undefinedOutcomeWarning: UNDEFINED_OUTCOME_WARNING,
} as const;

console.log('[Resource Waste Intelligence] System loaded');
console.log('[Resource Waste Intelligence] Resource classes:', Object.keys(RESOURCE_TAXONOMY).length);
console.log('[Resource Waste Intelligence] Domains with outcomes:', Object.keys(DOMAIN_OUTCOMES).length);
console.log('[Resource Waste Intelligence] Waste cause types:', Object.keys(WASTE_CAUSE_DEFINITIONS).length);
