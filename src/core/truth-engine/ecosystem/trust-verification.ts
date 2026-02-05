/**
 * TRUST-BY-DESIGN VERIFICATION
 * 
 * External verification that the system:
 * - Does not give advice
 * - Does not manipulate
 * - Has reproducible indices
 * - Logs all rejections
 * 
 * Invite: academia, statistics authorities, audit-like actors.
 */

/**
 * VERIFICATION DIMENSIONS
 */
export interface VerificationDimension {
  readonly dimension_id: string;
  readonly name: string;
  readonly description: string;
  readonly verification_method: string;
  readonly evidence_required: readonly string[];
  readonly frequency: 'continuous' | 'quarterly' | 'annual';
}

export const VERIFICATION_DIMENSIONS: VerificationDimension[] = [
  {
    dimension_id: 'no_advice',
    name: 'No Advice Verification',
    description: 'Verify that the system never provides recommendations or advice',
    verification_method: 'Output audit + pattern matching + random sampling',
    evidence_required: [
      'Output logs showing no recommendation patterns',
      'Blocked query logs showing rejections',
      'User feedback analysis',
    ],
    frequency: 'continuous',
  },
  {
    dimension_id: 'no_manipulation',
    name: 'No Manipulation Verification',
    description: 'Verify that data is not selectively presented or framed',
    verification_method: 'Full data audit + methodology review + A/B testing',
    evidence_required: [
      'Complete data lineage',
      'Methodology documentation',
      'Comparison with source data',
    ],
    frequency: 'quarterly',
  },
  {
    dimension_id: 'reproducibility',
    name: 'Index Reproducibility',
    description: 'Verify that any index can be reproduced from source data',
    verification_method: 'Independent recalculation + hash verification',
    evidence_required: [
      'Published calculation methodology',
      'Source data checksums',
      'Independent calculation results',
    ],
    frequency: 'quarterly',
  },
  {
    dimension_id: 'rejection_logging',
    name: 'Rejection Logging',
    description: 'Verify that all rejections are logged with reasons',
    verification_method: 'Log audit + completeness check',
    evidence_required: [
      'Complete rejection logs',
      'Rejection reason categorization',
      'No silent failures',
    ],
    frequency: 'continuous',
  },
  {
    dimension_id: 'governance_compliance',
    name: 'Governance Compliance',
    description: 'Verify adherence to GDG and internal governance',
    verification_method: 'Schema validation + policy audit',
    evidence_required: [
      'GDG compliance reports',
      'Governance policy documentation',
      'Exception handling logs',
    ],
    frequency: 'annual',
  },
];

/**
 * VERIFIER TYPES
 */
export interface VerifierType {
  readonly verifier_type: string;
  readonly name: string;
  readonly description: string;
  readonly qualifications: readonly string[];
  readonly responsibilities: readonly string[];
}

export const VERIFIER_TYPES: VerifierType[] = [
  {
    verifier_type: 'academic',
    name: 'Academic Verifiers',
    description: 'University researchers and academic institutions',
    qualifications: [
      'Relevant domain expertise',
      'Statistical methodology expertise',
      'No commercial conflicts of interest',
    ],
    responsibilities: [
      'Methodology review',
      'Reproducibility testing',
      'Published verification reports',
    ],
  },
  {
    verifier_type: 'statistical_authority',
    name: 'Statistical Authorities',
    description: 'National and international statistics offices',
    qualifications: [
      'Official statistical mandate',
      'Data quality expertise',
      'International standards compliance',
    ],
    responsibilities: [
      'Data quality assessment',
      'Methodology alignment with standards',
      'Source data verification',
    ],
  },
  {
    verifier_type: 'audit_firm',
    name: 'Audit Firms',
    description: 'Professional audit and assurance providers',
    qualifications: [
      'Relevant audit experience',
      'Independence certification',
      'Professional standards compliance',
    ],
    responsibilities: [
      'Process audit',
      'Control testing',
      'Attestation reports',
    ],
  },
  {
    verifier_type: 'civil_society',
    name: 'Civil Society Organizations',
    description: 'Transparency and accountability organizations',
    qualifications: [
      'Transparency mandate',
      'Public interest focus',
      'No commercial interest in outcomes',
    ],
    responsibilities: [
      'Public accountability review',
      'User impact assessment',
      'Transparency reporting',
    ],
  },
];

/**
 * PUBLIC ARTIFACTS
 * 
 * What we publish for verification.
 */
export interface PublicArtifact {
  readonly artifact_id: string;
  readonly name: string;
  readonly description: string;
  readonly format: string;
  readonly update_frequency: string;
  readonly url_pattern: string;
}

export const PUBLIC_ARTIFACTS: PublicArtifact[] = [
  {
    artifact_id: 'methodology',
    name: 'Methodology Documentation',
    description: 'Complete documentation of all calculation methods',
    format: 'Markdown + JSON Schema',
    update_frequency: 'On change',
    url_pattern: '/docs/methodology/{version}',
  },
  {
    artifact_id: 'changelog',
    name: 'Change Log',
    description: 'All changes to data, methodology, and structure',
    format: 'JSON + RSS',
    update_frequency: 'Real-time',
    url_pattern: '/changelog/{year}/{month}',
  },
  {
    artifact_id: 'rejected_proposals',
    name: 'Rejected Proposals',
    description: 'All proposals that were rejected with reasons',
    format: 'JSON',
    update_frequency: 'On rejection',
    url_pattern: '/governance/rejected',
  },
  {
    artifact_id: 'verification_reports',
    name: 'Verification Reports',
    description: 'External verification reports',
    format: 'PDF + JSON',
    update_frequency: 'As completed',
    url_pattern: '/trust/verification/{report_id}',
  },
  {
    artifact_id: 'gdg_compliance',
    name: 'GDG Compliance Status',
    description: 'Current compliance with Global Decision Grammar',
    format: 'JSON',
    update_frequency: 'Real-time',
    url_pattern: '/trust/gdg-compliance',
  },
];

/**
 * TRUST ATTESTATION
 */
export interface TrustAttestation {
  readonly attestation_id: string;
  readonly verifier_type: string;
  readonly verifier_name: string;
  readonly dimensions_verified: readonly string[];
  readonly attestation_date: string;
  readonly valid_until: string;
  readonly findings_summary: string;
  readonly public_report_url: string;
}

/**
 * TRUST VERIFICATION PRINCIPLES
 */
export const TRUST_PRINCIPLES = {
  transparency: {
    statement: 'All methodology, changes, and rejections are public',
    enforcement: 'Automated publishing',
  },
  
  independence: {
    statement: 'Verifiers must be independent and without conflicts',
    enforcement: 'Conflict of interest disclosure',
  },
  
  reproducibility: {
    statement: 'Any output can be independently reproduced',
    enforcement: 'Published methodology + source hashes',
  },
  
  accountability: {
    statement: 'The system is accountable to public scrutiny',
    enforcement: 'Public verification reports',
  },
  
  why_this_works: 'This is extremely unusual. And exactly why we become accepted.',
} as const;
