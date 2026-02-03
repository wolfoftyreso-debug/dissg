/**
 * GLOBAL LABOUR, VALUE & FUTURE INTELLIGENCE SYSTEM
 * 
 * "What stops working, what starts working – and what actually matters"
 * 
 * This system exists to eliminate uncertainty where data exists,
 * and explicitly show uncertainty where it does not.
 */

// ============================================================================
// SYSTEM IDENTITY (LOCKED)
// ============================================================================

export const SYSTEM_IDENTITY = {
  purpose: 'Eliminate uncertainty where data exists, explicitly show uncertainty where it does not.',
  
  doesNot: [
    'motivate',
    'comfort',
    'persuade',
    'moralize',
  ],
  
  does: [
    'decompose reality into mechanisms',
    'show cause → effect → outcome',
    'surface trade-offs',
    'expose dead weight',
  ],
  
  coreStatement: 'The future of work is not about AI. It is about whether human effort still produces net value.',
} as const;

// ============================================================================
// DEL I – JOBS AS FUNCTIONAL COST
// ============================================================================

export interface JobFunctionalAnalysis {
  roleId: string;
  roleName: string;
  
  // Core decomposition
  tasks: TaskDecomposition[];
  decisionFrequency: 'continuous' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'rare';
  errorCost: ErrorCostProfile;
  valuePerTimeUnit: number;
  valueUnit: string;
  
  // Death calculation
  replacementCost: number;
  currentCost: number;
  structuralViability: 'viable' | 'declining' | 'structurally_dying';
  
  // Death category (if applicable)
  deathCategory?: DeathCategory;
}

export interface TaskDecomposition {
  taskId: string;
  description: string;
  automationPotential: number; // 0-1
  humanDifferentiation: number; // 0-1
  frequencyPerDay: number;
  valueContribution: number; // 0-1
}

export interface ErrorCostProfile {
  averageErrorCost: number;
  maxErrorCost: number;
  errorRecoveryTime: string;
  humanErrorRate: number;
  machineErrorRate: number;
}

// ============================================================================
// DEL I.2 – FOUR DEATH CATEGORIES
// ============================================================================

export type DeathCategory = 
  | 'information_transfer'
  | 'low_differentiation_admin'
  | 'reactive_intermediary'
  | 'simulated_competence';

export const DEATH_CATEGORIES = {
  information_transfer: {
    id: 'information_transfer',
    name: 'Information Transfer',
    nameLocal: 'Informationsförflyttning',
    description: 'Manual transfers, coordination roles without decision authority',
    indicators: [
      'Primary task is moving data between systems',
      'No unique analysis or synthesis',
      'Coordination without decision power',
      'Relay function only',
    ],
    examples: ['Data entry clerk', 'Message relay coordinator', 'Form processor'],
  },
  
  low_differentiation_admin: {
    id: 'low_differentiation_admin',
    name: 'Low-Differentiation Administration',
    nameLocal: 'Låg-differentierad administration',
    description: 'Report compilation, process monitoring without optimization',
    indicators: [
      'Compiling reports from existing data',
      'Monitoring processes without authority to change',
      'Following scripts without deviation',
      'No domain-specific judgment required',
    ],
    examples: ['Report compiler', 'Process monitor', 'Compliance checker (rule-based)'],
  },
  
  reactive_intermediary: {
    id: 'reactive_intermediary',
    name: 'Reactive Intermediary',
    nameLocal: 'Reaktiv mellanhand',
    description: 'Roles that react but do not steer, no unique domain knowledge',
    indicators: [
      'Responds to requests without proactive steering',
      'No unique domain expertise',
      'Interchangeable with any trained person',
      'Value comes from availability, not insight',
    ],
    examples: ['Generic customer service', 'Scheduling assistant', 'Basic support tier 1'],
  },
  
  simulated_competence: {
    id: 'simulated_competence',
    name: 'Simulated Competence',
    nameLocal: 'Simulerad kompetens',
    description: 'Where AI reaches equivalent precision + speed + lower cost',
    indicators: [
      'AI achieves comparable accuracy',
      'AI achieves faster processing',
      'AI cost is fraction of human cost',
      'No liability or trust barrier remains',
    ],
    examples: ['Basic legal review', 'Standard medical imaging analysis', 'Routine code review'],
  },
} as const;

// ============================================================================
// DEL II – TIME HORIZONS
// ============================================================================

export interface AutomationTimeline {
  roleId: string;
  
  // Three thresholds
  automationThreshold: TimelineEstimate;
  costCrossing: TimelineEstimate;
  organizationalAcceptance: TimelineEstimate;
  
  // Horizon classification
  horizon: '0-3_years' | '3-7_years' | '7-15_years' | '15+_years';
  
  // Modifiers
  delayFactors: string[];
  accelerationFactors: string[];
  
  // Confidence
  confidence: number;
  dataQuality: 'high' | 'medium' | 'low' | 'speculative';
}

export interface TimelineEstimate {
  estimatedYear: number;
  rangeMin: number;
  rangeMax: number;
  rationale: string;
}

export const TIMELINE_QUESTIONS = {
  delay: 'What would delay this?',
  accelerate: 'What would accelerate this?',
} as const;

export const COMMON_DELAY_FACTORS = [
  'Regulatory barriers',
  'Union resistance',
  'Liability uncertainty',
  'Technology immaturity',
  'High switching costs',
  'Customer preference for humans',
  'Trust requirements',
  'Fragmented industry structure',
];

export const COMMON_ACCELERATION_FACTORS = [
  'Labor cost increase',
  'Technology breakthrough',
  'Competitor adoption',
  'Regulatory approval',
  'Economic recession',
  'Quality improvement',
  'Integration standardization',
  'Generational workforce shift',
];

// ============================================================================
// DEL III – WHAT BECOMES VALUABLE
// ============================================================================

export interface FutureValueProfile {
  roleId: string;
  
  // Leverage criteria (must meet at least 2)
  leverageCriteria: {
    affectsSystemNotPoint: boolean;
    responsibleForConsequences: boolean;
    requiresDomainPlusSynthesis: boolean;
    requiresHumanTrust: boolean;
    ownsDecisionUnderUncertainty: boolean;
  };
  
  criteriaScore: number; // 0-5
  survivalProbability: 'high' | 'medium' | 'low';
  
  // Future role classification
  futureRoleClass?: FutureRoleClass;
}

export type FutureRoleClass = 
  | 'ai_orchestrator'
  | 'system_architect'
  | 'regulatory_tech'
  | 'consequence_owner'
  | 'trust_bearer'
  | 'synthesis_specialist';

export const FUTURE_ROLE_CLASSES = {
  ai_orchestrator: {
    id: 'ai_orchestrator',
    name: 'AI Orchestrator',
    description: 'Designs, monitors, and optimizes AI system performance',
    keySkills: ['System design', 'Performance optimization', 'Error handling', 'Multi-model coordination'],
  },
  
  system_architect: {
    id: 'system_architect',
    name: 'System Architect',
    description: 'Designs complex human-machine systems',
    keySkills: ['Systems thinking', 'Integration design', 'Trade-off analysis', 'Long-term planning'],
  },
  
  regulatory_tech: {
    id: 'regulatory_tech',
    name: 'Regulatory Technical Competence',
    description: 'Bridges technical capability with regulatory requirements',
    keySkills: ['Legal interpretation', 'Technical translation', 'Compliance design', 'Risk assessment'],
  },
  
  consequence_owner: {
    id: 'consequence_owner',
    name: 'Consequence Owner',
    description: 'Holds accountability for outcomes, not just processes',
    keySkills: ['Accountability', 'Decision under uncertainty', 'Stakeholder management', 'Crisis handling'],
  },
  
  trust_bearer: {
    id: 'trust_bearer',
    name: 'Trust Bearer',
    description: 'Roles where human trust is the core value proposition',
    keySkills: ['Relationship building', 'Empathy', 'Judgment', 'Discretion'],
  },
  
  synthesis_specialist: {
    id: 'synthesis_specialist',
    name: 'Synthesis Specialist',
    description: 'Combines domain expertise with cross-domain insight',
    keySkills: ['Cross-domain knowledge', 'Pattern recognition', 'Novel problem solving', 'Integration'],
  },
} as const;

// ============================================================================
// DEL IV – EDUCATION AS LIE DETECTOR
// ============================================================================

export interface EducationLaborMatch {
  educationTrackId: string;
  educationTrackName: string;
  country: string;
  
  // The three comparisons
  whatIsTaught: string[];
  whatIsDemanded: string[];
  whatIsPaid: PaymentReality[];
  
  // Mismatch analysis
  mismatchScore: number; // 0-100, higher = worse
  mismatchDirection: 'oversupply' | 'undersupply' | 'skill_mismatch' | 'timing_mismatch';
  
  // Warning flag
  decliningDemandWarning: boolean;
  warningText?: string;
  
  // Time to structural mismatch
  yearsToMismatch?: number;
}

export interface PaymentReality {
  role: string;
  medianSalary: number;
  salaryTrend: 'increasing' | 'stable' | 'decreasing';
  openPositions: number;
  positionsTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface GlobalEducationMismatch {
  countryCode: string;
  
  // Key metrics
  percentStudentsInDyingRoles: number;
  percentCapacityInGrowthRoles: number;
  yearsToStructuralMismatch: number;
  
  // Top mismatches
  topOverproducedTracks: string[];
  topUnderproducedTracks: string[];
  
  // Political sensitivity warning
  sensitivityLevel: 'low' | 'medium' | 'high' | 'explosive';
}

export const EDUCATION_WARNING_TEMPLATE = 
  'This education track leads to declining functional demand.';

// ============================================================================
// DEL V – INDIVIDUAL VIEW
// ============================================================================

export interface IndividualRiskProfile {
  userId?: string; // Optional for anonymous use
  
  // User inputs
  currentRole: string;
  skills: string[];
  region: string;
  yearsExperience: number;
  
  // Analysis outputs
  riskProfile: RiskClassification;
  timeline: IndividualTimeline;
  transitionOptions: TransitionOption[];
  notWorthTrying: string[]; // Explicit "don't bother" list
  
  // Metadata
  analysisDate: string;
  dataConfidence: number;
}

export type RiskClassification = 
  | 'low_risk'
  | 'moderate_risk'
  | 'high_risk'
  | 'critical_risk'
  | 'already_disrupted';

export interface IndividualTimeline {
  currentStateYears: number; // Years until significant disruption
  transitionWindowYears: number; // Window for proactive transition
  urgency: 'none' | 'low' | 'moderate' | 'high' | 'immediate';
}

export interface TransitionOption {
  targetRole: string;
  transitionDifficulty: 'easy' | 'moderate' | 'hard' | 'very_hard';
  estimatedTimeMonths: number;
  skillGaps: string[];
  marketDemand: 'declining' | 'stable' | 'growing' | 'surging';
  successProbability: number;
}

export const INDIVIDUAL_VIEW_PRINCIPLE = {
  noMotivation: true,
  noPep: true,
  onlyClarity: true,
  showWhatNotToTry: true,
} as const;

// ============================================================================
// DEL VI – ECONOMIC REALITY ENGINE
// ============================================================================

export interface EconomicImpactModel {
  countryCode: string;
  scenarioName: string;
  
  // Job disappearance inputs
  rolesDisappearing: RoleDisappearance[];
  
  // Economic impacts
  gdpImpact: GDPImpact;
  productivityImpact: ProductivityImpact;
  wageImpact: WageImpact;
  taxBaseImpact: TaxBaseImpact;
  
  // Summary statement
  impactSummary: string;
}

export interface RoleDisappearance {
  roleId: string;
  roleName: string;
  currentEmployment: number;
  disappearancePercent: number;
  timeframeYears: number;
}

export interface GDPImpact {
  currentContribution: number;
  projectedChange: number;
  confidenceInterval: [number, number];
}

export interface ProductivityImpact {
  currentProductivityPerWorker: number;
  projectedProductivityChange: number;
  redistributionEffect: string;
}

export interface WageImpact {
  affectedWorkers: number;
  averageWageChange: number;
  wageDistributionShift: 'compression' | 'polarization' | 'uplift';
}

export interface TaxBaseImpact {
  currentTaxFromAffectedRoles: number;
  projectedTaxChange: number;
  welfareImplication: string;
}

export const ECONOMIC_IMPACT_TEMPLATE = 
  'If these roles disappear, this is the impact on tax, welfare, stability.';

// ============================================================================
// DEL VII – "NO ONE CAN PRETEND" VIEW
// ============================================================================

export interface AccountabilityDashboard {
  entityType: 'politician' | 'company' | 'institution';
  entityId: string;
  entityName: string;
  
  // Decision → Effect → Outcome chain
  decisions: DecisionOutcomeChain[];
  
  // Ignorance → Cost analysis
  ignoranceCosts: IgnoranceCost[];
  
  // Inaction projection
  inactionProjection: InactionProjection;
}

export interface DecisionOutcomeChain {
  decisionId: string;
  decisionDescription: string;
  decisionDate: string;
  
  intendedEffect: string;
  observedEffect: string;
  
  measuredOutcome: string;
  outcomeAlignment: 'aligned' | 'partial' | 'divergent' | 'opposite' | 'unknown';
}

export interface IgnoranceCost {
  topicIgnored: string;
  periodIgnored: string;
  measuredCost: number;
  costUnit: string;
  counterfactual: string;
}

export interface InactionProjection {
  assumptionSetId: string;
  projectionPeriodYears: number;
  
  ifNothingChanges: string;
  confidenceLevel: number;
  
  keyRisks: string[];
  keyOpportunityMisses: string[];
}

export const ACCOUNTABILITY_LANGUAGE = {
  neverSay: 'You should do X',
  alwaysSay: 'If nothing changes, this happens.',
} as const;

// ============================================================================
// DEL VIII – VISUAL DESIGN PRINCIPLES
// ============================================================================

export const VISUAL_DESIGN_PRINCIPLES = {
  aesthetic: 'Telia / Avanza / Spotify-level',
  
  hardRules: [
    'No icons without function',
    'No colors without meaning',
    'No numbers without explanation',
  ],
  
  requirements: [
    'Everything is clickable',
    'Everything is traceable',
    'Everything is explained in layers',
  ],
  
  comprehensionTargets: {
    novice: '18-year-old must understand core message',
    expert: 'Expert must be able to drill to raw data',
    time: 'Core insight in <5 seconds',
  },
  
  colorSemantics: {
    risk: 'Red spectrum',
    opportunity: 'Green spectrum',
    neutral: 'Gray spectrum',
    uncertainty: 'Yellow/amber spectrum',
    data: 'Blue spectrum',
  },
} as const;

// ============================================================================
// DEL IX – AUTOMATED REPORTS
// ============================================================================

export const AUTOMATED_REPORT_TYPES = [
  {
    id: 'automation_threshold_annual',
    title: 'The jobs that crossed the automation threshold this year',
    frequency: 'annual',
    requiredSections: ['summary', 'role_list', 'methodology', 'uncertainty'],
  },
  {
    id: 'protected_roles_analysis',
    title: 'Roles still protected – and why',
    frequency: 'annual',
    requiredSections: ['summary', 'protection_factors', 'duration_estimates', 'uncertainty'],
  },
  {
    id: 'education_lag_report',
    title: 'Education lag vs labour reality',
    frequency: 'annual',
    requiredSections: ['summary', 'mismatch_map', 'country_rankings', 'projections', 'uncertainty'],
  },
  {
    id: 'economic_impact_quarterly',
    title: 'Quarterly labour market transformation impact',
    frequency: 'quarterly',
    requiredSections: ['summary', 'gdp_effects', 'tax_effects', 'regional_breakdown', 'uncertainty'],
  },
] as const;

export const REPORT_REQUIREMENTS = {
  mandatory: [
    'sources',
    'assumptions',
    'uncertainty',
    'methodology',
    'limitations',
  ],
  
  forbidden: [
    'recommendations',
    'value judgments',
    'predictions without uncertainty',
    'conclusions without data',
  ],
} as const;

// ============================================================================
// DEL X – ETHICAL PROTECTION
// ============================================================================

export const ETHICAL_PROTECTION = {
  mandatoryDisclaimer: 'This analysis shows functional viability – not human worth.',
  mandatoryDisclaimerLocal: 'Denna analys visar funktionell livsduglighet – inte mänskligt värde.',
  
  displayRequirements: [
    'Must appear on every individual risk assessment',
    'Must appear on every role death analysis',
    'Must appear on every economic impact projection',
  ],
  
  forbiddenFraming: [
    'Worthless jobs',
    'Useless workers',
    'Human obsolescence',
    'People who should be replaced',
  ],
  
  requiredFraming: [
    'Functional analysis',
    'Economic mechanics',
    'Structural change',
    'Role transformation',
  ],
  
  purpose: 'Prevent misuse for human devaluation or discrimination',
} as const;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function classifyDeathCategory(job: JobFunctionalAnalysis): DeathCategory | null {
  // Information transfer: primarily moving data
  const dataMovingTasks = job.tasks.filter(t => 
    t.description.toLowerCase().includes('transfer') ||
    t.description.toLowerCase().includes('copy') ||
    t.description.toLowerCase().includes('relay')
  );
  if (dataMovingTasks.length > job.tasks.length * 0.5) {
    return 'information_transfer';
  }
  
  // Low differentiation admin: compilation without synthesis
  const compilationTasks = job.tasks.filter(t =>
    t.description.toLowerCase().includes('compile') ||
    t.description.toLowerCase().includes('report') ||
    t.description.toLowerCase().includes('monitor')
  );
  if (compilationTasks.length > job.tasks.length * 0.5 && 
      job.tasks.every(t => t.humanDifferentiation < 0.3)) {
    return 'low_differentiation_admin';
  }
  
  // Reactive intermediary: responds but doesn't steer
  if (job.decisionFrequency === 'rare' && 
      job.tasks.every(t => t.humanDifferentiation < 0.4)) {
    return 'reactive_intermediary';
  }
  
  // Simulated competence: AI can match
  const avgAutomation = job.tasks.reduce((sum, t) => sum + t.automationPotential, 0) / job.tasks.length;
  if (avgAutomation > 0.8 && job.errorCost.machineErrorRate <= job.errorCost.humanErrorRate) {
    return 'simulated_competence';
  }
  
  return null;
}

export function calculateLeverageScore(profile: FutureValueProfile): number {
  const criteria = profile.leverageCriteria;
  let score = 0;
  
  if (criteria.affectsSystemNotPoint) score++;
  if (criteria.responsibleForConsequences) score++;
  if (criteria.requiresDomainPlusSynthesis) score++;
  if (criteria.requiresHumanTrust) score++;
  if (criteria.ownsDecisionUnderUncertainty) score++;
  
  return score;
}

export function assessSurvivalProbability(leverageScore: number): 'high' | 'medium' | 'low' {
  if (leverageScore >= 4) return 'high';
  if (leverageScore >= 2) return 'medium';
  return 'low';
}

export function calculateEducationMismatch(match: EducationLaborMatch): number {
  let score = 0;
  
  // Check taught vs demanded overlap
  const taughtSet = new Set(match.whatIsTaught.map(s => s.toLowerCase()));
  const demandedSet = new Set(match.whatIsDemanded.map(s => s.toLowerCase()));
  
  const overlap = [...taughtSet].filter(s => demandedSet.has(s)).length;
  const overlapRatio = overlap / Math.max(taughtSet.size, demandedSet.size);
  
  score += (1 - overlapRatio) * 50; // Up to 50 points for skill mismatch
  
  // Check payment reality
  const decliningPayment = match.whatIsPaid.filter(p => 
    p.salaryTrend === 'decreasing' || p.positionsTrend === 'decreasing'
  );
  score += (decliningPayment.length / match.whatIsPaid.length) * 50;
  
  return Math.min(100, score);
}

// ============================================================================
// EXPORT COMPLETE SYSTEM
// ============================================================================

export const LABOUR_FUTURE_INTELLIGENCE = {
  identity: SYSTEM_IDENTITY,
  deathCategories: DEATH_CATEGORIES,
  timelineQuestions: TIMELINE_QUESTIONS,
  futureRoleClasses: FUTURE_ROLE_CLASSES,
  educationWarning: EDUCATION_WARNING_TEMPLATE,
  individualPrinciple: INDIVIDUAL_VIEW_PRINCIPLE,
  economicTemplate: ECONOMIC_IMPACT_TEMPLATE,
  accountabilityLanguage: ACCOUNTABILITY_LANGUAGE,
  visualDesign: VISUAL_DESIGN_PRINCIPLES,
  reportTypes: AUTOMATED_REPORT_TYPES,
  reportRequirements: REPORT_REQUIREMENTS,
  ethicalProtection: ETHICAL_PROTECTION,
  
  // Analysis utilities
  analyze: {
    classifyDeathCategory,
    calculateLeverageScore,
    assessSurvivalProbability,
    calculateEducationMismatch,
  },
  
  // Common factors
  delayFactors: COMMON_DELAY_FACTORS,
  accelerationFactors: COMMON_ACCELERATION_FACTORS,
} as const;

console.log('[Labour Future Intelligence] System loaded');
console.log('[Labour Future Intelligence] Death categories:', Object.keys(DEATH_CATEGORIES).length);
console.log('[Labour Future Intelligence] Future role classes:', Object.keys(FUTURE_ROLE_CLASSES).length);
console.log('[Labour Future Intelligence] Report types:', AUTOMATED_REPORT_TYPES.length);
