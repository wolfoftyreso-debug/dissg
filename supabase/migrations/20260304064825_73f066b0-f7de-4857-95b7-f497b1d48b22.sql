
-- ============================================================
-- 1. DAG-BASED CAUSAL MODEL
-- ============================================================

-- Causal graphs (containers for DAGs)
CREATE TABLE public.causal_graphs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  country_code TEXT REFERENCES public.countries(code),
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Causal nodes (vertices in DAG)
CREATE TABLE public.causal_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  graph_id UUID NOT NULL REFERENCES public.causal_graphs(id) ON DELETE CASCADE,
  node_code TEXT NOT NULL,
  label TEXT NOT NULL,
  node_type TEXT NOT NULL DEFAULT 'variable',
  entity_ref_type TEXT,
  entity_ref_id TEXT,
  kpi_id UUID REFERENCES public.kpi_definitions(id),
  observation_id UUID REFERENCES public.observations(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(graph_id, node_code)
);

-- Causal edges (directed edges in DAG)
CREATE TABLE public.causal_edges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  graph_id UUID NOT NULL REFERENCES public.causal_graphs(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES public.causal_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES public.causal_nodes(id) ON DELETE CASCADE,
  edge_type TEXT NOT NULL DEFAULT 'causal',
  strength NUMERIC(4,2),
  confidence NUMERIC(4,2),
  lag_months INTEGER,
  evidence_summary TEXT,
  evidence_sources TEXT[],
  mechanism TEXT,
  is_falsifiable BOOLEAN DEFAULT true,
  falsification_criteria TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_self_loop CHECK (source_node_id != target_node_id),
  UNIQUE(graph_id, source_node_id, target_node_id)
);

CREATE INDEX idx_causal_nodes_graph ON public.causal_nodes(graph_id);
CREATE INDEX idx_causal_edges_graph ON public.causal_edges(graph_id);
CREATE INDEX idx_causal_edges_source ON public.causal_edges(source_node_id);
CREATE INDEX idx_causal_edges_target ON public.causal_edges(target_node_id);

-- ============================================================
-- 2. ACCOUNTABILITY & SMART-GOALS LAYER
-- ============================================================

CREATE TABLE public.accountability_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  observation_id UUID REFERENCES public.observations(id),
  fault_code TEXT,
  assigned_department TEXT NOT NULL,
  assigned_role TEXT,
  responsible_entity TEXT NOT NULL,
  mandate_reference TEXT,
  status TEXT NOT NULL DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  escalation_level INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.smart_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.accountability_assignments(id) ON DELETE CASCADE,
  goal_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  specific TEXT NOT NULL,
  measurable_kpi_id UUID REFERENCES public.kpi_definitions(id),
  measurable_target NUMERIC,
  measurable_unit TEXT,
  achievable_rationale TEXT,
  relevant_observation_ids UUID[],
  time_bound_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_bound_end TIMESTAMPTZ NOT NULL,
  baseline_value NUMERIC,
  current_value NUMERIC,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.goal_progress_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.smart_goals(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  value NUMERIC NOT NULL,
  source TEXT NOT NULL,
  note TEXT,
  auto_calculated BOOLEAN DEFAULT false
);

CREATE INDEX idx_accountability_observation ON public.accountability_assignments(observation_id);
CREATE INDEX idx_smart_goals_assignment ON public.smart_goals(assignment_id);
CREATE INDEX idx_goal_progress_goal ON public.goal_progress_log(goal_id);

-- ============================================================
-- 3. CALIBRATION / BRIER SCORES
-- ============================================================

CREATE TABLE public.prediction_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_code TEXT NOT NULL,
  source_entity_type TEXT NOT NULL,
  source_entity_id TEXT NOT NULL,
  predicted_outcome TEXT NOT NULL,
  predicted_probability NUMERIC(5,4) NOT NULL CHECK (predicted_probability >= 0 AND predicted_probability <= 1),
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolution_deadline TIMESTAMPTZ,
  actual_outcome BOOLEAN,
  resolved_at TIMESTAMPTZ,
  brier_score NUMERIC(7,6),
  model_version TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.calibration_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  model_version TEXT NOT NULL,
  total_predictions INTEGER NOT NULL DEFAULT 0,
  resolved_predictions INTEGER NOT NULL DEFAULT 0,
  mean_brier_score NUMERIC(7,6),
  calibration_buckets JSONB NOT NULL DEFAULT '[]',
  overconfidence_index NUMERIC(5,4),
  underconfidence_index NUMERIC(5,4),
  reliability_score NUMERIC(5,4),
  resolution_score NUMERIC(5,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date, model_version)
);

CREATE INDEX idx_prediction_log_source ON public.prediction_log(source_entity_type, source_entity_id);
CREATE INDEX idx_prediction_log_resolved ON public.prediction_log(resolved_at) WHERE resolved_at IS NOT NULL;

-- ============================================================
-- RLS POLICIES (Public read, authenticated write)
-- ============================================================

ALTER TABLE public.causal_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.causal_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.causal_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "Public read causal_graphs" ON public.causal_graphs FOR SELECT USING (true);
CREATE POLICY "Public read causal_nodes" ON public.causal_nodes FOR SELECT USING (true);
CREATE POLICY "Public read causal_edges" ON public.causal_edges FOR SELECT USING (true);
CREATE POLICY "Public read accountability" ON public.accountability_assignments FOR SELECT USING (true);
CREATE POLICY "Public read smart_goals" ON public.smart_goals FOR SELECT USING (true);
CREATE POLICY "Public read goal_progress" ON public.goal_progress_log FOR SELECT USING (true);
CREATE POLICY "Public read predictions" ON public.prediction_log FOR SELECT USING (true);
CREATE POLICY "Public read calibration" ON public.calibration_snapshots FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "Auth insert causal_graphs" ON public.causal_graphs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update causal_graphs" ON public.causal_graphs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert causal_nodes" ON public.causal_nodes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update causal_nodes" ON public.causal_nodes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert causal_edges" ON public.causal_edges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update causal_edges" ON public.causal_edges FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert accountability" ON public.accountability_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update accountability" ON public.accountability_assignments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert smart_goals" ON public.smart_goals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update smart_goals" ON public.smart_goals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert goal_progress" ON public.goal_progress_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth insert predictions" ON public.prediction_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update predictions" ON public.prediction_log FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert calibration" ON public.calibration_snapshots FOR INSERT TO authenticated WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_causal_graphs_updated_at BEFORE UPDATE ON public.causal_graphs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accountability_updated_at BEFORE UPDATE ON public.accountability_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smart_goals_updated_at BEFORE UPDATE ON public.smart_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to compute Brier score on resolution
CREATE OR REPLACE FUNCTION public.compute_brier_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.actual_outcome IS NOT NULL AND NEW.resolved_at IS NOT NULL THEN
    NEW.brier_score := POWER(NEW.predicted_probability - (CASE WHEN NEW.actual_outcome THEN 1.0 ELSE 0.0 END), 2);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER compute_brier_on_resolve
BEFORE UPDATE ON public.prediction_log
FOR EACH ROW
WHEN (NEW.actual_outcome IS DISTINCT FROM OLD.actual_outcome)
EXECUTE FUNCTION public.compute_brier_score();
