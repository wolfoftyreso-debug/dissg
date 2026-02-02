-- =====================================================
-- HEALTH & SUBSTANCE REALITY LAYER - DATABASE SCHEMA
-- Epidemiological reference layer - NO medical advice
-- =====================================================

-- Health indicators (global standard measures)
CREATE TABLE public.health_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_local JSONB DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  unit TEXT NOT NULL,
  description TEXT,
  definition_source TEXT,
  icd_codes TEXT[],
  atc_codes TEXT[],
  is_inverted BOOLEAN DEFAULT false,
  aggregation_method TEXT DEFAULT 'sum',
  normalization_method TEXT,
  data_quality_notes TEXT,
  typical_lag_months INTEGER DEFAULT 12,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Health indicator values (population-level data)
CREATE TABLE public.health_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_id UUID NOT NULL REFERENCES public.health_indicators(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  region_code TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  value NUMERIC NOT NULL,
  value_male NUMERIC,
  value_female NUMERIC,
  age_group TEXT,
  confidence NUMERIC DEFAULT 80,
  is_estimated BOOLEAN DEFAULT false,
  estimation_method TEXT,
  data_source_code TEXT NOT NULL,
  source_indicator_code TEXT,
  source_url TEXT,
  flags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(indicator_id, country_code, region_code, period_start, period_end, age_group)
);

-- Substance profiles (unified model for all substances)
CREATE TABLE public.substance_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_local JSONB DEFAULT '{}',
  chemical_class TEXT,
  pharmacological_category TEXT,
  description TEXT,
  who_classification TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Substance legal status per country/period
CREATE TABLE public.substance_legal_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  substance_id UUID NOT NULL REFERENCES public.substance_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL,
  schedule TEXT,
  effective_from DATE NOT NULL,
  effective_to DATE,
  source_document TEXT,
  source_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Substance data (prevalence, mortality, etc.)
CREATE TABLE public.substance_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  substance_id UUID NOT NULL REFERENCES public.substance_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  region_code TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  measure_type TEXT NOT NULL,
  age_group TEXT DEFAULT 'all',
  value NUMERIC NOT NULL,
  value_male NUMERIC,
  value_female NUMERIC,
  unit TEXT NOT NULL,
  confidence NUMERIC DEFAULT 80,
  is_estimated BOOLEAN DEFAULT false,
  data_source_code TEXT NOT NULL,
  source_url TEXT,
  methodology_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(substance_id, country_code, region_code, period_start, period_end, measure_type, age_group)
);

-- Policy periods (for overlay visualization)
CREATE TABLE public.health_policy_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_local JSONB DEFAULT '{}',
  category TEXT NOT NULL,
  country_code TEXT NOT NULL,
  region_code TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  key_changes TEXT[],
  source_documents TEXT[],
  source_urls TEXT[],
  affected_indicators TEXT[],
  affected_substances TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disease burden data (DALYs, YLL, YLD)
CREATE TABLE public.disease_burden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  region_code TEXT,
  period_year INTEGER NOT NULL,
  cause_code TEXT NOT NULL,
  cause_name TEXT NOT NULL,
  cause_level INTEGER DEFAULT 1,
  parent_cause_code TEXT,
  dalys NUMERIC,
  dalys_per_100k NUMERIC,
  yll NUMERIC,
  yll_per_100k NUMERIC,
  yld NUMERIC,
  yld_per_100k NUMERIC,
  deaths NUMERIC,
  deaths_per_100k NUMERIC,
  prevalence NUMERIC,
  prevalence_per_100k NUMERIC,
  incidence NUMERIC,
  incidence_per_100k NUMERIC,
  age_group TEXT DEFAULT 'all',
  sex TEXT DEFAULT 'both',
  confidence_lower NUMERIC,
  confidence_upper NUMERIC,
  data_source_code TEXT NOT NULL DEFAULT 'GBD',
  gbd_study_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, period_year, cause_code, age_group, sex)
);

-- Healthcare capacity data
CREATE TABLE public.healthcare_capacity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  region_code TEXT,
  period_year INTEGER NOT NULL,
  physicians_per_10k NUMERIC,
  nurses_per_10k NUMERIC,
  hospital_beds_per_10k NUMERIC,
  psychiatric_beds_per_10k NUMERIC,
  health_expenditure_pct_gdp NUMERIC,
  health_expenditure_per_capita_usd NUMERIC,
  out_of_pocket_pct NUMERIC,
  universal_coverage_index NUMERIC,
  data_source_code TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, period_year)
);

-- Life expectancy data
CREATE TABLE public.life_expectancy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  region_code TEXT,
  period_year INTEGER NOT NULL,
  life_expectancy_total NUMERIC NOT NULL,
  life_expectancy_male NUMERIC,
  life_expectancy_female NUMERIC,
  healthy_life_expectancy_total NUMERIC,
  healthy_life_expectancy_male NUMERIC,
  healthy_life_expectancy_female NUMERIC,
  infant_mortality_per_1k NUMERIC,
  under5_mortality_per_1k NUMERIC,
  maternal_mortality_per_100k NUMERIC,
  data_source_code TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, period_year)
);

-- Historical analogues for scenario exploration
CREATE TABLE public.health_scenario_analogues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_country_code TEXT NOT NULL,
  base_period_start DATE NOT NULL,
  base_period_end DATE NOT NULL,
  key_characteristics JSONB,
  observed_outcomes JSONB,
  relevant_indicators TEXT[],
  relevant_substances TEXT[],
  uncertainty_factors TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_health_values_indicator ON public.health_values(indicator_id);
CREATE INDEX idx_health_values_country ON public.health_values(country_code);
CREATE INDEX idx_health_values_period ON public.health_values(period_start, period_end);
CREATE INDEX idx_substance_data_substance ON public.substance_data(substance_id);
CREATE INDEX idx_substance_data_country ON public.substance_data(country_code);
CREATE INDEX idx_disease_burden_country_year ON public.disease_burden(country_code, period_year);
CREATE INDEX idx_disease_burden_cause ON public.disease_burden(cause_code);
CREATE INDEX idx_life_expectancy_country_year ON public.life_expectancy(country_code, period_year);
CREATE INDEX idx_healthcare_capacity_country_year ON public.healthcare_capacity(country_code, period_year);
CREATE INDEX idx_health_policy_country ON public.health_policy_periods(country_code);

-- Enable RLS
ALTER TABLE public.health_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substance_legal_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_policy_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_burden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_expectancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scenario_analogues ENABLE ROW LEVEL SECURITY;

-- Public read access for all health data (epidemiological reference)
CREATE POLICY "Public read access for health indicators"
  ON public.health_indicators FOR SELECT USING (true);

CREATE POLICY "Public read access for health values"
  ON public.health_values FOR SELECT USING (true);

CREATE POLICY "Public read access for substance profiles"
  ON public.substance_profiles FOR SELECT USING (true);

CREATE POLICY "Public read access for substance legal status"
  ON public.substance_legal_status FOR SELECT USING (true);

CREATE POLICY "Public read access for substance data"
  ON public.substance_data FOR SELECT USING (true);

CREATE POLICY "Public read access for health policy periods"
  ON public.health_policy_periods FOR SELECT USING (true);

CREATE POLICY "Public read access for disease burden"
  ON public.disease_burden FOR SELECT USING (true);

CREATE POLICY "Public read access for healthcare capacity"
  ON public.healthcare_capacity FOR SELECT USING (true);

CREATE POLICY "Public read access for life expectancy"
  ON public.life_expectancy FOR SELECT USING (true);

CREATE POLICY "Public read access for health scenario analogues"
  ON public.health_scenario_analogues FOR SELECT USING (true);

-- Researcher/Admin write access
CREATE POLICY "Researcher write access for health indicators"
  ON public.health_indicators FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for health values"
  ON public.health_values FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for substance profiles"
  ON public.substance_profiles FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for substance legal status"
  ON public.substance_legal_status FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for substance data"
  ON public.substance_data FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for health policy periods"
  ON public.health_policy_periods FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for disease burden"
  ON public.disease_burden FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for healthcare capacity"
  ON public.healthcare_capacity FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for life expectancy"
  ON public.life_expectancy FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

CREATE POLICY "Researcher write access for health scenario analogues"
  ON public.health_scenario_analogues FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin']::app_role[]));

-- Add updated_at triggers
CREATE TRIGGER update_health_indicators_updated_at
  BEFORE UPDATE ON public.health_indicators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_values_updated_at
  BEFORE UPDATE ON public.health_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_substance_profiles_updated_at
  BEFORE UPDATE ON public.substance_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_policy_periods_updated_at
  BEFORE UPDATE ON public.health_policy_periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();