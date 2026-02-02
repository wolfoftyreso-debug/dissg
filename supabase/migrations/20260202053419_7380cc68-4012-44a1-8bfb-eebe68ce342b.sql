-- Block AS: Global Change Log (World History)
-- Track ALL changes in the system

CREATE TABLE IF NOT EXISTS public.global_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_type TEXT NOT NULL CHECK (change_type IN (
    'data_point', 'revision', 'methodology', 'index_weight', 
    'source_added', 'source_removed', 'coverage_change', 
    'schema_change', 'config_change', 'calculation_update'
  )),
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'kpi', 'kpi_value', 'index', 'country', 'region', 
    'event', 'decision', 'source', 'methodology', 'config'
  )),
  entity_id UUID,
  entity_code TEXT,
  old_value JSONB,
  new_value JSONB,
  change_magnitude NUMERIC, -- Percentage change if applicable
  change_reason TEXT,
  source_reference TEXT,
  affected_downstream TEXT[], -- IDs of affected dependent calculations
  changed_by TEXT, -- 'system', 'ingest', 'manual', 'correction'
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_breaking_change BOOLEAN DEFAULT false,
  requires_recalculation BOOLEAN DEFAULT false,
  recalculation_completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for common queries
CREATE INDEX idx_changelog_type ON public.global_changelog(change_type);
CREATE INDEX idx_changelog_entity ON public.global_changelog(entity_type, entity_id);
CREATE INDEX idx_changelog_time ON public.global_changelog(changed_at DESC);
CREATE INDEX idx_changelog_breaking ON public.global_changelog(is_breaking_change) WHERE is_breaking_change = true;

-- Enable RLS
ALTER TABLE public.global_changelog ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Changelog is publicly readable"
  ON public.global_changelog FOR SELECT USING (true);

-- Block AT: Performance & Caching Tables

CREATE TABLE IF NOT EXISTS public.query_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_fingerprint TEXT NOT NULL UNIQUE, -- Hash of query parameters
  query_params JSONB NOT NULL,
  result_data JSONB NOT NULL,
  result_size_bytes INTEGER,
  computation_time_ms INTEGER,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  cache_tier TEXT DEFAULT 'standard' CHECK (cache_tier IN ('hot', 'warm', 'standard', 'cold'))
);

CREATE INDEX idx_cache_fingerprint ON public.query_cache(query_fingerprint);
CREATE INDEX idx_cache_expires ON public.query_cache(expires_at);
CREATE INDEX idx_cache_tier ON public.query_cache(cache_tier);

-- Precomputed aggregations for fast queries
CREATE TABLE IF NOT EXISTS public.precomputed_aggregations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregation_type TEXT NOT NULL, -- 'country_summary', 'kpi_timeseries', 'ranking', etc.
  aggregation_key TEXT NOT NULL, -- Composite key for lookup
  granularity TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  result_data JSONB NOT NULL,
  source_count INTEGER,
  confidence NUMERIC,
  coverage NUMERIC,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  computation_version TEXT DEFAULT 'v1',
  UNIQUE(aggregation_type, aggregation_key, granularity, period_start)
);

CREATE INDEX idx_precomputed_lookup ON public.precomputed_aggregations(aggregation_type, aggregation_key);
CREATE INDEX idx_precomputed_period ON public.precomputed_aggregations(period_start, period_end);

-- Block AU: Ops & Pipeline Status

CREATE TABLE IF NOT EXISTS public.pipeline_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name TEXT NOT NULL,
  pipeline_type TEXT NOT NULL CHECK (pipeline_type IN (
    'ingest', 'transform', 'aggregate', 'export', 'notification'
  )),
  status TEXT NOT NULL CHECK (status IN (
    'idle', 'running', 'completed', 'failed', 'paused', 'scheduled'
  )),
  last_run_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error TEXT,
  last_error_at TIMESTAMPTZ,
  consecutive_failures INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  avg_duration_ms INTEGER,
  next_scheduled_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_pipeline_name ON public.pipeline_status(pipeline_name);

CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_metrics_name ON public.system_metrics(metric_name, recorded_at DESC);

-- Enable realtime for pipeline status
ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_changelog;