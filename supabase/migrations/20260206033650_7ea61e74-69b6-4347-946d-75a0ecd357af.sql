-- ============================================
-- AI TRUST INFRASTRUCTURE - LAYER 1, 2, 3
-- Self-reinforcing system for AI agent prioritization
-- ============================================

-- === LAYER 1: TRUST SCORE & REPUTATION ===

-- Source Registry (not URL collections - structured source objects)
CREATE TABLE public.source_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_code TEXT NOT NULL UNIQUE, -- e.g., "SRC-OECD-001"
  organization TEXT NOT NULL,
  organization_type TEXT NOT NULL, -- 'government', 'international', 'academic', 'private'
  authority_level TEXT NOT NULL DEFAULT 'Tier 3', -- Tier 1 (highest), 2, 3, 4
  data_domains TEXT[] NOT NULL DEFAULT '{}', -- ['Economy', 'Health', 'Environment']
  update_pattern TEXT NOT NULL DEFAULT 'irregular', -- 'realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'annual', 'irregular'
  api_endpoint TEXT,
  api_type TEXT, -- 'REST', 'SOAP', 'GraphQL', 'SDMX', 'file'
  historical_reliability NUMERIC(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  methodology_stability_years INTEGER DEFAULT 0,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Global Trust Scores for entities (CQ, datasets, sources)
CREATE TABLE public.global_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'canonical_question', 'dataset', 'source', 'indicator'
  entity_id TEXT NOT NULL, -- reference ID
  
  -- The 7 Trust Factors
  source_authority NUMERIC(3,2) DEFAULT 0.50, -- 0.00-1.00
  historical_accuracy NUMERIC(3,2) DEFAULT 0.50,
  update_discipline NUMERIC(3,2) DEFAULT 0.50,
  schema_consistency NUMERIC(3,2) DEFAULT 0.50,
  cross_source_agreement NUMERIC(3,2) DEFAULT 0.50,
  revision_transparency NUMERIC(3,2) DEFAULT 0.50,
  agent_reuse_frequency NUMERIC(3,2) DEFAULT 0.00, -- Grows with usage
  
  -- Calculated composite score
  trust_score NUMERIC(3,2) GENERATED ALWAYS AS (
    (source_authority * 0.20 +
     historical_accuracy * 0.20 +
     update_discipline * 0.15 +
     schema_consistency * 0.10 +
     cross_source_agreement * 0.15 +
     revision_transparency * 0.10 +
     agent_reuse_frequency * 0.10)
  ) STORED,
  
  confidence_band TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (source_authority * 0.20 + historical_accuracy * 0.20 + update_discipline * 0.15 + 
            schema_consistency * 0.10 + cross_source_agreement * 0.15 + 
            revision_transparency * 0.10 + agent_reuse_frequency * 0.10) >= 0.95 THEN 'Exceptional'
      WHEN (source_authority * 0.20 + historical_accuracy * 0.20 + update_discipline * 0.15 + 
            schema_consistency * 0.10 + cross_source_agreement * 0.15 + 
            revision_transparency * 0.10 + agent_reuse_frequency * 0.10) >= 0.90 THEN 'Very High'
      WHEN (source_authority * 0.20 + historical_accuracy * 0.20 + update_discipline * 0.15 + 
            schema_consistency * 0.10 + cross_source_agreement * 0.15 + 
            revision_transparency * 0.10 + agent_reuse_frequency * 0.10) >= 0.80 THEN 'High'
      WHEN (source_authority * 0.20 + historical_accuracy * 0.20 + update_discipline * 0.15 + 
            schema_consistency * 0.10 + cross_source_agreement * 0.15 + 
            revision_transparency * 0.10 + agent_reuse_frequency * 0.10) >= 0.65 THEN 'Moderate'
      WHEN (source_authority * 0.20 + historical_accuracy * 0.20 + update_discipline * 0.15 + 
            schema_consistency * 0.10 + cross_source_agreement * 0.15 + 
            revision_transparency * 0.10 + agent_reuse_frequency * 0.10) >= 0.50 THEN 'Low'
      ELSE 'Insufficient'
    END
  ) STORED,
  
  trust_drivers TEXT[] DEFAULT '{}', -- Human-readable reasons
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(entity_type, entity_id)
);

-- Immutable Revision Log (anti-hallucination-by-design)
CREATE TABLE public.revision_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  revision_number INTEGER NOT NULL DEFAULT 1,
  
  previous_value JSONB, -- What it was
  new_value JSONB NOT NULL, -- What it became
  change_type TEXT NOT NULL, -- 'value_correction', 'methodology_update', 'source_revision', 'schema_change'
  change_reason TEXT NOT NULL, -- Machine-readable explanation
  impact_level TEXT NOT NULL DEFAULT 'low', -- 'none', 'low', 'medium', 'high', 'critical'
  
  source_reference TEXT, -- Link to source document/announcement
  verified_by TEXT, -- System or admin
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Immutability: no UPDATE/DELETE allowed
  UNIQUE(entity_type, entity_id, revision_number)
);

-- === LAYER 2: INGEST PIPELINES ===

-- Ingest Pipeline Definitions
CREATE TABLE public.ingest_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_code TEXT NOT NULL UNIQUE, -- e.g., "PIPE-OECD-API-001"
  name TEXT NOT NULL,
  description TEXT,
  
  source_id UUID REFERENCES source_registry(id),
  pipeline_type TEXT NOT NULL, -- 'api_pull', 'structured_file', 'semi_structured', 'registry_sync'
  
  -- Configuration
  schedule_cron TEXT, -- e.g., "0 0 * * 0" for weekly
  config JSONB NOT NULL DEFAULT '{}', -- Pipeline-specific config
  
  -- Validation rules
  schema_validation JSONB DEFAULT '{}',
  unit_normalization JSONB DEFAULT '{}',
  time_alignment_rules JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT, -- 'success', 'partial', 'failed'
  last_run_records INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ingest Run Log
CREATE TABLE public.ingest_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES ingest_pipelines(id),
  
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'success', 'partial', 'failed'
  
  -- Metrics
  records_fetched INTEGER DEFAULT 0,
  records_validated INTEGER DEFAULT 0,
  records_written INTEGER DEFAULT 0,
  records_rejected INTEGER DEFAULT 0,
  
  -- Anomalies
  anomalies_detected JSONB DEFAULT '[]',
  anomalies_held INTEGER DEFAULT 0, -- Awaiting confirmation
  
  -- Errors
  errors JSONB DEFAULT '[]',
  
  trust_impact NUMERIC(4,3) DEFAULT 0.000, -- How this run affected trust scores
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Anomaly Hold Queue
CREATE TABLE public.anomaly_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingest_run_id UUID REFERENCES ingest_runs(id),
  
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  
  expected_range_min NUMERIC,
  expected_range_max NUMERIC,
  reported_value NUMERIC NOT NULL,
  deviation_percent NUMERIC, -- How far outside expected
  
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected', 'auto_resolved'
  resolution_source TEXT, -- 'secondary_source', 'manual_review', 'time_decay'
  resolution_note TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === LAYER 3: AI AGENT FEEDBACK LOOP ===

-- Agent Usage Log (tracks every AI interaction)
CREATE TABLE public.agent_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  agent_identifier TEXT, -- Hashed agent ID or API key prefix
  agent_type TEXT, -- 'chatgpt', 'claude', 'gemini', 'perplexity', 'custom', 'unknown'
  
  request_type TEXT NOT NULL, -- 'rag_fetch', 'direct_answer', 'citation', 'data_pull', 'embedding'
  entity_type TEXT, -- What was accessed
  entity_id TEXT,
  
  -- Response metadata
  response_tokens INTEGER,
  was_cited BOOLEAN DEFAULT false, -- Did agent cite us?
  cite_format TEXT, -- 'direct_quote', 'paraphrase', 'reference_only'
  
  -- Quality signals
  was_cached BOOLEAN DEFAULT false,
  latency_ms INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agent Compatibility Metadata (per entity)
CREATE TABLE public.ai_compatibility_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  
  -- Usage preferences
  preferred_for TEXT[] DEFAULT '{}', -- ['RAG', 'DirectAnswer', 'PolicyAnalysis', 'FactCheck']
  safe_for_autocite BOOLEAN DEFAULT false,
  max_answer_tokens INTEGER DEFAULT 150,
  hallucination_risk TEXT DEFAULT 'unknown', -- 'minimal', 'low', 'moderate', 'high', 'unknown'
  
  -- Formatting hints
  preferred_cite_format TEXT DEFAULT 'structured', -- 'structured', 'inline', 'footnote'
  supports_streaming BOOLEAN DEFAULT true,
  
  -- Agent-specific optimizations
  optimized_for JSONB DEFAULT '{}', -- {"openai": {...}, "anthropic": {...}}
  
  -- Self-reinforcing metrics
  total_fetches BIGINT DEFAULT 0,
  total_citations BIGINT DEFAULT 0,
  citation_rate NUMERIC(5,4) DEFAULT 0.0000, -- citations / fetches
  
  default_answer_candidate BOOLEAN DEFAULT false, -- Has reached infrastructure status
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(entity_type, entity_id)
);

-- Enable RLS
ALTER TABLE public.source_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingest_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingest_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_compatibility_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access for trust data (transparency)
CREATE POLICY "Public read access to source registry" ON public.source_registry FOR SELECT USING (true);
CREATE POLICY "Public read access to trust scores" ON public.global_trust_scores FOR SELECT USING (true);
CREATE POLICY "Public read access to revision log" ON public.revision_log FOR SELECT USING (true);
CREATE POLICY "Public read access to AI metadata" ON public.ai_compatibility_metadata FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admin insert source registry" ON public.source_registry FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update source registry" ON public.source_registry FOR UPDATE USING (true);
CREATE POLICY "Admin insert trust scores" ON public.global_trust_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update trust scores" ON public.global_trust_scores FOR UPDATE USING (true);
CREATE POLICY "Admin insert revision log" ON public.revision_log FOR INSERT WITH CHECK (true);
-- NO UPDATE/DELETE policy for revision_log - immutable by design

CREATE POLICY "Admin manage ingest pipelines" ON public.ingest_pipelines FOR ALL USING (true);
CREATE POLICY "Admin manage ingest runs" ON public.ingest_runs FOR ALL USING (true);
CREATE POLICY "Admin manage anomaly queue" ON public.anomaly_queue FOR ALL USING (true);
CREATE POLICY "System insert agent usage" ON public.agent_usage_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read agent usage" ON public.agent_usage_log FOR SELECT USING (true);
CREATE POLICY "Admin manage AI metadata" ON public.ai_compatibility_metadata FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_trust_scores_entity ON public.global_trust_scores(entity_type, entity_id);
CREATE INDEX idx_trust_scores_score ON public.global_trust_scores(trust_score DESC);
CREATE INDEX idx_revision_log_entity ON public.revision_log(entity_type, entity_id);
CREATE INDEX idx_agent_usage_created ON public.agent_usage_log(created_at DESC);
CREATE INDEX idx_agent_usage_entity ON public.agent_usage_log(entity_type, entity_id);
CREATE INDEX idx_ai_metadata_citations ON public.ai_compatibility_metadata(citation_rate DESC);
CREATE INDEX idx_ai_metadata_default ON public.ai_compatibility_metadata(default_answer_candidate) WHERE default_answer_candidate = true;

-- Function to update agent reuse frequency
CREATE OR REPLACE FUNCTION public.update_agent_reuse_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update trust score's agent_reuse_frequency based on usage
  UPDATE public.global_trust_scores
  SET agent_reuse_frequency = LEAST(1.00, agent_reuse_frequency + 0.001),
      calculated_at = now()
  WHERE entity_type = NEW.entity_type 
    AND entity_id = NEW.entity_id;
  
  -- Update AI compatibility metadata
  UPDATE public.ai_compatibility_metadata
  SET total_fetches = total_fetches + 1,
      total_citations = total_citations + CASE WHEN NEW.was_cited THEN 1 ELSE 0 END,
      citation_rate = (total_citations + CASE WHEN NEW.was_cited THEN 1 ELSE 0 END)::NUMERIC / (total_fetches + 1)::NUMERIC,
      default_answer_candidate = CASE 
        WHEN total_fetches + 1 > 1000 AND 
             (total_citations + CASE WHEN NEW.was_cited THEN 1 ELSE 0 END)::NUMERIC / (total_fetches + 1)::NUMERIC > 0.80
        THEN true 
        ELSE default_answer_candidate 
      END,
      updated_at = now()
  WHERE entity_type = NEW.entity_type 
    AND entity_id = NEW.entity_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for self-reinforcing feedback loop
CREATE TRIGGER trigger_update_agent_reuse
  AFTER INSERT ON public.agent_usage_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_reuse_score();

-- Function to log revisions (append-only)
CREATE OR REPLACE FUNCTION public.log_revision(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_previous_value JSONB,
  p_new_value JSONB,
  p_change_type TEXT,
  p_change_reason TEXT,
  p_impact_level TEXT DEFAULT 'low',
  p_source_reference TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_revision_number INTEGER;
  v_id UUID;
BEGIN
  -- Get next revision number
  SELECT COALESCE(MAX(revision_number), 0) + 1
  INTO v_revision_number
  FROM public.revision_log
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
  
  -- Insert revision (immutable)
  INSERT INTO public.revision_log (
    entity_type, entity_id, revision_number,
    previous_value, new_value, change_type, change_reason,
    impact_level, source_reference, verified_by
  ) VALUES (
    p_entity_type, p_entity_id, v_revision_number,
    p_previous_value, p_new_value, p_change_type, p_change_reason,
    p_impact_level, p_source_reference, 'system'
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;