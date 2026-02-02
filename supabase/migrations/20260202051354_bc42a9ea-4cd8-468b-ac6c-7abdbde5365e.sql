-- =============================================
-- WAVE 4: GLOBAL INFINITY SYSTEM TABLES
-- =============================================

-- BLOCK AF: MEDIA INTELLIGENCE
-- =============================================

-- Media sources registry
CREATE TABLE IF NOT EXISTS public.media_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    country_code TEXT,
    language TEXT,
    base_url TEXT,
    rss_feed_url TEXT,
    api_endpoint TEXT,
    reliability_score NUMERIC DEFAULT 0.7,
    bias_assessment TEXT,
    update_frequency TEXT DEFAULT 'hourly',
    is_active BOOLEAN DEFAULT true,
    last_fetch_at TIMESTAMPTZ,
    last_fetch_error TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media events (processed news items)
CREATE TABLE IF NOT EXISTS public.media_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.media_sources(id),
    external_id TEXT,
    title TEXT NOT NULL,
    summary TEXT,
    original_language TEXT,
    detected_language TEXT,
    clean_text TEXT,
    topic_classification JSONB DEFAULT '[]',
    entities_extracted JSONB DEFAULT '[]',
    event_types_detected JSONB DEFAULT '[]',
    geo_resolution JSONB,
    time_resolution JSONB,
    sentiment_intensity NUMERIC,
    volume_indicator NUMERIC DEFAULT 1,
    confidence_score NUMERIC DEFAULT 0.7,
    deduplication_hash TEXT,
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES public.media_events(id),
    source_url TEXT,
    published_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Media → KPI correlations (AF3)
CREATE TABLE IF NOT EXISTS public.media_kpi_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES public.kpi_definitions(id),
    topic TEXT NOT NULL,
    correlation_coefficient NUMERIC,
    lag_days INTEGER DEFAULT 0,
    sample_size INTEGER,
    period_start DATE,
    period_end DATE,
    is_significant BOOLEAN DEFAULT false,
    calculated_at TIMESTAMPTZ DEFAULT now()
);

-- Media volume aggregates
CREATE TABLE IF NOT EXISTS public.media_volume_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    country_code TEXT,
    region_code TEXT,
    topic TEXT,
    event_type TEXT,
    article_count INTEGER DEFAULT 0,
    unique_sources INTEGER DEFAULT 0,
    avg_sentiment NUMERIC,
    intensity_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(date, country_code, region_code, topic, event_type)
);

-- BLOCK AG: GLOBAL EVENT TAXONOMY
CREATE TABLE IF NOT EXISTS public.event_taxonomy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    name_local JSONB DEFAULT '{}',
    definition TEXT NOT NULL,
    severity_scale JSONB DEFAULT '{"min": 1, "max": 5, "default": 3}',
    expected_data_links JSONB DEFAULT '[]',
    expected_kpi_impacts JSONB DEFAULT '[]',
    typical_duration TEXT,
    geographic_scope TEXT,
    detection_keywords JSONB DEFAULT '[]',
    parent_event_id UUID REFERENCES public.event_taxonomy(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Normalized global events
CREATE TABLE IF NOT EXISTS public.global_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type_id UUID REFERENCES public.event_taxonomy(id),
    title TEXT NOT NULL,
    description TEXT,
    event_time TIMESTAMPTZ NOT NULL,
    time_precision TEXT DEFAULT 'day',
    geo_country TEXT,
    geo_region TEXT,
    geo_city TEXT,
    geo_coordinates JSONB,
    geo_precision TEXT DEFAULT 'country',
    intensity NUMERIC DEFAULT 3,
    impact_radius_km NUMERIC,
    affected_population BIGINT,
    source_events JSONB DEFAULT '[]',
    related_kpis UUID[] DEFAULT '{}',
    related_countries TEXT[] DEFAULT '{}',
    confidence_score NUMERIC DEFAULT 0.7,
    is_verified BOOLEAN DEFAULT false,
    verified_by TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AH: KNOWLEDGE GRAPH
CREATE TABLE IF NOT EXISTS public.knowledge_graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_type TEXT NOT NULL,
    entity_id UUID,
    entity_table TEXT,
    label TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    embedding_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_graph_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID REFERENCES public.knowledge_graph_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES public.knowledge_graph_nodes(id) ON DELETE CASCADE,
    edge_type TEXT NOT NULL,
    weight NUMERIC DEFAULT 1.0,
    confidence NUMERIC DEFAULT 0.7,
    properties JSONB DEFAULT '{}',
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AI: SIMULATION ENGINE
CREATE TABLE IF NOT EXISTS public.simulation_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    simulation_type TEXT NOT NULL,
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    default_assumptions JSONB DEFAULT '{}',
    model_version TEXT DEFAULT 'v1',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID REFERENCES public.simulation_definitions(id),
    user_id UUID,
    name TEXT,
    input_parameters JSONB NOT NULL,
    assumptions JSONB DEFAULT '{}',
    results JSONB,
    affected_kpis JSONB DEFAULT '[]',
    historical_sensitivity JSONB,
    uncertainty_bounds JSONB,
    execution_time_ms INTEGER,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- BLOCK AJ: FAST DATA LAYER
CREATE TABLE IF NOT EXISTS public.fast_data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    update_frequency_seconds INTEGER DEFAULT 3600,
    api_endpoint TEXT,
    is_realtime BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_value JSONB,
    last_updated_at TIMESTAMPTZ,
    latency_ms INTEGER,
    fallback_value JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fast_data_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.fast_data_sources(id),
    value NUMERIC NOT NULL,
    unit TEXT,
    metadata JSONB DEFAULT '{}',
    is_live BOOLEAN DEFAULT true,
    latency_ms INTEGER,
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AK: QUALITY ENGINE
CREATE TABLE IF NOT EXISTS public.quality_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL,
    applies_to TEXT NOT NULL,
    condition_sql TEXT,
    condition_config JSONB DEFAULT '{}',
    severity TEXT DEFAULT 'warning',
    auto_action TEXT DEFAULT 'flag',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.quality_rules(id),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    flag_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT,
    details JSONB DEFAULT '{}',
    original_confidence NUMERIC,
    adjusted_confidence NUMERIC,
    action_taken TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOCK AL-AM: UI & ACCESS
CREATE TABLE IF NOT EXISTS public.user_ui_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    current_layer TEXT DEFAULT 'overview',
    default_country TEXT DEFAULT 'SE',
    default_region TEXT,
    pinned_kpis UUID[] DEFAULT '{}',
    pinned_countries TEXT[] DEFAULT '{}',
    custom_dashboards JSONB DEFAULT '[]',
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.access_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tier_type TEXT NOT NULL,
    features JSONB NOT NULL,
    limits JSONB DEFAULT '{}',
    price_monthly NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    tier_id UUID REFERENCES public.access_tiers(id),
    organization_id UUID,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_kpi_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_volume_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fast_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fast_data_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ui_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read media_sources" ON public.media_sources FOR SELECT USING (true);
CREATE POLICY "Public read event_taxonomy" ON public.event_taxonomy FOR SELECT USING (true);
CREATE POLICY "Public read global_events" ON public.global_events FOR SELECT USING (true);
CREATE POLICY "Public read simulation_definitions" ON public.simulation_definitions FOR SELECT USING (true);
CREATE POLICY "Public read fast_data_sources" ON public.fast_data_sources FOR SELECT USING (true);
CREATE POLICY "Public read quality_rules" ON public.quality_rules FOR SELECT USING (true);
CREATE POLICY "Public read access_tiers" ON public.access_tiers FOR SELECT USING (true);
CREATE POLICY "Public read media_events" ON public.media_events FOR SELECT USING (true);
CREATE POLICY "Public read media_kpi_correlations" ON public.media_kpi_correlations FOR SELECT USING (true);
CREATE POLICY "Public read media_volume_aggregates" ON public.media_volume_aggregates FOR SELECT USING (true);
CREATE POLICY "Public read knowledge_graph_nodes" ON public.knowledge_graph_nodes FOR SELECT USING (true);
CREATE POLICY "Public read knowledge_graph_edges" ON public.knowledge_graph_edges FOR SELECT USING (true);
CREATE POLICY "Public read fast_data_values" ON public.fast_data_values FOR SELECT USING (true);
CREATE POLICY "Public read quality_flags" ON public.quality_flags FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users manage own simulation_runs" ON public.simulation_runs FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users manage own ui_preferences" ON public.user_ui_preferences FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users read own access" ON public.user_access FOR SELECT USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_events_source ON public.media_events(source_id);
CREATE INDEX IF NOT EXISTS idx_media_events_published ON public.media_events(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_events_dedup ON public.media_events(deduplication_hash);
CREATE INDEX IF NOT EXISTS idx_global_events_type ON public.global_events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_global_events_time ON public.global_events(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_global_events_country ON public.global_events(geo_country);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_type ON public.knowledge_graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_source ON public.knowledge_graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_target ON public.knowledge_graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_type ON public.knowledge_graph_edges(edge_type);
CREATE INDEX IF NOT EXISTS idx_fast_data_source ON public.fast_data_values(source_id);
CREATE INDEX IF NOT EXISTS idx_fast_data_time ON public.fast_data_values(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_quality_flags_entity ON public.quality_flags(entity_type, entity_id);

-- Insert default data
INSERT INTO public.access_tiers (code, name, tier_type, features, limits) VALUES
('public', 'Publik', 'public', '{"data_visible": true, "aggregation": "basic", "comparison": true, "sharing": true, "automation": false, "feeds": false, "simulation": false, "api": false, "bulk": false}', '{"queries_per_day": 1000}'),
('pro', 'Pro', 'pro', '{"data_visible": true, "aggregation": "full", "comparison": true, "sharing": true, "automation": true, "feeds": true, "simulation": true, "api": true, "bulk": true}', '{"queries_per_day": 100000, "api_calls_per_minute": 60}'),
('enterprise', 'Enterprise', 'enterprise', '{"data_visible": true, "aggregation": "full", "comparison": true, "sharing": true, "automation": true, "feeds": true, "simulation": true, "api": true, "bulk": true, "white_label": true}', '{"queries_per_day": -1, "api_calls_per_minute": 1000}')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.quality_rules (code, name, rule_type, applies_to, condition_config, severity, auto_action) VALUES
('anomaly_3sigma', 'Avvikelse 3σ', 'anomaly_detection', 'kpi', '{"threshold_sigma": 3}', 'warning', 'lower_confidence'),
('sudden_jump_20pct', 'Plötsligt hopp >20%', 'sudden_jump', 'kpi', '{"threshold_percent": 20}', 'warning', 'flag'),
('stale_data_7d', 'Inaktuell data >7 dagar', 'stale_data', 'all', '{"max_age_days": 7}', 'info', 'flag'),
('source_conflict', 'Källkonflikt', 'source_conflict', 'kpi', '{"min_sources": 2, "max_deviation": 0.1}', 'warning', 'flag'),
('definition_drift', 'Definitionsavvikelse', 'definition_drift', 'kpi', '{}', 'critical', 'stop_feed')
ON CONFLICT (code) DO NOTHING;