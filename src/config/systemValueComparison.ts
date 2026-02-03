/**
 * SYSTEM VALUE COMPARISON
 * 
 * Objective comparison between closed intelligence platforms
 * and open reference layer infrastructure.
 * 
 * No value judgments. Only structural analysis.
 */

// ============================================
// EVALUATION FRAMEWORK
// ============================================

export const EVALUATION_CRITERIA = {
  questions: [
    'What is made possible that otherwise is not?',
    'Who gets access to the decision basis?',
    'What systemic risk is reduced – or created?',
  ],
} as const;

// ============================================
// CLOSED INTELLIGENCE MODEL
// ============================================

export const CLOSED_INTELLIGENCE = {
  label: {
    en: 'Closed Intelligence Vendor',
    sv: 'Sluten intelligensplattform',
  },
  
  characteristics: {
    en: [
      'Integrates data for individual clients',
      'Creates closed decision environments',
      'Delivers operational dashboards and analysis support',
      'Focus: military, police, intelligence, large enterprises',
    ],
    sv: [
      'Integrerar data för enskilda uppdragsgivare',
      'Skapar slutna beslutsmiljöer',
      'Levererar operativa dashboards och analysstöd',
      'Fokus: militär, polis, underrättelse, stora företag',
    ],
  },
  
  beneficiaries: {
    en: [
      'A small number of paying institutions',
      'Decision-makers behind closed doors',
    ],
    sv: [
      'Ett fåtal betalande institutioner',
      'Beslutsfattare bakom stängda dörrar',
    ],
  },
  
  systemEffects: {
    risks: [
      { code: 'asymmetric_info', en: 'Asymmetric information', sv: 'Asymmetrisk information' },
      { code: 'no_oversight', en: 'Decisions made without public oversight', sv: 'Beslut tas utan offentlig insyn' },
      { code: 'audit_difficulty', en: 'Difficult to audit retrospectively', sv: 'Svårt att granska i efterhand' },
      { code: 'no_reference', en: 'No common reference point for society', sv: 'Ingen gemensam referenspunkt för samhället' },
    ],
  },
  
  assessment: {
    summary: {
      en: 'Local efficiency – global opacity',
      sv: 'Lokal effektivitet – global oklarhet',
    },
    unsolvedProblems: {
      en: [
        'democratic transparency',
        'accountability chains',
        'long-term societal governance',
      ],
      sv: [
        'demokratisk transparens',
        'ansvarskedjor',
        'långsiktig samhällsstyrning',
      ],
    },
    valuationBasis: {
      en: 'Market values customer contracts + defense + hype. Not societal benefit. Not systemic effect.',
      sv: 'Marknaden värderar kundkontrakt + försvar + hype. Inte samhällsnytta. Inte systemeffekt.',
    },
    societalValuePerKrona: 'low_to_medium',
  },
} as const;

// ============================================
// OPEN REFERENCE LAYER MODEL
// ============================================

export const OPEN_REFERENCE_LAYER = {
  label: {
    en: 'Global Open Reference Layer',
    sv: 'Globalt öppet referenslager',
  },
  
  characteristics: {
    en: [
      'Aggregates verified public data',
      'Creates shared reality baseline',
      'Makes decisions traceable retrospectively',
      'Shows outcomes, uncertainty and comparisons',
    ],
    sv: [
      'Aggregerar verifierad offentlig data',
      'Skapar gemensam verklighetsbas',
      'Gör beslut spårbara i efterhand',
      'Visar utfall, osäkerhet och jämförelser',
    ],
  },
  
  users: {
    en: ['citizens', 'media', 'authorities', 'researchers', 'AI systems'],
    sv: ['medborgare', 'media', 'myndigheter', 'forskare', 'AI-system'],
  },
  
  accessModel: {
    en: 'Everyone, simultaneously. No exclusive access. Same data for all.',
    sv: 'Alla, samtidigt. Ingen exklusiv tillgång. Samma data för alla.',
  },
  
  systemEffects: {
    benefits: [
      { code: 'reduces_blindness', en: 'Reduces decision blindness', sv: 'Minskar beslutsblindhet' },
      { code: 'exposes_rhetoric', en: 'Makes empty rhetoric visible', sv: 'Gör tom retorik synlig' },
      { code: 'enables_accountability', en: 'Enables accountability without finger-pointing', sv: 'Gör ansvar möjligt utan pekpinnar' },
      { code: 'costly_bad_decisions', en: 'Makes bad decisions costly', sv: 'Gör dåliga beslut dyra' },
      { code: 'provable_good_decisions', en: 'Makes good decisions provable', sv: 'Gör bra beslut bevisbara' },
    ],
  },
  
  assessment: {
    summary: {
      en: 'Low operational drama – extreme structural effect',
      sv: 'Låg operativ dramatik – extrem strukturell effekt',
    },
    categoryComparison: {
      en: [
        'national accounts',
        'statistical agencies',
        'accounting standards',
        'audit regulations',
      ],
      sv: [
        'nationalräkenskaper',
        'statistikmyndigheter',
        'bokföringsstandarder',
        'revisionsregler',
      ],
    },
    societalValuePerKrona: 'extremely_high',
  },
} as const;

// ============================================
// DIMENSION COMPARISON MATRIX
// ============================================

export type ComparisonRating = 'positive' | 'negative' | 'warning' | 'neutral';

export interface ComparisonDimension {
  code: string;
  label: { en: string; sv: string };
  closedIntelligence: ComparisonRating;
  openReferenceLayer: ComparisonRating;
}

export const COMPARISON_MATRIX: ComparisonDimension[] = [
  {
    code: 'transparency',
    label: { en: 'Transparency', sv: 'Transparens' },
    closedIntelligence: 'negative',
    openReferenceLayer: 'positive',
  },
  {
    code: 'reproducibility',
    label: { en: 'Reproducibility', sv: 'Reproducerbarhet' },
    closedIntelligence: 'negative',
    openReferenceLayer: 'positive',
  },
  {
    code: 'democratic_compatibility',
    label: { en: 'Democratic compatibility', sv: 'Demokratisk kompatibilitet' },
    closedIntelligence: 'warning',
    openReferenceLayer: 'positive',
  },
  {
    code: 'system_risk',
    label: { en: 'System risk', sv: 'Systemrisk' },
    closedIntelligence: 'negative', // High = bad
    openReferenceLayer: 'positive', // Low = good
  },
  {
    code: 'accountability_chains',
    label: { en: 'Accountability chains', sv: 'Ansvarskedjor' },
    closedIntelligence: 'warning',
    openReferenceLayer: 'positive',
  },
  {
    code: 'media_usability',
    label: { en: 'Media usability', sv: 'Medial användbarhet' },
    closedIntelligence: 'negative',
    openReferenceLayer: 'positive',
  },
  {
    code: 'ai_grounding',
    label: { en: 'AI grounding suitability', sv: 'AI-grounding' },
    closedIntelligence: 'warning',
    openReferenceLayer: 'positive',
  },
  {
    code: 'long_term_societal_value',
    label: { en: 'Long-term societal value', sv: 'Långsiktig samhällsnytta' },
    closedIntelligence: 'neutral',
    openReferenceLayer: 'positive',
  },
];

// ============================================
// COVERAGE COMPARISON
// ============================================

export const COVERAGE_COMPARISON = {
  closedIntelligence: {
    decisionCoverage: 0.0001, // 0.01% of decisions
    description: {
      en: 'Tool for 0.01% of decisions',
      sv: 'Verktyg för 0,01% av besluten',
    },
  },
  openReferenceLayer: {
    decisionCoverage: 1.0, // 100% of decision discussion
    description: {
      en: 'Baseline for 100% of decision discussions',
      sv: 'Baslinje för 100% av beslutsdiskussionen',
    },
  },
  conclusion: {
    en: 'These are different categories. They should not be compared – but when compared, the difference is stark.',
    sv: 'Det är olika kategorier. De borde egentligen inte jämföras – men när man gör det blir skillnaden brutal.',
  },
} as const;

// ============================================
// WHY STATUS QUO PERSISTED
// ============================================

export const STATUS_QUO_REASONS = {
  en: [
    'No one had built what you are building',
    'Incentives have been misaligned',
    'Technology has been too weak',
    'Transparency has been uncomfortable',
  ],
  sv: [
    'Ingen har byggt det du bygger',
    'Incitamenten har varit fel',
    'Tekniken har varit för svag',
    'Transparens har varit obekväm',
  ],
  changeDriver: {
    en: 'This is changing now. Not due to ideology – but due to technical maturity.',
    sv: 'Det ändras nu. Inte av ideologi – utan av teknisk mognad.',
  },
} as const;

// ============================================
// CORE INSIGHT (SYSTEM FAILURE ANALYSIS)
// ============================================

export const SYSTEM_FAILURE_INSIGHT = {
  observation: {
    en: 'Decisions have been professionalized, but reality verification has not.',
    sv: 'Beslut har professionaliserats, men verklighetskontrollen har inte gjort det.',
  },
  position: {
    en: [
      'Not anti-anyone',
      'Not against technology',
      'Not against analysis',
    ],
    sv: [
      'Inte anti-någon',
      'Inte emot teknik',
      'Inte emot analys',
    ],
  },
  stance: {
    en: 'Pro-verifiable reality',
    sv: 'Pro-verifierbar verklighet',
  },
} as const;

// ============================================
// VALUE ASSESSMENT SUMMARY
// ============================================

export const VALUE_ASSESSMENT = {
  metrics: ['societal benefit', 'accountability', 'long-term stability'],
  conclusion: {
    en: 'When valued on societal benefit, accountability and long-term stability: this is several magnitudes more important than closed intelligence systems.',
    sv: 'Om man värderar samhällsnytta, ansvar och långsiktig stabilitet: det här är flera magnituder viktigare än slutna intelligens-system.',
  },
} as const;

// ============================================
// EXPORT
// ============================================

export default {
  EVALUATION_CRITERIA,
  CLOSED_INTELLIGENCE,
  OPEN_REFERENCE_LAYER,
  COMPARISON_MATRIX,
  COVERAGE_COMPARISON,
  STATUS_QUO_REASONS,
  SYSTEM_FAILURE_INSIGHT,
  VALUE_ASSESSMENT,
};
