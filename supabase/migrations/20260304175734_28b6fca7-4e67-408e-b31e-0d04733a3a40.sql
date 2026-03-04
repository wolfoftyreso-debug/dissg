
-- Question Universes: stores generated question sets per claim
CREATE TABLE public.akb_question_universes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id TEXT NOT NULL,
  claim_statement TEXT NOT NULL,
  domain TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  coverage_score NUMERIC(4,3) NOT NULL DEFAULT 0,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated questions
CREATE TABLE public.akb_generated_questions (
  id TEXT PRIMARY KEY,
  universe_id UUID REFERENCES public.akb_question_universes(id) ON DELETE CASCADE NOT NULL,
  claim_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  semantic_hash TEXT NOT NULL,
  search_vol_estimate INTEGER DEFAULT 0,
  language_code TEXT NOT NULL DEFAULT 'en',
  parent_question_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Priority-scored interventions
CREATE TABLE public.akb_intervention_scores (
  id TEXT PRIMARY KEY,
  intervention_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  impact INTEGER NOT NULL,
  effort INTEGER NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  priority_score NUMERIC(6,2) NOT NULL,
  rank INTEGER NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  population_scope TEXT,
  time_to_effect TEXT,
  related_claims TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Machine-readable knowledge objects
CREATE TABLE public.akb_knowledge_objects (
  id TEXT PRIMARY KEY,
  claim TEXT NOT NULL,
  effect_size TEXT,
  population TEXT,
  confidence NUMERIC(4,3) NOT NULL,
  evidence_level TEXT NOT NULL,
  related_variables TEXT[] DEFAULT '{}',
  temporal_scope JSONB,
  geographic_scope TEXT DEFAULT 'Global',
  sources TEXT[] DEFAULT '{}',
  machine_formats TEXT[] DEFAULT '{}',
  last_verified TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Knowledge graph nodes for SEO structure
CREATE TABLE public.akb_graph_nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  parent_id TEXT,
  child_count INTEGER NOT NULL DEFAULT 0,
  search_relevance NUMERIC(4,3) NOT NULL DEFAULT 0,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publishing pipeline
CREATE TABLE public.akb_publishable_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  claim_id TEXT,
  question_ids TEXT[] DEFAULT '{}',
  machine_readable BOOLEAN DEFAULT true,
  seo_score NUMERIC(4,1) DEFAULT 0,
  last_published TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.akb_question_universes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akb_generated_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akb_intervention_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akb_knowledge_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akb_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akb_publishable_content ENABLE ROW LEVEL SECURITY;

-- Public read access (knowledge is public)
CREATE POLICY "Public read akb_question_universes" ON public.akb_question_universes FOR SELECT USING (true);
CREATE POLICY "Public read akb_generated_questions" ON public.akb_generated_questions FOR SELECT USING (true);
CREATE POLICY "Public read akb_intervention_scores" ON public.akb_intervention_scores FOR SELECT USING (true);
CREATE POLICY "Public read akb_knowledge_objects" ON public.akb_knowledge_objects FOR SELECT USING (true);
CREATE POLICY "Public read akb_graph_nodes" ON public.akb_graph_nodes FOR SELECT USING (true);
CREATE POLICY "Public read akb_publishable_content" ON public.akb_publishable_content FOR SELECT USING (true);

-- Index for semantic dedup
CREATE INDEX idx_akb_questions_semantic_hash ON public.akb_generated_questions(semantic_hash);
CREATE INDEX idx_akb_questions_category ON public.akb_generated_questions(category);
CREATE INDEX idx_akb_graph_parent ON public.akb_graph_nodes(parent_id);
