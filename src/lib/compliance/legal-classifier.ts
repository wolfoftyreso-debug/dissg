/**
 * LEGAL CLASSIFIER
 * 
 * Manages legal classification of the platform per jurisdiction.
 * Ensures platform is classified as information service, not clinical tool.
 * 
 * Classifications:
 * - Information service
 * - Statistical reference
 * - Educational/research layer
 * 
 * NOT:
 * - Medical device
 * - Clinical decision support
 * - Policy advisory service
 */

import type { LegalClassification } from '@/types/compliance';

// Built-in legal classifications
const LEGAL_CLASSIFICATIONS: LegalClassification[] = [
  {
    id: 'legal-eu',
    jurisdiction: 'EU',
    platform_classification: 'information_service',
    not_classified_as: [
      'medical_device',
      'clinical_decision_support',
      'AI_system_high_risk',
      'policy_advisory_service'
    ],
    required_disclaimers: [
      'This platform does not provide medical advice.',
      'All data is observational and population-level.',
      'For personal decisions, consult licensed professionals.',
      'Not a medical device under EU MDR 2017/745.'
    ],
    regulatory_framework: 'GDPR, EU AI Act (information service exemption), MDR (not a medical device)',
    compliance_notes: 'Platform processes only aggregated, anonymized population data. No individual health data is processed.',
    effective_date: '2024-01-01',
    is_active: true
  },
  {
    id: 'legal-us',
    jurisdiction: 'US',
    platform_classification: 'statistical_reference',
    not_classified_as: [
      'medical_device',
      'clinical_tool',
      'covered_entity_HIPAA',
      'investment_advice'
    ],
    required_disclaimers: [
      'This platform does not provide medical advice.',
      'Not intended for clinical use.',
      'Educational and research purposes only.',
      'Not a medical device under FDA regulations.'
    ],
    regulatory_framework: 'FDA (not a medical device), HIPAA (no individual health data), SEC (not financial advice)',
    compliance_notes: 'No protected health information (PHI) is processed. All data is de-identified and aggregated.',
    effective_date: '2024-01-01',
    is_active: true
  },
  {
    id: 'legal-global',
    jurisdiction: 'GLOBAL',
    platform_classification: 'educational_research',
    not_classified_as: [
      'medical_device',
      'clinical_tool',
      'decision_support_system',
      'policy_advisory_service'
    ],
    required_disclaimers: [
      'This platform does not provide medical advice.',
      'All data is aggregated and anonymized.',
      'Not intended for individual decision-making.',
      'For professional guidance, consult licensed experts in your jurisdiction.'
    ],
    regulatory_framework: 'WHO standards, OECD data principles, UN statistical guidelines',
    compliance_notes: 'Platform serves as neutral statistical reference following international data standards.',
    effective_date: '2024-01-01',
    is_active: true
  },
  {
    id: 'legal-who',
    jurisdiction: 'WHO',
    platform_classification: 'statistical_reference',
    not_classified_as: [
      'clinical_guidance',
      'treatment_protocol',
      'diagnostic_tool'
    ],
    required_disclaimers: [
      'Data sourced from WHO and member state registries.',
      'Population-level statistics only.',
      'Not clinical guidance.',
      'Consult local health authorities for guidance.'
    ],
    regulatory_framework: 'WHO International Health Regulations, ICD classification standards',
    compliance_notes: 'Aligned with WHO data sharing and transparency principles.',
    effective_date: '2024-01-01',
    is_active: true
  }
];

/**
 * Get legal classification for a jurisdiction
 */
export function getLegalClassification(jurisdiction: string): LegalClassification | null {
  return LEGAL_CLASSIFICATIONS.find(
    c => c.jurisdiction.toLowerCase() === jurisdiction.toLowerCase() && c.is_active
  ) || null;
}

/**
 * Get all active legal classifications
 */
export function getAllLegalClassifications(): LegalClassification[] {
  return LEGAL_CLASSIFICATIONS.filter(c => c.is_active);
}

/**
 * Get required disclaimers for a jurisdiction
 */
export function getRequiredDisclaimers(jurisdiction: string): string[] {
  const classification = getLegalClassification(jurisdiction);
  if (!classification) {
    // Return global disclaimers as fallback
    const global = getLegalClassification('GLOBAL');
    return global?.required_disclaimers || [];
  }
  return classification.required_disclaimers;
}

/**
 * Check if platform is classified as something
 */
export function isClassifiedAs(jurisdiction: string, classification: string): boolean {
  const legal = getLegalClassification(jurisdiction);
  if (!legal) return false;
  return legal.platform_classification.toLowerCase() === classification.toLowerCase();
}

/**
 * Check if platform is NOT classified as something (important for liability)
 */
export function isNotClassifiedAs(jurisdiction: string, classification: string): boolean {
  const legal = getLegalClassification(jurisdiction);
  if (!legal) return false;
  return legal.not_classified_as.some(
    c => c.toLowerCase() === classification.toLowerCase()
  );
}

/**
 * Build legal footer for a jurisdiction
 */
export function buildLegalFooter(jurisdiction: string): string {
  const classification = getLegalClassification(jurisdiction);
  if (!classification) {
    return 'This platform provides statistical reference data only. Not intended for clinical or individual use.';
  }
  
  const disclaimers = classification.required_disclaimers.join(' ');
  const notClassified = classification.not_classified_as
    .map(c => c.replace(/_/g, ' '))
    .join(', ');
  
  return `${disclaimers}\n\nThis platform is classified as: ${classification.platform_classification.replace(/_/g, ' ')}. It is not: ${notClassified}.`;
}

/**
 * Build regulatory reference string
 */
export function buildRegulatoryReference(jurisdiction: string): string {
  const classification = getLegalClassification(jurisdiction);
  if (!classification) return '';
  
  return `Regulatory framework: ${classification.regulatory_framework}`;
}

/**
 * Get compliance statement for API responses
 */
export function getAPIComplianceStatement(jurisdiction: string = 'GLOBAL'): Record<string, unknown> {
  const classification = getLegalClassification(jurisdiction);
  
  return {
    platform_type: classification?.platform_classification || 'statistical_reference',
    is_medical_device: false,
    is_clinical_tool: false,
    is_advisory_service: false,
    data_level: 'population_aggregate',
    individual_data: false,
    provides_recommendations: false,
    provides_predictions: false,
    jurisdiction: jurisdiction,
    disclaimers: classification?.required_disclaimers || [],
    regulatory_framework: classification?.regulatory_framework || 'International statistical standards'
  };
}

/**
 * Validate that content doesn't cross legal boundaries
 */
export function validateContentLegality(content: string, jurisdiction: string = 'GLOBAL'): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const classification = getLegalClassification(jurisdiction);
  
  if (!classification) {
    return { valid: true, issues: [] };
  }
  
  // Check for content that would reclassify platform
  const dangerousPatterns = [
    { pattern: /you should (take|use|try)/i, issue: 'Contains treatment recommendation' },
    { pattern: /recommended (dose|dosage|treatment)/i, issue: 'Contains dosage recommendation' },
    { pattern: /will (cure|treat|prevent)/i, issue: 'Contains treatment claim' },
    { pattern: /diagnosis:/i, issue: 'Contains diagnostic statement' },
    { pattern: /your risk (is|score)/i, issue: 'Contains individual risk assessment' }
  ];
  
  for (const { pattern, issue } of dangerousPatterns) {
    if (pattern.test(content)) {
      issues.push(issue);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}
