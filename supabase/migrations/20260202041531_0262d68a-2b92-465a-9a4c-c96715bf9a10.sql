-- ========================================
-- GLOBAL INGEST ARCHITECTURE
-- "Många små rör. En gemensam sanning."
-- ========================================

-- LAYER 1: Source Connectors
CREATE TABLE IF NOT EXISTS public.ingest_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  base_url TEXT,
  auth_type TEXT,
  auth_config JSONB DEFAULT '{}',
  schedule_type TEXT NOT NULL DEFAULT 'daily',
  schedule_cron TEXT,
  timezone TEXT DEFAULT 'UTC',
  countries_covered TEXT[],
  geographic_coverage TEXT NOT NULL DEFAULT 'global',
  is_active BOOLEAN DEFAULT true,
  last_fetch_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  consecutive_failures INTEGER DEFAULT 0,
  license_type TEXT,
  license_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- LAYER 2: Schema & Versioning
CREATE TABLE IF NOT EXISTS public.ingest_schemas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_code TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_current BOOLEAN DEFAULT true,
  schema_definition JSONB NOT NULL,
  detected_fields TEXT[],
  field_types JSONB,
  breaking_changes JSONB,
  change_type TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  superseded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(source_code, version)
);

-- LAYER 3: Semantic Mapping
CREATE TABLE IF NOT EXISTS public.ingest_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_code TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  source_field_path TEXT NOT NULL,
  source_field_name TEXT,
  source_unit TEXT,
  target_kpi_code TEXT NOT NULL,
  target_unit TEXT,
  transformation_type TEXT NOT NULL DEFAULT 'direct',
  transformation_formula TEXT,
  scale_factor NUMERIC DEFAULT 1,
  geo_field_path TEXT,
  geo_level TEXT,
  geo_code_format TEXT,
  time_field_path TEXT,
  time_format TEXT,
  mapping_confidence NUMERIC DEFAULT 0.9,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_code, source_field_path, target_kpi_code)
);

-- LAYER 4: Pipeline Runs
CREATE TABLE IF NOT EXISTS public.ingest_pipeline_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_code TEXT NOT NULL,
  fetch_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  layer_1_status TEXT DEFAULT 'pending',
  layer_1_completed_at TIMESTAMP WITH TIME ZONE,
  layer_2_status TEXT DEFAULT 'pending',
  layer_2_completed_at TIMESTAMP WITH TIME ZONE,
  layer_3_status TEXT DEFAULT 'pending',
  layer_3_completed_at TIMESTAMP WITH TIME ZONE,
  layer_4_status TEXT DEFAULT 'pending',
  layer_4_completed_at TIMESTAMP WITH TIME ZONE,
  records_fetched INTEGER DEFAULT 0,
  records_validated INTEGER DEFAULT 0,
  records_mapped INTEGER DEFAULT 0,
  records_aggregated INTEGER DEFAULT 0,
  validation_errors INTEGER DEFAULT 0,
  mapping_errors INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  error_message TEXT,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0
);

-- Validation rules
CREATE TABLE IF NOT EXISTS public.ingest_validation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_code TEXT,
  kpi_code TEXT,
  rule_type TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  rule_config JSONB NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Central concept library
CREATE TABLE IF NOT EXISTS public.semantic_concepts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  definition TEXT,
  calculation_method TEXT,
  standard_unit TEXT,
  standard_precision INTEGER,
  parent_code TEXT,
  related_codes TEXT[],
  source_standards TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ingest_sources_active ON ingest_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_ingest_runs_source ON ingest_pipeline_runs(source_code);
CREATE INDEX IF NOT EXISTS idx_ingest_runs_status ON ingest_pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_semantic_concepts_category ON semantic_concepts(category);

-- Enable RLS
ALTER TABLE ingest_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_concepts ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Ingest sources publicly readable" ON ingest_sources FOR SELECT USING (true);
CREATE POLICY "Ingest schemas publicly readable" ON ingest_schemas FOR SELECT USING (true);
CREATE POLICY "Ingest mappings publicly readable" ON ingest_mappings FOR SELECT USING (true);
CREATE POLICY "Ingest runs publicly readable" ON ingest_pipeline_runs FOR SELECT USING (true);
CREATE POLICY "Validation rules publicly readable" ON ingest_validation_rules FOR SELECT USING (true);
CREATE POLICY "Semantic concepts publicly readable" ON semantic_concepts FOR SELECT USING (true);

-- Insert core concepts
INSERT INTO semantic_concepts (code, name, category, definition) VALUES
('gdp_per_capita', 'GDP per Capita', 'kpi', 'Gross Domestic Product divided by population'),
('employment_rate', 'Employment Rate', 'kpi', 'Percentage of working-age population employed'),
('life_expectancy', 'Life Expectancy', 'kpi', 'Average years a newborn is expected to live'),
('unemployment_rate', 'Unemployment Rate', 'kpi', 'Percentage of labor force that is unemployed'),
('country', 'Country', 'geo_level', 'Sovereign nation or territory'),
('nuts2', 'NUTS 2', 'geo_level', 'Basic regions for regional policies'),
('year', 'Year', 'time_period', 'Calendar year')
ON CONFLICT (code) DO NOTHING;

-- Insert global data sources
INSERT INTO ingest_sources (code, name, source_type, base_url, schedule_type, geographic_coverage) VALUES
('WORLD_BANK_WDI', 'World Bank - World Development Indicators', 'api', 'https://api.worldbank.org/v2', 'weekly', 'global'),
('WHO_GHO', 'WHO Global Health Observatory', 'api', 'https://ghoapi.azureedge.net/api', 'weekly', 'global'),
('IMF_WEO', 'IMF World Economic Outlook', 'api', 'https://dataservices.imf.org', 'quarterly', 'global'),
('EUROSTAT', 'Eurostat', 'api', 'https://ec.europa.eu/eurostat/api', 'monthly', 'regional'),
('OECD_STATS', 'OECD Statistics', 'api', 'https://stats.oecd.org/SDMX-JSON', 'monthly', 'regional'),
('UN_DATA', 'UN Data', 'api', 'https://data.un.org/ws', 'monthly', 'global'),
('ILO_STAT', 'ILO Statistics', 'api', 'https://ilostat.ilo.org/api', 'monthly', 'global')
ON CONFLICT (code) DO NOTHING;