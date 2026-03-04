/**
 * AKB SEED DATA
 * 
 * Example claims and interventions for the Autonomous Knowledge Builder
 */

import {
  generateQuestionUniverse,
  rankInterventions,
  buildKnowledgeObject,
  buildKnowledgeGraph,
} from './engine';
import type { InterventionScore, QuestionUniverse, KnowledgeObject, KnowledgeGraphNode } from './types';

const SEED_CLAIMS = [
  {
    id: 'CLM-001',
    statement: 'Resistance training increases lifespan by 2–5 years',
    domain: 'Health',
    intervention: 'resistance training',
    outcome: 'lifespan',
    variable: 'longevity',
    population: 'Adults 40–70',
    alternatives: ['cardio', 'yoga'],
  },
  {
    id: 'CLM-002',
    statement: 'Sleep deprivation increases inflammation markers by 30–50%',
    domain: 'Health',
    intervention: 'sleep extension',
    outcome: 'inflammation',
    variable: 'CRP levels',
    population: 'Adults 20–60',
    alternatives: ['meditation', 'medication'],
  },
  {
    id: 'CLM-003',
    statement: 'Progressive taxation reduces income inequality (Gini coefficient)',
    domain: 'Economics',
    intervention: 'progressive tax reform',
    outcome: 'income equality',
    variable: 'Gini coefficient',
    population: 'OECD countries',
    alternatives: ['UBI', 'flat tax'],
  },
  {
    id: 'CLM-004',
    statement: 'Urban green spaces reduce psychological stress by 15–25%',
    domain: 'Environment',
    intervention: 'urban green space expansion',
    outcome: 'psychological stress',
    variable: 'cortisol levels',
    population: 'Urban residents',
    alternatives: ['meditation apps', 'therapy'],
  },
  {
    id: 'CLM-005',
    statement: 'Cold exposure increases metabolic rate by 10–15%',
    domain: 'Health',
    intervention: 'cold exposure',
    outcome: 'metabolic rate',
    variable: 'basal metabolic rate',
    population: 'Healthy adults',
    alternatives: ['exercise', 'dietary changes'],
  },
];

const SEED_INTERVENTIONS: Omit<InterventionScore, 'priorityScore' | 'rank'>[] = [
  {
    id: 'INT-001',
    interventionName: 'Resistance training 3x/week',
    domain: 'Health',
    impact: 9,
    effort: 4,
    confidence: 0.82,
    evidenceCount: 47,
    populationScope: 'Adults 40–70',
    timeToEffect: '6–12 weeks',
    relatedClaims: ['CLM-001'],
  },
  {
    id: 'INT-002',
    interventionName: 'Sleep extension to 7–9 hours',
    domain: 'Health',
    impact: 8,
    effort: 3,
    confidence: 0.91,
    evidenceCount: 82,
    populationScope: 'Adults 20–60',
    timeToEffect: '2–4 weeks',
    relatedClaims: ['CLM-002'],
  },
  {
    id: 'INT-003',
    interventionName: 'Progressive tax restructuring',
    domain: 'Economics',
    impact: 7,
    effort: 9,
    confidence: 0.65,
    evidenceCount: 23,
    populationScope: 'OECD countries',
    timeToEffect: '12–36 months',
    relatedClaims: ['CLM-003'],
  },
  {
    id: 'INT-004',
    interventionName: 'Urban green space investment',
    domain: 'Environment',
    impact: 6,
    effort: 7,
    confidence: 0.74,
    evidenceCount: 31,
    populationScope: 'Urban populations',
    timeToEffect: '6–24 months',
    relatedClaims: ['CLM-004'],
  },
  {
    id: 'INT-005',
    interventionName: 'Daily cold exposure (2–5 min)',
    domain: 'Health',
    impact: 5,
    effort: 2,
    confidence: 0.58,
    evidenceCount: 12,
    populationScope: 'Healthy adults',
    timeToEffect: '4–8 weeks',
    relatedClaims: ['CLM-005'],
  },
  {
    id: 'INT-006',
    interventionName: 'Mediterranean diet adoption',
    domain: 'Health',
    impact: 8,
    effort: 5,
    confidence: 0.88,
    evidenceCount: 64,
    populationScope: 'Adults 30+',
    timeToEffect: '3–6 months',
    relatedClaims: ['CLM-001', 'CLM-002'],
  },
  {
    id: 'INT-007',
    interventionName: 'Meditation 20 min/day',
    domain: 'Health',
    impact: 5,
    effort: 2,
    confidence: 0.72,
    evidenceCount: 38,
    populationScope: 'General population',
    timeToEffect: '4–8 weeks',
    relatedClaims: ['CLM-004'],
  },
];

// ─── Pre-built seed data ───

export const SEED_QUESTION_UNIVERSES: QuestionUniverse[] = SEED_CLAIMS.map(c =>
  generateQuestionUniverse(c)
);

export const SEED_RANKED_INTERVENTIONS: InterventionScore[] = rankInterventions(SEED_INTERVENTIONS);

export const SEED_KNOWLEDGE_OBJECTS: KnowledgeObject[] = [
  buildKnowledgeObject(SEED_CLAIMS[0], '2–5 years increase', 0.82, 'Meta-analysis', ['muscle mass', 'mitochondrial density', 'metabolic health']),
  buildKnowledgeObject(SEED_CLAIMS[1], '30–50% increase in CRP', 0.91, 'Systematic review', ['CRP', 'IL-6', 'cortisol']),
  buildKnowledgeObject(SEED_CLAIMS[2], '3–7 point Gini reduction', 0.65, 'Quasi-experimental', ['Gini coefficient', 'tax revenue', 'transfer payments']),
  buildKnowledgeObject(SEED_CLAIMS[3], '15–25% stress reduction', 0.74, 'Observational studies', ['cortisol', 'anxiety scores', 'perceived stress']),
  buildKnowledgeObject(SEED_CLAIMS[4], '10–15% BMR increase', 0.58, 'RCTs (small sample)', ['brown fat activation', 'norepinephrine', 'thermogenesis']),
];

export const SEED_KNOWLEDGE_GRAPH: KnowledgeGraphNode[] = buildKnowledgeGraph(SEED_QUESTION_UNIVERSES);

export { SEED_CLAIMS };
