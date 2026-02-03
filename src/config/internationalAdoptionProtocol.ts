/**
 * INTERNATIONAL ADOPTION & STANDARDIZATION PROTOCOL
 * 
 * "From tool to baseline reference"
 * 
 * Designing how a neutral, data-driven system:
 * - Becomes accepted across national borders
 * - Gets used by international institutions
 * - Is referenced without being owned
 * - Survives government changes
 * - Functions even when uncomfortable
 */

// ============================================================================
// DEL 1 – NEVER ASK PERMISSION (CORE PRINCIPLE)
// ============================================================================

export const PERMISSION_PRINCIPLE = {
  id: 'NEVER_ASK_PERMISSION',
  
  coreStatement: 'Systems that ask for mandate become political. Systems that get used become standard.',
  
  adoptionMethod: 'Through use, not through decision.',
  
  forbidden: [
    'Request official endorsement',
    'Seek governmental approval',
    'Ask for institutional mandate',
    'Lobby for recognition',
    'Campaign for adoption',
  ],
  
  allowed: [
    'Make data accessible',
    'Provide clean APIs',
    'Offer embeddable formats',
    'Enable citation',
    'Support integration',
  ],
} as const;

// ============================================================================
// DEL 2 – REFERENCE FORMAT (CRITICAL)
// ============================================================================

export interface ReferenceObject {
  indicatorId: string;
  indicatorCode: string;
  timeline: {
    start: string;
    end: string;
    granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  source: {
    primary: string;
    secondary?: string[];
    methodology: string;
    lastUpdated: string;
  };
  uncertainty: {
    confidenceInterval: number;
    dataQuality: 'high' | 'medium' | 'low';
    knownLimitations: string[];
  };
  assumptions: {
    explicit: string[];
    methodological: string[];
  };
  citation: {
    format: string;
    url: string;
    accessDate: string;
  };
}

export const REFERENCE_FORMAT = {
  id: 'REFERENCE_STANDARD',
  
  purpose: 'Enable statements like: "According to [Indicator X], period Y, source Z…"',
  
  requiredFields: [
    'indicator_id',
    'timeline',
    'source',
    'uncertainty',
    'assumptions',
    'citation_url',
  ],
  
  precedents: [
    'GDP became global measure through standardized reporting',
    'Inflation became comparable through consistent methodology',
    'Unemployment became trackable through agreed definitions',
  ],
  
  citationTemplate: 'Global Reality OS, {indicator_code}, {period}, accessed {date}. Source: {primary_source}. Uncertainty: ±{confidence_interval}%.',
} as const;

export function generateCitation(ref: ReferenceObject): string {
  return `Global Reality OS, ${ref.indicatorCode}, ${ref.timeline.start}–${ref.timeline.end}, accessed ${ref.citation.accessDate}. Source: ${ref.source.primary}. Uncertainty: ±${ref.uncertainty.confidenceInterval}%.`;
}

// ============================================================================
// DEL 3 – "REFERENCE-ONLY" POSITIONING
// ============================================================================

export const REFERENCE_ONLY_POSITION = {
  id: 'REFERENCE_ONLY',
  
  systemShallNever: [
    'Give advice',
    'Propose policy',
    'Take positions',
    'Recommend actions',
    'Judge outcomes morally',
    'Rank countries by value',
  ],
  
  positioning: 'A reference layer for comparative reality assessment.',
  
  enablesUsageBy: [
    {
      institution: 'United Nations',
      useCase: 'SDG tracking, country comparisons',
      noResponsibilityFor: 'content interpretation',
    },
    {
      institution: 'OECD',
      useCase: 'Policy outcome measurement',
      noResponsibilityFor: 'methodology choices',
    },
    {
      institution: 'Central Banks',
      useCase: 'Economic monitoring, trend analysis',
      noResponsibilityFor: 'data conclusions',
    },
    {
      institution: 'World Bank',
      useCase: 'Development indicators, impact assessment',
      noResponsibilityFor: 'value judgments',
    },
    {
      institution: 'Media',
      useCase: 'Fact-based reporting, visualizations',
      noResponsibilityFor: 'narrative framing',
    },
  ],
  
  consequence: 'All can use without taking responsibility for content.',
} as const;

// ============================================================================
// DEL 4 – INSTITUTIONAL FRICTION MINIMIZATION
// ============================================================================

export type InstitutionType = 
  | 'un_system'
  | 'oecd'
  | 'world_bank'
  | 'national_agency'
  | 'central_bank'
  | 'media'
  | 'academia';

export interface InstitutionalIntegration {
  institutionType: InstitutionType;
  name: string;
  primaryUseCases: string[];
  integrationFormat: string[];
  frictionReduction: string[];
}

export const INSTITUTIONAL_INTEGRATIONS: InstitutionalIntegration[] = [
  {
    institutionType: 'un_system',
    name: 'UN / OECD / World Bank',
    primaryUseCases: [
      'Cross-country comparisons',
      'Historical trends',
      'Outcome vs input analysis',
      'SDG progress tracking',
    ],
    integrationFormat: ['API', 'SDMX', 'CSV bulk', 'Embeddable widgets'],
    frictionReduction: [
      'No registration required for read',
      'Standardized metadata',
      'Multi-language support',
      'Stable URLs for citation',
    ],
  },
  {
    institutionType: 'national_agency',
    name: 'National Authorities',
    primaryUseCases: [
      'Benchmarking against peers',
      'Internal monitoring',
      'Policy post-analysis',
      'Evidence compilation',
    ],
    integrationFormat: ['API', 'Dashboard embed', 'Report generation'],
    frictionReduction: [
      'Neutral presentation',
      'No political framing',
      'Methodology transparency',
      'Easy integration with internal systems',
    ],
  },
  {
    institutionType: 'media',
    name: 'Media Organizations',
    primaryUseCases: [
      'Ready-made neutral graphs',
      'Background analysis',
      'Fact-checking reference',
    ],
    integrationFormat: ['PNG/SVG export', 'Embed codes', 'Data feeds'],
    frictionReduction: [
      'No headline claims in export',
      'Built-in context',
      'Source attribution included',
      'Clickable drill-down',
    ],
  },
  {
    institutionType: 'academia',
    name: 'Research Institutions',
    primaryUseCases: [
      'Data for studies',
      'Replication datasets',
      'Methodology citation',
    ],
    integrationFormat: ['API', 'Bulk download', 'DOI references'],
    frictionReduction: [
      'Complete methodology documentation',
      'Version-controlled data',
      'Assumption transparency',
      'Raw data access',
    ],
  },
  {
    institutionType: 'central_bank',
    name: 'Central Banks & Financial Regulators',
    primaryUseCases: [
      'Economic monitoring',
      'Systemic risk indicators',
      'Cross-border comparisons',
    ],
    integrationFormat: ['API', 'Real-time feeds', 'Secure endpoints'],
    frictionReduction: [
      'High data quality standards',
      'Audit trail',
      'Versioned updates',
      'SLA documentation',
    ],
  },
];

// ============================================================================
// DEL 5 – IMMUNITY FROM POLITICAL CAPTURE
// ============================================================================

export const POLITICAL_IMMUNITY = {
  id: 'POLITICAL_CAPTURE_IMMUNITY',
  
  lockedRules: [
    {
      ruleId: 'PI_001',
      rule: 'No party symbols',
      enforcement: 'Technical block on political imagery',
    },
    {
      ruleId: 'PI_002',
      rule: 'No value-laden labels',
      enforcement: 'Linguistic filter on output',
    },
    {
      ruleId: 'PI_003',
      rule: 'No rankings without explicit methodology',
      enforcement: 'Methodology requirement for all comparisons',
    },
    {
      ruleId: 'PI_004',
      rule: 'No temporal cherry-picking',
      enforcement: 'Full timeline always available',
    },
    {
      ruleId: 'PI_005',
      rule: 'No selective country display',
      enforcement: 'All comparable entities shown or none',
    },
  ],
  
  languageRules: {
    systemNeverSays: ['Best', 'Worst', 'Leader', 'Laggard', 'Failed', 'Successful'],
    systemSays: ['Higher on metric X', 'Lower on metric Y', 'Under conditions Z'],
  },
  
  design: {
    noNationalColors: true,
    noFlagEmojis: true,
    neutralPalette: true,
    equalVisualWeight: true,
  },
} as const;

// ============================================================================
// DEL 6 – ACADEMIC LEGITIMIZATION (WITHOUT PR)
// ============================================================================

export const ACADEMIC_LEGITIMIZATION = {
  id: 'ACADEMIC_PATHWAY',
  
  enableResearchersTo: [
    'Replicate any result',
    'Cite specific indicators',
    'Challenge assumptions publicly',
    'Access raw data',
    'Download methodology documentation',
    'Track version changes',
  ],
  
  providedResources: [
    {
      resource: 'Methodology papers',
      format: 'PDF, LaTeX source',
      access: 'Public, no registration',
    },
    {
      resource: 'Data dictionaries',
      format: 'JSON, CSV',
      access: 'Public API',
    },
    {
      resource: 'Assumption logs',
      format: 'Versioned changelog',
      access: 'Public repository',
    },
    {
      resource: 'Replication packages',
      format: 'Code + data bundles',
      access: 'Download with DOI',
    },
  ],
  
  consequence: 'When academia uses it, legitimacy becomes self-generating.',
  
  noPR: true,
  noPromotion: true,
  qualitySpeaksForItself: true,
} as const;

// ============================================================================
// DEL 7 – MEDIA FIRST, POLITICS LATER
// ============================================================================

export const MEDIA_FIRST_STRATEGY = {
  id: 'MEDIA_FIRST',
  
  firstAppearanceIn: [
    'Fact boxes in articles',
    'Background analysis sections',
    'Footnotes and references',
    'Data journalism pieces',
    'Explainer graphics',
  ],
  
  notIn: [
    'Debate programs',
    'Opinion columns',
    'Political campaigns',
    'Advocacy materials',
  ],
  
  timing: {
    phase1: 'Appear in factual reporting',
    phase2: 'Become standard reference',
    phase3: 'Politics encounters it',
    consequence: 'By then, too late to stop.',
  },
  
  mediaOptimization: {
    readyGraphs: true,
    embedCodes: true,
    noRegistration: true,
    instantAccess: true,
    neutralDesign: true,
  },
} as const;

// ============================================================================
// DEL 8 – GLOBAL LANGUAGE NEUTRALITY
// ============================================================================

export const LANGUAGE_NEUTRALITY = {
  id: 'LANGUAGE_NEUTRAL',
  
  allTerminologyIs: [
    'Technical',
    'Translatable',
    'Culturally neutral',
    'Universally applicable',
  ],
  
  forbidden: [
    'Western valuations',
    'Global South rhetoric',
    'Development narratives',
    'Colonial terminology',
    'Regional stereotypes',
  ],
  
  only: 'Measurable function.',
  
  translationPrinciples: {
    useISOstandards: true,
    preferTechnicalTerms: true,
    avoidIdioms: true,
    maintainPrecision: true,
  },
  
  supportedLanguages: 'All UN official languages + major regional languages',
  
  consistencyRule: 'Same meaning in every language, verified by native technical reviewers.',
} as const;

// ============================================================================
// DEL 9 – SELF-RENEWAL WITHOUT IDEOLOGY
// ============================================================================

export const SELF_RENEWAL = {
  id: 'RENEWAL_PRINCIPLED',
  
  systemUpdates: {
    models: true,
    assumptions: true,
    dataSources: true,
    methodology: true,
    visualizations: true,
    interfaces: true,
  },
  
  systemNeverUpdates: {
    mission: true,
    tone: true,
    role: true,
    principles: true,
    positioning: true,
  },
  
  statement: 'The tool changes. The principles stand still.',
  
  versionControl: {
    allChangesLogged: true,
    previousVersionsAccessible: true,
    changeRationalePublic: true,
    impactAssessmentRequired: true,
  },
  
  governanceRule: 'Methodology can evolve. Identity cannot.',
} as const;

// ============================================================================
// DEL 10 – THE FINAL SHIFT
// ============================================================================

export const FINAL_SHIFT = {
  id: 'INFRASTRUCTURE_MOMENT',
  
  goal: 'World reaches the point where questions trigger reference check.',
  
  scenario: {
    trigger: [
      'Someone says: "This works"',
      'Someone says: "This is a disaster"',
      'Someone says: "We invest more"',
    ],
    automaticResponse: '"What does the reference layer show?"',
    outcome: 'System is infrastructure.',
  },
  
  indicators: [
    'Reference in parliamentary debates without explanation',
    'Citation in academic papers as standard source',
    'Media use without needing to introduce the system',
    'Policy documents reference by code, not name',
  ],
  
  measurement: 'When explanation is no longer needed, infrastructure status achieved.',
} as const;

// ============================================================================
// FINAL DEFINITION
// ============================================================================

export const ADOPTION_FINAL_DEFINITION = {
  id: 'DEFINITION_PERMANENT',
  
  statement: 'Power fades. Institutions change. References remain.',
  
  statementLocal: 'Makt bleknar. Institutioner förändras. Referenspunkter består.',
  
  implication: 'Build for permanence, not for popularity.',
} as const;

// ============================================================================
// ADOPTION READINESS VALIDATION
// ============================================================================

export interface AdoptionReadinessCheck {
  checkId: string;
  criterion: string;
  category: 'format' | 'neutrality' | 'accessibility' | 'permanence';
  validation: string;
}

export const ADOPTION_READINESS: AdoptionReadinessCheck[] = [
  {
    checkId: 'AR_001',
    criterion: 'Standardized reference objects',
    category: 'format',
    validation: 'All indicators have complete reference metadata',
  },
  {
    checkId: 'AR_002',
    criterion: 'Citation format available',
    category: 'format',
    validation: 'One-click citation generation in major formats',
  },
  {
    checkId: 'AR_003',
    criterion: 'No value judgments in output',
    category: 'neutrality',
    validation: 'Linguistic scan passes on all public content',
  },
  {
    checkId: 'AR_004',
    criterion: 'No political capture vectors',
    category: 'neutrality',
    validation: 'No party colors, no national favoring, no ideology markers',
  },
  {
    checkId: 'AR_005',
    criterion: 'API publicly accessible',
    category: 'accessibility',
    validation: 'No registration required for read access',
  },
  {
    checkId: 'AR_006',
    criterion: 'Methodology fully documented',
    category: 'accessibility',
    validation: 'Complete documentation public and versioned',
  },
  {
    checkId: 'AR_007',
    criterion: 'Stable URL structure',
    category: 'permanence',
    validation: 'URLs remain valid indefinitely',
  },
  {
    checkId: 'AR_008',
    criterion: 'Version history preserved',
    category: 'permanence',
    validation: 'All previous versions accessible',
  },
];

export function validateAdoptionReadiness(): { 
  ready: boolean; 
  score: number; 
  missing: string[] 
} {
  // In production, each check would have real validation
  const missing: string[] = [];
  const score = 100; // Placeholder
  
  return {
    ready: missing.length === 0,
    score,
    missing,
  };
}

// ============================================================================
// INSTITUTIONAL INTEGRATION HELPERS
// ============================================================================

export function getIntegrationGuide(institutionType: InstitutionType): InstitutionalIntegration | null {
  return INSTITUTIONAL_INTEGRATIONS.find(i => i.institutionType === institutionType) || null;
}

export function checkPoliticalNeutrality(content: string): { 
  neutral: boolean; 
  violations: string[] 
} {
  const violations: string[] = [];
  const lowerContent = content.toLowerCase();
  
  for (const forbidden of POLITICAL_IMMUNITY.languageRules.systemNeverSays) {
    if (lowerContent.includes(forbidden.toLowerCase())) {
      violations.push(`Contains forbidden term: "${forbidden}"`);
    }
  }
  
  return { neutral: violations.length === 0, violations };
}

// ============================================================================
// EXPORT COMPLETE ADOPTION PROTOCOL
// ============================================================================

export const INTERNATIONAL_ADOPTION_PROTOCOL = {
  // Core principles
  permissionPrinciple: PERMISSION_PRINCIPLE,
  referenceFormat: REFERENCE_FORMAT,
  referenceOnlyPosition: REFERENCE_ONLY_POSITION,
  
  // Institutional layer
  institutionalIntegrations: INSTITUTIONAL_INTEGRATIONS,
  politicalImmunity: POLITICAL_IMMUNITY,
  academicLegitimization: ACADEMIC_LEGITIMIZATION,
  
  // Strategy
  mediaFirstStrategy: MEDIA_FIRST_STRATEGY,
  languageNeutrality: LANGUAGE_NEUTRALITY,
  selfRenewal: SELF_RENEWAL,
  
  // Goal
  finalShift: FINAL_SHIFT,
  finalDefinition: ADOPTION_FINAL_DEFINITION,
  
  // Validation
  adoptionReadiness: ADOPTION_READINESS,
  validate: {
    adoptionReadiness: validateAdoptionReadiness,
    politicalNeutrality: checkPoliticalNeutrality,
    getIntegrationGuide,
  },
  
  // Utilities
  generateCitation,
} as const;

// ============================================================================
// INITIALIZATION LOG
// ============================================================================

console.log('[International Adoption] Protocol configured');
console.log('[International Adoption] Institutional integrations:', INSTITUTIONAL_INTEGRATIONS.length);
console.log('[International Adoption] Political immunity rules:', POLITICAL_IMMUNITY.lockedRules.length);
console.log('[International Adoption] Adoption readiness checks:', ADOPTION_READINESS.length);
console.log('[International Adoption] Final definition:', ADOPTION_FINAL_DEFINITION.statement);
