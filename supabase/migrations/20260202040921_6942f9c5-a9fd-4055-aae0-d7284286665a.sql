-- Add missing column to global_master_index_config
ALTER TABLE global_master_index_config ADD COLUMN IF NOT EXISTS description TEXT;

-- Global Master Index scores per country
CREATE TABLE IF NOT EXISTS public.gmi_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES countries(code),
  gmi_version TEXT NOT NULL REFERENCES global_master_index_config(version),
  gmi_score NUMERIC NOT NULL CHECK (gmi_score >= 0 AND gmi_score <= 100),
  gmi_rank INTEGER,
  economy_score NUMERIC,
  health_score NUMERIC,
  education_score NUMERIC,
  employment_score NUMERIC,
  demographics_score NUMERIC,
  governance_score NUMERIC,
  environment_score NUMERIC,
  previous_score NUMERIC,
  trend trend_direction,
  trend_percent NUMERIC,
  indicators_available INTEGER NOT NULL,
  indicators_total INTEGER NOT NULL,
  data_completeness NUMERIC GENERATED ALWAYS AS (
    CASE WHEN indicators_total > 0 
    THEN (indicators_available::NUMERIC / indicators_total) * 100 
    ELSE 0 END
  ) STORED,
  comparability_level comparability_level NOT NULL DEFAULT 'partial',
  data_freshness_months INTEGER,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_year INTEGER NOT NULL,
  calculation_notes TEXT,
  UNIQUE(country_code, gmi_version, period_year)
);

-- Country weight overrides
CREATE TABLE IF NOT EXISTS public.country_gmi_weights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES countries(code),
  gmi_version TEXT NOT NULL REFERENCES global_master_index_config(version),
  weight_overrides JSONB NOT NULL DEFAULT '{}',
  override_reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country_code, gmi_version)
);

-- Global feeds
CREATE TABLE IF NOT EXISTS public.global_feed_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tier feed_tier NOT NULL DEFAULT 'open',
  min_gmi_change NUMERIC DEFAULT 0.5,
  regions TEXT[],
  data_depth_required data_depth_level,
  max_countries_per_event INTEGER DEFAULT 10,
  max_events_per_day INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Global feed events
CREATE TABLE IF NOT EXISTS public.global_feed_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID NOT NULL REFERENCES global_feed_definitions(id),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  countries TEXT[] NOT NULL,
  region TEXT,
  metrics JSONB NOT NULL DEFAULT '{}',
  gmi_changes JSONB,
  severity feed_severity NOT NULL DEFAULT 'low',
  event_type TEXT NOT NULL,
  data_sources TEXT[],
  kpi_codes TEXT[],
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  checksum TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gmi_scores_country ON gmi_scores(country_code);
CREATE INDEX IF NOT EXISTS idx_gmi_scores_year ON gmi_scores(period_year);
CREATE INDEX IF NOT EXISTS idx_gmi_scores_rank ON gmi_scores(gmi_rank);
CREATE INDEX IF NOT EXISTS idx_global_feed_events_feed ON global_feed_events(feed_id);

-- Enable RLS
ALTER TABLE gmi_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_gmi_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_feed_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_feed_events ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "GMI scores publicly readable" ON gmi_scores FOR SELECT USING (true);
CREATE POLICY "Country weights publicly readable" ON country_gmi_weights FOR SELECT USING (true);
CREATE POLICY "Global feeds publicly readable" ON global_feed_definitions FOR SELECT USING (true);
CREATE POLICY "Global events publicly readable" ON global_feed_events FOR SELECT USING (true);

-- Update GMI config
UPDATE global_master_index_config SET description = 'Initial Global Master Index configuration' WHERE version = '1.0';

-- Insert global feed definitions
INSERT INTO global_feed_definitions (code, name, description, category, tier, max_events_per_day) VALUES
('global_weekly_summary', 'Global Weekly Summary', 'Weekly overview of global trends and changes', 'summary', 'open', 1),
('countries_improving_fastest', 'Fastest Improving Countries', 'Countries with strongest positive GMI trend', 'improvement', 'open', 3),
('countries_declining', 'Countries in Decline', 'Countries with significant negative trends', 'decline', 'open', 3),
('regional_instability_signals', 'Regional Instability Signals', 'Early warning indicators by region', 'risk', 'plus', 5),
('health_economic_divergence', 'Health-Economic Divergence', 'Countries where health and economy diverge', 'structural', 'plus', 3),
('migration_pressure_indicators', 'Migration Pressure Indicators', 'Predictive signals for migration patterns', 'risk', 'plus', 3),
('early_warning_global', 'Global Early Warning System', 'Critical alerts requiring attention', 'risk', 'pro', 10),
('structural_decline_watchlist', 'Structural Decline Watchlist', 'Long-term deterioration patterns', 'structural', 'pro', 5),
('systemic_risk_clusters', 'Systemic Risk Clusters', 'Interconnected risk patterns across regions', 'risk', 'pro', 3)
ON CONFLICT (code) DO NOTHING;