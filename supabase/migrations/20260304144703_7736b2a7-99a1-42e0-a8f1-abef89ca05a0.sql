
-- ============================================================================
-- GLOBAL REALITY MODEL (GRM) — Database Schema
-- ============================================================================

-- GRM Entities
CREATE TABLE public.grm_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'population',
  domain TEXT NOT NULL,
  description TEXT,
  aliases TEXT[] DEFAULT '{}',
  parent_entity_id UUID REFERENCES public.grm_entities(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Variables
CREATE TABLE public.grm_variables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  variable_type TEXT NOT NULL DEFAULT 'biomarker',
  domain TEXT NOT NULL,
  unit TEXT,
  min_value NUMERIC,
  max_value NUMERIC,
  geographic_scope TEXT,
  description TEXT,
  measurement_frequency TEXT,
  linked_entity_id UUID REFERENCES public.grm_entities(id),
  linked_kpi_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Interventions
CREATE TABLE public.grm_interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  intervention_type TEXT NOT NULL DEFAULT 'lifestyle_change',
  domain TEXT NOT NULL,
  description TEXT,
  target_variable_ids TEXT[] DEFAULT '{}',
  population_scope TEXT,
  geographic_scope TEXT,
  estimated_cost_level TEXT,
  reversibility TEXT NOT NULL DEFAULT 'reversible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Outcomes
CREATE TABLE public.grm_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  measurement_variable_id UUID REFERENCES public.grm_variables(id),
  is_terminal BOOLEAN NOT NULL DEFAULT true,
  desirability TEXT NOT NULL DEFAULT 'neutral',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Causal Links — The core graph
CREATE TABLE public.grm_causal_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_label TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_label TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'positive',
  strength NUMERIC NOT NULL DEFAULT 0.5,
  confidence TEXT NOT NULL DEFAULT 'moderate',
  confidence_score NUMERIC NOT NULL DEFAULT 0.5,
  effect_delay_min_days INTEGER,
  effect_delay_max_days INTEGER,
  effect_duration TEXT NOT NULL DEFAULT 'medium_term',
  is_persistent BOOLEAN NOT NULL DEFAULT false,
  effect_variance NUMERIC,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  evidence_quality TEXT NOT NULL DEFAULT 'moderate',
  population_scope TEXT,
  population_modifiers JSONB DEFAULT '[]',
  source_domain TEXT NOT NULL,
  target_domain TEXT NOT NULL,
  is_cross_domain BOOLEAN NOT NULL DEFAULT false,
  claim_ids TEXT[] DEFAULT '{}',
  mechanism_description TEXT,
  falsifiable BOOLEAN NOT NULL DEFAULT true,
  falsification_criteria TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Discoveries
CREATE TABLE public.grm_discoveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discovery_type TEXT NOT NULL DEFAULT 'indirect_chain',
  chain TEXT[] NOT NULL DEFAULT '{}',
  chain_labels TEXT[] NOT NULL DEFAULT '{}',
  domains_crossed TEXT[] NOT NULL DEFAULT '{}',
  total_strength NUMERIC NOT NULL DEFAULT 0,
  total_confidence NUMERIC NOT NULL DEFAULT 0,
  inferred_statement TEXT NOT NULL,
  potential_intervention_points TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'detected',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRM Simulation Log
CREATE TABLE public.grm_simulation_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intervention_id TEXT NOT NULL,
  magnitude_change_percent NUMERIC NOT NULL,
  target_population TEXT,
  time_horizon_months INTEGER NOT NULL DEFAULT 12,
  results JSONB NOT NULL DEFAULT '{}',
  total_nodes_affected INTEGER NOT NULL DEFAULT 0,
  domains_impacted TEXT[] DEFAULT '{}',
  run_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_grm_entities_domain ON public.grm_entities(domain);
CREATE INDEX idx_grm_variables_domain ON public.grm_variables(domain);
CREATE INDEX idx_grm_causal_links_source ON public.grm_causal_links(source_id);
CREATE INDEX idx_grm_causal_links_target ON public.grm_causal_links(target_id);
CREATE INDEX idx_grm_causal_links_cross ON public.grm_causal_links(is_cross_domain) WHERE is_cross_domain = true;
CREATE INDEX idx_grm_discoveries_status ON public.grm_discoveries(status);

-- RLS (public read, authenticated write)
ALTER TABLE public.grm_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_causal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grm_simulation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read grm_entities" ON public.grm_entities FOR SELECT USING (true);
CREATE POLICY "Public read grm_variables" ON public.grm_variables FOR SELECT USING (true);
CREATE POLICY "Public read grm_interventions" ON public.grm_interventions FOR SELECT USING (true);
CREATE POLICY "Public read grm_outcomes" ON public.grm_outcomes FOR SELECT USING (true);
CREATE POLICY "Public read grm_causal_links" ON public.grm_causal_links FOR SELECT USING (true);
CREATE POLICY "Public read grm_discoveries" ON public.grm_discoveries FOR SELECT USING (true);
CREATE POLICY "Public read grm_simulation_log" ON public.grm_simulation_log FOR SELECT USING (true);

CREATE POLICY "Auth write grm_entities" ON public.grm_entities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_variables" ON public.grm_variables FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_interventions" ON public.grm_interventions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_outcomes" ON public.grm_outcomes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_causal_links" ON public.grm_causal_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_discoveries" ON public.grm_discoveries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write grm_simulation_log" ON public.grm_simulation_log FOR INSERT TO authenticated WITH CHECK (true);
