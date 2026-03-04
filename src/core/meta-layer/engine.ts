/**
 * META LAYER — Engine
 * 
 * Scans the knowledge system and identifies gaps, weaknesses, and priorities.
 * This engine reads from all other layers but NEVER modifies them.
 */

import type {
  KnowledgeGap,
  WeakClaim,
  ResearchPriorityItem,
  SystemHealthSnapshot,
  MetaLayerReport,
  GapSeverity,
  WeakClaimReason,
} from './types';
import { SEED_CLAIMS } from '../uce/seed-data';
import type { UCEClaim } from '../uce/types';

const CONFIDENCE_THRESHOLD = 0.5;
const MIN_EVIDENCE_SOURCES = 2;

/**
 * Scan claims for weaknesses
 */
export function scanWeakClaims(claims: UCEClaim[]): WeakClaim[] {
  const weak: WeakClaim[] = [];

  for (const claim of claims) {
    const reasons: WeakClaimReason[] = [];
    const suggestions: string[] = [];

    if (claim.confidence_score < CONFIDENCE_THRESHOLD) {
      reasons.push('low_confidence');
      suggestions.push(`Increase evidence quality — current confidence ${claim.confidence_score} is below threshold ${CONFIDENCE_THRESHOLD}`);
    }

    if (claim.evidence_sources.length < MIN_EVIDENCE_SOURCES) {
      reasons.push('few_sources');
      suggestions.push(`Add more evidence sources — currently only ${claim.evidence_sources.length}`);
    }

    if (claim.contradicting_sources.length > 0 && claim.confidence_score < 0.7) {
      reasons.push('unresolved_conflict');
      suggestions.push(`Resolve ${claim.contradicting_sources.length} contradicting source(s)`);
    }

    if (claim.population_scope && claim.population_scope.includes('specific')) {
      reasons.push('narrow_population');
      suggestions.push('Consider broader population validation');
    }

    if (reasons.length > 0) {
      weak.push({
        claim_id: claim.claim_id,
        claim_statement: `${claim.subject_entity} → ${claim.variable} → ${claim.relationship_type} → ${claim.target_outcome}`,
        domain: claim.domain,
        confidence_score: claim.confidence_score,
        evidence_count: claim.evidence_sources.length,
        unresolved_conflicts: claim.contradicting_sources.length,
        reasons,
        improvement_suggestions: suggestions,
        flagged_at: new Date().toISOString(),
      });
    }
  }

  return weak.sort((a, b) => a.confidence_score - b.confidence_score);
}

/**
 * Detect knowledge gaps by analyzing domain coverage
 */
export function detectKnowledgeGaps(claims: UCEClaim[]): KnowledgeGap[] {
  const gaps: KnowledgeGap[] = [];
  
  // Group claims by domain
  const domainCounts = new Map<string, number>();
  const domainConfidence = new Map<string, number[]>();
  
  for (const claim of claims) {
    domainCounts.set(claim.domain, (domainCounts.get(claim.domain) || 0) + 1);
    const confs = domainConfidence.get(claim.domain) || [];
    confs.push(claim.confidence_score);
    domainConfidence.set(claim.domain, confs);
  }

  // Known domains that should have coverage
  const expectedDomains = ['health', 'psychology', 'economics', 'environment', 'society', 'education', 'governance', 'technology'];
  
  for (const domain of expectedDomains) {
    const count = domainCounts.get(domain) || 0;
    const confidences = domainConfidence.get(domain) || [];
    const avgConf = confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;

    let severity: GapSeverity = 'low';
    if (count === 0) severity = 'critical';
    else if (count < 3) severity = 'high';
    else if (count < 10) severity = 'medium';

    if (severity !== 'low') {
      gaps.push({
        id: `gap-${domain}-${Date.now()}`,
        domain,
        entity_type: 'domain_coverage',
        description: count === 0 
          ? `No claims exist for domain "${domain}"`
          : `Only ${count} claims in "${domain}" (avg confidence: ${avgConf.toFixed(2)})`,
        severity,
        status: 'open',
        affected_population_estimate: null,
        potential_impact_score: severity === 'critical' ? 95 : severity === 'high' ? 75 : 50,
        missing_data_types: count === 0 ? ['observations', 'claims', 'evidence'] : ['additional_evidence'],
        suggested_sources: getSuggestedSourcesForDomain(domain),
        detected_at: new Date().toISOString(),
        resolved_at: null,
      });
    }
  }

  // Check for entities with claims but no cross-domain connections
  const entityDomains = new Map<string, Set<string>>();
  for (const claim of claims) {
    const entities = [claim.subject_entity, claim.target_outcome];
    for (const entity of entities) {
      if (!entityDomains.has(entity)) entityDomains.set(entity, new Set());
      entityDomains.get(entity)!.add(claim.domain);
    }
  }

  // Entities that appear in only one domain could have cross-domain potential
  for (const [entity, domains] of entityDomains) {
    if (domains.size === 1 && claims.filter(c => c.subject_entity === entity || c.target_outcome === entity).length >= 2) {
      gaps.push({
        id: `gap-crossdomain-${entity}-${Date.now()}`,
        domain: Array.from(domains)[0],
        entity_type: 'cross_domain_link',
        description: `Entity "${entity}" appears in ${domains.size} domain(s) — potential cross-domain connections unexplored`,
        severity: 'medium',
        status: 'open',
        affected_population_estimate: null,
        potential_impact_score: 40,
        missing_data_types: ['cross_domain_evidence'],
        suggested_sources: [],
        detected_at: new Date().toISOString(),
        resolved_at: null,
      });
    }
  }

  return gaps.sort((a, b) => b.potential_impact_score - a.potential_impact_score);
}

function getSuggestedSourcesForDomain(domain: string): string[] {
  const sourceMap: Record<string, string[]> = {
    health: ['WHO Global Health Observatory', 'PubMed', 'Cochrane Library'],
    psychology: ['APA PsycInfo', 'PubMed Psychology', 'OECD Well-being'],
    economics: ['World Bank', 'IMF', 'OECD', 'Eurostat'],
    environment: ['IPCC', 'UNEP', 'NASA Earth Data', 'EEA'],
    society: ['UN Development Programme', 'World Values Survey', 'Gallup'],
    education: ['UNESCO', 'OECD PISA', 'World Bank Education'],
    governance: ['V-Dem', 'Freedom House', 'Transparency International'],
    technology: ['ITU', 'WIPO', 'OECD Digital Economy'],
  };
  return sourceMap[domain] || [];
}

/**
 * Generate research priorities based on gaps and weak claims
 */
export function generateResearchPriorities(
  gaps: KnowledgeGap[],
  weakClaims: WeakClaim[]
): ResearchPriorityItem[] {
  const priorities: ResearchPriorityItem[] = [];

  // From critical gaps
  for (const gap of gaps.filter(g => g.severity === 'critical' || g.severity === 'high')) {
    priorities.push({
      id: `rp-${gap.id}`,
      domain: gap.domain,
      question: `What data and evidence is needed to close the "${gap.domain}" knowledge gap?`,
      priority: gap.severity === 'critical' ? 'urgent' : 'high',
      impact_score: gap.potential_impact_score,
      feasibility_score: gap.suggested_sources.length > 0 ? 70 : 30,
      combined_score: gap.potential_impact_score * (gap.suggested_sources.length > 0 ? 0.7 : 0.3),
      related_gap_ids: [gap.id],
      related_weak_claim_ids: [],
      generated_at: new Date().toISOString(),
    });
  }

  // From clusters of weak claims in the same domain
  const weakByDomain = new Map<string, WeakClaim[]>();
  for (const wc of weakClaims) {
    const arr = weakByDomain.get(wc.domain) || [];
    arr.push(wc);
    weakByDomain.set(wc.domain, arr);
  }

  for (const [domain, domainWeak] of weakByDomain) {
    if (domainWeak.length >= 2) {
      priorities.push({
        id: `rp-weak-${domain}-${Date.now()}`,
        domain,
        question: `Strengthen ${domainWeak.length} weak claims in "${domain}" through additional evidence`,
        priority: 'high',
        impact_score: 60,
        feasibility_score: 50,
        combined_score: 30,
        related_gap_ids: [],
        related_weak_claim_ids: domainWeak.map(w => w.claim_id),
        generated_at: new Date().toISOString(),
      });
    }
  }

  return priorities.sort((a, b) => b.combined_score - a.combined_score);
}

/**
 * Generate system health snapshot
 */
export function generateHealthSnapshot(claims: UCEClaim[]): SystemHealthSnapshot {
  const domains = new Set(claims.map(c => c.domain));
  const avgConfidence = claims.length > 0
    ? claims.reduce((sum, c) => sum + c.confidence_score, 0) / claims.length
    : 0;
  
  const gaps = detectKnowledgeGaps(claims);
  const weakClaims = scanWeakClaims(claims);

  return {
    id: `health-${Date.now()}`,
    snapshot_date: new Date().toISOString(),
    total_sources: new Set(claims.flatMap(c => c.evidence_sources)).size,
    total_observations: 0, // Would come from DB
    total_claims: claims.length,
    total_evidence_links: claims.reduce((sum, c) => sum + c.evidence_sources.length, 0),
    total_causal_edges: 0, // Would come from DB
    avg_claim_confidence: Math.round(avgConfidence * 100) / 100,
    claims_below_threshold: claims.filter(c => c.confidence_score < CONFIDENCE_THRESHOLD).length,
    unresolved_conflicts: claims.reduce((sum, c) => sum + c.contradicting_sources.length, 0),
    open_knowledge_gaps: gaps.filter(g => g.status === 'open').length,
    domains_covered: Array.from(domains),
    domains_with_gaps: gaps.map(g => g.domain),
    source_freshness_score: 0.75, // Placeholder — would check source last_updated
    gaps_resolved_this_period: 0,
    claims_strengthened_this_period: 0,
    new_gaps_detected_this_period: gaps.length,
  };
}

/**
 * Generate full Meta Layer report
 */
export function generateMetaReport(claims?: UCEClaim[]): MetaLayerReport {
  const allClaims = claims || SEED_CLAIMS;
  
  const health = generateHealthSnapshot(allClaims);
  const gaps = detectKnowledgeGaps(allClaims);
  const weakClaims = scanWeakClaims(allClaims);
  const priorities = generateResearchPriorities(gaps, weakClaims);

  const recommendations: string[] = [];

  if (gaps.some(g => g.severity === 'critical')) {
    recommendations.push('CRITICAL: Some domains have zero coverage. Prioritize data source integration.');
  }
  if (health.avg_claim_confidence < 0.6) {
    recommendations.push('System-wide confidence is low. Focus on adding high-quality evidence (systematic reviews, RCTs).');
  }
  if (health.unresolved_conflicts > 3) {
    recommendations.push(`${health.unresolved_conflicts} unresolved evidence conflicts. Run conflict resolution protocol.`);
  }
  if (health.domains_covered.length < 5) {
    recommendations.push('Limited domain coverage. Expand to achieve cross-domain reasoning capability.');
  }

  return {
    generated_at: new Date().toISOString(),
    health,
    top_gaps: gaps.slice(0, 10),
    weakest_claims: weakClaims.slice(0, 10),
    research_priorities: priorities.slice(0, 10),
    recommendations,
  };
}
