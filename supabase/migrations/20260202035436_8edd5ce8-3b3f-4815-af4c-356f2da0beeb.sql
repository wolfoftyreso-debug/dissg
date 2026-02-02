-- ========================================
-- EU DJUP: NUTS-hierarki och Eurostat-integration
-- ========================================

-- NUTS-regioner (EU:s statistiska regionindelning)
CREATE TABLE IF NOT EXISTS public.nuts_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_local TEXT,
  country_code TEXT NOT NULL REFERENCES countries(code),
  nuts_level INTEGER NOT NULL CHECK (nuts_level BETWEEN 0 AND 3),
  parent_code TEXT,
  population INTEGER,
  area_km2 NUMERIC,
  capital_city TEXT,
  is_active BOOLEAN DEFAULT true,
  geometry_simplified JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- EU-specifika datakällor
CREATE TABLE IF NOT EXISTS public.eu_data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  api_base_url TEXT,
  api_documentation_url TEXT,
  data_categories TEXT[] DEFAULT '{}',
  update_frequency update_frequency NOT NULL DEFAULT 'monthly',
  typical_lag_days INTEGER DEFAULT 30,
  reliability_score INTEGER DEFAULT 90 CHECK (reliability_score BETWEEN 0 AND 100),
  countries_covered TEXT[] DEFAULT '{}',
  nuts_level_support INTEGER[] DEFAULT '{0,1,2}',
  is_active BOOLEAN DEFAULT true,
  last_successful_fetch TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- EU KPI-definitioner
CREATE TABLE IF NOT EXISTS public.eu_kpi_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_local TEXT,
  description TEXT,
  category TEXT NOT NULL,
  eurostat_indicator_code TEXT,
  ecb_indicator_code TEXT,
  ecdc_indicator_code TEXT,
  unit TEXT NOT NULL,
  is_inverted BOOLEAN DEFAULT false,
  normalization_method TEXT DEFAULT 'minmax',
  gmi_component TEXT,
  gmi_weight NUMERIC DEFAULT 1.0,
  min_nuts_level INTEGER DEFAULT 0,
  max_nuts_level INTEGER DEFAULT 2,
  comparability_score NUMERIC DEFAULT 1.0 CHECK (comparability_score BETWEEN 0 AND 1),
  data_quality_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- EU KPI-värden
CREATE TABLE IF NOT EXISTS public.eu_kpi_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES eu_kpi_definitions(id),
  nuts_code TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES countries(code),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  value NUMERIC NOT NULL,
  value_normalized NUMERIC,
  previous_value NUMERIC,
  trend trend_direction,
  trend_percent NUMERIC,
  confidence NUMERIC DEFAULT 0.9 CHECK (confidence BETWEEN 0 AND 1),
  is_estimated BOOLEAN DEFAULT false,
  estimation_method TEXT,
  data_source_code TEXT NOT NULL,
  source_indicator_code TEXT,
  source_url TEXT,
  flags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_id, nuts_code, period_start)
);

-- EU Kluster
CREATE TABLE IF NOT EXISTS public.eu_clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  cluster_type TEXT NOT NULL,
  algorithm_used TEXT DEFAULT 'kmeans',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nuts_level INTEGER DEFAULT 2,
  member_count INTEGER,
  centroid_values JSONB,
  is_active BOOLEAN DEFAULT true
);

-- Kluster-medlemskap
CREATE TABLE IF NOT EXISTS public.eu_cluster_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID NOT NULL REFERENCES eu_clusters(id) ON DELETE CASCADE,
  nuts_code TEXT NOT NULL,
  country_code TEXT NOT NULL,
  distance_to_centroid NUMERIC,
  membership_score NUMERIC CHECK (membership_score BETWEEN 0 AND 1),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- EU Korrelationsanalyser
CREATE TABLE IF NOT EXISTS public.eu_correlations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_a_id UUID NOT NULL REFERENCES eu_kpi_definitions(id),
  kpi_b_id UUID NOT NULL REFERENCES eu_kpi_definitions(id),
  nuts_level INTEGER DEFAULT 2,
  correlation_coefficient NUMERIC NOT NULL CHECK (correlation_coefficient BETWEEN -1 AND 1),
  p_value NUMERIC,
  sample_size INTEGER,
  time_lag_months INTEGER DEFAULT 0,
  stability_score NUMERIC CHECK (stability_score BETWEEN 0 AND 1),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  analysis_method TEXT DEFAULT 'pearson',
  is_significant BOOLEAN DEFAULT false,
  interpretation TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_a_id, kpi_b_id, nuts_level, time_lag_months, period_start)
);

-- EU Feeds
CREATE TABLE IF NOT EXISTS public.eu_feed_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  tier feed_tier NOT NULL DEFAULT 'open',
  category TEXT NOT NULL,
  min_nuts_level INTEGER DEFAULT 0,
  max_events_per_day INTEGER DEFAULT 10,
  min_effect_threshold NUMERIC DEFAULT 0.05,
  include_clusters BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_nuts_regions_country ON nuts_regions(country_code);
CREATE INDEX IF NOT EXISTS idx_nuts_regions_level ON nuts_regions(nuts_level);
CREATE INDEX IF NOT EXISTS idx_nuts_regions_parent ON nuts_regions(parent_code);
CREATE INDEX IF NOT EXISTS idx_eu_kpi_values_nuts ON eu_kpi_values(nuts_code);
CREATE INDEX IF NOT EXISTS idx_eu_kpi_values_period ON eu_kpi_values(period_start);
CREATE INDEX IF NOT EXISTS idx_eu_kpi_values_kpi ON eu_kpi_values(kpi_id);
CREATE INDEX IF NOT EXISTS idx_eu_cluster_members_cluster ON eu_cluster_members(cluster_id);
CREATE INDEX IF NOT EXISTS idx_eu_correlations_kpis ON eu_correlations(kpi_a_id, kpi_b_id);

-- Enable RLS
ALTER TABLE nuts_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_cluster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_feed_definitions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "EU data is publicly readable" ON nuts_regions FOR SELECT USING (true);
CREATE POLICY "EU sources publicly readable" ON eu_data_sources FOR SELECT USING (true);
CREATE POLICY "EU KPI defs publicly readable" ON eu_kpi_definitions FOR SELECT USING (true);
CREATE POLICY "EU KPI values publicly readable" ON eu_kpi_values FOR SELECT USING (true);
CREATE POLICY "EU clusters publicly readable" ON eu_clusters FOR SELECT USING (true);
CREATE POLICY "EU cluster members publicly readable" ON eu_cluster_members FOR SELECT USING (true);
CREATE POLICY "EU correlations publicly readable" ON eu_correlations FOR SELECT USING (true);
CREATE POLICY "EU feeds publicly readable" ON eu_feed_definitions FOR SELECT USING (true);