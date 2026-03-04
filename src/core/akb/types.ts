/**
 * AUTONOMOUS KNOWLEDGE BUILDER (AKB)
 * 
 * Distribution Layer: Claim → Questions → Machine-readable Output → SEO Dominance
 * 
 * Four operational layers:
 * 1. Knowledge ingestion (data → claims)
 * 2. Epistemic validation (evidence → confidence)
 * 3. Intelligence layer (prioritization → decisions)
 * 4. Distribution layer (SEO / machine-readable / search dominance)
 */

// ─── Question Universe Generator (QUG) ───

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'expert';

export type QuestionCategory =
  | 'definition'
  | 'comparison'
  | 'causal'
  | 'practical'
  | 'myth'
  | 'counterfactual'
  | 'population'
  | 'temporal'
  | 'mechanism'
  | 'quantitative';

export interface GeneratedQuestion {
  id: string;
  claimId: string;
  questionText: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  semanticHash: string;
  searchVolEstimate: number;
  languageCode: string;
  parentQuestionId?: string;
}

export interface QuestionUniverse {
  claimId: string;
  claimStatement: string;
  domain: string;
  totalQuestions: number;
  coverageScore: number; // 0–1 how much of search space is covered
  questions: GeneratedQuestion[];
  generatedAt: string;
}

// ─── Machine-Readable Knowledge Output ───

export type OutputFormat = 'json_ld' | 'schema_org' | 'sdmx' | 'raw_json';

export interface KnowledgeObject {
  id: string;
  claim: string;
  effectSize: string;
  population: string;
  confidence: number;
  evidenceLevel: string;
  relatedVariables: string[];
  temporalScope: { start: string; end: string };
  geographicScope: string;
  sources: string[];
  machineFormats: OutputFormat[];
  lastVerified: string;
}

export interface StructuredOutput {
  '@context': string;
  '@type': string;
  claim: KnowledgeObject;
  questions: GeneratedQuestion[];
  graph: KnowledgeGraphNode[];
}

// ─── Priority Validation Engine (PVE) ───

export interface InterventionScore {
  id: string;
  interventionName: string;
  domain: string;
  impact: number;       // 1–10
  effort: number;       // 1–10
  confidence: number;   // 0–1
  priorityScore: number; // (impact × confidence) / effort
  rank: number;
  evidenceCount: number;
  populationScope: string;
  timeToEffect: string;
  relatedClaims: string[];
}

// ─── Knowledge Graph SEO Structure ───

export interface KnowledgeGraphNode {
  id: string;
  type: 'domain' | 'topic' | 'subtopic' | 'claim' | 'question';
  label: string;
  parentId?: string;
  childCount: number;
  searchRelevance: number;
  url: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relation: 'contains' | 'answers' | 'supports' | 'contradicts' | 'related';
}

// ─── Publishing Pipeline ───

export type PublishStatus = 'draft' | 'review' | 'published' | 'archived';

export interface PublishableContent {
  id: string;
  type: 'long_form' | 'qa_page' | 'knowledge_object' | 'data_feed';
  title: string;
  slug: string;
  status: PublishStatus;
  claimId: string;
  questionIds: string[];
  machineReadable: boolean;
  seoScore: number;
  lastPublished?: string;
}

// ─── AKB System Stats ───

export interface AKBSystemStats {
  totalClaims: number;
  totalQuestions: number;
  totalPublished: number;
  avgCoverage: number;
  avgPriorityScore: number;
  domainBreakdown: Record<string, number>;
  publishPipeline: Record<PublishStatus, number>;
}
