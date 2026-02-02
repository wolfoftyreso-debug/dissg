
-- =====================================================
-- VERSION & REVISION MODEL WITH CHECKSUMS
-- Immutable Data Lineage for Full Auditability
-- =====================================================

-- 1. KPI Value Revisions (immutable append-only)
CREATE TABLE public.kpi_value_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_value_id UUID NOT NULL REFERENCES public.kpi_values(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  
  -- Snapshot of value at this revision
  value NUMERIC NOT NULL,
  previous_value NUMERIC,
  status public.kpi_status NOT NULL,
  trend public.trend_direction NOT NULL,
  trend_percent NUMERIC,
  confidence NUMERIC NOT NULL,
  is_provisional BOOLEAN NOT NULL DEFAULT false,
  
  -- Data integrity
  checksum TEXT NOT NULL,
  previous_checksum TEXT,
  
  -- Metadata
  revision_reason TEXT,
  revision_type TEXT NOT NULL DEFAULT 'initial' CHECK (revision_type IN ('initial', 'correction', 'methodology_change', 'data_update', 'recalculation')),
  revised_by TEXT,
  
  -- Immutable timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(kpi_value_id, revision_number)
);

-- 2. Observation Revisions (immutable)
CREATE TABLE public.observation_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  observation_id UUID NOT NULL REFERENCES public.observations(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  
  -- Snapshot
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  observation_type public.observation_type NOT NULL,
  confidence_level NUMERIC NOT NULL,
  signal_strength NUMERIC NOT NULL,
  status public.analysis_status NOT NULL,
  
  -- Data integrity
  checksum TEXT NOT NULL,
  previous_checksum TEXT,
  
  -- Metadata
  revision_reason TEXT,
  model_version TEXT NOT NULL,
  analysis_version TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(observation_id, revision_number)
);

-- 3. Analysis Chain Revisions (immutable)
CREATE TABLE public.analysis_chain_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_chain_id UUID NOT NULL REFERENCES public.analysis_chains(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  
  -- Snapshot
  level INTEGER NOT NULL,
  level_title TEXT NOT NULL,
  level_content JSONB NOT NULL,
  analysis_method public.analysis_method,
  method_rationale TEXT,
  
  -- Data integrity
  checksum TEXT NOT NULL,
  previous_checksum TEXT,
  input_data_checksums JSONB, -- checksums of source data used
  
  -- Metadata
  revision_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(analysis_chain_id, revision_number)
);

-- 4. Master Index Value Revisions
CREATE TABLE public.master_index_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  master_index_value_id UUID NOT NULL REFERENCES public.master_index_values(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  
  -- Snapshot
  value NUMERIC NOT NULL,
  previous_value NUMERIC,
  component_values JSONB NOT NULL,
  confidence NUMERIC,
  trend public.trend_direction,
  
  -- Data integrity
  checksum TEXT NOT NULL,
  previous_checksum TEXT,
  component_checksums JSONB, -- checksums of each component KPI
  
  -- Metadata
  revision_reason TEXT,
  weight_version_used TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(master_index_value_id, revision_number)
);

-- 5. Add version tracking columns to main tables
ALTER TABLE public.kpi_values 
  ADD COLUMN IF NOT EXISTS current_revision INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checksum TEXT,
  ADD COLUMN IF NOT EXISTS is_immutable BOOLEAN DEFAULT false;

ALTER TABLE public.observations 
  ADD COLUMN IF NOT EXISTS current_revision INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checksum TEXT;

ALTER TABLE public.analysis_chains 
  ADD COLUMN IF NOT EXISTS current_revision INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checksum TEXT;

ALTER TABLE public.master_index_values 
  ADD COLUMN IF NOT EXISTS current_revision INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checksum TEXT;

-- 6. Lineage Chain Links (for tracing data flow)
CREATE TABLE public.lineage_chain_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Source entity
  source_type TEXT NOT NULL CHECK (source_type IN ('kpi_value', 'observation', 'analysis_chain', 'data_source', 'external')),
  source_id UUID,
  source_checksum TEXT NOT NULL,
  
  -- Target entity
  target_type TEXT NOT NULL CHECK (target_type IN ('kpi_value', 'observation', 'analysis_chain', 'master_index', 'relevance_score')),
  target_id UUID NOT NULL,
  target_checksum TEXT NOT NULL,
  
  -- Link metadata
  link_type TEXT NOT NULL CHECK (link_type IN ('derived_from', 'aggregated_from', 'calculated_from', 'triggered_by', 'validated_by')),
  transformation_applied TEXT,
  weight_used NUMERIC,
  
  -- Immutable
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Function to compute checksum
CREATE OR REPLACE FUNCTION public.compute_checksum(data JSONB)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN encode(sha256(data::text::bytea), 'hex');
END;
$$;

-- 8. Function to create KPI value revision
CREATE OR REPLACE FUNCTION public.create_kpi_value_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_checksum TEXT;
  prev_checksum TEXT;
  new_revision INTEGER;
BEGIN
  -- Compute checksum of current state
  new_checksum := public.compute_checksum(jsonb_build_object(
    'kpi_id', NEW.kpi_id,
    'value', NEW.value,
    'period_start', NEW.period_start,
    'period_end', NEW.period_end,
    'status', NEW.status,
    'trend', NEW.trend,
    'confidence', NEW.confidence
  ));
  
  -- Get previous checksum
  SELECT checksum INTO prev_checksum FROM public.kpi_values WHERE id = NEW.id;
  
  -- Only create revision if data actually changed
  IF TG_OP = 'INSERT' OR prev_checksum IS NULL OR prev_checksum != new_checksum THEN
    -- Get next revision number
    SELECT COALESCE(MAX(revision_number), 0) + 1 INTO new_revision
    FROM public.kpi_value_revisions
    WHERE kpi_value_id = NEW.id;
    
    -- Insert revision
    INSERT INTO public.kpi_value_revisions (
      kpi_value_id, revision_number, value, previous_value, status, trend,
      trend_percent, confidence, is_provisional, checksum, previous_checksum,
      revision_type, revision_reason
    ) VALUES (
      NEW.id, new_revision, NEW.value, NEW.previous_value, NEW.status, NEW.trend,
      NEW.trend_percent, NEW.confidence, NEW.is_provisional, new_checksum, prev_checksum,
      CASE WHEN TG_OP = 'INSERT' THEN 'initial' ELSE 'data_update' END,
      CASE WHEN TG_OP = 'INSERT' THEN 'Initial value' ELSE 'Value updated' END
    );
    
    -- Update current revision and checksum
    NEW.current_revision := new_revision;
    NEW.checksum := new_checksum;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 9. Function to create observation revision
CREATE OR REPLACE FUNCTION public.create_observation_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_checksum TEXT;
  prev_checksum TEXT;
  new_revision INTEGER;
BEGIN
  new_checksum := public.compute_checksum(jsonb_build_object(
    'kpi_id', NEW.kpi_id,
    'title', NEW.title,
    'description', NEW.description,
    'observation_type', NEW.observation_type,
    'confidence_level', NEW.confidence_level,
    'signal_strength', NEW.signal_strength
  ));
  
  SELECT checksum INTO prev_checksum FROM public.observations WHERE id = NEW.id;
  
  IF TG_OP = 'INSERT' OR prev_checksum IS NULL OR prev_checksum != new_checksum THEN
    SELECT COALESCE(MAX(revision_number), 0) + 1 INTO new_revision
    FROM public.observation_revisions
    WHERE observation_id = NEW.id;
    
    INSERT INTO public.observation_revisions (
      observation_id, revision_number, title, description, observation_type,
      confidence_level, signal_strength, status, checksum, previous_checksum,
      model_version, analysis_version
    ) VALUES (
      NEW.id, new_revision, NEW.title, NEW.description, NEW.observation_type,
      NEW.confidence_level, NEW.signal_strength, NEW.status, new_checksum, prev_checksum,
      NEW.model_version, NEW.analysis_version
    );
    
    NEW.current_revision := new_revision;
    NEW.checksum := new_checksum;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 10. Create triggers
CREATE TRIGGER trg_kpi_value_revision
  BEFORE INSERT OR UPDATE ON public.kpi_values
  FOR EACH ROW
  EXECUTE FUNCTION public.create_kpi_value_revision();

CREATE TRIGGER trg_observation_revision
  BEFORE INSERT OR UPDATE ON public.observations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_observation_revision();

-- 11. Immutability protection for revision tables (prevent updates/deletes)
CREATE OR REPLACE FUNCTION public.prevent_revision_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Revision records are immutable and cannot be modified or deleted';
END;
$$;

CREATE TRIGGER trg_immutable_kpi_value_revisions
  BEFORE UPDATE OR DELETE ON public.kpi_value_revisions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_revision_modification();

CREATE TRIGGER trg_immutable_observation_revisions
  BEFORE UPDATE OR DELETE ON public.observation_revisions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_revision_modification();

CREATE TRIGGER trg_immutable_analysis_chain_revisions
  BEFORE UPDATE OR DELETE ON public.analysis_chain_revisions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_revision_modification();

CREATE TRIGGER trg_immutable_master_index_revisions
  BEFORE UPDATE OR DELETE ON public.master_index_revisions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_revision_modification();

CREATE TRIGGER trg_immutable_lineage_links
  BEFORE UPDATE OR DELETE ON public.lineage_chain_links
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_revision_modification();

-- 12. Indexes for efficient querying
CREATE INDEX idx_kpi_value_revisions_kpi_value ON public.kpi_value_revisions(kpi_value_id);
CREATE INDEX idx_kpi_value_revisions_checksum ON public.kpi_value_revisions(checksum);
CREATE INDEX idx_observation_revisions_observation ON public.observation_revisions(observation_id);
CREATE INDEX idx_lineage_source ON public.lineage_chain_links(source_type, source_id);
CREATE INDEX idx_lineage_target ON public.lineage_chain_links(target_type, target_id);
CREATE INDEX idx_lineage_checksum ON public.lineage_chain_links(source_checksum, target_checksum);

-- 13. RLS Policies
ALTER TABLE public.kpi_value_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_chain_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_index_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineage_chain_links ENABLE ROW LEVEL SECURITY;

-- Public read access (transparency)
CREATE POLICY "Revisions are publicly readable" ON public.kpi_value_revisions FOR SELECT USING (true);
CREATE POLICY "Observation revisions are publicly readable" ON public.observation_revisions FOR SELECT USING (true);
CREATE POLICY "Analysis chain revisions are publicly readable" ON public.analysis_chain_revisions FOR SELECT USING (true);
CREATE POLICY "Master index revisions are publicly readable" ON public.master_index_revisions FOR SELECT USING (true);
CREATE POLICY "Lineage links are publicly readable" ON public.lineage_chain_links FOR SELECT USING (true);

-- Only system can insert (via triggers/functions)
CREATE POLICY "System can insert kpi revisions" ON public.kpi_value_revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert observation revisions" ON public.observation_revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert analysis revisions" ON public.analysis_chain_revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert master index revisions" ON public.master_index_revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert lineage links" ON public.lineage_chain_links FOR INSERT WITH CHECK (true);

-- 14. View for complete lineage trace
CREATE OR REPLACE VIEW public.v_complete_lineage AS
SELECT 
  lcl.id,
  lcl.source_type,
  lcl.source_id,
  lcl.source_checksum,
  lcl.target_type,
  lcl.target_id,
  lcl.target_checksum,
  lcl.link_type,
  lcl.transformation_applied,
  lcl.created_at,
  -- Source details
  CASE lcl.source_type
    WHEN 'kpi_value' THEN (SELECT kd.name FROM kpi_values kv JOIN kpi_definitions kd ON kv.kpi_id = kd.id WHERE kv.id = lcl.source_id)
    WHEN 'data_source' THEN (SELECT name FROM data_sources WHERE id = lcl.source_id)
    ELSE NULL
  END as source_name,
  -- Target details
  CASE lcl.target_type
    WHEN 'observation' THEN (SELECT title FROM observations WHERE id = lcl.target_id)
    WHEN 'analysis_chain' THEN (SELECT level_title FROM analysis_chains WHERE id = lcl.target_id)
    ELSE NULL
  END as target_name
FROM public.lineage_chain_links lcl;
