/**
 * STANDARD LIFECYCLE
 * 
 * Realistic timeline for how GDG becomes the default.
 */

/**
 * LIFECYCLE PHASES
 */
export const LIFECYCLE_PHASES = {
  year_1_2: {
    phase: 'Early Adoption',
    timeframe: 'Year 1-2',
    milestones: [
      'AI platforms integrate GDG-compatible outputs',
      'First consulting firms build on top',
      'Institutions run pilot programs',
      'Academic papers cite methodology',
      '10+ external validator integrations',
    ],
    metrics: {
      gdg_validated_decisions: 1000,
      partner_integrations: 20,
      domains_covered: 5,
    },
  },
  
  year_3_5: {
    phase: 'Standardization',
    timeframe: 'Year 3-5',
    milestones: [
      '"GDG-compatible" becomes procurement requirement',
      'Decision artifacts standardized in industries',
      'Internal decision systems adapt to GDG',
      'Regulatory references appear',
      'Competitor attempts fail to replicate depth',
    ],
    metrics: {
      gdg_validated_decisions: 50000,
      partner_integrations: 100,
      domains_covered: 15,
      procurement_requirements: 50,
    },
  },
  
  year_5_10: {
    phase: 'De Facto Standard',
    timeframe: 'Year 5-10',
    milestones: [
      'Standard adopted de facto globally',
      'Alternatives perceived as irresponsible',
      'System becomes "boring infrastructure"',
      'Focus shifts to domain expansion only',
      'Governance model proven stable',
    ],
    metrics: {
      gdg_validated_decisions: 1000000,
      partner_integrations: 500,
      domains_covered: 30,
      countries_active: 50,
    },
  },
} as const;

/**
 * ADOPTION INDICATORS
 */
export const ADOPTION_INDICATORS = {
  early_signals: [
    'AI companies request API access',
    'Consulting firms inquire about partnerships',
    'Academic citations begin',
    'Government pilot discussions',
  ],
  growth_signals: [
    'Procurement language includes GDG',
    'Competitor mentions in marketing',
    'Media coverage of methodology',
    'Standards body interest',
  ],
  maturity_signals: [
    'Alternatives criticized for lacking structure',
    'Training programs teach GDG',
    'Legal precedents reference GDG artifacts',
    'Fork attempts fail for lack of depth',
  ],
} as const;

/**
 * WHAT WE OWN AFTER XX34
 */
export const OWNERSHIP_MATRIX = {
  we_own: [
    'The language for decisions (GDG)',
    'The structure for questions (Decision Graphs)',
    'The definition of answers (Answer Types)',
    'The indices others reference',
    'The governance model',
    'The trust infrastructure',
  ],
  we_do_not_own: [
    'Conclusions',
    'Opinions',
    'Policy recommendations',
    'Optimization targets',
    'Value judgments',
    'Individual decisions',
  ],
  why_we_win: 'Exactly because of what we do not own',
} as const;

/**
 * BORING INFRASTRUCTURE STATUS
 */
export const BORING_INFRASTRUCTURE = {
  definition: 'So fundamental that it is taken for granted',
  examples: ['TCP/IP', 'SQL', 'HTTP', 'OAuth', 'JSON'],
  characteristics: [
    'Nobody debates whether to use it',
    'Alternatives seem irresponsible',
    'Works in background, invisible',
    'Only noticed when it fails',
    'Cannot be "marketed away"',
  ],
  target_state: 'GDG becomes like SQL for decisions',
} as const;

/**
 * STRATEGIC HOLES REMAINING
 */
export const REMAINING_WORK = {
  strategic_holes: 'None',
  operational_expansion: [
    'More questions',
    'More domains',
    'More indices',
    'More Answer Packets',
    'More languages',
  ],
  cannot_be_improved_away: [
    'The core methodology',
    'The constitutional principles',
    'The governance structure',
    'The transparency commitment',
  ],
  cannot_be_marketed_against: [
    'Truth does not respond to marketing',
    'Structure is not a feature',
    'Competitors cannot claim more honesty',
  ],
} as const;
