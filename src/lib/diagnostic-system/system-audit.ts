/**
 * OEM-Class System Self-Audit
 * 
 * Systemet testar sig självt kontinuerligt.
 * Identifierar luckor, gissningar och svaga länkar.
 */

import type { ClassifiedContent, ContentClassification } from './content-classifier';
import type { DiagnosticParameter, ParameterValidation } from './diagnostic-structure';

// =============================================================================
// AUDIT TYPES
// =============================================================================

export type AuditSeverity = 'critical' | 'warning' | 'info';

export interface AuditFinding {
  id: string;
  code: string;
  severity: AuditSeverity;
  category: AuditCategory;
  title: string;
  description: string;
  affectedItems: string[];
  recommendation: string;
  autoFixable: boolean;
  foundAt: string;
}

export type AuditCategory = 
  | 'missing_tolerance'
  | 'missing_source'
  | 'missing_methodology'
  | 'speculative_content'
  | 'orphaned_parameter'
  | 'high_abstraction_index'
  | 'weak_source'
  | 'outdated_data'
  | 'missing_uncertainty'
  | 'ui_not_clickable'
  | 'no_historical_data'
  | 'no_peer_comparison';

// =============================================================================
// AUDIT RULES (LOCKED)
// =============================================================================

interface AuditRule {
  code: string;
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  check: (content: ClassifiedContent) => boolean;
  recommendation: string;
  autoFixable: boolean;
}

const AUDIT_RULES: AuditRule[] = [
  {
    code: 'AUD-TOL-001',
    category: 'missing_tolerance',
    severity: 'critical',
    title: 'Toleransintervall saknas',
    check: (c) => !c.criteria.hasTolerance && c.type === 'parameter',
    recommendation: 'Definiera toleransintervall baserat på vetenskaplig litteratur eller historisk normalzon.',
    autoFixable: false,
  },
  {
    code: 'AUD-SRC-001',
    category: 'missing_source',
    severity: 'critical',
    title: 'Verifierad källa saknas',
    check: (c) => !c.criteria.hasVerifiedSource,
    recommendation: 'Lägg till verifierbar källa med URL, organisation och hämtningsdatum.',
    autoFixable: false,
  },
  {
    code: 'AUD-MET-001',
    category: 'missing_methodology',
    severity: 'warning',
    title: 'Metod/definition saknas',
    check: (c) => !c.criteria.hasMethodology && c.type !== 'text',
    recommendation: 'Dokumentera exakt hur värdet beräknas/definieras.',
    autoFixable: false,
  },
  {
    code: 'AUD-SPE-001',
    category: 'speculative_content',
    severity: 'critical',
    title: 'Spekulativt innehåll',
    check: (c) => c.criteria.containsValueWords || c.criteria.containsInterpretation,
    recommendation: 'Ta bort värdeord och tolkningar. Ersätt med neutrala observationer.',
    autoFixable: false,
  },
  {
    code: 'AUD-UNC-001',
    category: 'missing_uncertainty',
    severity: 'warning',
    title: 'Osäkerhetsmarginal saknas',
    check: (c) => !c.criteria.hasUncertaintyMargin && c.type === 'parameter',
    recommendation: 'Ange konfidensintervall eller ±% osäkerhet.',
    autoFixable: false,
  },
  {
    code: 'AUD-CLK-001',
    category: 'ui_not_clickable',
    severity: 'warning',
    title: 'Ej klickbar till källa',
    check: (c) => !c.criteria.isClickableToSource && ['datapoint', 'parameter', 'index'].includes(c.type),
    recommendation: 'Implementera klickbar länk till underliggande data.',
    autoFixable: true,
  },
  {
    code: 'AUD-HIS-001',
    category: 'no_historical_data',
    severity: 'warning',
    title: 'Historisk data saknas',
    check: (c) => !c.criteria.hasHistoricalData && c.type === 'parameter',
    recommendation: 'Lägg till historisk tidsserie för jämförelse.',
    autoFixable: false,
  },
  {
    code: 'AUD-PER-001',
    category: 'no_peer_comparison',
    severity: 'info',
    title: 'Peer-jämförelse saknas',
    check: (c) => !c.criteria.hasPeerComparison && c.type === 'parameter',
    recommendation: 'Lägg till jämförelse mot peer-grupp (liknande länder/regioner).',
    autoFixable: false,
  },
];

// =============================================================================
// AUDIT ENGINE
// =============================================================================

export function runAudit(contents: ClassifiedContent[]): AuditFinding[] {
  const findings: AuditFinding[] = [];
  
  for (const content of contents) {
    for (const rule of AUDIT_RULES) {
      if (rule.check(content)) {
        findings.push({
          id: `${rule.code}-${content.id}`,
          code: rule.code,
          severity: rule.severity,
          category: rule.category,
          title: rule.title,
          description: `${rule.title} för: ${content.name}`,
          affectedItems: [content.path],
          recommendation: rule.recommendation,
          autoFixable: rule.autoFixable,
          foundAt: new Date().toISOString(),
        });
      }
    }
  }

  return findings;
}

// =============================================================================
// SYSTEM HEALTH REPORT
// =============================================================================

export interface SystemHealthReport {
  overallHealth: 'healthy' | 'degraded' | 'critical';
  healthScore: number; // 0-100
  
  totalFindings: number;
  criticalFindings: number;
  warningFindings: number;
  infoFindings: number;
  
  findingsByCategory: Record<AuditCategory, number>;
  
  diagnosticReadyPercent: number;
  lambdaEligiblePercent: number;
  
  topIssues: AuditFinding[];
  
  systemSelfDiagnosis: SystemSelfDiagnosisCode[];
  
  generatedAt: string;
}

// Felkoder på systemet självt
export interface SystemSelfDiagnosisCode {
  code: string;
  severity: AuditSeverity;
  description: string;
  count: number;
}

export function generateSystemHealthReport(
  contents: ClassifiedContent[],
  findings: AuditFinding[]
): SystemHealthReport {
  const criticalFindings = findings.filter(f => f.severity === 'critical');
  const warningFindings = findings.filter(f => f.severity === 'warning');
  const infoFindings = findings.filter(f => f.severity === 'info');

  const findingsByCategory: Record<AuditCategory, number> = {} as Record<AuditCategory, number>;
  for (const finding of findings) {
    findingsByCategory[finding.category] = (findingsByCategory[finding.category] || 0) + 1;
  }

  // Calculate health score
  const totalWeight = contents.length * 10;
  const criticalWeight = criticalFindings.length * 10;
  const warningWeight = warningFindings.length * 3;
  const infoWeight = infoFindings.length * 1;
  
  const deductions = criticalWeight + warningWeight + infoWeight;
  const healthScore = Math.max(0, Math.min(100, 100 - (deductions / totalWeight) * 100));

  let overallHealth: 'healthy' | 'degraded' | 'critical';
  if (healthScore >= 80 && criticalFindings.length === 0) {
    overallHealth = 'healthy';
  } else if (healthScore >= 50 || criticalFindings.length <= 3) {
    overallHealth = 'degraded';
  } else {
    overallHealth = 'critical';
  }

  const diagnosticReady = contents.filter(c => c.classification === 'diagnostic_ready');
  const lambdaEligible = contents.filter(c => 
    c.classification === 'diagnostic_ready' &&
    c.criteria.hasSetpoint &&
    c.criteria.hasTolerance &&
    c.criteria.hasVerifiedSource &&
    c.criteria.hasHistoricalData
  );

  // Generate system self-diagnosis codes
  const selfDiagnosis: SystemSelfDiagnosisCode[] = [];
  
  if (findingsByCategory.missing_tolerance > 0) {
    selfDiagnosis.push({
      code: 'SYS-CAL-001',
      severity: 'critical',
      description: 'Parametrar saknar toleransdefinition',
      count: findingsByCategory.missing_tolerance,
    });
  }
  
  if (findingsByCategory.speculative_content > 0) {
    selfDiagnosis.push({
      code: 'SYS-SPE-001',
      severity: 'critical',
      description: 'Spekulativt innehåll i systemet',
      count: findingsByCategory.speculative_content,
    });
  }
  
  if (findingsByCategory.missing_source > 0) {
    selfDiagnosis.push({
      code: 'SYS-SRC-001',
      severity: 'critical',
      description: 'Datapunkter saknar verifierad källa',
      count: findingsByCategory.missing_source,
    });
  }

  return {
    overallHealth,
    healthScore: Math.round(healthScore),
    totalFindings: findings.length,
    criticalFindings: criticalFindings.length,
    warningFindings: warningFindings.length,
    infoFindings: infoFindings.length,
    findingsByCategory,
    diagnosticReadyPercent: contents.length > 0 
      ? Math.round((diagnosticReady.length / contents.length) * 100) 
      : 0,
    lambdaEligiblePercent: contents.length > 0 
      ? Math.round((lambdaEligible.length / contents.length) * 100) 
      : 0,
    topIssues: criticalFindings.slice(0, 10),
    systemSelfDiagnosis: selfDiagnosis,
    generatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// LAMBDA ELIGIBILITY AUDIT
// =============================================================================

export interface LambdaEligibilityReport {
  canCalculateLambda: boolean;
  blockingIssues: string[];
  eligibleParameters: string[];
  ineligibleParameters: Array<{ name: string; reason: string }>;
  coveragePercent: number;
  minimumCoverageRequired: number;
  generatedAt: string;
}

export function auditLambdaEligibility(
  contents: ClassifiedContent[]
): LambdaEligibilityReport {
  const parameters = contents.filter(c => c.type === 'parameter');
  const eligible: string[] = [];
  const ineligible: Array<{ name: string; reason: string }> = [];

  for (const param of parameters) {
    if (param.classification !== 'diagnostic_ready') {
      ineligible.push({ name: param.name, reason: 'Ej diagnostiskt färdig' });
      continue;
    }
    
    if (!param.criteria.hasSetpoint) {
      ineligible.push({ name: param.name, reason: 'Börvärde saknas' });
      continue;
    }
    
    if (!param.criteria.hasTolerance) {
      ineligible.push({ name: param.name, reason: 'Tolerans saknas' });
      continue;
    }
    
    if (!param.criteria.hasVerifiedSource) {
      ineligible.push({ name: param.name, reason: 'Källa saknas' });
      continue;
    }
    
    if (!param.criteria.hasHistoricalData) {
      ineligible.push({ name: param.name, reason: 'Historik saknas' });
      continue;
    }
    
    eligible.push(param.name);
  }

  const minimumCoverage = 70; // Minimum 70% coverage required
  const coveragePercent = parameters.length > 0 
    ? Math.round((eligible.length / parameters.length) * 100) 
    : 0;

  const blockingIssues: string[] = [];
  if (coveragePercent < minimumCoverage) {
    blockingIssues.push(`Täckning ${coveragePercent}% är under minimum ${minimumCoverage}%`);
  }
  if (eligible.length === 0) {
    blockingIssues.push('Inga parametrar är Lambda-kvalificerade');
  }

  return {
    canCalculateLambda: blockingIssues.length === 0,
    blockingIssues,
    eligibleParameters: eligible,
    ineligibleParameters: ineligible,
    coveragePercent,
    minimumCoverageRequired: minimumCoverage,
    generatedAt: new Date().toISOString(),
  };
}
