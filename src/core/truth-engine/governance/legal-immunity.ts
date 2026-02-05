/**
 * LEGAL IMMUNITY THROUGH DESIGN
 * 
 * We minimize risk not through agreements — but through architecture.
 * We are infrastructure, not an actor.
 */

/**
 * WHAT THE SYSTEM NEVER DOES (ARCHITECTURAL BLOCKS)
 */
export const NEVER_DOES = {
  no_advice: {
    description: 'Never provides recommendations or advice',
    implementation: 'Forbidden pattern detection in all outputs',
    legal_benefit: 'No duty of care for advice not given',
  },
  no_decisions: {
    description: 'Never makes decisions for users',
    implementation: 'Output is always questions + data, never conclusions',
    legal_benefit: 'No liability for decisions not made',
  },
  no_individual_profiling: {
    description: 'Never profiles individuals',
    implementation: 'All data is population-level aggregates',
    legal_benefit: 'GDPR/privacy compliance by design',
  },
  no_goal_optimization: {
    description: 'Never optimizes toward any goal',
    implementation: 'No optimization functions, only observation',
    legal_benefit: 'No liability for optimizing wrong goals',
  },
  no_hidden_assumptions: {
    description: 'Never hides assumptions',
    implementation: 'Mandatory assumption declaration',
    legal_benefit: 'No misrepresentation claims',
  },
  no_certainty_claims: {
    description: 'Never claims certainty',
    implementation: 'Confidence intervals required on all outputs',
    legal_benefit: 'No liability for uncertain events',
  },
} as const;

/**
 * LEGAL POSITIONING
 */
export const LEGAL_POSITION = {
  classification: 'Observational decision-support infrastructure',
  NOT_classified_as: [
    'Financial advisor',
    'Medical diagnostic tool',
    'Legal advisor',
    'AI decision-maker',
    'Predictive system',
  ],
  jurisdictional_strategy: {
    primary: 'EU (Sweden)',
    secondary: ['Switzerland', 'Singapore'],
    reason: 'Decentralized operations across multiple legal frameworks',
  },
} as const;

/**
 * RISK MITIGATION MATRIX
 */
export const RISK_MITIGATION = {
  regulatory_risk: {
    risk: 'Regulatory action against AI/data systems',
    mitigation: 'We observe and structure, never advise or predict',
    residual_risk: 'low',
  },
  liability_risk: {
    risk: 'Lawsuits from users who relied on outputs',
    mitigation: 'Clear disclaimers, no recommendations, user makes all decisions',
    residual_risk: 'low',
  },
  data_risk: {
    risk: 'Data accuracy claims',
    mitigation: 'All data sourced from official sources, full lineage shown',
    residual_risk: 'medium',
  },
  political_risk: {
    risk: 'Being seen as political actor',
    mitigation: 'No opinions, no rankings, no conclusions',
    residual_risk: 'low',
  },
  capture_risk: {
    risk: 'External capture or pressure',
    mitigation: 'Nuclear option, public governance log, Standards Council',
    residual_risk: 'low',
  },
} as const;

/**
 * MANDATORY DISCLAIMERS
 */
export const MANDATORY_DISCLAIMERS = {
  general: `
This system provides observational data and structured questions.
It does not provide advice, recommendations, or conclusions.
All decisions are made by the user. The system accepts no liability
for decisions made based on information presented.
`.trim(),

  financial: `
This is not financial advice. The system does not recommend any
investment, divestment, or financial action. Consult a qualified
financial advisor before making financial decisions.
`.trim(),

  healthcare: `
This is not medical advice. The system presents population-level
health statistics only. Consult a healthcare professional for
individual medical decisions.
`.trim(),

  policy: `
This system does not evaluate policy effectiveness or recommend
policy actions. It presents observational data only. Policy
decisions require human judgment and democratic processes.
`.trim(),
} as const;

/**
 * LIABILITY SHIELD COMPONENTS
 */
export const LIABILITY_SHIELD = {
  design_level: [
    'No advice architecture',
    'Mandatory uncertainty display',
    'Assumption transparency',
    'Population-only data',
  ],
  documentation_level: [
    'Clear disclaimers',
    'Terms of service',
    'Methodology documentation',
    'Limitation statements',
  ],
  operational_level: [
    'Audit trail for all outputs',
    'Version control for methodologies',
    'Public governance log',
    'Dissent publication',
  ],
} as const;

/**
 * REGULATORY COMPATIBILITY
 */
export const REGULATORY_COMPATIBILITY = {
  EU_AI_Act: {
    status: 'Compliant by design',
    reason: 'Not a decision-making AI, provides infrastructure only',
    risk_category: 'Minimal risk',
  },
  GDPR: {
    status: 'Compliant by design',
    reason: 'No individual data, population aggregates only',
    requirements_met: ['No profiling', 'No automated decisions', 'Transparency'],
  },
  Financial_Regulations: {
    status: 'Not applicable',
    reason: 'Not financial advice, not a financial product',
    explicit_carveout: 'Infrastructure provider only',
  },
} as const;
