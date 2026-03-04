/**
 * META ENGINE
 * 
 * The fourth layer: system self-analysis.
 * Identifies weak claims, data gaps, bias patterns, and cross-domain opportunities.
 */

import type {
  KnowledgeModule,
  KnowledgeClaim,
  DomainObservation,
  EvidenceLink,
  ModuleMetaAnalysis,
  MetaFinding,
  MetaAnalysisType,
  CrossModuleVariable,
} from './types';

// ============================================================================
// WEAK CLAIM SCANNER
// ============================================================================

export function scanWeakClaims(
  claims: readonly KnowledgeClaim[],
  evidenceLinks: readonly EvidenceLink[]
): MetaFinding[] {
  const findings: MetaFinding[] = [];
  
  for (const claim of claims) {
    const links = evidenceLinks.filter(e => e.claim_id === claim.id);
    const supporting = links.filter(e => e.link_type === 'supports');
    const contradicting = links.filter(e => e.link_type === 'contradicts');
    
    // No evidence at all
    if (links.length === 0) {
      findings.push({
        code: 'WEAK-NO-EVIDENCE',
        title: 'Claim without evidence',
        description: `Claim "${claim.claim_code}" has no linked observations.`,
        affected_entities: [claim.id],
        suggested_action: 'Link supporting observations or mark as proposed.',
        priority: 1,
      });
    }
    
    // High confidence but low evidence
    if (claim.confidence_score > 0.7 && supporting.length < 3) {
      findings.push({
        code: 'WEAK-OVERCONFIDENT',
        title: 'Overconfident claim',
        description: `Claim "${claim.claim_code}" has confidence ${claim.confidence_score} but only ${supporting.length} supporting observations.`,
        affected_entities: [claim.id],
        suggested_action: 'Reduce confidence score or add more supporting evidence.',
        priority: 2,
      });
    }
    
    // Heavily contested
    if (contradicting.length >= supporting.length && contradicting.length > 0) {
      findings.push({
        code: 'WEAK-CONTESTED',
        title: 'Heavily contested claim',
        description: `Claim "${claim.claim_code}" has ${contradicting.length} contradicting vs ${supporting.length} supporting observations.`,
        affected_entities: [claim.id],
        suggested_action: 'Review evidence quality and consider status change.',
        priority: 1,
      });
    }
  }
  
  return findings;
}

// ============================================================================
// DATA GAP DETECTOR
// ============================================================================

export function detectDataGaps(
  module: KnowledgeModule,
  observations: readonly DomainObservation[]
): MetaFinding[] {
  const findings: MetaFinding[] = [];
  const ontology = module.ontology_schema;
  
  // Check variables without observations
  for (const variable of ontology.variables) {
    const hasObs = observations.some(o => 
      o.measurement_type === variable.code
    );
    if (!hasObs) {
      findings.push({
        code: 'GAP-VARIABLE',
        title: `No data for variable: ${variable.name}`,
        description: `Variable "${variable.code}" defined in ontology but has no observations.`,
        affected_entities: [variable.code],
        suggested_action: `Ingest data for "${variable.name}" from ${ontology.data_sources.map(s => s.name).join(', ')}.`,
        priority: 2,
      });
    }
  }
  
  // Check for geographic gaps
  const geoScopes = new Set(observations.map(o => o.geo_scope));
  if (geoScopes.size === 1) {
    findings.push({
      code: 'GAP-GEO',
      title: 'Single geography coverage',
      description: `All observations cover only "${[...geoScopes][0]}". Cross-geography validation missing.`,
      affected_entities: [],
      suggested_action: 'Ingest observations from additional geographic regions.',
      priority: 3,
    });
  }
  
  // Check for temporal gaps
  const years = observations
    .filter(o => o.time_period_start)
    .map(o => new Date(o.time_period_start!).getFullYear())
    .sort();
  
  if (years.length > 1) {
    for (let i = 1; i < years.length; i++) {
      if (years[i] - years[i-1] > 2) {
        findings.push({
          code: 'GAP-TEMPORAL',
          title: `Temporal gap: ${years[i-1]}-${years[i]}`,
          description: `No observations between ${years[i-1]} and ${years[i]}.`,
          affected_entities: [],
          suggested_action: 'Identify data sources covering the missing period.',
          priority: 3,
        });
      }
    }
  }
  
  return findings;
}

// ============================================================================
// BIAS SCANNER
// ============================================================================

export function scanBiases(
  observations: readonly DomainObservation[],
  evidenceLinks: readonly EvidenceLink[]
): MetaFinding[] {
  const findings: MetaFinding[] = [];
  
  // Publication bias: all positive results
  const withEffectSize = observations.filter(o => o.effect_size !== undefined && o.effect_size !== null);
  if (withEffectSize.length >= 5) {
    const positiveCount = withEffectSize.filter(o => o.effect_size! > 0).length;
    const ratio = positiveCount / withEffectSize.length;
    if (ratio > 0.9) {
      findings.push({
        code: 'BIAS-PUBLICATION',
        title: 'Possible publication bias',
        description: `${Math.round(ratio * 100)}% of studies show positive effects. Expected null/negative results may be underrepresented.`,
        affected_entities: [],
        suggested_action: 'Search for pre-registered studies and null results. Apply funnel plot analysis.',
        priority: 1,
      });
    }
  }
  
  // Source concentration
  const orgs = observations.map(o => o.source_organization).filter(Boolean);
  const orgCounts: Record<string, number> = {};
  for (const org of orgs) {
    orgCounts[org!] = (orgCounts[org!] || 0) + 1;
  }
  const topOrg = Object.entries(orgCounts).sort((a, b) => b[1] - a[1])[0];
  if (topOrg && topOrg[1] / observations.length > 0.5) {
    findings.push({
      code: 'BIAS-SOURCE-CONCENTRATION',
      title: `Source concentration: ${topOrg[0]}`,
      description: `${Math.round(topOrg[1] / observations.length * 100)}% of observations from single source.`,
      affected_entities: [],
      suggested_action: 'Diversify data sources to reduce single-source dependency.',
      priority: 2,
    });
  }
  
  // Flagged biases in evidence
  const allFlags = evidenceLinks.flatMap(e => e.bias_flags);
  const flagCounts: Record<string, number> = {};
  for (const flag of allFlags) {
    flagCounts[flag] = (flagCounts[flag] || 0) + 1;
  }
  for (const [bias, count] of Object.entries(flagCounts)) {
    if (count >= 3) {
      findings.push({
        code: `BIAS-RECURRING-${bias.toUpperCase()}`,
        title: `Recurring bias: ${bias}`,
        description: `"${bias}" flagged in ${count} evidence links.`,
        affected_entities: [],
        suggested_action: `Systematically address ${bias} across the module.`,
        priority: 2,
      });
    }
  }
  
  return findings;
}

// ============================================================================
// REPLICATION AUDITOR
// ============================================================================

export function auditReplication(
  observations: readonly DomainObservation[]
): MetaFinding[] {
  const findings: MetaFinding[] = [];
  
  const total = observations.length;
  const replicated = observations.filter(o => o.is_replicated).length;
  
  if (total >= 10 && replicated / total < 0.3) {
    findings.push({
      code: 'REPL-LOW',
      title: 'Low replication rate',
      description: `Only ${Math.round(replicated / total * 100)}% of observations are replicated.`,
      affected_entities: [],
      suggested_action: 'Prioritize replication of key findings.',
      priority: 2,
    });
  }
  
  return findings;
}

// ============================================================================
// FULL META ANALYSIS
// ============================================================================

export function runFullMetaAnalysis(
  module: KnowledgeModule,
  observations: readonly DomainObservation[],
  claims: readonly KnowledgeClaim[],
  evidenceLinks: readonly EvidenceLink[]
): ModuleMetaAnalysis[] {
  const results: ModuleMetaAnalysis[] = [];
  
  const weakFindings = scanWeakClaims(claims, evidenceLinks);
  if (weakFindings.length > 0) {
    results.push({
      id: crypto.randomUUID(),
      module_id: module.id,
      analysis_type: 'weak_claims',
      findings: weakFindings,
      severity: weakFindings.some(f => f.priority === 1) ? 'critical' : 'warning',
      auto_generated: true,
      resolved: false,
    });
  }
  
  const gapFindings = detectDataGaps(module, observations);
  if (gapFindings.length > 0) {
    results.push({
      id: crypto.randomUUID(),
      module_id: module.id,
      analysis_type: 'data_gaps',
      findings: gapFindings,
      severity: gapFindings.length > 3 ? 'critical' : 'warning',
      auto_generated: true,
      resolved: false,
    });
  }
  
  const biasFindings = scanBiases(observations, evidenceLinks);
  if (biasFindings.length > 0) {
    results.push({
      id: crypto.randomUUID(),
      module_id: module.id,
      analysis_type: 'bias_scan',
      findings: biasFindings,
      severity: biasFindings.some(f => f.code === 'BIAS-PUBLICATION') ? 'critical' : 'warning',
      auto_generated: true,
      resolved: false,
    });
  }
  
  const replFindings = auditReplication(observations);
  if (replFindings.length > 0) {
    results.push({
      id: crypto.randomUUID(),
      module_id: module.id,
      analysis_type: 'replication_deficit',
      findings: replFindings,
      severity: 'warning',
      auto_generated: true,
      resolved: false,
    });
  }
  
  return results;
}
