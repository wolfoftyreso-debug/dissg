-- =============================================
-- WAVE 6: INSIGHT, EFFECT & LEARNING ENGINE
-- =============================================

-- BLOCK AV: Public Data Registry
CREATE TABLE public.public_data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'government_statistics', 'international_org', 'municipal_portal',
    'national_open_data', 'parliament', 'budget', 'legislation',
    'procurement', 'policy_document', 'press_release', 'news',
    'scientific_metadata', 'geodata', 'infrastructure', 'market_macro'
  )),
  extraction_mode TEXT NOT NULL CHECK (extraction_mode IN (
    'api', 'rss', 'html_scrape', 'pdf_extract', 'bulk_csv', 'json_feed'
  )),
  country_code TEXT,
  base_url TEXT,
  api_endpoint TEXT,
  update_frequency TEXT DEFAULT 'daily',
  last_extracted_at TIMESTAMPTZ,
  extraction_status TEXT DEFAULT 'pending',
  record_count INTEGER DEFAULT 0,
  quality_score NUMERIC(3,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AW: Effect Discovery Engine
CREATE TABLE public.discovered_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  effect_type TEXT NOT NULL CHECK (effect_type IN (
    'before_after', 'trend_break', 'historical_deviation',
    'difference_in_difference', 'lagged_effect', 'diminishing_effect',
    'amplifying_effect', 'null_effect'
  )),
  source_action_id UUID,
  target_kpi_id UUID REFERENCES kpi_definitions(id),
  target_index_code TEXT,
  
  -- Effect measurement
  effect_magnitude NUMERIC(10,4),
  effect_direction TEXT CHECK (effect_direction IN ('positive', 'negative', 'neutral')),
  time_lag_months INTEGER,
  duration_months INTEGER,
  
  -- Methodology (OBLIGATORISK)
  analysis_method TEXT NOT NULL,
  assumptions JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC(3,2) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  limitations TEXT[] DEFAULT '{}',
  
  -- Context
  geo_scope TEXT,
  time_period_start DATE,
  time_period_end DATE,
  sample_size INTEGER,
  
  -- Validation
  p_value NUMERIC(6,5),
  standard_error NUMERIC(10,4),
  replications INTEGER DEFAULT 0,
  counterexamples INTEGER DEFAULT 0,
  
  discovered_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false
);

-- BLOCK AX: Action-Outcome Graph
CREATE TABLE public.policy_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN (
    'legislation', 'policy_decision', 'budget_change',
    'reform', 'investment', 'reduction', 'regulation', 'deregulation'
  )),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Temporal
  announced_date DATE,
  effective_date DATE NOT NULL,
  end_date DATE,
  
  -- Scope
  geo_scope TEXT NOT NULL,
  sector TEXT,
  target_population TEXT,
  
  -- Responsibility
  responsible_body TEXT NOT NULL,
  decision_reference TEXT,
  source_url TEXT,
  
  -- Budget impact
  budget_amount_sek BIGINT,
  budget_type TEXT CHECK (budget_type IN ('one_time', 'annual', 'multi_year')),
  
  -- Linkage
  related_kpi_ids TEXT[] DEFAULT '{}',
  expected_effects JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.action_outcome_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES policy_actions(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN ('kpi', 'index', 'event', 'news_intensity')),
  outcome_reference_id TEXT NOT NULL,
  
  -- Observed pattern
  observation_summary TEXT NOT NULL,
  pattern_type TEXT CHECK (pattern_type IN (
    'immediate_change', 'gradual_shift', 'delayed_response',
    'temporary_spike', 'permanent_shift', 'no_observable_change'
  )),
  
  -- Measurement
  baseline_value NUMERIC(12,4),
  baseline_period TEXT,
  observed_value NUMERIC(12,4),
  observed_period TEXT,
  change_percent NUMERIC(8,4),
  
  -- Confidence
  attribution_confidence NUMERIC(3,2) CHECK (attribution_confidence BETWEEN 0 AND 1),
  confounding_factors TEXT[] DEFAULT '{}',
  methodology_note TEXT,
  
  linked_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AY: Learning & Pattern Library
CREATE TABLE public.learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_code TEXT UNIQUE NOT NULL,
  
  -- Core content
  summary TEXT NOT NULL CHECK (length(summary) <= 200),
  detailed_description TEXT,
  
  -- Context (where/when)
  context_geo TEXT[] NOT NULL,
  context_time_start DATE NOT NULL,
  context_time_end DATE,
  context_conditions JSONB NOT NULL DEFAULT '{}',
  
  -- Observed effect
  observed_effect TEXT NOT NULL,
  effect_magnitude TEXT,
  effect_confidence NUMERIC(3,2) NOT NULL CHECK (effect_confidence BETWEEN 0 AND 1),
  
  -- Conditions for effect
  required_conditions TEXT[] DEFAULT '{}',
  enabling_factors TEXT[] DEFAULT '{}',
  blocking_factors TEXT[] DEFAULT '{}',
  
  -- Validation
  replications INTEGER DEFAULT 1,
  replication_contexts JSONB DEFAULT '[]',
  counterexamples INTEGER DEFAULT 0,
  counterexample_contexts JSONB DEFAULT '[]',
  
  -- Source
  source_effect_ids UUID[] DEFAULT '{}',
  source_action_ids UUID[] DEFAULT '{}',
  
  -- Quality
  evidence_grade TEXT CHECK (evidence_grade IN ('high', 'moderate', 'low', 'preliminary')),
  last_validated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.learning_replications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_id UUID REFERENCES learnings(id) ON DELETE CASCADE,
  
  -- Replication context
  geo_context TEXT NOT NULL,
  time_context TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  
  -- Result
  replicated BOOLEAN NOT NULL,
  effect_observed TEXT,
  deviation_from_original NUMERIC(8,4),
  deviation_explanation TEXT,
  
  -- Source
  source_effect_id UUID REFERENCES discovered_effects(id),
  
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AZ: Why Engine
CREATE TABLE public.causal_chains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_code TEXT UNIQUE NOT NULL,
  outcome_description TEXT NOT NULL,
  
  -- Chain structure (ordered)
  chain_steps JSONB NOT NULL, -- [{factor, moved_at, strength, lag_months}]
  
  -- Timing
  first_movement_date DATE,
  outcome_observed_date DATE,
  total_chain_duration_months INTEGER,
  
  -- Confidence
  chain_confidence NUMERIC(3,2) CHECK (chain_confidence BETWEEN 0 AND 1),
  uncertainty_factors TEXT[] DEFAULT '{}',
  alternative_explanations JSONB DEFAULT '[]',
  
  -- Linkage
  related_kpi_ids TEXT[] DEFAULT '{}',
  related_action_ids UUID[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK BA: Insight Surfacing
CREATE TABLE public.surfaced_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_code TEXT UNIQUE NOT NULL,
  
  -- Content
  summary_line TEXT NOT NULL CHECK (length(summary_line) <= 150),
  visualization_type TEXT DEFAULT 'line_chart',
  visualization_config JSONB DEFAULT '{}',
  
  -- Surfacing criteria
  population_affected INTEGER,
  is_new BOOLEAN DEFAULT true,
  is_stable BOOLEAN DEFAULT false,
  is_replicated BOOLEAN DEFAULT false,
  data_quality_score NUMERIC(3,2),
  
  -- Priority
  priority_score NUMERIC(5,2) DEFAULT 0,
  display_tier INTEGER DEFAULT 3 CHECK (display_tier BETWEEN 1 AND 5),
  
  -- Source
  source_type TEXT CHECK (source_type IN ('learning', 'effect', 'pattern', 'trend')),
  source_id UUID,
  
  -- Links
  why_explanation_id UUID REFERENCES causal_chains(id),
  method_description TEXT,
  similar_case_ids UUID[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  surfaced_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK BB: Truth & Limits Layer
CREATE TABLE public.knowledge_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- What we know
  known_facts JSONB NOT NULL DEFAULT '[]',
  known_confidence NUMERIC(3,2),
  
  -- What we don't know
  unknown_aspects TEXT[] DEFAULT '{}',
  data_gaps TEXT[] DEFAULT '{}',
  
  -- Assumptions
  explicit_assumptions TEXT[] DEFAULT '{}',
  implicit_assumptions TEXT[] DEFAULT '{}',
  
  -- Missing data
  missing_data_types TEXT[] DEFAULT '{}',
  missing_time_periods TEXT[] DEFAULT '{}',
  missing_geographies TEXT[] DEFAULT '{}',
  
  -- Caveats
  caveats TEXT[] DEFAULT '{}',
  methodological_limits TEXT[] DEFAULT '{}',
  
  assessed_at TIMESTAMPTZ DEFAULT now(),
  assessor TEXT DEFAULT 'system'
);

-- Indexes for performance
CREATE INDEX idx_discovered_effects_type ON discovered_effects(effect_type);
CREATE INDEX idx_discovered_effects_target_kpi ON discovered_effects(target_kpi_id);
CREATE INDEX idx_discovered_effects_confidence ON discovered_effects(confidence_score);
CREATE INDEX idx_policy_actions_type ON policy_actions(action_type);
CREATE INDEX idx_policy_actions_date ON policy_actions(effective_date);
CREATE INDEX idx_action_outcome_action ON action_outcome_links(action_id);
CREATE INDEX idx_learnings_confidence ON learnings(effect_confidence);
CREATE INDEX idx_learnings_replications ON learnings(replications);
CREATE INDEX idx_surfaced_insights_priority ON surfaced_insights(priority_score DESC);
CREATE INDEX idx_surfaced_insights_tier ON surfaced_insights(display_tier);
CREATE INDEX idx_knowledge_boundaries_entity ON knowledge_boundaries(entity_type, entity_id);

-- Enable RLS
ALTER TABLE public_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_outcome_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_replications ENABLE ROW LEVEL SECURITY;
ALTER TABLE causal_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE surfaced_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_boundaries ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read for public_data_sources" ON public_data_sources FOR SELECT USING (true);
CREATE POLICY "Public read for discovered_effects" ON discovered_effects FOR SELECT USING (true);
CREATE POLICY "Public read for policy_actions" ON policy_actions FOR SELECT USING (true);
CREATE POLICY "Public read for action_outcome_links" ON action_outcome_links FOR SELECT USING (true);
CREATE POLICY "Public read for learnings" ON learnings FOR SELECT USING (true);
CREATE POLICY "Public read for learning_replications" ON learning_replications FOR SELECT USING (true);
CREATE POLICY "Public read for causal_chains" ON causal_chains FOR SELECT USING (true);
CREATE POLICY "Public read for surfaced_insights" ON surfaced_insights FOR SELECT USING (true);
CREATE POLICY "Public read for knowledge_boundaries" ON knowledge_boundaries FOR SELECT USING (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE surfaced_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE learnings;
ALTER PUBLICATION supabase_realtime ADD TABLE discovered_effects;