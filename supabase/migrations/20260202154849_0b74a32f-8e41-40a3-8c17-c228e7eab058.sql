-- =============================================
-- BLOCK 58: CANONICAL BACKEND ARCHITECTURE
-- Live Data, Auto-Discovery, No Hardcode
-- =============================================

-- 2.2 raw_data_ingest (APPEND-ONLY, IMMUTABLE)
CREATE TABLE IF NOT EXISTS public.raw_data_ingest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.data_sources(id),
  payload_json JSONB NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checksum TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed', 'skipped')),
  processing_error TEXT,
  processed_at TIMESTAMPTZ
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_raw_data_ingest_source ON public.raw_data_ingest(source_id);
CREATE INDEX IF NOT EXISTS idx_raw_data_ingest_status ON public.raw_data_ingest(processing_status);
CREATE INDEX IF NOT EXISTS idx_raw_data_ingest_checksum ON public.raw_data_ingest(checksum);

-- Prevent updates/deletes on raw_data_ingest (append-only)
CREATE OR REPLACE FUNCTION public.prevent_raw_data_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'raw_data_ingest is append-only. Modifications are not allowed.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_raw_data_update ON public.raw_data_ingest;
CREATE TRIGGER prevent_raw_data_update
  BEFORE UPDATE OR DELETE ON public.raw_data_ingest
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_raw_data_modification();

-- 2.5 canonical_facts (Generated facts from observations)
CREATE TABLE IF NOT EXISTS public.canonical_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_code TEXT UNIQUE NOT NULL,
  indicator_id UUID NOT NULL REFERENCES public.kpi_definitions(id),
  geo_level TEXT NOT NULL CHECK (geo_level IN ('global', 'bloc', 'country', 'region', 'municipality')),
  geo_code TEXT NOT NULL,
  time_range_start DATE NOT NULL,
  time_range_end DATE NOT NULL,
  statement TEXT NOT NULL,
  statement_template TEXT NOT NULL,
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable', 'unknown')),
  trend_magnitude NUMERIC,
  uncertainty TEXT NOT NULL CHECK (uncertainty IN ('low', 'medium', 'high')),
  method TEXT NOT NULL CHECK (method IN ('observed', 'estimated', 'calculated')),
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_canonical_facts_indicator ON public.canonical_facts(indicator_id);
CREATE INDEX IF NOT EXISTS idx_canonical_facts_geo ON public.canonical_facts(geo_level, geo_code);
CREATE INDEX IF NOT EXISTS idx_canonical_facts_active ON public.canonical_facts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_canonical_facts_code ON public.canonical_facts(fact_code);

-- 2.6 fact_sources (Many-to-many: facts to sources)
CREATE TABLE IF NOT EXISTS public.fact_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_id UUID NOT NULL REFERENCES public.canonical_facts(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.data_sources(id),
  contribution_weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(fact_id, source_id)
);

CREATE INDEX IF NOT EXISTS idx_fact_sources_fact ON public.fact_sources(fact_id);
CREATE INDEX IF NOT EXISTS idx_fact_sources_source ON public.fact_sources(source_id);

-- Auto-discovery queue for new sources
CREATE TABLE IF NOT EXISTS public.source_discovery_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('api', 'dataset', 'feed')),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validating', 'approved', 'rejected')),
  validation_errors JSONB,
  schema_detected JSONB,
  license_detected TEXT,
  geographic_scope_detected TEXT[],
  temporal_scope_detected JSONB,
  processed_at TIMESTAMPTZ,
  created_source_id UUID REFERENCES public.data_sources(id)
);

CREATE INDEX IF NOT EXISTS idx_discovery_queue_status ON public.source_discovery_queue(validation_status);

-- Indicator auto-detection log
CREATE TABLE IF NOT EXISTS public.indicator_detection_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.data_sources(id),
  detected_indicators JSONB NOT NULL,
  matched_kpi_ids UUID[],
  new_indicators_suggested JSONB,
  detection_method TEXT NOT NULL,
  confidence_score NUMERIC NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false
);

-- Fact generation templates
CREATE TABLE IF NOT EXISTS public.fact_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code TEXT UNIQUE NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  trend_type TEXT NOT NULL CHECK (trend_type IN ('increase', 'decrease', 'stable', 'unknown')),
  template_text TEXT NOT NULL,
  variables_required TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default fact templates
INSERT INTO public.fact_templates (template_code, language_code, trend_type, template_text, variables_required) VALUES
('FACT_TREND_UP_EN', 'en', 'increase', 'Observed data indicates that {indicator_name} increased by {magnitude}% in {geo_name} during {time_range}.', ARRAY['indicator_name', 'magnitude', 'geo_name', 'time_range']),
('FACT_TREND_DOWN_EN', 'en', 'decrease', 'Observed data indicates that {indicator_name} decreased by {magnitude}% in {geo_name} during {time_range}.', ARRAY['indicator_name', 'magnitude', 'geo_name', 'time_range']),
('FACT_TREND_STABLE_EN', 'en', 'stable', 'Observed data indicates that {indicator_name} remained stable in {geo_name} during {time_range}.', ARRAY['indicator_name', 'geo_name', 'time_range']),
('FACT_TREND_UNKNOWN_EN', 'en', 'unknown', 'Data for {indicator_name} in {geo_name} during {time_range} shows no clear trend pattern.', ARRAY['indicator_name', 'geo_name', 'time_range']),
('FACT_TREND_UP_SV', 'sv', 'increase', 'Observerad data indikerar att {indicator_name} ökade med {magnitude}% i {geo_name} under {time_range}.', ARRAY['indicator_name', 'magnitude', 'geo_name', 'time_range']),
('FACT_TREND_DOWN_SV', 'sv', 'decrease', 'Observerad data indikerar att {indicator_name} minskade med {magnitude}% i {geo_name} under {time_range}.', ARRAY['indicator_name', 'magnitude', 'geo_name', 'time_range']),
('FACT_TREND_STABLE_SV', 'sv', 'stable', 'Observerad data indikerar att {indicator_name} var stabil i {geo_name} under {time_range}.', ARRAY['indicator_name', 'geo_name', 'time_range']),
('FACT_TREND_UNKNOWN_SV', 'sv', 'unknown', 'Data för {indicator_name} i {geo_name} under {time_range} visar inget tydligt trendmönster.', ARRAY['indicator_name', 'geo_name', 'time_range'])
ON CONFLICT (template_code) DO NOTHING;

-- Enable RLS
ALTER TABLE public.raw_data_ingest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_discovery_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_detection_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_templates ENABLE ROW LEVEL SECURITY;

-- Public read access for facts (they are public information)
CREATE POLICY "canonical_facts_public_read" ON public.canonical_facts
  FOR SELECT USING (is_active = true);

CREATE POLICY "fact_sources_public_read" ON public.fact_sources
  FOR SELECT USING (true);

CREATE POLICY "fact_templates_public_read" ON public.fact_templates
  FOR SELECT USING (is_active = true);

-- System-level write access (for edge functions via service role)
CREATE POLICY "raw_data_ingest_service_insert" ON public.raw_data_ingest
  FOR INSERT WITH CHECK (true);

CREATE POLICY "canonical_facts_service_all" ON public.canonical_facts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "fact_sources_service_all" ON public.fact_sources
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "discovery_queue_service_all" ON public.source_discovery_queue
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "detection_log_service_all" ON public.indicator_detection_log
  FOR ALL USING (true) WITH CHECK (true);

-- Function to generate fact code
CREATE OR REPLACE FUNCTION public.generate_fact_code(
  p_indicator_code TEXT,
  p_geo_code TEXT,
  p_time_start DATE,
  p_time_end DATE
) RETURNS TEXT AS $$
BEGIN
  RETURN 'FACT-' || UPPER(p_indicator_code) || '-' || UPPER(p_geo_code) || '-' || 
         TO_CHAR(p_time_start, 'YYYY') || '-' || TO_CHAR(p_time_end, 'YYYY');
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

-- Function to validate incoming data contract
CREATE OR REPLACE FUNCTION public.validate_data_contract(p_data JSONB)
RETURNS JSONB AS $$
DECLARE
  v_errors TEXT[] := ARRAY[]::TEXT[];
  v_required_fields TEXT[] := ARRAY['source_id', 'source_type', 'update_frequency', 'temporal_coverage', 'geographic_coverage', 'method', 'uncertainty', 'license', 'last_verified'];
  v_field TEXT;
BEGIN
  -- Check all required fields
  FOREACH v_field IN ARRAY v_required_fields LOOP
    IF NOT (p_data ? v_field) OR p_data->>v_field IS NULL THEN
      v_errors := array_append(v_errors, 'Missing required field: ' || v_field);
    END IF;
  END LOOP;
  
  -- Validate source_type
  IF p_data ? 'source_type' AND p_data->>'source_type' NOT IN ('api', 'dataset', 'feed') THEN
    v_errors := array_append(v_errors, 'Invalid source_type: must be api, dataset, or feed');
  END IF;
  
  -- Validate method
  IF p_data ? 'method' AND p_data->>'method' NOT IN ('observed', 'estimated') THEN
    v_errors := array_append(v_errors, 'Invalid method: must be observed or estimated');
  END IF;
  
  -- Validate uncertainty
  IF p_data ? 'uncertainty' AND p_data->>'uncertainty' NOT IN ('low', 'medium', 'high') THEN
    v_errors := array_append(v_errors, 'Invalid uncertainty: must be low, medium, or high');
  END IF;
  
  -- Validate license is open
  IF p_data ? 'license' AND p_data->>'license' != 'open' THEN
    v_errors := array_append(v_errors, 'License must be open');
  END IF;
  
  IF array_length(v_errors, 1) > 0 THEN
    RETURN jsonb_build_object('valid', false, 'errors', to_jsonb(v_errors));
  END IF;
  
  RETURN jsonb_build_object('valid', true, 'errors', '[]'::jsonb);
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

-- Trigger for updated_at on canonical_facts
CREATE TRIGGER update_canonical_facts_updated_at
  BEFORE UPDATE ON public.canonical_facts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();