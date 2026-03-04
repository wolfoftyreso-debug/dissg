/**
 * AKB ENGINE
 * 
 * Question Universe Generator + Priority Validation Engine + Knowledge Graph Builder
 */

import type {
  GeneratedQuestion,
  QuestionUniverse,
  QuestionCategory,
  QuestionDifficulty,
  InterventionScore,
  KnowledgeObject,
  KnowledgeGraphNode,
  PublishableContent,
  AKBSystemStats,
} from './types';

// ─── Semantic Hash (dedup) ───

function semanticHash(text: string): string {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `SH-${Math.abs(hash).toString(36)}`;
}

// ─── Question Templates per Category ───

const QUESTION_TEMPLATES: Record<QuestionCategory, string[]> = {
  definition: [
    'What is {variable}?',
    'How is {variable} defined?',
    'What does {variable} mean in {domain}?',
  ],
  comparison: [
    'Is {intervention} better than {alt} for {outcome}?',
    'How does {variable} compare between {popA} and {popB}?',
    '{intervention} vs {alt}: which is more effective?',
  ],
  causal: [
    'Does {intervention} cause {outcome}?',
    'What causes changes in {variable}?',
    'How does {intervention} affect {outcome}?',
    'Why does {intervention} impact {variable}?',
  ],
  practical: [
    'How often should you {intervention} to improve {outcome}?',
    'What is the best way to {intervention}?',
    'How long does it take for {intervention} to show results?',
  ],
  myth: [
    'Is it true that {claim_short}?',
    'Is {intervention} a myth?',
    'Does {intervention} really work for {outcome}?',
  ],
  counterfactual: [
    'What happens if you stop {intervention}?',
    'What if {variable} decreased by 30%?',
    'What would happen without {intervention}?',
  ],
  population: [
    'Does {intervention} work for {population}?',
    'Is {claim_short} true for {population}?',
    'How does {outcome} vary by age group?',
  ],
  temporal: [
    'How long does {intervention} take to affect {outcome}?',
    'Is the effect of {intervention} permanent?',
    'When does {intervention} start working?',
  ],
  mechanism: [
    'How does {intervention} work biologically?',
    'What is the mechanism behind {claim_short}?',
    'Why does {intervention} increase {variable}?',
  ],
  quantitative: [
    'How much does {intervention} increase {outcome}?',
    'What is the effect size of {intervention} on {variable}?',
    'By how many percent does {intervention} change {outcome}?',
  ],
};

const DIFFICULTIES: QuestionDifficulty[] = ['beginner', 'intermediate', 'expert'];

interface ClaimInput {
  id: string;
  statement: string;
  domain: string;
  intervention?: string;
  outcome?: string;
  variable?: string;
  population?: string;
  alternatives?: string[];
}

// ─── Question Universe Generator ───

export function generateQuestionUniverse(claim: ClaimInput): QuestionUniverse {
  const questions: GeneratedQuestion[] = [];
  const seenHashes = new Set<string>();

  const vars: Record<string, string> = {
    intervention: claim.intervention || 'the intervention',
    outcome: claim.outcome || 'the outcome',
    variable: claim.variable || 'the variable',
    domain: claim.domain,
    claim_short: claim.statement.length > 60 ? claim.statement.slice(0, 57) + '...' : claim.statement,
    population: claim.population || 'the general population',
    popA: 'men',
    popB: 'women',
    alt: claim.alternatives?.[0] || 'alternatives',
  };

  const categories = Object.keys(QUESTION_TEMPLATES) as QuestionCategory[];

  for (const cat of categories) {
    const templates = QUESTION_TEMPLATES[cat];
    for (const tmpl of templates) {
      for (const diff of DIFFICULTIES) {
        let q = tmpl;
        for (const [k, v] of Object.entries(vars)) {
          q = q.replace(`{${k}}`, v);
        }

        if (diff === 'expert') {
          q = q.replace('What is', 'What are the determinants of');
        }

        const hash = semanticHash(q);
        if (seenHashes.has(hash)) continue;
        seenHashes.add(hash);

        questions.push({
          id: `QU-${claim.id}-${questions.length}`,
          claimId: claim.id,
          questionText: q,
          category: cat,
          difficulty: diff,
          semanticHash: hash,
          searchVolEstimate: Math.floor(Math.random() * 5000) + 100,
          languageCode: 'en',
        });
      }
    }
  }

  return {
    claimId: claim.id,
    claimStatement: claim.statement,
    domain: claim.domain,
    totalQuestions: questions.length,
    coverageScore: Math.min(1, questions.length / 100),
    questions,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Priority Validation Engine ───

export function calculatePriorityScore(
  impact: number,
  effort: number,
  confidence: number
): number {
  if (effort === 0) return 0;
  return Number(((impact * confidence) / effort).toFixed(2));
}

export function rankInterventions(interventions: Omit<InterventionScore, 'priorityScore' | 'rank'>[]): InterventionScore[] {
  const scored = interventions.map(i => ({
    ...i,
    priorityScore: calculatePriorityScore(i.impact, i.effort, i.confidence),
    rank: 0,
  }));

  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  scored.forEach((s, idx) => { s.rank = idx + 1; });

  return scored;
}

// ─── Knowledge Object Builder ───

export function buildKnowledgeObject(
  claim: ClaimInput,
  effectSize: string,
  confidence: number,
  evidenceLevel: string,
  relatedVars: string[],
): KnowledgeObject {
  return {
    id: `KO-${claim.id}`,
    claim: claim.statement,
    effectSize,
    population: claim.population || 'General',
    confidence,
    evidenceLevel,
    relatedVariables: relatedVars,
    temporalScope: { start: '2020', end: '2026' },
    geographicScope: 'Global',
    sources: [],
    machineFormats: ['json_ld', 'schema_org', 'raw_json'],
    lastVerified: new Date().toISOString(),
  };
}

// ─── Knowledge Graph Builder ───

export function buildKnowledgeGraph(
  universes: QuestionUniverse[]
): KnowledgeGraphNode[] {
  const nodes: KnowledgeGraphNode[] = [];
  const domainMap = new Map<string, string[]>();

  for (const u of universes) {
    if (!domainMap.has(u.domain)) domainMap.set(u.domain, []);
    domainMap.get(u.domain)!.push(u.claimId);
  }

  // Domain nodes
  for (const [domain, claimIds] of domainMap) {
    nodes.push({
      id: `domain-${domain}`,
      type: 'domain',
      label: domain,
      childCount: claimIds.length,
      searchRelevance: 1,
      url: `/${domain.toLowerCase()}`,
    });

    // Claim nodes under domain
    for (const cId of claimIds) {
      const u = universes.find(x => x.claimId === cId)!;
      nodes.push({
        id: `claim-${cId}`,
        type: 'claim',
        label: u.claimStatement,
        parentId: `domain-${domain}`,
        childCount: u.totalQuestions,
        searchRelevance: u.coverageScore,
        url: `/claim/${cId}`,
      });
    }
  }

  return nodes;
}

// ─── Dedup Check ───

export function detectDuplicateQuestions(questions: GeneratedQuestion[]): GeneratedQuestion[][] {
  const hashGroups = new Map<string, GeneratedQuestion[]>();
  for (const q of questions) {
    const group = hashGroups.get(q.semanticHash) || [];
    group.push(q);
    hashGroups.set(q.semanticHash, group);
  }
  return Array.from(hashGroups.values()).filter(g => g.length > 1);
}
