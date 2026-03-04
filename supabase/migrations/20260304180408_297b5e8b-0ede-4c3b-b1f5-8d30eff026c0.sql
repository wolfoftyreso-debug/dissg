
-- GDIS: Global Problems
CREATE TABLE public.gdis_problems (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'moderate',
  population_affected BIGINT NOT NULL DEFAULT 0,
  dalys_or_equivalent BIGINT NOT NULL DEFAULT 0,
  trend_direction TEXT NOT NULL DEFAULT 'stable',
  related_variables TEXT[] DEFAULT '{}',
  related_claims TEXT[] DEFAULT '{}',
  geographic_scope TEXT DEFAULT 'Global',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GDIS: Interventions
CREATE TABLE public.gdis_interventions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  target_problems TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'experimental',
  cost_level TEXT NOT NULL DEFAULT 'medium',
  scalability TEXT NOT NULL DEFAULT 'local',
  time_to_effect TEXT,
  evidence_grade TEXT NOT NULL,
  effect_size TEXT,
  population TEXT,
  side_effects TEXT[] DEFAULT '{}',
  implementation_barriers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GDIS: Priority Scores
CREATE TABLE public.gdis_priority_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id TEXT REFERENCES public.gdis_interventions(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT REFERENCES public.gdis_problems(id) ON DELETE CASCADE NOT NULL,
  impact INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  evidence INTEGER NOT NULL,
  scalability INTEGER NOT NULL,
  priority_score NUMERIC(8,2) NOT NULL,
  rank INTEGER NOT NULL,
  rationale TEXT,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GDIS: Causal Links
CREATE TABLE public.gdis_causal_links (
  id TEXT PRIMARY KEY,
  from_variable TEXT NOT NULL,
  to_variable TEXT NOT NULL,
  mechanism TEXT,
  strength NUMERIC(4,3) NOT NULL DEFAULT 0,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
  lag_months INTEGER,
  bidirectional BOOLEAN DEFAULT false,
  domains TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gdis_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdis_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdis_priority_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdis_causal_links ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read gdis_problems" ON public.gdis_problems FOR SELECT USING (true);
CREATE POLICY "Public read gdis_interventions" ON public.gdis_interventions FOR SELECT USING (true);
CREATE POLICY "Public read gdis_priority_scores" ON public.gdis_priority_scores FOR SELECT USING (true);
CREATE POLICY "Public read gdis_causal_links" ON public.gdis_causal_links FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_gdis_problems_domain ON public.gdis_problems(domain);
CREATE INDEX idx_gdis_problems_severity ON public.gdis_problems(severity);
CREATE INDEX idx_gdis_interventions_domain ON public.gdis_interventions(domain);
CREATE INDEX idx_gdis_priority_problem ON public.gdis_priority_scores(problem_id);
