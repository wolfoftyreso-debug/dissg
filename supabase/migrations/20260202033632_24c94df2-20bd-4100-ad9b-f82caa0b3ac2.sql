-- =====================================================
-- GLOBAL EXPANSION SYSTEM
-- EU → OECD → Globalt (lager för lager)
-- =====================================================

-- Data depth level enum
CREATE TYPE data_depth_level AS ENUM ('global_baseline', 'regional_bloc', 'national_deep');

-- Comparability level enum
CREATE TYPE comparability_level AS ENUM ('full', 'partial', 'limited', 'none');

-- =====================================================
-- 1. COUNTRIES & REGIONS
-- =====================================================
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  code_alpha3 TEXT UNIQUE,
  name TEXT NOT NULL,
  name_local TEXT,
  region TEXT NOT NULL,
  subregion TEXT,
  bloc TEXT,
  data_depth data_depth_level NOT NULL DEFAULT 'global_baseline',
  data_quality_score NUMERIC DEFAULT 50,
  last_data_update TIMESTAMPTZ,
  population BIGINT,
  gdp_per_capita NUMERIC,
  has_regional_data BOOLEAN NOT NULL DEFAULT false,
  has_municipal_data BOOLEAN NOT NULL DEFAULT false,
  has_responsibility_model BOOLEAN NOT NULL DEFAULT false,
  has_politician_profiles BOOLEAN NOT NULL DEFAULT false,
  has_feeds_enabled BOOLEAN NOT NULL DEFAULT false,
  has_simulation BOOLEAN NOT NULL DEFAULT false,
  currency_code TEXT,
  timezone TEXT,
  languages TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Countries are publicly readable" ON public.countries FOR SELECT USING (true);
CREATE INDEX idx_countries_bloc ON public.countries(bloc);
CREATE INDEX idx_countries_region ON public.countries(region);
CREATE INDEX idx_countries_depth ON public.countries(data_depth);

-- =====================================================
-- 2. REGIONAL SUBDIVISIONS (NUTS-style)
-- =====================================================
CREATE TABLE public.regional_subdivisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  code TEXT NOT NULL,
  level INTEGER NOT NULL,
  parent_code TEXT,
  name TEXT NOT NULL,
  name_local TEXT,
  population BIGINT,
  area_km2 NUMERIC,
  data_quality_score NUMERIC DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, code)
);

ALTER TABLE public.regional_subdivisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regional subdivisions are publicly readable" ON public.regional_subdivisions FOR SELECT USING (true);
CREATE INDEX idx_regional_subdivisions_country ON public.regional_subdivisions(country_code);
CREATE INDEX idx_regional_subdivisions_level ON public.regional_subdivisions(level);

-- =====================================================
-- 3. GLOBAL MASTER INDEX CONFIGURATION
-- =====================================================
CREATE TABLE public.global_master_index_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  normalization_method TEXT NOT NULL DEFAULT 'minmax',
  missing_data_handling TEXT NOT NULL DEFAULT 'exclude',
  is_active BOOLEAN NOT NULL DEFAULT false,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.global_master_index_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GMI config is publicly readable" ON public.global_master_index_config FOR SELECT USING (true);

-- =====================================================
-- 4. COUNTRY WEIGHT OVERRIDES
-- =====================================================
CREATE TABLE public.country_gmi_weights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  gmi_version TEXT NOT NULL REFERENCES public.global_master_index_config(version),
  weight_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  override_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, gmi_version)
);

ALTER TABLE public.country_gmi_weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Country weights are publicly readable" ON public.country_gmi_weights FOR SELECT USING (true);

-- =====================================================
-- 5. GLOBAL KPI VALUES
-- =====================================================
CREATE TABLE public.global_kpi_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES public.countries(code),
  region_code TEXT,
  kpi_code TEXT NOT NULL,
  gmi_component TEXT,
  value NUMERIC NOT NULL,
  value_normalized NUMERIC,
  unit TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  granularity TEXT NOT NULL DEFAULT 'annual',
  data_quality data_depth_level NOT NULL DEFAULT 'global_baseline',
  confidence NUMERIC NOT NULL DEFAULT 0.5,
  uncertainty_range NUMERIC,
  is_estimated BOOLEAN NOT NULL DEFAULT false,
  estimation_method TEXT,
  data_source_code TEXT NOT NULL,
  source_indicator_code TEXT,
  source_url TEXT,
  previous_value NUMERIC,
  trend trend_direction,
  trend_percent NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, kpi_code, period_start, period_end)
);

ALTER TABLE public.global_kpi_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Global KPI values are publicly readable" ON public.global_kpi_values FOR SELECT USING (true);
CREATE INDEX idx_global_kpi_country ON public.global_kpi_values(country_code);
CREATE INDEX idx_global_kpi_code ON public.global_kpi_values(kpi_code);
CREATE INDEX idx_global_kpi_period ON public.global_kpi_values(period_start, period_end);

-- =====================================================
-- 6. GLOBAL MASTER INDEX VALUES
-- =====================================================
CREATE TABLE public.global_master_index_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES public.countries(code),
  region_code TEXT,
  gmi_version TEXT NOT NULL REFERENCES public.global_master_index_config(version),
  value NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  component_values JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_completeness NUMERIC NOT NULL DEFAULT 100,
  average_confidence NUMERIC,
  data_gaps TEXT[],
  previous_value NUMERIC,
  trend trend_direction,
  trend_percent NUMERIC,
  global_rank INTEGER,
  regional_rank INTEGER,
  bloc_rank INTEGER,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, gmi_version, period_start, period_end)
);

ALTER TABLE public.global_master_index_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GMI values are publicly readable" ON public.global_master_index_values FOR SELECT USING (true);
CREATE INDEX idx_gmi_values_country ON public.global_master_index_values(country_code);
CREATE INDEX idx_gmi_values_period ON public.global_master_index_values(period_start);

-- =====================================================
-- 7. COUNTRY COMPARABILITY MATRIX
-- =====================================================
CREATE TABLE public.country_comparability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_a TEXT NOT NULL REFERENCES public.countries(code),
  country_b TEXT NOT NULL REFERENCES public.countries(code),
  kpi_code TEXT,
  level comparability_level NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0.5,
  comparability_notes TEXT,
  limitations TEXT[],
  methodology_match NUMERIC,
  definition_match NUMERIC,
  coverage_match NUMERIC,
  last_assessed TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (country_a < country_b),
  UNIQUE(country_a, country_b, kpi_code)
);

ALTER TABLE public.country_comparability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comparability is publicly readable" ON public.country_comparability FOR SELECT USING (true);
CREATE INDEX idx_comparability_countries ON public.country_comparability(country_a, country_b);

-- =====================================================
-- 8. GLOBAL DATA SOURCES
-- =====================================================
CREATE TABLE public.global_data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  data_depth data_depth_level NOT NULL,
  geographic_coverage TEXT NOT NULL,
  countries_covered TEXT[],
  api_base_url TEXT,
  api_documentation_url TEXT,
  requires_auth BOOLEAN NOT NULL DEFAULT false,
  reliability_score NUMERIC NOT NULL DEFAULT 80,
  update_frequency update_frequency NOT NULL,
  typical_lag_days INTEGER,
  indicator_count INTEGER,
  indicator_catalog_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_successful_fetch TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.global_data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Global data sources are publicly readable" ON public.global_data_sources FOR SELECT USING (true);

-- =====================================================
-- 9. KPI CODE MAPPINGS
-- =====================================================
CREATE TABLE public.global_kpi_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  internal_kpi_code TEXT NOT NULL,
  internal_kpi_name TEXT NOT NULL,
  gmi_component TEXT,
  source_code TEXT NOT NULL REFERENCES public.global_data_sources(code),
  source_indicator_code TEXT NOT NULL,
  source_indicator_name TEXT,
  transformation TEXT,
  transformation_formula TEXT,
  unit_conversion NUMERIC DEFAULT 1.0,
  mapping_confidence NUMERIC NOT NULL DEFAULT 0.9,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internal_kpi_code, source_code)
);

ALTER TABLE public.global_kpi_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "KPI mappings are publicly readable" ON public.global_kpi_mappings FOR SELECT USING (true);

-- =====================================================
-- INSERT INITIAL DATA
-- =====================================================

-- Global Master Index v1
INSERT INTO public.global_master_index_config (version, components, default_weights, is_active) VALUES (
  'v1.0',
  '[
    {"id": "health", "name": "Hälsa", "description": "Livslängd, dödlighet, sjukvård"},
    {"id": "workforce", "name": "Arbetsförmåga", "description": "Sysselsättning, produktivitet"},
    {"id": "economy", "name": "Ekonomisk bärkraft", "description": "BNP, skuld, hållbarhet"},
    {"id": "education", "name": "Utbildning", "description": "Kompetens, PISA, utbildningsnivå"},
    {"id": "stability", "name": "Social stabilitet", "description": "Brottslighet, integration, tillit"}
  ]'::jsonb,
  '{"health": 0.20, "workforce": 0.25, "economy": 0.20, "education": 0.15, "stability": 0.20}'::jsonb,
  true
);

-- Global data sources (using valid enum values)
INSERT INTO public.global_data_sources (code, name, data_depth, geographic_coverage, api_base_url, reliability_score, update_frequency) VALUES
('worldbank', 'World Bank Open Data', 'global_baseline', 'global', 'https://api.worldbank.org/v2', 95, 'quarterly'),
('who', 'World Health Organization', 'global_baseline', 'global', 'https://ghoapi.azureedge.net/api', 90, 'yearly'),
('imf', 'International Monetary Fund', 'global_baseline', 'global', 'https://www.imf.org/external/datamapper/api', 95, 'quarterly'),
('undp', 'UN Development Programme', 'global_baseline', 'global', 'https://hdr.undp.org/api', 90, 'yearly'),
('oecd', 'OECD Statistics', 'regional_bloc', 'oecd', 'https://stats.oecd.org/restsdmx/sdmx.ashx', 95, 'quarterly'),
('eurostat', 'Eurostat', 'regional_bloc', 'eu', 'https://ec.europa.eu/eurostat/api/dissemination', 95, 'monthly'),
('ecb', 'European Central Bank', 'regional_bloc', 'eu', 'https://sdw-wsrest.ecb.europa.eu/service', 95, 'monthly'),
('scb', 'Statistics Sweden', 'national_deep', 'national', 'https://api.scb.se/OV0104/v1/doris/sv/ssd', 98, 'monthly'),
('destatis', 'Statistisches Bundesamt', 'national_deep', 'national', 'https://www-genesis.destatis.de/genesisWS/rest/2020', 95, 'monthly'),
('cbs', 'Statistics Netherlands', 'national_deep', 'national', 'https://opendata.cbs.nl/ODataApi/odata', 95, 'monthly');

-- Sample countries
INSERT INTO public.countries (code, code_alpha3, name, name_local, region, subregion, bloc, data_depth, has_regional_data, has_municipal_data, has_responsibility_model, has_politician_profiles, has_feeds_enabled, has_simulation, population, gdp_per_capita) VALUES
('SE', 'SWE', 'Sweden', 'Sverige', 'europe', 'nordic', 'eu', 'national_deep', true, true, true, true, true, true, 10400000, 55000),
('NO', 'NOR', 'Norway', 'Norge', 'europe', 'nordic', 'oecd', 'regional_bloc', true, true, false, false, false, false, 5400000, 67000),
('DK', 'DNK', 'Denmark', 'Danmark', 'europe', 'nordic', 'eu', 'regional_bloc', true, true, false, false, false, false, 5800000, 60000),
('FI', 'FIN', 'Finland', 'Suomi', 'europe', 'nordic', 'eu', 'regional_bloc', true, true, false, false, false, false, 5500000, 48000),
('DE', 'DEU', 'Germany', 'Deutschland', 'europe', 'western_europe', 'eu', 'national_deep', true, true, true, true, true, true, 83000000, 46000),
('NL', 'NLD', 'Netherlands', 'Nederland', 'europe', 'western_europe', 'eu', 'national_deep', true, true, true, false, true, true, 17400000, 52000),
('BE', 'BEL', 'Belgium', 'België', 'europe', 'western_europe', 'eu', 'regional_bloc', true, false, false, false, false, false, 11500000, 46000),
('FR', 'FRA', 'France', 'France', 'europe', 'western_europe', 'eu', 'regional_bloc', true, true, false, false, false, false, 67000000, 42000),
('GB', 'GBR', 'United Kingdom', 'United Kingdom', 'europe', 'western_europe', 'oecd', 'regional_bloc', true, true, true, false, false, false, 67000000, 42000),
('ES', 'ESP', 'Spain', 'España', 'europe', 'southern_europe', 'eu', 'regional_bloc', true, true, false, false, false, false, 47000000, 30000),
('IT', 'ITA', 'Italy', 'Italia', 'europe', 'southern_europe', 'eu', 'regional_bloc', true, true, false, false, false, false, 60000000, 34000),
('PT', 'PRT', 'Portugal', 'Portugal', 'europe', 'southern_europe', 'eu', 'regional_bloc', true, false, false, false, false, false, 10300000, 24000),
('PL', 'POL', 'Poland', 'Polska', 'europe', 'eastern_europe', 'eu', 'regional_bloc', true, true, false, false, false, false, 38000000, 17000),
('CZ', 'CZE', 'Czech Republic', 'Česko', 'europe', 'eastern_europe', 'eu', 'regional_bloc', true, false, false, false, false, false, 10700000, 24000),
('US', 'USA', 'United States', 'United States', 'north_america', 'north_america', 'oecd', 'regional_bloc', true, true, false, false, false, false, 330000000, 65000),
('CA', 'CAN', 'Canada', 'Canada', 'north_america', 'north_america', 'oecd', 'national_deep', true, true, true, false, true, true, 38000000, 48000),
('JP', 'JPN', 'Japan', '日本', 'asia_pacific', 'east_asia', 'oecd', 'national_deep', true, true, true, false, true, true, 126000000, 40000),
('AU', 'AUS', 'Australia', 'Australia', 'asia_pacific', 'oceania', 'oecd', 'national_deep', true, true, true, false, true, true, 26000000, 55000),
('KR', 'KOR', 'South Korea', '대한민국', 'asia_pacific', 'east_asia', 'oecd', 'regional_bloc', true, true, false, false, false, false, 52000000, 32000),
('NZ', 'NZL', 'New Zealand', 'New Zealand', 'asia_pacific', 'oceania', 'oecd', 'regional_bloc', true, false, false, false, false, false, 5000000, 42000),
('CN', 'CHN', 'China', '中国', 'asia_pacific', 'east_asia', NULL, 'global_baseline', false, false, false, false, false, false, 1400000000, 12000),
('IN', 'IND', 'India', 'भारत', 'asia_pacific', 'south_asia', NULL, 'global_baseline', false, false, false, false, false, false, 1400000000, 2200),
('BR', 'BRA', 'Brazil', 'Brasil', 'south_america', 'south_america', NULL, 'global_baseline', false, false, false, false, false, false, 214000000, 9000),
('MX', 'MEX', 'Mexico', 'México', 'north_america', 'central_america', 'oecd', 'regional_bloc', true, false, false, false, false, false, 130000000, 10000);

-- Comparability matrix
INSERT INTO public.country_comparability (country_a, country_b, kpi_code, level, score, comparability_notes) VALUES
('DE', 'SE', NULL, 'full', 0.95, 'Båda EU-länder med harmoniserad statistik'),
('BR', 'SE', NULL, 'partial', 0.65, 'Olika datakvalitet och definitioner'),
('CN', 'SE', NULL, 'limited', 0.40, 'Begränsad tillgång till mikrodata'),
('NO', 'SE', NULL, 'full', 0.98, 'Nordisk harmonisering'),
('GB', 'SE', NULL, 'full', 0.90, 'Post-Brexit fortfarande hög jämförbarhet'),
('JP', 'SE', NULL, 'full', 0.85, 'OECD-harmonisering'),
('AU', 'CA', NULL, 'full', 0.92, 'Liknande statistiksystem'),
('SE', 'US', NULL, 'partial', 0.70, 'Olika definitioner på vissa områden');

-- Triggers
CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_global_kpi_values_updated_at
  BEFORE UPDATE ON public.global_kpi_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_global_data_sources_updated_at
  BEFORE UPDATE ON public.global_data_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();