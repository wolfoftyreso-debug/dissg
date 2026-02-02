-- =============================================
-- WAVE 7: RADICAL OPENNESS, DATA CONSTITUTION, PUBLIC LEARNING
-- =============================================

-- PART 1: RADICAL OPENNESS LAYER
-- Reproducibility tracking for all insights
CREATE TABLE public.reproducibility_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('insight', 'learning', 'effect', 'observation', 'chain')),
  entity_id UUID NOT NULL,
  
  -- Reproduction requirements
  required_data_sources TEXT[] NOT NULL,
  required_time_range TSRANGE NOT NULL,
  required_geo_scope TEXT[] NOT NULL,
  
  -- Method specification
  method_code TEXT NOT NULL,
  method_version TEXT NOT NULL,
  method_parameters JSONB NOT NULL DEFAULT '{}',
  
  -- Reproducibility status
  reproduction_count INTEGER DEFAULT 0,
  last_reproduced_at TIMESTAMPTZ,
  last_reproduction_matched BOOLEAN,
  deviation_if_any NUMERIC(8,4),
  
  -- Public access
  is_publicly_reproducible BOOLEAN DEFAULT true,
  reproduction_endpoint TEXT,
  reproduction_query JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Public experiments registry
CREATE TABLE public.public_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  
  -- Methodology (fully transparent)
  methodology TEXT NOT NULL,
  data_sources TEXT[] NOT NULL,
  analysis_method TEXT NOT NULL,
  assumptions TEXT[] NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'completed', 'failed', 'withdrawn')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Results (public)
  result_summary TEXT,
  result_data JSONB,
  conclusion TEXT,
  limitations TEXT[],
  
  -- Transparency
  all_data_public BOOLEAN DEFAULT true,
  replication_instructions TEXT,
  
  -- Attribution
  proposed_by TEXT,
  reviewed_by TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Method transparency registry
CREATE TABLE public.method_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_code TEXT UNIQUE NOT NULL,
  version TEXT NOT NULL,
  name TEXT NOT NULL,
  
  -- Full specification
  description TEXT NOT NULL,
  mathematical_formula TEXT,
  pseudocode TEXT,
  assumptions TEXT[] NOT NULL,
  limitations TEXT[] NOT NULL,
  
  -- Validation
  validated_by TEXT[],
  validation_date TIMESTAMPTZ,
  validation_notes TEXT,
  
  -- Usage
  applicable_to TEXT[] NOT NULL,
  not_applicable_to TEXT[] DEFAULT '{}',
  
  -- Source
  academic_references TEXT[],
  implementation_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PART 2: GLOBAL DATA CONSTITUTION
-- Rules for data interpretation
CREATE TABLE public.data_constitution_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_number INTEGER UNIQUE NOT NULL,
  article_title TEXT NOT NULL,
  
  -- Content
  principle TEXT NOT NULL,
  rationale TEXT NOT NULL,
  examples TEXT[],
  violations TEXT[],
  
  -- Enforcement
  enforcement_type TEXT CHECK (enforcement_type IN ('hard_block', 'warning', 'disclosure', 'flag')),
  automated_check BOOLEAN DEFAULT false,
  check_function TEXT,
  
  -- Status
  adopted_at TIMESTAMPTZ DEFAULT now(),
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interpretation boundaries
CREATE TABLE public.interpretation_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boundary_code TEXT UNIQUE NOT NULL,
  
  -- What is protected
  protected_aspect TEXT NOT NULL,
  protection_type TEXT CHECK (protection_type IN ('individual', 'group', 'methodology', 'causality', 'prediction')),
  
  -- Rules
  never_allowed TEXT[] NOT NULL,
  requires_disclosure TEXT[] DEFAULT '{}',
  requires_context TEXT[] DEFAULT '{}',
  
  -- Examples
  valid_statements TEXT[],
  invalid_statements TEXT[],
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Misuse detection log
CREATE TABLE public.misuse_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was flagged
  flagged_content_type TEXT NOT NULL,
  flagged_content_id UUID,
  flagged_text TEXT,
  
  -- Why flagged
  violation_type TEXT NOT NULL CHECK (violation_type IN (
    'causal_overclaim', 'individual_targeting', 'propaganda_pattern',
    'missing_context', 'cherry_picking', 'false_precision', 'loaded_language'
  )),
  violated_article INTEGER,
  
  -- Status
  status TEXT DEFAULT 'flagged' CHECK (status IN ('flagged', 'reviewed', 'confirmed', 'dismissed')),
  reviewer_notes TEXT,
  
  -- Source
  flagged_by TEXT DEFAULT 'system',
  flagged_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- PART 3: PUBLIC LEARNING ENGINE
-- Daily learnings aggregation
CREATE TABLE public.daily_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_date DATE UNIQUE NOT NULL,
  
  -- Aggregated learnings
  total_new_insights INTEGER DEFAULT 0,
  total_confirmed_patterns INTEGER DEFAULT 0,
  total_falsified_patterns INTEGER DEFAULT 0,
  total_replications INTEGER DEFAULT 0,
  
  -- Top items
  top_learnings JSONB DEFAULT '[]',
  notable_failures JSONB DEFAULT '[]',
  replication_updates JSONB DEFAULT '[]',
  
  -- Coverage
  countries_with_updates TEXT[] DEFAULT '{}',
  kpi_categories_updated TEXT[] DEFAULT '{}',
  
  -- Summary
  summary_text TEXT,
  
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- Pattern lifecycle tracking
CREATE TABLE public.pattern_lifecycle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_code TEXT UNIQUE NOT NULL,
  pattern_description TEXT NOT NULL,
  
  -- Lifecycle stage
  stage TEXT NOT NULL CHECK (stage IN (
    'hypothesis', 'emerging', 'confirmed', 'strong', 'weakening', 'falsified', 'archived'
  )),
  stage_changed_at TIMESTAMPTZ DEFAULT now(),
  
  -- Evidence
  supporting_evidence INTEGER DEFAULT 0,
  contradicting_evidence INTEGER DEFAULT 0,
  replications INTEGER DEFAULT 0,
  failed_replications INTEGER DEFAULT 0,
  
  -- History
  stage_history JSONB DEFAULT '[]',
  
  -- Geographic scope
  first_observed_geo TEXT,
  confirmed_in_geos TEXT[] DEFAULT '{}',
  failed_in_geos TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- "What doesn't work" registry
CREATE TABLE public.falsified_hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hypothesis_code TEXT UNIQUE NOT NULL,
  
  -- The hypothesis
  original_hypothesis TEXT NOT NULL,
  originally_proposed_by TEXT,
  originally_proposed_at TIMESTAMPTZ,
  
  -- Why it failed
  falsification_summary TEXT NOT NULL,
  falsification_evidence JSONB NOT NULL,
  contradicting_data TEXT[],
  
  -- Context
  failed_in_contexts TEXT[],
  might_work_in_contexts TEXT[],
  
  -- Learning value
  what_we_learned TEXT NOT NULL,
  related_valid_patterns TEXT[],
  
  falsified_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_reproducibility_entity ON reproducibility_records(entity_type, entity_id);
CREATE INDEX idx_experiments_status ON public_experiments(status);
CREATE INDEX idx_method_registry_code ON method_registry(method_code);
CREATE INDEX idx_constitution_articles ON data_constitution_articles(article_number);
CREATE INDEX idx_daily_learnings_date ON daily_learnings(learning_date DESC);
CREATE INDEX idx_pattern_lifecycle_stage ON pattern_lifecycle(stage);
CREATE INDEX idx_falsified_hypotheses_date ON falsified_hypotheses(falsified_at DESC);

-- RLS
ALTER TABLE reproducibility_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE method_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_constitution_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretation_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE misuse_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE falsified_hypotheses ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read reproducibility" ON reproducibility_records FOR SELECT USING (true);
CREATE POLICY "Public read experiments" ON public_experiments FOR SELECT USING (true);
CREATE POLICY "Public read methods" ON method_registry FOR SELECT USING (true);
CREATE POLICY "Public read constitution" ON data_constitution_articles FOR SELECT USING (true);
CREATE POLICY "Public read boundaries" ON interpretation_boundaries FOR SELECT USING (true);
CREATE POLICY "Public read daily_learnings" ON daily_learnings FOR SELECT USING (true);
CREATE POLICY "Public read pattern_lifecycle" ON pattern_lifecycle FOR SELECT USING (true);
CREATE POLICY "Public read falsified" ON falsified_hypotheses FOR SELECT USING (true);

-- Realtime for learning engine
ALTER PUBLICATION supabase_realtime ADD TABLE daily_learnings;
ALTER PUBLICATION supabase_realtime ADD TABLE pattern_lifecycle;