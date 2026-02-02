/**
 * Evidence Requirement System
 * 
 * The legitimacy framework for claims and decisions.
 * "If you claim an action will improve an outcome, show the evidence report."
 * 
 * Part of the Truth Layer governance infrastructure.
 */

// ============================================================================
// 1. LEGITIMACY LEVELS
// ============================================================================

export type LegitimacyLevel = 'none' | 'unsupported' | 'supported';

export interface LegitimacyLevelDefinition {
  level: LegitimacyLevel;
  code: number;
  label: string;
  labelLocal: Record<string, string>;
  description: string;
  descriptionLocal: Record<string, string>;
  indicators: string[];
  indicatorsLocal: Record<string, string[]>;
  verdict: string;
  verdictLocal: Record<string, string>;
  color: string;
}

export const LEGITIMACY_LEVELS: Record<LegitimacyLevel, LegitimacyLevelDefinition> = {
  none: {
    level: 'none',
    code: 0,
    label: 'No Report',
    labelLocal: { sv: 'Ingen rapport' },
    description: 'No evidence report exists to support the claim.',
    descriptionLocal: { sv: 'Ingen evidensrapport finns som stödjer påståendet.' },
    indicators: [
      'Claims without data',
      'Feelings and intuition',
      'Ideology',
      'Rhetoric'
    ],
    indicatorsLocal: {
      sv: [
        'Påståenden utan data',
        'Känslor och intuition',
        'Ideologi',
        'Retorik'
      ]
    },
    verdict: 'No legitimacy',
    verdictLocal: { sv: 'Ingen legitimitet' },
    color: 'destructive'
  },
  unsupported: {
    level: 'unsupported',
    code: 1,
    label: 'Report Exists, No Support',
    labelLocal: { sv: 'Rapport finns, inget stöd' },
    description: 'Evidence report exists but does not support the claim.',
    descriptionLocal: { sv: 'Evidensrapport finns men stödjer inte påståendet.' },
    indicators: [
      'Data is irrelevant',
      'Correlation is missing',
      'Effect is unclear'
    ],
    indicatorsLocal: {
      sv: [
        'Datan är irrelevant',
        'Samband saknas',
        'Effekten är oklar'
      ]
    },
    verdict: 'Decision is a choice, not evidence-based',
    verdictLocal: { sv: 'Beslutet är ett val – inte evidensbaserat' },
    color: 'warning'
  },
  supported: {
    level: 'supported',
    code: 2,
    label: 'Report Shows Support',
    labelLocal: { sv: 'Rapport visar stöd' },
    description: 'Evidence report provides measurable support for the claim.',
    descriptionLocal: { sv: 'Evidensrapport ger mätbart stöd för påståendet.' },
    indicators: [
      'Clear baseline',
      'Relevant correlations',
      'Reasonable uncertainty',
      'Limitations disclosed'
    ],
    indicatorsLocal: {
      sv: [
        'Tydligt nuläge',
        'Relevanta samband',
        'Rimlig osäkerhet',
        'Begränsningar redovisade'
      ]
    },
    verdict: 'Clean record - responsibility begins here',
    verdictLocal: { sv: '"Rent mjöl i påsen" – ansvar börjar här' },
    color: 'primary'
  }
};

// ============================================================================
// 2. EVIDENCE REPORT STRUCTURE
// ============================================================================

export interface EvidenceReport {
  id: string;
  reportCode: string; // e.g., "GL-2026-00417"
  title: string;
  titleLocal?: Record<string, string>;
  
  // Content
  baseline: {
    description: string;
    dataPoints: string[];
    period: string;
  };
  correlations: {
    description: string;
    strength: 'weak' | 'moderate' | 'strong';
    confidence: number; // 0-1
  }[];
  uncertainties: string[];
  limitations: string[];
  whatThisDoesNotShow: string[];
  
  // Metadata
  generatedAt: string;
  validUntil: string | null;
  version: number;
  checksum: string;
  canonicalUrl: string;
  qrCodeUrl?: string;
  
  // Source references
  dataSources: string[];
  methodology: string;
  
  // Legitimacy
  legitimacyLevel: LegitimacyLevel;
}

// ============================================================================
// 3. REPORT DEFINITION (WHAT QUALIFIES)
// ============================================================================

export interface ReportDefinition {
  isReport: string[];
  isReportLocal: Record<string, string[]>;
  isNotReport: string[];
  isNotReportLocal: Record<string, string[]>;
}

export const REPORT_DEFINITION: ReportDefinition = {
  isReport: [
    'Aggregation of observed data',
    'Clear description of current state',
    'Identification of measurable correlations',
    'Explicit disclosure of uncertainty'
  ],
  isReportLocal: {
    sv: [
      'Aggregering av observerad data',
      'Tydlig beskrivning av nuläge',
      'Identifiering av mätbara samband',
      'Explicit redovisning av osäkerhet'
    ]
  },
  isNotReport: [
    'Policy text',
    'Debate contribution',
    'PowerPoint presentation',
    'Pre-written impact assessment'
  ],
  isNotReportLocal: {
    sv: [
      'Policytext',
      'Debattinlägg',
      'PowerPoint-presentation',
      'Konsekvensutredning skriven i förväg'
    ]
  }
};

// ============================================================================
// 4. THE CORE QUESTION
// ============================================================================

export const EVIDENCE_QUESTION = {
  trigger: {
    en: '"We want to do X to improve Y"',
    sv: '"Vi vill göra X för att förbättra Y"'
  },
  response: {
    en: 'Which report in the truth layer supports that claim?',
    sv: 'Vilken rapport i sanningslagret stödjer det påståendet?'
  },
  outcomes: [
    {
      condition: 'Report exists',
      conditionLocal: { sv: 'Rapport finns' },
      action: 'Link to it',
      actionLocal: { sv: 'Länka den' },
      result: 'supported'
    },
    {
      condition: 'Report does not exist',
      conditionLocal: { sv: 'Rapport finns inte' },
      action: 'Claim has no basis',
      actionLocal: { sv: 'Påståendet saknar grund' },
      result: 'none'
    },
    {
      condition: 'Report exists but shows opposite',
      conditionLocal: { sv: 'Rapport finns men visar motsatsen' },
      action: 'Claim is wrong',
      actionLocal: { sv: 'Påståendet är fel' },
      result: 'contradicted'
    }
  ]
};

// ============================================================================
// 5. THE ONLY RULE
// ============================================================================

export const EVIDENCE_RULE = {
  en: 'If you claim an action will improve an outcome, show the evidence report that supports that claim.',
  sv: 'Om du påstår att en åtgärd förbättrar ett utfall, visa evidensrapporten som stödjer det påståendet.'
};

// ============================================================================
// 6. GLOBAL EFFECTS
// ============================================================================

export const EVIDENCE_EFFECTS = {
  journalists: {
    en: 'Start asking for report IDs',
    sv: 'Börjar fråga efter rapport-ID'
  },
  ai: {
    en: 'Start requiring evidence links',
    sv: 'Börjar kräva evidenslänkar'
  },
  voters: {
    en: 'Learn to recognize empty claims',
    sv: 'Lär sig känna igen tomma påståenden'
  },
  organizations: {
    en: 'Build decisions backwards (report → action)',
    sv: 'Bygger beslut bakifrån (rapport → åtgärd)'
  }
};

// ============================================================================
// 7. EVIDENCE LINK SPECIFICATION
// ============================================================================

export interface EvidenceLink {
  reportId: string;
  reportCode: string;
  canonicalUrl: string;
  qrCode: string;
  shortUrl: string;
  
  // For embedding
  embedCode: string;
  citationFormat: {
    apa: string;
    mla: string;
    chicago: string;
    system: string; // Internal format
  };
}

export const EVIDENCE_LINK_FORMAT = {
  pattern: 'GL-YYYY-NNNNN',
  example: 'GL-2026-00417',
  urlPattern: '/evidence/{reportCode}',
  qrPattern: '/qr/evidence/{reportCode}'
};

// ============================================================================
// 8. CHARTER ARTICLE (EVIDENCE REQUIREMENT)
// ============================================================================

export const EVIDENCE_CHARTER_ARTICLE = {
  number: 11,
  title: 'The Evidence Requirement',
  titleLocal: { sv: 'Evidenskravet' },
  isImmutable: true,
  content: [
    'Any claim that an action will improve an outcome must reference a verifiable evidence report.',
    'Evidence reports must contain: observed data aggregation, baseline description, correlation identification, and explicit uncertainty disclosure.',
    'Claims without evidence reports have no legitimacy within this system.',
    'Claims contradicted by evidence reports are marked as false.',
    'The report does not say what should be done. It says what the data actually points to.'
  ],
  contentLocal: {
    sv: [
      'Varje påstående att en åtgärd förbättrar ett utfall måste referera till en verifierbar evidensrapport.',
      'Evidensrapporter måste innehålla: aggregering av observerad data, nulägesbeskrivning, identifiering av samband och explicit osäkerhetsredovisning.',
      'Påståenden utan evidensrapporter har ingen legitimitet inom detta system.',
      'Påståenden som motsägs av evidensrapporter markeras som falska.',
      'Rapporten säger inte vad man ska göra. Den säger vad datan faktiskt pekar på.'
    ]
  },
  prohibitions: [
    'Treating policy texts as evidence reports',
    'Accepting claims without report references',
    'Hiding report contradictions'
  ],
  prohibitionsLocal: {
    sv: [
      'Behandla policytexter som evidensrapporter',
      'Acceptera påståenden utan rapportreferenser',
      'Dölja rapportmotsägelser'
    ]
  }
};

// ============================================================================
// 9. DECISION MAKER PROTECTION
// ============================================================================

export const DECISION_MAKER_TEMPLATE = {
  en: `"This is the decision we are making.
Here is the report that shows why it is reasonable.
Here is also what the report does not show."`,
  sv: `"Detta är beslutet vi tar.
Här är rapporten som visar varför det är rimligt.
Här är också vad rapporten inte visar."`
};

export const DECISION_MAKER_BENEFITS = [
  { en: 'Honest', sv: 'Ärligt' },
  { en: 'Professional', sv: 'Professionellt' },
  { en: 'Defensible in hindsight', sv: 'Försvarbart i efterhand' }
];
