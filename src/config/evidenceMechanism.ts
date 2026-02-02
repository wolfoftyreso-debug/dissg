/**
 * Evidence Mechanism
 * 
 * How "no decision without report" becomes standard in practice.
 * Reports are first-class objects, claims require linking.
 * 
 * Core idea: Don't demand accountability. Make accountability the only working option.
 */

// ============================================================================
// 1. EVIDENCE STATUS (VISUAL CLASSIFICATION)
// ============================================================================

export type EvidenceStatus = 'unsupported' | 'weak' | 'supported';

export interface EvidenceStatusDefinition {
  status: EvidenceStatus;
  code: string;
  label: string;
  labelLocal: Record<string, string>;
  description: string;
  descriptionLocal: Record<string, string>;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const EVIDENCE_STATUSES: Record<EvidenceStatus, EvidenceStatusDefinition> = {
  unsupported: {
    status: 'unsupported',
    code: '🟥',
    label: 'Unsupported',
    labelLocal: { sv: 'Ej underbyggt' },
    description: 'No evidence report linked to this claim.',
    descriptionLocal: { sv: 'Ingen evidensrapport kopplad till detta påstående.' },
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'x-circle'
  },
  weak: {
    status: 'weak',
    code: '🟨',
    label: 'Weakly Supported',
    labelLocal: { sv: 'Svagt underbyggt' },
    description: 'Evidence report exists but shows weak correlation.',
    descriptionLocal: { sv: 'Evidensrapport finns men visar svagt samband.' },
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: 'alert-circle'
  },
  supported: {
    status: 'supported',
    code: '🟩',
    label: 'Supported',
    labelLocal: { sv: 'Underbyggt' },
    description: 'Evidence report shows clear support.',
    descriptionLocal: { sv: 'Evidensrapport visar tydligt stöd.' },
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: 'check-circle'
  }
};

// ============================================================================
// 2. EVIDENCE REPORT (FIRST-CLASS OBJECT)
// ============================================================================

export interface EvidenceReportMeta {
  id: string;
  reportCode: string; // GL-YYYY-NNNNN
  canonicalUrl: string;
  qrCodeUrl: string;
  shortUrl: string;
  
  // Version control
  version: number;
  createdAt: string;
  updatedAt: string;
  previousVersions: string[];
  
  // Scope
  scope: {
    whatThisCovers: string[];
    whatThisDoesNotCover: string[];
    geographicScope: string[];
    temporalScope: {
      start: string;
      end: string;
    };
  };
  
  // Data coverage
  dataCoverage: {
    sources: string[];
    totalDataPoints: number;
    missingDataPercent: number;
    lastUpdated: string;
  };
  
  // Uncertainty profile
  uncertainty: {
    level: 'low' | 'moderate' | 'high';
    factors: string[];
    confidenceInterval?: string;
    methodologyNotes: string[];
  };
  
  // Classification
  supportStrength: 'none' | 'weak' | 'moderate' | 'strong';
  correlationCoefficient?: number;
  pValue?: number;
}

// ============================================================================
// 3. CLAIM STRUCTURE (MANDATORY LINKING)
// ============================================================================

export interface Claim {
  id: string;
  claimText: string;
  claimTextLocal?: Record<string, string>;
  
  // The mandatory link
  linkedReportId: string | null;
  linkedReportCode: string | null;
  
  // Derived status
  evidenceStatus: EvidenceStatus;
  
  // Metadata
  claimedBy: string;
  claimedAt: string;
  context: string;
  
  // If value-driven (no evidence)
  isValueDriven: boolean;
  valueStatement?: string;
}

export function getClaimStatus(claim: Claim, report: EvidenceReportMeta | null): EvidenceStatus {
  if (!claim.linkedReportId || !report) {
    return 'unsupported';
  }
  
  if (report.supportStrength === 'none' || report.supportStrength === 'weak') {
    return 'weak';
  }
  
  return 'supported';
}

// ============================================================================
// 4. EMBED STANDARDS (FOR MEDIA)
// ============================================================================

export interface EmbedConfig {
  reportCode: string;
  style: 'badge' | 'card' | 'inline' | 'full';
  theme: 'light' | 'dark' | 'system';
  showUncertainty: boolean;
  showScope: boolean;
  language: string;
}

export function generateEmbedCode(config: EmbedConfig): string {
  const baseUrl = 'https://truthlayer.global';
  return `<script src="${baseUrl}/embed.js" data-report="${config.reportCode}" data-style="${config.style}" data-theme="${config.theme}" data-uncertainty="${config.showUncertainty}" data-scope="${config.showScope}" data-lang="${config.language}"></script>`;
}

export function generateEmbedUrl(reportCode: string, style: EmbedConfig['style'] = 'badge'): string {
  return `/embed/${reportCode}?style=${style}`;
}

// ============================================================================
// 5. CITATION FORMATS
// ============================================================================

export interface Citation {
  reportCode: string;
  title: string;
  generatedAt: string;
  accessedAt: string;
  canonicalUrl: string;
}

export const CITATION_FORMATS = {
  system: (c: Citation) => 
    `Evidence Report ${c.reportCode}. Truth Layer Global. Generated ${c.generatedAt}. ${c.canonicalUrl}`,
  
  apa: (c: Citation) => 
    `Truth Layer Global. (${c.generatedAt.slice(0, 4)}). ${c.title} (Report No. ${c.reportCode}). Retrieved ${c.accessedAt} from ${c.canonicalUrl}`,
  
  mla: (c: Citation) => 
    `"${c.title}." Truth Layer Global, ${c.reportCode}, ${c.generatedAt}. Web. ${c.accessedAt}.`,
  
  journalistic: (c: Citation) =>
    `according to Evidence Report ${c.reportCode}`,
  
  inline: (c: Citation) =>
    `[${c.reportCode}]`
};

// ============================================================================
// 6. AI INTEGRATION SPEC
// ============================================================================

export interface AIGroundingRequirement {
  mustInclude: string[];
  mustFlag: string[];
  responseFormat: {
    withEvidence: string;
    withoutEvidence: string;
    partialEvidence: string;
  };
}

export const AI_GROUNDING_SPEC: AIGroundingRequirement = {
  mustInclude: [
    'Report ID when making claims about outcomes',
    'Uncertainty level from source report',
    'Scope limitations',
    'What the report does NOT show'
  ],
  mustFlag: [
    'Claims without linked evidence reports',
    'Claims contradicted by evidence reports',
    'Claims outside report scope',
    'Expired or outdated reports'
  ],
  responseFormat: {
    withEvidence: 'According to Evidence Report {reportCode}, {statement}. Note: {limitations}.',
    withoutEvidence: 'No evidence report currently supports that claim.',
    partialEvidence: 'Evidence Report {reportCode} shows {finding}, but does not address {gap}.'
  }
};

// ============================================================================
// 7. VALUE-DRIVEN DECISIONS (EXPLICIT)
// ============================================================================

export interface ValueDrivenDeclaration {
  statement: string;
  statementLocal: Record<string, string>;
  isPermitted: boolean;
  displayRequirement: string;
}

export const VALUE_DRIVEN_TEMPLATE: ValueDrivenDeclaration = {
  statement: 'This decision is value-driven and not supported by an evidence report.',
  statementLocal: {
    sv: 'Detta beslut är värdebaserat och stöds inte av en evidensrapport.'
  },
  isPermitted: true,
  displayRequirement: 'Must be displayed with equal prominence to evidence-supported claims'
};

// ============================================================================
// 8. SELF-REINFORCING EFFECTS
// ============================================================================

export const EXPECTED_EFFECTS = {
  organizations: {
    before: 'Propose action, then justify',
    after: 'Create report, then propose action',
    beforeLocal: { sv: 'Föreslå åtgärd, sedan motivera' },
    afterLocal: { sv: 'Skapa rapport, sedan föreslå åtgärd' }
  },
  politicians: {
    before: 'Announce policy, handle criticism',
    after: 'Request report first, then announce',
    beforeLocal: { sv: 'Avisera politik, hantera kritik' },
    afterLocal: { sv: 'Begär rapport först, sedan avisera' }
  },
  media: {
    before: 'Interview opinions, present debate',
    after: 'Request report ID, verify status',
    beforeLocal: { sv: 'Intervjua åsikter, presentera debatt' },
    afterLocal: { sv: 'Begär rapport-ID, verifiera status' }
  },
  ai: {
    before: 'Generate plausible answers',
    after: 'Ground in reports or flag uncertainty',
    beforeLocal: { sv: 'Generera rimliga svar' },
    afterLocal: { sv: 'Grunda i rapporter eller flagga osäkerhet' }
  }
};

// ============================================================================
// 9. REPORT ID FORMAT
// ============================================================================

export const REPORT_ID_SPEC = {
  format: 'GL-YYYY-NNNNN',
  prefix: 'GL', // Global Layer
  yearFormat: 'YYYY',
  sequenceDigits: 5,
  example: 'GL-2026-00417',
  regex: /^GL-\d{4}-\d{5}$/,
  
  generate: (year: number, sequence: number): string => {
    return `GL-${year}-${String(sequence).padStart(5, '0')}`;
  },
  
  parse: (code: string): { year: number; sequence: number } | null => {
    const match = code.match(/^GL-(\d{4})-(\d{5})$/);
    if (!match) return null;
    return {
      year: parseInt(match[1], 10),
      sequence: parseInt(match[2], 10)
    };
  }
};
