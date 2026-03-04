/**
 * GDIS ENGINE
 * 
 * Priority scoring, causal traversal, and decision intelligence generation
 */

import type { PriorityScore, Intervention, GlobalProblem, CausalLink, DecisionRecommendation } from './types';

// ─── Priority Formula ───
// priority = (impact × evidence × scalability) / cost_inverse
// where cost_inverse = 11 - cost_level_numeric

export function calculateGDISPriority(
  impact: number,
  cost: number,
  evidence: number,
  scalability: number,
): number {
  return Number(((impact * evidence * scalability * cost) / 1000).toFixed(2));
}

export function rankInterventionsForProblem(
  interventions: Intervention[],
  problemId: string,
  scoreOverrides?: Map<string, Partial<Pick<PriorityScore, 'impact' | 'cost' | 'evidence' | 'scalability'>>>
): PriorityScore[] {
  const relevant = interventions.filter(i => i.targetProblems.includes(problemId));

  const costMap: Record<string, number> = { very_low: 10, low: 8, medium: 5, high: 3, very_high: 1 };
  const scaleMap: Record<string, number> = { local: 3, national: 5, regional: 7, global: 10 };
  const evidenceMap: Record<string, number> = {
    meta_analysis: 10, systematic_review: 9, rct: 8, cohort: 6, observational: 4, expert_opinion: 2,
  };
  const statusImpact: Record<string, number> = { proven: 9, promising: 7, experimental: 4, theoretical: 2 };

  const scored: PriorityScore[] = relevant.map(i => {
    const overrides = scoreOverrides?.get(i.id);
    const impact = overrides?.impact ?? statusImpact[i.status] ?? 5;
    const cost = overrides?.cost ?? costMap[i.costLevel] ?? 5;
    const evidence = overrides?.evidence ?? evidenceMap[i.evidenceGrade] ?? 5;
    const scalability = overrides?.scalability ?? scaleMap[i.scalability] ?? 5;

    return {
      interventionId: i.id,
      interventionName: i.name,
      domain: i.domain,
      impact,
      cost,
      evidence,
      scalability,
      priorityScore: calculateGDISPriority(impact, cost, evidence, scalability),
      rank: 0,
      targetProblem: problemId,
      rationale: `${i.status} intervention with ${i.evidenceGrade} evidence, ${i.costLevel} cost, ${i.scalability} scale`,
    };
  });

  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  scored.forEach((s, i) => { s.rank = i + 1; });
  return scored;
}

// ─── Causal Chain Traversal ───

export function findCausalChains(
  links: CausalLink[],
  startVar: string,
  maxDepth = 5,
): string[][] {
  const chains: string[][] = [];
  const adjacency = new Map<string, CausalLink[]>();

  for (const link of links) {
    const existing = adjacency.get(link.fromVariable) || [];
    existing.push(link);
    adjacency.set(link.fromVariable, existing);
  }

  function dfs(current: string, path: string[], visited: Set<string>) {
    if (path.length > 1) chains.push([...path]);
    if (path.length >= maxDepth) return;

    const neighbors = adjacency.get(current) || [];
    for (const n of neighbors) {
      if (!visited.has(n.toVariable)) {
        visited.add(n.toVariable);
        path.push(n.toVariable);
        dfs(n.toVariable, path, visited);
        path.pop();
        visited.delete(n.toVariable);
      }
    }
  }

  const visited = new Set([startVar]);
  dfs(startVar, [startVar], visited);
  return chains;
}

// ─── Decision Intelligence Generator ───

export function generateRecommendation(
  question: string,
  problems: GlobalProblem[],
  interventions: Intervention[],
): DecisionRecommendation {
  // Find relevant problems
  const keywords = question.toLowerCase().split(/\s+/);
  const relevantProblems = problems.filter(p =>
    keywords.some(k => p.title.toLowerCase().includes(k) || p.domain.includes(k))
  );

  // Rank interventions for all relevant problems
  let allScores: PriorityScore[] = [];
  for (const p of relevantProblems) {
    const scores = rankInterventionsForProblem(interventions, p.id);
    allScores.push(...scores);
  }

  // Deduplicate and re-rank
  const seen = new Set<string>();
  allScores = allScores.filter(s => {
    if (seen.has(s.interventionId)) return false;
    seen.add(s.interventionId);
    return true;
  });
  allScores.sort((a, b) => b.priorityScore - a.priorityScore);
  allScores.forEach((s, i) => { s.rank = i + 1; });

  return {
    id: `REC-${Date.now()}`,
    question,
    topInterventions: allScores.slice(0, 10),
    evidenceSummary: `Based on ${allScores.length} interventions across ${relevantProblems.length} problems`,
    uncertainties: [
      'Effect sizes may vary by population and geography',
      'Implementation barriers not fully modeled',
      'Long-term effects may differ from short-term evidence',
    ],
    limitations: [
      'Cross-domain interactions not fully captured',
      'Cost estimates are approximate',
    ],
    generatedAt: new Date().toISOString(),
  };
}
