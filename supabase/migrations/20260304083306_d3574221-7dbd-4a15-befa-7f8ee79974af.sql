
-- ============================================================================
-- TRIPLE-LAYER KNOWLEDGE MODULE SYSTEM
-- ============================================================================

-- Module registry
CREATE TABLE public.knowledge_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','deprecated')),
  version INTEGER NOT NULL DEFAULT 1,
  ontology_schema JSONB NOT NULL DEFAULT '{}',
  cross_module_links TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DATA LAYER: Domain observations (raw facts)
CREATE TABLE public.domain_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.knowledge_modules(id) ON DELETE CASCADE,
  observation_code TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('study','api','dataset','report','sensor','survey')),
  source_reference TEXT NOT NULL,
  source_organization TEXT,
  source_url TEXT,
  population_descriptor TEXT,
  population_size INTEGER,
  measurement_type TEXT NOT NULL,
  measurement_value NUMERIC,
  measurement_unit TEXT,
  effect_size NUMERIC,
  confidence_interval_lower NUMERIC,
  confidence_interval_upper NUMERIC,
  p_value NUMERIC,
  methodology TEXT,
  geo_scope TEXT DEFAULT 'global',
  geo_code TEXT,
  time_observed TIMESTAMPTZ,
  time_period_start DATE,
  time_period_end DATE,
  raw_metadata JSONB DEFAULT '{}',
  is_replicated BOOLEAN DEFAULT false,
  replication_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KNOWLEDGE LAYER: Claims derived from observations
CREATE TYPE public.claim_status AS ENUM ('proposed','under_review','supported','contested','refuted','superseded');
CREATE TYPE public.evidence_quality AS ENUM ('very_low','low','moderate','high','very_high');

CREATE TABLE public.knowledge_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.knowledge_modules(id) ON DELETE CASCADE,
  claim_code TEXT NOT NULL,
  statement TEXT NOT NULL,
  statement_sv TEXT,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('descriptive','correlational','mechanistic','intervention_effect','prevalence')),
  status public.claim_status NOT NULL DEFAULT 'proposed',
  confidence_score NUMERIC NOT NULL DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  evidence_quality public.evidence_quality NOT NULL DEFAULT 'low',
  population_scope TEXT,
  geographic_scope TEXT DEFAULT 'global',
  temporal_scope TEXT,
  effect_size NUMERIC,
  effect_size_unit TEXT,
  uncertainty_description TEXT,
  limitations TEXT[],
  superseded_by UUID REFERENCES public.knowledge_claims(id),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Evidence links: observations supporting/contradicting claims
CREATE TABLE public.evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES public.knowledge_claims(id) ON DELETE CASCADE,
  observation_id UUID NOT NULL REFERENCES public.domain_observations(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('supports','contradicts','qualifies','neutral')),
  strength NUMERIC NOT NULL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  replication_weight NUMERIC DEFAULT 1.0,
  bias_flags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(claim_id, observation_id)
);

-- INTELLIGENCE LAYER: Decision models & rankings
CREATE TABLE public.intervention_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.knowledge_modules(id) ON DELETE CASCADE,
  ranking_code TEXT NOT NULL,
  question TEXT NOT NULL,
  question_sv TEXT,
  methodology TEXT NOT NULL,
  interventions JSONB NOT NULL DEFAULT '[]',
  ranking_criteria JSONB NOT NULL DEFAULT '{}',
  limitations TEXT[],
  confidence_score NUMERIC DEFAULT 0.5,
  valid_for_population TEXT,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- META LAYER: Self-analysis
CREATE TABLE public.module_meta_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.knowledge_modules(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('weak_claims','data_gaps','bias_scan','replication_deficit','cross_domain_opportunity')),
  findings JSONB NOT NULL DEFAULT '[]',
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  auto_generated BOOLEAN DEFAULT true,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cross-module variable bridges
CREATE TABLE public.cross_module_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module_id UUID NOT NULL REFERENCES public.knowledge_modules(id),
  target_module_id UUID NOT NULL REFERENCES public.knowledge_modules(id),
  variable_name TEXT NOT NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('shared_input','shared_output','mediator','moderator','confounder')),
  description TEXT,
  strength NUMERIC DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_module_id, target_module_id, variable_name)
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_meta_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_module_variables ENABLE ROW LEVEL SECURITY;

-- Public read, authenticated write
CREATE POLICY "Public read modules" ON public.knowledge_modules FOR SELECT USING (true);
CREATE POLICY "Auth write modules" ON public.knowledge_modules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update modules" ON public.knowledge_modules FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Public read observations" ON public.domain_observations FOR SELECT USING (true);
CREATE POLICY "Auth write observations" ON public.domain_observations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Public read claims" ON public.knowledge_claims FOR SELECT USING (true);
CREATE POLICY "Auth write claims" ON public.knowledge_claims FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update claims" ON public.knowledge_claims FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Public read evidence" ON public.evidence_links FOR SELECT USING (true);
CREATE POLICY "Auth write evidence" ON public.evidence_links FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Public read rankings" ON public.intervention_rankings FOR SELECT USING (true);
CREATE POLICY "Auth write rankings" ON public.intervention_rankings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Public read meta" ON public.module_meta_analysis FOR SELECT USING (true);
CREATE POLICY "Auth write meta" ON public.module_meta_analysis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update meta" ON public.module_meta_analysis FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Public read cross vars" ON public.cross_module_variables FOR SELECT USING (true);
CREATE POLICY "Auth write cross vars" ON public.cross_module_variables FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX idx_domain_obs_module ON public.domain_observations(module_id);
CREATE INDEX idx_claims_module ON public.knowledge_claims(module_id);
CREATE INDEX idx_claims_status ON public.knowledge_claims(status);
CREATE INDEX idx_evidence_claim ON public.evidence_links(claim_id);
CREATE INDEX idx_evidence_obs ON public.evidence_links(observation_id);
CREATE INDEX idx_rankings_module ON public.intervention_rankings(module_id);
CREATE INDEX idx_meta_module ON public.module_meta_analysis(module_id);
CREATE INDEX idx_cross_vars_source ON public.cross_module_variables(source_module_id);
CREATE INDEX idx_cross_vars_target ON public.cross_module_variables(target_module_id);
